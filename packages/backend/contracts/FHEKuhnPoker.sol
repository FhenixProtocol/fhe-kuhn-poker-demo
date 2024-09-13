// SPDX-License-Identifier: MIT

pragma solidity >=0.8.13 <0.9.0;

import { euint8, FHE } from "@fhenixprotocol/contracts/FHE.sol";
import { Permissioned, Permission } from "@fhenixprotocol/contracts/access/Permissioned.sol";
import { SealedUint, TypedBindingsEuint8 } from "./FHETypedSealed.sol";
import { EnumerableSet } from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

// Kuhn Poker (https://en.wikipedia.org/wiki/Kuhn_poker) on Fhenix
// Powered and secured by FHE

enum Action {
	EMPTY,
	CHECK,
	BET,
	FOLD,
	CALL
}

enum Outcome {
	EMPTY,
	SHOWDOWN,
	FOLD,
	TIMEOUT,
	CANCEL,
	RESIGN
}

struct Game {
	uint256 gid;
	bool isRematch;
	address playerA;
	address playerB;
	GameState state;
	GameOutcome outcome;
}
struct GameState {
	bool accepted;
	euint8 eCardA;
	euint8 eCardB;
	//
	uint8 pot;
	address activePlayer;
	uint64 timeout;
	//
	Action action1;
	Action action2;
	Action action3;
}
struct GameOutcome {
	uint256 gid;
	uint8 cardA;
	uint8 cardB;
	address winner;
	Outcome outcome;
	uint256 rematchGid;
}

contract FHEKuhnPoker is Permissioned {
	using EnumerableSet for EnumerableSet.UintSet;
	using TypedBindingsEuint8 for euint8;

	uint256 public gid = 0;
	uint64 public timeoutDuration = 120;

	euint8 private euint3 = FHE.asEuint8(3);
	euint8 private euint2 = FHE.asEuint8(2);
	euint8 private euint1 = FHE.asEuint8(1);

	mapping(address => uint256) public chips;
	mapping(uint256 => Game) public games;
	mapping(address => uint256) public userActiveGame;
	mapping(address => EnumerableSet.UintSet) private userGames;
	mapping(address => mapping(address => EnumerableSet.UintSet))
		private pairGames;
	uint256 public openGameId = 0;

	constructor() {}

	event PlayerDealtIn(address indexed user, uint256 chips);
	event GameCreated(address indexed playerA, uint256 indexed gid);
	event GameCancelled(address indexed player, uint256 indexed gid);
	event RematchCreated(address indexed playerA, uint256 indexed gid);
	event GameJoined(address indexed playerB, uint256 indexed gid);
	event RematchAccepted(address indexed playerB, uint256 indexed gid);
	event PerformedGameAction(
		address indexed player,
		uint256 indexed gid,
		Action action
	);
	event ChipTaken(address indexed player, uint256 indexed gid);
	event WonByShowdown(
		address indexed winner,
		uint256 indexed gid,
		uint256 pot
	);
	event WonByFold(address indexed winner, uint256 indexed gid, uint256 pot);
	event WonByTimeout(
		address indexed winner,
		uint256 indexed gid,
		uint256 pot
	);
	event WonByResignation(
		address indexed winner,
		uint256 indexed gid,
		uint256 pot
	);

	error InvalidGame();
	error NotEnoughChips();
	error InvalidPlayerB();
	error GameNotStarted();
	error GameEnded();
	error OpponentHasLeft();
	error RematchCancelled();
	error NotPlayerInGame();
	error InvalidAction();
	error NotYourTurn();
	error AlreadyRequestedRematch();
	error AlreadyAcceptedRematch();
	error OpponentStillHasTime();
	error ItsYourTurn();

	// MODIFIERS

	modifier validGame(uint256 _gid) {
		if (_gid > gid) revert InvalidGame();
		_;
	}
	modifier validPlayer(uint256 _gid) {
		if (
			msg.sender != games[_gid].playerA &&
			msg.sender != games[_gid].playerB
		) revert NotPlayerInGame();
		_;
	}

	// CHIP

	function dealMeIn(uint256 chipCount) public {
		chips[msg.sender] += chipCount;
		emit PlayerDealtIn(msg.sender, chipCount);
	}

	// GAME MANAGEMENT

	function findGame() public {
		_cancelRematchRequestIfOpen(userActiveGame[msg.sender]);
		_resignGameIfActive(userActiveGame[msg.sender]);

		if (openGameId == 0) {
			_createOpenGame();
		} else {
			_joinOpenGame(openGameId);
		}
	}

	function rematch(uint256 _gid) public validGame(_gid) validPlayer(_gid) {
		Game storage game = games[_gid];

		address opponent = msg.sender == game.playerA
			? game.playerB
			: game.playerA;

		// Create a rematch if it doesn't exist
		if (game.outcome.rematchGid == 0) {
			// Revert if opponent has already started a new game
			if (userActiveGame[opponent] != _gid) revert OpponentHasLeft();

			game.outcome.rematchGid = _createRematch(opponent);
			return;
		}

		Game memory rematchGame = games[game.outcome.rematchGid];

		if (msg.sender == rematchGame.playerA) revert AlreadyRequestedRematch();
		if (rematchGame.state.accepted) revert AlreadyAcceptedRematch();

		if (rematchGame.outcome.outcome == Outcome.CANCEL)
			revert RematchCancelled();

		_acceptRematch(game.outcome.rematchGid);
	}

	function exitGame(uint256 _gid) public validGame(_gid) validPlayer(_gid) {
		Game storage game = games[_gid];

		if (game.outcome.outcome != Outcome.EMPTY) revert GameEnded();

		if (game.state.activePlayer == msg.sender) revert ItsYourTurn();

		// Win by timeout
		if (game.state.accepted) {
			if (block.timestamp < game.state.timeout)
				revert OpponentStillHasTime();

			game.outcome.outcome = Outcome.TIMEOUT;
			game.outcome.winner = msg.sender;
			chips[game.outcome.winner] += game.state.pot;

			emit WonByTimeout(game.outcome.winner, game.gid, game.state.pot);
			return;
		}

		// Cancelling game

		// Only player A can cancel a rematch that hasn't been accepted
		if (game.isRematch && msg.sender != game.playerA)
			revert NotPlayerInGame();

		_cancelGame(_gid);
	}

	function resign(uint256 _gid) public validGame(_gid) validPlayer(_gid) {
		if (games[_gid].outcome.outcome != Outcome.EMPTY) revert GameEnded();
		if (!games[_gid].state.accepted) revert GameNotStarted();

		_resign(_gid);
	}

	function _resignGameIfActive(uint256 _gid) internal {
		if (_gid == 0) return;
		if (!games[_gid].state.accepted) return;
		if (games[_gid].outcome.outcome != Outcome.EMPTY) return;

		// Game is active, resign from it
		_resign(_gid);
	}

	function _resign(uint256 _gid) internal {
		Game storage game = games[_gid];

		game.outcome.outcome = Outcome.RESIGN;
		game.outcome.winner = game.playerA == msg.sender
			? game.playerB
			: game.playerA;
		chips[game.outcome.winner] += game.state.pot;

		emit WonByResignation(game.outcome.winner, game.gid, game.state.pot);
	}

	function _createOpenGame() internal returns (uint256 _gid) {
		_gid = _createGameInner();

		// Add game to user's games
		// Mark this game as the open game
		userGames[msg.sender].add(_gid);
		openGameId = _gid;
		userActiveGame[msg.sender] = _gid;

		emit GameCreated(msg.sender, _gid);
	}

	function _createRematch(address playerB) internal returns (uint256 _gid) {
		_gid = _createGameInner();

		// Rematches already know both players
		games[_gid].isRematch = true;
		games[_gid].playerB = playerB;
		userActiveGame[msg.sender] = _gid;

		emit RematchCreated(msg.sender, _gid);
	}

	function _createGameInner() internal returns (uint256) {
		gid += 1;

		Game storage game = games[gid];
		game.gid = gid;
		game.playerA = msg.sender;

		// Take ante from player
		_takeChip(game);

		return game.gid;
	}

	function _joinOpenGame(uint256 _gid) internal {
		if (games[_gid].playerA == msg.sender) revert InvalidPlayerB();
		_joinGameInner(_gid);

		// Add to user games
		// Remove as open game
		userGames[msg.sender].add(_gid);
		openGameId = 0;
		userActiveGame[msg.sender] = _gid;
		_addGameToPair(_gid);

		emit GameJoined(msg.sender, _gid);
	}

	function _acceptRematch(uint256 _gid) internal {
		_joinGameInner(_gid);

		// Add game to both users (not done during create step for rematches)
		userGames[games[_gid].playerA].add(_gid);
		userGames[games[_gid].playerB].add(_gid);
		userActiveGame[msg.sender] = _gid;
		_addGameToPair(_gid);

		emit RematchAccepted(msg.sender, _gid);
	}

	function _joinGameInner(uint256 _gid) internal {
		Game storage game = games[_gid];

		// Take ante from player
		_takeChip(game);

		// Start game
		game.state.accepted = true;
		game.playerB = msg.sender;
		game.state.timeout = uint64(block.timestamp) + timeoutDuration;

		// Random value between 0 and 1
		// FHE randomness is leveraged, but it does not need to remain encrypted
		uint8 startingPlayer = FHE.decrypt(FHE.randomEuint8()) % 2;
		game.state.activePlayer = startingPlayer == 0
			? game.playerA
			: game.playerB;

		// Random card selection:
		// 1. A random number is generated
		// 2. playerA card is `rand % 3` (0 = J, 1 = Q, 2 = K)
		// 3. A random offset between 1 and 2 is generated
		// 4. The offset is added to `rand`
		// 5. playerB card is `rand+offset % 3` (0 = J, 1 = Q, 2 = K)
		euint8 rand = FHE.randomEuint8();
		game.state.eCardA = rand.rem(euint3);

		euint8 randOffset = FHE.randomEuint8().rem(euint2).add(euint1);
		game.state.eCardB = rand.add(randOffset).rem(euint3);
	}

	function _cancelRematchRequestIfOpen(uint256 _gid) internal {
		if (_gid == 0) return;

		if (!games[_gid].isRematch) return;
		if (games[_gid].state.accepted) return;

		// Rematch request is open, cancel it
		_cancelGame(_gid);
	}

	function _cancelGame(uint256 _gid) internal {
		Game storage game = games[_gid];

		game.outcome.outcome = Outcome.CANCEL;
		chips[msg.sender] += game.state.pot;
		userGames[msg.sender].remove(_gid);
		userActiveGame[msg.sender] = 0;

		// If cancelling game is the open game, remove it
		if (game.gid == openGameId) openGameId = 0;

		emit GameCancelled(msg.sender, _gid);
	}

	function _sortPlayers(
		address _playerA,
		address _playerB
	) internal pure returns (address, address) {
		if (_playerA < _playerB) {
			return (_playerA, _playerB);
		} else {
			return (_playerB, _playerA);
		}
	}

	function _addGameToPair(uint256 _gid) internal {
		(address p1, address p2) = _sortPlayers(
			games[_gid].playerA,
			games[_gid].playerB
		);
		pairGames[p1][p2].add(_gid);
	}

	// GAMEPLAY

	function _continueGame(Game storage game) internal {
		game.state.timeout = uint64(block.timestamp) + timeoutDuration;
		game.state.activePlayer = game.state.activePlayer == game.playerA
			? game.playerB
			: game.playerA;
	}

	function _takeChip(Game storage game) internal {
		if (chips[msg.sender] < 1) revert NotEnoughChips();
		chips[msg.sender] -= 1;
		game.state.pot += 1;

		emit ChipTaken(msg.sender, game.gid);
	}

	function _showdown(Game storage game) internal {
		game.state.timeout = 0;
		game.state.activePlayer = address(0);

		game.outcome.cardA = game.state.eCardA.decrypt();
		game.outcome.cardB = game.state.eCardB.decrypt();
		game.outcome.winner = game.outcome.cardA > game.outcome.cardB
			? game.playerA
			: game.playerB;
		chips[game.outcome.winner] += game.state.pot;
		game.outcome.outcome = Outcome.SHOWDOWN;

		emit WonByShowdown(game.outcome.winner, game.gid, game.state.pot);
	}

	function fold(Game storage game) internal {
		game.state.timeout = 0;
		game.state.activePlayer = address(0);

		game.outcome.cardA = game.state.eCardA.decrypt();
		game.outcome.cardB = game.state.eCardB.decrypt();
		game.outcome.winner = msg.sender == game.playerA
			? game.playerB
			: game.playerA;
		chips[game.outcome.winner] += game.state.pot;
		game.outcome.outcome = Outcome.FOLD;

		emit WonByFold(game.outcome.winner, game.gid, game.state.pot);
	}

	function handle_Action(Game storage game, Action action) internal {
		game.state.action1 = action;

		if (action == Action.BET) {
			_takeChip(game);
			_continueGame(game);
		} else if (action == Action.CHECK) {
			_continueGame(game);
		} else {
			revert InvalidAction();
		}
	}

	function handle_Bet_Action(Game storage game, Action action) internal {
		game.state.action2 = action;

		if (action == Action.CALL) {
			_takeChip(game);
			_showdown(game);
		} else if (action == Action.FOLD) {
			fold(game);
		} else {
			revert InvalidAction();
		}
	}

	function handle_Check_Action(Game storage game, Action action) internal {
		game.state.action2 = action;

		if (action == Action.BET) {
			_takeChip(game);
			_continueGame(game);
		} else if (action == Action.CHECK) {
			_showdown(game);
		} else {
			revert InvalidAction();
		}
	}

	function handle_Check_Bet_Action(
		Game storage game,
		Action action
	) internal {
		game.state.action3 = action;

		if (action == Action.CALL) {
			_takeChip(game);
			_showdown(game);
		} else if (action == Action.FOLD) {
			fold(game);
		} else {
			revert InvalidAction();
		}
	}

	function performAction(
		uint256 _gid,
		Action action
	) public validGame(_gid) validPlayer(_gid) {
		Game storage game = games[_gid];

		if (!game.state.accepted) revert GameNotStarted();
		if (game.outcome.outcome != Outcome.EMPTY) revert GameEnded();
		if (msg.sender != game.state.activePlayer) revert NotYourTurn();

		emit PerformedGameAction(msg.sender, _gid, action);

		if (game.state.action1 == Action.EMPTY) {
			handle_Action(game, action);
			return;
		}

		if (game.state.action1 == Action.BET) {
			handle_Bet_Action(game, action);
			return;
		}

		// action1 = CHECK
		// action2 = EMPTY || BET
		if (game.state.action2 == Action.EMPTY) {
			handle_Check_Action(game, action);
			return;
		}

		// action1 = CHECK
		// action2 = BET
		handle_Check_Bet_Action(game, action);
	}

	// VIEW

	function getGameCard(
		Permission memory permission,
		uint256 _gid
	)
		public
		view
		onlySender(permission)
		validGame(_gid)
		returns (SealedUint memory)
	{
		Game memory game = games[_gid];

		if (msg.sender == game.playerA) {
			return game.state.eCardA.sealTyped(permission.publicKey);
		}
		if (msg.sender == game.playerB) {
			return game.state.eCardB.sealTyped(permission.publicKey);
		}

		revert NotPlayerInGame();
	}

	function getGame(uint256 _gid) external view returns (Game memory game) {
		game = games[_gid];
	}

	function getUserGames(
		address user
	) external view returns (Game[] memory ret) {
		uint256 userGamesCount = userGames[user].length();
		ret = new Game[](userGamesCount);

		for (uint256 i = 0; i < userGamesCount; i++) {
			ret[i] = games[userGames[user].at(i)];
		}
	}

	function getPairGames(
		address _playerA,
		address _playerB
	) external view returns (Game[] memory ret) {
		(address p1, address p2) = _sortPlayers(_playerA, _playerB);
		uint256 pairGamesCount = pairGames[p1][p2].length();
		ret = new Game[](pairGamesCount);

		for (uint256 i = 0; i < pairGamesCount; i++) {
			ret[i] = games[pairGames[p1][p2].at(i)];
		}
	}
}

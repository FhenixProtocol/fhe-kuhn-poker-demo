// SPDX-License-Identifier: MIT

pragma solidity >=0.8.13 <0.9.0;

import "@fhenixprotocol/contracts/FHE.sol";
import "hardhat/console.sol";
import { Permissioned, Permission } from "@fhenixprotocol/contracts/access/Permissioned.sol";
import { SealedUint, TypedBindingsEuint8 } from "./FHETypedSealed.sol";
import { EnumerableSet } from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

// Simplified Poker (https://en.wikipedia.org/wiki/Kuhn_poker) on Fhenix
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
	CANCEL
}

struct Game {
	uint256 gid;
	address playerA;
	address playerB;
	bool accepted;
	uint8 pot;
	uint64 timeout;
	//
	address activePlayer;
	euint8 eCardA;
	euint8 eCardB;
	//
	Action action1;
	Action action2;
	Action action3;
	//
	GameOutcome outcome;
	//
	uint256 rematchGid;
}
struct GameOutcome {
	uint256 gid;
	uint8 cardA;
	uint8 cardB;
	address winner;
	Outcome outcome;
}

contract FHEKuhnPoker is Permissioned {
	using EnumerableSet for EnumerableSet.UintSet;
	using TypedBindingsEuint8 for euint8;

	euint32 private counter;
	address public owner;

	uint256 public gid = 0;
	uint64 public timeoutDuration = 2 minutes;

	euint8 private euint3 = FHE.asEuint8(3);
	euint8 private euint2 = FHE.asEuint8(2);
	euint8 private euint1 = FHE.asEuint8(1);

	mapping(address => uint256) public chips;
	mapping(uint256 => Game) public games;
	mapping(address => EnumerableSet.UintSet) private userGames;
	mapping(address => mapping(address => EnumerableSet.UintSet))
		private pairGames;
	uint256 public openGameId = 0;

	constructor() {
		owner = msg.sender;
	}

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

	error InvalidGame();
	error NotEnoughChips();
	error InvalidPlayerB();
	error GameNotStarted();
	error GameEnded();
	error RematchCancelled();
	error NotPlayerInGame();
	error InvalidAction();
	error NotYourTurn();
	error AlreadyRequestedRematch();
	error AlreadyAcceptedRematch();
	error OpponentStillHasTime();

	// CHIP

	function dealMeIn(uint256 chipCount) public {
		chips[msg.sender] += chipCount;
		emit PlayerDealtIn(msg.sender, chipCount);
	}

	// GAME MANAGEMENT

	function findGame() public {
		if (openGameId == 0) {
			_createOpenGame();
		} else {
			_joinOpenGame(openGameId);
		}
	}

	function rematch(uint256 _gid) public {
		if (_gid > gid) revert InvalidGame();

		Game storage game = games[_gid];
		if (msg.sender != game.playerA && msg.sender != game.playerB)
			revert NotPlayerInGame();

		// Create a rematch if it doesn't exist
		if (game.rematchGid == 0) {
			address playerB = msg.sender == game.playerA
				? game.playerB
				: game.playerA;
			game.rematchGid = _createRematch(playerB);
			return;
		}

		Game memory rematchGame = games[game.rematchGid];

		if (msg.sender == rematchGame.playerA) revert AlreadyRequestedRematch();
		if (rematchGame.accepted) revert AlreadyAcceptedRematch();

		if (rematchGame.outcome.outcome == Outcome.CANCEL)
			revert RematchCancelled();

		_acceptRematch(game.rematchGid);
	}

	function exitGame(uint256 _gid) public {
		if (_gid > gid) revert InvalidGame();

		Game storage game = games[_gid];
		if (msg.sender != game.playerA && msg.sender != game.playerB)
			revert NotPlayerInGame();

		if (game.outcome.outcome != Outcome.EMPTY) revert GameEnded();

		if (game.accepted && block.timestamp < game.timeout)
			revert OpponentStillHasTime();

		// Exit before game is accepted cancels game
		if (!game.accepted) {
			game.outcome.outcome = Outcome.CANCEL;
			chips[msg.sender] += game.pot;
			userGames[msg.sender].remove(_gid);

			// If cancelling game is the open game, remove it
			if (game.gid == openGameId) openGameId = 0;

			emit GameCancelled(msg.sender, _gid);
		}

		// Winner decided by timeout
		game.outcome.outcome = Outcome.TIMEOUT;
		game.outcome.winner = msg.sender;
		chips[game.outcome.winner] += game.pot;

		emit WonByTimeout(game.outcome.winner, game.gid, game.pot);
	}

	function _createOpenGame() internal returns (uint256 _gid) {
		_gid = _createGameInner();

		// Add game to user's games
		// Mark this game as the open game
		userGames[msg.sender].add(gid);
		openGameId = _gid;

		emit GameCreated(msg.sender, _gid);
	}

	function _createRematch(address playerB) internal returns (uint256 _gid) {
		_gid = _createGameInner();

		// Rematches already know both players
		games[_gid].playerB = playerB;

		emit RematchCreated(msg.sender, _gid);
	}

	function _createGameInner() internal returns (uint256) {
		Game storage game = games[gid];
		game.gid = gid;
		game.playerA = msg.sender;

		// Take ante from player
		takeChip(game);

		gid += 1;

		return game.gid;
	}

	function _joinOpenGame(uint256 _gid) internal {
		if (games[_gid].playerA == msg.sender) revert InvalidPlayerB();
		_joinGameInner(_gid);

		// Add to user games
		// Remove as open game
		userGames[msg.sender].add(_gid);
		openGameId = 0;
		_addGameToPair(_gid);

		emit GameJoined(msg.sender, _gid);
	}

	function _acceptRematch(uint256 _gid) internal {
		if (games[_gid].playerB != msg.sender) revert NotPlayerInGame();
		_joinGameInner(_gid);

		// Add game to both users (not done during create step for rematches)
		userGames[games[_gid].playerA].add(_gid);
		userGames[games[_gid].playerB].add(_gid);
		_addGameToPair(_gid);

		emit RematchAccepted(msg.sender, _gid);
	}

	function _joinGameInner(uint256 _gid) internal {
		Game storage game = games[_gid];

		// Take ante from player
		takeChip(game);

		// Start game
		game.accepted = true;
		game.playerB = msg.sender;
		game.timeout = uint64(block.timestamp) + timeoutDuration;

		// Random value between 0 and 1
		// FHE randomness is leveraged, but it does not need to remain encrypted
		uint8 startingPlayer = FHE.decrypt(FHE.randomEuint8()) % 2;
		game.activePlayer = startingPlayer == 0 ? game.playerA : game.playerB;

		// Random card selection:
		// 1. A random number is generated
		// 2. playerA card is `rand % 3` (0 = J, 1 = Q, 2 = K)
		// 3. A random offset between 1 and 2 is generated
		// 4. The offset is added to `rand`
		// 5. playerB card is `rand+offset % 3` (0 = J, 1 = Q, 2 = K)
		euint8 rand = FHE.randomEuint8();
		game.eCardA = rand.rem(euint3);

		euint8 randOffset = FHE.randomEuint8().rem(euint2).add(euint1);
		game.eCardB = rand.add(randOffset).rem(euint3);
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

	function continueGame(Game storage game) internal {
		game.timeout = uint64(block.timestamp) + timeoutDuration;
		game.activePlayer = game.activePlayer == game.playerA
			? game.playerB
			: game.playerA;
	}

	function takeChip(Game storage game) internal {
		if (chips[msg.sender] < 1) revert NotEnoughChips();
		chips[msg.sender] -= 1;
		game.pot += 1;

		emit ChipTaken(msg.sender, game.gid);
	}

	function showdown(Game storage game) internal {
		game.timeout = 0;
		game.activePlayer = address(0);

		game.outcome.cardA = game.eCardA.decrypt();
		game.outcome.cardB = game.eCardB.decrypt();
		game.outcome.winner = game.outcome.cardA > game.outcome.cardB
			? game.playerA
			: game.playerB;
		chips[game.outcome.winner] += game.pot;
		game.outcome.outcome = Outcome.SHOWDOWN;

		emit WonByShowdown(game.outcome.winner, game.gid, game.pot);
	}

	function fold(Game storage game) internal {
		game.timeout = 0;
		game.activePlayer = address(0);

		game.outcome.cardA = game.eCardA.decrypt();
		game.outcome.cardB = game.eCardB.decrypt();
		game.outcome.winner = msg.sender == game.playerA
			? game.playerB
			: game.playerA;
		chips[game.outcome.winner] += game.pot;
		game.outcome.outcome = Outcome.FOLD;

		emit WonByFold(game.outcome.winner, game.gid, game.pot);
	}

	function handle_Action(Game storage game, Action action) internal {
		game.action1 = action;

		if (action == Action.BET) {
			takeChip(game);
			continueGame(game);
		} else if (action == Action.CHECK) {
			continueGame(game);
		} else {
			revert InvalidAction();
		}
	}

	function handle_Bet_Action(Game storage game, Action action) internal {
		game.action2 = action;

		if (action == Action.CALL) {
			takeChip(game);
			showdown(game);
		} else if (action == Action.FOLD) {
			fold(game);
		} else {
			revert InvalidAction();
		}
	}

	function handle_Check_Action(Game storage game, Action action) internal {
		game.action2 = action;

		if (action == Action.BET) {
			takeChip(game);
			continueGame(game);
		} else if (action == Action.CHECK) {
			showdown(game);
		} else {
			revert InvalidAction();
		}
	}

	function handle_Check_Bet_Action(
		Game storage game,
		Action action
	) internal {
		game.action3 = action;

		if (action == Action.CALL) {
			takeChip(game);
			showdown(game);
		} else if (action == Action.FOLD) {
			fold(game);
		} else {
			revert InvalidAction();
		}
	}

	function performAction(uint256 _gid, Action action) public {
		if (_gid >= gid) revert InvalidGame();

		Game storage game = games[_gid];
		if (msg.sender != game.playerA && msg.sender != game.playerB)
			revert NotPlayerInGame();
		if (!game.accepted) revert GameNotStarted();
		if (game.outcome.outcome != Outcome.EMPTY) revert GameEnded();
		if (msg.sender != game.activePlayer) revert NotYourTurn();

		emit PerformedGameAction(msg.sender, _gid, action);

		if (game.action1 == Action.EMPTY) {
			handle_Action(game, action);
			return;
		}

		if (game.action1 == Action.BET) {
			handle_Bet_Action(game, action);
			return;
		}

		if (game.action1 == Action.CHECK) {
			if (game.action2 == Action.EMPTY) {
				handle_Check_Action(game, action);
				return;
			}

			if (game.action2 == Action.BET) {
				handle_Check_Bet_Action(game, action);
				return;
			}
		}
	}

	// VIEW

	function getGameCard(
		Permission memory permission,
		uint256 _gid
	) public view onlySender(permission) returns (SealedUint memory) {
		if (_gid >= gid) revert InvalidGame();
		Game memory game = games[_gid];
		if (msg.sender == game.playerA) {
			return game.eCardA.sealTyped(permission.publicKey);
		}
		if (msg.sender == game.playerB) {
			return game.eCardB.sealTyped(permission.publicKey);
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

	function getOpenGame() external view returns (Game memory openGame) {
		openGame = games[openGameId];
	}
}

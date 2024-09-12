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
	A_BY_SHOWDOWN,
	B_BY_SHOWDOWN,
	A_BY_FOLD,
	B_BY_FOLD
}

struct Game {
	uint256 gid;
	address playerA;
	address playerB;
	bool accepted;
	uint8 pot;
	//
	uint8 startingPlayer;
	euint8 eCardA;
	euint8 eCardB;
	//
	Action action1;
	Action action2;
	Action action3;
	//
	GameOutcome outcome;
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

	euint8 private euint3 = FHE.asEuint8(3);
	euint8 private euint2 = FHE.asEuint8(2);
	euint8 private euint1 = FHE.asEuint8(1);

	mapping(address => uint256) public chips;
	mapping(uint256 => Game) public games;
	mapping(address => EnumerableSet.UintSet) private userGames;
	EnumerableSet.UintSet private openGames;

	constructor() {
		owner = msg.sender;
	}

	event PlayerDealtIn(address indexed user, uint256 chips);
	event GameCreated(address indexed playerA, uint256 indexed gid);
	event GameAccepted(address indexed playerB, uint256 indexed gid);
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

	error InvalidGame();
	error NotEnoughChips();
	error InvalidPlayerB();
	error GameNotStarted();
	error GameEnded();
	error NotPlayerInGame();
	error InvalidAction();
	error NotYourTurn();

	function dealMeIn(uint256 chipCount) public {
		chips[msg.sender] += chipCount;
		emit PlayerDealtIn(msg.sender, chipCount);
	}

	function createGame() public {
		Game storage game = games[gid];
		game.gid = gid;
		game.playerA = msg.sender;

		userGames[msg.sender].add(gid);
		openGames.add(gid);

		// Take ante from player
		takeChip(game);

		emit GameCreated(msg.sender, gid);
		gid += 1;
	}

	function joinGame(uint256 _gid) public {
		if (_gid >= gid) revert InvalidGame();

		Game storage game = games[_gid];
		if (game.playerA == msg.sender) revert InvalidPlayerB();

		userGames[msg.sender].add(_gid);
		openGames.remove(_gid);

		// Take ante from player
		takeChip(game);

		// Start game
		game.accepted = true;
		game.playerB = msg.sender;

		// Random value between 0 and 1
		// FHE randomness is leveraged, but it does not need to remain encrypted
		game.startingPlayer = FHE.decrypt(FHE.randomEuint8()) % 2;

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

		emit GameAccepted(msg.sender, _gid);
	}

	function validatePlayer1(Game storage game) internal view {
		if (
			msg.sender !=
			(game.startingPlayer == 0 ? game.playerA : game.playerB)
		) revert NotYourTurn();
	}
	function validatePlayer2(Game storage game) internal view {
		if (
			msg.sender !=
			(game.startingPlayer == 0 ? game.playerB : game.playerA)
		) revert NotYourTurn();
	}

	function takeChip(Game storage game) internal {
		if (chips[msg.sender] < 1) revert NotEnoughChips();
		chips[msg.sender] -= 1;
		game.pot += 1;

		emit ChipTaken(msg.sender, game.gid);
	}

	function showdown(Game storage game) internal {
		game.outcome.cardA = game.eCardA.decrypt();
		game.outcome.cardB = game.eCardB.decrypt();
		game.outcome.winner = game.outcome.cardA > game.outcome.cardB
			? game.playerA
			: game.playerB;
		chips[game.outcome.winner] += game.pot;
		game.outcome.outcome = game.outcome.winner == game.playerA
			? Outcome.A_BY_SHOWDOWN
			: Outcome.B_BY_SHOWDOWN;

		emit WonByShowdown(game.outcome.winner, game.gid, game.pot);
	}

	function fold(Game storage game) internal {
		game.outcome.cardA = game.eCardA.decrypt();
		game.outcome.cardB = game.eCardB.decrypt();
		game.outcome.winner = msg.sender == game.playerA
			? game.playerB
			: game.playerA;
		chips[game.outcome.winner] += game.pot;
		game.outcome.outcome = game.outcome.winner == game.playerA
			? Outcome.A_BY_FOLD
			: Outcome.B_BY_FOLD;

		emit WonByFold(game.outcome.winner, game.gid, game.pot);
	}

	function handle_Action(Game storage game, Action action) internal {
		validatePlayer1(game);
		game.action1 = action;

		if (action == Action.BET) {
			takeChip(game);
		} else if (action == Action.CHECK) {
			// noop
		} else {
			revert InvalidAction();
		}
	}

	function handle_Bet_Action(Game storage game, Action action) internal {
		validatePlayer2(game);
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
		validatePlayer2(game);
		game.action2 = action;

		if (action == Action.BET) {
			takeChip(game);
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
		validatePlayer1(game);
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
		if (game.outcome.winner != address(0)) revert GameEnded();

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

	function getOpenGames() external view returns (Game[] memory ret) {
		uint256 openGamesCount = openGames.length();
		ret = new Game[](openGamesCount);

		for (uint256 i = 0; i < openGamesCount; i++) {
			ret[i] = games[openGames.at(i)];
		}
	}
}

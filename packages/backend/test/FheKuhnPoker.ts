import { expect } from "chai";
import { ethers } from "hardhat";
import hre from "hardhat";

import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import {
  createFhenixContractPermission,
  getTokensFromFaucet,
  revertSnapshot,
  takeSnapshot,
  unsealMockFheOpsSealed,
  withinSnapshot,
} from "./utils";
import { ZeroAddress } from "ethers";
import {
  AllPlayerActions,
  ExhaustiveGameBranch,
  Expectation,
  GameOutcome,
  PlayerAction,
  playerActionNumToName,
  PokerGameBranch,
} from "./kuhnPokerUtils";
import { FHEKuhnPoker, FHEKuhnPoker__factory } from "../types";

const cardToLetter = (n: bigint) => {
  switch (n) {
    case 0n:
      return "J";
    case 1n:
      return "Q";
    case 2n:
      return "K";
    default:
      return "X";
  }
};

describe("FHEKuhnPoker", function () {
  let fheKuhnPokerFactory: FHEKuhnPoker__factory;
  let fheKuhnPoker: FHEKuhnPoker;
  let fheKuhnPokerAddress: string;
  let signer: SignerWithAddress;
  let bob: SignerWithAddress;
  let ada: SignerWithAddress;
  let snapshotId: string;

  before(async () => {
    signer = (await ethers.getSigners())[0];
    bob = (await ethers.getSigners())[1];
    ada = (await ethers.getSigners())[2];

    await getTokensFromFaucet(signer.address);
    await getTokensFromFaucet(bob.address);
    await getTokensFromFaucet(ada.address);

    fheKuhnPokerFactory = (await ethers.getContractFactory("FHEKuhnPoker")) as FHEKuhnPoker__factory;
    fheKuhnPoker = await fheKuhnPokerFactory.deploy();
    await fheKuhnPoker.waitForDeployment();
    fheKuhnPokerAddress = await fheKuhnPoker.getAddress();
  });

  beforeEach(async () => {
    snapshotId = await takeSnapshot();
  });

  afterEach(async () => {
    await revertSnapshot(snapshotId);
  });

  it("dealMeIn should succeed", async () => {
    const bobTokensInit = await fheKuhnPoker.chips(bob.address);
    await expect(fheKuhnPoker.connect(bob).dealMeIn(100))
      .to.emit(fheKuhnPoker, "PlayerDealtIn")
      .withArgs(bob.address, 100);
    const bobTokensFinal = await fheKuhnPoker.chips(bob.address);
    expect(bobTokensFinal - bobTokensInit).to.eq(100, "Bob receives correct amount of chips");
  });

  it("createGame should revert with invalid params", async () => {
    // Invalid playerB
    await expect(fheKuhnPoker.connect(bob).createGame(bob.address)).to.be.revertedWithCustomError(
      fheKuhnPoker,
      "InvalidPlayerB",
    );
    await expect(fheKuhnPoker.connect(bob).createGame(ZeroAddress)).to.be.revertedWithCustomError(
      fheKuhnPoker,
      "InvalidPlayerB",
    );

    // Bob doesn't have chips
    await expect(fheKuhnPoker.connect(bob).createGame(ada.address)).to.be.revertedWithCustomError(
      fheKuhnPoker,
      "NotEnoughChips",
    );
  });

  it("createGame should succeed", async () => {
    const gid = 0;

    await fheKuhnPoker.connect(bob).dealMeIn(100);
    await expect(fheKuhnPoker.connect(bob).createGame(ada.address))
      .to.emit(fheKuhnPoker, "GameCreated")
      .withArgs(bob.address, ada.address, gid);

    const game = await fheKuhnPoker.games(gid);

    expect(game.gid).to.eq(gid, "game id is 0");
    expect(game.playerA).to.eq(bob.address, "playerA is bob");
    expect(game.playerB).to.eq(ada.address, "playerA is ada");
    expect(game.pot).to.eq(1, "pot includes bob's ante");
    expect(await fheKuhnPoker.chips(bob.address)).to.eq(99, "bob's ante taken");
  });

  it("acceptGame should revert with invalid params", async () => {
    const gid = 0;

    // Invalid gid
    await expect(fheKuhnPoker.connect(ada).acceptGame(gid)).to.be.revertedWithCustomError(fheKuhnPoker, "InvalidGame");

    // Create game
    await fheKuhnPoker.connect(bob).dealMeIn(100);
    await fheKuhnPoker.connect(bob).createGame(ada.address);

    // Not playerB
    await expect(fheKuhnPoker.connect(signer).acceptGame(gid)).to.be.revertedWithCustomError(
      fheKuhnPoker,
      "NotPlayerInGame",
    );

    // Not enough chips
    await expect(fheKuhnPoker.connect(ada).acceptGame(gid)).to.be.revertedWithCustomError(
      fheKuhnPoker,
      "NotEnoughChips",
    );

    await fheKuhnPoker.connect(ada).dealMeIn(100);
    await expect(fheKuhnPoker.connect(ada).acceptGame(gid)).to.not.be.reverted;
  });

  it("acceptGame should succeed", async () => {
    const gid = 0;

    await fheKuhnPoker.connect(bob).dealMeIn(100);
    await fheKuhnPoker.connect(ada).dealMeIn(100);
    await fheKuhnPoker.connect(bob).createGame(ada.address);

    await expect(fheKuhnPoker.connect(ada).acceptGame(gid))
      .to.emit(fheKuhnPoker, "GameAccepted")
      .withArgs(ada.address, gid);

    const game = await fheKuhnPoker.games(gid);

    expect(game.accepted).to.eq(true, "ada accepted game");
    expect([0n, 1n].includes(game.startingPlayer)).to.eq(true, "Starting player should be 0 or 1");
    expect(game.pot).to.eq(2, "ada's ante should be added");
    expect(await fheKuhnPoker.chips(ada.address)).to.eq(99, "ada's ante should be taken");
  });
  it("acceptGame should generate a random starting player and cards", async () => {
    const gid = 0;

    await fheKuhnPoker.connect(bob).dealMeIn(100);
    await fheKuhnPoker.connect(ada).dealMeIn(100);
    await fheKuhnPoker.connect(bob).createGame(ada.address);

    const startingPlayer = {
      A: 0,
      B: 0,
      total: 0,
    };
    const playerACards: Record<string, number> = {
      K: 0,
      Q: 0,
      J: 0,
      total: 0,
    };
    const playerBCards: Record<string, number> = {
      K: 0,
      Q: 0,
      J: 0,
      total: 0,
    };
    const cardPairs: Record<string, number> = {
      "K-J": 0,
      "K-Q": 0,
      "Q-K": 0,
      "Q-J": 0,
      "J-K": 0,
      "J-Q": 0,
      total: 0,
    };
    const wins = {
      A: 0,
      B: 0,
      total: 0,
    };

    const rngSnapId = await takeSnapshot();

    for (let i = 0; i < 100; i++) {
      await fheKuhnPoker.connect(ada).acceptGame(gid);
      const game = await fheKuhnPoker.games(gid);

      if (game.startingPlayer == 0n) startingPlayer.A += 1;
      else startingPlayer.B += 1;
      startingPlayer.total += 1;

      expect(game.eCardA).not.eq(game.eCardB, "Players cards shouldn't match");
      playerACards[cardToLetter(game.eCardA)] += 1;
      playerACards.total += 1;
      playerBCards[cardToLetter(game.eCardB)] += 1;
      playerBCards.total += 1;

      cardPairs[`${cardToLetter(game.eCardA)}-${cardToLetter(game.eCardB)}`] += 1;
      cardPairs.total += 1;

      if (game.eCardA > game.eCardB) wins.A += 1;
      else wins.B += 1;
      wins.total += 1;

      await revertSnapshot(rngSnapId);
    }

    console.log({
      startingPlayer,
      playerACards,
      playerBCards,
      cardPairs,
      wins,
    });
  });

  it("getGameCard should revert on invalid params", async () => {
    const gid = 0;

    await fheKuhnPoker.connect(bob).dealMeIn(100);
    await fheKuhnPoker.connect(ada).dealMeIn(100);
    await fheKuhnPoker.connect(bob).createGame(ada.address);
    await fheKuhnPoker.connect(ada).acceptGame(gid);

    // Revert if invalid gid
    let permission = await createFhenixContractPermission(hre, bob, fheKuhnPokerAddress);
    await expect(fheKuhnPoker.connect(bob).getGameCard(permission, 1)).to.be.revertedWithCustomError(
      fheKuhnPoker,
      "InvalidGame",
    );

    // Revert if not player
    permission = await createFhenixContractPermission(hre, signer, fheKuhnPokerAddress);
    await expect(fheKuhnPoker.connect(signer).getGameCard(permission, gid)).to.be.revertedWithCustomError(
      fheKuhnPoker,
      "NotPlayerInGame",
    );

    // Revert if not sender
    permission = await createFhenixContractPermission(hre, ada, fheKuhnPokerAddress);
    await expect(fheKuhnPoker.connect(bob).getGameCard(permission, gid)).to.be.revertedWithCustomError(
      fheKuhnPoker,
      "SignerNotMessageSender",
    );
  });

  it("getGameCard should return sealed card", async () => {
    const gid = 0;

    await fheKuhnPoker.connect(bob).dealMeIn(100);
    await fheKuhnPoker.connect(ada).dealMeIn(100);
    await fheKuhnPoker.connect(bob).createGame(ada.address);
    await fheKuhnPoker.connect(ada).acceptGame(gid);

    const game = await fheKuhnPoker.games(gid);

    let permission = await createFhenixContractPermission(hre, bob, fheKuhnPokerAddress);
    const bobSealedCard = await fheKuhnPoker.connect(bob).getGameCard(permission, gid);
    const bobUnsealedCard = unsealMockFheOpsSealed(bobSealedCard.data);

    permission = await createFhenixContractPermission(hre, ada, fheKuhnPokerAddress);
    const adaSealedCard = await fheKuhnPoker.connect(ada).getGameCard(permission, gid);
    const adaUnsealedCard = unsealMockFheOpsSealed(adaSealedCard.data);

    expect(bobUnsealedCard).to.eq(game.eCardA, "bob's unsealed card should match");
    expect(adaUnsealedCard).to.eq(game.eCardB, "ada's unsealed card should match");
  });

  it("performAction should revert on invalid params", async () => {
    const gid = 0;

    await fheKuhnPoker.connect(bob).dealMeIn(1);
    await fheKuhnPoker.connect(ada).dealMeIn(1);
    await fheKuhnPoker.connect(bob).createGame(ada.address);

    // Game not yet started
    await expect(fheKuhnPoker.connect(bob).performAction(gid, PlayerAction.BET)).to.be.revertedWithCustomError(
      fheKuhnPoker,
      "GameNotStarted",
    );

    await fheKuhnPoker.connect(ada).acceptGame(gid);
    let game = await fheKuhnPoker.games(gid);

    // Invalid gid
    await expect(fheKuhnPoker.connect(bob).performAction(1, PlayerAction.BET)).to.be.revertedWithCustomError(
      fheKuhnPoker,
      "InvalidGame",
    );

    // Not player in game
    await expect(fheKuhnPoker.connect(signer).performAction(gid, PlayerAction.BET)).to.be.revertedWithCustomError(
      fheKuhnPoker,
      "NotPlayerInGame",
    );

    // Not enough chips
    const startingSigner = game.startingPlayer === 0n ? bob : ada;
    await expect(
      fheKuhnPoker.connect(startingSigner).performAction(gid, PlayerAction.BET),
    ).to.be.revertedWithCustomError(fheKuhnPoker, "NotEnoughChips");

    await fheKuhnPoker.connect(startingSigner).performAction(gid, PlayerAction.CHECK);
    const oppositeSigner = startingSigner.address === bob.address ? ada : bob;
    await fheKuhnPoker.connect(oppositeSigner).performAction(gid, PlayerAction.CHECK);

    game = await fheKuhnPoker.games(gid);
    expect(game.outcome.winner).not.eq(ZeroAddress, "Game has ended");

    // Game Ended
    await expect(
      fheKuhnPoker.connect(startingSigner).performAction(gid, PlayerAction.BET),
    ).to.be.revertedWithCustomError(fheKuhnPoker, "GameEnded");
  });

  it("gameplay should succeed", async () => {
    const gid = 0;

    await fheKuhnPoker.connect(bob).dealMeIn(100);
    await fheKuhnPoker.connect(ada).dealMeIn(100);
    await fheKuhnPoker.connect(bob).createGame(ada.address);
    await fheKuhnPoker.connect(ada).acceptGame(gid);

    const game = await fheKuhnPoker.games(gid);
    const startingPlayer = game.startingPlayer === 0n ? bob : ada;
    const oppositePlayer = game.startingPlayer === 0n ? ada : bob;
    const actionPlayers = {
      1: { player: startingPlayer, opposite: oppositePlayer },
      2: { player: oppositePlayer, opposite: startingPlayer },
      3: { player: startingPlayer, opposite: oppositePlayer },
    };

    const processBranch = async (branch: PokerGameBranch) => {
      const game = await fheKuhnPoker.games(gid);
      const { player, opposite } = actionPlayers[branch.actionIndex];

      const indent = "  ".repeat(branch.actionIndex);

      // Should revert if other player tries to play
      await expect(fheKuhnPoker.connect(opposite).performAction(gid, PlayerAction.BET)).to.be.revertedWithCustomError(
        fheKuhnPoker,
        "NotYourTurn",
      );

      // Iterate through actions
      for (let i = 0; i < AllPlayerActions.length; i++) {
        await withinSnapshot(async () => {
          const ACTION = AllPlayerActions[i];
          const outcome = branch.actions[ACTION];
          console.log(`${indent}${playerActionNumToName(ACTION)} - ${outcome.expect.join(" & ")}`);

          // Handle reversions
          if (outcome.revert) {
            for (let j = 0; j < outcome.expect.length; j++) {
              if (outcome.expect[j] === Expectation.InvalidAction) {
                await expect(fheKuhnPoker.connect(player).performAction(gid, ACTION)).to.be.revertedWithCustomError(
                  fheKuhnPoker,
                  "InvalidAction",
                );
              }
            }
            return;
          }

          // Should always emit PerformedGameAction
          await withinSnapshot(async () => {
            await expect(fheKuhnPoker.connect(player).performAction(gid, ACTION))
              .to.emit(fheKuhnPoker, "PerformedGameAction")
              .withArgs(player.address, gid, ACTION);
          });

          // Calculate expected values and states

          const includesBet = outcome.expect.includes(Expectation.TakeBet);
          const includesShowdown = outcome.expect.includes(Expectation.Showdown);
          const includesFold = outcome.expect.includes(Expectation.Fold);
          const includesReveal = includesShowdown || includesFold;

          let expectedPlayerChipChange = 0n;
          let expectedOppositeChipChange = 0n;
          let expectedPot = game.pot;
          let expectedCardA = 0n;
          let expectedCardB = 0n;
          let expectedWinner = ZeroAddress;
          let expectedOutcome: number = GameOutcome.EMPTY;

          // Take bet if this action includes a bet step
          if (includesBet) {
            expectedPlayerChipChange -= 1n;
            expectedPot += 1n;
          }

          // Action will ultimately reveal cards
          if (includesReveal) {
            expectedCardA = game.eCardA;
            expectedCardB = game.eCardB;
          }

          // Winner is decided by highest card
          if (includesShowdown) {
            expectedWinner = expectedCardA > expectedCardB ? bob.address : ada.address;
            expectedOutcome = expectedWinner === bob.address ? GameOutcome.A_BY_SHOWDOWN : GameOutcome.B_BY_SHOWDOWN;
          }

          // Player folds, winner is opposite
          if (includesFold) {
            expectedWinner = opposite.address;
            expectedOutcome = expectedWinner === bob.address ? GameOutcome.A_BY_FOLD : GameOutcome.B_BY_FOLD;
          }

          // Allocate chips to winner
          if (includesReveal) {
            const currentPlayerIsWinner = expectedWinner === player.address;
            if (currentPlayerIsWinner) expectedPlayerChipChange += expectedPot;
            else expectedOppositeChipChange += expectedPot;
          }

          // Get current values
          const playerChips = await fheKuhnPoker.chips(player.address);
          const oppositeChips = await fheKuhnPoker.chips(opposite.address);

          // Ensure correct events emitted
          for (let j = 0; j < outcome.expect.length; j++) {
            const expectation = outcome.expect[j];
            await withinSnapshot(async () => {
              if (expectation === Expectation.TakeBet) {
                await expect(fheKuhnPoker.connect(player).performAction(gid, ACTION))
                  .to.emit(fheKuhnPoker, "ChipTaken")
                  .withArgs(player.address, gid);
              }
              if (expectation === Expectation.Showdown) {
                await expect(fheKuhnPoker.connect(player).performAction(gid, ACTION))
                  .to.emit(fheKuhnPoker, "WonByShowdown")
                  .withArgs(expectedWinner, gid, expectedPot);
              }
              if (expectation === Expectation.Fold) {
                await expect(fheKuhnPoker.connect(player).performAction(gid, ACTION))
                  .to.emit(fheKuhnPoker, "WonByFold")
                  .withArgs(expectedWinner, gid, expectedPot);
              }
            });
          }

          // Perform action outside of snapshot
          await fheKuhnPoker.connect(player).performAction(gid, ACTION);
          const gameFinal = await fheKuhnPoker.games(gid);

          // Check outcome matches expected
          expect(gameFinal.pot).to.eq(expectedPot, "Pot is updated correctly");

          expect((await fheKuhnPoker.chips(player.address)) - playerChips).to.eq(
            expectedPlayerChipChange,
            "Players chips updated correctly",
          );
          expect((await fheKuhnPoker.chips(opposite.address)) - oppositeChips).to.eq(
            expectedOppositeChipChange,
            "Opposite chips updated correctly",
          );

          expect(gameFinal[`action${branch.actionIndex}`]).to.eq(ACTION, "Action should be stored to correct field");

          expect(gameFinal.outcome.cardA).to.eq(
            expectedCardA,
            includesReveal ? "Card A matches encrypted" : "Card A still hidden",
          );
          expect(gameFinal.outcome.cardB).to.eq(
            expectedCardB,
            includesReveal ? "Card B matches encrypted" : "Card B still hidden",
          );
          expect(gameFinal.outcome.winner).to.eq(
            expectedWinner,
            includesReveal ? "Correct player has won" : "Winner not yet decided",
          );
          expect(gameFinal.outcome.outcome).to.eq(
            expectedOutcome,
            includesReveal ? "Correct outcome set" : "Outcome not yet decided",
          );

          // If action outcome has nested branches, perform it and process branches
          if (outcome.branch != null) {
            await processBranch(outcome.branch);
          }
        });
      }
    };

    await processBranch(ExhaustiveGameBranch);
  });
});

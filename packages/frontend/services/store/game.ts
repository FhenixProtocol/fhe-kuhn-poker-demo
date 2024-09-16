import { ZeroAddress } from "ethers";
import { useEffect } from "react";
import { useInterval } from "usehooks-ts";
import { useAccount, useNetwork } from "wagmi";
import create from "zustand";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useFhenixScaffoldContractRead } from "~~/hooks/scaffold-eth/useFhenixScaffoldContractRead";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { InjectFhenixPermission } from "~~/utils/fhenixUtilsTypes";
import { AbiFunctionReturnType, ContractAbi } from "~~/utils/scaffold-eth/contract";

export type ContractUserGameState = AbiFunctionReturnType<ContractAbi<"FHEKuhnPoker">, "getUserGameState">;

type GameState = {
  address: string | null;
  gameState: ContractUserGameState | null;
  playerCard: number | null;
};

export enum GameOutcome {
  EMPTY,
  SHOWDOWN,
  FOLD,
  TIMEOUT,
  CANCEL,
  RESIGN,
}

export const outcomeToText = (outcome: GameOutcome) => {
  switch (outcome) {
    case GameOutcome.EMPTY:
      return "NONE";
    case GameOutcome.SHOWDOWN:
      return "SHOWDOWN";
    case GameOutcome.FOLD:
      return "FOLD";
    case GameOutcome.TIMEOUT:
      return "TIMEOUT";
    case GameOutcome.CANCEL:
      return "CANCEL";
    case GameOutcome.RESIGN:
      return "RESIGNATION";
    default:
      return "UNKNOWN";
  }
};

export enum PlayerAction {
  EMPTY,
  CHECK,
  BET,
  FOLD,
  CALL,
}

export type GameInfo = AbiFunctionReturnType<ContractAbi<"FHEKuhnPoker">, "getGame">;
export type GidsState = AbiFunctionReturnType<ContractAbi<"FHEKuhnPoker">, "getUserGameState">;

export const EmptyGameInfo: GameInfo = {
  gid: 0n,
  rematchingGid: 0n,
  playerA: ZeroAddress,
  playerB: ZeroAddress,
  state: {
    accepted: false,
    eCardA: 0n,
    eCardB: 0n,
    pot: 0,
    startingPlayer: ZeroAddress,
    activePlayer: ZeroAddress,
    timeout: 0n,
    action1: 0,
    action2: 0,
    action3: 0,
  },
  outcome: {
    gid: 0n,
    cardA: 0,
    cardB: 0,
    winner: ZeroAddress,
    outcome: GameOutcome.EMPTY,
    rematchGid: 0n,
  },
};

export type PopulatedKuhnCard = { suit: "red" | "black"; rank: number };
export type KuhnCard = "empty" | "hidden" | PopulatedKuhnCard;

const AllPlayerActions = [
  PlayerAction.EMPTY,
  PlayerAction.CHECK,
  PlayerAction.BET,
  PlayerAction.FOLD,
  PlayerAction.CALL,
] as ActionOption[];

type keys = keyof typeof PlayerAction;
export type ActionOption = (typeof PlayerAction)[keys];

export const Expectation = {
  InvalidAction: "invalid-action",
  TakeBet: "take-bet",
  Fold: "fold",
  Showdown: "showdown",
};

const revertInvalidAction = {
  revert: true,
  expect: [Expectation.InvalidAction],
};

type ActionOutcome = {
  revert?: boolean;
  expect: string[];
  branch?: PokerGameBranch;
};

export type PokerGameBranch = {
  actionIndex: 1 | 2 | 3;
  actions: Record<ActionOption, ActionOutcome>;
};

export const getAvailableActions = (a1: ActionOption, a2: ActionOption): ActionOption[] => {
  if (a1 == PlayerAction.EMPTY) {
    return AllPlayerActions.filter(key => {
      return !ExhaustiveGameBranch.actions[key as ActionOption].revert;
    });
  }
  if (a2 == PlayerAction.EMPTY) {
    return AllPlayerActions.filter(key => {
      const leaf = ExhaustiveGameBranch.actions[a1].branch?.actions[key];
      return leaf != null && !leaf.revert;
    });
  }
  return AllPlayerActions.filter(key => {
    const leaf = ExhaustiveGameBranch.actions[a1].branch?.actions[a2].branch?.actions[key];
    return leaf != null && !leaf.revert;
  });
};

export const ExhaustiveGameBranch: PokerGameBranch = {
  // P1
  actionIndex: 1,
  actions: {
    [PlayerAction.EMPTY]: revertInvalidAction,
    [PlayerAction.CHECK]: {
      expect: [],
      branch: {
        // P2
        actionIndex: 2,
        actions: {
          [PlayerAction.EMPTY]: revertInvalidAction,
          [PlayerAction.CHECK]: {
            expect: [Expectation.Showdown],
          },
          [PlayerAction.BET]: {
            expect: [Expectation.TakeBet],
            branch: {
              // P1
              actionIndex: 3,
              actions: {
                [PlayerAction.EMPTY]: revertInvalidAction,
                [PlayerAction.CHECK]: revertInvalidAction,
                [PlayerAction.BET]: revertInvalidAction,
                [PlayerAction.FOLD]: {
                  expect: [Expectation.Fold],
                },
                [PlayerAction.CALL]: {
                  expect: [Expectation.TakeBet, Expectation.Showdown],
                },
              },
            },
          },
          [PlayerAction.FOLD]: revertInvalidAction,
          [PlayerAction.CALL]: revertInvalidAction,
        },
      },
    },
    [PlayerAction.BET]: {
      expect: [Expectation.TakeBet],
      branch: {
        // P2
        actionIndex: 2,
        actions: {
          [PlayerAction.EMPTY]: revertInvalidAction,
          [PlayerAction.CHECK]: revertInvalidAction,
          [PlayerAction.BET]: revertInvalidAction,
          [PlayerAction.FOLD]: {
            expect: [Expectation.Fold],
          },
          [PlayerAction.CALL]: {
            expect: [Expectation.TakeBet, Expectation.Showdown],
          },
        },
      },
    },
    [PlayerAction.FOLD]: revertInvalidAction,
    [PlayerAction.CALL]: revertInvalidAction,
  },
};

// STORE

type GameUserData = {
  address: string;
  isWinner: boolean;
  isLoser: boolean;
  isActive: boolean;
  chips: bigint | undefined;
  actions: { index: 1 | 2 | 3; action: ActionOption }[];
  card: KuhnCard;
  outcome: GameOutcome;
};

const EmptyGameUserData: GameUserData = {
  address: ZeroAddress,
  isWinner: false,
  isLoser: false,
  isActive: false,
  chips: undefined,
  actions: [],
  card: "empty",
  outcome: GameOutcome.EMPTY,
};

export const useGameState = create<GameState>(() => ({
  address: null,
  gameState: null,
  playerCard: null,
}));

export const useWriteDisabled = () => {
  const { chain: connectedChain } = useNetwork();
  const { targetNetwork } = useTargetNetwork();

  return !connectedChain || connectedChain?.id !== targetNetwork.id;
};

export const useGameStateUpdater = () => {
  const { address } = useAccount();

  const { data: gameState, refetch } = useScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "getUserGameState",
    args: [address],
  });

  useInterval(refetch, 2000);

  useEffect(() => {
    useGameState.setState({ address, gameState: gameState });
  }, [address, gameState]);
};

export const useGamePot = () => {
  return useGameState(state => state.gameState?.game?.state?.pot);
};

export const useActiveGid = () => {
  return useGameState(state => state.gameState?.game?.gid);
};

export const useGamePlayerCardUpdater = () => {
  const gid = useActiveGid();

  const { data: playerCard } = useFhenixScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "getGameCard",
    args: [InjectFhenixPermission, gid == null || gid === 0n ? undefined : gid],
  });

  useEffect(() => {
    useGameState.setState({ playerCard: playerCard == null ? playerCard : Number(playerCard) });
  }, [playerCard]);
};

export const generateSuitsFromGid = (gid: bigint): ["red" | "black", "red" | "black"] => {
  const num = Number(gid);
  // Convert the number to a 32-bit integer using bitwise OR with 0.
  const hash = num | 0;

  // Crate two booleans based on specific bits from the hashed number.
  const bool1 = (hash & 1) !== 0; // Check the least significant bit.
  const bool2 = (hash & 2) !== 0; // Check the second least significant bit.

  return [bool1 ? "red" : "black", bool2 ? "red" : "black"];
};

export const useOpponentAddress = () => {
  return useGameState(({ gameState: game, address }) => {
    if (address == null || game == null) return ZeroAddress;
    return game.game.playerA === address ? game.game.playerB : game.game.playerA;
  });
};

export const useUserPlayerData = () => {
  return useGameState(({ gameState, address, playerCard }): GameUserData & { requiresReveal: boolean } => {
    if (gameState == null || address == null) return { ...EmptyGameUserData, requiresReveal: false };

    const { game, selfChips } = gameState;

    const gameEnded = game.outcome.winner !== ZeroAddress;

    return {
      address,
      isWinner: gameEnded && address === game.outcome.winner,
      isLoser: gameEnded && address !== game.outcome.winner,
      isActive: game.gid !== 0n && address === game.state.activePlayer,
      chips: selfChips,
      actions:
        address === game.state.startingPlayer
          ? [
              { index: 1, action: game.state.action1 },
              { index: 3, action: game.state.action3 },
            ]
          : [{ index: 2, action: game.state.action2 }],
      card:
        game == null || game.gid === 0n
          ? "empty"
          : playerCard == null
          ? "hidden"
          : {
              rank: playerCard,
              suit: generateSuitsFromGid(game.gid)[1],
            },
      outcome: game.outcome.outcome,
      requiresReveal: game.state.accepted && playerCard == null,
    };
  });
};

export const useOpponentData = () => {
  return useGameState(({ gameState, address }): GameUserData => {
    if (gameState == null || address == null) return EmptyGameUserData;

    const { game, opponentChips } = gameState;

    const gameEnded = game.outcome.winner !== ZeroAddress;
    const userIsPlayerA = game.playerA === address;
    const opponent = userIsPlayerA ? game.playerB : game.playerA;

    return {
      address: opponent,
      isWinner: gameEnded && opponent === game.outcome.winner,
      isLoser: gameEnded && opponent !== game.outcome.winner,
      isActive: game.gid !== 0n && opponent === game.state.activePlayer,
      chips: opponentChips,
      actions:
        opponent === game.state.startingPlayer
          ? [
              { index: 1, action: game.state.action1 },
              { index: 3, action: game.state.action3 },
            ]
          : [{ index: 2, action: game.state.action2 }],
      card:
        game == null || game.gid === 0n
          ? "empty"
          : game.outcome.winner === ZeroAddress
          ? "hidden"
          : {
              rank: userIsPlayerA ? game.outcome.cardB : game.outcome.cardA,
              suit: generateSuitsFromGid(game.gid)[0],
            },
      outcome: game.outcome.outcome,
    };
  });
};

export const useGameStep = () => {
  return useGameState(({ gameState }) => {
    if (gameState == null) return "loading";
    const { game } = gameState;
    if (game == null) return "loading";
    if (game.gid === 0n && gameState.selfGid === 0n) return "idle";
    if (game.state.accepted && game.outcome.outcome === GameOutcome.EMPTY) return "in-game";
    return "out-of-game";
  });
};

export const useInGameActionsData = () => {
  return useGameState(({ gameState, address }) => {
    if (gameState == null || address == null) return { isPlayerActive: false, availableActions: [] };

    const { game } = gameState;

    return {
      isPlayerActive: game.state.activePlayer !== ZeroAddress && game.state.activePlayer === address,
      availableActions: getAvailableActions(game.state.action1, game.state.action2),
    };
  });
};

export const useOutOfGameActionsData = () => {
  return useGameState(({ gameState, address }) => {
    if (gameState == null || address == null)
      return {
        waitingForNewGameToBeAccepted: false,
        selfRequestedRematch: false,
        opponentHasLeft: false,
        opponentRequestedRematch: false,
        rematchRequestAvailable: false,
        waitingForOpponentToAcceptRematch: false,
        outcomeText: null,
      };

    const { game, rematchGid, selfGid, activeGid, opponentGid } = gameState;

    const gameHasEnded = game?.outcome.outcome !== GameOutcome.EMPTY;
    const waitingForGameAccepted = !game.state.accepted && selfGid !== 0n;
    const rematchExists = rematchGid !== 0n && rematchGid !== activeGid;

    const waitingForNewGameToBeAccepted = waitingForGameAccepted && !rematchExists;

    const opponentHasLeft = opponentGid !== activeGid && opponentGid !== rematchGid;

    const waitingForOpponentToAcceptRematch = waitingForGameAccepted && rematchExists;
    const rematchRequestAvailable = gameHasEnded && !rematchExists && !opponentHasLeft;
    const selfRequestedRematch = rematchExists && selfGid === rematchGid;
    const opponentRequestedRematch = rematchExists && opponentGid === rematchGid;

    const playerIsWinner = game.outcome.winner !== ZeroAddress && game.outcome.winner === address;
    const outcome = game.outcome.outcome;

    const outcomeText =
      game.outcome.winner === ZeroAddress
        ? null
        : `${playerIsWinner ? "You have" : "Your opponent has"} won ${game.state.pot} chips by ${outcomeToText(
            outcome,
          )}!`;

    return {
      waitingForNewGameToBeAccepted,
      selfRequestedRematch,
      opponentHasLeft,
      opponentRequestedRematch,
      rematchRequestAvailable,
      waitingForOpponentToAcceptRematch,
      outcomeText,
    };
  });
};

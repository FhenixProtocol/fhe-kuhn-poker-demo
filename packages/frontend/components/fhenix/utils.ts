import { AbiFunctionReturnType, ContractAbi } from "~~/utils/scaffold-eth/contract";

export enum GameOutcome {
  EMPTY,
  A_BY_SHOWDOWN,
  B_BY_SHOWDOWN,
  A_BY_FOLD,
  B_BY_FOLD,
}

export enum PlayerAction {
  EMPTY,
  CHECK,
  BET,
  FOLD,
  CALL,
}

export type GameInfo = AbiFunctionReturnType<ContractAbi<"FHEKuhnPoker">, "getGame">;

export const getGameActionIndex = (game: GameInfo) => {
  if (game.action1 === PlayerAction.EMPTY) return 1;
  if (game.action2 === PlayerAction.EMPTY) return 2;
  return 3;
};

export const outcomeToText = (outcome: GameOutcome) => {
  switch (outcome) {
    case GameOutcome.EMPTY:
      return "NONE";
    case GameOutcome.A_BY_SHOWDOWN:
      return "P1 WON BY SHOWDOWN";
    case GameOutcome.B_BY_SHOWDOWN:
      return "P2 WON BY SHOWDOWN";
    case GameOutcome.A_BY_FOLD:
      return "P1 WON BY FOLD";
    case GameOutcome.B_BY_FOLD:
      return "P2 WON BY FOLD";
    default:
      return "UNKNOWN";
  }
};

export const cardSymbol = (card?: number) => {
  switch (card) {
    case 1:
      return { symbol: "J", hidden: false } as const;
    case 2:
      return { symbol: "Q", hidden: false } as const;
    case 3:
      return { symbol: "K", hidden: false } as const;
    default:
    case undefined:
      return { symbol: undefined, hidden: true };
  }
};

export const displayGameId = (gid: bigint) => {
  return `GAME # ${`00${gid.toString()}`.slice(-3)}`;
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

export const ellipseAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const playerActionNumToName = (n: ActionOption) => {
  switch (n) {
    case 0:
      return "EMPTY";
    case 1:
      return "CHECK";
    case 2:
      return "BET";
    case 3:
      return "FOLD";
    case 4:
      return "CALL";
  }
};

export const playerActionNameToNum = (n: string) => {
  switch (n) {
    case "EMPTY":
      return 0;
    case "CHECK":
      return 1;
    case "BET":
      return 2;
    case "FOLD":
      return 3;
    case "CALL":
      return 4;
    default:
      return -1;
  }
};

export const AllPlayerActions = [
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return !ExhaustiveGameBranch.actions[a1].branch!.actions[key].revert;
    });
  }
  return AllPlayerActions.filter(key => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return !ExhaustiveGameBranch.actions[a1].branch!.actions[a2].branch!.actions[key].revert;
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

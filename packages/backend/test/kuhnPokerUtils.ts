export const GameOutcome = {
  EMPTY: 0,
  A_BY_SHOWDOWN: 1,
  B_BY_SHOWDOWN: 2,
  A_BY_FOLD: 3,
  B_BY_FOLD: 4,
} as const;

export const PlayerAction = {
  EMPTY: 0,
  CHECK: 1,
  BET: 2,
  FOLD: 3,
  CALL: 4,
} as const;

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
      return !ExhaustiveGameBranch.actions[a1].branch!.actions[key].revert;
    });
  }
  return AllPlayerActions.filter(key => {
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

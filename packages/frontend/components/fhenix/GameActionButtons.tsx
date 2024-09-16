import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { playerActionNumToName } from "./utils";

export const ActionButton: React.FC<{ disabled?: boolean; actionId: number }> = ({ actionId }) => {
  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "FHEKuhnPoker",
    functionName: "performAction",
    args: [actionId],
  });

  return (
    <button disabled={isMining} className="btn btn-primary min-w-36" onClick={() => writeAsync()}>
      {isMining && <span className="loading loading-spinner loading-xs" />}
      {playerActionNumToName(actionId)}
    </button>
  );
};

export const DealMeInButton: React.FC<{ disabled?: boolean }> = ({ disabled }) => {
  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "FHEKuhnPoker",
    functionName: "dealMeIn",
    args: [100n],
  });

  return (
    <button disabled={disabled || isMining} className="btn btn-primary min-w-36" onClick={() => writeAsync()}>
      {isMining && <span className="loading loading-spinner loading-xs" />}
      Deal Me In
    </button>
  );
};

export const FindGameButton: React.FC<{ disabled?: boolean }> = ({ disabled }) => {
  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "FHEKuhnPoker",
    functionName: "findGame",
  });

  return (
    <button disabled={disabled || isMining} className="btn btn-primary min-w-36" onClick={() => writeAsync()}>
      {isMining && <span className="loading loading-spinner loading-xs" />}
      Find New Game
    </button>
  );
};

export const RematchButton: React.FC<{ disabled?: boolean; text: string }> = ({ disabled, text }) => {
  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "FHEKuhnPoker",
    functionName: "rematch",
  });

  return (
    <button disabled={disabled || isMining} className="btn btn-primary min-w-36" onClick={() => writeAsync()}>
      {isMining && <span className="loading loading-spinner loading-xs" />}
      {text}
    </button>
  );
};

export const ResignButton: React.FC<{ disabled?: boolean }> = ({ disabled }) => {
  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "FHEKuhnPoker",
    functionName: "resign",
  });

  return (
    <button disabled={disabled || isMining} className="btn btn-outline min-w-36" onClick={() => writeAsync()}>
      {isMining && <span className="loading loading-spinner loading-xs" />}
      Resign
    </button>
  );
};

export const TimeoutOpponentButton: React.FC<{ disabled?: boolean }> = ({ disabled }) => {
  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "FHEKuhnPoker",
    functionName: "timeoutOpponent",
  });

  return (
    <button disabled={disabled || isMining} className="btn btn-primary min-w-36" onClick={() => writeAsync()}>
      {isMining && <span className="loading loading-spinner loading-xs" />}
      Timeout Opponent
    </button>
  );
};

export const CancelSearchButton: React.FC<{ disabled?: boolean; text: string }> = ({ disabled, text }) => {
  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "FHEKuhnPoker",
    functionName: "cancelSearch",
  });

  return (
    <button disabled={disabled || isMining} className="btn btn-primary min-w-36" onClick={() => writeAsync()}>
      {isMining && <span className="loading loading-spinner loading-xs" />}
      {text}
    </button>
  );
};

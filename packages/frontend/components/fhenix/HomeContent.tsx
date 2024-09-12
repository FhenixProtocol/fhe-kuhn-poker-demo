import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { times } from "lodash";
import { useAccount, useNetwork } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { Address } from "../scaffold-eth";
import { useState } from "react";
import { useInterval } from "usehooks-ts";

const JoinGameButton: React.FC<{ gid: bigint }> = ({ gid }) => {
  const { chain: connectedChain } = useNetwork();
  const { targetNetwork } = useTargetNetwork();

  const { writeAsync: joinGame, isMining } = useScaffoldContractWrite({
    contractName: "FHEKuhnPoker",
    functionName: "joinGame",
    args: [gid],
    blockConfirmations: 1,
  });
  const writeDisabled = !connectedChain || connectedChain?.id !== targetNetwork.id;

  return (
    <div
      className={`flex gap-2 flex-wrap ${
        writeDisabled &&
        "tooltip before:content-[attr(data-tip)] before:right-[-10px] before:left-auto before:transform-none"
      }`}
      data-tip={`${writeDisabled && "Wallet not connected or incorrect network."}`}
    >
      <button className="btn" disabled={writeDisabled || isMining} onClick={() => joinGame()}>
        {isMining && <span className="loading loading-spinner loading-xs" />}
        Join Game
      </button>
    </div>
  );
};

const GameOverview: React.FC<{ gid: bigint }> = ({ gid }) => {
  const { data: gameData } = useScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "getGame",
    args: [gid],
  });

  if (gameData == null) return null;

  console.log({
    gameData,
  });
  return (
    <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl gap-4">
      {gameData.accepted ? "ACTIVE GAME" : "AVAILABLE GAME"}
      <p>Game: #{`${gid}`}</p>
      {!gameData.accepted && <JoinGameButton gid={gid} />}
    </div>
  );
};

const CreateGameButton = () => {
  const { chain: connectedChain } = useNetwork();
  const { targetNetwork } = useTargetNetwork();

  const { writeAsync: createGame, isMining } = useScaffoldContractWrite({
    contractName: "FHEKuhnPoker",
    functionName: "createGame",
    blockConfirmations: 1,
  });
  const writeDisabled = !connectedChain || connectedChain?.id !== targetNetwork.id;

  return (
    <div
      className={`flex gap-2 flex-wrap ${
        writeDisabled &&
        "tooltip before:content-[attr(data-tip)] before:right-[-10px] before:left-auto before:transform-none"
      }`}
      data-tip={`${writeDisabled && "Wallet not connected or incorrect network."}`}
    >
      <button className="btn" disabled={writeDisabled || isMining} onClick={() => createGame()}>
        {isMining && <span className="loading loading-spinner loading-xs" />}
        Create
      </button>
    </div>
  );
};

const ChipsRow = () => {
  const { address } = useAccount();
  const { data: chips, refetch } = useScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "chips",
    args: [address],
  });

  useInterval(refetch, 2000);

  return (
    <div className="flex flex-row justify-between items-center space-x-2 w-full">
      <p className="mb-2">Chips:</p>
      {chips == null ? (
        <div className="animate-pulse bg-slate-300 h-6 w-12 mt-4 mb-2 rounded"></div>
      ) : (
        <p className="mb-2 font-bold">{chips.toString()}</p>
      )}
    </div>
  );
};

const DealMeInButtons = () => {
  const { chain: connectedChain } = useNetwork();
  const { targetNetwork } = useTargetNetwork();
  const [dealingInAmount, setDealingInAmount] = useState(0n);

  const { writeAsync: dealMeIn, isMining } = useScaffoldContractWrite({
    contractName: "FHEKuhnPoker",
    functionName: "dealMeIn",
    args: [10n],
    blockConfirmations: 1,
  });
  const writeDisabled = !connectedChain || connectedChain?.id !== targetNetwork.id;

  const dealMeAmount = async (amount: bigint) => {
    setDealingInAmount(amount);
    await dealMeIn({ args: [amount] });
    setDealingInAmount(0n);
  };

  return (
    <div
      className={`join ml-auto mb-4 ${
        writeDisabled &&
        "tooltip before:content-[attr(data-tip)] before:right-[-10px] before:left-auto before:transform-none"
      }`}
      data-tip={`${writeDisabled && "Wallet not connected or incorrect network."}`}
    >
      {[10n, 100n, 1000n].map(amount => (
        <button
          key={amount}
          className="btn join-item btn-sm"
          disabled={writeDisabled || isMining}
          onClick={() => dealMeAmount(amount)}
        >
          {dealingInAmount === amount && isMining && <span className="loading loading-spinner loading-xs" />}
          {`+${amount}`}
        </button>
      ))}
    </div>
  );
};

const PlayerCard = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-s rounded-3xl gap-4">
      <div className="flex flex-row justify-between items-center space-x-2 w-full">
        <p>Player:</p>
        <Address address={connectedAddress} />
      </div>
      <div className="flex flex-col w-full">
        <ChipsRow />
        <DealMeInButtons />
      </div>

      <div className="flex flex-row justify-between items-center space-x-2 w-full">
        <p>Create Game: </p>
        <CreateGameButton />
      </div>
    </div>
  );
};

const HomeContent = () => {
  const { data: gid, refetch } = useScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "gid",
  });

  useInterval(refetch, 2000);

  return (
    <>
      <PlayerCard />
      {gid != null && times(Number(gid), i => <GameOverview key={i} gid={BigInt(i)} />)}
    </>
  );
};

export default HomeContent;

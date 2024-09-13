import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useAccount, useNetwork } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { Address } from "../scaffold-eth";
import { useState } from "react";
import { useInterval } from "usehooks-ts";
import { ZeroAddress } from "ethers";
import { displayGameId, ellipseAddress, GameInfo, outcomeToText } from "./utils";
import Link from "next/link";

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

const GameOverview: React.FC<{ game: GameInfo }> = ({ game }) => {
  const { address } = useAccount();
  return (
    <div className="flex flex-col bg-base-100 px-4 py-4 text-center text-sm items-center max-w-xs rounded-3xl gap-4">
      <p>{displayGameId(game.gid)}</p>

      <table className="table table-sm">
        <tbody>
          <tr>
            <th className="text-sm font-normal">Player 1:</th>
            <th className="font-normal text-right">
              <code>{ellipseAddress(game.playerA)}</code>
            </th>
          </tr>
          <tr>
            <th className="text-sm font-normal">Player 2:</th>
            <th className="font-normal text-right">
              <code>{game.playerB === ZeroAddress ? "NONE" : ellipseAddress(game.playerB)}</code>
            </th>
          </tr>
          <tr>
            <th className="text-sm font-normal">Pot:</th>
            <th className="font-normal text-right">
              <code>
                {`${game.pot}`} chip{game.pot > 1n ? "s" : ""}
              </code>
            </th>
          </tr>
          <tr>
            <th className="text-sm font-normal">Outcome:</th>
            <th className="font-normal text-right">
              <code>{game.outcome.outcome === 0 ? "NONE" : outcomeToText(game.outcome.outcome)}</code>
            </th>
          </tr>
        </tbody>
      </table>
      {!game.state.accepted && game.playerA !== address && <JoinGameButton gid={game.gid} />}
      {game.state.accepted && (game.playerA == address || game.playerB == address) && (
        <Link href={`/game/${game.gid}`} passHref className="btn gap-1">
          Open Game
        </Link>
      )}
    </div>
  );
};

const FindGameButton = () => {
  const { chain: connectedChain } = useNetwork();
  const { targetNetwork } = useTargetNetwork();

  const { writeAsync: findGame, isMining } = useScaffoldContractWrite({
    contractName: "FHEKuhnPoker",
    functionName: "findGame",
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
      <button className="btn" disabled={writeDisabled || isMining} onClick={() => findGame()}>
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
        <FindGameButton />
      </div>
    </div>
  );
};

const HomeContent = () => {
  const { address } = useAccount();

  const { data: userGames, refetch: refetchUserGames } = useScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "getUserGames",
    args: [address],
  });

  useInterval(() => {
    refetchUserGames();
  }, 2000);

  return (
    <>
      <PlayerCard />
      <p>Your Active Games</p>
      <div className="flex flex-row justify-center items-center gap-4 flex-wrap">
        {userGames != null &&
          userGames
            .filter(
              game =>
                game.playerA !== ZeroAddress && game.playerB !== ZeroAddress && game.outcome.winner === ZeroAddress,
            )
            .map(game => <GameOverview key={game.gid} game={game} />)}
      </div>

      <p>Your Past Games</p>
      <div className="flex flex-row justify-center items-center gap-4 flex-wrap">
        {userGames != null &&
          userGames
            .filter(game => game.outcome.winner !== ZeroAddress)
            .map(game => <GameOverview key={game.gid} game={game} />)}
      </div>
    </>
  );
};

export default HomeContent;

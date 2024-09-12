"use client";

import { EyeIcon } from "@heroicons/react/24/outline";
import { useAccount } from "wagmi";
import { PlayingCard } from "~~/components/fhenix/PlayingCard";
import {
  cardSymbol,
  displayGameId,
  ellipseAddress,
  generateSuitsFromGid,
  getAvailableActions,
  getGameActionIndex,
  playerActionNumToName,
} from "~~/components/fhenix/utils";
import { useDeployedContractInfo, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useFhenixScaffoldContractRead } from "~~/hooks/scaffold-eth/useFhenixScaffoldContractRead";
import { useCreateFhenixPermit } from "~~/services/fhenix/store";
import { InjectFhenixPermission } from "~~/utils/fhenixUtilsTypes";

type PageProps = {
  params: { gid: string };
};

const RevealCardButton = () => {
  const createFhenixPermit = useCreateFhenixPermit();
  const { address } = useAccount();
  const { data: deployedContractData } = useDeployedContractInfo("FHEKuhnPoker");

  return (
    <button className="btn absolute" onClick={() => createFhenixPermit(deployedContractData?.address, address)}>
      <EyeIcon className="h-6 w-6" />
    </button>
  );
};

type PlayerProps = {
  player: 1 | 2;
  address: string;
  suit: "red" | "black";
  card?: number;
  activePlayer: string;
  requiresPermissionToReveal?: boolean;
};
const PlayerWithCard = ({
  player,
  address,
  card,
  suit,
  activePlayer,
  requiresPermissionToReveal = false,
}: PlayerProps) => {
  const { symbol, hidden } = cardSymbol(card);
  const isActivePlayer = address === activePlayer;
  return (
    <div
      className={`flex ${
        player === 1 ? "flex-col items-start mb-44" : "flex-col-reverse items-end mt-44"
      } justify-start text-sm relative`}
    >
      <div
        className={`absolute -inset-x-12 -inset-y-6 transition-opacity -z-10 ${
          isActivePlayer ? "opacity-100" : "opacity-0"
        } `}
      >
        <div className="absolute inset-0 rounded-3xl bg-black opacity-10" />
        <div className="absolute inset-0 rounded-3xl border-4 border-white shadow-md animate-pulse" />
      </div>
      <div>
        <code className={`${isActivePlayer ? "font-bold" : ""} text-sm`}>
          {player === 1 ? "OPPONENT:" : "YOU:"}
          <br />
          {ellipseAddress(address)}
        </code>
      </div>
      <br />
      <div className="text-white m-4 text-sm">
        CHIPS: <b className="text-lg">4</b>
      </div>
      <PlayingCard suit={suit} rank={symbol} hidden={hidden} ping={isActivePlayer}>
        {requiresPermissionToReveal && <RevealCardButton />}
      </PlayingCard>
    </div>
  );
};

const Game = ({ params }: PageProps) => {
  const gid = BigInt(params.gid);

  const { address } = useAccount();

  const { data: game } = useScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "getGame",
    args: [gid],
  });

  const { data: playerCard } = useFhenixScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "getGameCard",
    args: [InjectFhenixPermission, gid],
  });

  if (game == null || address == null)
    return (
      <div className="flex items-center flex-col flex-grow pt-10">
        <p>loading game...</p>
      </div>
    );

  const [suit1, suit2] = generateSuitsFromGid(gid);

  const userIsPlayerA = game.playerA === address;
  const player1 = userIsPlayerA ? game.playerB : game.playerA;
  const player2 = userIsPlayerA ? game.playerA : game.playerB;
  const startingPlayer = game.startingPlayer === 0 ? game.playerA : game.playerB;
  const oppositePlayer = game.startingPlayer === 0 ? game.playerB : game.playerA;

  const actionPlayers = {
    1: { player: startingPlayer, opposite: oppositePlayer },
    2: { player: oppositePlayer, opposite: startingPlayer },
    3: { player: startingPlayer, opposite: oppositePlayer },
  };

  const actionIndex = getGameActionIndex(game);
  const activePlayer = actionPlayers[actionIndex].player;

  const availableActionIds = getAvailableActions(game.action1, game.action2);

  return (
    <div className="flex gap-12 items-center flex-col flex-grow py-10">
      <p>{displayGameId(gid)}</p>
      <div className="flex flex-row gap-16 justify-center items-center relative">
        <div className="absolute rounded-full bg-green-600 -inset-x-36 inset-y-12 -z-10 shadow-lg" />
        <PlayerWithCard player={1} address={player1} suit={suit1} card={undefined} activePlayer={activePlayer} />
        <div className="flex flex-col justify-center items-center text-white">
          <span className="text-sm">POT:</span>
          <b className="text-3xl">{game.pot.toString()}</b>
        </div>
        <PlayerWithCard
          player={2}
          address={player2}
          suit={suit2}
          card={playerCard == null ? undefined : Number(playerCard)}
          activePlayer={activePlayer}
          requiresPermissionToReveal={playerCard == null}
        />
      </div>
      <div className="flex flex-col justify-center items-center">
        <p>
          It is <b>{activePlayer === address ? "Your" : "Your Opponent's"}</b> turn:
        </p>
        <p>{availableActionIds.map(actionId => playerActionNumToName(actionId)).join(" or ")}</p>
      </div>
    </div>
  );
};

export default Game;

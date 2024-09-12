"use client";

import { EyeIcon } from "@heroicons/react/24/outline";
import { useAccount, useNetwork } from "wagmi";
import { PlayingCard } from "~~/components/fhenix/PlayingCard";
import {
  cardSymbol,
  ellipseAddress,
  GameOutcome,
  generateSuitsFromGid,
  getAvailableActions,
  getGameActionIndex,
  PlayerAction,
  playerActionNumToName,
} from "~~/components/fhenix/utils";
import { useDeployedContractInfo, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useFhenixScaffoldContractRead } from "~~/hooks/scaffold-eth/useFhenixScaffoldContractRead";
import { useCreateFhenixPermit } from "~~/services/fhenix/store";
import { InjectFhenixPermission } from "~~/utils/fhenixUtilsTypes";
import { motion, AnimatePresence } from "framer-motion";
import { Fragment, useState } from "react";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useInterval } from "usehooks-ts";
import { ZeroAddress } from "ethers";

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
  activePlayer?: string;
  playersActions: { index: number; action: PlayerAction }[];
  requiresPermissionToReveal?: boolean;
  winner: string;
  outcome: GameOutcome;
};
const PlayerWithCard = ({
  player,
  address,
  card,
  suit,
  activePlayer,
  playersActions,
  requiresPermissionToReveal = false,
  winner,
  outcome,
}: PlayerProps) => {
  const { symbol, hidden } = cardSymbol(card);
  const isActivePlayer = address === activePlayer;
  const isWinner = winner !== ZeroAddress && address === winner;
  const isLoser = winner !== ZeroAddress && address !== winner;
  const outcomeIsShowdown = outcome === GameOutcome.A_BY_SHOWDOWN || outcome === GameOutcome.B_BY_SHOWDOWN;
  return (
    <div
      className={`flex h-[300px] ${player === 1 ? "flex-col items-start mb-44" : "flex-col-reverse items-end mt-44"} ${
        isLoser && "opacity-40"
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
      <div className="text-white m-2 text-sm">
        CHIPS: <b className="text-lg">4</b>
      </div>
      <PlayingCard suit={suit} rank={symbol} hidden={hidden} gold={isWinner} wiggle={isActivePlayer || isWinner}>
        {requiresPermissionToReveal && <RevealCardButton />}
      </PlayingCard>
      <br />
      <AnimatePresence>
        {playersActions
          .filter(({ action }) => action !== PlayerAction.EMPTY)
          .map(({ index, action }) => (
            <motion.div
              initial={{ opacity: 0, y: player === 1 ? -10 : 10, rotate: "0deg" }}
              animate={{ opacity: 1, y: 0, rotate: "6deg" }}
              exit={{ opacity: 0, y: player === 1 ? -10 : 10, rotate: "0deg" }}
              className="text-white font-bold text-lg mx-4 tracking-wider"
              key={index}
            >
              {index}. {playerActionNumToName(action)}!
            </motion.div>
          ))}
        {isWinner && (
          <motion.div
            initial={{ opacity: 0, y: player === 1 ? -10 : 10, rotate: "0deg" }}
            animate={{ opacity: 1, y: 0, rotate: "6deg" }}
            exit={{ opacity: 0, y: player === 1 ? -10 : 10, rotate: "0deg" }}
            className={`text-white font-bold text-lg mx-4 tracking-wider my-4 ${player === 2 && "text-right"}`}
            key="winner"
          >
            WINNER BY
            <br />
            {outcomeIsShowdown ? "SHOWDOWN" : "FOLD"}!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Game = ({ params }: PageProps) => {
  const gid = BigInt(params.gid);

  const { address } = useAccount();
  const { chain: connectedChain } = useNetwork();
  const { targetNetwork } = useTargetNetwork();

  const { data: game, refetch } = useScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "getGame",
    args: [gid],
  });

  useInterval(refetch, 2000);

  const { data: playerCard } = useFhenixScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "getGameCard",
    args: [InjectFhenixPermission, gid],
  });

  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "FHEKuhnPoker",
    functionName: "performAction",
    args: [undefined, undefined],
  });
  const [performingAction, setPerformingAction] = useState(0);

  const writeDisabled = !connectedChain || connectedChain?.id !== targetNetwork.id;

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

  const startingPlayerActions = [
    { index: 1, action: game.action1 },
    { index: 3, action: game.action3 },
  ];
  const oppositePlayerActions = [{ index: 2, action: game.action2 }];
  const player1Actions = player1 === startingPlayer ? startingPlayerActions : oppositePlayerActions;
  const player2Actions = player1 === startingPlayer ? oppositePlayerActions : startingPlayerActions;

  const actionPlayers = {
    1: { player: startingPlayer, opposite: oppositePlayer },
    2: { player: oppositePlayer, opposite: startingPlayer },
    3: { player: startingPlayer, opposite: oppositePlayer },
  };

  const winner = game.outcome.winner;
  const playerIsWinner = winner === address;
  const outcome = game.outcome.outcome;
  const outcomeIsShowdown = outcome === GameOutcome.A_BY_SHOWDOWN || outcome === GameOutcome.B_BY_SHOWDOWN;

  const revealedPlayer1Card = userIsPlayerA ? game.outcome.cardB : game.outcome.cardA;

  const actionIndex = getGameActionIndex(game);
  const activePlayer = winner === ZeroAddress ? actionPlayers[actionIndex].player : undefined;

  const availableActionIds = getAvailableActions(game.action1, game.action2);

  const performAction = async (actionId: number) => {
    setPerformingAction(actionId);
    await writeAsync({ args: [gid, actionId] });
    setPerformingAction(0);
  };

  return (
    <div className="flex gap-12 justify-center items-center flex-col flex-grow py-10">
      <div className="flex flex-row gap-16 justify-center items-center relative">
        <div className="absolute rounded-full bg-green-600 -inset-x-36 inset-y-12 -z-10 shadow-lg" />
        <PlayerWithCard
          player={1}
          address={player1}
          suit={suit1}
          playersActions={player1Actions}
          card={winner != ZeroAddress ? revealedPlayer1Card : undefined}
          activePlayer={activePlayer}
          winner={winner}
          outcome={outcome}
        />
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
          playersActions={player2Actions}
          requiresPermissionToReveal={playerCard == null}
          winner={winner}
          outcome={outcome}
        />
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        {activePlayer != null && activePlayer === address && (
          <>
            <div>Its your turn:</div>
            <div className="flex flex-row gap-4">
              {availableActionIds.map(actionId => (
                <button
                  disabled={writeDisabled || isMining}
                  key={actionId}
                  className="btn btn-primary w-36"
                  onClick={() => performAction(Number(actionId))}
                >
                  {performingAction === Number(actionId) && isMining && (
                    <span className="loading loading-spinner loading-xs" />
                  )}
                  {playerActionNumToName(actionId)}
                </button>
              ))}
            </div>
          </>
        )}
        {activePlayer != null && activePlayer !== address && (
          <div>
            Waiting for <b>Your Opponent</b> to{" "}
            {availableActionIds.map((actionId, i) => (
              <Fragment key={actionId}>
                <b>{playerActionNumToName(actionId)}</b>
                {i < availableActionIds.length - 1 && " or "}
              </Fragment>
            ))}
          </div>
        )}
        {winner != ZeroAddress && (
          <div className="font-bold">
            {playerIsWinner ? "You have" : "Your Opponent has"} won {game.pot} chips by{" "}
            {outcomeIsShowdown ? "SHOWDOWN" : "FOLD"}!
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;

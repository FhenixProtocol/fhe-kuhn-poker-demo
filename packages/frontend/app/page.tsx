"use client";

import { EyeIcon } from "@heroicons/react/24/outline";
import { useAccount, useNetwork } from "wagmi";
import { PlayingCard } from "~~/components/fhenix/PlayingCard";
import {
  cardSymbol,
  ellipseAddress,
  GameInfo,
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
import { Fragment } from "react";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useInterval } from "usehooks-ts";
import { ZeroAddress } from "ethers";

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
  gid: bigint | undefined;
  player: 1 | 2;
  address: string;
  suit: "red" | "black";
  card?: number;
  chips?: bigint;
  activePlayer?: string;
  playersActions: { index: number; action: PlayerAction }[];
  requiresPermissionToReveal?: boolean;
  winner: string;
  outcome: GameOutcome;
};
const PlayerWithCard = ({
  gid,
  player,
  address,
  card,
  suit,
  chips,
  activePlayer,
  playersActions,
  requiresPermissionToReveal = false,
  winner,
  outcome,
}: PlayerProps) => {
  const { symbol, hidden } = cardSymbol(card);
  const isActivePlayer = activePlayer != ZeroAddress && address === activePlayer;
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
        CHIPS: <code className="text-lg">{chips == null ? "..." : chips.toString()}</code>
      </div>
      <PlayingCard
        empty={gid == null || gid === 0n || address === ZeroAddress}
        suit={suit}
        rank={symbol}
        hidden={hidden}
        gold={isWinner}
        wiggle={isActivePlayer || isWinner}
      >
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

const OppositePlayerSeat: React.FC<{ gid: bigint | undefined }> = ({ gid }) => {
  const { address } = useAccount();
  const { data: game, refetch } = useScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "getGame",
    args: [gid],
  });

  const userIsPlayerA = game?.playerA === address;
  const playerAddress = userIsPlayerA ? game?.playerB : game?.playerA;

  const { data: chips } = useScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "chips",
    args: [playerAddress],
  });

  useInterval(refetch, 2000);

  if (gid == null || game == null || playerAddress == null) return null;

  const suit = generateSuitsFromGid(gid)[0];

  const actionIndex = getGameActionIndex(game);
  const activePlayer = game.state.activePlayer;
  const inActivePlayer = activePlayer === game.playerA ? game.playerB : game.playerA;

  const startingPlayer = actionIndex === 1 || actionIndex === 3 ? activePlayer : inActivePlayer;

  const startingPlayerActions = [
    { index: 1, action: game.state.action1 },
    { index: 3, action: game.state.action3 },
  ];
  const oppositePlayerActions = [{ index: 2, action: game.state.action2 }];
  const player1Actions = playerAddress === startingPlayer ? startingPlayerActions : oppositePlayerActions;

  const winner = game.outcome.winner;
  const outcome = game.outcome.outcome;

  const revealedPlayer1Card = userIsPlayerA ? game.outcome.cardB : game.outcome.cardA;

  return (
    <PlayerWithCard
      gid={gid}
      player={1}
      address={playerAddress}
      chips={chips}
      suit={suit}
      playersActions={player1Actions}
      card={winner != ZeroAddress ? revealedPlayer1Card : undefined}
      activePlayer={activePlayer}
      winner={winner}
      outcome={outcome}
    />
  );
};

const GamePot: React.FC<{ gid: bigint | undefined }> = ({ gid }) => {
  const { data: game } = useScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "getGame",
    args: [gid],
  });

  return (
    <div className="flex flex-col justify-center items-center text-white">
      <span className="text-sm">POT:</span>
      <code className="text-4xl">{game == null ? 0 : game.state.pot.toString()}</code>
    </div>
  );
};

const PlayerSeat: React.FC<{ gid: bigint | undefined }> = ({ gid }) => {
  const { address } = useAccount();
  const { data: game, refetch } = useScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "getGame",
    args: [gid],
  });

  const { data: playerCard } = useFhenixScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "getGameCard",
    args: [InjectFhenixPermission, gid],
  });

  const { data: chips } = useScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "chips",
    args: [address],
  });

  useInterval(refetch, 2000);

  if (gid == null || game == null) return null;

  const suit = generateSuitsFromGid(gid)[1];

  const userIsPlayerA = game.playerA === address;
  const player1 = userIsPlayerA ? game.playerB : game.playerA;

  const actionIndex = getGameActionIndex(game);
  const activePlayer = game.state.activePlayer;
  const inActivePlayer = activePlayer === game.playerA ? game.playerB : game.playerA;

  const startingPlayer = actionIndex === 1 || actionIndex === 3 ? activePlayer : inActivePlayer;

  const startingPlayerActions = [
    { index: 1, action: game.state.action1 },
    { index: 3, action: game.state.action3 },
  ];
  const oppositePlayerActions = [{ index: 2, action: game.state.action2 }];
  const player2Actions = player1 === startingPlayer ? oppositePlayerActions : startingPlayerActions;

  const winner = game.outcome.winner;
  const outcome = game.outcome.outcome;

  return (
    <PlayerWithCard
      gid={gid}
      player={2}
      address={address ?? ZeroAddress}
      suit={suit}
      chips={chips}
      card={playerCard == null ? undefined : Number(playerCard)}
      activePlayer={activePlayer}
      playersActions={player2Actions}
      requiresPermissionToReveal={gid !== 0n && playerCard == null}
      winner={winner}
      outcome={outcome}
    />
  );
};

const ActionButton: React.FC<{ disabled?: boolean; gid: bigint; actionId: number }> = ({ gid, actionId }) => {
  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "FHEKuhnPoker",
    functionName: "performAction",
    args: [gid, actionId],
  });

  return (
    <button disabled={isMining} className="btn btn-primary w-36" onClick={() => writeAsync()}>
      {isMining && <span className="loading loading-spinner loading-xs" />}
      {playerActionNumToName(actionId)}
    </button>
  );
};

const DealMeInButton: React.FC<{ disabled?: boolean }> = ({ disabled }) => {
  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "FHEKuhnPoker",
    functionName: "dealMeIn",
    args: [100n],
  });

  return (
    <button disabled={disabled || isMining} className="btn btn-primary w-36" onClick={() => writeAsync()}>
      {isMining && <span className="loading loading-spinner loading-xs" />}
      Deal Me In
    </button>
  );
};

const FindGameButton: React.FC<{ disabled?: boolean }> = ({ disabled }) => {
  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "FHEKuhnPoker",
    functionName: "findGame",
  });

  return (
    <button disabled={disabled || isMining} className="btn btn-primary w-36" onClick={() => writeAsync()}>
      {isMining && <span className="loading loading-spinner loading-xs" />}
      Find New Game
    </button>
  );
};

const RematchButton: React.FC<{ disabled?: boolean; gid: bigint }> = ({ disabled, gid }) => {
  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "FHEKuhnPoker",
    functionName: "rematch",
    args: [gid],
  });

  return (
    <button disabled={disabled || isMining} className="btn btn-primary w-36" onClick={() => writeAsync()}>
      {isMining && <span className="loading loading-spinner loading-xs" />}
      Rematch
    </button>
  );
};

const ResignButton: React.FC<{ disabled?: boolean; gid: bigint }> = ({ disabled, gid }) => {
  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "FHEKuhnPoker",
    functionName: "resign",
    args: [gid],
  });

  return (
    <button disabled={disabled || isMining} className="btn btn-primary w-36" onClick={() => writeAsync()}>
      {isMining && <span className="loading loading-spinner loading-xs" />}
      Resign
    </button>
  );
};

const ExitGameButton: React.FC<{ disabled?: boolean; gid: bigint; text: string }> = ({ disabled, gid, text }) => {
  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "FHEKuhnPoker",
    functionName: "exitGame",
    args: [gid],
  });

  return (
    <button disabled={disabled || isMining} className="btn btn-primary w-36" onClick={() => writeAsync()}>
      {isMining && <span className="loading loading-spinner loading-xs" />}
      {text}
    </button>
  );
};

const GameActionSection: React.FC<{ gid: bigint | undefined }> = ({ gid }) => {
  const { address } = useAccount();
  const { chain: connectedChain } = useNetwork();
  const { targetNetwork } = useTargetNetwork();

  const { data: game, refetch } = useScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "getGame",
    args: [gid],
  });
  const writeDisabled = !connectedChain || connectedChain?.id !== targetNetwork.id;

  useInterval(refetch, 2000);

  if (gid == null || game == null) return null;

  const activePlayer = game.state.activePlayer;

  const winner = game.outcome.winner;
  const playerIsWinner = winner === address;
  const outcome = game.outcome.outcome;
  const outcomeIsShowdown = outcome === GameOutcome.A_BY_SHOWDOWN || outcome === GameOutcome.B_BY_SHOWDOWN;

  const availableActionIds = getAvailableActions(game.state.action1, game.state.action2);

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      {activePlayer != ZeroAddress && activePlayer === address && (
        <>
          <div>Its your turn:</div>
          <div className="flex flex-row gap-4">
            {availableActionIds.map(actionId => (
              <ActionButton disabled={writeDisabled} key={actionId} gid={gid} actionId={actionId} />
            ))}
          </div>
        </>
      )}
      {activePlayer != ZeroAddress && activePlayer !== address && (
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
      {activePlayer != ZeroAddress && <ResignButton gid={gid} />}
      {winner != ZeroAddress && (
        <div className="font-bold">
          {playerIsWinner ? "You have" : "Your Opponent has"} won {game.state.pot} chips by{" "}
          {outcomeIsShowdown ? "SHOWDOWN" : "FOLD"}!
        </div>
      )}
    </div>
  );
};

const getGameState = (game: GameInfo | undefined) => {
  if (game == null) return "loading";
  if (game.gid === 0n) return "idle";
  if (!game.state.accepted) return "waiting-for-partner";
  if (game.outcome.outcome === GameOutcome.EMPTY) return "in-game";
  return "post-game";
};

const ActionSection: React.FC<{ gid: bigint | undefined; rematchGid: bigint | undefined }> = ({ gid, rematchGid }) => {
  const { chain: connectedChain } = useNetwork();
  const { targetNetwork } = useTargetNetwork();

  const writeDisabled = !connectedChain || connectedChain?.id !== targetNetwork.id;

  const { data: game } = useScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "getGame",
    args: [gid],
  });

  const gameState = getGameState(game);

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      {/* Loading */}
      {gameState === "loading" && <p>Loading ...</p>}

      {/* Not in a game */}
      {gameState === "idle" && (
        <div className="flex flex-col justify-center items-center gap-4">
          <span>Welcome to Kuhn Poker, powered by Fhenix!</span>
          <div className="flex flex-row gap-4">
            <DealMeInButton disabled={writeDisabled} />
            <FindGameButton disabled={writeDisabled} />
          </div>
        </div>
      )}

      {/* In a game, but not accepted */}
      {gameState === "waiting-for-partner" && gid != null && (
        <div className="flex flex-col justify-center items-center gap-4">
          <span>Waiting for another player to join!</span>
          <div className="flex flex-row gap-4">
            <ExitGameButton disabled={writeDisabled} gid={gid} text="Cancel Search" />
          </div>
        </div>
      )}

      {/* In a game */}
      {(gameState === "in-game" || gameState === "post-game") && <GameActionSection gid={gid} />}

      {/* Game ended */}
      {gameState === "post-game" && gid != null && (
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="flex flex-row gap-4">
            <FindGameButton disabled={writeDisabled} />
            <RematchButton disabled={writeDisabled} gid={gid} />
          </div>
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const { address } = useAccount();

  const { data: userGameState, refetch } = useScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "getUserGameState",
    args: [address],
  });

  useInterval(refetch, 2000);

  if (userGameState == null)
    return (
      <div className="flex items-center flex-col flex-grow pt-10">
        <p>loading game...</p>
      </div>
    );

  const [displayGid, rematchGid] = userGameState;

  return (
    <div className="flex gap-12 justify-center items-center flex-col flex-grow py-10">
      <div className="flex flex-row gap-16 justify-center items-center relative">
        <div className="absolute rounded-full bg-green-600 -inset-x-36 inset-y-12 -z-10 shadow-lg" />
        <OppositePlayerSeat gid={displayGid} />
        <GamePot gid={displayGid} />
        <PlayerSeat gid={displayGid} />
      </div>
      <ActionSection gid={displayGid} rematchGid={rematchGid} />
    </div>
  );
};

export default Home;

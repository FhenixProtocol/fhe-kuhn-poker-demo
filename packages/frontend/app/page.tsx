"use client";

import { EyeIcon } from "@heroicons/react/24/outline";
import { useAccount, useNetwork } from "wagmi";
import { PlayingCard } from "~~/components/fhenix/PlayingCard";
import {
  cardSymbol,
  ellipseAddress,
  EmptyGameInfo,
  GameInfo,
  GameOutcome,
  generateSuitsFromGid,
  getAvailableActions,
  GidsState,
  outcomeToText,
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
  empty?: boolean;
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
  empty,
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
  const outcomeText = outcomeToText(outcome);
  return (
    <div
      className={`flex h-[260px] w-[112px] ${
        player === 1 ? "flex-col items-start mb-60" : "flex-col-reverse items-end mt-60"
      } ${isLoser && "opacity-40"} justify-start text-sm relative`}
    >
      <div
        className={`absolute -inset-x-8 -inset-y-6 transition-opacity -z-10 ${
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
        empty={empty}
        suit={suit}
        rank={symbol}
        hidden={hidden}
        gold={isWinner}
        wiggle={isActivePlayer || isWinner}
      >
        {requiresPermissionToReveal && <RevealCardButton />}
      </PlayingCard>
      <br />
      <br />
      <AnimatePresence>
        {playersActions
          .filter(({ action }) => action !== PlayerAction.EMPTY)
          .map(({ index, action }) => (
            <motion.div
              initial={{ opacity: 0, y: player === 1 ? -10 : 10, rotate: "0deg" }}
              animate={{ opacity: 1, y: 0, rotate: "6deg" }}
              exit={{ opacity: 0, y: player === 1 ? -10 : 10, rotate: "0deg" }}
              className={`text-white font-bold text-nowrap w-[160px] text-lg mx-4 tracking-wider my-1 ${
                player === 2 && "text-right"
              }`}
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
            className={`text-white font-bold text-nowrap w-[160px] text-lg mx-4 tracking-wider my-3 ${
              player === 2 && "text-right"
            }`}
            key="winner"
          >
            WINNER BY
            <br />
            {outcomeText}!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const OpponentSeat: React.FC<{ gid: bigint | undefined }> = ({ gid }) => {
  const { address } = useAccount();
  const { data: gameRaw, refetch } = useScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "getGame",
    args: [gid],
  });

  const game = gameRaw ?? EmptyGameInfo;

  const userIsPlayerA = game.playerA === address;
  const playerAddress = userIsPlayerA ? game.playerB : game.playerA;

  const { data: chips } = useScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "chips",
    args: [playerAddress],
  });

  useInterval(refetch, 2000);

  const suit = generateSuitsFromGid(game.gid)[0];

  const activePlayer = game.state.activePlayer;

  const startingPlayerActions = [
    { index: 1, action: game.state.action1 },
    { index: 3, action: game.state.action3 },
  ];
  const oppositePlayerActions = [{ index: 2, action: game.state.action2 }];
  const player1Actions = playerAddress === game.state.startingPlayer ? startingPlayerActions : oppositePlayerActions;

  const winner = game.outcome.winner ?? ZeroAddress;
  const outcome = game.outcome.outcome ?? GameOutcome.EMPTY;

  const revealedPlayer1Card = userIsPlayerA ? game.outcome.cardB : game.outcome.cardA;

  return (
    <PlayerWithCard
      gid={gid}
      player={1}
      address={playerAddress}
      chips={chips}
      suit={suit}
      playersActions={player1Actions}
      empty={false}
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
  const { data: gameRaw, refetch } = useScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "getGame",
    args: [gid],
  });
  const game = gameRaw ?? EmptyGameInfo;

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

  const suit = generateSuitsFromGid(game.gid)[1];

  const gameStarted = game.state.accepted;

  const userIsPlayerA = game.playerA === address;
  const player1 = userIsPlayerA ? game.playerB : game.playerA;

  const activePlayer = game.state.activePlayer;

  const startingPlayerActions = [
    { index: 1, action: game.state.action1 },
    { index: 3, action: game.state.action3 },
  ];
  const oppositePlayerActions = [{ index: 2, action: game.state.action2 }];
  const player2Actions = player1 === game.state.startingPlayer ? oppositePlayerActions : startingPlayerActions;

  const winner = game.outcome.winner;
  const outcome = game.outcome.outcome;

  return (
    <PlayerWithCard
      gid={gid}
      player={2}
      address={address ?? ZeroAddress}
      suit={suit}
      chips={chips}
      empty={gid == null || gid === 0n}
      card={playerCard != null ? Number(playerCard) : undefined}
      activePlayer={activePlayer}
      playersActions={player2Actions}
      requiresPermissionToReveal={gameStarted && gid !== 0n && playerCard == null}
      winner={winner}
      outcome={outcome}
    />
  );
};

const ActionButton: React.FC<{ disabled?: boolean; actionId: number }> = ({ actionId }) => {
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

const DealMeInButton: React.FC<{ disabled?: boolean }> = ({ disabled }) => {
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

const FindGameButton: React.FC<{ disabled?: boolean }> = ({ disabled }) => {
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

const RematchButton: React.FC<{ disabled?: boolean; text: string }> = ({ disabled, text }) => {
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

const ResignButton: React.FC<{ disabled?: boolean }> = ({ disabled }) => {
  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "FHEKuhnPoker",
    functionName: "resign",
  });

  return (
    <button disabled={disabled || isMining} className="btn btn-primary min-w-36" onClick={() => writeAsync()}>
      {isMining && <span className="loading loading-spinner loading-xs" />}
      Resign
    </button>
  );
};

const TimeoutOpponentButton: React.FC<{ disabled?: boolean }> = ({ disabled }) => {
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

const CancelSearchButton: React.FC<{ disabled?: boolean; text: string }> = ({ disabled, text }) => {
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

const GameActionSection: React.FC<{ gid: bigint | undefined }> = ({ gid }) => {
  const { address } = useAccount();
  const { chain: connectedChain } = useNetwork();
  const { targetNetwork } = useTargetNetwork();

  const { data: gameRaw, refetch } = useScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "getGame",
    args: [gid],
  });
  const game = gameRaw ?? EmptyGameInfo;
  const writeDisabled = !connectedChain || connectedChain?.id !== targetNetwork.id;

  useInterval(refetch, 2000);

  const activePlayer = game.state.activePlayer;

  const winner = game.outcome.winner;
  const playerIsWinner = winner === address;
  const outcome = game.outcome.outcome;
  const outcomeText = outcomeToText(outcome);

  const availableActionIds = getAvailableActions(game.state.action1, game.state.action2);

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      {activePlayer != ZeroAddress && activePlayer === address && (
        <>
          <div>Its your turn:</div>
          <div className="flex flex-row gap-4">
            {availableActionIds.map(actionId => (
              <ActionButton disabled={writeDisabled} key={actionId} actionId={actionId} />
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
      {activePlayer != ZeroAddress && <ResignButton disabled={writeDisabled} />}
      {winner != ZeroAddress && (
        <div className="font-bold">
          {playerIsWinner ? "You have" : "Your Opponent has"} won {game.state.pot} chips by {outcomeText}!
        </div>
      )}
    </div>
  );
};

const OutOfGameActions: React.FC<{ gids?: GidsState; game?: GameInfo }> = ({
  gids = { activeGid: 0n, rematchGid: 0n, selfGid: 0n, opponentGid: 0n },
  game,
}) => {
  const { chain: connectedChain } = useNetwork();
  const { targetNetwork } = useTargetNetwork();

  const writeDisabled = !connectedChain || connectedChain?.id !== targetNetwork.id;

  const gameHasEnded = game?.outcome.outcome !== GameOutcome.EMPTY;
  const waitingForGameAccepted = !game?.state.accepted && gids.selfGid !== 0n;
  const rematchExists = gids.rematchGid !== 0n && gids.rematchGid !== gids.activeGid;

  const waitingForNewGameToBeAccepted = waitingForGameAccepted && gids.activeGid === 0n;

  const opponentHasLeft = gids.opponentGid !== gids.activeGid && gids.opponentGid !== gids.rematchGid;

  const waitingForOpponentToAcceptRematch = waitingForGameAccepted && rematchExists;
  const rematchRequestAvailable = gameHasEnded && !rematchExists && !opponentHasLeft;
  const selfRequestedRematch = rematchExists && gids.selfGid === gids.rematchGid;
  const opponentRequestedRematch = rematchExists && gids.opponentGid === gids.rematchGid;

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      {waitingForNewGameToBeAccepted && (
        <div className="flex flex-row gap-4">
          Searching for another player
          <span className="loading loading-spinner loading-xs" />
        </div>
      )}
      {selfRequestedRematch && (
        <div className="flex flex-row gap-4">
          {opponentHasLeft ? (
            "Opponent has declined your rematch offer"
          ) : (
            <>
              Rematch offered
              <span className="loading loading-spinner loading-xs" />
            </>
          )}
        </div>
      )}
      {opponentRequestedRematch && (
        <div className="flex flex-row gap-4">
          Opponent offered rematch
          <span className="loading loading-spinner loading-xs" />
        </div>
      )}
      {opponentHasLeft && !selfRequestedRematch && (
        <div className="flex flex-row gap-4">Opponent has left the game</div>
      )}

      <div className="flex flex-row gap-4">
        {!waitingForNewGameToBeAccepted && <FindGameButton disabled={writeDisabled} />}
        {rematchRequestAvailable && <RematchButton disabled={writeDisabled} text="Offer Rematch" />}
        {opponentRequestedRematch && <RematchButton disabled={writeDisabled} text="Accept Rematch" />}
        {waitingForOpponentToAcceptRematch && <CancelSearchButton disabled={writeDisabled} text="Cancel Rematch" />}
        {waitingForNewGameToBeAccepted && <CancelSearchButton disabled={writeDisabled} text="Cancel Search" />}
      </div>

      {waitingForOpponentToAcceptRematch && (
        <div className="flex flex-row gap-4 italic text-sm">
          Searching for a new game will cancel your rematch request and refund your Ante
        </div>
      )}
    </div>
  );
};

const getGameState = (game: GameInfo | undefined) => {
  if (game == null) return "loading";
  if (game.gid === 0n) return "idle";
  if (game.state.accepted && game.outcome.outcome === GameOutcome.EMPTY) return "in-game";
  return "out-of-game";
};

const ActionSection: React.FC<{ gids?: GidsState }> = ({ gids }) => {
  const { chain: connectedChain } = useNetwork();
  const { targetNetwork } = useTargetNetwork();

  const writeDisabled = !connectedChain || connectedChain?.id !== targetNetwork.id;

  const { data: game } = useScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "getGame",
    args: [gids?.selfGid],
  });

  const gameState = getGameState(game);

  return (
    <div className="flex flex-col justify-start items-center h-36 gap-4">
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

      {/* In a game */}
      {(gameState === "in-game" || gameState === "out-of-game") && <GameActionSection gid={gids?.activeGid} />}

      {/* Game ended */}
      {gameState === "out-of-game" && <OutOfGameActions gids={gids} game={game} />}
    </div>
  );
};

const Home = () => {
  const { address } = useAccount();

  const { data: gids, refetch } = useScaffoldContractRead({
    contractName: "FHEKuhnPoker",
    functionName: "getUserGameState",
    args: [address],
  });

  useInterval(refetch, 2000);

  return (
    <div className="flex gap-12 justify-center items-center flex-col flex-grow py-10">
      <div className="flex flex-row gap-20 justify-center items-center relative">
        <div className="absolute rounded-full bg-green-600 -inset-x-36 inset-y-12 -z-10 shadow-lg" />
        <OpponentSeat gid={gids?.activeGid} />
        <GamePot gid={gids?.activeGid} />
        <PlayerSeat gid={gids?.activeGid} />
      </div>
      <ActionSection gids={gids} />
    </div>
  );
};

export default Home;

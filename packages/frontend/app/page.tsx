"use client";

import { playerActionNumToName } from "~~/components/fhenix/utils";
import { Fragment } from "react";
import {
  PlayerActions,
  PlayerCard,
  PlayerChips,
  PlayerHighlight,
  PlayerIdentifier,
  PlayerSeat,
  RevealCardButton,
} from "~~/components/fhenix/PlayerSeat";
import {
  useGamePlayerCardUpdater,
  useGamePot,
  useGameStateUpdater,
  useGameStep,
  useInGameActionsData,
  useOpponentData,
  useOutOfGameActionsData,
  useUserPlayerData,
  useWriteDisabled,
} from "~~/services/store/game";
import {
  ResignButton,
  ActionButton,
  FindGameButton,
  RematchButton,
  CancelSearchButton,
  DealMeInButton,
} from "~~/components/fhenix/GameActionButtons";

const OpponentSeat = () => {
  const { isWinner, isLoser, isActive, address, chips, actions, card, outcome } = useOpponentData();

  return (
    <PlayerSeat
      position="opponent"
      loser={isLoser}
      active={isActive}
      highlight={<PlayerHighlight active={isActive} />}
      identifier={<PlayerIdentifier address={address} />}
      chips={<PlayerChips chips={chips} />}
      card={<PlayerCard card={card} active={isActive} winner={isWinner} />}
      actions={<PlayerActions position="opponent" actions={actions} winner={isWinner} outcome={outcome} />}
    />
  );
};

const GamePot = () => {
  const pot = useGamePot();

  return (
    <div className="flex flex-col justify-center items-center text-white">
      <span className="text-sm">POT:</span>
      <code className="text-4xl">{pot ?? 0}</code>
    </div>
  );
};

const UserSeat: React.FC = () => {
  const { isWinner, isLoser, isActive, address, chips, actions, card, outcome, requiresReveal } = useUserPlayerData();

  return (
    <PlayerSeat
      position="player"
      loser={isLoser}
      active={isActive}
      highlight={<PlayerHighlight active={isActive} />}
      identifier={<PlayerIdentifier address={address} />}
      chips={<PlayerChips chips={chips} />}
      card={
        <PlayerCard card={card} active={isActive} winner={isWinner}>
          {requiresReveal && <RevealCardButton />}
        </PlayerCard>
      }
      actions={<PlayerActions position="player" actions={actions} winner={isWinner} outcome={outcome} />}
    />
  );
};

const InGameActions = () => {
  const { isPlayerActive, availableActions } = useInGameActionsData();

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      {isPlayerActive && (
        <>
          <div>Its your turn:</div>
          <div className="flex flex-row gap-4 items-center">
            <ResignButton />/
            {availableActions.map((actionId, i) => (
              <Fragment key={actionId}>
                <ActionButton key={actionId} actionId={actionId} />
                {i < availableActions.length - 1 && " or "}
              </Fragment>
            ))}
          </div>
        </>
      )}
      {!isPlayerActive && (
        <>
          <div>
            Waiting for <b>Your Opponent</b> to{" "}
            {availableActions.map((actionId, i) => (
              <Fragment key={actionId}>
                <b>{playerActionNumToName(actionId)}</b>
                {i < availableActions.length - 1 && " or "}
              </Fragment>
            ))}
          </div>
          <ResignButton />
        </>
      )}
    </div>
  );
};

const OutOfGameActions = () => {
  const writeDisabled = useWriteDisabled();

  const {
    waitingForNewGameToBeAccepted,
    selfRequestedRematch,
    opponentHasLeft,
    opponentRequestedRematch,
    rematchRequestAvailable,
    waitingForOpponentToAcceptRematch,
    outcomeText,
  } = useOutOfGameActionsData();

  console.log({
    waitingForNewGameToBeAccepted,
  });

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      {outcomeText != null && <div className="font-bold">{outcomeText}</div>}

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

      <div
        className={`flex flex-row gap-4 ${
          writeDisabled &&
          "tooltip before:content-[attr(data-tip)] before:right-[-10px] before:left-auto before:transform-none"
        }`}
        data-tip={`${writeDisabled && "Wallet not connected or in the wrong network"}`}
      >
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

const ActionSection: React.FC = () => {
  const writeDisabled = useWriteDisabled();
  const gameStep = useGameStep();

  return (
    <div className="flex flex-col justify-start items-center h-36 gap-4">
      {/* Loading */}
      {gameStep === "loading" && <p>Loading ...</p>}

      {/* Not in a game */}
      {gameStep === "idle" && (
        <div className="flex flex-col justify-center items-center gap-4">
          <span>Welcome to Kuhn Poker, powered by Fhenix!</span>
          <div
            className={`flex flex-row gap-4 ${
              writeDisabled &&
              "tooltip before:content-[attr(data-tip)] before:right-[-10px] before:left-auto before:transform-none"
            }`}
            data-tip={`${writeDisabled && "Wallet not connected or in the wrong network"}`}
          >
            <DealMeInButton disabled={writeDisabled} />
            <FindGameButton disabled={writeDisabled} />
          </div>
        </div>
      )}

      {/* In a game */}
      {gameStep === "in-game" && <InGameActions />}

      {/* Game ended */}
      {gameStep === "out-of-game" && <OutOfGameActions />}
    </div>
  );
};

const Home = () => {
  useGameStateUpdater();
  useGamePlayerCardUpdater();

  return (
    <div className="flex gap-12 justify-center items-center flex-col flex-grow py-10">
      <div className="flex flex-row gap-20 justify-center items-center relative">
        <div className="absolute rounded-full bg-green-600 -inset-x-36 inset-y-12 -z-10 shadow-lg" />
        <OpponentSeat />
        <GamePot />
        <UserSeat />
      </div>
      <ActionSection />
    </div>
  );
};

export default Home;

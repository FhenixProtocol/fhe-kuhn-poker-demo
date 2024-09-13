"use client";

import type { NextPage } from "next";
import HomeContent from "~~/components/fhenix/HomeContent";


// Gameplay flow
// User joins to empty table
// User has button to find a game
// User presses button to find a game, once `userActiveGame` is a non-zero number, show the game board
// User plays the game
// After game ends, users shown: <FIND NEW GAME> / <REQUEST REMATCH>
// <FIND NEW GAME>
//    Game board empties
// <REQUEST REMATCH>
//    * disabled and replaced with "Opponent Left" if opponents `userActiveGame` changes
//    * changes to "ACCEPT REMATCH" if opponents `userActiveGame` switches to the rematchGid
//    Requests rematch on click
//    If opponent leav

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-3xl font-bold">FHE Kuhn Poker</span>
            <span className="block text-2xl mb-2">Powered by Fhenix</span>
          </h1>
          <p className="text-center">
            Kuhn Poker is a simplified poker variant featuring 2 players and a 3 card deck (K/Q/J).
            <br />
            Players each ante 1 chip and dealt a random card.
            <br />
            Players place bets similarly to standard poker.
            <br />
            If both players bet or both players pass, the game goes to a showdown and the player with the higher card
            wins, otherwise, the betting player wins.
          </p>
          <p className="text-center">You can either create a game, or join an open game below:</p>
        </div>

        <div className="bg-secondary mt-8 w-full px-8 py-16 flex flex-col justify-center items-center">
          <HomeContent />
        </div>
      </div>
    </>
  );
};

export default Home;

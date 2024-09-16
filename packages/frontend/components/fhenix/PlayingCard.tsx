import React from "react";

const Card = ({
  children,
  faceDown = false,
  ping = false,
  gold = false,
  empty = false,
}: {
  children: React.ReactNode;
  faceDown?: boolean;
  ping?: boolean;
  gold?: boolean;
  empty?: boolean;
}) => (
  <div
    className={`w-24 h-36 min-h-[9rem] bg-gradient-to-br ${
      empty
        ? "from-green-700 to-green-700"
        : gold
        ? "from-amber-300 to-yellow-500 shadow-md"
        : faceDown
        ? "from-sky-600 to-blue-800 shadow-md"
        : "from-slate-50 to-gray-100 shadow-md"
    } rounded-md flex items-center justify-center m-2 relative ${ping ? "animate-wiggle" : ""}`}
  >
    {children}
  </div>
);

const CardFace = ({ rank, suit }: { rank: "K" | "Q" | "J"; suit: "red" | "black" }) => {
  const hexColor = suit === "red" ? "#EF4444" : "#1F2937";
  return (
    <svg className="w-full h-full" viewBox="0 0 100 150">
      <text x="10" y="25" fontSize="16" fill={hexColor} className="font-bold">
        {rank}
      </text>
      <text x="75" y="18" fontSize="16" fill={hexColor} className="font-bold">
        —
      </text>
      {(rank === "K" || rank === "Q") && (
        <text x="75" y="23" fontSize="16" fill={hexColor} className="font-bold">
          —
        </text>
      )}
      {rank === "K" && (
        <text x="75" y="28" fontSize="16" fill={hexColor} className="font-bold">
          —
        </text>
      )}
      <text x="90" y="160" fontSize="16" fill={hexColor} className="font-bold" transform="rotate(180 90 145)">
        {rank}
      </text>
      {rank === "K" && (
        <g fill={hexColor}>
          <rect x="35" y="45" width="30" height="60" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="60" r="8" />
          <path d="M42 85 H58 M50 77 V93" strokeWidth="2" />
        </g>
      )}
      {rank === "Q" && (
        <g fill={hexColor}>
          <circle cx="50" cy="65" r="15" fill={hexColor} />
          <path d="M42 90 Q50 100 58 90" strokeWidth="2" fill="none" />
        </g>
      )}
      {rank === "J" && (
        <g fill={hexColor}>
          <rect x="45" y="50" width="10" height="50" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="65" r="8" />
        </g>
      )}
    </svg>
  );
};

const CardBack = () => (
  <div className="w-full h-full rounded-md overflow-hidden">
    <svg className="w-full h-full" viewBox="0 0 100 150">
      <defs>
        <pattern id="plusPattern" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(15)">
          <path d="M10 5 V15 M5 10 H15" stroke="#4B8BF5" strokeWidth="2" />
        </pattern>
      </defs>
      <rect width="100" height="150" fill="#1D4ED8" />
      <rect width="100" height="150" fill="url(#plusPattern)" />
      <rect width="100" height="150" rx="8" ry="8" fill="none" stroke="white" strokeWidth="8" />
    </svg>
  </div>
);

export const PlayingCard: React.FC<{
  gold?: boolean;
  empty?: boolean;
  rank?: "K" | "J" | "Q";
  suit: "red" | "black";
  hidden?: boolean;
  wiggle?: boolean;
  children?: React.ReactNode;
}> = ({ rank, empty, suit, hidden = false, wiggle = false, gold = false, children }) => {
  return (
    <Card ping={wiggle} gold={gold} empty={empty}>
      {/* {ping && <div className="absolute inset-4 animate-ping bg-black rounded-2xl -z-10 blur-md opacity-40" />} */}
      {hidden && !empty && <CardBack />}
      {!hidden && !empty && rank != null && <CardFace rank={rank} suit={suit} />}
      {children}
    </Card>
  );
};

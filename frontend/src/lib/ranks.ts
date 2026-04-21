export const RANKS = [
  { name: "Novice Contributor", minLevel: 1, color: "text-zinc-400", bg: "bg-zinc-400/10", border: "border-zinc-400/20" },
  { name: "Rising Scholar", minLevel: 5, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  { name: "Verified Scholar", minLevel: 10, color: "text-indigo-400", bg: "bg-indigo-400/10", border: "border-indigo-400/20" },
  { name: "Academic Expert", minLevel: 20, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
  { name: "Elite Educator", minLevel: 50, color: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/20" },
  { name: "Academic Legend", minLevel: 100, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
];

export const getUserRank = (level: number) => {
  return [...RANKS].reverse().find((rank) => level >= rank.minLevel) || RANKS[0];
};

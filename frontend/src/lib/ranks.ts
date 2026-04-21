export const RANKS = [
  { name: "Novice Contributor", minLevel: 1, description: "The journey begins. Sharing basic academic foundations.", color: "text-zinc-400", bg: "bg-zinc-400/10", border: "border-zinc-400/20" },
  { name: "Rising Scholar", minLevel: 5, description: "A consistent contributor growing their academic footprint.", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  { name: "Verified Scholar", minLevel: 10, description: "Trusted member of the vault with high-quality validated assets.", color: "text-indigo-400", bg: "bg-indigo-400/10", border: "border-indigo-400/20" },
  { name: "Academic Expert", minLevel: 25, description: "A master of their field, providing top-tier academic guidance.", color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
  { name: "Elite Educator", minLevel: 50, description: "A beacon of knowledge influencing the entire community.", color: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/20" },
  { name: "Academic Legend", minLevel: 100, description: "The pinnacle of academia. A timeless pillar of NoteSphere.", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
];

export const getUserRank = (level: number = 1) => {
  return [...RANKS].reverse().find((rank) => level >= rank.minLevel) || RANKS[0];
};


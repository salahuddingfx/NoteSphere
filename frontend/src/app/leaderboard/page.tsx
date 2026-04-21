"use client";

import { useEffect, useState } from "react";
import MainNav from "@/components/ui/MainNav";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { getUserRank } from "@/lib/ranks";

interface Leader {
  name: string;
  username: string;
  xp: number;
  level: number;
  badges: string[];
  avatar: string;
}

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const { data } = await api.get("/users/leaderboard");
        setLeaders(data.users);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  const getRankColor = (idx: number) => {
    if (idx === 0) return "from-amber-400 to-orange-500";
    if (idx === 1) return "from-slate-300 to-slate-500";
    if (idx === 2) return "from-orange-600 to-orange-800";
    return "from-indigo-400 to-cyan-400";
  };
  return (
    <main className="min-h-screen bg-black px-4 py-12 sm:px-6 lg:px-10">
      <MainNav />
      <section className="mx-auto w-full max-w-5xl mt-12">
        <header className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-400 font-bold mb-4">Academic Prestige</p>
          <h1 className="text-5xl font-bold text-white tracking-tight">Hall of Fame</h1>
          <p className="mt-4 text-zinc-500 text-lg">Recognizing the students who empower the community through sharing.</p>
        </header>

        <div className="grid gap-6">
          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-28 rounded-[2rem] bg-white/5 animate-pulse" />
            ))
          ) : (
            leaders.map((user, idx) => {
              const color = getRankColor(idx);
              return (
                <motion.article
                  key={user.username}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative flex items-center justify-between rounded-[2rem] border border-white/5 bg-white/5 p-6 backdrop-blur-xl hover:border-white/10 transition-all cursor-default"
                >
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${color} p-[2px]`}>
                        <div className="h-full w-full rounded-[14px] bg-black p-[2px]">
                          <img src={user.avatar} alt={user.name} className="h-full w-full rounded-[12px] object-cover" />
                        </div>
                      </div>
                      <div className={`absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-black font-black text-sm shadow-lg`}>
                        {idx + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{user.name || user.username}</h3>
                      <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${getUserRank(user.level).color}`}>
                        {getUserRank(user.level).name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-black text-white tracking-tighter">{user.xp} <span className="text-xs text-zinc-500 uppercase tracking-widest ml-1">XP</span></p>
                    <div className="mt-2 h-1 w-32 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((user.xp / 5000) * 100, 100)}%` }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className={`h-full bg-gradient-to-r ${color}`} 
                       />
                    </div>
                  </div>
                </motion.article>
              );
            })
          )}
        </div>

        <div className="mt-12 rounded-3xl border border-dashed border-white/10 p-10 text-center">
           <h4 className="text-zinc-400 font-bold italic">"Sharing is the ultimate form of learning."</h4>
           <p className="text-xs text-zinc-600 mt-2 uppercase tracking-[0.2em]">Become a legend today.</p>
        </div>
      </section>
    </main>
  );
}

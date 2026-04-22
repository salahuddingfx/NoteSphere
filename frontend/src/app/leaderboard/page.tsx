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
              const tierName = idx === 0 ? "Elite Contributor" : idx === 1 ? "Gold Contributor" : idx === 2 ? "Silver Contributor" : null;
              
              return (
                <Link key={user.username} href={`/profile/${user.username}`}>
                  <motion.article
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`group relative flex items-center justify-between rounded-[2.5rem] border p-8 backdrop-blur-xl transition-all ${
                      idx === 0 ? 'border-amber-500/30 bg-amber-500/[0.03] shadow-2xl shadow-amber-500/10' :
                      idx === 1 ? 'border-slate-300/30 bg-slate-300/[0.03]' :
                      idx === 2 ? 'border-orange-600/30 bg-orange-600/[0.03]' :
                      'border-white/5 bg-white/5'
                    } hover:border-indigo-500/50 hover:bg-white/[0.07]`}
                  >
                    {tierName && (
                      <div className={`absolute -top-3 left-10 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        idx === 0 ? 'bg-amber-500 text-black' :
                        idx === 1 ? 'bg-slate-300 text-black' :
                        'bg-orange-600 text-white'
                      }`}>
                        {tierName}
                      </div>
                    )}

                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className={`h-20 w-20 rounded-[1.8rem] bg-gradient-to-br ${color} p-[2px]`}>
                          <div className="h-full w-full rounded-[1.6rem] bg-black p-[2px]">
                            <img src={user.avatar} alt={user.name} className="h-full w-full rounded-[1.4rem] object-cover" />
                          </div>
                        </div>
                        <div className={`absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-black font-black text-sm shadow-xl border-4 border-black`}>
                          {idx + 1}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors tracking-tighter">
                          {user.name || user.username}
                        </h3>
                        <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${getUserRank(user.level).color}`}>
                          {getUserRank(user.level).name} • Level {user.level}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-3xl font-black text-white tracking-tighter">
                        {user.xp.toLocaleString()} 
                        <span className="text-[10px] text-zinc-600 uppercase tracking-widest ml-2">Rank XP</span>
                      </p>
                      <div className="mt-3 h-1.5 w-40 bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((user.xp / (leaders[0].xp || 1)) * 100, 100)}%` }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          className={`h-full bg-gradient-to-r ${color}`} 
                         />
                      </div>
                    </div>
                  </motion.article>
                </Link>
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

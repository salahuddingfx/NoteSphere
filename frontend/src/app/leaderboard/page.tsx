"use client";

import { useEffect, useState } from "react";
import MainNav from "@/components/ui/MainNav";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { getUserRank } from "@/lib/ranks";
import Link from "next/link";
import Image from "next/image";
import { Trophy, Zap, Calendar, Award } from "lucide-react";


interface Leader {
  name: string;
  username: string;
  xp: number;
  monthlyXp: number;
  level: number;
  badges: string[];
  avatar: string;
}

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMonthly, setIsMonthly] = useState(false);

  useEffect(() => {
    fetchLeaders();
  }, [isMonthly]);

  const fetchLeaders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/users/leaderboard?monthly=${isMonthly}`);
      setLeaders(data.users);
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (idx: number) => {
    if (idx === 0) return "from-amber-400 to-orange-500";
    if (idx === 1) return "from-slate-300 to-slate-500";
    if (idx === 2) return "from-orange-600 to-orange-800";
    return "from-indigo-400 to-cyan-400";
  };

  return (
    <main className="min-h-screen bg-black px-6 pt-40 pb-32 sm:px-10 lg:px-16">
      <MainNav />
      <section className="mx-auto w-full max-w-6xl">
        <header className="mb-20 text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-indigo-400 font-black mb-6">Academic Prestige</p>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 italic uppercase leading-[0.8]">Hall of Fame</h1>
          <p className="max-w-2xl mx-auto text-zinc-500 text-lg md:text-xl font-medium leading-relaxed">
            Recognizing the scholars who empower the community through knowledge sharing and asset contribution.
          </p>
        </header>

        {/* Toggle Switch */}
        <div className="flex justify-center mb-20">
           <div className="flex p-1.5 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-3xl">
              <button 
                onClick={() => setIsMonthly(false)}
                className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${!isMonthly ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-zinc-500 hover:text-white'}`}
              >
                 <Award className="w-4 h-4" /> All Time
              </button>
              <button 
                onClick={() => setIsMonthly(true)}
                className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isMonthly ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-zinc-500 hover:text-white'}`}
              >
                 <Calendar className="w-4 h-4" /> Monthly League
              </button>
           </div>
        </div>

        <div className="grid gap-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="h-32 rounded-[2.5rem] bg-white/5 animate-pulse border border-white/5" />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {leaders.map((user, idx) => {
                  const color = getRankColor(idx);
                  const tierName = idx === 0 ? "Grandmaster Scholar" : idx === 1 ? "Academic Elite" : idx === 2 ? "Master Contributor" : null;
                  const displayXp = isMonthly ? (user.monthlyXp || 0) : user.xp;
                  
                  return (
                    <Link key={user.username} href={`/profile/${user.username}`}>
                      <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`group relative flex flex-col md:flex-row md:items-center justify-between rounded-[3rem] border px-10 py-9 backdrop-blur-xl transition-all ${
                          idx === 0 ? 'border-amber-500/30 bg-amber-500/[0.03] shadow-2xl shadow-amber-500/10' :
                          idx === 1 ? 'border-slate-300/30 bg-slate-300/[0.03]' :
                          idx === 2 ? 'border-orange-600/30 bg-orange-600/[0.03]' :
                          'border-white/5 bg-white/5'
                        } hover:border-indigo-500/50 hover:bg-white/[0.07]`}
                      >
                        {tierName && (
                          <div className={`absolute -top-3 left-10 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] ${
                            idx === 0 ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' :
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
                                <Image 
                                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                                  alt={user.name} 
                                  width={80}
                                  height={80}
                                  className="h-full w-full rounded-[1.4rem] object-cover" 
                                  unoptimized
                                />
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
                            <div className="flex items-center gap-3 mt-1">
                               <p className={`text-[10px] font-black uppercase tracking-widest ${getUserRank(user.level).color}`}>
                                 {getUserRank(user.level).name}
                               </p>
                               <span className="h-1 w-1 rounded-full bg-zinc-800" />
                               <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Level {user.level}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 md:mt-0 text-left md:text-right">
                          <div className="flex items-baseline md:justify-end gap-2">
                             <p className="text-4xl font-black text-white tracking-tighter">
                               {displayXp.toLocaleString()} 
                             </p>
                             <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">Rank XP</span>
                          </div>
                          <div className="mt-3 h-1.5 w-full md:w-48 bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((displayXp / (leaders[0]?.[isMonthly ? 'monthlyXp' : 'xp'] || 1)) * 100, 100)}%` }}
                              transition={{ duration: 1.5, delay: 0.2 }}
                              className={`h-full bg-gradient-to-r ${color}`} 
                             />
                          </div>
                        </div>
                      </motion.article>
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-32 rounded-[4rem] border border-white/5 bg-white/[0.02] px-12 py-20 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Trophy className="w-64 h-64 text-white" />
           </div>
           <h4 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight italic uppercase">&quot;Sharing knowledge is the ultimate act of academic prestige.&quot;</h4>
           <p className="text-xs text-zinc-500 uppercase tracking-[0.4em] font-black">Transcend the ranks. Empower the Nexus.</p>
           <Link 
            href="/upload" 
            className="inline-flex items-center gap-2 mt-10 px-10 py-5 rounded-2xl bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/30 active:scale-95"
           >
              <Zap className="w-4 h-4" /> Start Contributing
           </Link>
        </div>
      </section>
    </main>
  );
}

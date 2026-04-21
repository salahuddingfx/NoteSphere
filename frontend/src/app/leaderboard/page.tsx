"use client";

import MainNav from "@/components/ui/MainNav";
import { motion } from "framer-motion";

const leaders = [
  { name: "Rafi", xp: 2450, badge: "Grandmaster", color: "from-amber-400 to-orange-500", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafi" },
  { name: "Mitu", xp: 1980, badge: "Request Legend", color: "from-slate-300 to-slate-500", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mitu" },
  { name: "Tanvir", xp: 1585, badge: "Verified Scholar", color: "from-orange-600 to-orange-800", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tanvir" },
  { name: "Anika", xp: 1200, badge: "Top Contributor", color: "from-indigo-400 to-cyan-400", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anika" },
  { name: "Fahim", xp: 950, badge: "Rising Star", color: "from-indigo-400 to-cyan-400", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fahim" },
];

export default function LeaderboardPage() {
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
          {leaders.map((user, idx) => (
            <motion.article
              key={user.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative flex items-center justify-between rounded-[2rem] border border-white/5 bg-white/5 p-6 backdrop-blur-xl hover:border-white/10 transition-all cursor-default"
            >
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${user.color} p-[2px]`}>
                    <div className="h-full w-full rounded-[14px] bg-black p-[2px]">
                      <img src={user.avatar} alt={user.name} className="h-full w-full rounded-[12px] object-cover" />
                    </div>
                  </div>
                  <div className={`absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-gradient-to-br ${user.color} flex items-center justify-center text-black font-black text-sm shadow-lg`}>
                    {idx + 1}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{user.name}</h3>
                  <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold mt-1">{user.badge}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-black text-white tracking-tighter">{user.xp} <span className="text-xs text-zinc-500 uppercase tracking-widest ml-1">XP</span></p>
                <div className="mt-2 h-1 w-32 bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(user.xp / 2500) * 100}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className={`h-full bg-gradient-to-r ${user.color}`} 
                   />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-dashed border-white/10 p-10 text-center">
           <h4 className="text-zinc-400 font-bold italic">"Sharing is the ultimate form of learning."</h4>
           <p className="text-xs text-zinc-600 mt-2 uppercase tracking-[0.2em]">Become a legend today.</p>
        </div>
      </section>
    </main>
  );
}

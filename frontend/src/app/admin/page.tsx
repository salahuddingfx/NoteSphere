"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Users, FileText, CheckCircle, TrendingUp, Award, Zap } from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalNotes: number;
  verifiedNotes: number;
  deptStats: { _id: string; count: number }[];
  topContributors: { name: string; username: string; avatar: string; xp: number; level: number }[];
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/admin/stats");
        setStats(data.stats);
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="h-10 w-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-black text-white tracking-tighter">System Overview</h1>
        <p className="text-zinc-500 mt-1">Real-time status of the NoteSphere ecosystem.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Total Students", val: stats?.totalUsers || 0, icon: Users, color: "text-blue-400" },
          { label: "Note Vaults", val: stats?.totalNotes || 0, icon: FileText, color: "text-indigo-400" },
          { label: "Verified Assets", val: stats?.verifiedNotes || 0, icon: CheckCircle, color: "text-emerald-400" },
        ].map((stat, i) => (
          <motion.article
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-[2.5rem] border border-white/5 bg-white/5 p-8 backdrop-blur-xl relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-black flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  <stat.icon className={`w-3 h-3 ${stat.color}`} />
                </motion.div>
                {stat.label}
              </div>

              <p className="mt-6 text-4xl font-black text-white">{stat.val.toLocaleString()}</p>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <motion.div
                 whileHover={{ rotate: 15, scale: 1.1 }}
               >
                 <stat.icon className="w-20 h-20" />
               </motion.div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Department Distribution */}
        <section className="rounded-[3rem] border border-white/5 bg-white/5 p-10 backdrop-blur-xl">
           <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <TrendingUp className="w-5 h-5 text-indigo-400" />
              </motion.div>
              Department Activity
           </h2>
           <div className="space-y-6">
              {stats?.deptStats.map((dept, i) => (
                <div key={dept._id} className="space-y-2">
                   <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                      <span className="text-zinc-400">{dept._id || "Uncategorized"}</span>
                      <span className="text-white">{dept.count} Notes</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(dept.count / (stats?.totalNotes || 1)) * 100}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="h-full bg-indigo-500" 
                      />
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Top Contributors */}
        <section className="rounded-[3rem] border border-white/5 bg-white/5 p-10 backdrop-blur-xl">
           <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Award className="w-5 h-5 text-amber-400" />
              </motion.div>
              Elite Contributors
           </h2>
           <div className="space-y-6">
              {stats?.topContributors.map((user, i) => (
                <motion.div 
                  key={user.username}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-2xl border border-white/5 bg-white/5 hover:border-white/10 transition-all cursor-default"
                >
                   <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.username} className="h-10 w-10 rounded-xl border border-white/10" />
                      <div>
                         <p className="text-sm font-bold text-white">{user.name}</p>
                         <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Level {user.level}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-black text-indigo-400">{user.xp} XP</p>
                      <p className="text-[8px] text-zinc-600 font-bold uppercase">Reputation</p>
                   </div>
                </motion.div>
              ))}
           </div>
        </section>
      </div>

      <section className="rounded-[3rem] border border-white/5 bg-gradient-to-br from-indigo-500/5 to-transparent p-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Zap className="w-5 h-5 text-yellow-400 fill-current" />
          </motion.div>
          Nexus Engine Health
        </h2>

        <div className="space-y-6">
           <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">Database Connection</span>
              <span className="text-emerald-400 font-bold px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-[10px] uppercase">Active</span>
           </div>
           <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">Authentication Middleware</span>
              <span className="text-emerald-400 font-bold px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-[10px] uppercase">Operational</span>
           </div>
           <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">Cloudinary API</span>
              <span className="text-emerald-400 font-bold px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-[10px] uppercase">Active</span>
           </div>
        </div>
      </section>
    </div>
  );
}


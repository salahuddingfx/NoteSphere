"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AuthGate from "@/components/auth/AuthGate";
import { useAuthStore } from "@/store/auth.store";

import ContributionChart from "@/components/dashboard/ContributionChart";

export default function DashboardPage() {
  const { user, logout } = useAuthStore();

  return (
    <AuthGate>
      <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 bg-black">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-2xl"
        >
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-2xl border-2 border-indigo-500/30 p-1 backdrop-blur-xl">
                 <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt={user?.name} className="h-full w-full rounded-xl object-cover" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-400 font-bold">NoteSphere Nexus</p>
                <h1 className="mt-2 text-4xl font-bold text-white tracking-tight">Welcome, {user?.name}</h1>
                <p className="text-zinc-500 mt-1">Manage your academic profile and contributions.</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white active:scale-95"
            >
              System Logout
            </button>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { label: "Department", val: user?.department || "General" },
              { label: "Academic Semester", val: user?.semester || "N/A" },
              { label: "Total Rank XP", val: `${user?.xp || 0} XP` },
            ].map((stat) => (
              <article key={stat.label} className="rounded-2xl border border-white/5 bg-white/5 p-6 hover:border-white/10 transition-colors">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">{stat.label}</p>
                <p className="mt-3 text-2xl font-bold text-white">{stat.val}</p>
              </article>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-10">
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">Quick Actions</h3>
             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link href="/upload" className="group rounded-2xl border border-indigo-500/10 bg-indigo-500/5 p-6 hover:bg-indigo-500 transition-all hover:scale-[1.02]">
                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-white group-hover:text-indigo-500 transition-colors">
                         🚀
                      </div>
                      <div>
                         <p className="text-sm font-bold text-white group-hover:text-white">Share New Note</p>
                         <p className="text-xs text-indigo-400 group-hover:text-white/80">Earn +50 XP instantly</p>
                      </div>
                   </div>
                </Link>

                <div className="group rounded-2xl border border-white/5 bg-white/5 p-6 hover:border-white/10 transition-all cursor-not-allowed opacity-50">
                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400">
                         💎
                      </div>
                      <div>
                         <p className="text-sm font-bold text-zinc-300">Request Note</p>
                         <p className="text-xs text-zinc-500">Ask the community</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* XP Rewards Roadmap */}
          <div className="mt-12 rounded-[2rem] border border-white/5 bg-gradient-to-br from-indigo-500/5 to-transparent p-8">
             <div className="flex items-center gap-3 mb-6">
                <span className="text-xl">📊</span>
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">XP Rewards Roadmap</h3>
             </div>
             <div className="grid gap-6 sm:grid-cols-3">
                {[
                  { action: "Upload Notes", xp: "+50 XP", desc: "Share verified materials" },
                  { action: "Daily Login", xp: "+10 XP", desc: "Maintain your streak" },
                  { action: "Get Verified", xp: "+200 XP", desc: "Unlock elite status" },
                ].map((item) => (
                  <div key={item.action} className="space-y-2">
                    <div className="flex items-center justify-between">
                       <p className="text-xs font-bold text-zinc-500">{item.action}</p>
                       <p className="text-xs font-black text-indigo-400">{item.xp}</p>
                    </div>
                    <p className="text-sm text-white font-medium">{item.desc}</p>
                  </div>
                ))}
             </div>
          </div>

          <ContributionChart />
        </motion.section>
      </main>
    </AuthGate>
  );
}

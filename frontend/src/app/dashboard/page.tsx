"use client";

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
              { label: "Department", val: user?.department || "General", color: "indigo" },
              { label: "Academic Semester", val: user?.semester || "N/A", color: "cyan" },
              { label: "Total Rank XP", val: `${user?.xp || 0} XP`, color: "amber" },
            ].map((stat) => (
              <article key={stat.label} className="rounded-2xl border border-white/5 bg-white/5 p-6 hover:border-white/10 transition-colors">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">{stat.label}</p>
                <p className="mt-3 text-2xl font-bold text-white">{stat.val}</p>
              </article>
            ))}
          </div>

          <ContributionChart />
        </motion.section>
      </main>
    </AuthGate>
  );
}

"use client";

import { motion } from "framer-motion";

export default function AdminPage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black text-white tracking-tighter">System Overview</h1>
        <p className="text-zinc-500 mt-1">Real-time status of the NoteSphere ecosystem.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Users", val: "1.2k", trend: "+12%" },
          { label: "Note Vaults", val: "4.8k", trend: "+5%" },
          { label: "Verified Rank", val: "185", trend: "+2" },
          { label: "System Uptime", val: "99.9%", trend: "Stable" },
        ].map((stat, i) => (
          <motion.article
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-[2rem] border border-white/5 bg-white/5 p-8 backdrop-blur-xl"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-black">{stat.label}</p>
            <p className="mt-4 text-3xl font-bold text-white">{stat.val}</p>
            <p className="mt-2 text-xs text-indigo-400 font-bold">{stat.trend}</p>
          </motion.article>
        ))}
      </div>

      <section className="rounded-[3rem] border border-white/5 bg-gradient-to-br from-indigo-500/5 to-transparent p-12">
        <h2 className="text-2xl font-bold text-white mb-6">Nexus Engine Health</h2>
        <div className="space-y-6">
           <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">Database Connection</span>
              <span className="text-green-400 font-bold">Active</span>
           </div>
           <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">Authentication Middleware</span>
              <span className="text-green-400 font-bold">Operational</span>
           </div>
           <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">Cloudinary API</span>
              <span className="text-green-400 font-bold">Active</span>
           </div>
        </div>
      </section>
    </div>
  );
}

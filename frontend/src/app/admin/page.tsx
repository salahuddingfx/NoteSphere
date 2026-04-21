"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import MainNav from "@/components/ui/MainNav";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, notes: 0, pending: 0 });

  useEffect(() => {
    // Mocking stats for now, replace with real API calls later
    setStats({ users: 124, notes: 450, pending: 12 });
  }, []);

  return (
    <AdminGuard>
      <main className="min-h-screen bg-black px-4 py-12 sm:px-6 lg:px-10">
        <MainNav />
        
        <div className="mx-auto w-full max-w-6xl mt-12">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-red-500 font-bold">Terminal Access Restricted</p>
              <h1 className="text-4xl font-bold text-white mt-2">Admin Command Center</h1>
            </div>
            <div className="flex gap-3">
              <button className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-zinc-400">Export Logs</button>
              <button className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-bold text-white">System Settings</button>
            </div>
          </header>

          <section className="grid gap-6 md:grid-cols-3 mb-12">
            {[
              { label: "Total Students", val: stats.users, trend: "+12%" },
              { label: "Total Notes", val: stats.notes, trend: "+5%" },
              { label: "Pending Verification", val: stats.pending, trend: "Critical", color: "text-red-500" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-xl"
              >
                <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">{stat.label}</p>
                <div className="flex items-end justify-between mt-4">
                   <h2 className="text-4xl font-bold text-white">{stat.val}</h2>
                   <span className={`text-xs font-bold ${stat.color || "text-green-500"}`}>{stat.trend}</span>
                </div>
              </motion.div>
            ))}
          </section>

          <section className="rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-xl">
             <h3 className="text-xl font-bold text-white mb-6">Verification Queue</h3>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-zinc-500 text-xs uppercase tracking-widest border-b border-white/5">
                      <th className="pb-4">Note Title</th>
                      <th className="pb-4">Uploader</th>
                      <th className="pb-4">Department</th>
                      <th className="pb-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-300 text-sm">
                    {[
                      { title: "Advanced Calculus II", user: "Rahat", dept: "CSE" },
                      { title: "Microprocessors & Interfacing", user: "Nayeem", dept: "EEE" },
                      { title: "Discrete Math Notes", user: "Sadia", dept: "CSE" },
                    ].map((note, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 font-medium text-white">{note.title}</td>
                        <td className="py-4">{note.user}</td>
                        <td className="py-4">{note.dept}</td>
                        <td className="py-4 text-right">
                          <button className="text-indigo-400 hover:text-indigo-300 font-bold mr-4">Verify</button>
                          <button className="text-red-500 hover:text-red-400 font-bold">Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </section>

          <section className="mt-12 rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-xl">
             <h3 className="text-xl font-bold text-white mb-6">Developer Profile Settings</h3>
             <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-zinc-500 font-black">Professional Designation</label>
                      <input type="text" defaultValue="Architect & Visionary" className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white focus:border-indigo-500 outline-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-zinc-500 font-black">Bio Data</label>
                      <textarea rows={4} defaultValue="Passionate engineer dedicated to building the next generation..." className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white focus:border-indigo-500 outline-none" />
                   </div>
                </div>
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-zinc-500 font-black">Social Links (GitHub/LinkedIn)</label>
                      <input type="text" placeholder="GitHub URL" className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white focus:border-indigo-500 outline-none mb-2" />
                      <input type="text" placeholder="LinkedIn URL" className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white focus:border-indigo-500 outline-none" />
                   </div>
                   <div className="flex justify-end pt-4">
                      <button className="rounded-2xl bg-indigo-500 px-8 py-4 text-sm font-black text-white hover:bg-indigo-600 transition-all">
                         Push System Update
                      </button>
                   </div>
                </div>
             </div>
          </section>
        </div>
      </main>
    </AdminGuard>
  );
}

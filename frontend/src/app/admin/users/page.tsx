"use client";

import { motion } from "framer-motion";

export default function AdminUsersPage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black text-white tracking-tighter">User Registry</h1>
        <p className="text-zinc-500 mt-1">Manage student accounts and access levels.</p>
      </header>

      <section className="rounded-[3rem] border border-white/5 bg-white/5 p-8 backdrop-blur-xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-zinc-500 text-[10px] uppercase tracking-widest border-b border-white/5">
                  <th className="pb-6">Student</th>
                  <th className="pb-6">Status</th>
                  <th className="pb-6">XP / Level</th>
                  <th className="pb-6 text-right">Control</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300 text-sm">
                {[
                  { name: "Salah Uddin Kader", role: "Admin", xp: 5000, level: 10, status: "Active" },
                  { name: "Rafi Rahman", role: "Student", xp: 1240, level: 4, status: "Active" },
                  { name: "Mitu Akter", role: "Student", xp: 850, level: 2, status: "Restricted" },
                ].map((user, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="py-6">
                       <p className="font-bold text-white">{user.name}</p>
                       <p className="text-xs text-zinc-500">{user.role}</p>
                    </td>
                    <td className="py-6">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         user.status === "Active" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                       }`}>
                         {user.status}
                       </span>
                    </td>
                    <td className="py-6 font-mono text-xs">{user.xp} XP / Lvl {user.level}</td>
                    <td className="py-6 text-right">
                       <button className="text-indigo-400 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors mr-4">Edit</button>
                       <button className="text-red-500/50 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-colors">Ban</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </section>
    </div>
  );
}

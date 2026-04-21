"use client";

import MainNav from "@/components/ui/MainNav";
import { motion } from "framer-motion";

export default function ReportPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-12 sm:px-6 lg:px-10">
      <MainNav />
      <section className="mx-auto max-w-2xl mt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[3rem] border border-white/5 bg-white/5 p-10 backdrop-blur-xl"
        >
          <h1 className="text-3xl font-black text-white mb-4">Report an Issue</h1>
          <p className="text-zinc-500 mb-8">Found a bug or incorrect note? Let our moderators know immediately.</p>
          
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Issue Type</label>
              <select className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white focus:border-indigo-500 outline-none transition-colors appearance-none">
                <option>Bug Report</option>
                <option>Incorrect Content</option>
                <option>Account Issue</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Detailed Description</label>
              <textarea rows={6} className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white focus:border-indigo-500 outline-none transition-colors" placeholder="What happened?" />
            </div>
            <button className="w-full rounded-2xl bg-white py-4 text-sm font-black text-black hover:scale-[1.02] active:scale-[0.98] transition-all">
              Submit Report
            </button>
          </form>
        </motion.div>
      </section>
    </main>
  );
}

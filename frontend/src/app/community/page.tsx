"use client";

import MainNav from "@/components/ui/MainNav";
import { motion } from "framer-motion";
import { 
  Users, 
  MessagesSquare, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  Search,
  Monitor,
  Zap,
  Calculator,
  Atom,
  FlaskConical,
  Construction,
  Cpu
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const SUBJECTS = [
  { name: "Computer Science", count: 42, icon: Cpu, color: "text-blue-400", bg: "bg-blue-500" },
  { name: "Electrical Engineering", count: 28, icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500" },
  { name: "Mathematics", count: 35, icon: Calculator, color: "text-indigo-400", bg: "bg-indigo-500" },
  { name: "Physics", count: 19, icon: Atom, color: "text-cyan-400", bg: "bg-cyan-500" },
  { name: "Chemistry", count: 12, icon: FlaskConical, color: "text-emerald-400", bg: "bg-emerald-500" },
  { name: "Civil Engineering", count: 15, icon: Construction, color: "text-orange-400", bg: "bg-orange-500" },
];

export default function CommunityPage() {
  const [search, setSearch] = useState("");

  const filteredSubjects = SUBJECTS.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-black px-4 py-12 sm:px-6 lg:px-10">
      <MainNav />
      <section className="mx-auto w-full max-w-5xl mt-12">
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
             <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <MessagesSquare className="w-6 h-6" />
             </div>
             <p className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400">Nexus Community</p>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter mb-6">Subject Forums</h1>
          <p className="text-zinc-500 text-lg max-w-2xl leading-relaxed">
            Collaborate with peers, ask complex questions, and master your curriculum through community intelligence.
          </p>
        </header>

        {/* Search Bar */}
        <div className="relative mb-12 group">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
           <input 
            type="text" 
            placeholder="Search academic departments or subjects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-8 text-white focus:border-indigo-500/50 outline-none transition-all backdrop-blur-xl"
           />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubjects.map((subject, idx) => (
            <Link key={subject.name} href={`/community/${encodeURIComponent(subject.name)}`}>
               <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group p-8 rounded-[2.5rem] border border-white/5 bg-white/5 hover:border-indigo-500/30 hover:bg-white/[0.08] transition-all relative overflow-hidden"
               >
                  <div className={`absolute top-0 right-0 w-32 h-32 ${subject.bg} opacity-[0.03] blur-3xl`} />
                  
                  <div className={`h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/5 group-hover:border-white/10 transition-all ${subject.color}`}>
                     <subject.icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{subject.name}</h3>
                  <div className="flex items-center justify-between mt-8">
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{subject.count} Active Discussions</span>
                     <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                  </div>
               </motion.div>
            </Link>
          ))}
        </div>

        <div className="mt-20 rounded-[3rem] border border-white/5 bg-gradient-to-br from-indigo-500/5 to-transparent p-12 text-center">
           <Sparkles className="w-12 h-12 text-indigo-400 mx-auto mb-6" />
           <h2 className="text-2xl font-black text-white mb-4 italic tracking-tight">Don&apos;t see your subject?</h2>
           <p className="text-zinc-500 max-w-lg mx-auto text-sm leading-relaxed mb-8">
             Upload a note for a new subject to automatically manifest a new discussion forum in the Nexus.
           </p>
           <Link href="/upload" className="px-8 py-4 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl">
             Begin Contribution
           </Link>
        </div>
      </section>
    </main>
  );
}

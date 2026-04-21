"use client";

import MainNav from "@/components/ui/MainNav";
import { motion } from "framer-motion";

const mockNotes = [
  {
    title: "Fluid Mechanics Full Review",
    department: "Civil",
    semester: "5th",
    subject: "Fluid Mechanics",
    type: "PDF",
    downloads: 182,
    verified: true,
    color: "from-blue-500 to-indigo-500",
    uploader: { name: "Rafi", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafi" },
  },
  {
    title: "Digital Logic Design Short Notes",
    department: "CSE",
    semester: "3rd",
    subject: "DLD",
    type: "PDF",
    downloads: 96,
    verified: false,
    color: "from-purple-500 to-pink-500",
    uploader: { name: "Mitu", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mitu" },
  },
  {
    title: "Transportation Engineering Cheat Sheet",
    department: "Civil",
    semester: "6th",
    subject: "Transportation Engineering",
    type: "Image",
    downloads: 121,
    verified: true,
    color: "from-cyan-500 to-blue-500",
    uploader: { name: "Tanvir", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tanvir" },
  },
];

import { useState, useEffect } from "react";
import { NoteSkeleton } from "@/components/ui/Skeleton";

export default function NotesPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-black px-4 py-12 sm:px-6 lg:px-10">
      <MainNav />
      <section className="mx-auto w-full max-w-6xl mt-12">
        <header className="mb-12">
           <p className="text-xs uppercase tracking-[0.4em] text-indigo-400 font-bold mb-4">Central Repository</p>
           <h1 className="text-5xl font-bold text-white tracking-tight">The Verified Vault</h1>
           <p className="mt-4 text-zinc-500 text-lg max-w-2xl">Access premium academic resources verified by top students and moderators.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading 
            ? Array(6).fill(0).map((_, i) => <NoteSkeleton key={i} />)
            : mockNotes.map((note, idx) => (
            <motion.article 
              key={note.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative rounded-[2.5rem] border border-white/5 bg-white/5 p-2 backdrop-blur-xl hover:border-white/10 transition-all overflow-hidden"
            >
              <div className={`aspect-[4/3] rounded-[2rem] bg-gradient-to-br ${note.color} p-8 flex flex-col justify-between relative overflow-hidden`}>
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                 <div className="relative z-10 flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-[10px] font-black uppercase tracking-widest text-white">{note.type}</span>
                    {note.verified && (
                      <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-xl">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                      </div>
                    )}
                 </div>
                 <div className="relative z-10">
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{note.subject}</p>
                    <h3 className="text-2xl font-bold text-white mt-1 leading-tight">{note.title}</h3>
                 </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={note.uploader.avatar} alt={note.uploader.name} className="h-8 w-8 rounded-full border border-white/10" />
                    <div className="space-y-1">
                      <p className="text-white text-xs font-bold">{note.uploader.name}</p>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{note.department} • {note.semester}</p>
                    </div>
                  </div>
                  <button className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
           <button className="px-8 py-4 rounded-2xl border border-white/5 bg-white/5 text-zinc-400 font-bold hover:text-white hover:border-white/10 transition-all">
             Load More Assets
           </button>
        </div>
      </section>
    </main>
  );
}

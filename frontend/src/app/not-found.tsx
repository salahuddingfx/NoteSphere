"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileQuestion, Home, ArrowLeft, Search, Zap } from "lucide-react";
import MainNav from "@/components/ui/MainNav";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden px-6">
      <MainNav />
      
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
      
      <div className="relative z-10 text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 flex justify-center"
        >
          <div className="h-32 w-32 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center relative group">
             <div className="absolute inset-0 bg-indigo-500/20 blur-2xl group-hover:bg-indigo-500/40 transition-all rounded-full" />
             <FileQuestion className="w-16 h-16 text-indigo-400 relative z-10" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xs font-black uppercase tracking-[0.5em] text-indigo-500 mb-4"
        >
          Error Code: 404
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 italic uppercase leading-none"
        >
          Lost in the Nexus
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-zinc-500 text-lg md:text-xl font-medium mb-12 leading-relaxed"
        >
          The academic asset you are looking for has either been purged from the vault or relocated to a different sector.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            href="/"
            className="flex items-center gap-2 px-10 py-5 rounded-2xl bg-white text-black text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10"
          >
            <Home className="w-4 h-4" /> Return to Base
          </Link>
          
          <Link 
            href="/notes"
            className="flex items-center gap-2 px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
          >
            <Search className="w-4 h-4" /> Search Vault
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">
         <Zap className="w-3 h-3" /> NoteSphere Intelligence Network
      </div>
    </main>
  );
}

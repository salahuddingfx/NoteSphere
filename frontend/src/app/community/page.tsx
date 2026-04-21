"use client";

import MainNav from "@/components/ui/MainNav";
import { motion } from "framer-motion";

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-12 sm:px-6 lg:px-10">
      <MainNav />
      <section className="mx-auto max-w-6xl mt-20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-96 bg-indigo-500/10 blur-[120px] -z-10" />
        
        <div className="text-center mb-20">
          <h1 className="text-6xl font-black text-white tracking-tighter mb-4">NoteSphere Community</h1>
          <p className="text-zinc-500 text-lg">Join thousands of students building the future of academia.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
           {[
             { title: "Discord Hub", desc: "Join our official server for real-time discussion.", icon: "D" },
             { title: "GitHub Org", desc: "Contribute to the open-source core of NoteSphere.", icon: "G" },
             { title: "Study Circles", desc: "Form private groups with your classmates.", icon: "S" },
           ].map((card, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="rounded-[2.5rem] border border-white/5 bg-white/5 p-10 backdrop-blur-xl hover:border-indigo-500/30 transition-all group"
             >
               <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black text-xl mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  {card.icon}
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">{card.title}</h3>
               <p className="text-zinc-500 leading-relaxed">{card.desc}</p>
             </motion.div>
           ))}
        </div>
      </section>
    </main>
  );
}

"use client";

import MainNav from "@/components/ui/MainNav";
import { motion } from "framer-motion";

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-12 sm:px-6 lg:px-10">
      <MainNav />
      <section className="mx-auto max-w-4xl mt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-5xl font-black text-white tracking-tighter">Help Center</h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            Everything you need to know about the NoteSphere ecosystem. From uploading to earning badges.
          </p>
        </motion.div>

        <div className="grid gap-6 mt-16 text-left">
           {[
             { q: "How do I earn XP?", a: "You earn XP by uploading verified notes and helping others through the request system." },
             { q: "Is NoteSphere free?", a: "Yes, it is a community-driven platform built for students by students." },
             { q: "What is the 'Verified' badge?", a: "It is a trust score badge given to users whose notes are consistently accurate." },
           ].map((faq, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.1 }}
               className="rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-xl"
             >
               <h3 className="text-xl font-bold text-white mb-2">{faq.q}</h3>
               <p className="text-zinc-500 leading-relaxed">{faq.a}</p>
             </motion.div>
           ))}
        </div>
      </section>
    </main>
  );
}

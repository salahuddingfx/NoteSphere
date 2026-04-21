"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import MainNav from "@/components/ui/MainNav";
import HeroCanvas from "@/components/HeroCanvas";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Home() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (titleRef.current && descRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power4.out", delay: 0.2 }
      );
      gsap.fromTo(
        descRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.4 }
      );
    }
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-12 sm:px-6 lg:px-10 bg-black">
      <HeroCanvas />
      
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.1),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(99,102,241,0.1),transparent_30%)]" />
      <div className="absolute inset-0 -z-10 bg-black/60 backdrop-blur-[2px]" />

      <div className="mx-auto w-full max-w-6xl relative z-10">
        <MainNav />

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl md:p-12 shadow-2xl"
        >
          <p className="inline-flex rounded-full border border-indigo-400/40 bg-indigo-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-indigo-300">
            Premium Academic Experience
          </p>
          <h1 
            ref={titleRef}
            className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40"
          >
            Share smarter, rank faster.
          </h1>
          <p 
            ref={descRef}
            className="mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl leading-relaxed"
          >
            NoteSphere turns chaotic note-sharing into a premium platform where students gain XP, badges,
            trust scores, and leaderboard rank while helping each other ace exams.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Secure Vault", desc: "JWT Protected notes" },
              { title: "Verification", desc: "Verified study material" },
              { title: "Gamification", desc: "XP, Badges & Ranks" },
              { title: "Discovery", desc: "AI-powered feed" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="rounded-2xl border border-white/5 bg-white/5 p-5 hover:bg-white/10 transition-colors group cursor-default"
              >
                <h3 className="text-white font-semibold group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                <p className="text-zinc-500 text-sm mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-white px-8 py-4 text-sm font-bold text-black transition hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Start Contributing
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
            >
              Continue Account
            </Link>
          </div>
        </motion.section>

        <section className="mt-12 grid gap-4 grid-cols-2 sm:grid-cols-4">
          {[
            { label: "Active Vaults", val: "1,240+" },
            { label: "Daily Uploads", val: "85" },
            { label: "Trusted Users", val: "4.8k" },
            { label: "Verified Rank", val: "Elite" },
          ].map((item, i) => (
            <motion.article 
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-md text-center"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-2">{item.label}</p>
              <p className="text-3xl font-black text-white">{item.val}</p>
            </motion.article>
          ))}
        </section>

        {/* The Process Section */}
        <section className="mt-24">
           <div className="text-center mb-16">
              <h2 className="text-sm font-black uppercase tracking-[0.5em] text-indigo-400">The Workflow</h2>
              <p className="mt-4 text-4xl font-bold text-white">How NoteSphere Operates</p>
           </div>

           <div className="grid gap-8 md:grid-cols-3">
              {[
                { step: "01", title: "Upload", desc: "Share your high-quality academic notes to the vault." },
                { step: "02", title: "Verify", desc: "Our moderators and AI verify the content for accuracy." },
                { step: "03", title: "Earn", desc: "Gain XP, badges, and move up the global leaderboard." },
              ].map((item, i) => (
                <div key={item.step} className="group relative rounded-[2.5rem] border border-white/5 bg-white/5 p-10 hover:border-white/10 transition-all">
                   <span className="absolute -top-6 left-10 text-6xl font-black text-white/5 group-hover:text-indigo-500/10 transition-colors">{item.step}</span>
                   <h3 className="text-xl font-bold text-white mb-4 relative z-10">{item.title}</h3>
                   <p className="text-zinc-500 leading-relaxed relative z-10">{item.desc}</p>
                </div>
              ))}
           </div>
        </section>

        <section className="mt-24 rounded-[3rem] border border-white/5 bg-gradient-to-br from-indigo-500/10 to-transparent p-12 text-center">
           <h2 className="text-3xl font-bold text-white">Ready to join the elite?</h2>
           <p className="mt-4 text-zinc-400 max-w-xl mx-auto">Start your journey today and become the most trusted student in your department.</p>
           <Link href="/register" className="mt-8 inline-block rounded-2xl bg-white px-10 py-4 text-sm font-black text-black hover:scale-105 active:scale-95 transition-all">
              Initialize Account
           </Link>
        </section>
      </div>
    </main>
  );
}

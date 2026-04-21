"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import HeroCanvas from "@/components/HeroCanvas";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Shield, CheckCircle2, Award, Search as SearchIcon, Zap, Sparkles, Rocket, Upload, ShieldCheck } from "lucide-react";

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
    <div className="relative min-h-screen overflow-hidden px-4 pb-20 sm:px-6 lg:px-10">
      <HeroCanvas />
      
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.1),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(99,102,241,0.1),transparent_30%)]" />
      <div className="absolute inset-0 -z-10 bg-black/60 backdrop-blur-[2px]" />

      <div className="mx-auto w-full max-w-6xl relative z-10">
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
            className="mt-8 text-5xl font-black leading-[1.1] text-white md:text-7xl lg:text-8xl tracking-tighter"
          >
            Elevate Your <br />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">Academic Intellect.</span>
          </h1>
          <p 
            ref={descRef}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl"
          >
            The universal vault for verified lecture notes, professional study materials, and academic collaboration. 
            Join the elite circle of students from top universities.
          </p>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/notes" className="rounded-2xl bg-indigo-600 px-10 py-5 text-sm font-black uppercase tracking-widest text-white hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
               Explore the Vault
            </Link>
            <Link href="/upload" className="rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-sm font-black uppercase tracking-widest text-white backdrop-blur-xl hover:bg-white/10 transition-all active:scale-95">
               Upload Assets
            </Link>
          </div>
        </motion.section>

        <div className="mt-24 grid gap-8 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Nexus Verified", desc: "Every note is audited by our moderation council for academic integrity." },
            { icon: Zap, title: "Instant Access", desc: "No paywalls. No ads. Just pure academic knowledge at your fingertips." },
            { icon: Award, title: "Earn Prestige", desc: "Climb the leaderboard, earn rank artifacts, and build your academic profile." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-xl hover:border-indigo-500/30 transition-colors group"
            >
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <section className="mt-40 mb-20 text-center">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="inline-block p-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500"
           >
              <div className="rounded-[1.4rem] bg-black px-12 py-20 backdrop-blur-3xl">
                 <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">Ready to lead the <br/> academic revolution?</h2>
                 <p className="text-zinc-500 max-w-xl mx-auto mb-10">Join 50,000+ students sharing knowledge across 200+ departments worldwide.</p>
                 <Link href="/register" className="rounded-2xl bg-white px-12 py-5 text-sm font-black uppercase tracking-widest text-black hover:scale-105 transition-all shadow-2xl">
                    Initialize Account
                 </Link>
              </div>
           </motion.div>
        </section>
      </div>
    </div>
  );
}

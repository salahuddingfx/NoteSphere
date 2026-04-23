"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import HeroCanvas from "@/components/HeroCanvas";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { 
  ShieldCheck, 
  Zap, 
  Award, 
  Sparkles, 
  ArrowRight, 
  BarChart3, 
  Users, 
  BookOpen, 
  MessagesSquare, 
  Mic2, 
  Map, 
  Layout, 
  Settings2 
} from "lucide-react";

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

  const stats = [
    { label: "Verified Assets", value: "85K+", icon: ShieldCheck },
    { label: "Active Scholars", value: "12K+", icon: Users },
    { label: "Daily Transmissions", value: "500+", icon: Zap },
    { label: "Academic Subjects", value: "240+", icon: BookOpen },
  ];

  const premiumFeatures = [
    { title: "AI Voice Synthesis", desc: "Listen to lecture summaries on the go with real-time neural voices.", icon: Mic2, color: "text-rose-400" },
    { title: "Subject Forums", desc: "Collaborative study groups for every academic department.", icon: MessagesSquare, color: "text-indigo-400" },
    { title: "Dynamic Roadmaps", desc: "AI-generated learning paths based on your specific curriculum.", icon: Map, color: "text-emerald-400" },
    { title: "Study Playlists", desc: "Organize your academic life with custom asset collections.", icon: Layout, color: "text-cyan-400" },
    { title: "Nexus Rankings", desc: "Compete in monthly academic leagues and earn your prestige.", icon: Award, color: "text-amber-400" },
    { title: "Multi-Model AI", desc: "Harness the power of Gemini, Llama, and Mistral in one vault.", icon: Settings2, color: "text-violet-400" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-20 sm:px-6 lg:px-10">
      <HeroCanvas />
      
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.1),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(99,102,241,0.1),transparent_30%)]" />
      <div className="absolute inset-0 -z-10 bg-black/60 backdrop-blur-[2px]" />

      <div className="mx-auto w-full max-w-6xl relative z-10">
        
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12 rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-20 shadow-2xl overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] -z-10 animate-pulse" />
          
          <p className="inline-flex rounded-full border border-indigo-400/40 bg-indigo-400/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">
            Premium Academic Experience
          </p>
          <h1 
            ref={titleRef}
            className="mt-8 text-5xl font-black leading-[1.05] text-white md:text-7xl lg:text-9xl tracking-tighter"
          >
            Elevate Your <br />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">Academic Intellect.</span>
          </h1>
          <p 
            ref={descRef}
            className="mt-10 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-2xl font-medium"
          >
            The universal vault for verified lecture notes, professional study materials, and academic collaboration. 
            Join the elite circle of students from top universities.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-5">
            <Link href="/notes" className="group flex items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-10 py-6 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/30 active:scale-95">
               Explore the Vault <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/upload" className="rounded-2xl border border-white/10 bg-white/5 px-10 py-6 text-xs font-black uppercase tracking-widest text-white backdrop-blur-xl hover:bg-white/10 transition-all active:scale-95 text-center">
               Upload Assets
            </Link>
          </div>
        </motion.section>

        {/* Stats Grid */}
        <section className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2rem] border border-white/5 bg-white/5 backdrop-blur-md text-center group hover:bg-white/10 transition-all"
            >
              <stat.icon className="w-6 h-6 text-indigo-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-3xl font-black text-white mb-1 tracking-tighter">{stat.value}</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{stat.label}</p>
            </motion.div>
          ))}
        </section>

        {/* Core Pillars */}
        <div className="mt-40 grid gap-8 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Nexus Verified", desc: "Every note is audited by our moderation council for academic integrity." },
            { icon: Zap, title: "Instant Access", desc: "No paywalls. No ads. Just pure academic knowledge at your fingertips." },
            { icon: Award, title: "Earn Prestige", desc: "Climb the leaderboard, earn rank artifacts, and build your academic profile." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-[2.5rem] border border-white/5 bg-white/5 p-10 backdrop-blur-xl hover:border-indigo-500/30 transition-all group"
            >
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-8 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Premium Features Section */}
        <section className="mt-48">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">The Nexus Experience</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-lg leading-relaxed">
              Unlock a suite of powerful academic tools designed to transform how you learn, collaborate, and excel.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {premiumFeatures.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group p-8 rounded-[2rem] border border-white/5 bg-white/5 hover:bg-white/[0.08] transition-all relative overflow-hidden"
              >
                <div className={`h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-48 mb-20 text-center">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="inline-block p-[1px] rounded-[3rem] bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500 w-full"
           >
              <div className="rounded-[2.95rem] bg-black px-8 py-24 sm:px-12 md:py-32 backdrop-blur-3xl overflow-hidden relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/20 blur-[120px] -z-10" />
                 
                 <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.95]">Ready to lead the <br/> academic revolution?</h2>
                 <p className="text-zinc-500 max-w-xl mx-auto mb-14 text-lg font-medium leading-relaxed">
                   Join 50,000+ elite students sharing knowledge across 200+ departments worldwide. Start your legacy today.
                 </p>
                 <Link href="/register" className="inline-block w-full sm:w-auto rounded-2xl bg-white px-16 py-6 text-xs font-black uppercase tracking-[0.2em] text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                    Initialize Your Account
                 </Link>
              </div>
           </motion.div>
        </section>
      </div>
    </div>
  );
}

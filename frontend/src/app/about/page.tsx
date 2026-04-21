"use client";

import MainNav from "@/components/ui/MainNav";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current && sectionsRef.current) {
      // Hero entrance
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      // Scroll animations for sections
      const sections = sectionsRef.current.querySelectorAll(".scroll-section");
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }
  }, []);

  return (
    <main ref={containerRef} className="min-h-screen bg-black px-4 py-12 sm:px-6 lg:px-10 overflow-x-hidden">
      <MainNav />
      
      <div className="mx-auto w-full max-w-6xl mt-12">
        <section ref={heroRef} className="text-center py-20 border-b border-white/5">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs uppercase tracking-[0.4em] text-indigo-400 font-bold mb-6"
          >
            Revolutionizing Study
          </motion.p>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
            The Future of <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-cyan-400">Academic Sharing</span>
          </h1>
          <p className="mt-8 max-w-2xl mx-auto text-zinc-400 text-lg md:text-xl leading-relaxed">
            NoteSphere is not just a repository. It&apos;s a high-performance ecosystem designed to bridge the gap between chaotic study materials and academic excellence.
          </p>
        </section>

        <div ref={sectionsRef} className="space-y-32 py-32">
          {/* Mission */}
          <section className="scroll-section grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Our Mission</h2>
              <p className="text-zinc-400 text-lg leading-relaxed">
                We believe that every student deserves access to high-quality, verified academic resources. 
                Our mission is to eliminate the friction of searching for notes through fragmented WhatsApp groups and messy drives.
              </p>
              <div className="flex gap-4">
                <div className="h-1 w-20 bg-indigo-500 rounded-full" />
                <div className="h-1 w-10 bg-zinc-800 rounded-full" />
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl aspect-square flex items-center justify-center">
               <div className="text-6xl font-black text-indigo-500/20 rotate-12 select-none">MISSION</div>
            </div>
          </section>

          {/* Gamification */}
          <section className="scroll-section grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl aspect-square flex items-center justify-center">
               <div className="text-6xl font-black text-cyan-500/20 -rotate-12 select-none">RANK XP</div>
            </div>
            <div className="order-1 md:order-2 space-y-6 text-right md:text-left">
              <h2 className="text-3xl font-bold text-white">Gamified Growth</h2>
              <p className="text-zinc-400 text-lg leading-relaxed text-right">
                Sharing is rewarding. Gain XP, earn prestigious badges, and climb the leaderboard. 
                Your contribution score reflects your impact on the student community.
              </p>
              <div className="flex gap-4 justify-end">
                <div className="h-1 w-10 bg-zinc-800 rounded-full" />
                <div className="h-1 w-20 bg-cyan-500 rounded-full" />
              </div>
            </div>
          </section>

          {/* Verification */}
          <section className="scroll-section">
            <div className="rounded-[3rem] border border-white/10 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 p-12 md:p-20 text-center">
              <h2 className="text-4xl font-bold text-white">Trust by Verification</h2>
              <p className="mt-6 max-w-2xl mx-auto text-zinc-400 text-lg">
                Every note undergoes a peer-review and moderator verification process. 
                Only the most accurate and well-organized content makes it to the "Verified" vault.
              </p>
              <button className="mt-10 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 transition-transform active:scale-95">
                Join the Council
              </button>
            </div>
          </section>
        </div>

        {/* Footer Meta */}
        <section className="scroll-section grid gap-4 md:grid-cols-3 pb-20 border-t border-white/5 pt-20">
          {[
            { label: "Agency", val: "Nextora Studio" },
            { label: "Lead Developer", val: "Salah Uddin Kader" },
            { label: "Vibe", val: "&ldquo;Bro NoteSphere check kor 😎&rdquo;" },
          ].map((item) => (
            <article key={item.label} className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold">{item.label}</p>
              <p className="mt-3 text-white font-medium text-lg">{item.val}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

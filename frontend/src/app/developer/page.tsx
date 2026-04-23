"use client";

import MainNav from "@/components/ui/MainNav";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code2, Palette, Box, Globe, Cpu, Sparkles, Terminal } from "lucide-react";
import { useRef } from "react";

// Custom Social Icons since some versions of Lucide don't include brand icons
const GithubIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const FacebookIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const skills = [
  { name: "Fullstack Engineering", level: 95, color: "from-indigo-500 via-blue-500 to-cyan-500", icon: Code2, desc: "Architecting scalable backend & frontend ecosystems." },
  { name: "UI/UX Design", level: 90, color: "from-purple-500 via-fuchsia-500 to-pink-500", icon: Palette, desc: "Crafting immersive, pixel-perfect user experiences." },
  { name: "3D Web Graphics", level: 85, color: "from-amber-500 via-orange-500 to-red-500", icon: Box, desc: "Building interactive 3D environments with WebGL." },
  { name: "Progressive Web Apps", level: 92, color: "from-emerald-500 via-teal-500 to-cyan-500", icon: Globe, desc: "Developing lightning-fast, offline-capable applications." },
];

const socials = [
  { name: "GitHub", url: "https://github.com/salahuddingfx", icon: GithubIcon },
  { name: "LinkedIn", url: "https://linkedin.com/in/salahuddingfx", icon: LinkedinIcon },
  { name: "Facebook", url: "https://facebook.com/salahuddingfx", icon: FacebookIcon },
  { name: "Twitter", url: "https://x.com/salahuddingfx", icon: TwitterIcon },
];

export default function DeveloperPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <main ref={containerRef} className="min-h-screen bg-[#06070b] text-white selection:bg-indigo-500/30 overflow-x-hidden">
      <MainNav />
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <section className="relative mx-auto w-full max-w-7xl pt-32 pb-20 px-6 lg:px-10 z-10">
        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24 items-start">
          
          {/* Profile Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-[380px] space-y-10 lg:sticky lg:top-32"
          >
            <div className="group relative">
               <div className="absolute -inset-1 rounded-[3rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 blur-2xl opacity-20 group-hover:opacity-50 transition duration-700" />
               <div className="relative aspect-square rounded-[3rem] border border-white/10 bg-white/5 p-4 backdrop-blur-3xl overflow-hidden shadow-2xl">
                  <motion.img 
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2 }}
                    src="https://github.com/salahuddingfx.png" 
                    alt="Salah Uddin Kader" 
                    className="h-full w-full rounded-[2.2rem] object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400"
                >
                  <Cpu size={12} /> Lead Engineer
                </motion.div>
                <h1 className="text-5xl xl:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
                  Salah Uddin Kader
                </h1>
                <p className="text-indigo-400 font-bold uppercase tracking-[0.3em] text-xs">Architect & Visionary</p>
              </div>
              
              <p className="text-zinc-400 leading-relaxed text-lg font-medium">
                Passionate engineer dedicated to building the next generation of academic sharing platforms. 
                Focused on high-performance web systems and immersive UI experiences.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {socials.map((social, idx) => (
                <motion.a 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  key={social.name} 
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group h-14 w-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300 backdrop-blur-xl"
                >
                  <social.icon size={22} strokeWidth={2} className="group-hover:scale-110 transition-transform duration-300" />
                </motion.a>
              ))}
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 space-y-20"
          >
            {/* Expertise Section */}
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-black uppercase tracking-[0.5em] text-zinc-500">Technical Expertise</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
              </div>
              
              <div className="grid gap-10">
                {skills.map((skill, idx) => (
                  <motion.div 
                    key={skill.name} 
                    className="group space-y-4"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex justify-between items-start">
                       <div className="flex gap-4 items-center">
                         <div className={`p-3 rounded-2xl bg-gradient-to-br ${skill.color} bg-opacity-10 backdrop-blur-xl border border-white/5 shadow-lg group-hover:shadow-indigo-500/20 transition-all duration-500`}>
                            <skill.icon size={20} className="text-white" />
                         </div>
                         <div>
                           <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{skill.name}</h3>
                           <p className="text-sm text-zinc-500 font-medium">{skill.desc}</p>
                         </div>
                       </div>
                       <span className="text-xs font-black text-indigo-500/60 uppercase tracking-widest">{skill.level}%</span>
                    </div>
                    
                    <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 2, delay: 0.6 + idx * 0.1, ease: "circOut" }}
                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${skill.color} rounded-full`} 
                       />
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mission Section */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="group relative rounded-[3rem] border border-white/10 bg-white/5 p-12 xl:p-16 backdrop-blur-3xl overflow-hidden shadow-2xl"
            >
               <div className="absolute top-0 right-0 p-8 text-indigo-500/20 group-hover:text-indigo-500/40 transition-colors duration-500">
                 <Sparkles size={120} strokeWidth={1} />
               </div>
               
               <div className="relative z-10 space-y-8">
                 <div className="flex items-center gap-3">
                   <Terminal className="text-indigo-500" size={24} />
                   <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Core Mission</h3>
                 </div>
                 
                 <p className="text-zinc-300 leading-relaxed italic text-2xl xl:text-3xl font-medium tracking-tight">
                   "My goal is to bridge the gap between <span className="text-white font-bold underline decoration-indigo-500/50 underline-offset-8">complex academic resources</span> and student accessibility. NoteSphere is the physical manifestation of that vision—a vault built for the future."
                 </p>
                 
                 <div className="pt-4 flex items-center gap-4">
                   <div className="h-12 w-12 rounded-full border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center">
                     <span className="text-indigo-400 font-black text-sm">S</span>
                   </div>
                   <div>
                     <p className="text-white font-bold text-sm">Salah Uddin kader</p>
                     <p className="text-indigo-400/60 text-xs font-bold uppercase tracking-widest">Founder & Lead Dev</p>
                   </div>
                 </div>
               </div>

               {/* Decorative Gradient */}
               <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full group-hover:bg-indigo-500/20 transition-colors duration-700" />
            </motion.div>

            {/* Footer Tagline */}
            <div className="flex justify-center pt-10">
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.8em]">Built with passion • NoteSphere Ecosystem</p>
            </div>
          </motion.div>
        </div>
      </section>
      
      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </main>
  );
}

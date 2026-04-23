"use client";

import MainNav from "@/components/ui/MainNav";
import { motion, useScroll, useTransform } from "framer-motion";
import { Github, Linkedin, Facebook, Twitter, Code2, Palette, Box, Globe, Cpu, Sparkles, Terminal } from "lucide-react";
import { useRef } from "react";

const skills = [
  { name: "Fullstack Engineering", level: 95, color: "from-indigo-500 via-blue-500 to-cyan-500", icon: Code2, desc: "Architecting scalable backend & frontend ecosystems." },
  { name: "UI/UX Design", level: 90, color: "from-purple-500 via-fuchsia-500 to-pink-500", icon: Palette, desc: "Crafting immersive, pixel-perfect user experiences." },
  { name: "3D Web Graphics", level: 85, color: "from-amber-500 via-orange-500 to-red-500", icon: Box, desc: "Building interactive 3D environments with WebGL." },
  { name: "Progressive Web Apps", level: 92, color: "from-emerald-500 via-teal-500 to-cyan-500", icon: Globe, desc: "Developing lightning-fast, offline-capable applications." },
];

const socials = [
  { name: "GitHub", url: "https://github.com/salahuddingfx", icon: Github },
  { name: "LinkedIn", url: "https://linkedin.com/in/salahuddingfx", icon: Linkedin },
  { name: "Facebook", url: "https://facebook.com/salahuddingfx", icon: Facebook },
  { name: "Twitter", url: "https://x.com/salahuddingfx", icon: Twitter },
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

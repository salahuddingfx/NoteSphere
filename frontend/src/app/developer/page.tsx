"use client";

import MainNav from "@/components/ui/MainNav";
import { motion } from "framer-motion";

const skills = [
  { name: "Fullstack Engineering", level: 95, color: "from-indigo-500 to-cyan-500" },
  { name: "UI/UX Design", level: 90, color: "from-purple-500 to-pink-500" },
  { name: "3D Web Graphics", level: 85, color: "from-amber-500 to-orange-500" },
  { name: "Progressive Web Apps", level: 92, color: "from-emerald-500 to-teal-500" },
];

const socials = [
  { name: "GitHub", url: "#", icon: "G" },
  { name: "LinkedIn", url: "#", icon: "L" },
  { name: "Facebook", url: "#", icon: "F" },
  { name: "Twitter", url: "#", icon: "T" },
];

export default function DeveloperPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-12 sm:px-6 lg:px-10 overflow-hidden">
      <MainNav />
      
      <section className="mx-auto w-full max-w-5xl mt-20 relative">
        {/* Background Glow */}
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute top-80 -right-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="flex flex-col lg:flex-row gap-16 items-start relative z-10">
          {/* Profile Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-1/3 space-y-8"
          >
            <div className="group relative">
               <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-indigo-500 to-cyan-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
               <div className="relative aspect-square rounded-[3rem] border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Salahuddin" 
                    alt="Developer" 
                    className="h-full w-full rounded-[2.5rem] object-cover"
                  />
               </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-black text-white tracking-tighter">Salahuddin</h1>
              <p className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-xs">Architect & Visionary</p>
              <p className="text-zinc-400 leading-relaxed">
                Passionate engineer dedicated to building the next generation of academic sharing platforms. 
                Focused on high-performance web systems and immersive UI experiences.
              </p>
            </div>

            <div className="flex gap-4">
              {socials.map((social) => (
                <a 
                  key={social.name} 
                  href={social.url}
                  className="h-12 w-12 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center text-white font-black hover:bg-white hover:text-black transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 space-y-12"
          >
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.4em] text-zinc-500 mb-8">Technical Expertise</h2>
              <div className="grid gap-8">
                {skills.map((skill, idx) => (
                  <div key={skill.name} className="space-y-3">
                    <div className="flex justify-between items-end">
                       <span className="text-lg font-bold text-white">{skill.name}</span>
                       <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">{skill.level}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1.5, delay: 0.5 + idx * 0.1 }}
                        className={`h-full bg-gradient-to-r ${skill.color}`} 
                       />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-white/5 bg-white/5 p-10 backdrop-blur-xl">
               <h3 className="text-2xl font-bold text-white mb-4">Core Mission</h3>
               <p className="text-zinc-400 leading-relaxed italic text-lg">
                 "My goal is to bridge the gap between complex academic resources and student accessibility. NoteSphere is the physical manifestation of that vision—a vault built for the future."
               </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

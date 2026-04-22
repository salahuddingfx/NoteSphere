"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, ChevronRight, Loader2, Sparkles, Zap, Target, BookOpen, Trophy } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

interface Step {
  title: string;
  description: string;
  duration: string;
}

export default function LearningPath({ note }: { note: any }) {
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState<Step[] | null>(null);
  const { showToast } = useToast();

  const generatePath = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/ai/learning-path", {
        title: note.title,
        subject: note.subject,
        description: note.description
      });
      setPath(data.path.steps);
      showToast("Nexus Roadmap generated successfully.", "success");
    } catch (err) {
      showToast("The Nexus failed to map this path. Try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[2.5rem] border border-white/5 bg-white/5 p-8 backdrop-blur-xl overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
         <Map className="w-40 h-40 text-white" />
      </div>

      <div className="relative z-10">
        <header className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                 <Target className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="text-xl font-bold text-white tracking-tight">AI Learning Path</h3>
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Optimized Knowledge Roadmap</p>
              </div>
           </div>
           {!path && (
             <button 
               onClick={generatePath}
               disabled={loading}
               className="px-6 py-3 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50"
             >
               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
               Manifest Roadmap
             </button>
           )}
        </header>

        <AnimatePresence mode="wait">
           {loading ? (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="py-12 flex flex-col items-center justify-center gap-4"
             >
                <div className="relative">
                   <div className="h-16 w-16 rounded-full border-2 border-white/5 border-t-indigo-500 animate-spin" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-indigo-400 animate-pulse" />
                   </div>
                </div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Consulting Nexus Architects...</p>
             </motion.div>
           ) : path ? (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-4"
             >
                {path.map((step, i) => (
                  <div key={i} className="group/step relative flex gap-6">
                     {/* Connector Line */}
                     {i !== path.length - 1 && (
                       <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-white/5 group-hover/step:bg-indigo-500/20 transition-colors" />
                     )}
                     
                     <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-sm font-black border transition-all ${
                       i === 0 ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 border-white/10 text-zinc-500'
                     }`}>
                        {i + 1}
                     </div>
                     
                     <div className="flex-1 pb-8">
                        <div className="flex items-center gap-3 mb-1">
                           <h4 className="text-base font-bold text-white group-hover/step:text-indigo-400 transition-colors">{step.title}</h4>
                           <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[8px] font-black uppercase text-zinc-600">{step.duration}</span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">{step.description}</p>
                     </div>
                  </div>
                ))}
                
                <div className="pt-4 flex items-center gap-4">
                   <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <Trophy className="w-5 h-5" />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Mastery Achievement Unlocked Upon Completion</p>
                </div>
             </motion.div>
           ) : (
             <div className="py-12 text-center rounded-3xl border border-dashed border-white/5">
                <BookOpen className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">Generate a specialized roadmap to master this concept.</p>
             </div>
           )}
        </AnimatePresence>
      </div>
    </div>
  );
}

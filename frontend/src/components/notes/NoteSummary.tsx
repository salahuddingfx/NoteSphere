"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { Sparkles, Loader2, BookOpen, Zap, Volume2, VolumeX } from "lucide-react";

interface NoteSummaryProps {
  noteId: string;
  initialSummary?: string;
}

export default function NoteSummary({ noteId, initialSummary }: NoteSummaryProps) {
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!summary) return;

    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const generateSummary = async () => {
    setLoading(true);
    try {
      const { data } = await api.post(`/notes/${noteId}/summary`);
      setSummary(data.summary);
    } catch (err) {
      console.error("Failed to generate summary", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-white/5 bg-white/5 p-8 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div 
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">AI Note Summary</h3>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Powered by NoteSphere AI</p>
          </div>
        </div>

        <div className="flex gap-2">
           {summary && (
              <button 
                onClick={handleSpeak}
                className={`p-3 rounded-xl border transition-all ${isSpeaking ? 'bg-indigo-500 border-indigo-400 text-white animate-pulse' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'}`}
                title={isSpeaking ? "Stop Reading" : "Read Aloud"}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
           )}
           {!summary && !loading && (
             <button
               onClick={generateSummary}
               className="px-6 py-3 rounded-xl bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2 group"
             >
               <motion.div
                 whileHover={{ rotate: 180 }}
                 transition={{ type: "spring", stiffness: 200 }}
               >
                 <Zap className="w-4 h-4 fill-current" />
               </motion.div>
               Generate Summary
             </button>
           )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 text-zinc-500"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mb-4 text-indigo-400"
            >
              <Loader2 className="w-8 h-8" />
            </motion.div>
            <p className="text-sm font-bold uppercase tracking-widest">Analyzing Note Content...</p>
          </motion.div>
        ) : summary ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-invert max-w-none"
          >
            <div className="text-zinc-300 leading-relaxed text-lg space-y-4 whitespace-pre-wrap">
              {summary}
            </div>
            <div className="mt-8 flex items-center gap-2 text-zinc-500 italic text-sm border-t border-white/5 pt-6">
               <motion.div
                 animate={{ scale: [1, 1.2, 1] }}
                 transition={{ duration: 2, repeat: Infinity }}
               >
                 <BookOpen className="w-4 h-4 text-indigo-500/50" />
               </motion.div>
               <span>Summary is generated based on provided note description and metadata.</span>
            </div>
          </motion.div>
        ) : (
          <div className="py-8 text-center text-zinc-500 bg-black/20 rounded-2xl border border-white/5 border-dashed">
            <p className="text-sm">Get a quick breakdown of this note using our advanced AI summarizer.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

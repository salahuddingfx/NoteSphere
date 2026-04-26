"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, RotateCw, ChevronLeft, ChevronRight, Brain, Zap } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

interface Flashcard {
  front: string;
  back: string;
}

export default function FlashcardDeck({ note }: { note: any }) {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<Flashcard[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { showToast } = useToast();

  const generateFlashcards = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/ai/flashcards", {
        title: note.title,
        subject: note.subject,
        description: note.description
      });
      setCards(data.flashcards.flashcards);
      setCurrentIndex(0);
      setIsFlipped(false);
      showToast("Nexus Study Deck generated.", "success");
    } catch (err) {
      showToast("Failed to synchronize flashcards.", "error");
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (currentIndex < cards!.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="mt-12 rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur-3xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
         <RotateCw className="w-64 h-64 text-white" />
      </div>

      <header className="flex items-center justify-between mb-10 relative z-10">
         <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
               <RotateCw className="w-8 h-8" />
            </div>
            <div>
               <h3 className="text-2xl font-black text-white tracking-tighter">AI Flashcards</h3>
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Active Recall Optimization</p>
            </div>
         </div>
         {!cards && (
           <button 
             onClick={generateFlashcards}
             disabled={loading}
             className="px-8 py-4 rounded-[1.5rem] bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-indigo-600/20"
           >
             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
             Generate Deck
           </button>
         )}
      </header>

      <AnimatePresence mode="wait">
         {loading ? (
           <motion.div 
             key="loading"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="py-32 flex flex-col items-center justify-center gap-6"
           >
              <div className="relative">
                <div className="h-20 w-20 rounded-full border-4 border-white/5 border-t-cyan-500 animate-spin" />
                <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
              <p className="text-sm font-bold text-zinc-500 uppercase tracking-[0.2em]">Structuring Study Cards...</p>
           </motion.div>
         ) : cards ? (
           <motion.div 
             key="deck"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="relative z-10 flex flex-col items-center"
           >
              <div className="mb-8 flex items-center gap-4 text-zinc-500">
                 <button onClick={prevCard} disabled={currentIndex === 0} className="p-2 rounded-full hover:bg-white/5 disabled:opacity-20 transition-all">
                    <ChevronLeft className="w-6 h-6" />
                 </button>
                 <span className="text-[10px] font-black uppercase tracking-widest">{currentIndex + 1} / {cards.length}</span>
                 <button onClick={nextCard} disabled={currentIndex === cards.length - 1} className="p-2 rounded-full hover:bg-white/5 disabled:opacity-20 transition-all">
                    <ChevronRight className="w-6 h-6" />
                 </button>
              </div>

              {/* 3D Card */}
              <div 
                className="relative w-full max-w-lg aspect-[1.6/1] perspective-1000 cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                 <motion.div
                   animate={{ rotateY: isFlipped ? 180 : 0 }}
                   transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                   className="relative w-full h-full transform-style-3d shadow-2xl"
                 >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-10 bg-zinc-900 border border-white/10 rounded-[2.5rem] text-center">
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-6">Question</p>
                       <h4 className="text-2xl font-bold text-white leading-tight">{cards[currentIndex].front}</h4>
                       <div className="mt-10 flex items-center gap-2 text-zinc-500">
                          <Brain className="w-4 h-4" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Click to reveal answer</span>
                       </div>
                    </div>

                    {/* Back */}
                    <div 
                      className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-10 bg-indigo-600 border border-indigo-400 rounded-[2.5rem] text-center"
                      style={{ transform: 'rotateY(180deg)' }}
                    >
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-6">Nexus Insight</p>
                       <h4 className="text-2xl font-black text-white leading-tight">{cards[currentIndex].back}</h4>
                    </div>
                 </motion.div>
              </div>
              
              <p className="mt-10 text-[10px] font-black uppercase tracking-widest text-zinc-600">Pro tip: Use these for active recall practice.</p>
           </motion.div>
         ) : (
           <div className="py-20 text-center relative z-10">
              <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-sm">No study deck initialized.</p>
              <p className="text-[10px] text-zinc-700 mt-2 font-black uppercase tracking-widest">Generate flashcards to boost your learning retention.</p>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
}

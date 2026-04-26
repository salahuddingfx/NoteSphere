"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Play, Pause, RotateCcw, Zap, Trophy, Coffee, Brain } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import confetti from "canvas-confetti";

export default function FocusTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [sessionCount, setSessionCount] = useState(0);
  const { showToast } = useToast();
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          handleTimerComplete();
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, minutes, seconds]);

  const handleTimerComplete = async () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (mode === "focus") {
      setSessionCount(prev => prev + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#06b6d4", "#ffffff"]
      });
      
      showToast("Focus session complete! +50 XP granted.", "success");
      
      try {
        await api.post("/users/reward-xp", { xp: 50, reason: "Focus Session" });
      } catch (err) {
        console.error("Failed to reward XP", err);
      }
      
      setMode("break");
      setMinutes(5);
      setSeconds(0);
    } else {
      showToast("Break over. Back to the Nexus!", "info");
      setMode("focus");
      setMinutes(25);
      setSeconds(0);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setMode("focus");
    setMinutes(25);
    setSeconds(0);
  };

  const setPreset = (m: number) => {
    setIsActive(false);
    setMinutes(m);
    setSeconds(0);
  };

  const progress = mode === "focus" ? ((25 - minutes) * 60 + (60 - seconds)) / (25 * 60) * 100 : ((5 - minutes) * 60 + (60 - seconds)) / (5 * 60) * 100;

  return (
    <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur-3xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
         <Brain className="w-40 h-40 text-white" />
      </div>

      <div className="relative z-10 text-center">
        <header className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3 text-left">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${mode === 'focus' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                 {mode === 'focus' ? <Zap className="w-5 h-5" /> : <Coffee className="w-5 h-5" />}
              </div>
              <div>
                 <h3 className="text-xl font-bold text-white tracking-tight">{mode === 'focus' ? 'Deep Study' : 'System Cool-off'}</h3>
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{mode === 'focus' ? 'Active Focus Mode' : 'Recovery Phase'}</p>
              </div>
           </div>
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] font-black text-white">{sessionCount} Sessions</span>
           </div>
        </header>

        <div className="relative flex items-center justify-center mb-10">
           <svg className="w-48 h-48 -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="8"
                className="text-white/5"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray="552.92"
                initial={{ strokeDashoffset: 552.92 }}
                animate={{ strokeDashoffset: 552.92 - (552.92 * (progress / 100)) }}
                className={mode === 'focus' ? "text-indigo-500" : "text-emerald-500"}
                strokeLinecap="round"
              />
           </svg>
           <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white tracking-tighter tabular-nums">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mt-2">Mins : Secs</p>
           </div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
           {[25, 15, 5].map(m => (
             <button 
               key={m}
               onClick={() => setPreset(m)}
               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${minutes === m ? 'bg-white text-black border-white shadow-xl shadow-white/10' : 'bg-white/5 border-white/10 text-zinc-500 hover:text-white'}`}
             >
               {m}m
             </button>
           ))}
        </div>

        <div className="flex gap-3">
           <button 
            onClick={toggleTimer}
            className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-2xl ${isActive ? 'bg-white/10 border border-white/20 text-white' : 'bg-white text-black hover:bg-zinc-200'}`}
           >
             {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
             {isActive ? 'Pause' : 'Start Focus'}
           </button>
           <button 
            onClick={resetTimer}
            className="aspect-square w-14 rounded-2xl bg-white/5 border border-white/10 text-zinc-500 flex items-center justify-center hover:text-white hover:bg-white/10 transition-all active:scale-95"
           >
             <RotateCcw className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
}

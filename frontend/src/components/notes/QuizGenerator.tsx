"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Loader2, CheckCircle2, XCircle, ChevronRight, HelpCircle, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

interface Question {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export default function QuizGenerator({ note }: { note: any }) {
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<Question[] | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const { showToast } = useToast();

  const generateQuiz = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/ai/quiz", {
        title: note.title,
        subject: note.subject,
        description: note.description
      });
      setQuiz(data.quiz.questions);
      setCurrentStep(0);
      setScore(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      showToast("Interactive Quiz materialized.", "success");
    } catch (err) {
      showToast("Failed to generate quiz. The Nexus is recalibrating.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === quiz![currentStep].answerIndex) {
      setScore(score + 1);
    }
  };

  const nextStep = () => {
    if (currentStep < quiz!.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCurrentStep(quiz!.length); // Quiz finished
    }
  };

  return (
    <div className="mt-12 rounded-[2.5rem] border border-white/10 bg-zinc-950 p-10 backdrop-blur-3xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-10 opacity-5">
         <Brain className="w-48 h-48 text-white" />
      </div>

      <header className="flex items-center justify-between mb-10 relative z-10">
         <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
               <Brain className="w-8 h-8" />
            </div>
            <div>
               <h3 className="text-2xl font-black text-white tracking-tighter">Knowledge Assessment</h3>
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">AI-Powered Recall Optimization</p>
            </div>
         </div>
         {!quiz && (
           <button 
             onClick={generateQuiz}
             disabled={loading}
             className="px-8 py-4 rounded-[1.5rem] bg-white text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-purple-50 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-white/5"
           >
             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-purple-600" />}
             Initialize Assessment
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
             className="py-20 flex flex-col items-center justify-center gap-6"
           >
              <div className="h-20 w-20 rounded-full border-4 border-white/5 border-t-purple-500 animate-spin" />
              <p className="text-sm font-bold text-zinc-500 uppercase tracking-[0.2em]">Extracting core concepts from Nexus...</p>
           </motion.div>
         ) : quiz && currentStep < quiz.length ? (
           <motion.div 
             key="quiz"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="relative z-10"
           >
              <div className="flex items-center justify-between mb-8">
                 <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Question {currentStep + 1} of {quiz.length}</span>
                 <div className="flex gap-1">
                    {quiz.map((_, i) => (
                      <div key={i} className={`h-1.5 w-8 rounded-full ${i <= currentStep ? 'bg-purple-500' : 'bg-white/5'}`} />
                    ))}
                 </div>
              </div>

              <h4 className="text-xl font-bold text-white mb-8 leading-tight">{quiz[currentStep].question}</h4>

              <div className="grid gap-4">
                 {quiz[currentStep].options.map((option, i) => {
                   const isCorrect = i === quiz[currentStep].answerIndex;
                   const isSelected = i === selectedAnswer;
                   
                   return (
                     <button
                       key={i}
                       onClick={() => handleAnswer(i)}
                       disabled={selectedAnswer !== null}
                       className={`flex items-center justify-between p-6 rounded-[1.5rem] border transition-all text-left group ${
                         selectedAnswer === null 
                           ? 'border-white/5 bg-white/5 hover:border-purple-500/50 hover:bg-white/[0.08]' 
                           : isCorrect 
                             ? 'border-emerald-500/50 bg-emerald-500/10' 
                             : isSelected 
                               ? 'border-red-500/50 bg-red-500/10' 
                               : 'border-white/5 bg-white/5 opacity-50'
                       }`}
                     >
                        <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{option}</span>
                        {selectedAnswer !== null && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                        {selectedAnswer !== null && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                     </button>
                   );
                 })}
              </div>

              {showExplanation && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 rounded-2xl bg-white/[0.03] border border-white/5"
                >
                   <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2">Nexus Insight</p>
                         <p className="text-xs text-zinc-400 leading-relaxed italic">{quiz[currentStep].explanation}</p>
                      </div>
                   </div>
                   <button 
                     onClick={nextStep}
                     className="mt-6 w-full py-4 rounded-xl bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 transition-all flex items-center justify-center gap-2"
                   >
                      Proceed to Next Query <ChevronRight className="w-4 h-4" />
                   </button>
                </motion.div>
              )}
           </motion.div>
         ) : quiz && currentStep === quiz.length ? (
           <motion.div 
             key="result"
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="text-center py-10 relative z-10"
           >
              <div className="h-24 w-24 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto mb-6">
                 <Sparkles className="w-12 h-12" />
              </div>
              <h4 className="text-4xl font-black text-white tracking-tighter mb-2">Assessment Secured</h4>
              <p className="text-sm text-zinc-500 uppercase tracking-widest mb-8">Performance Score: <span className="text-emerald-400 font-bold">{score}/{quiz.length}</span></p>
              
              <div className="flex justify-center gap-4">
                 <button 
                   onClick={generateQuiz}
                   className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                 >
                    <RefreshCw className="w-4 h-4" /> Recalibrate
                 </button>
                 <button 
                   onClick={() => setQuiz(null)}
                   className="px-8 py-4 rounded-2xl bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 transition-all shadow-lg shadow-purple-600/20"
                 >
                    Acknowledge & Exit
                 </button>
              </div>
           </motion.div>
         ) : (
           <div className="py-20 text-center relative z-10">
              <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-sm">No active assessment in current session.</p>
              <p className="text-[10px] text-zinc-700 mt-2 font-black uppercase tracking-widest">Consult the Nexus to generate academic queries.</p>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
}

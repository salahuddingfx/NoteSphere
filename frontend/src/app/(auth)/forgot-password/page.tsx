"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, HelpCircle, ArrowRight, Loader2, Sparkles, Lock } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import MainNav from "@/components/ui/MainNav";

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const [step, setStep] = useState(1); // 1: Identifier, 2: Quiz, 3: Success
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [userId, setUserId] = useState("");
  const [quiz, setQuiz] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any>({});
  const [newPassword, setNewPassword] = useState("");

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password-quiz", { identifier });
      setQuiz(data.quiz);
      setUserId(data.userId);
      setStep(2);
      showToast("Security Quiz Generated", "info");
    } catch (err: any) {
      showToast(err.response?.data?.message || "User not found in Nexus.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      return showToast("Password must be at least 6 characters.", "error");
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password-quiz", {
        userId,
        answers,
        newPassword
      });
      setStep(3);
      showToast("Nexus Identity Verified!", "success");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Quiz verification failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <MainNav />
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              exit={{ opacity: 0, x: -20 }}
              className="rounded-[2.5rem] border border-white/10 bg-zinc-950/50 p-10 backdrop-blur-3xl shadow-2xl"
            >
              <div className="mb-8">
                 <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6">
                    <ShieldCheck className="w-6 h-6" />
                 </div>
                 <h1 className="text-3xl font-black text-white tracking-tighter">Recover Identity</h1>
                 <p className="text-zinc-500 mt-2">Enter your email or username to start the Nexus security challenge.</p>
              </div>

              <form onSubmit={handleStartQuiz} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Student Identifier</label>
                  <input 
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Email or Username"
                    className="w-full rounded-2xl border border-white/5 bg-black/40 px-6 py-5 text-sm text-white focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <button 
                  disabled={loading}
                  className="w-full rounded-2xl bg-white py-5 text-sm font-black uppercase tracking-widest text-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Start Challenge"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                 <Link href="/login" className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">
                    Wait, I remember my credentials!
                 </Link>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-[2.5rem] border border-white/10 bg-zinc-950/50 p-10 backdrop-blur-3xl shadow-2xl"
            >
              <div className="mb-8">
                 <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6">
                    <HelpCircle className="w-6 h-6" />
                 </div>
                 <h1 className="text-3xl font-black text-white tracking-tighter">Security Quiz</h1>
                 <p className="text-zinc-500 mt-2">Prove your academic identity by answering these questions correctly.</p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-8">
                {quiz.map((q, idx) => (
                  <div key={q.id} className="space-y-4">
                     <p className="text-sm font-bold text-white flex gap-3">
                        <span className="text-zinc-600">0{idx + 1}.</span>
                        {q.question}
                     </p>
                     <div className="grid gap-2">
                        {q.options.map((opt: string) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setAnswers({...answers, [q.id]: opt})}
                            className={`w-full text-left rounded-xl px-5 py-3 text-xs transition-all border ${
                              answers[q.id] === opt 
                                ? "bg-indigo-500/20 border-indigo-500 text-white" 
                                : "bg-black/40 border-white/5 text-zinc-400 hover:border-white/20"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                     </div>
                  </div>
                ))}

                <div className="pt-6 border-t border-white/5 space-y-6">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-2">
                         <Lock className="w-3 h-3" />
                         New Access Key
                      </label>
                      <input 
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-2xl border border-white/5 bg-black/40 px-6 py-5 text-sm text-white focus:border-indigo-500 outline-none transition-all"
                      />
                   </div>
                   <button 
                    disabled={loading || Object.keys(answers).length < quiz.length}
                    className="w-full rounded-2xl bg-indigo-600 py-5 text-sm font-black uppercase tracking-widest text-white hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-[2.5rem] border border-white/10 bg-zinc-950/50 p-10 backdrop-blur-3xl shadow-2xl text-center"
            >
              <div className="h-20 w-20 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto mb-8">
                 <ShieldCheck className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tighter">Identity Restored</h1>
              <p className="text-zinc-500 mt-4 leading-relaxed">
                 The Nexus has verified your academic credentials. Your password has been successfully reset.
              </p>
              
              <Link 
                href="/login" 
                className="inline-block mt-10 w-full rounded-2xl bg-white py-5 text-sm font-black uppercase tracking-widest text-black hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Enter the Vault
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}


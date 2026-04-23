"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Plus, Trash2, HelpCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import CustomSelect from "@/components/ui/CustomSelect";


interface Quiz {
  _id: string;
  question: string;
  options: string[];
  answer: string;
}

export default function AdminQuizzesPage() {
  const { showToast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newQuiz, setNewQuiz] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: ""
  });

  const fetchQuizzes = useCallback(async () => {
    try {
      const { data } = await api.get("/admin/quizzes");
      setQuizzes(data.quizzes);
    } catch (err) {
      showToast("Failed to fetch quizzes", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleAddQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/admin/quizzes", newQuiz);
      showToast("Security Quiz added to Nexus", "success");
      setShowAddModal(false);
      setNewQuiz({ question: "", options: ["", "", "", ""], answer: "" });
      fetchQuizzes();
    } catch (err) {
      showToast("Failed to create quiz", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this security challenge?")) return;
    try {
      await api.delete(`/admin/quizzes/${id}`);
      showToast("Quiz purged from database", "success");
      fetchQuizzes();
    } catch (err) {
      showToast("Failed to delete quiz", "error");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-indigo-500 animate-spin" /></div>;

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Security Challenges</h1>
          <p className="text-zinc-500 mt-1">Manage academic-themed quizzes for identity verification.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" /> Add Challenge
        </button>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {quizzes.map((quiz, i) => (
          <motion.div
            key={quiz._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-8 rounded-[2.5rem] border border-white/5 bg-white/5 backdrop-blur-xl relative group"
          >
            <div className="flex items-start justify-between mb-6">
               <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                  <HelpCircle className="w-6 h-6" />
               </div>
               <button 
                onClick={() => handleDelete(quiz._id)}
                className="p-2 rounded-xl text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
               >
                  <Trash2 className="w-5 h-5" />
               </button>
            </div>
            
            <h3 className="text-lg font-bold text-white mb-4">{quiz.question}</h3>
            
            <div className="grid grid-cols-2 gap-3">
               {quiz.options.map(opt => (
                 <div key={opt} className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest ${opt === quiz.answer ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400' : 'border-white/5 bg-white/5 text-zinc-500'}`}>
                    {opt}
                 </div>
               ))}
            </div>
          </motion.div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[3rem] p-10 relative shadow-2xl"
           >
              <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white"><X /></button>
              <h2 className="text-2xl font-black text-white tracking-tighter mb-8">New Security Challenge</h2>
              
              <form onSubmit={handleAddQuiz} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Question</label>
                    <input 
                      required
                      value={newQuiz.question}
                      onChange={e => setNewQuiz({...newQuiz, question: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-indigo-500 outline-none transition-all"
                      placeholder="e.g. What is the complexity of Binary Search?"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    {newQuiz.options.map((opt, idx) => (
                      <div key={idx}>
                         <label className="text-[8px] font-black uppercase tracking-widest text-zinc-600 mb-1 block">Option {idx + 1}</label>
                         <input 
                          required
                          value={opt}
                          onChange={e => {
                            const opts = [...newQuiz.options];
                            opts[idx] = e.target.value;
                            setNewQuiz({...newQuiz, options: opts});
                          }}
                          className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-indigo-500 outline-none transition-all"
                         />
                      </div>
                    ))}
                 </div>

                 <CustomSelect 
                   label="Correct Answer"
                   placeholder="Select the correct option"
                   value={newQuiz.answer}
                   onChange={(val) => setNewQuiz({...newQuiz, answer: val})}
                   options={newQuiz.options.filter(o => o.trim() !== "").map(o => ({ value: o, label: o }))}
                 />


                 <button type="submit" className="w-full py-5 rounded-[2rem] bg-indigo-600 text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-500/40">
                    Deploy to Nexus
                 </button>
              </form>
           </motion.div>
        </div>
      )}
    </div>
  );
}

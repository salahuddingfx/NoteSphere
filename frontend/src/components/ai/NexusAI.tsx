"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, User, Loader2, MessageSquare } from "lucide-react";
import { api } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function NexusAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const { data } = await api.post("/ai/chat", { message: userMessage, history });
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Apologies, the Nexus Core is temporarily unstable. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-10 z-[100] h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/40 border border-white/20 group overflow-hidden"


      >
         <motion.div
           animate={{ 
             rotate: [0, 10, -10, 0],
             scale: [1, 1.1, 1]
           }}
           transition={{ duration: 4, repeat: Infinity }}
         >
           <Sparkles className="w-8 h-8" />
         </motion.div>
         <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50, x: 20 }}
            className="fixed bottom-24 right-4 sm:bottom-28 sm:right-10 z-[101] w-[calc(100vw-32px)] sm:w-[400px] h-[calc(100vh-120px)] sm:h-[600px] rounded-[2.5rem] bg-zinc-950 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-3xl flex flex-col"
          >

            {/* Header */}
            <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Bot className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-white font-bold text-sm">Nexus AI Assistant</h3>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest flex items-center gap-1">
                       <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       Nexus Core Operational
                    </p>
                 </div>
               </div>
               <button 
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center text-zinc-400 transition-colors"
               >
                 <X className="w-4 h-4" />
               </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                   <div className="h-16 w-16 rounded-[2rem] bg-indigo-600/10 flex items-center justify-center text-indigo-500 mb-6">
                      <MessageSquare className="w-8 h-8" />
                   </div>
                   <h4 className="text-white font-bold mb-2">Initialize Nexus Stream</h4>
                   <p className="text-zinc-500 text-xs leading-relaxed">Ask me anything about your courses, research topics, or platform features.</p>
                </div>
              )}

              {messages.map((m, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx} 
                  className={`flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`h-8 w-8 rounded-xl flex-shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-zinc-800 text-zinc-400' : 'bg-indigo-600 text-white'}`}>
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[80%] ${m.role === 'user' ? 'bg-white/5 text-zinc-300' : 'bg-indigo-600/10 text-white border border-indigo-500/10'}`}>
                    {m.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-4 rounded-2xl bg-indigo-600/5 border border-indigo-500/10">
                    <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-6 bg-white/5 border-t border-white/5">
               <div className="relative group">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Query the Nexus..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-6 pr-14 py-4 text-xs font-bold text-white placeholder:text-zinc-600 focus:border-indigo-500 outline-none transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:grayscale"
                  >
                    <Send className="w-4 h-4" />
                  </button>
               </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MainNav from "@/components/ui/MainNav";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { MessagesSquare, Plus, MessageCircle, Heart, User, Clock, ChevronLeft, Send, Loader2, Pin } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/components/ui/Toast";

interface Discussion {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
    username: string;
    avatar: string;
    xp: number;
    level: number;
  };
  likes: string[];
  replies: any[];
  isPinned: boolean;
  createdAt: string;
}

export default function SubjectForumPage() {
  const { subject } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { showToast } = useToast();
  
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchDiscussions();
  }, [subject]);

  const fetchDiscussions = async () => {
    try {
      const { data } = await api.get(`/discussions/${subject}`);
      setDiscussions(data.discussions);
    } catch (err) {
      console.error("Failed to fetch discussions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return router.push("/login");
    
    setCreating(true);
    try {
      const { data } = await api.post("/discussions", {
        title: newTitle,
        content: newContent,
        subject
      });
      setDiscussions([data.discussion, ...discussions]);
      setShowCreate(false);
      setNewTitle("");
      setNewContent("");
      showToast("Academic inquiry broadcasted to Nexus.", "success");
    } catch (err) {
      showToast("Failed to broadcast inquiry.", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleLike = async (id: string) => {
    if (!isAuthenticated) return router.push("/login");
    try {
      const { data } = await api.post(`/discussions/${id}/like`);
      setDiscussions(prev => prev.map(d => 
        d._id === id 
          ? { ...d, likes: data.liked ? [...d.likes, user!._id] : d.likes.filter(uid => uid !== user!._id) } 
          : d
      ));
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  return (
    <main className="min-h-screen bg-black px-4 py-12 sm:px-6 lg:px-10">
      <MainNav />
      <section className="mx-auto w-full max-w-4xl mt-12">
        <button 
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Forums
        </button>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-2">Nexus Group</p>
              <h1 className="text-5xl font-black text-white tracking-tighter">{decodeURIComponent(subject as string)}</h1>
           </div>
           <button 
            onClick={() => setShowCreate(!showCreate)}
            className="px-8 py-4 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-xl"
           >
              <Plus className="w-4 h-4" /> Start Discussion
           </button>
        </header>

        <AnimatePresence>
           {showCreate && (
             <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12 rounded-[2.5rem] border border-indigo-500/30 bg-indigo-500/5 p-10 backdrop-blur-3xl"
             >
                <form onSubmit={handleCreate} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Discussion Title</label>
                      <input 
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="What is your academic inquiry?"
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-indigo-500 outline-none transition-all"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Elaborate Content</label>
                      <textarea 
                        required
                        rows={4}
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder="Provide details for the community..."
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-indigo-500 outline-none transition-all resize-none"
                      />
                   </div>
                   <div className="flex justify-end gap-4">
                      <button type="button" onClick={() => setShowCreate(false)} className="px-6 py-3 text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors">Cancel</button>
                      <button 
                        type="submit" 
                        disabled={creating}
                        className="px-10 py-4 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                         {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                         Broadcast to Nexus
                      </button>
                   </div>
                </form>
             </motion.div>
           )}
        </AnimatePresence>

        <div className="space-y-6">
           {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-48 rounded-[2.5rem] bg-white/5 animate-pulse border border-white/5" />
              ))
           ) : discussions.length > 0 ? (
              discussions.map((d, idx) => (
                <motion.article 
                  key={d._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`group p-8 rounded-[2.5rem] border ${d.isPinned ? 'border-indigo-500/30 bg-indigo-500/[0.03]' : 'border-white/5 bg-white/5'} hover:border-white/10 hover:bg-white/[0.07] transition-all`}
                >
                   <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                         <Image 
                          src={d.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${d.author?.username}`}
                          alt={d.author?.name || "Author"}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-2xl border border-white/10 object-cover"
                          unoptimized
                         />
                         <div>
                            <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{d.author?.name || "Scholar"}</p>
                            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-0.5">Level {d.author?.level || 1} • {new Date(d.createdAt).toLocaleDateString()}</p>
                         </div>
                      </div>
                      {d.isPinned && <Pin className="w-4 h-4 text-indigo-400" />}
                   </div>

                   <h3 className="text-xl font-bold text-white mb-4">{d.title}</h3>
                   <p className="text-zinc-400 text-sm leading-relaxed mb-8 line-clamp-3">{d.content}</p>

                   <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex items-center gap-6">
                         <button 
                          onClick={() => handleLike(d._id)}
                          className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${d.likes.includes(user?._id || '') ? 'text-rose-500' : 'text-zinc-500 hover:text-rose-500'}`}
                         >
                            <Heart className={`w-4 h-4 ${d.likes.includes(user?._id || '') ? 'fill-current' : ''}`} />
                            {d.likes.length} Appreciations
                         </button>
                         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            <MessageCircle className="w-4 h-4" />
                            {d.replies.length} Contributions
                         </div>
                      </div>
                      <button className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">Join Inquiry →</button>
                   </div>
                </motion.article>
              ))
           ) : (
              <div className="py-20 text-center rounded-[3rem] border border-dashed border-white/5">
                 <MessagesSquare className="w-12 h-12 text-zinc-700 mx-auto mb-6" />
                 <h2 className="text-xl font-bold text-zinc-400">The forum is silent.</h2>
                 <p className="text-xs text-zinc-600 mt-2 uppercase tracking-widest">Be the first to manifest an academic inquiry.</p>
              </div>
           )}
        </div>
      </section>
    </main>
  );
}

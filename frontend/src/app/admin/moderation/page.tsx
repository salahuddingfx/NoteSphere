"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, FileText, Search, Loader2, User, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface Note {
  _id: string;
  title: string;
  department: string;
  semester: string;
  subject: string;
  isVerified: boolean;
  author: {
    name: string;
    username: string;
  };
  createdAt: string;
}

export default function AdminModerationPage() {
  const { showToast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchNotes = async () => {
    try {
      const { data } = await api.get("/admin/notes");
      setNotes(data.notes);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleVerify = async (noteId: string, isVerified: boolean) => {
    try {
      await api.patch(`/admin/notes/${noteId}/verify`, { isVerified });
      showToast(isVerified ? "Note verified successfully!" : "Note unverified.", isVerified ? "success" : "info");
      fetchNotes();
    } catch (err) {
      console.error("Failed to verify note", err);
      showToast("Failed to update verification status.", "error");
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.subject.toLowerCase().includes(search.toLowerCase()) ||
    n.author.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Content Moderation</h1>
          <p className="text-zinc-500 mt-1">Review and verify academic resources for quality assurance.</p>
        </div>
        
        <div className="relative w-full md:w-80 group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
           <input 
            type="text" 
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/5 text-white focus:border-indigo-500 outline-none transition-all text-xs font-bold"
           />
        </div>
      </header>

      <div className="grid gap-4">
         {filteredNotes.map((note, i) => (
           <motion.article
            key={note._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group flex flex-col lg:flex-row lg:items-center justify-between p-8 rounded-[2.5rem] border border-white/5 bg-white/5 hover:border-white/10 transition-all gap-8"
           >
             <div className="flex items-start gap-6">
                <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                   <FileText className="w-8 h-8" />
                </div>
                <div>
                   <h3 className="text-white font-bold text-xl">{note.title}</h3>
                   <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                      <span className="flex items-center gap-2"><User className="w-3 h-3" /> {note.author.name}</span>
                      <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {new Date(note.createdAt).toLocaleDateString()}</span>
                      <span className="text-indigo-400">{note.department} • {note.semester} Sem</span>
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-4">
                {note.isVerified ? (
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                       <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                    <button 
                      onClick={() => handleVerify(note._id, false)}
                      className="p-3 rounded-xl bg-white/5 text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-black uppercase tracking-widest">
                       Pending
                    </span>
                    <button 
                      onClick={() => handleVerify(note._id, true)}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20"
                    >
                      <CheckCircle className="w-4 h-4" /> Verify Note
                    </button>
                  </div>
                )}
             </div>
           </motion.article>
         ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MainNav from "@/components/ui/MainNav";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { FileText, Download, User, Calendar, Tag, ShieldCheck, ArrowLeft, Eye } from "lucide-react";
import NoteSummary from "@/components/notes/NoteSummary";
import NotePreview from "@/components/notes/NotePreview";

interface Note {
  _id: string;
  title: string;
  slug: string;
  description: string;
  fileUrl: string;
  fileType: string;
  department: string;
  semester: string;
  subject: string;
  subjectCode?: string;
  teacher?: string;
  tags: string[];
  downloads: number;
  isVerified: boolean;
  aiSummary?: string;
  author: {
    name: string;
    avatar: string;
    department: string;
    semester: string;
  };
  createdAt: string;
}

export default function NoteDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await api.get(`/notes/${slug}`);
        setNote(data.note);
      } catch (err) {
        console.error("Failed to fetch note", err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchNote();
  }, [slug]);

  const handleDownload = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    try {
      const { data } = await api.post(`/notes/${note?._id}/download`);
      window.open(data.fileUrl, "_blank");
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="h-12 w-12 rounded-full border-2 border-white/10 border-t-indigo-500 animate-spin" />
    </div>
  );

  if (!note) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <h1 className="text-2xl font-bold">Note not found</h1>
      <button onClick={() => router.back()} className="mt-4 text-indigo-400 font-bold uppercase tracking-widest text-xs">Go Back</button>
    </div>
  );

  return (
    <main className="min-h-screen bg-black px-4 py-12 sm:px-6 lg:px-10">
      <MainNav />
      <section className="mx-auto w-full max-w-5xl mt-12">
        <button 
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vault
        </button>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <header>
               <div className="flex items-center gap-4 mb-6">
                 <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    {note.fileType} Asset
                 </span>
                 {note.isVerified && (
                   <motion.span 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-400"
                   >
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                   </motion.span>
                 )}
               </div>
               <h1 className="text-5xl font-black text-white tracking-tight leading-tight mb-4">
                 {note.title}
               </h1>
               <div className="flex flex-wrap gap-4 text-zinc-400 text-sm font-bold">
                 <div className="flex items-center gap-2">
                   <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                   >
                     <Tag className="w-4 h-4 text-indigo-400" />
                   </motion.div>
                   <span>{note.subjectCode ? `${note.subjectCode} • ` : ""}{note.subject}</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <Calendar className="w-4 h-4 text-indigo-400" />
                   <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                 </div>
               </div>

            </header>

            <div className="rounded-[2.5rem] border border-white/5 bg-white/5 p-10 backdrop-blur-xl">
             {/* Live Preview Section */}
             <section className="space-y-6 mb-12">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-xl font-bold text-white tracking-tight">Interactive Preview</h2>
                </div>
                {note && <NotePreview fileUrl={note.fileUrl} fileType={note.fileType} title={note.title} />}
             </section>

               <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs opacity-40">Description</h3>

               <p className="text-zinc-300 text-lg leading-relaxed whitespace-pre-wrap">
                 {note.description}
               </p>
               
               {note.tags.length > 0 && (
                 <div className="mt-8 flex flex-wrap gap-2">
                    {note.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-bold text-zinc-500 uppercase">
                        #{tag}
                      </span>
                    ))}
                 </div>
               )}
            </div>

            {/* AI Summary Section */}
            <NoteSummary noteId={note._id} initialSummary={note.aiSummary} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/5 bg-white/5 p-8 backdrop-blur-xl sticky top-32">
               <div className="flex items-center gap-4 mb-8">
                 <img src={note.author.avatar} alt={note.author.name} className="h-14 w-14 rounded-2xl border border-white/10 object-cover" />
                 <div>
                    <p className="text-white font-bold">{note.author.name}</p>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">{note.department} • {note.semester} Sem</p>
                 </div>
               </div>

               <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Professor</span>
                    <span className="text-sm text-white font-bold">{note.teacher || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Downloads</span>
                    <span className="text-sm text-white font-bold">{note.downloads}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Extension</span>
                    <span className="text-sm text-white font-bold uppercase">{note.fileType}</span>
                  </div>
               </div>

               <button 
                onClick={handleDownload}
                className="group w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
               >
                 <motion.div
                  whileHover={{ y: [0, 2, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                 >
                   <Download className="w-4 h-4" />
                 </motion.div>
                 Secure Download
               </button>

            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

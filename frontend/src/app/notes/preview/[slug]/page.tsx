"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ArrowLeft, ExternalLink, Loader2, FileText, Download } from "lucide-react";
import { motion } from "framer-motion";

interface Note {
  _id: string;
  title: string;
  fileUrl: string;
  fileType: string;
}

export default function FullPreviewPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
    </div>
  );

  if (!note) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <p className="text-xl font-bold">Note not found</p>
      <button onClick={() => router.back()} className="mt-4 text-indigo-400">Go Back</button>
    </div>
  );

  const isImage = ["jpg", "jpeg", "png", "webp"].includes(note.fileType.toLowerCase());

  return (
    <main className="h-screen w-screen bg-zinc-950 flex flex-col">
      {/* Top Bar */}
      <nav className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-md px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white font-bold text-sm tracking-tight">{note.title}</h1>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Full Screen Preview</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.open(note.fileUrl, "_blank")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white text-xs font-bold hover:bg-white/5 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Open Original
          </button>
          <a 
            href={note.fileUrl}
            download
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-black hover:scale-105 transition-all"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
        </div>
      </nav>

      {/* Full Preview Area */}
      <div className="flex-1 relative overflow-hidden bg-zinc-900 flex items-center justify-center">
        {isImage ? (
          <div className="h-full w-full p-10 overflow-auto flex items-center justify-center">
            <motion.img 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={note.fileUrl} 
              alt={note.title} 
              className="max-h-full max-w-full object-contain shadow-2xl rounded-lg"
            />
          </div>
        ) : note.fileType === "pdf" ? (
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(note.fileUrl)}&embedded=true`}
            className="w-full h-full border-none"
            title={note.title}
          />
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="h-24 w-24 rounded-3xl bg-white/5 flex items-center justify-center text-zinc-700">
               <FileText className="w-12 h-12" />
            </div>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Preview not available for this format</p>
          </div>
        )}
      </div>
    </main>
  );
}

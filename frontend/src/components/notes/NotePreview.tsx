"use client";

import { motion } from "framer-motion";

import { Maximize2, ExternalLink, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";


interface NotePreviewProps {
  fileUrl: string;
  fileType: string;
  title: string;
}

export default function NotePreview({ fileUrl, fileType, title }: NotePreviewProps) {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);


  const isImage = ["jpg", "jpeg", "png", "webp"].includes(fileType.toLowerCase());
  const isPDF = fileType.toLowerCase() === "pdf";

  const optimizeUrl = (url: string) => {
    if (url.includes("cloudinary.com") && url.includes("/upload/")) {
      return url.replace("/upload/", "/upload/q_auto,f_auto/");
    }
    return url;
  };

  return (
    <div className="group relative rounded-[2.5rem] border border-white/5 bg-white/5 overflow-hidden backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent z-10 pointer-events-none" />
      
      {/* Header Info */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Live Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <Link 
            href={`/notes/preview/${slug}`}
            className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors"
          >
            <Maximize2 className="w-4 h-4 text-white" />
          </Link>
          <button 
            onClick={() => window.open(fileUrl, "_blank")}
            className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-white" />
          </button>
        </div>

      </div>

      {/* Preview Content */}
      <div className="aspect-[4/3] w-full relative bg-zinc-900/50 flex items-center justify-center">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-zinc-900/80 backdrop-blur-sm gap-4">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Syncing with Nexus...</p>
          </div>
        )}

        {hasError ? (
          <div className="flex flex-col items-center gap-4 text-zinc-500">
             <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
               <FileText className="w-8 h-8 opacity-20" />
             </div>
             <p className="text-xs font-bold uppercase tracking-widest">Preview Blocked by Browser</p>
             <button onClick={() => window.open(fileUrl, "_blank")} className="text-[10px] text-indigo-400 font-black uppercase tracking-widest hover:underline">Open in New Tab</button>
          </div>
        ) : isImage ? (
          <motion.img 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: loading ? 0 : 1, scale: loading ? 0.95 : 1 }}
            transition={{ duration: 0.5 }}
            src={optimizeUrl(fileUrl)} 
            alt={title} 
            className="max-h-full max-w-full object-contain"
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setHasError(true);
            }}
          />
        ) : isPDF ? (
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`}
            className="w-full h-full border-none"
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setHasError(true);
            }}
            title={title}
          />
        ) : (
          <div className="flex flex-col items-center gap-4 text-zinc-500">
             <FileText className="w-12 h-12 opacity-20" />
             <p className="text-sm font-bold uppercase tracking-widest">Preview not available for {fileType}</p>
          </div>
        )}
      </div>

      {/* Bottom Overlay */}
      <div className="p-6 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0 z-20">
         <div className="flex justify-between items-center">
            <p className="text-white font-bold truncate max-w-[200px]">{title}</p>
            <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">{fileType} format</p>
         </div>
      </div>
    </div>
  );
}

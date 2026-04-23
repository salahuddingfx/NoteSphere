"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { Loader2, ShieldCheck, ShieldAlert, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface AdminNote {
  _id: string;
  title: string;
  slug: string;
  isVerified: boolean;
  author: {
    name: string;
    username: string;
  };
  createdAt: string;
}

export default function AdminNotesPage() {
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchNotes();
  }, []);

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

  const handleToggleVerify = async (id: string, current: boolean) => {
    try {
      await api.patch(`/admin/notes/${id}/verify`, { isVerified: !current });
      setNotes(prev => prev.map(n => n._id === id ? { ...n, isVerified: !current } : n));
    } catch (err) {
      console.error("Failed to update verification", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Purge this asset from the Nexus?")) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error("Failed to delete note", err);
    }
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black text-white tracking-tighter">Vault Management</h1>
        <p className="text-zinc-500 mt-1">Review, verify, or archive academic notes.</p>
      </header>

      <section className="rounded-[3rem] border border-white/5 bg-white/5 p-8 backdrop-blur-xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-zinc-500 text-[10px] uppercase tracking-widest border-b border-white/5">
                  <th className="pb-6">Resource Title</th>
                  <th className="pb-6">Uploader</th>
                  <th className="pb-6">Status</th>
                  <th className="pb-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                       <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
                       <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Scanning Repository...</p>
                    </td>
                  </tr>
                ) : notes.length > 0 ? (
                  notes.map((note) => (
                    <tr key={note._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-6">
                        <div className="flex flex-col">
                           <span className="font-bold text-white">{note.title}</span>
                           <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">{new Date(note.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-6">
                         <Link href={`/profile/${note.author?.username}`} className="hover:text-indigo-400 transition-colors">
                            {note.author?.name || "Unknown"}
                         </Link>
                      </td>
                      <td className="py-6 text-xs uppercase font-black tracking-widest">
                         <div className="flex items-center gap-2">
                           {note.isVerified ? (
                              <span className="text-green-400 flex items-center gap-1">
                                 <ShieldCheck className="w-3 h-3" />
                                 Verified
                              </span>
                           ) : (
                              <span className="text-amber-400 flex items-center gap-1">
                                 <ShieldAlert className="w-3 h-3" />
                                 Pending
                              </span>
                           )}
                         </div>
                      </td>
                      <td className="py-6 text-right">
                         <div className="flex justify-end gap-2">
                            <Link 
                              href={`/notes/${note.slug}`}
                              className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white transition-all"
                            >
                               <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button 
                              onClick={() => handleToggleVerify(note._id, note.isVerified)}
                              className={`rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${note.isVerified ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white' : 'bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white'}`}
                            >
                               {note.isVerified ? "Revoke" : "Verify"}
                            </button>
                            <button 
                              onClick={() => handleDelete(note._id)}
                              className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            >
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-zinc-600 font-bold uppercase tracking-widest">No assets found in vault.</td>
                  </tr>
                )}
              </tbody>
            </table>
         </div>
      </section>
    </div>
  );
}

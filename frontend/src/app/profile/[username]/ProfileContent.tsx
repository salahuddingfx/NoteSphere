"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { getUserRank } from "@/lib/ranks";
import { 
  Diamond, 
  Zap, 
  Building2, 
  Award, 
  History, 
  ArrowLeft, 
  FileText, 
  ShieldCheck, 
  Eye, 
  Download,
  Calendar,
  Globe,
  Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useToast } from "@/components/ui/Toast";

const DynamicThreeBadge = dynamic(() => import("@/components/ui/ThreeBadge"), { ssr: false });

export default function ProfileContent() {
  const { username } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/users/profile/${username}`);
        setProfile(data.user);
        setNotes(data.notes);
      } catch (err) {
        console.error("Profile not found", err);
        showToast("Nexus identity not found in the vault.", "error");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchProfile();
  }, [username]);

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 rounded-full border-2 border-white/10 border-t-indigo-500 animate-spin" />
      <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Decrypting Nexus Identity...</p>
    </div>
  );

  if (!profile) return null;

  const rank = getUserRank(profile.level);

  return (
    <main className="min-h-screen bg-black px-4 py-12 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-6xl mt-12">
        <button 
          onClick={() => router.back()}
          className="mb-12 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vault
        </button>

        <section className="grid gap-12 lg:grid-cols-3">
           <div className="space-y-8">
              <div className="rounded-[3rem] border border-white/10 bg-white/5 p-10 backdrop-blur-3xl text-center flex flex-col items-center">
                 <div className="relative h-40 w-40 mb-8">
                    <img 
                      src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} 
                      alt={profile.name} 
                      className="h-full w-full rounded-[3rem] object-cover ring-4 ring-indigo-500/20"
                    />
                    <div className="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-2xl">
                       <Zap className="h-6 w-6" />
                    </div>
                 </div>
                 
                 <h1 className="text-3xl font-black text-white tracking-tighter mb-2">{profile.name}</h1>
                 <p className="text-sm font-bold text-indigo-400 mb-6">@{profile.username}</p>
                 
                 <div className="flex flex-wrap justify-center gap-2 mb-8">
                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400">{profile.department}</span>
                    <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-400">{profile.semester} Sem</span>
                 </div>

                 <p className="text-sm text-zinc-400 leading-relaxed italic mb-8">
                   "{profile.bio || "Academic contributor in the NoteSphere ecosystem."}"
                 </p>

                 <div className="w-full space-y-4 pt-8 border-t border-white/5">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Joined Nexus</span>
                       <span className="text-xs font-bold text-white">{new Date(profile.createdAt).toLocaleDateString()}</span>
                    </div>
                    {profile.socials?.linkedin && (
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Professional</span>
                         <a href={profile.socials.linkedin} target="_blank" className="text-xs font-bold text-indigo-400 hover:underline">LinkedIn</a>
                      </div>
                    )}
                 </div>
              </div>

              <div className="rounded-[2.5rem] border border-white/5 bg-white/5 p-8 backdrop-blur-xl">
                 <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    Nexus Achievements
                 </h3>
                 <div className="grid grid-cols-3 gap-4">
                    {profile.badges?.length > 0 ? profile.badges.map((badge: string, i: number) => (
                      <div key={i} className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group relative cursor-help">
                         <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black border border-white/10 text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                            {badge}
                         </div>
                         <span className="text-2xl">🏅</span>
                      </div>
                    )) : (
                      <p className="col-span-3 text-[10px] text-center py-4 font-bold text-zinc-600 uppercase tracking-widest">No badges earned yet.</p>
                    )}
                 </div>
              </div>
           </div>

           <div className="lg:col-span-2 space-y-12">
              <div className="grid gap-6 md:grid-cols-2">
                 <div className="rounded-[3rem] border border-white/10 bg-zinc-950 p-8 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
                    <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-500/10 to-transparent" />
                    <div className="relative w-48 h-48 mb-4">
                       <DynamicThreeBadge rank={rank.name} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-2">Nexus Tier</p>
                    <h2 className="text-3xl font-black text-white tracking-tighter mb-1">{rank.name}</h2>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{profile.xp} Cumulative XP</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-[2.5rem] border border-white/5 bg-white/5 p-8 backdrop-blur-xl flex flex-col justify-center">
                       <FileText className="w-6 h-6 text-indigo-400 mb-4" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Assets Shared</p>
                       <p className="text-3xl font-black text-white">{notes.length}</p>
                    </div>
                    <div className="rounded-[2.5rem] border border-white/5 bg-white/5 p-8 backdrop-blur-xl flex flex-col justify-center">
                       <Download className="w-6 h-6 text-emerald-400 mb-4" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Total Pulls</p>
                       <p className="text-3xl font-black text-white">
                          {notes.reduce((acc, curr) => acc + (curr.downloads || 0), 0)}
                       </p>
                    </div>
                    <div className="col-span-2 rounded-[2.5rem] border border-white/5 bg-white/5 p-8 backdrop-blur-xl">
                       <Eye className="w-6 h-6 text-cyan-400 mb-4" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Asset Exposure</p>
                       <p className="text-3xl font-black text-white">
                          {notes.reduce((acc, curr) => acc + (curr.views || 0), 0)} Views
                       </p>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center justify-between px-4">
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                       <History className="w-4 h-4 text-indigo-400" />
                       Nexus Contribution Records
                    </h3>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{notes.length} Active Records</span>
                 </div>

                 <div className="grid gap-4">
                    {notes.map((note) => (
                      <Link 
                        key={note._id} 
                        href={`/notes/${note.slug}`}
                        className="group flex flex-col md:flex-row md:items-center justify-between rounded-[2rem] border border-white/5 bg-white/5 p-8 hover:border-indigo-500/30 transition-all backdrop-blur-xl overflow-hidden relative"
                      >
                        <div className="absolute -right-4 -top-4 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                           <FileText className="w-32 h-32 text-white" />
                        </div>
                        <div className="flex items-center gap-6 relative z-10">
                           <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 flex flex-col items-center justify-center text-indigo-400 border border-indigo-500/10 group-hover:scale-105 transition-transform">
                              <span className="text-[10px] font-black uppercase">{note.fileType}</span>
                              <FileText className="w-4 h-4 mt-1" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">
                                {note.subjectCode ? `${note.subjectCode} • ` : ""}{note.subject}
                              </p>
                              <h4 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">
                                 {note.title}
                              </h4>
                              <div className="flex gap-4 mt-3">
                                 <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 uppercase">
                                    <Eye className="w-3 h-3" /> {note.views}
                                 </span>
                                 <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 uppercase">
                                    <Download className="w-3 h-3" /> {note.downloads}
                                 </span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-6 mt-6 md:mt-0 relative z-10">
                           {note.isVerified && (
                             <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Verified
                             </span>
                           )}
                           <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">{new Date(note.createdAt).getFullYear()}</span>
                           <ArrowLeft className="w-5 h-5 text-zinc-700 rotate-180 group-hover:text-indigo-400 transition-colors" />
                        </div>
                      </Link>
                    ))}

                    {notes.length === 0 && (
                      <div className="py-20 text-center rounded-[2.5rem] border border-dashed border-white/5">
                         <p className="text-zinc-600 font-bold uppercase tracking-widest text-sm">No assets found in this identity's records.</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </section>
      </div>
    </main>
  );
}

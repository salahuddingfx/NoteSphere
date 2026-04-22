"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AuthGate from "@/components/auth/AuthGate";
import { useAuthStore } from "@/store/auth.store";
import { getUserRank } from "@/lib/ranks";
import { api } from "@/lib/api";
import { Building2, Zap, TrendingUp, Diamond, Award, BookOpen, ChevronRight, Loader2, Bookmark, FolderOpen, History } from "lucide-react";
import dynamic from "next/dynamic";

import ContributionChart from "@/components/dashboard/ContributionChart";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import SecuritySettings from "@/components/dashboard/SecuritySettings";

// Dynamically import ThreeBadge to avoid SSR issues with Canvas
const DynamicThreeBadge = dynamic(() => import("@/components/ui/ThreeBadge"), { ssr: false });

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const [myNotes, setMyNotes] = useState<any[]>([]);
  const [savedNotes, setSavedNotes] = useState<any[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [activeTab, setActiveTab] = useState<"history" | "saved">("history");

  // Calculate Level Progress
  const currentXP = user?.xp || 0;
  const levelXP = currentXP % 500;
  const progress = (levelXP / 500) * 100;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [myNotesRes, savedNotesRes] = await Promise.all([
          api.get("/users/notes"),
          api.get("/users/saved-notes")
        ]);
        setMyNotes(myNotesRes.data.notes);
        setSavedNotes(savedNotesRes.data.notes);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoadingNotes(false);
        setLoadingSaved(false);
      }
    };
    fetchDashboardData();
  }, []);

  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    setRecentlyViewed(saved);
  }, []);

  if (!user) return null;


  return (
    <AuthGate>
      <div className="mx-auto w-full max-w-6xl px-4 pb-20">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-8 lg:grid-cols-3"
        >
          {/* Main Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            <header className="flex flex-col gap-8 rounded-[3rem] border border-white/10 bg-white/5 p-10 backdrop-blur-3xl md:flex-row md:items-center">
              <div className="relative h-32 w-32 shrink-0">
                <img 
                  src={user.avatar || "/default-avatar.png"} 
                  alt={user.name} 
                  className="h-full w-full rounded-[2.5rem] object-cover ring-4 ring-indigo-500/20"
                />
                <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl">
                  <Zap className="h-5 w-5" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Nexus Core Status</p>
                <h1 className="text-4xl font-black text-white tracking-tighter">Welcome, {user.name}</h1>
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold text-zinc-400">{user.department}</span>
                  <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[10px] font-bold text-indigo-400">Semester {user.semester}</span>
                </div>
              </div>
              <button 
                onClick={logout}
                className="rounded-2xl border border-white/5 bg-white/5 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-all self-start md:self-center"
              >
                System Logout
              </button>
            </header>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { icon: Building2, label: "Department", value: user.department, color: "text-indigo-400" },
                { icon: TrendingUp, label: "Daily Streak", value: `${user.streakCount || 0} Days`, color: "text-amber-400" },
                { icon: Diamond, label: "Content Level", value: `Level ${user.level || 1}`, color: "text-cyan-400" },
                { icon: Award, label: "Total Rank XP", value: `${user.xp || 0} XP`, color: "text-purple-400" }
              ].map((stat, i) => (
                <div key={i} className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-xl">
                  <stat.icon className={`h-4 w-4 ${stat.color} mb-4`} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</p>
                  <p className="mt-1 text-lg font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Level Progress */}
            <div className="rounded-[2.5rem] border border-white/5 bg-white/5 p-8 backdrop-blur-xl">
               <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                     <Zap className="w-4 h-4 text-indigo-400" />
                     Progression to Level {user.level + 1}
                  </p>
                  <span className="text-xs font-bold text-indigo-400">{Math.floor(progress)}%</span>
               </div>
               <div className="h-3 w-full rounded-full bg-white/5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                  />
               </div>
               <p className="mt-4 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  Collect {500 - levelXP} more XP to transcend to the next academic tier.
               </p>
            </div>
          </div>

          {/* Rank Badge Side */}
          <div className="space-y-6">
            <div className="rounded-[3rem] border border-white/10 bg-zinc-950 p-8 shadow-2xl relative overflow-hidden h-full flex flex-col items-center justify-center text-center">
               <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-8 flex items-center gap-2">
                  <Diamond className="w-3 h-3" />
                  Earned Badges & Rank Artifacts
               </p>
               
               <div className="relative w-full aspect-square mb-6">
                  <DynamicThreeBadge rank={getUserRank(user.level).name} />
               </div>

               <h2 className="text-3xl font-black text-white tracking-tighter mb-2">{getUserRank(user.level).name}</h2>
               <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px]">
                  {getUserRank(user.level).description}
               </p>

            </div>
          </div>
        </motion.section>

        {/* Contribution List */}
        <section className="mt-12">
           <div className="rounded-[3rem] border border-white/5 bg-white/5 p-10 backdrop-blur-3xl overflow-hidden">
              <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
                 <div className="flex gap-4">
                    <button 
                      onClick={() => setActiveTab("history")}
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-zinc-500 hover:text-white'}`}
                    >
                      <History className="w-4 h-4" />
                      Contributions
                    </button>
                    <button 
                      onClick={() => setActiveTab("saved")}
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'saved' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-zinc-500 hover:text-white'}`}
                    >
                      <Bookmark className="w-4 h-4" />
                      Collection
                    </button>
                 </div>
                 <Link href="/upload" className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">Start Upload →</Link>
              </header>

              <div className="grid gap-4">
                 {activeTab === "history" ? (
                    loadingNotes ? (
                      <div className="py-20 flex flex-col items-center justify-center gap-4">
                         <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                         <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Accessing Vault Records...</p>
                      </div>
                    ) : myNotes.length > 0 ? (
                      myNotes.map((note) => (
                       <Link 
                         key={note._id} 
                         href={`/notes/${note.slug}`}
                         className="group flex flex-col md:flex-row md:items-center justify-between rounded-3xl border border-white/5 bg-black/20 p-6 hover:border-indigo-500/30 transition-all"
                       >
                         <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">
                               {note.fileType?.toUpperCase().slice(0, 3) || "PDF"}
                            </div>
                            <div>
                               <p className="text-sm font-bold text-white">{note.title}</p>
                               <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{note.subject} • {note.department}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            {note.isVerified ? (
                              <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg border border-emerald-400/20">Verified</span>
                            ) : (
                              <span className="text-[8px] font-black uppercase tracking-widest text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-lg border border-yellow-400/20">Pending</span>
                            )}
                            <span className="text-[10px] text-zinc-600 font-bold">{new Date(note.createdAt).toLocaleDateString()}</span>
                         </div>
                       </Link>
                     ))
                    ) : (
                      <div className="py-20 text-center rounded-[2rem] border border-dashed border-white/5">
                         <p className="text-zinc-600 font-bold uppercase tracking-widest text-sm">No contributions yet</p>
                         <Link href="/upload" className="inline-block mt-4 text-indigo-400 text-xs font-black uppercase tracking-widest hover:text-indigo-300 transition-colors">Start Uploading →</Link>
                      </div>
                    )
                 ) : (
                    loadingSaved ? (
                      <div className="py-20 flex flex-col items-center justify-center gap-4">
                         <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                         <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Retrieving Collection...</p>
                      </div>
                    ) : savedNotes.length > 0 ? (
                      savedNotes.map((note) => (
                       <Link 
                         key={note._id} 
                         href={`/notes/${note.slug}`}
                         className="group flex flex-col md:flex-row md:items-center justify-between rounded-3xl border border-white/5 bg-black/20 p-6 hover:border-indigo-500/30 transition-all"
                       >
                         <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">
                               <Bookmark className="w-4 h-4" />
                            </div>
                            <div>
                               <p className="text-sm font-bold text-white">{note.title}</p>
                               <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{note.subject} • By {note.author?.name || 'Unknown'}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <span className="text-[10px] text-zinc-600 font-bold">Saved on {new Date(note.createdAt).toLocaleDateString()}</span>
                            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                         </div>
                       </Link>
                     ))
                    ) : (
                      <div className="py-20 text-center rounded-[2rem] border border-dashed border-white/5">
                         <FolderOpen className="w-8 h-8 text-zinc-600 mx-auto mb-4" />
                         <p className="text-zinc-600 font-bold uppercase tracking-widest text-sm">Your collection is empty</p>
                         <Link href="/notes" className="inline-block mt-4 text-indigo-400 text-xs font-black uppercase tracking-widest hover:text-indigo-300 transition-colors">Explore Notes →</Link>
                      </div>
                    )
                 )}
              </div>
           </div>

           <ProfileSettings />
           <SecuritySettings />
           <ContributionChart />
        </section>
      </div>
    </AuthGate>
  );
}

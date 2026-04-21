"use client";

import { useState } from "react";

export default function AdminDeveloperPage() {
  const [profile, setProfile] = useState({
    name: "Salah Uddin Kader",
    designation: "Lead Developer",
    bio: "Building the future of academic sharing.",
    github: "github.com/salahuddingfx",
  });

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black text-white tracking-tighter">Developer Identity</h1>
        <p className="text-zinc-500 mt-1">Update your public profile displayed on the platform.</p>
      </header>

      <section className="max-w-2xl rounded-[3rem] border border-white/5 bg-white/5 p-12 backdrop-blur-xl">
         <div className="space-y-8">
            <div className="space-y-2">
               <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-black">Full Name</label>
               <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full rounded-2xl border border-white/10 bg-black/40 p-5 text-white focus:border-indigo-500 outline-none transition-all"
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-black">Designation</label>
               <input 
                type="text" 
                value={profile.designation}
                onChange={(e) => setProfile({...profile, designation: e.target.value})}
                className="w-full rounded-2xl border border-white/10 bg-black/40 p-5 text-white focus:border-indigo-500 outline-none transition-all"
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-black">Bio Description</label>
               <textarea 
                rows={4}
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                className="w-full rounded-2xl border border-white/10 bg-black/40 p-5 text-white focus:border-indigo-500 outline-none transition-all"
               />
            </div>
            <button className="w-full rounded-2xl bg-indigo-500 py-5 text-sm font-black text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-500/20">
               Update Profile Across Nexus
            </button>
         </div>
      </section>
    </div>
  );
}

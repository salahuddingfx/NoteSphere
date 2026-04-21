"use client";

import { useState, FormEvent } from "react";
import { useAuthStore } from "@/store/auth.store";
import { api } from "@/lib/api";
import { motion } from "framer-motion";

interface ProfileFormData {
  bio: string;
  avatar: string;
  socials: {
    instagram: string;
    facebook: string;
    linkedin: string;
    whatsapp: string;
    contact: string;
  };
}

export default function ProfileSettings() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState<ProfileFormData>({
    bio: user?.bio || "",
    avatar: user?.avatar || "",
    socials: {
      instagram: user?.socials?.instagram || "",
      facebook: user?.socials?.facebook || "",
      linkedin: user?.socials?.linkedin || "",
      whatsapp: user?.socials?.whatsapp || "",
      contact: user?.socials?.contact || "",
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await api.patch("/users/profile", formData);
      setUser(data.user);
      setMessage(data.message);
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl"
    >
      <header className="mb-10">
        <h2 className="text-2xl font-black text-white tracking-tighter">Vault Identity</h2>
        <p className="text-zinc-500 mt-2">Customize how the NoteSphere community sees you.</p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-2">
        {/* Left: Bio & Avatar */}
        <div className="space-y-8">
          <div className="space-y-3">
             <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Profile Bio</label>
             <textarea 
               value={formData.bio}
               onChange={(e) => setFormData({...formData, bio: e.target.value})}
               placeholder="Tell the world who you are..."
               className="w-full rounded-2xl border border-white/5 bg-black/40 p-5 text-white focus:border-indigo-500 outline-none transition-all min-h-[120px]"
             />
          </div>
          <div className="space-y-3">
             <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Avatar URL</label>
             <input 
               type="text"
               value={formData.avatar}
               onChange={(e) => setFormData({...formData, avatar: e.target.value})}
               placeholder="https://..."
               className="w-full rounded-2xl border border-white/5 bg-black/40 p-5 text-white focus:border-indigo-500 outline-none transition-all"
             />
          </div>
        </div>

        {/* Right: Socials */}
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            { key: "instagram", label: "Instagram", icon: "📸" },
            { key: "facebook", label: "Facebook", icon: "📘" },
            { key: "linkedin", label: "LinkedIn", icon: "💼" },
            { key: "whatsapp", label: "WhatsApp", icon: "💬" },
            { key: "contact", label: "Contact No", icon: "📞" },
          ].map((social) => (
            <div key={social.key} className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">{social.icon} {social.label}</label>
               <input 
                type="text" 
                value={formData.socials[social.key as keyof typeof formData.socials]}
                onChange={(e) => setFormData({
                  ...formData, 
                  socials: { 
                    ...formData.socials, 
                    [social.key]: e.target.value 
                  }
                })}
                placeholder={social.label}
                className="w-full rounded-xl border border-white/5 bg-black/40 p-3 text-xs text-white focus:border-indigo-500 outline-none transition-all"
               />
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 flex items-center justify-between pt-6 border-t border-white/5">
           {message && <p className="text-sm font-bold text-green-400">✅ {message}</p>}
           <button 
             disabled={loading}
             className="ml-auto rounded-2xl bg-white px-10 py-4 text-sm font-black text-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
           >
             {loading ? "Syncing..." : "Update Profile"}
           </button>
        </div>
      </form>
    </motion.section>
  );
}

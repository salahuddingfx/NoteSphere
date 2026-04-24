"use client";

import { useState, FormEvent } from "react";
import { useAuthStore } from "@/store/auth.store";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { getUserRank } from "@/lib/ranks";

import { Sparkles, ShieldCheck, FileText, Camera, Users, Award, Phone, Hash } from "lucide-react";

import { useToast } from "@/components/ui/Toast";
import dynamic from "next/dynamic";
import Image from "next/image";

const DynamicThreeBadge = dynamic(() => import("@/components/ui/ThreeBadge"), { ssr: false });



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
  const { showToast } = useToast();
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
      showToast("Identity updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update profile", err);
      showToast("Failed to synchronize with Nexus", "error");
    } finally {

      setLoading(false);
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 rounded-[2.5rem] border border-white/10 bg-white/5 p-6 sm:p-10 backdrop-blur-2xl"
    >
      <header className="mb-10">
        <h2 className="text-2xl font-black text-white tracking-tighter">Vault Identity</h2>
        <p className="text-zinc-500 mt-2">Customize how the NoteSphere community sees you.</p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-2">
        {/* Left: Bio & Avatar */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-10 p-6 sm:p-8 rounded-[2rem] bg-black/40 border border-white/5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles className="w-32 h-32 text-white" />
             </div>
             
             <div className="relative z-10 flex flex-col items-center shrink-0">
                <div className="relative group/avatar">
                   <Image 
                     src={formData.avatar} 
                     width={128}
                     height={128}
                     className="h-32 w-32 rounded-[2rem] border-2 border-indigo-500/30 object-cover shadow-2xl transition-transform group-hover/avatar:scale-[1.02]" 
                     alt="Preview" 
                     unoptimized
                   />
                   <div className="absolute -top-6 -right-6 h-16 w-16">
                      <DynamicThreeBadge rank={getUserRank(user?.level || 1).name} />
                   </div>
                   <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-[2rem] cursor-pointer text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
                      Change Matrix
                      <input 
                       type="file" 
                       className="hidden" 
                       accept="image/*"
                       onChange={async (e) => {
                         if (e.target.files?.[0]) {
                           const file = e.target.files[0];
                           const fd = new FormData();
                           fd.append("avatar", file);
                           setLoading(true);
                           try {
                             const { data } = await api.post("/users/avatar", fd, {
                               headers: { "Content-Type": "multipart/form-data" }
                             });
                             setFormData({ ...formData, avatar: data.user.avatar });
                             setUser(data.user);
                             showToast("Avatar synchronized with Nexus", "success");
                           } catch (err) {
                             console.error("Avatar sync failed", err);
                             showToast("Failed to sync avatar", "error");
                           } finally {
                             setLoading(false);
                           }
                         }
                       }}
                      />
                   </label>
                </div>
             </div>


             <div className="relative z-10 flex-1 space-y-4">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <ShieldCheck className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-white font-bold text-lg">Nexus Identity</p>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Verified Academic Profile</p>
                   </div>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold leading-relaxed">
                   Your profile is secured on the Cloudinary distributed network.
                </p>
             </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                <FileText className="w-3 h-3 text-indigo-500" />
                Profile Bio
             </label>
             <textarea 
               value={formData.bio}
               onChange={(e) => setFormData({...formData, bio: e.target.value})}
               placeholder="Describe your academic journey..."
               className="w-full rounded-2xl sm:rounded-3xl border border-white/5 bg-black/40 p-4 sm:p-6 text-sm text-zinc-300 focus:border-indigo-500 outline-none transition-all min-h-[150px] resize-none leading-relaxed"
             />
          </div>
        </div>


        {/* Right: Socials */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
          {[
            { key: "instagram", label: "Instagram", Icon: Camera, color: "text-pink-500" },
            { key: "facebook", label: "Facebook", Icon: Users, color: "text-blue-500" },
            { key: "linkedin", label: "LinkedIn", Icon: Award, color: "text-sky-600" },
            { key: "whatsapp", label: "WhatsApp", Icon: Phone, color: "text-emerald-500" },
            { key: "contact", label: "Contact No", Icon: Hash, color: "text-zinc-500" },
          ].map((social) => {
            const Icon = social.Icon;

            return (
              <div key={social.key} className="space-y-3 group/field">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 flex items-center gap-2 group-focus-within/field:text-indigo-400 transition-colors">
                    {Icon && <Icon className={`w-3 h-3 ${social.color}`} />}
                    {social.label}
                 </label>
                 <div className="relative">
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
                    placeholder={`Enter ${social.label}`}
                    className="w-full rounded-xl border border-white/5 bg-black/40 px-5 py-4 text-xs text-white focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-700"
                   />
                 </div>
              </div>
            );
          })}
        </div>


        <div className="lg:col-span-2 flex items-center justify-between pt-6 border-t border-white/5">
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

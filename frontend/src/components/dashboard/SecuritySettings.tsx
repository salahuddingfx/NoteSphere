"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function SecuritySettings() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return showToast("New passwords do not match!", "error");
    }
    
    if (formData.newPassword.length < 6) {
      return showToast("Password must be at least 6 characters.", "error");
    }

    setLoading(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      showToast("Security credentials updated!", "success");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      showToast(err.response?.data?.message || "Verification failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12 rounded-[2.5rem] border border-white/10 bg-zinc-950/50 p-6 sm:p-10 backdrop-blur-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-10 opacity-5">
         <ShieldCheck className="w-40 h-40 text-indigo-500" />
      </div>

      <header className="mb-10 relative z-10">
        <div className="flex items-center gap-3 mb-2">
           <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Lock className="w-4 h-4" />
           </div>
           <h2 className="text-2xl font-black text-white tracking-tighter">Security Vault</h2>
        </div>
        <p className="text-zinc-500">Update your access keys to keep your academic assets secure.</p>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8 relative z-10">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
             Current Access Key
          </label>
          <div className="relative group">
             <input 
               type={showCurrent ? "text" : "password"}
               value={formData.currentPassword}
               onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
               placeholder="••••••••"
               className="w-full rounded-2xl border border-white/5 bg-black/40 px-6 py-5 text-sm text-white focus:border-indigo-500 outline-none transition-all"
             />
             <button 
               type="button"
               onClick={() => setShowCurrent(!showCurrent)}
               className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
             >
               {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
             </button>
          </div>
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
               New Access Key
            </label>
            <div className="relative group">
               <input 
                 type={showNew ? "text" : "password"}
                 value={formData.newPassword}
                 onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                 placeholder="New Password"
                 className="w-full rounded-2xl border border-white/5 bg-black/40 px-6 py-5 text-sm text-white focus:border-indigo-500 outline-none transition-all"
               />
               <button 
                 type="button"
                 onClick={() => setShowNew(!showNew)}
                 className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
               >
                 {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
               </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
               Confirm New Key
            </label>
            <input 
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              placeholder="Repeat Password"
              className="w-full rounded-2xl border border-white/5 bg-black/40 px-6 py-5 text-sm text-white focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="pt-6 flex items-center justify-between border-t border-white/5">
           <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              Nexus Verified Encryption
           </div>
           <button 
             disabled={loading}
             className="rounded-2xl bg-white px-10 py-4 text-sm font-black text-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
           >
             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
             Update Credentials
           </button>
        </div>
      </form>
    </motion.section>
  );
}

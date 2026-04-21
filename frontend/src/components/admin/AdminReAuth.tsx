"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

export default function AdminReAuth({ onVerified }: { onVerified: () => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/verify-admin", { password });
      sessionStorage.setItem("admin_unlocked", "true");
      onVerified();
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid Admin Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-[2.5rem] border border-white/10 bg-zinc-900/50 p-10 backdrop-blur-2xl shadow-2xl"
      >
        <div className="text-center mb-8">
           <div className="h-16 w-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🔐</div>
           <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Secure Admin Entry</h1>
           <p className="text-zinc-500 text-sm mt-2">Please re-verify your identity to access the Nexus control panel.</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Admin Password</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-white focus:border-indigo-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs text-red-400 text-center font-bold">{error}</p>}

          <button 
            disabled={loading}
            className="w-full rounded-2xl bg-white py-4 text-sm font-black text-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Unlock Admin Panel"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

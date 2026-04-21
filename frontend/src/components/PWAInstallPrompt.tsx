"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show after 5 seconds to not overwhelm the user
      const timer = setTimeout(() => {
        const isDismissed = localStorage.getItem("pwa_dismissed");
        if (!isDismissed) setIsVisible(true);
      }, 5000);
      return () => clearTimeout(timer);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("pwa_dismissed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="fixed bottom-10 left-10 z-[110] max-w-sm rounded-[2rem] border border-white/10 bg-zinc-950/90 p-8 backdrop-blur-3xl shadow-2xl"
        >
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 flex-shrink-0 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-600/30">
               N
            </div>
            <div>
              <h4 className="text-white font-bold text-lg tracking-tight">NoteSphere App</h4>
              <p className="text-zinc-500 text-xs mt-1 leading-relaxed">Experience the Nexus directly from your home screen.</p>
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <button
              onClick={handleInstall}
              className="flex-1 rounded-xl bg-white py-3 text-xs font-black uppercase tracking-widest text-black hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Install App
            </button>
            <button
              onClick={handleDismiss}
              className="rounded-xl border border-white/10 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            >
              Skip
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

  );
}

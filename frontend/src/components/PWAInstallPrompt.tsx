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
      setIsVisible(true);
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border border-white/10 bg-zinc-900/90 p-5 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold text-xl">
              N
            </div>
            <div>
              <h4 className="text-white font-semibold">Install NoteSphere</h4>
              <p className="text-zinc-400 text-sm">Add to home screen for a premium experience.</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 rounded-lg bg-white py-2 text-sm font-bold text-black hover:bg-zinc-200 transition-colors"
            >
              Install App
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Later
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

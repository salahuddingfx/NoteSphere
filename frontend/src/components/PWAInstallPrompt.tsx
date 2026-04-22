"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if already running as a PWA
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) return;

    const handler = (e: any) => {
      // Check if user has already dismissed the prompt in this session/browser
      const isDismissed = localStorage.getItem("pwa_dismissed");
      if (isDismissed) return;

      // Prevent the default browser install prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);

      // Clear any existing timer to avoid multiple prompts
      if (timerRef.current) clearTimeout(timerRef.current);

      // Show our custom prompt after a delay to not interrupt the user immediately
      timerRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 8000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // If the app is installed, hide our prompt
    const installedHandler = () => {
      setDeferredPrompt(null);
      setIsVisible(false);
    };
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the browser's install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Persist dismissal so we don't annoy the user again
    localStorage.setItem("pwa_dismissed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && deferredPrompt && (
        <motion.div
          initial={{ opacity: 0, x: -50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.9 }}
          className="fixed bottom-10 left-6 sm:left-10 z-[110] max-w-[calc(100vw-48px)] sm:max-w-sm rounded-[2.5rem] border border-white/10 bg-zinc-950/90 p-8 backdrop-blur-3xl shadow-2xl"
        >
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 flex-shrink-0 rounded-[1.25rem] bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-600/30">
               N
            </div>
            <div>
              <h4 className="text-white font-bold text-lg tracking-tight">NoteSphere App</h4>
              <p className="text-zinc-500 text-xs mt-1 leading-relaxed">Experience the Nexus directly from your home screen for faster access.</p>
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <button
              onClick={handleInstall}
              className="flex-1 rounded-2xl bg-white py-4 text-xs font-black uppercase tracking-widest text-black hover:bg-indigo-50 hover:text-white transition-all active:scale-95"
            >
              Install App
            </button>
            <button
              onClick={handleDismiss}
              className="rounded-2xl border border-white/10 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Skip
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

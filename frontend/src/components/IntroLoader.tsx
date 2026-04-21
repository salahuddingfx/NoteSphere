"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function IntroLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
        >
          <div className="relative flex flex-col items-center">
             <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-24 w-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-[2px] shadow-[0_0_50px_rgba(79,70,229,0.4)]"
             >
                <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-black">
                   <span className="text-4xl font-black text-white">N</span>
                </div>
             </motion.div>
             
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5, duration: 0.8 }}
               className="mt-8 text-center"
             >
                <h1 className="text-xl font-bold tracking-[0.4em] text-white uppercase">NoteSphere</h1>
                <div className="mt-4 h-[2px] w-48 overflow-hidden rounded-full bg-white/5 mx-auto">
                   <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="h-full w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                   />
                </div>
                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Syncing Academic Vault...</p>
             </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

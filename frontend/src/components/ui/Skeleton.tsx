"use client";

import { motion } from "framer-motion";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-white/5 ${className}`}>
      <motion.div
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
      />
    </div>
  );
}

export function NoteSkeleton() {
  return (
    <div className="rounded-[2.5rem] border border-white/5 bg-white/5 p-2 backdrop-blur-xl">
      <Skeleton className="aspect-[4/3] rounded-[2rem]" />
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2 flex-1">
             <Skeleton className="h-3 w-1/3 rounded" />
             <Skeleton className="h-2 w-1/2 rounded" />
          </div>
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

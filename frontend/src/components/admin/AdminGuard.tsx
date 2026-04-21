"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { motion } from "framer-motion";
import AdminReAuth from "./AdminReAuth";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, hydrated, fetchCurrentUser } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (!hydrated) {
        await fetchCurrentUser();
      }

      if (!isAuthenticated || user?.role !== "admin") {
        router.push("/");
      } else {
        const unlocked = sessionStorage.getItem("admin_unlocked") === "true";
        setIsUnlocked(unlocked);
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, user, router, hydrated, fetchCurrentUser]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="h-12 w-12 mx-auto rounded-full border-2 border-indigo-500 border-t-transparent"
          />
          <p className="mt-4 text-zinc-400 font-bold tracking-widest uppercase text-xs">Accessing Nexus...</p>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return <AdminReAuth onVerified={() => setIsUnlocked(true)} />;
  }

  return <>{children}</>;
}

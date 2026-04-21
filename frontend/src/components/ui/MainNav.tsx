"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/notes", label: "All Notes" },
  { href: "/upload", label: "Upload" },
  { href: "/requests", label: "Requests" },
  { href: "/saved", label: "Saved" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/developer", label: "Developer" },
];

export default function MainNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 mx-auto mb-12 w-full max-w-6xl px-4">
      <nav className="flex items-center justify-between rounded-3xl border border-white/10 bg-black/60 px-6 py-4 backdrop-blur-2xl shadow-2xl">
        <Link href="/" className="text-xl font-black tracking-tighter text-white">
          NoteSphere<span className="text-indigo-500">.</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                  active
                    ? "bg-white text-black shadow-lg"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white xl:hidden"
        >
          {isOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute left-4 right-4 top-24 z-40 rounded-3xl border border-white/10 bg-black/90 p-6 backdrop-blur-2xl xl:hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-[0.2em] transition-all ${
                    pathname === item.href
                      ? "bg-indigo-500 text-white"
                      : "text-zinc-500 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="mt-4 rounded-2xl bg-white px-6 py-4 text-center text-sm font-black uppercase tracking-[0.2em] text-black"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

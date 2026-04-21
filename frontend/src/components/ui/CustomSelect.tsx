"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}

export default function CustomSelect({ label, options, value, onChange }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-4 relative" ref={containerRef}>
      <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white flex justify-between items-center cursor-pointer hover:border-indigo-500 transition-colors"
      >
        <span>{value || `Select ${label}`}</span>
        <svg 
          className={`w-5 h-5 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 left-0 right-0 top-full mt-2 rounded-2xl border border-white/10 bg-zinc-900 p-2 shadow-2xl backdrop-blur-xl max-h-60 overflow-y-auto"
          >
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`rounded-xl px-4 py-3 text-sm cursor-pointer transition-colors ${
                  value === opt ? "bg-indigo-500 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {opt}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

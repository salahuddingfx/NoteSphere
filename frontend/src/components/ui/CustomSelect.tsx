"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function CustomSelect({ options, value, onChange, placeholder = "Select option", label }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

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
    <div className="relative" ref={containerRef}>
      {label && <label className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2 block">{label}</label>}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white flex items-center justify-between hover:border-white/10 transition-all outline-none focus:border-indigo-500"
      >
        <span className={selectedOption ? "text-white text-sm font-bold" : "text-zinc-500 text-sm font-bold"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-[110] left-0 right-0 mt-3 p-2 rounded-2xl bg-zinc-950 border border-white/10 shadow-2xl backdrop-blur-3xl overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
               {options.length > 0 ? options.map((option) => (
                 <button
                   key={option.value}
                   type="button"
                   onClick={() => {
                     onChange(option.value);
                     setIsOpen(false);
                   }}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-xl text-xs font-bold tracking-wide transition-all ${
                      value === option.value 
                       ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                       : 'text-zinc-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-4">{option.label}</span>
                    {value === option.value && <Check className="w-3 h-3 flex-shrink-0" />}
                  </button>
               )) : (
                 <p className="px-4 py-3 text-[10px] text-zinc-600 font-black uppercase tracking-widest text-center">No options available</p>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

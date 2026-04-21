"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useEffect, useState, createContext, useContext } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-10 right-10 z-[200] flex flex-col gap-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`flex items-center gap-4 min-w-[320px] p-5 rounded-2xl border backdrop-blur-2xl shadow-2xl ${
                toast.type === "success" 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : toast.type === "error"
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
              }`}
            >
              <div className="shrink-0">
                {toast.type === "success" && <CheckCircle className="w-6 h-6" />}
                {toast.type === "error" && <XCircle className="w-6 h-6" />}
                {toast.type === "info" && <Info className="w-6 h-6" />}
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-bold tracking-tight">{toast.message}</p>
              </div>

              <button 
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 opacity-50 hover:opacity-100" />
              </button>

              {/* Progress bar */}
              <motion.div 
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-1 rounded-full ${
                    toast.type === "success" ? "bg-emerald-500" : toast.type === "error" ? "bg-red-500" : "bg-indigo-500"
                } opacity-20`}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

"use client";

import { useState, useEffect } from "react";
import { Bell, Heart, MessageSquare, Award, Zap, Trash2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";

export default function NotificationBell() {
  const { isAuthenticated } = useAuthStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data.notifications);
      setUnreadCount(data.notifications.filter((n: any) => !n.isRead).length);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000); // Polling every 1 minute
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/read");
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Mark as read failed", err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "like": return <Heart className="w-3 h-3 text-rose-500" />;
      case "comment": return <MessageSquare className="w-3 h-3 text-indigo-400" />;
      case "badge": return <Award className="w-3 h-3 text-amber-400" />;
      default: return <Zap className="w-3 h-3 text-cyan-400" />;
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) markAllRead(); }}
        className="relative p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
      >
        <Bell className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-indigo-500 border-2 border-black" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-80 rounded-[2rem] border border-white/10 bg-zinc-950/90 p-2 backdrop-blur-3xl shadow-2xl z-50 overflow-hidden"
            >
               <header className="p-4 border-b border-white/5 flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nexus Alerts</p>
                  <button onClick={markAllRead} className="text-[9px] font-bold text-indigo-400 hover:text-white uppercase tracking-widest">Mark all read</button>
               </header>

               <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? notifications.map((n) => (
                    <Link 
                      key={n._id} 
                      href={n.note ? `/notes/${n.note.slug}` : "/dashboard"}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-start gap-4 p-4 rounded-[1.5rem] transition-all hover:bg-white/5 ${!n.isRead ? 'bg-white/[0.02]' : ''}`}
                    >
                       <div className="relative shrink-0">
                          <img src={n.sender.avatar} className="h-10 w-10 rounded-xl object-cover" />
                          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-lg bg-black border border-white/10 flex items-center justify-center">
                             {getIcon(n.type)}
                          </div>
                       </div>
                       <div className="flex-1 space-y-1">
                          <p className="text-xs text-white leading-snug">{n.message}</p>
                          <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{new Date(n.createdAt).toLocaleDateString()}</p>
                       </div>
                    </Link>
                  )) : (
                    <div className="py-10 text-center">
                       <Zap className="w-8 h-8 text-zinc-800 mx-auto mb-2" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">No active alerts</p>
                    </div>
                  )}
               </div>

               <footer className="p-4 border-t border-white/5 text-center">
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white">View All History</Link>
               </footer>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

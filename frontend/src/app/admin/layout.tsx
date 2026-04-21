"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, FileCheck, Settings, ShieldAlert, ChevronRight, HelpCircle } from "lucide-react";

const sidebarItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Students", icon: Users },
  { href: "/admin/moderation", label: "Moderation", icon: FileCheck },
  { href: "/admin/quizzes", label: "Security Quizzes", icon: HelpCircle },
  { href: "/admin/settings", label: "System settings", icon: Settings },
];


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-black overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-80 border-r border-white/5 bg-zinc-950 p-8 hidden lg:block">
        <div className="mb-12">
          <Link href="/" className="text-2xl font-black tracking-tighter text-white">
            NoteSphere<span className="text-indigo-500">.</span>
            <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-zinc-600">Admin</span>
          </Link>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest transition-all ${
                  active
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20"
                    : "text-zinc-500 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
                {active && <ChevronRight className="w-3 h-3" />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-12">
           <div className="rounded-3xl bg-indigo-500/5 border border-indigo-500/10 p-6">
              <ShieldAlert className="w-8 h-8 text-indigo-400 mb-4" />
              <p className="text-xs font-bold text-white uppercase tracking-widest">Security Core</p>
              <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">All administrative actions are logged and verified via JWT.</p>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-12">
         <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4 }}
         >
           {children}
         </motion.div>
      </main>
    </div>
  );
}

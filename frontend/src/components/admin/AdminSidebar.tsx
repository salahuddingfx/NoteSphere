"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/admin", icon: "📊" },
  { label: "Users", href: "/admin/users", icon: "👥" },
  { label: "Notes", href: "/admin/notes", icon: "📝" },
  { label: "Developer", href: "/admin/developer", icon: "👨‍💻" },
  { label: "System", href: "/admin/system", icon: "⚙️" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/5 bg-zinc-950/50 min-h-screen p-6">
      <div className="mb-10">
        <h2 className="text-xl font-black text-white tracking-tighter">Nexus Control</h2>
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold mt-1">Management Engine</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              pathname === item.href 
              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
              : "text-zinc-500 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span>{item.icon}</span>
            <span className="text-sm font-bold">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

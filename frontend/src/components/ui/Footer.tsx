"use client";

import Link from "next/link";

const footerLinks = [
  { 
    title: "Platform", 
    links: [
      { label: "Vault", href: "/notes" },
      { label: "Leaderboard", href: "/leaderboard" },
      { label: "Contribution", href: "/upload" },
    ] 
  },
  { 
    title: "Company", 
    links: [
      { label: "About Us", href: "/about" },
      { label: "Developer", href: "/developer" },
      { label: "Terms", href: "#" },
    ] 
  },
  { 
    title: "Support", 
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Report Issue", href: "/report" },
      { label: "Community", href: "/community" },
    ] 
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 bg-black px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="space-y-6">
            <Link href="/" className="text-2xl font-black tracking-tighter text-white">
              NoteSphere<span className="text-indigo-500">.</span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-500">
              The world's most advanced academic sharing ecosystem. Built for students, by students.
            </p>
            <div className="flex gap-4">
               <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer">X</div>
               <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer">G</div>
               <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer">L</div>
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-zinc-500 transition hover:text-indigo-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">
            © 2026 NoteSphere Ecosystem. All Rights Reserved.
          </p>
          <div className="flex gap-8">
             <p className="text-xs font-black text-zinc-700">POWERED BY NEXTORA ENGINE</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

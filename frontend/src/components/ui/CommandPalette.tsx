import { 
  KBarProvider, 
  KBarPortal, 
  KBarPositioner, 
  KBarAnimator, 
  KBarSearch, 
  KBarResults,
  useMatches,
  ActionImpl
} from "kbar";
import { useRouter } from "next/navigation";
import { 
  Home, 
  Search, 
  Upload, 
  LayoutDashboard, 
  LogOut, 
  Zap
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

export default function CommandPalette({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { logout, isAuthenticated } = useAuthStore();

  const actions = [
    {
      id: "home",
      name: "Home",
      shortcut: ["h"],
      keywords: "back home main index",
      perform: () => router.push("/"),
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: "explore",
      name: "Explore Vault",
      shortcut: ["e"],
      keywords: "search notes find assets vault",
      perform: () => router.push("/notes"),
      icon: <Search className="w-5 h-5" />,
    },
    {
      id: "upload",
      name: "Upload Note",
      shortcut: ["u"],
      keywords: "add asset upload share",
      perform: () => router.push("/upload"),
      icon: <Upload className="w-5 h-5" />,
    },
    {
      id: "dashboard",
      name: "User Dashboard",
      shortcut: ["d"],
      keywords: "profile account stats history",
      perform: () => router.push("/dashboard"),
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
  ];

  if (isAuthenticated) {
    actions.push({
      id: "logout",
      name: "Logout",
      shortcut: ["l"],
      keywords: "signout exit leave",
      perform: () => {
        logout();
        router.push("/");
      },
      icon: <LogOut className="w-5 h-5" />,
    });
  }

  return (
    <KBarProvider actions={actions}>
      <KBarPortal>
        <KBarPositioner className="z-[9999] bg-black/80 backdrop-blur-sm px-4">
          <KBarAnimator className="w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-950 shadow-2xl">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
              <Zap className="w-5 h-5 text-indigo-400" />
              <KBarSearch className="w-full bg-transparent text-white outline-none placeholder:text-zinc-600 text-sm font-bold uppercase tracking-widest" />
              <div className="flex items-center gap-1">
                 <kbd className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-zinc-500 font-black">ESC</kbd>
              </div>
            </div>
            
            <KBarResults
              items={useMatches().results}
              onRender={({ item, active }) =>
                typeof item === "string" ? (
                  <div className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
                    {item}
                  </div>
                ) : (
                  <div 
                    className={`px-6 py-4 flex items-center justify-between cursor-pointer transition-all ${
                      active ? 'bg-indigo-600/10 border-l-4 border-indigo-500 text-white' : 'text-zinc-400 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`${active ? 'text-indigo-400' : 'text-zinc-500'}`}>
                        {item.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight">{item.name}</span>
                        {item.subtitle && <span className="text-[10px] opacity-60 uppercase tracking-widest font-black">{item.subtitle}</span>}
                      </div>
                    </div>
                    {item.shortcut?.length ? (
                      <div className="flex items-center gap-1">
                        {item.shortcut.map((sc) => (
                          <kbd key={sc} className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-zinc-500 font-black uppercase">
                            {sc}
                          </kbd>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )
              }
            />

            <div className="px-6 py-4 border-t border-white/5 bg-white/[0.02]">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">
                  Nexus Command Interface v1.0 • Use arrows to navigate
                </p>
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
}


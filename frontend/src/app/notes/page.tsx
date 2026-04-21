"use client";

import { useState, useEffect } from "react";
import MainNav from "@/components/ui/MainNav";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { NoteSkeleton } from "@/components/ui/Skeleton";
import CustomSelect from "@/components/ui/CustomSelect";

interface Note {
  _id: string;
  title: string;
  slug: string;
  description: string;
  fileType: string;
  department: string;
  semester: string;
  subject: string;
  subjectCode?: string;
  teacher?: string;
  downloads: number;
  isVerified: boolean;
  author: {
    name: string;
    avatar: string;
    department: string;
    semester: string;
  };
  createdAt: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [semester, setSemester] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (department !== "All") params.append("department", department);
      if (semester !== "All") params.append("semester", semester);
      params.append("sort", sortBy);

      const { data } = await api.get(`/notes?${params.toString()}`);
      setNotes(data.notes);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchNotes, 500);
    return () => clearTimeout(timer);
  }, [search, department, semester, sortBy]);

  const getNoteColor = (idx: number) => {
    const colors = [
      "from-blue-500 to-indigo-500",
      "from-purple-500 to-pink-500",
      "from-cyan-500 to-blue-500",
      "from-emerald-500 to-teal-500",
      "from-orange-500 to-rose-500",
    ];
    return colors[idx % colors.length];
  };

  return (
    <main className="min-h-screen bg-black px-4 py-12 sm:px-6 lg:px-10">
      <MainNav />
      <section className="mx-auto w-full max-w-6xl mt-12">
        <header className="mb-12">
           <p className="text-xs uppercase tracking-[0.4em] text-indigo-400 font-bold mb-4">Central Repository</p>
           <h1 className="text-5xl font-bold text-white tracking-tight">The Verified Vault</h1>
           <p className="mt-4 text-zinc-500 text-lg max-w-2xl">Access premium academic resources verified by top students and moderators.</p>
        </header>

        {/* Search & Filters */}
        <div className="mb-12 grid gap-6 md:grid-cols-4 items-end bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
          <div className="md:col-span-2 space-y-4">
            <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Search Notes</label>
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, subject, code or teacher..." 
              className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <CustomSelect 
            label="Department" 
            options={["All", "CSE", "EEE", "BBA", "Textile"]} 
            value={department} 
            onChange={setDepartment} 
          />
          <CustomSelect 
            label="Sort By" 
            options={["latest", "trending", "verified"]} 
            value={sortBy} 
            onChange={setSortBy} 
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading 
            ? Array(6).fill(0).map((_, i) => <NoteSkeleton key={i} />)
            : notes.length > 0 ? notes.map((note, idx) => (
            <motion.article 
              key={note._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative rounded-[2.5rem] border border-white/5 bg-white/5 p-2 backdrop-blur-xl hover:border-white/10 transition-all overflow-hidden"
            >
              <div className={`aspect-[4/3] rounded-[2rem] bg-gradient-to-br ${getNoteColor(idx)} p-8 flex flex-col justify-between relative overflow-hidden`}>
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                 <div className="relative z-10 flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-[10px] font-black uppercase tracking-widest text-white">{note.fileType}</span>
                    {note.isVerified && (
                      <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-xl">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                      </div>
                    )}
                 </div>
                 <div className="relative z-10">
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">{note.subjectCode || note.subject}</p>
                    <h3 className="text-2xl font-bold text-white mt-1 leading-tight group-hover:translate-x-1 transition-transform">{note.title}</h3>
                 </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={note.author.avatar} alt={note.author.name} className="h-8 w-8 rounded-full border border-white/10 object-cover" />
                    <div className="space-y-1">
                      <p className="text-white text-xs font-bold">{note.author.name}</p>
                      <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">{note.department} • {note.semester}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold text-zinc-500 uppercase">{note.downloads}</span>
                     <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:text-black transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                     </div>
                  </div>
                </div>
              </div>
            </motion.article>
          )) : (
            <div className="col-span-full py-20 text-center">
               <p className="text-zinc-500 font-bold uppercase tracking-widest">No assets found in the vault.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

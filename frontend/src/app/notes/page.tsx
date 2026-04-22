"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { NoteSkeleton } from "@/components/ui/Skeleton";
import CustomSelect from "@/components/ui/CustomSelect";
import Link from "next/link";
import { Search, Zap, FileText, ShieldCheck, User, ChevronRight, Eye, Download } from "lucide-react";

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
  views: number;
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
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (department !== "All") params.append("department", department);
      if (semester !== "All") params.append("semester", semester);
      if (category !== "All") params.append("category", category);
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
    const debounce = setTimeout(() => {
      fetchNotes();
    }, 500);
    return () => clearTimeout(debounce);
  }, [search, department, semester, category, sortBy]);

  const getNoteColor = (idx: number) => {
    const colors = ["from-indigo-600 to-indigo-900", "from-cyan-600 to-cyan-900", "from-emerald-600 to-emerald-900", "from-amber-600 to-amber-900"];
    return colors[idx % colors.length];
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20">
      <section className="mx-auto w-full max-w-6xl mt-12">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
           <div>
             <p className="text-xs uppercase tracking-[0.4em] text-indigo-400 font-bold mb-4">Central Repository</p>
             <h1 className="text-5xl font-bold text-white tracking-tight">The Verified Vault</h1>
             <p className="mt-4 text-zinc-500 text-lg max-w-2xl">Access premium academic resources verified by top students and moderators.</p>
           </div>
           <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Total Assets</p>
              <p className="text-xl font-black text-white">{notes.length}</p>
           </div>
        </header>

        {/* Search & Filters */}
        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-6 items-end bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl relative">
          <div className="absolute top-0 right-0 p-10 opacity-5 -z-10 pointer-events-none">
             <Search className="w-32 h-32 text-white" />
          </div>
          <div className="md:col-span-2 lg:col-span-2 space-y-4">
            <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Search className="w-3 h-3 text-indigo-400" />
              Search Notes
            </label>
            <div className="relative group">
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, subject..." 
                className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white focus:border-indigo-500 outline-none transition-all pr-12"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-400 transition-colors">
                 <Zap className="w-5 h-5 fill-current" />
              </div>
            </div>
          </div>
          <CustomSelect 
            label="Department" 
            options={["All", "CSE", "EEE", "BBA", "Textile", "Civil", "Pharmacy"].map(o => ({ value: o, label: o }))} 
            value={department} 
            onChange={setDepartment} 
          />
          <CustomSelect 
            label="Semester" 
            options={["All", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map(o => ({ value: o, label: o }))} 
            value={semester} 
            onChange={setSemester} 
          />
          <CustomSelect 
            label="Category" 
            options={["All", "Hand-written", "Digital", "Exam Paper", "Assignment", "Lab Report"].map(o => ({ value: o, label: o }))} 
            value={category} 
            onChange={setCategory} 
          />
          <CustomSelect 
            label="Sort By" 
            options={[
              { value: "latest", label: "Latest" },
              { value: "trending", label: "Trending" },
              { value: "verified", label: "Verified" }
            ]} 
            value={sortBy} 
            onChange={setSortBy} 
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading 
            ? Array(6).fill(0).map((_, i) => <NoteSkeleton key={i} />)
            : notes.length > 0 ? notes.map((note, idx) => (
            <Link href={`/notes/${note.slug}`} key={note._id}>
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative rounded-[2.5rem] border border-white/5 bg-white/5 p-2 backdrop-blur-xl hover:border-white/10 transition-all overflow-hidden h-full"
              >
                <div className={`aspect-[4/3] rounded-[2rem] bg-gradient-to-br ${getNoteColor(idx)} p-8 flex flex-col justify-between relative overflow-hidden`}>
                  {note.fileType === "image" && (
                    <img 
                      src={note.fileUrl} 
                      className="absolute inset-0 h-full w-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700" 
                      alt="Preview"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="relative z-10 flex justify-between items-start">

                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-[10px] font-black uppercase tracking-widest text-white">
                         <FileText className="w-3 h-3" />
                         {note.fileType}
                      </div>
                      {note.isVerified && (
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-xl"
                        >
                          <ShieldCheck className="w-5 h-5" />
                        </motion.div>
                      )}
                  </div>

                  <div className="relative z-10">
                      <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                        {note.subjectCode ? `${note.subjectCode} • ` : ""}{note.subject}
                      </p>
                      <h3 className="text-2xl font-bold text-white mt-1 leading-tight group-hover:translate-x-1 transition-transform">{note.title}</h3>
                      {note.teacher && (
                        <p className="text-white/40 text-[10px] font-bold mt-2 italic">Ref: Prof. {note.teacher}</p>
                      )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={note.author.avatar} alt={note.author.name} className="h-8 w-8 rounded-full border border-white/10 object-cover" />
                      <div className="space-y-1">
                        <p className="text-white text-xs font-bold">{note.author.name}</p>
                        <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">{note.department} • {note.semester} Sem</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-3 h-3 text-zinc-500" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">{note.views || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Download className="w-3 h-3 text-zinc-500" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">{note.downloads}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            </Link>
          )) : (
            <div className="col-span-full py-20 text-center">
               <p className="text-zinc-500 font-bold uppercase tracking-widest">No assets found in the vault.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

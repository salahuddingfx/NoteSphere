"use client";

import { useState } from "react";
import Image from "next/image";
import MainNav from "@/components/ui/MainNav";
import ImageCropper from "@/components/upload/ImageCropper";
import CustomSelect from "@/components/ui/CustomSelect";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

export default function UploadPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [noteFiles, setNoteFiles] = useState<File[]>([]);
  const [isCropping, setIsCropping] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("CSE");
  const [semester, setSemester] = useState("Semester 1");
  const [subject, setSubject] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [teacher, setTeacher] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleNoteFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNoteFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    if (!title || !subject || !description || noteFiles.length === 0) {
      showToast("Please fill all required fields (Title, Subject, Description) and upload the note asset.", "error");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("department", department);
      formData.append("semester", semester);
      formData.append("subject", subject);
      formData.append("subjectCode", subjectCode);
      formData.append("teacher", teacher);
      
      // Append all note files
      noteFiles.forEach(file => {
        formData.append("file", file);
      });

      // Append cover image if exists
      if (croppedImage) {
        // Convert base64 to blob
        const res = await fetch(croppedImage);
        const blob = await res.blob();
        formData.append("cover", blob, "cover.jpg");
      }

      await api.post("/notes", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      router.push("/notes");
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black px-4 py-12 sm:px-6 lg:px-10">
      <MainNav />
      
      <section className="mx-auto w-full max-w-4xl mt-12">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
               <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-400 font-bold">Contribution Hub</p>
          </motion.div>
          <h1 className="text-5xl font-bold text-white mt-2 tracking-tight">Publish your notes.</h1>
          <p className="text-zinc-500 mt-4 text-lg">Your knowledge helps others grow. Ensure your notes are clear and well-titled.</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                Note Title <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Organic Chemistry - Semester 3" 
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                  Subject Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Data Structures" 
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Subject Code</label>
                <input 
                  type="text" 
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  placeholder="e.g. CSE-2101" 
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Course Instructor (Optional)</label>
              <input 
                type="text" 
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                placeholder="e.g. Dr. Jane Smith" 
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomSelect 
                label="Department" 
                options={["CSE", "EEE", "BBA", "Textile", "Civil", "Mechanical", "Architecture", "Pharmacy"].map(opt => ({ value: opt, label: opt }))} 
                value={department} 
                onChange={setDepartment} 
              />
              <CustomSelect 
                label="Semester" 
                options={["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"].map(opt => ({ value: opt, label: opt }))} 
                value={semester} 
                onChange={setSemester} 
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea 
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What covers these notes?" 
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
             <div className="space-y-4">
               <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                 Note Asset (PDF/DOC) <span className="text-red-500">*</span>
               </label>
               <div className="aspect-video rounded-3xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center p-6 text-center group hover:border-indigo-500 transition-colors cursor-pointer relative overflow-hidden">
                  {noteFiles.length > 0 ? (
                    <div className="flex flex-col items-center">
                       <FileText className="w-10 h-10 text-indigo-400 mb-2" />
                       <p className="text-white font-bold truncate max-w-[200px]">
                         {noteFiles.length === 1 ? noteFiles[0].name : `${noteFiles.length} files selected`}
                       </p>
                       <p className="text-[10px] text-zinc-500 uppercase mt-1">
                         {(noteFiles.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(2)} MB total
                       </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-zinc-500 group-hover:text-indigo-400 mb-4 transition-colors" />
                      <p className="text-zinc-200 font-bold">Select PDF/Images</p>
                      <p className="text-xs text-zinc-500 mt-2">Up to 50MB supported</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx,image/*" 
                    multiple
                    onChange={handleNoteFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
               </div>
             </div>

             <div className="space-y-4">
               <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Note Cover (Optional)</label>
               <div className="aspect-[3/4] rounded-3xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center p-6 text-center group hover:border-indigo-500 transition-colors cursor-pointer relative overflow-hidden">
                  {croppedImage ? (
                    <Image 
                      src={croppedImage} 
                      alt="Preview" 
                      fill
                      className="absolute inset-0 w-full h-full object-cover" 
                      unoptimized
                    />
                  ) : (
                    <>
                      <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                        <ImageIcon className="w-6 h-6 text-zinc-400 group-hover:text-indigo-400" />
                      </div>
                      <p className="text-zinc-200 font-bold">Select Cover</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
               </div>
             </div>
          </div>
        </div>

        <div className="mt-12 flex justify-end">
           <button 
            disabled={loading}
            onClick={handleSubmit}
            className="group px-12 py-4 rounded-2xl bg-white text-black font-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-3 disabled:opacity-50 disabled:scale-100"
           >
             {loading ? (
               <Loader2 className="w-5 h-5 animate-spin" />
             ) : (
               <CheckCircle className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
             )}
             {loading ? "Publishing..." : "Submit to Vault"}
           </button>
        </div>
      </section>


      <AnimatePresence>
        {isCropping && selectedFile && (
          <ImageCropper 
            image={selectedFile!} 
            onCropComplete={(img) => {
              setCroppedImage(img);
              setIsCropping(false);
            }} 
            onCancel={() => setIsCropping(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

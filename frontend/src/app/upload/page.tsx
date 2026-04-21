"use client";

import { useState } from "react";
import MainNav from "@/components/ui/MainNav";
import ImageCropper from "@/components/upload/ImageCropper";
import CustomSelect from "@/components/ui/CustomSelect";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [department, setDepartment] = useState("CSE");
  const [semester, setSemester] = useState("Semester 1");
  const [subject, setSubject] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [teacher, setTeacher] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <main className="min-h-screen bg-black px-4 py-12 sm:px-6 lg:px-10">
      <MainNav />
      
      <section className="mx-auto w-full max-w-4xl mt-12">
        <header className="mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-400 font-bold">Contribution Hub</p>
          <h1 className="text-5xl font-bold text-white mt-2">Publish your notes.</h1>
          <p className="text-zinc-500 mt-4 text-lg">Your knowledge helps others grow. Ensure your notes are clear and well-titled.</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Note Title</label>
              <input 
                type="text" 
                placeholder="e.g. Organic Chemistry - Semester 3" 
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Subject Name</label>
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
                options={["CSE", "EEE", "BBA", "Textile"]} 
                value={department} 
                onChange={setDepartment} 
              />
              <CustomSelect 
                label="Semester" 
                options={["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"]} 
                value={semester} 
                onChange={setSemester} 
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Description</label>
              <textarea 
                rows={4}
                placeholder="What covers these notes?" 
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
             <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Note Cover</label>
             <div className="aspect-[3/4] rounded-3xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center p-6 text-center group hover:border-indigo-500 transition-colors cursor-pointer relative overflow-hidden">
                {croppedImage ? (
                  <img src={croppedImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                      <svg className="w-6 h-6 text-zinc-400 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <p className="text-zinc-200 font-bold">Select Cover Image</p>
                    <p className="text-xs text-zinc-500 mt-2">JPG, PNG up to 5MB</p>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
             </div>
             {croppedImage && (
               <button 
                onClick={() => setIsCropping(true)}
                className="w-full py-3 rounded-xl border border-white/10 text-zinc-400 font-bold hover:text-white transition-colors"
               >
                 Re-edit Image
               </button>
             )}
          </div>
        </div>

        <div className="mt-12 flex justify-end">
           <button className="px-12 py-4 rounded-2xl bg-white text-black font-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]">
             Submit to Vault
           </button>
        </div>
      </section>

      <AnimatePresence>
        {isCropping && selectedFile && (
          <ImageCropper 
            image={selectedFile} 
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

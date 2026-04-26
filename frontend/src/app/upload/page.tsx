"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import MainNav from "@/components/ui/MainNav";
import ImageCropper from "@/components/upload/ImageCropper";
import CustomSelect from "@/components/ui/CustomSelect";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Sparkles, Image as ImageIcon, X, Wand2, Camera, Share2, Volume2, VolumeX, Lock, Globe, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import imageCompression from "browser-image-compression";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { QRCodeSVG } from "qrcode.react";
import { Copy, ExternalLink, QrCode } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [noteFiles, setNoteFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ url: string; name: string; type: string }[]>([]);
  const [isCropping, setIsCropping] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("CSE");
  const [semester, setSemester] = useState("Semester 1");
  const [subject, setSubject] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [teacher, setTeacher] = useState("");
  const [category, setCategory] = useState("Hand-written");
  const [tagList, setTagList] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [showXP, setShowXP] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadedNote, setUploadedNote] = useState<any>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 1000);
    
    // Load draft
    const draft = localStorage.getItem("note_upload_draft");
    if (draft) {
      try {
        const data = JSON.parse(draft);
        setTitle(data.title || "");
        setSubject(data.subject || "");
        setSubjectCode(data.subjectCode || "");
        setTeacher(data.teacher || "");
        setDescription(data.description || "");
        setDepartment(data.department || "CSE");
        setSemester(data.semester || "Semester 1");
        setCategory(data.category || "Hand-written");
        setTagList(data.tagList || []);
      } catch (e) {
        console.error("Draft load failed", e);
      }
    }
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!pageLoading) {
      const draftData = { title, subject, subjectCode, teacher, description, department, semester, category, tagList };
      localStorage.setItem("note_upload_draft", JSON.stringify(draftData));
    }
  }, [title, subject, subjectCode, teacher, description, department, semester, category, tagList, pageLoading]);

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

  const addWatermark = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = new (window as any).Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
          ctx.font = `${Math.round(img.width / 25)}px sans-serif`;
          ctx.textAlign = "right";
          ctx.fillText("NoteSphere", img.width - 40, img.height - 40);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            } else {
              resolve(file);
            }
          }, "image/jpeg", 0.9);
        } else {
          resolve(file);
        }
      };
    });
  };

  const handleNoteFiles = async (files: File[]) => {
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
    const processedFiles: File[] = [];

    setCompressing(true);
    try {
      for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
          showToast(`File ${file.name} is too large. Max 20MB allowed.`, "error");
          continue;
        }

        if (file.type.startsWith("image/")) {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          };
          const compressedFile = await imageCompression(file, options);
          const watermarkedFile = await addWatermark(compressedFile);
          processedFiles.push(watermarkedFile);
        } else {
          processedFiles.push(file);
        }
      }

      setNoteFiles((prev) => [...prev, ...processedFiles]);
      
      const newPreviews = processedFiles.map(file => ({
        url: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
        name: file.name,
        type: file.type
      }));
      setPreviews((prev) => [...prev, ...newPreviews]);
    } catch (err) {
      console.error("Processing error:", err);
      showToast("Error processing files. Please try again.", "error");
    } finally {
      setCompressing(false);
    }
  };

  const handleNoteFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await handleNoteFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      await handleNoteFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeFile = (index: number) => {
    setNoteFiles((prev) => prev.filter((_, i) => i !== index));
    if (previews[index].url) {
      URL.revokeObjectURL(previews[index].url);
    }
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(/,/g, "");
      if (val && !tagList.includes(val)) {
        setTagList((prev) => [...prev, val]);
        setTagInput("");
      }
    } else if (e.key === "Backspace" && !tagInput && tagList.length > 0) {
      setTagList((prev) => prev.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTagList((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const SUBJECT_MAP: Record<string, string> = {
    "CSE-1101": "Structured Programming Language",
    "CSE-1201": "Object Oriented Programming",
    "CSE-2101": "Data Structures",
    "CSE-2201": "Algorithms",
    "CSE-3101": "Operating Systems",
    "CSE-3201": "Database Management Systems",
    "EEE-1101": "Electrical Circuits",
    "MAT-1101": "Calculus and Differential Equations"
  };

  const handleSubjectCodeChange = (code: string) => {
    const upperCode = code.toUpperCase();
    setSubjectCode(upperCode);
    if (SUBJECT_MAP[upperCode]) {
      setSubject(SUBJECT_MAP[upperCode]);
    }
  };
  const handleAiSuggest = async () => {
    if (!title && !subject) {
      showToast("Add a title or subject first to use AI magic!", "error");
      return;
    }
    setSuggesting(true);
    try {
      const res = await api.post("/notes/suggest-metadata", { title, subject, subjectCode, teacher });
      if (res.data.success) {
        setDescription(res.data.suggestions.description);
        setTagList(res.data.suggestions.tags);
        showToast("AI Magic applied! Check description and tags.", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("AI Magic failed. Try again later.", "error");
    } finally {
      setSuggesting(false);
    }
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    if (!description) return;
    const utterance = new SpeechSynthesisUtterance(description);
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleReorder = (newPreviews: any[]) => {
    // Find the new order of noteFiles based on names in newPreviews
    const newNoteFiles = newPreviews.map(p => noteFiles.find(f => f.name === p.name)).filter(Boolean) as File[];
    setPreviews(newPreviews);
    setNoteFiles(newNoteFiles);
  };

  const handleAiCover = async () => {
    if (!title && !subject) {
      showToast("Title or Subject lagbe cover generate korte bruh!", "error");
      return;
    }
    setSuggesting(true);
    try {
      // In a real app, this would call a DALL-E/Midjourney API.
      // For NoteSphere, we use a pro-level dynamic gradient generator based on subject mood.
      const moods: Record<string, string> = {
        "CSE": "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
        "EEE": "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
        "MAT": "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
        "default": "linear-gradient(135deg, #18181b 0%, #3f3f46 100%)"
      };
      
      const mood = moods[department] || moods.default;
      
      // Create a canvas-based aesthetic cover
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1600;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 1200, 1600);
        grad.addColorStop(0, department === "CSE" ? "#4f46e5" : "#18181b");
        grad.addColorStop(1, department === "CSE" ? "#06b6d4" : "#3f3f46");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1200, 1600);
        
        ctx.fillStyle = "white";
        ctx.font = "bold 80px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(subject || "ACADEMIC NOTE", 600, 700);
        
        ctx.font = "40px sans-serif";
        ctx.globalAlpha = 0.6;
        ctx.fillText(title || department, 600, 800);
        
        setCroppedImage(canvas.toDataURL("image/jpeg"));
        showToast("AI Magic Cover generated! ✨", "success");
      }
    } catch (err) {
      showToast("Cover generation fail!", "error");
    } finally {
      setSuggesting(false);
    }
  };

  const triggerCamera = () => {
    cameraInputRef.current?.click();
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
      
      formData.append("category", category);
      formData.append("tags", tagList.join(","));
      formData.append("isPublic", String(isPublic));
      
      // Append all note files
      noteFiles.forEach(file => {
        formData.append("file", file);
      });

      // Append cover image if exists
      if (croppedImage) {
        const coverRes = await fetch(croppedImage);
        const blob = await coverRes.blob();
        formData.append("cover", blob, "cover.jpg");
      }

      const res = await api.post("/notes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percentCompleted);
        },
      });

      const newNote = res.data.note;
      setUploadedNote(newNote);
      
      localStorage.removeItem("note_upload_draft");
      
      // Add to recently viewed
      const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      const updatedRecently = [
        {
          _id: newNote._id,
          slug: newNote.slug,
          title: newNote.title,
          subject: newNote.subject,
          subjectCode: newNote.subjectCode,
          fileType: newNote.fileType,
          isVerified: newNote.isVerified
        },
        ...recentlyViewed.filter((n: any) => n._id !== newNote._id)
      ].slice(0, 4);
      localStorage.setItem("recentlyViewed", JSON.stringify(updatedRecently));
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#a855f7", "#ffffff"]
      });
      
      setShowXP(true);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <main className="min-h-screen bg-black px-4 py-12 flex items-center justify-center">
         <div className="space-y-4 text-center">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto" />
            <p className="text-zinc-500 font-bold uppercase tracking-widest animate-pulse">Initializing Vault...</p>
         </div>
      </main>
    );
  }

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
                  onChange={(e) => handleSubjectCodeChange(e.target.value)}
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
              <div className="flex justify-between items-end">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <button 
                    onClick={handleSpeak}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-zinc-400 text-[10px] font-bold uppercase hover:bg-white/10 transition-all border border-white/10"
                  >
                    {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    {isSpeaking ? "Stop" : "Listen"}
                  </button>
                  <button 
                    onClick={handleAiSuggest}
                    disabled={suggesting}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-tighter hover:bg-indigo-500/20 transition-all border border-indigo-500/20 disabled:opacity-50"
                  >
                    {suggesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                    {suggesting ? "Magic working..." : "Magic Enhance"}
                  </button>
                </div>
              </div>
              <textarea 
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What covers these notes? Or use Magic Enhance ✨" 
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomSelect 
                label="Note Category" 
                options={["Hand-written", "Digital", "Exam Paper", "Assignment", "Lab Report", "Other"].map(opt => ({ value: opt, label: opt }))} 
                value={category} 
                onChange={setCategory} 
              />
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Visibility</label>
                </div>
                <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
                   <button 
                    onClick={() => setIsPublic(true)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${isPublic ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                   >
                     <Globe className="w-3 h-3" /> Public
                   </button>
                   <button 
                    onClick={() => setIsPublic(false)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${!isPublic ? 'bg-indigo-500 text-white' : 'text-zinc-500 hover:text-white'}`}
                   >
                     <Lock className="w-3 h-3" /> Private
                   </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Tags (Press Enter)</label>
                <div className="flex flex-wrap gap-2 p-2 rounded-2xl border border-white/10 bg-white/5 min-h-[56px] focus-within:border-indigo-500 transition-colors">
                  <AnimatePresence>
                    {tagList.map((tag) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold border border-indigo-500/30"
                      >
                        #{tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                  <input 
                    type="text" 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInput}
                    placeholder={tagList.length === 0 ? "e.g. midterm, organic" : ""} 
                    className="flex-1 bg-transparent border-none outline-none text-white text-sm min-w-[120px]"
                  />
                </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                  Note Assets (Drag to reorder) <span className="text-red-500">*</span>
                </label>
                
                <Reorder.Group 
                  axis="y" 
                  values={previews} 
                  onReorder={handleReorder}
                  className={`grid grid-cols-2 gap-3 p-3 rounded-3xl border-2 border-dashed transition-all ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/5'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <AnimatePresence>
                    {compressing && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-3xl"
                      >
                         <div className="relative">
                            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                            <Zap className="w-4 h-4 text-yellow-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                         </div>
                         <p className="text-[10px] text-white font-black uppercase tracking-widest mt-3">Optimizing Assets...</p>
                      </motion.div>
                    )}
                    {previews.map((preview, index) => (
                      <Reorder.Item 
                        key={preview.name} 
                        value={preview}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative aspect-square rounded-2xl bg-white/5 border border-white/10 overflow-hidden group cursor-grab active:cursor-grabbing"
                      >
                        {preview.url ? (
                          <Image 
                            src={preview.url} 
                            alt={preview.name} 
                            fill 
                            className="object-cover" 
                            unoptimized
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                             <FileText className="w-8 h-8 text-indigo-400 mb-2" />
                             <p className="text-[10px] text-zinc-400 truncate w-full">{preview.name}</p>
                          </div>
                        )}
                        <button 
                          onClick={() => removeFile(index)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-10"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Reorder.Item>
                    ))}
                  </AnimatePresence>
                  
                  <div className="relative aspect-square rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center p-4 text-center group hover:border-indigo-500 transition-colors cursor-pointer overflow-hidden min-h-[120px]">
                    <Upload className="w-6 h-6 text-zinc-500 group-hover:text-indigo-400 mb-2 transition-colors" />
                    <p className="text-[10px] text-zinc-400 font-bold">Add Files</p>
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx,image/*" 
                      multiple
                      onChange={handleNoteFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                  </div>
                </Reorder.Group>
                
                {noteFiles.length > 0 && (
                  <div className="flex justify-between items-center px-2">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      {noteFiles.length} {noteFiles.length === 1 ? "File" : "Files"} selected
                    </p>
                    <button 
                      onClick={triggerCamera}
                      className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-bold uppercase tracking-widest hover:text-white transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Snap Page
                    </button>
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment" 
                      className="hidden" 
                      ref={cameraInputRef}
                      onChange={handleNoteFileChange}
                    />
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      {(noteFiles.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(2)} MB Total
                    </p>
                  </div>
                )}
              </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Note Cover (Optional)</label>
                <button 
                  onClick={handleAiCover}
                  disabled={suggesting}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-tighter hover:bg-indigo-500/20 transition-all border border-indigo-500/20 disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3" />
                  Magic Cover
                </button>
              </div>
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

        <div className="mt-12 space-y-6">
          {loading && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-indigo-400">
                <span>Uploading to Vault</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end relative">
            <AnimatePresence>
              {showXP && (
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: -60 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 top-0 text-2xl font-black text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                >
                  +100 XP ⚡
                </motion.div>
              )}
            </AnimatePresence>
            
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
              {loading ? `Publishing ${uploadProgress}%` : "Submit to Vault"}
            </button>
          </div>
        </div>

        {/* Social Preview Section */}
        <div className="mt-20 border-t border-white/10 pt-12">
           <header className="mb-8 flex items-center gap-3">
             <Share2 className="w-5 h-5 text-zinc-500" />
             <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Sharing Preview</h2>
           </header>
           
           <div className="max-w-md mx-auto rounded-3xl bg-[#1c1c1e] border border-white/5 overflow-hidden shadow-2xl">
             <div className="aspect-[1.91/1] relative bg-zinc-900 flex items-center justify-center overflow-hidden">
                {croppedImage ? (
                  <Image src={croppedImage} alt="Social" fill className="object-cover opacity-60" unoptimized />
                ) : (
                  <div className="text-zinc-700 font-bold italic">Cover Preview</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1e] to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                   <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 rounded-lg bg-indigo-500 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest">NoteSphere</span>
                   </div>
                   <h3 className="text-lg font-bold text-white leading-tight truncate">{title || "Your Note Title"}</h3>
                </div>
             </div>
             <div className="p-4 space-y-2">
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {description || "Add a description to see how this note will appear when shared with your peers."}
                </p>
                <div className="flex items-center gap-2 pt-2 text-[10px] font-bold text-indigo-400/60 uppercase">
                   <span>{subject || "Subject"}</span>
                   <span>•</span>
                   <span>{department}</span>
                </div>
             </div>
           </div>
           <p className="text-center text-[10px] text-zinc-600 mt-6 uppercase tracking-widest italic">
             Optimized for WhatsApp, Messenger, and LinkedIn
           </p>
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

      <AnimatePresence>
        {showSuccessModal && uploadedNote && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4 overflow-y-auto"
          >
             <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               className="bg-zinc-900 border border-white/10 p-8 rounded-[40px] max-w-lg w-full text-center relative shadow-[0_0_100px_rgba(99,102,241,0.2)]"
             >
                <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mx-auto mb-6">
                   <CheckCircle className="w-10 h-10" />
                </div>
                
                <h2 className="text-3xl font-black text-white mb-2">Note Vaulted! 🚀</h2>
                <p className="text-zinc-500 mb-8 font-medium">Your knowledge is now part of the NoteSphere network.</p>
                
                <div className="bg-white p-4 rounded-3xl inline-block mb-8 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                   <QRCodeSVG 
                     value={`${window.location.origin}/notes/${uploadedNote.slug}`} 
                     size={160}
                     level="H"
                   />
                </div>
                
                <div className="flex flex-col gap-3">
                   <button 
                     onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/notes/${uploadedNote.slug}`);
                        showToast("Link copied to clipboard!", "success");
                     }}
                     className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                   >
                     <Copy className="w-4 h-4" /> Copy Share Link
                   </button>
                   <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => router.push(`/notes/${uploadedNote.slug}`)}
                        className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20"
                      >
                        <ExternalLink className="w-4 h-4" /> View Note
                      </button>
                      <button 
                        onClick={() => router.push("/notes")}
                        className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                      >
                        Go to Hub
                      </button>
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

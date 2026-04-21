"use client";

import MainNav from "@/components/ui/MainNav";
import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-12 sm:px-6 lg:px-10">
      <MainNav />
      <section className="mx-auto max-w-3xl mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert max-w-none"
        >
          <h1 className="text-4xl font-black text-white mb-8">Terms of Service</h1>
          <p className="text-zinc-400">Welcome to NoteSphere. By using our platform, you agree to the following terms.</p>
          
          <h2 className="text-xl font-bold text-indigo-400 mt-10">1. Content Ownership</h2>
          <p className="text-zinc-500">You retain ownership of the notes you upload, but you grant NoteSphere a license to display and distribute them to other students.</p>
          
          <h2 className="text-xl font-bold text-indigo-400 mt-10">2. Academic Integrity</h2>
          <p className="text-zinc-500">NoteSphere is for study assistance only. Using these notes to cheat on exams is strictly prohibited and may result in a permanent ban.</p>
          
          <h2 className="text-xl font-bold text-indigo-400 mt-10">3. Community Standards</h2>
          <p className="text-zinc-500">Respect your peers. Harassment or spamming will not be tolerated within the NoteSphere ecosystem.</p>
        </motion.div>
      </section>
    </main>
  );
}

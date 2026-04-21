"use client";

import MainNav from "@/components/ui/MainNav";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-12 sm:px-6 lg:px-10">
      <MainNav />
      <section className="mx-auto max-w-3xl mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert max-w-none"
        >
          <h1 className="text-4xl font-black text-white mb-8">Privacy Policy</h1>
          <p className="text-zinc-400">Your privacy is our priority. We only collect the data necessary to provide you with the best experience.</p>
          
          <h2 className="text-xl font-bold text-cyan-400 mt-10">1. Data Collection</h2>
          <p className="text-zinc-500">We collect your username, email, and academic details to personalize your dashboard and leaderboard rank.</p>
          
          <h2 className="text-xl font-bold text-cyan-400 mt-10">2. Security</h2>
          <p className="text-zinc-500">Your password is encrypted using high-level hashing (Bcrypt). We do not store plain-text passwords.</p>
          
          <h2 className="text-xl font-bold text-cyan-400 mt-10">3. Cookies</h2>
          <p className="text-zinc-500">We use secure HTTP-only cookies to keep you logged in safely across sessions.</p>
        </motion.div>
      </section>
    </main>
  );
}

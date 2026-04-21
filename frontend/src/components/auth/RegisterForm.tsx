"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";

type RegisterValues = {
  name: string;
  email: string;
  username: string;
  password: string;
  department: string;
  semester: string;
};

import { useState } from "react";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { register: registerUser, loading, error, clearError } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>();

  const onSubmit = async (values: RegisterValues) => {
    clearError();
    const ok = await registerUser(values);
    if (ok) {
      router.push("/dashboard");
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/65 p-7 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur"
    >
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100">Create your profile</h1>
        <p className="mt-1 text-sm text-zinc-400">Start collecting XP and sharing trusted notes.</p>
      </div>

      <label className="block space-y-1">
        <span className="text-sm text-zinc-300">Name</span>
        <input
          type="text"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition focus:border-cyan-400"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
      </label>

      <label className="block space-y-1">
        <span className="text-sm text-zinc-300">Email</span>
        <input
          type="email"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition focus:border-cyan-400"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
      </label>

      <label className="block space-y-1">
        <span className="text-sm text-zinc-300">Username</span>
        <input
          type="text"
          placeholder="e.g. salah5537"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition focus:border-cyan-400 placeholder:text-zinc-700"
          {...register("username", { 
            required: "Username is required",
            minLength: { value: 3, message: "Minimum 3 characters" }
          })}
        />
        {errors.username && <p className="text-xs text-red-400">{errors.username.message}</p>}
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="text-sm text-zinc-300">Department</span>
          <input
            type="text"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition focus:border-cyan-400"
            {...register("department", { required: "Required" })}
          />
          {errors.department && <p className="text-xs text-red-400">{errors.department.message}</p>}
        </label>

        <label className="block space-y-1">
          <span className="text-sm text-zinc-300">Semester</span>
          <input
            type="text"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition focus:border-cyan-400"
            {...register("semester", { required: "Required" })}
          />
          {errors.semester && <p className="text-xs text-red-400">{errors.semester.message}</p>}
        </label>
      </div>

      <label className="block space-y-1">
        <span className="text-sm text-zinc-300">Password</span>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition focus:border-cyan-400"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            {showPassword ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
            )}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-zinc-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>

      <p className="text-sm text-zinc-400">
        Already registered?{" "}
        <Link href="/login" className="text-cyan-300 hover:text-cyan-200">
          Sign in
        </Link>
      </p>
    </motion.form>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";

type LoginValues = {
  identifier: string;
  password: string;
};

import { useState } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login, loading, error, clearError } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>();

  const onSubmit = async (values: LoginValues) => {
    clearError();
    const ok = await login(values);
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
        <h1 className="text-2xl font-semibold text-zinc-100">Welcome back</h1>
        <p className="mt-1 text-sm text-zinc-400">Log in and continue your NoteSphere journey.</p>
      </div>

      <label className="block space-y-1">
        <span className="text-sm text-zinc-300">Email or Username</span>
        <input
          type="text"
          placeholder="salah5537 or salah@example.com"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition focus:border-cyan-400 placeholder:text-zinc-700"
          {...register("identifier", { required: "Username or Email is required" })}
        />
        {errors.identifier && <p className="text-xs text-red-400">{errors.identifier.message}</p>}
      </label>

      <label className="block space-y-1">
        <span className="text-sm text-zinc-300">Password</span>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition focus:border-cyan-400"
            {...register("password", { required: "Password is required" })}
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

      <div className="flex justify-end">
         <Link href="/forgot-password" className="text-xs text-zinc-500 hover:text-cyan-400 transition-colors">
            Forgot access key?
         </Link>
      </div>



      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-zinc-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <p className="text-sm text-zinc-400">
        New to NoteSphere?{" "}
        <Link href="/register" className="text-cyan-300 hover:text-cyan-200">
          Create account
        </Link>
      </p>
    </motion.form>
  );
}

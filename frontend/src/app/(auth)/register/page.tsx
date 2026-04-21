import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.15),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(244,114,182,0.12),transparent_30%),radial-gradient(circle_at_70%_85%,rgba(99,102,241,0.14),transparent_40%)]" />
      <RegisterForm />
    </main>
  );
}

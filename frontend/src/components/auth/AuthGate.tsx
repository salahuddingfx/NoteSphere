"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Spinner } from "@/components/ui/Spinner";

type AuthGateProps = {
  children: React.ReactNode;
};

export default function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const { user, hydrated, loading, fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    if (!hydrated) {
      fetchCurrentUser();
    }
  }, [hydrated, fetchCurrentUser]);

  useEffect(() => {
    if (hydrated && !loading && !user) {
      router.replace("/login");
    }
  }, [hydrated, loading, user, router]);

  if (!hydrated || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

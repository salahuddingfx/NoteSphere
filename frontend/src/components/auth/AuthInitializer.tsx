"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

export default function AuthInitializer() {
  const { hydrated, fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    if (!hydrated) {
      fetchCurrentUser();
    }
  }, [hydrated, fetchCurrentUser]);

  return null;
}

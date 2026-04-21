"use client";

import { create } from "zustand";
import { api, AuthPayload, AuthUser } from "@/lib/api";

type AuthStore = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  hydrated: boolean;
  error: string | null;
  register: (payload: AuthPayload) => Promise<boolean>;
  login: (payload: AuthPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  clearError: () => void;
};

const extractError = (error: unknown): string => {
  if (typeof error === "object" && error && "response" in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message || "Something went wrong";
  }

  return "Something went wrong";
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  hydrated: false,
  error: null,

  register: async (payload) => {
    set({ loading: true, error: null });

    try {
      const { data } = await api.post("/auth/register", payload);
      set({ user: data.user, isAuthenticated: true, loading: false, hydrated: true });
      return true;
    } catch (error) {
      set({ error: extractError(error), isAuthenticated: false, loading: false, hydrated: true });
      return false;
    }
  },

  login: async (payload) => {
    set({ loading: true, error: null });

    try {
      const { data } = await api.post("/auth/login", payload);
      set({ user: data.user, isAuthenticated: true, loading: false, hydrated: true });
      return true;
    } catch (error) {
      set({ error: extractError(error), isAuthenticated: false, loading: false, hydrated: true });
      return false;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });

    try {
      await api.post("/auth/logout");
      set({ user: null, isAuthenticated: false, loading: false, hydrated: true });
    } catch (error) {
      set({ error: extractError(error), loading: false, hydrated: true });
    }
  },

  fetchCurrentUser: async () => {
    set({ loading: true, error: null });

    try {
      const { data } = await api.get("/auth/me");
      set({ user: data.user, isAuthenticated: true, loading: false, hydrated: true });
    } catch {
      set({ user: null, isAuthenticated: false, loading: false, hydrated: true });
    }
  },

  clearError: () => set({ error: null }),
}));

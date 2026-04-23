"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "nexus-dark" | "deep-space" | "academic-gold";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("nexus-dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("ns-theme") as Theme;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("nexus-dark", "deep-space", "academic-gold");
    root.classList.add(theme);
    localStorage.setItem("ns-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

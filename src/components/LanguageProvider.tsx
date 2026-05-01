"use client";

/**
 * Language provider for CN/EN toggle.
 * Persists choice to localStorage, defaults to "en".
 */

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Language = "en" | "zh";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("language") as Language | null;
      if (saved === "en" || saved === "zh") {
        setLanguageState(saved);
      }
    } catch {
      // localStorage not available during SSR
    } finally {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("language", language);
    } catch {
      // ignore write failures
    }
    document.documentElement.setAttribute("lang", language);
  }, [language, mounted]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === "en" ? "zh" : "en"));
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

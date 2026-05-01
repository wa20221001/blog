"use client";

/**
 * Language toggle button — switches between EN and 中文.
 */

import { useLanguage } from "@/components/LanguageProvider";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  const label = language === "en" ? "Switch to 中文" : "切换至 English";

  return (
    <button
      onClick={toggleLanguage}
      className="rounded-lg px-2.5 py-1 text-sm font-medium text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
      title={label}
      aria-label={label}
    >
      {language === "en" ? "中文" : "EN"}
    </button>
  );
}

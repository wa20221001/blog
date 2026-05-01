"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function BlogHeader() {
  const { language } = useLanguage();

  return (
    <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
      {language === "zh" ? "所有文章" : "All Posts"}
    </h1>
  );
}

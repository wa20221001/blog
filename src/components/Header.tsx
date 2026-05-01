"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/components/LanguageProvider";

export default function Header() {
  const { language } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-zinc-50/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-50/60 dark:border-zinc-800 dark:bg-black/95 dark:supports-[backdrop-filter]:bg-black/60">
      <div className="mx-auto flex h-14 w-full items-center justify-between px-6">
        <Link href="/" className="font-bold text-zinc-900 hover:opacity-80 dark:text-zinc-50">
          Scott
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <Link href="/resume" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            {language === "zh" ? "简历" : "Resume"}
          </Link>
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            {language === "zh" ? "博客" : "Blog"}
          </Link>
          <LanguageToggle />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

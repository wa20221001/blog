"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/components/LanguageProvider";

export default function Header() {
  const { language } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-zinc-50/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-50/60 dark:border-zinc-800 dark:bg-black/95 dark:supports-[backdrop-filter]:bg-black/60">
      <div className="mx-auto grid h-14 w-full grid-cols-3 items-center px-6">
        <Link href="/" className="justify-self-start text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
          {"Scott's Blog"}
        </Link>
        <Link
          href="/"
          className="justify-self-center text-xl font-bold text-zinc-900 hover:opacity-80 dark:text-zinc-50"
        >
          {language === "zh" ? "博客" : "Blog"}
        </Link>
        <nav className="flex items-center justify-end gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <Link href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            {language === "zh" ? "关于" : "About"}
          </Link>
          <LanguageToggle />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

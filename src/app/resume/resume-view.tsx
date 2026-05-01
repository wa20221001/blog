"use client";

import { useLanguage } from "@/components/LanguageProvider";

const RESUME_PDFS = {
  en: "/blog/resume/scott-si-qiu-wang-resume-en.pdf",
  zh: "/blog/resume/scott-si-qiu-wang-resume-zh.pdf",
} as const;

interface ResumeViewProps {
  enResume: React.ReactNode;
  zhResume: React.ReactNode;
}

export function ResumeView({ enResume, zhResume }: ResumeViewProps) {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col px-6 py-16">
        <div className="mb-8 flex flex-wrap items-center justify-end gap-3">
          <a
            href={RESUME_PDFS[language]}
            download
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
          >
            {language === "zh" ? "下载 PDF" : "Download PDF"}
          </a>
          <a
            href={RESUME_PDFS[language === "zh" ? "en" : "zh"]}
            download
            className="rounded-md border border-transparent px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
          >
            {language === "zh" ? "English PDF" : "中文 PDF"}
          </a>
        </div>
        {language === "zh" ? zhResume : enResume}
      </main>
    </div>
  );
}

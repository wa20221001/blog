"use client";

import { useLanguage } from "@/components/LanguageProvider";

interface ResumeViewProps {
  enResume: React.ReactNode;
  zhResume: React.ReactNode;
}

export function ResumeView({ enResume, zhResume }: ResumeViewProps) {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col px-6 py-16">
        <div className="mb-8 rounded-md border border-zinc-300 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          {language === "zh"
            ? "如需 PDF 版本，请联系索取。"
            : "A PDF version of this resume is available upon request."}
        </div>
        {language === "zh" ? zhResume : enResume}
      </main>
    </div>
  );
}

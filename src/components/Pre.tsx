"use client";

import { useRef, useState, type ComponentProps } from "react";

export function Pre({ children, className, ...props }: ComponentProps<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = preRef.current?.innerText ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 rounded px-2 py-0.5 text-xs font-medium
                   bg-zinc-700/50 text-zinc-400 opacity-0 transition
                   hover:bg-zinc-600 hover:text-zinc-200
                   group-hover:opacity-100
                   dark:bg-zinc-200/50 dark:text-zinc-500 dark:hover:bg-zinc-300 dark:hover:text-zinc-800"
        aria-label="Copy code"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre ref={preRef} className={className} {...props}>
        {children}
      </pre>
    </div>
  );
}

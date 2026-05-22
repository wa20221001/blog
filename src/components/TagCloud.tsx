import { getTagCounts } from "@/lib/content/posts";

export default async function TagCloud() {
  const tagCounts = await getTagCounts();

  if (tagCounts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tagCounts.map(({ tag, count }) => (
        <a
          key={tag}
          href={`/#tag=${encodeURIComponent(tag)}`}
          className="inline-flex items-center gap-1 rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
        >
          {tag}
          <span className="tabular-nums text-zinc-300 dark:text-zinc-600">
            {count}
          </span>
        </a>
      ))}
    </div>
  );
}

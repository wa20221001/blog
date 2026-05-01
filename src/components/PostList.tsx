import Link from "next/link";
import type { SearchablePostSummary } from "@/lib/content/search";

interface PostListProps {
  posts: SearchablePostSummary[];
  emptyMessage?: string;
  onTagClick?: (tag: string) => void;
}

export default function PostList({ posts, emptyMessage = "No posts yet.", onTagClick }: PostListProps) {
  if (posts.length === 0) {
    return <p className="text-zinc-600 dark:text-zinc-400">{emptyMessage}</p>;
  }

  return (
    <ul className="flex flex-col gap-8">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/${post.slug}`}
            className="group flex flex-col gap-2"
          >
            <h2 className="text-xl font-medium text-black group-hover:underline dark:text-zinc-50">
              {post.frontmatter.title}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {post.frontmatter.summary}
            </p>
            <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
              <time dateTime={post.frontmatter.published_at}>
                {new Date(post.frontmatter.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span>·</span>
              <span className="flex flex-wrap gap-1.5">
                {post.frontmatter.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onTagClick?.(tag);
                    }}
                    className="rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-xs text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
                  >
                    {tag}
                  </button>
                ))}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

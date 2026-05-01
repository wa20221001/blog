import Link from "next/link";
import { MdxContent } from "@/lib/content/mdx";
import type { Post } from "@/lib/content/posts";

interface PostContentProps {
  post: Post;
}

export default function PostContent({ post }: PostContentProps) {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <article className="w-full max-w-3xl px-6 py-16">
        <header className="mb-10 flex flex-col gap-3">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            &larr; All posts
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {post.frontmatter.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
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
                <Link
                  key={tag}
                  href={`/#tag=${encodeURIComponent(tag)}`}
                  className="rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-xs text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
                >
                  {tag}
                </Link>
              ))}
            </span>
          </div>
        </header>
        <MdxContent source={post.content} />
      </article>
    </div>
  );
}

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
            <span>{post.frontmatter.tags.join(", ")}</span>
          </div>
        </header>
        <MdxContent source={post.content} />
      </article>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { searchPosts, type SearchablePostSummary } from "@/lib/content/search";
import PostList from "@/components/PostList";

interface BlogSearchProps {
  posts: SearchablePostSummary[];
}

export function BlogSearch({ posts }: BlogSearchProps) {
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const visiblePosts = useMemo(() => searchPosts(posts, trimmedQuery), [posts, trimmedQuery]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="blog-search">
          Search posts
        </label>
        <input
          id="blog-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value.slice(0, 100))}
          placeholder="Search by title, slug, or tag"
          className="min-h-11 flex-1 rounded-md border border-zinc-300 bg-white px-4 text-sm text-zinc-950 caret-zinc-950 outline-none transition [color-scheme:light] [-webkit-text-fill-color:#09090b] placeholder:text-zinc-500 placeholder:[-webkit-text-fill-color:#71717a] focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:caret-zinc-50 dark:[color-scheme:dark] dark:[-webkit-text-fill-color:#fafafa] dark:placeholder:text-zinc-500 dark:placeholder:[-webkit-text-fill-color:#71717a] dark:focus:border-zinc-50 dark:focus:ring-zinc-50/10"
        />
        <button
          type="button"
          onClick={() => setQuery("")}
          className="min-h-11 rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Clear
        </button>
      </div>
      <div className="flex min-h-5 flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        {hasQuery ? (
          <span>
            {visiblePosts.length} of {posts.length} posts match &quot;{trimmedQuery}&quot;.
          </span>
        ) : (
          <span>{posts.length} public posts</span>
        )}
      </div>
      <PostList
        posts={visiblePosts}
        emptyMessage={hasQuery ? "No public posts matched your search." : "No posts yet."}
      />
    </div>
  );
}

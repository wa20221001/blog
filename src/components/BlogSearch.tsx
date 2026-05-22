"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { searchPosts, type SearchablePostSummary } from "@/lib/content/search";
import PostList from "@/components/PostList";

const POSTS_PER_PAGE = 10;

interface BlogSearchProps {
  posts: SearchablePostSummary[];
}

function getHashParam(hash: string, param: string): string | null {
  const prefix = `${param}=`;
  for (const part of hash.slice(1).split("&")) {
    if (part.startsWith(prefix)) {
      return decodeURIComponent(part.slice(prefix.length));
    }
  }
  return null;
}

function pageHash(page: number): string {
  return page > 1 ? `#page=${page}` : "";
}

export function BlogSearch({ posts }: BlogSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const tag = getHashParam(hash, "tag");
    if (tag) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery(tag);
      return;
    }

    const pageParam = getHashParam(hash, "page");
    if (pageParam) {
      const n = Number.parseInt(pageParam, 10);
      if (Number.isFinite(n) && n >= 1) {
        setPage(n);
      }
    }
  }, []);

  useEffect(() => {
    function handleClearSearch() {
      setQuery("");
      setPage(1);
    }
    window.addEventListener("blog:clear-search", handleClearSearch);
    return () => window.removeEventListener("blog:clear-search", handleClearSearch);
  }, []);

  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const visiblePosts = useMemo(
    () => searchPosts(posts, trimmedQuery),
    [posts, trimmedQuery],
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(visiblePosts.length / POSTS_PER_PAGE)),
    [visiblePosts.length],
  );

  const safePage = Math.min(page, totalPages);

  const pagedPosts = useMemo(
    () => visiblePosts.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE),
    [visiblePosts, safePage],
  );

  const handleTagClick = useCallback(
    (tag: string) => {
      setQuery(tag);
      setPage(1);
      window.history.replaceState(null, "", window.location.pathname);
    },
    [],
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setPage(1);
    router.replace("/", { scroll: false });
  }, [router]);

  const handlePageChange = useCallback(
    (next: number) => {
      setPage(next);
      const hash = pageHash(next);
      if (hash) {
        window.history.replaceState(null, "", hash);
      } else {
        window.history.replaceState(null, "", window.location.pathname);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [],
  );

  const firstPost = (safePage - 1) * POSTS_PER_PAGE + 1;
  const lastPost = Math.min(safePage * POSTS_PER_PAGE, visiblePosts.length);

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
          onChange={(event) => {
            setQuery(event.target.value.slice(0, 100));
            setPage(1);
          }}
          placeholder="Search by title, slug, or tag"
          className="min-h-11 flex-1 rounded-md border border-zinc-300 bg-white px-4 text-sm text-zinc-950 caret-zinc-950 outline-none transition [color-scheme:light] [-webkit-text-fill-color:#09090b] placeholder:text-zinc-500 placeholder:[-webkit-text-fill-color:#71717a] focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:caret-zinc-50 dark:[color-scheme:dark] dark:[-webkit-text-fill-color:#fafafa] dark:placeholder:text-zinc-500 dark:placeholder:[-webkit-text-fill-color:#71717a] dark:focus:border-zinc-50 dark:focus:ring-zinc-50/10"
        />
        <button
          type="button"
          onClick={handleClear}
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
          <span>
            {visiblePosts.length} public post{visiblePosts.length !== 1 ? "s" : ""}
            {totalPages > 1 && (
              <span className="tabular-nums">
                {" — "}page {safePage} of {totalPages}
                {` (${firstPost}–${lastPost})`}
              </span>
            )}
          </span>
        )}
      </div>
      <PostList
        posts={pagedPosts}
        emptyMessage={hasQuery ? "No public posts matched your search." : "No posts yet."}
        onTagClick={handleTagClick}
      />
      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => handlePageChange(safePage - 1)}
            className="min-h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => handlePageChange(n)}
              className={`min-h-9 min-w-9 rounded-md border px-2 text-sm transition ${
                n === safePage
                  ? "border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950"
                  : "border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => handlePageChange(safePage + 1)}
            className="min-h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content/posts";
import { BlogHeader } from "@/components/BlogHeader";
import { BlogSearch } from "@/components/BlogSearch";

export const metadata: Metadata = {
  title: "Scott",
  description: "Scott's public blog.",
};

async function getAccessiblePosts() {
  const posts = await getAllPosts();
  return posts
    .filter((post) => post.frontmatter.visibility === "public")
    .map((post) => ({
      slug: post.slug,
      frontmatter: post.frontmatter,
    }));
}

export default async function BlogIndexPage() {
  const posts = await getAccessiblePosts();

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col gap-8 px-6 py-16">
        <BlogHeader />
        <BlogSearch posts={posts} />
      </main>
    </div>
  );
}

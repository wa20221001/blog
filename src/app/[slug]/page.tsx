import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPost, getPostSummary } from "@/lib/content/posts";
import PostContent from "./post-content";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostSummary(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.summary,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const postSummary = await getPostSummary(slug);

  if (!postSummary) {
    notFound();
  }

  const post = await getPost(slug);
  if (!post) {
    notFound();
  }

  return <PostContent post={post} />;
}

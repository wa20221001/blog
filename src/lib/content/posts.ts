import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { validateFrontmatter, type Frontmatter } from "./frontmatter";

const CONTENT_DIR = path.join(process.cwd(), "content", "posts");

export interface PostSummary {
  slug: string;
  frontmatter: Frontmatter;
  filePath: string;
}

export interface Post extends PostSummary {
  content: string;
}

/**
 * Get all post directories from content/posts/
 */
async function getPostDirs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
  } catch {
    return [];
  }
}

async function readPostSource(slug: string): Promise<{
  frontmatter: Frontmatter;
  content: string;
  filePath: string;
} | null> {
  const postDir = path.join(CONTENT_DIR, slug);
  const indexPath = path.join(postDir, "index.mdx");

  try {
    const raw = await fs.readFile(indexPath, "utf-8");
    const { data, content } = matter(raw);
    const { data: frontmatter, errors } = validateFrontmatter(data, `${slug}/index.mdx`);

    if (errors.length > 0) {
      console.warn(`Frontmatter validation errors for ${slug}:`, errors);
    }

    return {
      frontmatter,
      content,
      filePath: indexPath,
    };
  } catch {
    return null;
  }
}

/**
 * Load a single post summary by slug (directory name).
 */
export async function getPostSummary(slug: string): Promise<PostSummary | null> {
  const source = await readPostSource(slug);
  if (!source) {
    return null;
  }

  return {
    slug,
    frontmatter: source.frontmatter,
    filePath: source.filePath,
  };
}

/**
 * Load a single post with full content by slug (directory name).
 */
export async function getPost(slug: string): Promise<Post | null> {
  const source = await readPostSource(slug);
  if (!source) {
    return null;
  }

  return {
    slug,
    frontmatter: source.frontmatter,
    content: source.content,
    filePath: source.filePath,
  };
}

/**
 * Get all posts, optionally filtering by draft status
 */
export async function getAllPosts(options?: {
  includeDrafts?: boolean;
}): Promise<PostSummary[]> {
  const dirs = await getPostDirs();
  const posts: PostSummary[] = [];

  for (const dir of dirs) {
    const post = await getPostSummary(dir);
    if (!post) continue;

    // Skip drafts unless explicitly included
    if (post.frontmatter.draft && !options?.includeDrafts) {
      continue;
    }

    posts.push(post);
  }

  // Sort by published_at descending (newest first)
  posts.sort(
    (a, b) =>
      new Date(b.frontmatter.published_at).getTime() -
      new Date(a.frontmatter.published_at).getTime()
  );

  return posts;
}

/**
 * Get all unique tags from all posts
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = new Set<string>();

  for (const post of posts) {
    for (const tag of post.frontmatter.tags) {
      tags.add(tag);
    }
  }

  return Array.from(tags).sort();
}

import type { Frontmatter } from "./frontmatter";

export interface SearchablePostSummary {
  slug: string;
  frontmatter: Frontmatter;
}

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function searchFields(post: SearchablePostSummary): string[] {
  return [
    post.slug,
    post.frontmatter.slug,
    post.frontmatter.title,
    ...post.frontmatter.tags,
  ];
}

function scorePost(post: SearchablePostSummary, terms: string[]): number {
  const fields = searchFields(post).map(normalizeSearchText).filter(Boolean);
  const title = normalizeSearchText(post.frontmatter.title);
  const directorySlug = normalizeSearchText(post.slug);
  const frontmatterSlug = normalizeSearchText(post.frontmatter.slug);
  const tags = post.frontmatter.tags.map(normalizeSearchText);

  let score = 0;

  for (const term of terms) {
    const hasMatch = fields.some((field) => field.includes(term));

    if (!hasMatch) {
      return 0;
    }

    if (tags.some((tag) => tag === term)) score += 60;
    if (directorySlug === term || frontmatterSlug === term) score += 55;
    if (title === term) score += 50;
    if (tags.some((tag) => tag.startsWith(term))) score += 35;
    if (directorySlug.startsWith(term) || frontmatterSlug.startsWith(term)) score += 30;
    if (title.startsWith(term)) score += 25;
    if (title.includes(term)) score += 15;
    if (directorySlug.includes(term) || frontmatterSlug.includes(term)) score += 10;
  }

  return score;
}

export function normalizeSearchQuery(query: string): string {
  return normalizeSearchText(query).slice(0, 100);
}

export function searchPosts<T extends SearchablePostSummary>(posts: T[], query: string): T[] {
  const normalizedQuery = normalizeSearchQuery(query);

  if (!normalizedQuery) {
    return posts;
  }

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  return posts
    .map((post, index) => ({
      post,
      index,
      score: scorePost(post, terms),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((result) => result.post);
}

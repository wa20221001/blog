import { describe, expect, it } from "vitest";
import { normalizeSearchQuery, searchPosts } from "@/lib/content/search";
import type { PostSummary } from "@/lib/content/posts";

function post(overrides: {
  slug: string;
  title: string;
  tags: string[];
  frontmatterSlug?: string;
}): PostSummary {
  return {
    slug: overrides.slug,
    filePath: `/content/posts/${overrides.slug}/index.mdx`,
    frontmatter: {
      title: overrides.title,
      slug: overrides.frontmatterSlug ?? overrides.slug,
      summary: `${overrides.title} summary`,
      published_at: "2024-01-01",
      tags: overrides.tags,
      visibility: "public",
      draft: false,
    },
  };
}

describe("content search", () => {
  const posts = [
    post({
      slug: "ecs-fargate-deployment",
      title: "ECS Fargate Deployment",
      tags: ["aws", "ecs", "terraform"],
    }),
    post({
      slug: "hello-world",
      title: "Hello World",
      tags: ["meta", "introduction"],
    }),
    post({
      slug: "editor-settings",
      title: "VS Code Settings",
      tags: ["code", "setup"],
      frontmatterSlug: "vsc-settings",
    }),
  ];

  it("returns all posts for an empty query", () => {
    expect(searchPosts(posts, "")).toEqual(posts);
  });

  it("matches title, directory slug, frontmatter slug, and tags", () => {
    expect(searchPosts(posts, "fargate").map((result) => result.slug)).toEqual([
      "ecs-fargate-deployment",
    ]);
    expect(searchPosts(posts, "hello-world").map((result) => result.slug)).toEqual([
      "hello-world",
    ]);
    expect(searchPosts(posts, "vsc").map((result) => result.slug)).toEqual([
      "editor-settings",
    ]);
    expect(searchPosts(posts, "terraform").map((result) => result.slug)).toEqual([
      "ecs-fargate-deployment",
    ]);
  });

  it("requires every search term to match a searchable field", () => {
    expect(searchPosts(posts, "aws ecs").map((result) => result.slug)).toEqual([
      "ecs-fargate-deployment",
    ]);
    expect(searchPosts(posts, "aws hello")).toEqual([]);
  });

  it("normalizes punctuation, casing, and excess length", () => {
    expect(normalizeSearchQuery("  AWS / ECS!!  ")).toBe("aws ecs");
    expect(normalizeSearchQuery("a".repeat(120))).toHaveLength(100);
  });
});

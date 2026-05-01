import { describe, it, expect } from "vitest";
import { validateFrontmatter, frontmatterSchema, type Frontmatter } from "@/lib/content/frontmatter";

describe("frontmatter validation", () => {
  const validFrontmatter: Frontmatter = {
    title: "Test Post",
    slug: "test-post",
    summary: "A test post summary",
    published_at: "2024-01-01T00:00:00Z",
    tags: ["test", "example"],
    visibility: "public",
    draft: false,
  };

  describe("validateFrontmatter", () => {
    it("should validate correct frontmatter", () => {
      const result = validateFrontmatter(validFrontmatter, "test.mdx");

      expect(result.errors).toHaveLength(0);
      expect(result.data.title).toBe(validFrontmatter.title);
      expect(result.data.slug).toBe(validFrontmatter.slug);
      expect(result.data.summary).toBe(validFrontmatter.summary);
      expect(result.data.published_at).toBe(validFrontmatter.published_at);
      expect(result.data.tags).toEqual(validFrontmatter.tags);
      expect(result.data.visibility).toBe(validFrontmatter.visibility);
    });

    it("should return errors for invalid frontmatter", () => {
      const invalid = {
        ...validFrontmatter,
        title: "", // Invalid: empty string
      };

      const result = validateFrontmatter(invalid, "test.mdx");

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain("title");
    });

    it("should include file path in error messages", () => {
      const invalid = {
        ...validFrontmatter,
        slug: "INVALID", // Invalid: uppercase
      };

      const result = validateFrontmatter(invalid, "posts/test.mdx");

      expect(result.errors[0]).toContain("posts/test.mdx");
      expect(result.errors[0]).toContain("slug");
    });

    it("should handle multiple validation errors", () => {
      const invalid = {
        ...validFrontmatter,
        title: "",
        slug: "x", // Too short
        tags: [], // Empty array
      };

      const result = validateFrontmatter(invalid, "test.mdx");

      expect(result.errors.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("frontmatterSchema", () => {
    it("should accept valid slug format", () => {
      const result = frontmatterSchema.safeParse({
        ...validFrontmatter,
        slug: "my-awesome-post-123",
      });

      expect(result.success).toBe(true);
    });

    it("should reject uppercase slugs", () => {
      const result = frontmatterSchema.safeParse({
        ...validFrontmatter,
        slug: "MyPost",
      });

      expect(result.success).toBe(false);
    });

    it("should reject slugs with underscores", () => {
      const result = frontmatterSchema.safeParse({
        ...validFrontmatter,
        slug: "my_post",
      });

      expect(result.success).toBe(false);
    });

    it("should reject slugs starting with hyphen", () => {
      const result = frontmatterSchema.safeParse({
        ...validFrontmatter,
        slug: "-post",
      });

      expect(result.success).toBe(false);
    });

    it("should reject slugs ending with hyphen", () => {
      const result = frontmatterSchema.safeParse({
        ...validFrontmatter,
        slug: "post-",
      });

      expect(result.success).toBe(false);
    });

    it("should accept public visibility", () => {
      const result = frontmatterSchema.safeParse({
        ...validFrontmatter,
        visibility: "public",
      });

      expect(result.success).toBe(true);
    });

    it("should reject authenticated visibility", () => {
      const result = frontmatterSchema.safeParse({
        ...validFrontmatter,
        visibility: "authenticated",
      });

      expect(result.success).toBe(false);
    });

    it("should reject admin visibility", () => {
      const result = frontmatterSchema.safeParse({
        ...validFrontmatter,
        visibility: "role:admin",
      });

      expect(result.success).toBe(false);
    });

    it("should require at least one tag", () => {
      const result = frontmatterSchema.safeParse({
        ...validFrontmatter,
        tags: [],
      });

      expect(result.success).toBe(false);
    });

    it("should accept ISO 8601 datetime for published_at", () => {
      const result = frontmatterSchema.safeParse({
        ...validFrontmatter,
        published_at: "2024-01-15T10:30:00+10:00",
      });

      expect(result.success).toBe(true);
    });

    it("should accept date string for published_at", () => {
      const result = frontmatterSchema.safeParse({
        ...validFrontmatter,
        published_at: "2024-01-15",
      });

      expect(result.success).toBe(true);
    });

    it("should normalize Date objects for published_at", () => {
      const result = frontmatterSchema.safeParse({
        ...validFrontmatter,
        published_at: new Date("2024-01-15T00:00:00Z"),
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.published_at).toBe("2024-01-15");
      }
    });

    it("should reject invalid date format for published_at", () => {
      const result = frontmatterSchema.safeParse({
        ...validFrontmatter,
        published_at: "invalid-date",
      });

      expect(result.success).toBe(false);
    });

    it("should make draft optional with default false", () => {
      const result = frontmatterSchema.safeParse({
        ...validFrontmatter,
        draft: undefined,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.draft).toBe(false);
      }
    });

    it("should accept cover_image when provided", () => {
      const result = frontmatterSchema.safeParse({
        ...validFrontmatter,
        cover_image: "/images/test.jpg",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.cover_image).toBe("/images/test.jpg");
      }
    });
  });
});

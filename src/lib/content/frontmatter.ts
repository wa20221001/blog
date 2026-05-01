import { z } from "zod";

const visibilitySchema = z
  .literal("public")
  .describe("The public blog repository only accepts public posts.");

const dateFieldSchema = z.preprocess((value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const iso = value.toISOString();
    if (iso.endsWith("T00:00:00.000Z")) {
      return iso.slice(0, 10);
    }
    return iso;
  }

  return value;
}, z.string().datetime({ offset: true }).or(z.string().date()));

export const frontmatterSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase alphanumeric with hyphens"
    ),
  summary: z.string().min(1).max(500),
  published_at: dateFieldSchema,
  updated_at: dateFieldSchema.optional(),
  tags: z
    .array(z.string().min(1).max(50))
    .min(1, "At least one tag is required"),
  visibility: visibilitySchema,
  cover_image: z.string().optional(),
  draft: z.boolean().optional().default(false),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;

export function validateFrontmatter(
  raw: unknown,
  filePath: string
): { data: Frontmatter; errors: string[] } {
  const result = frontmatterSchema.safeParse(raw);

  if (result.success) {
    return { data: result.data, errors: [] };
  }

  const errors = result.error.issues.map(
    (issue) => `${filePath}: ${issue.path.join(".")} — ${issue.message}`
  );

  return { data: raw as Frontmatter, errors };
}

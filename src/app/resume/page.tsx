import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { MdxContent } from "@/lib/content/mdx";
import { ResumeView } from "./resume-view";

const RESUME_DIR = path.join(process.cwd(), "content", "resume");

interface ResumeFrontmatter {
  name: string;
  title: string;
  location?: string;
}

async function loadResume(locale: "en" | "zh") {
  const filePath = path.join(RESUME_DIR, `${locale}.mdx`);
  const raw = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    frontmatter: data as ResumeFrontmatter,
    content,
  };
}

export async function generateMetadata() {
  const { frontmatter } = await loadResume("en");
  return {
    title: `Resume — ${frontmatter.name}`,
    description: frontmatter.title,
  };
}

export default async function ResumePage() {
  const [enResume, zhResume] = await Promise.all([
    loadResume("en"),
    loadResume("zh"),
  ]);

  return (
    <ResumeView
      enResume={<MdxContent source={enResume.content} />}
      zhResume={<MdxContent source={zhResume.content} />}
    />
  );
}

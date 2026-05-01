import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { MdxContent } from "@/lib/content/mdx";
import { AboutView } from "./about-view";

const CONTENT_DIR = path.join(process.cwd(), "content", "resume");

interface AboutFrontmatter {
  name: string;
  title: string;
  location?: string;
}

async function loadContent(locale: "en" | "zh") {
  const filePath = path.join(CONTENT_DIR, `${locale}.mdx`);
  const raw = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    frontmatter: data as AboutFrontmatter,
    content,
  };
}

export async function generateMetadata() {
  const { frontmatter } = await loadContent("en");
  return {
    title: `About Me — ${frontmatter.name}`,
    description: frontmatter.title,
  };
}

export default async function AboutPage() {
  const [enContent, zhContent] = await Promise.all([
    loadContent("en"),
    loadContent("zh"),
  ]);

  return (
    <AboutView
      enContent={<MdxContent source={enContent.content} />}
      zhContent={<MdxContent source={zhContent.content} />}
    />
  );
}

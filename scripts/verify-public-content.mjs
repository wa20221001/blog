import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "content", "posts");
const protectedMarkers = [
  "visibility: authenticated",
  "visibility: \"authenticated\"",
  "visibility: role:admin",
  "visibility: \"role:admin\"",
  "members-only-demo",
  "admin-only-demo",
];

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

if (!fs.existsSync(postsDir)) {
  fail("Missing content/posts directory.");
} else {
  for (const entry of fs.readdirSync(postsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const filePath = path.join(postsDir, entry.name, "index.mdx");
    if (!fs.existsSync(filePath)) {
      fail(`Missing post file: ${filePath}`);
      continue;
    }

    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = matter(raw);
    if (parsed.data.visibility !== "public") {
      fail(`${entry.name} is not public. Public blog builds must contain only visibility: public posts.`);
    }

    for (const marker of protectedMarkers) {
      if (raw.includes(marker)) {
        fail(`${entry.name} contains protected-content marker: ${marker}`);
      }
    }
  }
}

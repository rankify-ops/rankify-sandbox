import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingMinutes: number;
  tags: string[];
  /** Optional `faqs:` frontmatter list of { q, a }; rendered visibly with FAQPage schema. */
  faqs: { q: string; a: string }[];
};

function readPost(file: string) {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);
  // Every image in a post needs alt text: fail the build rather than ship one without.
  if (/!\[\s*\]\(/.test(content) || /<img(?![^>]*\balt=["'][^"']+["'])[^>]*>/i.test(content)) {
    throw new Error(`${file}: every image needs descriptive alt text`);
  }
  const meta: PostMeta = {
    slug: file.replace(/\.mdx$/, ""),
    title: String(data.title),
    description: String(data.description ?? ""),
    date: String(data.date),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    faqs: Array.isArray(data.faqs)
      ? data.faqs.filter((f: { q?: unknown; a?: unknown }) => f?.q && f?.a).map((f: { q: unknown; a: unknown }) => ({ q: String(f.q), a: String(f.a) }))
      : [],
    readingMinutes: Math.max(1, Math.round(content.split(/\s+/).length / 220)),
  };
  return { meta, content };
}

export function getAllPosts(): PostMeta[] {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => readPost(f).meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const file = `${slug}.mdx`;
  if (!fs.existsSync(path.join(DIR, file))) return null;
  return readPost(file);
}

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}

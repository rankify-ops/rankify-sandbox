import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { models } from "@/lib/models";

const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/quote", "/models", "/rebates", "/about", "/blog", "/privacy"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}` })),
    ...models.map((m) => ({ url: `${base}/models/${m.slug}` })),
    ...getAllPosts().map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.date })),
  ];
}

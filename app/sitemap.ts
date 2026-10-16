import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { models } from "@/lib/models";
import { cities, cityPath } from "@/lib/cities";
import { siteUrl } from "@/lib/seo";

// The thank-you page is deliberately left out: it's only reached after a form submit.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/quote", priority: 0.9, changeFrequency: "monthly" },
    { path: "/models", priority: 0.9, changeFrequency: "weekly" },
    { path: "/rebates", priority: 0.8, changeFrequency: "weekly" },
    { path: "/best-heat-pump-hot-water-systems", priority: 0.9, changeFrequency: "monthly" },
    { path: "/compare", priority: 0.9, changeFrequency: "monthly" },
    { path: "/hot-water-broken", priority: 0.9, changeFrequency: "monthly" },
    { path: "/heat-pump-hot-water", priority: 0.8, changeFrequency: "monthly" },
    { path: "/how-it-works", priority: 0.6, changeFrequency: "monthly" },
    { path: "/about", priority: 0.5, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  ];
  return [
    ...pages.map((p) => ({ url: `${siteUrl}${p.path}`, priority: p.priority, changeFrequency: p.changeFrequency })),
    ...models.map((m) => ({ url: `${siteUrl}/models/${m.slug}`, priority: 0.8, changeFrequency: "weekly" as const })),
    ...cities.map((c) => ({ url: `${siteUrl}${cityPath(c)}`, priority: 0.8, changeFrequency: "monthly" as const })),
    ...getAllPosts().map((p) => ({ url: `${siteUrl}/blog/${p.slug}`, lastModified: p.date, priority: 0.6, changeFrequency: "monthly" as const })),
  ];
}

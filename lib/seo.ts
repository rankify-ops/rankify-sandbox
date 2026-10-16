import type { Metadata } from "next";

/** Absolute site URL: set SITE_URL at launch; falls back to the Vercel deployment URL, then localhost. */
export const siteUrl =
  process.env.SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

/** Per-page title, description, canonical and Open Graph/Twitter tags. */
export function pageMeta({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type },
    twitter: { card: "summary_large_image", title, description },
  };
}

import type { MetadataRoute } from "next";

// Preview-only: block all crawlers. Switch to an allow rule + sitemap at launch.
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}

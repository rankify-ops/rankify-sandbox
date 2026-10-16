import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

// Preview-only: block all crawlers (pages also send noindex). At launch, switch to
// `allow: "/"` and remove the noindex header in next.config.ts and robots in app/layout.tsx.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

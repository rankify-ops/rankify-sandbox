import type { NextConfig } from "next";
import { legacyModelSlugs } from "./lib/models";

const nextConfig: NextConfig = {
  // The placeholder catalogue used different URLs; keep old links working.
  async redirects() {
    return Object.entries(legacyModelSlugs).map(([from, to]) => ({
      source: `/models/${from}`,
      destination: `/models/${to}`,
      permanent: true,
    }));
  },
  // Preview-only site: tell crawlers not to index anything until we launch on a real domain.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;

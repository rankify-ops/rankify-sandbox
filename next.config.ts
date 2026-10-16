import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

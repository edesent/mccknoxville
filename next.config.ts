import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // The parent CRM folder has its own lockfile; pin the root so Turbopack
  // does not pick the wrong one.
  turbopack: {
    root: path.resolve(__dirname),
  },
  // /edit is the home page with the editor on; keep it out of search.
  async headers() {
    return [{ source: "/edit", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;

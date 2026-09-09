import type { NextConfig } from "next";
import path from "node:path";
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  // The docs snapshot under public/docs is plain HTML; keep /docs/ and folder URLs working.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      { source: "/docs", destination: "/docs/index.html" },
      { source: "/docs/", destination: "/docs/index.html" },
      { source: "/docs/:path*/", destination: "/docs/:path*/index.html" },
    ];
  },
  async redirects() {
    return [
      { source: "/sources.html", destination: "/sources", permanent: true },
      { source: "/zh/sources.html", destination: "/zh/sources", permanent: true },
    ];
  },
};
export default nextConfig;

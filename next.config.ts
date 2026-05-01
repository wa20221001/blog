import type { NextConfig } from "next";

const repoBasePath = "/blog";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: repoBasePath,
  assetPrefix: `${repoBasePath}/`,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

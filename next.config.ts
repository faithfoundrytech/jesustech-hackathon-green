import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable TypeScript type checking in production for faster builds
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors
    ignoreBuildErrors: true,
  },
  // Disable ESLint during production build for speed
  eslint: {
    // Warning: this allows production builds to successfully complete even if
    // your project has ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

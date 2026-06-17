/**
 * Next.js application configuration.
 * This file exists to centralize framework-level behavior for the App Router project.
 * It is read by the Next.js runtime and can later coordinate with src/app and build tooling.
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;

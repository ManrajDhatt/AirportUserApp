import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix for missing static assets
  assetPrefix: process.env.NODE_ENV === "production" ? "/_next/" : "",

  webpack: (config) => {
    config.output.clean = true; // Ensures stale chunks are cleaned up
    return config;
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "www.chefadora.com" },
      { protocol: "https", hostname: "www.imagineonline.store" },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optional: if you host under a subpath, otherwise usually empty
  assetPrefix: process.env.NODE_ENV === "production" ? "/_next/" : "",

  output: 'standalone', // helps Vercel optimize the build

  webpack: (config) => {
    config.output.clean = true; // clean old chunks
    return config;
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "static.zara.net" },
      { protocol: "https", hostname: "www.chefadora.com" },
      { protocol: "https", hostname: "www.imagineonline.store" },
    ],
  },
};

export default nextConfig;

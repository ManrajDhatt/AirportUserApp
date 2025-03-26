import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
    webpack: (config: { output: { clean: boolean; }; }) => {
      config.output.clean = true; // Ensures stale chunks are cleaned up
      return config;
    },
  
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Add other image hosts you use here
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: "www.chefadora.com",
      },
      {
        protocol: 'https',
        hostname: 'www.imagineonline.store',
      },
    ],
  },
};

export default nextConfig;

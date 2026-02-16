import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.ophim1.com',
      },
      {
        protocol: 'https',
        hostname: 'img.ophim18.cc', 
      },
      {
        protocol: 'https',
        hostname: '*.ophim1.com', 
      },
      {
         protocol: 'https',
         hostname: '*.ophim18.cc',
      },
      {
        protocol: 'https',
        hostname: '*.ophim.live',
      }
    ],
  },
};

export default nextConfig;

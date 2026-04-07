import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jjlnhkutzzpcmhmrxpcy.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      }
    ],
  },
  // Allows ngrok URLs to bypass the Next.js dev server cross-origin block
  allowedDevOrigins: [
    'localhost:3000',
    '*.ngrok-free.app',
    '*.ngrok.app',
    '*.ngrok-free.dev',
    '*.ngrok.io'
  ],
};

export default nextConfig;

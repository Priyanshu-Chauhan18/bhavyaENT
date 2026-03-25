import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
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

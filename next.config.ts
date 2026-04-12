import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  sassOptions: {
    // Allow all SCSS files to @use variables without relative paths
    includePaths: ['./styles'],
  },
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;

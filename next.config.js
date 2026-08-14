/*
 * Next.js configuration optimized for luxury e-commerce experience
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' }
    ],
  },
  poweredByHeader: false,
};

module.exports = nextConfig;
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This is required for standalone output
    outputStandalone: true,
  },
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Configure image domains if needed
  images: {
    domains: ['localhost'],
  },
  
  // Environment variables that should be available at build time
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Webpack configuration for Prisma in Docker
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@prisma/client');
    }
    return config;
  },
  
  // Add any additional configuration here
  poweredByHeader: false,
  
  // Configure redirects if needed
  async redirects() {
    return [];
  },
  
  // Configure headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

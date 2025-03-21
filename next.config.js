/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['pbs.twimg.com', 'api.twitter.com', 'abs.twimg.com'],
  },
  // Enable experimental features for Twitter/X API integration
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001']
    },
  }
};

module.exports = nextConfig; 
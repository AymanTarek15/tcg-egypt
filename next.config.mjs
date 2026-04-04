/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Allow your local IP to connect for Hot Reloading
  allowedDevOrigins: ['192.168.1.3', 'localhost:3000'],
  
  // 2. Tell Next.js you acknowledge you're using Turbopack 
  // (This silences the webpack vs turbopack error)
  experimental: {
    turbo: {
      // If you had specific webpack aliases, they'd go here
    },
  },
};

export default nextConfig;
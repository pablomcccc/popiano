/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['your-s3-bucket.amazonaws.com'],
  },
  experimental: {
    serverActions: true,
  },
}

export default nextConfig

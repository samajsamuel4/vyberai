/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // identity.ts imports ./identity.dev.js (TS ESM); resolve to .ts for webpack
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js'],
    }
    return config
  },
}

export default nextConfig

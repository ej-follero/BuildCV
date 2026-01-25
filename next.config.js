/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  webpack: (config) => {
    // Fix for pdfjs worker
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist/legacy/build/pdf.worker.js': 'pdfjs-dist/build/pdf.worker.js',
    };
    return config;
  },
}

module.exports = nextConfig

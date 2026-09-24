import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  eslint: {
    // Lint via `npm run lint` — keeps redeploy builds fast (webpack/turbo cache reuse).
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
    webpackBuildWorker: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'telebots.site',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    /** Browser + CDN cache for `/_next/image` (seconds). */
    minimumCacheTTL: 31536000,
  },
  async headers() {
    const longImageCache = [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, stale-while-revalidate=86400, immutable",
      },
    ];

    return [
      {
        source: "/uploads/:path*",
        headers: longImageCache,
      },
      {
        source: "/materials/:path*",
        headers: longImageCache,
      },
      {
        source: "/api/static/:path*",
        headers: longImageCache,
      },
      {
        source: "/_next/image",
        headers: longImageCache,
      },
      {
        source: "/:path*\\.(jpg|jpeg|png|gif|webp|avif|svg|ico)",
        headers: longImageCache,
      },
      {
        source: '/api/payment-webhook',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

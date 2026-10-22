import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 1,
  },
  async rewrites() {
    const internalApi = process.env.INTERNAL_API_URL || "http://127.0.0.1:5000";
    return [
      {
        source: "/api/:path*",
        destination: `${internalApi}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${internalApi}/uploads/:path*`,
      },
    ];
  },
  images: {
    unoptimized: true,
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.fitalenta.co.id",
      },
      {
        protocol: "https",
        hostname: "fitalenta.co.id",
      },
      {
        protocol: "https",
        hostname: "api.fitalenta.co.id",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
  },
};

export default nextConfig;

import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // experimental: {
  //   turbo: {},
  // },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent fs from being bundled into client code
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "plus.unsplash.com",
      //   pathname: "/**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "images.unsplash.com",
      //   pathname: "/**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "source.unsplash.com",
      //   pathname: "/**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "i.pinimg.com",
      //   pathname: "/**",
      // },
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

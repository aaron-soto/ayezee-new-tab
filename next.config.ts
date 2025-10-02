import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    domains: ["cdn.weatherapi.com"],
  },
};

export default nextConfig;

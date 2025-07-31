import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "leikapui.b-cdn.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

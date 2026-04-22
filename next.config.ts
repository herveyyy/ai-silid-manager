import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    cacheComponents: true,
    allowedDevOrigins: ["10.5.50.4", "10.5.50.113"],
};

export default nextConfig;

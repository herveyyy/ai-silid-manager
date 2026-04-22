import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    cacheComponents: true,
    allowedDevOrigins: ["10.5.50.4"],
    serverExternalPackages: ["mysql2"],
};

export default nextConfig;

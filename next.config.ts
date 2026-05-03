import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.replit.dev",
    "*.repl.co",
    "*.riker.replit.dev",
    "*.kirk.replit.dev",
    "*.picard.replit.dev",
    "*.janeway.replit.dev",
    "*.sisko.replit.dev",
  ],
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No webpack/turbopack WASM config needed — harper.js loads its WASM binary
  // via URL (fetch), not via module import, so no bundler config is required.
};

export default nextConfig;

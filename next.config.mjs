import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import("next").NextConfig} */
const nextConfig = {
  turbopack: {
    // Turbopack이 workspace root를 src/app로 착각하는 걸 강제로 막음
    root: __dirname,
  },

  webpack(config) {
    // webpack 모드에서도 @ alias 확실히
    config.resolve.alias["@"] = path.join(__dirname, "src");
    return config;
  },
};

export default nextConfig;

import path from "node:path";

/** @type {import("next").NextConfig} */
const nextConfig = {
  turbopack: {
    // 프로젝트 루트 강제 고정
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;

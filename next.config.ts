import type { NextConfig } from "next";

/** Set by `npm run build:webpack:shared` — shared hosts often hit EAGAIN on pthread_create. */
const lowCpuBuild = process.env.NEXT_BUILD_LOW_CPU === "1";

const nextConfig: NextConfig = {
  experimental: lowCpuBuild
    ? {
        cpus: 1,
        staticGenerationMaxConcurrency: 1,
      }
    : undefined,
};

export default nextConfig;

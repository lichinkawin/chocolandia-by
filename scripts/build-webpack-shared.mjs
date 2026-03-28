/**
 * Shared hosting: limit Rust (Rayon) + Next static workers + libuv pool — avoids
 * pthread_create / uv_thread_create EAGAIN on low nproc / thread limits.
 */
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import process from "node:process";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");

process.env.NEXT_BUILD_LOW_CPU = "1";
if (!process.env.RAYON_NUM_THREADS) {
  process.env.RAYON_NUM_THREADS = "1";
}
if (!process.env.UV_THREADPOOL_SIZE) {
  process.env.UV_THREADPOOL_SIZE = "2";
}

const r = spawnSync(process.execPath, [nextBin, "build", "--webpack"], {
  stdio: "inherit",
  env: process.env,
  cwd: process.cwd(),
});

process.exit(r.status ?? 1);

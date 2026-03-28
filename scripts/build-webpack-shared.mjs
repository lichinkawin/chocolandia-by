/**
 * Shared hosting: limit Rayon (Rust) thread pool so build does not hit nproc / EAGAIN.
 */
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import process from "node:process";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");

if (!process.env.RAYON_NUM_THREADS) {
  process.env.RAYON_NUM_THREADS = "1";
}

const r = spawnSync(process.execPath, [nextBin, "build", "--webpack"], {
  stdio: "inherit",
  env: process.env,
  cwd: process.cwd(),
});

process.exit(r.status ?? 1);

// Build the minimal public directory shared by static hosting providers.
// Personal notes, repository metadata, tests, and tooling are intentionally
// excluded from the generated _site directory.

import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "_site");

if (OUT !== join(ROOT, "_site")) {
  throw new Error(`Refusing to clean unexpected output path: ${OUT}`);
}

const publicFiles = [
  "index.html",
  "an-uong.html",
  "phong-cuoi.html",
  "nhan-cuoi.html",
  "thiep-cuoi.html",
  "robots.txt",
];

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

for (const file of publicFiles) {
  await cp(join(ROOT, file), join(OUT, file));
}

await cp(join(ROOT, "assets"), join(OUT, "assets"), { recursive: true });
await cp(join(ROOT, "cloudflare", "_headers"), join(OUT, "_headers"));

console.log(`Prepared ${OUT}`);

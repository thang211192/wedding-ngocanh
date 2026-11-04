// Build the minimal public directory shared by static hosting providers.
// Personal notes, repository metadata, tests, and tooling are intentionally
// excluded from the generated _site directory.

import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "_site");

if (OUT !== join(ROOT, "_site")) {
  throw new Error(`Refusing to clean unexpected output path: ${OUT}`);
}

// Every root-level HTML file is a public page. Keeping this automatic prevents
// newly added pages from being omitted from Cloudflare's _site deployment.
// HTML files below docs/ or any other subdirectory remain private.
const publicFiles = (await readdir(ROOT, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
  .map((entry) => entry.name)
  .sort();
publicFiles.push("robots.txt");

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

for (const file of publicFiles) {
  await cp(join(ROOT, file), join(OUT, file));
}

await cp(join(ROOT, "assets"), join(OUT, "assets"), { recursive: true });
await cp(join(ROOT, "cloudflare", "_headers"), join(OUT, "_headers"));

console.log(`Prepared ${OUT}`);

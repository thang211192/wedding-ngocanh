// Server tĩnh tối giản cho test. Không dùng file:// vì Chromium coi mỗi file
// là một origin mờ, localStorage trở nên không đáng tin — mà chỗ lưu "Muốn đi"
// lại chính là thứ cần kiểm.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, normalize, extname } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".jpg": "image/jpeg",
};

/** Mở server trên cổng ngẫu nhiên, trả về { origin, close }. */
export async function startServer() {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    // Chặn đi ngược ra ngoài thư mục repo.
    const rel = normalize(path).replace(/^([/\\])+/, "");
    const file = join(ROOT, rel === "" ? "index.html" : rel);
    if (!file.startsWith(ROOT)) {
      res.writeHead(403).end("forbidden");
      return;
    }
    try {
      const body = await readFile(file);
      res.writeHead(200, {
        "content-type": TYPES[extname(file)] ?? "application/octet-stream",
      }).end(body);
    } catch {
      res.writeHead(404).end("not found");
    }
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();

  return {
    origin: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

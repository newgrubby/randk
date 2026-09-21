/** Локальный preview содержимого out/. Production этот Node-сервер не использует. */

import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { root } from './lib/redirect-rules.mjs';

const outDir = join(root, 'out');
const port = Number(process.argv[2] ?? 4173);
const mime = new Map([
  ['.avif', 'image/avif'],
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webmanifest', 'application/manifest+json'],
  ['.webp', 'image/webp'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

async function existingFile(path) {
  try {
    return (await stat(path)).isFile() ? path : null;
  } catch {
    return null;
  }
}

await access(outDir);

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
  const safePath = normalize(pathname).replace(/^(?:\.\.(?:[/\\]|$))+/, '');
  const requested = join(outDir, safePath);
  const file =
    (await existingFile(requested)) ??
    (await existingFile(join(requested, 'index.html'))) ??
    (await existingFile(join(outDir, '404.html')));
  const status = file === join(outDir, '404.html') ? 404 : 200;

  response.writeHead(status, {
    'Content-Type': mime.get(extname(file ?? '')) ?? 'application/octet-stream',
  });
  if (request.method === 'HEAD') response.end();
  else createReadStream(file).pipe(response);
}).listen(port, '127.0.0.1', () => {
  console.log(`Static export: http://127.0.0.1:${port}`);
});

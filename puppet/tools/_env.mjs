// 各个小工具共用：puppet 目录在哪、本地服务器以哪里为根、playwright 从哪取、页面路径怎么变成网址。
// 页面路径一律写「相对 puppet 目录」的（比如 qa/demo.html?render=1；放在大仓库里时也可以写 ../ 开头、指向仓库里别处的页面）。
// 服务根：单独拷出去运行时就是 puppet 目录；还放在大仓库里时用仓库根（页面要引用仓库里别的目录）。可用环境变量 PUPPET_SERVE_ROOT 指定。
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export const PUPPET = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ROOT = process.env.PUPPET_SERVE_ROOT ? path.resolve(process.env.PUPPET_SERVE_ROOT) : existsSync(path.resolve(PUPPET, '../tools/render/render.mjs')) ? path.resolve(PUPPET, '..') : PUPPET;
// playwright：先找 puppet 自己装的，再找大仓库里的
function findPlaywright() {
  for (const base of [PUPPET + '/', ROOT + '/', path.join(ROOT, 'tools/render/')]) { try { return createRequire(base)('playwright'); } catch {} }
  throw new Error('找不到 playwright：在 puppet 目录里运行 npm install');
}
export const { chromium } = findPlaywright();
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' };
export const missing = [];          // 服务器答了 404 的路径（干净环境测试用）
export async function serve() {
  const server = createServer(async (req, res) => { try { const p = path.normalize(path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname))); if (!p.startsWith(ROOT)) throw 0; const b = await readFile(p); res.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' }); res.end(b); } catch { missing.push(req.url); res.writeHead(404); res.end(); } });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  return server;
}
/** 相对 puppet 目录的页面路径（可带 ?查询）→ 这台服务器上的网址 */
export function urlFor(server, page) {
  const [file, query = ''] = page.split('?'), abs = path.resolve(PUPPET, file);
  if (!abs.startsWith(ROOT)) throw new Error(`页面在服务根之外：${page}（服务根 ${ROOT}）`);
  return `http://127.0.0.1:${server.address().port}/${path.relative(ROOT, abs).split(path.sep).join('/')}${query ? '?' + query : ''}`;
}

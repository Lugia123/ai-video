// 抽帧自查：node tools/render/snap.mjs <集目录> <输出目录> <秒> [秒 ...]
// 以 ?render=1 打开页面，seek 到各时刻，存 1920×1080 PNG（t-<秒>.png），并把 window.__debug 存成 debug.json。
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const [dir, outDir, ...ts] = process.argv.slice(2);
if (!dir || !outDir || !ts.length) { console.error('用法：node tools/render/snap.mjs <集目录> <输出目录> <秒> [秒 ...]'); process.exit(1); }
const root = process.cwd();
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(p)] ?? 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const port = server.address().port;
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', e => { console.error('页面错误：', e.message); process.exitCode = 1; });
await page.goto(`http://localhost:${port}/${path.relative(root, dir)}/index.html?render=1`);
await page.waitForFunction(() => window.__video, null, { timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
fs.writeFileSync(path.join(outDir, 'debug.json'), JSON.stringify(await page.evaluate(() => { const d = { ...window.__debug }; delete d.kw; return d; }), null, 1));
for (const t of ts) {
  await page.evaluate(t => window.__video.seek(t), Number(t));
  await page.locator('canvas').screenshot({ path: path.join(outDir, `t-${Number(t).toFixed(1)}.png`) });
}
await browser.close(); server.close();

#!/usr/bin/env node
// 总装接缝自查：打开 index.html?render=1，每个接缝前后各 1 s 逐帧（30 fps）截图，
//   · 算每帧亮度 / 与上一帧的差 → 报黑帧、重复帧（和上一帧逐像素几乎一样）、跳变；
//   · 每个接缝抽 9 帧（−1, −0.5, −0.2, −2f, −1f, 0, +1f, +0.2, +0.5, +1 s）拼一行 → out/seams.jpg。
//   node episodes/mv-pdoom/shots/index-seams.mjs [--gpu]
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { spawnSync } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const EP = path.resolve(HERE, '..'), ROOT = path.resolve(EP, '../..');
const gpu = process.argv.includes('--gpu');
const SEAMS = [22.1, 38.4, 58.4, 74.8, 94.8, 109.3, 123.9];
const FPS = 30;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf', '.png': 'image/png', '.mp3': 'audio/mpeg', '.glb': 'model/gltf-binary' };
const server = createServer(async (req, res) => {
  try { const p = path.normalize(path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname))); if (!p.startsWith(ROOT)) throw 0; const b = await readFile(p); res.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' }); res.end(b); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--disable-lcd-text', '--force-color-profile=srgb', '--hide-scrollbars',
  ...(gpu ? ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--disable-accelerated-2d-canvas'] : [])] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() !== 'log' && !m.text().includes('GL Driver')) console.error('[page]', m.text().slice(0, 300)); });
await page.goto(`http://127.0.0.1:${server.address().port}/episodes/mv-pdoom/index.html?render=1`);
await page.waitForFunction(() => window.__video, null, { timeout: 180000 });
console.log(JSON.stringify(await page.evaluate(() => window.__segments)));

const tmp = path.join(EP, 'out', 'seams-frames');
await rm(tmp, { recursive: true, force: true }); await mkdir(tmp, { recursive: true });
const report = [];
const pick = [-30, -15, -6, -2, -1, 0, 1, 6, 15, 30];
for (const s of SEAMS) {
  const f0 = Math.round(s * FPS);
  const dir = path.join(tmp, `s${s}`); await mkdir(dir, { recursive: true });
  for (let f = -30; f <= 30; f++) {
    await page.evaluate(t => window.__video.seek(t), (f0 + f) / FPS);
    await page.screenshot({ path: path.join(dir, `f${String(f + 30).padStart(3, '0')}.png`) });
  }
  // 逐帧度量：灰度 96×54
  const raw = spawnSync('ffmpeg', ['-loglevel', 'error', '-i', path.join(dir, 'f%03d.png'), '-vf', 'scale=96:54,format=gray', '-f', 'rawvideo', '-'], { maxBuffer: 1 << 28 }).stdout;
  const n = 96 * 54, F = [];
  for (let i = 0; i < raw.length; i += n) F.push(raw.subarray(i, i + n));
  const lum = F.map(f => f.reduce((a, v) => a + v, 0) / n);
  const diff = F.map((f, i) => (i ? f.reduce((a, v, k) => a + Math.abs(v - F[i - 1][k]), 0) / n : 0));
  const rec = { seam: s, black: [], dup: [], jumps: [] };
  lum.forEach((l, i) => { if (l < 6) rec.black.push(i - 30); });
  diff.forEach((d, i) => { if (i && d < 0.05) rec.dup.push(i - 30); if (d > 30) rec.jumps.push([i - 30, +d.toFixed(0)]); });
  report.push(rec);
  console.log(`seam ${s}: 黑帧 ${JSON.stringify(rec.black)} 重复帧 ${JSON.stringify(rec.dup)} 跳变 ${JSON.stringify(rec.jumps)}`);
}
await browser.close(); server.close();
if (errors.length) console.error('页面错误：', errors);
// 拼图：每个接缝一行 10 帧
const inputs = [], filters = [];
let k = 0;
for (const s of SEAMS) for (const f of pick) { inputs.push('-i', path.join(tmp, `s${s}`, `f${String(f + 30).padStart(3, '0')}.png`)); filters.push(`[${k++}]scale=320:180[v${k}]`); }
const rows = SEAMS.map((_, r) => `${pick.map((__, c) => `[v${r * pick.length + c + 1}]`).join('')}hstack=inputs=${pick.length}[r${r}]`);
const graph = [...filters, ...rows, `${SEAMS.map((_, r) => `[r${r}]`).join('')}vstack=inputs=${SEAMS.length}`].join(';');
spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', graph, '-frames:v', '1', '-q:v', '3', path.join(EP, 'out', 'seams.jpg')], { stdio: 'inherit' });
await writeFile(path.join(EP, 'out', 'seams.json'), JSON.stringify(report, null, 1));
await rm(tmp, { recursive: true, force: true });
console.log('→ out/seams.jpg（每行一个接缝：−1s −0.5 −0.2 −2f −1f 0 +1f +0.2 +0.5 +1s）');

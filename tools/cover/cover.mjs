#!/usr/bin/env node
// 封面导出：打开 <dir>/cover/cover.html?ratio=4x3 / 16x9 / 9x16，等 window.__coverReady，截 canvas 存 PNG，
// 再用 ffmpeg 缩出手机缩略图，方便肉眼确认标题在小图上能读。
// 平台要求封面 ≤ 2MB：超过 MAX_BYTES 的 PNG 用 ffmpeg 调色板量化（256 色 + 误差扩散，PSNR ≈ 45 dB，肉眼无差）。
//
//   node tools/cover/cover.mjs episodes/epNN-slug
//
// 产物（<dir>/cover/）：
//   cover-4x3.png   1440×1080      thumb-4x3-320.png   320 宽
//   cover-16x9.png  1920×1080      thumb-16x9-320.png  320 宽
//   cover-9x16.png  1080×1920      thumb-9x16-270.png  270 宽

import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, stat, rename } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf' };
const RATIOS = [
  { ratio: '4x3', width: 1440, height: 1080, thumb: 320 },
  { ratio: '16x9', width: 1920, height: 1080, thumb: 320 },
  { ratio: '9x16', width: 1080, height: 1920, thumb: 270 },
];

const MAX_BYTES = 2_000_000;

const dir = process.argv[2];
if (!dir) { console.log('用法：node tools/cover/cover.mjs <episodes/epNN-slug>'); process.exit(1); }
const coverDir = path.resolve(dir, 'cover');
const rel = path.relative(ROOT, coverDir).split(path.sep).join('/');

const server = createServer(async (req, res) => {
  try {
    const p = path.normalize(path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
    if (!p.startsWith(ROOT)) throw new Error('outside root');
    const body = await readFile(p);
    res.writeHead(200, { 'content-type': MIME[path.extname(p).toLowerCase()] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--force-color-profile=srgb'] });
try {
  for (const { ratio, width, height, thumb } of RATIOS) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(`${base}/${rel}/cover.html?ratio=${ratio}`);
    await page.waitForFunction(() => window.__coverReady === true, null, { timeout: 30000 }).catch(() => {
      throw new Error(`cover.html?ratio=${ratio} 没有就绪：${errors.join(' | ') || '超时'}`);
    });
    const info = await page.evaluate(() => window.__coverInfo ?? null);
    if (info) console.log(`  ${ratio}: ${JSON.stringify(info)}`);
    const out = path.join(coverDir, `cover-${ratio}.png`);
    await page.locator('canvas').screenshot({ path: out });
    if ((await stat(out)).size > MAX_BYTES) {
      const tmp = out.replace(/\.png$/, '.q.png');
      const q = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', out, '-vf', 'split[a][b];[a]palettegen=max_colors=256:stats_mode=full[p];[b][p]paletteuse=dither=sierra2_4a', tmp]);
      if (q.status !== 0) throw new Error(`ffmpeg 压缩失败：${q.stderr}`);
      await rename(tmp, out);
      const size = (await stat(out)).size;
      if (size > MAX_BYTES) throw new Error(`${path.relative(ROOT, out)} 压缩后仍有 ${size} 字节，超过 2MB`);
    }
    const th = path.join(coverDir, `thumb-${ratio}-${thumb}.png`);
    const r = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', out, '-vf', `scale=${thumb}:-1:flags=lanczos`, th]);
    if (r.status !== 0) throw new Error(`ffmpeg 缩略图失败：${r.stderr}`);
    console.log(`${ratio}: ${path.relative(ROOT, out)}（${width}×${height}，${((await stat(out)).size / 1e6).toFixed(2)} MB） + ${path.relative(ROOT, th)}`);
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}

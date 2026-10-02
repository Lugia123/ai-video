// #1074：按 final 的帧号重渲尾声的若干帧（1920×1080）。在仓库根目录跑：node episodes/mv-pdoom/fresh/v4-rest/c4/fix1074/render-frames.mjs <输出目录> <起始帧> <结束帧>
// final 第 n 帧 = c4-v4.mp4 第 n − 3716 帧 = 页面 seek((n − 3716) / 30)（c4 从 123.868 s 起，合进 final 时放在第 3716 帧）
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const ROOT = '/Users/lugia/lugia_fc/ai_video', OUT = process.argv[2], A = Number(process.argv[3]), B = Number(process.argv[4]), F0 = 3716;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const srv = createServer(async (q, r) => { try { const p = path.join(ROOT, decodeURIComponent(new URL(q.url, 'http://x').pathname)); const b = await readFile(p); r.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' }); r.end(b); } catch { r.writeHead(404); r.end(); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const br = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const pg = await br.newPage({ viewport: { width: 1920, height: 1080 } });
pg.on('pageerror', e => console.error('ERR', e.message));
await pg.goto(`http://127.0.0.1:${srv.address().port}/episodes/mv-pdoom/c4-v4.html?render=1`);
await pg.waitForFunction(() => window.__video, null, { timeout: 180000 });
for (let n = A; n <= B; n++) { await pg.evaluate(t => window.__video.seek(t), (n - F0) / 30); await pg.locator('canvas').first().screenshot({ path: `${OUT}/f${n}.png` }); }
console.log('done', A, B);
await br.close(); srv.close();

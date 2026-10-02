// 打开 index.html?render=1，打印切点、错误，按给定歌曲时间截图到 scratchpad
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const ROOT = '/Users/lugia/lugia_fc/ai_video', OUT = process.argv[2], ts = process.argv.slice(3).map(Number);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf', '.glb': 'model/gltf-binary', '.png': 'image/png', '.mp3': 'audio/mpeg' };
const srv = createServer(async (q, r) => { try { const p = path.join(ROOT, decodeURIComponent(new URL(q.url, 'http://x').pathname)); const b = await readFile(p); r.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' }); r.end(b); } catch { r.writeHead(404); r.end(); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const br = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const pg = await br.newPage({ viewport: { width: 1920, height: 1080 } });
pg.on('pageerror', e => console.error('ERR', e.message));
pg.on('console', m => { if (!m.text().includes('GL Driver')) console.log('[page]', m.text().slice(0, 300)); });
await pg.goto(`http://127.0.0.1:${srv.address().port}/episodes/mv-pdoom/index.html?render=1`);
await pg.waitForFunction(() => window.__video, null, { timeout: 90000 });
console.log(JSON.stringify(await pg.evaluate(() => window.__segments)));
for (const t of ts) {
  const ms = await pg.evaluate(t => { window.__video.seek(t); return window.__stats.last; }, t);
  await pg.screenshot({ path: `${OUT}/t-${t.toFixed(2)}.png` });
  console.log(t, ms.toFixed(0) + 'ms');
}
await br.close(); srv.close();

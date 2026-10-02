// 打开 v4-03.html?render=1，打印 window.__lyricCheck（每个歌词牌开唱时的屏幕框 / 字高），并在每个词开唱时刻截图到 argv[2]
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const ROOT = '/Users/lugia/lugia_fc/ai_video', OUT = process.argv[2];
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json' };
const srv = createServer(async (q, r) => { try { const p = path.join(ROOT, decodeURIComponent(new URL(q.url, 'http://x').pathname)); const b = await readFile(p); r.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' }); r.end(b); } catch { r.writeHead(404); r.end(); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const br = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const pg = await br.newPage({ viewport: { width: 1920, height: 1080 } });
pg.on('pageerror', e => console.error('ERR', e.message));
pg.on('console', m => { if (/歌词|warn/i.test(m.text())) console.log('[page]', m.text()); });
await pg.goto(`http://127.0.0.1:${srv.address().port}/episodes/mv-pdoom/v4-03.html?render=1`);
await pg.waitForFunction(() => window.__video, null, { timeout: 120000 });
const chk = await pg.evaluate(() => window.__lyricCheck);
for (const c of chk) console.log(JSON.stringify(c));
if (OUT) for (const c of chk) {
  await pg.evaluate(t => window.__video.seek(t - 38.4), c.t + 0.05);
  await pg.screenshot({ path: `${OUT}/w-${c.t.toFixed(2)}.png` });
}
await br.close(); srv.close();

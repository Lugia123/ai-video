// 乱序 seek 纯度检查：node seek-md5.mjs <页面相对 episodes/mv-pdoom 的路径> t1 t2 …（t = 页面时间，即 __video.seek 的参数）
// 每个 t：先顺序到 t-0.2 再到 t 截图；再从一个远处时间直接跳到 t 截图；两次 md5 必须一致。
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const ROOT = '/Users/lugia/lugia_fc/ai_video', page = process.argv[2], ts = process.argv.slice(3).map(Number);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf', '.png': 'image/png', '.mp3': 'audio/mpeg' };
const srv = createServer(async (q, r) => { try { const p = path.join(ROOT, decodeURIComponent(new URL(q.url, 'http://x').pathname)); const b = await readFile(p); r.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' }); r.end(b); } catch { r.writeHead(404); r.end(); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const br = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const pg = await br.newPage({ viewport: { width: 1920, height: 1080 } });
pg.on('pageerror', e => console.error('ERR', e.message));
await pg.goto(`http://127.0.0.1:${srv.address().port}/episodes/mv-pdoom/${page}?render=1`);
await pg.waitForFunction(() => window.__video, null, { timeout: 120000 });
const md5 = b => createHash('md5').update(b).digest('hex');
const dur = await pg.evaluate(() => window.__video.duration);
let bad = 0;
for (const t of ts) {
  await pg.evaluate(t => { for (let k = 6; k >= 0; k--) window.__video.seek(Math.max(0, t - k / 30)); }, t);
  const a = md5(await pg.screenshot());
  await pg.evaluate(([t, d]) => { window.__video.seek((t + d / 2) % d); window.__video.seek(t); }, [t, dur]);
  const b = md5(await pg.screenshot());
  console.log(t, a === b ? 'OK' : 'DIFF'); if (a !== b) bad++;
}
console.log(bad ? `不纯：${bad} 处` : '全部一致');
await br.close(); srv.close();

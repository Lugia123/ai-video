// 乱序 seek 纯函数检查：node episodes/mv-pdoom/shots/c4-v4-pure.mjs <歌曲秒> [歌曲秒 ...]（在仓库根目录跑）
// 同一组时刻正着、倒着各 seek 一遍，比较画布截图的 md5。
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
const ROOT = '/Users/lugia/lugia_fc/ai_video', T0 = 123.868, ts = process.argv.slice(2).map(Number);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf', '.glb': 'model/gltf-binary', '.png': 'image/png' };
const srv = createServer(async (q, r) => { try { const p = path.join(ROOT, decodeURIComponent(new URL(q.url, 'http://x').pathname)); const b = await readFile(p); r.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' }); r.end(b); } catch { r.writeHead(404); r.end(); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const br = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--disable-accelerated-2d-canvas'] });
const pg = await br.newPage({ viewport: { width: 960, height: 540 } });
pg.on('pageerror', e => console.error('ERR', e.message));
await pg.goto(`http://127.0.0.1:${srv.address().port}/episodes/mv-pdoom/c4-v4-half.html?render=1`);
await pg.waitForFunction(() => window.__video, null, { timeout: 120000 });
const grab = async t => { await pg.evaluate(t => window.__video.seek(t), t - T0); return createHash('md5').update(await pg.locator('canvas').first().screenshot()).digest('hex'); };
const a = {}, b = {};
for (const t of ts) a[t] = await grab(t);
for (const t of [...ts].reverse()) b[t] = await grab(t);
let bad = 0; for (const t of ts) { const ok = a[t] === b[t]; if (!ok) bad++; console.log(t.toFixed(2), ok ? '一致' : '不一致'); }
console.log(bad ? `${bad} 个时刻不一致` : '全部一致');
await br.close(); srv.close();

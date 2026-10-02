#!/usr/bin/env node
// 总装纯函数检查：每个时刻先 seek 截图，再乱序跳过所有段后回来重截，md5 必须一致（共享 girl / holo 不许带历史）。
//   node episodes/mv-pdoom/shots/index-pure.mjs
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf', '.glb': 'model/gltf-binary', '.png': 'image/png', '.mp3': 'audio/mpeg' };
const srv = createServer(async (q, r) => { try { const p = path.join(ROOT, decodeURIComponent(new URL(q.url, 'http://x').pathname)); const b = await readFile(p); r.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' }); r.end(b); } catch { r.writeHead(404); r.end(); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const br = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const pg = await br.newPage({ viewport: { width: 1920, height: 1080 } });
pg.on('pageerror', e => console.error('ERR', e.message));
await pg.goto(`http://127.0.0.1:${srv.address().port}/episodes/mv-pdoom/index.html?render=1`);
await pg.waitForFunction(() => window.__video, null, { timeout: 180000 });
const md5 = b => createHash('md5').update(b).digest('hex');
const shot = async t => { await pg.evaluate(t => window.__video.seek(t), t); return md5(await pg.screenshot()); };
const T = [14.0, 34.3, 36.0, 41.0, 46.0, 50.5, 55.0, 57.0, 60.5, 76.0, 90.5, 97.0, 116.3, 130.0, 145.0, 152.8, 155.5];
const first = {};
for (const t of T) first[t] = await shot(t);
let bad = 0;
for (const t of [...T].reverse()) { for (const u of T) if (u !== t) await pg.evaluate(u => window.__video.seek(u), u); const h = await shot(t); if (h !== first[t]) { bad++; console.log('不纯', t); } }
console.log(bad ? `失败 ${bad} 处` : `通过（${T.length} 个时刻，乱序跳过全部段后重截一致）`);
await br.close(); srv.close();

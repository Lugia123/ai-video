// 打开 c4-v4-half.html?render=1，按给定歌曲时间截图并拼成一张图：node shots/c4-v4-probe.mjs <输出.jpg 的目录> <歌曲秒> [歌曲秒 ...]
// 打印每帧 seek 耗时和页面报错 / 警告。
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const ROOT = '/Users/lugia/lugia_fc/ai_video', OUT = process.argv[2], ts = process.argv.slice(3).map(Number), T0 = 123.868;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf', '.glb': 'model/gltf-binary', '.png': 'image/png', '.mp3': 'audio/mpeg' };
const srv = createServer(async (q, r) => { try { const p = path.join(ROOT, decodeURIComponent(new URL(q.url, 'http://x').pathname)); const b = await readFile(p); r.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' }); r.end(b); } catch { r.writeHead(404); r.end(); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const br = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const pg = await br.newPage({ viewport: { width: 960, height: 540 } });
pg.on('pageerror', e => console.error('ERR', e.message));
const seen = new Map(); pg.on('console', m => { const s = m.text().slice(0, 200); if (s.includes('GL Driver')) return; seen.set(s, (seen.get(s) || 0) + 1); });
await pg.goto(`http://127.0.0.1:${srv.address().port}/episodes/mv-pdoom/c4-v4-half.html?render=1`);
await pg.waitForFunction(() => window.__video, null, { timeout: 120000 });
const shots = [];
for (const t of ts) {
  const ms = await pg.evaluate(t => { window.__video.seek(t); return window.__stats?.last ?? 0; }, t - T0);
  const buf = await pg.locator('canvas').first().screenshot(); shots.push([t, buf.toString('base64')]);
  console.log(t.toFixed(2), ms.toFixed(0) + 'ms');
}
for (const [s, n] of seen) console.log('[page ×' + n + ']', s);
const cols = Math.min(3, shots.length), pg2 = await br.newPage({ viewport: { width: cols * 960, height: Math.ceil(shots.length / cols) * 540 } });
await pg2.setContent(`<body style="margin:0;background:#000;display:grid;grid-template-columns:repeat(${cols},960px);font:20px monospace;color:#fff">${shots.map(([t, b]) => `<div style="position:relative"><img src="data:image/png;base64,${b}" width="960" height="540" style="display:block"><span style="position:absolute;left:8px;top:6px;background:#000a;padding:2px 6px">${t.toFixed(2)}</span></div>`).join('')}</body>`);
await pg2.screenshot({ path: `${OUT}/probe.jpg`, type: 'jpeg', quality: 88, fullPage: true });
await br.close(); srv.close();

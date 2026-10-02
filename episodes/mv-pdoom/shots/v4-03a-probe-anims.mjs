import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const ROOT = '/Users/lugia/lugia_fc/ai_video';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf', '.glb': 'model/gltf-binary', '.png': 'image/png', '.fbx': 'application/octet-stream' };
const srv = createServer(async (q, r) => { try { const p = path.join(ROOT, decodeURIComponent(new URL(q.url, 'http://x').pathname)); const b = await readFile(p); r.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' }); r.end(b); } catch { r.writeHead(404); r.end(); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const br = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const names = ['move__run-fast', 'move__sprint-full', 'move__dive-from-run', 'move__run-jump-up', 'move__wall-run-up', 'move__wall-jump-off', 'move__vault-spin', 'move__hard-landing', 'move__backflip-superhero', 'move__run-fast__inplace', 'move__sprint-full__inplace'];
const base = `http://127.0.0.1:${srv.address().port}/episodes/mv-pdoom/kits/_gallery`;
// 1) 我的探针：离地窗口 / 根位移
let pg = await br.newPage(); pg.on('pageerror', e => console.error('ERR', e.message));
await pg.goto(`${base}/v4-03a-probe.html?render=1`); await pg.waitForFunction(() => window.__ready, null, { timeout: 120000 });
const probe = await pg.evaluate(n => window.__probe(n), names);
// 2) W1 的体检（和 index.json 其他条目同一口径）
const metrics = {};
for (const n of names) {
  const p2 = await br.newPage(); p2.on('pageerror', e => console.error('ERR2', n, e.message));
  await p2.goto(`${base}/mocap.html?render=1&name=${n}`); await p2.waitForFunction(() => window.__analyze && window.__video, null, { timeout: 120000 });
  metrics[n] = (await p2.evaluate(n => window.__analyze([n]), n))[0]; await p2.close();
}
console.log(JSON.stringify({ probe, metrics }, null, 1));
await br.close(); srv.close();

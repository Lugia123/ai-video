// node probe.mjs <page> t1 t2 ... : 她的头 / 脚在屏幕上的位置、占画高
import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = '/Users/lugia/lugia_fc/ai_video', [page, ...ts] = process.argv.slice(2);
const T = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.mp3': 'audio/mpeg', '.ttf': 'font/ttf', '.glb': 'model/gltf-binary', '.fbx': 'application/octet-stream' };
const srv = http.createServer((q, r) => { const p = path.join(root, decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': T[path.extname(p)] ?? 'application/octet-stream' }); fs.createReadStream(p).pipe(r); }).listen(0);
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=metal'] }); const pg = await b.newPage({ viewport: { width: 960, height: 540 } });
await pg.goto(`http://localhost:${srv.address().port}/episodes/mv-pdoom/${page}?render=1`);
await pg.waitForFunction(() => window.__video && window.__c3, null, { timeout: 120000 });
for (const t of ts) {
  const r = await pg.evaluate(async t => { await window.__video.seek(+t); const c = window.__c3, cam = c.cam; cam.updateMatrixWorld(true);
    const p = k => { const v = c.bp(k).project(cam); return [+(v.x * 0.5 + 0.5).toFixed(3), +(0.5 - v.y * 0.5).toFixed(3)]; };
    const h = p('Head'), f = p('LeftFoot'), hip = p('Hips'); return { t, head: h, hips: hip, foot: f, hFrac: +(Math.abs(f[1] - h[1])).toFixed(3), girl: c.bp('Hips').toArray().map(x => +x.toFixed(2)), cam: cam.position.toArray().map(x => +x.toFixed(2)) }; }, t);
  console.log(JSON.stringify(r));
}
await b.close(); srv.close();

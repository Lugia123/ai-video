// 全分辨率单帧：node episodes/mv-pdoom/shots/c4-v4-still.mjs <输出.png> <歌曲秒> [side | top]（在仓库根目录跑；用 c4-v4.html，1920×1080）
//   side / top：尾声书桌场景的检查图——正交相机从正侧面 / 正上方看（证明东西不穿模、手机靠着杯子），不过后处理
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const ROOT = '/Users/lugia/lugia_fc/ai_video', OUT = process.argv[2], T = Number(process.argv[3]), T0 = 123.868;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const srv = createServer(async (q, r) => { try { const p = path.join(ROOT, decodeURIComponent(new URL(q.url, 'http://x').pathname)); const b = await readFile(p); r.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' }); r.end(b); } catch { r.writeHead(404); r.end(); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const br = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const pg = await br.newPage({ viewport: { width: 1920, height: 1080 } });
pg.on('pageerror', e => console.error('ERR', e.message));
await pg.goto(`http://127.0.0.1:${srv.address().port}/episodes/mv-pdoom/c4-v4.html?render=1`);
await pg.waitForFunction(() => window.__video, null, { timeout: 180000 });
await pg.evaluate(t => window.__video.seek(t), T - T0);
const view = process.argv[4];
if (view) await pg.evaluate(async view => {
  const THREE = await import('three'), { world, env, DESK_Y } = window.__c4, r = document.querySelector('canvas');
  const a = 16 / 9, h = view === 'side' ? 0.62 : 1.9, cam = new THREE.OrthographicCamera(-h * a, h * a, h, -h, 0.01, 30);
  if (view === 'side') { cam.position.set(6, DESK_Y + 0.5, -0.55); cam.lookAt(0, DESK_Y + 0.5, -0.55); }      // 从 +x 看：左 = 靠镜头这边（+z），右 = 墙
  else { cam.position.set(0, 8, -0.6); cam.up.set(0, 0, -1); cam.lookAt(0, 0, -0.6); }                          // 从上往下：上 = 墙
  cam.updateMatrixWorld(true); world.add(new THREE.AmbientLight('#ffffff', 2.2));
  window.__c4.phone.traverse(o => { if (o.isMesh && o.material.isMeshStandardMaterial) o.material = new THREE.MeshBasicMaterial({ color: '#6fd0ff' }); });   // 检查图里把手机机身涂成亮蓝，侧面才看得清
  window.__c4.checkCam = cam;
}, view);
if (view) await pg.evaluate(() => { const { world, checkCam } = window.__c4; window.__c4.mv.stage.render(world, checkCam, { bloom: 0, grade: { vignette: 0 } }); });
await pg.locator('canvas').first().screenshot({ path: OUT });
console.log(OUT, T);
await br.close(); srv.close();

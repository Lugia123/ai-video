// 校验：口型修前 / 修后对照图（#1162）。要先跑过 build_face.py、mouth_build.py。
//   node mouth_compare.mjs --source <角色来源目录> --work <中间产物目录> --pack <角色数据包目录>
// 用引擎把四个口型贴在脸上画两遍（mouth_compare.html）：数据包里的口型贴图分别被换成「修前」和「修后」，所以不依赖数据包有没有重新快照。
//   修前 = <work>/face/mouth_old/ 里 build_face.py 出的三张旧口型 + <source>/face/mouth_closed.png（闭嘴没改过）
//   修后 = <source>/face/ 里的四张
// 产出两张中间图 <work>/face/mouth_compare/_cmp-before.png / _cmp-after.png，再由 mouth_compare.py 拼成对照图。
// 数据包目录必须在 puppet 目录里面（页面是从 puppet 根起的本地服务读它的）。依赖 playwright（见 puppet/package.json）。
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');                 // puppet 根
const arg = (flag, env) => { const i = process.argv.indexOf(flag); const v = i > 0 ? process.argv[i + 1] : process.env[env]; if (!v) { console.error(`必须给 ${flag} <目录>`); process.exit(2); } return path.resolve(v); };
const SOURCE = arg('--source', 'PUPPET_SOURCE'), WORK = arg('--work', 'PUPPET_WORK'), PACK = arg('--pack', 'PUPPET_PACK');
const packRel = path.relative(ROOT, PACK).split(path.sep).join('/');
if (packRel.startsWith('..')) { console.error(`数据包目录要在 ${ROOT} 里面`); process.exit(2); }
const OUT = path.join(WORK, 'face', 'mouth_compare'); await mkdir(OUT, { recursive: true });
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png' };
const served = new Set();
const server = createServer(async (req, res) => { try { const p = path.normalize(path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname))); if (!p.startsWith(ROOT)) throw 0; const b = await readFile(p); served.add(path.relative(ROOT, p)); res.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' }); res.end(b); } catch { res.writeHead(404); res.end(); } });
await new Promise(r => server.listen(0, '127.0.0.1', r));
const OLD = path.join(WORK, 'face', 'mouth_old'), NEW = path.join(SOURCE, 'face');
const SETS = {      // 数据包里的贴图名 → 换成哪个文件
  before: { 'mouth.png': path.join(NEW, 'mouth_closed.png'), 'mouth_small.png': path.join(OLD, 'mouth_small.png'), 'mouth_big.png': path.join(OLD, 'mouth_big.png'), 'mouth_smile.png': path.join(OLD, 'mouth_smile.png') },
  after: { 'mouth.png': path.join(NEW, 'mouth_closed.png'), 'mouth_small.png': path.join(NEW, 'mouth_small.png'), 'mouth_big.png': path.join(NEW, 'mouth_big.png'), 'mouth_smile.png': path.join(NEW, 'mouth_smile.png') },
};
const browser = await chromium.launch();
let bad = false;
for (const [set, TEX] of Object.entries(SETS)) {
  const page = await browser.newPage({ viewport: { width: 2600, height: 900 } });
  page.on('pageerror', e => { bad = true; console.error('页面错误：', e.message); });
  let swapped = 0;
  await page.route('**/tex/mouth*.png', async route => {
    const name = path.basename(new URL(route.request().url()).pathname);
    if (!TEX[name]) return route.continue();
    swapped++; await route.fulfill({ contentType: 'image/png', body: await readFile(TEX[name]) });
  });
  await page.goto(`http://127.0.0.1:${server.address().port}/${path.relative(ROOT, HERE).split(path.sep).join('/')}/mouth_compare.html?pack=${encodeURIComponent(packRel)}`);
  await page.waitForFunction(() => window.__video, null, { timeout: 30000 });
  await page.locator('#c').screenshot({ path: path.join(OUT, `_cmp-${set}.png`) });
  console.log(set, '换掉的贴图数', swapped);
  await page.close();
}
if (process.env.TRACE_SERVED) console.log('本地服务给过的文件：\n' + [...served].sort().join('\n'));
await browser.close(); server.close(); process.exit(bad ? 1 : 0);

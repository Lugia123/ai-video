// 抽帧自查（#1030）：node episodes/mv-pdoom/fresh/redo-v403/snap.mjs <页名.html> <页面 t=0 对应的歌曲秒> <输出目录> <歌曲秒 | a:b:step> …
//   --scale 0.5（默认）半分辨率；--eval '<js>' 每帧后在页面里求值并打印；--sheet N 把所有帧拼成 N 列的 sheet.jpg（要 ffmpeg）
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const argv = process.argv.slice(2), opt = { scale: 0.5, eval: null, sheet: 0, cell: 480 };
const rest = [];
for (let i = 0; i < argv.length; i++) { if (argv[i] === '--scale') opt.scale = +argv[++i]; else if (argv[i] === '--eval') opt.eval = argv[++i]; else if (argv[i] === '--sheet') opt.sheet = +argv[++i]; else if (argv[i] === '--cell') opt.cell = +argv[++i]; else rest.push(argv[i]); }
const [pageName, offset, outDir, ...specs] = rest;
const times = specs.flatMap(s => { if (!s.includes(':')) return [+s]; const [a, b, st] = s.split(':').map(Number); const o = []; for (let k = 0; a + k * st <= b + 1e-9; k++) o.push(+(a + k * st).toFixed(4)); return o; });
const root = process.cwd(), dir = 'episodes/mv-pdoom';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf', '.glb': 'model/gltf-binary', '.fbx': 'application/octet-stream' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(p)] ?? 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch(process.env.NOGPU ? {} : { args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });   // NOGPU=1：默认的软件渲染（SwiftShader）
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: opt.scale });
page.on('pageerror', e => { console.error('页面错误：', e.message); process.exitCode = 1; });
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.error(`[${m.type()}]`, m.text().slice(0, 400)); });
await page.goto(`http://localhost:${server.address().port}/${dir}/${pageName}${pageName.includes('?') ? '&' : '?'}render=1`);
await page.waitForFunction(() => window.__video, null, { timeout: 180000 });
await page.evaluate(() => document.fonts.ready);
const files = [];
for (const T of times) {
  await page.evaluate(t => window.__video.seek(t), T - Number(offset));
  const f = path.join(outDir, `T-${T.toFixed(3)}.png`); files.push(f);
  await page.locator('canvas').first().screenshot({ path: f });
  if (opt.eval) console.log(T, JSON.stringify(await page.evaluate(opt.eval)));
}
await browser.close(); server.close();
if (opt.sheet) {
  execFileSync('python3', [path.join(root, dir, 'fresh/redo-v403/sheet.py'), path.join(outDir, 'sheet.jpg'), String(opt.sheet), String(opt.cell), ...files], { stdio: 'inherit' });
}

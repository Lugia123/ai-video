// 自检小工具：以项目根起静态服务，打开 dance-demo 下的页面，执行表达式 / 截图。
//   node tools/page.mjs <page.html?query> [--eval 'expr'] [--shot out.png] [--wait 'expr'] [--gpu]
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.glb': 'model/gltf-binary', '.fbx': 'application/octet-stream', '.mp3': 'audio/mpeg', '.wasm': 'application/wasm' };
export async function openServer() {
  const server = createServer(async (req, res) => {
    try { const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname)); const b = await readFile(p);
      res.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' }); res.end(b);
    } catch { res.writeHead(404); res.end(); }
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  return server;
}
export async function openPage(rel, { gpu = false, width = 1920, height = 1080 } = {}) {
  const server = await openServer();
  const browser = await chromium.launch({ args: gpu ? ['--use-angle=metal', '--enable-gpu'] : ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width, height } });
  page.on('pageerror', e => console.error('[pageerror]', e.message));
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning' || m.type() === 'log') console.error(`[${m.type()}]`, m.text()); });
  const url = `http://127.0.0.1:${server.address().port}/episodes/cast-cyber-girl/3d/dance-demo/${rel}`;
  await page.goto(url);
  return { page, close: async () => { await browser.close(); server.close(); } };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2), get = k => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null; };
  const { page, close } = await openPage(a[0], { gpu: a.includes('--gpu') });
  await page.waitForFunction(get('--wait') ?? 'window.__out', null, { timeout: 60000 });
  if (get('--eval')) console.log(JSON.stringify(await page.evaluate(get('--eval')), null, 1));
  if (get('--shot')) await page.screenshot({ path: get('--shot'), fullPage: true });
  await close();
}

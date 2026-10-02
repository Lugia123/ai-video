// 3D 查看器冒烟检查：起静态服务器 → 依次加载 models.json 里的模型 → 各截一张图 → console 有 error 就失败。
//   node tools/dt/check-viewer.mjs [episodes/cast-cyber-girl/3d] [--only 路径子串]
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const args = process.argv.slice(2);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
const dir = args.find(a => !a.startsWith('--') && a !== only) ?? 'episodes/cast-cyber-girl/3d';
const PORT = 8765;

const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
await new Promise(r => setTimeout(r, 800));
const errors = [];
try {
  const { models } = JSON.parse(await readFile(path.join(ROOT, dir, 'models.json'), 'utf8'));
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(`http://127.0.0.1:${PORT}/${dir}/viewer.html`);
  await page.waitForFunction('window.__viewer', null, { timeout: 20000 });
  for (const m of models.filter(m => !only || m.path.includes(only))) {
    const info = await page.evaluate(p => window.__viewer.load(p), m.path);
    await page.waitForTimeout(1200);
    const ui = await page.evaluate(() => ({
      anim: !document.getElementById('animBox').hidden,
      skel: !document.getElementById('skelBox').hidden,
      stats: document.getElementById('stats').textContent.replace(/\n/g, ' | '),
    }));
    const slug = m.path.replace(/\.glb$/i, '').replace(/[\\/]/g, '-');
    const out = path.join(dir, `_viewer-check-${slug}.png`);
    await page.screenshot({ path: path.join(ROOT, out) });
    console.log(`${m.path}\n  动画 ${JSON.stringify(info.animations)}  骨骼 ${info.skinned}\n  控件：动画区${ui.anim ? '显示' : '隐藏'}，骨骼开关${ui.skel ? '显示' : '隐藏'}\n  ${ui.stats}\n  → ${out}`);
  }
  await browser.close();
} finally {
  server.kill();
}
if (errors.length) { console.error('console error:\n  ' + errors.join('\n  ')); process.exit(1); }
console.log('console 无 error');

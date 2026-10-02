#!/usr/bin/env node
// 2D 立绘 → 3D 脸部贴图 一键重烘：
//   node tools/face-bake/bake.mjs [glb] [--calib tools/face-bake/calib.json]
//   glb 默认 episodes/cast-cyber-girl/3d/tripo-girl/anime+girl+3d+model.glb（新导出的 4K / 8K 版放同目录，传它的路径即可）
// 产物（原 glb / 原贴图都不动）：
//   <glb 目录>/face-bake/<名字>.basecolor.jpg   烘好的颜色贴图（与原贴图同尺寸）
//   <glb 目录>/face-bake/<名字>.mask.png        替换权重（UV 空间，1024²，自查用）
//   <glb 目录>/<名字>.facebake.glb              把颜色贴图换成烘好的那张的 glb 副本（girl.js 默认加载它）
// 原理见 bake.html 顶部注释。UV 布局不参与标定，所以换了 UV 的新导出也能直接重跑；网格形状变了才要重读 calib.json 的对应点。

import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { existsSync, createReadStream, statSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const calibArg = args.includes('--calib') ? args[args.indexOf('--calib') + 1] : 'tools/face-bake/calib.json';
const glbRel = args.find(a => a.endsWith('.glb')) || 'episodes/cast-cyber-girl/3d/tripo-girl/anime+girl+3d+model.glb';
const glbAbs = path.resolve(ROOT, glbRel);
if (!existsSync(glbAbs)) { console.error(`找不到 ${glbRel}`); process.exit(1); }

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.glb': 'model/gltf-binary' };
const server = createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !existsSync(p) || statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(p)] ?? 'application/octet-stream' });
  createReadStream(p).pipe(res);
}).listen(0);

const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
try {
  const page = await browser.newPage();
  page.on('pageerror', e => console.error('页面错误：', e.message));
  const rel = path.relative(ROOT, glbAbs).split(path.sep).join('/');
  await page.goto(`http://127.0.0.1:${server.address().port}/tools/face-bake/bake.html?glb=${encodeURIComponent(rel)}&calib=${encodeURIComponent(calibArg)}`);
  await page.waitForFunction(() => window.__result, null, { timeout: 300_000 });
  const r = await page.evaluate(() => window.__result);
  const name = path.basename(glbAbs, '.glb'), dir = path.dirname(glbAbs), outDir = path.join(dir, 'face-bake');
  await mkdir(outDir, { recursive: true });
  const jpg = Buffer.from(r.jpg.split(',')[1], 'base64');
  await writeFile(path.join(outDir, `${name}.basecolor.jpg`), jpg);
  await writeFile(path.join(outDir, `${name}.mask.png`), Buffer.from(r.mask.split(',')[1], 'base64'));
  await writeFile(path.join(dir, `${name}.facebake.glb`), replaceBaseColor(await readFile(glbAbs), jpg));
  console.log(`完成：${path.relative(ROOT, outDir)}/${name}.basecolor.jpg、${path.relative(ROOT, dir)}/${name}.facebake.glb`);
  console.log(JSON.stringify(r.stats));
} finally { await browser.close(); server.close(); }

/** 把 glb 里 baseColorTexture 引用的图片换成 jpg（新 bufferView 追加在 BIN 末尾），其余不动 */
function replaceBaseColor(glb, jpg) {
  const jsonLen = glb.readUInt32LE(12), json = JSON.parse(glb.subarray(20, 20 + jsonLen).toString('utf8'));
  const binHead = 20 + jsonLen, binLen = glb.readUInt32LE(binHead), bin = glb.subarray(binHead + 8, binHead + 8 + binLen);
  const mat = json.materials[0], tex = json.textures[mat.pbrMetallicRoughness.baseColorTexture.index], img = json.images[tex.source];
  const pad = n => (4 - (n % 4)) % 4;
  const offset = bin.length + pad(bin.length);
  json.bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: jpg.length });
  img.bufferView = json.bufferViews.length - 1; img.mimeType = 'image/jpeg'; img.name = (img.name || 'basecolor') + '_facebake';
  const newBin = Buffer.concat([bin, Buffer.alloc(pad(bin.length)), jpg, Buffer.alloc(pad(jpg.length))]);
  json.buffers[0].byteLength = newBin.length;
  let js = Buffer.from(JSON.stringify(json), 'utf8'); js = Buffer.concat([js, Buffer.alloc(pad(js.length), 0x20)]);
  const head = Buffer.alloc(12); head.writeUInt32LE(0x46546c67, 0); head.writeUInt32LE(2, 4); head.writeUInt32LE(12 + 8 + js.length + 8 + newBin.length, 8);
  const c1 = Buffer.alloc(8); c1.writeUInt32LE(js.length, 0); c1.writeUInt32LE(0x4e4f534a, 4);
  const c2 = Buffer.alloc(8); c2.writeUInt32LE(newBin.length, 0); c2.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([head, c1, js, c2, newBin]);
}

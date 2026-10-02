#!/usr/bin/env node
// 确定性渲染器：Playwright 逐帧 seek(t) + 截图 → ffmpeg 合成 MP4。
//
//   node tools/render/render.mjs <dir> [--preview] [--from s] [--to s] [--workers n] [--keep-frames] [--gpu]
//
//   <dir>       含 index.html 的目录（episodes/epNN-slug 或 fixture）
//   (默认)      全分辨率逐帧 → out/frames[-<页名>]/frame-NNNNN.png → out/final.mp4
//               （带 --from/--to 时输出 out/clip-<from>-<to>.mp4，不覆盖 final.mp4）
//               音轨：narration/narration.mp3（旁白）+ 配乐，两者都有时混音。配乐来源按优先级：
//                 1. 页面的 window.__video.renderAudio()，返回 WAV（ArrayBuffer / TypedArray / Blob /
//                    base64 字符串，可以是 Promise）→ 写到 out/audio.wav
//                 2. 页面的 window.__video.music：相对 <dir> 的音频路径（如 MV demo 用 '../music.mp3'），须在项目内；
//                    window.__video.musicOffset（秒）= 页面 t=0 对应音频的哪一秒（整首歌里截一段做样片时用）
//                 3. 目录里的 music.wav，再是 music.mp3（MV 没有旁白，整首歌就是音轨）
//   --keep-frames  合成成功后保留 out/frames/（默认删掉省磁盘；做逐帧 md5 复现检查时加上）。
//               合成失败时无论如何都保留，方便排查
//   --preview   半分辨率、每秒 1 帧 → out/contact-sheet.png，不出视频（--step s 改抽帧间隔）
//   --page f    渲染 <dir>/f 而不是 index.html（画廊页用）；产物名带页名前缀：out/<页名>-sheet.png、out/<页名>.mp4
//   --gpu       WebGL 走本机 GPU（ANGLE Metal）而不是默认的 SwiftShader 软件渲染；2D canvas 仍走软件
//               （--disable-accelerated-2d-canvas：GPU 画 2D canvas 时，两次渲染会有零星 1 个色阶的差）。
//               three.js 页面快 2–3 倍；同一台机器两次渲染逐帧 md5 一致（实测），换机器 / 驱动像素会变，
//               所以默认仍是 SwiftShader；同一部片子别混用两种后端
//   --workers   并行页面数（默认 4）。同一 workers 值下逐像素可复现；换 workers 值时
//               文字边缘可能差 1–3 个色阶（见 runPool 注释），肉眼不可见

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

// ---------- 参数 ----------
function parseArgs(argv) {
  const opts = { preview: false, from: null, to: null, workers: 4, dir: null, keepFrames: false, gpu: false, page: 'index.html', step: 1 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--preview') opts.preview = true;
    else if (a === '--keep-frames') opts.keepFrames = true;
    else if (a === '--gpu') opts.gpu = true;
    else if (a === '--from') opts.from = Number(argv[++i]);
    else if (a === '--page') opts.page = argv[++i];
    else if (a === '--step') opts.step = Number(argv[++i]);
    else if (a === '--to') opts.to = Number(argv[++i]);
    else if (a === '--workers') opts.workers = Math.max(1, parseInt(argv[++i], 10));
    else if (a === '-h' || a === '--help') { usage(0); }
    else if (a.startsWith('--')) { console.error(`未知参数 ${a}`); usage(1); }
    else opts.dir = a;
  }
  if (!opts.dir) usage(1);
  for (const k of ['from', 'to']) {
    if (opts[k] !== null && !(opts[k] >= 0)) { console.error(`--${k} 需要非负秒数`); process.exit(1); }
  }
  return opts;
}
function usage(code) {
  console.log('用法：node tools/render/render.mjs <dir> [--preview [--step s]] [--page f.html] [--from s] [--to s] [--workers n] [--keep-frames] [--gpu]');
  process.exit(code);
}

// ---------- 静态服务器（以项目根为根，页面才能 fetch timings.json / assets） ----------
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.mp3': 'audio/mpeg', '.wav': 'audio/wav',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf',
};
function serve(root) {
  const server = createServer(async (req, res) => {
    try {
      const p = path.normalize(path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
      if (!p.startsWith(root)) throw new Error('outside root');
      const body = await readFile(p);
      res.writeHead(200, { 'content-type': MIME[path.extname(p).toLowerCase()] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404); res.end();
    }
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

// ---------- ffmpeg ----------
function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'inherit', 'inherit'] });
    p.on('error', reject);
    p.on('close', code => (code === 0 ? resolve() : reject(new Error(`${cmd} 退出码 ${code}`))));
  });
}

// ---------- 打开页面并等就绪 ----------
async function openPage(browser, url, { scale }) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
  const errors = [];
  page.on('pageerror', e => errors.push(e));
  page.on('console', m => { if (m.type() === 'error') console.error(`[page] ${m.text()}`); });
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__video, null, { timeout: 30_000 }).catch(() => {
    throw new Error(`页面 30 秒内没有暴露 window.__video${errors.length ? `：${errors[0].message}` : ''}`);
  });
  const meta = await page.evaluate(async () => {
    await document.fonts.ready;
    const v = window.__video;
    if (v.ready) await v.ready;
    return { width: v.width, height: v.height, fps: v.fps, duration: v.duration };
  });
  for (const k of ['width', 'height', 'fps', 'duration']) {
    if (!(meta[k] > 0)) throw new Error(`window.__video.${k} 无效：${meta[k]}`);
  }
  if (meta.width !== 1920 || meta.height !== 1080) {
    await page.setViewportSize({ width: meta.width, height: meta.height });
  }
  return { page, meta, errors };
}

async function seekAndShoot(ctx, t, file) {
  await ctx.page.evaluate(t => window.__video.seek(t), t);
  if (ctx.errors.length) throw new Error(`页面在 t=${t.toFixed(3)} 出错：${ctx.errors[0].message}`);
  await ctx.page.screenshot({ path: file, type: 'png', animations: 'disabled', caret: 'hide' });
}

// 把任务列表切成连续的块，每个页面按顺序画自己那一块。
// 不能用"谁空闲谁取下一帧"：Chromium 的合成层状态有迟滞（比如元素不透明度刚从 <1 变回 1），
// 同一个 t 在不同渲染历史下文字边缘会差 1–3 个色阶。固定分块 = 固定历史 = 每次跑出同样的像素。
async function runPool(pages, jobs, fn, label) {
  let done = 0;
  const t0 = Date.now();
  const tick = () => {
    done++;
    if (process.stdout.isTTY && (done % 10 === 0 || done === jobs.length)) {
      const fps = done / ((Date.now() - t0) / 1000);
      process.stdout.write(`\r${label} ${done}/${jobs.length}  (${fps.toFixed(1)} 帧/秒)`);
    }
  };
  const size = Math.ceil(jobs.length / pages.length);
  await Promise.all(pages.map(async (ctx, k) => {
    for (const job of jobs.slice(k * size, (k + 1) * size)) {
      await fn(ctx, job);
      tick();
    }
  }));
  if (process.stdout.isTTY) process.stdout.write('\n');
  console.log(`${label} 完成：${jobs.length} 帧，用时 ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

// 页面若提供 window.__video.renderAudio()，取回它的 WAV 写到 out/audio.wav；没有就返回 null
async function pageAudio(page, outDir) {
  const b64 = await page.evaluate(async () => {
    const v = window.__video;
    if (typeof v.renderAudio !== 'function') return null;
    let d = await v.renderAudio();
    if (typeof d === 'string') return d;
    if (d instanceof Blob) d = await d.arrayBuffer();
    const bytes = ArrayBuffer.isView(d) ? new Uint8Array(d.buffer, d.byteOffset, d.byteLength) : new Uint8Array(d);
    let s = '';
    for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  });
  if (!b64) return null;
  const file = path.join(outDir, 'audio.wav');
  await writeFile(file, Buffer.from(b64, 'base64'));
  return file;
}

// 页面用 window.__video.music 声明的音频文件（相对 <dir>）；没声明返回 null，声明了却找不到就报错
async function declaredMusic(page, dir) {
  const rel = await page.evaluate(() => window.__video.music ?? null);
  if (!rel) return null;
  const file = path.resolve(dir, rel);
  if (!file.startsWith(ROOT + path.sep) || !existsSync(file)) throw new Error(`window.__video.music 指向的文件不存在或在项目外：${rel}`);
  return file;
}

const fmtTime = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}${Number.isInteger(s) ? '' : (s % 1).toFixed(2).slice(1)}`;

// ---------- 主流程 ----------
async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const dir = path.resolve(opts.dir);
  if (!existsSync(path.join(dir, opts.page))) throw new Error(`${dir} 里没有 ${opts.page}`);
  const prefix = opts.page === 'index.html' ? '' : path.basename(opts.page, '.html');
  if (!dir.startsWith(ROOT + path.sep)) throw new Error(`目录必须在项目内：${ROOT}`);
  const outDir = path.join(dir, 'out');
  await mkdir(outDir, { recursive: true });

  const server = await serve(ROOT);
  const url = `http://127.0.0.1:${server.address().port}/${path.relative(ROOT, dir).split(path.sep).join('/')}/${opts.page}?render=1`;
  // 后 5 个 flag 减少栅格化对"之前画过什么"的依赖（关掉部分重绘、线程化动画、异步图片解码等）。
  // 剩下的历史依赖由 runPool 的固定分块消除。
  const browser = await chromium.launch({
    args: [
      '--font-render-hinting=none', '--disable-lcd-text', '--force-color-profile=srgb', '--hide-scrollbars',
      '--run-all-compositor-stages-before-draw', '--disable-partial-raster', '--disable-checker-imaging',
      '--disable-threaded-animation', '--disable-new-content-rendering-timeout',
      ...(opts.gpu ? ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--disable-accelerated-2d-canvas'] : []),
    ],
  });

  try {
    const scale = opts.preview ? 0.5 : 1;
    const first = await openPage(browser, url, { scale });
    const { width, height, fps, duration } = first.meta;
    const totalFrames = Math.ceil(duration * fps - 1e-6);
    const from = opts.from ?? 0;
    const to = Math.min(opts.to ?? duration, duration);
    if (!(to > from)) throw new Error(`时间范围无效：${from}–${to}（总长 ${duration}s）`);
    console.log(`${path.relative(ROOT, dir)}：${width}×${height} @ ${fps}fps，总长 ${duration}s（${totalFrames} 帧）`);

    const pages = [first];
    while (pages.length < opts.workers) pages.push(await openPage(browser, url, { scale }));

    if (opts.preview) {
      await preview({ browser, pages, dir, outDir, from, to, width, height, step: opts.step, prefix });
      return;
    }

    // 帧序号全局编号：第 i 帧对应 t = i / fps，与 --from 无关，方便对比同一帧
    const startFrame = Math.round(from * fps);
    const endFrame = Math.min(Math.ceil(to * fps - 1e-6), totalFrames); // 不含
    const frameCount = endFrame - startFrame;
    const framesDir = path.join(outDir, prefix ? `frames-${prefix}` : 'frames');   // 按页分目录，多人同时渲不互删
    await rm(framesDir, { recursive: true, force: true });
    await mkdir(framesDir, { recursive: true });

    const frameFile = i => path.join(framesDir, `frame-${String(i).padStart(5, '0')}.png`);
    const jobs = Array.from({ length: frameCount }, (_, k) => startFrame + k);
    await runPool(pages, jobs, (ctx, i) => seekAndShoot(ctx, i / fps, frameFile(i)), '截帧');

    const isClip = opts.from !== null || opts.to !== null;
    const outFile = path.join(outDir, isClip ? `${prefix ? prefix + '-' : ''}clip-${from}-${to}.mp4` : prefix ? `${prefix}.mp4` : 'final.mp4');
    const tracks = [];
    const narration = path.join(dir, 'narration', 'narration.mp3');
    if (existsSync(narration)) tracks.push({ file: narration, label: '旁白' });
    const music = await pageAudio(first.page, outDir) ?? await declaredMusic(first.page, dir)
      ?? ['music.wav', 'music.mp3'].map(f => path.join(dir, f)).find(f => existsSync(f)) ?? null;
    const musicOffset = await first.page.evaluate(() => Number(window.__video.musicOffset) || 0);
    if (music) tracks.push({ file: music, label: musicOffset ? `配乐（从 ${musicOffset}s 起）` : '配乐', offset: musicOffset });
    const videoSeconds = (frameCount / fps).toFixed(6);
    const args = [
      '-hide_banner', '-loglevel', 'error', '-y',
      '-framerate', String(fps), '-start_number', String(startFrame),
      '-i', path.join(framesDir, 'frame-%05d.png'),
    ];
    for (const tr of tracks) args.push('-ss', String(startFrame / fps + (tr.offset || 0)), '-i', tr.file);
    args.push(
      '-map', '0:v', '-frames:v', String(frameCount),
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(fps),
    );
    if (tracks.length === 1) args.push('-map', '1:a', '-af', 'apad');
    // 两轨按原电平相加（不做 amix 的自动降音量）；旁白和配乐的相对响度由各自素材决定
    if (tracks.length === 2) args.push('-filter_complex', '[1:a][2:a]amix=inputs=2:duration=longest:normalize=0,apad[a]', '-map', '[a]');
    if (tracks.length) args.push('-c:a', 'aac', '-b:a', '192k', '-t', videoSeconds);
    args.push('-movflags', '+faststart', outFile);
    console.log(`合成 ${path.relative(ROOT, outFile)}${tracks.length ? `（含${tracks.map(t => t.label).join(' + ')}）` : '（无音轨）'} …`);
    await run('ffmpeg', args);
    if (!opts.keepFrames) await rm(framesDir, { recursive: true, force: true });
    console.log(`完成：${path.relative(ROOT, outFile)}（${((await stat(outFile)).size / 1e6).toFixed(1)} MB）`);
  } finally {
    await browser.close();
    server.close();
  }
}

// 半分辨率、每秒 1 帧，拼成一张带时间 / 段落标注的 contact sheet
async function preview({ browser, pages, dir, outDir, from, to, width, height, step = 1, prefix = '' }) {
  const previewDir = path.join(outDir, prefix ? `preview-${prefix}` : 'preview');
  await rm(previewDir, { recursive: true, force: true });
  await mkdir(previewDir, { recursive: true });

  let segments = [];
  const timingsPath = path.join(dir, 'narration', 'timings.json');
  if (existsSync(timingsPath)) segments = JSON.parse(await readFile(timingsPath, 'utf8')).segments || [];

  const times = [];
  for (let k = Math.ceil(from / step - 1e-9); k * step < to - 1e-9; k++) times.push(+(k * step).toFixed(3));
  if (!times.length) times.push(from);
  const file = t => path.join(previewDir, `t-${t.toFixed(2).padStart(8, '0')}.png`);
  await runPool(pages, times, (ctx, t) => seekAndShoot(ctx, t, file(t)), '抽帧');

  const tileW = 480, tileH = Math.round(tileW * height / width), cols = 5;
  const tiles = await Promise.all(times.map(async t => {
    const s = segments.find(s => t >= s.start && t < s.end);
    const b64 = (await readFile(file(t))).toString('base64');
    return `<figure><img src="data:image/png;base64,${b64}"><figcaption>${fmtTime(t)}${s ? ` · ${s.id}` : ''}</figcaption></figure>`;
  }));
  const html = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;padding:16px;background:#1a1a1a;color:#ccc;font:14px/1.2 Menlo,monospace;width:${cols * (tileW + 12) + 20}px}
    main{display:grid;grid-template-columns:repeat(${cols},${tileW}px);gap:12px}
    figure{margin:0} img{display:block;width:${tileW}px;height:${tileH}px}
    figcaption{padding:4px 0 0}
  </style><main>${tiles.join('')}</main>`;
  const sheet = await browser.newPage({ viewport: { width: cols * (tileW + 12) + 20, height: 400 }, deviceScaleFactor: 1 });
  await sheet.setContent(html);
  const outFile = path.join(outDir, prefix ? `${prefix}-sheet.png` : 'contact-sheet.png');
  await sheet.screenshot({ path: outFile, fullPage: true });
  await sheet.close();
  console.log(`完成：${path.relative(ROOT, outFile)}（${times.length} 帧）`);
}

main().catch(e => { console.error(`渲染失败：${e.message}`); process.exit(1); });

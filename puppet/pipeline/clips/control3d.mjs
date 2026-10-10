#!/usr/bin/env node
// 3D 人偶 + 动捕 FBX → 控制视频（人偶线稿 / OpenPose 式骨架）。纯本地 CPU：浏览器里算姿势、画图，这里逐帧存图、ffmpeg 合成。不跑模型、不连服务器。
//
//   node pipeline/clips/control3d.mjs render <动作.fbx> --name <动作名> [--rig characters/<角色>/source-next/mannequin3d.json] [--home <归位帧.png>]
//        [--start 秒] [--dur 秒] [--blend 帧数=6] [--extras hat,hair,skirt|none] [--lw 线宽=1] [--travel 0..1=0] [--out out/control3d] [--keep-frames]
//   node pipeline/clips/control3d.mjs inventory <FBX 目录> [--rig …] [--out out/control3d]
//   node pipeline/clips/control3d.mjs still [--rig …] [--home …] [--out out/control3d]        只出归位站姿叠在归位帧上的静帧
//
// render 的产物（<out>/<动作名>-…，832×1104、16fps、49 帧，尺寸和帧数取自比例 json）：
//   -line.mp4      人偶线稿，白线黑底（和 control_video.py --style canny 的输出同极性）
//   -line-inv.mp4  同一条，深色线浅底
//   -pose.mp4      骨架图（3D 关节直接投影，没有检测器）
//   -man.mp4       人偶渲染（看动作用）
//   -overlay.mp4   线稿叠在归位帧上（核对对齐）
//   -compare.png   6 帧 × 4 列：人偶 | 线稿 | 骨架 | 归位帧叠加
//   -first.png / -last.png   首末帧的归位帧叠加图；-report.json 逐帧读数
// --start / --dur：取片段的哪一段（片段秒）铺满全部帧；不给 --dur 就按原速取够帧数的那么长。首尾各 --blend 帧向归位站姿过渡，首末帧 = 归位站姿。
// FBX 可以在任何地方（参数给路径），不拷进本目录。
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { chromium, PUPPET, ROOT } from '../../tools/_env.mjs';

const argv = process.argv.slice(2), cmd = argv.shift(), pos = [], opt = {};
for (let i = 0; i < argv.length; i++) { const a = argv[i]; if (a === '--keep-frames') opt.keep = true; else if (a.startsWith('--')) opt[a.slice(2)] = argv[++i]; else pos.push(a); }
if (!['render', 'inventory', 'still'].includes(cmd) || (cmd !== 'still' && pos.length !== 1)) { console.error((await readFile(new URL(import.meta.url), 'utf8')).split('\n').slice(1, 20).join('\n')); process.exit(2); }
const RIG = path.resolve(opt.rig || path.join(PUPPET, 'characters/beret-girl/source-next/mannequin3d.json'));
const HOME = path.resolve(opt.home || path.join(PUPPET, 'characters/beret-girl/clips-b1/frames/idle.png'));
const OUT = path.resolve(opt.out || path.join(PUPPET, 'out/control3d'));
await mkdir(OUT, { recursive: true });

// 本地服务：仓库（或 puppet）目录照常给；仓库外 / 任意位置的文件走 /__ext/<编号>
const ext = []; const extUrl = f => { ext.push(path.resolve(f)); return `/__ext/${ext.length - 1}/${encodeURIComponent(path.basename(f))}`; };
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png' };
const server = createServer(async (req, res) => { try { const u = decodeURIComponent(new URL(req.url, 'http://x').pathname), m = u.match(/^\/__ext\/(\d+)\//);
  const p = m ? ext[+m[1]] : path.normalize(path.join(ROOT, u)); if (!p || (!m && !p.startsWith(ROOT))) throw 0;
  res.writeHead(200, { 'content-type': MIME[path.extname(p).toLowerCase()] || 'application/octet-stream' }); res.end(await readFile(p)); } catch { res.writeHead(404); res.end(); } });
await new Promise(r => server.listen(0, '127.0.0.1', r));
const pageUrl = q => `http://127.0.0.1:${server.address().port}/${path.relative(ROOT, path.join(PUPPET, 'tools/mannequin3d.html')).split(path.sep).join('/')}?` + new URLSearchParams(q);
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
async function open(q) { const p = await browser.newPage({ viewport: { width: 900, height: 700 } }); p.on('pageerror', e => console.error('页面报错：' + e)); p.on('console', m => { if (m.type() === 'error') console.error('页面：' + m.text()); });
  await p.goto(pageUrl(q)); await p.waitForFunction(() => window.__ready === true, null, { timeout: 120000 }); return p; }
const savePng = async (p, kind, file) => writeFile(file, Buffer.from((await p.evaluate(k => window.__m.png(k), kind)).split(',')[1], 'base64'));
const sh = (c, a) => { const r = spawnSync(c, a, { encoding: 'utf8' }); if (r.status) throw new Error(`${c} 失败：${(r.stderr || '').slice(-600)}`); return r.stdout; };

try {
  if (cmd === 'still') {
    for (const extras of ['hat,hair,skirt', 'none']) { const p = await open({ rig: extUrl(RIG), home: extUrl(HOME), extras }); const tag = extras === 'none' ? 'bare' : 'extras';
      await savePng(p, 'overlay', path.join(OUT, `home-overlay-${tag}.png`)); await savePng(p, 'man', path.join(OUT, `home-man-${tag}.png`)); await savePng(p, 'pose', path.join(OUT, `home-pose.png`));
      if (extras !== 'none') await writeFile(path.join(OUT, 'home-joints.json'), JSON.stringify(await p.evaluate(() => window.__m.meta().home), null, 1)); await p.close(); }
    console.log(`好了：${OUT}/home-overlay-{extras,bare}.png`);
  } else if (cmd === 'render') {
    const name = opt.name || path.basename(pos[0]).replace(/\.fbx$/i, ''), tag = opt.extras === 'none' ? '-bare' : '';
    const q = { rig: extUrl(RIG), home: extUrl(HOME), fbx: extUrl(pos[0]) }; for (const k of ['start', 'dur', 'blend', 'extras', 'lw', 'travel', 'frames', 'stick', 'posehead']) if (opt[k] != null) q[k] = opt[k];
    const p = await open(q), M = await p.evaluate(() => ({ N: window.__m.N, FPS: window.__m.FPS, W: window.__m.W, H: window.__m.H, meta: window.__m.meta() }));
    const fdir = path.join(OUT, `_frames-${name}${tag}`); await rm(fdir, { recursive: true, force: true }); await mkdir(fdir, { recursive: true });
    const KINDS = ['man', 'line', 'lineinv', 'pose', 'overlay'], rows = [];
    for (let i = 0; i < M.N; i++) { rows.push(await p.evaluate(i => window.__m.frame(i), i)); for (const k of KINDS) await savePng(p, k, path.join(fdir, `${k}-${String(i).padStart(3, '0')}.png`)); }
    await p.close();
    const FILE = { man: 'man', line: 'line', lineinv: 'line-inv', pose: 'pose', overlay: 'overlay' };
    for (const k of KINDS) sh('ffmpeg', ['-v', 'error', '-y', '-framerate', String(M.FPS), '-i', path.join(fdir, `${k}-%03d.png`), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', k === 'man' || k === 'overlay' ? '16' : '10', '-r', String(M.FPS), path.join(OUT, `${name}${tag}-${FILE[k]}.mp4`)]);
    // 对比图：6 帧 × 4 列（半尺寸）
    const pick = [0, 1, 2, 3, 4, 5].map(j => Math.round(j * (M.N - 1) / 5)), ins = [], fl = [];
    pick.forEach((f, r) => ['man', 'lineinv', 'pose', 'overlay'].forEach((k, c) => { ins.push('-i', path.join(fdir, `${k}-${String(f).padStart(3, '0')}.png`)); fl.push(`[${r * 4 + c}:v]scale=iw/2:ih/2[s${r * 4 + c}]`); }));
    const lay = pick.flatMap((_, r) => [0, 1, 2, 3].map(c => `${c * M.W / 2}_${r * M.H / 2}`)).join('|');
    sh('ffmpeg', ['-v', 'error', '-y', ...ins, '-filter_complex', fl.join(';') + ';' + fl.map((_, i) => `[s${i}]`).join('') + `xstack=inputs=24:layout=${lay}`, '-frames:v', '1', path.join(OUT, `${name}${tag}-compare.png`)]);
    for (const [f, n] of [[0, 'first'], [M.N - 1, 'last']]) sh('cp', [path.join(fdir, `overlay-${String(f).padStart(3, '0')}.png`), path.join(OUT, `${name}${tag}-${n}.png`)]);
    const maxStep = (a, b) => Math.max(...a.kp.map((k, j) => Math.hypot(k[0] - b.kp[j][0], k[1] - b.kp[j][1])));
    const steps = rows.slice(1).map((r, i) => +maxStep(r, rows[i]).toFixed(1));
    const report = { name, fbx: path.basename(pos[0]), ...M.meta, compareFrames: pick, handFaceFrames: rows.filter(r => r.handFace).length, yawMaxDeg: Math.max(...rows.map(r => Math.abs(r.yaw))),
      maxJointStepPx: Math.max(...steps), maxJointStepAt: steps.indexOf(Math.max(...steps)) + 1, firstLastKpDiffPx: +maxStep(rows[0], rows.at(-1)).toFixed(2), linePxMean: Math.round(rows.reduce((s, r) => s + r.linePx, 0) / rows.length),
      footMinY: [Math.min(...rows.map(r => r.footMinY)), Math.max(...rows.map(r => r.footMinY))], frames: rows };
    await writeFile(path.join(OUT, `${name}${tag}-report.json`), JSON.stringify(report, null, 1));
    if (!opt.keep) await rm(fdir, { recursive: true, force: true });
    console.log(`好了：${OUT}/${name}${tag}-{line,line-inv,pose,man,overlay}.mp4  片段 ${M.meta.start}–${(M.meta.start + M.meta.dur).toFixed(2)}s，速度 ×${M.meta.speed}，手在脸前 ${report.handFaceFrames} 帧，相邻帧关节最大位移 ${report.maxJointStepPx}px（第 ${report.maxJointStepAt} 帧），首末帧关节差 ${report.firstLastKpDiffPx}px`);
  } else {
    const files = (await readdir(pos[0])).filter(f => /\.fbx$/i.test(f)).sort(), p = await open({ rig: extUrl(RIG) }), rows = [];
    for (const f of files) { try { rows.push({ file: f, ...(await p.evaluate(u => window.__m.analyze(u), extUrl(path.join(pos[0], f)))) }); } catch (e) { rows.push({ file: f, error: String(e).slice(0, 200) }); } process.stderr.write('.'); }
    await p.close(); await writeFile(path.join(OUT, 'inventory.json'), JSON.stringify(rows, null, 1)); console.log(`\n好了：${OUT}/inventory.json（${rows.length} 条）`);
  }
} finally { await browser.close(); server.close(); }

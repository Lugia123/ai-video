// kits/type3d.js — 3D 挤出字 + 动态字效（mv-pdoom W2）
//
//   import { initType3D, FX, PAL, wordState } from './kits/type3d.js';
//   await initType3D();                       // 载入 assets/fonts 的 TTF（只需一次）
//   const fx = FX.slam({ line: mv.lyrics.lines[6], color: PAL.ink });
//   scene.add(fx.group);  ...  fx.update(songT);   // t = 歌曲绝对秒数，与 lyrics.json 同一时基
//
// 每个字效 fx(opts) → { group, update(t), words, bounds }：
//   opts.line   = lyrics.json 里的一行 {text,start,end,words:[{w,start,end}]}（优先）
//   opts.words  = 直接给词数组；或 opts.text + opts.start/end（均分）
//   opts.color / opts.accent / opts.side（挤出侧面色）/ opts.font（FONTS 的键）/ opts.seed
//   opts.maxW / opts.maxH：排版盒（组内坐标，单位 = three 世界单位）。默认按「相机 z=40、fov 30」
//   的取景设计：可视约 38×21.4，默认盒 30×15，组原点 = 画面中心。镜头自己放缩/摆位 group 即可。
// 规则：词在 word.start 之前绝不出现（不抢跑）；update(t) 只依赖 t（可乱序 seek）；
// 随机全部来自 seed 的无状态哈希 / mulberry32。所有字效不依赖场景灯光（正面 MeshBasic，侧面 matcap）。
//
// 字效清单（FX 的键）：
//   slam        纯色底黑色巨字逐词砸入：从镜头前冲进来，拖影=运动模糊，落地过冲 + 震屏
//   burst       前半句小字弹出，关键词巨字砸下后爆成粒子 + 冲击环（FOOM）
//   reform      每个词由散开的粒子汇聚成形（atoms rearranging）
//   wall        滚动字墙（明暗随每个词的起音脉动）+ 前景一条色带上逐词亮起
//   outline     空心描边字，多层彩色回声，笔画按词描出（shrooms）
//   hud         HUD 标签框：角括号展开、闪烁、打字、引线指向中心目标、倒计时读数
//   curve       字沿 3D 曲线（损失曲线）排布，曲线随唱随画，词弹起点亮
//   singularity 词被拉长、卷入奇点（吸积盘 + 光环）
//   flip        翻牌计数器：格子疯转后按词锁定（1E30 / P(doom) 数字）
//   stamp       前半句小字，关键词像印章一样盖下（边框 + 缺墨斑点）
//   typewriter  打字机逐字打出，光标方块
//   mask        [MASK] 黑块逐个翻开，露出这句歌词
//   whisper     手写体慢慢浮现（逐字升起淡入），全片最静的句子用
//
// 注意：fraunces 是可变字体，B g ? 三个字形有重叠轮廓，三角化会缺面（已逐字检测），别用它排含这几个字的句子。
// 发光：engine 的 bloom 阈值是线性 HDR；要字发光，传 opts.glow（>1 的倍数，正面材质 toneMapped:false 并乘亮度）。

import * as THREE from 'three';
import { TTFLoader } from '../../../assets/vendor/three/examples/jsm/loaders/TTFLoader.js';
import { Font } from '../../../assets/vendor/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from '../../../assets/vendor/three/examples/jsm/geometries/TextGeometry.js';
import { Line2 } from '../../../assets/vendor/three/examples/jsm/lines/Line2.js';
import { LineGeometry } from '../../../assets/vendor/three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from '../../../assets/vendor/three/examples/jsm/lines/LineMaterial.js';
import { mulberry32 } from '../../../assets/lib/layer-rig.js';

import { PALETTE } from '../engine/palette.js';
export const PAL = PALETTE;

// ---------------------------------------------------------------- 字体
const FONT_DIR = new URL('../../../assets/fonts/', import.meta.url);
const FONT_FILES = {
  anton: 'anton/Anton-Regular.ttf',
  bebas: 'bebasneue/BebasNeue-Regular.ttf',
  bungee: 'bungee/Bungee-Regular.ttf',
  mono: 'sharetechmono/ShareTechMono-Regular.ttf',
  fraunces: 'fraunces/Fraunces-Variable.ttf',
  caveat: 'caveat/Caveat-Variable.ttf',
};
export const FONTS = {};
let initP = null;
export function initType3D(keys = Object.keys(FONT_FILES)) {
  initP ??= Promise.all(keys.map(async k => {
    const json = await new TTFLoader().loadAsync(new URL(FONT_FILES[k], FONT_DIR).href);
    FONTS[k] = new Font(json);
  }));
  return initP;
}
function font(k) {
  const f = FONTS[k];
  if (!f) throw new Error(`type3d: 字体 ${k} 未载入，先 await initType3D()`);
  return f;
}

// ---------------------------------------------------------------- 小工具
export const clamp01 = x => (x < 0 ? 0 : x > 1 ? 1 : x);
const lerp = (a, b, p) => a + (b - a) * p;
const easeOut3 = p => 1 - (1 - p) ** 3;
const easeIn2 = p => p * p;
const easeOutBack = (p, s = 1.9) => 1 + (s + 1) * (p - 1) ** 3 + s * (p - 1) ** 2;
const smooth = p => p * p * (3 - 2 * p);
// 阻尼弹簧：k 秒后的残余振荡（0 → 1 的过冲用 1 - spring）
const spring = (k, w = 34, d = 9) => (k < 0 ? 0 : Math.exp(-k * d) * Math.cos(k * w));
// 无状态哈希随机 [0,1)
export function rnd(a, b = 0, c = 0) {
  let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263) + Math.imul(c | 0, 2147483647);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

// 词状态：与 engine mv.lyrics.wordState 同语义
export function wordState(w, t) {
  if (t < w.start) return { state: 'pending', p: 0, k: t - w.start };
  if (t < w.end) return { state: 'active', p: (t - w.start) / Math.max(1e-3, w.end - w.start), k: t - w.start };
  return { state: 'done', p: 1, k: t - w.start };
}

function clean(w, upper) {
  let s = w.replace(/[“”"]/g, '').replace(/[‘’]/g, "'").replace(/[,.!;:]+$/, '');
  return upper ? s.toUpperCase() : s;
}
export function wordsOf(opts) {
  let ws = opts.words ?? opts.line?.words;
  if (!ws) {
    const toks = String(opts.text ?? opts.line?.text ?? '').split(/\s+/).filter(Boolean);
    const s = opts.start ?? 0, e = opts.end ?? s + toks.length * 0.4;
    ws = toks.map((w, i) => ({ w, start: s + (e - s) * i / toks.length, end: s + (e - s) * (i + 1) / toks.length }));
  }
  return ws.map((x, i) => ({ ...x, i, text: clean(x.w, opts.upper) }));
}
const lineSpan = words => ({ start: words[0].start, end: words[words.length - 1].end });

// ---------------------------------------------------------------- 度量与排版
const glyphOf = (f, ch) => f.data.glyphs[ch] ?? f.data.glyphs['?'];
export function advance(fk, text, size) {
  const f = font(fk);
  let a = 0;
  for (const ch of text) a += glyphOf(f, ch)?.ha ?? 0;
  return a * size / f.data.resolution;
}
const capCache = {};
function capH(fk) {   // 大写字母 H 高 / 字号
  if (capCache[fk] == null) {
    const g = new THREE.ShapeGeometry(font(fk).generateShapes('H', 1));
    g.computeBoundingBox();
    capCache[fk] = g.boundingBox.max.y;
    g.dispose();
  }
  return capCache[fk];
}

// 贪心换行，整体以原点居中。items[k] = { i, text, x(左), y(基线), w, s(字号), row }
// 词文本以 ? 结尾或 i ∈ breakAfter 时强制换行。
export function layout(words, { font: fk, size, maxW = 30, gap = 0.34, scales = {}, breakAfter = [], align = 'center', wordGap = 1 }) {
  const sp = advance(fk, ' ', size) * wordGap;
  const rows = [[]];
  let rowW = 0;
  for (const w of words) {
    const s = size * (scales[w.i] ?? 1);
    const ww = advance(fk, w.text, s);
    const row = rows[rows.length - 1];
    if (row.length && rowW + sp + ww > maxW) { rows.push([]); rowW = 0; }
    const r = rows[rows.length - 1];
    rowW += (r.length ? sp : 0) + ww;
    r.push({ i: w.i, text: w.text, w: ww, s });
    if (w.text.endsWith('?') || breakAfter.includes(w.i)) { rows.push([]); rowW = 0; }
  }
  if (!rows[rows.length - 1].length) rows.pop();
  const ch = capH(fk);
  const rowHs = rows.map(r => Math.max(...r.map(it => it.s)) * ch);
  const H = rowHs.reduce((a, b) => a + b, 0) + gap * size * (rows.length - 1);
  let top = H / 2;
  const items = [];
  let W = 0;
  rows.forEach((r, ri) => {
    const rw = r.reduce((a, it) => a + it.w, 0) + sp * (r.length - 1);
    W = Math.max(W, rw);
    const base = top - rowHs[ri];
    let x = align === 'left' ? -maxW / 2 : -rw / 2;
    for (const it of r) { items.push({ ...it, x, y: base, row: ri }); x += it.w + sp; }
    top = base - gap * size;
  });
  items.sort((a, b) => a.i - b.i);
  return { items, W, H, size, rows: rows.length, capH: ch };
}
export function fitLayout(words, { maxW = 30, maxH = 15, maxSize = 6, ...o }) {
  let size = maxSize, L;
  for (let n = 0; n < 60; n++) {
    L = layout(words, { ...o, size, maxW });
    if (L.W <= maxW && L.H <= maxH) break;
    size *= 0.95;
  }
  return L;
}

// ---------------------------------------------------------------- 几何与材质（按参数缓存，只读共享）
const geoCache = new Map();
// 原点 = 左端基线；挤出字在 z 上居中
export function textGeo(fk, text, { size = 1, depth = 0, bevel = 0, curve = 5 } = {}) {
  const key = `${fk}|${text}|${size.toFixed(4)}|${depth}|${bevel}|${curve}`;
  let g = geoCache.get(key);
  if (!g) {
    if (!depth) {
      g = new THREE.ShapeGeometry(font(fk).generateShapes(text, size), curve);
    } else {
      g = new TextGeometry(text, {
        font: font(fk), size, depth, curveSegments: curve,
        bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel * 0.55, bevelSegments: 2,
      });
      g.translate(0, 0, -depth / 2);
    }
    g.computeBoundingBox();
    geoCache.set(key, g);
  }
  return g;
}

let matcapTex = null;
function matcap() {
  if (!matcapTex) {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(46, 40, 4, 64, 64, 64);
    gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.5, '#c4c4c4'); gr.addColorStop(0.8, '#858585'); gr.addColorStop(0.92, '#6c6c6c'); gr.addColorStop(1, '#d8d8d8');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    matcapTex = new THREE.CanvasTexture(c);
    matcapTex.colorSpace = THREE.SRGBColorSpace;
  }
  return matcapTex;
}
const darken = (hex, k) => '#' + new THREE.Color(hex).multiplyScalar(k).getHexString();
const sideOf = (color, side) => side ?? (new THREE.Color(color).getHSL({}).l < 0.12 ? '#4a4a5c' : darken(color, 0.62));
// 挤出字材质：[正面 flat, 侧面 matcap]
export function mats(color, side, { transparent = false } = {}) {
  return [
    new THREE.MeshBasicMaterial({ color, transparent }),
    new THREE.MeshMatcapMaterial({ color: sideOf(color, side), matcap: matcap(), transparent }),
  ];
}
function setOpacity(m, o) {
  for (const x of Array.isArray(m) ? m : [m]) { x.opacity = o; x.transparent = true; x.depthWrite = o > 0.99; }
}
function setColor(m, color, side) {
  const [a, b] = Array.isArray(m) ? m : [m];
  a.color.set(color);
  if (b) b.color.set(sideOf(color, side));
}

// 一个词的节点：pivot 在词的视觉中心（便于缩放/旋转），mesh 在 pivot 内偏移回左基线
function wordNode(it, geo, material, ch) {
  const pivot = new THREE.Group();
  const cy = it.s * ch / 2;
  pivot.position.set(it.x + it.w / 2, it.y + cy, 0);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(-it.w / 2, -cy, 0);
  pivot.add(mesh);
  pivot.userData.mesh = mesh;
  return pivot;
}

// 在几何表面上按面积均匀采样 n 个点（frontOnly：只取法线朝 +z 的面，字形正面）
export function samplePoints(geo, n, seed = 1, { frontOnly = false } = {}) {
  const pos = geo.attributes.position, idx = geo.index;
  const tri = i => (idx ? [idx.getX(i * 3), idx.getX(i * 3 + 1), idx.getX(i * 3 + 2)] : [i * 3, i * 3 + 1, i * 3 + 2]);
  const nt = (idx ? idx.count : pos.count) / 3;
  const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3(), e1 = new THREE.Vector3(), e2 = new THREE.Vector3();
  const tris = [], cum = [];
  let total = 0;
  for (let i = 0; i < nt; i++) {
    const [a, b, c] = tri(i);
    A.fromBufferAttribute(pos, a); B.fromBufferAttribute(pos, b); C.fromBufferAttribute(pos, c);
    e1.subVectors(B, A); e2.subVectors(C, A);
    const cr = e1.clone().cross(e2);
    const area = cr.length() / 2;
    if (area < 1e-9) continue;
    if (frontOnly && cr.z / (2 * area) < 0.5) continue;
    total += area;
    tris.push([a, b, c]); cum.push(total);
  }
  const r = mulberry32(seed), out = new Float32Array(n * 3);
  for (let k = 0; k < n; k++) {
    const x = r() * total;
    let lo = 0, hi = cum.length - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < x) lo = m + 1; else hi = m; }
    const [a, b, c] = tris[lo];
    A.fromBufferAttribute(pos, a); B.fromBufferAttribute(pos, b); C.fromBufferAttribute(pos, c);
    let u = r(), v = r();
    if (u + v > 1) { u = 1 - u; v = 1 - v; }
    out[k * 3] = A.x + (B.x - A.x) * u + (C.x - A.x) * v;
    out[k * 3 + 1] = A.y + (B.y - A.y) * u + (C.y - A.y) * v;
    out[k * 3 + 2] = A.z + (B.z - A.z) * u + (C.z - A.z) * v;
  }
  return out;
}

let dotTex = null;
function dot() {   // 圆点贴图，粒子用
  if (!dotTex) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.55, 'rgba(255,255,255,0.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    dotTex = new THREE.CanvasTexture(c);
  }
  return dotTex;
}
// size 按「世界单位直径」给：three 的 sizeAttenuation 像素 = size·(H/2)/depth，透视投影像素 = d·H/(2·tan(fov/2)·depth)，fov 30° 时 size = d / tan15° ≈ 3.73d
const PT = 1 / (2 * Math.tan(15 * Math.PI / 180)) * 2;
function pointsMat(size, { color = '#fff', vertexColors = false } = {}) {
  return new THREE.PointsMaterial({ size: size * PT, color, vertexColors, map: dot(), transparent: true, depthWrite: false, alphaTest: 0.02 });
}

// 粗线（Line2）：LineMaterial 需要像素分辨率
const RES = new THREE.Vector2(1920, 1080);
export function lineMat(color, width = 4, opacity = 1) {
  return new LineMaterial({ color, linewidth: width, resolution: RES, transparent: opacity < 1, opacity, worldUnits: false });
}
function line2(points, material) {
  const g = new LineGeometry();
  g.setPositions(points.flatMap(p => [p.x, p.y, p.z ?? 0]));
  const l = new Line2(g, material);
  l.computeLineDistances();
  l.userData.nseg = points.length - 1;
  return l;
}
function drawOn(l, p) {  // 0..1：只画前 p 比例的线段
  const n = Math.floor(l.userData.nseg * clamp01(p));
  l.geometry.instanceCount = n;
  l.visible = n > 0;
}

// ---------------------------------------------------------------- 立体机位（#916）
// 字效没有自己的相机，所以「镜头运动」做成组内 rig 的反向变换（绕组原点转 = 环绕，沿 z 近移 = 推镜）。
//   opts.tilt    = [rx, ry, rz] 初始姿态（弧度），默认各字效自带小角度，让挤出侧面和透视露出来
//   opts.camMove = 'push' | 'orbit' | 'swing' | 'pushOrbit' | 'none' | (T, u) => ({x,y,z,rx,ry,rz})，u = 句内进度 0..1
//   opts.drift   = 落地后在 3D 里慢转的幅度（弧度）
//   opts.kick    = 每次落地往镜头推一下的距离
// 全部是 T 的纯函数。
export const CAM = {
  none: () => ({}),
  push: (T, u) => ({ z: 6 * easeOut3(u) }),
  orbit: (T, u) => ({ ry: lerp(-0.35, 0.35, smooth(u)) }),
  swing: (T, u) => { const e = 1 - easeOut3(clamp01(u * 2.5)); return { ry: 0.7 * e, rz: -0.15 * e, z: -4 * e }; },
  pushOrbit: (T, u) => ({ z: 5 * easeOut3(u), ry: lerp(-0.3, 0.25, smooth(u)) }),
};
function makeRig(group, o, span, impacts = []) {
  const rig = new THREE.Group();
  while (group.children.length) rig.add(group.children[0]);
  group.add(rig);
  const [tx, ty, tz] = o.tilt ?? [0, 0, 0];
  const cm = typeof o.camMove === 'function' ? o.camMove : CAM[o.camMove ?? 'none'] ?? CAM.none;
  return T => {
    const u = clamp01((T - span.start) / (span.end - span.start + 1.5));
    const m = cm(T, u) ?? {};
    const k = Math.max(0, T - span.start), dr = o.drift ?? 0.06;
    let kick = 0, roll = 0;
    impacts.forEach((ti, i) => {
      const d = T - ti;
      if (d < 0) return;
      kick += Math.exp(-d * 6);
      roll += Math.exp(-d * 7) * Math.sin(d * 26) * (i % 2 ? 1 : -1);
    });
    rig.rotation.set(tx + (m.rx ?? 0) + dr * 0.45 * Math.sin(k * 0.8 + 1.1),
      ty + (m.ry ?? 0) + dr * Math.sin(k * 0.5 + 0.4),
      tz + (m.rz ?? 0) + 0.03 * roll);
    rig.position.set(m.x ?? 0, m.y ?? 0, (m.z ?? 0) + (o.kick ?? 1.2) * Math.min(1.5, kick));
  };
}

// 震屏：所有已落地的冲击叠加（纯函数）
function shakeAt(t, impacts, amp = 0.35, seed = 1) {
  let x = 0, y = 0;
  impacts.forEach((ti, i) => {
    const k = t - ti;
    if (k < 0 || k > 0.8) return;
    const a = amp * Math.exp(-k * 9);
    x += a * Math.sin(k * 71 + rnd(seed, i) * 6.28);
    y += a * Math.cos(k * 57 + rnd(seed, i, 1) * 6.28);
  });
  return [x, y];
}

// ================================================================ 1. slam
// 纯色底 + 黑色 3D 挤出巨字逐词砸入。opts.scales = { 词序号: 倍率 } 让某个词更大。
function slam(opts) {
  const o = { font: 'anton', color: PAL.ink, upper: true, maxW: 27, maxH: 13.5, maxSize: 7, fall: 0.13, seed: 7,
    depth: 0.55, tilt: [-0.2, 0.34, 0.02], camMove: 'push', drift: 0.07, wordGap: 1.9, ...opts };
  if (!o.side) o.side = o.bg ? darken(o.bg, 0.42) : null;   // 黑字的侧面：底色深一档
  const words = wordsOf(o);
  const L = fitLayout(words, o);
  const group = new THREE.Group(), inner = new THREE.Group();
  group.add(inner);
  const nodes = L.items.map(it => {
    const geo = textGeo(o.font, it.text, { size: it.s, depth: it.s * o.depth, bevel: it.s * 0.025, curve: 4 });
    const node = wordNode(it, geo, mats(o.color, o.side), L.capH);
    const ghosts = [0.34, 0.2, 0.1].map(op => {
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: o.color, transparent: true, opacity: op, depthWrite: false }));
      m.position.copy(node.userData.mesh.position);
      node.add(m);
      return m;
    });
    node.userData.ghosts = ghosts;
    inner.add(node);
    return node;
  });
  const impacts = words.map(w => w.start + o.fall);
  const rig = makeRig(group, o, lineSpan(words), impacts);
  function update(t) {
    rig(t);
    words.forEach((w, i) => {
      const n = nodes[i], k = t - w.start;
      const yaw = (rnd(o.seed, i, 5) - 0.5) * 0.16;
      n.visible = k >= 0;
      if (k < 0) return;
      const p = clamp01(k / o.fall);
      const rz0 = (rnd(o.seed, i) - 0.5) * 0.5;
      const m = n.userData.mesh;
      if (p < 1) {
        const z = lerp(26, 0, easeIn2(p));
        n.position.z = z;
        n.scale.set(1, 1, 1 + 5 * (1 - p));
        n.rotation.z = rz0 * (1 - p);
        n.rotation.y = yaw * (2 - p);
        n.userData.ghosts.forEach((g, j) => { g.visible = true; g.position.z = m.position.z + (j + 1) * 2.2 * (1 - p); });
      } else {
        const sp = spring(k - o.fall);
        n.position.z = 0;
        n.scale.set(1 + 0.14 * sp, 1 - 0.1 * sp, 1);
        n.rotation.z = -rz0 * 0.25 * sp;
        n.rotation.y = yaw * (0.35 + 0.65 * Math.exp(-(k - o.fall) * 5));
        n.userData.ghosts.forEach(g => { g.visible = false; });
      }
    });
    const [sx, sy] = shakeAt(t, impacts, 0.4, o.seed);
    group.position.x = sx; group.position.y = sy;
  }
  return { group, update, words, bounds: { w: L.W, h: L.H } };
}

// ================================================================ 2. burst（FOOM）
function burst(opts) {
  const o = { font: 'anton', small: 'bebas', color: PAL.lemon, smallColor: PAL.paper, upper: true, maxW: 30, seed: 11,
    particles: 3500, fall: 0.12, depth: 0.5, tilt: [-0.16, -0.36, -0.03], camMove: 'push', drift: 0.08, ...opts };
  const words = wordsOf(o);
  const ti = o.target ?? words.length - 1;
  const pre = words.filter(w => w.i !== ti), tw = words[ti];
  const group = new THREE.Group();
  // 前半句：顶部一行小字
  const Ls = fitLayout(pre, { font: o.small, maxW: 24, maxH: 2.2, maxSize: 2.2 });
  const smallMats = mats(o.smallColor, null, { transparent: true });
  const smallNodes = Ls.items.map(it => {
    const n = wordNode(it, textGeo(o.small, it.text, { size: it.s, depth: it.s * 0.15 }), smallMats, Ls.capH);
    n.position.y += 6.2;
    group.add(n);
    return n;
  });
  // 关键词：巨字
  const Lb = fitLayout([{ ...tw, i: 0 }], { font: o.font, maxW: 27, maxH: 9.5, maxSize: 12 });
  const it = Lb.items[0];
  const bigGeo = textGeo(o.font, it.text, { size: it.s, depth: it.s * o.depth, bevel: it.s * 0.025, curve: 4 });
  const big = wordNode(it, bigGeo, mats(o.color, o.side ?? PAL.pink), Lb.capH);
  big.position.y -= 1;
  group.add(big);
  const ghosts = [0.3, 0.16].map(op => {
    const m = new THREE.Mesh(bigGeo, new THREE.MeshBasicMaterial({ color: o.color, transparent: true, opacity: op, depthWrite: false }));
    m.position.copy(big.userData.mesh.position);
    big.add(m);
    return m;
  });
  // 粒子：从巨字表面采样，位置相对 big pivot
  const base = samplePoints(bigGeo, o.particles, o.seed);
  const mp = big.userData.mesh.position;
  const N = o.particles, cols = new Float32Array(N * 3), vel = new Float32Array(N * 3);
  const palette = [PAL.lemon, PAL.pink, PAL.paper, PAL.lemon].map(c => new THREE.Color(c));
  for (let k = 0; k < N; k++) {
    base[k * 3] += mp.x; base[k * 3 + 1] += mp.y; base[k * 3 + 2] += mp.z;
    const c = palette[Math.floor(rnd(o.seed, k, 3) * palette.length)];
    cols.set([c.r, c.g, c.b], k * 3);
    const dx = base[k * 3], dy = base[k * 3 + 1];
    const d = Math.hypot(dx, dy) + 0.5, sp = 26 + 40 * rnd(o.seed, k, 4);
    vel[k * 3] = dx / d * sp + (rnd(o.seed, k, 5) - 0.5) * 8;
    vel[k * 3 + 1] = dy / d * sp + (rnd(o.seed, k, 6) - 0.5) * 8;
    vel[k * 3 + 2] = (rnd(o.seed, k, 7) - 0.2) * 50;
  }
  const pg = new THREE.BufferGeometry();
  const ppos = new Float32Array(N * 3);
  pg.setAttribute('position', new THREE.BufferAttribute(ppos, 3));
  pg.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  const pm = pointsMat(0.13, { vertexColors: true });
  const pts = new THREE.Points(pg, pm);
  pts.frustumCulled = false;
  big.add(pts);
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.93, 1, 128), new THREE.MeshBasicMaterial({ color: o.color, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
  ring.position.y = big.position.y;
  group.add(ring);
  const tBoom = tw.start + (o.boomAfter ?? Math.min(0.45, Math.max(0.25, (tw.end - tw.start) * 0.5)));
  const impacts = [tw.start + o.fall, tBoom];
  const rig = makeRig(group, o, lineSpan(words), impacts);
  let lastK = NaN;
  function update(t) {
    rig(t);
    pre.forEach((w, j) => {
      const n = smallNodes[j], k = t - w.start;
      n.visible = k >= 0;
      if (k < 0) return;
      const s = easeOutBack(clamp01(k / 0.2));
      n.scale.setScalar(Math.max(0.001, s));
    });
    { const kb0 = t - tBoom; setOpacity(smallMats, kb0 < 0 ? 1 : kb0 < 0.1 ? lerp(1, 0.35, kb0 / 0.1) : lerp(0.35, 1, smooth(clamp01((kb0 - 0.1) / 0.5)))); }  // 爆时让位，爆完回到这行字
    const k = t - tw.start, kb = t - tBoom;
    big.visible = k >= 0;
    const m = big.userData.mesh;
    m.visible = k >= 0 && kb < 0.05;
    if (k >= 0 && k < o.fall) {
      const p = k / o.fall;
      big.position.z = lerp(24, 0, easeIn2(p));
      big.scale.set(1, 1, 1 + 4 * (1 - p));
      ghosts.forEach((g, j) => { g.visible = true; g.position.z = mp.z + (j + 1) * 2.5 * (1 - p); });
    } else {
      big.position.z = 0;
      // 落地过冲，爆前一瞬膨胀
      const sw = 1 + 0.12 * spring(k - o.fall) + (kb > -0.12 && kb < 0.05 ? 0.14 * clamp01((kb + 0.12) / 0.12) : 0);
      big.scale.set(sw, sw, 1);
      ghosts.forEach(g => { g.visible = false; });
    }
    ghosts.forEach(g => { if (kb >= 0.05) g.visible = false; });
    // 粒子
    pts.visible = kb >= 0 && kb < 0.6;   // 0.4 s 内飞出画面 / 熄灭，不留满屏碎点
    if (pts.visible && kb !== lastK) {
      const drag = 1.2, f = (1 - Math.exp(-kb * drag)) / drag;
      for (let q = 0; q < N * 3; q += 3) {
        ppos[q] = base[q] + vel[q] * f;
        ppos[q + 1] = base[q + 1] + vel[q + 1] * f - 3 * kb * kb;
        ppos[q + 2] = base[q + 2] + vel[q + 2] * f;
      }
      pg.attributes.position.needsUpdate = true;
      lastK = kb;
    }
    pm.opacity = 1 - smooth(clamp01((kb - 0.12) / 0.33));
    pm.size = PT * 0.13 * (1 - 0.4 * clamp01(kb / 1.5));
    // 冲击环
    ring.visible = kb >= 0 && kb < 0.9;
    const rp = clamp01(kb / 0.9);
    ring.scale.setScalar(1 + 26 * easeOut3(rp));
    ring.material.opacity = 1 - rp;
    const [sx, sy] = shakeAt(t, impacts, 0.5, o.seed);
    group.position.x = sx; group.position.y = sy;
  }
  return { group, update, words, bounds: { w: Lb.W, h: Lb.H + 8 } };
}

// ================================================================ 3. reform（粒子汇聚成字）
function reform(opts) {
  const o = { font: 'anton', color: PAL.mint, color2: PAL.paper, upper: true, maxW: 30, maxH: 12, maxSize: 5.5,
    density: 900, conv: 0.7, seed: 21, ...opts };
  const words = wordsOf(o);
  const L = fitLayout(words, o);
  const group = new THREE.Group();
  const c1 = new THREE.Color(o.color), c2 = new THREE.Color(o.color2);
  const parts = L.items.map((it, wi) => {
    const geo = textGeo(o.font, it.text, { size: it.s });
    const area = it.w * it.s * L.capH;
    const n = Math.round(o.density * area / 4) + 200;
    const tgt = samplePoints(geo, n, o.seed + wi * 17);
    const from = new Float32Array(n * 3), cols = new Float32Array(n * 3), del = new Float32Array(n);
    for (let k = 0; k < n; k++) {
      tgt[k * 3] += it.x; tgt[k * 3 + 1] += it.y;
      tgt[k * 3 + 2] = (rnd(o.seed, wi, k) - 0.5) * 0.25;
      const th = rnd(o.seed, k, wi * 3 + 1) * Math.PI * 2, ph = Math.acos(2 * rnd(o.seed, k, wi * 3 + 2) - 1);
      const r = 5 + 12 * rnd(o.seed, k, wi * 3 + 7);
      from[k * 3] = tgt[k * 3] + r * Math.sin(ph) * Math.cos(th);
      from[k * 3 + 1] = tgt[k * 3 + 1] + r * Math.sin(ph) * Math.sin(th) * 0.7;
      from[k * 3 + 2] = r * Math.cos(ph) + 4;
      const c = c1.clone().lerp(c2, clamp01((tgt[k * 3] - it.x) / it.w) * 0.8);
      cols.set([c.r, c.g, c.b], k * 3);
      del[k] = rnd(o.seed, k, wi + 99) * 0.28;
    }
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3);
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    const p = new THREE.Points(g, pointsMat(Math.max(0.09, it.s * 0.035), { vertexColors: true }));
    p.frustumCulled = false;
    group.add(p);
    return { p, g, pos, tgt, from, del, n, lastK: NaN };
  });
  function update(t) {
    words.forEach((w, i) => {
      const P = parts[i], k = t - w.start;
      P.p.visible = k >= 0;
      if (k < 0) return;
      const kk = Math.min(k, o.conv + 0.3 + 4);   // 汇聚完后只剩呼吸
      if (kk === P.lastK) return;
      for (let q = 0, j = 0; j < P.n; j++, q += 3) {
        const e = easeOut3(clamp01((kk - P.del[j]) / o.conv));
        const sw = (1 - e) * 1.6;
        const br = e >= 1 ? 0.03 * Math.sin(kk * 3 + j) : 0;
        P.pos[q] = lerp(P.from[q], P.tgt[q], e) + sw * Math.sin(kk * 6 + j * 0.37);
        P.pos[q + 1] = lerp(P.from[q + 1], P.tgt[q + 1], e) + sw * Math.cos(kk * 5 + j * 0.53) + br;
        P.pos[q + 2] = lerp(P.from[q + 2], P.tgt[q + 2], e);
      }
      P.g.attributes.position.needsUpdate = true;
      P.lastK = kk;
    });
  }
  return { group, update, words, bounds: { w: L.W, h: L.H } };
}

// ================================================================ 4. wall（滚动字墙 + 前景色带）
function wall(opts) {
  const o = { font: 'bebas', color: PAL.pink, wallColor: PAL.paper, band: PAL.ink, upper: true, rows: 13, seed: 31,
    maxW: 28, maxH: 4.2, maxSize: 4.2, ...opts };
  const words = wordsOf(o);
  const group = new THREE.Group();
  const wallG = new THREE.Group();
  wallG.position.z = -8;
  group.add(wallG);
  const unit = words.map(w => w.text).join('  /  ') + '  /  ';
  const rs = 1.5, pitch = 2.05, W = 90;
  const period = advance(o.font, unit, rs);
  const reps = Math.ceil((W + period) / period) + 1;
  const rowGeo = textGeo(o.font, unit.repeat(reps), { size: rs, curve: 3 });
  const wallMat = new THREE.MeshBasicMaterial({ color: o.wallColor, transparent: true, opacity: 0.12, depthWrite: false });
  const rows = [];
  for (let r = 0; r < o.rows; r++) {
    const m = new THREE.Mesh(rowGeo, wallMat);
    m.position.y = (r - (o.rows - 1) / 2) * pitch - rs * 0.35;
    wallG.add(m);
    rows.push({ m, dir: r % 2 ? -1 : 1, sp: 1.4 + 1.6 * rnd(o.seed, r), ph: rnd(o.seed, r, 2) * period });
  }
  // 前景色带 + 逐词亮起
  const L = fitLayout(words, o);
  const band = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: o.band }));
  band.position.z = -1;
  group.add(band);
  const fg = L.items.map(it => {
    const n = wordNode(it, textGeo(o.font, it.text, { size: it.s, depth: it.s * 0.25, bevel: it.s * 0.015 }), mats(o.color), L.capH);
    group.add(n);
    return n;
  });
  const span = lineSpan(words);
  function update(t) {
    const u = clamp01((t - span.start + 0.6) / (span.end - span.start + 2));
    wallG.rotation.y = lerp(-0.42, -0.18, u);
    wallG.rotation.x = 0.05;
    for (const r of rows) {
      const off = ((t * r.sp + r.ph) % period + period) % period;
      r.m.position.x = -W / 2 - (r.dir > 0 ? off : period - off);
    }
    // 每个词起音让墙亮一下
    let pulse = 0;
    for (const w of words) { const k = t - w.start; if (k >= 0) pulse += Math.exp(-k * 5); }
    wallMat.opacity = 0.1 + 0.14 * Math.min(1, pulse);
    // 色带在句子开始时横向展开
    const bp = easeOut3(clamp01((t - span.start + 0.25) / 0.35));
    band.visible = bp > 0;
    band.scale.set(Math.max(0.001, (L.W + 3) * bp), L.H + 2.2, 1);
    words.forEach((w, i) => {
      const n = fg[i], k = t - w.start;
      n.visible = k >= 0;
      if (k < 0) return;
      const e = easeOutBack(clamp01(k / 0.22));
      n.scale.setScalar(Math.max(0.001, e));
      n.position.z = lerp(3, 0, clamp01(k / 0.22));
    });
  }
  return { group, update, words, bounds: { w: L.W + 3, h: L.H + 2.2 } };
}

// ================================================================ 5. outline（空心描边 + 彩色回声）
function contoursOf(fk, text, size, div = 6) {
  const out = [];
  for (const s of font(fk).generateShapes(text, size)) {
    for (const path of [s, ...s.holes]) {
      const pts = path.getPoints(div);
      if (pts.length > 1) out.push([...pts, pts[0]]);
    }
  }
  return out;
}
function outline(opts) {
  const o = { font: 'bungee', colors: [PAL.lemon, PAL.pink, PAL.mint, PAL.pink], widths: [6, 4, 3, 2], upper: true,
    maxW: 28, maxH: 12.5, maxSize: 5.5, draw: 0.45, depth: 3.6, tilt: [-0.14, 0.42, 0], camMove: 'orbit', drift: 0.05, seed: 41, ...opts };
  o.layerGap ??= o.depth / Math.max(1, o.colors.length - 1);
  const words = wordsOf(o);
  const L = fitLayout(words, o);
  const group = new THREE.Group();
  const layerMats = o.colors.map((c, j) => lineMat(c, o.widths[j] ?? 2, j ? [1, 0.7, 0.45, 0.28][j] ?? 0.2 : 1));
  const layers = o.colors.map((_, j) => { const g = new THREE.Group(); g.position.z = -j * o.layerGap; group.add(g); return g; });
  const perWord = L.items.map(it => {
    const cs = contoursOf(o.font, it.text, it.s);
    return layers.map((lg, j) => {
      const wg = new THREE.Group();
      wg.position.set(it.x, it.y, 0);
      lg.add(wg);
      return cs.map(c => { const l = line2(c, layerMats[j]); wg.add(l); return l; });
    });
  });
  const rig = makeRig(group, o, lineSpan(words), words.map(w => w.start));
  function update(t) {
    rig(t);
    layers.forEach((lg, j) => {
      if (!j) return;
      lg.position.x = Math.sin(t * 1.7 + j * 1.3) * 0.18 * j;
      lg.position.y = Math.cos(t * 1.25 + j * 0.9) * 0.12 * j;
    });
    words.forEach((w, i) => {
      perWord[i].forEach((ls, j) => {
        const p = clamp01((t - w.start - j * 0.07) / o.draw);
        for (const l of ls) drawOn(l, t < w.start ? 0 : smooth(p));
      });
    });
  }
  return { group, update, words, bounds: { w: L.W, h: L.H } };
}

// ================================================================ 6. hud（护目镜标签）
function hud(opts) {
  const o = { font: 'mono', color: PAL.lemon, frame: PAL.mint, upper: true, size: 1.25, seed: 51, center: [0, 0],
    slots: null, tilt: [0.1, -0.28, 0], camMove: 'orbit', drift: 0.05, kick: 0.5, yaw: 0.38, ...opts };
  const words = wordsOf(o);
  const group = new THREE.Group();
  const n = words.length;
  // 左右交替、同侧相邻标签间距 5.0（框高约 3.8，加倾斜后留余量），整体上下居中
  const nr = Math.ceil(words.length / 2);
  const slots = o.slots ?? words.map((_, i) => [(i % 2 ? 1 : -1) * (10.5 - 0.8 * (Math.floor(i / 2) % 2)), (nr - 1) * 2.5 + 0.8 - Math.floor(i / 2) * 5.0 - (i % 2) * 1.6]);
  // 中心准星（给主体留位，不放字）
  const ring = [];
  for (let a = 0; a <= 96; a++) ring.push(new THREE.Vector3(Math.cos(a / 96 * Math.PI * 2) * 3.2, Math.sin(a / 96 * Math.PI * 2) * 3.2, 0));
  const retMat = lineMat(o.frame, 2, 0.45);
  const ret = line2(ring, retMat);
  const retG = new THREE.Group();
  retG.position.set(o.center[0], o.center[1], 0);
  retG.add(ret);
  for (let q = 0; q < 4; q++) {
    const a = q * Math.PI / 2;
    const tick = line2([new THREE.Vector3(Math.cos(a) * 2.6, Math.sin(a) * 2.6, 0), new THREE.Vector3(Math.cos(a) * 3.8, Math.sin(a) * 3.8, 0)], retMat);
    retG.add(tick);
  }
  group.add(retG);
  const digits = '0123456789:.-T';
  const tags = words.map((w, i) => {
    const g = new THREE.Group();
    const [sx, sy] = slots[i];
    g.position.set(sx, sy, (i % 2 ? 1.5 : -1.5) + (Math.floor(i / 2) % 2 ? 1 : 0));
    g.rotation.y = -Math.sign(sx - o.center[0]) * o.yaw;
    group.add(g);
    const s = o.size, adv = advance(o.font, 'M', s);
    const tw = adv * w.text.length, th = s * capH(o.font);
    const pad = s * 0.45, bw = Math.max(tw, adv * 11) + pad * 2, bh = th + s * 1.4 + pad * 2;
    const x0 = -bw / 2, y0 = -bh / 2;
    const tm = new THREE.MeshBasicMaterial({ color: o.color, transparent: true });
    const chars = [...w.text].map((ch, j) => {
      const m = new THREE.Mesh(textGeo(o.font, ch, { size: s, curve: 3 }), tm);
      m.position.set(x0 + pad + j * adv, y0 + bh - pad - th, 0);
      g.add(m);
      return m;
    });
    // 读数：T-00:03.21，逐帧换缓存字形
    const rs = s * 0.62, radv = advance(o.font, 'M', rs);
    const rm = new THREE.MeshBasicMaterial({ color: o.frame, transparent: true });
    const readout = Array.from({ length: 10 }, (_, j) => {
      const m = new THREE.Mesh(textGeo(o.font, '0', { size: rs, curve: 2 }), rm);
      m.position.set(x0 + pad + j * radv, y0 + pad, 0);
      g.add(m);
      return m;
    });
    const glyphs = Object.fromEntries([...digits].map(c => [c, textGeo(o.font, c, { size: rs, curve: 2 })]));
    // 角括号
    const fm = lineMat(o.frame, 3);
    const cl = Math.min(bw, bh) * 0.28;
    const corners = [[x0, y0, 1, 1], [x0 + bw, y0, -1, 1], [x0, y0 + bh, 1, -1], [x0 + bw, y0 + bh, -1, -1]].map(([cx, cy, dx, dy]) =>
      line2([new THREE.Vector3(cx + dx * cl, cy, 0), new THREE.Vector3(cx, cy, 0), new THREE.Vector3(cx, cy + dy * cl, 0)], fm));
    const box = new THREE.Group();
    corners.forEach(c => box.add(c));
    g.add(box);
    // 引线：从框的内侧边到中心环上的目标点
    const ang = Math.atan2(sy - o.center[1], sx - o.center[0]) + (rnd(o.seed, i) - 0.5) * 0.5;
    g.updateMatrix();
    const tgt = new THREE.Vector3(o.center[0] + Math.cos(ang) * 3.2, o.center[1] + Math.sin(ang) * 3.2, 0).applyMatrix4(g.matrix.clone().invert());
    const tx = tgt.x, ty = tgt.y, tz = tgt.z;
    const ex = sx > o.center[0] ? x0 : x0 + bw, ey = 0;
    const lead = [];
    for (let q = 0; q <= 16; q++) {
      const p = q / 16, mx = lerp(ex, tx, Math.min(1, p * 1.6));
      lead.push(new THREE.Vector3(mx, lerp(ey, ty, p), lerp(0, tz, p)));
    }
    const lm = lineMat(o.color, 2, 0.8);
    const leader = line2(lead, lm);
    g.add(leader);
    const pip = new THREE.Mesh(new THREE.RingGeometry(0.22, 0.34, 24), new THREE.MeshBasicMaterial({ color: o.color, transparent: true }));
    pip.position.set(tx, ty, tz);
    g.add(pip);
    return { g, chars, readout, glyphs, box, fm, tm, rm, lm, leader, pip, base: 3 + rnd(o.seed, i, 9) * 6 };
  });
  const span = lineSpan(words);
  const rig = makeRig(group, o, span, words.map(w => w.start));
  function update(t) {
    rig(t);
    const rk = t - span.start;
    retG.visible = rk >= 0;
    retG.rotation.z = rk * 0.35;
    retG.scale.setScalar(Math.max(0.001, easeOutBack(clamp01(rk / 0.3))));
    words.forEach((w, i) => {
      const T = tags[i], k = t - w.start;
      T.g.visible = k >= 0;
      if (k < 0) return;
      // 下一个词出现后，旧标签退到半亮：一次只看一件事
      const nx = words[i + 1];
      const dim = nx ? 1 - 0.55 * clamp01((t - nx.start) / 0.2) : 1;
      const blink = k < 0.22 ? (Math.floor(k / 0.055) % 2 === 0 ? 1 : 0.25) : 1;
      T.fm.opacity = dim * blink; T.fm.transparent = true;
      T.tm.opacity = T.rm.opacity = dim;
      T.lm.opacity = 0.8 * dim;
      T.pip.material.opacity = dim;
      const bs = easeOutBack(clamp01(k / 0.16));
      T.box.scale.set(Math.max(0.001, bs), Math.max(0.001, bs), 1);
      const typed = Math.floor(k / 0.035) + 1;
      T.chars.forEach((m, j) => { m.visible = j < typed; });
      drawOn(T.leader, clamp01((k - 0.1) / 0.25));
      T.pip.visible = k > 0.3;
      T.pip.scale.setScalar(1 + 0.4 * Math.max(0, Math.sin(k * 9)));
      // 倒计时读数
      const v = Math.max(0, T.base - k);
      const str = `T-${String(Math.floor(v / 60)).padStart(2, '0')}:${(v % 60).toFixed(2).padStart(5, '0')}`;
      T.readout.forEach((m, j) => {
        const c = str[j];
        m.visible = !!c && c !== ' ' && k > 0.18;
        if (c && T.glyphs[c]) m.geometry = T.glyphs[c];
      });
    });
  }
  return { group, update, words, bounds: { w: 30, h: 14 } };
}

// ================================================================ 7. curve（字沿 3D 曲线）
function curve(opts) {
  const o = { font: 'bebas', color: PAL.paper, accent: PAL.lemon, lineColor: PAL.mint, upper: true, seed: 61,
    points: [[-17, 6, -2], [-11, 5.6, 1], [-6, 4.9, 0], [-3, 3.6, -1], [-1.2, 0.6, 0], [1.2, -3.0, 1], [5, -4.7, 0], [10, -5.1, -1], [17, -5.3, 0]],
    ...opts };
  const words = wordsOf(o);
  const pts = o.points.map(p => new THREE.Vector3(...p));
  const cv = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  const Lc = cv.getLength();
  const group = new THREE.Group();
  const lineG = line2(cv.getSpacedPoints(400), lineMat(o.lineColor, 5));
  group.add(lineG);
  // opts.tube > 0：曲线本身做成发光粗管（半径 = tube），随唱随长；字相应抬高 lift
  const TS = 400, TR = 12;
  const tube = o.tube > 0 ? new THREE.Mesh(new THREE.TubeGeometry(cv, TS, o.tube, TR, false),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(o.lineColor).multiplyScalar(o.tubeGlow ?? 2.2) })) : null;
  if (tube) group.add(tube);
  const lift = o.lift ?? (o.tube > 0 ? o.tube + 0.15 : 0.12);
  const state = { u: 0 };
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 12), new THREE.MeshBasicMaterial({ color: o.accent }));
  group.add(head);
  // 字号：整句铺满 ~90% 弧长
  const full = words.map(w => w.text).join(' ');
  const track = 1.08;
  const size = Math.min(2.4, Lc * 0.88 / (advance(o.font, full, 1) * track));
  const sp = advance(o.font, ' ', size);
  let s = Lc * 0.05;
  const ch = capH(o.font);
  const X = new THREE.Vector3(), Y = new THREE.Vector3(), Z = new THREE.Vector3(0, 0, 1), M = new THREE.Matrix4();
  const wd = words.map((w, wi) => {
    const m = mats(o.color, PAL.mint, { transparent: true });
    const chars = [...w.text].map(c => {
      const a = advance(o.font, c, size);
      const u = (s + a * track / 2) / Lc;
      s += a * track;
      const p = cv.getPointAt(u), tg = cv.getTangentAt(u);
      X.copy(tg).normalize();
      Y.crossVectors(Z, X).normalize();
      const Zb = new THREE.Vector3().crossVectors(X, Y);
      M.makeBasis(X, Y, Zb);
      const holder = new THREE.Group();
      holder.position.copy(p).addScaledVector(Y, lift);
      holder.quaternion.setFromRotationMatrix(M);
      const mesh = new THREE.Mesh(textGeo(o.font, c, { size, depth: size * 0.18, curve: 4 }), m);
      mesh.position.set(-a / 2, 0, 0);
      holder.add(mesh);
      group.add(holder);
      return { holder, mesh, u, Y: Y.clone(), base: holder.position.clone() };
    });
    const uEnd = s / Lc;
    s += sp;
    return { chars, m, uEnd, uStart: chars[0]?.u ?? uEnd };
  });
  const span = lineSpan(words);
  function update(t) {
    const u = clamp01((t - span.start) / (span.end - span.start + 1.5));
    group.rotation.y = lerp(-0.28, 0.12, u);
    group.rotation.x = lerp(0.12, 0.02, u);
    // 画线进度 = 当前词末端，词内按 p 插值
    let uh = 0;
    words.forEach((w, i) => {
      const st = wordState(w, t);
      if (st.state === 'pending') return;
      uh = Math.max(uh, lerp(wd[i].uStart, wd[i].uEnd, Math.min(1, st.p * 1.3)));
    });
    if (t >= span.end) uh = Math.max(uh, lerp(wd[wd.length - 1].uEnd, 1, clamp01((t - span.end) / 0.8)));
    drawOn(lineG, t < span.start ? 0 : Math.max(0.03, uh));
    const ud = t < span.start ? 0 : Math.max(0.03, uh);
    if (tube) { tube.visible = ud > 0; tube.geometry.setDrawRange(0, 6 * TR * Math.floor(TS * ud)); }
    state.u = ud;
    head.visible = t >= span.start && uh < 0.999;
    head.position.copy(cv.getPointAt(Math.max(0.001, uh)));
    words.forEach((w, i) => {
      const W = wd[i], k = t - w.start;
      const cur = k >= 0 && (i === words.length - 1 || t < words[i + 1].start + 0.15);
      setColor(W.m, cur ? o.accent : o.color, PAL.mint);
      W.chars.forEach((c, j) => {
        const kk = k - j * 0.035;
        c.holder.visible = kk >= 0;
        if (kk < 0) return;
        const e = easeOutBack(clamp01(kk / 0.2));
        c.mesh.scale.set(1, Math.max(0.001, e), 1);
        c.holder.position.copy(c.base).addScaledVector(c.Y, 0.9 * (1 - clamp01(kk / 0.2)));
      });
    });
  }
  // head：画线的笔尖（组内坐标）；curve / state.u：给镜头跟拍用
  return { group, update, words, bounds: { w: 34, h: 12 }, head, curve: cv, state };
}

// ================================================================ 8. singularity（卷入奇点）
function singularity(opts) {
  const o = { font: 'anton', color: PAL.paper, upper: true, maxW: 30, maxH: 6.5, maxSize: 4.5, seed: 71,
    center: [0, -4.2, 0], pull: 'after', pullDelay: 0.15, pullGap: 0.16, pullDur: 1.3, ...opts };
  const words = wordsOf(o);
  const L = fitLayout(words, o);
  const group = new THREE.Group();
  const C = new THREE.Vector3(...o.center);
  const wd = L.items.map(it => {
    const src = textGeo(o.font, it.text, { size: it.s, depth: it.s * 0.22, curve: 4 });
    const geo = src.clone();
    geo.translate(it.x, it.y + 4.3, 0);
    const orig = geo.attributes.position.array.slice();
    let rmax = 0;
    for (let q = 0; q < orig.length; q += 3) rmax = Math.max(rmax, Math.hypot(orig[q] - C.x, orig[q + 1] - C.y));
    const mesh = new THREE.Mesh(geo, mats(o.color, PAL.pink));
    mesh.frustumCulled = false;
    group.add(mesh);
    return { mesh, geo, orig, rmax, lastQ: -1, cx: it.x + it.w / 2 };
  });
  // 奇点：吸积盘粒子 + 光环 + 黑核
  const sg = new THREE.Group();
  sg.position.copy(C);
  group.add(sg);
  const ND = 2400, dpos = new Float32Array(ND * 3), dcol = new Float32Array(ND * 3), drad = new Float32Array(ND), dph = new Float32Array(ND);
  const cA = new THREE.Color(PAL.lemon), cB = new THREE.Color(PAL.pink);
  for (let k = 0; k < ND; k++) {
    drad[k] = 1.5 + 3.2 * rnd(o.seed, k) ** 1.6;
    dph[k] = rnd(o.seed, k, 1) * Math.PI * 2;
    const c = cA.clone().lerp(cB, clamp01((drad[k] - 1.5) / 3));
    dcol.set([c.r, c.g, c.b], k * 3);
  }
  const dg = new THREE.BufferGeometry();
  dg.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
  dg.setAttribute('color', new THREE.BufferAttribute(dcol, 3));
  const dm = pointsMat(0.12, { vertexColors: true });
  const disk = new THREE.Points(dg, dm);
  disk.frustumCulled = false;
  disk.rotation.x = 1.18;
  sg.add(disk);
  const halo = [];
  for (let a = 0; a <= 120; a++) halo.push(new THREE.Vector3(Math.cos(a / 120 * Math.PI * 2) * 1.25, Math.sin(a / 120 * Math.PI * 2) * 1.25, 0));
  const haloL = line2(halo, lineMat(PAL.lemon, 4));
  sg.add(haloL);
  const core = new THREE.Mesh(new THREE.CircleGeometry(1.18, 64), new THREE.MeshBasicMaterial({ color: '#000' }));
  core.position.z = 0.05;
  sg.add(core);
  const pullAt = o.pull === 'each'
    ? words.map((w, i) => w.end + 0.35 + (i === words.length - 1 ? 0.3 : 0))
    : words.map((w, i) => words[words.length - 1].end + o.pullDelay + i * o.pullGap);
  const span = lineSpan(words);
  function update(t) {
    const sk = t - span.start;
    sg.visible = sk >= -0.001;
    // 吃进去的词越多，奇点越大
    let fed = 0;
    words.forEach((w, i) => { fed += clamp01((t - pullAt[i]) / o.pullDur); });
    const S = Math.max(0.001, easeOutBack(clamp01(sk / 0.5))) * (0.7 + 0.18 * fed);
    sg.scale.setScalar(S);
    for (let k = 0; k < ND; k++) {
      const a = dph[k] + t * (2.4 / Math.sqrt(drad[k]));
      dpos[k * 3] = Math.cos(a) * drad[k];
      dpos[k * 3 + 1] = Math.sin(a) * drad[k];
      dpos[k * 3 + 2] = (rnd(o.seed, k, 2) - 0.5) * 0.15;
    }
    dg.attributes.position.needsUpdate = true;
    words.forEach((w, i) => {
      const W = wd[i], k = t - w.start;
      W.mesh.visible = k >= 0;
      if (k < 0) return;
      const pop = easeOutBack(clamp01(k / 0.2));
      const q = clamp01((t - pullAt[i]) / o.pullDur);
      W.mesh.visible = q < 0.999;
      // 出现时的弹入用整体缩放（绕词中心近似：缩放 pivot 放在组内 y）
      W.mesh.scale.setScalar(1);
      if (q !== W.lastQ || pop < 1) {
        const pos = W.geo.attributes.position.array, or = W.orig;
        for (let v = 0; v < or.length; v += 3) {
          let x = or[v], y = or[v + 1], z = or[v + 2];
          if (pop < 1) { const cy = 4.3 + L.items[i].y + L.items[i].s * L.capH / 2; x = W.cx + (x - W.cx) * pop; y = cy + (y - cy) * pop; z *= pop; }
          if (q > 0) {
            const dx = x - C.x, dy = y - C.y, r = Math.hypot(dx, dy);
            const f = smooth(clamp01(q * 1.9 - (r / W.rmax) * 0.9));
            const th = Math.atan2(dy, dx) + f * f * 2.8;
            const rr = r * (1 - f) ** 1.3;
            x = C.x + Math.cos(th) * rr; y = C.y + Math.sin(th) * rr; z *= 1 - f;
          }
          pos[v] = x; pos[v + 1] = y; pos[v + 2] = z;
        }
        W.geo.attributes.position.needsUpdate = true;
        W.lastQ = pop < 1 ? -1 : q;
      }
    });
  }
  return { group, update, words, bounds: { w: L.W, h: 14 } };
}

// ================================================================ 9. flip（翻牌）
// rows: [{ text, cell:[w,h], lockTimes:[每格锁定时刻], spinFrom: 开始转的时刻（默认 = 第一格锁定前 0.25s，
// 但不早于 lockTimes 对应词的开始）, y }]；不给 rows 时每个词一行，逐词翻出。
function flip(opts) {
  const o = { font: 'bebas', tile: '#15151d', color: PAL.paper, lock: PAL.lemon, upper: true, seed: 81,
    charset: '0123456789E+-.#%', step: 0.07, depth: 0.5, tilt: [-0.2, 0.4, 0.03], camMove: (T, u) => ({ z: 2.5 * easeOut3(u), ry: lerp(-0.12, 0.12, smooth(u)) }), drift: 0.05, kick: 0.5,
    side: PAL.mint, ...opts };
  const words = wordsOf(o);
  let rows = o.rows;
  if (!rows) {
    rows = words.map((w, i) => ({ text: w.text, cell: [1.9, 2.7], spinFrom: w.start, lockTimes: [...w.text].map((_, j) => w.start + 0.22 + j * 0.05), y: (words.length - 1) / 2 * 3.2 - i * 3.2 }));
  }
  const group = new THREE.Group();
  const tileGeos = new Map();
  const cells = [];
  rows.forEach((row, ri) => {
    const [cw, ch] = row.cell;
    const gap = cw * 0.1, n = row.text.length;
    const x0 = -(n * cw + (n - 1) * gap) / 2 + cw / 2;
    const key = `${cw}x${ch}`;
    const td = cw * o.depth;
    if (!tileGeos.has(key)) tileGeos.set(key, [new THREE.BoxGeometry(cw, ch, td), new THREE.BoxGeometry(cw * 1.02, ch * 0.022, td * 1.04)]);
    const [tg, sg] = tileGeos.get(key);
    const size = ch * 0.72 / capH(o.font);
    [...row.text].forEach((c, j) => {
      const holder = new THREE.Group();
      holder.position.set(x0 + j * (cw + gap), row.y ?? 0, 0);
      group.add(holder);
      const tile = new THREE.Mesh(tg, new THREE.MeshMatcapMaterial({ color: o.tile, matcap: matcap() }));
      holder.add(tile);
      const seam = new THREE.Mesh(sg, new THREE.MeshBasicMaterial({ color: '#000' }));
      holder.add(seam);
      const cm = mats(o.color, o.side);
      const glyph = new THREE.Mesh(textGeo(o.font, '0', { size, depth: size * 0.22 }), cm);
      holder.add(glyph);
      cells.push({ holder, glyph, cm, target: c, lockT: row.lockTimes[j], spinFrom: row.spinFrom ?? row.lockTimes[j] - 0.25, size, cw, ch, td, ri, j });
    });
  });
  function glyphGeo(c, size) { return textGeo(o.font, c, { size, depth: size * 0.22 }); }
  function place(cell, c) {
    const g = glyphGeo(c, cell.size);
    cell.glyph.geometry = g;
    const a = advance(o.font, c, cell.size);
    cell.glyph.position.set(-a / 2, -cell.size * capH(o.font) / 2, cell.td / 2 + cell.size * 0.11 + 0.02);
  }
  const lockTs = [...new Set(cells.filter(c => c.ri === 0).map(c => c.lockT))];
  const allT = cells.flatMap(c => [c.spinFrom, c.lockT]);
  const rig = makeRig(group, o, { start: Math.min(...allT), end: Math.max(...allT) }, lockTs);
  function update(t) {
    rig(t);
    cells.forEach((cell, ci) => {
      const { holder, glyph } = cell;
      if (t < cell.spinFrom) { glyph.visible = false; holder.rotation.x = 0; holder.position.z = 0; setColor(cell.cm, o.color); return; }
      glyph.visible = cell.target !== ' ';
      const st = o.step * (1 + (ci % 3) * 0.08);
      const locked = t >= cell.lockT;
      let tf, c;
      if (locked) { tf = cell.lockT; c = cell.target; }
      else {
        const j = Math.floor((t - cell.spinFrom) / st);
        tf = cell.spinFrom + j * st;
        c = o.charset[Math.floor(rnd(o.seed, ci, j) * o.charset.length)];
        glyph.visible = true;
      }
      if (c === ' ') glyph.visible = false; else place(cell, c);
      const a = clamp01((t - tf) / Math.min(0.06, st * 0.9));
      holder.rotation.x = -Math.PI / 2 * (1 - (locked ? easeOutBack(a, 2.5) : a));
      const lk = t - cell.lockT;
      setColor(cell.cm, locked && lk < 0.35 ? o.lock : locked ? (cell.ri === 0 ? o.lock : o.color) : o.color);
      holder.position.z = locked ? 0.4 * Math.exp(-lk * 10) : 0;
    });
  }
  return { group, update, words, bounds: { w: 30, h: 12 } };
}

// ================================================================ 10. stamp（印章盖字）
function stamp(opts) {
  const o = { font: 'anton', small: 'bebas', color: PAL.pink, smallColor: PAL.ink, bg: PAL.paper, upper: true, seed: 91,
    angle: -0.16, fall: 0.11, ...opts };
  const words = wordsOf(o);
  const ti = o.target ?? words.length - 1;
  const pre = words.filter(w => w.i !== ti), tw = words[ti];
  const group = new THREE.Group();
  const Ls = fitLayout(pre, { font: o.small, maxW: 26, maxH: 2.6, maxSize: 2.6 });
  const smallNodes = Ls.items.map(it => {
    const n = wordNode(it, textGeo(o.small, it.text, { size: it.s, depth: it.s * 0.12 }), mats(o.smallColor), Ls.capH);
    n.position.y += 5.8;
    group.add(n);
    return n;
  });
  const Lb = fitLayout([{ ...tw, i: 0 }], { font: o.font, maxW: 21, maxH: 6.2, maxSize: 6.8 });
  const it = Lb.items[0];
  const st = new THREE.Group();
  st.position.y = -2.3;
  st.rotation.z = o.angle;
  group.add(st);
  const inner = new THREE.Group();
  st.add(inner);
  const m = mats(o.color, darken(o.color, 0.7));
  const word = new THREE.Mesh(textGeo(o.font, it.text, { size: it.s, depth: 0.35 }), m);
  const th = it.s * Lb.capH;
  word.position.set(-it.w / 2, -th / 2, 0);
  inner.add(word);
  const pw = it.w + it.s * 0.9, ph = th + it.s * 0.9, bw = it.s * 0.13;
  const sh = new THREE.Shape();
  sh.moveTo(-pw / 2, -ph / 2); sh.lineTo(pw / 2, -ph / 2); sh.lineTo(pw / 2, ph / 2); sh.lineTo(-pw / 2, ph / 2); sh.lineTo(-pw / 2, -ph / 2);
  const hole = new THREE.Path();
  hole.moveTo(-pw / 2 + bw, -ph / 2 + bw); hole.lineTo(-pw / 2 + bw, ph / 2 - bw); hole.lineTo(pw / 2 - bw, ph / 2 - bw); hole.lineTo(pw / 2 - bw, -ph / 2 + bw); hole.lineTo(-pw / 2 + bw, -ph / 2 + bw);
  sh.holes.push(hole);
  const frame = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.35, bevelEnabled: false }), m);
  frame.position.z = -0.175;
  inner.add(frame);
  // 缺墨斑点：底色小圆点压在印面上
  const spots = new THREE.Group();
  const spotMat = new THREE.MeshBasicMaterial({ color: o.bg });
  for (let k = 0; k < 90; k++) {
    const r = 0.04 + 0.16 * rnd(o.seed, k) ** 2;
    const c = new THREE.Mesh(new THREE.CircleGeometry(r, 10), spotMat);
    c.position.set((rnd(o.seed, k, 1) - 0.5) * pw, (rnd(o.seed, k, 2) - 0.5) * ph, 0.2);
    spots.add(c);
  }
  inner.add(spots);
  const ghosts = [0.3, 0.15].map(op => {
    const g = new THREE.Mesh(word.geometry, new THREE.MeshBasicMaterial({ color: o.color, transparent: true, opacity: op, depthWrite: false }));
    g.position.copy(word.position);
    inner.add(g);
    return g;
  });
  const impacts = [...pre.map(w => w.start + 0.12), tw.start + o.fall];
  function update(t) {
    pre.forEach((w, j) => {
      const n = smallNodes[j], k = t - w.start;
      n.visible = k >= 0;
      if (k < 0) return;
      const e = clamp01(k / 0.16);
      n.position.z = lerp(4, 0, easeIn2(e));
      n.scale.setScalar(1 + 0.08 * spring(k - 0.16));
    });
    const [sx, sy] = shakeAt(t, impacts, 0.3, o.seed);
    group.position.x = sx; group.position.y = sy;
    const k = t - tw.start;
    st.visible = k >= 0;
    if (k < 0) return;
    const p = clamp01(k / o.fall);
    if (p < 1) {
      inner.position.z = lerp(20, 0, easeIn2(p));
      inner.scale.setScalar(lerp(1.6, 1, p));
      ghosts.forEach((g, j) => { g.visible = true; g.position.z = (j + 1) * 1.8 * (1 - p); });
    } else {
      inner.position.z = 0;
      const sp = spring(k - o.fall, 40, 11);
      inner.scale.set(1 + 0.1 * sp, 1 + 0.1 * sp, 1);
      ghosts.forEach(g => { g.visible = false; });
    }
  }
  return { group, update, words, bounds: { w: pw, h: ph + 8 } };
}

// ================================================================ 11. typewriter（打字机）
function typewriter(opts) {
  const o = { font: 'mono', color: PAL.paper, strike: PAL.lemon, caret: PAL.mint, upper: false, maxW: 28, maxH: 10, maxSize: 3.2,
    charDt: 0.075, minCap: 1.12, ...opts };
  const words = wordsOf(o);
  // 字高下限：大写字母高 ≥ minCap（默认 1.12 = 画廊取景画高 21.44 的 ~5.2%）；放不下就换行，不再缩字
  const minSize = o.minCap / capH(o.font);
  let L = fitLayout(words, { ...o, align: 'left' });
  if (L.size < minSize) L = layout(words, { ...o, size: minSize, align: 'left' });
  // left 对齐以 -maxW/2 为左缘；整体水平居中
  const shift = -L.W / 2 + o.maxW / 2;
  const group = new THREE.Group();
  const adv = advance(o.font, 'M', L.size);
  const chars = [];
  L.items.forEach((it, wi) => {
    const w = words[wi], n = it.text.length;
    const dt = Math.min(o.charDt, (w.end - w.start) * 0.85 / n);
    [...it.text].forEach((c, j) => {
      const m = mats(o.color, PAL.pink);
      const mesh = new THREE.Mesh(textGeo(o.font, c, { size: it.s, depth: it.s * 0.12, curve: 3 }), m);
      const holder = new THREE.Group();
      holder.position.set(it.x + shift + j * adv, it.y, 0);
      holder.add(mesh);
      group.add(holder);
      chars.push({ holder, m, at: w.start + j * dt, x: it.x + shift + (j + 1) * adv, y: it.y });
    });
  });
  const caret = new THREE.Mesh(new THREE.BoxGeometry(adv * 0.8, L.size * L.capH * 1.1, L.size * 0.15), new THREE.MeshBasicMaterial({ color: o.caret }));
  group.add(caret);
  const first = L.items[0];
  function update(t) {
    let last = null;
    for (const c of chars) {
      const k = t - c.at;
      c.holder.visible = k >= 0;
      if (k < 0) continue;
      last = c;
      const e = clamp01(k / 0.09);
      c.holder.position.z = lerp(0.8, 0, e);
      c.holder.scale.setScalar(lerp(1.28, 1, e));
      setColor(c.m, k < 0.25 ? o.strike : o.color, PAL.pink);
    }
    const cx = last ? last.x : first.x + shift, cy = last ? last.y : first.y;
    caret.position.set(cx + adv * 0.5, cy + L.size * L.capH * 0.5, 0);
    const typing = last && t - last.at < 0.3;
    caret.visible = typing || Math.floor(t / 0.42) % 2 === 0;
  }
  return { group, update, words, bounds: { w: L.W, h: L.H } };
}

// ================================================================ 12. mask（[MASK] 黑块逐个揭开）
function mask(opts) {
  const o = { font: 'bebas', label: 'mono', color: PAL.ink, block: PAL.ink, labelColor: PAL.paper, accent: PAL.pink,
    upper: true, maxW: 28, maxH: 8, maxSize: 4.6, seed: 101, grid: true, ...opts };
  const words = wordsOf(o);
  const L = fitLayout(words, o);
  const group = new THREE.Group();
  const pad = L.size * 0.22;
  // 背景：一页被遮住的「报纸」—— 极淡的 [MASK] 条，不抢焦点
  if (o.grid) {
    const gm = new THREE.MeshBasicMaterial({ color: o.block, transparent: true, opacity: 0.07, depthWrite: false });
    const bg = new THREE.Group();
    bg.position.z = -1;
    for (let r = 0; r < 14; r++) {
      const y = 10 - r * 1.55;
      if (Math.abs(y) < L.H / 2 + 1.4) continue;
      let x = -19 + rnd(o.seed, r) * 2;
      for (let c = 0; x < 19; c++) {
        const w = 1.2 + 3.2 * rnd(o.seed, r, c);
        const b = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.8), gm);
        b.position.set(x + w / 2, y, 0);
        bg.add(b);
        x += w + 0.55;
      }
    }
    group.add(bg);
  }
  const wd = L.items.map((it, i) => {
    const th = it.s * L.capH;
    const wm = mats(o.color, PAL.pink);
    const text = new THREE.Mesh(textGeo(o.font, it.text, { size: it.s, depth: it.s * 0.1 }), wm);
    text.position.set(it.x, it.y, 0);
    group.add(text);
    // 黑块铰链在上沿
    const bw = it.w + pad * 2, bh = th + pad * 2 + it.s * 0.25;
    const hinge = new THREE.Group();
    hinge.position.set(it.x + it.w / 2, it.y - pad - it.s * 0.25 + bh, it.s * 0.2);
    group.add(hinge);
    const blk = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.3), new THREE.MeshMatcapMaterial({ color: o.block, matcap: matcap(), transparent: true }));
    blk.position.y = -bh / 2;
    hinge.add(blk);
    const lbl = '[MASK]';
    const ls = Math.min(bh * 0.4 / capH(o.label), bw * 0.78 / advance(o.label, lbl, 1));
    const lm = new THREE.MeshBasicMaterial({ color: o.labelColor, transparent: true });
    const lab = new THREE.Mesh(textGeo(o.label, lbl, { size: ls, curve: 3 }), lm);
    lab.position.set(-advance(o.label, lbl, ls) / 2, -bh / 2 - ls * capH(o.label) / 2, 0.16);
    hinge.add(lab);
    const bar = new THREE.Mesh(new THREE.PlaneGeometry(1, it.s * 0.12), new THREE.MeshBasicMaterial({ color: o.accent }));
    bar.position.set(it.x + it.w / 2, it.y - it.s * 0.2, 0.05);
    group.add(bar);
    return { text, hinge, blk, lm, bar, w: it.w };
  });
  const span = lineSpan(words);
  function update(t) {
    // 句子开始前黑块就位（只露出 [MASK]，不露词）：块在 span.start - 0.5 起逐个落下
    words.forEach((w, i) => {
      const W = wd[i], k = t - w.start;
      const kin = t - (span.start - 0.6 + i * 0.05);
      W.hinge.visible = kin >= 0 && k < 0.5;
      W.hinge.scale.setScalar(Math.max(0.001, easeOutBack(clamp01(kin / 0.2))));
      W.text.visible = k >= 0;
      const p = clamp01(k / 0.28);
      W.hinge.rotation.x = k >= 0 ? -Math.PI * 0.55 * easeIn2(p) : 0;
      const op = 1 - clamp01((k - 0.12) / 0.3);
      W.blk.material.opacity = W.lm.opacity = k >= 0 ? op : 1;
      W.bar.visible = k >= 0;
      const bp = easeOut3(clamp01(k / 0.25));
      W.bar.scale.x = Math.max(0.001, W.w * bp);
    });
  }
  return { group, update, words, bounds: { w: L.W, h: L.H } };
}

// ================================================================ 13. whisper（手写慢浮现）
function whisper(opts) {
  const o = { font: 'caveat', color: PAL.paper, upper: false, maxW: 28, maxH: 11, maxSize: 5, fade: 0.6, seed: 111, ...opts };
  const words = wordsOf(o);
  const L = fitLayout(words, { ...o, gap: 0.55 });
  const group = new THREE.Group();
  const chars = [];
  L.items.forEach((it, wi) => {
    const w = words[wi];
    let x = it.x;
    const n = it.text.length, dur = Math.max(0.3, (w.end - w.start) * 0.9);
    [...it.text].forEach((c, j) => {
      const a = advance(o.font, c, it.s);
      const m = new THREE.MeshBasicMaterial({ color: o.color, transparent: true });
      const mesh = new THREE.Mesh(textGeo(o.font, c, { size: it.s, curve: 6 }), m);
      const holder = new THREE.Group();
      holder.position.set(x, it.y, 0);
      holder.add(mesh);
      group.add(holder);
      chars.push({ holder, m, at: w.start + dur * j / n, x, y: it.y, rz: (rnd(o.seed, wi, j) - 0.5) * 0.25 });
      x += a;
    });
  });
  const span = lineSpan(words);
  function update(t) {
    group.scale.setScalar(1 + 0.012 * Math.max(0, t - span.start));
    for (const c of chars) {
      const k = t - c.at;
      c.holder.visible = k >= 0;
      if (k < 0) continue;
      const e = easeOut3(clamp01(k / o.fade));
      c.m.opacity = e;
      c.holder.position.y = c.y - 0.45 * (1 - e);
      c.holder.rotation.z = c.rz * (1 - e);
    }
  }
  return { group, update, words, bounds: { w: L.W, h: L.H } };
}

// 发光：给组里所有材质的输出乘 k（线性 HDR，超过 engine bloom 阈值就会发光）
export function applyGlow(group, k) {
  group.traverse(o => {
    for (const m of [o.material].flat()) {
      if (!m || m.userData.glow) continue;
      m.userData.glow = k;
      m.toneMapped = false;
      m.onBeforeCompile = sh => {
        sh.fragmentShader = sh.fragmentShader.replace(/}\s*$/, `  gl_FragColor.rgb *= ${k.toFixed(3)};\n}`);
      };
      m.customProgramCacheKey = () => `glow${k}`;
      m.needsUpdate = true;
    }
  });
}

const RAW = { slam, burst, reform, wall, outline, hud, curve, singularity, flip, stamp, typewriter, mask, whisper };
export const FX = Object.fromEntries(Object.entries(RAW).map(([k, f]) => [k, opts => {
  const fx = f(opts);
  if (opts.glow > 0) applyGlow(fx.group, opts.glow);
  return fx;
}]));

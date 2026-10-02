// shots/c2-tape-comic.js — 副歌 2 剧情 C 的两页动态漫画（#1058）。分镜：fresh/v4-rest/c2/comic/storyboard.md
//
//   const tc = await makeTapeComic(mv, { words, t0: 69.33, tOpen: 71.6, tGrip: 72.42, tGone: 73.05 });
//   tc.page1(T) / tc.page2(T) → { scene, camera, post }      （c2-v4.js 的 storyC2d / storyGrip 直接调）
//
//   第 1 页 69.33–71.6：① 大远景仰拍，巨门门缝上只横着一条黄黑 SAFETY 胶带（THAT WAS）→ ② 极特写，两根手指捏起胶带，标签 SAFE / ENOUGH ✓
//            → ③ 她回头无语看镜头（WE RECKONED）→ ④ reckoned 强拍：胶带绷断、两头甩出格框，强光溢满整页 → 切 3D
//   第 2 页 72.42–73.05：⑤ 她被吸进门缝、回头尖叫，前景她的手扣着门边（镜头从脸甩到手）→ ⑥ 手松开的特写，手指从门边滑脱 → 白闪切回 3D
//   关键画：cast-cyber-girl/closeup/c2tape/（本地生图，喂设定图 + 跑酷页画风，见 fresh/v4-rest/c2/comic/gen2.sh）
//   门在右、吸力一直朝右（和 3D 里她被往门缝里拽对得上）。全部是 T 的纯函数。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { createComic, C as CX, CF } from '../kits/comic.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eIn = p => clamp(p) ** 2;
const col = c => new THREE.Color(c);
const DIR = new URL('../../cast-cyber-girl/closeup/c2tape/', import.meta.url);

// 每张关键画在格子里取哪一块：[中心 x, 中心 y（0–1，图上）, 取图高的多少]
export const FRAME = {
  k1: [0.5, 0.5, 1.0], k2: [0.45, 0.5, 0.95], k3: [0.5, 0.44, 0.88], k4a: [0.3, 0.45, 0.95], k4b: [0.5, 0.45, 0.6], k5: [0.5, 0.5, 0.98], k6g: [0.5, 0.5, 0.96], k6r: [0.5, 0.5, 0.96],
};
// 第 5 格里她的脸、扣门边的手在图上的位置（镜头从脸甩到手）
export const K5 = { face: [0.42, 0.42], hand: [0.72, 0.62] };

export async function makeTapeComic(mv, { words, t0 = 69.33, tOpen = 71.6, tGrip = 72.42, tGone = 73.05 } = {}) {
  const W = s => words.find(q => q.w.toLowerCase().replace(/[^a-z]/g, '').startsWith(s) && q.start > t0 - 0.5 && q.start < tGone)?.start;
  const tThat = W('that') ?? 69.76, tWas = W('was') ?? 69.98, tSafe = W('safe') ?? 70.12, tEnough = W('enough') ?? 70.49, tWe = W('we') ?? 70.92, tReck = W('reckoned') ?? 71.12;
  const bt = t => (mv.audio?.beats ?? []).reduce((a, b) => (Math.abs(b - t) < Math.abs(a - t) ? b : a), t);
  const T_SNAP = bt(tReck), T_P2 = tWas, T_P3 = tEnough;           // ② 在 was 上切进来（标签的字逐词盖章），③ 在 enough 上
  const kick = (T, d = 0.14) => (mv.music?.pulse ? mv.music.pulse('kick', T, { decay: d }) : 0);
  const I = {}; await Promise.all(Object.keys(FRAME).map(async k => { try { const im = new Image(); im.src = new URL(`${k}.png`, DIR).href; await im.decode(); I[k] = im; } catch { I[k] = null; } }));

  // 把图铺满格子（f = FRAME[k]，z = 额外放大，(dx, dy) = 取景中心偏移（图的分数））
  const cover = (c, b, k, z = 1, dx = 0, dy = 0) => {
    const im = I[k]; if (!im) { c.fillStyle = '#2a2c44'; c.fillRect(0, 0, b.w, b.h); c.fillStyle = '#fff'; c.font = '60px sans-serif'; c.fillText(k, 40, 90); return; }
    const [fx, fy, fh] = FRAME[k], sh = im.height * fh / z, sw = sh * b.w / b.h;
    const sx = clamp(im.width * (fx + dx) - sw / 2, 0, Math.max(0, im.width - sw)), sy = clamp(im.height * (fy + dy) - sh / 2, 0, Math.max(0, im.height - sh));
    c.drawImage(im, sx, sy, Math.min(sw, im.width), Math.min(sh, im.height), 0, 0, b.w, b.h);
  };
  // 旁白框（画在格子里，逐词出现）：(fx, fy) = 框左上角在格子里的位置（格子的分数），hp = 字高（格子高的分数）
  const caption = (c, b, T, list, fx, fy, hp) => {
    const shown = list.filter(([, t]) => T >= t); if (!shown.length) return;
    const fs = b.h * hp, lines = shown.map(([w]) => w); c.font = `${fs}px ${CF.bang}`;
    const w = Math.max(...list.map(([w]) => c.measureText(w).width)) + fs * 0.8, h = list.length * fs * 1.12 + fs * 0.5, x = b.w * fx, y = b.h * fy;
    const k = T - list[0][1], z = 1 + 0.25 * Math.exp(-k * 20);
    c.save(); c.translate(x + w / 2, y + h / 2); c.scale(z, z); c.translate(-w / 2, -h / 2);
    c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(8, 10, w, h); c.fillStyle = PAL.lemon; c.fillRect(0, 0, w, h); c.lineWidth = fs * 0.09; c.strokeStyle = PAL.ink; c.strokeRect(0, 0, w, h);
    c.fillStyle = PAL.ink; c.textAlign = 'center'; c.textBaseline = 'top'; lines.forEach((l, i) => c.fillText(l, w / 2, fs * 0.3 + i * fs * 1.12)); c.restore();
  };
  const jitter = (c, a, T, s = 1) => c.translate(a * Math.sin(T * 91 * s), a * Math.cos(T * 77 * s));

  // 黄黑 SAFETY 胶带（画布）：标签和胶带断头都用它
  const tapeCanvas = (len, label, torn) => {
    const c = document.createElement('canvas'); c.width = len; c.height = 120; const g = c.getContext('2d');
    g.save(); g.beginPath(); g.moveTo(0, 18);
    if (torn === 'r') { g.lineTo(len - 30, 18); for (let i = 0; i <= 8; i++) g.lineTo(len - (i % 2 ? 0 : 26), 18 + i * 10.5); g.lineTo(0, 102); }
    else { for (let i = 0; i <= 8; i++) g.lineTo(i % 2 ? 0 : 26, 18 + i * 10.5); g.lineTo(len, 102); g.lineTo(len, 18); }
    g.closePath(); g.fillStyle = PAL.lemon; g.fill(); g.clip();
    g.fillStyle = PAL.ink; for (const y0 of [18, 86]) for (let x = -40; x < len + 40; x += 36) { g.beginPath(); g.moveTo(x, y0); g.lineTo(x + 16, y0); g.lineTo(x + 6, y0 + 16); g.lineTo(x - 10, y0 + 16); g.closePath(); g.fill(); }      // 上下两条黑色斜纹边
    g.font = `52px ${CF.anton}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(label, len / 2, 61);
    g.restore(); g.lineWidth = 7; g.strokeStyle = PAL.ink; g.lineJoin = 'round'; g.stroke();
    return c;
  };
  const tapeMesh = (label, torn, w) => {
    const cv = tapeCanvas(560, label, torn), t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, w * 120 / 560), new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.05, side: THREE.DoubleSide }));
    m.geometry.translate(torn === 'r' ? w / 2 : -w / 2, 0, 0);     // 原点在断口：甩出去时绕断口转
    m.visible = false; return m;
  };

  // ================================================================ 第 1 页（69.33–71.6）
  const c1 = await createComic(mv, { w: 20, h: 11.25, seed: 58 });
  const sc1 = new THREE.Scene(); sc1.background = col('#0b0a14'); sc1.add(c1.group); c1.group.rotation.set(-0.04, -0.03, -0.008);
  const cam1 = new THREE.PerspectiveCamera(36, 16 / 9, 0.05, 800);
  const PG = { p1: [[0.018, 0.03], [0.285, 0.03], [0.285, 0.97], [0.018, 0.97]],
    p2: [[0.3, 0.03], [0.565, 0.03], [0.535, 0.515], [0.3, 0.55]],
    p3: [[0.58, 0.03], [0.982, 0.03], [0.982, 0.465], [0.55, 0.512]],
    p4: [[0.3, 0.568], [0.55, 0.53], [0.982, 0.482], [0.982, 0.97], [0.3, 0.97]] };
  const box = id => { const p = PG[id], xs = p.map(q => q[0]), ys = p.map(q => q[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)]; };

  // ① 大远景仰拍：巨门 + 门缝上一条细胶带，她很小。镜头从门顶摇下来，层间视差（天空最深）
  c1.panel({ id: 'p1', poly: PG.p1, reveal: { at: t0 - 0.01, kind: 'none' }, border: 'ink', borderW: 12, dim: { at: T_SNAP, amount: 0.2 },
    layers: [{ depth: 0.3, draw: (c, b, T) => { c.save(); jitter(c, kick(T, 0.1) * 3, T); cover(c, b, 'k1', lerp(1.0, 1.06, smooth((T - t0) / 2))); c.restore();
      const g = c.createRadialGradient(b.w * 0.6, b.h * 0.8, 10, b.w * 0.6, b.h * 0.8, b.w * 0.6); g.addColorStop(0, `rgba(255,236,40,${0.18 + 0.25 * kick(T, 0.2)})`); g.addColorStop(1, 'rgba(255,236,40,0)'); c.fillStyle = g; c.fillRect(0, 0, b.w, b.h); } },
      { depth: 0, draw: (c, b, T) => { caption(c, b, T, [['THAT', tThat]], 0.05, 0.5, 0.03); caption(c, b, T, [['WAS', tWas]], 0.05, 0.6, 0.03); } }      /* 镜头往下摇，两个词各挂在当时画面里 */] });
  // ② 极特写：两根手指捏起胶带；右上角的检查标签逐词盖章 SAFE → ENOUGH ✓
  c1.panel({ id: 'p2', poly: PG.p2, reveal: { at: T_P2, kind: 'wipe', dur: 0.22 }, border: 'ink', borderW: 12, depth: 0.04, dim: { at: T_SNAP, amount: 0.25 },
    layers: [{ depth: 0.2, draw: (c, b, T) => { c.save(); jitter(c, kick(T, 0.08) * 5, T, 1.3); cover(c, b, 'k2', lerp(1.0, 1.1, smooth((T - T_P2) / 1.2))); c.restore(); } },
      { depth: 0, draw: (c, b, T) => {            // 检查标签（塑封白卡片，斜挂）：字就是歌词
        const s = T - tSafe; if (s < -0.02) return;
        c.save(); c.translate(b.w * 0.72, b.h * 0.27); c.rotate(-0.1 + 0.02 * Math.sin(T * 6)); const w = b.w * 0.42, h = b.h * 0.36;
        c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(-w / 2 + 10, -h / 2 + 12, w, h);
        c.fillStyle = '#fbfaf3'; c.strokeStyle = PAL.ink; c.lineWidth = 8; c.fillRect(-w / 2, -h / 2, w, h); c.strokeRect(-w / 2, -h / 2, w, h);
        c.fillStyle = PAL.pink; c.fillRect(-w / 2, -h / 2, w, h * 0.12);
        const stamp = (txt, y, t, size, color) => { const k = T - t; if (k < 0) return; const z = 1 + 0.6 * Math.exp(-k * 18); c.save(); c.translate(0, y); c.scale(z, z); c.font = `${size}px ${CF.anton}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = color; c.fillText(txt, 0, 0); c.restore(); };
        stamp('SAFE', -h * 0.12, tSafe, h * 0.36, PAL.ink); stamp('ENOUGH ✓', h * 0.26, tEnough, h * 0.3, '#13894f');
        c.restore(); } }] });
  // ③ 她回头直视镜头，一脸无语。不动是笑点：只有胶带在她指间随底鼓抖一下
  c1.panel({ id: 'p3', poly: PG.p3, reveal: { at: T_P3, kind: 'slide', dir: 'l', dur: 0.2 }, border: 'ink', borderW: 12, depth: 0.04,
    layers: [{ depth: 0.15, draw: (c, b, T) => { c.save(); jitter(c, kick(T, 0.06) * 2.5, T, 0.7); cover(c, b, 'k3', lerp(1.0, 1.04, smooth((T - T_P3) / 1.2))); c.restore(); } },
      { depth: 0, draw: (c, b, T) => caption(c, b, T, [['WE', tWe], ['RECKONED', tReck]], 0.63, 0.08, 0.1) }] });
  // ④ 破格：左边她的眼睛极特写，右边胶带在门缝前绷断、强光炸开（两张图沿斜线拼）
  c1.panel({ id: 'p4', poly: PG.p4, reveal: { at: T_SNAP, kind: 'pop', dur: 0.14 }, border: 'ink', borderW: 14, depth: 0.08,
    layers: [{ depth: 0.25, draw: (c, b, T) => { const k = T - T_SNAP;
        c.save(); jitter(c, 14 * Math.exp(-k * 7), T, 1.6); cover(c, b, 'k4b', 1.0 + 0.12 * smooth(k / 0.45)); c.restore();
        CX.focusLines(c, b, T, { fx: 0.68, fy: 0.5, inner: 0.22 + 0.1 * Math.exp(-k * 6), n: 70, color: '#ffffff', alpha: 0.7 }); } },
      { depth: 0.1, draw: (c, b, T) => { const k = T - T_SNAP;
        c.save(); c.beginPath(); c.moveTo(0, 0); c.lineTo(b.w * 0.42, 0); c.lineTo(b.w * 0.3, b.h); c.lineTo(0, b.h); c.closePath(); c.clip();
        c.translate(-b.w * 0.04 * smooth(k / 0.4), 0); cover(c, { w: b.w * 0.42, h: b.h }, 'k4a', 1.0 + 0.08 * smooth(k / 0.45)); c.restore();
        c.strokeStyle = PAL.ink; c.lineWidth = 16; c.beginPath(); c.moveTo(b.w * 0.42, 0); c.lineTo(b.w * 0.3, b.h); c.stroke(); } }] });
  // 字：旁白框（逐词）+ SNAP!
  c1.sfx({ text: 'SNAP!', x: 0.84, y: 0.88, size: 0.11, at: T_SNAP, color: PAL.pink, stroke: PAL.ink, angle: -9, shake: 1 });
  c1.shock({ x: 0.7, y: 0.72, at: T_SNAP, dur: 0.45, radius: 3.2, color: PAL.lemon });
  // 胶带两头甩出格框，朝镜头飞
  const tapeL = tapeMesh('SAFETY  SAF', 'r', 3.2), tapeR = tapeMesh('ETY  SAFETY', 'l', 3.2);
  c1.breakout(tapeL, { panel: 'p4', at: T_SNAP + 0.03, dur: tOpen - T_SNAP, from: [0.62, 0.73, 0.15], to: [0.36, 0.5, 6.5], scale: [0.8, 1.5], spin: [0.6, 1.2, 2.6], ease: p => 1 - (1 - clamp(p)) ** 2, crackAt: [0.64, 0.73], light: PAL.lemon, lightI: 2.5 });
  c1.breakout(tapeR, { panel: 'p4', at: T_SNAP + 0.03, dur: tOpen - T_SNAP, from: [0.66, 0.73, 0.15], to: [1.02, 0.42, 5.5], scale: [0.8, 1.4], spin: [-0.5, -1.0, -2.2], ease: p => 1 - (1 - clamp(p)) ** 2, crack: false });
  c1.light({ x: 0.7, y: 0.72, z: 1.2, color: PAL.lemon, intensity: 3.5, radius: 14, at: T_SNAP, until: tOpen + 0.1 });

  // 镜头：贴着 ① 顶上（门顶）→ 摇到门缝和她 → 往右推 ② → ③ 停住 → 退到 ③+④ → 推进 ④，强光溢满
  const keys1 = [
    { t: t0, target: [0.018, 0.08, 0.267, 0.15], yaw: 0, pitch: 0, margin: 0.95 },          // ① 格宽铺满屏：从门顶的读数往下摇到门缝和她
    { t: tThat, target: [0.018, 0.4, 0.267, 0.15], yaw: 0, pitch: 0, margin: 0.97 },
    { t: tWas - 0.06, target: [0.018, 0.8, 0.267, 0.15], yaw: 2, pitch: -2, margin: 0.97 },
    { t: tWas + 0.18, target: [0.0, 0.0, 0.59, 0.6], yaw: 3, pitch: -2, margin: 1.04 },
    { t: tEnough - 0.12, target: box('p2'), yaw: 1, pitch: -1, margin: 1.02 },
    { t: T_P3 + 0.18, target: box('p3'), yaw: -2, pitch: -1, margin: 1.05 },
    { t: T_SNAP - 0.04, target: box('p3'), yaw: -2, pitch: -1, margin: 1.0 },
    { t: T_SNAP + 0.14, target: [0.28, 0.02, 0.72, 0.97], yaw: -4, pitch: 2, margin: 1.02 },
    { t: tOpen, target: [0.4, 0.42, 0.6, 0.58], yaw: -6, pitch: 3, roll: -2, margin: 0.98 },
  ];
  function page1(T) {
    c1.camPath(cam1, T, keys1);
    const pop = T >= T_SNAP ? Math.exp(-(T - T_SNAP) * 9) : 0; cam1.position.x += 0.14 * pop * Math.sin((T - T_SNAP) * 80); cam1.position.y += 0.08 * pop * Math.cos((T - T_SNAP) * 63);
    cam1.updateMatrixWorld(); c1.update(T, { camera: cam1 }); c1.group.updateMatrixWorld(true); c1.update(T, { camera: cam1 });      // 跑两遍：乱序 seek 才一致（同 v4-03b）
    const flood = smooth((T - (tOpen - 0.15)) / 0.15);             // 最后 0.15 s 强光溢满整页，接 3D 门缝里的光
    return { scene: sc1, camera: cam1, post: { bloom: { strength: 0.45 + 0.6 * flood, threshold: 1.0 }, grade: { vignette: 0.28 }, chroma: 0.06 + 0.3 * pop,
      flash: flood > 0 ? { amount: 0.85 * flood, color: PAL.lemon } : { amount: Math.max(0.28 * pop, 0.25 * Math.exp(-(T - t0) * 12)), color: pop > 0.01 ? '#ffffff' : PAL.pink } } };
  }

  // ================================================================ 第 2 页（72.42–73.05）：⑤ 抓着门边 → ⑥ 手松开
  const c2 = await createComic(mv, { w: 20, h: 11.25, seed: 59 });
  const sc2 = new THREE.Scene(); sc2.background = col('#0b0a14'); sc2.add(c2.group); c2.group.rotation.set(0.02, 0.04, 0.01);
  const cam2 = new THREE.PerspectiveCamera(36, 16 / 9, 0.05, 800);
  const T_LET = tGrip + 0.36, T_REL = T_LET + 0.14;                // ⑥ 插进来（还扣着）→ 松手
  const P5 = [0.012, 0.022, 0.976, 0.956], P6 = [[0.36, 0.5], [0.99, 0.43], [0.99, 0.985], [0.33, 0.985]];
  c2.panel({ id: 'p5', rect: P5, reveal: { at: tGrip - 0.01, kind: 'none' }, border: 'ink', borderW: 12, dim: { at: T_LET, amount: 0.3 },
    layers: [{ depth: 0.3, draw: (c, b, T) => { const u = (T - tGrip) / 0.6; c.save(); jitter(c, 4 + 6 * u, T, 1.4); cover(c, b, 'k5', 1.0 + 0.06 * u); c.restore();
      CX.speedLines(c, b, T, { angle: -8, n: 46, color: '#ffffff', width: 4, speed: 6, seed: 4, alpha: 0.55 }); } }] });
  c2.panel({ id: 'p6', poly: P6, reveal: { at: T_LET, kind: 'slide', dir: 'r', dur: 0.12 }, border: 'ink', borderW: 14, depth: 0.12,
    layers: [{ depth: 0.2, draw: (c, b, T) => { const k = clamp((T - T_LET) / (tGone - T_LET)), rel = T >= T_REL, u = rel ? clamp((T - T_REL) / (tGone - T_REL)) : 0;
      c.save(); c.translate(-b.w * 0.14 * eIn(u), -b.h * 0.05 * eIn(u)); jitter(c, rel ? 2 : 4, T, 1.8); cover(c, b, rel ? 'k6r' : 'k6g', 1.02 + 0.05 * k); c.restore();       // 第 5 格那只手推近：先还扣着 → 手指松开、被往门缝里的强光（左）带走
      CX.speedLines(c, b, T, { angle: 180, n: 40, color: '#ffffff', width: 5, speed: 9, seed: 7, alpha: rel ? 0.7 : 0.35 }); } }] });
  c2.sfx({ text: 'WHOOOSH', x: 0.36, y: 0.3, size: 0.085, at: tGrip + 0.05, color: PAL.lemon, stroke: PAL.ink, angle: -6, skew: -0.2, shake: 1 });
  c2.light({ x: 0.75, y: 0.4, z: 1.5, color: PAL.lemon, intensity: 0.9, radius: 16, at: tGrip, until: tGone });
  const at5 = ([fx, fy], fw) => [P5[0] + P5[2] * fx - fw / 2, P5[1] + P5[3] * fy - fw / 2, fw, fw];      // 页面是 16:9，取景框宽高分数相同就是 16:9
  const keys2 = [
    { t: tGrip, target: at5(K5.face, 0.5), yaw: -3, pitch: 1, roll: 2, margin: 1.0 },
    { t: tGrip + 0.08, target: at5(K5.face, 0.52), yaw: -3, pitch: 1, roll: 2, margin: 1.0 },
    { t: T_LET - 0.04, target: at5(K5.hand, 0.5), yaw: 4, pitch: -2, roll: -3, margin: 1.0 },
    { t: T_LET + 0.12, target: box6(), yaw: 2, pitch: -1, margin: 1.02 },
    { t: tGone, target: box6(), yaw: 2, pitch: -1, margin: 0.92 },
  ];
  function box6() { const xs = P6.map(q => q[0]), ys = P6.map(q => q[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)]; }
  function page2(T) {
    c2.camPath(cam2, T, keys2);
    cam2.updateMatrixWorld(); c2.update(T, { camera: cam2 }); c2.group.updateMatrixWorld(true); c2.update(T, { camera: cam2 });
    const out = smooth((T - (tGone - 0.08)) / 0.08);              // 最后 0.08 s 白闪，切回 3D
    return { scene: sc2, camera: cam2, post: { bloom: { strength: 0.3, threshold: 1.05 }, grade: { vignette: 0.3 }, chroma: 0.1 + 0.2 * Math.exp(-(T - T_LET) * 10) * (T > T_LET ? 1 : 0),
      flash: out > 0 ? { amount: 0.9 * out, color: '#ffffff' } : { amount: 0.4 * Math.exp(-(T - tGrip) * 14), color: '#ffffff' } } };
  }
  return { page1, page2, T_SNAP };
}

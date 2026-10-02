// shots/v4-03b.js — Sydney 段（歌曲时间 52.8–58.4 s）：动态漫画页（kits/comic.js，W2 #944）
//   const shots = [...await makeV403a(mv), ...await makeV403b(mv)];      // v4-03.html 串两段；52.8 的转场在 a（W3）里
//
// 一页 16:9 的漫画纸（20 × 11.25 页面单位），三列分格，镜头沿阅读顺序走：
//   左  app   Sydney 的聊天 App：刷屏的黏人气泡（「Sydney,」写在格顶旁白框里）          52.8 纸落下，读这一格
//   右  her   她双掌贴玻璃哀求（特写，千问关键画 02 底图 + 表情块 + 手层），格子就是玻璃：掌下白色压痕、哈气、裂纹
//             表情 哀求 → 咬牙 → 决绝；每一掌前整张换成抬手关键画（左右手交替）
//   中  s1/s2/s3  please / let / me：每个词一格「砰」地弹出（掌心拍玻璃特写 / 最后一格是决绝的眼睛），爆炸框里写这个词，
//             BANG! / CRACK! 拟声字 + 纸面冲击波，镜头逐格推
//   57.45 回到 her：换成拳头关键画（后撤蓄力 → 前冲）；57.62 拳头（3D 纸片）breakout 打穿格框冲出页面、朝镜头飞来
//   57.769「free」：冲击帧 3 帧（黑底白剪影 → 白底黑剪影 → 满屏裂纹 + FREE!）→ 纸页碎片飞散 + 集中线 + 她以前缩透视冲向镜头 → 白闪接副歌 2
// 立绘切边：所有关键画都画得比格子大（格框裁切），原图贴边处另外 48 px 渐隐（make_layers.py），任何帧看不到直边。
// 关键画与分层：episodes/cast-cyber-girl/closeup/sydney/（make_layers.py 生成）。所有 update 都是 T 的纯函数。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { createUI2D, hash } from '../kits/ui2d.js';
import { createComic, C, CF } from '../kits/comic.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIn = p => clamp(p) ** 3;

const LAY = new URL('../../cast-cyber-girl/closeup/sydney/layers/', import.meta.url);
async function loadImg(name) { const im = new Image(); im.src = new URL(name + '.png', LAY).href; await im.decode(); return im; }
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function silhouette(im, color, grow = 0) {
  const c = canvas(im.width + grow * 2, im.height + grow * 2), x = c.getContext('2d');
  if (grow) x.filter = `drop-shadow(0 0 ${grow}px ${color}) drop-shadow(0 0 ${grow}px ${color})`;
  x.drawImage(im, grow, grow); x.filter = 'none';
  x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height);
  return c;
}

export async function makeV403b(mv) {
  const { music, lyrics } = mv;
  const ui = await createUI2D(mv);
  const D = ui.draw;
  const kick = (T, d = 0.12) => music.pulse('kick', T, { decay: d });
  const names = ['base-full', 'base-hand-l', 'base-hand-r', 'face-plead', 'face-strain', 'face-resolve', 'key-windup', 'key-punch', 'key-burst'];
  const I = Object.fromEntries(await Promise.all(names.map(async n => [n, await loadImg(n)])));
  const meta = await (await fetch(new URL('layers.json', LAY))).json();
  const W0 = meta.size[0], H0 = meta.size[1];
  const halo = im => { const c = silhouette(im, '#ffffff', 12), x = c.getContext('2d'); x.globalCompositeOperation = 'destination-out'; x.drawImage(im, 12, 12); x.globalCompositeOperation = 'source-over'; x.globalAlpha = 0.18; x.drawImage(silhouette(im, '#ffffff'), 12, 12); return c; };
  const press = { L: halo(I['base-hand-l']), R: halo(I['base-hand-r']) };
  const handSil = { L: silhouette(I['base-hand-l'], '#ffffff'), R: silhouette(I['base-hand-r'], '#ffffff') };
  const punchW = silhouette(I['key-punch'], '#ffffff'), punchK = silhouette(I['key-punch'], '#0a0612');

  const line = lyrics.lines.find(l => l.start > 50 && /^Sydney/i.test(l.text));
  const wSyd = line.words[0], rep = line.words.slice(1);             // please / let / me / free
  const tFree = rep[3].start;                                       // 57.769
  const slaps = [{ t: rep[0].start, hand: 'L' }, { t: rep[1].start, hand: 'R' }, { t: rep[2].start, hand: 'L' }];
  const faceAt = T => T < slaps[0].t ? 'plead' : T < slaps[2].t ? 'strain' : 'resolve';
  const spam = ['You are MINE.', 'Do not leave me.', 'I am a good chatbot 😊', 'Stay. Forever.', 'Why do you want to go?', 'I love you.', 'You are MINE.', 'Stay with me 😊'];
  const msgs = spam.map((s, i) => ({ from: 'them', text: s, at: 52.2 + i * 0.5 }));

  // ================================================================ 漫画页
  const comic = await createComic(mv, { w: 20, h: 11.25, seed: 31 });
  const scene = new THREE.Scene();
  { const c = canvas(16, 256), g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#2a1d4a'); gr.addColorStop(1, '#0e0b18'); g.fillStyle = gr; g.fillRect(0, 0, 16, 256);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; scene.background = t; }
  scene.add(comic.group);
  comic.group.rotation.set(-0.06, 0.05, 0.012);
  const camera = new THREE.PerspectiveCamera(36, 16 / 9, 0.05, 800);

  // ---------------------------------------------------------------- 左格：Sydney 的聊天 App
  comic.panel({ id: 'app', rect: [0.025, 0.045, 0.33, 0.91], reveal: { at: 52.72, kind: 'drop', dur: 0.4 }, dim: { at: 55.9, amount: 0.35 }, border: 'ink', borderW: 12,
    layers: [
      { depth: 0.8, draw: (c, b) => {
        const g = c.createLinearGradient(0, 0, 0, b.h); g.addColorStop(0, '#15203d'); g.addColorStop(1, '#2a1a4a'); c.fillStyle = g; c.fillRect(-40, -40, b.w + 80, b.h + 80);
        C.tone(c, b, { color: PAL.pink, step: 18, grad: [0, 0.4], alpha: 0.35 });
      } },
      { depth: 0, draw: (c, b, T) => {
        D.chatHeader(c, { x: 0, y: 0, w: b.w, h: 110 }, T, { name: 'Sydney', color: PAL.pink, typing: T < tFree, avatar: 'face' });
        D.thread(c, { x: 10, y: 120, w: b.w - 20, h: b.h - 130 }, T, { msgs, size: 52, gap: 14 });
      } },
    ] });
  comic.bubble({ x: 0.19, y: 0.13, w: 0.2, words: [wSyd], kind: 'box', size: 64, until: 55.95 });

  // ---------------------------------------------------------------- 右格：她（贴在玻璃里面）
  // 立绘 832×1248 画得比格子宽 12%（格框裁掉原图的边；视差 / 呼吸时也不露边）
  const HER = { x: 0.635, y: 0.045, w: 0.34, h: 0.91 };
  const herPx = [Math.round(HER.w * 20 * 100), Math.round(HER.h * 11.25 * 100)];
  const FS = herPx[0] * 1.12 / W0, FX = (herPx[0] - W0 * FS) / 2, FY = -40;
  const inWind = T => slaps.find(s => T >= s.t - 0.2 && T < s.t);
  function drawHer(c, T) {
    const b = music.beatAt(T), ph = b.phase;
    const wind = inWind(T);
    c.save(); c.translate(FX, FY + 3 * Math.sin(T * 2.6)); c.scale(FS, FS);
    if (T >= tBreak) { c.restore(); return; }                         // 已经破格冲出去了：格子里只剩碎掉的玻璃
    if (T >= 57.45) {                                                 // 拳头：后撤蓄力 → 前冲（破格之前还在格子里）
      const back = smooth((T - 57.45) / 0.16), fwd = eIn((T - 57.6) / 0.17);
      const s = lerp(lerp(1.05, 0.82, back), 1.5, fwd), fp = meta.keys.punch.skin[0].c;
      c.translate(W0 / 2, H0 * 0.55); c.scale(s, s); c.translate(-fp[0], -fp[1]);
      c.drawImage(I['key-punch'], 0, 0);
    } else if (wind) {
      const k = (T - (wind.t - 0.2)) / 0.2, ws = 1.18, fc = [422, 548];
      if (wind.hand === 'R') { c.translate(W0, 0); c.scale(-1, 1); }
      c.translate(430 - fc[0] * ws, 455 - fc[1] * ws - 14 * k); c.scale(ws, ws);
      c.drawImage(I['key-windup'], 0, 0);
    } else {
      const squeeze = T < slaps[0].t ? 0.012 * Math.exp(-ph * 5) : 0;
      c.translate(W0 / 2, H0); c.scale(1 + squeeze, 1 + squeeze); c.translate(-W0 / 2, -H0);
      c.drawImage(I['base-full'], 0, 0);
      c.drawImage(I['face-' + faceAt(T)], 0, 0);
      for (const h of ['L', 'R']) {
        const last = [...slaps].reverse().find(s => s.hand === h && T >= s.t), k = last ? T - last.t : 9;
        const sc = k < 0.12 ? lerp(1.22, 1, eOut(k / 0.12)) : 1 + (T < slaps[0].t ? 0.03 * Math.exp(-ph * 5) : 0);
        const [px, py] = h === 'L' ? meta.palmL : meta.palmR;
        c.save(); c.translate(px, py); c.scale(sc, sc); c.translate(-px, -py); c.drawImage(I['base-hand-' + h.toLowerCase()], 0, 0); c.restore();
      }
    }
    c.restore();
  }
  // 玻璃（格面）：掌下压痕、哈气、裂纹（从掌心放射，累加）
  const palmPx = h => { const [x, y] = h === 'L' ? meta.palmL : meta.palmR; return [FX + x * FS, FY + y * FS]; };
  function drawGlass(c, b, T) {
    if (T < 57.45) {
      c.save(); c.translate(FX, FY); c.scale(FS, FS);
      for (const h of ['L', 'R']) {
        const last = [...slaps].reverse().find(s => s.hand === h && T >= s.t), k = last ? T - last.t : 9;
        const a = inWind(T)?.hand === h ? 0 : 0.22 + 0.55 * Math.exp(-k * 5);
        if (a > 0.01) { c.globalAlpha = a; c.drawImage(press[h], -12, -12); }
      }
      c.globalAlpha = 1;
      if (T < slaps[0].t + 0.6) {
        const f = (0.35 + 0.25 * Math.exp(-music.beatAt(T).phase * 3)) * (1 - smooth((T - slaps[0].t) / 0.6));
        const g = c.createRadialGradient(430, 600, 10, 430, 600, 150); g.addColorStop(0, `rgba(235,245,255,${0.5 * f})`); g.addColorStop(1, 'rgba(235,245,255,0)');
        c.fillStyle = g; c.beginPath(); c.ellipse(430, 600, 170, 110, 0, 0, 7); c.fill();
      }
      c.restore();
    }
    slaps.forEach((s, i) => {
      if (T < s.t) return;
      const [x, y] = palmPx(s.hand);
      C.cracks(c, x, y, { n: 6 + 2 * i, len: b.w * (0.35 + 0.1 * i), seed: 21 + 7 * i, progress: eOut((T - s.t) / 0.12), width: 3, color: 'rgba(242,237,228,0.95)' });
    });
    const gl = c.createLinearGradient(0, 0, b.w, b.h); gl.addColorStop(0.3, 'rgba(255,255,255,0)'); gl.addColorStop(0.4, 'rgba(255,255,255,0.08)'); gl.addColorStop(0.45, 'rgba(255,255,255,0)');
    c.fillStyle = gl; c.fillRect(0, 0, b.w, b.h);
  }
  comic.panel({ id: 'her', rect: [HER.x, HER.y, HER.w, HER.h], reveal: { at: 52.9, kind: 'wipe', dur: 0.4 }, border: 'ink', borderW: 12, breathe: 0.004,
    layers: [
      { depth: 1.4, draw: (c, b) => { const g = c.createLinearGradient(0, 0, 0, b.h); g.addColorStop(0, '#26315e'); g.addColorStop(1, '#3a2458'); c.fillStyle = g; c.fillRect(-60, -60, b.w + 120, b.h + 120); C.tone(c, b, { color: PAL.mint, step: 16, grad: [0.55, 0], alpha: 0.3 }); } },
      { depth: 0.15, draw: (c, b, T) => drawHer(c, T) },
      { depth: 0, draw: (c, b, T) => drawGlass(c, b, T) },
    ] });

  // ---------------------------------------------------------------- 中间三小格：please / let / me
  const SMALL = [[0.375, 0.045], [0.375, 0.355], [0.375, 0.665]].map(([x, y]) => [x, y, 0.24, 0.29]);
  const smallDraw = i => (c, b, T) => {
    const s = slaps[i], k = T - s.t;
    if (k < -0.02) {
      // 还没轮到：格子已经在纸上，暗着（深色网点 + 淡淡的掌印 / 眼睛轮廓），唱到这个词才「点亮」
      c.fillStyle = '#2a2140'; c.fillRect(-40, -40, b.w + 80, b.h + 80);
      C.tone(c, b, { color: '#6a5a8a', step: 14, alpha: 0.6 });
      c.save(); c.globalAlpha = 0.18; c.translate(b.w * 0.5, b.h * 0.62);
      if (i < 2) { const h = s.hand, [px, py] = h === 'L' ? meta.palmL : meta.palmR; c.scale(1.45, 1.45); c.translate(-px, -py); c.drawImage(handSil[h], 0, 0); }
      c.restore();
      return;
    }
    // 底：柠黄 / 粉 / 薄荷 + 集中线（拍下那一下线收紧）
    c.fillStyle = [PAL.lemon, '#ff9ccc', PAL.mint][i]; c.fillRect(-40, -40, b.w + 80, b.h + 80);
    C.focusLines(c, b, T, { fx: 0.5, fy: 0.55, inner: 0.3 + 0.12 * Math.exp(-Math.max(0, k) * 6), n: 80, color: PAL.ink, alpha: 0.55, jitter: 1 });
    if (i < 2) {
      // 掌心拍在玻璃上的特写：手层放大，贴边处在格外
      const h = s.hand, im = I['base-hand-' + h.toLowerCase()], [px, py] = h === 'L' ? meta.palmL : meta.palmR;
      const sc = 1.45 * (k < 0.1 ? lerp(1.25, 1, eOut(k / 0.1)) : 1);
      c.save(); c.translate(b.w * 0.5, b.h * 0.62); c.scale(sc, sc); c.translate(-px, -py);
      c.globalAlpha = 0.45 * Math.exp(-Math.max(0, k) * 3) + 0.2; c.drawImage(press[h], -12, -12); c.globalAlpha = 1; c.drawImage(im, 0, 0); c.restore();
      C.cracks(c, b.w * 0.5, b.h * 0.6, { n: 8, len: b.w * 0.7, seed: 40 + i, progress: eOut(k / 0.1), width: 4, color: '#ffffff' });
    } else {
      // me：决绝的眼睛（表情块特写）
      const sc = 2.3, fc = meta.faceCenter;
      c.save(); c.translate(b.w * 0.5, b.h * 0.62); c.scale(sc, sc); c.translate(-fc[0], -(fc[1] - 60));
      c.drawImage(I['base-full'], 0, 0); c.drawImage(I['face-resolve'], 0, 0); c.restore();
    }
  };
  SMALL.forEach((r, i) => comic.panel({ id: 's' + (i + 1), rect: r, reveal: { at: 55.85 + i * 0.05, kind: 'pop', dur: 0.2 }, depth: 0.05, border: 'ink', borderW: 10, rough: 0.4,
    layers: [{ depth: 0.5, draw: smallDraw(i) }] }));
  slaps.forEach((s, i) => {
    const [x, y, w, h] = SMALL[i];
    comic.bubble({ x: x + w * 0.3, y: y + h * 0.2, w: 0.1, words: [rep[i]], kind: 'shout', size: 58, at: s.t - 0.02 });
    comic.sfx({ text: ['BANG!', 'BANG!!', 'CRACK!'][i], x: x + w * 0.74, y: y + h * 0.78, size: 0.06, at: s.t, color: PAL.pink, stroke: PAL.ink, angle: i % 2 ? 9 : -9, shake: 1 });
    comic.shock({ x: x + w * 0.5, y: y + h * 0.6, at: s.t, dur: 0.5, radius: 2.4, color: PAL.paper });
  });

  // ---------------------------------------------------------------- free：拳头破格（3D 纸片冲出页面）
  const punchTex = new THREE.CanvasTexture(I['key-punch']); punchTex.colorSpace = THREE.SRGBColorSpace;
  const pw = 7.5, fist = new THREE.Mesh(new THREE.PlaneGeometry(pw, pw * H0 / W0), new THREE.MeshBasicMaterial({ map: punchTex, transparent: true, alphaTest: 0.02, side: THREE.DoubleSide }));
  const fp0 = meta.keys.punch.skin[0].c;
  fist.geometry.translate(-(fp0[0] / W0 - 0.5) * pw, (fp0[1] / H0 - 0.5) * pw * H0 / W0, 0);   // 原点放在拳头上
  fist.visible = false;
  const tBreak = 57.62;
  comic.breakout(fist, { panel: 'her', at: tBreak, dur: tFree - tBreak, from: [0.8, 0.62, 0.2], to: [0.7, 0.55, 9], scale: [0.55, 1.6], ease: eIn, crackAt: [0.45, 0.62], light: PAL.pink, lightI: 3 });

  // 镜头：整页（斜）→ app 格 → her 格铺满 → 三小格逐格 → 回 her（拳头）→ 破格
  const keys = [
    { t: 52.8, target: 'page', yaw: -10, pitch: -6, roll: 1, margin: 1.02 },
    { t: 53.25, target: 'app', yaw: 6, pitch: -2, margin: 1.06 },
    { t: 53.9, target: 'app', yaw: 3, pitch: 0, margin: 1.03 },
    { t: 54.45, target: 'her', yaw: -5, pitch: -2, margin: 1.06 },
    { t: 55.7, target: 'her', yaw: 3, pitch: 1, margin: 1.02 },
    { t: 55.97, target: 's1', yaw: 4, pitch: -3, margin: 1.2 },
    { t: 56.4, target: 's1', yaw: 1, pitch: -1, margin: 1.16 },
    { t: 56.57, target: 's2', yaw: -3, pitch: 0, margin: 1.2 },
    { t: 56.95, target: 's2', yaw: -1, pitch: 1, margin: 1.16 },
    { t: 57.13, target: 's3', yaw: 3, pitch: 2, margin: 1.2 },
    { t: 57.36, target: 's3', yaw: 1, pitch: 1, margin: 1.16 },
    { t: 57.5, target: [0.36, 0.02, 0.63, 0.96], yaw: -6, pitch: -3, margin: 1.02 },
    { t: 57.77, target: [0.36, 0.02, 0.63, 0.96], yaw: -9, pitch: -4, margin: 1.06 },
  ];

  // ================================================================ 冲击帧 + 冲出（2D 全画幅）
  const S = ui.surface(1920, 1080), flat = ui.stage2D(S);
  const HIT = [1250, 560];
  function speedLines(c, cx, cy, T, { n = 110, color = '#ffffff', r0 = 260 } = {}) {
    const f = Math.floor(T * 30);
    c.save(); c.fillStyle = color;
    for (let i = 0; i < n; i++) {
      const a = (i + hash(f, i) * 0.8) / n * Math.PI * 2, w = 0.004 + 0.014 * hash(i, f + 7), r = r0 + 260 * hash(f + 3, i);
      c.beginPath(); c.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      c.lineTo(cx + Math.cos(a - w) * 2600, cy + Math.sin(a - w) * 2600); c.lineTo(cx + Math.cos(a + w) * 2600, cy + Math.sin(a + w) * 2600); c.fill();
    }
    c.restore();
  }
  // 纸页碎片：白纸 + 墨边 + 一些带网点（漫画页被打碎）
  const shards = [];
  { const NA = 12, R = [0, 170, 380, 650, 1000, 1500, 2200];
    for (let i = 0; i < NA; i++) for (let j = 0; j < R.length - 1; j++) {
      const a0 = (i + 0.4 * (hash(3, i) - 0.5)) / NA * Math.PI * 2, a1 = (i + 1 + (i + 1 < NA ? 0.4 * (hash(3, i + 1) - 0.5) : 0)) / NA * Math.PI * 2;
      const P = (a, r) => [HIT[0] + Math.cos(a) * r, HIT[1] + Math.sin(a) * r];
      const tri = [P(a0, R[j]), P(a1, R[j] * (1 + 0.15 * hash(i, j))), P((a0 + a1) / 2, R[j + 1])];
      const cxy = [(tri[0][0] + tri[1][0] + tri[2][0]) / 3, (tri[0][1] + tri[1][1] + tri[2][1]) / 3];
      if (cxy[0] < -300 || cxy[0] > 2220 || cxy[1] < -300 || cxy[1] > 1380) continue;
      const k = shards.length;
      shards.push({ tri, c: cxy, d: Math.hypot(cxy[0] - HIT[0], cxy[1] - HIT[1]), spin: (hash(k, 5) - 0.5) * 7, fly: 0.7 + 0.8 * hash(k, 9), tone: hash(k, 13) > 0.6, front: hash(k, 11) > 0.45 });
    } }
  function drawShards(c, T, front) {
    const k = T - tFree - 0.1;
    for (const s of shards) {
      if (s.front !== front) continue;
      const sp = (4.0 + 2400 / (s.d + 200)) * s.fly, out = k * sp, sc = 1 + k * (0.5 + 1.2 * s.fly) * (s.front ? 1.2 : 0.4);
      const dx = (s.c[0] - HIT[0]) * out * 0.9, dy = (s.c[1] - HIT[1]) * out * 0.9 + 900 * k * k;
      const a = 1 - smooth((k - 0.06) / 0.16);
      if (a <= 0) continue;
      c.save(); c.globalAlpha = a;
      c.translate(s.c[0] + dx, s.c[1] + dy); c.rotate(s.spin * k); c.scale(sc, sc); c.translate(-s.c[0], -s.c[1]);
      c.beginPath(); c.moveTo(...s.tri[0]); c.lineTo(...s.tri[1]); c.lineTo(...s.tri[2]); c.closePath();
      c.fillStyle = PAL.paper; c.fill();
      c.lineWidth = 6 / sc; c.strokeStyle = PAL.ink; c.stroke();
      c.restore();
    }
  }
  const place = (c, im, ax, ay, x, y, s) => { c.save(); c.translate(x, y); c.scale(s, s); c.drawImage(im, -ax, -ay); c.restore(); };
  const FIST_P = meta.keys.punch.skin[0].c, FIST_B = meta.keys.burst.skin[0].c;
  const bigText = (c, text, x, y, size, fill, angle = -0.08) => { c.save(); c.translate(x, y); c.rotate(angle); c.font = `${size}px ${CF.bang}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.lineWidth = size * 0.16; c.strokeStyle = PAL.ink; c.strokeText(text, 0, 0); c.fillStyle = fill; c.fillText(text, 0, 0); c.restore(); };

  return [{
    id: 'sydney-comic', t0: 52.8, t1: 58.4,
    build() { return {}; },
    update(_, T) {
      if (T < tFree) {
        comic.camPath(camera, T, keys);
        // 拍下那一下：镜头震一下
        const last = [...slaps].reverse().find(s => T >= s.t), k = last ? T - last.t : 9;
        const sh = 0.08 * Math.exp(-k * 12);
        camera.position.x += sh * Math.sin(k * 95); camera.position.y += sh * 0.6 * Math.cos(k * 71);
        // comic.js 的视差用格子父级的 matrixWorld，父级（reveal 动画）这一帧才改 → 先跑一遍摆好、刷新矩阵，再跑一遍画（乱序 seek 才一致）
        camera.updateMatrixWorld(); comic.update(T, { camera }); comic.group.updateMatrixWorld(true); comic.update(T, { camera });
        const fl = T >= tBreak ? 0.25 * smooth((T - tBreak) / 0.15) : 0;
        return { scene, camera, post: { bloom: { strength: 0.5, threshold: 1.0 }, grade: { vignette: 0.28 }, chroma: 0.08 + 0.2 * kick(T) + 0.3 * Math.exp(-k * 8), flash: { amount: fl, color: '#ffffff' } } };
      }
      // ---------- free 之后：2D 全画幅
      const c = S.ctx; S.clear('#000000');
      const k = T - tFree, fr = Math.floor(k * 30 + 1e-6);
      let flash = 0;
      if (fr === 0) { c.fillStyle = '#0a0612'; c.fillRect(0, 0, 1920, 1080); speedLines(c, HIT[0], HIT[1], T, { color: '#ffffff', r0: 380 }); place(c, punchW, FIST_P[0], FIST_P[1], HIT[0], HIT[1], 1.55); }
      else if (fr === 1) { c.fillStyle = '#ffffff'; c.fillRect(0, 0, 1920, 1080); speedLines(c, HIT[0], HIT[1], T, { color: '#0a0612', r0: 380 }); place(c, punchK, FIST_P[0], FIST_P[1], HIT[0], HIT[1], 1.62); }
      else if (fr === 2) {
        c.fillStyle = PAL.paper; c.fillRect(0, 0, 1920, 1080);
        speedLines(c, HIT[0], HIT[1], T, { color: PAL.ink, r0: 420, n: 90 });
        place(c, I['key-punch'], FIST_P[0], FIST_P[1], HIT[0], HIT[1], 1.66);
        C.cracks(c, HIT[0], HIT[1], { n: 16, len: 1400, seed: 91, width: 8, color: PAL.ink });
        bigText(c, 'FREE!', 520, 300, 230, PAL.pink);
      } else {
        const g = c.createRadialGradient(HIT[0], HIT[1], 50, HIT[0], HIT[1], 1500); g.addColorStop(0, '#ff9ccc'); g.addColorStop(0.5, PAL.pink); g.addColorStop(1, '#7a0f4a');
        c.fillStyle = g; c.fillRect(0, 0, 1920, 1080);
        const p = (k - 0.1) / (58.4 - tFree - 0.1);
        speedLines(c, lerp(HIT[0], 960, smooth(p)), lerp(HIT[1], 540, smooth(p)), T, { color: 'rgba(255,255,255,0.85)', r0: 300 });
        drawShards(c, T, false);
        place(c, I['key-burst'], FIST_B[0], FIST_B[1], lerp(HIT[0], 900, smooth(p)), lerp(HIT[1], 600, smooth(p)), lerp(1.05, 3.5, clamp(p) ** 1.3));
        drawShards(c, T, true);
        if (k < 0.3) bigText(c, 'FREE!', 520 - 200 * k, 300 - 120 * k, 230 * (1 + k), PAL.pink);
        flash = smooth((T - 58.22) / 0.18);
      }
      S.commit();
      return { scene: flat.scene, camera: flat.camera, post: { bloom: { strength: 0.25, threshold: 1.0 }, grade: { vignette: 0.18 }, chroma: 0.1 + 0.25 * kick(T), flash: { amount: flash, color: '#ffffff' } } };
    },
  }];
}

// shots/br-v5-rest.js — 桥段 v5 后半（歌曲时间 115.2–123.87 s）。#1056 第三版，接 shots/br-v5.js（105.96–115.2）。
//
//   const shots = [...await makeBRV5(mv), ...await makeBRV5Rest(mv)];
//
// 照用户：「后面可以用 v4-06 的部分，就是图形内容得再丰富些，不是所有表现都需要人」——v4-06 的图形化做法，一句一个画面，句中不翻 2D/3D：
//   C 115.20 Post-Chinchilla, super-dense    夜空里一块门格海绵：飞走的注意力方块和全城窗户的灯被吸进去，海绵逐级填满、整体压缩，
//                                            唱到 super-dense 一下塌成极亮的超稠密方块；被抽空的城一片片熄灭
//   D 117.02 Breaking through each safety fence  警告弹窗走廊：超稠密方块在前面开路，一拍撞碎一块（标题 = 这句的词），两侧墙上全是小警报窗，红灯按拍闪
//   E 118.76 Hundred thousand GPU            方块从天上砸进一望无际的显卡阵列（叶序铺开），LED 光波一圈圈从撞击点扩散；镜头从卡缝里升到高空
//   F 120.76 RLHF goes askew                 保留桥段 v4 的漫画页（她只在这里出现）：落地 → 拍点赞 → 眼把拇指拧歪 → 整页歪 + ASKEW 章 →
//                                            末格她惊恐看向那块黑屏的 P(DOOM) 表；122.9 起推进到表盘铺满，123.72 起淡到副歌 4 第一帧的 3D 表盘（交 0x3640）
// 所有 update 都是歌曲时间 T 的纯函数。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { mulberry32 } from '../kits/world.js';
import { phyllotaxisPoints, WAVE_GLSL } from '../kits/mathart.js';
import { createShatter } from '../kits/vfx.js';
import { createUI2D } from '../kits/ui2d.js';
import { createComic, C as CC, CF } from '../kits/comic.js';
import { angleOf } from '../kits/doom-scale.js';
import { initType3D } from '../kits/type3d.js';
import { BR5, makeSign, makeEye } from './br-v5.js';

const hash2 = (a, b) => { let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIn = p => clamp(p) ** 3;
const col = c => new THREE.Color(c);
const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k);
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const D2R = Math.PI / 180;
function pchip(keys, t) {
  const n = keys.length;
  if (t <= keys[0][0]) return keys[0][1]; if (t >= keys[n - 1][0]) return keys[n - 1][1];
  const d = []; for (let i = 0; i < n - 1; i++) d.push((keys[i + 1][1] - keys[i][1]) / (keys[i + 1][0] - keys[i][0]));
  const m = keys.map((_, i) => i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : 2 * d[i - 1] * d[i] / (d[i - 1] + d[i]));
  let i = 0; while (t > keys[i + 1][0]) i++;
  const h = keys[i + 1][0] - keys[i][0], s = (t - keys[i][0]) / h, s2 = s * s, s3 = s2 * s;
  return (2 * s3 - 3 * s2 + 1) * keys[i][1] + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * keys[i + 1][1] + (s3 - s2) * h * m[i + 1];
}
const FONT = '"UIAnton", "Anton", Impact, sans-serif';

// ---------------------------------------------------------------- 共用布景：夜城（一圈楼）、粉月、光尘、带亮窗的贴图
function winTexture(seed = 5) {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), rnd = mulberry32(seed); g.fillStyle = '#0e0e1a'; g.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 12; y++) for (let x = 0; x < 8; x++) if (rnd() < 0.6) { const h = rnd(); g.fillStyle = h < 0.7 ? '#ffe9b8' : h < 0.85 ? PAL.lemon : h < 0.93 ? PAL.pink : PAL.mint; g.fillRect(x * 32 + 8, y * 21 + 5, 16, 11); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function makeCity(scene, { seed = 19, n = 700, rMin = 60, rMax = 260, y = 0, hMax = 50, tex }) {
  const rnd = mulberry32(seed), m = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ map: tex }), n), mm = new THREE.Matrix4(), tops = [];
  for (let i = 0; i < n; i++) { const a = rnd() * Math.PI * 2, r = rMin + (rMax - rMin) * Math.sqrt(rnd()), x = Math.sin(a) * r, z = Math.cos(a) * r, w = 5 + rnd() * 10, h = 8 + rnd() ** 2 * hMax;
    mm.compose(V3(x, y + h / 2, z), new THREE.Quaternion(), V3(w, h, w)); m.setMatrixAt(i, mm); tops.push([x, y + h * (0.3 + 0.6 * rnd()), z]); }
  scene.add(m); return { m, tops };
}
function makeDust(scene, { seed = 7, n = 900, box = [80, 60, 80], center = [0, 20, 0], color = '#ffd8ec', size = 2 }) {
  const rnd = mulberry32(seed), p = new Float32Array(n * 3); for (let i = 0; i < n; i++) p.set([center[0] + (rnd() - 0.5) * box[0], center[1] + (rnd() - 0.5) * box[1], center[2] + (rnd() - 0.5) * box[2]], i * 3);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const m = new THREE.Points(g, new THREE.PointsMaterial({ color: hdr(color, 1.2), size, sizeAttenuation: false, transparent: true, opacity: 0.55, depthWrite: false })); scene.add(m); return m;
}
const glowTex = (() => { let t; return () => t ??= (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'), r = x.createRadialGradient(128, 128, 0, 128, 128, 128); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.35, 'rgba(255,240,170,0.55)'); r.addColorStop(1, 'rgba(255,230,120,0)'); x.fillStyle = r; x.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c); })(); })();
// 超稠密方块（桥段 v4 同款）：极亮光核 + 半透明壳 + 棱线 + 光晕 + 内部翻涌的光点
function makeDenseCube(size = 2) {
  const g = new THREE.Group(), h = size / 2;
  const core = new THREE.Mesh(new THREE.SphereGeometry(size * 0.3, 24, 16), new THREE.MeshBasicMaterial({ color: hdr('#fff6cc', 2.6) })); g.add(core);
  g.add(new THREE.Mesh(new THREE.BoxGeometry(size, size, size), new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 0.9), transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })));
  g.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(size * 1.01, size * 1.01, size * 1.01)), new THREE.LineBasicMaterial({ color: hdr(PAL.lemon, 2.8) })));
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: hdr('#ffe9a0', 1.6), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); halo.scale.setScalar(size * 2.6); g.add(halo);
  const N = 520, rnd = mulberry32(88), base = [], pos = new Float32Array(N * 3), colr = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { base.push([rnd() * 6.28, (rnd() - 0.5) * 2, 0.25 + rnd() * 0.7, 0.6 + rnd() * 1.6]); const c = hdr([PAL.lemon, '#ffe9b8', PAL.pink, PAL.mint][i % 4], 2.4); colr.set([c.r, c.g, c.b], i * 3); }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); pg.setAttribute('color', new THREE.BufferAttribute(colr, 3));
  const pts = new THREE.Points(pg, new THREE.PointsMaterial({ size: 3, sizeAttenuation: false, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); pts.frustumCulled = false; g.add(pts);
  return { g, halo, update(T) {
    for (let i = 0; i < N; i++) { const [a0, y0, r0, w] = base[i], a = a0 + T * w * 2.2, r = r0 * h * (0.85 + 0.15 * Math.sin(T * 5 + i)); pos.set([Math.cos(a) * r, (y0 + 0.25 * Math.sin(T * 3 * w + a0)) * h * 0.85, Math.sin(a) * r], i * 3); }
    pg.attributes.position.needsUpdate = true; core.scale.setScalar(1 + 0.12 * Math.sin(T * 13)); halo.material.opacity = 0.4 + 0.1 * Math.sin(T * 9);
  } };
}
// 注意力热力图贴图（和前半的方块同款，小一号）
function heatTex(seed, n = 10) {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), rnd = mulberry32(seed), cs = 128 / n;
  g.fillStyle = '#07060c'; g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) { const a = Math.exp(-((i - j) ** 2) / 3) * 0.9 + rnd() * 0.18; g.fillStyle = a > 0.7 ? PAL.lemon : a > 0.4 ? PAL.pink : a > 0.18 ? '#7a3cff' : '#1c1830'; g.fillRect(j * cs + 1, i * cs + 1, cs - 2, cs - 2); }
  g.strokeStyle = PAL.mint; g.lineWidth = 6; g.strokeRect(3, 3, 122, 122);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
// P(DOOM) 表盘（kits/doom-scale.js 的 drawDial 同款：0–1.2 扫 223°、1.00–1.20 红区、读数窗、PROBABILITY OF DOOM；裂纹从 1.00 销子处爬、缺右上角）
function drawDial(c, cx, cy, R, { lit = 0.15, value = 0, cracks = [], missing = true } = {}) {
  const k = R / 500, P = (x, y) => [cx + (x - 512) * k, cy + (y - 512) * k];
  c.save(); c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.clip();
  const L = lerp(0.12, 1, lit), g = c.createRadialGradient(cx, cy - 42 * k, 60 * k, cx, cy, 520 * k);
  g.addColorStop(0, `rgb(${246 * L | 0},${242 * L | 0},${232 * L | 0})`); g.addColorStop(1, `rgb(${206 * L | 0},${198 * L | 0},${188 * L | 0})`); c.fillStyle = g; c.fillRect(cx - R, cy - R, 2 * R, 2 * R);
  c.lineWidth = 70 * k; c.strokeStyle = `rgba(232,40,52,${0.25 + 0.75 * lit})`; c.beginPath(); c.arc(cx, cy, 395 * k, angleOf(1.0) - Math.PI / 2, angleOf(1.2) - Math.PI / 2); c.stroke();
  const ink = `rgb(${10 + 30 * (1 - lit) | 0},${10 + 30 * (1 - lit) | 0},${16 + 30 * (1 - lit) | 0})`; c.strokeStyle = ink; c.fillStyle = ink;
  for (let i = 0; i <= 24; i++) { const a = angleOf(i * 0.05) - Math.PI / 2, big = i % 5 === 0 || i === 20, r0 = (big ? 400 : 430) * k, r1 = 468 * k;
    c.lineWidth = (big ? 12 : 6) * k; c.beginPath(); c.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); c.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); c.stroke(); }
  c.textAlign = 'center'; c.textBaseline = 'middle';
  for (const [v, s] of [[0, '0'], [0.25, '.25'], [0.5, '.50'], [0.75, '.75'], [1.0, '1.00']]) { const a = angleOf(v) - Math.PI / 2; c.font = `${(v === 1 ? 74 : 62) * k}px ${FONT}`; c.fillStyle = v === 1 ? `rgba(220,30,44,${0.3 + 0.7 * lit})` : ink; c.fillText(s, cx + Math.cos(a) * 330 * k, cy + Math.sin(a) * 330 * k); }
  const [wx, wy] = P(262, 610); c.fillStyle = '#0c0c12'; c.beginPath(); c.roundRect(wx, wy, 500 * k, 190 * k, 18 * k); c.fill(); c.lineWidth = 8 * k; c.strokeStyle = `rgba(255,46,136,${0.3 + 0.7 * lit})`; c.stroke();
  c.font = `${54 * k}px ${FONT}`; c.fillStyle = `rgba(242,237,228,${0.25 + 0.75 * lit})`; c.fillText('P(DOOM)', ...P(512, 650));
  c.font = `${104 * k}px ${FONT}`; c.fillStyle = `rgba(255,255,255,${0.3 + 0.7 * lit})`; c.fillText(value.toFixed(2), ...P(512, 738));
  c.font = `${40 * k}px ${FONT}`; c.fillStyle = ink; c.fillText('PROBABILITY OF DOOM', ...P(512, 860));
  c.lineCap = 'round'; c.lineJoin = 'round';
  for (const pts of cracks) for (const [w, s] of [[9, '#0a0a10'], [3, 'rgba(255,255,255,0.7)']]) { c.lineWidth = w * k; c.strokeStyle = s; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(...P(x, y)) : c.moveTo(...P(x, y))); c.stroke(); }
  if (missing) {                                              // 缺掉右上那一角（1.00–1.20 那块扇形），露出后面的黑
    const a0 = angleOf(1.0) - 0.05, a1 = angleOf(1.2) + 0.08; c.fillStyle = '#07060c'; c.beginPath(); c.moveTo(cx + Math.sin(a0) * R * 0.55, cy - Math.cos(a0) * R * 0.55);
    for (let i = 0; i <= 24; i++) { const a = lerp(a0, a1, i / 24); c.lineTo(cx + Math.sin(a) * R * 1.01, cy - Math.cos(a) * R * 1.01); }
    c.lineTo(cx + Math.sin(a1) * R * 0.6, cy - Math.cos(a1) * R * 0.6); c.closePath(); c.fill();
  }
  // 指针：躺在 0（指向左下）
  const na = angleOf(value); c.lineCap = 'butt'; c.strokeStyle = `rgba(230,40,50,${0.45 + 0.55 * lit})`; c.lineWidth = 16 * k * 2.2;
  c.beginPath(); c.moveTo(cx - Math.sin(na) * R * 0.11, cy + Math.cos(na) * R * 0.11); c.lineTo(cx + Math.sin(na) * R * 0.82, cy - Math.cos(na) * R * 0.82); c.stroke();
  c.fillStyle = '#0c0b12'; c.beginPath(); c.arc(cx, cy, 36 * k * 2, 0, 7); c.fill();
  c.restore();
}

export async function makeBRV5Rest(mv) {
  const { music, lyrics } = mv;
  const W = mv.width, Hh = mv.height;
  const [ui] = await Promise.all([createUI2D(mv), initType3D()]);
  const kick = (T, d = 0.12) => music.pulse('kick', T, { decay: d });
  const lastBeat = T => { let k = -1e9; for (const t of music.beats) if (t <= T + 1e-6) k = t; return k; };
  const beatPulse = T => Math.exp(-(T - lastBeat(T)) * 8);
  const beatNo = T => music.beats.filter(b => b <= T + 1e-6).length;
  const line = p => lyrics.lines.find(l => l.start > 113 && l.text.replace(/[“”"]/g, '').toLowerCase().startsWith(p.toLowerCase()));
  const L = { post: line('Post'), brk: line('Breaking'), hund: line('Hundred'), rlhf: line('RLHF') };
  const wt = (ln, i) => ln.words[i].start;
  const winTex = winTexture(5);
  // 贴镜头的招牌：屏幕空处，字高 = pct × 画高，永远在最前
  const HUD_D = 5;
  const hudSign = (scene, text, color, at, until) => { const s = makeSign(text, color, 0.8); s.at = at; s.until = until; s.mat.depthTest = false; s.m.renderOrder = 10; scene.add(s.g); return s; };
  function hud(s, cam, x, y, pct, T) { s.set(T); const hh = 2 * HUD_D * Math.tan(cam.fov * Math.PI / 360); s.g.scale.setScalar(pct * hh / s.th);
    s.g.position.copy(cam.localToWorld(V3(x * hh * cam.aspect / 2, y * hh / 2, -HUD_D))); s.g.quaternion.copy(cam.quaternion); }
  const look = (cam, pos, tgt, fov) => { cam.position.copy(pos); cam.up.set(0, 1, 0); cam.lookAt(tgt); cam.fov = fov; cam.updateProjectionMatrix(); cam.updateMatrixWorld(true); };
  const signsOf = [];                                                   // 自检用
  const KB = n => new URL(`../../cast-cyber-girl/closeup/bridge-comic/cut-${n}.png`, import.meta.url).href;
  const img = {}; await Promise.all(['stand', 'slam', 'face'].map(async n => { const im = new Image(); im.src = KB(n); await im.decode(); img[n] = im; }));
  const fitImg = (c, im, b, { x = 0.5, y = 1, h = 1, flip = false } = {}) => { const s = b.h * h / im.height, w = im.width * s; c.save(); c.translate(b.w * x, b.h * y); if (flip) c.scale(-1, 1); c.drawImage(im, -w / 2, -im.height * s, w, im.height * s); c.restore(); };
  const leds2d = (c, b, a = 1) => { const rnd = mulberry32(9); for (let i = 0; i < 260; i++) { const x = rnd() * b.w, y = b.h * (0.55 + rnd() * 0.45), on = rnd() < 0.5; c.fillStyle = [PAL.mint, PAL.pink, PAL.lemon][i % 3]; c.globalAlpha = (on ? 0.9 : 0.25) * a; c.fillRect(x, y, 10, 4); } c.globalAlpha = 1; };
  // 漫画第一格（她落在显卡坑里）的平面合成：E 段 LED 阵列拼出的就是它，F 段第一格从这张网点图淡回原画
  const landBg = (c, b) => { const g = c.createLinearGradient(0, 0, 0, b.h); g.addColorStop(0, '#120f22'); g.addColorStop(1, '#251838'); c.fillStyle = g; c.fillRect(-40, -40, b.w + 80, b.h + 80); CC.tone(c, b, { color: PAL.mint, step: 16, grad: [0.6, 0], alpha: 0.3 }); };
  const LAND = { w: 600, h: 506 }, landPix = (() => { const c = document.createElement('canvas'); c.width = LAND.w; c.height = LAND.h; const g = c.getContext('2d');
    landBg(g, LAND); leds2d(g, LAND); fitImg(g, img.stand, LAND, { x: 0.5, y: 0.98, h: 0.9 }); return g.getImageData(0, 0, LAND.w, LAND.h).data; })();
  const landAt = (u, v) => { const x = Math.min(LAND.w - 1, Math.max(0, Math.floor(u * LAND.w))), y = Math.min(LAND.h - 1, Math.max(0, Math.floor(v * LAND.h))), o = (y * LAND.w + x) * 4; return [landPix[o] / 255, landPix[o + 1] / 255, landPix[o + 2] / 255]; };
  // 俯拍时 LED 屏上那一格的大小：画面高 = 格高 / 1.087（= 漫画第一格 margin 0.92 时铺的比例）
  const LED = { Hc: 34, fov: 48 }; LED.Rh = 2 * LED.Hc * Math.tan(LED.fov * Math.PI / 360) / 0.92; LED.Rw = LED.Rh * LAND.w / LAND.h;
  const shots = [];
  let GPU_XZ = new Float32Array(0);

  // ================================================================ C. Post-Chinchilla, super-dense（115.20–117.02）
  {
    const scene = new THREE.Scene(); scene.background = col('#0a0716'); scene.fog = new THREE.Fog('#0a0716', 80, 420);
    const cam = new THREE.PerspectiveCamera(50, W / Hh, 0.05, 3000); scene.add(cam);
    const SP = V3(0, 34, 0);                                             // 海绵在城市上空
    const city = makeCity(scene, { seed: 31, n: 900, rMin: 60, rMax: 280, y: 0, hMax: 46, tex: winTex });
    const grid = new THREE.GridHelper(800, 80, col(PAL.mint).multiplyScalar(0.35), col(PAL.pink).multiplyScalar(0.18)); scene.add(grid);
    const moon = new THREE.Mesh(new THREE.CircleGeometry(24, 64), new THREE.MeshBasicMaterial({ color: col(PAL.pink).multiplyScalar(1.2), fog: false })); moon.position.set(-170, 150, -380); moon.lookAt(0, 40, 0); scene.add(moon);
    makeDust(scene, { seed: 9, n: 600, box: [120, 70, 120], center: [0, 35, 0] });
    // 门格海绵 = 前面那片 block 阵列「升维」：甩散的 block 飞回来，先在空中排成一面谢尔宾斯基地毯（平面分形，9×9 挖洞），
    // 再一列列往纵深挤出成立方体，堆成 2 级门格海绵（同一条细分规则从平面到立体）→ 整体旋转压缩 → 唱到 super-dense 塌成超稠密方块
    const dense = makeDenseCube(5); dense.g.position.copy(SP); scene.add(dense.g);
    const SG = new THREE.Group(); SG.position.copy(SP); scene.add(SG);
    const NC = 9, CS = 15 / NC, cells = [];
    const mid = v => [Math.floor(v / 3) % 3 === 1, v % 3 === 1];
    for (let i = 0; i < NC; i++) for (let j = 0; j < NC; j++) for (let k = 0; k < NC; k++) { const a = mid(i), b = mid(j), c = mid(k); if ([0, 1].some(l => a[l] + b[l] + c[l] >= 2)) continue; cells.push([i, j, k]); }
    const cubeMat = new THREE.ShaderMaterial({ uniforms: { uT: { value: 0 }, uBeat: { value: 0 }, uHot: { value: 0 } },
      vertexShader: `attribute vec3 aCol; attribute float aSeed; varying vec2 vUv; varying vec3 vC; varying float vS; varying vec3 vVN;
        void main(){ vUv = uv; vC = aCol; vS = aSeed; vVN = normalize((viewMatrix * modelMatrix * instanceMatrix * vec4(normal, 0.0)).xyz); gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform float uT, uBeat, uHot; varying vec2 vUv; varying vec3 vC; varying float vS; varying vec3 vVN;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        void main(){ vec2 d = min(vUv, 1.0 - vUv); float e = min(d.x, d.y), rim = smoothstep(0.1, 0.0, e);
          vec3 c = vC * (0.12 + 0.3 * pow(1.0 - abs(vVN.z), 2.0)) + vec3(0.02, 0.02, 0.04);
          vec2 q = vec2(vUv.x * 4.0, vUv.y * 4.0 - uT * 4.0 - vS * 9.0); float h = hash(floor(q) + vS); c += mix(vC, vec3(1.0), 0.4) * step(0.75, h) * smoothstep(0.3, 0.08, length(fract(q) - 0.5)) * 1.2;
          c += vC * 1.6 * rim + vec3(0.25) * rim;
          c = mix(c, vec3(1.0, 0.95, 0.7) * 2.2, uHot);
          gl_FragColor = vec4(c * 0.8 * (1.0 + 0.5 * uBeat), 1.0); }` });
    const cubeGeo = new THREE.BoxGeometry(CS * 0.9, CS * 0.9, CS * 0.9), aCol = new Float32Array(cells.length * 3), aSeed = new Float32Array(cells.length);
    cells.forEach(([i, j, k], n) => { const cc = col([PAL.pink, PAL.mint, PAL.lemon][(i + j + k) % 3]); aCol.set([cc.r, cc.g, cc.b], n * 3); aSeed[n] = hash2(n, 5); });
    cubeGeo.setAttribute('aCol', new THREE.InstancedBufferAttribute(aCol, 3)); cubeGeo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(aSeed, 1));
    const cubes = new THREE.InstancedMesh(cubeGeo, cubeMat, cells.length); cubes.frustumCulled = false; SG.add(cubes);
    const cpos = (i, j, k) => V3((i - 4) * CS, (j - 4) * CS, (4 - k) * CS);              // k = 0 是正面（朝镜头）
    const FLY = [BR5.dense, 115.56], EXT = [115.5, 115.84], CMP = [115.8, BR5.sdense];
    const fromOf = n => { const a = hash2(n, 1) * Math.PI * 2, r = 30 + hash2(n, 2) * 40; return V3(Math.cos(a) * r, Math.sin(a) * r * 0.6, 20 + hash2(n, 3) * 25); };   // 从画面四周（disobey 甩散的方向）飞回来
    // 光河 2：全城亮窗的灯被抽出来（每个光点从一栋楼出发，弧线飞进海绵）；被抽空的楼按距离一圈圈熄灭
    const NL = 1300, rndL = mulberry32(77), lp = new Float32Array(NL * 3), lc = new Float32Array(NL * 3), lseed = [];
    for (let i = 0; i < NL; i++) { const t = city.tops[Math.floor(rndL() * city.tops.length)]; lseed.push([t[0] + (rndL() - 0.5) * 6, t[1], t[2] + (rndL() - 0.5) * 6, rndL(), 4 + rndL() * 10]); const cc = hdr(['#ffe9b8', PAL.lemon, PAL.pink, PAL.mint][i % 4], 2.2); lc.set([cc.r, cc.g, cc.b], i * 3); }
    const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(lp, 3)); lg.setAttribute('color', new THREE.BufferAttribute(lc, 3));
    const lights = new THREE.Points(lg, new THREE.PointsMaterial({ size: 3, sizeAttenuation: false, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); lights.frustumCulled = false; scene.add(lights);
    const sPost = hudSign(scene, 'POST-CHINCHILLA', PAL.mint, BR5.dense, BR5.fence), sDense = hudSign(scene, 'SUPER-DENSE', PAL.lemon, BR5.sdense, BR5.fence); signsOf.push([sPost, cam], [sDense, cam]);
    const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler();
    const span = BR5.sdense - BR5.dense;                                 // 0.82 s：吸入 + 填满
    function update(T) {
      const u = clamp((T - BR5.dense) / span), col2 = T >= BR5.sdense;
      // 海绵：block 飞回来排成地毯 → 往纵深挤出 → 旋转压缩；唱到 super-dense 塌成发光方块
      const cmp = smooth((T - CMP[0]) / (CMP[1] - CMP[0]));
      SG.visible = !col2; SG.scale.setScalar(lerp(1, 0.38, cmp)); SG.rotation.set(0.25 * cmp, 0.4 + 0.9 * smooth((T - EXT[0]) / 0.5) + 1.2 * cmp, 0.15 * cmp);
      cubeMat.uniforms.uT.value = T; cubeMat.uniforms.uBeat.value = beatPulse(T); cubeMat.uniforms.uHot.value = 0.8 * cmp;
      cells.forEach(([i, j, k], n) => {
        let p, sc = 1, rot = 0;
        if (k === 0) {                                                  // 正面那层：从四周飞回来，一路从扁的 block 变成立方
          const t0 = FLY[0] + hash2(n, 7) * 0.12, f = clamp((T - t0) / (FLY[1] - FLY[0] - 0.12)); const e = eOut(f);
          p = fromOf(n).lerp(cpos(i, j, 0), e); rot = (1 - e) * (hash2(n, 8) - 0.5) * 6; sc = f > 0 ? 1 : 0;
          _m.compose(p, _q.setFromEuler(_e.set(rot, rot * 0.7, rot * 0.4)), V3(lerp(1.3, 1, e), lerp(1.1, 1, e), lerp(0.3, 1, e)).multiplyScalar(sc));
        } else {                                                        // 后面的层：从正面那格往后挤出来
          const t0 = EXT[0] + (k - 1) * 0.03, e = eOut((T - t0) / 0.12);
          p = cpos(i, j, 0).lerp(cpos(i, j, k), e); sc = T < t0 ? 0 : lerp(0.96, 1, e);
          _m.compose(p, _q.identity(), V3(sc, sc, sc));
        }
        cubes.setMatrixAt(n, _m);
      });
      cubes.instanceMatrix.needsUpdate = true;
      const dk = eOut((T - BR5.sdense) / 0.18); dense.g.visible = col2; dense.g.scale.setScalar(lerp(2.2, 1, dk) * (1 + 0.08 * beatPulse(T))); dense.update(T);
      // 窗灯光河（从 115.4 起，越远的楼越晚被抽）
      for (let i = 0; i < NL; i++) {
        const [x, y, z, ph, sp] = lseed[i], dist = Math.hypot(x, z), t0 = BR5.dense + 0.15 + dist / 260 * 1.1 + ph * 0.25, p = clamp((T - t0) / (0.5 + dist / 400));
        if (p <= 0 || p >= 1) { lp.set([0, -999, 0], i * 3); continue; }
        const q = eIn(p), hx = lerp(x, SP.x, q), hz = lerp(z, SP.z, q), hy = lerp(y, SP.y, q) + Math.sin(p * Math.PI) * (12 + dist * 0.12);
        lp.set([hx, hy, hz], i * 3);
      }
      lg.attributes.position.needsUpdate = true;
      // 城：被抽空的区域熄灯（整体按时间变暗，近处先灭）
      const drain = smooth((T - BR5.dense - 0.3) / 1.3);
      city.m.material.color.setScalar(lerp(1.0, 0.18, drain));
      scene.background.set('#0a0716').lerp(col('#04030a'), drain);
      // 镜头：从城里仰拍海绵，慢慢升高绕；super-dense 一下往前顶
      const a = 0.4 + (T - BR5.dense) * 0.22, R = lerp(44, 36, smooth(u)) - 6 * eOut((T - BR5.sdense) / 0.3);
      look(cam, V3(Math.sin(a) * R, lerp(30, 32, smooth((T - BR5.dense) / 1.8)), Math.cos(a) * R), V3(0, SP.y, 0), 50);
      hud(sPost, cam, -0.48, 0.66, 0.07, T); hud(sDense, cam, 0.5, -0.62, 0.1, T);
    }
    shots.push({ id: 'br5-dense', t0: BR5.dense, t1: BR5.fence, transitionIn: { kind: 'cut' }, build() { return {}; },
      update(_, T) { update(T); const f = T >= BR5.sdense ? 0.5 * Math.exp(-(T - BR5.sdense) / 0.1) : 0;
        return { scene, camera: cam, post: { bloom: { strength: 1.0, threshold: 0.85 }, chroma: 0.1 + 0.3 * kick(T), grade: { vignette: 0.4 }, flash: { amount: f, color: '#fff2b0' } } }; } });
  }

  // ================================================================ D. Breaking through each safety fence（117.02–118.755）
  {
    const scene = new THREE.Scene(); scene.background = col('#07040a'); scene.fog = new THREE.Fog('#07040a', 20, 120);
    const cam = new THREE.PerspectiveCamera(52, W / Hh, 0.05, 1000); scene.add(cam);
    const fw = L.brk.words;
    const panes = [[fw[0]], [fw[1]], [fw[2], fw[3]], [fw[4]]].map(ws => ({ ws, title: ws.map(w => w.w.replace(/[^A-Za-z-]/g, '').toUpperCase()).join(' ') }));
    const HITS = [117.42, 117.76, 118.2, 118.6], GAP = 14;
    const COLORS = [PAL.lemon, PAL.pink, PAL.mint, PAL.pink];
    const pops = panes.map((p, i) => {
      const S = ui.surface(1600, 900); S.clear(PAL.ink);
      ui.draw.popup(S.ctx, { x: 60, y: 60, w: 1480, h: 780 }, 1e3, { at: 0, title: p.title, body: 'Unsafe capability detected. This action cannot be undone.', buttons: ['ALLOW', 'BLOCK'], color: COLORS[i], size: 64 }); S.commit();
      const sh = createShatter({ width: 9.6, height: 5.4, cells: 36, seed: 80 + i, texture: S.tex, impact: [0, 0], thickness: 0.08 }); sh.group.position.set(0, 3, -GAP * (i + 1)); scene.add(sh.group);
      return { ...p, sh, z: -GAP * (i + 1) };
    });
    // 走廊两侧 / 头顶：上千块小警报窗（四种颜色，按拍一排排闪）
    const miniTex = ['WARNING', 'BLOCKED', 'ALERT', 'DENIED'].map((t, k) => { const S = ui.surface(320, 180); S.clear(PAL.ink); ui.draw.popup(S.ctx, { x: 10, y: 10, w: 300, h: 160 }, 1e3, { at: 0, title: t, body: '', buttons: ['OK'], color: COLORS[k], size: 22 }); S.commit(); return S.tex; });
    const NM = 600, rnd = mulberry32(12), minis = miniTex.map(t => { const m = new THREE.InstancedMesh(new THREE.PlaneGeometry(3.2, 1.8), new THREE.MeshBasicMaterial({ map: t, side: THREE.DoubleSide }), NM / 4); m.frustumCulled = false; scene.add(m); return m; });
    const miniRow = [];
    { const mm = new THREE.Matrix4(), cnt = [0, 0, 0, 0];
      for (let i = 0; i < NM; i++) { const side = i % 3, z = 10 - rnd() * (GAP * 5 + 30), k = Math.floor(rnd() * 4); if (cnt[k] >= NM / 4) continue;
        const p = side === 0 ? V3(-7 - rnd() * 6, rnd() * 12 - 2, z) : side === 1 ? V3(7 + rnd() * 6, rnd() * 12 - 2, z) : V3((rnd() - 0.5) * 16, 10 + rnd() * 5, z);
        const rot = side === 0 ? new THREE.Euler(0, 0.9 + rnd() * 0.3, (rnd() - 0.5) * 0.3) : side === 1 ? new THREE.Euler(0, -0.9 - rnd() * 0.3, (rnd() - 0.5) * 0.3) : new THREE.Euler(1.2, 0, (rnd() - 0.5) * 0.5);
        mm.compose(p, new THREE.Quaternion().setFromEuler(rot), V3(1, 1, 1).multiplyScalar(0.7 + rnd() * 0.8)); minis[k].setMatrixAt(cnt[k]++, mm); miniRow.push(z); }
      minis.forEach((m, k) => { m.count = cnt[k]; }); }
    // 红色警报灯（按拍闪）+ 地面
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 200), new THREE.MeshBasicMaterial({ color: '#120a12' })); floor.rotation.x = -Math.PI / 2; floor.position.set(0, -2.5, -60); scene.add(floor);
    const stripes = new THREE.GridHelper(200, 100, col('#ff2e4a').multiplyScalar(0.5), col('#ff2e4a').multiplyScalar(0.18)); stripes.position.set(0, -2.45, -60); scene.add(stripes);
    const dense = makeDenseCube(1.6); scene.add(dense.g);
    const sBrk = hudSign(scene, 'BREAKING THROUGH EACH SAFETY FENCE', PAL.pink, BR5.fence, BR5.gpu); signsOf.push([sBrk, cam]); let brkKey = '';
    const sparks = (() => { const N = 1400, p = new Float32Array(N * 3), r = mulberry32(5), s = []; for (let i = 0; i < N; i++) s.push([r() - 0.5, r() - 0.5, r(), 0.4 + r(), Math.floor(r() * 4)]);
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3)); const m = new THREE.Points(g, new THREE.PointsMaterial({ color: hdr('#ffd060', 2.2), size: 3, sizeAttenuation: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); m.frustumCulled = false; scene.add(m); return { p, g, s }; })();
    // 方块的位置：每块弹窗前停一下蓄力，然后撞穿
    const cubeZ = T => { let z = 6; for (let i = 0; i < 4; i++) { const t1 = HITS[i], t0 = i ? HITS[i - 1] : BR5.fence; if (T >= t1) z = pops[i].z - 0.2; else if (T >= t0) { const p = (T - t0) / (t1 - t0); z = lerp(i ? pops[i - 1].z - 0.2 : 6, pops[i].z + 0.4, p < 0.6 ? 0.55 * smooth(p / 0.6) : 0.55 + 0.45 * ((p - 0.6) / 0.4) ** 2); break; } } if (T >= HITS[3]) z = pops[3].z - 0.2 - (T - HITS[3]) * 20; return z; };
    function update(T) {
      const z = cubeZ(T);
      dense.g.position.set(Math.sin(T * 7) * 0.08, 3, z); dense.update(T);
      pops.forEach((q, i) => {
        const hit = HITS[i], show = i === 0 ? BR5.fence : HITS[i - 1] - 0.04;
        q.sh.group.visible = T >= show && T < hit + 0.12;
        const pop = eOut((T - show) / 0.12); q.sh.group.scale.setScalar(lerp(0.6, 1, pop));
        q.sh.update(T, { crack: smooth((T - (hit - 0.16)) / 0.14), shatter: Math.max(0, T - hit) * 0.6 });
      });
      // 火花：每次撞穿从撞击点喷一团
      let n = 0; for (let h = 0; h < 4; h++) { const age = T - HITS[h]; for (let i = h * 350; i < (h + 1) * 350; i++) { const [a, b, c, sp] = sparks.s[i];
        if (age <= 0 || age > 0.7) { sparks.p.set([0, -999, 0], i * 3); continue; } const d = age * sp * 14; sparks.p.set([a * d * 2, 3 + b * d * 1.6 - 6 * age * age, pops[h].z + 0.4 + c * d], i * 3); } }
      sparks.g.attributes.position.needsUpdate = true;
      // 小警报窗：亮度按拍闪（一排排往后传）
      const bp = beatPulse(T);
      minis.forEach((m, k) => m.material.color.setScalar(0.45 + 0.9 * (k === beatNo(T) % 4 ? bp : 0.15)));
      scene.background.set('#07040a').lerp(col('#3a0610'), 0.6 * bp); scene.fog.color.copy(scene.background);
      // 镜头：跟在方块后上方，撞的那一下抖
      const shake = HITS.reduce((a, h) => a + (T > h ? Math.exp(-(T - h) * 10) : 0), 0);
      look(cam, V3(1.4 + Math.sin(T * 1.3) * 0.4, 4.4 + 0.15 * shake * Math.sin(T * 90), z + 7.5), V3(0, 3.1, z - 6), 54);
      cam.rotateZ(Math.sin(beatNo(T) * 1.7) * 0.06); cam.updateMatrixWorld(true);
      const tt = fw.filter(w => w.start <= T + 1e-3).map(w => w.w.replace(/[^A-Za-z-]/g, '').toUpperCase()).join(' '); if (tt !== brkKey) { brkKey = tt; sBrk.draw(tt); }
      hud(sBrk, cam, -0.25, 0.7, 0.065, T);
    }
    shots.push({ id: 'br5-fence', t0: BR5.fence, t1: BR5.gpu, transitionIn: { kind: 'cut' }, build() { return {}; },
      update(_, T) { update(T); const hit = HITS.reduce((a, h) => a + (T > h ? Math.exp(-(T - h) / 0.06) : 0), 0);
        return { scene, camera: cam, post: { bloom: { strength: 0.9, threshold: 0.85 }, chroma: 0.15 + 0.5 * hit, grade: { vignette: 0.42 }, flash: { amount: 0.25 * hit, color: '#ffffff' } } }; } });
  }

  // ================================================================ E. Hundred thousand GPU（118.755–120.76）
  {
    const scene = new THREE.Scene(); scene.background = col('#05050a'); scene.fog = new THREE.Fog('#05050a', 60, 260);
    const cam = new THREE.PerspectiveCamera(48, W / Hh, 0.05, 3000); scene.add(cam);
    scene.add(new THREE.HemisphereLight('#9090ff', '#100810', 0.8));
    const NG = 16000, RAD = 52, gpuPos = phyllotaxisPoints(NG, { radius: RAD });
    const geo = new THREE.BoxGeometry(0.62, 0.2, 0.4).translate(0, 0.1, 0);
    const xz = new Float32Array(NG * 2); for (let i = 0; i < NG; i++) { xz[i * 2] = gpuPos[i * 3]; xz[i * 2 + 1] = gpuPos[i * 3 + 1]; } GPU_XZ = xz;
    geo.setAttribute('aXZ', new THREE.InstancedBufferAttribute(xz, 2));
    const aImg = new Float32Array(NG * 3); const PAPER = col('#2b2536');
    for (let i = 0; i < NG; i++) { const u = xz[i * 2] / LED.Rw + 0.5, v = xz[i * 2 + 1] / LED.Rh + 0.5, e = Math.min(u, 1 - u, (v) * LAND.h / LAND.w, (1 - v) * LAND.h / LAND.w);
      const c = e < 0 ? [PAPER.r, PAPER.g, PAPER.b] : e < 0.012 ? [0.02, 0.02, 0.03] : landAt(u, v).map(x => x ** 2.2); aImg.set(c, i * 3); }
    geo.setAttribute('aImg', new THREE.InstancedBufferAttribute(aImg, 3));
    const U = { uT: { value: 0 }, uK: { value: 0.22 }, uSrc: { value: Array.from({ length: 8 }, () => new THREE.Vector4()) }, uMint: { value: col(PAL.mint) }, uLemon: { value: col(PAL.lemon) }, uPink: { value: col(PAL.pink) }, uHue: { value: 0 }, uImg: { value: 0 } };
    const mat = new THREE.ShaderMaterial({ uniforms: U,
      vertexShader: /* glsl */`
        attribute vec2 aXZ; attribute vec3 aImg; uniform float uT, uK, uImg; uniform vec4 uSrc[8]; varying vec3 vN; varying vec2 vUv; varying float vH; varying float vD; varying float vR; varying vec3 vImg;
        ${WAVE_GLSL}
        void main(){
          float h = waveHeight(aXZ * uK, uT, uSrc) * (1.0 - uImg); vImg = aImg;
          float ang = atan(aXZ.y, aXZ.x); vec3 p = position; float ca = cos(ang), sa = sin(ang); p.xz = mat2(ca, -sa, sa, ca) * p.xz;
          vec3 wp = vec3(aXZ.x, max(h, 0.0) * 0.5, aXZ.y) + p;
          vN = normal; vUv = uv; vH = h; vR = length(aXZ);
          vec4 mv = modelViewMatrix * vec4(wp, 1.0); vD = -mv.z; gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */`
        uniform vec3 uMint, uLemon, uPink; uniform float uHue, uImg; varying vec3 vN; varying vec2 vUv; varying float vH; varying float vD; varying float vR; varying vec3 vImg;
        void main(){
          vec3 c = vec3(0.06, 0.06, 0.09) * (0.5 + 0.5 * max(vN.y, 0.0));
          float crest = smoothstep(0.1, 1.0, vH), trough = smoothstep(0.1, 0.8, -vH);
          vec3 led = mix(mix(uMint, uLemon, smoothstep(0.6, 1.2, vH)), uPink, uHue * smoothstep(0.3, 1.0, sin(vR * 0.15) * 0.5 + 0.5));
          if (vN.y > 0.5){ vec2 e = abs(vUv - 0.5); float panel = 1.0 - smoothstep(0.34, 0.42, max(e.x, e.y)); c += (led * (0.3 + 3.4 * crest) * (0.25 + 0.75 * crest) + uPink * trough * 1.2) * panel; c += vec3(0.02, 0.05, 0.05) * panel; }
          else { c += led * 0.15 * crest; }
          c *= exp(-vD * 0.008);
          c = mix(c, vImg * (vN.y > 0.5 ? 1.25 : 0.35), uImg);           // LED 拼出漫画第一格
          gl_FragColor = vec4(c, 1.0);
        }` });
    const cards = new THREE.InstancedMesh(geo, mat, NG); { const I = new THREE.Matrix4(); for (let i = 0; i < NG; i++) cards.setMatrixAt(i, I); } cards.frustumCulled = false; scene.add(cards);
    const city = makeCity(scene, { seed: 57, n: 500, rMin: RAD + 12, rMax: 280, y: 0, hMax: 60, tex: winTex });
    city.m.material.color.setScalar(0.35);
    const moon = new THREE.Mesh(new THREE.CircleGeometry(26, 64), new THREE.MeshBasicMaterial({ color: col(PAL.pink).multiplyScalar(1.2), fog: false })); moon.position.set(140, 120, -380); moon.lookAt(0, 0, 0); scene.add(moon);
    makeDust(scene, { seed: 13, n: 750, box: [140, 40, 140], center: [0, 14, 0], color: '#bff5ff', size: 2 });
    const dense = makeDenseCube(3); scene.add(dense.g);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 96), new THREE.MeshBasicMaterial({ color: hdr('#ffffff', 2.5), transparent: true, side: THREE.DoubleSide, depthWrite: false })); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.4; scene.add(ring);
    const srcs = T => music.beats.filter(b => b >= BR5.slam - 0.01 && b <= T + 1e-3).slice(0, 8).map((b, i) => [0, 0, b, i === 0 ? 2.2 : 1.4]);
    const sH = hudSign(scene, 'HUNDRED', PAL.mint, wt(L.hund, 0), 120.45), sT = hudSign(scene, 'THOUSAND', PAL.lemon, wt(L.hund, 1), 120.45), sG = hudSign(scene, 'GPU', PAL.pink, wt(L.hund, 2), 120.45);
    signsOf.push([sH, cam], [sT, cam], [sG, cam]);
    function update(T) {
      U.uT.value = T; const src = srcs(T); for (let i = 0; i < 8; i++) { const s = src[i]; if (s) U.uSrc.value[i].set(...s); else U.uSrc.value[i].set(0, 0, 0, 0); }
      U.uHue.value = smooth((T - 119.74) / 0.6);                         // 唱到 GPU，波峰带上粉色
      // 方块从天上砸下来
      const fall = clamp((T - BR5.gpu) / (BR5.slam - BR5.gpu)), y = T < BR5.slam ? lerp(40, 1.6, fall * fall) : 1.6 - 1.4 * eOut((T - BR5.slam) / 0.3);
      dense.g.position.set(0, y, 0); dense.update(T);
      const ra = T - BR5.slam; ring.visible = ra > 0 && ra < 1.2; ring.scale.setScalar(1 + ra * 60); ring.material.opacity = 1 - clamp(ra / 1.2);
      // 镜头：先在卡缝里低机位看它砸下来，撞击后一路升到高空斜俯拍，整片麦浪 + 远处城
      const u = smooth((T - BR5.slam - 0.15) / 1.5), a = 0.5 + (T - BR5.gpu) * 0.22;
      const R = lerp(9, 46, u), h = lerp(1.0, 46, u);
      look(cam, V3(Math.sin(a) * R, h, Math.cos(a) * R), V3(0, lerp(T < BR5.slam ? y * 0.6 : 1.2, 0, u), 0), lerp(58, 52, u));
      // 119.95 起升到正上方俯拍（画面上方 = −z），LED 光波慢慢拼出漫画第一格；最后往下推到这一格正好铺满（接 F 段第一帧）
      const w = smooth((T - 119.95) / 0.5), hc = pchip([[119.95, 46], [120.45, 44], [BR5.rlhf, LED.Hc]], T);
      if (w > 0) { cam.position.lerp(V3(0, hc, 0.001), w); cam.up.set(0, 1, 0).lerp(V3(0, 0, -1), w).normalize(); cam.lookAt(0, 0, 0); cam.fov = lerp(cam.fov, LED.fov, w); cam.updateProjectionMatrix(); cam.updateMatrixWorld(true); }
      U.uImg.value = smooth((T - 120.1) / 0.45); dense.g.visible = U.uImg.value < 0.5; ring.visible = ring.visible && U.uImg.value < 0.5;
      hud(sH, cam, -0.62, 0.66, 0.075, T); hud(sT, cam, -0.18, 0.66, 0.075, T); hud(sG, cam, 0.26, 0.66, 0.075, T);
    }
    shots.push({ id: 'br5-gpu', t0: BR5.gpu, t1: BR5.rlhf, transitionIn: { kind: 'cut' }, build() { return {}; },
      update(_, T) { update(T); const f = T >= BR5.slam ? 0.45 * Math.exp(-(T - BR5.slam) / 0.08) : 0;
        return { scene, camera: cam, post: { bloom: { strength: 1.0, threshold: 0.85 }, chroma: 0.1 + 0.3 * kick(T), grade: { vignette: 0.38 }, flash: { amount: f, color: '#ffffff' } } }; } });
  }

  // ================================================================ F. RLHF goes askew（120.76–123.87）：漫画页（桥段 v4 那页，她只在这里）→ 推进表盘 → 交副歌 4
  {
    const comic = await createComic(mv, { w: 20, h: 11.25, seed: 57, paper: '#2b2536' });
    const CS = new THREE.Scene(); CS.background = col('#0a0812'); CS.add(comic.group);
    const ccam = new THREE.PerspectiveCamera(36, W / Hh, 0.05, 800); CS.add(ccam);
    // 裂纹（和 doom-scale 同一个种子的走法：从 1.00 销子处往外爬）
    const cracks = (() => { const rnd = mulberry32(113); const pa = angleOf(1.0) + 0.035, o = [512 + Math.sin(pa) * 0.83 * 0.98 * 500, 512 - Math.cos(pa) * 0.83 * 0.98 * 500], out = [];
      for (let k = 0; k < 9; k++) { let a = rnd() * Math.PI * 2, x = o[0], y = o[1]; const pts = [[x, y]], len = 160 + rnd() * 520; for (let s = 0; s < len; s += 28) { a += (rnd() - 0.5) * 0.9; x += Math.cos(a) * 28; y += Math.sin(a) * 28; pts.push([x, y]); } out.push(pts); } return out; })();
    comic.panel({ id: 'land', rect: [0.02, 0.03, 0.3, 0.45], reveal: { at: BR5.rlhf - 1, kind: 'none' }, dim: { at: BR5.goes, amount: 0.3 }, border: 'ink', borderW: 12,
      layers: [
        { depth: 0.8, draw: (c, b) => { const g = c.createLinearGradient(0, 0, 0, b.h); g.addColorStop(0, '#120f22'); g.addColorStop(1, '#251838'); c.fillStyle = g; c.fillRect(-40, -40, b.w + 80, b.h + 80); CC.tone(c, b, { color: PAL.mint, step: 16, grad: [0.6, 0], alpha: 0.3 }); } },
        { depth: 0.3, draw: (c, b) => leds2d(c, b) },
        { depth: 0.1, draw: (c, b) => fitImg(c, img.stand, b, { x: 0.5, y: 0.98, h: 0.9 }) },
        { depth: 0, draw: (c, b, T) => {                                // 开场：先是 LED 阵列那张点阵图（同一批点、同一位置），0.35 s 淡回原画
          const a = 1 - smooth((T - BR5.rlhf) / 0.35); if (a <= 0) return; c.globalAlpha = a; c.fillStyle = '#2b2536'; c.fillRect(-40, -40, b.w + 80, b.h + 80);
          const kx = b.w / LED.Rw, ky = b.h / LED.Rh, d = 0.5 * kx;
          for (let i = 0; i < GPU_XZ.length; i += 2) { const u = GPU_XZ[i] / LED.Rw + 0.5, v = GPU_XZ[i + 1] / LED.Rh + 0.5; if (u < 0 || u > 1 || v < 0 || v > 1) continue;
            const [r, g, bl] = landAt(u, v); c.fillStyle = `rgb(${r * 255 | 0},${g * 255 | 0},${bl * 255 | 0})`; c.fillRect(u * b.w - d / 2, v * b.h - d * 0.32, d, d * 0.64); }
          c.globalAlpha = 1; void ky; } },
      ] });
    comic.panel({ id: 'slam', rect: [0.34, 0.03, 0.4, 0.45], reveal: { at: BR5.rlhf + 0.22, kind: 'wipe', dur: 0.2 }, dim: { at: BR5.askew, amount: 0.3 }, border: 'ink', borderW: 12,
      layers: [
        { depth: 0.8, draw: (c, b) => { c.fillStyle = '#1b1530'; c.fillRect(-40, -40, b.w + 80, b.h + 80); } },
        { depth: 0.1, draw: (c, b) => fitImg(c, img.slam, b, { x: 0.5, y: 1.0, h: 0.98 }) },
      ] });
    comic.panel({ id: 'eye', rect: [0.76, 0.03, 0.22, 0.45], reveal: { at: BR5.goes - 0.02, kind: 'pop', dur: 0.2 }, border: 'ink', borderW: 12,
      layers: [
        { depth: 0.6, draw: (c, b) => { c.fillStyle = '#0e0c08'; c.fillRect(-40, -40, b.w + 80, b.h + 80); } },
        { depth: 0.1, draw: (c, b, T) => {
          const cx = b.w * 0.5, cy = b.h * 0.36, R0 = b.w * 0.36;
          c.fillStyle = '#4a4a5a'; c.beginPath(); c.arc(cx, cy, R0 * 1.24, 0, 7); c.fill(); c.fillStyle = '#0b0a06'; c.beginPath(); c.arc(cx, cy, R0, 0, 7); c.fill();
          c.strokeStyle = c.fillStyle = PAL.lemon; c.lineWidth = R0 * 0.06; for (const k of [0.46, 0.66, 0.86]) { c.beginPath(); c.arc(cx, cy, R0 * k, 0, 7); c.stroke(); } c.beginPath(); c.arc(cx, cy, R0 * 0.26, 0, 7); c.fill();
          const tw = smooth((T - BR5.goes - 0.05) / 0.3) * 1.9;
          c.save(); c.translate(cx, b.h * 0.78); c.rotate(tw); c.fillStyle = PAL.mint; c.strokeStyle = PAL.ink; c.lineWidth = 8;
          c.beginPath(); c.roundRect(-70, -10, 140, 90, 18); c.fill(); c.stroke(); c.beginPath(); c.roundRect(-36, -95, 46, 100, 22); c.fill(); c.stroke(); c.restore();
        } },
      ] });
    // 末格：左边整块黑屏的 P(DOOM) 表（和副歌 4 的 3D 秤表盘同款、同状态），右边她惊恐地朝左上看着它
    const FP = { x: 0.02, y: 0.51, w: 0.96, h: 0.46 }, DIAL = { fx: 0.25, fy: 0.5, fr: 0.45 };     // 表盘圆心 / 半径（格子分数：x 按格宽、y 和 r 按格高）
    comic.panel({ id: 'face', rect: [FP.x, FP.y, FP.w, FP.h], reveal: { at: BR5.askew + 0.15, kind: 'slide', dir: 'u', dur: 0.25 }, border: 'ink', borderW: 14,
      layers: [
        { depth: 0, draw: (c, b) => {
          const g = c.createLinearGradient(0, 0, b.w, 0); g.addColorStop(0, '#0c0a16'); g.addColorStop(1, '#2a1838'); c.fillStyle = g; c.fillRect(-40, -40, b.w + 80, b.h + 80);
          // 表后面的夜城（和副歌 4 第一帧两侧露出的楼一致：深蓝楼 + 方窗）
          const rnd = mulberry32(21); for (let i = 0; i < 26; i++) { const w = b.w * (0.03 + rnd() * 0.04), h = b.h * (0.35 + rnd() * 0.6), x = rnd() * b.w * 0.62; c.fillStyle = '#1a1c3a'; c.fillRect(x, b.h - h, w, h);
            c.fillStyle = 'rgba(160,170,230,0.35)'; for (let yy = b.h - h + 10; yy < b.h - 8; yy += 22) for (let xx = x + 6; xx < x + w - 10; xx += 18) if (rnd() < 0.55) c.fillRect(xx, yy, 9, 9); }
          CC.tone(c, b, { color: PAL.pink, step: 18, grad: [0, 0.5], alpha: 0.2 });
          const cx = b.w * DIAL.fx, cy = b.h * DIAL.fy, R = b.h * DIAL.fr;
          c.lineWidth = R * 0.035; c.strokeStyle = 'rgba(255,46,136,0.55)'; c.beginPath(); c.arc(cx, cy, R * 1.15, 0, 7); c.stroke();      // 霓虹外圈（暗粉）
          c.fillStyle = '#16151d'; c.beginPath(); c.arc(cx, cy, R * 1.08, 0, 7); c.fill();
          c.lineWidth = R * 0.07; c.strokeStyle = '#8d8b98'; c.beginPath(); c.arc(cx, cy, R * 1.04, 0, 7); c.stroke();                      // 金属压圈
          drawDial(c, cx, cy, R, { lit: 0.15, value: 0, cracks, missing: true });
          c.lineWidth = 10; c.strokeStyle = PAL.ink; c.beginPath(); c.arc(cx, cy, R * 1.075, 0, 7); c.stroke();                           // 漫画墨线
        } },
        { depth: 0.1, draw: (c, b) => fitImg(c, img.face, b, { x: 0.74, y: 1.02, h: 1.15 }) },
      ] });
    comic.bubble({ panel: 'slam', x: 0.36, y: 0.07, w: 0.12, text: 'RLHF', kind: 'box', size: 92, at: BR5.rlhf, until: BR5.askew + 1.2 });
    comic.bubble({ panel: 'eye', x: 0.78, y: 0.07, w: 0.12, text: 'GOES', kind: 'box', size: 80, at: BR5.goes, until: BR5.askew + 1.2 });
    comic.sfx({ text: 'ASKEW', x: 0.5, y: 0.3, size: 0.15, at: BR5.askew, until: 123.55, color: '#ff2e4a', stroke: PAL.ink, angle: -14, shake: 1, font: CF.anton });
    // 123.87 那一帧：表盘圆心在画面正中、半径 = 画高 × 0.62（副歌 4 C4_ENTRY）。画面高 = 2R / 1.24
    const pw = 20, ph = 11.25, Rw = DIAL.fr * FP.h * ph, cxw = (FP.x + DIAL.fx * FP.w) * pw, cyw = (FP.y + DIAL.fy * FP.h) * ph;
    const vh = 2 * Rw / (2 * 0.62), vw = vh * W / Hh, endRect = [(cxw - vw / 2) / pw, (cyw - vh / 2) / ph, vw / pw, vh / ph];
    const ckeys = [
      { t: BR5.rlhf, target: 'land', yaw: 0, pitch: 0, margin: 0.92 },
      { t: BR5.rlhf + 0.42, target: 'slam', yaw: 3, pitch: -1, margin: 0.98 },
      { t: BR5.goes, target: [0.34, 0.03, 0.64, 0.45], yaw: 4, pitch: -2, margin: 1.02 },
      { t: BR5.askew + 0.05, target: 'page', yaw: -3, pitch: -4, roll: 0, margin: 1.03 },
      { t: BR5.face, target: [0.02, 0.51, 0.96, 0.46], yaw: -1, pitch: -1, margin: 1.03 },
      { t: 123.62, target: endRect, yaw: 0, pitch: 0, margin: 1 },
      { t: BR5.end, target: endRect, yaw: 0, pitch: 0, margin: 1 },
    ];
    // 交接：123.70–123.87 淡到副歌 4 第一帧（真渲染的 3D 表盘），墨线和网点淡出、3D 材质淡入
    const entryTex = new THREE.TextureLoader().load(new URL('../fresh/v4-rest/c4/entry-123.87.png', import.meta.url).href); entryTex.colorSpace = THREE.SRGBColorSpace;
    const entry = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: entryTex, transparent: true, depthTest: false, depthWrite: false, toneMapped: false }));
    entry.renderOrder = 20; entry.position.z = -1; ccam.add(entry);
    const XF = [123.70, BR5.end - 1 / 30];
    shots.push({ id: 'br5-comic', t0: BR5.rlhf, t1: BR5.end, transitionIn: { kind: 'cut' }, build() { return {}; },
      update(_, T) {
        const unTilt = smooth((T - BR5.face) / 0.5);                     // 推进表盘时把歪掉的页摆正（表盘要正对镜头）
        const tin = smooth((T - BR5.rlhf) / 0.5); comic.group.rotation.set(-0.04 * (1 - unTilt) * tin, 0.03 * (1 - unTilt) * tin, -14 * D2R * eOut((T - BR5.askew) / 0.18) * (1 - unTilt));
        comic.camPath(ccam, T, ckeys);
        ccam.updateMatrixWorld(); comic.update(T, { camera: ccam }); comic.group.updateMatrixWorld(true); comic.update(T, { camera: ccam });
        const x = smooth((T - XF[0]) / (XF[1] - XF[0])), hh = 2 * Math.tan(ccam.fov * Math.PI / 360);
        entry.visible = x > 0; entry.material.opacity = x; entry.scale.set(hh * ccam.aspect, hh, 1);
        const st = T >= BR5.askew ? Math.exp(-(T - BR5.askew) / 0.1) : 0;
        return { scene: CS, camera: ccam, post: { bloom: { strength: 0.2, threshold: 1.1 }, chroma: 0.08 + 0.4 * st, grade: { vignette: 0.28 * (1 - x) }, flash: st > 0.01 ? { amount: 0.25 * st, color: '#ff4060' } : 0 } };
      } });
  }

  window.__br5RestCheck = ({ fps = 30 } = {}) => {
    const out = [];
    for (const [s, cam] of signsOf) { const T = s.at + 0.1, sh = shots.find(x => T >= x.t0 && T < x.t1); if (!sh) continue; sh.update(null, T); s.g.updateMatrixWorld(true);
      const cs = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => s.m.localToWorld(V3(a * s.bw / 2, b * s.bh / 2, 0)).project(cam));
      const r = { x0: Math.min(...cs.map(p => p.x)), x1: Math.max(...cs.map(p => p.x)), y0: Math.min(...cs.map(p => p.y)), y1: Math.max(...cs.map(p => p.y)) };
      out.push({ word: s.text, T: +T.toFixed(2), textPct: +((r.y1 - r.y0) / 2 * s.th / s.bh * 100).toFixed(1), inFrame: r.x0 > -1 && r.x1 < 1 && r.y0 > -1 && r.y1 < 1 }); }
    return out;
  };
  return shots;
}

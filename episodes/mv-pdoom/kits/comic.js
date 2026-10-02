// kits/comic.js — 动态漫画（motion comic）kit：3D 空间里的一张纸 + 分格 + 纸片视差 + 气泡 / 拟声字 + 和 3D 混用（W3 #943）
//
//   const comic = await createComic(mv, { w: 12, h: 17 });          // 一页纸（页面单位；人看着「纸」）
//   scene.add(comic.group);
//   comic.panel({ id: 'a', rect: [0.04, 0.03, 0.92, 0.3], reveal: { at: 10, kind: 'wipe' }, layers: [...] });
//   comic.bubble({ panel: 'a', x: 0.7, y: 0.1, words: line.words, kind: 'speech', tail: [0.6, 0.25] });
//   comic.word3d({ text: 'BOSS', x: 0.5, y: 0.8, size: 2.2, at: 14, lift: 1.2, glow: 1.6, light: PAL.lemon });
//   每帧：comic.camPath(camera, T, keys)（或 comic.fit(camera, target, opts)）→ comic.update(T, { camera }) → 渲染
//
// 全部是 T 的纯函数（画布每帧从干净状态重画；随机都用种子）。坐标约定：
//   页面分数坐标 (fx, fy)：0..1，左上角为原点、y 向下（和画漫画一样）。页面单位：页宽 w、页高 h，纸面在 z = 0，+z 朝读者。
//
// ─ 页面：comic.group（你自由摆放 / 倾斜 / 旋转）→ pivot（左边缘，翻页轴）→ body（纸在这里）。
//     comic.turn(p)：0..1 翻页（绕左边缘翻起，带一点抬起）；comic.page 纸（带厚度）；comic.over：纸面之上的 3D 层（页面单位）。
// ─ 分格 panel(opts) → P
//     rect [x,y,w,h] | poly [[fx,fy],…] | slant：{ rect, slant:[上边偏移, 下边偏移]（页宽分数，斜切）}
//     border：'ink'（默认，手绘感黑边）| 'white'（白边 + 细黑线）| 'none'；borderW（px）；rough（0..1 手抖）
//     depth：格子离纸面的高度（纸片分层，带投影）；tilt：[rx, ry]（度）
//     reveal：{ at, kind, dur }，kind = 'wipe'（斜向擦入）| 'pop'（弹出）| 'slide'（dir 'l'|'r'|'u'|'d'）| 'drop'（从上方落下拍在纸上）
//             | 'ink'（先描边、再从线稿上色）| 'tone'（网点铺开）| 'flip'（纸片翻面）| 'none'
//     dim：{ at, amount }（读过的格变暗）
//     layers：[{ depth, draw(ctx, box, T, P) }]：depth = 这层在格子后面多深（页面单位），镜头一动就有视差；0 = 贴在格面
//     push：{ t0, t1, from, to }（格内慢推：内容缩放）；pan：{ t0, t1, from:[dx,dy], to }（页宽分数）；breathe：幅度（呼吸）
//     window：{ scene, update(T), scale=1, center=[0,0,0], background }：格子是一扇「窗户」，里面是真 3D（离轴相机渲 RT，镜头移动有真视差）
//             有 window 时 layers 画在窗户之上（透明底），可以放对话框、网点、描边
//     crack：{ at, x, y }（格框碎裂，配合破格）
// ─ 漫画元素（都挂在纸面之上，可以跨格）
//     bubble({ x, y, w, words|text, at, until, kind:'speech'|'shout'|'thought'|'box'|'whisper', tail:[fx,fy], size, font, color, bg, panel })
//         words = 歌词词表（lyrics.lines[i].words）：逐词写出；kind 'box' = 旁白框
//     sfx({ text, x, y, size, at, until, color, stroke, angle, skew, shake, font })  手绘感拟声大字（2D，纸面上，带抖动 / 描边 / 投影）
//     note({ text, x, y, size, at, angle, color })  格外手写注释（Caveat / Kalam，逐字写出 + 箭头 arrow:[fx,fy]）
// ─ 3D 混合
//     word3d({ text, x, y, size, at, until, lift, depth, font, color, glow, light, from:[fx,fy], rot })
//         type3d 挤出字从纸面（或 from 处的气泡）里「弹出」到页面之上，投影落在纸面上；glow>1 发光并照亮纸面（light = 光色）
//     sparks({ from, to, at, dur, n, color, arc, burst, out })  粒子 / 火花从一格飞到另一格（out:true 飞出页面冲向镜头），落点炸开
//     shock({ x, y, at, dur, radius, color })   纸面上的冲击波环 + 闪光
//     beam({ from, to, at, dur, color, width })  光束 / 激光从一处射到另一处
//     light({ x, y, z, color, intensity, radius, at, until })  任意点光（纸面、格子都吃）
//     castShadow(obj3d, { z })   把 comic.over 里任意 3D 物体的平面投影投到纸面上（绕 shadowDir 投射）
//     breakout(obj3d, { panel, at, dur, from:[fx,fy,z], to:[fx,fy,z], scale:[a,b], spin })  物体从格子里冲出来（格框同时碎裂）
//     enter(panelId, camera) → { scene, camera }：「镜头穿过格子进入 3D」的钩子：返回与当前镜头同姿态的窗户内相机，
//         镜头推过格面后，镜头直接改渲这个 scene / camera 就是无缝的
// ─ 镜头
//     fit(camera, target, { yaw, pitch, roll, margin, fov })：target = 'page' | 格 id | [fx,fy,fw,fh]
//     camPath(camera, T, keys)：keys = [{ t, target, yaw, pitch, roll, margin }]，按阅读顺序在页面上移动，推进到某格铺满再退回整页
// ─ 画布小工具 C（给 layer.draw 用）：C.tone 网点 · C.speedLines 速度线 · C.focusLines 集中线 · C.sky 渐变 · C.city 剪影
//     · C.hatch 排线 · C.rough 手绘描边 · C.text 描边字 · C.cracks 裂纹
//     人物层直接用 W2 ui2d 的 ui.draw.girl(ctx, box, T, { line, expression, slap })（layer-rig：口型对词、眨眼、摆头）
//
// 灯光：纸和格子用自己的着色器（不吃 three 的灯），只吃 comic 的灯（word3d / sparks / shock / beam / light 自动加），
//   所以纸白在没有特效时是准的，特效发光时纸面被照亮、带颜色。最多 8 盏同时亮。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { textGeo, mats, initType3D } from './type3d.js';
import { resetCtx } from './ui2d.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIO = p => { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2; };
const eBack = (p, s = 1.8) => { p = clamp(p); return 1 + (s + 1) * (p - 1) ** 3 + s * (p - 1) ** 2; };
const col = c => new THREE.Color(c);
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
export function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const hash = (a, b = 0) => { let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

// ---------------------------------------------------------------- 字体（画布用，自己注册一套名字，不依赖别的 kit 的载入顺序）
const FONT_DIR = new URL('../../../assets/fonts/', import.meta.url);
export const CF = { hand: '"CMKalam", cursive', note: '"CMCaveat", cursive', bang: '"CMBungee", sans-serif', anton: '"CMAnton", sans-serif', bebas: '"CMBebas", sans-serif', mono: '"CMMono", monospace' };
let fontsP = null;
function loadFonts() {
  fontsP ??= Promise.all([['CMKalam', 'kalam/Kalam-Bold.ttf'], ['CMCaveat', 'caveat/Caveat-Variable.ttf'], ['CMBungee', 'bungee/Bungee-Regular.ttf'],
    ['CMAnton', 'anton/Anton-Regular.ttf'], ['CMBebas', 'bebasneue/BebasNeue-Regular.ttf'], ['CMMono', 'sharetechmono/ShareTechMono-Regular.ttf']]
    .map(async ([name, file]) => { const f = new FontFace(name, `url(${new URL(file, FONT_DIR).href})`); await f.load(); document.fonts.add(f); }));
  return fontsP;
}

// ================================================================ 画布小工具
export const C = {
  /** 网点（半调）：box 内铺圆点，density 0..1 控制点大小；angle 度；可做渐变（grad:[a,b] 从上到下的点大小） */
  tone(ctx, b, { color = PAL.ink, step = 14, density = 0.35, angle = 45, grad = null, alpha = 1 } = {}) {
    ctx.save(); ctx.beginPath(); ctx.rect(b.x, b.y, b.w, b.h); ctx.clip();
    ctx.globalAlpha = alpha; ctx.fillStyle = color;
    const a = angle * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), cx = b.x + b.w / 2, cy = b.y + b.h / 2, R = Math.hypot(b.w, b.h) / 2 + step;
    ctx.beginPath();
    for (let u = -R; u <= R; u += step) for (let v = -R; v <= R; v += step) {
      const x = cx + u * ca - v * sa, y = cy + u * sa + v * ca;
      if (x < b.x - step || x > b.x + b.w + step || y < b.y - step || y > b.y + b.h + step) continue;
      const d = grad ? lerp(grad[0], grad[1], clamp((y - b.y) / b.h)) : density;
      const r = step * 0.5 * Math.sqrt(clamp(d)) * 1.2;
      if (r < 0.4) continue;
      ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2);
    }
    ctx.fill(); ctx.restore();
  },
  /** 速度线：沿 angle 方向的平行细线，按 T 流动（seed 固定） */
  speedLines(ctx, b, T, { angle = 0, n = 60, color = PAL.ink, width = 3, speed = 3, seed = 1, alpha = 0.9, gap = 0.25 } = {}) {
    ctx.save(); ctx.beginPath(); ctx.rect(b.x, b.y, b.w, b.h); ctx.clip();
    const a = angle * Math.PI / 180, dx = Math.cos(a), dy = Math.sin(a), L = Math.hypot(b.w, b.h);
    ctx.strokeStyle = color; ctx.globalAlpha = alpha; ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const off = (hash(i, seed) - 0.5) * L, len = L * lerp(0.15, 0.5, hash(i, seed + 7)), ph = ((hash(i, seed + 3) + T * speed * lerp(0.6, 1.4, hash(i, seed + 5))) % 1) * (L + len) - L / 2 - len;
      if (hash(i, seed + 11) < gap) continue;
      const cx = b.x + b.w / 2 - dy * off, cy = b.y + b.h / 2 + dx * off;
      ctx.lineWidth = width * lerp(0.4, 1.4, hash(i, seed + 13));
      ctx.beginPath(); ctx.moveTo(cx + dx * ph, cy + dy * ph); ctx.lineTo(cx + dx * (ph + len), cy + dy * (ph + len)); ctx.stroke();
    }
    ctx.restore();
  },
  /** 集中线：从画框边缘指向 (fx, fy) 的楔形线，inner = 中心留白半径（相对短边） */
  focusLines(ctx, b, T, { fx = 0.5, fy = 0.5, n = 90, inner = 0.3, color = PAL.ink, seed = 2, jitter = 1, alpha = 1 } = {}) {
    ctx.save(); ctx.beginPath(); ctx.rect(b.x, b.y, b.w, b.h); ctx.clip();
    const cx = b.x + b.w * fx, cy = b.y + b.h * fy, R = Math.hypot(b.w, b.h), r0 = Math.min(b.w, b.h) * inner, f = Math.floor(T * 12);
    ctx.fillStyle = color; ctx.globalAlpha = alpha;
    for (let i = 0; i < n; i++) {
      const a = (i + hash(i, seed) * 0.8) / n * Math.PI * 2, w = lerp(0.004, 0.022, hash(i, seed + 1)), r = r0 * lerp(1, 1.9, hash(i, seed + 2 + f * jitter));
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(a - w) * R, cy + Math.sin(a - w) * R); ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); ctx.lineTo(cx + Math.cos(a + w) * R, cy + Math.sin(a + w) * R); ctx.fill();
    }
    ctx.restore();
  },
  /** 竖直渐变底 */
  sky(ctx, b, stops = [[0, PAL.ink], [1, '#2a2350']]) {
    const g = ctx.createLinearGradient(0, b.y, 0, b.y + b.h); for (const [k, c] of stops) g.addColorStop(k, c);
    ctx.fillStyle = g; ctx.fillRect(b.x, b.y, b.w, b.h);
  },
  /** 城市剪影（一排楼 + 窗户点），base = 地平线 y（px），seed 决定楼形 */
  city(ctx, b, { base = null, color = PAL.ink, win = PAL.lemon, seed = 3, hMax = 0.45, n = 18, winAlpha = 0.9 } = {}) {
    const y0 = base ?? b.y + b.h, rnd = mulberry32(seed);
    let x = b.x - 10;
    while (x < b.x + b.w) {
      const w = b.w / n * lerp(0.6, 1.5, rnd()), h = b.h * hMax * lerp(0.3, 1, rnd() ** 0.7);
      ctx.fillStyle = color; ctx.fillRect(x, y0 - h, w - 2, h + 2);
      ctx.fillStyle = win; ctx.globalAlpha = winAlpha;
      const cw = Math.max(5, w / 6), ch = cw * 1.3;
      for (let yy = y0 - h + ch; yy < y0 - ch; yy += ch * 1.8) for (let xx = x + cw * 0.6; xx < x + w - cw * 1.2; xx += cw * 1.8) if (rnd() < 0.45) ctx.fillRect(xx, yy, cw * 0.8, ch * 0.7);
      ctx.globalAlpha = 1; x += w;
    }
  },
  /** 排线阴影（一组斜平行线） */
  hatch(ctx, b, { angle = -35, step = 9, width = 2, color = PAL.ink, alpha = 0.6 } = {}) {
    ctx.save(); ctx.beginPath(); ctx.rect(b.x, b.y, b.w, b.h); ctx.clip();
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.globalAlpha = alpha;
    const a = angle * Math.PI / 180, dx = Math.cos(a), dy = Math.sin(a), L = Math.hypot(b.w, b.h), cx = b.x + b.w / 2, cy = b.y + b.h / 2;
    ctx.beginPath(); for (let o = -L; o <= L; o += step) { ctx.moveTo(cx - dy * o - dx * L, cy + dx * o - dy * L); ctx.lineTo(cx - dy * o + dx * L, cy + dx * o + dy * L); } ctx.stroke();
    ctx.restore();
  },
  /** 手绘感多边形描边：pts = [[x,y],…]（px），rough 0..1，seed；progress 0..1 画到哪（描边动画） */
  rough(ctx, pts, { width = 6, color = PAL.ink, rough = 0.5, seed = 1, progress = 1, close = true, fill = null } = {}) {
    const rnd = mulberry32(seed), path = [];
    const P = close ? [...pts, pts[0]] : pts;
    for (let i = 0; i < P.length - 1; i++) {
      const [x0, y0] = P[i], [x1, y1] = P[i + 1], L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.ceil(L / 40));
      for (let k = 0; k < n; k++) { const u = k / n, j = rough * 2.2; path.push([lerp(x0, x1, u) + (rnd() - 0.5) * j, lerp(y0, y1, u) + (rnd() - 0.5) * j]); }
    }
    path.push(close ? path[0] : P[P.length - 1]);
    if (fill) { ctx.fillStyle = fill; ctx.beginPath(); path.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.fill(); }
    let total = 0; for (let i = 1; i < path.length; i++) total += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
    const upto = total * clamp(progress);
    ctx.strokeStyle = color; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    // 笔触粗细有变化：分段画，宽度随噪声起伏
    let acc = 0;
    for (let i = 1; i < path.length && acc < upto; i++) {
      const [x0, y0] = path[i - 1], [x1, y1] = path[i], L = Math.hypot(x1 - x0, y1 - y0), u = Math.min(1, (upto - acc) / L);
      ctx.lineWidth = width * lerp(0.75, 1.2, hash(i, seed));
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, x1, u), lerp(y0, y1, u)); ctx.stroke();
      acc += L;
    }
  },
  /** 描边字（漫画字效）：粗墨边 + 可选偏移投影 */
  text(ctx, text, x, y, { size = 80, font = CF.bang, fill = PAL.lemon, stroke = PAL.ink, strokeW = 0.16, shadow = PAL.ink, shadowOff = 0.08, align = 'center', angle = 0, skew = 0, alpha = 1 } = {}) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle * Math.PI / 180); ctx.transform(1, 0, Math.tan(skew * Math.PI / 180), 1, 0, 0);
    ctx.globalAlpha = alpha; ctx.font = `${size}px ${font}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    if (shadow) { ctx.fillStyle = shadow; ctx.strokeStyle = shadow; ctx.lineWidth = size * strokeW * 2; ctx.strokeText(text, size * shadowOff, size * shadowOff); ctx.fillText(text, size * shadowOff, size * shadowOff); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = size * strokeW * 2; ctx.strokeText(text, 0, 0); }
    ctx.fillStyle = fill; ctx.fillText(text, 0, 0);
    ctx.restore();
  },
  /** 裂纹（从 (x,y) 放射），progress 0..1 */
  cracks(ctx, x, y, { n = 7, len = 300, seed = 5, progress = 1, width = 4, color = PAL.ink } = {}) {
    const rnd = mulberry32(seed); ctx.save(); ctx.strokeStyle = color; ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      let a = (i / n) * Math.PI * 2 + rnd() * 0.6, px = x, py = y; const L = len * lerp(0.5, 1.2, rnd()) * clamp(progress), segs = 6;
      ctx.lineWidth = width * lerp(0.6, 1.3, rnd()); ctx.beginPath(); ctx.moveTo(px, py);
      for (let k = 0; k < segs; k++) { a += (rnd() - 0.5) * 0.7; px += Math.cos(a) * L / segs; py += Math.sin(a) * L / segs; ctx.lineTo(px, py); }
      ctx.stroke();
    }
    ctx.restore();
  },
};

// ================================================================ 纸 / 格子的着色器：贴图 × 环境 + comic 灯（点光，带颜色溢出）
const MAXL = 8;
const PAPER_VS = /* glsl */`
  varying vec2 vUv; varying vec3 vW; varying vec3 vN;
  void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }`;
const PAPER_FS = /* glsl */`
  uniform sampler2D map; uniform float uAmb, uOpacity, uDim; uniform vec4 uL[${MAXL}]; uniform vec3 uLC[${MAXL}]; uniform vec3 uTint;
  varying vec2 vUv; varying vec3 vW; varying vec3 vN;
  void main(){
    vec4 t = texture2D(map, vUv);
    vec3 base = t.rgb * uTint;
    vec3 c = base * uAmb * (1.0 - uDim);
    vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
    for (int i = 0; i < ${MAXL}; i++) {
      vec3 d = uL[i].xyz - vW; float r = length(d);
      float f = pow(max(0.0, 1.0 - r / max(uL[i].w, 1e-3)), 2.0) * (0.35 + 0.65 * max(0.0, dot(n, d / max(r, 1e-3))));
      c += (base * 0.85 + 0.18) * uLC[i] * f;
    }
    gl_FragColor = vec4(c, t.a * uOpacity);
  }`;

export async function createComic(mv, { w = 12, h = 17, paper = PAL.paper, ink = PAL.ink, px = 100, thickness = 0.06, seed = 7, shadowDir = [0.28, -0.42, -1], ambient = 1 } = {}) {
  await Promise.all([loadFonts(), initType3D()]);
  const renderer = mv.stage.renderer;
  const W = w, H = h;
  const group = new THREE.Group(), pivot = new THREE.Group(), body = new THREE.Group(), over = new THREE.Group();
  group.add(pivot); pivot.position.x = -W / 2; pivot.add(body); body.position.x = W / 2; body.add(over);
  const pagePt = (fx, fy, z = 0) => V((fx - 0.5) * W, (0.5 - fy) * H, z);
  const LS = new THREE.Vector3(...shadowDir).normalize();

  // ---- 灯（comic 自己的点光）：每帧收集
  const LU = { pos: Array.from({ length: MAXL }, () => new THREE.Vector4()), col: Array.from({ length: MAXL }, () => new THREE.Vector3()) };
  const lightsNow = [];
  const addLight = (posPage, color, intensity, radius) => { if (intensity > 0.002) lightsNow.push({ p: posPage.clone(), c: col(color).multiplyScalar(intensity), r: radius }); };
  const paperMat = (map, { transparent = false, tint = '#ffffff' } = {}) => new THREE.ShaderMaterial({
    uniforms: { map: { value: map }, uAmb: { value: ambient }, uOpacity: { value: 1 }, uDim: { value: 0 }, uL: { value: LU.pos }, uLC: { value: LU.col }, uTint: { value: col(tint) } },
    vertexShader: PAPER_VS, fragmentShader: PAPER_FS, transparent, side: THREE.DoubleSide, depthWrite: !transparent,
  });

  // ---- 纸：纸纹画布（纸色 + 纤维 + 极淡的格线网点），带厚度的盒子
  const pcv = document.createElement('canvas'); pcv.width = Math.round(W * 60); pcv.height = Math.round(H * 60);
  { const g = pcv.getContext('2d'), rnd = mulberry32(seed);
    g.fillStyle = paper; g.fillRect(0, 0, pcv.width, pcv.height);
    for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${rnd() < 0.5 ? '80,60,40' : '255,255,255'},${0.025 + rnd() * 0.04})`; const x = rnd() * pcv.width, y = rnd() * pcv.height, l = 4 + rnd() * 14, a = rnd() * Math.PI; g.save(); g.translate(x, y); g.rotate(a); g.fillRect(-l / 2, -0.6, l, 1.2); g.restore(); }
    const vg = g.createRadialGradient(pcv.width / 2, pcv.height / 2, Math.min(pcv.width, pcv.height) * 0.3, pcv.width / 2, pcv.height / 2, Math.hypot(pcv.width, pcv.height) * 0.6);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(90,70,40,0.10)'); g.fillStyle = vg; g.fillRect(0, 0, pcv.width, pcv.height); }
  const paperTex = new THREE.CanvasTexture(pcv); paperTex.colorSpace = THREE.SRGBColorSpace; paperTex.anisotropy = 8;
  const plainTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 4; const g = c.getContext('2d'); g.fillStyle = paper; g.fillRect(0, 0, 4, 4); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const pageMats = [paperMat(plainTex, { tint: '#d8d2c6' }), paperMat(plainTex, { tint: '#d8d2c6' }), paperMat(plainTex, { tint: '#d8d2c6' }), paperMat(plainTex, { tint: '#d8d2c6' }), paperMat(paperTex), paperMat(plainTex, { tint: '#cfc9bd' })];
  const page = new THREE.Mesh(new THREE.BoxGeometry(W, H, thickness), pageMats); page.position.z = -thickness / 2; body.add(page);
  // 纸下的软阴影（纸浮在桌面 / 背景上时用；group 在背景前时自然出现）
  const blobTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 10, 64, 64, 64); gr.addColorStop(0, 'rgba(0,0,0,0.9)'); gr.addColorStop(0.6, 'rgba(0,0,0,0.5)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
  const rectShadowTex = (() => { const c = document.createElement('canvas'); c.width = 256; c.height = 256; const g = c.getContext('2d'); g.filter = 'blur(14px)'; g.fillStyle = 'rgba(0,0,0,1)'; g.fillRect(40, 40, 176, 176); return new THREE.CanvasTexture(c); })();

  const panels = [], items = [], shadowsOf = [];
  let order = 0;

  // ================================================================ 分格
  function polyOf(o) {
    if (o.poly) return o.poly.map(p => [...p]);
    const [x, y, w2, h2] = o.rect ?? o.slant?.rect;
    if (o.slant) { const [a, b] = o.slant.slant ?? [0.03, -0.03]; return [[x + Math.max(0, a), y], [x + w2 + Math.min(0, a), y], [x + w2 + Math.min(0, b), y + h2], [x + Math.max(0, b), y + h2]]; }
    return [[x, y], [x + w2, y], [x + w2, y + h2], [x, y + h2]];
  }
  function panel(o) {
    const poly = polyOf(o);
    const fx0 = Math.min(...poly.map(p => p[0])), fx1 = Math.max(...poly.map(p => p[0])), fy0 = Math.min(...poly.map(p => p[1])), fy1 = Math.max(...poly.map(p => p[1]));
    const bw = (fx1 - fx0) * W, bh = (fy1 - fy0) * H, cw = Math.round(bw * px), ch = Math.round(bh * px);
    const center = pagePt((fx0 + fx1) / 2, (fy0 + fy1) / 2);
    const ppx = poly.map(([fx, fy]) => [(fx - fx0) * W * px, (fy - fy0) * H * px]);           // 画布像素坐标
    const shape = new THREE.Shape(poly.map(([fx, fy]) => new THREE.Vector2((fx - (fx0 + fx1) / 2) * W, ((fy0 + fy1) / 2 - fy) * H)));
    const geo = new THREE.ShapeGeometry(shape);
    { const p = geo.attributes.position, uv = geo.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + bw / 2) / bw, (p.getY(i) + bh / 2) / bh); }
    const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
    const ctx = cv.getContext('2d');
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const holder = new THREE.Group(); holder.position.copy(center); body.add(holder);
    const flipper = new THREE.Group(); holder.add(flipper);
    let rt = null, win = null, winCam = null, overMesh = null;
    const mesh = new THREE.Mesh(geo, paperMat(tex)); flipper.add(mesh);
    if (o.window) {
      win = o.window;
      rt = new THREE.WebGLRenderTarget(cw, ch, { samples: 4, type: THREE.HalfFloatType });
      mesh.material.uniforms.map.value = rt.texture;
      winCam = new THREE.PerspectiveCamera(40, bw / bh, 0.05, 2000); winCam.matrixAutoUpdate = true;
      overMesh = new THREE.Mesh(geo, paperMat(tex, { transparent: true })); overMesh.position.z = 0.004; overMesh.renderOrder = 2; flipper.add(overMesh);
    }
    // 格子背面（翻面 reveal 时看得到）
    const back = new THREE.Mesh(geo, paperMat(plainTex, { tint: '#e6e0d4' })); back.rotation.y = Math.PI; back.position.z = -0.003; flipper.add(back);
    // 离纸的投影（格子有 depth 时）
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(bw * 1.08, bh * 1.08), new THREE.MeshBasicMaterial({ map: rectShadowTex, color: '#000', transparent: true, opacity: 0, depthWrite: false }));
    sh.position.set(center.x, center.y, 0.002); body.add(sh);
    const P = { ...o, id: o.id ?? `p${panels.length}`, poly, ppx, fx0, fx1, fy0, fy1, bw, bh, cw, ch, center, cv, ctx, tex, mesh, overMesh, holder, flipper, back, sh, rt, win, winCam, order: order++, layers: o.layers ?? [], seed: seed * 31 + panels.length };
    panels.push(P);
    return P;
  }
  const byId = id => typeof id === 'string' ? panels.find(p => p.id === id) : id;

  // 镜头在格子局部坐标（页面单位）里的位置
  const _m = new THREE.Matrix4();
  function camLocal(P, camera) {
    if (!camera) return V(0, 0, 30);
    P.flipper.updateWorldMatrix(true, false);
    return camera.getWorldPosition(V()).applyMatrix4(_m.copy(P.flipper.matrixWorld).invert());
  }
  function revealP(P, T) { const r = P.reveal; if (!r || r.kind === 'none') return 1; return clamp((T - r.at) / (r.dur ?? 0.45)); }
  function drawPanel(P, T, camera) {
    const { ctx, cw, ch } = P, r = P.reveal, kind = r?.kind ?? 'none', p = revealP(P, T);
    resetCtx(ctx); ctx.clearRect(0, 0, cw, ch);
    const clipPoly = () => { ctx.beginPath(); P.ppx.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); };
    const cl = camLocal(P, camera), cz = Math.max(0.5, cl.z);
    // 内容：背景纸色（窗户格透明）→ 各层（视差 + 慢推 + 平移 + 呼吸）
    const drawContent = () => {
      ctx.save(); clipPoly(); ctx.clip();
      if (!P.win) { ctx.fillStyle = P.bg ?? paper; ctx.fillRect(0, 0, cw, ch); }
      let s = 1, dx = 0, dy = 0;
      if (P.push) s = lerp(P.push.from ?? 1, P.push.to ?? 1.12, eIO((T - P.push.t0) / (P.push.t1 - P.push.t0)));
      if (P.pan) { const u = eIO((T - P.pan.t0) / (P.pan.t1 - P.pan.t0)); dx = lerp(P.pan.from?.[0] ?? 0, P.pan.to?.[0] ?? 0, u) * W * px; dy = lerp(P.pan.from?.[1] ?? 0, P.pan.to?.[1] ?? 0, u) * H * px; }
      const br = (P.breathe ?? 0.006) * Math.sin(T * 2 * Math.PI / 4.2 + P.seed);
      for (const L of P.layers) {
        const D = L.depth ?? 0, k = D / (cz + D);
        const ox = cl.x * k * px, oy = -cl.y * k * px;              // 视差：越深的层越跟着镜头走
        const ls = s * (1 + br * (1 + D)) * (L.scale ?? 1);
        ctx.save();
        ctx.translate(cw / 2 + ox + dx * (1 + D * 0.3), ch / 2 + oy + dy * (1 + D * 0.3)); ctx.scale(ls, ls); ctx.translate(-cw / 2, -ch / 2);
        L.draw(ctx, { x: 0, y: 0, w: cw, h: ch }, T, P);
        ctx.restore();                                              // 层内状态（变换 / 透明度 / 滤镜）都被 restore 带走，不漏到下一层
      }
      ctx.restore();
    };
    // 窗户格：RT 在下面，遮不住 → 在覆盖层上盖一张「带洞的纸」（holes 画出已露出的区域）
    const paperOver = holes => {
      const m = P._mask ??= document.createElement('canvas'); m.width = cw; m.height = ch; const g = m.getContext('2d');
      resetCtx(g); g.clearRect(0, 0, cw, ch); g.beginPath(); P.ppx.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fillStyle = paper; g.fill();
      g.globalCompositeOperation = 'destination-out'; g.beginPath(); holes(g); g.fillStyle = '#000'; g.fill();
      ctx.drawImage(m, 0, 0);
    };
    // reveal（画布内的几种）
    if (kind === 'ink') {
      const pl = clamp(p / 0.5), pc = clamp((p - 0.45) / 0.55);
      if (pc > 0) { ctx.save(); ctx.filter = pc < 1 ? `grayscale(${1 - pc}) contrast(${lerp(2.6, 1, pc)})` : 'none'; drawContent(); ctx.restore(); }
      if (pc < 1) { ctx.save(); clipPoly(); ctx.clip(); ctx.globalAlpha = 1 - pc; ctx.fillStyle = paper; ctx.fillRect(0, 0, cw, ch); ctx.restore(); }
      drawBorder(P, pl);
    } else if (kind === 'tone' && p < 1 && P.win) {
      drawContent();
      const step = 26;
      paperOver(g => { for (let y = 0; y < ch + step; y += step) for (let x = 0; x < cw + step; x += step) { const u = clamp(p * 1.8 - (x / cw + y / ch) * 0.45 - hash(x, y) * 0.1), rr = step * 0.75 * Math.sqrt(u); if (rr > 0.3) { g.moveTo(x + rr, y); g.arc(x, y, rr, 0, Math.PI * 2); } } });
      drawBorder(P, 1);
    } else if (kind === 'wipe' && p < 1 && P.win) {
      drawContent();
      const e = eIO(p), k = (cw + ch * 0.4) * e;
      paperOver(g => { g.moveTo(-ch * 0.4, 0); g.lineTo(k, 0); g.lineTo(k - ch * 0.4, ch); g.lineTo(-ch * 0.4, ch); g.closePath(); });
      drawBorder(P, clamp(p * 1.4));
    } else if (kind === 'tone' && p < 1) {
      drawContent();
      // 未铺到的地方盖纸色，网点从左上铺开（点逐渐变大连成片）
      ctx.save(); ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath(); const step = 26;
      for (let y = 0; y < ch + step; y += step) for (let x = 0; x < cw + step; x += step) {
        const u = clamp(p * 1.8 - (x / cw + y / ch) * 0.45 - hash(x, y) * 0.1), rr = step * 0.75 * Math.sqrt(u);
        if (rr > 0.3) { ctx.moveTo(x + rr, y); ctx.arc(x, y, rr, 0, Math.PI * 2); }
      }
      ctx.fillStyle = '#000'; ctx.fill(); ctx.restore();
      if (!P.win) { ctx.save(); ctx.globalCompositeOperation = 'destination-over'; clipPoly(); ctx.fillStyle = paper; ctx.fill(); ctx.restore(); }
      drawBorder(P, 1);
    } else if (kind === 'wipe' && p < 1) {
      drawContent();
      // 斜向擦入：没擦到的地方透明（露出纸面）
      ctx.save(); ctx.globalCompositeOperation = 'destination-in'; const e = eIO(p), k = (cw + ch * 0.4) * e;
      ctx.beginPath(); ctx.moveTo(-ch * 0.4, 0); ctx.lineTo(k, 0); ctx.lineTo(k - ch * 0.4, ch); ctx.lineTo(-ch * 0.4, ch); ctx.closePath(); ctx.fillStyle = '#000'; ctx.fill(); ctx.restore();
      drawBorder(P, clamp(p * 1.4));
    } else { drawContent(); drawBorder(P, 1); }
    // 裂纹（破格）
    if (P.crack && T >= P.crack.at) C.cracks(ctx, (P.crack.x ?? 0.5) * cw, (P.crack.y ?? 0.5) * ch, { n: 9, len: Math.max(cw, ch) * 0.55, progress: eOut((T - P.crack.at) / 0.25), width: 6, seed: P.seed });
    P.tex.needsUpdate = true;
  }
  function drawBorder(P, prog) {
    if ((P.border ?? 'ink') === 'none' || prog <= 0) return;
    const bwpx = P.borderW ?? 9, ctx = P.ctx;
    ctx.save();
    if (P.border === 'white') { C.rough(ctx, P.ppx, { width: bwpx * 2.2, color: '#fbf8f2', rough: 0, seed: P.seed, progress: prog }); C.rough(ctx, P.ppx, { width: 2.5, color: ink, rough: P.rough ?? 0.4, seed: P.seed + 1, progress: prog }); }
    else C.rough(ctx, P.ppx, { width: bwpx, color: ink, rough: P.rough ?? 0.6, seed: P.seed, progress: prog });
    ctx.restore();
  }
  // 窗户：离轴相机（格子 = 窗框），渲 RT
  function renderWindow(P, T, camera) {
    const win = P.win, k = win.scale ?? 1;
    win.update?.(T, P);
    const cl = camLocal(P, camera);
    if (cl.z < 0.05) cl.z = 0.05;
    const c = V(...(win.center ?? [0, 0, 0])), cam = P.winCam, n = 0.05 * k, far = win.far ?? 2000;
    cam.position.set(c.x + cl.x * k, c.y + cl.y * k, c.z + cl.z * k); cam.quaternion.identity(); cam.updateMatrixWorld(true);
    const hw = P.bw / 2 * k, hh = P.bh / 2 * k, ez = cl.z * k;
    const L = (-hw - cl.x * k) * n / ez, R = (hw - cl.x * k) * n / ez, Bt = (-hh - cl.y * k) * n / ez, Tp = (hh - cl.y * k) * n / ez;
    cam.projectionMatrix.makePerspective(L, R, Tp, Bt, n, far); cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
    const prevT = renderer.getRenderTarget(), prevC = renderer.getClearColor(new THREE.Color()), prevA = renderer.getClearAlpha();
    renderer.setRenderTarget(P.rt); renderer.setClearColor(col(win.background ?? PAL.ink), 1); renderer.clear(); renderer.render(win.scene, cam);
    renderer.setRenderTarget(prevT); renderer.setClearColor(prevC, prevA);
  }
  function enter(id, camera) {
    const P = byId(id), win = P.win, k = win.scale ?? 1;
    P.flipper.updateWorldMatrix(true, false); camera.updateMatrixWorld(true);
    const rel = _m.copy(P.flipper.matrixWorld).invert().multiply(camera.matrixWorld);
    const pos = V(), q = new THREE.Quaternion(), sc = V(); rel.decompose(pos, q, sc);
    const cam = P.enterCam ??= new THREE.PerspectiveCamera(camera.fov, camera.aspect, 0.05, win.far ?? 2000);
    cam.fov = camera.fov; cam.aspect = camera.aspect; cam.position.copy(pos.multiplyScalar(k).add(V(...(win.center ?? [0, 0, 0])))); cam.quaternion.copy(q); cam.updateProjectionMatrix();
    return { scene: win.scene, camera: cam, inside: pos.z < 0 };
  }

  // ================================================================ 纸面元素：一律是「画布 → 平面」，挂在 body 上（可跨格）
  function planeItem(cwpx, chpx, z) {
    const cv = document.createElement('canvas'); cv.width = cwpx; cv.height = chpx;
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(cwpx / px, chpx / px), paperMat(tex, { transparent: true })); mesh.position.z = z; mesh.renderOrder = 4; body.add(mesh);
    return { cv, ctx: cv.getContext('2d'), tex, mesh };
  }
  // ---- 气泡
  function bubble(o) {
    const kind = o.kind ?? 'speech', size = o.size ?? 54, font = o.font ?? (kind === 'box' ? CF.hand : CF.hand);
    const words = o.words ? o.words.map(w => ({ w: w.w, start: w.start })) : [{ w: o.text ?? '', start: o.at ?? 0 }];
    const at = o.at ?? words[0].start - 0.15;
    const bwFrac = o.w ?? 0.3, bwpx = Math.round(bwFrac * W * px);
    // 排版（按最终全文）
    const mctx = document.createElement('canvas').getContext('2d'); mctx.font = `${size}px ${font}`;
    const maxLine = bwpx * (kind === 'box' ? 0.86 : 0.7), lines = [[]]; let lw = 0;
    const upper = o.upper ?? true;
    words.forEach((w, i) => { const t = (upper ? w.w.toUpperCase() : w.w), ww = mctx.measureText(t + ' ').width; if (lw + ww > maxLine && lines.at(-1).length) { lines.push([]); lw = 0; } lines.at(-1).push({ ...w, t, i }); lw += ww; });
    const lh = size * 1.12, textH = lines.length * lh, bhpx = Math.round(textH + size * (kind === 'box' ? 0.9 : 1.6)), tailPad = kind === 'box' ? 0 : Math.round(size * 2.4);
    const cwpx = bwpx + tailPad * 2, chpx = bhpx + tailPad * 2;
    const it = planeItem(cwpx, chpx, o.z ?? 0.14);
    const c = pagePt(o.x, o.y); it.mesh.position.x = c.x; it.mesh.position.y = c.y;
    const rec = { type: 'bubble', o, it, at, until: o.until ?? Infinity, words, lines, size, font, kind, cwpx, chpx, bwpx, bhpx, tailPad, last: null };
    items.push(rec); return rec;
  }
  function drawBubble(B, T) {
    const { it, o, kind, size, font, cwpx, chpx, bwpx, bhpx, tailPad } = B, ctx = it.ctx;
    const shown = B.words.filter(w => T >= w.start - 0.02).length, key = `${shown}|${T >= B.at}|${T < B.until}`;
    const k = T - B.at, pop = eBack(k / 0.22), out = clamp((T - B.until) / 0.2);
    it.mesh.visible = k >= 0 && out < 1;
    const sc = Math.max(0.001, pop * (1 - out));
    it.mesh.scale.setScalar(sc);
    if (!it.mesh.visible || key === B.last) return;
    B.last = key;
    resetCtx(ctx); ctx.clearRect(0, 0, cwpx, chpx);
    const x0 = tailPad, y0 = tailPad, cx = x0 + bwpx / 2, cy = y0 + bhpx / 2, fill = o.bg ?? (kind === 'box' ? PAL.lemon : '#fffdf8');
    // 尾巴：指向 tail（页面分数）→ 画布坐标
    const tailTo = o.tail ? [(o.tail[0] - o.x) * W * px + cwpx / 2, (o.tail[1] - o.y) * H * px + chpx / 2] : null;
    ctx.lineJoin = 'round'; ctx.lineWidth = 7; ctx.strokeStyle = ink; ctx.fillStyle = fill;
    const tail = () => { if (!tailTo || kind === 'box') return; const a = Math.atan2(tailTo[1] - cy, tailTo[0] - cx), wdt = size * 0.45; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a + 1.57) * wdt, cy + Math.sin(a + 1.57) * wdt); ctx.lineTo(clamp(tailTo[0], 4, cwpx - 4), clamp(tailTo[1], 4, chpx - 4)); ctx.lineTo(cx + Math.cos(a - 1.57) * wdt, cy + Math.sin(a - 1.57) * wdt); ctx.closePath(); };
    if (kind === 'box') { ctx.beginPath(); ctx.rect(x0, y0, bwpx, bhpx); ctx.fill(); ctx.stroke(); }
    else if (kind === 'shout') {
      // 爆炸框：锯齿边
      const n = 22, rnd = mulberry32(B.words.length * 13 + 5); ctx.beginPath();
      for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2, r = i % 2 ? 1.0 : 1.22 + rnd() * 0.12; ctx.lineTo(cx + Math.cos(a) * bwpx / 2 * r * 0.98, cy + Math.sin(a) * bhpx / 2 * r * 1.02); }
      ctx.closePath(); ctx.fill(); ctx.stroke();
    } else if (kind === 'thought') {
      const rnd = mulberry32(9); ctx.beginPath();
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, rx = bwpx / 2 * 0.92, ry = bhpx / 2 * 0.9, r = size * lerp(0.7, 1.0, rnd()); ctx.moveTo(cx + Math.cos(a) * rx + r, cy + Math.sin(a) * ry); ctx.arc(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, r, 0, Math.PI * 2); }
      ctx.stroke(); ctx.fill(); ctx.beginPath(); ctx.ellipse(cx, cy, bwpx / 2 * 0.92, bhpx / 2 * 0.9, 0, 0, Math.PI * 2); ctx.fill();
      if (tailTo) [0.35, 0.6, 0.8].forEach((u, i) => { ctx.beginPath(); ctx.arc(lerp(cx, tailTo[0], u), lerp(cy + bhpx * 0.3, tailTo[1], u), size * (0.34 - i * 0.09), 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    } else {
      ctx.beginPath(); ctx.ellipse(cx, cy, bwpx / 2, bhpx / 2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      tail(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx, cy, bwpx / 2 - 3.5, bhpx / 2 - 3.5, 0, 0, Math.PI * 2); ctx.fill();   // 盖住尾巴根部的线
      if (kind === 'whisper') { ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.ellipse(cx, cy, bwpx / 2, bhpx / 2, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); }
    }
    // 字：逐词写出
    ctx.fillStyle = o.color ?? ink; ctx.font = `${size}px ${font}`; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    B.lines.forEach((ln, li) => {
      const full = ln.map(w => w.t).join(' '), lwpx = ctx.measureText(full).width; let x = cx - lwpx / 2; const y = cy - (B.lines.length - 1) * size * 1.12 / 2 + li * size * 1.12;
      for (const w of ln) { if (w.i < shown) ctx.fillText(w.t, x, y); x += ctx.measureText(w.t + ' ').width; }
    });
    it.tex.needsUpdate = true;
  }
  // ---- 拟声字（2D）
  function sfx(o) {
    const size = Math.round((o.size ?? 0.08) * H * px), font = o.font ?? CF.bang;
    const mctx = document.createElement('canvas').getContext('2d'); mctx.font = `${size}px ${font}`;
    const tw = mctx.measureText(o.text).width, cwpx = Math.round(tw * 1.35 + size), chpx = Math.round(size * 2.1);
    const it = planeItem(cwpx, chpx, o.z ?? 0.16); const c = pagePt(o.x, o.y); it.mesh.position.set(c.x, c.y, o.z ?? 0.16);
    const rec = { type: 'sfx', o, it, size, font, cwpx, chpx, at: o.at ?? 0, until: o.until ?? Infinity, last: null }; items.push(rec); return rec;
  }
  function drawSfx(S, T) {
    const { it, o, size, font, cwpx, chpx } = S, k = T - S.at, out = clamp((T - S.until) / 0.15);
    it.mesh.visible = k >= 0 && out < 1; if (!it.mesh.visible) return;
    const sh = (o.shake ?? 1) * Math.exp(-k * 5);
    it.mesh.scale.setScalar(Math.max(0.001, eBack(k / 0.16, 2.6) * (1 - out)));
    it.mesh.rotation.z = (o.angle ?? -8) * Math.PI / 180 + sh * 0.08 * Math.sin(k * 60);
    const f = Math.floor(T * 12);                                 // 字抖一抖（每秒 12 次换形）
    const key = `${Math.min(f, Math.floor((S.at + 0.6) * 12))}`;
    if (key === S.last) return; S.last = key;
    const ctx = it.ctx; resetCtx(ctx); ctx.clearRect(0, 0, cwpx, chpx);
    const j = k < 0.6 ? hash(f, 3) - 0.5 : 0;
    C.text(ctx, o.text, cwpx / 2 + j * 6, chpx / 2, { size, font, fill: o.color ?? PAL.lemon, stroke: o.stroke ?? ink, skew: o.skew ?? -10, shadow: o.shadow ?? PAL.pink, shadowOff: 0.1 });
    it.tex.needsUpdate = true;
  }
  // ---- 手写注释
  function note(o) {
    const size = Math.round((o.size ?? 0.035) * H * px), font = o.font ?? CF.note;
    const mctx = document.createElement('canvas').getContext('2d'); mctx.font = `${size}px ${font}`;
    const tw = mctx.measureText(o.text).width, pad = size * 3, cwpx = Math.round(tw + pad * 2), chpx = Math.round(size * 1.6 + pad * 2);
    const it = planeItem(cwpx, chpx, o.z ?? 0.12); const c = pagePt(o.x, o.y); it.mesh.position.set(c.x, c.y, o.z ?? 0.12); it.mesh.rotation.z = (o.angle ?? -4) * Math.PI / 180;
    const rec = { type: 'note', o, it, size, font, cwpx, chpx, pad, tw, at: o.at ?? 0, last: null }; items.push(rec); return rec;
  }
  function drawNote(N, T) {
    const { it, o, size, font, cwpx, chpx, pad } = N, k = T - N.at;
    it.mesh.visible = k >= 0; if (!it.mesh.visible) return;
    const n = Math.min(o.text.length, Math.floor(k * (o.cps ?? 18)) + 1), key = `${n}`;
    if (key === N.last) return; N.last = key;
    const ctx = it.ctx; resetCtx(ctx); ctx.clearRect(0, 0, cwpx, chpx);
    ctx.font = `${size}px ${font}`; ctx.fillStyle = o.color ?? ink; ctx.textBaseline = 'middle'; ctx.fillText(o.text.slice(0, n), pad, chpx / 2);
    if (o.arrow && n === o.text.length) {
      const ax = (o.arrow[0] - o.x) * W * px + cwpx / 2, ay = (o.arrow[1] - o.y) * H * px + chpx / 2, sx = ax < cwpx / 2 ? pad - 10 : pad + N.tw + 10, sy = chpx / 2;
      ctx.strokeStyle = o.color ?? ink; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo((sx + ax) / 2, sy - 40, ax, ay); ctx.stroke();
      const a = Math.atan2(ay - (sy - 40), ax - (sx + ax) / 2); ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax - Math.cos(a - 0.5) * 18, ay - Math.sin(a - 0.5) * 18); ctx.moveTo(ax, ay); ctx.lineTo(ax - Math.cos(a + 0.5) * 18, ay - Math.sin(a + 0.5) * 18); ctx.stroke();
    }
    it.tex.needsUpdate = true;
  }

  // ================================================================ 3D 混合
  // 平面投影阴影：把 over 里的网格沿 LS 投到纸面 z = z0
  const shadowMat = new THREE.MeshBasicMaterial({ color: '#1a1020', transparent: true, opacity: 0.32, depthWrite: true, depthFunc: THREE.LessDepth, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  function projM(z0) { const a = LS.x / LS.z, b = LS.y / LS.z; return new THREE.Matrix4().set(1, 0, -a, a * z0, 0, 1, -b, b * z0, 0, 0, 0, z0, 0, 0, 0, 1); }
  function castShadow(obj, { z = 0.012, opacity = 0.32, geometryOf = null } = {}) {
    const list = [];
    obj.traverse(m => { if (m.isMesh && !m.isSkinnedMesh) { const s = new THREE.Mesh(geometryOf?.(m) ?? m.geometry, opacity === 0.32 ? shadowMat : Object.assign(shadowMat.clone(), { opacity })); s.matrixAutoUpdate = false; s.renderOrder = 1; body.add(s); list.push({ src: m, s }); } });
    const rec = { obj, list, P: projM(z) }; shadowsOf.push(rec); return rec;
  }
  const bodyInv = new THREE.Matrix4();
  function updateShadows() {
    body.updateMatrixWorld(true); bodyInv.copy(body.matrixWorld).invert();
    for (const r of shadowsOf) for (const { src, s } of r.list) {
      let vis = r.obj.visible; for (let p = src; p && vis; p = p.parent) vis = p.visible;
      s.visible = vis; if (!vis) continue;
      src.updateMatrixWorld(true);
      s.matrix.copy(r.P).multiply(_m.copy(bodyInv).multiply(src.matrixWorld));
    }
  }
  // ---- 3D 字从纸里弹出
  function word3d(o) {
    const fk = o.font ?? 'anton', size = o.size ?? 1.6, depth = o.depth ?? size * 0.28;
    const geo = textGeo(fk, o.text, { size, depth, bevel: size * 0.03 }).clone(); geo.computeBoundingBox();
    const bb = geo.boundingBox, cx = (bb.min.x + bb.max.x) / 2, cy = (bb.min.y + bb.max.y) / 2; geo.translate(-cx, -cy, depth / 2);   // 底面在 z = 0（贴纸）
    const flat = textGeo(fk, o.text, { size }).clone(); flat.translate(-cx, -cy, 0);
    const color = col(o.color ?? PAL.pink), m = mats(color, o.side ?? null);
    const glow = o.glow ?? 1; m[0].color.copy(color).multiplyScalar(glow);
    const mesh = new THREE.Mesh(geo, m);
    const holder = new THREE.Group(); holder.add(mesh); over.add(holder);
    const rec = { type: 'word3d', o, holder, mesh, flat, at: o.at ?? 0, until: o.until ?? Infinity, size };
    rec.shadow = castShadow(holder, { geometryOf: () => flat, z: o.shadowZ ?? 0.012 });
    items.push(rec); return rec;
  }
  function updWord3d(R, T) {
    const { o, holder } = R, k = T - R.at, out = clamp((T - R.until) / 0.25);
    holder.visible = k >= 0 && out < 1; if (!holder.visible) return;
    const e = eBack(k / (o.dur ?? 0.4), 2.2), lift = (o.lift ?? 0.8) * clamp(e, 0, 1.3) * (1 - out);
    const from = o.from ? pagePt(...o.from) : null, to = pagePt(o.x, o.y);
    const pos = from ? from.clone().lerp(to, eOut(k / (o.dur ?? 0.4))) : to;
    holder.position.set(pos.x, pos.y, lift + (o.bob ?? 0.06) * Math.sin(T * 3.1 + R.at));
    holder.scale.setScalar(Math.max(0.001, lerp(0.35, 1, clamp(e, 0, 1.2)) * (1 - out)));
    const rot = o.rot ?? [8, -6, -4];
    holder.rotation.set(rot[0] * Math.PI / 180 * (1 + 0.3 * Math.sin(T * 1.7)), rot[1] * Math.PI / 180 + 0.12 * Math.sin(T * 1.1 + 1), rot[2] * Math.PI / 180);
    if (o.light !== false) addLight(V(pos.x, pos.y, lift + 0.8), o.light ?? o.color ?? PAL.pink, (o.lightI ?? 1.6) * clamp(k / 0.2) * (1 - out) * (1 + 0.25 * Math.sin(T * 9)), o.lightR ?? R.size * 4.5);
  }
  // ---- 火花 / 粒子跨格
  function sparks(o) {
    const n = o.n ?? 40, pos = new Float32Array(n * 2 * 3 + 24 * 2 * 3);
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.LineBasicMaterial({ color: col(o.color ?? PAL.lemon).multiplyScalar(2.2), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    const lines = new THREE.LineSegments(geo, mat); lines.frustumCulled = false; lines.renderOrder = 6; over.add(lines);
    const rec = { type: 'sparks', o, lines, pos, geo, n, at: o.at ?? 0, dur: o.dur ?? 0.7 }; items.push(rec); return rec;
  }
  function updSparks(R, T) {
    const { o, pos, n } = R, k = (T - R.at) / R.dur, A = pagePt(...o.from, 0.15), B = o.out ? pagePt(...o.to, o.outZ ?? 12) : pagePt(...o.to, 0.15), arc = o.arc ?? 2.2;
    R.lines.visible = k >= 0 && k < 1.8; if (!R.lines.visible) return;
    const P = u => { const m = A.clone().lerp(B, u); m.z += arc * 4 * u * (1 - u); return m; };
    const head = V(); let cnt = 0;
    for (let i = 0; i < n; i++) {
      const d = hash(i, 1) * 0.35, u = clamp((k - d) / 0.65), u0 = clamp(u - 0.07 - hash(i, 2) * 0.05);
      const off = V((hash(i, 3) - 0.5), (hash(i, 4) - 0.5), (hash(i, 5) - 0.5)).multiplyScalar(0.9 * Math.sin(Math.PI * u) * (o.spread ?? 1));
      const a = P(u0).add(off), b = P(u).add(off), on = u > 0 && u < 1;
      pos.set(on ? [a.x, a.y, a.z, b.x, b.y, b.z] : [0, 0, 0, 0, 0, 0], i * 6);
      if (on) { head.add(b); cnt++; }
    }
    // 落点炸开
    const kb = (T - R.at - R.dur * 0.95) / 0.45;
    for (let i = 0; i < 24; i++) {
      const on = o.burst !== false && kb > 0 && kb < 1, a = i / 24 * Math.PI * 2 + hash(i, 8), r0 = 0.2 + kb * 1.6 * (0.6 + hash(i, 9)), r1 = r0 + 0.5 * (1 - kb);
      const z = B.z + (o.out ? 0 : 0.1);
      pos.set(on ? [B.x + Math.cos(a) * r0, B.y + Math.sin(a) * r0, z, B.x + Math.cos(a) * r1, B.y + Math.sin(a) * r1, z] : [0, 0, 0, 0, 0, 0], n * 6 + i * 6);
    }
    R.geo.attributes.position.needsUpdate = true;
    if (cnt) addLight(head.multiplyScalar(1 / cnt), o.color ?? PAL.lemon, o.lightI ?? 2.2, o.lightR ?? 6);
    if (kb > 0 && kb < 1) addLight(V(B.x, B.y, 0.8), o.color ?? PAL.lemon, 3.2 * (1 - kb), 7);
  }
  // ---- 冲击波
  const ringMat = () => new THREE.ShaderMaterial({
    uniforms: { uP: { value: 0 }, uC: { value: new THREE.Color() } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform float uP; uniform vec3 uC; varying vec2 vUv; void main(){ float r = length(vUv * 2.0 - 1.0), e = 1.0 - pow(1.0 - uP, 3.0), R = e * 0.95, w = mix(0.05, 0.012, uP);
      float ring = exp(-pow((r - R) / w, 2.0)) + 0.4 * exp(-pow((r - R * 0.7) / (w * 0.6), 2.0)); float a = ring * (1.0 - smoothstep(0.6, 1.0, uP)); gl_FragColor = vec4(uC * a * 2.0, a); }`,
  });
  function shock(o) {
    const r = o.radius ?? 4, m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2), ringMat()); m.material.uniforms.uC.value.set(o.color ?? PAL.paper);
    const c = pagePt(o.x, o.y, 0.03); m.position.copy(c); m.renderOrder = 5; over.add(m);
    const rec = { type: 'shock', o, m, at: o.at ?? 0, dur: o.dur ?? 0.7 }; items.push(rec); return rec;
  }
  function updShock(R, T) {
    const k = (T - R.at) / R.dur; R.m.visible = k > 0 && k < 1; R.m.material.uniforms.uP.value = clamp(k);
    if (R.m.visible) addLight(V(R.m.position.x, R.m.position.y, 0.6), R.o.color ?? PAL.paper, 3 * (1 - k), (R.o.radius ?? 4) * 2);
  }
  // ---- 光束
  function beam(o) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: col(o.color ?? PAL.mint).multiplyScalar(2.4), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    m.renderOrder = 6; over.add(m); const rec = { type: 'beam', o, m, at: o.at ?? 0, dur: o.dur ?? 0.6 }; items.push(rec); return rec;
  }
  function updBeam(R, T) {
    const { o, m } = R, k = (T - R.at) / R.dur; m.visible = k > 0 && k < 1.4; if (!m.visible) return;
    const A = pagePt(...o.from, 0.2), B = pagePt(...o.to, 0.2), grow = eOut(k / 0.35), fade = 1 - clamp((k - 1) / 0.4);
    const E = A.clone().lerp(B, grow), mid = A.clone().add(E).multiplyScalar(0.5), L = A.distanceTo(E);
    m.position.copy(mid); m.rotation.set(0, 0, Math.atan2(E.y - A.y, E.x - A.x)); m.scale.set(Math.max(0.001, L), (o.width ?? 0.18) * (1 + 0.3 * Math.sin(T * 40)) * fade, 1);
    addLight(mid.setZ(0.7), o.color ?? PAL.mint, 2.4 * fade, Math.max(4, L * 0.8));
  }
  function light(o) { const rec = { type: 'light', o }; items.push(rec); return rec; }
  // ---- 破格：物体（over 里）从格子里冲出
  function breakout(obj, o) {
    over.add(obj); const P = o.panel ? byId(o.panel) : null;
    if (P && o.crack !== false) P.crack = { at: o.at, x: o.crackAt?.[0] ?? 0.5, y: o.crackAt?.[1] ?? 0.5 };
    const rec = { type: 'breakout', o, obj, at: o.at ?? 0, dur: o.dur ?? 0.8 }; items.push(rec);
    if (o.shadow !== false) rec.shadow = castShadow(obj, { z: 0.014 });
    return rec;
  }
  function updBreakout(R, T) {
    const { o, obj } = R, k = (T - R.at) / R.dur;
    obj.visible = k >= (o.before ? -Infinity : 0);
    const e = o.ease ? o.ease(clamp(k)) : eOut(k), A = pagePt(...o.from), B = pagePt(...o.to);
    obj.position.copy(A.lerp(B, e));
    const s = o.scale ?? [1, 1]; obj.scale.setScalar(lerp(s[0], s[1], e));
    if (o.spin) obj.rotation.set(o.spin[0] * e, o.spin[1] * e + (o.idle ?? 0) * T, o.spin[2] * e);
    if (o.light) addLight(obj.position.clone().setZ(obj.position.z + 0.6), o.light, (o.lightI ?? 2) * clamp(k * 3), o.lightR ?? 7);
  }

  // ================================================================ 镜头
  function targetRect(t) {
    if (t === 'page' || t == null) return { c: pagePt(0.5, 0.5), w: W, h: H };
    if (Array.isArray(t)) { const [x, y, w2, h2] = t; return { c: pagePt(x + w2 / 2, y + h2 / 2), w: w2 * W, h: h2 * H }; }
    const P = byId(t); return { c: P.center.clone().setZ(P.depth ?? 0), w: P.bw, h: P.bh };
  }
  function place(camera, R, { yaw = 0, pitch = 0, roll = 0, margin = 1.06, fov = null } = {}) {
    if (fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
    const tv = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2), asp = camera.aspect || 16 / 9;
    const d = Math.max(R.h / 2 / tv, R.w / 2 / (tv * asp)) * margin;
    group.updateWorldMatrix(true, true);                            // group 的旋转可能是这一帧才设的，先刷新世界矩阵
    const y = THREE.MathUtils.degToRad(yaw), p = THREE.MathUtils.degToRad(pitch);
    const dir = V(Math.sin(y) * Math.cos(p), Math.sin(p), Math.cos(y) * Math.cos(p));
    body.updateMatrixWorld(true);
    const posL = R.c.clone().addScaledVector(dir, d);
    const upL = V(0, 1, 0).applyAxisAngle(dir, THREE.MathUtils.degToRad(roll));
    camera.position.copy(posL.applyMatrix4(body.matrixWorld));
    camera.up.copy(upL.transformDirection(body.matrixWorld));
    camera.lookAt(R.c.clone().applyMatrix4(body.matrixWorld));
    camera.updateMatrixWorld(true);
  }
  const fit = (camera, target, opts = {}) => place(camera, targetRect(target), opts);
  function camPath(camera, T, keys, opts = {}) {
    let i = 0; while (i < keys.length - 1 && T >= keys[i + 1].t) i++;
    const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
    const u = b === a ? 0 : (b.ease ?? eIO)(clamp((T - a.t) / Math.max(1e-3, (b.dur ?? (b.t - a.t)))));
    const Ra = targetRect(a.target), Rb = targetRect(b.target);
    const R = { c: Ra.c.clone().lerp(Rb.c, u), w: lerp(Ra.w, Rb.w, u), h: lerp(Ra.h, Rb.h, u) };
    const L = k => lerp(a[k] ?? opts[k] ?? (k === 'margin' ? 1.06 : 0), b[k] ?? opts[k] ?? (k === 'margin' ? 1.06 : 0), u);
    place(camera, R, { yaw: L('yaw'), pitch: L('pitch'), roll: L('roll'), margin: L('margin'), fov: opts.fov });
  }
  function turn(p) { pivot.rotation.y = -Math.PI * eIO(p); pivot.position.z = 0.6 * Math.sin(Math.PI * clamp(p)); }

  // ================================================================ 每帧
  function update(T, { camera = null } = {}) {
    lightsNow.length = 0;
    group.updateWorldMatrix(true, true);
    // 1) 3D 元素（先算，灯要给纸用）
    for (const R of items) {
      if (R.type === 'word3d') updWord3d(R, T);
      else if (R.type === 'sparks') updSparks(R, T);
      else if (R.type === 'shock') updShock(R, T);
      else if (R.type === 'beam') updBeam(R, T);
      else if (R.type === 'breakout') updBreakout(R, T);
      else if (R.type === 'light') { const o = R.o, k = T - (o.at ?? -Infinity), on = k >= 0 && T < (o.until ?? Infinity); if (on) addLight(pagePt(o.x, o.y, o.z ?? 1), o.color ?? PAL.paper, (typeof o.intensity === 'function' ? o.intensity(T) : o.intensity ?? 1.5) * clamp(k / 0.15), o.radius ?? 6); }
    }
    // 2) 灯 → uniform（页面坐标 → 世界）
    body.updateMatrixWorld(true);
    const Ls = lightsNow.sort((a, b) => (b.c.r + b.c.g + b.c.b) - (a.c.r + a.c.g + a.c.b)).slice(0, MAXL);
    for (let i = 0; i < MAXL; i++) {
      const L = Ls[i];
      if (!L) { LU.pos[i].set(0, 0, 0, 0); LU.col[i].set(0, 0, 0); continue; }
      const wp = L.p.clone().applyMatrix4(body.matrixWorld), sc = body.matrixWorld.getMaxScaleOnAxis();
      LU.pos[i].set(wp.x, wp.y, wp.z, L.r * sc); LU.col[i].set(L.c.r, L.c.g, L.c.b);
    }
    // 3) 格子：reveal 的 3D 部分 + 画布 + 窗户
    for (const P of panels) {
      const r = P.reveal, kind = r?.kind ?? 'none', p = revealP(P, T), e = eOut(p), depth = P.depth ?? 0;
      let vis = kind === 'none' || T >= (r.at ?? 0);
      const tilt = P.tilt ?? [0, 0];
      P.flipper.position.set(0, 0, 0); P.flipper.rotation.set(tilt[0] * Math.PI / 180, tilt[1] * Math.PI / 180, 0); P.flipper.scale.setScalar(1);
      P.holder.position.set(P.center.x, P.center.y, 0.001 + depth);
      if (kind === 'pop') { const s = eBack(p, 2.0); P.flipper.scale.setScalar(Math.max(0.001, s)); P.holder.position.z += 0.4 * (1 - p); }
      if (kind === 'slide') { const d = { l: [-1, 0], r: [1, 0], u: [0, 1], d: [0, -1] }[r.dir ?? 'l']; P.flipper.position.set(d[0] * W * 0.6 * (1 - e), d[1] * H * 0.4 * (1 - e), 0.3 * (1 - e)); P.flipper.rotation.z = d[0] * 0.15 * (1 - e); }
      if (kind === 'drop') { const q = clamp(p); P.flipper.position.z = 3 * (1 - q) ** 2; P.flipper.rotation.x += -0.5 * (1 - q); P.flipper.rotation.z = 0.12 * (1 - q); }
      if (kind === 'flip') { P.flipper.rotation.y += Math.PI * (1 - eBack(p, 1.2)); }
      P.holder.visible = vis;
      // 读过的格变暗
      const dim = P.dim ? clamp((T - P.dim.at) / 0.4) * (P.dim.amount ?? 0.45) : 0;
      P.mesh.material.uniforms.uDim.value = dim; if (P.overMesh) P.overMesh.material.uniforms.uDim.value = dim;
      // 投影
      P.sh.material.opacity = vis ? clamp((P.holder.position.z) * 1.6, 0, 0.45) : 0;
      P.sh.position.set(P.center.x + P.flipper.position.x - LS.x / LS.z * P.holder.position.z, P.center.y + P.flipper.position.y - LS.y / LS.z * P.holder.position.z, 0.002);
      if (!vis) continue;
      if (P.win) renderWindow(P, T, camera);
      drawPanel(P, T, camera);
    }
    // 4) 纸面元素
    for (const R of items) {
      if (R.type === 'bubble') drawBubble(R, T);
      else if (R.type === 'sfx') drawSfx(R, T);
      else if (R.type === 'note') drawNote(R, T);
    }
    updateShadows();
  }

  return { group, pivot, body, page, over, W, H, px, panels, items, pagePt, panel, byId, bubble, sfx, note, word3d, sparks, shock, beam, light, castShadow, breakout, enter, fit, camPath, turn, update, C, CF };
}

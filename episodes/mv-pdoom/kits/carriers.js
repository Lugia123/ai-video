// kits/carriers.js — 融合式歌词载体（mv-pdoom v4，W2）：歌词写在画面里本来就有的东西上，不做悬浮字幕。
// 每个工厂 (opts) → { group, update(T), ... }，逐词对 lyrics 时间（opts.line 或 opts.words），词在 start 之前不出现。
//
//   chatBubble   3D 空间里的一块聊天气泡板（ui2d 画），逐词打字、「…」、弹出          opts.ui 必填（createUI2D 的返回）
//   ledSign      楼体 LED 点阵屏 / 跑马灯：唱到的词从右边滚进来，点阵发光            装到楼面：group 朝 +z
//   floorWords   地面 / 舞台 / 跑道上的字：平时是暗轮廓，被踩到（word.start）亮起 + 涟漪  steps 给出每个词的落脚点
//   plate        物体铭牌 / 刻字：金属牌上的凹刻字，唱到那个词，刻槽里注入光
//   fogMirror    镜面雾气字：一面蒙雾的镜子，手指逐词写出（字的笔画处雾被抹开，露出镜面）
//   fuse         沿引信逐词点燃：火花沿引线走，每到一个词（word.start）那个词烧亮
//   constellation 星座连线：字形轮廓稀疏取点 = 星，唱到的词星星连线
//   tiles        方格舞台上的逐格字：词写在还亮着的格子上；格子由外向内一圈圈熄灭掉落，字跟着掉
//
// 组内单位：和 type3d 一样按「相机 z=40、fov 30 → 可视 38×21.4」设计，镜头自己缩放 / 摆放 group。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { FONTS, textGeo, advance, fitLayout, wordsOf, lineMat } from './type3d.js';
import { Line2 } from '../../../assets/vendor/three/examples/jsm/lines/Line2.js';
import { LineGeometry } from '../../../assets/vendor/three/examples/jsm/lines/LineGeometry.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIn = p => clamp(p) ** 3;
const eBack = (p, s = 1.7) => { p = clamp(p); return 1 + (s + 1) * (p - 1) ** 3 + s * (p - 1) ** 2; };
const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
const col = c => new THREE.Color(c);
const hash = (a, b = 0) => { let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const cleanW = w => w.replace(/[“”"]/g, '').replace(/[‘’]/g, "'").replace(/[,.!;:]+$/, '');

function fatLine(points, material) {
  const g = new LineGeometry();
  g.setPositions(points.flatMap(p => [p.x, p.y, p.z ?? 0]));
  const l = new Line2(g, material);
  l.computeLineDistances();
  l.userData.nseg = points.length - 1;
  return l;
}
const drawOn = (l, p) => { const n = Math.floor(l.userData.nseg * clamp(p)); l.geometry.instanceCount = n; l.visible = n > 0; };
function canvasTex(W, H) {
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return { c, ctx: c.getContext('2d'), t };
}
let dotTex = null;
function dot() {
  if (!dotTex) { const { c, ctx, t } = canvasTex(64, 64); const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, '#fff'); g.addColorStop(0.45, 'rgba(255,255,255,.8)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64); t.colorSpace = THREE.NoColorSpace; dotTex = t; }
  return dotTex;
}

// ================================================================ 1. 聊天气泡板（3D 空间里）
export function chatBubble({ ui, line, words, from = 'me', width = 18, height = 10, name = 'ChatGPT', res = 1200, msgs = null, glow = 1.15 }) {
  const ws = wordsOf({ line, words });
  const W = res, H = Math.round(res * height / width);
  const S = ui.surface(W, H);
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: S.tex, transparent: true, color: new THREE.Color(glow, glow, glow) }));
  const group = new THREE.Group(); group.add(mesh);
  const size = Math.round(W * 0.08);   // 字高 ≈ 板高的 5% 以上
  const list = msgs ?? [{ from, words: ws }];
  function update(T) {
    S.clear(null);
    ui.draw.thread(S.ctx, { x: 0, y: 0, w: W, h: H }, T, { msgs: list, size, gap: size * 0.6 });
    S.commit();
  }
  return { group, update, surface: S };
}

// ================================================================ 2. LED 点阵屏 / 跑马灯
export function ledSign({ line, words, cols = 96, rows = 16, pitch = 0.2, color = PAL.lemon, font = '"Bebas Neue", "UIBebas", sans-serif', speed = null, frame = true, upper = true }) {
  const ws = wordsOf({ line, words, upper });
  // 整句先画到一条低分辨率文字带上（1 字高 = rows 像素），每个词记住它在带上的 x 范围
  const band = document.createElement('canvas');
  const bctx = band.getContext('2d', { willReadFrequently: true });
  const fsz = rows * 1.15;
  bctx.font = `${fsz}px ${font}`;
  const gap = rows * 0.7;
  let x = 0;
  const spans = ws.map(w => { const wd = Math.ceil(bctx.measureText(w.text).width); const s = { x0: x, x1: x + wd }; x += wd + gap; return s; });
  band.width = Math.max(1, Math.ceil(x)); band.height = rows;
  bctx.font = `${fsz}px ${font}`; bctx.textBaseline = 'middle'; bctx.fillStyle = '#fff';
  ws.forEach((w, i) => bctx.fillText(w.text, spans[i].x0, rows / 2 + rows * 0.06));
  const px = bctx.getImageData(0, 0, band.width, rows).data;
  const lit = (bx, by) => bx >= 0 && bx < band.width && px[(by * band.width + bx) * 4 + 3] > 110;
  // LED：InstancedMesh 小圆点，逐帧设颜色
  const n = cols * rows;
  const led = new THREE.InstancedMesh(new THREE.CircleGeometry(pitch * 0.42, 10), new THREE.MeshBasicMaterial({ color: '#ffffff' }), n);
  const m4 = new THREE.Matrix4();
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { m4.makeTranslation((i - (cols - 1) / 2) * pitch, ((rows - 1) / 2 - j) * pitch, 0.01); led.setMatrixAt(j * cols + i, m4); led.setColorAt(j * cols + i, new THREE.Color(0, 0, 0)); }
  const group = new THREE.Group(); group.add(led);
  if (frame) {
    const back = new THREE.Mesh(new THREE.BoxGeometry(cols * pitch + pitch * 2, rows * pitch + pitch * 2, 0.2), new THREE.MeshBasicMaterial({ color: '#07070b' }));
    back.position.z = -0.11; group.add(back);
  }
  const on = col(color).multiplyScalar(2.2), off = col('#1c1a22');
  const c = new THREE.Color();
  function update(T) {
    // 已唱到的最后一个词的右端对齐到屏幕 85% 处（每个词开口时用 0.3 s 滑过去）；没唱到的词不亮
    let off0 = -cols * 0.9;
    ws.forEach((w, i) => { if (T >= w.start) off0 = Math.max(off0, lerp(spans[i].x0 - cols * 0.85, spans[i].x1 - cols * 0.85, smooth((T - w.start) / 0.3))); });
    const shift = Math.round(Math.max(-cols, off0));
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const bx = i + shift;
      let on1 = lit(bx, j);
      if (on1) { const wi = spans.findIndex(s => bx >= s.x0 - 1 && bx <= s.x1 + 1); on1 = wi >= 0 && T >= ws[wi].start; }
      const flick = 0.85 + 0.15 * hash(i * 7 + j, Math.floor(T * 12));
      c.copy(on1 ? on : off).multiplyScalar(on1 ? flick : 1);
      led.setColorAt(j * cols + i, c);
    }
    led.instanceColor.needsUpdate = true;
  }
  update(-1e9);
  return { group, update, width: cols * pitch, height: rows * pitch };
}

// ================================================================ 3. 被踩亮的地面字
// 字平躺在 y=0 平面上（group 就是地面）；steps = 每个词的落脚点 [x, z]，不给就沿 x 轴排开
export function floorWords({ line, words, font = 'anton', size = 2.2, steps = null, color = PAL.mint, accent = PAL.lemon, upper = true, spacing = 1.2 }) {
  const ws = wordsOf({ line, words, upper });
  const group = new THREE.Group();
  let xx = 0;
  const pos = steps ?? ws.map(w => { const a = advance(font, w.text, size); const p = [xx + a / 2, 0]; xx += a + size * spacing; return p; });
  if (!steps) { const tot = xx - size * spacing; pos.forEach(p => { p[0] -= tot / 2; }); }
  const items = ws.map((w, i) => {
    const a = advance(font, w.text, size);
    const g = new THREE.Group(); g.position.set(pos[i][0], 0.01, pos[i][1]); g.rotation.x = -Math.PI / 2; group.add(g);
    const geo = textGeo(font, w.text, { size });
    // 暗轮廓（一直在）+ 亮字（被踩到才亮）
    const dim = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: col('#2a2a38'), transparent: true, opacity: 0.9 }));
    dim.position.set(-a / 2, -size * 0.36, 0); g.add(dim);
    const litM = new THREE.MeshBasicMaterial({ color: col(accent).multiplyScalar(1.15), transparent: true });
    const lit = new THREE.Mesh(geo, litM); lit.position.set(-a / 2, -size * 0.36, 0.005); g.add(lit);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.93, 1, 64), new THREE.MeshBasicMaterial({ color: col(color).multiplyScalar(1.2), transparent: true, depthWrite: false }));
    ring.position.z = 0.008; g.add(ring);
    return { w, lit, litM, ring, a };
  });
  function update(T) {
    for (const it of items) {
      const k = T - it.w.start;
      it.lit.visible = k >= 0;
      // 踩下：先闪白，再落到柠黄；之后慢慢退到薄荷余辉
      if (k >= 0) { const c = k < 0.1 ? col('#ffffff').multiplyScalar(1.6) : col(it.w.i % 2 ? PAL.pink : PAL.lemon).lerp(col(color), smooth((k - 0.8) / 1.5)).multiplyScalar(1.15); it.litM.color.copy(c); }   // 亮度压在 bloom 阈值附近：发光但笔画不糊
      it.ring.visible = k >= 0 && k < 0.8;
      const r = 0.2 + eOut(k / 0.8) * (it.a * 0.7 + 1.5);
      it.ring.scale.setScalar(r); it.ring.material.opacity = 1 - clamp(k / 0.8);
    }
  }
  update(-1e9);
  return { group, update, steps: pos };
}

// ================================================================ 4. 铭牌 / 刻字
export function plate({ line, words, font = 'bebas', maxW = 22, maxH = 5, maxSize = 3, color = PAL.lemon, metal = '#8e8a94', upper = true, bolts = true }) {
  const ws = wordsOf({ line, words, upper });
  const L = fitLayout(ws, { font, maxW, maxH, maxSize });
  const group = new THREE.Group();
  const pw = L.W + L.size * 1.6, ph = L.H + L.size * 1.4;
  // 牌子：拉丝金属（matcap 横向渐变）+ 倒角边
  const { c, ctx, t } = canvasTex(256, 256);
  const g = ctx.createRadialGradient(100, 90, 10, 128, 128, 128); g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, '#a9a5ae'); g.addColorStop(1, '#3a3740');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 256; i += 2) { ctx.fillStyle = `rgba(255,255,255,${0.04 * hash(i, 3)})`; ctx.fillRect(0, i, 256, 1); }
  const body = new THREE.Mesh(new THREE.BoxGeometry(pw, ph, 0.35), new THREE.MeshMatcapMaterial({ matcap: t, color: metal }));
  body.position.z = -0.18; group.add(body);
  if (bolts) for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 16), new THREE.MeshMatcapMaterial({ matcap: t, color: '#c8c4cc' }));
    b.rotation.x = Math.PI / 2; b.position.set(sx * (pw / 2 - 0.35), sy * (ph / 2 - 0.35), 0.02); group.add(b);
  }
  // 凹刻：先放一层深色刻槽（一直在），唱到时在槽里铺一层发光（从左往右扫）
  const items = L.items.map((it, i) => {
    const geo = textGeo(font, it.text, { size: it.s });
    const groove = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: '#1a1820' }));
    groove.position.set(it.x, it.y, 0.005); group.add(groove);
    const glowM = new THREE.MeshBasicMaterial({ color: col(color).multiplyScalar(1.1), transparent: true });
    const glow = new THREE.Mesh(geo, glowM); glow.position.set(it.x, it.y, 0.01); group.add(glow);
    // 扫光：用裁剪面太重，改成缩放一个遮挡条 —— 用 scale.x 从左往右「注入」
    const holder = new THREE.Group(); holder.position.set(it.x, it.y, 0.01); group.add(holder);
    glow.position.set(0, 0, 0); holder.add(glow);
    return { w: ws[i], holder, glowM, it };
  });
  function update(T) {
    for (const I of items) {
      const k = T - I.w.start;
      I.holder.visible = k >= 0;
      I.holder.scale.x = Math.max(0.001, eOut(k / 0.28));
      I.glowM.opacity = 1;
      const hot = k < 0.2 ? 1.5 : 1.1 - 0.1 * smooth((k - 0.2) / 1.2);   // 刻槽里的光别过曝，字要能读
      I.glowM.color.set(color).multiplyScalar(hot);
    }
  }
  update(-1e9);
  return { group, update, width: pw, height: ph };
}

// ================================================================ 5. 镜面雾气字
export function fogMirror({ line, words, width = 18, height = 10, res = 1400, font = '"UICaveat", "Caveat", cursive', upper = false, tint = PAL.mint }) {
  const ws = wordsOf({ line, words, upper });
  const W = res, H = Math.round(res * height / width);
  const { c, ctx, t } = canvasTex(W, H);
  const fog = document.createElement('canvas'); fog.width = W; fog.height = H;
  const fctx = fog.getContext('2d');
  const txt = document.createElement('canvas'); txt.width = W; txt.height = H;
  const tctx = txt.getContext('2d');
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: t }));
  const frame = new THREE.Mesh(new THREE.BoxGeometry(width + 0.6, height + 0.6, 0.3), new THREE.MeshStandardMaterial({ color: '#c9c4cc', roughness: 0.3, metalness: 0.8 }));
  frame.position.z = -0.17;
  const group = new THREE.Group(); group.add(frame, mesh);
  // 排版：两行以内，逐词记住位置
  const size = Math.round(H * 0.2);
  ctx.font = `${size}px ${font}`;
  const sp = ctx.measureText(' ').width;
  const rowsW = []; let row = [], rw = 0;
  ws.forEach(w => { const ww = ctx.measureText(w.text).width; if (row.length && rw + sp + ww > W * 0.84) { rowsW.push(row); row = []; rw = 0; } row.push({ w, ww }); rw += (row.length > 1 ? sp : 0) + ww; });
  if (row.length) rowsW.push(row);
  const place = [];
  rowsW.forEach((r, ri) => {
    const tot = r.reduce((a, q) => a + q.ww, 0) + sp * (r.length - 1);
    let x = (W - tot) / 2;
    const y = H / 2 + (ri - (rowsW.length - 1) / 2) * size * 1.15 + size * 0.3;
    r.forEach(q => { place.push({ w: q.w, x, y, ww: q.ww }); x += q.ww + sp; });
  });
  const dur = w => Math.max(0.3, Math.min(0.9, (w.end - w.start) * 0.9));
  function update(T) {
    // 镜面：深色渐变 + 斜向高光
    const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#20262b'); g.addColorStop(0.5, '#0d1013'); g.addColorStop(1, '#1b1f24');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.18; ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.moveTo(W * 0.1, 0); ctx.lineTo(W * 0.24, 0); ctx.lineTo(W * 0.02, H); ctx.lineTo(-W * 0.12, H); ctx.fill();
    ctx.beginPath(); ctx.moveTo(W * 0.3, 0); ctx.lineTo(W * 0.34, 0); ctx.lineTo(W * 0.12, H); ctx.lineTo(W * 0.08, H); ctx.fill();
    ctx.globalAlpha = 1;
    // 雾：带噪点的白雾
    fctx.globalCompositeOperation = 'source-over';
    fctx.clearRect(0, 0, W, H);
    const fg = fctx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, W * 0.7);
    fg.addColorStop(0, 'rgba(225,235,238,0.78)'); fg.addColorStop(1, 'rgba(200,215,220,0.55)');
    fctx.fillStyle = fg; fctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 260; i++) { fctx.fillStyle = `rgba(255,255,255,${0.12 * hash(i, 1)})`; const r = 6 + 30 * hash(i, 2); fctx.beginPath(); fctx.arc(hash(i, 3) * W, hash(i, 4) * H, r, 0, 7); fctx.fill(); }
    // 字：手指抹开的笔画 = 在雾上擦掉（逐词从左到右露出）
    tctx.clearRect(0, 0, W, H);
    tctx.font = `${size}px ${font}`; tctx.textBaseline = 'alphabetic';
    tctx.lineWidth = size * 0.1; tctx.lineJoin = 'round'; tctx.strokeStyle = '#000'; tctx.fillStyle = '#000';
    for (const p of place) {
      const k = (T - p.w.start) / dur(p.w);
      if (k < 0) continue;
      tctx.save(); tctx.beginPath(); tctx.rect(p.x - 10, 0, (p.ww + 20) * clamp(k), H); tctx.clip();
      tctx.fillText(p.w.text, p.x, p.y); tctx.strokeText(p.w.text, p.x, p.y);
      // 水珠往下淌
      for (let d = 0; d < 3; d++) { const dx = p.x + p.ww * hash(p.w.i, d), dl = size * 0.6 * clamp((T - p.w.start - 0.3) / 1.5) * hash(p.w.i, d + 5); tctx.fillRect(dx, p.y, size * 0.05, dl); }
      tctx.restore();
    }
    fctx.globalCompositeOperation = 'destination-out'; fctx.drawImage(txt, 0, 0);
    ctx.drawImage(fog, 0, 0);
    // 字边缘一圈淡淡的色光（镜子里的霓虹反光）
    ctx.globalAlpha = 0.25; ctx.globalCompositeOperation = 'lighter';
    ctx.filter = 'blur(6px)'; ctx.drawImage(txt, 0, 0); ctx.filter = 'none';
    ctx.globalCompositeOperation = 'source-atop'; ctx.fillStyle = tint; ctx.globalAlpha = 0.08; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    t.needsUpdate = true;
  }
  return { group, update, width, height };
}

// ================================================================ 6. 沿引信逐词点燃
export function fuse({ line, words, points = null, font = 'bebas', size = 1.8, upper = true, lift = 0.9 }) {
  const ws = wordsOf({ line, words, upper });
  const pts = (points ?? [[-15, -2], [-10, -3], [-5.5, -1], [-1, -3.4], [3.5, -1.2], [8, -3], [12, -1.6], [15, -2.4]]).map(p => V(p[0], p[1], p[2] ?? 0));
  const cv = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  const Lc = cv.getLength();
  const group = new THREE.Group();
  const rope = fatLine(cv.getSpacedPoints(300), lineMat(col('#6b4a3a'), 6));
  const ash = fatLine(cv.getSpacedPoints(300), lineMat(col('#2a2a30'), 6));
  ash.position.z = 0.01;
  group.add(rope, ash);
  // 词沿引信排：每个词中心对应一个弧长位置
  const tot = ws.reduce((a, w) => a + advance(font, w.text, size), 0) + size * 0.8 * (ws.length - 1);
  let s = (Lc - tot) / 2;
  const items = ws.map((w, i) => {
    const a = advance(font, w.text, size);
    const u = (s + a / 2) / Lc; s += a + size * 0.8;
    const p = cv.getPointAt(u);
    const geo = textGeo(font, w.text, { size, depth: size * 0.15 });
    const m = [new THREE.MeshBasicMaterial({ color: '#3a3440' }), new THREE.MeshBasicMaterial({ color: '#1a1820' })];
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(p.x - a / 2, p.y + lift, 0);
    group.add(mesh);
    return { w, u, mesh, m };
  });
  // 火花：头部一团亮点 + 往后洒的火星
  const NP = 160, ppos = new Float32Array(NP * 3), pcol = new Float32Array(NP * 3);
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(ppos, 3)); pg.setAttribute('color', new THREE.BufferAttribute(pcol, 3));
  const sparks = new THREE.Points(pg, new THREE.PointsMaterial({ size: 1.2, vertexColors: true, map: dot(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  sparks.frustumCulled = false; group.add(sparks);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(4, 3, 1.5) }));
  group.add(head);
  // 火花位置 = 分段线性：line.start 在 0，第 i 个词 start 时正好到它的 u，最后一个词 end 时烧到 1
  const keys = [[ws[0].start - 0.5, 0], ...items.map(it => [it.w.start, it.u]), [ws[ws.length - 1].end + 0.3, 1]];
  const uAt = T => { if (T <= keys[0][0]) return 0; for (let i = 1; i < keys.length; i++) if (T < keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], (T - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0])); return 1; };
  const cL = col(PAL.lemon), cP = col(PAL.pink), cW = col('#ffffff');
  function update(T) {
    const u = uAt(T);
    drawOn(ash, u);
    head.visible = u > 0 && u < 1;
    const hp = cv.getPointAt(clamp(u, 0.0001, 0.9999));
    head.position.copy(hp);
    head.scale.setScalar(1 + 0.4 * Math.sin(T * 47));
    for (let i = 0; i < NP; i++) {
      const age = ((i / NP) + T * 3.1) % 1;               // 循环的火星：age 0..1
      const born = T - age * 0.33;
      const bp = cv.getPointAt(clamp(uAt(born), 0.0001, 0.9999));
      const a = hash(i, 1) * Math.PI * 2, sp = 1.5 + 3 * hash(i, 2);
      ppos[i * 3] = bp.x + Math.cos(a) * sp * age; ppos[i * 3 + 1] = bp.y + Math.sin(a) * sp * age + 2 * age - 5 * age * age; ppos[i * 3 + 2] = 0.1;
      const c = age < 0.2 ? cW : hash(i, 3) < 0.6 ? cL : cP, f = (u > 0 && u < 1) ? 2.2 * (1 - age) : 0;
      pcol[i * 3] = c.r * f; pcol[i * 3 + 1] = c.g * f; pcol[i * 3 + 2] = c.b * f;
    }
    pg.attributes.position.needsUpdate = true; pg.attributes.color.needsUpdate = true;
    for (const it of items) {
      const k = T - it.w.start;
      if (k < 0) { it.m[0].color.set('#3a3440'); it.m[1].color.set('#1a1820'); continue; }
      const flick = 0.85 + 0.15 * Math.sin(T * 31 + it.w.i * 2) * Math.sin(T * 17 + it.w.i);
      const hot = k < 0.15 ? col('#ffffff').multiplyScalar(3) : cL.clone().lerp(cP, smooth((k - 0.3) / 1.2)).multiplyScalar(2.2 * flick);
      it.m[0].color.copy(hot); it.m[1].color.copy(cP).multiplyScalar(0.8);
    }
  }
  update(-1e9);
  return { group, update, curve: cv };
}

// ================================================================ 7. 星座连线
export function constellation({ line, words, font = 'bebas', maxW = 30, maxH = 12, maxSize = 6, upper = true, starColor = PAL.lemon, lineColor = PAL.mint, spacing = 0.9, bg = 1200 }) {
  const ws = wordsOf({ line, words, upper });
  const L = fitLayout(ws, { font, maxW, maxH, maxSize });
  const group = new THREE.Group();
  // 背景星空
  const bpos = new Float32Array(bg * 3), bcol = new Float32Array(bg * 3);
  for (let i = 0; i < bg; i++) {
    bpos.set([(hash(i, 1) - 0.5) * 60, (hash(i, 2) - 0.5) * 34, -6 - hash(i, 3) * 20], i * 3);
    const c = col([PAL.paper, PAL.paper, PAL.mint, PAL.lemon, PAL.pink][Math.floor(hash(i, 4) * 5)]).multiplyScalar(0.4 + 1.2 * hash(i, 5) ** 3);
    bcol.set([c.r, c.g, c.b], i * 3);
  }
  const bgeo = new THREE.BufferGeometry(); bgeo.setAttribute('position', new THREE.BufferAttribute(bpos, 3)); bgeo.setAttribute('color', new THREE.BufferAttribute(bcol, 3));
  const sky = new THREE.Points(bgeo, new THREE.PointsMaterial({ size: 0.35, vertexColors: true, map: dot(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  sky.frustumCulled = false; group.add(sky);
  const lm = lineMat(col(lineColor).multiplyScalar(1.6), 2.5);
  const sm = new THREE.PointsMaterial({ size: 0.9, color: col(starColor).multiplyScalar(2.2), map: dot(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const items = L.items.map((it, i) => {
    const g = new THREE.Group(); g.position.set(it.x, it.y, 0); group.add(g);
    const lines = [], stars = [];
    for (const sh of FONTS[font].generateShapes(it.text, it.s)) {
      for (const path of [sh, ...sh.holes]) {
        const n = Math.max(4, Math.round(path.getLength() / spacing));
        const pp = path.getSpacedPoints(n).map(p => V(p.x, p.y, 0));
        stars.push(...pp.slice(0, -1));
        const l = fatLine(pp, lm); g.add(l); lines.push(l);
      }
    }
    const P = new THREE.Points(new THREE.BufferGeometry().setFromPoints(stars), sm); P.frustumCulled = false; g.add(P);
    return { w: ws[i], g, lines, P };
  });
  function update(T) {
    sky.rotation.z = T * 0.01;
    for (const I of items) {
      const k = T - I.w.start;
      I.g.visible = k >= 0;
      I.P.scale.setScalar(1);
      I.lines.forEach((l, j) => drawOn(l, clamp((k - j * 0.03) / 0.45)));
    }
  }
  update(-1e9);
  return { group, update };
}

// ================================================================ 8. 方格上的逐格字（格子掉下，字消失）
// 地面 N×N 方格（组内 y=0 平面），由外向内一圈圈熄灭掉落（drops[r] = 第 r 圈掉落时刻，r=外圈起）。
// 每个词写在一个格子上（默认：从外圈往里、左右交替），唱到才亮；格子掉下去字跟着掉。
export function tiles({ line, words, n = 7, cell = 2.2, gap = 0.12, drops = null, font = 'anton', upper = true, placeAt = null, color = PAL.mint, accent = PAL.lemon }) {
  const ws = wordsOf({ line, words, upper });
  const R = Math.floor(n / 2);
  const span = { start: ws[0].start, end: ws[ws.length - 1].end };
  const group = new THREE.Group();
  const topM = [col(color).multiplyScalar(0.3), col(color).multiplyScalar(0.18)];   // 格子压暗一点，字才跳得出来
  const cells = [];
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const ring = R - Math.max(Math.abs(i - R), Math.abs(j - R));   // 0 = 最外圈
    const m = new THREE.MeshStandardMaterial({ color: '#1a1822', emissive: topM[(i + j) % 2], roughness: 0.4, metalness: 0.3 });
    const box = new THREE.Mesh(new THREE.BoxGeometry(cell - gap, 0.5, cell - gap), m);
    const g = new THREE.Group(); g.position.set((i - R) * cell, -0.25, (j - R) * cell); g.add(box); group.add(g);
    cells.push({ g, m, i, j, ring, seed: hash(i, j) });
  }
  // 词放哪：默认按圈从外往里、同圈左右交替
  const order = placeAt ?? ws.map((_, k) => {
    const ring = Math.min(R, Math.floor(k * (R + 1) / ws.length));
    const d = R - ring;
    return k % 2 ? [R + d, R] : [R - d, R];
  });
  // 默认掉落时刻：每圈等圈上的词唱完再掉（字至少亮 0.35 s），且由外向内递增；最后一圈落在最后一个词末尾
  const ringOf = k => R - Math.max(Math.abs(order[k][0] - R), Math.abs(order[k][1] - R));
  const dropT = drops ?? (() => {
    const d = [];
    for (let r = 0; r <= R; r++) {
      const mine = ws.filter((_, k) => ringOf(k) === r);
      const lo = r ? d[r - 1] + 0.25 : span.start + 0.6;
      d.push(Math.max(lo, ...mine.map(w => Math.max(w.end, w.start + 0.35))));
    }
    return d;
  })();
  const items = ws.map((w, k) => {
    const [i, j] = order[k];
    const c = cells.find(q => q.i === i && q.j === j);
    const a = advance(font, w.text, 1);
    const s = Math.min(cell * 0.92 / a, cell * 0.7);
    const mesh = new THREE.Mesh(textGeo(font, w.text, { size: s }), new THREE.MeshBasicMaterial({ color: col(accent).multiplyScalar(2), transparent: true }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(-a * s / 2, 0.26, s * 0.36);
    c.g.add(mesh);
    return { w, c, mesh };
  });
  function update(T) {
    for (const c of cells) {
      const k = T - dropT[c.ring] - c.seed * 0.12;
      // 熄灭 0.15 s → 掉落（加速 + 翻转）
      const off = clamp(k / 0.15);
      c.m.emissive.copy(topM[(c.i + c.j) % 2]).multiplyScalar(1 - off * 0.9);
      const f = Math.max(0, k - 0.15);
      c.g.position.y = -0.25 - 9.8 * 0.5 * f * f;
      c.g.rotation.set(f * 2 * (c.seed - 0.5), 0, f * 2.4 * (hash(c.j, c.i) - 0.5));
      c.g.visible = f < 2.2;
      // 格子在拍点上一闪（还亮着的）
    }
    for (const it of items) {
      const k = T - it.w.start;
      it.mesh.visible = k >= 0;
      const fall = T - dropT[it.c.ring];
      it.mesh.material.opacity = fall > 0 ? 1 - clamp(fall / 0.3) : 1;
      it.mesh.material.color.set(k < 0.12 ? '#ffffff' : (it.w.i % 2 ? PAL.pink : accent)).multiplyScalar(k < 0.12 ? 3 : 2);
    }
  }
  update(-1e9);
  return { group, update, dropT, cell, n };
}

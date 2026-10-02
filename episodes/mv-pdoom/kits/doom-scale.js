// kits/doom-scale.js — 全片唯一那台 P(DOOM) 秤（副歌 3 #1047 起用，副歌 4 #1052 复用）。
//
//   const scale = await createDoomScale();          // 尺寸单位 = 她的身高 1.0；原点 = 秤座底面中心，表盘朝 +Z
//   scene.add(scale.group);
//   scale.update(T, { value, lit, cracked, err, pile, glow })
//     value   指针读数（0..1.2 刻度；>1 进红区；1.00 处有限位销，cracked > 0 后销子断掉、指针可以越过去）
//     lit     0..1 整体亮度（表盘底光、霓虹外圈、读数）。0 = 全灭（只剩一点轮廓）
//     cracked 0..1 表盘裂纹（从限位销处往外爬）；≥ 0.5 销子断开飞走；1 = 裂到底、表盘缺一角（碎片见 fragment）
//     err     true：读数窗显示红色「ERR」（闪），否则显示「P(DOOM) x.xx」
//     pile    0..1 秤盘里回形针堆的高度（盘里那一堆是秤自己画的；往盘里倒的回形针流由镜头自己放）
//     glow    外圈霓虹的额外脉冲（0..1，镜头按拍给）
//   scale.fragment：表盘缺掉那一角的碎片（Mesh，挂在 group 下）；镜头要它掉下去时自己改它的 position / rotation（父级 group）。
//   scale.dims：{ dialR, dialY, panY, panR, height }，scale.dialCenter(target) 世界坐标。
//   所有 update 都是 T 的纯函数（贴图按状态重画，同状态不重画）。
//
// 造型：照副歌 3 plan K1：楼顶上一台楼那么高的老式弹簧秤。下面是秤座 + 立柱，中段一只大秤盘（回形针往里倒），
//   上面是圆形表盘（白底黑刻度，1.00 以上一段红区，正中一个读数窗），外圈一圈粉色霓虹。读数字体 Anton，白底黑字，ERR 红字。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const col = c => new THREE.Color(c);
const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k);
const FONT = '"DSAnton", "Anton", Impact, sans-serif';
const V0 = -0.62 * Math.PI, V1 = 0.62 * Math.PI;   // 刻度 0 和 1.2 的角度（从 12 点钟方向顺时针为正）
export const angleOf = v => lerp(V0, V1, v / 1.2);

let fontReady = null;
function loadFont() {
  fontReady ??= new FontFace('DSAnton', `url(${new URL('../../../assets/fonts/anton/Anton-Regular.ttf', import.meta.url)})`).load().then(f => document.fonts.add(f)).catch(() => {});
  return fontReady;
}
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

export async function createDoomScale({ dialR = 5.2, panR = 4.6, seed = 113 } = {}) {
  await loadFont();
  const group = new THREE.Group();
  const H = { base: 2.2, column: 4.6, panY: 0, dialY: 0 };
  H.panY = H.base + H.column;                     // 秤盘底
  H.dialY = H.panY + 2.6 + dialR;                 // 表盘中心
  const height = H.dialY + dialR + 0.6;

  // ---------------- 材质
  const metal = new THREE.MeshStandardMaterial({ color: '#3a3946', metalness: 0.75, roughness: 0.35 });
  const dark = new THREE.MeshStandardMaterial({ color: '#16151d', metalness: 0.4, roughness: 0.6 });
  const neonPink = new THREE.MeshBasicMaterial({ color: hdr(PAL.pink, 2.4), toneMapped: false });
  const neonMint = new THREE.MeshBasicMaterial({ color: hdr(PAL.mint, 1.8), toneMapped: false });

  // ---------------- 秤座 + 立柱（座上一圈薄荷灯带）
  const base = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.9, H.base, 48), dark); base.position.y = H.base / 2; group.add(base);
  const baseRing = new THREE.Mesh(new THREE.TorusGeometry(3.45, 0.06, 8, 96), neonMint); baseRing.rotation.x = Math.PI / 2; baseRing.position.y = H.base - 0.15; group.add(baseRing);
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.95, H.column, 32), metal); column.position.y = H.base + H.column / 2; group.add(column);

  // ---------------- 秤盘（旋转体）+ 盘里那堆回形针（简化：一个会长高的鼓包，表面用回形针贴图）
  const prof = [[0.2, 0], [panR * 0.55, 0.05], [panR * 0.9, 0.5], [panR, 1.2], [panR * 1.03, 1.28], [panR * 0.97, 1.3]].map(([x, y]) => new THREE.Vector2(x, y));
  const pan = new THREE.Mesh(new THREE.LatheGeometry(prof, 72), new THREE.MeshStandardMaterial({ color: '#8d8b98', metalness: 0.9, roughness: 0.22, side: THREE.DoubleSide }));
  pan.position.y = H.panY; group.add(pan);
  const panRim = new THREE.Mesh(new THREE.TorusGeometry(panR * 1.0, 0.07, 8, 96), neonPink); panRim.rotation.x = Math.PI / 2; panRim.position.y = H.panY + 1.28; group.add(panRim);
  const clipTex = clipTexture(seed);
  const heap = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ map: clipTex, emissiveMap: clipTex, emissive: '#ffffff', emissiveIntensity: 0.55, roughness: 0.4, metalness: 0.5 }));
  heap.position.y = H.panY + 0.2; group.add(heap);

  // ---------------- 表盘：背板 + 贴图面 + 指针 + 限位销 + 外圈霓虹
  const dialG = new THREE.Group(); dialG.position.set(0, H.dialY, 0); group.add(dialG);
  const strut = new THREE.Mesh(new THREE.BoxGeometry(1.0, H.dialY - H.panY - dialR + 0.6, 0.8), metal); strut.position.set(0, -(dialR + (H.dialY - H.panY - dialR) / 2) + 0.3, -0.6); dialG.add(strut);
  const back = new THREE.Mesh(new THREE.CylinderGeometry(dialR * 1.08, dialR * 1.08, 1.0, 96), dark); back.rotation.x = Math.PI / 2; back.position.z = -0.55; dialG.add(back);
  const bezel = new THREE.Mesh(new THREE.TorusGeometry(dialR * 1.04, 0.22, 16, 120), new THREE.MeshStandardMaterial({ color: '#c9c7d2', metalness: 1, roughness: 0.18 })); bezel.position.z = 0.02; dialG.add(bezel);
  const neon = new THREE.Mesh(new THREE.TorusGeometry(dialR * 1.15, 0.09, 8, 160), neonPink); neon.position.z = -0.05; dialG.add(neon);
  const DC = document.createElement('canvas'); DC.width = DC.height = 1024;
  const dialTex = new THREE.CanvasTexture(DC); dialTex.colorSpace = THREE.SRGBColorSpace; dialTex.anisotropy = 8;
  const faceMat = new THREE.MeshBasicMaterial({ map: dialTex, toneMapped: false, transparent: true });
  const face = new THREE.Mesh(new THREE.CircleGeometry(dialR, 120), faceMat); dialG.add(face);
  // 指针：从中心伸到刻度，带配重尾巴
  const needleG = new THREE.Group(); needleG.position.z = 0.12; dialG.add(needleG);
  const needleMat = new THREE.MeshBasicMaterial({ color: hdr('#ff2e3a', 1.4), toneMapped: false });
  const nd = new THREE.Mesh(new THREE.BoxGeometry(0.16, dialR * 0.92, 0.06), needleMat); nd.position.y = dialR * 0.46 - 0.1; needleG.add(nd);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.3, dialR * 0.22, 0.06), needleMat); tail.position.y = -dialR * 0.11; needleG.add(tail);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.2, 32), metal); hub.rotation.x = Math.PI / 2; hub.position.z = 0.16; dialG.add(hub);
  // 限位销：刻度 1.00 外侧一颗钢销
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.5, 16), new THREE.MeshStandardMaterial({ color: '#e8e6ee', metalness: 1, roughness: 0.15 }));
  pin.rotation.x = Math.PI / 2; dialG.add(pin);
  const pinHome = new THREE.Vector3(Math.sin(angleOf(1.0) + 0.035) * dialR * 0.83, Math.cos(angleOf(1.0) + 0.035) * dialR * 0.83, 0.2);
  // 缺掉的那一角（cracked = 1 时出现在原位，镜头可以把它拿走）：表盘右上的一块扇形
  const fragA0 = angleOf(1.0) - 0.05, fragA1 = angleOf(1.2) + 0.08;
  const fragShape = new THREE.Shape(); fragShape.moveTo(Math.sin(fragA0) * dialR * 0.55, Math.cos(fragA0) * dialR * 0.55);
  for (let i = 0; i <= 24; i++) { const a = lerp(fragA0, fragA1, i / 24); fragShape.lineTo(Math.sin(a) * dialR, Math.cos(a) * dialR); }
  fragShape.lineTo(Math.sin(fragA1) * dialR * 0.6, Math.cos(fragA1) * dialR * 0.6); fragShape.closePath();
  const fragGeo = new THREE.ExtrudeGeometry(fragShape, { depth: 0.12, bevelEnabled: false });
  { // UV = 表盘贴图坐标（碎片上还是原来那块刻度）
    const p = fragGeo.attributes.position, uv = fragGeo.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / (2 * dialR) + 0.5, p.getY(i) / (2 * dialR) + 0.5);
  }
  const FC = document.createElement('canvas'); FC.width = FC.height = 1024;
  const fragTex = new THREE.CanvasTexture(FC); fragTex.colorSpace = THREE.SRGBColorSpace;
  const fragment = new THREE.Mesh(fragGeo, [new THREE.MeshBasicMaterial({ map: fragTex, toneMapped: false }), dark]);
  fragment.visible = false; dialG.add(fragment);

  // ---------------- 表盘贴图
  const rnd = mulberry32(seed);
  const cracks = [];        // 预生成裂纹折线（从销子处往外爬），按 cracked 截取
  { const o = toPx(pinHome.x * 0.98, pinHome.y * 0.98);
    for (let k = 0; k < 9; k++) {
      let a = rnd() * Math.PI * 2, x = o[0], y = o[1]; const pts = [[x, y]];
      const len = 160 + rnd() * 520;
      for (let s = 0; s < len; s += 28) { a += (rnd() - 0.5) * 0.9; x += Math.cos(a) * 28; y += Math.sin(a) * 28; pts.push([x, y]); }
      cracks.push(pts);
    } }
  function toPx(x, y) { return [512 + x / dialR * 500, 512 - y / dialR * 500]; }
  let lastKey = '';
  function drawDial(c, { value, cracked, err, lit, blink, missing }) {
    c.clearRect(0, 0, 1024, 1024);
    c.save(); c.beginPath(); c.arc(512, 512, 500, 0, Math.PI * 2); c.clip();
    // 底：纸白，暗时变灰
    const L = lerp(0.12, 1, lit);
    const g = c.createRadialGradient(512, 470, 60, 512, 512, 520); g.addColorStop(0, `rgba(${246 * L | 0},${242 * L | 0},${232 * L | 0},1)`); g.addColorStop(1, `rgba(${206 * L | 0},${198 * L | 0},${188 * L | 0},1)`);
    c.fillStyle = g; c.fillRect(0, 0, 1024, 1024);
    // 红区：1.00–1.20
    c.lineWidth = 70; c.strokeStyle = `rgba(232,40,52,${0.25 + 0.75 * lit})`; c.beginPath();
    c.arc(512, 512, 395, angleOf(1.0) - Math.PI / 2, angleOf(1.2) - Math.PI / 2); c.stroke();
    // 刻度：0..1.2，每 0.05 小刻、每 0.25 大刻
    const ink = `rgba(${10 + 30 * (1 - lit) | 0},${10 + 30 * (1 - lit) | 0},${16 + 30 * (1 - lit) | 0},1)`;
    c.strokeStyle = ink; c.fillStyle = ink;
    for (let i = 0; i <= 24; i++) {
      const v = i * 0.05, a = angleOf(v) - Math.PI / 2, big = i % 5 === 0 || i === 20;
      const r0 = big ? 400 : 430, r1 = 468;
      c.lineWidth = big ? 12 : 6; c.beginPath(); c.moveTo(512 + Math.cos(a) * r0, 512 + Math.sin(a) * r0); c.lineTo(512 + Math.cos(a) * r1, 512 + Math.sin(a) * r1); c.stroke();
    }
    c.textAlign = 'center'; c.textBaseline = 'middle';
    for (const [v, s] of [[0, '0'], [0.25, '.25'], [0.5, '.50'], [0.75, '.75'], [1.0, '1.00']]) {
      const a = angleOf(v) - Math.PI / 2; c.font = `${v === 1 ? 74 : 62}px ${FONT}`; c.fillStyle = v === 1 ? `rgba(220,30,44,${0.3 + 0.7 * lit})` : ink;
      c.fillText(s, 512 + Math.cos(a) * 330, 512 + Math.sin(a) * 330);
    }
    // 读数窗
    c.fillStyle = `rgba(${12},${12},${18},1)`; rr(c, 262, 610, 500, 190, 18); c.fill();
    c.lineWidth = 8; c.strokeStyle = `rgba(255,46,136,${0.3 + 0.7 * lit})`; c.stroke();
    if (err) {
      if (blink) { c.font = `150px ${FONT}`; c.fillStyle = `rgba(255,48,60,${0.25 + 0.75 * lit})`; c.fillText('ERR', 512, 712); }
    } else {
      c.font = `54px ${FONT}`; c.fillStyle = `rgba(242,237,228,${0.25 + 0.75 * lit})`; c.fillText('P(DOOM)', 512, 650);
      c.font = `104px ${FONT}`; c.fillStyle = value > 1.0001 ? `rgba(255,60,70,${0.3 + 0.7 * lit})` : `rgba(255,255,255,${0.3 + 0.7 * lit})`;
      c.fillText(value.toFixed(2), 512, 738);
    }
    c.font = `40px ${FONT}`; c.fillStyle = ink; c.fillText('PROBABILITY OF DOOM', 512, 860);
    // 裂纹
    if (cracked > 0) {
      c.lineCap = 'round'; c.lineJoin = 'round';
      for (const [k, pts] of cracks.entries()) {
        const n = Math.floor(pts.length * clamp(cracked * 1.6 - k * 0.07));
        if (n < 2) continue;
        for (const [w, s] of [[9, '#0a0a10'], [3, 'rgba(255,255,255,0.7)']]) { c.lineWidth = w; c.strokeStyle = s; c.beginPath(); pts.slice(0, n).forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); }
      }
    }
    c.restore();
    // 缺角：挖掉碎片那块
    if (missing) {
      c.save(); c.globalCompositeOperation = 'destination-out'; c.beginPath();
      fragShape.getPoints(30).forEach((p, i) => { const [x, y] = toPx(p.x, p.y); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.closePath(); c.fill(); c.restore();
    }
  }
  function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

  const lastFrag = { key: '' };
  function update(T, { value = 0, lit = 1, cracked = 0, err = false, pile = 0, glow = 0 } = {}) {
    const blink = !err || Math.floor(T * 6) % 2 === 0;
    const missing = cracked >= 1;
    const key = [value.toFixed(2), lit.toFixed(2), cracked.toFixed(2), err, blink, missing].join('|');
    if (key !== lastKey) { drawDial(DC.getContext('2d'), { value, cracked, err, lit, blink, missing }); dialTex.needsUpdate = true; lastKey = key; }
    if (missing) {
      const fk = `${cracked >= 1}|${lit.toFixed(2)}`;
      if (fk !== lastFrag.key) { drawDial(FC.getContext('2d'), { value: 1.13, cracked: 1, err: false, lit, blink: true, missing: false }); fragTex.needsUpdate = true; lastFrag.key = fk; }
    }
    fragment.visible = missing;
    // 指针：没断销之前顶在 1.00（销子挡住）
    const v = cracked < 0.5 ? Math.min(value, 1.0) : value;
    needleG.rotation.z = -angleOf(clamp(v, 0, 1.3));
    pin.visible = cracked < 0.5; pin.position.copy(pinHome);
    // 亮度
    const k = lerp(0.05, 1, lit);
    neonPink.color.copy(hdr(PAL.pink, 2.4 * k * (1 + 0.6 * glow)));
    neonMint.color.copy(hdr(PAL.mint, 1.8 * k));
    needleMat.color.copy(hdr('#ff2e3a', 1.4 * lerp(0.3, 1, lit)));
    faceMat.color.setScalar(lerp(0.35, 1, lit));
    heap.material.emissiveIntensity = 0.55 * k;
    // 盘里那堆
    const p = clamp(pile);
    heap.visible = p > 0.001;
    heap.scale.set(panR * lerp(0.4, 1.05, Math.sqrt(p)), lerp(0.2, panR * 0.95, p), panR * lerp(0.4, 1.05, Math.sqrt(p)));
  }
  update(0, {});
  const dims = { dialR, dialY: H.dialY, panY: H.panY, panR, height };
  return {
    group, update, fragment, dims, needle: needleG, pan,
    dialCenter: (target = new THREE.Vector3()) => dialG.getWorldPosition(target),
    panTop: (target = new THREE.Vector3()) => target.set(0, H.panY + 1.3, 0).applyMatrix4(group.matrixWorld),
  };
}

// 回形针平铺贴图（秤盘里的堆、回形针海共用）：深底上铺满银色、少量粉 / 薄荷 / 柠黄的回形针
export function clipTexture(seed = 7, { size = 512, n = 260, bg = '#14131a' } = {}) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d'), rnd = mulberry32(seed);
  g.fillStyle = bg; g.fillRect(0, 0, size, size);
  const colors = ['#d9d9e2', '#c4c4cf', '#eeeef4', '#a9a9b6', PAL.pink, PAL.mint, PAL.lemon];
  for (let i = 0; i < n; i++) {
    const x = rnd() * size, y = rnd() * size, a = rnd() * Math.PI, L = size * (0.06 + rnd() * 0.04), w = L * 0.34;
    const h = rnd(), cl = h < 0.86 ? colors[Math.floor(rnd() * 4)] : colors[4 + Math.floor((h - 0.86) / 0.0467)] ?? colors[0];
    for (const [dx, dy] of [[0, 0], [size, 0], [-size, 0], [0, size], [0, -size]]) {
      g.save(); g.translate(x + dx, y + dy); g.rotate(a);
      g.strokeStyle = '#05050a'; g.lineWidth = L * 0.16; clipPath(g, L, w); g.stroke();
      g.strokeStyle = cl; g.lineWidth = L * 0.09; clipPath(g, L, w); g.stroke();
      g.restore();
    }
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
  return t;
}
function clipPath(g, L, w) {
  // 回形针：外圈 + 内圈两个 U
  const r1 = w / 2, r2 = w * 0.32;
  g.beginPath();
  g.moveTo(-L / 2 + r1 + L * 0.62, -r2 * 0.35); g.lineTo(-L / 2 + r1, -r2 * 0.35);
  g.arc(-L / 2 + r1, 0, r1 * 0.68, -Math.PI / 2, Math.PI / 2, true);
  g.lineTo(L / 2 - r1, r1 * 0.68); g.arc(L / 2 - r1, 0, r1 * 0.68, Math.PI / 2, -Math.PI / 2, true);
  g.lineTo(-L / 2 + r1 * 1.4, -r1 * 0.68);
}

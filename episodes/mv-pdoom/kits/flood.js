// kits/flood.js —— 文字洪水（#941，W2）：AI 的回复停不下来，一行行字像水一样从手机里溢出来，淹没房间。
//
//   import { textBlock, textRibbon, textSea, floatWords, textWave } from '../kits/flood.js';
//   （canvas 字体用 ui2d 的 F —— 先 await createUI2D(mv) 让字体载入；3D 挤出字用 type3d —— 先 await initType3D()）
//
//   textBlock(lines, opts)          把回复原文排成一大块字（CanvasTexture，可平铺），给海面 / 浪面用
//   textRibbon(text, points, opts)  一条字带：沿一条 3D 曲线平铺（像摊开的纸条 / 水流），字沿着带子往前流；
//                                   update(T, { len: 0..1 已流出的长度, flow: 字流速 }) —— 头部往前伸，字在带子上流
//   textSea(opts)                   房间里上涨的「文字海」：一块起伏的平面，面上铺满回复原文，慢慢漂；update(T, { level })
//   floatWords(words, opts)         漂在海面上的 3D 挤出词（真的字，不是乱码），随波起伏；可以点名高亮某个词（歌词）；opts.t0 = 漂移起算时刻
//   textWave(lines, opts)           《闪灵》电梯的「浪」：一整面字墙，顶部往前卷，朝镜头涌；update(T, { z, curl, rise })
//
// 所有 update 都是 T 的纯函数；随机只用种子 hash。

import * as THREE from 'three';
import { F } from './ui2d.js';
import { textGeo } from './type3d.js';
import { PALETTE as PAL } from '../engine/palette.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
function hash(a, b = 0) { let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
const tex = c => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };

// ================================================================ 排版：一大块字
export function textBlock(lines, { w = 2048, h = 2048, px = 44, color = '#bff7ea', accent = PAL.lemon, bg = null, lineGap = 1.35, font = F.mono } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d');
  if (bg) { x.fillStyle = bg; x.fillRect(0, 0, w, h); }
  x.font = `${px}px ${font}`; x.textBaseline = 'top';
  // 按词换行排满整块（行首不留空），句子循环用；数字 / 标题行用强调色
  const words = lines.join('  ').split(/\s+/);
  let cx = 0, cy = 0, k = 0;
  const lh = px * lineGap, sp = x.measureText(' ').width;
  while (cy < h) {
    const wd = words[k % words.length]; k++;
    const ww = x.measureText(wd).width;
    if (cx + ww > w) { cx = 0; cy += lh; if (cy >= h) break; }
    x.fillStyle = /^\d+\.|^#|!$|:$/.test(wd) ? accent : color;
    x.fillText(wd, cx, cy);
    cx += ww + sp;
  }
  const t = tex(c); t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

// ================================================================ 字带
export function textRibbon(text, points, { width = 0.12, px = 72, color = '#dffcf4', glow = 1.6, up = new THREE.Vector3(0, 1, 0), seg = 160, font = F.mono, lift = 0.004 } = {}) {
  // 一行字 → 横长贴图（字沿 u 方向），整条带子按弧长铺，u 重复
  const c = document.createElement('canvas'); c.height = px * 1.5;
  const x = c.getContext('2d'); x.font = `${px}px ${font}`;
  const tw = Math.ceil(x.measureText(text + '   ').width);
  c.width = Math.min(8192, tw);
  x.font = `${px}px ${font}`; x.textBaseline = 'middle'; x.fillStyle = '#ffffff';
  x.fillText(text + '   ', 0, c.height / 2);
  const t = tex(c); t.wrapS = THREE.RepeatWrapping;
  const aspect = c.width / c.height;                                 // 贴图一格对应的带长 = width * aspect
  const curve = new THREE.CatmullRomCurve3(points);
  const L = curve.getLength();
  const pos = new Float32Array((seg + 1) * 2 * 3), uv = new Float32Array((seg + 1) * 2 * 2), idx = [];
  let side = new THREE.Vector3(1, 0, 0);
  for (let i = 0; i <= seg; i++) {
    const u = i / seg, p = curve.getPointAt(u), tg = curve.getTangentAt(u);
    const s = new THREE.Vector3().crossVectors(tg, up);
    if (s.lengthSq() > 1e-4) side = s.normalize();
    const nrm = new THREE.Vector3().crossVectors(side, tg).normalize();
    const a = p.clone().addScaledVector(side, -width / 2).addScaledVector(nrm, lift), b = p.clone().addScaledVector(side, width / 2).addScaledVector(nrm, lift);
    pos.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6);
    const U = u * L / (width * aspect);
    uv.set([U, 0, U, 1], i * 4);
    if (i) { const q = (i - 1) * 2; idx.push(q, q + 2, q + 1, q + 1, q + 2, q + 3); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setIndex(idx);
  const mat = new THREE.MeshBasicMaterial({ map: t, color: new THREE.Color(color).multiplyScalar(glow), transparent: true, depthWrite: false, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(g, mat); mesh.frustumCulled = false;
  // 底色：半透明的深青带子（像一股水），字在上面
  const under = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: '#0d4a52', transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide }));
  under.frustumCulled = false; under.renderOrder = -1;
  const group = new THREE.Group(); group.add(under, mesh);
  function update(T, { len = 1, flow = 0.8, fade = 1 } = {}) {
    const n = Math.round(clamp(len) * seg);
    g.setDrawRange(0, n * 6);
    group.visible = n > 0 && fade > 0;
    t.offset.x = -T * flow;                                           // 字往带子前方流
    mat.opacity = fade; under.material.opacity = 0.55 * fade;
  }
  return { group, update, length: L, curve };
}

// ================================================================ 文字海
export function textSea({ size = [6, 6], center = [0, 0], lines, seg = 64, repeat = 3, color = '#9ff0e0', deep = '#08323a' } = {}) {
  const g = new THREE.PlaneGeometry(size[0], size[1], seg, seg); g.rotateX(-Math.PI / 2);
  const base = g.attributes.position.array.slice();
  const t = textBlock(lines, { px: 40, color: '#ffffff', accent: '#fff3a0' }); t.repeat.set(repeat, repeat);
  const surf = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: t, color: new THREE.Color(color).multiplyScalar(1.25), transparent: true, depthWrite: false }));
  const body = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: deep, transparent: true, opacity: 0.93, side: THREE.DoubleSide }));
  body.renderOrder = -1; surf.renderOrder = 1;
  const group = new THREE.Group(); group.add(body, surf); group.position.set(center[0], 0, center[1]);
  const wave = (x, z, T) => 0.025 * Math.sin(x * 3.1 + T * 2.3) + 0.018 * Math.sin(z * 4.3 - T * 1.7) + 0.01 * Math.sin((x + z) * 9 + T * 4);
  function update(T, { level = 0, flow = [0.03, 0.05], amp = 1 } = {}) {
    group.visible = level > 0.001;
    const p = g.attributes.position.array;
    for (let i = 0; i < p.length; i += 3) p[i + 1] = base[i + 1] + level + amp * wave(base[i], base[i + 2], T);
    g.attributes.position.needsUpdate = true;
    t.offset.set(T * flow[0], T * flow[1]);
  }
  return { group, update, heightAt: (x, z, T, level, amp = 1) => level + amp * wave(x - center[0], z - center[1], T) };
}

// ================================================================ 漂着的 3D 词
export function floatWords(words, { area = [-2.8, 2.8, -2.8, 2.8], size = 0.12, font = 'anton', color = '#e8fff9', accent = PAL.lemon, seed = 3, t0 = 0 } = {}) {
  const group = new THREE.Group();
  const items = words.map((w, i) => {
    const text = typeof w === 'string' ? w : w.text;
    const g = textGeo(font, text.toUpperCase(), { size: (w.size ?? size), depth: (w.size ?? size) * 0.35, bevel: (w.size ?? size) * 0.04 });
    const bb = g.boundingBox;
    const front = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(1.2) });
    const sideM = new THREE.MeshBasicMaterial({ color: w.at != null ? '#8a5a10' : '#3aa89a' });
    const m = new THREE.Mesh(g, [front, sideM]);
    const holder = new THREE.Group(); m.position.set(-(bb.max.x + bb.min.x) / 2, 0, 0); holder.add(m); group.add(holder);
    const at = w.at ?? null;
    return { holder, front, at, x: w.x ?? lerp(area[0], area[1], hash(seed, i)), z: w.z ?? lerp(area[2], area[3], hash(seed + 1, i)), yaw: (hash(seed + 2, i) - 0.5) * 1.2, ph: hash(seed + 3, i) * 6.28, drift: (hash(seed + 4, i) - 0.5) * 0.15 };
  });
  function update(T, { heightAt, level = 0, sink = null } = {}) {
    for (const it of items) {
      const dr = it.at != null ? 0 : it.drift * (T - t0);             // 漂移从 t0 起算；歌词词不漂（留在她身边）
      const x = it.x + dr, z = it.z + dr * 0.6;
      const y = heightAt ? heightAt(x, z, T) : level;
      const lit = it.at != null ? clamp((T - it.at) / 0.08) : 0;
      const pop = it.at != null ? (T < it.at ? 0 : 1 + 0.35 * Math.exp(-(T - it.at) * 6)) : 1;
      it.holder.visible = it.at == null || T >= it.at - 0.02;
      it.holder.position.set(x, y + 0.01 + 0.015 * Math.sin(T * 2 + it.ph) - (sink?.(it) ?? 0), z);
      const face = it.at != null;                                   // 歌词词：立起来正对镜头方向（+z），好读
      it.holder.rotation.set(face ? -0.08 : -0.35 + 0.12 * Math.sin(T * 1.7 + it.ph), face ? 0.15 * Math.sin(T * 1.1 + it.ph) : it.yaw, 0.1 * Math.sin(T * 1.3 + it.ph));
      it.holder.scale.setScalar(pop);
      it.front.color.set(it.at != null ? PAL.lemon : '#e8fff9').multiplyScalar(it.at != null ? 0.75 + 0.35 * lit : 1.2);
    }
  }
  return { group, update, items };
}

// ================================================================ 字浪（《闪灵》）
export function textWave(lines, { width = 6, height = 4.5, segX = 60, segY = 48, layers = 3 } = {}) {
  const group = new THREE.Group();
  const sheets = [];
  for (let k = 0; k < layers; k++) {
    const g = new THREE.PlaneGeometry(width * (1 + 0.15 * k), height * (1 - 0.12 * k), segX, segY);
    const base = g.attributes.position.array.slice();
    const t = textBlock(lines, { px: 46 - k * 6, color: k ? '#8fe6d6' : '#f2fffb', accent: '#fff3a0', bg: k === 0 ? 'rgba(6,60,70,0.55)' : null });
    t.repeat.set(1.4 + k * 0.3, 1.2);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: t, color: new THREE.Color(1, 1, 1).multiplyScalar(1.5 - 0.35 * k), transparent: true, depthWrite: false, side: THREE.DoubleSide }));
    m.renderOrder = 3 - k; m.frustumCulled = false;
    group.add(m); sheets.push({ g, base, t, m, k });
  }
  // z：浪前沿（最靠近镜头那一层）所在的 z；curl：顶部往前卷的量；rise：高度 0..1
  function update(T, { z = 0, curl = 1, rise = 1, flow = 0.08 } = {}) {
    for (const s of sheets) {
      const p = s.g.attributes.position.array, H = height * (1 - 0.12 * s.k);
      for (let i = 0; i < p.length; i += 3) {
        const x0 = s.base[i], y0 = s.base[i + 1];
        const v = clamp((y0 + H / 2) / H);                             // 0 底 … 1 顶
        const churn = 0.12 * Math.sin(x0 * 2.1 + T * 1.3 + v * 4) + 0.08 * Math.sin(x0 * 5.3 - T * 0.9);
        const lip = curl * Math.pow(v, 2.2) * 1.4;                   // 顶部往前（+z）卷
        const drop = curl * Math.pow(clamp((v - 0.8) / 0.2), 2) * 0.5;
        p[i + 1] = v * H * rise - drop;
        p[i + 2] = -s.k * 0.9 + lip + churn;
      }
      s.g.attributes.position.needsUpdate = true;
      s.m.position.z = z;
      s.t.offset.set(0.02 * Math.sin(T * 0.7 + s.k), -T * flow * (1 + 0.4 * s.k));   // 字往上爬（浪面在涌）
    }
  }
  return { group, update };
}

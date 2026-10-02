// 回形针刚体物理烘焙（离线跑一次，产物给 episodes/mv-pdoom/kits/paperclip-phys.js 按 T 回放）。#1073
//
//   node tools/paperclip-bake/bake.mjs tower   → episodes/mv-pdoom/kits/paperclip-phys/tower.bin.gz   一栋由回形针拼成的楼，自上而下松开、坍塌、散落
//   node tools/paperclip-bake/bake.mjs pile    → episodes/mv-pdoom/kits/paperclip-phys/pile.bin.gz    几千枚回形针从上面倒下来，真碰撞、真堆起来
//   可选：--seed n  --out 路径
//
// 单位：回形针曲线单位（kits/world.js 的 paperclipCurve）——一枚长 3.06（y −1.65…1.41）、宽 1（x ±0.5），平躺在本地 XY 平面，法线是本地 Z。
// 碰撞体：每枚 3 根沿本地 Y 的胶囊（两根外轨 + 一根内轨），拼成一片有厚度的回形针。
// 模拟：Rapier（@dimforge/rapier3d-compat，devDependency），120 步 / 秒；每 1/30 秒存一帧。
// 文件格式（gzip 之前，小端）：
//   头 32 字节：'PCLP' | u32 版本 1 | u32 枚数 N | u32 帧数 F | f32 帧率 | f32 posScale | f32 松开前的静止秒数 t0 | u32 保留
//   f32 tAct[N]        每枚被松开（开始受力）的时刻；一直是动的填 0
//   i16 帧[F][N][7]    位置 xyz（× posScale 得曲线单位）+ 四元数 xyzw（÷ 32767）
import RAPIER from '@dimforge/rapier3d-compat';
import { gzipSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2), scene = args[0];
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
if (!['tower', 'pile'].includes(scene)) { console.log('用法：node tools/paperclip-bake/bake.mjs <tower|pile> [--seed n] [--out 文件]'); process.exit(1); }
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = path.resolve(opt('out', path.join(ROOT, `episodes/mv-pdoom/kits/paperclip-phys/${scene}.bin.gz`)));

function mulberry32(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let q = a; q = Math.imul(q ^ (q >>> 15), q | 1); q ^= q + Math.imul(q ^ (q >>> 7), q | 61); return ((q ^ (q >>> 14)) >>> 0) / 4294967296; }; }
const rnd = mulberry32(+opt('seed', scene === 'tower' ? 7 : 19));
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
// 三个正交轴（本地 X、Y、Z 在世界里的方向）→ 四元数
function quatFromBasis(X, Y, Z) {
  const [m00, m10, m20] = X, [m01, m11, m21] = Y, [m02, m12, m22] = Z, tr = m00 + m11 + m22; let x, y, z, w;
  if (tr > 0) { const s = Math.sqrt(tr + 1) * 2; w = s / 4; x = (m21 - m12) / s; y = (m02 - m20) / s; z = (m10 - m01) / s; }
  else if (m00 > m11 && m00 > m22) { const s = Math.sqrt(1 + m00 - m11 - m22) * 2; w = (m21 - m12) / s; x = s / 4; y = (m01 + m10) / s; z = (m02 + m20) / s; }
  else if (m11 > m22) { const s = Math.sqrt(1 + m11 - m00 - m22) * 2; w = (m02 - m20) / s; x = (m01 + m10) / s; y = s / 4; z = (m12 + m21) / s; }
  else { const s = Math.sqrt(1 + m22 - m00 - m11) * 2; w = (m10 - m01) / s; x = (m02 + m20) / s; y = (m12 + m21) / s; z = s / 4; }
  return { x, y, z, w };
}
function randomQuat() { const u = rnd(), v = rnd() * 6.2832, w = rnd() * 6.2832, a = Math.sqrt(1 - u), b = Math.sqrt(u); return { x: a * Math.sin(v), y: a * Math.cos(v), z: b * Math.sin(w), w: b * Math.cos(w) }; }

await RAPIER.init();
const G = 45;                                   // 重力（曲线单位 / 秒²）：一枚回形针约 0.4 个身高长，折算下来和真实重力差不多
const world = new RAPIER.World({ x: 0, y: -G, z: 0 });
const SUB = 4, FPS = 30; world.timestep = 1 / (FPS * SUB);
const R = 0.1;                                  // 胶囊半径（铁丝半径 0.055，略加粗，堆起来稳）
// 一枚回形针：3 根胶囊。外轨 x = ±0.5，内轨 x = −0.1；整体重心在 y ≈ −0.1
const RAILS = [[0.5, -0.05, 1.3], [-0.5, -0.3, 1.05], [-0.05, 0.1, 0.9]];      // [x, 中心 y, 半长]
function addClip(pos, q, { fixed = false, linvel = null, angvel = null } = {}) {
  const d = (fixed ? RAPIER.RigidBodyDesc.fixed() : RAPIER.RigidBodyDesc.dynamic()).setTranslation(pos[0], pos[1], pos[2]).setRotation(q).setLinearDamping(0.05).setAngularDamping(0.25).setCanSleep(true);
  if (linvel) d.setLinvel(...linvel); if (angvel) d.setAngvel({ x: angvel[0], y: angvel[1], z: angvel[2] });
  const b = world.createRigidBody(d);
  for (const [x, y, hh] of RAILS) world.createCollider(RAPIER.ColliderDesc.capsule(hh, R).setTranslation(x, y, 0).setFriction(0.55).setRestitution(0.12).setDensity(1), b);
  return b;
}
// 地面：一块很大的固定厚板，顶面 y = 0
world.createCollider(RAPIER.ColliderDesc.cuboid(4000, 5, 4000).setTranslation(0, -5, 0).setFriction(0.8).setRestitution(0.05));

const clips = [];           // { body, tAct, kick }
let T0 = 0, DUR = 6;
if (scene === 'tower') {
  // 楼：宽 W × 深 D × 高 H，外壳两层回形针（外层竖着贴、里层横着贴，错开，远看是一面密的金属编织墙）+ 屋顶两层
  const W = 30, D = 30, H = 66, PX = 1.24, PY = 3.32; T0 = 0.5; DUR = 6.5;
  const WAVE = 1.15;                                         // 从屋顶松到地面用多少秒
  const put = (pos, X, Y, Z, n) => { const y = pos[1], tAct = T0 + (1 - y / H) * WAVE + (rnd() - 0.5) * 0.16;
    clips.push({ body: addClip(pos, quatFromBasis(X, Y, Z), { fixed: true }), tAct, n }); };
  const walls = [[[1, 0, 0], [0, 0, -1], W / 2, D], [[-1, 0, 0], [0, 0, 1], W / 2, D], [[0, 0, 1], [1, 0, 0], D / 2, W], [[0, 0, -1], [-1, 0, 0], D / 2, W]];   // [法线, 沿墙方向, 离中心, 墙宽]
  for (const [n, t, off, len] of walls) for (let layer = 0; layer < 2; layer++) {
    const pu = layer ? PY : PX, pv = layer ? PX : PY, d = off - layer * 0.34, nu = Math.floor((len - 0.6) / pu), nv = Math.floor((H - 0.4) / pv);
    for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
      const u = (i + 0.5 - nu / 2) * pu, v = 0.35 + (j + 0.5) * pv + (layer ? 0 : 0.12);
      const pos = [n[0] * d + t[0] * u, v, n[2] * d + t[2] * u];
      if (layer) put(pos, [0, -1, 0], t, n, n); else put(pos, t, [0, 1, 0], n, n);      // 外层：长轴朝上；里层：长轴沿墙
    } }
  for (let layer = 0; layer < 2; layer++) { const pu = layer ? PY : PX, pv = layer ? PX : PY, nu = Math.floor((W - 0.4) / pu), nv = Math.floor((D - 0.4) / pv);
    for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const x = (i + 0.5 - nu / 2) * pu, z = (j + 0.5 - nv / 2) * pv, len = Math.hypot(x, z) || 1;
      const pos = [x, H + 0.2 - layer * 0.34, z], out = [x / len, 0, z / len];
      if (layer) put(pos, [0, 0, 1], [1, 0, 0], [0, 1, 0], out); else put(pos, [1, 0, 0], [0, 0, -1], [0, 1, 0], out); } }
  // 楼板：每 6.6 一层，平铺一层回形针（把楼的体积填上；塌下来中间才是实的一堆，不是一个圈）
  for (let k = 1; k * 6.6 < H - 3; k++) { const layer = k % 2, pu = layer ? PY : PX, pv = layer ? PX : PY, nu = Math.floor((W - 2.2) / pu), nv = Math.floor((D - 2.2) / pv);
    for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const x = (i + 0.5 - nu / 2) * pu, z = (j + 0.5 - nv / 2) * pv, len = Math.hypot(x, z) || 1, pos = [x, k * 6.6, z], out = [x / len * 0.5, 0, z / len * 0.5];
      if (layer) put(pos, [0, 0, 1], [1, 0, 0], [0, 1, 0], out); else put(pos, [1, 0, 0], [0, 0, -1], [0, 1, 0], out); } }
  console.log(`楼：${W}×${D}×${H}，${clips.length} 枚`);
} else {
  // 堆：3200 枚从上面倒下来。地上先放几个半埋的固定大球，堆出来的底不是平的
  const N = 3200, POUR = 4.6; T0 = 0; DUR = 9;
  for (const [x, z, r] of [[-9, 4, 7], [8, -6, 6], [3, 11, 5], [-4, -10, 5.5], [14, 6, 4]]) world.createCollider(RAPIER.ColliderDesc.ball(r).setTranslation(x, -r * 0.45, z).setFriction(0.8));
  for (let i = 0; i < N; i++) { const a = rnd() * 6.2832, r = 5.5 * Math.sqrt(rnd()), t = POUR * (i / N) + rnd() * 0.05;
    clips.push({ spawn: { pos: [Math.cos(a) * r + 2 * Math.sin(t * 1.3), 34 + rnd() * 6, Math.sin(a) * r + 2 * Math.cos(t * 0.9)], q: randomQuat(), linvel: [(rnd() - 0.5) * 3, -14 - rnd() * 6, (rnd() - 0.5) * 3], angvel: [(rnd() - 0.5) * 9, (rnd() - 0.5) * 9, (rnd() - 0.5) * 9] }, tAct: t, body: null }); }
  console.log(`堆：${N} 枚，倒 ${POUR} 秒`);
}

const N = clips.length, F = Math.round(DUR * FPS) + 1, raw = new Float32Array(F * N * 7), t00 = Date.now();
let maxAbs = 1;
for (let f = 0; f < F; f++) {
  if (f > 0) for (let s = 0; s < SUB; s++) {
    const t = (f - 1) / FPS + s / (FPS * SUB);
    for (const c of clips) {
      if (c.done || t < c.tAct) continue; c.done = true;
      if (scene === 'tower') { c.body.setBodyType(RAPIER.RigidBodyType.Dynamic, true);      // 松开：往外推一把、带一点旋转
        const k = 1.5 + 5 * rnd(); c.body.setLinvel({ x: c.n[0] * k + (rnd() - 0.5) * 3, y: (rnd() - 0.3) * 4, z: c.n[2] * k + (rnd() - 0.5) * 3 }, true); c.body.setAngvel({ x: (rnd() - 0.5) * 6, y: (rnd() - 0.5) * 6, z: (rnd() - 0.5) * 6 }, true); }
      else c.body = addClip(c.spawn.pos, c.spawn.q, c.spawn);
    }
    world.step();
  }
  for (let i = 0; i < N; i++) { const c = clips[i], o = (f * N + i) * 7;
    const p = c.body ? c.body.translation() : { x: c.spawn.pos[0], y: c.spawn.pos[1] + 120, z: c.spawn.pos[2] }, q = c.body ? c.body.rotation() : c.spawn.q;      // 还没倒出来的：停在画外高处
    raw[o] = p.x; raw[o + 1] = p.y; raw[o + 2] = p.z; raw[o + 3] = q.x; raw[o + 4] = q.y; raw[o + 5] = q.z; raw[o + 6] = q.w;
    maxAbs = Math.max(maxAbs, Math.abs(p.x), Math.abs(p.y), Math.abs(p.z)); }
  if (f % 30 === 0) { let awake = 0; for (const c of clips) if (c.body && !c.body.isSleeping() && c.body.isDynamic()) awake++; console.log(`  ${(f / FPS).toFixed(1)} s  醒着 ${awake} 枚  已用 ${((Date.now() - t00) / 1000).toFixed(1)} s`); }
}
const simSec = (Date.now() - t00) / 1000;
maxAbs = Math.min(maxAbs, 900); const posScale = maxAbs / 32000;
const head = 32, buf = new ArrayBuffer(head + N * 4 + F * N * 14), dv = new DataView(buf);
dv.setUint32(0, 0x504C4350, true); dv.setUint32(4, 1, true); dv.setUint32(8, N, true); dv.setUint32(12, F, true); dv.setFloat32(16, FPS, true); dv.setFloat32(20, posScale, true); dv.setFloat32(24, T0, true);
new Float32Array(buf, head, N).set(clips.map(c => c.tAct));
const i16 = new Int16Array(buf, head + N * 4, F * N * 7);
for (let k = 0; k < F * N; k++) { const o = k * 7; for (let j = 0; j < 3; j++) i16[o + j] = Math.round(clamp(raw[o + j] / posScale, -32767, 32767)); for (let j = 3; j < 7; j++) i16[o + j] = Math.round(raw[o + j] * 32767); }
const gz = gzipSync(Buffer.from(buf), { level: 9 });
mkdirSync(path.dirname(OUT), { recursive: true }); writeFileSync(OUT, gz);
console.log(`完成：${OUT}\n  ${N} 枚 × ${F} 帧（${DUR} s @ ${FPS}），模拟 ${simSec.toFixed(1)} s，原始 ${(buf.byteLength / 1e6).toFixed(1)} MB，gzip 后 ${(gz.length / 1e6).toFixed(1)} MB，posScale ${posScale.toFixed(5)}`);

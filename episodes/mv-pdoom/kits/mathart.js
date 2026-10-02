// kits/mathart.js — 数学图形库（W3，STORYBOARD-v4 第五节）。
//
// 每个工厂返回 { group|mesh, update(t, params) }，画面是 (t, params) 的纯函数，随机只用种子。
// 画法原则：几十上百条同族曲线、参数各差一点，叠在一起加色发光（线色是 >1 的线性 HDR，交给 bloom）。
// 三色霓虹取 engine/palette.js：pink / mint / lemon，墨黑底。
//
//   createBundle(opts)          通用曲线束：count 条、每条 samples 个点，fn(i, s, t, P, out) 给坐标
//   createRoses / createLissajous / createSpirograph / createLogSpirals   曲线束的几种
//   createTorusKnot({p,q})      环面纽结（多股绞成霓虹绳）+ point(u) / frame(u) 给蛇身沿路径用
//   createFourier({points})     傅里叶本轮：给一组闭合轮廓点 → 旋转圆链画出轮廓
//   createLossSurface()         高斯山谷叠加的损失曲面 + 梯度下降小球；height / grad / normal / descent 路径
//   createMandelbrot / createJulia / createDomainColoring   全屏平面着色器（fractal / 复变函数相位）
//   createAttractor({type})     Clifford / de Jong 奇异吸引子，GPU 上一百万点，参数漂移
//   createPhyllotaxis({n})      斐波那契叶序；phyllotaxisPoints(n) 可当粒子目标形
//   createMobius()              莫比乌斯带 + mobiusFrame(u, v)：表面坐标系（位置 / 前进方向 / 法线）
//   createLorenz()              洛伦兹吸引子：两条初值差 1e-5 的轨迹逐渐分岔
//   createHilbert({order})      希尔伯特曲线逐步点燃（引信）
//   createMenger()              门格海绵逐级挖空（level 0..3 连续）
//   createChladni()             克拉德尼驻波；chladniFromMusic(mv, t) 用频谱给 (n, m)
//   createWave2D()              二维波动方程（点源环形波叠加）LED 点阵；waveHeight / WAVE_GLSL 给高度场

import * as THREE from 'three';
import { PALETTE } from '../engine/palette.js';
import { mulberry32 } from './world.js';

export const NEON = [PALETTE.pink, PALETTE.mint, PALETTE.lemon];
const TAU = Math.PI * 2;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const col = c => new THREE.Color(c);
const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k);
const QUAD_VS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`;
const lineMat = () => new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
// 三色插值：u ∈ [0,1) 在 pink → mint → lemon → pink 上循环
const neonAt = (() => { const cs = NEON.map(col); const c = new THREE.Color(); return (u, out = c) => { u = ((u % 1) + 1) % 1; const k = u * 3, i = Math.floor(k), f = k - i; return out.copy(cs[i % 3]).lerp(cs[(i + 1) % 3], f); }; })();
export { neonAt };

// ================================================================ 通用曲线束
/**
 * count 条曲线，每条 samples 个点。fn(i, s, t, P, out) 把第 i 条、参数 s ∈ [0,1] 的点写进 out（Vector3）。
 * colorOf(i, s, t, P) → [r,g,b]（线性，可 >1）；默认按 i 在三色上排开。
 * P.reveal ∈ [0,1]：只画到 s ≤ reveal（逐步画出），头部更亮。P.gain 整体亮度。
 */
export function createBundle({ count = 40, samples = 400, closed = false, fn, colorOf = null, gain = 1.3, centerFade = 0 } = {}) {
  const segs = samples - (closed ? 0 : 1);
  const n = count * segs * 2;
  const pos = new Float32Array(n * 3), colr = new Float32Array(n * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('color', new THREE.BufferAttribute(colr, 3).setUsage(THREE.DynamicDrawUsage));
  const lines = new THREE.LineSegments(geo, lineMat());
  lines.frustumCulled = false;
  const pts = Array.from({ length: samples }, () => new THREE.Vector3());
  const c = new THREE.Color();
  function update(t, P = {}) {
    const reveal = P.reveal ?? 1, g = (P.gain ?? 1) * gain;
    let k = 0;
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < samples; j++) fn(i, j / (closed ? samples : samples - 1), t, P, pts[j]);
      const base = colorOf ? null : neonAt(i / count, c);
      for (let j = 0; j < segs; j++) {
        const a = pts[j], b = pts[(j + 1) % samples];
        const s = j / segs;
        let w = s <= reveal ? 1 : 0;
        if (centerFade > 0) w *= smooth(Math.hypot(a.x, a.y) / centerFade);   // 所有曲线都过圆心的族（玫瑰线）：中心压暗，不糊成白团
        if (reveal < 1 && w) w *= 0.45 + 0.55 * Math.exp(-(reveal - s) * 18);   // 笔头更亮
        let r, gg, bb;
        if (colorOf) [r, gg, bb] = colorOf(i, s, t, P); else { r = base.r; gg = base.g; bb = base.b; }
        r *= w * g; gg *= w * g; bb *= w * g;
        pos[k * 3] = a.x; pos[k * 3 + 1] = a.y; pos[k * 3 + 2] = a.z; colr[k * 3] = r; colr[k * 3 + 1] = gg; colr[k * 3 + 2] = bb; k++;
        pos[k * 3] = b.x; pos[k * 3 + 1] = b.y; pos[k * 3 + 2] = b.z; colr[k * 3] = r; colr[k * 3 + 1] = gg; colr[k * 3 + 2] = bb; k++;
      }
    }
    geo.attributes.position.needsUpdate = geo.attributes.color.needsUpdate = true;
  }
  return { lines, group: lines, update };
}

// ---------------------------------------------------------------- 玫瑰线叠加 r = cos(kθ)
/** update(t, { open=1（半径缩放）, spin=0.2, sweep=0.15（k 随时间的摆动量）, beat=0（拍点脉冲 0..1） }) */
export function createRoses({ count = 48, samples = 900, radius = 3, seed = 3 } = {}) {
  const rnd = mulberry32(seed);
  const K = Array.from({ length: count }, (_, i) => ({ n: 2 + (i % 7), d: 1 + Math.floor(i / 7) % 4, ph: rnd() * TAU, s: 0.72 + 0.28 * rnd() }));
  const b = createBundle({
    count, samples, closed: true, gain: 0.7, centerFade: radius * 0.45,
    fn(i, s, t, P, o) {
      const q = K[i];
      const k = q.n / q.d + (P.sweep ?? 0.15) * Math.sin(t * 0.7 + q.ph);
      const th = s * TAU * q.d;
      const r = radius * q.s * (P.open ?? 1) * (1 + 0.08 * (P.beat ?? 0)) * Math.cos(k * th);
      const a = th + t * (P.spin ?? 0.2) * (i % 2 ? 1 : -1) + q.ph;
      o.set(r * Math.cos(a), r * Math.sin(a), 0);
    },
  });
  return b;
}

// ---------------------------------------------------------------- 李萨如曲线：频率比可扫
/** update(t, { ratio=1（y 频率 / x 频率，可从 1 扫到 9/7）, spread=1, speed=0.6 }) */
export function createLissajous({ count = 20, samples = 700, size = 3.2 } = {}) {
  return createBundle({
    count, samples,
    fn(i, s, t, P, o) {
      const ratio = P.ratio ?? 1, sp = P.spread ?? 1;
      const th = s * TAU * 3;
      const d = (i / count) * Math.PI * sp + t * (P.speed ?? 0.6);
      o.set(size * 1.6 * Math.sin(th + d), size * Math.sin(ratio * th), (i / count - 0.5) * 0.6);
    },
  });
}

// ---------------------------------------------------------------- 万花尺：内摆线 / 外摆线叠加
/** update(t, { reveal=1（画到哪）, spin=0.1 }) */
export function createSpirograph({ count = 24, samples = 1400, R = 3, seed = 9 } = {}) {
  const rnd = mulberry32(seed);
  const fam = Array.from({ length: count }, (_, i) => {
    const epi = i % 3 === 2;
    const r = [0.6, 0.75, 1.2, 0.9, 0.45, 1.05][i % 6] * (0.95 + 0.1 * rnd());
    return { epi, r, d: r * lerp(0.6, 1.4, rnd()), turns: 12, ph: rnd() * TAU };
  });
  return createBundle({
    count, samples,
    fn(i, s, t, P, o) {
      const f = fam[i], th = s * TAU * f.turns;
      const Rr = f.epi ? R * 0.6 + f.r : R - f.r, k = Rr / f.r;
      const sc = f.epi ? 0.62 : 1;
      let x = Rr * Math.cos(th) + (f.epi ? -1 : 1) * f.d * Math.cos(k * th);
      let y = Rr * Math.sin(th) - f.d * Math.sin(k * th);
      const a = t * (P.spin ?? 0.1) * (i % 2 ? 1 : -1) + f.ph;
      o.set(sc * (x * Math.cos(a) - y * Math.sin(a)), sc * (x * Math.sin(a) + y * Math.cos(a)), 0);
    },
    gain: 0.5,
  });
}

// ---------------------------------------------------------------- 对数螺线汇聚
/** update(t, { flow=1（光段往中心流的速度）, arms 数由 count 定 }) */
export function createLogSpirals({ count = 64, samples = 500, a = 0.08, b = 0.2, turns = 5 } = {}) {
  return createBundle({
    count, samples,
    fn(i, s, t, P, o) {
      const th = s * TAU * turns;
      const r = a * Math.exp(b * th);
      const ph = (i / count) * TAU + t * 0.15;
      o.set(r * Math.cos(th + ph), r * Math.sin(th + ph), 0);
    },
    colorOf(i, s, t, P) {
      // 一段段光沿螺线往里流：亮度 = 周期脉冲
      const u = s * 6 + t * (P.flow ?? 1) * 1.2 + i * 0.13;
      const pulse = Math.pow(0.5 + 0.5 * Math.cos(u * TAU), 8);
      const c = neonAt(i / 64 + s * 0.3);
      const k = (0.08 + 1.6 * pulse) * (0.3 + 0.7 * s);
      return [c.r * k, c.g * k, c.b * k];
    },
  });
}

// ---------------------------------------------------------------- 环面纽结
/** update(t, { p, q（可小数，连续变形）, twist=3, spin=0.2 }) ；point(u,P)、frame(u,P) 给蛇身沿路径用 */
export function createTorusKnot({ strands = 14, samples = 900, R = 2.6, r = 1.0, rope = 0.16, p = 2, q = 3 } = {}) {
  const P0 = { p, q };
  const core = (u, P, o) => {
    const pp = P.p ?? P0.p, qq = P.q ?? P0.q, th = u * TAU;
    const rr = R + r * Math.cos(qq * th);
    return o.set(rr * Math.cos(pp * th), r * Math.sin(qq * th), rr * Math.sin(pp * th));
  };
  const a = new THREE.Vector3(), b = new THREE.Vector3(), T = new THREE.Vector3(), N = new THREE.Vector3(), B = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  function frame(u, P = {}) {
    core(u, P, a); core(u + 1e-3, P, b);
    T.subVectors(b, a).normalize();
    N.copy(up).addScaledVector(T, -up.dot(T)).normalize();
    B.crossVectors(T, N);
    return { pos: a.clone(), tangent: T.clone(), normal: N.clone(), binormal: B.clone() };
  }
  const bundle = createBundle({
    count: strands, samples, closed: true,
    fn(i, s, t, P, o) {
      core(s, P, a); core(s + 1e-3, P, b);
      T.subVectors(b, a).normalize();
      N.copy(up).addScaledVector(T, -up.dot(T)).normalize(); B.crossVectors(T, N);
      const ang = (i / strands) * TAU + s * TAU * (P.twist ?? 3) * 6 + t * 1.5;
      o.copy(a).addScaledVector(N, Math.cos(ang) * rope).addScaledVector(B, Math.sin(ang) * rope);
    },
    colorOf(i, s, t) { const c = neonAt(i / strands * 0.5 + s * 2 + t * 0.1); return [c.r, c.g, c.b]; },
    gain: 1.2,
  });
  function update(t, P = {}) { bundle.update(t, P); bundle.lines.rotation.y = t * (P.spin ?? 0.2); }
  return { lines: bundle.lines, group: bundle.lines, update, point: (u, P = {}) => core(u, P, new THREE.Vector3()), frame };
}

// ================================================================ 傅里叶本轮
// 闭合轮廓 → 按弧长重采样 N 点 → DFT → 按幅值从大到小取 terms 项；旋转圆链的笔尖画出轮廓
export function dancerSilhouette() {
  // 一个举手跳舞的剪影（手工轮廓，单位约 ±1）
  return [[0, 1.0], [0.1, 0.95], [0.12, 0.84], [0.2, 0.8], [0.42, 1.12], [0.5, 1.1], [0.3, 0.72], [0.18, 0.55], [0.2, 0.3], [0.32, 0.12],
    [0.5, -0.2], [0.55, -0.8], [0.62, -1.0], [0.46, -1.0], [0.38, -0.3], [0.12, -0.02], [0.02, -0.25], [-0.2, -0.75], [-0.18, -1.0], [-0.34, -1.0],
    [-0.32, -0.6], [-0.18, 0.05], [-0.18, 0.3], [-0.2, 0.55], [-0.4, 0.62], [-0.62, 0.4], [-0.7, 0.44], [-0.45, 0.78], [-0.2, 0.8], [-0.12, 0.84], [-0.1, 0.95]];
}
function resample(poly, N) {
  const L = [0]; for (let i = 1; i <= poly.length; i++) { const a = poly[i - 1], b = poly[i % poly.length]; L.push(L[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
  const out = []; let j = 0;
  for (let k = 0; k < N; k++) {
    const d = (k / N) * L[L.length - 1];
    while (L[j + 1] < d) j++;
    const a = poly[j], b = poly[(j + 1) % poly.length], u = (d - L[j]) / (L[j + 1] - L[j] || 1);
    out.push([lerp(a[0], b[0], u), lerp(a[1], b[1], u)]);
  }
  return out;
}
/** update(t, { p（0..1 画了一圈的多少）, scale=2.4 }) */
export function createFourier({ points = dancerSilhouette(), terms = 48, N = 256, scale = 2.4, circleSeg = 48 } = {}) {
  const z = resample(points, N);
  const coef = [];
  for (let n = -N / 2; n < N / 2; n++) {
    let re = 0, im = 0;
    for (let k = 0; k < N; k++) { const a = -TAU * n * k / N; re += z[k][0] * Math.cos(a) - z[k][1] * Math.sin(a); im += z[k][0] * Math.sin(a) + z[k][1] * Math.cos(a); }
    coef.push({ n, re: re / N, im: im / N, amp: Math.hypot(re, im) / N });
  }
  coef.sort((a, b) => b.amp - a.amp);
  const C = coef.slice(0, terms);
  const evalAt = (phi, upto = C.length) => { let x = 0, y = 0; for (let j = 0; j < upto; j++) { const c = C[j], a = c.n * phi; x += c.re * Math.cos(a) - c.im * Math.sin(a); y += c.re * Math.sin(a) + c.im * Math.cos(a); } return [x, y]; };
  const M = 600, full = Array.from({ length: M + 1 }, (_, i) => evalAt((i / M) * TAU));
  const group = new THREE.Group();
  // 圆 + 臂
  const cGeo = new THREE.BufferGeometry();
  const cPos = new Float32Array(terms * circleSeg * 6), cCol = new Float32Array(terms * circleSeg * 6);
  cGeo.setAttribute('position', new THREE.BufferAttribute(cPos, 3)); cGeo.setAttribute('color', new THREE.BufferAttribute(cCol, 3));
  const circles = new THREE.LineSegments(cGeo, lineMat()); circles.frustumCulled = false; group.add(circles);
  const aGeo = new THREE.BufferGeometry(); const aPos = new Float32Array(terms * 6);
  aGeo.setAttribute('position', new THREE.BufferAttribute(aPos, 3));
  const arms = new THREE.LineSegments(aGeo, new THREE.LineBasicMaterial({ color: hdr(PALETTE.paper, 0.9), transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, toneMapped: false })); arms.frustumCulled = false; group.add(arms);
  // 轨迹
  const tGeo = new THREE.BufferGeometry(); const tPos = new Float32Array((M + 1) * 3), tCol = new Float32Array((M + 1) * 3);
  full.forEach(([x, y], i) => { tPos[i * 3] = x * scale; tPos[i * 3 + 1] = y * scale; });
  tGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3)); tGeo.setAttribute('color', new THREE.BufferAttribute(tCol, 3));
  const trail = new THREE.Line(tGeo, lineMat()); trail.frustumCulled = false; group.add(trail);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), new THREE.MeshBasicMaterial({ color: hdr(PALETTE.lemon, 4), toneMapped: false })); group.add(tip);
  const cc = new THREE.Color();
  function update(t, P = {}) {
    const p = clamp(P.p ?? 1), phi = p * TAU;
    let x = 0, y = 0;
    for (let j = 0; j < terms; j++) {
      const c = C[j], r = c.amp * scale;
      neonAt(j / terms * 0.8, cc); const k = 1.6 * (1 - j / terms * 0.6);
      for (let s = 0; s < circleSeg; s++) {
        const a0 = s / circleSeg * TAU, a1 = (s + 1) / circleSeg * TAU, o = (j * circleSeg + s) * 6;
        cPos.set([x * scale + r * Math.cos(a0), y * scale + r * Math.sin(a0), 0, x * scale + r * Math.cos(a1), y * scale + r * Math.sin(a1), 0], o);
        cCol.set([cc.r * k, cc.g * k, cc.b * k, cc.r * k, cc.g * k, cc.b * k], o);
      }
      const a = c.n * phi, nx = x + c.re * Math.cos(a) - c.im * Math.sin(a), ny = y + c.re * Math.sin(a) + c.im * Math.cos(a);
      aPos.set([x * scale, y * scale, 0, nx * scale, ny * scale, 0], j * 6);
      x = nx; y = ny;
    }
    tip.position.set(x * scale, y * scale, 0.01);
    const head = p * M;
    for (let i = 0; i <= M; i++) { const on = i <= head ? 1 : 0; const k = on * (2.0 + 3.0 * Math.exp(-(head - i) / 25)); neonAt(0.55 + i / M * 0.25, cc); tCol.set([cc.r * k, cc.g * k, cc.b * k], i * 3); }
    for (const g of [cGeo, aGeo, tGeo]) for (const k in g.attributes) g.attributes[k].needsUpdate = true;
  }
  update(0, {});
  return { group, update, evalAt };
}

// ================================================================ 损失曲面 + 梯度下降
/**
 * f(x,z) = 碗 + 若干高斯山谷 / 山包；最深的谷在 (-2.4, -2.2)。descent 是从 start 出发的梯度下降路径（按弧长重采样）。
 * update(t, { p（小球沿路径走到哪 0..1）, contour=1 }) ；pathAt(u) → { pos, tangent, normal }（给滑道用）
 */
export function createLossSurface({ size = 10, seg = 180, heightScale = 1, start = [3.6, 3.4], lr = 0.06 } = {}) {
  const G = [[-2.4, -2.2, -2.4, 1.6], [1.4, -1.8, -1.2, 1.1], [-1.6, 2.0, -1.0, 1.0], [2.2, 1.4, 0.9, 0.9], [0.2, 0.3, 0.7, 0.8], [3.2, -3.4, 0.6, 1.0]];
  const f = (x, z) => { let h = 0.028 * (x * x + z * z); for (const [cx, cz, a, s] of G) h += a * Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / (s * s)); return h * heightScale; };
  const grad = (x, z) => { const e = 1e-3; return [(f(x + e, z) - f(x - e, z)) / (2 * e), (f(x, z + e) - f(x, z - e)) / (2 * e)]; };
  const normal = (x, z) => { const [gx, gz] = grad(x, z); return new THREE.Vector3(-gx, 1, -gz).normalize(); };
  // 梯度下降（带一点动量，路径更顺）→ 按弧长重采样 400 点
  const raw = []; let x = start[0], z = start[1], vx = 0, vz = 0;
  for (let i = 0; i < 900; i++) { raw.push([x, z]); const [gx, gz] = grad(x, z); vx = 0.82 * vx - lr * gx; vz = 0.82 * vz - lr * gz; x += vx; z += vz; if (Math.hypot(vx, vz) < 1e-4 && i > 50) break; }
  const L = [0]; for (let i = 1; i < raw.length; i++) L.push(L[i - 1] + Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1]));
  const NP = 400, path = [];
  for (let k = 0, j = 0; k < NP; k++) { const d = (k / (NP - 1)) * L[L.length - 1]; while (j < L.length - 2 && L[j + 1] < d) j++; const u = (d - L[j]) / (L[j + 1] - L[j] || 1); const px = lerp(raw[j][0], raw[j + 1][0], u), pz = lerp(raw[j][1], raw[j + 1][1], u); path.push(new THREE.Vector3(px, f(px, pz), pz)); }
  function pathAt(u) {
    const k = clamp(u) * (NP - 1), i = Math.min(NP - 2, Math.floor(k)), w = k - i;
    const pos = path[i].clone().lerp(path[i + 1], w);
    const tangent = path[i + 1].clone().sub(path[i]).normalize();
    return { pos, tangent, normal: normal(pos.x, pos.z) };
  }
  // 曲面
  const geo = new THREE.PlaneGeometry(size, size, seg, seg).rotateX(-Math.PI / 2);
  const P = geo.attributes.position;
  for (let i = 0; i < P.count; i++) P.setY(i, f(P.getX(i), P.getZ(i)));
  geo.computeVertexNormals();
  const uniforms = { uT: { value: 0 }, uContour: { value: 1 }, uPink: { value: col(PALETTE.pink) }, uMint: { value: col(PALETTE.mint) }, uLemon: { value: col(PALETTE.lemon) }, uHalf: { value: size / 2 } };
  const mat = new THREE.ShaderMaterial({
    uniforms, side: THREE.DoubleSide,
    vertexShader: `varying vec3 vW; varying vec3 vN; void main(){ vW = (modelMatrix*vec4(position,1.)).xyz; vN = normal; gl_Position = projectionMatrix*viewMatrix*vec4(vW,1.); }`,
    fragmentShader: /* glsl */`
      uniform float uT, uContour, uHalf; uniform vec3 uPink, uMint, uLemon; varying vec3 vW; varying vec3 vN;
      float gridLine(float v, float s){ float g = abs(fract(v/s - 0.5) - 0.5)*s; return 1.0 - smoothstep(0.0, fwidth(v)*1.2, g); }
      void main(){
        float h = vW.y;
        vec3 base = mix(vec3(0.02,0.02,0.035), vec3(0.06,0.03,0.08), smoothstep(-1.5, 1.5, h));
        float dif = 0.4 + 0.6*max(dot(normalize(vN), normalize(vec3(0.4,1.0,0.3))), 0.0);
        vec3 c = base * dif;
        // 等高线：低处薄荷、高处粉，每 0.15 一条
        float iso = gridLine(h, 0.15);
        vec3 ic = mix(uMint, uPink, smoothstep(-1.2, 1.0, h));
        c += ic * iso * 1.4 * uContour;
        // 淡网格
        c += uLemon * 0.12 * max(gridLine(vW.x, 0.5), gridLine(vW.z, 0.5));
        float fade = 1.0 - smoothstep(0.8, 1.0, max(abs(vW.x), abs(vW.z)) / uHalf);
        gl_FragColor = vec4(c * fade, 1.0);
      }`,
  });
  const group = new THREE.Group();
  const surf = new THREE.Mesh(geo, mat); group.add(surf);
  // 小球 + 拖尾
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 16), new THREE.MeshBasicMaterial({ color: hdr(PALETTE.lemon, 3), toneMapped: false })); group.add(ball);
  const tGeo = new THREE.BufferGeometry(); const tPos = new Float32Array(NP * 3), tCol = new Float32Array(NP * 3);
  path.forEach((v, i) => tPos.set([v.x, v.y + 0.03, v.z], i * 3));
  tGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3)); tGeo.setAttribute('color', new THREE.BufferAttribute(tCol, 3));
  const trail = new THREE.Line(tGeo, lineMat()); trail.frustumCulled = false; group.add(trail);
  const ly = hdr(PALETTE.lemon, 1);
  function update(t, P = {}) {
    const p = clamp(P.p ?? 0);
    uniforms.uT.value = t; uniforms.uContour.value = P.contour ?? 1;
    const { pos } = pathAt(p); ball.position.copy(pos).addScaledVector(normal(pos.x, pos.z), 0.12);
    const head = p * (NP - 1);
    for (let i = 0; i < NP; i++) { const k = i <= head ? 0.25 + 2.5 * Math.exp(-(head - i) / 18) : 0; tCol.set([ly.r * k, ly.g * k, ly.b * k], i * 3); }
    tGeo.attributes.color.needsUpdate = true;
  }
  update(0, {});
  return { group, update, height: f, grad, normal, path, pathAt, surface: surf };
}

// ================================================================ 分形 / 复变函数（全屏平面着色器）
const FRACTAL_HEAD = /* glsl */`
uniform vec3 uPink, uMint, uLemon; uniform float uT;
vec3 neon(float u){ u = fract(u); float k = u*3.0; if (k < 1.0) return mix(uPink, uMint, k); if (k < 2.0) return mix(uMint, uLemon, k - 1.0); return mix(uLemon, uPink, k - 2.0); }
`;
function fractalPlane({ width, height, frag, uniforms }) {
  const u = { uPink: { value: col(PALETTE.pink) }, uMint: { value: col(PALETTE.mint) }, uLemon: { value: col(PALETTE.lemon) }, uT: { value: 0 }, uAspect: { value: width / height }, ...uniforms };
  const mat = new THREE.ShaderMaterial({ uniforms: u, vertexShader: QUAD_VS, fragmentShader: FRACTAL_HEAD + frag });
  return { mesh: new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat), u };
}

/**
 * 曼德博集合，一路放大钻进去。update(t, { zoom（10 为底的对数：0 = 宽 3，4 = 宽 3e-4）, spin, cycle }) 。
 * 中心用两个 float 拼的「双精度」，float32 下能放大到约 1e-4 宽还清楚。
 */
export function createMandelbrot({ width = 16, height = 9, center = [-0.743643887037151, 0.131825904205330], iter = 360 } = {}) {
  const hi = center.map(v => Math.fround(v)), lo = center.map((v, i) => v - hi[i]);
  const { mesh, u } = fractalPlane({
    width, height,
    uniforms: { uCHi: { value: new THREE.Vector2(...hi) }, uCLo: { value: new THREE.Vector2(...lo) }, uScale: { value: 3 }, uSpin: { value: 0 }, uCycle: { value: 0 } },
    frag: /* glsl */`
      uniform vec2 uCHi, uCLo; uniform float uScale, uAspect, uSpin, uCycle; varying vec2 vUv;
      void main(){
        vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
        float cs = cos(uSpin), sn = sin(uSpin); p = mat2(cs, -sn, sn, cs) * p;
        vec2 d = uCLo + p * uScale;        // 小量先加
        vec2 c = uCHi + d;
        vec2 z = vec2(0.0); float n = 0.0; float m2 = 0.0;
        for (int i = 0; i < ${iter}; i++){
          z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
          m2 = dot(z, z);
          if (m2 > 256.0) break;
          n += 1.0;
        }
        vec3 col = vec3(0.0);
        if (n < ${iter}.0){
          float nu = n + 1.0 - log2(log2(m2) * 0.5);
          // 暗底上的霓虹等势线：亮度是 nu 的周期脉冲，越靠近集合边界（nu 越大）线越亮越密
          // 等势线按屏幕像素定宽（fwidth），远离边界的地方也是细线，不会糊成色块
          float v = nu * 0.35, w = max(fwidth(v), 1e-4);
          float line = 1.0 - smoothstep(w * 0.6, w * 2.2, abs(fract(v + 0.5) - 0.5));
          float near = smoothstep(4.0, 60.0, nu);
          col = neon(nu * 0.03 + uCycle) * (0.015 + 0.08 * near + line * (0.35 + 1.4 * near));
        } else col = vec3(0.01, 0.01, 0.02);
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  function update(t, P = {}) { u.uT.value = t; u.uScale.value = 3 * Math.pow(10, -(P.zoom ?? 0)); u.uSpin.value = P.spin ?? 0; u.uCycle.value = P.cycle ?? t * 0.05; }
  return { mesh, group: mesh, update };
}

/** 朱利亚集合：update(t, { c:[re,im] 或按 t 沿圆走, zoom=0, cycle }) */
export function createJulia({ width = 16, height = 9, iter = 220 } = {}) {
  const { mesh, u } = fractalPlane({
    width, height,
    uniforms: { uC: { value: new THREE.Vector2(-0.8, 0.156) }, uScale: { value: 3.2 }, uCycle: { value: 0 } },
    frag: /* glsl */`
      uniform vec2 uC; uniform float uScale, uAspect, uCycle; varying vec2 vUv;
      void main(){
        vec2 z = (vUv - 0.5) * vec2(uAspect, 1.0) * uScale;
        float n = 0.0, m2 = 0.0;
        for (int i = 0; i < ${iter}; i++){ z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + uC; m2 = dot(z,z); if (m2 > 256.0) break; n += 1.0; }
        vec3 col = vec3(0.01, 0.01, 0.02);
        if (n < ${iter}.0){ float nu = n + 1.0 - log2(log2(m2)*0.5); float v = nu*0.4, w = max(fwidth(v), 1e-4); float line = 1.0 - smoothstep(w*0.6, w*2.2, abs(fract(v + 0.5) - 0.5)); float near = smoothstep(3.0, 40.0, nu); col = neon(nu*0.045 + uCycle) * (0.01 + 0.1*near + line * (0.3 + 1.4*near)); }
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  function update(t, P = {}) {
    const c = P.c ?? [0.7885 * Math.cos(t * 0.35), 0.7885 * Math.sin(t * 0.35)];
    u.uT.value = t; u.uC.value.set(c[0], c[1]); u.uScale.value = 3.2 * Math.pow(10, -(P.zoom ?? 0)); u.uCycle.value = P.cycle ?? t * 0.04;
  }
  return { mesh, group: mesh, update };
}

/** 复变函数域着色 f(z) = (z²−a)(z−b)² / (z²+c)，相位 → 三色，|f| → 对数等高环。update(t, { beat=0 }) */
export function createDomainColoring({ width = 16, height = 9 } = {}) {
  const { mesh, u } = fractalPlane({
    width, height, uniforms: { uBeat: { value: 0 } },
    frag: /* glsl */`
      uniform float uAspect, uBeat; varying vec2 vUv;
      vec2 cm(vec2 a, vec2 b){ return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x); }
      vec2 cd(vec2 a, vec2 b){ return vec2(a.x*b.x + a.y*b.y, a.y*b.x - a.x*b.y) / dot(b,b); }
      void main(){
        vec2 z = (vUv - 0.5) * vec2(uAspect, 1.0) * 4.2;
        vec2 a = 1.2*vec2(cos(uT*0.6), sin(uT*0.6)), b = vec2(1.1*cos(uT*0.37+1.0), 0.9*sin(uT*0.5)), c = vec2(0.8, 0.9*sin(uT*0.41));
        vec2 f = cd(cm(cm(z,z) - a, cm(z - b, z - b)), cm(z,z) + c);
        float ph = atan(f.y, f.x) / 6.2831853 + 0.5;
        float lm = log(length(f) + 1e-6);
        // 暗底 + 霓虹细线：|f| 的对数等高环和相位辐条都按像素定宽，颜色由相位决定
        float v = lm * 1.2 - uT * 0.5, w = max(fwidth(v), 1e-4);
        float ring = 1.0 - smoothstep(w * 0.6, w * 2.2, abs(fract(v + 0.5) - 0.5));
        float q = ph * 12.0, wq = max(fwidth(q), 1e-4);
        float spoke = 1.0 - smoothstep(wq * 0.6, wq * 2.0, abs(fract(q + 0.5) - 0.5));
        vec3 col = neon(ph + uT*0.05) * (0.06 + 1.4 * ring + 0.5 * spoke);
        col *= 1.0 + 0.6 * uBeat;
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  function update(t, P = {}) { u.uT.value = t; u.uBeat.value = P.beat ?? 0; }
  return { mesh, group: mesh, update };
}

// ================================================================ 奇异吸引子（GPU 迭代）
/**
 * 每个点从一个种子位置出发，在顶点着色器里迭代 iters 步落到吸引子上 → 一百万点、每帧重算、参数可漂移。
 * update(t, { a, b, c, d（不给就按 t 漂移）, gain=1 })
 */
export function createAttractor({ type = 'clifford', count = 1_000_000, iters = 40, scale = 1.25, seed = 4 } = {}) {
  const rnd = mulberry32(seed);
  const seeds = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) { seeds[i * 3] = rnd() * 4 - 2; seeds[i * 3 + 1] = rnd() * 4 - 2; seeds[i * 3 + 2] = rnd(); }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(seeds, 3));
  const uniforms = { uP: { value: new THREE.Vector4() }, uGain: { value: 1 }, uScale: { value: scale }, uPink: { value: col(PALETTE.pink) }, uMint: { value: col(PALETTE.mint) }, uLemon: { value: col(PALETTE.lemon) } };
  const step = type === 'dejong'
    ? 'vec2(sin(P.x*q.y) - cos(P.y*q.x), sin(P.z*q.x) - cos(P.w*q.y))'
    : 'vec2(sin(P.x*q.y) + P.z*cos(P.x*q.x), sin(P.y*q.x) + P.w*cos(P.y*q.y))';
  const mat = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`
      uniform vec4 uP; uniform float uScale; uniform vec3 uPink, uMint, uLemon; varying vec3 vC;
      void main(){
        vec4 P = uP; vec2 q = position.xy, prev = q;
        for (int i = 0; i < ${iters}; i++){ prev = q; q = ${step}; }
        float v = clamp(length(q - prev) / 3.0, 0.0, 1.0);          // 步长 → 颜色
        vC = v < 0.5 ? mix(uMint, uPink, v*2.0) : mix(uPink, uLemon, v*2.0 - 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(q * uScale, (position.z - 0.5) * 0.3, 1.0);
        gl_PointSize = 1.0;
      }`,
    fragmentShader: `uniform float uGain; varying vec3 vC; void main(){ gl_FragColor = vec4(vC * 0.09 * uGain, 1.0); }`,
  });
  const points = new THREE.Points(geo, mat); points.frustumCulled = false;
  const base = type === 'dejong' ? [-2.24, 0.43, -0.65, -2.43] : [-1.4, 1.6, 1.0, 0.7];
  function update(t, P = {}) {
    const a = P.a ?? base[0] + 0.12 * Math.sin(t * 0.31), b = P.b ?? base[1] + 0.1 * Math.sin(t * 0.23 + 1),
      c = P.c ?? base[2] + 0.1 * Math.sin(t * 0.19 + 2), d = P.d ?? base[3] + 0.1 * Math.sin(t * 0.27 + 3);
    // clifford 的公式里 x 用 a、y 用 b（q.y / q.x 交换是为了一行写完两种）
    uniforms.uP.value.set(a, b, c, d); uniforms.uGain.value = P.gain ?? 1;
  }
  // clifford: x' = sin(a y) + c cos(a x), y' = sin(b x) + d cos(b y) → 上面 step 里 P=(a,b,c,d), q=(x,y) 写成 sin(P.x*q.y)+P.z*cos(P.x*q.x) ✓
  update(0, {});
  return { points, group: points, update };
}

// ================================================================ 斐波那契叶序
export const GOLDEN = Math.PI * (3 - Math.sqrt(5));
/** 叶序点（粒子目标形）：返回 Float32Array xyz，盘面在 xy 平面 */
export function phyllotaxisPoints(n, { radius = 2.5, z = 0 } = {}) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const r = radius * Math.sqrt((i + 0.5) / n), a = i * GOLDEN; out.set([r * Math.cos(a), r * Math.sin(a), z], i * 3); }
  return out;
}
/** update(t, { grow（0..1 已长出的比例）, spin=0.1 }) */
export function createPhyllotaxis({ n = 3000, radius = 3, size = 16 } = {}) {
  const pos = phyllotaxisPoints(n, { radius });
  const geo = new THREE.BufferGeometry();
  const idx = new Float32Array(n); for (let i = 0; i < n; i++) idx[i] = i / n;
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('aI', new THREE.BufferAttribute(idx, 1));
  const uniforms = { uGrow: { value: 1 }, uSize: { value: size }, uT: { value: 0 }, uPink: { value: col(PALETTE.pink) }, uMint: { value: col(PALETTE.mint) }, uLemon: { value: col(PALETTE.lemon) } };
  const mat = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`
      attribute float aI; uniform float uGrow, uSize, uT; uniform vec3 uPink, uMint, uLemon; varying vec3 vC; varying float vA;
      void main(){
        float on = smoothstep(uGrow, uGrow - 0.03, aI);
        float spiral = fract(aI * 21.0 * 13.0 / 34.0);         // 顺着 21 / 34 条斜列上色
        vC = spiral < 0.33 ? uPink : spiral < 0.66 ? uMint : uLemon;
        vA = on * (0.5 + 0.5 * sin(aI * 80.0 - uT * 3.0));
        vec4 mv = modelViewMatrix * vec4(position * (0.6 + 0.4*on), 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * (0.35 + 0.65 * aI) * on * (10.0 / -mv.z);
      }`,
    fragmentShader: `varying vec3 vC; varying float vA; void main(){ float r = length(gl_PointCoord - 0.5)*2.0; if (r > 1.0) discard; float a = smoothstep(1.0, 0.3, r); gl_FragColor = vec4(vC * a * (0.9 + 1.6*vA), a); }`,
  });
  const points = new THREE.Points(geo, mat); points.frustumCulled = false;
  function update(t, P = {}) { uniforms.uGrow.value = P.grow ?? 1; uniforms.uT.value = t; points.rotation.z = t * (P.spin ?? 0.1); }
  return { points, group: points, update, positions: pos };
}

// ================================================================ 莫比乌斯带
/** 表面坐标：u ∈ [0, 2π) 沿带子一圈，v ∈ [−1, 1] 横跨带宽。走一圈（u 加 2π）法线反向 = 上下颠倒。 */
export function mobiusPoint(u, v, { R = 2.4, w = 0.7 } = {}) {
  const h = v * w;
  return new THREE.Vector3((R + h * Math.cos(u / 2)) * Math.cos(u), h * Math.sin(u / 2), (R + h * Math.cos(u / 2)) * Math.sin(u));
}
export function mobiusFrame(u, v = 0, opts = {}) {
  const e = 1e-3;
  const p = mobiusPoint(u, v, opts);
  const du = mobiusPoint(u + e, v, opts).sub(mobiusPoint(u - e, v, opts)).normalize();
  const dv = mobiusPoint(u, v + e, opts).sub(mobiusPoint(u, v - e, opts)).normalize();
  const n = new THREE.Vector3().crossVectors(dv, du).normalize();
  return { pos: p, forward: du, side: dv, normal: n };
}
/** update(t, { glow=1, flow=1 }) ；网格线沿 u 方向流动 */
export function createMobius({ R = 2.4, w = 0.7, segU = 360, segV = 24 } = {}) {
  const pos = [], uv = [], idx = [];
  for (let i = 0; i <= segU; i++) for (let j = 0; j <= segV; j++) {
    const u = (i / segU) * TAU, v = (j / segV) * 2 - 1;
    const p = mobiusPoint(u, v, { R, w }); pos.push(p.x, p.y, p.z); uv.push(i / segU, j / segV);
  }
  for (let i = 0; i < segU; i++) for (let j = 0; j < segV; j++) { const a = i * (segV + 1) + j, b = a + segV + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
  const uniforms = { uT: { value: 0 }, uGlow: { value: 1 }, uFlow: { value: 1 }, uPink: { value: col(PALETTE.pink) }, uMint: { value: col(PALETTE.mint) }, uLemon: { value: col(PALETTE.lemon) } };
  const mat = new THREE.ShaderMaterial({
    uniforms, side: THREE.DoubleSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vV; void main(){ vUv = uv; vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalMatrix*normal; vV = -mv.xyz; gl_Position = projectionMatrix*mv; }`,
    fragmentShader: /* glsl */`
      uniform float uT, uGlow, uFlow; uniform vec3 uPink, uMint, uLemon; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){
        float gu = abs(fract(vUv.x * 60.0 - uT * uFlow) - 0.5), gv = abs(fract(vUv.y * 6.0) - 0.5);
        float lu = 1.0 - smoothstep(0.0, 0.06, gu), lv = 1.0 - smoothstep(0.0, 0.05, gv);
        float edge = 1.0 - smoothstep(0.0, 0.05, min(vUv.y, 1.0 - vUv.y));
        vec3 c = mix(uMint, uPink, vUv.x) * lu * 0.9 + uLemon * lv * 0.35 + uPink * edge * 1.8;
        float fres = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.0);
        c += mix(uMint, uPink, 0.5) * 0.08 + uMint * fres * 0.3;
        gl_FragColor = vec4(c * uGlow, 1.0);
      }`,
  });
  const mesh = new THREE.Mesh(geo, mat);
  function update(t, P = {}) { uniforms.uT.value = t; uniforms.uGlow.value = P.glow ?? 1; uniforms.uFlow.value = P.flow ?? 1; }
  return { mesh, group: mesh, update, frame: (u, v = 0) => mobiusFrame(u, v, { R, w }) };
}

// ================================================================ 洛伦兹吸引子：两条轨迹分岔
/** update(t, { p（0..1 沿轨迹走到哪）, tail=0.18（拖尾占全长比例） }) ；diverge 返回两条轨迹在 p 处的距离 */
export function createLorenz({ steps = 16000, dt = 0.005, eps = 1e-5, scale = 0.075 } = {}) {
  const sim = x0 => {
    const out = new Float32Array(steps * 3); let [x, y, z] = x0;
    const F = (x, y, z) => [10 * (y - x), x * (28 - z) - y, x * y - (8 / 3) * z];
    for (let i = 0; i < steps; i++) {
      out.set([x * scale, (z - 25) * scale, y * scale], i * 3);
      const k1 = F(x, y, z), k2 = F(x + k1[0] * dt / 2, y + k1[1] * dt / 2, z + k1[2] * dt / 2), k3 = F(x + k2[0] * dt / 2, y + k2[1] * dt / 2, z + k2[2] * dt / 2), k4 = F(x + k3[0] * dt, y + k3[1] * dt, z + k3[2] * dt);
      x += dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); y += dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]); z += dt / 6 * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);
    }
    return out;
  };
  const A = sim([1, 1, 1]), B = sim([1 + eps, 1, 1]);
  const group = new THREE.Group();
  const mk = (arr, c) => {
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    const cl = new Float32Array(steps * 3); geo.setAttribute('color', new THREE.BufferAttribute(cl, 3));
    const l = new THREE.Line(geo, lineMat()); l.frustumCulled = false; group.add(l);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8), new THREE.MeshBasicMaterial({ color: hdr(c, 4), toneMapped: false })); group.add(head);
    return { geo, cl, c: col(c), head, arr };
  };
  const L1 = mk(A, PALETTE.pink), L2 = mk(B, PALETTE.mint);
  function update(t, P = {}) {
    const head = Math.floor(clamp(P.p ?? 1) * (steps - 1)), tail = Math.floor((P.tail ?? 0.18) * steps);
    for (const L of [L1, L2]) {
      for (let i = 0; i < steps; i++) { const d = head - i; const k = d >= 0 && d < tail ? 0.15 + 1.8 * Math.pow(1 - d / tail, 2) : 0; L.cl[i * 3] = L.c.r * k; L.cl[i * 3 + 1] = L.c.g * k; L.cl[i * 3 + 2] = L.c.b * k; }
      L.geo.attributes.color.needsUpdate = true;
      L.geo.setDrawRange(0, head + 1);
      L.head.position.fromArray(L.arr, head * 3);
    }
  }
  const diverge = p => { const i = Math.floor(clamp(p) * (steps - 1)) * 3; return Math.hypot(A[i] - B[i], A[i + 1] - B[i + 1], A[i + 2] - B[i + 2]); };
  update(0, {});
  return { group, update, diverge };
}

// ================================================================ 希尔伯特曲线：逐步点燃
function hilbertD2xy(n, d) {
  let x = 0, y = 0, t = d;
  for (let s = 1; s < n; s *= 2) {
    const rx = 1 & (t / 2), ry = 1 & (t ^ rx);
    if (ry === 0) { if (rx === 1) { x = s - 1 - x; y = s - 1 - y; } [x, y] = [y, x]; }
    x += s * rx; y += s * ry; t = Math.floor(t / 4);
  }
  return [x, y];
}
/** update(t, { p（0..1 烧到哪）}) ：烧过的地方留暗红余烬，火头是一簇亮点 */
export function createHilbert({ order = 6, size = 6 } = {}) {
  const n = 1 << order, N = n * n;
  const pos = new Float32Array(N * 3), cl = new Float32Array(N * 3);
  for (let d = 0; d < N; d++) { const [x, y] = hilbertD2xy(n, d); pos.set([(x / (n - 1) - 0.5) * size, (y / (n - 1) - 0.5) * size, 0], d * 3); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(cl, 3));
  const line = new THREE.Line(geo, lineMat()); line.frustumCulled = false;
  const group = new THREE.Group(); group.add(line);
  const spark = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), new THREE.MeshBasicMaterial({ color: hdr(PALETTE.lemon, 5), toneMapped: false })); group.add(spark);
  const unburnt = hdr(PALETTE.mint, 0.12), ember = hdr(PALETTE.pink, 1.1), fire = hdr(PALETTE.lemon, 3.2);
  const c = new THREE.Color();
  function update(t, P = {}) {
    const head = clamp(P.p ?? 1) * (N - 1);
    for (let i = 0; i < N; i++) {
      const d = head - i;
      if (d < 0) c.copy(unburnt); else if (d < 40) c.copy(fire).lerp(ember, d / 40); else c.copy(ember).multiplyScalar(0.6 + 0.4 * Math.exp(-(d - 40) / 400));
      cl.set([c.r, c.g, c.b], i * 3);
    }
    geo.attributes.color.needsUpdate = true;
    spark.position.fromArray(pos, Math.floor(head) * 3);
    spark.scale.setScalar(1 + 0.4 * Math.sin(t * 40));
  }
  update(0, {});
  return { group, update, points: pos };
}

// ================================================================ 门格海绵：逐级挖空
/** update(t, { level（0..3 连续）, spin }) ；level 从 3 往 0 走就是「逐级反向填满」 */
export function createMenger({ size = 3, depth = 3 } = {}) {
  const n = 3 ** depth, cells = [];
  const removedAt = (i, j, k) => { for (let d = 1; d <= depth; d++) { const p = 3 ** (depth - d); const a = Math.floor(i / p) % 3, b = Math.floor(j / p) % 3, c = Math.floor(k / p) % 3; if ((a === 1) + (b === 1) + (c === 1) >= 2) return d; } return 99; };
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) cells.push({ i, j, k, r: removedAt(i, j, k) });
  const cs = size / n;
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const uniforms = { uPink: { value: col(PALETTE.pink) }, uMint: { value: col(PALETTE.mint) }, uLemon: { value: col(PALETTE.lemon) } };
  const aD = new Float32Array(cells.length); cells.forEach((c, i) => { aD[i] = (c.i + c.j + c.k) / (3 * n); });
  geo.setAttribute('aD', new THREE.InstancedBufferAttribute(aD, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `attribute float aD; varying vec2 vUv; varying vec3 vN; varying float vD; void main(){ vUv = uv; vN = normalize(mat3(modelMatrix*instanceMatrix)*normal); vD = aD; gl_Position = projectionMatrix*viewMatrix*modelMatrix*instanceMatrix*vec4(position,1.); }`,
    fragmentShader: /* glsl */`
      uniform vec3 uPink, uMint, uLemon; varying vec2 vUv; varying vec3 vN; varying float vD;
      void main(){
        float e = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
        float edge = 1.0 - smoothstep(0.03, 0.09, e);
        float dif = 0.35 + 0.65*max(dot(vN, normalize(vec3(0.5, 0.8, 0.4))), 0.0);
        vec3 ec = mix(uMint, uPink, vD); ec = mix(ec, uLemon, smoothstep(0.8, 1.0, vD));
        gl_FragColor = vec4(vec3(0.05, 0.045, 0.08) * dif + ec * edge * 1.5, 1.0);
      }`,
  });
  const mesh = new THREE.InstancedMesh(geo, mat, cells.length);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); mesh.frustumCulled = false;
  const m4 = new THREE.Matrix4();
  function update(t, P = {}) {
    const lv = clamp(P.level ?? depth, 0, depth), L = Math.floor(lv), f = lv - L;
    cells.forEach((c, idx) => {
      let s = 1;
      if (c.r <= L) s = 0;                     // 这一级之前已经挖掉
      else if (c.r === L + 1) s = 1 - smooth(f); // 正在挖的这一级：缩小消失
      if (s <= 0.001) { mesh.setMatrixAt(idx, m4.makeScale(0, 0, 0)); return; }
      m4.makeScale(cs * 0.94 * s, cs * 0.94 * s, cs * 0.94 * s).setPosition((c.i - (n - 1) / 2) * cs, (c.j - (n - 1) / 2) * cs, (c.k - (n - 1) / 2) * cs);
      mesh.setMatrixAt(idx, m4);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.rotation.set(0.5, t * (P.spin ?? 0.3), 0.2);
  }
  update(0, {});
  return { mesh, group: mesh, update };
}

// ================================================================ 克拉德尼驻波
/** update(t, { n, m（可小数）, sharp=40 }) ；chladniFromMusic(mv, T) → { n, m } 用低频 / 高频能量 */
export function createChladni({ width = 9, height = 9 } = {}) {
  const { mesh, u } = fractalPlane({
    width, height, uniforms: { uN: { value: 3 }, uM: { value: 5 }, uSharp: { value: 40 } },
    frag: /* glsl */`
      uniform float uN, uM, uSharp, uAspect; varying vec2 vUv;
      void main(){
        vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0) * 2.0;
        float PI = 3.14159265;
        float v = cos(uN*PI*p.x)*cos(uM*PI*p.y) - cos(uM*PI*p.x)*cos(uN*PI*p.y);
        float v2 = cos((uN+1.0)*PI*p.x)*cos((uM-1.0)*PI*p.y) - cos((uM-1.0)*PI*p.x)*cos((uN+1.0)*PI*p.y);
        float sand = exp(-abs(v) * uSharp);
        float ghost = exp(-abs(v2) * uSharp * 1.5) * 0.25;
        float r = length(p);
        vec3 col = neon(r * 0.25 + uT * 0.05) * sand * 1.8 + neon(r*0.25 + 0.5) * ghost;
        col *= 1.0 - smoothstep(0.95, 1.0, max(abs(p.x), abs(p.y)));
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  function update(t, P = {}) { u.uT.value = t; u.uN.value = P.n ?? 3 + Math.sin(t * 0.4); u.uM.value = P.m ?? 5 + Math.sin(t * 0.3); u.uSharp.value = P.sharp ?? 40; }
  return { mesh, group: mesh, update };
}
export function chladniFromMusic(mv, T) {
  // 频谱：低频推 n、高频推 m；用 0.3 s 窗口平均，纹样随音乐变但不抖
  const avg = k => { let s = 0; for (let i = 0; i < 6; i++) s += mv.music.energy(k, T - i * 0.05); return s / 6; };
  return { n: 2 + 4 * avg('low'), m: 3 + 6 * avg('high') + 2 * avg('vocal') };
}

// ================================================================ 二维波动方程（点源环形波叠加）
// 自由空间 2D 波动方程的点源脉冲解的近似：半径 c·τ 处的环形波包，身后留衰减的余振。纯函数，不用逐帧积分。
export const WAVE_GLSL = /* glsl */`
float waveHeight(vec2 p, float t, vec4 src[8]){        // src[i] = (x, z, t0, amp)
  float h = 0.0;
  for (int i = 0; i < 8; i++){
    vec4 s = src[i]; if (s.w == 0.0) continue;
    float tau = t - s.z; if (tau <= 0.0) continue;
    float r = length(p - s.xy), front = 4.0 * tau;
    float behind = front - r;
    if (behind < 0.0) continue;
    h += s.w * sin(behind * 2.2) * exp(-behind * 0.35) * exp(-tau * 0.25) / sqrt(1.0 + r * 0.6);
  }
  return h;
}`;
export function waveHeight(x, z, t, sources) {
  let h = 0;
  for (const [sx, sz, t0, amp] of sources) {
    const tau = t - t0; if (tau <= 0 || !amp) continue;
    const r = Math.hypot(x - sx, z - sz), behind = 4 * tau - r; if (behind < 0) continue;
    h += amp * Math.sin(behind * 2.2) * Math.exp(-behind * 0.35) * Math.exp(-tau * 0.25) / Math.sqrt(1 + r * 0.6);
  }
  return h;
}
/** LED 点阵：update(t, { sources: [[x, z, t0, amp], …]（最多 8 个）}) */
export function createWave2D({ n = 160, spacing = 0.1 } = {}) {
  const pos = new Float32Array(n * n * 3);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) pos.set([(i - (n - 1) / 2) * spacing, 0, (j - (n - 1) / 2) * spacing], (i * n + j) * 3);
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const src = Array.from({ length: 8 }, () => new THREE.Vector4());
  const uniforms = { uT: { value: 0 }, uSrc: { value: src }, uHalf: { value: n * spacing / 2 }, uPink: { value: col(PALETTE.pink) }, uMint: { value: col(PALETTE.mint) }, uLemon: { value: col(PALETTE.lemon) } };
  const mat = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`
      uniform float uT, uHalf; uniform vec4 uSrc[8]; uniform vec3 uPink, uMint, uLemon; varying vec3 vC;
      ${WAVE_GLSL}
      void main(){
        float h = waveHeight(position.xz, uT, uSrc);
        vec3 p = position + vec3(0.0, h * 0.35, 0.0);
        float k = clamp(abs(h), 0.0, 1.5);
        vC = (h > 0.0 ? mix(uMint, uLemon, clamp(h - 0.5, 0.0, 1.0)) : uPink) * (0.12 + 2.4 * k);
        vC *= 1.0 - smoothstep(0.8, 1.0, length(position.xz) / uHalf);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = 6.0 * (8.0 / -mv.z);
      }`,
    fragmentShader: `varying vec3 vC; void main(){ float r = length(gl_PointCoord - 0.5)*2.0; if (r > 1.0) discard; gl_FragColor = vec4(vC, 1.0); }`,
  });
  const points = new THREE.Points(geo, mat); points.frustumCulled = false;
  function update(t, P = {}) {
    uniforms.uT.value = t;
    const S = P.sources ?? [];
    for (let i = 0; i < 8; i++) { const s = S[i]; if (s) src[i].set(s[0], s[1], s[2], s[3]); else src[i].set(0, 0, 0, 0); }
  }
  return { points, group: points, update };
}

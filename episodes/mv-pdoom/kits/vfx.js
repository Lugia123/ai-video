// kits/vfx.js — 特效（W3）。
//
// 每个工厂返回 { group|mesh, update(t, params) }，画面是 (t, params) 的纯函数，随机只用种子 PRNG。
//
//   粒子重组
//     sampleMesh(mesh|geometry, n, seed)          网格表面按面积均匀采样 → Float32Array xyz（物体局部坐标，含 mesh 的变换）
//     await sampleText(text, n, { font, height, seed, depth })  字形采样 → Float32Array xyz（居中，高 = height）
//     sampleShape('sphere'|'ring'|'cloud', n, { radius, seed })
//     createParticles({ count, seed, size })      → { points, group, setShape(name, xyz), update(t, { from, to, p, burst, swirl, shimmer }) }
//         p 0..1 从 from 形变到 to（每粒有错开的延迟，中途向外鼓一下）；burst 0..∞ 沿各自方向爆散的距离
//   createFluid({ width, height })                → { mesh, update(t, { speed, bands, mix, zoom }) }  粉/薄荷迷幻流体（mix = 亮度，可压暗当背景）
//   createShatter({ width, height, cells, seed, texture, impact }) → { group, update(t, { crack, shatter }) }  沃罗诺伊碎裂
//   createShockwave({ color, radius })            → { mesh, update(t, { t0, dur } | { p }) }  冲击波环（平面朝 +z；放地上就转 -90°）
//   createDroste({ texture, width, scale })       → { mesh, update(t, { zoom, spin }) }  德罗斯特递归画中画（texture 一般是 RT）
//   createKaleido({ texture, width, segments })   → { mesh, update(t, { rotate, zoom, segments, offset }) }  万花筒镜像
//
// 配色：ink #0A0A10 / pink #FF2E88 / mint #5FE3C0 / lemon #F4E04D / paper #F2EDE4。

import * as THREE from 'three';
import { mulberry32, PAL } from './world.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const col = hex => new THREE.Color(hex);
const QUAD_VS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`;
const GLSL_HASH = /* glsl */`
float hash21(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash21(i), hash21(i+vec2(1,0)), u.x), mix(hash21(i+vec2(0,1)), hash21(i+vec2(1,1)), u.x), u.y); }
float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ s += a*vnoise(p); p = p*2.03 + 17.1; a *= 0.5; } return s; }
`;

// ================================================================ 采样
export function sampleMesh(obj, n, seed = 1) {
  const geo0 = obj.isMesh ? obj.geometry : obj;
  const geo = geo0.index ? geo0.toNonIndexed() : geo0;
  if (obj.isMesh) obj.updateMatrix();
  const P = geo.attributes.position.array;
  const tris = P.length / 9;
  const cum = new Float64Array(tris);
  let acc = 0;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  for (let i = 0; i < tris; i++) {
    a.fromArray(P, i * 9); b.fromArray(P, i * 9 + 3); c.fromArray(P, i * 9 + 6);
    acc += b.sub(a).cross(c.sub(a)).length() * 0.5;
    cum[i] = acc;
  }
  const rnd = mulberry32(seed);
  const out = new Float32Array(n * 3);
  const v = new THREE.Vector3();
  for (let k = 0; k < n; k++) {
    const r = rnd() * acc;
    let lo = 0, hi = tris - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < r) lo = m + 1; else hi = m; }
    let u = rnd(), w = rnd();
    if (u + w > 1) { u = 1 - u; w = 1 - w; }
    a.fromArray(P, lo * 9); b.fromArray(P, lo * 9 + 3); c.fromArray(P, lo * 9 + 6);
    v.copy(a).addScaledVector(b.sub(a), u).addScaledVector(c.sub(a), w);
    if (obj.isMesh) v.applyMatrix4(obj.matrix);
    v.toArray(out, k * 3);
  }
  return out;
}

const FONT_FILES = {
  Anton: 'anton/Anton-Regular.ttf', 'Bebas Neue': 'bebasneue/BebasNeue-Regular.ttf', Bungee: 'bungee/Bungee-Regular.ttf',
  'Share Tech Mono': 'sharetechmono/ShareTechMono-Regular.ttf', Caveat: 'caveat/Caveat-Variable.ttf',
};
const fontLoads = {};
export function loadFont(name) {
  if (!fontLoads[name]) {
    const file = FONT_FILES[name];
    fontLoads[name] = file
      ? new FontFace(name, `url(${new URL(`../../../assets/fonts/${file}`, import.meta.url)})`).load().then(f => { document.fonts.add(f); return f; })
      : Promise.resolve(null);
  }
  return fontLoads[name];
}

export async function sampleText(text, n, { font = 'Anton', height = 2, seed = 2, depth = 0.15 } = {}) {
  await loadFont(font);
  const px = 220;
  const cv = document.createElement('canvas');
  const g = cv.getContext('2d');
  g.font = `${px}px "${font}"`;
  const lines = String(text).split('\n');
  const w = Math.ceil(Math.max(...lines.map(l => g.measureText(l).width))) + 40;
  const lh = px * 1.05;
  cv.width = w; cv.height = Math.ceil(lh * lines.length + 40);
  g.font = `${px}px "${font}"`;
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
  lines.forEach((l, i) => g.fillText(l, w / 2, 20 + lh * (i + 0.5)));
  const img = g.getImageData(0, 0, cv.width, cv.height).data;
  const inside = [];
  for (let y = 0; y < cv.height; y += 2) for (let x = 0; x < cv.width; x += 2) if (img[(y * cv.width + x) * 4 + 3] > 128) inside.push(x, y);
  const rnd = mulberry32(seed);
  const out = new Float32Array(n * 3);
  const s = height / (lh * lines.length);
  for (let k = 0; k < n; k++) {
    const i = Math.floor(rnd() * (inside.length / 2)) * 2;
    out[k * 3] = (inside[i] + (rnd() - 0.5) * 2 - cv.width / 2) * s;
    out[k * 3 + 1] = -(inside[i + 1] + (rnd() - 0.5) * 2 - cv.height / 2) * s;
    out[k * 3 + 2] = (rnd() - 0.5) * depth;
  }
  return out;
}

export function sampleShape(kind, n, { radius = 2, seed = 3 } = {}) {
  const rnd = mulberry32(seed);
  const out = new Float32Array(n * 3);
  for (let k = 0; k < n; k++) {
    let x, y, z;
    if (kind === 'ring') {
      const a = rnd() * Math.PI * 2, r = radius * (1 + (rnd() - 0.5) * 0.08);
      x = Math.cos(a) * r; y = Math.sin(a) * r; z = (rnd() - 0.5) * 0.1;
    } else {
      const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2, s = Math.sqrt(1 - u * u);
      const r = kind === 'cloud' ? radius * Math.cbrt(rnd()) * 2.5 : radius;
      x = s * Math.cos(th) * r; y = u * r; z = s * Math.sin(th) * r;
    }
    out.set([x, y, z], k * 3);
  }
  return out;
}

// ================================================================ 粒子重组
export function createParticles({ count = 16000, seed = 1, size = 3.2, colors = [PAL.pink, PAL.mint, PAL.lemon, PAL.paper], weights = [0.35, 0.3, 0.15, 0.2] } = {}) {
  const rnd = mulberry32(seed);
  const geo = new THREE.BufferGeometry();
  const aRand = new Float32Array(count * 4), aDir = new Float32Array(count * 3), aCol = new Float32Array(count * 3);
  const cs = colors.map(col);
  for (let i = 0; i < count; i++) {
    aRand.set([rnd(), rnd(), rnd(), rnd()], i * 4);
    const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2, s = Math.sqrt(1 - u * u);
    aDir.set([s * Math.cos(th), u, s * Math.sin(th)], i * 3);
    let r = rnd(), k = 0;
    while (k < weights.length - 1 && r > weights[k]) { r -= weights[k]; k++; }
    aCol.set([cs[k].r, cs[k].g, cs[k].b], i * 3);
  }
  const zero = new Float32Array(count * 3);
  geo.setAttribute('position', new THREE.BufferAttribute(zero, 3));
  geo.setAttribute('aB', new THREE.BufferAttribute(zero, 3));
  geo.setAttribute('aRand', new THREE.BufferAttribute(aRand, 4));
  geo.setAttribute('aDir', new THREE.BufferAttribute(aDir, 3));
  geo.setAttribute('aCol', new THREE.BufferAttribute(aCol, 3));
  const uniforms = { uP: { value: 0 }, uBurst: { value: 0 }, uSwirl: { value: 0 }, uT: { value: 0 }, uSize: { value: size }, uShimmer: { value: 1 }, uBright: { value: 1.6 } };
  const mat = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`
      attribute vec3 aB; attribute vec4 aRand; attribute vec3 aDir; attribute vec3 aCol;
      uniform float uP, uBurst, uSwirl, uT, uSize, uShimmer;
      varying vec3 vC; varying float vA;
      float eio(float x){ return x < 0.5 ? 4.0*x*x*x : 1.0 - pow(-2.0*x + 2.0, 3.0)/2.0; }
      void main(){
        float d = aRand.x * 0.4;
        float q = clamp((uP - d) / 0.6, 0.0, 1.0);
        float e = eio(q);
        vec3 p = mix(position, aB, e);
        // 途中向外鼓：飞行弧线
        p += aDir * sin(3.14159 * e) * (0.6 + 1.6*aRand.y);
        // 爆散
        p += aDir * uBurst * (0.4 + 1.4*aRand.z) + vec3(0.0, -0.08, 0.0) * uBurst * uBurst * aRand.w;
        // 绕 y 轴卷
        float a = uSwirl * (0.5 + aRand.w) * (1.0 - abs(2.0*e - 1.0) * 0.0);
        p.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * p.xz;
        // 静止时微微呼吸
        p += aDir * 0.015 * sin(uT*3.0 + aRand.z*30.0) * uShimmer;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float moving = sin(3.14159 * e);
        gl_PointSize = uSize * (0.6 + 0.8*aRand.y) * (1.0 + moving*0.6) * (22.0 / max(-mv.z, 0.5));
        vC = aCol; vA = (0.55 + 0.45*moving) / (1.0 + uBurst*uBurst*0.35);   // 爆散时渐暗，不糊满屏
      }`,
    fragmentShader: /* glsl */`
      uniform float uBright; varying vec3 vC; varying float vA;
      void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d)*2.0; if (r > 1.0) discard;
        float a = smoothstep(1.0, 0.35, r); gl_FragColor = vec4(vC * a * vA * uBright, a); }`,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  const shapes = {};
  let cur = [null, null];
  function setShape(name, xyz) {
    const arr = new Float32Array(count * 3);
    const m = xyz.length / 3;
    for (let i = 0; i < count; i++) { const j = (i % m) * 3; arr[i * 3] = xyz[j]; arr[i * 3 + 1] = xyz[j + 1]; arr[i * 3 + 2] = xyz[j + 2]; }
    shapes[name] = { a: new THREE.BufferAttribute(arr, 3), b: new THREE.BufferAttribute(arr, 3) };
    cur = [null, null];
  }
  function update(t, { from, to, p = 0, burst = 0, swirl = 0, shimmer = 1, bright = 1.6 } = {}) {
    to ??= from;
    if (cur[0] !== from || cur[1] !== to) {
      geo.setAttribute('position', shapes[from].a);
      geo.setAttribute('aB', shapes[to].b);
      cur = [from, to];
    }
    uniforms.uP.value = p; uniforms.uBurst.value = burst; uniforms.uSwirl.value = swirl; uniforms.uT.value = t;
    uniforms.uShimmer.value = shimmer; uniforms.uBright.value = bright;
  }
  return { points, group: points, setShape, update, shapes };
}

// ================================================================ 流体
export function createFluid({ width = 16, height = 9 } = {}) {
  const uniforms = {
    uT: { value: 0 }, uSpeed: { value: 1 }, uBands: { value: 5 }, uMix: { value: 0.5 }, uZoom: { value: 1 }, uAspect: { value: width / height },
    uPink: { value: col(PAL.pink) }, uMint: { value: col(PAL.mint) }, uLemon: { value: col(PAL.lemon) }, uInk: { value: col(PAL.ink) }, uPaper: { value: col(PAL.paper) },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms, vertexShader: QUAD_VS,
    fragmentShader: /* glsl */`
      ${GLSL_HASH}
      uniform float uT, uSpeed, uBands, uMix, uZoom, uAspect; uniform vec3 uPink, uMint, uLemon, uInk, uPaper; varying vec2 vUv;
      void main(){
        vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0) * 2.4 / uZoom;
        float t = uT * 0.18 * uSpeed;
        // 两层域扭曲（IQ）
        vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t*0.7));
        vec2 r = vec2(fbm(p + 3.5*q + vec2(1.7, 9.2) + t*1.1), fbm(p + 3.5*q + vec2(8.3, 2.8) - t*0.9));
        float f = fbm(p + 3.0*r);
        // 色带：液体灯般的等高线
        float b = f * uBands + length(q) * 1.5;
        float s = 0.5 + 0.5 * sin(b * 6.2831);
        float band = smoothstep(0.42, 0.58, s);
        vec3 a = mix(uPink, uMint, smoothstep(0.47, 0.53, r.x));
        vec3 c = mix(uInk * 1.5, a, band);
        // 等高线边上一道柠黄亮线
        float edge = 1.0 - smoothstep(0.0, 0.07, abs(s - 0.5));
        c += uLemon * edge * 0.55 * smoothstep(0.4, 0.8, q.y);
        c *= uMix;
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
  function update(t, { speed = 1, bands = 5, mix = 1, zoom = 1 } = {}) {
    uniforms.uT.value = t; uniforms.uSpeed.value = speed; uniforms.uBands.value = bands; uniforms.uMix.value = mix; uniforms.uZoom.value = zoom;
  }
  return { mesh, group: mesh, update };
}

// ================================================================ 沃罗诺伊碎裂
function clipPoly(poly, nx, ny, c) { // 保留 nx*x + ny*y <= c 的一侧
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const [ax, ay] = poly[i], [bx, by] = poly[(i + 1) % poly.length];
    const da = nx * ax + ny * ay - c, db = nx * bx + ny * by - c;
    if (da <= 0) out.push([ax, ay]);
    if ((da < 0) !== (db < 0) && da !== db) { const u = da / (da - db); out.push([ax + (bx - ax) * u, ay + (by - ay) * u]); }
  }
  return out;
}

/**
 * opts: width=8, height=4.5, cells=48, seed=9, texture（贴在正面的图，没有就纯色）, impact=[x,y]（局部坐标）, thickness=0.12
 * update(t, { crack, shatter })
 *   crack   0..1 裂纹从撞击点向外爬（亮线）
 *   shatter 0..∞ 碎片飞散的「秒数」：0 = 还是整块，1 ≈ 飞出去一米多并翻转；调用方一般传 (t - tHit)
 */
export function createShatter({ width = 8, height = 4.5, cells = 48, seed = 9, texture = null, impact = [0.6, 0.2], thickness = 0.12, color = PAL.lemon } = {}) {
  const rnd = mulberry32(seed);
  const W = width / 2, H = height / 2;
  const sites = [];
  for (let i = 0; i < cells; i++) {
    // 越靠近撞击点越密
    const a = rnd() * Math.PI * 2, r = Math.pow(rnd(), 1.7) * Math.hypot(W, H) * 1.1;
    let x = impact[0] + Math.cos(a) * r, y = impact[1] + Math.sin(a) * r * 0.8;
    if (Math.abs(x) > W || Math.abs(y) > H) { x = (rnd() * 2 - 1) * W; y = (rnd() * 2 - 1) * H; }
    sites.push([x, y]);
  }
  const group = new THREE.Group();
  const mat = new THREE.ShaderMaterial({
    uniforms: { uMap: { value: texture }, uHasMap: { value: texture ? 1 : 0 }, uColor: { value: col(color) }, uEdge: { value: col(PAL.pink) } },
    vertexShader: `varying vec2 vUv; varying vec3 vN; void main(){ vUv = uv; vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `uniform sampler2D uMap; uniform float uHasMap; uniform vec3 uColor, uEdge; varying vec2 vUv; varying vec3 vN;
      void main(){ vec3 face = uHasMap > 0.5 ? texture2D(uMap, vUv).rgb : uColor;
        float front = step(0.6, abs(vN.z));
        vec3 c = mix(uEdge * 1.8, face * (0.85 + 0.15*vN.z), front);
        gl_FragColor = vec4(c, 1.0); }`,
  });
  const shards = [];
  const crackSegs = [];
  for (let i = 0; i < cells; i++) {
    let poly = [[-W, -H], [W, -H], [W, H], [-W, H]];
    const [sx, sy] = sites[i];
    for (let j = 0; j < cells && poly.length; j++) {
      if (j === i) continue;
      const [ox, oy] = sites[j];
      const nx = ox - sx, ny = oy - sy;
      poly = clipPoly(poly, nx, ny, (nx * (ox + sx) + ny * (oy + sy)) / 2);
    }
    if (poly.length < 3) continue;
    let cx = 0, cy = 0;
    poly.forEach(([x, y]) => { cx += x; cy += y; });
    cx /= poly.length; cy /= poly.length;
    const shape = new THREE.Shape(poly.map(([x, y]) => new THREE.Vector2(x - cx, y - cy)));
    const g = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
    g.translate(0, 0, -thickness / 2);
    const P = g.attributes.position.array, uv = g.attributes.uv.array;
    for (let k = 0; k < P.length / 3; k++) { uv[k * 2] = (P[k * 3] + cx + W) / width; uv[k * 2 + 1] = (P[k * 3 + 1] + cy + H) / height; }
    const m = new THREE.Mesh(g, mat);
    m.position.set(cx, cy, 0);
    group.add(m);
    const dx = cx - impact[0], dy = cy - impact[1], dist = Math.hypot(dx, dy);
    shards.push({ m, cx, cy, dir: new THREE.Vector3(dx / (dist + 1e-3), dy / (dist + 1e-3), 0), dist,
      axis: new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(), spin: lerp(1.5, 5, rnd()), v: lerp(0.6, 1.6, rnd()), vz: lerp(0.8, 2.2, rnd()) });
    for (let k = 0; k < poly.length; k++) {
      const a = poly[k], b = poly[(k + 1) % poly.length];
      const onBorder = (Math.abs(a[0]) > W - 1e-4 && Math.abs(b[0]) > W - 1e-4 && Math.sign(a[0]) === Math.sign(b[0])) || (Math.abs(a[1]) > H - 1e-4 && Math.abs(b[1]) > H - 1e-4 && Math.sign(a[1]) === Math.sign(b[1]));
      if (!onBorder) crackSegs.push(a, b);
    }
  }
  const maxD = Math.max(...shards.map(s => s.dist), 1);
  // 裂纹线：每段按离撞击点的距离依次长出来
  const segN = crackSegs.length / 2;
  const cPos = new Float32Array(segN * 6), cCol = new Float32Array(segN * 6);
  const cGeo = new THREE.BufferGeometry();
  cGeo.setAttribute('position', new THREE.BufferAttribute(cPos, 3));
  cGeo.setAttribute('color', new THREE.BufferAttribute(cCol, 3));
  const cracks = new THREE.LineSegments(cGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthTest: false }));
  cracks.renderOrder = 4;
  cracks.frustumCulled = false;
  group.add(cracks);
  const segInfo = [];
  for (let k = 0; k < segN; k++) {
    const a = crackSegs[k * 2], b = crackSegs[k * 2 + 1];
    const da = Math.hypot(a[0] - impact[0], a[1] - impact[1]), db = Math.hypot(b[0] - impact[0], b[1] - impact[1]);
    const [n0, n1] = da <= db ? [a, b] : [b, a];
    segInfo.push({ n0, n1, d0: Math.min(da, db), d1: Math.max(da, db) });
  }
  const maxC = Math.max(...segInfo.map(s => s.d1), 1);
  const q = new THREE.Quaternion();

  function update(t, { crack = 0, shatter = 0 } = {}) {
    const front = crack * maxC * 1.05;
    for (let k = 0; k < segN; k++) {
      const s = segInfo[k];
      const p = clamp((front - s.d0) / Math.max(1e-3, s.d1 - s.d0));
      const x = lerp(s.n0[0], s.n1[0], p), y = lerp(s.n0[1], s.n1[1], p);
      cPos.set([s.n0[0], s.n0[1], thickness / 2 + 0.01, x, y, thickness / 2 + 0.01], k * 6);
      const hot = p > 0 ? 1.8 * (1 - clamp(shatter * 3)) : 0;
      cCol.set([hot, hot, hot, hot, hot, hot], k * 6);
    }
    cGeo.attributes.position.needsUpdate = cGeo.attributes.color.needsUpdate = true;
    cracks.visible = shatter < 0.34;
    for (const s of shards) {
      const tt = Math.max(0, shatter - (s.dist / maxD) * 0.12);
      s.m.position.set(s.cx + s.dir.x * s.v * tt * 1.3, s.cy + s.dir.y * s.v * tt * 1.3 - 1.1 * tt * tt, s.vz * tt * 0.45 - tt * tt * 0.3);
      q.setFromAxisAngle(s.axis, s.spin * tt * 0.7);
      s.m.quaternion.copy(q);
    }
  }
  update(0, {});
  return { group, update };
}

// ================================================================ 冲击波
export function createShockwave({ color = PAL.paper, accent = PAL.pink, radius = 6 } = {}) {
  const uniforms = { uP: { value: 0 }, uC: { value: col(color) }, uA: { value: col(accent) } };
  const mat = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    vertexShader: QUAD_VS,
    fragmentShader: /* glsl */`
      uniform float uP; uniform vec3 uC, uA; varying vec2 vUv;
      void main(){
        vec2 p = vUv*2.0 - 1.0; float r = length(p);
        float e = 1.0 - pow(1.0 - uP, 3.0);
        float R = e * 0.95;
        float w = mix(0.03, 0.006, uP);
        float ring = exp(-pow((r - R)/w, 2.0));
        float trail = smoothstep(R - 0.18, R, r) * step(r, R) * 0.12;        // 身后一层薄雾
        float ring2 = exp(-pow((r - R*0.72)/(w*0.5), 2.0)) * 0.5;             // 第二圈细环
        float fade = 1.0 - smoothstep(0.55, 1.0, uP);
        vec3 c = uC * ring * 1.6 + uA * (ring2 * 1.6 + trail);
        float a = (ring + ring2 + trail) * fade * step(0.0001, uP) * step(uP, 0.9999);
        gl_FragColor = vec4(c * a, a);
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2, radius * 2), mat);
  mesh.renderOrder = 6;
  function update(t, { t0 = 0, dur = 1.2, p } = {}) {
    uniforms.uP.value = clamp(p ?? (t - t0) / dur);
    mesh.visible = uniforms.uP.value > 0 && uniforms.uP.value < 1;
  }
  return { mesh, group: mesh, update };
}

// ================================================================ 德罗斯特递归
/**
 * texture 是内容（一般是 RenderTarget.texture：把她/场景渲进去）。画面中心有一个缩小 scale 倍的相框，框里是整个画面本身，无限递归。
 * update(t, { zoom, spin })  zoom 每 +1 放大一层（无缝循环），spin 每层相对旋转的弧度
 */
export function createDroste({ texture, width = 16, height = 9, scale = 0.58, frame = PAL.pink } = {}) {
  const uniforms = { uTex: { value: texture }, uZoom: { value: 0 }, uSpin: { value: 0 }, uS: { value: scale }, uAspect: { value: width / height }, uFrame: { value: col(frame) }, uInk: { value: col(PAL.ink) } };
  const mat = new THREE.ShaderMaterial({
    uniforms, vertexShader: QUAD_VS,
    fragmentShader: /* glsl */`
      uniform sampler2D uTex; uniform float uZoom, uSpin, uS, uAspect; uniform vec3 uFrame, uInk; varying vec2 vUv;
      mat2 rot(float a){ return mat2(cos(a), -sin(a), sin(a), cos(a)); }
      void main(){
        vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
        float f = fract(uZoom);
        p *= pow(uS, f);                       // 放大：往框里钻
        p = rot(-uSpin * f) * p;
        vec2 hb = 0.5 * vec2(uAspect, 1.0);    // 整幅画的半宽高
        vec3 c = vec3(0.0); float found = 0.0;
        for (int i = 0; i < 12; i++){
          vec2 inner = hb * uS;
          float border = 0.011;
          vec2 ap = abs(p);
          if (ap.x < inner.x && ap.y < inner.y){ p = rot(uSpin) * p / uS; continue; }  // 在相框里：进下一层
          if (ap.x < inner.x + border && ap.y < inner.y + border){ c = uFrame * 1.1; found = 1.0; break; }
          // 相框投下的影子
          vec2 sh = ap - inner - vec2(border);
          float shadow = 1.0 - 0.55 * exp(-max(max(sh.x, sh.y), 0.0) * 30.0);
          c = texture2D(uTex, p / vec2(uAspect, 1.0) + 0.5).rgb * shadow; found = 1.0; break;
        }
        gl_FragColor = vec4(found > 0.5 ? c : uInk, 1.0);
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
  function update(t, { zoom = 0, spin = 0, texture: tex } = {}) {
    uniforms.uZoom.value = zoom; uniforms.uSpin.value = spin;
    if (tex) uniforms.uTex.value = tex;
  }
  return { mesh, group: mesh, update };
}

// ================================================================ 万花筒
export function createKaleido({ texture, width = 16, height = 9, segments = 8 } = {}) {
  const uniforms = { uTex: { value: texture }, uRot: { value: 0 }, uZoom: { value: 1 }, uSeg: { value: segments }, uOff: { value: new THREE.Vector2() }, uAspect: { value: width / height }, uSeam: { value: 0.2 }, uMint: { value: col(PAL.mint) } };
  const mat = new THREE.ShaderMaterial({
    uniforms, vertexShader: QUAD_VS,
    fragmentShader: /* glsl */`
      uniform sampler2D uTex; uniform float uRot, uZoom, uSeg, uAspect, uSeam; uniform vec2 uOff; uniform vec3 uMint; varying vec2 vUv;
      void main(){
        vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
        float r = length(p), a = atan(p.y, p.x) + uRot;
        float w = 6.2831853 / uSeg;
        float k = mod(a, w);
        k = abs(k - w*0.5);                          // 镜像折叠
        vec2 q = r / uZoom * vec2(cos(k), sin(k)) + uOff;
        vec2 uv = q / vec2(uAspect, 1.0) + 0.5;
        uv = abs(mod(uv - 1.0, 2.0) - 1.0);            // 出界就镜面折回
        vec3 c = texture2D(uTex, uv).rgb;
        // 镜缝：很淡的一道薄荷光
        float seam = 1.0 - smoothstep(0.0, 0.004 / max(r, 0.05), abs(k - w*0.5));
        c += uMint * seam * uSeam * smoothstep(0.02, 0.2, r) * (1.0 - smoothstep(0.35, 0.6, r));
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
  function update(t, { rotate = 0, zoom = 1, segments: sg, offset = [0, 0], seam = 0.2, texture: tex } = {}) {
    uniforms.uRot.value = rotate; uniforms.uZoom.value = zoom; uniforms.uOff.value.set(offset[0], offset[1]); uniforms.uSeam.value = seam;
    if (sg) uniforms.uSeg.value = sg;
    if (tex) uniforms.uTex.value = tex;
  }
  return { mesh, group: mesh, update };
}

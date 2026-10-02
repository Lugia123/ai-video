// kits/girl.js —— 女主角 3D 套件：Tripo GLB（Mixamo 骨架）+ dance3d 按拍跳舞 + 6 种渲染皮肤 + 皮肤间过渡 + 万花筒镜像。
//
//   import { createGirl, kaleido, createGirlLights } from '../kits/girl.js';
//   const girl = await createGirl(mv);                 // 身高 1.0（世界单位），脚底在 root 原点，面朝 +Z
//   scene.add(girl.root, createGirlLights());          // toon / voxel 需要灯；chrome / hologram / blueprint / points 不吃灯
//   每帧（顺序固定：先摆 root → dance → 皮肤）：
//     girl.root.position.set(...)
//     girl.dance(choreo | entries | 'moveName', T)     // 或 girl.pose('lookUp')
//     girl.setSkin('toon', T)                          // 或 girl.morph('toon', 'voxel', p, T)
//
// 皮肤：toon（卡通 + 描边）· blueprint（等高 / 截面线 + 轮廓线 + 粉色描点，可 draw 逐行画出）· points（表面采样粒子）
//        · voxel（按当前姿势实时体素化）· chrome（液态金属，反射代码生成的霓虹环境）· hologram（扫描线 + 菲涅尔 + 故障）
// setSkin(name, T, opts)：opts.draw（blueprint 从脚到头画出 0..1）、opts.glitch（hologram 故障 0..1）、opts.size（points 粒径倍数）
// morph(from, to, p, T)：任意两种皮肤之间。统一路线：旧皮肤按噪声场溶解（边缘发粉光）→ 溶解处冒出粒子 → 粒子散开
//        → 聚拢 → 新皮肤从粒子里长出。带 voxel / points 的过渡散得更开，→voxel 时粒子聚到各自的体素格中心，方块再逐个弹出。
//        p 的分段：0–0.3 旧皮肤溶解 · 0.3–0.4 纯粒子 · 0.4–0.75 散开再聚拢 · 0.75–1 新皮肤长出。
// kaleido(girl, { copies = 8, center: 'feet'|'chest'|'head'|Vector3 }) → { group, update(T, { camera, center, radius }) }：
//        绕「相机 → center」轴旋转复制，奇数份镜像（真万花筒）。克隆共享骨架和材质，跟本体同步跳、同步换皮肤。
// 共享：一个 girl 可以跨镜头用 —— 镜头 update 里 scene.add(girl.root) 把它挪进自己的场景即可。
// 动捕（#925）：await loadAnims([...]) 后 girl.play(seq, T) 按名字播 Mixamo 片段（按拍对齐、交叉淡入）；参数在 anim/mixamo/index.json。
// 队形：createFormation（整列卡农）/ mirrorRoom（镜面房间）。kaleido 保留但别再用（用户反馈「叠成一圈」看不懂）。
//
// 全部是 T 的纯函数：舞蹈 = dance3d（纯函数），粒子 / 体素由当帧骨骼 CPU 蒙皮算出，随机只用种子。

import * as THREE from 'three';
import { GLTFLoader } from '../../../assets/vendor/three/examples/jsm/loaders/GLTFLoader.js';
import { createDancer, createChoreo, beatClock, toonify, addShaderPatch, normalizeSpecExport, MOVES, mixamoMove } from '../../../assets/lib/dance3d.js';
import { mulberry32, lipsync, blinks } from '../../../assets/lib/layer-rig.js';
import { PALETTE } from '../engine/palette.js';

// 默认模型：Tripo 4K 贴图版（52 根骨骼，没有指尖 / 趾尖末端骨）；旧版（2K、65 根）留作兜底
export const GIRL_4K_URL = new URL('../../cast-cyber-girl/3d/tripo-girl-4k/anime girl 3d model.glb', import.meta.url);
export const GIRL_URL = new URL('../../cast-cyber-girl/3d/tripo-girl/anime+girl+3d+model.glb', import.meta.url);
// 脸部换成 2D 立绘投影烘焙后的版本（tools/face-bake/bake.mjs 生成，原 glb 不动）；createGirl 默认用它，找不到就退回原版
export const GIRL_BAKED_URL = new URL('../../cast-cyber-girl/3d/tripo-girl/anime+girl+3d+model.facebake.glb', import.meta.url);
export const SKINS = ['toon', 'blueprint', 'points', 'voxel', 'chrome', 'hologram'];
const MESH_SKINS = new Set(['toon', 'blueprint', 'chrome', 'hologram']);

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const seg = (p, a, b) => smooth((p - a) / (b - a));

// ---------------------------------------------------------------- 值噪声（溶解场，JS 端算好当顶点属性，GPU / 粒子两边完全一致）
function hash3(x, y, z) {
  let h = (x * 374761393 + y * 668265263 + z * 1274126177) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const L = (a, b, t) => a + (b - a) * t;
  const c = (i, j, k) => hash3(xi + i, yi + j, zi + k);
  return L(L(L(c(0, 0, 0), c(1, 0, 0), u), L(c(0, 1, 0), c(1, 1, 0), u), v), L(L(c(0, 0, 1), c(1, 0, 1), u), L(c(0, 1, 1), c(1, 1, 1), u), v), w);
}
const disField = (x, y, z) => 0.02 + 0.96 * clamp(0.42 * y + 0.58 * (0.6 * vnoise(x * 11, y * 11, z * 11) + 0.4 * vnoise(x * 29 + 7, y * 29, z * 29)) - 0.05, 0, 1);

// ---------------------------------------------------------------- 材质补丁：溶解（所有网格皮肤共用一组 uniform）
function dissolvePatch(U, { emissive = true } = {}) {
  return {
    key: 'girl-dissolve' + (emissive ? '' : '-ne'),
    uniforms: { uDissolve: U.dissolve, uEdge: U.edge },
    head: 'attribute float aDis;\nvarying float vDis;\n',
    vertex: [['#include <begin_vertex>', 'vDis = aDis;']],
    fhead: 'uniform float uDissolve;\nuniform vec3 uEdge;\nvarying float vDis;\n',
    fragment: [
      ['#include <clipping_planes_fragment>', 'if (vDis < uDissolve) discard;'],
      ...(emissive ? [['#include <emissivemap_fragment>', 'totalEmissiveRadiance += uEdge * 5.0 * (1.0 - smoothstep(0.0, 0.03, vDis - uDissolve)) * step(0.001, uDissolve);']] : []),
    ],
  };
}

// ---------------------------------------------------------------- 自写的蒙皮着色器（blueprint / hologram）
const SKIN_VERT = /* glsl */`
#include <common>
#include <skinning_pars_vertex>
attribute float aDis;
varying float vDis; varying vec3 vBind; varying vec3 vN; varying vec3 vV; varying vec3 vW; varying vec2 vUv;
uniform float uGlitch; uniform float uTime;
float h11(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
void main() {
  vDis = aDis; vBind = position; vUv = uv;
  #include <skinbase_vertex>
  #include <beginnormal_vertex>
  #include <skinnormal_vertex>
  #include <begin_vertex>
  #include <skinning_vertex>
  vec4 wp = modelMatrix * vec4(transformed, 1.0);
  if (uGlitch > 0.0) {
    float fr = floor(uTime * 12.0);
    float band = floor(wp.y * 22.0);
    float h = h11(band * 3.1 + fr * 17.0);
    if (h < uGlitch * 0.35) wp.x += (h11(band + fr) - 0.5) * 0.09 * uGlitch;
  }
  vW = wp.xyz;
  vec4 mv = viewMatrix * wp;
  vV = -mv.xyz;
  vN = normalize(normalMatrix * objectNormal);
  gl_Position = projectionMatrix * mv;
}`;

const BLUEPRINT_FRAG = /* glsl */`
uniform float uDissolve; uniform vec3 uEdge; uniform float uDraw; uniform vec3 uLine; uniform vec3 uFill; uniform vec3 uLead;
varying float vDis; varying vec3 vBind; varying vec3 vN; varying vec3 vV; varying vec3 vW;
float grid(float f, float wmul) { float w = fwidth(f) * wmul; float d = min(fract(f), 1.0 - fract(f)); return 1.0 - smoothstep(0.0, w, d); }
void main() {
  if (vDis < uDissolve) discard;
  float y = vBind.y;
  if (y > uDraw * 1.04) discard;
  float lines = max(grid(vBind.y / 0.016, 1.2), grid(vBind.x / 0.02, 1.2) * 0.8);
  float major = max(grid(vBind.y / 0.08, 1.6), grid(vBind.x / 0.1, 1.6));
  vec3 n = normalize(vN), v = normalize(vV);
  float rim = smoothstep(0.62, 0.92, 1.0 - abs(dot(n, v)));
  float ink = max(max(lines * 0.55, major), rim);
  vec3 col = mix(uFill, uLine * 1.25, ink);
  float lead = 1.0 - smoothstep(0.0, 0.025, uDraw * 1.04 - y);
  col = mix(col, uLead * 3.0, lead * step(uDraw, 0.999));
  col += uEdge * 5.0 * (1.0 - smoothstep(0.0, 0.03, vDis - uDissolve)) * step(0.001, uDissolve);
  gl_FragColor = vec4(col, 1.0);
}`;

const HOLO_FRAG = /* glsl */`
uniform float uDissolve; uniform vec3 uEdge; uniform float uTime; uniform vec3 uA; uniform vec3 uB; uniform sampler2D uMap; uniform float uOpacity;
varying float vDis; varying vec3 vN; varying vec3 vV; varying vec3 vW; varying vec2 vUv;
void main() {
  if (vDis < uDissolve) discard;
  vec3 n = normalize(vN), v = normalize(vV);
  float fres = pow(1.0 - abs(dot(n, v)), 2.2);
  float scan = 0.45 + 0.55 * smoothstep(0.35, 0.5, abs(fract(vW.y * 140.0 - uTime * 0.8) - 0.5) * 2.0);
  float band = exp(-pow((fract(vW.y * 0.9 - uTime * 0.45) - 0.5) * 9.0, 2.0));
  float l = dot(texture2D(uMap, vUv).rgb, vec3(0.3, 0.59, 0.11));
  vec3 col = mix(uA, uB, fres) * (0.18 + 1.6 * fres + 0.55 * l) * scan + uA * band * 0.9;
  col += uEdge * 5.0 * (1.0 - smoothstep(0.0, 0.03, vDis - uDissolve)) * step(0.001, uDissolve);
  gl_FragColor = vec4(col * uOpacity, 1.0);
}`;

// 粒子：位置每帧由 CPU 写（世界坐标），颜色 / 大小 / 种子静态
const POINTS_VERT = /* glsl */`
attribute vec3 color; attribute float aSize; attribute float aSeed; attribute float aDis;
uniform float uSize; uniform float uTime; uniform float uReveal; uniform float uHide; uniform float uSubset; uniform float uScale;
varying vec3 vCol; varying float vA;
void main() {
  vCol = color;
  float on = step(aDis, uReveal) * step(uHide, aDis) * step(aSeed, uSubset);
  float tw = 0.75 + 0.25 * sin(uTime * 6.0 + aSeed * 628.0);
  vA = on * tw;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = on * uSize * aSize * uScale / max(0.05, -mv.z);
  gl_Position = projectionMatrix * mv;
}`;
const POINTS_FRAG = /* glsl */`
uniform vec3 uTint; uniform float uTintAmt; uniform float uGain;
varying vec3 vCol; varying float vA;
void main() {
  vec2 q = gl_PointCoord - 0.5;
  float d = dot(q, q) * 4.0;
  if (d > 1.0 || vA <= 0.0) discard;
  float a = (1.0 - d); a *= a;
  vec3 c = mix(vCol, uTint, uTintAmt) * uGain;
  gl_FragColor = vec4(c * a * vA, 1.0);
}`;

// ---------------------------------------------------------------- 霓虹环境（chrome 反射用）：代码搭的房间 + 三色灯条
function neonEnvironment(renderer) {
  const env = new THREE.Scene();
  // 天球渐变：上亮（淡紫白）→ 地平线一道亮带 → 下暗。液态金属靠大块明暗对比才「像金属」
  const sky = new THREE.Mesh(new THREE.SphereGeometry(10, 48, 24), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    vertexShader: 'varying vec3 p; void main(){ p = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `varying vec3 p; void main(){
      float y = normalize(p).y;
      vec3 top = vec3(0.85, 0.83, 0.95) * 1.4, hor = vec3(0.30, 0.26, 0.40), bot = vec3(0.03, 0.03, 0.05);
      vec3 c = y > 0.0 ? mix(hor, top, pow(y, 0.6)) : mix(hor, bot, pow(-y, 0.35));
      c += vec3(1.0, 0.95, 0.98) * 2.2 * exp(-pow(y * 22.0, 2.0));
      gl_FragColor = vec4(c, 1.0); }`,
  }));
  env.add(sky);
  const strip = (color, w, h, pos, rot, k = 1) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(...pos); m.rotation.set(...rot); env.add(m);
  };
  strip(PALETTE.pink, 3, 7, [-6.5, 1, -6], [0, Math.PI / 4, 0], 2.5);
  strip(PALETTE.mint, 3, 7, [6.5, 1, -6], [0, -Math.PI / 4, 0], 2.2);
  strip(PALETTE.lemon, 0.5, 8, [7.5, 0.5, 5], [0, -Math.PI * 0.7, 0], 2.5);
  strip(PALETTE.pink, 0.5, 8, [-7.5, 0.5, 5], [0, Math.PI * 0.7, 0], 2.5);
  strip('#ffffff', 5, 2.5, [0, 6, 2], [Math.PI / 2, 0, 0], 2.5);           // 顶部柔光箱
  const pm = new THREE.PMREMGenerator(renderer);
  const tex = pm.fromScene(env, 0.035).texture;
  pm.dispose();
  return tex;
}

/** 给 toon / voxel 用的灯：暖白主光 + 粉色轮廓 + 薄荷补光。返回 Group */
export function createGirlLights({ key = 2.0, rim = 2.2, fill = 1.0 } = {}) {
  const g = new THREE.Group();
  g.add(new THREE.HemisphereLight('#f5f0ff', '#2a2035', fill));
  const k = new THREE.DirectionalLight('#fff4ea', key); k.position.set(1.5, 3, 2.5); g.add(k, k.target);
  const r = new THREE.DirectionalLight(PALETTE.pink, rim); r.position.set(-2.5, 1.8, -2); g.add(r, r.target);
  const m = new THREE.DirectionalLight(PALETTE.mint, rim * 0.6); m.position.set(2.5, 1.2, -2.2); g.add(m, m.target);
  return g;
}

// ---------------------------------------------------------------- 静态姿势（pose(name)），格式同 dance3d 舞步 spec
export const POSES = {
  idle: u => MOVES.idle(u),
  rest: () => ({}),
  lookUp: () => ({ spine: [-4, 0, 0], chest: [-6, 0, 0], neck: [-14, 0, 0], head: [-22, 0, 0],
    handL: { pos: [0.3, -0.85, 0.12], pole: [0.4, 0, -1] }, handR: { pos: [-0.3, -0.85, 0.12], pole: [-0.4, 0, -1] } }),
  reachUp: () => ({ spine: [-4, 0, 0], chest: [-5, 0, 0], head: [-18, 0, 0], clavL: [0, 0, 18], clavR: [0, 0, -18],
    handL: { pos: [0.08, 0.98, 0.1], pole: [1, 0, -0.5], grip: 1 }, handR: { pos: [-0.08, 0.98, 0.1], pole: [-1, 0, -0.5], grip: 1 },
    footL: { pos: [0, 0.03, 0], pitch: 25 }, footR: { pos: [0, 0.05, -0.02], pitch: 30 } }),
  airborne: () => ({ root: { y: 0.18 }, hips: { rot: [8, 0, 0] }, spine: [-6, 0, 0], chest: [-8, 0, 0], head: [-10, 0, 0],
    clavL: [0, 0, 14], clavR: [0, 0, -14],
    handL: { pos: [0.55, 0.55, 0.1], pole: [1, 0, -0.5] }, handR: { pos: [-0.55, 0.55, 0.1], pole: [-1, 0, -0.5] },
    footL: { pos: [0, 0.16, -0.12], pitch: 35 }, footR: { pos: [0, 0.07, 0.1], pitch: 20 } }),
};

// ---------------------------------------------------------------- 补充舞步（dance3d 没有的：走、跑、推；以及动作幅度更大的挥臂）
// 编舞表里直接写名字即可（girl.dance 会先查这里再查 dance3d.MOVES）。u = 连续拍数，拍点上是「落」。
const bdip = u => 0.5 + 0.5 * Math.cos(2 * Math.PI * u);
export const MOVES_X = {
  // 原地走：一拍一步（两拍一个周期），手脚反向摆；镜头 / root 负责真正往前挪
  walk(u) {
    const f = Math.PI * u, s = Math.sin(f), c = Math.cos(f);
    const liftL = 0.07 * Math.max(0, c) ** 1.5, liftR = 0.07 * Math.max(0, -c) ** 1.5;
    return {
      hips: { x: 0.03 * s, y: -0.025 + 0.02 * Math.cos(2 * f), rot: [0, 9 * s, -4 * s] },
      spine: [3, -4 * s, 0], chest: [2, -5 * s, 0], head: [2 + 2 * bdip(u), 5 * s, 0],
      footL: { pos: [0, liftL, 0.2 * s], pitch: 20 * Math.max(0, c) }, footR: { pos: [0, liftR, -0.2 * s], pitch: 20 * Math.max(0, -c) },
      handL: { pos: [0.27, -0.82, 0.15 - 0.5 * s], pole: [0.4, -0.2, -1], grip: 0.4 },
      handR: { pos: [-0.27, -0.82, 0.15 + 0.5 * s], pole: [-0.4, -0.2, -1], grip: 0.4 },
    };
  },
  // 原地跑：默认一拍一步；o.rate = 2 半拍一步（冲刺）。前倾、屈臂大摆、腾空
  run(u, o = {}) {
    const f = Math.PI * u * (o.rate ?? 1), s = Math.sin(f), c = Math.cos(f);
    const liftL = 0.2 * Math.max(0, c) ** 1.2, liftR = 0.2 * Math.max(0, -c) ** 1.2;
    return {
      root: { y: 0.035 * Math.abs(c) },
      hips: { y: -0.05, rot: [8, 9 * s, -3 * s] },
      spine: [8, -6 * s, 0], chest: [6, -8 * s, 0], head: [-6, 6 * s, 0],
      footL: { pos: [0, liftL, 0.34 * s + 0.05], pitch: 35 * Math.max(0, c) }, footR: { pos: [0, liftR, -0.34 * s + 0.05], pitch: 35 * Math.max(0, -c) },
      handL: { pos: [0.24, -0.42 + 0.12 * Math.max(0, -s), 0.3 - 0.42 * s], pole: [0.3, -0.6, -1], grip: 0.9 },
      handR: { pos: [-0.24, -0.42 + 0.12 * Math.max(0, s), 0.3 + 0.42 * s], pole: [-0.3, -0.6, -1], grip: 0.9 },
    };
  },
  // 顶住吸力：身体后仰、重心压低、双臂张开找平衡，每拍被拽一下（前倾）再挣回来；o.pull 0..1 越大拽得越狠
  brace(u, o = {}) {
    const k = o.pull ?? 1, f = u - Math.floor(u), tug = Math.exp(-f / 0.18) * k, sway = Math.sin(Math.PI * u);
    return {
      hips: { x: 0.08 * sway, y: -0.09 - 0.03 * k - 0.04 * tug, z: -0.05 + 0.08 * tug, rot: [-8 + 16 * tug, 8 * sway, 6 * sway] },
      spine: [-6 + 10 * tug, 0, -5 * sway], chest: [-6 + 8 * tug, 0, -4 * sway], neck: [6, 0, 0], head: [10 + 6 * tug, 8 * sway, 0],
      clavL: [0, 0, 10], clavR: [0, 0, -10],
      handL: { pos: [0.8, -0.05 + 0.35 * sway, 0.12 + 0.4 * tug], pole: [0.2, -1, -0.4], grip: 0.1 },
      handR: { pos: [-0.8, -0.05 - 0.35 * sway, 0.12 + 0.4 * tug], pole: [-0.2, -1, -0.4], grip: 0.1 },
      footL: { pos: [0.1, 0, 0.12] }, footR: { pos: [-0.1, 0.05 * Math.max(0, sway), -0.14], pitch: 12 * Math.max(0, sway) },
    };
  },
  // 坠落：四肢在空中乱划（两拍一个周期，左右错开），身体微蜷；镜头负责真正往下掉
  fall(u) {
    const a = Math.sin(Math.PI * u), b = Math.cos(Math.PI * u), c = Math.sin(Math.PI * u * 0.5);
    return {
      hips: { rot: [10 + 8 * b, 6 * c, 6 * a] }, spine: [-8 + 6 * a, 0, 5 * b], chest: [-6, 5 * c, 0], neck: [-6, 0, 0], head: [-14 + 6 * b, 10 * c, 6 * a],
      clavL: [0, 0, 18], clavR: [0, 0, -18],
      handL: { pos: [0.7 + 0.1 * a, 0.35 + 0.35 * b, 0.1 + 0.25 * a], pole: [0.3, -1, -0.3], grip: 0.1 },
      handR: { pos: [-0.7 - 0.1 * b, 0.35 - 0.35 * b, 0.1 - 0.25 * a], pole: [-0.3, -1, -0.3], grip: 0.1 },
      footL: { pos: [0.05, 0.3 + 0.2 * a, 0.25 + 0.15 * b], pitch: 30 }, footR: { pos: [-0.05, 0.12 - 0.12 * a, -0.1 - 0.15 * b], pitch: 40 },
    };
  },
  // 拍按钮：每拍双手举起再砸下（拍点砸到最低），身体跟着前扑
  slam(u) {
    const f = u - Math.floor(u), hit = Math.exp(-f / 0.12), up = Math.sin(Math.PI * Math.min(1, f / 0.85)) ** 2;
    return {
      hips: { y: -0.05 - 0.05 * hit, z: 0.03, rot: [10 + 10 * hit, 0, 0] }, spine: [8 + 10 * hit - 8 * up, 0, 0], chest: [6 + 6 * hit - 6 * up, 0, 0], head: [8 + 6 * hit - 10 * up, 0, 0],
      handL: { pos: [0.12, -0.45 + 1.0 * up, 0.62 - 0.1 * up], pole: [1, -0.4, -0.3], grip: 1 },
      handR: { pos: [-0.12, -0.45 + 1.0 * up, 0.62 - 0.1 * up], pole: [-1, -0.4, -0.3], grip: 1 },
      footL: { pos: [0.02, 0, 0.12] }, footR: { pos: [-0.02, 0.03 * hit, -0.18], pitch: 10 },
    };
  },
  // 坐在横杆上：大腿前平、小腿垂下，两腿交替晃（两拍一个来回），头慢慢晃（四拍，蓝调的慢），手撑在身侧的杆上。root 放在「杆高 − 胯高」
  sit(u) {
    const w = Math.sin(Math.PI * u), b = Math.sin(Math.PI * u * 0.5);   // 腿两拍一个来回，头四拍一晃
    return {
      hips: { y: 0, rot: [-4, 6 * w, 0] }, spine: [6 + 4 * b, 5 * w, 0], chest: [4, 5 * w, -4 * w], neck: [4, 0, 0], head: [8 + 8 * b, 18 * w, -10 * w],
      handL: { pos: [0.38, -0.86 + 0.06 * b, 0.02], pole: [0.3, 0, -1], grip: 0.6 },
      handR: { pos: [-0.38, -0.86 - 0.06 * b, 0.02], pole: [-0.3, 0, -1], grip: 0.6 },
      footL: { pos: [0.02, 0.5 + 0.16 * w, 0.5 + 0.34 * w], pole: [0.1, 0, 1], pitch: 30 * Math.max(0, w) },
      footR: { pos: [-0.02, 0.5 - 0.16 * w, 0.5 - 0.34 * w], pole: [-0.1, 0, 1], pitch: 30 * Math.max(0, -w) },
    };
  },
  // 推栏杆：双臂前伸在肩高、前倾、弓步；每拍发力一次（手往前顶、胯下沉），o.force 0..1 越大越使劲
  push(u, o = {}) {
    const k = o.force ?? 1, b = bdip(u), sway = Math.sin(Math.PI * u);
    return {
      hips: { x: 0.05 * sway, z: 0.04 * k, y: -0.06 - 0.06 * b * k, rot: [6 + 6 * k, 6 * sway, 3 * sway] },
      spine: [8 + 6 * k, 3 * sway, 0], chest: [6 + 4 * k, 0, 0], neck: [-6, 0, 0], head: [-10 - 4 * b, 0, 2 * sway],
      clavL: [0, 8, 6], clavR: [0, -8, -6],
      handL: { pos: [0.3, 0.3 + 0.12 * sway, 0.6 + 0.32 * b * k], pole: [1, -0.6, -0.3], grip: 0.2, wrist: [-60, 0, 0] },
      handR: { pos: [-0.3, 0.3 - 0.12 * sway, 0.6 + 0.32 * b * k], pole: [-1, -0.6, -0.3], grip: 0.2, wrist: [-60, 0, 0] },
      footL: { pos: [0.02, 0, 0.16] }, footR: { pos: [-0.02, 0.02 * b, -0.26], pitch: 18 },
    };
  },
  // 挥臂加强版：glowWave 的手在头顶左右大幅扫 + 每拍向上顶一下 + 胯左右送，没有「举着不动」的时刻
  wave(u, o) {
    const sp = MOVES.glowWave(u, o), w = Math.sin(Math.PI * (u - 0.5)), b = bdip(u);
    // 手在头两侧扫（不越过中线，否则前臂穿头），每拍从肩高顶到头顶（拍点在最高）
    sp.handL = { ...sp.handL, pos: [0.46 - 0.16 * w, 0.05 + 0.85 * b, 0.45 + 0.1 * w] };
    sp.handR = { ...sp.handR, pos: [-0.46 - 0.16 * w, 0.05 + 0.85 * b, 0.45 - 0.1 * w] };
    sp.hips = { ...sp.hips, x: -0.1 * w, y: -0.075 * b, rot: [0, 10 * w, 9 * w] };
    sp.head = [-4 + 7 * b, 8 * w, -6 * w];
    const lift = Math.max(0, Math.sin(Math.PI * u));   // 交替点脚
    sp.footL = { pos: [0, 0.05 * lift * (w > 0 ? 1 : 0), 0.04], pitch: 14 * lift * (w > 0 ? 1 : 0) };
    sp.footR = { pos: [0, 0.05 * lift * (w <= 0 ? 1 : 0), 0.04], pitch: 14 * lift * (w <= 0 ? 1 : 0) };
    return sp;
  },
};
const resolveMove = m => (typeof m === 'string' && MOVES_X[m]) || m;

// ---------------------------------------------------------------- 动捕库（Mixamo FBX，Without Skin，X Bot = mixamorig 骨架）
// await loadAnims(['dance__shuffle', 'move__sprint', ...])（或 'all'）→ 之后 girl.play(seq, T) 里按名字用。
// 每个片段的参数来自 anim/mixamo/index.json（验片时量出来的）：beats = 源片段里有几拍（舞蹈按音乐拍伸缩：源第 k 拍 ↔ 音乐第 k 拍），
//   loop、inPlace、ok（验片没通过的标 false，loadAnims 默认不加载坏片段）。没有 index.json 时：舞蹈按「源拍 ≈ 0.4545 s」估，其余按原速。
// 叙事 / 跑酷动作（act__ / move__）按原速播（bpm = 132 ⇒ 1 音乐拍 = 源片段 0.4545 s）。
export const ANIM_DIR = new URL('../../cast-cyber-girl/3d/anim/mixamo/', import.meta.url);
export const ANIM_NAMES = [];            // index.json 里的全部名字（loadAnimIndex 后填）
const ANIMS = new Map();                 // 名字 → move（dance3d.mixamoMove 的结果，isClip）
let animIndex = null;
export async function loadAnimIndex() {
  if (!animIndex) {
    animIndex = await fetch(new URL('index.json', ANIM_DIR)).then(r => (r.ok ? r.json() : { clips: [] })).catch(() => ({ clips: [] }));
    ANIM_NAMES.splice(0, ANIM_NAMES.length, ...animIndex.clips.map(c => c.name));
  }
  return animIndex;
}
const LOOPING = /(^dance__)|idle|sway|sprint|swing|swim|float|fly|walk|skate|look-around/;
/** 默认参数（index.json 缺项时用） */
function animDefaults(name, dur) {
  const dance = name.startsWith('dance__');
  return { beats: dance ? Math.max(1, Math.round(dur / (60 / 132))) : null, bpm: dance ? null : 132, loop: LOOPING.test(name), inPlace: true, ground: true };
}
export async function loadAnims(names = 'all', { includeBad = false } = {}) {
  const idx = await loadAnimIndex();
  const byName = new Map(idx.clips.map(c => [c.name, c]));
  const list = names === 'all' ? idx.clips.filter(c => includeBad || c.ok !== false).map(c => c.name) : names;
  const { FBXLoader } = await import('../../../assets/vendor/three/examples/jsm/loaders/FBXLoader.js');
  const loader = new FBXLoader();
  await Promise.all(list.map(async name => {
    if (ANIMS.has(name)) return;
    const src = await loader.loadAsync(new URL(`${name}.fbx`, ANIM_DIR).href);
    const clip = src.animations[0];
    if (!clip) throw new Error(`girl.js：${name}.fbx 里没有动画`);
    const meta = { ...animDefaults(name, clip.duration), ...(byName.get(name) || {}) };
    const move = mixamoMove(src, clip, { beats: meta.bpm ? null : meta.beats, bpm: meta.bpm, loop: meta.loop, inPlace: meta.inPlace, ground: meta.ground, name });
    move.meta = meta; move.srcRoot = src;
    // 体型修正：X Bot 很瘦，手臂垂下时贴着身体；她是泡泡袖 + 宽短裤，照搬会让前臂 / 手插进大腿和躯干。
    // 上臂在胸腔坐标里向外展 armSpread 度（index.json 可逐个覆盖，编排里 e.armSpread 也能改）。
    const raw = move.solve.bind(move), spread0 = meta.armSpread ?? ARM_SPREAD;
    move.solve = (u, dancer, o = {}) => limitHead(spreadArms(raw(u, dancer, o), o.armSpread ?? spread0, dancer), o.headLimit ?? dancer.headLimit);
    ANIMS.set(name, move);
  }));
  return list.map(n => ANIMS.get(n));
}
const ARM_SPREAD = 10;
const _qa = new THREE.Quaternion(), _za = new THREE.Vector3(0, 0, 1);
function spreadArms(pose, deg, dancer) {
  if (!deg) return pose;
  // 只在上臂低于水平时外展（垂手贴身才会插进身体）；举过头时不动，否则反而往头那边转
  const X = dancer.solver.fk(pose.d, pose.hips).X;
  for (const [side, sgn] of [['Left', 1], ['Right', -1]]) {
    const q = pose.d[side + 'Arm'], a = X[side + 'Arm'], b = X[side + 'ForeArm'];
    if (!q || !a || !b) continue;
    const dir = b.clone().sub(a).normalize();
    const w = clamp(0.45 - dir.y * 1.6);   // 水平时 0.45，下垂 1，举高（dir.y > 0.28）0
    if (w <= 0) continue;
    pose.d[side + 'Arm'] = _qa.setFromAxisAngle(_za, sgn * deg * w * Math.PI / 180).clone().multiply(q);
  }
  return pose;
}
// 头颈限幅（#925 诊断）：Neck·Head 合起来相对 Spine2 的俯仰 / 侧倾超过模型撑得住的范围时截断，超出部分一半分给 Spine2（上半身带一点），
// 另一半丢掉。范围按 face-diag 的低头扫描定：修过权重后低头 25° 以内、侧倾 18° 以内脸不变形。
export const HEAD_LIMIT = { down: 25, up: 22, roll: 18, spill: 0.5 };
const _e = new THREE.Euler(), _q1 = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _qc = new THREE.Quaternion();
function limitHead(pose, L) {
  if (!L) return pose;
  const n = pose.d.Neck || new THREE.Quaternion(), h = pose.d.Head || new THREE.Quaternion();
  _qc.copy(n).multiply(h);                                   // 颈 + 头（相对 Spine2，角色轴）
  _e.setFromQuaternion(_qc, 'YXZ');
  const D = Math.PI / 180, px = _e.x, pz = _e.z;
  const cx = Math.max(-L.up * D, Math.min(L.down * D, px)), cz = Math.max(-L.roll * D, Math.min(L.roll * D, pz));
  if (cx === px && cz === pz) return pose;
  const clamped = new THREE.Quaternion().setFromEuler(_e.set(cx, _e.y, cz, 'YXZ'));
  // 超出部分 X = qc · clamped⁻¹，分一部分给 Spine2
  const X = _qc.clone().multiply(clamped.clone().invert());
  const spill = new THREE.Quaternion().slerp(X, L.spill);
  pose.d.Spine2 = (pose.d.Spine2 || new THREE.Quaternion()).clone().multiply(spill);
  // 限幅后的颈 + 头重新按 4 : 6 分
  const nq = new THREE.Quaternion().slerp(clamped, 0.4);
  pose.d.Neck = nq; pose.d.Head = nq.clone().invert().multiply(clamped);
  return pose;
}

/** 脸 / 下巴上的 Neck、Spine 权重转给 Head（按高度和前后渐变，脖子本身不动） */
function fixFaceWeights(mesh, headY) {
  const g = mesh.geometry, P = g.attributes.position, SI = g.attributes.skinIndex, SW = g.attributes.skinWeight;
  const names = mesh.skeleton.bones.map(b => b.name.replace(/^mixamorig/, ''));
  const iHead = names.indexOf('Head');
  const ss = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  for (let i = 0; i < P.count; i++) {
    const y = P.getY(i), z = P.getZ(i);
    // 前侧（下巴、嘴）从头骨以下 4.5 cm 开始接管；后侧（后脑、发根）从头骨高度开始
    const f = z > 0.025 ? ss(headY - 0.048, headY - 0.028, y) : ss(headY - 0.012, headY + 0.01, y);
    if (f <= 0) continue;
    let head = 0, moved = 0; const w = [0, 0, 0, 0], idx = [0, 0, 0, 0];
    for (let k = 0; k < 4; k++) { idx[k] = SI.getComponent(i, k); w[k] = SW.getComponent(i, k); const nm = names[idx[k]]; if (nm === 'Head') head += w[k]; }
    if (head < 0.1 && f < 1) continue;                    // 纯脖子 / 衣领的顶点不碰
    for (let k = 0; k < 4; k++) { const nm = names[idx[k]]; if (nm === 'Neck' || /^Spine/.test(nm)) { moved += w[k] * f; w[k] *= 1 - f; } }
    if (moved <= 0) continue;
    let hk = idx.findIndex((b, k) => b === iHead && w[k] >= 0);
    if (hk < 0) { hk = w.indexOf(Math.min(...w)); idx[hk] = iHead; w[hk] = 0; }
    w[hk] += moved;
    const sum = w.reduce((a, b) => a + b, 0) || 1;
    for (let k = 0; k < 4; k++) { SI.setComponent(i, k, idx[k]); SW.setComponent(i, k, w[k] / sum); }
  }
  SI.needsUpdate = SW.needsUpdate = true;
}

/** 脸的正面（去描边外壳的区域）：头骨附近、朝前的顶点；侧面（法线偏向两侧）保留，外轮廓还在 */
function faceMask(mesh, headY) {
  const g = mesh.geometry, P = g.attributes.position, N = g.attributes.normal, out = new Float32Array(P.count);
  for (let i = 0; i < P.count; i++) {
    const x = P.getX(i), y = P.getY(i), z = P.getZ(i);
    if (y < headY - 0.05 || y > headY + 0.085 || Math.abs(x) > 0.075 || z < 0.0) continue;
    out[i] = clamp((N.getZ(i) - 0.25) / 0.35);
  }
  return out;
}

export const getAnim = name => { const m = ANIMS.get(name); if (!m) throw new Error(`girl.js：动作 ${name} 还没加载（先 await loadAnims([...])）`); return m; };
/** 片段包一层：rate = 播放速度倍数（按拍伸缩之上再乘），offset = 从片段第几拍开始 */
function clipMove(e) {
  const m = getAnim(e.anim);
  const rate = e.rate ?? 1;
  return rate === 1 ? m : { isClip: true, name: m.name, solve: (u, d, o) => m.solve(u * rate, d, o) };
}

// ---------------------------------------------------------------- 加载（同一个 URL 只下载一次，每个实例各自解析）
const bufCache = new Map();
async function loadGLB(url) {
  if (!bufCache.has(url)) bufCache.set(url, fetch(url).then(r => { if (!r.ok) throw new Error(`读不到 ${url}`); return r.arrayBuffer(); }));
  const buf = await bufCache.get(url);
  return new GLTFLoader().parseAsync(buf.slice(0), url.replace(/[^/]*$/, ''));
}

/**
 * Tripo 4K 版 glb 的两个导出问题（#926 诊断）：
 *   ① 骨骼节点没写静止姿态（translation / rotation 全空，只剩 inverseBindMatrices）→ 所有骨骼挤在原点；
 *   ② inverseBindMatrices 所在的坐标系和网格不一致：关节位置 = 旧版的 (z, x, y − 0.5)（坐标轴轮换 + 平移，像是丢了一层父节点变换）。
 * 这里：拿旧版的关节位置（girl-ref-joints.json）当参照，在 24 种轴对齐旋转里挑残差最小的那个 + 最佳平移 = 校正变换 F；
 * 真实关节 = F · boneInverse⁻¹，逐级还原局部变换，再把 boneInverse 重算成真实关节的逆（静止时蒙皮 = 恒等，网格不变）。
 * 骨骼本来就有静止姿态（旧版 glb）时什么都不做。
 */
export async function restoreBindPose(mesh) {
  const sk = mesh.skeleton, bones = sk.bones;
  const collapsed = bones.filter(b => b.position.lengthSq() < 1e-12).length > bones.length * 0.5;
  if (!collapsed) return null;
  const J = bones.map((b, i) => sk.boneInverses[i].clone().invert());          // 导出时的关节矩阵（坐标系可能错）
  const ref = (await (await fetch(new URL('./girl-ref-joints.json', import.meta.url))).json()).joints;
  const pairs = bones.map((b, i) => [canonicalBone(b.name), i]).filter(([n]) => ref[n]);
  const P = pairs.map(([, i]) => new THREE.Vector3().setFromMatrixPosition(J[i])), Q = pairs.map(([n]) => new THREE.Vector3(...ref[n]));
  let best = null;
  for (const perm of [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]) for (let sgn = 0; sgn < 8; sgn++) {
    const R = new THREE.Matrix4(), e = R.elements.fill(0);
    for (let r = 0; r < 3; r++) e[perm[r] * 4 + r] = (sgn >> r) & 1 ? -1 : 1;   // 列 perm[r] 行 r
    e[15] = 1;
    if (R.determinant() < 0) continue;
    const t = new THREE.Vector3(); Q.forEach((q, k) => t.add(q.clone().sub(P[k].clone().applyMatrix4(R)))); t.divideScalar(P.length);
    let err = 0; Q.forEach((q, k) => { err += q.distanceTo(P[k].clone().applyMatrix4(R).add(t)); });
    if (!best || err < best.err) best = { R, t, err: err / P.length };
  }
  const F = best.R.clone().setPosition(best.t);
  const W = J.map(m => F.clone().multiply(m));                                   // 网格空间里的真实关节
  const idx = new Map(bones.map((b, i) => [b, i]));
  const depth = b => { let d = 0; for (let p = b.parent; p; p = p.parent) d++; return d; };
  mesh.updateWorldMatrix(true, false);
  const meshWorld = mesh.matrixWorld.clone(), tmp = new THREE.Matrix4();
  for (const b of [...bones].sort((x, y) => depth(x) - depth(y))) {
    const i = idx.get(b);
    b.parent.updateWorldMatrix(true, false);
    tmp.copy(b.parent.matrixWorld).invert().multiply(meshWorld).multiply(mesh.bindMatrix).multiply(W[i]);
    tmp.decompose(b.position, b.quaternion, b.scale);
    b.updateMatrixWorld(true);
  }
  bones.forEach((b, i) => sk.boneInverses[i].copy(W[i]).invert());
  return { residual: +best.err.toFixed(5), F: F.elements.map(v => +v.toFixed(4)) };
}
const canonicalBone = n => n.replace(/^mixamorig\d*[:_]?/i, '');

/** 表面按面积采样 n 个点：bary、合并后的 4 骨权重、溶解值、颜色（贴图，线性）、种子 */
function sampleSurface(mesh, n, seed, texPixels) {
  const g = mesh.geometry, pos = g.attributes.position, uv = g.attributes.uv, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, dis = g.attributes.aDis;
  const idx = g.index ? g.index.array : null, triCount = idx ? idx.length / 3 : pos.count / 3;
  const vi = (t, k) => (idx ? idx[t * 3 + k] : t * 3 + k);
  const cum = new Float64Array(triCount);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  let acc = 0;
  for (let t = 0; t < triCount; t++) {
    a.fromBufferAttribute(pos, vi(t, 0)); b.fromBufferAttribute(pos, vi(t, 1)); c.fromBufferAttribute(pos, vi(t, 2));
    acc += b.sub(a).cross(c.sub(a)).length() * 0.5; cum[t] = acc;
  }
  const rnd = mulberry32(seed);
  const S = {
    n, Q: new Float32Array(n * 3), bi: new Uint16Array(n * 4), bw: new Float32Array(n * 4),
    dis: new Float32Array(n), col: new Float32Array(n * 3), size: new Float32Array(n), seed: new Float32Array(n), dir: new Float32Array(n * 3),
  };
  const bind = mesh.bindMatrix, P = new THREE.Vector3(), col = new THREE.Color();
  const wmap = new Map();
  for (let k = 0; k < n; k++) {
    const r = rnd() * acc;
    let lo = 0, hi = triCount - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < r) lo = m + 1; else hi = m; }
    const t = lo;
    let u = rnd(), v = rnd(); if (u + v > 1) { u = 1 - u; v = 1 - v; }
    const w = [1 - u - v, u, v], ids = [vi(t, 0), vi(t, 1), vi(t, 2)];
    P.set(0, 0, 0);
    let U = 0, V = 0, D = 0;
    wmap.clear();
    for (let j = 0; j < 3; j++) {
      P.x += pos.getX(ids[j]) * w[j]; P.y += pos.getY(ids[j]) * w[j]; P.z += pos.getZ(ids[j]) * w[j];
      U += uv.getX(ids[j]) * w[j]; V += uv.getY(ids[j]) * w[j]; D += dis.getX(ids[j]) * w[j];
      for (let q = 0; q < 4; q++) { const bw = sw.getComponent(ids[j], q); if (bw > 0) { const bix = si.getComponent(ids[j], q); wmap.set(bix, (wmap.get(bix) || 0) + bw * w[j]); } }
    }
    const top = [...wmap.entries()].sort((x, y) => y[1] - x[1]).slice(0, 4);
    const sum = top.reduce((s, e) => s + e[1], 0) || 1;
    for (let q = 0; q < 4; q++) { S.bi[k * 4 + q] = top[q] ? top[q][0] : 0; S.bw[k * 4 + q] = top[q] ? top[q][1] / sum : 0; }
    P.applyMatrix4(bind);
    S.Q.set([P.x, P.y, P.z], k * 3);
    S.dis[k] = D;
    // 贴图颜色（glTF uv 原点在图像左上，flipY = false）
    const { data, w: tw, h: th } = texPixels;
    const px = Math.min(tw - 1, Math.max(0, Math.floor((U - Math.floor(U)) * tw))), py = Math.min(th - 1, Math.max(0, Math.floor((V - Math.floor(V)) * th)));
    const o = (py * tw + px) * 4;
    col.setRGB(data[o] / 255, data[o + 1] / 255, data[o + 2] / 255, THREE.SRGBColorSpace);
    S.col.set([col.r, col.g, col.b], k * 3);
    S.size[k] = 0.55 + rnd() * 0.9;
    S.seed[k] = rnd();
    const th2 = rnd() * Math.PI * 2, z = rnd() * 2 - 1, rr = Math.sqrt(1 - z * z);
    S.dir.set([Math.cos(th2) * rr, z * 0.6 + 0.25, Math.sin(th2) * rr], k * 3);
  }
  return S;
}

function texturePixels(tex, size = 1024) {
  const img = tex.image, cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const g = cv.getContext('2d', { willReadFrequently: true });
  g.drawImage(img, 0, 0, size, size);
  return { data: g.getImageData(0, 0, size, size).data, w: size, h: size };
}

// ================================================================ createGirl
export async function createGirl(mv, { url = null, model: modelKind = '4k', face = 'live', points = 32000, seed = 20260929, voxelSize = 0.022, outline = '#1a0f1f', faceFix = true, faceOutline = 'contour', headLimit = true } = {}) {
  // model: '4k'（默认）| 'legacy'（旧 2K 版；face: 'baked' 时用静态烘焙过脸的旧版）
  let gltf;
  if (url) gltf = await loadGLB(url);
  else if (modelKind === '4k') gltf = await loadGLB(GIRL_4K_URL.href).catch(e => { console.warn('girl.js：4K 模型读不到，退回旧版', e); return loadGLB(GIRL_URL.href); });
  else if (face === 'baked') gltf = await loadGLB(GIRL_BAKED_URL.href).catch(() => loadGLB(GIRL_URL.href));
  else gltf = await loadGLB(GIRL_URL.href);
  const model = gltf.scene;
  let mesh = null;
  model.traverse(o => { if (o.isSkinnedMesh && !mesh) mesh = o; if (o.isMesh) { o.frustumCulled = false; } });
  if (!mesh) throw new Error('girl.js：GLB 里没有 SkinnedMesh');
  const rebind = await restoreBindPose(mesh);   // 4K 导出的骨架坐标系问题（旧版 glb 返回 null）

  const root = new THREE.Group(); root.name = 'girl';
  const holder = new THREE.Group(); holder.name = 'girl-dancer';   // dance3d 管它的位置 / 转向，root 留给镜头摆
  root.add(holder); holder.add(model);
  root.updateMatrixWorld(true);

  // 溶解场：每个顶点一个值（静止姿态坐标）
  const geo = mesh.geometry, P = geo.attributes.position;
  const aDis = new Float32Array(P.count);
  for (let i = 0; i < P.count; i++) aDis[i] = disField(P.getX(i), P.getY(i), P.getZ(i));
  geo.setAttribute('aDis', new THREE.BufferAttribute(aDis, 1));

  // 脸部权重修正（#925 诊断）：Tripo 自动绑骨把下巴 / 嘴 / 下半张脸 20–40% 的权重挂在 Neck（个别顶点 50–78%），
  // 头一低，下半张脸跟着脖子留在原地 → 塌进衣领。把脸和下巴上 Neck / Spine 的份额全部转给 Head（Neck 只管脖子）。
  const headY = (() => { root.updateMatrixWorld(true); return model.getObjectByName('mixamorigHead').getWorldPosition(new THREE.Vector3()).y; })();
  if (faceFix) fixFaceWeights(mesh, headY);
  const dancer = createDancer(model, { rootGroup: holder });
  const clock = beatClock(mv.music);
  const look = toonify(model, { outline: { color: outline, width: 0.0035 } });
  const hull = look.items.find(it => it.o === mesh)?.hull || null;
  const map = look.items[0].pbr.map;

  // ---- 共享 uniform ----
  const U = { dissolve: { value: 0 }, edge: { value: new THREE.Color(PALETTE.pink) }, time: { value: 0 }, glitch: { value: 0 } };

  // ---- 网格皮肤的材质 ----
  const toonMat = look.items[0].toon;
  addShaderPatch(toonMat, dissolvePatch(U));
  if (hull) addShaderPatch(hull.material, dissolvePatch(U, { emissive: false }));
  // 脸部描边（#925 诊断）：描边外壳沿法线外扩 0.35% 身高，脸上起伏小（鼻梁、嘴角、眼角、下巴和衣领之间），
  // 外壳的背面会从正面穿出来 → 五官周围的黑色脏线、嘴周围一团黑。faceOutline:'contour' 时脸的正面不画外壳，只留侧面轮廓。
  if (hull && faceOutline === 'contour') {
    geo.setAttribute('aFace', new THREE.BufferAttribute(faceMask(mesh, headY), 1));
    addShaderPatch(hull.material, { key: 'face-contour', head: 'attribute float aFace;\nvarying float vFace;\n', vertex: [['#include <begin_vertex>', 'vFace = aFace;']],
      fhead: 'varying float vFace;\n', fragment: [['#include <clipping_planes_fragment>', 'if (vFace > 0.5) discard;']] });
  }

  const envMap = neonEnvironment(mv.stage.renderer);
  const chromeMat = new THREE.MeshStandardMaterial({ color: '#eef0f6', metalness: 1, roughness: 0.2, envMap, envMapIntensity: 1.0, side: THREE.FrontSide });
  addShaderPatch(chromeMat, dissolvePatch(U));

  const blueprintMat = new THREE.ShaderMaterial({
    vertexShader: SKIN_VERT, fragmentShader: BLUEPRINT_FRAG,
    uniforms: { uDissolve: U.dissolve, uEdge: U.edge, uGlitch: { value: 0 }, uTime: U.time, uDraw: { value: 1 },
      uLine: { value: new THREE.Color(PALETTE.paper) }, uFill: { value: new THREE.Color('#0b0e1c') }, uLead: { value: new THREE.Color(PALETTE.lemon) } },
    side: THREE.FrontSide,
  });
  const holoMat = new THREE.ShaderMaterial({
    vertexShader: SKIN_VERT, fragmentShader: HOLO_FRAG,
    uniforms: { uDissolve: U.dissolve, uEdge: U.edge, uGlitch: U.glitch, uTime: U.time, uMap: { value: map },
      uA: { value: new THREE.Color(PALETTE.mint) }, uB: { value: new THREE.Color(PALETTE.pink) }, uOpacity: { value: 1 } },
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.FrontSide,
  });
  const MATS = { toon: toonMat, chrome: chromeMat, blueprint: blueprintMat, hologram: holoMat };

  // ---- 粒子 ----
  const S = sampleSurface(mesh, points, seed, texturePixels(map));
  const ptsGeo = new THREE.BufferGeometry();
  const ptsPos = new Float32Array(S.n * 3);
  ptsGeo.setAttribute('position', new THREE.BufferAttribute(ptsPos, 3).setUsage(THREE.DynamicDrawUsage));
  const glow = new Float32Array(S.n * 3);
  for (let k = 0; k < S.n * 3; k++) glow[k] = Math.min(1, S.col[k] * 1.25 + 0.04);
  ptsGeo.setAttribute('color', new THREE.BufferAttribute(glow, 3));
  ptsGeo.setAttribute('aSize', new THREE.BufferAttribute(S.size, 1));
  ptsGeo.setAttribute('aSeed', new THREE.BufferAttribute(S.seed, 1));
  ptsGeo.setAttribute('aDis', new THREE.BufferAttribute(S.dis, 1));
  const ptsMat = new THREE.ShaderMaterial({
    vertexShader: POINTS_VERT, fragmentShader: POINTS_FRAG,
    uniforms: { uSize: { value: 5.5 }, uTime: U.time, uReveal: { value: 1.1 }, uHide: { value: -1 }, uSubset: { value: 1.1 }, uScale: { value: 1 },
      uTint: { value: new THREE.Color(PALETTE.pink) }, uTintAmt: { value: 0 }, uGain: { value: 1.6 } },
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const ptsObj = new THREE.Points(ptsGeo, ptsMat);
  ptsObj.frustumCulled = false; ptsObj.matrixAutoUpdate = false; ptsObj.name = 'girl-points';
  root.add(ptsObj);

  // ---- 体素 ----
  const VMAX = 14000;
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  const voxMat = new THREE.MeshToonMaterial({ color: '#ffffff', gradientMap: toonMat.gradientMap, emissive: new THREE.Color(0.06, 0.06, 0.08) });
  const vox = new THREE.InstancedMesh(boxGeo, voxMat, VMAX);
  vox.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(VMAX * 3), 3);
  vox.frustumCulled = false; vox.matrixAutoUpdate = false; vox.count = 0; vox.name = 'girl-voxel';
  root.add(vox);

  // ---- CPU 蒙皮：当帧骨骼 → 每个采样点的世界坐标 ----
  const world = new Float32Array(S.n * 3);     // 蒙皮后的世界坐标
  const cellOf = new Int32Array(S.n);          // 所在体素格序号
  let cells = { n: 0, center: new Float32Array(VMAX * 3), color: new Float32Array(VMAX * 3), hash: new Float32Array(VMAX) };
  let syncedFor = null;
  const rootInv = new THREE.Matrix4(), rootM = new THREE.Matrix4();
  function skinPoints() {
    root.updateWorldMatrix(true, true);
    mesh.skeleton.update();
    const B = mesh.skeleton.boneMatrices, Q = S.Q;
    for (let k = 0; k < S.n; k++) {
      const x = Q[k * 3], y = Q[k * 3 + 1], z = Q[k * 3 + 2];
      let ox = 0, oy = 0, oz = 0;
      for (let q = 0; q < 4; q++) {
        const w = S.bw[k * 4 + q]; if (w === 0) continue;
        const o = S.bi[k * 4 + q] * 16;
        ox += w * (B[o] * x + B[o + 4] * y + B[o + 8] * z + B[o + 12]);
        oy += w * (B[o + 1] * x + B[o + 5] * y + B[o + 9] * z + B[o + 13]);
        oz += w * (B[o + 2] * x + B[o + 6] * y + B[o + 10] * z + B[o + 14]);
      }
      // 骨骼矩阵是「骨骼世界 × 绑定逆」，绑定时网格在世界原点、无缩放 → 结果就是世界坐标
      world[k * 3] = ox; world[k * 3 + 1] = oy; world[k * 3 + 2] = oz;
    }
    // 体素化（在 root 的局部坐标里量化，方块跟她的朝向对齐）
    rootM.copy(root.matrixWorld); rootInv.copy(rootM).invert();
    const e = rootInv.elements, g = voxelSize;
    const map = new Map();
    let n = 0;
    const cc = cells.center, col = cells.color, cnt = new Float32Array(VMAX);
    col.fill(0);
    for (let k = 0; k < S.n; k++) {
      const x = world[k * 3], y = world[k * 3 + 1], z = world[k * 3 + 2];
      const lx = e[0] * x + e[4] * y + e[8] * z + e[12], ly = e[1] * x + e[5] * y + e[9] * z + e[13], lz = e[2] * x + e[6] * y + e[10] * z + e[14];
      const ix = Math.floor(lx / g), iy = Math.floor(ly / g), iz = Math.floor(lz / g);
      const key = ((ix + 1024) * 2048 + (iy + 1024)) * 2048 + (iz + 1024);
      let c = map.get(key);
      if (c === undefined) {
        if (n >= VMAX) { cellOf[k] = -1; continue; }
        c = n++; map.set(key, c);
        cc[c * 3] = (ix + 0.5) * g; cc[c * 3 + 1] = (iy + 0.5) * g; cc[c * 3 + 2] = (iz + 0.5) * g;   // 先存局部，下面转世界
        cells.hash[c] = hash3(ix, iy, iz);
      }
      cellOf[k] = c;
      col[c * 3] += S.col[k * 3]; col[c * 3 + 1] += S.col[k * 3 + 1]; col[c * 3 + 2] += S.col[k * 3 + 2]; cnt[c]++;
    }
    const m = rootM.elements;
    for (let c = 0; c < n; c++) {
      const x = cc[c * 3], y = cc[c * 3 + 1], z = cc[c * 3 + 2];
      cc[c * 3] = m[0] * x + m[4] * y + m[8] * z + m[12]; cc[c * 3 + 1] = m[1] * x + m[5] * y + m[9] * z + m[13]; cc[c * 3 + 2] = m[2] * x + m[6] * y + m[10] * z + m[14];
      col[c * 3] /= cnt[c]; col[c * 3 + 1] /= cnt[c]; col[c * 3 + 2] /= cnt[c];
    }
    cells.n = n;
  }

  // ---- 把一套「图层状态」写到各对象上 ----
  // L = { mesh: skinName|null, dissolve, points: { reveal, hide, scatter, gather, subset, tint, tintAmt, size, gain } | null, voxel: grow|null, T }
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _c = new THREE.Color();
  const hipsBone = dancer.S.info.Hips.bone;
  function applyLayers(L, T) {
    U.time.value = T;
    // 网格
    if (L.mesh) {
      mesh.visible = true;
      mesh.material = MATS[L.mesh];
      if (hull) hull.visible = L.mesh === 'toon';
      U.dissolve.value = L.dissolve || 0;
    } else { mesh.visible = false; if (hull) hull.visible = false; }

    const needCpu = !!L.points || L.voxel != null;
    if (needCpu) skinPoints();
    rootInv.copy(root.matrixWorld).invert();

    // 粒子
    if (L.points) {
      const o = L.points;
      ptsObj.visible = true;
      ptsObj.matrix.copy(rootInv); ptsObj.matrixWorld.identity();
      const sc = o.scatter || 0, ga = o.gather || 0;
      const hp = hipsBone.getWorldPosition(_p);
      for (let k = 0; k < S.n; k++) {
        let x = world[k * 3], y = world[k * 3 + 1], z = world[k * 3 + 2];
        if (sc > 0) {
          const r = S.seed[k], amt = sc * (0.18 + 0.42 * r);
          // 外散 + 绕胯部竖轴旋一点
          const dx = x - hp.x, dz = z - hp.z, ang = sc * (0.6 + 1.4 * r);
          const ca = Math.cos(ang), sa = Math.sin(ang);
          x = hp.x + dx * ca - dz * sa + S.dir[k * 3] * amt;
          z = hp.z + dx * sa + dz * ca + S.dir[k * 3 + 2] * amt;
          y = y + S.dir[k * 3 + 1] * amt;
        }
        if (ga > 0 && cellOf[k] >= 0) {
          const c = cellOf[k], cc = cells.center;
          const gk = clamp(ga * 1.3 - S.seed[k] * 0.3);
          x += (cc[c * 3] - x) * gk; y += (cc[c * 3 + 1] - y) * gk; z += (cc[c * 3 + 2] - z) * gk;
        }
        ptsPos[k * 3] = x; ptsPos[k * 3 + 1] = y; ptsPos[k * 3 + 2] = z;
      }
      ptsGeo.attributes.position.needsUpdate = true;
      const u = ptsMat.uniforms;
      u.uReveal.value = o.reveal ?? 1.1; u.uHide.value = o.hide ?? -1; u.uSubset.value = o.subset ?? 1.1;
      u.uTintAmt.value = o.tintAmt ?? 0; u.uTint.value.set(o.tint ?? PALETTE.pink);
      u.uSize.value = 5.5 * (o.size ?? 1); u.uGain.value = o.gain ?? 1.6;
      u.uScale.value = mv.height / 1080;
    } else ptsObj.visible = false;

    // 体素
    if (L.voxel != null && L.voxel > 0) {
      vox.visible = true;
      vox.matrix.copy(rootInv); vox.matrixWorld.identity();
      const g = voxelSize, grow = L.voxel;
      root.getWorldQuaternion(_q);
      let n = 0;
      for (let c = 0; c < cells.n; c++) {
        const k = clamp(grow * 1.35 - cells.hash[c] * 0.35);
        if (k <= 0) continue;
        const s = g * 0.9 * (k < 1 ? smooth(k) * (1 + 0.25 * Math.sin(Math.PI * k)) : 1);
        _m.compose(_p.set(cells.center[c * 3], cells.center[c * 3 + 1], cells.center[c * 3 + 2]), _q, _s.set(s, s, s));
        vox.setMatrixAt(n, _m);
        _c.setRGB(Math.min(1, cells.color[c * 3] * 1.1), Math.min(1, cells.color[c * 3 + 1] * 1.1), Math.min(1, cells.color[c * 3 + 2] * 1.1));
        vox.setColorAt(n, _c);
        n++;
      }
      vox.count = n;
      vox.instanceMatrix.needsUpdate = true; vox.instanceColor.needsUpdate = true;
    } else { vox.visible = false; vox.count = 0; }
  }

  // ---- 皮肤 ----
  function layersOf(name, opts = {}) {
    switch (name) {
      case 'toon': case 'chrome': case 'hologram': return { mesh: name, dissolve: 0 };
      case 'blueprint': return { mesh: 'blueprint', dissolve: 0, points: { subset: 0.028, tint: PALETTE.pink, tintAmt: 1, size: 1.35, gain: 2.2 } };
      case 'points': return { mesh: null, points: { size: opts.size ?? 1 } };
      case 'voxel': return { mesh: null, voxel: 1 };
      default: throw new Error(`girl.js：没有皮肤 ${name}（${SKINS.join(' / ')}）`);
    }
  }
  let current = 'toon';
  function setSkin(name, T = 0, opts = {}) {
    current = name;
    blueprintMat.uniforms.uDraw.value = opts.draw ?? 1;
    U.glitch.value = opts.glitch ?? (name === 'hologram' ? holoGlitch(T) : 0);
    applyLayers(layersOf(name, opts), T);
  }
  // hologram 自带的轻微故障：按种子挑一些拍间的短暂抽动
  const holoGlitch = T => { const f = Math.floor(T * 8); const h = hash3(f, 7, 3); return h < 0.12 ? 0.6 + h * 3 : 0; };

  function morph(from, to, p, T = 0, opts = {}) {
    p = clamp(p);
    if (p <= 0) return setSkin(from, T, opts);
    if (p >= 1) return setSkin(to, T, opts);
    current = p < 0.5 ? from : to;
    blueprintMat.uniforms.uDraw.value = 1;
    U.glitch.value = (from === 'hologram' && p < 0.3) || (to === 'hologram' && p > 0.75) ? holoGlitch(T) : 0;
    const big = [from, to].some(s => s === 'voxel' || s === 'points');
    const L = { mesh: null, dissolve: 0, points: null, voxel: null };
    // 旧皮肤退场 0–0.3
    const out = seg(p, 0, 0.3);
    if (MESH_SKINS.has(from) && p < 0.3) { L.mesh = from; L.dissolve = out * 1.01; }
    if (from === 'voxel' && p < 0.3) L.voxel = 1 - out;
    // 新皮肤进场 0.75–1（网格：溶解值倒放；体素：逐个弹出）
    const inn = seg(p, 0.75, 1);
    if (MESH_SKINS.has(to) && p > 0.75) { L.mesh = to; L.dissolve = (1 - inn) * 1.01; }
    if (to === 'voxel') L.voxel = seg(p, 0.8, 1) || null;
    // 粒子：旧网格溶解到哪、粒子就在哪冒出来；新网格长到哪、粒子就在哪收掉
    const scatterAmt = big ? 1 : 0.4;
    const scatter = scatterAmt * (p < 0.575 ? seg(p, 0.4, 0.575) : 1 - seg(p, 0.575, 0.75));
    const gather = to === 'voxel' ? seg(p, 0.62, 0.82) : 0;
    const pts = { scatter, gather, size: 1 };
    if (MESH_SKINS.has(from) && p < 0.3) pts.reveal = out * 1.01;
    if (from === 'voxel' && p < 0.3) pts.gain = 1.6 * out;
    if (MESH_SKINS.has(to) && p > 0.75) pts.reveal = (1 - inn) * 1.01;   // 网格长出来的地方（aDis ≥ 溶解值）粒子收掉，只留还没长的
    if (to === 'voxel' && p > 0.8) pts.gain = 1.6 * (1 - seg(p, 0.85, 1));
    if (from === 'blueprint' && p < 0.3) { pts.tint = PALETTE.pink; pts.tintAmt = 1 - out; }
    if (to === 'blueprint' && p > 0.75) { pts.tint = PALETTE.pink; pts.tintAmt = inn; }
    if (to === 'points' && p > 0.75) { pts.reveal = 1.1; }
    L.points = pts;
    applyLayers(L, T);
  }

  // ---- 舞蹈 ----
  const choreoCache = new WeakMap();
  function dance(moves, T) {
    let choreo = moves;
    if (typeof moves === 'string') {
      choreo = choreoCache.get(dance) || new Map(); choreoCache.set(dance, choreo);
      if (!choreo.has(moves)) choreo.set(moves, createChoreo([{ beat: 0, move: resolveMove(moves) }], { clock }));
      choreo = choreo.get(moves);
    } else if (Array.isArray(moves)) {
      if (!choreoCache.has(moves)) choreoCache.set(moves, createChoreo(moves.map(e => ({ ...e, move: resolveMove(e.move) })), { clock, blend: 0.5 }));
      choreo = choreoCache.get(moves);
    }
    dancer.apply(choreo.at(T, dancer));
    return choreo;
  }
  /**
   * 动捕编排：seq = [{ beat | bar | t, anim: '名字' | move: '程序化舞步名', mirror, intensity, rate, offset }]，按开始时间排序。
   *   beat / bar = 音乐拍 / 小节（dance3d 拍数，0 = 第一个重拍）；t = 歌曲秒数（换成拍）。片段第 0 帧落在开始拍上。
   *   动作之间交叉淡入：seq.fade 秒（默认 0.25 s），淡入窗口在开始拍之前，所以新动作的第一拍正好在拍点上。
   */
  const playCache = new WeakMap();
  function play(seq, T) {
    if (!playCache.has(seq)) {
      const entries = seq.map(e => ({
        ...e,
        beat: e.beat ?? (e.bar != null ? clock.barToBeat(e.bar) : clock.beats(e.t)),
        move: e.anim ? clipMove(e) : resolveMove(e.move),
      }));
      playCache.set(seq, createChoreo(entries, { clock, blend: (seq.fade ?? 0.25) / clock.period }));
    }
    const ch = playCache.get(seq);
    dancer.apply(ch.at(T, dancer));
    return ch;
  }
  function pose(name, u = 0, o = {}) {
    const f = typeof name === 'function' ? name : POSES[name] || MOVES_X[name] || MOVES[name];
    if (!f) throw new Error(`girl.js：没有姿势 ${name}`);
    dancer.apply(dancer.solver.solve(normalizeSpecExport(f(u, o), o)));
  }

  dancer.headLimit = headLimit ? HEAD_LIMIT : null;
  root.updateMatrixWorld(true);
  const headRestInv = dancer.S.info.Head.bone.getWorldQuaternion(new THREE.Quaternion()).invert();   // 静止姿态（root 未转时）的头骨朝向
  const girl = {
    rebind, root, holder, model, mesh, hull, dancer, clock, skins: SKINS, materials: MATS, points: ptsObj, voxel: vox, uniforms: U, look,
    frontOnly: Object.assign(toonMat.clone(), { side: THREE.FrontSide }),   // 诊断用：不画背面（没有内衬）
    setSkin, morph, dance, play, pose, get skin() { return current; },
    /** 帮手：t 时刻的拍数（0 = 第一个重拍），写编舞表用 */
    beatOf: T => clock.beats(T),
    /** 自检：当前姿势的穿模 / 反关节（dance3d.checkPose） */
    check: opts => dancer.check(opts),
    /**
     * 定格自检：在 [T0, T1] 里每帧摆姿势，量手 / 脚 / 头（相对 root）在任意「1 拍」窗口内的最大位移；
     * 小于 minMove（身高 1 为单位）的窗口 = 定格。返回 [{ from, to, move }]（合并相邻帧）。
     * moves 同 dance() 的参数；也可以传函数 T => void 自己摆（比如混了 pose 的镜头）。
     */
    stillness(moves, T0, T1, { fps = 30, minMove = 0.035 } = {}) {
      const keys = ['LeftHand', 'RightHand', 'LeftFoot', 'RightFoot', 'Head'].map(k => dancer.S.info[k].bone);
      const inv = new THREE.Matrix4(), v = new THREE.Vector3(), frames = [];
      for (let f = Math.floor(T0 * fps); f <= Math.ceil(T1 * fps); f++) {
        const T = f / fps;
        if (typeof moves === 'function') moves(T); else dance(moves, T);
        root.updateWorldMatrix(true, true); inv.copy(root.matrixWorld).invert();
        frames.push({ T, p: keys.map(b => b.getWorldPosition(v).applyMatrix4(inv).clone()) });
      }
      const win = Math.round(mv.music.period * fps), out = [];
      for (let i = 0; i + win < frames.length; i++) {
        let m = 0;
        for (let j = i + 1; j <= i + win; j++) for (let k = 0; k < keys.length; k++) m = Math.max(m, frames[j].p[k].distanceTo(frames[i].p[k]));
        if (m < minMove) {
          const last = out[out.length - 1];
          if (last && frames[i].T - last.to < 1.5 / fps) last.to = frames[i + win].T; else out.push({ from: frames[i].T, to: frames[i + win].T, move: +m.toFixed(3) });
        }
      }
      return out;
    },
    /** 脸朝向（世界）：头骨相对静止姿态的转动作用在角色正前方（+Z） */
    faceForward(v = new THREE.Vector3()) {
      const hb = dancer.S.info.Head.bone;
      const qd = hb.getWorldQuaternion(new THREE.Quaternion()).multiply(headRestInv);
      return v.set(0, 0, 1).applyQuaternion(qd).normalize();
    },
    /** 头部世界坐标（给相机对焦 / 摆全息屏） */
    headPosition: (v = new THREE.Vector3()) => dancer.S.info.Head.bone.getWorldPosition(v),
  };
  girl.face = face === 'live' ? await createLiveFace(mv, girl) : null;
  setSkin('toon', 0);
  return girl;
}

// ================================================================ 万花筒
/**
 * 绕「相机 → center」轴把她复制成 copies 份（含本体），奇数份做镜像。
 * center：'feet'（默认，脚心，8 份像花瓣）| 'chest'（胸口，份与份叠成一朵更密的花）| 'head' | Vector3；创建时给默认，update 时可覆盖。
 * update(T, { camera, center, radius = 0 })：radius = 每份沿自己的方向外推（世界单位）。要整体旋转就转相机的 roll。
 * 克隆 = 同一骨架上的 SkinnedMesh（detached 绑定，bindMatrixInverse = I，所以它画在「本体世界坐标 × 本份变换」处）+ 共享粒子 / 体素几何。
 */
export function kaleido(girl, { copies = 8, center: centerOpt = 'feet' } = {}) {
  const group = new THREE.Group(); group.name = 'kaleido';
  const cloneSkinned = src => {
    const m = new THREE.SkinnedMesh(src.geometry, src.material);
    m.bind(src.skeleton, src.bindMatrix);
    m.bindMode = THREE.DetachedBindMode;
    m.bindMatrixInverse.identity();
    m.frustumCulled = false; m.matrixAutoUpdate = false;
    return m;
  };
  const slots = [];
  for (let k = 1; k < copies; k++) {
    const g = new THREE.Group(); g.matrixAutoUpdate = false;
    const body = cloneSkinned(girl.mesh);
    const hull = girl.hull ? cloneSkinned(girl.hull) : null;
    const pts = new THREE.Points(girl.points.geometry, girl.points.material); pts.frustumCulled = false; pts.matrixAutoUpdate = false;
    const vox = new THREE.InstancedMesh(girl.voxel.geometry, girl.voxel.material, girl.voxel.instanceMatrix.count);
    vox.instanceMatrix = girl.voxel.instanceMatrix; vox.instanceColor = girl.voxel.instanceColor; vox.frustumCulled = false; vox.matrixAutoUpdate = false;
    g.add(body, pts, vox); if (hull) g.add(hull);
    group.add(g);
    slots.push({ k, g, body, hull, pts, vox });
  }
  const c = new THREE.Vector3(), axis = new THREE.Vector3(), T1 = new THREE.Matrix4(), T2 = new THREE.Matrix4(), R = new THREE.Matrix4(), Mi = new THREE.Matrix4();
  const _n = new THREE.Vector3(), _up = new THREE.Vector3();
  function update(T, { camera, center = null, radius = 0 } = {}) {
    const mode = center ?? centerOpt;
    if (mode && mode.isVector3) c.copy(mode);
    else if (mode === 'chest') girl.dancer.S.info.Spine2.bone.getWorldPosition(c);
    else if (mode === 'head') girl.headPosition(c);
    else girl.root.getWorldPosition(c).add(new THREE.Vector3(0, 0.04, 0));
    axis.copy(c).sub(camera.getWorldPosition(new THREE.Vector3())).normalize();
    // 镜面：过轴、且包含她自己的竖直方向（root 的 +Y）—— 用相机的 up 会在相机转 roll 时让镜像份歪掉
    _up.set(0, 1, 0).applyQuaternion(girl.root.getWorldQuaternion(new THREE.Quaternion()));
    _up.addScaledVector(axis, -_up.dot(axis));
    if (_up.lengthSq() < 1e-6) _up.set(0, 1, 0).applyQuaternion(camera.getWorldQuaternion(new THREE.Quaternion()));
    _n.crossVectors(axis, _up).normalize();
    const n = _n;
    Mi.set(1 - 2 * n.x * n.x, -2 * n.x * n.y, -2 * n.x * n.z, 0, -2 * n.x * n.y, 1 - 2 * n.y * n.y, -2 * n.y * n.z, 0, -2 * n.x * n.z, -2 * n.y * n.z, 1 - 2 * n.z * n.z, 0, 0, 0, 0, 1);
    T1.makeTranslation(c.x, c.y, c.z); T2.makeTranslation(-c.x, -c.y, -c.z);
    for (const s of slots) {
      const ang = (2 * Math.PI * s.k) / copies;
      R.makeRotationAxis(axis, ang);
      const G = new THREE.Matrix4().copy(T1).multiply(R);
      if (s.k % 2 === 1) G.multiply(Mi);
      if (radius) { const off = new THREE.Vector3().crossVectors(axis, n).applyAxisAngle(axis, ang).multiplyScalar(-radius); G.premultiply(new THREE.Matrix4().makeTranslation(off.x, off.y, off.z)); }
      G.multiply(T2);
      s.g.matrix.copy(G); s.g.matrixWorldNeedsUpdate = true;
      // 同步可见性与材质
      s.body.visible = girl.mesh.visible; s.body.material = girl.mesh.material;
      if (s.hull) s.hull.visible = !!girl.hull?.visible;
      s.pts.visible = girl.points.visible;
      s.vox.visible = girl.voxel.visible; s.vox.count = girl.voxel.count;
    }
    return group;
  }
  return { group, update, copies };
}

// ================================================================ 多人队形（替代「叠成一圈」的万花筒）
// 克隆 = 同一骨架上的 SkinnedMesh（detached 绑定，bindMatrixInverse = I）：画在「源的世界蒙皮结果 × 本份矩阵 G」处，
// 所以同一个源的所有克隆动作完全一致；要错拍（卡农）就得有独立骨架 → 每一排一个源 girl。
function skinnedClone(src) {
  const m = new THREE.SkinnedMesh(src.geometry, src.material);
  m.bind(src.skeleton, src.bindMatrix);
  m.bindMode = THREE.DetachedBindMode;
  m.bindMatrixInverse.identity();
  m.frustumCulled = false; m.matrixAutoUpdate = false;
  return m;
}

/**
 * 整列伴舞：rows × cols 方阵，前排正中是本体（镜头照常摆 lead.root），其余是复制。
 *   const crew = await createFormation(mv, lead, { rows: 3, cols: 5, spacing: [1.05, 1.3], canon: 1, mirror: true });
 *   scene.add(crew.group); 每帧先摆好 lead（root / play / setSkin），再 crew.update(T, { seq })。
 *   canon：后一排比前一排晚几拍（卡农）；mirror：列与列左右镜像交替（离中间奇数列镜像）。
 *   队形跟着本体的位置和朝向走（排在她身后）。每一排一个独立骨架（额外 rows−1 个 girl 实例，points 采样很少）。
 *   只支持网格皮肤（toon / chrome / hologram / blueprint）。
 */
export async function createFormation(mv, lead, { rows = 3, cols = 5, spacing = [1.05, 1.3], canon = 1, mirror = true } = {}) {
  const extras = [];
  for (let r = 1; r < rows; r++) extras.push(await createGirl(mv, { points: 400, seed: 20260929 + r }));
  const sources = [lead, ...extras];
  const group = new THREE.Group(); group.name = 'formation';
  const mid = (cols - 1) / 2;
  const slots = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (r === 0 && c === Math.round(mid)) continue;                 // 本体
    const src = sources[r];
    const g = new THREE.Group(); g.matrixAutoUpdate = false;
    const body = skinnedClone(src.mesh), hull = src.hull ? skinnedClone(src.hull) : null;
    g.add(body); if (hull) g.add(hull);
    group.add(g);
    const off = new THREE.Vector3((c - mid) * spacing[0], 0, -r * spacing[1]);
    const mir = mirror && Math.abs(c - Math.round(mid)) % 2 === 1;
    slots.push({ r, c, g, body, hull, src, off, mir });
  }
  const M = new THREE.Matrix4(), inv = new THREE.Matrix4(), mirM = new THREE.Matrix4().makeScale(-1, 1, 1);
  function update(T, { seq = null, moves = null, skin = null } = {}) {
    lead.root.updateWorldMatrix(true, true);
    for (let r = 1; r < rows; r++) {
      const s = sources[r], tt = T - r * canon * mv.music.period;
      s.root.position.set(0, 0, 0); s.root.rotation.set(0, 0, 0); s.root.scale.setScalar(1);
      if (seq) s.play(seq, tt); else if (moves) s.dance(moves, tt);
      s.setSkin(skin ?? lead.skin, T);
      s.root.updateWorldMatrix(true, true);
    }
    for (const sl of slots) {
      // G = 本体根 × 平移到队位 × （镜像）× 源根⁻¹
      inv.copy(sl.src.root.matrixWorld).invert();
      M.copy(lead.root.matrixWorld).multiply(new THREE.Matrix4().makeTranslation(sl.off.x, sl.off.y, sl.off.z));
      if (sl.mir) M.multiply(mirM);
      M.multiply(inv);
      sl.g.matrix.copy(M); sl.g.matrixWorldNeedsUpdate = true;
      sl.body.material = sl.src.mesh.material; sl.body.visible = sl.src.mesh.visible;
      if (sl.hull) sl.hull.visible = !!sl.src.hull?.visible;
    }
    return group;
  }
  return { group, update, sources, slots, count: rows * cols };
}

/**
 * 镜面房间：她站在由平面镜围成的房间里 —— 左右两面侧镜（x = ±halfWidth）+ 背后一面（z = −back）+ 镜头身后一面（z = +front）。
 * 镜像按真实光路算：侧镜来回反射 → 左右无限排开，前后两面对照 → 沿纵深无限延伸；每多反射一次暗一点、偏一点冷色（真镜子会吸光）。
 *   const room = mirrorRoom(lead, { halfWidth: 1.6, back: 1.4, front: 3.6, nx: 3, nz: 5 });
 *   scene.add(room.group); 每帧摆好 lead 之后 room.update(T)。
 *   房间中心 = room.group.position（只平移，不转）。镜子本身画成：极淡的玻璃 + 发光镜框，镜框的镜像也一起排出去。
 */
export function mirrorRoom(lead, { halfWidth = 1.6, back = 1.4, front = 3.6, height = 2.6, nx = 3, nz = 5, dim = 0.84, tint = PALETTE.mint, hullDepth = 2 } = {}) {
  const group = new THREE.Group(); group.name = 'mirror-room';
  const a = halfWidth, b = back, f = front;
  // 镜框（一套，所有镜像共享几何）
  const frameMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(tint).multiplyScalar(2.2) });
  const glassMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(tint).multiplyScalar(0.25), transparent: true, opacity: 0.06, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
  const frame = new THREE.Group();
  const bar = (w, h, d, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), frameMat); m.position.set(x, y, z); frame.add(m); };
  const T_ = 0.025;
  for (const sx of [-1, 1]) {                    // 两面侧镜：竖边 + 上下边
    bar(T_, height, T_, sx * a, height / 2, -b); bar(T_, height, T_, sx * a, height / 2, f);
    bar(T_, T_, b + f, sx * a, height, (f - b) / 2); bar(T_, T_, b + f, sx * a, 0.01, (f - b) / 2);
  }
  bar(2 * a, T_, T_, 0, height, -b); bar(2 * a, T_, T_, 0, 0.01, -b);   // 背镜上下边
  const glass = new THREE.Group();
  const pane = (w, h, x, z, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glassMat); m.position.set(x, h / 2, z); m.rotation.y = ry; glass.add(m); };
  pane(b + f, height, -a, (f - b) / 2, Math.PI / 2); pane(b + f, height, a, (f - b) / 2, -Math.PI / 2); pane(2 * a, height, 0, -b, 0);
  group.add(frame, glass);
  // 镜像：x 方向第 n 个像（n ≠ 0 时镜像 (-1)^n），z 方向（背镜后面）第 m 个像；(0,0) 是本体
  const images = [];
  const matCache = new Map();
  for (let m = 0; m <= nz; m++) for (let n = -nx; n <= nx; n++) {
    if (!m && !n) continue;
    const sx = n % 2 ? -1 : 1, tx = 2 * a * n;
    const sz = m % 2 ? -1 : 1, tz = m === 0 ? 0 : m % 2 ? -2 * b - (m - 1) * (b + f) : -m * (b + f);
    const G = new THREE.Matrix4().makeScale(sx, 1, sz).premultiply(new THREE.Matrix4().makeTranslation(tx, 0, tz));
    const level = Math.abs(n) + m;
    const g = new THREE.Group(); g.matrixAutoUpdate = false;
    const body = skinnedClone(lead.mesh), hull = lead.hull && level <= hullDepth ? skinnedClone(lead.hull) : null;
    g.add(body); if (hull) g.add(hull);
    const fr = frame.clone(); fr.matrixAutoUpdate = false; fr.matrix.copy(G);      // 镜框的镜像（局部坐标里摆，所以不用 G⁻¹）
    group.add(g, fr);
    images.push({ n, m, G, g, body, hull, level });
  }
  const dimColor = level => new THREE.Color(1, 1, 1).lerp(new THREE.Color(tint), Math.min(0.5, level * 0.07)).multiplyScalar(Math.pow(dim, level));
  const matFor = (mat, level) => {
    const key = mat.uuid + ':' + level;
    if (!matCache.has(key)) { const c = mat.clone(); if (c.color) c.color.copy(mat.color ?? new THREE.Color(1, 1, 1)).multiply(dimColor(level)); matCache.set(key, c); }
    return matCache.get(key);
  };
  const O = new THREE.Matrix4(), Oi = new THREE.Matrix4(), W = new THREE.Matrix4();
  function update() {
    group.updateWorldMatrix(true, false);
    O.makeTranslation(group.position.x, group.position.y, group.position.z); Oi.copy(O).invert();
    for (const im of images) {
      // 克隆画在「世界蒙皮结果 × W」处：W = O · G · O⁻¹（关于房间中心反射）；g 挂在 group 下，要先抵掉 group 的世界矩阵
      W.copy(O).multiply(im.G).multiply(Oi);
      im.g.matrix.copy(group.matrixWorld).invert().multiply(W); im.g.matrixWorldNeedsUpdate = true;
      im.body.visible = lead.mesh.visible;
      im.body.material = lead.mesh.material.isShaderMaterial ? lead.mesh.material : matFor(lead.mesh.material, im.level);
      if (im.hull) im.hull.visible = !!lead.hull?.visible;
    }
    return group;
  }
  return { group, update, images, bounds: { halfWidth: a, back: b, front: f, height } };
}

// ================================================================ 实时 2D 脸（#926 → #931 返工：干净贴图 + 五官贴花）
// ① 干净贴图：在 4K 原贴图上把原来的眼睛、眉毛、嘴抹成肤色（face-4k.json 的 erase 椭圆，按 UV 逐纹素找回它在脸上的位置，只动脸皮、不动挂在脸前的刘海；
//    用周边皮肤 pull-push 修补），生成一张新的 CanvasTexture 换给材质。原贴图不动（girl.face.originalMap）。
// ② 五官贴花：左眼、右眼、左眉、右眉、嘴五块（tools/face-bake/decals.py 从 2D 近景分层抠出，只有五官，没有刘海 / 轮廓 / 下巴线），
//    每帧画进一张 2048² 透明画布，画布 = 脸正面的正交投影（face-4k.json 的 box）。着色器里按片段的静止姿态坐标 (x, y) 取样，
//    所以每个像素都精确，3/4 侧时远侧的眼睛按曲面自然变窄（投影压缩），不会被三角形插值拉歪。
// ③ 表演：眼睛默认睁开；眨眼 = 半闭 1 帧 + 全闭 2 帧 + 半闭 1 帧；smile = 睁眼 + 笑嘴（眯眼笑要明确写 happy）；
//    口型贴花大小固定，张嘴时上唇线不动、向下扩。
//   girl.face.update(T, { line, expression, blink: 'auto' | false | 'closed'…, camera })
//     outline：脸轮廓描边，默认 true = 单侧渐细（只描脸转过去那侧的下颌）；'full' = 下颌一圈全描；false = 关
//     style：'A'（立绘原角度，允许 yaw = artYaw ± 12°）/ 'B'（正面化五官，允许 ±20°，默认）/ 'Y'（多角度组按 yaw 交叉淡化，#936）；limits:false = 不按范围淡出（对照图用）
//     expression：neutral / smile（睁眼 + 嘴角上扬的闭口笑）/ grin（露齿笑）/ happy（眯眼笑）/ surprised / wink / closed；line 省略 = 所有歌词都开口；mouth: 'a' 等 = 强制口型、mouthScale = 嘴大小倍数（对照图用）
export const FACE_YAW = { full: 45, off: 70 };      // 分镜规则仍然是「唱歌镜头偏航 ≤ 45°」；贴花本身不再按偏航淡出
const DECAL_DIR = new URL('./face-decals/', import.meta.url);
const DECAL_FRONT_DIR = new URL('./face-decals-front/', import.meta.url);
const DECAL_YAW_DIR = new URL('./face-decals-yaw/', import.meta.url);
const FACE4K_URL = new URL('./face-4k.json', import.meta.url);
const _faceAssets = { p: null };
async function faceAssets() {
  if (!_faceAssets.p) _faceAssets.p = (async () => {
    // 两套五官：A = 立绘原样（自带朝她右侧约 4° 的角度）；B = 正面化（转正滚转、两眼等大、嘴左右对称，tools/face-bake/decals.py 生成）
    const cfg = await fetch(FACE4K_URL).then(r => r.json());
    const loadSet = async dir => {
      const meta = await fetch(new URL('decals.json', dir)).then(r => r.json());
      const load = f => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => rej(new Error(`读不到 ${f}`)); im.src = new URL(f, dir).href; });
      const imgs = {};
      await Promise.all(Object.entries(meta.parts).flatMap(([part, P]) => Object.entries(P.states).map(async ([st, S]) => { imgs[part + '/' + st] = await load(S.file); })));
      return { meta, imgs };
    };
    const [A, B] = await Promise.all([loadSet(DECAL_DIR), loadSet(DECAL_FRONT_DIR)]);
    // 多角度组（#936）：face-decals-yaw/index.json 列出的每组 = 千问按该角度生成、分层抠出的五官（没有眉毛，缺的状态用 B 套补）
    const idx = await fetch(new URL('index.json', DECAL_YAW_DIR)).then(r => (r.ok ? r.json() : { groups: [] })).catch(() => ({ groups: [] }));
    const yawSets = await Promise.all(idx.groups.map(async g => { const st = await loadSet(new URL(g + '/', DECAL_YAW_DIR)); return { ...st, yaw: st.meta.yaw, name: g }; }));
    return { cfg, sets: { A, B }, yawSets };
  })();
  return _faceAssets.p;
}

/** 在原贴图上抹掉五官：返回 { canvas, vIsland（每顶点是不是脸皮）, stats }。只动脸皮三角形里、静止姿态落在 erase 椭圆内的纹素 */
function cleanFaceTexture(mesh, image, cfg) {
  const g = mesh.geometry, P = g.attributes.position, UV = g.attributes.uv, idx = g.index.array;
  const W = image.width, H = image.height;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(image, 0, 0);
  // 哪些顶点 / 三角形是「脸皮」（刘海、发丝挂在脸前面，不能被抹、也不能被画上眉毛）：
  //   在脸部椭圆（face-4k.json region）里，每个顶点和附近贴图颜色像皮肤的顶点比深度：
  //   高出局部脸面 > hairEps 的是刘海 / 发丝，其余算脸皮（眉毛、眼睛、嘴缝颜色不像皮肤，但深度和脸面一样，也算）。
  const [bx0, by0, bx1, by1] = cfg.box, nTri = idx.length / 3, RG = cfg.region;
  const inRegion = (x, y) => ((x - RG.c[0]) / RG.r[0]) ** 2 + ((y - RG.c[1]) / RG.r[1]) ** 2 <= 1;
  const colAt = (u, v) => ctx.getImageData(Math.min(W - 1, Math.max(0, Math.floor(u * W))), Math.min(H - 1, Math.max(0, Math.floor(v * H))), 1, 1).data;
  const skinLike = c => c[0] > 170 && c[0] >= c[1] && c[1] >= c[2] - 8 && c[0] - c[2] > 15 && c[0] - c[2] < 120 && c[1] > 110;
  const cand = [];
  for (let v = 0; v < P.count; v++) { const x = P.getX(v), y = P.getY(v), z = P.getZ(v); if (z > 0 && inRegion(x, y)) cand.push(v); }
  // 每个候选顶点的「局部脸面高度」= 附近（半径 6 mm，不够 5 个就放大到 12 mm）皮肤色顶点 z 的中位数
  const skinV = cand.filter(v => skinLike(colAt(UV.getX(v), UV.getY(v))));
  const zRef = new Float32Array(P.count).fill(NaN);
  for (const v of cand) {
    const x = P.getX(v), y = P.getY(v);
    for (const r of [0.006, 0.012, 0.02]) {
      const zs = [];
      for (const w of skinV) { const dx = P.getX(w) - x, dy = P.getY(w) - y; if (dx * dx + dy * dy < r * r) zs.push(P.getZ(w)); }
      if (zs.length >= 5) { zs.sort((p, q) => p - q); zRef[v] = zs[zs.length >> 1]; break; }
    }
  }
  const fitSet = skinV;
  const EPS = cfg.hairEps ?? 0.003;
  const vIsland = new Uint8Array(P.count);
  // 每处的 eps：erase 第 5 个数；负数 = 这一处只按深度判（|eps|），不看颜色
  const epsAt = (x, y) => { let e = EPS, depthOnly = false; for (const [cx, cy, rx, ry, ee] of cfg.erase) if (ee && Math.hypot((x - cx) / rx, (y - cy) / ry) < 1.35) { if (ee < 0) { depthOnly = true; e = Math.max(e, -ee); } else e = Math.max(e, ee); } return [e, depthOnly]; };
  // 刘海 = 明显高出脸面（> 12 mm），或者高出 eps 且贴图颜色像头发（棕色、不太暗）。睫毛（近黑）、眼睑、虹膜凸出一点不算
  const hairColor = c => c[0] > 70 && c[0] < 215 && c[0] - c[2] > 45 && c[1] < c[0] * 0.78;
  for (const v of cand) {
    const dz = P.getZ(v) - zRef[v];
    const [e, depthOnly] = epsAt(P.getX(v), P.getY(v));
    if ((!depthOnly && dz > 0.012) || (dz > e && (depthOnly || hairColor(colAt(UV.getX(v), UV.getY(v)))))) continue;
    vIsland[v] = 1;
  }
  const dzStats = E0 => E0.map(([cx, cy, rx, ry]) => { const d = cand.filter(v => Math.hypot((P.getX(v) - cx) / rx, (P.getY(v) - cy) / ry) < 1).map(v => +(P.getZ(v) - zRef[v]).toFixed(4)).sort((p, q) => p - q); return [0, 0.25, 0.5, 0.75, 0.9, 1].map(q => d[Math.min(d.length - 1, Math.floor(q * d.length))]); });
  const inIsland = new Uint8Array(nTri);
  for (let t = 0; t < nTri; t++) inIsland[t] = vIsland[idx[t * 3]] && vIsland[idx[t * 3 + 1]] && vIsland[idx[t * 3 + 2]] ? 1 : 0;
  // 抹除权重（静止姿态 x, y）
  const E = cfg.erase, fe = cfg.feather;
  const eraseW = (x, y) => { let w = 0; for (const [cx, cy, rx, ry] of E) { const r = Math.hypot((x - cx) / rx, (y - cy) / ry); w = Math.max(w, 1 - clamp((r - 1) / fe)); } return w; };
  // 候选三角形：岛内、朝前、在脸框附近
  const tris = [];
  let u0 = Infinity, v0 = Infinity, u1 = -Infinity, v1 = -Infinity;
  for (let t = 0; t < nTri; t++) {
    if (!inIsland[t]) continue;
    const vs = [idx[t * 3], idx[t * 3 + 1], idx[t * 3 + 2]];
    if (vs.some(v => P.getX(v) < bx0 || P.getX(v) > bx1 || P.getY(v) < by0 || P.getY(v) > by1)) continue;
    const q = vs.map(v => [UV.getX(v) * W, UV.getY(v) * H, P.getX(v), P.getY(v)]);
    q.t = t; tris.push(q);
    for (const p of q) { u0 = Math.min(u0, p[0]); v0 = Math.min(v0, p[1]); u1 = Math.max(u1, p[0]); v1 = Math.max(v1, p[1]); }
  }
  const pad = 8;
  const X0 = Math.max(0, Math.floor(u0) - pad), Y0 = Math.max(0, Math.floor(v0) - pad), X1 = Math.min(W, Math.ceil(u1) + pad), Y1 = Math.min(H, Math.ceil(v1) + pad);
  const cw = X1 - X0, ch = Y1 - Y0;
  const img = ctx.getImageData(X0, Y0, cw, ch), px = img.data;
  const hole = new Float32Array(cw * ch), cover = new Uint8Array(cw * ch), rr = new Float32Array(cw * ch).fill(9), RG0 = cfg.region;
  for (const [a, b, c] of tris) {
    const minx = Math.max(X0, Math.floor(Math.min(a[0], b[0], c[0]))), maxx = Math.min(X1 - 1, Math.ceil(Math.max(a[0], b[0], c[0])));
    const miny = Math.max(Y0, Math.floor(Math.min(a[1], b[1], c[1]))), maxy = Math.min(Y1 - 1, Math.ceil(Math.max(a[1], b[1], c[1])));
    const den = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1]);
    if (Math.abs(den) < 1e-9) continue;
    for (let y = miny; y <= maxy; y++) for (let x = minx; x <= maxx; x++) {
      const sx = x + 0.5, sy = y + 0.5;
      const l0 = ((b[1] - c[1]) * (sx - c[0]) + (c[0] - b[0]) * (sy - c[1])) / den, l1 = ((c[1] - a[1]) * (sx - c[0]) + (a[0] - c[0]) * (sy - c[1])) / den, l2 = 1 - l0 - l1;
      if (l0 < -0.02 || l1 < -0.02 || l2 < -0.02) continue;
      const k = (y - Y0) * cw + (x - X0);
      cover[k] = 1;
      const X = l0 * a[2] + l1 * b[2] + l2 * c[2], Y = l0 * a[3] + l1 * b[3] + l2 * c[3], ew = eraseW(X, Y);
      hole[k] = Math.max(hole[k], ew);
      rr[k] = Math.min(rr[k], ew > 0 ? 9 : Math.hypot((X - RG0.c[0]) / RG0.r[0], (Y - RG0.c[1]) / RG0.r[1]));
    }
  }
  // 纹理缝外的填充带（mipmap / 双线性会取到）：没被三角形覆盖、但挨着抹除区的纹素也一起抹
  for (let it = 0; it < 4; it++) {
    const h2 = hole.slice();
    for (let y = 1; y < ch - 1; y++) for (let x = 1; x < cw - 1; x++) {
      const k = y * cw + x; if (cover[k]) continue;
      const m = Math.max(hole[k - 1], hole[k + 1], hole[k - cw], hole[k + cw]);
      if (m > h2[k]) h2[k] = m;
    }
    hole.set(h2);
  }
  // pull-push 修补：已知 = 被覆盖且不在抹除区的皮肤纹素
  let lv = { w: cw, h: ch, c: new Float32Array(cw * ch * 3), a: new Float32Array(cw * ch) };
  for (let k = 0; k < cw * ch; k++) if (cover[k] && hole[k] <= 0 && skinLike([px[k * 4], px[k * 4 + 1], px[k * 4 + 2]])) { lv.a[k] = 1; lv.c[k * 3] = px[k * 4]; lv.c[k * 3 + 1] = px[k * 4 + 1]; lv.c[k * 3 + 2] = px[k * 4 + 2]; }
  const lv0a = lv.a.slice(), pyr = [lv];
  while (lv.w > 1 || lv.h > 1) {
    const w = Math.max(1, lv.w >> 1), h = Math.max(1, lv.h >> 1), n = { w, h, c: new Float32Array(w * h * 3), a: new Float32Array(w * h) };
    for (let y = 0; y < lv.h; y++) for (let x = 0; x < lv.w; x++) {
      const k = y * lv.w + x, j = Math.min(h - 1, y >> 1) * w + Math.min(w - 1, x >> 1);
      n.a[j] += lv.a[k]; n.c[j * 3] += lv.c[k * 3]; n.c[j * 3 + 1] += lv.c[k * 3 + 1]; n.c[j * 3 + 2] += lv.c[k * 3 + 2];
    }
    for (let j = 0; j < w * h; j++) if (n.a[j] > 1) { const s = 1 / n.a[j]; n.c[j * 3] *= s; n.c[j * 3 + 1] *= s; n.c[j * 3 + 2] *= s; n.a[j] = 1; }
    pyr.push(n); lv = n;
  }
  for (let l = pyr.length - 2; l >= 0; l--) {
    const f = pyr[l], c = pyr[l + 1];
    for (let y = 0; y < f.h; y++) for (let x = 0; x < f.w; x++) {
      const k = y * f.w + x; if (f.a[k] >= 1) continue;
      const j = Math.min(c.h - 1, y >> 1) * c.w + Math.min(c.w - 1, x >> 1), r = 1 - f.a[k];
      f.c[k * 3] += c.c[j * 3] * r; f.c[k * 3 + 1] += c.c[j * 3 + 1] * r; f.c[k * 3 + 2] += c.c[j * 3 + 2] * r;   // c = 已知颜色 × 权重（权重 < 1）+ 粗一级补足
      f.a[k] = 1;
    }
  }
  // 抹除区的颜色：局部 pull-push 结果和「全脸皮肤中位色」混合 —— 眼窝附近的贴图画了棕色眼影，纯局部修补会留下一圈深色的「鬼眼」
  const F = pyr[0], med = [0, 1, 2].map(i => { const a = []; for (let k = 0; k < cw * ch; k += 7) if (lv0a[k] && rr[k] < 0.75) a.push(px[k * 4 + i]); a.sort((p, q) => p - q); return a[a.length >> 1] ?? 220; });
  const LOCAL = cfg.localFill ?? 0.35;
  let n = 0;
  for (let k = 0; k < cw * ch; k++) {
    const w = hole[k]; if (w <= 0) continue; n++;
    for (let ch3 = 0; ch3 < 3; ch3++) px[k * 4 + ch3] = Math.round(px[k * 4 + ch3] * (1 - w) + (F.c[k * 3 + ch3] * LOCAL + med[ch3] * (1 - LOCAL)) * w);
  }
  // 左右半脸肤色拉平：脸中线是 UV 缝，两半颜色不一样（左半偏粉）。各自往两半的平均色靠一半，只在脸部椭圆里、到边缘淡出
  const bal = [];
  if (cfg.balance) {
    const sum = [[0, 0, 0, 0], [0, 0, 0, 0]], side = new Int8Array(cw * ch).fill(-1), wgt = new Float32Array(cw * ch);
    for (const [a, b, c] of tris) {
      const minx = Math.max(X0, Math.floor(Math.min(a[0], b[0], c[0]))), maxx = Math.min(X1 - 1, Math.ceil(Math.max(a[0], b[0], c[0])));
      const miny = Math.max(Y0, Math.floor(Math.min(a[1], b[1], c[1]))), maxy = Math.min(Y1 - 1, Math.ceil(Math.max(a[1], b[1], c[1])));
      const den = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1]); if (Math.abs(den) < 1e-9) continue;
      for (let y = miny; y <= maxy; y++) for (let x = minx; x <= maxx; x++) {
        const l0 = ((b[1] - c[1]) * (x + 0.5 - c[0]) + (c[0] - b[0]) * (y + 0.5 - c[1])) / den, l1 = ((c[1] - a[1]) * (x + 0.5 - c[0]) + (a[0] - c[0]) * (y + 0.5 - c[1])) / den, l2 = 1 - l0 - l1;
        if (l0 < -0.02 || l1 < -0.02 || l2 < -0.02) continue;
        const X = l0 * a[2] + l1 * b[2] + l2 * c[2], Y = l0 * a[3] + l1 * b[3] + l2 * c[3], k = (y - Y0) * cw + (x - X0);
        const r = Math.hypot((X - RG.c[0]) / RG.r[0], (Y - RG.c[1]) / RG.r[1]);
        side[k] = X < 0 ? 0 : 1; wgt[k] = 1 - clamp((r - 0.75) / 0.3);
        if (r < 0.8 && skinLike([px[k * 4], px[k * 4 + 1], px[k * 4 + 2]])) { const S = sum[side[k]]; S[0] += px[k * 4]; S[1] += px[k * 4 + 1]; S[2] += px[k * 4 + 2]; S[3]++; }
      }
    }
    const m = sum.map(S => [S[0] / S[3], S[1] / S[3], S[2] / S[3]]), avg = [0, 1, 2].map(i => (m[0][i] + m[1][i]) / 2);
    for (let k = 0; k < cw * ch; k++) { if (side[k] < 0 || wgt[k] <= 0) continue; for (let i = 0; i < 3; i++) px[k * 4 + i] = Math.round(Math.min(255, px[k * 4 + i] * (1 + (avg[i] / m[side[k]][i] - 1) * wgt[k]))); }
    bal.push(m.map(c => c.map(v => Math.round(v))));
  }
  if (cfg.debugHoles) for (let k = 0; k < cw * ch; k++) { if (hole[k] > 0) { px[k * 4] = 255; px[k * 4 + 1] = 0; px[k * 4 + 2] = 0; } else if (cover[k]) { px[k * 4 + 1] = Math.min(255, px[k * 4 + 1] + 90); } }
  ctx.putImageData(img, X0, Y0);
  return { canvas: cv, vIsland, cand, zRef, inIsland, tris, crop: [X0, Y0, cw, ch], cover, stats: { texels: n, crop: [X0, Y0, cw, ch], skinTris: inIsland.reduce((s, v) => s + v, 0), fitVerts: fitSet.length, candVerts: cand.length, dz: dzStats(cfg.erase), halves: bal, skinMedian: med } };
}

// 屏幕点的凸包（单调链，逆时针）与点在凸包内判定
function convexHull(pts) {
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (p.length < 3) return p;
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo.at(-2), lo.at(-1), q) <= 0) lo.pop(); lo.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up.at(-2), up.at(-1), q) <= 0) up.pop(); up.push(q); }
  up.pop(); lo.pop(); return lo.concat(up);
}
function inHull(h, q) {   // 与绕向无关：所有边的叉积同号
  let pos = false, neg = false;
  for (let i = 0; i < h.length; i++) { const a = h[i], b = h[(i + 1) % h.length], c = (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]); if (c > 0) pos = true; else if (c < 0) neg = true; if (pos && neg) return false; }
  return true;
}
async function createLiveFace(mv, girl) {
  const { sets, cfg: cfg0, yawSets } = await faceAssets();
  let style = cfg0.style ?? 'B', meta = sets[style].meta, imgs = sets[style].imgs;   // 五官套：A 立绘原角度 / B 正面化
  // 调试 / 清晰度对照用的 URL 参数（正片不带）：faceholes=1 看抹除区；faceres=512 画布分辨率；facemip=0 关 mipmap
  const QS = new URLSearchParams(location.search);
  const cfg = { ...cfg0, debugHoles: QS.get('faceholes') === '1', canvas: +(QS.get('faceres') || cfg0.canvas) };
  const mesh = girl.mesh, g = mesh.geometry, P = g.attributes.position, Nn = g.attributes.normal, n = P.count;
  // ---- ① 干净贴图
  const toon = girl.materials.toon, originalMap = toon.map;
  const clean = cleanFaceTexture(mesh, originalMap.image, cfg);
  const cleanMap = new THREE.CanvasTexture(clean.canvas);
  cleanMap.colorSpace = originalMap.colorSpace; cleanMap.flipY = originalMap.flipY; cleanMap.wrapS = originalMap.wrapS; cleanMap.wrapT = originalMap.wrapT;
  cleanMap.anisotropy = 8; cleanMap.needsUpdate = true;
  const swap = m => { if (!m) return; for (const k of ['map', 'emissiveMap']) if (m[k] === originalMap) m[k] = cleanMap; m.needsUpdate = true; };
  swap(toon); swap(girl.frontOnly); for (const it of girl.look.items) { swap(it.pbr); [it.toon].flat().forEach(swap); }
  // ---- ② 贴花覆盖权重（每顶点）：脸皮上、朝前的顶点（刘海 / 发丝在脸皮前面，不算，所以不会被画上眉毛）
  const aMix = new Float32Array(n);
  const [bx0, by0, bx1, by1] = cfg.box;
  for (let i = 0; i < n; i++) {
    if (!clean.vIsland[i]) continue;
    const x = P.getX(i), y = P.getY(i), z = P.getZ(i);
    if (z < 0 || x < bx0 || x > bx1 || y < by0 || y > by1) continue;
    aMix[i] = clamp((Nn.getZ(i) + 0.25) / 0.35);     // 唇缝、眼窝的法线偏上 / 偏下也要贴上
    const [mcx, mcy, mrx, mry] = cfg.erase[4];
    if (Math.hypot((x - mcx) / mrx, (y - mcy) / (mry * 2.2)) < 1.25) aMix[i] = 1;   // 嘴：网格上有一道嘴缝（里面的面朝内），张嘴贴花要盖满它
  }
  g.setAttribute('aFaceMix', new THREE.BufferAttribute(aMix, 1));
  // 脸内圈用平滑法线打光：4K 网格的眼窝、嘴缝、鼻翼有起伏，toon 分阶会把它们画成一圈圈明暗线（贴花之外的「脏线」）。
  // 每个脸皮顶点的法线换成半径 smoothNormal.radius 内法线的高斯加权平均，再往正前方压 flat；内圈全换、到 outer 淡回原法线。
  const SN = cfg.smoothNormal, aFN = new Float32Array(n * 3), aFS = new Float32Array(n);
  {
    const RG = cfg.region, r2 = SN.radius * SN.radius, cs = clean.cand;
    for (const i of cs) {
      const r = Math.hypot((P.getX(i) - RG.c[0]) / RG.r[0], (P.getY(i) - RG.c[1]) / RG.r[1]);
      const w0 = 1 - clamp((r - SN.inner) / (SN.outer - SN.inner)); if (w0 <= 0) continue;
      let nx = 0, ny = 0, nz = 0;
      for (const j of cs) { const dx = P.getX(j) - P.getX(i), dy = P.getY(j) - P.getY(i), dz = P.getZ(j) - P.getZ(i), d2 = dx * dx + dy * dy + dz * dz; if (d2 > r2 || Nn.getZ(j) < -0.2) continue; const w = Math.exp(-3 * d2 / r2); nx += Nn.getX(j) * w; ny += Nn.getY(j) * w; nz += Nn.getZ(j) * w; }
      let L = Math.hypot(nx, ny, nz) || 1; nx /= L; ny /= L; nz /= L;
      const fl = SN.flat ?? 0.8; nx *= 1 - fl; ny *= 1 - fl; nz = nz * (1 - fl) + fl;     // 再往正前方（+Z）压：整张脸受光一致，toon 分阶线不会横穿五官
      L = Math.hypot(nx, ny, nz) || 1;
      aFN[i * 3] = nx / L; aFN[i * 3 + 1] = ny / L; aFN[i * 3 + 2] = nz / L; aFS[i] = w0;
    }
  }
  g.setAttribute('aFaceN', new THREE.BufferAttribute(aFN, 3));
  g.setAttribute('aFaceSmooth', new THREE.BufferAttribute(aFS, 1));
  // 描边外壳在脸的内圈一律不画（外壳背面会从鼻梁、嘴缝、眼窝穿出来成黑线）；外圈（脸颊到下颌的轮廓）照常描边
  const aFace = g.attributes.aFace;
  if (aFace) {
    const RG = cfg.region, inner = cfg.innerOutline ?? 0.8;
    for (let i = 0; i < n; i++) {
      if (P.getZ(i) < 0) continue;
      const r = Math.hypot((P.getX(i) - RG.c[0]) / RG.r[0], (P.getY(i) - RG.c[1]) / RG.r[1]);
      if (r < inner && clean.vIsland[i]) aFace.array[i] = 1;
    }
    aFace.needsUpdate = true;
  }
  const R = cfg.canvas;
  const cv = document.createElement('canvas'); cv.width = R; cv.height = R;
  const ctx = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace; tex.flipY = false; tex.premultiplyAlpha = false; tex.anisotropy = 8;   // 直通 alpha（画布上传时浏览器已处理预乘，再设 true 会在半透明处变暗一圈）
  const mip = QS.get('facemip') !== '0';
  tex.minFilter = mip ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter; tex.generateMipmaps = mip; if (!mip) tex.anisotropy = 1;
  // ---- 五官画法（#935）：本体的五官不贴在网格上，而是像 Live2D / 《罪恶装备 Xrd》那样，每帧按「头相对镜头的偏航 yaw、俯仰 pitch」
  //      在屏幕空间重新摆一遍 2D 立绘五官（五官层 = 一块跟着脸走的屏幕四边形），只在脸皮像素里可见（脸皮遮罩 RT）。
  //      阵列 / 镜像克隆体（共享材质、没有五官层）仍按旧法在网格上按正面投影画五官兜底。
  const s = cfg.scale, MP = sets.A.meta.parts.mouth, MPAD = 24, MR = 6;   // 嘴的裁框 / 锚点两套相同，取 A 的
  const mouthRef = MP.states.rest, mouthC = [416, mouthRef.top + 2];
  const mcv = document.createElement('canvas'); mcv.width = MP.w * MR; mcv.height = (MP.h + MPAD) * MR;
  const mctx = mcv.getContext('2d');
  const mtex = new THREE.CanvasTexture(mcv); mtex.colorSpace = THREE.SRGBColorSpace; mtex.anisotropy = 8;
  const [mAx, mAy] = cfg.anchors.mouth, mf = s * cfg.mouthScale;
  const mx0 = mAx + (MP.x - mouthC[0]) * mf, my1 = mAy - (MP.y - mouthC[1]) * mf, mw = MP.w * mf, mh = (MP.h + MPAD) * mf;
  const under = document.createElement('canvas'); under.width = R; under.height = R;
  const utex = new THREE.CanvasTexture(under); utex.colorSpace = THREE.SRGBColorSpace; utex.flipY = false; utex.anisotropy = 8;
  const U = { faceMap: { value: tex }, underMap: { value: utex }, faceOn: { value: 1 }, faceDbg: { value: 0 }, faceSmoothOn: { value: 1 }, faceBox: { value: new THREE.Vector4(bx0, by1, 1 / (bx1 - bx0), 1 / (by1 - by0)) },
    mouthMap: { value: mtex }, mouthBox: { value: new THREE.Vector4(mx0, my1 - mh, 1 / mw, 1 / mh) }, overlayOn: { value: 0 } };
  const patch = {
    key: 'decal-face', uniforms: U,
    head: 'attribute float aFaceMix;\nattribute vec3 aFaceN;\nattribute float aFaceSmooth;\nuniform float faceSmoothOn;\nvarying vec2 vFaceXY;\nvarying float vFaceMix;\n',
    vertex: [['#include <beginnormal_vertex>', 'if (aFaceSmooth > 0.0) objectNormal = normalize(mix(objectNormal, aFaceN, aFaceSmooth * faceSmoothOn));'], ['#include <begin_vertex>', 'vFaceXY = position.xy; vFaceMix = aFaceMix;']],
    fhead: 'uniform sampler2D faceMap;\nuniform sampler2D underMap;\nuniform sampler2D mouthMap;\nuniform float faceOn;\nuniform float faceDbg;\nuniform float overlayOn;\nuniform vec4 faceBox;\nuniform vec4 mouthBox;\nvarying vec2 vFaceXY;\nvarying float vFaceMix;\n',
    fragment: [
      ['#include <map_fragment>', `float fm = vFaceMix * faceOn; vec4 faceD = vec4(0.0);
        if (fm > 0.0) {
          vec2 fuv = vec2((vFaceXY.x - faceBox.x) * faceBox.z, (faceBox.y - vFaceXY.y) * faceBox.w);
          vec4 fullD = texture2D(faceMap, fuv);
          if (overlayOn < 0.999) { vec2 muv = vec2((vFaceXY.x - mouthBox.x) * mouthBox.z, (vFaceXY.y - mouthBox.y) * mouthBox.w);
            if (muv.x > 0.0 && muv.x < 1.0 && muv.y > 0.0 && muv.y < 1.0) { vec4 md = texture2D(mouthMap, muv); fullD.rgb = fullD.rgb * (1.0 - md.a) + md.rgb * md.a; fullD.a = fullD.a + md.a * (1.0 - fullD.a); } }
          faceD = overlayOn > 0.001 ? mix(fullD, texture2D(underMap, fuv), overlayOn) : fullD;     // overlayOn：1 = 五官在五官层（只画垫底），0 = 网格投影五官，中间交叉淡化
          faceD.a *= fm; faceD.rgb *= faceD.a;
          diffuseColor.rgb = diffuseColor.rgb * (1.0 - faceD.a) + faceD.rgb * diffuse;
        }
        if (faceDbg > 0.5) diffuseColor.rgb = faceDbg < 1.5 ? vec3(fm, 0.0, 0.0) : faceD.rgb + (1.0 - faceD.a) * vec3(0.0, 0.3, 0.0);`],
      ['#include <emissivemap_fragment>', 'if (faceD.a > 0.0) totalEmissiveRadiance = totalEmissiveRadiance * (1.0 - faceD.a) + emissive * faceD.rgb;'],
    ],
  };
  for (const m of [toon, girl.frontOnly]) addShaderPatch(m, patch);
  // 本体画的时候只画垫底（五官在五官层上），克隆体画的时候按正面投影画全套
  let overlayActive = 0;             // 0..1：五官层的淡入量（侧脸超过上限时淡出、换回网格投影五官）
  const obr = mesh.onBeforeRender, oar = mesh.onAfterRender;
  mesh.onBeforeRender = function (...a) { obr?.apply(this, a); U.overlayOn.value = overlayActive; this.material.uniformsNeedUpdate = true; };
  mesh.onAfterRender = function (...a) { oar?.apply(this, a); U.overlayOn.value = 0; this.material.uniformsNeedUpdate = true; };
  // ---- 静止姿态网格上的「最靠前表面」高度（嘴、眼、鼻这里网格有前后两层）
  const UVa = g.attributes.uv, idxA = g.index.array, fTris = [];
  for (let t = 0; t < idxA.length / 3; t++) {
    const v = [idxA[t * 3], idxA[t * 3 + 1], idxA[t * 3 + 2]];
    if (v.some(i => P.getZ(i) < 0 || Math.abs(P.getX(i)) > 0.05 || P.getY(i) < 0.845 || P.getY(i) > 0.935)) continue;
    fTris.push(v.map(i => [P.getX(i), P.getY(i), P.getZ(i)]));
  }
  const frontZ = (x, y) => { let zb = -Infinity; for (const [A, B, C] of fTris) { const den = (B[1] - C[1]) * (A[0] - C[0]) + (C[0] - B[0]) * (A[1] - C[1]); if (Math.abs(den) < 1e-14) continue; const l0 = ((B[1] - C[1]) * (x - C[0]) + (C[0] - B[0]) * (y - C[1])) / den, l1 = ((C[1] - A[1]) * (x - C[0]) + (A[0] - C[0]) * (y - C[1])) / den, l2 = 1 - l0 - l1; if (l0 < 0 || l1 < 0 || l2 < 0) continue; zb = Math.max(zb, l0 * A[2] + l1 * B[2] + l2 * C[2]); } return zb; };
  const V3 = (x, y) => new THREE.Vector3(x, y, frontZ(x, y));
  const FA = cfg.features ?? {};
  const A3 = {
    eyeL: V3(...cfg.anchors.eyeL), eyeR: V3(...cfg.anchors.eyeR), mouth: V3(mAx, mAy),
    center: new THREE.Vector3(0, 0.892, frontZ(0, 0.905)),
    nose: (FA.noseRidge ?? [[0, 0.8985], [0, 0.8965], [-0.0003, 0.8935], [-0.0008, 0.8905], [-0.0012, 0.8883]]).map(([x, y]) => V3(x, y)),
  };
  // ---- 遮罩专用的脸皮判定（比贴花的大）：脸框放大到下颌 / 耳前，干净贴图上颜色像皮肤的顶点 = 脸皮（五官区域已抹成肤色；抹除椭圆里一律算），
  //      头发（棕色）、衣领、耳环不算。脖子用 y 下限挡掉。
  const cctx0 = clean.canvas.getContext('2d', { willReadFrequently: true }), CW0 = clean.canvas.width, CH0 = clean.canvas.height;
  const skinC = c => c[0] > 165 && c[0] >= c[1] && c[1] >= c[2] - 10 && c[0] - c[2] > 12 && c[0] - c[2] < 125 && c[1] > 105;
  const aMask = new Float32Array(n);
  for (let v = 0; v < n; v++) {
    const x = P.getX(v), y = P.getY(v), z = P.getZ(v);
    if (z < -0.004 || Math.abs(x) > 0.066 || y < 0.849 || y > 0.94) continue;
    if (cfg.erase.some(([cx, cy, rx, ry]) => Math.hypot((x - cx) / rx, (y - cy) / ry) < 1) && clean.vIsland[v]) { aMask[v] = 1; continue; }
    const c = cctx0.getImageData(Math.min(CW0 - 1, Math.floor(UVa.getX(v) * CW0)), Math.min(CH0 - 1, Math.floor(UVa.getY(v) * CH0)), 1, 1).data;
    if (skinC(c)) aMask[v] = 1;
  }
  g.setAttribute('aFaceMask', new THREE.BufferAttribute(aMask, 1));
  // 下半张脸的脸皮点（投到屏幕求凸包 = 下半脸轮廓，嘴框必须在里面）
  const lowFace = [];
  for (let v = 0; v < n; v += 2) { const y = P.getY(v), z = P.getZ(v); if (aMask[v] && z > 0.004 && y > 0.849 && y < 0.897) lowFace.push(new THREE.Vector3(P.getX(v), y, z)); }
  const lowCenter = new THREE.Vector3(0, 0.872, frontZ(0, 0.872));
  // ---- 脸皮遮罩 RT：只画本体网格，脸皮（aFaceMix 足够大、朝前）= 白，其余（头发、手、衣服、背面）= 黑，深度测试决定谁在前面
  const renderer = mv.stage.renderer, SW = mv.stage.width, SH = mv.stage.height;
  const maskRT = new THREE.WebGLRenderTarget(SW, SH, { samples: 4, depthBuffer: true, type: THREE.HalfFloatType });   // r = 脸皮，g = 视空间深度，b = 有几何（描边用）
  const maskReadRT = new THREE.WebGLRenderTarget(SW, SH, { depthBuffer: true });
  // 不开多重采样、半浮点：给着色器读每像素的静止姿态 x / y（多重采样会在轮廓边缘把脸和脖子的编码值平均掉，解出错的 x）
  const maskExactRT = new THREE.WebGLRenderTarget(SW, SH, { depthBuffer: true, type: THREE.HalfFloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });   // 不开多重采样：给 CPU 读回（多重采样 RT 读不出像素）
  const maskMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, toneMapped: false });
  // 允许描边的区域：静止姿态下眼睛以下、鼻子以外（只描下巴 / 下颌到耳前一圈，额头刘海边、鼻子自己的轮廓不描）
  const OLY = FA.outlineMaxY ?? 0.903, NOSE = FA.outlineNose ?? [0.013, 0.884];
  addShaderPatch(maskMat, { key: 'face-mask', head: 'attribute float aFaceMask;\nvarying float vFM;\nvarying float vVZ;\nvarying vec2 vRest;\n', vertex: [['#include <begin_vertex>', 'vFM = aFaceMask; vRest = position.xy;'], ['#include <project_vertex>', 'vVZ = -mvPosition.z;']],
    fhead: 'varying float vFM;\nvarying float vVZ;\nvarying vec2 vRest;\n', fragment: [['#include <map_fragment>', `float allow = (vRest.y < ${OLY.toFixed(4)} && !(abs(vRest.x) < ${NOSE[0].toFixed(4)} && vRest.y > ${NOSE[1].toFixed(4)})) ? 1.0 : 0.5;
      // b：0 = 没有几何，1 = 有几何但不描边，≥ 5 = 允许描边且记下静止姿态 x（5 + (x + 0.1) × 50）；a = 静止姿态 y（单侧渐细描边用）
      diffuseColor.rgb = vec3(gl_FrontFacing ? smoothstep(0.35, 0.65, vFM) : 0.0, vVZ, allow > 0.75 ? 5.0 + (vRest.x + 0.1) * 50.0 : 1.0); diffuseColor.a = vRest.y;`]] });
  maskMat.transparent = true; maskMat.blending = THREE.NoBlending; maskMat.depthWrite = true;   // 让 a 通道原样写进 RT（不透明材质会被强制成 1）
  const _cc = new THREE.Color();
  function renderMask(camera) {
    const prevRT = renderer.getRenderTarget(), prevMat = mesh.material, ca = renderer.getClearAlpha(); renderer.getClearColor(_cc);
    const obrM = mesh.onBeforeRender; mesh.onBeforeRender = () => {};
    mesh.material = maskMat; renderer.setRenderTarget(maskRT); renderer.setClearColor(0x000000, 1); renderer.clear(true, true, true);
    renderer.render(mesh, camera);
    renderer.setRenderTarget(maskReadRT); renderer.clear(true, true, true); renderer.render(mesh, camera);
    renderer.setRenderTarget(maskExactRT); renderer.clear(true, true, true); renderer.render(mesh, camera);
    mesh.material = prevMat; mesh.onBeforeRender = obrM; renderer.setRenderTarget(prevRT); renderer.setClearColor(_cc, ca);
  }
  // 每个口型图层实际不透明区域的包围盒（立绘 px），判断嘴在不在脸里用
  const envFor = set => {
    const MPs = set.meta.parts.mouth, boxes = {};
    const tc = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    for (const st of Object.keys(MPs.states)) { const im = set.imgs['mouth/' + st]; if (!im) continue; tc.canvas.width = im.width; tc.canvas.height = im.height; tc.clearRect(0, 0, im.width, im.height); tc.drawImage(im, 0, 0);
      const d = tc.getImageData(0, 0, im.width, im.height).data; let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
      for (let y = 0; y < im.height; y++) for (let x = 0; x < im.width; x++) if (d[(y * im.width + x) * 4 + 3] > 90) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
      boxes[st] = x1 < 0 ? [MP.x, MP.y, MP.x + MP.w, MP.y + MP.h] : [MP.x + x0, MP.y + y0, MP.x + x1, MP.y + y1]; }
    // 唱歌口型（rest / a i u e o / smileup，各自按「上唇线对齐」下移后）的包络（大笑、惊讶偶尔用，不算进来）：嘴在不在脸里按它判，挪动量只取决于头的朝向，换口型时嘴不会跳
    return Object.entries(boxes).filter(([st]) => st !== 'smile' && st !== 'surprised').reduce((e, [st, b]) => { const refTop = MPs.states.rest?.top ?? mouthRef.top, dy = Math.max(0, refTop - 3 - (MPs.states[st]?.top ?? refTop)); return [Math.min(e[0], b[0]), Math.min(e[1], b[1] + dy), Math.max(e[2], b[2]), Math.max(e[3], b[3] + dy)]; }, [1e9, 1e9, -1e9, -1e9]);
  };
  const ENV = { A: envFor(sets.A), B: envFor(sets.B) };
  // 各套嘴的锚点（立绘 px）：A / B 用 [416, rest 上唇线]，多角度组用自己标的嘴中心
  const mouthAnchorOf = set => set.meta.parts.mouth.anchor ?? [416, set.meta.parts.mouth.states.rest.top + 2];
  for (const ys of yawSets) ys.env = envFor(ys);
  sets.B.env = ENV.B; sets.A.env = ENV.A;
  // Y 模式的角度轴：B 套当 0°，加上各多角度组（按实测 yaw）
  const YAXIS = [...(yawSets.some(y => Math.abs(y.yaw) < 5) ? [] : [{ yaw: 0, set: sets.B, name: 'B' }]), ...yawSets.map(y => ({ yaw: y.yaw, set: y, name: y.name }))].sort((p, q) => p.yaw - q.yaw);
  let mouthEnv = ENV[style];
  function useStyle(st) { if (st === style) return; if (st === 'Y') { style = 'Y'; meta = sets.B.meta; imgs = sets.B.imgs; mouthEnv = ENV.B; last = ''; return; } if (!sets[st]) return; style = st; meta = sets[st].meta; imgs = sets[st].imgs; mouthEnv = ENV[st]; last = ''; }
  // ---- 五官层：一块屏幕对齐的四边形（顶点着色器直接给 NDC），贴五官画布，按遮罩 RT 裁
  const FC = FA.canvas ?? 1024;
  const fcv = document.createElement('canvas'); fcv.width = FC; fcv.height = FC;
  const fctx = fcv.getContext('2d');
  // 交叉淡化用：每一层（一组五官）先画到自己的画布，再按 (1 − w)·A + w·B 加法合成（'lighter' 叠预乘颜色 = 线性插值）；
  // 直接两层各 0.5 透明叠画会只剩 0.75 覆盖，五官发虚
  const layerCv = [0, 1].map(() => { const c = document.createElement('canvas'); c.width = FC; c.height = FC; return c; });
  const layerCtx = layerCv.map(c => c.getContext('2d'));
  const ftex = new THREE.CanvasTexture(fcv); ftex.colorSpace = THREE.SRGBColorSpace; ftex.anisotropy = 4;
  const OU = { featTex: { value: ftex }, maskTex: { value: maskRT.texture }, maskExact: { value: maskExactRT.texture }, rect: { value: new THREE.Vector4() }, res: { value: new THREE.Vector2(SW, SH) }, gain: { value: FA.gain ?? 1 }, fade: { value: 1 }, lineW: { value: 3 }, lineOn: { value: 1 }, lineCol: { value: new THREE.Color(FA.outlineColor ?? '#1a0f1f') }, lineMode: { value: 1 }, yawDeg: { value: 0 }, depthEps: { value: FA.outlineDepthEps ?? 0.004 }, dbgMask: { value: +((location.search.match(/[?&]facemask=(\d)/) || [0, 0])[1]) } };
  const overlay = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    uniforms: OU, transparent: true, depthTest: false, depthWrite: false, toneMapped: true,
    vertexShader: 'uniform vec4 rect; varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(rect.xy + position.xy * rect.zw, 0.0, 1.0); }',
    fragmentShader: `uniform sampler2D featTex; uniform sampler2D maskTex; uniform sampler2D maskExact; uniform vec2 res; uniform float gain; uniform float fade; uniform float dbgMask;
      uniform float lineW; uniform float lineOn; uniform vec3 lineCol; uniform float depthEps; uniform float lineMode; uniform float yawDeg; varying vec2 vUv;
      // 单侧渐细（动画画法，#936 用户反馈）：只描脸转过去那一侧（远侧）的下颌，近侧从耳根到下巴不描；下巴尖附近渐细收掉，耳前一端也渐细。
      // 正面（|yaw| < 4°）：两侧下颌各画中间一小段，都在下巴前、耳前收掉；4°–14° 之间过渡到单侧。yaw > 0 = 镜头在她左侧 = 远侧是她的右侧（x < 0）
      float sideWeight(float x, float y) {
        float u0 = abs(x) / 0.045;
        float wSym = smoothstep(0.3, 0.6, u0) * (1.0 - smoothstep(0.8, 1.0, u0));
        float far = yawDeg > 0.0 ? -1.0 : 1.0, u = x * far / 0.045;
        float wSide = smoothstep(-0.04, 0.3, u);   // 远侧从下巴尖前约 1.3 cm 开始渐细，过下巴尖一点收到 0
        float w = mix(wSym, wSide, smoothstep(4.0, 14.0, abs(yawDeg)));
        return w * (1.0 - smoothstep(0.884, 0.902, y));
      }
      // 脸轮廓描边（#936）：脸皮像素里，半径 lineW 内有「背景」或「深度跳变 > depthEps 的更远表面」（下颌后面的脖子、侧发、衣领）→ 描线。
      // 下颌侧边不是遮罩边界（脖子上部也算脸皮），真正的轮廓是深度跳变；邻像素更近（刘海、手）不描；深度连续的（脸内部、脖子延续）不描
      float edgeAt(vec2 uv, vec4 c0, float r) {
        float e = 0.0;
        for (int i = 0; i < 16; i++) {
          float a = float(i) * 0.3926991;
          vec4 n = texture2D(maskTex, uv + vec2(cos(a), sin(a)) * r / res);
          e = max(e, n.b < 0.5 ? 1.0 : smoothstep(depthEps, depthEps * 1.6, n.g - c0.g));
        }
        return e;
      }
      void main(){
        vec2 uv = gl_FragCoord.xy / res;
        vec4 c = texture2D(featTex, vUv); vec4 m4 = texture2D(maskTex, uv); float m = m4.r;
        vec4 outc = vec4(c.rgb * gain, c.a * m * fade);
        vec4 mx = texture2D(maskExact, uv);
        if (lineOn > 0.5 && m > 0.5 && mx.b > 4.0) {
          float w = lineMode > 0.5 ? sideWeight((mx.b - 5.0) / 50.0 - 0.1, mx.a) : 1.0;
          float lw = lineW * w;
          float e = lw < 0.35 ? 0.0 : max(edgeAt(uv, m4, lw), 0.6 * edgeAt(uv, m4, lw * 0.55)) * smoothstep(0.35, 0.9, lw);
          e *= smoothstep(0.5, 0.9, m);
          outc.rgb = mix(outc.rgb, lineCol, e); outc.a = max(outc.a, e * fade);
          if (dbgMask > 3.5) { gl_FragColor = vec4(step(0.5, edgeAt(uv, m4, lineW)), step(0.5, w), step(0.5, e), 1.0); return; }
        }
        if (dbgMask > 3.5) { gl_FragColor = vec4(0.0, 0.0, 0.2, 1.0); return; }
        gl_FragColor = outc;
        if (dbgMask > 0.5 && dbgMask < 1.5) gl_FragColor = vec4(mix(vec3(0.0, 0.0, 1.0), vec3(1.0, 0.0, 1.0), m), 0.55 + 0.45 * c.a);
        if (dbgMask > 2.5) { float w3 = mx.b > 4.0 ? sideWeight((mx.b - 5.0) / 50.0 - 0.1, mx.a) : 0.0; gl_FragColor = vec4(edgeAt(uv, m4, lineW), w3, m, 1.0); return; }
        if (dbgMask > 1.5) gl_FragColor = vec4(mx.b > 4.0 ? sideWeight((mx.b - 5.0) / 50.0 - 0.1, mx.a) : 0.0, clamp((mx.b - 5.0) / 10.0, 0.0, 1.0), mx.a > 0.8 ? (mx.a - 0.8) * 8.0 : 0.0, 1.0);
      }`,
  }));
  overlay.name = 'girl-face-features'; overlay.frustumCulled = false; overlay.renderOrder = 1000; overlay.visible = false;
  girl.root.add(overlay);
  // 动画作画参数表（|yaw| = 0 / 15 / 30 / 45 / 60°，中间线性插值）：近侧眼略大、远侧眼水平变窄；嘴水平压缩；鼻梁描边越侧越明显
  const KEYS = [0, 15, 30, 45, 60];
  const TAB = { nearSX: [1, 0.98, 0.95, 0.91, 0.85], nearS: [1, 1.03, 1.06, 1.08, 1.08], farSX: [1, 0.84, 0.66, 0.5, 0.36], mouthSX: [1, 0.96, 0.87, 0.76, 0.62], nose: [0, 0.3, 0.85, 1, 1], noseTip: [0.75, 0.55, 0.25, 0.1, 0] , ...(FA.table ?? {}) };
  const tab = (name, d) => { const a = TAB[name], x = Math.min(KEYS.at(-1), Math.abs(d)); let i = 0; while (i < KEYS.length - 2 && x > KEYS[i + 1]) i++; const t = (x - KEYS[i]) / (KEYS[i + 1] - KEYS[i]); return a[i] + (a[i + 1] - a[i]) * t; };
  const _W = new THREE.Matrix4(), _R = new THREE.Matrix3(), hbone = girl.dancer.S.info.Head.bone, hbInv = mesh.skeleton.boneInverses[mesh.skeleton.bones.indexOf(hbone)];
  const _v = new THREE.Vector3(), _cam = new THREE.Vector3(), _cr = new THREE.Vector3();
  let pose = null, mK = 1, yawCenter = 0, lineK = 1;
  const lineBase = FA.outlineWidth ?? 5.4;
  const MOUTH_FRONT = FA.mouthFront ?? [20, 26];   // 正面嘴的适用范围（度）：3D 的 ±20° 内一律用正面组的嘴，20–26° 才淡入侧向嘴（#936 用户更正）          // mK：嘴大小倍数（对照图用，正片 1）
  function project(p3, camera) { _v.copy(p3).applyMatrix4(_W).project(camera); return [(_v.x + 1) / 2 * SW, (1 - _v.y) / 2 * SH]; }
  function drawFeatures(camera, eL, eR, mouth) {
    girl.root.updateMatrixWorld(true);
    _W.copy(mesh.matrixWorld).multiply(mesh.bindMatrixInverse).multiply(hbone.matrixWorld).multiply(hbInv).multiply(mesh.bindMatrix);
    _R.setFromMatrix4(_W);
    const hr = new THREE.Vector3(1, 0, 0).applyMatrix3(_R).normalize(), hu = new THREE.Vector3(0, 1, 0).applyMatrix3(_R).normalize(), hf = new THREE.Vector3(0, 0, 1).applyMatrix3(_R).normalize();
    camera.getWorldPosition(_cam);
    const cW = A3.center.clone().applyMatrix4(_W), vw = _cam.clone().sub(cW).normalize();
    const yawRaw = Math.atan2(vw.dot(hr), vw.dot(hf)) * 180 / Math.PI, pitch = Math.atan2(vw.dot(hu), Math.hypot(vw.dot(hr), vw.dot(hf))) * 180 / Math.PI;
    const yaw = yawRaw - yawCenter;                                // 相对「五官画的角度」（A 套 = 立绘 artYaw，B 套 = 0）
    // 屏幕上的脸坐标轴：x = 头的右方向投影（去掉剪切，y 取它的垂直方向）
    const C = project(A3.center, camera), Cx = project(A3.center.clone().add(new THREE.Vector3(0.01, 0, 0)), camera);
    let ax = [Cx[0] - C[0], Cx[1] - C[1]]; const al = Math.hypot(...ax) || 1; ax = [ax[0] / al, ax[1] / al];
    const dn = [-ax[1], ax[0]];                                    // 屏幕「向下」
    // 像素 / 模型单位（在脸所在的深度，按镜头右方向量）
    _cr.setFromMatrixColumn(camera.matrixWorld, 0);
    const p1 = cW.clone().project(camera), p2 = cW.clone().addScaledVector(_cr, 0.01).project(camera);
    const ppu = Math.hypot((p2.x - p1.x) / 2 * SW, (p2.y - p1.y) / 2 * SH) / 0.01;
    // 五官画布：以脸中心为中心、边长 0.17 单位的屏幕方块
    const side = 0.17 * ppu, k = FC / side, ox = C[0] - side / 2, oy = C[1] - side / 2;
    OU.rect.value.set((C[0] / SW) * 2 - 1, 1 - (C[1] / SH) * 2, side / SW, side / SH);
    OU.lineW.value = Math.max(1.2, lineBase * lineK * (0.075 * ppu) / (0.25 * SH));   // 脸占画高 25% 时 lineBase px（#936 用户反馈加粗到 5.4），按脸在画面里的大小缩放
    const toC = p => [(p[0] - ox) * k, (p[1] - oy) * k];
    const syP = Math.pow(Math.max(0.3, Math.cos(pitch * Math.PI / 180)), 0.8);
    const sideSign = Math.sign(yaw) || 1;                         // 镜头在头的 +X（她的左）一侧时为正
    fctx.setTransform(1, 0, 0, 1, 0, 0); fctx.clearRect(0, 0, FC, FC);
    fctx.imageSmoothingEnabled = true; fctx.imageSmoothingQuality = 'high';
    // 要画的五官层：A / B 各一层；Y（多角度）= 角度轴上夹住当前 yaw 的两组，权重在两组中间 30% 区间里平滑过渡（交叉淡化，不闪不跳）
    let layers;
    if (style === 'Y') {
      let i = 0; while (i < YAXIS.length - 2 && yawRaw > YAXIS[i + 1].yaw) i++;
      const L0 = YAXIS[i], L1 = YAXIS[Math.min(i + 1, YAXIS.length - 1)];
      const t = L1 === L0 ? 0 : Math.min(1, Math.max(0, (yawRaw - L0.yaw) / (L1.yaw - L0.yaw))), w = t <= 0.35 ? 0 : t >= 0.65 ? 1 : (x => x * x * (3 - 2 * x))((t - 0.35) / 0.3);
      layers = w <= 0 ? [{ ...L0, w: 1 }] : w >= 1 ? [{ ...L1, w: 1 }] : [{ ...L0, w: 1 - w }, { ...L1, w }];
    } else layers = [{ yaw: yawCenter, set: sets[style], name: style, w: 1 }];
    // 嘴单独一套（#936 用户反馈：侧向嘴形切入太早）：|yaw| ≤ MOUTH_FRONT[0] 全用正面组的嘴，
    // MOUTH_FRONT[0]–[1] 之间平滑过渡到这一侧第一个 |yaw| ≥ 12° 的组，[1] 以外和眼睛一样按角度轴
    let mouthLayers = layers;
    if (style === 'Y') {
      const front = YAXIS.reduce((b, L) => (Math.abs(L.yaw) < Math.abs(b.yaw) ? L : b), YAXIS[0]);
      const ay = Math.abs(yawRaw), side = YAXIS.filter(L => L !== front && Math.sign(L.yaw) === Math.sign(yawRaw) && Math.abs(L.yaw) >= 12).sort((p, q) => Math.abs(p.yaw) - Math.abs(q.yaw))[0];
      if (ay <= MOUTH_FRONT[0] || !side) mouthLayers = [{ ...front, w: 1 }];
      else if (ay < MOUTH_FRONT[1]) { const x = (ay - MOUTH_FRONT[0]) / (MOUTH_FRONT[1] - MOUTH_FRONT[0]), w = x * x * (3 - 2 * x); mouthLayers = [{ ...front, w: 1 - w }, { ...side, w }]; }
    }
    const put = (set, part, st, A, anchor2, sx, sy, scale = s, dy = 0) => {
      let Pm = set.meta.parts[part], im = set.imgs[part + '/' + st];
      if (!Pm || !im) { set = sets.B; Pm = set.meta.parts[part]; im = set.imgs[part + '/' + st] || set.imgs[part + '/' + Object.keys(Pm.states)[0]]; anchor2 = part === 'mouth' ? mouthAnchorOf(set) : Pm.anchor; }
      const c = toC(A), fx = scale * ppu * k * sx, fy = scale * ppu * k * sy;
      dctx.setTransform(ax[0] * fx, ax[1] * fx, dn[0] * fy, dn[1] * fy, c[0], c[1]);
      dctx.drawImage(im, Pm.x - anchor2[0], Pm.y + dy - anchor2[1], Pm.w, Pm.h);
    };
    let dctx = fctx;
    const single = layers.length === 1;
    if (!single) for (const c of layerCtx) { c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, FC, FC); c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; }
    // 眼 + 眉：位置 = 真实网格上眼睛的投影；大小按参数表（近侧 / 远侧，按「当前 yaw − 这一层画的角度」）
    for (const [li, Ly] of layers.entries()) {
      dctx = single ? fctx : layerCtx[li];
      const yr = yawRaw - Ly.yaw, sgn = Math.sign(yr) || 1;
      for (const [eye, brow, st, A3e] of [['eyeL', 'browL', eL, A3.eyeL], ['eyeR', 'browR', eR, A3.eyeR]]) {
        const near = Math.sign(A3e.x) === sgn || Math.abs(yr) < 1;
        const sc = near ? tab('nearS', yr) : 1, sx = (near ? tab('nearSX', yr) : tab('farSX', yr)) * sc, sy = sc * syP;
        const A = project(A3e, camera);
        const eyeSet = Ly.set.meta.parts[eye] ? Ly.set : sets.B, anc = eyeSet.meta.parts[eye].anchor;
        // 眉毛：这一套有就用这一套的，没有就用 B 套的（按 B 套自己的瞳孔锚点）
        if (Ly.set.meta.parts[brow]) put(Ly.set, brow, '02-head', A, anc, sx, sy); else put(sets.B, brow, '02-head', A, sets.B.meta.parts[eye].anchor, sx, sy);
        put(eyeSet, eye, st, A, anc, sx, sy);
      }
    }
    dctx = fctx;
    // 鼻子：正面只点鼻尖下一小笔；侧过来沿鼻梁到鼻尖描黑线，鼻尖往远侧勾一下
    const nose = A3.nose.map(p => toC(project(p, camera))), tip = nose.at(-1), nyaw = style === 'Y' ? yawRaw : yaw, nA = tab('nose', nyaw), tA = tab('noseTip', nyaw);
    const u = ppu * k;                                             // 画布 px / 模型单位
    fctx.setTransform(1, 0, 0, 1, 0, 0); fctx.lineCap = 'round'; fctx.lineJoin = 'round';
    if (tA > 0.01) {
      fctx.strokeStyle = `rgba(150,86,72,${tA})`; fctx.lineWidth = 0.0009 * u;
      fctx.beginPath(); fctx.moveTo(tip[0] - ax[0] * 0.0016 * u + dn[0] * 0.0013 * u, tip[1] - ax[1] * 0.0016 * u + dn[1] * 0.0013 * u);
      fctx.quadraticCurveTo(tip[0] + dn[0] * 0.0019 * u, tip[1] + dn[1] * 0.0019 * u, tip[0] + ax[0] * 0.0014 * u + dn[0] * 0.0012 * u, tip[1] + ax[1] * 0.0014 * u + dn[1] * 0.0012 * u); fctx.stroke();
    }
    if (nA > 0.01) {
      const far = [-ax[0] * sideSign, -ax[1] * sideSign];         // 远侧（屏幕方向）
      fctx.strokeStyle = `rgba(58,36,51,${nA * 0.9})`; fctx.lineWidth = 0.0008 * u;
      fctx.beginPath(); fctx.moveTo(...nose[1]); for (const p of nose.slice(2)) fctx.lineTo(...p);
      fctx.lineTo(tip[0] + far[0] * 0.0022 * u + dn[0] * 0.0014 * u, tip[1] + far[1] * 0.0022 * u + dn[1] * 0.0014 * u); fctx.stroke();
    }
    // 嘴：真实网格上嘴的投影；水平按参数表压缩；张嘴向下扩。
    // 嘴框（四角 + 下边几个点，留 2 mm 边）必须落在遮罩的脸皮像素里：不在就朝下半脸中心挪（二分求最小挪动），挪满还不行再整体缩小
    // 嘴的水平压缩和包络按各层权重插值（包络换成相对各自锚点），挪动量随角度连续变化
    const wsum = (f) => mouthLayers.reduce((acc, Ly) => acc + Ly.w * f(Ly), 0);
    const msx = wsum(Ly => tab('mouthSX', yawRaw - Ly.yaw)), msy = Math.pow(Math.max(0.3, Math.cos(pitch * Math.PI / 180)), 0.6);
    const relEnv = Ly => { const e = (Ly.set.env || ENV.B), mc = mouthAnchorOf(Ly.set); return [e[0] - mc[0], e[1] - mc[1], e[2] - mc[0], e[3] - mc[1]]; };
    const obRel = [0, 1, 2, 3].map(i => wsum(Ly => relEnv(Ly)[i]));
    let M = project(A3.mouth, camera), msc = 1;
    const Tc = project(lowCenter, camera), mg = 0.0015 * ppu;
    // 读回遮罩 RT 里嘴周围一块（真实可见的脸皮：被头发、衣领挡住的地方不算）
    const rad = Math.ceil(0.03 * ppu), rx0 = Math.max(0, Math.floor(M[0] - rad)), ry0 = Math.max(0, Math.floor(M[1] - rad));
    const rw = Math.min(SW - rx0, 2 * rad), rh = Math.min(SH - ry0, 2 * rad);
    const mbuf = new Uint8Array(rw * rh * 4);
    renderer.readRenderTargetPixels(maskReadRT, rx0, SH - ry0 - rh, rw, rh, mbuf);
    const maskAt = q => { const x = Math.round(q[0]) - rx0, y = Math.round(q[1]) - ry0; if (x < 0 || y < 0 || x >= rw || y >= rh) return false; return mbuf[((rh - 1 - y) * rw + x) * 4] > 127; };
    const hull = { length: 3 }, inHull = (_, q) => maskAt(q);
    // 挪动目标 = 嘴附近（半径 2 cm、嘴以下偏多）可见脸皮像素的质心：侧脸时它在「看得见的那半张下脸」中间，随朝向连续变化
    { let sx = 0, sy = 0, cnt = 0; const R2 = (0.02 * ppu) ** 2;
      for (let y = 0; y < rh; y += 2) for (let x = 0; x < rw; x += 2) { const px = rx0 + x, py = ry0 + y, dx = px - M[0], dy = py - M[1]; if (dx * dx + dy * dy > R2) continue; if (mbuf[((rh - 1 - y) * rw + x) * 4] > 127) { sx += px; sy += py; cnt++; } }
      if (cnt > 20) { Tc[0] = sx / cnt; Tc[1] = sy / cnt; } }
    let hits = 0; for (let i = 0; i < mbuf.length; i += 4) if (mbuf[i] > 127) hits++;
    const inside = (Mp, sc) => {
      const fx = mf * mK * ppu * msx * sc, fy = mf * mK * ppu * msy * sc;
      const cxo = (obRel[0] + obRel[2]) / 2 * fx, cyo = (obRel[1] + obRel[3]) / 2 * fy;
      const rxo = (obRel[2] - obRel[0]) / 2 * fx + mg, ryo = (obRel[3] - obRel[1]) / 2 * fy + mg;
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, u1 = cxo + Math.cos(a) * rxo, v1 = cyo + Math.sin(a) * ryo;
        if (!inHull(hull, [Mp[0] + ax[0] * u1 + dn[0] * v1, Mp[1] + ax[1] * u1 + dn[1] * v1])) return false; }
      return true;
    };
    if (!inside(M, 1)) {
      // 只朝一个方向（下半脸中心）挪：二分求最小挪动 t；挪到中心还放不下，就在中心二分求最大缩放（≥ 0.6）。
      // 都是随头部朝向连续变化的量（不在方向 / 档位之间跳），换口型也不变（按包络判）
      const at = t => [M[0] + (Tc[0] - M[0]) * t, M[1] + (Tc[1] - M[1]) * t];
      if (inside(Tc, 1)) { let lo = 0, hi = 1; for (let i = 0; i < 16; i++) { const mid = (lo + hi) / 2; if (inside(at(mid), 1)) hi = mid; else lo = mid; } M = at(hi); }
      else { let lo = 0.6, hi = 1; for (let i = 0; i < 12; i++) { const mid = (lo + hi) / 2; if (inside(Tc, mid)) lo = mid; else hi = mid; } M = Tc; msc = lo; }
    }
    const msy2 = msy * msc;
    // 眼睛的交叉淡化层先合成进 fctx（必须在清空图层画布之前），嘴再按自己的权重合成
    if (!single) { fctx.save(); fctx.setTransform(1, 0, 0, 1, 0, 0); fctx.globalCompositeOperation = 'lighter'; layers.forEach((Ly, li) => { fctx.globalAlpha = Ly.w; fctx.drawImage(layerCv[li], 0, 0); }); fctx.restore(); }
    const singleM = mouthLayers.length === 1;
    if (!singleM) for (const c of layerCtx) { c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, FC, FC); c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; }
    for (const [li, Ly] of mouthLayers.entries()) {
      dctx = singleM ? fctx : layerCtx[li];
      const MPs = Ly.set.meta.parts.mouth, has = !!Ly.set.imgs['mouth/' + mouth], useSet = has ? Ly.set : sets.B, MPu = useSet.meta.parts.mouth;
      const ref = MPu.states.rest, ms = MPu.states[mouth] || ref, mdy = Math.max(0, ref.top - 3 - ms.top);
      put(useSet, 'mouth', mouth, M, mouthAnchorOf(useSet), msx * msc, msy2, mf * mK, mdy);
    }
    dctx = fctx;
    if (!singleM) {
      fctx.save(); fctx.setTransform(1, 0, 0, 1, 0, 0); fctx.globalCompositeOperation = 'lighter';
      mouthLayers.forEach((Ly, li) => { fctx.globalAlpha = Ly.w; fctx.drawImage(layerCv[li], 0, 0); });
      fctx.restore();
    }
    ftex.needsUpdate = true;
    pose = { yaw: +yawRaw.toFixed(1), yawRel: +yaw.toFixed(1), style, layers: layers.map(Ly => `${Ly.name}:${Ly.w.toFixed(2)}`).join(' '), mouthLayers: mouthLayers.map(Ly => `${Ly.name}:${Ly.w.toFixed(2)}`).join(' '), pitch: +pitch.toFixed(1), overlay: overlayActive, maskHits: hits, maskBox: [rx0, ry0, rw, rh], msc: +msc.toFixed(2), mouthAt: M.map(v => Math.round(v)) };
  }
  // 看脸 / 唱歌镜头的角度上限（#935 用户反馈：侧脸效果差）：|yaw| ≤ 20°、|pitch| ≤ 12°。
  // |yaw| 超过 20° 五官层在 20–26° 之间淡出，换回网格投影五官（远景 / 背影用）；超限时 console.warn 提醒镜头作者（每秒最多一次）。
  // A 套（立绘原角度）：以 artYaw 为中心 ±12°（淡出到 ±18°）；B 套（正面化）：以 0 为中心 ±20°（淡出到 ±26°）
  const LIMITS = { A: { center: cfg.artYaw ?? 0, yaw: 12, yawOff: 18 }, B: { center: 0, yaw: FA.maxYaw ?? 20, yawOff: FA.yawOff ?? 26 }, Y: { center: 0, yaw: 23, yawOff: 29 } }, MAXP = FA.maxPitch ?? 12;   // Y：有 −22.5° 的实测组，放宽到 ±23°
  let lastWarn = -1e9;
  function headAngles(camera) {
    girl.root.updateMatrixWorld(true);
    _W.copy(mesh.matrixWorld).multiply(mesh.bindMatrixInverse).multiply(hbone.matrixWorld).multiply(hbInv).multiply(mesh.bindMatrix);
    _R.setFromMatrix4(_W);
    const hr = new THREE.Vector3(1, 0, 0).applyMatrix3(_R).normalize(), hu = new THREE.Vector3(0, 1, 0).applyMatrix3(_R).normalize(), hf = new THREE.Vector3(0, 0, 1).applyMatrix3(_R).normalize();
    camera.getWorldPosition(_cam);
    const vw = _cam.clone().sub(A3.center.clone().applyMatrix4(_W)).normalize();
    return { yaw: Math.atan2(vw.dot(hr), vw.dot(hf)) * 180 / Math.PI, pitch: Math.atan2(vw.dot(hu), Math.hypot(vw.dot(hr), vw.dot(hf))) * 180 / Math.PI };
  }
  function placeOverlay(T, camera, on, eL, eR, mouth, limits = true) {
    const LIMIT = { ...LIMITS[style], pitch: MAXP }; yawCenter = LIMIT.center;
    const vis = !!camera && !!on && mesh.visible && (mesh.material === toon || mesh.material === girl.frontOnly) && !(girl.uniforms?.dissolve?.value > 0);
    overlay.visible = false; overlayActive = 0;
    if (!vis) return;
    const ang = headAngles(camera), ay = Math.abs(ang.yaw - LIMIT.center), ap = Math.abs(ang.pitch);
    if (limits && (ay > LIMIT.yaw || ap > LIMIT.pitch) && Math.abs(T - lastWarn) >= 1) {
      lastWarn = T;
      console.warn(`girl.face：T=${T.toFixed(2)} 头相对镜头 yaw ${ang.yaw.toFixed(0)}° / pitch ${ang.pitch.toFixed(0)}°，超出看脸镜头范围（${style} 套：yaw ${LIMIT.center - LIMIT.yaw}° ~ ${LIMIT.center + LIMIT.yaw}°、|pitch| ≤ ${LIMIT.pitch}°）。` +
        (ay > LIMIT.yaw ? `五官层${ay >= LIMIT.yawOff ? '已关闭' : '正在淡出'}，侧脸请只拍背影、远景（脸 ≤ 8% 画高）或切 2D 近景。` : ''));
    }
    OU.yawDeg.value = ang.yaw;
    const fade = limits ? 1 - Math.min(1, Math.max(0, (ay - LIMIT.yaw) / (LIMIT.yawOff - LIMIT.yaw))) : 1;
    pose = { yaw: +ang.yaw.toFixed(1), pitch: +ang.pitch.toFixed(1), overlay: +fade.toFixed(2) };
    if (fade <= 0) return;
    overlay.visible = true; overlayActive = fade; OU.fade.value = fade;
    renderMask(camera);
    drawFeatures(camera, eL, eR, mouth);
    pose.overlay = +fade.toFixed(2);
  }
  // ---- 画布：立绘像素 → 画布像素（垫底 + 克隆体用的正面投影五官）
  const k = R / (bx1 - bx0);                                      // 画布 px / 模型单位
  const toCanvas = (x, y) => [(x - bx0) * k, (by1 - y) * k];
  function drawPart(part, st, anchor3, anchor2, scale = s, dy = 0) {
    const Pm = meta.parts[part], im = imgs[part + '/' + st] || imgs[part + '/' + Object.keys(Pm.states)[0]];
    const [ax, ay] = toCanvas(...anchor3), f = scale * k;
    ctx.drawImage(im, ax + (Pm.x - anchor2[0]) * f, ay + (Pm.y + dy - anchor2[1]) * f, Pm.w * f, Pm.h * f);
  }
  // 肤色垫底：原贴图的眼睛 / 眉毛 / 嘴 / 眼窝阴影在 UV 上分成好几块（同一处还有粗细两层网格），纹理修补盖不全；
  // 所以在贴花画布（正面投影）上先垫一层羽化的肤色椭圆，再画五官 —— 按屏幕看到的位置盖，和 UV 怎么切无关。刘海不在脸皮遮罩里，不受影响。
  // 垫底颜色按椭圆外圈一圈脸皮的实际颜色取（上半圈、下半圈各取中位数，竖向渐变），和周围对齐，不留亮斑。只合成一次。
  const cctx = clean.canvas.getContext('2d', { willReadFrequently: true }), CW = clean.canvas.width, CH = clean.canvas.height;
  const skin0 = clean.stats.skinMedian, cf = cfg.coverFeather ?? cfg.feather;
  const ringColor = (cx, cy, rx, ry, upper) => {
    const cs = [[], [], []];
    for (const v of clean.cand) {
      if (!clean.vIsland[v]) continue;
      const x = P.getX(v), y = P.getY(v), r = Math.hypot((x - cx) / rx, (y - cy) / ry);
      if (r < 1 + cf || r > 1.5 + cf || (y >= cy) !== upper) continue;
      if ((cfg.cover ?? cfg.erase).some(([ex, ey, erx, ery]) => Math.hypot((x - ex) / erx, (y - ey) / ery) < 1 + cf)) continue;   // 落在别的椭圆里的不算
      const c = cctx.getImageData(Math.min(CW - 1, Math.floor(UVa.getX(v) * CW)), Math.min(CH - 1, Math.floor(UVa.getY(v) * CH)), 1, 1).data;
      if (!(c[0] > 190 && c[0] >= c[1] && c[1] >= c[2] && c[0] - c[2] > 25 && c[0] - c[2] < 110)) continue;   // 只取像皮肤的（粗层网格上有灰色眼窝阴影、纹理缝的填充色）
      for (let i = 0; i < 3; i++) cs[i].push(c[i]);
    }
    if (cs[0].length < 6) return skin0;
    return cs.map(a => { a.sort((p, q) => p - q); return a[a.length >> 1]; });
  };
  const uctx = under.getContext('2d'), coverCols = [];
  for (const [cx, cy, rx, ry] of cfg.cover ?? cfg.erase) {
    const top = ringColor(cx, cy, rx, ry, true), bot = ringColor(cx, cy, rx, ry, false); coverCols.push([top, bot]);
    const f = 1 + cf, [px0, py0] = toCanvas(cx, cy), hw = Math.ceil(rx * k * f) + 2, hh = Math.ceil(ry * k * f) + 2;
    const t = document.createElement('canvas'); t.width = hw * 2; t.height = hh * 2; const tc = t.getContext('2d');
    const lg = tc.createLinearGradient(0, 0, 0, hh * 2); lg.addColorStop(0.15, `rgb(${top})`); lg.addColorStop(0.85, `rgb(${bot})`);
    tc.fillStyle = lg; tc.fillRect(0, 0, hw * 2, hh * 2);
    tc.globalCompositeOperation = 'destination-in';
    tc.save(); tc.translate(hw, hh); tc.scale(rx * k * f, ry * k * f);
    const rg = tc.createRadialGradient(0, 0, 0, 0, 0, 1); rg.addColorStop(0, '#000'); rg.addColorStop(1 / f, '#000'); rg.addColorStop(1, 'rgba(0,0,0,0)');
    tc.fillStyle = rg; tc.beginPath(); tc.arc(0, 0, 1, 0, Math.PI * 2); tc.fill(); tc.restore();
    uctx.drawImage(t, px0 - hw, py0 - hh);
  }
  utex.needsUpdate = true;
  function paint(eyeL, eyeR, mouth) {
    ctx.clearRect(0, 0, R, R);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(under, 0, 0);
    const pL = meta.parts.eyeL.anchor, pR = meta.parts.eyeR.anchor;
    drawPart('browL', '02-head', cfg.anchors.eyeL, pL);
    drawPart('browR', '02-head', cfg.anchors.eyeR, pR);
    drawPart('eyeL', eyeL, cfg.anchors.eyeL, pL);
    drawPart('eyeR', eyeR, cfg.anchors.eyeR, pR);
    tex.needsUpdate = true;
    // 嘴：上唇线对齐（张嘴向下扩）
    const ms = meta.parts.mouth.states[mouth] || mouthRef, im = imgs['mouth/' + mouth] || imgs['mouth/rest'];
    mctx.clearRect(0, 0, mcv.width, mcv.height); mctx.imageSmoothingEnabled = true; mctx.imageSmoothingQuality = 'high';
    mctx.drawImage(im, 0, Math.max(0, mouthRef.top - 3 - ms.top) * MR, MP.w * MR, MP.h * MR);
    mtex.needsUpdate = true;
  }
  // ---- ③ 表演
  const EXPR = { neutral: ['open', 'open', 'rest'], smile: ['open', 'open', 'smileup'], grin: ['open', 'open', 'smile'], happy: ['smile', 'smile', 'smile'], surprised: ['surprised', 'surprised', 'surprised'], wink: ['wink', 'wink', 'smileup'], closed: ['closed', 'closed', 'rest'] };
  const timingsOf = lines => ({ segments: lines.map(l => ({ text: l.text, start: l.start, end: l.end, sentences: l.words.map(w => ({ text: w.w, start: w.start, end: w.end })) })) });
  const lipsAll = lipsync(timingsOf(mv.lyrics.lines)), lipsLine = new Map();
  const lipsFor = line => { if (line == null) return lipsAll; const L = typeof line === 'number' ? mv.lyrics.lines[line] : line; if (!lipsLine.has(L.i)) lipsLine.set(L.i, lipsync(timingsOf([L]))); return lipsLine.get(L.i); };
  // 眨眼：间隔 2.4–4.8 s（种子固定）；半闭 1 帧 → 全闭 2 帧 → 半闭 1 帧（30 fps）
  const blinkAt = [], rnd = mulberry32(23);
  for (let t = 0.8 + rnd() * 1.5; t < mv.music.duration + 5; t += 2.4 + rnd() * 2.4) blinkAt.push(t);
  const F = 1 / 30;
  const blink = T => { let lo = 0, hi = blinkAt.length - 1, j = -1; while (lo <= hi) { const m = (lo + hi) >> 1; if (blinkAt[m] <= T) { j = m; lo = m + 1; } else hi = m - 1; } if (j < 0) return null; const d = T - blinkAt[j]; return d < F ? 'half' : d < 3 * F ? 'closed' : d < 4 * F ? 'half' : null; };
  let last = '';
  function update(T, { line = null, expression = 'neutral', blink: bl = 'auto', mouth: mouthOverride = null, camera = null, on = 1, mouthScale = 1, style: st = null, limits = true, outline = cfg.outline ?? true, outlineScale = 1 } = {}) {
    lineK = outlineScale;
    mK = mouthScale; if (st) useStyle(st); OU.lineOn.value = outline ? 1 : 0; OU.lineMode.value = outline === 'full' ? 0 : 1;
    let [eL, eR, m0] = EXPR[expression] || EXPR.neutral;
    if (bl === 'auto') { const b = blink(T); if (b) { if (eL === 'open' || eL === 'surprised') eL = b; if (eR === 'open' || eR === 'surprised') eR = b; } }
    else if (typeof bl === 'string') eL = eR = bl;
    const talk = mouthOverride ? null : lipsFor(line)(T), mouth = mouthOverride ?? (talk && talk !== 'rest' ? talk : m0);   // 不唱（rest）时用表情自己的嘴
    const key = `${eL}|${eR}|${mouth}`;
    if (key !== last) { last = key; paint(eL, eR, mouth); }
    U.faceOn.value = on;
    pose = null; placeOverlay(T, camera, on, eL, eR, mouth, limits);
    return { eyes: eL === eR ? eL : `${eL}/${eR}`, mouth, faceOn: on, ...(pose || {}) };
  }
  paint('open', 'open', 'rest'); last = 'open|open|rest';        // 默认脸：睁眼、闭嘴（没调用 update 的镜头也正常）
  // 调试：读 maskExactRT 某像素（屏幕像素，y 向下）→ [skin, viewZ, b, a]
  const readExact = (px, py) => { const b = new Uint16Array(4); renderer.readRenderTargetPixels(maskExactRT, px, SH - 1 - py, 1, 1, b); return Array.from(b, THREE.DataUtils.fromHalfFloat).map(v => +v.toFixed(4)); };
  return { update, readExact, overlay, featCanvas: fcv, maskRT, mouthCanvas: mcv, coverColors: coverCols, canvas: cv, texture: tex, uniforms: U, lipsFor, cleanMap, originalMap, cleanStats: clean.stats, _clean: clean, blinkTimes: blinkAt };
}

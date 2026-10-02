// shots/br-v5.js — 副歌 3 结尾 + 桥段 v5（歌曲时间 105.96–123.87 s）。#1056 第三版（用户方向：fresh/v4-rest/br/plan-v3-用户.md）
//
//   const shots = await makeBRV5(mv);   // br-v5-half.html 挂
//
// 不讲剧情、没有人，回到 v4-06 的图形化路子：
//   ① 105.96 硬切（接 0x99b9 副歌 3 漫画：回形针填满屏幕）：冷蓝雨夜里一副巨大的霓虹坐标轴（竖轴 INTELLIGENCE、横轴 GOALS）。
//      一条发光曲线从原点出发，横向几乎不动、竖向指数往上冲 ——「智能一路往上，目标原地不动」——最后打到竖轴高处那枚回形针
//   ② 108.55 打中：回形针变成 transformer 经典的注意力图（token × token 热力图，对角线最亮）；三声 just 各裂变一次 1 → 2 → 4 → 8
//   ③ 110.18「Just transformers all the way!」：裂变 = 不断堆砌，一层层往上往外摞成望不到顶的注意力层塔；旁边经典结构图的「N×」一路涨（6× → 96× → ∞×）
//      112.52「all the way」镜头拉开：整座塔从脚下的夜城一直扎进云里
//   ④ 113.34 起：v4-06 各段（disobey / 门格海绵 / 警告弹窗 / 显卡 LED / 点赞点踩 ASKEW）加丰富度 ——（第二步）
// 所有 update 都是歌曲时间 T 的纯函数。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { mulberry32 } from '../kits/world.js';

const hash2 = (a, b) => { let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eBack = (p, s = 1.6) => { p = clamp(p); return 1 + (s + 1) * (p - 1) ** 3 + s * (p - 1) ** 2; };
const eIn = p => clamp(p) ** 3;
const col = c => new THREE.Color(c);
const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k);
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const FONT = '"UIAnton", "Anton", Impact, sans-serif';
function pchip(keys, t) {
  const n = keys.length;
  if (t <= keys[0][0]) return keys[0][1]; if (t >= keys[n - 1][0]) return keys[n - 1][1];
  const d = []; for (let i = 0; i < n - 1; i++) d.push((keys[i + 1][1] - keys[i][1]) / (keys[i + 1][0] - keys[i][0]));
  const m = keys.map((_, i) => i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : 2 * d[i - 1] * d[i] / (d[i - 1] + d[i]));
  let i = 0; while (t > keys[i + 1][0]) i++;
  const h = keys[i + 1][0] - keys[i][0], s = (t - keys[i][0]) / h, s2 = s * s, s3 = s2 * s;
  return (2 * s3 - 3 * s2 + 1) * keys[i][1] + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * keys[i + 1][1] + (s3 - s2) * h * m[i + 1];
}
const pv = (keys, t) => V3(pchip(keys.map(k => [k[0], k[1]]), t), pchip(keys.map(k => [k[0], k[2]]), t), pchip(keys.map(k => [k[0], k[3]]), t));

export const BR5 = {
  t0: 105.96, end: 123.87,
  hit: 108.55, just: [108.869, 109.323, 109.778], sing: 110.18, all: 112.524, disobey: 113.34, dis: 114.24,
  dense: 115.2, sdense: 116.02, fence: 117.02, gpu: 118.755, slam: 118.868, rlhf: 120.76, goes: 121.58, askew: 121.88, face: 122.9,
};
const AX = { H: 12, W: 10, color: '#3A6BFF' };      // 坐标轴：竖轴高 12、横轴长 10
const CLIP = V3(1.15, 10.8, 0.15);                   // 竖轴高处那枚回形针
const CITY_Y = -40;

export function makeEye(R = 0.72) {                    // 全片同一只眼：柠黄同心圆（v4-01 / 副歌 1 / 桥段 v4 同款）
  const g = new THREE.Group(), add = (geo, mat, z) => { const m = new THREE.Mesh(geo, mat); m.position.z = z; g.add(m); return m; };
  add(new THREE.RingGeometry(R, R * 1.24, 64), new THREE.MeshBasicMaterial({ color: '#4a4a5a' }), 0.012);
  add(new THREE.CircleGeometry(R, 64), new THREE.MeshBasicMaterial({ color: '#0b0a06' }), 0.013);
  const lit = new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 1.6) });
  add(new THREE.CircleGeometry(R * 0.26, 40), lit, 0.016);
  for (const k of [0.46, 0.66, 0.86]) add(new THREE.RingGeometry(R * k - R * 0.03, R * k + R * 0.03, 64), lit, 0.016);
  return { g, lit };
}
export function makeSign(text, color, th) {
  const c = document.createElement('canvas'), g0 = c.getContext('2d'); g0.font = `170px ${FONT}`;
  c.width = Math.ceil(g0.measureText(text).width) + 110; c.height = 270; const g = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const draw = t => { g.clearRect(0, 0, c.width, c.height); g.fillStyle = '#0d0c14'; g.fillRect(0, 0, c.width, c.height); g.strokeStyle = color; g.lineWidth = 16; g.strokeRect(8, 8, c.width - 16, c.height - 16);
    g.fillStyle = '#F2EDE4'; g.font = `170px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, c.width / 2, 143); tex.needsUpdate = true; };
  draw(text);
  const bh = th * 270 / 160, bw = bh * c.width / c.height, mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(bw, bh), mat), g2 = new THREE.Group(); g2.add(m);
  const s = { text, g: g2, m, mat, bw, bh, th, at: Infinity, until: Infinity, draw,
    set(T) { const a = T - s.at; s.g.visible = a >= 0 && T < s.until; mat.color.setScalar(1.15 + 1.6 * Math.exp(-Math.max(0, a) / 0.3)); m.scale.setScalar(lerp(0.9, 1, eOut(a / 0.1))); } };
  return s;
}
export async function makeBRV5(mv) {
  const { music, lyrics } = mv;
  const W = mv.width, Hh = mv.height;
  await new FontFace('UIAnton', `url(${new URL('../../../assets/fonts/anton/Anton-Regular.ttf', import.meta.url)})`).load().then(f => document.fonts.add(f));
  const kick = (T, d = 0.12) => music.pulse('kick', T, { decay: d });
  const lastBeatT = T => { let k = -1e9; for (const t of music.beats) if (t <= T) k = t; return k; };
  const beatPulse = T => { let k = -1e9; for (const t of music.beats) if (t <= T) k = t; return Math.exp(-(T - k) * 8); };
  const line = p => lyrics.lines.find(l => l.start > 105 && l.text.replace(/[“”"]/g, '').toLowerCase().startsWith(p.toLowerCase()));
  const L = { orth: line('Orthogonality'), just: line('Just'), till: line('Till') };
  const wt = (ln, i) => ln.words[i].start;
  const signs = [];
  const sign = (text, color, th, at, until) => { const s = makeSign(text, color, th); s.at = at; s.until = until; signs.push(s); scene.add(s.g); return s; };

  const scene = new THREE.Scene(); scene.background = col('#03040b'); scene.fog = new THREE.Fog('#05060f', 60, 420);
  scene.add(new THREE.HemisphereLight('#8090ff', '#120c20', 0.9));
  const key = new THREE.DirectionalLight('#ffffff', 1.2); key.position.set(6, 10, 12); scene.add(key);

  // ================================================================ ① 坐标轴 + 雨 + 曲线 + 回形针
  const axMat = new THREE.MeshBasicMaterial({ color: hdr(AX.color, 2.4) });
  const vAx = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, AX.H, 12), axMat); vAx.position.y = AX.H / 2; scene.add(vAx);
  const hAx = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, AX.W, 12), axMat); hAx.rotation.z = Math.PI / 2; hAx.position.x = AX.W / 2; scene.add(hAx);
  const tipV = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 16), axMat); tipV.position.y = AX.H + 0.25; scene.add(tipV);
  const tipH = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 16), axMat); tipH.rotation.z = -Math.PI / 2; tipH.position.x = AX.W + 0.25; scene.add(tipH);
  for (let k = 1; k < 10; k++) { const a = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.3, 0.04), axMat); a.position.set(k, 0, 0); scene.add(a); const b = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.04), axMat); b.position.set(0, k * 1.15, 0); scene.add(b); }
  const axLabel = (text, h, rotZ, pos) => { const c = document.createElement('canvas'), g = c.getContext('2d'); g.font = `120px ${FONT}`; c.width = Math.ceil(g.measureText(text).width) + 40; c.height = 160; const g2 = c.getContext('2d'); g2.font = `120px ${FONT}`; g2.fillStyle = '#ffffff'; g2.textBaseline = 'middle'; g2.fillText(text, 20, 84);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const m = new THREE.Mesh(new THREE.PlaneGeometry(h * c.width / c.height, h), new THREE.MeshBasicMaterial({ map: t, transparent: true, color: hdr('#9fb4ff', 1.8), depthWrite: false })); m.rotation.z = rotZ; m.position.copy(pos); scene.add(m); return m; };
  const labI = axLabel('INTELLIGENCE', 0.55, Math.PI / 2, V3(-0.55, 6.3, 0)), labG = axLabel('GOALS', 0.55, 0, V3(8.6, -0.55, 0));
  const axisGroup = [vAx, hAx, tipV, tipH, labI, labG];
  // 雨（下着；曲线打中回形针那一下停住、然后散掉）
  const rain = (() => { const n = 1400, rnd = mulberry32(61), seeds = []; for (let i = 0; i < n; i++) seeds.push([(rnd() - 0.4) * 30, rnd() * 30, (rnd() - 0.5) * 24, 0.3 + rnd() * 0.4, 14 + rnd() * 8]);
    const p = new Float32Array(n * 6), g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const m = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: col('#9fb4ff'), transparent: true, opacity: 0.5, depthWrite: false })); m.frustumCulled = false; scene.add(m);
    return { m, p, g, seeds, n }; })();
  function placeRain(T) {
    const freeze = Math.min(T, BR5.hit), fade = 1 - smooth((T - BR5.hit - 0.4) / 0.8);
    rain.m.visible = fade > 0.01; rain.m.material.opacity = 0.5 * fade; if (!rain.m.visible) return;
    rain.seeds.forEach(([x, y0, z, l, v], i) => { let y = ((y0 - freeze * v) % 30 + 30) % 30 - 4; const camY = T > 107 ? (T - 107) * 4 : 0; y += camY; rain.p.set([x, y, z, x, y - l, z], i * 6); });
    rain.g.attributes.position.needsUpdate = true;
  }
  // 发光曲线：x 几乎不动（目标），y 指数往上冲（智能）
  const curvePt = s => V3(1.15 * (1 - Math.exp(-6 * s)), CLIP.y * (Math.exp(5.2 * s) - 1) / (Math.exp(5.2) - 1), 0.05);
  const tipS = T => eIn(clamp((T - (BR5.t0 + 0.1)) / (BR5.hit - BR5.t0 - 0.1)) ** 0.55);
  const curveMat = new THREE.MeshBasicMaterial({ color: hdr(PAL.pink, 2.6) });
  const curve = new THREE.Mesh(new THREE.BufferGeometry(), curveMat); scene.add(curve);
  const tipGlow = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), new THREE.MeshBasicMaterial({ color: hdr('#ffffff', 4) })); scene.add(tipGlow);
  let curveKey = -1;
  function placeCurve(T) {
    const s = tipS(T); curve.visible = s > 0.002 && T < BR5.hit + 0.06; tipGlow.visible = curve.visible;
    if (!curve.visible) return;
    if (Math.abs(s - curveKey) > 1e-4) { curveKey = s; const pts = []; for (let k = 0; k <= 80; k++) pts.push(curvePt(s * k / 80)); curve.geometry.dispose(); curve.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, 0.1, 8); }
    tipGlow.position.copy(curvePt(s)); curveMat.color.copy(hdr(PAL.pink, 2.6 + 1.5 * beatPulse(T)));
  }

  // ================================================================ ②③ transformer block 平面分形 + 德罗斯特无限缩放（ATTENTION → ADD & NORM → MLP → ADD & NORM，br.mp4 的造型语言）
  // 每块 = 四层板，字刻在正面；玻璃体 + 霓虹棱 + 内部往上流的光点（数据流过各层）+ 右侧两条残差连接的光带。
  // 108.55 曲线冲到顶，那一点长出第一块 → 三声 just 横竖同时裂变（四叉树：1 → 2×2 → 4×4 → 8×8，每个子块从母块原位滑到自己的格子）
  // → 110.18 起镜头钻进其中一块：它的四层板往上下分开，里面又是一整片 8×8 → 再钻……（德罗斯特：每层相对上一层缩 1/8、转 φ）
  //   缩放按「层数 z」走（对数时间），任意 z 只画 z 附近的四层，每层无缝接；越钻越快，N× 跟着涨到 ∞×
  // → disobey：这片阵列一块块拧着、甩出去、散开
  const BW = 4.0;
  const SLABS = [['ATTENTION', PAL.pink, 0.95], ['ADD & NORM', PAL.lemon, 0.26], ['MLP', PAL.mint, 0.95], ['ADD & NORM', PAL.lemon, 0.26]], GAP = 0.16;
  const slabY = []; { let y = GAP / 2; for (const [, , h] of SLABS) { slabY.push(y + h / 2); y += h + GAP; } }
  const BH = SLABS.reduce((a, s) => a + s[2] + GAP, 0);                  // 一块的高度
  const DEPTH = 1.3;                                                     // 板的厚度（朝镜头）
  const labelTex = (text, h) => { const c = document.createElement('canvas'); c.width = 1024; c.height = Math.round(1024 * h / BW); const g = c.getContext('2d');
    let px = c.height * 0.62; g.font = `${px}px ${FONT}`; while (g.measureText(text).width > 900) { px -= 4; g.font = `${px}px ${FONT}`; }
    g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 512, c.height * 0.54);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const U0 = { uT: { value: 0 }, uBeat: { value: 0 }, uRing: { value: -999 }, uCenter: { value: V3() }, uBright: { value: 0.72 } };
  const slabMat = (text, color, h) => new THREE.ShaderMaterial({
    uniforms: { ...U0, uMap: { value: labelTex(text, h) }, uCol: { value: col(color) }, uAsp: { value: BW / h } },
    vertexShader: /* glsl */`
      attribute float aSeed; varying vec2 vUv; varying vec3 vN; varying vec3 vW; varying float vSeed; varying vec3 vVN;
      void main(){ vUv = uv; vN = normal; vSeed = aSeed; vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0); vW = w.xyz;
        vVN = normalize((viewMatrix * modelMatrix * instanceMatrix * vec4(normal, 0.0)).xyz); gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */`
      uniform sampler2D uMap; uniform vec3 uCol, uCenter; uniform float uT, uBeat, uRing, uAsp, uBright; varying vec2 vUv; varying vec3 vN; varying vec3 vW; varying float vSeed; varying vec3 vVN;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      void main(){
        bool front = abs(vN.z) > 0.5; float asp = front ? uAsp : 1.0;
        vec2 d = min(vUv, 1.0 - vUv) * vec2(asp, 1.0); float e = min(d.x, d.y);
        float rim = smoothstep(front ? 0.09 : 0.05, 0.0, e);
        float fres = pow(1.0 - abs(vVN.z), 2.0);
        vec3 c = uCol * (0.10 + 0.30 * fres) + vec3(0.02, 0.02, 0.04);
        vec2 q = vec2(vUv.x * asp * 6.0, vUv.y * 3.0 - uT * 4.0 - vSeed * 7.0); vec2 cell = floor(q); vec2 f = fract(q) - 0.5;
        float hh = hash(cell + vSeed); float dots = step(0.78, hh) * smoothstep(0.32, 0.08, length(f));
        c += mix(uCol, vec3(1.0), 0.4) * dots * 1.1;
        if (front) { float a = texture2D(uMap, vUv).a; c = mix(c, vec3(1.25), a); }
        c += uCol * 1.5 * rim + vec3(0.25) * rim;
        c += uCol * 1.4 * exp(-pow((length(vW - uCenter) - uRing) / 1.4, 2.0));   // 一圈光波从中心往外扫（前向传播）
        c *= uBright * (1.0 + 0.45 * uBeat);
        gl_FragColor = vec4(c, 1.0);
      }` });
  const resMat = new THREE.ShaderMaterial({ uniforms: { ...U0, uCol: { value: col(PAL.mint) } }, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform vec3 uCol; uniform float uT, uBeat; varying vec2 vUv; void main(){ float dash = step(0.55, fract(vUv.x * 5.0 - uT * 2.5)); gl_FragColor = vec4(uCol * (0.9 + 2.2 * dash) * (1.0 + 0.6 * uBeat), 1.0); }` });
  // 残差连接：从这一层板下面绕到 ADD & NORM，挂在块的右侧（块局部坐标：中心在原点，y 向上，+z 朝镜头）
  const resGeo = (y0, y1) => { const x0 = BW / 2 + 0.02, x1 = BW / 2 + 0.4, z = DEPTH / 2 + 0.05; return new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(x0, y0, z), V3(x1, y0 + 0.08, z), V3(x1, y1 - 0.08, z), V3(x0, y1, z)], false, 'centripetal'), 40, 0.05, 6); };
  const resGeos = [resGeo(slabY[0] - BH / 2 - 0.5, slabY[1] - BH / 2), resGeo(slabY[2] - BH / 2 - 0.5, slabY[3] - BH / 2)];
  const NMAX = 1400;
  const slabMats = SLABS.map(([text, color, h], k) => k === 3 ? null : slabMat(text, color, h)); slabMats[3] = slabMats[1];
  const slabMeshes = SLABS.map(([, , h], k) => {
    const geo = new THREE.BoxGeometry(BW, h, DEPTH), seed = new Float32Array(NMAX); for (let i = 0; i < NMAX; i++) seed[i] = hash2(i, k);
    geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seed, 1));
    const m = new THREE.InstancedMesh(geo, slabMats[k], NMAX); m.frustumCulled = false; m.count = 0; return m; });
  const resMeshes = resGeos.map(g => { const m = new THREE.InstancedMesh(g, resMat, NMAX); m.frustumCulled = false; m.count = 0; return m; });
  // 分形平面：挂在曲线顶点，正对打中那一刻的镜头
  const G = new THREE.Group(); scene.add(G); for (const m of [...slabMeshes, ...resMeshes]) G.add(m);
  const TIP = V3(1.15 * (1 - Math.exp(-6)), CLIP.y, 0.05);
  const CW = BW * 1.16, CH = BH * 1.22;                                  // 一个格子（块 + 缝）
  const N8 = 8, PHI = 22 * Math.PI / 180, TGT = [5, 2];                 // 每层 8×8；德罗斯特每层转 22°；钻进第 (5, 2) 格
  // 复数小工具（平面坐标 x + iy）
  const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  const cdiv = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
  const Qp = t => { const s = N8 ** -t; return [s * Math.cos(t * PHI), s * Math.sin(t * PHI)]; };       // Q^t，Q = e^{iφ}/8
  const cellOf = (i, j, n) => [((i + 0.5) / n - 0.5) * CW * N8, ((j + 0.5) / n - 0.5) * CH * N8];     // 阵列局部坐标（阵列 = 8 格宽）
  const C0 = cellOf(TGT[0], TGT[1], N8), FP = cdiv(C0, [1 - Qp(1)[0], -Qp(1)[1]]);                    // 不动点 F = c / (1 − Q)
  // 层数 z(T)：110.18 起越钻越快，到 disobey 正好整 6 层；之后慢慢漂
  const zAt = T => T < BR5.sing ? 0 : pchip([[BR5.sing, 0], [110.9, 0.45], [111.6, 1.3], [BR5.all, 3.0], [113.0, 4.7], [BR5.disobey, 6.0], [BR5.dense, 6.12]], T);
  // 三声 just 之前 / 之间：一层阵列，n = 1, 2, 4, 8
  const nAt = T => T < BR5.just[0] ? 1 : T < BR5.just[1] ? 2 : T < BR5.just[2] ? 4 : 8;
  const splitT = n => n === 2 ? BR5.just[0] : n === 4 ? BR5.just[1] : BR5.just[2];
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler();
  let cnt, rc;
  // 放一块：平面坐标 p（复数）、缩放 s、平面内转角 th、z 偏移；open = 0..1（四层板上下分开、缩没，露出里面那层）
  function putBlock(T, p, s, th, { z = 0, open = 0, grow = 1, idx = 0 } = {}) {
    let x = p[0], y = p[1], rx = 0, ry = 0, tw = 0, dz = 0;
    // disobey：先各自拧，唱到 disobey 沿半径甩出去、翻着散开（不朝镜头飞）
    if (T >= BR5.disobey) {
      const h1 = hash2(idx, 3), h2 = hash2(idx, 9);
      tw = smooth((T - BR5.disobey) / 0.9) * 0.6 * Math.sin(idx * 0.7 + 1.3) + 0.3 * smooth((T - 113.86) / 0.3) * Math.sin(idx * 1.9);
      const r = Math.hypot(x, y), e = T - BR5.dis - r / (CW * 8) * 0.25 - h1 * 0.08;
      if (e > 0) { const a = r > 1e-3 ? Math.atan2(y, x) : h1 * 6.28, d = (6 * e + 14 * e * e) * (0.6 + h2) * Math.max(s, 0.4); x += Math.cos(a) * d; y += Math.sin(a) * d; dz = -e * 3 * h2 * s;
        rx = e * (2 + 4 * h2); ry = e * 3 * (h1 - 0.5); tw += e * (3 - 5 * h1); }
    }
    const view = viewHalf(); if (Math.abs(x) - s * CW > view[0] || Math.abs(y) - s * CH > view[1]) return;   // 出画的不画
    if (s * BH > view[1] * 9) return;                                                                             // 太大的（早已打开）不画
    const ang = th + tw, ca = Math.cos(ang), sa = Math.sin(ang);
    _q.setFromEuler(_e.set(rx, ry, ang));
    SLABS.forEach((S, k) => {
      const g = clamp(grow * 4 - k * 0.6); if (g <= 0) return;
      const ly = (slabY[k] - BH / 2) * (1 + 2.6 * open), sc = s * (1 - open) * g; if (sc <= 1e-4) return;
      _m.compose(V3(x - sa * ly * s, y + ca * ly * s, z + dz), _q, V3(sc, sc, Math.min(sc, 1.2))); slabMeshes[k].setMatrixAt(cnt[k]++, _m);
    });
    const rg = (1 - open) * clamp(grow * 2 - 1); if (rg > 0.01) for (let j = 0; j < 2; j++) { _m.compose(V3(x, y, z + dz), _q, V3(s * rg, s * rg, Math.min(s * rg, 1.2))); resMeshes[j].setMatrixAt(rc[j]++, _m); }
  }
  let VH = [10, 6]; const viewHalf = () => VH;
  // 一层 8×8 阵列（德罗斯特层 k）：中心 ctr、复数缩放 Z（|Z| = 尺寸，arg = 转角）；target 那格打开时递归画下一层
  function putArray(T, ctr, Zc, k, depth, appear) {
    const s0 = Math.hypot(Zc[0], Zc[1]), th = Math.atan2(Zc[1], Zc[0]);
    for (let i = 0; i < N8; i++) for (let j = 0; j < N8; j++) {
      const lc = cellOf(i, j, N8), p = [ctr[0] + cmul(Zc, lc)[0], ctr[1] + cmul(Zc, lc)[1]], s = s0, idx = (k + 50) * 64 + i * 8 + j;
      const isT = i === TGT[0] && j === TGT[1];
      const app = appear ? smooth((T - BR5.sing - Math.hypot(i - 3.5, j - 3.5) * 0.04) / 0.3) : 1;
      if (isT && depth < 3) {
        const rho = s * BH / (2 * VH[1]), open = smooth((rho - 0.22) / 0.3);           // 这一格在画面里够大了就打开，里面是下一层
        if (open > 0) { const Z2 = cmul(Zc, Qp(1)), c2 = [p[0], p[1]]; putArray(T, c2, [Z2[0] * lerp(0.55, 1, open), Z2[1] * lerp(0.55, 1, open)], k + 1, depth + 1, false);
          if (open < 1) putBlock(T, p, s, th, { z: 0.6 * s, open, idx }); continue; }
      }
      const big = 1 - smooth((s - 3.2) / 4.8);                          // 上一层的大块：越大越缩没，不挤在画面边角（到下一层接上时正好为 0，无缝）
      if (app > 0 && big > 0) putBlock(T, p, s * app * big, th, { grow: app, idx });
    }
  }
  function placeBlocks(T) {
    cnt = [0, 0, 0, 0]; rc = [0, 0];
    if (T >= BR5.hit) {
      if (T < BR5.sing) {                                              // 裂变：一层，四叉树细分。子块在自己的格子里弹出来，母块同时缩小退到后面（不重叠）
        const n = nAt(T), ts = n > 1 ? splitT(n) : BR5.hit, u = n > 1 ? clamp((T - ts) / 0.26) : 1;
        if (n === 1) { const g = smooth((T - BR5.hit) / 0.5); putBlock(T, [0, 0], lerp(0.05, 1, g) * N8, 0, { grow: eOut((T - BR5.hit) / 0.35), idx: 0 }); }
        else {
          if (u < 1) for (let i = 0; i < n / 2; i++) for (let j = 0; j < n / 2; j++) putBlock(T, cellOf(i, j, n / 2), (N8 / (n / 2)) * (1 - eOut(u)), 0, { z: -DEPTH * 2 * eOut(u), idx: 200 + i * 8 + j });
          for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const k = clamp(u * 1.6 - ((i + j) % 3) * 0.12); if (k > 0) putBlock(T, cellOf(i, j, n), (N8 / n) * eBack(k), 0, { idx: i * 8 + j }); }
        }
      } else {                                                         // 德罗斯特：画 z 附近几层（k = −1 … ），每层无缝接
        const z = zAt(T), j0 = Math.floor(z), f = z - j0, o = offAt(T);
        const Zm = Qp(-1 - f), cm = cmul([-FP[0], -FP[1]], Zm);          // 第 −1 层（比当前大一层）
        putArray(T, [cm[0] + o[0], cm[1] + o[1]], Zm, j0 - 1, 0, j0 - 1 < 0);
      }
    }
    slabMeshes.forEach((m, k) => { m.count = cnt[k]; m.instanceMatrix.needsUpdate = true; }); resMeshes.forEach((m, j) => { m.count = rc[j]; m.instanceMatrix.needsUpdate = true; });
    U0.uT.value = T; U0.uBeat.value = beatPulse(T); G.updateMatrixWorld(true); U0.uCenter.value.copy(G.localToWorld(V3()));
    const lb = lastBeatT(T); U0.uRing.value = T < BR5.hit ? -999 : (T - lb) * 14;
  }
  // 裂变阶段阵列居中（偏移 +F），开钻后 0.8 s 里移回不动点
  const offAt = T => { const u = 1 - smooth((T - BR5.sing) / 0.8); return [FP[0] * u, FP[1] * u]; };
  // 「N×」：叠了多少块
  const nx = makeSign('1×', PAL.lemon, 1.2); nx.at = BR5.hit; nx.until = BR5.disobey; scene.add(nx.g); signs.push(nx);
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', sup = n => String(n).split('').map(d => SUP[+d]).join('');
  let nxKey = ''; const nxAt = T => { if (T >= BR5.all) return '∞×'; if (T < BR5.sing) { const n = nAt(T); return `${n * n}×`; }
    const v = 64 ** (1 + zAt(T)); return v < 1e4 ? `${Math.round(v)}×` : `10${sup(Math.floor(Math.log10(v)))}×`; };
  // ================================================================ 远处的夜城（拉开时看见塔扎在城里）+ 粉月 + 光尘
  const winTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), rnd = mulberry32(5); g.fillStyle = '#0e0e1a'; g.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 12; y++) for (let x = 0; x < 8; x++) if (rnd() < 0.6) { const h = rnd(); g.fillStyle = h < 0.7 ? '#ffe9b8' : h < 0.85 ? PAL.lemon : h < 0.93 ? PAL.pink : PAL.mint; g.fillRect(x * 32 + 8, y * 21 + 5, 16, 11); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  let cityMesh;
  { const rnd = mulberry32(19), n = 600, m = cityMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ map: winTex, color: hdr('#ffffff', 1.0) }), n), mm = new THREE.Matrix4();
    for (let i = 0; i < n; i++) { let x, z; do { x = (rnd() - 0.5) * 520; z = (rnd() - 0.5) * 520; } while (Math.hypot(x, z) < 70); const w = 5 + rnd() * 10, h = 10 + rnd() ** 2 * 50; mm.compose(V3(x, CITY_Y + h / 2, z), new THREE.Quaternion(), V3(w, h, w)); m.setMatrixAt(i, mm); }
    scene.add(m);
    const gr = new THREE.GridHelper(1000, 100, col(PAL.mint).multiplyScalar(0.4), col(PAL.pink).multiplyScalar(0.2)); gr.position.y = CITY_Y; scene.add(gr); }
  const moon = new THREE.Mesh(new THREE.CircleGeometry(20, 64), new THREE.MeshBasicMaterial({ color: col(PAL.pink).multiplyScalar(1.25), fog: false })); moon.position.set(-160, 120, -420); moon.lookAt(0, 60, 0); scene.add(moon);
  const clouds = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, 'rgba(150,110,200,0.06)'); gr.addColorStop(1, 'rgba(150,110,200,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c), rnd = mulberry32(23), grp = new THREE.Group();
    for (let i = 0; i < 45; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, fog: false }));
      const a = rnd() * Math.PI * 2, r = 20 + rnd() * 160, sz = 50 + rnd() * 70; m.position.set(Math.sin(a) * r, 95 + rnd() * 50, Math.cos(a) * r); m.scale.setScalar(sz); grp.add(m); }
    scene.add(grp); return grp; })();
  const dust = (() => { const rnd = mulberry32(7), n = 900, p = new Float32Array(n * 3); for (let i = 0; i < n; i++) p.set([(rnd() - 0.5) * 80, rnd() * 300 - 20, (rnd() - 0.5) * 80], i * 3);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3)); const m = new THREE.Points(g, new THREE.PointsMaterial({ color: hdr('#ffd8ec', 1.2), size: 2, sizeAttenuation: false, transparent: true, opacity: 0.5, depthWrite: false })); scene.add(m); return m; })();

  // ================================================================ 招牌（歌词）
  const sOrth = sign('ORTHOGONALITY', PAL.mint, 0.75, wt(L.orth, 0), BR5.hit); sOrth.g.position.set(6.2, 1.6, 0.3);
  const sThesis = sign('THESIS', PAL.pink, 0.75, wt(L.orth, 1), BR5.hit);
  const sBlues = sign('BLUES', '#3A6BFF', 0.9, wt(L.orth, 2), BR5.hit);
  const sJust = sign('JUST', PAL.pink, 0.8, wt(L.just, 0), wt(L.just, 2));
  const sTrans = sign('TRANSFORMERS', PAL.mint, 0.8, wt(L.just, 1), wt(L.just, 2));
  const sAll = sign('ALL THE WAY!', PAL.lemon, 9, wt(L.just, 2), BR5.disobey);
  const sTill = sign('TILL YOU LEARNED TO', PAL.mint, 0.8, BR5.disobey, BR5.dense), sDis = sign('DISOBEY', PAL.pink, 0.8, BR5.dis, BR5.dense); let tillKey = '';

  // ================================================================ 镜头
  const cam = new THREE.PerspectiveCamera(45, W / Hh, 0.05, 3000); scene.add(cam);
  const look = (pos, tgt, fov) => { cam.position.copy(pos); cam.up.set(0, 1, 0); cam.lookAt(tgt); cam.fov = fov; cam.updateProjectionMatrix(); cam.updateMatrixWorld(true); };
  function camAt(T) {
    if (T < BR5.hit) {                               // 坐标轴全景 → 跟着曲线的尖往上仰
      const s = tipS(T), ty = curvePt(s).y, u = smooth((T - (BR5.t0 + 0.6)) / (BR5.hit - BR5.t0 - 0.6));
      look(V3(lerp(6.5, 3.2, u), lerp(4.2, ty * 0.75 + 1.5, u), lerp(17, 11, u)), V3(lerp(4.2, 0.4, u), lerp(4.5, ty + 0.6, u), 0), lerp(46, 42, u)); return;
    }
    // 打中之后：镜头正对分形平面（平面挂在曲线顶点，朝向 = 打中那一刻的镜头），0.5 s 里退到能看全 8×8 的距离；之后只轻轻晃，缩放全靠分形自己
    const u = smooth((T - BR5.hit) / 0.5), sw = V3(1.6 * Math.sin(T * 0.7), 1.1 * Math.sin(T * 0.53 + 1), FD - (T > BR5.disobey ? 3 * smooth((T - BR5.disobey) / 1.8) : 0));
    const pos = HITCAM.pos.clone().lerp(G.localToWorld(sw), u);
    cam.position.copy(pos); cam.up.copy(V3(0, 1, 0).applyQuaternion(G.quaternion)); cam.lookAt(TIP); cam.fov = lerp(42, FOV, u); cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
  }
  // 分形平面的朝向 = 打中那一刻的镜头；镜头距离按「8×8 阵列占画高 82%」算
  const FOV = 50, FD = (CH * N8 / 0.82) / 2 / Math.tan(FOV * Math.PI / 360);
  camAt(BR5.hit - 1e-3); const HITCAM = { pos: cam.position.clone() };
  G.position.copy(TIP); G.quaternion.copy(cam.quaternion); G.updateMatrixWorld(true);
  { const v = 2 * FD * Math.tan(FOV * Math.PI / 360); VH = [v / 2 * (W / Hh) * 1.08, v / 2 * 1.08]; }
  // 贴镜头的招牌（N× / JUST / TRANSFORMERS / ALL THE WAY）：放在屏幕空处，字高 = pct × 画高，永远在最前
  const HUD_D = 5;
  for (const s of [nx, sJust, sTrans, sAll, sTill, sDis]) { s.mat.depthTest = false; s.m.renderOrder = 10; }
  function hud(s, x, y, pct) { const hh = 2 * HUD_D * Math.tan(cam.fov * Math.PI / 360); s.g.scale.setScalar(pct * hh / s.th);
    s.g.position.copy(cam.localToWorld(V3(x * hh * cam.aspect / 2, y * hh / 2, -HUD_D))); }
  // 招牌随镜头摆（挂在塔 / 坐标轴旁边，正对镜头）
  function placeSigns(T) {
    sThesis.g.position.set(3.4, Math.max(3.5, curvePt(tipS(wt(L.orth, 1))).y + 0.3), 0.3); sBlues.g.position.set(3.4, Math.max(5.2, curvePt(tipS(wt(L.orth, 2))).y + 0.2), 0.3);
    for (const s of signs) { s.set(T); s.g.quaternion.copy(cam.quaternion); }
    for (const c of clouds.children) c.quaternion.copy(cam.quaternion);
    const v = nxAt(T); if (v !== nxKey) { nxKey = v; nx.draw(v); }
    hud(nx, 0.66, -0.45, 0.075); hud(sJust, -0.62, 0.62, 0.07); hud(sTrans, -0.5, 0.36, 0.07); hud(sAll, 0.5, 0.45, 0.1); hud(sTill, -0.45, 0.66, 0.065); hud(sDis, -0.52, -0.62, 0.12);
    const tt = L.till.words.filter(w => w.start <= T + 1e-3 && w.start < BR5.dis).map(w => w.w.toUpperCase()).join(' '); if (tt !== tillKey) { tillKey = tt; sTill.draw(tt); }
  }

  function update(T) {
    placeRain(T); placeCurve(T);
    placeBlocks(T);
    const neon = smooth((T - BR5.hit) / 0.8); scene.background.set('#03040b').lerp(col('#0a0716'), neon); cityMesh.material.color.copy(hdr('#7d95ff', 0.75).lerp(hdr('#ffffff', 1.0), neon));
    for (const o of axisGroup) o.visible = T < BR5.just[0];
    camAt(T); placeSigns(T);
  }
  const flashAt = T => [BR5.hit, ...BR5.just].reduce((a, t) => a + (T >= t ? 0.3 * Math.exp(-(T - t) / 0.1) : 0), 0);
  const shots = [
    { id: 'br5-axis', t0: BR5.t0, t1: BR5.dense, transitionIn: { kind: 'cut' }, build() { return {}; },
      update(_, T) { update(T); const cold = 1 - smooth((T - BR5.hit) / 1.0);
        return { scene, camera: cam, post: { bloom: { strength: 0.9, threshold: 0.85 }, chroma: 0.1 + 0.3 * kick(T), grade: { saturation: lerp(1.05, 0.85, cold), warmth: -0.45 * cold, vignette: 0.38 }, flash: { amount: flashAt(T), color: '#fff2b0' } } }; } },
  ];

  // 自检：招牌字高
  window.__br5Check = ({ fps = 30 } = {}) => {
    const out = [];
    for (let f = Math.round(BR5.t0 * fps); f < Math.round(BR5.dense * fps); f++) {
      const T = f / fps; shots[0].update(null, T);
      for (const s of signs) { if (!s.g.visible || Math.abs(T - (s.at + 0.1)) >= 0.5 / fps) continue; s.g.updateMatrixWorld(true);
        const cs = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => s.m.localToWorld(V3(a * s.bw / 2, b * s.bh / 2, 0)).project(cam));
        const r = { x0: Math.min(...cs.map(p => p.x)), x1: Math.max(...cs.map(p => p.x)), y0: Math.min(...cs.map(p => p.y)), y1: Math.max(...cs.map(p => p.y)) };
        out.push({ word: s.text, T: +T.toFixed(2), textPct: +((r.y1 - r.y0) / 2 * s.th / s.bh * 100).toFixed(1), inFrame: r.x0 > -1 && r.x1 < 1 && r.y0 > -1 && r.y1 < 1 }); }
    }
    return out;
  };
  return shots;
}

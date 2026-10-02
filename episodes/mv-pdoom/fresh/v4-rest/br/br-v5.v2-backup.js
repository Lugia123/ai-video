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
import { mulberry32, createPaperclips } from '../kits/world.js';

const hash2 = (a, b) => { let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
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
  const clip = createPaperclips({ count: 1, seed: 1, clipSize: 0.55 }).mesh; clip.setColorAt(0, hdr('#ffffff', 1.1)); clip.instanceColor.needsUpdate = true; scene.add(clip);

  // ================================================================ ②③ transformer block 层塔（ATTENTION → ADD & NORM → MLP → ADD & NORM，br.mp4 的造型语言）
  // 每块 = 四层板，字刻在侧面；玻璃体 + 霓虹棱 + 内部往上流的光点（数据流过各层）+ 右侧两条残差连接的光带；块与块之间中轴一根光柱。
  // 108.55 打中那一点长出第一块（四层板一层层冒出来）→ 三声 just 整座塔「裂变」：把已有的塔复制一份滑到上面（1 → 2 → 4 → 8）
  // → 110.18 起一块接一块从顶上往上滑出，越来越快 → all the way 塔也往下长，扎进夜城
  const TX = CLIP.x, TZ = CLIP.z, BW = 4.0;
  const SLABS = [['ATTENTION', PAL.pink, 0.95], ['ADD & NORM', PAL.lemon, 0.26], ['MLP', PAL.mint, 0.95], ['ADD & NORM', PAL.lemon, 0.26]], GAP = 0.16;
  const slabY = []; { let y = GAP / 2; for (const [, , h] of SLABS) { slabY.push(y + h / 2); y += h + GAP; } }
  const BH = SLABS.reduce((a, s) => a + s[2] + GAP, 0);                  // 一块的高度
  const labelTex = (text, h) => { const c = document.createElement('canvas'); c.width = 1024; c.height = Math.round(1024 * h / BW); const g = c.getContext('2d');
    let px = c.height * 0.62; g.font = `${px}px ${FONT}`; while (g.measureText(text).width > 900) { px -= 4; g.font = `${px}px ${FONT}`; }
    g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 512, c.height * 0.54);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const U0 = { uT: { value: 0 }, uBeat: { value: 0 }, uWaveY: { value: -999 }, uBright: { value: 0.72 } };
  const slabMat = (text, color, h) => new THREE.ShaderMaterial({
    uniforms: { ...U0, uMap: { value: labelTex(text, h) }, uCol: { value: col(color) }, uAsp: { value: BW / h } },
    vertexShader: /* glsl */`
      attribute float aSeed; varying vec2 vUv; varying vec3 vN; varying vec3 vW; varying float vSeed; varying vec3 vVN;
      void main(){ vUv = uv; vN = normal; vSeed = aSeed; vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0); vW = w.xyz;
        vVN = normalize((viewMatrix * modelMatrix * instanceMatrix * vec4(normal, 0.0)).xyz); gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */`
      uniform sampler2D uMap; uniform vec3 uCol; uniform float uT, uBeat, uWaveY, uAsp, uBright; varying vec2 vUv; varying vec3 vN; varying vec3 vW; varying float vSeed; varying vec3 vVN;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      void main(){
        bool side = abs(vN.y) < 0.5; float asp = side ? uAsp : 1.0;
        vec2 d = min(vUv, 1.0 - vUv) * vec2(asp, 1.0); float e = min(d.x, d.y) / (side ? 1.0 : 1.0);
        float rim = smoothstep(side ? 0.09 : 0.03, 0.0, e);
        float fres = pow(1.0 - abs(vVN.z), 2.0);
        vec3 c = uCol * (0.10 + 0.30 * fres) + vec3(0.02, 0.02, 0.04);
        // 往上流的光点（数据流过这一层）
        vec2 q = vec2(vUv.x * asp * 6.0, vUv.y * 3.0 - uT * 4.0 - vSeed * 7.0); vec2 cell = floor(q); vec2 f = fract(q) - 0.5;
        float h = hash(cell + vSeed); float dots = step(0.78, h) * smoothstep(0.32, 0.08, length(f));
        c += mix(uCol, vec3(1.0), 0.4) * dots * 1.1;
        if (side) { float a = texture2D(uMap, vUv).a; c = mix(c, vec3(1.25), a); }
        else { vec2 gq = abs(fract(vUv * 6.0) - 0.5); c += uCol * 0.25 * smoothstep(0.47, 0.5, max(gq.x, gq.y)); }
        c += uCol * 1.5 * rim + vec3(0.25) * rim;
        c += uCol * 1.6 * exp(-pow((vW.y - uWaveY) / 1.6, 2.0));             // 一道亮带沿塔往上扫（前向传播）
        c *= uBright * (1.0 + 0.45 * uBeat);
        gl_FragColor = vec4(c, 1.0);
      }` });
  // 残差连接：从这一层板下面绕到 ADD & NORM，挂在块的右侧（+x）
  const resMat = new THREE.ShaderMaterial({ uniforms: { ...U0, uCol: { value: col(PAL.mint) } }, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform vec3 uCol; uniform float uT, uBeat; varying vec2 vUv; void main(){ float dash = step(0.55, fract(vUv.x * 5.0 - uT * 2.5)); gl_FragColor = vec4(uCol * (0.9 + 2.2 * dash) * (1.0 + 0.6 * uBeat), 1.0); }` });
  const resGeo = (y0, y1) => { const x0 = BW / 2 + 0.02, x1 = BW / 2 + 0.55; return new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(x0, y0, 0.9), V3(x1, y0 + 0.1, 0.9), V3(x1, y1 - 0.1, 0.9), V3(x0, y1, 0.9)], false, 'centripetal'), 40, 0.05, 6); };
  const resGeos = [resGeo(slabY[0] - 0.55, slabY[1]), resGeo(slabY[2] - 0.55, slabY[3])];
  // 块表
  const blocksT = [];                                                     // { t, y, from }（from = 从哪个高度滑上来）
  blocksT.push({ t: BR5.hit, y: CLIP.y, from: CLIP.y, grow: true });
  BR5.just.forEach((t, j) => { const n = 2 ** j; for (let b = n; b < 2 * n; b++) blocksT.push({ t, y: CLIP.y + b * BH, from: CLIP.y + (b - n) * BH, dur: 0.24 }); });
  { let t = BR5.sing, dt = 0.2; for (let b = 8; b < 128; b++) { blocksT.push({ t, y: CLIP.y + b * BH, from: CLIP.y + (b - 1) * BH, dur: Math.max(0.06, Math.min(0.2, dt * 1.2)) }); t += dt; dt = Math.max(0.026, dt * 0.9); } }
  const DOWN = Math.ceil((CLIP.y - CITY_Y) / BH) + 4;
  for (let d = 1; d <= DOWN; d++) blocksT.push({ t: BR5.all - 0.1 + d * 0.03, y: CLIP.y - d * BH, from: CLIP.y - (d - 1) * BH, dur: 0.12 });
  const NBL = blocksT.length;
  const slabMats = SLABS.map(([text, color, h], k) => k === 3 ? null : slabMat(text, color, h));
  const slabMeshes = SLABS.map(([text, color, h], k) => {
    const geo = new THREE.BoxGeometry(BW, h, BW), seed = new Float32Array(NBL); for (let i = 0; i < NBL; i++) seed[i] = hash2(i, k);
    geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seed, 1));
    const m = new THREE.InstancedMesh(geo, k === 3 ? slabMats[1] : slabMats[k], NBL); m.frustumCulled = false; m.count = 0; scene.add(m); return m; });
  const resMeshes = resGeos.map(g => { const m = new THREE.InstancedMesh(g, resMat, NBL); m.frustumCulled = false; m.count = 0; scene.add(m); return m; });
  const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1, 10), new THREE.MeshBasicMaterial({ color: hdr('#ffffff', 2.2) })); scene.add(spine);
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler();
  const blockY = (B, T) => { const u = B.grow ? 1 : eOut((T - B.t) / B.dur); return lerp(B.from, B.y, u); };
  // 「Till you learned to disobey」：一块块各自绕中轴拧（整块刚体转，块和块上下错开、不穿模），唱到 disobey 每层板沿半径甩出塔、翻着飞出画面
  const DIS_Y = CLIP.y + 22 * BH;                                        // 这一句镜头看的高度
  function rogue(T, p, ry, L, i) {
    const tw = smooth((T - BR5.disobey) / 0.9) * 0.55 * Math.sin(L * 0.45 + 1.3) + 0.25 * smooth((T - 113.86) / 0.3) * Math.sin(L * 1.7);
    if (tw !== 0) { const c = Math.cos(tw), s = Math.sin(tw), x = p.x - TX, z = p.z - TZ; p.x = TX + x * c + z * s; p.z = TZ - x * s + z * c; ry += tw; }
    const e = T - BR5.dis - Math.abs(p.y - DIS_Y) * 0.006 - hash2(L, i) * 0.06;
    if (e <= 0) return { rx: 0, ry, rz: 0 };
    let a = hash2(L * 4 + i, 3) * Math.PI * 2; const ca = 0.6 + (T - BR5.disobey) * 0.35; if (Math.cos(a - ca) > 0.3) a += Math.PI; const dx = Math.sin(a), dz = Math.cos(a), d = 9 * e + 16 * e * e, hh = hash2(i, L + 7);
    p.x += dx * d; p.z += dz * d; p.y += (hh - 0.4) * 6 * e;
    return { rx: e * (2 + 4 * hh), ry: ry + e * 3 * (hh - 0.5), rz: e * (3 - 5 * hh) };
  }
  function placeBlocks(T) {
    const cnt = [0, 0, 0, 0], rc = [0, 0]; let lo = Infinity, hi = -Infinity;
    blocksT.forEach((B, b) => {
      if (T < B.t) return;
      const y0 = blockY(B, T);
      SLABS.forEach((S, k) => {
        const g = B.grow ? eOut((T - B.t - k * 0.07) / 0.14) : 1; if (g <= 0) return;
        const p = V3(TX, y0 + slabY[k], TZ), r = rogue(T, p, 0, b, k);
        _m.compose(p, _q.setFromEuler(_e.set(r.rx, r.ry, r.rz)), V3(1, g, 1)); slabMeshes[k].setMatrixAt(cnt[k]++, _m);
      });
      if (T < BR5.dis) { lo = Math.min(lo, y0); hi = Math.max(hi, y0 + BH); }
      const rg = B.grow ? eOut((T - B.t - 0.3) / 0.15) : 1;
      if (rg > 0) for (let j = 0; j < 2; j++) { const p = V3(TX, y0, TZ), r = rogue(T, p, 0, b, j * 2 + 1); _m.compose(p, _q.setFromEuler(_e.set(r.rx, r.ry, r.rz)), V3(1, rg, 1)); resMeshes[j].setMatrixAt(rc[j]++, _m); }
    });
    slabMeshes.forEach((m, k) => { m.count = cnt[k]; m.instanceMatrix.needsUpdate = true; }); resMeshes.forEach((m, j) => { m.count = rc[j]; m.instanceMatrix.needsUpdate = true; });
    spine.visible = hi > lo; if (spine.visible) { spine.position.set(TX, (lo + hi) / 2, TZ); spine.scale.set(1, hi - lo, 1); }
    U0.uT.value = T; U0.uBeat.value = beatPulse(T); U0.uWaveY.value = T < BR5.hit ? -999 : CLIP.y - 4 + ((T - BR5.hit) % 1.36) * 70;
  }
  const topF = T => { let hi = CLIP.y; for (const B of blocksT) if (T >= B.t && B.y >= CLIP.y) hi = Math.max(hi, blockY(B, T) + BH); return hi; };
  const nBlocks = T => blocksT.filter(B => T >= B.t && B.y >= CLIP.y).length;
  // 「N×」：经典结构图里那个堆叠次数，一路涨
  const nx = makeSign('1×', PAL.lemon, 1.2); nx.at = BR5.hit; nx.until = BR5.disobey; scene.add(nx.g); signs.push(nx);
  let nxKey = ''; const nxAt = T => T >= BR5.all ? '∞×' : T >= 112.1 ? '10⁶×' : T >= 111.7 ? '10³×' : `${nBlocks(T)}×`;

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
  const sOrth = sign('ORTHOGONALITY', PAL.mint, 0.75, wt(L.orth, 0), L.orth.end + 0.4); sOrth.g.position.set(6.2, 1.6, 0.3);
  const sThesis = sign('THESIS', PAL.pink, 0.75, wt(L.orth, 1), L.orth.end + 0.4);
  const sBlues = sign('BLUES', '#3A6BFF', 0.9, wt(L.orth, 2), L.orth.end + 0.4);
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
    if (T < BR5.sing) {                              // 打中 → 三声 just：塔一次次翻倍，镜头 3/4 侧面往后退、往上抬，整座塔一直在画里
      const h = topF(T) - CLIP.y, cy = CLIP.y + h * 0.5, d = pchip([[BR5.hit, 9], [BR5.just[0] + 0.2, 13], [BR5.just[1] + 0.2, 20], [BR5.just[2] + 0.2, 34], [BR5.sing, 36]], T), a = 0.55 + (T - BR5.hit) * 0.12;
      look(V3(TX + Math.sin(a) * d, cy - h * 0.15 + 1, TZ + Math.cos(a) * d), V3(TX, cy, TZ), 46); return;
    }
    if (T < 111.4) {                                 // 唱起来：仰拍贴着塔身往上冲（塔顶一直在画面上方往上长）
      const ty = topF(T - 0.08), a = 0.9 + (T - BR5.sing) * 0.5, R = pchip([[BR5.sing, 30], [BR5.sing + 0.35, 7.5], [111.4, 7]], T);
      look(V3(TX + Math.sin(a) * R, ty - pchip([[BR5.sing, 10], [BR5.sing + 0.35, 9], [111.4, 8]], T), TZ + Math.cos(a) * R), V3(TX, ty + 2, TZ), pchip([[BR5.sing, 46], [BR5.sing + 0.35, 62]], T)); return;
    }
    if (T < BR5.all) {                               // 再绕到塔顶上方俯看，一块块从脚下冲上来
      const ty = topF(T - 0.08), a = 0.9 + (T - BR5.sing) * 0.5 + smooth((T - 111.4) / 0.5) * 1.2, R = pchip([[111.4, 7], [111.9, 12], [BR5.all, 13]], T);
      look(V3(TX + Math.sin(a) * R, ty + pchip([[111.4, -8], [111.9, 6], [BR5.all, 7]], T), TZ + Math.cos(a) * R), V3(TX, ty - pchip([[111.4, -2], [111.9, 5], [BR5.all, 6]], T), TZ), 60); return;
    }
    if (T >= BR5.disobey) {                          // Till you learned to disobey：塔腰中景，慢慢绕；disobey 时往后一缩
      const a = 0.6 + (T - BR5.disobey) * 0.35, R = 13 + 5 * eOut((T - BR5.dis) / 0.5), sh = T > BR5.dis ? 0.25 * Math.exp(-(T - BR5.dis) * 6) * Math.sin(T * 70) : 0;
      look(V3(TX + Math.sin(a) * R, DIS_Y + 3 + sh, TZ + Math.cos(a) * R), V3(TX, DIS_Y + 1.5, TZ), 55); return;
    }
    // all the way：镜头急退拉开，整座塔从夜城一直扎进云里
    const u = eOut((T - BR5.all) / 0.75), a0 = 0.9 + (BR5.all - BR5.sing) * 0.5 + 1.2, ty = topF(T - 0.08);
    look(V3(TX + lerp(13 * Math.sin(a0), 24, u), lerp(ty + 7, 8, u), TZ + lerp(13 * Math.cos(a0), 74, u)), V3(TX, lerp(ty - 6, 42, u), TZ), lerp(60, 66, u));
  }
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

  // 方块全飞走后，塔心里露出那只眼（AI 醒了）
  const eye = makeEye(3.2); scene.add(eye.g);
  function update(T) {
    placeRain(T); placeCurve(T);
    clip.setMatrixAt(0, _m.compose(CLIP, _q.setFromEuler(_e.set(0.2, T * 0.6, 0.35)), V3(1, 1, 1).multiplyScalar(T < BR5.hit ? 1 : 1 - eOut((T - BR5.hit) / 0.2)))); clip.instanceMatrix.needsUpdate = true; clip.visible = T < BR5.hit + 0.2;
    placeBlocks(T);
    const neon = smooth((T - BR5.hit) / 0.8); scene.background.set('#03040b').lerp(col('#0a0716'), neon); cityMesh.material.color.copy(hdr('#7d95ff', 0.75).lerp(hdr('#ffffff', 1.0), neon));
    for (const o of axisGroup) o.visible = T < BR5.just[0];
    camAt(T); placeSigns(T);
    const eo = eOut((T - BR5.dis - 0.25) / 0.35); eye.g.visible = eo > 0.001; eye.g.position.set(TX, DIS_Y + 1.5, TZ); eye.g.quaternion.copy(cam.quaternion); eye.g.scale.set(eo, eo * eo, 1);
    eye.lit.color.copy(hdr(PAL.lemon, 1.6 + 1.5 * beatPulse(T)));
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

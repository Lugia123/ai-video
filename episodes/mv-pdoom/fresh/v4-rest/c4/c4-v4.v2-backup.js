// shots/c4-v4.js — 副歌 4 + 尾声 v4（歌曲时间 123.868–156.65 s，全片结尾）。#1052
// 分镜：fresh/v4-rest/c4/plan.md（第二版，用户通过）。剧情和舞台分开，强拍上直接切。
//
//   const shots = await makeC4V4(mv);   mv.mount(shots, { offset: C4.t0, duration: C4.end - C4.t0 });
//
//   123.87  A   剧情：那台裂了的 P(DOOM) 秤重新亮起；全城的窗三拍睁成柠黄的眼，指针被顶到头 1.00。她（3D 背影）一缩、退一步
//   125.69  S1  舞台·大全景：C 位唱 + 12 个镭射伴舞 + 大屏 2D 唱歌特写
//   127.50  S2  舞台·C 位中景
//   129.32  S3  舞台·推近大屏（推到铺满 = 干净的 2D 特写）
//   131.14  S4  舞台·高机位大全景：全场最满（「哇」点）
//   132.96  S5  舞台·大屏特写：We'll never know，know 闭眼长音
//   134.78  B   剧情：回到那台秤。城里的眼从左到右一片片闭上，秤也暗下去
//   137.05  S6  舞台·2D 特写：Was it all for show? 138.41 鼓停那一小节，身后的灯全灭，只剩一束顶光
//   140.69  H1  剧情·尾声：全片第一个画面——走廊从近到远通电，尽头的眼亮起；她站在眼前，面朝它倒滑着退出来，每声 oh 眼吐一圈光
//   145.69  S7  舞台：全员齐舞（大全景 → 147.50 C 位中景）
//   149.32  H2  剧情：走廊贴地机位，灯从眼那头一圈一拍地熄，追着她；152.5 她转身
//   152.96  H3  终帧：鼓停。2D 近景，她朝我们眨一下眼（153.7）；身后尽头那一点柠黄 155.0 也眨一下。停到 156.65
//
// 所有 update 都是歌曲时间 T 的纯函数。
// 共用件：kits/doom-scale.js（全片唯一那台秤，副歌 3 #1047 做的；这里接它崩开之后的状态：裂到底、缺一角、销子断了）、
//         kits/stage.js（全片同一座演唱会舞台，#1051）。S6 的 2D 特写是这里自己画的（唱歌那套关键画 + 一束顶光）：
//         舞台的 blackout 会把大屏一起灭掉，铺满大屏的特写没法用。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { mulberry32 } from '../kits/world.js';
import { createGirl, createGirlLights, loadAnims } from '../kits/girl.js';
import { createDoomScale } from '../kits/doom-scale.js';
import { createDoomReadout } from '../kits/doom-readout.js';
import { createStage } from '../kits/stage.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIO = p => { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2; };
const col = c => new THREE.Color(c);
const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k);
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const D2R = Math.PI / 180;
const FONT = '"UIAnton", "Anton", Impact, sans-serif';

// ================================================================ 时间表（歌曲秒）。B[i] = 这一段的第 i 个强拍
const B = [123.868, 125.686, 127.504, 129.322, 131.140, 132.958, 134.776, 136.594, 138.412, 140.230, 142.049, 143.867, 145.685, 147.503, 149.321, 151.139, 152.957, 154.775];
const BEAT = 0.4545;
export const C4 = {
  t0: B[0], end: 156.65,
  // A：三拍睁眼（I'm / upping / my）→ P(doom) 顶死
  wake: 124.10, eyes: [124.52, 124.78, 125.20], peg: 125.40,
  storyB: B[6], closeFrom: 134.95, closeTo: 136.55, signOff: 136.85,
  s6: B[7] + BEAT, blackout: B[8],
  // 「show?」拖到 140.55：等她唱完、合上嘴看一眼镜头再切（140.685，下一拍）
  hall: B[9] + BEAT, eyeOn: B[9] + BEAT + 0.03, slide: B[10], stage7: B[12], hall2: B[14], turn: 152.30, last: B[16], wink: 153.70, dotBlink: 155.0,
  // 尾声 oh 的人声起点（audio.json 自动检测；实现后用耳朵对过再调）
  ohs: [140.71, 141.18, 141.62, 142.32, 142.78, 143.18, 143.43, 143.65, 143.88, 144.37, 144.82, 145.51, 145.96, 146.44, 146.83, 147.05, 147.26, 147.49, 150.28, 151.18, 152.09, 152.55],
};
export const ANIMS = ['act__terrified', 'act__look-around', 'dance__back-slide'];   // 舞台用的片段由 kits/stage.js 自己加载

// ================================================================ 2D 关键画：整张图抠白底（同 v4-01-final）
const FINAL_DIR = new URL('../../cast-cyber-girl/closeup/final/', import.meta.url);
const SING_DIR = new URL('../../cast-cyber-girl/closeup/sing/', import.meta.url);
async function keyed(name, dir) {
  const img = new Image(); img.src = new URL(`${name}.png`, dir).href; await img.decode();
  const w = img.width, h = img.height, cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const g = cv.getContext('2d'); g.drawImage(img, 0, 0);
  const id = g.getImageData(0, 0, w, h), d = id.data, bg = new Uint8Array(w * h), st = [];
  const isBg = i => { const r = d[i * 4], gg = d[i * 4 + 1], b = d[i * 4 + 2]; return Math.min(r, gg, b) > 222 && Math.max(r, gg, b) - Math.min(r, gg, b) < 26; };
  for (let x = 0; x < w; x++) st.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) st.push(y * w, y * w + w - 1);
  while (st.length) { const i = st.pop(); if (bg[i] || !isBg(i)) continue; bg[i] = 1; const x = i % w, y = (i / w) | 0; if (x > 0) st.push(i - 1); if (x < w - 1) st.push(i + 1); if (y > 0) st.push(i - w); if (y < h - 1) st.push(i + w); }
  for (let i = 0; i < w * h; i++) {
    if (bg[i]) { d[i * 4 + 3] = 0; continue; }
    const x = i % w; let n = 0;
    for (const j of [i - 1, i + 1, i - w, i + w]) if (j >= 0 && j < w * h && Math.abs((j % w) - x) <= 1 && bg[j]) n++;
    if (n) d[i * 4 + 3] = 255 - n * 40;
  }
  g.putImageData(id, 0, 0);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  return tex;
}
// 2D 纸片：粉色描边光（同 v4-01-final 的 plate）；uGain 整体亮度
function makePlate(tex) {
  const U = { map: { value: tex }, uRim: { value: 1 }, uPink: { value: col(PAL.pink) }, uGain: { value: 1 } };
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.832, 1.248), new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, depthTest: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform sampler2D map; uniform float uRim, uGain; uniform vec3 uPink; varying vec2 vUv;
      void main(){
        vec4 t = texture2D(map, vUv); float e = 0.0; vec2 d = vec2(0.012, 0.008);
        e += 1.0 - texture2D(map, vUv + vec2(d.x, 0.0)).a; e += 1.0 - texture2D(map, vUv - vec2(d.x, 0.0)).a;
        e += 1.0 - texture2D(map, vUv + vec2(0.0, d.y)).a; e += 1.0 - texture2D(map, vUv - vec2(0.0, d.y)).a;
        gl_FragColor = vec4((t.rgb * mix(vec3(1.0), vec3(1.0, 0.93, 0.95), 0.5)) * uGain + uPink * clamp(e * 0.5, 0.0, 1.0) * uRim * 1.6, t.a);
      }` }));
  mesh.renderOrder = 30;
  return { mesh, U };
}

// ================================================================ 霓虹招牌（跑酷段那种：墨底 + 灯管边 + 白字），一词一块，排成几行
function makeWordPlate(text, color, th) {
  const c = document.createElement('canvas'), g0 = c.getContext('2d'); g0.font = `170px ${FONT}`;
  c.width = Math.ceil(g0.measureText(text).width) + 110; c.height = 270; const g = c.getContext('2d');
  g.fillStyle = '#0d0c14'; g.fillRect(0, 0, c.width, c.height); g.strokeStyle = color; g.lineWidth = 16; g.strokeRect(8, 8, c.width - 16, c.height - 16);
  g.fillStyle = '#F2EDE4'; g.font = `170px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, c.width / 2, 143);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const bh = th * 270 / 160, bw = bh * c.width / c.height;          // 字高 ≈ th
  const mat = new THREE.MeshBasicMaterial({ map: tex, fog: false });
  return { m: new THREE.Mesh(new THREE.PlaneGeometry(bw, bh), mat), mat, bw, bh, at: Infinity };
}
// rows = [[ [词, 亮起时刻], … ], …] → { g, set(T, { off }) }：没唱到 = 暗灯管，唱到 = 亮；off 之后整块熄
function makeSign(rows, color, th) {
  const g = new THREE.Group(), plates = [], gap = th * 0.22;
  rows.forEach((row, ri) => {
    const ps = row.map(([t, at]) => { const p = makeWordPlate(t, color, th); p.at = at; return p; });
    const total = ps.reduce((a, p) => a + p.bw, 0) + gap * (ps.length - 1); let x = -total / 2;
    for (const p of ps) { p.m.position.set(x + p.bw / 2, -ri * (ps[0].bh + gap), 0); x += p.bw + gap; g.add(p.m); plates.push(p); }
  });
  return { g, plates, set(T, { off = Infinity, dim = 0.22 } = {}) {
    const k = T >= off ? Math.exp(-(T - off) / 0.12) * (Math.sin(T * 70) > -0.3 ? 1 : 0.3) : 1;
    for (const p of plates) { const a = T - p.at; p.mat.color.setScalar((a >= 0 ? 1.15 + 1.6 * Math.exp(-a / 0.3) : dim) * k); p.m.scale.setScalar(a >= 0 ? lerp(0.9, 1, eOut(a / 0.1)) : 0.9); }
  } };
}

// ================================================================ 夜城：楼块；窗是暗的（桥段 115.2 把全城的灯抽空了，uWarm = 残留的一点亮），
//   可以睁成柠黄的眼（uEyeR：从秤往外扩的一圈）、再从左到右闭上（uCloseX）。y = 0 是街面；clear(x, z) 为真的地方不放楼
function createEyeCity({ seed = 52, center = V3(), clear = () => false } = {}) {
  const rnd = mulberry32(seed), items = [];
  for (let ix = -9; ix <= 9; ix++) for (let iz = -12; iz <= 0; iz++) {
    const x = ix * 9 + (rnd() - 0.5) * 3, z = -14 + iz * 9.5 + (rnd() - 0.5) * 3;
    const skip = rnd() < 0.14, w = 4.4 + rnd() * 3.3, d = 4.4 + rnd() * 3.3, far = clamp(-z / 110);
    const top = 5 + rnd() * rnd() * 24 + far * 10 + (Math.abs(x) > 26 ? rnd() * 10 : 0);   // 楼顶高度（街面 = 0）
    const sd = rnd();
    if (skip || clear(x, z)) continue;
    items.push({ x, z, w, d, y0: -2, y1: top, seed: sd });
  }
  const n = items.length, geo = new THREE.BoxGeometry(1, 1, 1);
  const aSize = new Float32Array(n * 3), aSeed = new Float32Array(n);
  const U = { uEyeR: { value: 0 }, uCloseX: { value: -1e4 }, uDim: { value: 1 }, uWarm: { value: 0.08 }, uFog: { value: col('#06060b') }, uC: { value: center.clone() }, uLemon: { value: col(PAL.lemon) }, uRed: { value: 0 } };
  const mat = new THREE.ShaderMaterial({
    uniforms: U,
    vertexShader: /* glsl */`
      attribute vec3 aSize; attribute float aSeed; varying vec3 vL, vN, vW, vSize; varying float vSeed, vDist;
      void main(){ vL = position * aSize; vN = normal; vSize = aSize; vSeed = aSeed;
        vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0); vW = w.xyz; vec4 mvp = viewMatrix * w; vDist = -mvp.z; gl_Position = projectionMatrix * mvp; }`,
    fragmentShader: /* glsl */`
      uniform float uEyeR, uCloseX, uDim, uRed, uWarm; uniform vec3 uFog, uC, uLemon; varying vec3 vL, vN, vW, vSize; varying float vSeed, vDist;
      float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
      void main(){
        vec3 base = vec3(0.050, 0.053, 0.105), c = base * (0.7 + 0.3 * step(0.5, abs(vN.x)));
        if (abs(vN.y) < 0.5) {
          bool sx = abs(vN.x) > 0.5; float u = sx ? vL.z : vL.x, fw = sx ? vSize.z : vSize.x;
          vec2 cs = vec2(1.1, 1.0), q = vec2(u + fw * 0.5, vL.y + vSize.y * 0.5) / cs; float nx = floor(fw / cs.x);
          q.x -= (fw / cs.x - nx) * 0.5;                                  // 窗列在这面墙上居中
          vec2 id = floor(q), f = fract(q), p = (f - 0.5) * 2.0;
          float valid = step(0.0, id.x) * step(id.x, nx - 0.5) * step(vL.y + vSize.y * 0.5, vSize.y - 0.8);
          float r1 = h21(id + vSeed * 91.0 + (sx ? 17.0 : 0.0)), r2 = fract(r1 * 7.31);
          float lit = step(r1, 0.62), win = step(abs(p.x), 0.56) * step(abs(p.y), 0.5);
          vec3 warm = mix(vec3(1.0, 0.91, 0.72), vec3(1.0, 0.80, 0.9), step(0.86, r2));
          vec3 wc = warm * win * (lit * 0.85 * uWarm + 0.012);
          float d = length(vW.xz - uC.xz);
          float e = smoothstep(0.0, 5.0, uEyeR - d - r2 * 9.0) * step(r1, 0.9);       // 这一格变成眼
          float cl = smoothstep(0.0, 9.0, uCloseX - vW.x - r2 * 14.0);               // 闭上
          float open = mix(1.0, 0.06, cl);
          float r = length(p * vec2(1.0, 1.18));
          float lid = step(abs(p.y), open * 0.8 * sqrt(max(0.0, 1.0 - p.x * p.x * 1.05)));
          float rings = smoothstep(0.30, 0.18, r) * 1.2 + smoothstep(0.085, 0.0, abs(r - 0.52)) + smoothstep(0.075, 0.0, abs(r - 0.82)) * 0.8;
          vec3 ec = uLemon * (rings * 2.3 + 0.10) * lid * mix(1.0, 0.16, cl) + vec3(0.02, 0.018, 0.0) * (1.0 - lid) * step(r, 1.0);
          c += mix(wc, ec, e) * valid * uDim;
        }
        c += vec3(0.5, 0.03, 0.08) * uRed * 0.12;
        c = mix(c, uFog, smoothstep(40.0, 190.0, vDist));
        gl_FragColor = vec4(c, 1.0);
      }` });
  const mesh = new THREE.InstancedMesh(geo, mat, n); mesh.frustumCulled = false;
  const m4 = new THREE.Matrix4();
  items.forEach((b, i) => { const h = b.y1 - b.y0; m4.compose(V3(b.x, b.y0 + h / 2, b.z), new THREE.Quaternion(), V3(b.w, h, b.d)); mesh.setMatrixAt(i, m4); aSize.set([b.w, h, b.d], i * 3); aSeed[i] = b.seed; });
  geo.setAttribute('aSize', new THREE.InstancedBufferAttribute(aSize, 3)); geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(aSeed, 1));
  return { mesh, U, items };
}

// ================================================================ 走廊（照 v4-01-final.js 的 buildHall 和镜片着色器抄的：同一条走廊、同一只眼）
function makeLensMaterial(U) {
  return new THREE.ShaderMaterial({
    uniforms: U,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform vec3 uRing, uLemon; uniform float uCore; varying vec2 vUv;
      void main(){
        vec2 p = vUv * 2.0 - 1.0; float r = length(p), a = atan(p.y, p.x); vec3 c;
        if (r > 0.8) { float br = 0.085 + 0.07 * cos(a - 2.2) + 0.014 * sin(a * 90.0); c = vec3(br) * vec3(0.92, 0.94, 1.0) * smoothstep(1.0, 0.97, r) * (0.75 + 0.25 * smoothstep(0.8, 0.86, r)); }
        else {
          vec2 q = p / 0.8; float rq = length(q);
          c = vec3(0.012, 0.01, 0.016) + vec3(0.03) * (1.0 - rq);
          float r1 = exp(-pow((rq - 0.78) / 0.02, 2.0)), r2 = exp(-pow((rq - 0.55) / 0.018, 2.0)), r3 = exp(-pow((rq - 0.34) / 0.016, 2.0));
          c += vec3(0.12) * (r1 + r2 + r3);
          c += uLemon * (r1 * uRing.x + r2 * uRing.y + r3 * uRing.z) * 2.2;
          float core = smoothstep(0.2, 0.0, rq);
          c += uLemon * (core * 3.4 + exp(-rq * 5.0) * 0.9) * uCore;
          c += vec3(1.0, 0.55, 0.2) * smoothstep(0.07, 0.0, rq) * uCore * 2.0;
          vec2 h1 = q - vec2(-0.32, 0.42); float hl = smoothstep(0.2, 0.0, length(h1 * vec2(1.0, 2.2)));
          c += vec3(1.0, 0.92, 0.96) * hl * 0.55;
        }
        gl_FragColor = vec4(c, 1.0);
      }` });
}
function aoTex(base, k = 0.3, { stripe = false } = {}) {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0, 0, 256, 256);
  const edge = (x0, y0, x1, y1) => { const gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, `rgba(0,0,6,${k})`); gr.addColorStop(1, 'rgba(0,0,6,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); };
  edge(0, 0, 0, 60); edge(0, 256, 0, 196); edge(0, 0, 50, 0); edge(256, 0, 206, 0);
  if (stripe) { g.fillStyle = 'rgba(95,227,192,0.30)'; for (let y = 32; y < 256; y += 64) g.fillRect(0, y, 256, 2); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function buildHall({ HW = 2.0, HH = 3.0, BAY = 2.4, NB = 10, lensMat, flareTex }) {
  const scene = new THREE.Scene(); scene.background = col('#06060b');
  const LEN = BAY * NB;
  const wallM = new THREE.MeshLambertMaterial({ map: aoTex('#2b2d4a', 0.45, { stripe: true }), side: THREE.DoubleSide });
  const ceilM = new THREE.MeshLambertMaterial({ map: aoTex('#1f2038', 0.5), side: THREE.DoubleSide });
  const ribM = new THREE.MeshLambertMaterial({ color: col('#34365a'), side: THREE.DoubleSide });
  const floorM = new THREE.MeshLambertMaterial({ map: aoTex('#24263f', 0.35), transparent: true, opacity: 0.8, depthWrite: true, side: THREE.DoubleSide });
  const hall = new THREE.Group(); scene.add(hall);
  const amb = new THREE.AmbientLight('#c8ccff', 0.55); scene.add(amb);
  const bays = [];
  const addBay = (z0, len, lit) => {
    const zc = z0 - len / 2;
    const wl = new THREE.Mesh(new THREE.PlaneGeometry(len, HH), wallM); wl.position.set(-HW, HH / 2, zc); wl.rotation.y = Math.PI / 2; hall.add(wl);
    const wr = wl.clone(); wr.position.x = HW; wr.rotation.y = -Math.PI / 2; hall.add(wr);
    const cl = new THREE.Mesh(new THREE.PlaneGeometry(HW * 2, len), ceilM); cl.position.set(0, HH, zc); cl.rotation.x = Math.PI / 2; hall.add(cl);
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(HW * 2, len), floorM); fl.position.set(0, 0, zc); fl.rotation.x = -Math.PI / 2; fl.renderOrder = 2; scene.add(fl);
    if (!lit) return;
    const seamM = new THREE.MeshBasicMaterial({ color: hdr(PAL.mint, 0.16) });                         // 每一圈肋框自己的薄荷线（熄灯时一圈圈灭）
    const rib = new THREE.Group(); rib.position.z = z0 - 0.02; hall.add(rib);
    const rb = (w, h, x, y, m = ribM, d = 0.18) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, 0); rib.add(o); };
    rb(HW * 2, 0.22, 0, HH - 0.11); rb(0.22, HH, -HW + 0.11, HH / 2); rb(0.22, HH, HW - 0.11, HH / 2);
    rb(HW * 2 - 0.44, 0.008, 0, HH - 0.226, seamM, 0.2); rb(0.008, HH - 0.22, -HW + 0.226, HH / 2 - 0.11, seamM, 0.2); rb(0.008, HH - 0.22, HW - 0.226, HH / 2 - 0.11, seamM, 0.2);
    const lampM = new THREE.MeshBasicMaterial({ color: col('#1c1924') }), stripM = new THREE.MeshBasicMaterial({ color: col('#1c1924') });
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, len * 0.74), lampM); lamp.position.set(0, HH - 0.04, zc); hall.add(lamp);
    for (const s of [-1, 1]) { const st = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, len * 0.9), stripM); st.position.set(s * (HW - 0.06), 0.05, zc); hall.add(st); }
    const pl = new THREE.PointLight(col('#ff6fb0'), 0, HW * 3, 1.8); pl.position.set(0, HH - 0.5, zc); scene.add(pl);
    bays.push({ i: bays.length, zc, lampM, stripM, seamM, pl });
  };
  for (let i = 0; i < NB; i++) addBay(-i * BAY, BAY, true);
  addBay(2.4, 2.4, false);
  const ew = new THREE.Mesh(new THREE.PlaneGeometry(HW * 2, HH), wallM); ew.position.set(0, HH / 2, 2.4); ew.rotation.y = Math.PI; hall.add(ew);
  const endWall = new THREE.Mesh(new THREE.PlaneGeometry(HW * 2, HH), wallM); endWall.position.set(0, HH / 2, -LEN); hall.add(endWall);
  const panel = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.5, 0.08), ribM); panel.position.set(0, 1.6, -LEN + 0.04); hall.add(panel);
  const eyePos = V3(0, 1.72, -LEN + 0.1);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.26, 96), lensMat); lens.position.copy(eyePos); hall.add(lens);
  const tubeM = new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 0.2) });
  const tube = new THREE.Mesh(new THREE.TorusGeometry(0.285, 0.008, 10, 96), tubeM); tube.position.copy(eyePos); hall.add(tube);
  const eyeLight = new THREE.PointLight(col(PAL.lemon), 0, 3.5, 2); eyeLight.position.copy(eyePos).add(V3(0, 0, 0.6)); scene.add(eyeLight);
  const flare = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), new THREE.MeshBasicMaterial({ map: flareTex, color: col(PAL.lemon), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  flare.position.copy(eyePos).add(V3(0, 0, 0.03)); hall.add(flare);
  const mirror = hall.clone(); mirror.scale.y = -1; scene.add(mirror);                                          // 地面反射
  return { scene, hall, bays, amb, eyePos, eyeLight, flare, lens, tubeM, LEN, HW, HH };
}

// ================================================================
export async function makeC4V4(mv, { dancers = 12, stage: withStage = true } = {}) {
  const { music, lyrics } = mv;
  await loadAnims(ANIMS);
  await new FontFace('UIAnton', `url(${new URL('../../../assets/fonts/anton/Anton-Regular.ttf', import.meta.url)})`).load().then(f => document.fonts.add(f));
  const girl = await createGirl(mv);
  const kick = (T, d = 0.12) => music.pulse('kick', T, { decay: d });
  const line = p => lyrics.lines.find(l => l.start > 120 && l.text.toLowerCase().startsWith(p.toLowerCase()));
  const L = { up: line("I'm upping"), ilya: line('What did'), show: line('Was it') };
  const wt = (ln, i) => ln.words[i].start;
  const shots = [];
  const shot = (id, t0, t1, fn) => shots.push({ id, t0, t1, transitionIn: { kind: 'cut' }, build: () => ({}), update: (S, T) => fn(T) });
  const cutFlash = (T, t0, k = 0.3) => k * Math.exp(-(T - t0) / 0.07);      // 剪辑点上轻轻一闪

  // ================================================================ 剧情：夜城 + 秤
  const city = new THREE.Scene(); city.background = col('#06060b');
  // 布局（y = 0 是街面，她的身高 = 1）：她站在塌掉的路沿上（桥段把路砸出一个显卡坑）；坑对面一栋矮楼的楼顶上是那台秤
  const PIT = { z0: -1.6, z1: -19.5, hw: 34, depth: 3.0 };                 // 坑：近沿（她脚边）/ 远沿 / 半宽 / 深
  const scale = await createDoomScale();
  const SC = V3(-1.6, 1.0, -26);                                           // 秤座底面 = 矮楼楼顶
  scale.group.position.copy(SC); city.add(scale.group); city.updateMatrixWorld(true);
  const dialC = scale.dialCenter(V3());
  const ec = createEyeCity({ center: dialC, clear: (x, z) => (z > PIT.z1 - 6 && Math.abs(x) < PIT.hw + 5) || (Math.abs(x - SC.x) < 10 && z > SC.z - 9) }); city.add(ec.mesh);
  const readout = await createDoomReadout({ height: 4.6 });                // 秤旁的大读数牌：数字字高 ≈ 2.0，仰拍机位里约画高 8.5%
  readout.group.position.set(9.6, 10.4, -23.5); readout.group.rotation.y = -0.22; readout.setPole(0); city.add(readout.group);
  const leds = [];                                                         // 坑底 / 坑壁的显卡 LED（一卡一灯）
  { const dark = new THREE.MeshStandardMaterial({ color: '#15162c', roughness: 0.9 }), pitM = new THREE.MeshStandardMaterial({ color: '#0b0b16', roughness: 1 });
    const box = (w, h, d, x, y, z, m = dark) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); city.add(o); return o; };
    box(160, 2, 30, 0, -1, PIT.z0 + 15);                                   // 她这边的路面
    box(160, 2, 260, 0, -1, PIT.z1 - 130);                                 // 坑对面的地面
    for (const sx of [-1, 1]) box(60, 2, PIT.z0 - PIT.z1, sx * (PIT.hw + 30), -1, (PIT.z0 + PIT.z1) / 2);
    box(2 * PIT.hw, 0.2, PIT.z0 - PIT.z1, 0, -PIT.depth - 0.1, (PIT.z0 + PIT.z1) / 2, pitM);   // 坑底
    box(12, 30, 12, SC.x, SC.y - 15, SC.z);                                // 秤脚下的矮楼
    const rnd = mulberry32(118);
    for (let k = 0; k < 9; k++) { const o = box(1.2 + rnd() * 2.2, 0.5, 0.8 + rnd() * 1.2, -13 + k * 3.3 + rnd() * 1.5, -0.2 - rnd() * 0.3, PIT.z0 - 0.3 - rnd() * 0.5); o.rotation.set((rnd() - 0.5) * 0.5, rnd(), 0.25 + rnd() * 0.4); }   // 路沿塌下去的碎块
    const tube = (c, w, x, y, z, ry = 0) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, 0.06, 0.06), new THREE.MeshBasicMaterial({ color: hdr(c, 2.2), fog: false })); o.position.set(x, y, z); o.rotation.y = ry; city.add(o); };
    tube(PAL.pink, 15.6, -2.6, 0.03, PIT.z0 + 7.8, Math.PI / 2); tube(PAL.mint, 15.6, 5.2, 0.03, PIT.z0 + 7.8, Math.PI / 2);   // 路上的两条霓虹线，到断口为止（跑酷段那条路）
    // 显卡：坑底一排排平躺的卡 + 远壁上竖插的几排；每张卡一颗 LED
    const cards = [], NX = 40, NZ = 16;
    for (let iz = 0; iz < NZ; iz++) for (let ix = 0; ix < NX; ix++) cards.push({ x: (ix - (NX - 1) / 2) * 1.7, y: -PIT.depth + 0.1, z: PIT.z1 + 0.9 + iz * 1.05, wall: false });
    for (let iy = 0; iy < 4; iy++) for (let ix = 0; ix < NX; ix++) cards.push({ x: (ix - (NX - 1) / 2) * 1.7, y: -PIT.depth + 0.45 + iy * 0.7, z: PIT.z1 + 0.12, wall: true });
    const cardM = new THREE.InstancedMesh(new THREE.BoxGeometry(1.35, 0.14, 0.55), new THREE.MeshStandardMaterial({ color: '#23243c', roughness: 0.6, metalness: 0.3 }), cards.length);
    const ledM = new THREE.InstancedMesh(new THREE.BoxGeometry(0.2, 0.09, 0.13), new THREE.MeshBasicMaterial({ color: '#ffffff', fog: false }), cards.length);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), qw = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
    cards.forEach((c, i) => { m4.compose(V3(c.x, c.y, c.z), c.wall ? qw : q, V3(1, 1, 1)); cardM.setMatrixAt(i, m4);
      m4.compose(V3(c.x + 0.45, c.y + (c.wall ? 0 : 0.1), c.z + (c.wall ? 0.1 : 0.2)), q, V3(1, 1, 1)); ledM.setMatrixAt(i, m4);
      const h = rnd(); leds.push({ base: col(h < 0.7 ? PAL.mint : h < 0.9 ? PAL.lemon : PAL.pink), d: Math.hypot(c.x - 2, c.z + 10), ph: rnd() }); });
    cardM.frustumCulled = ledM.frustumCulled = false; city.add(cardM, ledM); leds.mesh = ledM;
    const sr = mulberry32(77), n = 800, p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const a = -Math.PI * sr(), e = Math.asin(0.06 + sr() * 0.9), r = 400; p.set([Math.cos(a) * Math.cos(e) * r, Math.sin(e) * r - 20, Math.sin(a) * Math.cos(e) * r], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    city.add(new THREE.Points(g, new THREE.PointsMaterial({ color: col(PAL.paper).multiplyScalar(1.4), size: 1.6, sizeAttenuation: false })));
  }
  const pitGlow = new THREE.PointLight(col(PAL.mint), 0, 30, 1.4); pitGlow.position.set(1, -1.2, -9); city.add(pitGlow);
  const _c = new THREE.Color();
  function ledsAt(T, level) {                                              // LED 一圈圈往外的光波（桥段 100 000 GPU 留下的），level = 整体亮度
    leds.forEach((L, i) => { const w = 0.5 + 0.5 * Math.sin(L.d * 0.55 - T * 7.5 + L.ph * 0.6); leds.mesh.setColorAt(i, _c.copy(L.base).multiplyScalar(level * (0.5 + 2.2 * w * w))); });
    leds.mesh.instanceColor.needsUpdate = true; pitGlow.intensity = 9 * level;
  }
  const moonM = new THREE.MeshBasicMaterial({ color: hdr(PAL.pink, 1.25) });
  const moon = new THREE.Mesh(new THREE.CircleGeometry(15, 64), moonM); moon.position.set(-95, 62, -210); moon.lookAt(0, 0, 0); city.add(moon);
  const cityHemi = new THREE.HemisphereLight('#6f78e6', '#221848', 0.5); city.add(cityHemi);
  const cityGL = createGirlLights({ key: 1.6, rim: 2.4, fill: 0.7 }); city.add(cityGL);
  const cityLights = cityGL.children.filter(l => l.isLight).map(l => ({ l, base: l.intensity }));
  const redLight = new THREE.PointLight('#ff2e4a', 0, 60, 1.2); redLight.position.copy(dialC).add(V3(0, -3, 7)); city.add(redLight);
  const U = L.up.words.map(w => w.start);                                 // I'm / upping / my / P(doom)
  const signUp = makeSign([[["I'M", U[0]], ['UPPING', U[1]]], [['MY', U[2]], ['P(DOOM)', U[3]]]], PAL.pink, 1.45);
  signUp.g.position.set(-14.5, 8.2, -24); signUp.g.rotation.y = 0.32; city.add(signUp.g);          // 坑对面左边一栋楼顶上的招牌
  const K = L.ilya.words.map(w => w.start);                               // What did Ilya see? We'll never know
  const signKnow = makeSign([[["WE'LL", K[4]], ['NEVER', K[5]]], [['KNOW', K[6]]]], PAL.mint, 1.45);
  signKnow.g.position.copy(signUp.g.position); signKnow.g.rotation.y = 0.32; city.add(signKnow.g);
  const cam = new THREE.PerspectiveCamera(38, mv.width / mv.height, 0.05, 1200);
  const HER = V3(2.0, 0, 0.3);
  const FLINCH = [{ t: C4.peg - 0.85, anim: 'act__terrified' }]; FLINCH.fade = 0.01;
  const WATCH = [{ t: C4.storyB - 2.2, anim: 'act__look-around', rate: 0.6 }];
  const shake = (T, t, a) => { const k = T - t; return k > 0 ? a * Math.exp(-k * 9) * Math.sin(k * 55) : 0; };
  function needle(T) {                                                    // 灭着躺在 0 → 三拍被顶上去 → 顶死在 1.00（撞一下、回弹、一直抖）
    const keys = [[C4.eyes[0], 0.58], [C4.eyes[1], 0.80], [C4.eyes[2], 0.94], [C4.peg, 1.0]]; let v = 0, prev = 0, t = -1e9;
    for (const [tk, vk] of keys) if (T >= tk) { prev = v; v = vk; t = tk; }
    const a = T - t, jump = v + (prev - v) * Math.exp(-a * 20) * Math.cos(a * 30);
    return T >= C4.peg ? Math.min(1.0, jump) : Math.min(0.985, jump);          // 1.00 = 顶死（读数窗只到两位小数，不让它抖出 0.99 / 1.01）
  }
  function storyCity(T, part) {
    const A = part === 'A';
    const lit = A ? smooth((T - C4.wake) / 0.35) * (T < C4.wake + 0.5 && Math.sin(T * 60) > 0.2 ? 0.55 : 1) : lerp(1, 0.1, smooth((T - C4.closeFrom - 0.6) / (C4.closeTo - C4.closeFrom)));
    const pinned = A ? smooth((T - C4.peg) / 0.12) : lerp(1, 0.25, smooth((T - C4.closeFrom) / 1.6));
    const pop = C4.eyes.reduce((s, t) => s + (T >= t ? Math.exp(-(T - t) / 0.1) : 0), 0);
    scale.update(T, { value: A ? needle(T) : 1.0, lit, cracked: 1, err: false, pile: 0.3, glow: clamp(pinned * (0.6 + 0.4 * Math.sin(T * 26)) + 0.5 * pop) });
    scale.fragment.visible = false;                                       // 缺的那一角在副歌 3 已经掉下去了
    const step = A ? [[C4.eyes[0], 0.58], [C4.eyes[1], 0.80], [C4.eyes[2], 0.94], [C4.peg, 1]].reduce((v, [t, x]) => (T >= t ? x : v), 0) : 1;   // 大牌只显示每一跳落定的数（指针的回弹不带进数字）
    readout.update(T, { text: step.toFixed(2), lit, alarm: pinned });
    ec.U.uEyeR.value = A ? [0, 34, 70, 260].reduce((r, R, i) => i === 0 ? 0 : (T >= C4.eyes[i - 1] ? lerp(r, R, eOut((T - C4.eyes[i - 1]) / 0.22)) : r), 0) : 1e4;
    ec.U.uCloseX.value = A ? -1e4 : lerp(-130, 150, clamp((T - C4.closeFrom) / (C4.closeTo - C4.closeFrom)));
    ec.U.uDim.value = A ? 1 : lerp(1, 0.55, smooth((T - C4.closeTo) / 0.5));
    ledsAt(T, A ? 1 : lerp(1, 0.12, smooth((T - C4.closeFrom) / (C4.closeTo - C4.closeFrom + 0.4))));
    ec.U.uRed.value = pinned * (A ? 1 : lit);
    redLight.intensity = 55 * pinned * lit;
    moonM.color.copy(hdr(PAL.pink, A ? 1.25 : lerp(1.25, 0.5, smooth((T - C4.closeFrom) / 2))));
    for (const { l, base } of cityLights) l.intensity = base * (A ? 1 : lerp(1, 0.45, smooth((T - C4.closeFrom) / 1.8)));
    signUp.g.visible = A; signKnow.g.visible = !A;
    if (A) signUp.set(T); else signKnow.set(T, { off: C4.signOff });
    // 她：背对镜头看着秤
    girl.root.scale.setScalar(1); girl.root.visible = true; city.add(girl.root);
    const back = A ? 0.28 * eOut((T - C4.peg - 0.05) / 0.3) : 0.28;
    girl.root.position.set(HER.x, 0, HER.z + back); girl.root.rotation.set(0, Math.PI - 0.12, 0);
    girl.play(A ? FLINCH : WATCH, T); girl.setSkin('toon', T);
    // 机位：A 先在她身后高处带到路沿、显卡坑和对面的秤（交代她在哪），1 秒内降到她身后低机位仰看秤；B 从仰看秤慢慢升回去
    const u = A ? eIO((T - B[0] - 0.04) / 0.58) : 1 - smooth((T - C4.storyB) / 2.2);   // A：124.49 前降到位（第一拍睁眼 124.52）
    const sh = A ? shake(T, C4.peg, 0.09) + C4.eyes.reduce((a, t) => a + shake(T, t, 0.025), 0) : 0;
    cam.position.set(lerp(0.3, 0.25, u), lerp(2.2, 0.5, u) + sh, lerp(6.8, 5.0, u)); cam.up.set(0, 1, 0);
    cam.lookAt(-0.3, lerp(5.6, 7.9, u), -24); cam.fov = lerp(55, 43, u); cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
    city.updateMatrixWorld(true);
    girl.face?.update(T, { expression: 'surprised' });                    // 全程背影：不传 camera（五官层只管正脸）
    return { scene: city, camera: cam, post: { bloom: { strength: 0.8, threshold: 1.0, radius: 0.8 }, chroma: 0.05 + (A ? 0.25 * (T >= C4.peg ? Math.exp(-(T - C4.peg) * 5) : 0) + 0.08 * pop : 0),
      grade: { vignette: 0.32, tint: '#ff2e4a', tintAmount: 0.10 * pinned * lit }, flash: A && T >= C4.peg ? { amount: 0.3 * Math.exp(-(T - C4.peg) / 0.07), color: '#ff5a6e' } : 0 } };
  }
  shot('c4-scale', B[0], B[1], T => storyCity(T, 'A'));

  // ================================================================ 舞台（kits/stage.js：全片同一座）。这一段用「finale」那套变体：12 人环绕、聚光炸开、灯最满（各段各用一套，不撞）
  //   C 位唱 ↔ 跳交替：每个机位自己点 lead（'sing' 站定唱 / 'dance' 和伴舞跳同一支）
  const stage = withStage ? await createStage(mv, { dancers, girl, variant: 'finale', leadPattern: [1, 0], lyrics: [[B[1] + 0.3, C4.hall]] }) : null;
  // 两个自定义机位（3D 不拍她的脸近景；环形队形前面留着一个口子，镜头从口子里看进去不会被伴舞挡）
  //   注意：stage.update 会把函数型参数当成 T => 值 先调一次，所以自定义机位要包一层（cam: () => 机位函数）
  const camRear = u => ({ pos: [-0.75 + 0.45 * u, 2.35, -3.5], look: [0.1, 0.7, 0.45], fov: 36, led: 1 });                       // 后上方偏左：越过最后一对伴舞的头顶看她的背影（和伴舞一起跳），再往前是台口的灯带和台下的荧光棒。平视的话身边的伴舞会糊满前景
  const camArc = u => { const x = lerp(-2.6, 2.6, smooth(u)); return { pos: [x, 0.95, 4.9 - 0.12 * Math.abs(x)], look: [0, 1.0, 0.15], fov: 30, led: 1 }; };   // 横移：镜头从左到右绕着她走，她一直在画面正中，两边的伴舞划过去
  const blank = (() => { const sc = new THREE.Scene(); sc.background = col('#05040c'); return { scene: sc, camera: new THREE.PerspectiveCamera() }; })();
  const stg = (id, t0, t1, plan, rest = {}) => {
    if (!stage) return shot(id, t0, t1, () => ({ ...blank, post: {} }));
    const sh = stage.shot({ id, t0, t1, plan, dancers, ...rest }), up = sh.update.bind(sh);
    sh.update = (S, T) => { const o = up(S, T), f = cutFlash(T, t0, 0.25), a = typeof o.post.flash === 'object' ? o.post.flash.amount : (o.post.flash ?? 0); o.post = { ...o.post, flash: { amount: Math.max(a, f), color: '#ffffff' } }; return o; };   // 剪辑点上轻轻一闪
    shots.push(sh);
  };
  // 125.69 推（大全景一路推到 C 位）→ 侧后方低机位（她的背影，和伴舞一起跳）→ 推近大屏 → 131.14 升（亮出整座舞台，灯最满 = 「哇」点）→ 大屏特写（know 闭眼长音）
  stg('c4-stage', B[1], B[6], [{ cam: 'dolly', lead: 'sing' }, { cam: () => camRear, lead: 'dance' }, { cam: 'screen', lead: 'sing' }, { cam: 'crane', lead: 'dance' }, { cam: 'closeup', lead: 'sing', expression: T => (T >= K[6] ? 'closed' : 'neutral') }], { variant: 'finale' });
  shot('c4-dark', B[6], C4.s6, T => storyCity(T, 'B'));

  // ---------------------------------------------------------------- S6：2D 特写（唱歌那一套关键画），138.41 身后的灯全灭、只剩一束顶光
  const SING = Object.fromEntries(await Promise.all(['a', 'o', 'i', 'e', 'u', 'rest', 'belt'].map(async k => [k, await keyed('sing-' + k, SING_DIR)])));
  const close = new THREE.Scene(); close.background = col('#05040c');
  const closeCam = new THREE.OrthographicCamera(-16 / 9, 16 / 9, 1, -1, 0, 10); closeCam.position.z = 5;
  const washU = { uLevel: { value: 1 }, uSpot: { value: 0 }, uT: { value: 0 }, uPink: { value: col(PAL.pink) }, uMint: { value: col(PAL.mint) } };
  { const bg = new THREE.Mesh(new THREE.PlaneGeometry(32 / 9, 2), new THREE.ShaderMaterial({ uniforms: washU, depthTest: false, depthWrite: false,
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */`
        uniform float uLevel, uSpot, uT; uniform vec3 uPink, uMint; varying vec2 vUv;
        float beam(vec2 p, float x0, float ang, float w){ vec2 d = vec2(sin(ang), -cos(ang)); vec2 q = p - vec2(x0, 1.15); float along = dot(q, d); float side = abs(q.x * d.y - q.y * d.x); return smoothstep(w * (0.2 + along), 0.0, side) * smoothstep(2.6, 0.0, along) * step(0.0, along); }
        void main(){
          vec2 p = (vUv - 0.5) * vec2(3.5556, 2.0);
          vec3 c = mix(vec3(0.16, 0.07, 0.27), vec3(0.48, 0.11, 0.39), vUv.x * 0.6 + vUv.y * 0.4) * 0.8;
          c += uPink * 0.5 * (beam(p, -1.5, 0.35 + 0.08 * sin(uT * 1.6), 0.16) + beam(p, 1.5, -0.35 - 0.08 * sin(uT * 1.6 + 1.0), 0.16));
          c += uMint * 0.4 * (beam(p, -0.7, 0.16, 0.13) + beam(p, 0.7, -0.16, 0.13));
          c *= uLevel;
          c += vec3(1.0, 0.96, 0.86) * 0.42 * uSpot * beam(p, 0.0, 0.0, 0.95);
          gl_FragColor = vec4(c, 1.0);
        }` })); bg.position.z = -1; close.add(bg); }
  const sing = makePlate(SING.rest); sing.mesh.scale.setScalar(2.32); sing.mesh.position.set(0, -0.42, 0); close.add(sing.mesh);
  // 字幕条（同大屏下沿那条的样子）：当前这一句，唱到的词亮
  const tick = (() => { const c = document.createElement('canvas'); c.width = 1600; c.height = 150; const g = c.getContext('2d'); const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1600 / 540 * 0.9, 150 / 540 * 0.9), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthTest: false })); m.position.set(0, -0.74, 1); m.renderOrder = 40; close.add(m);
    let key = '';
    return { draw(T, ln) {
      const k = ln.words.map(w => T < w.start ? 0 : T < w.end + 0.08 ? 2 : 1).join(''); if (k === key) return; key = k;
      g.clearRect(0, 0, 1600, 150); const px = 104; g.font = `${px}px ${FONT}`; g.textBaseline = 'middle'; g.textAlign = 'left';
      const words = ln.words.map(w => w.w.toUpperCase()), sp = g.measureText(' ').width, ws = words.map(w => g.measureText(w).width), total = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
      g.fillStyle = 'rgba(10,10,16,0.82)'; g.fillRect(800 - total / 2 - 40, 0, total + 80, 150);
      let x = 800 - total / 2; ln.words.forEach((w, i) => { if (T >= w.start) { g.fillStyle = T < w.end + 0.08 ? PAL.lemon : '#ffffff'; g.fillText(words[i], x, 81); } x += ws[i] + sp; });
      tex.needsUpdate = true; } }; })();
  const VOW6 = { Was: 'a', it: 'i', all: 'o', for: 'o', 'show?': 'o' };
  function singAt(T) {
    for (const w of L.show.words) if (T >= w.start && T < w.end) return (T - w.start) < Math.min((w.w === 'show?' ? 0.66 : 0.82) * (w.end - w.start), 0.75) ? SING[VOW6[w.w] ?? 'a'] : SING.rest;
    return SING.rest;
  }
  shot('c4-show', C4.s6, C4.hall, T => {
    const dark = smooth((T - C4.blackout) / 0.12), ph = (T - B[7]) / BEAT, bob = Math.abs(Math.sin(Math.PI * ph)), sway = Math.sin(Math.PI * ph / 2);
    sing.U.map.value = singAt(T); sing.U.uGain.value = lerp(1, 0.9, dark); sing.U.uRim.value = lerp(1, 0.35, dark);
    sing.mesh.position.set(0.02 * sway * (1 - dark), -0.42 - 0.012 * bob * (1 - dark), 0); sing.mesh.rotation.z = 0.02 * sway * (1 - dark);
    const z = lerp(1, 1.06, smooth((T - C4.s6) / (C4.hall - C4.s6))); closeCam.zoom = z; closeCam.updateProjectionMatrix();
    washU.uLevel.value = (1 - dark) * (0.9 + 0.25 * kick(T, 0.2)); washU.uSpot.value = dark; washU.uT.value = T;
    tick.draw(T, L.show);
    return { scene: close, camera: closeCam, post: { bloom: { strength: 0.45, threshold: 1.25, radius: 0.6 }, chroma: 0.05, grade: { vignette: lerp(0.3, 0.55, dark) }, flash: cutFlash(T, C4.s6, 0.2) } };
  });

  // ================================================================ 尾声：走廊
  const LU = { uRing: { value: new THREE.Vector3(1, 1, 1) }, uCore: { value: 0 }, uLemon: { value: col(PAL.lemon) } };
  const flareTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.2, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c); })();
  const H = buildHall({ NB: 10, lensMat: makeLensMaterial(LU), flareTex });
  const E = H.eyePos, GS = 1.7;                                           // 她在走廊里的身高（走廊高 3）
  const hallGL = createGirlLights({ key: 1.1, rim: 1.5, fill: 0.45 }); H.scene.add(hallGL);
  const hallLights = hallGL.children.filter(l => l.isLight).map(l => ({ l, base: l.intensity }));
  const hcam = new THREE.PerspectiveCamera(40, mv.width / mv.height, 0.02, 400); H.scene.add(hcam);
  // oh 的光环：每声从眼里吐出一圈，沿走廊飞向镜头
  const rings = C4.ohs.map(t => { const m = new THREE.Mesh(new THREE.TorusGeometry(1, 0.022, 8, 96), new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 2.4), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); m.visible = false; H.scene.add(m); return { t, m }; });
  const BAY_ON = i => C4.hall + 0.008 + i * 0.045, BAY_OFF = i => C4.hall2 + Math.max(0, 7 - i) * BEAT;       // 通电：近 → 远；熄灯：远 → 近。切回走廊时最远三圈已经黑了，之后一拍一圈，第 1 圈 152.05 灭，只剩她脚下那一圈亮到终帧
  function hallLightsAt(T, { final = false } = {}) {
    let level = 0;
    for (const b of H.bays) {
      const k = T - BAY_ON(b.i), off = final || (b.i >= 1 && T >= BAY_OFF(b.i));
      const lit = off ? 0 : k < 0 ? 0 : (k < 0.05 ? 1.6 : 1);
      b.lampM.color.set(lit ? PAL.pink : '#1c1924').multiplyScalar(lit ? 2.0 * lit : final ? 0.5 : 1);
      b.stripM.color.set(lit ? PAL.pink : '#1c1924').multiplyScalar(lit ? 2.3 * lit : final ? 0.5 : 1);
      b.seamM.color.copy(hdr(PAL.mint, lit ? 0.16 : 0.03));
      b.pl.intensity = 2.4 * lit; level += lit ? 1 : 0;
    }
    level /= H.bays.length;
    H.amb.intensity = final ? 0.2 : lerp(0.3, 1.25, smooth((T - C4.hall) / 0.6)) * lerp(0.07, 1, level);
    const oh = C4.ohs.reduce((s, t) => s + (T >= t ? Math.exp(-(T - t) / 0.16) : 0), 0);
    let e = T < C4.eyeOn ? 0 : smooth((T - C4.eyeOn) / 0.2) * (1 + 0.6 * Math.exp(-(T - C4.eyeOn) * 5)) + 0.7 * oh;
    if (final) { e = 0.9; const k = T - C4.dotBlink; if (k >= 0 && k < 0.16) e = 0.02; else if (k >= 0.16) e = 0.9 + 0.8 * Math.exp(-(k - 0.16) / 0.15); }   // 那一点柠黄眨一下
    LU.uCore.value = e; LU.uRing.value.setScalar(final ? 0.5 * Math.min(1, e) : Math.min(1.8, e));
    H.eyeLight.intensity = (final ? 0.25 : 1.2) * e; H.flare.material.opacity = Math.min(1, (final ? 0.5 : 0.7) * e); H.flare.scale.setScalar(final ? 0.55 + 0.25 * e : 0.9 + 0.35 * e);
    H.tubeM.color.copy(hdr(PAL.lemon, 0.15 + 1.7 * Math.min(1, e)));
    for (const r of rings) {
      const a = T - r.t; r.m.visible = !final && a >= 0 && a < 1.9; if (!r.m.visible) continue;
      const z = E.z + 0.3 + a * 15.5, s = lerp(0.3, 1.32, eOut(a / 0.5));
      r.m.position.set(0, lerp(E.y, 1.5, eOut(a / 0.5)), z); r.m.scale.setScalar(s); r.m.material.opacity = Math.min(1, a / 0.05) * clamp((1.9 - a) / 0.5);
    }
    return level;
  }
  const MOON = [{ t: C4.slide, anim: 'dance__back-slide' }]   /* 朝向不变的倒滑步（moonwalk 那条片段自己会转身，退的方向对不上） */, STAND = [{ t: C4.hall - 3, anim: 'act__look-around', rate: 0.4 }];
  // 她在走廊里的位置：面朝那只眼（-Z），倒着往 +Z 退。slide 之前站在眼前
  const herZ = T => T < C4.slide ? -18.2 : T < C4.stage7 + 0.2 ? lerp(-18.2, -14.2, (T - C4.slide) / (C4.stage7 - C4.slide)) : lerp(-5.6, -1.7, clamp((T - C4.hall2) / (C4.turn + 0.3 - C4.hall2)));   // 约 1.1–1.2 /s ≈ 倒滑步片段自己的滑动速度 × 身高
  function hallGirl(T, cam_) {
    girl.root.visible = true; girl.root.scale.setScalar(GS); H.scene.add(girl.root);
    const spin = eIO((T - C4.turn) / (C4.last - C4.turn));                // 152.3 起原地转过身来
    girl.root.position.set(0.12 * Math.sin((T - C4.slide) * 1.3), 0, herZ(T)); girl.root.rotation.set(0, Math.PI + Math.PI * spin, 0);
    girl.play(T < C4.slide ? STAND : MOON, T); girl.setSkin('toon', T);
    H.scene.updateMatrixWorld(true);
    const hp = girl.headPosition(V3()).project(cam_), headIn = spin > 0.85 && Math.abs(hp.x) < 0.92 && Math.abs(hp.y) < 0.92 && hp.z < 1;   // 背影不传 camera；转过身来才用五官层
    girl.face?.update(T, headIn ? { blink: 'auto', camera: cam_, expression: 'smile' } : { expression: 'smile' });
  }
  const hallPost = (x = {}) => ({ bloom: { strength: 0.8, threshold: 0.95, radius: 0.8 }, chroma: 0.05, ...x, grade: { vignette: 0.3, ...(x.grade || {}) } });
  const place = (p, look, fov) => { hcam.fov = fov; hcam.position.copy(p); hcam.up.set(0, 1, 0); hcam.lookAt(look); hcam.updateProjectionMatrix(); hcam.updateMatrixWorld(true); };
  const face = makePlate(await keyed('neutral', FINAL_DIR)), FACE = { smile: face.U.map.value, wink: await keyed('wink', FINAL_DIR) };   // neutral = 睁眼带一点笑（final/smile 是眯眼大笑，不用）
  face.mesh.visible = false; hcam.add(face.mesh);
  shot('c4-hall', C4.hall, C4.stage7, T => {
    face.mesh.visible = false;
    const level = hallLightsAt(T); for (const { l, base } of hallLights) l.intensity = base * level;
    const u = clamp((T - C4.slide) / (C4.stage7 - C4.slide)), zc = lerp(1.3, -10.2, 1 - (1 - u) ** 2.4);                    // 通电时不动（同开头）；她一开始退，镜头就迎上去
    place(V3(0, lerp(1.62, 1.45, u), zc), V3(0, lerp(1.62, 1.5, u), -H.LEN), lerp(40, 38, u));
    hallGirl(T, hcam);
    return { scene: H.scene, camera: hcam, post: hallPost() };
  });
  stg('c4-stage-dance', C4.stage7, C4.hall2, ['top', { cam: () => camArc }], { variant: 'finale', lead: 'dance', expression: 'smile' });        // 尾声齐舞：俯拍看队形 → 横移（她在正中）；和副歌里那五个机位都不一样
  shot('c4-hall-dark', C4.hall2, C4.last, T => {
    face.mesh.visible = false;
    const level = hallLightsAt(T); for (const { l, base } of hallLights) l.intensity = base * lerp(0.7, 1, level);   // 走廊黑了，她身上还留着光
    const u = (T - C4.hall2) / (C4.last - C4.hall2);
    place(V3(0.5, 0.42, lerp(2.0, 1.75, u)), V3(0, 1.25, -9), 40);
    hallGirl(T, hcam);
    return { scene: H.scene, camera: hcam, post: hallPost({ flash: cutFlash(T, C4.hall2, 0.2) }) };
  });
  shot('c4-wink', C4.last, C4.end + 0.2, T => {
    hallLightsAt(T, { final: true }); for (const { l } of hallLights) l.intensity = 0;
    girl.root.visible = false;
    const u = smooth((T - C4.last) / (C4.end - C4.last));
    place(V3(0, 1.55, 1.4), V3(3.74, 1.6, -H.LEN), lerp(34, 33, u));     // 镜头朝右偏 8.4°：尽头那一点落在画面左侧
    const k = T - C4.wink;
    face.mesh.visible = true; face.U.map.value = k >= 0 && k < 0.42 ? FACE.wink : FACE.smile; face.U.uGain.value = 0.92; face.U.uRim.value = 0.9;
    face.mesh.position.set(0.236, -0.2, -1.25); face.mesh.scale.setScalar(0.8 * (1 + 0.012 * (k >= 0 ? Math.exp(-k / 0.2) : 0)));
    return { scene: H.scene, camera: hcam, post: hallPost({ bloom: { strength: 0.6, threshold: 1.2, radius: 0.7 }, grade: { vignette: 0.42 } }) };
  });

  return shots;
}

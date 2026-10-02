// shots/c4-v4.js — 副歌 4 + 尾声 v4（歌曲时间 123.868–156.65 s，全片结尾）。#1052
// 分镜：fresh/v4-rest/c4/plan.md（第二版，用户通过）。剧情和舞台分开，强拍上直接切。
//
//   const shots = await makeC4V4(mv);   mv.mount(shots, { offset: C4.t0, duration: C4.end - C4.t0 });
//
//   123.87  A   剧情：从表盘贴脸特写开始（接桥段末格的 2D 表），通电后镜头往后拉出秤、坑、全城和她的背影。那台裂了的 P(DOOM) 秤重新亮起；全城的窗三拍睁成柠黄的眼，指针被顶到头 1.00。她（3D 背影）一缩、退一步
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
import { barSchedule } from '../kits/holo-dancer.js';

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
  wake: 124.02, pull0: 124.02, pull1: 125.02, eyes: [124.52, 124.78, 125.20], peg: 125.40,   // 123.87–124.02 表盘贴脸不动（和桥段末格对齐的那一帧），通电的同时开始往后拉
  storyB: B[6], closeFrom: 134.95, closeTo: 136.55, signOff: 136.85,
  s6: B[7] + BEAT, blackout: B[8],
  // 「show?」拖到 140.55：等她唱完、合上嘴看一眼镜头再切（140.685，下一拍）
  hall: B[9] + BEAT, eyeOn: B[9] + BEAT + 0.03, slide: B[10], stage7: B[12], hall2: B[14], last: B[16], wink: 0, dotBlink: 0,   // wink / dotBlink 在终帧那一段按图生视频的长度算
  // 尾声 oh 的人声起点（audio.json 自动检测；实现后用耳朵对过再调）
  ohs: [140.71, 141.18, 141.62, 142.32, 142.78, 143.18, 143.43, 143.65, 143.88, 144.37, 144.82, 145.51, 145.96, 146.44, 146.83, 147.05, 147.26, 147.49, 150.28, 151.18, 152.09, 152.55],
};
// 入口接口（给桥段 br-v4 对 123.87 那一帧）：3D 表盘正对镜头，圆心在画面正中，表盘（白色表面那个圆）半径 = 画高 × dialRadius，
//   所以表盘上下各出画一点（直径 = 画高 × 1.24），左右两边露出表盘外的夜空：正中是轴心，指针躺在刻度 0（指向左下，从 12 点方向逆时针 111.6°），
//   下方是读数窗「P(DOOM) 0.00」，四周看得到 0 / .25 / .50 / .75 / 1.00 的刻度数字。
//   表盘是灭的（lit = 0.15：暗灰的表面，霓虹外圈不亮）、裂纹裂到底、右侧 1.00–1.20 那一角缺掉（露出后面的夜空）。
//   表盘的画法见 kits/doom-scale.js 的 drawDial（1024² 画布，圆心 512,512，半径 500 px = 表盘半径）。
export const C4_ENTRY = { T: 123.868, dialRadius: 0.62, center: [0.5, 0.5], fov: 30, state: { value: 0, lit: 0.15, cracked: 1, err: false } };
export const ANIMS = ['act__terrified', 'act__look-around', 'move__walk-back__inplace'];   // 舞台用的片段由 kits/stage.js 自己加载

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
// 图生视频的帧序列（fresh/v4-rest/c4/i2v/<名字>/f-NNN.png + meta.json，prep.py 逐帧抠好的 RGBA；Wan 原始 16 fps，不插帧）。
// 页面按时间取最近一帧，视频本身不播放 → 画面仍是 T 的纯函数。目录不在就返回 null，镜头退回静态关键画。
const I2V_DIR = new URL('../fresh/v4-rest/c4/i2v/', import.meta.url);
async function loadSeq(name) {
  try {
    const meta = await fetch(new URL(`${name}/meta.json`, I2V_DIR)).then(r => (r.ok ? r.json() : null)); if (!meta) return null;
    const tex = await Promise.all(Array.from({ length: meta.frames }, async (_, i) => { const img = new Image(); img.src = new URL(`${name}/f-${String(i).padStart(3, '0')}.png`, I2V_DIR).href; await img.decode();
      const t = new THREE.Texture(img); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.needsUpdate = true; return t; }));
    return { tex, n: meta.frames, fps: meta.fps, dur: meta.frames / meta.fps, frame: i => tex[Math.round(clamp(i, 0, meta.frames - 1))], at: u => tex[Math.round(clamp(u) * (meta.frames - 1))] };   // at(u)：u = 0..1 整段进度
  } catch (e) { console.info('c4-v4：没有图生视频序列 ' + name + '，用静态关键画', e.message); return null; }
}
// 2D 纸片：粉色描边光（同 v4-01-final 的 plate）；uGain 整体亮度
function makePlate(tex) {
  const U = { map: { value: tex }, uRim: { value: 1 }, uPink: { value: col(PAL.pink) }, uGain: { value: 1 }, uTint: { value: new THREE.Vector3(1, 1, 1) } };
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.832, 1.248), new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, depthTest: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform sampler2D map; uniform float uRim, uGain; uniform vec3 uPink, uTint; varying vec2 vUv;
      void main(){
        vec4 t = texture2D(map, vUv); float e = 0.0; vec2 d = vec2(0.012, 0.008);
        e += 1.0 - texture2D(map, vUv + vec2(d.x, 0.0)).a; e += 1.0 - texture2D(map, vUv - vec2(d.x, 0.0)).a;
        e += 1.0 - texture2D(map, vUv + vec2(0.0, d.y)).a; e += 1.0 - texture2D(map, vUv - vec2(0.0, d.y)).a;
        gl_FragColor = vec4((t.rgb * mix(vec3(1.0), vec3(1.0, 0.93, 0.95), 0.5)) * uTint * uGain + uPink * clamp(e * 0.5, 0.0, 1.0) * uRim * 1.6, t.a);
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

  const softDot = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,0.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();

  // ================================================================ 剧情：夜城 + 秤
  const city = new THREE.Scene(); city.background = col('#06060b');
  // 布局（y = 0 是街面，她的身高 = 1）：她站在塌掉的路沿上（桥段把路砸出一个显卡坑）；坑对面一栋矮楼的楼顶上是那台秤
  const PIT = { z0: -1.6, z1: -19.5, hw: 34, depth: 3.0 };                 // 坑：近沿（她脚边）/ 远沿 / 半宽 / 深
  const scale = await createDoomScale();
  const SC = V3(-1.6, 1.0, -26);                                           // 秤座底面 = 矮楼楼顶
  scale.group.position.copy(SC); city.add(scale.group); city.updateMatrixWorld(true);
  const dialC = scale.dialCenter(V3());
  const ENTRY_DIST = (scale.dims.dialR / C4_ENTRY.dialRadius / 2) / Math.tan(C4_ENTRY.fov * Math.PI / 360);   // 贴脸特写时镜头离表盘多远
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
  // 坑里往上飘的光尘（LED 的颜色）和几道从显卡阵列里透出来的光柱；路沿上是桥段撞断的安全护栏（黄黑条纹，前景）
  const embers = (() => { const n = 220, rnd = mulberry32(431), base = [], p = new Float32Array(n * 3), c = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { base.push([(rnd() - 0.5) * 34, rnd() * 11, PIT.z1 + 1 + rnd() * (PIT.z0 - PIT.z1 - 1), 0.5 + rnd(), rnd() * 6.28]); const k = col(rnd() < 0.65 ? PAL.mint : rnd() < 0.6 ? PAL.lemon : PAL.pink); c.set([k.r, k.g, k.b], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3)); g.setAttribute('color', new THREE.BufferAttribute(c, 3));
    const mat = new THREE.PointsMaterial({ map: softDot, size: 0.1, sizeAttenuation: true, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
    const m = new THREE.Points(g, mat); m.frustumCulled = false; city.add(m);
    return { set(T, k) { base.forEach(([x, y, z, sp, ph], i) => p.set([x + 0.5 * Math.sin(T * 0.5 * sp + ph), -PIT.depth + ((y + T * 0.9 * sp) % 11), z], i * 3)); g.attributes.position.needsUpdate = true; mat.opacity = 0.8 * k; } }; })();
  const shafts = [-11, -6.5, -2.5, 2, 6, 10.5].map((x, i) => { const u = { k: { value: 0 }, c: { value: col(i % 3 === 1 ? PAL.lemon : PAL.mint) } };
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.9 + (i % 2) * 0.8, 10), new THREE.ShaderMaterial({ uniforms: u, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'uniform vec3 c; uniform float k; varying vec2 vUv; void main(){ float a = pow(clamp(1.0 - vUv.y, 0.0, 1.0), 1.7) * smoothstep(0.0, 0.5, vUv.x) * (1.0 - smoothstep(0.5, 1.0, vUv.x)); gl_FragColor = vec4(c * a * k, 1.0); }' }));
    m.position.set(x, -PIT.depth + 5, PIT.z1 + 3 + (i * 37 % 11)); city.add(m); return { u, ph: i * 1.7 }; });
  { const c = document.createElement('canvas'); c.width = 256; c.height = 32; const g = c.getContext('2d'); g.fillStyle = PAL.lemon; g.fillRect(0, 0, 256, 32); g.fillStyle = '#111'; for (let x = -32; x < 256; x += 48) { g.beginPath(); g.moveTo(x, 32); g.lineTo(x + 24, 32); g.lineTo(x + 48, 0); g.lineTo(x + 24, 0); g.fill(); }
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const barM = new THREE.MeshBasicMaterial({ map: tex, color: hdr('#ffffff', 0.75) }), postM = new THREE.MeshStandardMaterial({ color: '#2a2b44', roughness: 0.7 });
    for (const [x, z, ry, rz, w] of [[-5.2, PIT.z0 + 0.5, 0.08, 0, 3.2], [-1.7, PIT.z0 + 0.35, -0.1, -0.32, 2.6], [6.3, PIT.z0 + 0.6, 0.2, 0.55, 2.8]]) {
      const g2 = new THREE.Group(); g2.position.set(x, 0, z); g2.rotation.set(0, ry, rz);
      const bar = new THREE.Mesh(new THREE.BoxGeometry(w, 0.26, 0.07), barM); bar.position.y = 0.72; g2.add(bar);
      for (const sx of [-1, 1]) { const po = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.85, 0.09), postM); po.position.set(sx * (w / 2 - 0.2), 0.42, 0); g2.add(po); }
      city.add(g2); } }
  const pitGlow = new THREE.PointLight(col(PAL.mint), 0, 30, 1.4); pitGlow.position.set(1, -1.2, -9); city.add(pitGlow);
  const _c = new THREE.Color();
  function ledsAt(T, level) {                                              // LED 一圈圈往外的光波（桥段 100 000 GPU 留下的），level = 整体亮度
    leds.forEach((L, i) => { const w = 0.5 + 0.5 * Math.sin(L.d * 0.55 - T * 7.5 + L.ph * 0.6); leds.mesh.setColorAt(i, _c.copy(L.base).multiplyScalar(level * (0.5 + 2.2 * w * w))); });
    leds.mesh.instanceColor.needsUpdate = true; pitGlow.intensity = 9 * level;
    embers.set(T, level); for (const sh of shafts) sh.u.k.value = level * (0.3 + 0.14 * Math.sin(T * 1.3 + sh.ph) + 0.08 * music.pulse('kick', T, { decay: 0.2 }));
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
    const lit = A ? Math.max(C4_ENTRY.state.lit, smooth((T - C4.wake) / 0.35) * (T < C4.wake + 0.5 && Math.sin(T * 60) > 0.2 ? 0.55 : 1)) : lerp(1, 0.1, smooth((T - C4.closeFrom - 0.6) / (C4.closeTo - C4.closeFrom)));
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
    // 机位：A 从表盘贴脸特写开始（接桥段末格里那块 2D 表：123.87 这一帧表盘正对镜头、圆心在画面正中、表盘半径 = 画高 × C4_ENTRY.dialRadius），
    //   通电后往后拉出：秤 → 坑 → 全城睁开的眼 → 掠过她身边，停在她身后低机位仰看秤（125.0 到位，peg 125.40 在静止的画面里）。B 从仰看秤慢慢升回去
    const sh = A ? shake(T, C4.peg, 0.09) + C4.eyes.slice(2).reduce((a, t) => a + shake(T, t, 0.025), 0) : 0;
    if (A) {
      const u = eIO((T - C4.pull0) / (C4.pull1 - C4.pull0)), P0 = dialC.clone().add(V3(0, 0, ENTRY_DIST));
      cam.position.set(lerp(P0.x, 0.25, u), lerp(P0.y, 0.5, u) + sh, lerp(P0.z, 5.0, u)); cam.up.set(0, 1, 0);
      cam.lookAt(lerp(dialC.x, -0.3, u), lerp(dialC.y, 7.9, u), lerp(dialC.z, -24, u)); cam.fov = lerp(C4_ENTRY.fov, 43, u);
    } else {
      const u = 1 - smooth((T - C4.storyB) / 2.2);
      cam.position.set(lerp(0.3, 0.25, u), lerp(2.2, 0.5, u), lerp(6.8, 5.0, u)); cam.up.set(0, 1, 0);
      cam.lookAt(-0.3, lerp(5.6, 7.9, u), -24); cam.fov = lerp(55, 43, u);
    }
    cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
    city.updateMatrixWorld(true);
    girl.face?.update(T, { expression: 'surprised' });                    // 全程背影：不传 camera（五官层只管正脸）
    return { scene: city, camera: cam, post: { bloom: { strength: 0.8, threshold: 1.0, radius: 0.8 }, chroma: 0.05 + (A ? 0.25 * (T >= C4.peg ? Math.exp(-(T - C4.peg) * 5) : 0) + 0.08 * pop : 0),
      grade: { vignette: 0.32, tint: '#ff2e4a', tintAmount: 0.10 * pinned * lit }, flash: A && T >= C4.peg ? { amount: 0.3 * Math.exp(-(T - C4.peg) / 0.07), color: '#ff5a6e' } : 0 } };
  }
  shot('c4-scale', B[0], B[1], T => storyCity(T, 'A'));

  // ================================================================ 舞台（kits/stage.js：全片同一座）。这一段用「finale」那套变体：12 人环绕、聚光炸开、灯最满（各段各用一套，不撞）
  //   C 位唱 ↔ 跳交替：每个机位自己点 lead（'sing' 站定唱 / 'dance' 和伴舞跳同一支）
  // 大屏节目单（#1055 素材库 cast-cyber-girl/closeup/screen-clips；片段不对口型，和逐词对口型的 rig 特写按小节交替）。一小节一项，和机位一一对应：
  //   副歌：半身持麦（推）→ rig（后上方机位看不到屏）→ 面部特写（推近大屏）→ 全身持麦（升，全场最满）→ rig 对口型（大屏特写：We'll never know，know 闭眼长音）
  //   各段不撞顺序：副歌 2 是 mic-full / rig / mic-half / rig / face，主歌 3 是 hairflip / rig / rig / point / low / rig
  //   尾声齐舞：甩头发（俯拍）→ 拍手（横移）
  const LED_SCHEDULE = [...barSchedule(mv, { t0: B[1], pattern: ['mic-half', 'rig', 'face', 'mic-full', 'rig'] }), ...barSchedule(mv, { t0: C4.stage7, pattern: ['hairflip', 'clap'] })];
  const stage = withStage ? await createStage(mv, { dancers, girl, variant: 'finale', leadPattern: [1, 0], lyrics: [[B[1] + 0.3, C4.hall]], led: { schedule: LED_SCHEDULE } }) : null;
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

  // ---------------------------------------------------------------- S6：2D 特写「Was it all for show?」
  //   图生视频（i2v/show：首帧 = 唱歌那套的 sing-a，尾帧 = neutral）：她唱完，慢慢放下按在胸口的手，抬眼看镜头。
  //   138.41 鼓停：身后四道光半拍灭一道，最后只剩一束顶光；她脸上的光从舞台的粉变成顶光的暖白；顶光里有光尘；镜头一直缓推。
  //   口型不逐词对（靠动作和字幕条）。序列不在时退回唱歌关键画逐词换图。
  const SHOW = await loadSeq('show');
  const SING = Object.fromEntries(await Promise.all(['a', 'o', 'i', 'e', 'u', 'rest', 'belt'].map(async k => [k, await keyed('sing-' + k, SING_DIR)])));
  const close = new THREE.Scene(); close.background = col('#05040c');
  const closeCam = new THREE.OrthographicCamera(-16 / 9, 16 / 9, 1, -1, 0, 10); closeCam.position.z = 5;
  const washU = { uLevel: { value: 1 }, uB: { value: new THREE.Vector4(1, 1, 1, 1) }, uSpot: { value: 0 }, uT: { value: 0 }, uPink: { value: col(PAL.pink) }, uMint: { value: col(PAL.mint) } };
  { const bg = new THREE.Mesh(new THREE.PlaneGeometry(32 / 9, 2), new THREE.ShaderMaterial({ uniforms: washU, depthTest: false, depthWrite: false,
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */`
        uniform float uLevel, uSpot, uT; uniform vec4 uB; uniform vec3 uPink, uMint; varying vec2 vUv;
        float beam(vec2 p, float x0, float ang, float w){ vec2 d = vec2(sin(ang), -cos(ang)); vec2 q = p - vec2(x0, 1.15); float along = dot(q, d); float side = abs(q.x * d.y - q.y * d.x); return smoothstep(w * (0.2 + along), 0.0, side) * smoothstep(2.6, 0.0, along) * step(0.0, along); }
        void main(){
          vec2 p = (vUv - 0.5) * vec2(3.5556, 2.0);
          vec3 c = mix(vec3(0.16, 0.07, 0.27), vec3(0.48, 0.11, 0.39), vUv.x * 0.6 + vUv.y * 0.4) * 0.8 * uLevel;
          c += uPink * 0.55 * (uB.x * beam(p, -1.5, 0.35 + 0.08 * sin(uT * 1.6), 0.16) + uB.y * beam(p, 1.5, -0.35 - 0.08 * sin(uT * 1.6 + 1.0), 0.16));
          c += uMint * 0.45 * (uB.z * beam(p, -0.7, 0.16, 0.13) + uB.w * beam(p, 0.7, -0.16, 0.13));
          c += vec3(1.0, 0.96, 0.86) * 0.42 * uSpot * beam(p, 0.0, 0.0, 0.95);
          gl_FragColor = vec4(c, 1.0);
        }` })); bg.position.z = -1; close.add(bg); }
  const sing = makePlate(SING.rest); sing.mesh.scale.setScalar(2.32); sing.mesh.position.set(0, -0.42, 0); close.add(sing.mesh);
  // 顶光里的光尘（在她前面飘，只有顶光亮着时看得见）
  const motes = (() => { const n = 70, rnd = mulberry32(140), base = [], p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) base.push([(rnd() - 0.5) * 2.1, rnd() * 2 - 1, rnd(), 0.5 + rnd()]);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const m = new THREE.Points(g, new THREE.PointsMaterial({ color: hdr('#fff3d6', 1.6), map: softDot, size: 7, sizeAttenuation: false, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false })); m.renderOrder = 20;   /* 画在她后面：光尘只在她周围的顶光里，不落在脸上 */ m.frustumCulled = false; close.add(m);
    return { set(T, k) { base.forEach(([x, y, ph, sp], i) => { const yy = ((y - T * 0.045 * sp + 100) % 2 + 2) % 2 - 1; p.set([x * (0.55 + 0.45 * (1 - yy) / 2) + 0.03 * Math.sin(T * 0.9 + ph * 20), yy, 2], i * 3); }); g.attributes.position.needsUpdate = true; m.material.opacity = 0.7 * k; } }; })();
  // 字幕条（同大屏下沿那条的样子）：当前这一句，唱到的词亮
  const tick = (() => { const c = document.createElement('canvas'); c.width = 1600; c.height = 150; const g = c.getContext('2d'); const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1600 / 540 * 0.9, 150 / 540 * 0.9), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthTest: false })); m.position.set(0, -0.74, 1); m.renderOrder = 40; close.add(m);
    let key = '';
    return { m, draw(T, ln) {
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
  const BEAM_OFF = [0, 1, 2, 3].map(i => C4.blackout + [0, 0.5, 1, 1.5][i] * BEAT);     // 四道光：左外、右外、左内、右内，半拍灭一道
  shot('c4-show', C4.s6, C4.hall, T => {
    const u = (T - C4.s6) / (C4.hall - C4.s6), dark = smooth((T - C4.blackout) / (2 * BEAT)), spot = smooth((T - C4.blackout - 0.1) / 0.5);
    sing.U.map.value = SHOW ? SHOW.at(u) : singAt(T);
    const flick = BEAM_OFF.reduce((a, t) => a + (T >= t ? Math.exp(-(T - t) / 0.06) : 0), 0);                    // 每灭一道，脸上的光跟着跳一下
    sing.U.uGain.value = lerp(1.0, 0.8, dark) + 0.16 * spot - 0.12 * flick + (1 - dark) * 0.06 * kick(T, 0.2);
    sing.U.uTint.value.set(1, lerp(0.95, 0.985, spot), lerp(1.0, 0.9, spot)); sing.U.uRim.value = lerp(1, 0.3, dark);
    sing.mesh.position.set(0, -0.42, 0); sing.mesh.rotation.z = 0;
    closeCam.zoom = lerp(1, 1.14, u * u * (3 - 2 * u) * 0.6 + u * 0.4); closeCam.updateProjectionMatrix();          // 缓推
    tick.m.scale.setScalar(1 / closeCam.zoom); tick.m.position.y = -0.74 / closeCam.zoom;                        // 字幕条不跟着推近放大
    washU.uLevel.value = (1 - dark) * (0.9 + 0.25 * kick(T, 0.2)); washU.uSpot.value = spot; washU.uT.value = T;
    washU.uB.value.set(...BEAM_OFF.map(t => (T >= t ? 0 : 1)));
    motes.set(T, spot);
    tick.draw(T, L.show);
    return { scene: close, camera: closeCam, post: { bloom: { strength: 0.45, threshold: 1.25, radius: 0.6 }, chroma: 0.05 + 0.1 * flick, grade: { vignette: lerp(0.3, 0.55, dark) }, flash: cutFlash(T, C4.s6, 0.2) } };
  });

  // ================================================================ 尾声：走廊
  const LU = { uRing: { value: new THREE.Vector3(1, 1, 1) }, uCore: { value: 0 }, uLemon: { value: col(PAL.lemon) } };
  const flareTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.2, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c); })();
  const H = buildHall({ NB: 10, lensMat: makeLensMaterial(LU), flareTex });
  const E = H.eyePos, GS = 1.7;                                           // 她在走廊里的身高（走廊高 3）
  const hallGL = createGirlLights({ key: 1.1, rim: 1.5, fill: 0.45 }); H.scene.add(hallGL);
  const hallLights = hallGL.children.filter(l => l.isLight).map(l => ({ l, base: l.intensity }));
  const hcam = new THREE.PerspectiveCamera(40, mv.width / mv.height, 0.02, 400); H.scene.add(hcam);
  // oh 的光环：每声从眼里吐出一圈，沿走廊飞向镜头；最近的三圈各带一盏柠黄的灯，扫过时墙和她的轮廓跟着亮一下
  const rings = C4.ohs.map(t => { const m = new THREE.Mesh(new THREE.TorusGeometry(1, 0.022, 8, 96), new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 2.4), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); m.visible = false; H.scene.add(m); return { t, m }; });
  const ringLights = [0, 1, 2].map(() => { const l = new THREE.PointLight(col(PAL.lemon), 0, 5, 1.8); H.scene.add(l); return l; });
  // 光尘：整条走廊里慢慢飘的小亮点（有灯的地方才看得见）
  const dust = (() => { const n = 320, rnd = mulberry32(88), base = [], p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) base.push([(rnd() - 0.5) * 3.4, 0.15 + rnd() * 2.6, -rnd() * 24 + 1.5, rnd() * 6.28, 0.4 + rnd()]);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const mat = new THREE.PointsMaterial({ color: hdr('#ffd9ec', 1.5), map: flareTex, size: 0.07, sizeAttenuation: true, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false });
    const m = new THREE.Points(g, mat); m.frustumCulled = false; H.scene.add(m);
    return { set(T, k) { base.forEach(([x, y, z, ph, sp], i) => p.set([x + 0.12 * Math.sin(T * 0.35 * sp + ph), y + 0.1 * Math.sin(T * 0.27 * sp + ph * 1.7), z + 0.25 * Math.sin(T * 0.21 * sp + ph * 0.6)], i * 3)); g.attributes.position.needsUpdate = true; mat.opacity = 0.6 * k; } }; })();

  // ---- 她：面朝那只眼（-Z）往后退（Mixamo Walking Backwards，原地版 + 脚锁：支撑脚钉地，滑动量变成根位移）
  const STEP_RATE = 0.967 / (2 * BEAT);                                   // 一拍一步
  const WALK = [{ t: C4.hall - 3, anim: 'act__look-around', rate: 0.4 }, { t: C4.slide, anim: 'move__walk-back__inplace', rate: STEP_RATE }]; WALK.fade = 0.3;
  const INFO = girl.dancer.S.info, bone = k => INFO[k].bone;
  const lock = (() => {                                                   // 142.05–153：60 fps 采样，站立脚不动 → 根往后挪多少（身高 = 1、朝 -Z 时的世界位移）
    const tA = C4.slide, tB = C4.last + 0.1, FPS = 60, FEET = ['LeftToeBase', 'RightToeBase'], LOW = 0.035, fr = [];
    const holder = new THREE.Scene(); holder.add(girl.root);
    for (let f = 0; f <= Math.round((tB - tA) * FPS); f++) { girl.root.position.set(0, 0, 0); girl.root.rotation.set(0, Math.PI, 0); girl.root.scale.setScalar(1); girl.play(WALK, tA + f / FPS); girl.root.updateMatrixWorld(true); fr.push(FEET.map(k => bone(k).getWorldPosition(V3()))); }
    const y0 = Math.min(...fr.map(q => Math.min(q[0].y, q[1].y))), off = V3(), raw = []; let a = null;
    for (let f = 0; f < fr.length; f++) {
      if (a != null && f > 0) { off.x -= fr[f][a].x - fr[f - 1][a].x; off.z -= fr[f][a].z - fr[f - 1][a].z; }
      const lo = fr[f][0].y <= fr[f][1].y ? 0 : 1;                        // 更低的那只脚 = 支撑脚（差得够多才换，免得来回跳）
      if (a == null || (lo !== a && fr[f][a].y - fr[f][lo].y > 0.012) || fr[f][a].y - y0 > LOW) a = lo;
      raw.push(off.clone());
    }
    const G = [0.06, 0.24, 0.4, 0.24, 0.06], tab = raw.map((_, f) => { const o = V3(); G.forEach((w, i) => o.addScaledVector(raw[clamp(f + i - 2, 0, raw.length - 1)], w)); return o; });
    const at = T => { const x = clamp((T - tA) * FPS, 0, tab.length - 1), i = Math.floor(x), j = Math.min(tab.length - 1, i + 1); return tab[i].clone().lerp(tab[j], x - i); };
    console.info('c4-v4 脚锁：后退 ' + (at(tB).z * GS).toFixed(2) + ' / ' + (tB - tA).toFixed(1) + ' s = ' + (at(tB).z * GS / (tB - tA)).toFixed(2) + ' /s，横向漂 ' + (at(tB).x * GS).toFixed(2));
    return { at };
  })();
  const Z_END = -6.0, Z0 = Z_END - lock.at(C4.last).z * GS;               // 152.96 时她退到 Z_END；142.05 之前站在 Z0（那只眼前）
  const herPos = T => { const o = lock.at(Math.max(T, C4.slide)); return V3(o.x * GS * 0.3, 0, Z0 + o.z * GS); };   // 横向漂只留三成（走廊窄）
  // 抬手挡光：光环扫到她时右前臂抬到眼前（从背后看是抬起的手肘和手）。两次：144.3–145.6、151.15–152.5
  const shield = T => Math.max(smooth((T - 144.3) / 0.28) * (1 - smooth((T - 145.4) / 0.3)), smooth((T - 151.15) / 0.28) * (1 - smooth((T - 152.05) / 0.4)));
  const _q = new THREE.Quaternion(), _pq = new THREE.Quaternion();
  function aim(b, child, dir, k) {                                         // 把骨头 b 转到「b → child」指向世界方向 dir，按 k 混合
    b.updateWorldMatrix(true, false); child.updateWorldMatrix(true, false);
    const cur = child.getWorldPosition(V3()).sub(b.getWorldPosition(V3())).normalize();
    const world = _q.setFromUnitVectors(cur, dir.clone().normalize()).multiply(b.getWorldQuaternion(new THREE.Quaternion()));
    const local = b.parent.getWorldQuaternion(_pq).invert().multiply(world);
    b.quaternion.slerp(local, k); b.updateWorldMatrix(false, true);
  }
  function hallGirl(T) {
    girl.root.visible = true; girl.root.scale.setScalar(GS); H.scene.add(girl.root);
    girl.root.position.copy(herPos(T)); girl.root.rotation.set(0, Math.PI, 0);
    girl.play(WALK, T);
    const k = shield(T);
    if (k > 0.001) { girl.root.updateMatrixWorld(true); aim(bone('RightArm'), bone('RightForeArm'), V3(0.45, 0.05, -1), k); aim(bone('RightForeArm'), bone('RightHand'), V3(-0.75, 1, -0.35), k); }   // 她朝 -Z：右手边是 +X
    girl.setSkin('toon', T);
    H.scene.updateMatrixWorld(true);
    girl.face?.update(T, { expression: 'neutral' });                      // 走廊里全程背影 / 侧后，不传 camera
    return girl.root.position;
  }
  const darkZ = T => { const q = C4.hall2 + Math.floor((T - C4.hall2) / BEAT + 1e-6) * BEAT; return lerp(-19.5, herPos(q).z - 1.3, clamp((q - C4.hall2) / (B[16] - BEAT - C4.hall2))); };   // 黑暗的前沿：一拍往前跳一格，152.5 追到她脚后跟
  const BAY_ON = i => C4.hall + 0.008 + i * 0.045;
  function hallLightsAt(T, { final = false } = {}) {
    let level = 0; const dz = T >= C4.hall2 ? darkZ(T) : -1e9;
    for (const b of H.bays) {
      const k = T - BAY_ON(b.i), off = final || b.zc < dz;
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
    let nl = 0; for (const l of ringLights) l.intensity = 0;
    for (let i = rings.length - 1; i >= 0; i--) {                         // 从最新的一圈往回数
      const r = rings[i], a = T - r.t; r.m.visible = !final && a >= 0 && a < 1.9; if (!r.m.visible) continue;
      const z = E.z + 0.3 + a * 15.5, s = lerp(0.3, 1.32, eOut(a / 0.5)), op = Math.min(1, a / 0.05) * clamp((1.9 - a) / 0.5);
      r.m.position.set(0, lerp(E.y, 1.5, eOut(a / 0.5)), z); r.m.scale.setScalar(s); r.m.material.opacity = op;
      if (nl < ringLights.length) { const l = ringLights[nl++]; l.position.set(0, 2.2, z); l.intensity = 1.0 * op; }
    }
    dust.set(T, final ? 0.15 : lerp(0.25, 1, level));
    return level;
  }
  const hallPost = (x = {}) => ({ bloom: { strength: 0.8, threshold: 0.95, radius: 0.8 }, chroma: 0.05, ...x, grade: { vignette: 0.3, ...(x.grade || {}) } });
  const place = (p, look, fov) => { hcam.fov = fov; hcam.position.copy(p); hcam.up.set(0, 1, 0); hcam.lookAt(look); hcam.updateProjectionMatrix(); hcam.updateMatrixWorld(true); };
  const face = makePlate(await keyed('neutral', FINAL_DIR)), FACE = { smile: face.U.map.value, wink: await keyed('wink', FINAL_DIR) };   // neutral = 睁眼带一点笑（final/smile 是眯眼大笑，不用）
  face.mesh.visible = false; hcam.add(face.mesh);
  // 走廊的每个机位：(T, 她的位置) → 摆镜头；gl = 她身上灯的倍数（背光剪影时压暗）
  const hallShot = (id, t0, t1, camFn, { gl = 1, flash = 0.2 } = {}) => shot(id, t0, t1, T => {
    face.mesh.visible = false;
    const level = hallLightsAt(T), P = hallGirl(T);
    for (const { l, base } of hallLights) l.intensity = base * gl * lerp(0.7, 1, level);
    camFn(T, P, (T - t0) / (t1 - t0));
    return { scene: H.scene, camera: hcam, post: hallPost({ flash: cutFlash(T, t0, flash) }) };
  });
  // ① 通电（同全片第一个画面的机位）：她站在尽头那只眼前，很小
  hallShot('c4-hall-on', C4.hall, C4.slide, (T, P, u) => place(V3(0, 1.62, 1.3 - 0.4 * u), V3(0, 1.62, -H.LEN), 40), { flash: 0 });
  // ② 低机位侧跟、背光：她往后退，那只眼和光环在她身后（画面深处），她是剪影
  hallShot('c4-hall-low', C4.slide, B[11], (T, P, u) => place(V3(1.3, 0.36, P.z + 3.3 - 0.3 * u), V3(-0.15, 1.02, P.z - 2.5), 36), { gl: 0.4 });
  // ③ 她身后的腰上中景：光环迎面扫过来，她抬手挡光
  hallShot('c4-hall-mid', B[11], C4.stage7, (T, P, u) => place(V3(0.66, 1.4, P.z + 1.6), V3(-0.3, 1.34, P.z - 6), 34), { gl: 0.7 });
  stg('c4-stage-dance', C4.stage7, C4.hall2, ['top', { cam: () => camArc }], { variant: 'finale', lead: 'dance', expression: 'smile' });        // 尾声齐舞：俯拍看队形 → 横移（她在正中）；和副歌里那五个机位都不一样
  // ④ 右后方腰上中景：越过她看走廊深处，灯从眼那头一拍一圈地灭过来
  hallShot('c4-hall-dark', C4.hall2, B[15], (T, P, u) => place(V3(1.45, 1.28, P.z + 1.75 - 0.2 * u), V3(-0.4, 1.2, P.z - 1.8), 36), { gl: 0.8 });
  // ⑤ 她身后正面机位不动：她一路退到镜头前，背影把画面填满（接终帧的 2D 背影）；光环扫过时再挡一次
  const P_END = herPos(C4.last);
  hallShot('c4-hall-back', B[15], C4.last, () => place(V3(P_END.x - 0.24, 1.36, P_END.z + 0.74), V3(P_END.x - 0.24, 1.3, -H.LEN), 34), { gl: 0.75, flash: 0 });

  // ---------------------------------------------------------------- 终帧：图生视频。全黑的走廊里她转过身来（i2v/turn：背面半身 → neutral），头发甩开，浅笑；
  //   再朝我们眨一下眼（i2v/wink：neutral → wink，正放再倒放）；尽头那一点柠黄也眨一下；最后定格。序列不在时退回静态关键画
  const TURN = await loadSeq('turn'), WINK = await loadSeq('wink');
  const FIN = { turn0: 0.12, turn1: 1.85, wink0: 2.05, winkHalf: 0.42 };  // 相对 152.957
  C4.wink = C4.last + FIN.wink0; C4.dotBlink = C4.last + 3.05;
  function finalFace(k) {
    if (TURN && k < FIN.wink0) return TURN.at((k - FIN.turn0) / (FIN.turn1 - FIN.turn0));
    const w = k - FIN.wink0;
    if (WINK && w >= 0 && w < 2 * FIN.winkHalf) return WINK.at(w < FIN.winkHalf ? w / FIN.winkHalf : 2 - w / FIN.winkHalf);
    if (!WINK && w >= 0 && w < 0.42) return FACE.wink;
    return WINK ? WINK.at(0) : TURN ? TURN.at(1) : FACE.smile;
  }
  shot('c4-wink', C4.last, C4.end + 0.2, T => {
    hallLightsAt(T, { final: true }); for (const { l } of hallLights) l.intensity = 0;
    girl.root.visible = false;
    const k = T - C4.last, u = smooth(k / (C4.end - C4.last));
    place(V3(0, 1.55, 1.4), V3(3.74, 1.6, -H.LEN), lerp(34, 32.4, u));    // 镜头朝右偏 8.4°：尽头那一点落在画面左侧；一直极慢地推
    face.mesh.visible = true; face.U.map.value = finalFace(k); face.U.uGain.value = lerp(0.8, 0.94, smooth(k / 1.6)); face.U.uRim.value = 0.9; face.U.uTint.value.set(1, 1, 1);
    face.mesh.position.set(0.37, -0.21, -1.25); face.mesh.scale.setScalar(0.84);   // 画布右沿在画外：转身时甩开的头发不会被画布边切出一条直线
    return { scene: H.scene, camera: hcam, post: hallPost({ bloom: { strength: 0.6, threshold: 1.2, radius: 0.7 }, grade: { vignette: 0.42 } }) };
  });

  return shots;
}

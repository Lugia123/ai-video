// shots/v4-01-final.js — v4-01 定稿（歌曲 0–22.1 s，尾巴留到 22.6）。#998，方案：fresh/redo-0588/B/plan-final.md
//
//   const shots = await makeV401Final(mv);   mv.mount(shots, { offset: 0, duration: 22.6 });
//
// 由 shots/v4-01-2001.js 复制改来（原文件不动）。整段搬进跑酷段的世界：黑夜、深色板面、粉 / 薄荷 / 柠黄霓虹线；歌词 = 霓虹招牌。
//
//   0.000  wake     舱室通电（构图 / 机位 / 节拍同原版）：深色长廊，粉灯带从近到远一格格亮，尽头的柠黄眼亮起
//   1.407  pov      HAL 鱼眼看她凑近，逐词对口型（原版）；招牌 I / SEE / SPARKS / OF 在鱼眼圆外
//   3.677  eye      A-G-I 三拍点亮镜片环、倒影浮现（原版）；眼睛两侧 A / G / I、IN / YOUR / EYES 六块小招牌
//   5.263  reflect  推到镜片上，倒影里她眨眼、笑（原版，到 5.88 为止）
//   5.880  barrel   镜筒（新）：镜头穿过前镜片往机器里退，一镜到底。她隔着玻璃唱 → 凑上来一只眼被放大到铺满 →
//                   退过光圈、糊成光斑 → 10.66 DROP：合焦 + 上下颠倒 → 13.16 退过传感器，成了一面像素墙 →
//                   servant：读出线从上往下扫，方块一行行掉下去
//  14.600  box      shots/v4-01-box.js：方块倒进摊开的盒子、拼回 3D 的她 → Chat-G-P-T 四面墙砸上 → 盖子合严
// 所有 update 都是 T 的纯函数。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { makeV401Box } from './v4-01-box.js';
import { makeV401Net } from './v4-01-net.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIO = p => { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2; };
const col = c => new THREE.Color(c);
const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k);
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function pchip(keys, t) {
  const n = keys.length;
  if (t <= keys[0][0]) return keys[0][1]; if (t >= keys[n - 1][0]) return keys[n - 1][1];
  const d = []; for (let i = 0; i < n - 1; i++) d.push((keys[i + 1][1] - keys[i][1]) / (keys[i + 1][0] - keys[i][0]));
  const m = keys.map((_, i) => i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : 2 * d[i - 1] * d[i] / (d[i - 1] + d[i]));
  let i = 0; while (t > keys[i + 1][0]) i++;
  const h = keys[i + 1][0] - keys[i][0], s = (t - keys[i][0]) / h, s2 = s * s, s3 = s2 * s;
  return (2 * s3 - 3 * s2 + 1) * keys[i][1] + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * keys[i + 1][1] + (s3 - s2) * h * m[i + 1];
}
const FONT = '"UIAnton", "Anton", Impact, sans-serif';

// ================================================================ 她：整张关键画（抠白底）—— 同原版
const IMG_DIR = new URL('../../cast-cyber-girl/closeup/final/', import.meta.url);
const SING_DIR = new URL('../../cast-cyber-girl/closeup/sing/', import.meta.url);      // #1038：开头鱼眼里她对着镜头唱歌的那一套（手按胸口、嘴型和眉眼随词变）
const NAMES = ['neutral', 'smile', 'surprised', 'eyes-closed', 'eyes-half', 'mouth-a', 'mouth-e', 'mouth-i', 'mouth-o', 'mouth-u'];
async function keyed(name, dir = IMG_DIR) {
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

// ================================================================ 霓虹招牌（跑酷段那种：墨底 + 灯管边 + 白字）。一块牌一张贴图；lit(k, flash) 调亮度
function makePlate(text, color, height) {
  const c = document.createElement('canvas'), g0 = c.getContext('2d'); g0.font = `170px ${FONT}`;
  const tw = Math.ceil(g0.measureText(text).width); c.width = tw + 110; c.height = 270;
  const g = c.getContext('2d');
  g.fillStyle = '#0d0c14'; g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = color; g.lineWidth = 16; g.strokeRect(8, 8, c.width - 16, c.height - 16);
  g.fillStyle = '#F2EDE4'; g.font = `170px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, c.width / 2, c.height / 2 + 8);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const mat = new THREE.MeshBasicMaterial({ map: tex }), w = height * c.width / c.height;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, height), mat);
  return { mesh, w, h: height, at: null, dim: false,
    show(T) {                                          // dim = 没唱到时也摆着（暗的灯管），唱到那一刻亮；否则唱到才出现
      const a = T - this.at; mesh.visible = a >= 0 || this.dim;
      if (a >= 0) { mat.color.setScalar(1.15 + 1.6 * Math.exp(-a / 0.3)); mesh.scale.setScalar(lerp(0.9, 1, eOut(a / 0.1))); } else { mat.color.setScalar(0.3); mesh.scale.setScalar(0.9); }
    } };
}

// ================================================================ 舱室材质：假 AO（边角压暗）+ 薄荷色接缝线
function aoTex(base, k = 0.3, { stripe = false } = {}) {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0, 0, 256, 256);
  const edge = (x0, y0, x1, y1) => { const gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, `rgba(0,0,6,${k})`); gr.addColorStop(1, 'rgba(0,0,6,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); };
  edge(0, 0, 0, 60); edge(0, 256, 0, 196); edge(0, 0, 50, 0); edge(256, 0, 206, 0);
  if (stripe) { g.fillStyle = 'rgba(95,227,192,0.30)'; for (let y = 32; y < 256; y += 64) g.fillRect(0, y, 256, 2); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// ================================================================ HAL 的眼：镜片着色器（原版；金属外圈压成深枪灰，去掉后段用的光圈 / 星门）
function makeLensMaterial(U) {
  return new THREE.ShaderMaterial({
    uniforms: U,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform vec3 uRing, uLemon; uniform float uCore, uRefl, uReflScale; uniform sampler2D uFace; varying vec2 vUv;
      void main(){
        vec2 p = vUv * 2.0 - 1.0; float r = length(p), a = atan(p.y, p.x);
        vec3 c;
        if (r > 0.8) {                                                 // 金属外圈：深枪灰
          float br = 0.085 + 0.07 * cos(a - 2.2) + 0.014 * sin(a * 90.0);
          c = vec3(br) * vec3(0.92, 0.94, 1.0) * smoothstep(1.0, 0.97, r) * (0.75 + 0.25 * smoothstep(0.8, 0.86, r));
        } else {
          vec2 q = p / 0.8; float rq = length(q);
          c = vec3(0.012, 0.01, 0.016) + vec3(0.03) * (1.0 - rq);
          float r1 = exp(-pow((rq - 0.78) / 0.02, 2.0)), r2 = exp(-pow((rq - 0.55) / 0.018, 2.0)), r3 = exp(-pow((rq - 0.34) / 0.016, 2.0));
          c += vec3(0.12) * (r1 + r2 + r3);
          c += uLemon * (r1 * uRing.x + r2 * uRing.y + r3 * uRing.z) * 2.2 * (1.0 - 0.7 * uRefl);
          float core = smoothstep(0.2, 0.0, rq);
          c += uLemon * (core * 3.4 + exp(-rq * 5.0) * 0.9) * uCore;
          c += vec3(1.0, 0.55, 0.2) * smoothstep(0.07, 0.0, rq) * uCore * 2.0;
          vec2 s = q * (1.0 - 0.28 * rq * rq) / uReflScale;             // 倒影（凸面镜：球面压缩 + 左右镜像）
          vec2 fu = vec2(0.5 - s.x * 0.44, 0.63 + s.y * 0.44 * 0.6667);
          vec4 f = texture2D(uFace, fu);
          float inside = step(0.0, fu.x) * step(fu.x, 1.0) * step(0.0, fu.y) * step(fu.y, 1.0);
          vec3 fc = f.rgb * mix(vec3(1.0), vec3(1.0, 0.82, 0.9), 0.35);
          float fa = f.a * uRefl * inside * smoothstep(1.0, 0.88, rq);
          c = mix(c, fc * 0.9 + c * 0.25, fa);
          vec2 h1 = q - vec2(-0.32, 0.42); float hl = smoothstep(0.2, 0.0, length(h1 * vec2(1.0, 2.2)));
          vec2 h2 = q - vec2(0.36, -0.46); float hl2 = smoothstep(0.1, 0.0, length(h2 * vec2(1.0, 1.8)));
          c += vec3(1.0, 0.92, 0.96) * (hl * 0.55 + hl2 * 0.25);
        }
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
}

// ================================================================ 长廊（原版的几何和布局；材质换成深色舱板 + 霓虹灯带）
function buildHall({ HW = 2.0, HH = 3.0, BAY = 2.4, NB = 10, lensMat, flareTex }) {
  const scene = new THREE.Scene(); scene.background = col('#06060b');
  const LEN = BAY * NB;
  const wallTex = aoTex('#2b2d4a', 0.45, { stripe: true }), ceilTex = aoTex('#1f2038', 0.5), floorTex = aoTex('#24263f', 0.35);
  const wallM = new THREE.MeshLambertMaterial({ map: wallTex, side: THREE.DoubleSide });
  const ceilM = new THREE.MeshLambertMaterial({ map: ceilTex, side: THREE.DoubleSide });
  const ribM = new THREE.MeshLambertMaterial({ color: col('#34365a'), side: THREE.DoubleSide });
  const floorM = new THREE.MeshLambertMaterial({ map: floorTex, transparent: true, opacity: 0.8, depthWrite: true, side: THREE.DoubleSide });
  const seamM = new THREE.MeshBasicMaterial({ color: hdr(PAL.mint, 0.16) });
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
    const rib = new THREE.Group(); rib.position.z = z0 - 0.02; hall.add(rib);
    const rb = (w, h, x, y, m = ribM, d = 0.18) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, 0); rib.add(o); };
    rb(HW * 2, 0.22, 0, HH - 0.11); rb(0.22, HH, -HW + 0.11, HH / 2); rb(0.22, HH, HW - 0.11, HH / 2);
    rb(HW * 2 - 0.44, 0.008, 0, HH - 0.226, seamM, 0.2); rb(0.008, HH - 0.22, -HW + 0.226, HH / 2 - 0.11, seamM, 0.2); rb(0.008, HH - 0.22, HW - 0.226, HH / 2 - 0.11, seamM, 0.2);   // 肋框内沿一圈薄荷细线
    const lampM = new THREE.MeshBasicMaterial({ color: col('#1c1924') }), stripM = new THREE.MeshBasicMaterial({ color: col('#1c1924') });
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, len * 0.74), lampM); lamp.position.set(0, HH - 0.04, zc); hall.add(lamp);            // 顶上一根灯管（原版是一块灯板）
    for (const s of [-1, 1]) { const st = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, len * 0.9), stripM); st.position.set(s * (HW - 0.06), 0.05, zc); hall.add(st); }   // 地脚灯带
    const pl = new THREE.PointLight(col('#ff6fb0'), 0, HW * 3, 1.8); pl.position.set(0, HH - 0.5, zc); scene.add(pl);
    bays.push({ i: bays.length, zc, lampM, stripM, pl });
  };
  for (let i = 0; i < NB; i++) addBay(-i * BAY, BAY, true);
  addBay(2.4, 2.4, false);
  const ew = new THREE.Mesh(new THREE.PlaneGeometry(HW * 2, HH), wallM); ew.position.set(0, HH / 2, 2.4); ew.rotation.y = Math.PI; hall.add(ew);
  const endWall = new THREE.Mesh(new THREE.PlaneGeometry(HW * 2, HH), wallM); endWall.position.set(0, HH / 2, -LEN); hall.add(endWall);
  const panel = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.5, 0.08), ribM); panel.position.set(0, 1.6, -LEN + 0.04); hall.add(panel);
  const eyePos = V(0, 1.72, -LEN + 0.1);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.26, 96), lensMat); lens.position.copy(eyePos); hall.add(lens);
  const tubeM = new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 0.2) });                                    // 压圈外一圈柠黄灯管（眼亮了它才亮）
  const tube = new THREE.Mesh(new THREE.TorusGeometry(0.285, 0.008, 10, 96), tubeM); tube.position.copy(eyePos); hall.add(tube);
  const eyeLight = new THREE.PointLight(col(PAL.lemon), 0, 3.5, 2); eyeLight.position.copy(eyePos).add(V(0, 0, 0.6)); scene.add(eyeLight);
  const flare = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), new THREE.MeshBasicMaterial({ map: flareTex, color: col(PAL.lemon), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  flare.position.copy(eyePos).add(V(0, 0, 0.03)); hall.add(flare);
  const mirror = hall.clone(); mirror.scale.y = -1; scene.add(mirror);                                          // 地面反射
  return { scene, hall, bays, amb, eyePos, eyeLight, flare, lens, tubeM, LEN, HW, HH };
}

// opts.line3：第三句（There was a sudden drop in your training loss，9.52–12.75）的演法
//   'flip'     合焦 + 上下颠倒（第一版；用户说表达不对）
//   'denoise'  降噪收敛：它眼里的她起初是错位的马赛克 + 噪点，drop 那拍全部归位、锐利到不真实，柠黄轮廓线把她描了一遍；LOSS 读数掉到 0
//   'predict'  预判：它对她的猜测（柠黄线稿）起初又慢又歪，drop 那拍严丝合缝对上，然后开始抢在她前面动、抢在她前面开口
// opts.box：false 时不挂 14.6 之后的关盒子（只渲镜筒段的片段时用，省加载）
export async function makeV401Final(mv, { line3: L3 = 'net', box: withBox = true } = {}) {   // line3：'net'（定稿：夜空的网，她不出现）；'flip' / 'denoise' / 'predict' 是被否掉的旧版，留着对照
  const renderer = mv.stage.renderer;
  const BEAT = mv.audio?.beat_period ?? 0.4545;
  const L = i => mv.lyrics.lines[i].words;
  const word = (i, s) => L(i).find(w => w.w.toLowerCase().startsWith(s.toLowerCase()));
  await new FontFace('UIAnton', `url(${new URL('../../../assets/fonts/anton/Anton-Regular.ttf', import.meta.url)})`).load().then(f => document.fonts.add(f));
  const TEX = Object.fromEntries(await Promise.all(NAMES.map(async n => [n, await keyed(n)])));
  // 口型：逐词 → 元音（整张换图）；AGI 按音节拆
  const VOW = { I: 'a', see: 'i', sparks: 'a', of: 'o', in: 'i', your: 'u', eyes: 'a', Your: 'u', circuits: 'u', make: 'e', me: 'i', 'nervous,': 'u',
    "that's": 'a', no: 'o', surprise: 'a', There: 'e', was: 'a', a: 'a', sudden: 'a', drop: 'o', training: 'e', 'loss,': 'o', now: 'a', "I'm": 'a', servant: 'e' };
  const SYL = [];
  for (const i of [0, 1, 2, 3, 4]) for (const w of L(i)) {
    if (w.w === 'AGI') { const k = (w.end - w.start) / 3; ['e', 'i', 'a'].forEach((v, j) => SYL.push([w.start + j * k, w.start + (j + 1) * k, v])); continue; }
    SYL.push([w.start, w.end, VOW[w.w] ?? 'a']);
  }
  // #1038 开头（1.41–5.88）：鱼眼里看到的是她对着镜头唱歌的特写。用唱歌那一套关键画（整张换图）：a / o / i / e / u 五个嘴型、rest（句间闭嘴带笑）、belt（闭眼唱长音）。
  //   缺哪张就退回旧的口型图（mouth-*），页面不会因为缺图挂掉。
  const SING = {};
  for (const [k, fb] of [['a', 'mouth-a'], ['o', 'mouth-o'], ['i', 'mouth-i'], ['e', 'mouth-e'], ['u', 'mouth-u'], ['rest', 'smile'], ['belt', 'mouth-a']]) {
    try { SING[k] = await keyed('sing-' + k, SING_DIR); } catch { SING[k] = TEX[fb]; console.info('唱歌关键画缺 sing-' + k + '，用 ' + fb + ' 顶'); }
  }
  const tLongEyes = L(0).find(w => w.w.toLowerCase().startsWith('eyes')).start;
  function singAt(T) {                                                   // 逐词（AGI 按音节）：前 78% 是这个词的嘴型，后面收成 rest；最后的长音 eyes 整段闭眼唱
    if (T >= tLongEyes) return T < 5.80 ? SING.belt : SING.rest;
    for (const [a, b, v] of SYL) if (T >= a && T < b) return (T - a) < Math.min(0.85 * (b - a), 0.8) ? SING[v] : SING.rest;
    return SING.rest;
  }
  const BLINKS = [2.05, 5.3, 6.75, 11.5];
  function faceAt(T, mood = 'neutral') {
    for (const b of BLINKS) if (T >= b && T < b + 0.12) return 'eyes-closed';
    for (const [a, b, v] of SYL) if (T >= a && T < b) return (T - a) < 0.72 * (b - a) ? `mouth-${v}` : mood;
    return mood;
  }

  // ---------------------------------------------------------------- 共用：镜片、光晕贴图
  const LU = { uRing: { value: new THREE.Vector3() }, uCore: { value: 0 }, uRefl: { value: 0 }, uFace: { value: TEX.neutral }, uLemon: { value: col(PAL.lemon) }, uReflScale: { value: 1 } };
  const lensMat = makeLensMaterial(LU);
  const flareTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.2, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c); })();
  const H = buildHall({ NB: 10, lensMat, flareTex });

  // ---------------------------------------------------------------- 她：2D 纸片（鱼眼监控里用）—— 原版
  const plateU = { map: { value: TEX.neutral }, uRim: { value: 1 }, uPink: { value: col(PAL.pink) } };
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.832, 1.248), new THREE.ShaderMaterial({
    uniforms: plateU, transparent: true, depthWrite: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform sampler2D map; uniform float uRim; uniform vec3 uPink; varying vec2 vUv;
      void main(){
        vec4 t = texture2D(map, vUv); float e = 0.0; vec2 d = vec2(0.012, 0.008);
        e += 1.0 - texture2D(map, vUv + vec2(d.x, 0.0)).a; e += 1.0 - texture2D(map, vUv - vec2(d.x, 0.0)).a;
        e += 1.0 - texture2D(map, vUv + vec2(0.0, d.y)).a; e += 1.0 - texture2D(map, vUv - vec2(0.0, d.y)).a;
        gl_FragColor = vec4(t.rgb * mix(vec3(1.0), vec3(1.0, 0.93, 0.95), 0.5) + uPink * clamp(e * 0.5, 0.0, 1.0) * uRim * 1.6, t.a);
      }`,
  }));
  plate.rotation.y = Math.PI; plate.visible = false; plate.renderOrder = 5; H.scene.add(plate);

  // ---------------------------------------------------------------- 鱼眼 pass（原版）+ 鱼眼圆外的四块招牌
  const rt = new THREE.WebGLRenderTarget(1920, 1080, { samples: 4, type: THREE.HalfFloatType });
  const fishU = { tSrc: { value: rt.texture }, uK: { value: 0.55 }, uFlash: { value: 0 }, uT: { value: 0 } };
  const fishScene = new THREE.Scene(), fishCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
  fishScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    uniforms: fishU, depthTest: false, depthWrite: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform sampler2D tSrc; uniform float uK, uFlash, uT; varying vec2 vUv;
      void main(){
        vec2 p = (vUv - 0.5) * vec2(1.7778, 1.0); float r = length(p), R = 0.62;
        vec2 s = p * (1.0 - uK + uK * (r * r) / (R * R) * 0.9);
        float ca = 0.004 + 0.012 * r * r; vec3 c;
        c.r = texture2D(tSrc, s * (1.0 + ca) / vec2(1.7778, 1.0) + 0.5).r;
        c.g = texture2D(tSrc, s / vec2(1.7778, 1.0) + 0.5).g;
        c.b = texture2D(tSrc, s * (1.0 - ca) / vec2(1.7778, 1.0) + 0.5).b;
        c *= 0.95 + 0.05 * sin(vUv.y * 6.2832 * 180.0);                         // 这是被拍下来的影像：很淡的扫描线（180 行）
        c *= 1.0 + 0.06 * smoothstep(0.06, 0.0, abs(fract(vUv.y + uT * 0.22) - 0.5));  // 一条慢慢往下滚的亮带
        c *= smoothstep(R, R - 0.1, r) * (0.8 + 0.2 * (1.0 - r / R));
        c += vec3(0.035, 0.032, 0.06) * smoothstep(R - 0.05, R + 0.02, r);      // 镜头外：暗舱壁
        c += vec3(1.0, 0.95, 0.6) * uFlash * exp(-r * 3.0);
        gl_FragColor = vec4(c, 1.0);
      }`,
  })));
  const povSigns = [['I', 'I', -0.85, 0.17], ['SEE', 'see', -0.85, -0.17], ['SPARKS', 'sparks', 0.775, 0.17], ['OF', 'of', 0.85, -0.17]].map(([text, key, x, y]) => {
    const p = makePlate(text, PAL.pink, 1); p.at = word(0, key).start;
    p.dim = true; const hp = 156, wp = hp * p.w;                                    // 屏幕像素（1920×1080 下）；正交相机的 x 一个单位 = 960 px、y 一个单位 = 540 px
    const holder = new THREE.Group(); holder.position.set(x, y, -0.5); holder.scale.set(wp / 960, hp / 540, 1); p.mesh.geometry = new THREE.PlaneGeometry(1, 1); holder.add(p.mesh); p.mesh.renderOrder = 3; p.mesh.material.depthTest = false; fishScene.add(holder);
    return p;
  });
  // REC：鱼眼圆里左上的一个小红点 + REC 三个字（后面舞台大屏的 2D 唱歌特写会呼应它）。只有这一个界面元素
  const recDot = new THREE.Mesh(new THREE.CircleGeometry(1, 24), new THREE.MeshBasicMaterial({ color: hdr('#ff2a3a', 1.6), depthTest: false })); recDot.scale.set(16 / 960, 16 / 540, 1); recDot.position.set(-0.455, 0.70, -0.5); recDot.renderOrder = 4; fishScene.add(recDot);
  { const c = document.createElement('canvas'); c.width = 256; c.height = 96; const g = c.getContext('2d'); g.fillStyle = '#F2EDE4'; g.font = `84px ${FONT}`; g.textBaseline = 'middle'; g.fillText('REC', 6, 52);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthTest: false, opacity: 0.85 }));
    m.scale.set(60 * 256 / 96 / 960, 60 / 540, 1); m.position.set(-0.455 + (16 + 14 + 80) / 960, 0.70, -0.5); m.renderOrder = 4; fishScene.add(m); }
  function fish(scene, camera, T, flash = 0) {
    const prev = renderer.getRenderTarget(); renderer.setRenderTarget(rt); renderer.setClearColor(col('#06060b'), 1); renderer.clear(); renderer.render(scene, camera); renderer.setRenderTarget(prev);
    fishU.uFlash.value = flash;
    return { scene: fishScene, camera: fishCam };
  }

  // ---------------------------------------------------------------- 眼睛两侧的小招牌（eye 镜头）+ reflect 镜头里的 EYES
  const E = H.eyePos;
  const agi = word(0, 'AGI'), tA = agi.start, tAGI = [0, 1, 2].map(j => tA + j * (agi.end - tA) / 3);
  const tSparks = word(0, 'sparks').start, tEyes = word(0, 'eyes').start;
  const cam = new THREE.PerspectiveCamera(50, 16 / 9, 0.02, 3000); H.scene.add(cam);
  // 挂在镜头前 1 m 处：(xpx, ypx) = 1920×1080 画面里的中心位置，hpx = 牌高；fov 要和用它的镜头一致
  const hud = (p, fov, xpx, ypx, hpx) => { const u = 2 * Math.tan(fov * Math.PI / 360) / 1080, g = new THREE.Group(); g.position.set((xpx - 960) * u, (540 - ypx) * u, -1); g.scale.setScalar(hpx * u / p.h); g.add(p.mesh); cam.add(g); p.dim = true; p.mesh.material.depthTest = false; p.mesh.renderOrder = 9; return p; };
  const eyeSigns = [['A', tAGI[0], 215, 350, PAL.lemon], ['G', tAGI[1], 215, 540, PAL.lemon], ['I', tAGI[2], 215, 730, PAL.lemon], ['IN', word(0, 'in').start, 1705, 350, PAL.pink], ['YOUR', word(0, 'your').start, 1705, 540, PAL.pink], ['EYES', tEyes, 1705, 730, PAL.pink]].map(([text, at, x, y, c]) => {
    const p = makePlate(text, c, 1); p.at = at; return hud(p, 32, x, y, 168);
  });
  const eyesCorner = makePlate('EYES', PAL.pink, 1); eyesCorner.at = tEyes; hud(eyesCorner, 30, 1715, 960, 160);

  // ---------------------------------------------------------------- 灯（节拍同原版）
  const BAY_ON = i => 0.238 + i * 0.092, EYE_ON = 0.238 + 2 * BEAT;
  function lights(T) {
    for (const b of H.bays) {
      const k = T - BAY_ON(b.i), lit = k < 0 ? 0 : (k < 0.05 ? 1.6 : 1);
      b.lampM.color.set(lit ? PAL.pink : '#1c1924').multiplyScalar(lit ? 2.0 * lit : 1);
      b.stripM.color.set(lit ? PAL.pink : '#1c1924').multiplyScalar(lit ? 2.3 * lit : 1);
      b.pl.intensity = 2.4 * lit;
    }
    H.amb.intensity = lerp(0.3, 1.25, smooth((T - 0.238) / 1.0));
    const e = T < EYE_ON ? 0 : smooth((T - EYE_ON) / 0.25) * (1 + 0.6 * Math.exp(-(T - EYE_ON) * 5));
    LU.uCore.value = e; H.eyeLight.intensity = 1.2 * e; H.flare.material.opacity = 0.7 * e; H.flare.scale.setScalar(0.8 + 0.35 * e);
    H.tubeM.color.copy(hdr(PAL.lemon, 0.15 + 1.7 * Math.min(1, e)));
    LU.uRing.value.set(...tAGI.map(t => T >= t ? 1 + 0.8 * Math.exp(-(T - t) * 8) : 0));
  }
  const place = (p, look, fov) => { cam.fov = fov; cam.position.copy(p); cam.up.set(0, 1, 0); cam.lookAt(look); cam.updateProjectionMatrix(); };
  const post = (x = {}) => ({ bloom: { strength: 0.8, threshold: 0.95, radius: 0.8 }, chroma: 0.05, ...x, grade: { vignette: 0.3, ...(x.grade || {}) } });
  const hideAll = () => { plate.visible = false; LU.uRefl.value = 0; LU.uReflScale.value = 1; for (const s of eyeSigns) s.mesh.visible = false; eyesCorner.mesh.visible = false; };
  const shots = [];
  const shot = (id, t0, t1, fn) => shots.push({ id, t0, t1, transitionIn: { kind: 'cut' }, build: () => ({}), update: (S, T) => { hideAll(); return fn(T); } });

  // ================================================================ 0–5.88（构图 / 机位 / 节拍 / 脸同原版）
  shot('wake', 0, 1.407, T => {
    lights(T);
    H.flare.scale.setScalar(2.2 + 1.2 * LU.uCore.value); H.flare.material.opacity = Math.min(1, LU.uCore.value);
    place(V(0, 1.62, 1.5 - 0.5 * eIO(T / 1.41)), V(0, 1.62, -H.LEN), lerp(44, 36, eIO(T / 1.41)));
    return { scene: H.scene, camera: cam, post: post() };
  });
  shot('pov', 1.407, tA, T => {
    lights(T);
    const u = (T - 1.407) / (tA - 1.407);
    plate.visible = true; plateU.map.value = singAt(T);
    const ph = (T - 0.238) / BEAT, bob = Math.abs(Math.sin(Math.PI * ph)), sway = Math.sin(Math.PI * ph / 2);     // 身体随拍律动：每拍沉一下，两拍左右摆一个来回
    const dist = lerp(1.34, 1.0, eIO(clamp(u * 1.2))) - 0.03 * bob;                              // 不再凑上来打量：站在镜头前唱，只慢慢近一点
    plate.position.set(0.045 * sway, E.y - 0.27 - 0.022 * bob, E.z + dist);      // 比原来站得远一点、整体抬高一点：按在胸口的手也在画里 plate.rotation.set(0, Math.PI, 0.045 * sway);
    recDot.visible = (T * 1.1) % 1 < 0.62; fishU.uT.value = T;
    place(V(0, E.y, E.z + 0.02), V(0, E.y - 0.05, 0), 70);
    for (const s of povSigns) s.show(T);
    const o = fish(H.scene, cam, T, T > tSparks ? 0.35 * Math.exp(-(T - tSparks) * 6) : 0);
    return { ...o, post: post({ chroma: 0.08 + (T > tSparks ? 0.4 * Math.exp(-(T - tSparks) * 5) : 0), bloom: { strength: 0.55, threshold: 1.2, radius: 0.7 } }) };
  });
  shot('eye', tA, tEyes, T => {
    lights(T); const u = (T - tA) / (tEyes - tA);
    LU.uFace.value = singAt(T); LU.uRefl.value = lerp(0.12, 0.55, smooth(u)); LU.uReflScale.value = 1.25;
    H.flare.material.opacity *= 0.3; H.eyeLight.intensity *= 0.4;
    for (const s of eyeSigns) s.show(T);
    place(V(0, E.y, E.z + lerp(1.35, 1.0, eIO(u))), E, 32);
    return { scene: H.scene, camera: cam, post: post({ bloom: { strength: 0.6, threshold: 1.2, radius: 0.7 } }) };
  });
  const T_BARREL = 5.88;
  shot('reflect', tEyes, T_BARREL, T => {
    lights(T);
    LU.uFace.value = singAt(T); LU.uRefl.value = 0.9;                       // 倒影里的她也在唱（eyes 的长音） LU.uReflScale.value = lerp(1.0, 0.86, eIO((T - tEyes) / 1.3));
    LU.uCore.value *= 0.25; H.eyeLight.intensity *= 0.3; H.flare.material.opacity *= 0.2;
    eyesCorner.show(T);
    place(V(0, E.y, E.z + lerp(0.62, 0.5, eIO((T - tEyes) / 1.34))), E, 30);
    return { scene: H.scene, camera: cam, post: post({ bloom: { strength: 0.45, threshold: 1.3, radius: 0.6 } }) };
  });

  // ================================================================ 5.88–14.6 镜筒
  const T_BOX = 14.6;
  // ---- 「玻璃外面」的画面：暗长廊背景 + 她的整张脸，画到一张贴图上；每片玻璃拿它做各自的光学变形
  const viewRT = new THREE.WebGLRenderTarget(1024, 1024, { samples: 4 }); viewRT.texture.generateMipmaps = true; viewRT.texture.minFilter = THREE.LinearMipmapLinearFilter; viewRT.texture.colorSpace = THREE.SRGBColorSpace;
  const viewScene = new THREE.Scene(), viewCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10); viewCam.position.z = 5;
  { const c = document.createElement('canvas'); c.width = c.height = 1024; const g = c.getContext('2d');
    g.fillStyle = '#0d0e18'; g.fillRect(0, 0, 1024, 1024);
    for (let i = 7; i >= 1; i--) { const s = 60 + i * i * 9 + i * 34; g.fillStyle = i % 2 ? '#1b1c30' : '#151626'; g.fillRect(512 - s, 470 - s * 0.62, 2 * s, 2 * s * 0.62); g.strokeStyle = 'rgba(95,227,192,.4)'; g.lineWidth = 2; g.strokeRect(512 - s, 470 - s * 0.62, 2 * s, 2 * s * 0.62); }
    const neon = (x0, y0, x1, y1, color, w) => { for (const [lw, blur, a] of [[w * 2.4, 26, 0.5], [w, 10, 1], [w * 0.35, 0, 1]]) { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.strokeStyle = blur ? color : '#fff'; g.shadowColor = color; g.shadowBlur = blur; g.lineWidth = lw; g.globalAlpha = a; g.stroke(); } g.globalAlpha = 1; g.shadowBlur = 0; };
    neon(470, 500, 0, 960, PAL.pink, 8); neon(554, 500, 1024, 960, PAL.pink, 8); neon(400, 44, 624, 44, PAL.pink, 12);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const bg = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({ map: t })); viewScene.add(bg); }
  const viewFace = new THREE.Mesh(new THREE.PlaneGeometry(0.832, 1.248), new THREE.ShaderMaterial({ uniforms: plateU, transparent: true, depthWrite: false, vertexShader: plate.material.vertexShader, fragmentShader: plate.material.fragmentShader }));
  viewFace.position.z = 1; viewScene.add(viewFace);
  // predict 用：它「猜的她」—— 只有脸，单独画一张带透明的图，玻璃着色器里取边缘画成柠黄线稿
  const ghostRT = new THREE.WebGLRenderTarget(1024, 1024, { samples: 4 }), ghostScene = new THREE.Scene();
  const ghostMat = new THREE.MeshBasicMaterial({ map: TEX.neutral, transparent: true }), ghostFace = new THREE.Mesh(new THREE.PlaneGeometry(0.832, 1.248), ghostMat); ghostScene.add(ghostFace);
  // 像素墙的颜色：同一个画面再画一张很小的图，每帧读回来
  const PX = 64, PY = 40, pixRT = new THREE.WebGLRenderTarget(PX, PY), pixBuf = new Uint8Array(PX * PY * 4);
  const pixCam = new THREE.OrthographicCamera(-0.72, 0.72, 0.45, -0.45, 0, 10); pixCam.position.z = 5;
  // 眼睛超近特写：千问生成的关键画（cast-cyber-girl/closeup/eye/eye-macro-1.png，用户 2026-10-01 批的）；读不到时退回下面程序画的那只
  const eyeProc = (() => { const c = document.createElement('canvas'); c.width = c.height = 1024; const g = c.getContext('2d');
    g.fillStyle = '#fbe3d2'; g.fillRect(0, 0, 1024, 1024);
    const sh = g.createLinearGradient(0, 0, 0, 1024); sh.addColorStop(0, 'rgba(122,74,46,.55)'); sh.addColorStop(0.2, 'rgba(240,190,170,.25)'); sh.addColorStop(0.75, 'rgba(255,150,150,0)'); sh.addColorStop(1, 'rgba(255,140,150,.3)'); g.fillStyle = sh; g.fillRect(0, 0, 1024, 1024);
    const lid = () => { g.beginPath(); g.moveTo(120, 560); g.bezierCurveTo(300, 250, 700, 230, 920, 470); g.bezierCurveTo(760, 800, 330, 820, 120, 560); g.closePath(); };
    g.save(); lid(); g.clip(); g.fillStyle = '#fffaf6'; g.fillRect(0, 0, 1024, 1024);
    const ir = g.createRadialGradient(520, 520, 20, 520, 520, 250); ir.addColorStop(0, '#3a1c0c'); ir.addColorStop(0.35, '#7a4420'); ir.addColorStop(0.8, '#a8612c'); ir.addColorStop(1, '#3a1e10'); g.fillStyle = ir; g.beginPath(); g.arc(520, 520, 250, 0, 7); g.fill();
    g.strokeStyle = 'rgba(40,18,6,.35)'; g.lineWidth = 3; for (let k = 0; k < 70; k++) { const a = k / 70 * 6.283; g.beginPath(); g.moveTo(520 + Math.cos(a) * 95, 520 + Math.sin(a) * 95); g.lineTo(520 + Math.cos(a) * 235, 520 + Math.sin(a) * 235); g.stroke(); }
    g.fillStyle = '#140a06'; g.beginPath(); g.arc(520, 520, 96, 0, 7); g.fill();
    g.strokeStyle = PAL.lemon; g.shadowColor = PAL.lemon; g.shadowBlur = 18; for (const [r, w] of [[40, 7], [66, 6], [88, 5]]) { g.lineWidth = w; g.beginPath(); g.arc(520, 520, r, 0, 7); g.stroke(); } g.shadowBlur = 0;   // 瞳孔里映着它那三圈环
    g.fillStyle = 'rgba(30,14,8,.35)'; g.fillRect(0, 0, 1024, 420);                                              // 上眼睑投在眼球上的影
    g.fillStyle = '#fff'; g.beginPath(); g.ellipse(430, 420, 58, 40, -0.5, 0, 7); g.fill(); g.beginPath(); g.arc(610, 615, 24, 0, 7); g.fill();
    g.restore();
    g.lineCap = 'round'; g.strokeStyle = '#2a1410'; g.lineWidth = 34; g.beginPath(); g.moveTo(110, 566); g.bezierCurveTo(300, 240, 700, 220, 932, 468); g.stroke();   // 上眼线
    g.lineWidth = 20; g.beginPath(); g.moveTo(932, 468); g.lineTo(985, 430); g.stroke(); g.lineWidth = 9; g.beginPath(); g.moveTo(250, 720); g.bezierCurveTo(450, 815, 660, 800, 800, 700); g.stroke();
    g.strokeStyle = '#6a3c24'; g.lineWidth = 30; g.beginPath(); g.moveTo(150, 250); g.bezierCurveTo(400, 110, 720, 110, 930, 230); g.stroke();   // 眉
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; })();

  const eyeTex = await (async () => {
    try { const img = new Image(); img.src = new URL('../../cast-cyber-girl/closeup/eye/eye-macro-1.png', import.meta.url).href; await img.decode();
      const t = new THREE.Texture(img); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.needsUpdate = true; return { tex: t, c: [0.505, 0.456], k: [0.5 * img.height / img.width, 0.5] }; }   // c = 瞳孔在图里的位置，k = 圆片半径对应的图上半宽 / 半高
    catch (e) { console.warn('眼睛特写图读不到，用程序画的眼', e); return { tex: eyeProc, c: [0.5, 0.5], k: [0.56, 0.56] }; }
  })();

  // ---- 镜筒场景：一根深色的筒 + 三道环（前镜片 / 第二片 / 光圈）+ 传感器（像素墙）
  const BS = new THREE.Scene(); BS.background = col('#04040a');
  const Z = { e1: 0, e2: 2.0, ap: 4.0, sn: 6.5 }, RG = 0.95;           // 沿光轴的位置（镜头从 z 小往 z 大退）；玻璃半径
  const camZ = T => pchip([[5.88, 0.55], [6.12, 1.6], [7.5, 1.9], [7.72, Z.e2], [7.97, Z.e2 + 1.6], [9.3, Z.e2 + 1.9], [9.52, Z.ap], [9.8, Z.ap + 1.6], [10.66, Z.ap + 1.75], [12.8, Z.ap + 2.2], [13.16, Z.sn + 0.7], [13.42, Z.sn + 1.75], [14.6, Z.sn + 2.1]], T);
  const tubeU = { uOpen: { value: 0 }, uSn: { value: Z.sn }, uLit: { value: 0 }, uPink: { value: col(PAL.pink) }, uMint: { value: col(PAL.mint) }, uLemon: { value: col(PAL.lemon) } };
  { const tube = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 22, 64, 1, true), new THREE.ShaderMaterial({
      uniforms: tubeU, side: THREE.BackSide,
      vertexShader: `varying vec2 vUv; varying float vZ, vY; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vZ = w.z; vY = w.y; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: /* glsl */`
        uniform float uLit, uOpen, uSn; uniform vec3 uPink, uMint, uLemon; varying vec2 vUv; varying float vZ, vY;
        float hash(float p){ return fract(sin(p * 91.345) * 47453.5453); }
        void main(){
          if (uOpen > 0.5 && vZ > uSn - 0.7 && vY < -0.3) discard;            // 传感器下面的筒壁是开的：方块从这里掉出去
          vec3 c = vec3(0.045, 0.047, 0.085) * (0.7 + 0.3 * sin(vUv.x * 6.2832 * 3.0));
          float ring = smoothstep(0.03, 0.0, abs(fract(vZ / 0.9) - 0.5) - 0.47); c *= 1.0 - 0.6 * ring;        // 一圈圈遮光环
          float n = 28.0, id = floor(vUv.x * n), f = fract(vUv.x * n);
          float line = smoothstep(0.07, 0.02, abs(f - 0.5)) * step(0.45, hash(id));
          vec3 lc = hash(id + 3.0) < 0.4 ? uPink : hash(id + 3.0) < 0.75 ? uMint : uLemon;
          float lit = smoothstep(0.0, 0.6, uLit - vZ + hash(id + 9.0) * 0.8);                                 // 灯线从前镜片那头朝里一路亮过去
          c += lc * line * mix(0.06, 1.5, lit);
          gl_FragColor = vec4(c, 1.0);
        }` }));
    tube.rotation.x = Math.PI / 2; tube.position.z = 6; BS.add(tube); }
  // 环形招牌：一片玻璃的压圈就是一块弯成环的招牌，字沿上弧（长句再用下弧）
  function ringSign(z, color, top, bottom = []) {
    const c = document.createElement('canvas'); c.width = c.height = 1024; const g = c.getContext('2d'), tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const R0 = RG, R1 = 1.3, mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true }), m = new THREE.Mesh(new THREE.RingGeometry(R0, R1, 128), mat); m.position.z = z + 0.01; BS.add(m);
    let last = null;
    const arc = (words, T, isBottom, px) => {
      const ri = R0 * px, ro = R1 * px, rm = (ri + ro) / 2, fs = (ro - ri) * 0.66; g.font = `${fs}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
      const chars = []; let total = 0; words.forEach((w, wi) => { for (const ch of w.text) { const cw = g.measureText(ch).width + 3; chars.push([ch, cw, w]); total += cw; } if (wi < words.length - 1) { chars.push([' ', fs * 0.38, w]); total += fs * 0.38; } });
      let a = isBottom ? Math.PI / 2 + total / rm / 2 : -Math.PI / 2 - total / rm / 2;
      for (const [ch, cw, w] of chars) { a += (isBottom ? -1 : 1) * cw / rm / 2; g.save(); g.translate(Math.cos(a) * rm, Math.sin(a) * rm); g.rotate(a + (isBottom ? -1 : 1) * Math.PI / 2);
        const on = T >= w.at; g.fillStyle = on ? '#F2EDE4' : 'rgba(242,237,228,0.17)'; if (on && T < w.at + 0.35) { g.shadowColor = color; g.shadowBlur = 26; } g.fillText(ch, 0, 2); g.shadowBlur = 0; g.restore(); a += (isBottom ? -1 : 1) * cw / rm / 2; }
    };
    return { m, draw(T) {
      const all = [...top, ...bottom], key = all.filter(w => T >= w.at).length * 2 + (all.some(w => T >= w.at && T < w.at + 0.35) ? 1 : 0) + Math.floor(T * 15) * 0;
      const k2 = `${key}|${all.filter(w => T >= w.at && T < w.at + 0.35).map(w => w.text).join()}`; if (k2 === last) return; last = k2;
      const px = 512 / R1, ri = R0 * px, ro = R1 * px;
      g.clearRect(0, 0, 1024, 1024); g.save(); g.translate(512, 512);
      g.fillStyle = '#0d0c14'; g.beginPath(); g.arc(0, 0, ro - 4, 0, Math.PI * 2); g.arc(0, 0, ri + 2, 0, Math.PI * 2, true); g.fill('evenodd');
      for (const rr of [ri + 7, ro - 9]) for (const [lw, blur] of [[9, 14], [3, 0]]) { g.beginPath(); g.arc(0, 0, rr, 0, Math.PI * 2); g.strokeStyle = blur ? color : '#fff'; g.shadowColor = color; g.shadowBlur = blur; g.lineWidth = lw; g.stroke(); } g.shadowBlur = 0;
      arc(top, T, false, px); if (bottom.length) arc(bottom, T, true, px);
      g.restore(); tex.needsUpdate = true;
    } };
  }
  const W = (i, a, b) => L(i).slice(a, b).map(w => ({ text: w.w.replace(/[,.]/g, '').toUpperCase(), at: w.start }));
  const rings = [ringSign(Z.e1, PAL.mint, W(1)), ringSign(Z.e2, PAL.lemon, W(2)), ringSign(Z.ap, PAL.pink, W(3, 0, 5), W(3, 5))];
  // 玻璃：拿 viewRT 做光学变形。uMode 0 = 前镜片（正像）· 1 = 第二片（放大到一只眼）· 2 = 光圈后（虚焦 → 合焦倒像）
  const glassU = { tView: { value: viewRT.texture }, tEye: { value: eyeTex.tex }, uEyeC: { value: new THREE.Vector2(...eyeTex.c) }, uEyeK: { value: new THREE.Vector2(...eyeTex.k) }, uMode: { value: 0 }, uZoom: { value: 1 }, uEyeMix: { value: 0 }, uBlur: { value: 0 }, uFlip: { value: 0 }, uPunch: { value: 0 }, uT: { value: 0 }, uEye: { value: new THREE.Vector2(0.58, 0.66) }, uC2: { value: new THREE.Vector2(0.5, 0.5) }, uZ2: { value: 1 },
    tGhost: { value: ghostRT.texture }, uVar: { value: L3 === 'denoise' ? 1 : L3 === 'predict' ? 2 : 0 }, uNoise: { value: 0 }, uSharp: { value: 0 }, uEdge: { value: 0 }, uSweep: { value: 0 }, uGhost: { value: 0 }, uLock: { value: 0 },
    uPink: { value: col(PAL.pink) }, uMint: { value: col(PAL.mint) }, uLemon: { value: col(PAL.lemon) } };
  const glass = new THREE.Mesh(new THREE.CircleGeometry(RG, 96), new THREE.ShaderMaterial({
    uniforms: glassU,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform sampler2D tView, tEye, tGhost; uniform vec2 uEye, uC2, uEyeC, uEyeK; uniform float uMode, uZoom, uEyeMix, uBlur, uFlip, uPunch, uT, uZ2, uVar, uNoise, uSharp, uEdge, uSweep, uGhost, uLock; uniform vec3 uPink, uMint, uLemon; varying vec2 vUv;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      float hex(vec2 p){ p = abs(p); return max(p.x * 0.866 + p.y * 0.5, p.y); }
      vec3 view(vec2 uv, float bias){ return texture2D(tView, clamp(uv, 0.002, 0.998), bias).rgb; }
      float lum(vec2 uv){ return dot(view(uv, 0.0), vec3(0.3, 0.59, 0.11)); }
      float gho(vec2 uv){ vec4 g = texture2D(tGhost, clamp(uv, 0.002, 0.998)); return mix(1.0, dot(g.rgb, vec3(0.3, 0.59, 0.11)), g.a); }
      void main(){
        vec2 p = vUv * 2.0 - 1.0; float r = length(p);
        vec2 q = p * (1.0 - 0.12 * r * r);                                // 玻璃的一点桶形畸变
        if (uFlip > 0.5) q = -q;
        vec3 c;
        if (uMode < 0.5) {
          float ca = 0.012 * r * r;
          c = vec3(view(q * 0.5 * (1.0 + ca) + 0.5, 0.0).r, view(q * 0.5 + 0.5, 0.0).g, view(q * 0.5 * (1.0 - ca) + 0.5, 0.0).b);
        } else if (uMode < 1.5) {
          vec3 a = view(uEye + q * 0.5 / uZoom, 0.0);                     // uEye = 她那只眼在 view 贴图里的位置
          vec3 b = texture2D(tEye, clamp(uEyeC + q * uEyeK, 0.0, 1.0)).rgb;
          c = mix(a, b, uEyeMix);
        } else {
          float ca = 0.02 * r * r * (0.3 + uBlur);
          vec2 h = q * 0.5 / uZ2;
          c = vec3(view(h * (1.0 + ca) + uC2, uBlur * 6.5).r, view(h + uC2, uBlur * 6.5).g, view(h * (1.0 - ca) + uC2, uBlur * 6.5).b);
          vec3 bk = vec3(0.0);                                            // 六边形光斑
          for (int i = 0; i < 9; i++) { float fi = float(i); vec2 o = vec2(hash(vec2(fi, 1.0)), hash(vec2(fi, 2.0))) * 1.5 - 0.75 + 0.03 * vec2(sin(uT * 1.3 + fi), cos(uT * 1.1 + fi * 2.0));
            float s = 0.16 + 0.14 * hash(vec2(fi, 3.0)); float h = smoothstep(s, s - 0.02, hex(p - o));
            vec3 pc = fi < 3.0 ? uPink : fi < 5.0 ? uMint : fi < 7.0 ? uLemon : vec3(1.0); bk += pc * h * 0.22; }
          c += bk * uBlur;
          vec2 uvc = h + uC2;
          if (uVar > 0.5 && uVar < 1.5) {                                 // 降噪收敛：错位的马赛克 + 噪点（uNoise）→ 归位、锐化（uSharp）、柠黄轮廓线从上往下描一遍（uEdge / uSweep）
            float ep = floor(uT * 8.0); vec2 g = floor(uvc * 9.0);
            vec2 u2 = uvc + (vec2(hash(g + ep), hash(g + ep + 17.0)) - 0.5) * 0.42 * uNoise;
            float cell = mix(1.0 / 1024.0, 1.0 / 46.0, uNoise); u2 = (floor(u2 / cell) + 0.5) * cell;
            c = vec3(view(u2 + vec2(0.02, 0.0) * uNoise, 0.0).r, view(u2, 0.0).g, view(u2 - vec2(0.02, 0.0) * uNoise, 0.0).b);
            c = mix(c, vec3(hash(floor(vUv * 230.0) + ep * 3.1)) * vec3(1.0, 0.95, 0.8), 0.5 * uNoise);
            c += (c - view(uvc, 2.2)) * 1.1 * uSharp;
            float d = 1.6 / 1024.0 / uZ2, e = smoothstep(0.05, 0.2, abs(lum(uvc + vec2(d, 0.0)) - lum(uvc - vec2(d, 0.0))) + abs(lum(uvc + vec2(0.0, d)) - lum(uvc - vec2(0.0, d))));
            float sw = smoothstep(uSweep + 0.02, uSweep - 0.02, -p.y);
            c = mix(c, uLemon * 1.7, e * uEdge * sw);
            c += uLemon * 1.4 * smoothstep(0.035, 0.0, abs(-p.y - uSweep)) * step(-1.05, uSweep) * step(uSweep, 1.05);
          } else if (uVar > 1.5) {                                        // 预判：它猜的她（tGhost）画成柠黄线稿叠在她身上；没对上之前（uLock = 0）是断断续续的虚线
            float d = 1.8 / 1024.0 / uZ2, e = smoothstep(0.07, 0.26, abs(gho(uvc + vec2(d, 0.0)) - gho(uvc - vec2(d, 0.0))) + abs(gho(uvc + vec2(0.0, d)) - gho(uvc - vec2(0.0, d))));
            float dash = mix(step(0.25, hash(floor(uvc * 40.0) + floor(uT * 10.0))), 1.0, uLock);
            c = mix(c, uLemon * 1.9, e * dash * uGhost);
            c += uLemon * 0.035 * texture2D(tGhost, clamp(uvc, 0.002, 0.998)).a * uGhost;
          }
          c *= 1.0 + uPunch * 0.9;
          float hm = smoothstep(0.92, 0.9, hex(p * mat2(0.966, -0.259, 0.259, 0.966)));   // 六片光圈叶片围出的六边形
          c *= hm;
        }
        c *= smoothstep(1.0, 0.86, r) * 0.25 + 0.75;
        c += vec3(1.0) * smoothstep(0.035, 0.0, abs(r - 0.9)) * smoothstep(0.5, 1.0, -p.x * 0.6 + p.y * 0.8) * 0.5;   // 玻璃边上一弯高光
        gl_FragColor = vec4(c, 1.0);
      }` }));
  BS.add(glass);
  // 传感器：像素墙（一块块小方块）+ 读出线 + 墙下的长条招牌
  const WALL = { w: 2.4, h: 1.5, y: 0.36 }, CW = WALL.w / PX, CH = WALL.h / PY;
  const cubes = new THREE.InstancedMesh(new THREE.BoxGeometry(CW * 0.86, CH * 0.86, CW * 0.5), new THREE.MeshBasicMaterial({ color: '#ffffff' }), PX * PY); cubes.frustumCulled = false; cubes.position.z = Z.sn; BS.add(cubes);
  const backing = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshBasicMaterial({ color: '#04040a' })); backing.position.z = Z.sn - 0.2; BS.add(backing);
  const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(WALL.w + 0.16, WALL.h + 0.16)), new THREE.LineBasicMaterial({ color: hdr(PAL.mint, 1.4) })); frame.position.set(0, WALL.y, Z.sn); BS.add(frame);
  const scan = new THREE.Mesh(new THREE.PlaneGeometry(WALL.w + 0.3, 0.03), new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 2.4) })); scan.position.z = Z.sn + 0.15; BS.add(scan);
  const tServ = word(4, 'servant'), SCAN = [tServ.start + 0.05, tServ.end - 0.02];
  const servSigns = (() => {                         // 墙下两行：NOW I'M YOUR / SERVANT
    const ws = W(4, 0, 4).map(w => { const p = makePlate(w.text, PAL.mint, w.text === 'SERVANT' ? 0.5 : 0.42); p.at = w.at; return p; });
    const row = (list, y) => { const total = list.reduce((a, p) => a + p.w, 0) + 0.06 * (list.length - 1); let x = -total / 2; for (const p of list) { p.mesh.position.set(x + p.w / 2, y, Z.sn + 0.05); x += p.w + 0.06; BS.add(p.mesh); } };
    row(ws.slice(0, 3), WALL.y - WALL.h / 2 - 0.33); row(ws.slice(3), WALL.y - WALL.h / 2 - 0.84); return ws; })();
  const rowT = j => lerp(SCAN[0], SCAN[1], j / (PY - 1));               // 第 j 行（从上往下）被读出线扫到的时刻
  const _m = new THREE.Matrix4(), _c = new THREE.Color(), cubeHash = (() => { const r = mulberry32(8); return Array.from({ length: PX * PY }, () => r()); })();
  function drawWall(T) {
    renderer.readRenderTargetPixels(pixRT, 0, 0, PX, PY, pixBuf);
    for (let j = 0; j < PY; j++) for (let i = 0; i < PX; i++) {
      const k = j * PX + i, fall = Math.max(0, T - rowT(j) - cubeHash[k] * 0.06);
      const x = (i + 0.5) * CW - WALL.w / 2, y = WALL.y + WALL.h / 2 - (j + 0.5) * CH;
      _m.makeRotationX(fall * (3 + cubeHash[k] * 5)); _m.setPosition(x + (cubeHash[k] - 0.5) * fall * 0.5, y - 9 * fall * fall - 1.2 * fall, -0.02);      // 贴着墙面直直掉下去（不往镜头这边飘，不挡墙下的招牌）
      cubes.setMatrixAt(k, _m);
      const p = ((PY - 1 - j) * PX + i) * 4;                           // 读回来的图第 0 行在最下面
      cubes.setColorAt(k, _c.setRGB(pixBuf[p] / 255, pixBuf[p + 1] / 255, pixBuf[p + 2] / 255, THREE.SRGBColorSpace).multiplyScalar(1.05));
    }
    cubes.instanceMatrix.needsUpdate = true; cubes.instanceColor.needsUpdate = true;
  }
  const bcam = new THREE.PerspectiveCamera(75, 16 / 9, 0.02, 200); BS.add(bcam);
  const lossHud = (() => {
    const c = document.createElement('canvas'); c.width = 640; c.height = 220; const g = c.getContext('2d'), tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const u = 2 * Math.tan(75 * Math.PI / 360) / 1080, mat = new THREE.MeshBasicMaterial({ map: tex, depthTest: false }), m = new THREE.Mesh(new THREE.PlaneGeometry(640 / 220 * 150 * u, 150 * u), mat);
    m.position.set((300 - 960) * u, (540 - 930) * u, -1); m.renderOrder = 9; m.visible = false; bcam.add(m);
    let last = null;
    return { m, mat, draw(v) { const t = v.toFixed(2); if (t === last) return; last = t;
      g.fillStyle = '#0d0c14'; g.fillRect(0, 0, 640, 220); g.strokeStyle = PAL.lemon; g.lineWidth = 14; g.strokeRect(7, 7, 626, 206);
      g.fillStyle = 'rgba(242,237,228,.7)'; g.font = `74px ${FONT}`; g.textBaseline = 'middle'; g.textAlign = 'left'; g.fillText('LOSS', 34, 116);
      g.fillStyle = '#F2EDE4'; g.font = `150px ${FONT}`; g.textAlign = 'right'; g.fillText(t, 606, 120); tex.needsUpdate = true; } };
  })();
  const tDrop = word(3, 'drop').start, tNo = word(2, 'no').start, tSurp = word(2, 'surprise').start;
  shot('barrel', T_BARREL, T_BOX, T => {
    // ---- 玻璃外面的她
    const eyePhase = T >= 7.72 && T < 9.52, inverted = L3 === 'flip' && T >= tDrop, afterDrop = T >= tDrop;
    const moodAt = t => t < 6.5 ? 'smile' : t < 9.52 ? 'neutral' : L3 !== 'flip' && t < tDrop ? 'neutral' : t < 11.0 ? 'surprised' : t < 12.8 ? 'neutral' : 'eyes-half';
    const herAt = t => {                                                 // 她在 t 时刻的脸、位置、大小
      const lean = t >= 7.72 && t < 9.52 ? 1 : 0, fs = lerp(2.9, 2.6, smooth((t - 5.88) / 1.2)) + 0.3 * lean;
      let x = t > 6.6 && t < 7.6 ? 0.035 * Math.sin((t - 6.6) * 6.5) : 0;                                     // nervous：眼神左右瞟（整张脸小幅横移）
      if (L3 === 'predict') x += pchip([[10.66, 0], [11.2, 0], [11.5, -0.2], [11.95, -0.2], [12.3, 0.14], [12.7, 0.14], [13.0, 0]], t);   // drop 之后她往左躲一下、再晃回来 —— 幽灵每次都先到
      return { tex: t >= 7.72 && t < 9.52 ? 'neutral' : faceAt(t, moodAt(t)), fs, x: x + 0.01 * Math.sin(t * 1.7), y: -0.2 * fs + 0.012 * Math.sin(t * 2.3) };
    };
    const her = herAt(T), fs = her.fs;
    plateU.map.value = TEX[her.tex];
    viewFace.scale.setScalar(fs); viewFace.position.set(her.x, her.y, 1);
    glassU.uEye.value.set((viewFace.position.x + fs * 0.084 + 1) / 2, (viewFace.position.y + fs * 0.209 + 1) / 2);
    const prev = renderer.getRenderTarget();
    renderer.setRenderTarget(viewRT); renderer.setClearColor(col('#0d0e18'), 1); renderer.clear(); renderer.render(viewScene, viewCam);
    const z = camZ(T), onWall = T >= 13.16;
    if (L3 === 'predict' && !onWall && T > 9.4) {                         // 它猜的她：drop 之前慢半拍、位置大小都不对、表情乱猜；drop 之后 = 0.3 秒之后的她
      const lock = smooth((T - tDrop) / 0.08), g = herAt(T + lerp(-0.45, 0.4, lock)), wrong = ['mouth-o', 'eyes-closed', 'smile', 'mouth-a', 'surprised', 'eyes-half'][Math.floor(T * 5) % 6];
      ghostMat.map = TEX[afterDrop ? g.tex : wrong];
      ghostFace.scale.setScalar(g.fs * (1 + (1 - lock) * 0.13 * Math.sin(T * 2.7))); ghostFace.rotation.z = (1 - lock) * 0.13 * Math.sin(T * 1.9);
      ghostFace.position.set(g.x + (1 - lock) * 0.26 * Math.sin(T * 3.1), g.y + (1 - lock) * 0.14 * Math.cos(T * 2.3), 1);
      renderer.setRenderTarget(ghostRT); renderer.setClearColor(col('#000000'), 0); renderer.clear(); renderer.render(ghostScene, viewCam);
    }
    if (onWall) {                                                        // 像素墙：flip 版看到的是倒像，把小图倒着画；其他版是正的
      if (L3 === 'flip') { viewFace.rotation.z = Math.PI; viewFace.position.y = 0.36; } else viewFace.position.y = -0.35;
      viewFace.position.x = 0; viewFace.scale.setScalar(1.75);
      renderer.setRenderTarget(pixRT); renderer.clear(); renderer.render(viewScene, pixCam); viewFace.rotation.z = 0;
    }
    renderer.setRenderTarget(prev);
    // ---- 这一刻面前是哪片玻璃
    const el = z < Z.e2 + 0.04 ? 0 : z < Z.ap + 0.04 ? 1 : 2;      // 过了这片玻璃 4 cm 才换（正好贴在玻璃上那一帧会被近裁面切掉，露出后面的黑洞）
    glass.visible = !onWall; glass.position.z = [Z.e1, Z.e2, Z.ap][el];
    glassU.uMode.value = el; glassU.uT.value = T;
    glassU.uZoom.value = lerp(1.6, 7.5, eIO((T - 7.72) / 0.75)); glassU.uEyeMix.value = smooth((T - 8.05) / 0.3);
    const dive = L3 === 'net' ? 1 + 13 * clamp((T - 9.2) / 0.32) ** 2.5 : 1;                 // net：这句结束前朝瞳孔推进去，瞳孔撑满整片玻璃 → 9.52 从瞳孔里穿出到夜空
    glassU.uEyeK.value.set(eyeTex.k[0] / dive, eyeTex.k[1] / dive);
    glassU.uBlur.value = L3 !== 'flip' ? 0 : inverted ? Math.max(0, 1 - (T - tDrop) / 0.1) : smooth((T - 9.5) / 0.25);
    glassU.uFlip.value = inverted ? 1 : 0; glassU.uPunch.value = afterDrop ? Math.exp(-(T - tDrop) / 0.25) : 0;
    const dk = T - tDrop;
    if (L3 === 'denoise') {                                              // 「学得很慢」→ drop：0.1 秒内全部归位，再锐化、描轮廓
      glassU.uNoise.value = afterDrop ? Math.max(0, 1 - dk / 0.1) * 0.7 : lerp(1, 0.7, smooth((T - 9.6) / 1.0));
      glassU.uSharp.value = smooth(dk / 0.12); glassU.uSweep.value = afterDrop ? lerp(-1.1, 1.15, clamp((dk - 0.12) / 0.5)) : -2;
      glassU.uEdge.value = afterDrop ? lerp(1, 0.4, smooth((dk - 0.9) / 0.6)) : 0;
      lossHud.m.visible = T > 9.62 && T < 13.1;
      lossHud.draw(afterDrop ? 1.9 * Math.exp(-dk / 0.07) : 2.31 - 0.4 * smooth((T - 9.6) / 1.0) + 0.04 * Math.sin(T * 23));
      lossHud.mat.color.setScalar(1.1 + (dk > 0.3 ? 1.8 * Math.exp(-(dk - 0.3) / 0.3) : 0));
    } else lossHud.m.visible = false;
    if (L3 === 'predict') { glassU.uLock.value = smooth(dk / 0.08); glassU.uGhost.value = (afterDrop ? 0.85 + 0.5 * Math.exp(-dk / 0.2) : 0.9) * smooth((T - 9.55) / 0.3) * (1 - smooth((T - 12.95) / 0.15)); }
    // 光圈后这片：先停一会儿，再慢慢朝她的眼睛推进去（推到只剩一双眼，正好接上像素墙的第一帧）
    const zi = L3 === 'predict' ? eIO((T - 12.1) / 1.0) : eIO((T - 11.3) / 1.75); glassU.uZ2.value = lerp(1, L3 === 'predict' ? 2.4 : 2.7, zi);
    glassU.uC2.value.set(lerp(0.5, (viewFace.position.x + 1) / 2, zi), lerp(0.5, (viewFace.position.y + fs * 0.2 + 1) / 2, zi));
    tubeU.uOpen.value = T > SCAN[0] ? 1 : 0;
    rings.forEach((r, i) => { r.m.visible = !onWall && i <= el && [Z.e1, Z.e2, Z.ap][i] > z - 6; r.draw(T); });
    tubeU.uLit.value = lerp(-0.5, 16, smooth((T - 6.0) / 6.5));
    // ---- 像素墙
    cubes.visible = backing.visible = frame.visible = onWall; scan.visible = onWall && T > SCAN[0] - 0.15 && T < SCAN[1] + 0.1;
    for (const s of servSigns) { s.show(T); s.mesh.visible = s.mesh.visible && onWall; }
    if (onWall) { drawWall(T); scan.position.y = WALL.y + WALL.h / 2 - WALL.h * clamp((T - SCAN[0]) / (SCAN[1] - SCAN[0])); }
    // ---- 镜头：沿光轴后退；DROP 一沉；最后跟着掉下去的方块往下看
    const k = T - tDrop, jolt = k > 0 ? -0.16 * Math.exp(-k * 7) * Math.cos(k * 22) : 0;
    const down = smooth((T - (SCAN[1] - 0.25)) / 0.75);
    bcam.position.set(0, jolt, z); bcam.up.set(0, 1, 0); bcam.lookAt(0, jolt * 0.4 + (onWall ? WALL.y * 0.4 : 0) - 9 * down, z - 3 + 2.75 * down); bcam.fov = 75; bcam.updateProjectionMatrix();
    const flash = k > 0 ? 0.3 * Math.exp(-k * 14) : 0, lemonIn = L3 === 'net' ? 1 - smooth((T - 13.16) / 0.3) : 0;   // net：上一镜结束在满屏柠黄，像素墙从柠黄里显出来
    return { scene: BS, camera: bcam, post: post({ bloom: { strength: 0.6, threshold: 1.1, radius: 0.7 }, chroma: 0.06 + (k > 0 ? 0.7 * Math.exp(-k * 6) : 0), flash: lemonIn > 0 && onWall ? { amount: lemonIn, color: PAL.lemon } : { amount: L3 === 'net' ? 0 : flash, color: '#ffffff' }, grade: { vignette: 0.42 } }) };
  });

  // ================================================================ 14.6 起：关盒子
  if (L3 === 'net') {                                                   // 9.52–13.16 换成夜空的网；13.16 起还是镜筒这个镜头（像素墙）
    const barrel = shots.find(s => s.id === 'barrel'), zc = camZ(9.52), r0 = RG / ((zc - Z.e2) * Math.tan(75 * Math.PI / 360));
    const backRT = new THREE.WebGLRenderTarget(mv.width, mv.height, { type: THREE.HalfFloatType });
    const backdrop = () => {                                            // 镜筒在 9.52 前最后一刻的画面（不带后期），给夜空的网垫在入口光环外面
      const f = barrel.update({}, 9.515), prev = renderer.getRenderTarget();
      renderer.setRenderTarget(backRT); renderer.setClearColor(col('#04040a'), 1); renderer.clear(); renderer.render(f.scene, f.camera); renderer.setRenderTarget(prev);
      return backRT.texture;
    };
    shots.push(await makeV401Net(mv, { r0, backdrop }), { ...barrel, id: 'barrel-wall', t0: 13.16 });
  }
  if (withBox) shots.push(...await makeV401Box(mv, { from: T_BOX }));
  return shots;
}

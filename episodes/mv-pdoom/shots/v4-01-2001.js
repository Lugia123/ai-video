// shots/v4-01-2001.js — v4-01 正式版（歌曲 0–22.1 s）：方案 B「2001」（W3 #950）
//
//   const shots = await makeV4012001(mv);   mv.mount(shots, { offset: 0, duration: 22.1 });
//
// 只借《2001 太空漫游》的构图 / 调度（一点透视、左右对称、白色舱室 + 一种颜色的强光 + 一只圆眼），不复制原片画面、不用原片音乐。
// 一种电影语言：奶白 + 霓粉 + 一只柠黄眼；没有漫画字效、网格、别的风格。
//
// 她怎么在这个世界里：
//   · 脸只用整张关键画（cast-cyber-girl/closeup/final/*.png），口型 / 眨眼 = 整张换图（不分层 → 不会眼 / 嘴错位），白底载入时从四边泛洪抠掉；
//     只以世界里说得通的方式出现：HAL 的鱼眼监控画面（纸片站在真 3D 舱室里，整幅一起过鱼眼）、HAL 镜片里的倒影。
//   · 3D 的她只拍背影 / 远景（脸 ≤ 画高 4%），姿势（摊手 / 抛 / 敲门 / 仰头）用 dance3d solver 手摆 + 插值。
//
// 镜头（歌曲时间；切点在拍上或唱词起点）：
//   0.000  wake       舱室通电：对称白色长廊，粉灯从近到远一格格亮（第一拍起），第三拍 1.147 尽头的柠黄眼睛亮起
//   1.407  pov        HAL 鱼眼监控：她凑近镜头，I see sparks of（整张换图对口型），sparks 闪光
//   3.677  eye        眼睛特写：A-G-I 三拍各点亮一层镜片环，镜片里浮出她的倒影
//   5.263  reflect    eyes：推到镜片上，倒影占满：眨眼 → 惊讶 → 笑、脸红；Your circuits… 倒影里对口型
//   6.601  wide       对称大全景：3D 背影正对尽头的眼；nervous 7.04 灯闪、眼一缩、她后退半步
//   7.720  shrug      that's no surprise：HAL 鱼眼监控里，她站在长廊中间对镜头摊手（全身远景）
//   9.520  throw      骨头 → 卫星（只借调度）：低机位背影，她把一根发光的 loss 曲线抛上去，曲线在舱顶粉灯前翻转
//  10.660  dive       drop：硬切到太空，一艘白色飞船沿同一条曲线的轨道急降（程序化）
//  12.055  align      日月一线：行星边缘 + 柠黄的「日」+ 粉白的「月」在中线上对齐升起（AI 开窍）
//  12.965  door       舱门外：对称，她（背影）走到舱门前敲门，门上方是 HAL 的眼
//  13.874  servant    俯拍（HAL 从门上的眼往下看，鱼眼）：她在门外仰头，很小
//  14.783  boss       仰拍：从她脚边往上看门上的眼，镜片里映着很小的她；boss 15.66 眼一亮，门边小屏幕出现 BOSS
//  16.601  maw        眼睛充满画面：Chat-G-P-T 四拍，光圈叶片一片片打开像一张嘴，里面是星门；please 她的倒影（惊恐）浮现；
//                     eat 20.27 倒影被卷进瞳孔；镜头跟着冲进瞳孔 → 星门 slit-scan 隧道 → 22.055 冲出（薄荷闪白）接副歌 1

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { createGirl, createGirlLights } from '../kits/girl.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIn = p => clamp(p) ** 3;
const eIO = p => { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2; };
const col = c => new THREE.Color(c);
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function lerpSpec(a, b, p) {
  if (typeof a === 'number') return lerp(a, b ?? a, p);
  if (Array.isArray(a)) return a.map((x, i) => lerpSpec(x, b?.[i] ?? x, p));
  if (a && typeof a === 'object') { const o = {}; for (const k of new Set([...Object.keys(a), ...Object.keys(b || {})])) o[k] = a[k] == null ? b[k] : b?.[k] == null ? a[k] : lerpSpec(a[k], b[k], p); return o; }
  return a;
}

// ================================================================ 她：整张关键画（抠白底）
const IMG_DIR = new URL('../../cast-cyber-girl/closeup/final/', import.meta.url);
const NAMES = ['neutral', 'smile', 'surprised', 'eyes-closed', 'eyes-half', 'mouth-a', 'mouth-e', 'mouth-i', 'mouth-o', 'mouth-u'];
async function keyed(name) {
  const img = new Image(); img.src = new URL(`${name}.png`, IMG_DIR).href; await img.decode();
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

// ================================================================ 舱室材质：假 AO（边角压暗的画布贴图）
function aoTex(base = '#f4f1ec', k = 0.16, { stripe = false } = {}) {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0, 0, 256, 256);
  const edge = (x0, y0, x1, y1) => { const gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, `rgba(60,40,50,${k})`); gr.addColorStop(1, 'rgba(60,40,50,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); };
  edge(0, 0, 0, 60); edge(0, 256, 0, 196); edge(0, 0, 50, 0); edge(256, 0, 206, 0);
  if (stripe) { g.fillStyle = 'rgba(80,60,70,0.10)'; for (let y = 32; y < 256; y += 64) g.fillRect(0, y, 256, 2); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// ================================================================ HAL 的眼：镜片着色器（环 / 芯 / 倒影 / 光圈叶片 / 瞳孔里的星门）
function makeLensMaterial(U) {
  return new THREE.ShaderMaterial({
    uniforms: U,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform vec3 uRing, uLemon, uPink, uMint, uPaper; uniform float uCore, uRefl, uT, uReflScale, uIris, uSuck, uTunnel; uniform sampler2D uFace; varying vec2 vUv;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      vec3 tunnel(vec2 q, float rq){                                   // 瞳孔里的星门：极坐标 slit-scan 光带
        float a = atan(q.y, q.x) / 6.2832 + 0.5, dep = 0.22 / max(rq, 0.015) + uT * 3.0;
        vec2 cell = vec2(floor(a * 28.0), floor(dep * 2.5));
        float h = hash(cell), band = smoothstep(0.35, 0.0, abs(fract(dep * 2.5) - 0.5) - 0.1);
        vec3 pal = h < 0.3 ? uPink : h < 0.55 ? uMint : h < 0.75 ? uLemon : uPaper;
        return pal * (0.35 + 1.4 * band * step(0.35, hash(cell + 7.0))) * (0.6 + 2.2 * smoothstep(0.5, 0.0, rq));
      }
      void main(){
        vec2 p = vUv * 2.0 - 1.0; float r = length(p), a = atan(p.y, p.x);
        vec3 c;
        if (r > 0.8) {                                                 // 金属外圈
          float br = 0.44 + 0.3 * cos(a - 2.2) + 0.05 * sin(a * 90.0);
          c = vec3(br) * vec3(1.0, 0.985, 0.97) * smoothstep(1.0, 0.97, r) * (0.75 + 0.25 * smoothstep(0.8, 0.86, r));
        } else {
          vec2 q = p / 0.8; float rq = length(q);
          c = vec3(0.012, 0.01, 0.016) + vec3(0.03) * (1.0 - rq);
          float r1 = exp(-pow((rq - 0.78) / 0.02, 2.0)), r2 = exp(-pow((rq - 0.55) / 0.018, 2.0)), r3 = exp(-pow((rq - 0.34) / 0.016, 2.0));
          c += vec3(0.12) * (r1 + r2 + r3);
          c += uLemon * (r1 * uRing.x + r2 * uRing.y + r3 * uRing.z) * 2.2 * (1.0 - 0.7 * uRefl);
          float core = smoothstep(0.2, 0.0, rq);
          c += uLemon * (core * 3.4 + exp(-rq * 5.0) * 0.9) * uCore;
          c += vec3(1.0, 0.55, 0.2) * smoothstep(0.07, 0.0, rq) * uCore * 2.0;
          // 倒影（凸面镜：球面压缩 + 左右镜像）；uSuck：被卷进瞳孔（缩小 + 旋转）
          float sk = 1.0 - 0.94 * uSuck, sa = uSuck * 4.0;
          vec2 qs = mat2(cos(sa), -sin(sa), sin(sa), cos(sa)) * q;
          vec2 s = qs * (1.0 - 0.28 * rq * rq) / (uReflScale * sk);
          vec2 fu = vec2(0.5 - s.x * 0.44, 0.63 + s.y * 0.44 * 0.6667);
          vec4 f = texture2D(uFace, fu);
          float inside = step(0.0, fu.x) * step(fu.x, 1.0) * step(0.0, fu.y) * step(fu.y, 1.0);
          vec3 fc = f.rgb * mix(vec3(1.0), vec3(1.0, 0.82, 0.9), 0.35);
          float fa = f.a * uRefl * inside * smoothstep(1.0, 0.88, rq) * (1.0 - smoothstep(0.75, 1.0, uSuck));
          // 光圈叶片（uIris ≥ 0 时出现）：8 片，开口是转动的八边形，叶片接缝是螺旋线，开口里是星门
          if (uIris >= 0.0) {
            float rot = uIris * 1.3, seg = 6.2832 / 8.0;
            float ang = mod(a - rot, seg) - seg * 0.5;
            float A = mix(0.06, 0.98, uIris), poly = A * cos(seg * 0.5) / cos(ang);
            float blade = smoothstep(poly - 0.01, poly + 0.01, rq);
            float seamP = fract((a - rot) / seg + rq * 1.4);
            float seam = smoothstep(0.035, 0.0, 0.5 - abs(seamP - 0.5));           // 接缝在 seamP ≈ 0 / 1 处
            vec3 bc = vec3(0.1, 0.095, 0.11) * (0.7 + 0.5 * cos(a * 8.0 - rot * 8.0 + rq * 6.0)) + uLemon * seam * 0.9 + uLemon * smoothstep(0.02, 0.0, abs(rq - poly)) * 2.5;
            vec3 hole = tunnel(q, rq) * uTunnel + uLemon * exp(-rq * 7.0) * 1.5 * uCore;
            c = mix(hole, bc, blade);
            fa *= 1.0 - blade * 0.6;
          }
          c = mix(c, fc * 0.9 + c * 0.25, fa);
          vec2 h1 = q - vec2(-0.32, 0.42); float hl = smoothstep(0.2, 0.0, length(h1 * vec2(1.0, 2.2)));
          vec2 h2 = q - vec2(0.36, -0.46); float hl2 = smoothstep(0.1, 0.0, length(h2 * vec2(1.0, 1.8)));
          c += vec3(1.0, 0.92, 0.96) * (hl * 0.55 + hl2 * 0.25);
        }
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
}

// ================================================================ 舱室生成器（长廊 / 舱门前厅），带地面反射（镜像复制 + 半透明地面）
function buildHall({ HW = 2.0, HH = 3.0, BAY = 2.4, NB = 10, end = 'eye', lensMat, flareTex, entry = true }) {
  const scene = new THREE.Scene(); scene.background = col('#07070c');
  const LEN = BAY * NB;
  const wallTex = aoTex('#f6f3ee', 0.2, { stripe: true }), ceilTex = aoTex('#ece8e2', 0.22), floorTex = aoTex('#e9e4de', 0.12);
  const white = new THREE.MeshLambertMaterial({ map: wallTex, side: THREE.DoubleSide });
  const offW = new THREE.MeshLambertMaterial({ map: ceilTex, side: THREE.DoubleSide });
  const ribM = new THREE.MeshLambertMaterial({ color: col('#e3ded8'), side: THREE.DoubleSide });
  const floorM = new THREE.MeshLambertMaterial({ map: floorTex, transparent: true, opacity: 0.8, depthWrite: true, side: THREE.DoubleSide });
  const hall = new THREE.Group(); scene.add(hall);
  const amb = new THREE.AmbientLight('#ffffff', 0.55); scene.add(amb);
  const floors = [];
  const bays = [];
  const addBay = (z0, len, lit) => {
    const zc = z0 - len / 2;
    const wl = new THREE.Mesh(new THREE.PlaneGeometry(len, HH), white); wl.position.set(-HW, HH / 2, zc); wl.rotation.y = Math.PI / 2; hall.add(wl);
    const wr = wl.clone(); wr.position.x = HW; wr.rotation.y = -Math.PI / 2; hall.add(wr);
    const cl = new THREE.Mesh(new THREE.PlaneGeometry(HW * 2, len), offW); cl.position.set(0, HH, zc); cl.rotation.x = Math.PI / 2; hall.add(cl);
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(HW * 2, len), floorM); fl.position.set(0, 0, zc); fl.rotation.x = -Math.PI / 2; fl.renderOrder = 2; scene.add(fl); floors.push(fl);
    if (!lit) return;
    const rib = new THREE.Group(); rib.position.z = z0 - 0.02; hall.add(rib);
    const rb = (w, h, x, y) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.18), ribM); m.position.set(x, y, 0); rib.add(m); };
    rb(HW * 2, 0.22, 0, HH - 0.11); rb(0.22, HH, -HW + 0.11, HH / 2); rb(0.22, HH, HW - 0.11, HH / 2);
    const lampM = new THREE.MeshBasicMaterial({ color: col('#3a3438'), side: THREE.DoubleSide }), stripM = new THREE.MeshBasicMaterial({ color: col('#3a3438') });
    const lamp = new THREE.Mesh(new THREE.PlaneGeometry(HW * 0.7, len * 0.7), lampM); lamp.position.set(0, HH - 0.01, zc); lamp.rotation.x = Math.PI / 2; hall.add(lamp);
    for (const s of [-1, 1]) { const st = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, len * 0.86), stripM); st.position.set(s * (HW - 0.05), 0.05, zc); hall.add(st); }
    const pl = new THREE.PointLight(col('#ff9cc8'), 0, HW * 3, 1.8); pl.position.set(0, HH - 0.4, zc); scene.add(pl);
    bays.push({ i: bays.length, zc, lampM, stripM, pl });
  };
  for (let i = 0; i < NB; i++) addBay(-i * BAY, BAY, true);
  if (entry) {                                                         // 入口一头也封上：白墙 + 关着的舱门
    addBay(2.4, 2.4, false);
    const ew = new THREE.Mesh(new THREE.PlaneGeometry(HW * 2, HH), white); ew.position.set(0, HH / 2, 2.4); ew.rotation.y = Math.PI; hall.add(ew);
    const dr = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 2.3), ribM); dr.position.set(0, 1.15, 2.39); dr.rotation.y = Math.PI; hall.add(dr);
  }
  const endWall = new THREE.Mesh(new THREE.PlaneGeometry(HW * 2, HH), white); endWall.position.set(0, HH / 2, -LEN); hall.add(endWall);
  let eyePos, door = null, screen = null;
  if (end === 'eye') {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.5, 0.08), ribM); panel.position.set(0, 1.6, -LEN + 0.04); hall.add(panel);
    eyePos = V(0, 1.72, -LEN + 0.1);
  } else {
    // 舱门：两扇门 + 圆角门框（粉色门缝灯），门上方是眼
    door = new THREE.Group(); door.position.set(0, 0, -LEN + 0.03); hall.add(door);
    const DW = HW * 1.1, DH = HH * 0.72;
    const frameM = new THREE.MeshLambertMaterial({ color: col('#d9d3cc'), side: THREE.DoubleSide });
    const fr = new THREE.Mesh(new THREE.PlaneGeometry(DW + 0.5, DH + 0.35), frameM); fr.position.set(0, (DH + 0.35) / 2, 0.005); door.add(fr);
    const leafM = new THREE.MeshLambertMaterial({ map: aoTex('#f1ede8', 0.18), side: THREE.DoubleSide });
    for (const s of [-1, 1]) { const lf = new THREE.Mesh(new THREE.BoxGeometry(DW / 2 - 0.02, DH, 0.08), leafM); lf.position.set(s * DW / 4, DH / 2, 0.05); door.add(lf); }
    const seamM = new THREE.MeshBasicMaterial({ color: col(PAL.pink).multiplyScalar(1.6) });
    const seam = new THREE.Mesh(new THREE.BoxGeometry(0.03, DH, 0.1), seamM); seam.position.set(0, DH / 2, 0.06); door.add(seam);
    const top = new THREE.Mesh(new THREE.BoxGeometry(DW, 0.04, 0.1), seamM); top.position.set(0, DH + 0.02, 0.06); door.add(top);
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.08), ribM); panel.position.set(0, DH + 0.72, 0.04); door.add(panel);
    eyePos = V(0, DH + 0.78, -LEN + 0.12);
    // 门边小屏幕（HAL 界面字）
    const cv = document.createElement('canvas'); cv.width = 512; cv.height = 256;
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    const sm = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.35), new THREE.MeshBasicMaterial({ map: tex })); sm.position.set(0.95, DH + 0.72, 0.06); sm.scale.setScalar(0.85); door.add(sm);
    screen = { cv, g: cv.getContext('2d'), tex, last: null };
  }
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.26, 96), lensMat); lens.position.copy(eyePos); hall.add(lens);
  const eyeLight = new THREE.PointLight(col(PAL.lemon), 0, 3.5, 2); eyeLight.position.copy(eyePos).add(V(0, 0, 0.6)); scene.add(eyeLight);
  const flare = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), new THREE.MeshBasicMaterial({ map: flareTex, color: col(PAL.lemon), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  flare.position.copy(eyePos).add(V(0, 0, 0.03)); hall.add(flare);
  // 地面反射：整个 hall 沿地面镜像一份（共享材质，灯亮它也亮），地面半透明
  const mirror = hall.clone(); mirror.scale.y = -1; scene.add(mirror);
  const gl = createGirlLights({ key: 1.0, rim: 1.2, fill: 0.5 }); gl.visible = false; scene.add(gl);
  gl.traverse(o => { if (o.isLight) { o.color.set('#ffffff'); if (o.position.x) o.position.x = 0; } });   // 对称：灯都放中线、白光
  return { scene, hall, mirror, bays, amb, eyePos, eyeLight, flare, lens, door, screen, LEN, HW, HH, gl, floors };
}

export async function makeV4012001(mv) {
  const renderer = mv.stage.renderer;
  const BEAT = mv.audio?.beat_period ?? 0.4545;
  const L = i => mv.lyrics.lines[i].words;
  const word = (i, s) => L(i).find(w => w.w.toLowerCase().startsWith(s.toLowerCase()));

  // 界面字体（门边小屏幕）
  await Promise.all([['UIBebas', 'bebasneue/BebasNeue-Regular.ttf'], ['UIMono', 'sharetechmono/ShareTechMono-Regular.ttf']].map(async ([n, f]) => { const ff = new FontFace(n, `url(${new URL(`../../../assets/fonts/${f}`, import.meta.url).href})`); await ff.load(); document.fonts.add(ff); }));
  const TEX = Object.fromEntries(await Promise.all(NAMES.map(async n => [n, await keyed(n)])));
  // 口型：逐词 → 元音（整张换图）；AGI / ChatGPT 按音节拆
  const VOW = { I: 'a', see: 'i', sparks: 'a', of: 'o', in: 'i', your: 'u', eyes: 'a', Your: 'u', circuits: 'u', make: 'e', me: 'i', 'nervous,': 'u',
    "that's": 'a', no: 'o', surprise: 'a', please: 'i', "don't": 'o', eat: 'i', alive: 'a' };
  const SYL = [];
  for (const i of [0, 1, 2, 5]) for (const w of L(i)) {
    if (w.w === 'AGI') { const k = (w.end - w.start) / 3; ['e', 'i', 'a'].forEach((v, j) => SYL.push([w.start + j * k, w.start + (j + 1) * k, v])); continue; }
    if (w.w.startsWith('ChatGPT')) { [[16.6, 17.24, 'a'], [17.24, 17.92, 'i'], [17.92, 18.36, 'i'], [18.36, 19.08, 'i']].forEach(x => SYL.push(x)); continue; }
    SYL.push([w.start, w.end, VOW[w.w] ?? 'a']);
  }
  const BLINKS = [2.05, 5.3];
  function faceAt(T, mood = 'neutral') {
    for (const b of BLINKS) if (T >= b && T < b + 0.12) return 'eyes-closed';
    for (const [a, b, v] of SYL) if (T >= a && T < b) return (T - a) < 0.72 * (b - a) ? `mouth-${v}` : mood;
    return mood;
  }

  // ---------------------------------------------------------------- 共用：镜片、光晕贴图
  const LU = {
    uRing: { value: new THREE.Vector3() }, uCore: { value: 0 }, uRefl: { value: 0 }, uFace: { value: TEX.neutral }, uT: { value: 0 },
    uLemon: { value: col(PAL.lemon) }, uPink: { value: col(PAL.pink) }, uMint: { value: col(PAL.mint) }, uPaper: { value: col(PAL.paper) },
    uReflScale: { value: 1 }, uIris: { value: -1 }, uSuck: { value: 0 }, uTunnel: { value: 0 },
  };
  const lensMat = makeLensMaterial(LU);
  const flareTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.2, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c); })();
  const lensReset = () => { LU.uRefl.value = 0; LU.uReflScale.value = 1; LU.uIris.value = -1; LU.uSuck.value = 0; LU.uTunnel.value = 0; };

  const H = buildHall({ NB: 10, end: 'eye', lensMat, flareTex });                       // 长廊（眼在尽头墙上）
  const B = buildHall({ HW: 2.6, HH: 4.2, BAY: 2.4, NB: 4, end: 'door', lensMat, flareTex, entry: false });   // 舱门前厅（眼在门上方）

  // ---------------------------------------------------------------- 她：2D 纸片（鱼眼监控里用）
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
  plate.rotation.y = Math.PI; plate.visible = false; plate.renderOrder = 5; H.scene.add(plate);   // 在半透明地面之后画

  // ---------------------------------------------------------------- 3D 的她（背影 / 远景）
  const girl = await createGirl(mv);
  girl.root.scale.setScalar(1.65); girl.root.visible = false;
  const BASE = { spine: [0, 0, 0], chest: [0, 0, 0], neck: [0, 0, 0], head: [0, 0, 0], clavL: [0, 0, 0], clavR: [0, 0, 0],
    handL: { pos: [0.12, -0.95, 0.06], pole: [0.4, 0, -1], wrist: [0, 0, 0], grip: 0.3 }, handR: { pos: [-0.12, -0.95, 0.06], pole: [-0.4, 0, -1], wrist: [0, 0, 0], grip: 0.3 } };
  const SHRUG = { spine: [0, 0, 0], chest: [-3, 0, 0], neck: [0, 0, 0], head: [4, 0, 10], clavL: [0, 0, 14], clavR: [0, 0, -14],
    handL: { pos: [0.62, -0.42, 0.42], pole: [0.6, -1, 0], wrist: [0, 0, -40], grip: 0 }, handR: { pos: [-0.62, -0.42, 0.42], pole: [-0.6, -1, 0], wrist: [0, 0, 40], grip: 0 } };
  const WIND = { ...BASE, spine: [4, 20, 0], chest: [2, 15, 0], head: [-10, -10, 0], handR: { pos: [-0.35, 0.05, -0.75], pole: [-1, 0, 0], wrist: [0, 0, 0], grip: 1 } };
  const RELEASE = { ...BASE, spine: [-8, -12, 0], chest: [-8, -8, 0], head: [-22, 6, 0], clavR: [0, 0, -16], handR: { pos: [-0.12, 0.96, 0.25], pole: [-1, 0, 0.3], wrist: [0, 0, 0], grip: 0 } };
  const LOOKUP = { ...BASE, spine: [-4, 0, 0], chest: [-6, 0, 0], neck: [-14, 0, 0], head: [-22, 0, 0], handL: { pos: [0.3, -0.85, 0.12], pole: [0.4, 0, -1], wrist: [0, 0, 0], grip: 0.3 }, handR: { pos: [-0.3, -0.85, 0.12], pole: [-0.4, 0, -1], wrist: [0, 0, 0], grip: 0.3 } };
  const KNOCK = (k) => ({ ...BASE, spine: [2, 0, 0], head: [-6, 0, 0], clavR: [0, 0, -8], handR: { pos: [-0.12, 0.42, 0.72 + 0.12 * k], pole: [-1, -0.3, 0], wrist: [0, 0, 0], grip: 1 } });
  const breathe = (s, T) => { const b = Math.sin(T * 2 * Math.PI / 3.2) * 1.2; return { ...s, chest: s.chest.map((x, i) => i === 0 ? x - b : x) }; };
  function showGirl(scene, { x = 0, z, facing = 'back', spec, T }) {
    scene.add(girl.root); girl.root.visible = true; girl.root.position.set(x, 0, z); girl.root.rotation.set(0, facing === 'back' ? Math.PI : 0, 0);
    girl.setSkin('toon', T); girl.pose(() => breathe(spec, T));
  }

  // ---------------------------------------------------------------- 鱼眼 pass
  const rt = new THREE.WebGLRenderTarget(1920, 1080, { samples: 4, type: THREE.HalfFloatType });
  const fishU = { tSrc: { value: rt.texture }, uK: { value: 0.55 }, uFlash: { value: 0 } };
  const fishScene = new THREE.Scene(), fishCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  fishScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    uniforms: fishU, depthTest: false, depthWrite: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform sampler2D tSrc; uniform float uK, uFlash; varying vec2 vUv;
      void main(){
        vec2 p = (vUv - 0.5) * vec2(1.7778, 1.0); float r = length(p), R = 0.62;
        vec2 s = p * (1.0 - uK + uK * (r * r) / (R * R) * 0.9);
        float ca = 0.004 + 0.012 * r * r; vec3 c;
        c.r = texture2D(tSrc, s * (1.0 + ca) / vec2(1.7778, 1.0) + 0.5).r;
        c.g = texture2D(tSrc, s / vec2(1.7778, 1.0) + 0.5).g;
        c.b = texture2D(tSrc, s * (1.0 - ca) / vec2(1.7778, 1.0) + 0.5).b;
        c *= smoothstep(R, R - 0.1, r) * (0.8 + 0.2 * (1.0 - r / R));
        // 镜头外：暗舱壁（不是纯黑）
        c += vec3(0.07, 0.055, 0.065) * smoothstep(R - 0.05, R + 0.02, r);
        c += vec3(1.0, 0.95, 0.6) * uFlash * exp(-r * 3.0);
        gl_FragColor = vec4(c, 1.0);
      }`,
  })));
  function fish(scene, camera, T, flash = 0) {
    const prev = renderer.getRenderTarget(); renderer.setRenderTarget(rt); renderer.setClearColor(col('#07070c'), 1); renderer.clear(); renderer.render(scene, camera); renderer.setRenderTarget(prev);
    fishU.uFlash.value = flash;
    return { scene: fishScene, camera: fishCam };
  }

  // ---------------------------------------------------------------- 灯
  const BAY_ON = i => 0.238 + i * 0.092, EYE_ON = 0.238 + 2 * BEAT;
  const agi = word(0, 'AGI'), tA = agi.start, tAGI = [0, 1, 2].map(j => tA + j * (agi.end - tA) / 3);
  const tSparks = word(0, 'sparks').start, tEyes = word(0, 'eyes').start, tNerv = word(1, 'nervous').start;
  const tNo = word(2, 'no').start, tSurp = word(2, 'surprise').start, tDrop = word(3, 'drop').start, tLoss = word(3, 'loss').start;
  const tServ = word(4, 'servant').start, tBoss = word(4, 'boss').start, tPlease = word(5, 'please').start, tEat = word(5, 'eat').start, tMe = word(5, 'me').start, tAlive = word(5, 'alive').start;
  const CHAT = [16.6, 17.24, 17.92, 18.36];
  const kick = T => mv.music.pulse('kick', T, { decay: 0.14 });
  function lights(R, T, { on = 1, flick = 1, eye = null, allOn = false } = {}) {
    for (const b of R.bays) {
      const k = allOn ? 1 : T - BAY_ON(b.i), lit = k < 0 ? 0 : (k < 0.05 && !allOn ? 1.6 : 1) * flick * on;
      b.lampM.color.set(lit ? PAL.pink : '#3a3438').multiplyScalar(lit ? 1.8 * lit : 1);
      b.stripM.color.set(lit ? PAL.pink : '#3a3438').multiplyScalar(lit ? 2.2 * lit : 1);
      b.pl.intensity = 1.6 * lit;
    }
    R.amb.intensity = allOn ? 1.3 : lerp(0.25, 1.3, smooth((T - 0.238) / 1.0));
    const e = eye ?? (T < EYE_ON ? 0 : smooth((T - EYE_ON) / 0.25) * (1 + 0.6 * Math.exp(-(T - EYE_ON) * 5)));
    LU.uCore.value = e; R.eyeLight.intensity = 1.2 * e; R.flare.material.opacity = 0.7 * e; R.flare.scale.setScalar(0.8 + 0.35 * e);
    LU.uRing.value.set(...tAGI.map(t => T >= t ? 1 + 0.8 * Math.exp(-(T - t) * 8) : 0));
    LU.uT.value = T;
  }
  const cam = new THREE.PerspectiveCamera(50, 16 / 9, 0.02, 3000);
  const place = (p, look, fov, up = V(0, 1, 0)) => { cam.fov = fov; cam.position.copy(p); cam.up.copy(up); cam.lookAt(look); cam.updateProjectionMatrix(); };
  const post = (x = {}) => ({ bloom: { strength: 0.8, threshold: 0.95, radius: 0.8 }, chroma: 0.05, ...x, grade: { vignette: 0.26, ...(x.grade || {}) } });
  const hideAll = () => { plate.visible = false; girl.root.visible = false; H.gl.visible = false; B.gl.visible = false; lensReset(); };
  const shots = [];
  const shot = (id, t0, t1, fn) => shots.push({ id, t0, t1, transitionIn: { kind: 'cut' }, build: () => ({}), update: (S, T) => { hideAll(); return fn(T); } });
  const E = H.eyePos;

  // ================================================================ 0–7.72（样片的五镜，打磨）
  shot('wake', 0, 1.407, T => {
    lights(H, T);
    H.flare.scale.setScalar(2.2 + 1.2 * LU.uCore.value); H.flare.material.opacity = Math.min(1, LU.uCore.value);
    place(V(0, 1.62, 1.5 - 0.5 * eIO(T / 1.41)), V(0, 1.62, -H.LEN), lerp(44, 36, eIO(T / 1.41)));
    return { scene: H.scene, camera: cam, post: post() };
  });
  shot('pov', 1.407, tA, T => {
    lights(H, T);
    const u = (T - 1.407) / (tA - 1.407);
    plate.visible = true; plateU.map.value = TEX[faceAt(T)];
    const dist = lerp(1.35, 0.78, eIO(clamp(u * 1.4))) + 0.06 * Math.sin(T * 2.1);
    plate.position.set(0.05 * Math.sin(T * 1.3), E.y - 0.36 + 0.02 * Math.sin(T * 2.7), E.z + dist); plate.rotation.set(0, Math.PI, 0.03 * Math.sin(T * 1.7));
    place(V(0, E.y, E.z + 0.02), V(0, E.y - 0.05, 0), 70);
    const o = fish(H.scene, cam, T, T > tSparks ? 0.35 * Math.exp(-(T - tSparks) * 6) : 0);
    return { ...o, post: post({ chroma: 0.08 + (T > tSparks ? 0.4 * Math.exp(-(T - tSparks) * 5) : 0) }) };
  });
  shot('eye', tA, tEyes, T => {
    lights(H, T); const u = (T - tA) / (tEyes - tA);
    LU.uFace.value = TEX[faceAt(T)]; LU.uRefl.value = lerp(0.12, 0.55, smooth(u)); LU.uReflScale.value = 1.25;
    H.flare.material.opacity *= 0.3; H.eyeLight.intensity *= 0.4;
    place(V(0, E.y, E.z + lerp(1.35, 1.0, eIO(u))), E, 32);
    return { scene: H.scene, camera: cam, post: post({ bloom: { strength: 0.6, threshold: 1.2, radius: 0.7 } }) };
  });
  shot('reflect', tEyes, 6.601, T => {
    lights(H, T);
    const mood = T < tEyes + 0.45 ? 'surprised' : T < 5.88 ? 'smile' : 'neutral';
    LU.uFace.value = TEX[faceAt(T, mood)]; LU.uRefl.value = 0.9; LU.uReflScale.value = lerp(1.0, 0.86, eIO((T - tEyes) / 1.3));
    LU.uCore.value *= 0.25; H.eyeLight.intensity *= 0.3; H.flare.material.opacity *= 0.2;
    place(V(0, E.y, E.z + lerp(0.62, 0.5, eIO((T - tEyes) / 1.34))), E, 30);
    return { scene: H.scene, camera: cam, post: post({ bloom: { strength: 0.45, threshold: 1.3, radius: 0.6 } }) };
  });
  shot('wide', 6.601, 7.72, T => {
    const flick = T > tNerv && T < tNerv + 0.36 && Math.floor((T - tNerv) / 0.06) % 3 === 1 ? 0.25 : 1;
    const nerv = T > tNerv ? 1 + 0.8 * Math.exp(-(T - tNerv) * 7) : 1;
    lights(H, T, { flick }); LU.uCore.value *= nerv;
    H.gl.visible = true;
    const back = T > tNerv ? 0.12 * eOut((T - tNerv) / 0.4) : 0;
    showGirl(H.scene, { z: -5.5 + back, facing: 'back', spec: lerpSpec(BASE, LOOKUP, 0.25), T });
    H.flare.scale.setScalar(2.4); H.flare.material.opacity = Math.min(1, LU.uCore.value * 0.9);
    place(V(0, 2.25, 1.2 - 0.25 * eIO((T - 6.601) / 1.12)), V(0, 1.55, -H.LEN), 40);
    return { scene: H.scene, camera: cam, post: post() };
  });

  // ================================================================ 7.72 that's no surprise：HAL 鱼眼监控，她在长廊中间对镜头摊手
  shot('shrug', 7.72, 9.52, T => {
    lights(H, T, { allOn: true, eye: 1 });
    H.gl.visible = true;
    const k = eOut((T - tNo) / 0.35) * (1 - 0.25 * smooth((T - 9.2) / 0.3));
    showGirl(H.scene, { z: E.z + 4.2, facing: 'back', spec: lerpSpec(BASE, SHRUG, k), T });   // 'back' = 面朝 -z（面向 HAL）
    place(V(0, E.y, E.z + 0.02), V(0, E.y - 0.45, 0), 70);
    return { ...fish(H.scene, cam, T), post: post() };
  });

  // ================================================================ 9.52 抛出 loss 曲线（低机位背影）
  // loss 曲线：平台 → 断崖下跌 → 平底（和飞船轨道同一个形状）
  const lossY = x => x < 0.35 ? 0.9 - 0.15 * x + 0.03 * Math.sin(x * 40) : x < 0.5 ? lerp(0.85, 0.08, eIO((x - 0.35) / 0.15)) : 0.08 - 0.05 * (x - 0.5);
  const curvePts = Array.from({ length: 80 }, (_, i) => { const x = i / 79; return V(x - 0.5, lossY(x) - 0.5, 0); });
  const curve = new THREE.CatmullRomCurve3(curvePts);
  const glowM = new THREE.MeshBasicMaterial({ color: col(PAL.pink).multiplyScalar(2.2) });
  const toss = new THREE.Group(); toss.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.03, 8), glowM));
  const tossCore = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.007, 6), new THREE.MeshBasicMaterial({ color: col(PAL.paper).multiplyScalar(2) })); toss.add(tossCore);
  const tossLight = new THREE.PointLight(col(PAL.pink), 0, 4, 2); toss.add(tossLight);
  H.scene.add(toss); toss.visible = false;
  const tRel = 9.95;
  shot('throw', 9.52, tDrop, T => {
    lights(H, T, { allOn: true, eye: 1 }); H.gl.visible = true;
    const GZ = -9;
    const w = smooth((T - 9.52) / 0.35), r = smooth((T - (tRel - 0.12)) / 0.18);
    const spec = r > 0 ? lerpSpec(WIND, RELEASE, r) : lerpSpec(BASE, WIND, w);
    showGirl(H.scene, { z: GZ, facing: 'back', spec, T });
    // 曲线：在手里 → 出手后往上飞、翻转（慢镜头感），接近舱顶粉灯
    toss.visible = true; tossLight.intensity = 4;
    const hand = V(0.2, 1.75, GZ - 0.2);
    const k = Math.max(0, T - tRel);
    toss.position.copy(hand).add(V(0.1 * k, 1.6 * k - 0.35 * k * k, -0.9 * k));
    toss.rotation.set(0.5 + k * 2.2, 0.3 + k * 1.1, k * 3.4);
    toss.scale.setScalar(lerp(1.4, 2.6, smooth(k / 0.6)));
    // 机位：她身后低机位，随曲线往上摇
    const up = smooth((T - tRel) / 0.55);
    place(V(0, lerp(0.55, 0.4, up), GZ + 3.4), V(0, lerp(1.8, 3.2, up), GZ - 6), lerp(52, 60, up));
    return { scene: H.scene, camera: cam, post: post() };
  });

  // ================================================================ 10.66 太空：飞船沿同一条曲线的轨道急降；12.055 日月一线
  const space = new THREE.Scene(); space.background = col('#0b0716');
  { const rnd = mulberry32(3), n = 2200, p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2, s = Math.sqrt(1 - u * u), R = 900; p.set([s * Math.cos(th) * R, u * R, s * Math.sin(th) * R], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    space.add(new THREE.Points(g, new THREE.PointsMaterial({ color: col(PAL.paper), size: 1.8, sizeAttenuation: false }))); }
  // 行星：粉色，边缘亮（菲涅尔）
  const planet = new THREE.Mesh(new THREE.SphereGeometry(200, 96, 64), new THREE.ShaderMaterial({
    uniforms: { uPink: { value: col(PAL.pink) }, uPaper: { value: col(PAL.paper) }, uSun: { value: V(0, 1, -0.3).normalize() } },
    vertexShader: `varying vec3 vN, vV; void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position, 1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uPink, uPaper; varying vec3 vN, vV; void main(){ float f = pow(1.0 - max(0.0, dot(vN, vV)), 3.0); float day = smoothstep(-0.2, 0.6, vN.y);
      vec3 c = uPink * 0.08 + uPink * day * 0.35 + mix(uPink, uPaper, 0.4) * f * 2.2; gl_FragColor = vec4(c, 1.0); }`,
  }));
  planet.position.set(0, -212, -120); space.add(planet);
  const disc = (r, color, k) => new THREE.Mesh(new THREE.CircleGeometry(r, 64), new THREE.MeshBasicMaterial({ color: col(color).multiplyScalar(k) }));
  const sunEye = disc(5, PAL.lemon, 2.4), moon = disc(3.2, '#ffd9ea', 1.3);
  const sunGlow = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshBasicMaterial({ map: flareTex, color: col(PAL.lemon), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  space.add(sunEye, moon, sunGlow);
  // 轨道（同一条 loss 曲线，放大）+ 飞船
  const ORB = 60, orbit = new THREE.CatmullRomCurve3(curvePts.map(p => V(p.x * ORB * 1.4, p.y * ORB, 0)));
  const orbitM = new THREE.MeshBasicMaterial({ color: col(PAL.pink).multiplyScalar(1.8), transparent: true, opacity: 0.85 });
  const orbitMesh = new THREE.Mesh(new THREE.TubeGeometry(orbit, 300, 0.22, 8), orbitM); space.add(orbitMesh);
  const ship = new THREE.Group(); ship.scale.setScalar(3.2); space.add(ship);
  { const shape = new THREE.Shape(); shape.moveTo(0, 2.6); shape.lineTo(0.9, -1.2); shape.lineTo(0.35, -1.6); shape.lineTo(-0.35, -1.6); shape.lineTo(-0.9, -1.2); shape.closePath();
    const hull = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: true, bevelSize: 0.12, bevelThickness: 0.12, bevelSegments: 2 }), new THREE.MeshLambertMaterial({ color: col('#f5f1ec') }));
    hull.geometry.center(); hull.rotation.x = -Math.PI / 2; ship.add(hull);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.62, 3.2), new THREE.MeshBasicMaterial({ color: col(PAL.pink).multiplyScalar(1.4) })); stripe.position.y = 0.05; ship.add(stripe);
    const eng = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), new THREE.MeshBasicMaterial({ map: flareTex, color: col(PAL.pink).multiplyScalar(2.5), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); eng.position.z = 1.9; eng.name = 'eng'; ship.add(eng); }
  { const dl = new THREE.DirectionalLight('#ffe3f0', 1.6); dl.position.set(0.3, 1, 0.6); space.add(new THREE.AmbientLight('#ffffff', 0.9), dl); }
  shot('dive', tDrop, 12.055, T => {
    const k = (T - tDrop) / (12.055 - tDrop);
    // 飞船从平台段末尾出发，沿断崖急降（前 0.55 s 最快），之后减速滑到谷底
    const u = lerp(0.3, 0.72, 1 - (1 - clamp(k)) ** 2.4);
    const p = orbit.getPointAt(u), tan = orbit.getTangentAt(u);
    ship.position.copy(p); ship.lookAt(p.clone().add(tan)); ship.rotateY(Math.PI); ship.rotateZ(Math.sin(T * 6) * 0.05);
    orbitM.opacity = 0.85;
    sunEye.visible = moon.visible = sunGlow.visible = false;
    // 机位：侧面、对称地看着这条曲线（和上一镜抛出的曲线同一个朝向），跟着飞船往下摇
    place(V(p.x * 0.35, lerp(18, -4, eIO(k)) , 95), V(p.x * 0.5, lerp(10, -14, eIO(k)), 0), 42);
    ship.updateMatrixWorld(true); ship.getObjectByName('eng').lookAt(cam.position);
    return { scene: space, camera: cam, post: post({ chroma: 0.1 + 0.3 * Math.exp(-(T - tDrop) * 5) }) };
  });
  shot('align', 12.055, 12.965, T => {
    const k = (T - 12.055) / 0.91;
    sunEye.visible = moon.visible = sunGlow.visible = true;
    orbitM.opacity = 0.0; ship.position.set(0, -500, 0);
    // 中线：行星边缘在下，柠黄的「日」从边缘后升起，粉白的「月」在它正上方；镜头慢慢上仰
    const base = V(0, -12, -120);
    sunEye.position.set(0, base.y + lerp(-6, 9, eOut(k * 1.2)), -118); moon.position.set(0, base.y + 26, -119);
    sunGlow.position.copy(sunEye.position).add(V(0, 0, 0.5)); sunGlow.material.opacity = 0.9;
    sunEye.lookAt(0, 0, 60); moon.lookAt(0, 0, 60); sunGlow.lookAt(0, 0, 60);
    place(V(0, -8, 60), V(0, lerp(-8, 2, eIO(k)), -120), 34);
    return { scene: space, camera: cam, post: post({ bloom: { strength: 1.0, threshold: 0.9, radius: 0.9 } }) };
  });

  // ================================================================ 12.965 舱门外（pod bay）：背影敲门 → 俯拍（HAL 看她）→ 仰拍（门上的眼，镜片里很小的她）
  const BE = B.eyePos, DOORZ = -B.LEN;
  const KNOCKS = [13.2, 13.42, 13.65];
  const knockK = T => KNOCKS.reduce((m, t) => Math.max(m, T >= t - 0.08 && T < t + 0.14 ? Math.sin(clamp((T - t + 0.08) / 0.22) * Math.PI) : 0), 0);
  function drawScreen(T) {
    const s = B.screen, on = T >= tBoss, key = on ? 'boss' + Math.floor(T * 8) % 2 : 'idle';
    if (s.last === key) return; s.last = key;
    const g = s.g; g.fillStyle = '#10080e'; g.fillRect(0, 0, 512, 256);
    g.strokeStyle = PAL.pink; g.lineWidth = 6; g.strokeRect(8, 8, 496, 240);
    g.fillStyle = PAL.lemon; g.textAlign = 'center'; g.textBaseline = 'middle';
    if (on) { g.font = '120px "UIBebas", "Bebas Neue", Impact, sans-serif'; g.fillText('BOSS', 256, 132); }
    else { g.font = '44px "UIMono", monospace'; g.globalAlpha = 0.6; g.fillText('— — —', 256, 128); g.globalAlpha = 1; }
    s.tex.needsUpdate = true;
  }
  shot('door', 12.965, 13.874, T => {
    lights(B, T, { allOn: true, eye: 1 }); drawScreen(T); B.gl.visible = true;
    const walk = smooth((T - 12.965) / 0.3);
    showGirl(B.scene, { z: DOORZ + lerp(2.2, 1.35, walk), facing: 'back', spec: lerpSpec(BASE, KNOCK(knockK(T)), smooth((T - 13.05) / 0.15)), T });
    place(V(0, 1.7, 3.2), V(0, 1.9, DOORZ), 44);
    return { scene: B.scene, camera: cam, post: post() };
  });
  shot('servant', 13.874, 14.783, T => {
    lights(B, T, { allOn: true, eye: 1 }); drawScreen(T); B.gl.visible = true;
    showGirl(B.scene, { z: DOORZ + 1.35, facing: 'back', spec: lerpSpec(BASE, LOOKUP, smooth((T - 13.9) / 0.3)), T });
    place(V(0, BE.y - 0.02, BE.z + 0.06), V(0, 0, DOORZ + 2.6), 72);
    return { ...fish(B.scene, cam, T), post: post() };
  });
  shot('boss', 14.783, 16.601, T => {
    const flare = T > tBoss ? 1 + 1.2 * Math.exp(-(T - tBoss) * 4) : 1;
    lights(B, T, { allOn: true, eye: flare }); drawScreen(T);
    LU.uFace.value = TEX['eyes-half']; LU.uRefl.value = 0.9; LU.uReflScale.value = 0.3;      // 镜片里很小的她（<1 = 缩小）
    const k = (T - 14.783) / 1.818;
    B.flare.material.opacity = 0; B.eyeLight.intensity *= 0.5;
    place(V(0, 0.45, DOORZ + lerp(3.4, 3.0, eIO(k))), BE.clone().add(V(0.42, 0.0, 0)), lerp(15, 12, eIO(k)));
    return { scene: B.scene, camera: cam, post: post() };
  });

  // ================================================================ 16.601 眼睛充满画面：光圈叶片张开 → 倒影被吸进瞳孔 → 星门 → 副歌
  const gateU = { uT: { value: 0 }, uSpeed: { value: 1 }, uFlash: { value: 0 }, uMintC: { value: col(PAL.mint) }, uPink: { value: col(PAL.pink) }, uLemon: { value: col(PAL.lemon) }, uPaper: { value: col(PAL.paper) } };
  const gate = new THREE.Scene(), gateCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  gate.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    uniforms: gateU, depthTest: false, depthWrite: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform float uT, uSpeed, uFlash; uniform vec3 uMintC, uPink, uLemon, uPaper; varying vec2 vUv;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main(){
        vec2 p = (vUv - 0.5) * vec2(1.7778, 1.0) * 2.0;
        float side = abs(p.x) + 0.0001, z = 0.35 / side, y = p.y / side;
        float dep = z + uT * uSpeed;
        vec2 cell = vec2(floor(y * 5.0), floor(dep * 3.0) + step(0.0, p.x) * 91.0);
        float h = hash(cell), stripe = smoothstep(0.5, 0.0, abs(fract(y * 5.0) - 0.5) - 0.18);
        vec3 pal = h < 0.3 ? uPink : h < 0.55 ? uMintC : h < 0.75 ? uLemon : uPaper;
        vec3 c = pal * stripe * (0.5 + 1.8 * step(0.4, hash(cell + 3.0))) * smoothstep(0.0, 0.35, side) * (1.0 - smoothstep(2.2, 3.4, abs(y)));
        c += uPaper * exp(-side * 9.0) * 0.8 * (1.0 - smoothstep(0.0, 1.2, abs(p.y)));    // 中缝的白光
        c = mix(c, uMintC * 1.15, uFlash);
        gl_FragColor = vec4(c, 1.0);
      }`,
  })));
  const tPlunge = 20.691;                              // 冲进瞳孔：落在拍上（me 20.84 前一拍）
  shot('maw', 16.601, 22.1, T => {
    if (T < tPlunge) {
      lights(B, T, { allOn: true, eye: 1 });
      // 光圈：Chat-G-P-T 四个音节各开一档；please 之后继续张大像一张嘴
      let iris = 0.06; CHAT.forEach((t, i) => { if (T >= t) iris = lerp(0.06, 0.5, (i + eOut((T - t) / 0.16)) / 4); });
      iris += 0.35 * smooth((T - tPlease) / (tPlunge - tPlease));
      B.flare.material.opacity = 0; B.eyeLight.intensity *= 0.3;                   // 镜头贴着镜片：光晕片会糊满画面
      LU.uIris.value = iris; LU.uTunnel.value = smooth((T - 16.601) / 0.8); LU.uCore.value = 0.6 + 0.6 * kick(T);
      // 倒影：please 起她（惊恐）浮现在叶片 / 开口上；eat 起被卷进瞳孔
      LU.uFace.value = TEX[T < tEat ? faceAt(T, 'surprised') : 'surprised']; LU.uRefl.value = 0.25 + 0.6 * smooth((T - tPlease) / 0.35);
      LU.uReflScale.value = 1.05; LU.uSuck.value = eIn((T - tEat) / (tPlunge - tEat));
      // 机位：镜片充满画面，Chat-G-P-T 每拍往里一顿推；最后加速冲向瞳孔
      const steps = CHAT.reduce((m, t) => m + eOut((T - t) / 0.2), 0) / 4;
      const z = lerp(0.72, 0.5, steps) * lerp(1, 0.15, eIn((T - tEat) / (tPlunge - tEat)));
      place(V(0, BE.y, BE.z + z), BE, 34 + 4 * kick(T));
      return { scene: B.scene, camera: cam, post: post({ bloom: { strength: 0.9, threshold: 1.0, radius: 0.8 }, chroma: 0.1 + 0.4 * kick(T) }) };
    }
    // 星门：速度越来越快，22.055 冲出（薄荷闪白）
    const k = T - tPlunge;
    gateU.uT.value = k; gateU.uSpeed.value = 1.2 + 2.5 * k * k;
    gateU.uFlash.value = smooth((T - 21.93) / 0.125);
    return { scene: gate, camera: gateCam, post: post({ bloom: { strength: 1.0, threshold: 0.9, radius: 0.9 }, chroma: 0.25 + 0.3 * kick(T), flash: { amount: 0.6 * Math.exp(-k * 10), color: '#ffffff' } }) };
  });

  return shots;
}

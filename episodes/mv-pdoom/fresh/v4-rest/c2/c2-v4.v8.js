// shots/c2-v4.js — 副歌 2 v4（歌曲时间 58.42–74.78 s）。#1048
// 分镜：fresh/v4-rest/c2/plan.md（第二版，用户 10-02 通过）。剧情在楼顶，中间两次切到独立舞台唱（kits/stage.js）。
//
//   const shots = await makeC2V4(mv);   // c2-v4.html / c2-v4-half.html 单独挂；拼接页直接展开进镜头表
//
//   剧情 A  58.42–59.78  砸穿楼外墙上的手机巨屏、出拳冲出来 → 落在楼顶站稳（身后是 P(DOOM) 0.99 的读数招牌）→ 直接切舞台
//   舞台    59.78–65.69  kits/stage.js 的 cross 变体：推 → 环绕 → 推近大屏（I'm upping my P(doom) … The Omega Point's coming soon）
//   剧情 B  65.69–69.33  只拍读数招牌，她不出现：9 越接越快，冲出楼顶在夜空里连成一长串，镜头像追火车一样追过去；
//                        thirty 那一拍整串收拢成巨大的 1 − 10⁻³⁰；FLOPs a second 的长音里它像计数器一样高频跳，周围楼的灯跟着一闪一闪
//   剧情 C  69.33–71.6   动态漫画页（shots/c2-tape-comic.js）：巨门门缝上一条 SAFETY 胶带 → SAFE ENOUGH ✓ → 她捏着胶带回头看镜头 → 胶带「啪」绷断
//           71.6–74.78   招牌像两扇门裂开一道缝，强光 + 吸力（纸屑、光点往里卷）→ 她转身想跑、被拽离地面、伸手抓门边没抓住、背着身被卷进去
//                        → 镜头跟进通道，74.78 她刚到第一层节点平面（出口规格见 plan.md，接主歌 3）
// 单位：米（她身高 H = 2）。所有 update 都是歌曲时间 T 的纯函数；随机只用种子。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { mulberry32 } from '../kits/world.js';
import { createGirl, createGirlLights, loadAnims, getAnim } from '../kits/girl.js';
import { blendSolved } from '../../../assets/lib/dance3d.js';
import { createStage } from '../kits/stage.js';
import { makeTapeComic } from './c2-tape-comic.js';

export const ANIMS = ['act__fly-idle', 'move__hard-landing', 'act__terrified'];
export const C2 = { t0: 58.42, end: 74.78 };

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIO = p => { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2; };
const col = c => new THREE.Color(c);
const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k);
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const D2R = Math.PI / 180;
const FONT = '"UIAnton", "Anton", Impact, sans-serif';
function pchip(keys, t) {                              // 分段三次埃尔米特（单调）
  const n = keys.length;
  if (t <= keys[0][0]) return keys[0][1]; if (t >= keys[n - 1][0]) return keys[n - 1][1];
  const d = []; for (let i = 0; i < n - 1; i++) d.push((keys[i + 1][1] - keys[i][1]) / (keys[i + 1][0] - keys[i][0]));
  const m = keys.map((_, i) => i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : 2 * d[i - 1] * d[i] / (d[i - 1] + d[i]));
  let i = 0; while (t > keys[i + 1][0]) i++;
  const h = keys[i + 1][0] - keys[i][0], s = (t - keys[i][0]) / h, s2 = s * s, s3 = s2 * s;
  return (2 * s3 - 3 * s2 + 1) * keys[i][1] + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * keys[i + 1][1] + (s3 - s2) * h * m[i + 1];
}

// 霓虹牌：墨底 + 灯管边 + 白字（同跑酷段 / v4-01）。返回 { mesh, w, h, mat }，mesh 的高 = height（米），宽按字算
function plate(text, color, height, { draw = null, pad = 110 } = {}) {
  const c = document.createElement('canvas'), g0 = c.getContext('2d'); g0.font = `170px ${FONT}`;
  c.width = Math.ceil(draw ? draw.width : g0.measureText(text).width) + pad; c.height = 270; const g = c.getContext('2d');
  g.fillStyle = '#0d0c14'; g.fillRect(0, 0, c.width, c.height); g.strokeStyle = color; g.lineWidth = 16; g.strokeRect(8, 8, c.width - 16, c.height - 16);
  g.fillStyle = '#F2EDE4'; g.font = `170px ${FONT}`; g.textBaseline = 'middle';
  if (draw) draw.fn(g, pad / 2); else { g.textAlign = 'center'; g.fillText(text, c.width / 2, 143); }
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const mat = new THREE.MeshBasicMaterial({ map: tex, fog: false }), w = height * c.width / c.height;
  return { mesh: new THREE.Mesh(new THREE.PlaneGeometry(w, height), mat), w, h: height, mat, text };
}

// 亮窗楼面（世界坐标取格子：同一个材质可以贴墙、贴实例化的方块）
function facadeMat({ tint = '#ffe2a8', lit = 0.3, cell = [2.4, 3.2], base = '#0c0c16', glow = 1.3, haze = null } = {}) {
  return new THREE.ShaderMaterial({
    uniforms: { uTint: { value: col(tint) }, uLit: { value: lit }, uCell: { value: new THREE.Vector2(...cell) }, uBase: { value: col(base) }, uGlow: { value: glow }, uHaze: { value: haze ? col(haze) : col('#000000') }, uHazeK: { value: haze ? 0.0042 : 0 }, uDrain: { value: 0 } },
    vertexShader: /* glsl */`
      varying vec3 vW; varying vec3 vN;
      void main(){
        #ifdef USE_INSTANCING
          vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0); vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
        #else
          vec4 wp = modelMatrix * vec4(position, 1.0); vN = normalize(mat3(modelMatrix) * normal);
        #endif
        vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */`
      uniform vec3 uTint, uBase, uHaze; uniform float uLit, uGlow, uHazeK, uDrain; uniform vec2 uCell; varying vec3 vW; varying vec3 vN;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main(){
        vec3 n = abs(vN); vec3 c = uBase * (0.75 + 0.25 * n.z);
        if (n.y < 0.5) {
          vec2 g = vec2(n.x > 0.5 ? vW.z : vW.x, vW.y) / uCell, f = fract(g);
          float win = step(0.2, f.x) * step(f.x, 0.8) * step(0.25, f.y) * step(f.y, 0.75);
          float h = hash(floor(g) + n.x * 17.0);
          float alive = step(uDrain, hash(floor(vW.xz / 30.0) + 7.7));                 // 一栋栋楼的灯被抽干（按 30 m 的地块分）
          c += uTint * win * step(1.0 - uLit, h) * (0.6 + 0.4 * hash(floor(g) + 3.1)) * uGlow * alive + vec3(0.015, 0.016, 0.03) * win;
        }
        c = mix(uHaze, c, exp(-length(vW - cameraPosition) * uHazeK));
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
}

export async function makeC2V4(mv) {
  const H = 2.0, HB = (mv.audio?.beat_period ?? 0.4545) / 2;
  const db = t => (mv.audio?.downbeats ?? []).reduce((a, b) => (Math.abs(b - t) < Math.abs(a - t) ? b : a), t);   // 最近的强拍
  const bt = t => (mv.audio?.beats ?? []).reduce((a, b) => (Math.abs(b - t) < Math.abs(a - t) ? b : a), t);          // 最近的拍子
  const CUT = { s1: bt(59.78), b: db(65.69), c: db(69.33) };      // 剧情 A → 舞台（她落地站稳的下一拍）→ 剧情 B（两小节，只有读数招牌）→ 剧情 C
  const words = mv.lyrics.lines.flatMap(l => l.words).filter(w => w.start > 58 && w.start < 76);
  const W = s => { const w = words.find(q => q.w.toLowerCase().replace(/[^a-z()']/g, '').startsWith(s)); if (!w) throw new Error('c2-v4：歌词里找不到 ' + s); return w.start; };
  const tPdoom = W('p(doom)'), tFlops = W('flops'), tReck = W('reckoned'), tFwd = W('forward'), tCollapse = W('thirty');
  await loadAnims(ANIMS);
  await new FontFace('UIAnton', `url(${new URL('../../../assets/fonts/anton/Anton-Regular.ttf', import.meta.url)})`).load().then(f => document.fonts.add(f));
  const girl = await createGirl(mv);
  const kick = (T, d = 0.14) => (mv.music.pulse ? mv.music.pulse('kick', T, { decay: d }) : 0);

  // ================================================================ 楼顶的世界
  const scene = new THREE.Scene(); scene.background = col('#06060b');
  scene.add(createGirlLights({ key: 2.1, rim: 2.4, fill: 1.0 }));
  const cam = new THREE.PerspectiveCamera(52, 16 / 9, 0.1, 3000); scene.add(cam);
  { const rnd = mulberry32(77), n = 900, p = new Float32Array(n * 3);     // 星、粉月（同跑酷段）
    for (let i = 0; i < n; i++) { const a = rnd() * Math.PI * 2, e = Math.asin(0.06 + rnd() * 0.94), r = 900; p.set([Math.cos(a) * Math.cos(e) * r, Math.sin(e) * r, Math.sin(a) * Math.cos(e) * r], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: hdr(PAL.paper, 1.4), size: 1.6, sizeAttenuation: false, fog: false })));
    const moon = new THREE.Mesh(new THREE.CircleGeometry(46, 64), new THREE.MeshBasicMaterial({ color: hdr(PAL.pink, 1.25), fog: false })); moon.position.set(150, 95, -560); moon.lookAt(0, 0, 0); scene.add(moon); var skyMoon = moon; }
  const RX = 14, WZ = -8, RZ = 12;                     // 楼顶：x ∈ [-RX, RX]，z ∈ [WZ, RZ]；y = 0。背后（z = WZ）是更高的一栋楼的外墙，招牌挂在这面墙上
  const roof = new THREE.Group(), far = []; scene.add(roof);
  { // 楼顶地面：深色 + 霓虹格线
    const m = new THREE.Mesh(new THREE.PlaneGeometry(RX * 2, RZ - WZ).rotateX(-Math.PI / 2), new THREE.ShaderMaterial({ uniforms: { uPink: { value: col(PAL.pink) }, uMint: { value: col(PAL.mint) } },
      vertexShader: `varying vec3 vW; void main(){ vW = (modelMatrix * vec4(position, 1.0)).xyz; gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.0); }`,
      fragmentShader: /* glsl */`uniform vec3 uPink, uMint; varying vec3 vW;
        float ln(float v, float s, float w){ float g = abs(fract(v / s - 0.5) - 0.5) * s; return 1.0 - smoothstep(0.0, w, g); }
        void main(){ vec3 c = vec3(0.045, 0.046, 0.075); c += uMint * 0.16 * max(ln(vW.x, 2.0, 0.03), ln(vW.z, 2.0, 0.03)); c += uPink * 0.9 * ln(vW.z + 7.0, 400.0, 0.06) + uMint * 0.8 * ln(vW.x, 400.0, 0.05); gl_FragColor = vec4(c, 1.0); }` }));
    m.position.set(0, 0, (RZ + WZ) / 2); roof.add(m);
    const edge = new THREE.MeshBasicMaterial({ color: '#14141f' }), strip = new THREE.MeshBasicMaterial({ color: hdr(PAL.pink, 1.6) });
    for (const [x, z, w, d] of [[-RX, 2, 0.4, RZ - WZ], [RX, 2, 0.4, RZ - WZ], [0, RZ, RX * 2, 0.4]]) {             // 女儿墙 + 顶上一条灯管
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, 0.9, d), edge); b.position.set(x, 0.45, z); roof.add(b);
      const s = new THREE.Mesh(new THREE.BoxGeometry(Math.max(0.06, w - 0.3), 0.05, Math.max(0.06, d - 0.3)), strip); s.position.set(x, 0.93, z); roof.add(s); }
    const body = new THREE.Mesh(new THREE.BoxGeometry(RX * 2, 160, RZ - WZ), facadeMat({ lit: 0.28 })); body.position.set(0, -80.05, (RZ + WZ) / 2); roof.add(body);   // 脚下这栋楼
  }
  // 背后那栋更高的楼（= 那台机器的外壳）：正面在 z = WZ，门洞 x ∈ [-DW, DW]、y ∈ [0, DH] 平时被两扇「门」（招牌和底座）盖着
  const DW = 9.5, DH = 7.6, TW = RX, TH = 46;
  { const wall = facadeMat({ lit: 0.07, base: '#0a0a12', cell: [1.5, 2.1], glow: 0.55 });
    const add = (w, h, x, y, z, ry = 0) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wall); m.position.set(x, y, z); m.rotation.y = ry; roof.add(m); };
    add(TW - DW, 200, -(TW + DW) / 2, TH - 100, WZ); add(TW - DW, 200, (TW + DW) / 2, TH - 100, WZ); add(DW * 2, TH - DH, 0, (TH + DH) / 2, WZ);
    add(60, 200, TW, TH - 100, WZ - 30, Math.PI / 2); add(60, 200, -TW, TH - 100, WZ - 30, -Math.PI / 2); }
  // 远处的城
  { const rnd = mulberry32(31), N = 340, geo = new THREE.BoxGeometry(1, 1, 1), im = new THREE.InstancedMesh(geo, facadeMat({ lit: 0.34 }), N), M = new THREE.Matrix4();
    for (let i = 0; i < N; i++) { let x, z; do { x = (rnd() - 0.5) * 520; z = -330 + rnd() * 420; } while ((Math.abs(x) < 34 && z > -90 && z < 40) || (x > 20 && z > -44 && z < 26));      // 楼顶周围、数字串沿线和那块大读数周围不放楼
      const w = 12 + rnd() * 16, d = 12 + rnd() * 16, top = -70 + rnd() ** 2 * 100; M.makeScale(w, 220, d).setPosition(x, top - 110, z); im.setMatrixAt(i, M); }
    im.frustumCulled = false; roof.add(im); far.push(im); var cityMat = im.material; }

  // ---------------------------------------------------------------- 手机形巨屏（挂在背后那栋楼的外墙上，左上方）：她是从这里砸出来的
  const HOLE = V(-11, 13.5, WZ + 0.12);
  { const c = document.createElement('canvas'); c.width = 512; c.height = 1024; const g = c.getContext('2d'), rnd = mulberry32(8);
    g.fillStyle = '#141420'; g.fillRect(0, 0, 512, 1024); g.fillStyle = PAL.pink; g.fillRect(26, 40, 460, 944);
    g.translate(256, 512); for (let i = 0; i < 46; i++) { const a = rnd() * 6.283, w = 0.03 + rnd() * 0.05; g.fillStyle = i % 3 ? '#ff7db4' : '#ffffff'; g.beginPath(); g.moveTo(Math.cos(a) * 150, Math.sin(a) * 150); g.lineTo(Math.cos(a - w) * 900, Math.sin(a - w) * 900); g.lineTo(Math.cos(a + w) * 900, Math.sin(a + w) * 900); g.fill(); }
    g.strokeStyle = '#ffffff'; g.lineWidth = 4; for (let i = 0; i < 16; i++) { const a = rnd() * 6.283; g.beginPath(); g.moveTo(Math.cos(a) * 110, Math.sin(a) * 110); let r = 110; for (let k = 0; k < 4; k++) { r += 50 + rnd() * 70; g.lineTo(Math.cos(a + (rnd() - 0.5) * 0.25) * r, Math.sin(a + (rnd() - 0.5) * 0.25) * r); } g.stroke(); }
    g.fillStyle = '#05050a'; g.beginPath(); for (let i = 0; i < 18; i++) { const a = i / 18 * 6.283, r = (i % 2 ? 95 : 150) * (0.8 + rnd() * 0.4); g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.fill();
    g.setTransform(1, 0, 0, 1, 0, 0); g.strokeStyle = PAL.mint; g.lineWidth = 12; g.strokeRect(8, 8, 496, 1008);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 8.4), new THREE.MeshBasicMaterial({ map: t, color: hdr('#ffffff', 1.25) })); m.position.copy(HOLE).z -= 0.05; roof.add(m); }
  // 碎玻璃：从破洞里往外飞
  const NSH = 70, shards = new THREE.InstancedMesh(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute([0, 0.5, 0, -0.35, -0.3, 0, 0.4, -0.25, 0], 3)), new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide }), NSH); shards.frustumCulled = false; roof.add(shards);
  const shardD = (() => { const rnd = mulberry32(12), d = [], c = new THREE.Color(); for (let i = 0; i < NSH; i++) { const a = rnd() * 6.283, s = 1 + rnd() * 5; d.push({ v: V(Math.cos(a) * s + 2.5, Math.sin(a) * s + 1.5, 4 + rnd() * 9), r: V(rnd() * 6, rnd() * 6, rnd() * 6), w: V(rnd() * 9 - 4, rnd() * 9 - 4, rnd() * 9 - 4), s: 0.18 + rnd() * 0.5 }); shards.setColorAt(i, c.set(i % 3 ? '#ffd0e4' : '#ffffff').multiplyScalar(1.4)); } return d; })();
  const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _s = new THREE.Vector3(), _p = new THREE.Vector3();
  function drawShards(T) {
    const k = T - C2.t0; shards.visible = k < 2.2; if (!shards.visible) return;
    shardD.forEach((q, i) => { _p.copy(HOLE).addScaledVector(q.v, k * (1 - 0.18 * k)); _p.y -= 3.2 * k * k; shards.setMatrixAt(i, _m4.compose(_p, _q.setFromEuler(_e.set(q.r.x + q.w.x * k, q.r.y + q.w.y * k, q.r.z + q.w.z * k)), _s.setScalar(q.s))); });
    shards.instanceMatrix.needsUpdate = true;
  }

  // ---------------------------------------------------------------- P(DOOM) 读数招牌：两扇「门」上各半块
  const SZ = WZ + 0.9, DIG = 2.6, SY = 4.75;            // 牌面的 z；字牌高；字牌中心高度
  const leafL = new THREE.Group(), leafR = new THREE.Group(); roof.add(leafL, leafR);
  const housing = new THREE.MeshBasicMaterial({ color: '#12121c' }), trim = new THREE.MeshBasicMaterial({ color: hdr(PAL.pink, 1.7) }), back = new THREE.MeshBasicMaterial({ color: '#0b0b12' });
  for (const [leaf, sx] of [[leafL, -1], [leafR, 1]]) {
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(DW, DH), back); wall.position.set(sx * DW / 2, DH / 2, WZ + 0.02); leaf.add(wall);
    const base = new THREE.Mesh(new THREE.BoxGeometry(DW - 0.02, 3.0, 1.0), housing); base.position.set(sx * DW / 2, 1.5, WZ + 0.5); leaf.add(base);          // 底座 = 机器外壳
    const t1 = new THREE.Mesh(new THREE.BoxGeometry(DW - 0.02, 0.07, 0.07), trim); t1.position.set(sx * DW / 2, 3.02, WZ + 1.0); leaf.add(t1);
    const board = new THREE.Mesh(new THREE.PlaneGeometry(DW - 0.1, 4.4), housing); board.position.set(sx * DW / 2, 5.3, SZ - 0.1); leaf.add(board);
  }
  const pdoom = plate('P(DOOM)', PAL.pink, DIG); pdoom.mesh.position.set(-0.25 - pdoom.w / 2, SY, SZ); leafL.add(pdoom.mesh);
  const upping = [['I\'M', W('i\'m')], ['UPPING', W('upping')], ['MY', W('my')]].map(([t, at]) => ({ ...plate(t, PAL.lemon, 1.35), at }));
  { let x = -0.25 - pdoom.w; for (const p of upping) { p.mesh.position.set(x + p.w / 2, 2.15, WZ + 1.03); x += p.w + 0.12; leafL.add(p.mesh); } }      // 挂在底座正面（招牌下面左侧）：她下落的路线不经过这里
  // 读数：「0.」+ 一块块往后接的「9」。digits[i] 的接上时刻 at、掉下去的时刻 drop（超出楼角悬空的才掉）；66.98（FLOPs）整串收成 1 − 10⁻³⁰
  const zero = plate('0.', PAL.mint, DIG); zero.mesh.position.set(0.25 + zero.w / 2, SY, SZ); leafR.add(zero.mesh);
  const X9 = 0.25 + zero.w + 0.1;
  // 读数：「0.」+ 一块块往后接的「9」。0–6 是剧情 B 之前就有的（第 3 块在 P(doom) 那一拍接上，之后几块在舞台那几小节里接）；
  //   剧情 B 里 7 号起越接越快，一路接出楼角、在夜空里连成一长串；tCollapse（thirty）整串飞向 BIG 收拢
  const NN = 64, nine0 = plate('9', PAL.mint, DIG), STEP = nine0.w + 0.1, T_RUN = 0.8;
  const NINE = Array.from({ length: NN }, (_, i) => {
    const mat = i ? new THREE.MeshBasicMaterial({ map: nine0.mat.map, fog: false }) : nine0.mat, mesh = i ? new THREE.Mesh(nine0.mesh.geometry, mat) : nine0.mesh, p = { mesh, mat, w: nine0.w };
    p.x = X9 + i * STEP + p.w / 2; mesh.position.set(p.x, SY, SZ); mesh.frustumCulled = false; roof.add(mesh);
    p.at = i < 2 ? -1 : i === 2 ? tPdoom : i < 7 ? 60.6 + i * 0.7 : CUT.b + T_RUN * ((i - 6) / (NN - 7)) ** 0.55;      // 间隔越来越短
    return p;
  });
  const headX = T => X9 + STEP * (6 + (NN - 7) * clamp((T - CUT.b) / T_RUN) ** (1 / 0.55));      // 这一刻数字串的头在哪（连续）
  const X_END = X9 + (NN - 1) * STEP;
  const limit = plate('', PAL.lemon, DIG, { draw: { width: 640, fn(g, x) { g.textAlign = 'left'; g.fillText('1 − 10', x, 143); const w = g.measureText('1 − 10').width; g.font = `92px ${FONT}`; g.fillText('−30', x + w + 8, 92); } } });
  limit.mesh.position.set(0.25 + limit.w / 2, SY, SZ); leafR.add(limit.mesh);
  // 门缝上的 SAFETY 警示胶带（黄黑）：横贴在两扇门的合缝上（齐胸高）。门一裂开它从正中断成两截，各自还粘在一扇门上，在风里往门里甩，随后被扯下来吸进去
  const TAPE = { y: 0.95, half: 3.6, w: 0.62, z: WZ + 1.04, seg: 18 };
  const tapeTex = (() => { const c = document.createElement('canvas'); c.width = 1024; c.height = 152; const g = c.getContext('2d'); g.fillStyle = PAL.lemon; g.fillRect(0, 0, 1024, 152);
    g.fillStyle = '#14131a'; for (let x = -160; x < 1100; x += 64) for (const [y0, y1] of [[0, 34], [118, 152]]) { g.beginPath(); g.moveTo(x, y1); g.lineTo(x + 32, y1); g.lineTo(x + 32 + (y1 - y0), y0); g.lineTo(x + (y1 - y0), y0); g.fill(); }
    g.font = `76px ${FONT}`; g.textBaseline = 'middle'; g.textAlign = 'center'; for (const x of [128, 384, 640, 896]) g.fillText('SAFETY', x, 79);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; })();
  const tapeMat = new THREE.MeshBasicMaterial({ map: tapeTex, color: hdr('#ffffff', 1.0), side: THREE.DoubleSide, fog: false });
  const tapes = [-1, 1].map(sd => { const geo = new THREE.PlaneGeometry(1, 1, TAPE.seg, 1), uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, sd < 0 ? uv.getX(i) * 0.5 : 1 - uv.getX(i) * 0.5);      // 两截各用贴图的一半：合起来是一整条
    const m = new THREE.Mesh(geo, tapeMat); m.frustumCulled = false; roof.add(m); return { sd, m, pos: geo.attributes.position }; });
  // 右扇门上的白色检查标签 SAFE ENOUGH ✓（和漫画里是同一张）：门裂开后被风揭下来，翻着吸进门里
  const LABEL0 = V(1.75, 2.15, WZ + 1.035), label = (() => { const c = document.createElement('canvas'); c.width = 512; c.height = 300; const g = c.getContext('2d'); g.fillStyle = '#f4f1ea'; g.fillRect(0, 0, 512, 300); g.strokeStyle = '#14131a'; g.lineWidth = 8; g.strokeRect(14, 14, 484, 272);
    g.fillStyle = '#14131a'; g.font = `104px ${FONT}`; g.textBaseline = 'middle'; g.textAlign = 'left'; g.fillText('SAFE', 40, 98); g.fillText('ENOUGH', 40, 206);
    g.lineWidth = 22; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(372, 150); g.lineTo(410, 196); g.lineTo(474, 84); g.stroke();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; const m = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5 * 300 / 512), new THREE.MeshBasicMaterial({ map: t, color: hdr('#ffffff', 1.05), side: THREE.DoubleSide, fog: false })); roof.add(m); return m; })();
  function drawLabel(T, open) {
    const k = T - T_OPEN - 0.3, u = clamp(k / 0.6), e = u * u; label.visible = u < 1;
    label.position.set(lerp(LABEL0.x + open, 0, e), LABEL0.y + 0.9 * Math.sin(u * Math.PI), lerp(LABEL0.z + 0.6 * Math.sin(u * Math.PI), WZ - 6, e)); label.rotation.set(k > 0 ? 6 * k : 0, k > 0 ? 9 * k : 0, k > 0 ? 0.06 * Math.sin(T * 40) : 0);
    if (k <= 0 && T > T_OPEN) label.rotation.z = 0.05 * Math.sin(T * 60);      // 被揭下来之前先抖几下
  }
  function drawTape(T, open) {
    const k = T - T_OPEN, peel = eOut(k / 0.3), tear = clamp((k - 0.62) / 0.5), L = TAPE.half / TAPE.seg, glued = lerp(TAPE.half - 0.4, 0.5, peel);      // 风把它从门上一点点揭下来：还粘着的那截越来越短
    for (const tp of tapes) {
      tp.m.visible = tear < 1; if (!tp.m.visible) continue;
      let x = tp.sd * (open + 0.4 + glued), z = TAPE.z, y = TAPE.y;                               // 最外面粘着的那一头（跟着门扇走）
      if (tear > 0) { const e = tear * tear; x = lerp(x, 0, e); y = lerp(y, 2.6, e) + 0.8 * Math.sin(e * Math.PI); z = lerp(z, WZ - 6, e); }      // 整条被扯下来、吸进门里
      for (let i = 0; i <= TAPE.seg; i++) {
        const a = i * L, free = Math.max(0, a - glued * (1 - tear)), fl = k > 0 ? 0.16 * Math.min(1, free) * Math.sin(T * 26 - a * 2.4 + tp.sd) : 0;
        tp.pos.setXYZ(i, x, y + TAPE.w / 2 + fl, z); tp.pos.setXYZ(i + TAPE.seg + 1, x, y - TAPE.w / 2 + fl, z);      // PlaneGeometry 的顶点：先上排再下排
        const phi = k > 0 ? 1.45 * smooth((free - 0.25) / 0.7) + 0.3 * Math.min(1, free) * Math.sin(T * 19 + a * 1.8 + tp.sd * 2) : 0;      // 揭下来的那截朝门缝里弯、甩
        x -= tp.sd * L * Math.cos(phi) * (1 - 0.5 * tear); z -= L * Math.sin(phi);
      }
      tp.pos.needsUpdate = true;
    }
  }
  // 夜空里那块巨大的读数（剧情 B 后半）：P(DOOM) = 1 − 10⁻³⁰，下面一条心电图一样的线
  const CAM_END = V(X_END - 7, SY + 1.3, SZ + 6.5), BIGP = V(X_END + 20, 17, SZ - 10), BIG = new THREE.Group(); BIG.position.copy(BIGP); BIG.lookAt(CAM_END); BIG.visible = false; roof.add(BIG);
  const bigVal = (() => {                                  // 「1 − 10^n」：指数每跳一下重画一次
    const c = document.createElement('canvas'); c.width = 760; c.height = 270; const g = c.getContext('2d'), tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const mat = new THREE.MeshBasicMaterial({ map: tex, fog: false }), h = 12, w = h * c.width / c.height; let last = null;
    const draw = e => { if (e === last) return; last = e; g.fillStyle = '#0d0c14'; g.fillRect(0, 0, c.width, c.height); g.strokeStyle = PAL.lemon; g.lineWidth = 16; g.strokeRect(8, 8, c.width - 16, c.height - 16);
      g.fillStyle = '#F2EDE4'; g.font = `170px ${FONT}`; g.textBaseline = 'middle'; g.textAlign = 'left'; g.fillText('1 \u2212 10', 60, 143); const tw = g.measureText('1 \u2212 10').width; g.font = `96px ${FONT}`; g.fillStyle = e === '\u221230' ? '#F2EDE4' : PAL.pink; g.fillText(e, 68 + tw, 92); tex.needsUpdate = true; };
    draw('\u221230'); return { mesh: new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat), mat, w, h, draw }; })();
  const bigTag = plate('P(DOOM)', PAL.pink, 4.2); bigTag.mesh.position.set(-bigVal.w / 2 + bigTag.w / 2, 8.6, 0.2); BIG.add(bigVal.mesh, bigTag.mesh);
  const NE = 220, ecgPos = new Float32Array(NE * 3), ecgGeo = new THREE.BufferGeometry(); ecgGeo.setAttribute('position', new THREE.BufferAttribute(ecgPos, 3));
  const ecg = new THREE.Line(ecgGeo, new THREE.LineBasicMaterial({ color: hdr(PAL.lemon, 2.2), fog: false })); ecg.frustumCulled = false; BIG.add(ecg);
  // 越来越快的「跳」：收拢后第 k 秒已经跳了 beatN(k) 下（从每秒 8 下加到每秒 30 下）
  const beatN = k => 8 * k + 4 * k * k, T_HOLD = tCollapse + 0.12, hsh = n => { const x = Math.sin(n * 127.1 + 3.3) * 43758.5453; return x - Math.floor(x); };
  const EXPS = ['\u221230', '\u221230', '\u221229', '\u221231', '\u221230', '\u221228', '\u221233', '\u221230', '\u221227', '\u221236'];
  // 全城亮窗的光被抽成一条条线，吸向读数
  const NL = 320, lnPos = new Float32Array(NL * 6), lnCol = new Float32Array(NL * 6), lnGeo = new THREE.BufferGeometry(); lnGeo.setAttribute('position', new THREE.BufferAttribute(lnPos, 3)); lnGeo.setAttribute('color', new THREE.BufferAttribute(lnCol, 3));
  const drain = new THREE.LineSegments(lnGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); drain.frustumCulled = false; drain.visible = false; roof.add(drain);
  const lnD = (() => { const rnd = mulberry32(73), d = []; for (let i = 0; i < NL; i++) { const front = rnd() < 0.3; d.push({ o: V(BIGP.x - 150 + rnd() * 300, -45 + rnd() * 55, front ? 30 + rnd() * 60 : -46 - rnd() * 230), ph: rnd(), sp: 0.5 + rnd() * 0.8, th: rnd() * 0.75, warm: rnd() < 0.7 }); } return d; })();
  const cWarm = col('#ffe2a8');
  function drawBig(T) {
    const k = T - T_HOLD, on = k > 0 && T < CUT.c; BIG.visible = on; drain.visible = on;
    const prog = smooth(k / 2.5), n = beatN(Math.max(0, k)), pu = on ? Math.exp(-(n - Math.floor(n)) * 4) : 0;
    cityMat.uniforms.uGlow.value = on ? lerp(1.4, 0.35, pu) : 1.3; cityMat.uniforms.uDrain.value = on ? 0.94 * prog : 0;      // 每跳一下周围的灯暗一下；楼一栋栋彻底灭掉
    if (!on) return pu;
    const pop = eOut(k / 0.16);
    BIG.scale.setScalar(pop * (1 + (0.04 + 0.05 * prog) * pu) + 0.35 * Math.exp(-k / 0.08)); bigVal.mat.color.setScalar(1.2 + (1.3 + 1.2 * prog) * pu + 2.5 * Math.exp(-k / 0.2)); bigTag.mat.color.setScalar(1.2 + 0.5 * pu);
    bigVal.draw(k < 0.3 ? EXPS[0] : EXPS[Math.floor(hsh(Math.floor(n)) * EXPS.length)]);                                    // 指数在 −30 附近乱跳
    const ph0 = 2.2 * k + 1.6 * k * k, amp = 1 + 1.6 * prog;                                                                // 心电图：越来越快、越来越高
    for (let i = 0; i < NE; i++) { const x = (i / (NE - 1) - 0.5) * bigVal.w, u = x * 0.2 - ph0, ph = u - Math.floor(u), y = ph < 0.06 ? 2.6 * amp * Math.sin(ph / 0.06 * Math.PI) : ph < 0.12 ? -1.2 * amp * Math.sin((ph - 0.06) / 0.06 * Math.PI) : 0.12 * Math.sin(u * 40); ecgPos.set([x, -8.6 + y, 0.2], i * 3); }
    ecgGeo.attributes.position.needsUpdate = true;
    lnD.forEach((q, i) => { const a = clamp((prog * 1.25 - q.th) * 5), u = (q.ph + k * q.sp * (1 + prog)) % 1, e0 = u * u, e1 = Math.max(0, u - 0.07) ** 2, c = q.warm ? cWarm : cLem, b = a * (0.25 + 1.5 * u);
      _p.lerpVectors(q.o, BIGP, e0); lnPos.set([_p.x, _p.y, _p.z], i * 6); _p.lerpVectors(q.o, BIGP, e1); lnPos.set([_p.x, _p.y, _p.z], i * 6 + 3);
      lnCol.set([c.r * b * 1.6, c.g * b * 1.6, c.b * b * 1.6, c.r * b * 0.2, c.g * b * 0.2, c.b * b * 0.2], i * 6); });
    lnGeo.attributes.position.needsUpdate = lnGeo.attributes.color.needsUpdate = true;
    return pu;
  }
  // 火花：每块 9 砸上去 / 收拢时的一把
  const bursts = [...NINE.filter((p, i) => p.at > 0 && (i < 30 || i % 3 === 0)).map(p => ({ t: p.at, p: V(p.x - p.w / 2, SY, SZ + 0.1), n: 26 }))];
  const NP = bursts.reduce((a, b) => a + b.n, 0), spPos = new Float32Array(NP * 3), spCol = new Float32Array(NP * 3), spGeo = new THREE.BufferGeometry();
  spGeo.setAttribute('position', new THREE.BufferAttribute(spPos, 3)); spGeo.setAttribute('color', new THREE.BufferAttribute(spCol, 3));
  const sparks = new THREE.Points(spGeo, new THREE.PointsMaterial({ size: 3.4, sizeAttenuation: false, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); sparks.frustumCulled = false; roof.add(sparks);
  const spD = (() => { const rnd = mulberry32(55), d = []; for (const b of bursts) for (let i = 0; i < b.n; i++) { const a = rnd() * 6.283, s = 2 + rnd() * 8; d.push({ b, o: V((rnd() - 0.5) * (b.wide ?? 0.4), (rnd() - 0.5) * DIG, 0), v: V(Math.cos(a) * s * 0.8, Math.sin(a) * s + 2, 1 + rnd() * 5), life: 0.35 + rnd() * 0.5, hot: rnd() < 0.4 }); } return d; })();
  const cLem = col(PAL.lemon), cWht = col('#ffffff');
  function drawSparks(T) {
    spD.forEach((q, i) => { const k = T - q.b.t, a = k > 0 && k < q.life ? (1 - k / q.life) ** 2 : 0, dr = k > 0 ? (1 - Math.exp(-k * 3)) / 3 : 0, c = q.hot ? cWht : cLem;
      spPos.set([q.b.p.x + q.o.x + q.v.x * dr, q.b.p.y + q.o.y + q.v.y * dr - 4.9 * Math.max(0, k) ** 2, q.b.p.z + q.v.z * dr], i * 3); spCol.set([c.r * 2.4 * a, c.g * 2.4 * a, c.b * 2.4 * a], i * 3); });
    spGeo.attributes.position.needsUpdate = spGeo.attributes.color.needsUpdate = true;
  }
  const T_OPEN = 71.6, OPEN = 2.4;                      // 门开的时刻；每扇滑开多少（只裂开一道 4.8 m 的缝）
  let bigPulse = 0;
  function drawSign(T) {
    const collapsed = T >= tCollapse, open = eOut((T - T_OPEN) / 0.6) * OPEN, off = T > T_OPEN ? Math.max(0.12, 1 - smooth((T - T_OPEN - 0.3) / 0.5)) * (0.6 + 0.4 * Math.sin(T * 70)) : 1;
    leafL.position.x = -open; leafR.position.x = open;
    pdoom.mat.color.setScalar(1.25 * off);
    for (const p of upping) { const a = T - p.at; p.mesh.visible = T < CUT.s1 + 0.1; p.mat.color.setScalar(a >= 0 ? 1.15 + 0.9 * Math.exp(-a / 0.25) : 0.3); }
    zero.mesh.visible = !collapsed; zero.mat.color.setScalar(1.25);
    const kc = (T - tCollapse) / 0.3;
    for (const p of NINE) {
      const a = T - p.at; p.mesh.visible = a > -0.1 && kc < 1; if (!p.mesh.visible) continue;
      const fall = a < 0 ? 5.5 * (-a / 0.1) ** 1.5 : 0; p.mesh.position.set(p.x, SY + fall, SZ); p.mesh.scale.setScalar(a >= 0 ? 1 + 0.16 * Math.exp(-a / 0.07) : 1); p.mat.color.setScalar(a >= 0 ? 1.25 + 2.2 * Math.exp(-a / 0.2) : 1.4);
      if (kc > 0) { p.mesh.position.lerp(BIGP, kc * kc); p.mesh.scale.setScalar(1 - 0.6 * kc); p.mat.color.setScalar(2.2); }      // 收拢：整串飞向夜空里那块大读数
    }
    limit.mesh.visible = T >= CUT.c; limit.mat.color.setScalar(1.3 * off);
    bigPulse = drawBig(T);
    drawTape(T, open); drawLabel(T, open);
    drawSparks(T);
  }

  // ---------------------------------------------------------------- 机器里面（门洞后面）：朝里排的亮窗机柜通道 + 一层层节点平面。只在门开之后画
  const AX = 3.6, R_T = 30;                             // 轴线高度；通道半宽
  const inside = new THREE.Group(); inside.visible = false; scene.add(inside);
  { const rnd = mulberry32(91), rings = 86, per = 28, N = rings * per, im = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), facadeMat({ tint: PAL.mint, lit: 0.8, cell: [1.25, 1.55], base: '#0a1416', glow: 1.9, haze: '#3d3a16' }), N), M = new THREE.Matrix4();
    let n = 0; for (let j = 0; j < rings; j++) for (let s = 0; s < 4; s++) for (let m = 0; m < 7; m++) {
      const u = -R_T + (m + 0.5) * (2 * R_T / 7), pr = rnd() * 6, d = R_T + 5 - pr, z = WZ - 7 - j * 9 - rnd() * 2, sz = 8.4;
      const [x, y] = s === 0 ? [u, AX - d] : s === 1 ? [u, AX + d] : s === 2 ? [-d, AX + u] : [d, AX + u];
      M.makeScale(sz, sz, 8.8).setPosition(x, y, z); im.setMatrixAt(n++, M); }
    im.count = n; im.frustumCulled = false; inside.add(im);
    for (const [x, y, c] of [[-R_T + 1, AX - R_T + 1, PAL.pink], [R_T - 1, AX - R_T + 1, PAL.pink], [-R_T + 1, AX + R_T - 1, PAL.mint], [R_T - 1, AX + R_T - 1, PAL.mint], [-10, AX - R_T + 1.2, PAL.lemon], [10, AX - R_T + 1.2, PAL.lemon], [-R_T + 1.2, AX, PAL.lemon], [R_T - 1.2, AX, PAL.lemon]]) {   // 沿通道的灯带
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 780), new THREE.MeshBasicMaterial({ color: hdr(c, 1.7), fog: false })); m.position.set(x, y, WZ - 400); inside.add(m); }
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(150, 150), new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 1.5), fog: false })); glow.position.set(0, AX, WZ - 790); inside.add(glow);   // 尽头的光
    const cap = new THREE.Mesh(new THREE.PlaneGeometry(2 * R_T + 20, 2 * R_T + 20), new THREE.MeshBasicMaterial({ color: '#05060a', side: THREE.BackSide })); cap.position.set(0, AX, WZ - 0.3); inside.add(cap);
    // 把门洞留出来：cap 是整面，门洞靠两扇门自己挡 / 让；这里再压一圈门框灯
    const fr = new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 1.6) });
    for (const [w, h, x, y] of [[DW * 2, 0.12, 0, DH]]) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.12), fr); m.position.set(x, y, WZ + 0.05); inside.add(m); }
  }
  // 节点层（出口规格）：6 列 × 4 行，列距 6 m、行距 5 m，层距 40 m；第一层在她 74.78 所在的位置
  // 节点层（出口规格）：6 列 × 4 行，列距 6 m、行距 5 m，层距 40 m；第一层在她 74.78 所在的位置
  const SPEED = 50, T_ACC0 = 73.0, T_ACC1 = 73.8, zFly = T => { const a = SPEED / (T_ACC1 - T_ACC0), k = clamp(T - T_ACC0, 0, T_ACC1 - T_ACC0); return -(0.5 * a * k * k + SPEED * Math.max(0, T - T_ACC1)); };
  const Z_START = WZ - 1.3, Z_L1 = Z_START + zFly(C2.end), LAYERS = [];
  { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); g.strokeStyle = '#fff'; g.fillStyle = '#fff'; g.lineWidth = 7; for (const r of [26, 42, 58]) { g.beginPath(); g.arc(64, 64, r, 0, Math.PI * 2); g.stroke(); } g.beginPath(); g.arc(64, 64, 12, 0, Math.PI * 2); g.fill();
    const tex = new THREE.CanvasTexture(c), geo = new THREE.PlaneGeometry(2, 2), nodeAt = (i, j) => [(i - 2.5) * 6, AX + (j - 1.5) * 5];
    for (let k = 0; k < 16; k++) { const z = Z_L1 - k * 40, mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, fog: false }), g2 = new THREE.Group();
      for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) { const m = new THREE.Mesh(geo, mat), [x, y] = nodeAt(i, j); m.position.set(x, y, z); g2.add(m); }
      const pts = []; for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) for (const [di, dj] of [[0, 0], [1, 0], [0, 1]]) { const a = nodeAt(i, j), b = nodeAt((i + di) % 6, (j + dj) % 4); pts.push(a[0], a[1], z, b[0], b[1], z - 40); }
      const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); const lm = new THREE.LineBasicMaterial({ transparent: true, fog: false }); g2.add(new THREE.LineSegments(lg, lm));
      inside.add(g2); LAYERS.push({ z, mat, lm }); } }
  const cMint = col(PAL.mint), cDim = col('#4a4460');
  function drawLayers(T, zGirl) {
    for (const L of LAYERS) { const d = zGirl - L.z, lit = d <= 0.5 ? 1 : 0, near = Math.exp(-Math.max(0, d) / 60);       // 她穿过哪一层，那一层亮薄荷色；没到的层是暗灰紫，离得近了柠黄慢慢透出来
      L.mat.color.copy(lit ? cMint : cDim.clone().lerp(cLem, 0.75 * near)).multiplyScalar(lit ? 2.6 : 0.8 + 1.1 * near); L.lm.color.copy(lit ? cMint : cDim).multiplyScalar(lit ? 1.3 : 0.45); }
  }
  // 往门里吸的风：一道道朝门洞收拢的细线
  const NW = 110, wPos = new Float32Array(NW * 6), wGeo = new THREE.BufferGeometry(); wGeo.setAttribute('position', new THREE.BufferAttribute(wPos, 3));
  const wind = new THREE.LineSegments(wGeo, new THREE.LineBasicMaterial({ color: hdr('#e8fff6', 0.9), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })); wind.frustumCulled = false; roof.add(wind);
  const windD = (() => { const rnd = mulberry32(19), d = []; for (let i = 0; i < NW; i++) d.push({ o: V((rnd() - 0.5) * 30, rnd() * 9, 14 - rnd() * 8), ph: rnd(), sp: 1.1 + rnd() * 1.2 }); return d; })();
  function drawWind(T) {
    const k = T - T_OPEN; wind.visible = k > 0.1; if (!wind.visible) return; const tgt = V(0, AX, WZ - 6);
    windD.forEach((q, i) => { const u = (q.ph + k * q.sp) % 1, a = V().lerpVectors(q.o, tgt, u * u), b = V().lerpVectors(q.o, tgt, Math.min(1, u + 0.05) ** 2); wPos.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6); });
    wGeo.attributes.position.needsUpdate = true;
  }

  // 吸力：纸屑、光点打着旋被卷进门缝
  const ND = 220, debris = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide, fog: false }), ND); debris.frustumCulled = false; scene.add(debris);
  const debD = (() => { const rnd = mulberry32(64), d = [], c = new THREE.Color(), pal = [PAL.paper, PAL.paper, PAL.lemon, PAL.pink, PAL.mint];
    for (let i = 0; i < ND; i++) { d.push({ o: V((rnd() - 0.5) * 26, 0.2 + rnd() * 7, WZ + 2 + rnd() * 18), ph: rnd(), sp: 0.7 + rnd() * 0.9, r: rnd() * 6.28, s: i % 3 === 0 ? 0.09 : 0.2 + rnd() * 0.22, w: 3 + rnd() * 6 }); debris.setColorAt(i, c.set(pal[i % pal.length]).multiplyScalar(i % 3 === 0 ? 2.4 : 1.2)); } return d; })();
  const doorGlow = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.3, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), color: hdr(PAL.lemon, 1.6), blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); sp.position.set(0, 3.2, WZ + 0.6); scene.add(sp); return sp; })();
  function drawDebris(T) {
    const k = T - T_OPEN; debris.visible = k > 0; doorGlow.visible = k > 0; if (k <= 0) return;
    doorGlow.scale.setScalar(6 + 9 * eOut(k / 0.5)); doorGlow.material.opacity = (0.3 + 0.5 * Math.exp(-k * 2)) * (1 - smooth((T - 72.9) / 0.35));      // 门里的光：她被卷进去时压暗，看得见人
    const tgt = V(0, 2.6, WZ - 4);
    debD.forEach((q, i) => { const u = (q.ph + k * q.sp) % 1, e = u * u, a = q.r + u * q.w, sw = (1 - e) * 1.6; _p.lerpVectors(q.o, tgt, e); _p.x += Math.cos(a) * sw; _p.y += Math.sin(a) * sw * 0.7; if (e > 0.96) _p.z -= (e - 0.96) * 600;
      debris.setMatrixAt(i, _m4.compose(_p, _q.setFromEuler(_e.set(a * 3, a * 2, a)), _s.setScalar(q.s * (k < 0.2 ? k / 0.2 : 1) * smooth((_p.distanceTo(cam.position) - 1.5) / 2)))); });      // 贴着镜头飞过的缩掉，别一片糊住画面
    debris.instanceMatrix.needsUpdate = true;
  }

  // ---------------------------------------------------------------- 挂在镜头前的歌词牌（px 按 1920×1080；字高 ≈ 牌高 × 0.56）
  const hud = new THREE.Group(); hud.position.z = -1; cam.add(hud);
  const hudPlates = [];
  const hudRow = (defs, { y, h, right = null, left = null, center = null, on }) => {
    const ps = defs.map(([t, at, c]) => ({ ...plate(t, c ?? PAL.pink, 1), at, on })); const total = ps.reduce((a, p) => a + p.w * h, 0) + 14 * (ps.length - 1);
    let x = right != null ? right - total : center != null ? center - total / 2 : left;
    for (const p of ps) { p.px = [x + p.w * h / 2, y, h]; x += p.w * h + 14; p.mesh.material.depthTest = false; p.mesh.material.depthWrite = false; p.mesh.renderOrder = 20; hud.add(p.mesh); hudPlates.push(p); }
  };
  hudRow([['ONE', W('one'), PAL.mint], ['E', W('e'), PAL.mint], ['THIRTY', tCollapse, PAL.mint], ['FLOPS', tFlops, PAL.lemon], ['A', W('a'), PAL.mint], ['SECOND', W('second'), PAL.mint]], { y: 962, h: 150, center: 960, on: [W('one') - 0.07, CUT.c] });
  hudRow([['FORWARD', tFwd, PAL.mint]], { y: 112, h: 150, center: 960, on: [tFwd - 0.12, C2.end + 1] });
  const NSL = 90, slGeo = new THREE.BufferGeometry(); { const rnd = mulberry32(27), a = []; for (let i = 0; i < NSL; i++) { const th = rnd() * 6.283, r0 = 0.5 + rnd() * 0.5, r1 = r0 + 0.25 + rnd() * 0.6; a.push(Math.cos(th) * r0 * 1.78, Math.sin(th) * r0, 0, Math.cos(th) * r1 * 1.78, Math.sin(th) * r1, 0); } slGeo.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); }
  const speedLn = new THREE.LineSegments(slGeo, new THREE.LineBasicMaterial({ color: hdr('#dffff4', 1.4), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false, fog: false })); speedLn.renderOrder = 18; speedLn.frustumCulled = false; hud.add(speedLn);
  function drawHud(T) {
    { const u = clamp((T - T_PULL) / (C2.end - T_PULL)), a = T >= T_PULL && T < C2.end ? Math.sin(Math.PI * u) : 0; speedLn.visible = a > 0.01; speedLn.material.opacity = 0.75 * a; speedLn.scale.setScalar(1 + 0.5 * u); }
    const k = Math.tan(cam.fov * Math.PI / 360); hud.scale.set(k, k, 1);
    for (const p of hudPlates) { const a = T - p.at; p.mesh.visible = T >= p.on[0] && T < p.on[1]; p.mesh.position.set((p.px[0] - 960) / 540, (540 - p.px[1]) / 540, 0); p.mesh.scale.setScalar(p.px[2] / 540 * (a >= 0 ? lerp(0.9, 1, eOut(a / 0.1)) : 0.9)); p.mat.color.setScalar(a >= 0 ? 1.1 + 0.8 * Math.exp(-a / 0.25) : 0.3); }
  }

  // ---------------------------------------------------------------- 她
  const I = girl.dancer.S.info, _qp = new THREE.Quaternion(), _qr = new THREE.Quaternion(), _qq = new THREE.Quaternion();
  const sol = (name, sec) => { const m = getAnim(name); return m.solve(sec / m.srcPeriod, girl.dancer); };
  function addWorldRot(bone, axis, rad) { if (!rad) return; bone.parent.updateWorldMatrix(true, false); bone.parent.getWorldQuaternion(_qp); bone.getWorldQuaternion(_qq); _qr.setFromAxisAngle(axis, rad); bone.quaternion.copy(_qp.invert().multiply(_qr.multiply(_qq))); bone.updateMatrixWorld(true); }
  const AXX = V(1, 0, 0), AXY = V(0, 1, 0);
  // 把一根骨头（b → c 这一段）掰到指向世界方向 dir；w = 掰多少（0..1）
  function aim(b, c, dir, w = 1) { if (w <= 0 || !I[b] || !I[c]) return; const bone = I[b].bone, a = bone.getWorldPosition(V()), d = I[c].bone.getWorldPosition(V()).sub(a).normalize();
    _qr.setFromUnitVectors(d, dir.clone().normalize()); bone.parent.getWorldQuaternion(_qp); bone.getWorldQuaternion(_qq); const q0 = bone.quaternion.clone(); bone.quaternion.copy(_qp.invert().multiply(_qr.multiply(_qq))); bone.quaternion.slerpQuaternions(q0, bone.quaternion.clone(), w); bone.updateMatrixWorld(true); }
  function setGirl(T, pose, pos, yaw, { pitch = 0, hyaw = 0, expression = 'neutral', tiltX = 0, punch = null, reach = null } = {}) {
    scene.add(girl.root); girl.root.visible = true; girl.root.scale.setScalar(H); girl.root.position.copy(pos); girl.root.rotation.set(tiltX, yaw, 0, 'YXZ'); girl.root.updateMatrixWorld(true);
    girl.dancer.apply(pose); girl.root.updateMatrixWorld(true);
    if (pitch || hyaw) for (const [k, w] of [['Spine2', 0.15], ['Neck', 0.35], ['Head', 0.5]]) { addWorldRot(I[k].bone, AXY, hyaw * D2R * w); addWorldRot(I[k].bone, AXX, pitch * D2R * w); }   // 只在她面朝 -Z 时用（世界 X = 她的左右轴）
    if (punch) { aim('RightArm', 'RightForeArm', punch.dir, punch.w); aim('RightForeArm', 'RightHand', punch.dir, punch.w); }      // 出拳：右臂伸直指向前方
    if (reach) for (const sd of ['Right', 'Left']) { const to = reach.to.clone().sub(I[sd + 'Arm'].bone.getWorldPosition(V())); if (sd === 'Left') to.add(V(-0.5, -0.3, 0)); aim(sd + 'Arm', sd + 'ForeArm', to, reach.w); aim(sd + 'ForeArm', sd + 'Hand', to, reach.w); }      // 两只手朝一个点伸过去
    girl.setSkin('toon', T); if (girl.face) try { girl.face.update(T, { expression, camera: cam }); } catch { /* 她贴着镜头冲过来的那一两帧，脸的投影框算出界：这一帧不更新五官层 */ }
  }
  const LAND = V(6.2, 0, -3.3), T_LAND = bt(59.33);      // 落点；触地时刻（落在拍子上）
  const bez = (a, b, c, d, u) => { const v = 1 - u; return V().addScaledVector(a, v * v * v).addScaledVector(b, 3 * v * v * u).addScaledVector(c, 3 * v * u * u).addScaledVector(d, u * u * u); };
  const flyA = T => { const u = clamp((T - C2.t0) / (T_LAND - C2.t0)); return bez(V(HOLE.x, HOLE.y - 1.9, HOLE.z + 0.3), V(HOLE.x + 2.5, HOLE.y - 1.2, HOLE.z + 10), V(LAND.x + 6.5, 10, LAND.z + 1.5), LAND, u ** 1.15); };

  const place = (pos, look, fov, up = AXY) => { cam.fov = fov; cam.position.copy(pos); cam.up.copy(up); cam.lookAt(look); cam.updateProjectionMatrix(); cam.updateMatrixWorld(true); };
  const rndS = k => { const s = Math.sin(k * 127.1) * 43758.5453; return s - Math.floor(s); };
  const shakeAt = (T, t, a) => (T >= t ? a * Math.exp(-(T - t) * 9) * Math.sin((T - t) * 55) : 0);
  const basePost = (x = {}) => ({ bloom: { strength: 0.8, threshold: 1.0, radius: 0.75 }, chroma: 0.07, grade: { vignette: 0.36 }, ...x });

  // ================================================================ 剧情 A（58.42–59.78）：一个镜头——出拳冲出巨屏 → 落在楼顶站稳，身后是读数招牌 → 切舞台
  const CAM_A = V(4.4, 1.3, 2.4), LOOK_A = V(3.0, 3.5, WZ);
  function storyA(T) {
    inside.visible = false; for (const o of far) o.visible = true; skyMoon.visible = true; drawShards(T); drawSign(T); drawWind(T); drawDebris(T);
    const p = flyA(T), v = flyA(T + 0.03).sub(p), fly = sol('act__fly-idle', (T - C2.t0) * 1.0), landK = [[T_LAND - 0.5, 0.0], [T_LAND, 0.57], [T_LAND + 0.14, 1.0], [T_LAND + 0.4, 2.05]];
    const pose = T < T_LAND - 0.55 ? fly : blendSolved(fly, sol('move__hard-landing', pchip(landK, T)), smooth((T - (T_LAND - 0.55)) / 0.3));
    const yawFly = Math.atan2(v.x, v.z), yaw = lerp(yawFly, Math.PI, smooth((T - (T_LAND - 0.45)) / 0.4));
    setGirl(T, pose, T < T_LAND ? p : LAND, yaw, { punch: { dir: v, w: 1 - smooth((T - 58.72) / 0.22) } });      // 刚冲出来：平飞、右拳在前（接上一段最后那只拳头）
    const u = eIO((T - 58.68) / 0.62), sh = shakeAt(T, T_LAND, 0.07);
    const head = I.Head.bone.getWorldPosition(V()), fist = I.RightHand.bone.getWorldPosition(V()), body = head.clone().lerp(fist, 0.45), lead = fist.clone().addScaledVector(v.clone().normalize(), 1.25).add(V(-0.35, 0.3, 0));      // 头 0.3 秒镜头就在她拳头前面一米多、和她一起往后退
    const pos = V().lerpVectors(lead, CAM_A, u); pos.z -= 0.3 * smooth((T - T_LAND) / 0.45); pos.y += sh;
    place(pos, body.clone().lerp(LOOK_A, smooth((T - (T_LAND - 0.35)) / 0.45)), lerp(66, 62, u)); drawHud(T);
    const k = T - C2.t0;
    return { scene, camera: cam, post: basePost({ chroma: 0.07 + 0.5 * Math.exp(-k * 5),
      flash: T > CUT.s1 - 0.06 ? { amount: 0.55 * smooth((T - (CUT.s1 - 0.06)) / 0.06), color: '#ffffff' } : { amount: 0.8 * clamp(1 - k / 0.1), color: PAL.pink } }) };   // 开头：上一段的粉色还在 0.1 秒；结尾：白闪接舞台灯
  }
  // ================================================================ 剧情 B（65.69–69.33）：只有读数招牌。追着那串 9 跑 → 收拢成夜空里巨大的 1 − 10⁻³⁰ → 高频跳动
  function storyB(T) {
    inside.visible = false; for (const o of far) o.visible = true; skyMoon.visible = true; shards.visible = false; girl.root.visible = false; drawSign(T); drawWind(T); drawDebris(T);
    const hx = headX(T), k = T - tCollapse, prog = smooth((T - T_HOLD) / 2.5);
    let sh = shakeAt(T, T_HOLD, 0.3) + 0.22 * prog * bigPulse * (rndS(Math.floor(T * 30)) - 0.5); for (let i = 7; i < NN; i += 2) sh += shakeAt(T, NINE[i].at, 0.03);
    const pos = V(hx - 7, SY + 1.3 + sh, SZ + 6.5), look = V(hx + 7, SY + 0.3, SZ);                       // 像追火车：镜头在数字串头部侧后方，同速往前
    if (k > 0) {                                                                                         // 收拢之后：不停——绕着那块读数慢慢转、同时拉远，城在下面一片片暗下去
      const d0 = CAM_END.clone().lerp(BIGP, 0.12).sub(BIGP), orb = d0.clone().applyAxisAngle(AXY, -0.95 * eIO(clamp((T - T_HOLD) / 2.7))).multiplyScalar(1 + 0.55 * prog).add(BIGP); orb.y += 9 * prog + sh;
      pos.lerp(orb, eOut(k / 0.3)); look.lerp(BIGP.clone().add(V(0, -2.2 - 3 * prog, 0)), smooth(k / 0.22));
      BIG.lookAt(CAM_END.clone().lerp(orb, 0.55));                                                       // 牌面跟着转过来一半，始终读得了
    }
    place(pos, look, lerp(58, 50, smooth(k / 0.4))); drawHud(T);
    return { scene, camera: cam, post: basePost({ bloom: { strength: 0.9 + 0.25 * prog, threshold: 1.0, radius: 0.75 }, chroma: 0.08 + (0.1 + 0.3 * prog) * bigPulse + (k > 0 ? 0.7 * Math.exp(-k * 4) : 0), grade: { vignette: 0.36 + 0.2 * prog },
      flash: k > 0.1 ? { amount: Math.max(0.6 * Math.exp(-(k - 0.1) * 8), 0.1 * prog * bigPulse), color: '#ffffff' } : { amount: 0.3 * Math.exp(-(T - CUT.b) * 12), color: PAL.pink } }) };
  }
  // ================================================================ 剧情 C 前半（69.33–71.6）+ 抓门框（72.42–73.05）：两页动态漫画，见 shots/c2-tape-comic.js（#1058）
  const T_GRIP = 72.42, T_GONE = 73.05;
  const tape = await makeTapeComic(mv, { words, t0: CUT.c, tOpen: T_OPEN, tGrip: T_GRIP, tGone: T_GONE });
  // ================================================================ 剧情 C 后半（71.6–74.78）：招牌裂开一道缝，强光 + 吸力，她被卷进机器
  //   71.6 门缝打开、强光、纸屑往里卷，她护着头往后缩 → 71.95 转身想跑 → 72.25 脚被拽离地面，人横过来、背着身往门里滑，两只手朝外伸
  //   → 72.75 路过门边，手去够门扇的边、指尖擦了一下没抓住 → 72.9 起被一路卷进通道（脸还朝着外面）→ 73.5–74.2 在通道里被气流翻成头朝前 → 74.78 第一层节点平面
  const T_PULL = 74.3;
  const STAND = V(0.9, 0, -5.4), T_LIFT = 72.0, EDGE = V(OPEN - 0.05, 1.5, WZ + 0.55);
  const HIP_FLY = (() => { girl.root.position.set(0, 0, 0); girl.root.rotation.set(0, 0, 0); girl.root.scale.setScalar(H); girl.root.updateMatrixWorld(true); girl.dancer.apply(sol('act__fly-idle', 0.5)); girl.root.updateMatrixWorld(true); return I.Hips.bone.getWorldPosition(V()).y; })();      // 平飞姿势里胯离根多高（根在脚底的原点）
  function storyC3d(T) {
    inside.visible = true; shards.visible = false; drawSign(T); drawWind(T); drawDebris(T); for (const o of far) o.visible = false; skyMoon.visible = false;
    const lift = smooth((T - T_LIFT) / 0.25), drag = eIO((T - T_LIFT) / 0.42),      // 72.42 切手的特写前她已经被拖到门边
    z = T < T_ACC0 ? lerp(STAND.z, Z_START, drag) : Z_START + zFly(T), inT = smooth((T - T_ACC0) / 0.8);
    const yaw = lerp(Math.PI, 0, smooth((T - 71.78) / 0.22)) + Math.PI * eIO((T - 73.6) / 0.65);                       // 面朝门 → 转身朝外（想跑）→ 通道里被翻成头朝前
    const brace = sol('act__terrified', 0.85 + 0.5 * clamp((T - T_OPEN) / 0.6)), prone = sol('act__fly-idle', (T - T_OPEN) * 1.3);
    const pos = V(lerp(lerp(STAND.x, 1.25, drag), 0, inT), lerp(0, lerp(0.75, AX, inT) - HIP_FLY, lift) + 0.1 * lift * Math.sin(T * 17), z);      // 被拽倒后胯离地 0.75 m，进通道后升到轴线
    const grab = Math.exp(-(((T - 72.7) / 0.3) ** 2)), out = lift * (1 - smooth((T - 73.55) / 0.3));
    setGirl(T, blendSolved(brace, prone, lift), pos, yaw, { expression: 'surprised', reach: { to: grab > 0.4 ? EDGE : V(pos.x, pos.y + 2.2, pos.z + 6), w: Math.max(out * 0.85, grab) } });      // 两只手一直朝外伸；路过门边那一下去够门扇的边
    drawLayers(T, pos.z);
    // 镜头：楼顶上近处看她被拽进去 → 72.9 起跟进通道：她身后 9 m、轴线上方 1.5 m，沿轴线朝前看，fov 60
    const f = smooth((T - 72.5) / 0.5), sh = shakeAt(T, T_OPEN, 0.16) + 0.05 * (rndS(Math.floor(T * 30)) - 0.5) * (0.4 + f);
    const me = I.Spine2.bone.getWorldPosition(V());
    const pull = smooth((T - T_PULL) / (C2.end - T_PULL)), back = lerp(3.2, 9, pull);      // 手的特写切回来后镜头一直贴在她身后 3 米多（她够大）；最后 0.48 秒快速退到规格里的 9 m（速度线盖住）
    place(V().lerpVectors(V().lerpVectors(V(3.3, 1.25, -2.3), V(3.1, 1.1, -5.0), drag), V(0, lerp(pos.y + HIP_FLY + 0.9, AX + 1.5, pull), pos.z + back), f).add(V(sh, sh * 0.6, 0)), V().lerpVectors(V(me.x * 0.7 + 0.3, me.y + 0.5, me.z), V(0, AX + 1.5, pos.z - 60), f * pull).lerp(me.clone().add(V(0, 0.3, -1.5)), f * (1 - pull)), lerp(56, 60, f)); drawHud(T);      // 近处低机位盯着她
    const o = T - T_OPEN;
    return { scene, camera: cam, post: basePost({ bloom: { strength: lerp(0.95, 0.55, smooth((T - 72.9) / 0.3) * (1 - smooth((T - 73.6) / 0.4))), threshold: 1.0, radius: 0.75 }, chroma: 0.07 + 0.6 * Math.exp(-o * 4) + 0.12 * f + 0.6 * Math.sin(Math.PI * clamp((T - T_PULL) / (C2.end - T_PULL))) * (T < C2.end ? 1 : 0), flash: { amount: 0.6 * Math.exp(-o * 8), color: PAL.lemon } }) };
  }

  // ================================================================ 舞台（独立的演唱会空间：kits/stage.js）。组件出不来就用黑场 + 字幕占位，剧情镜头照常
  let stage = null; try { stage = await createStage(mv, { dancers: 8, variant: 'cross', lyrics: [[C2.t0, CUT.b + 0.6]] }); } catch (e) { console.warn('c2-v4：kits/stage.js 不可用，舞台段用占位：', e.message); }
  const stageShot = (id, t0, t1, plan) => {
    if (stage) return stage.shot({ id, t0, t1, plan, variant: 'cross' });      // 副歌 2 用 cross 这套（柠黄 / 粉 / 白的交叉光，8 人 V 字）；主歌 3 = pillars，副歌 4 = finale
    const s = new THREE.Scene(); s.background = col('#05050b'); const c = new THREE.OrthographicCamera(-8, 8, 4.5, -4.5, 0, 10); c.position.z = 5; const p = plate('STAGE PLACEHOLDER', PAL.pink, 1.4); s.add(p.mesh);
    return { id, t0, t1, transitionIn: { kind: 'cut' }, build: () => ({}), update: () => ({ scene: s, camera: c, post: {} }) };
  };

  const cutShot = (id, t0, t1, fn) => ({ id, t0, t1, transitionIn: { kind: 'cut' }, build: () => ({}), update: (_, T) => fn(T) });
  return [
    cutShot('c2-story-a', C2.t0, CUT.s1, storyA),
    stageShot('c2-stage', CUT.s1, CUT.b, [{ cam: 'dolly', beats: 5 }, 'orbit', 'screen']),      // 推（5 拍）→ 环绕 → 推近大屏
    cutShot('c2-story-b', CUT.b, CUT.c, storyB),
    cutShot('c2-story-c-comic', CUT.c, T_OPEN, tape.page1),      // 漫画第 1 页：胶带 → SAFE ENOUGH → 她看镜头 → SNAP
    cutShot('c2-story-c-3d', T_OPEN, T_GRIP, storyC3d),
    cutShot('c2-story-c-grip', T_GRIP, T_GONE, tape.page2),      // 漫画第 2 页：扣着门边 → 手松开
    cutShot('c2-story-c-3d-b', T_GONE, C2.end + 0.5, storyC3d),
  ];
}

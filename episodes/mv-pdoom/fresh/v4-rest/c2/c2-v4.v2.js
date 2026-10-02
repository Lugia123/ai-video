// shots/c2-v4.js — 副歌 2 v4（歌曲时间 58.42–74.78 s）。#1048
// 分镜：fresh/v4-rest/c2/plan.md（第二版，用户 10-02 通过）。剧情在楼顶，中间两次切到独立舞台唱（kits/stage.js）。
//
//   const shots = await makeC2V4(mv);   // c2-v4.html / c2-v4-half.html 单独挂；拼接页直接展开进镜头表
//
//   剧情 A  58.42–60.23  砸穿楼外墙上的手机巨屏飞出来 → 落在楼顶 → 面前的 P(DOOM) 读数招牌自己接上一块 9（0.99 → 0.999）
//   舞台 1  60.23–65.69  大全景 → C 位中景 → 推近大屏（I hear the basilisk boom / NVDA to the moon / The Omega Point's coming soon）
//   剧情 B  65.69–67.51  回楼顶：9 接出楼角悬在半空、往下掉；66.98 整串收成 1 − 10⁻³⁰
//   舞台 2  67.51–69.33  a second 的长音
//   剧情 C  69.33–74.78  2D：小铁丝网门、一把小锁、SAFE ENOUGH 标签 → 锁崩开 → 招牌像两扇门裂开，她被吸进机器；
//                        74.78 她刚穿过第一层节点平面（出口规格见 plan.md，接主歌 3）
// 单位：米（她身高 H = 2）。所有 update 都是歌曲时间 T 的纯函数；随机只用种子。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { mulberry32 } from '../kits/world.js';
import { createGirl, createGirlLights, loadAnims, getAnim } from '../kits/girl.js';
import { blendSolved } from '../../../assets/lib/dance3d.js';
import { createStage } from '../kits/stage.js';

export const ANIMS = ['act__fly-idle', 'act__leap-forward', 'move__hard-landing', 'act__look-distance', 'act__terrified'];
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
const LOCK_DIR = new URL('../../cast-cyber-girl/closeup/c2lock/', import.meta.url);
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
    uniforms: { uTint: { value: col(tint) }, uLit: { value: lit }, uCell: { value: new THREE.Vector2(...cell) }, uBase: { value: col(base) }, uGlow: { value: glow }, uHaze: { value: haze ? col(haze) : col('#000000') }, uHazeK: { value: haze ? 0.0042 : 0 } },
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
      uniform vec3 uTint, uBase, uHaze; uniform float uLit, uGlow, uHazeK; uniform vec2 uCell; varying vec3 vW; varying vec3 vN;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main(){
        vec3 n = abs(vN); vec3 c = uBase * (0.75 + 0.25 * n.z);
        if (n.y < 0.5) {
          vec2 g = vec2(n.x > 0.5 ? vW.z : vW.x, vW.y) / uCell, f = fract(g);
          float win = step(0.2, f.x) * step(f.x, 0.8) * step(0.25, f.y) * step(f.y, 0.75);
          float h = hash(floor(g) + n.x * 17.0);
          c += uTint * win * step(1.0 - uLit, h) * (0.6 + 0.4 * hash(floor(g) + 3.1)) * uGlow + vec3(0.015, 0.016, 0.03) * win;
        }
        c = mix(uHaze, c, exp(-length(vW - cameraPosition) * uHazeK));
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
}

export async function makeC2V4(mv) {
  const H = 2.0, HB = (mv.audio?.beat_period ?? 0.4545) / 2;
  const db = t => (mv.audio?.downbeats ?? []).reduce((a, b) => (Math.abs(b - t) < Math.abs(a - t) ? b : a), t);   // 最近的强拍
  const CUT = { s1: db(60.23), b: db(65.69), s2: db(67.51), c: db(69.33) };
  const words = mv.lyrics.lines.flatMap(l => l.words).filter(w => w.start > 58 && w.start < 76);
  const W = s => { const w = words.find(q => q.w.toLowerCase().replace(/[^a-z()']/g, '').startsWith(s)); if (!w) throw new Error('c2-v4：歌词里找不到 ' + s); return w.start; };
  const tPdoom = W('p(doom)'), tFlops = W('flops'), tReck = W('reckoned'), tFwd = W('forward');
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
  { const rnd = mulberry32(31), N = 260, geo = new THREE.BoxGeometry(1, 1, 1), im = new THREE.InstancedMesh(geo, facadeMat({ lit: 0.34 }), N), M = new THREE.Matrix4();
    for (let i = 0; i < N; i++) { let x, z; do { x = (rnd() - 0.5) * 520; z = -330 + rnd() * 420; } while (Math.abs(x) < 34 && z > -90 && z < 40);
      const w = 12 + rnd() * 16, d = 12 + rnd() * 16, top = -70 + rnd() ** 2 * 95; M.makeScale(w, 220, d).setPosition(x, top - 110, z); im.setMatrixAt(i, M); }
    im.frustumCulled = false; roof.add(im); far.push(im); }

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
  { let x = -0.25 - pdoom.w; for (const p of upping) { p.mesh.position.set(x + p.w / 2, 1.75, WZ + 1.03); x += p.w + 0.12; leafL.add(p.mesh); } }      // 挂在底座正面（招牌下面左侧）：她下落的路线不经过这里
  // 读数：「0.」+ 一块块往后接的「9」。digits[i] 的接上时刻 at、掉下去的时刻 drop（超出楼角悬空的才掉）；66.98（FLOPs）整串收成 1 − 10⁻³⁰
  const zero = plate('0.', PAL.mint, DIG); zero.mesh.position.set(0.25 + zero.w / 2, SY, SZ); leafR.add(zero.mesh);
  const X9 = 0.25 + zero.w + 0.1, tCollapse = tFlops;
  const NINE = Array.from({ length: 13 }, (_, i) => {
    const p = plate('9', PAL.mint, DIG); p.x = X9 + i * (p.w + 0.1) + p.w / 2; p.mesh.position.set(p.x, SY, SZ); roof.add(p.mesh);
    p.at = i < 2 ? -1 : i === 2 ? tPdoom : i < 7 ? 60.6 + i * 0.7 : CUT.b + (i - 7) * HB;                          // 舞台 1 那三小节里它在画外接着长
    p.drop = i >= 7 && p.at + 3 * HB < tCollapse - 0.05 ? p.at + 3 * HB : null;                                   // 悬在楼角外面的：掉下楼
    if (i >= 2 && i <= 4) { p.drop = CUT.b + [0.22, 0.62, 0.95][i - 2]; p.roof = true; }                               // 剧情 B：中间三块被震松，砸在她身边的楼顶上（之后就躺在那儿）
    return p;
  });
  const limit = plate('', PAL.lemon, DIG, { draw: { width: 640, fn(g, x) { g.textAlign = 'left'; g.fillText('1 − 10', x, 143); const w = g.measureText('1 − 10').width; g.font = `92px ${FONT}`; g.fillText('−30', x + w + 8, 92); } } });
  limit.mesh.position.set(0.25 + limit.w / 2, SY, SZ); leafR.add(limit.mesh);
  // 底座上的小铁丝网门（2D 关键画里那道）：C 段 3D 里只用来被弹飞
  const gate = (() => { const c = document.createElement('canvas'); c.width = 128; c.height = 176; const g = c.getContext('2d'); g.fillStyle = PAL.lemon; g.fillRect(0, 0, 128, 176); g.strokeStyle = '#2a2a33'; g.lineWidth = 3;
    for (let i = -176; i < 128; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 176, 176); g.stroke(); g.beginPath(); g.moveTo(i + 176, 0); g.lineTo(i, 176); g.stroke(); } g.lineWidth = 10; g.strokeRect(5, 5, 118, 166);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const m = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.5), new THREE.MeshBasicMaterial({ map: t, color: hdr('#ffffff', 1.5), side: THREE.DoubleSide })); roof.add(m); return m; })();
  const GATE0 = V(1.0, 0.8, WZ + 1.03);
  // 火花：每块 9 砸上去 / 掉下去 / 收拢时的一把
  const G_FALL = 17, T_HIT = Math.sqrt(2 * (SY - 0.2) / G_FALL), Z_HIT = SZ + 0.4 + 2.4 * T_HIT;
  const bursts = [...NINE.filter(p => p.at > 0).map(p => ({ t: p.at, p: V(p.x - p.w / 2, SY, SZ + 0.1), n: 34 })), ...NINE.filter(p => p.roof).map(p => ({ t: p.drop + T_HIT, p: V(p.x, 0.5, Z_HIT), n: 60, wide: 2 })), { t: tCollapse, p: V(6, SY, SZ + 0.1), n: 120, wide: 9 }];
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
  const T_OPEN = 71.6;
  function drawSign(T) {
    const collapsed = T >= tCollapse, open = eOut((T - T_OPEN) / 0.75) * 5.4, off = T > T_OPEN ? Math.max(0.12, 1 - smooth((T - T_OPEN - 0.3) / 0.5)) * (0.6 + 0.4 * Math.sin(T * 70)) : 1;
    leafL.position.x = -open; leafR.position.x = open;
    pdoom.mat.color.setScalar((1.25 + 1.3 * Math.exp(-Math.max(0, T - tPdoom) / 0.25) * (T >= tPdoom ? 1 : 0)) * off);
    for (const p of upping) { const a = T - p.at; p.mesh.visible = T < CUT.s1 + 0.1; p.mat.color.setScalar(a >= 0 ? 1.15 + 0.9 * Math.exp(-a / 0.25) : 0.3); }
    zero.mesh.visible = !collapsed; zero.mat.color.setScalar(1.25);
    for (const p of NINE) {
      const a = T - p.at; p.mesh.visible = a > -0.12 && (!collapsed || (!!p.roof && T < T_OPEN)); if (!p.mesh.visible) continue;
      const fall = a < 0 ? 5.5 * (-a / 0.12) ** 1.5 : 0; p.mesh.position.set(p.x, SY + fall, SZ); p.mesh.rotation.set(0, 0, 0);
      p.mesh.scale.setScalar(a >= 0 ? 1 + 0.16 * Math.exp(-a / 0.07) : 1); p.mat.color.setScalar(a >= 0 ? 1.25 + 2.2 * Math.exp(-a / 0.2) : 1.4);
      if (p.roof && T > p.drop) { const k = Math.min(T - p.drop, T_HIT), h = (T - p.drop - T_HIT); p.mesh.position.set(p.x, SY - 0.5 * G_FALL * k * k + (h > 0 ? 0.25 * Math.exp(-h * 9) * Math.abs(Math.sin(h * 22)) : 0), SZ + 0.4 + 2.4 * k); p.mesh.rotation.set(-Math.PI / 2 * (k / T_HIT) ** 1.5, 0, 0.5 * Math.sin(p.x) * (k / T_HIT)); p.mat.color.setScalar(h > 0 ? 0.55 + 1.5 * Math.exp(-h * 6) : 1.3); }
      else if (p.drop != null && T > p.drop) { const k = T - p.drop; p.mesh.position.set(p.x + 1.4 * k, SY - 4.9 * k * k, SZ + 1.2 * k); p.mesh.rotation.set(1.6 * k, 0, -2.6 * k); }
    }
    limit.mesh.visible = collapsed; const b = T - tCollapse; limit.mesh.scale.setScalar(collapsed ? 1 + 0.25 * Math.exp(-b / 0.09) : 1); limit.mat.color.setScalar((1.3 + 2.4 * Math.exp(-Math.max(0, b) / 0.3)) * off);
    // 小门：锁崩开后（T_OPEN）朝外弹飞
    const k = T - T_OPEN; gate.visible = T >= CUT.c; gate.position.set(GATE0.x + open + (k > 0 ? 2.6 * k : 0), GATE0.y + (k > 0 ? 5 * k - 6 * k * k : 0), GATE0.z + (k > 0 ? 7 * k : 0)); gate.rotation.set(k > 0 ? 5 * k : 0, k > 0 ? 7 * k : 0, 0); if (k > 1.2) gate.visible = false;
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
    for (const [w, h, x, y] of [[0.12, DH, -DW, DH / 2], [0.12, DH, DW, DH / 2], [DW * 2, 0.12, 0, DH]]) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.12), fr); m.position.set(x, y, WZ + 0.05); inside.add(m); }
  }
  // 节点层（出口规格）：6 列 × 4 行，列距 6 m、行距 5 m，层距 40 m；第一层在她 74.78 所在的位置
  const SPEED = 50, T_ACC0 = 72.0, T_ACC1 = 72.9, zFly = T => { const a = SPEED / (T_ACC1 - T_ACC0), k = clamp(T - T_ACC0, 0, T_ACC1 - T_ACC0); return -(0.5 * a * k * k + SPEED * Math.max(0, T - T_ACC1)); };
  const Z_START = -5.4, Z_L1 = Z_START + zFly(C2.end), LAYERS = [];
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

  // ---------------------------------------------------------------- 挂在镜头前的歌词牌（px 按 1920×1080；字高 ≈ 牌高 × 0.56）
  const hud = new THREE.Group(); hud.position.z = -1; cam.add(hud);
  const hudPlates = [];
  const hudRow = (defs, { y, h, right = null, left = null, center = null, on }) => {
    const ps = defs.map(([t, at, c]) => ({ ...plate(t, c ?? PAL.pink, 1), at, on })); const total = ps.reduce((a, p) => a + p.w * h, 0) + 14 * (ps.length - 1);
    let x = right != null ? right - total : center != null ? center - total / 2 : left;
    for (const p of ps) { p.px = [x + p.w * h / 2, y, h]; x += p.w * h + 14; p.mesh.material.depthTest = false; p.mesh.material.depthWrite = false; p.mesh.renderOrder = 20; hud.add(p.mesh); hudPlates.push(p); }
  };
  hudRow([['ONE', W('one'), PAL.mint], ['E', W('e'), PAL.mint], ['THIRTY', W('thirty'), PAL.mint], ['FLOPS', tFlops, PAL.lemon]], { y: 962, h: 150, left: 48, on: [W('one') - 0.07, CUT.s2] }      /* 左下：镜头摇定之后她在画面中间偏右，牌子不压她 */);
  hudRow([['FORWARD', tFwd, PAL.mint]], { y: 112, h: 150, center: 960, on: [tFwd - 0.12, C2.end + 1] });
  function drawHud(T) {
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
  function setGirl(T, pose, pos, yaw, { pitch = 0, hyaw = 0, expression = 'neutral', tiltX = 0, punch = null } = {}) {
    scene.add(girl.root); girl.root.visible = true; girl.root.scale.setScalar(H); girl.root.position.copy(pos); girl.root.rotation.set(tiltX, yaw, 0, 'YXZ'); girl.root.updateMatrixWorld(true);
    girl.dancer.apply(pose); girl.root.updateMatrixWorld(true);
    if (pitch || hyaw) for (const [k, w] of [['Spine2', 0.15], ['Neck', 0.35], ['Head', 0.5]]) { addWorldRot(I[k].bone, AXY, hyaw * D2R * w); addWorldRot(I[k].bone, AXX, pitch * D2R * w); }   // 只在她面朝 -Z 时用（世界 X = 她的左右轴）
    if (punch) { aim('RightArm', 'RightForeArm', punch.dir, punch.w); aim('RightForeArm', 'RightHand', punch.dir, punch.w); }      // 出拳：右臂伸直指向前方
    girl.setSkin('toon', T); if (girl.face) try { girl.face.update(T, { expression, camera: cam }); } catch { /* 她贴着镜头冲过来的那一两帧，脸的投影框算出界：这一帧不更新五官层 */ }
  }
  const LAND = V(6.2, 0, -3.3), T_LAND = 59.5;           // 落点；触地时刻
  const bez = (a, b, c, d, u) => { const v = 1 - u; return V().addScaledVector(a, v * v * v).addScaledVector(b, 3 * v * v * u).addScaledVector(c, 3 * v * u * u).addScaledVector(d, u * u * u); };
  const flyA = T => { const u = clamp((T - C2.t0) / (T_LAND - C2.t0)); return bez(V(HOLE.x, HOLE.y - 1.9, HOLE.z + 0.3), V(HOLE.x + 2.5, HOLE.y - 1.2, HOLE.z + 10), V(LAND.x + 6.5, 10, LAND.z + 1.5), LAND, u ** 1.15); };

  const place = (pos, look, fov, up = AXY) => { cam.fov = fov; cam.position.copy(pos); cam.up.copy(up); cam.lookAt(look); cam.updateProjectionMatrix(); cam.updateMatrixWorld(true); };
  const rndS = k => { const s = Math.sin(k * 127.1) * 43758.5453; return s - Math.floor(s); };
  const shakeAt = (T, t, a) => (T >= t ? a * Math.exp(-(T - t) * 9) * Math.sin((T - t) * 55) : 0);
  const basePost = (x = {}) => ({ bloom: { strength: 0.8, threshold: 1.0, radius: 0.75 }, chroma: 0.07, grade: { vignette: 0.36 }, ...x });

  // ================================================================ 剧情 A（58.42–60.23）：一个镜头，从破洞口一路后拉到她身后
  const CAM_A = V(4.4, 1.3, 2.4), LOOK_A = V(3.0, 3.5, WZ);
  function storyA(T) {
    inside.visible = false; for (const o of far) o.visible = true; skyMoon.visible = true; drawShards(T); drawSign(T); drawWind(T);
    // 她：从洞里出拳前冲的姿势飞出来（接上一段最后那只拳头）→ 空中转成落地 → 59.5 触地、蹲 → 站起、仰头
    const p = flyA(T), v = flyA(T + 0.03).sub(p), fly = sol('act__fly-idle', (T - C2.t0) * 1.0), landK = [[58.9, 0.0], [T_LAND, 0.57], [59.68, 1.0], [60.0, 2.0], [60.3, 2.2]];      // 出拳前冲（一只手在前）
    const pose = T < 58.8 ? fly : blendSolved(fly, sol('move__hard-landing', pchip(landK, T)), smooth((T - 58.8) / 0.35));
    const yawFly = Math.atan2(v.x, v.z), yaw = lerp(yawFly, Math.PI, smooth((T - 59.0) / 0.45));
    setGirl(T, pose, T < T_LAND ? p : LAND, yaw, { pitch: 46 * smooth((T - 59.72) / 0.25), expression: T > tPdoom ? 'surprised' : 'neutral', punch: { dir: v, w: 1 - smooth((T - 58.78) / 0.25) } });      // 刚冲出来：平飞、右拳在前（接上一段最后那只拳头）
    // 镜头：贴着破洞 → 急速后拉 → 停在她身后，招牌占上半屏；9 砸上去那一拍震一下
    const u = eIO((T - 58.72) / 0.75), sh = shakeAt(T, tPdoom, 0.12) + shakeAt(T, T_LAND, 0.06);
    const fwd = v.clone().normalize(), head = I.Head.bone.getWorldPosition(V()), fist = I.RightHand.bone.getWorldPosition(V()), body = head.clone().lerp(fist, 0.45), lead = fist.clone().addScaledVector(fwd, 1.25).add(V(-0.35, 0.3, 0));      // 头 0.3 秒镜头就在她拳头前面一米多、和她一起往后退：拳头迎着镜头
    const pos = V().lerpVectors(lead, CAM_A, eIO((T - 58.72) / 0.75)); pos.z -= 0.4 * smooth((T - 59.3) / 0.9); pos.y += sh;
    const look = body.clone().lerp(LOOK_A, smooth((T - 59.1) / 0.45));      // 一直跟着她，落地前才定到招牌
    place(pos, look, lerp(66, 62, u)); drawHud(T);
    const k = T - C2.t0;
    return { scene, camera: cam, post: basePost({ chroma: 0.07 + 0.5 * Math.exp(-k * 5) + 0.4 * Math.exp(-Math.max(0, T - tPdoom) * 6) * (T >= tPdoom ? 1 : 0),
      flash: T > CUT.s1 - 0.06 ? { amount: 0.55 * smooth((T - (CUT.s1 - 0.06)) / 0.06), color: '#ffffff' } : { amount: 0.8 * clamp(1 - k / 0.1), color: PAL.pink } }) };   // 开头：上一段的粉色还在；结尾：火花白闪接舞台灯
  }
  // ================================================================ 剧情 B（65.69–67.51）：9 接出楼角往下掉；镜头沿招牌从末端移回她身上
  function storyB(T) {
    inside.visible = false; for (const o of far) o.visible = true; skyMoon.visible = true; shards.visible = false; drawSign(T); drawWind(T);
    const pan0 = eIO((T - (CUT.b + 0.12)) / 0.55); let flinch = 0; for (const p of NINE) if (p.roof && T >= p.drop + T_HIT) flinch = Math.max(flinch, Math.exp(-(T - p.drop - T_HIT) / 0.2)); for (const p of NINE) if (p.at > CUT.b - 0.01 && T >= p.at) flinch = Math.max(flinch, Math.exp(-(T - p.at) / 0.16)); if (T >= tCollapse) flinch = Math.max(flinch, Math.exp(-(T - tCollapse) / 0.3));
    setGirl(T, sol('act__look-distance', lerp(2.75, 3.15, flinch)), LAND, Math.PI, { pitch: 30, hyaw: lerp(-38, -8, pan0), expression: 'surprised' });      // 抬着胳膊挡火花，每砸一下缩一下
    let sh = shakeAt(T, tCollapse, 0.14); for (const p of NINE) if (p.at > CUT.b - 0.01) sh += shakeAt(T, p.at, 0.05);
    const pan = eIO((T - (CUT.b + 0.12)) / 0.55);
    place(V().lerpVectors(V(3.9, 1.15, 0.9), V(4.3, 1.2, 1.5), pan).add(V(0, sh, 0)), V().lerpVectors(V(15.5, 4.6, SZ), V(5.6, 3.3, SZ), pan), 56); drawHud(T);
    const b = T - tCollapse;
    return { scene, camera: cam, post: basePost({ chroma: 0.07 + (b > 0 ? 0.6 * Math.exp(-b * 5) : 0), flash: b > 0 ? { amount: 0.5 * Math.exp(-b * 9), color: '#ffffff' } : { amount: 0.3 * Math.exp(-(T - CUT.b) * 12), color: PAL.pink } }) };
  }
  // ================================================================ 剧情 C 前半（69.33–71.6）：2D 关键画 —— 小锁
  const lockTex = {}; { const loader = new THREE.TextureLoader();
    for (const n of ['a', 'b', 'c', 'n']) { try { const t = await loader.loadAsync(new URL(`c2lock-${n}.png`, LOCK_DIR).href); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; lockTex[n] = t; }
      catch { const c = document.createElement('canvas'); c.width = 832; c.height = 464; const g = c.getContext('2d'); g.fillStyle = '#2a2c44'; g.fillRect(0, 0, 832, 464); g.fillStyle = '#F2EDE4'; g.font = '70px sans-serif'; g.textAlign = 'center'; g.fillText('c2lock-' + n + '（缺图）', 416, 250); lockTex[n] = new THREE.CanvasTexture(c); lockTex[n].colorSpace = THREE.SRGBColorSpace; } } }
  const sc2 = new THREE.Scene(); sc2.background = col('#06060b'); const cam2 = new THREE.OrthographicCamera(-8, 8, 4.5, -4.5, 0, 10); cam2.position.z = 5;
  const imgMat = new THREE.MeshBasicMaterial({ map: lockTex.c }), img = new THREE.Mesh(new THREE.PlaneGeometry(16, 16 * 928 / 1664), imgMat); sc2.add(img);
  const row2 = [['THAT', W('that')], ['WAS', W('was')], ['SAFE', W('safe')], ['ENOUGH', W('enough')], ['WE', W('we')], ['RECKONED', tReck]].map(([t, at], i) => ({ ...plate(t, i === 2 || i === 3 ? PAL.lemon : PAL.pink, 1), at }));
  { const h = 150 / 120, total = row2.reduce((a, p) => a + p.w * h, 0) + 0.12 * (row2.length - 1); let x = -total / 2; for (const p of row2) { p.mesh.position.set(x + p.w * h / 2, 4.5 - 104 / 120, 2); p.h0 = h; x += p.w * h + 0.12; sc2.add(p.mesh); } }
  const T_SAFE = W('safe'), SEG2 = [{ img: 'c', t0: CUT.c, t1: T_SAFE, zoom: [1.05, 1.14], c: [0.5, 0.5] }, { img: 'n', t0: T_SAFE, t1: tReck, zoom: [1.0, 1.07], c: [0.5, 0.47] }, { img: 'b', t0: tReck, t1: T_OPEN, zoom: [1.22, 1.27], c: [0.42, 0.37] }];   // c = 图上哪一点（0–1）对在画面正中
  function storyC2d(T) {
    let s = SEG2[0]; for (const q of SEG2) if (q.t0 <= T) s = q;
    imgMat.map = lockTex[s.img]; const z = lerp(s.zoom[0], s.zoom[1], (T - s.t0) / (s.t1 - s.t0)), k = kick(T, 0.1), pop = T >= tReck ? Math.exp(-(T - tReck) * 9) : 0;
    img.scale.setScalar(z); img.position.set((0.5 - s.c[0]) * 16 * z + 0.06 * k * Math.sin(T * 90) + 0.25 * pop * Math.sin((T - tReck) * 60), (s.c[1] - 0.5) * 16 * 928 / 1664 * z - 0.45 + 0.05 * k * Math.cos(T * 77), 0);       // 每个鼓点锁都在抖
    for (const p of row2) { const a = T - p.at; p.mesh.scale.setScalar(p.h0 * (a >= 0 ? lerp(0.9, 1, eOut(a / 0.1)) : 0.9)); p.mat.color.setScalar(a >= 0 ? 1.1 + 0.9 * Math.exp(-a / 0.25) : 0.3); }
    return { scene: sc2, camera: cam2, post: { bloom: { strength: 0.5, threshold: 1.05 }, chroma: 0.05 + 0.5 * pop, grade: { vignette: 0.3 }, flash: { amount: 0.5 * pop + 0.25 * Math.exp(-(T - CUT.c) * 12), color: pop > 0.01 ? '#ffffff' : PAL.pink } } };
  }
  // ================================================================ 剧情 C 后半（71.6–74.78）：招牌裂开，被吸进机器
  const STAND = V(0.9, 0, -5.4);
  function storyC3d(T) {
    inside.visible = true; shards.visible = false; drawSign(T); drawWind(T); for (const o of far) o.visible = false; skyMoon.visible = false;
    const k = T - T_ACC0, lift = smooth(k / 0.45), z = Z_START + zFly(T);
    const pose = blendSolved(sol('act__terrified', 0.85 + 0.6 * clamp((T - T_OPEN) / 0.5)), sol('act__fly-idle', (T - T_OPEN) * 1.0), lift);
    const pos = V(lerp(STAND.x, 0, lift), lerp(0, AX - 1.9, lift), lerp(STAND.z, z, smooth(k / 0.3)));
    setGirl(T, pose, pos, Math.PI, { expression: 'surprised' });
    drawLayers(T, pos.z);
    // 镜头：楼顶上看招牌裂开（门里的光打出来）→ 跟着她飞进去：在她身后 9 m、轴线上方 1.5 m，沿轴线朝前看，fov 60
    const f = smooth((T - 72.05) / 0.85), sh = shakeAt(T, T_OPEN, 0.16) + 0.05 * (rndS(Math.floor(T * 30)) - 0.5) * f;
    place(V().lerpVectors(V(3.2, 2.3, 10.5), V(0, AX + 1.5, pos.z + 9), f).add(V(sh, sh * 0.6, 0)), V().lerpVectors(V(0, 4.2, WZ), V(0, AX + 1.5, pos.z - 60), f), lerp(52, 60, f)); drawHud(T);
    const o = T - T_OPEN;
    return { scene, camera: cam, post: basePost({ bloom: { strength: 0.9, threshold: 1.0, radius: 0.75 }, chroma: 0.07 + 0.6 * Math.exp(-o * 4) + 0.12 * f, flash: { amount: 0.6 * Math.exp(-o * 8), color: PAL.lemon } }) };
  }

  // ================================================================ 舞台（独立的演唱会空间：kits/stage.js）。组件出不来就用黑场 + 字幕占位，剧情镜头照常
  let stage = null; try { stage = await createStage(mv, { dancers: 8, variant: 'cross', lyrics: [[CUT.s1 + 0.2, CUT.b + 0.6], [CUT.b + 0.5, C2.end]] })      /* 字幕条不带上一句（I'm upping my P(doom) 是剧情 A 里唱的） */; } catch (e) { console.warn('c2-v4：kits/stage.js 不可用，舞台段用占位：', e.message); }
  const stageShot = (id, t0, t1, plan) => {
    if (stage) return stage.shot({ id, t0, t1, plan, variant: 'cross' });      // 副歌 2 用 cross 这套（柠黄 / 粉 / 白的交叉光，8 人 V 字）；主歌 3 = pillars，副歌 4 = finale
    const s = new THREE.Scene(); s.background = col('#05050b'); const c = new THREE.OrthographicCamera(-8, 8, 4.5, -4.5, 0, 10); c.position.z = 5; const p = plate('STAGE PLACEHOLDER', PAL.pink, 1.4); s.add(p.mesh);
    return { id, t0, t1, transitionIn: { kind: 'cut' }, build: () => ({}), update: () => ({ scene: s, camera: c, post: {} }) };
  };

  const cutShot = (id, t0, t1, fn) => ({ id, t0, t1, transitionIn: { kind: 'cut' }, build: () => ({}), update: (_, T) => fn(T) });
  return [
    cutShot('c2-story-a', C2.t0, CUT.s1, storyA),
    stageShot('c2-stage-1', CUT.s1, CUT.b, ['dolly', 'orbit', 'screen']),      // 推 → 环绕 → 推近大屏
    cutShot('c2-story-b', CUT.b, CUT.s2, storyB),
    stageShot('c2-stage-2', CUT.s2, CUT.c, [{ cam: 'dolly', reverse: true, bars: 1, expression: 'closed' }]),      // 正面，dolly 反向：慢慢拉出来（字幕整句读得全）
    cutShot('c2-story-c-2d', CUT.c, T_OPEN, storyC2d),
    cutShot('c2-story-c-3d', T_OPEN, C2.end + 0.5, storyC3d),
  ];
}

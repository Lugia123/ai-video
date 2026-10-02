// shots/c1.js — 副歌 1（歌曲时间 22.1–38.4 s），分镜照 TREATMENT.md §4「副歌 1」。
//
//   import { makeC1 } from './shots/c1.js';
//   const shots = makeC1(mv, { girl });   // girl = await createGirl(mv)；没有就传 null，用灰色胶囊人占位
//   mv.mount(shots, { offset: 22.1, duration: 16.3 });
//
// 切点不手写秒数：由歌词 + 人声能量 + 拍点算出来（cuts()）。
//   一句唱完 = 这句时间窗里人声能量最后一次 > 阈值的时刻（lyrics.json 的 end 常被拖到下一句开头，不准）；
//   切点 = 唱完 + 0.3 s 之后的第一个拍（副歌半小节~1 拍一切，TREATMENT §3）。
// 字一律放在「屏幕层」（挂在相机上的 overlay，按 type3d 的 fov30 / z=40 取景换算），先给人留位再摆字。

import * as THREE from 'three';
import { FX, PAL, textGeo } from '../kits/type3d.js';
import { createGirlLights } from '../kits/girl.js';
import { createVoxelGround, createShoggoth, createCity, chromeMatcap, mulberry32 } from '../kits/world.js';
import { createFluid, createShockwave, createParticles, sampleShape } from '../kits/vfx.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eInOut = p => { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2; };
const spring = k => (k < 0 ? 0 : Math.exp(-k * 9) * Math.cos(k * 30));
const col = c => new THREE.Color(c);

// ---------------------------------------------------------------- 时间：切点
function lineOf(mv, prefix) {
  const l = mv.lyrics.lines.find(x => x.text.toLowerCase().startsWith(prefix.toLowerCase()));
  if (!l) throw new Error(`c1：找不到歌词「${prefix}」`);
  return l;
}
// 人声真正唱完的时刻：[start, end] 里 vocal 能量最后一次 > thr
function vocalEnd(mv, line, thr = 0.3) {
  const A = mv.audio, fps = A.fps, v = A.vocal;
  for (let i = Math.floor(line.end * fps); i >= Math.ceil(line.start * fps); i--) if (v[i] > thr) return (i + 1) / fps;
  return line.end;
}
const beatAfter = (mv, t) => mv.audio.beats.find(b => b >= t - 1e-3);

export function cuts(mv) {
  const L = {
    up: lineOf(mv, "I'm upping"), foom: lineOf(mv, "'cause the future"), room: lineOf(mv, 'Trapped in the Chinese'),
    shroom: lineOf(mv, 'with a bag'), lies: lineOf(mv, 'See through'), eyes: lineOf(mv, 'with your shinigami'),
  };
  const after = l => beatAfter(mv, vocalEnd(mv, l) + 0.3);
  const c = { start: 22.1, end: 38.4 };
  c.dance = beatAfter(mv, L.up.words[1].start + 0.3);         // 「UPPING」砸完再切
  c.foom = after(L.up);
  c.room = after(L.foom);
  c.fluid = after(L.room);
  c.shog = after(L.shroom);
  c.holo = after(L.lies);
  c.hud = mv.audio.downbeats.find(d => d >= c.holo + 0.5);     // 护目镜拉下来之后，下一个小节头进 HUD
  c.bullet = after(L.eyes);
  return { c, L };
}

// ---------------------------------------------------------------- 小工具
function persp(fov = 30) { return new THREE.PerspectiveCamera(fov, 16 / 9, 0.05, 500); }
// 屏幕层：挂在相机前 d 处，内部坐标 = type3d 取景（fov30、z=40 → 可视 38.1 × 21.4）
function overlay(scene, camera, d = 0.5) {
  const g = new THREE.Group();
  g.position.z = -d;
  g.scale.setScalar((2 * d * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / 21.44);
  camera.add(g);
  scene.add(camera);
  g.userData.pointK = d / 40;
  return g;
}
// 屏幕层里的 PointsMaterial：点径按真实距离衰减，挪到 d 处会放大 40/d 倍 → 在着色器里乘回去（type3d 每帧改 size，所以不能直接改 size）
function fixPoints(ov) {
  const k = ov.userData.pointK;
  ov.traverse(o => {
    const m = o.isPoints && o.material;
    if (!m || !m.isPointsMaterial || m.userData.pointK) return;
    m.userData.pointK = k;
    m.onBeforeCompile = sh => { sh.vertexShader = sh.vertexShader.replace('gl_PointSize = size;', `gl_PointSize = size * ${k.toFixed(6)};`); };
    m.customProgramCacheKey = () => `pk${k}`;
    m.needsUpdate = true;
  });
}
function scn(bg = PAL.ink) { const s = new THREE.Scene(); s.background = col(bg); return s; }
function shake(mv, t, amt = 0.02) {
  const k = mv.music.pulse('kick', t, { decay: 0.1 });
  return [Math.sin(t * 91.7) * k * amt, Math.cos(t * 77.3) * k * amt];
}
// 灰色胶囊人占位（girl.js 没交时用）：身高 1，脚底在原点，面朝 +Z
function capsuleGirl() {
  const root = new THREE.Group();
  const m = new THREE.MeshStandardMaterial({ color: '#8a8a94', roughness: 0.6 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.5, 6, 16), m); body.position.y = 0.4;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 14), m); head.position.y = 0.87;
  root.add(body, head);
  return { root, placeholder: true, dance() {}, pose() {}, setSkin() {}, beatOf: () => 0 };
}
// 中心化的挤出字（铬 / 纯色）
function word3d(text, { size = 1, depth = 0.3, material }) {
  const g = textGeo('anton', text, { size, depth, bevel: size * 0.02, curve: 5 });
  g.computeBoundingBox();
  const b = g.boundingBox;
  g.translate(-(b.max.x + b.min.x) / 2, -(b.max.y + b.min.y) / 2, -(b.max.z + b.min.z) / 2);
  return new THREE.Mesh(g, material);
}
// 屏幕空间调色层（护目镜 HUD 用）
function goggleLayer() {
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthTest: false, depthWrite: false,
    uniforms: { uT: { value: 0 }, uA: { value: 0 }, uDrop: { value: 0 }, uPink: { value: col(PAL.pink) }, uMint: { value: col(PAL.mint) } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: /* glsl */`
      uniform float uT, uA, uDrop; uniform vec3 uPink, uMint; varying vec2 vUv;
      void main(){
        vec2 p = vUv - 0.5; p.x *= 1.777;
        // 护目镜镜片：两片圆角椭圆拼成的视野，外面压暗
        float lens = length(vec2(p.x*0.62, p.y*1.05));
        float edge = smoothstep(0.44, 0.52, lens);
        vec3 c = vec3(0.0); float a = edge * 0.88;
        // 镜片边一道粉线
        float rim = 1.0 - smoothstep(0.0, 0.006, abs(lens - 0.445));
        c += uPink * rim * 1.6; a = max(a, rim);
        // 扫描线 + 粉色调
        float sl = 0.5 + 0.5*sin(vUv.y*1080.0*1.2);
        c += uPink * 0.05 * (1.0 - edge); a = max(a, 0.06*sl*(1.0 - edge));
        // 拉下护目镜：粉色帘从上往下扫过（uDrop 0→1），帘后就是 HUD
        float y = 1.0 - uDrop*1.15;
        float band = smoothstep(y - 0.02, y, vUv.y) * (1.0 - smoothstep(y + 0.10, y + 0.14, vUv.y));
        c = mix(c, uPink, band); a = max(a, band * step(0.001, uDrop) * step(uDrop, 0.999));
        gl_FragColor = vec4(c, a * uA);
      }`,
  });
  return new THREE.Mesh(new THREE.PlaneGeometry(38.1, 21.44), mat);
}

// ---------------------------------------------------------------- 汉字字墙贴图
const HANZI = '的一是不了人我在有他这中大来上国个到说们为子和你地出道也时年得就那要下以生会自着去之过家学对可她里后小么心多天而能好都然没日于起还发成事只作当想看文无开手十用主行方又如前所本见经头面公同三已老从动两长知民样现分将外但身些与高意进把法此实回二理美点月明其种声全工己话儿者向情部正名定女问力机给等几很业最间新什打便位因重被走电四第门相次东政海口使教西再平真听世气信北少关并内加化由却代军产入先山五太水万市眼体别处总才场师书比住员九笑性通目华报立马命张活难神数件安表原车白应路期叫死常提感金何更反合放做系计或司利受光王果亲界及今京务制解各任至清物台象记边共风战干接它许八特觉望直服毛林题建南度统色字请交爱让认算论百吃义科怎元社术结六功指思非流每青管夫连远资队跟带花快条院变联言权往展该领传近留红治决周保达办运武半候七必城父强步完革深区即求品士转量空甚众技轻程告江语英基派满式李息写呢识极令黄德收脸钱党倒未持音跑随注';
function hanziTexture(seed) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 1024;
  const g = cv.getContext('2d');
  g.fillStyle = '#0d0d14'; g.fillRect(0, 0, 1024, 1024);
  const rnd = mulberry32(seed), n = 12, s = 1024 / n;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `${Math.round(s * 0.72)}px "PingFang SC","Hiragino Sans GB","Noto Sans CJK SC","Microsoft YaHei",sans-serif`;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const r = rnd();
    g.fillStyle = r < 0.05 ? PAL.pink : r < 0.08 ? PAL.lemon : r < 0.5 ? '#6d6878' : '#3a3744';
    g.fillText(HANZI[Math.floor(rnd() * HANZI.length)], (i + 0.5) * s, (j + 0.53) * s);
  }
  // 格线
  g.strokeStyle = 'rgba(95,227,192,0.18)'; g.lineWidth = 2;
  for (let k = 0; k <= n; k++) { g.beginPath(); g.moveTo(k * s, 0); g.lineTo(k * s, 1024); g.stroke(); g.beginPath(); g.moveTo(0, k * s); g.lineTo(1024, k * s); g.stroke(); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

// ================================================================ 镜头
export function makeC1(mv, { girl: realGirl = null, holo = null } = {}) {
  const kits = { holo };
  const { c, L } = cuts(mv);
  const girl = realGirl ?? capsuleGirl();
  const M = mv.music;
  const b0 = girl.beatOf(M.barTime(M.barAt(c.start).i));
  // 编舞（整段副歌一张表，按拍）：侧步拍手 → 挥臂 → 下蹲跳 → 指天指地
  const choreo = [
    { beat: Math.round(b0), move: 'sideClap' },
    { beat: Math.round(b0) + 4, move: 'glowWave' },
    { beat: Math.round(b0) + 8, move: 'squatJump' },
    { beat: Math.round(b0) + 12, move: 'discoPoint' },
    { beat: Math.round(b0) + 16, move: 'glowWave', mirror: true },
    { beat: Math.round(b0) + 24, move: 'bodyRoll' },
    { beat: Math.round(b0) + 28, move: 'sideClap', mirror: true },
  ];
  // 顺序照 girl.js：先摆 root → 舞 / 姿势 → 皮肤
  const putGirl = (scene, T, { x = 0, y = 0, z = 0, yaw = 0, skin = 'toon', pose = null } = {}) => {
    scene.add(girl.root);
    girl.root.position.set(x, y, z); girl.root.rotation.set(0, yaw, 0); girl.root.scale.setScalar(1);
    if (pose) girl.pose(pose); else girl.dance(choreo, T);
    girl.setSkin(skin, T);
  };

  const GX = -0.55, GZ = 0.35;   // 跳舞镜头里她站的位置（P(DOOM) 楼在她右后方）
  const shots = [];

  // ---- 1. 22.1 整屏薄荷，黑字「I'M UPPING」砸入 ------------------------------------
  // 副歌重拍的字卡（TREATMENT：22.1 砸入）：第一帧「I'M」就在落地，「UPPING」砸在下一拍；百叶同时从后面甩过。
  // 这是开场字卡，比人声（22.76 / 23.0）早半拍到一拍出现 —— 总管要求开头 0.7 s 不许空画面。
  shots.push({
    id: 'c1-01-slam', t0: c.start, t1: c.dance, transitionIn: { kind: 'cut' },
    build() {
      const scene = scn(PAL.mint), camera = persp(30);
      camera.position.set(0, 0, 40);
      const ov = overlay(scene, camera);
      const [w0, w1] = L.up.words;
      const b1 = beatAfter(mv, c.start + 0.3);
      const words = [{ ...w0, start: c.start - 0.1, end: b1 }, { ...w1, start: b1, end: w1.end }];
      const fx = FX.slam({ words, color: PAL.ink, maxW: 26, maxH: 12, maxSize: 8 });
      ov.add(fx.group);
      const bars = [5.6, -5.6, 0].map((y, i) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(46, i === 2 ? 1.2 : 2.6), new THREE.MeshBasicMaterial({ color: PAL.ink }));
        m.position.set(0, y, -3); ov.add(m); return { m, i };
      });
      return { scene, camera, fx, bars };
    },
    update(S, T) {
      S.fx.update(T);
      const k = T - c.start;
      S.bars.forEach(({ m, i }) => {
        const p = clamp((k + 0.2 - i * 0.12) / 0.75);
        m.position.x = lerp(-44, 46, eInOut(p)) * (i === 1 ? -1 : 1);   // 中间那道反向
        m.visible = p > 0 && p < 1;
      });
      const [sx, sy] = shake(mv, T, 0.6);
      S.camera.position.set(sx, sy, 40 - k * 1.2);
      return { scene: S.scene, camera: S.camera, post: { bloom: 0 } };
    },
  });

  // ---- 2. 她开跳，身后 P(DOOM) 像楼一样立起来，数字 0.02 → 0.15 -----------------------------
  // 一拍一个机位：A 低机位仰拍全身（她 ≥ 60% 画高，P(DOOM) 楼在身后）→ B 中景膝上、绕她甩半圈
  //            → C 翻到 0.15 那一拍：闪光 + 镜头推向数字。
  shots.push({
    id: 'c1-02-dance', t0: c.dance, t1: c.foom, transitionIn: { kind: 'cut' },
    build() {
      const scene = scn(PAL.ink), camera = persp(40);
      scene.add(createGirlLights());
      scene.fog = new THREE.Fog(PAL.ink, 7, 18);
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({ color: '#0c0c12', roughness: 0.25, metalness: 0.7 }));
      floor.rotation.x = -Math.PI / 2; scene.add(floor);
      const grid = new THREE.GridHelper(40, 80, PAL.mint, PAL.mint);
      grid.material.transparent = true; grid.material.opacity = 0.14; grid.position.y = 0.002; scene.add(grid);
      const spot = new THREE.Mesh(new THREE.CircleGeometry(0.45, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.pink).multiplyScalar(0.35), transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
      spot.rotation.x = -Math.PI / 2; spot.position.set(GX, 0.004, GZ); scene.add(spot);
      // 楼：铬字 P(DOOM) 立在地上，宽 4.8；翻牌数字站在楼顶，同宽
      const tower = new THREE.Group(); tower.position.set(0.35, 0, -2.4); scene.add(tower);
      const chrome = word3d('P(DOOM)', { size: 1, depth: 0.5, material: new THREE.MeshMatcapMaterial({ matcap: chromeMatcap(), color: new THREE.Color(1.6, 1.6, 1.7) }) });
      chrome.geometry.computeBoundingBox();
      const bb = chrome.geometry.boundingBox, cw = bb.max.x - bb.min.x, chh = bb.max.y - bb.min.y;
      const ks = 4.8 / cw;
      const chromeHolder = new THREE.Group(); tower.add(chromeHolder);   // 底边在地上，按 y 缩放「长」出来
      chrome.scale.setScalar(ks); chrome.position.y = chh * ks / 2; chromeHolder.add(chrome);
      const topY = chh * ks;
      const pd = L.up.words[3];
      const lock = beatAfter(mv, pd.start + 0.5);                       // 最后一位落在拍上
      const flipOld = FX.flip({ rows: [{ text: '0.02', cell: [1.9, 2.7], spinFrom: c.start, lockTimes: [c.start, c.start, c.start, c.start] }], words: [{ w: '0.02', start: c.start, end: c.start + 1 }] });
      const flipNew = FX.flip({ rows: [{ text: '0.15', cell: [1.9, 2.7], spinFrom: pd.start + 0.15, lockTimes: [lock - 0.24, lock - 0.16, lock - 0.08, lock] }], words: [{ w: '0.15', start: pd.start, end: pd.end }] });
      const fs = 4.2 / 8.2;
      for (const f of [flipOld, flipNew]) { f.group.scale.setScalar(fs); f.group.position.y = topY + 2.7 * fs / 2 + 0.12; tower.add(f.group); }
      const b = mv.audio.beats.filter(x => x >= c.dance - 1e-3 && x < c.foom - 1e-3);   // 三个机位的起点
      return { scene, camera, tower, chrome, chromeHolder, flipOld, flipNew, pd, lock, topY, b };
    },
    update(S, T) {
      putGirl(S.scene, T, { x: GX, z: GZ, yaw: 0.1 });
      // P(DOOM) 楼在唱到「P(doom)」时从地里拔起来
      const kp = T - S.pd.start;
      S.chromeHolder.visible = kp >= 0;
      S.chromeHolder.scale.set(1, kp >= 0 ? eOut(kp / 0.16) + 0.08 * spring(kp - 0.16) : 0.001, 1);
      const swap = T >= S.pd.start + 0.15;
      S.flipOld.group.visible = !swap; S.flipNew.group.visible = swap;
      S.flipOld.update(T); S.flipNew.update(T);
      const [sx, sy] = shake(mv, T, 0.015);
      const cam = S.camera, [bA, bB, bC] = S.b;
      let flash = 0;
      if (T < bB) {                       // A 低机位仰拍全身，慢推
        const k = (T - bA) / (bB - bA);
        cam.fov = 44; cam.position.set(GX + 0.35 + sx, 0.16 + sy, GZ + 1.95 - 0.25 * k);
        cam.lookAt(GX + 0.55, 1.0, GZ - 1);   // 仰 ~16°：脚在画内，楼顶的数字也在画内
      } else if (T < bC) {                // B 中景膝上，绕她甩半圈（右 → 左）
        const k = eInOut((T - bB) / (bC - bB));
        const a = lerp(1.35, -1.25, k);
        cam.fov = 34; cam.position.set(GX + Math.sin(a) * 1.3 + sx, 0.66 + sy, GZ + Math.cos(a) * 1.3);
        cam.lookAt(GX, 0.64, GZ);
      } else {                            // C 翻到 0.15：闪光 + 推向数字
        const k = eOut((T - bC) / 0.4);
        cam.fov = 40; cam.position.set(lerp(-0.9, 0.3, k) + sx, lerp(0.8, 2.1, k) + sy, lerp(3.4, 1.4, k));
        cam.lookAt(0.35, S.topY + 0.55, -2.4);
      }
      cam.updateProjectionMatrix();
      const kl = T - S.lock;
      if (kl >= 0) flash = 0.55 * Math.exp(-kl * 10);
      return { scene: S.scene, camera: cam, post: { bloom: { strength: 0.8, threshold: 0.9 }, grade: { vignette: 0.3 }, flash: { amount: flash, color: PAL.lemon } } };
    },
  });

  // ---- 3. FOOM 爆成粒子 + 体素地面冲击波 ---------------------------------------------
  shots.push({
    id: 'c1-03-foom', t0: c.foom, t1: c.room, transitionIn: { kind: 'cut' },   // 上一镜刚闪过（翻到 0.15），这里硬切
    build() {
      const scene = scn(PAL.ink), camera = persp(40);
      const ground = createVoxelGround({ n: 48 }); scene.add(ground.mesh);
      const ring = createShockwave({ radius: 26, accent: PAL.pink }); ring.mesh.rotation.x = -Math.PI / 2; ring.mesh.position.y = 0.5; scene.add(ring.mesh);
      const ov = overlay(scene, camera);
      const fx = FX.burst({ line: L.foom, color: PAL.lemon, side: PAL.pink, particles: 4000 });
      fx.group.position.y = 1.6; fx.group.scale.setScalar(0.84); ov.add(fx.group); fixPoints(ov);
      const fw = L.foom.words.at(-1);
      const tBoom = fw.start + Math.min(0.45, Math.max(0.25, (fw.end - fw.start) * 0.5));   // 与 type3d.burst 的爆点一致
      return { scene, camera, ground, ring, fx, tBoom };
    },
    update(S, T) {
      S.fx.update(T);
      const bass = mv.music.energy('bass', T);
      S.ground.update(T, { amp: 0.2 + bass * 0.5, speed: 2.2, pulses: [{ t0: S.tBoom, amp: 3.2, speed: 13 }, { t0: S.tBoom + 0.45, amp: 1.6, speed: 13 }] });
      S.ring.update(T, { t0: S.tBoom, dur: 1.1 });
      const k = T - c.foom, kb = T - S.tBoom;
      const hit = kb > 0 ? Math.exp(-kb * 6) : 0;
      const a = 0.9 + k * 0.06;
      S.camera.position.set(Math.cos(a) * 30 + Math.sin(T * 70) * hit * 0.6, 13 + Math.cos(T * 63) * hit * 0.6 - k * 0.6, Math.sin(a) * 30);
      S.camera.lookAt(0, -3, 0);
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.6, threshold: 1.0 }, chroma: hit * 0.5 } };
    },
  });

  // ---- 4. 汉字字墙立方房间 ------------------------------------------------------------
  shots.push({
    id: 'c1-04-room', t0: c.room, t1: c.fluid, transitionIn: { kind: 'cut' },
    build() {
      const scene = scn('#07070b'), camera = persp(40);
      scene.add(createGirlLights({ key: 2.2, rim: 2.4 }));
      const texs = [0, 1, 2, 3, 4, 5, 6, 7].map(i => hanziTexture(900 + i));
      const W = 7, H = 4.2;
      const mk = (w, h) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: texs[0] })); scene.add(m); return m; };
      const back = mk(W, H); back.position.set(0, H / 2, -W / 2);
      const left = mk(W, H); left.position.set(-W / 2, H / 2, 0); left.rotation.y = Math.PI / 2;
      const right = mk(W, H); right.position.set(W / 2, H / 2, 0); right.rotation.y = -Math.PI / 2;
      const ceil = mk(W, W); ceil.position.set(0, H, 0); ceil.rotation.x = Math.PI / 2;
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, W), new THREE.MeshStandardMaterial({ color: '#141420', roughness: 0.8 }));
      floor.rotation.x = -Math.PI / 2; scene.add(floor);
      // 纸条从右墙缝里塞出来，上面打字
      const ov = overlay(scene, camera);
      const slip = new THREE.Group(); ov.add(slip);
      const paper = new THREE.Mesh(new THREE.BoxGeometry(15.5, 6.2, 0.1), new THREE.MeshBasicMaterial({ color: PAL.paper }));
      paper.rotation.z = -0.03; slip.add(paper);
      const tw = FX.typewriter({ line: L.room, color: PAL.ink, caret: PAL.pink, strike: PAL.pink, maxW: 12.5, maxH: 4.4, maxSize: 1.5, upper: true, font: 'mono' });
      tw.group.position.z = 0.2; slip.add(tw.group);
      return { scene, camera, walls: [back, left, right, ceil], texs, slip, tw };
    },
    update(S, T) {
      const bi = mv.music.beatAt(T).i;
      S.walls.forEach((w, i) => { w.material.map = S.texs[(bi * 3 + i * 5) % S.texs.length]; });
      S.tw.update(T);
      const k = T - c.room;
      S.slip.position.set(lerp(30, 8.6, eOut(k / 0.35)), 1.2, 0);
      putGirl(S.scene, T, { x: -0.75, z: -0.3, yaw: 0.35, pose: 'lookUp' });
      const bar = mv.music.barAt(T), push = (bar.i - mv.music.barAt(c.room).i) * 0.45 + eOut(bar.phase * 3) * 0.12;   // 每小节往里推一截
      S.camera.position.set(-0.25 + k * 0.05, 0.75, 2.9 - push);
      S.camera.lookAt(-0.05, 0.9, -1);
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.5, threshold: 0.9 }, grade: { vignette: 0.35 } } };
    },
  });

  // ---- 5. 字墙融化成流体，空心描边大字 --------------------------------------------------
  shots.push({
    id: 'c1-05-fluid', t0: c.fluid, t1: c.shog, transitionIn: { kind: 'wipe', dur: 0.36, color: PAL.mint },
    build() {
      const scene = scn(PAL.ink), camera = persp(30);
      camera.position.set(0, 0, 40);
      const fluid = createFluid({ width: 44, height: 24.75 }); fluid.mesh.position.z = -6; scene.add(fluid.mesh);
      const ov = overlay(scene, camera);
      const fx = FX.outline({ line: L.shroom, glow: 1.6 });
      ov.add(fx.group); fixPoints(ov);
      return { scene, camera, fluid, fx };
    },
    update(S, T) {
      S.fx.update(T);
      const k = T - c.fluid;
      S.fluid.update(T, { speed: 1.4, bands: 4, mix: 0.45, zoom: 1 + k * 0.08 });
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.7, threshold: 1.0 } } };
    },
  });

  // ---- 6. shoggoth：笑脸面具上写着 LIES，扫描线把面具烧掉 ---------------------------
  shots.push({
    id: 'c1-06-shoggoth', t0: c.shog, t1: c.holo, transitionIn: { kind: 'whip', dur: 0.3, dir: -1 },
    build({ stage }) {
      stage.renderer.localClippingEnabled = true;
      const scene = scn(PAL.ink), camera = persp(38);
      const sh = createShoggoth({ radius: 3 }); sh.group.position.y = -0.5; scene.add(sh.group);
      const clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), 10);
      const lies = word3d('LIES', { size: 0.62, depth: 0.12, material: new THREE.MeshBasicMaterial({ color: PAL.ink, clippingPlanes: [clip] }) });
      lies.position.set(0, 1.78, 0.12); sh.mask.add(lies);   // 字贴在面具上，跟着面具转头
      const ov = overlay(scene, camera);
      const small = FX.typewriter({ words: L.lies.words.slice(0, 4), color: PAL.paper, caret: PAL.mint, maxW: 30, maxH: 1.8, maxSize: 1.6, upper: true, font: 'mono' });
      small.group.position.y = 8.6; ov.add(small.group);
      const lw = L.lies.words.at(-1);
      return { scene, camera, sh, lies, clip, small, lw };
    },
    update(S, T) {
      const k = T - c.shog;
      const scan = smooth((T - (S.lw.start + 0.45)) / (c.holo - 0.35 - (S.lw.start + 0.45)));
      S.sh.update(T, { writhe: 1 + mv.music.energy('drums', T), mask: 1, scan });
      // 扫描线在面具局部坐标（半边 3.3）里的 y；字只留扫描线下方
      const kickS = 1 + 0.05 * mv.music.pulse('kick', T, { decay: 0.12 });
      const sy = (1 - scan * 2.2) * 3.3 * kickS + S.sh.group.position.y;
      S.clip.constant = scan > 0 ? sy : 100;
      const kl = T - S.lw.start;
      S.lies.visible = kl >= 0;
      S.lies.scale.setScalar(kl >= 0 ? eOut(kl / 0.12) * (1 + 0.1 * spring(kl - 0.12)) : 0);
      S.small.update(T);
      S.sh.group.scale.setScalar(kickS);   // 跟 kick 的轻微缩放脉冲
      const cx = Math.sin(k * 0.45) * 1.6;
      S.camera.position.set(cx, 0.3, 13 - k * 1.25);   // 慢推：3.6 s 推近 ~4.5
      S.camera.lookAt(0, -0.2, 0);
      // 笑脸微微转头盯着镜头
      S.sh.group.updateMatrixWorld(true);
      S.sh.mask.lookAt(S.camera.position);
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.8, threshold: 0.8 } } };
    },
  });

  // ---- 7a. 全息屏：她拉下护目镜（W1 hologram.js），右边打出这句 -------------------------
  shots.push({
    id: 'c1-07a-holo', t0: c.holo, t1: c.hud, transitionIn: { kind: 'cut' },
    build() {
      const scene = scn(PAL.ink), camera = persp(32);
      const holo = kits.holo;
      const H = 1.6, SW = H * 0.72, eyeY = H * (1 - 360 / 1150);   // rig 眼框中心（rig.json eye_box）→ 屏上高度（base:false，屏底在原点）
      const g = new THREE.Group(); g.position.set(-0.55, 0, 0); scene.add(g);
      if (holo) g.add(holo.mesh);
      // 护目镜：一片粉色半透明镜片 + 亮边，从屏顶滑到眼睛
      const visor = new THREE.Group(); g.add(visor);
      const lens = new THREE.Mesh(new THREE.PlaneGeometry(SW * 0.62, 0.24), new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.pink).multiplyScalar(1.4), transparent: true, opacity: 0.55, depthWrite: false }));
      const rim = new THREE.Mesh(new THREE.PlaneGeometry(SW * 0.66, 0.02), new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.pink).multiplyScalar(3) }));
      rim.position.y = 0.13; visor.add(lens, rim); visor.position.z = 0.02;
      const ov = overlay(scene, camera);
      const tag = FX.typewriter({ words: L.eyes.words.slice(0, 3), color: PAL.mint, caret: PAL.pink, maxW: 12, maxH: 6, maxSize: 1.7, upper: true, font: 'mono' });
      tag.group.position.set(9, 0, 0); ov.add(tag.group);
      return { scene, camera, holo, g, visor, eyeY, H, tag };
    },
    update(S, T) {
      const k = T - c.holo, dur = c.hud - c.holo;
      if (S.holo) {   // 共享的 holo：每帧挂回自己的组、摆好（别的段会把它挪走）
        S.g.add(S.holo.mesh); S.holo.mesh.visible = true;
        S.holo.mesh.position.set(0, 0, 0); S.holo.mesh.rotation.set(0, 0, 0); S.holo.mesh.scale.setScalar(S.H / (S.holo.height ?? S.H));
        S.holo.update(T, { line: L.eyes, expression: 'smile' });
      }
      const drop = eOut((k - dur * 0.3) / (dur * 0.35));
      S.visor.visible = k > dur * 0.3;
      S.visor.position.y = lerp(S.H + 0.3, S.eyeY, drop);
      S.tag.update(T);
      S.camera.position.set(0.25, 1.0, 3.3 - k * 0.35);   // 慢推
      S.camera.lookAt(0.25, 0.92, 0);
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.7, threshold: 0.9 } } };
    },
  });

  // ---- 7b. 护目镜 HUD：框选、标签、倒计时 -----------------------------------------------
  shots.push({
    id: 'c1-07b-hud', t0: c.hud, t1: c.bullet, transitionIn: { kind: 'flash', dur: 0.2, color: PAL.pink, peak: 0.7 },
    build() {
      const scene = scn(PAL.ink), camera = persp(30);
      scene.add(createGirlLights());
      const city = createCity({ seed: 3, n: 13 }); city.group.position.set(0, -0.02, -16); scene.add(city.group);
      scene.fog = new THREE.FogExp2(PAL.ink, 0.07);
      city.update(0, { draw: 1, extrude: 1, light: 1 });
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({ color: '#0c0c12', roughness: 0.4, metalness: 0.5 }));
      floor.rotation.x = -Math.PI / 2; floor.position.y = -0.001; scene.add(floor);
      const ov = overlay(scene, camera);
      const hud = FX.hud({ line: L.eyes, glow: 1.6, center: [0, 0] });
      ov.add(hud.group);
      const gl = goggleLayer(); gl.position.z = 1; gl.renderOrder = 10; ov.add(gl);
      return { scene, camera, city, hud, gl };
    },
    update(S, T) {
      const k = T - c.hud;
      S.city.update(T, { draw: 1, extrude: 1, light: 0.55 });
      putGirl(S.scene, T, { x: 0, yaw: 0 });
      S.hud.update(T);
      const u = S.gl.material.uniforms; u.uT.value = T; u.uA.value = 1; u.uDrop.value = 0;
      const [sx, sy] = shake(mv, T, 0.015);
      // 低一点的中景，绕她慢慢转 ~70°，每个小节头往里推一下
      const bar = mv.music.barAt(T), n = bar.i - mv.music.barAt(c.hud).i;
      const a = -0.5 + k * 0.35, d = 3.7 - n * 0.15 - eOut(bar.phase * 4) * 0.1;
      S.camera.position.set(Math.sin(a) * d + sx, 0.5 + sy, Math.cos(a) * d);
      S.camera.lookAt(0, 0.55, 0);
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.8, threshold: 0.85 }, grade: { tint: PAL.pink, tintAmount: 0.08 } } };
    },
  });

  // ---- 8. 子弹时间：定格在空中，相机环绕 180°，粒子拖尾 --------------------------------
  shots.push({
    id: 'c1-08-bullet', t0: c.bullet, t1: c.end + 0.5, transitionIn: { kind: 'whip', dur: 0.3, dir: 1 },
    build() {
      const scene = scn(PAL.ink), camera = persp(32);
      scene.add(createGirlLights());
      const P = createParticles({ count: 2600, seed: 8, size: 0.5, colors: [PAL.pink, PAL.mint, PAL.lemon], weights: [0.45, 0.4, 0.15] });
      // 定格的「飞溅」：她周围一圈拉长的环带，水平方向扁
      const pts = sampleShape('cloud', 2600, { radius: 0.32, seed: 9 });
      for (let i = 0; i < pts.length; i += 3) { pts[i] *= 1.8; pts[i + 1] = pts[i + 1] * 0.8 + 0.62; pts[i + 2] *= 1.2; }
      P.setShape('frozen', pts);
      scene.add(P.points);
      const floor = new THREE.Mesh(new THREE.CircleGeometry(3, 64), new THREE.MeshBasicMaterial({ color: '#101018' }));
      floor.rotation.x = -Math.PI / 2; floor.position.y = -0.35; scene.add(floor);
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.62, 0.64, 96), new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.mint).multiplyScalar(1.6) }));
      ring.rotation.x = -Math.PI / 2; ring.position.y = -0.34; scene.add(ring);
      return { scene, camera, P };
    },
    update(S, T) {
      const k = T - c.bullet, dur = c.end - c.bullet;
      putGirl(S.scene, T, { x: 0, y: 0.05, pose: 'airborne' });
      S.P.update(T, { from: 'frozen', p: 0, shimmer: 0 });
      const a = lerp(-0.2, Math.PI - 0.2, eInOut(k / dur));
      S.camera.position.set(Math.sin(a) * 2.6, 0.75 - 0.25 * Math.sin(Math.PI * clamp(k / dur)), Math.cos(a) * 2.6);
      S.camera.lookAt(0, 0.62, 0);
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.9, threshold: 0.8 }, grade: { saturation: 0.9, contrast: 1.08 } } };
    },
  });

  return { shots, cuts: c };
}

// shots/v4-03a.js — v4 主歌 2 前半（歌曲时间 38.4–52.8 s）：一条连续跑道的高速跑酷 → 断崖 → 跳伞式俯冲 → atoms rearranging。
// W3 #939 重做（用户反馈：太慢、场景不连贯、下落乱动）。52.8 起的 Sydney 段是 W2 的 shots/v4-03b.js。
//
//   const shots = await makeV403a(mv);   // 先 await initType3D()；v4-03.html 串 a + b
//
// 一个世界、一条路：W3 kits/world4.js 的 createSpiralRun（平路 → 《盗梦空间》螺旋下卷折叠 → 障碍群 → 断崖）。
//   · 她的位置 d(τ) = ∫ v(τ) dτ 沿路径连续累加，所有镜头（包括插入的特写）都是同一个 run 场景里换机位，
//     楼、灯、路面字、已经过的障碍在前后镜头里是同一批东西。
//   · τ(T) 是「动作时间」：跳跃最高点做速度坡度（slow-mo 0.12 s × 0.15 倍，然后 1.3 倍追回），其余时刻 τ = T，拍点不漂。
//   · 快：地速 11 → 15 m/s（她身高 2 m，约旧版 5 m/s 的 2.2–3 倍），跑步动作 ×1.8–1.9 倍速，
//     冲刺 FOV 拉伸、屏幕速度线、每步落地镜头微震、低机位贴地追拍。
// 下落（跳伞式）：冲出断崖 → spread-eagle（张开手脚、趴着、慢慢转正）→ 收手收腿成头朝下俯冲（手臂贴后、身体绷直），
//   两个关键姿态用 dance3d 的 solver 手摆 + 插值，叠风吹高频小抖；镜头从上方 / 侧上方跟着俯冲，速度线越来越密。
// 脸：W1 在修 —— 全程背影 / 侧后 / 俯视 / 远景，脸占画高 ≤ 12%。
//
// 镜头（切点在拍上 / 障碍动作点上）：
//   38.400 run      一镜到底贴地追拍：稳定高速跑，路面字 WE HAD A STABLE TRAINING RUN 被踩亮；41.34 起加速，远处路面开始卷起
//   42.053 gate     插入：闸门旁的固定低机位，手撑障碍转体撑越（vault-spin，越过点 42.96）
//   43.210 gap      追拍：run-jump-up 跳过 16 m 的断口，最高点顿帧 → 猛接；BUT NOW THE SINGULARITY'S 踩亮
//   44.779 wall     侧追：右侧蹬墙跑 → 蹬墙后翻离墙（wall-jump-off）→ 重落地（hard-landing）镜头震
//   46.900 slide    前方低机位回看：滑铲过横梁；路牌 ACCELERATING
//   47.507 cliff    追拍冲到断崖起跳 → 镜头停在崖边，看她飞出去、往下掉
//   48.350 skydive  跳伞：spread-eagle → 头朝下俯冲，镜头在上方跟着掉
//   49.779 atoms    坠落中化成粒子 → 斐波那契叶序盘 → 重组 → 铬色液态 → 她（沿用旧版），52.55 起扑向镜头变亮，交给 W2 的 Sydney
// 所有 update 都是 T 的纯函数。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { FX } from '../kits/type3d.js';
import { createSpiralRun, placeOnFrame, textTexture } from '../kits/world4.js';
import { createCity, mulberry32 } from '../kits/world.js';
import { createParticles } from '../kits/vfx.js';
import { phyllotaxisPoints } from '../kits/mathart.js';
import { createGirl, createGirlLights, loadAnims } from '../kits/girl.js';

export const ANIMS = ['move__run-fast__inplace', 'move__sprint-full__inplace', 'move__vault-spin', 'move__run-jump-up', 'move__wall-run', 'move__wall-jump-off',
  'move__hard-landing', 'move__run-slide'];

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIO = p => { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2; };
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const col = c => new THREE.Color(c);
const persp = (fov = 50) => new THREE.PerspectiveCamera(fov, 16 / 9, 0.05, 1200);

// ---------------------------------------------------------------- 姿态插值（dance3d spec：数字 / 数组 / 嵌套对象逐项 lerp）
function lerpSpec(a, b, p) {
  if (typeof a === 'number') return lerp(a, b ?? a, p);
  if (Array.isArray(a)) return a.map((x, i) => lerpSpec(x, b?.[i] ?? x, p));
  if (a && typeof a === 'object') { const o = {}; for (const k of new Set([...Object.keys(a), ...Object.keys(b || {})])) o[k] = a[k] == null ? b[k] : lerpSpec(a[k], b?.[k] ?? a[k], p); return o; }
  return a;
}
// 跳伞姿态（角色空间：X = 她的左手方向，Y = 头顶，Z = 面朝；手 pos 以臂长为单位、相对肩；脚 pos 以腿长为单位、相对静止位置）
const SPREAD = {                                   // spread-eagle：手臂外展上举成「W」，腿分开微屈，胸口挺起、抬头看前方
  spine: [-8, 0, 0], chest: [-10, 0, 0], neck: [-6, 0, 0], head: [-12, 0, 0], clavL: [0, 0, 10], clavR: [0, 0, -10],
  handL: { pos: [0.92, 0.28, -0.12], pole: [0.2, -1, -0.3], wrist: [0, 0, 0], grip: 0.1 }, handR: { pos: [-0.92, 0.28, -0.12], pole: [-0.2, -1, -0.3], wrist: [0, 0, 0], grip: 0.1 },
  footL: { pos: [0.32, 0.16, -0.3], pole: [0.2, 0, 1], pitch: 30 }, footR: { pos: [-0.32, 0.16, -0.3], pole: [-0.2, 0, 1], pitch: 30 },
};
const DIVE = {                                     // 头朝下俯冲：手臂贴身往后收、腿并拢绷直、脚尖绷
  spine: [2, 0, 0], chest: [-4, 0, 0], neck: [-8, 0, 0], head: [-16, 0, 0], clavL: [0, 0, -4], clavR: [0, 0, 4],
  handL: { pos: [0.24, -0.9, -0.3], pole: [0.3, 0, 1], wrist: [0, 0, 0], grip: 0.4 }, handR: { pos: [-0.24, -0.9, -0.3], pole: [-0.3, 0, 1], wrist: [0, 0, 0], grip: 0.4 },
  footL: { pos: [-0.03, 0.02, 0], pole: [0.1, 0, 1], pitch: 45 }, footR: { pos: [0.03, 0.02, 0], pole: [-0.1, 0, 1], pitch: 45 },
};
// 风吹：高频小抖（手、头、脚尖），幅度 amt
function windy(spec, T, amt) {
  const s = JSON.parse(JSON.stringify(spec)), n = k => Math.sin(T * (37 + k * 11.3) + k * 1.7) * 0.6 + Math.sin(T * (53 + k * 7.1) + k) * 0.4;
  s.head = [s.head[0] + 3 * amt * n(1), s.head[1] + 4 * amt * n(2), s.head[2] + 3 * amt * n(3)];
  for (const [h, k] of [['handL', 4], ['handR', 5]]) s[h].pos = s[h].pos.map((x, i) => x + 0.03 * amt * n(k + i));
  for (const [f, k] of [['footL', 8], ['footR', 9]]) s[f].pitch += 6 * amt * n(k);
  return s;
}

export async function makeV403a(mv) {
  const { music, lyrics } = mv;
  const L = p => lyrics.lines.find(l => l.start > 36 && l.text.toLowerCase().startsWith(p.toLowerCase()));
  const kick = (T, d = 0.12) => music.pulse('kick', T, { decay: d });
  await loadAnims(ANIMS);
  const girl = await createGirl(mv);
  const H = 2.0;                                   // 她的身高（米）
  const shots = [];

  // ================================================================ 时间：速度坡度 τ(T)（顿帧 → 追回），其余 τ = T
  // ramps：{ at（开始顿帧的歌曲时刻）, hold（顿帧时长）, rate（顿帧时的速度）, back（追回时长） }；追回段速率使 τ 在 at+hold+back 回到 T
  const ramps = [{ at: 44.10, hold: 0.12, rate: 0.15, back: 0.34 }, { at: 47.98, hold: 0.12, rate: 0.15, back: 0.34 }];
  const tauOf = T => {
    let tau = T;
    for (const r of ramps) {
      const lost = r.hold * (1 - r.rate), up = 1 + lost / r.back;
      if (T <= r.at) continue;
      if (T < r.at + r.hold) { tau -= (T - r.at) * (1 - r.rate); continue; }
      if (T < r.at + r.hold + r.back) { tau -= lost - (T - r.at - r.hold) * (up - 1); continue; }
    }
    return tau;
  };
  const rateOf = T => { for (const r of ramps) { if (T > r.at && T < r.at + r.hold) return r.rate; if (T >= r.at + r.hold && T < r.at + r.hold + r.back) return 1 + r.hold * (1 - r.rate) / r.back; } return 1; };

  // ================================================================ 事件（动作时间 τ）
  const E = {
    accel: 41.34,                                   // 「But now…」起加速
    vault: { start: 42.40, rate: 1.4, over: 0.56 },    // vault-spin：越过点 = 片段 0.785 s / 1.4
    jump: { start: 43.22, rate: 1.5, off: 0.38, land: 1.45 },  // run-jump-up：离地 0.57 / 1.5，落地 ≈ 2.17 / 1.5
    wall: { start: 44.85, rate: 1.1, a: 0.15 / 1.1, b: 0.95 / 1.1 },   // 旧 wall-run：侧墙跑窗口
    wallOff: { start: 45.72, rate: 1.6, a: 0.2 / 1.6, b: 1.23 / 1.6 },   // wall-jump-off：蹬墙后翻离墙
    land: { start: 46.35, rate: 2.0 },              // hard-landing：从空中接下来，本地 0.57 s 触地 → 46.635
    slide: { start: 46.90, rate: 1.4, low: 0.55 / 1.4 },   // run-slide：最低点
    cliff: { start: 47.60, rate: 1.5, off: 0.38 },   // run-jump-up 冲出断崖
  };
  E.landHit = E.land.start + 0.57 / E.land.rate;        // 片段本地 0.57 s 触地（index.json air 窗口）
  E.cliffOff = E.cliff.start + E.cliff.off;
  // 地速 v(τ)（m/s）：稳定 11 → 加速到 15；墙跑 12；落地冲击后 0.35 s 减到 5 再冲回 15
  const vOf = t => {
    let v = t < E.accel ? 11 : lerp(11, 15, smooth((t - E.accel) / 0.7));
    if (t > E.wall.start && t < E.wallOff.start + E.wallOff.b) v = Math.min(v, 12);
    const k = t - E.landHit; if (k > 0 && k < 0.6) v = lerp(5, 15, smooth(k / 0.6)) * (k < 0.05 ? 1 : 1);
    return v;
  };
  // d(τ) = ∫ v dτ：1 ms 步长积分表（只算一次，确定性）
  const T0 = 38.4, DT = 0.001, NT = Math.ceil((E.cliffOff + 0.2 - T0) / DT) + 2;
  const dTab = new Float64Array(NT); for (let i = 1; i < NT; i++) dTab[i] = dTab[i - 1] + vOf(T0 + (i - 0.5) * DT) * DT;
  const dRun = t => { const x = (t - T0) / DT; if (x <= 0) return vOf(T0) * (t - T0); if (x >= NT - 1) return dTab[NT - 1]; const i = Math.floor(x); return lerp(dTab[i], dTab[i + 1], x - i); };
  const D = { gate: dRun(E.vault.start + E.vault.over), gapA: dRun(E.jump.start + E.jump.off) + 0.4, gapB: dRun(E.jump.start + E.jump.land) - 0.4,
    wall: dRun(E.wall.start + E.wall.a) - 1, wallEnd: dRun(E.wallOff.start + E.wallOff.a) + 1, beam: dRun(E.slide.start + E.slide.low), cliff: dRun(E.cliffOff) + 0.3 };
  const vOff = vOf(E.cliffOff);

  // ================================================================ 世界：一条跑道
  // 歌词：三句（WE HAD… / BUT NOW… / AND YOU'RE…）每个词一块 LED 牌，唱到那一刻亮起；牌的位置在 build 时按「那一刻的机位」求出来（见 placeSigns）
  const lyricLines = [L('We had'), L('But now'), L('And you')];
  const obstacles = [
    { type: 'gate', d: D.gate - 0.15, len: 0.3, h: 1.0, move: 'vault-spin' },
    { type: 'gap', d: D.gapA, len: D.gapB - D.gapA, move: 'run-jump-up' },
    { type: 'wall', d: D.wall, len: D.wallEnd - D.wall, side: 1, h: 4.0, move: 'wall-run → wall-jump-off' },
    { type: 'beam', d: D.beam - 0.2, len: 0.4, y: 1.25, move: 'run-slide' },
  ];
  const run = createSpiralRun({ length: D.cliff + 30, roll: { start: dRun(40.4), end: dRun(46.2), turns: 1, radius: 8 }, words: [], obstacles, cliff: D.cliff, t0: T0, speed: 15 });
  // 路面是一整条固定的几何体：平路 → 整条路（连两侧街区）绕上方 8 m 的轴滚转一整圈（40.4–46.2 那段路，中间她头朝下跑在「天花板」上）→ 回正 → 断崖。
  //   不折叠、不随时间变形；重力 = 路面法线，她始终踩着路面，镜头跟她一起滚转（画面里她是正的，地面城市 / 月亮这些固定参照在转）
  const FOLD = () => 1;
  const scene = new THREE.Scene(); scene.background = col('#06060b'); scene.fog = new THREE.Fog('#06060b', 40, 230);
  scene.add(run.group, createGirlLights({ key: 2.2, rim: 2.6, fill: 1.0 }));
  // 歌词 LED 牌：墨底 + 粉边框，字平时暗、唱到时白热亮起（bloom），位置 / 朝向由 placeSigns 定
  const TXT_H = 1.8;
  function makeSign(w, line, li, from, until) {
    const g = new THREE.Group();
    const { texture, aspect } = textTexture(w.w.replace(/[,.]/g, '').toUpperCase(), { font: '"UIAnton", "Anton", Impact, sans-serif', px: 170 });
    const h = TXT_H, tw = h * aspect * 0.86, bw = tw + 0.6, bh = h + 0.45;
    const edgeMat = new THREE.MeshBasicMaterial({ color: col([PAL.pink, PAL.mint, PAL.lemon][li]).multiplyScalar(1.3), side: THREE.DoubleSide });
    const edge = new THREE.Mesh(new THREE.PlaneGeometry(bw + 0.2, bh + 0.2), edgeMat);
    const board = new THREE.Mesh(new THREE.PlaneGeometry(bw, bh), new THREE.MeshBasicMaterial({ color: '#0d0c14', side: THREE.DoubleSide })); board.position.z = 0.01;
    const txtMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, color: col(PAL.paper), side: THREE.FrontSide, depthWrite: false });
    const txt = new THREE.Mesh(new THREE.PlaneGeometry(tw, h), txtMat); txt.position.z = 0.02;
    const inner = new THREE.Group(); inner.add(edge, board, txt); g.add(inner); g.visible = false;
    scene.add(g);
    return { w, line, li, g, inner, txtMat, edgeMat, edgeCol: edgeMat.color.clone(), bw, bh, from, until, place: null };
  }
  const signs = lyricLines.flatMap((line, li) => line.words.map((w, wi) => makeSign(w, line, li, w.start, Math.min(line.end + 0.35, (line.words[wi + 3]?.start ?? Infinity) + 0.3))));   // 同屏最多 3–4 个词
  // 深渊：断崖外、按断崖处的「下」方向摆的一座远城（下落时越来越近）
  const fc0 = run.frameAt(D.cliff, 0, 1);
  const abyss = new THREE.Group(); scene.add(abyss);
  placeOnFrame(abyss, { pos: fc0.pos, forward: fc0.forward, up: fc0.up });
  const city = createCity({ seed: 31, n: 25 }); city.update(0, { draw: 1, extrude: 1, light: 1 });
  city.group.scale.setScalar(6); city.group.position.set(0, -140, 60); abyss.add(city.group);
  // 固定参照（不跟路面转）：上半天的星、前方天上一轮粉月 —— 路面滚转时，画面里是它们和下面的城在转
  { const rnd = mulberry32(77), n = 900, p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const a = rnd() * Math.PI * 2, e = Math.asin(0.08 + rnd() * 0.92), r = 320; p.set([Math.cos(a) * Math.cos(e) * r, Math.sin(e) * r, Math.sin(a) * Math.cos(e) * r - 80], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: col(PAL.paper).multiplyScalar(1.4), size: 1.6, sizeAttenuation: false, fog: false })));
    const moon = new THREE.Mesh(new THREE.CircleGeometry(26, 64), new THREE.MeshBasicMaterial({ color: col(PAL.pink).multiplyScalar(1.25), fog: false }));
    moon.position.set(-60, 95, -D.cliff - 150); moon.lookAt(0, 0, -40); scene.add(moon); }
  // 屏幕速度线（相机层）：边缘放射，按帧号换一批（确定性），强度 = 速度
  const cam = persp(62);
  const NSL = 90, slPos = new Float32Array(NSL * 6);
  const slGeo = new THREE.BufferGeometry(); slGeo.setAttribute('position', new THREE.BufferAttribute(slPos, 3));
  const slMat = new THREE.LineBasicMaterial({ color: col(PAL.paper).multiplyScalar(1.3), transparent: true, opacity: 0.5, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending });
  const speedLines = new THREE.LineSegments(slGeo, slMat); speedLines.frustumCulled = false; speedLines.renderOrder = 20; cam.add(speedLines); scene.add(cam);
  const hash = (a, b) => { let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  function drawSpeedLines(T, amt, { dir = null } = {}) {
    speedLines.visible = amt > 0.02;
    if (!speedLines.visible) return;
    const f = Math.floor(T * 30), z = -1, fov = THREE.MathUtils.degToRad(cam.fov), hh = Math.tan(fov / 2) * 1, ww = hh * 16 / 9;
    for (let i = 0; i < NSL; i++) {
      const a = hash(i, f) * Math.PI * 2, r0 = lerp(0.55, 0.95, hash(i + 99, f)), len = lerp(0.08, 0.35, hash(i + 7, f)) * (0.5 + amt);
      const x0 = Math.cos(a) * r0 * ww, y0 = Math.sin(a) * r0 * hh, x1 = Math.cos(a) * (r0 + len) * ww, y1 = Math.sin(a) * (r0 + len) * hh;
      const on = hash(i + 55, f) < amt;
      slPos.set(on ? [x0, y0, z, x1, y1, z] : [0, 0, z, 0, 0, z], i * 6);
    }
    slGeo.attributes.position.needsUpdate = true;
    slMat.opacity = 0.35 + 0.35 * amt;
  }

  // ================================================================ 她在跑道上：位置 / 横向 / 抬高 / 动作
  const SEQ = [
    { t: 38.0, anim: 'move__run-fast__inplace', rate: 1.8 },
    { t: 41.6, anim: 'move__sprint-full__inplace', rate: 1.75 },
    { t: E.vault.start, anim: 'move__vault-spin', rate: E.vault.rate },
    { t: E.vault.start + 1.1 / E.vault.rate, anim: 'move__sprint-full__inplace', rate: 1.75 },
    { t: E.jump.start, anim: 'move__run-jump-up', rate: E.jump.rate },
    { t: E.jump.start + E.jump.land, anim: 'move__sprint-full__inplace', rate: 1.75 },
    { t: E.wall.start, anim: 'move__wall-run', rate: E.wall.rate },
    { t: E.wallOff.start, anim: 'move__wall-jump-off', rate: E.wallOff.rate },
    { t: E.land.start, anim: 'move__hard-landing', rate: E.land.rate },
    { t: E.slide.start, anim: 'move__run-slide', rate: E.slide.rate },
    { t: E.slide.start + 0.95, anim: 'move__sprint-full__inplace', rate: 1.75 },
    { t: E.cliff.start, anim: 'move__run-jump-up', rate: E.cliff.rate },
  ];
  SEQ.fade = 0.1;
  const sideOf = t => {                             // 墙跑：贴向右墙（s → roadHalf−0.4），蹬墙后回中线
    const up = smooth((t - (E.wall.start - 0.1)) / 0.2), back = smooth((t - (E.wallOff.start + 0.1)) / 0.45);
    return 1.8 * up * (1 - back);
  };
  const liftOf = t => {                             // 墙跑时离地（片段本身不带墙的高度）；其余动作的高度来自片段自己的髋位移
    const a = E.wall.start + E.wall.a, b = E.wallOff.start + E.wallOff.b;
    if (t < a || t > b) return 0;
    const u = (t - a) / (b - a); return 1.3 * Math.sin(Math.PI * clamp(u));
  };
  // 断崖之后：抛体（沿断崖处的前 / 上方向），τ 相对离崖
  const fallPos = t => {
    const k = Math.max(0, t - E.cliffOff), f = run.frameAt(D.cliff - 0.3, 0, 1);
    const fwd = vOff * (1 - Math.exp(-1.1 * k)) / 1.1, upv = 3.2 * k - 0.5 * 15 * k * k;
    return { pos: f.pos.clone().addScaledVector(f.forward, fwd).addScaledVector(f.up, upv), f };
  };
  function placeGirl(T) {
    const t = tauOf(T);
    scene.add(girl.root); girl.root.visible = true; girl.root.scale.setScalar(H);
    if (t < E.cliffOff) {
      const d = dRun(t), s = sideOf(t), f = run.frameAt(d, s, FOLD(T));
      let up = f.up;
      if (s > 0.2) up = f.up.clone().lerp(f.side.clone().negate(), 0.35 * smooth((s - 0.2) / 1.2)).normalize();   // 墙跑身体往墙外倾
      placeOnFrame(girl.root, { pos: f.pos.clone().addScaledVector(f.up, liftOf(t)), forward: f.forward, up });
      girl.play(SEQ, t);
      return { d, s, f, t };
    }
    const { pos, f } = fallPos(t);
    girl.root.position.copy(pos);
    const k = t - E.cliffOff;
    if (k < 0.55) { placeOnFrame(girl.root, { pos, forward: f.forward, up: f.up }); girl.play(SEQ, t); }   // 起跳动作还在播
    return { d: D.cliff + (t - E.cliffOff) * 3, s: 0, f, t, fall: k };
  }

  // ================================================================ 共用 update：摆世界、摆她、机位由各镜头给
  const stepShake = T => {                          // 每步落地镜头微震：跑步片段 2 步 / 周期，1.8 倍速 → 一步 0.148 s
    const per = 0.533 / 1.8 / 2, ph = ((T - 38.0) % per) / per;
    return Math.exp(-ph * 7) * 0.035;
  };
  const skyA = col('#06060b'), skyB = col('#1b2a4a');
  function world(T) {
    const t = tauOf(T);
    const open = smooth((t - E.cliffOff + 0.15) / 0.7);          // 冲出断崖：天空从夜黑亮成深蓝（接 atoms 的青色渐变，不留黑屏）
    scene.background.lerpColors(skyA, skyB, open); scene.fog.color.copy(scene.background);
    run.update(t, { d: Math.min(dRun(t), D.cliff), fold: 1 });
    for (const sn of signs) {
      const k = T - sn.from, out = T - sn.until;
      sn.g.visible = !!sn.place && k >= 0 && out < 0.2;
      if (!sn.g.visible) continue;
      placeOnFrame(sn.g, sn.place);
      sn.inner.scale.setScalar(lerp(0.88, 1, eOut(k / 0.1)) * (1 - smooth(out / 0.2)));
      sn.edgeMat.color.copy(sn.edgeCol).multiplyScalar(1 + 2.2 * Math.exp(-k / 0.3));       // 亮起那一下：边框闪（字本身不过曝，保证开唱那一刻就读得出）
    }
    return placeGirl(T);
  }
  const post = (T, { speed = 1, extra = {} } = {}) => ({ bloom: { strength: 0.8, threshold: 1.0 }, chroma: 0.1 + 0.25 * speed + 0.3 * kick(T), grade: { vignette: 0.38 }, ...extra });
  // 跟拍机位：以她当前跑道坐标系为参照（back 后退、lat 横移、up 抬高），相机「上」跟着隧道转
  function chase(G, T, { back = 3.2, lat = -0.9, up = 0.35, ahead = 7, lookUp = 0.9, fov = 62 }) {
    const g = FOLD(T), fc = run.frameAt(G.d - back, G.s + lat, g), fa = run.frameAt(G.d + ahead, G.s * 0.5, g);
    const sh = stepShake(T);
    cam.position.copy(fc.pos).addScaledVector(fc.up, up + sh).addScaledVector(fc.side, sh * 0.4);
    cam.up.copy(G.f.up);                                  // 镜头跟她一起滚转：她的路面法线 = 画面的上
    cam.lookAt(fa.pos.addScaledVector(fa.up, lookUp));
    cam.fov = fov; cam.updateProjectionMatrix();
  }
  const runShot = (id, t0, t1, camFn, opts = {}) => shots.push({
    id, t0, t1, transitionIn: { kind: 'cut' },
    build() { return {}; },
    update(S, T) {
      const G = world(T);
      girl.setSkin('toon', T);
      const sp = camFn(G, T) ?? 1;
      drawSpeedLines(T, sp * (opts.lines ?? 1) * rateOf(T));
      return { scene, camera: cam, post: post(T, { speed: sp, extra: opts.post?.(T) ?? {} }) };
    },
  });

  // 38.400 一镜到底：稳定高速跑（低机位贴地追拍，从左后慢慢摆到左侧），41.34 起加速 → FOV 拉伸、机位压低贴近
  runShot('run', 38.4, 42.053, (G, T) => {
    const a = smooth((T - 38.4) / 2.9), acc = smooth((T - E.accel) / 0.8);
    chase(G, T, { back: lerp(3.6, 1.8, a) - acc * 0.4, lat: lerp(-0.8, -2.2, a) + acc * 1.4, up: lerp(0.45, 0.3, a), ahead: lerp(6, 3, a) + acc * 5, lookUp: lerp(0.9, 1.0, a), fov: 60 + 16 * acc });
    return 0.35 + 0.65 * acc;
  });
  // 42.053 插入：闸门旁固定低机位（世界坐标钉在闸门边），她冲进来、手撑转体越过
  runShot('gate', 42.053, 43.21, (G, T) => {
    const g = FOLD(T), fg = run.frameAt(D.gate + 6.5, -1.4, g), ft = run.frameAt(D.gate, 0, g);
    cam.position.copy(fg.pos).addScaledVector(fg.up, 0.35); cam.up.copy(ft.up);
    const track = run.frameAt(clamp(G.d, D.gate - 14, D.gate + 3), 0, g);            // 闸门前方低机位回看：她冲过来、撑越、从镜头边擦过
    cam.lookAt(track.pos.lerp(ft.pos, 0.3).addScaledVector(ft.up, 1.0)); cam.fov = 44; cam.updateProjectionMatrix();
    return 0.6;
  });
  // 43.210 追拍跳断口：低机位后方，腾空时镜头抬起、摆到侧面，最高点顿帧
  runShot('gap', 43.21, 44.779, (G, T) => {
    const t = tauOf(T), air = smooth((t - (E.jump.start + E.jump.off)) / 0.4) * (1 - smooth((t - (E.jump.start + E.jump.land - 0.2)) / 0.3));
    chase(G, T, { back: lerp(3.0, 2.2, air), lat: lerp(-1.0, -4.0, air), up: lerp(0.35, 1.4, air), ahead: lerp(6, 1.5, air), lookUp: lerp(0.9, 1.8, air), fov: 72 - 8 * air });
    return 1 - 0.6 * air;
  });
  // 44.779 侧追墙跑 → 蹬墙后翻
  // 44.779 侧追：墙跑 → 蹬墙后翻 → 重落地（46.635 落地：镜头震 + 白闪 + 色散），一直跟到 46.9
  runShot('wall', 44.779, 46.9, (G, T) => {
    const off = smooth((tauOf(T) - E.wallOff.start) / 0.3) * (1 - smooth((T - E.landHit) / 0.25));
    const k = T - E.landHit, jolt = k > 0 ? Math.exp(-k * 9) * 0.12 * Math.sin(k * 55) : 0;
    chase(G, T, { back: 2.4 + off, lat: -2.6, up: 0.9 + 0.6 * off + jolt, ahead: 2.5, lookUp: 1.4 + 1.2 * off - 0.4 * smooth(k / 0.2), fov: 60 + 6 * off });
    return 0.8;
  }, { post: T => { const k = T - E.landHit; return k > 0 ? { chroma: 0.9 * Math.exp(-k * 8), flash: { amount: 0.18 * Math.exp(-k * 14), color: '#ffffff' } } : {}; } });
  // 46.900 前方低机位回看：滑铲过横梁（镜头在她前面倒退）
  runShot('slide', 46.9, 47.507, (G, T) => {
    chase(G, T, { back: -3.2, lat: 0.2, up: 0.5, ahead: -6, lookUp: 0.3, fov: 54 });
    return 0.7;
  });
  // 47.507 冲向断崖：贴地追拍 → 起跳后镜头停在崖边，看她飞出去往下掉（FOV 拉伸）
  runShot('cliff', 47.507, 48.35, (G, T) => {
    const t = tauOf(T), g = FOLD(T);
    if (t < E.cliffOff - 0.05) chase(G, T, { back: 2.6, lat: -1.0, up: 0.3, ahead: 8, lookUp: 1.0, fov: 74 });
    else {
      const fe = run.frameAt(D.cliff - 1.5, -0.7, g), k = t - E.cliffOff;
      cam.position.copy(fe.pos).addScaledVector(fe.up, 0.9); cam.up.copy(fe.up);
      cam.lookAt(girl.root.position.clone().addScaledVector(fe.up, 0.8)); cam.fov = lerp(74, 58, smooth(k / 0.5)); cam.updateProjectionMatrix();
    }
    return t < E.cliffOff ? 1 : 0.5;
  });

  // ================================================================ 歌词牌摆位（build 时算一次，确定性）
  // 每个词：在它开唱那一刻的机位下，从跑道上一批候选位置（沿路 d、横向 s（含隧道壁）、离地 h）里挑一个：
  //   · 开唱时刻和 +0.35 s：整块牌在画面内（留 3% 边），字高 ≥ 6% 画高，前面没有楼 / 墙挡着；
  //   · 从亮起到这句唱完：只要牌在画面里，就不和她（骨骼投影框）重叠，也不和同句已摆好的牌重叠；
  //   · 不挡她的路（牌底高于 2.6 m，或者整块在路面外）；朝向 = 面向开唱时刻的镜头（绕路面法线转）。
  // 结果存在 sn.place，window.__lyricCheck 给出每个词开唱时的屏幕框 / 字高，便于自查。
  const shotAt = T => shots.find(s => T >= s.t0 && T < s.t1);
  const _v = new THREE.Vector3();
  function camState(T) {
    const sh = shotAt(T); sh.update(null, T); cam.updateMatrixWorld(true); girl.root.updateMatrixWorld(true);
    const I = girl.dancer.S.info, pts = ['Head', 'Hips', 'LeftFoot', 'RightFoot', 'LeftHand', 'RightHand', 'LeftToeBase', 'RightToeBase'].map(k => I[k].bone.getWorldPosition(new THREE.Vector3()));
    pts.push(pts[0].clone().addScaledVector(girl.root.up.set(0, 1, 0).applyQuaternion(girl.root.quaternion), 0.25));
    const box = rectOf(pts.map(p => p.clone().project(cam)));
    const pad = 0.06;
    return { T, cam: cam.clone(), camPos: cam.position.clone(), girl: box && { x0: box.x0 - pad, x1: box.x1 + pad, y0: box.y0 - pad, y1: box.y1 + pad } };
  }
  function rectOf(ps) {
    if (ps.some(p => p.z > 1 || p.z < -1)) return null;
    return { x0: Math.min(...ps.map(p => p.x)), x1: Math.max(...ps.map(p => p.x)), y0: Math.min(...ps.map(p => p.y)), y1: Math.max(...ps.map(p => p.y)) };
  }
  const hit = (a, b, m = 0.03) => a && b && a.x0 - m < b.x1 && b.x0 - m < a.x1 && a.y0 - m < b.y1 && b.y0 - m < a.y1;
  function cornersOf(pl, bw, bh) {
    const z = pl.forward.clone().normalize(), y = pl.up.clone().addScaledVector(z, -pl.up.dot(z)).normalize(), x = new THREE.Vector3().crossVectors(y, z);   // 同 placeOnFrame
    return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => pl.pos.clone().addScaledVector(x, a * bw / 2).addScaledVector(y, b * bh / 2));
  }
  function placeSigns() {
    // 楼（路边街区）的体积：局部坐标 x 横、y 沿法线、z 沿路；牌不许插进楼里，镜头到牌之间也不许隔着楼
    const boxes = run.buildings.map(b => { const f = run.frameAt(b.d, b.s, 1); return { f, x: new THREE.Vector3().crossVectors(f.up, f.forward), hw: b.w / 2 + 0.25, h: b.h + 0.3, hd: b.dd / 2 + 0.25 }; });
    const inBox = p => boxes.some(B => { _v.copy(p).sub(B.f.pos); const y = _v.dot(B.f.up); return y > -0.2 && y < B.h && Math.abs(_v.dot(B.x)) < B.hw && Math.abs(_v.dot(B.f.forward)) < B.hd; });
    const blockedRay = (a, b) => { const L = a.distanceTo(b), n = Math.ceil(L / 0.4); for (let i = 1; i < n; i++) if (inBox(a.clone().lerp(b, i / n))) return true; return false; };
    const placed = [];
    for (let si = 0; si < signs.length; si++) {
      const sn = signs[si];
      const ts = sn.from, dHer = dRun(tauOf(ts)), s0 = camState(ts);
      sn.until = Math.min(sn.until, shotAt(ts).t1 - 0.02, 48.3);   // 只活到本镜头结束，不带进后面的机位（开唱就切的词另挂续牌）
      const samples = []; for (let T = ts; T <= sn.until; T += 0.1) samples.push(T === ts ? s0 : camState(T));
      const inside = r => r && r.x0 > -0.94 && r.x1 < 0.94 && r.y0 > -0.94 && r.y1 < 0.94;
      // 两档：先要求开唱后 0.6 s 内（哪怕跨了切点）一直读得出；不行再退到「开唱后到本镜头结束（≤0.35 s）」
      const tiers = [samples.filter(sm => sm.T <= ts + 0.6), samples.filter(sm => sm.T <= ts + 0.35), samples.filter(sm => sm.T <= ts + 0.35)];
      let best = null, why = null;
      for (const [ti, readSm] of tiers.entries()) {
        const cands = []; why = { tier: ti, road: 0, frame: 0, small: 0, girl: 0, sign: 0, n: 0 };
        const lat = ti === 2 ? [-9, -7.5, -6, -4.5, -3, -1.5, 0, 1.5, 3, 4.5, 6, 7.5, 9] : ti ? [-7, -5, -3.2, 0, 3.2, 5, 7] : [-5, -3.2, 0, 3.2, 5];
        const hts = ti === 2 ? [0.9, 1.5, 2.2, 3, 3.8, 4.6, 5.4, 6.2, 7, 8, 9] : ti ? [0.9, 1.5, 2.2, 3.4, 4.6, 5.8, 7] : [2.2, 3.4, 4.6, 5.8];
        for (let dd = -16; dd <= 30; dd += ti === 2 ? 1 : 2) for (const sl of lat) for (const hh of hts) {
          const d = dHer + dd;
          if (d < 2 || (d > D.cliff - 2 && d < D.cliff + 6) || d > D.cliff + 26) continue;   // 断崖外也能挂（悬在深渊上空的广告牌）
          why.n++;
          if (Math.abs(sl) - sn.bw / 2 < 2.4 && hh - sn.bh / 2 < 2.6) { why.road++; continue; }         // 挡路
          const f = run.frameAt(d, sl, 1), pos = f.pos.clone().addScaledVector(f.up, hh);
          // 朝向：正对开唱时刻的镜头，「上」= 那一刻画面的上（滚转段里也是正的；之后镜头继续滚，牌就跟着世界一起转）
          const camUp = s0.cam.up.clone(), to = s0.camPos.clone().sub(pos); to.addScaledVector(camUp, -to.dot(camUp));
          if (to.lengthSq() < 1e-4) continue;
          const pl = { pos, forward: to.normalize(), up: camUp };
          const cs = cornersOf(pl, sn.bw, sn.bh);
          const rs = readSm.map(sm => rectOf(cs.map(c => c.clone().project(sm.cam))));
          if (!rs.every(inside)) { why.frame++; continue; }
          const fr = r => (r.y1 - r.y0) / 2 * TXT_H / sn.bh, r0 = rs[0], txtFrac = fr(r0);
          if (txtFrac < 0.06 || rs.some(r => fr(r) < 0.05)) { why.small++; continue; }
          // 和她 / 同句别的牌撞上的最早时刻：开唱后 0.8 s 内撞了就不要；之后才撞，就在那一刻前收掉这块牌
          let clash = Infinity;
          for (const sm of samples) {
            const r = rectOf(cs.map(c => c.clone().project(sm.cam)));
            if (!r || r.x1 < -1 || r.x0 > 1 || r.y1 < -1 || r.y0 > 1) continue;
            let bad = hit(r, sm.girl);
            if (bad) why.girl++;
            else for (const o of placed) if (o.sn.line === sn.line && sm.T >= o.sn.from && sm.T <= o.sn.until && hit(r, rectOf(o.cs.map(c => c.clone().project(sm.cam))))) { bad = true; why.sign++; break; }
            if (bad) { clash = sm.T; break; }
          }
          if (clash < ts + 0.8) continue;
          const dist = s0.camPos.distanceTo(pos), cy = (r0.y0 + r0.y1) / 2;
          const score = Math.abs(txtFrac - 0.1) * 8 + Math.abs(dist - 12) * 0.05 + (cy < 0 ? 0.6 : 0) + Math.abs((r0.x0 + r0.x1) / 2) * 0.3;
          cands.push({ pl, cs, r0, txtFrac, score: score + (clash < Infinity ? 0.8 : 0), tier: ti, clash });
        }
        cands.sort((a, b) => a.score - b.score);
        for (const c of cands) {                                   // 挡没挡：从开唱时刻的相机往牌的四角 + 中心打射线
          const [a, b, , d4] = c.cs, ex = b.clone().sub(a), ey = d4.clone().sub(a);
          const pts = []; for (const u of [0.02, 0.5, 0.98]) for (const v of [0.05, 0.5, 0.95]) pts.push(a.clone().addScaledVector(ex, u).addScaledVector(ey, v));
          const blocked = pts.some(p => inBox(p) || blockedRay(s0.camPos, p));
          if (!blocked) { best = c; break; }
        }
        if (best) break;
      }
      if (!best) { console.warn('歌词牌无处可放', sn.w.w, ts, JSON.stringify(why), shotAt(ts).id); continue; }
      // 跑近了牌会变得很大、被画框切掉：从那一刻起收掉
      for (const sm of samples) { if (sm.T < ts + 0.4) continue; const r = rectOf(best.cs.map(c => c.clone().project(sm.cam))); if (!r || r.y1 - r.y0 > 0.9 || r.x1 - r.x0 > 1.2) { sn.until = sm.T; break; } }
      sn.until = Math.min(sn.until, best.clash - 0.1);
      sn.place = best.pl; sn.check = { word: sn.w.w + (sn.cont ? '（续）' : ''), t: ts, tier: best.tier, rect: best.r0, txtFrac: +best.txtFrac.toFixed(3) };
      placed.push({ sn, cs: best.cs });
      // 词刚唱出来就切镜头（< 0.8 s）：下一个机位里再挂一块同一个词的牌（已亮），保证每个词至少读得到 ~0.8 s
      const cut = shotAt(ts).t1;
      if (cut - ts < 0.8 && cut < 48.3 && !sn.cont) {
        const c = makeSign(sn.w, sn.line, sn.li, cut, Math.min(sn.line.end + 0.35, Math.max(ts + 1.3, cut + 0.6), shotAt(cut).t1 - 0.02, 48.3));
        c.cont = true; signs.push(c);
      }
    }
    window.__lyricCheck = signs.map(s => s.check ?? { word: s.w.w, t: s.from, missing: true });
  }

  // ================================================================ 48.350 跳伞：spread-eagle → 头朝下俯冲
  const tSpread = 48.35, tTuck = 48.95, tDive = 49.35;
  const lineFall = { n: 260, pos: new Float32Array(260 * 6) };
  const lfGeo = new THREE.BufferGeometry(); lfGeo.setAttribute('position', new THREE.BufferAttribute(lineFall.pos, 3));
  const lfMat = new THREE.LineBasicMaterial({ color: col(PAL.mint).multiplyScalar(1.2), transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false });
  const fallLines = new THREE.LineSegments(lfGeo, lfMat); fallLines.frustumCulled = false; fallLines.visible = false; scene.add(fallLines);
  const qA = new THREE.Quaternion(), qB = new THREE.Quaternion(), m4 = new THREE.Matrix4();
  const basis = (fwd, up) => { const z = fwd.clone().normalize(), y = up.clone().addScaledVector(z, -up.dot(z)).normalize(), x = new THREE.Vector3().crossVectors(y, z); return new THREE.Quaternion().setFromRotationMatrix(m4.makeBasis(x, y, z)); };
  shots.push({
    id: 'skydive', t0: 48.35, t1: 49.779, transitionIn: { kind: 'cut' },
    build() { return {}; },
    update(S, T) {
      world(T);                                     // 世界照常（跑道在头顶远去）
      const t = tauOf(T), { pos, f } = fallPos(t);
      const U = f.up, F = f.forward, Sd = f.side;
      // 姿态：spread（稳定、慢慢转正）→ tuck（收手收腿）→ dive
      const p = smooth((T - tTuck) / (tDive - tTuck));
      const spec = windy(lerpSpec(SPREAD, DIVE, p), T, lerp(1.0, 1.6, p));
      girl.pose(() => spec);
      girl.setSkin('toon', T);
      // 朝向：spread = 趴着（面朝下 -U，头朝前 F），刚离崖时带一点翻滚、0.5 s 内转正；dive = 头朝下（头 -U 偏前），面朝前 F
      const k = T - tSpread, wob = Math.exp(-k * 3.5) * 0.9 * Math.sin(k * 7);
      qA.copy(basis(U.clone().negate(), F.clone().applyAxisAngle(U, 0).addScaledVector(Sd, wob)));
      qB.copy(basis(F.clone().addScaledVector(U, 0.25), U.clone().negate().addScaledVector(F, 0.3)));
      girl.root.quaternion.copy(qA).slerp(qB, p);
      girl.root.position.copy(pos);
      girl.root.scale.setScalar(H);
      // 下落速度线：沿 U 往上刷，越往后越密越长
      const dens = lerp(0.35, 1, smooth((T - tSpread) / 1.2)), vlen = lerp(1.2, 4.5, p);
      fallLines.visible = true; lfMat.opacity = 0.35 + 0.45 * dens;
      for (let i = 0; i < lineFall.n; i++) {
        const on = i / lineFall.n < dens;
        const a = hash(i, 3) * Math.PI * 2, r = lerp(1.5, 9, hash(i, 4));
        const off = F.clone().multiplyScalar(Math.cos(a) * r).addScaledVector(Sd, Math.sin(a) * r);
        const y = ((hash(i, 5) * 30 + T * 38) % 30) - 15;
        const p0 = pos.clone().add(off).addScaledVector(U, y), p1 = p0.clone().addScaledVector(U, vlen);
        lineFall.pos.set(on ? [p0.x, p0.y, p0.z, p1.x, p1.y, p1.z] : [0, 0, 0, 0, 0, 0], i * 6);
      }
      lfGeo.attributes.position.needsUpdate = true;
      // 机位：spread 时在她正上方偏后俯看（看到背和张开的四肢、下面的城）；dive 时移到侧上方，跟着一起俯冲
      const camPosA = pos.clone().addScaledVector(U, 3.4).addScaledVector(F, -0.6).addScaledVector(Sd, 0.8);
      const camPosB = pos.clone().addScaledVector(U, 0.9).addScaledVector(Sd, 2.3).addScaledVector(F, 0.3);
      const shake = Math.sin(T * 61) * 0.03 * (0.5 + p) + Math.sin(T * 83) * 0.02;
      cam.position.copy(camPosA).lerp(camPosB, p).addScaledVector(Sd, shake);
      cam.up.copy(F).lerp(U, p).normalize();
      cam.lookAt(pos.clone().addScaledVector(U, -lerp(1.2, 1.1, p)).addScaledVector(F, lerp(0.9, 0.2, p)));
      cam.fov = lerp(62, 60, p); cam.updateProjectionMatrix();
      drawSpeedLines(T, lerp(0.4, 1, p));
      return { scene, camera: cam, post: post(T, { speed: lerp(0.4, 1, p), extra: { grade: { vignette: 0.45 } } }) };
    },
  });

  // ================================================================ 49.779 坠落中：粒子 → 叶序盘 → 人形 → 铬色液态 → 她（沿用旧版，姿态换成俯冲）
  const lA = L('I feel');
  const tDis = 50.2, tDisc = 50.6, tBack = 51.25, tChrome = 51.9, tToon = 52.62;
  const diveSpec = T => windy(DIVE, T, 1.4);
  const rotAt = T => { const k = T - 49.779; return [Math.PI + 0.25 * Math.sin(k * 1.1), k * 0.9, 0.15 * Math.sin(k * 1.7)]; };   // 头朝下，慢慢自转
  shots.push({
    id: 'atoms', t0: 49.779, t1: 52.8 + 0.3,
    build() {
      const sc = new THREE.Scene();
      { const c = document.createElement('canvas'); c.width = 64; c.height = 256; const x = c.getContext('2d');
        const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, '#07101c'); g.addColorStop(0.55, '#10283a'); g.addColorStop(1, '#1f5560');
        x.fillStyle = g; x.fillRect(0, 0, 64, 256); const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; sc.background = tex; }
      sc.add(createGirlLights({ key: 2.2, rim: 3.0, fill: 0.8 }));
      const NS = 420, sp = new Float32Array(NS * 6);
      const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
      const streaks = new THREE.LineSegments(sg, new THREE.LineBasicMaterial({ color: col(PAL.mint).multiplyScalar(1.1), transparent: true, opacity: 0.8 })); streaks.frustumCulled = false; sc.add(streaks);
      sc.add(girl.root);
      girl.root.position.set(0, H * 0.5, 0); girl.root.rotation.set(...rotAt(tDisc)); girl.root.scale.setScalar(H);
      girl.pose(() => diveSpec(tDisc)); girl.setSkin('points', tDisc);
      girl.root.updateMatrixWorld(true);
      const src = girl.points.geometry.attributes.position, M = girl.points.matrixWorld;
      const N = 12000, her = new Float32Array(N * 3), v = new THREE.Vector3();
      for (let i = 0; i < N; i++) { v.fromBufferAttribute(src, Math.floor(i * src.count / N)).applyMatrix4(M); her.set([v.x, v.y, v.z], i * 3); }
      const parts = createParticles({ count: N, seed: 5, size: 1.1 });
      parts.setShape('her', her);
      const disc = phyllotaxisPoints(N, { radius: 1.25 });
      parts.setShape('disc', disc);
      sc.add(parts.points);
      const fx = FX.reform({ line: lA, color: PAL.mint, color2: PAL.paper, maxW: 30, maxH: 6, maxSize: 3.2, glow: 1.1 });
      const cm = persp(45);
      const bg = new THREE.Group(); bg.add(fx.group); bg.position.set(0, 7.2, -40); bg.scale.setScalar(0.95 * Math.tan(THREE.MathUtils.degToRad(22.5)) / Math.tan(THREE.MathUtils.degToRad(15))); cm.add(bg); sc.add(cm);
      return { sc, streaks, sp, sg, parts, fx, cm };
    },
    update(S, T) {
      const k = T - 49.779;
      for (let i = 0; i < S.sp.length / 6; i++) {
        const x = (Math.sin(i * 12.9898) * 0.5) * 16, z = (Math.cos(i * 78.233) * 0.5) * 16 - 4;
        const y = ((i * 0.37 + T * 22) % 26) - 10;
        S.sp.set([x, y, z, x, y + 3.2, z], i * 6);
      }
      S.sg.attributes.position.needsUpdate = true;
      S.fx.update(T);
      S.sc.add(girl.root); girl.root.visible = true;
      girl.root.position.set(0, H * 0.5, 0); girl.root.rotation.set(...rotAt(Math.min(T, tDisc))); girl.root.scale.setScalar(H);
      girl.pose(() => diveSpec(Math.min(T, tDisc)));
      let showGirl = true;
      if (T < tDis) girl.setSkin('toon', T);
      else if (T < tDisc) girl.morph('toon', 'points', 0.4 * (T - tDis) / (tDisc - tDis), T);
      else if (T < tChrome) { showGirl = false; girl.setSkin('points', T); }
      else if (T < tToon) girl.morph('points', 'chrome', lerp(0.75, 1, smooth((T - tChrome) / 0.45)), T);
      else girl.morph('chrome', 'toon', lerp(0.75, 1, smooth((T - tToon) / 0.3)), T);
      girl.root.visible = showGirl;
      S.parts.points.visible = !showGirl;
      if (!showGirl) {
        if (T < tBack) { const p1 = smooth((T - tDisc) / (tBack - tDisc - 0.1)); S.parts.update(T, { from: 'her', to: 'disc', p: p1, swirl: 0.6 * Math.sin(Math.PI * p1), bright: 0.9 }); }
        else { const p2 = smooth((T - tBack) / (tChrome - tBack - 0.05)); S.parts.update(T, { from: 'disc', to: 'her', p: p2, swirl: 0.6 * Math.sin(Math.PI * p2), bright: 0.9 }); }
        S.parts.points.rotation.set(0, 0, 0);
      }
      // 机位：跟着她一起掉，慢慢绕半圈（中景，脸小）；52.55 起她扑向镜头，画面变亮交给 Sydney
      const a = lerp(-0.6, 0.9, k / 3.2), rush = smooth((T - 52.55) / 0.25);
      S.cm.position.set(Math.sin(a) * lerp(6.2, 1.2, rush), lerp(0.8, 0.2, rush), Math.cos(a) * lerp(6.2, 1.2, rush)); S.cm.lookAt(0, lerp(0.7, 0, rush), 0);
      const fl = (T > tChrome && T < tChrome + 0.15 ? 0.2 : 0) + 0.95 * rush;
      return { scene: S.sc, camera: S.cm, post: { bloom: { strength: 1.0, threshold: 0.9 }, chroma: 0.15 + 0.3 * kick(T) + 0.6 * rush, grade: { vignette: 0.35 }, flash: { amount: Math.min(1, fl), color: '#ffffff' } } };
    },
  });

  placeSigns();
  return shots;
}

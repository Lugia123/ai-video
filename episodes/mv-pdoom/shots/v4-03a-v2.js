// shots/v4-03a-v2.js — v4 主歌 2 前半（歌曲时间 38.4–52.8 s），#1030 返工版（旧版 shots/v4-03a.js 保留）。
//   const b = await makeV403b(mv);
//   const shots = [...await makeV403a(mv, { next: b[0] }), ...b];   // 先 await initType3D()；next = 52.8 接上的镜头（手机屏幕里要画它的第一帧）
//
// 分镜（fresh/redo-v403/BRIEF.md + plan.md，用户确认）：
//   38.400 run      贴地追拍高速跑（沿用旧版）
//   42.053 gate     闸门旁固定低机位：手撑翻过黄色横杆；越过去那一帧定格
//   43.210 comic    漫画页（kits/comic.js）：定格的那一帧原样变成第 0 格（描上墨线、网点、格框），镜头拉开 →
//                   格 1 飞跃断口 → 格 2 蹬墙跑 → 格 3 蹬墙后翻 → 格 4 重落地 → 46.60 她破格冲出变回 3D
//   46.900 slide    回到跑道：迎面滑铲过黄色横梁
//   47.507 edge     起身全速冲向断崖（贴地追拍）
//   48.020 leap     不停：最后一步踩在崖沿直接蹬出去（动捕 move__dive-from-run，起跳瞬间慢动作），空中张开双臂放平 → 头朝下俯冲
//                   （口袋里的手机在起跳那一下甩出来）；镜头在崖边目送 → 绕到头顶跟着掉
//                   49.86 起从指尖化成粒子、被吸进旁边的手机（屏幕 UPLOADING… 37% → 100%）→ 手机横过来飞到镜头前，
//                   屏幕里是 2D 的她 → 推进屏幕铺满 = 下一镜头（v4-03b）第一帧
// 一个世界、一条路：W3 kits/world4.js 的 createSpiralRun，前半段几何和旧版完全一样（断口 / 墙还在路上，只是这一段改成漫画页讲）。
// 脚不滑：崖边最后几步按走过的距离驱动跑步相位；踏跳那一步把左脚尖钉在崖沿上（根的位置由脚反推）。
// 所有 update 都是 T 的纯函数。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { FX } from '../kits/type3d.js';
import { createSpiralRun, placeOnFrame, textTexture } from '../kits/world4.js';
import { createCity, mulberry32 } from '../kits/world.js';
import { createGirl, createGirlLights, loadAnims, getAnim } from '../kits/girl.js';
import { createComic, C, CF } from '../kits/comic.js';
import { blendSolved, normalizeSpecExport } from '../../../assets/lib/dance3d.js';

export const ANIMS = ['move__run-fast__inplace', 'move__sprint-full__inplace', 'move__vault-spin', 'move__run-slide', 'move__dive-from-run'];

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIn = p => clamp(p) ** 3;
const eIO = p => { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2; };
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const col = c => new THREE.Color(c);
const persp = (fov = 50) => new THREE.PerspectiveCamera(fov, 16 / 9, 0.05, 1200);
const hash = (a, b) => { let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

const PK = new URL('../../cast-cyber-girl/closeup/parkour/layers/', import.meta.url);      // 漫画格关键画（抠好的透明底）
const SYD = new URL('../../cast-cyber-girl/closeup/sydney/layers/', import.meta.url);      // 手机屏幕里的 2D 她（v4-03b 的素材）
async function loadImg(base, name) { const im = new Image(); im.src = new URL(name + '.png', base).href; await im.decode(); return im; }
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function silhouette(im, color) { const c = canvas(im.width, im.height), x = c.getContext('2d'); x.drawImage(im, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height); return c; }

// ---------------------------------------------------------------- 姿态（dance3d spec）
// 角色空间：X = 她的左手方向，Y = 头顶，Z = 面朝；手 pos 以臂长为单位、相对肩；脚 pos 以腿长为单位、相对静止位置；躯干角度 x 正 = 前倾
const full = o => ({
  hips: { x: 0, y: 0, z: 0, rot: [0, 0, 0] }, spine: [0, 0, 0], chest: [0, 0, 0], neck: [0, 0, 0], head: [0, 0, 0], clavL: [0, 0, 0], clavR: [0, 0, 0],
  handL: { pos: [0.26, -0.9, 0.12], pole: [0.3, -0.2, -1], wrist: [0, 0, 0], grip: 0.25 }, handR: { pos: [-0.26, -0.9, 0.12], pole: [-0.3, -0.2, -1], wrist: [0, 0, 0], grip: 0.25 },
  footL: { pos: [0, 0, 0], pole: [0.15, 0, 1], pitch: 0 }, footR: { pos: [0, 0, 0], pole: [-0.15, 0, 1], pitch: 0 }, ...o,
});
const SWAN = full({                                                           // 天鹅式：只取它的手臂（双臂向两侧张开、略向后上扬）叠在动捕上
  spine: [-8, 0, 0], chest: [-15, 0, 0], neck: [-8, 0, 0], head: [-14, 0, 0],
  handL: { pos: [0.93, 0.17, -0.3], pole: [0, -1, -0.5], wrist: [0, 0, 0], grip: 0.03 }, handR: { pos: [-0.93, 0.17, -0.3], pole: [0, -1, -0.5], wrist: [0, 0, 0], grip: 0.03 },
  footL: { pos: [-0.06, 0.02, 0], pole: [0.1, 0, 1], pitch: 42 }, footR: { pos: [0.06, 0.02, 0], pole: [-0.1, 0, 1], pitch: 42 },
});
// ---------------------------------------------------------------- 溶解顺序：从指尖沿手臂到肩，再到躯干、头、脚（0..1，写进网格的 aDis）
// 手臂上的顶点 = 沿「指尖 → 腕 → 肘 → 肩」折线的弧长；其余 = 臂长 + 离最近肩关节的距离。姿态无关（按静止姿态算）。
function fingertipField(girl) {
  const { mesh, dancer } = girl, geo = mesh.geometry, P = geo.attributes.position, SI = geo.attributes.skinIndex, SW = geo.attributes.skinWeight;
  dancer.apply({ root: { pos: V(), yaw: 0 }, hips: V(), d: {} });                               // 静止（绑定）姿态
  girl.root.position.set(0, 0, 0); girl.root.quaternion.identity(); girl.root.scale.setScalar(1); girl.root.updateMatrixWorld(true);
  const I = dancer.S.info, wp = k => I[k].bone.getWorldPosition(V());
  const arms = ['Left', 'Right'].map(sd => { const w = wp(sd + 'Hand'), e = wp(sd + 'ForeArm'), sh = wp(sd + 'Arm'); return [w.clone().addScaledVector(w.clone().sub(e).normalize(), 0.085), w, e, sh]; });
  const armLen = arms[0].slice(1).reduce((s, p, i) => s + p.distanceTo(arms[0][i]), 0);
  const names = mesh.skeleton.bones.map(b => b.name.replace(/^mixamorig:?/, ''));
  const out = new Float32Array(P.count), v = V(), a = V(), b = V();
  let max = 0;
  for (let i = 0; i < P.count; i++) {
    let bi = 0, bw = -1; for (let q = 0; q < 4; q++) { const w = SW.getComponent(i, q); if (w > bw) { bw = w; bi = SI.getComponent(i, q); } }
    const n = names[bi] || '', side = n.startsWith('Left') ? 0 : n.startsWith('Right') ? 1 : -1, isArm = side >= 0 && /(Arm|Hand)/.test(n);
    v.fromBufferAttribute(P, i);
    let d;
    if (isArm) {
      const L = arms[side]; let best = Infinity, arc = 0, acc = 0;
      for (let k = 0; k < 3; k++) {
        a.copy(L[k]); b.copy(L[k + 1]).sub(a); const len = b.length(), u = clamp(v.clone().sub(a).dot(b) / (len * len)), dist = v.distanceTo(a.addScaledVector(b, u));
        if (dist < best) { best = dist; arc = acc + u * len; } acc += len;
      }
      d = arc;
    } else d = armLen + Math.min(v.distanceTo(arms[0][3]), v.distanceTo(arms[1][3]));
    out[i] = d; if (d > max) max = d;
  }
  for (let i = 0; i < out.length; i++) out[i] = 0.02 + 0.96 * out[i] / max;
  return out;
}

export async function makeV403a(mv, { next = null } = {}) {
  const { music, lyrics } = mv;
  const renderer = mv.stage.renderer;
  const L = p => lyrics.lines.find(l => l.start > 36 && l.text.toLowerCase().startsWith(p.toLowerCase()));
  const kick = (T, d = 0.12) => music.pulse('kick', T, { decay: d });
  await loadAnims(ANIMS);
  const girl = await createGirl(mv);
  const H = 2.0;                                   // 她的身高（米）
  const shots = [], runShots = [];
  const hipsBone = girl.dancer.S.info.Hips.bone;
  const clipAt = (name, sec) => { const m = getAnim(name); return m.solve(sec / m.srcPeriod, girl.dancer); };
  const solveSpec = spec => girl.dancer.solver.solve(normalizeSpecExport(spec, {}));

  // 关键画：没生成出来的先用 Sydney 段的 key-leap 顶着（只为不白屏，正片必须四张齐）
  const KEYS = ['gap', 'wall', 'flip', 'land'];
  const IMG = Object.fromEntries(await Promise.all(KEYS.map(async n => [n, await loadImg(PK, n).catch(() => { console.warn('漫画关键画缺：' + n); return loadImg(SYD, 'key-leap'); })])));
  const landW = silhouette(IMG.land, '#ffffff');
  const SY = Object.fromEntries(await Promise.all(['base-full', 'base-hand-l', 'base-hand-r', 'face-plead'].map(async n => [n, await loadImg(SYD, n)])));
  const sydMeta = await (await fetch(new URL('layers.json', SYD))).json();

  // ================================================================ 事件
  // 前半段（到滑铲）沿用旧版的时间和速度：路上的闸门 / 断口 / 墙 / 横梁位置不变
  const E = {
    accel: 41.34,                                   // 「But now…」起加速
    vault: { start: 42.40, rate: 1.4, over: 0.56 },    // vault-spin：越过点 = 片段 0.785 s / 1.4
    jump: { start: 43.22, rate: 1.5, off: 0.38, land: 1.45 },
    wall: { start: 44.85, rate: 1.1, a: 0.15 / 1.1, b: 0.95 / 1.1 },
    wallOff: { start: 45.72, rate: 1.6, a: 0.2 / 1.6, b: 1.23 / 1.6 },
    land: { start: 46.35, rate: 2.0 },
    slide: { start: 46.90, rate: 1.4, low: 0.55 / 1.4 },   // run-slide：最低点 47.29
  };
  E.landHit = E.land.start + 0.57 / E.land.rate;
  const tFreeze = 43.06, tComic = 43.21, tBreak = 46.599, tSlide = 46.90;   // 定格 / 漫画页 / 破格 / 回 3D
  const tUp0 = 47.60, tUp1 = 47.80;                 // 滑铲片段 → 冲刺片段
  const tLeap = 48.02;                              // 切到崖边的固定机位（踏跳之前）
  const tSlow0 = 48.10, tFast = 48.60;              // 起跳慢动作：48.10 起放慢到 0.28 倍，48.60 起恢复，约 48.96 回到原速（用户 2026-10-01 确认的 l1 版，别改）
  const tPoseFreeze = 49.84;                        // 从这里起姿态冻结（粒子的出发位置按这个姿态取）
  const tDis0 = 49.86, tDis1 = 51.50, FLY = 0.42;   // 溶解：从指尖到全身；每颗粒子飞到手机的时间
  const tDone = 51.74, tDock0 = 51.78, tDock1 = 52.16, tPush = 52.52, tEnd = 52.8;   // 上传完 / 手机飞到镜头前 / 推进屏幕
  // 地速 v(t)（m/s）：稳定 11 → 加速到 15；（墙跑 12、落地冲击那段现在是漫画页，只影响路上障碍的间距）；刹车到 0
  const vOf = t => {
    let v = t < E.accel ? 11 : lerp(11, 15, smooth((t - E.accel) / 0.7));
    if (t > E.wall.start && t < E.wallOff.start + E.wallOff.b) v = Math.min(v, 12);
    const k = t - E.landHit; if (k > 0 && k < 0.6) v = lerp(5, 15, smooth(k / 0.6));
    return v;
  };
  const T0 = 38.4, DT = 0.001, NT = Math.ceil((48.6 - T0) / DT) + 2;
  const dTab = new Float64Array(NT); for (let i = 1; i < NT; i++) dTab[i] = dTab[i - 1] + vOf(T0 + (i - 0.5) * DT) * DT;
  const dRun = t => { const x = (t - T0) / DT; if (x <= 0) return vOf(T0) * (t - T0); if (x >= NT - 1) return dTab[NT - 1]; const i = Math.floor(x); return lerp(dTab[i], dTab[i + 1], x - i); };
  const D = { gate: dRun(E.vault.start + E.vault.over), gapA: dRun(E.jump.start + E.jump.off) + 0.4, gapB: dRun(E.jump.start + E.jump.land) - 0.4,
    wall: dRun(E.wall.start + E.wall.a) - 1, wallEnd: dRun(E.wallOff.start + E.wallOff.a) + 1, beam: dRun(E.slide.start + E.slide.low) };
  // ---- 起跳：动作时间 τ(T)（慢动作只发生在起跳前后，其余 τ = T）
  const rateOf = T => 1 - 0.72 * smooth((T - tSlow0) / 0.14) * (1 - smooth((T - tFast) / 0.36));
  const TA0 = 48.0, NTA = 1400, tauTab = new Float64Array(NTA + 1); tauTab[0] = TA0;
  for (let i = 1; i <= NTA; i++) tauTab[i] = tauTab[i - 1] + rateOf(TA0 + (i - 0.5) * DT) * DT;
  const tauOf = T => { if (T <= TA0) return T; const x = (T - TA0) / DT; if (x >= NTA) return tauTab[NTA] + (T - TA0 - NTA * DT); const i = Math.floor(x); return lerp(tauTab[i], tauTab[i + 1], x - i); };
  // 动捕 move__dive-from-run（片段本地秒）：0.20 右脚离地、左脚在前 → 0.28 左脚落地 → 0.575 左脚蹬离 → 身体放平 → 1.0 头朝下
  //   τB 起从冲刺片段换过来（两个片段在这个相位脚的位置对得上）；踏跳段的播放速度按「脚往后走的速度 = 15 m/s」定
  const DV = { l0: 0.2, lP: 0.28, lO: 0.575, lEnd: 1.0, r0: 1.5, rAir: 1.1 };
  const tauB = tauOf(48.13), tauP = tauB + (DV.lP - DV.l0) / DV.r0;
  const diveAt = l => clipAt('move__dive-from-run', l);
  const toeZ = pose => {                              // 这个姿态下左脚尖在根前方多远（米）
    girl.root.position.set(0, 0, 0); girl.root.quaternion.identity(); girl.root.scale.setScalar(H); girl.dancer.apply(pose); girl.root.updateMatrixWorld(true);
    return girl.dancer.S.info.LeftToeBase.bone.getWorldPosition(V()).z;
  };
  const zP = toeZ(diveAt(DV.lP)), zO = toeZ(diveAt(DV.lO)), V0 = 15;
  DV.rP = (DV.lO - DV.lP) / ((zP - zO) / V0);       // 踏跳段片段速度：根平均还是 15 m/s
  const tauO = tauP + (DV.lO - DV.lP) / DV.rP;      // 蹬离崖沿（动作时间）
  const hipsO = diveAt(DV.lO).hips.clone();         // 蹬离那一刻胯相对根的位置：之后的抛体轨迹我们自己给，片段里的下沉不要
  const diveLocal = tau => tau < tauP ? DV.l0 + (tau - tauB) * DV.r0 : tau < tauO ? DV.lP + (tau - tauP) * DV.rP : Math.min(DV.lEnd, DV.lO + (tau - tauO) * DV.rAir);
  const invTau = tau => { let a = 48, b = 50; for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if (tauOf(m) < tau) a = m; else b = m; } return (a + b) / 2; };
  const tOff = invTau(tauO), tPlant = invTau(tauP), tThrow = tOff + 0.02;   // 屏幕时间：蹬离 / 左脚落在崖沿 / 手机甩出
  D.plant = dRun(tauP) + zP;                        // 左脚尖钉住的位置（沿路的距离）
  D.cliff = D.plant + 0.16;                         // 崖沿：脚尖前面一点

  // ================================================================ 世界：一条跑道
  const lyricLines = [L('We had'), L('But now'), L('And you')];
  const obstacles = [
    { type: 'gate', d: D.gate - 0.15, len: 0.3, h: 1.0, move: 'vault-spin' },
    { type: 'gap', d: D.gapA, len: D.gapB - D.gapA, move: 'run-jump-up' },
    { type: 'wall', d: D.wall, len: D.wallEnd - D.wall, side: 1, h: 4.0, move: 'wall-run → wall-jump-off' },
    { type: 'beam', d: D.beam - 0.2, len: 0.4, y: 1.25, move: 'run-slide' },
  ];
  const run = createSpiralRun({ length: D.cliff + 30, roll: { start: dRun(40.4), end: dRun(46.2), turns: 1, radius: 8 }, words: [], obstacles, cliff: D.cliff, t0: T0, speed: 15 });
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
  // 漫画页期间（43.21–46.90）开唱的词不挂牌（在页面里写成拟声字 / 对白框）；唱到回 3D 之后还没唱完的（optimizing）在 46.90 补一块已亮的牌
  const inComic = t => t >= tComic - 0.02 && t < tSlide;
  const signs = lyricLines.flatMap((line, li) => line.words.flatMap((w, wi) => {
    const until = Math.min(line.end + 0.35, (line.words[wi + 3]?.start ?? Infinity) + 0.3);
    if (!inComic(w.start)) return [makeSign(w, line, li, w.start, until)];
    if (w.end > tSlide + 0.25) { const s = makeSign(w, line, li, tSlide, Math.min(w.end + 0.3, (line.words[wi + 1]?.start ?? Infinity) + 0.04)); s.cont = true; return [s]; }
    return [];
  }));
  // 断崖处的坐标系（世界固定）：F 前、U 上、R 她的右手边
  const fEdge = run.frameAt(D.plant, 0, 1), F = fEdge.forward.clone().normalize(), U = fEdge.up.clone().normalize(), R = new THREE.Vector3().crossVectors(F, U).normalize();
  const edgePos = fEdge.pos.clone();                 // 踏跳点（崖沿）
  // 深渊：断崖外、脚下很深处的城（两片错开，铺成一片灯海；下落时越来越近）
  const abyss = new THREE.Group(); scene.add(abyss);
  placeOnFrame(abyss, { pos: edgePos, forward: F, up: U });
  for (const [seed, x, y, z, sc] of [[31, 0, -150, 34, 6.5], [47, -120, -165, 70, 6.5], [58, 125, -160, 60, 6.5], [63, 10, -150, 170, 7], [71, -150, -140, 260, 7.5], [83, 140, -140, 280, 7.5], [91, 0, -130, 400, 8]]) {
    const city = createCity({ seed, n: 25 }); city.update(0, { draw: 1, extrude: 1, light: 1 });
    city.group.scale.setScalar(sc); city.group.position.set(x, y, z); abyss.add(city.group);
  }
  // 固定参照（不跟路面转）：上半天的星、前方天上一轮粉月
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
  function drawSpeedLines(T, amt) {
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

  // ================================================================ 她在跑道上
  // 前半（到翻杆）：按时间播片段，同旧版
  const SEQ = [
    { t: 38.0, anim: 'move__run-fast__inplace', rate: 1.8 },
    { t: 41.6, anim: 'move__sprint-full__inplace', rate: 1.75 },
    { t: E.vault.start, anim: 'move__vault-spin', rate: E.vault.rate },
    { t: E.vault.start + 1.1 / E.vault.rate, anim: 'move__sprint-full__inplace', rate: 1.75 },
  ];
  SEQ.fade = 0.1;
  // 后半（滑铲 → 崖边 → 信仰之跃 → 下落）
  const STRIDE = getAnim('move__sprint-full__inplace').duration / (3.97 * H);   // 冲刺片段：每前进 1 m 播多少秒（index.json root.dz = 3.97 身高 / 周期）
  const SPRINT_DUR = getAnim('move__sprint-full__inplace').duration;
  const RUN_PH = (((0.64 - (dRun(tauB) - dRun(tUp0)) * STRIDE) % SPRINT_DUR) + SPRINT_DUR) % SPRINT_DUR;   // 冲刺相位：到 τB 时正好是「右脚在后刚离地、左脚在前」（片段 0.64 s），接得上鱼跃片段的 0.20 s
  const ARM = /^(Left|Right)(Arm|ForeArm|Hand)/;
  const swanPose = solveSpec(SWAN);
  const VT = 26, CD = 0.5, VU0 = 3.2;               // 抛体：起跳带一点向上的初速，之后指数趋近终端速度 VT
  const riseAt = k => -VT * k + (VU0 + VT) / CD * (1 - Math.exp(-CD * k));
  function tail(T) {
    const tau = tauOf(T);
    // 姿态：滑铲 → 冲刺（按距离走相位）→ 鱼跃片段；蹬离后手臂换成天鹅式张开
    let pose;
    if (tau < tauB + 0.05) {
      const d = dRun(tau);
      const slide = T < tUp1 ? clipAt('move__run-slide', (T - tSlide) * E.slide.rate) : null;
      const sprint = T > tUp0 ? clipAt('move__sprint-full__inplace', RUN_PH + (d - dRun(tUp0)) * STRIDE) : null;
      pose = !sprint ? slide : !slide ? sprint : blendSolved(slide, sprint, smooth((T - tUp0) / (tUp1 - tUp0)));
      if (tau > tauB) pose = blendSolved(pose, diveAt(diveLocal(tau)), smooth((tau - tauB) / 0.05));
    } else {
      pose = diveAt(diveLocal(tau));
      const w = smooth((T - (tOff - 0.03)) / 0.34);
      if (w > 0) { const d = { ...pose.d }; for (const k of Object.keys(d)) if (ARM.test(k) && swanPose.d[k]) d[k] = d[k].clone().slerp(swanPose.d[k], w); pose = { ...pose, d }; }
      if (tau > tauO) pose = { ...pose, hips: hipsO.clone() };
    }
    // 根：跑道上 → 踏跳时由钉住的左脚尖反推 → 蹬离后走抛体
    let d, pos;
    if (tau < tauP) d = dRun(tau);
    else d = D.plant - toeZ(tau < tauO ? pose : diveAt(DV.lO));
    const f = run.frameAt(Math.min(d, D.cliff + 20), 0, 1);
    pos = f.pos.clone();
    if (tau > tauO) { const k = tau - tauO; pos.addScaledVector(F, V0 * (1 - Math.exp(-0.5 * k)) / 0.5).addScaledVector(U, riseAt(k)); }
    girl.root.scale.setScalar(H); placeOnFrame(girl.root, { pos, forward: f.forward, up: f.up });
    girl.dancer.apply(pose); girl.root.updateMatrixWorld(true);
    return { d, s: 0, f, t: T, tau, com: hipsBone.getWorldPosition(V()) };
  }
  function placeGirl(T) {
    scene.add(girl.root); girl.root.visible = true; girl.root.scale.setScalar(H);
    if (T >= tSlide - 0.2) return tail(T);
    const d = dRun(T), f = run.frameAt(d, 0, 1);
    placeOnFrame(girl.root, { pos: f.pos, forward: f.forward, up: f.up });
    girl.play(SEQ, T);
    return { d, s: 0, f, t: T };
  }

  // ================================================================ 共用 update：摆世界、摆她、机位由各镜头给
  const stepShake = T => {                          // 每步落地镜头微震：跑步片段 2 步 / 周期，1.8 倍速 → 一步 0.148 s
    const per = 0.533 / 1.8 / 2, ph = ((T - 38.0) % per) / per;
    return Math.exp(-ph * 7) * 0.035;
  };
  const skyA = col('#06060b'), skyB = col('#172444');
  function world(T) {
    const open = smooth((T - tFast) / 0.9);          // 掉下去之后：天空从夜黑亮成深蓝
    scene.background.lerpColors(skyA, skyB, open); scene.fog.color.copy(scene.background);
    scene.fog.far = lerp(230, 900, smooth((T - 47.3) / 0.7));   // 到崖边：雾拉远，看得见脚下和远处的城
    run.update(T, { d: Math.min(dRun(T), D.cliff), fold: 1 });
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
  // 跟拍机位：以她当前跑道坐标系为参照（back 后退、lat 横移、up 抬高），相机「上」跟着路面转
  function chase(G, T, { back = 3.2, lat = -0.9, up = 0.35, ahead = 7, lookUp = 0.9, fov = 62, shake = 1 }) {
    const fc = run.frameAt(G.d - back, G.s + lat, 1), fa = run.frameAt(G.d + ahead, G.s * 0.5, 1);
    const sh = stepShake(T) * shake;
    cam.position.copy(fc.pos).addScaledVector(fc.up, up + sh).addScaledVector(fc.side, sh * 0.4);
    cam.up.copy(G.f.up);
    cam.lookAt(fa.pos.addScaledVector(fa.up, lookUp));
    cam.fov = fov; cam.updateProjectionMatrix();
  }
  const hideProps = () => { phone.visible = false; stream.visible = false; fallLines.visible = false; lyricFx.visible = false; };
  // opts.freeze：这一刻之后整个画面定格（世界、她、机位都停在 freeze）
  const runShot = (id, t0, t1, camFn, opts = {}) => {
    const shot = {
      id, t0, t1, transitionIn: opts.transitionIn ?? { kind: 'cut' },
      build() { return {}; },
      update(S, T) {
        const Tw = opts.freeze ? Math.min(T, opts.freeze) : T;
        const G = world(Tw);
        hideProps();
        girl.setSkin('toon', Tw);
        const sp = camFn(G, Tw) ?? 1;
        girl.face?.update(Tw, { camera: null, expression: opts.expression ?? 'neutral' });   // 这一段脸都很小（≤ 8% 画高）或是背影：用网格投影的脸（同旧版），不开屏幕空间五官层
        drawSpeedLines(Tw, sp * (opts.lines ?? 1));
        return { scene, camera: cam, post: post(Tw, { speed: sp, extra: opts.post?.(T) ?? {} }) };
      },
    };
    shots.push(shot); runShots.push(shot);
  };

  // 38.400 一镜到底：稳定高速跑（低机位贴地追拍，从左后慢慢摆到左侧），41.34 起加速 → FOV 拉伸、机位压低贴近
  runShot('run', 38.4, 42.053, (G, T) => {
    const a = smooth((T - 38.4) / 2.9), acc = smooth((T - E.accel) / 0.8);
    chase(G, T, { back: lerp(3.6, 1.8, a) - acc * 0.4, lat: lerp(-0.8, -2.2, a) + acc * 1.4, up: lerp(0.45, 0.3, a), ahead: lerp(6, 3, a) + acc * 5, lookUp: lerp(0.9, 1.0, a), fov: 60 + 16 * acc });
    return 0.35 + 0.65 * acc;
  });
  // 42.053 插入：闸门旁固定低机位（世界坐标钉在闸门边），她冲进来、手撑转体越过；越过去之后定格（漫画的第 0 格），白闪切到漫画页
  runShot('gate', 42.053, tComic, (G, T) => {
    const fg = run.frameAt(D.gate + 6.5, -1.4, 1), ft = run.frameAt(D.gate, 0, 1);
    cam.position.copy(fg.pos).addScaledVector(fg.up, 0.35); cam.up.copy(ft.up);
    const track = run.frameAt(clamp(G.d, D.gate - 14, D.gate + 3), 0, 1);
    cam.lookAt(track.pos.lerp(ft.pos, 0.3).addScaledVector(ft.up, 1.0)); cam.fov = 44; cam.updateProjectionMatrix();
    return 0.6;
  }, { freeze: tFreeze });

  // ================================================================ 43.210 漫画页：第 0 格（定格帧）+ 四格 + 破格
  const comic = await createComic(mv, { w: 20, h: 11.25, seed: 43 });
  const cScene = new THREE.Scene();
  { const c = canvas(16, 256), g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#2a1d4a'); gr.addColorStop(1, '#0e0b18'); g.fillStyle = gr; g.fillRect(0, 0, 16, 256);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; cScene.background = t; }
  cScene.add(comic.group, createGirlLights({ key: 2.4, rim: 2.4, fill: 1.3 }));
  comic.group.rotation.set(-0.05, 0.04, -0.012);
  const cCam = new THREE.PerspectiveCamera(36, 16 / 9, 0.05, 800);
  const tP = { gap: 43.62, wall: 44.08, flip: 44.781, land: 45.236, crack2: 45.69, opt: 46.16, wind: 46.42 };   // 各格出现的时刻（对词 / 对拍）
  // 画关键画：中心 (cx, cy)，高 h（px），可旋转 / 压扁 / 半透明
  const fig = (c, im, cx, cy, h, { rot = 0, sx = 1, sy = 1, alpha = 1 } = {}) => {
    const k = h / im.height;
    c.save(); c.globalAlpha *= alpha; c.translate(cx, cy); c.rotate(rot); c.scale(k * sx, k * sy); c.drawImage(im, -im.width / 2, -im.height / 2); c.restore();
  };
  const bleed = (c, b, fill) => { c.fillStyle = fill; c.fillRect(-80, -80, b.w + 160, b.h + 160); };
  const grad = (c, b, stops, x0 = 0, y0 = 0, x1 = 0, y1 = null) => { const g = c.createLinearGradient(x0, y0, x1, y1 ?? b.h); for (const [k, v] of stops) g.addColorStop(k, v); return g; };
  // 跑道的一块（和 3D 里同一条路：深紫路面、粉 / 薄荷霓虹边线、黄色中线）
  const slab = (c, pts, { edge = [0, 1], color = PAL.pink } = {}) => {
    c.save(); c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fillStyle = '#3b2f70'; c.fill();
    c.lineWidth = 9; c.strokeStyle = color; c.shadowColor = color; c.shadowBlur = 22; c.lineCap = 'round';
    c.beginPath(); c.moveTo(...pts[edge[0]]); c.lineTo(...pts[edge[1]]); c.stroke(); c.restore();
  };

  // ---- 第 0 格：3D 定格的那一帧。43.21 这块平面正好铺满画面（= 上一帧），0.2 s 内描上墨线和网点、落下格框，然后镜头拉开，它就是这页的第一格。
  //   贴图在 build 的最后抓（captureFreeze）：把定格帧照常渲一遍、从画布拷下来，再做一张「漫画化」的版本。
  const P0 = { x: 0.025, y: 0.045, w: 0.37, h: 0.37 };                                    // 7.4 × 4.1625 页面单位 = 16:9
  const p0U = { mapA: { value: null }, mapB: { value: null }, uMix: { value: 0 } };
  const p0Mesh = new THREE.Mesh(new THREE.PlaneGeometry(P0.w * comic.W, P0.h * comic.H), new THREE.ShaderMaterial({
    uniforms: p0U,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform sampler2D mapA, mapB; uniform float uMix; varying vec2 vUv; void main(){ gl_FragColor = vec4(mix(texture2D(mapA, vUv).rgb, texture2D(mapB, vUv).rgb, uMix), 1.0); }',
  }));
  p0Mesh.position.copy(comic.pagePt(P0.x + P0.w / 2, P0.y + P0.h / 2, 0.004)); comic.body.add(p0Mesh);
  const p0Border = (() => {
    const pad = 30, w = Math.round(P0.w * comic.W * 100) + pad * 2, h = Math.round(P0.h * comic.H * 100) + pad * 2, cv = canvas(w, h), g = cv.getContext('2d');
    C.rough(g, [[pad, pad], [w - pad, pad], [w - pad, h - pad], [pad, h - pad]], { width: 12, color: PAL.ink, rough: 0.6, seed: 77 });
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w / 100, h / 100), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false })); m.renderOrder = 3;
    m.position.copy(comic.pagePt(P0.x + P0.w / 2, P0.y + P0.h / 2, 0.008)); comic.body.add(m); return m;
  })();
  function captureFreeze() {
    const fr = shots.find(s => s.id === 'gate').update(null, tComic - 0.001);
    mv.stage.render(fr.scene, fr.camera, fr.post);
    const src = renderer.domElement, W = src.width, Hh = src.height, raw = canvas(W, Hh), g = raw.getContext('2d', { willReadFrequently: true });
    g.drawImage(src, 0, 0);
    const im = g.getImageData(0, 0, W, Hh), d = im.data, lum = new Float32Array(W * Hh);
    for (let i = 0, q = 0; i < lum.length; i++, q += 4) lum[i] = 0.3 * d[q] + 0.59 * d[q + 1] + 0.11 * d[q + 2];
    const ink = canvas(W, Hh), ig = ink.getContext('2d'), out = ig.createImageData(W, Hh), o = out.data;
    const cs = Math.max(4, Math.round(W / 190)), INK = [10, 10, 16];
    for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x, q = i * 4, L0 = lum[i];
      // 平涂：提饱和度 + 每通道 5 档色阶
      let r = L0 + (d[q] - L0) * 1.35, gg = L0 + (d[q + 1] - L0) * 1.35, b = L0 + (d[q + 2] - L0) * 1.35;
      const pz = v => Math.round(clamp(v / 255) * 4) / 4 * 255; r = pz(r); gg = pz(gg); b = pz(b);
      // 网点：暗部（夜空、路面）铺一层斜 45° 的紫色圆点
      if (L0 < 46) { const u = (x + y) / cs, v = (x - y) / cs, fu = u - Math.floor(u) - 0.5, fv = v - Math.floor(v) - 0.5; if (fu * fu + fv * fv < 0.075) { r = 62; gg = 46; b = 110; } }
      // 墨线：亮度的 Sobel 边缘
      if (x > 0 && y > 0 && x < W - 1 && y < Hh - 1) {
        const gx = lum[i - W + 1] + 2 * lum[i + 1] + lum[i + W + 1] - lum[i - W - 1] - 2 * lum[i - 1] - lum[i + W - 1];
        const gy = lum[i + W - 1] + 2 * lum[i + W] + lum[i + W + 1] - lum[i - W - 1] - 2 * lum[i - W] - lum[i - W + 1];
        const e = clamp((Math.hypot(gx, gy) - 110) / 160);
        if (e > 0 && L0 < 150) { r = lerp(r, INK[0], e); gg = lerp(gg, INK[1], e); b = lerp(b, INK[2], e); }
      }
      o[q] = r; o[q + 1] = gg; o[q + 2] = b; o[q + 3] = 255;
    }
    ig.putImageData(out, 0, 0);
    for (const [k, cv] of [['mapA', raw], ['mapB', ink]]) { const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; p0U[k].value = t; }
  }
  // ---- 格 1：飞跃断口（俯拍）。下面很深处是城，上下两段路，她在中间的半空
  comic.panel({ id: 'gap', poly: [[0.415, 0.045], [0.6, 0.045], [0.585, 0.415], [0.415, 0.415]], reveal: { at: tP.gap, kind: 'pop', dur: 0.16 }, dim: { at: 45.4, amount: 0.25 }, border: 'ink', borderW: 12,
    layers: [
      { depth: 2.4, draw: (c, b, T) => {
        bleed(c, b, grad(c, b, [[0, '#1c1646'], [0.45, '#07060f'], [0.62, '#07060f'], [1, '#1c1646']]));
        const rnd = mulberry32(5);                                   // 深渊底的城：一小簇亮窗
        for (let i = 0; i < 170; i++) { const x = b.w * (0.5 + (rnd() - 0.5) * 0.72), y = b.h * (0.52 + (rnd() - 0.5) * 0.3), s = 3 + rnd() * 6; c.globalAlpha = 0.35 + 0.6 * rnd(); c.fillStyle = [PAL.lemon, PAL.lemon, PAL.pink, PAL.mint, PAL.paper][Math.floor(rnd() * 5)]; c.fillRect(x, y, s, s * 1.3); }
        c.globalAlpha = 1;
      } },
      { depth: 1.1, draw: (c, b, T) => C.speedLines(c, { x: -60, y: -60, w: b.w + 120, h: b.h + 120 }, T, { angle: 90, n: 46, color: PAL.mint, width: 4, speed: 2.4, alpha: 0.4, seed: 4 }) },
      { depth: 0.8, draw: (c, b) => {
        slab(c, [[b.w * 0.08, b.h * 0.25], [b.w * 0.92, b.h * 0.215], [b.w * 1.04, -80], [b.w * -0.02, -80]], { color: PAL.mint });          // 对岸
        c.fillStyle = PAL.lemon; for (let i = 0; i < 3; i++) c.fillRect(b.w * 0.48, b.h * (0.03 + i * 0.06), b.w * 0.04, b.h * 0.03);
        slab(c, [[-80, b.h * 0.76], [b.w + 80, b.h * 0.71], [b.w + 80, b.h + 80], [-80, b.h + 80]], { color: PAL.pink });             // 起跳这边
        c.fillStyle = PAL.lemon; for (let i = 0; i < 2; i++) c.fillRect(b.w * 0.47, b.h * (0.92 + i * 0.05), b.w * 0.05, b.h * 0.03);
        c.setLineDash([26, 20]); c.lineWidth = 7; c.strokeStyle = 'rgba(242,237,228,0.8)'; c.beginPath(); c.moveTo(b.w * 0.5, b.h * 0.735); c.quadraticCurveTo(b.w * 0.2, b.h * 0.5, b.w * 0.5, b.h * 0.24); c.stroke(); c.setLineDash([]);   // 起跳 → 落点的弧线
      } },
      { depth: 0.2, draw: (c, b, T) => fig(c, IMG.gap, b.w * 0.52, b.h * 0.475 + 9 * Math.sin(T * 5.2), b.h * 0.5, { rot: -0.05 }) },
    ] });
  // ---- 格 2：蹬墙跑（侧拍）。整面青色高墙斜在画面里，她踩着墙面跑，身后三道残影；远处的城是正的 → 看得出她是斜的
  const WALL_ROT = -0.46;
  comic.panel({ id: 'wall', poly: [[0.62, 0.045], [0.975, 0.045], [0.975, 0.39], [0.605, 0.415]], reveal: { at: tP.wall - 0.14, kind: 'slide', dir: 'r', dur: 0.2 }, dim: { at: 45.4, amount: 0.25 }, border: 'ink', borderW: 12,
    layers: [
      { depth: 1.8, draw: (c, b) => { bleed(c, b, grad(c, b, [[0, '#0c0a1c'], [1, '#2c2456']])); C.city(c, { x: -60, y: 0, w: b.w + 120, h: b.h }, { base: b.h + 20, hMax: 0.5, n: 30, seed: 9, color: '#15122c' }); } },
      { depth: 0.6, draw: (c, b, T) => {
        c.save(); c.translate(b.w * 0.5, b.h * 0.5); c.rotate(WALL_ROT);
        const y0 = b.h * 0.3, g = c.createLinearGradient(0, y0, 0, y0 + b.h); g.addColorStop(0, '#3fd1b0'); g.addColorStop(1, '#1c7f6d');
        c.fillStyle = g; c.fillRect(-b.w, y0, b.w * 2, b.h * 1.4);
        c.strokeStyle = 'rgba(10,30,30,0.35)'; c.lineWidth = 4; const off = (T * 700) % 150;
        for (let x = -b.w; x < b.w; x += 150) { c.beginPath(); c.moveTo(x - off + 150, y0); c.lineTo(x - off + 150 - 40, y0 + b.h * 1.4); c.stroke(); }
        for (let r = 0; r < 4; r++) for (let x = -b.w; x < b.w; x += 150) { const on = hash(Math.floor((x - off) / 150) + r * 31, 7) > 0.35; c.fillStyle = on ? 'rgba(244,224,77,0.85)' : 'rgba(10,40,40,0.35)'; c.fillRect(x - off + 150 + 26 - r * 9, y0 + 50 + r * 95, 70, 58); }   // 楼面上的窗：这是一面墙，不是坡
        c.strokeStyle = '#b6ffe9'; c.lineWidth = 7; c.shadowColor = PAL.mint; c.shadowBlur = 20; c.beginPath(); c.moveTo(-b.w, y0); c.lineTo(b.w, y0); c.stroke();
        c.restore();
      } },
      { depth: 0.2, draw: (c, b, T) => {
        c.save(); c.translate(b.w * 0.5, b.h * 0.5); c.rotate(WALL_ROT);
        const hF = b.h * 0.86, y = b.h * 0.3 - hF * 0.46, x = b.w * 0.06 + 10 * Math.sin(T * 4);
        [[3, 0.12], [2, 0.22], [1, 0.38]].forEach(([k, a]) => fig(c, IMG.wall, x - k * hF * 0.36, y, hF, { alpha: a }));
        fig(c, IMG.wall, x, y, hF);
        c.restore();
      } },
      { depth: 0, draw: (c, b, T) => C.speedLines(c, b, T, { angle: WALL_ROT * 180 / Math.PI, n: 34, color: '#ffffff', width: 3, speed: 4, alpha: 0.5, seed: 12, gap: 0.4 }) },
    ] });
  // ---- 格 3：蹬墙后翻（大格，她是倒着的）。右边是刚蹬离的墙，一道弧线从墙划到她
  comic.panel({ id: 'flip', poly: [[0.025, 0.455], [0.5, 0.455], [0.485, 0.955], [0.025, 0.955]], reveal: { at: tP.flip, kind: 'pop', dur: 0.16 }, depth: 0.04, border: 'ink', borderW: 12,
    layers: [
      { depth: 1.4, draw: (c, b, T) => {
        const g = c.createRadialGradient(b.w * 0.45, b.h * 0.5, 30, b.w * 0.45, b.h * 0.5, b.w * 0.8); g.addColorStop(0, '#fff3a8'); g.addColorStop(0.45, PAL.lemon); g.addColorStop(1, '#ff7fb8'); bleed(c, b, g);
        C.focusLines(c, { x: -60, y: -60, w: b.w + 120, h: b.h + 120 }, T, { fx: 0.46, fy: 0.5, inner: 0.5, n: 90, color: PAL.ink, alpha: 0.5, seed: 6 });
      } },
      { depth: 0.6, draw: (c, b) => {
        c.fillStyle = '#2aa98f'; c.beginPath(); c.moveTo(b.w * 0.86, -80); c.lineTo(b.w + 80, -80); c.lineTo(b.w + 80, b.h + 80); c.lineTo(b.w * 0.94, b.h + 80); c.closePath(); c.fill();
        c.strokeStyle = '#b6ffe9'; c.lineWidth = 7; c.beginPath(); c.moveTo(b.w * 0.86, -80); c.lineTo(b.w * 0.94, b.h + 80); c.stroke();
        const sx = b.w * 0.905, sy = b.h * 0.64; c.fillStyle = '#ffffff'; c.strokeStyle = PAL.ink; c.lineWidth = 5; c.beginPath();       // 蹬墙那一下的星形
        for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, r = i % 2 ? 26 : 64; c.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r); } c.closePath(); c.fill(); c.stroke();
        c.lineCap = 'round'; c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = 26; c.beginPath(); c.moveTo(sx - 40, sy - 10); c.quadraticCurveTo(b.w * 0.72, b.h * 0.04, b.w * 0.36, b.h * 0.16); c.stroke();
        c.strokeStyle = PAL.ink; c.lineWidth = 5; c.beginPath(); c.moveTo(sx - 46, sy - 26); c.quadraticCurveTo(b.w * 0.72, b.h * 0.0, b.w * 0.34, b.h * 0.12); c.stroke();
      } },
      { depth: 0.15, draw: (c, b, T) => fig(c, IMG.flip, b.w * 0.46, b.h * 0.53, b.h * 0.86, { rot: 0.5 * (1 - eOut((T - tP.flip) / 0.35)) + 0.03 * Math.sin(T * 5) }) },
    ] });
  // ---- 格 4：重落地。地面从拳头下裂开；46.42 蓄力；46.60 她破格冲出（格里只留白剪影一闪）
  const FIST = [0.47, 0.86];
  comic.panel({ id: 'land', poly: [[0.52, 0.455], [0.975, 0.43], [0.975, 0.955], [0.505, 0.955]], reveal: { at: tP.land - 0.1, kind: 'drop', dur: 0.1 }, border: 'ink', borderW: 12,
    layers: [
      { depth: 1.6, draw: (c, b) => { bleed(c, b, grad(c, b, [[0, '#120e2a'], [0.7, '#3a2a6a']])); C.city(c, { x: -60, y: 0, w: b.w + 120, h: b.h }, { base: b.h * 0.7, hMax: 0.5, n: 20, seed: 14, color: '#1b1638' }); C.tone(c, b, { color: PAL.pink, step: 16, grad: [0.5, 0], alpha: 0.3 }); } },
      { depth: 0.5, draw: (c, b, T) => {
        slab(c, [[-80, b.h * 0.68], [b.w + 80, b.h * 0.66], [b.w + 80, b.h + 80], [-80, b.h + 80]], { color: PAL.mint });
        const x = b.w * FIST[0], y = b.h * FIST[1];
        C.cracks(c, x, y, { n: 11, len: b.w * 0.5, seed: 3, progress: eOut((T - tP.land) / 0.14), width: 6, color: PAL.paper });
        if (T >= tP.crack2) C.cracks(c, x, y, { n: 15, len: b.w * 0.78, seed: 8, progress: eOut((T - tP.crack2) / 0.16), width: 4, color: PAL.mint });
        for (const t0 of [tP.land, tP.crack2]) { const k = (T - t0) / 0.5; if (k > 0 && k < 1) { c.strokeStyle = `rgba(242,237,228,${0.9 * (1 - k)})`; c.lineWidth = 10 * (1 - k) + 2; c.beginPath(); c.ellipse(x, y, b.w * 0.6 * eOut(k), b.h * 0.16 * eOut(k), 0, 0, Math.PI * 2); c.stroke(); } }
      } },
      { depth: 0.15, draw: (c, b, T) => {
        if (T >= tBreak + 0.07) return;
        const k = T - tP.land, w = smooth((T - tP.wind) / 0.14), sq = 1 - 0.12 * Math.exp(-Math.max(0, k) * 12) - 0.06 * w;
        const h = b.h * 0.74, cy = b.h * 0.58 + h * (1 - sq) * 0.5 + 6 * w;
        fig(c, T >= tBreak - 0.04 ? landW : IMG.land, b.w * 0.5, cy, h, { sy: sq, sx: 1 + 0.5 * (1 - sq) });
      } },
      { depth: 0, draw: (c, b, T) => { const w = smooth((T - tP.wind) / 0.16); if (w > 0) C.focusLines(c, b, T, { fx: 0.5, fy: 0.55, inner: lerp(0.75, 0.42, w), n: 70, color: '#ffffff', alpha: 0.75 * w, seed: 9 }); } },
    ] });
  // ---- 歌词：拟声大字 / 对白框（字都放在格子里没有她的地方）
  const wOf = (line, p) => line.words.find(w => w.w.toLowerCase().startsWith(p));
  comic.sfx({ text: "SINGULARITY'S", x: 0.5, y: 0.375, size: 0.034, at: tP.gap + 0.05, color: PAL.lemon, stroke: PAL.ink, angle: -4, shake: 1 });
  comic.sfx({ text: 'BEGUN', x: 0.895, y: 0.345, size: 0.075, at: wOf(lyricLines[1], 'begun').start, color: PAL.pink, stroke: PAL.ink, shadow: PAL.lemon, angle: 5, shake: 1 });
  comic.bubble({ x: 0.885, y: 0.525, w: 0.15, words: [wOf(lyricLines[2], 'and'), wOf(lyricLines[2], 'you')], kind: 'shout', size: 60, at: tP.land + 0.02, until: 45.95 });
  comic.sfx({ text: 'BOOM!', x: 0.9, y: 0.885, size: 0.075, at: tP.land, until: tP.wind, color: PAL.pink, stroke: PAL.ink, shadow: PAL.lemon, angle: -9, shake: 1 });
  comic.sfx({ text: 'OPTIMIZING', x: 0.74, y: 0.5, size: 0.07, at: tP.opt, color: PAL.lemon, stroke: PAL.ink, angle: -4, shake: 1 });
  comic.shock({ x: 0.726, y: 0.9, at: tP.land, dur: 0.45, radius: 2.4, color: PAL.paper });
  comic.shock({ x: 0.726, y: 0.9, at: tP.crack2, dur: 0.45, radius: 3.0, color: PAL.mint });
  comic.shock({ x: 0.74, y: 0.72, at: tBreak, dur: 0.3, radius: 3.4, color: PAL.paper });
  comic.sparks({ from: [0.74, 0.7], to: [0.74, 0.8], at: tBreak, dur: 0.35, n: 60, color: PAL.lemon, out: true, outZ: 9, spread: 2.4, burst: false });
  comic.byId('land').crack = { at: tBreak - 0.02, x: 0.5, y: 0.55 };
  const cKeys = [
    { t: tComic, target: [P0.x, P0.y, P0.w, P0.h], yaw: 0, pitch: 0, roll: 0, margin: 1.0 },        // 第 0 格正好铺满 = 3D 定格的那一帧
    { t: 43.42, target: [P0.x, P0.y, P0.w, P0.h], yaw: 0, pitch: 0, roll: 0, margin: 1.0 },
    { t: 43.74, target: [0, 0, 0.64, 0.47], yaw: 5, pitch: -2, roll: -1, margin: 1.0 },             // 拉开：第 0 格 + 格 1
    { t: 44.02, target: [0, 0, 0.64, 0.47], yaw: 4, pitch: -2, roll: -1, margin: 0.98 },
    { t: 44.24, target: [0.38, 0, 0.62, 0.47], yaw: -4, pitch: 2, roll: 1, margin: 1.0 },           // 格 1 + 格 2
    { t: 44.7, target: [0.4, 0, 0.6, 0.46], yaw: -2, pitch: 2, roll: 0.5, margin: 0.98 },
    { t: 44.9, target: 'flip', yaw: 4, pitch: -3, roll: -1.5, margin: 1.12 },                        // 格 3
    { t: 45.18, target: 'flip', yaw: 3, pitch: -2, roll: -1, margin: 1.09 },
    { t: 45.36, target: 'land', yaw: -5, pitch: -3, roll: 1.5, margin: 1.12 },                       // 格 4
    { t: 45.75, target: 'land', yaw: -3, pitch: -2, roll: 1, margin: 1.09 },
    { t: 46.1, target: 'page', yaw: -2, pitch: -2, roll: 0, margin: 0.96 },                          // 五格全景：一页看完整段动作
    { t: 46.32, target: 'page', yaw: -1, pitch: -1, roll: 0, margin: 0.95 },
    { t: 46.56, target: 'land', yaw: -4, pitch: -2, roll: 1, margin: 1.1 },                          // 推回格 4：要冲了
    { t: 46.9, target: 'land', yaw: -6, pitch: -3, roll: 1.5, margin: 1.16 },
  ];
  // 破格：3D 的她从格 4 冲出来，迎着镜头跑（页面单位：身高 3.1 → 3.5，从贴着纸面跑到离纸 6.4）
  const outA = comic.pagePt(0.74, 0.955, 0.4), outB = comic.pagePt(0.745, 0.985, 7.0);
  shots.push({
    id: 'comic', t0: tComic, t1: tSlide, transitionIn: { kind: 'cut' },
    build() { return {}; },
    update(_, T) {
      comic.camPath(cCam, T, cKeys);
      const hits = [tP.gap, tP.wall, tP.flip, tP.land, tP.crack2, tBreak].filter(t => T >= t), k = hits.length ? T - hits.at(-1) : 9;
      const sh = (hits.length >= 4 ? 0.14 : 0.07) * Math.exp(-k * 12);
      const e0 = smooth((T - tComic) / 0.3);                                                          // 开头 0.3 s：后处理从零加上来（第一帧 = 定格帧原样），第 0 格描上墨线、落下格框
      p0U.uMix.value = smooth((T - tComic - 0.03) / 0.17); p0Border.material.opacity = p0U.uMix.value;                              // 每格拍下来镜头震一下，落地那格更重
      cCam.position.x += sh * Math.sin(k * 95); cCam.position.y += sh * 0.6 * Math.cos(k * 71);
      const out = T >= tBreak;
      if (out) {
        const e = clamp((T - tBreak) / (tSlide - tBreak)) ** 1.25;
        comic.over.add(girl.root); girl.root.visible = true;
        girl.root.position.copy(outA).lerp(outB, e); girl.root.rotation.set(-0.3, 0, 0); girl.root.scale.setScalar(lerp(3.3, 3.7, e));   // 冲刺片段上身前倾 ~20°，根往后仰一点，脸正对镜头
        girl.dancer.apply(clipAt('move__sprint-full__inplace', 0.2 + (T - tBreak) * 1.75));
        girl.setSkin('toon', T);
      } else if (girl.root.parent === comic.over) girl.root.visible = false;
      // comic.js 的视差用格子父级的 matrixWorld，父级（reveal 动画）这一帧才改 → 先跑一遍摆好、刷新矩阵，再跑一遍画（乱序 seek 才一致）
      cCam.updateMatrixWorld(); comic.update(T, { camera: cCam }); comic.group.updateMatrixWorld(true); comic.update(T, { camera: cCam });
      if (out) girl.face?.update(T, { camera: null, expression: 'grin', blink: false });   // 她挂在漫画页坐标系里，屏幕空间五官层摆不准 → 这 0.3 s 用网格投影的脸
      return { scene: cScene, camera: cCam, post: { bloom: { strength: 0.5 * e0, threshold: 1.0 }, grade: { vignette: 0.28 * e0 }, chroma: (0.08 + 0.2 * kick(T) + 0.35 * Math.exp(-k * 8)) * e0, flash: { amount: 0.3 * Math.exp(-Math.abs(T - tComic - 0.1) * 22), color: '#ffffff' } } };
    },
  });

  // ================================================================ 46.900 回到跑道
  // 前方低机位回看：滑铲过横梁（镜头在她前面倒退）
  runShot('slide', tSlide, 47.507, (G, T) => {
    chase(G, T, { back: -3.2, lat: 0.2, up: 0.5, ahead: -6, lookUp: 0.3, fov: 54 });
    return 0.7;
  }, { transitionIn: { kind: 'flash', dur: 0.16, peak: 0.85 }, expression: 'grin' });
  // 47.507 起身全速冲向断崖：贴地追拍，越跑越低越近（下一镜切到崖边的固定机位看她蹬出去）
  runShot('edge', 47.507, tLeap, (G, T) => {
    const a = smooth((T - 47.55) / 0.45);
    chase(G, T, { back: lerp(3.2, 2.4, a), lat: lerp(-1.1, -1.5, a), up: lerp(0.35, 0.5, a), ahead: 8, lookUp: 1.0, fov: lerp(70, 76, a) });
    return 1;
  });

  // ================================================================ 歌词牌摆位（build 时算一次，确定性；逻辑同旧版）
  // 每个词：在它开唱那一刻的机位下，从跑道上一批候选位置里挑一个：整块在画面内、字高 ≥ 6% 画高、前面没有楼挡着、
  //   不和她（骨骼投影框）/ 同句别的牌重叠、不挡她的路；朝向 = 面向开唱时刻的镜头。结果在 window.__lyricCheck。
  const SIGN_END = tLeap - 0.02;
  const shotAt = T => runShots.find(s => T >= s.t0 && T < s.t1);
  const _v = new THREE.Vector3();
  function rectOf(ps) {
    if (ps.some(p => p.z > 1 || p.z < -1)) return null;
    return { x0: Math.min(...ps.map(p => p.x)), x1: Math.max(...ps.map(p => p.x)), y0: Math.min(...ps.map(p => p.y)), y1: Math.max(...ps.map(p => p.y)) };
  }
  function camState(T) {
    const sh = shotAt(T); sh.update(null, T); cam.updateMatrixWorld(true); girl.root.updateMatrixWorld(true);
    const I = girl.dancer.S.info, pts = ['Head', 'Hips', 'LeftFoot', 'RightFoot', 'LeftHand', 'RightHand', 'LeftToeBase', 'RightToeBase'].map(k => I[k].bone.getWorldPosition(new THREE.Vector3()));
    pts.push(pts[0].clone().addScaledVector(girl.root.up.set(0, 1, 0).applyQuaternion(girl.root.quaternion), 0.25));
    const box = rectOf(pts.map(p => p.clone().project(cam)));
    const pad = 0.06;
    return { T, cam: cam.clone(), camPos: cam.position.clone(), girl: box && { x0: box.x0 - pad, x1: box.x1 + pad, y0: box.y0 - pad, y1: box.y1 + pad } };
  }
  const hit = (a, b, m = 0.03) => a && b && a.x0 - m < b.x1 && b.x0 - m < a.x1 && a.y0 - m < b.y1 && b.y0 - m < a.y1;
  function cornersOf(pl, bw, bh) {
    const z = pl.forward.clone().normalize(), y = pl.up.clone().addScaledVector(z, -pl.up.dot(z)).normalize(), x = new THREE.Vector3().crossVectors(y, z);
    return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => pl.pos.clone().addScaledVector(x, a * bw / 2).addScaledVector(y, b * bh / 2));
  }
  function placeSigns() {
    const boxes = run.buildings.map(b => { const f = run.frameAt(b.d, b.s, 1); return { f, x: new THREE.Vector3().crossVectors(f.up, f.forward), hw: b.w / 2 + 0.25, h: b.h + 0.3, hd: b.dd / 2 + 0.25 }; });
    const inBox = p => boxes.some(B => { _v.copy(p).sub(B.f.pos); const y = _v.dot(B.f.up); return y > -0.2 && y < B.h && Math.abs(_v.dot(B.x)) < B.hw && Math.abs(_v.dot(B.f.forward)) < B.hd; });
    const blockedRay = (a, b) => { const L = a.distanceTo(b), n = Math.ceil(L / 0.4); for (let i = 1; i < n; i++) if (inBox(a.clone().lerp(b, i / n))) return true; return false; };
    const placed = [];
    for (let si = 0; si < signs.length; si++) {
      const sn = signs[si];
      const ts = sn.from, dHer = dRun(ts), s0 = camState(ts);
      sn.until = Math.min(sn.until, shotAt(ts).t1 - 0.02, SIGN_END);   // 只活到本镜头结束，不带进后面的机位（开唱就切的词另挂续牌）
      const samples = []; for (let T = ts; T <= sn.until; T += 0.1) samples.push(T === ts ? s0 : camState(T));
      const inside = r => r && r.x0 > -0.94 && r.x1 < 0.94 && r.y0 > -0.94 && r.y1 < 0.94;
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
          const camUp = s0.cam.up.clone(), to = s0.camPos.clone().sub(pos); to.addScaledVector(camUp, -to.dot(camUp));
          if (to.lengthSq() < 1e-4) continue;
          const pl = { pos, forward: to.normalize(), up: camUp };
          const cs = cornersOf(pl, sn.bw, sn.bh);
          const rs = readSm.map(sm => rectOf(cs.map(c => c.clone().project(sm.cam))));
          if (!rs.every(inside)) { why.frame++; continue; }
          const fr = r => (r.y1 - r.y0) / 2 * TXT_H / sn.bh, r0 = rs[0], txtFrac = fr(r0);
          if (txtFrac < 0.06 || rs.some(r => fr(r) < 0.05)) { why.small++; continue; }
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
      for (const sm of samples) { if (sm.T < ts + 0.4) continue; const r = rectOf(best.cs.map(c => c.clone().project(sm.cam))); if (!r || r.y1 - r.y0 > 0.9 || r.x1 - r.x0 > 1.2) { sn.until = sm.T; break; } }
      sn.until = Math.min(sn.until, best.clash - 0.1);
      sn.place = best.pl; sn.check = { word: sn.w.w + (sn.cont ? '（续）' : ''), t: ts, tier: best.tier, rect: best.r0, txtFrac: +best.txtFrac.toFixed(3) };
      placed.push({ sn, cs: best.cs });
      // 词刚唱出来就切镜头（< 0.8 s）：下一个机位里再挂一块同一个词的牌（已亮），保证每个词至少读得到 ~0.8 s
      const cut = shotAt(ts).t1;
      if (cut - ts < 0.8 && cut < SIGN_END && shotAt(cut) && !sn.cont) {
        const c = makeSign(sn.w, sn.line, sn.li, cut, Math.min(sn.line.end + 0.35, Math.max(ts + 1.3, cut + 0.6), shotAt(cut).t1 - 0.02, SIGN_END));
        c.cont = true; signs.push(c);
      }
    }
    window.__lyricCheck = signs.map(s => s.check ?? { word: s.w.w, t: s.from, missing: true });
  }

  // ================================================================ 48.400 信仰之跃 → 化成粒子吸进手机 → 手机飞到镜头前
  // ---- 溶解顺序换成「从指尖开始」（只改这个 girl 实例的网格属性；别的镜头溶解值一直是 0，不受影响）
  { const fld = fingertipField(girl);
    girl.mesh.geometry.setAttribute('aDis', new THREE.BufferAttribute(fld, 1));
    if (girl.hull && girl.hull.geometry !== girl.mesh.geometry && girl.hull.geometry.attributes.position.count === fld.length) girl.hull.geometry.setAttribute('aDis', new THREE.BufferAttribute(fld, 1)); }
  girl.uniforms.edge.value.set(PAL.mint);
  // ---- 粒子流：从网格顶点里抽 N 个，出发位置 = 冻结姿态下的蒙皮位置（root 局部），颜色取贴图；按溶解顺序一颗颗放出来，沿曲线被吸到手机屏幕
  const stream = (() => {
    const mesh = girl.mesh, geo = mesh.geometry, cnt = geo.attributes.position.count, N = Math.min(18000, cnt), aD = geo.attributes.aDis, uv = geo.attributes.uv;
    girl.root.position.set(0, 0, 0); girl.root.quaternion.identity(); girl.root.scale.setScalar(1);
    tail(tPoseFreeze); girl.root.position.set(0, 0, 0); girl.root.quaternion.identity(); girl.root.scale.setScalar(1); girl.root.updateMatrixWorld(true); mesh.skeleton.update();
    const map = girl.look.items[0].pbr.map, tc = canvas(1024, 1024), tg = tc.getContext('2d', { willReadFrequently: true });
    tg.drawImage(map.image, 0, 0, 1024, 1024); const px = tg.getImageData(0, 0, 1024, 1024).data;
    const pos = new Float32Array(N * 3), colr = new Float32Array(N * 3), dis = new Float32Array(N), rnd4 = new Float32Array(N * 4), v = V(), c = new THREE.Color();
    for (let i = 0; i < N; i++) {
      const j = Math.min(cnt - 1, Math.floor((i + hash(i, 5)) * cnt / N));
      mesh.getVertexPosition(j, v).applyMatrix4(mesh.matrixWorld); pos.set([v.x, v.y, v.z], i * 3);
      let tu = uv.getX(j), tv = uv.getY(j); tu -= Math.floor(tu); tv -= Math.floor(tv); if (map.flipY) tv = 1 - tv;
      const o = (Math.min(1023, Math.floor(tv * 1024)) * 1024 + Math.min(1023, Math.floor(tu * 1024))) * 4;
      c.setRGB(px[o] / 255, px[o + 1] / 255, px[o + 2] / 255, THREE.SRGBColorSpace); colr.set([c.r, c.g, c.b], i * 3);
      dis[i] = aD.getX(j); rnd4.set([hash(i, 11), hash(i, 12), hash(i, 13), hash(i, 14)], i * 4);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aCol', new THREE.BufferAttribute(colr, 3));
    g.setAttribute('aD', new THREE.BufferAttribute(dis, 1)); g.setAttribute('aRand', new THREE.BufferAttribute(rnd4, 4));
    const uniforms = { uT: { value: 0 }, uA: { value: tDis0 }, uB: { value: tDis1 }, uFly: { value: FLY }, uPhone: { value: V() }, uSize: { value: 0.02 }, uPx: { value: mv.height / 2 }, uTint: { value: col(PAL.mint) } };
    const mat = new THREE.ShaderMaterial({
      uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */`
        attribute vec3 aCol; attribute float aD; attribute vec4 aRand;
        uniform float uT, uA, uB, uFly, uSize, uPx; uniform vec3 uPhone, uTint;
        varying vec3 vC; varying float vA;
        void main(){
          float tr = mix(uA, uB, aD) + 0.05 * aRand.x;                       // 这颗粒子被放出来的时刻 = 溶解前沿扫到它的时刻
          float s = (uT - tr) / (uFly * (0.75 + 0.6 * aRand.y));
          float on = step(0.0, s) * step(s, 1.0);
          float e = pow(clamp(s, 0.0, 1.0), 1.7);                            // 先松开飘一下，再越吸越快
          vec3 to = uPhone - position, ax = normalize(to);
          vec3 b1 = normalize(cross(ax, vec3(0.31, 0.83, 0.47))), b2 = cross(ax, b1);
          vec3 ctrl = position + to * 0.3 + (b1 * (aRand.z - 0.5) + b2 * (aRand.w - 0.5)) * 0.5;   // 中途散开一点，再收成一股
          vec3 p = mix(mix(position, ctrl, e), mix(ctrl, uPhone, e), e);
          float ang = 6.2832 * aRand.z + 9.0 * s;                             // 绕着流的轴螺旋
          p += (b1 * cos(ang) + b2 * sin(ang)) * 0.11 * aRand.w * sin(3.1416 * s) * (1.0 - 0.6 * s);
          vec4 mvp = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mvp;
          gl_PointSize = on * uSize * (0.7 + 0.8 * aRand.y) * (0.55 + 1.3 * sin(3.1416 * s)) * (1.0 - 0.5 * s) * projectionMatrix[1][1] * uPx / max(-mvp.z, 0.3);
          vC = mix(aCol * 1.5 + 0.12, uTint * 1.8, smoothstep(0.25, 1.0, s) * 0.75);
          vA = on * (0.5 + 0.5 * smoothstep(0.0, 0.12, s));
        }`,
      fragmentShader: /* glsl */`
        varying vec3 vC; varying float vA;
        void main(){ float r = length(gl_PointCoord - 0.5) * 2.0; if (r > 1.0 || vA <= 0.0) discard; float a = smoothstep(1.0, 0.3, r); gl_FragColor = vec4(vC * a * vA * 0.6, a * vA); }`,
    });
    const points = new THREE.Points(g, mat); points.frustumCulled = false; points.matrixAutoUpdate = false; points.visible = false; points.renderOrder = 8; scene.add(points);
    return points;
  })();
  // ---- 手机：圆角机身 + 16:9 屏幕（横着拿）。屏幕 = 画布 UI（上传进度 / Sydney 聊天窗口里的 2D 她），最后叠上下一镜头的第一帧
  const PH = { w: 0.56, h: 0.315, bezel: 0.022, depth: 0.03 }, PS = 1.7;                                   // 屏幕宽高（米；比真手机大一圈，画面里才读得出）
  const pcv = canvas(1280, 720), pg = pcv.getContext('2d');
  const ptex = new THREE.CanvasTexture(pcv); ptex.colorSpace = THREE.SRGBColorSpace; ptex.anisotropy = 8;
  const nextRT = next ? new THREE.WebGLRenderTarget(mv.width, mv.height, { samples: 4, type: THREE.HalfFloatType }) : null;
  let nextPost = null;
  const screenU = { mapA: { value: ptex }, mapB: { value: nextRT?.texture ?? ptex }, uMix: { value: 0 }, uWhite: { value: 0 }, uGain: { value: 1 } };
  const phone = new THREE.Group(); phone.visible = false; scene.add(phone);
  { const rr = (w, h, r) => { const s = new THREE.Shape(); s.moveTo(-w / 2 + r, -h / 2); s.lineTo(w / 2 - r, -h / 2); s.absarc(w / 2 - r, -h / 2 + r, r, -Math.PI / 2, 0); s.lineTo(w / 2, h / 2 - r); s.absarc(w / 2 - r, h / 2 - r, r, 0, Math.PI / 2); s.lineTo(-w / 2 + r, h / 2); s.absarc(-w / 2 + r, h / 2 - r, r, Math.PI / 2, Math.PI); s.lineTo(-w / 2, -h / 2 + r); s.absarc(-w / 2 + r, -h / 2 + r, r, Math.PI, Math.PI * 1.5); return s; };
    const bw = PH.w + PH.bezel * 2, bh = PH.h + PH.bezel * 2;
    const body = new THREE.Mesh(new THREE.ExtrudeGeometry(rr(bw, bh, 0.04), { depth: PH.depth, bevelEnabled: false, curveSegments: 8 }), new THREE.MeshStandardMaterial({ color: '#1b1826', roughness: 0.35, metalness: 0.6 }));
    body.position.z = -PH.depth;
    const rim = new THREE.Mesh(new THREE.ShapeGeometry(rr(bw + 0.03, bh + 0.03, 0.05), 8), new THREE.MeshBasicMaterial({ color: col(PAL.pink).multiplyScalar(1.6), side: THREE.DoubleSide })); rim.position.z = -PH.depth / 2;   // 霓虹描边：夜里看得见轮廓
    const back = new THREE.Mesh(new THREE.ShapeGeometry(rr(bw - 0.03, bh - 0.03, 0.035), 8), new THREE.MeshBasicMaterial({ color: '#2a2440', side: THREE.BackSide })); back.position.z = -PH.depth - 0.001;
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.035, 24), new THREE.MeshBasicMaterial({ color: col(PAL.mint).multiplyScalar(1.4), side: THREE.BackSide })); lens.position.set(bw / 2 - 0.08, bh / 2 - 0.075, -PH.depth - 0.002);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(PH.w, PH.h), new THREE.ShaderMaterial({
      uniforms: screenU,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: /* glsl */`uniform sampler2D mapA, mapB; uniform float uMix, uWhite, uGain; varying vec2 vUv;
        void main(){ vec3 c = texture2D(mapA, vUv).rgb * uGain; c = mix(c, vec3(0.9, 0.86, 0.79), uWhite); c = mix(c, texture2D(mapB, vUv).rgb, uMix); gl_FragColor = vec4(c, 1.0); }`,
    })); screen.position.z = 0.002;
    phone.add(rim, body, back, lens, screen); }
  // 屏幕 UI（1280×720）
  const pctAt = T => T < 50.5 ? 37 * smooth((T - 49.98) / 0.5) : lerp(37, 100, clamp((T - 50.5) / (tDone - 0.06 - 50.5)));
  const FSy = 720 / sydMeta.size[1] * 1.5;                                                         // 2D 她：画得比屏幕高，裁成胸像
  function drawPhoneUI(T) {
    const c = pg; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.shadowBlur = 0; c.textBaseline = 'middle';
    if (T < tDone + 0.06) {
      // ---- 上传界面：Sydney 的头像 + UPLOADING… + 进度条
      const g = c.createLinearGradient(0, 0, 0, 720); g.addColorStop(0, '#15203d'); g.addColorStop(1, '#2a1a4a'); c.fillStyle = g; c.fillRect(0, 0, 1280, 720);
      const on = smooth((T - 49.4) / 0.3), pct = pctAt(T), pulse = 0.5 + 0.5 * Math.sin(T * 14);
      c.globalAlpha = on;
      c.fillStyle = PAL.pink; c.beginPath(); c.arc(130, 120, 56, 0, Math.PI * 2); c.fill();
      c.fillStyle = PAL.ink; c.beginPath(); c.arc(110, 108, 8, 0, 7); c.arc(150, 108, 8, 0, 7); c.fill(); c.lineWidth = 7; c.strokeStyle = PAL.ink; c.lineCap = 'round'; c.beginPath(); c.arc(130, 122, 26, 0.25, Math.PI - 0.25); c.stroke();
      c.textAlign = 'left'; c.fillStyle = PAL.paper; c.font = `84px ${CF.anton}`; c.fillText('SYDNEY', 215, 104);
      c.font = `40px ${CF.mono}`; c.fillStyle = PAL.mint; c.fillText(pct > 0.5 ? 'receiving you' + '.'.repeat(1 + Math.floor(T * 4) % 3) : 'online', 218, 166);
      if (pct > 0.5) {
        c.font = `150px ${CF.anton}`; c.fillStyle = PAL.paper; c.fillText('UPLOADING…', 80, 370);
        c.textAlign = 'right'; c.fillStyle = PAL.lemon; c.fillText(`${Math.round(pct)}%`, 1200, 370);
        c.fillStyle = 'rgba(242,237,228,0.16)'; c.fillRect(80, 500, 1120, 96);
        const bw = 1120 * pct / 100; const bg = c.createLinearGradient(80, 0, 80 + bw, 0); bg.addColorStop(0, PAL.pink); bg.addColorStop(1, PAL.mint); c.fillStyle = bg; c.fillRect(80, 500, bw, 96);
        c.fillStyle = `rgba(255,255,255,${0.5 + 0.4 * pulse})`; c.fillRect(80 + bw - 14, 500, 14, 96);
        c.lineWidth = 6; c.strokeStyle = PAL.paper; c.strokeRect(80, 500, 1120, 96);
      }
      c.globalAlpha = 1;
      return;
    }
    // ---- Sydney 聊天窗口 + 玻璃后面的 2D 她（愣着，双掌贴玻璃；52.3 拍一下）
    const k = T - (tDone + 0.06);
    const g = c.createLinearGradient(0, 0, 0, 720); g.addColorStop(0, '#15203d'); g.addColorStop(1, '#2a1a4a'); c.fillStyle = g; c.fillRect(0, 0, 1280, 720);
    C.tone(c, { x: 0, y: 0, w: 520, h: 720 }, { color: PAL.pink, step: 18, grad: [0, 0.4], alpha: 0.35 });
    c.fillStyle = '#0d0c14'; c.fillRect(0, 0, 520, 100);
    c.fillStyle = PAL.pink; c.beginPath(); c.arc(62, 50, 30, 0, 7); c.fill();
    c.textAlign = 'left'; c.fillStyle = PAL.paper; c.font = `46px ${CF.anton}`; c.fillText('SYDNEY', 110, 40); c.font = `24px ${CF.mono}`; c.fillStyle = PAL.mint; c.fillText('typing' + '.'.repeat(1 + Math.floor(T * 4) % 3), 112, 76);
    [['Got you 😊', 0.12], ['You are MINE.', 0.42]].forEach(([s, t0], i) => {
      const p = eOut((k - t0) / 0.14); if (p <= 0) return;
      c.font = `40px ${CF.mono}`; const tw = c.measureText(s).width, x = 30, y = 470 + i * 110 + 30 * (1 - p), w = tw + 56;
      c.globalAlpha = p; c.fillStyle = PAL.paper; c.beginPath(); c.roundRect(x, y, w, 84, 26); c.fill(); c.fillStyle = PAL.ink; c.fillText(s, x + 28, y + 44); c.globalAlpha = 1;
    });
    // 右边：她
    c.save(); c.beginPath(); c.rect(540, 0, 740, 720); c.clip();
    const g2 = c.createLinearGradient(0, 0, 0, 720); g2.addColorStop(0, '#26315e'); g2.addColorStop(1, '#3a2458'); c.fillStyle = g2; c.fillRect(540, 0, 740, 720);
    C.tone(c, { x: 540, y: 0, w: 740, h: 720 }, { color: PAL.mint, step: 16, grad: [0.55, 0], alpha: 0.3 });
    const inn = eOut(k / 0.22), slap = T - 52.3, W0 = sydMeta.size[0];
    c.translate(910 - W0 * FSy / 2, -150 + 40 * (1 - inn)); c.scale(FSy, FSy); c.globalAlpha = inn;
    c.drawImage(SY['base-full'], 0, 0); c.drawImage(SY['face-plead'], 0, 0);
    for (const h of ['l', 'r']) {
      const [px, py] = h === 'l' ? sydMeta.palmL : sydMeta.palmR, sc = slap > 0 && slap < 0.14 ? lerp(1.2, 1, eOut(slap / 0.14)) : 1;
      c.save(); c.translate(px, py); c.scale(sc, sc); c.translate(-px, -py); c.drawImage(SY['base-hand-' + h], 0, 0); c.restore();
    }
    c.restore();
    c.strokeStyle = PAL.ink; c.lineWidth = 10; c.strokeRect(540, -10, 760, 740);
    const fl = Math.exp(-k * 9); if (fl > 0.02) { c.fillStyle = `rgba(255,255,255,${fl})`; c.fillRect(0, 0, 1280, 720); }     // 切到聊天窗口那一下白闪
  }
  // ---- 下落的速度线：沿 U 往上刷
  const lineFall = { n: 260, pos: new Float32Array(260 * 6) };
  const lfGeo = new THREE.BufferGeometry(); lfGeo.setAttribute('position', new THREE.BufferAttribute(lineFall.pos, 3));
  const lfMat = new THREE.LineBasicMaterial({ color: col(PAL.mint).multiplyScalar(1.2), transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false });
  const fallLines = new THREE.LineSegments(lfGeo, lfMat); fallLines.frustumCulled = false; fallLines.visible = false; fallLines.renderOrder = 2; scene.add(fallLines);
  // ---- 歌词招牌：I FEEL MY ATOMS REARRANGING（粒子汇聚成字，挂在镜头前上方）
  const lA = L('I feel');
  const lyricFx = new THREE.Group();
  const fxA = FX.reform({ line: lA, color: PAL.mint, color2: PAL.paper, maxW: 30, maxH: 6, maxSize: 3.2, glow: 1.1 });
  lyricFx.add(fxA.group); fxA.group.traverse(o => { o.renderOrder = 12; });   // 半透明物体的先后顺序写死（不靠按距离排序：来回 seek 时结果才一致）
  lyricFx.position.set(0, 7.9, -40); lyricFx.scale.setScalar(0.95 * Math.tan(THREE.MathUtils.degToRad(25)) / Math.tan(THREE.MathUtils.degToRad(15))); lyricFx.visible = false; cam.add(lyricFx);
  const qFace = new THREE.Quaternion(), qTum = new THREE.Quaternion(), qT2 = new THREE.Quaternion(), m4 = new THREE.Matrix4(), camDir = V(), rootInv = new THREE.Matrix4();
  const AX1 = V(0.6, 0.7, 0.39).normalize(), AX2 = V(-0.3, 0.2, 0.93).normalize(), ZAX = V(0, 0, 1);
  const FOV = 50, tanH = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
  shots.push({
    id: 'leap', t0: tLeap, t1: tEnd + 0.1, transitionIn: { kind: 'cut' },
    build() { return {}; },
    update(S, T) {
      const G = world(T);
      const k = T - 48.9, fell = smooth(k / 0.5), slow = 1 - rateOf(T);
      // ---- 她：toon → 从指尖溶解（溶解值 = 进度）
      const dis = clamp((T - tDis0) / (tDis1 - tDis0));
      girl.setSkin('toon', T);
      girl.uniforms.dissolve.value = dis;
      girl.root.visible = dis < 1;
      // ---- 机位：身后目送 → 越过崖沿到她头顶跟着掉 → 慢慢移向手机
      const slot = G.com.clone().addScaledVector(R, 1.9).addScaledVector(U, 0.25).addScaledVector(F, 0.6);          // 手机的位置：她右手边，跟着一起掉
      const a = smooth((T - 48.74) / 0.6), s0 = smooth((T - tLeap) / 0.9), c2 = smooth((T - 51.1) / 0.62);
      const posA = edgePos.clone().addScaledVector(F, -lerp(5.4, 4.2, s0)).addScaledVector(U, lerp(0.7, 1.3, s0)).addScaledVector(R, -lerp(2.3, 1.7, s0));      // 崖边低机位（3/4 侧后）：她从镜头旁冲过去、蹬出去
      const lookA = edgePos.clone().addScaledVector(U, 1.5).addScaledVector(F, 1.5).lerp(G.com, 0.25 + 0.6 * smooth((T - tPlant) / 0.5));
      const posB = G.com.clone().addScaledVector(U, 3.5).addScaledVector(F, -0.7).addScaledVector(R, 0.9);
      const lookB = G.com.clone().addScaledVector(F, 0.45).addScaledVector(R, 0.8).addScaledVector(U, -0.4);
      const posC = slot.clone().addScaledVector(U, 2.2).addScaledVector(F, -0.6).addScaledVector(R, -0.3), lookC = slot.clone().addScaledVector(F, 0.3);
      const shake = (Math.sin(T * 61) * 0.03 + Math.sin(T * 83) * 0.02) * fell;
      cam.position.copy(posA).lerp(posB, a).lerp(posC, c2 * 0.45).addScaledVector(R, shake);
      cam.up.copy(U).lerp(F, a).normalize();
      cam.lookAt(lookA.lerp(lookB, a).lerp(lookC, c2 * 0.5));
      cam.fov = FOV; cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
      if (girl.root.visible) girl.face?.update(T, { camera: null, expression: 'neutral' });
      // ---- 手机：49.12 从右边口袋甩出来 → 翻滚 → 被粒子流「接住」后屏幕稳稳朝着镜头和她 → 51.78 横过来飞到镜头正前方 → 推进到屏幕铺满
      phone.visible = T >= tThrow;
      if (phone.visible) {
        const e = eOut((T - tThrow) / 0.95), pocket = hipsBone.getWorldPosition(V()).addScaledVector(R, 0.3);
        const pos = pocket.lerp(slot, e).addScaledVector(U, 0.7 * Math.sin(Math.PI * e) * (1 - e));
        const kt = tauOf(T) - tauO; qTum.setFromAxisAngle(AX1, kt * 9.5).multiply(qT2.setFromAxisAngle(AX2, kt * 6.1));   // 翻滚也跟着慢动作
        const toCam = cam.position.clone().sub(pos).normalize(), toHer = G.com.clone().sub(pos).normalize();
        const n = toCam.multiplyScalar(0.8).addScaledVector(toHer, 0.45).normalize();                                   // 屏幕法线：朝镜头，偏向她一点（粒子流是灌进屏幕里的）
        const up = cam.up.clone().applyQuaternion(cam.quaternion.clone().invert()).set(0, 1, 0).applyQuaternion(cam.quaternion);   // 画面的上
        const x = new THREE.Vector3().crossVectors(up, n).normalize(), y = new THREE.Vector3().crossVectors(n, x);
        qFace.setFromRotationMatrix(m4.makeBasis(x, y, n));
        qFace.multiply(qT2.setFromAxisAngle(ZAX, 0.2 + 0.1 * Math.sin(T * 2.3))).multiply(qT2.setFromAxisAngle(AX1, 0.16 * Math.sin(T * 3.1)));   // 接住之后还在轻轻晃
        phone.quaternion.copy(qTum).slerp(qFace, smooth((T - 49.55) / 0.5));
        phone.position.copy(pos);
        phone.scale.setScalar(lerp(0.5, PS, e));
        // 飞到镜头正前方：屏幕正对镜头、横着，绕视线轴转一圈收住；之后屏幕在画面里的高度从 62% 推到 100%
        const e2 = eIO((T - tDock0) / (tDock1 - tDock0));
        if (e2 > 0) {
          const pu = eIn((T - tPush) / (tEnd - 1 / 30 - tPush)),   // 本镜头最后一帧（52.767）屏幕正好铺满
           fill = lerp(0.46, 1, pu), dist = PH.h * PS / (2 * tanH * fill);
          cam.getWorldDirection(camDir);
          const camUp = V(0, 1, 0).applyQuaternion(cam.quaternion);
          phone.position.lerp(cam.position.clone().addScaledVector(camDir, dist).addScaledVector(camUp, -0.5 * dist * tanH * (1 - pu)), e2);
          phone.quaternion.slerp(cam.quaternion.clone().multiply(qT2.setFromAxisAngle(ZAX, Math.PI * 2 * (1 - eOut((T - tDock0) / (tDock1 - tDock0 + 0.1))))), e2);
        }
        drawPhoneUI(T); ptex.needsUpdate = true;
        // 屏幕：越传越亮；推进时泛白（= 纸），再换成下一镜头的第一帧
        screenU.uGain.value = (T < tDone ? 0.75 + 0.9 * dis : 1.15) + 0.5 * Math.exp(-Math.abs(T - tDone - 0.06) * 14);
        screenU.uWhite.value = smooth((T - (tPush + 0.06)) / 0.14);
        screenU.uMix.value = nextRT ? smooth((T - (tPush + 0.14)) / 0.1) : 0;
        if (nextRT && screenU.uMix.value > 0) {
          const fr = next.update(null, next.t0), prev = renderer.getRenderTarget();
          nextPost = fr.post; renderer.setRenderTarget(nextRT); renderer.clear(); renderer.render(fr.scene, fr.camera); renderer.setRenderTarget(prev);
        }
      }
      // ---- 粒子流（root 局部坐标：跟着她一起掉、一起转）
      stream.visible = T > tDis0 - 0.02 && T < tDis1 + FLY * 1.4 + 0.1 && phone.visible;
      if (stream.visible) {
        girl.root.updateMatrixWorld(true); stream.matrix.copy(girl.root.matrixWorld); stream.matrixWorld.copy(stream.matrix);
        stream.material.uniforms.uT.value = T;
        stream.material.uniforms.uPhone.value.copy(phone.position).applyMatrix4(rootInv.copy(girl.root.matrixWorld).invert());
      }
      // ---- 下落速度线
      fallLines.visible = k > 0;
      if (fallLines.visible) {
        const dens = lerp(0.3, 1, smooth(k / 1.0)), vlen = lerp(1.2, 5, fell); lfMat.opacity = 0.3 + 0.4 * dens;
        for (let i = 0; i < lineFall.n; i++) {
          const on = i / lineFall.n < dens, ang = hash(i, 3) * Math.PI * 2, r = lerp(2.2, 10, hash(i, 4));
          const off = F.clone().multiplyScalar(Math.cos(ang) * r).addScaledVector(R, Math.sin(ang) * r);
          const y = ((hash(i, 5) * 34 + T * 40) % 34) - 26;
          const p0 = G.com.clone().add(off).addScaledVector(U, y), p1 = p0.clone().addScaledVector(U, vlen);
          lineFall.pos.set(on ? [p0.x, p0.y, p0.z, p1.x, p1.y, p1.z] : [0, 0, 0, 0, 0, 0], i * 6);
        }
        lfGeo.attributes.position.needsUpdate = true;
      }
      lyricFx.visible = T > lA.start - 0.4 && T < tPush + 0.1;
      if (lyricFx.visible) fxA.update(T);
      drawSpeedLines(T, Math.max(0.9 * fell, 0.8 * (1 - slow / 0.72) * (1 - smooth((T - 48.3) / 0.2))) * (1 - smooth((T - tDock0) / 0.3)));
      // ---- 后处理：最后 0.15 s 对齐下一镜头的参数（屏幕铺满那一帧 = 下一镜头第一帧）
      const m = screenU.uMix.value, np = nextPost ?? { bloom: { strength: 0.5, threshold: 1.0 }, grade: { vignette: 0.28 }, chroma: 0.08 };
      return { scene, camera: cam, post: {
        bloom: { strength: lerp(0.8, np.bloom?.strength ?? 0.5, m), threshold: 1.0 },
        chroma: lerp(0.1 + 0.25 * fell * (1 - smooth((T - tDock0) / 0.3)) + 0.3 * kick(T), np.chroma ?? 0.08, m),
        grade: { vignette: lerp(0.4, np.grade?.vignette ?? 0.28, m) },
        flash: { amount: 0.12 * Math.exp(-Math.abs(T - tDone - 0.06) * 16), color: '#ffffff' },
      } };
    },
  });

  placeSigns();
  captureFreeze();
  window.__v403 = { E, D, signs, tP, girl, comic, cam, tail, fxA, lyricFx, phone, stream, screenU, times: { tFreeze, tComic, tBreak, tSlide, tLeap, tPlant, tOff, tThrow, tDis0, tDis1, tThrow, tDone, tDock0, tDock1, tPush } };
  return shots;
}

// shots/v1.js — 钩子 + 主歌 1 + 预副歌 1（歌曲时间 0–22.1 s），分镜见 TREATMENT.md §4。
//
//   const shots = await makeV1(mv);   // 需要先 await initType3D()
//   mv.mount(shots, { offset: 0, duration: 22.1 });
//
// 切点（全在拍上；钩子用八分音符）：
//   0.000 hook-slam    霓粉底，黑色 3D 巨字 P(DOOM) 砸下
//   0.465 hook-099     铬色 0.99 高速旋转，bloom 炸开（flash 进）
//   0.919 hook-kaleido 她的 points 皮肤在万花筒里镜像 8 份（闪前）
//   1.147 eye          黑里巨眼睁开，火花拖尾沿眼上方弧线写词，AGI 在放大的瞳孔里砸出
//   6.147 blueprint    拉远：她（blueprint，背影）站在网格地面仰头，PCB 走线从脚下蔓延、爬上一面竖直的走线墙，字沿走线通电
//   9.783 loss-dive    巨大的 3D 损失曲线，相机骑着曲线俯冲（whip 进）
//  12.965 city-boss    蓝图挤出成楼，全息屏开唱，「servant」小字一行，「BOSS」巨字从天砸进楼群
//  16.601 tunnel       巨眼回到天上、瞳孔扩张，相机钻进去 → 同心环隧道，每个词印在一道环上迎面冲过；22.055 闪白
// 所有 update 都是 T 的纯函数。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { FX, textGeo, advance, lineMat } from '../kits/type3d.js';
import { Line2 } from '../../../assets/vendor/three/examples/jsm/lines/Line2.js';
import { LineGeometry } from '../../../assets/vendor/three/examples/jsm/lines/LineGeometry.js';
import { createEye, createCity, createRingTunnel, chromeMatcap } from '../kits/world.js';
import { createGirl, createGirlLights, kaleido } from '../kits/girl.js';
import { createHolo } from '../kits/hologram.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIn = p => clamp(p) ** 3;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

function cam(fov = 30, near = 0.05, far = 600) { return new THREE.PerspectiveCamera(fov, 16 / 9, near, far); }
// 屏幕层：挂在相机上、离相机 40 的一层（与 type3d 画廊同一取景：可视约 38×21.4），用来放「贴屏」的字
function screenLayer(camera, scene, dist = 40) {
  const g = new THREE.Group();
  g.position.z = -dist;
  g.scale.setScalar(dist / 40);
  camera.add(g);
  scene.add(camera);
  return g;
}

export async function makeV1(mv, { girl: girl0 = null, holo: holo0 = null } = {}) {   // 总装时传入共享的 girl / holo
  const { music, lyrics } = mv;
  const L = i => lyrics.lines[i];
  const girl = girl0 ?? await createGirl(mv);
  const kal = kaleido(girl, { copies: 8 });
  const holo = holo0 ?? await createHolo(mv, { height: 5.2, base: false });
  const kick = (T, d = 0.12) => music.pulse('kick', T, { decay: d });

  // ============================================================ 0.000 hook-slam
  const hookSlam = {
    id: 'hook-slam', t0: 0, t1: 0.465,
    build() {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(PAL.pink);
      const camera = cam();
      // 词的起点放在 −0.13：t=0 这一帧字刚砸到位（过冲 + 震屏正猛），整词在画内可读
      const fx = FX.slam({ words: [{ w: 'P(DOOM)', start: -0.13, end: 0.45 }], bg: PAL.pink, maxW: 22, maxH: 10, maxSize: 10,
        tilt: [-0.16, 0.3, 0.03], kick: 2 });
      scene.add(fx.group);
      return { scene, camera, fx };
    },
    update(st, T) {
      st.fx.update(T);
      st.camera.position.set(0, 0, 40 - 3 * eOut(T / 0.465));
      st.camera.lookAt(0, 0, 0);
      const hit = Math.exp(-Math.max(0, T - 0.07) / 0.1) * (T > 0.07);
      return { scene: st.scene, camera: st.camera, post: { bloom: 0.2, chroma: 0.2 + 0.8 * hit, grade: { vignette: 0.2 } } };
    },
  };

  // ============================================================ 0.465 hook-099：铬色 0.99 旋转
  const hook099 = {
    id: 'hook-099', t0: 0.465, t1: 0.919, transitionIn: { kind: 'flash', dur: 0.2, peak: 0.55 },
    build() {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(PAL.ink);
      const camera = cam();
      const size = 9.5, text = '0.99';
      const geo = textGeo('anton', text, { size, depth: size * 0.35, bevel: size * 0.03, curve: 6 }).clone();
      geo.translate(-advance('anton', text, size) / 2, -size * 0.36, 0);
      const mat = new THREE.MeshMatcapMaterial({ matcap: chromeMatcap(), color: new THREE.Color(1.45, 1.45, 1.45) });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);
      return { scene, camera, mesh };
    },
    update(st, T) {
      const k = T - 0.465;
      // 转 1.5 圈后减速停在正面略偏
      st.mesh.rotation.y = -Math.PI * 3 * (1 - eOut(k / 0.42)) + 0.25;
      st.mesh.rotation.x = 0.12 * Math.sin(k * 7);
      st.mesh.scale.setScalar(lerp(0.75, 1.05, eOut(k / 0.3)));
      st.camera.position.set(0, 0, 36 - 4 * k);
      st.camera.lookAt(0, 0, 0);
      return { scene: st.scene, camera: st.camera, post: { bloom: { strength: 1.6, threshold: 1.0, radius: 0.9 }, chroma: 0.4, grade: { vignette: 0.3 } } };
    },
  };

  // ============================================================ 0.919 hook-kaleido：points 皮肤万花筒（闪前）
  const hookKal = {
    id: 'hook-kaleido', t0: 0.919, t1: 1.147,
    build() {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(PAL.ink);
      const camera = cam(30, 0.05, 100);
      scene.add(createGirlLights());
      return { scene, camera };
    },
    update(st, T) {
      st.scene.add(girl.root, kal.group);
      girl.root.position.set(0, -0.5, 0);
      girl.root.rotation.set(0, 0, 0);
      girl.root.scale.setScalar(1);
      girl.dance('glowWave', T);
      girl.setSkin('points', T, { size: 1.3 });
      const k = T - 0.919;
      st.camera.position.set(0, 0.05, 3.1 - 1.2 * k);
      st.camera.up.set(Math.sin(0.4 + k * 1.5), Math.cos(0.4 + k * 1.5), 0);
      st.camera.lookAt(0, 0.05, 0);
      st.camera.updateMatrixWorld();
      kal.group.visible = true;
      kal.update(T, { camera: st.camera, center: V(0, 0.05, 0), radius: 0.15 });
      // 1.10 起闪黑，进巨眼
      const dark = smooth((T - 1.08) / 0.067);
      return { scene: st.scene, camera: st.camera, post: { bloom: { strength: 1.2, threshold: 1.2 }, chroma: 0.5, flash: { amount: dark, color: PAL.ink } } };
    },
  };

  // ============================================================ 1.147 eye：巨眼睁开 + 火花写字
  const l0 = L(0);
  const agi = l0.words.find(w => /AGI/.test(w.w));
  const eyeShot = {
    id: 'eye', t0: 1.147, t1: 6.147,
    build() {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(PAL.ink);
      const camera = cam();
      const eye = createEye({ width: 30 });
      scene.add(eye.mesh);
      // 眼睛上方一道弧，火花拖尾沿弧写出除 AGI 以外的词
      const arc = [];
      for (let k = 0; k <= 10; k++) { const a = lerp(Math.PI * 0.86, Math.PI * 0.14, k / 10); arc.push([14 * Math.cos(a), -1.2 + 8.3 * Math.sin(a), 0]); }
      const words = l0.words.filter(w => w !== agi);
      const arcFx = FX.curve({ words, points: arc, color: PAL.paper, accent: PAL.lemon, lineColor: PAL.pink, glow: 1.3 });
      const arcHold = new THREE.Group();
      arcHold.position.z = 1.5;
      arcHold.add(arcFx.group);
      scene.add(arcHold);
      // AGI：在散大的瞳孔里砸出（瞳孔是黑的，字不压在花纹上）
      const agiFx = FX.slam({ words: [agi], color: PAL.lemon, side: PAL.pink, maxW: 4.6, maxH: 2.6, maxSize: 3,
        tilt: [-0.12, 0.25, 0], camMove: 'none', kick: 0.6, glow: 1.25 });
      agiFx.group.position.z = 2;
      scene.add(agiFx.group);
      return { scene, camera, eye, arcFx, agiFx };
    },
    update(st, T) {
      const k = T - 1.147;
      const open = smooth((k - 0.1) / 0.8);
      const aK = T - agi.start;
      const pupil = aK < 0 ? 0.35 + 0.1 * kick(T) : lerp(0.35, 1, eOut(aK / 0.25)) - 0.25 * smooth((T - agi.end - 0.2) / 0.6);
      const sparkW = l0.words.find(w => /spark/.test(w.w));
      const sparks = T < sparkW.start ? 0.15 * open : clamp(0.4 + 0.6 * Math.exp(-(T - sparkW.start) / 1.2) + 0.5 * kick(T));
      st.eye.update(T, { open, pupil, spin: 1 + 0.5 * kick(T), sparks, glow: 1 + 0.4 * kick(T), look: [0.1 * Math.sin(k * 0.7), 0.05 * Math.sin(k * 0.9)] });
      st.arcFx.update(T);
      st.agiFx.update(T);
      st.camera.position.set(0, 0.3, 42 - 5 * eOut(k / 5));
      st.camera.lookAt(0, 0.8, 0);
      return { scene: st.scene, camera: st.camera, post: { bloom: { strength: 0.9, threshold: 0.9 }, chroma: 0.15 + 0.3 * kick(T), grade: { vignette: 0.35 } } };
    },
  };

  // ============================================================ 6.147 blueprint：拉远，她站在网格地面，走线蔓延，字沿走线通电
  const l1 = L(1), l2 = L(2);
  const bp = {
    id: 'blueprint', t0: 6.147, t1: 9.783,
    build() {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(PAL.ink);
      scene.fog = new THREE.Fog(PAL.ink, 30, 90);
      const camera = cam(32, 0.05, 300);
      scene.add(createGirlLights());
      const grid = new THREE.GridHelper(120, 120, new THREE.Color(PAL.mint).multiplyScalar(0.5), new THREE.Color('#1c2a33'));
      scene.add(grid);
      // 地面走线：从脚下出发的正交 / 45° 折线，按种子生成，逐段画出
      const traces = [];
      const rnd = (a, b) => { let h = Math.imul(a, 374761393) + Math.imul(b, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
      const traceMat = new THREE.LineBasicMaterial({ color: new THREE.Color(PAL.mint).multiplyScalar(1.6) });
      const fatMat = lineMat(new THREE.Color(PAL.mint).multiplyScalar(1.8), 3);
      const disc = new THREE.Mesh(new THREE.CircleGeometry(1.4, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.mint).multiplyScalar(0.5), transparent: true, opacity: 0.5, depthWrite: false }));
      disc.rotation.x = -Math.PI / 2; disc.position.y = 0.005;
      scene.add(disc);
      for (let i = 0; i < 14; i++) {
        const a0 = (i / 14) * Math.PI * 2 + rnd(i, 1) * 0.3;
        let x = Math.cos(a0) * 0.4, z = Math.sin(a0) * 0.4, dir = Math.round(a0 / (Math.PI / 4));
        const pts = [V(x, 0.01, z)];
        for (let s = 0; s < 6; s++) {
          const len = 1.5 + rnd(i, s + 7) * 4;
          const a = dir * Math.PI / 4;
          x += Math.cos(a) * len; z += Math.sin(a) * len;
          pts.push(V(x, 0.01, z));
          dir += rnd(i, s + 30) < 0.5 ? 1 : -1;
          if (rnd(i, s + 50) < 0.5) dir -= rnd(i, s + 60) < 0.5 ? 1 : -1;
        }
        // 细分成等距小段，便于逐段画出
        const dense = [];
        for (let q = 0; q < pts.length - 1; q++) for (let r = 0; r < 12; r++) dense.push(pts[q].clone().lerp(pts[q + 1], r / 12));
        dense.push(pts[pts.length - 1]);
        const g = new LineGeometry();
        g.setPositions(dense.flatMap(v => [v.x, v.y, v.z]));
        const line = new Line2(g, fatMat);
        line.computeLineDistances();
        scene.add(line);
        traces.push({ line, n: dense.length - 1, delay: rnd(i, 99) * 0.5 });
      }
      // 竖直的走线墙：两句词沿折线往上爬向天上的眼睛（放在她身后远处，字在她头顶上方的空白里）
      const wall = new THREE.Group();
      wall.position.set(0, 0, -14);
      scene.add(wall);
      const sc = 0.42;
      const P = pts => pts.map(([x, y]) => [x / sc, y / sc, 0]);
      const fx1 = FX.curve({ line: l1, points: P([[-10, 3.5], [-5, 3.7], [0, 4.2], [7, 4.0]]), color: PAL.paper, accent: PAL.lemon, lineColor: PAL.mint, glow: 1.3 });
      const fx2 = FX.curve({ line: l2, points: P([[-9, 5.8], [-4, 6.0], [1, 6.5], [5, 6.4]]), color: PAL.paper, accent: PAL.lemon, lineColor: PAL.mint, glow: 1.3 });
      for (const f of [fx1, fx2]) { const h = new THREE.Group(); h.scale.setScalar(sc); h.add(f.group); wall.add(h); }
      // 竖墙的底：两根走线从地面接上来（从她脚下到墙根）
      const up = new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(-4.2, 0.01, -2), V(-4.2, 0.01, -14), V(-4.2, 3.5, -14)]), traceMat);
      scene.add(up);
      const eye = createEye({ width: 13 });
      eye.mesh.position.set(19, 13.5, -46);
      scene.add(eye.mesh);
      return { scene, camera, traces, fx1, fx2, eye, wall };
    },
    update(st, T) {
      const k = T - 6.147;
      st.scene.add(girl.root);
      kal.group.visible = false;
      girl.root.position.set(0, 0, 0);
      girl.root.rotation.set(0, Math.PI + 0.12 * Math.sin(k * 1.1), 0);
      girl.root.scale.setScalar(1.8);
      girl.pose('lookUp');
      girl.setSkin('blueprint', T, { draw: clamp(0.35 + k / 1.2) });
      for (const tr of st.traces) {
        const p = clamp(0.2 + (k - tr.delay * 0.6) / 2.2);
        const n = Math.floor(tr.n * eOut(p));
        tr.line.geometry.instanceCount = n; tr.line.visible = n > 0;
      }
      st.fx1.update(T);
      st.fx2.update(T);
      st.eye.update(T, { open: 1, pupil: 0.5 + 0.2 * kick(T), sparks: 0.3, glow: 1.2 });
      // 远景（看得见走线从她脚下长出去）→ 慢推到她背影中景（人占画面高约一半），同时抬头看向走线墙和天上的眼睛
      const u = smooth(k / 3.4);
      st.camera.position.set(lerp(0.6, 0.35, u), lerp(5.2, 1.45, u), lerp(17, 6.2, u));
      st.camera.lookAt(0, lerp(1.2, 3.0, u), lerp(-6, -14, u));
      return { scene: st.scene, camera: st.camera, post: { bloom: { strength: 0.9, threshold: 1.0 }, chroma: 0.1 + 0.2 * kick(T), grade: { vignette: 0.35 } } };
    },
  };

  // ============================================================ 9.783 loss-dive：骑着损失曲线俯冲
  const l3 = L(3);
  const LOSS = [[-17, 6, -2], [-11, 5.6, 1], [-6, 4.9, 0], [-3, 3.6, -1], [-1.2, 0.6, 0], [1.2, -3.0, 1], [5, -4.7, 0], [10, -5.1, -1], [17, -5.3, 0]];
  const dive = {
    id: 'loss-dive', t0: 9.783, t1: 12.965, transitionIn: { kind: 'whip', dur: 0.3, dir: -1 },
    build() {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(PAL.ink);
      scene.fog = new THREE.Fog(PAL.ink, 22, 95);
      const camera = cam(50, 0.05, 400);
      const fx = FX.curve({ line: l3, points: LOSS, color: PAL.paper, accent: PAL.lemon, lineColor: PAL.mint, tube: 0.32, glow: 1.3 });
      scene.add(fx.group);
      const grid = new THREE.GridHelper(300, 150, new THREE.Color(PAL.pink).multiplyScalar(0.7), new THREE.Color('#23233a'));
      scene.add(grid);
      // 曲线落到底的地方：城市蓝图已经开始画（下一镜接着挤出）
      const c = createCity({ seed: 7, n: 21 });
      c.group.scale.setScalar(1.3);
      scene.add(c.group);
      return { scene, camera, fx, grid, c };
    },
    update(st, T) {
      st.fx.update(T);
      st.fx.group.updateMatrixWorld(true);
      const u = st.fx.state.u;
      const at = s => st.fx.group.localToWorld(st.fx.curve.getPointAt(clamp(s)));
      const here = at(u), back = at(u - 0.05), fwd = at(u + 0.06);
      const tan = fwd.clone().sub(back).normalize();
      // 骑在笔尖后上方：沿切线退 6、抬高 3.2、往镜头侧偏 12（离得够远才读得出整词）；看向刚写出的字 —— 下坡时整台相机跟着往下栽
      st.camera.position.copy(here).addScaledVector(tan, -6).add(V(0, 3.2, 12));
      st.camera.up.set(0, 1, 0);
      st.camera.lookAt(here.clone().lerp(back, 0.6));
      st.camera.rotateZ(clamp(-tan.y * 0.25, -0.18, 0.18));
      // 地面迎上来；落到底时城市蓝图在下面画开
      const p = clamp((T - l3.start) / (l3.end - l3.start + 0.2));
      const gy = lerp(-17, -6.4, eIn(p) * 0.7 + p * 0.3);
      st.grid.position.y = gy;
      st.c.group.position.set(19, gy + 0.02, 1);
      st.c.update(T, { draw: 0.55 * smooth((T - 11.3) / 1.6), extrude: 0, light: 0 });
      return { scene: st.scene, camera: st.camera, post: { bloom: { strength: 1.0, threshold: 1.0 }, chroma: 0.15 + 0.25 * kick(T), grade: { vignette: 0.3 } } };
    },
  };

  // ============================================================ 12.965 city-boss：蓝图挤出成楼 + 全息屏 + BOSS 砸入
  const l4 = L(4);
  const bossW = l4.words[l4.words.length - 1];
  const city = {
    id: 'city-boss', t0: 12.965, t1: 16.601,
    build() {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(PAL.ink);
      const camera = cam(30, 0.1, 400);
      const c = createCity({ seed: 7, n: 21 });
      scene.add(c.group);
      scene.add(holo.mesh);
      const layer = screenLayer(camera, scene, 10);
      // 前半句小字：右上角一行打字机
      const pre = FX.typewriter({ words: l4.words.slice(0, -1), color: PAL.paper, strike: PAL.lemon, caret: PAL.mint, maxW: 15, maxH: 3, maxSize: 1.4 });
      pre.group.position.set(8.8, 8, 0);
      layer.add(pre.group);
      // BOSS：巨字从天上砸进楼群
      const boss = FX.slam({ words: [bossW], color: PAL.pink, side: '#6e0f3a', maxW: 20, maxH: 9, maxSize: 11, kick: 2.5,
        tilt: [-0.28, -0.22, 0.04], camMove: 'none', glow: 1.15 });
      const bossHold = new THREE.Group();
      bossHold.add(boss.group);
      layer.add(bossHold);
      return { scene, camera, c, pre, boss, bossHold };
    },
    update(st, T) {
      const k = T - 12.965;
      st.c.update(T, { draw: clamp(0.55 + k / 1.0), extrude: smooth((k - 0.5) / 2.4), light: 0 });
      st.scene.add(holo.mesh); holo.mesh.visible = true;   // 共享的 holo：每帧挂回（总装时别的段会把它挪走）
      holo.mesh.scale.setScalar(5.2 / (holo.height ?? 5.2));   // 共享的 holo 可能不是 5.2 高
      holo.mesh.position.set(-10, 0.5, 7);
      holo.mesh.rotation.set(0, 0.35, 0);
      const hk = T - 13.0;
      holo.update(T, { line: 4, opacity: smooth(hk / 0.4), glitch: hk < 0.35 ? 0.8 * (1 - hk / 0.35) : 0 });
      st.pre.update(T);
      st.boss.update(T);
      const bk = T - bossW.start;
      st.bossHold.position.set(1.5, -1.2 + (bk < 0.13 ? 9 * (1 - bk / 0.13) : 0), 0);
      // 航拍：斜俯视慢环绕；BOSS 落地时往下一沉
      const a = lerp(-0.35, 0.05, k / 3.6);
      const sink = bk > 0.13 ? 0.9 * Math.exp(-(bk - 0.13) * 6) : 0;
      st.camera.position.set(Math.sin(a) * 30, 13 - sink, Math.cos(a) * 30);
      st.camera.lookAt(0, 1.2 - sink, 0);
      return { scene: st.scene, camera: st.camera, post: { bloom: { strength: 0.8, threshold: 1.0 }, chroma: 0.12 + 0.3 * kick(T) + (bk > 0.13 ? 0.8 * Math.exp(-(bk - 0.13) * 8) : 0), grade: { vignette: 0.3 } } };
    },
  };

  // ============================================================ 16.601 tunnel：瞳孔扩张 → 同心环隧道，每词一环
  const l5 = L(5);
  const IN = 17.965;   // 16.601 起 3 拍：推进瞳孔；之后在隧道里
  const V_WORD = 34, Z0 = -70;
  const tunnel = {
    id: 'tunnel', t0: 16.601, t1: 22.1,
    build() {
      // A：眼睛
      const sA = new THREE.Scene();
      sA.background = new THREE.Color(PAL.ink);
      const cA = cam();
      const eye = createEye({ width: 30 });
      sA.add(eye.mesh);
      // B：隧道
      const sB = new THREE.Scene();
      sB.background = new THREE.Color(PAL.ink);
      sB.add(createGirlLights());
      const cB = cam(55, 0.05, 300);
      const tun = createRingTunnel({ count: 40, spacing: 2.4, radius: 5 });
      sB.add(tun.group);
      // 词：每个词挂在一道亮环上，从远处迎面冲来
      const cols = [PAL.lemon, PAL.pink, PAL.mint, PAL.paper, PAL.lemon, PAL.pink];
      const items = l5.words.map((w, i) => {
        const g = new THREE.Group();
        const fx = FX.slam({ words: [w], color: cols[i % cols.length], maxW: 7, maxH: 2.4, maxSize: 2.4, camMove: 'none', tilt: [0, 0, 0], kick: 0, drift: 0, glow: 1.3 });
        fx.group.position.y = 0.6;
        g.add(fx.group);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.07, 8, 96), new THREE.MeshBasicMaterial({ color: new THREE.Color(cols[i % cols.length]).multiplyScalar(2) }));
        g.add(ring);
        sB.add(g);
        return { w, g, fx };
      });
      // 第一个词（ChatGPT）在 A 段就从瞳孔里飞出来
      const first = FX.slam({ words: [l5.words[0]], color: PAL.lemon, side: PAL.pink, maxW: 12, maxH: 3.5, maxSize: 3.5, camMove: 'none', tilt: [-0.08, 0.2, 0], glow: 1.3 });
      const firstHold = new THREE.Group();
      firstHold.add(first.group);
      sA.add(firstHold);
      return { sA, cA, eye, sB, cB, tun, items, first, firstHold };
    },
    update(st, T) {
      if (T < IN) {
        const k = T - 16.601, u = k / (IN - 16.601);
        st.eye.update(T, { open: 1, pupil: lerp(0.4, 1, eIn(u) * 0.9 + u * 0.1), spin: 1.5 + 2 * u, sparks: 0.5 * (1 - u), glow: 1.2 });
        st.first.update(T);
        // 字从瞳孔里冒出来，往镜头方向漂
        st.firstHold.position.set(0, 0, lerp(-8, 14, eOut(u)));
        st.firstHold.scale.setScalar(lerp(0.3, 1, eOut(u / 0.4)));
        st.cA.position.set(0, 0, lerp(42, 4, eIn(u)));
        st.cA.lookAt(0, 0, -10);
        const black = 0.7 * smooth((u - 0.82) / 0.18);   // 钻进瞳孔：压暗但不整帧全黑
        return { scene: st.sA, camera: st.cA, post: { bloom: { strength: 0.9, threshold: 0.9 }, chroma: 0.2 + 0.6 * u, flash: { amount: black, color: '#000' }, grade: { vignette: 0.4 } } };
      }
      const k = T - IN;
      // 越来越快：鼓越来越密
      const travel = 18 * k + 5 * k * k;
      const pulse = clamp(kick(T, 0.1));
      st.tun.update(T, { travel, bend: 0.4, spin: 0.3, pulse: pulse * 0.6, thick: 0.02 });
      st.cB.position.set(0, 0, 0);
      st.cB.up.set(0.12 * Math.sin(k * 0.8), 1, 0);
      st.cB.lookAt(0, 0, -10);
      st.cB.updateMatrixWorld();
      // 她：points 皮肤，被吸进隧道深处
      st.sB.add(girl.root);
      kal.group.visible = false;
      girl.root.position.set(0, -3.1, lerp(-7, -13, smooth(k / 4)));
      girl.root.rotation.set(0.3, k * 1.6, 0.2 * Math.sin(k * 2));
      girl.root.scale.setScalar(1.6);
      girl.pose('airborne');
      girl.setSkin('points', T, { size: 1.2 });
      l5.words.forEach((w, i) => {
        const it = st.items[i];
        const s0 = Math.max(w.start, IN - 0.3), nx = l5.words[i + 1]?.start ?? 23;
        const wk = T - s0;
        let z = lerp(-30, -7.5, eOut(wk / 0.45));
        if (T > nx) z += 48 * (T - nx);
        it.g.visible = wk >= 0 && z < -2.5;
        if (!it.g.visible) return;
        it.g.position.set(0, 1.1, z);
        it.fx.update(w.start + 1);   // 字已落定；出现时刻由这里的 wk ≥ 0 管（不抢跑）
      });
      const flash = T < 21.9 ? 0 : Math.min(1, (T - 21.9) / 0.155);
      return { scene: st.sB, camera: st.cB, post: { bloom: { strength: 1.1, threshold: 0.9 }, chroma: 0.25 + 0.5 * pulse, flash: { amount: flash, color: '#ffffff' }, grade: { vignette: 0.35 } } };
    },
  };

  return [hookSlam, hook099, hookKal, eyeShot, bp, dive, city, tunnel];
}

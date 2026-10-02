// shots/v3.js — 主歌 3 + 预副歌 3（歌曲时间 74.8–94.8 s），分镜照 TREATMENT.md §4「主歌 3」「预副歌 3」。
//
//   import { makeV3 } from './shots/v3.js';
//   const { shots, cuts } = makeV3(mv, { girl });
//   mv.mount(shots, { offset: 74.8, duration: 20.0 });
//
// 切点规则同 c1：一句唱完 = 人声能量最后一次 > 0.3 的时刻；切点 = 唱完 + 0.3 s 之后的第一个拍。
// 每镜她都有机位 / 景别变化（按小节换或推），字放在屏幕层（相机前 overlay，type3d 的 fov30 / z=40 取景），先给人留位。

import * as THREE from 'three';
import { FX, PAL, textGeo } from '../kits/type3d.js';
import { createGirlLights, kaleido } from '../kits/girl.js';
import { mulberry32 } from '../kits/world.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIn = p => clamp(p) ** 3;
const eInOut = p => { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2; };
const spring = k => (k < 0 ? 0 : Math.exp(-k * 9) * Math.cos(k * 30));
const col = c => new THREE.Color(c);
const glow = (c, k) => new THREE.Color(c).multiplyScalar(k);

// ---------------------------------------------------------------- 时间
function lineOf(mv, prefix) {
  const l = mv.lyrics.lines.find(x => x.text.toLowerCase().startsWith(prefix.toLowerCase()));
  if (!l) throw new Error(`v3：找不到歌词「${prefix}」`);
  return l;
}
function vocalEnd(mv, line, thr = 0.3) {
  const A = mv.audio, fps = A.fps, v = A.vocal;
  for (let i = Math.floor(line.end * fps); i >= Math.ceil(line.start * fps); i--) if (v[i] > thr) return (i + 1) / fps;
  return line.end;
}
const beatAfter = (mv, t) => mv.audio.beats.find(b => b >= t - 1e-3);

export function cuts(mv) {
  const L = {
    mlp: lineOf(mv, 'Forward MLP'), vn: lineOf(mv, 'Now von Neumann'), turn: lineOf(mv, 'Sharp left turn'),
    cdr: lineOf(mv, 'Without a single'), gato: lineOf(mv, 'Gato'),
  };
  const after = l => beatAfter(mv, Math.min(vocalEnd(mv, l), l.end) + 0.3);
  const c = { start: 74.8, end: 94.8 };
  c.vn = after(L.mlp);
  c.turn = after(L.vn);
  c.cdr = after(L.turn);
  c.gato = after(L.cdr);
  return { c, L };
}

// ---------------------------------------------------------------- 小工具（同 c1）
function persp(fov = 35) { return new THREE.PerspectiveCamera(fov, 16 / 9, 0.05, 500); }
function scn(bg = PAL.ink) { const s = new THREE.Scene(); s.background = col(bg); return s; }
function overlay(scene, camera, d = 0.5) {
  const g = new THREE.Group();
  g.position.z = -d;
  g.scale.setScalar((2 * d * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / 21.44);
  camera.add(g); scene.add(camera);
  return g;
}
function word3d(text, { size = 1, depth = 0.3, material, font = 'anton' }) {
  const g = textGeo(font, text, { size, depth, bevel: size * 0.02, curve: 5 });
  g.computeBoundingBox();
  const b = g.boundingBox;
  g.translate(-(b.max.x + b.min.x) / 2, -(b.max.y + b.min.y) / 2, -(b.max.z + b.min.z) / 2);
  const m = new THREE.Mesh(g, material);
  m.userData.w = b.max.x - b.min.x; m.userData.h = b.max.y - b.min.y;
  return m;
}
function floorGrid(scene, { color = '#0c0c12', grid = PAL.mint, opacity = 0.12, size = 60 } = {}) {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.6 }));
  floor.rotation.x = -Math.PI / 2; scene.add(floor);
  const g = new THREE.GridHelper(size, size * 2, grid, grid);
  g.material.transparent = true; g.material.opacity = opacity; g.position.y = 0.002; scene.add(g);
  return floor;
}
function capsuleGirl() {
  const root = new THREE.Group();
  const m = new THREE.MeshStandardMaterial({ color: '#8a8a94', roughness: 0.6 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.5, 6, 16), m); body.position.y = 0.4;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 14), m); head.position.y = 0.87;
  root.add(body, head);
  return { root, placeholder: true, dance() {}, pose() {}, setSkin() {}, beatOf: () => 0 };
}

// ================================================================ 镜头
export function makeV3(mv, { girl: realGirl = null } = {}) {
  const { c, L } = cuts(mv);
  const girl = realGirl ?? capsuleGirl();
  const M = mv.music, A = mv.audio;
  const period = A.beat_period;
  const beatsIn = (a, b) => A.beats.filter(x => x >= a - 1e-3 && x < b - 1e-3);
  const downsIn = (a, b) => A.downbeats.filter(x => x >= a - 1e-3 && x < b - 1e-3);
  const putGirl = (scene, T, { x = 0, y = 0, z = 0, yaw = 0, skin = 'toon', pose = null, moves = null } = {}) => {
    scene.add(girl.root);
    girl.root.position.set(x, y, z); girl.root.rotation.set(0, yaw, 0); girl.root.scale.setScalar(1);
    if (pose) girl.pose(pose); else girl.dance(moves, T);
    girl.setSkin(skin, T);
  };
  const b0 = Math.round(girl.beatOf(A.downbeats.find(d => d >= c.start - 0.05)));
  const shots = [];

  // ---- 1. Forward MLP, backward, repeat：神经网络层图，脉冲前传 / 反传三遍，她跟着前进 / 后退 ----------
  // 一个循环 = 2 拍（1 拍前传、1 拍反传），从 74.779 小节头起三遍。
  const T0 = A.downbeats.find(d => d >= c.start - 0.05);
  const cycleOf = T => { const u = (T - T0) / (2 * period); const f = u - Math.floor(u); return { n: Math.floor(u), fwd: f < 0.5, p: f < 0.5 ? f * 2 : (f - 0.5) * 2 }; };
  const mlpMoves = [{ beat: b0, move: 'step' }];
  shots.push({
    id: 'v3-01-mlp', t0: c.start, t1: c.vn, transitionIn: { kind: 'cut' },
    build() {
      const scene = scn(PAL.ink), camera = persp(38);
      scene.add(createGirlLights());
      scene.fog = new THREE.Fog(PAL.ink, 8, 22);
      floorGrid(scene);
      // 网络：6 层竖排在她身后（x 方向从左到右 = 前传方向）
      const rnd = mulberry32(31);
      const sizes = [4, 7, 8, 8, 7, 3];
      const net = new THREE.Group(); net.position.set(0, 0, -2.2); scene.add(net);
      const nodes = [];
      sizes.forEach((n, li) => {
        const x = (li - (sizes.length - 1) / 2) * 1.35;
        for (let j = 0; j < n; j++) nodes.push({ li, x, y: 1.35 + (j - (n - 1) / 2) * 0.36, z: (rnd() - 0.5) * 0.3 });
      });
      const nodeGeo = new THREE.SphereGeometry(0.07, 16, 12);
      const nodeMesh = new THREE.InstancedMesh(nodeGeo, new THREE.MeshBasicMaterial({ toneMapped: false }), nodes.length);
      const m4 = new THREE.Matrix4();
      nodes.forEach((nd, i) => { m4.makeTranslation(nd.x, nd.y, nd.z); nodeMesh.setMatrixAt(i, m4); nodeMesh.setColorAt(i, col('#333344')); });
      net.add(nodeMesh);
      const edges = [];
      for (let i = 0; i < nodes.length; i++) for (let j = 0; j < nodes.length; j++) if (nodes[j].li === nodes[i].li + 1) edges.push([i, j]);
      const eGeo = new THREE.BufferGeometry();
      const ePos = new Float32Array(edges.length * 6), eCol = new Float32Array(edges.length * 6);
      edges.forEach(([a, b], k) => ePos.set([nodes[a].x, nodes[a].y, nodes[a].z, nodes[b].x, nodes[b].y, nodes[b].z], k * 6));
      eGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3));
      eGeo.setAttribute('color', new THREE.BufferAttribute(eCol, 3));
      net.add(new THREE.LineSegments(eGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })));
      // 脉冲：每条边上一个亮点
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(edges.length * 3);
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({ size: 0.09, color: glow(PAL.mint, 3), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
      const pulses = new THREE.Points(pGeo, pMat); pulses.frustumCulled = false; net.add(pulses);
      // 字：一排大字在上方，随她的步子左右滑（前传 → 右，反传 → 左）
      const ov = overlay(scene, camera);
      const row = new THREE.Group(); row.position.y = 7.6; ov.add(row);
      const wmats = [PAL.paper, PAL.mint, PAL.pink, PAL.lemon];
      const ws = L.mlp.words.map((w, i) => {
        const m = word3d(w.w.replace(/,/g, '').toUpperCase(), { size: 1.45, depth: 0.35, material: new THREE.MeshBasicMaterial({ color: glow(wmats[i], i ? 1.1 : 0.9), toneMapped: false }) });
        row.add(m); return { m, w };
      });
      let x = 0; const gap = 0.9;
      const total = ws.reduce((a, o) => a + o.m.userData.w, 0) + gap * (ws.length - 1);
      ws.forEach(o => { o.x = -total / 2 + x + o.m.userData.w / 2; x += o.m.userData.w + gap; });
      return { scene, camera, nodes, nodeMesh, edges, eGeo, eCol, pGeo, pPos, pMat, ws, row, net };
    },
    update(S, T) {
      const cy = cycleOf(T);
      const front = cy.fwd ? cy.p * 5 : (1 - cy.p) * 5;     // 波前在第几层（0..5）
      const hot = cy.fwd ? col(PAL.mint) : col(PAL.pink);
      // 节点：波前经过时亮
      S.nodes.forEach((nd, i) => {
        const d = Math.abs(nd.li - front);
        const k = Math.exp(-d * d * 2.5);
        S.nodeMesh.setColorAt(i, new THREE.Color(0.2, 0.2, 0.26).lerp(hot, k).multiplyScalar(1 + 2.5 * k));
      });
      S.nodeMesh.instanceColor.needsUpdate = true;
      // 边 + 脉冲点
      S.edges.forEach(([a, b], k) => {
        const na = S.nodes[a], nb = S.nodes[b];
        const s = clamp(front - na.li);                        // 本边上波前的位置 0..1
        const on = front >= na.li && front <= nb.li + 0.001 ? 1 : 0;
        const base = 0.06, lit = on ? 0.9 : 0;
        const c0 = hot.clone().multiplyScalar(base + lit * (cy.fwd ? 1 - s : s));
        const c1 = hot.clone().multiplyScalar(base + lit * (cy.fwd ? s : 1 - s));
        S.eCol.set([c0.r, c0.g, c0.b, c1.r, c1.g, c1.b], k * 6);
        const u = on ? s : (front < na.li ? 0 : 1);
        S.pPos.set([lerp(na.x, nb.x, u), lerp(na.y, nb.y, u), lerp(na.z, nb.z, u) + (on ? 0 : 999)], k * 3);
      });
      S.eGeo.attributes.color.needsUpdate = true; S.pGeo.attributes.position.needsUpdate = true;
      S.pMat.color.copy(hot).multiplyScalar(3);
      // 她：前传一拍向右迈、反传一拍退回；整体在网前
      const step = cy.fwd ? eInOut(cy.p) : 1 - eInOut(cy.p);
      const gx = -1.6 + cy.n * 0.0 + step * 0.9;
      putGirl(S.scene, T, { x: gx, z: 0.2, yaw: cy.fwd ? 0.5 : -0.3, moves: mlpMoves });
      // 字
      S.ws.forEach(o => {
        const k = T - o.w.start;
        o.m.visible = k >= 0;
        const dir = /back/i.test(o.w.w) ? 1 : -1;               // backward 从右滑进，其余从左
        o.m.position.x = o.x + dir * 6 * (1 - eOut(k / 0.25));
        o.m.scale.setScalar(k >= 0 ? 1 + 0.12 * spring(k - 0.1) : 1);
      });
      S.row.position.x = (step - 0.5) * 1.6;
      // 机位：第一小节侧面低机位全景跟她走，第二小节起 3/4 中景、按拍往里推
      const cam = S.camera, bar2 = T0 + 4 * period;
      if (T < bar2) {
        const k = (T - c.start) / (bar2 - c.start);
        cam.position.set(gx * 0.4 + 0.3, 0.35, 4.6 - k * 0.5); cam.lookAt(gx * 0.3, 1.05, -1);
      } else {
        const bp = M.beatAt(T), n = Math.floor((T - bar2) / period);
        const d = 2.6 - n * 0.18 - eOut(bp.phase * 3) * 0.08;
        cam.position.set(gx + 1.5, 0.75, d); cam.lookAt(gx + 0.2, 0.75, -0.6);
      }
      return { scene: S.scene, camera: cam, post: { bloom: { strength: 0.8, threshold: 0.85 }, grade: { vignette: 0.3 } } };
    },
  });

  // ---- 2. Now von Neumann's obsolete：几何体搭的柜式计算机 → 线框 → 散架，OBSOLETE 印章 ----------
  shots.push({
    id: 'v3-02-vonneumann', t0: c.vn, t1: c.turn, transitionIn: { kind: 'cut' },
    build() {
      const scene = scn('#0e0d12'), camera = persp(36);
      scene.add(createGirlLights({ key: 2.2 }));
      scene.add(new THREE.HemisphereLight('#fff6e8', '#221f2a', 1.2));
      const dl = new THREE.DirectionalLight('#fff0e0', 2.2); dl.position.set(2, 4, 3); scene.add(dl);
      floorGrid(scene, { opacity: 0.08 });
      // 计算机：三台柜子 + 磁带盘 + 指示灯 + 控制台
      const rnd = mulberry32(77);
      const parts = [];
      const metal = new THREE.MeshStandardMaterial({ color: '#b9b2a4', roughness: 0.55, metalness: 0.3 });
      const dark = new THREE.MeshStandardMaterial({ color: '#2a2830', roughness: 0.7 });
      const add = (geo, mat, x, y, z, ry = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.y = ry; comp.add(m); parts.push({ m, p0: m.position.clone(), r0: m.rotation.clone(), v: new THREE.Vector3((rnd() - 0.5) * 2.4, rnd() * 2.2 + 0.6, (rnd() - 0.2) * 1.6), w: new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(6), delay: rnd() * 0.35 }); return m; };
      const comp = new THREE.Group(); comp.position.set(-0.9, 0, -1.2); scene.add(comp);
      const lights = [];
      for (let k = 0; k < 3; k++) {
        const x = (k - 1) * 0.95;
        add(new THREE.BoxGeometry(0.88, 1.9, 0.6), metal, x, 0.95, 0);
        add(new THREE.BoxGeometry(0.7, 0.55, 0.02), dark, x, 1.45, 0.31);
        for (const dx of [-0.17, 0.17]) {
          const reel = add(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 28), dark, x + dx, 1.45, 0.34);
          reel.rotation.x = Math.PI / 2; parts[parts.length - 1].r0 = reel.rotation.clone(); reel.userData.reel = true;
        }
        for (let r = 0; r < 4; r++) for (let q = 0; q < 6; q++) {
          const m = add(new THREE.BoxGeometry(0.06, 0.04, 0.02), new THREE.MeshBasicMaterial({ color: '#331', toneMapped: false }), x - 0.3 + q * 0.12, 0.95 - r * 0.1, 0.31);
          lights.push({ m, h: rnd(), c: [PAL.lemon, PAL.pink, PAL.mint][Math.floor(rnd() * 3)] });
        }
        add(new THREE.BoxGeometry(0.7, 0.35, 0.02), dark, x, 0.35, 0.31);
      }
      add(new THREE.BoxGeometry(2.9, 0.08, 0.7), metal, 0, 0.78, 0.75);
      add(new THREE.BoxGeometry(2.9, 0.7, 0.08), metal, 0, 0.42, 1.06);
      // 线框版：同样的几何，薄荷线
      const wire = new THREE.Group(); comp.add(wire);
      parts.forEach(pt => {
        const e = new THREE.LineSegments(new THREE.EdgesGeometry(pt.m.geometry), new THREE.LineBasicMaterial({ color: glow(PAL.mint, 2), transparent: true, toneMapped: false }));
        pt.m.add(e); pt.edge = e;
      });
      const ov = overlay(scene, camera);
      const st = FX.stamp({ line: L.vn, bg: '#0e0d12', smallColor: PAL.paper, color: PAL.pink });
      const stHold = new THREE.Group(); stHold.position.set(-5.2, 1.4, 0); stHold.scale.setScalar(0.62); stHold.add(st.group); ov.add(stHold);   // stamp 每帧自己改 group.position（震屏），所以挪外壳   // 盖在左边的机器上，她在右侧，不压人
      return { scene, camera, comp, parts, lights, st };
    },
    update(S, T) {
      const ob = L.vn.words[3];
      const tWire = ob.start - 0.35, tFall = ob.start + 0.25;       // 印章前变线框，盖章后散架
      const kw = smooth((T - tWire) / 0.3);
      const kf = T - tFall;
      S.parts.forEach(pt => {
        const m = pt.m;
        m.material.transparent = true; m.material.opacity = 1 - kw * 0.92; m.material.depthWrite = kw < 0.5;
        pt.edge.material.opacity = kw;
        const t = Math.max(0, kf - pt.delay);
        m.position.set(pt.p0.x + pt.v.x * t, Math.max(0.04, pt.p0.y + pt.v.y * t - 4.9 * t * t), pt.p0.z + pt.v.z * t);
        m.rotation.set(pt.r0.x + pt.w.x * t, pt.r0.y + pt.w.y * t, pt.r0.z + pt.w.z * t);
        if (m.userData.reel && t === 0) m.rotation.y = pt.r0.y + T * 3;
      });
      // 指示灯按拍闪
      const bi = M.beatAt(T).i;
      S.lights.forEach((l, i) => l.m.material.color.copy(((Math.floor(l.h * 7) + bi) % 3 === 0 && kf < 0) ? glow(l.c, 2.5) : col('#2a2620')));
      S.st.update(T);
      // 她站在机器右边看它；机位：第一小节从右侧中景慢慢横移，第二小节起高一点、推近机器（散架时抖）
      putGirl(S.scene, T, { x: 1.0, z: -0.1, yaw: -0.9, pose: 'lookUp' });
      const cam = S.camera, d2 = A.downbeats.find(d => d > c.vn + 0.5);
      const hit = kf > 0 ? Math.exp(-kf * 5) : 0;
      if (T < d2) {
        const k = (T - c.vn) / (d2 - c.vn);
        cam.position.set(1.6 - k * 0.4, 1.0, 3.9); cam.lookAt(-0.1, 0.95, -0.9);   // 她在画面右侧，左半边留给机器和印章
      } else {
        const k = (T - d2) / (c.turn - d2);
        cam.position.set(0.9 - k * 0.8 + Math.sin(T * 60) * hit * 0.03, 1.6 - k * 0.3, 3.2 - k * 0.5); cam.lookAt(-0.3, 0.8, -1.1);
      }
      return { scene: S.scene, camera: cam, post: { bloom: { strength: 0.6, threshold: 0.9 }, grade: { vignette: 0.35, warmth: 0.15 }, chroma: hit * 0.4 } };
    },
  });

  // ---- 3. Sharp left turn and there you are：甩镜向左 90° 落进万花筒多面体，她的镜像 -------------------
  shots.push({
    id: 'v3-03-kaleido', t0: c.turn, t1: c.cdr, transitionIn: { kind: 'whip', dur: 0.32, dir: -1 },
    build() {
      const scene = scn('#07060c'), camera = persp(40);
      scene.add(createGirlLights({ rim: 3.4 }));
      const k = realGirl ? kaleido(girl, { copies: 8, center: 'chest' }) : null;
      if (k) scene.add(k.group);
      // 多面体：她在二十面体内部，边是金色光环线，面是暗镜
      const ico = new THREE.IcosahedronGeometry(4.2, 1);
      const shell = new THREE.Mesh(ico, new THREE.MeshBasicMaterial({ color: '#0d0b14', side: THREE.BackSide }));
      shell.position.y = 0.6; scene.add(shell);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(ico), new THREE.LineBasicMaterial({ color: glow(PAL.lemon, 1.8), toneMapped: false, transparent: true, opacity: 0.7 }));
      edges.position.copy(shell.position); scene.add(edges);
      // 光环：她身后的两道细环
      const halo = new THREE.Group(); scene.add(halo);
      [1.05, 1.2].forEach((r, i) => { const m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.008, 8, 128), new THREE.MeshBasicMaterial({ color: glow(i ? PAL.pink : PAL.lemon, 2.2), toneMapped: false })); halo.add(m); });
      halo.position.set(0, 0.62, -0.4);
      // 路牌：黄底黑字 + 左箭头，从右边甩进画面
      const ov = overlay(scene, camera);
      const sign = new THREE.Group(); ov.add(sign);
      const board = new THREE.Mesh(new THREE.BoxGeometry(15, 7, 0.25), new THREE.MeshBasicMaterial({ color: glow(PAL.lemon, 1.1), toneMapped: false }));
      sign.add(board);
      const border = new THREE.Mesh(new THREE.BoxGeometry(8.7, 2.9, 0.26), new THREE.MeshBasicMaterial({ color: PAL.ink, wireframe: false }));
      border.scale.set(1, 1, 1); border.visible = false;
      const arrowShape = new THREE.Shape([[-1.4, 0], [-0.4, 0.9], [-0.4, 0.35], [1.2, 0.35], [1.2, -0.35], [-0.4, -0.35], [-0.4, -0.9]].map(([x, y]) => new THREE.Vector2(x, y)));
      const arrow = new THREE.Mesh(new THREE.ExtrudeGeometry(arrowShape, { depth: 0.1, bevelEnabled: false }), new THREE.MeshBasicMaterial({ color: PAL.ink }));
      arrow.position.set(-5.4, 0, 0.14); arrow.scale.setScalar(1.35); sign.add(arrow);
      const tw = FX.typewriter({ line: L.turn, color: PAL.ink, caret: PAL.pink, maxW: 10.4, maxH: 6.0, maxSize: 1.9, upper: true, font: 'mono' });   // 字高 ≥ 画高 5%
      tw.group.position.set(1.6, 0, 0.2); sign.add(tw.group);
      sign.position.set(10.3, 5.3, 0);
      return { scene, camera, k, halo, edges, sign, tw };
    },
    update(S, T) {
      const kk = T - c.turn, dur = c.cdr - c.turn;
      putGirl(S.scene, T, { x: 0, z: 0, yaw: 0, moves: [{ beat: b0, move: 'glowWave' }, { beat: b0 + 32, move: 'hairFlip' }] });
      // 机位：甩进来时带着 90° 左转的余势（yaw 从 +0.6 收到 0），之后每小节换：正面中景 → 仰拍 → 慢滚
      const cam = S.camera, bars = downsIn(c.turn, c.cdr);
      const settle = eOut(kk / 0.6);
      const n = bars.filter(d => d <= T).length;                 // 进了第几个小节头
      const yaw = (1 - settle) * 0.6;
      const dist = [3.6, 2.9, 3.3][Math.min(n, 2)] - (T - (bars[n - 1] ?? c.turn)) * 0.15;
      const h = [0.75, 0.25, 0.9][Math.min(n, 2)];
      cam.position.set(Math.sin(yaw) * dist, h, Math.cos(yaw) * dist);
      cam.lookAt(0.55, n === 1 ? 0.85 : 0.65, 0);   // 花偏左，右上留给路牌
      cam.rotateZ(kk * 0.22);                                    // 万花筒整体慢转 = 相机滚转
      if (S.k) S.k.update(T, { camera: cam, radius: 0.08 + 0.06 * Math.sin(kk * 1.3) });
      S.halo.rotation.z = kk * 0.6;
      S.edges.rotation.y = kk * 0.08;
      S.tw.update(T);
      S.sign.position.x = lerp(32, 10.3, eOut((kk - 0.1) / 0.35));
      S.sign.rotation.z = 0.35 * spring(kk - 0.3) - 0.04;
      return { scene: S.scene, camera: cam, post: { bloom: { strength: 0.8, threshold: 0.85 }, grade: { vignette: 0.35 } } };
    },
  });

  // ---- 4. Without a single CDR：几百把空椅子的大厅 + 一列空白勾选框，打字机 ------------------------
  shots.push({
    id: 'v3-04-cdr', t0: c.cdr, t1: c.gato, transitionIn: { kind: 'cut' },
    build() {
      const scene = scn('#08080d'), camera = persp(40);
      scene.add(createGirlLights({ key: 1.8 }));
      scene.add(new THREE.HemisphereLight('#c8d8ff', '#15121c', 0.5));
      const top = new THREE.SpotLight('#fff2dd', 30, 30, 0.35, 0.6); top.position.set(0, 12, 2); top.target.position.set(0, 0, 0); scene.add(top, top.target);
      scene.fog = new THREE.Fog('#08080d', 6, 30);
      floorGrid(scene, { color: '#101016', opacity: 0.05 });
      // 椅子：座 + 靠背 + 四腿，合成一个几何，InstancedMesh 铺 22 × 14 排，中间留一条过道
      const parts = [];
      const box = (w, h, d, x, y, z) => new THREE.BoxGeometry(w, h, d).translate(x, y, z);
      parts.push(box(0.42, 0.04, 0.4, 0, 0.42, 0), box(0.42, 0.42, 0.04, 0, 0.65, -0.18));
      for (const [x, z] of [[-0.18, -0.17], [0.18, -0.17], [-0.18, 0.17], [0.18, 0.17]]) parts.push(box(0.035, 0.42, 0.035, x, 0.21, z));
      const chairGeo = mergeBoxes(parts);
      const cols = 22, rows = 14;
      const chairs = new THREE.InstancedMesh(chairGeo, new THREE.MeshStandardMaterial({ color: '#8b2a52', roughness: 0.6 }), cols * rows);
      const m4 = new THREE.Matrix4(); let k = 0;
      for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
        const x = (q - (cols - 1) / 2) * 0.62 + (q >= cols / 2 ? 0.7 : -0.7), z = -r * 0.7 - 0.6;
        m4.makeTranslation(x, 0, z); chairs.setMatrixAt(k++, m4);
      }
      scene.add(chairs);
      // 讲台前的空地上：她
      const ov = overlay(scene, camera);
      const tw = FX.typewriter({ line: L.cdr, color: PAL.paper, caret: PAL.mint, maxW: 16, maxH: 2.4, maxSize: 2.0, upper: true, font: 'mono' });
      tw.group.position.set(5.2, 8.4, 0); ov.add(tw.group);   // 右上方、勾选框那列上面：低机位时她在画面左侧，字不碰她
      // 勾选框：一列 5 个空框，按拍一个个出现，全是空的
      const boxes = [];
      const lm = new THREE.MeshBasicMaterial({ color: glow(PAL.mint, 1.6), toneMapped: false });
      for (let i = 0; i < 5; i++) {
        const g = new THREE.Group();
        const s = 1.2, w = 0.12;
        for (const [x, y, bw, bh] of [[0, s / 2, s, w], [0, -s / 2, s, w], [-s / 2, 0, w, s], [s / 2, 0, w, s]]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(bw, bh), lm); m.position.set(x, y, 0); g.add(m); }
        const label = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.14), new THREE.MeshBasicMaterial({ color: '#555566' }));
        label.position.set(2.4, 0, 0); g.add(label);
        g.position.set(12.2, 4.2 - i * 2.1, 0); ov.add(g); boxes.push(g);
      }
      return { scene, camera, tw, boxes };
    },
    update(S, T) {
      const kk = T - c.cdr;
      putGirl(S.scene, T, { x: 0, z: 0.9, yaw: 0, pose: 'idle' });
      S.tw.update(T);
      const bs = beatsIn(c.cdr, c.gato);
      S.boxes.forEach((g, i) => { const t0 = bs[i + 1] ?? 1e9; const k = T - t0; g.visible = k >= 0; g.scale.setScalar(k >= 0 ? eOut(k / 0.15) : 0.01); });
      // 机位：第一小节高机位俯拍大厅（她在空椅子前很小），第二小节起摇臂降到低机位中景
      const cam = S.camera, d2 = A.downbeats.find(d => d > c.cdr + 0.5);
      if (T < d2) {
        const k = (T - c.cdr) / (d2 - c.cdr);
        cam.position.set(-1.2 + k * 0.6, 5.2 - k * 0.8, 5.2 - k * 0.4); cam.lookAt(0, 0.2, -3);
      } else {
        const k = eInOut((T - d2) / (c.gato - d2));
        cam.position.set(lerp(-0.6, 0.9, k), lerp(1.6, 0.45, k), lerp(3.8, 2.3, k)); cam.lookAt(0, lerp(0.6, 0.8, k), -1.5);
      }
      return { scene: S.scene, camera: cam, post: { bloom: { strength: 0.5, threshold: 0.9 }, grade: { vignette: 0.45, saturation: 0.85 } } };
    },
  });

  // ---- 5. Gato, please don't let me go：地面一拍掉一圈，她站在最后一根柱子上抓着发光的 GATO，最后松手坠落 --
  shots.push({
    id: 'v3-05-gato', t0: c.gato, t1: c.end + 0.5, transitionIn: { kind: 'cut' },
    build() {
      const scene = scn('#06060a'), camera = persp(40);
      scene.add(createGirlLights({ rim: 3.6 }));
      scene.fog = new THREE.Fog('#06060a', 5, 26);
      // 柱子地面：13 × 13，每根高 6，顶面薄荷描边；她站在正中那根上
      const n = 13, s = 0.5;
      const geo = new THREE.BoxGeometry(s * 0.96, 6, s * 0.96).translate(0, -3, 0);
      const pil = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: '#1b1b26', roughness: 0.5, metalness: 0.4, emissive: glow(PAL.mint, 0.05) }), n * n);
      pil.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      const cells = [];
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const x = (i - (n - 1) / 2) * s, z = (j - (n - 1) / 2) * s;
        cells.push({ x, z, r: Math.max(Math.abs(i - (n - 1) / 2), Math.abs(j - (n - 1) / 2)) });
      }
      scene.add(pil);
      const tops = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: glow(PAL.mint, 1.4), toneMapped: false, transparent: true, opacity: 0.6 }));
      scene.add(tops);
      // GATO：悬在她头顶的发光字，两根线吊着
      const gato = new THREE.Group(); scene.add(gato);
      const word = word3d('GATO', { size: 0.3, depth: 0.08, material: new THREE.MeshBasicMaterial({ color: glow(PAL.pink, 1.2), toneMapped: false }) });   // 粉：和 c3 开头接住的 GATO 同色
      gato.add(word);
      const strings = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.3, 0.2, 0), new THREE.Vector3(-0.3, 6, 0), new THREE.Vector3(0.3, 0.2, 0), new THREE.Vector3(0.3, 6, 0)]), new THREE.LineBasicMaterial({ color: glow(PAL.pink, 0.8), toneMapped: false }));
      gato.add(strings);
      // 其余几个词：左下角一行打字机小字（不抢 GATO 的焦点）
      const ov = overlay(scene, camera);
      const rest = FX.typewriter({ words: L.gato.words.slice(1), color: PAL.pink, caret: PAL.lemon, maxW: 9, maxH: 5.5, maxSize: 2.1, upper: true, font: 'mono' });   // 字高 ≥ 画高 5%，放在她右侧空白处
      rest.group.position.set(9.2, 0.5, 0); ov.add(rest.group);
      return { scene, camera, pil, cells, tops, gato, word, rest, n, s };
    },
    update(S, T) {
      const kk = T - c.gato;
      // 一拍掉一圈（由外向内），最后只剩中间一根
      const bs = beatsIn(c.gato, c.end);
      const maxR = (S.n - 1) / 2;
      const dropAt = r => bs[Math.min(bs.length - 1, (maxR - r) + 1)];   // 外圈先掉，一拍一圈，第 7 拍只剩她脚下那根
      const m4 = new THREE.Matrix4(), tp = [];
      let letGo = L.gato.words.at(-1).start;                     // 唱「go」时松手
      S.cells.forEach((cl, i) => {
        let y = 0;
        if (cl.r > 0) { const t0 = dropAt(cl.r) + (Math.abs(cl.x) + Math.abs(cl.z)) * 0.03; const t = Math.max(0, T - t0); y = -4.9 * t * t; }
        else { const t = Math.max(0, T - (letGo + 0.25)); y = -4.9 * t * t * 0.3; }
        if (y < -30) { S.pil.setMatrixAt(i, m4.makeScale(0, 0, 0)); return; }
        S.pil.setMatrixAt(i, m4.makeTranslation(cl.x, y, cl.z));
        if (y > -0.05) { const h = S.s * 0.48; tp.push(cl.x - h, 0.002, cl.z - h, cl.x + h, 0.002, cl.z - h, cl.x + h, 0.002, cl.z - h, cl.x + h, 0.002, cl.z + h, cl.x + h, 0.002, cl.z + h, cl.x - h, 0.002, cl.z + h, cl.x - h, 0.002, cl.z + h, cl.x - h, 0.002, cl.z - h); }
      });
      S.pil.instanceMatrix.needsUpdate = true;
      S.tops.geometry.setAttribute('position', new THREE.Float32BufferAttribute(tp, 3));
      // 她：抓着 GATO（双手举高），GATO 轻轻摆；松手后坠落
      const tf = Math.max(0, T - letGo);
      const fallY = -4.9 * tf * tf;
      putGirl(S.scene, T, { x: 0, y: fallY, z: 0, yaw: 0.3, pose: tf > 0 ? 'airborne' : 'reachUp' });
      const sway = Math.sin(kk * 2.1) * 0.06 + Math.sin(kk * 3.3) * 0.02;
      S.gato.position.set(0, 1.42, 0.05);   // 字底边在她举高的手上，不挡脸
      S.gato.rotation.z = sway; S.word.rotation.y = Math.sin(kk * 1.7) * 0.25;
      S.rest.update(T);
      // 机位：① 低处仰拍柱子（她很小，悬在黑里）② 小节头：侧面中景看柱子一圈圈掉 ③ 小节头：高机位俯看深渊，她抓着字
      const cam = S.camera, bars = downsIn(c.gato, c.end), n = bars.filter(d => d <= T).length;
      if (n === 0) { const k = kk / ((bars[0] ?? c.end) - c.gato); cam.position.set(2.6 - k * 0.4, 0.12, 3.6 - k * 0.4); cam.lookAt(0, 1.1, 0); }   // 贴地仰拍：柱顶地面 + 她 + 头顶的 GATO
      else if (n === 1) { const k = (T - bars[0]) / ((bars[1] ?? c.end) - bars[0]); cam.position.set(1.8 - k * 0.5, 0.9, 2.4 - k * 0.3); cam.lookAt(0, 0.75, 0); }
      else { const k = (T - bars[1]) / (c.end - bars[1]); cam.position.set(0.6, 3.6 - k * 0.4, 1.6 - k * 0.2); cam.lookAt(0, Math.max(-2, 0.5 + fallY * 0.5), 0); }
      return { scene: S.scene, camera: cam, post: { bloom: { strength: 0.55, threshold: 0.95 }, grade: { vignette: 0.4 } } };
    },
  });

  return { shots, cuts: c };
}

// 盒子几何合并（不依赖 BufferGeometryUtils）
function mergeBoxes(geos) {
  const pos = [], nor = [], idx = [];
  let off = 0;
  for (const g of geos) {
    const p = g.attributes.position.array, n = g.attributes.normal.array, ix = g.index.array;
    pos.push(...p); nor.push(...n); for (const i of ix) idx.push(i + off);
    off += p.length / 3;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  out.setIndex(idx);
  return out;
}

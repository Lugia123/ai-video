// shots/c3-optA.js — 副歌 3 方案 A「灌满的办公室」（歌曲时间 94.78–105.96）。#1059，细则 fresh/v4-rest/c3/BRIEF-options-night.md
// 一个连续的 3D 空间 + 动捕：她砸穿屋顶掉进 killswitch 负责人的办公室，回形针从天花板灌进来，水位一拍一拍涨到天花板。
//
//   const draw = await makeC3OptA(mv);  mv.mount(draw, { offset: C3A.t0, duration: C3A.end - C3A.t0 });     // c3-optA-half.html
//
//   S0 94.78 接主歌 3 出口（正上方 8.7 俯拍、FOV 32、仰面下落 14 /s）→ 95.40 砸穿屋顶天窗
//   S1 95.40 室内贴地机位：她摔在地上、爬起来；洞口的回形针跟着灌下来；墙上读数牌 1.00 → 1.07 → 1.13 ERR
//   S2 96.84 屋角高机位全景：通风口一个个喷回形针，97.86「fill」全部同时喷，水位没过脚踝 → 膝盖
//   S3 98.82 越过她的肩推到对面墙：KILLSWITCH 红按钮、空转椅（搭沙滩毛巾）、OUT OF OFFICE、屏幕上是沙滩
//   S4 100.72 贴着水面倒退跟拍：她齐腰 → 齐胸往按钮蹚；身后的 EXIT 灯闪几下灭掉
//   S5 102.46 她肩后机位：伸手够按钮，按钮被回形针埋掉；103.72 红光从回形针底下一圈圈漫开（「lit the fuse」）
//   S6 103.87 高机位全景：水位冲向天花板，灯一盏盏被淹灭；104.78 天花板下俯拍她的脸；105.69 回形针盖满镜头 → 105.96 硬切
// 全部是歌曲时间 T 的纯函数。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { createGirl, createGirlLights, loadAnims, getAnim } from '../kits/girl.js';
import { createPaperclips, mulberry32 } from '../kits/world.js';
import { clipTexture } from '../kits/doom-scale.js';
import { createDoomReadout } from '../kits/doom-readout.js';

export const C3A = { t0: 94.78, land: 95.40, room: 96.84, kill: 98.82, wade: 100.72, reach: 102.46, fuse: 103.72, flood: 103.87, face: 104.78, full: 105.69, end: 105.96 };
export const ANIMS = ['move__fall-air', 'move__hard-landing', 'act__look-around', 'act__look-distance', 'act__push-heavy', 'act__reach-out', 'act__float-flail'];
const ENTRY = { camUp: 8.7, fov: 32, speed: 14 };

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const seg = (T, a, b) => smooth((T - a) / (b - a));
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k);
const hash = (a, b = 0) => { let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const FONT = '"UIAnton", "Anton", Impact, sans-serif';
const NIGHT = '#0b0b1c';

// 房间（她身高 = 1）
const RX = 4.6, RZ = 3.6, H = 1.8;
const LAND = V3(1.2, 0, 1.6);                 // 落点（天花板破洞正下方）
const KILL = V3(0, 0, -RZ + 0.38);            // killswitch 控制台
const BTN = V3(-0.1, 0.6, -RZ + 0.42);        // 红按钮
const DOOR = V3(0.2, 0, RZ);                 // 身后那扇门（EXIT）

// 水位（回形针面的高度）：每句涨一截
const LEVEL = [[95.4, -0.08], [96.84, 0.03], [97.86, 0.14], [98.82, 0.3], [100.72, 0.42], [102.46, 0.6], [103.3, 0.68], [103.87, 0.9], [104.78, 1.36], [105.4, 1.7], [106, 1.8]];
function level(T) {
  if (T <= LEVEL[0][0]) return LEVEL[0][1];
  for (let i = 1; i < LEVEL.length; i++) if (T < LEVEL[i][0]) { const [a, la] = LEVEL[i - 1], [b, lb] = LEVEL[i]; return lerp(la, lb, smooth((T - a) / (b - a))); }
  return LEVEL.at(-1)[1];
}

export async function makeC3OptA(mv) {
  const { music, lyrics } = mv;
  await Promise.all([loadAnims(ANIMS), new FontFace('UIAnton', `url(${new URL('../../../assets/fonts/anton/Anton-Regular.ttf', import.meta.url)})`).load().then(f => document.fonts.add(f))]);
  const girl = await createGirl(mv);
  const kick = (T, d = 0.12) => music.pulse('kick', T, { decay: d });
  const line = p => lyrics.lines.find(l => l.start > 94 && l.text.toLowerCase().startsWith(p.toLowerCase()));
  const L = { up: line("I'm upping"), clips: line('as paperclips'), pto: line('Killswitch'), go: line('Now there'), fuse: line('Too late') };

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(NIGHT); scene.fog = new THREE.FogExp2(NIGHT, 0.028);
  const cam = new THREE.PerspectiveCamera(40, mv.width / mv.height, 0.05, 300);
  scene.add(cam, createGirlLights({ key: 1.3, rim: 2.0, fill: 0.8 }), girl.root);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s3 = V3(), p3 = V3(), ZERO = new THREE.Matrix4().makeScale(0, 0, 0);

  // ================================================================ 房间（实例化方块：一组吃灯、一组自发光）
  const solid = [], glow = [];
  const box = (x, y, z, w, h, d, c, ry = 0) => solid.push([x, y, z, w, h, d, c, ry]);
  const lit = (x, y, z, w, h, d, c, k = 1.6, ry = 0) => glow.push([x, y, z, w, h, d, hdr(c, k), ry]);
  box(0, -0.05, 0, RX * 2, 0.1, RZ * 2, '#1d1c2c');                       // 地板
  box(0, H / 2, -RZ - 0.05, RX * 2, H, 0.1, '#2b2a44'); box(0, H / 2, RZ + 0.05, RX * 2, H, 0.1, '#2b2a44');
  box(-RX - 0.05, H / 2, 0, 0.1, H, RZ * 2, '#2b2a44'); box(RX + 0.05, H / 2, 0, 0.1, H, RZ * 2, '#232238');
  // 格子间：两片，中间留出她走的那条道
  const DESKS = [];
  for (const x of [-3.7, -2.35, 2.85, 3.95]) for (const z of [-1.9, -0.55, 0.8, 2.15]) DESKS.push([x, z]);
  DESKS.forEach(([x, z], i) => {
    box(x, 0.42, z, 1.05, 0.04, 0.56, '#c9c6d8'); box(x - 0.5, 0.21, z, 0.04, 0.42, 0.52, '#8f8ca6'); box(x + 0.5, 0.21, z, 0.04, 0.42, 0.52, '#8f8ca6');
    box(x, 0.48, z - 0.3, 1.1, 0.96, 0.04, '#3c3a60');                      // 隔板
    box(x + 0.1, 0.6, z - 0.2, 0.44, 0.27, 0.03, '#15151f'); box(x + 0.1, 0.46, z - 0.2, 0.05, 0.07, 0.05, '#15151f');
    lit(x + 0.1, 0.6, z - 0.182, 0.4, 0.23, 0.005, [PAL.mint, '#7fa8ff', PAL.pink, '#ffffff'][i % 4], 0.9);
    box(x - 0.05, 0.27, z + 0.42, 0.3, 0.05, 0.3, '#17171f'); box(x - 0.05, 0.47, z + 0.56, 0.3, 0.36, 0.05, '#17171f'); box(x - 0.05, 0.13, z + 0.42, 0.04, 0.26, 0.04, '#555');
  });
  // 天花板灯（一盏盏被淹灭）
  const LAMPS = [];
  for (const x of [-3.3, -1.1, 1.1, 3.3]) for (const z of [-2.5, -0.85, 0.85, 2.5]) LAMPS.push([x, z]);
  // killswitch 工位
  box(KILL.x, 0.21, KILL.z, 1.9, 0.42, 0.62, '#3a3950'); box(KILL.x, 0.43, KILL.z, 1.96, 0.03, 0.66, PAL.lemon);
  box(BTN.x, 0.5, BTN.z, 0.42, 0.1, 0.42, '#1c1c28');
  box(0.62, 0.62, KILL.z - 0.12, 0.5, 0.32, 0.03, '#15151f');           // 屏幕（沙滩）
  box(0.05, 1.42, -RZ + 0.03, 2.3, 0.4, 0.03, '#15151f');                 // KILLSWITCH 招牌底板
  // 门
  box(DOOR.x, 0.72, DOOR.z - 0.02, 0.86, 1.44, 0.05, '#4a4870'); box(DOOR.x + 0.32, 0.7, DOOR.z - 0.06, 0.05, 0.03, 0.06, '#ddd');
  // 屋顶（S0 俯拍用）
  box(0, H + 0.2, 0, RX * 2 + 1.2, 0.3, RZ * 2 + 1.2, '#16162a');
  box(-2.6, H + 0.6, -1.9, 1.3, 0.5, 1.0, '#26263c'); box(3.0, H + 0.55, 1.2, 0.9, 0.4, 0.9, '#26263c'); box(-3.2, H + 0.5, 2.1, 0.7, 0.3, 1.4, '#26263c');
  for (const [x, z, w, d] of [[0, -RZ - 0.6, RX * 2 + 1.2, 0.06], [0, RZ + 0.6, RX * 2 + 1.2, 0.06], [-RX - 0.6, 0, 0.06, RZ * 2 + 1.2], [RX + 0.6, 0, 0.06, RZ * 2 + 1.2]]) lit(x, H + 0.38, z, w, 0.05, d, PAL.pink, 2.2);
  const mkInst = (list, mat) => {
    const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mat, list.length); mesh.frustumCulled = false;
    list.forEach(([x, y, z, w, h, d, c, ry], i) => { mesh.setMatrixAt(i, m4.compose(p3.set(x, y, z), q.setFromEuler(e.set(0, ry, 0)), s3.set(w, h, d))); mesh.setColorAt(i, c.isColor ? c : new THREE.Color(c)); });
    scene.add(mesh); return mesh;
  };
  mkInst(solid, new THREE.MeshStandardMaterial({ roughness: 0.82, metalness: 0.05 }));
  mkInst(glow, new THREE.MeshBasicMaterial({ fog: false, toneMapped: false }));
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(RX * 2, RZ * 2), new THREE.MeshStandardMaterial({ color: '#34334e', roughness: 0.9 })); ceil.rotation.x = Math.PI / 2; ceil.position.y = H; scene.add(ceil);
  const lampMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1.2, 0.03, 0.34), new THREE.MeshBasicMaterial({ fog: false, toneMapped: false }), LAMPS.length);
  LAMPS.forEach(([x, z], i) => lampMesh.setMatrixAt(i, m4.makeTranslation(x, H - 0.02, z))); scene.add(lampMesh);
  const hemi = new THREE.HemisphereLight('#cfd4ff', '#2a2440', 0.9); scene.add(hemi);
  const roomLights = [[-2.2, -1.6], [2.2, -1.6], [-2.2, 1.6], [2.2, 1.6]].map(([x, z]) => { const l = new THREE.PointLight('#dfe4ff', 5, 9, 1.6); l.position.set(x, H - 0.25, z); scene.add(l); return l; });
  const redLight = new THREE.PointLight('#ff2030', 6, 7, 1.5); redLight.position.set(BTN.x, 1.0, BTN.z + 0.5); scene.add(redLight);
  // 贴图小件：canvas → 平面
  const cvPlane = (w, h, px, py, drawFn, { hdrK = 1, transparent = false } = {}) => {
    const cv = document.createElement('canvas'); cv.width = px; cv.height = py; drawFn(cv.getContext('2d'), px, py);
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, fog: false, toneMapped: false, transparent, color: new THREE.Color(hdrK, hdrK, hdrK) })); scene.add(m); return m;
  };
  const txt = (c, s, x, y, px, col, max) => { c.font = `${px}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = col; c.fillText(s, x, y, max); };
  const killSign = cvPlane(2.2, 0.34, 1024, 160, (c, w, h) => { c.fillStyle = '#12060a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ff2b4a'; c.lineWidth = 10; c.strokeRect(8, 8, w - 16, h - 16); txt(c, 'KILLSWITCH', w / 2, h / 2 + 6, 128, '#ff4a62', w - 80); }, { hdrK: 1.7 });
  killSign.position.set(0.05, 1.42, -RZ + 0.05);
  const ooo = cvPlane(0.62, 0.3, 640, 310, (c, w, h) => { c.fillStyle = '#f2ede4'; c.fillRect(0, 0, w, h); c.strokeStyle = '#0a0a10'; c.lineWidth = 16; c.strokeRect(8, 8, w - 16, h - 16); txt(c, 'OUT OF', w / 2, h * 0.33, 120, '#0a0a10', w - 60); txt(c, 'OFFICE', w / 2, h * 0.72, 120, '#0a0a10', w - 60); }, { hdrK: 1.05 });
  ooo.position.set(-0.72, 0.6, KILL.z + 0.2); ooo.rotation.set(-0.15, 0.2, 0);
  const beach = cvPlane(0.46, 0.28, 512, 312, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#48c8ff'); g.addColorStop(0.55, '#bff0ff'); g.addColorStop(0.56, '#18b8c8'); g.addColorStop(0.78, '#18b8c8'); g.addColorStop(0.8, '#f6dc9a'); g.addColorStop(1, '#f0c878'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = '#fff6a0'; c.beginPath(); c.arc(w * 0.76, h * 0.26, 40, 0, 7); c.fill();
    c.strokeStyle = '#5a3a1a'; c.lineWidth = 12; c.beginPath(); c.moveTo(w * 0.24, h * 0.95); c.quadraticCurveTo(w * 0.3, h * 0.6, w * 0.22, h * 0.34); c.stroke();
    c.strokeStyle = '#1f8a3a'; c.lineWidth = 14; c.lineCap = 'round'; for (const a of [-2.6, -2.0, -1.2, -0.5, 0.2]) { c.beginPath(); c.moveTo(w * 0.22, h * 0.34); c.quadraticCurveTo(w * 0.22 + Math.cos(a) * 60, h * 0.34 + Math.sin(a) * 60 - 20, w * 0.22 + Math.cos(a) * 110, h * 0.34 + Math.sin(a) * 70 + 14); c.stroke(); }
  }, { hdrK: 1.25 });
  beach.position.set(0.62, 0.62, KILL.z - 0.1);
  const exitSign = cvPlane(0.6, 0.24, 512, 204, (c, w, h) => { c.fillStyle = '#04200f'; c.fillRect(0, 0, w, h); txt(c, 'EXIT', w / 2, h / 2 + 6, 170, '#5dffa0', w - 40); });
  exitSign.position.set(DOOR.x, 1.6, RZ - 0.03); exitSign.rotation.y = Math.PI;
  const skylight = cvPlane(3.2, 2.4, 512, 384, (c, w, h) => { c.fillStyle = '#cfe6ff'; c.fillRect(0, 0, w, h); c.strokeStyle = '#20203a'; c.lineWidth = 14; for (let i = 0; i <= 4; i++) { c.beginPath(); c.moveTo(i * w / 4, 0); c.lineTo(i * w / 4, h); c.stroke(); } for (let j = 0; j <= 3; j++) { c.beginPath(); c.moveTo(0, j * h / 3); c.lineTo(w, j * h / 3); c.stroke(); } }, { hdrK: 1.5 });
  skylight.rotation.x = -Math.PI / 2; skylight.position.set(LAND.x, H + 0.36, LAND.z);
  const hole = new THREE.Mesh(new THREE.CircleGeometry(0.62, 9), new THREE.MeshBasicMaterial({ color: '#05050c', fog: false })); hole.rotation.x = Math.PI / 2; hole.position.set(LAND.x, H - 0.012, LAND.z); scene.add(hole);
  // 按钮 + 玻璃罩
  const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.09, 28), new THREE.MeshBasicMaterial({ fog: false, toneMapped: false })); btn.position.copy(BTN); scene.add(btn);
  const glass = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.3, 0.38), new THREE.MeshBasicMaterial({ color: '#bfe9ff', transparent: true, opacity: 0.14, depthWrite: false })); glass.position.set(BTN.x, 0.7, BTN.z); scene.add(glass);
  const glassEdge = new THREE.LineSegments(new THREE.EdgesGeometry(glass.geometry), new THREE.LineBasicMaterial({ color: '#dff6ff' })); glassEdge.position.copy(glass.position); scene.add(glassEdge);
  // 空转椅（搭着沙滩毛巾，慢慢自己转）+ 小伞饮料
  const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.7, ...o });
  const chair = new THREE.Group(); chair.position.set(0.85, 0, KILL.z + 0.72); scene.add(chair);
  const cadd = (g, geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); g.add(m); return m; };
  cadd(chair, new THREE.CylinderGeometry(0.2, 0.2, 0.03, 5), std('#15151c'), 0, 0.03, 0); cadd(chair, new THREE.CylinderGeometry(0.025, 0.025, 0.26, 8), std('#777'), 0, 0.16, 0);
  cadd(chair, new THREE.BoxGeometry(0.36, 0.06, 0.36), std('#20202c'), 0, 0.31, 0); cadd(chair, new THREE.BoxGeometry(0.36, 0.5, 0.06), std('#20202c'), 0, 0.6, -0.17);
  cadd(chair, new THREE.BoxGeometry(0.3, 0.36, 0.02), std(PAL.mint, { emissive: PAL.mint, emissiveIntensity: 0.4 }), 0, 0.68, -0.135); cadd(chair, new THREE.BoxGeometry(0.3, 0.07, 0.024), std(PAL.pink, { emissive: PAL.pink, emissiveIntensity: 0.4 }), 0, 0.7, -0.134);
  cadd(chair, new THREE.BoxGeometry(0.3, 0.3, 0.02), std(PAL.mint, { emissive: PAL.mint, emissiveIntensity: 0.4 }), 0, 0.72, -0.21);
  const drink = new THREE.Group(); drink.position.set(0.2, 0.445, KILL.z + 0.16); scene.add(drink);
  cadd(drink, new THREE.CylinderGeometry(0.05, 0.038, 0.14, 14), std(PAL.lemon, { emissive: PAL.lemon, emissiveIntensity: 0.6 }), 0, 0.07, 0);
  cadd(drink, new THREE.ConeGeometry(0.09, 0.05, 10), std(PAL.pink, { emissive: PAL.pink, emissiveIntensity: 0.7 }), 0.03, 0.22, 0).rotation.z = -0.3; cadd(drink, new THREE.CylinderGeometry(0.004, 0.004, 0.16, 5), std('#eee'), 0.015, 0.15, 0);
  // 读数牌
  const readout = await createDoomReadout({ height: 0.8, pole: false }); readout.group.position.set(-2.75, 1.18, -RZ + 0.2); scene.add(readout.group);
  const readText = T => { const w = L.up.words; return T >= w[3].start ? (Math.floor(T * 4) % 2 || T < w[3].start + 0.5 ? '1.13' : 'ERR') : T >= w[2].start ? '1.07' : T >= w[1].start ? '1.00' : '0.99'; };

  // ================================================================ 回形针
  const proto = createPaperclips({ count: 1, clipSize: 0.085 }).mesh;
  const clipGeo = proto.geometry, clipMat = proto.material; clipMat.fog = true;
  const TINT = [new THREE.Color('#ffffff'), new THREE.Color(PAL.pink), new THREE.Color(PAL.mint), new THREE.Color(PAL.lemon)];
  const tintOf = h => TINT[h < 0.86 ? 0 : 1 + Math.min(2, Math.floor((h - 0.86) / 0.0467))];
  // 水面：一层真回形针 + 底下一张贴图平面，整体跟着水位升
  const SEA_N = 34000;
  const sea = new THREE.InstancedMesh(clipGeo, clipMat, SEA_N); sea.frustumCulled = false; scene.add(sea);
  { const rnd = mulberry32(5); for (let i = 0; i < SEA_N; i++) {
    const x = (rnd() * 2 - 1) * (RX - 0.05), z = (rnd() * 2 - 1) * (RZ - 0.05), d = Math.hypot(x - LAND.x, z - LAND.z);
    e.set(-Math.PI / 2 + (rnd() - 0.5) * 0.8, rnd() * 6.283, (rnd() - 0.5) * 0.8, 'YXZ');
    sea.setMatrixAt(i, m4.compose(p3.set(x, -rnd() * 0.12 + 0.05 * Math.exp(-d * d * 0.6), z), q.setFromEuler(e), s3.setScalar(lerp(0.85, 1.3, rnd())))); sea.setColorAt(i, tintOf(rnd()));
  } }
  const seaTex = clipTexture(31, { size: 1024, n: 420 }); seaTex.wrapS = seaTex.wrapT = THREE.RepeatWrapping; seaTex.repeat.set(RX * 2 / 1.9, RZ * 2 / 1.9); seaTex.anisotropy = 8;
  const seaPlane = new THREE.Mesh(new THREE.PlaneGeometry(RX * 2, RZ * 2), new THREE.MeshBasicMaterial({ map: seaTex, color: '#b4b4c8' })); seaPlane.rotation.x = -Math.PI / 2; scene.add(seaPlane);
  // 落点的小堆（跟着她砸穿天花板落下来）
  const heap = createPaperclips({ count: 1500, seed: 23, clipSize: 0.085 }); heap.mesh.material.fog = true; heap.mesh.position.copy(LAND); scene.add(heap.mesh);
  // 喷口：天花板破洞 + 通风口（竖直往下灌）+ 抽屉 / 屏幕（往外喷）
  const EM = [{ p: [LAND.x, H, LAND.z], t0: 95.42, r: 0.24, k: 0.55, fade: [97.6, 98.7, 0.45] }];
  [[-3.0, -1.4], [2.6, -0.6], [-1.3, 2.3], [1.9, -2.5], [-3.6, 1.5], [-0.6, -0.5], [-3.9, -2.9], [-1.9, -2.8]].forEach(([x, z], i) => EM.push({ p: [x, H, z], t0: i < 2 ? 96.84 + i * 0.45 : 97.86 + (i - 2) * 0.05, r: 0.2, k: 1, big: 1.45 }));
  [[-2.35, 0.8, 1, 0.5], [2.85, -0.55, -1, 0.4], [-3.7, -1.9, 1, 0.3], [3.95, 2.15, -1, -0.4]].forEach(([x, z, dx, dz], i) => EM.push({ p: [x + 0.1, 0.6, z - 0.15], v: [dx * 1.5, 1.6, dz * 1.2 + 0.6], t0: 97.86 + i * 0.12, r: 0.05, k: 0.7 }));
  const EM_N = 220, G = 9;
  const jets = new THREE.InstancedMesh(clipGeo, clipMat, EM.length * EM_N); jets.frustumCulled = false; scene.add(jets);
  for (let i = 0; i < EM.length * EM_N; i++) jets.setColorAt(i, tintOf(hash(i, 77)));
  function updateJets(T, Lv) {
    EM.forEach((E, j) => {
      const on = clamp((T - E.t0) / 0.35) * E.k * (E.fade ? lerp(1, E.fade[2], seg(T, E.fade[0], E.fade[1])) : 1);
      for (let i = 0; i < EM_N; i++) {
        const id = j * EM_N + i, h1 = hash(id, 1), h2 = hash(id, 2), h3 = hash(id, 3);
        if (h3 > on || T < E.t0) { jets.setMatrixAt(id, ZERO); continue; }
        let x, y, z, tau;
        if (E.v) { const life = 0.75; tau = ((T * 1.25 + h1) % 1) * life; x = E.p[0] + E.v[0] * tau * (0.7 + 0.6 * h2); y = E.p[1] + E.v[1] * tau - 0.5 * G * tau * tau; z = E.p[2] + E.v[2] * tau * (0.6 + 0.8 * h3); }
        else { const fallH = Math.max(0.15, E.p[1] - Lv), life = Math.sqrt(2 * fallH / G) + 0.05; tau = ((T / life * 0.9 + h1) % 1) * life; const spread = E.r * (1 + tau * 1.6), a = h2 * 6.283; x = E.p[0] + Math.cos(a) * spread * Math.sqrt(h3 / Math.max(on, 0.01)); y = E.p[1] - 0.5 * G * tau * tau; z = E.p[2] + Math.sin(a) * spread * Math.sqrt(h3 / Math.max(on, 0.01)); }
        if (y < Lv - 0.03) { jets.setMatrixAt(id, ZERO); continue; }
        e.set(h1 * 6.283 + T * (4 + 6 * h2), h2 * 6.283 + T * 5 * h3, h3 * 6.283);
        jets.setMatrixAt(id, m4.compose(p3.set(x, y, z), q.setFromEuler(e), s3.setScalar(E.big ?? 1.1)));
      }
    });
    jets.instanceMatrix.needsUpdate = true;
  }
  // 结尾盖满镜头的回形针（挂在镜头上，从画面底往上涨）
  const FILL_N = 16000;
  const fill = new THREE.InstancedMesh(clipGeo, new THREE.MeshMatcapMaterial({ matcap: clipMat.matcap, fog: false }), FILL_N); fill.frustumCulled = false; cam.add(fill);
  const fillD = new Float32Array(FILL_N * 3);
  { const rnd = mulberry32(8); for (let i = 0; i < FILL_N; i++) { fillD.set([(rnd() - 0.5) * 3.0, (rnd() - 0.5) * 1.8, -0.5 - rnd() * 1.1], i * 3); fill.setColorAt(i, tintOf(rnd())); } }
  const fillBack = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.0), new THREE.MeshBasicMaterial({ color: '#5a4a5c', fog: false })); cam.add(fillBack);
  function updateFill(T) {
    const p = clamp((T - 105.22) / (C3A.full - 105.22)); fill.visible = fillBack.visible = p > 0;
    if (!fill.visible) return;
    fillBack.position.set(0, lerp(-2.0, 0, p), -1.7); fillBack.scale.setScalar(1.3);
    const top = lerp(-0.95, 0.95, p) + 0.12, sink = (T - C3A.full) * 0.12;
    for (let i = 0; i < FILL_N; i++) {
      const x = fillD[i * 3], y = fillD[i * 3 + 1], z = fillD[i * 3 + 2];
      if (y > top + 0.12 * Math.sin(x * 5 + i)) { fill.setMatrixAt(i, ZERO); continue; }
      e.set(hash(i, 4) * 6.283, hash(i, 5) * 6.283 + T * 0.3, hash(i, 6) * 6.283);
      fill.setMatrixAt(i, m4.compose(p3.set(x, y - Math.max(0, sink), z), q.setFromEuler(e), s3.setScalar(2.3 * lerp(0.7, 1.3, hash(i, 7)))));
    }
    fill.instanceMatrix.needsUpdate = true;
  }
  // 「lit the fuse」：按钮被埋住后，红光从回形针底下一圈圈漫开
  const fuseMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
    uniforms: { uR: { value: 0 }, uC: { value: new THREE.Vector2(BTN.x, BTN.z) }, uK: { value: 0 }, uT: { value: 0 } },
    vertexShader: 'varying vec2 vP; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vP = w.xz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `uniform float uR, uK, uT; uniform vec2 uC; varying vec2 vP;
      void main(){ float d = distance(vP, uC); float ring = exp(-pow((d - uR) * 3.2, 2.0)); float ring2 = exp(-pow((d - uR * 0.55) * 3.2, 2.0)) * 0.6;
        float inside = smoothstep(uR, uR - 1.2, d) * (0.13 + 0.07 * sin(d * 9.0 - uT * 14.0));
        gl_FragColor = vec4(vec3(2.0, 0.18, 0.25) * (ring * 0.8 + ring2 * 0.6 + inside) * uK, 1.0); }` });
  const fuse = new THREE.Mesh(new THREE.PlaneGeometry(RX * 2, RZ * 2), fuseMat); fuse.rotation.x = -Math.PI / 2; scene.add(fuse);

  // ================================================================ 歌词条（挂在镜头下沿，逐词亮）
  const capCv = document.createElement('canvas'); capCv.width = 1920; capCv.height = 170; const capG = capCv.getContext('2d');
  const capTex = new THREE.CanvasTexture(capCv); capTex.colorSpace = THREE.SRGBColorSpace;
  const cap = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: capTex, transparent: true, depthTest: false, depthWrite: false, fog: false, toneMapped: false })); cap.renderOrder = 999; cam.add(cap);
  const LINES = [L.up, L.clips, L.pto, L.go, L.fuse];
  function updateCaption(T) {
    const ln = LINES.filter(l => T >= l.start - 0.12).at(-1), g = capG;
    g.clearRect(0, 0, 1920, 170);
    if (ln && T < Math.min(ln.end + 0.9, (LINES[LINES.indexOf(ln) + 1]?.start ?? 1e9) - 0.12) && T < 105.3) {
      g.font = `76px ${FONT}`; g.textBaseline = 'middle'; g.textAlign = 'left';
      const ws = ln.words.map(w => ({ ...w, s: (w.w ?? w.text ?? '').toUpperCase().replace(/[,.]/g, '') })), gap = 26, wd = ws.map(w => g.measureText(w.s).width + 36);
      let x = (1920 - wd.reduce((a, b) => a + b + gap, -gap)) / 2;
      ws.forEach((w, i) => {
        const on = T >= w.start, act = on && T < (ws[i + 1]?.start ?? w.end + 0.4), pop = on ? 1 + 0.12 * Math.exp(-(T - w.start) * 12) : 1;
        g.save(); g.translate(x + wd[i] / 2, 85); g.scale(pop, pop);
        g.fillStyle = on ? '#0a0a10' : 'rgba(10,10,16,0.55)'; g.fillRect(-wd[i] / 2, -52, wd[i], 104);
        g.strokeStyle = act ? PAL.lemon : on ? PAL.mint : 'rgba(95,227,192,0.35)'; g.lineWidth = 6; g.strokeRect(-wd[i] / 2 + 3, -49, wd[i] - 6, 98);
        g.fillStyle = act ? PAL.lemon : on ? '#ffffff' : 'rgba(255,255,255,0.3)'; g.fillText(w.s, -wd[i] / 2 + 18, 6); g.restore();
        x += wd[i] + gap;
      });
    }
    capTex.needsUpdate = true;
    const d = 1, hh = 2 * Math.tan(cam.fov * Math.PI / 360) * d, ww = hh * cam.aspect;
    cap.scale.set(ww, hh * 170 / 1080, 1); cap.position.set(0, -hh / 2 + hh * (170 / 1080) / 2 + hh * 0.035, -d);
  }

  // ================================================================ 她
  const BI = girl.dancer.S.info, bp = k => BI[k].bone.getWorldPosition(V3());
  const SEQ = Object.assign([
    { t: C3A.land - 0.52, anim: 'move__hard-landing' }, { t: 97.5, anim: 'act__look-around' }, { t: C3A.kill - 0.1, anim: 'act__look-distance' },
    { t: C3A.wade, anim: 'act__push-heavy' }, { t: C3A.reach, anim: 'act__reach-out' }, { t: C3A.flood + 0.1, anim: 'act__float-flail' },
  ], { fade: 0.3 });
  const WADE0 = V3(1.15, 0, 1.45), WADE1 = V3(0.2, 0, -1.55), REACH = V3(0.12, 0, -2.2), DRIFT = V3(0.55, 0, -1.3);
  const girlXZ = T => T < C3A.wade ? LAND.clone().lerp(WADE0, seg(T, 98.6, C3A.wade)) : T < C3A.reach ? WADE0.clone().lerp(WADE1, (T - C3A.wade) / (C3A.reach - C3A.wade)) : T < C3A.flood ? WADE1.clone().lerp(REACH, seg(T, C3A.reach, C3A.reach + 0.9)) : REACH.clone().lerp(DRIFT, seg(T, C3A.flood, 105.2));
  const girlYaw = T => lerp(0.85, Math.PI + 0.22, seg(T, 98.35, 98.95)) + 0.0;
  const SUPINE_Q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(V3(1, 0, 0), V3(0, 0, -1), V3(0, 1, 0)));
  const FALL = getAnim('move__fall-air'), _B = new THREE.Matrix4(), _Rn = new THREE.Quaternion();
  function placeSupine(T, hips) {                       // 仰面朝上（同 shots/c3-v4.js 的入口摆法）
    girl.root.position.set(0, 0, 0); girl.root.quaternion.identity(); girl.root.updateMatrixWorld(true);
    girl.dancer.apply(FALL.solve((0.6 + (T - 94.30)) / FALL.srcPeriod, girl.dancer)); girl.root.updateMatrixWorld(true);
    const h = bp('Hips'), y = bp('Head').sub(bp('LeftFoot').add(bp('RightFoot')).multiplyScalar(0.5)).normalize();
    const x = bp('LeftUpLeg').sub(bp('RightUpLeg')); x.addScaledVector(y, -x.dot(y)).normalize();
    _Rn.setFromRotationMatrix(_B.makeBasis(x, y, V3().crossVectors(x, y))).invert();
    const qq = SUPINE_Q.clone().multiply(_Rn);
    girl.root.quaternion.copy(qq); girl.root.position.copy(hips).sub(h.applyQuaternion(qq)); girl.root.updateMatrixWorld(true);
  }
  function placeGirl(T, Lv) {
    girl.root.visible = true; girl.root.scale.setScalar(1);
    if (T < C3A.land) { placeSupine(T, V3(LAND.x, H + 0.5 + (C3A.land - T) * ENTRY.speed, LAND.z)); return; }
    const xz = girlXZ(T), y = clamp(Lv - 0.8, 0, 0.74), tilt = seg(T, C3A.flood + 0.2, 104.9) * -0.5;
    girl.root.position.set(0, 0, 0); girl.root.rotation.set(tilt, girlYaw(T), 0, 'YXZ'); girl.root.updateMatrixWorld(true);
    girl.play(SEQ, T); girl.root.updateMatrixWorld(true);
    const h = bp('Hips'); girl.root.position.set(xz.x - h.x, y, xz.z - h.z); girl.root.updateMatrixWorld(true);
  }

  // ================================================================ 镜头
  const setCam = (pos, look, fov, up = V3(0, 1, 0)) => { cam.position.copy(pos); cam.up.copy(up); cam.fov = fov; cam.lookAt(look); cam.updateProjectionMatrix(); cam.updateMatrixWorld(true); };
  const shakeV = (T, t0, amp, f = 60) => { const k = T - t0; return k < 0 ? 0 : amp * Math.exp(-k * 9) * Math.sin(k * f); };
  function camera(T, Lv, gp) {
    if (T < C3A.land) { const y = H + 0.5 + (C3A.land - T) * ENTRY.speed; return setCam(V3(LAND.x, y + ENTRY.camUp, LAND.z), V3(LAND.x, y, LAND.z), ENTRY.fov, V3(0, 0, -1)); }
    if (T < C3A.room) { const u = seg(T, C3A.land, C3A.room), sh = shakeV(T, C3A.land + 0.05, 0.06); return setCam(V3(lerp(2.0, 1.85, u), 0.28 + 0.14 * u + sh, lerp(3.4, 3.15, u)), V3(0.95, lerp(0.45, 0.62, u) + sh, 1.3), 54); }
    if (T < C3A.kill) { const u = (T - C3A.room) / (C3A.kill - C3A.room), sh = shakeV(T, 97.86, 0.05); return setCam(V3(lerp(1.95, 2.15, smooth(u)), lerp(0.7, 1.66, smooth(u)) + sh, lerp(2.75, 3.45, smooth(u))), V3(lerp(0.7, -0.5, u), lerp(0.5, 0.2, u) + sh, lerp(0.9, -1.0, u)), lerp(50, 68, smooth(u))); }
    if (T < C3A.wade) { const u = seg(T, C3A.kill, 100.25), v = (T - C3A.kill) / (C3A.wade - C3A.kill); return setCam(V3(lerp(1.85, 0.5, u), lerp(1.0, 0.92, u), lerp(2.55, -1.75 - 0.15 * v, u)), V3(lerp(0.3, 0.3, u), lerp(0.85, 0.82, u), -RZ), lerp(44, 40, u)); }
    if (T < C3A.reach) { const u = (T - C3A.wade) / (C3A.reach - C3A.wade); return setCam(V3(gp.x - 0.62 + 0.1 * u, Lv + 0.34, gp.z - 1.12), V3(gp.x + 0.05, Lv + 0.2, gp.z + 0.1), 44); }
    if (T < C3A.flood) { const u = (T - C3A.reach) / (C3A.flood - C3A.reach); return setCam(V3(gp.x + 0.95 - 0.1 * u, Lv + 0.4, gp.z + lerp(0.95, 0.75, u)), V3(BTN.x + 0.05, 0.72, BTN.z + 0.1), 40); }
    if (T < C3A.face) { const u = (T - C3A.flood) / (C3A.face - C3A.flood); return setCam(V3(lerp(-2.7, -2.3, u), Lv + lerp(0.5, 0.3, u), lerp(-0.2, -0.5, u)), V3(gp.x, Lv + 0.22, gp.z), 50); }
    const u = seg(T, C3A.face, 105.5); return setCam(V3(gp.x - lerp(0.35, 0.2, u), H - 0.06, gp.z - lerp(1.15, 0.9, u)), V3(gp.x, Math.min(Lv + 0.02, 1.42), gp.z + 0.05), 46);
  }

  const post = (T, x = {}) => ({ bloom: { strength: 0.7, threshold: 1.0 }, chroma: 0.1 + 0.2 * kick(T), grade: { vignette: 0.34 }, ...x });
  const lampC = new THREE.Color();

  return function draw(T) {
    const Lv = level(T), inside = T >= C3A.land;
    // 水位
    sea.position.y = Lv; sea.count = Math.floor(SEA_N * lerp(0.02, 1, seg(T, C3A.land, 98.9) ** 1.6)); sea.visible = inside && Lv < H - 0.02;
    seaPlane.position.y = Lv - 0.13; seaPlane.visible = inside;
    heap.mesh.visible = inside && Lv < 0.4; heap.update(T, { t0: C3A.land - 0.15, dur: 1.5, height: 0.26, radius: 0.95, drop: 1.7 });
    updateJets(T, Lv); jets.visible = inside;
    // 灯：平时微闪；淹到一盏灭一盏（从低到高其实同高，所以按离按钮的距离依次灭）
    const dark = seg(T, C3A.fuse, 105.3);
    LAMPS.forEach(([x, z], i) => { const off = T > C3A.flood + 0.15 + (i * 7 % 16) * 0.085 ? 0 : 1, fl = 0.9 + 0.1 * Math.sin(T * 40 + i * 3) * (hash(i, Math.floor(T * 8)) > 0.8 ? 1 : 0); lampMesh.setColorAt(i, lampC.set('#dfe6ff').multiplyScalar(1.0 * off * fl)); });
    lampMesh.instanceColor.needsUpdate = true; lampMesh.visible = inside;
    roomLights.forEach((l, i) => l.intensity = inside ? 5 * (1 - 0.92 * seg(T, C3A.flood + 0.2 + i * 0.25, C3A.flood + 0.6 + i * 0.25)) : 0);
    hemi.intensity = inside ? lerp(0.9, 0.25, dark) : 1.0;
    ceil.visible = inside; hole.visible = inside; skylight.visible = !inside; scene.fog.density = inside ? 0.028 : 0.01;
    // 按钮：露在外面时发红光；埋住后红光从底下漫开
    const buried = seg(T, 103.3, C3A.fuse);
    btn.material.color.copy(hdr('#ff1a2e', lerp(2.6, 0.6, buried) * (0.85 + 0.15 * Math.sin(T * 13))));
    redLight.intensity = inside ? lerp(6, 11, seg(T, C3A.fuse, C3A.fuse + 0.5)) : 0; redLight.position.y = Math.max(1.0, Lv + 0.3);
    fuse.position.y = Lv + 0.035; fuse.visible = T >= C3A.fuse; fuseMat.uniforms.uR.value = (T - C3A.fuse) * 5.2; fuseMat.uniforms.uK.value = seg(T, C3A.fuse, C3A.fuse + 0.25) * (0.75 + 0.25 * kick(T, 0.2)); fuseMat.uniforms.uT.value = T;
    clipMat.color.setRGB(1, lerp(1, 0.62, dark), lerp(1, 0.66, dark));
    // 道具
    chair.rotation.y = -0.6 + (T - 98) * 0.55;
    const ex = T < 101.14 ? 1 : T < 101.9 ? (Math.floor(T * 14) % 2 ? 1 : 0.15) : 0.06; exitSign.material.color.setScalar(1.5 * ex);
    readout.group.visible = inside; readout.update(T, { text: readText(T), lit: lerp(1, 0.5, dark), alarm: T >= L.up.words[3].start ? 1 : 0 });
    // 她 + 镜头
    placeGirl(T, Lv); if (T >= 105.6) girl.root.visible = false;
    const gp = girlXZ(T);
    camera(T, Lv, gp);
    girl.setSkin('toon', T); girl.root.updateMatrixWorld(true);
    if (girl.face && girl.root.visible) girl.face.update(T, { camera: T < 105.05 ? cam : null, ...(T < 97.2 || T >= C3A.flood ? { expression: 'surprised' } : {}) });
    updateFill(T); updateCaption(T);
    if (T >= 105.6) { sea.visible = seaPlane.visible = fuse.visible = jets.visible = false; }      // 盖满之后只剩镜头前的回形针（水面穿过镜头会露出贴图平面）
    const flash = Math.max(0, 1 - (T - C3A.land) / 0.14) * (T >= C3A.land ? 0.8 : 0);
    mv.stage.render(scene, cam, post(T, flash > 0 ? { flash } : {}));
  };
}

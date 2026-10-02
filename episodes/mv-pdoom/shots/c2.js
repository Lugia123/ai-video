// shots/c2.js — 副歌 2（歌曲时间 58.4–74.8 s），分镜见 TREATMENT.md §4「副歌 2」。
//
//   const shots = await makeC2(mv);   // 需要先 await initType3D()
//   mv.mount(shots, { offset: 58.4, duration: 16.4 });
//
// 切点（全在拍上）：
//   58.400 c2-slam     整屏柠黄，黑色 3D 巨字 I'M / UPPING 砸入（副歌重拍字卡）
//   59.326 c2-city     夜城全亮；巨型铬字 P(DOOM) 立在城中和楼一样高，楼顶翻牌 0.15 → 0.42；她在楼顶跳
//                      三个机位：A 低机位仰拍全身（人高 ≥ 60%）→ B 中景环绕 → C 升臂拉远，P(DOOM) 占满画面
//   60.689 c2-snake    环节（锁链）组成的巨蛇绕 P(DOOM) 盘旋；BOOM 砸下爆开 + 冲击环扫过全城（whip 进）
//   62.962 c2-moon     K 线柱冲天，主柱拖火箭尾迹，镜头仰到月亮；词一个个留在尾迹上
//   64.325 c2-omega    满天星；星座连线写出 THE OMEGA / POINT'S；「soon」时所有星和线汇成一点
//   66.598 c2-flops    霓粉色块擦入，翻牌疯转，定格 1E30 / FLOPS/SEC
//   69.780 c2-safe     方块高塔摇摇欲坠 + SAFE 勾选框；最后一拍抽走一块
// 所有 update 都是 T 的纯函数。

import * as THREE from 'three';
import { PALETTE as PAL, doomColor } from '../engine/palette.js';
import { FX, FONTS, textGeo, advance, lineMat } from '../kits/type3d.js';
import { createCity, chromeMatcap } from '../kits/world.js';
import { createShockwave } from '../kits/vfx.js';
import { createGirl, createGirlLights } from '../kits/girl.js';
import { Line2 } from '../../../assets/vendor/three/examples/jsm/lines/Line2.js';
import { LineGeometry } from '../../../assets/vendor/three/examples/jsm/lines/LineGeometry.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIn = p => clamp(p) ** 3;
const eInOut = p => { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2; };
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const col = c => new THREE.Color(c);
const hash = (a, b = 0) => { let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

function persp(fov = 30) { return new THREE.PerspectiveCamera(fov, 16 / 9, 0.05, 800); }
function scn(bg = PAL.ink) { const s = new THREE.Scene(); s.background = col(bg); return s; }
// 屏幕层：挂在相机前 d 处，内部坐标 = type3d 取景（fov30、z=40 → 可视 38.1 × 21.4）
function overlay(scene, camera, d = 1) {
  const g = new THREE.Group();
  g.position.z = -d;
  g.scale.setScalar((2 * d * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / 21.44);
  camera.add(g);
  scene.add(camera);
  g.userData.pointK = d / 40 * (Math.tan(THREE.MathUtils.degToRad(15)) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
  return g;
}
// 屏幕层里的 PointsMaterial：点大小按层的缩放补回来（sizeAttenuation 不认组缩放）
function fixPoints(ov) {
  const k = ov.userData.pointK;
  ov.traverse(o => {
    const m = o.isPoints && o.material;
    if (!m || !m.isPointsMaterial || m.userData.pointK) return;
    m.userData.pointK = k;
    const prev = m.onBeforeCompile;
    m.onBeforeCompile = (sh, r) => { prev?.(sh, r); sh.vertexShader = sh.vertexShader.replace('gl_PointSize = size;', `gl_PointSize = size * ${k.toFixed(6)};`); };
    m.customProgramCacheKey = () => `pk${k}${m.userData.glow ?? ''}`;
    m.needsUpdate = true;
  });
}
function fatLine(points, material) {
  const g = new LineGeometry();
  g.setPositions(points.flatMap(p => [p.x, p.y, p.z]));
  const l = new Line2(g, material);
  l.computeLineDistances();
  l.userData.nseg = points.length - 1;
  return l;
}
function drawOn(l, p) { const n = Math.floor(l.userData.nseg * clamp(p)); l.geometry.instanceCount = n; l.visible = n > 0; }
// 居中的 3D 字
function word3d(text, { size = 1, depth = 0.3, material, font = 'anton' }) {
  const g = textGeo(font, text, { size, depth, bevel: size * 0.02, curve: 5 }).clone();
  g.computeBoundingBox();
  const b = g.boundingBox;
  g.translate(-(b.max.x + b.min.x) / 2, -b.min.y, -(b.max.z + b.min.z) / 2);   // 底边中点在原点
  g.computeBoundingBox();
  return new THREE.Mesh(g, material);
}

export async function makeC2(mv, { girl: girl0 = null } = {}) {   // 总装时传入共享的 girl
  const { music, lyrics } = mv;
  const line = prefix => {
    const l = lyrics.lines.find(x => x.start > 55 && x.text.toLowerCase().startsWith(prefix.toLowerCase()));
    if (!l) throw new Error(`c2：找不到歌词「${prefix}」`);
    return l;
  };
  const L = { up: line("I'm upping"), boom: line('I hear'), moon: line('NVDA'), omega: line('The Omega'), flops: line('One E'), safe: line('That was') };
  const kick = (T, d = 0.12) => music.pulse('kick', T, { decay: d });
  const shake = (T, a = 0.02) => { const k = kick(T, 0.1); return [Math.sin(T * 91.7) * k * a, Math.cos(T * 77.3) * k * a]; };
  const girl = girl0 ?? await createGirl(mv);
  const beats = mv.audio.beats;
  const beatAfter = t => beats.find(b => b >= t - 1e-3) ?? t;

  // 共用：夜城 + 城中的铬字 P(DOOM)（和楼一样高）
  function doomCity(scene) {
    const city = createCity({ seed: 12, n: 17 });
    scene.add(city.group);
    const chrome = new THREE.MeshMatcapMaterial({ matcap: chromeMatcap(), color: new THREE.Color(1.5, 1.5, 1.6) });
    const tower = word3d('P(DOOM)', { size: 8, depth: 1.6, material: chrome });   // 立在城后沿，高 8（比最高的楼还高一截）、宽约 26：天际线就是它
    tower.position.z = -10.5;
    tower.geometry.boundingBox.getSize(tower.userData.size = new THREE.Vector3());
    scene.add(tower);
    return { city, tower, top: tower.userData.size.y };
  }

  const shots = [];

  // ================================================================ 58.4 柠黄字卡
  shots.push({
    id: 'c2-slam', t0: 58.4, t1: 59.326,
    build() {
      const scene = scn(PAL.lemon), camera = persp(30);
      const [w0, w1] = L.up.words;
      const words = [{ ...w0, start: 58.25, end: 58.871 }, { ...w1, start: 58.871, end: w1.end }];   // 字卡：第一帧 I'M 已在落地，UPPING 砸在下一拍
      const fx = FX.slam({ words, color: PAL.ink, bg: PAL.lemon, maxW: 25, maxH: 12, maxSize: 9, kick: 2 });
      scene.add(fx.group);
      return { scene, camera, fx };
    },
    update(S, T) {
      S.fx.update(T);
      const [sx, sy] = shake(T, 0.8);
      S.camera.position.set(sx, sy, 40 - (T - 58.4) * 2);
      S.camera.lookAt(0, 0, 0);
      return { scene: S.scene, camera: S.camera, post: { bloom: 0.15, chroma: 0.3 * kick(T), grade: { vignette: 0.2 } } };
    },
  });

  // ================================================================ 59.326 夜城 + P(DOOM) 楼 + 她在楼顶跳
  const pd = L.up.words[3];                       // P(doom) 59.96–60.58
  const lock = beatAfter(pd.start + 0.2);         // 60.235 下拍锁定 0.42
  shots.push({
    id: 'c2-city', t0: 59.326, t1: 60.689,
    build() {
      const scene = scn(PAL.ink), camera = persp(40);
      scene.fog = new THREE.Fog(PAL.ink, 14, 60);
      scene.add(createGirlLights());
      const D = doomCity(scene);
      // 她站的楼：P(DOOM) 前面一排里、偏左的一栋平顶楼
      const cand = D.city.buildings.filter(b => b.h2 === 0 && b.z > 0.5 && b.z < 2.5 && b.x < -1 && b.x > -5);
      const roof = cand.sort((a, b) => b.h1 - a.h1)[0] ?? { x: -3, z: 1, h1: 1.5 };
      // 楼顶翻牌：0.15 → 0.42（颜色随数值升温）
      const flipOld = FX.flip({ rows: [{ text: '0.15', cell: [1.9, 2.7], spinFrom: 59.2, lockTimes: [59.2, 59.2, 59.2, 59.2] }], words: [{ w: '0.15', start: 59.2, end: 60 }], lock: doomColor(0.15), camMove: 'none', tilt: [0, 0, 0], drift: 0 });
      const flipNew = FX.flip({ rows: [{ text: '0.42', cell: [1.9, 2.7], spinFrom: pd.start + 0.05, lockTimes: [lock - 0.24, lock - 0.16, lock - 0.08, lock] }], words: [{ w: '0.42', start: pd.start, end: pd.end }], lock: doomColor(0.42), camMove: 'none', tilt: [0, 0, 0], drift: 0 });
      const fs = 11 / 8.2;
      for (const f of [flipOld, flipNew]) { f.group.scale.setScalar(fs); f.group.position.set(0, D.top + 2.7 * fs / 2 + 0.4, -10.5); scene.add(f.group); }
      const spot = new THREE.Mesh(new THREE.CircleGeometry(0.5, 40), new THREE.MeshBasicMaterial({ color: col(PAL.pink).multiplyScalar(0.6), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      spot.rotation.x = -Math.PI / 2; spot.position.set(roof.x, roof.h1 + 0.01, roof.z); scene.add(spot);
      const b0 = Math.round(girl.beatOf(59.326));
      const choreo = [{ beat: b0 - 1, move: 'hairFlip' }, { beat: b0 + 1, move: 'discoPoint' }, { beat: b0 + 3, move: 'squatJump' }];
      return { scene, camera, D, roof, flipOld, flipNew, choreo };
    },
    update(S, T) {
      const { roof, D } = S;
      S.D.city.update(T, { draw: 1, extrude: 1, light: 1 });
      S.scene.add(girl.root);
      const G = V(roof.x, roof.h1, roof.z);
      girl.root.position.copy(G); girl.root.rotation.set(0, 0.35, 0); girl.root.scale.setScalar(1);
      girl.dance(S.choreo, T);
      girl.setSkin('toon', T);
      const swap = T >= pd.start + 0.05;
      S.flipOld.group.visible = !swap; S.flipNew.group.visible = swap;
      S.flipOld.update(T); S.flipNew.update(T);
      // P(DOOM) 楼在「P(doom)」这个词上长高一截
      const kp = T - pd.start;
      D.tower.scale.set(1, kp < 0 ? 0.82 : 0.82 + 0.18 * eOut(kp / 0.2), 1);
      const cam = S.camera, [sx, sy] = shake(T, 0.02);
      const bA = 59.326, bB = 59.78, bC = lock;
      if (T < bB) {             // A：楼顶低机位仰拍全身，P(DOOM) 巨字压在她身后
        const k = (T - bA) / (bB - bA);
        cam.fov = 46; cam.position.set(G.x + 0.55 + sx, G.y + 0.12 + sy, G.z + 1.7 - 0.2 * k);
        cam.lookAt(G.x + 0.9, G.y + 1.25, G.z - 2);
      } else if (T < bC) {      // B：中景膝上，绕她转半圈，背景从 P(DOOM) 甩到城市灯海
        const k = eInOut((T - bB) / (bC - bB));
        const a = lerp(0.9, -1.4, k);
        cam.fov = 34; cam.position.set(G.x + Math.sin(a) * 1.5 + sx, G.y + 0.62 + sy, G.z + Math.cos(a) * 1.5);
        cam.lookAt(G.x, G.y + 0.62, G.z);
      } else {                  // C：锁定 0.42 那一拍，升臂拉远：P(DOOM) + 数字占满，她在前景楼顶
        const k = eOut((T - bC) / 0.45);
        cam.fov = 40; cam.position.set(lerp(G.x + 1.2, -1.2, k) + sx, lerp(G.y + 0.8, 6, k) + sy, lerp(G.z + 2.2, 21, k));
        cam.lookAt(0, lerp(G.y + 1.5, 7.6, k), lerp(G.z - 2, -8, k));
      }
      cam.updateProjectionMatrix();
      const kl = T - lock;
      const flash = kl >= 0 ? 0.5 * Math.exp(-kl * 9) : 0;
      return { scene: S.scene, camera: cam, post: { bloom: { strength: 0.9, threshold: 0.9 }, chroma: 0.15 + 0.3 * kick(T), grade: { vignette: 0.3 }, flash: { amount: flash, color: doomColor(0.42) } } };
    },
  });

  // ================================================================ 60.689 锁链巨蛇绕楼 + BOOM
  const bw = L.boom.words.at(-1);
  const tBoom = bw.start + Math.min(0.45, Math.max(0.25, (bw.end - bw.start) * 0.5));   // 与 type3d.burst 的爆点一致
  shots.push({
    id: 'c2-snake', t0: 60.689, t1: 62.962, transitionIn: { kind: 'whip', dur: 0.26, dir: 1 },
    build() {
      const scene = scn(PAL.ink), camera = persp(38);
      scene.fog = new THREE.Fog(PAL.ink, 18, 70);
      const D = doomCity(scene);
      D.tower.scale.set(1, 1, 1);
      // 蛇：一节节锁链环，相邻两环互相垂直；粉 / 柠黄交替，发光
      const N = 64;
      const linkGeo = new THREE.TorusGeometry(0.9, 0.27, 10, 24);
      linkGeo.scale(1, 0.62, 1);
      const mA = new THREE.MeshMatcapMaterial({ matcap: chromeMatcap(), color: col(PAL.pink).multiplyScalar(1.5) });
      const mB = new THREE.MeshMatcapMaterial({ matcap: chromeMatcap(), color: col(PAL.lemon).multiplyScalar(1.3) });
      const links = [];
      for (let i = 0; i < N; i++) { const m = new THREE.Mesh(linkGeo, i % 2 ? mB : mA); scene.add(m); links.push(m); }
      const head = new THREE.Mesh(new THREE.ConeGeometry(1.3, 3.6, 4), new THREE.MeshMatcapMaterial({ matcap: chromeMatcap(), color: col(PAL.pink).multiplyScalar(1.7) }));
      head.geometry.rotateX(-Math.PI / 2);   // 尖端朝 -z → 用 lookAt 指向前进方向
      scene.add(head);
      const eyes = [-1, 1].map(s => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), new THREE.MeshBasicMaterial({ color: col(PAL.mint).multiplyScalar(3) })); head.add(e); e.position.set(s * 0.6, 0.45, 0.4); e.scale.setScalar(2); return e; });
      const ring = createShockwave({ radius: 38, color: PAL.paper, accent: PAL.pink });
      ring.mesh.rotation.x = -Math.PI / 2; ring.mesh.position.y = 1.5;
      scene.add(ring.mesh);
      const ov = overlay(scene, camera, 1);
      const fx = FX.burst({ line: L.boom, color: PAL.pink, side: '#7a1043', smallColor: PAL.paper, particles: 900, glow: 1.1 });
      ov.add(fx.group);
      fixPoints(ov);
      return { scene, camera, D, links, head, ring, fx };
    },
    update(S, T) {
      S.D.city.update(T, { draw: 1, extrude: 1, light: 1 });
      S.fx.update(T);
      // 螺旋：绕楼一圈 = 2πR，一边转一边往上爬
      const R = 12, gap = 1.3;
      const path = s => V(Math.cos(s / R) * R, 2.2 + s * 0.11 + 0.6 * Math.sin(s * 0.5), Math.sin(s / R) * R - 2);
      const hs = 30 + (T - 60.689) * 15;
      const q = new THREE.Quaternion(), fw = new THREE.Vector3();
      S.links.forEach((m, i) => {
        const s = hs - (i + 1) * gap;
        const p = path(s), n = path(s + 0.05);
        m.position.copy(p);
        m.lookAt(n);
        m.rotateZ(i % 2 ? Math.PI / 2 : 0);   // 锁链：相邻环互相垂直
        m.visible = s > -40;
      });
      S.head.position.copy(path(hs));
      S.head.lookAt(path(hs + 0.3));
      S.ring.update(T, { t0: tBoom, dur: 1.1 });
      // 相机：在城前方高处横扫
      const k = T - 60.689;
      const a = lerp(0.75, 2.25, k / (62.962 - 60.689));   // 只在城前方扫半圈（别绕到 P(DOOM) 背面）
      const [sx, sy] = shake(T, 0.1);
      S.camera.position.set(Math.cos(a) * 31 + sx, 9 + 1.5 * Math.sin(k * 0.9) + sy, Math.sin(a) * 31 - 2);
      S.camera.lookAt(0, 8.6, -3);   // P(DOOM) 压到画面中下部，顶上那行小字落在它上方的空白里
      const kb = T - tBoom;
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 1.0, threshold: 0.9 }, chroma: 0.15 + 0.3 * kick(T) + (kb > 0 ? 0.8 * Math.exp(-kb * 6) : 0), grade: { vignette: 0.3 } } };
    },
  });

  // ================================================================ 62.962 K 线柱冲天 → 月亮
  const t4 = 62.962, t4e = 64.325;
  const rocketY = T => 1.5 + 44 * Math.pow(clamp((T - t4 + 0.25) / (t4e - t4 + 0.2)), 2.1);
  shots.push({
    id: 'c2-moon', t0: t4, t1: t4e,
    build() {
      const scene = scn('#07070d'), camera = persp(42);
      scene.fog = new THREE.Fog('#07070d', 40, 140);
      // K 线：一排排柱子，涨（薄荷）跌（粉），带影线
      const up = new THREE.MeshBasicMaterial({ color: col(PAL.mint).multiplyScalar(1.3) }), dn = new THREE.MeshBasicMaterial({ color: col(PAL.pink).multiplyScalar(1.2) });
      const box = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
      const wick = new THREE.BoxGeometry(0.12, 1, 0.12).translate(0, 0.5, 0);
      const bars = [];
      for (let r = 0; r < 3; r++) for (let i = -16; i <= 16; i++) {
        if (r === 0 && i === 0) continue;
        const isUp = hash(i, r) < 0.62;
        const m = new THREE.Mesh(box, isUp ? up : dn);
        const w = new THREE.Mesh(wick, isUp ? up : dn);
        const x = i * 1.6, z = -r * 6 - 2;
        m.position.set(x, 0, z); w.position.set(x, 0, z);
        m.scale.set(0.95, 1, 0.95);
        scene.add(m, w);
        bars.push({ m, w, h: 1 + 5 * hash(i, r + 7) + (isUp ? 3 : 0) * Math.exp(-Math.abs(i) / 6), base: 0.3 + 2 * hash(i, r + 3), d: hash(i, r + 11) * 0.5 });
      }
      const grid = new THREE.GridHelper(200, 100, col(PAL.mint).multiplyScalar(0.4), col('#1b1b2a'));
      scene.add(grid);
      // 主柱 = 火箭
      const rocket = new THREE.Mesh(new THREE.BoxGeometry(1.3, 4, 1.3).translate(0, -2, 0), new THREE.MeshBasicMaterial({ color: col(PAL.mint).multiplyScalar(2.2) }));
      scene.add(rocket);
      // 尾迹：固定数量的点，各自有出生时刻（均匀铺在镜头时间上），出生后往下飘散变淡
      const NP = 2600, ppos = new Float32Array(NP * 3), pcol = new Float32Array(NP * 3);
      const pg = new THREE.BufferGeometry();
      pg.setAttribute('position', new THREE.BufferAttribute(ppos, 3));
      pg.setAttribute('color', new THREE.BufferAttribute(pcol, 3));
      const tex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, '#fff'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
      const pm = new THREE.PointsMaterial({ size: 0.9, vertexColors: true, map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
      const trail = new THREE.Points(pg, pm);
      trail.frustumCulled = false;
      scene.add(trail);
      const moon = new THREE.Mesh(new THREE.SphereGeometry(7, 48, 32), new THREE.MeshBasicMaterial({ color: col(PAL.paper).multiplyScalar(1.25) }));
      moon.position.set(3, 56, -34);
      scene.add(moon);
      const craters = [[-2, 2, 1.4], [2.5, -1.5, 1], [0.5, -3.8, 0.8], [-3.6, -1.8, 0.7], [3.5, 3, 0.6]].map(([x, y, r]) => {
        const c = new THREE.Mesh(new THREE.CircleGeometry(r, 24), new THREE.MeshBasicMaterial({ color: col('#bdb6aa') }));
        c.position.set(x, y, 6.9 - (x * x + y * y) / 14); c.lookAt(V(x, y, 6.9).multiplyScalar(2)); moon.add(c); return c;
      });
      // 词留在尾迹上：每个词出现在它开口那一刻火箭所在的高度，左右交替
      const cols = [PAL.lemon, PAL.paper, PAL.paper, PAL.lemon];
      const words = L.moon.words.map((w, i) => {
        const fx = FX.slam({ words: [w], color: cols[i], side: i % 3 ? PAL.mint : PAL.pink, maxW: 24, maxH: 8, maxSize: i === 0 || i === 3 ? 8 : 5, camMove: 'none', tilt: [0, 0, 0], drift: 0, kick: 0.4, glow: 1.2 });
        const hold = new THREE.Group();
        hold.add(fx.group);
        scene.add(hold);
        const s0 = Math.max(w.start, t4);
        return { w, fx, hold, s0, y: rocketY(s0) - 1.2, x: i % 2 ? 4.2 : -4.4 };
      });
      return { scene, camera, bars, rocket, trail, pg, ppos, pcol, pm, moon, words };
    },
    update(S, T) {
      const k = T - t4;
      S.bars.forEach(b => {
        const g = eOut((k - b.d) / 0.6);
        const h = b.h * (0.3 + 0.7 * g);
        b.m.position.y = b.base; b.m.scale.y = h;
        b.w.position.y = b.base - 0.4; b.w.scale.y = h + 1.2;
      });
      const y = rocketY(T);
      S.rocket.position.set(0, y, 0);
      // 尾迹
      const NP = S.ppos.length / 3, cL = col(PAL.lemon), cP = col(PAL.pink), cW = col(PAL.paper);
      for (let j = 0; j < NP; j++) {
        const tb = t4 - 0.25 + (j / NP) * (t4e - t4 + 0.3);
        const age = T - tb;
        if (age < 0 || age > 1.6) { S.ppos[j * 3 + 1] = -999; continue; }
        const y0 = rocketY(tb) - 4;
        const a = hash(j, 1) * Math.PI * 2, sp = 0.6 + 2.2 * hash(j, 2);
        S.ppos[j * 3] = Math.cos(a) * sp * age * 1.4 + (hash(j, 3) - 0.5) * 0.6;
        S.ppos[j * 3 + 1] = y0 - age * (2 + 3 * hash(j, 4));
        S.ppos[j * 3 + 2] = Math.sin(a) * sp * age * 1.4;
        const c = age < 0.15 ? cW : hash(j, 5) < 0.6 ? cL : cP;
        const f = Math.max(0, 1 - age / 1.6) * 1.8;
        S.pcol[j * 3] = c.r * f; S.pcol[j * 3 + 1] = c.g * f; S.pcol[j * 3 + 2] = c.b * f;
      }
      S.pg.attributes.position.needsUpdate = true; S.pg.attributes.color.needsUpdate = true;
      // 相机：地面仰拍，跟着火箭抬头，最后仰到月亮
      const u = clamp(k / (t4e - t4));
      const cam = S.camera;
      cam.position.set(1.5, lerp(2.2, 16, eIn(u)), 34);
      const look = V(0, lerp(y * 0.9, 50, smooth((u - 0.55) / 0.45)), lerp(0, -30, smooth((u - 0.55) / 0.45)));
      cam.lookAt(look);
      cam.updateMatrixWorld();
      for (const W of S.words) {
        W.fx.update(T);
        W.hold.position.set(W.x * 1.3, W.y, 6);   // 在 K 线前面；组缩半，砸入起点不贴镜头
        W.hold.scale.setScalar(0.5);
        W.hold.quaternion.copy(cam.quaternion);   // 词正对镜头
      }
      const hit = T - (t4e - 0.12);
      return { scene: S.scene, camera: cam, post: { bloom: { strength: 1.1, threshold: 0.9 }, chroma: 0.2 + 0.3 * kick(T), grade: { vignette: 0.3 }, flash: { amount: hit > 0 ? 0.3 * hit / 0.12 : 0, color: PAL.lemon } } };
    },
  });

  // ================================================================ 64.325 星座：THE OMEGA / POINT'S，所有星和线汇成一点
  const t5 = 64.325, t5e = 66.598;
  const soon = L.omega.words.at(-1);
  shots.push({
    id: 'c2-omega', t0: t5, t1: t5e,
    build() {
      const scene = scn('#05050b'), camera = persp(36);
      const C = V(0, 0.5, -30);          // 汇聚点
      // 满天星
      const NS = 2200, spos = new Float32Array(NS * 3), sbase = new Float32Array(NS * 3), scol = new Float32Array(NS * 3);
      for (let i = 0; i < NS; i++) {
        const th = hash(i, 1) * Math.PI * 2, ph = Math.acos(2 * hash(i, 2) - 1), r = 60 + 40 * hash(i, 3);
        sbase.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) * 0.8, -Math.abs(r * Math.sin(ph) * Math.sin(th)) - 10], i * 3);
        const c = col([PAL.paper, PAL.paper, PAL.mint, PAL.lemon, PAL.pink][Math.floor(hash(i, 4) * 5)]).multiplyScalar(0.6 + 1.2 * hash(i, 5) ** 3);
        scol.set([c.r, c.g, c.b], i * 3);
      }
      const sg = new THREE.BufferGeometry();
      sg.setAttribute('position', new THREE.BufferAttribute(spos, 3));
      sg.setAttribute('color', new THREE.BufferAttribute(scol, 3));
      const dotTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 32; const g = c.getContext('2d'); const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, '#fff'); gr.addColorStop(0.4, 'rgba(255,255,255,.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 32, 32); return new THREE.CanvasTexture(c); })();
      const stars = new THREE.Points(sg, new THREE.PointsMaterial({ size: 0.9, vertexColors: true, map: dotTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      stars.frustumCulled = false;
      scene.add(stars);
      // 星座字：字形轮廓稀疏取点 = 星，相邻星连线；每个词自己一组，唱到才连
      const rows = [[0, 1], [2]];   // THE OMEGA / POINT'S
      const ws = L.omega.words;
      const size = [2.6, 5.2, 5.2];
      const glyphs = [];
      const lineM = lineMat(col(PAL.mint).multiplyScalar(1.6), 2.5);
      const starM = new THREE.PointsMaterial({ size: 0.55, color: col(PAL.lemon).multiplyScalar(2.2), map: dotTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
      let yRow = 4.6;
      rows.forEach(ids => {
        const txt = ids.map(i => ws[i].w.replace(/[,.]/g, '').toUpperCase());
        const sz = ids.map(i => size[i]);
        const wTot = txt.reduce((a, t, j) => a + advance('bebas', t, sz[j]), 0) + (txt.length - 1) * sz[0] * 0.5;
        let x = -wTot / 2;
        const rowH = Math.max(...sz) * 0.72;
        ids.forEach((wi, j) => {
          const g = new THREE.Group();
          g.position.set(x, yRow - rowH, -30);
          scene.add(g);
          const lines = [], pts = [];
          for (const sh of FONTS.bebas.generateShapes(txt[j], sz[j])) {
            for (const path of [sh, ...sh.holes]) {
              const len = path.getLength(), n = Math.max(4, Math.round(len / 0.9));
              const pp = path.getSpacedPoints(n).map(p => V(p.x, p.y, 0));
              pts.push(...pp.slice(0, -1));
              const l = fatLine(pp, lineM); g.add(l); lines.push(l);
            }
          }
          const pgeo = new THREE.BufferGeometry().setFromPoints(pts);
          const P = new THREE.Points(pgeo, starM); P.frustumCulled = false; g.add(P);
          glyphs.push({ w: ws[wi], g, lines, P, base: g.position.clone() });
          x += advance('bebas', txt[j], sz[j]) + sz[0] * 0.5;
        });
        yRow -= rowH + 1.6;
      });
      // 「coming soon」：底部一行小字
      const tail = FX.typewriter({ words: ws.slice(3), color: PAL.paper, strike: PAL.lemon, caret: PAL.mint, maxW: 14, maxH: 2, maxSize: 1.6 });
      const tailHold = new THREE.Group(); tailHold.position.set(0, -6.4, -30); tailHold.add(tail.group); tail.group.scale.setScalar(1.15);   // 字高 ≥ 画高 5%
      scene.add(tailHold);
      const flare = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 12), new THREE.MeshBasicMaterial({ color: col('#ffffff').multiplyScalar(4) }));
      flare.position.copy(C); scene.add(flare);
      return { scene, camera, stars, spos, sbase, sg, glyphs, tail, tailHold, flare, C };
    },
    update(S, T) {
      const k = T - t5;
      // 汇聚：从「soon」开口起，所有星、所有星座字往一点收
      const g = eIn((T - soon.start) / (t5e - 0.15 - soon.start));
      for (let i = 0; i < S.spos.length; i++) {
        const c = i % 3 === 0 ? S.C.x : i % 3 === 1 ? S.C.y : S.C.z;
        S.spos[i] = lerp(S.sbase[i], c, g);
      }
      S.sg.attributes.position.needsUpdate = true;
      S.glyphs.forEach(G => {
        const wk = G.w.start < t5 ? T - t5 + 0.6 : T - G.w.start;   // 切进来前已开口的词：一进镜头就连好
        const on = wk >= 0;
        G.g.visible = on;
        G.lines.forEach((l, j) => drawOn(l, on ? clamp((wk - j * 0.03) / 0.5) : 0));
        G.P.visible = on;
        G.g.position.copy(G.base).lerp(S.C, g);
        G.g.scale.setScalar(Math.max(0.001, 1 - g));
      });
      S.tail.update(T);
      S.tailHold.visible = g < 0.5;
      S.flare.visible = g > 0.02;
      S.flare.scale.setScalar(0.4 + 6 * g * g + 2 * Math.max(0, Math.sin((T - soon.start) * 20)) * g);
      S.camera.position.set(Math.sin(k * 0.25) * 1.5, 0.3, 8 - k * 1.2);
      S.camera.lookAt(0, 0.5, -30);
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 1.1, threshold: 0.8 }, chroma: 0.12 + 0.2 * kick(T), grade: { vignette: 0.35 } } };
    },
  });

  // ================================================================ 66.598 霓粉 + 翻牌疯转 → 1E30
  shots.push({
    id: 'c2-flops', t0: t5e, t1: 69.78, transitionIn: { kind: 'cut' },
    build() {
      const scene = scn(PAL.pink), camera = persp(30);
      const w = L.flops.words;   // One E thirty FLOPs a second
      const rows = [
        { text: '1E30', cell: [3.6, 5.0], y: 2.5, spinFrom: t5e - 0.1, lockTimes: [66.8, 67.053, 67.28, 67.507] },
        { text: 'FLOPS/SEC', cell: [1.7, 2.4], y: -2.7, lockTimes: [...'FLOPS'].map((_, j) => Math.max(w[3].start, 67.6) + 0.04 * j).concat([Math.max(w[4].start, 67.9)], [...'SEC'].map((_, j) => Math.max(w[5].start, 68.0) + 0.06 * j)) },
      ];
      const fx = FX.flip({ words: w, rows, lock: PAL.lemon, tilt: [-0.18, 0.26, 0.03], camMove: (T, u) => ({ z: 3 * eOut(u), ry: lerp(-0.2, 0.18, smooth(u)) }) });
      scene.add(fx.group);
      return { scene, camera, fx };
    },
    update(S, T) {
      S.fx.update(T);
      // 两个重拍往前顶一下
      let punch = 0;
      for (const d of [67.507, 69.325]) { const kk = T - d; if (kk >= 0) punch += Math.exp(-kk * 7) * 1.8; }
      const [sx, sy] = shake(T, 0.25);
      S.camera.position.set(sx, sy, 40 - punch);
      S.camera.lookAt(0, 0, 0);
      return { scene: S.scene, camera: S.camera, post: { bloom: 0.25, chroma: 0.2 + 0.4 * kick(T), grade: { vignette: 0.25 } } };
    },
  });

  // ================================================================ 69.78 方块高塔摇晃 + SAFE 勾选框；最后一拍抽走一块
  const t7 = 69.78, pull = 74.325;
  const wSafe = L.safe.words.find(x => /safe/i.test(x.w)), wEnough = L.safe.words.find(x => /enough/i.test(x.w));
  shots.push({
    id: 'c2-safe', t0: t7, t1: 74.8,
    build() {
      const scene = scn(PAL.ink), camera = persp(38);
      scene.add(createGirlLights());
      const tower = new THREE.Group();
      scene.add(tower);
      const b0 = Math.round(girl.beatOf(t7));
      const choreo = [{ beat: b0 - 1, move: 'sideClap' }, { beat: b0 + 3, move: 'bodyRoll', intensity: 0.8 }, { beat: b0 + 7, move: 'discoPoint' }];
      const cols = [PAL.paper, PAL.lemon, PAL.paper, PAL.mint, PAL.paper, PAL.pink];
      const mats = cols.map(c => new THREE.MeshMatcapMaterial({ matcap: chromeMatcap(), color: col(c).multiplyScalar(0.95) }));
      const bw = 1.5, bh = 0.5, NL = 16;
      const blocks = [];
      for (let l = 0; l < NL; l++) for (let j = 0; j < 3; j++) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(l % 2 ? bw * 0.31 : bw, bh * 0.94, l % 2 ? bw : bw * 0.31), mats[(l * 3 + j) % mats.length]);
        const off = (j - 1) * bw / 3;
        m.position.set(l % 2 ? off : 0, l * bh + bh / 2, l % 2 ? 0 : off);
        tower.add(m);
        blocks.push({ m, l, j, base: m.position.clone() });
      }
      const pulled = blocks.find(b => b.l === 5 && b.j === 1);
      const grid = new THREE.GridHelper(40, 40, col(PAL.mint).multiplyScalar(0.4), col('#1b1b2a'));
      scene.add(grid);
      // 屏幕层：左边 SAFE 勾选框；顶上一行打字机歌词
      const ov = overlay(scene, camera, 1);
      const box = new THREE.Group(); box.position.set(-13, 0.3, 0); ov.add(box);
      const S = 3.6, sq = [V(-S / 2, -S / 2, 0), V(S / 2, -S / 2, 0), V(S / 2, S / 2, 0), V(-S / 2, S / 2, 0), V(-S / 2, -S / 2, 0)];
      const dense = []; for (let i = 0; i < 4; i++) for (let r = 0; r < 10; r++) dense.push(sq[i].clone().lerp(sq[i + 1], r / 10)); dense.push(sq[4]);
      const frame = fatLine(dense, lineMat(col(PAL.paper).multiplyScalar(1.2), 5)); box.add(frame);
      const tickPts = []; const tk = [V(-1.1, 0.05, 0), V(-0.25, -0.95, 0), V(1.35, 1.25, 0)];
      for (let i = 0; i < 2; i++) for (let r = 0; r < 12; r++) tickPts.push(tk[i].clone().lerp(tk[i + 1], r / 12)); tickPts.push(tk[2]);
      const tick = fatLine(tickPts, lineMat(col(PAL.lemon).multiplyScalar(1.8), 9)); tick.position.z = 0.1; box.add(tick);
      const label = word3d('SAFE', { size: 3.4, depth: 0.5, material: [new THREE.MeshBasicMaterial({ color: PAL.paper }), new THREE.MeshMatcapMaterial({ matcap: chromeMatcap(), color: col(PAL.mint) })], font: 'anton' });
      label.position.set(0, -S / 2 - 4.3, 0); box.add(label);
      const words = L.safe.words;
      const tw = FX.typewriter({ words, color: PAL.paper, strike: PAL.lemon, caret: PAL.mint, maxW: 34, maxH: 2.4, maxSize: 1.8 });
      tw.group.position.set(0, 8.4, 0); ov.add(tw.group);
      // 纸条底：字和勾选框压在塔上时也读得清（字不压图）
      const plate = (w, h, x, y) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: PAL.ink, transparent: true, opacity: 0.82, depthWrite: false })); m.position.set(x, y, -0.2); ov.add(m); return m; };
      const twPlate = plate(38.2, 2.9, 0, 8.45);
      const boxPlate = plate(9.2, 11.8, -13, -2.2);
      return { scene, camera, tower, blocks, pulled, box, frame, tick, label, tw, choreo, twPlate, boxPlate };
    },
    update(S, T) {
      const k = T - t7;
      // 摇晃：幅度越来越大；抽走一块之后开始倒
      const kp = T - pull;
      const amp = 0.02 + 0.05 * smooth(k / 4.3);
      const sway = amp * Math.sin(k * 3.6) + 0.4 * amp * Math.sin(k * 7.9 + 1);
      const fall = kp > 0.15 ? 0.5 * eIn((kp - 0.15) / 0.6) : 0;
      S.tower.rotation.set(0.3 * sway, 0, sway + fall);
      S.blocks.forEach(b => {
        const wob = Math.sin(k * 5 + b.l * 0.7) * 0.02 * b.l / 16 * (1 + 3 * smooth(k / 4.3));
        b.m.position.set(b.base.x + wob, b.base.y, b.base.z);
      });
      if (kp > 0) { const p = eInOut(kp / 0.3); S.pulled.m.position.z = S.pulled.base.z + p * 2.6; }
      // 勾选框：「safe」出现（框弹入），「enough」打勾
      const ks = T - Math.max(wSafe.start, t7);
      S.box.visible = ks >= 0;
      S.box.scale.setScalar(Math.max(0.001, ks >= 0 ? 1 + 0.25 * Math.exp(-ks * 8) * Math.cos(ks * 30) : 0));
      drawOn(S.frame, ks / 0.25);
      drawOn(S.tick, (T - wEnough.start) / 0.3);
      S.label.visible = ks > 0.05;
      S.boxPlate.visible = ks >= 0;
      S.tw.update(T);
      // 她在塔旁跳；塔倒时（抽块后）她往右跳开
      const GX = 2.5, GZ = 1.5, jumpT = pull + 0.12;
      S.scene.add(girl.root);
      const kj = T - jumpT;
      const pj = clamp(kj / 0.55);
      girl.root.position.set(GX + 2.2 * eOut(pj), kj > 0 ? 1.3 * Math.sin(Math.PI * pj) : 0, GZ + 0.4 * pj);
      girl.root.rotation.set(0, -0.45 + (kj > 0 ? -0.6 * pj : 0), 0);
      girl.root.scale.setScalar(2);
      if (kj > 0 && pj < 1) girl.pose('airborne'); else girl.dance(S.choreo, T);
      girl.setSkin('toon', T);
      const G = girl.root.position;
      // 机位：A 3/4 中景（她 + 摇晃的塔）→ B 绕她转的中近景 → C 低机位仰拍全身，塔压在身后、倒下时她跳开
      const cam = S.camera, [sx, sy] = shake(T, 0.03);
      const dA = 71.143, dB = 72.961;
      if (T < dA) {
        const k2 = (T - t7) / (dA - t7);
        cam.fov = 38; cam.position.set(lerp(7.5, 6.6, k2) + sx, 2.6 + sy, lerp(9.5, 8.6, k2));
        cam.lookAt(0.9, 3.0, 0);
      } else if (T < dB) {
        const k2 = eInOut((T - dA) / (dB - dA));
        const a = lerp(0.9, -0.5, k2);
        cam.fov = 36; cam.position.set(GX + Math.sin(a) * 4.2 + sx, 1.9 + sy, GZ + Math.cos(a) * 4.2);
        cam.lookAt(GX - 0.3, 1.8, GZ - 0.5);
      } else {
        const k2 = (T - dB) / (74.8 - dB);
        cam.fov = 46; cam.position.set(GX + 1.0 + (kj > 0 ? 1.2 * eOut(pj) : 0) + sx, 0.35 + sy, GZ + 3.2 - 0.3 * k2);
        cam.lookAt(GX - 0.6 + (kj > 0 ? 1.4 * eOut(pj) : 0), 2.3, GZ - 3);
      }
      cam.updateProjectionMatrix();
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.8, threshold: 1.0 }, chroma: 0.12 + 0.25 * kick(T), grade: { vignette: 0.3 } } };
    },
  });

  return shots;
}

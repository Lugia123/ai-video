// shots/c4.js — 副歌 4 + 尾声（歌曲时间 123.9–156.65 s），分镜见 TREATMENT.md §4「副歌 4」「尾声」。
//
//   const shots = await makeC4(mv);   // 需要先 await initType3D()
//   mv.mount(shots, { offset: 123.9, duration: 32.75 });
//
// 切点（都在拍上）：
//   123.900 c4-hot       白热的 P(DOOM) 天际线，城市化成粒子往上升；她在楼顶跳；0.81 → 0.99（125.686 下拍锁定）
//   126.141 c4-loom      光线像织布一样一行行来回织，织出她的剪影；JUST AS FORETOLD BY LOOM 被织进布里
//   127.958 c4-mask      满屏报纸格，[MASK] 黑块逐个翻开
//   130.231 c4-droste    德罗斯特递归画中画：框里是她和这句歌词，再框里还是
//   132.049 c4-door      全片最静：巨门缝透白光，她 chrome 背影，手写字慢慢浮现
//   137.049 c4-stage     门开 → 镜头急拉：门、城都是舞台上的微缩模型，聚光灯打她；顶上霓虹灯牌 WAS IT ALL FOR SHOW?
//   140.230 尾声：终场大舞（她 + 万花筒镜像），每小节下拍闪回一拍前面的母题
//           （巨眼 / 蓝图 / FOOM / 回形针 / GPU 麦浪），「oh」变成气泡上升；
//   149.776 c4-nan       巨型铬字 P(DOOM) + 数字 0.99 乱跳 → 150.231 锁成 NaN → 停两拍 → 151.139 整块炸成烟花
//   152.048 c4-eye       她的右眼（全息近景），152.3–153.55 睁眼、瞳孔里是夜城 → 眨眼 → 黑
//   153.866 c4-card      片尾字卡（歌名 + 署名），停到 156.65，音乐自然收尾
// 所有 update 都是 T 的纯函数。

import * as THREE from 'three';
import { PALETTE as PAL, doomColor } from '../engine/palette.js';
import { FX, FONTS, textGeo, advance, lineMat, layout, fitLayout, samplePoints } from '../kits/type3d.js';
import { createCity, createEye, createPaperclips, createGpuField, chromeMatcap } from '../kits/world.js';
import { createShockwave, createDroste } from '../kits/vfx.js';
import { createGirl, createGirlLights, kaleido } from '../kits/girl.js';
import { createHolo } from '../kits/hologram.js';
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

function persp(fov = 30) { return new THREE.PerspectiveCamera(fov, 16 / 9, 0.05, 900); }
function scn(bg = PAL.ink) { const s = new THREE.Scene(); s.background = col(bg); return s; }
// 屏幕层：挂在相机前 d 处，内部坐标 = type3d 取景（fov30、z=40 → 可视 38.1 × 21.44）。相机 fov 变了要重新 fitOverlay
function overlay(scene, camera, d = 1) {
  const g = new THREE.Group();
  g.position.z = -d;
  g.userData.d = d;
  camera.add(g);
  scene.add(camera);
  fitOverlay(g, camera);
  return g;
}
function fitOverlay(g, camera) {
  const d = g.userData.d;
  g.scale.setScalar((2 * d * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / 21.44);
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
function circlePts(r, n = 64) { const a = []; for (let i = 0; i <= n; i++) a.push(V(Math.cos(i / n * Math.PI * 2) * r, Math.sin(i / n * Math.PI * 2) * r, 0)); return a; }
function word3d(text, { size = 1, depth = 0.3, material, font = 'anton' }) {
  const g = textGeo(font, text, { size, depth, bevel: depth ? size * 0.02 : 0, curve: 5 }).clone();
  g.computeBoundingBox();
  const b = g.boundingBox;
  g.translate(-(b.max.x + b.min.x) / 2, -b.min.y, -(b.max.z + b.min.z) / 2);   // 底边中点在原点
  g.computeBoundingBox();
  return new THREE.Mesh(g, material);
}
function dotTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, '#fff'); gr.addColorStop(0.45, 'rgba(255,255,255,.75)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export async function makeC4(mv, { girl: girl0 = null, holo: holo0 = null } = {}) {   // 总装时传入共享的 girl / holo
  const { music, lyrics } = mv;
  const renderer = mv.stage.renderer;
  const line = prefix => {
    const l = lyrics.lines.find(x => x.start > 120 && x.text.toLowerCase().startsWith(prefix.toLowerCase()));
    if (!l) throw new Error(`c4：找不到歌词「${prefix}」`);
    return l;
  };
  const L = { up: line("I'm upping"), loom: line('Just as'), mask: line('From masked'), rec: line('To recursive'), ilya: line('What did'), show: line('Was it') };
  const kick = (T, d = 0.12) => music.pulse('kick', T, { decay: d });
  const shake = (T, a = 0.02) => { const k = kick(T, 0.1); return [Math.sin(T * 91.7) * k * a, Math.cos(T * 77.3) * k * a]; };
  const girl = girl0 ?? await createGirl(mv);
  const kal = kaleido(girl, { copies: 8 });
  const holo = holo0 ?? await createHolo(mv, { height: 6, base: false });
  const DOT = dotTexture();
  const b0 = Math.round(girl.beatOf(140.23));
  const OUTRO = [
    { beat: b0 - 40, move: 'sideClap' }, { beat: b0 - 36, move: 'discoPoint' }, { beat: b0 - 32, move: 'hairFlip' },
    { beat: b0, move: 'glowWave' }, { beat: b0 + 4, move: 'step' }, { beat: b0 + 8, move: 'bodyRoll', intensity: 0.8 },
    { beat: b0 + 12, move: 'sideClap' }, { beat: b0 + 16, move: 'discoPoint' }, { beat: b0 + 20, move: 'spin' },
    { beat: b0 + 24, move: 'hairFlip' }, { beat: b0 + 28, move: 'squatJump' },
  ];
  const putGirl = (scene, { x = 0, y = 0, z = 0, yaw = 0, s = 1 } = {}) => {
    scene.add(girl.root);
    girl.root.position.set(x, y, z); girl.root.rotation.set(0, yaw, 0); girl.root.scale.setScalar(s);
  };
  const shots = [];

  // ================================================================ 123.9 白热 P(DOOM) + 城化粒子上升 + 她在楼顶跳
  const pd = L.up.words[3];                  // P(doom) 125.4–126.12
  const lockHot = 125.686;                   // 下拍锁定 0.99
  shots.push({
    id: 'c4-hot', t0: 123.9, t1: 126.141,
    build() {
      const scene = scn(PAL.ink), camera = persp(40);
      scene.fog = new THREE.Fog(PAL.ink, 16, 70);
      scene.add(createGirlLights());
      const city = createCity({ seed: 12, n: 17 });
      scene.add(city.group);
      const hot = new THREE.MeshMatcapMaterial({ matcap: chromeMatcap(), color: new THREE.Color(2.3, 2.1, 1.9) });
      const tower = word3d('P(DOOM)', { size: 8, depth: 1.6, material: hot });
      tower.position.z = -10.5;
      scene.add(tower);
      const top = tower.geometry.boundingBox.max.y;
      const fl = (text, spinFrom, lockTimes, lockColor) => FX.flip({ rows: [{ text, cell: [1.9, 2.7], spinFrom, lockTimes }], words: [{ w: text, start: spinFrom, end: spinFrom + 1 }], lock: lockColor, camMove: 'none', tilt: [0, 0, 0], drift: 0 });
      const flipOld = fl('0.81', 123.5, [123.5, 123.5, 123.5, 123.5], doomColor(0.81));
      const flipNew = fl('0.99', pd.start + 0.05, [lockHot - 0.24, lockHot - 0.16, lockHot - 0.08, lockHot], doomColor(0.99));
      const fs = 11 / 8.2;
      for (const f of [flipOld, flipNew]) { f.group.scale.setScalar(fs); f.group.position.set(0, top + 2.7 * fs / 2 + 0.4, -10.5); scene.add(f.group); }
      // 城化粒子：从楼体里冒出、往上飘、散开（每粒有自己的出生时刻，越往后越多）
      const NP = 5000, pos = new Float32Array(NP * 3), cl = new Float32Array(NP * 3), seed = [];
      const pal = [col(PAL.lemon), col(PAL.paper), col(PAL.pink), col(PAL.mint)];
      const bl = city.buildings;
      for (let i = 0; i < NP; i++) {
        const b = bl[Math.floor(hash(i, 1) * bl.length)];
        seed.push({ x: b.x + (hash(i, 2) - 0.5) * b.w, z: b.z + (hash(i, 3) - 0.5) * b.d, y: hash(i, 4) * b.h1, born: 124.3 + 1.8 * Math.sqrt(hash(i, 5)), v: 1.5 + 3 * hash(i, 6), sw: hash(i, 7) * 6.28 });
        const c = pal[Math.floor(hash(i, 8) * 4)];
        cl.set([c.r * 1.6, c.g * 1.6, c.b * 1.6], i * 3);
      }
      const pg = new THREE.BufferGeometry();
      pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      pg.setAttribute('color', new THREE.BufferAttribute(cl, 3));
      const pts = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.16, vertexColors: true, map: DOT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      pts.frustumCulled = false;
      scene.add(pts);
      const cand = bl.filter(b => b.h2 === 0 && b.z > 0.5 && b.z < 2.5 && b.x < -1 && b.x > -5);
      const roof = cand.sort((a, b) => b.h1 - a.h1)[0] ?? { x: -3, z: 1, h1: 1.5 };
      return { scene, camera, city, tower, top, flipOld, flipNew, pts, pg, pos, seed, roof };
    },
    update(S, T) {
      S.city.update(T, { draw: 1, extrude: 1, light: 1 - 0.4 * smooth((T - 124.5) / 1.6) });
      for (let i = 0; i < S.seed.length; i++) {
        const s = S.seed[i], a = T - s.born;
        if (a < 0) { S.pos[i * 3 + 1] = -999; continue; }
        S.pos[i * 3] = s.x + Math.sin(a * 1.3 + s.sw) * 0.4 * a;
        S.pos[i * 3 + 1] = s.y + s.v * a + 0.6 * a * a;
        S.pos[i * 3 + 2] = s.z + Math.cos(a * 1.1 + s.sw) * 0.4 * a;
      }
      S.pg.attributes.position.needsUpdate = true;
      const swap = T >= pd.start + 0.05;
      S.flipOld.group.visible = !swap; S.flipNew.group.visible = swap;
      S.flipOld.update(T); S.flipNew.update(T);
      // 白热：锁定 0.99 时再烫一档
      const heat = 2.1 + 0.9 * smooth((T - lockHot) / 0.3);
      S.tower.material.color.setRGB(heat * 1.08, heat, heat * 0.92);
      const G = V(S.roof.x, S.roof.h1, S.roof.z);
      putGirl(S.scene, { x: G.x, y: G.y, z: G.z, yaw: 0.35 });
      girl.dance(OUTRO, T);
      girl.setSkin('toon', T);
      const cam = S.camera, [sx, sy] = shake(T, 0.03);
      const bA = 124.777;
      if (T < bA) {             // A：高空斜俯，白热天际线 + 粒子开始升
        const k = (T - 123.9) / (bA - 123.9);
        cam.fov = 40; cam.position.set(lerp(-9, -6, k) + sx, lerp(12, 10.5, k) + sy, lerp(20, 18, k));
        cam.lookAt(0, 5.5, -6);
      } else if (T < lockHot) { // B：楼顶低机位仰拍全身，白热 P(DOOM) 压在身后
        const k = (T - bA) / (lockHot - bA);
        cam.fov = 46; cam.position.set(G.x + 0.55 + sx, G.y + 0.14 + sy, G.z + 1.75 - 0.2 * k);
        cam.lookAt(G.x + 0.9, G.y + 1.25, G.z - 2);
      } else {                  // C：锁定那一拍，镜头仰起、拉远到数字
        const k = eOut((T - lockHot) / 0.45);
        cam.fov = 40; cam.position.set(lerp(G.x + 1.2, 1, k) + sx, lerp(G.y + 0.8, 5, k) + sy, lerp(G.z + 2.2, 19, k));
        cam.lookAt(0, lerp(G.y + 1.6, 10, k), lerp(G.z - 2, -9, k));
      }
      cam.updateProjectionMatrix();
      const kl = T - lockHot;
      return { scene: S.scene, camera: cam, post: { bloom: { strength: 1.1, threshold: 0.9 }, chroma: 0.15 + 0.3 * kick(T), grade: { vignette: 0.3, warmth: 0.1 }, flash: { amount: kl >= 0 ? 0.6 * Math.exp(-kl * 8) : 0, color: '#ffffff' } } };
    },
  });

  // ================================================================ 126.141 织布：光线一行行织出她的剪影，字被织进去
  const tLoom = 126.141, tLoomE = 127.958;
  shots.push({
    id: 'c4-loom', t0: tLoom, t1: tLoomE,
    build() {
      const scene = scn('#07070d'), camera = persp(30);
      camera.position.set(0, 0, 40);
      // 蒙版：她的剪影（白）+ 每个词（B 通道 = 词号）各渲一张小图，读回 CPU
      const R = 120, C = 214, W = 38.1, H = 21.44;
      const rt = new THREE.WebGLRenderTarget(C, R);
      const mcam = persp(30); mcam.position.set(0, 0, 40); mcam.lookAt(0, 0, 0);
      const read = () => { const buf = new Uint8Array(C * R * 4); renderer.readRenderTargetPixels(rt, 0, 0, C, R, buf); return buf; };
      const prevRT = renderer.getRenderTarget();
      // 她：reachUp 定格，站在画面左 1/3
      const gs = scn('#000000');
      gs.add(girl.root);
      girl.root.position.set(0, 0, 0); girl.root.rotation.set(0, 0.25, 0); girl.root.scale.setScalar(1);
      girl.pose('reachUp'); girl.setSkin('toon', tLoom);
      girl.root.updateMatrixWorld(true);
      const gcam = persp(30); gcam.position.set(0.72, 0.6, 3.3); gcam.lookAt(0.72, 0.6, 0);   // 她在画面左三分之一，全身连举起的手都在画内
      gs.overrideMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff' });
      renderer.setRenderTarget(rt); renderer.setClearColor('#000000', 1); renderer.clear(); renderer.render(gs, gcam);
      const gm = read();
      // 字：右侧两行
      const ts = scn('#000000');
      const words = L.loom.words.map((w, i) => ({ ...w, i, text: w.w.replace(/[,.]/g, '').toUpperCase() }));
      const Lt = fitLayout(words, { font: 'bebas', maxW: 17, maxH: 12, maxSize: 5.2 });
      Lt.items.forEach(it => {
        const m = new THREE.Mesh(textGeo('bebas', it.text, { size: it.s }), new THREE.MeshBasicMaterial({ color: new THREE.Color(0, 1, (it.i + 1) / 10) }));
        m.material.toneMapped = false;
        m.position.set(it.x + 8.6, it.y, 0);
        ts.add(m);
      });
      renderer.setRenderTarget(rt); renderer.clear(); renderer.render(ts, mcam);
      const tm = read();
      renderer.setRenderTarget(prevRT);
      rt.dispose();
      // 织线：每行一根粗线（Line2 + 逐顶点色）；剪影处霓粉、布底薄荷暗纹。字的格子单独一层，唱到才亮
      const px = W / C, py = H / R;
      const rowMat = lineMat('#ffffff', 1080 / R * 0.82); rowMat.vertexColors = true;
      const txtMat = lineMat(col(PAL.lemon).multiplyScalar(2.2), 1080 / R * 0.82);
      const rows = [], txt = [];
      const cP = col(PAL.pink).multiplyScalar(1.5), cA = col(PAL.mint).multiplyScalar(0.3), cB = col(PAL.mint).multiplyScalar(0.14);
      for (let r = 0; r < R; r++) {
        const y = -H / 2 + (r + 0.5) * py;
        const pts = [], cs = [];
        for (let c = 0; c <= C; c++) {
          const cc = Math.min(C - 1, c);
          const g = gm[(r * C + cc) * 4] > 128;
          const k = g ? cP : ((c + r) % 2 ? cA : cB);
          pts.push(-W / 2 + c * px, y, 0); cs.push(k.r, k.g, k.b);
        }
        // 偶数行从左往右织，奇数行从右往左（梭子来回）
        if (r % 2) { const rp = [], rc = []; for (let c = C; c >= 0; c--) { rp.push(pts[c * 3], pts[c * 3 + 1], 0); rc.push(cs[c * 3], cs[c * 3 + 1], cs[c * 3 + 2]); } pts.splice(0, pts.length, ...rp); cs.splice(0, cs.length, ...rc); }
        const geo = new LineGeometry(); geo.setPositions(pts); geo.setColors(cs);
        const l = new Line2(geo, rowMat); l.computeLineDistances(); l.userData.nseg = C;
        scene.add(l);
        rows.push({ l, r, start: tLoom - 0.3 + (r / R) * 0.65 });   // 切进来时已织了约三分之一，第一帧不黑
        // 字：本行里每个词的连续格子段
        let c = 0;
        while (c < C) {
          const id = tm[(r * C + c) * 4 + 1] > 128 ? Math.round(tm[(r * C + c) * 4 + 2] / 255 * 10) - 1 : -1;
          if (id < 0) { c++; continue; }
          let e = c;
          while (e + 1 < C && tm[(r * C + e + 1) * 4 + 1] > 128) e++;
          const seg = fatLine([V(-W / 2 + c * px, y, 0.01), V(-W / 2 + (e + 1) * px, y, 0.01)], txtMat);
          seg.userData.nseg = 1;
          scene.add(seg);
          txt.push({ l: seg, w: words[Math.max(0, Math.min(words.length - 1, id))], x: c / C, r });
          c = e + 1;
        }
      }
      // 梭子：一粒亮点跟着当前在织的那一行跑
      const shuttle = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), new THREE.MeshBasicMaterial({ color: col(PAL.lemon).multiplyScalar(3) }));
      scene.add(shuttle);
      return { scene, camera, rows, txt, shuttle, W, H, py };
    },
    update(S, T) {
      const dur = 0.22;
      let head = null;
      for (const R of S.rows) {
        const p = (T - R.start) / dur;
        drawOn(R.l, p);
        if (p > 0 && p < 1) head = R;
      }
      for (const t of S.txt) {
        const rowP = (T - S.rows[t.r].start) / dur;
        t.l.visible = T >= t.w.start && rowP >= (t.r % 2 ? 1 - t.x : t.x);
      }
      S.shuttle.visible = !!head;
      if (head) {
        const p = clamp((T - head.start) / dur);
        const x = (head.r % 2 ? 1 - p : p) * S.W - S.W / 2;
        S.shuttle.position.set(x, -S.H / 2 + (head.r + 0.5) * S.py, 0.3);
      }
      const k = T - tLoom;
      S.camera.position.set(Math.sin(k * 0.6) * 0.8, 0, 40 - 2.2 * k);
      S.camera.lookAt(0, 0, 0);
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.9, threshold: 0.9 }, chroma: 0.12 + 0.2 * kick(T), grade: { vignette: 0.35 } } };
    },
  });

  // ================================================================ 127.958 [MASK] 逐个揭开
  shots.push({
    id: 'c4-mask', t0: tLoomE, t1: 130.231,
    build() {
      const scene = scn(PAL.paper), camera = persp(30);
      const fx = FX.mask({ line: L.mask, maxW: 30, maxH: 9, maxSize: 5.2 });
      scene.add(fx.group);
      return { scene, camera, fx };
    },
    update(S, T) {
      S.fx.update(T);
      const k = T - tLoomE;
      S.camera.position.set(-1.2 + 0.9 * k, 0.4, 40 - 1.8 * k);
      S.camera.lookAt(0, 0, 0);
      return { scene: S.scene, camera: S.camera, post: { bloom: 0.1, grade: { vignette: 0.25 } } };
    },
  });

  // ================================================================ 130.231 德罗斯特：框里是她 + 这句歌词，再框里还是
  const tDro = 130.231, tDroE = 132.049;
  shots.push({
    id: 'c4-droste', t0: tDro, t1: tDroE,
    build() {
      // 画中画的内容：霓粉底上她（toon）中景跳舞 + 底下一行字
      const inner = scn(PAL.pink);
      inner.add(createGirlLights());
      const icam = persp(30); icam.position.set(0.1, 0.55, 3.1); icam.lookAt(0.1, 0.55, 0);
      const ov = overlay(inner, icam, 1);
      const fx = FX.slam({ line: L.rec, color: PAL.ink, bg: PAL.pink, maxW: 32, maxH: 2.6, maxSize: 2.8, camMove: 'none', kick: 0.6 });
      fx.group.position.y = 7.6;
      ov.add(fx.group);
      const rt = new THREE.WebGLRenderTarget(1280, 720, { type: THREE.HalfFloatType, samples: 4 });
      const scene = scn(PAL.ink), camera = persp(30);
      const dro = createDroste({ texture: rt.texture, width: 16, height: 9, scale: 0.44, frame: PAL.lemon });
      scene.add(dro.mesh);
      camera.position.set(0, 0, 4.5 / Math.tan(THREE.MathUtils.degToRad(15)));
      camera.lookAt(0, 0, 0);
      return { scene, camera, inner, icam, fx, rt, dro };
    },
    update(S, T) {
      putGirl(S.inner, { x: -1.22, yaw: 0.35 });
      girl.dance(OUTRO, T);
      girl.setSkin('toon', T);
      S.fx.update(T);
      const prev = renderer.getRenderTarget();
      renderer.setRenderTarget(S.rt); renderer.render(S.inner, S.icam); renderer.setRenderTarget(prev);
      const k = T - tDro;
      S.dro.update(T, { zoom: 0.25 + k * 0.75, spin: 0.1 });
      return { scene: S.scene, camera: S.camera, post: { bloom: 0.2, chroma: 0.15 + 0.3 * kick(T), grade: { vignette: 0.3 } } };
    },
  });

  // ================================================================ 132.049 巨门缝透白光，她 chrome 背影，手写字慢慢浮现
  const tDoor = 132.049, tOpen = 137.049;
  function buildDoorWorld(scene) {
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ color: '#08080d', roughness: 0.3, metalness: 0.6 }));
    floor.rotation.x = -Math.PI / 2; scene.add(floor);
    const slabM = new THREE.MeshStandardMaterial({ color: '#15151e', roughness: 0.6, metalness: 0.3 });
    const doors = [-1, 1].map(s => {
      const hinge = new THREE.Group(); hinge.position.set(s * 6.2, 0, -12); scene.add(hinge);
      const slab = new THREE.Mesh(new THREE.BoxGeometry(6, 18, 1), slabM);
      slab.position.set(-s * 3.02, 9, 0); hinge.add(slab);
      return { hinge, s };
    });
    const light = new THREE.Mesh(new THREE.PlaneGeometry(12, 18), new THREE.MeshBasicMaterial({ color: new THREE.Color(4, 4, 3.8) }));
    light.position.set(0, 9, -12.8); scene.add(light);
    // 门缝的光带铺到地上
    const spill = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.6, 1.5), transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
    spill.rotation.x = -Math.PI / 2; spill.position.set(0, 0.01, -6); scene.add(spill);
    return { doors, light, spill };
  }
  const setDoor = (D, open, glow = 1) => {
    D.light.material.color.setScalar(4 * glow);
    D.light.visible = glow > 0.02;
    D.doors.forEach(d => { d.hinge.rotation.y = d.s * -open * 1.35; });
    const gap = 0.36 + open * 11;
    D.spill.scale.set(gap * 1.1, 12 + open * 30, 1);
    D.spill.position.z = -12 + (12 + open * 30) / 2;
    D.spill.material.opacity = (0.35 + 0.4 * open) * glow;
    D.spill.visible = glow > 0.02;
  };
  shots.push({
    id: 'c4-door', t0: tDoor, t1: tOpen,
    build() {
      const scene = scn('#040406'), camera = persp(38);
      scene.add(createGirlLights({ key: 1.2, rim: 3.0, fill: 0.4 }));
      const D = buildDoorWorld(scene);
      const ov = overlay(scene, camera, 1);
      const fx = FX.whisper({ line: L.ilya, maxW: 18, maxH: 9, maxSize: 4.2 });   // 字高 ≥ 画高 6%
      fx.group.position.set(-10.6, 4.6, 0);
      ov.add(fx.group);
      return { scene, camera, D, fx, ov };
    },
    update(S, T) {
      setDoor(S.D, 0);
      putGirl(S.scene, { x: 0, z: -3.5, yaw: Math.PI, s: 3 });
      girl.pose('lookUp');
      girl.setSkin('chrome', T);
      S.fx.update(T);
      // 全片最静：极慢地推近、略微绕到右后方
      const k = (T - tDoor) / (tOpen - tDoor);
      S.camera.fov = 38;
      S.camera.position.set(lerp(-0.6, 0.9, k), lerp(1.6, 2.4, k), lerp(9, 5.2, smooth(k)));
      S.camera.lookAt(0, lerp(4.2, 4.8, k), -12);
      fitOverlay(S.ov, S.camera);
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 1.2, threshold: 1.0, radius: 0.9 }, grade: { vignette: 0.45, saturation: 0.9 } } };
    },
  });

  // ================================================================ 137.049 门开 → 急拉：一切都是舞台上的微缩模型
  const tPull = 137.504;
  shots.push({
    id: 'c4-stage', t0: tOpen, t1: 140.23,
    build() {
      const scene = scn('#040406'), camera = persp(38);
      scene.add(createGirlLights({ key: 1.2, rim: 3.0, fill: 0.5 }));
      const D = buildDoorWorld(scene);
      // 舞台：圆台 + 台口两侧粉色幕布 + 城市模型围在门后 + 聚光灯锥
      const stage = new THREE.Mesh(new THREE.CylinderGeometry(34, 35, 2, 96), new THREE.MeshStandardMaterial({ color: '#1a1420', roughness: 0.5 }));
      stage.position.y = -1; scene.add(stage);
      const edge = fatLine(circlePts(34.2, 128).map(p => V(p.x, 0.02, p.y)), lineMat(col(PAL.lemon).multiplyScalar(1.6), 3));
      scene.add(edge);
      const city = createCity({ seed: 3, n: 17 });
      city.group.scale.setScalar(2.2); city.group.position.set(0, 0, -30);
      scene.add(city.group);
      const curtM = new THREE.MeshStandardMaterial({ color: '#8a0f45', roughness: 0.8 });
      [-1, 1].forEach(s => {
        for (let i = 0; i < 9; i++) {
          const c = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 90, 16, 1, true, 0, Math.PI), curtM);
          c.position.set(s * (40 + i * 2.8), 44, 6 - i * 0.6); c.rotation.y = s > 0 ? Math.PI : 0; scene.add(c);
        }
      });
      const valance = new THREE.Mesh(new THREE.BoxGeometry(140, 10, 2), curtM); valance.position.set(0, 76, 6); scene.add(valance);
      const cone = new THREE.Mesh(new THREE.ConeGeometry(4.2, 60, 48, 1, true), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.3, 1.25, 1.1), transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      cone.position.set(0, 30, -3.5); scene.add(cone);
      const pool = new THREE.Mesh(new THREE.CircleGeometry(4.2, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.4, 1.35, 1.2), transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }));
      pool.rotation.x = -Math.PI / 2; pool.position.set(0, 0.03, -3.5); scene.add(pool);
      // 舞台顶灯牌：霓虹空心字 WAS IT ALL FOR SHOW?
      const sign = FX.outline({ line: L.show, colors: [PAL.pink, PAL.lemon, PAL.mint], widths: [5, 3, 2], maxW: 34, maxH: 7, maxSize: 7, camMove: 'none', tilt: [0, 0, 0], depth: 1.4, glow: 1.6 });
      sign.group.position.set(0, 25, -9);
      sign.group.scale.setScalar(1.15);
      scene.add(sign.group);
      return { scene, camera, D, sign, city };
    },
    update(S, T) {
      const ko = T - tOpen;
      setDoor(S.D, eOut(ko / 0.5), 1 - smooth((ko - 0.25) / 0.5));
      S.city.update(T, { draw: 1, extrude: 1, light: 1 });
      putGirl(S.scene, { x: 0, z: -3.5, yaw: Math.PI - 0.8 * smooth((T - 138) / 1.2), s: 3 });
      girl.pose(T < 138 ? 'lookUp' : 'reachUp');
      girl.setSkin('chrome', T);
      S.sign.update(T);
      // 急拉：从她背后贴近处，一口气拉到高处俯瞰整个舞台
      const k = eOut((T - tPull) / 1.1);
      const cam = S.camera;
      cam.fov = lerp(38, 34, k);
      cam.position.set(lerp(0.9, 0, k), lerp(2.4, 24, k), lerp(5.2, 58, k));
      cam.lookAt(0, lerp(4.8, 12, k), lerp(-12, -10, k));
      cam.updateProjectionMatrix();
      const fl = ko < 0.6 ? 0.55 * Math.sin(Math.PI * clamp(ko / 0.6)) : 0;
      return { scene: S.scene, camera: cam, post: { bloom: { strength: 1.2, threshold: 1.0 }, grade: { vignette: 0.5 }, flash: { amount: fl, color: '#ffffff' } } };
    },
  });

  // ================================================================ 尾声：舞 + 每小节闪回
  const bars = [140.23, 142.049, 143.867, 145.685, 147.503, 149.321];
  const BEAT = 0.4545;
  // 跳舞台：反光黑地 + 网格 + 脚下光圈；共用一套搭法
  function danceScene() {
    const scene = scn(PAL.ink);
    scene.add(createGirlLights());
    scene.fog = new THREE.Fog(PAL.ink, 8, 30);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ color: '#0c0c12', roughness: 0.25, metalness: 0.7 }));
    floor.rotation.x = -Math.PI / 2; scene.add(floor);
    const grid = new THREE.GridHelper(60, 120, PAL.pink, PAL.mint);
    grid.material.transparent = true; grid.material.opacity = 0.16; grid.position.y = 0.002; scene.add(grid);
    return scene;
  }
  // 「oh」气泡：屏幕两侧每拍冒一个，带 OH 字，晃着上升
  function bubbles(ov, t0, t1) {
    const items = [];
    const ringM = lineMat(col(PAL.mint).multiplyScalar(1.6), 3);
    const txtM = new THREE.MeshBasicMaterial({ color: col(PAL.paper).multiplyScalar(1.4), transparent: true });
    const geo = textGeo('bebas', 'OH', { size: 2.2 });
    const aw = advance('bebas', 'OH', 2.2);
    const beats = mv.audio.beats.filter((b, i) => i % 2 === 0 && b > t0 - 2.5 && b < t1);
    beats.forEach((b, i) => {
      const g = new THREE.Group();
      const ring = fatLine(circlePts(2.1, 48), ringM); g.add(ring);
      const m = new THREE.Mesh(geo, txtM); m.position.set(-aw / 2, -0.8, 0); g.add(m);
      ov.add(g);
      items.push({ g, b, x: (i % 2 ? 1 : -1) * (13 + 3 * hash(i, 3)), w: hash(i, 4) * 6 });
    });
    return T => items.forEach(it => {
      const a = T - it.b;
      it.g.visible = a >= 0 && a < 3;
      if (!it.g.visible) return;
      it.g.position.set(it.x + Math.sin(a * 2.2 + it.w) * 0.7, -12 + 7.5 * a, 0);
      it.g.scale.setScalar(Math.max(0.001, eOut(a / 0.25)) * (1 + 0.04 * Math.sin(a * 9)));
    });
  }
  const danceShot = (id, t0, t1, cam, { skin = 'toon', kal8 = false, bub = false, girlAt = [0, 0, 0] } = {}) => ({
    id, t0, t1,
    build() {
      const scene = danceScene(), camera = persp(40);
      const ov = overlay(scene, camera, 1);
      const bub8 = bub ? bubbles(ov, t0, t1) : null;
      return { scene, camera, ov, bub8 };
    },
    update(S, T) {
      putGirl(S.scene, { x: girlAt[0], y: girlAt[1], z: girlAt[2] });
      girl.dance(OUTRO, T);
      girl.setSkin(skin, T);
      const c = S.camera;
      c.up.set(0, 1, 0);
      cam(c, (T - t0) / (t1 - t0), T);
      c.updateProjectionMatrix();
      c.updateMatrixWorld();
      fitOverlay(S.ov, c);
      if (kal8) { S.scene.add(kal.group); kal.group.visible = true; kal.update(T, { camera: c, center: V(girlAt[0], 0.5, girlAt[2]), radius: 0.25 }); }
      else kal.group.visible = false;
      S.bub8?.(T);
      return { scene: S.scene, camera: c, post: { bloom: { strength: 0.9, threshold: 1.2 }, chroma: 0.2 + 0.4 * kick(T), grade: { vignette: 0.3, saturation: 1.08 } } };
    },
  });
  // 闪回：一拍长，闪光进
  const flashIn = { kind: 'flash', dur: 0.12, peak: 0.5 };

  // bar0：万花筒大舞
  shots.push(danceShot('c4-d1-kaleido', 140.23, bars[1], (c, u) => {
    c.fov = 34; c.position.set(0, 0.55, 3.7 - 0.7 * u);
    c.up.set(Math.sin(u * 1.6), Math.cos(u * 1.6), 0);
    c.lookAt(0, 0.55, 0);
  }, { kal8: true }));
  // 闪回 1：巨眼
  shots.push({
    id: 'c4-m1-eye', t0: bars[1], t1: bars[1] + BEAT, transitionIn: flashIn,
    build() { const scene = scn(PAL.ink), camera = persp(30); const eye = createEye({ width: 30 }); scene.add(eye.mesh); return { scene, camera, eye }; },
    update(S, T) {
      const k = (T - bars[1]) / BEAT;
      S.eye.update(T, { open: 1, pupil: 0.3 + 0.5 * k, sparks: 1, spin: 3, glow: 1.4 });
      S.camera.position.set(0, 0, 36 - 10 * k); S.camera.lookAt(0, 0, 0);
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 1, threshold: 0.9 }, chroma: 0.5 } };
    },
  });
  // bar1：低机位仰拍全身 + 气泡
  shots.push(danceShot('c4-d2-low', bars[1] + BEAT, bars[2], (c, u) => {
    c.fov = 46; c.position.set(0.5 - 0.3 * u, 0.12, 1.75 - 0.15 * u);
    c.lookAt(0.2, 1.0, -1.5);
  }, { bub: true }));
  // 闪回 2：蓝图（她 blueprint 皮肤在网格上）
  shots.push({
    id: 'c4-m2-blueprint', t0: bars[2], t1: bars[2] + BEAT, transitionIn: flashIn,
    build() {
      const scene = scn('#0b1620'), camera = persp(34);
      const grid = new THREE.GridHelper(40, 80, col(PAL.mint).multiplyScalar(1.4), col(PAL.mint).multiplyScalar(0.35)); scene.add(grid);
      const disc = new THREE.Mesh(new THREE.CircleGeometry(1.1, 48), new THREE.MeshBasicMaterial({ color: col(PAL.mint).multiplyScalar(0.8), transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }));
      disc.rotation.x = -Math.PI / 2; disc.position.y = 0.01; scene.add(disc);
      return { scene, camera };
    },
    update(S, T) {
      putGirl(S.scene, { yaw: 0.6 });
      girl.dance(OUTRO, T); girl.setSkin('blueprint', T, { draw: 1 });
      const k = (T - bars[2]) / BEAT;
      S.camera.position.set(1.5 - 0.6 * k, 1.3, 1.9); S.camera.lookAt(0, 0.55, 0);
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.9, threshold: 1.0 }, chroma: 0.4 } };
    },
  });
  // bar2：中景绕她半圈 + 气泡
  shots.push(danceShot('c4-d3-orbit', bars[2] + BEAT, bars[3], (c, u) => {
    const a = lerp(1.2, -1.1, eInOut(u));
    c.fov = 34; c.position.set(Math.sin(a) * 1.55, 0.68, Math.cos(a) * 1.55);
    c.lookAt(0, 0.62, 0);
  }, { bub: true }));
  // 闪回 3：FOOM
  shots.push({
    id: 'c4-m3-foom', t0: bars[3], t1: bars[3] + BEAT, transitionIn: flashIn,
    build() {
      const scene = scn(PAL.mint), camera = persp(30);
      const fx = FX.slam({ words: [{ w: 'FOOM', start: bars[3] - 0.08, end: bars[3] + 0.4 }], color: PAL.ink, bg: PAL.mint, maxW: 26, maxH: 13, maxSize: 14, kick: 2 });
      scene.add(fx.group);
      return { scene, camera, fx };
    },
    update(S, T) {
      S.fx.update(T); S.camera.position.set(0, 0, 40); S.camera.lookAt(0, 0, 0);
      return { scene: S.scene, camera: S.camera, post: { bloom: 0.2, chroma: 0.5 } };
    },
  });
  // bar3：chrome 皮肤万花筒，推近
  shots.push(danceShot('c4-d4-chrome', bars[3] + BEAT, bars[4], (c, u) => {
    c.fov = 36; c.position.set(0.3 * Math.sin(u * 3), 0.7, 4.6 - 1.4 * u);
    c.up.set(-Math.sin(u * 1.2), Math.cos(u * 1.2), 0);
    c.lookAt(0, 0.6, 0);
  }, { skin: 'chrome', kal8: true }));
  // 闪回 4：回形针雪崩
  shots.push({
    id: 'c4-m4-clips', t0: bars[4], t1: bars[4] + BEAT, transitionIn: flashIn,
    build() {
      const scene = scn(PAL.ink), camera = persp(40);
      const clips = createPaperclips({ count: 6000 }); scene.add(clips.group ?? clips.mesh);
      scene.add(new THREE.AmbientLight('#ffffff', 1));
      return { scene, camera, clips };
    },
    update(S, T) {
      S.clips.update(T, { t0: bars[4] - 1.2, dur: 1.8, height: 3.2, radius: 6 });
      const k = (T - bars[4]) / BEAT;
      S.camera.position.set(6 - 2 * k, 3.4, 8); S.camera.lookAt(0, 1.2, 0);
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.8, threshold: 1.0 }, chroma: 0.4 } };
    },
  });
  // bar4：高机位俯拍旋转 + 气泡
  shots.push(danceShot('c4-d5-top', bars[4] + BEAT, bars[5], (c, u) => {
    const a = u * 1.4;
    c.fov = 40; c.position.set(Math.sin(a) * 1.3, 3.0 - 0.6 * u, Math.cos(a) * 1.3);
    c.lookAt(0, 0.5, 0);
  }, { bub: true }));
  // 闪回 5：GPU 麦浪
  shots.push({
    id: 'c4-m5-gpu', t0: bars[5], t1: bars[5] + BEAT, transitionIn: flashIn,
    build() {
      const scene = scn(PAL.ink), camera = persp(45);
      scene.fog = new THREE.Fog(PAL.ink, 20, 70);
      const f = createGpuField({ nx: 160, nz: 90 }); scene.add(f.group ?? f.mesh);
      scene.add(new THREE.AmbientLight('#ffffff', 1));
      return { scene, camera, f };
    },
    update(S, T) {
      S.f.update(T, { speed: 1.5, gust: 1.4, bright: 1.3 });
      const k = (T - bars[5]) / BEAT;
      S.camera.position.set(-4 + 3 * k, 3.2, 4); S.camera.lookAt(4, 0, -18);
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 1, threshold: 0.9 }, chroma: 0.4 } };
    },
  });

  // ================================================================ 149.776 巨型铬字 P(DOOM) + 数字 0.99 乱跳 → 锁成 NaN → 停两拍 → 整块炸成烟花
  // 尺寸同前几次副歌（P(DOOM) 高 8、宽约 26，数字牌宽约 11），相机距离让 P(DOOM) 占画宽 ~60%。
  const tNan = bars[5] + BEAT, tNanE = 152.048;
  const tNanLock = 150.231;                  // NaN 最后一格锁在这个拍上
  const tBang = 151.139;                     // 锁定后停两拍（0.91 s）再炸
  shots.push({
    id: 'c4-nan', t0: tNan, t1: tNanE,
    build() {
      const scene = scn('#05050a'), camera = persp(40);
      scene.fog = new THREE.Fog('#05050a', 40, 140);
      const city = createCity({ seed: 12, n: 17 }); city.group.scale.setScalar(1.6); city.group.position.set(0, 0, -36); scene.add(city.group);   // 城在 P(DOOM) 身后，不挡字
      const hot = new THREE.MeshMatcapMaterial({ matcap: chromeMatcap(), color: new THREE.Color(2.3, 2.1, 1.9) });
      const tower = word3d('P(DOOM)', { size: 8, depth: 1.6, material: hot });
      tower.position.set(0, 0, -16);
      scene.add(tower);
      const top = tower.geometry.boundingBox.max.y;
      // 数字牌：先是 0.99，接着 3 格乱跳，按拍锁成 N · a · N（anton 有小写）
      const flip = FX.flip({ font: 'anton', rows: [{ text: 'NaN', cell: [4.4, 5.8], spinFrom: tNan + 0.2, lockTimes: [tNanLock - 0.4545, tNanLock - 0.227, tNanLock] }], words: [{ w: 'NaN', start: tNan, end: tBang }], lock: PAL.lemon, tile: '#2a2233', charset: '0123456789.9?#%', camMove: 'none', tilt: [0, 0, 0], drift: 0 });
      const fsc = 21 / (3 * 4.84);   // NaN 牌宽约 21（P(DOOM) 的 4/5），两块一起占满画面
      flip.group.scale.setScalar(fsc);
      flip.group.position.set(0, top + 5.8 * fsc / 2 + 0.6, -16);
      scene.add(flip.group);
      const old = FX.flip({ rows: [{ text: '0.99', cell: [1.9, 2.7], spinFrom: tNan - 1, lockTimes: [tNan - 1, tNan - 1, tNan - 1, tNan - 1] }], words: [{ w: '0.99', start: tNan - 1, end: tNan }], lock: doomColor(0.99), camMove: 'none', tilt: [0, 0, 0], drift: 0 });
      old.group.scale.setScalar(19 / 8.2); old.group.position.copy(flip.group.position); scene.add(old.group);
      // 炸：从 P(DOOM) 和数字牌的表面采样，炸点 = 各自的位置
      tower.updateMatrixWorld(true);
      const src = [];
      const tp = samplePoints(tower.geometry, 4200, 7);
      for (let i = 0; i < tp.length; i += 3) src.push(V(tp[i], tp[i + 1], tp[i + 2]).applyMatrix4(tower.matrixWorld));
      const fc = flip.group.position;
      for (let i = 0; i < 1800; i++) src.push(V(fc.x + (hash(i, 31) - 0.5) * 21, fc.y + (hash(i, 32) - 0.5) * 8, fc.z + (hash(i, 33) - 0.5)));
      const NP = src.length, pos = new Float32Array(NP * 3), cl = new Float32Array(NP * 3);
      const center = V(0, top * 0.6, -16);
      const pal = [PAL.lemon, PAL.pink, PAL.mint, PAL.paper].map(col);
      const vel = src.map((p, i) => {
        const d = p.clone().sub(center); d.z += (hash(i, 40) - 0.3) * 8;
        return d.normalize().multiplyScalar(14 + 16 * hash(i, 41)).add(V(0, 6, 0));
      });
      const pcol = src.map((_, i) => pal[Math.floor(hash(i, 42) * 4)]);
      const pg = new THREE.BufferGeometry();
      pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      pg.setAttribute('color', new THREE.BufferAttribute(cl, 3));
      const pts = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.42, vertexColors: true, map: DOT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      pts.frustumCulled = false; scene.add(pts);
      const boom = createShockwave({ radius: 40, color: PAL.lemon, accent: PAL.pink });
      boom.mesh.position.set(0, top * 0.6, -15.5); scene.add(boom.mesh);
      return { scene, camera, city, tower, flip, old, src, vel, pcol, pos, cl, pg, pts, boom, top };
    },
    update(S, T) {
      S.city.update(T, { draw: 1, extrude: 1, light: 1 });
      const kb = T - tBang;
      const swell = kb > -0.15 && kb < 0 ? 1 + 0.06 * (kb + 0.15) / 0.15 : 1;
      S.tower.visible = kb < 0; S.tower.scale.setScalar(swell);
      S.old.group.visible = T < tNan + 0.2;   // 先是 0.99，接着乱跳
      S.flip.group.visible = kb < 0 && T >= tNan + 0.2;
      S.old.update(T);
      S.flip.update(T);
      S.boom.update(T, { t0: tBang, dur: 0.9 });
      S.pts.visible = kb >= 0;
      if (kb >= 0) {
        const f = (1 - Math.exp(-kb * 1.8)) / 1.8;
        for (let i = 0; i < S.src.length; i++) {
          const p = S.src[i], v = S.vel[i], c = S.pcol[i], q = i * 3;
          S.pos[q] = p.x + v.x * f; S.pos[q + 1] = p.y + v.y * f - 4 * kb * kb; S.pos[q + 2] = p.z + v.z * f;
          const fade = 1.9 * (1 - smooth((kb - 0.45) / 0.7)) * (0.7 + 0.3 * Math.sin(kb * 30 + i));   // 烟花一直亮到切走（不留暗场）
          S.cl[q] = c.r * fade; S.cl[q + 1] = c.g * fade; S.cl[q + 2] = c.b * fade;
        }
        S.pg.attributes.position.needsUpdate = true; S.pg.attributes.color.needsUpdate = true;
      }
      // 相机：略仰、正对，数字乱跳时慢推；锁定那拍往前一顶；炸时往后一退
      const k = (T - tNan) / (tNanE - tNan);
      const kl = T - tNanLock;
      const punch = kl >= 0 ? 1.6 * Math.exp(-kl * 6) : 0;
      const back = kb >= 0 ? 4 * eOut(kb / 0.5) : 0;
      const [sx, sy] = shake(T, 0.06);
      S.camera.fov = 40;
      S.camera.position.set(1.2 * Math.sin(k * 1.2) + sx, 6 + sy, 23 - 2.5 * k - punch + back);
      S.camera.lookAt(0, S.top * 1.08, -16);
      S.camera.updateProjectionMatrix();
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 1.1, threshold: 0.9 }, chroma: 0.15 + 0.3 * kick(T) + (kb > 0 ? 0.6 * Math.exp(-kb * 6) : 0), grade: { vignette: 0.3 }, flash: { amount: (kl >= 0 && kb < 0 ? 0.35 * Math.exp(-kl * 9) : 0) + (kb > 0 ? 0.5 * Math.exp(-kb * 8) : 0), color: PAL.lemon } } };
    },
  });

  // ================================================================ 152.048 她的右眼：睁着，瞳孔里是夜城，停 ≥ 1.2 s → 眨眼 → 黑
  const tEye = tNanE, tCard = 153.866, tHold = 152.3, tBlink = 153.55;
  shots.push({
    id: 'c4-eye', t0: tEye, t1: tCard,
    build() {
      const scene = scn('#030305'), camera = persp(30);
      scene.add(holo.mesh);
      holo.mesh.position.set(0, 0, 0); holo.mesh.rotation.set(0, 0, 0);
      const Hh = 6, Wh = Hh * 832 / 1150;
      // 右眼（画面右）瞳孔中心，rig.json eye_box + 裁切 y 从 40 起；由睁眼帧校准
      const eye = V((500 / 832 - 0.5) * Wh, (1 - (404 - 40) / 1150) * Hh, 0);
      // 全息自带的眨眼按种子排；这里给它的时钟找一个偏移，让 [tEye, tBlink) 整段都是睁眼（只影响眨眼 / 摆头，这段没有歌词）
      let off = 0;
      for (let d = 0; d <= 12; d += 0.1) {
        let ok = true;
        for (let t = tEye; t < tBlink + 0.05 && ok; t += 0.05) ok = holo.update(t + d, { expression: 'neutral', vocal: 0.6 }).eyes === 'open';
        if (ok) { off = d; break; }
      }
      const rt = new THREE.WebGLRenderTarget(512, 512, { type: THREE.HalfFloatType });
      const cs = scn('#05050a'), cc = persp(50);
      const city = createCity({ seed: 12, n: 17 }); cs.add(city.group);
      const refl = new THREE.Mesh(new THREE.CircleGeometry(0.16, 48), new THREE.MeshBasicMaterial({ map: rt.texture, color: new THREE.Color(1.8, 1.8, 1.8), transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }));
      refl.position.copy(eye).add(V(0, 0, 0.02)); scene.add(refl);
      return { scene, camera, eye, rt, cs, cc, city, refl, off };
    },
    update(S, T) {
      S.city.update(T, { draw: 1, extrude: 1, light: 1 });
      S.cc.position.set(Math.sin(T * 0.5) * 15, 8, Math.cos(T * 0.5) * 15); S.cc.lookAt(0, 1.5, 0);
      const prev = renderer.getRenderTarget();
      renderer.setRenderTarget(S.rt); renderer.render(S.cs, S.cc); renderer.setRenderTarget(prev);
      const closed = T >= tBlink;
      // 共享的 holo：每帧挂回、摆好、按 6 高缩放（总装时别的段会把它挪走）
      S.scene.add(holo.mesh); holo.mesh.visible = true; holo.mesh.position.set(0, 0, 0); holo.mesh.rotation.set(0, 0, 0); holo.mesh.scale.setScalar(6 / (holo.height ?? 6));
      holo.update(T + S.off, { expression: closed ? 'closed' : 'neutral', glitch: 0, opacity: 1, vocal: 0.6 });
      S.refl.visible = !closed;
      // 快推到右眼（0.25 s），然后贴着眼睛极慢地再推一点
      const e = S.eye;
      const k = eInOut((T - tEye) / (tHold - tEye));
      const z = T < tHold ? lerp(9, 2.1, k) : lerp(2.1, 1.75, (T - tHold) / (tBlink - tHold));
      S.camera.position.set(lerp(0, e.x, k), lerp(3.4, e.y, k), z);
      S.camera.lookAt(lerp(0, e.x, k), lerp(3.4, e.y, k), 0);
      const black = smooth((T - (tBlink + 0.1)) / (tCard - tBlink - 0.15));
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.8, threshold: 1.0 }, grade: { vignette: 0.55 }, flash: { amount: black, color: '#000000' } } };
    },
  });

  // ================================================================ 153.866 片尾字卡
  shots.push({
    id: 'c4-card', t0: tCard, t1: 156.65,
    build() {
      const scene = scn(PAL.ink), camera = persp(30);
      camera.position.set(0, 0, 40); camera.lookAt(0, 0, 0);
      const titleM = [new THREE.MeshBasicMaterial({ color: PAL.paper, transparent: true }), new THREE.MeshBasicMaterial({ color: PAL.pink, transparent: true })];
      const t1 = word3d("I'M UPPING MY", { size: 2.6, depth: 0, material: titleM[0], font: 'anton' }); t1.position.y = 2.2;
      const t2 = word3d('P(DOOM)', { size: 4.2, depth: 0, material: titleM[1], font: 'anton' }); t2.position.y = -3.4;
      scene.add(t1, t2);
      const credM = new THREE.MeshBasicMaterial({ color: col(PAL.paper).multiplyScalar(0.8), transparent: true });
      const cred = ['LYRICS: OSMARKS ET AL.', 'MUSIC: GENERATED WITH SUNO', 'RELEASED BY DECKARD'].map((s, i) => {
        const m = word3d(s, { size: 0.7, depth: 0, material: credM, font: 'mono' }); m.position.y = -5.6 - i * 1.15; scene.add(m); return m;
      });
      return { scene, camera, titleM, credM };
    },
    update(S, T) {
      const a = smooth((T - tCard) / 0.6), b = smooth((T - tCard - 0.5) / 0.6);
      S.titleM.forEach(m => { m.opacity = a; });
      S.credM.opacity = b;
      return { scene: S.scene, camera: S.camera, post: { bloom: 0.15, grade: { vignette: 0.3 } } };
    },
  });

  return shots;
}

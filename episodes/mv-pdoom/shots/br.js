// shots/br.js — 桥段（歌曲时间 109.3–123.9 s），分镜照 TREATMENT.md §4「桥段」：全片最密的蒙太奇，每拍都在变。
//
//   import { makeBR } from './shots/br.js';
//   const { shots, cuts } = makeBR(mv, { girl });
//   mv.mount(shots, { offset: 109.3, duration: 14.6 });
//
// 切点规则同 c1 / v3（一句唱完 + 0.3 s 之后的第一个拍）；镜头内每拍换一次（机位 / 形状 / 颜色 / 抖动），但每个画面至少停 1 拍。
// 字都在屏幕层（相机前 overlay，type3d 取景 38.1 × 21.4），字高 ≥ 画高 5%（≥ 1.07 单位）。

import * as THREE from 'three';
import { FX, PAL, textGeo } from '../kits/type3d.js';
import { createGirlLights } from '../kits/girl.js';
import { createGpuField, mulberry32 } from '../kits/world.js';
import { createShatter } from '../kits/vfx.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eInOut = p => { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2; };
const spring = k => (k < 0 ? 0 : Math.exp(-k * 9) * Math.cos(k * 30));
const col = c => new THREE.Color(c);
const glow = (c, k) => new THREE.Color(c).multiplyScalar(k);
const ACC = [PAL.pink, PAL.mint, PAL.lemon];

// ---------------------------------------------------------------- 时间
function lineOf(mv, prefix) {
  const l = mv.lyrics.lines.find(x => x.text.replace(/[“”"]/g, '').toLowerCase().startsWith(prefix.toLowerCase()));
  if (!l) throw new Error(`br：找不到歌词「${prefix}」`);
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
    tr: lineOf(mv, 'Just transformers'), dis: lineOf(mv, 'Till you learned'), dense: lineOf(mv, 'Post-Chinchilla'),
    fence: lineOf(mv, 'Breaking through'), gpu: lineOf(mv, 'Hundred thousand'), rlhf: lineOf(mv, 'RLHF'),
  };
  const after = l => beatAfter(mv, Math.min(vocalEnd(mv, l), l.end) + 0.3);
  const c = { start: 109.3, end: 123.9 };
  c.tower = beatAfter(mv, L.tr.start);            // 前奏两拍过门，第一个词的拍上进塔
  c.dis = after(L.tr);
  c.dense = after(L.dis);
  c.fence = after(L.dense);
  c.gpu = after(L.fence);
  c.rlhf = after(L.gpu);
  return { c, L };
}

// ---------------------------------------------------------------- 小工具
function persp(fov = 40) { return new THREE.PerspectiveCamera(fov, 16 / 9, 0.05, 800); }
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
const clean = w => w.replace(/[“”",!.]/g, '').toUpperCase();
// 词条：一排按词出现的挤出字，返回 { group, items:[{m, w, x}] }，行宽不超过 maxW
function wordRow(words, { size = 1.6, maxW = 30, gap = 0.5, color = PAL.paper, colors = null, depth = 0.25, glowK = 0.85 } = {}) {
  const group = new THREE.Group();
  const items = words.map((w, i) => {
    const m = word3d(clean(w.w), { size, depth: size * depth, material: new THREE.MeshBasicMaterial({ color: glow(colors ? colors[i % colors.length] : color, glowK), toneMapped: false }) });
    group.add(m); return { m, w };
  });
  let total = items.reduce((a, o) => a + o.m.userData.w, 0) + gap * (items.length - 1);
  const k = total > maxW ? maxW / total : 1;
  let x = -total * k / 2;
  items.forEach(o => { o.m.scale.setScalar(k); o.x = x + o.m.userData.w * k / 2; x += (o.m.userData.w + gap) * k; o.m.position.x = o.x; o.k = k; });
  return { group, items };
}
// 多行排字：每行单独按 maxW 缩，行距 gapY，整体上下居中
function layLines(lines, { maxW = 15, gapY = 3.4, gap = 0.5 } = {}) {
  lines.forEach((arr, li) => {
    const raw = arr.reduce((a, o) => a + o.m.userData.w, 0) + gap * (arr.length - 1);
    const k = Math.min(1, maxW / raw);
    let x = -raw * k / 2;
    arr.forEach(o => { o.k = k; o.x = x + o.m.userData.w * k / 2; x += (o.m.userData.w + gap) * k; o.y = ((lines.length - 1) / 2 - li) * gapY; });
  });
}
// 相机看向「塔轴旁边」：side > 0 让塔落在画面左边，side < 0 落在右边
function aimBeside(cam, y, side) {
  const dir = new THREE.Vector3(-cam.position.x, 0, -cam.position.z).normalize();
  const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
  cam.lookAt(right.x * side, y, right.z * side);
}
function labelTexture(text, bg, fg = '#0A0A10') {
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 128;
  const g = cv.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, 512, 128);
  g.strokeStyle = fg; g.lineWidth = 6; g.strokeRect(8, 8, 496, 112);
  g.fillStyle = fg; g.font = '700 64px "Share Tech Mono", ui-monospace, Menlo, monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, 256, 68);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

// ================================================================ 镜头
export function makeBR(mv, { girl = null } = {}) {
  const { c, L } = cuts(mv);
  const A = mv.audio, M = mv.music, period = A.beat_period;
  const beatIdx = T => A.beats.filter(b => b <= T + 1e-3).length - 1;       // 全局拍号
  const beatStart = T => A.beats[beatIdx(T)];
  const shots = [];

  // ---- 0. 前奏两拍：节拍驱动的图形变形过门（SDF 形状每拍变一次形 + 换底色） ----------------------
  shots.push({
    id: 'br-00-morph', t0: c.start, t1: c.tower, transitionIn: { kind: 'cut' },
    build() {
      const scene = scn(PAL.ink), camera = new THREE.OrthographicCamera(-16 / 9, 16 / 9, 1, -1, 0, 10);
      camera.position.z = 5;
      const mat = new THREE.ShaderMaterial({
        uniforms: { uT: { value: 0 }, uFrom: { value: 0 }, uTo: { value: 1 }, uP: { value: 0 }, uBg: { value: col(PAL.pink) }, uFg: { value: col(PAL.ink) }, uEcho: { value: col(PAL.lemon) }, uRot: { value: 0 } },
        vertexShader: `varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
        fragmentShader: /* glsl */`
          uniform float uT, uFrom, uTo, uP, uRot; uniform vec3 uBg, uFg, uEcho; varying vec2 vP;
          float sdBox(vec2 p, vec2 b){ vec2 d = abs(p) - b; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0); }
          float sdTri(vec2 p, float r){ const float k = 1.7320508; p.x = abs(p.x) - r; p.y = p.y + r/k; if (p.x + k*p.y > 0.0) p = vec2(p.x - k*p.y, -k*p.x - p.y)/2.0; p.x -= clamp(p.x, -2.0*r, 0.0); return -length(p)*sign(p.y); }
          float sdCross(vec2 p, float r){ p = abs(p); return min(sdBox(p, vec2(r, r*0.3)), sdBox(p, vec2(r*0.3, r))); }
          float shape(float k, vec2 p){ return k < 0.5 ? length(p) - 0.5 : k < 1.5 ? sdBox(p, vec2(0.42)) : k < 2.5 ? sdTri(p, 0.52) : sdCross(p, 0.55); }
          mat2 rot(float a){ return mat2(cos(a), -sin(a), sin(a), cos(a)); }
          void main(){
            vec2 p = rot(uRot) * vP;
            float d = mix(shape(uFrom, p), shape(uTo, p), uP);
            vec3 c = uBg;
            // 同心回声轮廓
            float echo = abs(fract(d * 5.0 - uT * 2.0) - 0.5);
            c = mix(c, uEcho, (1.0 - smoothstep(0.0, 0.06, echo)) * step(0.0, d) * 0.45);
            c = mix(c, uFg, 1.0 - smoothstep(0.0, 0.006, d));
            gl_FragColor = vec4(c, 1.0);
          }`,
      });
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(4, 2), mat));
      return { scene, camera, mat };
    },
    update(S, T) {
      const bi = beatIdx(T), b0 = beatStart(T), k = (T - b0) / period;
      const u = S.mat.uniforms;
      u.uT.value = T; u.uFrom.value = (bi + 3) % 4; u.uTo.value = bi % 4; u.uP.value = eOut(k / 0.35);
      u.uBg.value.set(ACC[bi % 3]); u.uEcho.value.set(ACC[(bi + 1) % 3]);
      u.uRot.value = bi * Math.PI / 4 + eOut(k / 0.35) * Math.PI / 4 * (bi % 2 ? -1 : 1);
      const s = 1 + 0.08 * spring(T - b0);
      S.camera.zoom = s; S.camera.updateProjectionMatrix();
      return { scene: S.scene, camera: S.camera, post: { bloom: 0 } };
    },
  });

  // ---- 1+2. Transformer 塔：相机沿无限高的塔俯冲；Till you learned to disobey 时块脱队翻飞 ------------------
  // 同一座塔两个镜头共用（塔是 T 的纯函数），第 2 镜换机位 + 块飞出。
  const makeTower = () => {
    const g = new THREE.Group();
    const kinds = [
      { name: 'ATTENTION', color: PAL.pink, h: 0.9 }, { name: 'NORM', color: PAL.lemon, h: 0.22 },
      { name: 'MLP', color: PAL.mint, h: 0.9 }, { name: 'NORM', color: PAL.lemon, h: 0.22 },
    ];
    const blocks = [];
    const tex = {};
    let y = 0;
    const N = 48;                       // 12 层 × 4 块，按 y 取模无限重复
    for (let i = 0; i < N; i++) {
      const k = kinds[i % 4];
      tex[k.name] ??= labelTexture(k.name, k.color);
      const mats = [0, 1, 2, 3, 4, 5].map(f => new THREE.MeshBasicMaterial({ color: f === 2 || f === 3 ? col(k.color).multiplyScalar(0.55) : '#ffffff', map: f === 2 || f === 3 ? null : tex[k.name] }));
      const m = new THREE.Mesh(new THREE.BoxGeometry(2.4, k.h, 2.4), mats);
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), new THREE.LineBasicMaterial({ color: '#0A0A10' }));
      m.add(e); g.add(m);
      blocks.push({ m, y0: y + k.h / 2, h: k.h, i, seed: mulberry32(900 + i)() });
      y += k.h + 0.12;
    }
    // 残差连线：塔两侧的竖线
    const rail = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1.5, -200, 1.3), new THREE.Vector3(-1.5, 200, 1.3), new THREE.Vector3(1.5, -200, 1.3), new THREE.Vector3(1.5, 200, 1.3)]), new THREE.LineBasicMaterial({ color: glow(PAL.mint, 1.6), toneMapped: false }));
    g.add(rail);
    return { g, blocks, H: y };
  };
  const placeTower = (tw, camY, T, fly = null) => {
    // 以相机高度为中心，塔块按 H 取模铺满上下 → 无限高
    for (const b of tw.blocks) {
      let y = b.y0 - tw.H * Math.round((b.y0 - camY) / tw.H);
      b.m.position.set(0, y, 0); b.m.rotation.set(0, 0, 0); b.m.visible = true;
      if (fly) fly(b, T);
    }
  };

  shots.push({
    id: 'br-01-tower', t0: c.tower, t1: c.dis, transitionIn: { kind: 'cut' },
    build() {
      const scene = scn('#07070c'), camera = persp(55);
      scene.fog = new THREE.Fog('#07070c', 6, 30);
      const tw = makeTower(); scene.add(tw.g);
      const ov = overlay(scene, camera);
      const row = wordRow(L.tr.words, { size: 2.6, maxW: 999, colors: [PAL.paper, PAL.pink, PAL.paper, PAL.paper, PAL.lemon] });
      // 两行：JUST TRANSFORMERS / ALL THE WAY
      const it = row.items;
      const l1 = it.slice(0, 2), l2 = it.slice(2);
      layLines([l1, l2], { maxW: 15, gapY: 3.6 });
      row.group.position.set(10.2, 0, 0); ov.add(row.group);
      return { scene, camera, tw, row };
    },
    update(S, T) {
      const k = T - c.tower, bi = beatIdx(T), kb = T - beatStart(T);
      // 俯冲：沿塔往下，速度按拍冲一下
      const camY = -(k * 7 + eOut(kb / 0.3) * 0.9 + (bi - beatIdx(c.tower)) * 0.9);
      placeTower(S.tw, camY, T);
      // 每拍换一个绕塔角度（90° 一跳，甩过去），每 2 拍换一次上下视角
      const face = bi - beatIdx(c.tower);
      const ang = face * Math.PI / 2 + eOut(kb / 0.18) * 0 - 0.5;
      const a = lerp(ang - Math.PI / 2, ang, eOut(kb / 0.22));
      const r = face % 2 ? 4.6 : 5.6;
      S.camera.position.set(Math.cos(a) * r, camY + 1.6, Math.sin(a) * r);
      aimBeside(S.camera, camY - 2.2, 2.6);   // 塔在画面左 1/3，右边留给字
      S.camera.rotateZ(face % 2 ? 0.12 : -0.08);
      S.row.items.forEach(o => { const kk = T - o.w.start; o.m.visible = kk >= 0; o.m.position.set(o.x, o.y, 0); o.m.scale.setScalar(o.k * (1 + 0.45 * (1 - eOut(kk / 0.1)) + 0.15 * spring(kk - 0.12))); });   // 原地放大弹出，不穿过别的行
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.6, threshold: 0.9 } } };
    },
  });

  shots.push({
    id: 'br-02-disobey', t0: c.dis, t1: c.dense, transitionIn: { kind: 'whip', dur: 0.26, dir: 1 },
    build() {
      const scene = scn('#07070c'), camera = persp(50);
      scene.fog = new THREE.Fog('#07070c', 8, 34);
      const tw = makeTower(); scene.add(tw.g);
      const ov = overlay(scene, camera);
      const row = wordRow(L.dis.words, { size: 2.6, maxW: 999, colors: [PAL.paper, PAL.paper, PAL.paper, PAL.paper, PAL.pink] });
      const it = row.items, l1 = it.slice(0, 3), l2 = it.slice(3);
      layLines([l1, l2], { maxW: 15, gapY: 3.4 });
      row.group.position.set(-10.2, 0, 0); ov.add(row.group);
      return { scene, camera, tw, row };
    },
    update(S, T) {
      const k = T - c.dis;
      const camY = -k * 2.2;
      // 块一个个脱队：按拍，每拍放飞一批（随机方向旋转着甩出去）
      const d0 = c.dis;
      placeTower(S.tw, camY, T, (b, T) => {
        const tOut = d0 + (Math.floor(b.seed * 4) + (b.i % 3 === 0 ? 0 : 1)) * period * 0.9 + b.seed * 0.2;
        const t = T - tOut;
        if (t <= 0 || b.seed < 0.25) return;
        const dir = b.seed * 12.7;
        b.m.position.x += Math.cos(dir) * (3 * t + 4 * t * t);
        b.m.position.z += Math.sin(dir) * (3 * t + 4 * t * t);
        b.m.position.y += 1.2 * t;
        b.m.rotation.set(t * 3 * Math.cos(dir * 3), t * 4, t * 2.5 * Math.sin(dir * 2));
      });
      // 机位：塔在画面右侧，侧面平视 → 第 3 拍甩到仰视
      const bi = beatIdx(T) - beatIdx(c.dis);
      const up = bi >= 2;
      S.camera.position.set(-2.2 + k * 0.4, camY + (up ? -2.5 : 0.6), 7.5 - k * 0.8);
      aimBeside(S.camera, camY + (up ? 1.5 : 0), -3.0);   // 塔在画面右侧，左边留给字
      // 字：唱到 disobey 时前面几个词被甩飞
      const dT = S.row.items.at(-1).w.start;
      S.row.items.forEach((o, i) => {
        const kk = T - o.w.start; o.m.visible = kk >= 0;
        const fly = i < S.row.items.length - 1 ? Math.max(0, T - dT - 0.15 - i * 0.05) : 0;
        o.m.position.set(o.x - fly * fly * 30 * (i % 2 ? -0.4 : 1), o.y + fly * 8 - (1 - eOut(kk / 0.14)) * 5, 0);
        o.m.rotation.z = fly * (i % 2 ? 4 : -5);
        o.m.scale.setScalar(o.k * (1 + 0.15 * spring(kk - 0.14)));
      });
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.6, threshold: 0.9 } } };
    },
  });

  // ---- 3. Post-Chinchilla, super-dense：一切压缩成密实立方体，她 voxel 皮肤，字被挤扁 --------------------------
  shots.push({
    id: 'br-03-dense', t0: c.dense, t1: c.fence, transitionIn: { kind: 'cut' },
    build() {
      const scene = scn('#0b0a12'), camera = persp(38);
      scene.add(createGirlLights({ key: 2.4 }));
      const n = 9, cnt = n * n * n, rnd = mulberry32(55);
      const cube = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.3 }), cnt);
      const cells = [];
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let q = 0; q < n; q++) {
        const u = rnd() * 2 - 1, th = rnd() * 6.283, s = Math.sqrt(1 - u * u), r = 3 + rnd() * 5;
        cells.push({ tgt: new THREE.Vector3((i - (n - 1) / 2) * 0.13, 0.62 + (j - (n - 1) / 2) * 0.13, (q - (n - 1) / 2) * 0.13), src: new THREE.Vector3(s * Math.cos(th) * r, 0.8 + u * r * 0.6, s * Math.sin(th) * r), d: rnd() });
        cube.setColorAt(cells.length - 1, col(ACC[Math.floor(rnd() * 3)]).multiplyScalar(0.8));
      }
      cube.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      const g = new THREE.Group(); g.position.set(-1.1, 0, -0.4); g.add(cube); scene.add(g);
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ color: '#111118', roughness: 0.5 }));
      floor.rotation.x = -Math.PI / 2; scene.add(floor);
      const ov = overlay(scene, camera);
      const row = wordRow(L.dense.words, { size: 2.6, maxW: 999, colors: [PAL.lemon, PAL.pink] });
      row.items.forEach(o => { o.k = Math.min(1, 15 / o.m.userData.w); });
      row.items[0].y = 1.7; row.items[1].y = -1.9; row.items.forEach(o => { o.x = 0; });
      row.group.position.set(0, 6.6, 0); ov.add(row.group);   // 顶部居中：被挤宽后也不出画
      return { scene, camera, cube, cells, row, g };
    },
    update(S, T) {
      const k = T - c.dense, dur = c.fence - c.dense;
      // 压缩：前 2 拍从四周飞进来挤成立方体，之后每拍再被「压」一下（整体缩放脉冲）
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sv = new THREE.Vector3(), p = new THREE.Vector3();
      const kb = T - beatStart(T);
      const squeeze = 1 - 0.12 * Math.exp(-kb * 8);
      S.cells.forEach((cl, i) => {
        const u = eInOut((k - cl.d * 0.4) / (2 * period));
        p.copy(cl.src).lerp(cl.tgt, u);
        p.y = lerp(p.y, 0.62 + (cl.tgt.y - 0.62) * squeeze, u);
        q.setFromEuler(new THREE.Euler((1 - u) * cl.d * 9, (1 - u) * cl.d * 7, 0));
        sv.setScalar(0.125 * (0.6 + 0.4 * u));
        m4.compose(p, q, sv); S.cube.setMatrixAt(i, m4);
      });
      S.cube.instanceMatrix.needsUpdate = true;
      S.cube.instanceColor.needsUpdate = true;
      if (girl) {
        S.scene.add(girl.root);
        girl.root.position.set(0.55, 0, 0.2); girl.root.rotation.set(0, -0.35, 0); girl.root.scale.setScalar(1);
        girl.dance([{ beat: Math.round(girl.beatOf(c.dense)), move: 'bodyRoll' }], T);
        girl.setSkin('voxel', T);
      }
      // 字被挤扁：唱到时先正常砸入，每拍被压一次（y 变扁、x 撑宽）
      S.row.items.forEach(o => {
        const kk = T - o.w.start; o.m.visible = kk >= 0;
        const flat = kk >= 0 ? lerp(1, 0.35, eOut((k - 2 * period) / period)) * (1 - 0.18 * Math.exp(-kb * 8)) : 1;
        o.m.scale.set(o.k / Math.sqrt(flat), o.k * flat, o.k);
        o.m.position.set(o.x, o.y * flat, 0);
      });
      // 机位：第 1–2 拍平视中景，第 3 拍起低机位推近
      const bi = beatIdx(T) - beatIdx(c.dense);
      if (bi < 2) { S.camera.position.set(0.2 + k * 0.2, 0.8, 3.6 - k * 0.3); S.camera.lookAt(-0.2, 0.62, 0); }
      else { S.camera.position.set(1.4, 0.25, 2.5 - (k - 2 * period) * 0.4); S.camera.lookAt(-0.1, 0.7, 0); }
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.6, threshold: 0.9 } } };
    },
  });

  // ---- 4. Breaking through each safety fence：相机撞穿一层层写字的玻璃板 -----------------------------------
  shots.push({
    id: 'br-04-fence', t0: c.fence, t1: c.gpu, transitionIn: { kind: 'flash', dur: 0.2, color: PAL.mint, peak: 0.6 },
    build() {
      const scene = scn('#050810'), camera = persp(50);
      // 4 块玻璃：每块一个词组，唱到才显字；相机在拍上撞穿
      const groups = [[0], [1], [2, 3], [4]].map(ix => ix.map(i => L.fence.words[i]));
      const beats = A.beats.filter(b => b > c.fence + 0.05 && b < c.gpu + 0.05).slice(0, 4);
      while (beats.length < 4) beats.push(c.gpu);
      const panes = groups.map((ws, i) => {
        const text = ws.map(w => clean(w.w)).join(' ');
        const blank = glassTex(''), full = glassTex(text, ACC[i % 3]);
        const sh = createShatter({ width: 8, height: 4.5, cells: 34, seed: 70 + i, texture: blank, impact: [0.3 * (i % 2 ? -1 : 1), -0.2], thickness: 0.06 });
        sh.group.position.z = -i * 7;
        scene.add(sh.group);
        return { sh, ws, blank, full, hit: beats[i], z: -i * 7, mats: new Set() };
      });
      panes.forEach(p => p.sh.group.traverse(o => { if (o.isMesh && o.material.uniforms?.uMap) p.mats.add(o.material); }));
      // 远处的框：安全栅栏的金属框
      const frameMat = new THREE.LineBasicMaterial({ color: glow(PAL.mint, 1.5), toneMapped: false });
      panes.forEach(p => { const f = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(8.2, 4.7, 0.1)), frameMat); f.position.z = p.z; scene.add(f); });
      return { scene, camera, panes };
    },
    update(S, T) {
      // 相机位置：在每个拍上正好到达第 i 块板（z_i + 0.4）；拍间匀速
      const P = S.panes;
      // 每块板：撞穿后很快刹到下一块前 6 个单位（整块玻璃和字都在画内，能读），停在那儿慢慢逼近，拍前 25% 冲过去
      const approach = (b, p) => p < 0.75 ? b.z + 6 - 0.6 * (p / 0.75) : b.z + 5.4 - 4.8 * clamp((p - 0.75) / 0.25) ** 2;
      let z;
      if (T <= P[0].hit) z = approach(P[0], clamp((T - c.fence) / Math.max(0.05, P[0].hit - c.fence) * 0.75 + 0.25 * clamp((T - (P[0].hit - 0.12)) / 0.12)));
      else {
        let i = 0; while (i < P.length - 1 && T > P[i + 1].hit) i++;
        const a = P[i], b = P[i + 1];
        if (!b) z = a.z + 0.6 - (T - a.hit) * 4;
        else {
          const p = (T - a.hit) / (b.hit - a.hit);
          z = p < 0.2 ? lerp(a.z + 0.6, b.z + 6, eOut(p / 0.2)) : approach(b, (p - 0.2) / 0.8);
        }
      }
      P.forEach((p, i) => {
        const shown = p.ws.some(w => T >= w.start);
        for (const m of p.mats) m.uniforms.uMap.value = shown ? p.full : p.blank;
        const t = T - p.hit;
        p.sh.update(T, { crack: smooth((T - (p.hit - 0.25)) / 0.2), shatter: Math.max(0, t) * 1.3 });
      });
      const kb = T - beatStart(T);
      S.camera.position.set(Math.sin(T * 1.7) * 0.15, Math.cos(T * 1.3) * 0.1, z);
      S.camera.lookAt(0, 0, z - 5);
      S.camera.rotateZ(Math.sin(beatIdx(T) * 1.7) * 0.08);
      const hit = P.some(p => T >= p.hit && T - p.hit < 0.1) ? 1 : 0;
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.7, threshold: 0.85 }, chroma: 0.6 * Math.exp(-kb * 10), flash: hit * 0.15 } };
    },
  });

  // ---- 5. Hundred thousand GPU：GPU 田野 LED 麦浪，字在麦浪上流过 ---------------------------------------
  shots.push({
    id: 'br-05-gpu', t0: c.gpu, t1: c.rlhf, transitionIn: { kind: 'cut' },
    build() {
      const scene = scn('#05050a'), camera = persp(40);
      const field = createGpuField(); scene.add(field.mesh);
      // 字躺在田野上方一点，沿 x 流过；随浪起伏
      const words = L.gpu.words.map((w, i) => {
        const m = word3d(clean(w.w), { size: 1.5, depth: 0.3, material: new THREE.MeshBasicMaterial({ color: glow([PAL.paper, PAL.lemon, PAL.pink][i], 0.95), toneMapped: false }) });
        scene.add(m); return { m, w, i };
      });
      // 按字宽排开，整行居中，跟着相机一起横移
      const tot = words.reduce((a, o) => a + o.m.userData.w, 0) + 1.2 * (words.length - 1);
      let x = -tot / 2; const xs = words.map(o => { const c0 = x + o.m.userData.w / 2; x += o.m.userData.w + 1.2; return c0; });
      return { scene, camera, field, words, xs };
    },
    update(S, T) {
      const k = T - c.gpu;
      S.field.update(T, { speed: 1.3, gust: 1.1, bright: 1.2 });
      const bi = beatIdx(T) - beatIdx(c.gpu);
      // 机位：前 2 拍低空贴着麦浪横移，后 2 拍升起俯看
      if (bi < 2) { S.camera.position.set(-6 + k * 3, 1.4, 3); S.camera.lookAt(-2 + k * 3, 0.4, -10); }
      else { const u = eInOut((k - 2 * period) / (2 * period)); S.camera.position.set(-6 + k * 3, lerp(1.4, 5.5, u), lerp(3, 5, u)); S.camera.lookAt(-2 + k * 3, 0, -12); }
      S.words.forEach(({ m, w, i }) => {
        const kk = T - w.start; m.visible = kk >= 0;
        const x = -2 + k * 3 + S.xs[i] + 2.5;
        const z = -14;
        m.position.set(x, 1.4 + 0.35 * Math.sin(x * 0.38 - T * 2.6) + (1 - eOut(kk / 0.2)) * 3, z);
        m.rotation.set(-0.35, 0, 0.12 * Math.sin(x * 0.38 - T * 2.6));
        m.scale.setScalar(kk >= 0 ? 1 + 0.12 * spring(kk - 0.2) : 1);
      });
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 1.0, threshold: 0.75 } } };
    },
  });

  // ---- 6. RLHF goes askew：满屏几何 👍👎 乱转，世界歪 15°，故障，歪斜印章 --------------------------------------
  shots.push({
    id: 'br-06-rlhf', t0: c.rlhf, t1: c.end + 0.5, transitionIn: { kind: 'whip', dur: 0.26, dir: -1 },
    build() {
      const scene = scn('#0d0b14'), camera = persp(40);
      scene.add(new THREE.HemisphereLight('#ffffff', '#302030', 1.4));
      const dl = new THREE.DirectionalLight('#ffffff', 2.4); dl.position.set(2, 3, 4); scene.add(dl);
      // 大拇指图标：拳头（圆角盒）+ 拇指（胶囊），up / down 两种
      const fingerGeo = new THREE.CapsuleGeometry(0.16, 0.45, 4, 10);
      const geos = [];
      const g1 = new THREE.BoxGeometry(0.9, 0.7, 0.55); geos.push(g1);
      const g2 = fingerGeo.clone().translate(-0.25, 0.6, 0); geos.push(g2);
      const merged = mergeGeos(geos);
      const rnd = mulberry32(12);
      const N = 70;
      const up = new THREE.InstancedMesh(merged, new THREE.MeshStandardMaterial({ color: PAL.mint, roughness: 0.4 }), N);
      const dn = new THREE.InstancedMesh(merged, new THREE.MeshStandardMaterial({ color: PAL.pink, roughness: 0.4 }), N);
      const inst = [];
      for (let i = 0; i < N * 2; i++) inst.push({ p: new THREE.Vector3((rnd() - 0.5) * 22, (rnd() - 0.5) * 12, -3 - rnd() * 14), ax: new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(), w: 1 + rnd() * 4, s: 0.5 + rnd() * 0.7, ph: rnd() * 6 });
      scene.add(up, dn);
      const ov = overlay(scene, camera);
      const st = FX.stamp({ line: L.rlhf, bg: '#0d0b14', color: PAL.lemon, smallColor: PAL.paper, angle: -0.26 });
      st.group.scale.setScalar(0.95);
      // 字周围一块半透明墨底：图标进不到字里（印章字不写深度，所以整层 renderOrder 抬高、最后画）
      const plate = new THREE.Mesh(new THREE.PlaneGeometry(26, 15), new THREE.MeshBasicMaterial({ color: '#0d0b14', transparent: true, opacity: 0.82, depthWrite: false }));
      plate.position.set(0, 0.6, -1.5); ov.add(plate);
      ov.add(st.group);
      ov.traverse(o => { o.renderOrder = 10; });
      plate.renderOrder = 9;
      return { scene, camera, up, dn, inst, N, st };
    },
    update(S, T) {
      const k = T - c.rlhf, kb = T - beatStart(T), bi = beatIdx(T);
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sv = new THREE.Vector3();
      S.inst.forEach((o, i) => {
        // 每拍甩一下：转速在拍头冲高再回落
        const ang = o.ph + o.w * k + 2.2 * (1 - Math.exp(-kb * 6)) * (i % 2 ? 1 : -1) + bi * 0.9;
        q.setFromAxisAngle(o.ax, ang);
        sv.setScalar(o.s * (1 + 0.15 * Math.exp(-kb * 8)));
        m4.compose(o.p, q, sv);
        (i < S.N ? S.up : S.dn).setMatrixAt(i % S.N, m4);
      });
      S.up.instanceMatrix.needsUpdate = S.dn.instanceMatrix.needsUpdate = true;
      S.st.update(T);
      // 世界歪 15°，而且每拍换一个方向小晃
      S.camera.position.set(Math.sin(bi * 2.1) * 0.8, Math.cos(bi * 1.3) * 0.4, 9 - k * 0.5);
      S.camera.lookAt(0, 0, -6);
      S.camera.rotateZ(THREE.MathUtils.degToRad(15) + 0.05 * Math.sin(bi * 1.9));
      const glitch = 0.25 + 0.6 * Math.exp(-kb * 7);
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.5, threshold: 0.9 }, glitch, chroma: 0.4 * Math.exp(-kb * 7) } };
    },
  });

  return { shots, cuts: c };
}

// 玻璃板贴图：半透明感的冷色玻璃 + 边框 + 大字（text 为空 = 只有玻璃）
function glassTex(text, color = PAL.paper) {
  const cv = document.createElement('canvas'); cv.width = 1600; cv.height = 900;
  const g = cv.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 1600, 900); gr.addColorStop(0, '#1b2a3a'); gr.addColorStop(1, '#0d1420');
  g.fillStyle = gr; g.fillRect(0, 0, 1600, 900);
  g.strokeStyle = 'rgba(95,227,192,0.5)'; g.lineWidth = 10; g.strokeRect(20, 20, 1560, 860);
  g.fillStyle = 'rgba(255,255,255,0.06)'; g.beginPath(); g.moveTo(0, 0); g.lineTo(700, 0); g.lineTo(200, 900); g.lineTo(0, 900); g.fill();
  if (text) {
    g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle';
    let size = 330; g.font = `${size}px "Anton", Impact, sans-serif`;
    while (g.measureText(text).width > 1400) { size -= 10; g.font = `${size}px "Anton", Impact, sans-serif`; }
    g.fillText(text, 800, 470);
  }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function mergeGeos(geos) {
  const pos = [], nor = [], idx = [];
  let off = 0;
  for (const g0 of geos) {
    const g = g0.index ? g0 : g0.toNonIndexed();
    const p = g.attributes.position.array, n = g.attributes.normal.array;
    pos.push(...p); nor.push(...n);
    if (g.index) for (const i of g.index.array) idx.push(i + off); else for (let i = 0; i < p.length / 3; i++) idx.push(i + off);
    off += p.length / 3;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  out.setIndex(idx);
  return out;
}

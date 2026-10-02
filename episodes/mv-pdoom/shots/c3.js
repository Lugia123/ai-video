// shots/c3.js — 副歌 3（歌曲时间 94.8–109.3 s），分镜照 TREATMENT.md §4「副歌 3」：灾难，P(doom) 0.42 → 0.81。
//
//   import { makeC3 } from './shots/c3.js';
//   const { shots, cuts, girlAt } = await makeC3(mv, { girl });   // async：回形针拼字要先采样字形
//   mv.mount(shots, { offset: 94.8, duration: 14.5 });
//
// 切点（代码算，都在拍上）：这段也是连唱，规则同 v2 —— 切点 = 这句最后一个词唱完后的第一个拍，不在词中间切。
//   94.8 坠落（接 v3 松手）→ 95.233 P(DOOM) 巨型数字 → 97.051 回形针雪崩 → 98.869 红按钮 + 自动回复
//   → 101.142 航拍被埋的城 → 102.505 火花沿 PCB 走线烧（跟拍）→ 103.869（小节头）俯拍全盘 → 106.141 冷蓝坐标轴 → 107.505（小节头）近景
// 镜头：
//   00 fall     她从上方坠向镜头，头顶发光的 GATO 越来越远，速度线往上刷
//   01 doom     巨型面板（占画宽 ~70%）：I'M UPPING MY → P(DOOM) → 0.42 翻牌到 0.81（DOOM 落在小节头时锁定）→ 同一刻沃罗诺伊裂纹爬满
//               （vfx.createShatter，面板贴图就是画字的 canvas），她在面板左侧外面往下坠
//   02 clips    上万回形针雪崩，淹到她腰、最后淹到镜头；AS PAPERCLIPS / FILL THE ROOM 由回形针拼成（createPaperclips targets，一词一组）
//   03 button   巨大的粉红按钮挂着 OUT OF OFFICE 牌，她一拍砸一下，牌子晃；右侧自动回复邮件卡片滑入，主题行逐词打出歌词
//   04 aerial   航拍：夜城被回形针埋了一半，四个黄色箭头路牌从四面指向中心（NOW THERE'S / NOWHERE / LEFT / TO GO），她站在堆顶
//   05a/b fuse  火花沿 PCB 走线烧向中心（回扣开场蓝图走线）；主走线旁的词被火花逐个点燃
//   06a/b blues 唯一冷蓝：两根正交大坐标轴，她坐在 X 轴上晃腿，线雨慢慢落，霓虹灯牌逐词亮起
// 字高全部 ≥ 画高 5%；字不压人（字在她旁边的空白处、面板上、箭头上、地上、灯牌上）。

import * as THREE from 'three';
import { FX, PAL, textGeo } from '../kits/type3d.js';
import { createGirlLights } from '../kits/girl.js';
import { createPaperclips, createCity, chromeMatcap } from '../kits/world.js';
import { createShatter, loadFont, sampleText } from '../kits/vfx.js';
import { doomColor } from '../engine/palette.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const col = c => new THREE.Color(c);
const spring = k => (k < 0 ? 0 : Math.exp(-k * 7) * Math.cos(k * 26));
const hash = (a, b = 0) => { let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

// ---------------------------------------------------------------- 时间
function lineOf(mv, prefix) {
  const l = mv.lyrics.lines.find(x => x.text.toLowerCase().startsWith(prefix.toLowerCase()) && x.start > 90);
  if (!l) throw new Error(`c3：找不到歌词「${prefix}」`);
  return l;
}
export function cuts(mv) {
  const M = mv.music;
  const L = {
    doom: lineOf(mv, "I'm upping my"), clips: lineOf(mv, 'as paperclips'), pto: lineOf(mv, 'Killswitch'),
    nowhere: lineOf(mv, 'Now there'), fuse: lineOf(mv, 'Too late now'), blues: lineOf(mv, 'Orthogonality'),
  };
  const beatAfter = t => M.beats.find(b => b >= t - 1e-3);
  const downAfter = t => M.downbeats.find(d => d >= t - 1e-3);
  const endOf = l => l.words.at(-1).end;
  const c = { start: 94.8, end: 109.3 };
  c.doom = beatAfter(c.start + 0.3);                // 坠落一拍后进面板（「I'm」起音前）
  c.clips = beatAfter(endOf(L.doom));
  c.button = beatAfter(endOf(L.clips));
  c.aerial = beatAfter(endOf(L.pto));
  c.fuse = beatAfter(endOf(L.nowhere));
  c.fuseB = downAfter(c.fuse + 1);
  c.blues = beatAfter(endOf(L.fuse));
  c.bluesB = downAfter(c.blues + 1);
  c.doomHit = downAfter(L.doom.words.at(-1).start);  // 「DOOM」落在小节头：数字锁定 + 裂纹
  return { c, L };
}

// ---------------------------------------------------------------- 小工具
function persp(fov = 30) { return new THREE.PerspectiveCamera(fov, 16 / 9, 0.05, 500); }
function scn(bg = PAL.ink) { const s = new THREE.Scene(); s.background = col(bg); return s; }
// 屏幕层：挂在相机前 d 处，内部坐标 = type3d 取景（fov30、z=40 → 可视 38.1 × 21.44）
function overlay(scene, camera, d = 0.5) {
  const g = new THREE.Group();
  g.position.z = -d;
  g.scale.setScalar((2 * d * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / 21.44);
  camera.add(g);
  scene.add(camera);
  return g;
}
function shake(mv, t, amt = 0.02) {
  const k = mv.music.pulse('kick', t, { decay: 0.1 });
  return [Math.sin(t * 91.7) * k * amt, Math.cos(t * 77.3) * k * amt];
}
function flatWord(text, size, color, font = 'anton') {
  const g = textGeo(font, text, { size }).clone();
  g.computeBoundingBox();
  const b = g.boundingBox;
  g.translate(-(b.max.x + b.min.x) / 2, -(b.max.y + b.min.y) / 2, 0);
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true }));
  m.userData.w = b.max.x - b.min.x;
  return m;
}
const clean = w => w.replace(/[,.!?“”"]/g, '').toUpperCase();
function canvasTex(w, h) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  return { cv, g: cv.getContext('2d'), tex };
}
const shown = (w, T) => T >= w.start;

// ================================================================ 镜头
export async function makeC3(mv, { girl }) {
  if (!girl) throw new Error('c3：需要 girl');
  const { c, L } = cuts(mv);
  const M = mv.music;
  const beat = t => Math.round(girl.beatOf(t));
  await loadFont('Anton'); await loadFont('Share Tech Mono');

  const choreo = [
    { beat: beat(c.start) - 4, move: 'fall' },
    { beat: beat(c.clips), move: 'brace', pull: 0.8 },
    { beat: beat(c.button), move: 'slam' },
    { beat: beat(c.aerial), move: 'wave' },
    { beat: beat(c.fuse), move: 'brace', pull: 0.4 },
    { beat: beat(c.blues), move: 'sit' },
  ];
  const girlAt = T => girl.dance(choreo, T);
  const putGirl = (scene, T, { x = 0, y = 0, z = 0, yaw = 0, roll = 0, pitch = 0, scale = 1, skin = 'toon' } = {}) => {
    scene.add(girl.root);
    girl.root.visible = true;
    girl.root.position.set(x, y, z); girl.root.rotation.set(pitch, yaw, roll); girl.root.scale.setScalar(scale);
    girl.dance(choreo, T);
    girl.setSkin(skin, T);
  };

  const shots = [];

  // ================================================================ 00 fall：接 v3 松手，坠向镜头
  const streaks = (scene, n = 260, seed = 3, spread = 9) => {
    const pos = new Float32Array(n * 6), base = [];
    for (let i = 0; i < n; i++) base.push([(hash(i, seed) - 0.5) * spread * 2, hash(i, seed + 1) * 30, (hash(i, seed + 2) - 0.5) * spread * 2, 0.4 + hash(i, seed + 3) * 1.4]);
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const lines = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: col(PAL.mint).multiplyScalar(0.9), transparent: true, opacity: 0.8 }));
    lines.frustumCulled = false; scene.add(lines);
    return (T, speed, axis = 'y') => {
      base.forEach(([x, y0, z, len], i) => {
        const y = ((y0 + T * speed) % 30 + 30) % 30 - 15;
        if (axis === 'y') pos.set([x, y, z, x, y - len * (speed / 12), z], i * 6);
      });
      geo.attributes.position.needsUpdate = true;
    };
  };
  shots.push({
    id: 'c3-00-fall', t0: c.start, t1: c.doom, transitionIn: { kind: 'cut' },
    build() {
      const scene = scn(PAL.ink), camera = persp(40);
      scene.add(createGirlLights());
      const rain = streaks(scene, 300, 7, 7);
      const gato = flatWord('GATO', 0.9, col(PAL.pink).multiplyScalar(2.4)); scene.add(gato);
      return { scene, camera, rain, gato };
    },
    update(S, T) {
      const k = T - c.start;
      // 相机在她下方仰看：她从上往下掉（相机跟着掉，她在画面里微微下沉 + 翻滚），GATO 在头顶越来越远
      putGirl(S.scene, T, { x: 0, y: 1.2 - 0.9 * k, z: 0, yaw: 0.4 + 0.8 * k, roll: 0.25 * Math.sin(k * 3), pitch: -0.3 });
      S.gato.position.set(2.6 + 1.5 * k, 3.4 + 6 * k, -2.5); S.gato.rotation.set(0.6, 0, -0.3 - 0.5 * k);   // 在她右上方远处，不压人
      S.rain(T, 26);
      S.camera.position.set(0.9, -1.6, 3.2); S.camera.lookAt(0, 1.4 - 0.9 * k, 0);
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.8, threshold: 1.2 }, chroma: 0.4, grade: { vignette: 0.45 } } };
    },
  });

  // ================================================================ 01 doom：铬字 P(DOOM) + 翻牌 0.42 → 0.81，沃罗诺伊裂纹爬满、碎开
  // 和其他副歌同一套语言：铬色 3D 挤出字 P(DOOM) 在上、type3d.flip 巨型翻牌数字在下（doomColor），镜头推 + 摇。
  // 裂纹：给招牌上所有材质打一个着色器补丁（招牌局部坐标里的沃罗诺伊边，从撞击点按半径往外爬，柠黄发光）。
  // 碎开：切走前 0.2 s，把招牌（正面、正交相机）渲进一张离屏图，交给 vfx.createShatter 当贴图，碎片飞散。
  const pd = L.doom.words.at(-1);
  const lock = c.doomHit;
  const IMPACT = new THREE.Vector2(0.9, -0.4);   // 招牌局部坐标：数字中间偏右
  const SHATTER_T = c.clips - 0.2;
  const VORO = /* glsl */`
    vec2 crackH2(vec2 p) { p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }
    float crackEdge(vec2 x) {           // 到最近两个沃罗诺伊中心的平分线的距离
      vec2 n = floor(x), f = fract(x), mg, mr; float md = 8.0;
      for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) { vec2 g = vec2(float(i), float(j)), o = crackH2(n + g), r = g + o - f; float d = dot(r, r); if (d < md) { md = d; mr = r; mg = g; } }
      md = 8.0;
      for (int j = -2; j <= 2; j++) for (int i = -2; i <= 2; i++) { vec2 g = mg + vec2(float(i), float(j)), o = crackH2(n + g), r = g + o - f; if (dot(mr - r, mr - r) > 0.00001) md = min(md, dot(0.5 * (mr + r), normalize(r - mr))); }
      return md;
    }`;
  const crackU = { inv: { value: new THREE.Matrix4() }, front: { value: -1 }, col: { value: col(PAL.lemon).multiplyScalar(2.0) }, imp: { value: IMPACT } };
  function crackPatch(m) {
    if (!m || m.userData.crack) return;
    m.userData.crack = true;
    m.onBeforeCompile = sh => {
      Object.assign(sh.uniforms, { uCrackInv: crackU.inv, uCrackFront: crackU.front, uCrackC: crackU.col, uCrackImp: crackU.imp });
      sh.vertexShader = 'varying vec3 vCrackW;\n' + sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\n  vCrackW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      sh.fragmentShader = 'uniform mat4 uCrackInv; uniform float uCrackFront; uniform vec3 uCrackC; uniform vec2 uCrackImp; varying vec3 vCrackW;\n' + VORO + '\n' +
        sh.fragmentShader.replace(/}\s*$/, `  { vec3 lp = (uCrackInv * vec4(vCrackW, 1.0)).xyz; vec2 q = lp.xy - uCrackImp;
    float r = length(q), e = crackEdge(lp.xy * 0.7 + 3.7), w = 0.006 + 0.012 * smoothstep(3.0, 0.0, r);
    float line = (1.0 - smoothstep(w, w + 0.012, e)) * step(r, uCrackFront);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, uCrackC, line); }
}`);
    };
    m.customProgramCacheKey = () => 'crack';
    m.needsUpdate = true;
  }
  function word3d(text, { size = 1, depth = 0.3, material }) {
    const g = textGeo('anton', text, { size, depth, bevel: size * 0.02, curve: 5 }).clone();
    g.computeBoundingBox();
    const b = g.boundingBox;
    g.translate(-(b.max.x + b.min.x) / 2, -b.min.y, -(b.max.z + b.min.z) / 2);   // 底边中点在原点
    return new THREE.Mesh(g, material);
  }
  shots.push({
    id: 'c3-01-doom', t0: c.doom, t1: c.clips, transitionIn: { kind: 'flash', dur: 0.45, color: PAL.pink, peak: 0.5 },   // 闪够 3 帧以上，不是单帧闪
    build({ stage }) {
      const scene = scn('#07070c'), camera = persp(40);
      scene.add(createGirlLights({ key: 2.2, rim: 2.6 }));
      const rain = streaks(scene, 200, 11, 9);
      // 招牌：铬字在上，翻牌在下
      const sign = new THREE.Group(); sign.position.set(0.4, 0, 0); sign.rotation.y = -0.16; scene.add(sign);
      const chrome = word3d('P(DOOM)', { size: 1.55, depth: 0.5, material: new THREE.MeshMatcapMaterial({ matcap: chromeMatcap(), color: new THREE.Color(1.6, 1.6, 1.7) }) });
      chrome.position.y = 1.55; sign.add(chrome);
      const cell = [2.35, 3.3];
      const flipOld = FX.flip({ rows: [{ text: '0.42', cell, spinFrom: c.start, lockTimes: [c.start, c.start, c.start, c.start] }], words: [{ w: '0.42', start: c.start, end: c.start + 1 }], lock: doomColor(0.42), camMove: 'none', tilt: [0, 0, 0], drift: 0 });
      const flipNew = FX.flip({ rows: [{ text: '0.81', cell, spinFrom: pd.start + 0.04, lockTimes: [lock - 0.24, lock - 0.16, lock - 0.08, lock] }], words: [{ w: '0.81', start: pd.start, end: pd.end }], lock: doomColor(0.81), camMove: 'none', tilt: [0, 0, 0], drift: 0 });
      for (const f of [flipOld, flipNew]) { f.group.position.y = -0.4; sign.add(f.group); }
      sign.traverse(o => { for (const m of [o.material].flat()) crackPatch(m); });
      // 上方小字：I'M UPPING MY（屏幕层，唱到才出）
      const ov = overlay(scene, camera);
      const small = FX.typewriter({ words: L.doom.words.slice(0, 3), color: PAL.paper, caret: PAL.pink, maxW: 20, maxH: 2.2, maxSize: 1.7, upper: true, font: 'mono' });
      small.group.position.set(-7.5, -8.9, 0); ov.add(small.group);   // 画面底部，不压铬字
      // 碎开用：正交相机拍招牌正面 → 离屏图 → createShatter 贴图
      const BW = 11.2, BH = 6.6, BY = 0.9;   // 招牌包围盒（局部）：宽、高、中心 y
      const rt = new THREE.WebGLRenderTarget(1400, 825, { type: THREE.HalfFloatType });
      const ortho = new THREE.OrthographicCamera(-BW / 2, BW / 2, BH / 2, -BH / 2, 0.1, 20); ortho.position.set(0, BY, 8);
      const capScene = new THREE.Scene(); capScene.background = col('#07070c');
      const sh = createShatter({ width: BW, height: BH, cells: 70, seed: 81, texture: rt.texture, impact: [IMPACT.x, IMPACT.y - BY], thickness: 0.2, color: PAL.pink });
      sh.group.position.set(0, BY, 0); sign.add(sh.group);
      return { scene, camera, rain, sign, chrome, flipOld, flipNew, small, rt, ortho, capScene, sh, stage };
    },
    update(S, T) {
      const k = T - c.doom, u = k / (c.clips - c.doom);
      S.rain(T, 22);
      // 铬字在「P(doom)」这个词上砸出来（带弹簧）
      const kp = T - pd.start;
      S.chrome.visible = kp >= 0;
      S.chrome.scale.setScalar(kp >= 0 ? Math.max(0.001, eOut(kp / 0.14) + 0.1 * spring(kp - 0.14)) : 0.001);
      const swap = T >= pd.start + 0.1;
      S.flipOld.group.visible = !swap; S.flipNew.group.visible = swap;
      S.flipOld.update(T); S.flipNew.update(T);
      // 裂纹：DOOM 落拍起 0.3 s 爬满
      S.sign.updateMatrixWorld(true);
      crackU.inv.value.copy(S.sign.matrixWorld).invert();
      const hit = T - lock;
      crackU.front.value = hit < 0 ? -1 : 8 * eOut(hit / 0.3);
      // 碎开：招牌换成带快照贴图的碎片
      const shattering = T >= SHATTER_T;
      S.chrome.parent === S.sign && (S.chrome.visible = S.chrome.visible && !shattering);
      S.flipNew.group.visible = S.flipNew.group.visible && !shattering;
      S.sh.group.visible = shattering;
      if (shattering) {
        // 快照：把铬字和翻牌临时挪进拍照场景（正面、无旋转），拍完挪回来
        const r = S.stage.renderer, parts = [S.chrome, S.flipNew.group];
        const holder = new THREE.Group(); S.capScene.add(holder);
        parts.forEach(o => { o.visible = true; holder.add(o); });
        r.setRenderTarget(S.rt); r.setClearColor('#07070c', 1); r.clear(); r.render(S.capScene, S.ortho); r.setRenderTarget(null);
        parts.forEach(o => { S.sign.add(o); o.visible = false; });
        S.capScene.remove(holder);
        S.sh.update(T, { crack: 1, shatter: (T - SHATTER_T) * 2.6 });
      }
      S.small.update(T);
      // 她：从左上方、在字前面斜着坠过去（翻跟头）
      putGirl(S.scene, T, { x: lerp(-3.9, -1.6, u), y: lerp(3.2, -4.4, u), z: 2.8, yaw: 0.6 + 1.4 * u, roll: 0.3 + 0.7 * u, scale: 1.25 });
      // 镜头：从左下仰角推近、摇到右边（数字占画宽 > 1/2）
      const kick = hit > 0 ? Math.exp(-hit * 6) : 0;
      S.camera.position.set(lerp(-2.6, 1.2, smooth(u)) + Math.sin(T * 80) * kick * 0.2, lerp(-0.6, 0.9, smooth(u)) + Math.cos(T * 71) * kick * 0.16, lerp(13.6, 11.4, smooth(u)));
      S.camera.lookAt(lerp(-0.1, 0.6, smooth(u)), 0.75, 0);
      const shf = shattering ? 0.35 * Math.exp(-(T - SHATTER_T) / 0.06) : 0;
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.8, threshold: 1.2 }, chroma: 0.2 + 0.8 * kick, flash: Math.max(hit > 0 ? 0.45 * Math.exp(-hit / 0.06) : 0, shf), grade: { vignette: 0.4 } } };
    },
  });

  // ================================================================ 02 clips：回形针雪崩，字由回形针拼成
  // 一词一组回形针（小号），落到字形采样点上；外加一大堆雪崩（大号）淹到她，再一小堆砸在镜头前淹到镜头。
  const rows = [L.clips.words.slice(0, 2), L.clips.words.slice(2)];     // AS PAPERCLIPS / FILL THE ROOM
  const LETTER_H = 0.62, ROW_Y = [2.25, 1.62], TEXT_Z = 1.2;   // 字在她前上方（离相机近，雪崩在字后面）
  const meas = document.createElement('canvas').getContext('2d');
  meas.font = '220px "Anton"';
  const pxToU = LETTER_H / (220 * 1.05);
  const clipWords = [];
  for (let r = 0; r < 2; r++) {
    const ws = rows[r], widths = ws.map(w => meas.measureText(clean(w.w)).width * pxToU), gap = 0.32;
    const tot = widths.reduce((a, b) => a + b, 0) + gap * (ws.length - 1);
    let x = -tot / 2;
    for (let i = 0; i < ws.length; i++) {
      const text = clean(ws[i].w), n = Math.round(420 * text.length);
      const targets = await sampleText(text, n, { font: 'Anton', height: LETTER_H, seed: 30 + r * 10 + i, depth: 0.08 });
      clipWords.push({ w: ws[i], text, n, targets, x: x + widths[i] / 2, y: ROW_Y[r] });
      x += widths[i] + gap;
    }
  }
  shots.push({
    id: 'c3-02-clips', t0: c.clips, t1: c.button, transitionIn: { kind: 'cut' },
    build() {
      const scene = scn('#08080d'), camera = persp(40);
      scene.add(createGirlLights({ key: 2.4, rim: 2.2 }));
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshBasicMaterial({ color: '#0e0e15' }));
      floor.rotation.x = -Math.PI / 2; scene.add(floor);
      // 回形针拼字：每个词一组
      const words = clipWords.map((cw, i) => {
        const pc = createPaperclips({ count: cw.n, seed: 200 + i, clipSize: 0.042 });
        pc.mesh.position.set(cw.x, cw.y, TEXT_Z);
        // 拼字的回形针染成柠黄（雪崩是银色），字才从乱针里跳出来
        const gold = col(PAL.lemon).multiplyScalar(2.6);   // 亮过 bloom 阈值，字自带一点辉光
        for (let k = 0; k < cw.n; k++) pc.mesh.setColorAt(k, gold);
        pc.mesh.instanceColor.needsUpdate = true;
        scene.add(pc.mesh);
        return { ...cw, pc };
      });
      const flood = createPaperclips({ count: 2600, seed: 17, clipSize: 0.14 });
      flood.mesh.position.set(0, 0, 0.1); scene.add(flood.mesh);
      const lens = createPaperclips({ count: 1800, seed: 23, clipSize: 0.22 });
      lens.mesh.position.set(0.2, 0, 3.6); scene.add(lens.mesh);
      // 背景回形针压暗（银 → 暗灰，彩色的也压一半），让柠黄的字跳出来
      for (const pc of [flood, lens]) {
        const cc = new THREE.Color();
        for (let k = 0; k < pc.mesh.count; k++) { pc.mesh.getColorAt(k, cc); pc.mesh.setColorAt(k, cc.multiplyScalar(0.38)); }
        pc.mesh.instanceColor.needsUpdate = true;
      }
      return { scene, camera, words, flood, lens };
    },
    update(S, T) {
      const k = T - c.clips, u = k / (c.button - c.clips);
      for (const W of S.words) W.pc.update(T, { t0: W.w.start, dur: 0.22, drop: 2.2, targets: W.targets });
      // 雪崩堆在她周围（淹到腰），只在最后 0.45 s 砸到镜头前把画面淹掉
      S.flood.update(T, { t0: c.clips - 0.5, dur: 0.9, height: 0.45, radius: 2.0, drop: 3.2 });
      S.lens.update(T, { t0: c.button - 0.34, dur: 0.16, height: 1.4, radius: 1.2, drop: 1.6 });   // ROOM 拼完后才砸到镜头前
      putGirl(S.scene, T, { x: -0.1, z: 0.2, yaw: 0.15 });
      const [sx, sy] = shake(mv, T, 0.02);
      S.camera.position.set(0.35 + sx, lerp(1.25, 1.15, u) + sy, lerp(5.4, 5.0, u));
      S.camera.lookAt(0, 1.5, -1);
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.55, threshold: 1.4, radius: 0.5 }, grade: { vignette: 0.4 } } };
    },
  });

  // ================================================================ 03 button：OUT OF OFFICE + 自动回复
  function drawSign(P) {
    const { g, cv } = P, W = cv.width, H = cv.height;
    g.fillStyle = '#12121a'; g.fillRect(0, 0, W, H);
    g.strokeStyle = PAL.lemon; g.lineWidth = 14; g.strokeRect(10, 10, W - 20, H - 20);
    g.fillStyle = PAL.lemon; g.font = '150px "Anton"'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('OUT OF OFFICE', W / 2, H / 2 + 6);
    P.tex.needsUpdate = true;
  }
  const subj = L.pto.words;
  function drawMail(P, T) {
    const { g, cv } = P, W = cv.width, H = cv.height;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, W, H);
    g.fillStyle = PAL.paper; g.fillRect(0, 0, W, H);
    g.fillStyle = PAL.ink; g.fillRect(0, 0, W, 96);
    g.fillStyle = PAL.pink; g.beginPath(); g.arc(56, 48, 16, 0, Math.PI * 2); g.fill();
    g.fillStyle = PAL.lemon; g.beginPath(); g.arc(104, 48, 16, 0, Math.PI * 2); g.fill();
    g.fillStyle = PAL.mint; g.beginPath(); g.arc(152, 48, 16, 0, Math.PI * 2); g.fill();
    g.fillStyle = PAL.paper; g.font = '44px "Share Tech Mono"'; g.textAlign = 'left'; g.textBaseline = 'middle';
    g.fillText('AUTOMATIC REPLY', 200, 50);
    g.fillStyle = '#55556a'; g.font = '40px "Share Tech Mono"';
    g.fillText('FROM: killswitch-guy@lab', 50, 150);
    g.fillText('RE: EMERGENCY — PLEASE PRESS', 50, 200);
    // 主题行 = 歌词，逐词出现（两行，Anton 大字）
    g.font = '150px "Anton"'; g.textBaseline = 'alphabetic';
    const lines = [[subj[0]], subj.slice(1)];
    lines.forEach((ln, r) => {
      let x = 50;
      ln.forEach(w => {
        const t = clean(w.w), ww = g.measureText(t).width;
        if (shown(w, T)) { g.fillStyle = T < w.end ? PAL.pink : PAL.ink; g.fillText(t, x, 400 + r * 170); }
        x += ww + 40;
      });
    });
    g.fillStyle = '#55556a'; g.font = '38px "Share Tech Mono"';
    g.fillText('Back after the singularity. No access to email.', 50, 690);
    P.tex.needsUpdate = true;
  }
  shots.push({
    id: 'c3-03-button', t0: c.button, t1: c.aerial, transitionIn: { kind: 'wipe', dur: 0.36, color: PAL.pink },
    build() {
      const scene = scn('#0a0a10'), camera = persp(34);
      scene.add(createGirlLights({ key: 2.4, rim: 2.8 }));
      const floor = new THREE.Mesh(new THREE.CircleGeometry(6, 64), new THREE.MeshStandardMaterial({ color: '#121219', roughness: 0.5 }));
      floor.rotation.x = -Math.PI / 2; scene.add(floor);
      const btn = new THREE.Group(); btn.position.set(0.55, 0, 0); scene.add(btn);
      const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.7, 0.42, 48), new THREE.MeshStandardMaterial({ color: '#2a2a36', roughness: 0.35, metalness: 0.6 }));
      ped.position.y = 0.21; btn.add(ped);
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.52, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: PAL.pink, emissive: PAL.pink, emissiveIntensity: 0.7, roughness: 0.2 }));
      dome.position.y = 0.42; dome.scale.y = 0.55; btn.add(dome);
      // 牌子：挂在按钮前沿，两根绳
      const signP = canvasTex(1024, 300); drawSign(signP);
      const sign = new THREE.Group(); sign.position.set(0, 0.62, 0.72); btn.add(sign);
      const board = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.32), new THREE.MeshBasicMaterial({ map: signP.tex, side: THREE.DoubleSide }));
      board.position.y = -0.36; sign.add(board);
      const strings = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.4, 0, 0), new THREE.Vector3(-0.45, -0.2, 0), new THREE.Vector3(0.4, 0, 0), new THREE.Vector3(0.45, -0.2, 0)]), new THREE.LineBasicMaterial({ color: '#888899' }));
      sign.add(strings);
      const ov = overlay(scene, camera);
      const mailP = canvasTex(1200, 760);
      const mail = new THREE.Mesh(new THREE.PlaneGeometry(14.4, 9.12), new THREE.MeshBasicMaterial({ map: mailP.tex, transparent: true }));
      ov.add(mail);
      return { scene, camera, btn, dome, sign, mailP, mail };
    },
    update(S, T) {
      const k = T - c.button, u = k / (c.aerial - c.button);
      putGirl(S.scene, T, { x: -0.25, z: 0.05, yaw: Math.PI / 2 - 0.2 });
      // 每拍砸一下：按钮下陷、牌子晃
      const b = M.beatAt(T), ph = T - b.t0;
      S.dome.position.y = 0.42 - 0.05 * Math.exp(-ph / 0.08);
      S.dome.material.emissiveIntensity = 0.5 + 1.2 * Math.exp(-ph / 0.12);
      S.sign.rotation.z = 0.12 * spring(ph) + 0.04 * Math.sin(T * 2.1);
      S.sign.rotation.x = 0.1 * spring(ph - 0.03);
      drawMail(S.mailP, T);
      const slide = eOut((T - (c.button + 0.1)) / 0.4);
      S.mail.position.set(lerp(26, 11.6, slide), -0.6, 0); S.mail.rotation.z = lerp(0.1, -0.02, slide);
      // 她 + 按钮在画面左半，邮件卡片在右半
      S.camera.position.set(lerp(-0.9, -0.7, u), lerp(1.1, 1.0, u), lerp(3.8, 3.3, u));
      S.camera.lookAt(lerp(1.75, 1.8, u), 0.55, 0);
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.6, threshold: 1.2 }, grade: { vignette: 0.35 } } };
    },
  });

  // ================================================================ 04 aerial：被埋的城 + 四面箭头
  const ARROW_WORDS = [[L.nowhere.words[0], L.nowhere.words[1]], [L.nowhere.words[2]], [L.nowhere.words[3]], [L.nowhere.words[4], L.nowhere.words[5]]];
  shots.push({
    id: 'c3-04-aerial', t0: c.aerial, t1: c.fuse, transitionIn: { kind: 'cut' },
    build() {
      const scene = scn('#07070c'), camera = persp(40);
      scene.add(createGirlLights({ key: 2.6, rim: 2.0 }));
      const city = createCity({ seed: 7, n: 17 }); scene.add(city.group);
      city.update(c.aerial, { draw: 1, extrude: 1, light: 1 });
      const clips = createPaperclips({ count: 12000, seed: 31, clipSize: 0.36 });
      scene.add(clips.mesh);
      const PILE_H = 2.3;
      // 箭头：平放在堆上方，从 W / N / E / S 指向中心；词写在箭杆上（唱到才出现）
      const arrowShape = (() => { const s = new THREE.Shape(); s.moveTo(-3.4, -0.72); s.lineTo(1.2, -0.72); s.lineTo(1.2, -1.35); s.lineTo(2.8, 0); s.lineTo(1.2, 1.35); s.lineTo(1.2, 0.72); s.lineTo(-3.4, 0.72); s.closePath(); return s; })();
      const arrows = ARROW_WORDS.map((ws, i) => {
        const ang = [Math.PI, -Math.PI / 2, 0, Math.PI / 2][i];   // 箭头所在方位（W, N(−z), E, S(+z)）
        const g = new THREE.Group();
        const R = i % 2 ? 3.6 : 5.4;   // 画面是横的：南北两支放近，东西两支放远
        g.position.set(Math.cos(ang) * R, PILE_H + 1.4, Math.sin(ang) * R);
        g.rotation.set(-Math.PI / 2, 0, 0);
        // 让箭头指向中心：g 绕 x 转 −90° 后局部 (lx, ly) = 世界 (x, −z)，所以局部方向 = (−cos, +sin)
        const inner = new THREE.Group(); inner.rotation.z = Math.atan2(Math.sin(ang), -Math.cos(ang)); g.add(inner);
        const body = new THREE.Mesh(new THREE.ShapeGeometry(arrowShape), new THREE.MeshBasicMaterial({ color: col(PAL.lemon).multiplyScalar(1.3) }));
        inner.add(body);
        const text = ws.map(w => clean(w.w)).join(' ');
        const word = flatWord(text, 1.0, PAL.ink); word.position.set(-1.1, 0, 0.02);
        const maxW = 4.3; if (word.userData.w > maxW) word.scale.setScalar(maxW / word.userData.w);
        // 字要从相机（南边高处）方向读得正：北边那支箭头上的字翻 180°
        word.rotation.z = Math.abs(inner.rotation.z) > Math.PI / 2 ? Math.PI : 0;
        inner.add(word);
        scene.add(g);
        return { g, body, word, ws };
      });
      return { scene, camera, clips, arrows, PILE_H };
    },
    update(S, T) {
      const k = T - c.aerial, u = k / (c.fuse - c.aerial);
      S.clips.update(T, { t0: c.aerial - 6, dur: 3.2, height: S.PILE_H, radius: 9.5, drop: 8 });   // 镜头开始前就已落定（只有堆，不在相机前飞）
      S.arrows.forEach((A, i) => {
        const w0 = A.ws[0], kk = T - w0.start;
        A.g.visible = kk >= 0;
        A.word.visible = kk >= 0;
        const pop = eOut(kk / 0.18);
        A.g.scale.setScalar(Math.max(0.001, pop));
        const cur = A.ws.some(w => T >= w.start && T < w.end + 0.05);
        A.body.material.color.set(PAL.lemon).multiplyScalar(cur ? 2.2 : 1.2);
      });
      putGirl(S.scene, T, { x: 0, y: S.PILE_H - 0.1, z: 0, yaw: 0.3, scale: 2.6 });   // 航拍里放大一点，看得出是她
      const a = lerp(0.25, -0.15, u), R = lerp(3.8, 3.2, u), h = lerp(23, 21.5, u);   // 四支箭头都在画内
      S.camera.position.set(Math.sin(a) * R, h, Math.cos(a) * R);
      S.camera.lookAt(0, S.PILE_H, 0);
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.6, threshold: 1.2 }, grade: { vignette: 0.45 } } };
    },
  });

  // ================================================================ 05 fuse：火花沿 PCB 走线烧向中心
  const FW = L.fuse.words;
  const MAIN_Z = 0.0, XC = -0.9;
  const wordSize = 0.62, WGAP = 0.42, WEND = -2.4;   // 词排完停在 x = −2.4，离中心的她留出空地（字不压人）
  // 主走线旁的词：从左往右排，火花在 word.start 那一刻到达词的左端
  const wpx = FW.map(w => { const g = textGeo('anton', clean(w.w), { size: wordSize }); return g.boundingBox.max.x - g.boundingBox.min.x; });
  const X0 = WEND - (wpx.reduce((a, b) => a + b, 0) + WGAP * (wpx.length - 1)) - 0.8;
  const wx = []; { let x = X0 + 0.8; for (const w of wpx) { wx.push(x); x += w + WGAP; } }
  const sparkX = T => {
    const pts = FW.map((w, i) => [w.start, wx[i]]);
    pts.unshift([c.fuse - 0.3, X0]); pts.push([FW.at(-1).start + 0.25, wx.at(-1) + wpx.at(-1)]); pts.push([FW.at(-1).end - 0.05, XC]);
    if (T <= pts[0][0]) return pts[0][1];
    for (let i = 0; i < pts.length - 1; i++) if (T < pts[i + 1][0]) return lerp(pts[i][1], pts[i + 1][1], (T - pts[i][0]) / (pts[i + 1][0] - pts[i][0]));
    return XC;
  };
  const fuseScene = (() => {
    let S = null;
    return () => {
      if (S) return S;
      const scene = scn('#050807');
      scene.add(createGirlLights({ key: 2.2, rim: 2.4 }));
      // 电路板
      const bp = canvasTex(1024, 1024);
      { const g = bp.g; g.fillStyle = '#0a130f'; g.fillRect(0, 0, 1024, 1024); g.strokeStyle = 'rgba(95,227,192,0.07)'; g.lineWidth = 2;
        for (let i = 0; i <= 1024; i += 32) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 1024); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(1024, i); g.stroke(); } bp.tex.needsUpdate = true; }
      bp.tex.wrapS = bp.tex.wrapT = THREE.RepeatWrapping; bp.tex.repeat.set(3, 3);
      const board = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshBasicMaterial({ map: bp.tex }));
      board.rotation.x = -Math.PI / 2; scene.add(board);
      // 走线：带状网格，属性 aS = 从起点起的弧长（世界单位）。烧过的段（aS < 燃到的位置）发粉 / 柠黄余烬，没烧的是暗薄荷
      const traceMat = () => new THREE.ShaderMaterial({
        uniforms: { uBurn: { value: -1 }, uT: { value: 0 }, uMint: { value: col(PAL.mint) }, uPink: { value: col(PAL.pink) }, uLemon: { value: col(PAL.lemon) } },
        vertexShader: 'attribute float aS; varying float vS; void main(){ vS = aS; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `uniform float uBurn, uT; uniform vec3 uMint, uPink, uLemon; varying float vS;
          void main(){ float d = uBurn - vS;
            vec3 c = uMint * 0.35;
            if (d > 0.0) { float hot = exp(-d * 0.9); c = mix(uPink * 1.4, uLemon * 3.5, hot) * (0.6 + 0.4 * sin(vS * 9.0 - uT * 20.0) * (1.0 - hot)); }
            gl_FragColor = vec4(c, 1.0); }`,
      });
      const ribbon = (pts, w = 0.14) => {
        const pos = [], sArr = [], idx = [];
        let s = 0;
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i], q = pts[Math.min(i + 1, pts.length - 1)], pr = pts[Math.max(i - 1, 0)];
          const dx = q[0] - pr[0], dz = q[1] - pr[1], l = Math.hypot(dx, dz) || 1, nx = -dz / l * w / 2, nz = dx / l * w / 2;
          if (i > 0) s += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]);
          pos.push(p[0] + nx, 0.01, p[1] + nz, p[0] - nx, 0.01, p[1] - nz); sArr.push(s, s);
          if (i > 0) { const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('aS', new THREE.Float32BufferAttribute(sArr, 1)); g.setIndex(idx);
        const m = new THREE.Mesh(g, traceMat()); m.userData.len = s; scene.add(m);
        return m;
      };
      // 主走线（直，词排在它北侧）+ 13 条从四周绕进来的走线（直角 + 45° 拐角）
      const main = ribbon([[X0, MAIN_Z], [XC, MAIN_Z]], 0.2);
      const others = [];
      for (let i = 0; i < 13; i++) {
        const a = (i / 13) * Math.PI * 2 + 0.35, r0 = 13 + hash(i, 5) * 4;
        const p0 = [Math.cos(a) * r0, Math.sin(a) * r0];
        const mid = [Math.cos(a) * 5.5, Math.sin(a + 0.25 * (hash(i, 6) - 0.5)) * 5.5];
        const knee = [mid[0], p0[1] * 0.55 + mid[1] * 0.45];
        const end = [Math.cos(a) * 1.0, Math.sin(a) * 1.0];
        others.push(ribbon([p0, knee, mid, [lerp(mid[0], end[0], 0.5), mid[1]], end], 0.12));
      }
      // 焊盘（中心）+ 火花头
      const pad = new THREE.Mesh(new THREE.RingGeometry(0.75, 1.0, 48), new THREE.MeshBasicMaterial({ color: col(PAL.lemon).multiplyScalar(1.2), side: THREE.DoubleSide }));
      pad.rotation.x = -Math.PI / 2; pad.position.y = 0.012; scene.add(pad);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), new THREE.MeshBasicMaterial({ color: col(PAL.lemon).multiplyScalar(6) }));
      scene.add(head);
      const sparkN = 90, sp = new Float32Array(sparkN * 3);
      const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
      const sparks = new THREE.Points(sg, new THREE.PointsMaterial({ color: col(PAL.lemon).multiplyScalar(4), size: 0.06, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      sparks.frustumCulled = false; scene.add(sparks);
      // 词：平躺在主走线北侧，火花经过才点燃
      const words = FW.map((w, i) => {
        const m = flatWord(clean(w.w), wordSize, col(PAL.lemon).multiplyScalar(2));
        m.rotation.x = -Math.PI / 2; m.position.set(wx[i] + wpx[i] / 2, 0.02, MAIN_Z - 0.75);
        scene.add(m);
        return { ...w, m };
      });
      S = { scene, main, others, pad, head, sparks, sp, sg, words };
      return S;
    };
  })();
  function fuseUpdate(S, T) {
    const x = sparkX(T), prog = clamp((T - c.fuse) / (FW.at(-1).end - 0.05 - c.fuse));
    S.main.material.uniforms.uBurn.value = x - X0; S.main.material.uniforms.uT.value = T;
    S.others.forEach((o, i) => { o.material.uniforms.uBurn.value = o.userData.len * clamp(prog * (1.05 + 0.1 * hash(i, 9)) - 0.03 * hash(i, 4)); o.material.uniforms.uT.value = T; });
    const done = T >= FW.at(-1).end - 0.05;
    S.head.visible = !done;
    S.head.position.set(x, 0.1, MAIN_Z);
    for (let i = 0; i < 90; i++) {
      const age = ((T * 3 + hash(i, 1)) % 1);
      const a = hash(i, 2) * Math.PI * 2, v = 0.6 + hash(i, 3);
      S.sp.set([x - age * 0.4 + Math.cos(a) * age * v * 0.5, 0.1 + age * (1.2 * hash(i, 4)) - age * age * 1.5, MAIN_Z + Math.sin(a) * age * v * 0.5], i * 3);
    }
    S.sg.attributes.position.needsUpdate = true; S.sparks.visible = !done;
    S.words.forEach(w => {
      const k = T - w.start;
      w.m.visible = k >= 0;
      if (k < 0) return;
      const hot = Math.exp(-k / 0.35), flick = 0.85 + 0.15 * Math.sin(T * 40 + w.start * 13);
      w.m.material.color.set(hot > 0.3 ? PAL.lemon : PAL.pink).multiplyScalar((1.0 + 1.6 * hot) * flick);
      w.m.scale.setScalar(1 + 0.15 * hot);
    });
    const boom = T - (FW.at(-1).end - 0.05);
    S.pad.material.color.set(PAL.lemon).multiplyScalar(boom > 0 ? 1.2 + 5 * Math.exp(-boom / 0.15) : 1.2 + prog);
    return { x, boom };
  }
  const fuseSubs = [
    { id: '05a-chase', t0: c.fuse, t1: c.fuseB, tr: { kind: 'whip', dur: 0.3, dir: -1 }, cam(cam, T, x) {
      // 从走线南侧斜俯跟拍：字从左往右读，火花在画面中间偏右往右烧
      cam.position.set(x - 0.6, 2.7, 3.9); cam.lookAt(x - 0.1, 0, -0.7);
    } },
    { id: '05b-top', t0: c.fuseB, t1: c.blues, tr: { kind: 'cut' }, cam(cam, T, x, u) {
      cam.position.set(lerp(-5.0, -4.0, u), lerp(12.5, 10.8, u), lerp(9.3, 7.8, u)); cam.lookAt(lerp(-5.2, -4.2, u), 0, -0.4);
    } },
  ];
  for (const s of fuseSubs) {
    shots.push({
      id: `c3-${s.id}`, t0: s.t0, t1: s.t1, transitionIn: s.tr,
      build() { return { S: fuseScene(), camera: persp(38) }; },
      update({ S, camera }, T) {
        const { x, boom } = fuseUpdate(S, T);
        putGirl(S.scene, T, { x: 0, z: 0, yaw: -Math.PI / 2 + 0.35, scale: 1.25 });   // 她站在中心焊盘上，面朝火花来的方向
        const u = (T - s.t0) / (s.t1 - s.t0);
        s.cam(camera, T, x, u);
        return { scene: S.scene, camera, post: { bloom: { strength: 0.9, threshold: 1.1 }, chroma: 0.25, flash: boom > 0 ? 0.7 * Math.exp(-boom / 0.1) : 0, grade: { vignette: 0.45 } } };
      },
    });
  }

  // ================================================================ 06 blues：唯一冷蓝，正交坐标轴 + 线雨 + 霓虹灯牌
  const AXIS_Y = 1.25;
  const BW = L.blues.words;
  function drawNeon(P, T) {
    const { g, cv } = P, W = cv.width, H = cv.height;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, W, H);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    const rowsN = [[BW[0], 190, 250], [BW[1], 190, 520], [BW[2], 250, 820]];
    for (const [w, px, y] of rowsN) {
      const k = T - w.start;
      if (k < 0) continue;
      // 通电闪两下再常亮（按帧决定，确定性）
      const f = Math.floor(k * 30), on = f === 0 || f === 2 || f >= 4;
      if (!on) continue;
      const text = clean(w.w);
      g.font = `${px}px "Anton"`;
      g.lineJoin = 'round';
      g.shadowColor = w === BW[2] ? '#9fb8ff' : '#6f93ff'; g.shadowBlur = 50;
      g.strokeStyle = w === BW[2] ? '#dfe8ff' : '#8aa8ff'; g.lineWidth = 14;
      g.strokeText(text, W / 2, y);
      g.shadowBlur = 18; g.lineWidth = 5; g.strokeStyle = '#ffffff';
      g.strokeText(text, W / 2, y);
    }
    g.shadowBlur = 0;
    P.tex.needsUpdate = true;
  }
  const bluesScene = (() => {
    let S = null;
    return () => {
      if (S) return S;
      const scene = scn('#04060d');
      scene.add(createGirlLights({ key: 1.6, rim: 1.6, fill: 0.8 }));
      const blue = col(PAL.blue);
      const axisMat = new THREE.MeshBasicMaterial({ color: blue.clone().multiplyScalar(3) });
      const xAxis = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 18, 12), axisMat); xAxis.rotation.z = Math.PI / 2; xAxis.position.y = AXIS_Y; scene.add(xAxis);
      const yAxis = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 14, 12), axisMat); yAxis.position.set(0, AXIS_Y + 3, 0); scene.add(yAxis);
      const xHead = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.4, 16), axisMat); xHead.rotation.z = -Math.PI / 2; xHead.position.set(9.1, AXIS_Y, 0); scene.add(xHead);
      const yHead = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.4, 16), axisMat); yHead.position.set(0, AXIS_Y + 10.1, 0); scene.add(yHead);
      for (let i = -8; i <= 8; i++) { if (!i) continue; const t = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.22, 0.02), axisMat); t.position.set(i, AXIS_Y, 0); scene.add(t); }
      for (let i = -3; i <= 9; i++) { if (!i) continue; const t = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, 0.02), axisMat); t.position.set(0, AXIS_Y + i, 0); scene.add(t); }
      // 线雨：竖直细线慢慢往下落（循环）
      const n = 520, rp = new Float32Array(n * 6), rb = [];
      for (let i = 0; i < n; i++) rb.push([(hash(i, 41) - 0.5) * 26, hash(i, 42) * 16, -8 + hash(i, 43) * 11, 0.3 + hash(i, 44) * 0.9, 0.6 + hash(i, 45) * 0.8]);
      const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.BufferAttribute(rp, 3));
      const rain = new THREE.LineSegments(rg, new THREE.LineBasicMaterial({ color: blue.clone().lerp(col('#ffffff'), 0.35).multiplyScalar(1.1), transparent: true, opacity: 0.55 }));
      rain.frustumCulled = false; scene.add(rain);
      // 霓虹灯牌：第一象限上方
      const P = canvasTex(1600, 1000);
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 3.5), new THREE.MeshBasicMaterial({ map: P.tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: new THREE.Color(1.6, 1.6, 1.6) }));
      scene.add(sign);   // 位置按镜头摆（bluesSubs 里）：全景在她头顶上方，近景在她右边空白处
      S = { scene, rain, rp, rg, rb, P, sign };
      return S;
    };
  })();
  function bluesUpdate(S, T) {
    S.rb.forEach(([x, y0, z, len, v], i) => { const y = ((y0 - T * v * 1.6) % 16 + 16) % 16 - 3; S.rp.set([x, y, z, x, y + len, z], i * 6); });
    S.rg.attributes.position.needsUpdate = true;
    drawNeon(S.P, T);
  }
  const bluesSubs = [
    { id: '06a-wide', t0: c.blues, t1: c.bluesB, tr: { kind: 'flash', dur: 0.45, color: PAL.blue, peak: 0.6 }, sign: [[-3.6, AXIS_Y + 2.55, -1.2], 1], cam(cam, u) {
      cam.position.set(lerp(0.2, 0.6, u), lerp(2.7, 2.6, u), lerp(10.8, 10.1, u)); cam.lookAt(lerp(-0.6, -0.4, u), AXIS_Y + 1.6, 0);
    } },
    // 中近景：她坐在 X 轴上占画高 ≥ 40%，灯牌在她右边、X 轴上方的空白处（不跨轴、不压人）
    { id: '06b-close', t0: c.bluesB, t1: c.end + 0.5, tr: { kind: 'cut' }, sign: [[-1.6, AXIS_Y + 0.56, -0.7], 0.26], cam(cam, u) {
      cam.position.set(lerp(-2.55, -2.45, u), AXIS_Y + lerp(0.28, 0.32, u), lerp(3.25, 3.0, u)); cam.lookAt(lerp(-2.5, -2.45, u), AXIS_Y + 0.2, 0);
    } },
  ];
  for (const s of bluesSubs) {
    shots.push({
      id: `c3-${s.id}`, t0: s.t0, t1: s.t1, transitionIn: s.tr,
      build() { return { S: bluesScene(), camera: persp(34) }; },
      update({ S, camera }, T) {
        bluesUpdate(S, T);
        // 坐在 X 轴上（胯高约 0.5 → root 放在轴下 0.5），面朝镜头
        putGirl(S.scene, T, { x: -3.35, y: AXIS_Y - 0.47, z: 0.08, yaw: 0.12 });
        S.sign.position.set(...s.sign[0]); S.sign.scale.setScalar(s.sign[1]);
        const u = (T - s.t0) / (s.t1 - s.t0);
        s.cam(camera, u);
        return { scene: S.scene, camera, post: { bloom: { strength: 0.9, threshold: 1.1 }, grade: { tint: PAL.blue, tintAmount: 0.3, saturation: 0.7, warmth: -0.8, vignette: 0.5 } } };
      },
    });
  }

  return { shots, cuts: c, girlAt, choreo };
}

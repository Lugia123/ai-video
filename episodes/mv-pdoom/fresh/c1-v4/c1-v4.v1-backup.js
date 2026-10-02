// shots/c1-v4.js — 副歌 1 v4（歌曲时间 22.509–38.4 s）。#1024
// 分镜：fresh/c1-v4/plan.md（总管 10-01 通过）。
//
//   const shots = await makeC1V4(mv);   // c1-v4.html 单独挂；拼接页（v4-0to58.html）检测到这个文件自动换掉占位
//
// 一个世界：跑酷段那条路（createSpiralRun，同 seed、远处是 v4-03 开头那段「整条路滚转一圈」）+ 粉月。
//   v4-01 结尾那只盒子摆在路上 d = 60，盒子 = 一栋楼最顶上的那一间：
//   ① 22.5 盒内：她拽着从翻牌屏里伸出来的光缆，一拽一档，P(DOOM) 往上翻（翻牌屏第一行就是歌词）
//   ② 25.58 FOOM：四面墙往外倒平，脚下整栋楼从地底冲出来，把她顶上 26 m 高空；楼身正面亮出 FOOM
//   ③ 26.32 Trapped：墙又砸回来（正面换成玻璃），头顶一层层落下同样的房间，拉远：整栋楼每间都是她（克隆共享她的骨架 → 动作完全同步）
//   ④ 27.94 shrooms：窗里长出发光蘑菇，楼身一层层扭；推回她那扇窗
//   ⑤ 29.91 楼顶：她手搭凉棚望远处；对面整片城的亮窗拼成一张笑脸，31.14 楼缝里伸出长着柠黄眼睛的触手
//   ⑥ 33.40 2D 关键画：拉下额头那副护目镜，红眼（fresh/c1-v4/k2d/）
//   ⑦ 35.70 她的视角：红色 HUD 扫掉面具、标名字 + 倒计时
//   ⑧ 37.32 倒计时归零：面具城塌下去；她从楼顶跃出 → 37.95 落到路上起跑，38.4 机位 = v4-03 第一帧（同一个 chase 参数）
// 所有 update 都是歌曲时间 T 的纯函数。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { createSpiralRun, textTexture } from '../kits/world4.js';
import { mulberry32 } from '../kits/world.js';
import { createGirl, createGirlLights, loadAnims, getAnim } from '../kits/girl.js';
import { blendSolved } from '../../../assets/lib/dance3d.js';

export const ANIMS = ['act__kneel-down', 'act__pull-rope', 'move__sprint-jump', 'act__victory', 'dance__tut1', 'dance__body-wave',
  'act__look-distance', 'move__run-jump', 'move__land-run', 'move__run-fast__inplace'];

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const col = c => new THREE.Color(c);
const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k);
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const D2R = Math.PI / 180;
const FONT = '"UIAnton", "Anton", Impact, sans-serif';

function pchip(keys, t) {
  const n = keys.length;
  if (t <= keys[0][0]) return keys[0][1]; if (t >= keys[n - 1][0]) return keys[n - 1][1];
  const d = []; for (let i = 0; i < n - 1; i++) d.push((keys[i + 1][1] - keys[i][1]) / (keys[i + 1][0] - keys[i][0]));
  const m = keys.map((_, i) => i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : 2 * d[i - 1] * d[i] / (d[i - 1] + d[i]));
  let i = 0; while (t > keys[i + 1][0]) i++;
  const h = keys[i + 1][0] - keys[i][0], s = (t - keys[i][0]) / h, s2 = s * s, s3 = s2 * s;
  return (2 * s3 - 3 * s2 + 1) * keys[i][1] + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * keys[i + 1][1] + (s3 - s2) * h * m[i + 1];
}
const pv = (keys, t) => V3(pchip(keys.map(k => [k[0], k[1]]), t), pchip(keys.map(k => [k[0], k[2]]), t), pchip(keys.map(k => [k[0], k[3]]), t));

// ================================================================ 时间表（歌曲秒）
export const C1 = {
  t0: 22.5, end: 38.4,
  burst: 22.509,                       // 全黑四只眼 → 炸亮（v4-01 演到 22.6，这一拍接走）
  pulls: [23.0, 23.6, 23.866, 24.32, 24.78, 25.23],   // 拽光缆的拍（拽到底 = 翻一档）
  values: ['0.02', '0.05', '0.09', '0.15', '0.21', '0.27', '0.38'],
  foom: 25.577, trap: 26.32, shroom: 27.94, roof: 29.907, lies: 31.14, d2: 33.40, snap: 33.874, pov: 35.70, zero: 37.315, road: 37.95,
  // 第 ③ 段：墙砸回来、上面几层落下来的时刻
  slam: { N: 26.32, W: 26.40, E: 26.40, S: 26.47 },
  land: [26.50, 26.60, 26.70, 26.80],     // 第 RH、RH+1、RH+2、RH+3 层落到位（RH 这一层只有她两边的房间）
  crown: 26.88, crownFlip: 27.52,
};
const ZC = 60, S = 4.4, HS = S / 2, H = 2.0, NC = 5, RH = 6, NR = 10;   // 盒子在路上 d = 60；房间边长 = 盒子边长；5 列 × 10 层，她在第 6 层正中
const ROOF = NR * S;                     // 楼顶高度
const D0 = 100;                          // 38.4 时她在路上的位置（= v4-03 的 d = 0）

export async function makeC1V4(mv) {
  const { music, lyrics } = mv;
  const W = mv.width, Hh = mv.height;
  await loadAnims(ANIMS);
  await new FontFace('UIAnton', `url(${new URL('../../../assets/fonts/anton/Anton-Regular.ttf', import.meta.url)})`).load().then(f => document.fonts.add(f));
  const girl = await createGirl(mv);
  const kick = (T, d = 0.12) => music.pulse('kick', T, { decay: d });
  const line = p => lyrics.lines.find(l => l.start > 22 && l.text.toLowerCase().startsWith(p.toLowerCase()));
  const L = { up: line("I'm upping"), cause: line("'cause"), trap: line('Trapped'), bag: line('with a bag'), see: line('See'), eyes: line('with your') };
  const wt = (ln, i) => ln.words[i].start;

  // ================================================================ 世界：路 + 楼 + 星 + 粉月
  const scene = new THREE.Scene(); scene.background = col('#06060b'); scene.fog = new THREE.Fog('#06060b', 40, 230);
  const run = createSpiralRun({ length: D0 + 175, foldStart: 1e9, foldEnd: 2e9, obstacles: [], seed: 21, roll: { start: D0 + 22, end: D0 + 102, turns: 1, radius: 8 } });
  run.update(0, { d: ZC, fold: 1 });
  { const bm = run.group.children.find(o => o.isInstancedMesh), z = new THREE.Matrix4().makeScale(0, 0, 0);   // 楼要占地方：清掉 d = 60 附近的路边楼
    run.buildings.forEach((b, i) => { if (Math.abs(b.d - ZC) < 16 && Math.abs(b.s) < 16) bm.setMatrixAt(i, z); });
    bm.instanceMatrix.needsUpdate = true; }
  scene.add(run.group);
  { const rnd = mulberry32(77), n = 900, p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const a = rnd() * Math.PI * 2, e = Math.asin(0.08 + rnd() * 0.92), r = 420; p.set([Math.cos(a) * Math.cos(e) * r, Math.sin(e) * r, Math.sin(a) * Math.cos(e) * r - 150], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: col(PAL.paper).multiplyScalar(1.4), size: 1.6, sizeAttenuation: false, fog: false })));
  }
  const moon = new THREE.Mesh(new THREE.CircleGeometry(26, 64), new THREE.MeshBasicMaterial({ color: col(PAL.pink).multiplyScalar(1.25), fog: false }));
  moon.position.set(-60, 95, -(D0 + 277)); moon.lookAt(0, 0, -D0); scene.add(moon);    // 和 v4-03 里粉月相对她起跑点的位置一样
  const hemi = new THREE.HemisphereLight('#6f78e6', '#221848', 0.3); scene.add(hemi);
  const gl = createGirlLights({ key: 2.2, rim: 2.6, fill: 1.0 }); scene.add(gl);
  const glKey = gl.children.filter(l => l.isLight);

  // ================================================================ 招牌（墨底 + 霓虹边 + 白字，一张贴图）
  function makeSign(text, color, th, { vertical = false } = {}) {
    const c = document.createElement('canvas'), g0 = c.getContext('2d'); g0.font = `170px ${FONT}`;
    c.width = Math.ceil(g0.measureText(text).width) + 110; c.height = 270; const g = c.getContext('2d');
    g.fillStyle = '#0d0c14'; g.fillRect(0, 0, c.width, c.height); g.strokeStyle = color; g.lineWidth = 16; g.strokeRect(8, 8, c.width - 16, c.height - 16);
    g.fillStyle = '#F2EDE4'; g.font = `170px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, c.width / 2, 143);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const bh = th * 270 / 160, bw = bh * c.width / c.height;          // 字高 ≈ th（Anton 170 px 的大写字身约 160 px）
    const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(bw, bh), mat);
    const g2 = new THREE.Group(); g2.add(m);
    const s = { text, g: g2, m, mat, bw, bh, th, at: Infinity, until: Infinity,
      set(T, { dim = 0.22 } = {}) {
        const a = T - s.at; s.g.visible = a >= 0 && T < s.until;
        mat.color.setScalar(a >= 0 ? 1.15 + 1.6 * Math.exp(-a / 0.3) : dim);
        m.scale.setScalar(a >= 0 ? lerp(0.9, 1, eOut(a / 0.1)) : 0.9);
      } };
    return s;
  }
  const allSigns = [];
  const sign = (text, color, th, at, until = Infinity) => { const s = makeSign(text, color, th); s.at = at; s.until = until; allSigns.push(s); return s; };

  // ================================================================ 翻牌屏（split-flap）：canvas 逐帧画，纯函数
  function makeFlip({ wm, hm, rows, px = 260 }) {
    const c = document.createElement('canvas'); c.width = Math.round(wm * px); c.height = Math.round(hm * px); const g = c.getContext('2d');
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const cells = [];
    rows.forEach((r, ri) => {
      const cw = r.cw * px, ch = r.h * px, gap = 0.06 * cw, total = r.n * cw + (r.n - 1) * gap, x0 = (c.width - total) / 2, y = r.y * px;
      for (let i = 0; i < r.n; i++) cells.push({ row: ri, i, x: x0 + i * (cw + gap), y, w: cw, h: ch, color: r.color, seq: [[-1e9, ' ']] });
    });
    const rowCells = ri => cells.filter(q => q.row === ri);
    function setText(ri, t, text, { stagger = 0.018 } = {}) {
      const cs = rowCells(ri), n = cs.length, s = text.padStart(Math.floor((n + text.length) / 2)).padEnd(n).slice(0, n);
      cs.forEach((q, i) => q.seq.push([t + i * stagger, s[i]]));
    }
    function spin(ri, t0, t1, rnd, { step = 0.05, chars = 'ABCDEFGHJKLMNOPRSTUVWXYZ0123456789' } = {}) {
      for (const q of rowCells(ri)) for (let t = t0 + rnd() * step; t < t1; t += step * (0.7 + 0.6 * rnd())) q.seq.push([t, chars[Math.floor(rnd() * chars.length)]]);
    }
    const FL = 0.085;
    function glyph(q, ch, clipTop, sy = 1) {      // 画一个字的上半或下半（sy 压扁 = 翻动中的那片）
      g.save(); g.beginPath();
      if (clipTop) g.rect(q.x, q.y, q.w, q.h / 2); else g.rect(q.x, q.y + q.h / 2, q.w, q.h / 2);
      g.clip();
      g.translate(0, q.y + q.h / 2); g.scale(1, sy); g.translate(0, -(q.y + q.h / 2));
      g.fillStyle = '#1b1b26'; g.fillRect(q.x, q.y, q.w, q.h);
      g.fillStyle = q.color; g.font = `${Math.round(q.h * 0.82)}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(ch, q.x + q.w / 2, q.y + q.h * 0.53);
      g.restore();
    }
    let lastKey = '';
    function draw(T) {
      // 状态签名没变就不重画（同一 T 重复 seek 结果一样）
      const st = cells.map(q => { let k = 0; while (k + 1 < q.seq.length && q.seq[k + 1][0] <= T) k++; return [k, clamp((T - q.seq[k][0]) / FL)]; });
      const key = st.map(([k, p]) => k + ':' + p.toFixed(3)).join('|');
      if (key === lastKey) return; lastKey = key;
      g.fillStyle = '#0b0a12'; g.fillRect(0, 0, c.width, c.height);
      cells.forEach((q, i) => {
        const [k, p] = st[i], nw = q.seq[k][1], old = k > 0 ? q.seq[k - 1][1] : ' ';
        if (p >= 1) { glyph(q, nw, true); glyph(q, nw, false); }
        else {
          glyph(q, nw, true); glyph(q, old, false);
          if (p < 0.5) glyph(q, old, true, Math.cos(p * Math.PI));
          else glyph(q, nw, false, -Math.cos(p * Math.PI));
        }
        g.fillStyle = '#05050a'; g.fillRect(q.x, q.y + q.h / 2 - 1.5, q.w, 3);   // 中缝
      });
      tex.needsUpdate = true;
    }
    return { canvas: c, tex, setText, spin, draw, cells };
  }

  // ================================================================ 盒子 = 她那一间（照 v4-01-box 的做法：板 + 灯管 + 接缝 + 四只眼）
  const box = new THREE.Group(); scene.add(box);
  const TH = 0.14;
  const slate = new THREE.MeshStandardMaterial({ color: '#4a4c70', roughness: 0.58, metalness: 0.12 });
  const tubeGeo = new Map();
  function tubeRect(w, d, color, r = 0.03) {
    const g = new THREE.Group(), mat = new THREE.MeshBasicMaterial({ color: hdr(color, 1.9) }), e = 0.1;
    for (const [len, x, z, rz] of [[w - 2 * e, 0, -e, true], [w - 2 * e, 0, -d + e, true], [d - 2 * e, -w / 2 + e, -d / 2, false], [d - 2 * e, w / 2 - e, -d / 2, false]]) {
      const k = len.toFixed(3) + ':' + r; if (!tubeGeo.has(k)) tubeGeo.set(k, new THREE.CylinderGeometry(r, r, len, 8));
      const m = new THREE.Mesh(tubeGeo.get(k), mat); m.position.set(x, r + 0.005, z); if (rz) m.rotation.z = Math.PI / 2; else m.rotation.x = Math.PI / 2; g.add(m);
    }
    return { g, mat, base: hdr(color, 1.9) };
  }
  function seams(w, d) {
    const pts = []; for (let i = 1; i < 4; i++) { const x = -w / 2 + i * w / 4, z = -i * d / 4; pts.push(x, 0.004, 0, x, 0.004, -d, -w / 2, 0.004, z, w / 2, 0.004, z); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const mat = new THREE.LineBasicMaterial({ color: hdr(PAL.mint, 0.22) });
    return new THREE.LineSegments(g, mat);
  }
  function makeEye(R = 0.72, { flat = true } = {}) {
    const g = new THREE.Group(), add = (geo, mat, y) => { const m = new THREE.Mesh(geo, mat); if (flat) { m.rotation.x = -Math.PI / 2; m.position.y = y; } else m.position.z = y; g.add(m); return m; };
    add(new THREE.RingGeometry(R, R * 1.24, 64), new THREE.MeshBasicMaterial({ color: '#4a4a5a' }), 0.012);
    add(new THREE.CircleGeometry(R, 64), new THREE.MeshBasicMaterial({ color: '#0b0a06' }), 0.013);
    const lit = new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 1.6) });
    add(new THREE.CircleGeometry(R * 0.26, 40), lit, 0.016);
    for (const k of [0.46, 0.66, 0.86]) add(new THREE.RingGeometry(R * k - R * 0.03, R * k + R * 0.03, 64), lit, 0.016);
    return { g, lit };
  }
  const winTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d'), rnd = mulberry32(5);
    g.fillStyle = '#111120'; g.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 14; y++) for (let x = 0; x < 12; x++) if (rnd() < 0.55) { const h = rnd(); g.fillStyle = h < 0.7 ? '#ffe9b8' : h < 0.85 ? PAL.lemon : h < 0.93 ? PAL.pink : PAL.mint; g.fillRect(x * 42 + 12, y * 36 + 10, 22, 16); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; })();
  function makePanel(w, d, color, { eye = true, eyeR = 0.45, eyeAt = [0, 3.4], windows = true } = {}) {
    const tilt = new THREE.Group();
    if (windows) { const o = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: winTex, color: hdr('#ffffff', 1.1) })); o.rotation.x = Math.PI / 2; o.position.set(0, -TH - 0.004, -d / 2); tilt.add(o); }
    const solid = new THREE.Mesh(new THREE.BoxGeometry(w, TH, d), slate); solid.position.set(0, -TH / 2, -d / 2); tilt.add(solid);
    const tube = tubeRect(w, d, color), sm = seams(w, d); tilt.add(tube.g, sm);
    let e = null; if (eye) { e = makeEye(eyeR); e.g.position.set(eyeAt[0], 0, -eyeAt[1]); tilt.add(e.g); }
    return { tilt, tube, eye: e, solid, seams: sm, win: tilt.children[0] };
  }
  const floor = makePanel(S, S, PAL.mint, { eye: false, windows: false }); floor.tilt.position.z = HS; box.add(floor.tilt);
  const walls = {};
  for (const [k, x, z, ry, color] of [['N', 0, -HS, 0, PAL.pink], ['S', 0, HS, Math.PI, PAL.lemon], ['W', -HS, 0, Math.PI / 2, PAL.pink], ['E', HS, 0, -Math.PI / 2, PAL.mint]]) {
    const hinge = new THREE.Group(); hinge.position.set(x, 0, z); hinge.rotation.y = ry;
    const p = makePanel(S, S, color); hinge.add(p.tilt); box.add(hinge); walls[k] = p;
  }
  const flaps = ['W', 'E'].map(k => { const f = makePanel(S, HS, PAL.mint, { eye: false }); f.tilt.position.set(0, -TH - 0.01, -S); walls[k].tilt.add(f.tilt); return f; });
  // 正面（N）墙：盒子阶段内面是翻牌屏；③ 起换成玻璃窗（slate 实心板藏掉，只留灯管框 + 极淡的玻璃）
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(S - 0.2, S - 0.2), new THREE.MeshBasicMaterial({ color: hdr('#9fd8ff', 0.25), transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide }));
  glass.rotation.x = -Math.PI / 2; glass.position.set(0, 0.01, -HS); walls.N.tilt.add(glass);

  // 翻牌屏：第 0 行歌词（9 格），第 1 行 P(DOOM)（7 格），第 2 行数值（4 格大）
  const FB = { w: 3.7, h: 2.0 };
  const flip = makeFlip({ wm: FB.w, hm: FB.h, rows: [
    { n: 0, cw: 0.34, h: 0.5, y: 0, color: '#F2EDE4' },                 // 占位（原歌词行，已挪到屏外上沿的招牌）
    { n: 7, cw: 0.38, h: 0.6, y: 0.1, color: PAL.lemon },
    { n: 4, cw: 0.64, h: 1.1, y: 0.8, color: '#F2EDE4' } ] });
  const flipMat = new THREE.MeshBasicMaterial({ map: flip.tex, color: hdr('#ffffff', 1.0) });
  const flipMesh = new THREE.Mesh(new THREE.PlaneGeometry(FB.w, FB.h), flipMat);
  flipMesh.rotation.x = -Math.PI / 2; flipMesh.position.set(0, 0.03, -(0.42 + FB.h / 2)); walls.N.tilt.add(flipMesh);   // 屏底边离地 0.42 m
  const flipFrame = tubeRect(FB.w + 0.16, FB.h + 0.16, PAL.lemon, 0.035); flipFrame.g.position.set(0, 0.02, -(0.42 - 0.08)); walls.N.tilt.add(flipFrame.g);
  { const rnd = mulberry32(9);
    flip.spin(1, C1.burst, C1.burst + 0.34, rnd); flip.spin(2, C1.burst, C1.burst + 0.38, rnd, { chars: '0123456789' });
    flip.setText(1, C1.burst + 0.34, 'P(DOOM)'); flip.setText(2, C1.burst + 0.38, C1.values[0], { stagger: 0.03 });
    C1.pulls.forEach((t, i) => flip.setText(2, t, C1.values[i + 1], { stagger: 0.025 }));
    // 最后一拽之后：数字自己往上狂翻（FOOM 前 0.3 s）
    const vals = ['0.41', '0.44', '0.48', '0.53', '0.57', '0.62', '0.66', '0.71', '0.74', '0.79', '0.83', '0.86', '0.90', '0.93', '0.95', '0.97'];
    vals.forEach((v, i) => flip.setText(2, 25.33 + i * 0.03, v, { stagger: 0.008 }));
  }
  // 歌词：屏外上沿一个招牌位，只亮当前这个词（P(doom) 那个词就是翻牌屏本身）
  walls.N.eye.g.position.z = -3.98; walls.N.eye.g.scale.setScalar(0.66);
  const boxWords = [[L.up, 0], [L.up, 1], [L.up, 2], [L.cause, 0], [L.cause, 1], [L.cause, 2], [L.cause, 3]].map(([ln, k], i, arr) => {
    const next = arr[i + 1], until = next ? (next[0] === ln ? wt(ln, next[1]) : ln.end) : C1.foom;
    const st = sign(ln.words[k].w.toUpperCase().replace(/[,.]/g, ''), ln === L.up ? PAL.mint : PAL.pink, 0.5, wt(ln, k), Math.min(until, ln === L.up ? wt(L.up, 3) : C1.foom));
    st.g.rotation.x = -Math.PI / 2; st.g.position.set(0, 0.05, -3.12); walls.N.tilt.add(st.g); return st; });
  // 光缆：从屏底插座伸出来，到她两手中间
  const rope = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 2.0) })); scene.add(rope);
  const socket = new THREE.Object3D(); socket.position.set(0, 0.05, -0.3); walls.N.tilt.add(socket);
  const lidOpen = T => T < C1.foom ? 90 : lerp(90, -170, eOut((T - C1.foom) / 0.22));
  const wallAngle = (k, T) => {
    if (T < C1.foom) return 90;
    const sl = C1.slam[k];
    if (T < sl) { const u = (T - (C1.foom + { N: 0, W: 0.04, E: 0.04, S: 0.08 }[k])) / 0.24; if (u <= 0) return 90; if (u < 1) return 90 * (1 - u * u); const a = (u - 1) * 0.24; return 3 * Math.exp(-a * 12) * Math.abs(Math.sin(a * 30)); }
    const u = (T - sl) / 0.15; if (u < 1) return 90 * u ** 2.2;
    const a = T - sl - 0.15; return 90 - 2.5 * Math.exp(-a * 14) * Math.abs(Math.sin(a * 38));
  };

  // ================================================================ 楼：她那一间在 (列 2, 层 RH)。下面 RH 层从地底冲出来，上面几层从天上落下来
  const towerZ = -ZC;
  const rise = T => T < C1.foom ? 0 : pchip([[C1.foom, 0], [C1.foom + 0.12, 0.07], [C1.foom + 0.42, 0.78], [C1.trap - 0.06, 1]], T);
  const floorY = T => RH * S * rise(T);
  const dropOff = (land, T) => { const tau = land - T; if (tau <= 0) { const a = -tau; return 0.25 * Math.exp(-a * 12) * Math.abs(Math.sin(a * 30)); } return tau > 0.35 ? 1e4 : 70 * (tau / 0.35) ** 2; };
  const rowLand = r => r === RH ? C1.land[0] : C1.land[Math.min(3, r - RH)] ?? C1.land[3];
  const COLC = [PAL.pink, PAL.mint, PAL.lemon, PAL.mint, PAL.pink];
  const TINT = ['#5a2e8a', '#1f5a6a', '#6a2a4a', '#2a3a7a'];
  const roomTex = (() => { const c = document.createElement('canvas'); c.width = 16; c.height = 128; const g = c.getContext('2d'), v = g.createLinearGradient(0, 0, 0, 128);
    v.addColorStop(0, '#222'); v.addColorStop(0.7, '#aaa'); v.addColorStop(1, '#fff'); g.fillStyle = v; g.fillRect(0, 0, 16, 128); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const cells = [];
  const slab = new THREE.BoxGeometry(S, TH, S), backG = new THREE.PlaneGeometry(S, S), divG = new THREE.PlaneGeometry(S, S);
  for (let r = 0; r <= NR - 1; r++) for (let c = 0; c < NC; c++) {
    if (r === RH && c === 2) continue;
    const g = new THREE.Group(); scene.add(g);
    const fl = new THREE.Mesh(slab, slate); fl.position.y = -TH / 2; g.add(fl);
    const backMat = new THREE.MeshBasicMaterial({ map: roomTex, color: col('#000') });
    const back = new THREE.Mesh(backG, backMat); back.position.set(0, HS, HS - 0.02); back.rotation.y = Math.PI; g.add(back);
    for (const sx of [-1, 1]) { const d = new THREE.Mesh(divG, slate); d.position.set(sx * (HS - 0.01), HS, 0); d.rotation.y = -sx * Math.PI / 2; g.add(d); }
    const fr = tubeRect(S, S, COLC[c], 0.045); fr.g.rotation.x = Math.PI / 2; fr.g.position.set(0, 0, -HS); g.add(fr.g);   // 窗框立在正面
    if (c === 0 || c === NC - 1) { const o = new THREE.Mesh(new THREE.PlaneGeometry(S, S), new THREE.MeshBasicMaterial({ map: winTex, color: hdr('#ffffff', 1.0) })); o.position.set((c === 0 ? -1 : 1) * (HS + 0.01), HS, 0); o.rotation.y = (c === 0 ? -1 : 1) * Math.PI / 2; g.add(o); }
    const cell = { r, c, g, backMat, tint: col(TINT[(r * 3 + c) % 4]), fr, clone: null, cap: null };
    cells.push(cell);
  }
  const lowRoof = new THREE.Mesh(new THREE.BoxGeometry(NC * S, 0.3, S), slate); scene.add(lowRoof);   // 冲上来那一截的顶（RH 层落下来之前）
  const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(NC * S + 0.4, 0.5, S + 0.4), slate); scene.add(roofSlab);
  const roofEdge = tubeRect(NC * S + 0.4, S + 0.4, PAL.pink, 0.06); roofEdge.g.position.set(0, 0.26, (S + 0.4) / 2); roofSlab.add(roofEdge.g);
  // 楼顶的冠：大翻牌 P(DOOM)（在楼顶后沿，朝 -Z）
  const crown = new THREE.Group(); crown.rotation.y = Math.PI; scene.add(crown);
  const flipC = makeFlip({ wm: 16, hm: 7.2, px: 96, rows: [{ n: 7, cw: 1.7, h: 2.7, y: 0.4, color: PAL.lemon }, { n: 4, cw: 2.6, h: 3.5, y: 3.4, color: '#F2EDE4' }] });
  flipC.setText(0, 0, 'P(DOOM)'); flipC.setText(1, 0, '0.52'); flipC.setText(1, C1.crownFlip, '0.73', { stagger: 0.04 }); flipC.setText(1, 28.88, '0.80', { stagger: 0.04 });
  const crownMesh = new THREE.Mesh(new THREE.PlaneGeometry(16, 7.2), new THREE.MeshBasicMaterial({ map: flipC.tex, color: hdr('#fff', 1.1) })); crownMesh.position.set(0, 8.4, 0); crownMesh.scale.setScalar(2.0); crown.add(crownMesh);
  const crownFr = tubeRect(16.4, 7.6, PAL.lemon, 0.12); crownFr.g.rotation.x = Math.PI / 2; crownFr.g.scale.setScalar(2.0); crownFr.g.position.set(0, 0.8, -0.05); crown.add(crownFr.g);
  for (const sx of [-1, 1]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.6, 4.4, 0.6), slate); leg.position.set(sx * 12, -0.9, 0.3); crown.add(leg); }

  // 克隆：所有房间里的她 = 同一副骨架上的蒙皮复制（动作和她完全同步，整列）
  const skClone = src => { const m = new THREE.SkinnedMesh(src.geometry, src.material); m.bind(src.skeleton, src.bindMatrix); m.bindMode = THREE.DetachedBindMode; m.bindMatrixInverse.identity(); m.frustumCulled = false; m.matrixAutoUpdate = false; return m; };
  for (const cl of cells) {
    const g = new THREE.Group(); g.matrixAutoUpdate = false; g.add(skClone(girl.mesh)); if (girl.hull) g.add(skClone(girl.hull)); scene.add(g); cl.clone = g;
  }
  // 蘑菇：每间窗台上长一朵（④），她下面那间长最大的一朵，伞上写 SHROOMS
  const spotTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), rnd = mulberry32(31);
    g.fillStyle = '#fff'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#ffffff'; for (let i = 0; i < 26; i++) { g.globalAlpha = 1; g.fillStyle = '#3a2050'; const x = rnd() * 256, y = rnd() * 140, r = 6 + rnd() * 14; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const capGeo = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), stemGeo = new THREE.CylinderGeometry(0.22, 0.3, 1, 12);
  const rndCap = mulberry32(55);
  for (const cl of cells) {
    const big = cl.r === RH - 1 && cl.c === 2;
    const g = new THREE.Group(), color = [PAL.pink, PAL.mint, PAL.lemon][Math.floor(rndCap() * 3)];
    const capMat = new THREE.MeshBasicMaterial({ map: spotTex, color: hdr(big ? PAL.pink : color, 1.3) });
    const cap = new THREE.Mesh(capGeo, capMat), stem = new THREE.Mesh(stemGeo, new THREE.MeshBasicMaterial({ color: hdr('#F2EDE4', 0.9) }));
    stem.position.y = 0.5; cap.position.y = 0.95; cap.scale.set(1, 0.62, 1); g.add(stem, cap);
    g.position.set((rndCap() - 0.5) * 1.6, 0.05, -HS - 0.4); g.rotation.x = -0.35;   // 从窗台往外歪着长
    cl.g.add(g);
    cl.cap = { g, big, at: big ? wt(L.bag, 4) - 0.25 : C1.shroom + 0.1 + rndCap() * 0.9, size: big ? 2.3 : 0.75 + rndCap() * 0.5 };
    g.visible = false;
  }
  const bigCell = cells.find(q => q.r === RH - 1 && q.c === 2);

  // ================================================================ 第 ①–④ 段的招牌
  const flipFOOM = 'FOOM'.split('').map((ch, i) => { const s = sign(ch, [PAL.pink, PAL.mint, PAL.lemon, PAL.pink][i], 2.3, C1.foom + 0.08 + i * 0.06, C1.trap + 0.04); scene.add(s.g); return s; });
  // 一句一排，唱完就灭（同一时间只亮当前这一句）
  const sTrapRow = [['TRAPPED', PAL.pink, 0], ['IN', PAL.mint, 1], ['THE', PAL.mint, 2]].map(([w, c, k]) => { const st = sign(w, c, 2.2, wt(L.trap, k), L.trap.end); scene.add(st.g); return st; });
  { const tot = sTrapRow.reduce((a, q) => a + q.bw, 0) + 0.5 * 2; let x = tot / 2; for (const q of sTrapRow) { q.x = x - q.bw / 2; x -= q.bw + 0.5; } }
  const sChinese = sign('CHINESE', PAL.lemon, 3.9, wt(L.trap, 3), L.trap.end), sRoom = sign('ROOM', PAL.lemon, 3.9, wt(L.trap, 4), L.trap.end);
  const sBag = ['WITH', 'A', 'BAG', 'OF'].map((w, i) => { const s = sign(w, [PAL.mint, PAL.lemon, PAL.pink, PAL.mint][i], 3.1, wt(L.bag, i), L.bag.end); scene.add(s.g); return s; });
  { const tot = sBag.reduce((a, s) => a + s.bw, 0) + 0.5 * 3; let x = tot / 2; for (const s of sBag) { s.x = x - s.bw / 2; x -= s.bw + 0.5; } }   // 一排，从画面左（+x）往右
  const sShrooms = sign('SHROOMS', PAL.lemon, 0.5, wt(L.bag, 4), L.bag.end); bigCell.cap.g.add(sShrooms.g);
  sShrooms.g.position.set(0, 1.12, -1.3); sShrooms.g.rotation.set(0.35, Math.PI, 0);      // 挂在大蘑菇伞的正面（朝 -Z，抵掉伞的前倾）
  const cellOf = (r, c) => cells.find(q => q.r === r && q.c === c);
  crown.add(sChinese.g, sRoom.g); { const g = 0.6, tot = sChinese.bw + sRoom.bw + g; sChinese.g.position.set(-tot / 2 + sChinese.bw / 2, -HS - 3.2, S + 0.2); sRoom.g.position.set(tot / 2 - sRoom.bw / 2, -HS - 3.2, S + 0.2); }   // crown 整体转了 π，局部 +z = 楼正面外侧；两块挂在最上面两层的正面

  // ================================================================ 面具城（第 ⑤–⑧ 段）：一整面亮窗，窗的亮灭 = 一张数据贴图，逐帧按 T 算
  const FC = { x0: -90, x1: 150, y0: -2, y1: 150, z: -(D0 + 240), nx: 80, ny: 46 };
  const cw = (FC.x1 - FC.x0) / FC.nx, chh = (FC.y1 - FC.y0) / FC.ny;
  const face = { cx: 42, cy: 24, R: 17.5 };                        // 笑脸在格子坐标里的圆心 / 半径
  const stData = new Uint8Array(FC.nx * FC.ny * 4), stTex = new THREE.DataTexture(stData, FC.nx, FC.ny); stTex.magFilter = stTex.minFilter = THREE.NearestFilter;
  const cellInfo = [];
  { const rnd = mulberry32(404); let x = 0; const hgt = new Array(FC.nx).fill(0), exists = new Array(FC.nx).fill(true);
    while (x < FC.nx) { const w = 3 + Math.floor(rnd() * 5), inFace = x + w > face.cx - face.R - 2 && x < face.cx + face.R + 2; const h = x < 20 ? 8 + Math.floor(rnd() * 8) : inFace ? FC.ny - Math.floor(rnd() * 2) : 26 + Math.floor(rnd() * 16);
      for (let i = x; i < Math.min(FC.nx, x + w); i++) hgt[i] = h; x += w; if (!inFace && rnd() < 0.6 && x < FC.nx) { exists[x] = false; x++; } }
    for (let j = 0; j < FC.ny; j++) for (let i = 0; i < FC.nx; i++) {
      const dx = i + 0.5 - face.cx, dy = (j + 0.5 - face.cy) * chh / cw, d = Math.hypot(dx, dy);
      const inDisc = d < face.R;
      const eyeL = Math.hypot(i + 0.5 - (face.cx - 6.5), (j + 0.5 - (face.cy + 5)) * 1.6) < 2.6, eyeR = Math.hypot(i + 0.5 - (face.cx + 6.5), (j + 0.5 - (face.cy + 5)) * 1.6) < 2.6;
      const md = Math.hypot(dx, (j + 0.5 - (face.cy + 3)) * chh / cw), mouth = md > 9.5 && md < 12.3 && j + 0.5 < face.cy - 1.2;
      cellInfo.push({ ex: exists[i] && j < hgt[i], lit0: rnd() < 0.45 ? 0.5 + 0.5 * rnd() : 0.06, smile: inDisc && !eyeL && !eyeR && !mouth, feature: inDisc && (eyeL || eyeR || mouth), sw: 29.95 + rnd() * 0.65 + (Math.abs(dx) / 40) * 0.2, j, i, flick: rnd() });
    }
  }
  const facadeMat = new THREE.ShaderMaterial({
    uniforms: { uState: { value: stTex }, uGrid: { value: new THREE.Vector2(FC.nx, FC.ny) }, uScan: { value: 2 }, uWarm: { value: hdr('#ffe2a8', 1.25) }, uSmile: { value: hdr(PAL.lemon, 2.1) }, uRed: { value: hdr('#ff2a3a', 2.2) }, uWall: { value: col('#0e0e1a') } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform sampler2D uState; uniform vec2 uGrid; uniform float uScan; uniform vec3 uWarm, uSmile, uRed, uWall; varying vec2 vUv;
      void main(){ vec2 g = vUv * uGrid; vec2 cell = floor(g); vec2 f = fract(g);
        vec4 s = texture2D(uState, (cell + 0.5) / uGrid);
        if (s.g < 0.5) discard;
        if (vUv.y > uScan + 0.002) discard;
        float win = step(0.16, f.x) * step(f.x, 0.84) * step(0.2, f.y) * step(f.y, 0.8);
        vec3 wc = s.b > 0.5 ? uSmile : uWarm;
        vec3 c = mix(uWall, wc * s.r, win);
        c += uRed * 3.0 * exp(-abs(vUv.y - uScan) * 260.0);
        gl_FragColor = vec4(c, 1.0); }`,
  });
  const facade = new THREE.Mesh(new THREE.PlaneGeometry(FC.x1 - FC.x0, FC.y1 - FC.y0), facadeMat);
  const fGroup = new THREE.Group(); fGroup.add(facade); facade.position.set((FC.x0 + FC.x1) / 2, (FC.y0 + FC.y1) / 2, FC.z); scene.add(fGroup);
  const faceW = new THREE.Vector3(FC.x0 + face.cx * cw, FC.y0 + face.cy * chh, FC.z);       // 笑脸中心（世界）
  const sLies = sign('LIES', PAL.pink, 21, wt(L.see, 4), L.see.end + 0.05); fGroup.add(sLies.g); sLies.g.position.set(faceW.x, faceW.y + 41, FC.z + 30);
  const sSee = ['SEE', 'THROUGH', 'THE', "SHOGGOTH'S"].map((w, i) => { const s = sign(w, PAL.mint, 13, wt(L.see, i), L.see.end + 0.05); fGroup.add(s.g); return s; });
  { let x = -50; for (const s of sSee) { s.g.position.set(x + s.bw / 2, 13, FC.z + 30); x += s.bw + 4; } }
  function facadeState(T) {
    const scanY = T < C1.pov + 0.15 ? 2 : lerp(1.02, -0.05, clamp((T - (C1.pov + 0.15)) / 1.15));
    facadeMat.uniforms.uScan.value = scanY;
    for (let k = 0; k < cellInfo.length; k++) {
      const q = cellInfo[k], o = k * 4;
      let b = q.lit0, smile = 0;
      if (T >= q.sw) { if (q.smile) { b = 1; smile = 1; } else b = q.feature ? 0 : 0.05 + 0.05 * q.flick; }
      else if (T > q.sw - 0.12) b = q.flick < 0.5 ? 1 : 0.1;                       // 换之前闪一下
      stData[o] = Math.round(clamp(b) * 255); stData[o + 1] = q.ex ? 255 : 0; stData[o + 2] = smile ? 255 : 0; stData[o + 3] = 255;
    }
    stTex.needsUpdate = true;
    const sink = T < C1.zero ? 0 : 230 * smooth((T - C1.zero) / 0.6) ** 1.4;
    fGroup.position.y = -sink; fGroup.visible = T >= C1.roof - 0.01 && T < C1.road + 0.1 && sink < 225;
  }

  // 触手：程序化管子，逐帧重算顶点（锥形 + 摆动），每根挂三只柠黄同心圆眼
  const TENT = [];
  { const rnd = mulberry32(808);
    const bases = [[-30, -4], [-8, 6], [18, -2], [68, 4], [90, -6], [112, 2], [130, -3], [5, -20], [40, -26], [78, -22], [-20, -24], [100, -28]];
    bases.forEach(([bx, dz], i) => {
      const back = dz < -15, n = 44, rad = 9;
      const geo = new THREE.BufferGeometry(), pos = new Float32Array(n * rad * 3), idx = [];
      for (let a = 0; a < n - 1; a++) for (let b = 0; b < rad; b++) { const p = a * rad + b, q = a * rad + (b + 1) % rad; idx.push(p, p + rad, q, q, p + rad, q + rad); }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setIndex(idx);
      const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: '#4a2a78', roughness: 0.35, metalness: 0.15, emissive: col('#5a1a8a'), emissiveIntensity: 0.9, fog: false }));
      mesh.frustumCulled = false; fGroup.add(mesh);
      const eyes = [0.32, 0.58, 0.8].map(s => { const e = makeEye(1, { flat: false }); fGroup.add(e.g); return { e, s }; });
      TENT.push({ bx: bx, bz: FC.z + (back ? 8 + dz : 2 + dz * 0.15), back, mesh, geo, pos, n, rad, eyes, r0: 8 + rnd() * 5, ht: (back ? 120 : 85) + rnd() * 50, ph: rnd() * 6.28, ph2: rnd() * 6.28, at: back ? C1.pov + 0.3 + rnd() * 0.5 : C1.lies + rnd() * 0.55 });
    });
  }
  const _t = V3(), _n = V3(), _b = V3(), _c = V3(), _ref = V3(0, 0, 1);
  function tentacles(T) {
    const retract = T < C1.zero ? 0 : smooth((T - C1.zero) / 0.5);
    for (const q of TENT) {
      const grow = eOut((T - q.at) / 0.9) * (1 - retract);
      q.mesh.visible = grow > 0.01;
      for (const e of q.eyes) e.e.g.visible = q.mesh.visible;
      if (!q.mesh.visible) continue;
      const P = [];
      for (let a = 0; a < q.n; a++) {
        const s = a / (q.n - 1), ht = q.ht * grow;
        const sway = 26 * s ** 1.4 * Math.sin(2.4 * s * Math.PI + T * 1.7 + q.ph), swz = 14 * s ** 1.6 * Math.sin(1.7 * s * Math.PI + T * 1.3 + q.ph2);
        const toward = (faceW.x - q.bx) * 0.3 * s * s;
        P.push(V3(q.bx + sway + toward, -4 + ht * s, q.bz + swz + 10 * s * s));
      }
      for (let a = 0; a < q.n; a++) {
        const s = a / (q.n - 1), r = q.r0 * (1 - 0.88 * s) * (0.6 + 0.4 * grow);
        _t.subVectors(P[Math.min(q.n - 1, a + 1)], P[Math.max(0, a - 1)]).normalize();
        _n.crossVectors(_t, _ref).normalize(); _b.crossVectors(_t, _n);
        for (let b = 0; b < q.rad; b++) { const th = b / q.rad * Math.PI * 2; _c.copy(P[a]).addScaledVector(_n, Math.cos(th) * r).addScaledVector(_b, Math.sin(th) * r); q.pos.set([_c.x, _c.y, _c.z], (a * q.rad + b) * 3); }
      }
      q.geo.attributes.position.needsUpdate = true; q.geo.computeVertexNormals();
      for (const e of q.eyes) {
        const a = Math.round(e.s * (q.n - 1)), r = q.r0 * (1 - 0.88 * e.s) * 0.95;
        e.e.g.position.copy(P[a]).add(V3(0, 0, r * 0.9)); e.e.g.scale.setScalar(r * grow);
        e.e.lit.color.copy(hdr(PAL.lemon, 1.6 + 1.2 * Math.max(0, Math.sin(T * 9 + e.s * 20))));
      }
    }
  }
  const tentEyes = cam => { for (const q of TENT) for (const e of q.eyes) if (e.e.g.visible) { e.e.g.parent.updateWorldMatrix(true, false); e.e.g.lookAt(cam.position); } };
  const tentLight = new THREE.DirectionalLight(PAL.pink, 0), tentRim = new THREE.DirectionalLight(PAL.mint, 0); tentRim.position.set(120, 40, -420); tentRim.target.position.copy(faceW); scene.add(tentRim, tentRim.target);
  const tentLight0 = 0; tentLight.position.set(-80, 60, -100); tentLight.target.position.copy(faceW); scene.add(tentLight, tentLight.target);

  // ================================================================ 她：动作分段（keys = [[歌曲 T, 片段本地秒]] 单调三次插值；dance = 从 t0 起按拍播）
  const SEG = [
    { anim: 'act__kneel-down', keys: [[22.40, 2.40], [22.62, 2.25], [22.95, 1.0]], fade: 0 },        // 跪着 → 起身
    { anim: 'act__pull-rope', keys: null, fade: 0.28 },                                                 // 拽光缆（keys 在下面按片段里手的前后算）
    { anim: 'move__sprint-jump', keys: [[25.38, 0.0], [C1.foom, 0.12], [25.82, 0.38], [26.02, 0.62]], fade: 0.14 },   // FOOM：跃起（腾空时转回正面，yawKeys 在下面）
    { anim: 'act__victory', keys: [[26.0, 0.4], [26.28, 0.85], [26.40, 0.95]], fade: 0.1 },
    { anim: 'dance__tut1', dance: 26.146, from: 26.45, fade: 0.25 },                                                  // 和所有房间里的她一起 tut（规则手册）
    { anim: 'dance__body-wave', dance: 27.964, from: 28.0, fade: 0.35 },
    { anim: 'act__look-distance', keys: [[C1.roof, 0.9], [30.8, 3.0], [32.4, 4.3], [33.5, 5.0]], fade: 0, cut: true },
    { anim: 'move__run-jump', keys: [[C1.zero, 0.3], [C1.road, 1.0]], fade: 0, cut: true },
    { anim: 'move__land-run', keys: [[C1.road, 0.0], [38.05, 0.12], [38.32, 0.5]], fade: 0, cut: true },
    { anim: 'move__run-fast__inplace', dance: 38.0, rate: 1.8, fade: 0.1, from: 38.32 },             // 和 v4-03 的 SEQ 第一段完全同一个相位
  ];
  for (const s of SEG) { s.m = getAnim(s.anim); s.t0 = s.from ?? (s.keys ? s.keys[0][0] : s.dance); s.yaw = 0; }
  const yawOf = (s, T) => s.yawKeys ? pchip(s.yawKeys, T) : s.yaw;
  const I = girl.dancer.S.info;
  const solveSeg = (s, T) => s.keys ? s.m.solve(pchip(s.keys, T) / s.m.srcPeriod, girl.dancer) : s.m.solve((girl.beatOf(T) - girl.beatOf(s.dance)) * (s.rate ?? 1), girl.dancer);
  // 拽光缆：量片段里两手相对胯的前伸量，找「伸到最前 → 收回最后」的每一拽，再把拽到底对上 C1.pulls
  {
    const s = SEG[1], m = s.m, f = [], tmp = new THREE.Object3D();
    scene.add(girl.root); girl.root.position.set(0, 0, 0); girl.root.rotation.set(0, 0, 0); girl.root.scale.setScalar(H);
    const handMid = () => I.LeftHand.bone.getWorldPosition(V3()).add(I.RightHand.bone.getWorldPosition(V3())).multiplyScalar(0.5);
    girl.root.updateMatrixWorld(true); girl.dancer.apply(m.solve(3.0 / m.srcPeriod, girl.dancer)); girl.root.updateMatrixWorld(true);
    const dir = handMid().sub(I.Hips.bone.getWorldPosition(V3())); dir.y = 0; dir.normalize();
    s.yaw = -Math.atan2(dir.x, dir.z);                                              // 根要多转多少，手的方向才朝 -Z（根本来就转了 π）
    for (let c = 0; c <= m.duration - 0.05; c += 1 / 30) { girl.dancer.apply(m.solve(c / m.srcPeriod, girl.dancer)); girl.root.updateMatrixWorld(true); f.push([c, handMid().sub(I.Hips.bone.getWorldPosition(V3())).dot(dir)]); }
    const ext = [], ret = [];
    for (let i = 6; i < f.length - 6; i++) { const w = f.slice(i - 6, i + 7).map(x => x[1]); if (f[i][1] === Math.max(...w)) ext.push(f[i]); if (f[i][1] === Math.min(...w)) ret.push(f[i]); }
    const pairs = [];
    for (const e of ext) { const r = ret.find(x => x[0] > e[0] && x[0] - e[0] < 1.2); if (r && e[1] - r[1] > 0.05 && (!pairs.length || e[0] > pairs[pairs.length - 1][1])) pairs.push([e[0], r[0]]); }
    window.__pullPairs = pairs;
    const keys = [[22.70, pairs[0][0] - 0.3]];
    C1.pulls.forEach((t, i) => { const [e, r] = pairs[Math.min(i, pairs.length - 1)], prev = keys[keys.length - 1]; const te = Math.max(prev[0] + 0.08, t - 0.24); keys.push([te, e], [t, r]); });
    keys.push([C1.foom + 0.2, pairs[pairs.length - 1][0] + 0.3]);
    // 倒放回下一拽的起点会把片段时间往回拉：pchip 允许（可以倒放）。保证时刻单调
    s.keys = keys.filter((k, i) => i === 0 || k[0] > keys[i - 1][0]); s.t0 = s.keys[0][0];
    SEG[2].yawKeys = [[25.38, s.yaw], [25.64, s.yaw], [25.88, 0]];
  }
  function poseAt(T) {
    let i = 0; for (let k = 0; k < SEG.length; k++) if (SEG[k].t0 - SEG[k].fade <= T) i = k;
    const s = SEG[i];
    if (i > 0 && !s.cut && T < s.t0) { const p = smooth((T - (s.t0 - s.fade)) / s.fade), a = SEG[i - 1]; return { pose: blendSolved(solveSeg(a, T), solveSeg(s, T), p), yaw: lerp(yawOf(a, T), yawOf(s, T), p) }; }
    return { pose: solveSeg(s, T), yaw: yawOf(s, T) };
  }
  // 她的根：盒 / 房间里 = 盒局部 (0, 0, 0.35)；楼顶 / 跃出 / 路上见 placeGirl
  const HER_BOX = V3(-0.95, 0, 0.25);               // 盒子阶段她站在左半边，翻牌屏让出来给镜头
  const ROOF_P = V3(0.4, ROOF + 0.25, towerZ - 1.2);
  const leapOff = 37.497;
  // 路上的位置：落地那一下（38.05）地速先压到 2.5 m/s（蹲着吃住冲击，脚不溜冰），0.28 s 内回到 11 m/s；38.4 时正好在 d = D0（= v4-03 起点）
  const vRoad = T => T < 38.05 ? 11 : lerp(2.5, 11, smooth((T - 38.05) / 0.28));
  const RT0 = 37.85, RDT = 0.001, rTab = [0]; for (let t = RT0; t < C1.end + 0.05; t += RDT) rTab.push(rTab[rTab.length - 1] + vRoad(t + RDT / 2) * RDT);
  const rAt = T => { const x = clamp((T - RT0) / RDT, 0, rTab.length - 1), i = Math.floor(x); return lerp(rTab[i], rTab[Math.min(rTab.length - 1, i + 1)], x - i); };
  const roadD = T => D0 + rAt(T) - rAt(38.4);
  // 落地那一镜用 v4-03 那条路的复制品（同 seed / 长度 / 滚转 / 断崖 / 障碍 → 楼的排布逐栋一样），38.4 硬切前后两边的楼对得上。
  //   参数照抄 shots/v4-03a.js 的 E / vOf / dRun / D（只读，不改它）；复制品整体平移到 x = OX，和楼 / 面具城互不相见。
  const R2 = (() => {
    const E = { accel: 41.34, vault: { start: 42.40, over: 0.56 }, jump: { start: 43.22, off: 0.38, land: 1.45 }, wall: { start: 44.85, a: 0.15 / 1.1 },
      wallOff: { start: 45.72, a: 0.2 / 1.6, b: 1.23 / 1.6 }, land: { start: 46.35, rate: 2.0 }, slide: { start: 46.90, low: 0.55 / 1.4 }, cliff: { start: 47.60, off: 0.38 } };
    E.landHit = E.land.start + 0.57 / E.land.rate; E.cliffOff = E.cliff.start + E.cliff.off;
    const vOf = t => { let v = t < E.accel ? 11 : lerp(11, 15, smooth((t - E.accel) / 0.7)); if (t > E.wall.start && t < E.wallOff.start + E.wallOff.b) v = Math.min(v, 12); const k = t - E.landHit; if (k > 0 && k < 0.6) v = lerp(5, 15, smooth(k / 0.6)); return v; };
    const T0 = 38.4, DT = 0.001, NT = Math.ceil((E.cliffOff + 0.2 - T0) / DT) + 2, tab = new Float64Array(NT);
    for (let i = 1; i < NT; i++) tab[i] = tab[i - 1] + vOf(T0 + (i - 0.5) * DT) * DT;
    const dRun = t => { const x = (t - T0) / DT; if (x <= 0) return vOf(T0) * (t - T0); if (x >= NT - 1) return tab[NT - 1]; const i = Math.floor(x); return lerp(tab[i], tab[i + 1], x - i); };
    const D = { gate: dRun(E.vault.start + E.vault.over), gapA: dRun(E.jump.start + E.jump.off) + 0.4, gapB: dRun(E.jump.start + E.jump.land) - 0.4,
      wall: dRun(E.wall.start + E.wall.a) - 1, wallEnd: dRun(E.wallOff.start + E.wallOff.a) + 1, beam: dRun(E.slide.start + E.slide.low), cliff: dRun(E.cliffOff) + 0.3 };
    const obstacles = [{ type: 'gate', d: D.gate - 0.15, len: 0.3, h: 1.0 }, { type: 'gap', d: D.gapA, len: D.gapB - D.gapA }, { type: 'wall', d: D.wall, len: D.wallEnd - D.wall, side: 1, h: 4.0 }, { type: 'beam', d: D.beam - 0.2, len: 0.4, y: 1.25 }];
    const r = createSpiralRun({ length: D.cliff + 30, roll: { start: dRun(40.4), end: dRun(46.2), turns: 1, radius: 8 }, words: [], obstacles, cliff: D.cliff, t0: T0, speed: 15 });
    const OX = 3000; r.group.position.x = OX; scene.add(r.group);
    // 路起点（d = 0）之前补一截路面：她 38.05 落在 d ≈ -3（v4-03 自己 38.4 之前也没有这截，只是镜头看不到）
    const ext = new THREE.Group(); ext.position.set(OX, 0, 0); scene.add(ext);
    const flat = (w, h, c, x, y, z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c })); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); ext.add(m); };
    flat(28, 16, '#15142a', 0, -0.01, 8);
    for (const x of [-2.2, 2.2]) flat(0.12, 16, hdr(PAL.mint, 1.6), x, 0, 8);
    for (let z = 1; z < 16; z += 3) flat(0.12, 1.2, hdr(PAL.lemon, 1.3), 0, 0, z);
    const m2 = new THREE.Mesh(new THREE.CircleGeometry(26, 64), new THREE.MeshBasicMaterial({ color: col(PAL.pink).multiplyScalar(1.25), fog: false }));
    m2.position.set(OX - 60, 95, -D.cliff - 150); m2.lookAt(OX, 0, -40); scene.add(m2);
    const frameAt = (d, sd = 0) => { const f = r.frameAt(d, sd, 1); f.pos.x += OX; return f; };
    return { r, OX, frameAt, dRun, D, ext, moon: m2 };
  })();
  const landD = T => rAt(T) - rAt(38.4);               // 复制品里的 d：38.4 时 = 0（= v4-03 起点）
  const wob = (r, c, T) => { const a = 0.9 * smooth((T - C1.shroom - 0.2) / 0.8) * (T < C1.roof ? 1 : 0); return a * Math.sin(r * 0.9 - (T - C1.shroom) * 4.2 + c * 0.25); };
  function placeGirl(T, lock = true) {
    scene.add(girl.root); girl.root.visible = true; girl.root.scale.setScalar(H);
    const { pose, yaw } = poseAt(T);
    let pos, face = Math.PI + yaw, up = null;
    if (T < C1.roof) pos = box.localToWorld(HER_BOX.clone());
    else if (T < C1.zero) pos = ROOF_P.clone();
    else if (T < C1.road) {
      const z0 = towerZ + 1.0;
      if (T < leapOff) pos = V3(0.4, ROOF + 0.25, z0 - 6 * (T - C1.zero));
      else { const k = T - leapOff; pos = V3(0.4, ROOF + 0.25 + 3 * k - 7.5 * k * k, z0 - 6 * (leapOff - C1.zero) - 7 * k); }
    } else {
      const f = R2.frameAt(landD(T)); pos = f.pos.clone().addScaledVector(f.up, Math.max(0, 22 * (38.05 - T)));
      up = f.up; face = Math.PI;
    }
    if (lock) pos.add(lockOff(T));
    girl.root.position.copy(pos); girl.root.rotation.set(0, face, 0);
    girl.root.updateMatrixWorld(true); girl.dancer.apply(pose); girl.root.updateMatrixWorld(true);
  }

  // 脚锁（同 v4-01-box）：片段是原地版，重心一动脚就在地上滑 → 把「接下来一直贴地」的那只脚钉住，滑动量变成根的位移。
  //   按 60 fps 预演成表（相对根的坐标，和楼 / 盒子在哪无关），之后 lockOff(T) 查表插值 —— 纯函数。
  const LOCKS = [[22.40, 25.36], [26.42, C1.roof - 0.002], [C1.roof, C1.d2]];
  const LFPS = 60, lockTabs = LOCKS.map(([tA, tB]) => {
    const FEET = ['LeftToeBase', 'RightToeBase'], LOW = 0.12, fr = [], rel = k => I[k].bone.getWorldPosition(V3()).sub(girl.root.position);
    for (let f = 0; f <= Math.round((tB - tA) * LFPS); f++) { placeGirl(tA + f / LFPS, false); fr.push(Object.fromEntries(FEET.map(k => [k, rel(k)]))); }
    const ahead = (k, f, n) => { let m = -1e9; for (let i = f; i <= Math.min(fr.length - 1, f + n); i++) m = Math.max(m, fr[i][k].y); return m; };
    const y0 = Math.min(...fr.map(q => Math.min(q.LeftToeBase.y, q.RightToeBase.y)));
    let anchor = null; const off = V3(), raw = [];
    for (let f = 0; f < fr.length; f++) {
      if (anchor && f > 0) { off.x -= fr[f][anchor].x - fr[f - 1][anchor].x; off.z -= fr[f][anchor].z - fr[f - 1][anchor].z; }
      if (anchor && ahead(anchor, f, 6) - y0 > LOW) anchor = null;
      else if (anchor && ahead(anchor, f, 18) - y0 > LOW) { const o = FEET.find(k => k !== anchor); if (fr[f][o].y - y0 <= LOW && ahead(o, f, 18) - y0 <= LOW) anchor = o; }
      if (!anchor) { const c = FEET.filter(k => fr[f][k].y - y0 <= LOW).sort((a, b) => ahead(a, f, 18) - ahead(b, f, 18)); anchor = c[0] ?? null; }
      raw.push(off.clone());
    }
    const G = [0.04, 0.12, 0.68, 0.12, 0.04], tab = raw.map((_, f) => { const o = V3(); G.forEach((w, i) => o.addScaledVector(raw[clamp(f + i - 2, 0, raw.length - 1)], w)); return o; });
    // 整段的平均漂移拉回来（她别越跳越偏到墙里去）：减掉一条从 0 到末值的直线里一半
    return { tA, tB, tab };
  });
  function lockOff(T) {
    for (const L of lockTabs) if (T >= L.tA && T <= L.tB) { const x = (T - L.tA) * LFPS, i = Math.floor(x), j = Math.min(L.tab.length - 1, i + 1); return L.tab[i].clone().lerp(L.tab[j], x - i); }
    const L0 = lockTabs[0];                                  // 拽完光缆的漂移：腾空那 0.26 s 里收回盒子正中
    if (T > L0.tB && T < LOCKS[1][0]) return L0.tab[L0.tab.length - 1].clone().multiplyScalar(1 - smooth((T - 25.64) / 0.26));
    return V3();
  }
  window.__lockDrift = () => lockTabs.map(L => ({ tA: L.tA, max: +Math.max(...L.tab.map(o => Math.hypot(o.x, o.z))).toFixed(2), end: [+L.tab[L.tab.length - 1].x.toFixed(2), +L.tab[L.tab.length - 1].z.toFixed(2)] }));

  // ================================================================ 每帧：世界
  function world(T) {
    // 盒 = 她那一间
    const fy = floorY(T);
    box.position.set(wob(RH, 2, T), fy + 0.03, towerZ); box.updateMatrixWorld(true);
    for (const k of 'NSWE') walls[k].tilt.rotation.x = wallAngle(k, T) * D2R;
    const lid = lidOpen(T); for (const f of flaps) { f.tilt.rotation.x = lid * D2R; f.tilt.visible = T < C1.trap; }
    const burst = T >= C1.burst ? Math.exp(-(T - C1.burst) / 0.35) : 0, on = T >= C1.burst ? 1 : 0;
    for (const k of 'NSWE') { const w = walls[k]; w.tube.mat.color.copy(w.tube.base).multiplyScalar(on * (1 + 2.5 * burst)); w.seams.material.color.copy(hdr(PAL.mint, 0.22 * on)); }
    floor.tube.mat.color.copy(floor.tube.base).multiplyScalar(on * (1 + 2.5 * burst)); floor.seams.material.color.copy(hdr(PAL.mint, 0.22 * on));
    for (const f of flaps) { f.tube.mat.color.copy(f.tube.base).multiplyScalar(on); f.seams.material.color.copy(hdr(PAL.mint, 0.22 * on)); }
    for (const k of 'NSWE') walls[k].eye.lit.color.copy(hdr(PAL.lemon, 1.4 + 1.5 * burst));
    // 正面墙：盒子阶段 = 翻牌屏；③ 起 = 玻璃窗
    const isGlass = T >= C1.slam.N - 0.05;
    walls.N.solid.visible = walls.N.win.visible = !isGlass; glass.visible = isGlass; walls.N.eye.g.visible = !isGlass;
    flipMesh.visible = flipFrame.g.visible = !isGlass;
    walls.N.seams.visible = !isGlass;
    flip.draw(T);
    const flipFlash = C1.pulls.reduce((a, t) => a + (T >= t ? Math.exp(-(T - t) / 0.18) : 0), 0);
    flipMat.color.copy(hdr('#ffffff', T < C1.burst ? 0 : 0.95 + 0.6 * burst + 0.35 * flipFlash));
    flipFrame.mat.color.copy(flipFrame.base).multiplyScalar(on * (1 + 1.2 * flipFlash));
    // 楼
    const lowY = fy - RH * S;
    for (const q of cells) {
      let y, vis = true, lit;
      if (q.r < RH) { y = lowY + q.r * S; vis = y + S > -1; lit = smooth((T - (C1.trap + 0.1 + (RH - 1 - q.r) * 0.09)) / 0.12); }
      else { const land = rowLand(q.r), off = dropOff(land, T); y = q.r * S + off; vis = off < 1e3; lit = smooth((T - land - 0.04) / 0.1); }
      const x = (q.c - 2) * S + wob(q.r, q.c, T);
      q.g.position.set(x, y, towerZ); q.g.visible = vis;
      const fl = lit * (0.85 + 0.15 * Math.sin(T * 7 + q.r * 1.3 + q.c));
      q.backMat.color.copy(q.tint).multiplyScalar(0.25 + 1.1 * fl);
      q.fr.mat.color.copy(q.fr.base).multiplyScalar(0.15 + 0.85 * lit);
      // 克隆：和她同一副骨架，平移到这一间
      const show = q.g.visible && lit > 0.3 && T >= C1.trap && T < C1.roof;
      q.clone.visible = show;
      if (show) { const d = V3(x - box.position.x, y - (box.position.y - 0.03), 0); q.clone.matrix.makeTranslation(d.x, d.y, d.z); q.clone.matrixWorldNeedsUpdate = true; }
      // 蘑菇
      const cp = q.cap, gr = eOut((T - cp.at) / (cp.big ? 0.35 : 0.5));
      cp.g.visible = q.g.visible && gr > 0.01 && T < C1.roof;
      if (cp.g.visible) { const breathe = 1 + 0.06 * Math.sin(T * 6 + q.r + q.c * 2); cp.g.scale.setScalar(cp.size * gr * breathe); }
    }
    lowRoof.position.set(0, fy - 0.17, towerZ); lowRoof.visible = T < C1.land[0] + 0.05;
    roofSlab.position.set(wob(NR, 2, T), dropOff(C1.crown - 0.1, T) + ROOF + 0.25, towerZ);
    roofSlab.visible = T >= C1.trap && dropOff(C1.crown - 0.1, T) < 1e3;
    crown.position.set(wob(NR, 2, T), ROOF + 3.2 + dropOff(C1.crown, T), towerZ + HS - 0.3);
    crown.visible = T >= C1.trap && dropOff(C1.crown, T) < 1e3 && T < C1.roof;   // 楼顶段起收掉（跃出时镜头在它后面）
    flipC.draw(T);
    // 招牌
    flipFOOM.forEach((s, i) => { const up = eOut((T - s.at) / 0.25); s.g.position.set((1.5 - i) * 4.9, fy + lerp(-3, 5.9, up), towerZ + HS + 1.2); s.g.rotation.y = Math.PI; /* 她身后、头顶上方，跟着楼一起冲上来 */ });
    sBag.forEach((s, i) => { s.g.position.set(s.x + wob(RH + 1, 2, T), (RH + 1) * S + HS + dropOff(rowLand(RH + 1), T), towerZ - HS - 0.4); s.g.rotation.y = Math.PI; });
    for (const s of allSigns) s.set(T);
    for (const s of sSee) if (T >= C1.pov) s.g.visible = false;     // 主观镜头里让给倒计时
    for (const s of flipFOOM) s.g.visible = T >= C1.foom - 0.02 && T < s.until;
    sTrapRow.forEach(q => { q.g.position.set(q.x, RH * S - 2.5, towerZ - HS - 0.45); q.g.rotation.y = Math.PI; });   // 她那一层窗下沿（下面那层的上半截）
    // 面具城 + 触手
    facadeState(T); tentacles(T);
    tentLight.intensity = T >= C1.roof ? 4.5 : 0; tentRim.intensity = T >= C1.roof ? 3.5 : 0;
    // 灯：盒子阶段暗（眼 + 翻牌屏 + 灯管），出盒以后正常
    const out = smooth((T - C1.foom) / 0.3);
    const dark = T < C1.burst ? 0 : 1;                       // 22.5–22.509：接 v4-01 的全黑，只剩四只眼
    for (const l of glKey) { l.userData.base ??= l.intensity; l.intensity = dark * l.userData.base * lerp(0.45, 1, out); }
    hemi.intensity = dark * lerp(0.35, 0.5, out);
    scene.fog.far = T >= C1.roof && T < C1.road ? 900 : 230;
    R2.r.update(T, { d: Math.max(0, landD(T)), fold: 1 }); R2.r.group.visible = R2.ext.visible = R2.moon.visible = T >= C1.road;
    // 她
    placeGirl(T);
    girl.setSkin('toon', T);
    if (T < C1.burst) girl.root.visible = false;
    scene.updateMatrixWorld(true);
    // 光缆
    rope.visible = T >= C1.burst && T < C1.foom + 0.05;
    if (rope.visible) {
      const a = socket.getWorldPosition(V3()), b = I.LeftHand.bone.getWorldPosition(V3()).add(I.RightHand.bone.getWorldPosition(V3())).multiplyScalar(0.5);
      const sag = 0.25 * (1 - clamp(flipFlash)), mid = a.clone().lerp(b, 0.5); mid.y -= sag;
      const tail = b.clone().add(b.clone().sub(a).setY(0).normalize().multiplyScalar(0.7)); tail.y = 0.05;
      rope.geometry.dispose(); rope.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([a, mid, b, tail]), 40, 0.028, 6);
    }
  }

  // ================================================================ 镜头
  const cam = new THREE.PerspectiveCamera(60, W / Hh, 0.05, 2000); scene.add(cam);
  const shakeY = (T, list) => { let y = 0; for (const [t, a] of list) { const k = T - t; if (k > 0) y += a * Math.exp(-k * 9) * Math.sin(k * 55); } return y; };
  function look(pos, tgt, fov, up = null) { cam.position.copy(pos); cam.up.copy(up ?? V3(0, 1, 0)); cam.lookAt(tgt); cam.fov = fov; cam.updateProjectionMatrix(); cam.updateMatrixWorld(true); }
  const BL = p => box.localToWorld(p.clone());
  const camA = T => {    // 盒内：她身后偏右的低机位，看着翻牌屏；每拽一下往前推一点、震一下
    const z = pchip([[22.5, 2.1], [23.9, 1.85], [25.5, 1.55]], T), sh = shakeY(T, C1.pulls.map(t => [t, 0.035]).concat([[C1.burst, 0.06]]));
    look(BL(V3(1.55, 0.85 + sh, z)), BL(V3(-0.1, 1.7, -2.2)), 70);
  };
  const camB = T => {    // FOOM：墙倒、楼把她顶上去 —— 镜头跟着往上、绕到楼前面仰看她和楼身上的 FOOM
    const fy = floorY(T);
    const p = pv([[C1.foom, 1.55, 0.88, 1.55], [25.74, 0.9, 4.6, 1.6], [25.98, 1.4, 1.6, -4.8], [C1.trap, 0.9, 0.5, -6.6]], T);
    look(V3(p.x, fy + p.y + 0.03 + shakeY(T, [[C1.foom, 0.12]]), towerZ + p.z), V3(-0.6, fy + pchip([[C1.foom, 1.8], [25.74, 0.2], [25.98, 1.6], [C1.trap, 2.7]], T), towerZ + pchip([[C1.foom, -2], [25.74, -0.6], [C1.trap, 0]], T)), pchip([[C1.foom, 70], [25.74, 74], [C1.trap, 68]], T));
  };
  const camC = T => {    // Trapped：先在她窗前（玻璃砸上来），再急速拉远 → 整栋楼
    const fy = floorY(T), u = smooth((T - 26.62) / 0.85);
    const p = V3(lerp(0.9, 0, u), lerp(fy + 0.5, 8, u), towerZ + lerp(-6.6, -44, u));
    const tg = V3(lerp(-0.6, 0, u), lerp(fy + 2.0, 25, u), towerZ);
    look(p.add(V3(0, shakeY(T, [[C1.slam.N, 0.08], ...C1.land.map(t => [t, 0.05]), [C1.crown, 0.06]]), 0)), tg, lerp(68, 64, u));
  };
  const camD = T => {    // shrooms：从全楼推回她那扇窗（跟着她那一间的摆动）
    const fy = floorY(T), u = smooth((T - C1.shroom + 0.35) / 2.25), wx = wob(RH, 2, T);
    const p = V3(lerp(0, wx * 0.8, u) + 1.4 * Math.sin((T - C1.shroom) * 1.3) * u, lerp(8, fy - 0.3, u), towerZ + lerp(-44, -HS - 9.5, u ** 0.8));
    look(p, V3(wx * 0.9, lerp(25, fy - 0.5, u), towerZ), lerp(64, 46, u), V3(Math.sin((T - C1.shroom) * 2.1) * 0.05 * u, 1, 0).normalize());
  };
  const camE = T => {    // 楼顶：她右肩后方，看向面具城；32.0 起慢推
    const u = smooth((T - 31.0) / 2.4), hd = ROOF_P.clone();
    look(hd.clone().add(V3(lerp(1.5, 1.1, u), lerp(2.0, 1.85, u), lerp(3.6, 2.4, u))), V3(faceW.x * lerp(0.55, 0.75, u), lerp(62, 68, u), FC.z), lerp(46, 34, u));
  };
  const camG = T => {    // 她的视角（护目镜里）
    const u = smooth((T - C1.pov) / 1.5);
    look(ROOF_P.clone().add(V3(0, 1.75, 0)), faceW.clone().add(V3(0, 4, 0)), lerp(36, 27, u));
  };
  const camH = T => {    // 跃出楼顶：身后跟拍，冲出楼沿时往下看
    const p = girl.root.position, u = smooth((T - leapOff) / 0.4);
    look(V3(p.x + 1.2, ROOF + lerp(1.9, 3.2, u), Math.max(p.z + lerp(3.4, 2.2, u), towerZ - HS - 0.6 + lerp(3.4, 0, u))), V3(p.x, p.y + lerp(1.2, -3.5, u), p.z - lerp(3, 5, u)), lerp(60, 70, u));
  };
  // 路上：v4-03 的 chase（38.4 时 back 3.6、lat -0.8、up 0.45、ahead 6、lookUp 0.9、fov 60，含跑步微震）
  const stepShake = T => { const per = 0.533 / 1.8 / 2, ph = (((T - 38.0) % per) + per) % per / per; return Math.exp(-ph * 7) * 0.035; };
  const camR = T => {
    const d = landD(T), k = smooth((T - C1.road) / 0.4);
    const back = lerp(5.5, 3.6, k), up = lerp(2.4, 0.45, k), fc = R2.frameAt(d - back, -0.8), fa = R2.frameAt(d + 6, 0), sh = stepShake(T) * smooth((T - 38.15) / 0.1);
    cam.position.copy(fc.pos).addScaledVector(fc.up, up + sh).addScaledVector(fc.side, sh * 0.4); cam.up.copy(fc.up);
    cam.lookAt(fa.pos.addScaledVector(fa.up, lerp(0.2, 0.9, k))); cam.fov = 60; cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
  };

  // 屏幕速度线（照搬 v4-03a 的 drawSpeedLines：边缘放射、按帧号换一批）。38.15 起渐强到 v4-03 起跑那一镜的强度 0.35
  const NSL = 90, slPos = new Float32Array(NSL * 6), slGeo = new THREE.BufferGeometry(); slGeo.setAttribute('position', new THREE.BufferAttribute(slPos, 3));
  const slMat = new THREE.LineBasicMaterial({ color: col(PAL.paper).multiplyScalar(1.3), transparent: true, opacity: 0.5, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending });
  const speedLines = new THREE.LineSegments(slGeo, slMat); speedLines.frustumCulled = false; speedLines.renderOrder = 20; cam.add(speedLines);
  const hash = (a, b) => { let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  function drawSpeedLines(T) {
    const amt = T >= 38.15 ? 0.35 * smooth((T - 38.15) / 0.25) : 0;
    speedLines.visible = amt > 0.02; if (!speedLines.visible) return;
    const f = Math.floor(T * 30), z = -1, hh = Math.tan(cam.fov * D2R / 2), ww = hh * cam.aspect;
    for (let i = 0; i < NSL; i++) {
      const a = hash(i, f) * Math.PI * 2, r0 = lerp(0.55, 0.95, hash(i + 99, f)), len = lerp(0.08, 0.35, hash(i + 7, f)) * (0.5 + amt), on = hash(i + 55, f) < amt;
      slPos.set(on ? [Math.cos(a) * r0 * ww, Math.sin(a) * r0 * hh, z, Math.cos(a) * (r0 + len) * ww, Math.sin(a) * (r0 + len) * hh, z] : [0, 0, z, 0, 0, z], i * 6);
    }
    slGeo.attributes.position.needsUpdate = true; slMat.opacity = 0.35 + 0.35 * amt;
  }

  // ================================================================ ⑥ 2D 关键画：拉下护目镜
  const s2 = new THREE.Scene(); s2.background = col('#07070d');
  const oc = new THREE.OrthographicCamera(-8, 8, 4.5, -4.5, 0.1, 100); oc.position.z = 10;
  const ld = new THREE.TextureLoader(), K = n => new URL(`../fresh/c1-v4/k2d/cut-${n}.png`, import.meta.url).href;
  const tex2 = await Promise.all(['A', 'B2', 'C2', 'C2open'].map(n => ld.loadAsync(K(n))));
  tex2.forEach(t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; });
  const IMH = 13.2, IMW = IMH * 832 / 1248;
  const charMat = new THREE.MeshBasicMaterial({ map: tex2[0], transparent: true });
  const charM = new THREE.Mesh(new THREE.PlaneGeometry(IMW, IMH), charMat); charM.position.z = 1; s2.add(charM);
  // 镜片里的红色 HUD（贴在关键画上，按原图像素坐标画）
  const hudC = document.createElement('canvas'); hudC.width = 832; hudC.height = 1248; const hg = hudC.getContext('2d');
  const hudT = new THREE.CanvasTexture(hudC); hudT.colorSpace = THREE.SRGBColorSpace;
  const hudM = new THREE.Mesh(new THREE.PlaneGeometry(IMW, IMH), new THREE.MeshBasicMaterial({ map: hudT, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  hudM.position.z = 1.1; s2.add(hudM);
  // 背景：虚化的霓虹城（纯 canvas，种子固定）
  const bgC = document.createElement('canvas'); bgC.width = 1600; bgC.height = 900;
  { const g = bgC.getContext('2d'), rnd = mulberry32(2024), gr = g.createLinearGradient(0, 0, 0, 900); gr.addColorStop(0, '#0b0820'); gr.addColorStop(1, '#170a22'); g.fillStyle = gr; g.fillRect(0, 0, 1600, 900);
    g.filter = 'blur(18px)';
    for (let i = 0; i < 70; i++) { const c = [PAL.pink, PAL.mint, PAL.lemon, '#ffe2a8'][Math.floor(rnd() * 4)]; g.globalAlpha = 0.25 + rnd() * 0.45; g.fillStyle = c; const x = rnd() * 1600, y = 300 + rnd() * 600, r = 12 + rnd() * 50; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
    g.globalAlpha = 0.85; g.fillStyle = PAL.pink; g.beginPath(); g.arc(330, 190, 110, 0, 7); g.fill(); }
  const bgT = new THREE.CanvasTexture(bgC); bgT.colorSpace = THREE.SRGBColorSpace;
  const bgM = new THREE.Mesh(new THREE.PlaneGeometry(18, 10.2), new THREE.MeshBasicMaterial({ map: bgT })); bgM.position.z = -5; s2.add(bgM);
  const s2Signs = [['WITH YOUR', PAL.mint, wt(L.eyes, 0)], ['SHINIGAMI', PAL.pink, wt(L.eyes, 2)], ['EYES', PAL.lemon, wt(L.eyes, 3)]].map(([t, c, at], i) => {
    const s = makeSign(t, c, i === 1 ? 1.15 : 0.9); s.at = at; s2.add(s.g); s.g.position.set(-7.4 + s.bw / 2, 2.0 - i * 1.75, 2); return s; });
  const EYE_PX = [[296, 386], [509, 386]];
  function draw2D(T) {
    const k = T - C1.d2;
    const phase = T < 33.62 ? 0 : T < C1.snap ? 1 : 2;
    const vocal = music.energy('vocal', T);
    charMat.map = phase === 0 ? tex2[0] : phase === 1 ? tex2[1] : (vocal > 0.3 && T < 37.3 ? tex2[3] : tex2[2]);
    const pullY = phase === 1 ? -0.18 * smooth((T - 33.62) / 0.25) : 0;
    const snapK = T >= C1.snap ? Math.exp(-(T - C1.snap) / 0.08) : 0;
    const sc = 1 + 0.05 * smooth(k / 2.3);
    charM.scale.setScalar(sc); hudM.scale.setScalar(sc);
    charM.position.set(3.7 - 0.25 * smooth(k / 2.3), -0.75 + pullY - 0.12 * snapK, 1); hudM.position.set(charM.position.x, charM.position.y, 1.1);
    bgM.position.x = 0.3 * smooth(k / 2.3);
    // 镜片里的 HUD：红眼亮起之后，两只眼各一圈准星 + 一行小字
    hg.clearRect(0, 0, 832, 1248);
    const on = phase === 2 ? smooth((T - C1.snap - 0.08) / 0.25) : 0;
    if (on > 0) {
      hg.globalAlpha = on; hg.strokeStyle = '#ff3040'; hg.fillStyle = '#ff3040'; hg.lineWidth = 3;
      for (const [x, y] of EYE_PX) { const r = 34 + 6 * Math.sin(T * 8); hg.beginPath(); hg.arc(x, y, r, 0, 7); hg.stroke(); for (let a = 0; a < 4; a++) { const th = a * Math.PI / 2 + T * 1.5; hg.beginPath(); hg.moveTo(x + Math.cos(th) * (r + 6), y + Math.sin(th) * (r + 6)); hg.lineTo(x + Math.cos(th) * (r + 18), y + Math.sin(th) * (r + 18)); hg.stroke(); } }
      hg.font = `22px ${FONT}`; hg.fillText('SHOGGOTH  00:00:0' + Math.max(0, Math.ceil(C1.zero - T)), 236, 350); hg.fillText('P(DOOM) 0.99', 470, 486);
      hg.globalAlpha = 0.18 * on; hg.fillRect(222, 330 + ((T * 260) % 160), 390, 3);
    }
    hudT.needsUpdate = true;
    for (const s of s2Signs) s.set(T, { dim: 0.18 });
    oc.updateMatrixWorld(true);
    return { flash: snapK > 0.01 ? { amount: 0.35 * snapK, color: '#ff4060' } : 0, shake: snapK };
  }

  // ================================================================ ⑦ HUD（她的视角）：镜片框 + 红色准星 + 倒计时（画在镜头前的一张 canvas 上）
  const hC = document.createElement('canvas'); hC.width = W; hC.height = Hh; const hx = hC.getContext('2d');
  const hT = new THREE.CanvasTexture(hC); hT.colorSpace = THREE.SRGBColorSpace;
  const hudPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: hT, transparent: true, depthTest: false, depthWrite: false, toneMapped: false }));
  hudPlane.renderOrder = 50; cam.add(hudPlane);
  function drawHUD(T) {
    hudPlane.visible = T >= C1.pov && T < C1.zero;
    if (!hudPlane.visible) return;
    const hh = 2 * Math.tan(cam.fov * D2R / 2) * 0.5; hudPlane.position.set(0, 0, -0.5); hudPlane.scale.set(hh * W / Hh, hh, 1);
    const u = Hh / 540; hx.clearRect(0, 0, W, Hh);
    // 镜片框：灰色半透明镜片（整屏轻微压灰）+ 黑色框边（圆角宽带形）
    hx.fillStyle = 'rgba(150,160,170,0.10)'; hx.fillRect(0, 0, W, Hh);
    hx.save(); hx.beginPath(); hx.rect(0, 0, W, Hh); hx.roundRect(W * 0.035, Hh * 0.07, W * 0.93, Hh * 0.86, Hh * 0.2); hx.fillStyle = 'rgba(20,22,28,0.94)'; hx.fill('evenodd'); hx.restore();
    // 目标框
    const p = faceW.clone().project(cam), q = faceW.clone().add(V3(face.R * cw, 0, 0)).project(cam);
    const cx = (p.x + 1) / 2 * W, cy = (1 - p.y) / 2 * Hh, r = Math.abs(q.x - p.x) / 2 * W * 1.05;
    const red = '#ff2a3a', a = smooth((T - C1.pov) / 0.2);
    hx.globalAlpha = a; hx.strokeStyle = red; hx.fillStyle = red; hx.lineWidth = 3 * u;
    const bx0 = cx - r, by0 = cy - r * 0.95, bx1 = cx + r, by1 = cy + r * 0.95, L2 = r * 0.28;
    for (const [x, y, sx, sy] of [[bx0, by0, 1, 1], [bx1, by0, -1, 1], [bx0, by1, 1, -1], [bx1, by1, -1, -1]]) { hx.beginPath(); hx.moveTo(x + sx * L2, y); hx.lineTo(x, y); hx.lineTo(x, y + sy * L2); hx.stroke(); }
    const left = Math.max(0, C1.zero - T), ss = Math.floor(left), cc = Math.floor((left - ss) * 100);
    hx.font = `${Math.round(40 * u)}px ${FONT}`; hx.textAlign = 'left'; hx.textBaseline = 'bottom';
    hx.fillText('SHOGGOTH', bx0, by0 - 8 * u);
    hx.font = `${Math.round(48 * u)}px ${FONT}`; hx.textBaseline = 'top';
    hx.fillText(`00:00:0${ss}.${String(cc).padStart(2, '0')}`, bx0, by1 + 8 * u);
    hx.font = `${Math.round(30 * u)}px ${FONT}`; hx.fillText('P(DOOM) 0.99', W * 0.07, Hh * 0.79);
    hx.textAlign = 'right'; hx.fillText(T < C1.pov + 0.15 ? 'SCAN' : T < C1.pov + 1.3 ? 'BURNING MASK' : 'TRUE FORM', W * 0.93, Hh * 0.12);
    hx.globalAlpha = 0.08 * a; for (let y = 0; y < Hh; y += 4 * u) hx.fillRect(0, y, W, u);   // 扫描线
    hx.globalAlpha = 1;
    hT.needsUpdate = true;
  }

  // ================================================================ 镜头表
  const postBase = (T, extra = {}) => ({ bloom: { strength: 0.8, threshold: 1.0 }, chroma: 0.1 + 0.3 * kick(T), grade: { vignette: 0.38 }, ...extra });
  const face3d = (T) => { if (girl.face && girl.root.visible) girl.face.update(T, { camera: cam, expression: T < C1.foom ? 'neutral' : undefined }); };
  const shot3d = (id, t0, t1, camFn, extra = () => ({}), { faceOn = true, hide = false } = {}) => ({
    id, t0, t1, transitionIn: { kind: 'cut' }, build() { return {}; },
    update(_, T) { world(T); camFn(T); tentEyes(cam); drawSpeedLines(T); if (hide) girl.root.visible = false; drawHUD(T); if (faceOn) face3d(T); return { scene, camera: cam, post: postBase(T, extra(T)) }; },
  });
  const shots = [
    shot3d('c1-box', C1.t0, C1.foom, camA, T => ({ flash: T >= C1.burst ? { amount: 0.55 * Math.exp(-(T - C1.burst) / 0.12), color: '#fff6d0' } : 0, chroma: 0.1 + 0.3 * kick(T) + 0.5 * (T >= C1.burst ? Math.exp(-(T - C1.burst) / 0.2) : 0) })),
    shot3d('c1-foom', C1.foom, C1.trap, camB, T => ({ flash: { amount: 0.4 * Math.exp(-(T - C1.foom) / 0.1), color: '#ffffff' }, chroma: 0.15 + 0.9 * Math.exp(-(T - C1.foom) / 0.25) })),
    shot3d('c1-room', C1.trap, C1.shroom, camC),
    shot3d('c1-shroom', C1.shroom, C1.roof, camD, T => ({ bloom: { strength: 0.6, threshold: 1.2 }, chroma: 0.12 + 0.2 * Math.sin((T - C1.shroom) * 3) ** 2, grade: { vignette: 0.38, saturation: 1.15 } })),
    shot3d('c1-roof', C1.roof, C1.d2, camE),
    { id: 'c1-eyes2d', t0: C1.d2, t1: C1.pov, transitionIn: { kind: 'cut' }, build() { return {}; },
      update(_, T) { const r = draw2D(T); oc.position.set(0.04 * r.shake * Math.sin(T * 90), 0.04 * r.shake * Math.cos(T * 77), 10); return { scene: s2, camera: oc, post: { bloom: { strength: 0.5, threshold: 1.2 }, chroma: 0.08 + 0.4 * r.shake, grade: { vignette: 0.32 }, flash: r.flash } }; } },
    shot3d('c1-pov', C1.pov, C1.zero, camG, T => ({ grade: { vignette: 0.2, tint: '#ff3040', tintAmount: 0.12 } }), { hide: true, faceOn: false }),
    shot3d('c1-leap', C1.zero, C1.road, camH, T => ({ flash: { amount: 0.35 * Math.exp(-(T - C1.zero) / 0.1), color: '#ff3040' } })),
    shot3d('c1-land', C1.road, C1.end, camR, T => ({ chroma: 0.1 + 0.25 * 0.35 + 0.3 * kick(T) })),
  ];

  // ================================================================ 自检：window.__c1Check() —— 脚滑 / 招牌被她挡 / 唱到时字高 / 画面有没有在动
  window.__c1Check = ({ fps = 30, t0 = C1.t0, t1 = C1.end } = {}) => {
    const out = { slide: [], signHit: [], textPx: [], still: [] }, prev = {};
    const KEYS = ['Head', 'Hips', 'LeftHand', 'RightHand', 'LeftFoot', 'RightFoot', 'LeftToeBase', 'RightToeBase'];
    let lastMove = t0, lastImg = null;
    for (let f = Math.round(t0 * fps); f <= Math.round(t1 * fps); f++) {
      const T = f / fps, sh = shots.find(s => T >= s.t0 && T < s.t1); if (!sh) continue;
      if (sh.id === 'c1-eyes2d') continue;
      sh.update(null, T); scene.updateMatrixWorld(true);
      const rel = T < C1.roof ? box.position.clone().setY(0) : V3(), P = Object.fromEntries(KEYS.map(k => [k, I[k].bone.getWorldPosition(V3()).sub(rel)]));
      const ground = T < C1.roof ? box.position.y : T < C1.road ? ROOF + 0.25 : R2.frameAt(landD(T)).pos.y;
      const onRoad = T >= C1.road;
      const vs = ['LeftToeBase', 'RightToeBase'].filter(k => prev[k] && prev.T === sh.id && P[k].y - ground < 0.1 && prev[k].y - ground < 0.1).map(k => Math.hypot(P[k].x - prev[k].x, P[k].z - prev[k].z) * fps - (onRoad ? vRoad(T) : 0));
      if (vs.length && Math.min(...vs.map(Math.abs)) > 0.15 && !(T >= C1.zero && T < C1.road)) out.slide.push({ T: +T.toFixed(3), v: +Math.min(...vs.map(Math.abs)).toFixed(2), shot: sh.id });
      for (const k of KEYS) prev[k] = P[k]; prev.T = sh.id;
      // 她的屏幕框
      const ndc = KEYS.map(k => P[k].clone().add(rel).project(cam)), vis = girl.root.visible;
      const gb = { x0: Math.min(...ndc.map(p => p.x)) - 0.04, x1: Math.max(...ndc.map(p => p.x)) + 0.04, y0: Math.min(...ndc.map(p => p.y)) - 0.05, y1: Math.max(...ndc.map(p => p.y)) + 0.09 };
      for (const s of allSigns) {
        let shown = T >= s.at; for (let o = s.g; o && shown; o = o.parent) shown = o.visible;
        if (!shown) continue;
        s.g.updateMatrixWorld(true);
        const cs = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => s.m.localToWorld(V3(a * s.bw / 2, b * s.bh / 2, 0)).project(cam));
        if (cs.some(p => p.z > 1)) continue;
        const r = { x0: Math.min(...cs.map(p => p.x)), x1: Math.max(...cs.map(p => p.x)), y0: Math.min(...cs.map(p => p.y)), y1: Math.max(...cs.map(p => p.y)) };
        const onScr = r.x1 > -1 && r.x0 < 1 && r.y1 > -1 && r.y0 < 1;
        if (vis && onScr && r.x0 < gb.x1 && gb.x0 < r.x1 && r.y0 < gb.y1 && gb.y0 < r.y1) out.signHit.push({ T: +T.toFixed(2), word: s.text });
        if (Math.abs(T - (s.at + 0.1)) < 0.5 / fps) out.textPx.push({ word: s.text, T: +T.toFixed(2), textPct: +((r.y1 - r.y0) / 2 * s.th / s.bh * 100).toFixed(1), inFrame: r.x0 > -1 && r.x1 < 1 && r.y0 > -1 && r.y1 < 1 });
      }
    }
    // 合并相邻的被挡帧
    const merge = a => a.reduce((o, x) => { const l = o[o.length - 1]; if (l && l.word === x.word && x.T - l.to < 0.1) l.to = x.T; else o.push({ word: x.word, from: x.T, to: x.T }); return o; }, []);
    out.signHit = merge(out.signHit);
    out.pullPairs = window.__pullPairs; out.drift = window.__lockDrift();
    return out;
  };
  return shots;
}

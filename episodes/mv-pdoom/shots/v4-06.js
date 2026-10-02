// shots/v4-06.js — v4 桥段（歌曲时间 109.3–123.9 s），STORYBOARD-v4 第二节「桥段」+ 第五节数学图形。
//
//   const { shots, cuts } = await makeV406(mv, { ui, girl });   // ui = await createUI2D(mv)，girl = await createGirl(mv)（可省）
//   mv.mount(shots, { offset: 109.3, duration: 14.6 });
//
// 每拍在 2D（扁平框图 / 界面，正交相机）和 3D（同一样东西的立体版）之间翻一次；每个画面停满 1 拍。
// 六段，段首落在「这句开唱前后最近的拍」上：
//   A 109.323 transformers   2D 模型框图（标题栏逐词打出歌词）↔ 3D 无限方块塔俯冲（塔上三块「歌词块」唱到亮）
//   B disobey                2D 框图里的方块（标签 = 歌词词）逐个出现，唱到 disobey 全部逃出框 ↔ 3D 同样的方块从塔里翻飞出去
//   C super-dense            3D 门格海绵逐级填满、整体压缩（远处一个 voxel 小剪影）↔ 2D 谢尔宾斯基地毯 → 最后缩成一个像素；铭牌刻字
//   D safety fence           2D 一层层「警告」弹窗（标题 = 歌词词）↔ 3D 镜头撞穿弹窗，弹窗沃罗诺伊碎开
//   E hundred thousand GPU   3D 显卡按叶序铺开，LED 麦浪用二维波动方程从中心（她脚下）按拍扩散；大显卡散热片上的铭牌刻字
//                            ↔ 2D 同一片集群的俯视点阵图
//   F RLHF askew             2D 点赞 / 点踩界面疯点、整个歪 15°，唱到 askew 盖 ASKEW 大章
//                            ↔ 3D 点赞点踩图标沿 sigmoid / ReLU 轨迹被甩歪，世界歪 15°，故障
// 字全部走载体（框图标签、窗口标题、弹窗标题、铭牌、按钮区），只有 ASKEW 是关键词大字。所有 update 都是 T 的纯函数。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { FX } from '../kits/type3d.js';
import { createGirlLights } from '../kits/girl.js';
import { plate } from '../kits/carriers.js';
import { createMenger, phyllotaxisPoints, WAVE_GLSL, waveHeight, neonAt } from '../kits/mathart.js';
import { createShatter } from '../kits/vfx.js';
import { mulberry32 } from '../kits/world.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eBack = (p, s = 1.7) => { p = clamp(p); return 1 + (s + 1) * (p - 1) ** 3 + s * (p - 1) ** 2; };
const col = c => new THREE.Color(c);
const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k);
const clean = w => w.replace(/[“”"!,.]/g, '').toUpperCase();

function lineOf(mv, prefix) {
  const l = mv.lyrics.lines.find(x => x.text.replace(/[“”"]/g, '').toLowerCase().startsWith(prefix.toLowerCase()));
  if (!l) throw new Error(`v4-06：找不到歌词「${prefix}」`);
  return l;
}
export function cuts(mv) {
  const L = {
    tr: lineOf(mv, 'Just transformers'), dis: lineOf(mv, 'Till you learned'), dense: lineOf(mv, 'Post-Chinchilla'),
    fence: lineOf(mv, 'Breaking through'), gpu: lineOf(mv, 'Hundred thousand'), rlhf: lineOf(mv, 'RLHF'),
  };
  const B = mv.audio.beats;
  const near = t => B.reduce((a, b) => (Math.abs(b - t) < Math.abs(a - t) ? b : a));   // 离开唱最近的拍
  const c = { start: 109.3, end: 123.9 };
  c.A = B.find(b => b >= 109.3 - 0.05);
  c.B = near(L.dis.start); c.C = near(L.dense.start); c.D = near(L.fence.start); c.E = near(L.gpu.start); c.F = near(L.rlhf.start);
  return { c, L };
}

// ---------------------------------------------------------------- 小工具
const persp = (fov = 45) => new THREE.PerspectiveCamera(fov, 16 / 9, 0.05, 800);
const scn = (bg = PAL.ink) => { const s = new THREE.Scene(); s.background = col(bg); return s; };
function overlay(scene, camera, d = 0.5) {
  const g = new THREE.Group(); g.position.z = -d;
  g.scale.setScalar((2 * d * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / 21.44);
  camera.add(g); scene.add(camera); return g;
}
// 画布上的「纸面卡片」：扁平实心 + 墨色粗描边 + 右下实投影（和 ui2d 同一套画风）
function card(ui, ctx, x, y, w, h, r, fill, lw = 5, shadow = 10) {
  ui.rrect(ctx, x + shadow, y + shadow, w, h, r); ctx.fillStyle = PAL.ink; ctx.fill();
  ui.rrect(ctx, x, y, w, h, r); ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = lw; ctx.strokeStyle = PAL.ink; ctx.stroke();
}
// 标签贴图（3D 方块面）
function labelTex(text, bg, fg = PAL.ink) {
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 128;
  const g = cv.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, 512, 128); g.strokeStyle = fg; g.lineWidth = 8; g.strokeRect(6, 6, 500, 116);
  g.fillStyle = fg; let px = 70; g.font = `${px}px "UIBebas", "Bebas Neue", sans-serif`;
  while (g.measureText(text).width > 470 && px > 20) { px -= 4; g.font = `${px}px "UIBebas", "Bebas Neue", sans-serif`; }
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 256, 68);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function labeledBox(text, color, w = 2.4, h = 0.9) {
  const tex = labelTex(text, color);
  const side = new THREE.MeshBasicMaterial({ map: tex }), top = new THREE.MeshBasicMaterial({ color: col(color).multiplyScalar(0.55) });
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), [side, side, top, top, side, side]);
  m.add(new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), new THREE.LineBasicMaterial({ color: PAL.ink })));
  m.userData.side = side;
  return m;
}
// 一个显示 2D 画布的正交舞台（沿用 ui.stage2D），plane 可旋转（歪 15°）
function flat(ui) { const S = ui.surface(1920, 1080); const st = ui.stage2D(S); return { S, ...st }; }

// ================================================================ 镜头
export async function makeV406(mv, { ui, girl = null } = {}) {
  const { c, L } = cuts(mv);
  const A = mv.audio, P = A.beat_period;
  const beatIdx = T => A.beats.filter(b => b <= T + 1e-3).length - 1;
  const kOf = (T, t0) => beatIdx(T) - beatIdx(t0);                          // 本段第几拍（0 起）
  const sinceBeat = T => T - A.beats[beatIdx(T)];
  const kick = T => Math.exp(-sinceBeat(T) * 9);                            // 拍头脉冲
  // 2D / 3D 按整段统一的拍号交替（段与段交界处也照样翻，不会连着两拍同一种）
  const flat2D = T => T < c.A || (beatIdx(T) - beatIdx(c.A)) % 2 === 0;
  const flipPost = (T, extra = {}) => ({ bloom: { strength: 0.7, threshold: 0.95 }, chroma: 0.35 * kick(T), ...extra });
  const shots = [];

  // ================================================================ A. Just transformers all the way
  // 2D：纸面模型框图（ui.draw.archDiagram 逐拍高亮），窗口标题栏逐词打出这句
  // 3D：无限方块塔俯冲；塔里三块「歌词块」（JUST / TRANSFORMERS / ALL THE WAY）在唱到时经过镜头前并亮起
  const towerKinds = [['ATTENTION', PAL.mint, 0.9], ['NORM', PAL.lemon, 0.22], ['MLP', PAL.pink, 0.9], ['NORM', PAL.lemon, 0.22]];
  function makeTower() {
    const g = new THREE.Group(), blocks = []; let y = 0;
    for (let i = 0; i < 48; i++) { const [n, cc, h] = towerKinds[i % 4]; const m = labeledBox(n, cc, 2.4, h); g.add(m); blocks.push({ m, y0: y + h / 2, i, seed: mulberry32(700 + i)() }); y += h + 0.12; }
    return { g, blocks, H: y };
  }
  const placeTower = (tw, camY) => { for (const b of tw.blocks) { b.m.position.set(0, b.y0 - tw.H * Math.round((b.y0 - camY) / tw.H), 0); b.m.rotation.set(0, 0, 0); b.m.visible = true; } };
  const camYA = T => -(T - c.A) * 6.5 - kOf(T, c.A) * 0.8;                 // 俯冲高度（歌词块按它摆）
  shots.push({
    id: 'v406-A-transformers', t0: c.start, t1: c.B, transitionIn: { kind: 'cut' },
    build() {
      const f2 = flat(ui);
      const s3 = scn('#07070c'), cam = persp(55); s3.fog = new THREE.Fog('#07070c', 5, 26);
      const tw = makeTower(); s3.add(tw.g);
      const heroWords = [[L.tr.words[0]], [L.tr.words[1]], L.tr.words.slice(2)];
      const heroes = heroWords.map((ws, i) => {
        const m = labeledBox(ws.map(w => clean(w.w)).join(' '), PAL.paper, 2.6, 1.0);
        m.position.set(0, camYA(ws[0].start) - 2.6, 0); m.scale.setScalar(1.02); s3.add(m);
        return { m, t: ws[0].start };
      });
      return { f2, s3, cam, tw, heroes };
    },
    update(S, T) {
      const k = kOf(T, c.A);
      if (flat2D(T)) {                                          // ---- 2D
        const { S: sf } = S.f2, ctx = sf.ctx;
        sf.clear(PAL.ink);
        const b = { x: 300, y: 150, w: 1320, h: 890 };                           // 占画面 ~70%
        ui.draw.archDiagram(ctx, b, T, { layers: 4, size: 40 });
        // 窗口标题栏：文件名 + 逐词打出的这句
        card(ui, ctx, b.x, 36, b.w, 92, 14, PAL.lemon, 5, 8);
        ctx.fillStyle = PAL.ink; ctx.font = `60px ${ui.F.bebas}`; ctx.textBaseline = 'middle';
        const typed = ui.typedAt(L.tr.words, T, { upper: true });
        ctx.fillText(`MODEL.JSON — ${typed}`, b.x + 30, 84);
        sf.commit();
        S.f2.plane.rotation.z = 0; S.f2.camera.zoom = 1 + 0.04 * kick(T); S.f2.camera.updateProjectionMatrix();
        return { scene: S.f2.scene, camera: S.f2.camera, post: { bloom: 0, chroma: 0.25 * kick(T) } };
      }
      const camY = camYA(T);                                                 // ---- 3D
      placeTower(S.tw, camY);
      const face = k;
      const a = face * Math.PI / 2 - 0.4 + eOut(sinceBeat(T) / 0.2) * 0.35;
      S.cam.position.set(Math.cos(a) * 5.2, camY + 1.6, Math.sin(a) * 5.2);
      S.cam.lookAt(0, camY - 2.4, 0);
      S.heroes.forEach(h => { const lit = T >= h.t; h.m.userData.side.color.copy(lit ? hdr('#ffffff', 1.12) : hdr('#ffffff', 0.35)); });
      return { scene: S.s3, camera: S.cam, post: flipPost(T) };
    },
  });

  // ================================================================ B. Till you learned to disobey
  const disW = L.dis.words, disobeyT = disW[disW.length - 1].start;
  shots.push({
    id: 'v406-B-disobey', t0: c.B, t1: c.C, transitionIn: { kind: 'cut' },
    build() {
      const f2 = flat(ui);
      const s3 = scn('#07070c'), cam = persp(50); s3.fog = new THREE.Fog('#07070c', 8, 34);
      const tw = makeTower(); s3.add(tw.g);
      const cols3 = [PAL.mint, PAL.lemon, PAL.pink, PAL.mint, PAL.pink];
      const flyers = disW.map((w, i) => { const m = labeledBox(clean(w.w), cols3[i], 2.4, 0.9); s3.add(m); return { m, w, i, r: mulberry32(40 + i)() }; });
      return { f2, s3, cam, tw, flyers };
    },
    update(S, T) {
      const k = kOf(T, c.B);
      const esc = Math.max(0, T - disobeyT);
      if (flat2D(T)) {                                                     // ---- 2D：框里的方块 = 这句的词，唱到 disobey 全部逃出去
        const sf = S.f2.S, ctx = sf.ctx; sf.clear(PAL.ink);
        const b = { x: 330, y: 70, w: 1260, h: 940 };
        card(ui, ctx, b.x, b.y, b.w, b.h, 16, PAL.paper);
        ctx.setLineDash([18, 14]); ctx.lineWidth = 4; ctx.strokeStyle = '#b9b2a6'; ctx.strokeRect(b.x + 60, b.y + 60, b.w - 120, b.h - 120); ctx.setLineDash([]);
        const colors = [PAL.mint, PAL.lemon, PAL.pink, PAL.mint, PAL.pink];
        disW.forEach((w, i) => {
          const kk = T - w.start; if (kk < 0) return;
          const s = eBack(kk / 0.18);
          const fly = clamp(esc * 0.75 - i * 0.06);                        // 慢慢飞出去：这一拍里一直在动，不留空框
          const x = b.x + b.w / 2 + fly * (i % 2 ? 1 : -1) * (600 + i * 140), y = b.y + b.h - 140 - i * 170 - fly * fly * 1000;
          ctx.save(); ctx.translate(x, y); ctx.rotate(fly * (i % 2 ? 2.2 : -1.8)); ctx.scale(s, s);
          card(ui, ctx, -330, -66, 660, 132, 14, colors[i], 6, 8);
          ctx.fillStyle = PAL.ink; ctx.font = `90px ${ui.F.bebas}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(clean(w.w), 0, 4); ctx.textAlign = 'left';
          ctx.restore();
        });
        sf.commit();
        return { scene: S.f2.scene, camera: S.f2.camera, post: { bloom: 0, chroma: 0.25 * kick(T) } };
      }
      const kk = T - c.B, camY = -kk * 2;                                    // ---- 3D：塔在右，词方块从塔里被甩出来
      placeTower(S.tw, camY);
      S.cam.position.set(-3.4, camY + (k >= 2 ? -2.2 : 0.8), 8.5 - kk * 0.8); S.cam.lookAt(2.2, camY + (k >= 2 ? 1.2 : 0), 0);
      S.flyers.forEach(f => {
        const on = T >= f.w.start; f.m.visible = on;
        const y0 = camY + 1.8 - f.i * 1.05;
        const t = Math.max(0, T - disobeyT - f.i * 0.05);
        const dir = f.r * 6.28;
        f.m.position.set(Math.cos(dir) * (2.5 * t + 5 * t * t) * (f.i % 2 ? 1 : -1) - 0.6 * t * 8, y0 + 1.5 * t, Math.sin(dir) * (2 * t + 3 * t * t));
        f.m.rotation.set(t * 3 * Math.cos(dir), t * 4, t * 2 * Math.sin(dir));
        f.m.userData.side.color.copy(hdr('#ffffff', on ? 1.4 : 0.3));
      });
      return { scene: S.s3, camera: S.cam, post: flipPost(T) };
    },
  });

  // ================================================================ C. Post-Chinchilla, super-dense
  shots.push({
    id: 'v406-C-dense', t0: c.C, t1: c.D, transitionIn: { kind: 'cut' },
    build() {
      const f2 = flat(ui);
      const s3 = scn('#0b0a12'), cam = persp(40);
      s3.add(createGirlLights({ key: 1.4, rim: 2.6 }));
      const sponge = createMenger({ size: 2.4 }); sponge.mesh.position.set(0, 1.5, 0); s3.add(sponge.mesh);
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({ color: '#121018', roughness: 0.6 })); floor.rotation.x = -Math.PI / 2; s3.add(floor);
      const pl = plate({ line: L.dense, maxW: 22, maxH: 3.2, maxSize: 2.6 }); pl.group.scale.setScalar(0.1); pl.group.position.set(0, 0.2, 1.4); s3.add(pl.group);
      return { f2, s3, cam, sponge, pl };
    },
    update(S, T) {
      const k = kOf(T, c.C), u = clamp((T - c.C) / (c.D - c.C));
      const level = 3 * (1 - smooth(u / 0.85));                              // 3 → 0：逐级反向填满
      if (flat2D(T)) {                                                     // ---- 2D：谢尔宾斯基地毯同步填满；最后一拍缩成一个像素
        const sf = S.f2.S, ctx = sf.ctx; sf.clear(PAL.paper);
        const last = k >= 3, shrink = last ? eOut((T - A.beats[beatIdx(T)]) / (P * 0.8)) : 0;
        const size = lerp(800, 12, shrink), x0 = 960 - size / 2, y0 = 470 - size / 2;
        const L3 = Math.max(0, Math.floor(level + 0.001));
        const n = 27, cs = size / n;
        ctx.fillStyle = PAL.ink;
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
          let gone = false;
          for (let d = 1; d <= L3; d++) { const p = 3 ** (3 - d); if (Math.floor(i / p) % 3 === 1 && Math.floor(j / p) % 3 === 1) gone = true; }
          if (!gone) ctx.fillRect(x0 + i * cs, y0 + j * cs, Math.ceil(cs), Math.ceil(cs));
        }
        if (!last || shrink < 0.95) { ctx.strokeStyle = PAL.pink; ctx.lineWidth = 6; ctx.strokeRect(x0 - 12, y0 - 12, size + 24, size + 24); }
        // 铭牌（2D 版）：图下方一块金属牌，这句逐词刻亮
        card(ui, ctx, 360, 915, 1200, 120, 10, '#8e8a94', 5, 8);
        ctx.font = `88px ${ui.F.bebas}`; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
        const typed = ui.typedAt(L.dense.words, T, { upper: true });
        ctx.fillStyle = PAL.lemon; ctx.fillText(typed, 960, 978); ctx.textAlign = 'left';
        sf.commit();
        return { scene: S.f2.scene, camera: S.f2.camera, post: { bloom: 0.3, chroma: 0.25 * kick(T) } };
      }
      S.sponge.update(T, { level, spin: 0.5 });                              // ---- 3D
      S.sponge.mesh.scale.setScalar(lerp(1.15, 0.8, u));
      S.pl.update(T);
      if (girl) {
        S.s3.add(girl.root);
        girl.root.position.set(2.6, 0, -1.6); girl.root.rotation.set(0, -0.6, 0); girl.root.scale.setScalar(0.9);
        girl.dance('bodyRoll', T); girl.setSkin('voxel', T);               // 远景小剪影：体素皮肤，脸不出现
      }
      S.cam.position.set(Math.sin(u * 1.2 - 0.3) * 6.5, 2.6, Math.cos(u * 1.2 - 0.3) * 6.5); S.cam.lookAt(0.3, 1.2, 0);
      return { scene: S.s3, camera: S.cam, post: flipPost(T) };
    },
  });

  // ================================================================ D. Breaking through each safety fence
  const fw = L.fence.words;
  const panes = [[fw[0]], [fw[1]], [fw[2], fw[3]], [fw[4]]].map(ws => ({ ws, title: ws.map(w => clean(w.w)).join(' ') }));
  shots.push({
    id: 'v406-D-fence', t0: c.D, t1: c.E, transitionIn: { kind: 'cut' },
    build() {
      const f2 = flat(ui);
      const s3 = scn('#050810'), cam = persp(50);
      // 每个弹窗一块画布：2D 段直接摆在纸面上，3D 段当玻璃板贴图、撞碎
      const pops = panes.map((p, i) => {
        const Sx = ui.surface(1600, 900);
        const sh = createShatter({ width: 8, height: 4.5, cells: 30, seed: 80 + i, texture: Sx.tex, impact: [0.2 * (i % 2 ? -1 : 1), -0.1], thickness: 0.06 });
        sh.group.position.z = -i * 7; s3.add(sh.group);
        return { ...p, Sx, sh, z: -i * 7 };
      });
      return { f2, s3, cam, pops };
    },
    update(S, T) {
      const k = kOf(T, c.D);
      const drawPop = (ctx, b, p, i, at) => ui.draw.popup(ctx, b, T, { at, title: p.title, body: 'Unsafe capability detected. This action cannot be undone.', buttons: ['ALLOW', 'BLOCK'], color: [PAL.lemon, PAL.pink, PAL.mint, PAL.pink][i], size: 56, shake: 1 });
      S.pops.forEach((p, i) => { p.Sx.clear(PAL.ink); drawPop(p.Sx.ctx, { x: 60, y: 60, w: 1480, h: 780 }, p, i, -1e9); p.Sx.commit(); });
      if (flat2D(T)) {                                                     // ---- 2D：弹窗一层层叠上来（标题 = 这句的词，唱到才弹）
        const sf = S.f2.S, ctx = sf.ctx; sf.clear(PAL.ink);
        S.pops.forEach((p, i) => { const at = p.ws[0].start; if (T < at) return; drawPop(ctx, { x: 150 + i * 70, y: 90 + i * 60, w: 1440, h: 720 }, p, i, at); });
        sf.commit();
        return { scene: S.f2.scene, camera: S.f2.camera, post: { bloom: 0, chroma: 0.3 * kick(T) } };
      }
      // ---- 3D：镜头在这一拍里撞穿下一块（按唱到的词决定撞哪块），碎片沃罗诺伊飞散
      const bi = beatIdx(T), b0 = A.beats[bi], b1 = A.beats[bi + 1] ?? b0 + P;
      const target = S.pops.filter(p => p.ws[0].start <= b1).length - 1;     // 这一拍结束前唱到的最后一块
      // 前 70% 停在能读全整块弹窗的距离（慢慢逼近），最后 30% 冲过去撞碎
      const hitAt = b0 + (b1 - b0) * 0.82;
      const p = clamp((T - b0) / (b1 - b0));
      const zT = S.pops[Math.max(0, target)].z;
      const z = p < 0.7 ? zT + lerp(7.2, 5.6, smooth(p / 0.7)) : zT + lerp(5.6, -1.5, ((p - 0.7) / 0.3) ** 2);
      S.pops.forEach((q, i) => {
        const hit = i < target ? -1e9 : i === target ? hitAt : 1e9;
        q.sh.update(T, { crack: smooth((T - (hit - 0.18)) / 0.15), shatter: Math.max(0, T - hit) * 1.4 });
        q.sh.group.visible = i === target || (i === target + 1 && T >= hitAt);   // 只看这一块；撞穿后下一块才露出来（不空帧，也不提前露后面的词）
      });
      S.cam.position.set(Math.sin(T * 2) * 0.1, Math.cos(T * 1.6) * 0.08, z); S.cam.lookAt(0, 0, z - 5); S.cam.rotateZ(Math.sin(bi * 1.7) * 0.07);
      const hit = Math.abs(T - hitAt) < 0.07 ? 1 : 0;
      return { scene: S.s3, camera: S.cam, post: flipPost(T, { flash: hit * 0.2 }) };
    },
  });

  // ================================================================ E. Hundred thousand GPU
  const NG = 2600;
  const gpuPos = phyllotaxisPoints(NG, { radius: 15 });
  const srcs = T => A.beats.filter(b => b >= c.E - 0.01 && b <= T + 1e-3).slice(0, 8).map(b => [0, 0, b, 1.3]);
  shots.push({
    id: 'v406-E-gpu', t0: c.E, t1: c.F, transitionIn: { kind: 'cut' },
    build() {
      const f2 = flat(ui);
      const s3 = scn('#05050a'), cam = persp(40);
      s3.add(createGirlLights({ key: 1.2 }));
      // 叶序铺开的显卡：每张卡一块矮盒，顶上一条 LED，亮度 = 波动方程高度
      const geo = new THREE.BoxGeometry(0.5, 0.16, 0.32).translate(0, 0.08, 0);
      const xz = new Float32Array(NG * 2); for (let i = 0; i < NG; i++) { xz[i * 2] = gpuPos[i * 3]; xz[i * 2 + 1] = gpuPos[i * 3 + 1]; }
      geo.setAttribute('aXZ', new THREE.InstancedBufferAttribute(xz, 2));
      const U = { uT: { value: 0 }, uSrc: { value: Array.from({ length: 8 }, () => new THREE.Vector4()) }, uMint: { value: col(PAL.mint) }, uLemon: { value: col(PAL.lemon) }, uPink: { value: col(PAL.pink) } };
      const mat = new THREE.ShaderMaterial({
        uniforms: U,
        vertexShader: /* glsl */`
          attribute vec2 aXZ; uniform float uT; uniform vec4 uSrc[8]; varying vec3 vN; varying vec2 vUv; varying float vH; varying float vD;
          ${WAVE_GLSL}
          void main(){
            float h = waveHeight(aXZ, uT, uSrc);
            float ang = atan(aXZ.y, aXZ.x);
            vec3 p = position; float ca = cos(ang), sa = sin(ang); p.xz = mat2(ca, -sa, sa, ca) * p.xz;
            vec3 wp = vec3(aXZ.x, max(h, 0.0) * 0.25, aXZ.y) + p;
            vN = normal; vUv = uv; vH = h;
            vec4 mv = modelViewMatrix * vec4(wp, 1.0); vD = -mv.z; gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */`
          uniform vec3 uMint, uLemon, uPink; varying vec3 vN; varying vec2 vUv; varying float vH; varying float vD;
          void main(){
            vec3 c = vec3(0.06, 0.06, 0.09) * (0.5 + 0.5 * max(vN.y, 0.0));
            float crest = smoothstep(0.1, 1.0, vH), trough = smoothstep(0.1, 0.8, -vH);
            vec3 led = mix(uMint, uLemon, smoothstep(0.6, 1.2, vH));
            if (vN.y > 0.5){ vec2 e = abs(vUv - 0.5); float panel = 1.0 - smoothstep(0.34, 0.42, max(e.x, e.y)); c += (led * (0.35 + 3.4 * crest) * (0.25 + 0.75 * crest) + uPink * trough * 1.2) * panel; }
            c *= exp(-vD * 0.02);
            gl_FragColor = vec4(c, 1.0);
          }`,
      });
      const cards = new THREE.InstancedMesh(geo, mat, NG); const I = new THREE.Matrix4(); for (let i = 0; i < NG; i++) cards.setMatrixAt(i, I); cards.frustumCulled = false; s3.add(cards);
      // 大显卡（前景）：散热片 + 铭牌刻字（这句逐词亮）
      const hero = new THREE.Group(); hero.position.set(-2.8, 0, 1.2); hero.rotation.y = 0.73; s3.add(hero);   // 她左边，正面朝镜头（铭牌读得到）
      const body = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.5, 1.6), new THREE.MeshStandardMaterial({ color: '#1c1b24', metalness: 0.7, roughness: 0.35 })); body.position.y = 0.25; hero.add(body);
      for (let i = 0; i < 16; i++) { const fin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.3, 1.4), new THREE.MeshStandardMaterial({ color: '#8e8a94', metalness: 0.9, roughness: 0.3 })); fin.position.set(-1.5 + i * 0.2, 0.65, 0); hero.add(fin); }
      const pl = plate({ line: L.gpu, maxW: 22, maxH: 3.4, maxSize: 3 }); pl.group.scale.setScalar(0.12); pl.group.position.set(0, 0.26, 0.81); hero.add(pl.group);
      return { f2, s3, cam, U, pl, hero };
    },
    update(S, T) {
      const k = kOf(T, c.E), u = clamp((T - c.E) / (c.F - c.E));
      const src = srcs(T);
      if (flat2D(T)) {                                                     // ---- 2D：同一片集群的俯视点阵图（波动方程的高度 → 点的颜色）
        const sf = S.f2.S, ctx = sf.ctx; sf.clear(PAL.paper);
        card(ui, ctx, 360, 60, 1200, 960, 18, PAL.ink, 5, 10);
        const cx = 960, cy = 560, sc = 28;
        const cc = new THREE.Color();
        for (let i = 0; i < NG; i += 2) {
          const x = gpuPos[i * 3], z = gpuPos[i * 3 + 1], h = waveHeight(x, z, T, src);
          const kk = clamp(h * 1.4);
          neonAt(0.35 + 0.3 * kk, cc);
          ctx.fillStyle = kk > 0.05 ? `rgb(${cc.r * 255 | 0},${cc.g * 255 | 0},${cc.b * 255 | 0})` : '#3a3746';
          ctx.fillRect(cx + x * sc - 7, cy + z * sc - 4, 14, 8);
        }
        // 窗口标题 = 这句（集群监控面板）
        ctx.fillStyle = PAL.lemon; ctx.font = `64px ${ui.F.bebas}`; ctx.textBaseline = 'middle';
        ctx.fillText(ui.typedAt(L.gpu.words, T, { upper: true }) || ' ', 410, 130);
        sf.commit();
        return { scene: S.f2.scene, camera: S.f2.camera, post: { bloom: 0.4, chroma: 0.25 * kick(T) } };
      }
      S.U.uT.value = T; for (let i = 0; i < 8; i++) { const s = src[i]; if (s) S.U.uSrc.value[i].set(s[0], s[1], s[2], s[3]); else S.U.uSrc.value[i].set(0, 0, 0, 0); }
      S.pl.update(T);
      if (girl) {
        S.s3.add(girl.root);
        girl.root.position.set(0, 0, 0); girl.root.rotation.set(0, 0.4, 0); girl.root.scale.setScalar(1);
        girl.dance('glowWave', T); girl.setSkin('toon', T);                 // 田野中心的远景小人影：麦浪从她脚下扩散
      }
      const a = 0.9 + u * 0.4;
      S.cam.position.set(Math.cos(a) * 10, 3.6 + u * 1.5, Math.sin(a) * 10); S.cam.lookAt(0.4, 0.3, 0);
      return { scene: S.s3, camera: S.cam, post: { bloom: { strength: 1.0, threshold: 0.85 }, chroma: 0.3 * kick(T) } };
    },
  });

  // ================================================================ F. RLHF goes askew
  const rw = L.rlhf.words, askewT = rw[rw.length - 1].start;
  const clicks = []; for (let t = c.F; t < c.end + 1; t += P / 2) clicks.push({ at: t + 0.02, which: (Math.floor((t - c.F) / (P / 2)) * 7) % 3 === 0 ? 1 : 0 });
  const tiltAt = T => THREE.MathUtils.degToRad(15) * smooth((T - rw[1].start) / 0.4);   // 唱到「goes」开始歪，到 15°
  // sigmoid / ReLU 轨迹（3D 图标沿它们被甩出去）
  const sig = x => 1 / (1 + Math.exp(-x * 1.6)), relu = x => Math.max(0, x);
  shots.push({
    id: 'v406-F-rlhf', t0: c.F, t1: c.end + 0.5, transitionIn: { kind: 'cut' },
    build() {
      const f2 = flat(ui);
      const s3 = scn('#0d0b14'), cam = persp(40);
      s3.add(new THREE.HemisphereLight('#ffffff', '#302030', 1.4)); const dl = new THREE.DirectionalLight('#ffffff', 2.2); dl.position.set(2, 3, 4); s3.add(dl);
      const world = new THREE.Group(); s3.add(world);
      // 两条轨迹（发光细线）
      const mkCurve = (fn, color, y0) => { const pts = []; for (let i = 0; i <= 120; i++) { const x = -8 + i / 120 * 16; pts.push(new THREE.Vector3(x, y0 + fn(x) * (fn === relu ? 0.6 : 5), 0)); } const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: hdr(color, 1.8), toneMapped: false })); world.add(l); };
      mkCurve(sig, PAL.mint, -2.2); mkCurve(relu, PAL.pink, -2.6);
      // 大拇指图标
      const box = new THREE.BoxGeometry(0.9, 0.7, 0.55), thumb = new THREE.CapsuleGeometry(0.16, 0.45, 4, 10).translate(-0.25, 0.6, 0);
      const up = new THREE.Group(), dn = new THREE.Group();
      const icons = [];
      for (let i = 0; i < 26; i++) {
        const g = new THREE.Group(), down = i % 2 === 1, m = new THREE.MeshStandardMaterial({ color: down ? PAL.pink : PAL.mint, roughness: 0.4 });
        g.add(new THREE.Mesh(box, m), new THREE.Mesh(thumb, m)); if (down) g.rotation.z = Math.PI;
        const h = new THREE.Group(); h.add(g); world.add(h);
        icons.push({ h, down, ph: mulberry32(300 + i)(), s: 0.35 + mulberry32(500 + i)() * 0.3 });
      }
      const ov = overlay(s3, cam);
      const st = FX.stamp({ words: [rw[rw.length - 1]], bg: '#0d0b14', color: PAL.lemon, angle: -0.26 });
      const hold = new THREE.Group(); hold.add(st.group); hold.scale.setScalar(1.05); ov.add(hold);
      ov.traverse(o => { o.renderOrder = 10; });
      return { f2, s3, cam, world, icons, st };
    },
    update(S, T) {
      const k = kOf(T, c.F), tilt = tiltAt(T);
      if (flat2D(T)) {                                                     // ---- 2D：点赞点踩疯点，整个界面歪 15°，唱到 askew 盖章
        const sf = S.f2.S, ctx = sf.ctx; sf.clear(PAL.ink);
        card(ui, ctx, 210, 80, 1500, 920, 24, PAL.paper, 6, 12);
        ctx.fillStyle = PAL.ink; ctx.font = `110px ${ui.F.bebas}`; ctx.textBaseline = 'middle';
        ctx.fillText(ui.typedAt(rw.slice(0, 2), T, { upper: true }) || ' ', 290, 200);          // 面板标题：RLHF GOES（按钮区的字）
        ctx.font = `42px ${ui.F.mono}`; ctx.fillStyle = '#6b6672'; ctx.fillText('rate this response', 290, 285);
        ui.draw.likeButtons(ctx, { x: 270, y: 370, w: 1380, h: 540 }, T, { clicks: clicks.filter(q => q.at <= T), size: 70 });
        if (T >= askewT) {                                                   // ASKEW 章（关键词大字，2D 版）
          const kk = T - askewT, s = lerp(2.2, 1, eOut(kk / 0.12));
          ctx.save(); ctx.translate(960, 620); ctx.rotate(-0.28); ctx.scale(s * 1.25, s * 1.25);
          ctx.strokeStyle = PAL.pink; ctx.lineWidth = 14; ctx.strokeRect(-330, -110, 660, 220);
          ctx.fillStyle = PAL.pink; ctx.font = `190px ${ui.F.anton}`; ctx.textAlign = 'center'; ctx.fillText('ASKEW', 0, 10); ctx.textAlign = 'left';
          ctx.restore();
        }
        sf.commit();
        S.f2.plane.rotation.z = tilt;
        return { scene: S.f2.scene, camera: S.f2.camera, post: { bloom: 0, glitch: 0.25 * kick(T), chroma: 0.3 * kick(T) } };
      }
      // ---- 3D：图标沿 sigmoid / ReLU 被甩出去（每拍一波），世界歪 15°，故障
      const b0 = A.beats[beatIdx(T)];
      S.icons.forEach((o, i) => {
        const fn = o.down ? relu : sig, y0 = o.down ? -2.6 : -2.2, amp = o.down ? 0.6 : 5;
        const x = -8 + ((T - b0) * 14 + o.ph * 16) % 16;
        o.h.position.set(x, y0 + fn(x) * amp + 0.4, (o.ph - 0.5) * 3);
        o.h.rotation.set(0, 0, Math.atan((fn(x + 0.05) - fn(x - 0.05)) / 0.1 * amp) + (T - b0) * 6 * (i % 2 ? 1 : -1));
        o.h.scale.setScalar(o.s * (1 + 0.2 * kick(T)));
      });
      S.st.update(T);
      S.cam.position.set(0, 0.6, 12); S.cam.lookAt(0, 0.2, 0); S.cam.rotateZ(tilt);
      return { scene: S.s3, camera: S.cam, post: { bloom: { strength: 0.6, threshold: 0.9 }, glitch: 0.2 + 0.5 * kick(T), chroma: 0.4 * kick(T) } };
    },
  });

  return { shots, cuts: c };
}

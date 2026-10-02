// shots/br-v4.js — 桥段 v4（歌曲时间 109.32–123.87 s）。#1056
// 分镜：fresh/v4-rest/br/plan.md（第二版关键帧用户 10-02 通过）。
//
//   const shots = await makeBRV4(mv);   // br-v4-half.html / br-v4.html 挂；mv.mount(shots, { offset: BR.t0, duration: BR.end - BR.t0 })
//
// 单位 = 她的身高 1（和 shots/c3-v4.js 一致），入口直接用 c3 导出的 C3_EXIT（机位 / 坐标轴 / 回形针 / 她坐的位置）。
//   ① 109.32 接副歌 3 不切镜：冷蓝雨夜、正交性坐标轴；三声「just」竖轴一节节变成粉 / 薄荷方块，雨停在半空 →
//      110.18 方块塔往上猛长、镜头一路仰到望不到顶 → 112.5「all the way」甩下来：塔根扎在脚下很远的夜城里
//   ② 113.34 竖轴上那枚回形针翻成柠黄同心圆眼（全片同一只眼：v4-01 / 副歌 1 的 makeEye），塔扭动、方块翻飞出队，
//      114.24「disobey」把她坐的 GOALS 横轴拧断，她起跳扑向一块飞出来的方块
//   ③ 115.20 她站在那块往下沉的方块上：全城的亮窗变成光点河，灌进半空一个极亮的小方块（super-dense），楼一栋栋黑掉，塔也塌进去
//   ④ 117.02 落到街上就跑：超稠密方块在身后追，她跑过之后一道道安全护栏从地里升起来拦它，一拍撞碎一道（每道一块牌）
//   ⑤ 118.755 方块从她头顶越过、砸进前面的路面：路面塌开，下面是一望无际的显卡阵列，LED 波从坑里扩散、拼出 100 000 GPU；她跟着掉进坑底
//   ⑥ 120.76 落地那一下定格成漫画第 1 格（kits/comic.js）：拍点赞键（RLHF）→ 那只眼把拇指拧歪 → 121.88 整页歪 15° 盖 ASKEW →
//      推进末格：她惊恐地朝左上看，格子左上角是黑屏的 P(DOOM) 指针表（副歌 1 同款）。123.87 副歌 4 视线切到那块表（她在坑边）
// 2D 的她只在 ⑥（closeup/bridge-comic/，/edit 喂设定图生成），3D 和 2D 不同屏。所有 update 都是歌曲时间 T 的纯函数。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { createGirl, createGirlLights, loadAnims, getAnim } from '../kits/girl.js';
import { mulberry32, createPaperclips } from '../kits/world.js';
import { textTexture } from '../kits/world4.js';
import { createComic, C as CC, CF } from '../kits/comic.js';
import { initType3D } from '../kits/type3d.js';
import { blendSolved } from '../../../assets/lib/dance3d.js';
import { C3_EXIT } from './c3-v4.js';

export const ANIMS = ['act__sit-swing-legs', 'move__run-jump', 'act__look-distance', 'move__sprint-full__inplace', 'move__fall-air', 'move__fall-hard-land'];

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIn = p => clamp(p) ** 3;
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
export const BR = {
  t0: 109.32, end: 123.87,
  just: [109.33, 109.70, 110.0],          // 三声 just：竖轴一节节变方块
  sing: 110.18, all: 112.524, disobey: 113.34, snap: 114.24, dense: 115.2, chase: 117.02, gpu: 118.755, slam: 119.05, fallLand: 119.86, rlhf: 120.76, goes: 121.58, askew: 121.88, face: 122.9,
};
const AX = C3_EXIT.axis, SLAB = 0.65, CITY_Y = -120;

// ================================================================ 共用小件：同一只眼（v4-01 / 副歌 1 的 makeEye）、霓虹招牌、P(DOOM) 指针表的画法
function makeEye(R = 0.72) {
  const g = new THREE.Group(), add = (geo, mat, z) => { const m = new THREE.Mesh(geo, mat); m.position.z = z; g.add(m); return m; };
  add(new THREE.RingGeometry(R, R * 1.24, 64), new THREE.MeshBasicMaterial({ color: '#4a4a5a' }), 0.012);
  add(new THREE.CircleGeometry(R, 64), new THREE.MeshBasicMaterial({ color: '#0b0a06' }), 0.013);
  const lit = new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 1.6) });
  add(new THREE.CircleGeometry(R * 0.26, 40), lit, 0.016);
  for (const k of [0.46, 0.66, 0.86]) add(new THREE.RingGeometry(R * k - R * 0.03, R * k + R * 0.03, 64), lit, 0.016);
  return { g, lit };
}
function makeSign(text, color, th) {
  const c = document.createElement('canvas'), g0 = c.getContext('2d'); g0.font = `170px ${FONT}`;
  c.width = Math.ceil(g0.measureText(text).width) + 110; c.height = 270; const g = c.getContext('2d');
  g.fillStyle = '#0d0c14'; g.fillRect(0, 0, c.width, c.height); g.strokeStyle = color; g.lineWidth = 16; g.strokeRect(8, 8, c.width - 16, c.height - 16);
  g.fillStyle = '#F2EDE4'; g.font = `170px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, c.width / 2, 143);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const bh = th * 270 / 160, bw = bh * c.width / c.height, mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, fog: false });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(bw, bh), mat), g2 = new THREE.Group(); g2.add(m);
  const s = { text, g: g2, m, mat, bw, bh, th, at: Infinity, until: Infinity,
    set(T) { const a = T - s.at; s.g.visible = a >= 0 && T < s.until; mat.color.setScalar(1.15 + 1.6 * Math.exp(-Math.max(0, a) / 0.3)); m.scale.setScalar(lerp(0.9, 1, eOut(a / 0.1))); } };
  return s;
}
const ANG = v => (225 - 270 * v) * D2R;
function paintGauge(g, v, { dark = false } = {}) {          // 副歌 1 那块表的画法（同一个道具）；dark = 黑屏（只剩轮廓）
  const red = clamp((v - 0.62) / 0.3), c = 512, R = 450; g.clearRect(0, 0, 1024, 1024);
  g.fillStyle = '#0d0c14'; g.beginPath(); g.arc(c, c, R + 30, 0, 7); g.fill();
  g.lineWidth = 22; g.strokeStyle = dark ? '#3a3a4a' : PAL.lemon; g.beginPath(); g.arc(c, c, R + 20, 0, 7); g.stroke();
  const arc = (v0, v1, r, w, color) => { g.lineWidth = w; g.strokeStyle = color; g.beginPath(); g.arc(c, c, r, -ANG(v0), -ANG(v1)); g.stroke(); };
  arc(0, 0.62, R - 40, 26, dark ? '#202028' : '#3a3a52'); arc(0.62, 1, R - 40, 52, dark ? '#2a1820' : '#ff2e4a');
  for (let k = 0; k <= 20; k++) { const a = ANG(k / 20), big = k % 5 === 0, r0 = R - (big ? 110 : 80), r1 = R - 60;
    g.lineWidth = big ? 10 : 5; g.strokeStyle = dark ? '#4a4a58' : '#F2EDE4'; g.beginPath(); g.moveTo(c + Math.cos(a) * r0, c - Math.sin(a) * r0); g.lineTo(c + Math.cos(a) * r1, c - Math.sin(a) * r1); g.stroke(); }
  g.fillStyle = dark ? '#3a3a48' : PAL.lemon; g.font = `150px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('P(DOOM)', c, c + 175);
  if (!dark) { g.fillStyle = red > 0.5 ? '#ff4a5e' : '#F2EDE4'; g.font = `120px ${FONT}`; g.fillText(v.toFixed(2), c, c + 315); }
  const a = ANG(clamp(v, 0, 1.03)); g.lineCap = 'round';
  g.lineWidth = 16; g.strokeStyle = dark ? '#55555f' : '#ffffff'; g.beginPath(); g.moveTo(c - Math.cos(a) * 60, c + Math.sin(a) * 60); g.lineTo(c + Math.cos(a) * (R - 70), c - Math.sin(a) * (R - 70)); g.stroke();
  g.fillStyle = dark ? '#3a2028' : '#ff2e4a'; g.beginPath(); g.arc(c, c, 38, 0, 7); g.fill();
}

// 超稠密方块：极亮的柠黄 / 白光核 + 半透明壳 + 内部翻涌的光点（吸进去的全城灯光）+ 光晕；faces = 四个侧面刻 SUPER-DENSE（近景用）
function makeDenseCube(size = 2, { faces = false } = {}) {
  const g = new THREE.Group(), h = size / 2;
  const glowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'), r = x.createRadialGradient(128, 128, 0, 128, 128, 128); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.35, 'rgba(255,240,170,0.55)'); r.addColorStop(1, 'rgba(255,230,120,0)'); x.fillStyle = r; x.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c); })();
  const core = new THREE.Mesh(new THREE.SphereGeometry(size * 0.3, 24, 16), new THREE.MeshBasicMaterial({ color: hdr('#fff6cc', 2.6) })); g.add(core);
  const shell = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 0.9), transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); g.add(shell);
  g.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(size * 1.01, size * 1.01, size * 1.01)), new THREE.LineBasicMaterial({ color: hdr(PAL.lemon, 2.8) })));
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: hdr('#ffe9a0', 1.6), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); halo.scale.setScalar(size * 2.6); g.add(halo);
  const N = 520, rnd = mulberry32(88), base = [], pos = new Float32Array(N * 3), colr = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { base.push([rnd() * 6.28, (rnd() - 0.5) * 2, 0.25 + rnd() * 0.7, 0.6 + rnd() * 1.6]); const c = hdr([PAL.lemon, '#ffe9b8', PAL.pink, PAL.mint][i % 4], 2.4); colr.set([c.r, c.g, c.b], i * 3); }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); pg.setAttribute('color', new THREE.BufferAttribute(colr, 3));
  const pts = new THREE.Points(pg, new THREE.PointsMaterial({ size: Math.max(2, size * 1.5), sizeAttenuation: false, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); pts.frustumCulled = false; g.add(pts);
  const signs = faces ? [0, 1, 2, 3].map(k => { const sg = makeSign('SUPER-DENSE', PAL.lemon, size * 0.17); sg.at = -1e9; const a = k * Math.PI / 2; sg.g.position.set(Math.sin(a) * (h + 0.02), -h * 0.62, Math.cos(a) * (h + 0.02)); sg.g.rotation.y = a; g.add(sg.g); return sg; }) : [];
  return { g, update(T) {
    for (let i = 0; i < N; i++) { const [a0, y0, r0, w] = base[i], a = a0 + T * w * 2.2, r = r0 * h * (0.85 + 0.15 * Math.sin(T * 5 + i)); pos.set([Math.cos(a) * r, (y0 + 0.25 * Math.sin(T * 3 * w + a0)) * h * 0.85, Math.sin(a) * r], i * 3); }
    pg.attributes.position.needsUpdate = true;
    core.scale.setScalar(1 + 0.12 * Math.sin(T * 13)); halo.material.opacity = 0.4 + 0.1 * Math.sin(T * 9);
    for (const sg of signs) sg.set(T);
  } };
}

export async function makeBRV4(mv) {
  const { music, lyrics } = mv;
  const W = mv.width, Hh = mv.height;
  await Promise.all([loadAnims(ANIMS), initType3D(),
    new FontFace('UIAnton', `url(${new URL('../../../assets/fonts/anton/Anton-Regular.ttf', import.meta.url)})`).load().then(f => document.fonts.add(f))]);
  const girl = await createGirl(mv);
  const kick = (T, d = 0.12) => music.pulse('kick', T, { decay: d });
  const line = p => lyrics.lines.find(l => l.start > 109 && l.text.replace(/[“”"]/g, '').toLowerCase().startsWith(p.toLowerCase()));
  const L = { just: line('Just'), till: line('Till'), post: line('Post'), brk: line('Breaking'), hund: line('Hundred'), rlhf: line('RLHF') };
  const wt = (ln, i) => ln.words[i].start;
  const signs = [];
  const sign = (text, color, th, at, until) => { const s = makeSign(text, color, th); s.at = at; s.until = until; signs.push(s); return s; };
  const winTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), rnd = mulberry32(5);
    g.fillStyle = '#0e0e1a'; g.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 12; y++) for (let x = 0; x < 8; x++) if (rnd() < 0.6) { const h = rnd(); g.fillStyle = h < 0.7 ? '#ffe9b8' : h < 0.85 ? PAL.lemon : h < 0.93 ? PAL.pink : PAL.mint; g.fillRect(x * 32 + 8, y * 21 + 5, 16, 11); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; })();

  // ================================================================ 场景 S：坐标轴 + 方块塔 + 脚下的夜城
  const S = new THREE.Scene(); S.background = col('#04050c');
  const hemi = new THREE.HemisphereLight('#7a88ff', '#1a1430', 0.6); S.add(hemi);
  const gl = createGirlLights({ key: 1.8, rim: 2.4, fill: 0.8 }); S.add(gl);
  // 坐标轴（C3_EXIT 的规格）
  const axisMat = new THREE.MeshBasicMaterial({ color: hdr(AX.color, AX.hdr) });
  const vLow = new THREE.Mesh(new THREE.CylinderGeometry(AX.radius, AX.radius, AX.horizY, 12), axisMat); vLow.position.y = AX.horizY / 2; S.add(vLow);
  const vHigh = new THREE.Mesh(new THREE.CylinderGeometry(AX.radius, AX.radius, 1, 12), axisMat); S.add(vHigh);                // 横臂以上那截：一声 just 变一块方块
  const vTip = new THREE.Mesh(new THREE.ConeGeometry(AX.radius * 3, 0.15, 12), axisMat); S.add(vTip);
  const arm = new THREE.Group(); arm.position.set(0, AX.horizY, 0); S.add(arm);                                                  // 横臂（GOALS）：114.24 被拧断
  const armL = AX.horizX[1] - AX.horizX[0];
  const armA = new THREE.Mesh(new THREE.CylinderGeometry(AX.radius, AX.radius, 2.1 - AX.horizX[0], 12), axisMat); armA.rotation.z = Math.PI / 2; armA.position.x = (AX.horizX[0] + 2.1) / 2; arm.add(armA);
  const armB = new THREE.Group(); armB.position.x = 2.1; arm.add(armB);                                                         // 断开的那截（她坐的位置在 1.35，断口在 2.1 外侧）
  { const m = new THREE.Mesh(new THREE.CylinderGeometry(AX.radius, AX.radius, AX.horizX[1] - 2.1, 12), axisMat); m.rotation.z = Math.PI / 2; m.position.x = (AX.horizX[1] - 2.1) / 2; armB.add(m);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(AX.radius * 3, 0.15, 12), axisMat); tip.rotation.z = -Math.PI / 2; tip.position.x = AX.horizX[1] - 2.1; armB.add(tip); }
  const label = (text, h, pos) => { const { texture, aspect } = textTexture(text, { font: FONT, px: 120 }); const m = new THREE.Mesh(new THREE.PlaneGeometry(h * aspect, h), new THREE.MeshBasicMaterial({ map: texture, transparent: true, color: hdr(AX.color, 1.6), depthWrite: false })); m.position.set(...pos); S.add(m); return m; };
  const labY = label(C3_EXIT.labels.y.text, C3_EXIT.labels.y.height, C3_EXIT.labels.y.pos), labX = label(C3_EXIT.labels.x.text, C3_EXIT.labels.x.height, C3_EXIT.labels.x.pos); labY.rotation.z = Math.PI / 2;   // 同 c3：竖着贴在竖轴旁
  // 回形针（竖轴上那枚）：113.34 翻成眼
  const clip = createPaperclips({ count: 1, seed: 1, clipSize: 0.2 }).mesh; clip.setColorAt(0, hdr(PAL.lemon, 1.25)); clip.instanceColor.needsUpdate = true;   // 和 c3 同一枚（同参数、同转法）
  clip.material = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }); S.add(clip);
  const eye = makeEye(0.62); S.add(eye.g);
  // 冻住的雨
  const rain = (() => { const rnd = mulberry32(61), n = C3_EXIT.rain.count, [ax, ay, az] = C3_EXIT.rain.area, p = new Float32Array(n * 6);
    for (let i = 0; i < n; i++) { const x = (rnd() - 0.5) * ax, y = rnd() * ay - 1, z = (rnd() - 0.5) * az, l = 0.18 + rnd() * 0.2; p.set([x, y, z, x, y - l, z], i * 6); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const m = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: col(C3_EXIT.rain.color), transparent: true, opacity: 0.55 })); S.add(m); return m; })();
  // 方块塔：竖轴的位置往上 / 往下各一串。上面越往上越粗，下面一直扎到夜城
  const NUP = 380, NDN = Math.ceil((AX.horizY - CITY_Y) / SLAB);
  const slabMat = new THREE.MeshLambertMaterial({ color: '#ffffff', emissive: col('#1a1020') });
  const slabs = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), slabMat, NUP + NDN); slabs.frustumCulled = false; S.add(slabs);
  const slabInfo = [];
  { const c = new THREE.Color();
    for (let i = 0; i < NUP; i++) { slabInfo.push({ up: true, i, y: AX.horizY + (i + 0.5) * SLAB, w: 1.25 + 0.08 * i }); slabs.setColorAt(i, c.set(i % 2 ? PAL.mint : PAL.pink).multiplyScalar(0.9)); }
    for (let j = 0; j < NDN; j++) { slabInfo.push({ up: false, i: j, y: AX.horizY - (j + 0.5) * SLAB, w: 1.25 + 0.08 * j }); slabs.setColorAt(NUP + j, c.set(j % 2 ? PAL.pink : PAL.mint).multiplyScalar(0.9)); } }
  const rndSlab = mulberry32(77), eject = slabInfo.map(s => ({ fly: s.up && s.i >= 1 && s.i < 40 && rndSlab() < 0.3, v: V3((rndSlab() - 0.3) * 4, (rndSlab() - 0.5) * 2, 1 + rndSlab() * 3), spin: rndSlab() * 6, at: BR.disobey + 0.2 + rndSlab() * 0.8 }));
  const upCount = T => T < BR.just[0] ? 0 : T < BR.sing ? BR.just.filter(t => T >= t).length : 3 + Math.floor((NUP - 3) * (Math.exp(3.2 * clamp((T - BR.sing) / 1.6)) - 1) / (Math.exp(3.2) - 1));
  const dnCount = T => T < BR.sing ? 0 : Math.floor(NDN * smooth((T - BR.sing - 0.4) / 1.6));
  const twistA = T => 0.9 * smooth((T - BR.disobey) / 0.9);
  const denseU = T => smooth((T - BR.dense - 0.2) / 1.4);                         // 塔塌进超稠密方块
  // 跳到的那块方块（从塔里飞出来、停在半空）——③ 她站在上面往下沉
  const PERCH0 = V3(3.6, 0.6, 1.6);
  const perchY = T => T < BR.dense ? 0 : -6 * (T - BR.dense) - 1.2 * (T - BR.dense) ** 2;
  const perch = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.28, 1.1), new THREE.MeshLambertMaterial({ color: hdr(PAL.mint, 0.9), emissive: col('#103a30') })); S.add(perch);
  const CUBE = V3(-1.0, -9.5, -14);                                                // 超稠密方块（③ 她看着它）
  const dcS = makeDenseCube(2.0), cube = dcS.g; S.add(cube);
  // 夜城（脚下很远）：亮窗楼块，③ 窗里的光被抽走
  const city = (() => { const rnd = mulberry32(19), n = 520, geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshBasicMaterial({ map: winTex, color: hdr('#ffffff', 1.1) });
    const m = new THREE.InstancedMesh(geo, mat, n), d = [], mm = new THREE.Matrix4();
    for (let i = 0; i < n; i++) { let x, z; do { x = (rnd() - 0.5) * 420; z = (rnd() - 0.5) * 420 - 60; } while (Math.hypot(x, z) < 14); const w = 6 + rnd() * 10, h = 12 + rnd() ** 2 * 60;
      mm.compose(V3(x, CITY_Y + h / 2, z), new THREE.Quaternion(), V3(w, h, w)); m.setMatrixAt(i, mm); d.push({ x, z, h, w }); }
    S.add(m);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshBasicMaterial({ color: '#0a0a14' })); ground.rotation.x = -Math.PI / 2; ground.position.y = CITY_Y; S.add(ground);
    const grid = new THREE.GridHelper(900, 90, col(PAL.mint).multiplyScalar(0.35), col(PAL.pink).multiplyScalar(0.18)); grid.position.y = CITY_Y + 0.05; S.add(grid);
    return { m, mat, d }; })();
  const moon = new THREE.Mesh(new THREE.CircleGeometry(30, 64), new THREE.MeshBasicMaterial({ color: col(PAL.pink).multiplyScalar(1.25) })); moon.position.set(-120, 10, -320); moon.lookAt(0, 0, 0); S.add(moon);
  // 光河：每颗光点从一栋楼的窗出发，沿弧线飞进超稠密方块
  const NP = 2400, river = (() => { const rnd = mulberry32(23), d = [];
    for (let i = 0; i < NP; i++) { const b = city.d[Math.floor(rnd() * city.d.length)], a = rnd() * Math.PI * 2;
      d.push({ p0: V3(b.x + Math.cos(a) * b.w / 2, CITY_Y + rnd() * b.h, b.z + Math.sin(a) * b.w / 2), t: BR.dense + 0.05 + rnd() * 1.1, dur: 0.6 + rnd() * 0.5, side: (rnd() - 0.5) * 40, c: [PAL.lemon, '#ffe9b8', PAL.pink, PAL.mint][Math.floor(rnd() * 4)] }); }
    const pos = new Float32Array(NP * 3), colr = new Float32Array(NP * 3), g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(colr, 3));
    d.forEach((q, i) => { const c = hdr(q.c, 2.0); colr.set([c.r, c.g, c.b], i * 3); });
    const m = new THREE.Points(g, new THREE.PointsMaterial({ size: 3, sizeAttenuation: false, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); m.frustumCulled = false; S.add(m);
    return { m, d, pos, g }; })();
  function placeRiver(T) {
    river.m.visible = T >= BR.dense && T < BR.chase;
    if (!river.m.visible) return;
    const c = CUBE, q2 = V3();
    river.d.forEach((q, i) => { const u = clamp((T - q.t) / q.dur); let p;
      if (u <= 0) p = q.p0; else if (u >= 1) p = c; else { const mid = q.p0.clone().lerp(c, 0.5); mid.y += 25; mid.x += q.side; const a = q.p0.clone().lerp(mid, u), b = mid.lerp(c, u); p = a.lerp(b, u); }
      river.pos.set([p.x, p.y, p.z], i * 3); });
    river.g.attributes.position.needsUpdate = true;
  }
  // 歌词招牌（S 场景里的）
  const sJust = sign('JUST', PAL.pink, 0.36, wt(L.just, 0), wt(L.just, 2)), sTrans = sign('TRANSFORMERS', PAL.mint, 0.6, wt(L.just, 1), wt(L.just, 2));
  const sAll = sign('ALL THE WAY!', PAL.lemon, 0.5, wt(L.just, 2), L.just.end + 0.05);
  [sJust, sTrans, sAll].forEach(s => S.add(s.g));
  const sTill = ['TILL', 'YOU', 'LEARNED', 'TO'].map((w, i) => { const s = sign(w, [PAL.mint, PAL.mint, PAL.pink, PAL.mint][i], 0.34, wt(L.till, i), L.till.end); S.add(s.g); return s; });
  const sDis = sign('DISOBEY', PAL.pink, 0.42, wt(L.till, 4), L.till.end + 0.4); S.add(sDis.g);
  const sPost = (() => {                                                           // POST-CHINCHILLA：楼顶霓虹广告牌，灯被抽走时一个字一个字熄
    const text = 'POST-CHINCHILLA', c = document.createElement('canvas'); c.width = 2200; c.height = 300; const g = c.getContext('2d');
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(22, 3), new THREE.MeshBasicMaterial({ map: tex, transparent: true })); m.position.set(-12, -6, -34); m.lookAt(4, -4, 6); S.add(m);
    let key = '';
    return { m, at: wt(L.post, 0), until: L.post.end + 0.05, th: 3 * 0.62, draw(T) {
      m.visible = T >= this.at && T < this.until; if (!m.visible) return;
      const off = Math.floor(clamp((T - 116.2) / 0.75) * text.length), k = off + ':' + (T - this.at < 0.3 ? 1 : 0); if (k === key) return; key = k;
      g.clearRect(0, 0, 2200, 300); g.fillStyle = 'rgba(13,12,20,0.9)'; g.fillRect(0, 0, 2200, 300); g.strokeStyle = PAL.pink; g.lineWidth = 18; g.strokeRect(9, 9, 2182, 282);
      g.font = `200px ${FONT}`; g.textBaseline = 'middle'; let x = 90;
      for (let i = 0; i < text.length; i++) { const ch = text[i], w = g.measureText(ch).width; g.fillStyle = i >= text.length - off ? '#2a2630' : '#F2EDE4'; g.shadowColor = PAL.pink; g.shadowBlur = i >= text.length - off ? 0 : 30; g.fillText(ch, x, 160); x += w + 6; }
      tex.needsUpdate = true; } };
  })();
  const sDense = sign('SUPER-DENSE', PAL.lemon, 1.2, wt(L.post, 1), L.post.end + 0.05); S.add(sDense.g);

  // ================================================================ 她（S 场景）
  const SIT = [{ t: 105.66, anim: 'act__sit-swing-legs' }];          // 和 c3 同一条编排，切过来腿的相位不跳
  const I = girl.dancer.S.info;
  const solveKeys = (anim, keys, T) => { const m = getAnim(anim); return m.solve(pchip(keys, T) / m.srcPeriod, girl.dancer); };
  const JUMP = [[BR.snap - 0.06, 0.42], [BR.snap + 0.3, 0.72], [BR.snap + 0.7, 1.0], [BR.dense, 1.15]];
  function placeGirlS(T) {
    S.add(girl.root); girl.root.visible = true; girl.root.scale.setScalar(1); girl.root.rotation.set(0, C3_EXIT.girl.yaw, 0);
    const seat = V3(...C3_EXIT.girl.pos);
    if (T < BR.snap - 0.1) {                                       // 坐在横臂上晃腿，越来越仰头看塔
      girl.root.position.copy(seat); girl.root.updateMatrixWorld(true); girl.play(SIT, T);
      const up = T < BR.disobey ? smooth((T - BR.t0) / 1.2) : 0.6;
      I.Head.bone.rotateX(-0.36 - 0.25 * up); girl.root.updateMatrixWorld(true);
    } else if (T < BR.dense) {                                     // 横臂断了：起跳，抛物线落到飞出来的那块方块上
      const u = clamp((T - (BR.snap - 0.1)) / 0.85), land = PERCH0.clone().add(V3(0, 0.14, 0));
      const p = seat.clone().lerp(land, eOut(u)); p.y += 1.1 * Math.sin(Math.PI * u) - (u < 0.15 ? 0 : 0);
      girl.root.position.copy(p); girl.root.rotation.y = lerp(0, 0.6, smooth(u)); girl.root.updateMatrixWorld(true);
      const a = girl.dancer; girl.play(SIT, T); const sit = null;
      girl.dancer.apply(T < BR.snap ? blendSolved(getAnim('act__sit-swing-legs').solve((girl.beatOf(T) - girl.beatOf(105.66)), a), solveKeys('move__run-jump', JUMP, T), smooth((T - (BR.snap - 0.1)) / 0.1)) : solveKeys('move__run-jump', JUMP, T));
    } else {                                                       // 站在往下沉的方块上，看着超稠密方块
      girl.root.position.copy(PERCH0).add(V3(0, 0.14 + perchY(T), 0)); girl.root.rotation.y = Math.atan2(CUBE.x - PERCH0.x, CUBE.z - PERCH0.z); girl.root.updateMatrixWorld(true);
      const p = T < BR.dense + 0.15 ? smooth((T - BR.dense) / 0.15) : 1;
      girl.dancer.apply(blendSolved(solveKeys('move__run-jump', JUMP, T), solveKeys('act__look-distance', [[BR.dense, 0.6], [116.3, 3.0], [BR.chase, 3.8]], T), p));
    }
    girl.root.updateMatrixWorld(true); girl.setSkin('toon', T);
  }
  const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler();
  function worldS(T) {
    // 竖轴横臂以上那截：三声 just 一节节变方块
    const nJust = upCount(T), highTop = AX.vertTop;
    vHigh.visible = nJust < 3; const lineBot = AX.horizY + nJust * SLAB, lineLen = Math.max(0.01, highTop - lineBot);
    vHigh.scale.y = lineLen; vHigh.position.y = lineBot + lineLen / 2; vTip.visible = nJust < 3; vTip.position.y = highTop + 0.07;
    vLow.visible = T < BR.sing + 0.4;
    labY.visible = labX.visible = T < BR.disobey;
    rain.visible = T < BR.sing + 0.8; rain.material.opacity = 0.55 * (1 - smooth((T - BR.sing) / 0.8));
    // 方块
    const nUp = upCount(T), nDn = dnCount(T), A = twistA(T), du = denseU(T);
    slabInfo.forEach((s, k) => {
      const shown = s.up ? s.i < nUp : s.i < nDn;
      if (!shown) { slabs.setMatrixAt(k, _m4.makeScale(0, 0, 0)); return; }
      const pop = s.up && s.i < 3 ? eOut((T - BR.just[s.i]) / 0.12) : 1;
      let p = V3(A * Math.sin(s.y * 0.18 - T * 3.2), s.y, A * 0.5 * Math.cos(s.y * 0.13 - T * 2.4)), ry = A * 0.5 * Math.sin(s.y * 0.1 + T * 2), rz = A * 0.12 * Math.sin(s.y * 0.2 + T);
      const ej = eject[k]; if (ej.fly && T > ej.at) { const k2 = T - ej.at; p.add(ej.v.clone().multiplyScalar(k2)); ry += ej.spin * k2; rz += ej.spin * 0.5 * k2; }
      let sc = V3(s.w * pop, SLAB * 0.92 * pop, s.w * pop);
      if (du > 0) { const st = clamp((du - (s.up ? s.i / NUP : s.i / NDN) * 0.5) / 0.5); p.lerp(CUBE, eIn(st)); sc.multiplyScalar(1 - st); }
      slabs.setMatrixAt(k, _m4.compose(p, _q.setFromEuler(_e.set(0, ry, rz)), sc));
    });
    slabs.instanceMatrix.needsUpdate = true;
    // 招牌挂在方块上（塔扭之前）
    const slabFront = (i, dx = 0) => { const s = slabInfo[i]; return V3(A * Math.sin(s.y * 0.18 - T * 3.2) + dx, s.y, s.w / 2 + 0.03); };
    sJust.g.position.copy(slabFront(2)); sTrans.g.position.copy(slabFront(9)); sAll.g.position.copy(slabFront(NUP + 14)); sAll.g.rotation.x = -0.9;
    sTill.forEach((s, i) => { s.g.position.set(-1.05, 4.35 - i * 0.55, 0.3); s.g.rotation.y = 0.5; });
    { const k2 = Math.max(0, T - wt(L.till, 4)); sDis.g.position.set(-0.6 - 1.2 * k2, 3.6 + 0.6 * k2, 1.2 + 1.5 * k2); sDis.g.rotation.set(0, 0.5, 0.2 + 0.8 * k2); }
    // 回形针 → 眼
    const flip = smooth((T - BR.disobey) / 0.15);
    clip.visible = flip < 1; clip.setMatrixAt(0, _m4.compose(V3(...C3_EXIT.clip), _q.setFromEuler(_e.set(0.2, T * 0.6 + flip * Math.PI / 2, 0.35)), V3(1, 1, 1).multiplyScalar(1 - flip * 0.8))); clip.instanceMatrix.needsUpdate = true;
    eye.g.visible = T >= BR.disobey && du < 0.6; const es = eOut((T - BR.disobey - 0.05) / 0.2);
    eye.g.position.set(C3_EXIT.clip[0] + A * Math.sin(C3_EXIT.clip[1] * 0.18 - T * 3.2), C3_EXIT.clip[1], slabInfo[2].w / 2 + 0.06); eye.g.scale.setScalar(Math.max(0.001, es * (1 + 0.06 * Math.sin(T * 9))));
    eye.lit.color.copy(hdr(PAL.lemon, 1.6 + 2.5 * Math.exp(-Math.max(0, T - BR.disobey) / 0.25)));
    // 横臂：114.24 被拧断，断开那截掉下去
    const sn = T - BR.snap; arm.rotation.z = sn > 0 ? -0.6 * eOut(sn / 0.2) : -0.08 * smooth((T - BR.disobey) / 0.9) * Math.sin(T * 30);
    armB.position.set(2.1, sn > 0 ? -2 * sn * sn : 0, 0); armB.rotation.z = sn > 0 ? -1.4 * sn : 0; arm.visible = T < BR.dense;
    // 方块（落脚那块）+ 超稠密方块
    perch.visible = T >= BR.snap; perch.position.copy(PERCH0).add(V3(0, perchY(T), 0)); perch.rotation.set(0, 0.6, 0);
    cube.visible = T >= BR.dense; dcS.update(T); cube.position.copy(CUBE); cube.rotation.set(T * 0.7, T * 1.1, 0); cube.scale.setScalar(lerp(0.3, 1, smooth((T - BR.dense) / 0.6)) * (1 + 0.04 * Math.sin(T * 17)));
    sDense.g.position.copy(CUBE).add(V3(2.9, 0.4, 1.6)); sDense.g.lookAt(girl.root.position.clone().add(V3(1.6, 1.3, 2.8)));
    // 城里的灯被抽走
    city.mat.color.setScalar(1.1 * (1 - 0.92 * smooth((T - BR.dense - 0.3) / 1.4)));
    placeRiver(T); sPost.draw(T);
    moon.visible = T >= BR.sing + 0.6;                       // 冷蓝雨夜（接 c3）没有月亮；雨停、霓虹回来之后才露出来
    hemi.color.set(T < BR.sing ? '#7a88ff' : '#c9b6ff'); hemi.intensity = lerp(0.6, 0.9, smooth((T - BR.sing) / 1));
    for (const s of signs) s.set(T);
    placeGirlS(T);
  }

  // ================================================================ 场景 R：熄灯的街 + 显卡坑
  const R = new THREE.Scene(); R.background = col('#05050b'); R.fog = new THREE.Fog('#05050b', 20, 90);
  R.add(new THREE.HemisphereLight('#8a90ff', '#201830', 0.7), createGirlLights({ key: 2.0, rim: 2.6, fill: 0.8 }));
  const RW = 1.8, ROAD_LEN = 120;                                                   // 路半宽；路沿 +z 方向
  const road = new THREE.Group(); R.add(road);
  const roadA = new THREE.Mesh(new THREE.PlaneGeometry(60, ROAD_LEN), new THREE.MeshBasicMaterial({ color: '#13121f' })); roadA.rotation.x = -Math.PI / 2; roadA.position.z = 0; road.add(roadA);
  const PIT = [-26, 26, 0, 0];                                                     // 坑的范围（x0, x1, z0, z1），z 在 IMPACT_Z 算出来以后填
  const roadN = new THREE.Mesh(new THREE.PlaneGeometry(60, 1), roadA.material), roadF = new THREE.Mesh(new THREE.PlaneGeometry(60, 1), roadA.material);
  roadN.rotation.x = roadF.rotation.x = -Math.PI / 2; R.add(roadN, roadF);
  for (const x of [-RW, RW]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.06, ROAD_LEN), new THREE.MeshBasicMaterial({ color: hdr(PAL.mint, 1.8) })); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.01, 0); road.add(m); }
  for (let z = -ROAD_LEN / 2; z < ROAD_LEN / 2; z += 2) { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.7), new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 1.3) })); m.rotation.x = -Math.PI / 2; m.position.set(0, 0.01, z); road.add(m); }
  const blds = (() => { const rnd = mulberry32(31), n = 80, m = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ map: winTex, color: hdr('#ffffff', 0.12) }), n), d = [];   // 熄了灯的楼
    for (let i = 0; i < n; i++) { const side = i % 2 ? 1 : -1, w = 2 + rnd() * 3, h = 4 + rnd() * 14; d.push({ x: side * (RW + 2 + rnd() * 6 + w / 2), z: -ROAD_LEN / 2 + (i / n) * ROAD_LEN, w, h, sp: (rnd() - 0.5) * 2 }); }
    m.frustumCulled = false; R.add(m); return { m, d }; })();
  const herZ = T => 5.5 * (T - BR.chase);                                          // 她沿 +z 跑（朝镜头）
  const gapOf = T => lerp(7, 2.6, smooth((T - BR.chase) / 1.6));
  const IMPACT_Z = herZ(BR.slam) + 6.5;
  PIT[2] = IMPACT_Z - 17; PIT[3] = IMPACT_Z + 17;
  const FALL0 = BR.slam + 0.07, LZ = herZ(FALL0) + 1.5;                         // 她踩空掉下去的时刻、落在显卡阵列上的位置（也是 LED 字 / 光波的中心）
  const dcR = makeDenseCube(2.0, { faces: true }), rCube = dcR.g; R.add(rCube);

  function cubeAt(T) {
    if (T < BR.gpu) { const z = herZ(T) - gapOf(T); return { p: V3(0, 1.0 + 0.7 * Math.abs(Math.sin((T - BR.chase) * 6.5)), z), r: V3(0.12 * Math.sin(T * 7), (T - BR.chase) * 1.6, 0) }; }   // 慢慢自转（四面的刻字轮流朝镜头）
    const u = clamp((T - BR.gpu) / (BR.slam - BR.gpu)), z0 = herZ(BR.gpu) - gapOf(BR.gpu);
    if (u < 1) return { p: V3(0, 1.0 + 3.8 * Math.sin(Math.PI * u), lerp(z0, IMPACT_Z, u)), r: V3(0, 2 + u * 3, 0) };
    return { p: V3(0, lerp(1.0, -16, smooth((T - BR.slam) / 0.5)), IMPACT_Z), r: V3(0, 5, 0) };   // 砸穿路面、一路沉到显卡阵列下面去
  }
  // 安全护栏：她跑过之后从地里升起来，方块撞碎它（每道一个词）
  const stripeTex = (() => { const c = document.createElement('canvas'); c.width = 512; c.height = 64; const g = c.getContext('2d'); for (let i = -2; i < 20; i++) { g.fillStyle = i % 2 ? '#111' : PAL.lemon; g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32 + 32, 0); g.lineTo(i * 32, 64); g.lineTo(i * 32 - 32, 64); g.fill(); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const fenceT = L.brk.words.map(w => w.start);
  const fences = fenceT.map((t, k) => {
    const g = new THREE.Group(), z = herZ(t) - gapOf(t) + 1.1; R.add(g);
    const board = new THREE.Mesh(new THREE.PlaneGeometry(RW * 2 + 0.6, 0.38), new THREE.MeshBasicMaterial({ map: stripeTex, side: THREE.DoubleSide, color: hdr('#fff', 1.2) })); board.position.y = 0.9; g.add(board);
    for (const x of [-RW - 0.3, RW + 0.3]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.2, 0.08), new THREE.MeshBasicMaterial({ color: hdr(PAL.pink, 1.6) })); p.position.set(x, 0.6, 0); g.add(p); }
    const s = sign(L.brk.words[k].w.toUpperCase(), [PAL.pink, PAL.mint, PAL.lemon, PAL.pink, PAL.mint][k], 0.52, t, k === 4 ? BR.gpu + 0.2 : fenceT[k + 1] ?? BR.gpu); g.add(s.g); s.g.position.set(0, 2.05, 0.02);
    // 碎片：板子切成 8 块往镜头方向飞
    const shards = Array.from({ length: 8 }, (_, i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry((RW * 2 + 0.6) / 8, 0.38), new THREE.MeshBasicMaterial({ map: stripeTex, side: THREE.DoubleSide })); m.position.set(-RW - 0.3 + (i + 0.5) * (RW * 2 + 0.6) / 8, 0.9, 0); g.add(m); return { m, x: m.position.x, rnd: mulberry32(100 + k * 10 + i) }; });
    shards.forEach(sh => { sh.v = V3((sh.x > 0 ? 1 : -1) * (2 + sh.rnd() * 4), 2 + sh.rnd() * 3, 1.5 + sh.rnd() * 2.5); sh.sp = sh.rnd() * 12; });   // 往两边甩，不冲镜头
    return { g, z, t, board, shards, s, rise: herZ(t - 0.45) };
  });
  function placeFences(T) {
    for (const f of fences) {
      const up = smooth((T - (f.t - 0.42)) / 0.18), br = T - f.t;
      f.g.visible = T >= f.t - 0.45 && T < BR.slam + 0.3; f.g.position.set(0, lerp(-1.6, 0, up), f.z);
      f.board.visible = br < 0;
      f.shards.forEach(sh => { sh.m.visible = br >= 0 && br < 0.7; if (br >= 0) { sh.m.position.set(sh.x + sh.v.x * br, 0.9 + sh.v.y * br - 4.9 * br * br, sh.v.z * br); sh.m.rotation.set(sh.sp * br, sh.sp * 0.7 * br, 0); } });
    }
  }
  // 显卡阵列（路面塌开后露出来）：每块卡一颗 LED；LED 波 + 拼字 100 000 GPU
  const GX = 150, GZ = 104, GS = 0.33, GY = -6;
  const cards = new THREE.InstancedMesh(new THREE.BoxGeometry(GS * 0.86, 0.12, GS * 0.6), new THREE.MeshLambertMaterial({ color: '#262838', emissive: col('#0a0a12') }), GX * GZ);
  const leds = new THREE.InstancedMesh(new THREE.BoxGeometry(GS * 0.5, 0.04, GS * 0.18), new THREE.MeshBasicMaterial({ color: '#ffffff' }), GX * GZ);
  { const mm = new THREE.Matrix4(); let k = 0; for (let ix = 0; ix < GX; ix++) for (let iz = 0; iz < GZ; iz++, k++) { const x = (ix - GX / 2 + 0.5) * GS, z = LZ + (iz - GZ / 2 + 0.5) * GS; cards.setMatrixAt(k, mm.makeTranslation(x, GY, z)); leds.setMatrixAt(k, mm.makeTranslation(x, GY + 0.08, z)); leds.setColorAt(k, col('#000')); } }
  cards.frustumCulled = leds.frustumCulled = false; R.add(cards, leds);
  const ledMask = (() => {                                                         // 「100 000 GPU」点阵：分三段（100 / 000 / GPU）各自的亮起时刻
    const c = document.createElement('canvas'); c.width = GX; c.height = GZ; const g = c.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 0, GX, GZ); g.font = `${Math.round(GZ * 0.29)}px ${FONT}`; g.textBaseline = 'middle'; g.textAlign = 'left';
    const parts = [['100', 'r'], [' 000', 'g'], [' GPU', 'b']]; let w = 0; for (const [t] of parts) w += g.measureText(t).width; let x = (GX - w) / 2;
    for (const [t, ch] of parts) { g.fillStyle = ch === 'r' ? '#f00' : ch === 'g' ? '#0f0' : '#00f'; g.fillText(t, x, GZ * 0.5); x += g.measureText(t).width; }
    return g.getImageData(0, 0, GX, GZ).data; })();
  const ledTimes = [wt(L.hund, 0) + 0.15, wt(L.hund, 1), wt(L.hund, 2)];
  const _c = new THREE.Color(), LEDC = [col(PAL.mint), col(PAL.pink), col(PAL.lemon)];
  let ledKey = '';
  function placeLeds(T) {
    const vis = T >= BR.slam - 0.05; cards.visible = leds.visible = vis; if (!vis) return;
    const key = Math.round(T * 30); if (key === ledKey) return; ledKey = key;
    let k = 0; const age = T - BR.fallLand;                       // 光波从她落脚的地方扩散
    for (let ix = 0; ix < GX; ix++) for (let iz = 0; iz < GZ; iz++, k++) {
      const x = (ix - GX / 2 + 0.5) * GS, z = (iz - GZ / 2 + 0.5) * GS, r = Math.hypot(x, z);
      const wave = (age > 0 ? Math.exp(-((r - age * 14) ** 2) / 6) + 0.18 * Math.max(0, Math.sin(r * 1.3 - age * 9)) : 0.1 + 0.1 * Math.sin(ix * 1.7 + iz * 2.3 + T * 6));
      const o = (iz * GX + ix) * 4,   /* 俯拍机位 up = -z：画布第 0 行在 -z 那头 */ inText = [0, 1, 2].find(ch => ledMask[o + ch] > 128);
      let b = wave * 0.9, c = LEDC[(ix + iz) % 3];
      if (inText != null && T >= ledTimes[inText]) { b = 2.0 + 0.3 * Math.sin(T * 12 + ix * 0.3); c = [col(PAL.mint), col(PAL.pink), col(PAL.lemon)][inText]; }
      leds.setColorAt(k, _c.copy(c).multiplyScalar(b));
    }
    leds.instanceColor.needsUpdate = true;
  }
  // 塌下去的路面：撞击点前后一大块往下掉、翻
  const holeSlabs = Array.from({ length: 10 }, (_, i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.25, 3), new THREE.MeshLambertMaterial({ color: '#1a1828' })); R.add(m); const r = mulberry32(400 + i); return { m, x: (i % 2 ? 1 : -1) * (3.2 + 4 * r()), z: IMPACT_Z - 12 + i * 3, sp: (r() - 0.5) * 3, d: 0.1 + r() * 0.3 }; });
  function placeHole(T) {
    const a = T - BR.slam, open = a > 0;                          // 撞上之前路面整块；撞上之后挖掉坑那一段（前后两截），坑里是显卡阵列
    roadA.visible = !open; roadN.visible = roadF.visible = open;
    const n0 = -ROAD_LEN / 2, f1 = ROAD_LEN / 2;
    roadN.scale.y = PIT[2] - n0; roadN.position.set(0, 0, (n0 + PIT[2]) / 2); roadF.scale.y = f1 - PIT[3]; roadF.position.set(0, 0, (PIT[3] + f1) / 2);
    for (const m of road.children) if (m !== roadA) m.visible = !(open && (m.scale.y > 1.5 || m.geometry.parameters.height > 2 || (m.position.z > PIT[2] && m.position.z < PIT[3])));   // 坑上方的路面线一起掉没（两条长边线撞上之后收掉）
    { const mm = new THREE.Matrix4(); blds.d.forEach((b, i) => { const inPit = b.z > PIT[2] && b.z < PIT[3]; const k = open && inPit ? Math.max(0, a - 0.05) : 0;
      mm.compose(V3(b.x, b.h / 2 - 20 * k * k, b.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(b.sp * k, 0, b.sp * 0.6 * k)), V3(b.w, b.h, b.w)); blds.m.setMatrixAt(i, mm); }); blds.m.instanceMatrix.needsUpdate = true; }
    holeSlabs.forEach(h => { h.m.visible = a > -0.2 && T < BR.rlhf; const k = Math.max(0, a - h.d); h.m.position.set(h.x, 0.01 - 6 * k * k, h.z); h.m.rotation.set(h.sp * k, 0, h.sp * 0.5 * k); });
  }
  const pitMask = new THREE.Mesh(new THREE.PlaneGeometry(9, 30), new THREE.MeshBasicMaterial({ color: '#05050b' })); pitMask.rotation.x = -Math.PI / 2; R.add(pitMask);   // 坑口（路面上的黑洞，坑底是显卡）
  // 她（R 场景）
  const RUN = [{ t: 117.0, anim: 'move__sprint-full__inplace', rate: 1.75 }];
  function placeGirlR(T) {
    R.add(girl.root); girl.root.visible = true; girl.root.scale.setScalar(1); girl.root.rotation.set(0, 0, 0);    // 朝 +z（朝镜头）
    const fallT0 = FALL0;
    if (T < fallT0) { girl.root.position.set(0, 0, herZ(T)); girl.root.updateMatrixWorld(true); girl.play(RUN, T); }
    else { const k = T - fallT0, land = BR.fallLand, z = lerp(herZ(fallT0), LZ, smooth(k / (land - fallT0)));
      girl.root.position.set(0, T < land ? Math.max(GY + 0.14, -11 * k * k) : GY + 0.14, z); girl.root.updateMatrixWorld(true);
      girl.dancer.apply(T < land ? solveKeys('move__fall-air', [[fallT0, 0.0], [land, 0.9]], T) : solveKeys('move__fall-hard-land', [[land, 0.35], [BR.rlhf, 1.6]], T)); }
    girl.root.updateMatrixWorld(true); girl.setSkin('toon', T);
  }
  const ring = new THREE.Mesh(new THREE.RingGeometry(1.0, 1.18, 64), new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 2.4), transparent: true, side: THREE.DoubleSide, depthWrite: false })); ring.rotation.x = -Math.PI / 2; R.add(ring);
  const herLight = new THREE.PointLight('#ffd6e8', 0, 9, 1.3); R.add(herLight);
  function worldR(T) {
    const c = cubeAt(T); rCube.position.copy(c.p); rCube.rotation.set(c.r.x, c.r.y, c.r.z); rCube.visible = T >= BR.chase && T < BR.slam + 0.45;
    dcR.update(T); placeFences(T); placeHole(T); placeLeds(T);
    pitMask.visible = false;
    const la = T - BR.fallLand; ring.visible = la > 0; ring.position.set(0, GY + 0.16, LZ); ring.scale.setScalar(la > 0 ? lerp(0.4, 2.2, eOut(la / 0.5)) * (1 + 0.05 * Math.sin(T * 8)) : 1); ring.material.opacity = 0.9;   // 俯拍里标出她
    herLight.intensity = T >= BR.gpu - 0.3 ? 4 + 6 * (la > 0 ? Math.exp(-la / 0.3) : 0) : 0; herLight.position.copy(girl.root.position).add(V3(0.6, 1.4, 1.2));
    for (const s of signs) s.set(T);
    placeGirlR(T);
  }

  // ================================================================ ⑥ 漫画页（kits/comic.js）
  const comic = await createComic(mv, { w: 20, h: 11.25, seed: 57 });
  const CS = new THREE.Scene(); CS.background = col('#0a0812'); CS.add(comic.group);
  const ccam = new THREE.PerspectiveCamera(36, W / Hh, 0.05, 800);
  const ld = new THREE.TextureLoader(), KB = n => new URL(`../../cast-cyber-girl/closeup/bridge-comic/cut-${n}.png`, import.meta.url).href;
  const img = {}; await Promise.all(['stand', 'slam', 'face'].map(async n => { const im = new Image(); im.src = KB(n); await im.decode(); img[n] = im; }));
  const gC = document.createElement('canvas'); gC.width = gC.height = 1024; paintGauge(gC.getContext('2d'), 0.99, { dark: true });   // 黑屏的表（副歌 1 同款）
  const fitImg = (c, im, b, { x = 0.5, y = 1, h = 1, flip = false } = {}) => { const s = b.h * h / im.height, w = im.width * s; c.save(); c.translate(b.w * x, b.h * y); if (flip) c.scale(-1, 1); c.drawImage(im, -w / 2, -im.height * s, w, im.height * s); c.restore(); };
  const leds2d = (c, b, T, a = 1) => { const rnd = mulberry32(9); for (let i = 0; i < 260; i++) { const x = rnd() * b.w, y = b.h * (0.55 + rnd() * 0.45), on = rnd() < 0.5; c.fillStyle = [PAL.mint, PAL.pink, PAL.lemon][i % 3]; c.globalAlpha = (on ? 0.9 : 0.25) * a; c.fillRect(x, y, 10, 4); } c.globalAlpha = 1; };
  comic.panel({ id: 'land', rect: [0.02, 0.03, 0.3, 0.45], reveal: { at: BR.rlhf - 0.02, kind: 'drop', dur: 0.25 }, dim: { at: BR.goes, amount: 0.3 }, border: 'ink', borderW: 12,
    layers: [
      { depth: 0.8, draw: (c, b) => { const g = c.createLinearGradient(0, 0, 0, b.h); g.addColorStop(0, '#120f22'); g.addColorStop(1, '#251838'); c.fillStyle = g; c.fillRect(-40, -40, b.w + 80, b.h + 80); CC.tone(c, b, { color: PAL.mint, step: 16, grad: [0.6, 0], alpha: 0.3 }); } },
      { depth: 0.3, draw: (c, b, T) => leds2d(c, b, T) },
      { depth: 0.1, draw: (c, b) => fitImg(c, img.stand, b, { x: 0.5, y: 0.98, h: 0.9 }) },
    ] });
  comic.panel({ id: 'slam', rect: [0.34, 0.03, 0.4, 0.45], reveal: { at: BR.rlhf + 0.22, kind: 'wipe', dur: 0.2 }, dim: { at: BR.askew, amount: 0.3 }, border: 'ink', borderW: 12,
    layers: [
      { depth: 0.8, draw: (c, b) => { c.fillStyle = '#1b1530'; c.fillRect(-40, -40, b.w + 80, b.h + 80); } },
      { depth: 0.1, draw: (c, b) => fitImg(c, img.slam, b, { x: 0.5, y: 1.0, h: 0.98 }) },
    ] });
  comic.panel({ id: 'eye', rect: [0.76, 0.03, 0.22, 0.45], reveal: { at: BR.goes - 0.02, kind: 'pop', dur: 0.2 }, border: 'ink', borderW: 12,
    layers: [
      { depth: 0.6, draw: (c, b) => { c.fillStyle = '#0e0c08'; c.fillRect(-40, -40, b.w + 80, b.h + 80); } },
      { depth: 0.1, draw: (c, b, T) => {
        const cx = b.w * 0.5, cy = b.h * 0.36, R0 = b.w * 0.36;                                    // 同一只眼：柠黄同心圆
        c.fillStyle = '#4a4a5a'; c.beginPath(); c.arc(cx, cy, R0 * 1.24, 0, 7); c.fill(); c.fillStyle = '#0b0a06'; c.beginPath(); c.arc(cx, cy, R0, 0, 7); c.fill();
        c.strokeStyle = c.fillStyle = PAL.lemon; c.lineWidth = R0 * 0.06; for (const k of [0.46, 0.66, 0.86]) { c.beginPath(); c.arc(cx, cy, R0 * k, 0, 7); c.stroke(); } c.beginPath(); c.arc(cx, cy, R0 * 0.26, 0, 7); c.fill();
        const tw = smooth((T - BR.goes - 0.05) / 0.3) * 1.9;                                       // 点赞的拇指被拧歪
        c.save(); c.translate(cx, b.h * 0.78); c.rotate(tw); c.fillStyle = PAL.mint; c.strokeStyle = PAL.ink; c.lineWidth = 8;
        c.beginPath(); c.roundRect(-70, -10, 140, 90, 18); c.fill(); c.stroke(); c.beginPath(); c.roundRect(-36, -95, 46, 100, 22); c.fill(); c.stroke(); c.restore();
      } },
    ] });
  comic.panel({ id: 'face', rect: [0.02, 0.51, 0.96, 0.46], reveal: { at: BR.askew + 0.15, kind: 'slide', dir: 'u', dur: 0.25 }, border: 'ink', borderW: 14,
    layers: [
      { depth: 0.9, draw: (c, b) => { const g = c.createLinearGradient(0, 0, b.w, 0); g.addColorStop(0, '#0c0a16'); g.addColorStop(1, '#2a1838'); c.fillStyle = g; c.fillRect(-40, -40, b.w + 80, b.h + 80); CC.tone(c, b, { color: PAL.pink, step: 18, grad: [0, 0.5], alpha: 0.25 }); } },
      { depth: 0.5, draw: (c, b) => { const s = b.h * 1.25; c.drawImage(gC, b.w * 0.36 - s * 0.5, -s * 0.55, s, s); } },          // 她左上方：黑屏的 P(DOOM) 表的一角（副歌 1 同款），她的视线就朝它
      { depth: 0.1, draw: (c, b) => fitImg(c, img.face, b, { x: 0.72, y: 1.02, h: 1.15 }) },
    ] });
  comic.bubble({ panel: 'slam', x: 0.36, y: 0.07, w: 0.12, text: 'RLHF', kind: 'box', size: 92, at: BR.rlhf, until: BR.askew + 1.2 });
  comic.bubble({ panel: 'eye', x: 0.78, y: 0.07, w: 0.12, text: 'GOES', kind: 'box', size: 80, at: BR.goes, until: BR.askew + 1.2 });
  comic.sfx({ text: 'ASKEW', x: 0.5, y: 0.3, size: 0.15, at: BR.askew, until: 123.55, color: '#ff2e4a', stroke: PAL.ink, angle: -14, shake: 1, font: CF.anton });
  const ckeys = [
    { t: BR.rlhf, target: 'land', yaw: -4, pitch: -2, margin: 1.08 },
    { t: BR.rlhf + 0.42, target: 'slam', yaw: 3, pitch: -1, margin: 1.12 },
    { t: BR.goes, target: 'eye', yaw: 4, pitch: -2, margin: 1.15 },
    { t: BR.askew + 0.05, target: 'page', yaw: -3, pitch: -4, roll: 0, margin: 1.03 },
    { t: BR.face, target: 'page', yaw: -2, pitch: -3, margin: 1.02 },
    { t: 123.3, target: [0.3, 0.51, 0.68, 0.46], yaw: 1, pitch: 0, margin: 1.04 },
    { t: BR.end, target: [0.33, 0.51, 0.64, 0.46], yaw: 0, pitch: 0, margin: 0.98 },     // 末格：表的一角 + 她朝左上看的脸
  ];

  // ================================================================ 镜头
  const cam = new THREE.PerspectiveCamera(42, W / Hh, 0.03, 3000);
  const look = (c, pos, tgt, fov, up = V3(0, 1, 0)) => { c.position.copy(pos); c.up.copy(up); c.lookAt(tgt); c.fov = fov; c.updateProjectionMatrix(); c.updateMatrixWorld(true); };
  const camTower = T => look(cam,
    pv([[BR.t0, ...C3_EXIT.cam.pos], [BR.sing, 1.3, 1.6, 4.2], [111.6, 1.0, 1.3, 3.0], [112.3, 2.0, 3.6, 3.4], [BR.disobey, 2.3, 4.4, 3.6]], T),
    pv([[BR.t0, ...C3_EXIT.cam.target], [BR.sing, 0.1, 5.2, 0], [110.7, 0.05, 9, 0], [111.0, 0, 30, 0], [111.7, 0, 70, 0], [112.25, 0.6, -10, 1.5], [BR.disobey, 0.4, -70, 1]], T),
    pchip([[BR.t0, C3_EXIT.cam.fov], [BR.sing, 46], [111.6, 54], [112.3, 58], [BR.disobey, 60]], T));
  const camDis = T => { const g = girl.root.position, u = smooth((T - BR.snap) / 0.8);
    look(cam, V3(lerp(5.2, 7.5, u), lerp(3.4, 2.4, u), lerp(4.2, 5.4, u)), V3(lerp(0.9, g.x * 0.7, u), lerp(3.1, g.y + 0.6, u), lerp(0.2, g.z * 0.6, u)), 48); };
  const camDense = T => { const g = girl.root.position; look(cam, g.clone().add(V3(1.6, 1.3, 2.8)), V3(lerp(CUBE.x, -20, 0.1), lerp(CUBE.y + 2, CUBE.y, 0.3), CUBE.z), 58); };
  const camChase = T => { const z = herZ(T); look(cam, V3(0.3, 0.7, z + 2.9), V3(0, 0.95, z - 3), 58); };
  const camGpu = T => {                       // 越过 → 砸穿 → 跟着她一起掉进坑（中景，她 ≥ 20% 画高）→ 落地 → 升镜俯拍 100 000 GPU
    const g = girl.root.position, z = herZ(Math.min(T, FALL0));
    if (T < FALL0) { look(cam, V3(0.3, 0.7, z + 2.9), V3(0, 0.95, z - 3), 58); return; }
    const f = smooth((T - FALL0) / 0.15), near = g.clone().add(V3(1.3, 0.55, 2.3)), nearT = g.clone().add(V3(0, 0.5, 0));
    const pos = V3(0.3, 0.7, z + 2.9).lerp(near, f), tgt = V3(0, 0.95, z - 3).lerp(nearT, f);
    const u = smooth((T - (BR.fallLand + 0.06)) / 0.5);           // 120.42 升到顶，俯拍停 0.35 s 让 100 000 GPU 读得出
    look(cam, pos.lerp(V3(0, GY + 34, LZ + 0.01), u), tgt.lerp(V3(0, GY, LZ), u), lerp(50, 54, u), V3(0, 1 - u, -u).normalize());
  };
  const shake = (T, t, a) => { const k = T - t; return k > 0 ? a * Math.exp(-k * 9) * Math.sin(k * 55) : 0; };

  // ================================================================ 镜头表
  // 头在画面外时不传 camera（girl.js 的五官层在头出画时读回遮罩会报 RangeError，同 holo-dancer 页的做法）
  const face3d = T => { if (!girl.face || !girl.root.visible) return; const hp = girl.headPosition(V3()).project(cam), inF = Math.abs(hp.x) < 0.9 && Math.abs(hp.y) < 0.9 && hp.z < 1 && hp.z > -1; girl.face.update(T, inF ? { camera: cam, blink: 'auto' } : { blink: 'auto' }); };
  const post = (T, extra = {}) => ({ bloom: { strength: 0.8, threshold: 1.0 }, chroma: 0.1 + 0.3 * kick(T), grade: { vignette: 0.36 }, ...extra });
  const shots = [
    { id: 'br-tower', t0: BR.t0, t1: BR.disobey, transitionIn: { kind: 'cut' }, build() { return {}; },
      update(_, T) { worldS(T); camTower(T); face3d(T); const cold = 1 - smooth((T - BR.sing) / 1.0);
        return { scene: S, camera: cam, post: post(T, { bloom: { strength: 0.9, threshold: 0.9 }, grade: { saturation: lerp(1, 0.85, cold), warmth: -0.5 * cold, vignette: 0.4 } }) }; } },
    { id: 'br-disobey', t0: BR.disobey, t1: BR.dense, transitionIn: { kind: 'cut' }, build() { return {}; },
      update(_, T) { worldS(T); camDis(T); cam.position.y += shake(T, BR.snap, 0.08); cam.updateMatrixWorld(true); face3d(T);
        return { scene: S, camera: cam, post: post(T, { flash: T >= BR.disobey ? { amount: 0.3 * Math.exp(-(T - BR.disobey) / 0.12), color: '#fff2b0' } : 0, chroma: 0.15 + 0.6 * Math.exp(-Math.max(0, T - BR.snap) / 0.2) * (T > BR.snap ? 1 : 0) }) }; } },
    { id: 'br-dense', t0: BR.dense, t1: BR.chase, transitionIn: { kind: 'cut' }, build() { return {}; },
      update(_, T) { worldS(T); camDense(T); face3d(T); return { scene: S, camera: cam, post: post(T, { bloom: { strength: 1.0, threshold: 0.9 } }) }; } },
    { id: 'br-chase', t0: BR.chase, t1: BR.gpu, transitionIn: { kind: 'cut' }, build() { return {}; },
      update(_, T) { worldR(T); camChase(T); face3d(T); const hit = fenceT.reduce((a, t) => a + (T >= t ? Math.exp(-(T - t) / 0.08) : 0), 0);
        cam.position.y += 0.04 * hit * Math.sin(T * 80); cam.updateMatrixWorld(true); return { scene: R, camera: cam, post: post(T, { chroma: 0.15 + 0.4 * hit }) }; } },
    { id: 'br-gpu', t0: BR.gpu, t1: BR.rlhf, transitionIn: { kind: 'cut' }, build() { return {}; },
      update(_, T) { worldR(T); camGpu(T); cam.position.y += shake(T, BR.slam, 0.3); cam.updateMatrixWorld(true); face3d(T);
        return { scene: R, camera: cam, post: post(T, { flash: T >= BR.slam ? { amount: 0.3 * Math.exp(-(T - BR.slam) / 0.08), color: '#ffffff' } : 0 }) }; } },
    { id: 'br-comic', t0: BR.rlhf, t1: BR.end, transitionIn: { kind: 'cut' }, build() { return {}; },
      update(_, T) {
        girl.root.visible = false;
        comic.group.rotation.set(-0.04, 0.03, -14 * D2R * eOut((T - BR.askew) / 0.18));
        comic.camPath(ccam, T, ckeys);
        ccam.updateMatrixWorld(); comic.update(T, { camera: ccam }); comic.group.updateMatrixWorld(true); comic.update(T, { camera: ccam });
        const st = T >= BR.askew ? Math.exp(-(T - BR.askew) / 0.1) : 0;
        return { scene: CS, camera: ccam, post: { bloom: { strength: 0.5, threshold: 1.0 }, chroma: 0.08 + 0.4 * st, grade: { vignette: 0.28 }, flash: st > 0.01 ? { amount: 0.25 * st, color: '#ff4060' } : 0 } };
      } },
  ];

  // ================================================================ 自检：window.__brCheck() —— 招牌字高 / 被她挡 / 脚滑（3D 段）
  window.__brCheck = ({ fps = 30 } = {}) => {
    const out = { textPx: [], signHit: [], slide: [] }, prev = {};
    const KEYS = ['Head', 'Hips', 'LeftHand', 'RightHand', 'LeftFoot', 'RightFoot', 'LeftToeBase', 'RightToeBase'];
    for (let f = Math.round(BR.t0 * fps); f < Math.round(BR.rlhf * fps); f++) {
      const T = f / fps, sh = shots.find(s => T >= s.t0 && T < s.t1); if (!sh) continue; sh.update(null, T);
      const P = Object.fromEntries(KEYS.map(k => [k, I[k].bone.getWorldPosition(V3())]));
      const ndc = KEYS.map(k => P[k].clone().project(cam)), gb = { x0: Math.min(...ndc.map(p => p.x)) - 0.03, x1: Math.max(...ndc.map(p => p.x)) + 0.03, y0: Math.min(...ndc.map(p => p.y)) - 0.03, y1: Math.max(...ndc.map(p => p.y)) + 0.06 };
      for (const s of signs) {
        let shown = T >= s.at; for (let o = s.g; o && shown; o = o.parent) shown = o.visible; if (!shown) continue;
        s.g.updateMatrixWorld(true);
        const cs = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => s.m.localToWorld(V3(a * s.bw / 2, b * s.bh / 2, 0)).project(cam));
        if (cs.some(p => p.z > 1 || p.z < -1)) continue;
        const r = { x0: Math.min(...cs.map(p => p.x)), x1: Math.max(...cs.map(p => p.x)), y0: Math.min(...cs.map(p => p.y)), y1: Math.max(...cs.map(p => p.y)) };
        const onScr = r.x1 > -1 && r.x0 < 1 && r.y1 > -1 && r.y0 < 1;
        if (girl.root.visible && onScr && r.x0 < gb.x1 && gb.x0 < r.x1 && r.y0 < gb.y1 && gb.y0 < r.y1) out.signHit.push({ T: +T.toFixed(2), word: s.text });
        if (Math.abs(T - (s.at + 0.1)) < 0.5 / fps) out.textPx.push({ word: s.text, T: +T.toFixed(2), textPct: +((r.y1 - r.y0) / 2 * s.th / s.bh * 100).toFixed(1), inFrame: r.x0 > -1 && r.x1 < 1 && r.y0 > -1 && r.y1 < 1 });
      }
    }
    const merge = a => a.reduce((o, x) => { const l = o[o.length - 1]; if (l && l.word === x.word && x.T - l.to < 0.1) l.to = x.T; else o.push({ word: x.word, from: x.T, to: x.T }); return o; }, []);
    out.signHit = merge(out.signHit);
    return out;
  };
  return shots;
}

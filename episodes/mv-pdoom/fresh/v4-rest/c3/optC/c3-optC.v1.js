// shots/c3-optC.js — 副歌 3 方案 C「图形 / 微缩模型」样片（歌曲 94.778–105.96）。#1061
// 细则：fresh/v4-rest/c3/BRIEF-options-night.md。只是给用户挑方向的低分辨率样片，不合进 final。
//
//   const shots = await makeC3OptC(mv);   mv.mount(shots, { offset: C3C.t0, duration: C3C.end - C3C.t0 });
//
// 一句话：她掉下来，落进桌面上的一座微缩夜城模型里的一间小房间；一枚回形针掉进房间，每 0.16 秒翻一倍，把房间灌满、
//   溢出去一格一格吞掉整座模型城；旁边那格的关机按钮没人管（椅子空着、OUT OF OFFICE）；最后一条引信沿着街道烧向角上那只眼，炸满屏。
//
//   94.78  落：接主歌 3 的正上方俯拍（她仰面下落）；95.42 落进房间，镜头从俯拍转成等距视角拉开——原来下面那座城是个桌面模型
//   95.72  读数牌 P(DOOM) 1.00 → 1.07 → 1.13（红）
//   96.84  as paperclips fill the room：第一枚回形针掉进房间，计数器 1 → 2 → 4 → 8 …，98.4 灌到墙顶，她被顶上去
//   98.82  Killswitch guy's on PTO：横移到旁边一格——玻璃罩下的红按钮、空椅子、沙滩伞、OUT OF OFFICE；100.45 回形针涌进来把它埋了
//  100.72  Now there's nowhere left to go：拉到整座模型城，回形针一圈一圈往外吞，EXIT 灯一盏盏灭；102.02 最后一格
//  102.46  Too late now, we lit the fuse：读数牌 ERR；103.40 引信点着，火花沿街道烧向角上那只柠黄的眼，镜头跟着
//  105.69  炸：白闪，回形针铺满全屏 → 105.96 硬切（桥段的坐标轴）
// 所有 update 都是歌曲时间 T 的纯函数。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { mulberry32 } from '../kits/world.js';
import { createGirl, createGirlLights, loadAnims } from '../kits/girl.js';
import { createDoomReadout } from '../kits/doom-readout.js';
import { clipTexture } from '../kits/doom-scale.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIO = p => { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2; };
const col = c => new THREE.Color(c);
const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k);
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const hash = (a, b = 0) => { let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const FONT = '"UIAnton", "Anton", Impact, sans-serif';

export const C3C = {
  t0: 94.778, end: 105.96,
  land: 95.42, iso: 96.25,
  dial: [[95.72, '1.00'], [96.10, '1.07'], [96.32, '1.13']],
  clip0: 96.84, roomFull: 98.45,                 // 第一枚回形针 / 房间灌满
  kiosk: 98.82, kioskFill: 100.45,
  wide: 100.72, lastTile: 102.02,
  fuse: 102.46, lit: 103.40, boom: 105.687,
};
const TAU = (C3C.roomFull - C3C.clip0) / Math.log2(1400);           // 翻倍时间：≈ 0.16 s
export const ANIMS = ['move__fall-air', 'act__look-around', 'act__terrified'];

// 霓虹字牌（同别的段：墨底 + 灯管边 + 白字），一词一块
function wordPlate(text, color) {
  const c = document.createElement('canvas'), g0 = c.getContext('2d'); g0.font = `170px ${FONT}`;
  c.width = Math.ceil(g0.measureText(text).width) + 110; c.height = 270; const g = c.getContext('2d');
  g.fillStyle = '#0d0c14'; g.fillRect(0, 0, c.width, c.height); g.strokeStyle = color; g.lineWidth = 16; g.strokeRect(8, 8, c.width - 16, c.height - 16);
  g.fillStyle = '#F2EDE4'; g.font = `170px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, c.width / 2, 143);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const mat = new THREE.MeshBasicMaterial({ map: tex, depthTest: false, fog: false });
  return { m: new THREE.Mesh(new THREE.PlaneGeometry(c.width / 270, 1), mat), mat, w: c.width / 270 };
}

export async function makeC3OptC(mv) {
  const { music, lyrics } = mv;
  await loadAnims(ANIMS);
  await new FontFace('UIAnton', `url(${new URL('../../../assets/fonts/anton/Anton-Regular.ttf', import.meta.url)})`).load().then(f => document.fonts.add(f));
  const girl = await createGirl(mv);
  const LINES = lyrics.lines.filter(l => l.start > 95 && l.start < 105.9);

  // ================================================================ 模型城：7 × 7 格的底板，中间一格是「房间」，右边一格是关机岗亭，右后角是那只眼
  const scene = new THREE.Scene(); scene.background = col('#07070d');
  scene.add(new THREE.HemisphereLight('#aab0ff', '#2a1c2e', 0.75), createGirlLights({ key: 1.8, rim: 2.2, fill: 0.6 }));
  const PITCH = 2.6, TS = 2.3, NG = 3, tileXZ = (i, j) => [i * PITCH, j * PITCH];
  { const base = new THREE.Mesh(new THREE.BoxGeometry(PITCH * 7 + 1.2, 0.5, PITCH * 7 + 1.2), new THREE.MeshStandardMaterial({ color: '#12131f', roughness: 0.9 })); base.position.y = -0.27; scene.add(base);   // 模型的底板
    const table = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.MeshBasicMaterial({ color: '#05050a' })); table.rotation.x = -Math.PI / 2; table.position.y = -0.52; scene.add(table);
    const seg = []; for (let k = -3; k <= 4; k++) { const p = (k - 0.5) * PITCH; seg.push(p, 0.005, -3.5 * PITCH, p, 0.005, 3.5 * PITCH, -3.5 * PITCH, 0.005, p, 3.5 * PITCH, 0.005, p); }       // 街道 = 格子之间的霓虹线
    const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3)); scene.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: hdr(PAL.mint, 0.5) }))); }
  const winTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), r = mulberry32(5); g.fillStyle = '#14152a'; g.fillRect(0, 0, 128, 128);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if (r() < 0.55) { g.fillStyle = r() < 0.8 ? '#ffe9b8' : [PAL.lemon, PAL.pink, PAL.mint][Math.floor(r() * 3)]; g.fillRect(x * 16 + 4, y * 16 + 4, 8, 8); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.NearestFilter; return t; })();
  const bldM = new THREE.MeshBasicMaterial({ map: winTex }), roofM = new THREE.MeshBasicMaterial({ color: '#191a2e' });
  const clipTex = clipTexture(11, { size: 512, n: 230, bg: '#4a4c60' }); clipTex.wrapS = clipTex.wrapT = THREE.RepeatWrapping;
  const heapM = () => new THREE.MeshBasicMaterial({ map: clipTex, color: hdr('#ffffff', 1.15) });
  const ROOM_TOP = 1.8, tiles = [], rnd = mulberry32(95);
  for (let i = -NG; i <= NG; i++) for (let j = -NG; j <= NG; j++) {
    const [x, z] = tileXZ(i, j), ring = Math.max(Math.abs(i), Math.abs(j)), special = (i === 0 && j === 0) ? 'room' : (i === 1 && j === 0) ? 'kiosk' : (i === NG && j === -NG) ? 'eye' : null;
    const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
    const pad = new THREE.Mesh(new THREE.BoxGeometry(TS, 0.06, TS), new THREE.MeshStandardMaterial({ color: special ? '#24263f' : '#1b1c2e', roughness: 0.85 })); pad.position.y = 0.03; g.add(pad);
    let top = 0.8;
    if (!special) { const n = 2 + Math.floor(rnd() * 3); for (let k = 0; k < n; k++) { const w = 0.5 + rnd() * 0.6, d = 0.5 + rnd() * 0.6, h = 0.4 + rnd() * rnd() * 1.25; top = Math.max(top, h);
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [bldM, bldM, roofM, roofM, bldM, bldM]); b.position.set((rnd() - 0.5) * (TS - w - 0.1), 0.06 + h / 2, (rnd() - 0.5) * (TS - d - 0.1)); g.add(b); } }
    // 回形针堆：被吞掉时从地面涨起来的一块（贴回形针贴图），高度够盖住这一格的小楼
    const HW = special === 'room' ? TS - 0.12 : TS - 0.15; const heap = new THREE.Mesh(new THREE.BoxGeometry(HW, 1, HW), heapM()); heap.visible = false; g.add(heap);
    // 被吞的时刻：一圈一圈往外（房间 98.45、岗亭 100.45、最后一格 102.02）
    const at = special === 'room' ? C3C.clip0 : special === 'kiosk' ? C3C.kioskFill : special === 'eye' ? 1e9
      : ring === 1 ? ((i + j >= 1) ? lerp(100.58, 100.78, hash(i * 7 + j, 3)) : lerp(99.45, 100.25, hash(i * 7 + j, 3))) : ring === 2 ? lerp(100.95, 101.5, hash(i * 7 + j, 4)) : lerp(101.55, C3C.lastTile, hash(i * 7 + j, 5));
    tiles.push({ i, j, x, z, ring, special, g, heap, at, hmax: special === 'room' ? ROOM_TOP : special === 'kiosk' ? 1.5 : top + 0.14 });
  }
  { const far = tiles.filter(t => t.ring === 3 && !t.special).sort((a, b) => a.at - b.at); far[far.length - 1].at = C3C.lastTile; }   // 最后一格正好落在「go」
  // EXIT 小灯牌：外圈几格上各一块，那一格被吞时灭
  const exits = tiles.filter(t => !t.special && t.ring >= 2 && hash(t.i, t.j * 3 + 1) < 0.3).map(t => { const p = wordPlate('EXIT', '#35d07f'); p.m.scale.setScalar(0.42); p.m.position.set(t.x, 2.1, t.z); p.mat.depthTest = true; scene.add(p.m); return { t, p }; });

  // ---- 房间（中间一格）：地板 + 两面后墙（剖面模型），墙沿是薄荷灯管
  const ROOM_H = 1.7;
  { const wallM = new THREE.MeshStandardMaterial({ color: '#2b2d4a', roughness: 0.8 }), tubeM = new THREE.MeshBasicMaterial({ color: hdr(PAL.mint, 1.8) });
    const wl = new THREE.Mesh(new THREE.BoxGeometry(0.06, ROOM_H, TS), wallM); wl.position.set(-TS / 2, ROOM_H / 2 + 0.06, 0); scene.add(wl);
    const wb = new THREE.Mesh(new THREE.BoxGeometry(TS, ROOM_H, 0.06), wallM); wb.position.set(0, ROOM_H / 2 + 0.06, -TS / 2); scene.add(wb);
    for (const [w, d, x, z] of [[0.05, TS, -TS / 2, 0], [TS, 0.05, 0, -TS / 2]]) { const t = new THREE.Mesh(new THREE.BoxGeometry(w + 0.03, 0.05, d + 0.03), tubeM); t.position.set(x, ROOM_H + 0.09, z); scene.add(t); }
    const desk = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.35, 0.35), new THREE.MeshStandardMaterial({ color: '#3a3c5e' })); desk.position.set(-0.6, 0.24, -0.85); scene.add(desk); }
  // 房间里的回形针：一枚一枚掉进来，数量每 TAU 秒翻一倍
  const NCLIP = 1400;
  const clipGeo = (() => { const L = 0.19, w = 0.06, pts = []; const arc = (cx, cy, r, a0, a1, n) => { for (let k = 0; k <= n; k++) { const a = lerp(a0, a1, k / n); pts.push(V3(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0)); } };
    pts.push(V3(w * 0.55, -L * 0.25, 0)); arc(0, L / 2 - w / 2, w / 2, 0, Math.PI, 6); arc(0, -L / 2 + w / 2, w / 2, Math.PI, 2 * Math.PI, 6); arc(0, L / 2 - w, w * 0.32, 0, Math.PI, 5); pts.push(V3(-w * 0.32, -L * 0.2, 0));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.008, 4); })();
  const clips = new THREE.InstancedMesh(clipGeo, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3, metalness: 0.6 }), NCLIP); clips.frustumCulled = false; scene.add(clips);
  const clipData = (() => { const r = mulberry32(960), d = [], cs = ['#d9d9e2', '#c4c4cf', '#eeeef4', '#d9d9e2', PAL.pink, PAL.mint, PAL.lemon];
    for (let i = 0; i < NCLIP; i++) { const lvl = ROOM_H * (i / NCLIP) ** 0.9; d.push({ at: C3C.clip0 + TAU * Math.log2(i + 1), p: V3((r() - 0.5) * (TS - 0.3), 0.08 + lvl, (r() - 0.5) * (TS - 0.3)), e: new THREE.Euler(r() * 6.28, r() * 6.28, r() * 6.28) });
      clips.setColorAt(i, col(cs[r() < 0.82 ? Math.floor(r() * 4) : 4 + Math.floor(r() * 3)])); } return d; })();
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = V3(), ZERO = new THREE.Matrix4().makeScale(0, 0, 0);
  const countAt = T => (T < C3C.clip0 ? 0 : Math.pow(2, (T - C3C.clip0) / TAU));
  const pileAt = T => ROOM_H * clamp(countAt(T) / NCLIP) ** 0.9;        // 房间里回形针堆的高度

  // ---- 关机岗亭（右边一格）：玻璃罩下的红按钮、空椅子、沙滩伞、OUT OF OFFICE
  const [KX] = tileXZ(1, 0);
  const btnM = new THREE.MeshBasicMaterial({ color: hdr('#ff2e3a', 1.6) });
  { const std = c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6 }), add = (geo, m, x, y, z, ry = 0, rz = 0) => { const o = new THREE.Mesh(geo, m); o.position.set(KX + x, y, z); o.rotation.set(0, ry, rz); scene.add(o); return o; };
    add(new THREE.BoxGeometry(0.7, 0.5, 0.7), std('#34365a'), -0.45, 0.31, -0.3); add(new THREE.SphereGeometry(0.2, 20, 12, 0, 6.3, 0, Math.PI / 2), btnM, -0.45, 0.56, -0.3);
    add(new THREE.SphereGeometry(0.36, 24, 14, 0, 6.3, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#cfe8ff', transparent: true, opacity: 0.22, roughness: 0.05 }), -0.45, 0.56, -0.3);
    add(new THREE.BoxGeometry(0.42, 0.06, 0.42), std('#8a8fa0'), 0.45, 0.42, 0.25, 0.5); add(new THREE.BoxGeometry(0.42, 0.5, 0.06), std('#8a8fa0'), 0.36, 0.7, 0.06, 0.5); add(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8), std('#5a5f70'), 0.45, 0.22, 0.25);   // 空椅子
    add(new THREE.CylinderGeometry(0.015, 0.015, 1.2, 6), std('#fff3e6'), 0.75, 0.65, -0.55, 0, 0.18); add(new THREE.ConeGeometry(0.5, 0.22, 10), std(PAL.lemon), 0.64, 1.3, -0.55, 0, 0.18);             // 沙滩伞
    const s1 = wordPlate('OUT OF OFFICE', PAL.lemon); s1.m.scale.setScalar(0.4); s1.m.position.set(KX + 0.55, 2.0, -0.75); s1.mat.depthTest = true; s1.m.rotation.y = Math.PI / 4; scene.add(s1.m);
    const s2 = wordPlate('KILL SWITCH', '#ff2e3a'); s2.m.scale.setScalar(0.3); s2.m.position.set(KX - 0.75, 1.3, -0.3); s2.mat.depthTest = true; s2.m.rotation.y = Math.PI / 4; scene.add(s2.m); }

  // ---- 引信：沿街道从房间角上一路到右后角那只眼
  const [EX, EZ] = tileXZ(NG, -NG);
  const FY = 2.15;                                                    // 引信架在回形针堆顶的高度上，顺着街道走（俯看就是地图上的一条线）
  const FUSE = [V3(1.3, FY, 1.3), V3(1.3, FY, -3.9), V3(6.5, FY, -3.9), V3(6.5, FY, -6.5), V3(EX - 0.5, 2.3, EZ + 0.5)];
  const fuseLen = FUSE.slice(1).map((p, k) => p.distanceTo(FUSE[k])), FL = fuseLen.reduce((a, b) => a + b, 0);
  const fuseAt = u => { let d = clamp(u) * FL; for (let k = 0; k < fuseLen.length; k++) { if (d <= fuseLen[k] || k === fuseLen.length - 1) return FUSE[k].clone().lerp(FUSE[k + 1], clamp(d / fuseLen[k])); d -= fuseLen[k]; } };
  const NF = Math.ceil(FL / 0.16), fuse = new THREE.InstancedMesh(new THREE.BoxGeometry(0.13, 0.13, 0.13), new THREE.MeshBasicMaterial({ color: '#ffffff' }), NF); fuse.frustumCulled = false; scene.add(fuse);
  const fuseP = Array.from({ length: NF }, (_, i) => fuseAt((i + 0.5) / NF)), FUSE_ON = hdr(PAL.lemon, 1.5), FUSE_BURNT = col('#3a1a12');
  const ringM = new THREE.MeshBasicMaterial({ color: hdr('#ffffff', 2), transparent: true, depthWrite: false }), landRing = new THREE.Mesh(new THREE.RingGeometry(0.82, 1, 48), ringM); landRing.rotation.x = -Math.PI / 2; landRing.position.set(0.1, 0.09, 0.2); scene.add(landRing);
  const spark = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 8), new THREE.MeshBasicMaterial({ color: hdr('#fff0b0', 5) })); scene.add(spark);
  const sparkL = new THREE.PointLight('#ffb040', 0, 7, 1.5); scene.add(sparkL);
  const sparks = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: hdr('#ffd070', 3), size: 0.14, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); sparks.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(40 * 3), 3)); sparks.frustumCulled = false; scene.add(sparks);
  // 角上那只眼（全片同一只：柠黄同心环）
  const eyeM = new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 0.5) });
  { const tw = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.6, 1.5), new THREE.MeshStandardMaterial({ color: '#191a2b' })); tw.position.set(EX, 0.86, EZ); scene.add(tw);
    const eye = new THREE.Group(); eye.position.set(EX, 2.6, EZ); eye.lookAt(EX + 1, 2.6 + 1.6, EZ + 1); scene.add(eye);          // 朝斜上方：等距和俯看都看得见
    for (const r of [0.28, 0.6, 0.9]) eye.add(new THREE.Mesh(r === 0.28 ? new THREE.CircleGeometry(r, 32) : new THREE.RingGeometry(r - 0.065, r + 0.065, 48), eyeM)); }

  // ---- 读数牌（P(DOOM)，同 c4 那块）：立在房间后面
  const readout = await createDoomReadout({ height: 1.25, pole: true }); readout.group.position.set(-1.95, 1.45, 1.95); readout.setPole(0); readout.group.rotation.y = Math.PI / 4; scene.add(readout.group);

  // ---- 相机上的层：歌词字牌（画面下沿一排，逐词亮）、回形针计数器（左上）、最后铺满全屏的回形针
  const cam = new THREE.PerspectiveCamera(24, mv.width / mv.height, 0.05, 400); scene.add(cam);
  const hud = new THREE.Group(); cam.add(hud);                       // hud 在镜头前 1 个单位；每帧按 fov 缩放，下面的坐标就是「画高 = 2」的屏幕坐标
  const lyricRows = LINES.map((ln, n) => { const g = new THREE.Group(), color = [PAL.pink, PAL.mint, PAL.lemon][n % 3], ps = ln.words.map(w => { const p = wordPlate(w.w.replace(/[,.]/g, '').toUpperCase(), color); p.at = w.start; return p; });
    const gap = 0.12, total = ps.reduce((a, p) => a + p.w, 0) + gap * (ps.length - 1); let x = -total / 2; for (const p of ps) { p.m.position.x = x + p.w / 2; x += p.w + gap; g.add(p.m); p.m.renderOrder = 50; }
    g.scale.setScalar(Math.min(0.2, 3.2 / total)); g.position.set(0, -0.8, 0); g.visible = false; hud.add(g); return { ln, g, ps }; });
  const cnt = (() => { const c = document.createElement('canvas'); c.width = 1024; c.height = 300; const g = c.getContext('2d'); const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.293), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthTest: false })); m.position.set(-1.2, 0.76, 0); m.renderOrder = 50; hud.add(m);
    let key = '';
    const fmt = n => { if (n < 1e7) return Math.floor(n).toLocaleString('en-US'); const e = Math.floor(Math.log10(n)); return (n / 10 ** e).toFixed(1) + ' × 10' + String(e).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join(''); };
    return { m, draw(T) { const n = countAt(T), s = n < 1 ? '0' : fmt(n); if (s === key) return; key = s; g.clearRect(0, 0, 1024, 300);
      g.fillStyle = 'rgba(13,12,20,.88)'; g.fillRect(0, 0, 1024, 300); g.strokeStyle = PAL.mint; g.lineWidth = 10; g.strokeRect(5, 5, 1014, 290);
      g.textBaseline = 'middle'; g.textAlign = 'left'; g.fillStyle = PAL.mint; g.font = `74px ${FONT}`; g.fillText('PAPERCLIPS', 40, 70); g.fillStyle = '#F2EDE4'; g.font = `170px ${FONT}`; g.fillText(s, 40, 200); tex.needsUpdate = true; } }; })();
  const fullTex = clipTexture(23, { size: 1024, n: 420, bg: '#0d0c14' });
  const full = new THREE.Mesh(new THREE.PlaneGeometry(2 * 16 / 9, 2), new THREE.MeshBasicMaterial({ map: fullTex, transparent: true, depthTest: false, opacity: 0 })); full.renderOrder = 60; hud.add(full);

  // ================================================================ 镜头：等距方向固定，只换看哪里、离多远
  const ISO = V3(1, 1.05, 1).normalize(), STEEP = V3(0.45, 1.5, 0.45).normalize();
  const KEYS = [   // [T, 目标 x, y, z, 距离]
    [C3C.iso, 0, 0.8, 0, 12], [98.6, 0.1, 1.0, 0, 13], [99.4, KX + 0.2, 0.7, 0, 8.5], [100.62, KX + 0.2, 0.7, 0, 8], [101.45, 0, -1.2, 0, 39], [C3C.fuse, 0, -1.2, 0, 38], [103.25, 1.3, FY, 0.6, 15]];
  function isoCam(T) {
    let k = 0; while (k < KEYS.length - 2 && T >= KEYS[k + 1][0]) k++;
    const a = KEYS[k], b = KEYS[k + 1], p = eIO((T - a[0]) / (b[0] - a[0])), tg = V3(lerp(a[1], b[1], p), lerp(a[2], b[2], p), lerp(a[3], b[3], p)); let dist = lerp(a[4], b[4], p);
    const dir = ISO.clone().lerp(STEEP, smooth((T - C3C.fuse) / 0.8)).normalize();                                   // 引信段：抬高成俯看，街道变成地图
    if (T >= C3C.lit) { const u = sparkU(T), f = smooth((T - C3C.lit) / 0.5), sp = fuseAt(Math.min(1, u + 0.06)); tg.lerp(sp, f); dist = lerp(dist, lerp(15, 11.5, u), f); }      // 点着以后镜头跟着火花
    return { pos: tg.clone().addScaledVector(dir, dist), tg };
  }
  const sparkU = T => clamp((T - C3C.lit) / (C3C.boom - 0.05 - C3C.lit)) ** 1.25;
  const FALL = [{ t: 90, anim: 'move__fall-air' }], STAND = [{ t: C3C.land - 0.3, anim: 'act__look-around' }, { t: 97.3, anim: 'act__terrified' }]; STAND.fade = 0.2;
  const camA = new THREE.PerspectiveCamera(), camB = new THREE.PerspectiveCamera();

  const shot = { id: 'c3-optC', t0: C3C.t0, t1: C3C.end + 0.2, transitionIn: { kind: 'cut' }, build: () => ({}), update(_, T) {
    // ---- 她：94.78 仰面下落（入口规格：正上方 8.7、fov 32、up = −Z、14 /s）→ 95.42 落进房间 → 站着四处看 → 被回形针顶上去
    const falling = T < C3C.land, herY = falling ? (C3C.land - T) * 14 : Math.max(0.06, ROOM_TOP * clamp(countAt(T) / NCLIP) ** 0.9 - 0.06 - 0.4 * (1 - smooth((T - 98.0) / 0.5)));
    scene.add(girl.root); girl.root.scale.setScalar(1); girl.root.visible = T < C3C.boom;
    if (falling) { girl.root.position.set(0, herY, 0.5); girl.root.rotation.set(-Math.PI / 2, 0, 0); girl.play(FALL, T); }     // 放平：脸朝上、头朝 −Z
    else { girl.root.position.set(0.1, herY, 0.2); girl.root.rotation.set(0, Math.PI / 4, 0); girl.play(STAND, T); }
    girl.setSkin('toon', T);
    // ---- 镜头：俯拍跟着她掉 → 落地后转成等距视角
    camA.position.set(0, (falling ? herY : 0.06) + 8.7, 0.1); camA.up.set(0, 0, -1); camA.lookAt(0, 0, 0.1); camA.updateMatrixWorld(true);
    const I = isoCam(Math.max(T, C3C.iso)); camB.position.copy(I.pos); camB.up.set(0, 1, 0); camB.lookAt(I.tg); camB.updateMatrixWorld(true);
    const p = eIO((T - C3C.land + 0.12) / (C3C.iso - C3C.land + 0.12));
    cam.position.copy(camA.position).lerp(camB.position, p); cam.quaternion.copy(camA.quaternion).slerp(camB.quaternion, p); cam.fov = lerp(32, 24, p);
    const shake = T >= C3C.boom ? 0.25 * Math.exp(-(T - C3C.boom) * 6) * Math.sin(T * 90) : 0; cam.position.y += shake;
    cam.updateProjectionMatrix(); cam.updateMatrixWorld(true); hud.scale.setScalar(Math.tan(cam.fov * Math.PI / 360)); hud.position.set(0, 0, -1);
    scene.updateMatrixWorld(true); girl.face?.update(T, { expression: T > 97.3 ? 'surprised' : 'neutral' });
    { const a = T - C3C.land; landRing.visible = a >= 0 && a < 0.45; landRing.scale.setScalar(0.2 + 1.1 * eOut(a / 0.45)); ringM.opacity = 1 - clamp(a / 0.45); }
    // ---- 房间里的回形针
    for (let i = 0; i < NCLIP; i++) { const d = clipData[i], a = T - d.at; if (a < 0) { clips.setMatrixAt(i, ZERO); continue; }
      const f = clamp(a / 0.22); _m.compose(_s.copy(d.p).setY(d.p.y + 3 * (1 - f * f)), _q.setFromEuler(d.e), V3(1, 1, 1)); clips.setMatrixAt(i, _m); }
    clips.instanceMatrix.needsUpdate = true; if (clips.instanceColor) clips.instanceColor.needsUpdate = true;
    // ---- 每一格被吞：回形针堆从地面涨起来；EXIT 灭
    for (const t of tiles) { const a = T - t.at; t.heap.visible = a > 0 && (t.special !== 'room' || countAt(T) > 90); if (a > 0) { const h = t.special === 'room' ? Math.max(0.01, ROOM_TOP * clamp(countAt(T) / NCLIP) ** 0.9 - 0.1) : t.hmax * eOut(a / 0.35); t.heap.scale.y = h; t.heap.position.y = h / 2 + 0.06;  } }
    for (const e of exits) e.p.mat.color.setScalar(T >= e.t.at ? 0.08 : 1.2 + 0.3 * Math.sin(T * 6 + e.t.i));
    btnM.color.copy(hdr('#ff2e3a', 1.2 + 0.8 * (0.5 + 0.5 * Math.sin(T * 8))));
    // ---- 读数牌、计数器、歌词
    const dv = C3C.dial.reduce((v, [t, s]) => (T >= t ? s : v), '0.99');
    readout.update(T, { text: T >= C3C.fuse ? 'ERR' : dv, lit: 1, alarm: T >= C3C.dial[2][0] ? 1 : 0 });
    cnt.m.visible = T >= C3C.clip0 - 0.3 && T < C3C.boom; cnt.draw(T);
    for (const r of lyricRows) { r.g.visible = T >= r.ln.start - 0.15 && T < Math.min(C3C.boom, r.ln.end + 0.35) && !lyricRows.some(o => o !== r && o.ln.start > r.ln.start && T >= o.ln.start - 0.15);
      for (const q of r.ps) { const a = T - q.at; q.mat.color.setScalar(a >= 0 ? 1.15 + 1.4 * Math.exp(-a / 0.3) : 0.25); } }
    // ---- 引信和火花
    const lit = T >= C3C.lit, u = sparkU(T), sp = fuseAt(u);
    { const drawn = clamp((T - C3C.fuse) / 0.7) * NF, burnt = u * NF;                                   // 引信：102.46 起从她脚边画到那只眼；烧过的变黑变细
      for (let i = 0; i < NF; i++) { if (i >= drawn) { fuse.setMatrixAt(i, ZERO); continue; } const k = i < burnt ? 0.45 : 1; _m.makeScale(k, k, k).setPosition(fuseP[i]); fuse.setMatrixAt(i, _m); fuse.setColorAt(i, i < burnt ? FUSE_BURNT : FUSE_ON); }
      fuse.instanceMatrix.needsUpdate = true; if (fuse.instanceColor) fuse.instanceColor.needsUpdate = true; }
    spark.visible = lit && T < C3C.boom; spark.position.copy(sp); spark.scale.setScalar(1 + 0.4 * Math.sin(T * 60)); sparkL.position.copy(sp).add(V3(0, 0.5, 0)); sparkL.intensity = spark.visible ? 6 : 0;
    { const P = sparks.geometry.attributes.position; sparks.visible = spark.visible; for (let i = 0; i < 40; i++) { const ph = (T * 3 + hash(i, 9)) % 1, a = hash(i, 1) * 6.28, r = ph * 0.7; P.setXYZ(i, sp.x + Math.cos(a) * r, sp.y + ph * (0.9 - ph) * 2.2 * hash(i, 2), sp.z + Math.sin(a) * r); } P.needsUpdate = true; }
    eyeM.color.copy(hdr(PAL.lemon, 0.5 + 2.5 * (lit ? u * u : 0)));
    // ---- 炸：白闪 + 回形针铺满全屏
    const b = T - C3C.boom; full.material.opacity = b > 0 ? smooth(b / 0.1) : 0; full.scale.setScalar(b > 0 ? lerp(1.6, 1.05, eOut(b / 0.25)) : 1);
    const flashLit = Math.abs(T - C3C.lit) < 0.2 ? 0.35 * Math.exp(-Math.abs(T - C3C.lit) / 0.06) : 0;
    return { scene, camera: cam, post: { bloom: { strength: 0.75, threshold: 1.0, radius: 0.8 }, chroma: 0.05 + (b > 0 ? 0.4 * Math.exp(-b * 6) : 0), grade: { vignette: 0.3 },
      flash: b > 0 ? { amount: 0.9 * Math.exp(-b / 0.08), color: '#fff3c0' } : flashLit } };
  } };
  return [shot];
}

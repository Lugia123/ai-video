// kits/room.js —— 她的卧室（全片复用）+ 她的手机（粉色手机壳 / 贴纸 / 挂件 / 玻璃反光）+ 握手机的手。
//
//   import { createRoom, createPhone, createHands, portraitCard, imageCard } from '../kits/room.js';
//   const room = createRoom();                 scene.add(room.group)     // 单位：米；地面 y=0，房间 x,z ∈ [-3, 3]，高 2.8
//   const phone = createPhone(surface);        // surface = ui.surface(720,1280)（竖）或 (1280,720)（横）；返回 { group, screen, size, depth, ... }（和 ui.device 同形，能直接喂 transit.intoScreen）
//   phone.group.add(createHands(phone).group)  // 两只手从左右握住手机（手背 / 袖口是她的粉色外套）
//   每帧：room.update(T, { screen: { pos, color, k } })   —— 屏幕光：点光源放在手机屏前，颜色 = 屏幕内容的平均色（screenColor(surface)）
//        phone.update(T, camera)                        —— 挂件摆动、玻璃反光跟机位走
//
// 规矩（#937）：夜里，唯一的光 = 手机屏 + 窗外霓虹（粉 / 青，偶尔闪一下）；任何拉远看到屏幕的镜头，屏幕外都是这个房间。
// 布局：床靠后墙（z = -3）放在左边，她趴在床尾（头朝 +z），窗在前墙（z = +3），窗下是书桌；窗外是虚化的城市灯（bokeh）。
//   anchors.face    她（趴着）脸的位置；anchors.phoneHeld 她手里手机的位置；anchors.pov 她眼睛的位置（手持第一人称机位）
// 全部是 T 的纯函数；随机只用种子 hash。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
function hash(a, b = 0) { let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0, ...o });
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}
function box(w, h, d, mat, x, y, z, parent) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); parent?.add(m); return m; }
function roundRectShape(w, h, r) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2); s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r); s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); s.lineTo(-w / 2, -h / 2 + r); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return s;
}

// 屏幕内容的平均色（缩到 4×4 取平均）；返回线性色 THREE.Color，亮度拉到固定水平（颜色随内容变，强度另给）
const _sc = document.createElement('canvas'); _sc.width = _sc.height = 4;
const _sx = _sc.getContext('2d', { willReadFrequently: true });
export function screenColor(surface, out = new THREE.Color()) {
  _sx.clearRect(0, 0, 4, 4); _sx.drawImage(surface.canvas, 0, 0, 4, 4);
  const d = _sx.getImageData(0, 0, 4, 4).data;
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < 64; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
  out.setRGB(r / 4080, g / 4080, b / 4080, THREE.SRGBColorSpace);
  const m = Math.max(out.r, out.g, out.b, 1e-3);
  return out.multiplyScalar(1 / m).lerp(new THREE.Color(1, 1, 1), 0.25);   // 归一化：纯白屏 → 白，纸白 → 暖白，粉 → 粉
}

// ================================================================ 窗外虚化城市灯
function bokehTexture(seed = 3) {
  return canvasTex(1024, 512, (x, W, H) => {
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#070a22'); g.addColorStop(0.6, '#1a1036'); g.addColorStop(1, '#2a1238');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    // 虚化的楼影
    x.filter = 'blur(10px)';
    for (let i = 0; i < 14; i++) {
      const bw = 50 + 110 * hash(seed, i), bh = 120 + 300 * hash(seed + 1, i), bx = hash(seed + 2, i) * W;
      x.fillStyle = `rgba(${10 + 20 * hash(i, 4)},${8 + 10 * hash(i, 5)},${30 + 30 * hash(i, 6)},0.9)`; x.fillRect(bx, H - bh, bw, bh);
    }
    // 一块模糊的粉色霓虹招牌
    x.fillStyle = 'rgba(255,60,150,0.85)'; x.fillRect(W * 0.62, H * 0.3, 150, 34); x.fillStyle = 'rgba(80,230,255,0.8)'; x.fillRect(W * 0.2, H * 0.42, 34, 120);
    x.filter = 'none';
    // 光斑
    const cols = ['255,210,140', '255,94,168', '111,240,255', '255,240,220', '255,180,90'];
    for (let i = 0; i < 90; i++) {
      const r = 6 + 34 * hash(seed + 7, i) ** 2, bx = hash(seed + 8, i) * W, by = H * (0.25 + 0.75 * hash(seed + 9, i));
      const c = cols[Math.floor(hash(seed + 10, i) * cols.length)], a = 0.25 + 0.55 * hash(seed + 11, i);
      const rg = x.createRadialGradient(bx, by, 0, bx, by, r);
      rg.addColorStop(0, `rgba(${c},${a})`); rg.addColorStop(0.75, `rgba(${c},${a * 0.8})`); rg.addColorStop(1, `rgba(${c},0)`);
      x.fillStyle = rg; x.beginPath(); x.arc(bx, by, r, 0, 7); x.fill();
    }
  });
}

function poster(kind) {
  return canvasTex(256, 360, (x, W, H) => {
    if (kind === 0) {   // 夜空 + 月亮
      x.fillStyle = '#1d2a5a'; x.fillRect(0, 0, W, H);
      x.fillStyle = '#ffe6a8'; x.beginPath(); x.arc(160, 120, 56, 0, 7); x.fill();
      x.fillStyle = '#1d2a5a'; x.beginPath(); x.arc(186, 104, 50, 0, 7); x.fill();
      x.fillStyle = '#ff7eb6'; x.fillRect(0, 280, W, 80);
      x.fillStyle = '#fff'; x.font = 'bold 30px sans-serif'; x.fillText('LOFI', 24, 330);
    } else if (kind === 1) {   // 几何海报
      x.fillStyle = '#ffd35c'; x.fillRect(0, 0, W, H);
      x.fillStyle = '#ff5ea8'; x.beginPath(); x.arc(128, 150, 90, 0, 7); x.fill();
      x.fillStyle = '#2a1f4a'; x.fillRect(40, 250, 176, 16); x.fillRect(40, 280, 120, 16);
    } else {   // 薄荷色格子 + 心
      x.fillStyle = '#8ff5dc'; x.fillRect(0, 0, W, H);
      x.strokeStyle = 'rgba(40,30,70,0.25)'; x.lineWidth = 3; for (let i = 0; i < W; i += 32) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, H); x.stroke(); }
      x.fillStyle = '#ff5ea8'; x.beginPath(); x.moveTo(128, 250); x.bezierCurveTo(20, 170, 70, 80, 128, 140); x.bezierCurveTo(186, 80, 236, 170, 128, 250); x.fill();
    }
    x.strokeStyle = '#fff'; x.lineWidth = 10; x.strokeRect(0, 0, W, H);
  });
}

// 布料：细分平面按折痕起伏，四周垂下去（盖在床上的被子）
function drapeGeometry(w, d, drop, { seed = 1, folds = 0.035 } = {}) {
  const W = w + drop * 2, D = d + drop;
  const g = new THREE.PlaneGeometry(W, D, 60, 50); g.rotateX(-Math.PI / 2);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i) + D / 2 - drop;       // z: -drop..d（前沿垂下），x: ±(w/2+drop)
    let y = folds * (Math.sin(x * 7 + seed) * Math.sin(z * 3.1 + seed * 2) + 0.6 * Math.sin(x * 13 + z * 5 + seed));
    let X = x, Z = z;
    const ox = Math.abs(x) - w / 2; if (ox > 0) { y -= ox; X = Math.sign(x) * (w / 2 + 0.03 * Math.sin(ox * 9 + z * 4)); }
    if (z < 0) { y -= -z; Z = -0.03 * Math.sin(x * 6); }
    p.setXYZ(i, X, y, Z - D / 2 + drop);
  }
  g.computeVertexNormals();
  return g;
}
function pillowGeometry(w, h, d) {
  const g = new THREE.SphereGeometry(1, 32, 20); const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const sq = 1 - 0.35 * y * y;                             // 中间鼓、边缘扁
    x = Math.sign(x) * Math.abs(x) ** 0.6; z = Math.sign(z) * Math.abs(z) ** 0.6;
    p.setXYZ(i, x * w / 2, y * h / 2 * (0.6 + 0.4 * (1 - Math.max(Math.abs(x), Math.abs(z)) ** 4)), z * d / 2 * sq);
  }
  g.computeVertexNormals(); return g;
}

// ================================================================ 房间
export function createRoom({ seed = 3 } = {}) {
  const group = new THREE.Group();
  const RW = 6, RD = 6, RH = 2.8;
  const wallM = std('#3a3252', { roughness: 0.95 });
  // 地板（木纹）
  const floorTex = canvasTex(512, 512, (x, W, H) => {
    x.fillStyle = '#4a3434'; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 16; i++) { x.fillStyle = `rgba(${60 + 30 * hash(i, 1)},${40 + 16 * hash(i, 2)},${40 + 12 * hash(i, 3)},1)`; x.fillRect(0, i * 32, W, 30); x.fillStyle = 'rgba(0,0,0,0.35)'; x.fillRect(hash(i, 4) * W, i * 32, 3, 32); }
  });
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(3, 3);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(RW, RD), std('#ffffff', { map: floorTex, roughness: 0.55 })); floor.rotation.x = -Math.PI / 2; group.add(floor);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(RW, RD), wallM); ceil.rotation.x = Math.PI / 2; ceil.position.y = RH; group.add(ceil);
  // 墙：后 / 左 / 右整面，前墙开窗
  const back = new THREE.Mesh(new THREE.PlaneGeometry(RW, RH), wallM); back.position.set(0, RH / 2, -RD / 2); group.add(back);
  const left = new THREE.Mesh(new THREE.PlaneGeometry(RD, RH), wallM); left.rotation.y = Math.PI / 2; left.position.set(-RW / 2, RH / 2, 0); group.add(left);
  const right = new THREE.Mesh(new THREE.PlaneGeometry(RD, RH), wallM); right.rotation.y = -Math.PI / 2; right.position.set(RW / 2, RH / 2, 0); group.add(right);
  const WIN = { x0: -1.7, x1: 0.9, y0: 0.85, y1: 2.35 };
  const fz = RD / 2, frontM = wallM;
  const fw = (x0, x1, y0, y1) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, y1 - y0), frontM); m.rotation.y = Math.PI; m.position.set((x0 + x1) / 2, (y0 + y1) / 2, fz); group.add(m); };
  fw(-RW / 2, WIN.x0, 0, RH); fw(WIN.x1, RW / 2, 0, RH); fw(WIN.x0, WIN.x1, 0, WIN.y0); fw(WIN.x0, WIN.x1, WIN.y1, RH);
  // 踢脚线
  const skirtM = std('#2a2238');
  box(RW, 0.08, 0.02, skirtM, 0, 0.04, -RD / 2 + 0.01, group); box(0.02, 0.08, RD, skirtM, -RW / 2 + 0.01, 0.04, 0, group); box(0.02, 0.08, RD, skirtM, RW / 2 - 0.01, 0.04, 0, group);
  // 窗：窗框 + 十字棂 + 窗外 bokeh（窗后 1.2 m 的一块自发光板）+ 窗帘
  const frameM = std('#d9d2e6', { roughness: 0.6 });
  const wx = (WIN.x0 + WIN.x1) / 2, wy = (WIN.y0 + WIN.y1) / 2, ww = WIN.x1 - WIN.x0, wh = WIN.y1 - WIN.y0;
  box(ww + 0.1, 0.06, 0.12, frameM, wx, WIN.y0, fz - 0.02, group); box(ww + 0.1, 0.06, 0.12, frameM, wx, WIN.y1, fz - 0.02, group);
  box(0.06, wh, 0.12, frameM, WIN.x0, wy, fz - 0.02, group); box(0.06, wh, 0.12, frameM, WIN.x1, wy, fz - 0.02, group);
  box(0.04, wh, 0.06, frameM, wx, wy, fz - 0.01, group); box(ww, 0.04, 0.06, frameM, wx, wy + 0.1, fz - 0.01, group);
  box(ww + 0.3, 0.05, 0.22, frameM, wx, WIN.y0 - 0.03, fz - 0.1, group);   // 窗台
  const bokeh = new THREE.Mesh(new THREE.PlaneGeometry(ww * 2.4, wh * 2.2), new THREE.MeshBasicMaterial({ map: bokehTexture(seed), color: new THREE.Color(1.5, 1.5, 1.5) }));
  bokeh.rotation.y = Math.PI; bokeh.position.set(wx, wy + 0.2, fz + 1.2); group.add(bokeh);
  const curtainM = std('#6a3f7a', { roughness: 0.9, side: THREE.DoubleSide });
  for (const s of [-1, 1]) {
    const g = new THREE.PlaneGeometry(0.55, RH - 0.25, 40, 1), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) p.setZ(i, 0.04 * Math.sin(p.getX(i) * 38 + s));
    g.computeVertexNormals();
    const c = new THREE.Mesh(g, curtainM); c.rotation.y = Math.PI; c.position.set(s < 0 ? WIN.x0 - 0.12 : WIN.x1 + 0.12, (RH - 0.25) / 2 + 0.05, fz - 0.14); group.add(c);
  }
  box(ww + 1.4, 0.03, 0.03, std('#1c1626', { metalness: 0.6, roughness: 0.4 }), wx, RH - 0.15, fz - 0.14, group);

  // 床：床架 + 床头板 + 床垫 + 床单 + 被子 + 两个枕头 + 她抱着的枕头 + 公仔
  const BED = { x: -0.9, z0: -3, z1: -0.85, w: 1.5, top: 0.55 };
  const bz = (BED.z0 + BED.z1) / 2, bd = BED.z1 - BED.z0;
  const woodM = std('#5a4050', { roughness: 0.7 });
  box(BED.w + 0.1, 0.25, bd + 0.05, woodM, BED.x, 0.17, bz, group);
  box(BED.w + 0.1, 1.0, 0.06, woodM, BED.x, 0.5, BED.z0 + 0.03, group);
  const mattress = new THREE.Mesh(new THREE.BoxGeometry(BED.w, 0.26, bd - 0.04, 4, 1, 4), std('#efe8f4', { roughness: 0.9 })); mattress.position.set(BED.x, BED.top - 0.13, bz); group.add(mattress);
  const blanket = new THREE.Mesh(drapeGeometry(BED.w, bd * 0.55, 0.26, { seed }), std('#f39cc6', { roughness: 0.95, side: THREE.DoubleSide }));
  blanket.position.set(BED.x, BED.top + 0.05, BED.z1 - bd * 0.55 / 2 - 0.02); blanket.rotation.y = Math.PI; group.add(blanket);
  const pillowM = std('#fff1c6', { roughness: 0.95 }), pillowM2 = std('#b9e9ff', { roughness: 0.95 });
  const pil = (m, x, y, z, ry, s = 1) => { const p = new THREE.Mesh(pillowGeometry(0.6 * s, 0.18 * s, 0.4 * s), m); p.position.set(x, y, z); p.rotation.y = ry; group.add(p); return p; };
  pil(pillowM, BED.x - 0.35, BED.top + 0.1, BED.z0 + 0.3, 0.08); pil(pillowM2, BED.x + 0.35, BED.top + 0.1, BED.z0 + 0.32, -0.1);
  // 她趴着抱在胸前的枕头：挡住立绘的下沿
  const hug = pil(std('#ffd35c', { roughness: 0.95 }), BED.x + 0.02, BED.top + 0.1, BED.z1 - 0.2, 0.05, 1.25);
  // 公仔（小熊）
  const bear = new THREE.Group(), bearM = std('#c89a78');
  const sph = (r, x, y, z, m = bearM) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), m); s.position.set(x, y, z); bear.add(s); return s; };
  sph(0.11, 0, 0.1, 0); sph(0.085, 0, 0.26, 0.01); sph(0.035, -0.07, 0.33, 0); sph(0.035, 0.07, 0.33, 0); sph(0.03, 0, 0.24, 0.085, std('#f2dcc8'));
  bear.position.set(BED.x + 0.6, BED.top + 0.02, BED.z0 + 0.62); bear.rotation.y = -0.5; group.add(bear);
  // 床头墙上的一串拍立得 + 小夹子
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 1.8, 6), std('#d8c8e8')); cord.rotation.z = Math.PI / 2; cord.position.set(BED.x, 1.62, -RD / 2 + 0.02); group.add(cord);
  for (let i = 0; i < 6; i++) {
    const tex = canvasTex(64, 76, (x, W, H) => { x.fillStyle = '#f6f2ea'; x.fillRect(0, 0, W, H); x.fillStyle = ['#ff7eb6', '#8ff5dc', '#ffd35c', '#9aa8ff', '#ff9f7a', '#c69cff'][i]; x.fillRect(6, 6, W - 12, H - 24); });
    const ph = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.155), std('#ffffff', { map: tex, roughness: 0.6 }));
    ph.position.set(BED.x - 0.75 + i * 0.3, 1.52 - 0.02 * Math.sin(i * 1.7), -RD / 2 + 0.025); ph.rotation.z = (hash(seed, i) - 0.5) * 0.3; group.add(ph);
  }
  // 左墙海报
  [[-1.8, 1.55, 0], [-0.9, 1.7, 1], [0.1, 1.5, 2]].forEach(([z, y, k]) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.7), std('#ffffff', { map: poster(k), roughness: 0.7 })); m.rotation.y = Math.PI / 2; m.position.set(-RW / 2 + 0.01, y, z); m.rotation.z = (k - 1) * 0.03; group.add(m); });
  // 床头柜 + 小夜灯（关着）
  box(0.45, 0.5, 0.4, woodM, BED.x + BED.w / 2 + 0.35, 0.25, BED.z0 + 0.25, group);
  // 书桌（窗下右侧）+ 椅子 + 桌上东西
  const deskM = std('#7a5a48', { roughness: 0.6 }), DK = { x: 1.8, z: 2.55, top: 0.75 };
  box(1.5, 0.04, 0.7, deskM, DK.x, DK.top, DK.z, group);
  for (const [dx, dz] of [[-0.7, -0.3], [0.7, -0.3], [-0.7, 0.3], [0.7, 0.3]]) box(0.04, DK.top, 0.04, deskM, DK.x + dx, DK.top / 2, DK.z + dz, group);
  box(0.36, 0.02, 0.26, std('#c9c4d6', { metalness: 0.7, roughness: 0.3 }), DK.x - 0.3, DK.top + 0.03, DK.z, group);   // 合上的笔记本
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.1, 20), std('#ff7eb6')); mug.position.set(DK.x + 0.15, DK.top + 0.07, DK.z - 0.1); group.add(mug);
  [['#8ff5dc', 0.05], ['#ffd35c', 0.09], ['#9aa8ff', 0.13]].forEach(([c, y], i) => box(0.24 - i * 0.02, 0.04, 0.17, std(c), DK.x + 0.5, DK.top + y - 0.02, DK.z + 0.05, group));
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.055, 0.12, 16), std('#e9dccf')); pot.position.set(DK.x + 0.55, DK.top + 0.06, DK.z - 0.2); group.add(pot);
  for (let i = 0; i < 7; i++) { const lf = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), std('#3fa37a')); lf.scale.set(0.5, 1.4, 0.3); lf.position.set(DK.x + 0.55 + 0.05 * Math.cos(i), DK.top + 0.2, DK.z - 0.2 + 0.05 * Math.sin(i)); lf.rotation.set(0.5 * Math.sin(i * 2), i, 0.5 * Math.cos(i * 2)); group.add(lf); }
  const lamp = new THREE.Group(); box(0.12, 0.02, 0.12, std('#2a2238'), 0, 0.01, 0, lamp);
  const arm = box(0.015, 0.4, 0.015, std('#2a2238'), 0, 0.2, 0, lamp); const shade = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.1, 16, 1, true), std('#2a2238', { side: THREE.DoubleSide })); shade.position.set(0.06, 0.4, 0); shade.rotation.z = 0.9; lamp.add(shade);
  lamp.position.set(DK.x - 0.6, DK.top, DK.z - 0.15); group.add(lamp);
  const chairM = std('#2c2438'); box(0.45, 0.04, 0.45, chairM, DK.x - 0.1, 0.45, DK.z - 0.65, group); box(0.45, 0.5, 0.04, chairM, DK.x - 0.1, 0.72, DK.z - 0.88, group);
  for (const [dx, dz] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) box(0.03, 0.45, 0.03, chairM, DK.x - 0.1 + dx, 0.225, DK.z - 0.65 + dz, group);
  // 右墙书架
  box(1.2, 0.03, 0.25, woodM, RW / 2 - 0.13, 1.45, 0.2, group); box(1.2, 0.03, 0.25, woodM, RW / 2 - 0.13, 1.05, 0.2, group);
  box(0.25, 0.03, 1.2, woodM, RW / 2 - 0.13, 1.45, 0.2, group).visible = false;
  for (let i = 0; i < 9; i++) { const h = 0.2 + 0.1 * hash(seed + 20, i); box(0.18, h, 0.05, std(['#ff7eb6', '#8ff5dc', '#ffd35c', '#9aa8ff', '#e9dccf'][i % 5]), RW / 2 - 0.13, 1.47 + h / 2, -0.3 + i * 0.07, group).rotation.x = 0; }
  // 地毯
  const rugTex = canvasTex(512, 352, (x, W, H) => {
    x.fillStyle = '#5b3f70'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#e9dccf'; for (let i = 0; i < 6; i++) x.fillRect(0, 30 + i * 52, W, 10);
    x.fillStyle = '#ff7eb6'; x.fillRect(0, 0, W, 16); x.fillRect(0, H - 16, W, 16);
  });
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.5), std('#ffffff', { map: rugTex, roughness: 1 })); rug.rotation.x = -Math.PI / 2; rug.position.set(0.3, 0.005, 0.5); group.add(rug);

  // ---------------------------------------------------------------- 光：窗外霓虹（粉 / 青）+ 手机屏
  const amb = new THREE.HemisphereLight('#5a5f9a', '#24142c', 1.1); group.add(amb);
  const neonP = new THREE.PointLight('#ff3d9a', 18, 0, 2); neonP.position.set(WIN.x0 + 0.5, 2.0, fz + 0.4); group.add(neonP);
  const neonC = new THREE.PointLight('#3de0ff', 12, 0, 2); neonC.position.set(WIN.x1 - 0.3, 1.3, fz + 0.4); group.add(neonC);
  const screen = new THREE.PointLight('#ffffff', 0, 2.5, 2); group.add(screen);

  const anchors = {
    bed: BED, desk: DK, window: { ...WIN, z: fz },
    face: V(BED.x, 0.98, BED.z1 - 0.42),          // 她趴在床尾时脸的位置（立绘卡片摆在这附近）
    phoneHeld: V(BED.x + 0.02, 0.86, BED.z1 - 0.02),
    pov: V(BED.x, 1.0, BED.z1 - 0.5),
  };
  function update(T, { screen: sc = null, neon = 1 } = {}) {
    // 霓虹：慢呼吸 + 偶尔闪一下（按 0.25 s 格子取种子）
    const cell = Math.floor(T * 4), flick = hash(seed + 31, cell) < 0.06 ? 0.35 : 1;
    neonP.intensity = neon * 18 * (0.85 + 0.15 * Math.sin(T * 1.7)) * flick;
    neonC.intensity = neon * 12 * (0.85 + 0.15 * Math.sin(T * 1.3 + 2));
    if (sc) { screen.position.copy(sc.pos); screen.color.copy(sc.color); screen.intensity = 0.12 * (sc.k ?? 1); } else screen.intensity = 0;
  }
  return { group, update, anchors, lights: { amb, neonP, neonC, screen }, bokeh, hug, blanket };
}

// ================================================================ 手机
const GLARE_FS = /* glsl */`uniform float shift, k; varying vec2 vUv;
void main(){ float d = vUv.x * 0.8 + vUv.y - shift; float a = smoothstep(0.0, 0.08, d) * (1.0 - smoothstep(0.08, 0.28, d)); a += 0.35 * smoothstep(0.34, 0.38, d) * (1.0 - smoothstep(0.38, 0.44, d)); gl_FragColor = vec4(vec3(1.0), a * k); }`;
const QUAD_VS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`;

function sticker(kind) {
  return canvasTex(128, 128, (x, W, H) => {
    x.clearRect(0, 0, W, H);
    x.lineJoin = 'round'; x.lineWidth = 12; x.strokeStyle = '#ffffff';
    const path = () => {
      x.beginPath();
      if (kind === 'heart') { x.moveTo(64, 108); x.bezierCurveTo(4, 64, 24, 12, 64, 40); x.bezierCurveTo(104, 12, 124, 64, 64, 108); }
      else if (kind === 'star') { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 22 : 52; x.lineTo(64 + r * Math.cos(a), 66 + r * Math.sin(a)); } x.closePath(); }
      else if (kind === 'smile') x.arc(64, 64, 48, 0, 7);
      else if (kind === 'cloud') { x.arc(44, 72, 26, Math.PI * 0.5, Math.PI * 1.5); x.arc(66, 48, 28, Math.PI, 0); x.arc(92, 70, 24, Math.PI * 1.5, Math.PI * 0.5); x.closePath(); }
    };
    path(); x.stroke();
    x.fillStyle = { heart: '#ff3d8a', star: '#ffd35c', smile: '#8ff5dc', cloud: '#ffffff' }[kind]; path(); x.fill();
    x.lineWidth = 4; x.strokeStyle = '#2a1f4a'; path(); x.stroke();
    if (kind === 'smile') { x.fillStyle = '#2a1f4a'; x.beginPath(); x.arc(48, 56, 6, 0, 7); x.arc(80, 56, 6, 0, 7); x.fill(); x.beginPath(); x.arc(64, 68, 22, 0.2, Math.PI - 0.2); x.stroke(); }
    if (kind === 'cloud') { x.fillStyle = '#ff7eb6'; x.font = 'bold 26px sans-serif'; x.textAlign = 'center'; x.fillText('AGI?', 66, 80); }
  });
}

export function createPhone(S, { width = 0.072, caseColor = '#ff8cc0', glow = 1 } = {}) {
  const group = new THREE.Group();
  const aspect = S.H / S.W, portrait = aspect >= 1;
  // 横屏 surface = 同一台手机横过来：短边仍是 width
  const [scw, sch] = portrait ? [width, width * aspect] : [width / aspect, width];
  const bez = 0.004, r = 0.011, depth = 0.009;
  const caseW = scw + bez * 2 + 0.004, caseH = sch + bez * 2 + 0.004;
  // 手机壳（粉色软壳，圆角 + 倒角）
  const caseMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(roundRectShape(caseW, caseH, r), { depth, bevelEnabled: true, bevelThickness: 0.0025, bevelSize: 0.002, bevelSegments: 4, curveSegments: 12 }), std(caseColor, { roughness: 0.55 }));
  caseMesh.position.z = -depth; group.add(caseMesh);
  // 前面：黑色玻璃面板
  const glassBlack = new THREE.Mesh(new THREE.ShapeGeometry(roundRectShape(scw + bez * 2, sch + bez * 2, r * 0.8), 12), new THREE.MeshStandardMaterial({ color: '#07060a', roughness: 0.15, metalness: 0.3 }));
  glassBlack.position.z = 0.0026; group.add(glassBlack);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(scw, sch), new THREE.MeshBasicMaterial({ map: S.tex, color: new THREE.Color(glow, glow, glow) }));
  screen.position.z = 0.0028; group.add(screen);
  // 玻璃反光：一条斜的柔光带，随机位走
  const glare = new THREE.Mesh(new THREE.PlaneGeometry(scw + bez * 2, sch + bez * 2), new THREE.ShaderMaterial({ vertexShader: QUAD_VS, fragmentShader: GLARE_FS, uniforms: { shift: { value: 0.6 }, k: { value: 0.16 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  glare.position.z = 0.0031; group.add(glare);
  // 背面：摄像头模组 + 贴纸
  const back = new THREE.Group(); back.rotation.y = Math.PI; back.position.z = -depth - 0.0026; group.add(back);
  const camX = portrait ? caseW / 2 - 0.017 : caseW / 2 - 0.017, camY = caseH / 2 - 0.017;
  const bump = new THREE.Mesh(new THREE.ExtrudeGeometry(roundRectShape(0.026, 0.026, 0.006), { depth: 0.002, bevelEnabled: false }), std('#241c2c', { roughness: 0.4, metalness: 0.4 }));
  bump.position.set(camX, camY, 0); back.add(bump);
  for (const [dx, dy] of [[-0.006, 0.006], [0.006, -0.006], [-0.006, -0.006]]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.0042, 0.0042, 0.002, 20), new THREE.MeshStandardMaterial({ color: '#050408', roughness: 0.1, metalness: 0.8 })); l.rotation.x = Math.PI / 2; l.position.set(camX + dx, camY + dy, 0.0025); back.add(l); }
  const st = [['heart', -0.018, 0.02, 0.026, 0.3], ['star', 0.016, -0.012, 0.022, -0.2], ['smile', -0.012, -0.035, 0.02, 0.1], ['cloud', 0.008, 0.03 - (portrait ? 0 : 0.02), 0.03, -0.1]];
  for (const [k, x, y, s, rot] of st) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshStandardMaterial({ map: sticker(k), transparent: true, roughness: 0.5, alphaTest: 0.05 }));
    m.position.set(portrait ? x : x * 1.4, portrait ? y : y * 0.6, 0.0003); m.rotation.z = rot; back.add(m);
  }
  // 挂件：左下角一串珠子 + 星星坠子，永远朝下垂，跟着手晃
  const charm = new THREE.Group(); charm.position.set(-caseW / 2 + 0.006, -caseH / 2 + 0.004, -depth / 2); group.add(charm);
  const hang = new THREE.Group(); charm.add(hang);
  const beadC = ['#ffffff', '#ff7eb6', '#8ff5dc', '#ffd35c', '#ffffff'];
  for (let i = 0; i < 5; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.0032, 12, 8), std(beadC[i], { roughness: 0.25 })); b.position.y = -0.006 - i * 0.0065; hang.add(b); }
  const starShape = new THREE.Shape(); for (let i = 0; i < 10; i++) { const a = Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 0.0045 : 0.011; i ? starShape.lineTo(rr * Math.cos(a), rr * Math.sin(a)) : starShape.moveTo(rr * Math.cos(a), rr * Math.sin(a)); }
  const star = new THREE.Mesh(new THREE.ExtrudeGeometry(starShape, { depth: 0.003, bevelEnabled: true, bevelThickness: 0.001, bevelSize: 0.001, bevelSegments: 2 }), std('#ffd35c', { roughness: 0.3, metalness: 0.3, emissive: '#402a00' }));
  star.position.set(0, -0.046, -0.0015); hang.add(star);
  const cordM = new THREE.Mesh(new THREE.CylinderGeometry(0.0006, 0.0006, 0.04, 4), std('#ffffff')); cordM.position.y = -0.02; hang.add(cordM);
  const _q = new THREE.Quaternion(), _e = new THREE.Euler();
  function update(T, camera = null) {
    // 挂件：父级世界朝向的逆 × 往下垂 + 摆动
    group.updateWorldMatrix(true, false);
    group.getWorldQuaternion(_q).invert();
    _e.set(0.25 * Math.sin(T * 3.1), 0, 0.35 * Math.sin(T * 2.3 + 1));
    hang.quaternion.copy(_q).multiply(new THREE.Quaternion().setFromEuler(_e));
    if (camera) {   // 反光带跟相机相对手机的角度走
      const p = camera.position.clone(); group.worldToLocal(p);
      glare.material.uniforms.shift.value = 0.75 + 1.4 * (p.x + p.y) / Math.max(0.05, p.length());
    }
  }
  return { group, screen, glare, charm, size: [scw, sch], depth: 0.0028 / 0.32, caseSize: [caseW, caseH], update };
}

// ================================================================ 握手机的两只手（卡通、粉色袖口）
export function createHands(phone, { skin = '#f6c9b0', sleeve = '#ff5ea8', cuff = '#8ff5dc', landscape = false } = {}) {
  const group = new THREE.Group();
  const [cw, ch] = phone.caseSize;
  const skinM = new THREE.MeshToonMaterial({ color: skin }), sleeveM = new THREE.MeshToonMaterial({ color: sleeve }), cuffM = new THREE.MeshToonMaterial({ color: cuff });
  const cap = (r, l, m) => new THREE.Mesh(new THREE.CapsuleGeometry(r, l, 6, 12), m);
  for (const s of [-1, 1]) {
    const hand = new THREE.Group();
    // 手掌：在手机背面，靠边
    const palm = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), skinM); palm.scale.set(0.022, 0.038, 0.012); palm.position.set(0.004 * s, -0.004, -0.02); hand.add(palm);
    // 拇指：绕到正面，压在屏幕边缘
    const th = cap(0.0072, 0.03, skinM); th.position.set(-0.004 * s, 0.006, 0.006); th.rotation.set(0.25, 0, s * 0.55); hand.add(th);
    // 四指：在背面并排，指尖从另一侧边缘露出一点
    for (let i = 0; i < 4; i++) { const f = cap(0.0058, 0.026 - Math.abs(i - 1.5) * 0.003, skinM); f.position.set(-0.012 * s, 0.018 - i * 0.012, -0.018); f.rotation.set(0, 0, s * Math.PI / 2); hand.add(f); }
    // 手腕 + 袖口（从下方外侧伸进来）
    const wrist = cap(0.015, 0.05, skinM); wrist.position.set(0.02 * s, -0.045, -0.022); wrist.rotation.set(-0.5, 0, s * 0.5); hand.add(wrist);
    const sl = cap(0.024, 0.2, sleeveM); sl.position.set(0.07 * s, -0.14, -0.08); sl.rotation.set(-0.7, 0, s * 0.55); hand.add(sl);
    const cf = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.004, 8, 20), cuffM); cf.position.set(0.035 * s, -0.07, -0.035); cf.rotation.set(Math.PI / 2 - 0.7, s * 0.55, 0); hand.add(cf);
    hand.position.set(s * (cw / 2 + 0.002), landscape ? 0 : -ch * 0.12, 0);
    group.add(hand);
  }
  return { group };
}

// ================================================================ 2D 立绘卡片（2.5D：立绘画进透明画布，贴成一块竖在房间里的板）
// ui.draw.girl 画进 1024×1024 透明画布；屏幕光（按屏幕颜色）和霓虹轮廓光用 source-atop 叠在她身上，只照到她。
export function portraitCard(ui, { w = 1.0 } = {}) {
  const S = ui.surface(1024, 1024);
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, w), new THREE.MeshBasicMaterial({ map: S.tex, transparent: true, alphaTest: 0.02, depthWrite: true }));
  function update(T, { box = { x: 112, y: 40, w: 800, h: 984 }, girl = {}, glow = null, rim = 0.6, rot = 0 } = {}) {
    S.clear(null);
    const c = S.ctx;
    c.save(); if (rot) { c.translate(512, 1024); c.rotate(rot); c.translate(-512, -1024); }
    ui.draw.girl(c, box, T, girl);
    c.restore();
    c.save(); c.globalCompositeOperation = 'source-atop';
    // 夜里：整体压暗偏冷
    c.fillStyle = 'rgba(30,20,70,0.34)'; c.fillRect(0, 0, 1024, 1024);
    // 窗外霓虹：从右上方来的粉色轮廓光
    const rg = c.createLinearGradient(1024, 0, 600, 300); rg.addColorStop(0, `rgba(255,70,160,${0.4 * rim})`); rg.addColorStop(1, 'rgba(255,70,160,0)');
    c.fillStyle = rg; c.fillRect(0, 0, 1024, 1024);
    // 屏幕光：从下方手机的位置往上打在脸上
    if (glow) {
      const { x = 512, y = 1000, r = 700, color = '#bff', k = 1 } = glow;
      const g = c.createRadialGradient(x, y, 20, x, y, r);
      const col = new THREE.Color(color).getStyle(THREE.SRGBColorSpace).replace('rgb(', '').replace(')', '');
      g.addColorStop(0, `rgba(${col},${0.55 * k})`); g.addColorStop(0.6, `rgba(${col},${0.22 * k})`); g.addColorStop(1, `rgba(${col},0)`);
      c.globalCompositeOperation = 'source-atop'; c.fillStyle = g; c.fillRect(0, 0, 1024, 1024);
    }
    c.restore();
    S.commit();
  }
  return { mesh, surface: S, update };
}

// ================================================================ 关键画卡片（千问画的抠图关键画，放进房间当 2.5D 卡片）
// imgs = { name: HTMLImageElement }（同一张卡的几张图须同尺寸）；update(T, { img, glow, rim }) 选一张画上去 + 夜色 / 霓虹 / 屏幕光（只照在她身上）
export function imageCard(imgs, { w = 1.0 } = {}) {
  const first = Object.values(imgs)[0], W = first.width, H = first.height;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, w * H / W), new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.02 }));
  function update(T, { img, glow = null, rim = 0.6, dark = 0.3 } = {}) {
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    x.clearRect(0, 0, W, H); x.drawImage(imgs[img], 0, 0, W, H);
    x.globalCompositeOperation = 'source-atop';
    x.fillStyle = `rgba(30,20,70,${dark})`; x.fillRect(0, 0, W, H);
    const rg = x.createLinearGradient(W, 0, W * 0.55, H * 0.35); rg.addColorStop(0, `rgba(255,70,160,${0.4 * rim})`); rg.addColorStop(1, 'rgba(255,70,160,0)');
    x.fillStyle = rg; x.fillRect(0, 0, W, H);
    if (glow) {
      const { u = 0.5, v = 0.8, r = 0.6, color = '#bff', k = 1 } = glow;
      const cs = new THREE.Color(color).getStyle(THREE.SRGBColorSpace).replace('rgb(', '').replace(')', '');
      const g = x.createRadialGradient(u * W, v * H, 10, u * W, v * H, r * Math.max(W, H));
      g.addColorStop(0, `rgba(${cs},${0.55 * k})`); g.addColorStop(0.6, `rgba(${cs},${0.2 * k})`); g.addColorStop(1, `rgba(${cs},0)`);
      x.fillStyle = g; x.fillRect(0, 0, W, H);
    }
    x.globalCompositeOperation = 'source-over';
    t.needsUpdate = true;
  }
  return { mesh, update, aspect: W / H };
}

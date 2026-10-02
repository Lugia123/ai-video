// kits/doom-readout.js — P(DOOM) 秤旁边的大读数牌（#1052；副歌 3 / 副歌 4 共用同一个样式）。
// 秤（kits/doom-scale.js）表盘上的读数窗在远景里只有画高 4% 左右，读不清；这块牌子立在秤旁，把同一个读数放大。
//
//   import { createDoomReadout } from '../kits/doom-readout.js';
//   const readout = await createDoomReadout({ height: 4.4 });   // 牌高（单位 = 她的身高 1.0）；宽 = 高 × 1.6；数字的字高 ≈ 牌高 × 0.44
//   readout.group.position.set(x, y, z); scene.add(readout.group);      // 原点 = 牌面中心，朝 +Z；pole: true 时带一根落地的杆（杆长到 y = 0）
//   readout.update(T, { text: '1.00', lit: 1, alarm: 0 });
//     text   牌上的大字：'0.94' / '1.00' / '1.13' / 'ERR'（同一个 text 不重画）
//     lit    0..1 整块牌的亮度（0 = 灭，只剩一点轮廓）
//     alarm  0..1 报警：灯管边和大字变红、随 T 闪
// 样式：跑酷段的霓虹招牌那一类（墨底 + 灯管边 + Anton 白字），上面一行小字 P(DOOM)（柠黄），下面是大读数。纯函数。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';

const lerp = (a, b, p) => a + (b - a) * p;
const FONT = '"DRAnton", "Anton", Impact, sans-serif';
let fontReady = null;
const loadFont = () => (fontReady ??= new FontFace('DRAnton', `url(${new URL('../../../assets/fonts/anton/Anton-Regular.ttf', import.meta.url)})`).load().then(f => document.fonts.add(f)).catch(() => {}));

export async function createDoomReadout({ height = 4.4, pole = true, groundY = null } = {}) {
  await loadFont();
  const W = 1024, H = 640, width = height * W / H;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const mat = new THREE.MeshBasicMaterial({ map: tex, fog: false, toneMapped: false });
  const group = new THREE.Group();
  const face = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat); group.add(face);
  const back = new THREE.Mesh(new THREE.BoxGeometry(width + 0.2, height + 0.2, 0.3), new THREE.MeshStandardMaterial({ color: '#16151d', roughness: 0.7, metalness: 0.3 })); back.position.z = -0.17; group.add(back);
  let poleMesh = null;
  function setPole(y) {                       // 杆从牌底伸到世界高度 y（调用方摆好 group 之后调一次；pole:false 时不建）
    if (!pole) return;
    const len = Math.max(0.1, group.position.y - height / 2 - y);
    if (poleMesh) group.remove(poleMesh);
    poleMesh = new THREE.Mesh(new THREE.BoxGeometry(0.45, len, 0.45), back.material); poleMesh.position.set(0, -height / 2 - len / 2, -0.2); group.add(poleMesh);
  }
  if (groundY != null) setPole(groundY);
  let key = '';
  function draw(text, alarm) {
    const k = text + '|' + alarm; if (k === key) return; key = k;
    const edge = alarm ? '#ff2e4a' : PAL.pink;
    g.fillStyle = '#0d0c14'; g.fillRect(0, 0, W, H);
    g.strokeStyle = edge; g.lineWidth = 22; g.strokeRect(14, 14, W - 28, H - 28);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = PAL.lemon; g.font = `132px ${FONT}`; g.fillText('P(DOOM)', W / 2, 118);
    g.fillStyle = alarm ? '#ff4a5e' : '#F2EDE4'; g.font = `400px ${FONT}`; g.fillText(text, W / 2, 392);   // Anton 400 px 的数字字身约 285 px = 牌高的 44%
    tex.needsUpdate = true;
  }
  function update(T, { text = '0.00', lit = 1, alarm = 0 } = {}) {
    draw(text, alarm > 0.3);
    mat.color.setScalar(lerp(0.06, 1.35, lit) * (1 + 0.45 * alarm * lit * (0.5 + 0.5 * Math.sin(T * 26))));
  }
  update(0, {});
  return { group, update, setPole, width, height };
}

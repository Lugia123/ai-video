// shots/c3-optB.js — 副歌 3 方案 B「舞台化」低分辨率样片（#1060）。细则：fresh/v4-rest/c3/BRIEF-options-night.md
//
//   const shots = await makeC3OptB(mv);   // c3-optB-half.html 单独挂
//
// 这段当成演出的高潮：全片那座舞台（kits/stage.js，变体用 fan 的光束 + 红 / 柠黄 / 银的灯色，伴舞排成一排），不讲剧情，回形针全是舞台特效。
//   S1 95.40–96.60  I'm upping my P(doom)      正上方俯拍：舞台全黑只剩一束顶光，她从镜头这边掉下来（接主歌 3 的坠落），砸在顶光圈里 → 全场灯炸亮；地板 LED 逐词亮歌词
//   S2 96.60–98.42  as paperclips fill the room 大全景慢推：台口两门礼炮每拍喷一股回形针，桁架上四道回形针瀑布往下倒，台下观众席开始被埋
//   S3 98.42–100.23 Killswitch guy's on PTO     台口左侧的道具前景：玻璃罩里的红色关机按钮、空办公椅、霓虹牌 OUT OF OFFICE；镜头从道具横移到台中央唱的她
//   S4 100.23–102.05 Now there's nowhere left to go  升：回形针漫上台面，伴舞被埋到腰、一个个暗掉，她站在越来越小的空地上
//   S5 102.05–103.87 Too late now, we lit the fuse   低机位：lit 那一下关机按钮的底座冒出火花，引线沿台口往两边烧
//   S6 103.87–105.96 （fuse 长音）                    大全景：大屏变成 3 · 2 · 1 倒计时，引线烧到两角的烟花筒 → 105.69 回形针烟火炸开、扑向镜头填满画面 → 105.96 硬切坐标轴
// 单位 = 她的身高（1），和 stage.js 一致。全部是 T 的纯函数；随机只用种子。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { createStage } from '../kits/stage.js';
import { loadAnims, getAnim } from '../kits/girl.js';
import { mulberry32, chromeMatcap } from '../kits/world.js';

export const C3B = { t0: 95.40, end: 105.96 };
export const ANIMS = ['move__fall-air', 'move__hard-landing'];

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIO = p => { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2; };
const col = (c, k = 1) => new THREE.Color(c).multiplyScalar(k);
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const FONT = '"UIAnton", "Anton", Impact, sans-serif';
const RED = '#ff3348', SILVER = '#dfe6f2';

// 回形针的形状（同 kits/world.js 的 paperclipCurve；那边没导出，这里抄一份）
function paperclipGeo(size) {
  const pts = [], line = (a, b, n = 6) => { for (let i = 0; i < n; i++) { const u = i / n; pts.push(V(lerp(a[0], b[0], u), lerp(a[1], b[1], u), 0)); } };
  const arc = (cx, cy, r, a0, a1, n = 10) => { for (let i = 0; i < n; i++) { const a = lerp(a0, a1, i / n); pts.push(V(cx + r * Math.cos(a), cy + r * Math.sin(a), 0)); } };
  line([0.22, 0.75], [0.22, -0.85]); arc(0, -0.85, 0.22, 0, -Math.PI); line([-0.22, -0.85], [-0.22, 1.05]); arc(0.14, 1.05, 0.36, Math.PI, 0);
  line([0.5, 1.05], [0.5, -1.15]); arc(0, -1.15, 0.5, 0, -Math.PI); line([-0.5, -1.15], [-0.5, 0.55], 5); pts.push(V(-0.5, 0.55, 0));
  const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.1), 24, 0.06, 4, false); g.scale(size, size, size); return g;
}
// 霓虹字牌（墨底 + 灯管边 + 字），返回 { mesh, mat, draw(text) }
function neonPlate(w, h, { color = RED, size = 120, bg = '#0b0910' } = {}) {
  const c = document.createElement('canvas'); c.width = Math.round(w * 200); c.height = Math.round(h * 200); const g = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false });
  const draw = (lines, { glow = 1, fill = color, sz = size } = {}) => {
    g.clearRect(0, 0, c.width, c.height); if (bg) { g.fillStyle = bg; g.fillRect(0, 0, c.width, c.height); g.strokeStyle = color; g.lineWidth = 10; g.strokeRect(8, 8, c.width - 16, c.height - 16); }
    g.font = `${sz}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = fill; g.shadowBlur = 30 * glow; g.fillStyle = fill;
    const L = [].concat(lines); L.forEach((s, i) => g.fillText(s, c.width / 2, c.height / 2 + (i - (L.length - 1) / 2) * sz * 1.05)); tex.needsUpdate = true;
  };
  return { mesh: new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat), mat, draw };
}

export async function makeC3OptB(mv) {
  const { music } = mv, P = music.period;
  await new FontFace('UIAnton', `url(${new URL('../../../assets/fonts/anton/Anton-Regular.ttf', import.meta.url)})`).load().then(f => document.fonts.add(f));
  await loadAnims(ANIMS);
  const words = mv.lyrics.lines.flatMap(l => l.words).filter(w => w.start > C3B.t0 - 0.2 && w.start < C3B.end);
  const W = s => { const w = words.find(q => q.w.toLowerCase().replace(/[^a-z()']/g, '').startsWith(s)); if (!w) throw new Error('c3-optB：歌词里找不到 ' + s); return w.start; };
  const T_LAND = 96.15, T_LIT = W('lit'), T_BOOM = 105.69;
  const CUT = { s2: 96.60, s3: 98.42, s4: 100.23, s5: 102.05, s6: 103.87 };
  const COUNT = [104.33, 104.78, 105.24];              // 大屏倒计时 3 · 2 · 1（拍上）

  const stage = await createStage(mv, { dancers: 8, formation: 'row', variant: 'fan', lyrics: [[C3B.t0 - 0.1, C3B.end]] });
  const { scene, girl } = stage;
  const sol = (name, sec) => { const m = getAnim(name); return m.solve(sec / m.srcPeriod, girl.dancer); };
  const PALB = [RED, PAL.lemon, SILVER];

  // ================================================================ 回形针：一个 InstancedMesh 管全部（礼炮、瀑布、烟火、扑向镜头的）+ 一个管「涨起来的回形针海」
  const matcap = chromeMatcap(), clipMat = new THREE.MeshMatcapMaterial({ matcap });
  const rnd = mulberry32(1060);
  const FLY = [];                                      // { t, p0, v, spin, ax, kind }
  const G = 9.0;
  // 礼炮：台口两角，每拍一股（96.84 起），越来越密
  for (const x0 of [-4.6, 4.6]) for (let b = 0; b < 12; b++) {
    const t = 96.84 + b * P * (b < 4 ? 1 : 0.5); if (t > 101.8) break;
    for (let i = 0; i < 70; i++) { const a = (rnd() - 0.5) * 0.7, sp = 7 + 3 * rnd(); FLY.push({ t: t + rnd() * 0.06, p0: V(x0, 0.3, 2.3), v: V(-Math.sign(x0) * (1.6 + 1.6 * rnd()) + a, sp, (rnd() - 0.6) * 2.4), kind: 0 }); }
  }
  // 瀑布：桁架下沿四个口子往下倒（97.4 起，流量越来越大）
  for (const x0 of [-4.4, -3.2, 3.2, 4.4]) for (let i = 0; i < 520; i++) {      // 只在大屏两侧，别挡屏
    const t = 97.4 + 6.4 * (i / 520) ** 0.8 + rnd() * 0.05;
    FLY.push({ t, p0: V(x0 + (rnd() - 0.5) * 0.35, 5.05, -1.3 + (rnd() - 0.5) * 0.3), v: V((rnd() - 0.5) * 0.6, -0.5 * rnd(), (rnd() - 0.5) * 0.6), kind: 1 });
  }
  // 烟火：引线烧到两角 → 105.69 两只烟花筒升空、炸开成两团回形针球；再一股朝镜头扑过来填满画面
  for (const x0 of [-4.6, 4.6]) for (let i = 0; i < 700; i++) {
    const th = rnd() * Math.PI * 2, ph = Math.acos(2 * rnd() - 1), sp = 4 + 4 * rnd();
    FLY.push({ t: T_BOOM, p0: V(x0 * 0.7, 4.6, -0.2), v: V(Math.sin(ph) * Math.cos(th) * sp, Math.cos(ph) * sp + 2, Math.sin(ph) * Math.sin(th) * sp), kind: 2 });
  }
  for (let i = 0; i < 1600; i++) FLY.push({ t: T_BOOM + 0.02 + 0.2 * rnd(), p0: V((rnd() - 0.5) * 3, 2 + rnd() * 2, -1), v: V((rnd() - 0.5) * 9, (rnd() - 0.3) * 6, 18 + 10 * rnd()), kind: 3 });
  FLY.forEach(f => { f.ax = V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(); f.spin = 6 + 10 * rnd(); f.yaw = rnd() * 6.28; });
  const fly = new THREE.InstancedMesh(paperclipGeo(0.11), clipMat, FLY.length); fly.frustumCulled = false; fly.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(fly);
  FLY.forEach((f, i) => fly.setColorAt(i, rnd() < 0.86 ? col('#ffffff') : col([RED, PAL.lemon, PAL.mint][i % 3])));

  // 回形针海：台下观众席先满，再漫上台面；level(T) = 这一刻的海面高度（台面 y = 0，台下 y = −0.9）
  const LEV = [[96.9, -1.2], [98.4, -0.55], [100.2, -0.1], [101.2, 0.18], [102.05, 0.36], [103.9, 0.42], [105.9, 0.5]];
  const level = T => { if (T <= LEV[0][0]) return LEV[0][1]; for (let i = 1; i < LEV.length; i++) if (T < LEV[i][0]) return lerp(LEV[i - 1][1], LEV[i][1], smooth((T - LEV[i - 1][0]) / (LEV[i][0] - LEV[i - 1][0]))); return LEV.at(-1)[1]; };
  const NSEA = 26000, SEA = [];
  for (let i = 0; i < NSEA; i++) {
    let x = (rnd() - 0.5) * 16, z = lerp(-4.4, 9, rnd());
    const r = Math.hypot(x, z - 0.15);                  // 她站的地方留一块空地（海面上来以后越来越小）
    SEA.push({ x, z, r, d: rnd() * 0.35, rx: rnd() * 6.28, ry: rnd() * 6.28, rz: rnd() * 6.28 });
  }
  const sea = new THREE.InstancedMesh(paperclipGeo(0.11), clipMat, NSEA); sea.frustumCulled = false; sea.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(sea);
  SEA.forEach((s, i) => sea.setColorAt(i, rnd() < 0.9 ? col('#ffffff') : col([RED, PAL.lemon, PAL.mint][i % 3])));
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sv = V(1, 1, 1), pv = V(), zero = new THREE.Matrix4().makeScale(0, 0, 0);
  const onStage = (x, z) => Math.abs(x) < 5.5 && z > -4.7 && z < 2.7;
  function drawClips(T) {
    const L = level(T), clear = lerp(2.2, 0.75, smooth((T - 100.2) / 3.5));
    SEA.forEach((s, i) => {
      const base = onStage(s.x, s.z) ? 0 : -0.9, top = onStage(s.x, s.z) ? L : Math.max(L, -0.9 + (L + 0.9) * 1.25), y = Math.max(base, top) - s.d;   // 台下涨得快一点
      if (top <= base + 0.02 || y < base - 0.05 || (onStage(s.x, s.z) && s.r < clear)) { sea.setMatrixAt(i, zero); return; }
      e.set(s.rx, s.ry, s.rz); q.setFromEuler(e); pv.set(s.x, y + 0.03 * Math.sin(T * 3 + s.rx), s.z); sea.setMatrixAt(i, m4.compose(pv, q, sv));
    });
    sea.instanceMatrix.needsUpdate = true;
    FLY.forEach((f, i) => {
      const k = T - f.t; if (k < 0) { fly.setMatrixAt(i, zero); return; }
      const g = f.kind === 1 ? G * 0.8 : f.kind === 3 ? 1 : G;
      pv.copy(f.p0).addScaledVector(f.v, k); pv.y -= 0.5 * g * k * k;
      const floor = onStage(pv.x, pv.z) ? Math.max(0, L) : Math.max(-0.9, L);
      if (f.kind !== 3 && pv.y < floor) { const land = (k > 2.5); if (land) { fly.setMatrixAt(i, zero); return; } pv.y = floor; }    // 落进海里：贴着海面躺一会儿再并进海
      if (f.kind === 3 && k > 1.2) { fly.setMatrixAt(i, zero); return; }
      q.setFromAxisAngle(f.ax, f.spin * k + f.yaw); fly.setMatrixAt(i, m4.compose(pv, q, sv.setScalar(f.kind === 3 ? 1.6 : 1)));
    });
    sv.setScalar(1); fly.instanceMatrix.needsUpdate = true;
  }

  // ================================================================ 道具：killswitch 工位（台口左侧）—— 玻璃罩里的红按钮、空办公椅、OUT OF OFFICE
  const PROP = V(-3.3, 0, 1.55), prop = new THREE.Group(); prop.position.copy(PROP); scene.add(prop);
  const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, metalness: 0.2, ...o });
  { const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.9, 24), std('#1c1a26')); ped.position.y = 0.45; prop.add(ped);
    const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.07, 32), new THREE.MeshBasicMaterial({ color: col(RED, 2.2), toneMapped: false })); btn.position.y = 0.94; prop.add(btn); prop.userData.btn = btn;
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#cfe8ff', transparent: true, opacity: 0.25, roughness: 0.05, metalness: 0.4 })); dome.position.y = 0.92; prop.add(dome);
    const tag = neonPlate(0.5, 0.14, { color: RED, size: 70 }); tag.draw('KILL SWITCH'); tag.mesh.position.set(0, 0.7, 0.24); prop.add(tag.mesh);
    // 空办公椅（转过去一点、没人坐）
    const chair = new THREE.Group(); chair.position.set(0.75, 0, -0.15); chair.rotation.y = -0.6; prop.add(chair);
    const cm = std('#4a4660'), cs = std('#6b6f80', { metalness: 0.7 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.48), cm); seat.position.y = 0.5; chair.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.6, 0.07), cm); back.position.set(0, 0.86, -0.22); back.rotation.x = -0.12; chair.add(back);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8), cs); post.position.y = 0.27; chair.add(post);
    for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2, leg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.03, 0.04), cs); leg.position.set(Math.cos(a) * 0.15, 0.06, Math.sin(a) * 0.15); leg.rotation.y = -a; chair.add(leg); }
    // OUT OF OFFICE 霓虹牌（立在道具后面的架子上）
    const ooo = neonPlate(1.7, 0.66, { color: RED, size: 46 }); ooo.draw(['OUT OF OFFICE', 'BACK MONDAY']); ooo.mesh.position.set(0.35, 1.5, -0.45); ooo.mesh.rotation.y = 0.35; prop.add(ooo.mesh); prop.userData.ooo = ooo;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.5, 6), cs); pole.position.set(0.35, 0.6, -0.5); prop.add(pole);
    const pLight = new THREE.PointLight(RED, 0, 3.5, 1.5); pLight.position.set(0, 1.2, 0.6); prop.add(pLight); prop.userData.light = pLight; }

  // ================================================================ 引线：从关机按钮的底座出发，沿台口烧向两角的烟花筒
  const pathLen = pts => { let s = 0; for (let i = 1; i < pts.length; i++) s += pts[i].distanceTo(pts[i - 1]); return s; };
  const pathAt = (pts, d) => { for (let i = 1; i < pts.length; i++) { const l = pts[i].distanceTo(pts[i - 1]); if (d <= l) return pts[i - 1].clone().lerp(pts[i], d / l); d -= l; } return pts.at(-1).clone(); };
  // 两支：按钮 → 台口 → 左角 / 右角，同时烧到（右支长，烧得快）
  const FY = 0.66;      // 引线挂在台口的烟火导轨上（高过回形针海）
  const FUSES = [{ pts: [V(-3.3, 0.94, 1.6), V(-3.45, FY, 2.45), V(-4.6, FY, 2.45)] }, { pts: [V(-3.3, 0.94, 1.6), V(-3.15, FY, 2.45), V(4.6, FY, 2.45)] }];
  for (const F of FUSES) {
    F.len = pathLen(F.pts);
    const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(F.pts, false, 'catmullrom', 0), 64, 0.025, 6, false);
    F.mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: '#8a6a3a' })); scene.add(F.mesh);
    F.head = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), new THREE.MeshBasicMaterial({ color: col('#fff1b0', 4), toneMapped: false })); scene.add(F.head);
    F.light = new THREE.PointLight(PAL.lemon, 0, 2.5, 1.5); scene.add(F.light);
  }
  const fuseP = T => clamp((T - T_LIT) / (T_BOOM - 0.05 - T_LIT)) ** 1.15;     // 0..1：烧到哪了
  // 火花：引线头上一直往外喷（Points，按 T 现算）
  const NSP = 360, spGeo = new THREE.BufferGeometry(), spPos = new Float32Array(NSP * 3); spGeo.setAttribute('position', new THREE.BufferAttribute(spPos, 3));
  const sparks = new THREE.Points(spGeo, new THREE.PointsMaterial({ color: col('#ffd36a', 3), size: 0.05, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })); sparks.frustumCulled = false; scene.add(sparks);
  const SPD = Array.from({ length: NSP }, () => [rnd(), rnd() - 0.5, rnd(), rnd() - 0.5, rnd()]);
  // 两角的烟花筒
  { const rail = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.04, 0.06), std('#3a3446', { metalness: 0.7 })); rail.position.set(0, FY - 0.04, 2.45); scene.add(rail);
    for (let x = -4.5; x <= 4.6; x += 1.5) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, FY, 6), std('#3a3446')); p.position.set(x, FY / 2, 2.45); scene.add(p); } }
  for (const x0 of [-4.6, 4.6]) { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 1.1, 16), std('#2b1f2a')); m.position.set(x0, 0.55, 2.3); scene.add(m);
    const r = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.03, 6, 20), new THREE.MeshBasicMaterial({ color: col(RED, 2), toneMapped: false })); r.rotation.x = Math.PI / 2; r.position.set(x0, 1.1, 2.3); scene.add(r); }
  // 烟花筒升空的两颗弹
  const shells = [-4.6, 4.6].map(x0 => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), new THREE.MeshBasicMaterial({ color: col('#fff4c8', 4), toneMapped: false })); m.userData.x0 = x0; scene.add(m); return m; });
  function drawFuse(T) {
    const p = fuseP(T), on = T >= T_LIT;
    let n = 0;
    FUSES.forEach((F, fi) => {
      const head = pathAt(F.pts, p * F.len); F.head.position.copy(head); F.head.visible = on && p < 1; F.head.scale.setScalar(1 + 0.4 * Math.sin(T * 60 + fi));
      F.light.position.copy(head).add(V(0, 0.3, 0)); F.light.intensity = on && p < 1 ? 3 + Math.sin(T * 47) : 0;
      for (let i = fi; i < NSP; i += 2) { const s = SPD[i], age = ((T * 3 + s[0]) % 1); if (!on || p >= 1) { spPos.set([0, -99, 0], i * 3); continue; }
        spPos.set([head.x + s[1] * age * 0.9, head.y + age * (0.6 * s[2]) - 1.2 * age * age, head.z + s[3] * age * 0.9], i * 3); n++; }
    });
    spGeo.attributes.position.needsUpdate = true;
    // 烧过的一段变黑，没烧到的是麻绳色
    
    shells.forEach(m => { const k = T - (T_BOOM - 0.35); m.visible = k > 0 && T < T_BOOM; m.position.set(m.userData.x0 * lerp(1, 0.7, clamp(k / 0.35)), 1.1 + 3.5 * eOut(k / 0.35), lerp(2.3, -0.2, clamp(k / 0.35))); });
  }

  // ================================================================ 地板 LED 字（S1 俯拍时读得出）+ 大屏前的倒计时
  const floorTxt = neonPlate(6.4, 1.2, { color: PAL.lemon, size: 150, bg: null }); floorTxt.mesh.rotation.x = -Math.PI / 2; floorTxt.mesh.position.set(0, 0.012, 1.55); scene.add(floorTxt.mesh);
  const S1W = words.filter(w => w.start < CUT.s2 + 0.3);
  let lastFloor = '';
  const count = neonPlate(4.6, 2.6, { color: RED, size: 420, bg: '#07050a' }); count.mesh.position.set(0, 3.0, -3.25); scene.add(count.mesh);   // 盖住大屏的上面大半（下沿的歌词条还露着）
  let lastCount = '';
  const landRing = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.5, 48), new THREE.MeshBasicMaterial({ color: col(PAL.lemon, 1.4), transparent: true, toneMapped: false, depthWrite: false })); landRing.rotation.x = -Math.PI / 2; landRing.position.set(0, 0.015, 0.15); scene.add(landRing);

  // ================================================================ 镜头
  const camTop = u => ({ pos: [0.0, 7.2 - 1.0 * u, 1.0], look: [0, 0, 0.12], fov: 44, led: 1 });                           // 正上方（略偏台前，地板字是正的）
  const camProp = u => { const s = eIO((u - 0.4) / 0.6);      /* 先在道具上停 0.7 s，再横移到台中央的她 */ return { pos: [lerp(-4.6, -1.6, s), lerp(1.35, 1.3, s), lerp(5.4, 5.6, s)], look: [lerp(-3.1, -0.2, s), lerp(1.05, 1.15, s), lerp(1.2, -0.4, s)], fov: lerp(40, 34, s), led: 1 }; };
  const camRise = u => { const s = eIO(u); return { pos: [0.4, lerp(1.4, 6.2, s), lerp(5.2, 7.4, s)], look: [0, lerp(1.0, 0.2, s), -0.4], fov: 36, led: 1 }; };
  const camLow = u => ({ pos: [-1.9 + 0.8 * u, 1.05, 4.3], look: [-0.9, 0.95, 0.6], fov: 44, led: 1 });          // 刚好高过回形针海：前景是台口的引线，后面是她
  const camFinal = u => { const s = eIO(u); return { pos: [0.3, lerp(1.5, 1.7, s), lerp(7.4, 6.6, s)], look: [0, lerp(1.9, 2.2, s), -1.4], fov: 38, led: 1 }; };
  const SHOTS = [
    { t0: C3B.t0, t1: CUT.s2, cam: camTop },
    { t0: CUT.s2, t1: CUT.s3, cam: 'dolly' },
    { t0: CUT.s3, t1: CUT.s4, cam: camProp },
    { t0: CUT.s4, t1: CUT.s5, cam: camRise },
    { t0: CUT.s5, t1: CUT.s6, cam: camLow },
    { t0: CUT.s6, t1: C3B.end + 0.2, cam: camFinal },
  ];

  function frame(T, sh) {
    const u = clamp((T - sh.t0) / (sh.t1 - sh.t0));
    const dark = T < T_LAND ? 1 : 1 - smooth((T - T_LAND) / 0.12);
    const climax = smooth((T - CUT.s6) / 1.0), boom = T >= T_BOOM ? 1 : 0;
    const crewOp = 1 - smooth((T - 100.6) / 1.4) * 0.85;
    const r = stage.update(T, {
      cam: typeof sh.cam === 'function' ? () => sh.cam : sh.cam, u, palette:      /* stage.update 会把函数参数当成 T => 值 先求一次，所以机位函数要再包一层 */
      PALB, beams: boom ? 'burst' : 'fan', dancers: 8, formation: 'row', crewOpacity: crewOp,
      lights: lerp(1.0, 1.5, Math.max(climax, smooth((T - CUT.s4) / 2) * 0.6)) , blackout: dark * 0.9, spot: 0.8,
      lead: T < CUT.s3 ? 'sing' : undefined, expression: T > T_LIT ? 'surprised' : 'neutral',
    });
    // ---- 她：S1 从天上掉下来（俯拍里她朝上、往镜头反方向掉）→ 砸地 → 站起
    if (T < CUT.s2) {
      const tf = T - C3B.t0, fallDur = T_LAND - C3B.t0, k = clamp(tf / fallDur);
      if (T < T_LAND) { girl.root.position.set(0, 7.5 * (1 - k * k), 0.15); girl.root.rotation.set(-Math.PI / 2 * (1 - k) * 0.85, 0, 0); girl.dancer.apply(sol('move__fall-air', tf)); }
      else { girl.root.position.set(0, 0, 0.15); girl.root.rotation.set(0, 0, 0); girl.dancer.apply(sol('move__hard-landing', 0.35 + (T - T_LAND) * 1.2)); }
    }
    girl.root.updateMatrixWorld(true);
    // ---- 地板歌词（S1：逐词点亮）
    const fw = S1W.filter(w => T >= w.start).map(w => w.w.toUpperCase().replace(/,$/, '')).join(' ');
    floorTxt.mesh.visible = T < CUT.s2 + 0.25 && fw.length > 0; if (fw !== lastFloor && floorTxt.mesh.visible) { floorTxt.draw(fw, { sz: fw.length > 14 ? 110 : 150 }); lastFloor = fw; }
    floorTxt.mat.opacity = 0.35 + 0.65 * (1 - dark);
    // ---- 落地冲击环
    const lk = T - T_LAND; landRing.visible = lk > 0 && lk < 0.6; landRing.scale.setScalar(1 + lk * 9); landRing.material.opacity = 0.6 * (1 - lk / 0.6);
    // ---- 道具
    prop.userData.light.intensity = (T > CUT.s3 - 0.2 ? 2.5 : 0.6) * (0.8 + 0.2 * Math.sin(T * 9));
    prop.userData.btn.material.color.copy(col(RED, 1.6 + 1.2 * Math.max(0, Math.sin(T * 7))));
    // ---- 倒计时
    const ci = COUNT.findLastIndex(t => T >= t), ctxt = T >= T_BOOM ? 'BOOM' : ci >= 0 ? String(3 - ci) : '';
    count.mesh.visible = ctxt !== '' && T >= COUNT[0] - 0.01; if (ctxt !== lastCount && count.mesh.visible) { count.draw(ctxt, { sz: ctxt === 'BOOM' ? 300 : 440 }); lastCount = ctxt; }
    const ck = T - (ci >= 0 ? COUNT[ci] : 0); count.mesh.scale.setScalar(1 + 0.12 * Math.exp(-ck * 10));
    drawFuse(T); drawClips(T);
    // ---- 收尾：扑过来的回形针填满画面 + 白闪（105.96 硬切坐标轴）
    const endW = smooth((T - (C3B.end - 0.12)) / 0.12);
    const flash = Math.max(r.post.flash?.amount ?? 0, T >= T_BOOM ? 0.55 * Math.exp(-(T - T_BOOM) * 9) : 0, 0.5 * Math.exp(-Math.max(0, lk) * 10) * (lk > 0 ? 1 : 0), 0.85 * endW);
    return { scene: r.scene, camera: r.camera, post: { ...r.post, bloom: { strength: 0.75 + 0.4 * boom, threshold: 1.1 }, flash: { amount: flash, color: '#ffffff' } } };
  }
  return SHOTS.map((sh, i) => ({ id: `c3B-${i + 1}`, t0: sh.t0, t1: sh.t1, transitionIn: { kind: 'cut' }, build: () => ({}), update: (_, T) => frame(T, sh) }));
}

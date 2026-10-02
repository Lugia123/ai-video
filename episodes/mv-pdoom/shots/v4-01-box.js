// shots/v4-01-box.js — v4-01「关盒子」段（歌曲时间 14.6–22.6 s）。#998 → #1029 按用户分镜重做（fresh/redo-box/BRIEF.md）
// 记录：fresh/redo-0588/B/plan-final.md 第 19 节。上一版（四面墙一拍一面、五段动作）备份在 fresh/redo-0588/B/probe/v4-01-box.v4.js。
//
//   const shots = await makeV401Box(mv, { from: 14.6 });   // v4-01-box.html 单独挂这一段；v4-01-final.js 也挂它
//
// 世界 = 跑酷段（v4-03a）那座城：同一个 createSpiralRun（不折叠的平路 + 两侧亮窗楼 + 地面霓虹线）、同一轮粉月、同一种歌词牌。
// 3D 只管空间和机关，表演交给 2D 俯视镜头（2D 和 3D 不同屏）：
//   14.6–15.6  高空俯视：方块倒进摊开的十字盒子，拼回她；落地蹲着 → 站起
//   15.66 BOSS 四面墙同一拍砸上（震屏、灯管炸闪、墙缝喷火花和尘土）；两扇半盖翻上墙顶
//   15.95–19.08 盒内仰拍不动：Chat · G · P · T 每个音节盖子「咔」地往里咬一格，头顶的光一格格变窄
//   19.08–22.3  2D，从正上方透过盖缝往下看：全景 → 伸手 → 仰脸 → 眼睛大特写；缝越来越窄，镜头越来越短
//   22.3–22.6  线灭，全黑只剩四只柠黄的眼
// 所有 update 都是 T 的纯函数（脚锁的根偏移在 build 时按 60 fps 预演成表）。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';
import { createSpiralRun, textTexture } from '../kits/world4.js';
import { mulberry32 } from '../kits/world.js';
import { createGirl, loadAnims, getAnim } from '../kits/girl.js';
import { blendSolved } from '../../../assets/lib/dance3d.js';

export const ANIMS = ['move__hard-landing', 'act__terrified', 'act__look-around', 'act__look-distance'];

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const col = c => new THREE.Color(c);
const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k);
const D2R = Math.PI / 180;

// 分段三次埃尔米特（单调）：keys = [[t, v], …]
function pchip(keys, t) {
  const n = keys.length;
  if (t <= keys[0][0]) return keys[0][1]; if (t >= keys[n - 1][0]) return keys[n - 1][1];
  const d = []; for (let i = 0; i < n - 1; i++) d.push((keys[i + 1][1] - keys[i][1]) / (keys[i + 1][0] - keys[i][0]));
  const m = keys.map((_, i) => i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : 2 * d[i - 1] * d[i] / (d[i - 1] + d[i]));
  let i = 0; while (t > keys[i + 1][0]) i++;
  const h = keys[i + 1][0] - keys[i][0], s = (t - keys[i][0]) / h, s2 = s * s, s3 = s2 * s;
  return (2 * s3 - 3 * s2 + 1) * keys[i][1] + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * keys[i + 1][1] + (s3 - s2) * h * m[i + 1];
}

// ================================================================ 时间表
export const BOX = {
  H: 2.0,                 // 她的身高（米，同跑酷段）
  S: 4.4,                 // 盒子边长 = 路宽
  ZC: 60,                 // 盒子中心在路上的位置 d
  hit: { W: 15.66, E: 15.66, S: 15.66, N: 15.66 },     // 四面墙砸到垂直的时刻：同一拍 = BOSS
  rise: { W: 0.24, E: 0.24, S: 0.24, N: 0.24 },
  // 盖缝（占盒宽的比例）：[时刻, 咬到多宽]。第一格 = 两扇半盖从墙外侧翻上墙顶；之后 Chat / G / P / T 各咬一格；2D 段的四格是同一道缝接着收（和 2D 画面里的亮带同拍）
  gap: [[15.70, 0.86], [16.60, 0.66], [17.24, 0.46], [17.92, 0.29], [18.36, 0.15], [19.08, 0.11], [19.76, 0.08], [20.27, 0.06], [20.84, 0.04], [21.35, 0.025]],
  bridge: { t0: 14.6, land: [14.78, 15.2], voxel: 15.2, toon: 15.55, boss: 15.66 },   // 衔接：方块从上面倒下来 → 堆成体素的她 → 变回卡通皮肤；boss 那一拍四只眼睁开
  cut: { inside: 15.95, side: 17.24, high: 17.92, top: 18.36, k2d: 19.08, shut: 22.3 },     // 镜头：高空俯视 → 外景斜上方（砸墙）→ 盒内四个机位（Chat 身后仰拍 / G 侧面 / P 墙顶斜俯 / T 盖缝正上方垂直往下）→ 2D 俯视 → 全黑四只眼。#1045：每个音节换一个机位
  // 歌词牌（3D 段）：[词, 亮起时刻, 列, 行]。2D 段的 PLEASE DON'T EAT ME ALIVE 贴在缝外的黑边上（见 make2D）
  words: [['CHAT', 16.60, 'L', 0], ['G', 17.24, 'L', 1], ['P', 17.92, 'L', 2], ['T', 18.36, 'L', 3]],
  // 她的动作（3D 不演戏）：片段 + keys = [[歌曲时刻, 片段本地秒], …]（之间单调三次插值）；fade = 在第一个 key 之前多少秒开始从上一段交叉淡入
  seg: [
    { anim: 'move__hard-landing', keys: [[15.0, 1.00], [15.22, 1.12], [15.62, 2.05]], fade: 0 },                 // 蹲着（手撑地）→ 站起
    { anim: 'act__terrified', keys: [[15.66, 0.78], [15.98, 1.12], [16.15, 1.2]], fade: 0.1 },                    // BOSS：砸墙那一拍被震得一缩
    { anim: 'act__look-around', keys: [[16.3, 0.2], [16.7, 0.6]], fade: 0.32 },                                    // 直起身，仰头看头顶那块光
    { anim: 'act__look-distance', keys: [[16.62, 2.05], [16.95, 2.95], [17.3, 3.3]], fade: 0.1 },                  // Chat：盖子咬第一格，她抬起胳膊挡在额前（从身后看得清的动作）
    { anim: 'act__terrified', keys: [[17.26, 10.55], [17.56, 11.45], [17.95, 11.7]], fade: 0.14 },                 // G：抱头猛地一缩（片段 10.5–11.7 s 那一下，侧面看）
    { anim: 'act__terrified', keys: [[17.95, 12.6], [18.4, 13.4]], fade: 0.12 },                                   // P：还缩着，仰头往上找那道缝（墙顶俯拍）
    { anim: 'act__look-around', keys: [[18.5, 1.0], [19.2, 1.7]], fade: 0.3 },                                     // T：慢慢直起身，仰着脸看正上方（接 2D 第一张）
  ],
  // 头颈叠加：偏航（度，正 = 向她的左 / 西）、仰头（度）
  yaw: [[15.36, 0], [15.48, 42], [15.58, -30], [15.72, 0]],
  pitch: [[16.0, 0], [16.3, 44], [17.2, 40], [17.3, 0], [17.9, 0], [18.05, 46], [18.4, 48], [19.2, 50]],
  // 2D 俯视段：图、起止、亮带高度（占画高）、镜头从多大推到多大、cx / cy = 图上哪一点（0–1，从左 / 从上）对在亮带正中；嘴开 / 嘴合两版的图按歌词逐词换
  k2d: [
    { img: 'k1', t0: 19.08, t1: 19.76, band: 0.46, zoom: [1.0, 1.05], cy: 0.50 },                       // please：全景，她在盒底很小
    { img: 'k2', t0: 19.76, t1: 20.27, band: 0.40, zoom: [1.0, 1.04], cy: 0.38, lip: true },                  // don't：踮脚、一只手伸向镜头
    { img: 'k2', t0: 20.27, t1: 20.84, band: 0.31, zoom: [1.3, 1.36], cx: 0.58, cy: 0.40, lip: true },        // eat：同一张画推近到脸和手，缝再咬一格
    { img: 'k3', t0: 20.84, t1: 21.35, band: 0.20, zoom: [1.0, 1.04], cy: 0.48 },                       // me：仰脸，光只剩压在眼睛上的一条（嘴在亮带外面，不用对口型）
    { img: 'k4', t0: 21.35, t1: 22.3, band: 0.11, zoom: [1.0, 1.06], cy: 0.52, thin: true },            // alive：眼睛大特写，光缝在长音里慢慢收成线、灭掉
  ],
};

export async function makeV401Box(mv, { footLock = true, from = 14.6 } = {}) {
  const { music } = mv;
  const { H, S, ZC } = BOX, HS = S / 2;
  await loadAnims(ANIMS);
  await new FontFace('UIAnton', `url(${new URL('../../../assets/fonts/anton/Anton-Regular.ttf', import.meta.url)})`).load().then(f => document.fonts.add(f));
  const girl = await createGirl(mv);
  mv.stage.renderer.localClippingEnabled = true;
  mv.stage.renderer.shadowMap.enabled = true; mv.stage.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ================================================================ 世界：跑酷段那条路（平的）
  const scene = new THREE.Scene(); scene.background = col('#06060b'); scene.fog = new THREE.Fog('#06060b', 40, 230);
  const run = createSpiralRun({ length: 220, foldStart: 1e9, foldEnd: 2e9, obstacles: [], seed: 21 });
  run.update(0, { d: ZC, fold: 0 });
  { // 盒子摊开要占地方：清掉路边离盒子太近的楼（实例矩阵缩成 0）
    const bm = run.group.children.find(o => o.isInstancedMesh), z = new THREE.Matrix4().makeScale(0, 0, 0);
    run.buildings.forEach((b, i) => { if (Math.abs(b.d - ZC) < 13 && Math.abs(b.s) < 10.5) bm.setMatrixAt(i, z); });
    bm.instanceMatrix.needsUpdate = true;
  }
  scene.add(run.group);
  let starPts = null;
  { const rnd = mulberry32(77), n = 900, p = new Float32Array(n * 3);   // 星、粉月（同 v4-03a）
    for (let i = 0; i < n; i++) { const a = rnd() * Math.PI * 2, e = Math.asin(0.08 + rnd() * 0.92), r = 320; p.set([Math.cos(a) * Math.cos(e) * r, Math.sin(e) * r, Math.sin(a) * Math.cos(e) * r - ZC], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    starPts = new THREE.Points(g, new THREE.PointsMaterial({ color: col(PAL.paper).multiplyScalar(1.4), size: 1.6, sizeAttenuation: false, fog: false })); scene.add(starPts);
    const moon = new THREE.Mesh(new THREE.CircleGeometry(26, 64), new THREE.MeshBasicMaterial({ color: col(PAL.pink).multiplyScalar(1.25), fog: false }));
    moon.position.set(-30, 44, -ZC - 210); moon.lookAt(0, 0, -ZC); scene.add(moon); }

  // ================================================================ 盒子（box 组的原点 = 地板中心；-Z = 前 = 路的方向）
  const box = new THREE.Group(); box.position.set(0, 0.03, -ZC); scene.add(box);
  const TH = 0.14;
  const slate = new THREE.MeshStandardMaterial({ color: '#4a4c70', roughness: 0.58, metalness: 0.12 });
  const tubeGeoCache = new Map();
  function tubeRect(w, d, color, r = 0.03) {       // 板面上沿边一圈霓虹灯管（平放坐标：x 宽、-z 进深）
    const g = new THREE.Group(), mat = new THREE.MeshBasicMaterial({ color: hdr(color, 1.9) }), e = 0.1;
    for (const [len, x, z, rz] of [[w - 2 * e, 0, -e, true], [w - 2 * e, 0, -d + e, true], [d - 2 * e, -w / 2 + e, -d / 2, false], [d - 2 * e, w / 2 - e, -d / 2, false]]) {
      const key = len.toFixed(3); if (!tubeGeoCache.has(key)) tubeGeoCache.set(key, new THREE.CylinderGeometry(r, r, len, 8));
      const m = new THREE.Mesh(tubeGeoCache.get(key), mat); m.position.set(x, r + 0.005, z); if (rz) m.rotation.z = Math.PI / 2; else m.rotation.x = Math.PI / 2; g.add(m);
    }
    return { g, mat, base: hdr(color, 1.9) };
  }
  const seamMat = new THREE.LineBasicMaterial({ color: hdr(PAL.mint, 0.22) }), seamBase = seamMat.color.clone();   // 共用一个材质：合严那一拍要跟灯管一起灭
  function seams(w, d) {                           // 板面上极淡的接缝线
    const pts = []; for (let i = 1; i < 4; i++) { const x = -w / 2 + i * w / 4, z = -i * d / 4; pts.push(x, 0.004, 0, x, 0.004, -d, -w / 2, 0.004, z, w / 2, 0.004, z); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return new THREE.LineSegments(g, seamMat);
  }
  function makeEye(R = 0.72) {                     // HAL 眼：枪灰压圈 + 柠黄三圈环（平放朝上）
    const g = new THREE.Group(), flat = (geo, mat, y) => { const m = new THREE.Mesh(geo, mat); m.rotation.x = -Math.PI / 2; m.position.y = y; g.add(m); return m; };
    flat(new THREE.RingGeometry(R, R * 1.24, 64), new THREE.MeshStandardMaterial({ color: '#5a5a6c', roughness: 0.5, metalness: 0.4 }), 0.012);
    flat(new THREE.CircleGeometry(R, 64), new THREE.MeshBasicMaterial({ color: '#0b0a06' }), 0.013);
    const lit = new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 1.6) });
    flat(new THREE.CircleGeometry(R * 0.26, 40), lit, 0.016);
    for (const k of [0.46, 0.66, 0.86]) flat(new THREE.RingGeometry(R * k - 0.022, R * k + 0.022, 64), lit, 0.016);
    const light = new THREE.PointLight(PAL.lemon, 0, 9, 2); light.position.y = 0.5; g.add(light);
    return { g, lit, light };
  }
  // 一块板：铰链在局部原点、沿 x；平放时朝 -z 伸出去，内面（合上后朝盒内的那面）= 平放时朝上的面（y = 0）
  const winTex = (() => {                           // 墙板外侧：亮窗（合上之后它就是城里的一栋楼）
    const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d'), rnd = mulberry32(5);
    g.fillStyle = '#111120'; g.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 14; y++) for (let x = 0; x < 12; x++) if (rnd() < 0.55) { const h = rnd(); g.fillStyle = h < 0.7 ? '#ffe9b8' : h < 0.85 ? PAL.lemon : h < 0.93 ? PAL.pink : PAL.mint; g.fillRect(x * 42 + 12, y * 36 + 10, 22, 16); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  function makePanel(w, d, color, { eye = true, eyeR = 0.72, eyeAt = [0, d / 2], windows = false, mat = slate } = {}) {
    const tilt = new THREE.Group();
    if (windows) { const o = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: winTex, color: hdr('#ffffff', 1.25) })); o.rotation.x = Math.PI / 2; o.position.set(0, -TH - 0.004, -d / 2); tilt.add(o); }
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, TH, d), mat); m.position.set(0, -TH / 2, -d / 2); m.castShadow = true; m.receiveShadow = true; tilt.add(m);
    const tube = tubeRect(w, d, color); tilt.add(tube.g, seams(w, d));
    let e = null; if (eye) { e = makeEye(eyeR); e.g.position.set(eyeAt[0], 0, -eyeAt[1]); tilt.add(e.g); }
    return { tilt, tube, eye: e };
  }
  const floor = makePanel(S, S, PAL.mint, { eye: false }); floor.tilt.position.z = HS; box.add(floor.tilt);
  const walls = {};
  for (const [k, x, z, ry, color, eye] of [['N', 0, -HS, 0, PAL.pink, { eyeR: 0.45, eyeAt: [0, 3.4], windows: true }], ['S', 0, HS, Math.PI, PAL.lemon, { eyeR: 0.45, eyeAt: [0, 3.4], windows: true }], ['W', -HS, 0, Math.PI / 2, PAL.pink, { eyeR: 0.45, eyeAt: [0, 3.4], windows: true }], ['E', HS, 0, -Math.PI / 2, PAL.mint, { eyeR: 0.45, eyeAt: [0, 3.4], windows: true }]]) {
    const hinge = new THREE.Group(); hinge.position.set(x, 0, z); hinge.rotation.y = ry;
    const p = makePanel(S, S, color, eye); hinge.add(p.tilt); box.add(hinge); walls[k] = p;
  }
  const lidMat = new THREE.MeshStandardMaterial({ color: '#08080c', roughness: 0.95, metalness: 0 });
  const rimMat = new THREE.MeshBasicMaterial({ color: hdr(PAL.mint, 1.25) }), FL = HS + TH + 0.01;      // 半盖的长度：铰链在墙外沿，所以比半个盒宽多出一个墙厚，合上才是严的
  const flaps = ['N', 'S'].map(k => { const f = makePanel(S, FL, PAL.mint, { eye: false, mat: lidMat }); f.tilt.position.set(0, -TH - 0.01, -S); walls[k].tilt.add(f.tilt);
    const rim = new THREE.Mesh(new THREE.BoxGeometry(S - 0.2, 0.02, 0.022), rimMat); rim.position.set(0, -TH - 0.012, -FL + 0.012); f.tilt.add(rim);      // 盖板外面（朝天那面）自由边上也有一道灯管：从正上方看，缝的两条边是亮的（和 2D 段的亮带边一样）
    return f; });   // 两扇半盖：挂在左、右墙的顶沿（铰链在墙外侧，折起来时贴在墙外面）
  // ALIVE：一块大招牌劈成两半，各装在一扇半盖的内面、贴着自由边；盖子合上，两半正好拼成整块（仰拍时读得正：上 = 前，左 = 东）
  const alive = (() => {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 480; const g = c.getContext('2d');
    g.fillStyle = '#0d0c14'; g.fillRect(0, 0, 1024, 480);
    g.strokeStyle = PAL.mint; g.lineWidth = 22; g.strokeRect(11, 11, 1002, 458);
    g.fillStyle = '#F2EDE4'; g.font = '330px "UIAnton", "Anton", Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('ALIVE', 512, 256);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const mat = new THREE.MeshBasicMaterial({ map: tex, color: hdr('#ffffff', 1.5) }), PW = 2.5, PH = PW * 480 / 1024;
    const half = (flap, u0, X, Y) => {
      const geo = new THREE.PlaneGeometry(PW / 2, PH), uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, u0 + uv.getX(i) * 0.5);
      const m = new THREE.Mesh(geo, mat); m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(X, Y, new THREE.Vector3().crossVectors(X, Y)));
      m.position.set(0, 0.03, -(HS - PW / 4)); flap.tilt.add(m); return m;
    };
    const parts = [half(flaps[1], 0, new THREE.Vector3(0, 0, -1), new THREE.Vector3(-1, 0, 0)), half(flaps[0], 0.5, new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 0))];
    return { mat, parts };
  })();
  const wallAngle = (k, T) => {
    const h = BOX.hit[k], u = (T - (h - BOX.rise[k])) / BOX.rise[k];
    if (u <= 0) return 0; if (u < 1) return 90 * u ** 3;              // 越砸越快
    const a = T - h; return 90 - 2.0 * Math.exp(-a * 14) * Math.abs(Math.sin(a * 38));        // 砸到位后弹两下
  };
  // 盖子：棘轮。每一格 0.09 秒咬到位、带一点回弹；第一格是从墙外侧（-180°）翻上墙顶；最后一格之后匀速收到合严（BOX.cut.shut）
  const gapAt = T => {
    const G = BOX.gap; if (T < G[0][0]) return 1;
    let g = 1; for (const [t, v] of G) { if (T < t) break; const p = clamp((T - t) / 0.09); g = lerp(g, v, 1 - (1 - p) ** 3); }
    if (T > BOX.cut.top + 0.09 && T < BOX.cut.k2d) g *= lerp(1, 0.87, (T - BOX.cut.top - 0.09) / (BOX.cut.k2d - BOX.cut.top - 0.09));   // T 的拖音里缝没停，还在慢慢收
    const last = G[G.length - 1]; if (T > last[0] + 0.09) g = last[1] * clamp(1 - (T - last[0] - 0.09) / (BOX.cut.shut - 0.04 - last[0] - 0.09));
    return g;
  };
  const lidAngle = T => {
    const t1 = BOX.gap[0][0]; if (T < t1) return -180;
    const a = Math.asin(clamp(1 - gapAt(T))) / D2R;
    if (T < t1 + 0.22) { const p = (T - t1) / 0.22; return lerp(-180, Math.asin(1 - BOX.gap[0][1]) / D2R, 1 - (1 - p) ** 2.2); }
    let b = 0; for (const [t] of BOX.gap) { const k = T - t - 0.09; if (k > 0) b += 2.2 * Math.exp(-k * 16) * Math.abs(Math.sin(k * 36)); }   // 咬到位后往回弹一下
    return Math.max(0, a - b);
  };
  const clickAt = (T, d = 0.2) => { let v = 0; for (const [t] of BOX.gap) if (T >= t) v += Math.exp(-(T - t) / d); return v; };

  // ================================================================ 砸墙那一拍：墙缝喷出来的火花、墙脚炸开的尘土
  const NSP = 520, spPos = new Float32Array(NSP * 3), spCol = new Float32Array(NSP * 3), spGeo = new THREE.BufferGeometry();
  spGeo.setAttribute('position', new THREE.BufferAttribute(spPos, 3)); spGeo.setAttribute('color', new THREE.BufferAttribute(spCol, 3));
  const sparks = new THREE.Points(spGeo, new THREE.PointsMaterial({ size: 3.2, sizeAttenuation: false, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); sparks.frustumCulled = false; box.add(sparks);
  const spData = (() => { const rnd = mulberry32(88), d = [];
    for (let i = 0; i < NSP; i++) {
      const cx = rnd() < 0.5 ? -1 : 1, cz = rnd() < 0.5 ? -1 : 1, top = rnd() < 0.25;                      // 四条竖缝为主，四分之一从墙顶沿喷
      const o = top ? new THREE.Vector3((rnd() * 2 - 1) * HS, S, cz * HS) : new THREE.Vector3(cx * HS, rnd() * S, cz * HS); if (top && rnd() < 0.5) o.set(cx * HS, S, (rnd() * 2 - 1) * HS);
      const a = Math.atan2(o.z, o.x) + (rnd() - 0.5) * 1.2, sp = 2.5 + rnd() * 7;
      d.push({ o, v: new THREE.Vector3(Math.cos(a) * sp, 1 + rnd() * 5, Math.sin(a) * sp), life: 0.3 + rnd() * 0.6, hot: rnd() < 0.35 });
    } return d; })();
  const dustTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(0.5, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
  const dust = (() => { const rnd = mulberry32(89), d = [];
    for (let i = 0; i < 28; i++) { const side = i % 4, u = (rnd() * 2 - 1) * HS, o = side === 0 ? [u, -HS] : side === 1 ? [u, HS] : side === 2 ? [-HS, u] : [HS, u], n = side === 0 ? [0, -1] : side === 1 ? [0, 1] : side === 2 ? [-1, 0] : [1, 0];
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: dustTex, color: col('#8a84b8'), transparent: true, opacity: 0, depthWrite: false })); box.add(sp);
      d.push({ sp, o, n, v: 1.2 + rnd() * 2.6, r: 0.5 + rnd() * 0.9, life: 0.6 + rnd() * 0.5, y: 0.15 + rnd() * 0.5 }); }
    return d; })();
  const _lem = col(PAL.lemon), _wht = col('#ffffff');
  function slamFx(T) {
    const k = T - BOX.hit.N; sparks.visible = k > 0 && k < 1.0;
    for (const q of dust) { const u = k / q.life; q.sp.visible = k > 0 && u < 1; if (!q.sp.visible) continue;
      const dd = q.v * q.life * (1 - (1 - u) ** 2); q.sp.position.set(q.o[0] + q.n[0] * dd, q.y + 0.5 * u, q.o[1] + q.n[1] * dd); q.sp.scale.setScalar(q.r * (0.5 + 2.2 * u)); q.sp.material.opacity = 0.34 * (1 - u) ** 1.5; }
    if (!sparks.visible) return;
    spData.forEach((q, i) => { const u = k / q.life, a = u < 1 ? (1 - u) ** 2 : 0, dr = (1 - Math.exp(-k * 3)) / 3;    // 速度按指数衰减（空气阻力）
      spPos.set([q.o.x + q.v.x * dr, Math.max(0.02, q.o.y + q.v.y * dr - 4.9 * k * k), q.o.z + q.v.z * dr], i * 3);
      const c = q.hot ? _wht : _lem; spCol.set([c.r * 2.4 * a, c.g * 2.4 * a, c.b * 2.4 * a], i * 3); });
    spGeo.attributes.position.needsUpdate = spGeo.attributes.color.needsUpdate = true;
  }

  // ================================================================ 光：每个开口一盏投影平行光
  const hemi = new THREE.HemisphereLight('#6f78e6', '#221848', 0.3); scene.add(hemi);       // 盒内底色：跑酷段的深蓝紫
  const fills = [[PAL.pink, 0, 0.35, -1.85], [PAL.mint, 0, 0.35, 1.85]].map(([c, x, y, z]) => { const l = new THREE.PointLight(c, 0, 7, 2); l.position.set(x, y, z); box.add(l); return l; });   // 板边灯管给墙脚的一点色光
  const L = {};
  for (const [k, color, intensity, dir] of [
    ['W', PAL.mint, 1.5, [-Math.cos(25 * D2R), Math.sin(25 * D2R), 0]],
    ['E', PAL.lemon, 1.3, [Math.cos(25 * D2R), Math.sin(25 * D2R), 0]],
    ['S', '#dfe4ff', 1.9, [0, Math.sin(27 * D2R), Math.cos(27 * D2R)]],
    ['N', '#ff5a9c', 2.4, [0, Math.sin(17 * D2R), -Math.cos(17 * D2R)]],
    ['T', '#e8fff6', 2.3, [0, 1, 0.012]],
  ]) {
    const l = new THREE.DirectionalLight(color, intensity), v = new THREE.Vector3(...dir).normalize();
    l.position.copy(v).multiplyScalar(16).add(new THREE.Vector3(0, 1.5, 0)); l.target.position.set(0, 1.5, 0);
    l.castShadow = true; l.shadow.mapSize.set(2048, 2048); l.shadow.bias = -0.0006; l.shadow.normalBias = 0.025; l.shadow.radius = 3;
    Object.assign(l.shadow.camera, { left: -5.5, right: 5.5, top: 6.5, bottom: -5.5, near: 2, far: 34 }); l.shadow.camera.updateProjectionMatrix();
    box.add(l, l.target); L[k] = l; l.userData.base = intensity;
  }
  const topSpot = new THREE.PointLight('#e2f0ff', 0, 6.5, 1.5); topSpot.position.set(0, 3.0, -0.2); box.add(topSpot);
  // 光柱：两扇半盖之间那道缝正下方的一片薄雾（一摞朝镜头的半透明片，宽度每帧跟缝走）
  const shaft = new THREE.Group(); shaft.rotation.y = Math.PI / 2; box.add(shaft);
  const shaftTex = (() => { const c = document.createElement('canvas'); c.width = 64; c.height = 256; const g = c.getContext('2d');
    const v = g.createLinearGradient(0, 0, 0, 256); v.addColorStop(0, 'rgba(255,255,255,1)'); v.addColorStop(1, 'rgba(255,255,255,0.35)'); g.fillStyle = v; g.fillRect(0, 0, 64, 256);
    g.globalCompositeOperation = 'destination-in'; const h = g.createLinearGradient(0, 0, 64, 0); h.addColorStop(0, 'rgba(0,0,0,0)'); h.addColorStop(0.25, 'rgba(0,0,0,1)'); h.addColorStop(0.8, 'rgba(0,0,0,1)'); h.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = h; g.fillRect(0, 0, 64, 256);
    return new THREE.CanvasTexture(c); })();
  const slitGlow = new THREE.Mesh(new THREE.PlaneGeometry(1, S), new THREE.MeshBasicMaterial({ color: hdr('#dff7ee', 1.2), side: THREE.DoubleSide, fog: false })); slitGlow.rotation.x = Math.PI / 2; box.add(slitGlow);
  const NSH = 14, shaftMat = new THREE.MeshBasicMaterial({ map: shaftTex, color: col('#dff7ee'), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  for (let i = 0; i < NSH; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, S), shaftMat); m.position.set(0, HS, lerp(-HS + 0.15, 1.2, i / (NSH - 1))); shaft.add(m); }

  // ================================================================ 歌词牌（做法同 v4-03a 的 makeSign：墨底 + 霓虹边 + 白字）
  const TXT = { L: 0.36 }, ROW_Y = { L: [0.4, 0.05, -0.3, -0.65] /* 行的位置 = 画面纵向 NDC */ }, COL = { L: PAL.pink };
  const signs = BOX.words.map(([text, at, column, row]) => {
    const g = new THREE.Group();
    const { texture, aspect } = textTexture(text, { font: '"UIAnton", "Anton", Impact, sans-serif', px: 170 });
    const TXT_H = TXT[column], tw = TXT_H * aspect * 0.86, bw = tw + 0.13, bh = TXT_H + 0.15;
    const edgeMat = new THREE.MeshBasicMaterial({ color: hdr(COL[column], 1.3) });
    const edge = new THREE.Mesh(new THREE.PlaneGeometry(bw + 0.09, bh + 0.09), edgeMat);
    const board = new THREE.Mesh(new THREE.PlaneGeometry(bw, bh), new THREE.MeshBasicMaterial({ color: '#0d0c14' })); board.position.z = 0.01;
    const txt = new THREE.Mesh(new THREE.PlaneGeometry(tw, TXT_H), new THREE.MeshBasicMaterial({ map: texture, transparent: true, color: col(PAL.paper), depthWrite: false })); txt.position.z = 0.02;
    g.add(edge, board, txt); g.visible = false; box.add(g);
    return { text, at, column, row, g, edgeMat, edgeCol: edgeMat.color.clone(), bw: bw + 0.09, bh: bh + 0.09, th: TXT_H };
  });
  const gptHud = new THREE.Group(); gptHud.position.z = -1;              // 挂到镜头上（cam 建好之后 add）；每帧按 fov 缩放：组里的 y ∈ [-1, 1] = 整个画高
  { let x = 96; for (const s of signs) { const k = (176 / 540) / s.bh, wpx = s.bw * k * 540; s.k = k; s.g.scale.setScalar(k); s.g.position.set((x + wpx / 2 - 960) / 540, (540 - 116) / 540, 0); x += wpx + 14; gptHud.add(s.g);
      s.g.traverse(o => { if (o.material) { o.material.depthTest = false; o.material.depthWrite = false; o.material.fog = false; } }); s.g.children.forEach((o, i) => { o.renderOrder = 9 + i; }); } }
  const CAM_IN = new THREE.Vector3(1.45, 0.75, 1.95), TGT_IN = new THREE.Vector3(-0.7, 2.7, -2.0), FOV_IN = 80;   // 机位 1：盒内后墙角仰拍，她的右后 3/4（不正对着她的背）

  // ================================================================ 她
  const segs = BOX.seg.map(s => ({ ...s, t0: s.keys[0][0], m: getAnim(s.anim) }));
  const segPose = (s, T) => s.m.solve(pchip(s.keys, T) / s.m.srcPeriod, girl.dancer);
  function poseAt(T) {
    let i = 0; for (let k = 0; k < segs.length; k++) if (segs[k].t0 - segs[k].fade <= T) i = k;
    const s = segs[i];
    if (i > 0 && T < s.t0) return blendSolved(segPose(segs[i - 1], T), segPose(s, T), smooth((T - (s.t0 - s.fade)) / s.fade));
    return segPose(s, T);
  }
  const I = girl.dancer.S.info, _v = new THREE.Vector3(), _q = new THREE.Quaternion(), _qp = new THREE.Quaternion(), _qr = new THREE.Quaternion();
  const AX = { yaw: new THREE.Vector3(0, 1, 0), pitch: new THREE.Vector3(1, 0, 0) };
  function addWorldRot(bone, axis, rad) {            // 在世界坐标里给一根骨头叠一个转动（后面的子骨头跟着走）
    if (!rad) return;
    bone.parent.updateWorldMatrix(true, false); bone.parent.getWorldQuaternion(_qp); bone.getWorldQuaternion(_q);
    _qr.setFromAxisAngle(axis, rad); bone.quaternion.copy(_qp.invert().multiply(_qr.multiply(_q))); bone.updateMatrixWorld(true);
  }
  // 斜站的片段（square）：量出它胯线偏了多少度，在这一段里把根反着转回来（淡入窗口里转过去，段末转回来）
  const hipYaw = s => { girl.root.position.set(0, 0, 0); girl.root.rotation.set(0, Math.PI, 0); girl.root.scale.setScalar(H); girl.root.updateMatrixWorld(true); girl.dancer.apply(segPose(s, s.t0 + 0.02)); girl.root.updateMatrixWorld(true);
    const a = I.LeftUpLeg.bone.getWorldPosition(new THREE.Vector3()), b = I.RightUpLeg.bone.getWorldPosition(new THREE.Vector3()); return Math.atan2(b.z - a.z, b.x - a.x); };   // 正对 -Z 时右胯在 +X：角度 0
  for (const s of segs) if (s.square) { s.yaw0 = hipYaw(s); s.tEnd = s.keys[s.keys.length - 1][0]; }
  const rootYaw = T => { let y = 0; for (const s of segs) if (s.square) y += s.yaw0 * smooth((T - (s.t0 - s.fade)) / s.fade) * (1 - smooth((T - s.tEnd) / 0.2)); return y; };
  const P0 = new THREE.Vector3(0, 0, -0.2);       // 根位置（box 局部）：盒子正中、盖缝正下方（最后一个机位从缝的正上方往下看，她得在缝里）
  const rootOff = new THREE.Vector3();
  function poseGirl(T, off = rootOff) {
    box.add(girl.root); girl.root.visible = true; girl.root.scale.setScalar(H);
    girl.root.position.copy(P0).add(off); girl.root.rotation.set(0, Math.PI + rootYaw(T), 0);
    girl.root.updateMatrixWorld(true);
    girl.dancer.apply(poseAt(T));
    girl.root.updateMatrixWorld(true);
    const yaw = pchip(BOX.yaw, T) * D2R, pit = pchip(BOX.pitch, T) * D2R;
    if (yaw || pit) for (const [k, w] of [['Spine2', 0.15], ['Neck', 0.35], ['Head', 0.5]]) { addWorldRot(I[k].bone, AX.yaw, yaw * w); addWorldRot(I[k].bone, AX.pitch, pit * w); }
  }
  const bonePos = (k, out = new THREE.Vector3()) => box.worldToLocal(I[k].bone.getWorldPosition(out));
  // 脚锁：片段都是「原地版」（胯的水平位移被清零 → 重心一动脚就在地上滑）。这里反过来：把支撑脚钉在地上，滑动量变成根的位移。
  //   支撑脚要往后看：选「接下来 0.3 s 一直贴地」的那只（只看当前谁低会选到马上要迈出去的脚，根就被甩出去）。两脚都离地（起跳）时根不动。
  //   偏移和 P0 无关，所以先算表、再定 P0.z。最后对表做一点时间平滑，抹掉换脚那一帧的毛刺。
  const FPS = 60, T_A = 14.6, T_B = 19.3, offTab = [];
  { const FEET = ['LeftToeBase', 'RightToeBase'], LOW = 0.15, zero = new THREE.Vector3(), fr = [];
    scene.updateMatrixWorld(true);
    for (let f = 0; f <= Math.round((T_B - T_A) * FPS); f++) { poseGirl(T_A + f / FPS, zero); fr.push(Object.fromEntries(FEET.map(k => [k, bonePos(k)]))); }
    const ahead = (k, f, n) => { let m = 0; for (let i = f; i <= Math.min(fr.length - 1, f + n); i++) m = Math.max(m, fr[i][k].y); return m; };
    let anchor = null; const off = new THREE.Vector3(), raw = [];
    for (let f = 0; f < fr.length; f++) {
      if (footLock) {
        if (anchor && f > 0) { off.x -= fr[f][anchor].x - fr[f - 1][anchor].x; off.z -= fr[f][anchor].z - fr[f - 1][anchor].z; }
        if (anchor && ahead(anchor, f, 6) > LOW) anchor = null;
        else if (anchor && ahead(anchor, f, 18) > LOW) { const o = FEET.find(k => k !== anchor); if (fr[f][o].y <= LOW && ahead(o, f, 18) <= LOW) anchor = o; }   // 这只快要抬了、另一只站得住：提前换
        if (!anchor) { const c = FEET.filter(k => fr[f][k].y <= LOW).sort((a, b) => ahead(a, f, 18) - ahead(b, f, 18)); anchor = c[0] ?? null; }
      }
      raw.push(off.clone());
    }
    const G = [0, 0.08, 0.84, 0.08, 0];
    for (let f = 0; f < raw.length; f++) { const o = new THREE.Vector3(); G.forEach((w, i) => o.addScaledVector(raw[clamp(f + i - 2, 0, raw.length - 1)], w)); offTab.push(o); }
  }
  const offAt = T => { const x = clamp((T - T_A) * FPS, 0, offTab.length - 1), i = Math.floor(x), j = Math.min(offTab.length - 1, i + 1); return rootOff.copy(offTab[i]).lerp(offTab[j], x - i); };

  // ================================================================ 衔接：从上面倒下来的方块、她脚下的环形招牌
  const buildPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e3); girl.voxel.material.clippingPlanes = [buildPlane];
  const BR = BOX.bridge, crouch = (() => { poseGirl(BR.land[1], offAt(BR.land[1])); return ['Hips', 'Head', 'LeftHand', 'RightHand', 'LeftFoot', 'RightFoot', 'Spine2', 'LeftLeg', 'RightLeg'].map(k => bonePos(k)); })();
  const NC = 1100, cubes = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: '#ffffff' }), NC); cubes.frustumCulled = false; box.add(cubes);
  // 方块的颜色和像素墙上掉下来的是同一批：肤色、发色、外套、短裤、护目镜
  const cubeData = (() => { const rnd = mulberry32(41), pal = ['#f1c9b3', '#f1c9b3', '#7a4a2e', '#7a4a2e', PAL.pink, PAL.mint, '#F2EDE4', '#c9d0d0'], c = new THREE.Color(), d = [];
    for (let i = 0; i < NC; i++) {
      const b = crouch[Math.floor(rnd() * crouch.length)], tgt = b.clone().add(new THREE.Vector3((rnd() - 0.5) * 0.5, (rnd() - 0.5) * 0.4, (rnd() - 0.5) * 0.5)); tgt.y = Math.max(0.05, tgt.y);
      d.push({ tgt, land: lerp(BR.land[0], BR.land[1], (tgt.y / 1.4 * 0.7 + rnd() * 0.3)), drift: new THREE.Vector3((rnd() - 0.5) * 3.2, 0, (rnd() - 0.5) * 3.2), size: 0.06 + rnd() * 0.07, spin: rnd() * 6.28 });   // 脚先到、头后到
      cubes.setColorAt(i, c.set(pal[Math.floor(rnd() * pal.length)]).multiplyScalar(1.15));
    }
    return d; })();
  const _m4 = new THREE.Matrix4(), _e = new THREE.Euler(), _sc = new THREE.Vector3(), _ps = new THREE.Vector3(), _qq = new THREE.Quaternion();
  function placeCubes(T) {
    cubes.visible = T < BR.land[1] + 0.05; if (!cubes.visible) return;
    cubeData.forEach((q, i) => {
      const tau = q.land - T;                           // 还有多久落到位；落到位就没了（被吸进人形）
      if (tau <= 0) { cubes.setMatrixAt(i, _m4.makeScale(0, 0, 0)); return; }
      _ps.copy(q.tgt).addScaledVector(q.drift, Math.min(1, tau * 1.2)); _ps.y += 9 * tau + 14 * tau * tau;
      cubes.setMatrixAt(i, _m4.compose(_ps, _qq.setFromEuler(_e.set(q.spin + tau * 5, q.spin * 2 + tau * 3, 0)), _sc.setScalar(q.size * (1 + 2.6 * Math.min(1, tau / 0.6)))));   // 离得远时大一点（从高处看得见），落到位时缩回体素大小
    });
    cubes.instanceMatrix.needsUpdate = true;
  }
  // AND YOU'RE MY BOSS：四块招牌挂在镜头前（屏幕右下，俯冲和外景里都正对镜头）；没唱到时是暗的灯管，BOSS 最大，一直留到切进盒内
  const bossSigns = (cam) => {
    const FOV = 52, u = 2 * Math.tan(FOV * Math.PI / 360) / 1080, list = [], hud = new THREE.Group(); cam.add(hud);
    const mk = (text, at, hpx, color) => {
      const c = document.createElement('canvas'), g0 = c.getContext('2d'); g0.font = '170px "UIAnton", "Anton", Impact, sans-serif';
      c.width = Math.ceil(g0.measureText(text).width) + 110; c.height = 270; const g = c.getContext('2d');
      g.fillStyle = '#0d0c14'; g.fillRect(0, 0, c.width, c.height); g.strokeStyle = color; g.lineWidth = 16; g.strokeRect(8, 8, c.width - 16, c.height - 16);
      g.fillStyle = '#F2EDE4'; g.font = '170px "UIAnton", "Anton", Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, c.width / 2, 143);
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
      const mat = new THREE.MeshBasicMaterial({ map: tex, depthTest: false }), wpx = hpx * c.width / c.height, m = new THREE.Mesh(new THREE.PlaneGeometry(wpx * u, hpx * u), mat); m.renderOrder = 9; hud.add(m);
      const s = { m, mat, at, wpx, hpx }; list.push(s); return s;
    };
    const row = [mk('AND', 15.02, 132, PAL.lemon), mk("YOU'RE", 15.20, 132, PAL.lemon), mk('MY', 15.42, 132, PAL.lemon)], boss = mk('BOSS', 15.66, 230, PAL.lemon);
    let x = 1880 - (row.reduce((a, s) => a + s.wpx, 0) + 14 * (row.length - 1));
    for (const s of row) { s.m.position.set((x + s.wpx / 2 - 960) * u, (540 - 770) * u, -1); x += s.wpx + 14; }
    boss.m.position.set((1880 - boss.wpx / 2 - 960) * u, (540 - 965) * u, -1);
    return T => { const k = Math.tan(cam.fov * Math.PI / 360) / Math.tan(FOV * Math.PI / 360); hud.scale.set(k, k, 1); for (const s of list) { const a = T - s.at; s.m.visible = T >= 14.95 && T < 16.5; /* 跨过切进盒内那一刀再留半秒：BOSS 要读得完 */ s.mat.color.setScalar(a >= 0 ? 1.1 + 0.7 * Math.exp(-a / 0.25) : 0.3); s.m.scale.setScalar(a >= 0 ? lerp(0.9, 1, 1 - (1 - clamp(a / 0.1)) ** 3) : 0.9); } };
  };

  // ================================================================ 镜头
  const cam = new THREE.PerspectiveCamera(64, 16 / 9, 0.05, 1200); scene.add(cam);
  const drawBoss = bossSigns(cam); cam.add(gptHud);
  const shake = T => { let y = 0; const ev = [[BOX.hit.N, 0.22], ...BOX.gap.slice(1).map(([t]) => [t + 0.07, 0.05])]; for (const [t, a] of ev) { const k = T - t; if (k > 0) y += a * Math.exp(-k * 9) * Math.sin(k * 55); } return y; };
  const camPos = new THREE.Vector3(), camTgt = new THREE.Vector3(), V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const TOP = { y: 40, z: 0.09, fov: 3.0 };       // 机位 4：算好让 19.08 那一帧盖缝占画高约一半、缝的中线在画面 56% 高处（= 2D 第一张的亮带）
  function placeCam(T) {
    cam.up.set(shake(T + 0.013) * 0.12, 1, 0).normalize();
    if (T < BOX.cut.inside) {                        // 跟着方块从正上方掉下来（俯视，上 = 前），再摆到外景斜上方的大全景：四面墙同时砸上看得全
      const K = k => pchip(k, T);
      camPos.set(K([[14.6, 0.3], [15.05, 1.2], [15.5, 6.0], [15.95, 6.5]]), K([[14.6, 30], [15.0, 15], [15.3, 9.5], [15.5, 7.6], [15.95, 7.0]]), K([[14.6, 0.4], [15.05, 1.6], [15.5, 7.0], [15.95, 7.5]]));
      camTgt.set(0, K([[14.6, 0], [15.2, 0.5], [15.5, 1.9], [15.95, 2.1]]), K([[14.6, 0], [15.5, 0], [15.95, 0]]));
      const tilt = smooth((T - 15.0) / 0.45); cam.up.set(0, tilt, -(1 - tilt)).normalize(); camPos.y += shake(T); camPos.x += shake(T + 0.02) * 0.6; cam.fov = 52;
    } else if (T < BOX.cut.shut) {                   // 盒内仰拍，机位不动：左下是她，右上一摞 CHAT G P T，头顶是那道一格格变窄的光。每「咔」一下镜头微震
      const C = BOX.cut;
      if (T < C.side) { camPos.copy(CAM_IN).y += shake(T); camTgt.copy(TGT_IN); cam.fov = FOV_IN; }                       // 1 Chat：身后低机位仰拍，前墙居中，两扇盖子从画面上下压进来
      else if (T < C.high) { const u = (T - C.side) / (C.high - C.side); camPos.set(2.0, 1.2 + shake(T), 0.75 - 0.25 * u); camTgt.set(0, 1.15, 0); cam.fov = 56; }   // 2 G：侧面中景，慢慢横移；盖子的影子从她前后两边压过来
      else if (T < C.top) { camPos.set(1.55, 3.7 + shake(T), 1.55); camTgt.set(0, 0.95, 0); cam.fov = 46; }               // 3 P：墙顶高处斜俯，她仰头，四面墙往她身上压
      else {                                                                                                               // 4 T：盖缝正上方，垂直往下，长焦（近乎正投影）。画面上 = 南，她仰起的脸额头朝上；缝是横的
        const u = (T - C.top) / (C.k2d - C.top);
        camPos.set(0, TOP.y, TOP.z + shake(T) * 0.3); camTgt.set(0, 0, TOP.z + shake(T) * 0.3); cam.up.set(0, 0, 1); cam.fov = lerp(TOP.fov * 1.12, TOP.fov, u);   // 拖音里慢慢往下压
      }
    } else {                                         // 合严：盒子正中朝上看，四面墙上四只眼
      camPos.set(0, 0.3, 0); camTgt.copy(camPos).y += 5; camTgt.z -= 0.02;
      cam.up.set(0, 0, -1); cam.fov = 82;
    }
    cam.position.copy(box.localToWorld(camPos.clone())); cam.lookAt(box.localToWorld(camTgt.clone()));
    cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
  }

  // ================================================================ 每帧
  const hitPulse = (T, t, d = 0.25) => (T >= t ? Math.exp(-(T - t) / d) : 0);
  function world(T) {
    for (const k of 'NSWE') walls[k].tilt.rotation.x = wallAngle(k, T) * D2R;
    const psi = lidAngle(T), shut = T >= BOX.cut.shut; for (const f of flaps) f.tilt.rotation.x = psi * D2R;
    // 眼：一直亮着；自己那面墙砸上的一拍闪一下；全合上之后是盒里主要的光
    const dark = 0, eyeIn = shut ? smooth((T - BOX.cut.shut) / 0.07) : 1;      // 合严后四只眼 0.07 秒亮起来
    for (const k of 'NSWE') { const e = walls[k].eye, p = hitPulse(T, BOX.hit[k]), up = wallAngle(k, T) > 80; const open = smooth((T - BR.boss) / 0.12); e.lit.color.copy(hdr(PAL.lemon, (lerp(0.1, 1.15, open) + 1.6 * p + 1.4 * hitPulse(T, BR.boss, 0.3)) * eyeIn)); e.light.intensity = shut ? 0 : (up ? 0.25 : 0) + 1.2 * p + 0.25 * dark; }   // boss 那一拍四只眼一起睁开。眼只当「看得见的东西」，不拿它照亮整面墙
    const off = shut ? 0 : 1;                                           // 合严：灯管、网格、外面的光全灭，只剩四只眼
    seamMat.color.copy(seamBase).multiplyScalar(Math.min(1, off));
    if (starPts) starPts.visible = !shut;                               // 合严后盖缝里不该再漏星星
    for (const k in L) L[k].intensity = shut ? 0 : L[k].userData.base;
    const top = !shut && T >= BOX.cut.top; if (top) L.T.intensity = 0.5;   // 正上方机位：顶光压暗，换成她头顶一盏近光，地上是一圈亮、四周暗（接近 2D 第一张）
    topSpot.intensity = top ? 10 : 0;      // 合严后外面的光一点都进不来（阴影挡不干净，直接关）
    for (const k of 'NSWE') { const w = walls[k]; w.tube.mat.color.copy(w.tube.base).multiplyScalar((1 + 3.2 * hitPulse(T, BOX.hit[k], 0.22) + 0.8 * clickAt(T, 0.12)) * off); }
    floor.tube.mat.color.copy(floor.tube.base).multiplyScalar((1 + 3.2 * hitPulse(T, BOX.hit.N, 0.22)) * off);
    for (const p of flaps) p.tube.mat.color.copy(p.tube.base).multiplyScalar((1 + 2.4 * clickAt(T, 0.14)) * off);      // 每「咔」一下盖沿的灯管闪一下
    const closed = smooth((T - BOX.hit.N) / 0.3); fills[0].intensity = (shut ? 0 : 1.6) * closed; fills[1].intensity = (shut ? 0 : 1.1) * closed;
    // 光柱：缝在正中，宽 = 两扇盖子自由边之间。缝窄了才看得出是「一道」光
    const gap = S * (1 - Math.sin(Math.max(0, psi) * D2R)), k = psi > 0 ? smooth((1.9 - gap) / 0.7) * smooth(gap / 0.12) : 0;
    shaft.visible = k > 0.01;
    shaftMat.opacity = 0.02 * k;
    shaft.children.forEach(m => { m.scale.x = gap; m.position.x = 0; });
    slitGlow.visible = T >= BOX.cut.inside && T < BOX.cut.top && !shut;      /* 机位 4 在它上面往下看：收掉，不然挡镜头 */ slitGlow.scale.set(S * 3, 3, 1); slitGlow.position.y = S + HS + 0.4;   // 只在盒内镜头里出现：盖子上方一整片天光（从缝里看上去头顶是亮的）
    hemi.intensity = shut ? 0 : lerp(0.3, 0.62, closed);
    for (const s of signs) {
      const a = T - s.at; s.g.visible = a >= 0 && T < BOX.cut.k2d;
      if (!s.g.visible) continue;
      s.g.scale.setScalar(s.k * lerp(0.88, 1, 1 - (1 - clamp(a / 0.1)) ** 3));
      s.edgeMat.color.copy(s.edgeCol).multiplyScalar(1 + 2.2 * Math.exp(-a / 0.3));
    }
    for (const m of alive.parts) m.visible = false;                     // ALIVE 现在在 2D 段的黑边上
    slamFx(T);
    placeCubes(T);
    poseGirl(T, offAt(T));
    buildPlane.constant = T < BR.voxel ? box.position.y + lerp(0.02, 1.6, clamp((T - BR.land[0]) / (BR.land[1] - BR.land[0]))) : 1e3;
    if (T < BR.land[0]) girl.root.visible = false;
    else if (T < BR.voxel) girl.setSkin('voxel', T);                                                                    // 体素的她：方块落到哪一层，就露出到哪一层（从脚往上堆）
    else if (T < BR.toon) girl.morph('voxel', 'toon', (T - BR.voxel) / (BR.toon - BR.voxel), T);
    else girl.setSkin('toon', T);
    girl.mesh.castShadow = true; girl.mesh.receiveShadow = true;
    placeCam(T); drawBoss(T); { const k = Math.tan(cam.fov * Math.PI / 360); gptHud.scale.set(k, k, 1); }
    if (shut) girl.root.visible = false;
    if (girl.face) girl.face.update(T, { expression: T > BOX.hit.N ? 'surprised' : 'neutral', camera: cam });
  }
  const kick = (T, t, a) => (T >= t ? a * Math.exp(-(T - t) * 9) : 0);
  const post = T => {
    const c = kick(T, BOX.hit.N, 1.3) + 0.3 * clickAt(T, 0.1), f = T >= BOX.hit.N ? 0.22 * Math.exp(-(T - BOX.hit.N) * 16) : 0;
    return { bloom: { strength: 0.8, threshold: 1.0 }, chroma: 0.08 + c, grade: { vignette: 0.4 }, flash: { amount: f, color: '#ffffff' } };
  };
  const shot3d = { id: 'box', t0: from, t1: BOX.cut.k2d, transitionIn: { kind: 'cut' }, build() { return {}; }, update(_, T) { world(T); return { scene, camera: cam, post: post(T) }; } };
  const shots = [shot3d, await make2D(), { ...shot3d, id: 'box-shut', t0: BOX.cut.shut, t1: 22.6 }];

  // ================================================================ 2D 俯视段（19.08–22.3）：从正上方透过盖缝往下看。画面 = 关键画 + 上下两块盖板（黑）+ 盖沿的灯管
  //   亮带（盖缝）高度按镜头一档档收，和 3D 里的棘轮是同一道缝；歌词牌贴在上面的黑边里；嘴开 / 嘴合两版图按歌词逐词换
  async function make2D() {
    const sc = new THREE.Scene(); sc.background = col('#020203');
    const cam2 = new THREE.OrthographicCamera(-8, 8, 4.5, -4.5, 0, 10); cam2.position.z = 5;
    const dir = new URL('../../cast-cyber-girl/closeup/topdown/', import.meta.url), loader = new THREE.TextureLoader();
    const load = async name => {
      try { const t = await loader.loadAsync(new URL(name + '.png', dir).href); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
      catch { const c = document.createElement('canvas'); c.width = 832; c.height = 464; const g = c.getContext('2d'); g.fillStyle = '#2a2c44'; g.fillRect(0, 0, 832, 464); g.fillStyle = '#F2EDE4'; g.font = '80px sans-serif'; g.textAlign = 'center'; g.fillText(name + '（缺图）', 416, 250);
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
    };
    const cache = new Map(), tex = async n => { if (!cache.has(n)) cache.set(n, await load(n)); return cache.get(n); };
    const K = []; for (const k of BOX.k2d) K.push({ ...k, closed: await tex(k.lip ? k.img + '-closed' : k.img), open: k.lip ? await tex(k.img + '-open') : null });
    const BC = 0.56;                                                    // 亮带中心在画面上的位置（从上往下）：比正中略低，上面的黑边留给歌词牌
    const imgMat = new THREE.MeshBasicMaterial({ map: K[0].closed }), img = new THREE.Mesh(new THREE.PlaneGeometry(16, 9), imgMat); sc.add(img);
    // 盖板：亮带以外全黑；带沿一条薄荷灯管；带里靠近盖沿的地方压一点影子
    const maskU = { uH: { value: 0.2 }, uC: { value: 1 - BC }, uTube: { value: hdr(PAL.mint, 1.3) }, uFlash: { value: 0 } };
    const mask = new THREE.Mesh(new THREE.PlaneGeometry(16, 9), new THREE.ShaderMaterial({ uniforms: maskU, transparent: true, depthTest: false,
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */`
        uniform float uH, uC, uFlash; uniform vec3 uTube; varying vec2 vUv;
        void main(){
          float d = abs(vUv.y - uC) - uH;                                // > 0：盖板上；< 0：缝里
          float tube = smoothstep(0.0055, 0.0015, abs(d - 0.004));        // 盖沿的灯管（贴着缝、在盖板这一侧）
          vec3 c = uTube * tube * (1.0 + 1.2 * uFlash);
          float a = d > 0.0 ? 1.0 : 0.5 * smoothstep(-min(0.07, uH * 0.5), 0.0, d);     // 缝里：越靠近盖沿越暗
          gl_FragColor = vec4(c, max(a, tube));
        }` }));
    mask.position.z = 1; mask.renderOrder = 5; sc.add(mask);
    // 歌词牌：PLEASE DON'T EAT ME ALIVE 一排，贴在上面的黑边里（缝外，不压她）；没唱到的是暗的
    const words = mv.lyrics.lines.flatMap(l => l.words).filter(w => w.start > 19.0 && w.start < 22.2).map(w => ({ text: w.w.replace(/[,.!]/g, '').toUpperCase(), at: w.start, end: w.end }));   // please don't eat me alive
    const U = 9 / 1080, HP = 142;
    const plates = words.map((w, i) => {
      const c = document.createElement('canvas'), g0 = c.getContext('2d'); g0.font = '170px "UIAnton", "Anton", Impact, sans-serif';
      c.width = Math.ceil(g0.measureText(w.text).width) + 110; c.height = 270; const g = c.getContext('2d');
      g.fillStyle = '#0d0c14'; g.fillRect(0, 0, c.width, c.height); g.strokeStyle = i === words.length - 1 ? PAL.lemon : PAL.mint; g.lineWidth = 16; g.strokeRect(8, 8, c.width - 16, c.height - 16);
      g.fillStyle = '#F2EDE4'; g.font = '170px "UIAnton", "Anton", Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(w.text, c.width / 2, 143);
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
      const wpx = HP * c.width / c.height, mat = new THREE.MeshBasicMaterial({ map: tex, depthTest: false, transparent: true }), m = new THREE.Mesh(new THREE.PlaneGeometry(wpx * U, HP * U), mat); m.renderOrder = 9; m.position.z = 2; sc.add(m);
      return { ...w, m, mat, wpx };
    });
    { const total = plates.reduce((a, q) => a + q.wpx, 0) + 14 * (plates.length - 1); let x = 960 - total / 2; for (const q of plates) { q.m.position.x = (x + q.wpx / 2 - 960) * U; q.m.position.y = (540 - 104) * U; x += q.wpx + 14; } }
    const bandAt = T => {                                               // 亮带高度（占画高）
      let k = K[0]; for (const q of K) if (q.t0 <= T) k = q;
      let h = k.band; if (k.band2 && T >= k.band2[0]) h = lerp(k.band, k.band2[1], 1 - (1 - clamp((T - k.band2[0]) / 0.09)) ** 3);
      if (k.thin) h *= clamp(1 - (T - k.t0 - 0.12) / (BOX.cut.shut - 0.05 - k.t0 - 0.12)) ** 0.85;      // 长音里慢慢收成线
      return h;
    };
    const bump = T => { let v = 0; for (const t of [19.08, 19.76, 20.27, 20.84, 21.35]) { const a = T - t; if (a >= 0) v += Math.exp(-a * 11) * Math.sin(a * 60); } return v; };
    return { id: 'box-2d', t0: BOX.cut.k2d, t1: BOX.cut.shut, transitionIn: { kind: 'cut' }, build() { return {}; },
      update(_, T) {
        let k = K[0]; for (const q of K) if (q.t0 <= T) k = q;
        const w = words.find(q => T >= q.at - 0.03 && T < q.end), open = k.lip && w && T < Math.min(w.end, w.at + 0.42);      // 唱到词时张嘴（长词张 0.42 秒就收）
        imgMat.map = open ? k.open : k.closed;
        const z = lerp(k.zoom[0], k.zoom[1], (T - k.t0) / (k.t1 - k.t0)); img.scale.setScalar(z); img.position.set((0.5 - (k.cx ?? 0.5)) * 16 * z, (k.cy - 0.5) * 9 * z + (0.5 - BC) * 9 + 0.05 * bump(T), 0);
        const h = bandAt(T); maskU.uH.value = h / 2; maskU.uFlash.value = clickAt(T, 0.1);
        mask.visible = true;
        for (const q of plates) { const a = T - q.at; q.mat.color.setScalar(a >= 0 ? 1.1 + 0.9 * Math.exp(-a / 0.25) : 0.3); q.m.scale.setScalar(a >= 0 ? lerp(0.9, 1, 1 - (1 - clamp(a / 0.1)) ** 3) : 0.9); q.m.visible = T < BOX.cut.shut - 0.06; }
        return { scene: sc, camera: cam2, post: { bloom: { strength: 0.55, threshold: 1.0 }, chroma: 0.05 + 0.25 * clickAt(T, 0.08), grade: { vignette: 0.25 } } };
      } };
  }

  // ================================================================ 自检（window.__boxCheck()）：脚滑 / 穿墙 / 招牌被她挡
  window.__boxCheck = ({ fps = 30, t0 = 15.25, t1 = 19.05 } = {}) => {
    const out = { slide: [], pierce: [], signHit: [], drift: 0 }, prev = {};
    const KEYS = ['Head', 'Hips', 'LeftHand', 'RightHand', 'LeftForeArm', 'RightForeArm', 'LeftFoot', 'RightFoot', 'LeftToeBase', 'RightToeBase', 'LeftLeg', 'RightLeg'];
    for (let f = Math.round(t0 * fps); f <= Math.round(t1 * fps); f++) {
      const T = f / fps; world(T); scene.updateMatrixWorld(true);
      const P = Object.fromEntries(KEYS.map(k => [k, bonePos(k)]));
      { // 支撑脚滑动：贴地（脚尖骨 < 0.1 m）的脚里最慢的那只的水平速度（米 / 秒）。另一只在迈步不算。
        const vs = ['LeftToeBase', 'RightToeBase'].filter(k => prev[k] && P[k].y < 0.1 && prev[k].y < 0.1).map(k => Math.hypot(P[k].x - prev[k].x, P[k].z - prev[k].z) * fps);
        if (vs.length && Math.min(...vs) > 0.12) out.slide.push({ T: +T.toFixed(3), v: +Math.min(...vs).toFixed(2) });
        for (const k of ['LeftToeBase', 'RightToeBase', 'Hips', 'Head']) { if (prev[k]) { const v = P[k].distanceTo(prev[k]) * fps; if (v > (out.maxV?.[k]?.v ?? 0)) (out.maxV ??= {})[k] = { v: +v.toFixed(2), T: +T.toFixed(3) }; } prev[k] = P[k]; }
      }
      for (const k of KEYS) {                                   // 墙立起来之后，骨头不许穿过墙面（留 3 cm 给皮肤厚度之外的余量）
        const p = P[k];
        if (T >= BOX.hit.N && p.z < -HS + 0.03) out.pierce.push({ T: +T.toFixed(3), bone: k, wall: 'N', d: +(p.z + HS).toFixed(3) });
        if (T >= BOX.hit.E && p.x > HS - 0.03) out.pierce.push({ T: +T.toFixed(3), bone: k, wall: 'E', d: +(HS - p.x).toFixed(3) });
        if (p.y < -0.06) out.pierce.push({ T: +T.toFixed(3), bone: k, wall: 'floor', d: +p.y.toFixed(3) });
      }
      const ndc = KEYS.map(k => I[k].bone.getWorldPosition(new THREE.Vector3()).project(cam));
      const gb = { x0: Math.min(...ndc.map(p => p.x)) - 0.04, x1: Math.max(...ndc.map(p => p.x)) + 0.04, y0: Math.min(...ndc.map(p => p.y)) - 0.05, y1: Math.max(...ndc.map(p => p.y)) + 0.09 };
      for (const s of signs) {
        if (!s.g.visible || !girl.root.visible) continue;
        const cs = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => s.g.localToWorld(new THREE.Vector3(a * s.bw / 2, b * s.bh / 2, 0)).project(cam));
        const r = { x0: Math.min(...cs.map(p => p.x)), x1: Math.max(...cs.map(p => p.x)), y0: Math.min(...cs.map(p => p.y)), y1: Math.max(...cs.map(p => p.y)) };
        if (r.x0 < gb.x1 && gb.x0 < r.x1 && r.y0 < gb.y1 && gb.y0 < r.y1) out.signHit.push({ T: +T.toFixed(3), word: s.text });
        if (Math.abs(T - (s.at + 0.2)) < 0.5 / fps) (out.signs ??= []).push({ word: s.text, T: +T.toFixed(2), px: [(r.x0 + 1) * 960, (1 - r.y1) * 540, (r.x1 + 1) * 960, (1 - r.y0) * 540].map(Math.round), textPx: Math.round((r.y1 - r.y0) * 540 * s.th / s.bh * 0.56), inFrame: r.x0 > -0.97 && r.x1 < 0.97 && r.y0 > -0.97 && r.y1 < 0.97 });
      }
    }
    out.drift = offTab.reduce((m, o) => Math.max(m, Math.hypot(o.x, o.z)), 0).toFixed(3);
    out.slideMax = out.slide.reduce((m, q) => Math.max(m, q.v), 0);
    return out;
  };
  // 调试：某片段本地 c 秒时两只脚尖 / 手相对根的位置（根在原点、面朝 -Z、身高 H）
  window.__boxFeet = (anim, cs) => cs.map(c => {
    box.add(girl.root); girl.root.scale.setScalar(H); girl.root.position.set(0, 0, 0); girl.root.rotation.set(0, Math.PI, 0); girl.root.updateMatrixWorld(true);
    const m = getAnim(anim); girl.dancer.apply(m.solve(c / m.srcPeriod, girl.dancer)); girl.root.updateMatrixWorld(true);
    const f = k => { const p = bonePos(k); return [p.x, p.y, p.z].map(v => +v.toFixed(2)); };
    return { c, L: f('LeftToeBase'), R: f('RightToeBase'), hips: f('Hips'), hand: f('LeftHand') };
  });
  return shots;
}

// kits/world4.js — v4 新场景（W3，STORYBOARD-v4）。每个 → { group, update(t, params), …给动捕对位用的坐标系 / 时间点 }。
// 全部是 (t, params) 的纯函数；随机只用种子。她（动捕）由调用方摆：场景只给「她该在哪、朝哪、哪边是上」。
//
//   createLossSlide(opts)    a) 损失曲面滑道：真正的损失曲面 + 发光滑道 + 刻字（被压亮）+ 领路小球
//                            riderAt(u) → { pos, forward, up }；update(t, { u（她在滑道上的进度 0..1）})
//   createSpiralRun(opts)    b) 螺旋下卷跑道（《盗梦空间》城市折叠）：路面和两侧楼群向上折起卷成隧道，一路螺旋下沉
//                            frameAt(d, lateral) → { pos, forward, up }；obstacles（断口 / 横梁 / 闸门 / 蹬墙）带 d 和 t
//                            update(t, { d（她跑到的距离）, fold（整体折叠量 0..1，可做「折起来」的动画）})
//   createGridStage(opts)    c) 悬空方格舞台：每拍由外向内熄灭掉落一圈，格子上可写字
//                            update(t, { ringTimes:[外圈…内圈的掉落时刻] }) ；cellCenter(i, j)、lastCell
//   createMirrorRoom(opts)   d) 镜面房间终版：真平面反射（镜中是另一个场景 → 镜像可以不跟动作）、液态波纹、雾气字、裂线
//                            mirrorScene（调用方把「镜中的她」放进来，坐标用房间坐标，函数会自动镜像）
//                            update(t, { camera, ripples:[{x, y, t0}], fog:[{text, t0}], crack:{p, t0} })
//   createSkyDoor(opts)      e) 楚门式天幕之门：画出来的天空墙，墙上一扇门；门后白光 + 帘子拉开是舞台和观众
//                            update(t, { open, curtain, light }) ；doorFrame（门口的位置 / 朝向）
//   createStandIn()          占位的她（身高 1，脚在原点，面朝 +Z），画廊用

import * as THREE from 'three';
import { PALETTE } from '../engine/palette.js';
import { mulberry32, createCity } from './world.js';
import { createLossSurface, neonAt } from './mathart.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const col = c => new THREE.Color(c);
const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k);
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

// 画一行字到 canvas → 贴图（字白、底透明），给「刻字 / 地面字 / 格子字」用
export function textTexture(text, { font = '"Anton", Impact, sans-serif', px = 160, pad = 24, color = '#ffffff' } = {}) {
  const cv = document.createElement('canvas'); const g = cv.getContext('2d');
  g.font = `${px}px ${font}`;
  const w = Math.ceil(g.measureText(text).width) + pad * 2, h = Math.ceil(px * 1.25) + pad * 2;
  cv.width = w; cv.height = h;
  g.font = `${px}px ${font}`; g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, w / 2, h / 2 + px * 0.04);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return { texture: t, aspect: w / h };
}
// 发光字面片：唱到 / 压到之前是暗的刻痕，之后亮起（lit 0..1）
function glowWord(text, { height = 0.5, color = PALETTE.lemon, dim = 0.12 } = {}) {
  const { texture, aspect } = textTexture(text);
  const mat = new THREE.MeshBasicMaterial({ map: texture, color: hdr(color, dim), transparent: true, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(height * aspect, height), mat);
  m.userData.setLit = k => mat.color.copy(hdr(color, lerp(dim, 2.4, clamp(k))));
  m.userData.width = height * aspect;
  return m;
}

// ================================================================ 占位的她
export function createStandIn({ color = PALETTE.pink, accent = PALETTE.mint } = {}) {
  const root = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: '#f1d7c8', roughness: 0.6 });
  const top = new THREE.MeshStandardMaterial({ color, roughness: 0.5 }), bottom = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.5 });
  const part = (g, m, x, y, z) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); root.add(o); return o; };
  part(new THREE.SphereGeometry(0.1, 20, 14), skin, 0, 0.88, 0);
  part(new THREE.CapsuleGeometry(0.1, 0.22, 4, 12), top, 0, 0.62, 0);
  part(new THREE.CapsuleGeometry(0.09, 0.08, 4, 12), bottom, 0, 0.44, 0);
  for (const s of [-1, 1]) {
    part(new THREE.CapsuleGeometry(0.035, 0.36, 4, 8), skin, s * 0.06, 0.2, 0);
    const arm = part(new THREE.CapsuleGeometry(0.03, 0.3, 4, 8), top, s * 0.15, 0.6, 0); arm.rotation.z = s * 0.25;
  }
  root.userData.lights = (() => { const g = new THREE.Group(); g.add(new THREE.HemisphereLight('#fff', '#334', 1.4)); const d = new THREE.DirectionalLight('#fff', 1.6); d.position.set(1, 2, 2); g.add(d); return g; })();
  return root;
}
// 把物体摆到一个坐标系上：pos、forward（面朝）、up（头顶）
export function placeOnFrame(obj, { pos, forward, up }) {
  const z = forward.clone().normalize(), y = up.clone().addScaledVector(z, -up.dot(z)).normalize(), x = new THREE.Vector3().crossVectors(y, z);
  obj.position.copy(pos); obj.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
}

// ================================================================ a) 损失曲面滑道
/**
 * opts: words=[{ text, u }]（刻在滑道上的字，u = 路径位置 0..1），scale=1.3（曲面整体放大，人身高 1）
 * update(t, { u }) ：u = 她在滑道上的进度；小球领先 lead；滑过的字亮起、滑道被压亮
 */
export function createLossSlide({ words = [], scale = 1.6, lead = 0.06 } = {}) {
  const loss = createLossSurface({ size: 11, seg: 200, heightScale: 1.0 });
  const group = new THREE.Group(); group.add(loss.group); group.scale.setScalar(scale);
  const NP = loss.path.length;
  // 滑道：沿下降路径的一条发光带（两条边线 + 中间刻度），贴着曲面
  const half = 0.28, rails = [];
  const railGeo = (side) => {
    const pts = loss.path.map((p, i) => {
      const n = loss.normal(p.x, p.z), fwd = loss.path[Math.min(NP - 1, i + 1)].clone().sub(loss.path[Math.max(0, i - 1)]).normalize();
      const s = new THREE.Vector3().crossVectors(n, fwd).normalize();
      return p.clone().addScaledVector(s, side * half).addScaledVector(n, 0.02);
    });
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(NP * 3), 3));
    const l = new THREE.Line(g, new THREE.LineBasicMaterial({ vertexColors: true, toneMapped: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    l.frustumCulled = false; loss.group.add(l); rails.push(l);
  };
  railGeo(-1); railGeo(1);
  // 刻字：平躺在滑道上，字头朝下坡方向
  const wordMeshes = words.map(w => {
    const m = glowWord(w.text.toUpperCase(), { height: 0.34, color: PALETTE.lemon });
    const k = Math.round(clamp(w.u) * (NP - 1));
    const p = loss.path[k], n = loss.normal(p.x, p.z), fwd = loss.path[Math.min(NP - 1, k + 1)].clone().sub(loss.path[Math.max(0, k - 1)]).normalize();
    // 字面片：法线 = 曲面法线，字的「上」= 下坡方向（她滑过去时读得正）
    const x = new THREE.Vector3().crossVectors(fwd, n).normalize();
    m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, fwd, n));
    m.position.copy(p).addScaledVector(n, 0.03);
    loss.group.add(m);
    return { m, u: w.u };
  });
  const cPink = hdr(PALETTE.pink, 1), cMint = hdr(PALETTE.mint, 1);
  function riderAt(u) {
    const f = loss.pathAt(clamp(u));
    const up = f.normal.clone();
    return { pos: f.pos.clone().multiplyScalar(scale).add(group.position), forward: f.tangent.clone(), up };
  }
  function update(t, P = {}) {
    const u = clamp(P.u ?? 0);
    loss.update(t, { p: Math.min(1, u + lead), contour: 1 });
    const head = u * (NP - 1);
    rails.forEach(l => {
      const c = l.geometry.attributes.color.array;
      for (let i = 0; i < NP; i++) { const d = head - i; const k = d >= 0 ? 0.5 + 2.2 * Math.exp(-d / 20) : 0.35; const cc = d >= 0 ? cPink : cMint; c[i * 3] = cc.r * k; c[i * 3 + 1] = cc.g * k; c[i * 3 + 2] = cc.b * k; }
      l.geometry.attributes.color.needsUpdate = true;
    });
    wordMeshes.forEach(w => w.m.userData.setLit(smooth((u - w.u) / 0.02 + 1)));
  }
  update(0, {});
  return { group, update, riderAt, loss, words: wordMeshes.map(w => ({ u: w.u })) };
}

// ================================================================ b) 螺旋下卷跑道
/**
 * 路面坐标：d = 沿跑道的距离（0 起跑，向 -Z 跑），s = 横向（0 = 跑道中线，|s| ≤ roadHalf 是路面，外面是楼群街区）。
 * 折叠：从 foldStart 起，整个横截面按 s/Rc 弯成圆弧（Rc 逐渐变小 → 两侧街区向上卷起、在头顶合拢成隧道），
 * 同时横截面绕隧道轴转（twist）并一路下沉（drop）→ 螺旋下卷。
 * opts: length=240, speed=7.5（m/s，给障碍算时间），t0=0（d=0 对应的时刻）
 * obstacles：[{ type:'gap'|'beam'|'gate'|'wall', d, t, len, side?, move }]；move = 建议动作（对动捕）
 *   opts.unfoldStart / unfoldEnd：隧道在这段重新展开回平路（扭转、下沉一起回正）
 *   opts.roll = { start, end, turns, radius }：换成「平路面整体滚转」模式（不折叠；fold / twist / drop 失效），见 mapPoint
 *   opts.obstacles 可整表替换（每项可带 h = 墙 / 闸门高度）；opts.cliff = 断崖：路面、楼群、障碍在 d > cliff 处全部截掉，外面是深渊
 */
export function createSpiralRun({ length = 240, roadHalf = 2.2, S = 14, foldStart = 40, foldEnd = 150, twist = 1.6, drop = 0.18, speed = 7.5, t0 = 0, seed = 21, words = [], obstacles: obsIn = null, cliff = Infinity, unfoldStart = Infinity, unfoldEnd = Infinity, roll = null } = {}) {
  const group = new THREE.Group();
  const rnd = mulberry32(seed);
  const UNF = d => d < unfoldStart ? 1 : 1 - smooth((d - unfoldStart) / (unfoldEnd - unfoldStart));
  const FOLD = (d, g) => g * smooth((d - foldStart) / (foldEnd - foldStart)) * UNF(d);   // 0 平 → 1 完全卷成隧道（→ unfold 段再展平）
  // 横截面映射：(s, d) → 局部 (x, y)；再绕隧道轴转 twist，并下沉
  // roll 模式（{ start, end, turns=1, radius=9 }）：横截面始终是平的（路面 + 两侧街区不卷不折），整条路绕路面上方 radius 处的轴
  //   滚转 turns 圈（start→end 间 smootherstep），像《盗梦空间》翻过来的街道 / 马里奥银河的扭转跑道；几何体固定，不随时间变。
  const rollAt = d => { if (!roll) return 0; const u = Math.min(1, Math.max(0, (d - roll.start) / (roll.end - roll.start))); return 2 * Math.PI * (roll.turns ?? 1) * u * u * u * (u * (u * 6 - 15) + 10); };
  function mapPoint(s, d, g, out = new THREE.Vector3(), h = 0) {
    if (roll) {
      const th = rollAt(d), R = roll.radius ?? 9, ca = Math.cos(th), sa = Math.sin(th), ry = h - R;
      return out.set(s * ca - ry * sa, R + s * sa + ry * ca, -d);
    }
    const f = FOLD(d, g);
    let x, y;
    if (f < 1e-4) { x = s; y = 0; }
    else {
      const Rc = S / (Math.PI * f);                      // f=1 时 ±S 恰好在头顶合拢
      const th = s / Rc;
      x = Rc * Math.sin(th); y = Rc * (1 - Math.cos(th));
      // 离开路面的高度 h（楼、墙）沿法线（指向隧道轴）
      if (h) { x -= h * Math.sin(th); y += h * Math.cos(th); }
    }
    if (f < 1e-4 && h) y += h;
    const cy = f < 1e-4 ? 0 : S / (Math.PI * f);          // 隧道轴高度
    const ang = twist * f * UNF(d) * (d - foldStart) / 40;   // 螺旋：越往里转得越多（展开段再乘一次 UNF：轴高 ∝ 1/f，不然展平时会横向甩出去）
    const ca = Math.cos(ang), sa = Math.sin(ang);
    const ry = y - cy;
    out.set(x * ca - ry * sa, cy + x * sa + ry * ca - drop * Math.max(0, d - foldStart) * f, -d);
    return out;
  }
  function frameAt(d, s = 0, g = 1) {
    const e = 0.05;
    const p = mapPoint(s, d, g), pf = mapPoint(s, d + e, g), ps = mapPoint(s + e, d, g), pu = mapPoint(s, d, g, V(), 0.1);
    return { pos: p, forward: pf.sub(p).normalize(), side: ps.sub(p).normalize(), up: pu.sub(p).normalize() };
  }
  // ---- 障碍（先定义，路面网格要按断口挖洞）
  const obstacles = (obsIn ?? [
    { type: 'gate', d: 24, len: 0.3, move: 'vault（撑越）' },
    { type: 'gap', d: 52, len: 5, move: 'running jump（跳断口）' },
    { type: 'beam', d: 78, len: 0.4, move: 'running slide（滑铲过横梁）' },
    { type: 'wall', d: 104, len: 9, side: 1, move: 'wall run（右侧蹬墙跑）' },
    { type: 'gap', d: 128, len: 6, move: 'front flip（空翻过断口）' },
    { type: 'gate', d: 152, len: 0.3, move: 'vault' },
    { type: 'beam', d: 176, len: 0.4, move: 'slide' },
    { type: 'gap', d: 205, len: 14, move: 'jump down → fall（坠入深渊）' },
  ]).map(o => ({ ...o, t: o.t ?? t0 + o.d / speed }));
  const inGap = d => obstacles.some(o => o.type === 'gap' && d >= o.d && d <= o.d + o.len);
  // ---- 路面 + 街区地面：一张 (s, d) 网格，每帧按 fold 重算顶点
  const NS = 48, ND = 480;
  const pos = new Float32Array(NS * ND * 3), uv = new Float32Array(NS * ND * 2), idx = [];
  for (let j = 0; j < ND; j++) for (let i = 0; i < NS; i++) { uv[(j * NS + i) * 2] = i / (NS - 1); uv[(j * NS + i) * 2 + 1] = j / (ND - 1) * length; }
  for (let j = 0; j < ND - 1; j++) {
    const dm = (j + 0.5) / (ND - 1) * length;
    for (let i = 0; i < NS - 1; i++) {
      const sm = ((i + 0.5) / (NS - 1) * 2 - 1) * S;
      if (Math.abs(sm) < roadHalf && inGap(dm)) continue;     // 断口：路面挖掉（两侧街区还在）
      if (dm > cliff) continue;                               // 断崖：之后什么都没有
      const a = j * NS + i, b = a + NS; idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage)); geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); geo.setIndex(idx);
  const U = { uRoad: { value: roadHalf / S }, uPink: { value: col(PALETTE.pink) }, uMint: { value: col(PALETTE.mint) }, uLemon: { value: col(PALETTE.lemon) }, uD: { value: 0 } };
  const ground = new THREE.Mesh(geo, new THREE.ShaderMaterial({
    uniforms: U, side: THREE.DoubleSide,
    vertexShader: `varying vec2 vUv; varying float vDist; void main(){ vUv = uv; vec4 mv = modelViewMatrix*vec4(position,1.); vDist = -mv.z; gl_Position = projectionMatrix*mv; }`,
    fragmentShader: /* glsl */`
      uniform float uRoad, uD; uniform vec3 uPink, uMint, uLemon; varying vec2 vUv; varying float vDist;
      void main(){
        float s = vUv.x * 2.0 - 1.0, d = vUv.y;
        bool road = abs(s) < uRoad;
        vec3 c = road ? vec3(0.05, 0.05, 0.08) : vec3(0.03, 0.03, 0.05);
        // 路：两条边线 + 中线虚线 + 每 4 m 一道横线（被她跑过的变粉）
        float edge = 1.0 - smoothstep(0.004, 0.008, abs(abs(s) - uRoad));
        float mid = (1.0 - smoothstep(0.002, 0.005, abs(s))) * step(0.5, fract(d / 3.0));
        float fd = fract(d / 4.0), dm = min(fd, 1.0 - fd) * 4.0;              // 到最近一道横线的距离（米）
        float tick = road ? 1.0 - smoothstep(0.04, 0.1, dm) : 0.0;
        vec3 lc = d < uD ? uPink : uMint;
        c += lc * edge * 1.8 + uLemon * mid * 0.9 + lc * tick * 0.9;
        // 街区：格网
        if (!road) { vec2 g = abs(fract(vec2(s * 14.0, d / 6.0)) - 0.5); c += uMint * 0.12 * (1.0 - smoothstep(0.0, 0.03, min(g.x, g.y))); }
        c *= exp(-vDist * 0.012);
        gl_FragColor = vec4(c, 1.0);
      }`,
  }));
  ground.frustumCulled = false; group.add(ground);
  // ---- 两侧楼群：沿法线立起（卷起后楼顶朝隧道轴）
  const blds = [];
  for (let d = 4; d < Math.min(length - 10, cliff - 3); d += 5 + rnd() * 4) for (const side of [-1, 1]) {
    if (rnd() < 0.15) continue;
    const s = side * (roadHalf + 1.2 + rnd() * (S - roadHalf - 3));
    blds.push({ s, d, w: 1.2 + rnd() * 1.6, dd: 1.5 + rnd() * 2.5, h: 1.5 + rnd() ** 2 * 7, hue: rnd() });
  }
  const bGeo = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
  const bMat = new THREE.ShaderMaterial({
    uniforms: { uPink: U.uPink, uMint: U.uMint, uLemon: U.uLemon },
    vertexShader: `varying vec3 vL; varying vec3 vN; varying float vDist; varying float vH; attribute float aH; void main(){ vL = position; vN = normal; vH = aH; vec4 mv = modelViewMatrix*instanceMatrix*vec4(position,1.); vDist = -mv.z; gl_Position = projectionMatrix*mv; }`,
    fragmentShader: /* glsl */`
      uniform vec3 uPink, uMint, uLemon; varying vec3 vL; varying vec3 vN; varying float vDist; varying float vH;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main(){
        vec3 c = vec3(0.07, 0.07, 0.1) * (0.6 + 0.4 * abs(vN.x));
        if (abs(vN.y) < 0.5){
          vec2 g = vec2((abs(vN.x) > 0.5 ? vL.z : vL.x) * 6.0, vL.y * vH * 4.0);
          vec2 f = fract(g);
          float win = step(0.25, f.x) * step(f.x, 0.75) * step(0.3, f.y) * step(f.y, 0.75);
          float h = hash(floor(g) + vH);
          vec3 wc = h < 0.6 ? vec3(1.0, 0.85, 0.6) : h < 0.8 ? uLemon : h < 0.9 ? uPink : uMint;
          c += wc * win * step(h, 0.55) * 1.4;
        } else c = vec3(0.05, 0.045, 0.07) + uPink * 0.04;   // 楼顶：暗，别抢路面
        c *= exp(-vDist * 0.012);
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  const aH = new Float32Array(blds.length); blds.forEach((b, i) => { aH[i] = b.h; });
  bGeo.setAttribute('aH', new THREE.InstancedBufferAttribute(aH, 1));
  const bMesh = new THREE.InstancedMesh(bGeo, bMat, blds.length); bMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); bMesh.frustumCulled = false; group.add(bMesh);
  // ---- 障碍物网格
  const obMat = new THREE.MeshBasicMaterial({ color: hdr(PALETTE.lemon, 1.6), toneMapped: false });
  const wallMat = new THREE.MeshBasicMaterial({ color: hdr(PALETTE.mint, 0.5), toneMapped: false, transparent: true, opacity: 0.85 });
  const obMeshes = obstacles.map(o => {
    let m = null;
    if (o.type === 'gate') m = new THREE.Mesh(new THREE.BoxGeometry(roadHalf * 2, o.h ?? 0.9, o.len), obMat);
    if (o.type === 'beam') m = new THREE.Mesh(new THREE.BoxGeometry(roadHalf * 2 + 0.6, 0.3, o.len), obMat);
    if (o.type === 'wall') m = new THREE.Mesh(new THREE.BoxGeometry(0.3, o.h ?? 3.2, o.len), wallMat);
    if (m) group.add(m);
    return { o, m };
  });
  // ---- 地面字：路面上的发光字，被她踩亮
  const wordMeshes = words.map(w => { const m = glowWord(w.text.toUpperCase(), { height: 1.1, color: PALETTE.pink }); group.add(m); return { m, d: w.d }; });
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = V(), sc = V();
  function update(t, P = {}) {
    const g = P.fold ?? 1, dr = P.d ?? 0;
    U.uD.value = dr;
    for (let j = 0; j < ND; j++) {
      const d = j / (ND - 1) * length;
      for (let i = 0; i < NS; i++) { const s = (i / (NS - 1) * 2 - 1) * S; mapPoint(s, d, g, p); pos.set([p.x, p.y, p.z], (j * NS + i) * 3); }
    }
    geo.attributes.position.needsUpdate = true;
    blds.forEach((b, i) => {
      const f = frameAt(b.d, b.s, g);
      const z = f.forward, y = f.up, x = new THREE.Vector3().crossVectors(y, z);
      m4.makeBasis(x, y, z); q.setFromRotationMatrix(m4);
      m4.compose(f.pos, q, sc.set(b.w, b.h, b.dd)); bMesh.setMatrixAt(i, m4);
    });
    bMesh.instanceMatrix.needsUpdate = true;
    obMeshes.forEach(({ o, m }) => {
      if (!m) return;
      const lat = o.type === 'wall' ? o.side * (roadHalf + 0.2) : 0;
      const f = frameAt(o.d + o.len / 2, lat, g);
      const hgt = o.type === 'beam' ? (o.y ?? 1.15) : o.type === 'gate' ? (o.h ?? 0.9) / 2 : (o.h ?? 3.2) / 2;
      placeOnFrame(m, { pos: f.pos.clone().addScaledVector(f.up, hgt), forward: f.forward, up: f.up });
    });
    wordMeshes.forEach(w => {
      const f = frameAt(w.d, 0, g);
      // 字平躺在路面，字头朝前（她跑过去时读得正）
      const zN = f.up, yF = f.forward, xS = new THREE.Vector3().crossVectors(yF, zN);
      w.m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xS, yF, zN));
      w.m.position.copy(f.pos).addScaledVector(f.up, 0.02);
      w.m.userData.setLit(smooth((dr - w.d) / 1.5 + 1));
    });
  }
  update(0, {});
  return { group, update, frameAt, rollAt, buildings: blds, obstacles, length, speed, t0, dAt: t => (t - t0) * speed, tAt: d => t0 + d / speed };
}

// ================================================================ c) 悬空方格舞台
/**
 * n × n 格（奇数），中心格是她最后站的那一格。每圈（由外向内）在 ringTimes[k] 熄灭并掉落（k=0 最外圈）。
 * words：[{ text, cell:[i,j] }] 写在格子上的字，字随格子一起掉。
 * update(t, { ringTimes, lastTime（中心格熄灭时刻；默认 ringTimes 最后一个之后一拍）})
 */
export function createGridStage({ n = 9, cell = 0.9, gap = 0.06, words = [], city = true } = {}) {
  const group = new THREE.Group();
  const c0 = (n - 1) / 2;
  const tiles = [];
  const tileGeo = new THREE.BoxGeometry(cell - gap, 0.12, cell - gap).translate(0, -0.06, 0);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const ring = Math.max(Math.abs(i - c0), Math.abs(j - c0));
    const mat = new THREE.ShaderMaterial({
      uniforms: { uOn: { value: 1 }, uC: { value: neonAt(((i + j) % 3) / 3 + 0.02).clone() } },
      vertexShader: `varying vec2 vUv; varying vec3 vN; void main(){ vUv = uv; vN = normal; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `uniform float uOn; uniform vec3 uC; varying vec2 vUv; varying vec3 vN;
        void main(){ float e = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)); float edge = 1.0 - smoothstep(0.03, 0.08, e);
          vec3 c = vec3(0.04, 0.04, 0.06) + uC * (edge * 1.8 + 0.18) * uOn * step(0.5, vN.y) + uC * edge * 0.3 * uOn * (1.0 - step(0.5, vN.y));
          gl_FragColor = vec4(c, 1.0); }`,
    });
    const m = new THREE.Mesh(tileGeo, mat);
    m.position.set((i - c0) * cell, 0, (j - c0) * cell);
    group.add(m);
    tiles.push({ i, j, ring, m, mat, rnd: mulberry32(i * 31 + j)() });
  }
  const wordMeshes = words.map(w => {
    const tile = tiles.find(x => x.i === w.cell[0] && x.j === w.cell[1]);
    const m = glowWord(w.text.toUpperCase(), { height: cell * 0.36, color: PALETTE.paper, dim: 1.0 });
    m.scale.setScalar(Math.min(1, (cell * 0.9) / m.userData.width));
    m.rotation.x = -Math.PI / 2; m.position.y = 0.005;
    tile.m.add(m);
    return { m, tile };
  });
  if (city) { const c = createCity({ seed: 5, n: 21 }); c.update(0, { draw: 1, extrude: 1, light: 1 }); c.group.position.y = -14; c.group.scale.setScalar(1.6); group.add(c.group); }
  const cellCenter = (i, j) => V((i - c0) * cell, 0, (j - c0) * cell);
  function update(t, P = {}) {
    const R = P.ringTimes ?? [];
    const last = P.lastTime ?? (R.length ? R[R.length - 1] + 0.45 : 1e9);
    for (const tl of tiles) {
      const k = c0 - tl.ring;                                // 外圈 k=0
      const tOff = tl.ring === 0 ? last : (R[k] ?? 1e9);
      const since = t - tOff;
      const flick = since < 0 ? 1 : since < 0.12 ? (Math.sin(since * 120) > 0 ? 1 : 0.2) : 0;
      tl.mat.uniforms.uOn.value = flick;
      const fall = Math.max(0, since - 0.08 - tl.rnd * 0.06);
      tl.m.position.y = -4.9 * fall * fall;
      tl.m.rotation.set(fall * (tl.rnd - 0.5) * 3, 0, fall * (tl.rnd - 0.3) * 2.5);
      tl.m.visible = fall < 4;
    }
  }
  update(0, {});
  return { group, update, cellCenter, n, cell, lastCell: [c0, c0] };
}

// ================================================================ d) 镜面房间终版
/**
 * 房间坐标：镜子在 z = 0（背墙），房间在 z > 0，地面 y = 0，镜面宽 width、高 height。
 * mirrorScene：镜中世界。调用方把「镜中的她」（可以是另一套动作 → 不跟本人）放进 mirrorScene.content，
 *   坐标照房间坐标写（和本人一样的位置就是正常倒影），这里整体沿镜面翻转后渲到镜面上 —— 真平面反射。
 *   房间本身（地面、侧墙、灯带）已经复制进镜中世界。
 * opts: renderer（必需）, fog=[{ text, t0, t1, x, y, size }]（镜面雾气字，x/y 是镜面上的米），
 *       crack={ x, y, text, seed }（裂线起点 + 沿裂线出现的字）
 * update(t, { camera（必需：每帧用它渲镜中世界）, ripples:[{x, y, t0}], crack:{ p（0..1 裂到哪）} })
 */
export function createMirrorRoom({ renderer, width = 4.2, height = 2.7, depth = 5, fog = [], crack = null, rtScale = 1 } = {}) {
  if (!renderer) throw new Error('createMirrorRoom 需要 renderer');
  const group = new THREE.Group();
  const size = renderer.getDrawingBufferSize(new THREE.Vector2());
  const rt = new THREE.WebGLRenderTarget(Math.round(size.x * rtScale), Math.round(size.y * rtScale), { type: THREE.HalfFloatType, samples: 4 });
  // ---- 房间（本体 + 镜中各一份）
  function buildRoom() {
    const g = new THREE.Group();
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), new THREE.ShaderMaterial({
      uniforms: { uMint: { value: col(PALETTE.mint) }, uPink: { value: col(PALETTE.pink) } },
      vertexShader: `varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `uniform vec3 uMint, uPink; varying vec2 vP; void main(){ vec2 g = abs(fract(vP * 2.0) - 0.5); float l = 1.0 - smoothstep(0.0, 0.02, min(g.x, g.y)); gl_FragColor = vec4(vec3(0.035, 0.035, 0.05) + uMint * l * 0.25, 1.0); }`,
    }));
    floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, depth / 2); g.add(floor);
    const wallMat = new THREE.MeshStandardMaterial({ color: '#15141c', roughness: 0.9 });
    for (const sx of [-1, 1]) { const w = new THREE.Mesh(new THREE.PlaneGeometry(depth, height + 0.6), wallMat); w.rotation.y = -sx * Math.PI / 2; w.position.set(sx * width / 2, (height + 0.6) / 2, depth / 2); g.add(w); }
    const strip = new THREE.Mesh(new THREE.BoxGeometry(width * 0.8, 0.03, 0.06), new THREE.MeshBasicMaterial({ color: hdr(PALETTE.paper, 2.4), toneMapped: false }));
    strip.position.set(0, height + 0.25, depth * 0.45); g.add(strip);
    g.add(new THREE.HemisphereLight('#fff', '#223', 0.8));
    return g;
  }
  group.add(buildRoom());
  const mirrorScene = new THREE.Scene(); mirrorScene.background = col('#07070b');
  const flip = new THREE.Group(); flip.scale.z = -1; mirrorScene.add(flip);   // 沿 z=0 镜像
  flip.add(buildRoom());
  const content = new THREE.Group(); flip.add(content);
  mirrorScene.content = content;
  // ---- 镜面：屏幕坐标采样镜中世界 + 液态波纹 + 雾气字
  const fogTex = fog.map(f => ({ ...f, ...textTexture(f.text.toUpperCase(), { font: '"Share Tech Mono", ui-monospace, monospace', px: 120 }) }));
  const MAXF = 4;
  const U = {
    uTex: { value: rt.texture }, uRes: { value: size.clone() }, uT: { value: 0 }, uSize: { value: new THREE.Vector2(width, height) },
    uRip: { value: Array.from({ length: 4 }, () => new THREE.Vector4(0, 0, -99, 0)) },
    uFog: { value: Array.from({ length: MAXF }, (_, i) => fogTex[i]?.texture ?? null) },
    uFogRect: { value: Array.from({ length: MAXF }, (_, i) => { const f = fogTex[i]; if (!f) return new THREE.Vector4(0, 0, 0, 0); const h = f.size ?? 0.32; return new THREE.Vector4(f.x ?? 0, f.y ?? height * 0.72, h * f.aspect, h); }) },
    uFogA: { value: new Float32Array(MAXF) }, uMint: { value: col(PALETTE.mint) }, uPink: { value: col(PALETTE.pink) },
  };
  const mirror = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.ShaderMaterial({
    uniforms: U,
    vertexShader: `varying vec2 vM; void main(){ vM = position.xy; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: /* glsl */`
      uniform sampler2D uTex; uniform vec2 uRes, uSize; uniform float uT; uniform vec4 uRip[4];
      uniform sampler2D uFog[${MAXF}]; uniform vec4 uFogRect[${MAXF}]; uniform float uFogA[${MAXF}]; uniform vec3 uMint, uPink;
      varying vec2 vM;
      void main(){
        vec2 uv = gl_FragCoord.xy / uRes;
        vec2 m = vM + vec2(0.0, uSize.y * 0.5);          // 镜面米坐标：x ∈ ±w/2，y ∈ [0, h]
        float hl = 0.0;
        for (int i = 0; i < 4; i++){
          vec4 r = uRip[i]; float age = uT - r.z; if (age < 0.0 || age > 4.0) continue;
          vec2 d = m - r.xy; float dist = length(d);
          float front = age * 1.4;
          float w = sin((dist - front) * 26.0) * exp(-abs(dist - front) * 3.0) * exp(-age * 0.9) * step(dist, front + 0.3);
          uv += (dist > 1e-3 ? d / dist : vec2(0.0)) * w * 0.012 * r.w;
          hl += max(w, 0.0) * r.w;
        }
        vec3 c = texture2D(uTex, uv).rgb * 0.92 + vec3(0.02, 0.03, 0.035);
        c += uMint * hl * 0.35;
        // 雾气字：一层淡雾，字是被抹开的清亮笔画
        ${Array.from({ length: MAXF }, (_, i) => `{ vec4 R = uFogRect[${i}]; if (uFogA[${i}] > 0.0){ vec2 q = (m - R.xy) / R.zw + 0.5; if (q.x > 0.0 && q.x < 1.0 && q.y > 0.0 && q.y < 1.0){ float a = texture2D(uFog[${i}], q).a; c = mix(c, vec3(0.75, 0.82, 0.85), a * 0.55 * uFogA[${i}]); } } }`).join('\n        ')}
        gl_FragColor = vec4(c, 1.0);
      }`,
  }));
  mirror.position.set(0, height / 2, 0); group.add(mirror);
  // 镜框
  const fm = new THREE.MeshBasicMaterial({ color: hdr(PALETTE.mint, 2.0), toneMapped: false });
  const bar = (w, h, x, y) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.04), fm); b.position.set(x, y, 0.01); group.add(b); };
  bar(width + 0.06, 0.03, 0, height); bar(width + 0.06, 0.03, 0, 0); bar(0.03, height, -width / 2, height / 2); bar(0.03, height, width / 2, height / 2);
  // ---- 裂线 + 沿裂线的字
  let crackObj = null;
  if (crack) {
    const rnd = mulberry32(crack.seed ?? 3);
    const pts = [V(crack.x, crack.y, 0.012)];
    let dir = V(1, 0.15, 0).normalize();
    for (let i = 0; i < 26; i++) { dir.applyAxisAngle(V(0, 0, 1), (rnd() - 0.5) * 0.9).normalize(); pts.push(pts[pts.length - 1].clone().addScaledVector(dir, 0.1 + rnd() * 0.08)); }
    const inside = pts.filter(p => Math.abs(p.x) < width / 2 - 0.05 && p.y > 0.05 && p.y < height - 0.05);
    const geo = new THREE.BufferGeometry().setFromPoints(inside);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: hdr(PALETTE.paper, 3), toneMapped: false })); line.frustumCulled = false;
    const g = new THREE.Group(); g.position.y = 0; g.add(line); group.add(g);
    let word = null;
    if (crack.text) {
      word = glowWord(crack.text.toUpperCase(), { height: 0.22, color: PALETTE.pink, dim: 0 });
      const a = inside[0], b = inside[inside.length - 1];
      word.position.set((a.x + b.x) / 2, (a.y + b.y) / 2 + 0.2, 0.015); word.rotation.z = Math.atan2(b.y - a.y, b.x - a.x);
      g.add(word);
    }
    crackObj = { line, n: inside.length, word };
  }
  function update(t, P = {}) {
    U.uT.value = t;
    const R = P.ripples ?? [];
    for (let i = 0; i < 4; i++) { const r = R[i]; if (r) U.uRip.value[i].set(r.x, r.y, r.t0, r.amp ?? 1); else U.uRip.value[i].set(0, 0, -99, 0); }
    fogTex.forEach((f, i) => { if (i < MAXF) U.uFogA.value[i] = smooth((t - f.t0) / 0.5) * (1 - smooth((t - (f.t1 ?? 1e9)) / 0.5)); });
    if (crackObj) {
      const p = clamp(P.crack?.p ?? 0);
      crackObj.line.geometry.setDrawRange(0, Math.max(0, Math.round(p * crackObj.n)));
      if (crackObj.word) crackObj.word.userData.setLit(smooth((p - 0.5) / 0.4));
    }
    if (P.camera) {
      const prev = renderer.getRenderTarget();
      renderer.setRenderTarget(rt); renderer.setClearColor(mirrorScene.background, 1); renderer.clear(); renderer.render(mirrorScene, P.camera); renderer.setRenderTarget(prev);
    }
  }
  return { group, update, mirrorScene, width, height, depth };
}

// ================================================================ e) 楚门式天幕之门
/**
 * 一面画出来的天空墙（z = 0，面朝 +Z，地面 y = 0）：近看有画布拼缝。墙上一扇门（门洞中心 x = 0）。
 * 门后：白光 → 帘子 → 舞台和一排排观众剪影。
 * update(t, { open（门开 0..1）, curtain（帘子拉开 0..1）, light（门后白光 0..1）, seams（拼缝显形 0..1）})
 * doorFrame：{ pos（门槛中点）, forward（穿门方向 -Z）, up }
 */
export function createSkyDoor({ wallW = 60, wallH = 30, doorW = 1.3, doorH = 2.4, seed = 12 } = {}) {
  const group = new THREE.Group();
  const U = { uSeams: { value: 0.3 }, uT: { value: 0 }, uPink: { value: col(PALETTE.pink) }, uMint: { value: col(PALETTE.mint) }, uLemon: { value: col(PALETTE.lemon) }, uPaper: { value: col(PALETTE.paper) } };
  const skyMat = new THREE.ShaderMaterial({
    uniforms: U,
    vertexShader: `varying vec3 vW; void main(){ vW = (modelMatrix*vec4(position,1.)).xyz; gl_Position = projectionMatrix*viewMatrix*vec4(vW,1.); }`,
    fragmentShader: /* glsl */`
      uniform float uSeams, uT; uniform vec3 uPink, uMint, uLemon, uPaper; varying vec3 vW;
      float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
      float vn(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f); return mix(mix(h21(i), h21(i+vec2(1,0)), u.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), u.x), u.y); }
      float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ s += a*vn(p); p *= 2.02; a *= 0.5; } return s; }
      void main(){
        float y = vW.y / 10.0;              // 天空渐变按 10 m 铺开：近处平视就能看到蓝天和云
        // 画出来的晴空：顶部青蓝 → 地平线发白，再加一点粉色晚霞（天幕画布的样子，不是真天）
        vec3 top = vec3(0.22, 0.55, 0.78), hor = vec3(0.86, 0.92, 0.95);
        vec3 sky = mix(hor, top, smoothstep(0.0, 0.75, y));
        sky = mix(sky, uPink * 0.9 + 0.1, (1.0 - smoothstep(0.0, 0.12, y)) * 0.25);
        float cl = smoothstep(0.5, 0.78, fbm(vec2(vW.x * 0.07 + uT * 0.01, vW.y * 0.15)));
        sky = mix(sky, vec3(1.0, 0.98, 0.97), cl * 0.85 * smoothstep(0.1, 0.3, y));
        // 画布拼缝：每 6 m 一条竖缝、每 5 m 一条横缝，靠近了才显形
        vec2 g = abs(fract(vW.xy / vec2(6.0, 5.0)) - 0.5) * vec2(6.0, 5.0);
        float seam = 1.0 - smoothstep(0.0, 0.025, min(g.x, g.y));
        sky *= 1.0 - seam * 0.35 * uSeams;
        gl_FragColor = vec4(sky * 0.85, 1.0);
      }`,
  });
  // 墙：门洞四周四块
  const piece = (w, h, x, y) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), skyMat); m.position.set(x, y, 0); group.add(m); };
  piece((wallW - doorW) / 2, wallH, -(wallW + doorW) / 4, wallH / 2);
  piece((wallW - doorW) / 2, wallH, (wallW + doorW) / 4, wallH / 2);
  piece(doorW, wallH - doorH, 0, doorH + (wallH - doorH) / 2);
  // 门扇：同一张天空画（世界坐标取色，关着时和墙无缝），铰链在左边
  const hinge = new THREE.Group(); hinge.position.set(-doorW / 2, 0, 0); group.add(hinge);
  const door = new THREE.Mesh(new THREE.PlaneGeometry(doorW, doorH), skyMat); door.position.set(doorW / 2, doorH / 2, 0.001); hinge.add(door);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), new THREE.MeshBasicMaterial({ color: hdr(PALETTE.lemon, 1.5), toneMapped: false })); knob.position.set(doorW * 0.9, doorH * 0.45, 0.03); hinge.add(knob);
  // 门缝亮线（门将开时透光）
  const crackMat = new THREE.MeshBasicMaterial({ color: hdr('#ffffff', 4), toneMapped: false, transparent: true, opacity: 0 });
  const slit = new THREE.Mesh(new THREE.PlaneGeometry(0.02, doorH), crackMat); slit.position.set(doorW / 2 - 0.01, doorH / 2, 0.004); group.add(slit);
  // 门后：白光盒 + 帘子 + 舞台
  const back = new THREE.Group(); back.position.z = -0.02; group.add(back);
  const lightMat = new THREE.MeshBasicMaterial({ color: hdr('#ffffff', 2), toneMapped: false, transparent: true, opacity: 1 });
  const glowPlane = new THREE.Mesh(new THREE.PlaneGeometry(doorW, doorH), lightMat); glowPlane.position.set(0, doorH / 2, -0.3); back.add(glowPlane);
  const curtMat = side => new THREE.ShaderMaterial({
    uniforms: { uPink: U.uPink },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `uniform vec3 uPink; varying vec2 vUv; void main(){ float f = 0.55 + 0.45 * sin(vUv.x * 60.0); gl_FragColor = vec4(uPink * 0.45 * f * (0.6 + 0.4 * vUv.y), 1.0); }`,
  });
  const curtains = [-1, 1].map(s => { const m = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 3.2), curtMat(s)); m.position.set(s * 1.2, 1.6, -1.2); back.add(m); return { m, s }; });
  // 舞台：台面 + 一排排观众剪影（全是她的模仿者：同一个剪影）+ 顶灯
  const stage = new THREE.Group(); stage.position.z = -1.6; back.add(stage);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(12, 0.3, 4), new THREE.MeshStandardMaterial({ color: '#1a1422', roughness: 0.6 })); deck.position.set(0, -0.15, -2.5); stage.add(deck);
  const rnd = mulberry32(seed);
  const aud = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.12, 0.5, 4, 8).translate(0, 0.37, 0), new THREE.MeshBasicMaterial({ color: '#0b0a10' }), 14 * 8);
  const m4 = new THREE.Matrix4(); let k = 0;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 14; c++) { m4.makeTranslation((c - 6.5) * 0.7 + (r % 2) * 0.35, 0.25 * r, -5 - r * 0.9 - rnd() * 0.1); aud.setMatrixAt(k++, m4); }
  stage.add(aud);
  const rim = new THREE.Mesh(new THREE.PlaneGeometry(14, 9), new THREE.MeshBasicMaterial({ color: hdr(PALETTE.pink, 0.8), toneMapped: false }));   // 观众后面的舞台光墙 → 观众成剪影
  rim.position.set(0, 3, -13); stage.add(rim);
  const spots = [-3, 0, 3].map(x => { const s = new THREE.Mesh(new THREE.ConeGeometry(1.2, 6, 24, 1, true), new THREE.MeshBasicMaterial({ color: hdr(PALETTE.paper, 0.35), transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })); s.position.set(x, 3, -2.5); stage.add(s); return s; });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 60), new THREE.MeshStandardMaterial({ color: '#5f6a66', roughness: 0.95 })); floor.rotation.x = -Math.PI / 2; floor.position.z = 30; group.add(floor);
  group.add(new THREE.HemisphereLight('#ffffff', '#5a5a60', 0.9));
  function update(t, P = {}) {
    const open = clamp(P.open ?? 0), curtain = clamp(P.curtain ?? 0), light = clamp(P.light ?? open);
    U.uT.value = t; U.uSeams.value = P.seams ?? 0.3;
    hinge.rotation.y = -open * 1.75;
    crackMat.opacity = open > 0.001 ? 0 : clamp(light * 2);
    lightMat.opacity = 1 - curtain * 0.9; glowPlane.visible = light > 0.01; lightMat.color.copy(hdr('#ffffff', 2 * light));
    curtains.forEach(({ m, s }) => { m.position.x = s * (1.2 + curtain * 1.6); m.scale.x = 1 - curtain * 0.55; });
    stage.visible = curtain > 0.01;
    spots.forEach((s, i) => { s.rotation.z = Math.sin(t * 0.8 + i * 2) * 0.25; });
  }
  update(0, {});
  return { group, update, doorFrame: { pos: V(0, 0, 0), forward: V(0, 0, -1), up: V(0, 1, 0) }, doorW, doorH };
}

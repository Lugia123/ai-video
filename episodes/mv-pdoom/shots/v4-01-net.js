// shots/v4-01-net.js —— v4-01 第 3 句「There was a sudden drop in your training loss」（9.52–13.16）：夜空的网。#1019 小样 3 → #1025 接入整段
//
//   shots.push(await makeV401Net(mv, { r0 }));   // r0 = 上一镜（镜筒眼睛特写）最后一帧里那片玻璃在画面上的半径（以半个画高为 1）
//
// 这一句她不出现，只演「它」：城上空一张乱闪的节点网，drop 时一波柠黄扫过、全部接通，整张网收成一只看着这座城的眼。
// 入口：上一镜推进瞳孔，这里从同一个柠黄光环里穿出来（光环 0.4 秒内胀出画外）；出口：朝瞳孔冲进去，满屏柠黄，13.16 接像素墙。
// T 的纯函数；随机只用种子。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIn = p => clamp(p) ** 3;
const eIO = p => { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2; };
const col = c => new THREE.Color(c);
const hdr = (c, k) => new THREE.Color(c).multiplyScalar(k);
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const FONT = '"UIAnton", "Anton", Impact, sans-serif';
const T0 = 9.52, T1 = 13.16, T_DROP = 10.66;

// ================================================================ 共用：星、粉月、挂在镜头前的歌词招牌
function sky(scene, { moon = true } = {}) {
  const rnd = mulberry32(77), n = 1100, p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const a = rnd() * Math.PI * 2, e = Math.asin(0.04 + rnd() * 0.96), r = 900; p.set([Math.cos(a) * Math.cos(e) * r, Math.sin(e) * r, Math.sin(a) * Math.cos(e) * r], i * 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: col(PAL.paper).multiplyScalar(1.4), size: 1.6, sizeAttenuation: false, fog: false })));
  if (!moon) return null;
  const m = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.MeshBasicMaterial({ color: col(PAL.pink).multiplyScalar(1.25), fog: false }));
  m.position.set(-90, 150, -640); m.lookAt(0, 0, 0); scene.add(m); return m;
}
function lyricHud(mv, cam) {
  const words = mv.lyrics.lines[3].words.map(w => ({ text: w.w.replace(/[,.]/g, '').toUpperCase(), at: w.start }));
  const group = new THREE.Group(); group.position.z = -1; cam.add(group);
  const U = 2 / 1080;                                 // 组的缩放 = tan(fov/2) 时，1 px = U
  const mk = (w, hpx, color) => {
    const c = document.createElement('canvas'), g0 = c.getContext('2d'); g0.font = `170px ${FONT}`;
    c.width = Math.ceil(g0.measureText(w.text).width) + 110; c.height = 270; const g = c.getContext('2d');
    g.fillStyle = '#0d0c14'; g.fillRect(0, 0, c.width, c.height); g.strokeStyle = color; g.lineWidth = 16; g.strokeRect(8, 8, c.width - 16, c.height - 16);
    g.fillStyle = '#F2EDE4'; g.font = `170px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(w.text, c.width / 2, 143);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const mat = new THREE.MeshBasicMaterial({ map: tex, depthTest: false, depthWrite: false, transparent: true, fog: false }), wpx = hpx * c.width / c.height, m = new THREE.Mesh(new THREE.PlaneGeometry(wpx * U, hpx * U), mat); m.renderOrder = 20; group.add(m);
    return { ...w, m, mat, wpx, hpx };
  };
  // 两屏，同一个位置（左下）：THERE WAS A SUDDEN / DROP → IN YOUR TRAINING / LOSS。大词单独一行、最大
  const row = (list, x0, y) => { let x = x0; for (const s of list) { s.m.position.set((x + s.wpx / 2 - 960) * U, (540 - y) * U, 0); x += s.wpx + 14; } };
  const A = words.slice(0, 4).map(w => mk(w, 150, PAL.pink)), drop = mk(words[4], 230, PAL.lemon), B = words.slice(5, 8).map(w => mk(w, 150, PAL.pink)), loss = mk(words[8], 230, PAL.lemon);
  row(A, 56, 742); row([drop], 56, 942); row(B, 56, 742); row([loss], 56, 942);
  const tSwap = words[5].at - 0.06;
  return T => {
    group.scale.setScalar(Math.tan(cam.fov * Math.PI / 360));
    for (const [list, on] of [[[...A, drop], T < tSwap], [[...B, loss], T >= tSwap]]) for (const s of list) {
      const a = T - s.at; s.m.visible = on && T >= T0 + 0.12 && T < T1 - 0.2;   // 入口的光环胀开之后才出现；出口冲进瞳孔前收掉
      s.mat.color.setScalar(a >= 0 ? 1.1 + 0.7 * Math.exp(-a / 0.25) : 0.3); s.m.scale.setScalar(a >= 0 ? lerp(0.9, 1, eOut(a / 0.1)) : 0.9);
    }
  };
}
// 亮窗楼块（实例化）：和跑酷段的楼一个样子（深色方块 + 一格格窗）；uChaos 时每扇窗各闪各的
const BLOCK_VERT = /* glsl */`
  attribute vec3 aBase; attribute vec3 aJit; attribute vec4 aInfo; uniform float uWave, uT; varying vec3 vL; varying vec3 vN; varying vec4 vInfo; varying float vSy, vH;
  void main(){
    float sy = smoothstep(0.0, 14.0, uWave - aInfo.w);                  // 光浪扫到这栋楼：0 → 1
    float h = mix(aInfo.x, aInfo.z > 0.5 ? 15.0 : 3.2, sy), w = aBase.z;
    float yaw = aJit.z * (1.0 - sy), c = cos(yaw), s = sin(yaw);
    vec3 p = vec3(position.x * w, position.y * h, position.z * w); p = vec3(p.x * c - p.z * s, p.y, p.x * s + p.z * c);
    p.xz += aBase.xy + aJit.xy * (1.0 - sy);
    vL = position; vN = normal; vInfo = aInfo; vSy = sy; vH = h;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }`;
const BLOCK_FRAG = /* glsl */`
  uniform float uT, uBeat; uniform vec3 uPink, uMint, uLemon; varying vec3 vL; varying vec3 vN; varying vec4 vInfo; varying float vSy, vH;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  void main(){
    vec3 c = vec3(0.05, 0.05, 0.085) * (0.6 + 0.4 * abs(vN.x));
    float lit = vInfo.z, seed = vInfo.y;
    if (abs(vN.y) < 0.5) {
      vec2 g = vec2((abs(vN.x) > 0.5 ? vL.z : vL.x) * 5.0, vL.y * vH * 0.9), f = fract(g);
      float win = step(0.22, f.x) * step(f.x, 0.78) * step(0.28, f.y) * step(f.y, 0.76);
      float h = hash(floor(g) + seed * 31.0);
      float fl = step(0.5, hash(floor(g) + seed * 31.0 + floor(uT * (5.0 + 9.0 * h))));      // 没学会：每扇窗按自己的频率乱闪
      vec3 wc = h < 0.5 ? vec3(1.0, 0.85, 0.6) : h < 0.7 ? uLemon : h < 0.86 ? uPink : uMint;
      vec3 chaos = wc * win * fl * 1.5;
      vec3 sync = (uLemon * 1.2 + vec3(0.5)) * win * lit * (1.0 + 0.5 * uBeat) + vec3(0.02, 0.02, 0.04) * win * (1.0 - lit);   // 学会了：环上的楼每扇窗都亮、一起呼吸；环外的楼全灭
      c += mix(chaos, sync, vSy);
      c += vec3(1.6) * win * smoothstep(0.0, 0.5, vSy) * smoothstep(1.0, 0.5, vSy);          // 光浪扫过的那一瞬全白
    } else c = mix(vec3(0.04, 0.04, 0.07), uLemon * 0.5, lit * vSy);
    gl_FragColor = vec4(c, 1.0);
  }`;
function blocks(items, uniforms) {
  const geo = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), n = items.length;
  const base = new Float32Array(n * 3), jit = new Float32Array(n * 3), info = new Float32Array(n * 4);
  items.forEach((b, i) => { base.set([b.x, b.z, b.w], i * 3); jit.set([b.dx, b.dz, b.yaw], i * 3); info.set([b.h, b.seed, b.lit, b.r], i * 4); });
  geo.setAttribute('aBase', new THREE.InstancedBufferAttribute(base, 3)); geo.setAttribute('aJit', new THREE.InstancedBufferAttribute(jit, 3)); geo.setAttribute('aInfo', new THREE.InstancedBufferAttribute(info, 4));
  const m = new THREE.InstancedMesh(geo, new THREE.ShaderMaterial({ uniforms, vertexShader: BLOCK_VERT, fragmentShader: BLOCK_FRAG }), n); m.frustumCulled = false;
  const I = new THREE.Matrix4(); for (let i = 0; i < n; i++) m.setMatrixAt(i, I);
  return m;
}
const blockU = () => ({ uWave: { value: -1 }, uT: { value: 0 }, uBeat: { value: 0 }, uPink: { value: col(PAL.pink) }, uMint: { value: col(PAL.mint) }, uLemon: { value: col(PAL.lemon) } });
const beat = (mv, T) => mv.music.pulse ? mv.music.pulse('kick', T, { decay: 0.16 }) : 0;

// ================================================================ 3 夜空里的网收拢成眼
function net(mv, { r0 = 0.6, backdrop = null } = {}) {   // backdrop()：把上一镜最后一帧画进一张贴图并返回（入口那 0.4 秒垫在光环外面）
  const scene = new THREE.Scene(); scene.background = col('#05050b'); scene.fog = new THREE.Fog('#05050b', 160, 520); sky(scene, { moon: false });
  const cam = new THREE.PerspectiveCamera(55, 16 / 9, 0.3, 3000); scene.add(cam); const hud = lyricHud(mv, cam);
  // 入口：上一镜推进了瞳孔 —— 这里是从同一个圆洞里往外看，洞边是瞳孔那圈柠黄，0.4 秒胀出画外
  const iris = new THREE.Group(); iris.position.z = -1; cam.add(iris);
  const irisDark = new THREE.Mesh(new THREE.RingGeometry(1, 40, 96), new THREE.MeshBasicMaterial({ color: '#07070d', depthTest: false, depthWrite: false, transparent: true, fog: false })); irisDark.renderOrder = 15;
  // 光环外面垫上一镜的画面（镜筒的霓虹线、环形招牌）：跟着光环一起往外放大、同时淡掉 —— 线是飞出画外的，不是切没的
  const backU = { tMap: { value: null }, uScale: { value: 1 }, uHole: { value: 0.6 }, uAlpha: { value: 1 } };
  const back = new THREE.Mesh(new THREE.PlaneGeometry(2 * 16 / 9, 2), new THREE.ShaderMaterial({ uniforms: backU, depthTest: false, depthWrite: false, transparent: true, fog: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform sampler2D tMap; uniform float uScale, uHole, uAlpha; varying vec2 vUv;
      void main(){
        vec2 p = (vUv - 0.5) * vec2(2.0 * 16.0 / 9.0, 2.0); float r = length(p);              // 以半个画高为 1
        if (r < uHole) discard;
        vec3 c = texture2D(tMap, 0.5 + (vUv - 0.5) / uScale).rgb;
        gl_FragColor = vec4(c, uAlpha);
      }` }));
  back.renderOrder = 15; back.position.z = -1; back.visible = false; cam.add(back);
  const irisRim = new THREE.Mesh(new THREE.RingGeometry(0.965, 1.035, 96), new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 2.2), depthTest: false, depthWrite: false, transparent: true, fog: false })); irisRim.renderOrder = 16;
  iris.add(irisDark, irisRim);
  // 地平线上的城
  const rnd = mulberry32(13), items = [];
  for (let i = 0; i < 260; i++) { const x = (rnd() - 0.5) * 420, z = -60 - rnd() * 200; items.push({ x, z, w: 6 + rnd() * 6, h: 5 + rnd() ** 2 * 17, dx: 0, dz: 0, yaw: 0, seed: rnd(), lit: 0, r: 1e6 }); }
  const bU = blockU(); scene.add(blocks(items, bU));
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#0a0a14' })); scene.add(ground);
  // 网：节点先是一团散在夜空里的云；之后按「离中心第几近 + 原来的方位角」落到眼睛的各个环上（邻居还是邻居，连线不会乱穿）
  const N = 460, C = V(0, 58, -150), RE = 36, P0 = [], P1 = [], seed = [];
  for (let i = 0; i < N; i++) { P0.push(V((rnd() - 0.5) * 200, 20 + rnd() * 84, -150 + (rnd() - 0.5) * 40)); seed.push(rnd()); }
  const order = P0.map((p, i) => ({ i, rho: Math.hypot(p.x - C.x, (p.y - C.y) * 1.8), th: Math.atan2(p.y - C.y, p.x - C.x) })).sort((a, b) => a.rho - b.rho);
  const GROUPS = [[0.14, 0, 0.16], [0.16, 0.36, 0.36], [0.2, 0.6, 0.6], [0.2, 0.86, 0.86], [0.3, -1, -1]];   // [占比, 内半径, 外半径]（× RE）：瞳孔是一团，其余是环
  { let s = 0; for (const [frac, r0, r1] of GROUPS) { const n = Math.round(frac * N), g = order.slice(s, s + n).sort((a, b) => a.th - b.th); s += n;
      g.forEach((o, k) => { const th = r0 === 0 ? o.th : -Math.PI + (k + 0.5) / g.length * Math.PI * 2, rr = RE * (r0 === 0 ? r1 * Math.sqrt(seed[o.i]) : r0);
        P1[o.i] = r0 < 0 ? V(C.x + Math.cos(th) * RE * 2.1, C.y + Math.sign(Math.sin(th)) * RE * 1.18 * Math.sin(th) ** 2, C.z)      // 最外一组：上下眼睑
          : V(C.x + Math.cos(th) * rr, C.y + Math.sin(th) * rr, C.z); }); }
    for (let i = 0; i < N; i++) if (!P1[i]) P1[i] = C.clone(); }
  const links = []; for (let i = 0; i < N; i++) { const d = P0.map((p, j) => [p.distanceToSquared(P0[i]), j]).sort((a, b) => a[0] - b[0]); for (const [, j] of d.slice(1, 4)) if (i < j || !d.slice(1, 4).some(([, q]) => q === i)) links.push([i, j]); }
  const pPos = new Float32Array(N * 3), pCol = new Float32Array(N * 3), pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pPos, 3)); pg.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
  const dotTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
  const pts = new THREE.Points(pg, new THREE.PointsMaterial({ size: 5, map: dotTex, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); pts.frustumCulled = false; scene.add(pts);
  const lPos = new Float32Array(links.length * 6), lCol = new Float32Array(links.length * 6), lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(lPos, 3)); lg.setAttribute('color', new THREE.BufferAttribute(lCol, 3));
  const lines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); lines.frustumCulled = false; scene.add(lines);
  // 收拢完成后压上去的实环（让眼睛的边是利索的）
  const eye = new THREE.Group(); eye.position.copy(C); scene.add(eye); const eyeM = new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 2), transparent: true, opacity: 0, fog: false, depthWrite: false });
  for (const [r0, r1] of [[0.35, 0.37], [0.59, 0.61], [0.84, 0.88]]) eye.add(new THREE.Mesh(new THREE.RingGeometry(RE * r0, RE * r1, 128), eyeM));
  const coreM = new THREE.MeshBasicMaterial({ color: hdr(PAL.lemon, 2.6), transparent: true, opacity: 0, fog: false, depthWrite: false }); const core = new THREE.Mesh(new THREE.CircleGeometry(RE * 0.15, 64), coreM); core.position.z = 0.1; eye.add(core);
  const hsh = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
  const cP = col(PAL.pink), cM = col(PAL.mint), cL = col(PAL.lemon), cW = col(PAL.paper), tmp = new THREE.Color(), pos = P0.map(() => V());
  return { id: 'l4-net', t0: T0, t1: T1, transitionIn: { kind: 'cut' }, build: () => ({}),
    update(_, T) {
      const k = T - T_DROP; bU.uT.value = T;
      const gather = eIO((k - 0.3) / 1.0), look = smooth((T - 12.2) / 0.3);                 // 0.3 s 之后开始收拢，1 秒收完；12.2 起这只眼往下看
      for (let i = 0; i < N; i++) {
        const wave = smooth((k * 520 - (P0[i].x + 95)) / 30), jit = (1 - wave) * 2.2;       // 同步的那一波：从左往右 0.4 秒扫完
        pos[i].lerpVectors(P0[i], P1[i], gather).add(V(jit * Math.sin(T * (5 + 9 * seed[i]) + i), jit * Math.cos(T * (4 + 7 * seed[i]) + i * 2), 0));
        if (look > 0 && P1[i].distanceTo(C) < RE * 0.2) pos[i].y -= 4.5 * look;              // 瞳孔往下挪：它在看这座城
        const err = hsh(i, Math.floor(T * (4 + 6 * seed[i]))) < 0.3;                          // 没学会：节点各闪各的，三成在报错（粉）
        tmp.copy(err ? cP : hsh(i, 7) < 0.5 ? cM : cW).multiplyScalar(err ? 1.5 : 0.35 + 0.5 * hsh(i, Math.floor(T * 9))).lerp(cL.clone().multiplyScalar(1.5 + 2.2 * Math.exp(-Math.max(0, k - (P0[i].x + 95) / 520) * 5)), wave);
        pPos.set([pos[i].x, pos[i].y, pos[i].z], i * 3); pCol.set([tmp.r, tmp.g, tmp.b], i * 3);
      }
      links.forEach(([a, b], n) => {
        const wave = smooth((k * 520 - ((P0[a].x + P0[b].x) / 2 + 95)) / 30), on = hsh(n, Math.floor(T * (3 + 8 * hsh(n, 1)))) < 0.35 ? 0.5 : 0.06;   // 没学会：连线断断续续
        tmp.copy(hsh(n, 3) < 0.5 ? cP : cM).multiplyScalar(on).lerp(cL.clone().multiplyScalar(0.9 + 1.6 * Math.exp(-Math.max(0, k - ((P0[a].x + P0[b].x) / 2 + 95) / 520) * 4)), wave);
        lPos.set([pos[a].x, pos[a].y, pos[a].z, pos[b].x, pos[b].y, pos[b].z], n * 6); lCol.set([tmp.r, tmp.g, tmp.b, tmp.r, tmp.g, tmp.b], n * 6);
      });
      pg.attributes.position.needsUpdate = pg.attributes.color.needsUpdate = lg.attributes.position.needsUpdate = lg.attributes.color.needsUpdate = true;
      const done = smooth((k - 1.15) / 0.3); eyeM.opacity = done; coreM.opacity = done; core.position.y = -4.5 * look; core.scale.setScalar(1 + 0.25 * beat(mv, T));
      // 镜头：从街上仰着看夜空里这张乱闪的网，慢慢推；收拢成眼之后朝瞳孔冲过去
      const push = clamp((T - 12.2) / 0.9) ** 2.4, drift = (T - T0) * 2.2;
      cam.position.set(lerp(6, 0, smooth(k / 1)), lerp(4, C.y - 4.5, push), lerp(-28 - drift, C.z + 4.5, push)); cam.up.set(0, 1, 0);
      cam.lookAt(0, lerp(54, C.y - 4.5 * look, smooth(k / 0.8)), C.z); cam.fov = 55; cam.updateProjectionMatrix(); hud(T);
      const io = clamp((T - T0) / 0.4), ir = r0 * (1 + 4.2 * io * io) * Math.tan(cam.fov * Math.PI / 360);   // 光环半径：从上一镜玻璃的大小胀到画外
      iris.visible = io < 1; iris.scale.set(ir, ir, 1);
      const grow = 1 + 4.2 * io * io, tf = Math.tan(cam.fov * Math.PI / 360);
      back.visible = irisDark.visible = false;
      if (io < 1 && backdrop) { backU.tMap.value = backdrop(); backU.uScale.value = grow; backU.uHole.value = r0 * grow; backU.uAlpha.value = 1 - smooth(io / 0.85); back.scale.set(tf, tf, 1); back.visible = true; }
      else irisDark.visible = io < 1;
      return { scene, camera: cam, post: { bloom: { strength: 0.95, threshold: 0.95 }, chroma: 0.08 + (k > 0 ? 0.7 * Math.exp(-k * 5) : 0), grade: { vignette: 0.4 }, flash: k > 0 && k < 0.2 ? { amount: 0.3 * Math.exp(-k * 16), color: '#ffffff' } : { amount: smooth((T - (T1 - 0.12)) / 0.12), color: PAL.lemon } } };
    } };
}

export async function makeV401Net(mv, opts = {}) {
  await new FontFace('UIAnton', `url(${new URL('../../../assets/fonts/anton/Anton-Regular.ttf', import.meta.url)})`).load().then(f => document.fonts.add(f));
  return net(mv, opts);
}

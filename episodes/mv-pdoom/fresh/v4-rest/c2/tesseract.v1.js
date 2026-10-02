// kits/tesseract.js —— 超立方体数据空间（#1048 / #1053 共用）：副歌 2 结尾她被吸进去的地方、主歌 3 开头她悬浮着找出口的地方。
// 参考《星际穿越》的 tesseract：一个巨大的晶格，画框和光丝往上下、左右、前后所有方向重复下去；镜头在晶格内部，四周都很远。不是隧道。
//
//   import { createTesseract } from '../kits/tesseract.js';
//   const tess = await createTesseract(mv, { zMax: 40 });       // 本地坐标：原点附近是「她待的地方」，晶格往 ±X ±Y ±Z 铺开；zMax = 本地 z 大于它的部分不画（比如门的外面）
//   scene.add(tess.group);
//   每帧：
//     tess.update(T, { phase, exit, dim });
//         phase：数据流过的量。增大 = 光丝上的亮点往 −Z / +X / +Y 流、画框里的切片正放；减小 = 倒流、倒放。1 = 画框里前进一帧
//         exit 0..1：−Z 远处的出口光；dim 0..1：整体压暗
//     镜面格（她的倒影）：tess.mirrors = [{ pos, slot, mesh }]，每个格子显示某个 slot 的画面。每帧对要用的 slot 各拍一次：
//         poseGirl(T - 0.4); tess.capture(scene, girl.root, center, 1);     // slot 1：慢半拍的她
//         poseGirl(T);       tess.capture(scene, girl.root, center, 0);     // slot 0：此刻的她（最后拍，她停在此刻的姿势上）
//       slot 0..2 各有自己的拍摄角度（正面偏右 / 正面偏左 / 侧面）；想让某个倒影「动作不一样」，就在拍那个 slot 之前把她摆成别的姿势。
//       tess.setMirror(i, { slot, pos, yaw, size, visible })：单独改某一格；tess.addMirror({ pos, yaw, size, slot }) 再加一格。
//
// 画框里的画：kits/tesseract-atlas.jpg（8 行 = 8 个镜头，每行 8 帧，是她在全片里的不同时刻）。
// 全部是传进来的参数的纯函数。单位：米（她身高 2）。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';

export const TESS = { pitch: [10, 6.5, 10], nx: 16, ny: 14, nz: 44, frame: [3.4, 1.9] };      // 晶格间距（米）、三个方向各多少格、画框大小

const col = c => new THREE.Color(c);
const hash = (a, b = 0, c = 0) => { let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263) + Math.imul(c | 0, 2147483647); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const GOLD = '#ffc978', BROWN = '#0c0705';

export async function createTesseract(mv, { zMax = 1e9, clear = 5.5, mirrors = 26, seed = 7, atlas = new URL('./tesseract-atlas.jpg', import.meta.url).href } = {}) {
  const [PX, PY, PZ] = TESS.pitch, { nx, ny, nz } = TESS, [FW, FH] = TESS.frame;
  const group = new THREE.Group();
  const X0 = -nx / 2 * PX, Y0 = -ny / 2 * PY, Z0 = 12 * PZ;                       // 晶格节点：x = X0 + (i + .5)·PX …；z 从 +Z0 铺到 Z0 − nz·PZ（原点前后都有）
  const node = (i, j, k) => [X0 + (i + 0.5) * PX, Y0 + (j + 0.5) * PY, Z0 - (k + 0.5) * PZ];
  const U = { uPhase: { value: 0 }, uDim: { value: 1 }, uZMax: { value: zMax }, uGold: { value: col(GOLD) }, uBrown: { value: col(BROWN) }, uPink: { value: col(PAL.pink) }, uMint: { value: col(PAL.mint) } };
  const FOG = /* glsl */`float fogK(vec3 w){ return exp(-length(w - cameraPosition) * 0.0105); }`;

  // ---------------------------------------------------------------- 背景：暗褐，越往下越深
  group.add(new THREE.Mesh(new THREE.SphereGeometry(1500, 24, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, uniforms: U,
    vertexShader: `varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform float uDim; varying vec3 vD; void main(){ vec3 c = mix(vec3(0.030, 0.016, 0.010), vec3(0.075, 0.042, 0.022), smoothstep(-0.6, 0.7, vD.y)); gl_FragColor = vec4(c * uDim, 1.0); }` })));

  // ---------------------------------------------------------------- 画框：晶格节点上，三个朝向都有
  const tex = await new THREE.TextureLoader().loadAsync(atlas); tex.colorSpace = THREE.SRGBColorSpace; tex.minFilter = THREE.LinearFilter; tex.generateMipmaps = false;
  const fr = []; const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), S = new THREE.Vector3(), P = new THREE.Vector3();
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) for (let k = 0; k < nz; k++) {
    const h = hash(i, j, k + seed); if (h > 0.42) continue;
    const [x, y, z] = node(i, j, k); if (Math.hypot(x, y) < clear) continue;       // 轴线附近留空（她和镜头要过）
    const o = hash(i + 31, j, k), axis = o < 0.5 ? 0 : o < 0.8 ? 1 : 2;             // 0 = 正对 Z，1 = 正对 X，2 = 正对 Y（平躺）
    fr.push({ x, y, z, axis, clip: Math.floor(hash(i, j + 17, 3) * 8), off: k % 8, big: hash(i, j, k + 99) < 0.12 ? 2 : 1 });
  }
  const fGeo = new THREE.PlaneGeometry(1, 1); const aTile = new Float32Array(fr.length * 2);
  fGeo.setAttribute('aTile', new THREE.InstancedBufferAttribute(aTile, 2));
  const frames = new THREE.InstancedMesh(fGeo, new THREE.ShaderMaterial({ uniforms: { ...U, uTex: { value: tex } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    vertexShader: /* glsl */`attribute vec2 aTile; varying vec2 vUv; varying vec2 vTile; varying vec3 vW; varying vec3 vL;
      void main(){ vUv = uv; vTile = aTile; vec4 l = instanceMatrix * vec4(position, 1.0); vL = l.xyz; vec4 w = modelMatrix * l; vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */`uniform sampler2D uTex; uniform float uPhase, uDim, uZMax; uniform vec3 uGold; varying vec2 vUv; varying vec2 vTile; varying vec3 vW; varying vec3 vL;
      ${FOG}
      vec3 tile(float f){ return texture2D(uTex, (vec2(mod(f, 8.0), 7.0 - vTile.x) + vec2(clamp(vUv.x, 0.01, 0.99), clamp(vUv.y, 0.02, 0.98))) / 8.0).rgb; }
      void main(){
        if (vL.z > uZMax) discard;
        float f = vTile.y + uPhase, f0 = floor(f);
        vec3 pic = mix(tile(f0), tile(f0 + 1.0), smoothstep(0.35, 0.65, f - f0));
        float l = dot(pic, vec3(0.3, 0.55, 0.15));
        vec3 c = mix(uGold * l * 1.15, pic, 0.38) * 0.5;                               // 暖金色调，留一点原来的颜色
        vec2 e = min(vUv, 1.0 - vUv); float edge = smoothstep(0.03, 0.0, min(e.x * 1.78, e.y));
        c += uGold * edge * 0.6;                                                         // 画框的边
        gl_FragColor = vec4(c * fogK(vW) * uDim, 1.0);
      }` }), fr.length);
  fr.forEach((f, n) => { E.set(f.axis === 2 ? -Math.PI / 2 : 0, f.axis === 1 ? Math.PI / 2 : 0, 0); M.compose(P.set(f.x, f.y, f.z), Q.setFromEuler(E), S.set(FW * f.big, FH * f.big, 1)); frames.setMatrixAt(n, M); aTile.set([f.clip, f.off], n * 2); });
  frames.frustumCulled = false; group.add(frames);

  // ---------------------------------------------------------------- 光丝：沿 X、Y、Z 三个方向穿过晶格（在节点之间），上面有亮点慢慢流
  const lp = [], lu = [], ls = [];
  const line = (a, b, len, s, w) => { lp.push(...a, ...b); lu.push(0, len); ls.push(s, w, s, w); };
  const XA = X0 - PX, XB = -X0 + PX, YA = Y0 - PY, YB = -Y0 + PY, ZA = Z0 + PZ, ZB = Z0 - (nz + 1) * PZ;
  for (let i = 0; i <= nx; i++) for (let j = 0; j <= ny; j++) { const x = X0 + i * PX, y = Y0 + j * PY; if (Math.hypot(x, y) < 2.5) continue; line([x, y, ZA], [x, y, ZB], ZA - ZB, hash(i, j, 1), 1); }          // 沿 Z（纵深）
  for (let j = 0; j <= ny; j++) for (let k = 0; k <= nz; k++) { const y = Y0 + j * PY, z = Z0 - k * PZ; if (Math.abs(y) < 2.5) continue; line([XA, y, z], [XB, y, z], XB - XA, hash(j, k, 2), 0.8); }             // 沿 X（横向）
  for (let i = 0; i <= nx; i++) for (let k = 0; k <= nz; k++) { const x = X0 + i * PX, z = Z0 - k * PZ; if (Math.abs(x) < 2.5) continue; line([x, YA, z], [x, YB, z], YB - YA, hash(i, k, 3), 0.8); }             // 沿 Y（竖向）
  const lGeo = new THREE.BufferGeometry(); lGeo.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3)); lGeo.setAttribute('aU', new THREE.Float32BufferAttribute(lu, 1)); lGeo.setAttribute('aS', new THREE.Float32BufferAttribute(ls, 2));
  const lines = new THREE.LineSegments(lGeo, new THREE.ShaderMaterial({ uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`attribute float aU; attribute vec2 aS; varying float vU; varying vec2 vS; varying vec3 vW; varying vec3 vL; void main(){ vU = aU; vS = aS; vL = position; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */`uniform float uPhase, uDim, uZMax; uniform vec3 uGold, uPink, uMint; varying float vU; varying vec2 vS; varying vec3 vW; varying vec3 vL;
      ${FOG}
      void main(){
        if (vL.z > uZMax) discard;
        float s = vU / 26.0 - uPhase * (0.05 + 0.05 * vS.x) + vS.x * 9.0, d = abs(fract(s) - 0.5);      // 每 26 米一个亮点，随 phase 流
        float dot1 = smoothstep(0.018, 0.0, d) * 2.6 + smoothstep(0.08, 0.0, d) * 0.35;
        vec3 c = uGold * (0.12 + 0.07 * vS.x) * vS.y + (vS.x > 0.9 ? uPink : vS.x < 0.1 ? uMint : uGold) * dot1;
        gl_FragColor = vec4(c * fogK(vW) * uDim, 1.0);
      }` }));
  lines.frustumCulled = false; group.add(lines);

  // ---------------------------------------------------------------- 出口：−Z 远处的一团光
  const exitTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.2, 'rgba(255,244,214,.75)'); gr.addColorStop(1, 'rgba(255,220,160,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c); })();
  const exit = new THREE.Sprite(new THREE.SpriteMaterial({ map: exitTex, color: col('#ffffff'), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); exit.position.set(0, 0, ZB + 40); group.add(exit);

  // ---------------------------------------------------------------- 镜面格：她的倒影（每个 slot 一张实时拍的图）
  const renderer = mv.stage.renderer, LAYER = 2, NSLOT = 3;
  const rts = Array.from({ length: NSLOT }, () => new THREE.WebGLRenderTarget(512, 512, { type: THREE.HalfFloatType }));
  const camDirs = [new THREE.Vector3(0.5, 0.12, -1), new THREE.Vector3(-0.6, 0.2, -1), new THREE.Vector3(1, 0.1, -0.15)].map(v => v.normalize());      // 她面朝 −Z：正面偏右 / 正面偏左 / 右侧面
  const pcam = new THREE.PerspectiveCamera(24, 1, 0.5, 60); pcam.layers.set(LAYER);
  const marked = new WeakSet(), _c = new THREE.Color();
  /** 把她单独拍进第 slot 张图。center = 她身体中心（世界坐标）。拍之前自己把她摆成想要的姿势 / 时刻。 */
  function capture(scene, subject, center, slot = 0, { dir = camDirs[slot], dist = 5.4 } = {}) {
    if (!marked.has(subject)) { subject.traverse(o => o.layers.enable(LAYER)); scene.traverse(o => { if (o.isLight) o.layers.enable(LAYER); }); marked.add(subject); }
    subject.updateMatrixWorld(true);
    pcam.position.copy(center).addScaledVector(dir, dist); pcam.up.set(0, 1, 0); pcam.lookAt(center.x, center.y + 0.15, center.z); pcam.updateMatrixWorld(true);
    const bg = scene.background, prev = renderer.getRenderTarget(), a0 = renderer.getClearAlpha(); renderer.getClearColor(_c);
    scene.background = null; renderer.setRenderTarget(rts[slot]); renderer.setClearColor(0x000000, 0); renderer.clear(); renderer.render(scene, pcam);
    renderer.setRenderTarget(prev); renderer.setClearColor(_c, a0); scene.background = bg;
  }
  const mirrorMats = rts.map(rt => new THREE.ShaderMaterial({ uniforms: { ...U, uTex: { value: rt.texture } }, transparent: true, depthWrite: false, side: THREE.DoubleSide,
    vertexShader: `varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */`uniform sampler2D uTex; uniform float uDim; uniform vec3 uGold; varying vec2 vUv; varying vec3 vW;
      ${FOG}
      void main(){
        vec4 g = texture2D(uTex, vec2(1.0 - vUv.x, vUv.y));                               // 左右翻：镜子里的她
        vec3 glass = vec3(0.055, 0.045, 0.05) + uGold * 0.07 * (1.0 - vUv.y);             // 镜面：比周围略亮的暗玻璃
        vec3 c = mix(glass, g.rgb * 0.92, g.a);
        vec2 e = min(vUv, 1.0 - vUv); float edge = smoothstep(0.022, 0.0, min(e.x, e.y));
        c += (uGold * 1.5 + 0.35) * edge;                                                 // 镜框：比画框亮，一眼分得出
        float k = fogK(vW);
        gl_FragColor = vec4(c * k * uDim, (0.82 * (1.0 - edge) + edge) * smoothstep(0.02, 0.3, k));
      }` }));
  const mGeo = new THREE.PlaneGeometry(1, 1), mirrorList = [];
  function addMirror({ pos, yaw = 0, pitch = 0, size = 3.6, slot = 0 }) {
    const mesh = new THREE.Mesh(mGeo, mirrorMats[slot]); mesh.position.set(...pos); mesh.rotation.set(pitch, yaw, 0, 'YXZ'); mesh.scale.set(size, size, 1); mesh.renderOrder = 3; group.add(mesh);
    const m = { pos: mesh.position, slot, mesh }; mirrorList.push(m); return m;
  }
  function setMirror(i, { slot, pos, yaw, pitch, size, visible } = {}) {
    const m = mirrorList[i]; if (!m) return;
    if (slot != null) { m.slot = slot; m.mesh.material = mirrorMats[slot]; } if (pos) m.mesh.position.set(...pos); if (yaw != null) m.mesh.rotation.y = yaw; if (pitch != null) m.mesh.rotation.x = pitch; if (size) m.mesh.scale.set(size, size, 1); if (visible != null) m.mesh.visible = visible;
  }
  // 默认的镜面格：散在轴线四周（离轴线 7–26 m，原点往 −Z 的 0–90 m 之间），都朝着轴线上、离镜头更近的一点
  for (let n = 0; n < mirrors; n++) {
    const a = hash(n, 5, seed) * 6.2832, r = 7 + 19 * hash(n, 6, seed) ** 1.3, z = 8 - 98 * hash(n, 7, seed), x = Math.cos(a) * r, y = Math.sin(a) * r * 0.62;
    const m = addMirror({ pos: [x, y, z], size: 3.2 + 3.2 * hash(n, 8, seed), slot: n % NSLOT === 2 ? 2 : n % 2 });
    m.mesh.lookAt(group.localToWorld(new THREE.Vector3(x * 0.25, y * 0.25, z + 14)));
  }

  function update(T, { phase = 0, exit: ex = 0, dim = 0 } = {}) {
    U.uPhase.value = phase; U.uDim.value = 1 - dim;
    exit.material.opacity = Math.min(1, ex * 1.2); exit.scale.setScalar(30 + 900 * ex * ex);
  }
  return { group, update, capture, mirrors: mirrorList, addMirror, setMirror, frames, lines, slots: NSLOT, pitch: TESS.pitch };
}

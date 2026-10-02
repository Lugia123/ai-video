// kits/transit.js — 2D ↔ 3D 转换器（mv-pdoom v4，W2）。全部是 T 的纯函数。
//
//   a) unfold  推进屏幕 → 屏幕平面裂成面板向外翻开，后面被压扁的 3D 空间「充气」展开
//        const u = unfold({ texture, width, height, world, cols, rows });  scene.add(u.group)
//        u.update(T, { t0, dur })       p = (T - t0)/dur；面板从中心往外依次翻开，world.scale.z 0.02 → 1
//        u.fillDistance(fov)            相机离屏幕多远时屏幕正好铺满画面（推镜终点用）
//   b) popUp   立体书：一页平放的 2D 图，页上的东西沿底边折起来立成 3D
//        const b = popUp({ page, items: [{ obj, at, dur, hinge:'near'|'far' }] }); b.update(T)
//        popCamera(cam, p, { target, dist })   俯视（像看平面图）→ 斜 45°（看出立体）
//   c) climbOut 从手机屏幕里爬出来：2D 立绘贴近玻璃、裂纹一道道加深 → 屏幕碎成碎片飞出 → 3D 的她从屏幕里探出身落到桌面
//        const c = climbOut({ ui, surface, device, cracks:[t...], breakAt, outDur, girlScale });
//        const info = c.update(T, drawScreen, drawOver)   drawScreen 画屏幕底图，然后叠立绘，drawOver 画在立绘上面（气泡），最后是裂纹
//        info.girl = { visible, position, rotationY, scale, pose }  —— 调用方用它摆 girl.js（先摆 root 再 pose / setSkin）
//   d) intoScreen 3D 世界收进一块屏幕：世界画进 RT，贴到横放的手机屏上；外相机从「屏幕正好铺满画面」一路拉远；
//        同时世界相机收窄 fov 往后退（透视压扁成近似正交），屏幕着色色块化（量化到五色）
//        const d = intoScreen({ renderer, device: ui.device('phone', {W:1280,H:720,tex:null}) ... }) 见下
//
// 配色：ink / pink / mint / lemon / paper。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIn = p => clamp(p) ** 3;
const eBack = (p, s = 1.6) => { p = clamp(p); return 1 + (s + 1) * (p - 1) ** 3 + s * (p - 1) ** 2; };
const hash = (a, b = 0) => { let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

// 平面切成 cols×rows 块，每块 UV 对应原图的子矩形
function tiles(texture, width, height, cols, rows, material) {
  const out = [];
  const tw = width / cols, th = height / rows;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const g = new THREE.PlaneGeometry(tw, th);
    const uv = g.attributes.uv;
    for (let k = 0; k < uv.count; k++) uv.setXY(k, (i + uv.getX(k)) / cols, (j + uv.getY(k)) / rows);
    const m = new THREE.Mesh(g, material ?? new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
    out.push({ mesh: m, i, j, cx: -width / 2 + (i + 0.5) * tw, cy: -height / 2 + (j + 0.5) * th, tw, th });
  }
  return out;
}

// ================================================================ a) 屏幕展开成 3D 空间
export function unfold({ texture, width = 16, height = 9, world = null, cols = 8, rows = 5, depth = 30 } = {}) {
  const group = new THREE.Group();
  const panels = tiles(texture, width, height, cols, rows).map(t => {
    // 每块绕自己靠外的那条竖边翻开（左半边绕左边、右半边绕右边），像两扇扇门一格格打开
    const hinge = new THREE.Group();
    const left = t.cx < 0;
    hinge.position.set(t.cx + (left ? -t.tw / 2 : t.tw / 2), t.cy, 0);
    t.mesh.position.x = left ? t.tw / 2 : -t.tw / 2;
    hinge.add(t.mesh);
    group.add(hinge);
    const r = Math.hypot(t.cx / width, t.cy / height);
    return { ...t, hinge, left, delay: r * 0.5 + hash(t.i, t.j) * 0.08 };
  });
  const holder = new THREE.Group();
  if (world) holder.add(world);
  group.add(holder);
  function update(T, { t0 = 0, dur = 1.2 } = {}) {
    const p = (T - t0) / dur;
    for (const P of panels) {
      const q = eOut((p - P.delay) / 0.5);
      P.hinge.rotation.y = (P.left ? 1 : -1) * q * 1.9;
      P.hinge.visible = q < 0.999;
    }
    // 后面的世界：一开始被压扁贴在屏幕背面，随着面板打开「充气」出深度
    const g = smooth(p * 1.2);
    holder.scale.set(1, 1, Math.max(0.02, g));
    holder.position.z = -0.05;
    holder.visible = p > 0;
  }
  const fillDistance = fov => (height / 2) / Math.tan(THREE.MathUtils.degToRad(fov / 2));
  update(-1e9);
  return { group, update, panels, holder, fillDistance, width, height, depth };
}

// ================================================================ b) 立体书折起
// page：平放（朝上）的 2D 页面网格；items = [{ obj, at, dur, side:'near'|'far', pos }]：obj 以自己的 y 轴为「立起来的高度」，
// 折页线在 pos 处沿 x 轴；p=0 时平躺在页上（side=near 往镜头这边倒、far 往远处倒），at 起折起来，带一点过冲。
export function popUp({ page = null, items = [] } = {}) {
  const group = new THREE.Group();
  if (page) group.add(page);
  const W = items.map(it => {
    const hinge = new THREE.Group();
    if (it.pos) hinge.position.copy(it.pos);
    hinge.add(it.obj);
    group.add(hinge);
    return { ...it, pivot: hinge };
  });
  function update(T) {
    for (const it of W) {
      const q = eBack((T - it.at) / (it.dur ?? 0.45), 1.4);
      const flat = (it.side === 'far' ? -1 : 1) * Math.PI / 2;
      it.pivot.rotation.x = flat * (1 - q);
      it.pivot.scale.y = Math.max(0.03, Math.min(1.2, 0.03 + q));   // 平躺时压扁，免得和页面打架
    }
  }
  update(-1e9);
  return { group, update, items: W };
}
// 俯视 → 斜视：p=0 正上方看（长焦，几乎没有透视 = 像一张平面图），p=1 斜 45° 正常透视
export function popCamera(cam, p, { target = new THREE.Vector3(), dist = 12, yaw = 0.3 } = {}) {
  const q = smooth(p);
  const fov = lerp(8, 40, q);
  const d = dist * Math.tan(THREE.MathUtils.degToRad(20)) / Math.tan(THREE.MathUtils.degToRad(fov / 2));
  const el = lerp(Math.PI / 2 - 0.001, 0.62, q), az = yaw * q;
  cam.fov = fov;
  cam.position.set(target.x + Math.sin(az) * Math.cos(el) * d, target.y + Math.sin(el) * d, target.z + Math.cos(az) * Math.cos(el) * d);
  cam.up.set(0, q < 0.02 ? 0 : 1, q < 0.02 ? -1 : 0);
  cam.lookAt(target);
  cam.updateProjectionMatrix();
}

// ================================================================ c) 从屏幕里爬出来
// device = ui.device('phone', surface)；surface 由这里每帧重画（底图 → 立绘 → 裂纹），碎裂后屏幕换成飞散的碎片
export function climbOut({ ui, surface, device, cracks = [], breakAt = 1, outDur = 1.2, girlScale = 0.9, line = null, floorY = null, girlBox = null, hits = null } = {}) {
  // girlBox(T) → {x,y,w,h} 自定立绘框（默认居中铺底）；hits = [{at, x, y, size, angle, flip}]（x,y 为屏幕 0..1）：
  //   每次拍玻璃在该处贴手印，裂纹从手掌处放射，并返回 shake 让调用方震屏
  const S = surface, [w, h] = device.size;
  const shards = new THREE.Group();
  const T_COLS = 7, T_ROWS = 12;
  const pieces = tiles(S.tex, w, h, T_COLS, T_ROWS).map(t => {
    // 每块再对角切一刀成两个三角：更像碎玻璃
    const g = t.mesh.geometry.toNonIndexed();
    const tri = [0, 1].map(k => {
      const gg = new THREE.BufferGeometry();
      for (const name of ['position', 'uv']) {
        const a = g.attributes[name];
        gg.setAttribute(name, new THREE.BufferAttribute(a.array.slice(k * 3 * a.itemSize, (k + 1) * 3 * a.itemSize), a.itemSize));
      }
      const m = new THREE.Mesh(gg, t.mesh.material);
      m.position.set(t.cx, t.cy, device.depth * 0.32 + 0.002);
      shards.add(m);
      return { m, cx: t.cx, cy: t.cy, k, i: t.i, j: t.j };
    });
    return tri;
  }).flat();
  shards.visible = false;
  device.group.add(shards);
  function update(T, drawScreen = null, drawOver = null) {
    const kb = T - breakAt;
    // 屏幕底图 + 立绘（贴玻璃往前挤）+ 裂纹
    S.clear(PAL.ink);
    drawScreen?.(S.ctx, T);
    const n = cracks.filter(c => T >= c).length;
    const lean = clamp((T - (cracks[0] ?? breakAt)) / Math.max(0.1, breakAt - (cracks[0] ?? breakAt)));
    const slap = cracks.map(at => ({ at }));
    const bw = S.W * (0.9 + 0.35 * lean), bh = S.H * (0.62 + 0.3 * lean);
    const box = girlBox ? girlBox(T, lean) : { x: (S.W - bw) / 2, y: S.H - bh, w: bw, h: bh };
    ui.draw.girl(S.ctx, box, T, { line, expression: n >= 2 ? 'surprised' : 'neutral', slap });
    drawOver?.(S.ctx, T);   // 画在立绘上面的界面层（气泡等）
    let shake = 0;
    if (hits) {
      hits.forEach((hh, i) => {
        const k = T - hh.at;
        if (k >= 0) {
          ui.draw.cracks(S.ctx, { x: 0, y: 0, w: S.W, h: S.H }, T, { n: 5 + i * 2, seed: 11 + i * 7, cx: hh.x, cy: hh.y });
          shake = Math.max(shake, Math.exp(-k * 9));
        }
        ui.draw.palm(S.ctx, hh.x * S.W, hh.y * S.H, T, { at: hh.at, size: hh.size ?? 150, angle: hh.angle ?? 0, flip: hh.flip, until: hits[i + 1] ? hits[i + 1].at - 0.14 : Infinity });
      });
    } else if (n) ui.draw.cracks(S.ctx, { x: 0, y: 0, w: S.W, h: S.H }, T, { n: 3 + n * 3, seed: 3 + n, cx: 0.5, cy: 0.45 });
    S.commit();
    device.screen.visible = kb < 0;
    shards.visible = kb >= 0 && kb < 1.6;
    if (shards.visible) for (const s of pieces) {
      const dx = s.cx / w, dy = s.cy / h;
      const v = new THREE.Vector3(dx * 3.2 + (hash(s.i, s.j * 2 + s.k) - 0.5), dy * 2.4 + 1.2 * hash(s.j, s.i + s.k), 2.2 + 2.5 * hash(s.i + 7, s.j + s.k));
      const f = kb;
      s.m.position.set(s.cx + v.x * f, s.cy + v.y * f - 3.5 * f * f, device.depth * 0.32 + v.z * f);
      s.m.rotation.set(f * 9 * (hash(s.i, 3 + s.k) - 0.5), f * 9 * (hash(s.j, 5 + s.k) - 0.5), f * 5 * (hash(s.i + s.j, 9) - 0.5));
    }
    // 3D 的她：碎裂瞬间从屏幕后方探出上半身 → 整个人出来 → 落到设备前方的桌面上
    const q = clamp(kb / outDur);
    const pos = new THREE.Vector3(0, -h * 0.35, lerp(-0.15, h * 0.55, eOut(q)));
    const wpos = device.group.localToWorld(pos.clone());
    // 落地：floorY（世界坐标）给了就从探身高度抛物线落到地面
    if (floorY != null) { const y0 = wpos.y; const f = clamp((q - 0.35) / 0.65); wpos.y = lerp(y0, floorY, f * f) + 0.25 * Math.sin(Math.PI * f) * (1 - f); }
    return {
      shattered: kb >= 0, shake,
      girl: { visible: kb >= 0, position: wpos, rotationY: device.group.rotation.y, scale: girlScale, pose: q < 0.45 ? 'reachUp' : q < 0.85 ? 'airborne' : null, q },
    };
  }
  return { update, shards, surface: S };
}

// ================================================================ d) 3D 世界收进一块屏幕
// 屏幕着色：取世界 RT，按 k 往五色调色板量化（色块化），外加细扫描线
const POSTER_FS = /* glsl */`
uniform sampler2D tMap; uniform float k; uniform vec3 c0, c1, c2, c3, c4; varying vec2 vUv;
vec3 near(vec3 c){
  vec3 best = c0; float d = distance(c, c0);
  float e = distance(c, c1); if (e < d) { d = e; best = c1; }
  e = distance(c, c2); if (e < d) { d = e; best = c2; }
  e = distance(c, c3); if (e < d) { d = e; best = c3; }
  e = distance(c, c4); if (e < d) { d = e; best = c4; }
  return best;
}
void main(){
  vec2 uv = vUv;
  float px = mix(1.0, 90.0, k);                       // 色块化时顺便降采样成大像素
  vec2 g = vec2(160.0, 90.0) * (1.0 + 7.0 * (1.0 - k));
  if (k > 0.02) uv = (floor(uv * g) + 0.5) / g;
  vec3 c = texture2D(tMap, uv).rgb;
  c = c / (1.0 + c);                                  // 粗色调映射，量化前压到 0..1
  vec3 q = near(pow(c, vec3(0.4545)));
  vec3 outc = mix(pow(c, vec3(0.4545)), q, k);
  outc *= 1.0 - 0.08 * k * step(0.5, fract(vUv.y * 180.0));
  gl_FragColor = vec4(pow(outc, vec3(2.2)), 1.0);
}`;
const QUAD_VS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`;

export function intoScreen({ renderer, device, res = [1280, 720] } = {}) {
  const rt = new THREE.WebGLRenderTarget(res[0], res[1], { type: THREE.HalfFloatType, samples: 4 });
  const col = c => new THREE.Color(c);
  const mat = new THREE.ShaderMaterial({
    vertexShader: QUAD_VS, fragmentShader: POSTER_FS,
    uniforms: { tMap: { value: rt.texture }, k: { value: 0 }, c0: { value: col(PAL.ink) }, c1: { value: col(PAL.pink) }, c2: { value: col(PAL.mint) }, c3: { value: col(PAL.lemon) }, c4: { value: col(PAL.paper) } },
  });
  // ShaderMaterial 的颜色值要线性：palette 是 sRGB → Color 已转成线性；量化在感知空间做，所以这里转回 sRGB 比较
  for (const n of ['c0', 'c1', 'c2', 'c3', 'c4']) mat.uniforms[n].value.convertLinearToSRGB();
  device.screen.material = mat;
  const [w, h] = device.size;
  // 外相机：屏幕正好铺满 16:9 画面时的距离
  const fillDistance = fov => (h / 2) / Math.tan(THREE.MathUtils.degToRad(fov / 2));
  function update(T, { t0 = 0, dur = 2, world, outer, pullTo = 4 }) {
    const p = clamp((T - t0) / dur);
    // 世界相机：收窄 fov、同时后退，保持主体大小 —— 透视越来越弱，像正交
    const wc = world.camera;
    const base = wc.userData.base ?? (wc.userData.base = { fov: wc.fov, pos: wc.position.clone(), look: world.look?.clone() ?? new THREE.Vector3() });
    const f = lerp(base.fov, 6, smooth(p * 1.3));
    const s = Math.tan(THREE.MathUtils.degToRad(base.fov / 2)) / Math.tan(THREE.MathUtils.degToRad(f / 2));
    const dir = base.pos.clone().sub(base.look);
    wc.fov = f; wc.position.copy(base.look).addScaledVector(dir, s); wc.lookAt(base.look); wc.updateProjectionMatrix();
    const prev = renderer.getRenderTarget();
    renderer.setRenderTarget(rt); renderer.render(world.scene, wc); renderer.setRenderTarget(prev);
    mat.uniforms.k.value = smooth((p - 0.15) / 0.55);
    // 外相机：从铺满一路拉远到 pullTo 倍，末段镜头略侧
    const oc = outer.camera, c = device.group.localToWorld(new THREE.Vector3(0, 0, device.depth * 0.32));
    const d0 = fillDistance(oc.fov), d = lerp(d0, d0 * pullTo, eIn(p) * 0.4 + smooth(p) * 0.6);
    const side = smooth((p - 0.4) / 0.6) * 0.35;
    const nrm = new THREE.Vector3(0, 0, 1).applyQuaternion(device.group.getWorldQuaternion(new THREE.Quaternion()));
    oc.position.copy(c).addScaledVector(nrm, d).add(new THREE.Vector3(Math.sin(side) * d * 0.4, side * d * 0.25, 0));
    oc.lookAt(c);
    oc.updateMatrixWorld();
    return { p, k: mat.uniforms.k.value };
  }
  return { update, rt, material: mat, fillDistance };
}

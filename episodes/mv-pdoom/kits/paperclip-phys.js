// kits/paperclip-phys.js —— 真碰撞的回形针：离线刚体模拟烘焙成数据，这里按 T 查表回放（seek 任意时刻结果都一样）。#1073
//
// 烘焙：node tools/paperclip-bake/bake.mjs <tower|pile>   → kits/paperclip-phys/<名字>.bin.gz（格式见烘焙脚本开头）
//   tower：一栋由回形针拼成的楼（30×30×66，两层外壳 + 屋顶 + 九层楼板，5364 枚），0.5 s 后自上而下松开、坍塌、散落，共 6.5 s
//   pile ：3200 枚从上面倒下来，落在不平的地上真碰撞、真堆起来，共 9 s（4.6 s 倒完，之后慢慢塌稳）
// 单位：烘焙数据用「回形针曲线单位」——一枚长 3.06、宽 1。回放物体整体乘 unit（一个曲线单位 = 多少世界单位）。
//
// 用法：
//   import { loadClipBake, createClipPlayback, createClipDunes, createClipEnv, duneHeight, clipTileTexture, CLIP_TILE } from '../kits/paperclip-phys.js';
//   const env  = createClipEnv(mv.stage.renderer);                       // 金属要有东西可反射；自己有 envMap 就不用
//   const bake = await loadClipBake('tower');                            // 或 'pile'，或一个 URL
//   const tower = createClipPlayback(bake, { unit: 0.13, envMap: env, core: true, facade: (p, i, out) => out.setRGB(...) });
//   scene.add(tower.group); tower.group.position.set(x, groundY, z);     // 可以转、可以放多份（再 createClipPlayback 一次，共用同一份 bake）
//   每帧：tower.update(t)                                                // t = 这份回放自己的时间（秒）：0 = 完好的楼；bake.t0 起开始松；≥ bake.duration 停在最后一帧
//   const dunes = createClipDunes({ size: 600, count: 60000, unit: 0.13, envMap: env, flat: { x, z, r } });   scene.add(dunes.group);   // 远处起伏的回形针堆体（静态）
//
// createClipPlayback(bake, opts) → { group, mesh, core, count, duration, t0, update(t), restOf(i, out) }
//   unit      1          一个曲线单位 = 多少世界单位（她身高 1 时，0.13 ≈ 一枚回形针 0.4 个身高）
//   envMap    null       金属反射用；material 传了就不用
//   material  null       自己的材质（要支持 instanceColor）
//   shadows   false      true = 这些回形针投影也接影（调用方要开 renderer.shadowMap，并有一盏 castShadow 的灯）
//   ao        0.6        堆里被压在下面的回形针压暗多少（按列高算的假遮蔽，不依赖阴影贴图；0 = 关）
//   core      false      true = 楼里塞一个暗色的芯（只给 tower 用）：外壳是铁丝圈，不塞芯会看穿。芯顶永远在「还没松开的那一圈」下面，看不到它的轮廓
//   facade    null       (restPos, i, outColor) => void：松开之前每枚的颜色（比如按位置画出亮窗的楼面）；松开后 0.3 秒内变回金属色
//   seed      3          少量粉 / 薄荷 / 柠黄的上色用
// createClipDunes(opts) → { group, mesh, base, heightAt(x, z) }      x、z 是 group 本地坐标（世界单位）
//   size 600 · count 60000 · unit 0.13 · amp 9（起伏高度，世界单位）· wavelength 70 · seed 5 · sun [−0.5, 0.6, 0.4]（算坡面明暗和山影）
//   flat { x, z, r }   这一圈之内压平到 0（给真模拟的那一堆 / 楼留位置），r 到 2r 之间过渡
//   base true         false = 不要底面，只要那层回形针（比如铺在自己的地面上：amp 给 0、base 给 false）
//   envMap、material、shadows 同上
// clipTileTexture({ seed, size, n })：一张能无缝平铺的回形针贴图（一格 = CLIP_TILE 个曲线单位见方），堆体底面用的就是它；自己的地面也可以贴
import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), lerp = (a, b, p) => a + (b - a) * p, smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
function mulberry32(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let q = a; q = Math.imul(q ^ (q >>> 15), q | 1); q ^= q + Math.imul(q ^ (q >>> 7), q | 61); return ((q ^ (q >>> 14)) >>> 0) / 4294967296; }; }

// ---------------------------------------------------------------- 回形针几何（和 kits/world.js 的 paperclipCurve 同一条线；曲线单位）
export function clipGeometry({ radius = 0.075, radial = 6, tubular = 72 } = {}) {
  const pts = [], line = (a, b, n = 6) => { for (let i = 0; i < n; i++) { const u = i / n; pts.push(new THREE.Vector3(lerp(a[0], b[0], u), lerp(a[1], b[1], u), 0)); } },
    arc = (cx, cy, r, a0, a1, n = 10) => { for (let i = 0; i < n; i++) { const a = lerp(a0, a1, i / n); pts.push(new THREE.Vector3(cx + r * Math.cos(a), cy + r * Math.sin(a), 0)); } };
  line([0.22, 0.75], [0.22, -0.85]); arc(0, -0.85, 0.22, 0, -Math.PI); line([-0.22, -0.85], [-0.22, 1.05]); arc(0.14, 1.05, 0.36, Math.PI, 0); line([0.5, 1.05], [0.5, -1.15]); arc(0, -1.15, 0.5, 0, -Math.PI); line([-0.5, -1.15], [-0.5, 0.55], 5); pts.push(new THREE.Vector3(-0.5, 0.55, 0));
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.1), tubular, radius, radial, false);
}

// ---------------------------------------------------------------- 一张给金属反射的夜色环境（上冷白、侧面一点粉和薄荷、下暗）
export function createClipEnv(renderer) {
  const sc = new THREE.Scene();
  sc.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `varying vec3 vP; void main(){ float y = vP.y; vec3 c = mix(vec3(0.012, 0.014, 0.03), vec3(0.22, 0.25, 0.36), smoothstep(-0.2, 0.9, y));
      c += vec3(1.9, 2.0, 2.3) * pow(max(0.0, dot(vP, normalize(vec3(-0.45, 0.75, 0.4)))), 22.0);            // 主光：冷白
      c += vec3(1.0, 0.18, 0.5) * 0.45 * pow(max(0.0, dot(vP, normalize(vec3(0.9, 0.15, -0.3)))), 9.0);        // 粉
      c += vec3(0.3, 0.9, 0.75) * 0.45 * pow(max(0.0, dot(vP, normalize(vec3(-0.6, 0.1, -0.8)))), 9.0);        // 薄荷
      gl_FragColor = vec4(c, 1.0); }` })));
  const pm = new THREE.PMREMGenerator(renderer), tex = pm.fromScene(sc, 0.03).texture; pm.dispose(); return tex;
}
export const clipMaterial = ({ envMap = null, ...o } = {}) => new THREE.MeshStandardMaterial({ color: '#c4c6d2', metalness: 0.72, roughness: 0.3, envMap, envMapIntensity: 1.25, ...o });

// ---------------------------------------------------------------- 读烘焙数据
export async function loadClipBake(nameOrUrl) {
  const url = /[/.]/.test(nameOrUrl) ? nameOrUrl : new URL(`./paperclip-phys/${nameOrUrl}.bin.gz`, import.meta.url);
  const res = await fetch(url); if (!res.ok) throw new Error(`读不到回形针烘焙数据：${url}（先跑 node tools/paperclip-bake/bake.mjs）`);
  let buf = await res.arrayBuffer();
  if (new Uint8Array(buf, 0, 2)[0] === 0x1f) buf = await new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();      // 服务器没替我们解压就自己解
  const dv = new DataView(buf); if (dv.getUint32(0, true) !== 0x504C4350) throw new Error('不是回形针烘焙文件');
  const count = dv.getUint32(8, true), frames = dv.getUint32(12, true), fps = dv.getFloat32(16, true), posScale = dv.getFloat32(20, true), t0 = dv.getFloat32(24, true);
  const tAct = new Float32Array(buf.slice(32, 32 + count * 4)), data = new Int16Array(buf.slice(32 + count * 4));
  return { count, frames, fps, posScale, t0, tAct, data, duration: (frames - 1) / fps };
}

// ---------------------------------------------------------------- 回放
export function createClipPlayback(bake, { unit = 1, envMap = null, material = null, shadows = false, ao = 0.6, core = false, facade = null, seed = 3, geometry = null } = {}) {
  const { count: N, frames: F, fps, posScale: PS, data: D, tAct } = bake;
  const group = new THREE.Group(); group.scale.setScalar(unit);
  const mesh = new THREE.InstancedMesh(geometry ?? clipGeometry(), material ?? clipMaterial({ envMap }), N); mesh.frustumCulled = false; mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); mesh.castShadow = mesh.receiveShadow = shadows; group.add(mesh);
  // 每枚的本色：大多是银，少量粉 / 薄荷 / 柠黄
  const rnd = mulberry32(seed), TINT = [[1, 1, 1], ...[PAL.pink, PAL.mint, PAL.lemon].map(h => new THREE.Color(h).toArray())], tint = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { const h = rnd(), c = TINT[h < 0.88 ? 0 : 1 + Math.min(2, Math.floor((h - 0.88) / 0.04))], v = 0.82 + 0.18 * rnd(); tint.set([c[0] * v, c[1] * v, c[2] * v], i * 3); }
  mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3); mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
  const restOf = (i, out) => out.set(D[i * 7] * PS, D[i * 7 + 1] * PS, D[i * 7 + 2] * PS);
  // 松开前的颜色（楼面）
  let fac = null; if (facade) { fac = new Float32Array(N * 3); const p = new THREE.Vector3(), c = new THREE.Color(); for (let i = 0; i < N; i++) { facade(restOf(i, p), i, c.setRGB(1, 1, 1)); fac.set([c.r, c.g, c.b], i * 3); } }
  // 假遮蔽用的列高网格
  let R = 1; for (let i = 0, o = (F - 1) * N * 7; i < N; i++, o += 7) R = Math.max(R, Math.abs(D[o] * PS), Math.abs(D[o + 2] * PS)); R += 2;
  const GN = 72, cell = 2 * R / GN, top = new Float32Array(GN * GN), sp = new Float32Array(N), px = new Float32Array(N), py = new Float32Array(N), pz = new Float32Array(N);
  // 楼芯：一个暗色的方柱，顶面跟着「已经松开的最低一枚」往下降
  let coreMesh = null, coreTop = null;
  if (core) { let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9, h = 0; const p = new THREE.Vector3();
    for (let i = 0; i < N; i++) { restOf(i, p); x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); z0 = Math.min(z0, p.z); z1 = Math.max(z1, p.z); h = Math.max(h, p.y); }
    coreMesh = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0 - 1.3, 1, z1 - z0 - 1.3).translate((x0 + x1) / 2, 0.5, (z0 + z1) / 2), new THREE.MeshBasicMaterial({ color: '#06060b' })); group.add(coreMesh);
    const order = [...Array(N).keys()].sort((a, b) => tAct[a] - tAct[b]), ts = new Float32Array(N), ys = new Float32Array(N); let m = h;
    order.forEach((i, k) => { ts[k] = tAct[i]; m = Math.min(m, D[i * 7 + 1] * PS); ys[k] = m; });
    coreTop = t => { let lo = 0, hi = N; while (lo < hi) { const mid = (lo + hi) >> 1; ts[mid] <= t + 0.12 ? lo = mid + 1 : hi = mid; } return (lo ? ys[lo - 1] : h) - 1.9; }; }

  function update(t) {
    const ft = clamp(t * fps, 0, F - 1), f0 = Math.min(F - 2, Math.floor(ft)), a = F > 1 ? ft - f0 : 0, o0 = f0 * N * 7, o1 = o0 + N * 7, M = mesh.instanceMatrix.array, C = mesh.instanceColor.array, QS = 1 / 32767;
    if (ao > 0) top.fill(-1e9);
    for (let i = 0; i < N; i++) {
      const A = o0 + i * 7, B = o1 + i * 7;
      const x = (D[A] + (D[B] - D[A]) * a) * PS, y = (D[A + 1] + (D[B + 1] - D[A + 1]) * a) * PS, z = (D[A + 2] + (D[B + 2] - D[A + 2]) * a) * PS;
      let qx = D[A + 3], qy = D[A + 4], qz = D[A + 5], qw = D[A + 6]; const bx = D[B + 3], by = D[B + 4], bz = D[B + 5], bw = D[B + 6], s = qx * bx + qy * by + qz * bz + qw * bw < 0 ? -a : a;
      qx = qx * (1 - a) + bx * s; qy = qy * (1 - a) + by * s; qz = qz * (1 - a) + bz * s; qw = qw * (1 - a) + bw * s; const il = 1 / Math.hypot(qx, qy, qz, qw); qx *= il; qy *= il; qz *= il; qw *= il;
      const x2 = qx + qx, y2 = qy + qy, z2 = qz + qz, xx = qx * x2, xy = qx * y2, xz = qx * z2, yy = qy * y2, yz = qy * z2, zz = qz * z2, wx = qw * x2, wy = qw * y2, wz = qw * z2, m = i * 16;
      M[m] = 1 - (yy + zz); M[m + 1] = xy + wz; M[m + 2] = xz - wy; M[m + 3] = 0; M[m + 4] = xy - wz; M[m + 5] = 1 - (xx + zz); M[m + 6] = yz + wx; M[m + 7] = 0; M[m + 8] = xz + wy; M[m + 9] = yz - wx; M[m + 10] = 1 - (xx + yy); M[m + 11] = 0; M[m + 12] = x; M[m + 13] = y; M[m + 14] = z; M[m + 15] = 1;
      px[i] = x; py[i] = y; pz[i] = z; sp[i] = (Math.abs(D[B] - D[A]) + Math.abs(D[B + 1] - D[A + 1]) + Math.abs(D[B + 2] - D[A + 2])) * PS * fps;      /* 这一帧大概多快（曲线单位 / 秒） */
      if (ao > 0 && t > tAct[i] && sp[i] < 14) { const gx = Math.floor((x + R) / cell), gz = Math.floor((z + R) / cell); if (gx >= 0 && gx < GN && gz >= 0 && gz < GN && y > top[gz * GN + gx]) top[gz * GN + gx] = y; }
    }
    for (let i = 0; i < N; i++) {
      let k = 1; const since = t - tAct[i];
      if (ao > 0 && since > 0) { const gx = Math.floor((px[i] + R) / cell), gz = Math.floor((pz[i] + R) / cell); if (gx >= 0 && gx < GN && gz >= 0 && gz < GN) k = 1 - ao * smooth((top[gz * GN + gx] - py[i] - 0.25) / 2.6) * smooth(since / 0.7) * (1 - smooth((sp[i] - 4) / 10)); }      /* 还在半空飞的不压暗，落定的才按埋多深压 */
      const f = fac ? 1 - smooth(since / 0.3) : 0, c = i * 3;
      C[c] = (fac ? lerp(tint[c], fac[c], f) : tint[c]) * k; C[c + 1] = (fac ? lerp(tint[c + 1], fac[c + 1], f) : tint[c + 1]) * k; C[c + 2] = (fac ? lerp(tint[c + 2], fac[c + 2], f) : tint[c + 2]) * k;
    }
    mesh.instanceMatrix.needsUpdate = true; mesh.instanceColor.needsUpdate = true;
    if (coreMesh) { const h = coreTop(t); coreMesh.visible = h > 0.05; coreMesh.scale.y = Math.max(0.05, h); }
  }
  update(0);
  return { group, mesh, core: coreMesh, count: N, duration: bake.duration, t0: bake.t0, update, restOf };
}

// ---------------------------------------------------------------- 一张密密的回形针贴图（给堆体的底面用：远看也是一枚枚回形针，不是一块平色）。一格贴图 = TILE 个曲线单位见方
const TILE = 26; export const CLIP_TILE = TILE;
export function clipTileTexture({ seed = 21, size = 1024, n = 520 } = {}) {
  const cv = document.createElement('canvas'); cv.width = cv.height = size; const g = cv.getContext('2d'), rnd = mulberry32(seed), k = size / TILE;
  g.fillStyle = '#0b0c12'; g.fillRect(0, 0, size, size); g.lineCap = 'round'; g.lineJoin = 'round';
  const path = () => { g.beginPath(); g.moveTo(0.22, 0.75); g.lineTo(0.22, -0.85); g.arc(0, -0.85, 0.22, 0, Math.PI, true); g.lineTo(-0.22, 1.05); g.arc(0.14, 1.05, 0.36, Math.PI, 0, false); g.lineTo(0.5, -1.15); g.arc(0, -1.15, 0.5, 0, Math.PI, true); g.lineTo(-0.5, 0.55); };
  const TC = ['#ff2e88', '#5fe3c0', '#f4e04d'];
  for (let i = 0; i < n; i++) { const x = rnd() * size, y = rnd() * size, a = rnd() * 6.2832, depth = i / n, h = rnd(), v = Math.round(lerp(34, 150, depth * depth * depth) * (0.75 + 0.25 * rnd()));
    for (const [ox, oy] of [[0, 0], [size, 0], [-size, 0], [0, size], [0, -size]]) { if (Math.abs(x + ox - size / 2) > size / 2 + 2 * k || Math.abs(y + oy - size / 2) > size / 2 + 2 * k) continue;      // 跨边的再画一遍，贴图才能无缝平铺
      g.save(); g.translate(x + ox, y + oy); g.rotate(a); g.scale(k * (0.95 + 0.3 * h), k * (0.95 + 0.3 * h) * (0.45 + 0.55 * rnd()));      /* 竖向压扁一点：斜躺着的 */
      path(); g.lineWidth = 0.34; g.strokeStyle = 'rgba(0,0,0,0.55)'; g.stroke();                                                                 // 底下一圈暗：压在别的上面的影子
      path(); g.lineWidth = 0.16; g.strokeStyle = h > 0.975 && depth > 0.6 ? TC[Math.floor((h - 0.975) * 119)] : `rgb(${v},${v},${Math.min(255, v + 12)})`; g.stroke(); g.restore(); } }
  const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

// ---------------------------------------------------------------- 远处：起伏的回形针堆体（沙丘一样有高有低；静态）
const hash2 = (x, y, s) => { const h = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453; return h - Math.floor(h); };
function vnoise(x, y, s) { const xi = Math.floor(x), yi = Math.floor(y), u = x - xi, v = y - yi, a = u * u * (3 - 2 * u), b = v * v * (3 - 2 * v);
  return lerp(lerp(hash2(xi, yi, s), hash2(xi + 1, yi, s), a), lerp(hash2(xi, yi + 1, s), hash2(xi + 1, yi + 1, s), a), b); }
/** 堆体高度（世界单位）。几层噪声 + 一层「山脊」，值域约 0…amp */
export function duneHeight(x, z, { amp = 9, wavelength = 70, seed = 5, flat = null } = {}) {
  const u = x / wavelength, v = z / wavelength;
  let h = 0.55 * vnoise(u, v, seed) + 0.28 * (1 - Math.abs(2 * vnoise(u * 2.1 + 3.7, v * 2.1 - 1.3, seed + 1) - 1)) + 0.17 * vnoise(u * 4.7, v * 4.7, seed + 2);
  h = amp * h * h * 1.5;
  if (flat) h *= smooth((Math.hypot(x - flat.x, z - flat.z) - flat.r) / flat.r);
  return h;
}
export function createClipDunes({ size = 600, count = 60000, unit = 0.13, amp = 9, wavelength = 70, seed = 5, flat = null, sun = [-0.5, 0.6, 0.4], envMap = null, material = null, shadows = false, seg = 160, geometry = null, base: withBase = true } = {}) {
  amp = Math.max(amp, 1e-3);
  const hp = { amp, wavelength, seed, flat }, H = (x, z) => duneHeight(x, z, hp), S = new THREE.Vector3(...sun).normalize(), group = new THREE.Group();
  // 明暗：坡面朝不朝光 + 沿光的方向往上走，被前面的丘挡住就是山影 + 洼地压暗
  const shade = (x, z) => { const e = wavelength * 0.02, hx = (H(x + e, z) - H(x - e, z)) / (2 * e), hz = (H(x, z + e) - H(x, z - e)) / (2 * e), il = 1 / Math.hypot(hx, 1, hz), nl = clamp((-hx * S.x + S.y - hz * S.z) * il), h0 = H(x, z);
    let lit = 1; for (let k = 1; k <= 10; k++) { const d = k * wavelength * 0.06, over = H(x + S.x * d, z + S.z * d) - (h0 + S.y * d); if (over > 0) lit = Math.min(lit, 1 - clamp(over / (amp * 0.12))); }
    const hollow = clamp(1 - (H(x + 6 * e, z) + H(x - 6 * e, z) + H(x, z + 6 * e) + H(x, z - 6 * e) - 4 * h0) / (amp * 0.5), 0.45, 1);
    return (0.3 + 0.9 * nl * (0.2 + 0.8 * lit)) * hollow; };
  // 底：同一个高度场的暗色面（回形针是铁丝圈，下面要有东西垫着才不透）
  const pg = new THREE.PlaneGeometry(size, size, seg, seg).rotateX(-Math.PI / 2), pp = pg.attributes.position, pc = new Float32Array(pp.count * 3);
  for (let i = 0; i < pp.count; i++) { const x = pp.getX(i), z = pp.getZ(i), s = shade(x, z); pp.setY(i, H(x, z) - 0.25 * unit); pc.set([s, s, s * 1.06], i * 3); }
  { const uv = pg.attributes.uv, rep = size / (TILE * unit); for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * rep, uv.getY(i) * rep); }
  pg.setAttribute('color', new THREE.BufferAttribute(pc, 3)); pg.computeVertexNormals();
  const base = new THREE.Mesh(pg, new THREE.MeshBasicMaterial({ vertexColors: true, map: clipTileTexture({ seed: seed + 16 }) })); base.visible = withBase; group.add(base);
  // 回形针：贴着坡面躺，带一点翘，三层厚
  const mesh = new THREE.InstancedMesh(geometry ?? clipGeometry({ radial: 4, tubular: 30 }), material ?? clipMaterial({ envMap }), count); mesh.frustumCulled = false; mesh.castShadow = mesh.receiveShadow = shadows; group.add(mesh);
  const rnd = mulberry32(seed * 131 + 7), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), q2 = new THREE.Quaternion(), p = new THREE.Vector3(), n = new THREE.Vector3(), s3 = new THREE.Vector3(), e = new THREE.Euler(), c = new THREE.Color(), Z = new THREE.Vector3(0, 0, 1),
    TINT = [new THREE.Color(1, 1, 1), new THREE.Color(PAL.pink), new THREE.Color(PAL.mint), new THREE.Color(PAL.lemon)];
  for (let i = 0; i < count; i++) { const x = (rnd() - 0.5) * size, z = (rnd() - 0.5) * size, eps = wavelength * 0.02, layer = rnd();
    n.set(-(H(x + eps, z) - H(x - eps, z)) / (2 * eps), 1, -(H(x, z + eps) - H(x, z - eps)) / (2 * eps)).normalize();
    q.setFromUnitVectors(Z, n).multiply(q2.setFromEuler(e.set((rnd() - 0.5) * 0.9, (rnd() - 0.5) * 0.9, rnd() * 6.2832)));
    const sc = unit * lerp(0.9, 1.25, rnd()); mesh.setMatrixAt(i, m4.compose(p.set(x, H(x, z) + unit * (0.1 + 1.1 * layer), z), q, s3.setScalar(sc)));
    const h = rnd(); mesh.setColorAt(i, c.copy(TINT[h < 0.9 ? 0 : 1 + Math.min(2, Math.floor((h - 0.9) / 0.034))]).multiplyScalar(shade(x, z) * (0.55 + 0.45 * layer))); }
  mesh.instanceMatrix.needsUpdate = true; mesh.instanceColor.needsUpdate = true;
  return { group, mesh, base, heightAt: H };
}

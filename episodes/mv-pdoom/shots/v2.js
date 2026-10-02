// shots/v2.js — 主歌 2 + 预副歌 2（歌曲时间 38.4–58.4 s），分镜照 TREATMENT.md §4「主歌 2」「预副歌 2」。
//
//   import { makeV2 } from './shots/v2.js';
//   const { shots, cuts, girlAt } = makeV2(mv, { girl, holo });   // girl = await createGirl(mv)，holo = await createHolo(mv)
//   mv.mount(shots, { offset: 38.4, duration: 20.0 });
//
// 切点（不手写秒数，由歌词 + 拍点算，见 cuts()）：
//   这段是连唱——句与句之间没有换气缝（lyrics.json 每句 end = 下句 start，人声能量也连着），做不到「唱完 + 0.3 s 再切」。
//   规则改成：切点 = 这句最后一个词唱完之后的第一个小节头（或拍 / 半拍），宁可让下一句的头一两个词在旧镜头里唱，
//   也不在一个词中间切走；新镜头里已经唱过的词直接以「已亮」状态出现（绝不在 word.start 前出现）。
//   隧道段按分镜「1 小节 → 半小节 → 1 拍 → 半拍」加速切，最后一刀落在「I feel」起音前的半拍格上。
//
// 镜头：
//   01 stable     平整体素地面，她和一颗匀速弹跳的球同步往前走（一拍一步 / 一拍一弹），字躺在平稳心电线上（type3d.curve）
//   02 well       地面塌成引力井，球被卷进去，她在井沿顶住吸力；字被拉长卷进奇点（type3d.singularity，井心和奇点对齐）
//   03a–f tunnel  同心环隧道越来越快，她冲刺；词做成车厢从隧道壁呼啸而过（ACCELERATING 这个长音在每一刀都再冲过一次）
//   04 atoms      toon → 粒子 → 散开 → 体素 → 线框 → 铬（girl.morph），字由粒子汇聚成形（type3d.reform）
//   05a–c cage    光柱笼子：全息屏在笼里唱 Sydney please let me free，一根栏杆一个词；她推，栏杆弯；58 s 起笼子炸开
// 字一律在「屏幕层」（挂在相机上的 overlay，按 type3d 的 fov30 / z=40 取景），笼子段的字在栏杆上（3D）。先给人留位再摆字。

import * as THREE from 'three';
import { FX, PAL, textGeo } from '../kits/type3d.js';
import { createGirlLights } from '../kits/girl.js';
import { createVoxelGround, createRingTunnel } from '../kits/world.js';
import { createShockwave, createParticles, sampleShape } from '../kits/vfx.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut = p => 1 - (1 - clamp(p)) ** 3;
const eIn = p => clamp(p) ** 3;
const col = c => new THREE.Color(c);

// ---------------------------------------------------------------- 时间
function lineOf(mv, prefix) {
  const l = mv.lyrics.lines.find(x => x.text.toLowerCase().startsWith(prefix.toLowerCase()));
  if (!l) throw new Error(`v2：找不到歌词「${prefix}」`);
  return l;
}
export function cuts(mv) {
  const M = mv.music;
  const L = {
    stable: lineOf(mv, 'We had a stable'), sing: lineOf(mv, 'But now the singularity'), opt: lineOf(mv, "And you're optimizing"),
    atoms: lineOf(mv, 'I feel my atoms'), sydney: lineOf(mv, 'Sydney, please'),
  };
  const downAfter = t => M.downbeats.find(d => d >= t - 1e-3);
  const lastEnd = l => l.words.at(-1).end;
  const c = { start: 38.4, end: 58.4 };
  c.well = downAfter(lastEnd(L.stable));                  // 「run,」唱完后的小节头
  c.tunnel = downAfter(lastEnd(L.sing));                  // 「begun」唱完后的小节头
  // 隧道加速切：1 小节 → 半小节 → 1 拍 → 半拍 × 3，最后一刀 = 「I」起音前最近的半拍格
  const P = M.period, bar = 4 * P;
  c.tun = [c.tunnel, c.tunnel + bar, c.tunnel + 1.5 * bar, c.tunnel + 1.5 * bar + P, c.tunnel + 1.5 * bar + 1.5 * P, c.tunnel + 1.5 * bar + 2 * P];
  c.atoms = c.tun[5] + P / 2;
  if (c.atoms > L.atoms.start + 0.05) throw new Error(`v2：隧道切点排过头了（${c.atoms} > ${L.atoms.start}）`);
  c.cage = downAfter(lastEnd(L.atoms));                   // 「rearranging」唱完后的小节头 = 预副歌 2 起点
  c.cageB = c.cage + bar; c.cageC = c.cage + 2 * bar;
  c.boom = M.beats.find(b => b >= c.end - P * 1.05);      // 58.4 前一拍：笼子炸开
  return { c, L };
}

// ---------------------------------------------------------------- 小工具
function persp(fov = 30) { return new THREE.PerspectiveCamera(fov, 16 / 9, 0.05, 500); }
function scn(bg = PAL.ink) { const s = new THREE.Scene(); s.background = col(bg); return s; }
// 屏幕层：挂在相机前 d 处，内部坐标 = type3d 取景（fov30、z=40 → 可视 38.1 × 21.44）
function overlay(scene, camera, d = 0.5) {
  const g = new THREE.Group();
  g.position.z = -d;
  g.scale.setScalar((2 * d * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / 21.44);
  camera.add(g);
  scene.add(camera);
  return g;
}
// 屏幕层里的 PointsMaterial：点径按真实距离衰减，挂到相机前 d 处会被放大约 40/d 倍 → 着色器里乘回 overlay 的缩放
// （同 c1.js 的做法；type3d 每帧改 size，所以不能改 size 本身）。保留材质原有的 onBeforeCompile（applyGlow）。
function fixPoints(ov) {
  const kk = ov.scale.x / (2 * Math.tan(THREE.MathUtils.degToRad(15)) / 21.44 * 40);
  ov.traverse(o => {
    const m = o.isPoints && o.material;
    if (!m || !m.isPointsMaterial || m.userData.pointK) return;
    m.userData.pointK = kk;
    const prev = m.onBeforeCompile;
    m.onBeforeCompile = (sh, r) => { if (prev) prev.call(m, sh, r); sh.vertexShader = sh.vertexShader.replace('gl_PointSize = size;', `gl_PointSize = size * ${kk.toFixed(6)};`); };
    const pk = m.customProgramCacheKey?.bind(m);
    m.customProgramCacheKey = () => `pk${kk}|${pk ? pk() : ''}`;
    m.needsUpdate = true;
  });
}
function shake(mv, t, amt = 0.02) {
  const k = mv.music.pulse('kick', t, { decay: 0.1 });
  return [Math.sin(t * 91.7) * k * amt, Math.cos(t * 77.3) * k * amt];
}
// 居中的平面字（缓存的几何不能改，先 clone）
function flatWord(text, size, color) {
  const g = textGeo('anton', text, { size }).clone();
  g.computeBoundingBox();
  const b = g.boundingBox;
  g.translate(-(b.max.x + b.min.x) / 2, -(b.max.y + b.min.y) / 2, 0);
  return new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true }));
}
const clean = w => w.replace(/[,.!?“”"]/g, '').toUpperCase();
function glowDisc(color, r = 0.6, k = 0.3) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(r, 64), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { c: { value: col(color) }, k: { value: k } },
    vertexShader: 'varying vec2 v; void main(){ v = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 c; uniform float k; varying vec2 v; void main(){ float d = length(v - 0.5) * 2.0; gl_FragColor = vec4(c * k * pow(1.0 - clamp(d,0.0,1.0), 2.0), 1.0); }',
  }));
  m.rotation.x = -Math.PI / 2;
  return m;
}

// ================================================================ 镜头
export function makeV2(mv, { girl, holo }) {
  if (!girl || !holo) throw new Error('v2：需要 girl 和 holo');
  const { c, L } = cuts(mv);
  const M = mv.music;
  const beat = t => Math.round(girl.beatOf(t));

  // ---- 她的整段编舞（按拍）：走 → 顶住吸力 → 跑 → 冲刺 → 跳 → 推栏杆 → 下蹲起跳 ----
  const choreo = [
    { beat: beat(c.start) - 2, move: 'walk' },
    { beat: beat(c.well), move: 'brace', pull: 0.6 },
    { beat: beat(c.well) + 8, move: 'brace', pull: 1 },
    { beat: beat(c.tunnel), move: 'run' },
    { beat: beat(c.tun[2]), move: 'run', rate: 2 },
    { beat: beat(c.atoms + M.period / 2), move: 'sideClap' },
    { beat: beat(M.barTime(M.barAt(c.atoms).i + 1)), move: 'discoPoint' },
    { beat: beat(c.cage), move: 'push', force: 1 },
    { beat: beat(c.cageB), move: 'push', force: 1 },
    { beat: beat(c.boom), move: 'squatJump' },
  ];
  // 每个时刻她在哪个场景里、穿什么皮肤，由各镜头决定；舞步只看 T —— girlAt(T) 给定格自检用
  const girlAt = T => girl.dance(choreo, T);
  const putGirl = (scene, T, { x = 0, y = 0, z = 0, yaw = 0, scale = 1, skin = 'toon' } = {}) => {
    scene.add(girl.root);
    girl.root.visible = true;
    girl.root.position.set(x, y, z); girl.root.rotation.set(0, yaw, 0); girl.root.scale.setScalar(scale);
    girl.dance(choreo, T);
    if (typeof skin === 'function') skin(T); else girl.setSkin(skin, T);
  };

  const shots = [];

  // ================================================================ 01 stable：体素地面 + 弹跳球 + 心电线
  // 她朝 +x 走，一拍一步；球在她前方外侧（远离相机那侧，不挡人），一拍落地一次；两者同速。
  const WALK_V = 0.42;                                     // 走速（世界单位 / 秒），和 walk 步幅匹配，脚不打滑
  const WELL = { x: 5.2, z: -0.6 };                        // 引力井中心（她走向它，01 里还在画外）
  const walkX = T => -1.7 + WALK_V * (Math.min(T, c.well) - c.start);
  const wellAmt = T => 0.5 * smooth((T - L.sing.start) / (L.sing.words.at(-1).end - L.sing.start - 0.3));
  const ball = () => new THREE.Mesh(new THREE.SphereGeometry(0.11, 32, 20), new THREE.MeshStandardMaterial({ color: PAL.pink, emissive: PAL.pink, emissiveIntensity: 0.35, roughness: 0.25, metalness: 0.1 }));
  const bounce = T => { const u = girl.beatOf(T), f = u - Math.floor(u); return 4 * f * (1 - f); };   // 拍点落地
  const groundOf = () => {
    const g = createVoxelGround({ n: 64 });
    const holder = new THREE.Group();
    holder.add(g.mesh); holder.scale.setScalar(0.28); holder.position.set(WELL.x, 0, WELL.z);
    return { g, holder };
  };
  shots.push({
    id: 'v2-01-stable', t0: c.start, t1: c.well, transitionIn: { kind: 'cut' },
    build() {
      const scene = scn(PAL.ink), camera = persp(30);
      scene.fog = new THREE.Fog(PAL.ink, 5, 12);
      scene.add(createGirlLights());
      const G = groundOf(); scene.add(G.holder);
      const b = ball(); scene.add(b);
      const shadow = glowDisc('#000000', 0.16, 0); scene.add(shadow);
      const ov = overlay(scene, camera);
      // 心电线：平稳基线，隔一段一个小心跳；字躺在线上
      const pts = [];
      // 平稳的心电线 = 一条几乎平的基线（stable training run）；字沿线排，线随唱随画
      for (let x = -16; x <= 16; x += 2) pts.push([x, 6.0 + 0.06 * Math.sin(x * 0.9), 0]);
      const ecg = FX.curve({ line: L.stable, points: pts, color: PAL.paper, accent: PAL.lemon, lineColor: PAL.mint });
      ecg.group.scale.setScalar(0.86);
      ov.add(ecg.group);
      return { scene, camera, G, b, shadow, ecg };
    },
    update(S, T) {
      const x = walkX(T);
      // 「But now」起地面开始躁动（井在画外开始塌）
      const unrest = smooth((T - L.sing.start) / 0.6);
      S.G.g.update(T, { amp: 0.06 + 0.12 * M.energy('bass', T) + unrest * 0.5, speed: 1.4 + unrest * 3, well: wellAmt(T) });
      putGirl(S.scene, T, { x, yaw: Math.PI / 2 });
      const bx = x + 0.55, bz = -0.32, h = bounce(T);
      const squash = 1 - 0.25 * Math.exp(-h / 0.04);
      S.b.position.set(bx, 0.11 * squash + 0.42 * h, bz);
      S.b.scale.set(1 / Math.sqrt(squash), squash, 1 / Math.sqrt(squash));
      S.shadow.position.set(bx, 0.003, bz);
      S.ecg.update(T);
      const k = T - c.start;
      const [sx, sy] = shake(mv, T, 0.01 * unrest);
      S.camera.position.set(x + 0.35 + sx, 0.78 + sy, 3.3 - 0.1 * k);
      S.camera.lookAt(x + 0.35, 0.72, 0);
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.6, threshold: 1.2 }, grade: { vignette: 0.35 } } };
    },
  });

  // ================================================================ 02 well：地面塌成引力井，字卷进奇点
  shots.push({
    id: 'v2-02-well', t0: c.well, t1: c.tunnel, transitionIn: { kind: 'cut' },
    build() {
      const scene = scn(PAL.ink), camera = persp(38);
      scene.add(createGirlLights({ key: 2.2, rim: 2.6 }));
      const G = groundOf(); scene.add(G.holder);
      const b = ball(); scene.add(b);
      const ov = overlay(scene, camera);
      const fx = FX.singularity({ line: L.sing, pull: 'each', center: [0, -3.6, 0], maxH: 5.0, maxSize: 3.6 });
      fx.group.position.y = 0.6;   // 字排在上方，奇点落在画面中下 = 井心
      ov.add(fx.group); fixPoints(ov);
      return { scene, camera, G, b, fx };
    },
    update(S, T) {
      const k = T - c.well, u = k / (c.tunnel - c.well);
      const w = wellAmt(T);
      S.G.g.update(T, { amp: 0.35 + 0.3 * M.energy('bass', T), speed: 4.2, well: w, glow: 1.8 });
      // 她停在井沿（离井心 5 单位，井只吸 4.4 以内），顶住吸力
      const gx = walkX(c.well);
      putGirl(S.scene, T, { x: gx, yaw: Math.PI / 2 + 0.25 });
      // 球：从她脚边螺旋卷进井里、下坠、缩小
      const q = smooth((T - c.well) / 1.9);
      const r0 = Math.hypot(gx + 0.55 - WELL.x, -0.32 - WELL.z), a0 = Math.atan2(-0.32 - WELL.z, gx + 0.55 - WELL.x);
      const a = a0 + q * q * 7, rr = r0 * (1 - q) ** 1.2;
      S.b.position.set(WELL.x + Math.cos(a) * rr, 0.11 + 0.3 * bounce(T) * (1 - q) - 3.5 * q ** 2.5, WELL.z + Math.sin(a) * rr);
      S.b.scale.setScalar(Math.max(0.001, 1 - q ** 3));
      S.fx.update(T);
      // 相机：她身后高处俯看井心，慢慢压低推进；井心落在画面中下（和奇点对齐）
      const [sx, sy] = shake(mv, T, 0.03);
      // 过肩：她在画面左下角的井沿，井心在画面中下
      const cx = lerp(gx - 1.5, gx - 1.1, u), cy = lerp(1.9, 1.6, u), cz = lerp(1.25, 1.0, u);
      S.camera.position.set(cx + sx, cy + sy, cz);
      S.camera.lookAt(lerp(WELL.x - 1.2, WELL.x - 0.8, u), lerp(-0.2, 0.1, u), WELL.z - 0.2);
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: 0.8, threshold: 1.1 }, chroma: 0.2 + 0.3 * w, grade: { vignette: 0.45 } } };
    },
  });

  // ================================================================ 03 tunnel：同心环隧道 + 车厢字，越切越快
  // 一个隧道场景 + 一条跑道，6 个镜头各自摆相机；隧道速度随时间加快（位移 = ∫v）。她在 z = −4 朝 −z 跑。
  const T3 = c.tunnel;
  // 速度 v = 6 + 5·s（s = 进隧道后秒数），最快约 31 u/s = 每帧 1.03，环间距 3.4 → 每帧不到 1/3 个间距，不会像车轮倒转那样频闪
  const RING_GAP = 3.4;
  const travel = T => { const s = Math.max(0, T - T3 + 1.2); return 6 * s + 2.5 * s * s; };
  const tunnel = (() => {
    let S = null;
    return () => {
      if (S) return S;
      const scene = scn(PAL.ink);
      scene.add(createGirlLights({ key: 2.2, rim: 2.8 }));
      const tun = createRingTunnel({ count: 30, spacing: RING_GAP, radius: 2.3, sides: 64 });
      scene.add(tun.mesh);
      // 跑道：墨色长条 + 往身后流的薄荷横纹
      const lane = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 80), new THREE.ShaderMaterial({
        uniforms: { uTr: { value: 0 }, uC: { value: col(PAL.mint) } },
        vertexShader: 'varying vec3 p; void main(){ p = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `uniform float uTr; uniform vec3 uC; varying vec3 p;
          void main(){ float s = fract((p.y - uTr) / 3.4); float line = smoothstep(0.0, 0.02, s) * (1.0 - smoothstep(0.05, 0.08, s));
            float edge = 1.0 - smoothstep(0.0, 0.03, 0.8 - abs(p.x));
            float fade = exp(-max(0.0, p.y) * 0.05);
            gl_FragColor = vec4((vec3(0.03, 0.03, 0.05) + uC * (line * 1.4 + edge * 1.8)) * fade, 1.0); }`,
      }));
      lane.rotation.x = -Math.PI / 2; lane.position.set(0, -1.9, -40);
      scene.add(lane);
      // 车厢：一词一节。车身纯色 + 黑字 + 车窗条；沿隧道壁冲
      const carOf = (text, body) => {
        const g = new THREE.Group();
        const w = Math.max(1.4, text.length * 0.26 + 0.5);
        const box = new THREE.Mesh(new THREE.BoxGeometry(w, 0.62, 0.3), new THREE.MeshBasicMaterial({ color: col(body).multiplyScalar(1.6) }));
        const strip = new THREE.Mesh(new THREE.BoxGeometry(w * 1.001, 0.07, 0.31), new THREE.MeshBasicMaterial({ color: PAL.ink }));
        strip.position.y = -0.22;
        const t1 = flatWord(text, 0.34, PAL.ink); t1.position.z = 0.16;
        const t2 = flatWord(text, 0.34, PAL.ink); t2.position.z = -0.16; t2.rotation.y = Math.PI;
        g.add(box, strip, t1, t2);
        g.userData.w = w;
        scene.add(g);
        return g;
      };
      const words = L.opt.words.map((w, i) => ({ ...w, text: clean(w.w), car: carOf(clean(w.w), [PAL.lemon, PAL.pink, PAL.mint, PAL.paper][i % 4]) }));
      const extra = [0, 1, 2, 3, 4].map(i => carOf('ACCELERATING', [PAL.pink, PAL.lemon, PAL.mint, PAL.paper, PAL.pink][i]));
      S = { scene, tun, lane, words, extra, cams: {} };
      return S;
    };
  })();
  // 车厢在 [launch, launch + dur] 里从 z0 冲到 z1（沿隧道壁，lane = 角度），之外隐藏
  // face：'cam' 字面朝 ±z（主观 / 正面镜头看得见字）；'side' 车身顺着隧道、字面朝 ±x（侧面镜头）
  function placeCar(car, T, launch, { dur = 0.8, z0 = -30, z1 = 6, ang = 0.8, r = 1.45, face = 'cam' } = {}) {
    const k = (T - launch) / dur;
    car.visible = k >= 0 && k <= 1;
    if (!car.visible) return;
    const z = lerp(z0, z1, eIn(k) * 0.55 + k * 0.45);
    car.position.set(Math.cos(ang) * r, Math.sin(ang) * r, z);
    car.rotation.set(0, face === 'side' ? Math.PI / 2 : 0, 0.18 * Math.cos(ang));
  }
  const tunnelUpdate = (T, S) => {
    const v = 6 + 5 * Math.max(0, T - T3 + 1.2);
    S.tun.update(T, { travel: travel(T), bend: 0.5, spin: 0.3, pulse: M.pulse('kick', T, { decay: 0.1 }) });
    S.lane.material.uniforms.uTr.value = -travel(T);
    for (const car of [...S.words.map(w => w.car), ...S.extra]) car.visible = false;
    return v;
  };
  const tunnelPost = (T, speed = 0) => ({ bloom: { strength: 0.9, threshold: 1.0 }, chroma: 0.3 + speed * 0.9 + 0.4 * M.pulse('kick', T), grade: { vignette: 0.45, contrast: 1.05 } });
  const GZ = -4;   // 她在隧道里的位置
  const sub = [
    // a. 正面：她朝镜头冲来，环从身后涌向她；前几个词的车厢沿上方隧道壁呼啸离去（1 小节）
    { id: 'a-front', tr: { kind: 'flash', dur: 0.3, color: PAL.lemon, peak: 0.85 }, cam(S, T, k) {
      S.camera.position.set(0.1 * Math.sin(T * 3), -0.95, GZ - 3.1 + 0.25 * k); S.camera.lookAt(0, -1.25, GZ + 2);
      const launches = [T3, T3 + 0.14, Math.max(T3, S.words[2].start), Math.max(T3, S.words[3].start)];
      S.words.forEach((w, i) => placeCar(w.car, T, launches[i], { dur: 1.1, z0: GZ - 3.4, z1: GZ + 30, ang: [2.2, 0.95, 2.05, 1.1][i], r: 1.55 }));
    } },
    // b. 主观镜头：环迎面冲来，ACCELERATING 车厢从远处冲到脸前擦过（半小节）
    { id: 'b-pov', tr: { kind: 'cut' }, cam(S, T) {
      S.camera.position.set(0, -0.9, GZ - 0.2); S.camera.lookAt(0, -0.7, GZ - 20);
      placeCar(S.extra[0], T, c.tun[1] + 0.05, { dur: 0.75, z0: GZ - 34, z1: GZ + 4, ang: 0.7, r: 1.35 });
    }, pov: true },
    // c. 侧面跟拍：她在跑道上冲刺，车厢从背后超过去（1 拍）
    { id: 'c-side', tr: { kind: 'cut' }, cam(S, T) {
      S.camera.position.set(1.75, -1.2, GZ + 0.2); S.camera.lookAt(0, -1.35, GZ - 0.4);
      placeCar(S.extra[1], T, c.tun[2] - 0.05, { dur: 0.5, z0: GZ + 8, z1: GZ - 14, ang: 2.3, r: 1.5, face: 'side' });
    } },
    // d. 主观镜头倾斜（半拍）
    { id: 'd-pov2', tr: { kind: 'cut' }, cam(S, T) {
      S.camera.position.set(0, -0.8, GZ - 0.2); S.camera.up.set(Math.sin(0.35), Math.cos(0.35), 0); S.camera.lookAt(0.3, -0.6, GZ - 20);
      placeCar(S.extra[2], T, c.tun[3] - 0.08, { dur: 0.36, z0: GZ - 26, z1: GZ + 3, ang: 2.4, r: 1.3 });
    }, pov: true },
    // e. 低机位脚下（半拍）
    { id: 'e-feet', tr: { kind: 'cut' }, cam(S, T) {
      S.camera.position.set(-0.7, -1.72, GZ - 1.1); S.camera.lookAt(0, -1.6, GZ);
      placeCar(S.extra[3], T, c.tun[4] - 0.1, { dur: 0.34, z0: GZ - 10, z1: GZ + 10, ang: 2.5, r: 1.6, face: 'side' });
    } },
    // f. 主观镜头极速（半拍）：环拉成光条，冲进下一镜
    { id: 'f-pov3', tr: { kind: 'cut' }, cam(S, T) {
      S.camera.position.set(0, -0.8, GZ - 0.2); S.camera.up.set(Math.sin(-0.3), Math.cos(-0.3), 0); S.camera.lookAt(-0.2, -0.7, GZ - 20);
      placeCar(S.extra[4], T, c.tun[5] - 0.1, { dur: 0.32, z0: GZ - 24, z1: GZ + 3, ang: 0.9, r: 1.3 });
    }, pov: true },
  ];
  sub.forEach((s, i) => {
    const t0 = c.tun[i], t1 = i < 5 ? c.tun[i + 1] : c.atoms;
    shots.push({
      id: `v2-03${s.id}`, t0, t1, transitionIn: s.tr,
      build() {
        const S = tunnel();
        const camera = persp(i === 0 ? 34 : s.pov ? 62 : 42);
        return { S, camera };
      },
      update({ S, camera }, T) {
        const v = tunnelUpdate(T, S);
        camera.up.set(0, 1, 0);
        const k = T - t0;
        putGirl(S.scene, T, { x: 0, y: -1.9, z: GZ, yaw: Math.PI });
        girl.root.visible = !s.pov;
        s.cam({ ...S, camera }, T, k);
        camera.updateMatrixWorld();
        const post = tunnelPost(T, clamp((v - 12) / 20));
        return { scene: S.scene, camera, post };
      },
    });
  });

  // ================================================================ 04 atoms：全片技术高光
  // toon → 粒子 → 散开 → 聚进体素格（morph toon→voxel）→ 线框 → 铬；每一步落在拍上。
  // 7.5 拍：toon→体素 2.5 拍 · 体素 1 拍 · →线框 1 拍 · 线框 1 拍 · →铬 1 拍 · 铬 1 拍（全在拍 / 半拍格上）
  const A0 = c.atoms, P = M.period;
  const SK = { vox: A0 + 2.5 * P, bp0: A0 + 3.5 * P, bp1: A0 + 4.5 * P, ch0: A0 + 5.5 * P, ch1: A0 + 6.5 * P };
  // 1 拍的快过渡：把 morph 里「纯粒子散开」那段压短（时间 0–25% → p 0–0.3，25–45% → 0.3–0.75，45–100% → 0.75–1），新皮肤早点长出来
  const quick = q => (q < 0.25 ? 0.3 * q / 0.25 : q < 0.45 ? 0.3 + 0.45 * (q - 0.25) / 0.2 : 0.75 + 0.25 * (q - 0.45) / 0.55);
  const atomsSkin = T => {
    if (T < SK.vox) girl.morph('toon', 'voxel', (T - A0) / (SK.vox - A0), T);
    else if (T < SK.bp0) girl.setSkin('voxel', T);
    else if (T < SK.bp1) girl.morph('voxel', 'blueprint', quick((T - SK.bp0) / (SK.bp1 - SK.bp0)), T);
    else if (T < SK.ch0) girl.setSkin('blueprint', T);
    else if (T < SK.ch1) girl.morph('blueprint', 'chrome', quick((T - SK.ch0) / (SK.ch1 - SK.ch0)), T);
    else girl.setSkin('chrome', T);
  };
  shots.push({
    id: 'v2-04-atoms', t0: c.atoms, t1: c.cage, transitionIn: { kind: 'dissolve-particles', dur: 0.3 },
    build() {
      const scene = scn(PAL.ink), camera = persp(30);
      scene.add(createGirlLights());
      const grid = new THREE.GridHelper(12, 48, col(PAL.pink).multiplyScalar(0.5), col('#22223a'));
      grid.material.transparent = true; grid.material.opacity = 0.6; scene.add(grid);
      const disc = glowDisc(PAL.mint, 0.75, 0.25); disc.position.y = 0.003; scene.add(disc);
      const ov = overlay(scene, camera);
      const fx = FX.reform({ line: L.atoms, color: PAL.mint, color2: PAL.paper, maxW: 30, maxH: 4.2, maxSize: 3.6, glow: 1.4 });
      fx.group.position.y = 7.1;
      ov.add(fx.group); fixPoints(ov);
      return { scene, camera, disc, fx };
    },
    update(S, T) {
      const k = T - c.atoms, u = k / (c.cage - c.atoms);
      putGirl(S.scene, T, { skin: atomsSkin });
      S.fx.update(T);
      S.disc.material.uniforms.k.value = 0.18 + 0.4 * M.pulse('kick', T, { decay: 0.12 });
      // 相机：从低位正面慢慢绕到 3/4 侧；她在画面中下，字在上方
      const a = lerp(-0.35, 0.5, smooth(u)), R = lerp(3.0, 2.7, u);
      S.camera.position.set(Math.sin(a) * R, 0.5 + 0.1 * u, Math.cos(a) * R);
      S.camera.lookAt(0, 0.78, 0);
      const pts = girl.skin === 'points' || girl.points.visible;
      return { scene: S.scene, camera: S.camera, post: { bloom: { strength: pts ? 1.0 : 0.8, threshold: 1.4 }, chroma: 0.25, grade: { vignette: 0.4, saturation: 1.08 } } };
    },
  });

  // ================================================================ 05 cage：光柱笼子 + 全息屏唱 + 一根栏杆一个词
  const CAGE = { r: 1.35, h: 2.7, n: 24 };   // 栏杆间距 ≈ 0.35 = 她双手的宽度
  // 栏杆 i 在角度 i/24·2π（x = cos, z = sin；相机在 +z 一侧）
  const WORD_BARS = [10, 9, 8, 7, 6];         // 左前方一弧（从左到右），依次挂 SYDNEY / PLEASE / LET / ME / FREE
  const PUSH_BARS = [2, 3];                   // 她推的两根（右前方，她正对两根之间的缝）
  const HOLO_POS = new THREE.Vector3(-0.45, 0, -0.5);
  const GIRL_ANG = Math.PI * 2 * 2.5 / 24, GIRL_POS = new THREE.Vector3(Math.cos(GIRL_ANG) * 1.17, 0, Math.sin(GIRL_ANG) * 1.17);
  const cage = (() => {
    let S = null;
    return () => {
      if (S) return S;
      const scene = scn(PAL.ink);
      scene.fog = new THREE.Fog(PAL.ink, 4, 11);
      scene.add(createGirlLights({ key: 1.8, rim: 2.4 }));
      const floor = new THREE.Mesh(new THREE.CircleGeometry(4, 64), new THREE.MeshBasicMaterial({ color: '#0b0b12' }));
      floor.rotation.x = -Math.PI / 2; scene.add(floor);
      const disc = glowDisc(PAL.mint, CAGE.r * 1.25, 0.18); disc.position.y = 0.002; scene.add(disc);
      holo.mesh.scale.setScalar(1.25 / holo.height);
      // 栏杆：细圆柱，CPU 按「弯曲量」把中段往外推（两端钉在上下环上）
      const bars = [];
      for (let i = 0; i < CAGE.n; i++) {
        const ang = (i / CAGE.n) * Math.PI * 2;
        const geo = new THREE.CylinderGeometry(0.022, 0.022, CAGE.h, 8, 24, true);
        geo.translate(0, CAGE.h / 2, 0);
        const orig = geo.attributes.position.array.slice();
        const mat = new THREE.MeshBasicMaterial({ color: col(PAL.mint).multiplyScalar(1.3) });
        const m = new THREE.Mesh(geo, mat);
        const g = new THREE.Group(); g.position.set(Math.cos(ang) * CAGE.r, 0, Math.sin(ang) * CAGE.r); g.rotation.y = -ang; g.add(m);
        scene.add(g);
        bars.push({ i, ang, g, m, geo, orig, mat });
      }
      const ringOf = y => { const r = new THREE.Mesh(new THREE.TorusGeometry(CAGE.r, 0.03, 8, 96), new THREE.MeshBasicMaterial({ color: col(PAL.mint).multiplyScalar(2.2) })); r.rotation.x = Math.PI / 2; r.position.y = y; scene.add(r); return r; };
      const rings = [ringOf(0.02), ringOf(CAGE.h)];
      // 栏杆上的词：竖排（沿栏杆从下往上读），贴在栏杆外侧，唱到才亮
      const words = L.sydney.words.map((w, k) => {
        const mesh = flatWord(clean(w.w), 0.17, col(PAL.lemon).multiplyScalar(2.2));
        mesh.rotation.z = Math.PI / 2;
        const holder = new THREE.Group(); holder.add(mesh);
        const bar = bars[WORD_BARS[k]];
        holder.position.set(0.05, CAGE.h * 0.44, 0); holder.rotation.y = Math.PI / 2;   // 字面朝外（局部 +x = 径向）
        bar.g.add(holder);
        return { ...w, mesh, holder, bar };
      });
      // 炸开：冲击波 + 火花
      const ring = createShockwave({ radius: 7, accent: PAL.pink }); ring.mesh.rotation.x = -Math.PI / 2; ring.mesh.position.y = 1.2; scene.add(ring.mesh);
      const sparks = createParticles({ count: 5000, seed: 58, size: 2.6 });
      sparks.setShape('ball', sampleShape('sphere', 5000, { radius: 0.4, seed: 5 }));
      sparks.group.position.set(0, 1.3, 0); scene.add(sparks.group);
      S = { scene, bars, rings, words, ring, sparks, disc, floor };
      return S;
    };
  })();
  const bendAt = (bar, T) => {
    // 她推的栏杆：从 cageB 起每拍发力一次越推越弯；最后一小节所有栏杆都往外鼓
    let b = 0;
    if (PUSH_BARS.includes(bar.i)) {
      const k = (T - c.cageB) / (c.cageC - c.cageB);
      const f = girl.beatOf(T), ph = f - Math.floor(f);
      b = k > 0 ? 0.12 * smooth(k) + 0.04 * Math.exp(-ph / 0.15) * (k < 1.6 ? 1 : 0) : 0;
      b += 0.12 * smooth((T - c.cageC) / (c.boom - c.cageC));
    } else b = 0.07 * smooth((T - c.cageC) / (c.boom - c.cageC)) * (0.6 + 0.4 * Math.sin(bar.i * 2.3));
    return b;
  };
  function cageUpdate(S, T) {
    const boomK = T - c.boom;
    for (const bar of S.bars) {
      const b = bendAt(bar, T);
      const pos = bar.geo.attributes.position.array, o = bar.orig;
      for (let v = 0; v < o.length; v += 3) {
        const y = o[v + 1] / CAGE.h;
        pos[v] = o[v] + b * Math.sin(Math.PI * y);    // 局部 +x = 径向朝外
        pos[v + 1] = o[v + 1]; pos[v + 2] = o[v + 2];
      }
      bar.geo.attributes.position.needsUpdate = true;
      // 炸开：栏杆带着自己的词往外飞、翻滚
      const fly = boomK > 0 ? boomK : 0, h = Math.sin(bar.i * 12.9898) * 0.5 + 0.5;
      bar.g.position.set(Math.cos(bar.ang) * (CAGE.r + fly * (4 + 3 * h)), fly * (1.5 + 2 * h) - fly * fly * 2, Math.sin(bar.ang) * (CAGE.r + fly * (4 + 3 * h)));
      bar.g.rotation.set(fly * (3 + 4 * h), -bar.ang, fly * (2 - 5 * h));
      const kick = M.pulse('kick', T, { decay: 0.12 });
      bar.mat.color.set(PAL.mint).multiplyScalar(1.2 + 0.8 * kick + (PUSH_BARS.includes(bar.i) ? 12 * bendAt(bar, T) : 0));
    }
    S.rings.forEach(r => { r.visible = boomK < 0.05; });
    S.words.forEach(w => {
      const k = T - w.start;
      w.holder.visible = k >= 0;
      if (k < 0) return;
      const cur = T < w.end;
      w.mesh.scale.setScalar(Math.max(0.001, eOut(k / 0.18)) * (cur ? 1.12 : 1));
      w.mesh.material.color.set(cur ? PAL.lemon : PAL.paper).multiplyScalar(cur ? 2.6 : 1.4);
    });
    S.ring.update(T, { t0: c.boom, dur: 0.9 });
    S.ring.mesh.visible = boomK >= 0;
    S.sparks.group.visible = boomK >= 0;
    if (boomK >= 0) S.sparks.update(T, { from: 'ball', to: 'ball', p: 0, burst: 9 * eOut(boomK / 0.5), shimmer: 1 });
    S.disc.material.uniforms.k.value = 0.14 + 0.3 * M.energy('vocal', T);
  }
  const cageSubs = [
    // a. 全息屏在笼里唱（她在画外），SYDNEY 挂在栏杆上
    { id: 'a-holo', t0: c.cage, t1: c.cageB, tr: { kind: 'wipe', dur: 0.36, color: PAL.lemon }, fov: 30, cam(cam, T, u) {
      cam.position.set(lerp(-1.75, -1.5, u), 1.15, lerp(4.4, 4.0, u)); cam.lookAt(-1.0, 0.95, -0.3);   // 她在画右外
    } },
    // b. 她推栏杆（近景，从笼外看进去），栏杆一拍一弯；PLEASE 在她左手边那根上
    { id: 'b-push', t0: c.cageB, t1: c.cageC, tr: { kind: 'cut' }, fov: 34, cam(cam, T, u) {
      // 笼外正对她推的那道缝：两根栏杆夹着她的脸
      const a = GIRL_ANG + 0.12, R = lerp(2.55, 2.3, u);
      cam.position.set(Math.cos(a) * R, 0.92, Math.sin(a) * R); cam.lookAt(GIRL_POS.x, 0.74, GIRL_POS.z);
    } },
    // c. 全景：LET / ME / FREE，整圈栏杆鼓起来，最后一拍炸开
    { id: 'c-wide', t0: c.cageC, t1: c.end + 0.5, tr: { kind: 'cut' }, fov: 36, cam(cam, T, u) {
      cam.position.set(lerp(0.4, 0.1, u), lerp(1.6, 1.3, u), lerp(4.6, 3.9, u)); cam.lookAt(0, 1.1, 0);
    } },
  ];
  for (const s of cageSubs) {
    shots.push({
      id: `v2-05${s.id}`, t0: s.t0, t1: s.t1, transitionIn: s.tr,
      build() { return { S: cage(), camera: persp(s.fov) }; },
      update({ S, camera }, T) {
        cageUpdate(S, T);
        S.scene.add(holo.mesh);
        holo.mesh.position.copy(HOLO_POS); holo.mesh.rotation.set(0, 0.25, 0);
        const boomK = T - c.boom;
        const hs = holo.update(T, { line: L.sydney, expression: 'surprised', glitch: boomK > 0 ? 0.8 : T > c.cageC ? 0.15 : 0, opacity: boomK > 0 ? Math.max(0, 1 - boomK / 0.3) : 1 });
        putGirl(S.scene, T, { x: GIRL_POS.x, z: GIRL_POS.z, yaw: Math.atan2(Math.cos(GIRL_ANG), Math.sin(GIRL_ANG)) });   // 面朝外，推右前方两根
        const u = (T - s.t0) / (s.t1 - s.t0);
        const [sx, sy] = shake(mv, T, boomK > 0 ? 0.06 * Math.exp(-boomK * 5) + 0.02 : 0.012);
        s.cam(camera, T, u);
        camera.position.x += sx; camera.position.y += sy;
        const flash = boomK > 0 ? Math.max(0.85 * Math.exp(-boomK / 0.1), smooth((T - (c.end - 0.12)) / 0.12)) : 0;
        return { scene: S.scene, camera, post: { bloom: { strength: 0.8, threshold: 1.4 }, chroma: 0.2 + (boomK > 0 ? 0.8 * Math.exp(-boomK * 4) : 0), grade: { vignette: 0.4 }, flash } };
      },
    });
  }

  return { shots, cuts: c, girlAt, choreo };
}

// dance3d.js：给 Mixamo 骨架（mixamorig:* 骨骼，T 字静止姿态）用的按拍舞蹈库。全部是 t 的纯函数。
//
//   import { createDancer, createChoreo, beatClock, MOVES, loadMixamoMove, toonify } from '../../../assets/lib/dance3d.js';
//   const dancer = createDancer(gltf.scene);                 // 记下静止姿态（必须在还没摆姿势时调）
//   const clock  = beatClock(M);                             // 引擎 music.js 的 M → t ↦ 连续拍数；也可 beatClock({ bpm, t0 })
//   const choreo = createChoreo([                            // 编舞表：按小节（或拍）切换舞步，交界处 0.5 拍混合
//     { bar: 0, move: 'glowWave' }, { bar: 1, move: 'sideClap', mirror: true, intensity: 0.8 }, ...
//   ], { clock, blend: 0.5 });
//   dancer.apply(choreo.at(t, dancer));                      // 每帧：算姿势 → 写到骨骼（同步、确定性）
//   dancer.attach(stick, 'RightHand', { offset, axis });    // 道具挂在手上
//
// ─ 坐标约定（「角色空间」）──────────────────────────────────────────────────────
//   X = 角色的左手方向，Y = 上，Z = 角色面朝方向。由静止姿态的两胯 / 头的位置自动测出，与模型文件的轴无关。
//   长度用比例：脚 / 胯的位移以「腿长 L」为单位，手的目标以「臂长 A」为单位（手目标 = 肩关节 + 胸腔坐标系里的偏移）。
//
// ─ 骨骼旋转怎么算（为什么不按局部轴调）───────────────────────────────────────────
//   Tripo 自动绑的骨骼局部轴并不统一（右手骨的局部轴和左手差了约 180°），按局部欧拉角调很容易转反。
//   这里每根骨骼只存一个「角色空间里的增量旋转」d：父骨骼怎么带着它走、它自己再在角色轴上转 d。
//   累计旋转 A_b = A_parent · d_b；写回骨骼的局部四元数 = C⁻¹ · d · C · restLocal（C = 父骨骼静止时的角色空间朝向），
//   所以同一个 d 对任何绑定方式的 Mixamo 骨架含义都一样。四肢用两段 IK（肘 / 膝朝向由 pole 给），
//   弯曲方向由静止 T 字的解剖方向定（肘向后折、膝向前折），IK 构造上就不会反关节。
//
// ─ 舞步（MOVES）────────────────────────────────────────────────────────────────
//   每个舞步是 (u, o) → spec：u = 从这段开始算的连续拍数（u = 0 在这段第一个重拍上），o = { intensity, mirror }。
//   step 原地踩拍+胯部摆动 · glowWave 双臂举过头挥荧光棒 · sideClap 左右侧步+拍手 · bodyRoll 胸部律动
//   spin 转圈 · squatJump 下蹲起跳 · discoPoint 指天指地 · hairFlip 甩头发 · idle 放松站姿（A 字）
//   spec 字段（都可省略，省略 = 放松站姿）：
//     root:  { x, y, z, yaw }            整体位移（L 为单位）/ 绕 Y 转（弧度）—— 跳起、转圈
//     hips:  { x, y, z, rot:[x,y,z] }    胯部位移（L）+ 旋转（度，角色轴）
//     spine / chest / upperChest / neck / head: [x,y,z] 度    x 正 = 前倾，z 正 = 向右侧弯（右手系：绕 Z 转，+Y 转向 −X）
//     clavL / clavR: [x,y,z] 度          锁骨（耸肩、举臂时带一点）
//     handL / handR: { pos:[x,y,z], pole:[x,y,z], wrist:[x,y,z], grip, twist }
//         pos 手腕目标（A，相对肩关节，胸腔坐标系）；pole 肘尖朝向；wrist 腕部增量（度）；grip 0..1 握拳；twist 前臂扭转（度）
//     footL / footR: { pos:[x,y,z], pole, pitch }   脚踝目标 = 静止位置 + pos（L，根坐标系）；pitch 脚尖下压（度）
//   mirror 把左右对调并按 YZ 平面镜像。intensity 按比例缩小偏离放松站姿的量（0 = 放松站姿）。
//
// ─ Mixamo FBX 动作（loadMixamoMove）─────────────────────────────────────────────
//   const move = await loadMixamoMove('../anim/hip-hop.fbx', { beats: 8 });   // 或 { bpm: 120 }
//   { bar: 4, move }  直接放进编舞表。按目标拍子做时间伸缩：片段第 k 拍对齐音乐第 k 拍（t ↦ 拍数 ↦ 片段时间）。
//   重定向：源骨架（FBX 自己的静止 T 字）上每根骨骼的角色空间增量 A = W(t)·W_rest⁻¹，换算成 d 套到目标骨架，
//   所以两边骨骼局部轴、单位（厘米 / 米）都可以不同，只要同名、静止都是 T 字。采样用 mixer.setTime()，确定性。
//
// ─ 卡通化（toonify）───────────────────────────────────────────────────────────
//   const look = toonify(gltf.scene, { steps: 3, outline: { color: '#3a2433', width: 0.004 } });
//   look.set('toon' | 'pbr')  可随时切换对比。描边是蒙皮反壳（跟骨骼一起动）。
//
// ─ 自检（checkPose）─────────────────────────────────────────────────────────────
//   dancer.check() → 当前姿势的问题清单：胶囊体代理（半径由蒙皮权重从网格测出）之间的穿插、肘 / 膝反折、角度超限。

import * as THREE from 'three';

const DEG = Math.PI / 180;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const mix = (a, b, p) => a + (b - a) * p;
const fract = x => x - Math.floor(x);
const _e = new THREE.Euler();
const qE = (r = [0, 0, 0]) => new THREE.Quaternion().setFromEuler(_e.set(r[0] * DEG, r[1] * DEG, r[2] * DEG, 'YXZ'));
const v3 = a => new THREE.Vector3(a[0], a[1], a[2]);

// ============================================================ 骨骼表
const SIDES = ['Left', 'Right'];
const FINGERS = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];
export const BONES = [
  'Hips', 'Spine', 'Spine1', 'Spine2', 'Neck', 'Head',
  ...SIDES.flatMap(s => [`${s}Shoulder`, `${s}Arm`, `${s}ForeArm`, `${s}Hand`, ...FINGERS.flatMap(f => [1, 2, 3].map(k => `${s}Hand${f}${k}`))]),
  ...SIDES.flatMap(s => [`${s}UpLeg`, `${s}Leg`, `${s}Foot`, `${s}ToeBase`]),
];
/** 'mixamorig:LeftArm' / 'mixamorigLeftArm'（three 会删掉冒号）/ 'mixamorig1:LeftArm' → 'LeftArm' */
export const canonicalName = n => n.replace(/^mixamorig\d*[:_]?/i, '');
const mirrorName = n => n.startsWith('Left') ? 'Right' + n.slice(4) : n.startsWith('Right') ? 'Left' + n.slice(5) : n;
const mirrorQ = q => new THREE.Quaternion(q.x, -q.y, -q.z, q.w);   // 关于 YZ 平面（x → −x）镜像

// ============================================================ 骨架测量（静止姿态）
/**
 * 读一个 Mixamo 骨架的静止姿态：每根骨骼在角色空间里的朝向 / 位置、角色空间的轴、腿长 / 臂长。
 * root = 模型根（gltf.scene 或 FBX group）。只读，不改骨骼。
 */
export function measureSkeleton(root) {
  root.updateMatrixWorld(true);
  const bones = {};
  root.traverse(o => { if (o.isBone || o.type === 'Bone') { const k = canonicalName(o.name); if (BONES.includes(k) && !bones[k]) bones[k] = o; } });
  for (const k of ['Hips', 'Spine', 'Head', 'LeftArm', 'RightArm', 'LeftUpLeg', 'RightUpLeg']) if (!bones[k]) throw new Error(`dance3d: 找不到骨骼 ${k}（需要 Mixamo 命名）`);
  const rootInv = root.matrixWorld.clone().invert();
  const rel = {};   // 骨骼相对 root 的矩阵（静止）
  for (const [k, b] of Object.entries(bones)) rel[k] = rootInv.clone().multiply(b.matrixWorld);
  const pos = k => new THREE.Vector3().setFromMatrixPosition(rel[k]);

  // 角色空间：X = 左胯 − 右胯，Y = 头 − 胯（正交化），Z = X × Y（面朝）
  const X = pos('LeftUpLeg').sub(pos('RightUpLeg')).normalize();
  const Y = pos('Head').sub(pos('Hips')); Y.addScaledVector(X, -Y.dot(X)).normalize();
  const Z = new THREE.Vector3().crossVectors(X, Y);
  const K = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(X, Y, Z));  // 角色 → root
  const Kinv = K.clone().invert();

  const info = {};
  const _p = new THREE.Vector3(), _q = new THREE.Quaternion(), _s = new THREE.Vector3();
  for (const [k, b] of Object.entries(bones)) {
    rel[k].decompose(_p, _q, _s);
    const par = b.parent, parRel = rootInv.clone().multiply(par.matrixWorld);
    const pq = new THREE.Quaternion(); parRel.decompose(new THREE.Vector3(), pq, new THREE.Vector3());
    info[k] = {
      bone: b, name: k,
      W: Kinv.clone().multiply(_q),                 // 静止朝向（角色空间）
      P: _p.clone().applyQuaternion(Kinv),          // 静止位置（角色空间，root 单位）
      C: Kinv.clone().multiply(pq),                 // 父骨骼静止朝向（角色空间）
      restQ: b.quaternion.clone(), restPos: b.position.clone(),
      parentRel: parRel,                            // 父骨骼相对 root 的静止矩阵（胯部位移换算用）
      parentKey: null,
    };
  }
  for (const k of Object.keys(info)) {
    let p = info[k].bone.parent;
    while (p && !(BONES.includes(canonicalName(p.name)) && bones[canonicalName(p.name)] === p)) p = p.parent;
    info[k].parentKey = p ? canonicalName(p.name) : null;
  }
  const d = (a, b) => info[a] && info[b] ? info[a].P.distanceTo(info[b].P) : 0;
  const legLen = (d('LeftUpLeg', 'LeftLeg') + d('LeftLeg', 'LeftFoot') + d('RightUpLeg', 'RightLeg') + d('RightLeg', 'RightFoot')) / 2;
  const armLen = (d('LeftArm', 'LeftForeArm') + d('LeftForeArm', 'LeftHand') + d('RightArm', 'RightForeArm') + d('RightForeArm', 'RightHand')) / 2;
  // 子骨骼顺序（父在前）
  const order = BONES.filter(k => info[k]);
  const depth = k => { let n = 0; for (let p = info[k].parentKey; p; p = info[p].parentKey) n++; return n; };
  order.sort((a, b) => depth(a) - depth(b));
  return { root, bones, info, K, Kinv, legLen, armLen, order };
}

// ============================================================ 姿势：spec → solved
// solved = { root: {pos: Vector3, yaw}, hips: Vector3（角色空间偏移，root 单位）, d: { bone: Quaternion } }

const REST_SPEC = {
  hips: { x: 0, y: 0, z: 0, rot: [0, 0, 0] },
  handL: { pos: [0.26, -0.9, 0.12], pole: [0.3, -0.2, -1], wrist: [0, 0, 0], grip: 0.25, twist: 0 },
  footL: { pos: [0, 0, 0], pole: [0.15, 0, 1], pitch: 0 },
};

/** 两段 IK 的基：dir 是骨骼方向，n 是弯曲轴 → 旋转矩阵列 (dir, n, dir×n) */
function frameQ(dir, n) {
  const b = new THREE.Vector3().crossVectors(dir, n);
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(dir, n, b));
}

export function createSolver(S) {
  const I = S.info, L = S.legLen, A = S.armLen;
  // 两段肢体：静止方向、长度、静止弯曲轴（肘：前臂向前折；膝：小腿向后折）
  const limb = (up, mid, end, fold) => {
    if (!I[up] || !I[mid] || !I[end]) return null;
    const a = I[up].P.distanceTo(I[mid].P), b = I[mid].P.distanceTo(I[end].P);
    const dU = I[mid].P.clone().sub(I[up].P).normalize(), dL = I[end].P.clone().sub(I[mid].P).normalize();
    const f = new THREE.Vector3(...fold);
    const nU = new THREE.Vector3().crossVectors(dU, f).normalize(), nL = new THREE.Vector3().crossVectors(dL, f).normalize();
    return { up, mid, end, a, b, restU: frameQ(dU, nU), restL: frameQ(dL, nL), foldRest: f };
  };
  const LIMB = {
    armL: limb('LeftArm', 'LeftForeArm', 'LeftHand', [0, 0, 1]), armR: limb('RightArm', 'RightForeArm', 'RightHand', [0, 0, 1]),
    legL: limb('LeftUpLeg', 'LeftLeg', 'LeftFoot', [0, 0, -1]), legR: limb('RightUpLeg', 'RightLeg', 'RightFoot', [0, 0, -1]),
  };

  // 前向运动学（角色空间）：A = 累计增量，X = 当前位置
  function fk(d, hipsOff) {
    const Acc = {}, X = {};
    for (const k of S.order) {
      const inf = I[k], dq = d[k] || new THREE.Quaternion();
      if (!inf.parentKey) { Acc[k] = dq.clone(); X[k] = inf.P.clone().add(hipsOff); continue; }
      const pA = Acc[inf.parentKey];
      Acc[k] = pA.clone().multiply(dq);
      X[k] = X[inf.parentKey].clone().add(inf.P.clone().sub(I[inf.parentKey].P).applyQuaternion(pA));
    }
    return { A: Acc, X };
  }

  // 两段 IK：s 上端点位置，t 目标，pole 关节朝向 → 上段 / 下段的角色空间累计旋转
  function ik2(lb, s, t, pole) {
    const { a, b } = lb;
    const v = t.clone().sub(s); let dist = v.length();
    const dir = dist > 1e-6 ? v.clone().divideScalar(dist) : new THREE.Vector3(0, -1, 0);
    dist = clamp(dist, Math.abs(a - b) + 1e-4, (a + b) * 0.9995);
    const x = (a * a - b * b + dist * dist) / (2 * dist), h = Math.sqrt(Math.max(0, a * a - x * x));
    let pp = pole.clone().addScaledVector(dir, -pole.dot(dir));
    if (pp.lengthSq() < 1e-8) pp = new THREE.Vector3(0, 0, 1).addScaledVector(dir, -dir.z);
    pp.normalize();
    const m = s.clone().addScaledVector(dir, x).addScaledVector(pp, h);
    const tt = s.clone().addScaledVector(dir, dist);
    const dU = m.clone().sub(s).normalize(), dL = tt.clone().sub(m).normalize();
    // 弯曲轴 = 上段 × 折向（折向 = pole 的反方向）；和静止时的 dir × fold 同号
    const n = new THREE.Vector3().crossVectors(dU, pp.clone().negate()).normalize();
    return {
      AU: frameQ(dU, n).multiply(lb.restU.clone().invert()),
      AL: frameQ(dL, n).multiply(lb.restL.clone().invert()),
      elbow: m,
    };
  }

  // 手目标避让：落在头 / 躯干代理胶囊里（半径 + 手半径 + 余量）就沿最近点法向推出去。
  // 大头的猫举手时会自动把手放到头外侧，不用每个角色单独调参。proxies 由 createDancer 测好后塞进来。
  let PX = null, LIM = null;
  const _line = new THREE.Line3(), _c = new THREE.Vector3();
  function avoid(tgt, X, side, Acc) {
    if (!PX) return tgt;
    const rh = PX.radius[side === 'Left' ? 'handL' : 'handR'] || 0, margin = 0.06 * A;
    for (let pass = 0; pass < 2; pass++) for (const k of ['head', 'torsoHigh', 'torsoLow']) {
      const [a, b] = PX.segEnds(k, X, Acc), R = (PX.radius[k] || 0) + rh + margin;
      _line.set(a, b).closestPointToPoint(tgt, true, _c);
      const d = tgt.distanceTo(_c);
      if (d < R) {
        let n = tgt.clone().sub(_c);
        if (n.lengthSq() < 1e-10) n.set(side === 'Left' ? 1 : -1, 0, 0);
        n.normalize(); tgt.copy(_c).addScaledVector(n, R);
      }
    }
    return tgt;
  }

  const fingerKeys = side => FINGERS.flatMap(f => [1, 2, 3].map(k => `${side}Hand${f}${k}`)).filter(k => I[k]);

  /** spec（左右已展开、镜像已处理）→ solved */
  function solve(sp) {
    const d = {};
    const set = (k, r) => { if (I[k] && r) d[k] = qE(r); };
    const hips = sp.hips || {};
    const hipsOff = new THREE.Vector3((hips.x || 0) * L, (hips.y || 0) * L, (hips.z || 0) * L);
    if (LIM?.hipsDropMax != null) hipsOff.y = Math.max(hipsOff.y, -LIM.hipsDropMax * L);   // 限制下蹲深度（胯、膝的衣服不被挤爆）
    set('Hips', hips.rot); set('Spine', sp.spine); set('Spine1', sp.chest); set('Spine2', sp.upperChest);
    set('Neck', sp.neck); set('Head', sp.head);
    set('LeftShoulder', sp.clavL); set('RightShoulder', sp.clavR);
    // 手指：握拳 = 各节绕「手背横轴」弯；左手在 T 字里指 +X、掌心朝 −Y → 绕 +Z 负转；右手镜像
    for (const [side, sgn, h] of [['Left', -1, sp.handL], ['Right', 1, sp.handR]]) {
      const g = h?.grip ?? 0.25;
      for (const k of fingerKeys(side)) {
        const seg = +k.slice(-1), thumb = k.includes('Thumb');
        const ang = thumb ? g * (seg === 1 ? 10 : 25) : g * (seg === 1 ? 70 : seg === 2 ? 95 : 60);
        d[k] = thumb ? qE([ang * 0.8, sgn * -ang * 0.5, sgn * ang * 0.3]) : qE([0, 0, sgn * ang]);
      }
    }
    // 先按已知的 d 做一次 FK，拿到肩 / 胯位置和胸腔朝向，再解四肢
    let F = fk(d, hipsOff);
    for (const [key, side, h] of [['armL', 'Left', sp.handL], ['armR', 'Right', sp.handR]]) {
      const lb = LIMB[key]; if (!lb || !h) continue;
      const chest = F.A.Spine2 || F.A.Spine1 || F.A.Spine;   // 手目标跟着胸腔走
      const s = F.X[lb.up];
      const off = v3(h.pos), sx = side === 'Left' ? 1 : -1;
      if (LIM?.crossMax != null) off.x = sx * Math.max(sx * off.x, -LIM.crossMax);   // 手不越过身体中线太多（袖子压胸）
      const tgt = avoid(s.clone().add(off.multiplyScalar(A).applyQuaternion(chest)), F.X, side, F.A);
      const pole = v3(h.pole || [0, -0.3, -1]).applyQuaternion(chest);
      let r = ik2(lb, s, tgt, pole);
      if (LIM?.armDownMin || LIM?.armUpMax) {   // 上臂离「胸腔正下方」在 [armDownMin, armUpMax] 度之间（腋下 / 袖子不压进躯干，前臂不碰头）：超出就绕肩转回来
        const down = new THREE.Vector3(0, -1, 0).applyQuaternion(chest), fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(chest);
        const dU = r.elbow.clone().sub(s).normalize();
        const lat = dU.clone().addScaledVector(fwd, -dU.dot(fwd));          // 冠状面里的分量
        const ang = lat.lengthSq() > 1e-8 ? lat.angleTo(down) / DEG : 0;
        const outward = new THREE.Vector3(sx, 0, 0).applyQuaternion(chest);
        const inward = lat.dot(outward) < 0;                                 // 上臂已经往里收（越过正下方）
        let deficit = inward ? LIM.armDownMin + ang : LIM.armDownMin - ang;
        if (LIM.armUpMax && !inward && ang > LIM.armUpMax) deficit = LIM.armUpMax - ang;   // 举太高（大头的猫前臂会碰头）→ 往回收
        if (deficit > 0 || deficit < 0 && LIM.armUpMax && ang > LIM.armUpMax) {
          const rot = new THREE.Quaternion().setFromAxisAngle(fwd, sx * deficit * DEG);
          tgt.sub(s).applyQuaternion(rot).add(s); pole.applyQuaternion(rot);
          r = ik2(lb, s, tgt, pole);
        }
      }
      let AU = r.AU, AL = r.AL;
      if (h.twist) {   // 前臂绕自身轴扭（手掌朝向），上臂分一半避免糖纸扭曲
        const ax = tgt.clone().sub(r.elbow).normalize();
        AL = new THREE.Quaternion().setFromAxisAngle(ax, h.twist * DEG).multiply(AL);
        const axU = r.elbow.clone().sub(s).normalize();
        AU = new THREE.Quaternion().setFromAxisAngle(axU, h.twist * 0.35 * DEG).multiply(AU);
      }
      const pA = F.A[I[lb.up].parentKey];
      d[lb.up] = pA.clone().invert().multiply(AU);
      d[lb.mid] = AU.clone().invert().multiply(AL);
      if (h.wrist) d[lb.end] = qE(h.wrist);
    }
    for (const [key, h, side] of [['legL', sp.footL, 'Left'], ['legR', sp.footR, 'Right']]) {
      const lb = LIMB[key]; if (!lb) continue;
      const f = h || {};
      const s = F.X[lb.up];
      const tgt = I[lb.end].P.clone().add(v3(f.pos || [0, 0, 0]).multiplyScalar(L));
      const pole = v3(f.pole || [side === 'Left' ? 0.15 : -0.15, 0, 1]);
      const r = ik2(lb, s, tgt, pole);
      const pA = F.A[I[lb.up].parentKey];
      d[lb.up] = pA.clone().invert().multiply(r.AU);
      d[lb.mid] = r.AU.clone().invert().multiply(r.AL);
      // 脚：朝向保持水平（只跟着根转）+ 可选脚尖下压
      const foot = qE([f.pitch || 0, 0, 0]);
      d[lb.end] = r.AL.clone().invert().multiply(foot);
      if (I[`${side}ToeBase`]) d[`${side}ToeBase`] = qE([-(f.toe || 0), 0, 0]);
    }
    const root = sp.root || {};
    return {
      root: { pos: new THREE.Vector3((root.x || 0) * L, (root.y || 0) * L, (root.z || 0) * L), yaw: root.yaw || 0 },
      hips: hipsOff, d,
    };
  }

  return { solve, fk, LIMB, setProxies(p) { PX = p; }, setLimits(l) { LIM = l; } };
}

/** spec 的左右形式：把 mirror / intensity 展开成 solve 能直接吃的 spec */
function normalizeSpec(sp, { mirror = false, intensity = 1 } = {}) {
  const R = REST_SPEC;
  const mixArr = (a, b) => (b || a).map((v, i) => mix(a[i], v, intensity));
  const rest3 = [0, 0, 0];
  const handRest = side => {
    const h = R.handL, sx = side === 'L' ? 1 : -1;
    return { pos: [h.pos[0] * sx, h.pos[1], h.pos[2]], pole: [h.pole[0] * sx, h.pole[1], h.pole[2]], wrist: [0, 0, 0], grip: h.grip, twist: 0 };
  };
  const footRest = side => ({ pos: [0, 0, 0], pole: [0.15 * (side === 'L' ? 1 : -1), 0, 1], pitch: 0, toe: 0 });
  let s = sp;
  if (mirror) {
    const mv = a => a && [-a[0], a[1], a[2]], mr = a => a && [a[0], -a[1], -a[2]];
    const mh = h => h && { ...h, pos: mv(h.pos), pole: mv(h.pole), wrist: mr(h.wrist), twist: h.twist && -h.twist };
    const mf = f => f && { ...f, pos: mv(f.pos), pole: mv(f.pole) };
    s = {
      ...sp,
      root: sp.root && { ...sp.root, x: -(sp.root.x || 0), yaw: -(sp.root.yaw || 0) },
      hips: sp.hips && { ...sp.hips, x: -(sp.hips.x || 0), rot: mr(sp.hips.rot) },
      spine: mr(sp.spine), chest: mr(sp.chest), upperChest: mr(sp.upperChest), neck: mr(sp.neck), head: mr(sp.head),
      clavL: mr(sp.clavR), clavR: mr(sp.clavL), handL: mh(sp.handR), handR: mh(sp.handL), footL: mf(sp.footR), footR: mf(sp.footL),
    };
  }
  const hand = (h, side) => { const r = handRest(side); h = h || {}; return {
    pos: mixArr(r.pos, h.pos), pole: mixArr(r.pole, h.pole), wrist: mixArr(rest3, h.wrist),
    grip: mix(r.grip, h.grip ?? r.grip, intensity), twist: mix(0, h.twist || 0, intensity) }; };
  const foot = (f, side) => { const r = footRest(side); f = f || {}; return {
    pos: mixArr(r.pos, f.pos), pole: f.pole || r.pole, pitch: mix(0, f.pitch || 0, intensity), toe: mix(0, f.toe || 0, intensity) }; };
  const hp = s.hips || {}, rt = s.root || {};
  return {
    root: { x: (rt.x || 0) * intensity, y: (rt.y || 0) * intensity, z: (rt.z || 0) * intensity, yaw: rt.yaw || 0 },   // 转圈不按强度缩（转半圈没意义）
    hips: { x: (hp.x || 0) * intensity, y: (hp.y || 0) * intensity, z: (hp.z || 0) * intensity, rot: mixArr(rest3, hp.rot) },
    spine: mixArr(rest3, s.spine), chest: mixArr(rest3, s.chest), upperChest: mixArr(rest3, s.upperChest),
    neck: mixArr(rest3, s.neck), head: mixArr(rest3, s.head), clavL: mixArr(rest3, s.clavL), clavR: mixArr(rest3, s.clavR),
    handL: hand(s.handL, 'L'), handR: hand(s.handR, 'R'), footL: foot(s.footL, 'L'), footR: foot(s.footR, 'R'),
  };
}

/** 两个 solved 姿势混合：位置线性、四元数 slerp（最短路径） */
export function blendSolved(a, b, p) {
  if (p <= 0) return a; if (p >= 1) return b;
  const d = {};
  for (const k of new Set([...Object.keys(a.d), ...Object.keys(b.d)])) {
    const qa = a.d[k] || new THREE.Quaternion(), qb = b.d[k] || new THREE.Quaternion();
    d[k] = qa.clone().slerp(qb, p);
  }
  // 转圈的 yaw 按最短角度混合
  let dy = b.root.yaw - a.root.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
  return { root: { pos: a.root.pos.clone().lerp(b.root.pos, p), yaw: a.root.yaw + dy * p }, hips: a.hips.clone().lerp(b.hips, p), d };
}

// ============================================================ 舞步词汇
// u = 连续拍数（这段开始的重拍 = 0）。约定：拍点上是「落」的瞬间（下蹲最低、手到位），拍间是准备。
const beatDip = u => 0.5 + 0.5 * Math.cos(2 * Math.PI * u);           // 拍点 1，拍间 0
const hit = (u, w = 0.12) => { const f = fract(u); return Math.exp(-(f * f) / (2 * w * w)) + Math.exp(-((1 - f) ** 2) / (2 * w * w)); };
const snapTo = (u, k = 0.35) => smooth(fract(u) / k);                   // 每拍开始 k 拍内快速到位
// 在拍点关键帧之间插值：keys[i] 是第 i 拍的值，move = 在 [i-trans, i] 内过渡（拍点前到位）
function keyed(u, keys, trans = 0.5, ease = smooth) {
  const n = keys.length, i = Math.floor(u), f = u - i;
  const cur = keys[((i % n) + n) % n], next = keys[(((i + 1) % n) + n) % n];
  const p = ease((f - (1 - trans)) / trans);
  return Array.isArray(cur) ? cur.map((v, j) => mix(v, next[j], p)) : mix(cur, next, p);
}

export const MOVES = {
  idle(u) {
    const b = beatDip(u);
    return { hips: { y: -0.012 * b }, head: [2 * b, 0, 0] };
  },

  // 原地踩拍 + 胯部摆动：拍间抬一只脚（左右交替），胯往支撑脚那边送，拍点下沉
  step(u) {
    const s = Math.sin(Math.PI * u), b = beatDip(u);
    const liftR = Math.max(0, s) ** 1.5, liftL = Math.max(0, -s) ** 1.5;
    return {
      hips: { x: 0.07 * s, y: -0.035 * b - 0.02, rot: [0, 6 * s, -7 * s] },
      spine: [2, 0, 4 * s], chest: [3, -4 * s, 3 * s], head: [3 * b, 6 * s, -6 * s],
      footR: { pos: [0, 0.09 * liftR, 0.04 * liftR], pitch: 18 * liftR },
      footL: { pos: [0, 0.09 * liftL, 0.04 * liftL], pitch: 18 * liftL },
      handL: { pos: [0.34, -0.62 + 0.08 * b, 0.45 - 0.12 * s], pole: [0.5, -0.4, -1], grip: 0.8 },
      handR: { pos: [-0.34, -0.62 + 0.08 * b, 0.45 + 0.12 * s], pole: [-0.5, -0.4, -1], grip: 0.9 },
    };
  },

  // 双臂举过头挥荧光棒：两拍一个来回，手臂 V 字左右扫，胯反向摆
  glowWave(u) {
    const w = Math.sin(Math.PI * (u - 0.5)), b = beatDip(u);
    return {
      hips: { x: -0.05 * w, y: -0.03 * b - 0.01, rot: [0, 0, 6 * w] },
      spine: [-2, 0, -4 * w], chest: [-4, 0, -5 * w], upperChest: [-3, 0, -3 * w], head: [-6 + 4 * b, 0, -4 * w],
      clavL: [0, 0, 16], clavR: [0, 0, -16],
      handL: { pos: [0.34 - 0.2 * w, 0.84, 0.28], pole: [1, 0.2, -0.6], wrist: [0, 0, -28 * w], grip: 0.35 },
      handR: { pos: [-0.34 - 0.2 * w, 0.84, 0.28], pole: [-1, 0.2, -0.6], wrist: [0, 0, -28 * w], grip: 0.95 },
      footL: { pos: [0, 0, 0], pitch: 0 }, footR: { pos: [0, 0, 0] },
    };
  },

  // 左右侧步 + 拍手：1 右脚出、2 左脚并 + 拍手、3 左脚出、4 右脚并 + 拍手
  sideClap(u) {
    const D = 0.12, TW = 70, WR = 30;   // 半步（L）：0 拍右脚出（开）、1 拍左脚并、2 拍左脚出（开）、3 拍右脚并
    const rx = keyed(u, [-D, -D, -D, D]), lx = keyed(u, [D, -D, D, D]);
    const f = fract(u), moving = i => { const k = ((Math.floor(u) + 1) % 4 + 4) % 4; return i.includes(k) ? Math.sin(Math.PI * clamp((f - 0.5) / 0.5)) : 0; };
    const liftR = moving([3, 0]), liftL = moving([1, 2]);   // 下一拍要动的那只脚在拍间抬起
    const hx = (rx + lx) / 2, b = beatDip(u);
    const clap = Math.max(hit(u - 1, 0.16) * (Math.floor(u + 0.5) % 2 === 1 ? 1 : 0), 0);
    const open = 1 - clap;
    const lean = hx / D;   // −1..1
    return {
      hips: { x: hx, y: -0.04 * b - 0.015, rot: [0, 0, 5 * lean] },
      spine: [3, 0, -3 * lean], chest: [2, 0, -3 * lean], head: [4 * b, 0, 3 * lean],
      footR: { pos: [rx, 0.07 * liftR, 0], pitch: 10 * liftR }, footL: { pos: [lx, 0.07 * liftL, 0], pitch: 10 * liftL },
      handL: { pos: [mix(-0.08, 0.42, open), -0.22 + 0.1 * open, mix(0.8, 0.5, open)], pole: [0.8, -0.6, -0.4], grip: mix(0, 0.4, open), twist: TW * clap, wrist: [0, WR * clap, 0] },
      handR: { pos: [mix(0.08, -0.42, open), -0.22 + 0.1 * open, mix(0.8, 0.5, open)], pole: [-0.8, -0.6, -0.4], grip: 0.95, twist: -TW * clap, wrist: [0, -WR * clap, 0] },
    };
  },

  // 胸部律动（body roll）：两拍一个波，从胯经胸到头依次传过去
  bodyRoll(u) {
    const th = Math.PI * u, wave = k => Math.sin(th - k);
    const b = beatDip(u);
    return {
      hips: { z: -0.04 * wave(-0.6), y: -0.05 - 0.02 * b, rot: [-8 * wave(-0.6), 0, 0] },
      spine: [9 * wave(0), 0, 0], chest: [10 * wave(0.6), 0, 0], upperChest: [9 * wave(1.2), 0, 0],
      neck: [-8 * wave(1.8), 0, 0], head: [-6 * wave(2.2), 0, 0],
      footL: { pole: [0.2, 0, 1] }, footR: { pole: [-0.2, 0, 1] },
      handL: { pos: [0.5, -0.45 + 0.1 * wave(1.2), 0.55], pole: [0.8, -0.5, -0.5], wrist: [0, 0, 12 * wave(1.8)], grip: 0.1 },
      handR: { pos: [-0.5, -0.45 + 0.1 * wave(1.2), 0.55], pole: [-0.8, -0.5, -0.5], wrist: [0, 0, -12 * wave(1.8)], grip: 0.95 },
    };
  },

  // 转圈：第 0.5–3 拍转一整圈，第 3 拍面朝前定住；转时手臂张开、右手荧光棒举高
  spin(u) {
    const U = ((u % 4) + 4) % 4, p = smooth((U - 0.5) / 2.5);
    const up = Math.sin(Math.PI * p), b = beatDip(u);
    return {
      root: { yaw: 2 * Math.PI * p },
      hips: { y: -0.03 * b * (1 - up) + 0.015 * up },
      spine: [-2 * up, 0, 0], head: [-5 * up, 0, 0],
      clavR: [0, 0, -10 * up],
      footL: { pos: [0.03 * up, 0.02 * up, 0], pitch: 25 * up, toe: 25 * up }, footR: { pos: [-0.03 * up, 0.02 * up, 0], pitch: 25 * up, toe: 25 * up },
      handL: { pos: [mix(0.4, 0.8, up), mix(-0.55, -0.15, up), mix(0.45, 0.35, up)], pole: [0.3, -0.5, -1], grip: 0.3 },
      handR: { pos: [mix(-0.4, -0.35, up), mix(-0.55, 0.85, up), mix(0.45, 0.3, up)], pole: [-1, 0, -0.6], grip: 0.95 },
    };
  },

  // 下蹲起跳：0–1.5 拍蹲下手往后摆，1.5–2 蹬，2–3 腾空（双手 V 字上扬），3–3.3 落地缓冲，3.3–4 回位
  squatJump(u) {
    const U = ((u % 4) + 4) % 4;
    let squat = 0, air = 0, swing = 0;       // swing: −1 手在后，+1 手在上
    if (U < 1.5) { squat = smooth(U / 1.5); swing = -squat; }
    else if (U < 2) { const p = (U - 1.5) / 0.5; squat = 1 - smooth(p); swing = mix(-1, 1, smooth(p)); }
    else if (U < 3) { air = (U - 2); swing = 1; }
    else if (U < 3.3) { const p = (U - 3) / 0.3; squat = 0.55 * Math.sin(Math.PI / 2 * p); swing = 1 - p; }
    else { const p = (U - 3.3) / 0.7; squat = 0.55 * (1 - smooth(p)); swing = -0.0 * p; }
    const h = air > 0 ? 4 * air * (1 - air) : 0, tuck = air > 0 ? Math.sin(Math.PI * air) : 0;
    const back = Math.max(0, -swing), upA = Math.max(0, swing);
    const side = U >= 1.5 && U < 2 ? 0.4 * Math.sin(Math.PI * (U - 1.5) / 0.5)
      : U >= 3 ? 0.35 * Math.sin(Math.PI * clamp((U - 3) / 1)) : 0;   // 落地时手也从两侧放下   // 由后往上甩时从身体两侧绕，不擦过蹲着的大腿
    return {
      root: { y: 0.32 * h },
      hips: { y: -0.22 * squat + 0.02 * upA * (air ? 0 : 1), z: -0.06 * squat, rot: [8 * squat, 0, 0] },
      spine: [10 * squat - 4 * upA, 0, 0], chest: [8 * squat - 4 * upA, 0, 0], head: [-10 * squat - 6 * upA, 0, 0],
      clavL: [0, 0, 12 * upA], clavR: [0, 0, -12 * upA],
      footL: { pos: [0.02 * squat, 0.1 * tuck, -0.04 * tuck], pole: [0.35, 0, 1], pitch: 25 * tuck }, footR: { pos: [-0.02 * squat, 0.1 * tuck, -0.04 * tuck], pole: [-0.35, 0, 1], pitch: 25 * tuck },
      handL: { pos: [side + mix(mix(0.26, 0.48, back), 0.45, upA), mix(mix(-0.88, -0.75, back), 0.82, upA), mix(mix(0.12, -0.45, back), 0.25, upA)], pole: [mix(0.3, 1, upA), -0.2, -1], grip: 0.3 },
      handR: { pos: [-side + mix(mix(-0.26, -0.48, back), -0.45, upA), mix(mix(-0.88, -0.75, back), 0.82, upA), mix(mix(0.12, -0.45, back), 0.25, upA)], pole: [mix(-0.3, -1, upA), -0.2, -1], grip: 0.95 },
    };
  },

  // 指天指地（disco point）：右手每拍在「右上方」和「左下方」之间切，胯往指的方向顶，左拳收在腰前
  discoPoint(u) {
    const i = Math.floor(u), f = u - i, up = ((i % 2) + 2) % 2 === 0;
    const k = smooth(f / 0.32);                                 // 拍点后 0.32 拍到位
    const UP = [-0.55, 0.78, 0.35], DN = [0.25, -0.55, 0.95];
    const from = up ? DN : UP, to = up ? UP : DN;
    const pos = from.map((v, j) => mix(v, to[j], k));
    pos[2] += 0.35 * Math.sin(Math.PI * k);                      // 从身前绕过，不贴身
    const side = up ? 1 : -1, pk = mix(-side, side, k);         // +1 = 指右上
    const b = beatDip(u);
    return {
      hips: { x: -0.07 * pk, y: -0.035 * b - 0.02, rot: [0, -8 * pk, 8 * pk] },
      spine: [2, -5 * pk, -4 * pk], chest: [0, -6 * pk, -4 * pk], head: [-12 * pk + 6, -18 * pk, 0],
      clavR: [0, 0, -12 * Math.max(0, pk)],
      handR: { pos, pole: [-0.6, -0.8, -0.5], grip: 0.95, twist: 0 },
      handL: { pos: [0.22, -0.6, 0.62], pole: [1, -0.4, -0.4], grip: 0.9 },
      footL: { pos: [0, 0, 0] }, footR: { pos: [-0.04 * Math.max(0, pk), 0, 0], pitch: 8 * Math.max(0, pk) },
    };
  },

  // 甩头发：0–1 拍低头蓄力，第 2 拍往右后上方甩开（头 + 颈 + 上胸一起），3–4 回正；手在肩前打开
  hairFlip(u) {
    const U = ((u % 4) + 4) % 4;
    let down = 0, flip = 0;
    if (U < 1.6) down = smooth(U / 1.4);
    else if (U < 2.1) { const p = smooth((U - 1.6) / 0.5); down = 1 - p; flip = p; }
    else flip = 1 - smooth((U - 2.3) / 1.5);
    const b = beatDip(u);
    return {
      hips: { y: -0.03 * b - 0.02 - 0.04 * down, x: 0.04 * flip, rot: [0, 0, -6 * flip] },
      spine: [8 * down - 4 * flip, 0, 3 * flip], chest: [8 * down - 5 * flip, 0, 4 * flip], upperChest: [6 * down - 5 * flip, 10 * flip, 4 * flip],
      neck: [16 * down - 12 * flip, 12 * flip, 8 * flip], head: [16 * down - 16 * flip, 16 * flip, 14 * flip],
      handL: { pos: [0.55, -0.25 + 0.15 * flip, 0.5], pole: [0.8, -0.6, -0.4], grip: 0.2, wrist: [0, 0, 20 * flip] },
      handR: { pos: [-0.55, -0.35 - 0.1 * down, 0.55], pole: [-0.8, -0.6, -0.4], grip: 0.95 },
      footL: { pole: [0.2, 0, 1] }, footR: { pole: [-0.2, 0, 1] },
    };
  },
};
export const MOVE_NAMES = Object.keys(MOVES).filter(k => k !== 'idle');
export const MOVE_LABELS = {
  idle: '放松站姿', step: '原地踩拍 + 胯部摆动', glowWave: '举臂挥荧光棒', sideClap: '侧步 + 拍手', bodyRoll: '胸部律动',
  spin: '转圈', squatJump: '下蹲起跳', discoPoint: '指天指地', hairFlip: '甩头发',
};

// ============================================================ 拍子时钟
/**
 * t ↦ 连续拍数（整数 = 拍点，0 = 第一个重拍），以及 bar ↔ 拍换算。
 *   beatClock(M)                  引擎 music.js 的 createMusic() 结果（按真实拍点分段线性，全曲对齐）
 *   beatClock({ bpm, t0, perBar }) 恒定速度：t0 = 某个重拍的时间
 */
export function beatClock(src) {
  if (src && typeof src.beat === 'function' && src.beats) {
    const M = src, firstDown = M.downbeats[0];
    const i0 = M.beats.findIndex(b => Math.abs(b - firstDown) < 1e-3);
    return {
      beats: t => { const b = M.beat(t); return b.i - i0 + clamp(b.phase, 0, 1); },
      barToBeat: bar => bar * 4, perBar: 4, period: M.period ?? M.beats[1] - M.beats[0],
      timeOf: beat => { const i = Math.floor(beat) + i0, f = beat - Math.floor(beat); const B = M.beats, P = B[1] - B[0];
        const at = j => j < 0 ? B[0] + j * P : j >= B.length ? B[B.length - 1] + (j - B.length + 1) * P : B[j];
        return mix(at(i), at(i + 1), f); },
    };
  }
  const { bpm = 120, t0 = 0, perBar = 4 } = src || {};
  const P = 60 / bpm;
  return { beats: t => (t - t0) / P, barToBeat: bar => bar * perBar, perBar, period: P, timeOf: b => t0 + b * P };
}

// ============================================================ 编舞表
/**
 * entries: [{ bar | beat, move: 'name' | 舞步函数 | loadMixamoMove 的结果, mirror, intensity, offset }]，按开始时间排序。
 * 每段的 u 从它自己的开始拍起算（offset 拍可再平移，比如让舞步从第 2 拍的相位开始）。
 * 交界处：从 (开始 − blend) 到开始，用上一段和这一段各自的姿势按 smoothstep 混合 → 新舞步的第 1 拍正好落在重拍上。
 */
export function createChoreo(entries, { clock, blend = 0.5 } = {}) {
  if (!clock) throw new Error('createChoreo 需要 clock（beatClock(M) 或 beatClock({ bpm, t0 })）');
  const list = entries.map(e => ({ ...e, start: e.beat ?? clock.barToBeat(e.bar ?? 0) })).sort((a, b) => a.start - b.start);
  const solvedOf = (e, u, dancer) => {
    const mv = typeof e.move === 'string' ? MOVES[e.move] : e.move;
    if (!mv) throw new Error(`没有这个舞步：${e.move}`);
    if (mv.isClip) return mv.solve(u + (e.offset || 0), dancer, e);
    return dancer.solver.solve(normalizeSpec(mv(u + (e.offset || 0), e), e));
  };
  function at(t, dancer) {
    const B = clock.beats(t);
    let i = -1;
    for (let k = 0; k < list.length; k++) if (list[k].start - blend <= B) i = k;
    if (i < 0) return solvedOf(list[0], B - list[0].start, dancer);
    const cur = list[i];
    const into = B - (cur.start - blend);
    if (i > 0 && into < blend) {
      const prev = list[i - 1];
      return blendSolved(solvedOf(prev, B - prev.start, dancer), solvedOf(cur, B - cur.start, dancer), smooth(into / blend));
    }
    return solvedOf(cur, B - cur.start, dancer);
  }
  /** t 时在跳哪一段（给字幕 / 自检用） */
  function current(t) {
    const B = clock.beats(t); let i = 0;
    for (let k = 0; k < list.length; k++) if (list[k].start <= B) i = k;
    return { ...list[i], index: i, u: B - list[i].start };
  }
  return { at, current, list, clock };
}

// ============================================================ Dancer：把姿势写到骨骼上
export function createDancer(root, { rootGroup = null, avoid = true, limits = null } = {}) {
  const S = measureSkeleton(root);
  const solver = createSolver(S);
  const I = S.info;
  const holder = rootGroup || root;
  const base = { pos: holder.position.clone(), quat: holder.quaternion.clone() };
  const _q = new THREE.Quaternion(), _m = new THREE.Matrix4();
  // 根坐标系下「角色 Y 轴」（转圈用）
  const upAxis = new THREE.Vector3(0, 1, 0).applyQuaternion(S.K);

  function apply(pose) {
    for (const k of S.order) {
      const inf = I[k], dq = pose.d[k];
      if (!dq) { inf.bone.quaternion.copy(inf.restQ); continue; }
      // local = C⁻¹ · d · C · restLocal
      _q.copy(inf.C).invert().multiply(dq).multiply(inf.C).multiply(inf.restQ);
      inf.bone.quaternion.copy(_q);
    }
    // 胯部位移：角色空间偏移 → root 空间 → 父骨骼局部
    const H = I.Hips;
    const relPos = H.P.clone().add(pose.hips).applyQuaternion(S.K);
    H.bone.position.copy(relPos.applyMatrix4(_m.copy(H.parentRel).invert()));
    // 根：转圈 + 跳起
    holder.quaternion.copy(base.quat).multiply(new THREE.Quaternion().setFromAxisAngle(upAxis, pose.root.yaw));
    const off = pose.root.pos.clone().applyQuaternion(S.K).applyQuaternion(holder.quaternion);
    holder.position.copy(base.pos).add(off.multiply(holder.scale));
    // 转圈绕胯部竖轴：把胯的水平位置转回原处
    const hp = I.Hips.P.clone().applyQuaternion(S.K); hp.y = 0;
    const hpRot = hp.clone().applyAxisAngle(upAxis, pose.root.yaw);
    holder.position.add(hp.sub(hpRot).applyQuaternion(base.quat).multiply(holder.scale));
    holder.updateMatrixWorld(true);
    last = pose;
  }
  let last = null;

  /**
   * 把道具挂到骨骼上。offset / axis 按「静止 T 字、角色空间」给（offset 以臂长 A 为单位，相对骨骼原点）：
   * 例：右手荧光棒 attach(stick, 'RightHand', { offset: [-0.2, -0.06, 0], axis: [0, 0.3, 1] }) —— 道具的 +Y 轴对准 axis。
   */
  function attach(obj, boneKey, { offset = [0, 0, 0], axis = [0, 1, 0] } = {}) {
    const inf = I[boneKey]; if (!inf) throw new Error(`没有骨骼 ${boneKey}`);
    const wantPosCan = inf.P.clone().add(v3(offset).multiplyScalar(S.armLen));
    const wantQCan = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), v3(axis).normalize());
    const wantRel = new THREE.Matrix4().compose(wantPosCan.applyQuaternion(S.K), S.K.clone().multiply(wantQCan), new THREE.Vector3(1, 1, 1));
    // 骨骼静止时相对 root 的矩阵
    const boneRel = new THREE.Matrix4().compose(inf.P.clone().applyQuaternion(S.K), S.K.clone().multiply(inf.W), new THREE.Vector3(1, 1, 1));
    // 骨骼世界缩放（例如 FBX 厘米骨架被缩到米）要抵消，道具才保持自己的尺寸
    const ws = new THREE.Vector3(); root.updateMatrixWorld(true); inf.bone.matrixWorld.decompose(new THREE.Vector3(), new THREE.Quaternion(), ws);
    const rs = new THREE.Vector3(); root.matrixWorld.decompose(new THREE.Vector3(), new THREE.Quaternion(), rs);
    const local = boneRel.invert().multiply(wantRel);
    local.decompose(obj.position, obj.quaternion, obj.scale);
    const k = new THREE.Vector3(rs.x / ws.x, rs.y / ws.y, rs.z / ws.z);   // local 是 root 单位，骨骼自带缩放要除掉
    obj.position.multiply(k); obj.scale.copy(k);
    inf.bone.add(obj);
    return obj;
  }

  const dancer = { S, solver, apply, attach, get last() { return last; }, rest() { apply(solver.solve(normalizeSpec({}))); } };
  dancer.check = opts => checkPose(dancer, opts);
  dancer.proxies = measureProxies(dancer);
  if (avoid) solver.setProxies(dancer.proxies);
  if (limits) solver.setLimits(limits);
  dancer.limits = limits;
  return dancer;
}

/** 单独求一个舞步在拍 u 时的姿势（调试 / 自检 / 缩略图用） */
export function poseOf(dancer, move, u, opts = {}) {
  const mv = typeof move === 'string' ? MOVES[move] : move;
  if (mv.isClip) return mv.solve(u, dancer, opts);
  return dancer.solver.solve(normalizeSpec(mv(u, opts), opts));
}

// ============================================================ Mixamo FBX 动作
/**
 * 读 Mixamo 官网下载的 FBX（Without Skin 也行），变成一个可以放进编舞表的舞步。
 *   beats：片段一共多少拍（知道拍数最准）；或 bpm：片段原本的速度；都不给就按 120 BPM。
 *   loop：循环（默认 true）；start：从片段第几秒算第 0 拍（跳过起手）；inPlace：去掉水平位移（默认 true）
 *   ground：较低的那只脚不低于静止脚踝高度（默认 true；源 / 目标腿身比不同时防止脚插地）
 * 返回的 move 在编舞表里按目标拍子伸缩：片段第 k 拍 ↔ 音乐第 k 拍。
 */
export async function loadMixamoMove(url, opts = {}) {
  const { FBXLoader } = await import('../vendor/three/examples/jsm/loaders/FBXLoader.js');
  const src = await new FBXLoader().loadAsync(new URL(url, location.href).href);
  const clip = opts.clip ? src.animations.find(c => c.name === opts.clip) : src.animations[0];
  if (!clip) throw new Error(`${url} 里没有动画片段`);
  return mixamoMove(src, clip, opts);
}

/** 同上，但源骨架 / 片段已经在手里（例如 GLTF 自带的动画，或测试用的合成片段） */
export function mixamoMove(srcRoot, clip, { beats = null, bpm = null, loop = true, start = 0, inPlace = true, ground = true, name = clip.name } = {}) {
  // 源静止姿态：Mixamo FBX 里骨骼节点的默认变换就是 T 字（没有动画时的姿势）
  const S = measureSkeleton(srcRoot);
  const mixer = new THREE.AnimationMixer(srcRoot);
  const action = mixer.clipAction(clip); action.play();
  const dur = clip.duration - start;
  const srcPeriod = beats ? dur / beats : 60 / (bpm || 120);
  const I = S.info;
  const rootInv = new THREE.Matrix4();
  const hips0 = I.Hips.P.clone();

  function sample(clipT) {
    mixer.setTime(clipT);
    srcRoot.updateMatrixWorld(true);
    rootInv.copy(srcRoot.matrixWorld).invert();
    const Acc = {}, out = {};
    const q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3(), m = new THREE.Matrix4();
    let hipsPos = null;
    for (const k of S.order) {
      const inf = I[k];
      m.copy(rootInv).multiply(inf.bone.matrixWorld).decompose(p, q, s);
      const Wc = S.Kinv.clone().multiply(q);                  // 当前朝向（角色空间）
      Acc[k] = Wc.multiply(inf.W.clone().invert());           // A = W · W_rest⁻¹
      out[k] = inf.parentKey ? Acc[inf.parentKey].clone().invert().multiply(Acc[k]) : Acc[k].clone();
      if (k === 'Hips') hipsPos = p.clone().applyQuaternion(S.Kinv);
    }
    return { d: out, hips: hipsPos.sub(hips0) };
  }

  const move = {
    isClip: true, name, clip, duration: dur, srcPeriod, beats: beats ?? dur / srcPeriod,
    /** u = 目标拍数 → 片段时间（按拍伸缩），重定向到 dancer 的骨架 */
    solve(u, dancer, o = {}) {
      let ct = u * srcPeriod;
      ct = loop ? ((ct % dur) + dur) % dur : clamp(ct, 0, dur - 1e-4);
      const smp = sample(start + ct);
      const scale = dancer.S.legLen / S.legLen;
      const hips = smp.hips.multiplyScalar(scale);
      if (inPlace) { hips.x = 0; hips.z = 0; }
      let d = smp.d;
      const intensity = o.intensity ?? 1;
      if (o.mirror) {
        const md = {};
        for (const [k, q] of Object.entries(d)) md[mirrorName(k)] = mirrorQ(q);
        d = md; hips.x = -hips.x;
      }
      if (ground) {   // 两脚里较低的那只不低于静止脚踝高度（源和目标比例不同时胯会偏低，脚就插进地里）
        const { X } = dancer.solver.fk(d, hips), I2 = dancer.S.info;
        const below = Math.max(...['Left', 'Right'].filter(k => I2[k + 'Foot']).map(k => I2[k + 'Foot'].P.y - X[k + 'Foot'].y));
        if (below > 0) hips.y += below;
      }
      const pose = { root: { pos: new THREE.Vector3(), yaw: 0 }, hips, d };
      if (intensity !== 1) return blendSolved(dancer.solver.solve(normalizeSpec({})), pose, intensity);
      return pose;
    },
  };
  return move;
}

// ============================================================ 材质补丁（可叠加：尾巴 / 内衬 / 补色共用）
/**
 * 给材质叠一个着色器补丁：{ key, uniforms, head（顶点前置）, vertex: [[chunk, 追加代码]], fhead（片元前置）, fragment: [[chunk, 追加代码]] }。
 * 同一材质可叠多个补丁；clone() 出来的材质（舞台 bloom 遮挡 pass 会 clone）也带上。
 */
export function addShaderPatch(m, patch) {
  if (!m) return m;
  const list = m.userData.dancePatches || (m.userData.dancePatches = []);
  if (list.some(p => p.key === patch.key)) return m;
  list.push(patch);
  if (!m.userData.dancePatched) {
    m.userData.dancePatched = true;
    m.onBeforeCompile = sh => {
      for (const p of m.userData.dancePatches) {
        Object.assign(sh.uniforms, p.uniforms || {});
        if (p.head) sh.vertexShader = p.head + sh.vertexShader;
        for (const [chunk, add] of p.vertex || []) sh.vertexShader = sh.vertexShader.replace(chunk, chunk + '\n' + add);
        if (p.fhead) sh.fragmentShader = p.fhead + sh.fragmentShader;
        for (const [chunk, add] of p.fragment || []) sh.fragmentShader = sh.fragmentShader.replace(chunk, chunk + '\n' + add);
      }
    };
    m.customProgramCacheKey = () => 'dance|' + m.userData.dancePatches.map(p => p.key).join('|');
    const protoClone = Object.getPrototypeOf(m).clone;
    m.clone = function () {
      const c = protoClone.call(this);
      c.userData = { ...c.userData, dancePatches: [], dancePatched: false };
      for (const p of this.userData.dancePatches) addShaderPatch(c, p);
      return c;
    };
  }
  m.needsUpdate = true;
  return m;
}

// 内衬：背面画成同一块布料的暗色（衣摆、袖口、折进去的地方露的是「里子」，不是乱贴图也不是透明的洞）
const LINING_PATCH = {
  key: 'lining',
  fragment: [
    ['#include <map_fragment>', 'if (!gl_FrontFacing) diffuseColor.rgb *= 0.38;'],
    ['#include <emissivemap_fragment>', 'if (!gl_FrontFacing) totalEmissiveRadiance *= 0.25;'],
  ],
};

// ============================================================ 卡通化
/** 4 阶 toon ramp（DataTexture，Nearest）：暗部抬高，不会死黑 */
export function toonRamp(levels = [0.52, 0.74, 0.9, 1.0]) {
  const data = new Uint8Array(levels.length * 4);
  levels.forEach((v, i) => { const c = Math.round(v * 255); data.set([c, c, c, 255], i * 4); });
  const tex = new THREE.DataTexture(data, levels.length, 1, THREE.RGBAFormat);
  tex.minFilter = tex.magFilter = THREE.NearestFilter; tex.generateMipmaps = false; tex.needsUpdate = true;
  return tex;
}

/**
 * PBR 模型 → 手绘风：MeshToonMaterial（保留颜色贴图，丢掉金属度 / 粗糙度 / 法线的写实高光）+ 蒙皮反壳描边。
 * side: 'lining'（默认）背面 = 暗色里子；'front' 只画正面；'keep' 保留原来的双面贴图。
 * outline.width 以模型高度为单位（0.004 ≈ 1080p 全身镜头下 2–3 像素）。返回 { set('toon'|'pbr'), mode, hulls }。
 */
export function toonify(root, { levels, outline = { color: '#3a2433', width: 0.0035 }, emissive = 0.08, side = 'lining' } = {}) {
  const ramp = toonRamp(levels);
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root, true), H = box.max.y - box.min.y;
  const items = [];
  root.traverse(o => {
    if (!o.isMesh || o.userData.isOutline) return;
    const pbr = o.material;
    // Tripo 的材质是 doubleSided：衣摆、袖口里面和被关节挤得折进去的地方会露出背面（内壁）。
    // side: 'lining'（默认）背面画成暗色里子；'front' 只画正面（背面处变成透明的洞）；'keep' 原样
    for (const m of [pbr].flat()) {
      if (side === 'front') { m.side = THREE.FrontSide; m.needsUpdate = true; }
      if (side === 'lining') { m.side = THREE.DoubleSide; addShaderPatch(m, LINING_PATCH); }
    }
    const toon = [pbr].flat().map(m => {
      const t = new THREE.MeshToonMaterial({ map: m.map ?? null, color: m.color ?? new THREE.Color('#fff'), gradientMap: ramp,
        side: side === 'front' ? THREE.FrontSide : side === 'lining' ? THREE.DoubleSide : m.side, transparent: m.transparent, alphaTest: m.alphaTest, emissiveMap: m.map ?? null,
        emissive: new THREE.Color(emissive, emissive, emissive) });
      if (side === 'lining') addShaderPatch(t, LINING_PATCH);
      return t;
    });
    let hull = null;
    if (outline && o.isSkinnedMesh) {
      // 反壳：蒙皮后的位置沿蒙皮后的法线外扩（objectNormal 在 skinnormal_vertex 之后已经是蒙皮法线）
      const ws = new THREE.Vector3(); o.matrixWorld.decompose(new THREE.Vector3(), new THREE.Quaternion(), ws);
      const w = (outline.width * H) / ws.x;
      const hm = new THREE.MeshBasicMaterial({ color: outline.color, side: THREE.BackSide });
      addShaderPatch(hm, { key: 'outline' + w.toFixed(6), vertex: [['#include <skinning_vertex>', `  transformed += normalize(objectNormal) * ${w.toFixed(6)};`]] });
      hull = new THREE.SkinnedMesh(o.geometry, hm);
      hull.bind(o.skeleton, o.bindMatrix);
      hull.bindMode = o.bindMode;
      hull.userData.isOutline = true;
      hull.frustumCulled = false; hull.castShadow = false; hull.receiveShadow = false;
      items.push({ o, pbr, toon: toon.length === 1 ? toon[0] : toon, hull });
    } else items.push({ o, pbr, toon: toon.length === 1 ? toon[0] : toon, hull: null });
  });
  for (const it of items) if (it.hull) { it.hull.position.copy(it.o.position); it.hull.quaternion.copy(it.o.quaternion); it.hull.scale.copy(it.o.scale); it.o.parent.add(it.hull); }
  const look = {
    mode: 'pbr', items,
    set(mode) {
      look.mode = mode;
      for (const it of items) { it.o.material = mode === 'toon' ? it.toon : it.pbr; if (it.hull) it.hull.visible = mode === 'toon'; }
      return look;
    },
  };
  return look.set('toon');
}

// ============================================================ 自检：穿模 / 反关节
/**
 * 胶囊体代理：每段肢体 = 骨骼线段 + 半径。半径从网格按蒙皮权重测（该段主导的顶点到骨骼线段距离的 60 分位），
 * 所以袖子、短裤的蓬松度都算进去了。头发挂在头骨上，头的半径会偏大（偏保守）。
 */
export function measureProxies(dancer) {
  const S = dancer.S, I = S.info;
  let mesh = null; S.root.traverse(o => { if (o.isSkinnedMesh && !o.userData.isOutline && !mesh) mesh = o; });
  const SEG = {
    torsoLow: ['Hips', 'Spine1'], torsoHigh: ['Spine1', 'Neck'], head: ['Head', 'Head'],
    upperArmL: ['LeftArm', 'LeftForeArm'], foreArmL: ['LeftForeArm', 'LeftHand'], handL: ['LeftHand', 'LeftHand'],
    upperArmR: ['RightArm', 'RightForeArm'], foreArmR: ['RightForeArm', 'RightHand'], handR: ['RightHand', 'RightHand'],
    thighL: ['LeftUpLeg', 'LeftLeg'], shinL: ['LeftLeg', 'LeftFoot'], thighR: ['RightUpLeg', 'RightLeg'], shinR: ['RightLeg', 'RightFoot'],
  };
  const owner = {   // 哪些骨骼的权重归到哪个代理
    torsoLow: ['Hips', 'Spine'], torsoHigh: ['Spine1', 'Spine2'], head: ['Head', 'Neck'],
    upperArmL: ['LeftArm'], foreArmL: ['LeftForeArm'], handL: ['LeftHand'], upperArmR: ['RightArm'], foreArmR: ['RightForeArm'], handR: ['RightHand'],
    thighL: ['LeftUpLeg'], shinL: ['LeftLeg'], thighR: ['RightUpLeg'], shinR: ['RightLeg'],
  };
  const tipOf = { head: 0.12, handL: 0.35, handR: 0.35 };   // 点状段：往骨骼方向延伸（臂长比例）
  const radius = {};
  const segEnds = (k, X, A = null) => {
    const [a, b] = SEG[k]; const pa = X[a].clone(); let pb = X[b].clone();
    if (a === b) {   // 头：往上延伸；手：沿手的方向延伸到指根
      if (k === 'head') {   // 头：胶囊下端从「头骨 + 半径」起（大头、没脖子的猫不会把肩膀算进头里），沿头的朝向往上
        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(A ? A.Head : new THREE.Quaternion()), r = radius.head ?? 0;
        pb = pa.clone().addScaledVector(up, Math.max(S.armLen * 0.55, r * 1.2)); pa.addScaledVector(up, r);
      }
      else { const f = X[a.replace('Hand', 'HandMiddle1')]; pb = f ? f.clone() : pa.clone(); }
    }
    return [pa, pb];
  };
  if (mesh) {
    const g = mesh.geometry, P = g.attributes.position, SI = g.attributes.skinIndex, SW = g.attributes.skinWeight;
    const boneIdx = new Map(mesh.skeleton.bones.map((b, i) => [b, i]));
    const rest = {}; for (const k of S.order) rest[k] = I[k].P;
    const own = {}; for (const [seg, list] of Object.entries(owner)) for (const bn of list) if (I[bn]) own[boneIdx.get(I[bn].bone)] = seg;
    const dists = Object.fromEntries(Object.keys(SEG).map(k => [k, []]));
    const toCan = new THREE.Matrix4().copy(S.root.matrixWorld).invert().multiply(mesh.matrixWorld);
    const v = new THREE.Vector3(), tmp = new THREE.Vector3();
    const ends = Object.fromEntries(Object.keys(SEG).map(k => [k, segEnds(k, rest)]));
    for (let i = 0; i < P.count; i += 3) {
      let best = -1, bw = 0;
      for (let j = 0; j < 4; j++) { const w = SW.getComponent(i, j); if (w > bw) { bw = w; best = SI.getComponent(i, j); } }
      const seg = own[best]; if (!seg || bw < 0.6) continue;
      v.fromBufferAttribute(P, i).applyMatrix4(toCan).applyQuaternion(S.Kinv);
      const [a, b] = ends[seg];
      dists[seg].push(new THREE.Line3(a, b).closestPointToPoint(v, true, tmp).distanceTo(v));
    }
    for (const [k, arr] of Object.entries(dists)) { arr.sort((x, y) => x - y); radius[k] = arr.length ? arr[Math.floor(arr.length * 0.6)] : 0.02; }
  }
  return { SEG, segEnds, radius, tipOf, baseline: null };
}

/** 当前姿势（dancer.last）的问题清单。每条 { kind, a, b, depth }，depth = 穿入深度 / 代理半径和 */
export function checkPose(dancer, { tolerance = 0.25 } = {}) {
  const S = dancer.S, pose = dancer.last; if (!pose) return [];
  if (!dancer.proxies) dancer.proxies = measureProxies(dancer);
  const PX = dancer.proxies;
  const { X, A } = dancer.solver.fk(pose.d, pose.hips);
  const segsOf = (X, A) => Object.fromEntries(Object.keys(PX.SEG).map(k => [k, PX.segEnds(k, X, A)]));
  const seg = segsOf(X, A);
  const segDist = ([p1, q1], [p2, q2]) => {   // 两线段最近距离
    const d1 = q1.clone().sub(p1), d2 = q2.clone().sub(p2), r = p1.clone().sub(p2);
    const a = d1.dot(d1), e = d2.dot(d2), f = d2.dot(r);
    let s, t;
    if (a < 1e-10 && e < 1e-10) return r.length();
    if (a < 1e-10) { s = 0; t = clamp(f / e); }
    else { const c = d1.dot(r); if (e < 1e-10) { t = 0; s = clamp(-c / a); } else {
      const b = d1.dot(d2), den = a * e - b * b; s = den > 1e-10 ? clamp((b * f - c * e) / den) : 0; t = (b * s + f) / e;
      if (t < 0) { t = 0; s = clamp(-c / a); } else if (t > 1) { t = 1; s = clamp((b - c) / a); } } }
    return p1.clone().addScaledVector(d1, s).distanceTo(p2.clone().addScaledVector(d2, t));
  };
  const pairs = [];
  for (const s of ['L', 'R']) {
    for (const part of [`foreArm${s}`, `hand${s}`]) for (const body of ['torsoLow', 'torsoHigh', 'head', `thigh${s}`, `thigh${s === 'L' ? 'R' : 'L'}`]) pairs.push([part, body]);
    pairs.push([`upperArm${s}`, 'head']);
  }
  pairs.push(['handL', 'handR'], ['foreArmL', 'foreArmR'], ['thighL', 'thighR'], ['shinL', 'shinR'], ['handL', 'foreArmR'], ['handR', 'foreArmL']);
  const depthOf = (sg, a, b) => { const rr = (PX.radius[a] || 0) + (PX.radius[b] || 0); return (rr - segDist(sg[a], sg[b])) / rr; };
  if (!PX.baseline) {   // 静止 T 字里就相交的代理对（肩膀贴着头之类）是代理形状的误差，以它为基线
    const R = dancer.solver.fk({}, new THREE.Vector3()), sg = segsOf(R.X, R.A);
    PX.baseline = Object.fromEntries(pairs.map(([a, b]) => [`${a}|${b}`, Math.max(0, depthOf(sg, a, b))]));
  }
  const issues = [];
  for (const [a, b] of pairs) {
    const depth = depthOf(seg, a, b) - PX.baseline[`${a}|${b}`];
    if (depth > tolerance) issues.push({ kind: 'overlap', a, b, depth: +depth.toFixed(2) });
  }
  // 反关节：IK 让肘 / 膝永远朝「解剖上对」的方向折，所以反关节只可能以「上段绕自身轴拧得过头」出现
  // （膝盖朝后 = 大腿拧了 ~180°，肘尖朝前 = 上臂拧了 ~180°）。用 swing-twist 分解量上段相对胯 / 胸的扭转角。
  // 另外：膝盖要在「胯—踝连线」的前方（胯的朝向），弯曲角不超限。
  for (const [key, lb] of Object.entries(dancer.solver.LIMB)) {
    if (!lb) continue;
    const u = X[lb.mid].clone().sub(X[lb.up]).normalize(), l = X[lb.end].clone().sub(X[lb.mid]).normalize();
    const bend = Math.acos(clamp(u.dot(l), -1, 1)) / DEG;
    const par = A[S.info[lb.up].parentKey];
    const rel = par.clone().invert().multiply(A[lb.up]);                        // 上段相对父骨骼（胸 / 胯）的旋转
    const d0 = new THREE.Vector3(1, 0, 0).applyQuaternion(lb.restU);           // 静止骨骼方向
    const t = new THREE.Vector3(rel.x, rel.y, rel.z).projectOnVector(d0);
    const twistQ = new THREE.Quaternion(t.x, t.y, t.z, rel.w).normalize();
    let twist = 2 * Math.atan2(new THREE.Vector3(twistQ.x, twistQ.y, twistQ.z).dot(d0), twistQ.w) / DEG;
    twist = ((twist + 540) % 360) - 180;
    const limit = key.startsWith('arm') ? 110 : 55;
    if (Math.abs(twist) > limit) issues.push({ kind: 'reverse-joint', a: key, depth: +Math.abs(twist).toFixed(0), note: 'twist°' });
    if (key.startsWith('leg') && bend > 8) {
      const hipFwd = new THREE.Vector3(0, 0, 1).applyQuaternion(A.Hips);
      const mid = X[lb.up].clone().add(X[lb.end]).multiplyScalar(0.5);
      if (X[lb.mid].clone().sub(mid).dot(hipFwd) < 0) issues.push({ kind: 'reverse-joint', a: key, depth: +bend.toFixed(0), note: 'knee behind' });
    }
    if (bend > (key.startsWith('arm') ? 150 : 140)) issues.push({ kind: 'over-bend', a: key, depth: +bend.toFixed(0) });
  }
  // 脚穿地（根坐标系 y；静止时脚踝高度）
  for (const s of ['Left', 'Right']) {
    const f = X[`${s}Foot`]; if (!f) continue;
    const y0 = S.info[`${s}Foot`].P.y;
    if (f.y + pose.root.pos.y < y0 - 0.03 * S.legLen) issues.push({ kind: 'foot-below-ground', a: s, depth: +((y0 - f.y) / S.legLen).toFixed(2) });
  }
  return issues;
}

// ============================================================ 尾巴摆动（没有尾巴骨的模型）
/**
 * Tripo 给猫绑的骨架没有尾巴骨，尾巴是一个独立的网格岛，权重还被自动算到了大腿上（跟着一条腿甩）。
 * 这里：① 自动找出尾巴岛（在胯后方、左右居中的最大连通块）；② 把它整体重绑到 Hips（刚性跟着胯）；
 * ③ 按「从尾根出发的测地距离」给每个顶点一个 s ∈ [0,1]；④ 在顶点着色器里（蒙皮之前、绑定空间）
 *    绕尾根转：左右摆 yaw = amp·s·sin(φ − wave·s)（沿尾巴往后传的波，尾尖滞后 = 弹簧感），上翘 pitch = lift·s。
 * toon / PBR / 描边反壳 / 阴影深度材质都打同一个补丁、共享 uniform，所以描边和影子跟着摆。
 *   const tail = tailSway(cat, dancer, { look });   每帧：tail.update(beats, { energy })
 * 找不到尾巴（比如少女）返回 null。
 */
export function tailSway(root, dancer, { look = null, amp = 24, lift = 10, wave = 2.4, minBehind = 0.08 } = {}) {
  const S = dancer.S;
  let mesh = null; root.traverse(o => { if (o.isSkinnedMesh && !o.userData.isOutline && !mesh) mesh = o; });
  if (!mesh) return null;
  const geo = mesh.geometry, P = geo.attributes.position, n = P.count;
  root.updateMatrixWorld(true);
  const toCanM = new THREE.Matrix4().copy(root.matrixWorld).invert().multiply(mesh.matrixWorld);
  const can = new Float32Array(n * 3), v = new THREE.Vector3();
  for (let i = 0; i < n; i++) { v.fromBufferAttribute(P, i).applyMatrix4(toCanM).applyQuaternion(S.Kinv); v.toArray(can, i * 3); }
  // 连通岛（按位置焊接接缝）
  const par = new Int32Array(n).map((_, i) => i);
  const find = i => { while (par[i] !== i) { par[i] = par[par[i]]; i = par[i]; } return i; };
  const unite = (a, b) => { a = find(a); b = find(b); if (a !== b) par[a] = b; };
  const weld = new Map();
  for (let i = 0; i < n; i++) { const k = `${Math.round(P.getX(i) * 1e4)},${Math.round(P.getY(i) * 1e4)},${Math.round(P.getZ(i) * 1e4)}`; if (weld.has(k)) unite(i, weld.get(k)); else weld.set(k, i); }
  const idx = geo.index; const tri = idx ? i => idx.getX(i) : i => i, triCount = idx ? idx.count : n;
  for (let i = 0; i < triCount; i += 3) { unite(tri(i), tri(i + 1)); unite(tri(i), tri(i + 2)); }
  const isl = new Map();
  for (let i = 0; i < n; i++) { const r = find(i); let I = isl.get(r); if (!I) isl.set(r, I = { verts: [], c: new THREE.Vector3() }); I.verts.push(i); I.c.x += can[i * 3]; I.c.y += can[i * 3 + 1]; I.c.z += can[i * 3 + 2]; }
  const hips = S.info.Hips.P, H = S.legLen;
  let best = null;
  for (const I of isl.values()) {
    if (I.verts.length < 100) continue;
    I.c.divideScalar(I.verts.length);
    if (I.c.z < hips.z - minBehind * H * 2 && Math.abs(I.c.x - hips.x) < 0.15 * H && (!best || I.verts.length > best.verts.length)) best = I;
  }
  if (!best) return null;
  // 尾根 = 离 Hips 最近的尾巴顶点；测地距离（沿三角形边的 Dijkstra，O(n²) 对几千顶点够用）
  const inTail = new Uint8Array(n); for (const i of best.verts) inTail[i] = 1;
  const adj = new Map(best.verts.map(i => [i, []]));
  const pt = i => new THREE.Vector3(can[i * 3], can[i * 3 + 1], can[i * 3 + 2]);
  for (let i = 0; i < triCount; i += 3) {
    const t = [tri(i), tri(i + 1), tri(i + 2)]; if (!inTail[t[0]]) continue;
    for (let k = 0; k < 3; k++) { const a = t[k], b = t[(k + 1) % 3], w = pt(a).distanceTo(pt(b)); adj.get(a).push([b, w]); adj.get(b).push([a, w]); }
  }
  const byPos = new Map();
  for (const i of best.verts) { const k = `${Math.round(can[i * 3] * 1e4)},${Math.round(can[i * 3 + 1] * 1e4)},${Math.round(can[i * 3 + 2] * 1e4)}`; if (byPos.has(k)) { adj.get(i).push([byPos.get(k), 0]); adj.get(byPos.get(k)).push([i, 0]); } else byPos.set(k, i); }
  let root0 = best.verts[0], bd = Infinity;
  for (const i of best.verts) { const d = pt(i).distanceTo(hips); if (d < bd) { bd = d; root0 = i; } }
  const dist = new Map(best.verts.map(i => [i, Infinity])); dist.set(root0, 0);
  const done = new Set();
  for (;;) {
    let u = -1, du = Infinity;
    for (const [i, d] of dist) if (!done.has(i) && d < du) { du = d; u = i; }
    if (u < 0) break; done.add(u);
    for (const [w, len] of adj.get(u)) if (du + len < dist.get(w)) dist.set(w, du + len);
  }
  let dmax = 0; for (const d of dist.values()) if (d < Infinity) dmax = Math.max(dmax, d);
  const aTail = new Float32Array(n).fill(-1);
  for (const i of best.verts) aTail[i] = Math.min(1, (dist.get(i) === Infinity ? dmax : dist.get(i)) / dmax);
  geo.setAttribute('aTail', new THREE.BufferAttribute(aTail, 1));
  // 重绑到 Hips
  const hipsIdx = mesh.skeleton.bones.indexOf(S.info.Hips.bone);
  const SI = geo.attributes.skinIndex, SW = geo.attributes.skinWeight;
  for (const i of best.verts) { SI.setXYZW(i, hipsIdx, 0, 0, 0); SW.setXYZW(i, 1, 0, 0, 0); }
  SI.needsUpdate = SW.needsUpdate = true;
  // 绑定空间里的尾根和两根轴（角色 Y = 左右摆，角色 X = 上翘）
  const toGeoQ = new THREE.Quaternion(); toCanM.clone().invert().decompose(new THREE.Vector3(), toGeoQ, new THREE.Vector3());
  const toGeoDir = d => d.clone().applyQuaternion(S.K).applyQuaternion(toGeoQ).normalize();
  const U = {
    uTailPivot: { value: new THREE.Vector3().fromBufferAttribute(P, root0) },
    uTailAxisA: { value: toGeoDir(new THREE.Vector3(0, 1, 0)) }, uTailAxisB: { value: toGeoDir(new THREE.Vector3(1, 0, 0)) },
    uTailYaw: { value: 0 }, uTailPitch: { value: 0 }, uTailPhase: { value: 0 }, uTailWave: { value: wave },
  };
  const HEAD = /* glsl */`
attribute float aTail;
uniform vec3 uTailPivot, uTailAxisA, uTailAxisB; uniform float uTailYaw, uTailPitch, uTailPhase, uTailWave;
vec3 tailRotA(vec3 v, vec3 a, float g) { float c = cos(g), s = sin(g); return v * c + cross(a, v) * s + a * dot(a, v) * (1.0 - c); }
vec3 tailRot(vec3 v) {
  if (aTail < 0.0) return v;
  float s = aTail, sw = s * s * (3.0 - 2.0 * s);
  float yaw = uTailYaw * sw * sin(uTailPhase - uTailWave * s);
  float pitch = uTailPitch * sw * (0.75 + 0.25 * sin(2.0 * uTailPhase - uTailWave * s));
  return tailRotA(tailRotA(v, uTailAxisB, pitch), uTailAxisA, yaw);
}
`;
  const TAIL_PATCH = {
    key: 'tail', uniforms: U, head: HEAD,
    vertex: [['#include <beginnormal_vertex>', '  objectNormal = tailRot(objectNormal);'],
      ['#include <begin_vertex>', '  transformed = uTailPivot + tailRot(transformed - uTailPivot);']],
  };
  const patch = m => addShaderPatch(m, TAIL_PATCH);
  root.traverse(o => { if (o.isMesh) [o.material].flat().forEach(patch); });
  if (look) for (const it of look.items) { [it.toon, it.pbr].flat().forEach(patch); if (it.hull) patch(it.hull.material); }
  const depth = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking }); patch(depth);
  mesh.customDepthMaterial = depth;
  // CPU 版同一套变形（抽样顶点），给自检用：尾巴 vs 腿的胶囊
  const pivotCan = pt(root0);
  const samples = best.verts.filter((_, k) => k % 12 === 0).map(i => ({ c: pt(i), s: aTail[i] }));
  const rotA = (v, a, g) => v.applyAxisAngle(a, g);
  const AX = new THREE.Vector3(0, 1, 0), BX = new THREE.Vector3(1, 0, 0);
  function tailPoints(pose) {
    const { X, A } = dancer.solver.fk(pose.d, pose.hips);
    const ph = U.uTailPhase.value, yawA = U.uTailYaw.value, pitA = U.uTailPitch.value;
    return samples.map(({ c, s: sv }) => {
      const sw = sv * sv * (3 - 2 * sv);
      const yaw = yawA * sw * Math.sin(ph - wave * sv), pitch = pitA * sw * (0.75 + 0.25 * Math.sin(2 * ph - wave * sv));
      const v = rotA(rotA(c.clone().sub(pivotCan), BX, pitch), AX, yaw).add(pivotCan);
      return X.Hips.clone().add(v.sub(S.info.Hips.P).applyQuaternion(A.Hips));
    });
  }
  return {
    mesh, verts: best.verts.length, uniforms: U, tailPoints, patch,
    /** 尾巴抽样点是否插进腿（大腿 / 小腿胶囊）或地面以下。返回 [{ kind, a, depth }] */
    check() {
      const pose = dancer.last; if (!pose) return [];
      const PX = dancer.proxies, { X, A } = dancer.solver.fk(pose.d, pose.hips), out = {};
      const pts = tailPoints(pose), line = new THREE.Line3(), c = new THREE.Vector3();
      for (const leg of ['thighL', 'thighR', 'shinL', 'shinR']) {
        const [a, b] = PX.segEnds(leg, X, A), r = PX.radius[leg];
        for (const p of pts) { const d = line.set(a, b).closestPointToPoint(p, true, c).distanceTo(p); const depth = (r * 0.85 - d) / r; if (depth > 0 && (!out[leg] || depth > out[leg])) out[leg] = depth; }
      }
      const res = Object.entries(out).map(([leg, depth]) => ({ kind: 'tail-overlap', a: 'tail', b: leg, depth: +depth.toFixed(2) }));
      const minY = Math.min(...pts.map(p => p.y)) + pose.root.pos.y;
      if (minY < -0.01 * S.legLen) res.push({ kind: 'tail-below-ground', a: 'tail', depth: +(-minY / S.legLen).toFixed(3) });
      return res;
    },
    /** beats = 连续拍数；每两拍左右摆一个来回。蹲下（胯下沉）时自动上翘，免得尾尖戳进地里 */
    update(beats, { energy = 1 } = {}) {
      const hy = dancer.last ? dancer.last.hips.y / S.legLen : 0;
      U.uTailPhase.value = Math.PI * beats;
      U.uTailYaw.value = amp * DEG * energy;
      U.uTailPitch.value = (lift + 60 * clamp(-hy / 0.25)) * DEG;
    },
  };
}

// ============================================================ 蒙皮权重平滑（Tripo 自动权重在腋下 / 肩 / 胯 / 膝太「硬」）
/** 关节附近的平滑范围（以网格高度为单位） */
export const SMOOTH_JOINTS = {
  LeftArm: 0.11, RightArm: 0.11, LeftShoulder: 0.07, RightShoulder: 0.07,
  LeftForeArm: 0.06, RightForeArm: 0.06,
  LeftUpLeg: 0.11, RightUpLeg: 0.11, LeftLeg: 0.07, RightLeg: 0.07, Spine2: 0.06, Hips: 0.08,
};

/**
 * 按网格拓扑做 Laplacian 平滑：w ← (1 − λ·m)·w + λ·m·邻居平均，m = 到最近关节的衰减（只动关节附近）。
 * 邻居 = 三角形的边 + 同位置焊接点 + 「跨网格岛的近邻」（cross·H 以内、属于别的连通块的顶点：
 * 袖子贴着躯干、裤腰贴着肚子时让两层权重趋同，一起动，不互相穿插）。尾巴岛不参与。
 * 平滑后每个顶点保留最大的 4 个权重并归一化，就地写回 geometry（不改原 GLB 文件）。
 * 返回 { nodes, masked, changed }（changed = 平均每顶点权重变化量 L1）。
 */
export function smoothSkinWeights(mesh, root, { iterations = 8, lambda = 0.6, joints = SMOOTH_JOINTS, cross = 0.012, excludeTail = true } = {}) {
  root.updateMatrixWorld(true);
  const geo = mesh.geometry, P = geo.attributes.position, SI = geo.attributes.skinIndex, SW = geo.attributes.skinWeight, n = P.count;
  const bones = mesh.skeleton.bones, NB = bones.length;
  geo.computeBoundingBox(); const H = geo.boundingBox.max.y - geo.boundingBox.min.y;
  // 焊接：同位置 → 一个节点
  const node = new Int32Array(n), rep = [], key = new Map();
  for (let i = 0; i < n; i++) {
    const k = `${Math.round(P.getX(i) * 1e5)},${Math.round(P.getY(i) * 1e5)},${Math.round(P.getZ(i) * 1e5)}`;
    let id = key.get(k); if (id === undefined) { id = rep.length; rep.push(i); key.set(k, id); } node[i] = id;
  }
  const N = rep.length;
  const idx = geo.index, tri = idx ? i => idx.getX(i) : i => i, tc = idx ? idx.count : n;
  const nb = Array.from({ length: N }, () => new Set());
  const par = new Int32Array(N).map((_, i) => i), find = i => { while (par[i] !== i) { par[i] = par[par[i]]; i = par[i]; } return i; };
  for (let i = 0; i < tc; i += 3) {
    const a = node[tri(i)], b = node[tri(i + 1)], c = node[tri(i + 2)];
    nb[a].add(b); nb[a].add(c); nb[b].add(a); nb[b].add(c); nb[c].add(a); nb[c].add(b);
    par[find(a)] = find(b); par[find(b)] = find(c);
  }
  const island = Int32Array.from({ length: N }, (_, i) => find(i));
  // 尾巴岛（在胯后方的独立连通块）排除
  const excluded = new Uint8Array(N);
  let tailIsland = -1;
  if (excludeTail) {
    const S = measureSkeleton(root), K = S.Kinv, toCan = new THREE.Matrix4().copy(root.matrixWorld).invert().multiply(mesh.matrixWorld);
    const acc = new Map(), v = new THREE.Vector3();
    for (let j = 0; j < N; j++) { v.fromBufferAttribute(P, rep[j]).applyMatrix4(toCan).applyQuaternion(K); const a = acc.get(island[j]) || { n: 0, z: 0, x: 0 }; a.n++; a.z += v.z; a.x += v.x; acc.set(island[j], a); }
    let best = null;
    for (const [id, a] of acc) { if (a.n < 100) continue; const z = a.z / a.n, x = a.x / a.n;
      if (z < S.info.Hips.P.z - 0.16 * S.legLen && Math.abs(x - S.info.Hips.P.x) < 0.15 * S.legLen && (!best || a.n > best.n)) best = { id, n: a.n }; }
    if (best) { tailIsland = best.id; for (let j = 0; j < N; j++) if (island[j] === tailIsland) excluded[j] = 1; }
  }
  // 关节位置（绑定空间）与衰减 mask
  const inv = mesh.bindMatrixInverse, jp = [];
  for (const [name, r] of Object.entries(joints)) {
    const b = bones.find(x => canonicalName(x.name) === name); if (!b) continue;
    jp.push([new THREE.Vector3().setFromMatrixPosition(b.matrixWorld).applyMatrix4(inv), r * H]);
  }
  const mask = new Float32Array(N), pos = new Float32Array(N * 3), v = new THREE.Vector3();
  let masked = 0;
  for (let j = 0; j < N; j++) {
    v.fromBufferAttribute(P, rep[j]); v.toArray(pos, j * 3);
    if (excluded[j]) continue;
    let m = 0; for (const [c, r] of jp) m = Math.max(m, smooth(1 - v.distanceTo(c) / r));
    mask[j] = m; if (m > 0) masked++;
  }
  // 跨岛近邻（空间哈希）
  if (cross > 0) {
    const cell = cross * H, grid = new Map(), ck = (x, y, z) => `${x},${y},${z}`;
    for (let j = 0; j < N; j++) { if (excluded[j]) continue; const k = ck(Math.floor(pos[j * 3] / cell), Math.floor(pos[j * 3 + 1] / cell), Math.floor(pos[j * 3 + 2] / cell)); let l = grid.get(k); if (!l) grid.set(k, l = []); l.push(j); }
    for (let j = 0; j < N; j++) {
      if (!mask[j]) continue;
      const cx = Math.floor(pos[j * 3] / cell), cy = Math.floor(pos[j * 3 + 1] / cell), cz = Math.floor(pos[j * 3 + 2] / cell);
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
        const l = grid.get(ck(cx + dx, cy + dy, cz + dz)); if (!l) continue;
        for (const o of l) if (island[o] !== island[j]) {
          const d2 = (pos[o * 3] - pos[j * 3]) ** 2 + (pos[o * 3 + 1] - pos[j * 3 + 1]) ** 2 + (pos[o * 3 + 2] - pos[j * 3 + 2]) ** 2;
          if (d2 < cell * cell) { nb[j].add(o); if (mask[o]) nb[o].add(j); }
        }
      }
    }
  }
  // 稠密权重（节点 × 骨骼）
  let w = new Float32Array(N * NB), w2 = new Float32Array(N * NB);
  for (let j = 0; j < N; j++) { const i = rep[j]; for (let c = 0; c < 4; c++) w[j * NB + SI.getComponent(i, c)] += SW.getComponent(i, c); }
  const nbArr = nb.map(x => Int32Array.from(x));
  for (let it = 0; it < iterations; it++) {
    w2.set(w);
    for (let j = 0; j < N; j++) {
      const m = mask[j] * lambda, list = nbArr[j]; if (!m || !list.length) continue;
      const o = j * NB, k = m / list.length;
      for (let b = 0; b < NB; b++) w2[o + b] = w[o + b] * (1 - m);
      for (const q of list) { if (excluded[q]) continue; const oq = q * NB; for (let b = 0; b < NB; b++) w2[o + b] += w[oq + b] * k; }
      // 排除的邻居（尾巴）那一份补回自己
      let ex = 0; for (const q of list) if (excluded[q]) ex++; if (ex) for (let b = 0; b < NB; b++) w2[o + b] += w[o + b] * k * ex;
    }
    [w, w2] = [w2, w];
  }
  // 写回：每个顶点 top-4，归一化
  let changed = 0;
  const top = new Array(4);
  for (let i = 0; i < n; i++) {
    const j = node[i]; if (!mask[j]) continue;
    const o = j * NB;
    for (let c = 0; c < 4; c++) top[c] = [-1, 0];
    for (let b = 0; b < NB; b++) { const x = w[o + b]; if (x > top[3][1]) { top[3] = [b, x]; top.sort((a, c) => c[1] - a[1]); } }
    const sum = top.reduce((a, t) => a + t[1], 0) || 1;
    let before = 0; for (let c = 0; c < 4; c++) before += Math.abs(SW.getComponent(i, c));
    const old = new Map(); for (let c = 0; c < 4; c++) old.set(SI.getComponent(i, c), (old.get(SI.getComponent(i, c)) || 0) + SW.getComponent(i, c));
    for (let c = 0; c < 4; c++) { SI.setComponent(i, c, Math.max(0, top[c][0])); SW.setComponent(i, c, top[c][1] / sum); }
    let d = 0; const seen = new Set();
    for (let c = 0; c < 4; c++) { const b = top[c][0]; if (b < 0) continue; seen.add(b); d += Math.abs(top[c][1] / sum - (old.get(b) || 0)); }
    for (const [b, x] of old) if (!seen.has(b)) d += x;
    changed += d;
  }
  SI.needsUpdate = SW.needsUpdate = true;
  return { nodes: N, masked, changed: +(changed / Math.max(1, masked)).toFixed(3), tailExcluded: tailIsland >= 0 };
}

/** 猫的关节限位（cat-check 扫出来的安全范围，见 dance-demo/CAT-CLIPPING.md） */
export const CAT_LIMITS = { armDownMin: 20, armUpMax: 155, crossMax: 0.45, hipsDropMax: 0.25 };

/**
 * 猫的一站式修补（加载 GLB 后、createDancer 之前 / 之后按顺序调）：
 *   const fixes = prepareCat(model);                  // 权重平滑（要在 createDancer 之前：它不改静止姿态，但 dancer 自检的代理半径按权重测）
 *   const dancer = createDancer(model, { limits: CAT_LIMITS });
 *   const look = toonify(model);                       // 默认 side: 'lining'
 *   const tail = tailSway(model, dancer, { look });    // 尾巴重绑到 Hips（要在 recolor 之前：裤子那一遍按大腿权重找区域）
 *   finishCat(model, look);                            // 异色块修补（卫衣胸口 / 裤子）
 */
export function prepareCat(model) {
  let mesh = null; model.traverse(o => { if (o.isSkinnedMesh && !mesh) mesh = o; });
  return { mesh, smooth: smoothSkinWeights(mesh, model) };
}
export function finishCat(model, look) {
  let mesh = null; model.traverse(o => { if (o.isSkinnedMesh && !o.userData.isOutline && !mesh) mesh = o; });
  return CAT_RECOLOR.map(o => recolorOutliers(mesh, { looks: look, ...o }));
}

// ============================================================ 被遮挡处的乱贴图：重新补色
/**
 * Tripo 是多视角生成贴图再投到网格上的：生成时被手臂 / 手挡住的地方（躯干两侧、腋下、手插兜处的裤子）没有真实颜色，
 * 只有一团乱纹理；T 字或举手时这些地方就露出来了。这里：
 *   ① 用舞蹈库把角色摆成「手臂贴身下垂、袖子贴着躯干」（接近生成时的姿势），CPU 蒙皮得到顶点位置；
 *      这个姿势里手会插进裤子，所以主导骨骼是手（excludeBones）的顶点只当遮挡物、不参与判定（袖子内侧照常判定：那正是乱贴图的重灾区）；
 *   ② 从水平一圈 azimuths 个方向（模仿生成器的环拍机位）做 CPU 深度光栅化；
 *   ③ 「乱贴图」= 至少有一个机位正对着它（|n·v| ≥ facing），但在所有正对它的机位里都被别的东西挡住。
 *      只是掠射角看不清的地方（肩顶、鞋底）不算。这些顶点（外扩 dilate 圈吃掉边缘）的颜色 = 周围可信顶点颜色的调和插值；
 *   ④ 结果存成顶点属性 aFix（线性 rgb + 混合权重），材质补丁在片元里 mix 进去。不改贴图、不改 GLB。
 * 返回 { hidden, filled, views }。纯函数：同一个模型每次结果一样。
 */
export function cleanHiddenTexture(mesh, root, dancer, {
  res = 512, elevations = [0], azimuths = 8, facing = 0.3, dilate = 1, iterations = 300, eps = 0.006, minCluster = 60, fill = 'mode', ring = [3, 10], looks = null,
  pose = { handL: { pos: [0.16, -0.97, 0.06], pole: [0.2, -0.2, -1] }, handR: { pos: [-0.16, -0.97, 0.06], pole: [-0.2, -0.2, -1] } },
  excludeBones = /Hand/, dominance = 0.45,
} = {}) {
  const geo = mesh.geometry, P = geo.attributes.position, UV = geo.attributes.uv, n = P.count;
  const map = [mesh.material].flat()[0].map;
  if (!map?.image || !UV) return null;
  const S = dancer.S;
  // ① 摆「手臂下垂」，CPU 蒙皮
  const prev = dancer.last;
  dancer.apply(dancer.solver.solve(normalizeSpec(pose)));
  root.updateMatrixWorld(true); mesh.skeleton.update?.();
  const toCan = new THREE.Matrix4().copy(root.matrixWorld).invert().multiply(mesh.matrixWorld);
  const X = new Float32Array(n * 3), v = new THREE.Vector3();
  for (let i = 0; i < n; i++) { mesh.getVertexPosition(i, v); v.applyMatrix4(toCan).applyQuaternion(S.Kinv); v.toArray(X, i * 3); }
  if (prev) dancer.apply(prev); else dancer.rest();
  const idx = geo.index, tri = idx ? i => idx.getX(i) : i => i, tc = idx ? idx.count : n;
  // 顶点法线（蒙皮后，按面积加权）
  const N = new Float32Array(n * 3), a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), fnm = new THREE.Vector3();
  for (let t = 0; t < tc; t += 3) {
    const i0 = tri(t), i1 = tri(t + 1), i2 = tri(t + 2);
    a.fromArray(X, i0 * 3); b.fromArray(X, i1 * 3); c.fromArray(X, i2 * 3);
    fnm.subVectors(c, b).cross(a.clone().sub(b));
    for (const i of [i0, i1, i2]) { N[i * 3] += fnm.x; N[i * 3 + 1] += fnm.y; N[i * 3 + 2] += fnm.z; }
  }
  for (let i = 0; i < n; i++) { v.fromArray(N, i * 3).normalize(); v.toArray(N, i * 3); }
  // ② 多方向深度光栅化
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (let i = 0; i < n; i++) { minX = Math.min(minX, X[i * 3]); maxX = Math.max(maxX, X[i * 3]); minY = Math.min(minY, X[i * 3 + 1]); maxY = Math.max(maxY, X[i * 3 + 1]); minZ = Math.min(minZ, X[i * 3 + 2]); maxZ = Math.max(maxZ, X[i * 3 + 2]); }
  const center = new THREE.Vector3((minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2);
  const span = Math.hypot(maxX - minX, maxY - minY, maxZ - minZ), E = eps * span;
  const seen = new Float32Array(n), faced = new Uint8Array(n);
  const dirs = [];
  for (const el of elevations) for (let k = 0; k < azimuths; k++) {
    const az = (k / azimuths) * Math.PI * 2, e = el * DEG;
    dirs.push(new THREE.Vector3(Math.sin(az) * Math.cos(e), -Math.sin(e), Math.cos(az) * Math.cos(e)).negate());   // 视线方向（从相机指向模型）
  }
  const zb = new Float32Array(res * res), px = new Float32Array(n * 3), stats = [];
  for (const d of dirs) {
    let nSeen = 0, nFront = 0;
    const f = d.clone().normalize(), up0 = Math.abs(f.y) > 0.95 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0);
    const r = new THREE.Vector3().crossVectors(f, up0).normalize(), u = new THREE.Vector3().crossVectors(r, f);
    for (let i = 0; i < n; i++) {
      v.fromArray(X, i * 3).sub(center);
      px[i * 3] = (v.dot(r) / span + 0.5) * (res - 1); px[i * 3 + 1] = (v.dot(u) / span + 0.5) * (res - 1); px[i * 3 + 2] = v.dot(f);
    }
    zb.fill(Infinity);
    for (let t = 0; t < tc; t += 3) {
      const i0 = tri(t) * 3, i1 = tri(t + 1) * 3, i2 = tri(t + 2) * 3;
      const x0 = px[i0], y0 = px[i0 + 1], x1 = px[i1], y1 = px[i1 + 1], x2 = px[i2], y2 = px[i2 + 1];
      const area = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0); if (Math.abs(area) < 1e-9) continue;
      const bx0 = Math.max(0, Math.floor(Math.min(x0, x1, x2))), bx1 = Math.min(res - 1, Math.ceil(Math.max(x0, x1, x2)));
      const by0 = Math.max(0, Math.floor(Math.min(y0, y1, y2))), by1 = Math.min(res - 1, Math.ceil(Math.max(y0, y1, y2)));
      for (let y = by0; y <= by1; y++) for (let x = bx0; x <= bx1; x++) {
        const w0 = ((x1 - x) * (y2 - y) - (x2 - x) * (y1 - y)) / area, w1 = ((x2 - x) * (y0 - y) - (x0 - x) * (y2 - y)) / area, w2 = 1 - w0 - w1;
        if (w0 < -1e-6 || w1 < -1e-6 || w2 < -1e-6) continue;
        const z = w0 * px[i0 + 2] + w1 * px[i1 + 2] + w2 * px[i2 + 2], k = y * res + x;
        if (z < zb[k]) zb[k] = z;
      }
    }
    for (let i = 0; i < n; i++) {
      const fac = Math.abs(N[i * 3] * f.x + N[i * 3 + 1] * f.y + N[i * 3 + 2] * f.z);   // Tripo 网格三角形绕向不统一 → 不看正反，只看是否最前面
      if (fac < facing) continue;
      const x = Math.round(px[i * 3]), y = Math.round(px[i * 3 + 1]);
      let zmin = Infinity;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < res && yy < res) zmin = Math.min(zmin, zb[yy * res + xx]); }
      nFront++; faced[i] = 1;
      if (px[i * 3 + 2] <= zmin + E) { seen[i] = Math.max(seen[i], fac); nSeen++; }
    }
    stats.push([nFront, nSeen]);
  }
  // 焊接 + 邻接
  const node = new Int32Array(n), rep = [], key = new Map();
  for (let i = 0; i < n; i++) { const k = `${Math.round(P.getX(i) * 1e5)},${Math.round(P.getY(i) * 1e5)},${Math.round(P.getZ(i) * 1e5)}`; let id = key.get(k); if (id === undefined) { id = rep.length; rep.push(i); key.set(k, id); } node[i] = id; }
  const M = rep.length, nb = Array.from({ length: M }, () => new Set());
  for (let t = 0; t < tc; t += 3) { const p = node[tri(t)], q = node[tri(t + 1)], w = node[tri(t + 2)]; nb[p].add(q); nb[p].add(w); nb[q].add(p); nb[q].add(w); nb[w].add(p); nb[w].add(q); }
  const nbA = nb.map(x => Int32Array.from(x));
  const vis = new Float32Array(M), fac = new Uint8Array(M);
  for (let i = 0; i < n; i++) { vis[node[i]] = Math.max(vis[node[i]], seen[i]); fac[node[i]] |= faced[i]; }
  let hidden = new Uint8Array(M); for (let j = 0; j < M; j++) hidden[j] = fac[j] && vis[j] === 0 ? 1 : 0;
  { const SI = geo.attributes.skinIndex, SW = geo.attributes.skinWeight, bn = mesh.skeleton.bones.map(b => canonicalName(b.name));
    for (let j = 0; j < M; j++) { if (!hidden[j]) continue; const i = rep[j]; let bb = 0, bw = -1;
      for (let c = 0; c < 4; c++) { const w = SW.getComponent(i, c); if (w > bw) { bw = w; bb = SI.getComponent(i, c); } }
      if (excludeBones.test(bn[bb])) hidden[j] = 0; } }
  // 小团（遮挡边缘的一条线、零星点）不算：只保留 ≥ minCluster 个节点的连通块
  { const lab = new Int32Array(M).fill(-1), stack = [];
    for (let j = 0; j < M; j++) {
      if (!hidden[j] || lab[j] >= 0) continue;
      const comp = []; stack.push(j); lab[j] = j;
      while (stack.length) { const x = stack.pop(); comp.push(x); for (const q of nbA[x]) if (hidden[q] && lab[q] < 0) { lab[q] = j; stack.push(q); } }
      if (comp.length < minCluster) for (const x of comp) hidden[x] = 0;
    } }
  const core = hidden.slice();
  for (let k = 0; k < dilate; k++) { const h2 = hidden.slice(); for (let j = 0; j < M; j++) if (hidden[j]) for (const q of nbA[j]) h2[q] = 1; hidden = h2; }
  // ③ 贴图取色（按 uv 采样；glTF 贴图 flipY = false → v 向下）
  const img = map.image, W = Math.min(1024, img.width), H = Math.min(1024, img.height);
  const cv = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(W, H) : Object.assign(document.createElement('canvas'), { width: W, height: H });
  const g = cv.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0, W, H);
  const pix = g.getImageData(0, 0, W, H).data, flip = map.flipY;
  const col = new Float32Array(M * 3);
  for (let j = 0; j < M; j++) {
    const i = rep[j]; let uu = UV.getX(i), vv = UV.getY(i); uu -= Math.floor(uu); vv -= Math.floor(vv); if (flip) vv = 1 - vv;
    const o = (Math.min(H - 1, Math.floor(vv * H)) * W + Math.min(W - 1, Math.floor(uu * W))) * 4;
    for (let k = 0; k < 3; k++) { const s = pix[o + k] / 255; col[j * 3 + k] = s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; }
  }
  let cur;
  const harmonicOn = comp => {
    const set = new Set(comp);
    for (let it = 0; it < iterations; it++) for (const j of comp) {
      const L = nbA[j]; if (!L.length) continue;
      let r = 0, gg = 0, bb = 0; for (const q of L) { r += cur[q * 3]; gg += cur[q * 3 + 1]; bb += cur[q * 3 + 2]; }
      cur[j * 3] = r / L.length; cur[j * 3 + 1] = gg / L.length; cur[j * 3 + 2] = bb / L.length;
    }
  };
  if (fill === 'harmonic') {   // 调和补色：hidden 顶点反复取邻居平均，看得见的顶点固定
    cur = col.slice(); let nxt = col.slice();
    for (let it = 0; it < iterations; it++) {
      for (let j = 0; j < M; j++) {
        if (!hidden[j]) continue;
        const L = nbA[j]; if (!L.length) continue;
        let r = 0, gg = 0, bb = 0; for (const q of L) { r += cur[q * 3]; gg += cur[q * 3 + 1]; bb += cur[q * 3 + 2]; }
        nxt[j * 3] = r / L.length; nxt[j * 3 + 1] = gg / L.length; nxt[j * 3 + 2] = bb / L.length;
      }
      [cur, nxt] = [nxt, cur];
    }
  } else {   // 众数补色：每个乱贴图块往外走 ring[0]..ring[1] 圈（紧贴边缘的一两圈常常也是乱的），取出现最多的颜色（量化分箱）平涂
    cur = col.slice();
    const lab = new Int32Array(M).fill(-1);
    for (let j = 0; j < M; j++) {
      if (!hidden[j] || lab[j] >= 0) continue;
      const comp = [j]; lab[j] = j;
      for (let k = 0; k < comp.length; k++) for (const q of nbA[comp[k]]) if (hidden[q] && lab[q] < 0) { lab[q] = j; comp.push(q); }
      const depth = new Map(); let front = [];
      for (const x of comp) for (const q of nbA[x]) if (!hidden[q] && !depth.has(q)) { depth.set(q, 1); front.push(q); }
      const bins = new Map();
      for (let d = 1; d <= ring[1] && front.length; d++) {
        const next = [];
        for (const x of front) {
          if (d >= ring[0]) {
            const sr = c => Math.round((c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055) * 15);
            const k = `${sr(col[x * 3])},${sr(col[x * 3 + 1])},${sr(col[x * 3 + 2])}`;
            const bn = bins.get(k) || { n: 0, r: 0, g: 0, b: 0 }; bn.n++; bn.r += col[x * 3]; bn.g += col[x * 3 + 1]; bn.b += col[x * 3 + 2]; bins.set(k, bn);
          }
          for (const q of nbA[x]) if (!hidden[q] && !depth.has(q)) { depth.set(q, d + 1); next.push(q); }
        }
        front = next;
      }
      let best = null, tot = 0; for (const bn of bins.values()) { tot += bn.n; if (!best || bn.n > best.n) best = bn; }
      if (best && best.n >= dominance * tot) for (const x of comp) { cur[x * 3] = best.r / best.n; cur[x * 3 + 1] = best.g / best.n; cur[x * 3 + 2] = best.b / best.n; }
      else harmonicOn(comp);   // 周围没有明显的主色（比如肚皮和衣摆交界）→ 就地调和插值
    }
  }
  const fix = new Float32Array(n * 4);
  let filled = 0;
  for (let i = 0; i < n; i++) {
    const j = node[i];
    if (!hidden[j]) continue;
    filled++;
    fix.set([cur[j * 3], cur[j * 3 + 1], cur[j * 3 + 2], core[j] ? 1 : 0.7], i * 4);
  }
  geo.setAttribute('aFix', new THREE.BufferAttribute(fix, 4));
  applyFixPatch(mesh, looks);
  return { hidden: filled, core: core.reduce((s, x) => s + x, 0), nodes: M, views: dirs.length, stats, bbox: [minX, maxX, minY, maxY, minZ, maxZ].map(x => +x.toFixed(3)) };
}

function applyFixPatch(mesh, looks) {
  const PATCH = {
    key: 'hidden-fix',
    head: 'attribute vec4 aFix;\nvarying vec4 vFix;\n',
    vertex: [['#include <begin_vertex>', '  vFix = aFix;']],
    fhead: 'varying vec4 vFix;\n',
    fragment: [['#include <map_fragment>', '  diffuseColor.rgb = mix(diffuseColor.rgb, vFix.rgb, vFix.a);'],
      ['#include <emissivemap_fragment>', '  totalEmissiveRadiance = mix(totalEmissiveRadiance, vFix.rgb * emissive, vFix.a);']],
  };
  const mats = new Set([mesh.material].flat());
  for (const L of looks ? [looks].flat() : []) for (const it of L.items) if (it.o === mesh) { [it.toon, it.pbr].flat().forEach(m => mats.add(m)); }
  for (const m of mats) addShaderPatch(m, PATCH);
}

/** 网格拓扑工具：焊接节点、邻接、每节点 sRGB→线性颜色（按 uv 采样主贴图） */
function meshTopo(mesh) {
  const geo = mesh.geometry, P = geo.attributes.position, UV = geo.attributes.uv, n = P.count;
  const node = new Int32Array(n), rep = [], key = new Map();
  for (let i = 0; i < n; i++) { const k = `${Math.round(P.getX(i) * 1e5)},${Math.round(P.getY(i) * 1e5)},${Math.round(P.getZ(i) * 1e5)}`; let id = key.get(k); if (id === undefined) { id = rep.length; rep.push(i); key.set(k, id); } node[i] = id; }
  const M = rep.length, nb = Array.from({ length: M }, () => new Set());
  const idx = geo.index, tri = idx ? i => idx.getX(i) : i => i, tc = idx ? idx.count : n;
  for (let t = 0; t < tc; t += 3) { const p = node[tri(t)], q = node[tri(t + 1)], w = node[tri(t + 2)]; nb[p].add(q); nb[p].add(w); nb[q].add(p); nb[q].add(w); nb[w].add(p); nb[w].add(q); }
  const map = [mesh.material].flat()[0].map, img = map.image, W = Math.min(1024, img.width), H = Math.min(1024, img.height);
  const cv = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(W, H) : Object.assign(document.createElement('canvas'), { width: W, height: H });
  const g = cv.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0, W, H);
  const pix = g.getImageData(0, 0, W, H).data, col = new Float32Array(M * 3), srgb = new Float32Array(M * 3);
  for (let j = 0; j < M; j++) {
    const i = rep[j]; let uu = UV.getX(i), vv = UV.getY(i); uu -= Math.floor(uu); vv -= Math.floor(vv); if (map.flipY) vv = 1 - vv;
    const o = (Math.min(H - 1, Math.floor(vv * H)) * W + Math.min(W - 1, Math.floor(uu * W))) * 4;
    for (let k = 0; k < 3; k++) { const x = pix[o + k] / 255; srgb[j * 3 + k] = x; col[j * 3 + k] = x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }
  }
  return { node, rep, M, nb: nb.map(x => Int32Array.from(x)), col, srgb };
}

/**
 * 衣服上的「异色块」重新上色：Tripo 有时在正面可见的地方也画错（比如卫衣胸口两侧画成毛色 + 蓝色内衣，原设计是整件卫衣）。
 * 在 bones 匹配的骨骼主导的区域（默认卫衣：Spine1 / Spine2 / 锁骨）里，调色板 = 参考区域（默认同一件衣服的袖子）出现最多的 palette 种颜色（量化分箱），
 * 离所有这些颜色都远（sRGB 距离 > threshold）的顶点 = 异色；去掉小于 minCluster 的零星点，外扩 1 圈，用区域主色平涂。
 * 写进和 cleanHiddenTexture 同一个 aFix 属性（两者可叠加）。返回 { region, outliers, palette }。
 */
export function recolorOutliers(mesh, { bones = /^(Spine1|Spine2|LeftShoulder|RightShoulder)$/, palette = 2, threshold = 0.28, minCluster = 40, dominant = 0.5, minIsland = 800, skinBones = /^Head$/,
  reference = /^(LeftArm|RightArm|LeftForeArm|RightForeArm)$/, where = null, looks = null } = {}) {
  const geo = mesh.geometry, n = geo.attributes.position.count;
  const T = meshTopo(mesh), { node, rep, M, nb, col, srgb } = T;
  const SI = geo.attributes.skinIndex, SW = geo.attributes.skinWeight, bn = mesh.skeleton.bones.map(b => canonicalName(b.name));
  const inRegion = new Uint8Array(M);
  // 连通岛：小岛（胸口的闪电徽章这类贴片）不动
  const par = Int32Array.from({ length: M }, (_, i) => i), find = i => { while (par[i] !== i) { par[i] = par[par[i]]; i = par[i]; } return i; };
  for (let j = 0; j < M; j++) for (const q of nb[j]) { const a = find(j), b = find(q); if (a !== b) par[a] = b; }
  const isz = new Map(); for (let j = 0; j < M; j++) { const r = find(j); isz.set(r, (isz.get(r) || 0) + 1); }
  const domW = (j, re) => { const i = rep[j]; let w = 0; for (let c = 0; c < 4; c++) if (re.test(bn[SI.getComponent(i, c)])) w += SW.getComponent(i, c); return w; };
  // where(p, hips)：再按位置筛（绑定空间，hips = Hips 骨骼在绑定空间的位置），比如只要背后
  const hipsB = new THREE.Vector3().setFromMatrixPosition(mesh.skeleton.bones.find(b => canonicalName(b.name) === 'Hips').matrixWorld).applyMatrix4(mesh.bindMatrixInverse);
  const Pp = geo.attributes.position, pv = new THREE.Vector3();
  for (let j = 0; j < M; j++) if (domW(j, bones) >= dominant && isz.get(find(j)) >= minIsland && (!where || where(pv.fromBufferAttribute(Pp, rep[j]), hipsB))) inRegion[j] = 1;
  // 毛色（头部出现最多的颜色）：衣服区域里的毛色不算「衣服的颜色」
  const skinBins = new Map();
  for (let j = 0; j < M; j++) if (domW(j, skinBones) >= 0.9) { const k = [0, 1, 2].map(c => Math.round(srgb[j * 3 + c] * 7)).join(','); const b = skinBins.get(k) || { n: 0, c: [0, 0, 0] }; b.n++; for (let c = 0; c < 3; c++) b.c[c] += srgb[j * 3 + c]; skinBins.set(k, b); }
  const skinTop = [...skinBins.values()].sort((a, b) => b.n - a.n)[0], fur = skinTop ? skinTop.c.map(x => x / skinTop.n) : null;
  const bins = new Map();
  // 调色板取自「参考区域」（默认袖子：同一件衣服、没被乱画）；没有参考区域就用本区域自己
  const inRef = new Uint8Array(M); let nRef = 0;
  if (reference) for (let j = 0; j < M; j++) if (domW(j, reference) >= dominant && isz.get(find(j)) >= minIsland) { inRef[j] = 1; nRef++; }
  const palSrc = nRef > 100 ? inRef : inRegion;
  for (let j = 0; j < M; j++) { if (!palSrc[j]) continue; const k = [0, 1, 2].map(c => Math.round(srgb[j * 3 + c] * 7)).join(','); const b = bins.get(k) || { n: 0, c: [0, 0, 0], l: [0, 0, 0] }; b.n++; for (let c = 0; c < 3; c++) { b.c[c] += srgb[j * 3 + c]; b.l[c] += col[j * 3 + c]; } bins.set(k, b); }
  const pal = [...bins.values()].sort((a, b) => b.n - a.n).map(b => ({ s: b.c.map(x => x / b.n), l: b.l.map(x => x / b.n), n: b.n }))
    .filter(p => !fur || Math.hypot(p.s[0] - fur[0], p.s[1] - fur[1], p.s[2] - fur[2]) > threshold).slice(0, palette);
  const dist = (j, p) => Math.hypot(srgb[j * 3] - p.s[0], srgb[j * 3 + 1] - p.s[1], srgb[j * 3 + 2] - p.s[2]);
  let out = new Uint8Array(M);
  for (let j = 0; j < M; j++) if (inRegion[j] && pal.every(p => dist(j, p) > threshold)) out[j] = 1;
  { const lab = new Int32Array(M).fill(-1);
    for (let j = 0; j < M; j++) { if (!out[j] || lab[j] >= 0) continue; const comp = [j]; lab[j] = j;
      for (let k = 0; k < comp.length; k++) for (const q of nb[comp[k]]) if (out[q] && lab[q] < 0) { lab[q] = j; comp.push(q); }
      if (comp.length < minCluster) for (const x of comp) out[x] = 0; } }
  const core = out.slice();
  for (let j = 0; j < M; j++) if (core[j]) for (const q of nb[j]) if (inRegion[q]) out[q] = 1;
  // 平涂色 = 本区域里（非异色）最多顶点贴近的那个调色板颜色（燕尾服猫袖子是粉的、身子是青的 → 选青）
  const votes = pal.map(() => 0);
  for (let j = 0; j < M; j++) if (inRegion[j] && !core[j]) { let bi = -1, bd = threshold; pal.forEach((p, k) => { const d = dist(j, p); if (d < bd) { bd = d; bi = k; } }); if (bi >= 0) votes[bi]++; }
  const fill = pal[votes.indexOf(Math.max(...votes))].l;
  let A = geo.attributes.aFix; if (!A) { A = new THREE.BufferAttribute(new Float32Array(n * 4), 4); geo.setAttribute('aFix', A); }
  let cnt = 0;
  for (let i = 0; i < n; i++) { const j = node[i]; if (!out[j]) continue; cnt++; A.setXYZW(i, fill[0], fill[1], fill[2], core[j] ? 1 : 0.6); }
  A.needsUpdate = true;
  applyFixPatch(mesh, looks);
  const hex = c => '#' + c.map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
  return { region: inRegion.reduce((a, x) => a + x, 0), outliers: core.reduce((a, x) => a + x, 0), vertices: cnt, palette: pal.map(p => hex(p.s)), fur: fur && hex(fur) };
}

/** 猫（Tripo 卫衣 + 运动裤）用的三遍异色块修补：卫衣胸口 / 两侧（调色板取袖子），裤子大腿（调色板取小腿），卫衣背后 */
export const CAT_RECOLOR = [
  { bones: /^(Spine1|Spine2|LeftShoulder|RightShoulder)$/, reference: /^(LeftArm|RightArm|LeftForeArm|RightForeArm)$/ },
  { bones: /^(LeftUpLeg|RightUpLeg)$/, reference: /^(LeftLeg|RightLeg)$/ },
  // 背后卫衣下摆以上（Spine 主导，只取胯后方、下摆以上；前面露出的肚皮不动）
  { bones: /^(Spine|Spine1|Spine2)$/, reference: /^(LeftArm|RightArm|LeftForeArm|RightForeArm)$/, where: (p, h) => p.z < h.z - 0.03 && p.y > h.y + 0.06 },
];

/** 把手写的 spec（左右 / 强度 / 镜像）展开成 solver.solve 能直接吃的形式（自检页、扫描页用） */
export const normalizeSpecExport = (spec, o) => normalizeSpec(spec, o);

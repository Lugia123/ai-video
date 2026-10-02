// kits/world.js — 程序化世界（W3）。
//
// 每个工厂返回 { group|mesh, update(t, params) }：给我 t 和参数，我把画面摆好；不自己跑时钟。
// 画面是 (t, params) 的纯函数：同一组输入调两次结果一样，乱序调用也一样。随机只用种子 PRNG。
//
//   createCity(opts)        城市的一生：蓝图线稿逐笔画出 → 白模逐层挤出 → 夜城点灯
//                           update(t, { draw, extrude, light })        三个进度都是 0..1
//   createVoxelGround(opts) 体素方块地面：常驻起伏 + 冲击波 + 塌成引力井
//                           update(t, { amp, speed, pulses:[{t0,amp}], well, glow })
//   createRingTunnel(opts)  同心环隧道（相机放在原点朝 -z 看）
//                           update(t, { travel | speed, bend, spin, pulse })
//   createPaperclips(opts)  上万回形针雪崩（InstancedMesh）
//                           update(t, { t0, dur, height, radius, targets? })
//   createGpuField(opts)    十万 GPU 方块田野，LED 麦浪（全在着色器里算）
//                           update(t, { speed, gust, bright })
//   createShoggoth(opts)    紫色线团网络 + 笑脸面具 + 扫描线烧掉面具
//                           update(t, { writhe, mask, scan })
//   createEye(opts)         程序化巨眼：层层眼睑线、旋转电路虹膜、瞳孔缩放、火花
//                           update(t, { open, pupil, look:[x,y], spin, sparks, glow })
//
// 配色取自 engine/palette.js：ink #0A0A10 底，pink #FF2E88 / mint #5FE3C0 / lemon #F4E04D，paper #F2EDE4。
// 发光部分输出 >1 的线性值，交给 bloom；没有 bloom 时也不会过曝成一片。

import * as THREE from 'three';

import { PALETTE } from '../engine/palette.js';

// 全片配色取 engine/palette.js；purple 只给 shoggoth 线团用
export const PAL = { ...PALETTE, purple: '#9B5CFF' };

// ---------------------------------------------------------------- 小工具
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let q = a;
    q = Math.imul(q ^ (q >>> 15), q | 1);
    q ^= q + Math.imul(q ^ (q >>> 7), q | 61);
    return ((q ^ (q >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const smooth = p => { p = clamp(p); return p * p * (3 - 2 * p); };
const eOut3 = p => 1 - (1 - clamp(p)) ** 3;
const col = hex => new THREE.Color(hex);
const addC = (c, o, k) => { c.r += o.r * k; c.g += o.g * k; c.b += o.b * k; return c; };

// GLSL 公共片段：哈希、值噪声
const GLSL_COMMON = /* glsl */`
float hash11(float p){ p = fract(p*0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float hash21(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash21(i), hash21(i+vec2(1,0)), u.x), mix(hash21(i+vec2(0,1)), hash21(i+vec2(1,1)), u.x), u.y); }
`;

// ================================================================ 城市
/**
 * opts: seed=7, n=17（地块格数，奇数）, lot=1, floorH=0.16
 * update(t, { draw, extrude, light })
 *   draw    0..1 蓝图：先画街道网格，再一栋栋描地块轮廓（多支笔同时画，笔尖是亮点，拐角打粉点）
 *   extrude 0..1 白模逐层挤出（由中心向外），正在长的那一层顶上有一道薄荷扫描带
 *   light   0..1 点灯：立面变墨色，窗户一格格亮（暖白为主，少量柠黄/粉/薄荷），街道流光
 * 返回 { group, update, size, buildings }
 */
export function createCity({ seed = 7, n = 17, lot = 1, floorH = 0.16 } = {}) {
  const rnd = mulberry32(seed);
  const group = new THREE.Group();
  const half = (n * lot) / 2;
  const isRoad = k => k % 4 === 0;
  const c0 = (n - 1) / 2;

  // --- 地块与楼
  const bld = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if (isRoad(i) || isRoad(j)) continue;
    const x = (i - c0) * lot, z = (j - c0) * lot;
    const r = Math.hypot(x, z) / half;
    if (r > 1.02 || rnd() < 0.06) continue;
    const w = lot * lerp(0.62, 0.86, rnd()), d = lot * lerp(0.62, 0.86, rnd());
    const tall = Math.exp(-r * r * 2.2);
    let h = lerp(0.35, 1.2, rnd() ** 1.5) + tall * lerp(1.2, 4.6, rnd() ** 2);
    const tier = rnd() < 0.3 + tall * 0.4 ? lerp(0.25, 1.4, rnd()) * (0.5 + tall) : 0;
    h = Math.max(floorH * 2, Math.round(h / floorH) * floorH);
    bld.push({ x, z, w, d, h1: h, h2: Math.round(tier / floorH) * floorH, tw: lerp(0.45, 0.7, rnd()),
      r, seed: rnd(), hue: rnd(), delay: 0 });
  }
  // 挤出顺序：由中心向外 + 一点随机
  bld.forEach(b => { b.delay = clamp(b.r * 0.72 + rnd() * 0.12, 0, 0.84); b.ldelay = clamp(b.r * 0.5 + rnd() * 0.35, 0, 0.8); });

  // --- 蓝图线：街道 → 地块
  const segs = []; // {a:[x,z], b:[x,z], s, e, kind}
  const roadLines = [];
  for (let k = 0; k <= n; k += 4) {
    const p = (k - c0) * lot;
    roadLines.push([[-half, p], [half, p]], [[p, -half], [p, half]]);
  }
  roadLines.forEach((l, idx) => {
    const s = (idx / roadLines.length) * 0.22;
    segs.push({ a: l[0], b: l[1], s, e: s + 0.14, kind: 0 });
  });
  const order = bld.map((b, i) => i).sort((a, b) => bld[a].delay - bld[b].delay);
  order.forEach((bi, k) => {
    const b = bld[bi];
    const s = 0.28 + (k / order.length) * 0.6, dur = 0.1;
    const x0 = b.x - b.w / 2, x1 = b.x + b.w / 2, z0 = b.z - b.d / 2, z1 = b.z + b.d / 2;
    const pts = [[x0, z0], [x1, z0], [x1, z1], [x0, z1], [x0, z0]];
    for (let q = 0; q < 4; q++) segs.push({ a: pts[q], b: pts[q + 1], s: s + dur * q / 4, e: s + dur * (q + 1) / 4, kind: 1 });
  });
  const segGeo = new THREE.BufferGeometry();
  const segPos = new Float32Array(segs.length * 6);
  const segCol = new Float32Array(segs.length * 6);
  segGeo.setAttribute('position', new THREE.BufferAttribute(segPos, 3));
  segGeo.setAttribute('color', new THREE.BufferAttribute(segCol, 3));
  const segMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false });
  const segLines = new THREE.LineSegments(segGeo, segMat);
  segLines.renderOrder = 2;
  group.add(segLines);

  // 笔尖 + 拐角粉点
  const dotGeo = new THREE.BufferGeometry();
  const dotMax = segs.length + 8;
  const dotPos = new Float32Array(dotMax * 3), dotCol = new Float32Array(dotMax * 3), dotSize = new Float32Array(dotMax);
  dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPos, 3));
  dotGeo.setAttribute('color', new THREE.BufferAttribute(dotCol, 3));
  dotGeo.setAttribute('size', new THREE.BufferAttribute(dotSize, 1));
  const dots = new THREE.Points(dotGeo, pointsMaterial());
  dots.renderOrder = 3;
  group.add(dots);

  // 细网格地面（蓝图纸）
  const gridMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uA: { value: 0 }, uLight: { value: 0 }, uHalf: { value: half }, uMint: { value: col(PAL.mint) }, uInk: { value: col(0x101018) } },
    vertexShader: `varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `uniform float uA, uLight, uHalf; uniform vec3 uMint, uInk; varying vec2 vP;
      float gl(vec2 p, float s, float w){ vec2 g = abs(fract(p/s - 0.5) - 0.5)*s; vec2 fw = fwidth(p)*w; vec2 l = 1.0 - smoothstep(vec2(0.), fw, g); return max(l.x, l.y); }
      void main(){
        float r = length(vP)/uHalf;
        float fine = gl(vP, 0.25, 1.0)*0.18 + gl(vP, 1.0, 1.2)*0.35;
        float fade = 1.0 - smoothstep(0.85, 1.45, r);
        vec3 c = uMint * fine * uA * (1.0 - 0.75*uLight);
        float a = clamp(fine*uA*fade*(1.0-0.6*uLight), 0., 1.);
        gl_FragColor = vec4(c*fade, a);
      }`,
  });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(half * 3.2, half * 3.2), gridMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.002;
  ground.renderOrder = 1;
  group.add(ground);

  // --- 楼：base + tier 两段，一段一个实例
  const boxes = [];
  bld.forEach((b, i) => {
    boxes.push({ b, tier: 0 });
    if (b.h2 > 0) boxes.push({ b, tier: 1 });
  });
  const boxGeo = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
  const aSeed = new Float32Array(boxes.length * 2);
  const aTop = new Float32Array(boxes.length * 2); // x: 当前可见顶高(世界 y)  y: 正在长(0/1)
  boxes.forEach((bx, k) => { aSeed[k * 2] = bx.b.seed * 97 + bx.tier * 13.1; aSeed[k * 2 + 1] = bx.b.ldelay; });
  boxGeo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(aSeed, 2));
  const aTopAttr = new THREE.InstancedBufferAttribute(aTop, 2);
  aTopAttr.setUsage(THREE.DynamicDrawUsage);
  boxGeo.setAttribute('aTop', aTopAttr);
  const bMat = new THREE.ShaderMaterial({
    uniforms: {
      uLight: { value: 0 }, uFloor: { value: floorH },
      uPaper: { value: col(PAL.paper) }, uFacade: { value: col(0x23232f) },
      uWarm: { value: col(0xFFD9A0) }, uLemon: { value: col(PAL.lemon) }, uPink: { value: col(PAL.pink) }, uMint: { value: col(PAL.mint) },
    },
    vertexShader: /* glsl */`
      attribute vec2 aSeed; attribute vec2 aTop;
      varying vec3 vW; varying vec3 vN; varying vec2 vSeed; varying vec2 vTop;
      void main(){
        vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
        vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vSeed = aSeed; vTop = aTop;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */`
      ${GLSL_COMMON}
      uniform float uLight, uFloor; uniform vec3 uPaper, uFacade, uWarm, uLemon, uPink, uMint;
      varying vec3 vW; varying vec3 vN; varying vec2 vSeed; varying vec2 vTop;
      void main(){
        vec3 n = normalize(vN);
        float dif = 0.5 + 0.5*max(dot(n, normalize(vec3(0.55, 0.8, 0.35))), 0.0) + 0.12*n.x;
        float ao = mix(0.62, 1.0, smoothstep(0.0, 0.9, vW.y));
        vec3 white = uPaper * dif * ao * 0.92;
        // 点灯进度（本楼）
        float lb = clamp((uLight - vSeed.y) / 0.35, 0.0, 1.0);
        vec3 facade = uFacade * (0.55 + 0.45*dif) * mix(0.55, 1.1, smoothstep(0.0, 4.0, vW.y)) + uPink * 0.015 * max(n.x, 0.0) + uMint * 0.02 * max(-n.z, 0.0);
        vec3 c = mix(white, facade, smoothstep(0.0, 0.5, uLight*1.6));
        // 窗
        if (abs(n.y) < 0.5) {
          float u = abs(n.x) > 0.5 ? vW.z : vW.x;
          vec2 g = vec2(u / 0.13, vW.y / uFloor);
          vec2 cell = floor(g), f = fract(g);
          float inWin = step(0.22, f.x)*step(f.x, 0.78)*step(0.28, f.y)*step(f.y, 0.78);
          float h = hash21(cell + vSeed.x*1.7 + n.xz*31.0);
          float lit = step(h, lb*0.5) * step(0.3, vW.y);
          float hc = hash21(cell*1.31 + vSeed.x);
          vec3 wc = hc < 0.62 ? uWarm : hc < 0.8 ? uLemon : hc < 0.9 ? uPink : uMint;
          float flick = 0.85 + 0.15*hash21(cell + 7.0);
          c += wc * inWin * lit * 1.7 * flick;
          // 白模阶段：窗洞浅浅刻一下，看得出楼层
          c -= vec3(0.10) * inWin * (1.0 - smoothstep(0.0, 0.4, uLight));
        } else {
          // 楼顶：点灯后一圈霓虹边
          c = mix(c, c*0.8, uLight);
        }
        // 正在长的那一层：薄荷扫描带
        float band = smoothstep(uFloor*0.7, 0.0, vTop.x - vW.y) * vTop.y * step(0.5, 1.0 - n.y);
        c = mix(c, uMint * 1.25, band * 0.8);
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  const bMesh = new THREE.InstancedMesh(boxGeo, bMat, boxes.length);
  bMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  bMesh.frustumCulled = false;
  group.add(bMesh);

  // 楼的边线（白模阶段是墨线，点灯后变成淡霓虹）
  const edgeGeo = new THREE.BufferGeometry();
  const edgePos = new Float32Array(boxes.length * 24 * 3);
  const edgeCol = new Float32Array(boxes.length * 24 * 3);
  edgeGeo.setAttribute('position', new THREE.BufferAttribute(edgePos, 3));
  edgeGeo.setAttribute('color', new THREE.BufferAttribute(edgeCol, 3));
  const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true }));
  edges.frustumCulled = false;
  group.add(edges);

  // 街道流光（点灯后才出现）
  const cars = 360;
  const carGeo = new THREE.BufferGeometry();
  const carPos = new Float32Array(cars * 3), carCol = new Float32Array(cars * 3), carSize = new Float32Array(cars);
  carGeo.setAttribute('position', new THREE.BufferAttribute(carPos, 3));
  carGeo.setAttribute('color', new THREE.BufferAttribute(carCol, 3));
  carGeo.setAttribute('size', new THREE.BufferAttribute(carSize, 1));
  const carPts = new THREE.Points(carGeo, pointsMaterial());
  group.add(carPts);
  const carDef = [];
  for (let k = 0; k < cars; k++) {
    const l = roadLines[Math.floor(rnd() * roadLines.length)];
    carDef.push({ l, off: rnd(), v: lerp(0.04, 0.12, rnd()) * (rnd() < 0.5 ? -1 : 1), lane: (rnd() - 0.5) * 0.3, c: rnd() < 0.55 ? PAL.lemon : rnd() < 0.5 ? PAL.pink : 0xFFFFFF });
  }

  const m4 = new THREE.Matrix4(), tmpC = new THREE.Color();
  const cWhite = col(PAL.paper), cPink = col(PAL.pink), cMint = col(PAL.mint), cInk = col(0x2a2a38), cLemon = col(PAL.lemon);

  function update(t, { draw = 1, extrude = 0, light = 0 } = {}) {
    // 蓝图线
    const bpFade = 1 - 0.55 * smooth(light * 1.5);
    let nd = 0;
    const ex = smooth(extrude * 3); // 挤出开始后蓝图退成暗线
    for (let k = 0; k < segs.length; k++) {
      const s = segs[k];
      const p = clamp((draw - s.s) / (s.e - s.s));
      const bx = lerp(s.a[0], s.b[0], p), bz = lerp(s.a[1], s.b[1], p);
      segPos.set([s.a[0], 0.005, s.a[1], bx, 0.005, bz], k * 6);
      const base = s.kind === 0 ? cMint : cWhite;
      const lum = (s.kind === 0 ? 1.1 : 1.9) * bpFade * (1 - 0.6 * ex);
      tmpC.copy(base).multiplyScalar(p > 0 ? lum : 0);
      if (s.kind === 0 && light > 0) tmpC.lerp(cPink, 0).multiplyScalar(1);
      for (let q = 0; q < 2; q++) segCol.set([tmpC.r, tmpC.g, tmpC.b], k * 6 + q * 3);
      // 笔尖 / 拐角点
      if (p > 0 && p < 1) {
        dotPos.set([bx, 0.01, bz], nd * 3); dotCol.set([2.4, 2.4, 2.4], nd * 3); dotSize[nd] = 9; nd++;
      } else if (p >= 1 && s.kind === 1 && ex < 1) {
        const a = (1 - ex) * bpFade;
        dotPos.set([s.b[0], 0.01, s.b[1]], nd * 3); dotCol.set([cPink.r * 1.6 * a, cPink.g * 1.6 * a, cPink.b * 1.6 * a], nd * 3); dotSize[nd] = 5; nd++;
      }
    }
    dotGeo.setDrawRange(0, nd);
    for (const a of ['position', 'color', 'size']) dotGeo.attributes[a].needsUpdate = true;
    segGeo.attributes.position.needsUpdate = segGeo.attributes.color.needsUpdate = true;
    gridMat.uniforms.uA.value = smooth(draw * 4);
    gridMat.uniforms.uLight.value = light;

    // 楼
    let ei = 0;
    const edgeAlpha = smooth(extrude * 4);
    for (let k = 0; k < boxes.length; k++) {
      const { b, tier } = boxes[k];
      const H = b.h1 + b.h2;
      const p = clamp((extrude - b.delay) / 0.16);
      const floors = Math.round(H / floorH);
      const q = p * floors;
      const fl = Math.floor(q);
      const hv = Math.min(H, floorH * (fl + eOut3((q - fl) * 2.5)));
      const growing = p > 0 && p < 1 ? 1 : 0;
      let y0, hh, w, d;
      if (tier === 0) { y0 = 0; hh = Math.min(hv, b.h1); w = b.w; d = b.d; }
      else { y0 = b.h1; hh = clamp(hv - b.h1, 0, b.h2); w = b.w * b.tw; d = b.d * b.tw; }
      const vis = hh > 1e-4;
      if (vis) m4.makeScale(w, hh, d).setPosition(b.x, y0, b.z); else m4.makeScale(0, 0, 0);
      bMesh.setMatrixAt(k, m4);
      aTop[k * 2] = y0 + hh; aTop[k * 2 + 1] = growing && vis ? 1 : 0;
      // 边线
      const x0 = b.x - w / 2, x1 = b.x + w / 2, z0 = b.z - d / 2, z1 = b.z + d / 2, ya = y0, yb = y0 + (vis ? hh : 0);
      const E = [
        [x0, ya, z0, x1, ya, z0], [x1, ya, z0, x1, ya, z1], [x1, ya, z1, x0, ya, z1], [x0, ya, z1, x0, ya, z0],
        [x0, yb, z0, x1, yb, z0], [x1, yb, z0, x1, yb, z1], [x1, yb, z1, x0, yb, z1], [x0, yb, z1, x0, yb, z0],
        [x0, ya, z0, x0, yb, z0], [x1, ya, z0, x1, yb, z0], [x1, ya, z1, x1, yb, z1], [x0, ya, z1, x0, yb, z1],
      ];
      const lb = clamp((light - b.ldelay) / 0.35);
      // 白模：墨线；点灯：楼顶霓虹（粉/薄荷/柠黄轮换），竖线暗掉
      const neon = b.hue < 0.45 ? cPink : b.hue < 0.8 ? cMint : cLemon;
      for (let e = 0; e < 12; e++) {
        edgePos.set(E[e], ei * 6);
        const top = e >= 4 && e < 8;
        if (!vis) tmpC.setRGB(0, 0, 0);
        else {
          tmpC.copy(cInk).multiplyScalar(edgeAlpha * (1 - smooth(light * 2)));
          if (top) addC(tmpC, neon, 1.5 * lb);
          else if (e >= 8) addC(tmpC, neon, 0.18 * lb);
          if (growing && top) addC(tmpC, cMint, 1.2);
        }
        edgeCol.set([tmpC.r, tmpC.g, tmpC.b, tmpC.r, tmpC.g, tmpC.b], ei * 6);
        ei++;
      }
    }
    bMesh.instanceMatrix.needsUpdate = true;
    aTopAttr.needsUpdate = true;
    edgeGeo.attributes.position.needsUpdate = edgeGeo.attributes.color.needsUpdate = true;
    // 白模阶段边线是墨色（normal blending）；点灯后是发光线 —— 用 additive 会把墨线吃掉，所以两段各自处理
    edges.material.blending = light > 0.02 ? THREE.AdditiveBlending : THREE.NormalBlending;
    bMat.uniforms.uLight.value = light;

    // 流光
    const la = smooth((light - 0.25) / 0.5);
    for (let k = 0; k < cars; k++) {
      const c = carDef[k];
      const u = ((c.off + t * c.v) % 1 + 1) % 1;
      const [[ax, az], [bx2, bz2]] = c.l;
      const horiz = az === bz2;
      const x = lerp(ax, bx2, u) + (horiz ? 0 : c.lane), z = lerp(az, bz2, u) + (horiz ? c.lane : 0);
      const fade = 1 - smooth((Math.hypot(x, z) / half - 0.85) / 0.3);
      carPos.set([x, 0.03, z], k * 3);
      tmpC.set(c.c).multiplyScalar(1.8 * la * fade);
      carCol.set([tmpC.r, tmpC.g, tmpC.b], k * 3);
      carSize[k] = 4;
    }
    for (const a of ['position', 'color', 'size']) carGeo.attributes[a].needsUpdate = true;
    carPts.visible = la > 0;
  }

  update(0, {});
  return { group, update, size: half * 2, buildings: bld };
}

// 点精灵材质：每点自带颜色和像素尺寸，圆形软边，加色混合
export function pointsMaterial({ additive = true, sizeScale = 1 } = {}) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    uniforms: { uScale: { value: sizeScale } },
    vertexShader: /* glsl */`
      attribute float size; attribute vec3 color; varying vec3 vC; uniform float uScale;
      void main(){ vC = color; vec4 mv = modelViewMatrix*vec4(position,1.); gl_Position = projectionMatrix*mv;
        gl_PointSize = size * uScale * (projectionMatrix[1][1] > 0.0 ? 1.0 : 1.0); }`,
    fragmentShader: /* glsl */`
      varying vec3 vC; void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d)*2.0; if (r > 1.0) discard;
        float a = smoothstep(1.0, 0.2, r); gl_FragColor = vec4(vC*a, a); }`,
  });
}

// ================================================================ 体素地面
/**
 * opts: n=56（每边方块数）, gap=0.08, seed=3
 * update(t, { amp=0.35, speed=1.6, pulses=[{t0, amp=2.2, speed=9}], well=0, glow=1, center=[0,0] })
 *   amp/speed  常驻同心起伏（bass 驱动）
 *   pulses     冲击波（最多 4 个）：t0 起从中心扩散的一圈方块被掀起
 *   well       0..1 中心塌成引力井：方块旋着往中心、往下掉，越近越小
 */
export function createVoxelGround({ n = 56, gap = 0.08, seed = 3 } = {}) {
  const count = n * n;
  const geo = new THREE.BoxGeometry(1 - gap, 1, 1 - gap).translate(0, -0.5, 0);
  const grid = new Float32Array(count * 3);
  const rnd = mulberry32(seed);
  for (let i = 0, k = 0; i < n; i++) for (let j = 0; j < n; j++, k++) {
    grid[k * 3] = i - (n - 1) / 2; grid[k * 3 + 1] = j - (n - 1) / 2; grid[k * 3 + 2] = rnd();
  }
  geo.setAttribute('aGrid', new THREE.InstancedBufferAttribute(grid, 3));
  const uniforms = {
    uT: { value: 0 }, uAmp: { value: 0.35 }, uSpeed: { value: 1.6 }, uWell: { value: 0 }, uGlow: { value: 1 },
    uCenter: { value: new THREE.Vector2() }, uHalf: { value: n / 2 },
    uPulse: { value: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()] }, // age, amp, speed
    uInk: { value: col(0x1e1e2c) }, uPink: { value: col(PAL.pink) }, uMint: { value: col(PAL.mint) }, uLemon: { value: col(PAL.lemon) },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */`
      attribute vec3 aGrid;
      uniform float uT, uAmp, uSpeed, uWell, uHalf; uniform vec2 uCenter; uniform vec3 uPulse[4];
      varying vec3 vN; varying vec2 vUv; varying float vH; varying float vR; varying float vRand; varying float vDepth;
      void main(){
        vec2 c = aGrid.xy - uCenter;
        float r = length(c);
        float h = uAmp * sin(r*0.55 - uT*uSpeed) * exp(-r*0.035);
        for (int i = 0; i < 4; i++){
          vec3 P = uPulse[i];
          if (P.y > 0.0 && P.x >= 0.0){
            float d = r - P.x*P.z;
            h += P.y * exp(-d*d*0.08) * exp(-P.x*0.3);
          }
        }
        // 引力井：旋向中心、下坠、缩小
        float pull = smoothstep(0.0, 1.0, uWell * 1.5 - r/(uHalf*0.7));
        float ang = uWell * 2.6 / (r*0.25 + 1.0) * pull;
        float rr = r * (1.0 - 0.55*pull);
        float a0 = atan(c.y, c.x) + ang;
        vec2 pc = rr * vec2(cos(a0), sin(a0));
        float sink = uWell * 70.0 / (r*0.7 + 2.5) * pull;
        float s = 1.0 - smoothstep(0.35, 1.0, pull) * 0.85;
        vec3 p = position;
        p.xz *= s;
        // 方块本身沿井壁倾斜
        float tilt = pull * 0.9;
        vec2 dir = r > 0.001 ? c / r : vec2(1.0, 0.0);
        p.y += dot(p.xz, dir) * tilt;
        vec3 wp = vec3(pc.x, h - sink, pc.y) + vec3(p.x, p.y * (1.0 + abs(h)*0.0), p.z);
        vN = normal; vUv = uv; vH = h - sink*0.3; vR = r / uHalf; vRand = aGrid.z; vDepth = sink;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(wp, 1.0);
      }`,
    fragmentShader: /* glsl */`
      uniform float uGlow; uniform vec3 uInk, uPink, uMint, uLemon;
      varying vec3 vN; varying vec2 vUv; varying float vH; varying float vR; varying float vRand; varying float vDepth;
      void main(){
        vec3 n = normalize(vN);
        float dif = 0.45 + 0.55*max(dot(n, normalize(vec3(0.4, 0.9, 0.25))), 0.0);
        vec3 base = uInk * dif * (1.3 + 0.5*vRand);
        float e = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
        float edge = 1.0 - smoothstep(0.02, 0.07, e);
        float up = clamp(vH, 0.0, 3.0);
        vec3 hc = mix(uMint, uPink, smoothstep(0.3, 1.6, up));
        hc = mix(hc, uLemon, smoothstep(1.8, 2.8, up));
        float lvl = 0.16 + 0.9*smoothstep(0.05, 1.2, up);
        float top = step(0.5, n.y);
        vec3 c = base + hc * edge * lvl * (top*1.6 + 0.5) * uGlow;
        c += hc * top * smoothstep(0.6, 2.4, up) * 0.35 * uGlow;
        // 远处和井底都没入墨色
        float fade = (1.0 - smoothstep(0.65, 1.0, vR)) * exp(-vDepth*0.05);
        c += uPink * smoothstep(1.0, 8.0, vDepth) * edge * 0.9 * uGlow;  // 井壁：越深越粉
        gl_FragColor = vec4(c * fade, 1.0);
      }`,
  });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const I = new THREE.Matrix4();
  for (let k = 0; k < count; k++) mesh.setMatrixAt(k, I);
  mesh.frustumCulled = false;

  function update(t, { amp = 0.35, speed = 1.6, pulses = [], well = 0, glow = 1, center = [0, 0] } = {}) {
    uniforms.uT.value = t; uniforms.uAmp.value = amp; uniforms.uSpeed.value = speed;
    uniforms.uWell.value = well; uniforms.uGlow.value = glow; uniforms.uCenter.value.set(center[0], center[1]);
    for (let i = 0; i < 4; i++) {
      const p = pulses[i];
      if (p && t >= p.t0) uniforms.uPulse.value[i].set(t - p.t0, p.amp ?? 2.2, p.speed ?? 9);
      else uniforms.uPulse.value[i].set(-1, 0, 0);
    }
  }
  update(0, {});
  return { mesh, group: mesh, update };
}

// ================================================================ 同心环隧道
/**
 * 相机放在 (0,0,0) 朝 -z。环从远处迎面冲过。
 * opts: count=40, spacing=2.4, radius=5, sides=64（6 = 六边形环）
 * update(t, { travel = t*speed, speed=10, bend=0.6, spin=0.2, pulse=0 })
 *   travel 已前进的距离（想变速就自己积分好传进来）；pulse 0..1 让环变粗变亮（鼓点）
 */
export function createRingTunnel({ count = 40, spacing = 2.4, radius = 5, sides = 64 } = {}) {
  const geo = new THREE.RingGeometry(0.9, 1, sides, 1);
  const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: false });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  const L = count * spacing;
  const cols = [col(PAL.pink), col(PAL.lemon), col(PAL.mint), col(PAL.paper)];
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), e = new THREE.Euler(), c = new THREE.Color();
  const path = (z, t, bend) => [Math.sin(z * 0.045 + t * 0.7) * bend * (-z) * 0.08, Math.cos(z * 0.031 + t * 0.5) * bend * (-z) * 0.06];

  function update(t, { travel, speed = 10, bend = 0.6, spin = 0.2, pulse = 0, thick = 0.2 } = {}) {
    const tr = travel ?? t * speed;
    for (let i = 0; i < count; i++) {
      const k = Math.floor((tr - i * spacing) / L); // 第几圈，决定颜色，保持颜色跟着环走
      const z = -(((i * spacing - tr) % L + L) % L) - 0.5;
      const idx = i + k * count;
      const [x, y] = path(z, t, bend);
      const th = thick * (1 + pulse * 0.8);
      const r = radius;
      p.set(x, y, z);
      e.set(0, 0, idx * 0.37 + t * spin * ((idx & 1) ? 1 : -1));
      q.setFromEuler(e);
      s.set(r, r, 1);
      m4.compose(p, q, s);
      mesh.setMatrixAt(i, m4);
      // 环宽通过 inner/outer 缩放做不到，只能换色亮度模拟；远处没入墨色，近处全亮
      const fade = Math.pow(clamp(1 - (-z) / L), 1.6);
      const near = smooth((-z) / 7);
      c.copy(cols[((idx % 4) + 4) % 4]).multiplyScalar(fade * near * (1 + pulse * 1.2) * (0.6 + th * 2));
      mesh.setColorAt(i, c);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate = true;
  }
  update(0, {});
  return { mesh, group: mesh, update, length: L };
}

// ================================================================ 回形针雪崩
function paperclipCurve() {
  const pts = [];
  const line = (a, b, n = 6) => { for (let i = 0; i < n; i++) { const u = i / n; pts.push(new THREE.Vector3(lerp(a[0], b[0], u), lerp(a[1], b[1], u), 0)); } };
  const arc = (cx, cy, r, a0, a1, n = 10) => { for (let i = 0; i < n; i++) { const a = lerp(a0, a1, i / n); pts.push(new THREE.Vector3(cx + r * Math.cos(a), cy + r * Math.sin(a), 0)); } };
  line([0.22, 0.75], [0.22, -0.85]);
  arc(0, -0.85, 0.22, 0, -Math.PI);
  line([-0.22, -0.85], [-0.22, 1.05]);
  arc(0.14, 1.05, 0.36, Math.PI, 0);
  line([0.5, 1.05], [0.5, -1.15]);
  arc(0, -1.15, 0.5, 0, -Math.PI);
  line([-0.5, -1.15], [-0.5, 0.55], 5);
  pts.push(new THREE.Vector3(-0.5, 0.55, 0));
  return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.1);
}

// 程序化 matcap：铬银，上方暖白高光，下方反一点薄荷，边缘一圈粉
export function chromeMatcap(size = 256) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const g = cv.getContext('2d');
  const img = g.createImageData(size, size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const nx = (x + 0.5) / size * 2 - 1, ny = 1 - (y + 0.5) / size * 2;
    const r2 = nx * nx + ny * ny;
    const i = (y * size + x) * 4;
    if (r2 > 1) { img.data[i + 3] = 255; continue; }
    const nz = Math.sqrt(1 - r2);
    // 天空-地平线-地面 的环境反射
    let v = 0.35 + 0.45 * ny;
    const horizon = Math.exp(-((ny + 0.05) ** 2) / 0.01);
    let R = v * 0.85 + horizon * 0.5, G = v * 0.88 + horizon * 0.5, B = v * 0.95 + horizon * 0.5;
    if (ny < -0.1) { const m = (-ny - 0.1) * 0.6; R = lerp(R, 0.37, m); G = lerp(G, 0.89, m); B = lerp(B, 0.75, m); }
    const spec = Math.pow(Math.max(0, nx * -0.35 + ny * 0.55 + nz * 0.76), 60) * 1.2;
    const rim = Math.pow(1 - nz, 3);
    R += spec + rim * 1.0; G += spec + rim * 0.18; B += spec + rim * 0.53;
    img.data[i] = clamp(R) * 255; img.data[i + 1] = clamp(G) * 255; img.data[i + 2] = clamp(B) * 255; img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * opts: count=10000, seed=11, clipSize=0.32
 * update(t, { t0=0, dur=4, height=3.2, radius=7, drop=9, targets, clear（中心空地半径）})
 *   第 i 枚在 t0 + dur·(i/count)^0.85 从高处落下（越往后越密，雪崩加速），落到一个不断长高的堆上。
 *   targets（可选）：Float32Array xyz，前 targets.length/3 枚改为落到这些点上（拿去拼字）
 */
export function createPaperclips({ count = 10000, seed = 11, clipSize = 0.32 } = {}) {
  const tube = new THREE.TubeGeometry(paperclipCurve(), 30, 0.055, 4, false);
  tube.scale(clipSize, clipSize, clipSize);
  const mat = new THREE.MeshMatcapMaterial({ matcap: chromeMatcap() });
  const mesh = new THREE.InstancedMesh(tube, mat, count);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  const rnd = mulberry32(seed);
  // 每枚：落点极坐标、落点抖动、旋转轴、自转速度、最终朝向、配色（少量粉/薄荷/柠黄上色）
  const D = new Float32Array(count * 12);
  for (let i = 0; i < count; i++) {
    const o = i * 12;
    const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd());
    D[o] = a; D[o + 1] = rr; D[o + 2] = rnd(); D[o + 3] = rnd() * 2 - 1; D[o + 4] = rnd() * 2 - 1; D[o + 5] = rnd() * 2 - 1;
    D[o + 6] = lerp(6, 16, rnd()); D[o + 7] = rnd() * Math.PI * 2; D[o + 8] = (rnd() - 0.5) * 0.9; D[o + 9] = (rnd() - 0.5) * 0.9;
    D[o + 10] = rnd(); D[o + 11] = rnd();
  }
  const cSilver = col(0xffffff), tint = [col(PAL.pink), col(PAL.mint), col(PAL.lemon)];
  for (let i = 0; i < count; i++) {
    const h = D[i * 12 + 11];
    mesh.setColorAt(i, h < 0.88 ? cSilver : tint[Math.floor((h - 0.88) / 0.04)] ?? cSilver);
  }
  mesh.instanceColor.needsUpdate = true;

  const m4 = new THREE.Matrix4(), qa = new THREE.Quaternion(), qb = new THREE.Quaternion(), ax = new THREE.Vector3(),
    pv = new THREE.Vector3(), sv = new THREE.Vector3(), e = new THREE.Euler(), zero = new THREE.Matrix4().makeScale(0, 0, 0);
  const G = 22;

  function update(t, { t0 = 0, dur = 4, height = 3.2, radius = 7, drop = 9, targets = null, clear = 0 } = {}) {
    const nT = targets ? Math.min(count, targets.length / 3) : 0;
    for (let i = 0; i < count; i++) {
      const o = i * 12;
      const f = i / count;
      const spawn = t0 + dur * Math.pow(f, 0.85);
      const tau = t - spawn;
      if (tau < 0 || (i >= nT && clear > 0 && D[o + 1] * radius < clear)) { mesh.setMatrixAt(i, zero); continue; }   // clear：中心留一圈空地（给人站），这一圈也不会有针从头顶落过
      // 落点
      let rx, ry, rz;
      if (i < nT) { rx = targets[i * 3]; ry = targets[i * 3 + 1]; rz = targets[i * 3 + 2]; }
      else {
        const r = D[o + 1] * radius;
        rx = Math.cos(D[o]) * r; rz = Math.sin(D[o]) * r;
        // 堆高：随顺序长高，中间高四周低
        ry = height * Math.pow(f, 0.7) * (1 - 0.75 * D[o + 1] * D[o + 1]) + D[o + 2] * 0.12;
      }
      const h0 = drop + D[o + 2] * 4;
      const tf = Math.sqrt((2 * h0) / G);
      let y, k;
      if (tau < tf) { y = ry + h0 - 0.5 * G * tau * tau; k = 0; }
      else { const b = tau - tf; y = ry + Math.abs(Math.sin(b * 14)) * 0.18 * Math.exp(-b * 9); k = smooth(b / 0.25); }
      const drift = (1 - clamp(tau / tf)) * 1.4;
      pv.set(rx + D[o + 3] * drift, y, rz + D[o + 5] * drift);
      // 空中翻滚 → 落地平躺（绕 x 放倒 + 随机偏航 + 小倾角）
      ax.set(D[o + 3], D[o + 4], D[o + 5]).normalize();
      qa.setFromAxisAngle(ax, D[o + 6] * Math.min(tau, tf));
      e.set(-Math.PI / 2 + D[o + 8], D[o + 7], D[o + 9], 'YXZ');
      qb.setFromEuler(e);
      if (i < nT) qb.setFromEuler(e.set(D[o + 8] * 0.3, D[o + 7] * 0.15, 0));
      qa.slerp(qb, k);
      sv.setScalar(1);
      m4.compose(pv, qa, sv);
      mesh.setMatrixAt(i, m4);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }
  update(0, { t0: 1e9 });
  return { mesh, group: mesh, update };
}

// ================================================================ GPU 田野（LED 麦浪）
/**
 * opts: nx=220, nz=110
 * update(t, { speed=1, gust=1, bright=1, dir=[1, 0.35] })
 *   每块「显卡」顶上一条 LED，亮度随风浪走（波峰柠黄、波身薄荷、波谷暗），卡身随浪微微前倾
 */
export function createGpuField({ nx = 220, nz = 110, pitch = 0.62 } = {}) {
  const geo = new THREE.BoxGeometry(0.46, 0.2, 0.3).translate(0, 0.1, 0);
  const count = nx * nz;
  const g = new Float32Array(count * 2);
  for (let i = 0, k = 0; i < nx; i++) for (let j = 0; j < nz; j++, k++) { g[k * 2] = (i - (nx - 1) / 2) * pitch; g[k * 2 + 1] = -j * pitch; }
  geo.setAttribute('aXZ', new THREE.InstancedBufferAttribute(g, 2));
  const uniforms = {
    uT: { value: 0 }, uSpeed: { value: 1 }, uGust: { value: 1 }, uBright: { value: 1 }, uDir: { value: new THREE.Vector2(1, 0.35) },
    uFar: { value: nz * pitch }, uInk: { value: col(0x15151e) }, uMint: { value: col(PAL.mint) }, uLemon: { value: col(PAL.lemon) }, uPink: { value: col(PAL.pink) },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */`
      ${GLSL_COMMON}
      attribute vec2 aXZ; uniform float uT, uSpeed, uGust; uniform vec2 uDir;
      varying vec3 vN; varying vec2 vUv; varying float vW; varying float vDist; varying float vRand;
      float wave(vec2 p){
        vec2 d = normalize(uDir);
        float s = dot(p, d);
        float n = vnoise(p*0.045 + vec2(uT*0.15*uSpeed, 0.0));
        float w = sin(s*0.38 - uT*2.6*uSpeed + n*4.0) * 0.5 + 0.5;
        w *= mix(0.55, 1.05, vnoise(p*0.02 - uT*0.1*uSpeed)) * uGust;
        return w;
      }
      void main(){
        float w = wave(aXZ);
        vec3 p = position;
        // 前倾：绕 x 轴，按高度
        float bend = w * 0.5;
        p.z -= p.y * bend; p.y += w * 0.12;
        vec3 wp = vec3(aXZ.x, 0.0, aXZ.y) + p;
        vN = normal; vUv = uv; vW = w; vRand = hash21(aXZ);
        vec4 mv = modelViewMatrix * vec4(wp, 1.0);
        vDist = -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      uniform float uBright, uFar; uniform vec3 uInk, uMint, uLemon, uPink;
      varying vec3 vN; varying vec2 vUv; varying float vW; varying float vDist; varying float vRand;
      void main(){
        vec3 n = normalize(vN);
        float dif = 0.4 + 0.6*max(dot(n, normalize(vec3(0.2, 0.8, 0.6))), 0.0);
        vec3 c = uInk * dif;
        // LED：顶面中间一条 + 正面一排小灯
        float crest = smoothstep(0.45, 0.9, vW); crest *= crest;   // 波峰窄而亮，波谷压黑
        vec3 led = mix(uMint*0.9, uLemon, smoothstep(0.55, 0.95, vW));
        led = mix(led, uPink, step(0.985, vRand));
        c = c * (0.35 + 0.65*crest) + led * 0.12 * crest;
        if (n.y > 0.5) {
          vec2 e2 = abs(vUv - 0.5);
          float panel = 1.0 - smoothstep(0.36, 0.42, max(e2.x, e2.y));
          c += led * panel * (0.015 + 5.0*crest) * uBright;
        } else if (n.z > 0.5) {
          float dots = step(0.5, fract(vUv.x*6.0)) * (1.0 - smoothstep(0.1, 0.2, abs(vUv.y - 0.7)));
          c += led * dots * (0.01 + 2.2*crest) * uBright;
        }
        float fog = exp(-vDist / (uFar*0.55));
        gl_FragColor = vec4(c * fog, 1.0);
      }`,
  });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const I = new THREE.Matrix4();
  for (let k = 0; k < count; k++) mesh.setMatrixAt(k, I);
  mesh.frustumCulled = false;
  function update(t, { speed = 1, gust = 1, bright = 1, dir = [1, 0.35] } = {}) {
    uniforms.uT.value = t; uniforms.uSpeed.value = speed; uniforms.uGust.value = gust; uniforms.uBright.value = bright;
    uniforms.uDir.value.set(dir[0], dir[1]);
  }
  return { mesh, group: mesh, update };
}

// ================================================================ Shoggoth 线团网络
/**
 * opts: nodes=720, seed=5, radius=3
 * update(t, { writhe=1, mask=0, scan=0 })
 *   writhe 翻涌强度；mask 0..1 笑脸面具出现；scan 0..1 扫描线从上往下扫，扫过的面具被烧掉，露出线团
 * 返回 { group, update, mask }  —— 面具是 group 里的一块平面（z = radius+0.4），调用方可以另挪位置
 */
export function createShoggoth({ nodes = 720, seed = 5, radius = 3 } = {}) {
  const rnd = mulberry32(seed);
  const group = new THREE.Group();
  const base = new Float32Array(nodes * 3);
  const ph = new Float32Array(nodes * 3);
  for (let i = 0; i < nodes; i++) {
    // 偏心的多瘤团：主球 + 几个副球
    const lobe = rnd();
    let cx = 0, cy = 0, cz = 0, R = radius;
    if (lobe > 0.6) { const a = Math.floor(rnd() * 5) * 1.3; cx = Math.cos(a) * radius * 0.8; cy = Math.sin(a * 1.7) * radius * 0.55; cz = -0.5; R = radius * 0.55; }
    const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2, rr = R * Math.cbrt(lerp(0.25, 1, rnd()));
    const s = Math.sqrt(1 - u * u);
    base.set([cx + rr * s * Math.cos(th), cy + rr * u * 0.85, cz + rr * s * Math.sin(th)], i * 3);
    ph.set([rnd() * 6.28, rnd() * 6.28, rnd() * 6.28], i * 3);
  }
  // 连到最近的 3 个
  const pairs = [];
  for (let i = 0; i < nodes; i++) {
    const best = [];
    for (let j = 0; j < nodes; j++) {
      if (j === i) continue;
      const dx = base[i * 3] - base[j * 3], dy = base[i * 3 + 1] - base[j * 3 + 1], dz = base[i * 3 + 2] - base[j * 3 + 2];
      const d = dx * dx + dy * dy + dz * dz;
      if (best.length < 3 || d < best[best.length - 1][0]) { best.push([d, j]); best.sort((a, b) => a[0] - b[0]); if (best.length > 3) best.pop(); }
    }
    for (const [, j] of best) if (i < j || rnd() < 0.3) pairs.push(i, j);
  }
  // 几条长触须：随机远距离连线
  for (let k = 0; k < 40; k++) pairs.push(Math.floor(rnd() * nodes), Math.floor(rnd() * nodes));
  const lineGeo = new THREE.BufferGeometry();
  const lp = new Float32Array(pairs.length * 3), lc = new Float32Array(pairs.length * 3);
  lineGeo.setAttribute('position', new THREE.BufferAttribute(lp, 3));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lc, 3));
  const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  lines.frustumCulled = false;
  group.add(lines);
  const ptGeo = new THREE.BufferGeometry();
  const pp = new Float32Array(nodes * 3), pc = new Float32Array(nodes * 3), ps = new Float32Array(nodes);
  ptGeo.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  ptGeo.setAttribute('color', new THREE.BufferAttribute(pc, 3));
  ptGeo.setAttribute('size', new THREE.BufferAttribute(ps, 1));
  const pts = new THREE.Points(ptGeo, pointsMaterial());
  pts.frustumCulled = false;
  group.add(pts);
  const cPurple = col(PAL.purple), cPink = col(PAL.pink), cLemon = col(PAL.lemon);
  const nodeCol = [];
  for (let i = 0; i < nodes; i++) { const h = rnd(); nodeCol.push(h < 0.08 ? cLemon : h < 0.3 ? cPink : cPurple); ps[i] = h < 0.08 ? 7 : lerp(3, 5, rnd()); }

  // 笑脸面具（程序化着色器）
  const maskMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uA: { value: 0 }, uScan: { value: 0 }, uPaper: { value: col(PAL.paper) }, uInk: { value: col(PAL.ink) }, uPink: { value: col(PAL.pink) }, uMint: { value: col(PAL.mint) }, uT: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: /* glsl */`
      ${GLSL_COMMON}
      uniform float uA, uScan, uT; uniform vec3 uPaper, uInk, uPink, uMint; varying vec2 vUv;
      void main(){
        vec2 p = vUv*2.0 - 1.0;
        float r = length(p);
        float disc = 1.0 - smoothstep(0.78, 0.8, r);
        vec3 c = uPaper * (0.85 + 0.15*(1.0 - r));
        float eyeL = 1.0 - smoothstep(0.075, 0.09, length((p - vec2(-0.28, 0.2))*vec2(1.0, 0.6)));
        float eyeR = 1.0 - smoothstep(0.075, 0.09, length((p - vec2(0.28, 0.2))*vec2(1.0, 0.6)));
        float sm = abs(length(p - vec2(0.0, 0.12)) - 0.48);
        float smile = (1.0 - smoothstep(0.035, 0.05, sm)) * step(p.y, -0.05) * step(abs(p.x), 0.4);
        c = mix(c, uInk, max(max(eyeL, eyeR), smile));
        float outline = 1.0 - smoothstep(0.0, 0.02, abs(r - 0.79));
        // 扫描：y 从上往下，线上方的面具烧掉
        float sy = 1.0 - uScan*2.2;              // 扫描线位置（p.y 空间，1 → -1.2）
        float jag = (vnoise(vec2(p.x*9.0, uT*3.0)) - 0.5)*0.08;
        float gone = step(sy + jag, p.y);
        float burn = (1.0 - smoothstep(0.0, 0.08, abs(p.y - sy - jag))) * step(0.001, uScan);
        float a = disc * (1.0 - gone) * uA;
        vec3 outc = c*a + uPink*burn*2.5*disc*uA;
        float line = (1.0 - smoothstep(0.0, 0.012, abs(p.y - sy))) * step(0.001, uScan) * step(uScan, 0.999) * step(abs(p.x), 1.0);
        outc += uMint * line * 2.0 * uA;
        gl_FragColor = vec4(outc, max(a, max(burn*disc, line)*uA));
      }`,
  });
  const mask = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2.2, radius * 2.2), maskMat);
  mask.position.z = radius + 0.4;
  mask.renderOrder = 5;
  group.add(mask);

  const tmp = new THREE.Color();
  function update(t, { writhe = 1, mask: mk = 0, scan = 0 } = {}) {
    const rot = t * 0.12;
    const cr = Math.cos(rot), sr = Math.sin(rot);
    for (let i = 0; i < nodes; i++) {
      const bx = base[i * 3], by = base[i * 3 + 1], bz = base[i * 3 + 2];
      const a = ph[i * 3], b = ph[i * 3 + 1], c = ph[i * 3 + 2];
      const w = writhe * 0.45;
      let x = bx + w * Math.sin(t * 1.3 + a + by * 0.9);
      let y = by + w * Math.sin(t * 1.1 + b + bz * 0.8);
      const z = bz + w * Math.sin(t * 1.7 + c + bx * 0.7);
      // 整团呼吸 + 慢转
      const br = 1 + 0.06 * Math.sin(t * 2.1 + by);
      const X = (x * cr - z * sr) * br, Z = (x * sr + z * cr) * br;
      pp[i * 3] = X; pp[i * 3 + 1] = y * br; pp[i * 3 + 2] = Z;
      const depth = clamp((Z / radius + 1) / 2);
      const pulse = 0.6 + 0.4 * Math.sin(t * 3 + a * 3);
      tmp.copy(nodeCol[i]).multiplyScalar((0.35 + 1.1 * depth) * pulse * 1.3);
      pc.set([tmp.r, tmp.g, tmp.b], i * 3);
    }
    for (let k = 0; k < pairs.length; k++) {
      const i = pairs[k];
      lp[k * 3] = pp[i * 3]; lp[k * 3 + 1] = pp[i * 3 + 1]; lp[k * 3 + 2] = pp[i * 3 + 2];
      const d = clamp((pp[i * 3 + 2] / radius + 1) / 2);
      tmp.copy(cPurple).lerp(cPink, 0.25 * d).multiplyScalar(0.18 + 0.6 * d);
      lc[k * 3] = tmp.r; lc[k * 3 + 1] = tmp.g; lc[k * 3 + 2] = tmp.b;
    }
    lineGeo.attributes.position.needsUpdate = lineGeo.attributes.color.needsUpdate = true;
    for (const a of ['position', 'color']) ptGeo.attributes[a].needsUpdate = true;
    maskMat.uniforms.uA.value = mk; maskMat.uniforms.uScan.value = scan; maskMat.uniforms.uT.value = t;
    mask.visible = mk > 0;
  }
  update(0, {});
  return { group, update, mask };
}

// ================================================================ 巨眼
/**
 * 一块平面上的着色器眼睛（宽:高 = 2:1）。
 * opts: width=8
 * update(t, { open=1, pupil=0.4, look=[0,0], spin=1, sparks=0, glow=1, lids=1 })
 *   open   0 闭 → 1 全睁；pupil 0 缩成针 → 1 散大；look 瞳孔偏移（-1..1）
 *   spin   虹膜电路环转速倍率（奇数环反转）；sparks 0..1 从瞳孔溅出的火花；lids 眼睑外层线显隐
 */
export function createEye({ width = 8 } = {}) {
  const uniforms = {
    uT: { value: 0 }, uOpen: { value: 1 }, uPupil: { value: 0.4 }, uLook: { value: new THREE.Vector2() }, uSpin: { value: 1 },
    uSparks: { value: 0 }, uGlow: { value: 1 }, uLids: { value: 1 },
    uPink: { value: col(PAL.pink) }, uMint: { value: col(PAL.mint) }, uLemon: { value: col(PAL.lemon) }, uPaper: { value: col(PAL.paper) }, uInk: { value: col(PAL.ink) },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: /* glsl */`
      ${GLSL_COMMON}
      uniform float uT, uOpen, uPupil, uSpin, uSparks, uGlow, uLids; uniform vec2 uLook;
      uniform vec3 uPink, uMint, uLemon, uPaper, uInk;
      varying vec2 vUv;
      #define PI 3.14159265
      float lineAA(float d, float w){ float fw = fwidth(d); return 1.0 - smoothstep(w, w + fw*1.5, abs(d)); }
      // 眼睑曲线：x∈[-W,W]，返回高度
      float lid(float x, float W, float H){ float q = clamp(1.0 - (x*x)/(W*W), 0.0, 1.0); return H * pow(q, 0.85); }
      void main(){
        vec2 p = (vUv - 0.5) * vec2(2.0, 1.0) * 2.0;   // x∈[-2,2] y∈[-1,1]
        float W = 1.55, H = 0.62 * uOpen + 0.001;
        float up = lid(p.x, W, H) + 0.02*uOpen, lo = -lid(p.x, W, H*0.78);
        float inside = step(lo, p.y) * step(p.y, up) * step(abs(p.x), W);
        vec3 c = vec3(0.0); float a = 0.0;

        // 眼白：深色，靠近眼睑处暗，中心略亮
        vec3 sclera = mix(vec3(0.03, 0.03, 0.05), vec3(0.09, 0.08, 0.12), 1.0 - smoothstep(0.0, 1.3, length(p*vec2(0.7, 1.4))));
        // 虹膜
        vec2 ic = uLook * vec2(0.55, 0.2);
        vec2 q = p - ic;
        float r = length(q);
        float R = 0.58;
        float ang = atan(q.y, q.x);
        float pr = mix(0.07, 0.36, uPupil);
        vec3 iris = vec3(0.0);
        if (r < R) {
          float band = (r - pr) / (R - pr);
          float ri = floor(band * 5.0);
          float dir = mod(ri, 2.0) < 0.5 ? 1.0 : -1.0;
          float a2 = ang + dir * uT * uSpin * (0.25 + 0.12*ri);
          float nseg = 10.0 + ri * 7.0;
          float cell = floor((a2 / (2.0*PI) + 0.5) * nseg);
          float cf = fract((a2 / (2.0*PI) + 0.5) * nseg);
          float h = hash21(vec2(cell, ri));
          float rb = fract(band * 5.0);
          vec3 tc = h < 0.55 ? uMint : h < 0.8 ? uLemon : uPink;
          // 环边界
          float ring = lineAA((rb - 0.0) * (R - pr) / 5.0, 0.004) * step(pr, r);
          // 径向走线
          float radial = lineAA((cf - 0.5) * r * 2.0*PI / nseg, 0.006) * step(0.35, h) * step(rb, 0.8) * step(0.15, rb);
          // 焊盘
          vec2 padp = vec2((cf - 0.5) * r * 2.0*PI / nseg, (rb - 0.8) * (R - pr) / 5.0);
          float pad = (1.0 - smoothstep(0.012, 0.018, length(padp))) * step(0.35, h);
          // 弧线段
          float arc = lineAA((rb - 0.45) * (R - pr) / 5.0, 0.004) * step(h, 0.3);
          iris = uMint * ring * 0.8 + tc * (radial * 1.2 + arc * 1.1) + uLemon * pad * 2.0;
          iris += mix(uPink, uMint, band) * 0.06 * (1.0 - band);            // 底色微光
          // 外圈亮边（角膜缘）
          iris += uPaper * lineAA(r - R, 0.006) * 1.2;
        }
        // 瞳孔
        float pupil = 1.0 - smoothstep(pr - 0.004, pr + 0.004, r);
        vec3 eyeC = sclera + iris * uGlow;
        eyeC = mix(eyeC, vec3(0.0), pupil);
        eyeC += uPink * lineAA(r - pr, 0.007) * 2.0 * uGlow;
        // 高光
        eyeC += vec3(1.0) * (1.0 - smoothstep(0.03, 0.045, length(q - vec2(-0.16, 0.16)))) * 1.5;
        // 上眼睑投影
        eyeC *= mix(0.35, 1.0, smoothstep(0.0, 0.22, up - p.y));
        c = eyeC * inside; a = inside;

        // 眼睑线（一层层）
        float lines = 0.0;
        lines += lineAA(p.y - up, 0.008) * step(abs(p.x), W) * 1.6;
        lines += lineAA(p.y - lo, 0.007) * step(abs(p.x), W) * 1.2;
        for (int k = 1; k <= 6; k++){
          float fk = float(k);
          float Wk = W * (1.0 + 0.05*fk) , Hk = H + 0.07*fk*(0.4 + 0.6*uOpen) ;
          float yk = lid(p.x, Wk, Hk) + 0.02*uOpen;
          float fade = (1.0 - fk/7.5) * uLids;
          lines += lineAA(p.y - yk, 0.005) * step(abs(p.x), Wk*0.97) * fade;
          if (k <= 3) {
            float yl = -lid(p.x, Wk*0.98, H*0.78 + 0.06*fk*uOpen);
            lines += lineAA(p.y - yl, 0.004) * step(abs(p.x), Wk*0.9) * fade * 0.6;
          }
        }
        c += uPaper * lines * 1.2;
        a = max(a, clamp(lines, 0.0, 1.0));

        // 火花：从瞳孔甩出去的短拖尾
        if (uSparks > 0.0) {
          for (int k = 0; k < 28; k++){
            float fk = float(k);
            float per = 0.9 + hash11(fk*3.1)*0.9;
            float ph = fract((uT + hash11(fk*7.7)*per) / per);
            float an = hash11(fk*1.9 + floor((uT + hash11(fk*7.7)*per)/per)*13.0) * 2.0*PI;
            vec2 d = vec2(cos(an), sin(an));
            float head = pr + ph * 2.2;
            float tail = head - 0.18;
            vec2 v = p - ic;
            float along = dot(v, d), perp = abs(dot(v, vec2(-d.y, d.x)));
            float seg = step(tail, along) * step(along, head) * (1.0 - smoothstep(0.004, 0.012, perp));
            float s = seg * smoothstep(tail, head, along) * (1.0 - ph) * uSparks;
            vec3 sc = mod(fk, 3.0) < 1.0 ? uLemon : mod(fk, 3.0) < 2.0 ? uPink : uMint;
            c += sc * s * 3.0; a = max(a, clamp(s, 0.0, 1.0));
          }
        }
        gl_FragColor = vec4(c, a);
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, width / 2), mat);
  function update(t, { open = 1, pupil = 0.4, look = [0, 0], spin = 1, sparks = 0, glow = 1, lids = 1 } = {}) {
    uniforms.uT.value = t; uniforms.uOpen.value = open; uniforms.uPupil.value = pupil; uniforms.uLook.value.set(look[0], look[1]);
    uniforms.uSpin.value = spin; uniforms.uSparks.value = sparks; uniforms.uGlow.value = glow; uniforms.uLids.value = lids;
  }
  return { mesh, group: mesh, update };
}

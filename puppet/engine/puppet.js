// 木偶的求值：给定参数，算出每个部件这一帧的顶点、不透明度、层序。不碰画布、不读时钟、没有随机数，也不认识任何部件的名字。
//
// 一个部件怎么动，三层叠加（见 ARCHITECTURE.md 0.2）：
//   1. 默认：按深度整体平移  dx = depth × R × sin(转头角)，dy = −depthY × R × sin(点头角)
//      1b. 转头的逐顶点位移场（可选，mesh.turn = { z: [每个顶点], w: [每个顶点] }，单位都是 R）：
//          dx_i = z_i × R × sin(转头角) + w_i × R × (1 − cos(转头角))
//          z 是这个顶点比部件的 depth 再靠前多少（随转头方向变号）；w 是不随方向变号的那一项（一个真的绕竖轴转的点 w = −它到转轴的横向距离 / R）。
//          有了它，一个部件转头时不再是整片平移：朝转过去的一侧压窄、另一侧展宽。叠加层也可以带（grid + turn）。
//   2. 校正：稀疏关键形（平移 / 缩放 / 旋转 / 不透明度 / 网格顶点位移），在参数格上混合，没给的格点自动补
//   3. 刚体组：部件挂在一个组上，组有支点和随参数线性变化的平移 / 旋转 / 缩放，可以嵌套
import { ParamStore, clamp } from './params.js';
import { buildBlend } from './blend.js';

const RAD = Math.PI / 180;
const HEAD = 6;   // 关键形向量的头 6 项：tx ty sx sy rot opacity（都是相对静止形的增量），后面是顶点位移

// 2×3 仿射 [a b c d e f]：x' = a·x + c·y + e，y' = b·x + d·y + f
const I = [1, 0, 0, 1, 0, 0];
const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

function gridMesh([x, y, w, h], cols, rows) {
  const v = [], uv = [], tri = [];
  for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) { v.push(x + w * i / cols, y + h * j / rows); uv.push(i / cols, j / rows); }
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const a = j * (cols + 1) + i, b = a + 1, c = a + cols + 1, d = c + 1; tri.push(a, b, c, b, d, c); }
  return { vertices: Float32Array.from(v), uvs: Float32Array.from(uv), triangles: Uint16Array.from(tri) };
}

export class Puppet {
  constructor(character, parts) {
    this.character = character;
    this.params = new ParamStore(character.parameters);
    this.unit = character.unit;
    this.turn = character.turn ?? {};
    this.groups = new Map((character.groups ?? []).map(g => [g.id, g]));
    this.overlays = (character.overlays ?? []).map(o => {
      if (!o.grid) return o;
      const { width: W, height: H } = character.canvas, mesh = gridMesh([0, 0, W, H], o.grid[0], o.grid[1]), nv = mesh.vertices.length / 2;
      if (o.turn && (o.turn.z.length !== nv || (o.turn.w && o.turn.w.length !== nv))) throw new Error(`叠加层 ${o.id}: turn 的 z / w 长度应为 ${nv}`);
      return { ...o, mesh, nv, out: new Float32Array(nv * 2) };
    });
    this.poseWeights = new Map();   // 部件 id → 0…1（切换组里的部件；不在表里的当 1）
    for (const g of character.poseGroups ?? []) g.parts.forEach((id, i) => this.poseWeights.set(id, i === 0 ? 1 : 0));
    this.parts = parts.map((p, index) => this.#prepare(p, index));
    this.byId = new Map(this.parts.map(p => [p.def.id, p]));
  }

  #prepare(def, index) {
    const rect = def.rect, m = def.mesh;
    const mesh = m?.vertices ? { vertices: Float32Array.from(m.vertices), uvs: Float32Array.from(m.uvs), triangles: Uint16Array.from(m.triangles) }
      : gridMesh(rect, m?.grid?.[0] ?? 1, m?.grid?.[1] ?? 1);
    const nv = mesh.vertices.length / 2, n = HEAD + nv * 2;
    const pivot = def.pivot ?? [rect[0] + rect[2] / 2, rect[1] + rect[3] / 2];
    let blend = null;
    if (def.keyforms?.length) {
      blend = buildBlend(def.keyforms.map(k => {
        const vec = new Float64Array(n);
        if (k.translate) { vec[0] = k.translate[0]; vec[1] = k.translate[1]; }
        if (k.scale) { vec[2] = k.scale[0] - 1; vec[3] = k.scale[1] - 1; }
        if (k.rotate) vec[4] = k.rotate;
        if (k.opacity != null) vec[5] = k.opacity - 1;
        if (k.offsets) { if (k.offsets.length !== nv * 2) throw new Error(`${def.id}: 关键形 offsets 长度应为 ${nv * 2}`); vec.set(k.offsets, HEAD); }
        return { at: k.at, vec };
      }), n, id => this.params.rest(id));
    }
    const tf = m?.turn; let turnZ = null, turnW = null;
    if (tf) {
      if (tf.z.length !== nv || (tf.w && tf.w.length !== nv)) throw new Error(`${def.id}: mesh.turn 的 z / w 长度应为 ${nv}`);
      turnZ = Float32Array.from(tf.z); turnW = Float32Array.from(tf.w ?? new Array(nv).fill(0));
    }
    return { def, index, mesh, nv, pivot, blend, turnZ, turnW, delta: new Float64Array(n), out: new Float32Array(nv * 2) };
  }

  set(values) { this.params.setAll(values); return this; }
  get(id) { return this.params.get(id); }
  // 切换组：把某个部件的权重设成 k（0…1）。同组其它部件的权重由调用方按「新层先淡入、盖住后旧层再撤」来给（见 groups.js）。
  setPartWeight(id, k) { this.poseWeights.set(id, clamp(k, 0, 1)); return this; }

  #angle(axis) { const t = this.turn[axis]; return t ? (this.params.get(t.parameter) - this.params.rest(t.parameter)) * (t.degreesPerUnit ?? 1) * RAD : 0; }

  #groupMatrix(id, memo) {
    if (!id) return I;
    if (memo.has(id)) return memo.get(id);
    const g = this.groups.get(id);
    if (!g) { memo.set(id, I); return I; }
    let tx = 0, ty = 0, rot = 0, sx = 1, sy = 1;
    for (const b of g.bindings ?? []) {
      const v = (this.params.get(b.parameter) - this.params.rest(b.parameter)) * b.k;
      if (b.channel === 'translateX') tx += v; else if (b.channel === 'translateY') ty += v; else if (b.channel === 'rotate') rot += v;
      else if (b.channel === 'scaleX') sx += v; else if (b.channel === 'scaleY') sy += v;
    }
    const [px, py] = g.pivot ?? [0, 0], c = Math.cos(rot * RAD), s = Math.sin(rot * RAD);
    // 先绕支点缩放、旋转，再平移
    const local = [c * sx, s * sx, -s * sy, c * sy, px - (c * sx * px - s * sy * py) + tx, py - (s * sx * px + c * sy * py) + ty];
    const m = mul(this.#groupMatrix(g.parent, memo), local);
    memo.set(id, m); return m;
  }

  // 部件自己的刚性部分（缩放、旋转、平移），供顶点和挂点共用
  #rigid(p) {
    const d = p.blend ? p.blend.sample(id => this.params.get(id), p.delta) : p.delta;
    const R = this.unit.R, dep = p.def.depth ?? 0, depY = p.def.depthY ?? dep;
    const tx = d[0] + dep * R * Math.sin(this.#angle('x')), ty = d[1] - depY * R * Math.sin(this.#angle('y'));
    const c = Math.cos(d[4] * RAD), s = Math.sin(d[4] * RAD), sx = 1 + d[2], sy = 1 + d[3], [px, py] = p.pivot;
    return { d, m: [c * sx, s * sx, -s * sy, c * sy, px - (c * sx * px - s * sy * py) + tx, py - (s * sx * px + c * sy * py) + ty] };
  }

  #order(def) {
    let o = def.order;
    for (const k of def.orderKeys ?? []) { const v = this.params.get(k.parameter); if (k.at >= 0 ? v >= k.at : v <= k.at) o = k.order; }
    return o;
  }

  // → 按层序排好的绘制项：{ id, texture, vertices（画布像素）, uvs, triangles, opacity, order, mask }
  evaluate() {
    const memo = new Map(), items = [], TS = this.unit.R * Math.sin(this.#angle('x')), TC = this.unit.R * (1 - Math.cos(this.#angle('x')));
    for (const p of this.parts) {
      const def = p.def;
      let vis = 1;
      for (const id in def.visibleWhen ?? {}) { const v = this.params.get(id), [a, b] = def.visibleWhen[id]; if (v < a || v > b) vis = 0; }
      const { d, m } = this.#rigid(p), g = this.#groupMatrix(def.group, memo), M = mul(g, m);
      const opacity = clamp((def.opacity ?? 1) * (1 + d[5]) * vis * (this.poseWeights.get(def.id) ?? 1), 0, 1);
      const src = p.mesh.vertices, out = p.out, hasOff = !!p.blend, tz = p.turnZ, tw = p.turnW;
      for (let i = 0; i < p.nv; i++) {
        let x = src[2 * i], y = src[2 * i + 1];
        if (hasOff) { x += d[HEAD + 2 * i]; y += d[HEAD + 2 * i + 1]; }
        out[2 * i] = M[0] * x + M[2] * y + M[4]; out[2 * i + 1] = M[1] * x + M[3] * y + M[5];
        // 转头的位移场加在部件自己的缩放 / 旋转之后、刚体组之前（它是头坐标里的横向位移）
        if (tz) { const f = tz[i] * TS + tw[i] * TC; out[2 * i] += g[0] * f; out[2 * i + 1] += g[1] * f; }
      }
      items.push({ id: def.id, texture: def.texture, vertices: out, uvs: p.mesh.uvs, triangles: p.mesh.triangles, opacity, order: this.#order(def), index: p.index, mask: def.mask ?? null });
    }
    const { width: W, height: H } = this.character.canvas;
    this.overlays.forEach((o, i) => {
      // 叠加层自己也可以带深度：整层像一个部件那样随转头平移（贴脸层跟着五官走）
      const R = this.unit.R, dep = o.depth ?? 0, sx = dep * R * Math.sin(this.#angle('x')), sy = -(o.depthY ?? dep) * R * Math.sin(this.#angle('y'));
      const g = this.#groupMatrix(o.group, memo), mask = o.clipTo ? { by: [].concat(o.clipTo) } : null;
      if (o.mesh) {          // 带网格的叠加层：每个顶点按自己的位移场走（贴脸层跟着脸的变形走）
        const src = o.mesh.vertices, out = o.out, tz = o.turn?.z, tw = o.turn?.w;
        for (let k = 0; k < o.nv; k++) { const f = tz ? tz[k] * TS + (tw ? tw[k] * TC : 0) : 0, x = src[2 * k] + sx + f, y = src[2 * k + 1] + sy; out[2 * k] = g[0] * x + g[2] * y + g[4]; out[2 * k + 1] = g[1] * x + g[3] * y + g[5]; }
        items.push({ id: '@' + o.id, overlay: o.id, vertices: out, uvs: o.mesh.uvs, triangles: o.mesh.triangles, opacity: 1, order: o.order, index: 1e6 + i, mask }); return;
      }
      const q = [[0, 0], [W, 0], [0, H], [W, H]].flatMap(([x, y]) => apply(g, x + sx, y + sy));
      items.push({ id: '@' + o.id, overlay: o.id, vertices: Float32Array.from(q), uvs: Float32Array.of(0, 0, 1, 0, 0, 1, 1, 1), triangles: Uint16Array.of(0, 1, 2, 1, 3, 2), opacity: 1, order: o.order, index: 1e6 + i, mask });
    });
    return items.sort((a, b) => a.order - b.order || a.index - b.index);
  }

  // 挂点：跟着某个部件走的点。space = 'canvas'（含刚体组）、'local'（不含组）或 'rest'（静止位置：往自己带深度的叠加层上画时用，层会整体跟着动）
  anchors(space = 'canvas') {
    const memo = new Map(), out = {};
    for (const [name, a] of Object.entries(this.character.anchors ?? {})) {
      const p = a.part ? this.byId.get(a.part) : null;
      let pt = a.at;
      if (p && space !== 'rest') {
        const f = this.turnShift(p.def.id, pt[0], pt[1]); pt = apply(this.#rigid(p).m, pt[0], pt[1]); pt = [pt[0] + f, pt[1]];
        if (space === 'canvas') pt = apply(this.#groupMatrix(p.def.group, memo), pt[0], pt[1]);
      }
      out[name] = { x: pt[0], y: pt[1] };
    }
    return out;
  }
  groupMatrix(id) { return this.#groupMatrix(id, new Map()); }
  // 部件上静止时在 (x, y) 的一个点，转头的位移场让它横向挪多少（角色画布像素）。没有位移场的部件是 0。点在网格外时取最近的三角形外推。
  turnShift(id, x, y) {
    const p = this.byId.get(id); if (!p?.turnZ) return 0;
    const key = `${x},${y}`; p.turnCache ??= new Map(); let hit = p.turnCache.get(key);
    if (!hit) {
      const v = p.mesh.vertices, t = p.mesh.triangles; let best = null;
      for (let k = 0; k < t.length; k += 3) {
        const a = t[k], b = t[k + 1], c = t[k + 2], ax = v[2 * a], ay = v[2 * a + 1], e1x = v[2 * b] - ax, e1y = v[2 * b + 1] - ay, e2x = v[2 * c] - ax, e2y = v[2 * c + 1] - ay, det = e1x * e2y - e2x * e1y;
        if (Math.abs(det) < 1e-9) continue;
        const s = ((x - ax) * e2y - e2x * (y - ay)) / det, u = (e1x * (y - ay) - (x - ax) * e1y) / det, w0 = 1 - s - u, neg = -Math.min(w0, s, u, 0);
        if (!best || neg < best.neg) best = { neg, idx: [a, b, c], w: [w0, s, u] };
        if (neg === 0) break;
      }
      p.turnCache.set(key, hit = best);
    }
    if (!hit) return 0;
    const ang = this.#angle('x'), TS = this.unit.R * Math.sin(ang), TC = this.unit.R * (1 - Math.cos(ang)); let f = 0;
    for (let k = 0; k < 3; k++) f += hit.w[k] * (p.turnZ[hit.idx[k]] * TS + p.turnW[hit.idx[k]] * TC);
    return f;
  }
}

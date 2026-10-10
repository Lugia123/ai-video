// 参数格上的关键形混合 + 自动补格。
//
// 一个「格」由 1 或 2 个参数轴张成，每个轴有若干档（stops，升序）。每个格点上是一个定长向量（相对静止形的增量）。
// 只需要在少数格点上给值，其余由 fillBlanks 补出；运行时在格内做（双）线性插值。
//
// 算法出处：Inochi2D v0.8.7（BSD-2-Clause，Copyright (c) 2020, Inochi2D Project）
//   source/inochi2d/core/param/binding.d 的 fillBlanks / interpolate1D2D / extrapolateCorners / extendAndIntersect / interpolateLinear
//   @ e2235f6f2968。这里是读懂算法后用 JS 重写的，不是逐行翻译；许可证原文见 third_party/licenses/inochi2d-BSD-2-Clause.txt。

const add = (a, b, c, n) => { const o = new Float64Array(n); for (let i = 0; i < n; i++) o[i] = a[i] + b[i] - c[i]; return o; };
const mix = (a, b, k, n) => { const o = new Float64Array(n); for (let i = 0; i < n; i++) o[i] = a[i] + (b[i] - a[i]) * k; return o; };
const avg = (a, b, n) => mix(a, b, 0.5, n);

// cells：长度 nx*ny 的数组（下标 j*nx+i），已给的是 Float64Array，没给的是 null。原地补满并返回。
export function fillBlanks(cells, nx, ny, n) {
  const at = (i, j) => cells[j * nx + i];
  const left = () => cells.some(c => c === null);
  if (!cells.some(c => c !== null)) throw new Error('fillBlanks: 一个格点都没给');
  let guard = nx * ny + 4;
  while (left()) {
    if (--guard < 0) throw new Error('fillBlanks: 没能补满');
    // 1) 行内、列内各做一维线性插值（空格夹在两个已给格点之间才算）；两个方向都插得出就取平均
    const got = new Array(cells.length).fill(null);
    let any = false;
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      if (at(i, j)) continue;
      let hx = null, hy = null, a, b;
      for (a = i - 1; a >= 0 && !at(a, j); a--); for (b = i + 1; b < nx && !at(b, j); b++);
      if (a >= 0 && b < nx) hx = mix(at(a, j), at(b, j), (i - a) / (b - a), n);
      for (a = j - 1; a >= 0 && !at(i, a); a--); for (b = j + 1; b < ny && !at(i, b); b++);
      if (a >= 0 && b < ny) hy = mix(at(i, a), at(i, b), (j - a) / (b - a), n);
      const v = hx && hy ? avg(hx, hy, n) : hx || hy;
      if (v) { got[j * nx + i] = v; any = true; }
    }
    if (any) { got.forEach((v, k) => { if (v) cells[k] = v; }); continue; }
    // 2) 一个小格的四个角里已有三个：第四个 = 两个邻角之和 − 对角（平行四边形）
    for (let j = 0; j + 1 < ny; j++) for (let i = 0; i + 1 < nx; i++) {
      const q = [[i, j], [i + 1, j], [i, j + 1], [i + 1, j + 1]], miss = q.filter(([x, y]) => !at(x, y));
      if (miss.length !== 1) continue;
      const [mx, my] = miss[0], ox = mx === i ? i + 1 : i, oy = my === j ? j + 1 : j;
      if (got[my * nx + mx]) continue;
      got[my * nx + mx] = add(at(ox, my), at(mx, oy), at(ox, oy), n); any = true;
    }
    if (any) { got.forEach((v, k) => { if (v) cells[k] = v; }); continue; }
    // 3) 往外延伸：取同行最近的和同列最近的已给格点；两个都有就取平均
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      if (at(i, j)) continue;
      const near = (get, len, p) => { for (let d = 1; d < len; d++) { const a = p - d >= 0 ? get(p - d) : null, b = p + d < len ? get(p + d) : null; if (a || b) return a && b ? avg(a, b, n) : a || b; } return null; };
      const hx = near(x => at(x, j), nx, i), hy = near(y => at(i, y), ny, j);
      const v = hx && hy ? avg(hx, hy, n) : hx || hy;
      if (v) { got[j * nx + i] = v; any = true; }
    }
    got.forEach((v, k) => { if (v) cells[k] = v; });
  }
  return cells;
}

const locate = (stops, v) => {
  const m = stops.length;
  if (m === 1 || v <= stops[0]) return [0, 0];
  if (v >= stops[m - 1]) return [m - 2, 1];
  let i = 0; while (v > stops[i + 1]) i++;
  return [i, (v - stops[i]) / (stops[i + 1] - stops[i])];
};

// keyforms：[{ at: { 参数id: 值, … }, vec: Float64Array(n) }]；rest(id) 给参数的静止值。
// 按「用到哪几个参数」分组，每组一张格；静止格点没给就当零向量。返回 { groups, sample(get, out) }。
export function buildBlend(keyforms, n, rest) {
  const by = new Map();
  for (const k of keyforms) {
    const ids = Object.keys(k.at).sort();
    if (ids.length < 1 || ids.length > 2) throw new Error('关键形的 at 只能有 1 或 2 个参数：' + JSON.stringify(k.at));
    const key = ids.join('|'); if (!by.has(key)) by.set(key, { ids, list: [] }); by.get(key).list.push(k);
  }
  const groups = [];
  for (const { ids, list } of by.values()) {
    const stops = ids.map(id => [...new Set([rest(id), ...list.map(k => k.at[id])])].sort((a, b) => a - b));
    const nx = stops[0].length, ny = ids.length > 1 ? stops[1].length : 1;
    const cells = new Array(nx * ny).fill(null);
    const idx = at => (ids.length > 1 ? stops[1].indexOf(at[ids[1]]) : 0) * nx + stops[0].indexOf(at[ids[0]]);
    for (const k of list) { if (k.vec.length !== n) throw new Error('关键形向量长度不一致'); cells[idx(k.at)] = Float64Array.from(k.vec); }
    const r = idx(Object.fromEntries(ids.map(id => [id, rest(id)])));
    if (!cells[r]) cells[r] = new Float64Array(n);
    fillBlanks(cells, nx, ny, n);
    groups.push({ ids, stops, nx, ny, cells });
  }
  // 各组的插值结果相加（多个参数各推一份增量，互不干扰）
  const sample = (get, out) => {
    out.fill(0);
    for (const g of groups) {
      const [i, u] = locate(g.stops[0], get(g.ids[0]));
      const [j, v] = g.ny > 1 ? locate(g.stops[1], get(g.ids[1])) : [0, 0];
      const i1 = Math.min(i + 1, g.nx - 1), j1 = Math.min(j + 1, g.ny - 1);
      const a = g.cells[j * g.nx + i], b = g.cells[j * g.nx + i1], c = g.cells[j1 * g.nx + i], d = g.cells[j1 * g.nx + i1];
      const w00 = (1 - u) * (1 - v), w10 = u * (1 - v), w01 = (1 - u) * v, w11 = u * v;
      for (let k = 0; k < n; k++) out[k] += a[k] * w00 + b[k] * w10 + c[k] * w01 + d[k] * w11;
    }
    return out;
  };
  return { groups, sample };
}

// node --test puppet/engine/
import test from 'node:test';
import assert from 'node:assert/strict';
import { fillBlanks, buildBlend } from './blend.js';

const V = (...a) => Float64Array.from(a);
const near = (a, b) => assert.ok(a.length === b.length && [...a].every((x, i) => Math.abs(x - b[i]) < 1e-9), `${[...a]} ≠ ${[...b]}`);

test('3×3 只给中间一行的三个点：其余两行照抄（结果与另一个轴无关）', () => {
  const c = new Array(9).fill(null); c[3] = V(-10, 1); c[4] = V(0, 0); c[5] = V(20, 3);
  fillBlanks(c, 3, 3, 2);
  for (const j of [0, 2]) { near(c[j * 3], V(-10, 1)); near(c[j * 3 + 1], V(0, 0)); near(c[j * 3 + 2], V(20, 3)); }
});
test('3×3 给静止点、一个转头点、一个点头点：角上 = 两者相加', () => {
  const c = new Array(9).fill(null); c[4] = V(0, 0); c[5] = V(20, 0); c[7] = V(0, 8);
  fillBlanks(c, 3, 3, 2);
  near(c[8], V(20, 8));          // 右下角：平行四边形外推
  near(c[3], V(0, 0));           // 左中：没给负向关键形 → 取同行最近的已给格点，也就是静止形（不会自动镜像）
  near(c[1], V(0, 0));
  near(c[2], V(20, 0));          // 右上：同列最近的是转头点
});
test('行内两点之间线性插值；两个方向都能插时取平均', () => {
  const c = new Array(9).fill(null); c[3] = V(0); c[5] = V(10); c[1] = V(100); c[7] = V(200);
  fillBlanks(c, 3, 3, 1);
  near(c[4], V((5 + 150) / 2));
});
test('一维：两端之间插值，外面夹住', () => {
  const rest = () => 0;
  const b = buildBlend([{ at: { A: 30 }, vec: V(6) }, { at: { A: -30 }, vec: V(-3) }], 1, rest);
  const out = new Float64Array(1), at = a => b.sample(() => a, out)[0];
  assert.equal(at(0), 0); assert.equal(at(15), 3); assert.equal(at(-15), -1.5); assert.equal(at(99), 6); assert.equal(at(-99), -3);
});
test('二维填满时就是普通双线性', () => {
  const ks = []; const f = (x, y) => 2 * x + 3 * y + 0.01 * x * y;
  for (const x of [-30, 0, 30]) for (const y of [-30, 0, 30]) ks.push({ at: { X: x, Y: y }, vec: V(f(x, y)) });
  const b = buildBlend(ks, 1, () => 0), out = new Float64Array(1);
  const at = (x, y) => b.sample(id => (id === 'X' ? x : y), out)[0];
  for (const [x, y] of [[10, 20], [-7, 3], [30, -30], [0, 0]]) assert.ok(Math.abs(at(x, y) - f(x, y)) < 1e-9);
});
test('两组参数各自成格，结果相加；静止时为零', () => {
  const b = buildBlend([{ at: { X: 30 }, vec: V(5, 0) }, { at: { E: 0 }, vec: V(0, 9) }], 2, id => (id === 'E' ? 1 : 0));
  const out = new Float64Array(2);
  near(b.sample(id => (id === 'E' ? 1 : 0), out), V(0, 0));
  near(b.sample(id => (id === 'E' ? 0.5 : 30), out), V(5, 4.5));
});

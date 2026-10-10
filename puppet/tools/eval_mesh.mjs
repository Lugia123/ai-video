// 不开浏览器，用引擎算出某组参数下每个部件网格的顶点位置。给量具用（转头时每层动了多少、网格被拉伸了多少、对应点落在哪）。
//   node tools/eval_mesh.mjs <角色目录> '{"ParamAngleX":24}' ['{"ParamAngleX":-24}' …]   → 标准输出一个 JSON：
//   { parts: [{ id, group, texture, rect, order, cols, rows, rest: [x,y,…], uvs, triangles }], poses: [{ params, vertices: { 部件id: [x,y,…] } }] }
// 坐标是角色画布像素，不含刚体组（歪头）的变换——只看部件自己的位移和变形。
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Puppet } from '../engine/puppet.js';
const [pack, ...sets] = process.argv.slice(2);
const J = async f => JSON.parse(await readFile(f, 'utf8'));
const C = await J(path.join(pack, 'character.json')), parts = await J(path.join(pack, C.files.parts));
const noGroups = { ...C, groups: [] }, p = new Puppet(noGroups, parts);
const snap = () => Object.fromEntries(p.evaluate().filter(i => !i.overlay).map(i => [i.id, Array.from(i.vertices, v => +v.toFixed(3))]));
p.params.reset(); const rest = snap();
const out = { unit: C.unit, parts: p.parts.map(q => ({ id: q.def.id, group: q.def.group, texture: q.def.texture, rect: q.def.rect, order: q.def.order, grid: q.def.mesh?.grid ?? [1, 1], rest: rest[q.def.id], uvs: Array.from(q.mesh.uvs), triangles: Array.from(q.mesh.triangles) })), poses: [] };
for (const s of sets) { p.params.reset(); p.set(JSON.parse(s)); out.poses.push({ params: JSON.parse(s), vertices: snap() }); }
console.log(JSON.stringify(out));

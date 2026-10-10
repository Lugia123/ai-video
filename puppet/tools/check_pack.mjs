#!/usr/bin/env node
// 校验一个角色数据包：node tools/check_pack.mjs characters/<id>
// 查：json 能读、必需字段齐、部件 id 不重复、每个被引用的贴图 / 姿势图都在、槽位和遮罩和挂点引用的部件存在、讲解员要的 host 字段齐。
// 只查结构和文件，不看图。退出码 0 = 通过。（正式的 JSON Schema 还没写，这是它之前的最小校验。）
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
const dir = process.argv[2]; if (!dir) { console.error('用法：node tools/check_pack.mjs <角色目录>'); process.exit(2); }
const errs = [], J = async f => JSON.parse(await readFile(path.join(dir, f), 'utf8')), has = async f => access(path.join(dir, f)).then(() => true, () => false);
const need = (o, keys, where) => { for (const k of keys) if (o?.[k] === undefined) errs.push(`${where} 缺 ${k}`); };
let C, parts;
try { C = await J('character.json'); } catch (e) { console.error('character.json 读不了：' + e.message); process.exit(1); }
need(C, ['version', 'id', 'canvas', 'unit', 'parameters', 'files'], 'character.json'); need(C.unit, ['R', 'headCenter'], 'unit');
try { parts = await J(C.files.parts); } catch (e) { console.error('部件表读不了：' + e.message); process.exit(1); }
const ids = new Set(), params = new Set((C.parameters || []).map(p => p.id));
for (const p of parts) {
  need(p, ['id', 'texture', 'rect', 'order'], `部件 ${p.id}`);
  if (ids.has(p.id)) errs.push(`部件 id 重复：${p.id}`); ids.add(p.id);
  if (!(await has(p.texture))) errs.push(`贴图不在：${p.texture}（部件 ${p.id}）`);
  if (p.weight && !(await has(p.weight))) errs.push(`权重图不在：${p.weight}`);
  for (const k of p.keyforms || []) for (const id of Object.keys(k.at)) if (!params.has(id)) errs.push(`部件 ${p.id} 的关键形用了没声明的参数 ${id}`);
}
for (const p of parts) for (const m of p.mask?.by || []) if (!ids.has(m)) errs.push(`部件 ${p.id} 的遮罩引用了不存在的部件 ${m}`);
for (const [s, list] of Object.entries(C.slots || {})) for (const id of list) if (!ids.has(id)) errs.push(`槽位 ${s} 引用了不存在的部件 ${id}`);
for (const [n, a] of Object.entries(C.anchors || {})) if (a.part && !ids.has(a.part)) errs.push(`挂点 ${n} 引用了不存在的部件 ${a.part}`);
for (const o of C.overlays || []) if (o.clipTo && !ids.has(o.clipTo)) errs.push(`叠加层 ${o.id} 的 clipTo 引用了不存在的部件 ${o.clipTo}`);
for (const ax of Object.values(C.turn || {})) if (!params.has(ax.parameter)) errs.push(`turn 用了没声明的参数 ${ax.parameter}`);
let poseCount = 0;
if (C.host) {
  need(C.host, ['height', 'foot', 'kit', 'shoulders', 'midX', 'points', 'pointDepth'], 'host');
  try { const poses = await J(path.join(C.host.kit, 'poses.json')); poseCount = Object.keys(poses).length;
    if (!poses.idle) errs.push('姿势库里没有 idle');
    if (!(await has(path.join(C.host.kit, 'base.png')))) errs.push('姿势库缺 base.png');
    for (const [n, p] of Object.entries(poses)) for (const k of ['arms', 'over', 'full', 'handmask']) if (p[k] && !(await has(path.join(C.host.kit, p[k])))) errs.push(`姿势 ${n} 的 ${k} 图不在：${p[k]}`);
  } catch (e) { errs.push('姿势库 poses.json 读不了：' + e.message); }
}
if (errs.length) { console.error(errs.map(e => '✗ ' + e).join('\n')); console.error(`${errs.length} 处问题`); process.exit(1); }
console.log(`通过：${C.id}，${parts.length} 个部件，${params.size} 个参数${C.host ? `，${poseCount} 个姿势` : '（没有 host 字段：只能当头用，不能当讲解员）'}`);

// 回归检查里只靠数据包和引擎（不用浏览器）就能判的几条：层序、半笑时眼睛的不透明度、姿势是不是都共用一张身体。
//   node puppet/qa/regress/engine_checks.mjs <角色目录> <配置.json>   → 往标准输出打一个 JSON 数组
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Puppet } from '../../engine/puppet.js';
const [pack, cfgFile] = process.argv.slice(2);
const J = async f => JSON.parse(await readFile(f, 'utf8'));
const C = await J(path.join(pack, 'character.json')), parts = await J(path.join(pack, C.files.parts)), cfg = await J(cfgFile), R = cfg.roles;
const p = new Puppet(C, parts), out = [];
const order = () => Object.fromEntries(p.evaluate().map(i => [i.id, i.order]));
const arr = x => [].concat(x ?? []);
// 1 脖子：后发 < 脖子 < 脸
{ const o = order(), neck = o[R.neck], back = Math.max(...arr(R.backHair).map(id => o[id])), face = o[R.face];
  out.push({ id: 'neck-order', title: '脖子在后发之上、脸之下（层序）', auto: true, pass: neck !== undefined && back < neck && neck < face, value: { 后发最高: back, 脖子: neck, 脸: face } }); }
// 13 贴脸层：脸 < 脸层 < 刘海
{ const o = order(), fl = o['@face'], face = o[R.face], bang = Math.min(...arr(R.bangs).map(id => o[id]));
  out.push({ id: 'facelayer-order', title: '贴脸层在脸之上、刘海之下（层序）', auto: true, pass: fl !== undefined && face < fl && fl < bang, value: { 脸: face, 贴脸层: fl, 刘海最低: bang } }); }
// 17 半笑时眼白和虹膜必须完全不透明（闭合不到阈值之前不许淡出）
{ const E = cfg.eyes, ids = [...arr(R.eyeWhites), ...arr(R.irises)], rows = []; let worst = 1;
  for (let s = 0; s <= 1.0001; s += 0.1) {
    p.params.reset(); for (const id of E.smile) p.params.set(id, s);
    const it = p.evaluate().filter(i => ids.includes(i.id)), op = Math.min(...it.map(i => i.opacity));
    rows.push([+s.toFixed(1), +op.toFixed(3)]); if (s <= E.hideAtClosure - 0.02) worst = Math.min(worst, op);
  }
  out.push({ id: 'half-smile-eyes', title: `笑眼不到 ${E.hideAtClosure} 时眼白 / 虹膜不许半透明`, auto: true, pass: worst > 0.99, value: { 最低不透明度: +worst.toFixed(3), 逐档: rows } }); }
// 10 姿势切换不「换衣服」：A 类姿势都只换手臂层、共用一张身体底图；B 类整图要另外量比例
{ let poses = {}; try { poses = await J(path.join(pack, 'kit/poses.json')); } catch {}
  const B = Object.entries(poses).filter(([, v]) => v.kind === 'B').map(([k]) => k), A = Object.keys(poses).filter(k => !B.includes(k));
  out.push({ id: 'pose-same-body', title: '姿势切换不换衣服（A 类共用身体底图）', auto: true, pass: B.length === 0, value: { A类: A, B类: B }, note: B.length ? 'B 类整图姿势需要另外量「头大小、领口到裙摆」和待机之差——这条检查还没写' : '全部是 A 类：身体是同一张图，结构上不会变' }); }
console.log(JSON.stringify(out));

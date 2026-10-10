// 列出成片里讲解员所有换姿势的时刻，并核节奏规则：相邻两次间隔 ≥ 2 秒、任意 3 秒内 ≤ 2 次。
//   node puppet/tools/pose_changes.mjs <相对仓库根的页面?查询> <kit 的 poses.json>
// 姿势的取法和 host-pose.js 一致：脚本 state.pose 里权重最大且 > 0.5、且姿势库里有的那个，否则待机；按帧（1/30 秒）取。
import { chromium, serve, urlFor, missing, PUPPET } from './_env.mjs';
import { readFile } from 'node:fs/promises';
const [page_, posesFile] = process.argv.slice(2);
const KIT = Object.keys(JSON.parse(await readFile(posesFile, 'utf8'))), ALIAS = { pointL: 'present', pointR: 'present', clasp: 'fist' };
const server = await serve();
const browser = await chromium.launch(), page = await browser.newPage();
page.on('pageerror', e => console.error('页面错误：', e.message));
await page.goto(urlFor(server, page_));
await page.waitForFunction(() => window.__video && window.__debug, null, { timeout: 60000 });
const frames = await page.evaluate(() => { const D = window.__video.duration, a = []; for (let i = 0; i / 30 < D; i++) { const s = window.__debug.hostScript(i / 30) || {}; a.push([s.pose || {}, s.emote?.name ?? null]); } return a; });
await browser.close(); server.close();
const name = w => { let best = 'idle', bw = 0.5; for (const [k, v] of Object.entries(w)) { const n = ALIAS[k] || k; if (KIT.includes(n) && v > bw) { bw = v; best = n; } } return best; };
const changes = []; let prev = name(frames[0][0]);
frames.forEach(([w, em], i) => { const n = name(w); if (n !== prev) { changes.push({ t: i / 30, from: prev, to: n, emote: em }); prev = n; } });
let bad = 0;
console.log(`开头姿势 ${name(frames[0][0])}；共换 ${changes.length} 次：`);
changes.forEach((c, i) => {
  const gap = i ? c.t - changes[i - 1].t : null, in3 = changes.filter(d => d.t > c.t - 3 && d.t <= c.t).length;
  const flag = (gap !== null && gap < 2 ? ' ← 间隔 < 2 秒' : '') + (in3 > 2 ? ' ← 3 秒内第 ' + in3 + ' 次' : ''); if (flag) bad++;
  console.log(`  ${c.t.toFixed(2).padStart(7)}s  ${c.from} → ${c.to}${c.emote ? '（表情 ' + c.emote + '）' : ''}${gap !== null ? '   距上次 ' + gap.toFixed(2) + 's' : ''}${flag}`);
});
const gaps = changes.slice(1).map((c, i) => c.t - changes[i].t);
console.log(`最短间隔 ${Math.min(...gaps).toFixed(2)}s；不合规 ${bad} 处`);

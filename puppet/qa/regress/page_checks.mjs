// 回归检查里要在成片页面上跑的两条：点头有没有被削平顶、换姿势的节奏。
//   node puppet/qa/regress/page_checks.mjs <相对仓库根的页面?查询> <角色目录>   → 往标准输出打一个 JSON 数组
// 页面要有 window.__video 和 window.__debug.hostScript(t) / hostAnchors()。
import { chromium, serve, urlFor, missing, PUPPET } from '../../tools/_env.mjs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const [page_, pack, cfgFile] = process.argv.slice(2);
const J = async f => JSON.parse(await readFile(f, 'utf8'));
const C = await J(path.join(pack, 'character.json')), KIT = Object.keys(await J(path.join(pack, 'kit/poses.json'))), cfg = await J(cfgFile), TH = cfg.thresholds;
const tp = C.parameters.find(p => p.id === C.turn.y.parameter), hard = Math.min(Math.abs(tp.min), tp.max);
const server = await serve();
const browser = await chromium.launch(), page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', e => console.error('页面错误：', e.message));
await page.goto(urlFor(server, page_));
await page.waitForFunction(() => window.__video && window.__debug, null, { timeout: 60000 });
if (await page.evaluate(() => !!window.__video.ready)) await page.evaluate(() => window.__video.ready);
const { poses, pitch, fps } = await page.evaluate(() => {
  const V = window.__video, D = V.duration, poses = [], pitch = [];
  for (let i = 0; i / V.fps < D; i++) { const t = i / V.fps; poses.push((window.__debug.hostScript(t) || {}).pose || {}); V.seek(t); pitch.push(window.__debug.hostAnchors()?.head?.pitch ?? 0); }
  return { poses, pitch, fps: V.fps };
});
// ── 两条要讲解员在场才能做的运行时检查（页面的 __debug.host 是 puppet/host 的讲解员时才跑）
// PUPPET_BREAK=body|hands：故意弄坏，确认对应的检查会响（body = 换姿势时给身体加一点倾斜；hands = 把符号层不挖洞直接盖上去）
const runtime = await page.evaluate(async BREAK => {
  const host = window.__debug.host, V = window.__video; if (!host?.layerMask) return null;
  const W = host.canvas.width, H = host.canvas.height, grab = () => host.canvas.getContext('2d').getImageData(0, 0, W, H).data;
  const alpha = (cv, th) => { const d = cv.getContext('2d').getImageData(0, 0, W, H).data, m = new Uint8Array(W * H); for (let i = 0; i < m.length; i++) m[i] = d[i * 4 + 3] > th ? 1 : 0; return m; };
  const grow = (m, r) => { let a = m; for (let k = 0; k < r; k++) { const b = new Uint8Array(a); for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = y * W + x; if (a[i - 1] | a[i + 1] | a[i - W] | a[i + W]) b[i] = 1; } a = b; } return a; };
  const shrink = (m, r) => { const inv = m.map(v => 1 - v), g = grow(inv, r); return g.map(v => 1 - v); };
  // A 切换前后身体没变：同一时刻、同一套状态，只换姿势，各画一帧；去掉两边的手臂层和下巴以上（头会因姿势限幅不同而动），剩下的身体像素必须逐像素相同
  const base = (V.__regressBase ?? { x: host.canvas.width / 2 / (window.devicePixelRatio || 1) }), poses = host.poses, tA = 2.0, body = [];
  const shot = pose => { host.direct(() => ({ x: 1330, talk: false, look: null, pose: pose === 'idle' ? {} : { [pose]: 1 }, swapFx: 'a', ...(BREAK === 'body' && pose !== 'idle' ? { lean: 0.01 } : {}) })); host.topLayerEmpty = host.backLayerEmpty = host.faceLayerEmpty = true; host.draw(tA);
    const arms = alpha(host.layerMask('arms'), 8), over = alpha(host.layerMask('over'), 8); return { px: grab(), arms, over, chin: host.anchors().pt.chin.y, base: alpha(host.layerMask('base'), 128) }; };
  const ref = shot('idle'), dpr = W / V.width;
  for (const p of poses) { if (p === 'idle' || host.poseInfo[p].kind === 'B') continue; const cur = shot(p);
    let mask = new Uint8Array(W * H); for (let i = 0; i < mask.length; i++) mask[i] = ref.arms[i] | ref.over[i] | cur.arms[i] | cur.over[i]; mask = grow(mask, 3);
    const y0 = Math.ceil((Math.max(ref.chin, cur.chin) + 40) * dpr); let n = 0, diff = 0;
    for (let y = y0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x; if (!ref.base[i] || mask[i]) continue; n++; const j = i * 4; if (ref.px[j] !== cur.px[j] || ref.px[j + 1] !== cur.px[j + 1] || ref.px[j + 2] !== cur.px[j + 2] || ref.px[j + 3] !== cur.px[j + 3]) diff++; }
    body.push({ pose: p, compared: n, diff }); }
  host.direct(window.__debug.hostScript);
  // B 漫符不盖手：最上层有符号、且当前姿势有「盖在头前面的手臂层」的时刻——带符号画一遍、不带符号再画一遍，手臂层完全不透明的范围内两遍必须逐像素相同
  const hands = [], D = V.duration; let lastPose = null;
  for (let t = 0.5; t < D; t += 0.5) {
    V.seek(t); const pose = host.pose(); if (host.topLayerEmpty || !host.poseInfo[pose]?.over || pose === lastPose) continue;
    if (BREAK === 'hands') { const g = host.canvas.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(host.topLayer, 0, 0); }
    const withSym = grab(), top = alpha(host.topLayer, 32), over = alpha(host.layerMask('over'), 254);          // 只比手臂层完全不透明的地方：缩放后的边缘有 2–3 像素的半透明过渡，符号会按比例从那里透出来，那是抗锯齿不是「盖住手」
    let want = 0; for (let i = 0; i < top.length; i++) if (top[i] && over[i]) want++;
    host.topLayerEmpty = true; host.draw(t); const noSym = grab(); let diff = 0, n = 0;
    for (let i = 0; i < over.length; i++) if (over[i]) { n++; const j = i * 4; if (withSym[j] !== noSym[j] || withSym[j + 1] !== noSym[j + 1] || withSym[j + 2] !== noSym[j + 2]) diff++; }
    hands.push({ t, pose, handPx: n, symbolOverHandPx: want, diff }); lastPose = pose; V.seek(t);
  }
  return { body, hands };
}, process.env.PUPPET_BREAK || '');
await browser.close(); server.close();
const out = [];
if (runtime) {
  const b = runtime.body, h = runtime.hands;
  out.push({ id: 'pose-body-unchanged', title: '换姿势时身体没变（去掉手臂层和头，逐像素比）', auto: true, pass: b.length > 0 && b.every(x => x.diff === 0 && x.compared > 5000), value: { 每个姿势对比待机: b.map(x => `${x.pose}：比了 ${x.compared} 像素，不同 ${x.diff}`) } });
  const tested = h.filter(x => x.symbolOverHandPx > 0);
  out.push({ id: 'emote-not-over-hands', title: '漫符不盖手（盖在头前面的手臂层范围内，带符号和不带符号逐像素相同）', auto: true, pass: h.length > 0 && h.every(x => x.diff <= TH.emoteOverHandMaxPx), value: { 检查的时刻: h.map(x => `${x.t}s ${x.pose}：手臂层 ${x.handPx} 像素，符号想画到手上的 ${x.symbolOverHandPx} 像素，实际被盖 ${x.diff}`), 容差: TH.emoteOverHandMaxPx }, note: tested.length ? undefined : '这页里没有哪个时刻符号真的落到手上——检查没有被真正触发，结论只是「没发现」' });
}
// 15 点头不削顶：俯仰贴着硬上限连续好几帧 = 被夹成了平顶
{ let run = 0, worst = 0; const lim = hard * 0.985; for (const p of pitch) { run = Math.abs(p) >= lim ? run + 1 : 0; worst = Math.max(worst, run); }
  const mx = Math.max(...pitch.map(Math.abs));
  out.push({ id: 'nod-plateau', title: '点头没有被削成平顶', auto: true, pass: worst < TH.pitchPlateauFrames, value: { 俯仰范围: [+Math.min(...pitch).toFixed(2), +Math.max(...pitch).toFixed(2)], 数据包硬上限: hard, 贴着上限的最长连续帧数: worst, 离上限还差: +(hard - mx).toFixed(2) } }); }
// 16 换姿势间隔
{ const ALIAS = { pointL: 'present', pointR: 'present', clasp: 'fist' };
  const name = w => { let best = 'idle', bw = 0.5; for (const [k, v] of Object.entries(w)) { const n = ALIAS[k] || k; if (KIT.includes(n) && v > bw) { bw = v; best = n; } } return best; };
  const ch = []; let prev = name(poses[0]); poses.forEach((w, i) => { const n = name(w); if (n !== prev) { ch.push({ t: +(i / fps).toFixed(2), from: prev, to: n }); prev = n; } });
  const gaps = ch.slice(1).map((c, i) => c.t - ch[i].t), minGap = gaps.length ? Math.min(...gaps) : null;
  const dense = ch.filter(c => ch.filter(d => d.t > c.t - 3 && d.t <= c.t).length > TH.poseIn3sMax).length;
  out.push({ id: 'pose-pacing', title: `换姿势间隔 ≥ ${TH.poseGapMin} 秒、任意 3 秒内 ≤ ${TH.poseIn3sMax} 次`, auto: true, pass: (minGap === null || minGap >= TH.poseGapMin - 1e-6) && dense === 0, value: { 换姿势次数: ch.length, 最短间隔: minGap === null ? null : +minGap.toFixed(2), '3 秒内超限处': dense, 时刻: ch.map(c => `${c.t}s ${c.from}→${c.to}`) } }); }
console.log(JSON.stringify(out));

// 讲解员换姿势统计：node tools/render/pose-stats.mjs <集目录>
// 以 ?render=1 打开页面，按镜头取当时在画的那个讲解员（window.__debug.buddies 的顺序 = 镜头顺序里出现的顺序），
// 每 1/30 秒采样 state(t) 的 body+face+mirror（眨眼不算，说话的嘴型开合不算），统计「换姿势」次数和最短间隔（只算同一镜头内的；镜头切换不算）。
import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const ROOT = process.cwd(), dir = process.argv[2];
const T = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' };
const srv = http.createServer((q, r) => { const p = path.join(ROOT, decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': T[path.extname(p)] ?? 'application/octet-stream' }); fs.createReadStream(p).pipe(r); }).listen(0);
const b = await chromium.launch(); const pg = await b.newPage();
await pg.goto(`http://localhost:${srv.address().port}/${dir}/index.html?render=1`);
await pg.waitForFunction(() => window.__video && window.__debug?.buddies, null, { timeout: 60000 });
const res = await pg.evaluate(() => {
  const { buddies, SHOTS } = window.__debug, D = window.__video.duration;
  const out = [];
  for (const [bi, bd] of buddies.entries()) {
    let prev = null, tPrev = 0;
    for (let i = 0; i <= D * 30; i++) {
      const t = i / 30, st = bd.state(t);
      // 眨眼不算换姿势；说话时嘴开合算同一个「说话」姿势
      // 眨眼的脸 = 同一个身体上一帧的脸（身体刚换就眨眼时算 idle 脸）
      let face = st.face === 'blink' ? (prev && prev.split('|')[0] === (st.body.startsWith('walk') ? 'walk' : st.body) ? prev.split('|')[1] : 'idle') : st.face;
      if (st.body === 'talk_open') face = 'talk';
      const k = `${st.body.startsWith("walk") ? "walk" : st.body}|${face}|${st.mirror}`;   // 走路四帧轮换算一个姿势
      if (prev !== null && k !== prev) out.push({ b: bi, t, from: prev, to: k });
      prev = k;
    }
  }
  return { ev: out, shots: SHOTS };
});
await b.close(); srv.close();
// 只保留「这个讲解员所在镜头正在播」的事件：按镜头顺序，第 i 个有讲解员的镜头 ↔ buddies[i]
const shots = res.shots.map((s, i) => ({ ...s, t1: res.shots[i + 1]?.t0 ?? 1e9 }));
const byShot = new Map();
for (const e of res.ev) {
  const sh = shots.find(s => e.t >= s.t0 && e.t < s.t1);
  (byShot.get(e.b) ?? byShot.set(e.b, []).get(e.b)).push({ ...e, shot: sh?.id });
}
// 讲解员 i 的「自己的镜头」= 它第一次换姿势所在的镜头（镜头切走后才收手的那一下画面上看不到，不算）
let all = [];
for (const [bi, evs] of byShot) {
  const own = evs[0].shot;
  all.push(...evs.filter(e => e.shot === own));
}
all.sort((a, b) => a.t - b.t);
let minGap = Infinity, minAt = null;
for (let i = 1; i < all.length; i++) if (all[i].shot === all[i - 1].shot && all[i].t - all[i - 1].t < minGap) { minGap = all[i].t - all[i - 1].t; minAt = all[i]; }
const per = {}; all.forEach(e => per[e.shot] = (per[e.shot] ?? 0) + 1);
console.log(JSON.stringify({ changes: all.length, minGap: +minGap.toFixed(2), minAt: minAt && { t: +minAt.t.toFixed(2), shot: minAt.shot, from: minAt.from, to: minAt.to }, perShot: per }));
if (process.argv.includes('--list')) all.forEach(e => console.log(e.t.toFixed(2), e.shot, e.from, '→', e.to));

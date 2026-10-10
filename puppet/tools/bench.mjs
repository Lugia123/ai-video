// 量一个页面的单帧耗时：node puppet/tools/bench.mjs <相对 puppet/ 的页面?查询> [帧数=60]
// 打印 seek() 的中位数 / 平均 / 最大毫秒，以及 seek + 截图的中位数（渲染器实际每帧做的事）。
import { chromium, serve, urlFor, missing, PUPPET } from './_env.mjs';
const [page_, n = '60'] = process.argv.slice(2);
const server = await serve();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', e => console.error('页面错误：', e.message));
await page.goto(urlFor(server, page_));
await page.waitForFunction(() => window.__video, null, { timeout: 60000 });
const N = Number(n), dur = await page.evaluate(() => window.__video.duration);
const inPage = await page.evaluate(({ N, dur }) => { const a = []; for (let i = 0; i < N; i++) { const t0 = performance.now(); window.__video.seek(dur * i / N); a.push(performance.now() - t0); } return a; }, { N, dur });
const shots = [];
for (let i = 0; i < Math.min(N, 20); i++) { const t0 = Date.now(); await page.evaluate(t => window.__video.seek(t), dur * i / 20); await page.screenshot({ type: 'png' }); shots.push(Date.now() - t0); }
const st = a => { const s = [...a].sort((x, y) => x - y); return `中位 ${s[s.length >> 1].toFixed(1)}  平均 ${(a.reduce((x, y) => x + y, 0) / a.length).toFixed(1)}  最大 ${s.at(-1).toFixed(1)}`; };
console.log(`seek()：${st(inPage)} ms   seek+截图：${st(shots)} ms`);
await browser.close(); server.close();

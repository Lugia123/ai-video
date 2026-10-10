// 给 puppet 下的页面截图（有 #stage 截 #stage，否则截 #c 画布）：
//   node puppet/tools/shot.mjs <相对 puppet/ 的页面?查询> <输出.png> [t]
// 需要本仓 tools/render 里装的 playwright（从仓库根目录运行）。
import { chromium, serve, urlFor, missing, PUPPET } from './_env.mjs';
const [page_, out, t = '0'] = process.argv.slice(2);
const server = await serve();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
let bad = false;
page.on('pageerror', e => { bad = true; console.error('页面错误：', e.message); });
page.on('console', m => { if (m.type() === 'error') console.error('[page]', m.text()); });
await page.goto(urlFor(server, page_));
await page.waitForFunction(() => window.__video, null, { timeout: 30000 });
if (await page.evaluate(() => !!window.__video.ready)) await page.evaluate(() => window.__video.ready);
await page.evaluate(t => window.__video.seek(t), Number(t));
await page.locator((await page.locator('#stage').count()) ? '#stage' : '#c').screenshot({ path: out });
await browser.close(); server.close();
process.exit(bad ? 1 : 0);

// 把讲解员自己那张画布（不含页面上别的层、不经任何页面裁切）原样导出成透明底 PNG：
//   node puppet/tools/host_canvas.mjs <相对仓库根的页面?查询> <t> <输出.png>
import { chromium, serve, urlFor, missing, PUPPET } from './_env.mjs';
const [page_, t, out] = process.argv.slice(2);
const server = await serve();
const browser = await chromium.launch(), page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', e => console.error('页面错误：', e.message));
await page.goto(urlFor(server, page_));
await page.waitForFunction(() => window.__video, null, { timeout: 60000 });
if (await page.evaluate(() => !!window.__video.ready)) await page.evaluate(() => window.__video.ready);
const url = await page.evaluate(t => { window.__video.seek(t); return document.querySelector('#host canvas').toDataURL('image/png'); }, Number(t));
await writeFile(out, Buffer.from(url.split(',')[1], 'base64'));
await browser.close(); server.close();

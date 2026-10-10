// puppet 引擎入口（浏览器）。
//   const p = await createPuppet('characters/xxx/', { width, height });
//   p.set({ ParamAngleX: 12 });           // 设参数
//   p.draw(ctx2d, { x, y, scale });        // 画到宿主的 2D 画布：角色画布像素 (px,py) → (x + px·scale, y + py·scale)
//   p.anchors()                            // 挂点（屏幕坐标，按最近一次 draw 的摆放）；anchors('rest') 是静止位置（角色画布像素）
//   p.layer('face')                        // 叠加层的 2D 画布和它的绘图上下文；宿主往上画，引擎把它当一个部件叠进去
import { Puppet } from './puppet.js';
import { WebGLRenderer } from './render-webgl.js';
export { Puppet } from './puppet.js';
export { buildBlend, fillBlanks } from './blend.js';

export async function createPuppet(base, { width = 1920, height = 1080, layerScale = 0.5, masks = true, canvas = null } = {}) {
  const url = f => new URL(f, new URL(base.endsWith('/') ? base : base + '/', location.href)).href;
  const json = f => fetch(url(f)).then(r => { if (!r.ok) throw new Error(`读不到 ${f}`); return r.json(); });
  const character = await json('character.json'), parts = await json(character.files.parts);
  const core = new Puppet(character, parts);
  const gl = canvas ?? Object.assign(document.createElement('canvas'), { width, height });
  const renderer = new WebGLRenderer(gl);
  await Promise.all([...new Set(parts.map(p => p.texture))].map(async t => {
    const blob = await fetch(url(t)).then(r => { if (!r.ok) throw new Error(`读不到贴图 ${t}`); return r.blob(); });
    renderer.setTexture(t, await createImageBitmap(blob, { premultiplyAlpha: 'premultiply', colorSpaceConversion: 'none' }));
  }));
  const { width: CW, height: CH } = character.canvas, layers = new Map();
  let place = { x: 0, y: 0, scale: 1 };
  const api = {
    character, core, canvas: gl,
    set(v) { core.set(v); return api; },
    get: id => core.get(id),
    setPartWeight(id, k) { core.setPartWeight(id, k); return api; },
    evaluate: () => core.evaluate(),
    // 叠加层：画布 = 角色画布 × layerScale；ctx 已经缩放好，直接用角色画布像素画。每帧画之前调 clear()。
    layer(id) {
      if (!layers.has(id)) {
        const c = document.createElement('canvas'); c.width = Math.round(CW * layerScale); c.height = Math.round(CH * layerScale);
        const ctx = c.getContext('2d'); ctx.setTransform(layerScale, 0, 0, layerScale, 0, 0);
        layers.set(id, { canvas: c, ctx, scale: layerScale, dirty: false, clear() { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, c.width, c.height); ctx.restore(); this.dirty = true; }, touch() { this.dirty = true; } });
      }
      return layers.get(id);
    },
    render(p = place) {
      place = p;
      for (const [id, L] of layers) if (L.dirty) { renderer.setTexture('@' + id, L.canvas, { dynamic: true }); L.dirty = false; }
      let items = core.evaluate();
      if (!masks) items = items.map(i => (i.overlay ? i : { ...i, mask: null }));
      renderer.draw(items, p);
      return gl;
    },
    draw(ctx, p) { ctx.drawImage(api.render(p), 0, 0); },
    // space：'screen'（默认，按摆放换算到屏幕）、'canvas'（角色画布像素，含刚体组）、'local'（不含组）、'rest'（静止位置，画带深度的叠加层用）
    anchors(space = 'screen') {
      const a = core.anchors(space === 'screen' ? 'canvas' : space);
      if (space === 'screen') for (const k in a) { a[k].x = place.x + a[k].x * place.scale; a[k].y = place.y + a[k].y * place.scale; }
      return a;
    },
  };
  return api;
}

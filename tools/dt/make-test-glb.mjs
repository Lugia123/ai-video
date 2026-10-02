// 生成 3D 查看器的测试模型（three r170 GLTFExporter，在无头 Chromium 里跑）：
//   test-rigged.glb  3 节骨骼的圆柱，两个动画片段 swing / twist
//   test-static.glb  无骨骼无动画，带一张 256×256 贴图
//   node tools/dt/make-test-glb.mjs [out_dir=episodes/cast-cyber-girl/3d/_test]
import { chromium } from 'playwright';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT = path.resolve(process.argv[2] ?? 'episodes/cast-cyber-girl/3d/_test');
const ORIGIN = 'http://local.test';

const PAGE = `<!doctype html><script type="importmap">{"imports":{"three":"/assets/vendor/three/three.module.min.js"}}</script>
<script type="module">
import * as THREE from 'three';
import { GLTFExporter } from '/assets/vendor/three/examples/jsm/exporters/GLTFExporter.js';

function rigged() {
  const H = 3, SEG = 3, h = H / SEG;
  const geo = new THREE.CylinderGeometry(0.25, 0.32, H, 16, SEG * 6, false);
  geo.translate(0, H / 2, 0);
  const pos = geo.attributes.position, idx = [], wt = [];
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i), f = Math.min(y / h, SEG - 1e-6), b = Math.floor(f), t = f - b;
    const nb = Math.min(b + 1, SEG - 1);
    idx.push(b, nb, 0, 0); wt.push(nb === b ? 1 : 1 - t, nb === b ? 0 : t, 0, 0);
  }
  geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(idx, 4));
  geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(wt, 4));
  const bones = [];
  for (let i = 0; i < SEG; i++) {
    const b = new THREE.Bone(); b.name = 'bone' + i; b.position.y = i === 0 ? 0 : h;
    if (i) bones[i - 1].add(b); bones.push(b);
  }
  const mesh = new THREE.SkinnedMesh(geo, new THREE.MeshStandardMaterial({ color: 0xE0533A, roughness: 0.6 }));
  mesh.name = 'tube';
  mesh.add(bones[0]); mesh.bind(new THREE.Skeleton(bones));
  const root = new THREE.Group(); root.name = 'test-rigged'; root.add(mesh);

  const T = [0, 0.5, 1, 1.5, 2];
  const q = (ax, a) => new THREE.Quaternion().setFromAxisAngle(ax, a).toArray();
  const track = (bone, ax, amps) => new THREE.QuaternionKeyframeTrack(bone + '.quaternion', T, T.flatMap((_, k) => q(ax, amps[k])));
  const Z = new THREE.Vector3(0, 0, 1), Y = new THREE.Vector3(0, 1, 0);
  const s = [0, 0.5, 0, -0.5, 0];
  const swing = new THREE.AnimationClip('swing', 2, ['bone0', 'bone1', 'bone2'].map((b, i) => track(b, Z, s.map(v => v * (0.4 + 0.3 * i)))));
  const w = [0, 0.8, 0, -0.8, 0];
  const twist = new THREE.AnimationClip('twist', 2, ['bone1', 'bone2'].map(b => track(b, Y, w)));
  return { root, animations: [swing, twist] };
}

function staticModel() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? '#F0B43C' : '#3E6FB0'; g.fillRect(x * 32, y * 32, 32, 32); }
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const root = new THREE.Group(); root.name = 'test-static';
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.28, 160, 24), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 }));
  knot.position.y = 1.4; knot.name = 'knot';
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.3, 1.4), new THREE.MeshStandardMaterial({ color: 0x4E9A6A }));
  base.position.y = 0.15; base.name = 'base';
  root.add(knot, base);
  return { root, animations: [] };
}

const toB64 = buf => { let s = ''; const u = new Uint8Array(buf); for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000)); return btoa(s); };
const exp = new GLTFExporter();
window.out = {};
for (const [name, fn] of [['test-rigged', rigged], ['test-static', staticModel]]) {
  const { root, animations } = fn();
  const buf = await exp.parseAsync(root, { binary: true, animations });
  window.out[name] = toB64(buf);
}
window.done = true;
</script>`;

const browser = await chromium.launch();
const page = await browser.newPage();
page.on('pageerror', e => { console.error(e); process.exitCode = 1; });
await page.route(ORIGIN + '/**', async route => {
  const p = new URL(route.request().url()).pathname;
  if (p === '/') return route.fulfill({ contentType: 'text/html', body: PAGE });
  route.fulfill({ contentType: 'text/javascript', body: await readFile(path.join(ROOT, p)) });
});
await page.goto(ORIGIN + '/');
await page.waitForFunction('window.done === true', null, { timeout: 30000 });
const out = await page.evaluate('window.out');
await browser.close();
await mkdir(OUT, { recursive: true });
for (const [name, b64] of Object.entries(out)) {
  const f = path.join(OUT, name + '.glb');
  await writeFile(f, Buffer.from(b64, 'base64'));
  console.log(path.relative(process.cwd(), f), Buffer.from(b64, 'base64').length, 'bytes');
}

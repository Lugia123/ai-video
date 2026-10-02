// kits/kaleido-tunnel.js —— 万花筒数据隧道（#1048 / #1053 共用）：副歌 2 结尾她被吸进去的地方、主歌 3 开头她飞过的地方是同一条。
//
// 两样东西：
//   ① createKaleidoTunnel({ sides, apothem, length })：一条多棱镜筒。内壁是镜面一样的深色，上面流着数据光（0 / 1 / 符号一格格往前涌），
//      棱上是粉 / 薄荷 / 柠黄的霓虹线，每隔 ring 米一圈亮环（看得出速度）。远处雾成深紫，尽头可以亮成出口（exit 0..1）。
//   ② createKaleidoMirror(renderer, { sides, apothem })：把「她」折射成对称的一圈影子。每帧先把她单独拍进一张贴图，
//      再按镜筒的几何关系（对每面镜子做一次镜像 = 第一圈 sides 个；再对相邻两面各做一次 = 第二圈 sides 个）画回画面上。
//      要求镜头大致在轴线上、从她身后或身前沿轴线看（镜头离轴线越远，镜像的位置越不准）。
//
//   import { createKaleidoTunnel, createKaleidoMirror, KALEIDO } from '../kits/kaleido-tunnel.js';
//   const tunnel = createKaleidoTunnel();                 // group 的原点 = 隧道口的中心，隧道沿本地 −Z 伸出去
//   scene.add(tunnel.group); tunnel.group.position.set(0, 2.2, -10);
//   const mirror = createKaleidoMirror(mv.stage.renderer); scene.add(mirror.mesh);
//   每帧：
//     tunnel.update(T, { phase, spin, glow, exit });      // phase = 数据光沿隧道流过的距离（米；增大 = 往里涌，减小 = 倒流），spin = 整条隧道绕轴转的角度
//     mirror.capture(scene, camera, girl.root, center);   // center = 她身体中心的世界坐标（THREE.Vector3）；在 girl 摆好姿势、镜头摆好之后调
//     mirror.update({ alpha, spin });                     // alpha 0..1 影子的不透明度；spin 要和 tunnel 的 spin 一致
//
// 全部是传进来的参数的纯函数（没有内部计时）。单位：米。

import * as THREE from 'three';
import { PALETTE as PAL } from '../engine/palette.js';

export const KALEIDO = { sides: 6, apothem: 1.8, ring: 40, cell: 0.5 };      // 默认规格：六棱，轴线到镜面 1.8 m（左右两面是竖直的镜子），亮环间隔 40 m，数据格 0.5 m

const col = c => new THREE.Color(c);

function glyphAtlas() {                                // 8 个字符一排：0 1 0 1 { # λ Σ
  const c = document.createElement('canvas'); c.width = 512; c.height = 64; const g = c.getContext('2d');
  g.fillStyle = '#000'; g.fillRect(0, 0, 512, 64); g.fillStyle = '#fff'; g.font = 'bold 54px ui-monospace, Menlo, monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
  ['0', '1', '0', '1', '{', '#', 'λ', 'Σ'].forEach((ch, i) => g.fillText(ch, i * 64 + 32, 35));
  const t = new THREE.CanvasTexture(c); t.minFilter = THREE.LinearFilter; t.generateMipmaps = false; return t;
}

export function createKaleidoTunnel({ sides = KALEIDO.sides, apothem = KALEIDO.apothem, length = 1200, ring = KALEIDO.ring, cell = KALEIDO.cell } = {}) {
  const R = apothem / Math.cos(Math.PI / sides);       // 棱到轴线的距离
  const geo = new THREE.CylinderGeometry(R, R, length, sides, 1, true); geo.rotateX(Math.PI / 2); geo.rotateZ(Math.PI / sides); geo.translate(0, 0, -length / 2);   // 轴线沿 −Z；转到左右两面是竖直的
  const U = { uPhase: { value: 0 }, uGlow: { value: 1 }, uExit: { value: 0 }, uSides: { value: sides }, uApo: { value: apothem }, uRing: { value: ring }, uCell: { value: cell }, uLen: { value: length },
    uGlyph: { value: glyphAtlas() }, uPink: { value: col(PAL.pink) }, uMint: { value: col(PAL.mint) }, uLemon: { value: col(PAL.lemon) } };
  const mat = new THREE.ShaderMaterial({ uniforms: U, side: THREE.BackSide,
    vertexShader: /* glsl */`varying vec3 vP; varying vec3 vW; void main(){ vP = position; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */`
      uniform float uPhase, uGlow, uExit, uSides, uApo, uRing, uCell, uLen; uniform sampler2D uGlyph; uniform vec3 uPink, uMint, uLemon; varying vec3 vP; varying vec3 vW;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      // 一层数据光：across = 这面镜子上的横向位置（0..1），along = 沿隧道的距离（米），k = 这一层的疏密
      vec3 data(float side, float across, float along, float cols, float cellLen, float seed){
        float cx = floor(across * cols), sp = 0.6 + 1.0 * hash(vec2(cx + side * 7.0, seed));          // 每一列自己的流速
        float a = (along - uPhase * sp) / cellLen, cy = floor(a); vec2 f = vec2(fract(across * cols), fract(a));
        float h = hash(vec2(cx + side * 13.0 + seed, cy)), on = step(0.55, h);
        float head = fract(cy * 0.071 + hash(vec2(cx, seed + side)));                                 // 一串里越靠「头」越亮
        vec2 gu = vec2((floor(h * 97.0 - floor(h * 97.0 / 8.0) * 8.0) + clamp(f.x * 1.3 - 0.15, 0.0, 1.0)) / 8.0, clamp(1.15 - f.y * 1.3, 0.0, 1.0));
        float g = texture2D(uGlyph, gu).r;
        vec3 c = h > 0.93 ? uLemon : h > 0.86 ? uPink : uMint;
        return c * g * on * (0.25 + 1.3 * head * head);
      }
      void main(){
        float along = -vP.z, ang = atan(vP.y, vP.x), w = 6.2831853 / uSides;
        float side = floor((ang + w * 0.5) / w), la = ang - side * w;                                 // 第几面镜子；在这面镜子里的角度（−w/2..w/2）
        float across = tan(la) / tan(w * 0.5) * 0.5 + 0.5;                                            // 0..1
        vec3 c = vec3(0.016, 0.02, 0.045) + vec3(0.03, 0.02, 0.06) * (0.5 + 0.5 * sin(across * 3.14159));   // 深色镜面，中间略亮
        c += data(side, across, along, 7.0, uCell, 1.0) * 1.25;
        c += data(side + 20.0, across * 0.5 + 0.25, along * 0.5, 9.0, uCell, 5.0) * 0.38;             // 镜子里更深的一层（对面那面的倒影）：小一半、慢一半、暗
        float e = min(across, 1.0 - across);                                                          // 棱上的霓虹线：三种颜色轮着
        float sm = mod(side + uSides, 3.0); vec3 ec = sm < 0.5 ? uPink : sm < 1.5 ? uMint : uLemon;
        c += ec * (smoothstep(0.035, 0.0, e) * 1.7 + smoothstep(0.16, 0.0, e) * 0.22) * uGlow;
        float rr = abs(fract(along / uRing + 0.5) - 0.5) * uRing;                                     // 亮环
        c += uLemon * (smoothstep(0.22, 0.0, rr) * 1.8 + smoothstep(2.5, 0.0, rr) * 0.12) * uGlow;
        float d = length(vW - cameraPosition);
        c = mix(vec3(0.09, 0.03, 0.14), c, exp(-d * 0.0075));                                         // 远处雾成深紫
        c += vec3(1.0, 0.97, 0.85) * uExit * (0.25 + 1.6 * smoothstep(uLen * 0.25, uLen, along) + 0.6 * exp(-e * 6.0));   // 出口：尽头亮起来，光沿着棱和镜面漫过来
        gl_FragColor = vec4(c, 1.0);
      }` });
  const mesh = new THREE.Mesh(geo, mat); mesh.frustumCulled = false;
  const group = new THREE.Group(); group.add(mesh);
  // 尽头：一块发光的面（默认是暗紫；exit → 1 时亮成白）
  const endMat = new THREE.MeshBasicMaterial({ color: col('#1a0a2a'), fog: false }), end = new THREE.Mesh(new THREE.CircleGeometry(R * 1.05, sides), endMat); end.position.z = -length + 1; group.add(end);
  function update(T, { phase = 0, spin = 0, glow = 1, exit = 0 } = {}) {
    U.uPhase.value = phase; U.uGlow.value = glow; U.uExit.value = exit; group.rotation.z = spin;
    endMat.color.set('#1a0a2a').lerp(col('#fff8e0').multiplyScalar(3), exit);
  }
  return { group, mesh, update, sides, apothem, vertexRadius: R, length };
}

export function createKaleidoMirror(renderer, { sides = KALEIDO.sides, apothem = KALEIDO.apothem, layer = 2, tint = [PAL.mint, PAL.pink] } = {}) {
  const size = renderer.getDrawingBufferSize(new THREE.Vector2()), rt = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType });
  const U = { tGirl: { value: rt.texture }, uC: { value: new THREE.Vector2() }, uRw: { value: 0.5 }, uAspect: { value: size.x / size.y }, uSpin: { value: 0 }, uAlpha: { value: 1 }, uSides: { value: sides },
    uT1: { value: col(tint[0]) }, uT2: { value: col(tint[1]) } };
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms: U, transparent: true, depthTest: false, depthWrite: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform sampler2D tGirl; uniform vec2 uC; uniform float uRw, uAspect, uSpin, uAlpha, uSides; uniform vec3 uT1, uT2; varying vec2 vUv;
      vec2 refl(vec2 p, float k){ float a = 6.2831853 * k / uSides + uSpin; vec2 n = vec2(cos(a), sin(a)); return p - 2.0 * (dot(p - uC, n) - uRw) * n; }   // 关于第 k 面镜子镜像
      vec4 girl(vec2 p){ vec2 uv = vec2(p.x / uAspect, p.y) * 0.5 + 0.5; if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return vec4(0.0); return texture2D(tGirl, uv); }
      void main(){
        vec2 p = (vUv * 2.0 - 1.0) * vec2(uAspect, 1.0);                                              // 以半个画高为 1
        vec4 acc = vec4(0.0);
        for (int i = 0; i < 12; i++) { if (float(i) >= uSides) break; float k = float(i);
          vec4 a = girl(refl(p, k)); a.rgb = mix(a.rgb, a.rgb * uT1 * 1.5, 0.3) * 0.9; acc = mix(acc, vec4(a.rgb, 1.0), a.a * 0.9 * (1.0 - acc.a * 0.0));             // 第一圈：一次镜像
          vec4 b = girl(refl(refl(p, k + 1.0), k)); b.rgb = mix(b.rgb, b.rgb * uT2 * 1.5, 0.45) * 0.6; acc = mix(acc, vec4(b.rgb, 1.0), b.a * 0.65 * (1.0 - acc.a)); }   // 第二圈：两次镜像（垫在第一圈后面）
        gl_FragColor = vec4(acc.rgb, acc.a * uAlpha);
      }` }));
  mesh.frustumCulled = false; mesh.renderOrder = 12; mesh.visible = false;
  const _v = new THREE.Vector3(), _c = new THREE.Color(), marked = new WeakSet();
  /** 把 subject（她）单独拍进贴图，并算出镜像要用的几何量。center = 她身体中心的世界坐标。 */
  function capture(scene, camera, subject, center) {
    if (!marked.has(subject)) { subject.traverse(o => o.layers.enable(layer)); scene.traverse(o => { if (o.isLight) o.layers.enable(layer); }); marked.add(subject); }
    const bg = scene.background, mask = camera.layers.mask, prev = renderer.getRenderTarget(), a0 = renderer.getClearAlpha(); renderer.getClearColor(_c);
    scene.background = null; camera.layers.set(layer);
    renderer.setRenderTarget(rt); renderer.setClearColor(0x000000, 0); renderer.clear(); renderer.render(scene, camera);
    renderer.setRenderTarget(prev); renderer.setClearColor(_c, a0); scene.background = bg; camera.layers.mask = mask;
    const depth = _v.copy(center).applyMatrix4(camera.matrixWorldInverse).z * -1, hh = depth * Math.tan(camera.fov * Math.PI / 360);      // 她那个深度上，半个画高是多少米
    U.uRw.value = apothem / hh; _v.copy(center).project(camera); U.uC.value.set(_v.x * camera.aspect, _v.y); U.uAspect.value = camera.aspect;
  }
  function update({ alpha = 1, spin = 0 } = {}) { U.uAlpha.value = alpha; U.uSpin.value = spin; mesh.visible = alpha > 0.005; }
  return { mesh, capture, update, texture: rt.texture };
}

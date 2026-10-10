// WebGL2 后端：把 evaluate() 的绘制项画到一张透明底的画布上。全程预乘透明度；遮罩用模板缓冲。
// 不含 rAF 循环，不按 CSS 尺寸改缓冲大小——画布多大由调用方定。
// 做法（预乘管线、模板遮罩两遍画）参考 iki（MIT，Copyright (c) 2026 Zeikar）packages/engine/src/player.ts @ e93ca7dd9c71；代码是重写的。
const VS = `#version 300 es
in vec2 aPos; in vec2 aUV; uniform vec3 uView; uniform vec2 uSize; out vec2 vUV;
void main(){ vUV = aUV; vec2 p = (aPos * uView.z + uView.xy) / uSize; gl_Position = vec4(p.x * 2.0 - 1.0, 1.0 - p.y * 2.0, 0.0, 1.0); }`;
// uView = (偏移x, 偏移y, 缩放)，uSize = 画布的像素宽高
const FS = `#version 300 es
precision highp float; in vec2 vUV; uniform sampler2D uTex; uniform float uOpacity; uniform float uCutoff; out vec4 o;
// 缩小时取 mip 的层级偏 −0.6：三线性默认偏糊，线条会发虚
void main(){ vec4 c = texture(uTex, vUV, -0.6); if (c.a < uCutoff) discard; o = c * uOpacity; }`;

export class WebGLRenderer {
  constructor(canvas) {
    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, stencil: true, antialias: false, preserveDrawingBuffer: true });
    if (!gl) throw new Error('这个浏览器没有 WebGL2');
    this.gl = gl; this.canvas = canvas; this.textures = new Map();
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    const pr = this.program = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
    this.loc = { pos: gl.getAttribLocation(pr, 'aPos'), uv: gl.getAttribLocation(pr, 'aUV'), view: gl.getUniformLocation(pr, 'uView'), size: gl.getUniformLocation(pr, 'uSize'), op: gl.getUniformLocation(pr, 'uOpacity'), cut: gl.getUniformLocation(pr, 'uCutoff') };
    this.vbo = gl.createBuffer(); this.ubo = gl.createBuffer(); this.ibo = gl.createBuffer();
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  }
  // source：ImageBitmap（已预乘）或 2D 画布
  setTexture(key, source, { dynamic = false } = {}) {
    const gl = this.gl; let t = this.textures.get(key);
    if (!t) { t = gl.createTexture(); this.textures.set(key, t); }
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    if (dynamic) gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    else { gl.generateMipmap(gl.TEXTURE_2D); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); }
  }
  #mesh(it) {
    const gl = this.gl, L = this.loc;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo); gl.bufferData(gl.ARRAY_BUFFER, it.vertices, gl.DYNAMIC_DRAW); gl.enableVertexAttribArray(L.pos); gl.vertexAttribPointer(L.pos, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.ubo); gl.bufferData(gl.ARRAY_BUFFER, it.uvs, gl.DYNAMIC_DRAW); gl.enableVertexAttribArray(L.uv); gl.vertexAttribPointer(L.uv, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, it.triangles, gl.DYNAMIC_DRAW);
    gl.bindTexture(gl.TEXTURE_2D, this.textures.get(it.overlay ? '@' + it.overlay : it.texture));
    gl.drawElements(gl.TRIANGLES, it.triangles.length, gl.UNSIGNED_SHORT, 0);
  }
  // place = { x, y, scale }：画布像素 (px,py) → 屏幕 (x + px·scale, y + py·scale)
  draw(items, place = { x: 0, y: 0, scale: 1 }) {
    const gl = this.gl, L = this.loc, W = this.canvas.width, H = this.canvas.height, byId = new Map(items.map(i => [i.id, i]));
    gl.viewport(0, 0, W, H); gl.clearColor(0, 0, 0, 0); gl.clearStencil(0); gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    gl.useProgram(this.program); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform3f(L.view, place.x, place.y, place.scale); gl.uniform2f(L.size, W, H);
    for (const it of items) {
      if (it.opacity <= 0 || !this.textures.has(it.overlay ? '@' + it.overlay : it.texture)) continue;
      if (it.mask) {
        gl.enable(gl.STENCIL_TEST); gl.clear(gl.STENCIL_BUFFER_BIT); gl.colorMask(false, false, false, false);
        gl.stencilFunc(gl.ALWAYS, 1, 0xff); gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE); gl.uniform1f(L.cut, 0.1); gl.uniform1f(L.op, 1);   // 遮罩取到软边为止：阈值高了会把被裁部件的边咬出锯齿
        for (const id of it.mask.by) { const m = byId.get(id); if (m) this.#mesh(m); }
        gl.colorMask(true, true, true, true); gl.stencilFunc(it.mask.invert ? gl.NOTEQUAL : gl.EQUAL, 1, 0xff); gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
      }
      gl.uniform1f(L.cut, 0); gl.uniform1f(L.op, it.opacity); this.#mesh(it);
      if (it.mask) gl.disable(gl.STENCIL_TEST);
    }
  }
}

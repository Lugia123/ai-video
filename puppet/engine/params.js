// 参数表：每个参数有范围和默认值，写入时夹到范围内；不认识的 id 和非有限数直接丢掉。
// 结构参考 iki（MIT，Copyright (c) 2026 Zeikar）packages/engine/src/parameter-store.ts @ e93ca7dd9c71 的做法，代码是重写的。
export class ParamStore {
  constructor(defs) {
    this.defs = new Map(defs.map(d => [d.id, d]));
    this.values = new Map(defs.map(d => [d.id, clamp(d.default, d.min, d.max)]));
  }
  rest(id) { const d = this.defs.get(id); return d ? clamp(d.default, d.min, d.max) : 0; }
  get(id) { return this.values.get(id) ?? 0; }
  set(id, v) { const d = this.defs.get(id); if (d && Number.isFinite(v)) this.values.set(id, clamp(v, d.min, d.max)); }
  setAll(obj) { for (const k in obj) this.set(k, obj[k]); }
  reset() { for (const [id] of this.defs) this.values.set(id, this.rest(id)); }
}
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

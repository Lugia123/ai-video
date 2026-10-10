// 讲解员的头：用 puppet 引擎按数据包画。把默认行为给出的头部姿态（yaw / pitch / blink / mouth …）翻成数据包里的参数。
// 取代了过渡用的 adapters/morph-shim.js；不读任何旧格式文件，讲解员要的几个数在 character.json 的 host 里。
import { createPuppet } from '../engine/index.js';

const DEFAULT = { yaw: 0, pitch: 0, roll: 0, blink: 0, eyeOpen: 1, eyeSmile: 0, eyeX: 0, eyeY: 0, irisScale: 1, browY: 0, browTilt: 0, mouth: 'closed', mouthOpen: 1 };
const RAD = Math.PI / 180;

export async function createHead(pack, { canvas }) {
  const p = await createPuppet(pack, { canvas, layerScale: 0.5 });
  const C = p.character, U = C.unit, HO = C.host, shapes = C.mouthShapes ?? ['closed'], slots = C.slots ?? {};
  const face = p.core.byId.get(C.overlays.find(o => o.id === 'face')?.clipTo)?.def;
  const FACE_RECT = face.rect.slice(), rollK = C.groups?.find(g => g.id === 'head')?.bindings?.find(b => b.channel === 'rotate')?.k ?? 1;
  const all = p.core.parts.map(q => q.def.id), feat = new Set([...(slots.eyes ?? []), ...(slots.mouth ?? [])]);
  let place = { x: 0, y: 0, scale: 1 }, P = DEFAULT, overlayOn = false;
  const api = {
    FACE_RECT, puppet: p, headAngles: { yaw: 0, pitch: 0, roll: 0 },
    // 贴脸层（脸矩形 × 它的 scale）→ 贴到引擎的脸层上
    uploadOverlay(cv) { const L = p.layer('face'); L.clear(); L.ctx.drawImage(cv, FACE_RECT[0], FACE_RECT[1], FACE_RECT[2], FACE_RECT[3]); overlayOn = true; },
    // pose = 头部姿态；pl = { x, y, scale }：(x, y) 是脚底在画布上的位置，scale = 画布像素 / 部件像素；featOnly = 只画眼和嘴（整张立绘的姿势）
    render(pose, pl, featOnly = false) {
      P = { ...DEFAULT, ...pose };
      const open = P.eyeOpen * (1 - P.blink);
      p.set({ ParamAngleX: P.yaw, ParamAngleY: P.pitch, ParamAngleZ: P.roll / rollK,
        ParamEyeLOpen: open, ParamEyeROpen: open, ParamEyeLSmile: P.eyeSmile, ParamEyeRSmile: P.eyeSmile, ParamEyeBallX: P.eyeX, ParamEyeBallY: P.eyeY, ParamIrisScale: P.irisScale,
        ParamBrowLY: P.browY, ParamBrowRY: P.browY, ParamBrowLAngle: P.browTilt, ParamBrowRAngle: P.browTilt,
        ParamMouthShape: Math.max(0, shapes.indexOf(P.mouth)), ParamMouthScale: P.mouthOpen });
      for (const id of all) p.setPartWeight(id, featOnly && !feat.has(id) ? 0 : 1);
      if (P.eyesHide) for (const id of slots.eyes ?? []) p.setPartWeight(id, 0);
      if (P.browsHide) for (const id of slots.brows ?? []) p.setPartWeight(id, 0);
      if (P.mouthHide) for (const id of slots.mouth ?? []) p.setPartWeight(id, 0);
      if (!P.faceOverlayOn && overlayOn) { p.layer('face').clear(); overlayOn = false; }
      place = { x: pl.x - HO.foot[0] * pl.scale, y: pl.y - HO.foot[1] * pl.scale, scale: pl.scale };
      p.render(place);
      api.headAngles = { yaw: p.get('ParamAngleX'), pitch: p.get('ParamAngleY'), roll: P.roll };
    },
    // 头上的一个点（部件像素）→ 画布像素。layer 说这个点贴在哪一层上（数据包 host.pointDepth 里的键）
    // layer 也可以写成数据包里一个部件的 id（host.pointPart 里登记的那种）：这个点就跟着那个部件的转头位移场走
    headPoint(x, y, layer = 'face') {
      const part = HO.pointPart?.[layer], d = part ? (p.core.byId.get(part)?.def.depth ?? 0) : HO.pointDepth[layer] ?? HO.pointDepth.face, dY = HO.pointDepthY?.[layer] ?? d, m = p.core.groupMatrix('head');          // 点头用的是纵向深度（整头一体，层间视差很小）
      const sx = x + d * U.R * Math.sin(p.get('ParamAngleX') * RAD) + (part ? p.core.turnShift(part, x, y) : 0), sy = y - dY * U.R * Math.sin(p.get('ParamAngleY') * RAD);
      return [place.x + (m[0] * sx + m[2] * sy + m[4]) * place.scale, place.y + (m[1] * sx + m[3] * sy + m[5]) * place.scale];
    },
  };
  return api;
}

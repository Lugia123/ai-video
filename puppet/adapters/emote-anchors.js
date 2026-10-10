// 把木偶的挂点换成表情库（chibi-emotes）要的那套名字。space 同 puppet.anchors()：
//   'screen' 给最上层 / 背后层的符号用；'rest' 给贴脸层用（贴脸层挂在头的刚体组上、自己带深度，整层跟着五官走，所以往上画时用静止位置）。
export function emoteAnchors(puppet, space = 'screen') {
  const a = puppet.anchors(space), mid = { x: (a.eyeL.x + a.eyeR.x) / 2, y: (a.eyeL.y + a.eyeR.y) / 2 };
  return { head: { ...mid, rot: Math.atan2(a.eyeR.y - a.eyeL.y, a.eyeR.x - a.eyeL.x) }, eyeL: a.eyeL, eyeR: a.eyeR, mouth: a.mouth, cheekL: a.cheekL, cheekR: a.cheekR, brow: a.forehead, top: a.top, facing: 1 };
}
// 藏掉 / 恢复一个槽位里的全部部件（表情库用矢量画的眼、眉、嘴顶替原部件时）
export function setSlot(puppet, slot, visible) { for (const id of puppet.character.slots?.[slot] ?? []) puppet.setPartWeight(id, visible ? 1 : 0); }

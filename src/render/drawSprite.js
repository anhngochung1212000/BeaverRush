// render/drawSprite.js — điểm swap art DUY NHẤT (§A7.2).
// Chưa có ảnh cho key -> fallback GRAYBOX rect + label. Key anim (mảng frame trong
// manifest) -> vẽ frame đầu; anim theo thời gian do layer tự chọn frame (vd beaver.js).
const GRAYBOX = {
  beaver: '#8a5a2b',
  block: '#a9772f',
  blockOk: '#3fae5a',
  rock: '#6b6b6b',
  log: '#7a5230',
  slot: 'rgba(255,255,255,.15)',
  green: 'rgba(63,174,90,.35)',
  // block & gỗ (§C3)
  block_1x1: '#a9772f',
  block_carried: '#a9772f',
  float_log: '#8f6a3a',
  // thợ khai thác (§C2)
  lumberjack_idle: '#7a5230',
  lumberjack_chop: '#7a5230',
  lumberjack_haul: '#7a5230',
  // môi trường (§C5)
  bg_river: '#2f6d8a',
  forest_left: '#2f5d3a',
  forest_right: '#2f5d3a',
  waterfall: '#3f8db0',
  // obstacle (§C4)
  rock_big: '#6b6b6b',
  drift_log: '#5b7a4a',
};

export function drawSprite(ctx, store, key, x, y, w, h, label) {
  if (store.has(key)) {
    const v = store.images.get(key);
    const img = Array.isArray(v) ? v[0] : v; // key anim: frame đầu (layer tự anim nếu cần)
    ctx.drawImage(img, x, y, w, h);
    return;
  }
  ctx.fillStyle = GRAYBOX[key] || '#888';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = 'rgba(0,0,0,.4)';
  ctx.strokeRect(x, y, w, h);
  if (label) {
    ctx.fillStyle = '#fff';
    ctx.font = '24px sans-serif';
    ctx.fillText(label, x + 6, y + 28); // vd 'ROCK','1x1','BEAVER'
  }
}

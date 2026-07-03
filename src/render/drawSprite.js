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
  ground: '#2f5d3a',
  forest_left: '#2f5d3a',
  forest_right: '#2f5d3a',
  waterfall: '#3f8db0',
  // UI (§C7)
  ui_water_fill: '#3f8db0',
  // obstacle (§C4)
  rock_big: '#6b6b6b',
  drift_log: '#5b7a4a',
  telegraph: '#d23b3b',
};

// Vẽ TILE texture lặp (createPattern) thay vì stretch — cho texture nền (vd bg_river
// 600x600 phủ 1080x1920). scrollY (px, hệ world) = cuộn dọc theo hướng chảy; pattern
// neo theo (x, y) nên tile khớp mép khi camera pan. Chưa có ảnh -> fallback graybox.
const patternCache = new Map(); // HTMLImageElement -> CanvasPattern (ctx duy nhất §A7.1)

export function drawTiledSprite(ctx, store, key, x, y, w, h, label, scrollY = 0) {
  if (!store.has(key)) {
    drawSprite(ctx, store, key, x, y, w, h, label);
    return;
  }
  const v = store.images.get(key);
  const img = Array.isArray(v) ? v[0] : v;
  let pat = patternCache.get(img);
  if (!pat) {
    pat = ctx.createPattern(img, 'repeat');
    patternCache.set(img, pat);
  }
  const ih = img.height;
  const dy = ((scrollY % ih) + ih) % ih; // chuẩn hoá 0..ih (scrollY âm vẫn đúng)
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  // Neo pattern tại (x, y + dy - ih) rồi fill dư 1 tile phía trên -> cuộn liền mạch
  ctx.translate(x, y + dy - ih);
  ctx.fillStyle = pat;
  ctx.fillRect(0, 0, w, h + ih);
  ctx.restore();
}

// Vẽ MỘT VÙNG (source rect) của sprite — cho sheet nhiều hình trong 1 file
// (vd grass_sheet cắt cụm cỏ). Decor thuần: chưa có ảnh -> KHÔNG vẽ gì (không graybox).
export function drawSpriteRegion(ctx, store, key, sx, sy, sw, sh, dx, dy, dw, dh) {
  if (!store.has(key)) return;
  const v = store.images.get(key);
  const img = Array.isArray(v) ? v[0] : v;
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

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

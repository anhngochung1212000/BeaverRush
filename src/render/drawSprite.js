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

// CONTENT CROP (§A7.2): vài file art có VIỀN TRONG SUỐT + bóng đổ bao quanh nội dung.
// Bảng = vùng {sx,sy,sw,sh} px sẽ crop rồi scale cho ĐẦY rect đích. Key thiếu = vẽ nguyên ảnh.
// GỖ (wood.png): đống gỗ vẽ PHỐI CẢNH (đáy rộng, đỉnh hẹp = hình THANG) — nếu lấy bbox alpha
// full thì stretch ra vẫn là thang. Nên crop VÙNG LÕI bên trong (chỉ mặt vân, tránh 2 cạnh
// xiên & đỉnh vát) -> khối CHỮ NHẬT đầy ô, đập gỗ tiling liền mạch (đo: lõi này alpha đặc 100%).
// ĐÁ (rock.png): giữ bbox alpha đầy đủ -> hòn đá TRÒN tự nhiên (không ép chữ nhật).
const CONTENT_CROP = {
  block_1x1:     { sx: 360, sy: 420, sw: 800, sh: 300 }, // wood.png — lõi vân gỗ (chữ nhật)
  block_carried: { sx: 360, sy: 420, sw: 800, sh: 300 },
  float_log:     { sx: 360, sy: 420, sw: 800, sh: 300 },
  rock_big:      { sx: 270, sy: 289, sw: 998, sh: 435 }, // rock.png — khối đá đặc (giữ dáng tròn)
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
    // TILE GƯƠNG (2026-07-04): texture cắt từ ảnh KHÔNG seamless -> tile thẳng lộ seam.
    // Ghép ô 2x2 lật gương (TL gốc · TR lật ngang · BL lật dọc · BR lật cả 2) -> mọi mép
    // giáp nhau là ảnh phản chiếu = KHỚP tuyệt đối, hết sọc. Chu kỳ lặp = 2*w x 2*h.
    const w0 = img.width;
    const h0 = img.height;
    const oc = document.createElement('canvas');
    oc.width = w0 * 2;
    oc.height = h0 * 2;
    const oq = oc.getContext('2d');
    oq.drawImage(img, 0, 0);                                                   // TL
    oq.save(); oq.translate(2 * w0, 0); oq.scale(-1, 1); oq.drawImage(img, 0, 0); oq.restore(); // TR
    oq.save(); oq.translate(0, 2 * h0); oq.scale(1, -1); oq.drawImage(img, 0, 0); oq.restore(); // BL
    oq.save(); oq.translate(2 * w0, 2 * h0); oq.scale(-1, -1); oq.drawImage(img, 0, 0); oq.restore(); // BR
    pat = ctx.createPattern(oc, 'repeat');
    patternCache.set(img, pat);
  }
  const ih = img.height * 2; // chu kỳ tile gương = 2*chiều cao ảnh
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

// Vẽ 1 LÁT NGANG (theo cột) của LÕI vân gỗ (CONTENT_CROP[key]) đầy 1 ô -> ghép nhiều lát =
// vân gỗ chạy LIỀN qua cả hàng đập. DÙNG CHUNG cho block đặt (blocks.js, col=block.col) VÀ
// gỗ đang trôi (floatinglogs.js, col=lane): vì lane==col (§A5) nên gỗ trôi lane L trông Y HỆT
// block cột L nó sẽ neo vào -> hết cảnh "gỗ trôi khác block" (2026-07-04).
// Chưa có ảnh / key không có CONTENT_CROP -> fallback drawSprite (graybox).
export function drawWoodSlice(ctx, store, key, col, cols, x, y, w, h, label) {
  const cr = CONTENT_CROP[key];
  if (!store.has(key) || !cr) {
    drawSprite(ctx, store, key, x, y, w, h, label);
    return;
  }
  const sliceW = cr.sw / cols;
  const sx = cr.sx + (((col % cols) + cols) % cols) * sliceW;
  drawSpriteRegion(ctx, store, key, sx, cr.sy, sliceW, cr.sh, x, y, w, h);
}

export function drawSprite(ctx, store, key, x, y, w, h, label) {
  if (store.has(key)) {
    const v = store.images.get(key);
    const img = Array.isArray(v) ? v[0] : v; // key anim: frame đầu (layer tự anim nếu cần)
    const cr = CONTENT_CROP[key];
    if (cr) {
      ctx.drawImage(img, cr.sx, cr.sy, cr.sw, cr.sh, x, y, w, h); // crop nội dung -> đầy ô
    } else {
      ctx.drawImage(img, x, y, w, h);
    }
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

// render/layers/forests.js — Layer 2 (art thật 2026-07-03): 2 BỜ SÔNG dùng CHUNG Ground.png
// (mép nước ở cạnh PHẢI ảnh gốc — bờ trái vẽ thẳng, bờ PHẢI flip ngang), cây + cỏ rải
// deterministic lên trên. TRẠI KHAI THÁC chỉ ở bờ TRÁI (wood.right = null §D3):
// 1 cây đổi trạng thái theo đồng hồ sản xuất (nguyên -> gặm -> đổ -> gốc + khúc gỗ)
// + 1 HẢI LY THỢ gặm cây (tái dụng anim beaver_crawl — chốt user, không có sprite thợ riêng).
// Hệ SÔNG: bờ trái x ∈ [−forestW, 0), bờ phải x ∈ [1080, 1080+forestW) (§A5/§A7.1).
import { drawSprite, drawSpriteRegion } from '../drawSprite.js';
import { CANVAS_H } from '../../core/constants.js';

// Cụm cỏ cắt từ grass_sheet 1024x1536 (4 vùng chọn tay, tránh cắt phạm cụm bên cạnh)
const GRASS = [
  { sx: 40, sy: 120, sw: 420, sh: 300 },
  { sx: 560, sy: 100, sw: 420, sh: 300 },
  { sx: 30, sy: 550, sw: 380, sh: 320 },
  { sx: 640, sy: 540, sw: 384, sh: 330 },
];

// Cây + cỏ rải trên bờ (toạ độ theo TỈ LỆ bề rộng dải [0..1] để forestW đổi không vỡ layout;
// y tuyệt đối; vẽ theo thứ tự = painter's order)
const LEFT_DECOR = [
  { kind: 'tree', key: 'tree_full_b', fx: 0.12, y: 300, w: 110 },
  { kind: 'grass', g: 0, fx: 0.55, y: 380, w: 150 },
  { kind: 'tree', key: 'tree_full_a', fx: 0.42, y: 520, w: 130 },
  { kind: 'tree', key: 'tree_full_b', fx: 0.1, y: 750, w: 120 },
  { kind: 'grass', g: 2, fx: 0.5, y: 820, w: 140 },
  // khoảng y 880-1200 chừa cho TRẠI KHAI THÁC (vẽ riêng bên dưới)
  { kind: 'grass', g: 1, fx: 0.6, y: 1330, w: 150 },
  { kind: 'tree', key: 'tree_full_a', fx: 0.15, y: 1520, w: 125 },
  { kind: 'tree', key: 'tree_full_b', fx: 0.5, y: 1760, w: 115 },
];
const RIGHT_DECOR = [
  { kind: 'tree', key: 'tree_full_a', fx: 0.55, y: 280, w: 125 },
  { kind: 'grass', g: 3, fx: 0.2, y: 400, w: 150 },
  { kind: 'tree', key: 'tree_full_b', fx: 0.25, y: 560, w: 115 },
  { kind: 'tree', key: 'tree_full_a', fx: 0.6, y: 860, w: 135 },
  { kind: 'grass', g: 0, fx: 0.25, y: 980, w: 140 },
  { kind: 'tree', key: 'tree_full_b', fx: 0.55, y: 1280, w: 120 },
  { kind: 'grass', g: 2, fx: 0.3, y: 1420, w: 150 },
  { kind: 'tree', key: 'tree_full_a', fx: 0.3, y: 1700, w: 130 },
];

// Tỉ lệ khung hình gốc từng sprite (w/h) — giữ aspect khi chỉ cho bề rộng
const ASPECT = {
  tree_full_a: 256 / 631,
  tree_full_b: 235 / 627,
  tree_gnawed: 222 / 524,
  tree_falling: 455 / 447,
  tree_stump: 252 / 207,
  tree_log: 299 / 184,
};

export function drawForests(ctx, store, world) {
  const f = world.camera.forestW;
  const riverW = world.camera.riverW; // sông hẹp: bờ phải bắt đầu tại river-x = riverW (reframe 2026-07-03)

  // --- Nền bờ: Ground.png scale THEO CHIỀU CAO, neo mép nước (cạnh phải ảnh) vào mép sông ---
  drawBankGround(ctx, store, -f, f, false); // bờ TRÁI: mép nước tại x=0
  drawBankGround(ctx, store, riverW, f, true); // bờ PHẢI: flip — mép nước tại x=riverW

  // --- Cây + cỏ rải ---
  drawDecor(ctx, store, LEFT_DECOR, -f, f);
  drawDecor(ctx, store, RIGHT_DECOR, riverW, f);

  // --- TRẠI KHAI THÁC (bờ trái) — cây chu trình + hải ly thợ gặm + progress ---
  drawCamp(ctx, store, world, -f + f * 0.45, 1150);
}

// Ground.png (1024x1536): bố cục ngang của ảnh ≈ [0..~0.63 đất | ~0.63..0.78 viền đá |
// ~0.78..1 gradient mép nước (alpha)]. Vẽ cover theo CHIỀU CAO canvas rồi neo sao cho
// ĐIỂM MÉP ĐÁ (WATER_EDGE_FRAC) nằm đúng mép sông -> dải bờ hiển thị đất + đá;
// phần gradient nước CHỜM OVERHANG px vào sông (đè bg_river tạo fade tự nhiên).
// flip=true: bờ PHẢI lật ngang quanh mép sông.
const WATER_EDGE_FRAC = 0.78; // tỉ lệ bề ngang ảnh nơi hết đá / bắt đầu nước (tinh chỉnh theo art)
const OVERHANG = 90;          // px gradient nước chờm vào sông

function drawBankGround(ctx, store, x, w, flip) {
  if (!store.has('ground')) {
    drawSprite(ctx, store, 'ground', x, 0, w, CANVAS_H, flip ? 'FOREST-R' : 'FOREST-L');
    return;
  }
  const img = store.images.get('ground');
  const drawW = img.width * (CANVAS_H / img.height); // 1024*(1920/1536) = 1280
  ctx.save();
  ctx.beginPath();
  if (flip) {
    // bờ phải: dải [x, x+w] + chờm [x-OVERHANG, x] về phía sông
    ctx.rect(x - OVERHANG, 0, w + OVERHANG, CANVAS_H);
    ctx.clip();
    ctx.translate(x, 0);
    ctx.scale(-1, 1); // hệ local: sông ở phía local-âm -> vẽ như bờ trái quanh gốc 0
    ctx.drawImage(img, -WATER_EDGE_FRAC * drawW, 0, drawW, CANVAS_H);
  } else {
    // bờ trái: dải [x, x+w=0] + chờm [0, OVERHANG] vào sông
    ctx.rect(x, 0, w + OVERHANG, CANVAS_H);
    ctx.clip();
    ctx.drawImage(img, x + w - WATER_EDGE_FRAC * drawW, 0, drawW, CANVAS_H);
  }
  ctx.restore();
}

function drawDecor(ctx, store, list, baseX, stripW) {
  for (const d of list) {
    const cx = baseX + d.fx * stripW;
    if (d.kind === 'grass') {
      const g = GRASS[d.g];
      const h = d.w * (g.sh / g.sw);
      drawSpriteRegion(ctx, store, 'grass_sheet', g.sx, g.sy, g.sw, g.sh, cx - d.w / 2, d.y - h / 2, d.w, h);
    } else {
      const h = d.w / ASPECT[d.key];
      // cây neo ĐÁY tại d.y (painter's order theo chân cây)
      drawSprite(ctx, store, d.key, cx - d.w / 2, d.y - h, d.w, h);
    }
  }
}

// Chu trình sản xuất 30s (§D3) diễn bằng CÂY: 0-50% nguyên -> 50-80% bị gặm
// -> 80-95% đổ -> 95-100% gốc + khúc gỗ (thành phẩm) -> reset khi +1 kho.
function drawCamp(ctx, store, world, campX, baseY) {
  const stock = world.stock;
  const frac = Math.min(1, stock.timer / stock.intervalSec);

  let treeKey = 'tree_full_a';
  if (frac >= 0.95) treeKey = 'tree_stump';
  else if (frac >= 0.8) treeKey = 'tree_falling';
  else if (frac >= 0.5) treeKey = 'tree_gnawed';

  const w = treeKey === 'tree_falling' ? 190 : treeKey === 'tree_stump' ? 95 : 120;
  const h = w / ASPECT[treeKey];
  drawSprite(ctx, store, treeKey, campX - w / 2, baseY - h, w, h, 'CAMP');
  if (treeKey === 'tree_stump') {
    const lw = 110;
    const lh = lw / ASPECT.tree_log;
    drawSprite(ctx, store, 'tree_log', campX + 40, baseY - lh + 8, lw, lh);
  }

  // Hải ly THỢ gặm cây (1 con duy nhất trên bờ — chốt user): anim beaver_crawl,
  // quay mặt vào gốc cây (sprite gốc hướng PHẢI -> đứng bên phải cây thì flip)
  if (store.has('beaver_crawl')) {
    const frames = store.images.get('beaver_crawl');
    const img = frames[Math.floor(world.time * 8) % frames.length];
    ctx.save();
    ctx.translate(campX + 62, baseY - 26);
    ctx.scale(-1, 1);
    ctx.drawImage(img, -50, -33, 100, 66);
    ctx.restore();
  }

  // Progress block gỗ kế tiếp vào kho (giữ từ graybox cũ — đọc nhịp 30s bằng mắt)
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = '24px sans-serif';
  ctx.fillText('MINING CAMP', campX - 90, baseY + 34);
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(campX - 90, baseY + 44, 200, 14);
  ctx.fillStyle = '#e0b34c';
  ctx.fillRect(campX - 90, baseY + 44, 200 * frac, 14);
  ctx.restore();
}

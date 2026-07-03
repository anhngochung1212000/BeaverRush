// render/layers/beaver.js — Layer 9: hải ly builder. Sprite theo cặp (state, carrying)
// (§A4 render mapping, §C1): CRAWLING -> beaver_crawl (5 frame, flip theo hướng);
// IDLE/PICKING/BUILDING -> beaver_idle (4 frame — pickup/build art riêng cấp sau);
// carrying -> vẽ block_carried đè lên lưng. Chưa có sprite -> graybox.
import { drawSprite } from '../drawSprite.js';

const SIZE_W = 150; // px gợi ý §C1 (~150x180 — graybox cân theo cell 180x150)
const SIZE_H = 130;

export function drawBeaver(ctx, store, world) {
  const b = world.beaver;
  const key = b.state === 'CRAWLING' ? 'beaver_crawl' : 'beaver_idle';
  const fps = b.state === 'CRAWLING' ? 10 : 6;
  const x = b.pos.x;
  const y = b.pos.y;

  if (store.has(key)) {
    const v = store.images.get(key);
    const img = Array.isArray(v) ? v[Math.floor(world.time * fps) % v.length] : v;
    ctx.save();
    ctx.translate(x, y - 10);
    if (b.facing < 0) ctx.scale(-1, 1); // flip ngang theo hướng đi
    ctx.drawImage(img, -SIZE_W / 2, -SIZE_H / 2, SIZE_W, SIZE_H);
    ctx.restore();
  } else {
    drawSprite(ctx, store, 'beaver', x - SIZE_W / 2, y - SIZE_H / 2 - 10, SIZE_W, SIZE_H, 'BEAVER');
  }

  // Vác gỗ: block_carried đè lên lưng (§C3 — render, model không đổi)
  if (b.carrying !== null) {
    drawSprite(ctx, store, 'block_carried', x - 40, y - SIZE_H / 2 - 46, 80, 46, 'LOG');
  }

  // Progress nhỏ khi PICKING/BUILDING (0.4s — đọc được bằng mắt)
  if (b.state === 'PICKING' || b.state === 'BUILDING') {
    const total = b.state === 'PICKING' ? b.pickupSec : b.buildSec;
    const frac = Math.max(0, Math.min(1, 1 - b.actionTimer / total));
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(x - 40, y - SIZE_H / 2 - 60, 80, 10);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x - 40, y - SIZE_H / 2 - 60, 80 * frac, 10);
    ctx.restore();
  }
}

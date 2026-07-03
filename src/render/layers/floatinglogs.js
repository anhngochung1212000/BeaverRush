// render/layers/floatinglogs.js — Layer 7: khúc gỗ ĐANG TRÔI (chỉ DRIFTING — v2.1;
// gỗ đã neo là Block, vẽ ở layer blocks). Luôn ở tâm lane, y = tâm log (§A5).
import { drawSprite } from '../drawSprite.js';

export function drawFloatingLogs(ctx, store, world) {
  const g = world.grid;
  const w = 170;
  const h = 100;
  for (const log of world.floatingLogs) {
    if (!log.alive) continue;
    const cx = g.laneCenterX(log.lane);
    drawSprite(ctx, store, 'float_log', cx - w / 2, log.y - h / 2, w, h, 'FLOAT');
  }
}

// render/layers/floatinglogs.js — Layer 7: khúc gỗ ĐANG TRÔI (chỉ DRIFTING — v2.1;
// gỗ đã neo là Block, vẽ ở layer blocks). Luôn ở tâm lane, y = tâm log (§A5).
import { drawWoodSlice } from '../drawSprite.js';

export function drawFloatingLogs(ctx, store, world) {
  const g = world.grid;
  // Khúc gỗ trôi = ĐÚNG 1 Ô GRID (cellW × cellH) VÀ vẽ đúng LÁT gỗ của lane nó (drawWoodSlice,
  // col=lane) -> trông Y HỆT block cột đó khi neo, chuyển tiếp liền mạch (chốt 2026-07-04).
  const w = g.cellW;
  const h = g.cellH;
  for (const log of world.floatingLogs) {
    if (!log.alive) continue;
    const cx = g.laneCenterX(log.lane);
    drawWoodSlice(ctx, store, 'float_log', log.lane, g.cols, cx - w / 2, log.y - h / 2, w, h, 'FLOAT');
  }
}

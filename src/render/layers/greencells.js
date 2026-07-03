// render/layers/greencells.js — Layer 5: highlight Ô XANH đặt được, CHỈ khi
// beaver.carrying != null (§A4.3). Chỉ ô trống TRONG grid — KHÔNG BAO GIỜ ô ảo (v2.1).
import { drawSprite } from '../drawSprite.js';

export function drawGreenCells(ctx, store, world) {
  if (world.beaver.carrying === null || !world.greenCells?.length) return;
  const g = world.grid;
  ctx.save();
  for (const c of world.greenCells) {
    const { x, y } = g.cellToScreen(c.col, c.row);
    if (store.has('ui_green_cell')) {
      drawSprite(ctx, store, 'ui_green_cell', x, y, g.cellW, g.cellH);
    } else {
      // graybox §C7: overlay xanh mờ + viền
      ctx.fillStyle = 'rgba(63,174,90,0.35)';
      ctx.fillRect(x + 3, y + 3, g.cellW - 6, g.cellH - 6);
      ctx.strokeStyle = 'rgba(63,174,90,0.9)';
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 3, y + 3, g.cellW - 6, g.cellH - 6);
    }
  }
  ctx.restore();
}

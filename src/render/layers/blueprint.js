// render/layers/blueprint.js — Layer 3: Blueprint ghost slots (§A6.1, M1 task 3)
// Slot bán trong suốt, viền NÉT ĐỨT; slot filled glow xanh (filled chỉ có từ M2).
import { drawSprite } from '../drawSprite.js';

export function drawBlueprint(ctx, store, world) {
  const g = world.grid;
  ctx.save();
  for (const slot of world.blueprint.slots) {
    const { x, y } = g.cellToScreen(slot.col, slot.row);
    const w = g.cellW; // prototype 1x1: 1 ô = cellW x cellH
    const h = g.cellH;

    if (store.has('slot_1x1')) {
      drawSprite(ctx, store, 'slot_1x1', x, y, w, h);
    } else {
      // graybox: fill bán trong suốt + viền nét đứt (§C6)
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
      ctx.setLineDash([12, 9]);
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 3, y + 3, w - 6, h - 6);
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '24px sans-serif';
      ctx.fillText(slot.size, x + 8, y + 30);
    }

    if (slot.filled) {
      // glow xanh khi có block đúng lấp (chỉ xảy ra từ M2)
      ctx.strokeStyle = '#3fae5a';
      ctx.lineWidth = 5;
      ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
    }
  }
  ctx.restore();
}

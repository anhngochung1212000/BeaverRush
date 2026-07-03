// render/layers/blocks.js — Layer 6: Dam blocks (§A7.1) — MỌI block trên grid VÀ ô ảo
// row âm (cellToScreen dùng chung công thức, row âm -> y < originY §A5).
// Đúng blueprint / auto slot-fill = glow xanh; ngoài blueprint = nâu thường (§C3).
// + pulse glow tạm (world.effects) khi slot vừa được lấp.
import { drawSprite } from '../drawSprite.js';

export function drawBlocks(ctx, store, world) {
  const g = world.grid;
  ctx.save();
  for (const block of world.blocks) {
    if (!block.alive) continue;
    const { x, y } = g.cellToScreen(block.col, block.row);
    const w = g.cellW; // prototype 1x1: 1 ô = cellW x cellH
    const h = g.cellH;

    if (store.has('block_1x1')) {
      drawSprite(ctx, store, 'block_1x1', x, y, w, h);
    } else {
      // graybox §C3: rect #a9772f + label "1x1"
      ctx.fillStyle = '#a9772f';
      ctx.fillRect(x + 4, y + 4, w - 8, h - 8);
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
      ctx.fillStyle = '#fff';
      ctx.font = '24px sans-serif';
      ctx.fillText(block.size, x + 8, y + 30);
    }

    // Block đúng blueprint (đặt tay hoặc AUTO SLOT-FILL) = glow xanh (§C3)
    if (block.onBlueprint) {
      ctx.strokeStyle = '#3fae5a';
      ctx.lineWidth = 5;
      ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
    }
  }

  // Pulse glow tạm khi slot vừa được lấp (auto slot-fill / đặt đúng)
  for (const fx of world.effects) {
    if (fx.type !== 'glow') continue;
    const { x, y } = g.cellToScreen(fx.col, fx.row);
    const a = Math.max(0, Math.min(1, fx.t / 0.8));
    ctx.strokeStyle = `rgba(63,174,90,${a})`;
    ctx.lineWidth = 10;
    ctx.strokeRect(x - 4, y - 4, g.cellW + 8, g.cellH + 8);
  }
  ctx.restore();
}

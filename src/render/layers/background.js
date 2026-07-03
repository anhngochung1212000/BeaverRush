// render/layers/background.js — Layer 1: nền sông + thác (hệ SÔNG 0..1080;
// pan qua ctx.translate ở Renderer §A6). Rừng 2 bên -> layer forests.js (v2.0).
import { drawSprite } from '../drawSprite.js';
import { CANVAS_W, CANVAS_H } from '../../core/constants.js';

export function drawBackground(ctx, store, world) {
  // Nền sông dọc phủ vùng sông (graybox #2f6d8a + label "RIVER" khi chưa có bg_river.png, §C5)
  drawSprite(ctx, store, 'bg_river', 0, 0, CANVAS_W, CANVAS_H, 'RIVER');

  if (!world) return;
  const g = world.grid;

  // Vùng thác dưới đập (visual, §D1: grid bottom -> đáy màn)
  const damBottom = g.originY + g.pixelHeight;
  drawSprite(ctx, store, 'waterfall', g.originX, damBottom, g.pixelWidth, CANVAS_H - damBottom, 'FALL');
}

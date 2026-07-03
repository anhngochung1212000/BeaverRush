// render/layers/forests.js — Layer 2: rừng TRÁI (chứa MINING CAMP graybox — M2 được phép)
// + rừng PHẢI (visual thuần, khu khai thác 2 để giai đoạn sau). Hệ SÔNG: rừng trái
// x ∈ [−forestW, 0), rừng phải x ∈ [1080, 1080+forestW) (§A5/§A7.1).
import { drawSprite } from '../drawSprite.js';
import { CANVAS_W, CANVAS_H } from '../../core/constants.js';

export function drawForests(ctx, store, world) {
  const f = world.camera.forestW;
  drawSprite(ctx, store, 'forest_left', -f, 0, f, CANVAS_H, 'FOREST-L');
  drawSprite(ctx, store, 'forest_right', CANVAS_W, 0, f, CANVAS_H, 'FOREST-R');

  // MINING CAMP (rừng trái): nhóm thợ graybox (§C2) + progress block gỗ kế tiếp
  const stock = world.stock;
  const campX = -f + Math.max(20, f / 2 - 110);
  const campY = 820;
  drawSprite(ctx, store, 'lumberjack_idle', campX, campY, 90, 110, 'LJ');
  drawSprite(ctx, store, 'lumberjack_chop', campX + 110, campY, 90, 110, 'CHOP');

  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = '24px sans-serif';
  ctx.fillText('MINING CAMP', campX, campY - 46);
  // progress: timer / intervalSec -> block kế tiếp vào kho
  const frac = Math.min(1, stock.timer / stock.intervalSec);
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(campX, campY - 30, 200, 14);
  ctx.fillStyle = '#e0b34c';
  ctx.fillRect(campX, campY - 30, 200 * frac, 14);
  ctx.restore();
}

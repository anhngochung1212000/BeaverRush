// render/layers/obstacles.js — Layer 8 (M4): ĐÁ LỚN đang trôi (rock_big §C4) +
// TELEGRAPH nhấp nháy đỉnh lane (§D6: hiện từ tSec−lead tới tSec).
// Hiệu ứng smash/splash -> layer fx.js (M5).
import { drawSprite } from '../drawSprite.js';

export function drawObstacles(ctx, store, world) {
  const g = world.grid;

  // --- Đá lớn — tâm lane, footprint hình ảnh ~1 ô (concept-match: vừa lane 140, aspect rock.png 1.5) ---
  const w = 126;
  const h = 84;
  for (const ob of world.obstacles) {
    if (!ob.alive) continue;
    const cx = g.laneCenterX(ob.lane);
    drawSprite(ctx, store, 'rock_big', cx - w / 2, ob.y - h / 2, w, h, 'ROCK');
  }

  // --- Telegraph: icon nhấp nháy ~4Hz ở đỉnh lane (key telegraph §C4) ---
  const telegraphs = world.obstacleState?.telegraphs ?? [];
  if (telegraphs.length) {
    const bright = Math.floor(world.time * 8) % 2 === 0;
    for (const t of telegraphs) {
      const cx = g.laneCenterX(t.lane);
      ctx.globalAlpha = bright ? 0.95 : 0.35;
      drawSprite(ctx, store, 'telegraph', cx - 45, 20, 90, 90, t.type === 'ROCK' ? '!' : 'LOG');
      ctx.globalAlpha = 1;
    }
  }

}

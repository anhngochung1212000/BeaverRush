// render/layers/lanes.js — Layer 2: 5 đường kẻ mờ chia lane + mũi tên hướng chảy (§A6.1, M1 task 1)
import { drawSprite } from '../drawSprite.js';

export function drawLanes(ctx, store, world) {
  const g = world.grid;
  const laneTop = 0; // lane kéo dài từ mép trên (vùng obstacle trôi) tới đáy grid
  const laneBottom = g.originY + g.pixelHeight;

  // Đường kẻ lane mờ (ranh giới các lane, dọc theo cột)
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 2;
  for (let i = 0; i <= g.cols; i++) {
    const x = g.originX + i * g.cellW;
    ctx.beginPath();
    ctx.moveTo(x, laneTop);
    ctx.lineTo(x, laneBottom);
    ctx.stroke();
  }

  // Kẻ mờ ranh giới hàng trong vùng grid (đọc ô dễ hơn, vẫn graybox)
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  for (let r = 0; r <= g.rows; r++) {
    const y = g.originY + r * g.cellH;
    ctx.beginPath();
    ctx.moveTo(g.originX, y);
    ctx.lineTo(g.originX + g.pixelWidth, y);
    ctx.stroke();
  }

  // Mũi tên hướng chảy (xuống dưới) ở tâm mỗi lane, vùng trên grid
  for (let lane = 0; lane < g.cols; lane++) {
    const cx = g.laneCenterX(lane);
    for (let y = 180; y < g.originY - 60; y += 240) {
      if (store.has('flow_arrow')) {
        drawSprite(ctx, store, 'flow_arrow', cx - 20, y, 40, 48);
      } else {
        // graybox: chevron trắng mờ chỉ xuống
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(cx - 18, y);
        ctx.lineTo(cx, y + 26);
        ctx.lineTo(cx + 18, y);
        ctx.stroke();
      }
    }
  }
  ctx.restore();
}

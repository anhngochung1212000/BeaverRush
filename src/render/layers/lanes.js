// render/layers/lanes.js — Layer 2: 5 đường kẻ mờ chia lane + mũi tên hướng chảy (§A6.1, M1 task 1)
import { drawSprite } from '../drawSprite.js';

export function drawLanes(ctx, store, world) {
  const g = world.grid;
  const laneTop = 0; // lane kéo dài từ mép trên (vùng obstacle trôi) tới đáy grid
  const laneBottom = g.originY + g.pixelHeight;

  // Chỉ 4 ĐƯỜNG DỌC phân 5 lane, nét đứt MẢNH (concept: không kẻ 2 mép ngoài, không lưới ô vuông)
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.28)';
  ctx.lineWidth = 2;
  ctx.setLineDash([18, 18]);
  for (let i = 1; i < g.cols; i++) {
    const x = g.originX + i * g.cellW;
    ctx.beginPath();
    ctx.moveTo(x, laneTop);
    ctx.lineTo(x, laneBottom);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Nhãn "LANE n" nhỏ ở đỉnh mỗi lane (concept) — pill tối + chữ trắng
  // (y=150 để không đụng bộ đếm tiến độ 0/Y ở giữa mép trên)
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  for (let lane = 0; lane < g.cols; lane++) {
    const cx = g.laneCenterX(lane);
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    const tw = 92;
    ctx.beginPath();
    ctx.roundRect(cx - tw / 2, 150, tw, 34, 10);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillText(`LANE ${lane + 1}`, cx, 174);
  }
  ctx.textAlign = 'left';

  // (Bỏ lưới ô vuông ngang — concept chỉ có đường dọc phân lane)

  // Mũi tên hướng chảy: MỘT hàng ngay trên đập (concept art — không rải suốt sông)
  for (let lane = 0; lane < g.cols; lane++) {
    const cx = g.laneCenterX(lane);
    {
      const y = g.originY - 96;
      if (store.has('flow_arrow')) {
        drawSprite(ctx, store, 'flow_arrow', cx - 20, y, 40, 48);
      } else {
        // Mũi tên trắng ĐẬM chỉ xuống (concept art) — thân + đầu tam giác
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.fillRect(cx - 7, y, 14, 26);
        ctx.beginPath();
        ctx.moveTo(cx - 17, y + 26);
        ctx.lineTo(cx + 17, y + 26);
        ctx.lineTo(cx, y + 46);
        ctx.closePath();
        ctx.fill();
      }
    }
  }
  ctx.restore();
}

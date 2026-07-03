// render/layers/fx.js — Layer 9.5 (M5): mọi HIỆU ỨNG TỨC THỜI đọc từ world.effects
// (Game tick t, render CHỈ đọc — không ghi model §A7):
//   smash  {col,row,t}  — vòng đỏ nở ra khi đá phá block (M4)
//   splash {x,y,t,big}  — bọt nước trắng 2 vòng: gỗ/đá rơi thác (big) / gỗ neo (nhỏ)
//   pop    {col,row,t}  — vòng nâu nhỏ khi nhặt/đặt block
//   burst  {col,row,t}  — vòng xanh nở khi TRÚNG SLOT (nổi bật hơn glow nền ở blocks layer)
export function drawFx(ctx, world) {
  const g = world.grid;
  for (const fx of world.effects) {
    switch (fx.type) {
      case 'smash': {
        const c = g.cellCenter(fx.col, fx.row);
        const a = Math.max(0, Math.min(1, fx.t / 0.5));
        ring(ctx, c.x, c.y, 40 + (1 - a) * 70, `rgba(220,60,40,${a})`, 8);
        break;
      }
      case 'splash': {
        const a = Math.max(0, Math.min(1, fx.t / 0.6));
        const grow = 1 - a;
        const r0 = fx.big ? 30 : 18;
        ring(ctx, fx.x, fx.y, r0 + grow * (fx.big ? 90 : 40), `rgba(255,255,255,${a * 0.9})`, 6);
        ring(ctx, fx.x, fx.y, r0 * 0.5 + grow * (fx.big ? 55 : 24), `rgba(255,255,255,${a * 0.6})`, 4);
        break;
      }
      case 'pop': {
        const c = g.cellCenter(fx.col, fx.row);
        const a = Math.max(0, Math.min(1, fx.t / 0.35));
        ring(ctx, c.x, c.y, 20 + (1 - a) * 40, `rgba(169,119,47,${a})`, 5);
        break;
      }
      case 'burst': {
        const c = g.cellCenter(fx.col, fx.row);
        const a = Math.max(0, Math.min(1, fx.t / 0.8));
        ring(ctx, c.x, c.y, 30 + (1 - a) * 95, `rgba(63,174,90,${a})`, 10);
        break;
      }
      default:
        break; // 'glow' vẽ ở blocks layer (nền ô) — giữ nguyên
    }
  }
}

function ring(ctx, x, y, r, style, width) {
  ctx.strokeStyle = style;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}

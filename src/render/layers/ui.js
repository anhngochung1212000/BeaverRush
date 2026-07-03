// render/layers/ui.js — Layer 10: UI CỐ ĐỊNH (không pan — vẽ sau ctx.restore §A7.1):
// tiến độ X/Y, thanh mực nước (dâng M3), NÚT KHO GỖ (icon + count, tap thả gỗ §A4.1,
// disable khi count == 0), feedback busy/reject, overlay WIN/LOSE + nút Chơi lại/Màn tiếp (M3).
import {
  CANVAS_W,
  CANVAS_H,
  UI_WOOD_BUTTON,
  UI_END_PANEL,
  UI_END_BUTTONS,
  RIVER_FLOW_PX_PER_SEC,
} from '../../core/constants.js';
import { State } from '../../core/StateMachine.js';
import { drawSprite, drawTiledSprite } from '../drawSprite.js';

export function drawUI(ctx, store, game) {
  const world = game.world;
  ctx.save();

  // --- Bộ đếm tiến độ X / Y (key ui_progress §C7) ---
  const bp = world.blueprint;
  const text = `${bp.filledCount} / ${bp.total}`;
  const pw = 220;
  const ph = 84;
  const px = (CANVAS_W - pw) / 2;
  const py = 40;
  if (store.has('ui_progress')) {
    drawSprite(ctx, store, 'ui_progress', px, py, pw, ph);
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    roundRect(ctx, px, py, pw, ph, 18);
    ctx.fill();
  }
  ctx.fillStyle = '#222';
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, CANVAS_W / 2, py + ph / 2);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // --- Thanh mực nước (đồng hồ thua) — TĨNH ở M2 (key ui_water_bar §C7) ---
  const w = world.water;
  const bx = 24;
  const by = 260;
  const bw = 44;
  const bh = 560;
  if (store.has('ui_water_bar')) {
    drawSprite(ctx, store, 'ui_water_bar', bx, by, bw, bh);
  } else {
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 3;
    ctx.strokeRect(bx, by, bw, bh);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(bx, by, bw, bh);
  }
  const frac = Math.max(0, Math.min(1, w.current / w.max));
  const fillH = bh * frac;
  // M5: pulse cảnh báo khi nước gần đầy (>= 80%) — viền đỏ thở theo world.time
  if (frac >= 0.8) {
    const pulse = 0.45 + 0.45 * Math.sin(world.time * 6);
    ctx.strokeStyle = `rgba(220,60,40,${pulse})`;
    ctx.lineWidth = 6;
    ctx.strokeRect(bx - 3, by - 3, bw + 6, bh + 6);
  }
  // Fill = texture nước dùng chung (key ui_water_fill), cuộn theo flowTime (M3).
  // Tint đậm + vạch mặt nước để fill KHÔNG hoà lẫn nền sông (cùng texture) phía sau.
  if (fillH > 0) {
    drawTiledSprite(ctx, store, 'ui_water_fill', bx + 2, by + bh - fillH, bw - 4, fillH,
      undefined, (world.flowTime ?? 0) * RIVER_FLOW_PX_PER_SEC);
    ctx.fillStyle = 'rgba(23,74,124,0.45)';
    ctx.fillRect(bx + 2, by + bh - fillH, bw - 4, fillH);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillRect(bx + 2, by + bh - fillH, bw - 4, Math.min(3, fillH)); // clamp: fillH < 3 không tràn đáy bar
  }
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = '22px sans-serif';
  ctx.fillText('WATER', bx - 4, by - 14);

  // --- NÚT KHO GỖ (key ui_wood_button §C7) — tap để thả gỗ, disable khi count == 0 ---
  const wb = UI_WOOD_BUTTON;
  const stock = world.stock;
  const enabled = stock.count > 0;
  if (store.has('ui_wood_button')) {
    drawSprite(ctx, store, 'ui_wood_button', wb.x, wb.y, wb.w, wb.h);
  } else {
    ctx.fillStyle = enabled ? 'rgba(122,82,48,0.95)' : 'rgba(96,96,96,0.6)';
    roundRect(ctx, wb.x, wb.y, wb.w, wb.h, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 3;
    roundRect(ctx, wb.x, wb.y, wb.w, wb.h, 20);
    ctx.stroke();
  }
  // icon khúc gỗ + bộ đếm
  ctx.globalAlpha = enabled ? 1 : 0.5;
  ctx.fillStyle = '#a9772f';
  ctx.fillRect(wb.x + 22, wb.y + wb.h / 2 - 24, 72, 48);
  ctx.strokeStyle = 'rgba(0,0,0,0.4)';
  ctx.lineWidth = 3;
  ctx.strokeRect(wb.x + 22, wb.y + wb.h / 2 - 24, 72, 48);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 56px sans-serif';
  ctx.fillText(`x ${stock.count}`, wb.x + 112, wb.y + wb.h / 2 + 20);
  ctx.globalAlpha = 1;
  // progress block gỗ kế tiếp (ProductionSystem)
  const pfrac = Math.min(1, stock.timer / stock.intervalSec);
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(wb.x + 12, wb.y + wb.h - 20, wb.w - 24, 10);
  ctx.fillStyle = '#e0b34c';
  ctx.fillRect(wb.x + 12, wb.y + wb.h - 20, (wb.w - 24) * pfrac, 10);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = '22px sans-serif';
  ctx.fillText('WOOD — tap = thả gỗ', wb.x + 4, wb.y - 12);

  // --- Hint khi đang vác gỗ ---
  if (world.beaver.carrying !== null) {
    ctx.fillStyle = 'rgba(63,174,90,0.95)';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('Đang vác gỗ — tap Ô XANH để đặt', 360, CANVAS_H - 64);
  }

  // --- Feedback busy/reject (key ui_invalid §C7 — graybox: ring flash) ---
  const fb = world.feedback;
  if (fb && fb.x != null) {
    const a = Math.max(0, Math.min(1, fb.t / 0.5));
    const color = fb.kind === 'busy' ? `rgba(230,160,60,${a})` : `rgba(220,60,60,${a})`;
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(fb.x, fb.y, 34 + (1 - a) * 26, 0, Math.PI * 2);
    ctx.stroke();
    if (fb.kind === 'busy') {
      ctx.fillStyle = color;
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText('BUSY', fb.x - 40, fb.y - 52);
    }
  }

  // Tên level (debug, giúp verify loadLevel)
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '26px sans-serif';
  ctx.fillText(world.levelData.name, 24, 180);

  // --- Overlay WIN / LOSE (panel_win / panel_lose §C7) + nút Chơi lại / Màn tiếp (M3) ---
  if (game.sm.is(State.WIN) || game.sm.is(State.LOSE)) {
    const isWin = game.sm.is(State.WIN);
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    const pn = UI_END_PANEL;
    const key = isWin ? 'panel_win' : 'panel_lose';
    if (store.has(key)) {
      drawSprite(ctx, store, key, pn.x, pn.y, pn.w, pn.h);
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      roundRect(ctx, pn.x, pn.y, pn.w, pn.h, 24);
      ctx.fill();
    }
    ctx.textAlign = 'center';
    ctx.fillStyle = isWin ? '#2e7d32' : '#b03030';
    ctx.font = 'bold 96px sans-serif';
    ctx.fillText(isWin ? 'WIN' : 'LOSE', CANVAS_W / 2, pn.y + 150);
    ctx.fillStyle = '#444';
    ctx.font = '34px sans-serif';
    ctx.fillText(`${bp.filledCount} / ${bp.total}`, CANVAS_W / 2, pn.y + 225);
    // Nút — rect dùng CHUNG với InputController hit-test (§A6, như UI_WOOD_BUTTON)
    const rb = isWin ? UI_END_BUTTONS.restartWin : UI_END_BUTTONS.restartLose;
    drawEndButton(ctx, rb, '#7a5230', 'CHƠI LẠI');
    if (isWin) drawEndButton(ctx, UI_END_BUTTONS.next, '#2e7d32', 'MÀN TIẾP');
    ctx.textAlign = 'left';
  }

  // --- M5: fade-in chuyển màn (loadLevel đặt fadeIn=0.4, Game tick) — vẽ TRÊN CÙNG ---
  if (world.fadeIn > 0) {
    ctx.fillStyle = `rgba(0,0,0,${Math.min(1, world.fadeIn / 0.4)})`;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }

  ctx.restore();
}

// Nút graybox trên overlay WIN/LOSE (gọi khi ctx.textAlign = 'center')
function drawEndButton(ctx, r, color, label) {
  ctx.fillStyle = color;
  roundRect(ctx, r.x, r.y, r.w, r.h, 18);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  ctx.lineWidth = 3;
  roundRect(ctx, r.x, r.y, r.w, r.h, 18);
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 40px sans-serif';
  ctx.fillText(label, r.x + r.w / 2, r.y + r.h / 2 + 14);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

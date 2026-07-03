// render/layers/background.js — Layer 1: nền sông + thác (hệ SÔNG 0..1080;
// pan qua ctx.translate ở Renderer §A6). Rừng 2 bên -> layer forests.js (v2.0).
import { drawTiledSprite } from '../drawSprite.js';
import {
  CANVAS_H,
  RIVER_FLOW_PX_PER_SEC,
  WATERFALL_FLOW_PX_PER_SEC,
} from '../../core/constants.js';

export function drawBackground(ctx, store, world) {
  if (!world) return;
  // Sông HẸP giữa (reframe 2026-07-03): chỉ phủ vùng river-x [0, riverW]; 2 bên là bờ (forests)
  const riverW = world.camera.riverW;

  // Nền sông — texture nước TILE + cuộn xuôi dòng theo flowTime (M3: nhanh dần theo mực nước;
  // đứng yên ở WIN/LOSE vì flowTime đóng băng); graybox "RIVER" khi chưa có ảnh (§C5)
  const flowY = (world.flowTime ?? 0) * RIVER_FLOW_PX_PER_SEC;
  drawTiledSprite(ctx, store, 'bg_river', 0, 0, riverW, CANVAS_H, 'RIVER', flowY);

  const g = world.grid;

  // Vùng thác dưới đập (visual, §D1: grid bottom -> đáy màn) — phủ TRỌN bề rộng sông (như ref),
  // cuộn NHANH hơn mặt sông (nước rơi) + lớp sáng mờ phân biệt thác với sông (bọt graybox)
  const fallY = (world.flowTime ?? 0) * WATERFALL_FLOW_PX_PER_SEC;
  const damBottom = g.originY + g.pixelHeight;
  drawTiledSprite(ctx, store, 'waterfall', 0, damBottom, riverW, CANVAS_H - damBottom, 'FALL', fallY);
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(0, damBottom, riverW, CANVAS_H - damBottom);
}

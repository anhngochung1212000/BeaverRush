// render/layers/background.js — Layer 1: nền sông + thác (hệ SÔNG 0..1080;
// pan qua ctx.translate ở Renderer §A6). Rừng 2 bên -> layer forests.js (v2.0).
import { drawTiledSprite, drawSpriteRegion } from '../drawSprite.js';
import { CANVAS_H, RIVER_FLOW_PX_PER_SEC, FALL_SCROLL_PX_PER_SEC } from '../../core/constants.js';

export function drawBackground(ctx, store, world) {
  if (!world) return;
  // Sông HẸP giữa (reframe 2026-07-03): chỉ phủ vùng river-x [0, riverW]; 2 bên là bờ (forests)
  const riverW = world.camera.riverW;

  const g = world.grid;
  const damBottom = g.originY + g.pixelHeight;

  // 1) Nền sông — texture nước TILE + cuộn theo flowTime (đứng yên ở WIN/LOSE); graybox khi chưa có ảnh
  const flowY = (world.flowTime ?? 0) * RIVER_FLOW_PX_PER_SEC;
  drawTiledSprite(ctx, store, 'bg_river', 0, 0, riverW, CANVAS_H, 'RIVER', flowY);
  // 2) THÁC dưới đập (khớp river.png — fix "streak lợt/trắng bệch" 2026-07-04):
  //    2a) STREAK = fall_streaks TILE + cuộn XUỐNG full-opacity -> chảy MẠNH mà GIỮ đúng tông
  //        xanh-đậm của ref. (Trước dùng shimmer 'lighter' α0.35 CỘNG sáng -> mất tương phản.)
  const fallH = CANVAS_H - damBottom;
  const fallScroll = (world.flowTime ?? 0) * FALL_SCROLL_PX_PER_SEC;
  drawTiledSprite(ctx, store, 'fall_streaks', 0, damBottom, riverW, fallH, 'FALL', fallScroll);
  // 2b) CREST = dải foam TRẮNG ở mép thác (river.png y745..885 = 140 dòng đầu fall_full) vẽ TĨNH,
  //     feather đáy để nối MỀM vào streak cuộn -> crest trắng đậm như ref mà không lộ seam ngang.
  drawFallCrest(ctx, store, riverW, damBottom, fallH);
  // 3) KHÔNG tint (2026-07-04): giữ NGUYÊN màu river.png (sáng, lấp lánh) — sông & thác cùng
  //    nguồn river.png nên đã đồng tông.

  // 4) Chiều sâu NHẸ: chỉ tối rất mờ ở mép trên xa cho có chiều sâu, không làm mất tông river.png
  const depth = ctx.createLinearGradient(0, 0, 0, g.originY * 0.7);
  depth.addColorStop(0, 'rgba(6,34,60,0.22)');
  depth.addColorStop(1, 'rgba(6,34,60,0)');
  ctx.fillStyle = depth;
  ctx.fillRect(0, 0, riverW, g.originY * 0.7);

  // 5) BỌT TRẮNG động ở CHÂN THÁC (nước đập xuống sủi bọt) — churn band + bong bóng nhấp nháy
  drawFallFoam(ctx, riverW, CANVAS_H, world.time ?? 0);
}

// Dải foam CREST ở MÉP thác (140 dòng đầu của fall_full = river.png y745..885: lip trắng đậm
// -> taper về tông streak). Vẽ TĨNH khớp ref; feather 40% dưới (alpha giảm dần theo lát) để
// mép dưới hoà vào streak cuộn, KHÔNG lộ vạch ngang (seam) như bản ghép lip cũ.
const CREST_ROWS = 140;      // số dòng nguồn (trên fall_full 585px) chứa lip foam + taper
const CREST_FRAC = 0.24;     // crest chiếm 24% chiều cao thác trên màn
function drawFallCrest(ctx, store, riverW, top, fallH) {
  if (!store.has('waterfall')) return;
  const crestH = fallH * CREST_FRAC;
  const solidRows = CREST_ROWS * 0.6, solidH = crestH * 0.6;   // 60% trên: đục
  // phần đục (lip trắng đậm)
  drawSpriteRegion(ctx, store, 'waterfall', 0, 0, 944, solidRows, 0, top, riverW, solidH);
  // phần feather (40% dưới): N lát, alpha 1 -> 0 để tan vào streak
  const N = 8;
  const srcStep = (CREST_ROWS * 0.4) / N, dstStep = (crestH - solidH) / N;
  for (let k = 0; k < N; k++) {
    ctx.save();
    ctx.globalAlpha = 1 - (k + 0.5) / N;
    drawSpriteRegion(ctx, store, 'waterfall',
      0, solidRows + k * srcStep, 944, srcStep,
      0, top + solidH + k * dstStep, riverW, dstStep);
    ctx.restore();
  }
}

// Bọt chân thác — thuần thủ tục (không asset): dải churn trắng dâng từ đáy + cụm bong bóng
// dao động theo t (vị trí deterministic theo index; đứng yên khi WIN/LOSE vì world.time đóng băng).
const FOAM_H = 110; // chiều cao vùng bọt ở đáy
function drawFallFoam(ctx, riverW, canvasH, t) {
  const top = canvasH - FOAM_H;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, top, riverW, FOAM_H);
  ctx.clip();
  // Dải churn: trắng đặc ở đáy, mờ dần lên; nhấp nháy nhẹ theo t
  const churn = ctx.createLinearGradient(0, top, 0, canvasH);
  churn.addColorStop(0, 'rgba(255,255,255,0)');
  churn.addColorStop(0.55, `rgba(240,250,255,${0.4 + 0.08 * Math.sin(t * 4)})`);
  churn.addColorStop(1, 'rgba(255,255,255,0.9)');
  ctx.fillStyle = churn;
  ctx.fillRect(0, top, riverW, FOAM_H);
  // Bong bóng sủi: 3 hàng cụm tròn, bán kính + độ mờ dao động
  const N = Math.max(10, Math.round(riverW / 42));
  for (let i = 0; i < N; i++) {
    const bx = ((i + 0.5) / N) * riverW + Math.sin(t * 2 + i * 1.7) * 10;
    for (let row = 0; row < 3; row++) {
      const phase = i * 1.3 + row * 2.1;
      const by = canvasH - 20 - row * 26 + Math.sin(t * 3 + phase) * 8;
      const r = 9 + row * 2 + Math.sin(t * 5 + phase) * 4;
      const a = 0.35 + 0.3 * (0.5 + 0.5 * Math.sin(t * 4 + phase));
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.beginPath();
      ctx.arc(bx, by, Math.max(2, r), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

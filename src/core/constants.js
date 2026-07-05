// core/constants.js — hằng số toàn cục (prototype default, tunable)
export const CANVAS_W = 1080;   // hệ px nội bộ, portrait (§A5)
export const CANVAS_H = 1920;

export const LANES = 5;         // số lane cố định theo GDD

// Ngưỡng phân biệt TAP vs DRAG (px hệ nội bộ) — §A6, tunable
export const TAP_THRESHOLD_PX = 10;

// NÚT KHO GỖ cố định trên UI layer (§C7) — input hit-test + render dùng CHUNG rect này
export const UI_WOOD_BUTTON = { x: 40, y: 1710, w: 280, h: 150 };

// Overlay WIN/LOSE (M3) — panel + nút (input hit-test + render dùng CHUNG rect, như UI_WOOD_BUTTON)
export const UI_END_PANEL = { x: 220, y: 720, w: 640, h: 480 };
export const UI_END_BUTTONS = {
  restartWin:  { x: 250, y: 1030, w: 270, h: 110 }, // WIN: 2 nút cạnh nhau
  next:        { x: 560, y: 1030, w: 270, h: 110 },
  restartLose: { x: 405, y: 1030, w: 270, h: 110 }, // LOSE: 1 nút giữa panel
};

// M3.1 — dòng chảy theo TRAVEL TIME: xem levels.js field `drift` (per level) + WaterSystem.
// (FLOW_FACTOR_MAX cũ đã bỏ — tỉ lệ tăng tốc giờ = travelSecStart/travelSecMin per level.)

// Tốc độ camera tự kéo về vùng sông chính khi WIN/LOSE (hệ số ease mũ /s — M3)
export const CAMERA_RETURN_RATE = 6;

// Tốc độ cuộn texture nước xuôi dòng (px/s, visual thuần — chậm hơn hẳn gỗ trôi
// 350px/s để tạo cảm giác parallax; tunable)
export const RIVER_FLOW_PX_PER_SEC = 60;
// Thác cuộn XUỐNG nhanh (chảy mạnh) — px/s nhân flowFactor (tunable)
export const FALL_SCROLL_PX_PER_SEC = 700;

// Fixed timestep cho logic (§A2.2)
export const FIXED_DT = 1 / 60;   // giây
export const MAX_ACCUM = 0.25;    // chống spiral of death

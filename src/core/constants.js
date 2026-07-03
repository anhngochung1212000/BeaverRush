// core/constants.js — hằng số toàn cục (prototype default, tunable)
export const CANVAS_W = 1080;   // hệ px nội bộ, portrait (§A5)
export const CANVAS_H = 1920;

export const LANES = 5;         // số lane cố định theo GDD

// Ngưỡng phân biệt TAP vs DRAG (px hệ nội bộ) — §A6, tunable
export const TAP_THRESHOLD_PX = 10;

// NÚT KHO GỖ cố định trên UI layer (§C7) — input hit-test + render dùng CHUNG rect này
export const UI_WOOD_BUTTON = { x: 40, y: 1710, w: 280, h: 150 };

// Fixed timestep cho logic (§A2.2)
export const FIXED_DT = 1 / 60;   // giây
export const MAX_ACCUM = 0.25;    // chống spiral of death

// model/Camera.js — bố cục ngang (§A6, reframe 2026-07-03 theo ref):
// SÔNG HẸP ở giữa + 2 BỜ RỪNG 2 bên VỪA TRONG 1 KHUNG HÌNH — KHÔNG pan.
// forestW = bề rộng mỗi bờ trong khung; riverW = phần sông giữa = CANVAS_W − 2·forestW;
// worldW = CANVAS_W (khít khung) → panLimit = 0 → camera cố định (Renderer translate = forestW).
import { CANVAS_W } from '../core/constants.js';

export class Camera {
  constructor({ forestW = 175 } = {}) {
    this.forestW = forestW;
    this.riverW = CANVAS_W - 2 * forestW; // vùng sông (grid nằm gọn trong đây)
    this.worldW = CANVAS_W;
    this.panLimit = 0; // mọi thứ trong 1 khung — không kéo ngang (ref 2026-07-03)
    this.x = 0;        // cố định: translate = forestW − 0 = forestW (bờ trái lộ tại screen 0)
  }

  setX(v) {
    this.x = Math.max(0, Math.min(this.panLimit, v)); // panLimit=0 → luôn 0
  }
}

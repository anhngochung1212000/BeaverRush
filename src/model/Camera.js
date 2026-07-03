// model/Camera.js — camera.x + clamp pan ngang (§A6). Chỉ để XEM, không đổi logic.
// worldW = 1080 + 2*forestW; camera.x ∈ [0, panLimit]; init = forestW (nhìn thẳng sông).
// v2.1: kéo tự do trong limit, KHÔNG auto-return, KHÔNG nút recenter.
import { CANVAS_W } from '../core/constants.js';

export class Camera {
  constructor({ forestW = 450, panLimit = null } = {}) {
    this.forestW = forestW;
    this.worldW = CANVAS_W + 2 * forestW;
    this.panLimit = this.worldW - CANVAS_W; // PHẢI = 2*forestW — loader tự derive (§D8)
    if (panLimit != null && panLimit !== this.panLimit) {
      console.warn(`[Camera] panLimit JSON (${panLimit}) != 2*forestW (${this.panLimit}) — dùng giá trị derive`);
    }
    this.x = forestW; // init: nhìn thẳng vùng sông
  }

  setX(v) {
    this.x = Math.max(0, Math.min(this.panLimit, v));
  }
}

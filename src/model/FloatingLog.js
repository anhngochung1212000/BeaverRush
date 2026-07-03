// model/FloatingLog.js — khúc gỗ ĐANG TRÔI trên sông (§A3, v2.1: CHỈ còn DRIFTING).
// Bị chặn -> NEO = CONVERT thành Block hoàn chỉnh (FloatingLogSystem §A4.1), log biến mất.
// Gỗ đang trôi KHÔNG tap được.
let _nextId = 1;

export class FloatingLog {
  constructor({ lane, y }) {
    this.id = _nextId++;   // uid
    this.lane = lane;      // 0..4 (thả từ kho: random)
    this.y = y;            // px hệ sông (tâm log), spawn tại spawnY rồi trôi xuống
    // M3.1: KHÔNG còn speedPx per-log — vận tốc là THUỘC TÍNH CỦA SÔNG
    // (world.driftSpeedPx, suy từ drift.travelSec — WaterSystem), gỗ giữa sông tăng tốc theo
    this.alive = true;     // false khi trôi lọt xuống thác (mất) HOẶC đã neo (convert Block)
  }
}

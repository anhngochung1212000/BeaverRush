// model/Obstacle.js — ĐÁ LỚN đang trôi (§A3, M4). LOG obstacle KHÔNG dùng class này —
// spawn thẳng FloatingLog (chung cơ chế gỗ thả kho §D6 v2.1), nên thực tế chỉ còn ROCK.
export class Obstacle {
  constructor({ type, lane, y }) {
    // §A3 chuẩn: 'ROCK' | 'LOG'. Data §D8 (levels.js schedule) dùng lowercase
    // "rock"/"log" -> chuẩn hoá tại đây để ObstacleSystem so sánh không lệch case.
    this.type = String(type).toUpperCase();
    this.lane = lane;   // 0..4
    this.y = y;         // px (top->down, tăng dần); spawn tại spawnY = -cellH
    // M3.1/M4: KHÔNG còn speed per-obstacle — vận tốc là thuộc tính của sông
    // (world.driftSpeedPx, suy từ drift.travelSec — WaterSystem)
    this.alive = true;
  }
}

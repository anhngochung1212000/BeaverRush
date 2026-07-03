// model/Obstacle.js — ROCK / LOG (§A3).
// STUB M1: class theo cấu trúc §A1; ObstacleSystem spawn/di chuyển ở M4.
export class Obstacle {
  constructor({ type, lane, y, speed }) {
    // §A3 chuẩn: 'ROCK' | 'LOG'. Data §D8 (levels.js schedule) dùng lowercase
    // "rock"/"log" -> chuẩn hoá tại đây để M4 ObstacleSystem so sánh không lệch case.
    this.type = String(type).toUpperCase();
    this.lane = lane;   // 0..4
    this.y = y;         // px (top->down, tăng dần); spawn tại spawnY = -cellH
    this.speed = speed; // px/giây
    this.alive = true;
  }
}

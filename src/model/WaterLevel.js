// model/WaterLevel.js — đồng hồ thua (§A3).
// M1: model tĩnh (current = 0, KHÔNG dâng); WaterSystem dâng nước ở M3.
export class WaterLevel {
  constructor({ waterSecondsToFull }) {
    this.current = 0;                 // 0..max
    this.max = 1;                     // ngưỡng thua (chuẩn hoá 0..1)
    this.waterSecondsToFull = waterSecondsToFull;
    // dâng đều tuyến tính = luật code, không config (§A3)
    this.riseRatePerSec = this.max / waterSecondsToFull;
  }
}

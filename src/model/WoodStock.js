// model/WoodStock.js — kho gỗ khai thác (§A3, v2.0/v2.1: CHỈ 1 INSTANCE — rừng TRÁI;
// wood.right = null: rừng phải visual thuần, khu khai thác 2 để giai đoạn sau).
// KHÔNG giới hạn max; startingStock DEFAULT 3 (v2.1); ProductionSystem tick timer.
export class WoodStock {
  constructor({ intervalSec = 30, startingStock = 3 } = {}) {
    this.count = startingStock;          // số block gỗ trong kho (loader init = startingStock)
    this.startingStock = startingStock;  // từ LevelData.wood.left.startingStock
    this.intervalSec = intervalSec;      // 30s ra 1 block (tunable)
    this.timer = 0;                      // dồn dt, đạt interval -> count++
  }
}

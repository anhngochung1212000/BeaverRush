// systems/FloatingLogSystem.js — thả gỗ từ kho + trôi + neo (§A4.1 v2.1).
// Bị chặn (block front tương đối — kể cả ô ảo) -> NEO = CONVERT thành Block hoàn chỉnh
// tại ô trống cuối cùng ngay thượng lưu; trúng slot -> AUTO SLOT-FILL (+1 tiến độ, glow,
// KHÔNG cần hải ly); lane kín tới row 0 -> neo tiếp lên Ô ẢO row âm; lane HOÀN TOÀN hở
// -> trôi lọt xuống thác, gỗ MẤT. Gỗ đang trôi KHÔNG tap được.
import { FloatingLog } from '../model/FloatingLog.js';
import { Block } from '../model/Block.js';

export class FloatingLogSystem {
  // Tap nút kho (§A4.1): count>0 (không phụ thuộc hải ly) -> count-1, spawn lane NGẪU NHIÊN.
  // laneOverride: hook cho debug/smoke test (không dùng trong gameplay).
  static release(world, laneOverride = null) {
    const stock = world.stock;
    if (stock.count <= 0) return false;
    stock.count -= 1;
    const cfg = world.levelData.floatingLog ?? { speedPx: 350, spawnY: -150 };
    const lane = laneOverride == null
      ? Math.floor(Math.random() * world.grid.cols)
      : laneOverride;
    world.floatingLogs.push(new FloatingLog({ lane, y: cfg.spawnY, speedPx: cfg.speedPx }));
    return true;
  }

  update(game, dt) {
    const world = game.world;
    const g = world.grid;
    for (const log of world.floatingLogs) {
      if (!log.alive) continue;
      const front = g.frontRowBelow(log.lane, log.y);
      const ny = log.y + log.speedPx * dt;
      if (front !== null) {
        // Neo khi tâm log chạm tâm ô trống cuối cùng trước block front (§A4.1).
        // Tương đương §A8 "mép dưới log vượt mép trên vật chặn" với footprint logic
        // của log = 1 ô (cellH): y_tâm + cellH/2 >= topY(front) <=> y_tâm >= anchorCenterY.
        // (Sprite vẽ 100px < cellH chỉ là kích thước hình ảnh, không phải hitbox.)
        const anchorCenterY = g.originY + front * g.cellH - g.cellH / 2;
        if (ny >= anchorCenterY) {
          this._anchor(world, log, front);
          continue;
        }
      }
      log.y = ny;
      // Lane hoàn toàn hở: trôi lọt qua đáy grid xuống thác -> gỗ MẤT
      if (log.y > g.originY + g.pixelHeight + g.cellH) log.alive = false;
    }
    world.floatingLogs = world.floatingLogs.filter((l) => l.alive);
  }

  // NEO = CONVERT thành Block bình thường (chiếm occupancy, đi lên được, nhặt được).
  _anchor(world, log, frontRow) {
    const g = world.grid;
    let row = frontRow - 1;
    while (g.isOccupied(log.lane, row)) row--; // safety: dồn tiếp lên thượng lưu nếu ô đã chiếm
    const block = new Block({ col: log.lane, row });
    world.blocks.push(block);
    g.setCell(log.lane, row, block.id);
    if (row >= 0) {
      // AUTO SLOT-FILL (§A4.1): neo TRÚNG slot -> tự lấp, +1 tiến độ, glow xanh
      const slot = world.blueprint.slotAt(log.lane, row);
      if (slot && !slot.filled) {
        slot.filled = true;
        block.onBlueprint = true;
        world.effects.push({ type: 'glow', col: log.lane, row, t: 0.8 });
      }
    }
    // row < 0 = ô ảo: walkable/pickable, KHÔNG BAO GIỜ tính tiến độ (§A5)
    log.alive = false;
  }
}

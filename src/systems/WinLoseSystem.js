// systems/WinLoseSystem.js — blueprint đầy -> WIN NGAY (§A2.2 ghi chú M2: chạy độc lập
// khi Water/Obstacle chưa có). LOSE: cờ beaverDrowned (v2.1 — placeholder, trigger thật M4)
// hoặc nước đầy (WaterSystem M3 — chưa dâng ở M2).
import { State } from '../core/StateMachine.js';

export class WinLoseSystem {
  update(game) {
    if (!game.sm.is(State.PLAYING)) return;
    const world = game.world;
    if (world.blueprint.isComplete()) {
      game.sm.set(State.WIN);
      // WIN -> xóa obstacle + telegraph đang hiển thị (cosmetic — M4 mới có obstacle)
      world.obstacles.length = 0;
      return;
    }
    if (world.beaverDrowned || world.water.current >= world.water.max) {
      game.sm.set(State.LOSE);
    }
  }
}

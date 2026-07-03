// systems/WinLoseSystem.js — blueprint đầy -> WIN NGAY. LOSE: cờ beaverDrowned
// (M4: đá phá block hải ly đang đứng — ObstacleSystem set) hoặc nước đầy (WaterSystem M3).
import { State } from '../core/StateMachine.js';
import { Sfx, SfxEvent } from '../core/Sfx.js';

export class WinLoseSystem {
  update(game) {
    if (!game.sm.is(State.PLAYING)) return;
    const world = game.world;
    if (world.blueprint.isComplete()) {
      game.sm.set(State.WIN);
      // WIN -> xóa obstacle + telegraph đang hiển thị NGAY (§D6 — hết va chạm sau WIN)
      world.obstacles.length = 0;
      world.obstacleState.telegraphs.length = 0;
      Sfx.play(SfxEvent.WIN);
      return;
    }
    if (world.beaverDrowned || world.water.current >= world.water.max) {
      game.sm.set(State.LOSE);
      Sfx.play(SfxEvent.LOSE);
    }
  }
}

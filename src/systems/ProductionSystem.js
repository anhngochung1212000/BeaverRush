// systems/ProductionSystem.js — khu khai thác rừng TRÁI: +1 block gỗ vào kho
// mỗi intervalSec (30s, tunable — §D3). Kho KHÔNG giới hạn max (v2.1).
import { Sfx, SfxEvent } from '../core/Sfx.js';

export class ProductionSystem {
  update(game, dt) {
    const stock = game.world.stock;
    stock.timer += dt;
    while (stock.timer >= stock.intervalSec) {
      stock.timer -= stock.intervalSec;
      stock.count += 1;
      Sfx.play(SfxEvent.WOOD_PLUS);
    }
  }
}

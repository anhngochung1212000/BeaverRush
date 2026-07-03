// render/Renderer.js — điều phối vẽ theo thứ tự layer (§A7.1). RENDER chỉ ĐỌC model.
// v2.0: WORLD layers pan theo camera (ctx.translate) — layer code giữ hệ SÔNG,
// translate = forestW − camera.x (screenX = riverX + forestW − camera.x §A5);
// UI layers CỐ ĐỊNH vẽ sau ctx.restore().
import { CANVAS_W, CANVAS_H } from '../core/constants.js';
import { State } from '../core/StateMachine.js';
import { drawBackground } from './layers/background.js';
import { drawForests } from './layers/forests.js';
import { drawLanes } from './layers/lanes.js';
import { drawBlueprint } from './layers/blueprint.js';
import { drawGreenCells } from './layers/greencells.js';
import { drawBlocks } from './layers/blocks.js';
import { drawFloatingLogs } from './layers/floatinglogs.js';
import { drawObstacles } from './layers/obstacles.js';
import { drawBeaver } from './layers/beaver.js';
import { drawFx } from './layers/fx.js';
import { drawUI } from './layers/ui.js';

export class Renderer {
  constructor(ctx, store) {
    this.ctx = ctx;
    this.store = store;
  }

  render(game) {
    const { ctx, store } = this;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    if (game.sm.is(State.LOADING) || !game.world) {
      // Splash tối giản khi LOADING (§A2.1)
      ctx.fillStyle = '#1b3a4a';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = '#fff';
      ctx.font = '48px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('LOADING...', CANVAS_W / 2, CANVAS_H / 2);
      ctx.textAlign = 'left';
      return;
    }

    const world = game.world;
    const cam = world.camera;

    // --- WORLD layers (pan theo camera.x + rung màn M5) ---
    // Shake: jitter sin/cos theo world.time (deterministic), tắt dần theo shake.t
    const sh = world.shake;
    let jx = 0;
    let jy = 0;
    if (sh && sh.t > 0) {
      const k = (sh.t / sh.dur) * sh.mag;
      jx = Math.sin(world.time * 73) * k;
      jy = Math.cos(world.time * 91) * k * 0.6;
    }
    ctx.save();
    ctx.translate(Math.round(cam.forestW - cam.x + jx), Math.round(jy));
    drawBackground(ctx, store, world);   // 1. nền sông + thác
    drawForests(ctx, store, world);      // 2. rừng trái (mining camp) + rừng phải
    drawLanes(ctx, store, world);        // 3. lane + mũi tên hướng chảy
    drawBlueprint(ctx, store, world);    // 4. blueprint ghost
    drawGreenCells(ctx, store, world);   // 5. ô xanh (chỉ khi carrying)
    drawBlocks(ctx, store, world);       // 6. dam blocks (grid + ô ảo) + glow
    drawFloatingLogs(ctx, store, world); // 7. gỗ đang trôi
    drawObstacles(ctx, store, world);    // 8. đá lớn + telegraph (M4)
    drawBeaver(ctx, store, world);       // 9. hải ly builder
    drawFx(ctx, world);                  // 9.5. hiệu ứng tức thời: smash/splash/pop/burst (M5)
    ctx.restore();

    // --- UI layers (cố định, KHÔNG pan) ---
    drawUI(ctx, store, game);            // 10. tiến độ, nước, NÚT KHO, feedback, WIN/LOSE
  }
}

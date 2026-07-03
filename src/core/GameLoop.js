// core/GameLoop.js — requestAnimationFrame + fixed timestep accumulator (§A2.2)
import { FIXED_DT, MAX_ACCUM } from './constants.js';

export class GameLoop {
  constructor(game) {
    this.game = game;
    this.accumulator = 0;
    this.lastTime = null;
    this._frame = this._frame.bind(this);
  }

  start() {
    requestAnimationFrame(this._frame);
  }

  _frame(now) {
    const t = now / 1000;
    if (this.lastTime === null) this.lastTime = t;
    let frameTime = t - this.lastTime;
    this.lastTime = t;
    if (frameTime > MAX_ACCUM) frameTime = MAX_ACCUM;
    this.accumulator += frameTime;

    while (this.accumulator >= FIXED_DT) {
      this.game.fixedUpdate(FIXED_DT); // chỉ chạy system khi state === PLAYING
      this.accumulator -= FIXED_DT;
    }
    this.game.render(); // luôn render (kể cả PAUSED/WIN/LOSE)
    requestAnimationFrame(this._frame);
  }
}

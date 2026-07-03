// core/StateMachine.js — LOADING → PLAYING → (WIN | LOSE), PAUSED (§A2.1)
export const State = {
  LOADING: 'LOADING',
  PLAYING: 'PLAYING',
  WIN: 'WIN',
  LOSE: 'LOSE',
  PAUSED: 'PAUSED',
};

export class StateMachine {
  constructor(initial) {
    this.state = initial;
    this.prev = null;
  }
  set(next) {
    this.prev = this.state;
    this.state = next;
  }
  is(s) {
    return this.state === s;
  }
}

// model/Block.js — khối gỗ đã đặt trên grid (§A3).
// STUB M1: class tồn tại theo cấu trúc §A1; logic đặt/thu ở M2 (BeaverSystem).
let _nextId = 1;

export class Block {
  constructor({ col, row, size = '1x1' }) {
    this.id = _nextId++;      // uid
    this.size = size;         // prototype LUÔN '1x1'
    this.col = col;           // ô neo
    this.row = row;
    this.onBlueprint = false; // trùng slot blueprint (luật khớp §A4)
    this.alive = true;        // false khi bị đá văng / đang thu hồi
  }
}

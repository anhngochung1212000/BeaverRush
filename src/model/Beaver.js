// model/Beaver.js — hải ly builder + FSM nội bộ (§A3, v2.1).
// CHỈ đứng/đi trên block (mạng kề 4 hướng, gồm ô ảo). BeaverSystem tick logic.
export class Beaver {
  constructor({ startCol, startRow, speedPx, buildSec, pickupSec }, grid) {
    this.cell = { col: startCol, row: startRow }; // ô block đang đứng (PHẢI trùng 1 starter block)
    const c = grid.cellCenter(startCol, startRow);
    this.pos = { x: c.x, y: c.y };  // px hệ sông (nội suy khi đi path)
    this.state = 'IDLE';            // IDLE | CRAWLING | PICKING | BUILDING
    this.path = null;               // [cell,...] — đường BFS CÒN LẠI phải đi (CRAWLING)
    this.command = null;            // command đang thực thi (FETCH/PLACE)
    this.carrying = null;           // 'log' | null — vác 1 khúc/lần, không hàng đợi
    this.speedPx = speedPx;         // px/giây — travel time = tổng quãng path (px) / speedPx
    this.buildSec = buildSec;
    this.pickupSec = pickupSec;
    this.actionTimer = 0;           // đếm ngược PICKING/BUILDING
    this.facing = 1;                // 1 = nhìn phải, -1 = nhìn trái (render flip)
  }
}

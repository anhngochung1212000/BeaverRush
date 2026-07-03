// model/Grid.js — 5 lane (cột) x N hàng + OCCUPANCY MAP + Ô ẢO row âm (virtualCells)
// + helper mạng đi được: BFS block kề 4 hướng (reachable/island/path) — §A3, §A5, v2.1.
// DATA THUẦN — không đụng canvas, dễ port Unity. Mọi toạ độ px = hệ SÔNG (river-local).

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]]; // kề 4 hướng

export function cellKey(col, row) {
  return `${col},${row}`;
}

export class Grid {
  constructor({ cols = 5, rows, cellW, cellH, originX, originY }) {
    this.cols = cols;         // = số lane
    this.rows = rows;         // N theo màn
    this.cellW = cellW;       // px
    this.cellH = cellH;       // px
    this.originX = originX;   // góc trái-trên vùng grid (px, hệ sông)
    this.originY = originY;

    // OCCUPANCY MAP (rows 0..rows-1): cells[col][row] = blockId | null
    // ghi khi đặt/neo block, xóa khi block bị phá HOẶC bị nhặt (relocate — v2.1)
    this.cells = [];
    for (let c = 0; c < cols; c++) {
      this.cells.push(new Array(rows).fill(null));
    }

    // Ô ẢO v2.1 (§A5): Map key "col,row" (row < 0, KHÔNG giới hạn) -> blockId.
    // Chỉ hình thành từ gỗ neo tự nhiên khi lane kín tới row 0 — không đặt chủ động.
    this.virtualCells = new Map();
  }

  inGrid(col, row) {
    return col >= 0 && col < this.cols && row >= 0 && row < this.rows;
  }

  // Occupancy hợp nhất grid + ô ảo. row >= rows (dưới đáy grid) = luôn null.
  blockIdAt(col, row) {
    if (col < 0 || col >= this.cols) return null;
    if (row >= 0) return row < this.rows ? this.cells[col][row] : null;
    return this.virtualCells.get(cellKey(col, row)) ?? null;
  }

  isOccupied(col, row) {
    return this.blockIdAt(col, row) !== null;
  }

  setCell(col, row, blockId) {
    if (row >= 0) this.cells[col][row] = blockId;
    else this.virtualCells.set(cellKey(col, row), blockId);
  }

  clearCell(col, row) {
    if (row >= 0) {
      if (row < this.rows) this.cells[col][row] = null;
    } else {
      this.virtualCells.delete(cellKey(col, row));
    }
  }

  // Cell -> river px (góc trái-trên ô) — CHUNG công thức cho row âm (§A5)
  cellToScreen(col, row) {
    return {
      x: this.originX + col * this.cellW,
      y: this.originY + row * this.cellH,
    };
  }

  cellCenter(col, row) {
    return {
      x: this.originX + col * this.cellW + this.cellW / 2,
      y: this.originY + row * this.cellH + this.cellH / 2,
    };
  }

  // River px -> cell CLAMP trong grid (chỉ dùng cho ô xanh/PLACE — §A5 v2.1)
  screenToCell(px, py) {
    return {
      col: clamp(Math.floor((px - this.originX) / this.cellW), 0, this.cols - 1),
      row: clamp(Math.floor((py - this.originY) / this.cellH), 0, this.rows - 1),
    };
  }

  // Tâm lane: obstacle & gỗ nổi luôn trôi ở x này (§A5)
  laneCenterX(lane) {
    return this.originX + lane * this.cellW + this.cellW / 2;
  }

  get pixelWidth() {
    return this.cols * this.cellW;
  }

  get pixelHeight() {
    return this.rows * this.cellH;
  }

  // FloatingLogSystem: block front TƯƠNG ĐỐI với log đang ở y — row occupied NHỎ NHẤT
  // (kể cả ô ảo row âm) mà log CHƯA trôi qua tâm ô neo của nó
  // (anchorCenterY = topY(row) − cellH/2). null = lane hoàn toàn hở với log này.
  // HỆ QUẢ CHẤP NHẬN (deviation #3): block được PLACE vào lane SAU KHI log đã trôi qua
  // anchorCenterY của row đó sẽ bị log bỏ qua — nếu đó là block DUY NHẤT của lane,
  // log trôi "xuyên" và mất xuống thác (cửa sổ race ~0.6s @350px/s). Đổi lại,
  // quy tắc tương đối này tránh việc log bị "dịch ngược" lên thượng lưu để neo
  // vào block vừa xuất hiện phía trên nó (spec §A8 dùng quy tắc row-nhỏ-nhất tuyệt đối).
  frontRowBelow(lane, y) {
    let best = null;
    const consider = (row) => {
      const anchorCenterY = this.originY + row * this.cellH - this.cellH / 2;
      if (anchorCenterY >= y && (best === null || row < best)) best = row;
    };
    for (let r = 0; r < this.rows; r++) {
      if (this.cells[lane][r] !== null) consider(r);
    }
    for (const k of this.virtualCells.keys()) {
      const [c, r] = k.split(',').map(Number);
      if (c === lane) consider(r);
    }
    return best;
  }

  // BFS island: Set key "col,row" mọi block đi tới được từ fromCell
  // (kề 4 hướng, GỒM ô ảo — BFS xuyên biên row 0 ↔ −1). Hải ly CHỈ đi trên block.
  reachableBlocks(fromCell) {
    const seen = new Set();
    if (!this.isOccupied(fromCell.col, fromCell.row)) return seen;
    const queue = [{ col: fromCell.col, row: fromCell.row }];
    seen.add(cellKey(fromCell.col, fromCell.row));
    while (queue.length) {
      const c = queue.shift();
      for (const [dx, dy] of DIRS) {
        const col = c.col + dx;
        const row = c.row + dy;
        const k = cellKey(col, row);
        if (seen.has(k) || !this.isOccupied(col, row)) continue;
        seen.add(k);
        queue.push({ col, row });
      }
    }
    return seen;
  }

  // Path BFS ngắn nhất trên mạng block từ fromCell tới MỘT block kề-4 với targetCell
  // (FETCH: block kề block cần nhặt — KHÔNG đi xuyên qua chính targetCell;
  //  PLACE: targetCell là ô trống nên không bao giờ nằm trên mạng).
  // Trả [cell,...] GỒM ô xuất phát; null nếu không tới được (khác island).
  pathToAdjacent(fromCell, targetCell) {
    if (!this.isOccupied(fromCell.col, fromCell.row)) return null;
    const tKey = cellKey(targetCell.col, targetCell.row);
    const isGoal = (col, row) =>
      DIRS.some(([dx, dy]) => col + dx === targetCell.col && row + dy === targetCell.row);

    const start = { col: fromCell.col, row: fromCell.row };
    if (isGoal(start.col, start.row)) return [start];

    const prev = new Map(); // key -> key ô trước (null cho start)
    prev.set(cellKey(start.col, start.row), null);
    const queue = [start];
    while (queue.length) {
      const c = queue.shift();
      const cKey = cellKey(c.col, c.row);
      for (const [dx, dy] of DIRS) {
        const col = c.col + dx;
        const row = c.row + dy;
        const k = cellKey(col, row);
        if (k === tKey || prev.has(k) || !this.isOccupied(col, row)) continue;
        prev.set(k, cKey);
        if (isGoal(col, row)) {
          const path = [{ col, row }];
          let pk = cKey;
          while (pk !== null) {
            const [pc, pr] = pk.split(',').map(Number);
            path.unshift({ col: pc, row: pr });
            pk = prev.get(pk);
          }
          return path;
        }
        queue.push({ col, row });
      }
    }
    return null;
  }
}

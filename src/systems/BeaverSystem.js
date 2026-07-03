// systems/BeaverSystem.js — tiêu thụ Command FETCH/PLACE, đi path BFS trên mạng block,
// nhặt (PICKING 0.4s — block rời grid, lấp slot -> X−1) / đặt (BUILDING 0.4s — trúng slot
// -> X+1 glow, lệch -> tường tạm). Edge cases §A4.4: đích biến mất/bị chiếm -> hủy về IDLE
// GIỮ carrying; path đứt -> re-path / hủy. Cuối tick: tính GREEN CELLS (§A4.3).
import { Block } from '../model/Block.js';
import { cellKey } from '../model/Grid.js';
import { Sfx, SfxEvent } from '../core/Sfx.js';

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export class BeaverSystem {
  update(game, dt) {
    const world = game.world;
    const beaver = world.beaver;

    if (beaver.state === 'IDLE' && world.pendingCommand) this._startCommand(world);

    switch (beaver.state) {
      case 'CRAWLING':
        this._crawl(world, dt);
        break;
      case 'PICKING':
        beaver.actionTimer -= dt;
        if (beaver.actionTimer <= 0) this._finishPick(world);
        break;
      case 'BUILDING':
        beaver.actionTimer -= dt;
        if (beaver.actionTimer <= 0) this._finishBuild(world);
        break;
      default:
        break;
    }

    this._computeGreenCells(world);
  }

  _startCommand(world) {
    const beaver = world.beaver;
    const cmd = world.pendingCommand;
    world.pendingCommand = null;
    if (!this._commandValid(world, cmd)) return; // validate lại lúc nhận (tap đã check trước)
    const path = world.grid.pathToAdjacent(beaver.cell, cmd.targetCell);
    if (!path) return; // khác island (đã check ở tap — race hiếm) -> bỏ lệnh
    beaver.command = cmd;
    beaver.path = path.slice(1); // path[0] = ô đang đứng
    beaver.state = 'CRAWLING';
    if (beaver.path.length === 0) this._arrive(world);
  }

  _commandValid(world, cmd) {
    if (!cmd || !cmd.targetCell) return false;
    const g = world.grid;
    const beaver = world.beaver;
    const { col, row } = cmd.targetCell;
    if (cmd.kind === 'FETCH') {
      if (beaver.carrying !== null) return false;
      const id = g.blockIdAt(col, row);
      if (id === null || id !== cmd.blockId) return false;                 // target biến mất
      // v3.2: FETCH block ĐANG ĐỨNG hợp lệ — pathToAdjacent trả path NÉ sang block kề
      // (không có block kề -> path null, _startCommand tự bỏ lệnh); _crawl re-validate
      // chạy khi hải ly còn trên ô target nên KHÔNG được reject own-cell ở đây.
      return true;
    }
    if (cmd.kind === 'PLACE') {
      if (beaver.carrying === null) return false;
      return g.inGrid(col, row) && !g.isOccupied(col, row); // ô đích bị chiếm -> hủy (§A4.4)
    }
    return false;
  }

  _crawl(world, dt) {
    const beaver = world.beaver;
    if (!this._commandValid(world, beaver.command)) {
      this._toIdle(beaver); // hủy lệnh, GIỮ carrying (§A4.4)
      return;
    }
    // Path integrity: block trên path biến mất -> re-path từ ô hiện tại (§A4.4)
    if (beaver.path.some((c) => !world.grid.isOccupied(c.col, c.row))) {
      const p = world.grid.pathToAdjacent(beaver.cell, beaver.command.targetCell);
      if (!p) {
        this._toIdle(beaver);
        return;
      }
      beaver.path = p.slice(1);
    }
    if (beaver.path.length === 0) {
      this._arrive(world);
      return;
    }
    // Đi tâm-ô -> tâm-ô, speedPx px/giây trên tổng quãng path (§A5/§D4)
    let remaining = beaver.speedPx * dt;
    while (remaining > 0 && beaver.path.length > 0) {
      const next = beaver.path[0];
      const t = world.grid.cellCenter(next.col, next.row);
      const dx = t.x - beaver.pos.x;
      const dy = t.y - beaver.pos.y;
      const dist = Math.hypot(dx, dy);
      if (dx !== 0) beaver.facing = dx > 0 ? 1 : -1;
      if (dist <= remaining) {
        beaver.pos.x = t.x;
        beaver.pos.y = t.y;
        beaver.cell = { col: next.col, row: next.row };
        beaver.path.shift();
        remaining -= dist;
      } else {
        beaver.pos.x += (dx / dist) * remaining;
        beaver.pos.y += (dy / dist) * remaining;
        remaining = 0;
      }
    }
    if (beaver.path.length === 0) this._arrive(world);
  }

  _arrive(world) {
    const beaver = world.beaver;
    if (beaver.command.kind === 'FETCH') {
      beaver.state = 'PICKING';
      beaver.actionTimer = beaver.pickupSec;
    } else {
      beaver.state = 'BUILDING';
      beaver.actionTimer = beaver.buildSec;
    }
  }

  // PICKING xong: block biến mất khỏi grid/ô ảo; đang lấp slot -> filled=false, X−1;
  // carrying='log' (§A4.2). KHÔNG BAO GIỜ recall về kho.
  _finishPick(world) {
    const beaver = world.beaver;
    const cmd = beaver.command;
    const { col, row } = cmd.targetCell;
    if (world.grid.blockIdAt(col, row) === cmd.blockId) {
      const block = world.blocks.find((bl) => bl.id === cmd.blockId);
      if (block) block.alive = false;
      world.grid.clearCell(col, row);
      const slot = world.blueprint.slotAt(col, row);
      if (slot && slot.filled && block && block.onBlueprint) slot.filled = false; // X giảm 1
      if (block) block.onBlueprint = false;
      beaver.carrying = 'log';
      world.effects.push({ type: 'pop', col, row, t: 0.35 }); // M5
      Sfx.play(SfxEvent.PICKUP);
    }
    this._toIdle(beaver);
  }

  // BUILDING xong: spawn Block 1x1 tại targetCell; trùng slot -> filled=true (+1 tiến độ,
  // glow xanh); không trùng -> tường tạm (mở rộng mạng đi được) — §A4.3.
  _finishBuild(world) {
    const beaver = world.beaver;
    const { col, row } = beaver.command.targetCell;
    const g = world.grid;
    if (g.inGrid(col, row) && !g.isOccupied(col, row)) {
      const block = new Block({ col, row });
      world.blocks.push(block);
      g.setCell(col, row, block.id);
      const slot = world.blueprint.slotAt(col, row);
      if (slot && !slot.filled) {
        slot.filled = true;
        block.onBlueprint = true;
        world.effects.push({ type: 'glow', col, row, t: 0.8 });
        world.effects.push({ type: 'burst', col, row, t: 0.8 }); // M5: đặt TRÚNG slot nổi bật
        Sfx.play(SfxEvent.SLOT_FILL);
      } else {
        world.effects.push({ type: 'pop', col, row, t: 0.35 }); // M5: tường tạm
        Sfx.play(SfxEvent.PLACE_WALL);
      }
      beaver.carrying = null;
    }
    // ô bị chiếm giữa chừng (gỗ neo convert-Block chiếm mất) -> hủy, GIỮ carrying (§A4.4)
    this._toIdle(beaver);
  }

  _toIdle(beaver) {
    beaver.state = 'IDLE';
    beaver.path = null;
    beaver.command = null;
    beaver.actionTimer = 0;
  }

  // GREEN CELLS (§A4.3): ô TRỐNG TRONG GRID rows 0..N−1 (KHÔNG BAO GIỜ ô ảo)
  // kề-4 với >= 1 block reachable từ hải ly (reachable gồm cả block ô ảo).
  _computeGreenCells(world) {
    const beaver = world.beaver;
    if (beaver.carrying === null) {
      world.greenCells = [];
      world.greenCellKeys = new Set();
      return;
    }
    const g = world.grid;
    const reachable = g.reachableBlocks(beaver.cell);
    const keys = new Set();
    const cells = [];
    for (const k of reachable) {
      const [col, row] = k.split(',').map(Number);
      for (const [dx, dy] of DIRS) {
        const nc = col + dx;
        const nr = row + dy;
        if (!g.inGrid(nc, nr) || g.isOccupied(nc, nr)) continue;
        const nk = cellKey(nc, nr);
        if (keys.has(nk)) continue;
        keys.add(nk);
        cells.push({ col: nc, row: nr });
      }
    }
    world.greenCells = cells;
    world.greenCellKeys = keys;
  }
}

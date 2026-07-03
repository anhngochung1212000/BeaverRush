// input/InputController.js — pointer/touch: phân biệt TAP vs DRAG theo ngưỡng ~10px (§A6).
// DRAG trên nền = pan camera (không pause game, clamp, KHÔNG auto-return);
// TAP: hit-test UI CỐ ĐỊNH trước (nút kho — hệ screen) rồi tới world
// (block grid/ô ảo = FETCH, ô xanh = PLACE — đổi hệ worldX = screenX + camera.x §A5).
// 1 command/lúc, không hàng đợi: hải ly bận -> feedback "BUSY"; lệnh sai -> flash đỏ.
import { CANVAS_W, CANVAS_H, TAP_THRESHOLD_PX, UI_WOOD_BUTTON } from '../core/constants.js';
import { State } from '../core/StateMachine.js';
import { Command } from '../model/Command.js';
import { cellKey } from '../model/Grid.js';
import { FloatingLogSystem } from '../systems/FloatingLogSystem.js';

export class InputController {
  constructor(canvas, game) {
    this.canvas = canvas;
    this.game = game;
    this.active = false;
    this.dragging = false;
    this.pointerId = null; // pointer đang theo dõi — ngón thứ 2 bị bỏ qua (multi-touch)
    this.startX = 0;
    this.startY = 0;
    this.camStartX = 0;
    canvas.addEventListener('pointerdown', (e) => this._down(e));
    canvas.addEventListener('pointermove', (e) => this._move(e));
    canvas.addEventListener('pointerup', (e) => this._up(e));
    canvas.addEventListener('pointercancel', (e) => {
      if (this.active && e.pointerId !== this.pointerId) return;
      this.active = false;
      this.dragging = false;
      this.pointerId = null;
    });
  }

  // CSS px -> hệ px nội bộ 1080x1920 (canvas letterbox scale-to-fit)
  _pt(e) {
    const r = this.canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (CANVAS_W / r.width),
      y: (e.clientY - r.top) * (CANVAS_H / r.height),
    };
  }

  _down(e) {
    if (!this.game.world) return;
    if (this.active) return; // đã có ngón đang tương tác -> bỏ qua ngón mới (không giật camera)
    const p = this._pt(e);
    this.pointerId = e.pointerId;
    this.active = true;
    this.dragging = false;
    this.startX = p.x;
    this.startY = p.y;
    this.camStartX = this.game.world.camera.x;
    if (this.canvas.setPointerCapture) this.canvas.setPointerCapture(e.pointerId);
  }

  _move(e) {
    if (!this.active || e.pointerId !== this.pointerId) return;
    const p = this._pt(e);
    if (!this.dragging && Math.hypot(p.x - this.startX, p.y - this.startY) > TAP_THRESHOLD_PX) {
      this.dragging = true; // vượt ngưỡng -> DRAG, nhả ra KHÔNG phát sinh lệnh (§A6)
    }
    if (this.dragging) {
      this.game.world.camera.setX(this.camStartX - (p.x - this.startX));
    }
  }

  _up(e) {
    if (!this.active || e.pointerId !== this.pointerId) return;
    this.active = false;
    this.pointerId = null;
    if (this.dragging) {
      this.dragging = false;
      return;
    }
    this._tap(this._pt(e));
  }

  _tap({ x, y }) {
    const game = this.game;
    if (!game.sm.is(State.PLAYING)) return; // WIN/LOSE: dừng input
    const world = game.world;

    // 1) UI cố định TRƯỚC (hệ screen — §A6): nút kho gỗ = thả gỗ (§A4.1)
    const wb = UI_WOOD_BUTTON;
    if (x >= wb.x && x <= wb.x + wb.w && y >= wb.y && y <= wb.y + wb.h) {
      if (!FloatingLogSystem.release(world)) this._feedback(world, 'reject', x, y); // count == 0
      return;
    }

    // 2) World: screen -> river -> cell (floor thô, row ÂM tra virtualCells — §A5 v2.1)
    const g = world.grid;
    const cam = world.camera;
    const riverX = x + cam.x - cam.forestW;
    const col = Math.floor((riverX - g.originX) / g.cellW);
    const row = Math.floor((y - g.originY) / g.cellH);
    if (col >= 0 && col < g.cols) {
      const blockId = g.blockIdAt(col, row);
      if (blockId !== null) {
        this._tryFetch(world, blockId, col, row, x, y);
        return;
      }
      if (world.beaver.carrying !== null && world.greenCellKeys.has(cellKey(col, row))) {
        this._tryPlace(world, col, row, x, y);
        return;
      }
    }
    // đang vác mà tap ngoài ô xanh -> flash đỏ từ chối (§A4.3)
    if (world.beaver.carrying !== null) this._feedback(world, 'reject', x, y);
  }

  // FETCH — tap BẤT KỲ block (v2.1 §A4.2): check ngay khi tap, không hợp lệ -> từ chối
  _tryFetch(world, blockId, col, row, x, y) {
    const beaver = world.beaver;
    if (beaver.state !== 'IDLE' || world.pendingCommand) {
      this._feedback(world, 'busy', x, y); // đang bận — không hàng đợi
      return;
    }
    if (beaver.carrying !== null) {
      this._feedback(world, 'reject', x, y); // đang vác: chỉ PLACE được
      return;
    }
    if (beaver.cell.col === col && beaver.cell.row === row) {
      this._feedback(world, 'reject', x, y); // block hải ly đang đứng lên
      return;
    }
    if (!world.grid.reachableBlocks(beaver.cell).has(cellKey(col, row))) {
      this._feedback(world, 'reject', x, y); // khác island (§A4.4)
      return;
    }
    world.pendingCommand = new Command({ kind: 'FETCH', blockId, targetCell: { col, row } });
  }

  _tryPlace(world, col, row, x, y) {
    const beaver = world.beaver;
    if (beaver.state !== 'IDLE' || world.pendingCommand) {
      this._feedback(world, 'busy', x, y);
      return;
    }
    world.pendingCommand = new Command({ kind: 'PLACE', targetCell: { col, row } });
  }

  _feedback(world, kind, x, y) {
    world.feedback = { kind, x, y, t: 0.5 }; // UI layer vẽ, Game tick t
  }
}

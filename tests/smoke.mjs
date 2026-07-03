// tests/smoke.mjs — smoke test M2 headless (KHÔNG canvas: Game(null), không gọi render()).
// Chạy: node tests/smoke.mjs  (từ repo root). Kịch bản theo DoD M2:
// release->anchor->auto-slot-fill; lane hở mất gỗ; stack ô ảo; BFS reachability;
// FETCH X-1; PLACE X+1; WIN khi X==Y; production +1/intervalSec.
import assert from 'node:assert/strict';
import { Game } from '../src/core/Game.js';
import { State } from '../src/core/StateMachine.js';
import { Command } from '../src/model/Command.js';
import { FloatingLogSystem } from '../src/systems/FloatingLogSystem.js';

const DT = 1 / 60;
const game = new Game(null); // headless
game.loadLevel(0);           // level 0 "Thẳng": slots row 0, starter (2,1)&(3,1), beaver (2,1)
game.sm.set(State.PLAYING);
const w = game.world;
const step = (sec) => {
  for (let i = 0, n = Math.ceil(sec / DT); i < n; i++) game.fixedUpdate(DT);
};
const aliveBlocks = () => w.blocks.filter((b) => b.alive).length;
let pass = 0;
const ok = (cond, msg) => {
  assert.ok(cond, msg);
  pass++;
  console.log(`  ok - ${msg}`);
};

console.log('# 1. Loader v2.1 (§D8)');
ok(w.stock.count === 3 && w.stock.intervalSec === 30, 'wood.left: startingStock 3, intervalSec 30');
ok(w.camera.forestW === 450 && w.camera.panLimit === 900 && w.camera.x === 450, 'camera: forestW 450, panLimit 900, init x = forestW');
ok(w.levelData.floatingLog.speedPx === 350 && w.levelData.floatingLog.spawnY === -150, 'floatingLog config');
ok(aliveBlocks() === 2 && w.grid.isOccupied(2, 1) && w.grid.isOccupied(3, 1), 'starter blocks (2,1)(3,1)');

console.log('# 2. Release -> anchor -> AUTO SLOT-FILL (lane 2 có starter, slot row 0)');
ok(FloatingLogSystem.release(w, 2) === true, 'release lane 2 (override test hook)');
ok(w.stock.count === 2, 'kho -1 tại thời điểm thả');
step(6); // quãng -150 -> tâm ô (2,0)=975px, 350px/s ≈ 3.2s
ok(w.floatingLogs.length === 0, 'log đã neo (hết DRIFTING)');
ok(w.grid.blockIdAt(2, 0) !== null, 'neo = Block hoàn chỉnh tại (2,0) — ô ngay thượng lưu starter');
ok(w.blueprint.filledCount === 1, 'AUTO SLOT-FILL: trúng slot row 0 -> X = 1, không cần hải ly');

console.log('# 3. Lane HOÀN TOÀN hở -> gỗ mất');
const blocksBefore = aliveBlocks();
FloatingLogSystem.release(w, 0); // lane 0 không có block nào
ok(w.stock.count === 1, 'kho -1');
step(8);
ok(w.floatingLogs.length === 0, 'log trôi lọt xuống thác — despawn');
ok(aliveBlocks() === blocksBefore && w.grid.blockIdAt(0, 0) === null, 'không block mới — gỗ MẤT');
ok(w.blueprint.filledCount === 1, 'X không đổi');

console.log('# 4. Lane kín tới row 0 -> stack Ô ẢO row âm');
FloatingLogSystem.release(w, 2);
step(6);
ok(w.grid.blockIdAt(2, -1) !== null, 'neo tiếp lên ô ảo (2,-1) — virtualCells');
ok(w.grid.virtualCells.size === 1, 'virtualCells Map có đúng 1 entry');
ok(w.blueprint.filledCount === 1, 'block ô ảo KHÔNG BAO GIỜ tính tiến độ');

console.log('# 5. BFS reachability (mạng kề 4 hướng, xuyên row 0 <-> -1)');
const reach = w.grid.reachableBlocks(w.beaver.cell); // beaver (2,1)
ok(reach.has('3,1') && reach.has('2,0') && reach.has('2,-1'), 'island gồm (3,1),(2,0),(2,-1)');
const path = w.grid.pathToAdjacent(w.beaver.cell, { col: 2, row: -1 });
ok(path !== null && path.length === 2, 'path tới block kề (2,-1): (2,1)->(2,0)');

console.log('# 6. FETCH block đang lấp slot -> X giảm 1, carrying');
w.pendingCommand = new Command({ kind: 'FETCH', blockId: w.grid.blockIdAt(2, 0), targetCell: { col: 2, row: 0 } });
step(2); // beaver (2,1) kề (2,0): path tại chỗ + PICKING 0.4s
ok(w.beaver.carrying === 'log', 'carrying sau PICKING');
ok(w.grid.blockIdAt(2, 0) === null, 'block rời grid (occupancy xóa)');
ok(w.blueprint.filledCount === 0, 'nhặt block đang lấp slot -> slot.filled=false, X-1');

console.log('# 7. GREEN CELLS: chỉ ô trống TRONG grid kề mạng reachable, KHÔNG ô ảo');
ok(w.greenCellKeys.has('2,0') && w.greenCellKeys.has('1,1') && w.greenCellKeys.has('4,1'), 'ô xanh đúng (2,0),(1,1),(4,1)');
ok(![...w.greenCellKeys].some((k) => Number(k.split(',')[1]) < 0), 'không ô xanh trên vùng ô ảo');

console.log('# 8. PLACE vào slot -> X tăng 1, hết carrying');
w.pendingCommand = new Command({ kind: 'PLACE', targetCell: { col: 2, row: 0 } });
step(2);
ok(w.beaver.carrying === null, 'đặt xong hết carrying');
ok(w.grid.blockIdAt(2, 0) !== null, 'block mới tại (2,0)');
ok(w.blueprint.filledCount === 1, 'trùng slot -> filled=true, X+1 (relocate trọn vòng)');
ok(w.greenCells.length === 0, 'không carrying -> không ô xanh');

console.log('# 9. ProductionSystem: +1 block gỗ mỗi intervalSec (30s)');
const c0 = w.stock.count;
step(30.5);
ok(w.stock.count === c0 + 1, 'kho +1 sau 30s');

console.log('# 10. WIN NGAY khi X == Y');
for (const s of w.blueprint.slots) s.filled = true; // lấp nốt 4 slot còn lại (shortcut test)
game.fixedUpdate(DT);
ok(game.sm.is(State.WIN), 'blueprint đầy -> state WIN tức thì');
game.fixedUpdate(DT); // sau WIN: fixedUpdate không chạy system nữa
ok(game.sm.is(State.WIN), 'freeze ở WIN');

console.log(`\nSMOKE OK — ${pass} assertions passed`);

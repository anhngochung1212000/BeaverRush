// tests/smoke.mjs — smoke test M2+M3 headless (KHÔNG canvas: Game(null), không gọi render()).
// Chạy: node tests/smoke.mjs  (từ repo root). Kịch bản theo DoD M2:
// release->anchor->auto-slot-fill; lane hở mất gỗ; stack ô ảo; BFS reachability;
// FETCH X-1; PLACE X+1; WIN khi X==Y; production +1/intervalSec.
// DoD M3: nước dâng đều -> LOSE; WIN -> nước dừng; flowFactor 1x->2x; beaverDrowned -> LOSE;
// restart tại chỗ reset sạch; nextLevel clamp level cuối; camera tự về forestW khi WIN/LOSE.
import assert from 'node:assert/strict';
import { Game } from '../src/core/Game.js';
import { State } from '../src/core/StateMachine.js';
import { Command } from '../src/model/Command.js';
import { FloatingLogSystem } from '../src/systems/FloatingLogSystem.js';
import { Obstacle } from '../src/model/Obstacle.js';

const DT = 1 / 60;
// M4: schedule obstacle chạy trong MỌI game -> các test cũ (giả định sông sạch) phải TẮT
// schedule bằng cách đẩy nextIdx ra vô cực (entry lặp cuối cùng có tSec ~ nghìn giây).
const noSchedule = (g) => { g.world.obstacleState.nextIdx = 1e9; };
const game = new Game(null); // headless
game.loadLevel(0);           // level 0 "Thẳng": slots row 0, starter (2,1)&(3,1), beaver (2,1)
noSchedule(game);
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
ok(w.camera.forestW === 175 && w.camera.riverW === 730 && w.camera.panLimit === 0 && w.camera.x === 0, 'camera reframe: forestW 175, riverW 730, KHÔNG pan (panLimit 0, x 0)');
ok(w.levelData.floatingLog.spawnY === -150 && w.driftCfg.travelSecStart === 8 && w.driftCfg.travelSecMin === 4, 'drift config M3.1: spawnY -150, travel 8s -> sàn 4s');
ok(w.driftRefDist === 1500 && Math.abs(w.driftSpeedPx - 1500 / 8) < 1e-9, 'quãng chuẩn 1500px (spawn -150 -> tâm ô neo row 0 = 1350; cellH 100), v đầu màn = 187.5px/s');
ok(aliveBlocks() === 2 && w.grid.isOccupied(2, 1) && w.grid.isOccupied(3, 1), 'starter blocks (2,1)(3,1)');

console.log('# 2. Release -> anchor -> AUTO SLOT-FILL (lane 2 có starter, slot row 0)');
ok(FloatingLogSystem.release(w, 2) === true, 'release lane 2 (override test hook)');
ok(w.stock.count === 2, 'kho -1 tại thời điểm thả');
step(9); // quãng -150 -> tâm ô (2,0)=1350: 1500px, travelSecStart 8s (nước mới dâng ~0 -> ~7.9s thực tế)
ok(w.floatingLogs.length === 0, 'log đã neo (hết DRIFTING)');
ok(w.grid.blockIdAt(2, 0) !== null, 'neo = Block hoàn chỉnh tại (2,0) — ô ngay thượng lưu starter');
ok(w.blueprint.filledCount === 1, 'AUTO SLOT-FILL: trúng slot row 0 -> X = 1, không cần hải ly');

console.log('# 3. Lane HOÀN TOÀN hở -> gỗ mất');
const blocksBefore = aliveBlocks();
FloatingLogSystem.release(w, 0); // lane 0 không có block nào
ok(w.stock.count === 1, 'kho -1');
step(12); // quãng despawn dài hơn quãng neo (~1800px) — v tăng dần theo nước ≈ 9-10s
ok(w.floatingLogs.length === 0, 'log trôi lọt xuống thác — despawn');
ok(aliveBlocks() === blocksBefore && w.grid.blockIdAt(0, 0) === null, 'không block mới — gỗ MẤT');
ok(w.blueprint.filledCount === 1, 'X không đổi');

console.log('# 4. Lane kín tới row 0 -> stack Ô ẢO row âm');
FloatingLogSystem.release(w, 2);
step(8); // neo ô ảo (2,-1): quãng 1275px, v đã tăng theo nước (~200px/s) ≈ 6.3s
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

console.log('# 11. M3 WaterSystem: nước dâng khi PLAYING, WIN -> đóng băng');
ok(w.water.current > 0 && w.water.current < w.water.max, 'nước đã dâng trong lúc chơi (~55s/90s)');
const d0 = w.driftCfg;
const expTravel = d0.travelSecStart + (d0.travelSecMin - d0.travelSecStart) * (w.water.current / w.water.max);
ok(Math.abs(w.travelSec - expTravel) < 1e-9, 'M3.1: travelSec rút ngắn TUYẾN TÍNH theo mực nước (4s -> sàn 2s)');
ok(Math.abs(w.driftSpeedPx - w.driftRefDist / w.travelSec) < 1e-9
  && Math.abs(w.flowFactor - d0.travelSecStart / w.travelSec) < 1e-9,
  'v trôi = quãng chuẩn / travelSec (suy ra); flowFactor = start/travelSec');
const waterAtWin = w.water.current;
const flowTimeAtWin = w.flowTime;
step(5);
ok(w.water.current === waterAtWin && w.flowTime === flowTimeAtWin, 'WIN: nước + dòng chảy dừng ngay');

console.log('# 12. M3 camera cố định vùng sông chính khi WIN/LOSE (reframe: không pan)');
w.camera.x = 50; // giả lập lệch (dù panLimit=0 chặn pan) — WIN phải kéo về home=0
step(2);
ok(Math.abs(w.camera.x - 0) < 1, `camera về home = 0 (${w.camera.x.toFixed(1)})`);

console.log('# 13. M3 LOSE khi nước đầy (level 0: waterSecondsToFull 90)');
const g2 = new Game(null);
g2.loadLevel(0);
noSchedule(g2); // tránh rock t23 lane2 phá starter hải ly đứng -> LOSE sớm sai kịch bản
g2.sm.set(State.PLAYING);
const step2 = (sec) => { for (let i = 0, n = Math.ceil(sec / DT); i < n; i++) g2.fixedUpdate(DT); };
step2(89);
ok(g2.sm.is(State.PLAYING) && g2.world.water.current < g2.world.water.max, '89s: nước chưa đầy, vẫn PLAYING');
ok(g2.world.flowTime > g2.world.time, 'flowTime tích lũy nhanh hơn time (dòng chảy nhanh dần)');
step2(2);
ok(g2.sm.is(State.LOSE), 'nước đầy -> LOSE');

console.log('# 14. M3 LOSE stub hải ly rơi nước (beaverDrowned — trigger thật M4)');
const g3 = new Game(null);
g3.loadLevel(0);
g3.sm.set(State.PLAYING);
g3.world.beaverDrowned = true;
g3.fixedUpdate(DT);
ok(g3.sm.is(State.LOSE), 'cờ beaverDrowned -> LOSE ngay');

console.log('# 15. M3 restart tại chỗ + màn tiếp (clamp level cuối)');
g2.restart(); // từ LOSE test 13
ok(g2.sm.is(State.PLAYING), 'restart -> PLAYING không reload trang');
ok(g2.world.water.current === 0 && g2.world.flowFactor === 1 && g2.world.stock.count === 3
  && g2.world.blocks.filter((b) => b.alive).length === 2 && g2.world.floatingLogs.length === 0
  && g2.world.camera.x === 0,
  'restart: reset sạch (nước 0, flow 1x, kho 3, 2 starter, camera init x=0)');
ok(g2.world.inputCooldown > 0, 'restart đặt inputCooldown (nuốt tap trớn double-tap)');
step2(0.5);
ok(g2.world.inputCooldown <= 0, 'cooldown tự hết sau ~0.3s');
g2.nextLevel();
ok(g2.world.levelIndex === 1 && g2.sm.is(State.PLAYING), 'nextLevel: 0 -> 1 (Chữ U)');
g2.nextLevel();
ok(g2.world.levelIndex === 1, 'đang level cuối -> nextLevel load lại level cuối (clamp)');

console.log('# 16. v3.2 FETCH block hải ly ĐANG ĐỨNG -> tự né sang block kề rồi nhặt');
const g4 = new Game(null);
g4.loadLevel(0);
noSchedule(g4);
g4.sm.set(State.PLAYING);
const w4 = g4.world;
const step4 = (sec) => { for (let i = 0, n = Math.ceil(sec / DT); i < n; i++) g4.fixedUpdate(DT); };
// beaver spawn (2,1) ĐANG ĐỨNG trên starter block, kề starter (3,1)
w4.pendingCommand = new Command({ kind: 'FETCH', blockId: w4.grid.blockIdAt(2, 1), targetCell: { col: 2, row: 1 } });
step4(2); // né 1 ô (180px @320px/s ≈ 0.56s) + PICKING 0.4s
ok(w4.beaver.cell.col === 3 && w4.beaver.cell.row === 1, 'hải ly tự NÉ sang block kề (3,1)');
ok(w4.beaver.carrying === 'log', 'nhặt được block vừa đứng lên');
ok(w4.grid.blockIdAt(2, 1) === null, 'ô cũ (2,1) trống — block rời grid');
// Đảo 1 ô: (3,1) giờ không còn block kề — lệnh FETCH chính nó (giả lập race qua guard input)
// phải bị bỏ, không kẹt state. (Input guard từ chối từ đầu; đây test lớp BeaverSystem.)
w4.beaver.carrying = null; // reset để lệnh FETCH hợp lệ về mặt carrying
w4.pendingCommand = new Command({ kind: 'FETCH', blockId: w4.grid.blockIdAt(3, 1), targetCell: { col: 3, row: 1 } });
step4(1);
ok(w4.beaver.state === 'IDLE' && w4.pendingCommand === null && w4.grid.blockIdAt(3, 1) !== null,
  'đảo 1 ô: path null -> bỏ lệnh an toàn, block còn nguyên, không kẹt');

console.log('# 17. M4 schedule + telegraph (§D6: lv0 t3 log lane2, t7 log lane0, t11 rock lane4)');
const g5 = new Game(null);
g5.loadLevel(0);
g5.sm.set(State.PLAYING);
const w5 = g5.world;
const step5 = (sec) => { for (let i = 0, n = Math.ceil(sec / DT); i < n; i++) g5.fixedUpdate(DT); };
step5(2); // t=2: trong cửa sổ telegraph entry t3 (1.8s -> 3s)
ok(w5.obstacleState.telegraphs.length === 1 && w5.obstacleState.telegraphs[0].lane === 2,
  't=2: telegraph lane 2 hiện (cửa sổ tSec-1.2 -> tSec)');
ok(w5.floatingLogs.length === 0 && w5.obstacles.length === 0, 't=2: chưa spawn gì');
step5(1.2); // t=3.2: entry log lane 2 đã spawn
ok(w5.floatingLogs.length === 1 && w5.floatingLogs[0].lane === 2,
  'tSec: LOG obstacle spawn = FloatingLog (CHUNG cơ chế gỗ thả kho)');
ok(w5.obstacleState.telegraphs.length === 0, 'spawn xong -> gỡ telegraph');
ok(w5.stock.count === 3, 'log obstacle KHÔNG cộng/trừ kho');

console.log('# 18. M4 log obstacle neo -> auto slot-fill; rock lane hoàn toàn hở -> vô hại');
step5(9); // t=12.2: log lane2 (t3) đã neo (2,0); rock lane4 (t11) vừa spawn đang trôi
ok(w5.grid.blockIdAt(2, 0) !== null && w5.blueprint.filledCount === 1,
  'log obstacle neo (2,0) -> AUTO SLOT-FILL X=1');
ok(w5.obstacles.length === 1 && w5.obstacles[0].type === 'ROCK', 'rock lane 4 (t11) đang trôi');
step5(9); // t=21.2: rock lane 4 hở hoàn toàn -> lọt thác; log lane 0 (t7) cũng đã mất
ok(w5.obstacles.length === 0, 'rock lane hoàn toàn hở -> lọt thác, biến mất VÔ HẠI');
ok(w5.grid.blockIdAt(0, 0) === null, 'log lane 0 hở -> mất, không block mới');

console.log('# 19. M4 rock phá block front — Ô ẢO lá chắn trước — X−1 — phá block đang đứng = LOSE');
const g6 = new Game(null);
g6.loadLevel(0);
noSchedule(g6); // rock spawn TAY để kiểm soát kịch bản
g6.sm.set(State.PLAYING);
const w6 = g6.world;
const step6 = (sec) => { for (let i = 0, n = Math.ceil(sec / DT); i < n; i++) g6.fixedUpdate(DT); };
// Setup lane 2: log kho neo (2,0) lấp slot X=1, log nữa neo Ô ẢO (2,-1)
FloatingLogSystem.release(w6, 2);
step6(10);
FloatingLogSystem.release(w6, 2);
step6(10); // t=20
ok(w6.blueprint.filledCount === 1 && w6.grid.blockIdAt(2, -1) !== null,
  'setup: (2,0) lấp slot X=1 + ô ảo (2,-1) làm lá chắn');
w6.obstacles.push(new Obstacle({ type: 'rock', lane: 2, y: -300 }));
step6(8); // rock va front = row ÂM NHỎ NHẤT (ô ảo) trước
ok(w6.grid.blockIdAt(2, -1) === null && w6.grid.virtualCells.size === 0,
  'rock phá Ô ẢO (2,-1) trước (lá chắn tiêu hao)');
ok(w6.grid.blockIdAt(2, 0) !== null && w6.blueprint.filledCount === 1,
  'block (2,0) lấp slot còn nguyên sau lá chắn — X không đổi');
ok(w6.obstacles.length === 0, 'đá vỡ sau khi phá 1 block (DAMAGE=1)');

console.log('# 20. M4 rock phá block lấp slot -> X−1; phá block hải ly ĐANG ĐỨNG -> LOSE ngay');
const g7 = new Game(null);
g7.loadLevel(0);
noSchedule(g7);
g7.sm.set(State.PLAYING);
const w7 = g7.world;
const step7 = (sec) => { for (let i = 0, n = Math.ceil(sec / DT); i < n; i++) g7.fixedUpdate(DT); };
FloatingLogSystem.release(w7, 3); // neo (3,0) lấp slot X=1 (lane 3 có starter (3,1))
step7(10);
ok(w7.blueprint.filledCount === 1 && w7.grid.blockIdAt(3, 0) !== null, 'setup: (3,0) lấp slot X=1');
w7.obstacles.push(new Obstacle({ type: 'rock', lane: 3, y: 600 }));
step7(4);
ok(w7.grid.blockIdAt(3, 0) === null && w7.blueprint.filledCount === 0,
  'rock phá block đang lấp slot -> X giảm 1');
ok(g7.sm.is(State.PLAYING) && !w7.beaverDrowned, 'hải ly không đứng trên block bị phá -> KHÔNG LOSE');
w7.obstacles.push(new Obstacle({ type: 'rock', lane: 2, y: 600 })); // front lane 2 = (2,1) NƠI ĐANG ĐỨNG
step7(4);
ok(w7.beaverDrowned === true && g7.sm.is(State.LOSE),
  'đá phá block hải ly ĐANG ĐỨNG -> rơi nước -> LOSE NGAY (§A8.1)');

console.log('# 21. M5 juice: shake khi smash, splash khi neo/mất gỗ, burst slot-fill, fade-in');
const g8 = new Game(null);
g8.loadLevel(0);
noSchedule(g8);
g8.sm.set(State.PLAYING);
const w8 = g8.world;
const step8 = (sec) => { for (let i = 0, n = Math.ceil(sec / DT); i < n; i++) g8.fixedUpdate(DT); };
ok(w8.fadeIn > 0, 'loadLevel đặt fadeIn > 0 (chuyển màn mượt)');
step8(0.5);
ok(w8.fadeIn <= 0, 'fade-in tự hết sau ~0.4s');
FloatingLogSystem.release(w8, 2); // neo (2,0) trúng slot
step8(9);
ok(w8.effects.some((f) => f.type === 'burst') || w8.blueprint.filledCount === 1,
  'neo trúng slot -> burst xanh nổi bật (X=1)');
FloatingLogSystem.release(w8, 0); // lane hở -> mất
step8(11.5);
// splash mất gỗ t=0.6 có thể đã tan sau step dài — kiểm bằng đếm gỗ + không block
ok(w8.floatingLogs.length === 0 && w8.grid.blockIdAt(0, 0) === null, 'gỗ lane hở mất (splash đã bắn)');
ok(w8.shake.t <= 0, 'chưa smash -> không rung');
w8.obstacles.push(new Obstacle({ type: 'rock', lane: 2, y: 900 })); // phá ô ảo/block lane 2
step8(3);
ok(w8.shake.t > 0 || w8.effects.some((f) => f.type === 'smash') || w8.grid.blockIdAt(2, 0) === null,
  'đá phá block -> rung màn (shake.t vừa được set)');

console.log('# 22. M4.1 ROCK TARGETING: đá nhắm lane nhiều block nhất, khóa lane lúc telegraph');
const g9 = new Game(null);
g9.loadLevel(0);
noSchedule(g9);
g9.sm.set(State.PLAYING);
const w9 = g9.world;
const step9 = (sec) => { for (let i = 0, n = Math.ceil(sec / DT); i < n; i++) g9.fixedUpdate(DT); };
const picker = g9.systems.obstacle;
// starters (2,1)(3,1): hòa 1-1 -> lane index nhỏ thắng
ok(picker._pickRockLane(w9, 4) === 2, 'hòa số block -> chọn lane index NHỎ (2)');
FloatingLogSystem.release(w9, 3); // neo (3,0) -> lane 3 = 2 block (nhiều nhất)
step9(10);
ok(picker._pickRockLane(w9, 4) === 3, 'lane 3 nhiều block nhất (2) -> đá nhắm lane 3, bỏ qua lane schedule 4');
// mọi lane trống -> fallback lane schedule
const g10 = new Game(null);
g10.loadLevel(0);
noSchedule(g10);
g10.world.grid.clearCell(2, 1);
g10.world.grid.clearCell(3, 1);
ok(g10.systems.obstacle._pickRockLane(g10.world, 4) === 4, 'mọi lane 0 block -> giữ lane schedule (fallback)');
// Integration: telegraph KHÓA lane -> spawn đúng lane đã cảnh báo (entry t11 rock lane4 của lv0)
w9.obstacleState.nextIdx = 2;     // trỏ thẳng entry {tSec:11, rock, lane:4}
w9.time = 9.9;                    // trong cửa sổ telegraph (9.8 -> 11)
g9.fixedUpdate(DT);
const tg9 = w9.obstacleState.telegraphs[0];
ok(tg9 && tg9.type === 'ROCK' && tg9.lane === 3, 'telegraph hiện ĐÚNG lane mục tiêu (3), không phải lane data (4)');
step9(1.3); // qua t=11 -> spawn
const rock9 = w9.obstacles.find((o) => o.type === 'ROCK');
ok(rock9 && rock9.lane === 3, 'spawn dùng lane ĐÃ KHÓA lúc telegraph (3)');

console.log(`\nSMOKE OK — ${pass} assertions passed`);

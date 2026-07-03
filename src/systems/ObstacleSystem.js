// systems/ObstacleSystem.js — M4: spawn obstacle theo schedule + telegraph (§D6) +
// vật lý ĐÁ LỚN va block front.
// Semantics §D6 (chốt): tSec = thời điểm BẮT ĐẦU TRÔI (spawn tại spawnY đúng lúc tSec);
// telegraph nhấp nháy đỉnh lane từ tSec−telegraphLeadSec tới tSec; schedule chạy 1 LẦN,
// hết danh sách -> lặp lại ENTRY CUỐI mỗi repeatIntervalSec (giữ áp lực tới WIN/LOSE).
// LOG obstacle = spawn FloatingLog — CHUNG cơ chế gỗ thả kho (neo convert Block +
// auto slot-fill / lane hở mất; KHÔNG cộng/trừ kho). ROCK: va block front (row occupied
// NHỎ NHẤT kể cả Ô ẢO — lá chắn tiêu hao trước §A8) -> phá block (đang lấp slot -> X−1;
// hải ly ĐANG ĐỨNG trên đó -> beaverDrowned -> LOSE ngay §A8.1), đá vỡ (DAMAGE=1
// prototype — ⏳ đá phá xuyên N block tune sau); lane hoàn toàn hở -> lọt thác vô hại.
// 🆕 ROCK TARGETING (chốt 2026-07-03): obstacle PHÁ HỦY tự nhắm lane có NHIỀU BLOCK NHẤT
// (grid + ô ảo) — lane trong schedule chỉ là FALLBACK khi mọi lane trống. Lane được chọn
// và KHÓA ngay lúc TELEGRAPH (cảnh báo trung thực chỗ sắp bị đánh); hòa -> lane index nhỏ.
// Vận tốc trôi = world.driftSpeedPx (M3.1 — thuộc tính của sông, chung mọi obstacle).
// State schedule nằm trong world.obstacleState (loadLevel reset -> restart sạch).
import { Obstacle } from '../model/Obstacle.js';
import { FloatingLog } from '../model/FloatingLog.js';
import { Sfx, SfxEvent } from '../core/Sfx.js';

export class ObstacleSystem {
  update(game, dt) {
    const world = game.world;
    const cfg = world.levelData.obstacles;
    if (cfg?.schedule?.length) this._tickSchedule(world, cfg);
    this._tickRocks(world, dt);
  }

  // Entry kế tiếp: trong danh sách -> sched[nextIdx]; hết -> entry cuối lặp mỗi repeatIntervalSec
  _nextEntry(world, cfg) {
    const st = world.obstacleState;
    const sched = cfg.schedule;
    if (st.nextIdx < sched.length) return sched[st.nextIdx];
    const last = sched[sched.length - 1];
    const k = st.nextIdx - sched.length + 1;
    return { tSec: last.tSec + k * (cfg.repeatIntervalSec ?? 4), type: last.type, lane: last.lane };
  }

  _tickSchedule(world, cfg) {
    const st = world.obstacleState;
    const lead = cfg.telegraphLeadSec ?? 1.2;
    let entry = this._nextEntry(world, cfg);
    // Nhiều entry có thể đến hạn cùng tick (catch-up). Telegraph chỉ treo cho entry
    // KẾ TIẾP — data §D8 giãn cách 4s > lead 1.2s nên không bao giờ chồng cửa sổ.
    while (world.time >= entry.tSec - lead) {
      const type = String(entry.type).toUpperCase();
      if (world.time < entry.tSec) {
        if (!st.telegraphs.some((t) => t.idx === st.nextIdx)) {
          st.telegraphs.push({
            idx: st.nextIdx,
            // ROCK: chọn + KHÓA lane mục tiêu ngay lúc cảnh báo (block mọc thêm trong
            // 1.2s lead KHÔNG đổi mục tiêu — người chơi tin được telegraph)
            lane: type === 'ROCK' ? this._pickRockLane(world, entry.lane) : entry.lane,
            type,
            untilT: entry.tSec, // render nhấp nháy tới lúc spawn
          });
          Sfx.play(SfxEvent.TELEGRAPH);
        }
        break;
      }
      // Spawn: dùng lane ĐÃ KHÓA lúc telegraph; catch-up (nhảy cóc không kịp telegraph,
      // vd test/lag) -> chọn tại chỗ
      const tg = st.telegraphs.find((t) => t.idx === st.nextIdx);
      const lane = tg ? tg.lane
        : type === 'ROCK' ? this._pickRockLane(world, entry.lane) : entry.lane;
      this._spawn(world, cfg, entry, lane);
      st.telegraphs = st.telegraphs.filter((t) => t.idx !== st.nextIdx);
      st.nextIdx += 1;
      entry = this._nextEntry(world, cfg);
    }
  }

  // Lane có NHIỀU block nhất (grid rows 0..N-1 + ô ảo row âm). Hòa -> lane index NHỎ
  // (deterministic cho test/replay); mọi lane 0 block -> fallbackLane (schedule) — đá
  // không có gì để phá, trôi lọt vô hại.
  _pickRockLane(world, fallbackLane) {
    const g = world.grid;
    let best = fallbackLane;
    let bestCount = 0;
    for (let lane = 0; lane < g.cols; lane++) {
      let n = 0;
      for (let r = 0; r < g.rows; r++) {
        if (g.cells[lane][r] !== null) n++;
      }
      for (const k of g.virtualCells.keys()) {
        if (Number(k.split(',')[0]) === lane) n++;
      }
      if (n > bestCount) {
        bestCount = n;
        best = lane;
      }
    }
    return best;
  }

  _spawn(world, cfg, entry, lane) {
    const spawnY = cfg.spawnY ?? -150;
    if (String(entry.type).toUpperCase() === 'LOG') {
      world.floatingLogs.push(new FloatingLog({ lane, y: spawnY }));
    } else {
      world.obstacles.push(new Obstacle({ type: entry.type, lane, y: spawnY }));
    }
  }

  _tickRocks(world, dt) {
    const g = world.grid;
    const v = world.driftSpeedPx;
    for (const ob of world.obstacles) {
      if (!ob.alive) continue;
      const front = g.frontRowBelow(ob.lane, ob.y);
      const ny = ob.y + v * dt;
      if (front !== null) {
        // Va khi mép dưới đá (footprint logic 1 ô) chạm mặt trên block front —
        // CÙNG ngưỡng hình học với log neo (§A8): y_tâm >= anchorCenterY trước block
        const hitY = g.originY + front * g.cellH - g.cellH / 2;
        if (ny >= hitY) {
          this._smash(world, ob.lane, front);
          ob.alive = false; // DAMAGE=1: phá 1 block rồi vỡ
          continue;
        }
      }
      ob.y = ny;
      if (ob.y > g.originY + g.pixelHeight + g.cellH) {
        ob.alive = false; // lọt thác vô hại (splash M5)
        world.effects.push({ type: 'splash', x: g.laneCenterX(ob.lane), y: ob.y, t: 0.6, big: true });
      }
    }
    world.obstacles = world.obstacles.filter((o) => o.alive);
  }

  // Phá block tại (lane, row): rời grid/ô ảo; đang lấp slot -> X−1;
  // hải ly đang đứng -> rơi nước (WinLoseSystem set LOSE ngay tick này).
  _smash(world, lane, row) {
    const g = world.grid;
    const id = g.blockIdAt(lane, row);
    if (id === null) return;
    const block = world.blocks.find((b) => b.id === id);
    if (block) block.alive = false;
    g.clearCell(lane, row);
    const slot = world.blueprint.slotAt(lane, row);
    if (slot && slot.filled && block && block.onBlueprint) slot.filled = false;
    world.effects.push({ type: 'smash', col: lane, row, t: 0.5 });
    world.shake.t = world.shake.dur; // M5: rung màn khi đá văng block
    Sfx.play(SfxEvent.ROCK_SMASH);
    if (world.beaver.cell.col === lane && world.beaver.cell.row === row) {
      world.beaverDrowned = true;
    }
  }
}

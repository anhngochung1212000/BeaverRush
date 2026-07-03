// systems/WaterSystem.js — đồng hồ thua (M3 §A3): nước dâng ĐỀU max/waterSecondsToFull;
// đầy -> WinLoseSystem set LOSE (system này KHÔNG đổi state — chỉ ghi model).
// Dòng chảy theo TRAVEL TIME (M3.1 chốt 2026-07-03): mỗi màn quy định THỜI GIAN trôi
// spawn -> tâm ô neo row 0 (drift.travelSecStart); nước dâng -> travelSec RÚT NGẮN
// tuyến tính, chạm SÀN travelSecMin khi nước đầy. Vận tốc trôi CHUNG cho mọi obstacle
// trên sông (FloatingLog M3, Obstacle M4) = driftRefDist / travelSec — SUY RA từ thời gian,
// không config px/s. flowFactor = tỉ lệ tăng tốc (travelSecStart/travelSec, 1x đầu màn);
// flowTime = tích phân dt*flowFactor để layer nước cuộn texture (tích lũy — KHÔNG nhân
// trực tiếp vào time, tránh texture nhảy vị trí khi factor đổi).
// Chỉ được gọi khi PLAYING (Game.fixedUpdate đã guard).
export class WaterSystem {
  update(game, dt) {
    const world = game.world;
    const w = world.water;
    w.current = Math.min(w.max, w.current + w.riseRatePerSec * dt);
    const frac = w.current / w.max;
    const d = world.driftCfg;
    world.travelSec = d.travelSecStart + (d.travelSecMin - d.travelSecStart) * frac;
    world.driftSpeedPx = world.driftRefDist / world.travelSec;
    world.flowFactor = d.travelSecStart / world.travelSec;
    world.flowTime += dt * world.flowFactor;
  }
}

// core/Game.js — class Game: state machine + world + update/render dispatch.
// M3: chuỗi system §A2.2 (system chưa tồn tại = stub an toàn, không nằm trong chuỗi):
// ProductionSystem -> FloatingLogSystem -> (ObstacleSystem M4) -> BeaverSystem
// -> WaterSystem -> WinLoseSystem.
import { State, StateMachine } from './StateMachine.js';
import { levels } from '../config/levels.js';
import { Grid } from '../model/Grid.js';
import { Blueprint } from '../model/Blueprint.js';
import { Beaver } from '../model/Beaver.js';
import { WoodStock } from '../model/WoodStock.js';
import { WaterLevel } from '../model/WaterLevel.js';
import { Block } from '../model/Block.js';
import { Camera } from '../model/Camera.js';
import { ProductionSystem } from '../systems/ProductionSystem.js';
import { FloatingLogSystem } from '../systems/FloatingLogSystem.js';
import { BeaverSystem } from '../systems/BeaverSystem.js';
import { ObstacleSystem } from '../systems/ObstacleSystem.js';
import { WaterSystem } from '../systems/WaterSystem.js';
import { WinLoseSystem } from '../systems/WinLoseSystem.js';
import { CAMERA_RETURN_RATE } from './constants.js';

export class Game {
  constructor(renderer) {
    this.sm = new StateMachine(State.LOADING);
    this.renderer = renderer; // null = headless (test) — chỉ không gọi render()
    this.world = null;
    this.systems = {
      production: new ProductionSystem(),
      floatingLog: new FloatingLogSystem(),
      obstacle: new ObstacleSystem(),
      beaver: new BeaverSystem(),
      water: new WaterSystem(),
      winLose: new WinLoseSystem(),
    };
  }

  // Loader: loadLevel(index) đọc levels[index] (mặc định 0), init model từ data (§D8 v2.1).
  loadLevel(index = 0) {
    const idx = levels[index] ? index : 0; // index ngoài range -> về 0 (levelIndex phản ánh level THẬT)
    const data = levels[idx];
    const grid = new Grid(data.grid);
    // M3.1: quãng chuẩn của travel time = spawn -> TÂM Ô NEO row 0 (điểm neo sát blueprint)
    const driftCfg = data.drift ?? { travelSecStart: 4, travelSecMin: 2 };
    const driftRefDist = grid.originY + grid.cellH / 2 - (data.floatingLog?.spawnY ?? -150);

    this.world = {
      levelIndex: idx,
      levelData: data, // giữ nguyên data gốc (obstacles schedule... inert tới M4)
      grid,
      blueprint: new Blueprint(data.blueprint.slots),
      camera: new Camera(data.camera ?? {}),
      // v2.0/v2.1: 1 kho duy nhất (rừng TRÁI); wood.right = null = visual thuần
      stock: new WoodStock(data.wood?.left ?? {}),
      beaver: new Beaver(data.beaver, grid),
      water: new WaterLevel(data.water), // TĨNH ở M2 (WaterSystem M3)
      blocks: [],
      floatingLogs: [],
      obstacles: [],
      // M4: state schedule obstacle nằm TRONG world -> restart/loadLevel tự reset sạch
      obstacleState: { nextIdx: 0, telegraphs: [] },
      pendingCommand: null,
      greenCells: [],
      greenCellKeys: new Set(),
      effects: [],        // [{type, ...}] — glow/burst/smash/splash/pop (fx.js + blocks.js đọc)
      shake: { t: 0, dur: 0.3, mag: 12 }, // M5: rung màn khi đá văng block (Renderer đọc)
      fadeIn: 0.4,        // M5: chuyển màn mượt — overlay đen mờ dần khi vào level (ui.js đọc)
      feedback: null,     // {kind:'busy'|'reject', x, y, t} — hệ screen (UI layer vẽ)
      beaverDrowned: false, // cờ LOSE v2.1 — WinLoseSystem check; trigger thật ở M4
      time: 0,            // đồng hồ logic (anim frame render đọc)
      driftCfg,           // M3.1: {travelSecStart, travelSecMin} — thời gian trôi per level
      driftRefDist,       // M3.1: quãng chuẩn (px) để suy vận tốc từ travelSec
      travelSec: driftCfg.travelSecStart,                 // WaterSystem rút ngắn theo mực nước
      driftSpeedPx: driftRefDist / driftCfg.travelSecStart, // vận tốc CHUNG mọi obstacle (suy ra)
      flowFactor: 1,      // tỉ lệ tăng tốc dòng (travelSecStart/travelSec) — layer nước đọc
      flowTime: 0,        // tích phân dt*flowFactor — layer nước đọc để cuộn texture
      inputCooldown: 0,   // M3: chặn tap ngắn sau restart/next (double-tap nút overlay lọt xuống world)
    };

    // Starter blocks: block 1x1 TẶNG SẴN — tường tạm off-blueprint, kiêm mạng đi được
    // khởi đầu & chỗ đứng hải ly (PHẢI kề nhau; v2.1: nhặt-relocate được như mọi block).
    for (const sb of data.starterBlocks ?? []) {
      if (!grid.inGrid(sb.col, sb.row)) {
        console.warn(`[Game] starterBlock (${sb.col},${sb.row}) ngoài grid — bỏ qua`);
        continue;
      }
      if (grid.isOccupied(sb.col, sb.row)) {
        console.warn(`[Game] starterBlock (${sb.col},${sb.row}) ô đã bị chiếm — bỏ qua`);
        continue;
      }
      const block = new Block({ col: sb.col, row: sb.row, size: '1x1' });
      block.onBlueprint = false; // ngoài blueprint — không glow, không đếm X/Y
      this.world.blocks.push(block);
      grid.setCell(sb.col, sb.row, block.id);
    }
  }

  // M3: restart tại chỗ — reset SẠCH level qua loadLevel (kho, gỗ nổi, block, nước, hải ly,
  // camera về forestW), KHÔNG reload trang.
  restart() {
    this.loadLevel(this.world.levelIndex);
    this.world.inputCooldown = 0.3; // nuốt tap thứ 2 của double-tap trên nút overlay
    this.sm.set(State.PLAYING);
  }

  // M3: màn tiếp (chỉ gọi từ overlay WIN) — đang ở level cuối thì load lại level cuối (chốt user)
  nextLevel() {
    this.loadLevel(Math.min(this.world.levelIndex + 1, levels.length - 1));
    this.world.inputCooldown = 0.3;
    this.sm.set(State.PLAYING);
  }

  fixedUpdate(dt) {
    const world = this.world;
    if (!world) return;
    // WIN/LOSE (M3): freeze world; riêng camera tự kéo mượt về vùng sông chính (x = forestW)
    // + shake tắt dần (cosmetic — tránh đứng hình lệch khi smash -> LOSE cùng tick, M5)
    if (this.sm.is(State.WIN) || this.sm.is(State.LOSE)) {
      const cam = world.camera;
      const home = cam.panLimit / 2; // vùng sông chính (reframe: panLimit=0 -> home=0, không pan)
      const dx = home - cam.x;
      cam.setX(Math.abs(dx) < 1 ? home : cam.x + dx * Math.min(1, dt * CAMERA_RETURN_RATE));
      if (world.shake.t > 0) world.shake.t -= dt;
      return;
    }
    if (!this.sm.is(State.PLAYING)) return;
    world.time += dt;
    if (world.inputCooldown > 0) world.inputCooldown -= dt;

    // Thứ tự §A2.2: khai thác -> gỗ nổi trôi/neo -> obstacle -> hải ly -> nước -> thắng/thua
    this.systems.production.update(this, dt);
    this.systems.floatingLog.update(this, dt);
    this.systems.obstacle.update(this, dt);
    this.systems.beaver.update(this, dt);
    this.systems.water.update(this, dt);
    this.systems.winLose.update(this, dt);

    // Tick hiệu ứng/feedback (render chỉ đọc)
    if (world.shake.t > 0) world.shake.t -= dt;
    if (world.fadeIn > 0) world.fadeIn -= dt;
    for (const fx of world.effects) fx.t -= dt;
    world.effects = world.effects.filter((fx) => fx.t > 0);
    if (world.feedback) {
      world.feedback.t -= dt;
      if (world.feedback.t <= 0) world.feedback = null;
    }
    // Dọn xác block chết thi thoảng (render đã skip !alive)
    if (world.blocks.length > 64) world.blocks = world.blocks.filter((b) => b.alive);
  }

  render() {
    this.renderer.render(this);
  }
}

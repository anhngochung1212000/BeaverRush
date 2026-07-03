// core/Game.js — class Game: state machine + world + update/render dispatch.
// M2: chuỗi system §A2.2 (system chưa tồn tại = stub an toàn, không nằm trong chuỗi):
// ProductionSystem -> FloatingLogSystem -> (ObstacleSystem M4) -> BeaverSystem
// -> (WaterSystem M3) -> WinLoseSystem.
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
import { WinLoseSystem } from '../systems/WinLoseSystem.js';

export class Game {
  constructor(renderer) {
    this.sm = new StateMachine(State.LOADING);
    this.renderer = renderer; // null = headless (test) — chỉ không gọi render()
    this.world = null;
    this.systems = {
      production: new ProductionSystem(),
      floatingLog: new FloatingLogSystem(),
      beaver: new BeaverSystem(),
      winLose: new WinLoseSystem(),
    };
  }

  // Loader: loadLevel(index) đọc levels[index] (mặc định 0), init model từ data (§D8 v2.1).
  loadLevel(index = 0) {
    const data = levels[index] ?? levels[0];
    const grid = new Grid(data.grid);

    this.world = {
      levelIndex: index,
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
      pendingCommand: null,
      greenCells: [],
      greenCellKeys: new Set(),
      effects: [],        // [{type:'glow', col, row, t}] — pulse slot-fill
      feedback: null,     // {kind:'busy'|'reject', x, y, t} — hệ screen (UI layer vẽ)
      beaverDrowned: false, // cờ LOSE v2.1 — placeholder, trigger thật ở M4
      time: 0,            // đồng hồ logic (anim frame render đọc)
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

  fixedUpdate(dt) {
    if (!this.sm.is(State.PLAYING)) return;
    const world = this.world;
    world.time += dt;

    // Thứ tự §A2.2: khai thác -> gỗ nổi trôi/neo -> (obstacle M4) -> hải ly -> (nước M3) -> thắng/thua
    this.systems.production.update(this, dt);
    this.systems.floatingLog.update(this, dt);
    this.systems.beaver.update(this, dt);
    this.systems.winLose.update(this, dt);

    // Tick hiệu ứng/feedback (render chỉ đọc)
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

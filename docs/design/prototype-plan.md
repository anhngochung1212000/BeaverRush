# BEAVERRUSH — Prototype Plan (HTML5, v2.1)

> **Changelog v2.1 (2026-07-03) — V3.1 PATCH (neo = block hoàn chỉnh · relocate mọi block · ô ảo · LOSE rơi nước):** amend v2.0 — chỗ nào mâu thuẫn, v2.1 THẮNG. (1) **Gỗ neo = BLOCK HOÀN CHỈNH:** `FloatingLog` chỉ còn trạng thái DRIFTING; bị chặn → NEO vào ô trống cuối cùng trước vật chặn và **CONVERT thành `Block` bình thường** (chiếm occupancy, hải ly đi lên được, nhặt được, chặn obstacle) — bỏ hẳn trạng thái ANCHORED. (2) **AUTO SLOT-FILL:** gỗ neo TRÚNG ô blueprint slot → TỰ ĐỘNG lấp slot (+1 tiến độ, glow xanh, KHÔNG cần hải ly); blueprint có thể tự hoàn thành một phần nhờ may mắn random lane — vai trò hải ly = SẮP XẾP LẠI block neo lệch chỗ. (3) **RELOCATE MỌI BLOCK** (sửa v2.0 điểm 6 — "block đặt rồi là cố định" SAI, xóa): FETCH = tap BẤT KỲ block trên grid/ô ảo (gỗ neo, block tặng, block đang lấp slot — nhặt lên thì `slot.filled=false`, X−1), TRỪ block hải ly đang đứng lên; KHÔNG BAO GIỜ recall về kho — chỉ relocate (nhặt → ô xanh → đặt). Hệ quả: counterplay bom nước "nhặt block mở lane" HOẠT ĐỘNG TRỞ LẠI (⏳ M4+). (4) **Ô ẢO (virtual rows, row âm):** lane kín tới row 0 → gỗ mới neo TIẾP lên row −1, −2, … không giới hạn (vùng sông trên đập): đi được / nhặt được / chặn obstacle, KHÔNG BAO GIỜ tính tiến độ; đá va block mặt trước = row NHỎ NHẤT (kể cả âm) → block ô ảo bị va TRƯỚC = lá chắn hy sinh tự nhiên; gỗ thả CHỈ mất khi lane HOÀN TOÀN hở. Ô xanh (đặt chủ động) CHỈ trong grid rows 0..N−1. (5) **Gỗ đang TRÔI không tap được** — chỉ block đã tồn tại trên grid/ô ảo mới click-nhặt được. (6) **Kho:** KHÔNG giới hạn max; `startingStock` = data per-level, DEFAULT **3** (JSON 2 level đổi 6/8 → 3, tunable). (7) **Camera:** kéo tự do trong limit, KHÔNG auto-return, KHÔNG nút recenter. (8) **LOSE MỚI — hải ly rơi nước:** đá phá block hải ly ĐANG ĐỨNG → hải ly rơi xuống nước → **THUA NGAY** (bỏ rule tạm "miễn phá" v2.0). (9) **DAMAGE SYSTEM (⏳ định hướng M4):** obstacle loại phá hủy có chỉ số DAMAGE — đá phá xuyên bao nhiêu block/gỗ trên đường tùy damage (stack ô ảo tiêu hao damage trước khi tới đập); số liệu tuning để sau.

> **Changelog v2.0 (2026-07-03) — CONTROL REDESIGN (thay toàn bộ scheme kéo-thả):** (1) **camera pan ngang** — world rộng hơn canvas (sông giữa, 2 khu rừng ngoài mép màn), drag trên nền = pan có limit, tap lên đối tượng = lệnh; (2) **khu khai thác gỗ rừng TRÁI** — nhóm thợ tự sản xuất **1 block gỗ / 30 giây** vào kho, kho = **bộ đếm trên UI button** (rừng phải: visual, khu khai thác 2 để giai đoạn sau); (3) **thả gỗ** — tap nút kho → spawn `FloatingLog` ở **lane ngẫu nhiên** trôi xuống: bị block chặn → **nổi tại chỗ chờ nhặt**, lane hở → **trôi mất** (rủi ro có chủ đích); (4) **nhặt & đặt thay kéo-thả** — tap log nổi → lệnh FETCH (hải ly bò tới nhặt, carry 1 khúc); khi carry → highlight **ô xanh** = ô trống kề mạng block đi tới được, tap ô xanh → lệnh PLACE; (5) **hải ly CHỈ đi trên block** (mạng kề 4 hướng, BFS path) — mạng chia cắt → kẹt island (chiều sâu chiến thuật); (6) **BỎ thu hồi block** — block đặt rồi là cố định, chỉ obstacle phá được (hệ quả: cách xử lý bom nước "dỡ block" không còn khả thi ⏳ thiết kế lại sau); (7) **khúc gỗ trôi (obstacle) bị chặn → cũng NỔI CHỜ NHẶT** (bỏ luật "+1 bó vào kho ngay" — thống nhất 1 cơ chế collect); (8) dùng anim beaver CÓ SẴN trong `assets/sprites/Beaver/` (crawl v2 5 frame + idle breath 4 frame).

> **Changelog v1.2 (2026-07-02):** (1) luật grid rows = **(row blueprint lớn nhất + 1) + 1 row dư** → level 0 "Thẳng" `rows` 4→**2**, level 1 "Chữ U" giữ **4** (row 3 = row dư); (2) **starter blocks** — block 1x1 tặng sẵn đầu màn, data-driven qua field `starterBlocks` trong LevelData (mặc định 2 block ở cột 2&3 của row dư), là tường tạm off-blueprint; kéo sớm blocks render layer tối thiểu vào **M1.5** để vẽ chúng.

> **Changelog v1.1 (2026-07-02):** vá theo vòng adversarial review — prototype chỉ block 1x1; cost phẳng 1 bó/khối; luật "block mặt trước"; semantics `tSec`/telegraph/`spawnY`; `speedPx`; occupancy map; JSON 2 level. *(Các mục về 2 kho 2 bên + drag đã bị v2.0 thay thế.)*

> **Game:** BeaverRush — puzzle/action 2D **màn hình dọc (portrait)**, một chú **hải ly builder** đi lại **trên chính các block đã đặt** để nhặt & sắp xếp lại các block gỗ (relocate) và xây đập theo blueprint, trong khi dòng sông thả obstacle và mực nước dâng lên làm đồng hồ thua. Điều khiển thuần **tap/click**; **drag để pan camera** xem 2 khu rừng ngoài mép màn.
>
> **Tech:** HTML5 + Canvas, **vanilla JS + ES modules**, KHÔNG build step / framework — chạy được bằng cách mở `index.html` hoặc một static server nhỏ. Kiến trúc tách lớp **DATA / LOGIC / RENDER** để **port sang Unity C#** sau này.
>
> **Scope prototype (STRICT):** chỉ core loop + **2 obstacle** (ĐÁ LỚN, KHÚC GỖ TRÔI) + **CHỈ block 1x1** (các size 1x2/2x1/2x2 **để giai đoạn sau**). Visual **graybox** (rect màu + label) làm placeholder; anim beaver crawl/idle dùng sprite **có sẵn**; art còn lại **do người dùng cấp sau** qua asset-swap layer. Đã loại: bom nước, xoáy nước, mọi tool (búa/khiên/đóng băng/hoàn tác), ném đá, skill, economy, skin, upgrade, **recall block về kho (v2.1: mọi block vẫn nhặt-RELOCATE được trên grid — chỉ không quay về kho)**.

---

## Nguyên tắc prototype

1. **Tách 3 lớp:** `model/` (data thuần, không đụng canvas) · `systems/` (logic tick) · `render/` (chỉ đọc model). Render không ghi vào model, model không gọi canvas → port Unity dễ.
2. **Data-driven:** mọi tham số màn (blueprint, khai thác gỗ, camera, nước, lịch spawn obstacle) nằm trong file config JSON, không hard-code trong logic.
3. **Fixed logic units:** canvas nội bộ cố định **1080×1920** (portrait), scale-to-fit; **world rộng hơn canvas theo chiều ngang** (camera pan §A6); fixed timestep cho logic (deterministic, dễ port).
4. **Một điểm swap art duy nhất:** tất cả vẽ qua `drawSprite()`; chưa có ảnh → fallback graybox rect + label. Thay art = đổ file + khai báo manifest, KHÔNG sửa logic.
5. **Mỗi milestone chạy được trong trình duyệt** và xây trên milestone trước.
6. **Chỉ đúng scope:** không thêm obstacle/tool/skill ngoài 2 obstacle đã chốt; không thêm size block ngoài 1x1.

**Naming data-model chuẩn (dùng thống nhất toàn tài liệu — Architecture / Milestones / Tuning):**
`Grid` (có `cells` occupancy map), `Lane`, `BlueprintSlot`, `Block`, `Beaver` (`speedPx`, `path`), `WoodStock` (**1 instance — kho khai thác rừng trái**), `FloatingLog` (khúc gỗ đang trôi; neo → convert thành `Block`), `Camera`, `WaterLevel`, `Obstacle`, `Command` (`FETCH` / `PLACE`). Level config = `LevelData` (module `config/levels.js`, mảng `levels`).

---

# PHẦN A — KIẾN TRÚC & DATA MODEL

> Phạm vi: **prototype** BeaverRush (portrait, HTML5 Canvas, **vanilla JS + ES modules**, không build step). Chỉ gồm core loop + 2 obstacle (ĐÁ LỚN, KHÚC GỖ TRÔI) + block 1x1. Cấu trúc phải dễ port sang Unity C# sau này (tách biệt DATA / LOGIC / RENDER).

## A1. Cấu trúc thư mục / file

Chạy được bằng cách mở `index.html` hoặc một static server nhỏ. Tất cả JS là **ES modules** (`<script type="module">`), không bundler.

```
BeaverRush/
├─ index.html                 # canvas duy nhất + <script type="module" src="src/main.js">
├─ .claude/
│  └─ launch.json             # cấu hình static server cho preview
├─ assets/
│  ├─ manifest.js             # map key -> đường dẫn ảnh / mảng frame (thiếu key = graybox)
│  ├─ sprites/
│  │  └─ Beaver/              # ĐÃ CÓ SẴN: beaver_crawl_v2_1..5.png, beaver_idle_breath_1..4.png
│  └─ audio/                  # (để trống ở prototype)
└─ src/
   ├─ main.js                 # entry: khởi tạo canvas, load asset, tạo Game, chạy loop
   ├─ core/
   │  ├─ Game.js              # class Game: giữ state machine + world + update/render dispatch
   │  ├─ GameLoop.js          # requestAnimationFrame + fixed timestep accumulator
   │  ├─ StateMachine.js      # LOADING/PLAYING/WIN/LOSE/PAUSED
   │  └─ constants.js         # LANES=5, CELL sizes, TAP_THRESHOLD_PX=10, hằng số tuning
   ├─ config/
   │  └─ levels.js            # LevelData: mảng levels[] (blueprint + tham số màn)
   ├─ model/                  # DATA THUẦN — không đụng canvas, dễ port Unity
   │  ├─ Grid.js              # Grid + occupancy map cells[col][row] + coordinate mapping
   │  │                       #   + helper mạng đi được: BFS block kề 4 hướng (reachable/island/path)
   │  │                       #   + Ô ẢO row âm (virtualCells Map "col,row") cho gỗ neo — v2.1 §A5
   │  ├─ Blueprint.js         # danh sách BlueprintSlot + hàm đếm tiến độ
   │  ├─ Block.js             # khối gỗ trên grid/ô ảo — v2.1: nhặt-relocate được, KHÔNG recall về kho
   │  ├─ Beaver.js            # hải ly builder + FSM nội bộ + path trên mạng block
   │  ├─ WoodStock.js         # kho gỗ khai thác (1 instance — rừng TRÁI) + sản xuất theo thời gian
   │  ├─ FloatingLog.js       # khúc gỗ ĐANG TRÔI (chỉ DRIFTING — v2.1); neo → convert thành Block (§A4.1)
   │  ├─ Camera.js            # camera.x + clamp pan ngang
   │  ├─ WaterLevel.js        # đồng hồ thua
   │  ├─ Obstacle.js          # ROCK / LOG
   │  └─ Command.js           # pendingCommand (FETCH / PLACE)
   ├─ systems/                # LOGIC cập nhật theo tick (đọc/ghi model)
   │  ├─ ProductionSystem.js  # mining camp trái: +1 block gỗ vào kho mỗi intervalSec (30s)
   │  ├─ FloatingLogSystem.js # thả gỗ, trôi; bị chặn → neo = convert Block (auto slot-fill); lane hoàn toàn hở → mất
   │  ├─ ObstacleSystem.js    # spawn + di chuyển + va chạm obstacle
   │  ├─ BeaverSystem.js      # tiêu thụ command FETCH/PLACE, đi path BFS trên mạng block, nhặt/đặt
   │  ├─ WaterSystem.js       # nâng mực nước, check LOSE
   │  └─ WinLoseSystem.js     # blueprint đầy -> WIN; LOSE: nước đầy HOẶC hải ly rơi nước (v2.1)
   ├─ input/
   │  └─ InputController.js    # pointer/touch: phân biệt TAP vs DRAG theo ngưỡng ~10px;
   │                           #   DRAG trên nền = pan camera; TAP nút kho = thả gỗ,
   │                           #   TAP block bất kỳ = FETCH (nhặt-relocate), TAP ô xanh = PLACE
   └─ render/                 # RENDER — chỉ đọc model, vẽ theo layer
      ├─ Renderer.js          # world layers qua ctx.translate(-camera.x,0); UI layers cố định
      ├─ AssetStore.js        # load ảnh theo manifest, trạng thái loaded
      ├─ drawSprite.js        # drawSprite(ctx,key,x,y,w,h) -> fallback graybox rect
      └─ layers/              # background, forests+miningcamp, lanes, blueprint, greencells,
                              # blocks, floatinglogs, obstacles, beaver, ui
```

Nguyên tắc port Unity: `model/` = plain classes (MonoBehaviour-free) → map thẳng sang C# struct/class; `systems/` = logic thuần → MonoBehaviour/System; `render/` = thay bằng SpriteRenderer/Prefab. Không cho render ghi vào model, không cho model gọi canvas.

## A2. Game loop + State machine

### A2.1 State machine

```
LOADING → PLAYING → (WIN | LOSE)
              ⇅
           PAUSED
```

| State | Vào khi | Update chạy gì | Render |
|---|---|---|---|
| `LOADING` | Khởi động | Chờ AssetStore load xong | Splash |
| `PLAYING` | Load xong / Resume | Tất cả system (production, floatingLog, obstacle, beaver, water, win/lose). **Pan camera KHÔNG pause game** — game vẫn chạy khi người chơi kéo xem 2 bên. | Full world |
| `PAUSED` | Người chơi tạm dừng | KHÔNG update system (thời gian đóng băng) | World mờ + nút Resume |
| `WIN` | Blueprint đầy | Chỉ animation ăn mừng; water dừng; **obstacle + telegraph đang hiển thị bị xóa ngay** (không còn va chạm sau WIN) | Overlay THẮNG |
| `LOSE` | Water đầy **HOẶC hải ly rơi xuống nước** (đá phá block đang đứng — v2.1 §A8.1) | Freeze world | Overlay THUA |

```js
// StateMachine.js
export const State = { LOADING:'LOADING', PLAYING:'PLAYING', WIN:'WIN', LOSE:'LOSE', PAUSED:'PAUSED' };
class StateMachine {
  constructor(initial){ this.state = initial; this.prev = null; }
  set(next){ this.prev = this.state; this.state = next; }
  is(s){ return this.state === s; }
}
```

### A2.2 Loop — requestAnimationFrame + fixed timestep cho logic

Logic chạy **fixed dt** (ví dụ `FIXED_DT = 1/60`) để deterministic & dễ port; render dùng thời gian thực (có thể nội suy sau).

```js
// GameLoop.js
const FIXED_DT = 1 / 60;          // giây
const MAX_ACCUM = 0.25;           // chống spiral of death
let accumulator = 0, lastTime = 0;

function frame(now){
  const t = now / 1000;
  let frameTime = t - lastTime; lastTime = t;
  if (frameTime > MAX_ACCUM) frameTime = MAX_ACCUM;
  accumulator += frameTime;

  while (accumulator >= FIXED_DT) {
    game.fixedUpdate(FIXED_DT);   // chỉ chạy khi state === PLAYING
    accumulator -= FIXED_DT;
  }
  game.render();                  // luôn render (kể cả PAUSED/WIN/LOSE)
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```

`game.fixedUpdate(dt)` chỉ gọi chuỗi system khi `sm.is(PLAYING)`:
```
ProductionSystem → FloatingLogSystem → ObstacleSystem → BeaverSystem → WaterSystem → WinLoseSystem
```
(Thứ tự: khai thác gỗ trước → gỗ nổi trôi/neo → obstacle di chuyển & va chạm → hải ly hành động → nước dâng → cuối cùng check thắng/thua.)

> **Ghi chú (từ M2):** `WinLoseSystem` tồn tại và chạy được **độc lập** từ M2, khi `WaterSystem`/`ObstacleSystem` CHƯA có — các system chưa tồn tại chỉ đơn giản không nằm trong chuỗi gọi (stub an toàn). WinLoseSystem chỉ đọc `Blueprint` (check đầy → WIN), `WaterLevel` nếu có (check đầy → LOSE) và cờ `beaverDrowned` (v2.1 — hải ly rơi nước → LOSE ngay; trigger thật chỉ có từ M4 khi đá phá block đang đứng).

## A3. Core data model (pseudocode / interface)

Dùng JS class; kiểu ghi dạng chú thích để tiện chuyển C#.

```js
// Grid.js — 5 lane (cột) x N hàng + occupancy map + mạng đi được
class Grid {
  cols = 5;                 // = số lane
  rows;                     // N theo màn
  cellW; cellH;             // px, tính từ vùng đập
  originX; originY;         // góc trái-trên vùng grid — hệ SÔNG (river-local, xem §A5/§A6)
  cells;                    // OCCUPANCY MAP (rows 0..rows-1): cells[col][row] = blockId | null
                            // ghi khi đặt/neo block, xóa khi block bị phá HOẶC bị nhặt (relocate — v2.1)
  virtualCells;             // 🆕 v2.1 Ô ẢO row âm: Map key "col,row" (row < 0, không giới hạn) -> blockId
                            // chỉ hình thành từ gỗ neo tự nhiên (§A4.1), không đặt chủ động (§A5)
  // cell coord: {col:0..4, row:0..rows-1}; ô ảo: row < 0
  // Helper mạng đi được (hải ly CHỈ đi trên block, kề 4 hướng):
  //   reachableBlocks(fromCell) -> Set<cell>   // BFS qua block kề 4 hướng = ISLAND hiện tại
  //   bfsPath(fromCell, toCell) -> [cell,...]  // đường đi từng ô block; null nếu khác island
  //   (mạng bao gồm cả block ở ô ảo row âm — walkable/pickable, BFS xuyên biên row 0 ↔ −1)
}

// Lane = một cột dọc của grid (obstacle & gỗ nổi trôi theo lane)
class Lane { index; /*0..4*/ centerX; /*px, hệ sông*/ }

// BlueprintSlot — ô ghost cần xây (prototype: TOÀN slot 1x1)
class BlueprintSlot {
  col; row;                 // ô neo (prototype 1x1: chính là ô slot)
  size;                     // prototype LUÔN là '1x1' ('1x2'|'2x1'|'2x2' để giai đoạn sau)
  filled = false;           // đã có block ĐÚNG lấp chưa
}

// Block — khối gỗ trên grid hoặc ô ảo (đặt tay, gỗ neo tự nhiên, hoặc starter block).
// v2.1: KHÔNG cố định — MỌI block nhặt-relocate được (trừ block hải ly đang đứng §A4.2);
// KHÔNG BAO GIỜ recall về kho.
class Block {
  id;                       // uid
  size;                     // prototype LUÔN '1x1'
  col; row;                 // ô neo; row < 0 = Ô ẢO (v2.1 §A5 — không bao giờ onBlueprint)
  onBlueprint = false;      // trùng slot blueprint (luật khớp §A4.3; hoặc AUTO SLOT-FILL khi neo trúng slot §A4.1)
  alive = true;             // false khi bị đá văng HOẶC bị nhặt lên (relocate)
}

// Beaver — 1 builder duy nhất, có FSM nội bộ. CHỈ đứng/đi trên block (mạng kề 4 hướng).
class Beaver {
  cell = {col, row};        // ô block đang đứng (luôn là block sống)
  pos = {x, y};             // px hiện tại (hệ sông; nội suy khi đi path)
  state = 'IDLE';           // IDLE | CRAWLING | PICKING | BUILDING
  path = null;              // [cell,...] — đường BFS còn lại phải đi (CRAWLING)
  command = null;           // command đang thực thi (FETCH/PLACE)
  carrying = null;          // 'log' | null — đang vác 1 khúc gỗ (1 khúc/lần, không hàng đợi)
  speedPx;                  // px/giây — travel time = tổng quãng đường path (px) / speedPx
}

// WoodStock — kho gỗ khai thác. v2.0: CHỈ 1 INSTANCE (khu khai thác rừng TRÁI).
// Rừng phải: visual thuần, khu khai thác thứ 2 để giai đoạn sau (LevelData.wood.right = null).
class WoodStock {
  count;                    // số block gỗ trong kho; loader init count = startingStock; KHÔNG giới hạn max (v2.1)
  startingStock;            // từ LevelData.wood.left.startingStock (DEFAULT 3 — v2.1, data per-level, tunable)
  intervalSec;              // 30s ra 1 block (từ LevelData.wood.left.intervalSec, tunable)
  timer = 0;                // dồn dt, đạt interval -> count++
}
// UI: kho hiển thị = 1 NÚT (button) cố định trên màn + số đếm; tap nút = thả gỗ (§A4)

// FloatingLog — khúc gỗ ĐANG TRÔI trên sông (từ kho thả xuống, hoặc từ M4: log obstacle bị chặn).
// v2.1: CHỈ còn DRIFTING — khi bị chặn thì NEO = CONVERT thành Block bình thường (§A4.1),
// FloatingLog biến mất. Gỗ đang trôi KHÔNG tap được.
class FloatingLog {
  id;                       // uid
  lane;                     // 0..4 (thả từ kho: random)
  y;                        // px (hệ sông), spawn tại spawnY rồi trôi xuống
  speedPx;                  // px/giây khi DRIFTING
  alive = true;             // false khi trôi lọt xuống thác (mất) HOẶC đã neo (convert thành Block)
}

// Camera — pan ngang, chỉ để XEM (không đổi logic thế giới)
class Camera {
  x = 0;                    // world px, clamp [0, worldW - 1080]
  // worldW = 1080 + 2*forestW (LevelData.camera.forestW)
}

// WaterLevel — đồng hồ thua
class WaterLevel {
  current = 0;              // 0..max
  max;                      // ngưỡng thua
  riseRatePerSec;           // dâng đều = max / waterSecondsToFull (linear là luật code, không config)
  // current += riseRatePerSec * dt ; nếu current >= max -> LOSE
}

// Obstacle — chỉ 2 loại ở prototype
class Obstacle {
  type;                     // 'ROCK' | 'LOG'
  lane;                     // 0..4
  y;                        // px (top->down, tăng dần); spawn tại spawnY = -cellH
  speed;                    // px/giây
  alive = true;
}
```

## A4. Command model (tap = ra lệnh, KHÔNG hàng đợi) — 🆕 v2.0

**Thay toàn bộ scheme kéo-thả v1.x.** Input tách bạch: **DRAG trên nền = pan camera** (§A6); **TAP/CLICK lên đối tượng = lệnh**. Chỉ tồn tại **tối đa 1 command** tại một thời điểm; hải ly phải xong lệnh hiện tại mới nhận lệnh mới (UI báo "đang bận"). **KHÔNG còn `sourceSide`, KHÔNG còn recall block về kho** — 🆕 v2.1: block KHÔNG cố định, **MỌI block trên grid/ô ảo đều nhặt-RELOCATE được** (FETCH bất kỳ block → carry → PLACE chỗ khác), trừ block hải ly đang đứng lên.

```js
// Command.js
class Command {
  kind;        // 'FETCH' | 'PLACE'
  blockId;     // với FETCH: id Block cần nhặt (BẤT KỲ block nào trên grid/ô ảo — v2.1)
  targetCell;  // với PLACE: {col,row} — ô xanh đích để đặt block
}
```

### A4.1 Thả gỗ (tap nút kho — KHÔNG phải command của hải ly)

- Kho = **1 nút UI cố định** (icon gỗ + bộ đếm `count`, KHÔNG giới hạn max). Tap nút khi `count > 0` (không phụ thuộc trạng thái hải ly):
  1. `stock.count -= 1` (chi phí trừ **tại thời điểm thả** — không có bước trừ nào khác khi đặt).
  2. Spawn `FloatingLog{ lane: randInt(0..4), y: spawnY, speedPx: floatingLog.speedPx }` trôi từ trên xuống. **Gỗ đang trôi KHÔNG tap được** (v2.1 — chỉ block đã tồn tại trên grid/ô ảo mới click-nhặt được).
- `FloatingLogSystem` mỗi tick với log DRIFTING: `y += speedPx*dt`; xét lane của log:
  - **Có vật chặn** (block mặt trước §A8 — kể cả block ô ảo) → khi chạm mép trên vật chặn: **NEO = CONVERT thành `Block` bình thường** tại ô trống cuối cùng ngay THƯỢNG LƯU vật chặn (`{col: lane, row: frontRow - 1}`), FloatingLog biến mất. Block neo là **BLOCK HOÀN CHỈNH**: chiếm occupancy, hải ly đi lên được, nhặt-relocate được, chặn obstacle. Nhiều gỗ cùng lane neo chồng dần lên thượng lưu.
    - **🆕 AUTO SLOT-FILL:** ô neo TRÚNG một ô blueprint slot → `block.onBlueprint = true`, `slot.filled = true`, **+1 tiến độ, glow xanh — KHÔNG cần hải ly**. Blueprint có thể tự hoàn thành một phần nhờ may mắn random lane; vai trò hải ly = SẮP XẾP LẠI các block neo lệch chỗ (FETCH-relocate §A4.2).
    - **🆕 Ô ẢO (virtual rows):** lane đã kín tới row 0 → gỗ mới neo TIẾP lên các ô ảo `row −1, −2, …` (vùng sông trên đập, không giới hạn — §A5). Block ô ảo đi được / nhặt được / chặn obstacle nhưng **KHÔNG BAO GIỜ tính tiến độ** (ngoài blueprint). → lane có ít nhất 1 vật chặn thì gỗ thả **KHÔNG BAO GIỜ mất**.
  - **Lane HOÀN TOÀN hở** (không block nào, kể cả ô ảo) → trôi lọt qua đáy grid xuống thác: `alive = false`, **gỗ MẤT**. Đây là rủi ro có chủ đích DUY NHẤT khi thả: nên chặn nhiều lane trước.
- Block đã neo là **block TĨNH** như mọi block khác: vật chặn phía dưới bị đá phá → block neo **KHÔNG trôi lại** (đứng yên trên grid/ô ảo; muốn dời thì nhặt-relocate).

### A4.2 FETCH — tap BẤT KỲ block → hải ly đi nhặt (relocate) — 🆕 v2.1

**MỌI block trên grid/ô ảo đều nhặt được** (gỗ neo, block tặng starter, block đang lấp slot, tường tạm), **TRỪ block hải ly đang đứng lên**. Gỗ đang DRIFTING không tap được. Điều kiện tạo lệnh (check ngay khi tap, không hợp lệ → từ chối + flash đỏ, hải ly không di chuyển):
- `beaver.state === IDLE` và `beaver.carrying === null`;
- block tồn tại (`alive`) và KHÔNG phải block hải ly đang đứng (`block.cell !== beaver.cell`);
- block nằm trong **island** của hải ly (BFS từ `beaver.cell` qua mạng block kề 4 hướng — gồm cả ô ảo). Block ở island khác → từ chối.

Thực thi: `BeaverSystem` tính `path = grid.bfsPath(beaver.cell, blockKềTarget)` (block kề-4-hướng với block target, path ngắn nhất) → `CRAWLING` đi từng ô block theo path (`speedPx` px/giây trên tổng quãng path) → tới nơi → `PICKING` trong `pickupSec` (0.4s) → **block biến mất khỏi grid**: `block.alive = false`, xóa occupancy (`cells` hoặc `virtualCells`); **nếu block đang lấp slot** (`onBlueprint && slot.filled`) → `slot.filled = false`, **X giảm 1**; `beaver.carrying='log'`, về `IDLE` (đứng vác gỗ chờ lệnh PLACE). **KHÔNG BAO GIỜ recall về kho** — nhặt lên chỉ để đặt lại chỗ khác (hoặc cầm trên tay).

### A4.3 GREEN CELLS + PLACE — tap ô xanh → hải ly đi đặt

Khi `beaver.carrying !== null`, render highlight **Ô XANH**:

```
reachable = grid.reachableBlocks(beaver.cell)          // BFS island hiện tại
greenCells = { ô c : c TRỐNG (không block) && c TRONG GRID rows 0..N-1
               // 🆕 v2.1: KHÔNG BAO GIỜ là ô ảo row âm — không đặt chủ động lên vùng ô ảo
               && c kề-4-hướng với >= 1 block ∈ reachable (reachable gồm cả block ô ảo) }
```

- Tap 1 ô xanh → `Command{PLACE, targetCell}` (chỉ khi IDLE + carrying; ô ngoài greenCells → từ chối, flash đỏ).
- Thực thi: path BFS tới **block kề ô đích** (chọn block kề có path ngắn nhất) → `CRAWLING` → tới nơi → `BUILDING` trong `buildSec` (0.4s) → spawn Block 1x1 tại `targetCell`, ghi `grid.cells[col][row] = block.id`, `beaver.carrying = null`, về `IDLE`.
- **Luật khớp blueprint (1x1):** `targetCell == ô slot` → `slot.filled = true`, **glow xanh, +1 tiến độ**; không trùng slot nào → block **tường tạm** (nâu, không tính tiến độ) — đồng thời **MỞ RỘNG mạng đi được** (ô xanh lan theo). *(Ghi chú size lớn giai đoạn sau: đặt vào bất kỳ ô footprint slot → snap về ô neo.)*
- 🆕 v2.1: block đặt xong **KHÔNG cố định** — vẫn nhặt-relocate được như mọi block (§A4.2); chỉ KHÔNG recall về kho / không refund.

### A4.4 Edge cases (luật chung)

- **Đích biến mất / bị chiếm giữa chừng** (block target FETCH bị đá phá; ô đích PLACE bị gỗ neo convert-Block chiếm mất...): **hủy lệnh, hải ly về IDLE tại ô đang đứng** — **GIỮ `carrying`** nếu đang vác.
- **Block trên path bị đá phá giữa chừng:** re-path BFS từ ô hiện tại; không còn đường → hủy lệnh về IDLE (giữ carrying).
- **Island:** BFS chỉ chạy trong island chứa hải ly. Mạng bị chia cắt (đá phá block giữa) → hải ly kẹt trên island đang đứng, chỉ nhặt/đặt trong island đó — **chấp nhận, là chiều sâu chiến thuật** (đặt tường tạm lan dần để nối lại mạng; block đặt kề block island khác → 2 mạng tự hợp nhất theo luật kề 4 hướng).
- **Hết gỗ trong kho** (`count == 0`): nút kho disable/mờ — KHÔNG phải thua, chờ khai thác.

```js
// BeaverSystem.update(dt) — v2.1
if (beaver.state === IDLE && pendingCommand) {
  beaver.command = pendingCommand; pendingCommand = null;
  beaver.path = grid.bfsPath(beaver.cell, adjacentBlockOf(beaver.command));
  beaver.state = CRAWLING;
}
switch (beaver.state) {
  case CRAWLING: validate mỗi tick (mục tiêu còn sống? path còn nguyên? -> re-path / hủy về IDLE, giữ carrying);
                 đi từng ô theo path, speedPx px/giây;
                 if (arrived) beaver.state = (command.kind==='FETCH') ? PICKING : BUILDING; break;
  case PICKING:  sau pickupSec (0.4s) -> block.alive=false, xóa occupancy (cells/virtualCells);
                 nếu block đang lấp slot -> slot.filled=false (X giảm 1 tiến độ);
                 beaver.carrying='log', state=IDLE; break;
  case BUILDING: sau buildSec (0.4s) -> spawn Block 1x1 tại targetCell, ghi grid.cells,
                 slot.filled=true nếu targetCell == ô slot (glow xanh +1 tiến độ),
                 beaver.carrying=null, state=IDLE; break;
}
```

> **Render mapping khi vác gỗ:** FSM KHÔNG có state CARRYING riêng. Layer beaver chọn sprite theo cặp `(state, carrying)`: `CRAWLING + carrying!=null` → crawl anim + vẽ `block_carried` đè lên lưng; `IDLE + carrying!=null` → idle anim + block trên lưng. Đây là việc của render, model không đổi. Anim nguồn: sprite CÓ SẴN §C1.

## A5. Ánh xạ tọa độ (screen ↔ world ↔ grid)

Canvas nội bộ cố định **1080×1920** (portrait), scale-to-fit bằng CSS transform / letterbox; mọi tính toán dùng hệ px nội bộ. **v2.0 có 3 hệ:**

- **Hệ SÔNG (river-local, 0..1080):** mọi toạ độ trong `LevelData` (`originX`, tâm lane, `spawnY`...) giữ nguyên như v1.x, tính theo vùng sông rộng 1080.
- **Hệ WORLD (0..worldW):** `worldW = 1080 + 2*forestW`. Rừng trái chiếm `x ∈ [0, forestW)`, sông `x ∈ [forestW, forestW+1080)`, rừng phải phần còn lại. Đổi hệ: `worldX = riverX + forestW`.
- **Hệ SCREEN (0..1080):** `screenX = worldX - camera.x` (render); `worldX = screenX + camera.x` (input tap).

Cụ thể:
- **Lane width:** `cellW = gridPixelWidth / 5`. 5 lane chia đều bề ngang vùng đập.
- **Cell → river px (góc trái-trên ô):** `x = originX + col*cellW`, `y = originY + row*cellH`.
- **Screen tap → cell:** `riverX = screenX + camera.x - forestW`, rồi
  ```
  col = clamp( floor((riverX - originX)/cellW), 0, 4 )
  row = clamp( floor((py  - originY)/cellH), 0, rows-1 )
  ```
  *(v2.1: clamp row chỉ áp dụng cho ô xanh/PLACE; hit-test FETCH block Ô ẢO dùng floor thô cho row < 0 rồi tra `virtualCells`.)*
- **🆕 v2.1 — Ô ẢO (virtual rows, row âm):** lane kín tới row 0 → gỗ neo TIẾP lên các ô ảo `row = −1, −2, …` (vùng sông phía trên đỉnh grid, KHÔNG giới hạn). Ô ảo **chỉ hình thành từ gỗ neo tự nhiên** (§A4.1) — hải ly KHÔNG đặt chủ động lên đó (ô xanh chỉ trong grid rows 0..N−1). **Cấu trúc đề xuất:** giữ mảng `cells[col][row]` cho rows 0..N−1; thêm `virtualCells: Map` với key chuỗi `"col,row"` (row < 0) → blockId *(có thể thay bằng mảng có offset, nhưng Map gọn hơn vì không giới hạn độ cao)*. Toạ độ px dùng CHUNG công thức `y = originY + row*cellH` (row âm → y < originY). Block ô ảo: **walkable** (BFS kề-4 xuyên biên row 0 ↔ −1), **pickable** (FETCH §A4.2), **chặn obstacle**; KHÔNG BAO GIỜ `onBlueprint`/tính tiến độ; KHÔNG là đích green cell. Đá va block mặt trước = **row NHỎ NHẤT kể cả âm** → block ô ảo bị va TRƯỚC = lá chắn hy sinh tự nhiên (§A8).
- **Kích thước khối** — prototype **chỉ dùng 1x1** (1 ô = `cellW × cellH`). Bảng size lớn dưới đây là **spec để giai đoạn sau**, không implement ở prototype:
  | size | spanCols | spanRows | giai đoạn |
  |---|---|---|---|
  | 1x1 | 1 | 1 | **prototype** |
  | 1x2 | 1 | 2 | giai đoạn sau |
  | 2x1 | 2 | 1 | giai đoạn sau |
  | 2x2 | 2 | 2 | giai đoạn sau |
  - Ô neo = `{col,row}` góc trái-trên. Khối vẽ rộng `spanCols*cellW`, cao `spanRows*cellH`.
- **Obstacle & FloatingLog theo lane:** luôn ở tâm lane `x = originX + lane*cellW + cellW/2` (hệ sông), chỉ `y` tăng theo `speed*dt`.
- **Path hải ly:** đi tâm-ô → tâm-ô các block liên tiếp trong path; mỗi bước ngang = `cellW` px, dọc = `cellH` px; travel time = tổng px của path / `speedPx`.

## A6. Camera pan ngang — 🆕 v2.0

World **rộng hơn màn hình portrait**: sông ở giữa, 2 khu rừng trái/phải nằm **ngoài mép canvas** — người chơi drag để xem.

- **Kích thước:** `worldW = 1080 + 2*forestW`; `forestW` từ `LevelData.camera.forestW` (~400–500 px, default **450**, tunable). Chiều dọc không pan (world cao đúng 1920).
- **Clamp:** `camera.x ∈ [0, worldW - 1080]` (= `[0, panLimit]`, `panLimit = 2*forestW`). Biên = hết khu rừng. Khởi tạo `camera.x = forestW` → nhìn thẳng vùng sông.
- **Input — phân biệt tap vs drag bằng ngưỡng di chuyển (`TAP_THRESHOLD_PX = 10`, tunable):**
  - `pointerdown` ghi vị trí gốc; di chuyển vượt ngưỡng → chế độ **DRAG**: `camera.x -= dx` (clamp), theo ngón tay; nhả ra KHÔNG phát sinh lệnh.
  - `pointerup` mà chưa vượt ngưỡng → **TAP**: hit-test theo thứ tự **UI cố định trước** (nút kho, pause — hệ screen) rồi tới đối tượng world (block trên grid/ô ảo, ô xanh — đổi qua `worldX = screenX + camera.x`).
- **Chỉ để xem:** pan không pause game, không đổi logic; mọi system chạy bình thường khi đang pan. 🆕 v2.1 chốt: **kéo tự do trong limit, KHÔNG auto-return, KHÔNG nút recenter**.
- **Render:** `ctx.save(); ctx.translate(-camera.x, 0);` vẽ toàn bộ world layers (§A7) theo hệ world; `ctx.restore();` rồi vẽ **UI layers cố định** (không pan).

## A7. Rendering layers + Asset-abstraction

### A7.1 Thứ tự layer (vẽ từ dưới lên)

**World layers (pan theo `camera.x`):**
1. **Background river** — nền sông + mũi tên hướng chảy.
2. **Forests + mining camp** — khu rừng trái (chứa **khu khai thác**: nhóm hải ly thợ anim gặm gỗ → đem vào kho, M2 được phép graybox) + khu rừng phải (visual thuần, khu khai thác 2 để giai đoạn sau).
3. **Lanes** — 5 đường kẻ mờ chia lane.
4. **Blueprint ghost** — các slot bán trong suốt (viền nét đứt), slot `filled` glow xanh.
5. **Green cells** — highlight ô xanh đặt được, CHỈ khi `beaver.carrying != null` (§A4.3).
6. **Dam blocks** — mọi block trên grid VÀ ô ảo row âm (đúng blueprint / auto slot-fill = glow xanh; ngoài blueprint = nâu thường).
7. **Floating logs** — khúc gỗ ĐANG TRÔI (chỉ DRIFTING — v2.1: gỗ đã neo là Block, vẽ ở layer 6).
8. **Obstacles** — đá lớn / khúc gỗ trôi (telegraph icon ở đầu lane).
9. **Beaver** — hải ly builder (sprite theo `(state, carrying)`).

**UI layers (cố định, KHÔNG pan — vẽ sau `ctx.restore()`):**
10. **UI overlay** — thanh mực nước (đồng hồ thua), tiến độ `X/Y`, **NÚT KHO GỖ (icon + bộ đếm — tap để thả gỗ)**, nút pause, overlay WIN/LOSE.

`Renderer.render(state)` gọi lần lượt các hàm layer; layer 7–9 sort theo `y` nếu cần chồng đúng.

### A7.2 Asset-abstraction (swap art sau này)

Mọi thứ vẽ qua `drawSprite` — nếu chưa có ảnh cho `key` thì fallback **graybox rect + label**. Prototype dùng anim beaver **có sẵn** (§C1) + graybox phần còn lại; khi user cấp art chỉ cần đổ file vào `assets/sprites/` và khai báo trong `manifest.js`, KHÔNG sửa logic.

```js
// AssetStore.js
class AssetStore {
  images = new Map();       // key -> HTMLImageElement | HTMLImageElement[] (anim nhiều frame)
  has(key){ return this.images.has(key); }
  async loadFromManifest(manifest){ /* new Image() cho từng entry; bỏ qua lỗi -> graybox */ }
}

// drawSprite.js — điểm swap art DUY NHẤT
const GRAYBOX = { beaver:'#8a5a2b', block:'#a9772f', blockOk:'#3fae5a',
                  rock:'#6b6b6b', log:'#7a5230', slot:'rgba(255,255,255,.15)',
                  green:'rgba(63,174,90,.35)' };
export function drawSprite(ctx, store, key, x, y, w, h, label){
  if (store.has(key)) { ctx.drawImage(store.images.get(key), x, y, w, h); return; }
  ctx.fillStyle = GRAYBOX[key] || '#888';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.strokeRect(x, y, w, h);
  if (label){ ctx.fillStyle='#fff'; ctx.font='24px sans-serif';
              ctx.fillText(label, x+6, y+28); }   // vd 'ROCK','1x1','BEAVER'
}
```

Layer nào cũng chỉ gọi `drawSprite(ctx, store, key, ...)` — art thật thay ở tầng này, model/logic không đổi.

## A8. Collision / interaction cho 2 obstacle (theo cơ chế v2.0)

**ĐỊNH NGHĨA "BLOCK MẶT TRƯỚC" (luật duy nhất, dùng toàn tài liệu):** block mặt trước của một lane = block **CÒN SỐNG** (`alive`) có **row index NHỎ NHẤT** trong lane đó — 🆕 v2.1: **KỂ CẢ row âm (ô ảo)**, tức block ô ảo bị va TRƯỚC block trong grid (lá chắn hy sinh tự nhiên). (Nếu không có ô ảo: row 0 là hàng nước chạm trước; row 0 trống mà row 1 có block → obstacle va vào block row 1, v.v.) Tra bằng occupancy: quét `virtualCells` của lane từ row âm NHỎ NHẤT tăng dần, rồi tới `grid.cells[lane][row]` từ row 0 tăng dần — block sống đầu tiên gặp = front.

Mỗi tick `ObstacleSystem` di chuyển obstacle (`y += speed*dt`) rồi kiểm tra va chạm với block mặt trước của lane obstacle.

**Xác định "va chạm":** obstacle chạm block front trong lane của nó khi mép dưới obstacle `y` vượt qua **mép trên của block front đó** (`originY + frontRow*cellH`) — obstacle trôi xuyên qua các hàng trống phía trên front.

### A8.1 ĐÁ LỚN (`ROCK`) — phá khối

```
Khi ROCK chạm block front của lane (front = row NHỎ NHẤT, kể cả ô ảo row âm):
   - block.alive = false; xóa ô của block khỏi grid.cells / virtualCells   // block bị kéo văng xuống thác, MẤT
   - nếu block.onBlueprint && slot.filled: slot.filled = false   // trừ tiến độ (block ô ảo không bao giờ onBlueprint)
   - nếu block là block hải ly ĐANG ĐỨNG: hải ly rơi xuống nước -> LOSE NGAY (v2.1)
   - obstacle.alive = false                     // rock biến mất sau khi phá (prototype: 1-hit)
Nếu lane HOÀN TOÀN hở (không block sống nào, kể cả ô ảo): rock trôi lọt qua đáy -> obstacle.alive=false (vô hại)
```
**Hệ quả v2.1 khi block bị phá:**
- Block **neo phía trên** block bị phá (kể cả ô ảo) → **đứng yên** — block đã neo là block TĨNH, KHÔNG trôi lại (§A4.1); muốn dời thì nhặt-relocate.
- Mạng đi được có thể **chia cắt thành island** → hải ly kẹt island đang đứng (§A4.4); nếu đang CRAWLING qua path chứa block bị phá → re-path / hủy lệnh.
- **Block hải ly ĐANG ĐỨNG — 🆕 v2.1 THUA NGAY:** đá VẪN phá block hải ly đang đứng → hải ly rơi xuống nước → **LOSE tức thì** (điều kiện thua MỚI của `WinLoseSystem` — bỏ rule tạm "miễn phá" v2.0). Người chơi phải chủ động bảo vệ chỗ đứng (di chuyển trước telegraph / tận dụng stack ô ảo làm lá chắn).
- *(⏳ Định hướng M4 — DAMAGE SYSTEM: obstacle loại phá hủy có chỉ số DAMAGE; đá phá xuyên bao nhiêu block/gỗ trên đường tùy damage — stack block ô ảo tiêu hao damage TRƯỚC khi đá tới đập. Prototype mặc định đá 1-hit; số liệu tuning để sau.)*

*(Giai đoạn sau — khối 2 lane: ROCK trúng bất kỳ 1 lane nào phủ bởi khối → văng NGUYÊN khối. Prototype 1x1 không cần.)*

### A8.2 KHÚC GỖ TRÔI (`LOG`) — v2.1: neo thành Block hoàn chỉnh (bỏ luật "+1 bó vào kho ngay")

```
Khi LOG chạm block front của lane (kể cả block ô ảo):
   - obstacle.alive = false
   - NEO = CONVERT thành Block tại ô ngay thượng lưu vật chặn   // Y HỆT gỗ thả từ kho (§A4.1):
     block hoàn chỉnh; AUTO SLOT-FILL nếu trúng slot; lên ô ảo nếu lane kín
   - block bị chạm KHÔNG hư hại
Nếu lane HOÀN TOÀN hở: log trôi lọt xuống thác -> obstacle.alive=false (mất cơ hội, không phạt)
```

**Thống nhất 1 cơ chế collect duy nhất:** gỗ từ kho thả xuống và gỗ obstacle trôi tự nhiên khi bị chặn đều **NEO thành `Block` hoàn chỉnh** trên grid/ô ảo → tap để FETCH-relocate (§A4.2); trúng slot → tự +1 tiến độ (auto slot-fill §A4.1). Không còn đường "+1 thẳng vào kho".

### A8.3 Ghi chú chung

- Obstacle chỉ tương tác với **block front** (định nghĩa ở đầu §A8) của đúng lane nó đang đi; không xuyên xuống block phía sau.
- Sau va chạm, obstacle `alive=false` → dọn khỏi mảng cuối tick.
- **Spawn & telegraph (semantics chốt):** `ObstacleSystem` đọc `LevelData.obstacles.schedule` (mảng `{tSec, type, lane}`):
  - `tSec` = thời điểm obstacle **BẮT ĐẦU TRÔI** (tính từ lúc level start).
  - **Telegraph** (icon cảnh báo nhấp nháy ở đầu lane) hiện từ `tSec − telegraphLeadSec` đến `tSec`.
  - Obstacle spawn tại `y = spawnY = −cellH` (ngay trên mép màn chơi) đúng lúc `tSec`, rồi trôi xuống.
  - **Schedule chạy 1 lần theo danh sách, KHÔNG loop.** Hết danh sách → lặp lại entry cuối cùng (cùng `type` + `lane`) mỗi `repeatIntervalSec` giây để giữ áp lực tới khi WIN/LOSE.
- **WIN giữa chừng:** vào state WIN → xóa mọi obstacle đang rơi + telegraph đang hiển thị; không xử lý va chạm nào nữa (cosmetic, tránh block văng sau khi đã thắng).
- `LOSE` do WaterLevel đầy **HOẶC hải ly rơi xuống nước** (đá phá block đang đứng §A8.1 — v2.1); **hết gỗ trong kho KHÔNG phải thua** (khai thác tự hồi 30s/block) — chỉ disable nút kho tới khi `count >= 1`.

---

# PHẦN B — MILESTONE & TASK BREAKDOWN

Sáu milestone M0–M5, **mỗi milestone chạy được độc lập trong trình duyệt** và xây trên milestone trước. Mỗi milestone gồm 🎯 Goal, task list có thứ tự, ✅ Definition of Done (DoD), ▶️ cách chạy & tự kiểm tra.

## M0 — Setup

**🎯 Goal:** Bộ khung repo chạy được, canvas portrait scale đúng, có sẵn lớp swap-art (graybox).

**Tasks:**
1. Tạo skeleton thư mục theo §A1; `index.html` với 1 canvas + `<script type="module" src="src/main.js">`.
2. `.claude/launch.json`: cấu hình static server nhỏ để preview.
3. `main.js`: khởi tạo canvas, letterbox scale-to-fit từ hệ nội bộ **1080×1920** ra viewport.
4. Stub `AssetStore` + `drawSprite` (graybox rect + label) — manifest rỗng.
5. `GameLoop` (rAF + fixed timestep) + `StateMachine` (LOADING→PLAYING).

**✅ DoD:** Mở `index.html` (hoặc static server) → thấy canvas portrait căn giữa, letterbox đúng khi resize; loop chạy, `drawSprite` vẽ được 1 graybox test.

**▶️ Run & verify:** Mở trang, resize cửa sổ → canvas giữ tỉ lệ 9:16, không méo; console không lỗi.

## M1 — Board & Blueprint

**🎯 Goal:** Vẽ được bàn chơi tĩnh: grid 5 lane × N (kèm occupancy map rỗng), blueprint ghost toàn slot 1x1, đếm tiến độ `X/Y` theo BLOCK, thanh nước tĩnh.

**Tasks:**
1. `Grid` + occupancy map `cells[col][row]=null` + ánh xạ tọa độ (§A5); vẽ 5 lane kẻ mờ + mũi tên hướng chảy.
2. `config/levels.js`: mảng `levels[]` (2 level §D8); loader `loadLevel(index)` chọn `levels[index]` (mặc định 0), init model từ data.
3. `Blueprint` + `BlueprintSlot`: vẽ ghost slot 1x1 (nét đứt, bán trong suốt).
4. UI: bộ đếm tiến độ `X/Y` (Y = `slots.length`), thanh mực nước (tĩnh, chưa dâng).

**✅ DoD:** Load level 1 → thấy grid 5×N, các ghost slot 1x1 đúng vị trí, `0/Y` hiển thị đúng tổng số slot blueprint. Đổi `loadLevel(1)` → hiện blueprint Chữ U.

**▶️ Run & verify:** Đổi `levels[]` (thêm/bớt slot) → board & `Y` cập nhật theo data, không sửa code logic.

> **M1.5 (v1.2, cập nhật v2.0) — Starter blocks + blocks layer tối thiểu:** đọc `LevelData.starterBlocks`, spawn sẵn Block 1x1 (`onBlueprint=false`, ghi occupancy `grid.cells`) ngay khi load level; kéo sớm **layer Dam blocks** ở mức tối thiểu — vẽ block đã đặt bằng graybox theo spec `block_1x1` (§C3). **v2.0:** starter blocks kiêm **CHỖ ĐỨNG XUẤT PHÁT của hải ly** (M2: beaver spawn đứng trên 1 trong 2 block tặng) và là **mạng đi được khởi đầu** — vì vậy 2 block tặng PHẢI kề nhau. **v2.1:** starter blocks cũng nhặt-relocate được như mọi block (§A4.2) — chỉ không recall về kho.

## M2 — Controls v2.0: camera + khai thác + thả gỗ + nhặt & đặt — 🆕 REWRITE

**🎯 Goal:** Vòng điều khiển v2.1 hoàn chỉnh: pan camera xem 2 rừng; khu khai thác trái tự sản xuất gỗ vào kho; tap kho thả gỗ trôi lane ngẫu nhiên (bị chặn → neo thành Block hoàn chỉnh + auto slot-fill / mất khi lane hoàn toàn hở; lane kín → ô ảo); tap BẤT KỲ block → hải ly bò trên mạng block tới nhặt-relocate; carry → ô xanh → tap đặt block; WIN tức thì khi lấp đủ blueprint.

**Tasks (theo thứ tự):**
1. **Camera pan + input tap/drag** (§A6): `Camera` (`worldW = 1080 + 2*forestW`, clamp `[0, worldW-1080]`, init `= forestW`); `Renderer` tách world layers (translate `-camera.x`) vs UI cố định; `InputController` phân biệt tap/drag theo ngưỡng `TAP_THRESHOLD_PX = 10`; vẽ 2 khu rừng graybox 2 bên ngoài mép màn.
2. **Khu khai thác rừng TRÁI**: `WoodStock` (1 instance) + `ProductionSystem` — `+1` block gỗ mỗi `intervalSec` (**30s**, tunable), init `count = startingStock`; **nút kho UI cố định** (icon + bộ đếm); visual nhóm thợ gặm gỗ trong rừng trái — **graybox được phép ở M2** (anim thợ chi tiết để M3 stretch). Rừng phải: visual thuần.
3. **Thả gỗ + FloatingLog (v2.1)**: tap nút kho (`count > 0`) → `count -= 1` → spawn `FloatingLog` lane **ngẫu nhiên** trôi xuống (`floatingLog.speedPx`; đang trôi KHÔNG tap được); `FloatingLogSystem`: bị block chặn → **NEO = convert thành `Block` hoàn chỉnh** tại ô thượng lưu — **trúng slot → AUTO SLOT-FILL** (`filled=true`, +1 tiến độ, glow xanh, KHÔNG cần hải ly); lane kín tới row 0 → neo tiếp lên **Ô ẢO row âm** (`virtualCells` §A5); lane HOÀN TOÀN hở → trôi lọt, gỗ **mất**.
4. **FETCH + carry (v2.1 — relocate mọi block)** (§A4.2): tap **BẤT KỲ block** trên grid/ô ảo (trừ block hải ly đang đứng) → validate island → `bfsPath` tới block kề → `CRAWLING` từng ô (`speedPx`) → `PICKING` 0.4s → block biến mất khỏi grid (xóa occupancy; **nếu đang lấp slot → `filled=false`, X giảm 1**) → `carrying='log'`; hải ly spawn đứng trên starter block (`beaver.startCol/startRow`); 1 lệnh, không hàng đợi; KHÔNG recall về kho; edge cases §A4.4.
5. **Green cells + PLACE** (§A4.3): khi carry, highlight ô xanh = ô trống **TRONG GRID rows 0..N−1** (không ô ảo) kề-4 mọi block reachable (BFS); tap ô xanh → path tới block kề đích → `BUILDING` 0.4s → spawn block: trùng slot → **glow xanh +1 tiến độ**; không trùng → **tường tạm** (mở rộng mạng); tap ngoài ô xanh → flash đỏ từ chối.
6. **Walkable network + island**: helper `reachableBlocks`/`bfsPath` trong `Grid`; FETCH/PLACE chỉ trong island của hải ly; re-path/hủy lệnh khi mạng đổi. *(M2 chưa có rock nên island chỉ test được qua debug console — verify thật ở M4.)*
7. **WinLoseSystem**: blueprint đầy → **WIN ngay**. *(Tồn tại từ M2 và chạy độc lập khi Water/Obstacle chưa có — chỉ đọc Blueprint, stub an toàn.)*

**✅ DoD:** Drag nền → camera pan mượt, dừng đúng biên rừng, KHÔNG auto-return, game không pause; kho tự +1 sau mỗi 30s (không giới hạn max); tap kho khi mọi lane hoàn toàn hở → gỗ trôi mất (kho −1); có lane bị chặn → gỗ **neo thành Block hoàn chỉnh** đúng ô ngay thượng lưu (đi lên được, nhặt được, chặn gỗ sau) — **neo TRÚNG slot → `X` tự +1 + glow xanh, KHÔNG cần hải ly**; lane kín → neo tiếp lên ô ảo row âm; tap block bất kỳ (trừ block đang đứng) → hải ly bò theo mạng block (xa = lâu hơn) → nhặt (block rời grid; **đang lấp slot → `X` giảm 1**) → vác; đang vác → ô xanh hiện đúng (chỉ ô trống TRONG grid kề mạng reachable — KHÔNG có ô xanh trên vùng ô ảo); tap ô xanh → đặt: trùng slot glow xanh & tăng `X`, lệch slot thành tường tạm **và ô xanh lan theo mạng mới**; lấp đủ → WIN overlay.

**▶️ Run & verify:** (1) Pan hết cỡ trái/phải → thấy trọn 2 khu rừng, không lộ ngoài world, thả tay camera đứng yên (không auto-return). (2) Thả gỗ khi chỉ lane 2–3 có block (starter) → gỗ rơi lane 0/1/4 trôi mất, rơi lane 2/3 neo thành block đứng lên được; **level 0: gỗ neo lane 2/3 rơi trúng slot row 0 → `X` tự +1 + glow, hải ly KHÔNG cần làm gì**. (3) Nhặt block ở xa vs gần → chênh travel time rõ. (4) Ra lệnh khi hải ly bận → bị chặn (UI "đang bận"). (5) Đặt 1 tường tạm nối dài → tap được ô xanh mới xa hơn. (6) Debug: xóa 1 block giữa mạng qua console → ô xanh chỉ còn trong island của hải ly. (7) Nhặt 1 block đang lấp slot → slot rỗng lại, `X` giảm 1; đặt lại vào slot → `X` +1 (relocate trọn vòng). (8) Thả gỗ liên tục vào 1 lane kín → block neo chồng lên ô ảo row −1, −2…; hải ly đi lên và nhặt được block ô ảo; vùng ô ảo KHÔNG hiện ô xanh khi vác.

## M3 — Water + Win/Lose screens — 🆕 REWRITE (wood production đã chuyển lên M2)

**🎯 Goal:** Đồng hồ thua: nước dâng đều → LOSE; màn hình WIN/LOSE + restart tại chỗ.

**Tasks:**
1. `WaterLevel` + `WaterSystem`: dâng đều `max/waterSecondsToFull`; đầy → **LOSE**. 🆕 v2.1 — **LOSE lý do 2: hải ly rơi nước** — `WinLoseSystem` nhận cờ `beaverDrowned` → LOSE ngay. *(M3 chỉ cần STUB đơn giản: cờ + dùng chung overlay LOSE, test qua debug console — nguồn trigger thật là đá phá block hải ly đang đứng, CHƯA có tới M4.)*
2. WIN → nước dừng ngay + xóa obstacle/telegraph (khi M4 có); LOSE → freeze world.
3. Overlay THẮNG/THUA + nút **chơi lại** (restart tại chỗ — reset về đầu level).
4. *(Stretch, nếu còn thời gian)* anim hải ly thợ khai thác chi tiết (gặm gỗ → đem vào kho) thay graybox M2.

**✅ DoD:** Thanh nước dâng đều; để hết giờ → LOSE overlay; lấp đủ trước → WIN & nước dừng; bấm chơi lại → level reset sạch (kho, gỗ nổi, block, nước, hải ly về starter block).

**▶️ Run & verify:** Ngồi im → thua đúng ở `waterSecondsToFull`; chơi nhanh → thắng, nước đóng băng; restart → chơi lại được ngay không reload trang.

## M4 — Obstacles

**🎯 Goal:** 2 obstacle data-driven theo lane với telegraph đúng semantics §A8.3; đá phá block front (tạo island thật; phá block hải ly đang đứng → LOSE ngay), gỗ trôi bị chặn → **neo thành Block hoàn chỉnh** (thống nhất cơ chế collect v2.1).

**Tasks:**
1. `Obstacle` + `ObstacleSystem`: đọc `LevelData.obstacles.schedule`; telegraph hiện từ `tSec − telegraphLeadSec`, obstacle spawn tại `spawnY = −cellH` đúng `tSec`; hết danh sách → lặp entry cuối mỗi `repeatIntervalSec`.
2. Di chuyển theo lane (`y += speed*dt`), telegraph icon ở đỉnh lane.
3. Va chạm ROCK với **block front = block alive có row NHỎ NHẤT trong lane, KỂ CẢ ô ảo row âm** (tra `virtualCells` trước rồi `cells` §A8): văng block, trừ tiến độ nếu đang lấp slot, xóa occupancy, rock biến mất; lane hoàn toàn hở → trôi qua. **Hệ quả v2.1** (§A8.1): block phía trên block bị phá đứng yên (KHÔNG trôi lại); mạng chia cắt → island + re-path/hủy lệnh hải ly; **đá phá block hải ly ĐANG ĐỨNG → hải ly rơi nước → LOSE NGAY** (nối vào cờ `beaverDrowned` stub M3). *(⏳ Định hướng DAMAGE: đá phá xuyên nhiều block theo chỉ số damage — stack ô ảo tiêu hao trước; số liệu tuning để sau, M4 mặc định 1-hit.)*
4. Va chạm LOG: bị vật chặn → **NEO = convert thành `Block` hoàn chỉnh tại ô thượng lưu** y hệt gỗ kho §A4.1 (**auto slot-fill nếu trúng slot**; lên ô ảo nếu lane kín; KHÔNG +1 kho); lane hoàn toàn hở → trôi lọt, không phạt.

**✅ DoD:** Telegraph hiện đúng 1.2s trước khi obstacle bắt đầu trôi từ mép trên; đá kéo văng block front (giảm `X` nếu block đang lấp slot; block ô ảo bị va TRƯỚC block trong grid); log obstacle bị chặn → neo thành Block y hệt gỗ thả từ kho (trúng slot → `X` tự +1), tap nhặt-relocate được; đá phá block giữa mạng → hải ly kẹt island, ô xanh thu hẹp đúng island; **đá phá block hải ly đang đứng → LOSE overlay tức thì**.

**▶️ Run & verify:** (1) Để row 0 của 1 lane trống nhưng row 1 có block → đá va vào block row 1 (front = row nhỏ nhất). (2) Chặn 1 log obstacle → nó neo thành block, FETCH-relocate được như gỗ kho (kho KHÔNG tự +1); nếu neo trúng slot → `X` tự +1. (3) Dựng mạng 2 nhánh, cho đá phá block nối → hải ly chỉ còn thao tác trong island đang đứng; đặt tường tạm lan dần nối lại → mạng hợp nhất, ô xanh mở rộng lại. (4) Đá nhắm block hải ly đang đứng → hải ly rơi nước, LOSE ngay. (5) Lane có stack ô ảo → đá phá block ô ảo TRÊN CÙNG (row âm nhỏ nhất) trước, block trong grid an toàn (lá chắn hy sinh).

## M5 — Juice / Polish

**🎯 Goal:** Feedback & hoàn thiện: animation, glow/shake/splash, hook SFX, kiểm chứng asset-swap.

**Tasks:**
1. Animation beaver từ sprite có sẵn (§C1): CRAWLING → `beaver_crawl_v2_1..5`, IDLE → `beaver_idle_breath_1..4`; mapping `(state, carrying)` → vẽ thêm `block_carried` khi vác; glow slot đúng, shake khi block bị văng, splash ở thác + khi gỗ trôi lọt.
2. Hook SFX (điểm gọi, không cần audio thật ở prototype).
3. Hiệu ứng neo: gỗ vừa convert thành block nhún/splash nhẹ + glow xanh nổi bật khi AUTO SLOT-FILL — gợi ý "block nhặt-relocate được".
4. Kiểm chứng asset-swap: thả 1 vài PNG thật vào `assets/sprites/` + khai báo manifest → thay được graybox mà KHÔNG sửa logic.

**✅ DoD:** Có feedback thị giác cho các sự kiện chính (thả/neo/mất gỗ, auto slot-fill, nhặt/relocate, đặt đúng/tạm, block văng, LOSE rơi nước); đổ 1 sprite thật → hiển thị thay graybox.

**▶️ Run & verify:** Quan sát đủ chuỗi feedback trong 1 ván; khai báo 1 key trong manifest → sprite thật xuất hiện đúng chỗ.

**Ghi chú kiến trúc (áp dụng xuyên suốt M0–M5):** giữ tách 3 lớp logic/render/input, config data-driven, fixed logic units 1080×1920 (+ world pan §A6), một điểm swap-art duy nhất — tất cả để dễ port sang Unity C# sau này.

---

# PHẦN C — ASSET MANIFEST

> Prototype giao hàng **graybox** (rect màu + label) TRỪ anim hải ly builder đã có sẵn. Bảng dưới liệt kê asset; thay qua `assets/manifest.js` + `assets/sprites/`, KHÔNG sửa logic. Kích thước px tính theo canvas nội bộ **1080×1920**. Chỉ liệt kê asset trong scope prototype.

## C1. Hải Ly Builder (nhân vật chính) — 🆕 v2.0: 2 anim CÓ SẴN

| key | nguồn / filename | states / frames | px (gợi ý) | trạng thái |
|---|---|---|---|---|
| `beaver_idle` | **CÓ SẴN** `assets/sprites/Beaver/beaver_idle_breath_1..4.png` | idle breath (4 frame) | theo file | ✅ dùng ngay từ M2 (IDLE) |
| `beaver_crawl` | **CÓ SẴN** `assets/sprites/Beaver/beaver_crawl_v2_1..5.png` | crawl (5 frame) | theo file | ✅ dùng ngay từ M2 (CRAWLING) |
| `beaver_build` | *(tạm)* dùng frame crawl/idle có sẵn ở M2 | build (2–3 frame) | ~150×180 | art riêng cấp sau |
| `beaver_pickup` | *(tạm)* dùng frame crawl/idle có sẵn ở M2 | pickup (2–3 frame) | ~150×180 | art riêng cấp sau |
| `beaver_carry` | *(tạm)* render = crawl/idle + vẽ `block_carried` đè lên lưng | theo `(state, carrying)` | — | art riêng cấp sau |
| `beaver_win` | beaver_win.png | vẫy tay ăn mừng | ~150×180 | graybox, cấp sau |

> Manifest hỗ trợ khai báo **mảng frame** cho 1 key anim (vd `beaver_crawl: [".../beaver_crawl_v2_1.png", ...]`).

## C2. Hải ly thợ (khu khai thác rừng trái — visual sản xuất gỗ)

| key | filename | states | px | format | graybox |
|---|---|---|---|---|---|
| `lumberjack_idle` | lumberjack_idle.png | idle | ~90×110 | PNG | rect `#7a5230`, label "LJ" — **M2 graybox được phép** |
| `lumberjack_chop` | lumberjack_chop.png | gặm gỗ (2–3 frame) | ~90×110 | PNG | rect `#7a5230`, label "CHOP" — anim chi tiết = M3 stretch |
| `lumberjack_haul` | lumberjack_haul.png | đem thành phẩm vào kho | ~90×110 | PNG | rect `#7a5230`, label "HAUL" — optional |

## C3. Bó gỗ (block đã đặt) — prototype CHỈ cần 1x1

| key | filename | size | px (theo cell 180×150) | format | graybox | giai đoạn |
|---|---|---|---|---|---|---|
| `block_1x1` | block_1x1.png | 1x1 | 180×150 | PNG | rect `#a9772f`, label "1x1" | **prototype** |
| `block_carried` | block_carried.png | khúc gỗ trên lưng hải ly (render đè khi `carrying`) | ~120×90 | PNG | rect `#a9772f`, label "LOG" | **prototype** |
| `float_log` | float_log.png | khúc gỗ ĐANG TRÔI trên sông (chỉ DRIFTING — gỗ kho thả + log obstacle dùng chung; khi neo → convert Block, vẽ bằng `block_1x1`) | ~170×100 | PNG | rect `#8f6a3a`, label "FLOAT" | **prototype** |
| `block_1x2` | block_1x2.png | 1x2 | 180×300 | PNG | rect `#a9772f`, label "1x2" | giai đoạn sau |
| `block_2x1` | block_2x1.png | 2x1 | 360×150 | PNG | rect `#a9772f`, label "2x1" | giai đoạn sau |
| `block_2x2` | block_2x2.png | 2x2 | 360×300 | PNG | rect `#a9772f`, label "2x2" | giai đoạn sau |

> Block đúng blueprint (đặt tay hoặc auto slot-fill) = glow xanh (overlay `#3fae5a`); block ngoài blueprint = nâu thường không glow. v2.1: mọi block **nhặt-relocate được** (không recall về kho).

## C4. Obstacle (prototype = 2 loại — màu tách biệt block xây)

| key | filename | states | px | format | graybox |
|---|---|---|---|---|---|
| `rock_big` | rock_big.png | idle/trôi | ~160×160 | PNG | rect `#6b6b6b`, label "ROCK" |
| `drift_log` | drift_log.png | idle/trôi (khi bị chặn → NEO = convert thành Block, vẽ bằng `block_1x1` §A8.2) | ~180×110 | PNG | rect `#5b7a4a` (xanh rêu — khác `#a9772f` block), label "LOG-OB" |

## C5. Môi trường (portrait + world pan ngang)

| key | filename | mô tả | format | graybox |
|---|---|---|---|---|
| `bg_river` | bg_river.png | nền sông dọc (vùng giữa world, 1080×1920) | PNG/JPG | rect xanh `#2f6d8a`, label "RIVER" |
| `lane_line` | lane_line.png | đường kẻ lane mờ | PNG | line mờ trắng |
| `flow_arrow` | flow_arrow.png | mũi tên hướng chảy | PNG | mũi tên trắng mờ |
| `forest_left` | forest_left.png | khu rừng TRÁI ngoài mép màn — chứa khu khai thác (thợ + kho) — `forestW`×1920 (~450×1920) | PNG | rect `#2f5d3a`, label "FOREST-L" |
| `forest_right` | forest_right.png | khu rừng PHẢI ngoài mép màn — visual thuần, khu khai thác 2 để giai đoạn sau — `forestW`×1920 | PNG | rect `#2f5d3a`, label "FOREST-R" |
| `waterfall` | waterfall.png | thác dưới đập | PNG | rect `#3f8db0`, label "FALL" |
| `foam` | foam.png | bọt nước | PNG | rect trắng mờ |

## C6. Blueprint ghost slots — prototype CHỈ cần 1x1

| key | filename | size | px | format | graybox | giai đoạn |
|---|---|---|---|---|---|---|
| `slot_1x1` | slot_1x1.png | 1x1 | 180×150 | PNG | viền nét đứt `rgba(255,255,255,.15)`, label "1x1" | **prototype** |
| `slot_1x2` | slot_1x2.png | 1x2 | 180×300 | PNG | như trên, label "1x2" | giai đoạn sau |
| `slot_2x1` | slot_2x1.png | 2x1 | 360×150 | PNG | như trên, label "2x1" | giai đoạn sau |
| `slot_2x2` | slot_2x2.png | 2x2 | 360×300 | PNG | như trên, label "2x2" | giai đoạn sau |

## C7. UI

| key | filename | mô tả | format | graybox |
|---|---|---|---|---|
| `ui_progress` | ui_progress.png | khung tiến độ `X/Y` | PNG | text đen trên nền bo góc |
| `ui_water_bar` | ui_water_bar.png | thanh mực nước (đồng hồ thua) | PNG | rect viền + fill xanh |
| `ui_wood_button` | ui_wood_button.png | **NÚT KHO GỖ cố định** — icon khúc gỗ + bộ đếm `count`; **TAP để thả gỗ** (không drag); disable/mờ khi `count == 0` | PNG | rect bo góc, label "WOOD n" |
| `ui_pause` | ui_pause.png | nút pause | PNG | icon `‖` |
| `ui_green_cell` | ui_green_cell.png | highlight **Ô XANH** đặt được (khi hải ly đang vác gỗ) | PNG | overlay xanh mờ `rgba(63,174,90,.35)` |
| `ui_invalid` | ui_invalid.png | flash đỏ khi lệnh bị từ chối (tap ngoài ô xanh / block khác island / block đang đứng lên / hải ly bận) | PNG | overlay đỏ mờ |
| `ui_danger_lane` | ui_danger_lane.png | cảnh báo lane nguy hiểm (telegraph) | PNG | overlay đỏ mờ |
| `ui_correct_glow` | ui_correct_glow.png | glow block đúng | PNG | glow xanh `#3fae5a` |
| `panel_win` | panel_win.png | overlay THẮNG | PNG | panel bo góc, label "WIN" |
| `panel_lose` | panel_lose.png | overlay THUA | PNG | panel bo góc, label "LOSE" |

## C8. Audio (optional cho prototype)

| key | filename | dùng khi | ghi chú |
|---|---|---|---|
| `sfx_drop` | sfx_drop.wav/mp3 | thả gỗ từ kho xuống sông | optional |
| `sfx_anchor` | sfx_anchor.wav/mp3 | gỗ neo thành block (+ biến thể khi auto slot-fill trúng slot) | optional |
| `sfx_pickup` | sfx_pickup.wav/mp3 | hải ly nhặt block (FETCH-relocate) | optional |
| `sfx_place` | sfx_place.wav/mp3 | đặt block | optional |
| `sfx_rock_hit` | sfx_rock_hit.wav/mp3 | đá phá block | optional |
| `sfx_win` / `sfx_lose` | ... | end screen | optional |
| `bgm_river` | bgm_river.mp3 | nhạc nền | optional |

## C9. Quy ước bàn giao

- **Folder:** ảnh vào `assets/sprites/` (anim nhân vật có thể để thư mục con, vd `assets/sprites/Beaver/` — đã tồn tại), audio vào `assets/audio/`; khai báo key→path (hoặc key→mảng frame) trong `assets/manifest.js`.
- **Đặt tên:** `snake_case`, đúng `key` trong bảng để swap tự động.
- **Format:** PNG trong suốt cho sprite; nền có thể JPG. Anim nhiều frame = nhiều file đánh số (như bộ Beaver có sẵn) hoặc sprite sheet (ghi rõ số frame).
- **Độ phân giải:** thiết kế theo canvas 1080×1920; cung cấp **@2x** nếu muốn sắc nét.
- **Pivot:** nhân vật/obstacle pivot đáy-giữa để dễ port Unity (SpriteRenderer).
- **Asset-swap:** chỉ cần đổ file + khai báo manifest; `drawSprite` tự thay graybox, KHÔNG sửa logic.

---

# PHẦN D — SỐ LIỆU TUNING (prototype defaults)

> Tất cả số dưới đây là **prototype default, tunable** — chọn để Chapter 1 "cảm giác đúng" (winnable nhưng có áp lực), dễ chỉnh trong 1 file config (`config/levels.js`). Prototype **chỉ** có 2 obstacle (Đá lớn, Khúc gỗ trôi) + block 1x1 và cơ chế core v2.0; mọi thứ khác (tool, skill, bom, xoáy, size lớn) bỏ ngoài.

## D1. Grid, world & kích thước canvas
- **Canvas mục tiêu:** 1080 × 1920 px (portrait), scale-to-fit. *(prototype default, tunable)*
- **World ngang (v2.0):** `worldW = 1080 + 2×forestW`; `forestW` = **450 px** (khoảng gợi ý 400–500, tunable qua `LevelData.camera.forestW`) → worldW = 1980, `panLimit = worldW − 1080 = 2×forestW = 900`. Camera init `x = forestW` (nhìn thẳng sông). Ngưỡng tap/drag `TAP_THRESHOLD_PX = 10`. *(tunable)*
- **Số lane (cột):** 5 (cố định theo GDD).
- **Luật số hàng (`rows`) (v1.2):** `rows` = **(row blueprint lớn nhất + 1) + 1 row dư**. Row dư không có slot — là chỗ đặt **starter blocks** (§D2). Áp dụng: **level 0 "Thẳng"** (blueprint chỉ row 0) → `rows` = **2** (row 1 = row dư); **level 1 "Chữ U"** (blueprint rows 0–2) → `rows` = **4** (row 3 = row dư).
- **Vùng grid (nơi đập nằm):** đặt ở giữa-dưới vùng sông để chừa không gian obstacle trôi từ trên.
  - Cell size: **180 × 150 px** → grid rộng 5×180 = **900 px** (căn giữa vùng sông, lề ~90 px mỗi bên trong hệ sông), cao `rows`×150 (level 1: 4×150 = **600 px**; level 0: 2×150 = **300 px**). *(prototype default, tunable)*
  - Grid top Y ≈ **900 px** (`originY`), grid bottom Y = 900 + `rows`×150 (level 1 ≈ **1500 px**, level 0 ≈ **1200 px**).
  - Vùng trên (Y 0 → 900): làn obstacle + gỗ nổi trôi + telegraph. Vùng dưới (Y 1500 → 1920): thác nước (visual).
- **Toạ độ ô:** `col` 0..4 (trái→phải), `row` 0..`rows`-1 (trên→dưới; row 0 = hàng nước chạm trước về mặt hình học). **Lưu ý:** "block mặt trước" của lane KHÔNG cứng là row 0 — là block sống có **row nhỏ nhất** trong lane đó (§A8).

## D2. Hai blueprint mẫu — TOÀN slot 1x1 (grid 5 × `rows` theo luật row dư §D1)
Quy ước `BlueprintSlot`: `{col, row, size}` — prototype mọi slot đều `size: "1x1"` (ô neo = chính ô slot). *(Các size 1x2/2x1/2x2 để giai đoạn sau.)*

**Blueprint A — "Thẳng"** (1 hàng ngang lấp trọn 5 lane ở row 0). Total **Y = 5 khối**.
| # | col | row | size |
|---|-----|-----|------|
| 1 | 0 | 0 | 1x1 |
| 2 | 1 | 0 | 1x1 |
| 3 | 2 | 0 | 1x1 |
| 4 | 3 | 0 | 1x1 |
| 5 | 4 | 0 | 1x1 |

**Blueprint B — "Chữ U"** (2 thành dọc + đáy ngang, ghép từ ô 1x1; lòng chữ U hở cho nước). Total **Y = 9 khối**.
| # | col | row | size | ghi chú |
|---|-----|-----|------|---------|
| 1 | 0 | 0 | 1x1 | thành trái (trên) |
| 2 | 0 | 1 | 1x1 | thành trái (dưới) |
| 3 | 4 | 0 | 1x1 | thành phải (trên) |
| 4 | 4 | 1 | 1x1 | thành phải (dưới) |
| 5 | 0 | 2 | 1x1 | đáy |
| 6 | 1 | 2 | 1x1 | đáy |
| 7 | 2 | 2 | 1x1 | đáy |
| 8 | 3 | 2 | 1x1 | đáy |
| 9 | 4 | 2 | 1x1 | đáy |

*(Ghi chú: đếm tiến độ **theo khối** — mỗi slot = 1 đơn vị. Level 2 nhiều khối hơn (9 vs 5) = khó hơn, bù bằng `waterSecondsToFull` dài hơn — xem D5. prototype default, tunable.)*

**Starter blocks (block tặng đầu màn — v1.2, vai trò mới v2.0):** mặc định mỗi level tặng **2 block 1x1 KỀ NHAU ở cột 2 & 3 của row dư**; GD chỉnh vị trí/số lượng qua field `starterBlocks` trong LevelData (§D8):
- Blueprint A "Thẳng" (`rows` = 2, row dư = row 1): `[{col:2,row:1},{col:3,row:1}]`.
- Blueprint B "Chữ U" (`rows` = 4, row dư = row 3): `[{col:2,row:3},{col:3,row:3}]`.
- Là **tường tạm off-blueprint** (spawn với `onBlueprint=false`): chặn obstacle & neo gỗ nổi, KHÔNG tính tiến độ `X/Y`, KHÔNG bao giờ lấp slot blueprint; chiếm occupancy `grid.cells`. **v2.0:** kiêm (a) **CHỖ ĐỨNG XUẤT PHÁT của hải ly** (`beaver.startCol/startRow` PHẢI trùng 1 starter block) và (b) **mạng đi được khởi đầu** → các starter block PHẢI kề nhau (4 hướng). v2.1: **nhặt-relocate được** như mọi block (trừ lúc hải ly đang đứng lên — §A4.2), KHÔNG recall về kho; đá phá được — đá phá block hải ly đang đứng → **LOSE ngay** (§A8.1). ⚠️ GD **không nên** đặt starter block trùng ô slot blueprint.

## D3. Khai thác & thả gỗ (v2.0 — kho đơn `WoodStock`, `ProductionSystem`, `FloatingLogSystem`)

> **Thay hoàn toàn mô hình cũ "2 kho 2 bên, 5s/bó, kéo từ kho".** Rừng TRÁI có **khu khai thác duy nhất** của prototype; rừng PHẢI là visual, khu khai thác thứ 2 để giai đoạn sau (`wood.right = null` trong JSON).

- **Nhịp khai thác (`wood.left.intervalSec`):** **1 block gỗ / 30 giây** vào kho (nhóm thợ diễn anim gặm gỗ → đem vào kho; anim chi tiết là M3 stretch). *(prototype default, tunable — nghi ngờ hơi chậm, cần playtest)*
- **Kho khởi đầu (`wood.left.startingStock`):** 🆕 v2.1 — DEFAULT **3** cho cả 2 level (data per-level, tunable). Giảm từ 6/8 vì v2.1 gỗ neo = block hoàn chỉnh + auto slot-fill + ô ảo → gỗ CHỈ mất khi lane hoàn toàn hở, kinh tế bớt hao. Loader init `count = startingStock`. Kho **KHÔNG giới hạn max**. *(prototype default, RẤT cần playtest)*
- **Kho = BỘ ĐẾM trên UI button** (nút cố định, không pan): hiển thị `count`; **tap = thả 1 khúc gỗ** (`count -= 1`) vào **lane ngẫu nhiên** — trôi xuống với `floatingLog.speedPx`; bị chặn → **neo thành Block hoàn chỉnh** (auto slot-fill nếu trúng slot; lên ô ảo nếu lane kín), lane HOÀN TOÀN hở → mất (§A4.1). `count == 0` → nút disable, KHÔNG phải thua.
- **Gỗ nổi (`floatingLog`):** `speedPx = 350` px/giây (chậm hơn log obstacle 400 một chút để dễ quan sát), `spawnY = −150`. *(prototype default, tunable)*
- **Nguồn phụ:** khúc gỗ trôi (obstacle) bị chặn → **neo thành Block như gỗ kho** (§A8.2 — kể cả auto slot-fill) — KHÔNG còn "+1 bó vào kho ngay".
- **Chi phí:** 1 gỗ = 1 lần thả = 1 block tiềm năng; trừ kho **tại thời điểm thả**. KHÔNG có bước trừ khi đặt, KHÔNG refund/recall về kho (v2.1: nhặt block = relocate trên grid, không hoàn kho).

## D4. Hải ly builder (`Beaver`) — di chuyển trên mạng block
- **Chỉ đi trên block đã đặt** (mạng kề 4 hướng, path BFS §A4) — KHÔNG xuống nước, KHÔNG lên bờ.
- **Tốc độ bò (`speedPx`):** **320 px/giây**. Travel time = **tổng quãng đường path (px) / speedPx**; mỗi bước ngang = 180 px, dọc = 150 px. Vd path 4 bước ngang (720 px) ≈ 2.25 giây. *(prototype default, tunable. KHÔNG dùng đơn vị cells/giây — cell không vuông.)*
- **Thời lượng đặt (`buildSec`):** **0.4 giây** khi tới block kề ô đích. *(prototype default, tunable)*
- **Thời lượng nhặt (`pickupSec`):** **0.4 giây** khi tới block kề block target (FETCH bất kỳ block — v2.1 §A4.2) → block rời grid (đang lấp slot → X−1), `carrying='log'`. *(prototype default, tunable)*
- **Capacity:** 1 khúc/chuyến, **không hàng đợi lệnh** (luật code cố định ở prototype, không phải trường config).
- **Vị trí start:** đứng TRÊN 1 trong 2 starter block — `startCol 2`, `startRow = rows-1` (row dư; level 0: row 1, level 1: row 3). `startCol/startRow` PHẢI trùng 1 starter block. *(prototype default, tunable)*

## D5. Mực nước (`WaterLevel` — đồng hồ thua)
- **Level 1 (Thẳng): `waterSecondsToFull` = 90 giây.** Dâng đều tuyến tính (linear là luật code). *(Retune v2.1: kinh tế 3 khởi đầu + 3 khai thác trong 90s = 6 gỗ cho 5 slot + nguồn phụ log obstacle neo; bù lại gỗ CHỈ mất khi lane hoàn toàn hở (ô ảo giữ gỗ) và auto slot-fill giảm thao tác hải ly. prototype default, RẤT cần playtest)*
- **Level 2 (Chữ U): `waterSecondsToFull` = 120 giây.** 9 khối; 3 khởi đầu + 4 khai thác = 7 gỗ cho 9 slot — PHỤ THUỘC nguồn phụ log obstacle neo (schedule nhiều LOG) + gỗ không mất khi lane có chặn. *(Retune v2.1. prototype default, RẤT cần playtest)*
- **Quy tắc scale gợi ý:** mỗi level khó hơn giảm ~10–15% "giây/khối" và/hoặc +1 hàng N. Hoàn thành blueprint → **dừng nước ngay** = thắng.

## D6. Obstacle (prototype = 2 loại)
Chung: trôi thẳng theo 1 lane từ trên xuống.
- **Semantics thời gian (chốt):** trong `schedule`, **`tSec` = thời điểm obstacle BẮT ĐẦU TRÔI**. **Telegraph** (nhấp nháy icon ở đỉnh lane) hiện từ **`tSec − telegraphLeadSec`** đến `tSec`. Obstacle **spawn tại `spawnY = −cellH = −150 px`** đúng lúc `tSec`.
- **Telegraph lead time (`telegraphLeadSec`):** **1.2 giây**. *(prototype default, tunable)*
- **Fall speed:**
  - **Đá lớn (`rockFallSpeedPx`):** **500 px/giây** (nhanh, dứt khoát; từ spawnY −150 tới đập Y=900 ≈ 2.1s). *(prototype default, tunable)*
  - **Khúc gỗ trôi (`logFallSpeedPx`):** **400 px/giây** (~2.6s tới đập). *(prototype default, tunable)*
- **Va chạm** (block front = block sống có **row nhỏ nhất** trong lane — §A8):
  - **ĐÁ** trúng block front (kể cả block ô ảo — bị va TRƯỚC) → **kéo văng khối** xuống thác (block mất, xây lại được), rồi đá biến mất; hệ quả mạng/island (§A8.1); **phá block hải ly đang đứng → hải ly rơi nước → LOSE ngay**. Lane hoàn toàn hở → trôi qua vô hại. *(⏳ M4 định hướng damage — số liệu để sau.)*
  - **GỖ** bị chặn → **neo thành `Block` hoàn chỉnh** (v2.1 — auto slot-fill nếu trúng slot; KHÔNG +1 kho); lane hoàn toàn hở → trôi lọt, mất cơ hội, không sát thương.
- **Schedule semantics:** danh sách chạy **1 lần, không loop**; hết danh sách → lặp lại entry cuối cùng mỗi `repeatIntervalSec` giây (giữ áp lực tới khi WIN/LOSE). WIN → xóa obstacle/telegraph ngay.
- **Lịch spawn Chapter 1 (nhẹ, dạy chơi):** interval **~4 giây/obstacle**, xen kẽ; GỖ nhiều hơn ĐÁ (tỉ lệ ~2:1) để người mới có thêm gỗ nhặt. Lane chọn xoay vòng. *(prototype default, tunable — xem schedule cứng trong JSON §D8)*

## D7. Hành vi block (`Block`)
- **Không có HP trong prototype.** ĐÁ = **1-hit knock-off**; GỖ không gây sát thương. Luật code cố định, KHÔNG phải trường config.
- **🆕 v2.1 — block KHÔNG cố định:** MỌI block nhặt-relocate được (trừ block hải ly đang đứng lên); KHÔNG recall về kho / không refund. Obstacle phá được mọi block — kể cả block hải ly đang đứng (→ hải ly rơi nước, LOSE ngay §A8.1).
- **Khối rộng 2 lane (2x1 / 2x2) — giai đoạn sau:** ĐÁ trúng bất kỳ 1 lane nào phủ bởi khối → văng nguyên khối. Prototype toàn 1x1, chưa cần.
- Đặt sai ô (ngoài blueprint) = tường tạm 1x1: vẫn chặn obstacle & neo gỗ nổi, **không** tính tiến độ — và là công cụ **mở rộng/nối mạng đi được**.

## D8. Sample levels (JSON — `LevelData`, load được, ĐỦ 2 level)

Loader: `loadLevel(index)` đọc `levels[index]` (mặc định `0`). Field → system mapping (v2.0): `grid` → Grid (toạ độ hệ SÔNG; world offset `+forestW` khi render/input — §A5); `blueprint.slots` → Blueprint (Y = `slots.length`); `starterBlocks` → `Game.loadLevel` spawn Block 1x1 `onBlueprint=false` + occupancy — **kiêm mạng đi được khởi đầu & chỗ đứng hải ly** (phải kề nhau; `beaver.startCol/startRow` trùng 1 block; M4: obstacle tương tác như block thường); `camera` → Camera/InputController/Renderer (`forestW`; `panLimit` PHẢI = 2×forestW, loader tự derive nếu bỏ trống); `wood.left` → WoodStock + ProductionSystem (kho khai thác trái; **`wood.right = null` = rừng phải visual thuần, khu khai thác 2 để giai đoạn sau**); `floatingLog` → FloatingLogSystem (gỗ thả từ kho + log obstacle; **neo → convert thành Block, auto slot-fill §A4.1** — KHÔNG có field trạng thái ANCHORED, FloatingLog chỉ DRIFTING v2.1); `beaver` → Beaver/BeaverSystem; `water` → WaterLevel/WaterSystem (LOSE thêm cờ `beaverDrowned` v2.1 — không cần field config); `obstacles` → ObstacleSystem. `wood.left.startingStock` DEFAULT **3** (v2.1, per-level tunable). KHÔNG còn `sourceSide`/refund/`COST_PER_BLOCK` — chi phí = trừ kho khi thả (§D3); ô ảo (`virtualCells`) là runtime state, KHÔNG nằm trong LevelData.

```json
{
  "levels": [
    {
      "id": "ch1_lvl1_thang",
      "name": "Suối Xanh 1 - Thẳng",
      "grid": { "cols": 5, "rows": 2, "cellW": 180, "cellH": 150, "originX": 90, "originY": 900 },
      "camera": { "forestW": 450, "panLimit": 900 },
      "blueprint": {
        "slots": [
          { "col": 0, "row": 0, "size": "1x1" },
          { "col": 1, "row": 0, "size": "1x1" },
          { "col": 2, "row": 0, "size": "1x1" },
          { "col": 3, "row": 0, "size": "1x1" },
          { "col": 4, "row": 0, "size": "1x1" }
        ]
      },
      "starterBlocks": [
        { "col": 2, "row": 1 },
        { "col": 3, "row": 1 }
      ],
      "wood": {
        "left":  { "intervalSec": 30, "startingStock": 3 },
        "right": null
      },
      "floatingLog": { "speedPx": 350, "spawnY": -150 },
      "beaver": { "startCol": 2, "startRow": 1, "speedPx": 320, "buildSec": 0.4, "pickupSec": 0.4 },
      "water": { "waterSecondsToFull": 90 },
      "obstacles": {
        "telegraphLeadSec": 1.2,
        "spawnY": -150,
        "rockFallSpeedPx": 500,
        "logFallSpeedPx": 400,
        "repeatIntervalSec": 4,
        "schedule": [
          { "tSec": 3,  "type": "log",  "lane": 2 },
          { "tSec": 7,  "type": "log",  "lane": 0 },
          { "tSec": 11, "type": "rock", "lane": 4 },
          { "tSec": 15, "type": "log",  "lane": 1 },
          { "tSec": 19, "type": "log",  "lane": 3 },
          { "tSec": 23, "type": "rock", "lane": 2 },
          { "tSec": 27, "type": "log",  "lane": 4 },
          { "tSec": 31, "type": "log",  "lane": 0 },
          { "tSec": 35, "type": "rock", "lane": 1 },
          { "tSec": 39, "type": "log",  "lane": 3 }
        ]
      }
    },
    {
      "id": "ch1_lvl2_chu_u",
      "name": "Suối Xanh 2 - Chữ U",
      "grid": { "cols": 5, "rows": 4, "cellW": 180, "cellH": 150, "originX": 90, "originY": 900 },
      "camera": { "forestW": 450, "panLimit": 900 },
      "blueprint": {
        "slots": [
          { "col": 0, "row": 0, "size": "1x1" },
          { "col": 0, "row": 1, "size": "1x1" },
          { "col": 4, "row": 0, "size": "1x1" },
          { "col": 4, "row": 1, "size": "1x1" },
          { "col": 0, "row": 2, "size": "1x1" },
          { "col": 1, "row": 2, "size": "1x1" },
          { "col": 2, "row": 2, "size": "1x1" },
          { "col": 3, "row": 2, "size": "1x1" },
          { "col": 4, "row": 2, "size": "1x1" }
        ]
      },
      "starterBlocks": [
        { "col": 2, "row": 3 },
        { "col": 3, "row": 3 }
      ],
      "wood": {
        "left":  { "intervalSec": 30, "startingStock": 3 },
        "right": null
      },
      "floatingLog": { "speedPx": 350, "spawnY": -150 },
      "beaver": { "startCol": 2, "startRow": 3, "speedPx": 320, "buildSec": 0.4, "pickupSec": 0.4 },
      "water": { "waterSecondsToFull": 120 },
      "obstacles": {
        "telegraphLeadSec": 1.2,
        "spawnY": -150,
        "rockFallSpeedPx": 500,
        "logFallSpeedPx": 400,
        "repeatIntervalSec": 4,
        "schedule": [
          { "tSec": 3,  "type": "log",  "lane": 2 },
          { "tSec": 7,  "type": "log",  "lane": 0 },
          { "tSec": 11, "type": "rock", "lane": 4 },
          { "tSec": 15, "type": "log",  "lane": 1 },
          { "tSec": 19, "type": "rock", "lane": 2 },
          { "tSec": 23, "type": "log",  "lane": 3 },
          { "tSec": 27, "type": "log",  "lane": 4 },
          { "tSec": 31, "type": "rock", "lane": 0 },
          { "tSec": 35, "type": "log",  "lane": 2 },
          { "tSec": 39, "type": "log",  "lane": 1 },
          { "tSec": 43, "type": "rock", "lane": 3 },
          { "tSec": 47, "type": "log",  "lane": 4 }
        ]
      }
    }
  ]
}
```

Tất cả giá trị trên là **prototype default, tunable**.

---

# Câu hỏi / điểm còn mở

1. **Obstacle & tool deferred:** Bom nước, xoáy nước, và mọi tool (búa/khiên/đóng băng/hoàn tác) + ném đá + skill hải ly **để lại sau prototype**. ⏳ **Bom nước (M4+):** v2.1 relocate KHÔI PHỤC counterplay "nhặt block để mở lane cho bom trôi qua" (nhặt block lane đó lên, cầm trên tay hoặc đặt chỗ khác) — bom nước có LẠI đủ **2 counter: nhặt-mở-lane + ném đá** (tool sau prototype). Chi tiết thiết kế khi tới M4+.
2. **Các size 1x2/2x1/2x2 + khu khai thác PHẢI (rừng phải): GIAI ĐOẠN SAU.** Định hướng: mỗi khu khai thác sản xuất kích thước gỗ khác nhau; rừng phải đã có visual chỗ sẵn từ prototype (world pan); luật snap-về-anchor cho slot lớn đã ghi ở §A4.3.
3. **Tuning cần playtest xác nhận (v2.1 — nhiều số MỚI):** `intervalSec` khai thác (**30s/block có quá chậm** so nước dâng?), `startingStock` (**3/3 — default v2.1**, kinh tế level 2 phụ thuộc log obstacle neo §D5), `floatingLog.speedPx` (350 — tốc độ log trôi đủ đọc tình huống?), `forestW` (450) & cảm giác pan + `TAP_THRESHOLD_PX` (10px có phân biệt tốt tap/drag trên mobile?), `waterSecondsToFull` retune (90s/120s — flow nhặt-đặt nhiều bước hơn hẳn v1, nhưng auto slot-fill bù lại), `speedPx` (320 trên mạng block), `buildSec`/`pickupSec` (0.4s), telegraph 1.2s, fall speed đá/gỗ (500/400), lịch spawn (~4s, gỗ:đá ~2:1, `repeatIntervalSec` 4).
4. **Random lane khi thả gỗ:** thuần random 0..4 — v2.1 đã BỚT phạt (lane có chặn thì gỗ KHÔNG BAO GIỜ mất nhờ ô ảo, chỉ lệch chỗ cần relocate; trúng slot còn tự +1) nhưng đầu màn vẫn 3/5 lane hoàn toàn hở với chỉ 3 gỗ khởi đầu. Cân nhắc pity rule (không rơi lane hở N lần liên tiếp) hoặc cho người chơi thấy trước lane sắp rơi — cần playtest.
5. **Damage system (⏳ định hướng M4):** obstacle loại phá hủy có chỉ số DAMAGE — đá phá xuyên bao nhiêu block/gỗ trên đường tùy damage (stack ô ảo tiêu hao damage TRƯỚC khi tới đập). Số liệu tuning để sau. *(Câu hỏi cũ "đá vs block hải ly đang đứng" ĐÃ CHỐT v2.1: đá phá bình thường → hải ly rơi nước → LOSE ngay §A8.1 — không còn mở.)*
6. **Capacity mang gỗ:** hiện 1 khúc/chuyến, không hàng đợi. Có mở rộng capacity/queue theo màn sau này không?
7. **Block HP:** prototype không HP (đá 1-hit). Có thêm HP/độ bền + skill "bền bỉ +20%" khi rời prototype?
8. **Số hàng & blueprint theo chapter:** prototype dùng luật `rows` = hàng blueprint cần + 1 row dư (level 0: 2, level 1: 4) + 2 dạng (Thẳng, Chữ U — toàn 1x1). 3 dạng còn lại (chữ V, zigzag, bậc thang) và blueprint cao hơn theo chapter — thêm sau.
9. **Ngưỡng 3 sao:** chưa gắn số (hoàn thành nhanh / ít block bị phá / ít đặt sai) — ngoài scope prototype.
10. **Audio:** đánh dấu optional cho prototype; hook sẵn điểm gọi SFX/BGM, asset thật cấp sau.

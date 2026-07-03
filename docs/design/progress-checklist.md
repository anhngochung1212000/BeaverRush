# BEAVERRUSH — Progress Checklist

> Cập nhật: 2026-07-03. Theo dõi: đã làm ✅ · đang/chưa làm ⬜ · để sau (ngoài scope hiện tại) ⏳.
> Tài liệu liên quan: [GDD v3.2b](game-design-document.md) · [Prototype Plan v2.3](prototype-plan.md) · [Concept Analysis](concept-analysis.md)
> QUY TRÌNH: mỗi lần chốt/đổi cơ chế → cập nhật CẢ 3 tài liệu (GDD changelog + plan changelog/§D + checklist) cùng lúc.

---

## 0. Tổng quan trạng thái

| Hạng mục | Trạng thái |
|---|---|
| Đọc hiểu & phân tích concept | ✅ Xong |
| Chốt Game Design (GDD v3.1) | ✅ Xong (core loop khóa, còn vài số liệu tuning) |
| Prototype plan (v2.1) | ✅ Xong |
| **M0 — Setup** | ✅ Xong |
| **M1 — Board & Blueprint** | ✅ Xong |
| **M1.5 — Starter blocks** | ✅ Xong |
| **M2 — Điều khiển tap-based v3.1** | ✅ Xong (chờ playtest feedback) |
| **M3 — Nước dâng + Thắng/Thua** | ✅ Xong (chờ playtest feedback) |
| **M4 — Obstacle (đá + gỗ trôi)** | ✅ Xong (chờ playtest feedback) |
| **M5 — Polish / Juice** | 🔶 Code xong (juice + SFX hook + fade); CHỜ art + audio thật từ user |

Tech: HTML5 + Canvas, vanilla JS ES modules, portrait 1080×1920. Chạy: `npx http-server -p 8123` tại repo root → `http://localhost:8123/?level=N`.

---

## 1. Thiết kế (Design) — ✅ đã chốt

- [x] Core fantasy, art direction (2D cartoon, portrait, hải ly builder)
- [x] Điều khiển v3.1 **tap-based**: click kho → thả gỗ → gỗ neo thành block (tự lấp slot nếu trúng) → nhặt/relocate qua ô xanh
- [x] Hải ly **chỉ đi trên mạng block** (kề 4 hướng, gồm ô ảo), spawn trên block tặng, kẹt island chấp nhận
- [x] Travel time là cơ chế cốt lõi; 1 lệnh, không hàng đợi
- [x] Sản xuất gỗ: trại khai thác rừng trái, 30s/block, kho unlimited, khởi điểm 3 (data/level)
- [x] Gỗ thả: random lane; bị chặn → neo (block hoàn chỉnh); lane hở hoàn toàn → mất
- [x] Ô ảo (row âm) khi lane kín — không tính tiến độ, làm lá chắn đỡ đá
- [x] Tiến độ đếm theo KHỐI; lấp đủ blueprint = THẮNG NGAY
- [x] Thua: (1) nước dâng đầy · (2) hải ly rơi xuống nước (block đang đứng bị phá)
- [x] Block tặng đầu màn (data `starterBlocks`, default 2 ô giữa row dư) = chỗ đứng + hạt giống mạng
- [x] Luật grid: số hàng = hàng blueprint cần + 1 row dư
- [x] 🆕 Layout: đáy đập CỐ ĐỊNH y=1500 mọi level (`originY = 1500 − rows·cellH`, thác 1500→1920) — chốt theo playtest 2026-07-03
- [x] ~~Camera pan ngang có limit~~ → 🆕 REFRAME (2026-07-03, theo ref): SÔNG HẸP giữa (riverW = CANVAS_W − 2·forestW) + 2 BỜ RỪNG vừa trong 1 KHUNG HÌNH — KHÔNG pan (panLimit=0). forestW=175 → riverW=730; grid cellW 180→140, originX 90→15 (canh giữa sông); tap = lệnh (drag vô hiệu vì không pan)
- [x] Obstacle MVP đá + gỗ trôi; đá văng block/gỗ (định hướng có DAMAGE); gỗ trôi bị chặn → neo thành block
- [x] 🆕 Rock targeting (chốt 2026-07-03): obstacle PHÁ HỦY tự nhắm lane NHIỀU BLOCK NHẤT (grid + ô ảo), khóa lane ngay lúc telegraph (cảnh báo trung thực); hòa → lane index nhỏ; mọi lane trống → lane schedule (trôi vô hại). Gỗ trôi vẫn theo lane data
- [x] Chi phí: mọi khối = 1 bó; prototype chỉ dùng 1x1
- [x] 🆕 Dòng chảy theo mực nước — **v2 TRAVEL TIME** (chốt 2026-07-03): mỗi màn quy định THỜI GIAN trôi spawn→tâm ô neo row 0 (`drift.travelSecStart`, vd 4s) — vận tốc MỌI obstacle trên sông là số SUY RA (quãng chuẩn ÷ travelSec), không config px/s; nước dâng → travelSec rút ngắn tuyến tính tới SÀN `travelSecMin` (nước đầy); visual texture cuộn theo cùng tỉ lệ; gỗ đang trôi giữa sông cũng tăng tốc

### Còn mở (⏳ sẽ tune/chốt sau)
- [ ] Cơ chế **xoáy nước** (chưa thiết kế)
- [ ] Số liệu tuning: nhịp 30s/block? travel time gỗ/đá (`drift` 8→4s Thẳng, 6.4→3.2s Chữ U — đã x2 một lần theo playtest)? tốc độ bò 320px/s? forestW 450? `waterSecondsToFull` 90/120s? lịch spawn obstacle (gỗ:đá 2:1, lặp 4s)?
- [ ] Chỉ số **DAMAGE** của obstacle phá hủy (đá phá xuyên bao nhiêu block)
- [ ] Random lane có "pity" (tránh lane đã full) không?
- [ ] Vai trò tool **Hoàn tác** khi đã có relocate; **ném đá** cooldown; ngưỡng **3 sao**
- [ ] Kích thước lớn (1x2/2x1/2x2) + trại khai thác thứ 2 (rừng phải, size khác)

---

## 2. M0 — Setup ✅

- [x] `index.html` + canvas letterbox scale-to-fit 9:16
- [x] `.claude/launch.json` (static server http-server:8123)
- [x] Cấu trúc `src/` (core / model / render / config) + `assets/` (manifest + sprites)
- [x] Game loop fixed-timestep + StateMachine (LOADING/PLAYING/WIN/LOSE)
- [x] Asset-abstraction layer (`drawSprite` → graybox fallback khi chưa có ảnh)

## 3. M1 — Board & Blueprint ✅

- [x] Grid 5 lane × N hàng + occupancy map + ánh xạ tọa độ
- [x] Vẽ lane kẻ mờ + mũi tên hướng chảy
- [x] `config/levels.js` — `levels[]` data-driven, `loadLevel(index)`, `?level=N`
- [x] Blueprint ghost slots (1x1, nét đứt)
- [x] UI: bộ đếm tiến độ `X/Y`, thanh nước (tĩnh)
- [x] 2 level mẫu: Thẳng (5×2, 5 slot) + Chữ U (5×4, 9 slot)

## 3b. M1.5 — Starter blocks ✅

- [x] Grid thu gọn theo luật (Thẳng 5×2, Chữ U 5×4)
- [x] `starterBlocks` trong level data; loader spawn (bỏ qua ô không hợp lệ, cảnh báo)
- [x] Layer render blocks (graybox nâu) — kéo sớm từ M2
- [x] Block tặng = tường tạm, không tính tiến độ

## 4. M2 — Điều khiển tap-based v3.1 ✅

- [x] **Camera**: world rộng hơn màn, pan ngang clamp, drag/tap tách biệt (ngưỡng 10px), UI cố định
- [x] **Trại khai thác** rừng trái: sản xuất +1 gỗ/30s, kho unlimited (graybox)
- [x] **Nút kho gỗ** UI: icon + số lượng, click để thả
- [x] **Thả gỗ**: trừ kho → FloatingLog random lane trôi xuống
- [x] **Neo → block**: bị chặn thì neo thành block hoàn chỉnh; **auto slot-fill** nếu trúng slot (+1, glow xanh)
- [x] **Ô ảo**: lane kín → xếp chồng row âm (đi/nhặt được, không tính tiến độ)
- [x] **Mất gỗ**: lane hở hoàn toàn → gỗ trôi mất
- [x] **Nhặt (relocate)**: click block BẤT KỲ → hải ly BFS bò tới → nhặt (nhặt block đang lấp slot → X−1). 🆕 v3.2 (chốt 2026-07-03): click block ĐANG ĐỨNG cũng được — hải ly tự NÉ sang block kề rồi nhặt; đảo 1 ô (không block kề) → từ chối
- [x] **Ô xanh + đặt**: hiện ô trống kề mạng reachable (chỉ trong grid) → click → bò tới → đặt (trúng slot +1 / tường tạm)
- [x] **Mạng block**: hải ly chỉ đi trên block, BFS kề 4 hướng gồm ô ảo, island isolation
- [x] **WIN** tức thì khi X == Y
- [x] Sprite hải ly thật (crawl 1..5 + idle 1..4) + flip theo hướng + overlay ôm gỗ
- [x] Fix multi-touch (ngón 2 không làm nhảy camera)
- [x] Verify: smoke 30/30 · trace 7 kịch bản · E2E browser (tự động)

### M2 — chờ playtest feedback (người dùng)
- [ ] Cảm giác travel time (320px/s) — đã tay chưa?
- [ ] Nhịp 30s/block + khởi điểm 3 — có đói gỗ không?
- [ ] Random lane — vui hay ức chế?

---

## 5. M3 — Nước dâng + Thắng/Thua ✅ (scope chốt với user 2026-07-03)

- [x] `WaterSystem`: thanh nước dâng đều theo `waterSecondsToFull` → đầy = LOSE (chỉ UI bar, KHÔNG visual nước dâng trong world)
- [x] 🆕 **Dòng chảy theo travel time (v2)**: level data `drift: {travelSecStart, travelSecMin}` (Thẳng 8→4s, Chữ U 6.4→3.2s — x2 theo playtest 2026-07-03) — `WaterSystem` nội suy `travelSec` theo mực nước, suy `world.driftSpeedPx = driftRefDist/travelSec` dùng CHUNG mọi obstacle (bỏ `speedPx`/`rockFallSpeedPx`/`logFallSpeedPx`/`FLOW_FACTOR_MAX`); texture cuộn theo `flowFactor = start/travelSec` qua `flowTime` tích phân; M4 obstacle kế thừa
- [x] Màn hình WIN/LOSE + nút **Chơi lại** (restart tại chỗ — reset sạch level qua `loadLevel`, không reload trang); WIN thêm nút **Màn tiếp** (đang ở level cuối → load lại level cuối)
- [x] WIN/LOSE: khóa TOÀN BỘ input (trừ nút trên overlay); camera đang pan chỗ khác → tự kéo mượt về vùng sông chính (`x = forestW`)
- [x] Điều kiện thua "hải ly rơi nước" (stub cờ `beaverDrowned` — test qua debug console; trigger thật = đá phá block, M4)
- [x] Hardening theo review đối kháng: (1) race WIN/LOSE nổ giữa lúc đang nhấn — chốt state tại pointerdown, đổi state → nuốt tap; (2) `inputCooldown` 0.3s sau restart/next chặn double-tap lọt lệnh xuống world; (3) AssetStore dedupe theo path (3 key nước = 1 bitmap); (4) vạch mặt nước clamp khi fill < 3px
- [x] Verify: smoke 44/44 · E2E browser PointerEvent thật (LOSE/restart/next/race/double-tap/khóa input/camera return)
- ~~Anim hải ly thợ khai thác chi tiết hơn~~ — BỎ (chốt: chờ asset thật, không làm graybox)

### M3 — chờ playtest feedback (người dùng)
- [ ] `waterSecondsToFull` 90s/120s — quá gắt hay quá lỏng?
- [ ] Dòng chảy max 2x lúc nước đầy — cảm nhận được không? (`FLOW_FACTOR_MAX` tunable)

## 6. M4 — Obstacle (đá + gỗ trôi) ✅

- [x] Spawn theo `schedule` (§D6: `tSec` = lúc bắt đầu trôi; hết danh sách → lặp entry cuối mỗi `repeatIntervalSec` 4s giữ áp lực) + **telegraph** nhấp nháy đỉnh lane 1.2s trước — `ObstacleSystem`, state trong `world.obstacleState` (restart tự sạch)
- [x] **Đá lớn**: va block mặt trước (row occupied NHỎ NHẤT — Ô ẢO row âm tiêu hao TRƯỚC = lá chắn); phá block (đang lấp slot → X−1); phá block hải ly ĐANG ĐỨNG → `beaverDrowned` → **LOSE ngay**; lane hoàn toàn hở → lọt thác vô hại; vận tốc = `driftSpeedPx` chung của sông (M3.1)
- [x] 🆕 **Rock targeting**: đá nhắm lane nhiều block nhất (`_pickRockLane`), lane KHÓA lúc telegraph — lane data chỉ là fallback khi sông trống; block mọc thêm trong 1.2s lead không đổi mục tiêu
- [x] **DAMAGE=1** prototype (đá phá 1 block rồi vỡ) — ⏳ đá phá xuyên N block: định hướng, số liệu tune sau
- [x] **Gỗ trôi (obstacle)** = spawn `FloatingLog` — CHUNG 100% cơ chế gỗ thả kho (neo convert Block + auto slot-fill / lane hở mất; KHÔNG cộng/trừ kho)
- [x] Render Layer 8: đá graybox + telegraph "!" nhấp nháy 4Hz + vòng smash đỏ khi phá (juice thật để M5)
- [x] Verify: smoke **67/67** (schedule/telegraph timing · log obstacle neo slot-fill · rock lane hở vô hại · lá chắn ô ảo trước · X−1 · phá block đang đứng = LOSE ngay) · browser E2E: telegraph→spawn→neo đúng nhịp, console sạch

### M4 — chờ playtest feedback (người dùng)
- [ ] Lịch spawn Chapter 1 (gỗ:đá ~2:1, lặp 4s) — áp lực vừa chưa?
- [ ] Đá phá block có cần cửa sổ né (nhặt block chạy) rộng hơn không? (telegraph 1.2s + travel time đá ~8s)

## 7. M5 — Polish / Juice 🔶 (code xong 2026-07-03; chờ asset thật)

- [x] Feedback thị giác (layer `fx.js` + `world.effects`): **rung màn** khi đá văng block · **splash** bọt 2 vòng khi gỗ/đá rơi thác + nhún nhỏ khi gỗ neo · **burst xanh** nổi bật khi TRÚNG slot (neo/đặt) · **pop** khi nhặt/đặt tường tạm · **pulse viền đỏ** thanh nước khi ≥80%
- [x] Hook âm thanh `core/Sfx.js` — 11 event (release/anchor/slotFill/logLost/pickup/placeWall/rockSmash/telegraph/woodPlus/win/lose) gọi đúng điểm từ các system; prototype log verbose, đổ file vào `assets/audio/` + khai map `FILES` là kêu, KHÔNG sửa call site
- [x] Chuyển tiếp mượt: fade-in đen 0.4s mỗi lần vào level (load/restart/màn tiếp)
- [x] Rà asset-swap: mọi vẽ qua `drawSprite`/`drawTiledSprite` ✅ (nước + hải ly đã chứng minh swap sống)
- [x] Thay graybox → art thật (2026-07-03, mapping chốt với user — xem asset-manifest.md §MAPPING THỰC TẾ): nước · bờ 2 bên (Ground.png, phải flip, neo mép đá vào mép sông) · cây + cỏ (cắt sheet) · TRẠI KHAI THÁC = cây chu trình theo đồng hồ 30s (nguyên→gặm→đổ→gốc+khúc gỗ) + 1 hải ly thợ gặm (tái dụng beaver_crawl) · block/gỗ trôi/trên lưng = wood.png (1 ảnh 3 vai) · đá = rock.png
- [ ] Art còn thiếu (giữ graybox): telegraph, nút kho, panel tiến độ, panel WIN/LOSE
- [ ] File âm thanh thật — CHỜ USER CẤP (map vào `Sfx.js FILES`)
- [x] Verify: smoke **73/73** (fade tick · burst slot-fill · splash mất gỗ · shake khi smash · sfx log đúng điểm gọi) · browser frame đúng khoảnh khắc smash: vòng đỏ + block biến mất + màn rung · console sạch

---

## 8. Việc nền (song song, chưa chạm)

- [ ] Đóng gói APK (skill html-game-to-android-apk) — sau khi core vui
- [ ] Port Unity (bản production) — sau prototype
- [ ] Bổ sung 18 màn còn lại của MVP (20 màn đầu)
- [ ] Redesign counterplay đầy đủ cho bom nước & thiết kế xoáy nước

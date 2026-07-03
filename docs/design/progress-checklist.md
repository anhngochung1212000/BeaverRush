# BEAVERRUSH — Progress Checklist

> Cập nhật: 2026-07-03. Theo dõi: đã làm ✅ · đang/chưa làm ⬜ · để sau (ngoài scope hiện tại) ⏳.
> Tài liệu liên quan: [GDD v3.1](game-design-document.md) · [Prototype Plan v2.1](prototype-plan.md) · [Concept Analysis](concept-analysis.md)

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
| **M3 — Nước dâng + Thắng/Thua** | ⬜ Chưa làm (kế tiếp) |
| **M4 — Obstacle (đá + gỗ trôi)** | ⬜ Chưa làm |
| **M5 — Polish / Juice** | ⬜ Chưa làm |

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
- [x] Camera pan ngang có limit; drag nền = camera, tap = lệnh; không auto-return
- [x] Obstacle MVP đá + gỗ trôi; đá văng block/gỗ (định hướng có DAMAGE); gỗ trôi bị chặn → neo thành block
- [x] Chi phí: mọi khối = 1 bó; prototype chỉ dùng 1x1

### Còn mở (⏳ sẽ tune/chốt sau)
- [ ] Cơ chế **xoáy nước** (chưa thiết kế)
- [ ] Số liệu tuning: nhịp 30s/block? tốc độ gỗ trôi 350px/s? tốc độ bò 320px/s? forestW 450? tốc độ nước theo chapter?
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
- [x] **Nhặt (relocate)**: click block bất kỳ (trừ block đang đứng) → hải ly BFS bò tới → nhặt (nhặt block đang lấp slot → X−1)
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

## 5. M3 — Nước dâng + Thắng/Thua ⬜ (KẾ TIẾP)

- [ ] `WaterSystem`: thanh nước dâng đều theo `waterSecondsToFull` → đầy = LOSE
- [ ] Màn hình WIN / LOSE + nút restart (chuyển restart từ M5 lên)
- [ ] Điều kiện thua "hải ly rơi nước" (stub — đá chưa có tới M4)
- [ ] Anim hải ly thợ khai thác chi tiết hơn (nếu còn thời gian)

## 6. M4 — Obstacle (đá + gỗ trôi) ⬜

- [ ] Spawn obstacle theo `schedule` từng lane + telegraph 1.2s
- [ ] **Đá lớn**: va block mặt trước (smallest row, kể cả ô ảo) → văng block; phá block hải ly đang đứng → **thua ngay**
- [ ] Định hướng **DAMAGE**: đá phá xuyên N block (số liệu tune)
- [ ] **Gỗ trôi (obstacle)**: bị chặn → neo thành block (như gỗ thả kho); lane hở → trôi qua
- [ ] Verify: đá phá đúng block mặt trước; lá chắn ô ảo tiêu hao trước; rơi nước = thua

## 7. M5 — Polish / Juice ⬜

- [ ] Feedback: glow slot đúng, rung khi đá va, bọt nước thác, hiệu ứng nhặt/đặt
- [ ] Hook âm thanh (thả/neo/nhặt/đá va/thắng/thua)
- [ ] Thay graybox → art thật (theo asset manifest §C của plan)
- [ ] Chuyển tiếp mượt giữa các màn

---

## 8. Việc nền (song song, chưa chạm)

- [ ] Đóng gói APK (skill html-game-to-android-apk) — sau khi core vui
- [ ] Port Unity (bản production) — sau prototype
- [ ] Bổ sung 18 màn còn lại của MVP (20 màn đầu)
- [ ] Redesign counterplay đầy đủ cho bom nước & thiết kế xoáy nước

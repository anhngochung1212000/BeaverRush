## Asset Manifest (người dùng cung cấp)

> **Scope:** CHỈ prototype core loop + 2 obstacle (đá lớn, khúc gỗ trôi). KHÔNG liệt kê bom nước / xoáy nước / tools (búa, khiên, đóng băng, hoàn tác) / ném đá / skill / kinh tế / skin.
> **Canvas mục tiêu:** Portrait ~**1080 × 1920** (scale-to-fit). Tất cả px size dưới đây tính theo canvas gốc 1080×1920 (1x).
> **Nguyên tắc chung:** PNG nền trong suốt, silhouette rõ, style 2D cartoon (xanh sông / nâu gỗ / xanh rêu / xám đá). Trước khi có art thật, game chạy bằng **GRAYBOX** = hình khối màu + label chữ (đúng key). Có **asset-swap layer**: chỉ cần đổi file theo đúng key/filename là thay được graybox bằng art thật, không sửa code.

---

### 1. Hải Ly Builder (nhân vật chính — 1 con duy nhất)

Chỉ liệt kê state trong prototype scope: idle, crawl (bò di chuyển), build (đặt gỗ), pickup (thu gỗ vào lưng), win. **KHÔNG** có throw/repair/skill/scared.

| Key / filename | State & frames | Kích thước px (1x) | Format | Graybox placeholder |
|---|---|---|---|---|
| `beaver_idle_01..04.png` | Idle đứng thẳng, thở nhẹ — 4 frame loop | ~140 × 180 mỗi frame | PNG trong / spritesheet | Rect **nâu sẫm** `#6B4A2B`, bo góc, label "BEAVER" + chấm vàng (mũ) trên đỉnh |
| `beaver_crawl_01..06.png` | Bò 4 chân khi di chuyển — 4–6 frame loop | ~160 × 140 mỗi frame | Spritesheet ngang | Rect nâu **nằm thấp/dẹt** `#6B4A2B`, label "CRAWL", có mũi tên nhỏ chỉ hướng bò |
| `beaver_build_01..05.png` | Đứng dậy + hạ bó gỗ xuống ô — 4–5 frame, chơi 1 lần | ~150 × 190 mỗi frame | Spritesheet | Rect nâu, label "BUILD", flash viền trắng ở frame đặt |
| `beaver_pickup_01..05.png` | Cúi nhặt block + vác lên lưng — 4–5 frame, chơi 1 lần | ~150 × 190 mỗi frame | Spritesheet | Rect nâu, label "PICKUP", có ô nâu nhỏ (bó gỗ) trên lưng |
| `beaver_carry_01..04.png` | Idle/di chuyển **khi đang vác** 1 bó trên lưng (biến thể crawl có gỗ) — 4 frame | ~160 × 150 mỗi frame | Spritesheet | Rect nâu + ô gỗ nhỏ trên lưng, label "CARRY" |
| `beaver_win_01..06.png` | Vẫy tay ăn mừng — 4–6 frame | ~150 × 200 mỗi frame | Spritesheet | Rect nâu **nhấp nháy vàng**, label "WIN 🎉" |

> Hướng nhìn tối thiểu prototype: dùng **1 hướng (side / 3-4 front)** cho crawl là đủ; flip ngang bằng code khi bò trái/phải. Turnaround đầy đủ ngoài scope.

---

### 2. Hải Ly Thợ (lumberjack — rừng 2 bên bờ, sản xuất gỗ)

Nhóm nhỏ ở 2 bờ trái/phải. Chỉ cần idle + chop loop (mỗi X giây +1 bó vào kho). Không di chuyển, không tương tác kéo-thả.

| Key / filename | State & frames | Kích thước px (1x) | Format | Graybox placeholder |
|---|---|---|---|---|
| `lumberjack_idle_01..03.png` | Đứng nghỉ giữa 2 nhịp chặt — 2–3 frame loop | ~90 × 120 mỗi frame | Spritesheet | Rect nâu nhỏ `#7A5230`, label "LJ", vạch trắng (rìu) bên hông |
| `lumberjack_chop_01..06.png` | Vung rìu chặt gỗ — 4–6 frame loop, đồng bộ nhịp sản xuất | ~90 × 120 mỗi frame | Spritesheet | Rect nâu nhỏ, label "CHOP", vạch trắng vung lên/xuống theo frame |
| `wood_popup.png` (opt) | Icon "+1 bó" bay lên khi ra gỗ | ~48 × 48 | PNG trong | Ô nâu nhỏ + chữ "+1" trắng |

> Prototype: 1 cụm bên trái + 1 cụm bên phải, mỗi cụm 2–3 con lặp cùng anim (không cần biến thể riêng).

---

### 3. Bó Gỗ (block xây đập — theo blueprint)

Gỗ **nằm ngang, rời, KHÔNG buộc dây**, mặt gỗ không đều, có mảng rêu. Chiều rộng map theo lane: **1x1 = trọn 1 lane**. Cần bản **placed** (đã đặt trên đập). Bản **carried** (trên lưng hải ly) có thể tái dùng chung 1x1 thu nhỏ — không bắt buộc riêng.

Giả định 1 lane ≈ **200 px** rộng, 1 hàng ≈ **120 px** cao (5 lane ≈ 1000 px, chừa lề). Điều chỉnh theo grid thực tế khi có art.

| Key / filename | Kích thước khối | Kích thước px (1x) | Format | Graybox placeholder |
|---|---|---|---|---|
| `log_1x1.png` | 1 lane × 1 hàng | ~200 × 120 | PNG trong | Rect **nâu gỗ** `#8B5A2B`, viền đậm, vài vạch ngang (thớ gỗ), label "1×1" |
| `log_1x2.png` | 1 lane × 2 hàng | ~200 × 240 | PNG trong | Rect nâu cao, label "1×2" |
| `log_2x1.png` | 2 lane × 1 hàng | ~400 × 120 | PNG trong | Rect nâu rộng, label "2×1" |
| `log_2x2.png` | 2 lane × 2 hàng | ~400 × 240 | PNG trong | Rect nâu lớn, label "2×2" |
| `log_carried.png` (opt) | Bó trên lưng hải ly | ~80 × 60 | PNG trong | Ô nâu nhỏ, label "LOG" |

> **State trực quan xử lý bằng overlay/tint ở code**, KHÔNG cần file riêng: (a) đặt đúng blueprint → glow xanh (§7); (b) tường tạm sai ô → không glow, giữ nguyên tint; (c) preview khi kéo → tint mờ nửa trong.

---

### 4. Obstacle (CHỈ 2 loại trong prototype)

Phải nhìn **khác hẳn** bó gỗ xây đập. Trôi theo lane từ trên xuống.

| Key / filename | State & frames | Kích thước px (1x) | Format | Graybox placeholder |
|---|---|---|---|---|
| `rock_big.png` | Đá lớn — tĩnh (xoay nhẹ bằng code khi trôi) | ~180 × 180 | PNG trong | Ô tròn/đa giác **xám** `#7F7F7F`, viền đậm, label "ĐÁ" |
| `rock_impact_01..04.png` (opt) | Bụi/va chạm khi húc văng block | ~200 × 200 | Spritesheet | Vòng xám mờ toả ra, label "HIT" |
| `log_drift.png` | Khúc gỗ trôi — **1 khúc đơn, dọc/chéo theo dòng**, khác block xây | ~120 × 90 | PNG trong | Ô **nâu vàng nhạt** `#C89B5C` (khác nâu block), bo tròn 2 đầu, label "GỖ TRÔI" |
| `log_reward_fx.png` (opt) | Sparkle "+1 gỗ" khi chặn được khúc gỗ | ~64 × 64 | PNG trong | Chấm vàng + "+1", label reward |

> Bắt buộc phân biệt màu: **block xây = nâu đậm** `#8B5A2B`; **khúc gỗ trôi = nâu vàng nhạt** `#C89B5C` + hình nhỏ hơn, bo tròn.

---

### 5. Môi trường (portrait background)

| Key / filename | Nội dung | Kích thước px (1x) | Format | Graybox placeholder |
|---|---|---|---|---|
| `bg_river.png` | Nền sông chảy dọc top→down (vùng giữa) | 1080 × 1920 (hoặc tile dọc ~1080×512) | PNG (opaque) | Fill **xanh sông** `#3E7CB1` toàn màn |
| `lane_line.png` | Đường kẻ mờ ranh giới lane (5 lane = 4 đường) | ~4 × 1200 | PNG trong (tile dọc) | Line trắng alpha ~20%, vẽ bằng code cũng được |
| `flow_arrow.png` | Mũi tên chỉ hướng nước chảy xuống | ~40 × 60 | PNG trong | Tam giác trắng mờ chỉ xuống, label "▼" |
| `bank_forest_left.png` | Bờ rừng trái (chứa hải ly thợ) | ~200 × 1920 | PNG trong | Cột dọc **xanh rêu** `#4E7A3A`, label "RỪNG L" |
| `bank_forest_right.png` | Bờ rừng phải | ~200 × 1920 | PNG trong | Cột dọc xanh rêu, label "RỪNG R" |
| `waterfall.png` | Thác nước đổ dưới khe đập | ~1000 × 300 | PNG trong (tile ngang) | Dải **trắng-xanh** gradient, label "THÁC" |
| `foam_01..04.png` | Bọt/sóng dưới thác — 4 frame loop | ~1000 × 120 | Spritesheet | Dải trắng lấm tấm, label "FOAM" |
| `dam_baseline.png` (opt) | Nền đập ngang giữa màn (chỗ đặt block) | ~1000 × 40 | PNG trong | Line nâu đậm ngang, label "DAM" |

---

### 6. Blueprint / Slot (ghost đích)

| Key / filename | Nội dung | Kích thước px (1x) | Format | Graybox placeholder |
|---|---|---|---|---|
| `slot_ghost_1x1.png` | Ghost ô blueprint size 1x1 | ~200 × 120 | PNG trong | Rect **viền đứt trắng**, fill alpha ~15%, label "1×1" |
| `slot_ghost_1x2.png` | Ghost 1x2 | ~200 × 240 | PNG trong | Như trên, label "1×2" |
| `slot_ghost_2x1.png` | Ghost 2x1 | ~400 × 120 | PNG trong | Như trên, label "2×1" |
| `slot_ghost_2x2.png` | Ghost 2x2 | ~400 × 240 | PNG trong | Như trên, label "2×2" |

> Có thể render toàn bộ ghost bằng code (đường đứt + label) — file chỉ cần khi thay bằng art đẹp.

---

### 7. UI (HUD portrait)

| Key / filename | Nội dung | Kích thước px (1x) | Format | Graybox placeholder |
|---|---|---|---|---|
| `ui_progress_frame.png` | Khung tiến độ `X / Y` (top center) | ~360 × 90 | PNG trong (9-slice ok) | Rect bo góc nền tối, label "12/25" trắng |
| `ui_water_bar_frame.png` | Khung thanh mực nước (đồng hồ thua, dọc bên cạnh) | ~60 × 900 | PNG trong (9-slice) | Rect viền trắng rỗng, label "WATER" |
| `ui_water_bar_fill.png` | Phần nước dâng trong thanh | ~52 × 892 (crop theo %) | PNG trong (tile dọc) | Fill **xanh dương** `#2E6FB0` dâng từ dưới lên |
| `ui_stock_frame.png` | Khung kho vật liệu (bottom, số bó gỗ) | ~300 × 110 | PNG trong (9-slice) | Rect bo góc + ô nâu + số "×5", label "STOCK" |
| `ui_btn_pause.png` | Nút tạm dừng (top corner) | ~90 × 90 | PNG trong | Vòng tròn xám + "II", label "PAUSE" |
| `ui_drag_highlight.png` | Ô đích sáng khi kéo-thả (hợp lệ) | ~200 × 120 (scale theo size) | PNG trong | Rect viền **trắng sáng** dày, glow nhẹ |
| `ui_danger_lane.png` | Cảnh báo lane sắp có obstacle | ~200 × 1200 | PNG trong (tile dọc) | Cột **đỏ mờ** nhấp nháy `#E23B3B` alpha ~25%, label "!" |
| `ui_correct_glow.png` | Glow xanh khi đặt đúng slot blueprint | ~200 × 120 (scale theo size) | PNG trong | Viền/đổ bóng **xanh lá** `#3FBF4A` quanh block, label "OK" |
| `ui_panel_win.png` | Panel THẮNG | ~700 × 500 | PNG trong (9-slice) | Rect nền sáng, label "THẮNG!" + nút "Tiếp" |
| `ui_panel_lose.png` | Panel THUA (nước đầy) | ~700 × 500 | PNG trong (9-slice) | Rect nền tối, label "THUA" + nút "Chơi lại" |

> `ui_correct_glow` và `ui_drag_highlight` nên là **overlay** dùng chung cho mọi size (scale theo khối), không cần 1 file/size.

---

### 8. Audio (OPTIONAL — đánh dấu tùy chọn, prototype có thể bỏ)

| Key / filename | Sự kiện | Format | Graybox thay thế |
|---|---|---|---|
| `sfx_place.wav` (opt) | Đặt block xong | WAV/OGG mono | (im lặng / beep code) |
| `sfx_pickup.wav` (opt) | Thu block vào lưng | WAV/OGG | beep |
| `sfx_rock_hit.wav` (opt) | Đá húc văng block | WAV/OGG | thud |
| `sfx_log_reward.wav` (opt) | Chặn khúc gỗ → +1 gỗ | WAV/OGG | ding |
| `sfx_water_rise_loop.wav` (opt) | Loop nước dâng nền | WAV/OGG loop | (tắt) |
| `sfx_win.wav` (opt) | Thắng màn | WAV/OGG | jingle |
| `sfx_lose.wav` (opt) | Thua màn | WAV/OGG | buzz |

---

### 9. Quy ước bàn giao (delivery format)

- **Format:** PNG **nền trong suốt** (RGBA) cho mọi sprite/UI; nền/opaque riêng cho `bg_river`. Audio: WAV hoặc OGG.
- **@2x:** cung cấp thêm bản **@2x** cho màn hình mật độ cao (vd `log_1x1@2x.png` = gấp đôi px ở bảng trên). Bản 1x là mặc định; code tự chọn theo devicePixelRatio.
- **Đặt tên:** `snake_case`, chữ thường, không dấu, không khoảng trắng. Animation đánh số 2 chữ số bắt đầu từ `_01` (vd `beaver_crawl_01.png`). Spritesheet kèm file `.json` mô tả frame (name, x, y, w, h) hoặc grid đều để code cắt.
- **Cấu trúc thư mục đề xuất:**
  ```
  assets/
    beaver/        (idle, crawl, build, pickup, carry, win)
    lumberjack/    (idle, chop, wood_popup)
    blocks/        (log_1x1..2x2, log_carried)
    obstacles/     (rock_big, rock_impact, log_drift, log_reward_fx)
    env/           (bg_river, lane_line, flow_arrow, bank_forest_*, waterfall, foam, dam_baseline)
    blueprint/     (slot_ghost_*)
    ui/            (progress, water_bar_*, stock, btn_pause, drag_highlight, danger_lane, correct_glow, panel_win, panel_lose)
    audio/         (sfx_*)   ← optional
  ```
- **Asset-swap layer:** giữ đúng **key/filename** ở các bảng trên. Code load theo key; graybox là fallback tự vẽ khi thiếu file → thả art thật vào đúng đường dẫn là hiển thị ngay, không sửa logic.
- **Anchor/pivot:** nhân vật & block neo ở **đáy-giữa** (bottom-center) để đặt đúng lane; obstacle neo **tâm** (center). Ghi chú pivot lệch chuẩn kèm theo file nếu có.
- **Portable sang Unity:** giữ sprite rời + spritesheet + json để sau import thẳng vào Unity (Sprite / SpriteAtlas); tránh nướng hiệu ứng vào bg.

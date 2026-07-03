## Milestone & Task Breakdown

> **Nguyên tắc:** Mỗi milestone (M) **chạy được độc lập trong trình duyệt** (mở `index.html` hoặc static server) và **kế thừa** milestone trước. Visual là **graybox** (rect có màu + nhãn chữ), tách **asset-swap layer** để sau này thay art thật. Code **vanilla JS + Canvas**, cấu trúc rõ để port sang **Unity C#** về sau (data-driven, tách render / logic / input).
>
> **Ký hiệu:** 🎯 Goal · ✅ Definition of Done (acceptance) · ▶️ Cách chạy & kiểm tra thủ công.
>
> **Target:** portrait ~1080×1920, scale-to-fit. Input: pointer + touch (kéo = ra lệnh, chạm block đã đặt = thu hồi).

---

### M0 — Setup & Canvas khung dọc

🎯 **Goal:** Có bộ khung dự án chạy được, canvas rỗng scale đúng tỉ lệ portrait trên mọi kích thước cửa sổ.

**Task list (theo thứ tự):**
1. Tạo skeleton repo: `index.html`, `styles.css`, thư mục `src/`.
2. `index.html`: 1 thẻ `<canvas id="game">`, nạp `src/main.js` dạng ES module.
3. Tạo `.claude/launch.json` để chạy static server (vd `npx serve` hoặc `python -m http.server`), cổng cố định (vd 8080).
4. `src/core/GameLoop.js`: vòng lặp `requestAnimationFrame` với `update(dt)` + `render(ctx)` rỗng, đo `dt` (delta time giây).
5. `src/core/Viewport.js`: tính scale letterbox từ khung logic **1080×1920** → kích thước cửa sổ thực; căn giữa, xử lý `devicePixelRatio`; hàm `screenToLogic(x,y)` cho input sau này.
6. `src/config/GameConfig.js`: hằng số toàn cục (LOGIC_W=1080, LOGIC_H=1920, LANES=5) — nguồn số liệu duy nhất.
7. `src/render/Assets.js`: **asset-swap layer** — hàm `drawSprite(ctx, key, rect)` hiện vẽ rect màu + nhãn; sau này chỉ đổi thân hàm để vẽ ảnh thật.
8. Vẽ nền graybox: chữ nhật sông (xanh) full khung logic + viền letterbox (đen) để thấy rõ vùng chơi.

✅ **Definition of Done:**
- Mở trong trình duyệt thấy canvas màu sông, giữ **đúng tỉ lệ dọc 1080×1920**, có letterbox khi cửa sổ sai tỉ lệ.
- Resize / xoay cửa sổ → vùng chơi luôn vừa khít, không méo, không tràn.
- FPS ổn định, không lỗi console.

▶️ **Chạy & kiểm tra:**
- Chạy static server qua `launch.json`, mở `http://localhost:8080`.
- Kéo co giãn cửa sổ trình duyệt: vùng sông giữ tỉ lệ, luôn căn giữa.
- Mở DevTools Console: không có error.

---

### M1 — Board & Blueprint (tĩnh)

🎯 **Goal:** Vẽ được sân chơi: grid 5 lane × N hàng, đường lane mờ, mũi tên hướng nước, blueprint ghost (slot + size), UI tiến độ `X/Y`, thanh mực nước (tĩnh). Chưa có tương tác.

**Task list:**
1. `src/config/LevelData.js`: định nghĩa **1 level mẫu** dạng data thuần: `rows`, `waterRiseSeconds`, `woodPerSeconds`, `startWood`, và `blueprint = [{col,row,w,h}]` (size 1x1/1x2/2x1/2x2). Đây là format sẽ port sang Unity.
2. `src/core/Grid.js`: hàm `cellRect(col,row)` → toạ độ logic; đập nằm ngang giữa màn hình; grid rộng đúng 5 lane.
3. `src/render/BoardRenderer.js`: vẽ 5 đường lane **mờ**, mũi tên hướng nước (trên→dưới), vùng dưới đập (nước liền, không kẻ lane) + graybox thác.
4. `src/render/BlueprintRenderer.js`: vẽ **ghost slot** cho từng block blueprint đúng vị trí + đúng kích thước theo lane (1x1 = trọn 1 lane), có nhãn size.
5. `src/ui/Hud.js`: **Top-center** tên màn + `X/Y` (đếm theo **khối**, khởi tạo `0/tổng số block blueprint`); **Left** panel mục tiêu.
6. `src/ui/WaterBar.js`: thanh mực nước vẽ ở mức tĩnh (vd 0%) — chỉ layout, chưa dâng.
7. Nối tất cả vào `render()` của GameLoop.

✅ **Definition of Done:**
- Thấy grid 5 lane × N hàng với đường lane mờ + mũi tên hướng nước.
- Blueprint hiển thị đúng số slot, **đúng vị trí và đúng size** (block 2x1 rộng 2 lane, 1x2 cao 2 hàng…).
- HUD hiện tên màn + `0/Y` với **Y = tổng số block** (không phải số ô lưới).
- Thanh mực nước hiển thị đúng vị trí layout (giá trị tĩnh).

▶️ **Chạy & kiểm tra:**
- Reload trang: đối chiếu số slot ghost trên màn = số phần tử `blueprint` trong `LevelData.js`.
- Đổi 1 block trong `LevelData.js` (vd 1x1 → 2x1) rồi reload: ghost phải rộng ra 2 lane, `Y` cập nhật đúng.

---

### M2 — Placement + Beaver travel (core loop, win detection)

🎯 **Goal:** Chơi được vòng lặp cốt lõi (chưa có timer/obstacle): kho gỗ, kéo-thả = ra lệnh, **1 hải ly bò tới** (travel time) rồi mới đặt, snap grid, phân biệt đúng/sai blueprint (glow xanh vs tường tạm), chạm để thu hồi, tiến độ đếm theo khối, **thắng ngay khi đủ blueprint**.

**Task list:**
1. `src/game/Stock.js`: kho gỗ, `count` từ `startWood`; API `take()` / `add()`. Bottom panel hiển thị số bó gỗ + dòng hướng dẫn.
2. `src/game/Board.js` (state đập): map `blockAt(col,row)`; block lưu `{col,row,w,h,onBlueprint}`. Hàm `canPlace(col,row,w,h)` (trong biên, không chồng, không tràn lane).
3. `src/input/DragController.js`: pointerdown trên palette → tạo **ghost đang kéo** bám con trỏ; pointerup trên grid → **snap** vào cell gần nhất → phát **command** (không đặt ngay). Dùng `screenToLogic` từ Viewport.
4. `src/game/Beaver.js`: state machine `idle → move → build → pickup`. Nhận 1 command tại một thời điểm — **không có hàng đợi** (đang bận thì bỏ / chặn command mới). `move`: nội suy vị trí theo `dt`, **thời gian tỉ lệ khoảng cách** (bò xa = lâu hơn). Tới nơi → `build` → đặt block vào Board + trừ kho.
5. **Phân loại khi đặt:** so với blueprint (đúng col/row/size) → `onBlueprint=true`, glow xanh, +1 tiến độ; ngược lại → **tường tạm** (tồn tại, chặn được nhưng không tính tiến độ, không glow).
6. **Thu hồi:** pointer tap lên block đã đặt (khi hải ly rảnh) → beaver `move` tới → `pickup` → trả gỗ về kho, xoá block, cập nhật tiến độ nếu block đó từng tính đúng.
7. `src/game/Progress.js`: đếm số block `onBlueprint` đang có mặt trên đập → `X/Y`. **Thắng ngay** khi `X === Y` → hiện overlay WIN tạm.
8. Render: beaver graybox (đổi màu theo state), block đã đặt (glow xanh nếu đúng, màu trung tính nếu tường tạm), ghost đang kéo bán trong suốt.

✅ **Definition of Done:**
- Kéo bó gỗ thả vào ô → hải ly **bò** từ vị trí hiện tại tới đích rồi mới đặt; thả xa **thấy rõ lâu hơn** thả gần.
- Đang bò dở **không nhận** command mới (đặt xong mới nhận lệnh kế).
- Đặt đúng slot → **glow xanh + `X` tăng**; đặt ngoài blueprint → block tồn tại, **không glow, không tăng tiến độ**.
- Chạm block đã đặt → hải ly tới thu hồi, **gỗ +1 về kho**, block biến mất, tiến độ giảm nếu cần.
- Kho gỗ giảm khi đặt, tăng khi thu hồi; hết gỗ thì không ra lệnh đặt được.
- Đặt đủ toàn bộ blueprint → **màn hình WIN xuất hiện tức thì**.

▶️ **Chạy & kiểm tra:**
- Đặt 1 block sát hải ly rồi 1 block xa: bấm giờ mắt — chuyến xa lâu hơn.
- Thả 1 block **ngoài** ghost: xác nhận không glow, `X` không đổi.
- Thu hồi block đúng: `X` giảm 1, kho +1.
- Lấp hết ghost → WIN hiện ngay dù chưa có timer.

---

### M3 — Wood production + Water timer + Win/Lose

🎯 **Goal:** Có nhịp sinh tồn: khu rừng 2 bên **sản xuất +1 gỗ mỗi X giây**, **mực nước dâng đều theo thời gian**, đầy = **THUA**, đủ blueprint = **THẮNG** (nước dừng ngay). Có màn Win/Lose.

**Task list:**
1. `src/game/WoodProducer.js`: đếm giờ theo `dt`; mỗi `woodPerSeconds` giây → `Stock.add(1)`. Vẽ **rừng graybox 2 bên** + nhóm hải ly thợ (rect + nhãn). Hết gỗ **không phải thua** (gỗ tự hồi).
2. `src/game/WaterLevel.js`: `level` tăng đều từ 0→1 theo `waterRiseSeconds`; nối vào `WaterBar` (M1) để thanh dâng theo thời gian thực.
3. `src/core/GameState.js`: máy trạng thái `PLAYING / WIN / LOSE`. WIN khi `Progress.X===Y` (từ M2) → **freeze nước & beaver**. LOSE khi `WaterLevel.level >= 1`.
4. `src/ui/EndScreen.js`: overlay WIN (vẫy tay/ nhãn "THẮNG") và LOSE ("Nước ngập") — chưa cần nút restart (để M5), nhưng có thể reload để chơi lại.
5. Chặn input khi không ở trạng thái `PLAYING`.

✅ **Definition of Done:**
- Đứng yên không làm gì: thanh nước dâng đều; tới khi đầy → **màn LOSE**.
- Kho gỗ **tự tăng +1 mỗi X giây** đúng theo `woodPerSeconds`; xài hết vẫn hồi lại.
- Lấp đủ blueprint trước khi nước đầy → **màn WIN**, nước **dừng dâng** ngay.
- Ở WIN/LOSE: không kéo-thả / không thu hồi được nữa.

▶️ **Chạy & kiểm tra:**
- Đặt `waterRiseSeconds` nhỏ (vd 8s) trong LevelData, không thao tác → xác nhận LOSE khi thanh đầy.
- Quan sát kho: cứ X giây +1 gỗ (đối chiếu đồng hồ).
- Chơi thắng nhanh → WIN hiện, thanh nước ngừng tại chỗ.

---

### M4 — Obstacles (Đá lớn + Khúc gỗ trôi)

🎯 **Goal:** Sông tạo áp lực: obstacle spawn theo lane, trôi xuống, có **telegraph**. **Đá lớn** húc **văng block đầu đập** (nguyên cả block rộng nếu 2 lane) rồi biến mất; **Khúc gỗ trôi** nếu bị chặn → **+1 gỗ**, nếu lane hở → trôi lọt, không hại.

**Task list:**
1. `src/config/LevelData.js`: thêm `obstacles = [{type,lane,atTime}]` (kịch bản spawn theo giờ + lane) — data-driven, **không random gây ức chế**.
2. `src/game/Obstacle.js` (base): vị trí theo lane, trôi xuống theo `dt`, phát hiện va chạm với block **ở đầu đập** trên lane đó.
3. `src/game/obstacles/Rock.js`: khi chạm block front → **văng block** khỏi đập (rơi xuống thác, block mất; nếu block rộng 2 lane bị chạm bất kỳ lane nào → **văng cả khối**, cập nhật tiến độ). Lane hở → trôi qua rồi biến mất.
4. `src/game/obstacles/DriftLog.js`: chạm block → **`Stock.add(1)`**, log tiêu biến; lane hở → trôi lọt, mất, không sát thương.
5. `src/game/ObstacleSpawner.js`: đọc kịch bản, tạo obstacle đúng `atTime`/`lane`; theo `dt`.
6. **Telegraph:** cảnh báo lane nguy hiểm trước khi obstacle tới (nhấp nháy đầu lane / icon), theo nguyên tắc "luôn báo trước".
7. Render obstacle graybox (đá = rect xám lớn, log = rect nâu) + hiệu ứng văng/nhận gỗ tối giản.

✅ **Definition of Done:**
- Obstacle trôi xuống đúng lane theo kịch bản; **có telegraph** trước khi chạm đập.
- Đá lớn chạm block đầu đập → **block văng mất**; block **2 lane** bị chạm 1 lane → **mất cả khối**, `X` cập nhật đúng.
- Đá vào **lane hở** → trôi qua, không ảnh hưởng.
- Khúc gỗ trôi bị chặn → **kho +1**; lane hở → trôi lọt, không hại.
- Bị đá phá block đúng → **tiến độ giảm**, có thể xây lại; áp lực khiến nguy cơ LOSE tăng.

▶️ **Chạy & kiểm tra:**
- Kịch bản: 1 đá lane 3, 1 log lane 1. Đặt block chặn lane 3 → thấy block văng; đặt block chặn lane 1 → thấy kho +1.
- Để lane hở với đá → đá trôi qua vô hại; với log → mất cơ hội +1.
- Đặt block 2x1 rồi cho đá vào 1 trong 2 lane → cả block biến mất, `X` giảm 1.

---

### M5 — Juice / Polish & Restart

🎯 **Goal:** Tăng cảm giác chơi bằng animation/feedback tối giản và hook SFX, có nút chơi lại. Không thêm cơ chế mới.

**Task list:**
1. Animation: beaver nhấp giữa idle/bò/đặt (đổi frame graybox), tween mượt khi bò.
2. Feedback: glow xanh mạnh hơn khi đặt đúng; **shake** nhẹ khi đá văng block; **splash** khi obstacle rơi thác; pulse thanh nước khi gần đầy.
3. `src/core/Sfx.js`: **hook SFX** (đặt gỗ / văng block / +1 gỗ / win / lose) — hiện log hoặc beep, để trống cho asset thật.
4. `src/ui/RestartButton.js`: nút Restart ở màn WIN/LOSE → reset toàn bộ state về đầu level (không reload trang).
5. Rà `Assets.js` đảm bảo **mọi vẽ đi qua asset-swap layer** để thay art thật dễ.

✅ **Definition of Done:**
- Các hành động chính đều có feedback thị giác (glow/shake/splash) và **gọi đúng hook SFX**.
- Nút Restart đưa game về trạng thái đầu (kho, nước, blueprint, obstacle) mà **không reload trang**.
- Không lỗi console; FPS ổn định khi có animation + obstacle.

▶️ **Chạy & kiểm tra:**
- Thắng/thua → bấm Restart → chơi lại sạch từ đầu.
- Cho đá văng block → thấy shake + splash + nghe/log SFX tương ứng.
- Kiểm tra swap: đổi `drawSprite` 1 key sang màu khác → toàn bộ instance đổi theo (chứng minh layer hoạt động).

---

### Ghi chú kiến trúc xuyên suốt (chuẩn bị port Unity)

- **Tách 3 tầng:** logic (`game/`, `core/`) ↔ render (`render/`, `ui/`) ↔ input (`input/`). Logic không gọi trực tiếp Canvas API.
- **Data-driven:** level/blueprint/obstacle nằm trong `config/*.js` dạng object thuần → dễ chuyển thành ScriptableObject/JSON trong Unity.
- **Đơn vị logic 1080×1920** cố định; Viewport lo scale → toạ độ độc lập độ phân giải (giống world-space Unity).
- **Asset-swap layer** (`Assets.drawSprite`) là điểm duy nhất chạm graybox → thay sprite thật sau này không đụng logic.

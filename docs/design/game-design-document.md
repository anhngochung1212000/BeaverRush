# BEAVERRUSH — Game Design Document (v3)

> **Phiên bản:** v2 — chốt cơ chế gameplay cốt lõi (2026-07-02).
> **v2.1 (2026-07-02):** chốt nguồn size khối + chi phí gỗ (mọi khối = 1 bó) + storage riêng theo từng rừng.
> **v2.2 (2026-07-02):** + block tặng đầu màn + luật grid row dư (số hàng grid = hàng blueprint cần + 1).
> **v3.0 (2026-07-03):** redesign điều khiển — bỏ kéo-thả & thu hồi; tap-based: kho→thả gỗ→nhặt→ô xanh; hải ly chỉ đi trên block; camera pan; khu khai thác 30s/block.
> **v3.1 (2026-07-03):** gỗ neo = block hoàn chỉnh + tự lấp slot; nhặt-di-chuyển mọi block (relocate, không recall); ô ảo trên đập; rơi nước = thua; damage obstacle.
> **Scope:** MVP. Đã loại khỏi MVP: hệ thống kinh tế (coin/gem), skin trang phục, nâng cấp chỉ số, theme "Dung Nham", balance-tuning chi tiết.
> **Nguồn:** GDD gốc + concept art người dùng + 6 vòng hỏi-đáp chốt cơ chế.
> Ký hiệu: 🆕 = cơ chế mới bổ sung so với GDD gốc · ✅ = đã chốt · ⏳ = để lại, tôi sẽ đề xuất số liệu.

---

## 1. Tóm tắt concept

**BeaverRush** là game puzzle/action 2D **màn hình dọc (portrait)**, người chơi điều khiển một chú **hải ly builder** xây đập bằng **bó gỗ nằm ngang** theo một **blueprint** cho trước, trong khi dòng sông liên tục thả obstacle gây áp lực.

> Người chơi biết rõ mình cần xây gì, nhưng dòng sông liên tục gây áp lực bằng obstacle và mực nước dâng, buộc người chơi phải vừa xây, vừa xử lý tình huống.

**One-line pitch:** *Một chú hải ly ngốc nghếch nhưng chăm chỉ phải bò qua dòng đập gỗ, đặt từng bó gỗ đúng blueprint để chặn dòng sông trước khi obstacle cuốn trôi mọi thứ và nước dâng ngập.*

---

## 2. Core fantasy

Người chơi vào vai một chú **hải ly nhỏ, hơi ngốc nghếch nhưng chăm chỉ**, chuyên xây đập để bảo vệ khu rừng khỏi dòng nước dữ.

- Cute, thân thiện, dễ tiếp cận.
- Dòng nước có áp lực nhưng không quá đáng sợ.
- Con đập nhìn như do động vật tự xây, không quá thẳng, không giống công trình con người.
- Hải ly là nhân vật trung tâm, tạo cảm xúc và sự đáng yêu.

---

## 3. CORE GAMEPLAY LOOP (đã chốt) ✅

### 3.1 Tổng quan một màn
- **Định hướng màn hình:** ✅ **Portrait** (mobile phone dọc). Sông chảy từ trên xuống, đập nằm ngang giữa màn hình.
- **Không có phase chuẩn bị:** ✅ Obstacle trôi xuống **ngay từ đầu màn**. Người chơi vừa đọc blueprint vừa xây dưới áp lực.
- **Điều kiện thắng:** ✅ Lấp **đủ số khối của blueprint** = **THẮNG NGAY LẬP TỨC**, bất kể mực nước.
- **Điều kiện thua chính:** ✅ **Thanh mực nước dâng đều theo thời gian**; đầy thanh = THUA. (Mực nước = đồng hồ đếm ngược mềm.)

### 3.2 Vòng lặp thao tác (tap-based) 🆕✅ (v3.0 — thay hoàn toàn kéo-thả)
1. **Thả gỗ từ kho:** người chơi **click button kho gỗ** (khi bộ đếm > 0) → trừ 1 gỗ → spawn **1 khúc gỗ** ở **lane ngẫu nhiên**, trôi từ trên xuống. 🆕 v3.1: gỗ **đang trôi KHÔNG click được** (chỉ block đã tồn tại trên grid/ô ảo mới click được):
   - Bị block đập chặn → 🆕✅ v3.1: **NEO vào ô trống cuối cùng trước block chặn** và **TRỞ THÀNH BLOCK HOÀN CHỈNH** trên grid (chiếm ô, hải ly đi lên được, nhặt được, chặn obstacle). ❌ Bỏ trạng thái riêng "nổi chờ nhặt".
   - 🆕✅ **Tự lấp slot (v3.1):** nếu ô neo **trúng ô blueprint slot** → **TỰ ĐỘNG lấp slot, +1 tiến độ, glow xanh** — KHÔNG cần hải ly. Blueprint có thể tự hoàn thành một phần nhờ may mắn random lane; vai trò hải ly = **SẮP XẾP LẠI** các block neo lệch chỗ.
   - Lane kín tới row 0 → gỗ mới neo **TIẾP lên ô ảo** vùng sông phía trên đập (§3.6) — không mất gỗ.
   - Gỗ **CHỈ mất** khi lane **HOÀN TOÀN hở** (không có block nào) → trôi xuống thác. Đây là **rủi ro có chủ đích**: nên chặn nhiều lane trước khi thả.
2. **Nhặt (relocate):** 🆕✅ v3.1: click **BẤT KỲ block nào** trên grid/ô ảo (không chỉ gỗ neo — gồm cả block tặng, block đang lấp slot; TRỪ block hải ly đang đứng lên) → hải ly builder **bò** theo **mạng block** (§3.6) tới block kề → **nhặt lên** (carry). Nhặt block đang lấp slot → slot mở lại, **X giảm 1**. **Travel time vẫn là cơ chế cốt lõi** — bò xa thì lâu hơn. ✅
3. **Sức mang:** ✅ **1 khúc/lần** (có thể mở rộng "capacity theo màn" sau ⏳). Đặt xong mới nhận lệnh kế — **không có hàng đợi lệnh**.
4. **Chọn ô đặt (ô xanh):** khi đang carry, game **highlight Ô XANH** = mọi ô **TRỐNG kề cạnh (4 hướng)** với bất kỳ block nào hải ly **đi tới được** từ vị trí hiện tại (§3.6).
5. **Đặt:** click 1 ô xanh → hải ly bò tới block kề ô đó → **đặt block xuống**. Đặt trùng slot blueprint → glow xanh, **+1 tiến độ**; không trùng → **tường tạm** (đồng thời **mở rộng mạng đi được**).

### 3.3 Quy tắc đặt & tiến độ ✅
- **Đặt đúng ô blueprint** → tính vào tiến độ, block glow xanh.
- **Đặt sai ô (ngoài blueprint)** → 🆕 block **vẫn tồn tại và vẫn chặn được obstacle** (dùng làm **tường tạm** chiến thuật), nhưng **KHÔNG tính vào tiến độ**, không glow xanh — đồng thời **mở rộng mạng đi được** (§3.6). 🆕✅ v3.1: block **KHÔNG cố định** — mọi block đều **nhặt-di-chuyển được** (relocate, §3.4); chỉ là **không bao giờ quay về kho**.
- 🆕✅ **Nhặt lại block đang lấp slot (v3.1):** slot mở lại (`filled = false`), **X giảm 1** — tiến độ có thể tạm lùi khi sắp xếp lại.
- **Tiến độ đếm theo KHỐI, không theo ô lưới:** ✅ 1 khối bất kể kích thước (1x1, 1x2, 2x1, 2x2) = **1 đơn vị tiến độ**. Con số `X / Y` = số khối đã đặt đúng / tổng số khối của blueprint. (Vd `36/75`, `0/25` là số khối.)

### 3.4 Thu hồi VỀ KHO — ❌ ĐÃ BỎ · RELOCATE — 🆕✅ (v3.1, 2026-07-03)
- ❌ **Thu hồi VỀ KHO đã bỏ** (v3.0): block **không bao giờ quay trở lại bộ đếm kho**.
- 🆕✅ **RELOCATE (v3.1):** **MỌI block trên grid/ô ảo đều nhặt-di-chuyển được** — gỗ neo, block tặng, cả block đang lấp slot (nhặt lên thì slot mở lại, X giảm 1) — **TRỪ block hải ly đang đứng lên**. Quy trình: click block → hải ly bò tới nhặt (carry) → click ô xanh → đặt lại.
- **Hệ quả (đảo lại kết luận v3.0):** counterplay bom nước **"nhặt block để mở lane cho bom trôi qua" HOẠT ĐỘNG TRỞ LẠI** (nhặt block lane đó lên, cầm trên tay hoặc đặt chỗ khác) → bom nước có **2 counter** (§6.1).

### 3.5 Block tặng đầu màn 🆕✅ (chốt 2026-07-02)
- Mỗi màn **tặng sẵn các block 1x1 đặt trước** ngay từ lúc bắt đầu, nằm ở **row dư** của grid (hàng không thuộc blueprint — xem luật grid §10).
- **Mặc định: 2 block ở 2 cột giữa kề nhau (cột 2 & 3) của row dư.** Game Designer chọn được **vị trí/số lượng** qua data từng level (field `starterBlocks` trong level config).
- Bản chất là **tường tạm** (như block đặt ngoài blueprint §3.3): **chặn được obstacle**, **KHÔNG tính vào tiến độ X/Y**, 🆕 v3.1: **relocate được** như mọi block (nhặt-đặt lại, không quay về kho — §3.4).
- 🆕 **Vai trò mới (v3.0):** là **chỗ đứng xuất phát của hải ly builder** (spawn đầu màn đứng trên 1 trong 2 block tặng) + **hạt giống của mạng đi được** (§3.6) — mọi mạng block đều mọc ra từ đây.
- ⚠️ Lưu ý cho GD: **không nên đặt starter block trùng ô blueprint** — kể cả đặt trùng, nó vẫn KHÔNG lấp slot (luôn là block ngoài blueprint).

### 3.6 Di chuyển trên mạng block 🆕✅ (v3.0)
- Hải ly builder **CHỈ di chuyển trên các block đã đặt** (mạng kề 4 hướng) — **KHÔNG xuống nước, KHÔNG lên bờ**.
- **Spawn đầu màn:** đứng trên 1 trong 2 block tặng ở row dư (§3.5).
- **Luật ô xanh (khi đang carry):** highlight mọi ô **TRỐNG kề cạnh (4 hướng)** với bất kỳ block nào hải ly **đi tới được** từ vị trí hiện tại. Mỗi block đặt thêm (kể cả tường tạm) **mở rộng mạng** → mở thêm ô xanh mới.
- 🆕✅ **Ô xanh CHỈ trong grid (v3.1, rows 0..N-1):** hải ly **KHÔNG đặt chủ động** lên vùng ô ảo — ô ảo chỉ hình thành từ gỗ neo tự nhiên.
- 🆕✅ **Ô ẢO trên đập (v3.1):** lane kín tới row 0 → gỗ mới neo **TIẾP lên các Ô ẢO** vùng sông phía trên đập (row -1, -2, ... **không giới hạn**) — **không bao giờ mất gỗ khi lane có chặn**. Block ở ô ảo: **đi được, nhặt được, chặn obstacle**, nhưng **KHÔNG BAO GIỜ tính tiến độ** (nằm ngoài blueprint). Đá va vào **block mặt trước** (row nhỏ nhất) → block ô ảo **bị va TRƯỚC** = lá chắn hy sinh tự nhiên.
- 🆕✅ **Block hải ly đang đứng lên:** KHÔNG nhặt được (§3.4).
- **Island (mạng bị chia cắt):** obstacle (vd đá) phá block ở giữa → mạng tách thành các island; hải ly **kẹt trên island đang đứng**, chỉ nhặt/đặt được trong island đó. **Chấp nhận có chủ đích** — là chiều sâu chiến thuật: block tặng + tường tạm dùng để **nối mạng** lại.
- 🆕✅ **RƠI NƯỚC = THUA NGAY (v3.1):** obstacle (vd đá) phá **block hải ly ĐANG ĐỨNG** → hải ly rơi xuống nước → **LOSE tức thì** (điều kiện thua mới — §12). Người chơi phải **bảo vệ chỗ đứng**.

### 3.7 Camera pan 🆕✅ (v3.0)
- Thế giới **rộng hơn màn hình portrait**: sông ở giữa, **khu rừng trái/phải nằm ngoài mép màn hình**.
- **DRAG** (chuột/ngón tay) trên nền = **pan camera NGANG** để xem 2 bên, có **LIMIT** (biên = hết khu rừng).
- 🆕✅ v3.1: kéo **tự do trong limit**, **KHÔNG auto-return**, **KHÔNG có nút recenter**.
- Chỉ để xem — **game KHÔNG pause** khi pan.
- **Input tách bạch:** DRAG trên nền = camera; TAP/CLICK lên đối tượng (kho, block, ô xanh...) = lệnh.

---

## 4. HỆ THỐNG SẢN XUẤT GỖ 🆕✅ (khu khai thác — v3.0)

- **Khu khai thác gỗ** nằm ở **rừng TRÁI**, ngoài mép màn hình (xem camera pan §3.7). **Tạm thời chỉ 1 khu.**
- **Nhóm hải ly thợ** diễn anim gặm gỗ → đem thành phẩm vào kho. ✅ Cứ **30 GIÂY sinh 1 block gỗ vào kho** (tunable ⏳ theo chapter).
- **Kho = BỘ ĐẾM trên UI button** hiển thị số gỗ đã khai thác (§11). Người chơi **click button kho** (count > 0) → trừ 1 → **thả 1 khúc gỗ vào lane ngẫu nhiên** (§3.2). ❌ Đã bỏ mô hình cũ "2 kho 2 bên, X giây/bó, kéo từ kho ra grid" (v3.0).
- 🆕✅ v3.1: kho **KHÔNG giới hạn max**. **`startingStock`** (số gỗ có sẵn đầu màn) = **data per-level, mặc định 3** (tunable ⏳).
- 🆕✅ v3.1: gỗ thả từ kho khi bị chặn → **neo thành block hoàn chỉnh** trên grid; **trúng slot blueprint → tự lấp, +1 tiến độ** (§3.2).
- **Rừng PHẢI:** giai đoạn này chỉ là **visual**; là **khu khai thác thứ 2** dành cho giai đoạn sau ⏳.
- Đây là **nguồn vật liệu chính** (thay cho "kho tĩnh giới hạn"). Vì gỗ hồi theo thời gian nên "hết gỗ" chỉ là trạng thái tạm thời → **thua chủ yếu do mực nước dâng**, không phải do cạn gỗ.
- **Nguồn phụ:** **khúc gỗ trôi** (obstacle) bị block chặn → 🆕 v3.1: **neo thành block hoàn chỉnh** y hệt gỗ thả từ kho (xem §6) — thống nhất **một cơ chế duy nhất**.
- **Định hướng tương lai:** ✅ khi mở khu khai thác thứ 2, **mỗi khu sản xuất một KÍCH THƯỚC GỖ KHÁC NHAU** (kho/bộ đếm riêng theo khu). **Giai đoạn đầu/prototype:** chỉ sản xuất **1x1**.

---

## 5. Vật liệu & khối gỗ

### 5.1 Vật liệu
- **Bó gỗ nằm ngang**, gỗ tự nhiên, **không buộc dây**, mặt không đều, có mảng rêu nhỏ.
- Mỗi bó là một đơn vị đặt trên lane; ghép nhiều bó nhìn tự nhiên, hơi lộn xộn (kiểu hải ly tự xây).

### 5.2 Kích thước khối (map theo lane) ✅
- **1x1:** rộng đúng **1 lane**, cao 1 hàng.
- **1x2:** rộng **1 lane**, cao **2 hàng**.
- **2x1:** rộng **2 lane**, cao 1 hàng.
- **2x2:** rộng **2 lane**, cao **2 hàng**.
- ⚠️ Chiều ngang khối **map theo lane**: khối 1x1 là **một bó gỗ lớn chiếm trọn 1 lane**, không phải viên gạch nhỏ.

### 5.3 Nguồn kích thước ✅
- **Blueprint quy định sẵn ô nào cần size nào.** Mỗi vị trí trên blueprint đã ghi rõ loại khối cần đặt.
- ✅ *(cập nhật v3.0)* **Khu khai thác sản xuất gỗ theo size** — mỗi khu khai thác sản xuất **một loại size** khi mở khu thứ 2 (xem §4, kho/bộ đếm riêng theo khu).
- ✅ *(chốt 2026-07-02)* **Chi phí MỌI KHỐI = 1 BÓ**, bất kể size (1x1, 1x2, 2x1, 2x2 đều tốn đúng 1 bó đúng loại).
- ✅ Blueprint vẫn quy định size từng ô như trên. **Prototype bắt đầu với 1x1.**

### 5.4 Khối to — đánh đổi rủi ro 🆕✅
- Khối rộng 2 lane (2x1/2x2): **obstacle va vào 1 lane bất kỳ → văng/hỏng cả khối**.
- ⇒ Khối to **lấp tiến độ nhanh nhưng rủi ro cao hơn** khi có obstacle; khối nhỏ an toàn nhưng tốn nhiều lượt đặt (travel time nhiều hơn).

---

## 6. Obstacle (MVP = 4 loại) ✅

Obstacle trôi theo từng lane từ trên xuống. **Luôn telegraph trước.** Sát thương **theo loại**:

| Obstacle | Khi bị block chặn | Khi lane hở (không chặn) | Ghi chú |
|---|---|---|---|
| **Khúc gỗ trôi** 🆕 | 🆕 v3.1: **NEO thành block hoàn chỉnh** trên grid y hệt gỗ thả từ kho — trúng slot blueprint → **tự lấp, +1 tiến độ**; lane kín → neo lên ô ảo (§3.2, §3.6) | Trôi lọt xuống thác, mất cơ hội nhặt (không sát thương) | Nhìn khác block xây khi trôi; sau khi neo dùng chung luật block |
| **Đá lớn** ✅ | **Kéo văng block xuống thác, block biến mất**. Khối 2 lane → văng cả khối. 🆕 Va **block mặt trước** (row nhỏ nhất) → stack ô ảo là lá chắn hy sinh (§3.6). 🆕✅ Phá block **hải ly đang đứng** → hải ly rơi nước → **THUA NGAY** (§12). ⏳ Định hướng M4: đá có chỉ số **DAMAGE** — phá xuyên bao nhiêu block/gỗ trên đường (stack ô ảo tiêu hao damage trước khi tới đập); số liệu tuning để sau | Trôi qua | Silhouette to, dễ nhận |
| **Bom nước** 🆕✅ | **Nổ, văng nhiều block quanh vùng** | (như bên trái nếu chạm đập) | Thùng đỏ, có cảnh báo |
| **Xoáy nước** ⏳ | **Chưa chốt cơ chế** — để sau | — | Hiệu ứng xoáy xanh/trắng |

### 6.1 Cách xử lý Bom nước 🆕✅ (v3.1: 2 counter trở lại)
- **Counter 1 — Hải ly ném đá cho nổ từ xa:** dùng hành động "ném đá" (§7.2) kích nổ bom khi nó còn ở xa, tránh thiệt hại lên đập.
- 🆕✅ **Counter 2 — Nhặt block mở lane cho bom trôi qua (v3.1):** nhờ RELOCATE (§3.4) — nhặt block ở lane bom lên (cầm trên tay hoặc đặt chỗ khác) → lane hở → bom trôi qua vô hại.
- ✅ Bom nước có **2 counter** → đủ chiều sâu quyết định. ❌ Bỏ ghi chú v3.0 "chỉ còn ném đá / cần thiết kế lại".

### 6.2 Nguyên tắc obstacle ✅
- Luôn telegraph trước khi nguy hiểm.
- Không spawn quá ngẫu nhiên gây ức chế.
- Mỗi obstacle tạo một quyết định khác nhau.
- Người chơi thua vì **xử lý sai**, không phải vì game chơi xấu.

---

## 7. Hải Ly Builder — hành động & kỹ năng

### 7.1 Di chuyển (đã chốt là core) ✅
- **Idle:** đứng thẳng như mascot/chibi.
- **Di chuyển:** hạ người, **bò bằng 4 chân** — bò xa tốn thời gian. 🆕 v3.0: **CHỈ bò trên mạng block đã đặt** (§3.6), không xuống nước, không lên bờ.
- **Tới nơi:** đứng thẳng lại để đặt/sửa/nhặt gỗ.

### 7.2 Hành động ✅ (v3.0 — tap-based)
| Hành động | Cơ chế |
|---|---|
| **Nhặt block (relocate)** 🆕 | 🆕 v3.1: click **BẤT KỲ block nào** trên grid/ô ảo (trừ block hải ly đang đứng; gỗ đang trôi không click được) → hải ly bò theo **mạng block** (§3.6) tới block kề → nhặt lên (carry, **1 khối/lần**, không hàng đợi). Nhặt block đang lấp slot → **X giảm 1**. |
| **Đặt block (qua ô xanh)** 🆕 | Khi đang carry, click 1 **ô xanh** → hải ly bò tới block kề ô đó → đặt xuống. Trùng blueprint = +1 tiến độ; không trùng = tường tạm mở rộng mạng. |
| **Ném đá** 🆕 | **Hành động miễn phí, có cooldown** (không giới hạn số lần). Dùng kích nổ bom nước từ xa. |

> ❌ Đã bỏ **thu hồi VỀ KHO** (block không quay lại bộ đếm kho); 🆕 v3.1: mọi block **relocate được** (nhặt → ô xanh → đặt lại) — xem §3.4. Di chuyển của hải ly **chỉ trên block đã đặt** (§3.6).

### 7.3 Kỹ năng riêng ✅
- **Sửa chữa siêu tốc:** lập tức sửa 1 block hỏng và **+30% độ bền của block đó trong 6 giây**.
- **Bền bỉ:** các block do hải ly đặt có **+20% máu/độ bền**.
- ⏳ *Cần chốt:* cách kích hoạt (nút/cooldown/charge), vì MVP chưa có nâng cấp chỉ số.

### 7.4 Flow animation đề xuất
Idle → Start move (cúi) → Move (bò) → Stop (đứng) → Build (đặt gỗ) → Pick-up (nhặt block) 🆕 → Throw (ném đá) 🆕 → Repair → Scared (obstacle tới) → Win (vẫy tay).

> 🆕 **Assets có sẵn** (`assets/sprites/Beaver/`): 2 anim hải ly builder — **crawl** (`beaver_crawl_v2_1..5.png`) và **idle**. M2 dùng: CRAWLING → crawl anim, IDLE → idle anim; build/pickup tạm dùng frame có sẵn.

---

## 8. Tools (MVP = 4) ✅

| Tool | Công dụng | Ghi chú |
|---|---|---|
| **Búa phá** | Phá đá/thùng/obstacle kẹt | Có số lượng/lượt mỗi màn ⏳ |
| **Khiên** | Bảo vệ một đoạn đập khỏi va chạm kế tiếp | |
| **Đóng băng** | Làm chậm/dừng nước & obstacle vài giây | |
| **Hoàn tác** | Sửa bước đặt sai gần nhất | ⏳ cần xem lại vai trò: v3.1 mọi block đã relocate được (§3.4) — hoàn tác có thể thừa |

> **Lưu ý:** "Ném đá" **KHÔNG phải tool** — là hành động miễn phí có cooldown của hải ly (§7.2). Nam châm & Tăng tốc **ngoài MVP**.
> ⏳ *Cần chốt:* số lượng mỗi tool mỗi màn (concept: búa x3, đóng băng x2, khiên x2, hoàn tác x2).

---

## 9. Dòng sông, lane & mực nước

### 9.1 Lane (khu vực trên đập) ✅
- Sông chia **5 lane** bằng đường kẻ mờ.
- Mũi tên chỉ hướng nước chảy từ trên xuống. Obstacle trôi theo từng lane.

### 9.2 Mực nước = đồng hồ thua 🆕✅
- **Thanh mực nước dâng ĐỀU theo thời gian** trong suốt màn.
- Đầy thanh **trước khi** hoàn thành blueprint = **THUA**.
- Hoàn thành blueprint **trước khi** nước đầy = **THẮNG** (nước dừng ngay).
- ⏳ *Cần chốt:* tốc độ dâng theo chapter (tuning độ khó).

### 9.3 Khu vực dưới đập (visual) ✅
- Không kẻ lane. Nước dưới nối liền thành dòng chảy chung.
- Thác nước đổ xuống từ khe đập; bọt & sóng tạo cảm giác lực nước mạnh.

---

## 10. Blueprint (mẫu đập)

- Game hiển thị **ghost blueprint**: các ô cần xây + **size từng ô**.
- Grid rộng **5 lane** × **N hàng** (⏳ **N tăng dần theo chapter** — tôi đề xuất bảng số liệu).
- **Luật số hàng grid ✅ (chốt 2026-07-02):** số hàng grid = **số hàng blueprint cần + 1 row dư**. Row dư không có slot — là không gian đệm và chỗ đặt **block tặng đầu màn** (§3.5).
- Các dạng: Thẳng · Chữ U · Chữ V · Vòm · Zigzag · Bậc thang · Cổng xả · Nhiều lớp.
- **MVP dùng 5 dạng:** thẳng, chữ U, chữ V, zigzag, bậc thang.
- Look đập: gỗ ngang chiếm đúng lane, xen kẽ hơi lệch, có khoảng rỗng cho nước chảy — **không** giống cầu/hàng rào/đập bê tông.

---

## 11. UI gameplay (portrait) ✅

Theo concept "Màn 12" (portrait):
- **Top center:** tên màn + tiến độ `X / Y` (đếm theo khối).
- **Top right:** (MVP ẩn coin/gem vì chưa có kinh tế).
- **Left panel:** Mục tiêu ("Xây đập ngăn nước dâng").
- **Right toolbar:** các tool + số lượng (búa/đóng băng/khiên/hoàn tác).
- **Thanh mực nước:** hiển thị rõ mức dâng (đồng hồ thua).
- 🆕 **Button kho gỗ (v3.0):** 1 button có **bộ đếm** số gỗ đã khai thác (kho khu khai thác rừng trái, §4). **Click** (count > 0) → trừ 1 → thả 1 khúc gỗ vào lane ngẫu nhiên (§3.2). ❌ Bỏ mô tả cũ "2 kho 2 bên kéo ra grid". 🆕 v3.1: bộ đếm **không giới hạn max**; đầu màn = `startingStock` (mặc định 3, data per-level — §4).
- 🆕 **Ô xanh (v3.0):** khi hải ly đang carry, highlight các ô đặt được (§3.6) — 🆕 v3.1: chỉ trong grid, không mở lên vùng ô ảo.
- **Nhấn mạnh:** blueprint rõ ràng; block vừa neo/tự lấp slot có hiệu ứng dễ nhận; lane nguy hiểm cảnh báo trước; đặt sai/ngoài blueprint không glow; đúng blueprint glow xanh.

---

## 12. Điều kiện thắng / thua ✅

**Thắng:** lấp đủ số khối blueprint (thắng ngay).

**Thua:** ✅ 2 điều kiện:
1. **Thanh mực nước dâng đầy.** (Các điều kiện GDD gốc như "hết vật liệu" không còn là thua trực tiếp vì gỗ tự sản xuất; "đập bị phá" chỉ làm chậm tiến độ → gián tiếp dẫn tới nước đầy.)
2. 🆕✅ **Hải ly rơi xuống nước (v3.1):** obstacle phá **block hải ly đang đứng** → hải ly rơi xuống nước → **THUA NGAY** (§3.6). Người chơi phải bảo vệ chỗ đứng.

**3 sao (⏳ giữ định hướng, chưa gắn số):** hoàn thành nhanh · ít block bị phá · dùng ít tool · ít đặt sai · hải ly không bị choáng.

---

## 13. Level progression (5 chapter) ✅

| Chapter | Tên | Nội dung |
|---|---|---|
| 1 | Suối Xanh | Dạy đặt gỗ. Obstacle: khúc gỗ, đá nhỏ. Blueprint: thẳng, chữ U đơn giản. |
| 2 | Sông Đá | Thêm đá lớn. Dạy búa phá. Blueprint: bậc thang, chữ V. |
| 3 | Thác Xoáy | Thêm xoáy nước (⏳ chốt cơ chế). Blueprint: zigzag, vòm. |
| 4 | Mùa Mưa | Nước dâng nhanh hơn. Obstacle theo wave. Blueprint: nhiều lớp, cổng xả. |
| 5 | Boss / Lũ lớn | Nhiều obstacle cùng lúc. Đập lớn nhiều tầng. Quản lý tool + thứ tự xây. |

(Không có theme "Dung Nham" trong MVP.)

---

## 14. Phong cách hình ảnh (giữ nguyên GDD gốc) ✅

- 2D cartoon, top-down / slight isometric nhẹ, portrait.
- Màu tự nhiên: xanh sông, nâu gỗ, xanh rêu, đá xám. UI bo góc, dễ đọc mobile.
- Silhouette rõ cho mọi vật thể.
- **Không dùng:** đập đá/gạch vuông kiểu người xây, bó rơm, dây buộc quanh gỗ, đập quá đều/sạch/kỹ thuật, nhân vật đi bộ như người.
- **Hải ly:** lông nâu sẫm/xám, mảng trắng-xám quanh mõm/má/cổ; mũ bảo hộ vàng (dấu +), áo yếm xanh rêu, đuôi mái chèo; mắt tròn ngố, mũi đen to, răng cửa.

*(Character sheet, biểu cảm, turnaround, trang phục — xem `concept-analysis.md`. Skin trang phục & upgrade chỉ số nằm ngoài MVP.)*

---

## 15. MVP scope (chốt lại) ✅

- 1 nhân vật: Hải Ly Builder (+ nhóm hải ly thợ ở **khu khai thác rừng trái** 🆕).
- 5 lane, portrait. 🆕 v3.0: điều khiển **tap-based** (kho → thả gỗ → nhặt → ô xanh) + **camera pan ngang** (§3.7); hải ly chỉ đi trên mạng block (§3.6). 🆕 v3.1: gỗ neo thành block hoàn chỉnh + tự lấp slot; relocate mọi block; ô ảo trên đập; rơi nước = thua.
- Khối gỗ: 1x1, 1x2, 2x1, 2x2 (size do blueprint quy định).
- 5 blueprint: thẳng, chữ U, chữ V, zigzag, bậc thang.
- 4 obstacle: khúc gỗ trôi, đá lớn, xoáy nước, bom nước.
- 4 tool: búa phá, khiên, đóng băng, hoàn tác (⏳ hoàn tác cần xem lại vai trò khi mọi block relocate được — §8) (+ hành động ném đá miễn phí).
- Khu khai thác gỗ (30s/block, tunable) + kho bộ đếm/click thả + mực nước dâng làm đồng hồ thua.
- ~20 màn đầu, 2D cartoon rõ ràng.
- **KHÔNG có:** coin/gem, skin, nâng cấp chỉ số, theme Dung Nham, balance-tuning chi tiết.

---

## 16. CÂU HỎI CÒN MỞ (cần chốt / tôi sẽ đề xuất) ⏳

1. **Xoáy nước** — cơ chế cụ thể (khóa lane? hút block? làm chậm?). *(Người dùng để sau.)*
2. **Số liệu grid theo chapter** — N hàng mỗi chapter (đề xuất bảng).
3. **Nhịp khai thác gỗ** — mặc định 30 giây/block (tunable) + số thợ mỗi chapter.
4. **Tốc độ dâng mực nước** theo chapter (tuning độ khó).
5. **Số lượng tool** mỗi màn (búa/đóng băng/khiên/hoàn tác).
6. **Capacity mang gỗ** của hải ly theo màn (hiện = 1).
7. **Cách kích hoạt kỹ năng** (Sửa siêu tốc / Bền bỉ) khi chưa có upgrade.
8. **Cooldown ném đá** + đạn có giới hạn không.
9. **Ngưỡng 3 sao** — gắn số cụ thể.
10. 🆕 **Tốc độ trôi của khúc gỗ thả từ kho** — nhanh/chậm so với obstacle; có giống gỗ trôi tự nhiên không.
11. 🆕 **Pity/luật lane ngẫu nhiên khi thả gỗ** — có tránh lane hoàn toàn hở (gỗ chắc chắn mất) hoặc lane đã quá đầy không? *(✅ v3.1 đã chốt phần xếp chồng: lane kín → gỗ neo tiếp lên ô ảo, không giới hạn — §3.6; phần pity vẫn mở.)*
12. 🆕 **Tool Hoàn tác** — vai trò còn cần thiết không khi v3.1 mọi block đã relocate được (§3.4, §8)?
13. 🆕 **Số liệu DAMAGE của đá (v3.1, M4 ⏳)** — đá phá xuyên bao nhiêu block/gỗ trên đường; stack ô ảo tiêu hao damage thế nào (§6).

> ❌ Đã đóng (v3.1): "Bom nước cần thiết kế lại" — bom có lại 2 counter (§6.1); "nhiều gỗ nổi cùng lane xếp chồng thế nào" — neo lên ô ảo (§3.6); "đá vs block hải ly đang đứng" — phá → rơi nước → thua ngay (§12).

---

## 17. Prompt hình ảnh tham khảo

> Cập nhật v3.1: **portrait**, thế giới **rộng hơn màn hình** (camera pan ngang có limit), **khu khai thác gỗ ở rừng TRÁI** (hải ly thợ gặm gỗ → kho bộ đếm), rừng phải chỉ visual, **button kho gỗ + gỗ trôi neo thành block trên đập**.

**Gameplay 2D (portrait):**
```text
2D cartoon mobile game UI concept, PORTRAIT orientation, top-down slight isometric river dam building game, a cute goofy beaver builder is the main character crawling on top of placed dam blocks only, world wider than the phone screen with horizontal camera panning, a wood harvesting camp in the LEFT forest where a small group of lumberjack beavers gnaw logs and carry them into a storage, right forest is decorative scenery, a wood storage UI button with a counter that releases a log into a random river lane when tapped, released logs drifting down and anchoring into the dam grid as complete blocks, highlighted green cells showing valid placement spots next to reachable blocks, dark brown gray fur beaver with yellow safety helmet and green overalls, river divided into 5 lanes flowing downward, obstacles floating downstream (drifting log, big rock, red water bomb, whirlpool), dam built from horizontal loose logs only, no straw no ropes, each log bundle block width equals one river lane, rising water level bar as a soft timer, natural messy animal-built beaver dam, continuous waterfall below, Vietnamese UI, warm colorful 2D game art, clean mobile interface
```

**Nhân vật & khối gỗ:** giữ như GDD gốc / xem `concept-analysis.md`.

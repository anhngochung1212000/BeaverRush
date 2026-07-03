# DAM HEROES: RIVER RUSH — Phân tích Concept Art

> Phân tích 3 concept do người dùng cung cấp (2026-07-02), đối chiếu với `dam_heroes_concept.md` (GDD).
> Mục đích: chốt spec hình ảnh/UI cho MVP và ghi lại các điểm cần quyết định.

---

## Concept 1 — Gameplay UI (Landscape / Tablet) — "MÀN 15"

**Loại:** Mockup full UI màn chơi, tỉ lệ ngang (landscape/tablet).

### Bố cục màn hình
| Vùng | Nội dung |
|---|---|
| **Top center** | `MÀN 15 - DÒNG SUỐI XANH` + icon bó gỗ `36 / 75` (tiến độ) |
| **Top right** | Coin `1,250` + Gem `120` (currency, có nút `+`) |
| **Left panel** | `MỤC TIÊU`: "Xây đập bằng bó gỗ" `36/75` |
| **Right toolbar (dọc)** | BÚA PHÁ x3 · ĐÓNG BĂNG x2 · KHIÊN x2 · HOÀN TÁC x2 (mỗi tool có badge số lượng) |
| **Bottom-left** | `VẬT LIỆU`: bó gỗ x5 |
| **Bottom-center** | `CHỌN Ô ĐẤT`: LANE 1–5, mỗi lane x5 |
| **Bottom-right** | Nút `BẮT ĐẦU` (vàng, nổi bật) |
| **Right column** | `FLOW MÀN CHƠI` 4 bước có thumbnail: 1.Xem bản thiết kế · 2.Dòng sông bắt đầu chảy · 3.Xử lý vật cản, xây đập · 4.Hoàn thành con đập → banner `QUA DÀN!` |
| **Bottom strip** | Reference: kích thước ô (1 ô ngang = 1 lane) · OBSTACLE (7 loại) · TOOLS (6 loại) · VẬT PHẨM (Hải Ly Builder) |
| **Bottom bar** | `BỐI CẢNH`: 6 theme (Suối Xanh, Sông Đá, Thác Nước, Đầm Lầy, Mùa Đông, Dung Nham) |

### Khớp GDD
- ✅ 5 lane, obstacle trôi từ trên xuống (có mũi tên hướng nước).
- ✅ Đập gỗ nằm ngang, hải ly đứng giữa ôm bó gỗ, có thác nước phía dưới.
- ✅ Obstacle hiển thị đúng: xoáy nước, bom nổ (thùng đỏ), mìn nước (gai đen), thùng gỗ, đá lớn, khúc gỗ trôi.
- ✅ Đủ 6 tool trong reference; 4 tool active trên toolbar (búa, đóng băng, khiên, hoàn tác) = đúng MVP.

### Ghi chú / điểm cần quyết
- Bối cảnh mở rộng thành **6 theme** (GDD chỉ nêu 5 chapter). "Dung Nham" là theme mới → cần xác nhận có nằm trong scope hay chỉ art tham khảo.
- Currency (coin/gem) chưa có trong GDD → cần bổ sung hệ thống kinh tế / monetization vào design.
- Panel "FLOW MÀN CHƠI" giống tutorial tĩnh — cần quyết định là onboarding hay luôn hiển thị.

---

## Concept 2 — Gameplay UI (Portrait / Mobile) — "MÀN 12"

**Loại:** Mockup in-game thực tế, tỉ lệ dọc (portrait/mobile phone).

### Điểm khác biệt quan trọng so với Concept 1 & GDD
| Yếu tố | Concept 2 (portrait) | GDD / Concept 1 |
|---|---|---|
| **Vật liệu** | **Ô ĐẤT** (khối đất/cỏ, kiểu Minecraft) x25 | Bó gỗ nằm ngang |
| **Mục tiêu** | "Xây đập ngăn nước dâng" `0/25` | "Xây đập bằng bó gỗ" |
| **Tool** | `XÓA Ô` x3 · `HOÀN TÁC` x2 | 6 tool đầy đủ |
| **Tương tác** | "Chọn ô đất và chạm vào lane để đặt" | Chọn block theo size |
| **Hình đập** | Hàng khối đất vuông chặn ngang | Đập gỗ tự nhiên, lộn xộn |

### Đánh giá
- ⚠️ **Mâu thuẫn art direction:** dùng khối đất vuông (voxel/Minecraft) trái với nguyên tắc GDD mục 3 & 14 ("không dùng đập đá/gạch vuông", "gỗ nằm ngang tự nhiên"). Đây có thể là **prototype gameplay đơn giản hóa** hoặc **hướng art thay thế**.
- ✅ Layout portrait sạch, rõ: 5 lane dọc, mũi tên hướng nước, thác nước + bọt nước phía dưới rất tốt (đúng GDD mục 8 "nước dưới nối liền, có thác").
- Tool `XÓA Ô` = biến thể của "búa phá" (dùng để xóa block đặt sai) → naming khác GDD.

### Điểm cần quyết
1. **Chốt vật liệu:** bó gỗ (theo GDD) hay khối ô đất? → ảnh hưởng toàn bộ art + core fantasy "hải ly xây đập gỗ".
2. **Chốt orientation:** landscape (Concept 1) vs portrait (Concept 2). Portrait phù hợp mobile casual hơn.
3. Concept 2 tối giản tool (2 tool) — hợp làm layout các màn đầu (tutorial).

---

## Concept 3 — Character Sheet: HẢI LY BUILDER (Kỹ sư xây đập)

**Loại:** Character concept/turnaround sheet hoàn chỉnh.

### Thành phần
| Mục | Chi tiết |
|---|---|
| **Mô tả** | "Hải ly ngốc nghếch nhưng chăm chỉ, xây đập bảo vệ ngôi làng" — khớp core fantasy GDD |
| **CHỈ SỐ** | Tốc độ xây · Sửa chữa · Độ bền · Chống chịu (thanh bar 5 nấc) |
| **KỸ NĂNG ĐẶC BIỆT** | ① Sửa chữa siêu tốc (sửa 1 ô + tăng **30% độ bền trong 6 giây**) · ② Bền bỉ (ô do hải ly xây **+20% máu**) |
| **BIỂU CẢM** | Vui vẻ · Tập trung · Bất ngờ · Tự hào · Sợ hãi · Mệt mỏi (6 expression) |
| **TURNAROUND** | Front · 3/4 Front · Side · Back · 3/4 Back |
| **DI CHUYỂN (BÒ)** | 4 frame bò bằng 4 chân (đúng GDD: di chuyển thì bò) |
| **TRANG PHỤC** | Mặc định · Thợ mỏ · Mùa đông · Rừng xanh · Du lịch (5 skin) |
| **DỤNG CỤ RIÊNG** | Búa gỗ (sửa nhanh **+50%**) · Ba lô gỗ (mang thêm **+20% vật liệu**/màn) |
| **ANIMATION 2D** | Xây đất · Sửa chữa · Bền bỉ (tăng HP) · Kích hoạt kỹ năng |
| **TƯ THẾ (IDLE)** | Nhiều pose idle (cầm búa, ôm gỗ, nghe nhạc…) |

### Khớp GDD
- ✅ Đứng thẳng idle, bò 4 chân khi di chuyển.
- ✅ Mũ bảo hộ vàng (có dấu +), áo yếm xanh rêu, đuôi mái chèo, mắt tròn ngố, mũi đen to, răng cửa.
- ✅ Kỹ năng "Sửa chữa siêu tốc" + "Bền bỉ" đúng GDD mục 10 (nay có **số liệu cụ thể**: +30%/6s, +20% máu).

### Ghi chú / cần quyết
- **Số liệu mới cần đưa vào balance data:** skill +30% độ bền/6s, +20% HP block; búa gỗ +50% tốc độ sửa; ba lô +20% vật liệu.
- 5 skin trang phục → có thể là hệ thống cosmetic/monetization (liên kết coin/gem ở Concept 1).
- Thanh chỉ số 4 stat → gợi ý có hệ thống nâng cấp nhân vật (chưa có trong GDD).

---

## Tổng hợp: Quyết định cần chốt trước khi build MVP

1. **Vật liệu chính:** Bó gỗ (GDD) vs Khối ô đất (Concept 2). → *Khuyến nghị: giữ bó gỗ để đúng core fantasy; ô đất chỉ dùng nếu muốn art tối giản hóa prototype.*
2. **Orientation:** Landscape vs Portrait. → *Khuyến nghị: Portrait cho mobile casual.*
3. **Hệ thống kinh tế:** coin/gem, skin, nâng cấp stat — chưa có trong GDD, cần bổ sung spec.
4. **Số theme:** 5 (GDD) hay 6 (thêm Dung Nham).
5. **Balance data:** đưa các con số từ character sheet (%, giây) vào bảng cân bằng.

## Điểm nhất quán (đã xác nhận qua cả 3 concept)
- 5 lane, obstacle telegraph từ trên xuống, thác nước phía dưới.
- Hải ly builder: mũ vàng + áo yếm xanh, đứng idle / bò khi di chuyển.
- 7 obstacle, 6 tool, 8 blueprint, tiến độ dạng `X/Y`.

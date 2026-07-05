// assets/manifest.js — map key -> đường dẫn ảnh HOẶC mảng frame (anim §C1/§C9).
// Key thiếu = graybox. Khi có art thật: đổ file vào assets/sprites/ rồi khai báo ở đây,
// KHÔNG cần sửa logic — drawSprite tự thay graybox (§A7.2).
export const manifest = {
  // Môi trường (§C5) — cắt từ waterfall.png (sprite sheet nước, 2026-07-04):
  //   river_flow.png (390x390, ô nước trên-trái) = mặt sông TILE + cuộn (bg_river + fill thanh nước UI)
  //   waterfall_big.png (750x420, khối thác lớn: lip+dòng đổ+bọt+vách đá) = con thác dưới đập (STRETCH)
  // AssetStore dedupe theo path — bg_river & ui_water_fill cùng file chỉ decode 1 bitmap.
  bg_river: 'assets/sprites/Enviroment/river_flow.png',
  ui_water_fill: 'assets/sprites/Enviroment/river_flow.png',
  // Thác = DẢI LIỀN từ river.png (lip foam + streak, 944x585) vẽ TĨNH -> khớp ref, hết seam
  waterfall: 'assets/sprites/Enviroment/fall_full.png',
  // Streak riêng (tile được) -> phủ shimmer cuộn mờ lên thác cho có chuyển động
  fall_streaks: 'assets/sprites/Enviroment/fall_streaks.png',

  // Bờ sông 2 bên (mapping chốt 2026-07-03): CẢ 2 bờ dùng Ground.png — bờ PHẢI
  // flip ngang lúc vẽ (forests.js); cây + cỏ rải lên trên (KHÔNG dùng key forest_left/right nữa)
  ground: 'assets/sprites/Enviroment/Ground.png',
  grass_sheet: 'assets/sprites/Enviroment/ChatGPT Image Jul 3, 2026, 10_09_18 AM.png',

  // Cây rừng + chu trình trại khai thác (nguyên -> gặm -> đổ -> gốc + khúc gỗ)
  tree_full_a: 'assets/sprites/Tree/tree_full_a.png',
  tree_full_b: 'assets/sprites/Tree/tree_full_b.png',
  tree_gnawed: 'assets/sprites/Tree/tree_gnawed.png',
  tree_falling: 'assets/sprites/Tree/tree_falling.png',
  tree_stump: 'assets/sprites/Tree/tree_stump.png',
  tree_log: 'assets/sprites/Tree/tree_log.png',

  // Block & gỗ (§C3): wood.png kiêm 3 vai (block đặt / gỗ trôi / trên lưng) —
  // gỗ neo CONVERT thành block nên cùng hình là mạch lạc (chốt 2026-07-03)
  block_1x1: 'assets/sprites/Obstacle/wood.png',
  block_carried: 'assets/sprites/Obstacle/wood.png',
  float_log: 'assets/sprites/Obstacle/wood.png',

  // Obstacle (§C4)
  rock_big: 'assets/sprites/Obstacle/rock.png',

  // Anim hải ly builder CÓ SẴN (§C1) — filenames đúng theo assets/sprites/Beaver/
  beaver_idle: [
    'assets/sprites/Beaver/beaver_idle_breath_1.png',
    'assets/sprites/Beaver/beaver_idle_breath_2.png',
    'assets/sprites/Beaver/beaver_idle_breath_3.png',
    'assets/sprites/Beaver/beaver_idle_breath_4.png',
  ],
  beaver_crawl: [
    'assets/sprites/Beaver/beaver_crawl_v2_1.png',
    'assets/sprites/Beaver/beaver_crawl_v2_2.png',
    'assets/sprites/Beaver/beaver_crawl_v2_3.png',
    'assets/sprites/Beaver/beaver_crawl_v2_4.png',
    'assets/sprites/Beaver/beaver_crawl_v2_5.png',
  ],
};

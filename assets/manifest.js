// assets/manifest.js — map key -> đường dẫn ảnh HOẶC mảng frame (anim §C1/§C9).
// Key thiếu = graybox. Khi có art thật: đổ file vào assets/sprites/ rồi khai báo ở đây,
// KHÔNG cần sửa logic — drawSprite tự thay graybox (§A7.2).
export const manifest = {
  // Môi trường (§C5) — texture nước tileable 1254x1254 DÙNG CHUNG 3 chỗ (key riêng
  // để sau này thay art từng chỗ không đụng code): nền sông, thác dưới đập,
  // fill thanh nước UI. Vẽ TILE + scroll qua drawTiledSprite (KHÔNG stretch).
  // AssetStore dedupe theo path — 3 key cùng file chỉ decode 1 bitmap.
  bg_river: 'assets/sprites/Enviroment/water.png',
  waterfall: 'assets/sprites/Enviroment/water.png',
  ui_water_fill: 'assets/sprites/Enviroment/water.png',

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

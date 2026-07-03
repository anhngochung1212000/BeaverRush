// assets/manifest.js — map key -> đường dẫn ảnh HOẶC mảng frame (anim §C1/§C9).
// Key thiếu = graybox. Khi có art thật: đổ file vào assets/sprites/ rồi khai báo ở đây,
// KHÔNG cần sửa logic — drawSprite tự thay graybox (§A7.2).
export const manifest = {
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

// config/levels.js — LevelData: mảng levels[] (blueprint + tham số màn).
// Data COPY NGUYÊN VĂN từ prototype-plan.md §D8 v2.1 — KHÔNG tự chế số liệu.
// NGOẠI LỆ (user chốt 2026-07-03): originY đặt sao cho ĐÁY ĐẬP = 1500 mọi level
// (originY = 1500 - rows*cellH) — thác cố định 1500->1920, grid "kéo xuống theo".
// 2026-07-04 (concept-match): cellH 150 -> 100 — block BẸT theo tỉ lệ bó gỗ wood.png
// (1.5:1), các hàng đập khít như concept; originY suy lại (lv0 1300, lv1 1100).
// Field -> system mapping (v2.1):
//   grid -> Grid (toạ độ hệ SÔNG; world offset +forestW khi render/input §A5);
//   camera -> Camera (forestW = bề rộng mỗi bờ; sông hẹp giữa vừa 1 khung, KHÔNG pan — reframe 2026-07-03);
//   blueprint.slots -> Blueprint (Y = slots.length);
//   starterBlocks -> Game.loadLevel spawn Block 1x1 onBlueprint=false — kiêm mạng đi được
//     khởi đầu & chỗ đứng hải ly (phải kề nhau; beaver.startCol/startRow trùng 1 block);
//   wood.left -> WoodStock + ProductionSystem (kho khai thác rừng TRÁI, +1 block/intervalSec;
//     wood.right = null: rừng phải visual thuần, khu khai thác 2 để giai đoạn sau);
//   floatingLog.spawnY -> FloatingLogSystem (gỗ thả từ kho; neo -> convert Block, auto slot-fill §A4.1);
//   drift -> WaterSystem (M3.1 chốt 2026-07-03): travelSecStart = THỜI GIAN trôi spawn -> tâm ô neo
//     row 0 lúc đầu màn; nước dâng -> rút ngắn TUYẾN TÍNH tới sàn travelSecMin (nước đầy).
//     Vận tốc trôi CHUNG cho MỌI obstacle trên sông = quãng chuẩn / travelSec — SUY RA,
//     không config px/s trực tiếp (rockFallSpeedPx/logFallSpeedPx đã bỏ theo cơ chế này);
//   beaver -> Beaver/BeaverSystem; water -> WaterLevel/WaterSystem (M3);
//   obstacles -> ObstacleSystem (M4). 🆕 ROCK TARGETING (2026-07-03): với entry "rock",
//     lane trong schedule chỉ là FALLBACK — hệ tự nhắm lane có NHIỀU BLOCK NHẤT
//     (khóa lúc telegraph); entry "log" vẫn dùng đúng lane data.
// v2.1: KHÔNG còn sourceSide/refund/COST_PER_BLOCK — chi phí = trừ kho khi thả (§D3);
// ô ảo (virtualCells) là runtime state, KHÔNG nằm trong LevelData.
export const levels = [
  {
    "id": "ch1_lvl1_thang",
    "name": "Suối Xanh 1 - Thẳng",
    "grid": { "cols": 5, "rows": 2, "cellW": 140, "cellH": 100, "originX": 15, "originY": 1300 },
    "camera": { "forestW": 175 },
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
    "floatingLog": { "spawnY": -150 },
    "drift": { "travelSecStart": 8, "travelSecMin": 4 },
    "beaver": { "startCol": 2, "startRow": 1, "speedPx": 320, "buildSec": 0.4, "pickupSec": 0.4 },
    "water": { "waterSecondsToFull": 90 },
    "obstacles": {
      "telegraphLeadSec": 1.2,
      "spawnY": -150,
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
    "grid": { "cols": 5, "rows": 4, "cellW": 140, "cellH": 100, "originX": 15, "originY": 1100 },
    "camera": { "forestW": 175 },
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
    "floatingLog": { "spawnY": -150 },
    "drift": { "travelSecStart": 6.4, "travelSecMin": 3.2 },
    "beaver": { "startCol": 2, "startRow": 3, "speedPx": 320, "buildSec": 0.4, "pickupSec": 0.4 },
    "water": { "waterSecondsToFull": 120 },
    "obstacles": {
      "telegraphLeadSec": 1.2,
      "spawnY": -150,
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
];

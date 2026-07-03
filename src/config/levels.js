// config/levels.js — LevelData: mảng levels[] (blueprint + tham số màn).
// Data COPY NGUYÊN VĂN từ prototype-plan.md §D8 v2.1 — KHÔNG tự chế số liệu.
// Field -> system mapping (v2.1):
//   grid -> Grid (toạ độ hệ SÔNG; world offset +forestW khi render/input §A5);
//   camera -> Camera (forestW; panLimit PHẢI = 2*forestW, loader tự derive nếu lệch);
//   blueprint.slots -> Blueprint (Y = slots.length);
//   starterBlocks -> Game.loadLevel spawn Block 1x1 onBlueprint=false — kiêm mạng đi được
//     khởi đầu & chỗ đứng hải ly (phải kề nhau; beaver.startCol/startRow trùng 1 block);
//   wood.left -> WoodStock + ProductionSystem (kho khai thác rừng TRÁI, +1 block/intervalSec;
//     wood.right = null: rừng phải visual thuần, khu khai thác 2 để giai đoạn sau);
//   floatingLog -> FloatingLogSystem (gỗ thả từ kho; neo -> convert Block, auto slot-fill §A4.1);
//   beaver -> Beaver/BeaverSystem; water -> WaterLevel/WaterSystem (M3);
//   obstacles -> ObstacleSystem (M4 — giữ trong levelData, chưa hệ nào tick).
// v2.1: KHÔNG còn sourceSide/refund/COST_PER_BLOCK — chi phí = trừ kho khi thả (§D3);
// ô ảo (virtualCells) là runtime state, KHÔNG nằm trong LevelData.
export const levels = [
  {
    "id": "ch1_lvl1_thang",
    "name": "Suối Xanh 1 - Thẳng",
    "grid": { "cols": 5, "rows": 2, "cellW": 180, "cellH": 150, "originX": 90, "originY": 900 },
    "camera": { "forestW": 450, "panLimit": 900 },
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
    "floatingLog": { "speedPx": 350, "spawnY": -150 },
    "beaver": { "startCol": 2, "startRow": 1, "speedPx": 320, "buildSec": 0.4, "pickupSec": 0.4 },
    "water": { "waterSecondsToFull": 90 },
    "obstacles": {
      "telegraphLeadSec": 1.2,
      "spawnY": -150,
      "rockFallSpeedPx": 500,
      "logFallSpeedPx": 400,
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
    "grid": { "cols": 5, "rows": 4, "cellW": 180, "cellH": 150, "originX": 90, "originY": 900 },
    "camera": { "forestW": 450, "panLimit": 900 },
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
    "floatingLog": { "speedPx": 350, "spawnY": -150 },
    "beaver": { "startCol": 2, "startRow": 3, "speedPx": 320, "buildSec": 0.4, "pickupSec": 0.4 },
    "water": { "waterSecondsToFull": 120 },
    "obstacles": {
      "telegraphLeadSec": 1.2,
      "spawnY": -150,
      "rockFallSpeedPx": 500,
      "logFallSpeedPx": 400,
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

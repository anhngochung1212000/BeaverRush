// core/Sfx.js — HOOK ÂM THANH M5 (§B M5): điểm gọi DUY NHẤT cho mọi sự kiện âm thanh.
// Prototype chưa có file audio -> console.debug (im lặng trong gameplay, thấy khi mở
// devtools verbose). Khi có asset thật: đổ file vào assets/audio/ + khai map FILES
// bên dưới -> tự phát, KHÔNG sửa call site nào. Headless (Node/smoke): không Audio API
// -> luôn rơi nhánh debug, an toàn.
export const SfxEvent = {
  RELEASE: 'release',        // tap kho thả gỗ
  ANCHOR: 'anchor',          // gỗ neo thành block (tường tạm/ô ảo)
  SLOT_FILL: 'slotFill',     // neo/đặt TRÚNG slot (+1 tiến độ)
  LOG_LOST: 'logLost',       // gỗ trôi lọt thác — mất
  PICKUP: 'pickup',          // hải ly nhặt block xong
  PLACE_WALL: 'placeWall',   // đặt thành tường tạm (lệch slot)
  ROCK_SMASH: 'rockSmash',   // đá phá block
  TELEGRAPH: 'telegraph',    // cảnh báo lane sắp có obstacle
  WOOD_PLUS: 'woodPlus',     // trại khai thác +1 gỗ vào kho
  WIN: 'win',
  LOSE: 'lose',
};

// map event -> đường dẫn audio thật (để TRỐNG ở prototype; điền dần khi user cấp file)
// vd: { [SfxEvent.ROCK_SMASH]: 'assets/audio/rock_smash.mp3' }
const FILES = {};

const cache = new Map(); // path -> HTMLAudioElement gốc (clone khi phát để chồng tiếng)

export const Sfx = {
  muted: false,
  play(event) {
    if (this.muted) return;
    const path = FILES[event];
    if (!path || typeof Audio === 'undefined') {
      // hook trống: log verbose để verify ĐÚNG ĐIỂM GỌI (DoD M5) mà không ồn console
      if (typeof console !== 'undefined') console.debug(`[sfx] ${event}`);
      return;
    }
    let base = cache.get(path);
    if (!base) {
      base = new Audio(path);
      cache.set(path, base);
    }
    const node = base.cloneNode();
    node.play().catch(() => {}); // autoplay policy: bỏ qua khi chưa có tương tác
  },
};

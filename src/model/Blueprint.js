// model/Blueprint.js — danh sách BlueprintSlot + hàm đếm tiến độ (§A3)
// DATA THUẦN — không đụng canvas.

// BlueprintSlot — ô ghost cần xây (prototype: TOÀN slot 1x1)
export class BlueprintSlot {
  constructor({ col, row, size = '1x1' }) {
    this.col = col;   // ô neo (prototype 1x1: chính là ô slot)
    this.row = row;
    this.size = size; // prototype LUÔN '1x1' ('1x2'|'2x1'|'2x2' để giai đoạn sau)
    this.filled = false; // đã có block ĐÚNG lấp chưa
  }
}

export class Blueprint {
  constructor(slotsData) {
    this.slots = slotsData.map((s) => new BlueprintSlot(s));
  }

  // Y trong bộ đếm "X / Y" — đếm tiến độ THEO KHỐI (mỗi slot = 1 đơn vị, §D2)
  get total() {
    return this.slots.length;
  }

  // X trong bộ đếm "X / Y"
  get filledCount() {
    let n = 0;
    for (const s of this.slots) if (s.filled) n++;
    return n;
  }

  isComplete() {
    return this.filledCount >= this.total;
  }

  // Tìm slot tại đúng ô (luật khớp 1x1: ô thả == ô slot, §A4)
  slotAt(col, row) {
    return this.slots.find((s) => s.col === col && s.row === row) || null;
  }
}

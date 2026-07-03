// model/Command.js — pendingCommand (FETCH / PLACE) — §A4 v2.1.
// Tối đa 1 command một thời điểm, KHÔNG hàng đợi; hải ly bận -> tap bị từ chối.
// KHÔNG còn sourceSide / recall về kho (v2.1: FETCH = nhặt-relocate bất kỳ block).
export class Command {
  constructor({ kind, blockId = null, targetCell = null }) {
    this.kind = kind;             // 'FETCH' | 'PLACE'
    this.blockId = blockId;       // FETCH: id Block cần nhặt (bất kỳ block trên grid/ô ảo)
    this.targetCell = targetCell; // FETCH: ô của block target; PLACE: ô xanh đích {col,row}
  }
}

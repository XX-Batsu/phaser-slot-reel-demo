import { Signal, SlotGame } from 'slot-base';

export default class ChangeFacePlaySignal extends Signal {
    constructor() {
        super(ChangeFacePlaySignal.ON_SYMBOL_FACE_CHANGE);
        this.lineExtraDataAry = SlotGame.ReelResultData.lineExtraDataAry;
        // 取得當前要秀該線 贏分資訊
        this.index = SlotGame.GameInfo.winLineIndex;
    }
}
ChangeFacePlaySignal.ON_SYMBOL_FACE_CHANGE = 'ON_SYMBOL_FACE_CHANGE';

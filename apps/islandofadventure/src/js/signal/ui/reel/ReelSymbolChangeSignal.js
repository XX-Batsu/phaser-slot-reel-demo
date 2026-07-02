import { Signal, SlotGame } from 'slot-base';

export default class ReelSymbolChangeSignal extends Signal {
    constructor() {
        super(ReelSymbolChangeSignal.ON_REEL_SYMBOL_ANY_CHANGE);
        // 取得當前要秀該線 贏分資訊
        this.index = SlotGame.GameInfo.winLineIndex;

        // Symbol原始資料位置(二維)
        this.symbolResult = SlotGame.ReelResultData.symbolResult;

        this.extraData = SlotGame.ReelResultData.extraData;
        // 額外
        this.lineExtraDataAry = SlotGame.ReelResultData.lineExtraDataAry;
    }
}
ReelSymbolChangeSignal.ON_REEL_SYMBOL_ANY_CHANGE = 'ON_REEL_SYMBOL_ANY_CHANGE';

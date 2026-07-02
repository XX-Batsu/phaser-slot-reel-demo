import { Signal, SlotGame } from 'slot-base';

export default class FreeCompleteSignal extends Signal {
    constructor() {
        super(FreeCompleteSignal.ON_FREE_COMPLETE);
        // 顯示結算的總分數  (取出FreeGame累積分數(freeWinScoreNum) 當作最後結算的總分數)
        this.TotalCompleteScore = SlotGame.FreeResultModel.accumlateWinAmt;
    }
}
FreeCompleteSignal.ON_FREE_COMPLETE = 'ON_FREE_COMPLETE';

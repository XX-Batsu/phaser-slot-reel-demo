import { SlotGame } from 'slot-base';
import WinDataVoSignal from 'js/signal/windata/data/WinDataVoSignal';

/**
* 贏得獎項
*/
export default class WinSymbolScoreSignal extends WinDataVoSignal {
    constructor() {
        super(WinSymbolScoreSignal.ON_WIN_SYMBOL_SCORE_EFFECT);
        // 取得階段判斷資料
        const stepData = SlotGame.GameInfo.getWinScoreSec(this.totalWin);
        this.soundStep = stepData.soundStep;
    }
}
WinSymbolScoreSignal.ON_WIN_SYMBOL_SCORE_EFFECT = 'ON_WIN_SYMBOL_SCORE_EFFECT';

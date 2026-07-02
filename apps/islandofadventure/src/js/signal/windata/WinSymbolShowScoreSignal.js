import { SlotGame } from 'slot-base';
import WinDataVoSignal from 'js/signal/windata/data/WinDataVoSignal';

/**
* 贏得獎項
*/
export default class WinSymbolShowScoreSignal extends WinDataVoSignal {
    constructor() {
        super(WinSymbolShowScoreSignal.ON_WIN_SYMBOL_SHOWSCORE_EFFECT);
        // 取得階段判斷資料
        const stepData = SlotGame.GameInfo.getWinScoreSec(this.totalWin);
        this.soundStep = stepData.soundStep;

        // 取得當前要秀該線 贏分資訊
        this.index = SlotGame.GameInfo.winLineIndex;
    }
}
WinSymbolShowScoreSignal.ON_WIN_SYMBOL_SHOWSCORE_EFFECT = 'ON_WIN_SYMBOL_SHOWSCORE_EFFECT';

import { SlotGame } from 'slot-base';
import WinDataVoSignal from 'js/signal/windata/data/WinDataVoSignal';

/**
* 贏得獎項
*/
export default class WinSymbolShowSignal extends WinDataVoSignal {
    constructor() {
        super(WinSymbolShowSignal.ON_WINSYMBOL_SHOW_EFFECT);
        // 取得階段判斷資料
        const stepData = SlotGame.GameInfo.getWinScoreSec(this.totalWin);
        this.soundStep = stepData.soundStep;

        // 取得當前要秀該線 贏分資訊
        this.index = SlotGame.GameInfo.winLineIndex;
    }
}
WinSymbolShowSignal.ON_WINSYMBOL_SHOW_EFFECT = 'ON_WINSYMBOL_SHOW_EFFECT';

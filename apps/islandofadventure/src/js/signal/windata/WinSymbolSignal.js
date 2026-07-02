import { SlotGame } from 'slot-base';
import WinDataVoSignal from 'js/signal/windata/data/WinDataVoSignal';

/**
* 贏得獎項
*/
export default class WinSymbolSignal extends WinDataVoSignal {
    constructor() {
        super(WinSymbolSignal.ON_WINSYMBOL_EFFECT);
        // 取得階段判斷資料
        const stepData = SlotGame.GameInfo.getWinScoreSec(this.totalWin);
        this.soundStep = stepData.soundStep;
    }
}
WinSymbolSignal.ON_WINSYMBOL_EFFECT = 'ON_WINSYMBOL_EFFECT';

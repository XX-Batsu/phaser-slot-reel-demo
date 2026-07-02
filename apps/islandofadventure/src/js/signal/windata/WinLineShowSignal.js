import { SlotGame } from 'slot-base';
import WinDataVoSignal from 'js/signal/windata/data/WinDataVoSignal';

/**
 * 此格式已支援FreeGame與BaseGame轉動資料
 */
export default class WinLineShowSignal extends WinDataVoSignal {
    constructor() {
        super(WinLineShowSignal.ON_LINEBAR_SHOW_WINLINE);
        // 取得當前要秀該線 贏分資訊
        this.index = SlotGame.GameInfo.winLineIndex;
    }
}

WinLineShowSignal.ON_LINEBAR_SHOW_WINLINE = 'ON_LINEBAR_SHOW_WINLINE';

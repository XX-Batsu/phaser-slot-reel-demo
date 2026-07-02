import { SlotGame } from 'slot-base';
import WinDataVoSignal from 'js/signal/windata/data/WinDataVoSignal';

export default class WinBorderShowSignal extends WinDataVoSignal {
    /**
     * 贏得獎項
     */
    constructor() {
        super(WinBorderShowSignal.ON_BORDER_SHOW_WINLINE);
        // 取得當前要秀該線 贏分資訊
        this.index = SlotGame.GameInfo.winLineIndex;
    }
}
WinBorderShowSignal.ON_BORDER_SHOW_WINLINE = 'ON_BORDER_SHOW_WINLINE';

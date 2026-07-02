import { SlotGame } from 'slot-base';
import WinDataVoSignal from 'js/signal/windata/data/WinDataVoSignal';

export default class ReelShowWinHideSignal extends WinDataVoSignal {
    constructor() {
        super(ReelShowWinHideSignal.ON_SHOW_WINHIDE_SYMBOL);
        // 取得當前要秀該線 贏分資訊
        this.index = SlotGame.GameInfo.winLineIndex;
    }
}
ReelShowWinHideSignal.ON_SHOW_WINHIDE_SYMBOL = 'ON_SHOW_WINHIDE_SYMBOL';

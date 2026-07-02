import Signal from 'base/Signal';
import ReelResultData from 'game/model/ReelResultData';

export default class JackpotTakeWinSignal extends Signal {
    constructor() {
        super(JackpotTakeWinSignal.ON_JACKPOT_TAKE_WIN);
        this.hasBaseWin = ReelResultData.winLineCount > 0;
    }
}
JackpotTakeWinSignal.ON_JACKPOT_TAKE_WIN = 'ON_JACKPOT_TAKE_WIN';

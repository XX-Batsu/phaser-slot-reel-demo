import Signal from 'base/Signal';
import JackpotResultModel from 'game/model/JackpotResultModel';

export default class JackpotWinShowScoreSignal extends Signal {
    constructor() {
        super(JackpotWinShowScoreSignal.ON_SHOW_JACKPOT_WIN_SCORE);
        this.jackpotScoreStart = 0;
        // 拉中JP的累積分數
        this.jackpotScoreEnd = JackpotResultModel.jpWinAmt;
    }
}
JackpotWinShowScoreSignal.ON_SHOW_JACKPOT_WIN_SCORE = 'ON_SHOW_JACKPOT_WIN_SCORE';

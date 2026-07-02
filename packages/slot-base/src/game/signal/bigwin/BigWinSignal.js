import Signal from 'base/Signal';
import ReelResultData from 'game/model/ReelResultData';
import GameInfo from 'game/model/GameInfo';

export default class BigWinSignal extends Signal {
    constructor() {
        super(BigWinSignal.ON_BIGWIN_SIGNAL);
        // 總贏分
        this.score = ReelResultData.totalWin;
        // 遊戲總押住
        this.getTotalBet = GameInfo.getTotalBet;
        // 取得階段判斷資料
        const stepData = GameInfo.getWinScoreSec(ReelResultData.totalWin);
        this.sec = stepData.sec;
        this.soundStep = stepData.soundStep;
    }
}
BigWinSignal.ON_BIGWIN_SIGNAL = 'ON_BIGWIN_EMTTER_SIGNAL';

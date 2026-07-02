import Signal from 'base/Signal';
import FreeResultModel from 'game/model/FreeResultModel';

export default class FreeWinScoreSignal extends Signal {
    constructor() {
        super(FreeWinScoreSignal.ON_FREE_WIN_SCORE);
        // 分數起始值
        this.freeScoreStart = FreeResultModel.freeWinScoreNum;
        // 分數終點值
        this.freeScoreEnd = FreeResultModel.accumlateWinAmt;
        // 累加免費遊戲分數
        FreeResultModel.freeWinScoreNum = this.freeScoreEnd;
    }
}
FreeWinScoreSignal.ON_FREE_WIN_SCORE = 'ON_FREE_WIN_SCORE';

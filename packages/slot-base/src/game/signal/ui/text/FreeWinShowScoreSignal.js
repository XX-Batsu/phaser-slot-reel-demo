import Signal from 'base/Signal';
import FreeResultModel from 'game/model/FreeResultModel';
import ReelResultData from 'game/model/ReelResultData';
import GameInfo from 'game/model/GameInfo';

export default class FreeWinShowScoreSignal extends Signal {
    constructor() {
        super(FreeWinShowScoreSignal.ON_FREE_WIN_SCORESHOW);
        // 分數起始值
        this.freeScoreStart = FreeResultModel.freeWinScoreNum;
        const bool = (ReelResultData.lineExtraDataAry.length === 0 || ReelResultData.lineExtraDataAry[GameInfo.winLineIndex][0] === 0);
        // const freeNormalScoreEnd = FreeResultModel.accumlateWinAmt - ReelResultData.extraTotalWin;
        // 分數終點值(Normal || Extra)
        // this.freeScoreEnd = (bool) ? freeNormalScoreEnd : FreeResultModel.accumlateWinAmt;
        // 此款遊戲特色 二次算分會先秀
        const freeNormalScoreEnd = FreeResultModel.accumlateWinAmt - ReelResultData.normalTotalWin;
        this.freeScoreEnd = (bool) ? FreeResultModel.accumlateWinAmt : freeNormalScoreEnd;
        // 累加免費遊戲分數
        FreeResultModel.freeWinScoreNum = this.freeScoreEnd;
    }
}
FreeWinShowScoreSignal.ON_FREE_WIN_SCORESHOW = 'ON_FREE_WIN_SCORESHOW';

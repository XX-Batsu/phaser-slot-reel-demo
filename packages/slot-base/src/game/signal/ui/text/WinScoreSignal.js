import Signal from 'base/Signal';
import SlotResultModel from 'game/model/SlotResultModel';
import ReelResultData from 'game/model/ReelResultData';
import GameInfo from 'game/model/GameInfo';

export default class WinScoreSignal extends Signal {
    constructor() {
        super(WinScoreSignal.ON_WIN_SCORE);
        this.score = ReelResultData.totalWin;
        // 取得階段判斷資料
        const stepData = GameInfo.getWinScoreSec(ReelResultData.totalWin);
        this.sec = stepData.sec;
        // 分數起始值
        this.respinScoreStart = SlotResultModel.winScoreAccNum;
        // 分數終點值
        this.respinScoreEnd = SlotResultModel.winScoreAccNum + ReelResultData.totalWin;
        // 累加 respin 遊戲分數
        SlotResultModel.winScoreAccNum = this.respinScoreEnd;
    }
}

WinScoreSignal.ON_WIN_SCORE = 'ON_WIN_SCORE';

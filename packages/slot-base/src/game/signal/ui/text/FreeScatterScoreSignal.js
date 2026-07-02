import Signal from 'base/Signal';
import FreeResultModel from 'game/model/FreeResultModel';

export default class FreeScatterScoreSignal extends Signal {
    constructor() {
        super(FreeScatterScoreSignal.ON_SCATTER_SCORE_TRIGGER);
        this.freeScoreStart = 0;
        this.freeScoreEnd = FreeResultModel.accumlateWinAmt;
    }
}
FreeScatterScoreSignal.ON_SCATTER_SCORE_TRIGGER = 'ON_SCATTER_SCORE_TRIGGER';

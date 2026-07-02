import Signal from 'base/Signal';
import BonusResultModel from 'game/model/BonusResultModel';

export default class LuckyDrawScoreSignal extends Signal {
    constructor() {
        super(LuckyDrawScoreSignal.ON_LUCKY_DRAW_SCORE);
        this.freeScoreStart = 0;
        this.freeScoreEnd = BonusResultModel.scatterPayFromBaseGame;
    }
}
LuckyDrawScoreSignal.ON_LUCKY_DRAW_SCORE = 'ON_LUCKY_DRAW_SCORE';

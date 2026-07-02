import { Signal, SlotGame } from 'slot-base';

export default class BonusGamePlaySignal extends Signal {
    constructor() {
        super(BonusGamePlaySignal.ON_PLAY_BONUS_GAME_SIGNAL);
        this.playerBet = SlotGame.BonusResultModel.playerBet;
        this.accumlateWinAmt = SlotGame.BonusResultModel.accumlateWinAmt;
        this.scatterPayFromBaseGame = SlotGame.BonusResultModel.scatterPayFromBaseGame;
        this.gameComplete = SlotGame.BonusResultModel.gameComplete;
        this.dataSet = SlotGame.BonusResultModel.dataSet;
    }
}
BonusGamePlaySignal.ON_PLAY_BONUS_GAME_SIGNAL = 'ON_PLAY_BONUS_GAME_SIGNAL';

import { Signal, SlotGame } from 'slot-base';

export default class BonusGameTriggerSignal extends Signal {
    constructor() {
        super(BonusGameTriggerSignal.ON_TRIGGER_BONUS_GAME_SIGNAL);
        this.symbolIdAry = SlotGame.ReelResultData.symbolIdAry;
        // 中的倍數 [陣列]
        this.bonusResultAry = SlotGame.ReelResultData.lineMultiplierAry;
    }
}
BonusGameTriggerSignal.ON_TRIGGER_BONUS_GAME_SIGNAL = 'ON_TRIGGER_BONUS_GAME_SIGNAL';

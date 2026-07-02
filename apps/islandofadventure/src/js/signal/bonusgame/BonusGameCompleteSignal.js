import { Signal } from 'slot-base';

export default class BonusGameCompleteSignal extends Signal {
    constructor() {
        super(BonusGameCompleteSignal.ON_COMPLETE_BONUS_GAME_SIGNAL);
    }
}
BonusGameCompleteSignal.ON_COMPLETE_BONUS_GAME_SIGNAL = 'ON_COMPLETE_BONUS_GAME_SIGNAL';

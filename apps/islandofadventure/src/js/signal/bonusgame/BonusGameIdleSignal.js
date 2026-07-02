import { Signal } from 'slot-base';

export default class BonusGameIdleSignal extends Signal {
    constructor() {
        super(BonusGameIdleSignal.ON_IDLE_BONUS_GAME_SIGNAL);
    }
}
BonusGameIdleSignal.ON_IDLE_BONUS_GAME_SIGNAL = 'ON_IDLE_BONUS_GAME_SIGNAL';

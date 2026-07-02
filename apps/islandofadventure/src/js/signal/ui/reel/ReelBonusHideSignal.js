import { Signal } from 'slot-base';

export default class ReelBonusHideSignal extends Signal {
    constructor() {
        super(ReelBonusHideSignal.ON_BONUS_HIDE_SYMBOL);
    }
}
ReelBonusHideSignal.ON_BONUS_HIDE_SYMBOL = 'ON_SCATTER_HIDE_SYMBOL';

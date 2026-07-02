import { Signal } from 'slot-base';

export default class ReelSymbolBlowUpSignal extends Signal {
    constructor() {
        super(ReelSymbolBlowUpSignal.ON_REEL_BLOW_UP_SYMBOL_DECLINE);
    }
}
ReelSymbolBlowUpSignal.ON_REEL_BLOW_UP_SYMBOL_DECLINE = 'ON_REEL_BLOW_UP_SYMBOL_DECLINE';

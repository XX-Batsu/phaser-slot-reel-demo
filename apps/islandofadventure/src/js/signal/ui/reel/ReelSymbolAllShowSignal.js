import { Signal } from 'slot-base';

export default class ReelSymbolAllShowSignal extends Signal {
    constructor() {
        super(ReelSymbolAllShowSignal.ON_REEL_SYMBOL_ALL_SHOW);
    }
}
ReelSymbolAllShowSignal.ON_REEL_SYMBOL_ALL_SHOW = 'ON_REEL_SYMBOL_ALL_SHOW';

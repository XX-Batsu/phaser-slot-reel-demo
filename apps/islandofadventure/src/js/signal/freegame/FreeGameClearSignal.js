import { Signal } from 'slot-base';

export default class FreeGameClearSignal extends Signal {
    constructor() {
        super(FreeGameClearSignal.ON_FREE_CLEAR_SIGNAL);
    }
}
FreeGameClearSignal.ON_FREE_CLEAR_SIGNAL = 'ON_FREE_CLEAR_SIGNAL';

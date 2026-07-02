import { Signal } from 'slot-base';

export default class ReelWinHideSignal extends Signal {
    constructor() {
        super(ReelWinHideSignal.ON_WINHIDE_SYMBOL);
    }
}
ReelWinHideSignal.ON_WINHIDE_SYMBOL = 'ON_WINHIDE_SYMBOL';

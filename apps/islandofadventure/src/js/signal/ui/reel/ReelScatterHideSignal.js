import { Signal } from 'slot-base';

export default class ReelScatterHideSignal extends Signal {
    constructor() {
        super(ReelScatterHideSignal.ON_SCATTER_HIDE_SYMBOL);
    }
}
ReelScatterHideSignal.ON_SCATTER_HIDE_SYMBOL = 'ON_SCATTER_HIDE_SYMBOL';

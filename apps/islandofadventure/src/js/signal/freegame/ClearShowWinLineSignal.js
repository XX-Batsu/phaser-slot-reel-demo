import { Signal } from 'slot-base';
/**
 * 清除秀贏分框
 */
export default class ClearShowWinLineSignal extends Signal {
    constructor() {
        super(ClearShowWinLineSignal.ON_CLEAR_SHOW_LINE);
    }
}
ClearShowWinLineSignal.ON_CLEAR_SHOW_LINE = 'ON_CLEAR_SHOW_LINE';

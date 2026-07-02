import { Signal } from 'slot-base';
/**
 * 清除秀贏分框
 */
export default class ClearShowBorderSignal extends Signal {
    constructor() {
        super(ClearShowBorderSignal.ON_CLEAR_SHOW_BORDER);
    }
}
ClearShowBorderSignal.ON_CLEAR_SHOW_BORDER = 'ON_CLEAR_SHOW_BORDER';

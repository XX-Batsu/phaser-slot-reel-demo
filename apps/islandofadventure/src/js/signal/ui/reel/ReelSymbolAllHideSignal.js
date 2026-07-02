import { Signal, SlotGame } from 'slot-base';

export default class ReelSymbolAllHideSignal extends Signal {
    constructor() {
        super(ReelSymbolAllHideSignal.ON_REEL_SYMBOL_ALL_HIDE);
        this.level = SlotGame.FreeResultModel.currentRound;
    }
}
ReelSymbolAllHideSignal.ON_REEL_SYMBOL_ALL_HIDE = 'ON_REEL_SYMBOL_ALL_HIDE';

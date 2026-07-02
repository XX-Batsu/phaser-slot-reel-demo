import { Signal, SlotGame } from 'slot-base';

export default class FreeGameTriggerSignal extends Signal {
    constructor() {
        super(FreeGameTriggerSignal.ON_SHOW_FREE_TRIGGER);
        this.isMaxSpin = SlotGame.FreeResultModel.isMaxSpin;
        this.count = SlotGame.FreeResultModel.totalFreeCount; // 5 10 15
        this.multiple = SlotGame.FreeResultModel.multiple;
    }
}
FreeGameTriggerSignal.ON_SHOW_FREE_TRIGGER = 'ON_SHOW_FREE_TRIGGER';

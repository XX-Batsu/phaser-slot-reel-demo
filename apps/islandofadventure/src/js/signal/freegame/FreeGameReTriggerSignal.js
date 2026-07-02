import { Signal, SlotGame } from 'slot-base';

export default class FreeGameReTriggerSignal extends Signal {
    constructor() {
        super(FreeGameReTriggerSignal.ON_RETRIGGER_COUNT);
        this.count = SlotGame.FreeResultModel.RetriggerAddSpins;
        this.totalFreeCount = SlotGame.FreeResultModel.totalFreeCount;
        this.isMaxSpin = SlotGame.FreeResultModel.isMaxSpin;
    }
}
FreeGameReTriggerSignal.ON_RETRIGGER_COUNT = 'ON_RETRIGGER_COUNT';

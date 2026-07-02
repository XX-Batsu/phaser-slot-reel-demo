import Signal from 'base/Signal';
import FreeResultModel from 'game/model/FreeResultModel';

export default class FreeGameReTriggerCountSignal extends Signal {
    constructor() {
        super(FreeGameReTriggerCountSignal.ON_RETRIGGER_COUNT_TEXT_SIGNAL);
        this.freeCount = FreeResultModel.freeLastCount;
        this.count = FreeResultModel.RetriggerAddSpins;
        this.isMaxSpin = FreeResultModel.isMaxSpin;
        // Round
        this.awardRound = FreeResultModel.awardRound;
        this.currentRound = FreeResultModel.currentRound;
        this.retriggerAddRounds = FreeResultModel.retriggerAddRounds;
        this.isMaxRound = FreeResultModel.isMaxRound;
    }
}
FreeGameReTriggerCountSignal.ON_RETRIGGER_COUNT_TEXT_SIGNAL = 'ON_RETRIGGER_COUNT_TEXT_SIGNAL';

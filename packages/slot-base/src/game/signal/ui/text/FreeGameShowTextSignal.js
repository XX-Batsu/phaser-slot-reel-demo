import Signal from 'base/Signal';
import FreeResultModel from 'game/model/FreeResultModel';

export default class FreeGameShowTextSignal extends Signal {
    constructor() {
        super(FreeGameShowTextSignal.ON_SHOW_FREECOUNT_TEXT);
        this.freeCount = FreeResultModel.freeLastCount;
        this.isMaxSpin = FreeResultModel.isMaxSpin;
    }
}
FreeGameShowTextSignal.ON_SHOW_FREECOUNT_TEXT = 'ON_SHOW_FREECOUNT_TEXT';

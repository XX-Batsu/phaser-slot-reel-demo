import { SlotGame } from 'slot-base';
import WinDataVoSignal from 'js/signal/windata/data/WinDataVoSignal';

export default class ScatterPlaySignal extends WinDataVoSignal {
    constructor() {
        super(ScatterPlaySignal.ON_SCATTER_TRIGGER_EFFECT);
        // 是否 max spin
        this.isMaxSpin = SlotGame.FreeResultModel.isMaxSpin;
        // 目前是否有次數
        this.count = SlotGame.FreeResultModel.totalFreeCount;

        this.totalFreeCount = SlotGame.FreeResultModel.totalFreeCount;
    }
}
ScatterPlaySignal.ON_SCATTER_TRIGGER_EFFECT = 'ON_SCATTER_TRIGGER_EFFECT';

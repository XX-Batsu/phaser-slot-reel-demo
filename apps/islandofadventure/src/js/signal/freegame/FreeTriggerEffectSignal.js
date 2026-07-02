import { Signal } from 'slot-base';

export default class FreeTriggerEffectSignal extends Signal {
    constructor() {
        // Free Game 轉場動畫
        super(FreeTriggerEffectSignal.ON_FREE_TRIGGER_EFFECT);
    }
}
FreeTriggerEffectSignal.ON_FREE_TRIGGER_EFFECT = 'ON_FREE_TRIGGER_EFFECT';

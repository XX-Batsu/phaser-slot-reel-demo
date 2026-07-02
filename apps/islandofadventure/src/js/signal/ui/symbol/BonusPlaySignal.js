import WinDataVoSignal from 'js/signal/windata/data/WinDataVoSignal';

export default class BonusPlaySignal extends WinDataVoSignal {
    constructor() {
        super(BonusPlaySignal.ON_BONUS_TRIGGER_EFFECT);
    }
}
BonusPlaySignal.ON_BONUS_TRIGGER_EFFECT = 'ON_BONUS_TRIGGER_EFFECT';

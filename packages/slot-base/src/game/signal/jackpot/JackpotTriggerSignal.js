import Signal from 'base/Signal';
import ReelResultData from 'game/model/ReelResultData';

export default class JackpotTriggerSignal extends Signal {
    constructor() {
        super(JackpotTriggerSignal.ON_TRIGGER_JACKPOT_SIGNAL);
        this.symbolIdAry = ReelResultData.symbolIdAry;
        // 中的倍數 [陣列]
        this.bonusResultAry = ReelResultData.lineMultiplierAry;
    }
}
JackpotTriggerSignal.ON_TRIGGER_JACKPOT_SIGNAL = 'ON_TRIGGER_JACKPOT_SIGNAL';

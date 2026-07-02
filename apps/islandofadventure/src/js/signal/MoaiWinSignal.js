import { Signal, SlotGame } from 'slot-base';

export default class MoaiWinSignal extends Signal {
    constructor() {
        super(MoaiWinSignal.ON_MOAI_WIN);
        this.winType = SlotGame.ReelResultData.winType;
    }
}
MoaiWinSignal.ON_MOAI_WIN = 'ON_MOAI_WIN';

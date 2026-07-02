import { Signal, SlotGame } from 'slot-base';

export default class ReelRefreshSignal extends Signal {
    constructor() {
        super(ReelRefreshSignal.ON_REEL_REFRESH);
        this.gameInfoRange = SlotGame.GameInfo.inGameRangeData.freeStrip;
    }
}
ReelRefreshSignal.ON_REEL_REFRESH = 'ON_REEL_REFRESH';

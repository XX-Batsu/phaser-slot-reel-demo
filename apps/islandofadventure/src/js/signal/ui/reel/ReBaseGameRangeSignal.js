import { Signal, SlotGame } from 'slot-base';

export default class ReBaseGameRangeSignal extends Signal {
    constructor() {
        super(ReBaseGameRangeSignal.ON_REBASE_GAME_RANGE);
        this.rangeIndexData = SlotGame.SlotResultModel.rngData;
        this.gameInfoRange = SlotGame.GameInfo.inGameRangeData.baseStrip[SlotGame.GameInfo.extraBet];
    }
}
ReBaseGameRangeSignal.ON_REBASE_GAME_RANGE = 'ON_REBASE_GAME_RANGE';

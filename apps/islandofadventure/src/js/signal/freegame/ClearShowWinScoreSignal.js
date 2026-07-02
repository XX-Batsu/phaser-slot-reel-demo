import { Signal } from 'slot-base';
/**
 * 清除畫面贏分
 */
export default class ClearShowWinScoreSignal extends Signal {
    constructor() {
        super(ClearShowWinScoreSignal.ON_CLEAR_SHOWWIN_SCORE);
    }
}
ClearShowWinScoreSignal.ON_CLEAR_SHOWWIN_SCORE = 'ON_CLEAR_SHOWWIN_SCORE';

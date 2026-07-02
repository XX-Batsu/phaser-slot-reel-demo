import Event from 'base/Event';

export default class LineEvent extends Event {
    constructor(betNum = 1) {
        super(LineEvent.ON_BET_SELECT_CHANGE);
        // 更變線數
        this.changeBetNum = betNum;
    }
}
LineEvent.ON_BET_SELECT_CHANGE = 'ON_BET_SELECT_CHANGE';

import Event from 'base/Event';

export default class LineEvent extends Event {
    constructor(type, lineAry) {
        super(type);
        // 線數
        this.lineAry = lineAry;
    }
}
LineEvent.ON_SHOWLINE_WIN = 'ON_SHOWLINE_WIN';

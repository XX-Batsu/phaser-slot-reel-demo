import Signal from 'base/Signal';

export default class BaseGameShowTextSignal extends Signal {
    constructor() {
        super(BaseGameShowTextSignal.ON_HIDE_FREECOUNT_TEXT);
    }
}
BaseGameShowTextSignal.ON_HIDE_FREECOUNT_TEXT = 'ON_HIDE_FREECOUNT_TEXT';

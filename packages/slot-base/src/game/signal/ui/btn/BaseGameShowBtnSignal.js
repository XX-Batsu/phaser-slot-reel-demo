import Signal from 'base/Signal';

export default class BaseGameShowBtnSignal extends Signal {
    constructor() {
        super(BaseGameShowBtnSignal.ON_BASE_SHOW_MENUBTN);
    }
}
BaseGameShowBtnSignal.ON_BASE_SHOW_MENUBTN = 'ON_BASE_SHOW_MENUBTN';

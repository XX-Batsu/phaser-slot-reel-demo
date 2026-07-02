import Signal from 'base/Signal';

export default class FreeGameHideBtnSignal extends Signal {
    constructor() {
        super(FreeGameHideBtnSignal.ON_FREE_HIDE_MENUBTN);
    }
}
FreeGameHideBtnSignal.ON_FREE_HIDE_MENUBTN = 'ON_FREE_HIDE_MENUBTN';

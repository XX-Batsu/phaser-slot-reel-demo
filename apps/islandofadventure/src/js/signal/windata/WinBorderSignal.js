import WinDataVoSignal from 'js/signal/windata/data/WinDataVoSignal';

export default class WinBorderSignal extends WinDataVoSignal {
    /**
     * 贏得獎項
     */
    constructor() {
        super(WinBorderSignal.ON_BORDER_WINLINE);
    }
}
WinBorderSignal.ON_BORDER_WINLINE = 'ON_BORDER_WINLINE';

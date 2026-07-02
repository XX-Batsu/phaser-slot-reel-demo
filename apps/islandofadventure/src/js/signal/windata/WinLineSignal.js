import WinDataVoSignal from 'js/signal/windata/data/WinDataVoSignal';

/**
 * 此格式已支援FreeGame與BaseGame轉動資料
 */
export default class WinLineSignal extends WinDataVoSignal {
    constructor() {
        super(WinLineSignal.ON_LINEBAR_WINLINE);
    }
}

WinLineSignal.ON_LINEBAR_WINLINE = 'ON_LINEBAR_WINLINE';

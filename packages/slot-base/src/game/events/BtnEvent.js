import Event from 'base/Event';

export default class BtnEvent extends Event {
    constructor(type, paramAry = []) {
        super(BtnEvent.ON_BTN_CLICK);
        // 按鈕狀態
        this.clickType = type;
        this.params = paramAry;
    }
}
BtnEvent.ON_BTN_CLICK = 'ON_BTN_CLICK';

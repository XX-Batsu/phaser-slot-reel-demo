import Event from 'base/Event';

export default class CashoutEvent extends Event {
    constructor(type) {
        super(type);
        // 按鈕狀態
        this.eventType = type;
        this.cashoutCurrencyAry = [];
    }
}
CashoutEvent.ON_REQUEST = 'ON_CASHOUT_REQUEST';
CashoutEvent.ON_RESPONSE = 'ON_CASHOUT_RESPONSE';
CashoutEvent.ON_CANCEL = 'ON_CASHOUT_CANCEL';

import Event from 'base/Event';

export default class ExchangeCurrencyEvent extends Event {
    constructor(type) {
        super(type);
        // 按鈕狀態
        this.eventType = type;
        this.type = 0;
        this.amount = 0;
        this.gameCredit = 0;
    }
}
ExchangeCurrencyEvent.ON_REQUEST = 'ON_EXCHANGE_REQUEST';
ExchangeCurrencyEvent.ON_RESPONSE = 'ON_EXCHANGE_RESPONSE';

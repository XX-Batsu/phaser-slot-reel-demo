import Event from 'base/Event';

export default class RefreshCurrencyEvent extends Event {
    constructor(type) {
        super(type);
        // 按鈕狀態
        this.eventType = type;
    }
}
RefreshCurrencyEvent.ON_REQUEST = 'ON_REFRESH_REQUEST';
RefreshCurrencyEvent.ON_RESPONSE = 'ON_REFRESH_RESPONSE';

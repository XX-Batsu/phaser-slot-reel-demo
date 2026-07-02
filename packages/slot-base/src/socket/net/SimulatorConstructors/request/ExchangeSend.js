import RequestBase from '../utils/RequestBase';
import WebApiStatesConfig from '../WebApiStatesConfig';

export default class ExchangeSend extends RequestBase {
    constructor() {
        super(
            'post',
            WebApiStatesConfig.PACKET_EXCHANGE,
            {
                coin_type: 0,
                coin_amount: 0
            }
        );
    }

    setCurrencyType(value) {
        this.data.payload.coin_type = value;
    }

    setCurrencyAmount(value) {
        this.data.payload.coin_amount = value;
    }
}

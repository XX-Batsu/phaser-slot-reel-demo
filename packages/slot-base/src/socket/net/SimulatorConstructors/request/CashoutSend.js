import RequestBase from '../utils/RequestBase';
import WebApiStatesConfig from '../WebApiStatesConfig';

export default class CashoutSend extends RequestBase {
    constructor() {
        super(
            'post',
            WebApiStatesConfig.PACKET_CHECKOUT,
            {}
        );
    }
}

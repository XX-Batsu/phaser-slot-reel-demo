import RequestBase from '../utils/RequestBase';
import WebApiStatesConfig from '../WebApiStatesConfig';

export default class InitialSend extends RequestBase {
    constructor() {
        super(
            'post',
            WebApiStatesConfig.PACKET_INIT,
            {}
        );
    }
}

import ResuestBase from '../utils/RequestBase';
import WebApiStatesConfig from '../WebApiStatesConfig';

export default class RefreshSend extends ResuestBase {
    constructor() {
        super(
            'post',
            WebApiStatesConfig.PACKET_UPDATE_CURRENCY,
            {}
        );
    }
}

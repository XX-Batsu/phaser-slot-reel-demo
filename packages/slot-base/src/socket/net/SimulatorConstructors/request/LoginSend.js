import RequestBase from '../utils/RequestBase';
import WebApiStatesConfig from '../WebApiStatesConfig';

export default class LoginSend extends RequestBase {
    constructor() {
        super(
            'post',
            WebApiStatesConfig.PACKET_LOGIN,
            {}
        );
    }
}

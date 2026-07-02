import RequestBase from '../utils/RequestBase';
import WebApiStatesConfig from '../WebApiStatesConfig';

export default class DoubleUpSend extends RequestBase {
    constructor() {
        super(
            'post',
            WebApiStatesConfig.PACKET_ADDING_BET,
            {
                enumOperationType: -1
            }
        );
    }

    setEnumOperationType(value) {
        this.data.payload.enumOperationType = value;
    }
}

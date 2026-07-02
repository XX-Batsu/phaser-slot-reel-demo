import RequestBase from '../utils/RequestBase';
import WebApiStatesConfig from '../WebApiStatesConfig';

export default class BetSend extends RequestBase {
    constructor() {
        super(
            'post',
            WebApiStatesConfig.PACKET_BET,
            {
                enumOperationType: 2,
                enumBetBaseType: [ 0, 0, 0, 0, 0, 0, 0, 0 ],
                enumBetMultiply: 0
            }
        );
    }

    setEnumOperationType(value) {
        this.data.payload.enumOperationType = value;
    }

    setEnumBetBaseType(value) {
        this.data.payload.enumBetBaseType = value;
    }

    enumBetMultiply(value) {
        this.data.payload.enumBetMultiply = value;
    }
}

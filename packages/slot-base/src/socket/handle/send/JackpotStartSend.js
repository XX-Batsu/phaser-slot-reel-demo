import DataBase from 'socket/base/DataBase';
import GameFlowData from 'socket/handle/send/data/GameFlowData';

export default class JackpotStartSend extends DataBase {
    constructor() {
        super();
        this.data = new GameFlowData();
    }
}

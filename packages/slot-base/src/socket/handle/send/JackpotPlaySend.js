import DataBase from 'socket/base/DataBase';
import GameFlowData from 'socket/handle/send/data/GameFlowData';

export default class JackpotPlaySend extends DataBase {
    constructor() {
        super();
        this.data = new GameFlowData();
        // 玩家選擇項目的 Index
        this.SelectIndex = 0;
    }
}

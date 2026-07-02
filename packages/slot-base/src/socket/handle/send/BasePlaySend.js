import DataBase from 'socket/base/DataBase';
import GameFlowData from 'socket/handle/send/data/GameFlowData';

export default class BasePlaySend extends DataBase {
    constructor() {
        super();
        // Game Id  [GameFlowData]
        this.data = new GameFlowData();
        this.PlayLine = 1;
        this.PlayBet = 1;
        this.IsExtraBet = 0;
        this.PlayDenom = 1;
        this.MiniBet = 0;
        this.ReelPay = 0;
        this.ReelSelected = [];
        this.ActionMode = 0;
    }
}

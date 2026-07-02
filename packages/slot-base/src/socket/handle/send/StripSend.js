import DataBase from 'socket/base/DataBase';
import GameInfoData from 'socket/handle/send/data/GameInfoData';

export default class StripSend extends DataBase {
    constructor() {
        super();
        this.data = new GameInfoData();
        this.State = 0;
    }
}

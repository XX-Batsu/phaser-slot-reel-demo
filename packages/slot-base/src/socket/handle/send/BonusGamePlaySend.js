import DataBase from 'socket/base/DataBase';
import GameFlowData from 'socket/handle/send/data/GameFlowData';

export default class BonusGamePlaySend extends DataBase {
    constructor() {
        super();
        // ID類別
        this.data = new GameFlowData();
        /**
        * 遊戲進行的階段,
        * 不同值表示不同的遊戲玩法 ,
        * 例如:Phoenix,總共有0、1和2三種階段
        *
        * 0: 選擇固定場次或隨機場次和倍數
        * 1: 選擇倍數
        * 2: 選擇場次
        * 3: 適合用風火輪、發發發類似遊戲，只取extraData的遊戲
        * 4: luckyDraw
        */
        this.PlayerSelectState = 0;
        // 玩家選擇的index
        this.PlayerSelectIndex = 0;
    }
}

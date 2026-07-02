import { SlotGame, GameBase, Overlay, Sound } from 'slot-base';

import Config from 'js/main/Config';

export default class HelpView extends GameBase {
    constructor(game) {
        super(game);
        this.game = game;
        this.addEventListener(SlotGame.GameEvent.STATES, this.gameSlotStates, this);
    }

    /**
     * 遊戲狀態
     * @param {Object} evt SlotGame.GameEvent夾帶資料
     */
    gameSlotStates(evt) {
        switch (evt.statesType) {
            // 開啟規則說明
            case SlotGame.GaStatesConfig.gameHelp:
                break;
            default:
        }
    }
}

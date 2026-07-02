import Sound from 'base/Sound';
// model
import GameInfo from 'game/model/GameInfo';
// main
import GaStatesConfig from 'game/main/GaStatesConfig';
import MainStatesConfig from 'game/main/MainStatesConfig';
// 事件
import GameEvent from 'game/events/GameEvent';
import UiActionEvent from 'game/events/UiActionEvent';

export default class KeyBoardControl {
    constructor(target) {
        this.targetContext = target;
    }

    // 觸發鍵盤事件
    callKeyBoardEvent() {
        switch (GameInfo.gameSlotStates) {
            // spin
            case MainStatesConfig.GAME_STATUS_IDLE: {
                if (this.targetContext.checkCredit() && !this.targetContext.isUIBusy) {
                    Sound.playBtnSpin();
                    this.targetContext.allowPlay();
                    return;
                }
                if (!this.targetContext.checkCredit() && !this.targetContext.isUIBusy) {
                    Sound.playBtnSpin();
                    this.targetContext.insufficientBalance();
                }
                break;
            }
            // stop
            case MainStatesConfig.GAME_STATUS_SPIN: {
                this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.gameStop));
                break;
            }
            // 取分
            case MainStatesConfig.GAME_STATUS_SHOWWIN: {
                this.targetContext.callTakeWinEvent();
                break;
            }
            // 關閉 free game 入場圖
            case MainStatesConfig.GAME_STATUS_FG_TRIGGER: {
                this.targetContext.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_CLOSE_FREE_TRIGGER));
                break;
            }
            case MainStatesConfig.GAME_STATUS_FG_COMPLETE: {
                this.targetContext.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_CLOSE_FREE_CONGRATS));
                break;
            }
            case MainStatesConfig.GAME_STATUS_FG_LUCKY_BONUS: {
                this.targetContext.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_CLOSE_FREE_RETRIGGER));
                break;
            }
            // 停止 big win
            case MainStatesConfig.GAME_STATUS_BEFORE_SHOWWIN:
            case MainStatesConfig.GAME_STATUS_FG_BEFORE_SHOWWIN: {
                this.targetContext.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_BIGWIN_STOP));
                break;
            }
            // free game 贏分動畫時直接取分 進入下一場
            case MainStatesConfig.GAME_STATUS_FG_SHOWWIN_EXTRA:
            case MainStatesConfig.GAME_STATUS_FG_SHOWWIN: {
                this.targetContext.callTakeWinEvent();
                break;
            }
            // 關閉 Jackpot 結算畫面
            case MainStatesConfig.GAME_STATUS_JP_COMPLETE: {
                this.targetContext.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_CLOSE_JACKPOT_CONGRATS));
                break;
            }
            default:
        }
    }

}

// model
import GameInfo from 'game/model/GameInfo';

export default class ControlBase {
    constructor(target) {
        this.targetContext = target;
        this.statesMap = [];
        this.statesFunMap = [];
        this.statesFunTarget = [];
    }

    // 註冊控制事件
    addEventInit(statesName, fun, target) {
        this.statesMap.push(statesName);
        this.statesFunMap.push(fun);
        this.statesFunTarget.push(target);
    }

    // 觸發目前流程執行該註冊的動作
    callInStates() {
        const isUseEvent = this.statesMap.indexOf(GameInfo.gameSlotStates);
        if (isUseEvent !== -1) {
            const target = this.statesFunTarget[isUseEvent];
            this.statesFunMap[isUseEvent].call(target);
            return true;
        }
        return false;
    }

    // Socket 通知下一個場景的動作
    gotoNextStage(nextModule) {
        switch (nextModule) {
            // 一般流程
            case 0: {
                this.goToBaseGame();
                break;
            }
            // 接FreeGame
            case 20: {
                this.goToFreeGame();
                break;
            }
            // 風火輪
            case 30: {
                this.goToExtraGame();
                break;
            }
            // 選場次和選次數
            case 40: {
                this.gotToBonusGame();
                break;
            }
            // progressive jackpot
            case 50: {
                this.gotToJackpot();
                break;
            }
            default:
        }
    }

    // 前往BaseGame [依照遊戲Control States來控制返回動作]
    goToBaseGame() {}
    // 前往FreeGame
    goToFreeGame() {
        this.targetContext.mainContext.sendFreeGameStart(); // 這塊可能之後要改等收到結果才能進入FreeGame
    }
    // 前往ExtraGame
    goToExtraGame() {}
    // 前往BonusGame Or Lucky Draw
    gotToBonusGame() {
        this.targetContext.mainContext.sendBonusGameStart();
    }
    // 前往Jackpot
    gotToJackpot() {
        this.targetContext.mainContext.sendJackpotStart();
    }
}

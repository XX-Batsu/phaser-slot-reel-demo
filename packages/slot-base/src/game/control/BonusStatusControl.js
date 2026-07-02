import ConfigPasser from 'base/ConfigPasser';
import GameInfo from 'game/model/GameInfo';
import ControlBase from 'game/base/ControlBase';
import BonusResultModel from 'game/model/BonusResultModel';
import ReelResultData from 'game/model/ReelResultData';

import GaStatesConfig from 'game/main/GaStatesConfig';
import MainStatesConfig from 'game/main/MainStatesConfig';
import BonusConfig from 'game/main/BonusConfig';
import SlotResultModel from 'game/model/SlotResultModel';

import GameEvent from 'game/events/GameEvent';

export default class BonusStatusControl extends ControlBase {
    constructor(target) {
        super(target);
        // 註冊 Free Game 控制流程
        this.addEventInit(MainStatesConfig.GAME_STATUS_BG_TRIGGER, this.onBgTrigger, this);
        this.addEventInit(MainStatesConfig.GAME_STATUS_BG_IDLE, this.onBgIdle, this);
        this.addEventInit(MainStatesConfig.GAME_STATUS_BG_SPIN, this.onBgSpin, this);
        this.addEventInit(MainStatesConfig.GAME_STATUS_BG_COMPLETE, this.onBgComplete, this);
    }

    // # 以下為流程狀態機執行動作

    // 觸發BonusGame過場
    onBgTrigger() {
        GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_BG_IDLE;
        this.targetContext.animationAddEventInPlay(this.targetContext.befroEffectTarget.bonusIdle);
    }

    // Bonus進行操作後返回通知不再是靜止狀態 [重要]
    onBgIdle() {
        GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_BG_SPIN;
        // 通知 點選Play動作並且傳送玩家所選擇的 場景 跟 寶箱位置
        this.targetContext.mainContext.sendBonusGamePlay(BonusConfig.SELECT_STATE, BonusConfig.SELECT_INDEX);
    }

    // 通知BonusGame Play動作已結束
    onBgSpin() {
        // 判斷是否離開BonusGame 否則為BG_IDLE
        if (BonusConfig.IS_GAME_OUT) {
            GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_BG_COMPLETE;
            this.targetContext.mainContext.sendBonusGameComplete();
            return;
        }
        // 回去idle
        GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_BG_IDLE;
        this.targetContext.animationAddEventInPlay(this.targetContext.befroEffectTarget.bonusIdle);
    }

    // BonusGame 結算已結束
    onBgComplete() {
        // 關閉Bonus參數
        GameInfo.isBonusSpin = false;
        this.gotoNextStage(BonusResultModel.nextModule);
    }

    // # 以下為複寫函數

    // 複寫 NextModule 的返回BaseGame動作
    goToBaseGame() {
        const isSetConfig = (ConfigPasser.instance.BONUS_OVER_SCORE !== undefined && ConfigPasser.instance.BONUS_ADDSOCRE_BONUS_WIN !== undefined);
        // free game 離開一定是 respin
        GameInfo.isReSpin = (ConfigPasser.instance.IS_RESPIN);
        // BonusGame總分數加到BaseGame Bonus Show Win Line 分數上
        if (isSetConfig) {
            const len = ReelResultData.symbolIdAry.length;
            for (let i = 0; i < len; i++) {
                const symbolID = ReelResultData.symbolIdAry[i];
                if (ConfigPasser.instance.BONUS_OVER_SCORE.indexOf(symbolID) !== -1) {
                    ReelResultData.linePrizeAry[i] = BonusResultModel.accumlateWinAmt;
                }
            }
            // 累加總贏分
            ReelResultData.totalWin = BonusResultModel.totalWinAmt;
        }

        // 回去 base game 前清除累積 respin 分數
        SlotResultModel.winScoreAccNum = 0;
        // 切回當時中斷的狀態
        GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_BEFORE_SHOWWIN;
        this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.gameLockBtn));
        this.targetContext.isbigWin(this.targetContext.befroEffectTarget);
    }
}

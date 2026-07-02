import ConfigPasser from 'base/ConfigPasser';
import GameInfo from 'game/model/GameInfo';
import ControlBase from 'game/base/ControlBase';
import JackpotResultModel from 'game/model/JackpotResultModel';
import ReelResultData from 'game/model/ReelResultData';

import GaStatesConfig from 'game/main/GaStatesConfig';
import MainStatesConfig from 'game/main/MainStatesConfig';
import JackpotConfig from 'game/main/JackpotConfig';
import SlotResultModel from 'game/model/SlotResultModel';

import GameEvent from 'game/events/GameEvent';

export default class JackpotStatusControl extends ControlBase {
    constructor(target) {
        super(target);
        // 註冊 Jackpot 控制流程
        this.addEventInit(MainStatesConfig.GAME_STATUS_JP_TRIGGER, this.onJpTrigger, this);
        this.addEventInit(MainStatesConfig.GAME_STATUS_JP_IDLE, this.onJpIdle, this);
        this.addEventInit(MainStatesConfig.GAME_STATUS_JP_SPIN, this.onJpSpin, this);
        this.addEventInit(MainStatesConfig.GAME_STATUS_JP_COMPLETE, this.onJpComplete, this);
    }

    // # 以下為流程狀態機執行動作

    // 觸發Jackpot過場
    onJpTrigger() {
        GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_JP_IDLE;
        this.targetContext.animationAddEventInPlay(this.targetContext.befroEffectTarget.jackpotIdle);
    }

    // Jackpot進行操作後返回通知不再是靜止狀態 [重要]
    onJpIdle() {
        GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_JP_SPIN;
        // 通知 點選Play動作並且傳送玩家所選擇的jackpot選項
        this.targetContext.mainContext.sendJackpotPlay(JackpotConfig.SELECT_INDEX);
    }

    // 通知Jackpot Play動作已結束
    onJpSpin() {
        // 判斷是否離開Jackpot 否則為JP_IDLE
        if (JackpotConfig.IS_GAME_OUT) {
            GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_JP_COMPLETE;
            this.targetContext.mainContext.sendJackpotComplete();
            return;
        }
        // 回去idle
        GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_JP_IDLE;
        this.targetContext.animationAddEventInPlay(this.targetContext.befroEffectTarget.jackpotIdle);
    }

    // Jackpot 結算已結束
    onJpComplete() {
        // 關閉Bonus參數
        GameInfo.isJackpotPlaying = false;
        this.gotoNextStage(JackpotResultModel.returnModule);
    }

    // # 以下為複寫函數

    // 複寫 NextModule 的返回BaseGame動作
    goToBaseGame() {
        const hasJackpotSymbol = (ConfigPasser.instance.JACKPOT_OVER_SCORE !== undefined && ConfigPasser.instance.JACKPOT_ADDSOCRE_BONUS_WIN !== undefined);
        // free game 離開一定是 respin
        GameInfo.isReSpin = (ConfigPasser.instance.IS_RESPIN);
        // Jackpot總分數加到BaseGame Jackpot Show Win Line 分數上
        if (hasJackpotSymbol) {
            const len = ReelResultData.symbolIdAry.length;
            for (let i = 0; i < len; i++) {
                const symbolID = ReelResultData.symbolIdAry[i];
                if (ConfigPasser.instance.JACKPOT_OVER_SCORE.indexOf(symbolID) !== -1) {
                    ReelResultData.linePrizeAry[i] = JackpotResultModel.accumlateWinAmt;
                }
            }
        }
        // 累加總贏分
        ReelResultData.totalWin = JackpotResultModel.totalWinAmt;

        // 回去 base game 前清除累積 respin 分數
        SlotResultModel.winScoreAccNum = 0;
        // 切回當時中斷的狀態
        GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_BEFORE_SHOWWIN;
        this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.gameLockBtn));
        this.targetContext.isbigWin(this.targetContext.befroEffectTarget);
    }
}

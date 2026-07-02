// slot-base
import Sound from 'base/Sound';
import ConfigPasser from 'base/ConfigPasser';
import EffectPasser from 'base/EffectPasser';
// base
import ControlBase from 'game/base/ControlBase';
// model
import GameInfo from 'game/model/GameInfo';
import FreeResultModel from 'game/model/FreeResultModel';
import ReelResultData from 'game/model/ReelResultData';
import SlotResultModel from 'game/model/SlotResultModel';

// main
import GaStatesConfig from 'game/main/GaStatesConfig';
import MainStatesConfig from 'game/main/MainStatesConfig';

// 事件
import GameEvent from 'game/events/GameEvent';
import UITextEvent from 'game/events/UITextEvent';
import LineExtraControl from 'game/control/LineExtraControl';

export default class FreeStatusControl extends ControlBase {
    constructor(target) {
        super(target);
        // 註冊 Free Game 控制流程
        this.addEventInit(MainStatesConfig.GAME_STATUS_FG_TRIGGER, this.onFgTrigger, this);
        this.addEventInit(MainStatesConfig.GAME_STATUS_FG_BEFORE_SPIN, this.onFgBeforeSpin, this);
        this.addEventInit(MainStatesConfig.GAME_STATUS_FG_LUCKY_BONUS, this.onFgBeforeShowWin, this);
        this.addEventInit(MainStatesConfig.GAME_STATUS_FG_BEFORE_SHOWWIN, this.onFgBeforeShowWin, this);
        this.addEventInit(MainStatesConfig.GAME_STATUS_FG_SHOWWIN, this.onFgShowWin, this);
        this.addEventInit(MainStatesConfig.GAME_STATUS_FG_SHOWWIN_EXTRA, this.onFgShowWinExtra, this);
        this.addEventInit(MainStatesConfig.GAME_STATUS_FG_COMPLETE, this.onFgComplete, this);
    }

    // # 以下為流程狀態機執行動作

    // FreeGame過場動畫結束 [20160805新增]
    onFgTrigger() {
        // 啟動(true = 免錢拉)
        FreeResultModel.roundLastCountless();
        // FreeGame新增
        this.targetContext.onDispatchEvent(new UITextEvent(UITextEvent.ON_TEXT_FREECOUNT));
        // 觸發是否可以Spin
        this.targetContext.allowPlay();
    }

    // FreeGame 轉動前特效流程已結束  可以進行free Spin動作
    onFgBeforeSpin() {
        // FREE SPIN狀態
        GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_FG_SPIN;
        // 發佈切換按鈕控制器的狀態
        this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.gameSpin));
        // 轉動動畫事件觸發
        this.targetContext.animationAddEventInPlay(EffectPasser.scheduleAry.freeGame.spin);
        // 轉動前流程結束,發送Spin封包
        this.targetContext.sendPlayData();
        // 立即觸發急停效果 (respin)
        // if (GameInfo.isReSpin) {
        //     this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.gameStop));
        // }

        // 累進free game經過場次
        FreeResultModel.roundLastCountUp();
        this.targetContext.onDispatchEvent(new UITextEvent(UITextEvent.ON_TEXT_UPDATE_FREECOUNT));
    }

    // FreeGame Reel轉動結束觸發的Before_Show流程已結束 可以進行FreeGame 秀線的動作
    onFgBeforeShowWin() {
        this.targetContext.allWinLinebool = false;
        this.targetContext.callTakeWinCount = 0;
        if (!ConfigPasser.instance.IS_FREE_SPINSOUND_PLAY) {
            // FreeGame 背景音效靜音
            Sound.bgVolume = 0;
        }
        // 特殊模式秀線
        const extraBool = LineExtraControl.freeLineExtra;
        // 初始化第一條線
        GameInfo.winLineIndex = 0;
        // 該場有特殊線資料需要呈現
        if (extraBool) {
            GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_FG_SHOWWIN_EXTRA;
            this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.gameWin));
            this.targetContext.animationAddEventInPlay(this.targetContext.befroEffectTarget.winExtra);
            return;
        }

        // 秀線狀態
        GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_FG_SHOWWIN;
        // 發佈切換按鈕控制器的狀態 (會依照接收結果改變 'win' 或是 'noWin' )
        this.targetContext.onDispatchEvent(new GameEvent(this.targetContext.WinEventName));
        // 註冊動畫事件序列 執行秀線流程(會依照接收結果改變 'win' 或是 'noWin' ）
        this.targetContext.animationAddEventInPlay(this.targetContext.schedule);
        // Free Game 判斷是有中獎狀態,進行幾秒後發布TakeWin取分動作,統一大家各自取消當前動畫
        if (this.targetContext.WinEventName === GaStatesConfig.gameWin) {
            // free game 直接輪秀單線
            if (!this.targetContext.allWinLinebool) {
                this.targetContext.singleTimer.start();
            }

            // 設定FreeGame秀線多久後取分
            const delay = Phaser.Timer.SECOND * this.targetContext.showWinLineDelay;
            this.targetContext.freeLineTimer = this.targetContext.game.time.events.add(delay, () => {
                this.targetContext.callTakeWinEvent();
            });
        }
    }

    // FreeGame 秀線動畫流程已結束 [20160805新增]
    onFgShowWin() {
        // 初始化第一條線
        GameInfo.winLineIndex = 0;
        // FreeGame 背景音效回復正常
        Sound.bgVolume = 1;
        const delayPlay = (ReelResultData.totalWin > 0) ? Phaser.Timer.SECOND : Phaser.Timer.HALF;
        this.targetContext.game.time.events.add(delayPlay, () => {
            // 發送免費次數
            if (FreeResultModel.freeLastCount > 0) {
                if (!GameInfo.isReSpin || !ConfigPasser.instance.IS_RESPIN) {
                    // 次數遞減(顯示用)
                    FreeResultModel.roundLastCountless();
                    this.targetContext.onDispatchEvent(new UITextEvent(UITextEvent.ON_TEXT_FREECOUNT));  // FreeCount顯示刷新
                }
                this.targetContext.allowPlay();
                return;
            }

            // 最後一場又贏分 respin
            if (GameInfo.isReSpin && ConfigPasser.instance.IS_RESPIN) {
                this.targetContext.allowPlay();
                return;
            }

            // 當免費次數真的為0時候 秀FreeGame結算畫面
            GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_FG_COMPLETE;
            this.targetContext.mainContext.sendFreeGameComplete();
            this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.gameLockBtn));
        }, this.targetContext);
    }

    // 秀線特殊
    onFgShowWinExtra() {
        const winAddCount = GameInfo.winLineIndex;
        if (winAddCount + 1 >= ReelResultData.winCount || this.targetContext.allWinLinebool) {
            GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_FG_SHOWWIN;
            this.targetContext.animationAddEventInPlay([]);
            this.targetContext.callTakeWinEvent();
            return;
        }
        // 切換到下一條線
        GameInfo.winLineIndex = winAddCount + 1;
        this.targetContext.animationAddEventInPlay(this.targetContext.befroEffectTarget.winExtra);
    }

    // 結算畫面流程結束 [20160805新增]
    onFgComplete() {
        // 關閉免費參數
        GameInfo.isFreeSpin = false;
        // 讀取Socket 發送來的下一個動作
        this.gotoNextStage(FreeResultModel.nextModule);
    }

    // # 以下為複寫函數

    // 複寫 NextModule 的返回BaseGame動作
    goToBaseGame() {
        // 切回上次baseGame剛中Scatter時的Reel紀錄
        SlotResultModel.slotData = SlotResultModel.slotSaveBaseReel;
        // free game 離開一定是 respin
        GameInfo.isReSpin = (ConfigPasser.instance.IS_RESPIN);
        // FreeGame總分數加到BaseGame Scater Show Win Line 分數上
        if (ConfigPasser.instance.FREE_ADDSOCRE_SCATTER_WIN) {
            const len = ReelResultData.symbolIdAry.length;
            for (let i = 0; i < len; i++) {
                const symbolID = ReelResultData.symbolIdAry[i];
                if (ConfigPasser.instance.FREE_OVER_SCORE.indexOf(symbolID) !== -1) {
                    ReelResultData.linePrizeAry[i] = FreeResultModel.accumlateWinAmt;
                }
            }
        }
        // 累加總贏分
        ReelResultData.totalWin = FreeResultModel.totalWinAmt;
        // 切回上一次BaseGame資料(目前Model為FreeGame的)
        this.targetContext.schedule = EffectPasser.scheduleAry.baseGame.noWin;
        this.targetContext.WinEventName = GaStatesConfig.gameNoWin;
        // 寫入是否有贏分
        if (ReelResultData.totalWin > 0) {
            this.targetContext.schedule = EffectPasser.scheduleAry.baseGame.win;
            this.targetContext.WinEventName = GaStatesConfig.gameWin;
        }
        // 並且判斷是否除了scatter之外有沒有中其他LineGame和Total是否為BigWin
        GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_BEFORE_SHOWWIN;
        this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.gameLockBtn));
        // 判斷分數是否有BigWin
        this.targetContext.isbigWin(EffectPasser.scheduleAry.baseGame);
    }
}

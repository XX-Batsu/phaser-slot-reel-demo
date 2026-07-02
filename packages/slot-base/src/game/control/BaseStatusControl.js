import ConfigPasser from 'base/ConfigPasser';
import EffectPasser from 'base/EffectPasser';

import GameInfo from 'game/model/GameInfo';
import ReelResultData from 'game/model/ReelResultData';
import ControlBase from 'game/base/ControlBase';

import GaStatesConfig from 'game/main/GaStatesConfig';
import MainStatesConfig from 'game/main/MainStatesConfig';

import GameEvent from 'game/events/GameEvent';
import LineExtraControl from 'game/control/LineExtraControl';

export default class BaseStatusControl extends ControlBase {
    constructor(target) {
        super(target);
        // 註冊 Base Game 控制流程
        this.addEventInit(MainStatesConfig.GAME_STATUS_BEFORE_SPIN, this.onBeforeSpin, this);
        this.addEventInit(MainStatesConfig.GAME_STATUS_BEFORE_SHOWWIN, this.onBeforeShowWin, this);
        this.addEventInit(MainStatesConfig.GAME_STATUS_SHOWWIN, this.onShowWin, this);
        this.addEventInit(MainStatesConfig.GAME_STATUS_SHOWWIN_EXTRA, this.onShowWinExtra, this);
    }

    // # 以下為流程狀態機執行動作

    // 轉動前特效流程已結束  可以進行Spin動作
    onBeforeSpin() {
        // SPIN狀態
        GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_SPIN;
        // 發佈切換按鈕控制器的狀態
        this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.gameSpin));
        // 轉動動畫事件觸發
        this.targetContext.animationAddEventInPlay(EffectPasser.scheduleAry.baseGame.spin);
        // 轉動前流程結束,發送Spin封包
        this.targetContext.sendPlayData();
        // 立即觸發急停效果
        if (ConfigPasser.instance.RESPIN_MODE === 1 && GameInfo.isReSpin) {
            this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.gameStop));
        }
    }

    // Reel轉動結束觸發的Before_Show流程已結束 可以進行秀線的動作
    onBeforeShowWin() {
        // 是否全部秀分完畢
        this.targetContext.allWinLinebool = false;
        // 判斷贏分資料是否有特殊秀線
        const extraBool = LineExtraControl.lineExtra;
        // 該場有特殊線資料需要呈現
        if (extraBool) {
            GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_SHOWWIN_EXTRA;
            this.targetContext.animationAddEventInPlay([]);
            return;
        }
        // 秀線狀態
        GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_SHOWWIN;

        // 發佈切換按鈕控制器的狀態 (會依照接收結果改變 'win' 或是 'noWin' )
        this.targetContext.onDispatchEvent(new GameEvent(this.targetContext.WinEventName));
        // 註冊動畫事件序列 執行秀線流程(會依照接收結果改變 'win' 或是 'noWin' ）
        this.targetContext.animationAddEventInPlay(this.targetContext.schedule);
        // 如果是自動模式的話,判斷是有中獎狀態,進行幾秒後發布TakeWin取分動作,統一大家各自取消當前動畫
        if (this.targetContext.WinEventName === GaStatesConfig.gameWin) {
            const delay = this.targetContext.showWinLineDelay * Phaser.Timer.SECOND;
            this.targetContext.allLineTimer = this.targetContext.game.time.events.add(delay, () => {
                // 因為延時的關係,必須延時後判斷有人是否手賤愛點AutoStop
                if (GameInfo.isAutoPlay) {
                    this.targetContext.callTakeWinEvent();
                    return;
                }
                // 全 wild 動畫
                if (ConfigPasser.instance.IS_WILD_GROUP && ReelResultData.isAllWild) {
                    this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.gameWin)); // 再重新發一次並且無夾帶Auto = false的事件
                    return;
                }

                if (this.targetContext.allWinLinebool) { return; }

                if (GameInfo.isReSpin && ReelResultData.winCount === 1) {
                    this.targetContext.callTakeWinEvent();
                    this.targetContext.loopCount = 0;
                    return;
                }

                // 開始輪播
                this.targetContext.uiApp.callWinLineEvent();
                this.targetContext.singleTimer.start();
                // 到這裡已經輪播到第二條線了
                this.targetContext.loopCount = 2;
                this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.gameWin)); // 再重新發一次並且無夾帶Auto = false的事件
            });
        }
    }

    // 秀線動畫流程已結束  判別是否進入Auto , ReSpin等等行為
    onShowWin() {
        // 判斷是否ReSpin模式(一般,FreeGame都有支援)
        if (GameInfo.isReSpin) {
            this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.gameLockBtn));
            this.targetContext.allowPlay();   // 啟動(true = 免錢拉)
            return;
        }
        // 返回 Idle 通知 api 結束下注
        this.targetContext.mainContext.sendGameIdle();
        // # 以下是開始判斷是否 自動SPIN , FG_SPIN 還是靜止等的各項觸發
        // 判斷是否自動模式(僅供delayPlay使用)
        if (GameInfo.isAutoPlay) {
            // 判別是否WIN 做Delay
            const delayPlay = (ReelResultData.totalWin > 0) ? Phaser.Timer.SECOND : Phaser.Timer.HALF;
            // Auto Play 延遲 1000 毫秒再開始下一場
            this.targetContext.game.time.events.add(delayPlay, () => {
                // 如果延遲後突然讀到Auto切回一般發布切換狀態為閒置
                (GameInfo.isAutoPlay)
                ? this.targetContext.allowPlay()   // 啟動(因Auto而觸發)
                : this.targetContext.gameStatesChangeIdle(); // 切換狀態為閒置
            }, this.targetContext);
            return;
        }
        // 如果都不是,切換狀態為閒置
        this.targetContext.gameStatesChangeIdle();
    }

    // 特殊模式秀線
    onShowWinExtra() {
        if (GameInfo.isReSpin && this.loopCount >= ReelResultData.winCount) {
            this.callTakeWinEvent();
            this.loopCount = 0;
            return;
        }
        this.loopCount ++;
        this.uiApp.callWinLineEvent();
        this.targetContext.animationAddEventInPlay(this.targetContext.befroEffectTarget.winExtra);
    }
}

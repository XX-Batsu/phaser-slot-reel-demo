// Slot-Base
import Sound from 'base/Sound';
import UiApp from 'base/UiApp';
import SlotSignalSchedule from 'base/SlotSignalSchedule';
import GameBase from 'base/GameBase';
import ConfigTools from 'base/ConfigTools';
import ConfigPasser from 'base/ConfigPasser';
import EffectPasser from 'base/EffectPasser';

// model
import GameInfo from 'game/model/GameInfo';
import FreeResultModel from 'game/model/FreeResultModel';
import ReelResultData from 'game/model/ReelResultData';
import SlotResultModel from 'game/model/SlotResultModel';
import BonusResultModel from 'game/model/BonusResultModel';
import JackpotResultModel from 'game/model/JackpotResultModel';

// Event事件
import GameEvent from 'game/events/GameEvent';
import ReelEvent from 'game/events/ReelEvent';
import BtnEvent from 'game/events/BtnEvent';
import UITextEvent from 'game/events/UITextEvent';
import MessageEvent from 'game/events/MessageEvent';

// main
import GaStatesConfig from 'game/main/GaStatesConfig';
import MainStatesConfig from 'game/main/MainStatesConfig';
import BonusConfig from 'game/main/BonusConfig';
import JackpotConfig from 'game/main/JackpotConfig';

// Control
import KeyBoardControl from 'game/control/KeyBoardControl';
import BtnControl from 'game/control/BtnControl';
import BaseStatusControl from 'game/control/BaseStatusControl';
import FreeStatusControl from 'game/control/FreeStatusControl';
import BonusStatusControl from 'game/control/BonusStatusControl';
import JackpotStatusControl from 'game/control/JackpotStatusControl';
import LineExtraControl from 'game/control/LineExtraControl';
import getCurLangID from 'tools/getCurLangID';

import Currency from 'game/main/Currency';
import GetProjectInfo from 'base/GetProjectInfo';
// import ShowWinControl from 'game/control/ShowWinControl';

export default class SlotBase extends GameBase {
    constructor(context) {
        super(context.game);

        // 判斷總集
        this.controlMap = [];
        this.isSpinBool = false;
        // Socket
        this.mainContext = context;
        // 音效初始化
        const sound = new Sound(context.game);
        // 將 Config 資料設定進去 Sound
        sound.numReels = ConfigPasser.instance.NUM_REELS;

        // 事件序列註冊器
        this.slotAnimationStates = new SlotSignalSchedule();
        this.slotAnimationStates.onBeforeAllComplete(this.beforeComplete, this);

        this.allWinLinebool = false;
        this.onSendPlayBool = false;
        this.isFreeSpinGame = false;
        // ui 正在忙碌狀態，監控到此狀態不可 spin
        this.isUIBusy = false;

        // 初始化幣別符號
        Currency.init(GetProjectInfo.getUrlParams().dollarsign);
        // View生成工廠
        this.uiApp = new UiApp(this);

        // 流程控制初始化(control)
        this.controlInit();
        // 主流程控制初始化(control)
        this.gameControlInit();
        // 計算可以拍取分次數
        this.callTakeWinCount = 0;
        // 單線輪閃持續時間
        this.singleTimer = this.game.time.create(false);
        // 輪閃的次數
        this.loopCount = 0;
        this.singleTimer.loop(Phaser.Timer.SECOND * ConfigPasser.instance.SINGLE_LINE_SEC, () => {
            // Respin 會在完整播放一 round 輪播後觸發
            if (GameInfo.isReSpin && this.loopCount >= ReelResultData.winCount) {
                this.callTakeWinEvent();
                this.loopCount = 0;
                return;
            }
            this.loopCount ++;
            this.uiApp.callWinLineEvent();
        }, this);

        // 按鍵事件註冊
        this.addEventListener(BtnEvent.ON_BTN_CLICK, (evt) => {
            this.btnctrl.callBtnEvent(evt.clickType, evt.params);
        }, this);
        this.addEventListener(ReelEvent.ON_REELBAR_COMPLETE, this.onReelStopComplete, this);
        // 設定TabFocus
        this.leaveTabFocus();

        // iframe 音效問題處理
        this.soundHandle();
    }

    // iframe 特殊處理
    soundHandle() {
        /* eslint-disable */
        if (this.game.device.android && this.game.device.chrome && this.game.device.chromeVersion >= 55) {
            this.game.sound.setTouchLock();
            this.game.input.touch.addTouchLockCallback(() => {
                if (this.noAudio || !this.touchLocked || this._unlockSource !== null) {
                    return true;
                }
                if (this.usingWebAudio) {
                    // Create empty buffer and play it
                    // The SoundManager.update loop captures the state of it and then resets touchLocked to false

                    const buffer = this.context.createBuffer(1, 1, 22050);
                    this._unlockSource = this.context.createBufferSource();
                    this._unlockSource.buffer = buffer;
                    this._unlockSource.connect(this.context.destination);

                    if (this._unlockSource.start === undefined) {
                        this._unlockSource.noteOn(0);
                    } else {
                        this._unlockSource.start(0);
                    }

                    // Hello Chrome 55!
                    if (this._unlockSource.context.state === 'suspended') {
                        this._unlockSource.context.resume();
                    }
                }

                //  We can remove the event because we've done what we needed (started the unlock sound playing)
                return true;
            }, this.game.sound, true);
        }

        // Chrome 66 版本靜音問題
        if (!this.game.device.ie) {
            this.game.input.onDown.addOnce(() => {
                if (this.game) {
                    this.game.sound.context.resume();
                }
            });
        }
        /* eslint-enable */
    }

    // 流程控制初始化(control)
    controlInit() {
        // 建立基本控制器功能
        this.keyBoard = new KeyBoardControl(this);
        this.btnctrl = new BtnControl(this);
    }

    // 主流程控制初始化(control)
    gameControlInit() {
        const controlActionAry = [
            BaseStatusControl, FreeStatusControl, BonusStatusControl, JackpotStatusControl
        ];
        this.createControl(controlActionAry);
    }

    // 創建流程控制
    createControl(controlAry) {
        controlAry.forEach((ControlClass) => {
            const controlItem = new ControlClass(this);
            this.controlMap.push(controlItem);
        });
    }

    /**
     * 註冊流程跑完結束(統一來這邊觸發)
     */
    beforeComplete() {
        // 判斷如果有進入狀態機就不做其他狀態機讀取避免重複衝突觸發多組狀態機功能
        for (let i = 0; i < this.controlMap.length; i++) {
            const bool = this.controlMap[i].callInStates();
            if (bool) { return; }
        }
    }

    // Socket 發送回來的接收處

    /**
     * 初始化
     * @param {any} gameInfoData   Game初始化資料
     */
    init(gameInfoData) {
        // 轉換 baseGame 的 symbol ID
        this.transSymbolNumToId(gameInfoData.stripData.baseStrip);
        // 轉換 freeGame 的 symbol ID
        this.transSymbolNumToId(gameInfoData.stripData.freeStrip);

        // gameInfoData.DenomDefine;    // 賠率表
        // gameInfoData.DefaultDenomIdx;  // 賠率表 index
        // 幣值
        ConfigPasser.instance.CURRENCY = gameInfoData.DollarSignId;
        // 將 logo 網址傳給 slot-base 使用
        ConfigPasser.instance.COBRAND_DATA = gameInfoData.Cobrand;
        // 基本注額選項
        ConfigPasser.instance.BET_SETTING_LIST.length = 0;
        gameInfoData.BetButton.forEach((bet) => {
            ConfigPasser.instance.BET_SETTING_LIST.push(bet * gameInfoData.MiniBet);
        }, this);
        // 細單網址
        GameInfo.playerOrderURL = (gameInfoData.PlayerOrderURL === null) ? null : `${gameInfoData.PlayerOrderURL}&language=${getCurLangID(ConfigPasser.instance.LANGUAGE)}`;
        // 設定Extra Bet
        GameInfo.extraBet = ConfigPasser.instance.EXTRA_BET;
        // 設定MIN_BET
        GameInfo.miniBet = gameInfoData.MiniBet;
        ConfigPasser.instance.MIN_BET = gameInfoData.MiniBet;
        // 最高押注
        GameInfo.betSettoLimit(1, gameInfoData.MaxBet);
        // 最高線數
        GameInfo.lineSettoLimit(1, gameInfoData.MaxLine);
        // 設定線數
        GameInfo.userLine = gameInfoData.MaxLine;
        // 快速押分表
        GameInfo.betButton = gameInfoData.BetButton;
        // gameInfoData.WinLimitLock;  // 最高嬴分
        // denom
        GameInfo.denomDefine = gameInfoData.DenomDefine;
        // Strip Data
        GameInfo.inGameRangeData = gameInfoData.stripData;
        // 設定遊戲狀態
        GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_IDLE;
        // 設定飛牌資訊
        GameInfo.isShowFreehand = gameInfoData.IsShowFreehand;
        GameInfo.isAllowFreehand = gameInfoData.IsAllowFreehand;

        GameInfo.gameReturnUrl = gameInfoData.gameReturnUrl;

        // 發送初始化狀態
        this.onDispatchEvent(new GameEvent(GaStatesConfig.gameinit));
        // 發送文字區域更新文字事件
        this.onDispatchEvent(new UITextEvent(UITextEvent.ON_TEXT_UPDATE));
        // 註冊鍵盤事件
        // this.registerKeyboard();
    }

    /**
     * 給外部使用的 credit 更新事件
     * @param {Number} credit 最新拿到的分數
     */
    setCredit(credit) {
        // 紀錄 credit
        GameInfo.userDenomPoint = credit;
        // 發送文字區域更新文字事件
        this.onDispatchEvent(new UITextEvent(UITextEvent.ON_TEXT_CREDIT));
    }

    /**
     * 給外部使用的 Jackpot Pool 更新事件
     * @param {Number} poolData 最新拿到的彩池資料
     */
    setJackpotPool(poolData) {
        // 紀錄彩池
        GameInfo.jackpotPool = poolData.Prize;
        // 發送Jackpot彩池更新事件
        this.onDispatchEvent(new UITextEvent(UITextEvent.ON_TEXT_JACKPOT_POOL));
    }

    // 判斷結果填入是否贏得動畫效果流程
    // 接到 play data 資料 [支援 : Base , Free]
    setResultShowStates(data) {
        this.loopCount = 0;
        // Reel Num 轉換為 SymbolID
        data.SymbolResult.forEach((items) => {
            items.forEach((item, idx) => {
                items[idx] = ConfigTools.getSymbolID(item);
            });
        });

        // 中線 Num 轉換為 SymbolID
        data.symbolIdAry.forEach((item, idx) => {
            data.symbolIdAry[idx] = ConfigTools.getSymbolID(item);
        });

        // 將 play data存在Model使用
        (this.isFreeState)
            ? FreeResultModel.freePlayData = data
            : SlotResultModel.slotData = data;

        // 場次
        GameInfo.gamePlaySerialNumber = SlotResultModel.gamePlaySerialNumber;
        this.onDispatchEvent(new UITextEvent(UITextEvent.ON_TEXT_UPDATE));

        this.onResultCheckWinType(data);
    }

    // 發送Spin封包給Socket
    sendPlayData() {
        // 判斷是否免費遊玩
        if (this.isFreeSpinGame) {
            // 此流程是不需要前置動作的Idle
            (GameInfo.isFreeSpin)
                ? this.mainContext.sendFreeGamePlay()
                : this.mainContext.sendRespin(
                    GameInfo.userBet,
                    GameInfo.userDenomDefine,
                    GameInfo.userLine,
                    GameInfo.miniBet,
                    GameInfo.extraBet,
                    SlotResultModel.singleReelPay
                );
            return;
        }
        // BaseGame遊玩流程 會判斷Idle是否返回才可以發送
        this.mainContext.sendGamePlay(
            GameInfo.userBet,
            GameInfo.userDenomDefine,
            GameInfo.userLine,
            GameInfo.miniBet,
            GameInfo.extraBet,
            SlotResultModel.singleReelPay,
            GameInfo.reelSelected,
            GameInfo.actionMode
        );
    }

    // 接收Spin的結果資料 [Socket返回]
    onResultCheckWinType(data) {
        this.onSendPlayBool = false;
        // 要寫判斷 是否Slow 地方同時也要寫入 結果動畫流程的地方 寫入要不要秀大獎,JP等等
        this.WinEventName = '';
        this.schedule = [];
        // 判斷結果是否有贏得狀態,填入結算動畫流程事件
        switch (ReelResultData.winType) {
            // 沒贏
            case 0:
                this.schedule = this.befroEffectTarget.noWin;
                this.WinEventName = GaStatesConfig.gameNoWin;
                // 清空 base game 累加分數
                SlotResultModel.winScoreAccNum = 0;
                break;
            // base game win (一般贏分)
            case 1:
                this.schedule = this.befroEffectTarget.win;
                this.WinEventName = GaStatesConfig.gameWin;
                break;
            // free game win 'F' , 999 (由文檔來決定此款遊戲的F 是否有免費遊戲)
            case 2:
                this.schedule = this.befroEffectTarget.noWin;
                this.WinEventName = GaStatesConfig.gameNoWin;
                // 當有贏分
                if (ReelResultData.totalWin > 0) {
                    this.schedule = this.befroEffectTarget.win;
                    this.WinEventName = GaStatesConfig.gameWin;
                }
                // 儲存此BaseGame剛中FreeGame時的紀錄,當FreeGame Complete會再次使用
                if (!GameInfo.isFreeSpin && ConfigPasser.instance.IN_FREE_GAME) { SlotResultModel.slotSaveBaseReel = data; }
                break;
            // Bonus Game
            case 4:
                this.schedule = this.befroEffectTarget.win;
                this.WinEventName = GaStatesConfig.gameWin;
                break;
            default:
        }
        // 發佈接收結果事件給Reel
        this.onDispatchEvent(new ReelEvent(ReelEvent.ON_REELBAR_RECEIVE));
    }

    // ============ Free Game ===========

    // 免費遊戲
    setFreeStartStates(data) {
        FreeResultModel.freeStartData = data;
        this.onFreeGameStart();
    }

    setFreeCompleteStates(data) {
        FreeResultModel.freeCompleteData = data;
        this.onFreeGameComplete();
    }

    // ============ Bonus Game ===========

    // Bonus Game 設定接收Start的資料
    setBonusStartStates(data) {
        BonusResultModel.bonusStartData = data;
        this.onBonusGameStart();
    }

    // Bonus Game 設定接收Play的資料
    setBonusPlayStates(data) {
        BonusResultModel.bonusPlayData = data;
        this.onBonusResultPlay();
    }

    // Bonus Game 設定接收Complete的資料
    setBonusCompleteStates(data) {
        BonusResultModel.bonusCompleteData = data;
        this.onBonusComplete();
    }

    // ============ Jackpot ============

    // Jackpot 設定接收Start的資料
    setJackpotStartStates(data) {
        JackpotResultModel.jackpotStartData = data;
        this.onJackpotStart();
    }

    // Jackpot 設定接收Play的資料
    setJackpotPlayStates(data) {
        JackpotResultModel.jackpotPlayData = data;
        this.onJackpotPlay();
    }

    // Jackpot 設定接收Complete的資料
    setJackpotCompleteStates(data) {
        JackpotResultModel.jackpotCompleteData = data;
        this.onJackpotComplete();
    }


    // 註冊鍵盤事件
    registerKeyboard() {
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.ENTER ]);

        // 手機版偵測訊號特例
        document.addEventListener('keydown', (e) => {
            if (!this.game.device.desktop && e.keyCode === 32) {
                this.onKeyBoardEvent({ keyCode: Phaser.Keyboard.ENTER });
            }
        }, false);

        this.spaceKey.onDown.add((e) => {
            if (this.game.device.desktop && e.keyCode === 32) {
                this.onKeyBoardEvent(e);
            }
        }, this);

        this.enterKey.onDown.add((e) => {
            this.onKeyBoardEvent(e);
        }, this);
    }

    // 註冊動畫事件序列
    animationAddEventInPlay(eventAry) {
        // 註冊要跑的Signal表
        this.slotAnimationStates.beforeShowWinRegister(eventAry);
        // 執行註冊排程
        this.slotAnimationStates.beforeShowWin();
    }

    // 取出目前是否為 FreeGame中
    get isFreeState() {
        return (GameInfo.isFreeSpin && ConfigPasser.instance.IN_FREE_GAME);
    }

    // 取出目前可以使用的事件狀態標籤
    get befroEffectTarget() {
        // 免費時候切換狀態 freegame [20160805新增]
        return (this.isFreeState) ? EffectPasser.scheduleAry.freeGame : EffectPasser.scheduleAry.baseGame;
    }

    /**
     * 詢問是否金額可以下注進行遊玩
     */
    allowPlay() {
        // 鎖住All按鈕
        this.onDispatchEvent(new GameEvent(GaStatesConfig.gameLockBtn));
        // 避免被連按兩次發送下注(防呆用)
        if (this.onSendPlayBool) { return; }
        // 確定已經觸發
        this.onSendPlayBool = true;

        // 免費的話就不需要判斷扣點函數了
        const isFreePlay = (GameInfo.isReSpin || GameInfo.isFreeSpin);

        // 飛牌模式
        if (GameInfo.actionMode === 1) {
            this.playGame(isFreePlay);
            return;
        }

        // 試問點數是否足夠 (填true的話 錢足夠可以進行點數扣點) 跟 api 發送下注資訊 (下注金額 下注線數) 如果返回false為錢不夠 只好切回一般模式
        (isFreePlay || GameInfo.isAllowSpin(true)) ? this.playGame(isFreePlay) : this.insufficientBalance();
    }

    // 額度不足
    insufficientBalance() {
        this.onDispatchEvent(new MessageEvent(MessageEvent.ON_SHOW_MESSAGE_TIP, ConfigPasser.instance.LANGUAGE_CONFIG.insufficientBalance));
        this.gameStatesChangeIdle();
    }

    /**
     * 詢問目前金錢是否可玩
     * @return {Boolean} true / false
     */
    checkCredit() {
        const enoughToPlay = GameInfo.isAllowSpin(false);

        return enoughToPlay;
    }

    // 設定秀線Delay時間
    get showWinLineDelay() {
        // 預設BaseGame輪閃時的秒數
        let delay = ConfigPasser.instance.SINGLE_LINE_SEC;

        // 只有AutoPlay時直接秀全線1秒 (BaseGame)
        if (GameInfo.isAutoPlay) {
            delay = ConfigPasser.instance.ALL_LINE_SEC;
        }

        // 但如果在FreeGame中 秀輪閃總秒數後取分
        if (GameInfo.isFreeSpin) {
            // free game 中 如果只有一條線 則 delay = 0 , 不輪播
            delay = ConfigPasser.instance.FREE_LINE_SEC * ReelResultData.winCount;
        }

        // 全 wild 動畫
        if (ConfigPasser.instance.IS_WILD_GROUP && ReelResultData.isAllWild) {
            delay = ConfigPasser.instance.SINGLE_LINE_SEC;
        }
        return delay;
    }

    // 將 Socket 取回資料中的 symbol 數字轉為ID
    transSymbolNumToId(data) {
        data.forEach((items) => {
            items.forEach((item) => {
                item.forEach((symbolNum, index) => {
                    item[index] = ConfigTools.getSymbolID(symbolNum);
                });
            });
        });
        return data;
    }

    // ################################  開給繼承類別複寫使用的功能 ################################

    // # 常用功能

    // 切換瀏覽器Tab
    leaveTabFocus() {
        let state;
        let visibilityChange;

        if (typeof document.hidden !== 'undefined') {
            visibilityChange = 'visibilitychange';
            state = 'visibilityState';
        } else if (typeof document.mozHidden !== 'undefined') {
            visibilityChange = 'mozvisibilitychange';
            state = 'mozVisibilityState';
        } else if (typeof document.msHidden !== 'undefined') {
            visibilityChange = 'msvisibilitychange';
            state = 'msVisibilityState';
        } else if (typeof document.webkitHidden !== 'undefined') {
            visibilityChange = 'webkitvisibilitychange';
            state = 'webkitVisibilityState';
        }

        // Add a listener that constantly changes the title
        document.addEventListener(visibilityChange, () => {
            if (document[state] === 'visible' && !Sound.isMuteSound) {
                Sound.unMute();
                return;
            }

            Sound.mute();
        }, false);
    }

    // 註冊按鈕事件
    onKeyBoardEvent(clickEvent) {
        // help 打開時不能觸發
        if (clickEvent.keyCode !== Phaser.Keyboard.SPACEBAR && clickEvent.keyCode !== Phaser.Keyboard.ENTER) {
            return;
        }

        this.keyBoard.callKeyBoardEvent();
    }

    // REEL 全部轉動停止完畢接著觸發需要呈現的動畫(比如說是Wild變牌 BigWin動畫)
    onReelStopComplete() {
        // 轉動後需要呈現的動畫過程 全部按鈕鎖住
        this.onDispatchEvent(new GameEvent(GaStatesConfig.gameLockBtn));

        // 判斷進入Progressive Jackpot
        if (ConfigPasser.instance.IN_JACKPOT && ReelResultData.isJackpotHit && ReelResultData.nextModule === 50) {
            this.triggerProgressiveJackpot();
            return;
        }

        // 判斷進入Mystery Jackpot
        if (ConfigPasser.instance.IN_JACKPOT && ReelResultData.isJackpotHit) {
            this.triggerMysteryJackpot();
            return;
        }

        // #free Game
        // 判斷是否免費遊戲 winType是2 : 為中 F scatter 進入免費遊戲 (但是需要判斷Config.IN_FREE_GAME 此款遊戲特色是否有FreeGame)
        if (ReelResultData.winType === 2 && ConfigPasser.instance.IN_FREE_GAME) {
            if (!GameInfo.isFreeSpin) {
                // Lucky Draw(暫時使用這樣,正常應該是使用nextModule來決定去哪個模式)
                for (let i = 0; i < ReelResultData.symbolIdAry.length; i++) {
                    const id = ReelResultData.symbolIdAry[i];
                    if (this.isLuckyDraw(id)) {
                        // 是luckyDraw流程跳出for迴圈,並且觸發進入BonusGame的前置動作(LuckyDraw與BonusGame流程相同)
                        return;
                    }
                }

                // baseGame中了Scatter 判斷 isTriggerFg參數 該局是否該進入FreeGame模式
                if (ReelResultData.isTriggerFg) {
                    // 是否中FreeGame
                    this.mainContext.sendFreeGameStart(); // 這塊可能之後要改等收到結果才能進入FreeGame
                    return;
                }
            }

            // FreeGame用來判斷ReTrigger [FreeGame Play的參數 沒有isTriggerFg參數可以判斷]
            if (GameInfo.isFreeSpin && (FreeResultModel.RetriggerAddSpins > 0 || FreeResultModel.retriggerAddRounds > 0)) {
                // retrigger 狀態
                this.freeRetrigger();
                return;
            }
        }

        // 判斷是否有 respin 轉換狀態
        GameInfo.isReSpin = (ReelResultData.isRespin && ConfigPasser.instance.IS_RESPIN);
        // 進入Bonus Game
        if (ReelResultData.winType === 4 && ConfigPasser.instance.IN_BONUS_GAME) {
            this.bonusGameTrigger();
            return;
        }

        // 切換轉動結束的BeforeShoWin狀態機 [一般]
        this.baseShowWin();
    }

    isLuckyDraw(id) {
        // 判斷LuckyDraw
        if (ConfigPasser.instance.SYMBOL_LUCKY_DRAW.indexOf(id) !== -1) {
            BonusConfig.BONUS_STAGE_STATUS = 0;
            this.mainContext.sendBonusGameStart();
            return true;
        }
        return false;
    }

    /**
     * 觸發Jackpot Trigger 前發送
     * @param  {Number} type 0 : BaseGame, 1 : FreeGame //  暫定只有BaseGame有，日後增加FreeGame的話需修改
     */
    triggerProgressiveJackpot(type = 0) {
        // 狀態為 Jackpot
        JackpotConfig.BONUS_STAGE_STATUS = type;
        this.mainContext.sendJackpotStart();
    }

    triggerMysteryJackpot() {
        // 預計流程
    }

    // 觸發BonusGame Trigger 前發送
    bonusGameTrigger() {
        // 狀態為 Bonus
        BonusConfig.BONUS_STAGE_STATUS = 1;
        this.mainContext.sendBonusGameStart();
    }

    // retrigger 狀態
    freeRetrigger() {
        GameInfo.isReSpin = (ConfigPasser.instance.IS_RESPIN);
        GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_FG_LUCKY_BONUS;
        this.animationAddEventInPlay(EffectPasser.scheduleAry.freeGame.beforeShowFreeLuckyBonus);
    }

    // 切換轉動結束的BeforeShoWin狀態機 [一般]
    baseShowWin() {
        GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_BEFORE_SHOWWIN;
        let effectItem = EffectPasser.scheduleAry.baseGame;
        // 判斷是否免費的BeforeShowWin流程 [20160805新增]
        if (this.isFreeState) {
            GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_FG_BEFORE_SHOWWIN;
            effectItem = EffectPasser.scheduleAry.freeGame;
        }
        this.isbigWin(effectItem);
    }

    // 判斷totalWin是否為BigWin資格標準
    isbigWin(EffectObj) {
        // 判斷此場是否有jackpot
        const totalWin = (SlotResultModel.isHitJackpot) ? ReelResultData.totalWin - JackpotResultModel.jpWinAmt : ReelResultData.totalWin;
        // 噴BigWin不含Jackpot贏分
        const isBigWin = (totalWin >= GameInfo.getTotalBet * ConfigPasser.instance.STEP_RATIO[0]);
        if (isBigWin > 0) {
            // 全部按鈕已被鎖住,但可以點擊遮罩取消BigWin動畫
            this.animationAddEventInPlay(EffectObj.beforeShowBigWin);
            return;
        }
        // Reel停止時會做的動畫處理(常規)
        this.animationAddEventInPlay(EffectObj.beforeShowWin);
    }

    // 取分動作 (停止計時器 發送 gameTakeWin 狀態)
    callTakeWinEvent() {
        // 判斷此次是否有Extra Win
        const extraBool = LineExtraControl.freeLineExtra;
        // 該場有特殊線資料需要呈現
        const data = LineExtraControl.extraIndexOfData;
        // 取得Signal狀態是否可以拍掉Extra
        const isCheckExtra = this.getExSignalStates();
        // 播放Extra秀線中可不可拍掉
        if (!this.allWinLinebool && extraBool && ConfigPasser.instance.IS_CLEAR_EXTRA_EF && data.count !== -1) {
            if (!isCheckExtra) { return; }
            // 取出計算的位置
            const startValue = GameInfo.winLineIndex;
            // 初始化已拍次數
            this.callTakeWinCount = 0;
            // 計算尚未拍掉"已自動跑過的索引"來計算 範圍內 需要填寫正確的"已拍次數"
            for (let i = 0; i < data.indexAry.length; i++) {
                if (startValue >= data.indexAry[i]) {
                    this.callTakeWinCount++;
                }
            }
            // 判斷此次拍掉所剩餘數量
            const value = data.count - this.callTakeWinCount;
            // 判斷小於索引位置
            if (this.callTakeWinCount < data.indexAry.length) {
                // 寫入下一個階段要顯示的陣列索引
                GameInfo.winLineIndex = data.indexAry[value] - 1;
            }
            // 當次數為0 以判斷此次為最後一次拍掉
            if (value <= 0) {
                this.allWinLinebool = true;
            }
            // 異步處理 讓前端有時間顯示一點點線條在取消
            let dealyTime = setTimeout(() => {
                clearTimeout(dealyTime);
                dealyTime = null;
                this.onDispatchEvent(new GameEvent(GaStatesConfig.gameTakeWin));
            }, 0);
            return;
        }

        if (!this.allWinLinebool) {
            this.game.time.events.remove(this.allLineTimer);
            this.game.time.events.remove(this.freeLineTimer);
            this.allWinLinebool = true;
            this.singleTimer.stop(false);
            this.onDispatchEvent(new GameEvent(GaStatesConfig.gameTakeWin));
        }
    }

    // 判斷目前Signal動作是否取分拍掉
    getExSignalStates() {
        // 預設為true 給前端繼承 Extra贏分Signal是否有執行行為
        return true;
    }

    // ################################ Base Game ################################

    /**
     * 收到觸發spin 狀態
     * @param  {Boolean} [isFreePlayGame=false] 是否為不用錢的 spin
     */
    playGame(isFreePlayGame = false) {
        this.isFreeSpinGame = isFreePlayGame;
        // 免費時候切換狀態 freegame OR baseGame [20160805新增]
        (this.isFreeState)
            ? GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_FG_BEFORE_SPIN
            : GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_BEFORE_SPIN;
        this.isSpinBool = true;
        // 發布轉動前動畫事件
        this.onDispatchEvent(new GameEvent(GaStatesConfig.gameBeforeSpin));

        const actionAry = (GameInfo.isReSpin) ? this.befroEffectTarget.beforeReSpin : this.befroEffectTarget.beforeSpin;
        // 註冊動畫事件序列並且執行 (respin 或是一般 spin)
        this.animationAddEventInPlay(actionAry);
        // 成功 spin 後解除 ui 忙碌狀態
        this.isUIBusy = false;
    }

    // 回到 gameIdle 狀態 (非 auto play)
    gameStatesChangeIdle() {
        // 切回沒有Spin
        this.isSpinBool = false;
        // auto 自動切回 false
        GameInfo.isAutoPlay = false;
        // boost 自動切回 false
        GameInfo.isBoostSpin = false;
        // 取消已傳送Spin動作
        this.onSendPlayBool = false;
        // 切換狀態 BaseGame [閒置]
        GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_IDLE;

        this.setGameInfoActionMode();

        // 發佈切換按鈕控制器的狀態
        this.onDispatchEvent(new GameEvent(GaStatesConfig.gameIdle));
        this.onDispatchEvent(new ReelEvent(ReelEvent.OFF_BOOST_PLAY));
    }

    /**
     * 設定 Idle 資料
     * @param {object} data 資料
     */
    setIdleData(data) {
        // 紀錄彩池
        GameInfo.isAllowFreehand = data.IsAllowFreeHand;
        // 發佈切換按鈕控制器的狀態
        this.onDispatchEvent(new GameEvent(GaStatesConfig.gameAfterIdle));
    }

    /**
     * 設定 Spin 模式
     * @param {object} {value: spin模式 }
     */
    setGameInfoActionMode({ value = 0 } = {}) {
        GameInfo.actionMode = value;
    }

    // ################################ Free Game ################################

    // 收到FreeGame Start [Socket返回]
    onFreeGameStart() {
        // 設定進入 free game 狀態
        GameInfo.isReSpin = false;
        GameInfo.isFreeSpin = true;
        GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_FG_TRIGGER;
        // 正常流程
        FreeResultModel.freeWinScoreNum = 0;
        FreeResultModel.currentSpinTimes = 0;
        // 是否把base game Scatter觸發功能時 累加分數至FreeGame裡面
        if (ConfigPasser.instance.HIT_SCATTER_SHOW_SCORE >= 1) {
            FreeResultModel.freeWinScoreNum = FreeResultModel.accumlateWinAmt;
        }
        this.animationAddEventInPlay(EffectPasser.scheduleAry.freeGame.beforeShowFreeEnter);
    }
    // 收到FreeGame Complete後才顯示結算畫面 [Socket返回]
    onFreeGameComplete() {
        this.animationAddEventInPlay(EffectPasser.scheduleAry.freeGame.freeComplete);
    }

    // ################################ Bonus Game ################################

    // 收到BonusGame Start [Socket返回]
    onBonusGameStart() {
        GameInfo.isBonusSpin = true;    // 切換Bonus Game
        GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_BG_TRIGGER;
        this.animationAddEventInPlay(this.befroEffectTarget.beforeShowBonusGameEnter);
    }
    // 收到BonusGame Play回來的結果 [Socket返回]
    onBonusResultPlay() {
        this.animationAddEventInPlay(this.befroEffectTarget.bonusPlay);
    }
    // 收到BonusGame Complete的結果 [Socket返回]
    onBonusComplete() {
        this.animationAddEventInPlay(this.befroEffectTarget.bonusComplete);
    }

    // ################################ Jackpot ################################

    // 收到Jackpot Start [Socket返回]
    onJackpotStart() {
        GameInfo.isJackpotPlaying = true;    // 切換Bonus Game
        GameInfo.gameSlotStates = MainStatesConfig.GAME_STATUS_JP_TRIGGER;
        this.animationAddEventInPlay(this.befroEffectTarget.beforeShowJackpotEnter);
    }
    // 收到Jackpot Play回來的結果 [Socket返回]
    onJackpotPlay() {
        this.animationAddEventInPlay(this.befroEffectTarget.jackpotPlay);
    }
    // 收到Jackpot Complete的結果 [Socket返回]
    onJackpotComplete() {
        this.animationAddEventInPlay(this.befroEffectTarget.jackpotComplete);
    }

    broadcastShowTip(data) {
        this.onDispatchEvent(new MessageEvent(MessageEvent.ON_SHOW_MESSAGE_TIP, data.messageText));
    }
}

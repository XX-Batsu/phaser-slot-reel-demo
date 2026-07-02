import { ReelControl, GameBase, Overlay, SlowControl, Sound, ConfigTools, types, SlowborderEffect, SlotGame, LikeMoveIt } from 'slot-base';
import Config from 'js/main/Config';
import SlowConfig from 'js/main/SlowConfig';

// UI - Reel
import ReelWinHideSignal from 'js/signal/ui/reel/ReelWinHideSignal';
import ReelScatterHideSignal from 'js/signal/ui/reel/ReelScatterHideSignal';
import ReelSymbolAllShowSignal from 'js/signal/ui/reel/ReelSymbolAllShowSignal';
import ReelSymbolAllHideSignal from 'js/signal/ui/reel/ReelSymbolAllHideSignal';
import ReelRefreshSignal from 'js/signal/ui/reel/ReelRefreshSignal';
import ReBaseGameRangeSignal from 'js/signal/ui/reel/ReBaseGameRangeSignal';
import ReelBonusHideSignal from 'js/signal/ui/reel/ReelBonusHideSignal';
import ReelSymbolBlowUpSignal from 'js/signal/ui/reel/ReelSymbolBlowUpSignal';
// import ReelSymbolChangeSignal from 'js/signal/ui/reel/ReelSymbolChangeSignal';
// import ChangeFacePlaySignal from 'js/signal/freegame/ChangeFacePlaySignal';
import ReelShowWinHideSignal from 'js/signal/windata/ReelShowWinHideSignal';

import CustomEvent from 'js/events/CustomEvent';

export default class ReelView extends GameBase {
    constructor(game) {
        super(game);
        this.reelContext = new Phaser.Group(this.game);

        this.reelContext.x = Config.REEL_OFFSET_X;
        this.reelContext.y = Config.REEL_OFFSET_Y;
        this.symbolMask = this.game.add.graphics(0, 0);
        this.symbolMask.beginFill(0xFF33FF);
        this.symbolMask.alpha = 0.5;

        // 3X1滾輪特色，額外調整遮罩的範圍和位移，使其露出當前symbol前後一個的邊緣。
        // this.reelContext.x = this.reelContext.x + (Config.SYMBOL_PADDING_X / 2);
        // this.reelContext.y = this.reelContext.y + (Config.SYMBOL_PADDING_Y / 2);

        this.symbolMask.drawRect(Config.REEL_OFFSET_X, Config.REEL_OFFSET_Y, Config.PageMaxWidth, Config.PageMaxHeight, 98);
        this.reelContext.mask = this.symbolMask;
        this.add(this.reelContext);

        // overlay
        this.OverlayBox = new Phaser.Group(game);
        this.OverlayBox.x = Config.REEL_OFFSET_X;
        this.OverlayBox.y = Config.REEL_OFFSET_Y;
        this.add(this.OverlayBox);

        // 大遮罩
        this.reelOverlay = new Overlay(this.game, {
            settings: [
                Config.REEL_OFFSET_X,
                Config.REEL_OFFSET_Y,
                Config.PageMaxWidth,
                Config.PageMaxHeight
            ],
            alpha: 0.8,
            color: 0x000000
        });
        this.reelOverlay.show(false);

        this.add(this.reelOverlay);

        // 已經跑完的 reel 數量
        this.reelCompleteCount = 0;
        this.currentStoppedFC = 0;
        this.currentLeadSymbol = '';
        // 是否按下停止
        this.isEmgStop = false;
        // 是否正在轉動中
        this.isPlaying = false;
        // 是否Slow中
        this.isSlowing = false;

        // # 此站特色變數定義區 [Start]
        // 是否變過臉
        this.changeOver = false;
        // # 此站特色變數定義區 [End]

        this.tempObj = {
            FIRST_ROLL_SYMBOL_COUNT: Config.FIRST_ROLL_SYMBOL_COUNT,
            DIFF_PASS_COUNT_EACH_REEL: Config.DIFF_PASS_COUNT_EACH_REEL,
            ROLLING_SYMBOL: Config.ROLLING_SYMBOL,
            SLOW_EMG_ROLLING_PASS_COUNT: Config.SLOW_EMG_ROLLING_PASS_COUNT,
            SLOW_ROLLING_PASS_COUNT: Config.SLOW_ROLLING_PASS_COUNT,
            SLOW_ROLLING_SYMBOL: Config.SLOW_ROLLING_SYMBOL,
            ROLLING_SYMBOL_COUNT: Config.ROLLING_SYMBOL_COUNT,
            EMG_ROLLING_SYMBOL: Config.EMG_ROLLING_SYMBOL
        };

        this.addEventListener(SlotGame.GameEvent.STATES, this.gameSlotStates, this);
        this.addEventListener(SlotGame.ReelEvent.ON_REELBAR_RECEIVE, this.onGetResultData, this);
        this.addEventListener(ReelWinHideSignal.ON_WINHIDE_SYMBOL, this.onWinHideSymbol, this);
        this.addEventListener(ReelShowWinHideSignal.ON_SHOW_WINHIDE_SYMBOL, this.onWinHideSymbolShow, this);
        this.addEventListener(ReelScatterHideSignal.ON_SCATTER_HIDE_SYMBOL, this.onScatterHideSymbol, this);
        this.addEventListener(ReelSymbolAllShowSignal.ON_REEL_SYMBOL_ALL_SHOW, this.onAllSymbolShow, this);
        this.addEventListener(ReelRefreshSignal.ON_REEL_REFRESH, this.onRefreshReel, this);
        this.addEventListener(ReBaseGameRangeSignal.ON_REBASE_GAME_RANGE, this.onReBaseGameRange, this);
        this.addEventListener(ReelSymbolAllHideSignal.ON_REEL_SYMBOL_ALL_HIDE, this.onAllSymbolHide, this);
        this.addEventListener(ReelBonusHideSignal.ON_BONUS_HIDE_SYMBOL, this.onBonusHideSymbol, this);
        // this.addEventListener(ReelSymbolChangeSignal.ON_REEL_SYMBOL_ANY_CHANGE, this.onSymbolChange, this);
        // this.addEventListener(ChangeFacePlaySignal.ON_SYMBOL_FACE_CHANGE, this.onExtraChangePlay, this);
        this.addEventListener(ReelSymbolBlowUpSignal.ON_REEL_BLOW_UP_SYMBOL_DECLINE, this.onBlowUpSymbol, this);
        this.addEventListener(SlotGame.ReelEvent.ON_BOOST_PLAY, this.onBoost, this);
        // 特色事件註冊區
        this.addEventListener(CustomEvent.MOAI_SPIT, this.moaiSpit, this);
        this.addEventListener(CustomEvent.MOAI_SWALLOW, this.moaiSwallow, this);

        // 輪閃當前的 index
        this.inTurnCount = 0;
        // ReelWinHideSignal 夾帶資料
        this.winHideSignalData = {};
        // spin回來的資料紀錄
        this.resultData = {};
        this.resultFreeData = {};

        // 當前 slow index
        this.slowReelIndex = -1;
        // slow 資訊
        this.slowDataObject = {};
        // 存放 slow Key的陣列
        this.slowKeyArray = [];
        // slow 總共要跑幾次（幾軸）
        this.slowKeyInx = 0;
        // 是不是FreePlay
        this.isFreePlay = false;
        // 是否為ReSpin
        this.isRespinPlay = false;
        // 紀錄當局rangeData(BlowUp)
        this.rangeDataAry = [];
        // 紀錄當局rangeIndex(BlowUp)
        this.rangeDataIndexAry = [];
        // 紀錄收到的碰撞次數(BlowUp)
        this.hitCountAry = [];

        // 暫時性 因為功能是寫只要註冊一次,之後傳每把Symbol資訊就可以解析Slow, 但目前缺少總線數資料 所以只能拿Game Win的資料的Line中線來填寫需要的總線(只限於一定贏的瞇牌)
        this.slowCtrl = new SlowControl(Config.NUM_REELS, Config.NUM_ROWS);
        this.slowCtrl.init();
        // wild symbol
        this.slowCtrl.setWildInfo = Config.SYMBOL_WILD;
        // slow 設定
        this.slowCtrl.setSlowInfo = SlowConfig.SYMBOL_SLOW_DATA;
        // line game 連線資料
        this.slowCtrl.setlineListData = Config.LINE_WIN_LIST;   // WayGame沒有線

        if (SlowConfig.SYMBOL_SLOW_DATA.freeSlow.length === 0 && !SlowConfig.IS_FREE_EMPTY) {
            SlowConfig.SYMBOL_SLOW_DATA.freeSlow = SlowConfig.SYMBOL_SLOW_DATA.normalSlow;
        }
        // 靜態Symbol層
        this.group = new Phaser.Group(this.game);
        this.add(this.group);
        this.group.position.set(Config.REEL_OFFSET_X, Config.REEL_OFFSET_Y);

        // 待機動畫group
        this.IdlePlayGroup = new Phaser.Group(this.game);
        this.add(this.IdlePlayGroup);
        this.targetSymbol = [ 'F', 'W' ];

        // 變臉動畫Group
        this.changeGroup = new Phaser.Group(this.game);
        this.add(this.changeGroup);

        /**
         * 創建瞇牌特效
         * @param  {Number} x           x 定位
         * @param  {Number} y           y 定位
         * @param  {Number} symbolWidth 一軸的 symbol 寬度
         * @param  {Number} height      整個瞇牌要呈現的高度
         */
        this.slowBorderEffect = new SlowborderEffect(game, 0, 0);
        /**
         * 設定瞇牌特效 size
         * @param  {Number} symbolWidth 一軸的 symbol 寬度
         * @param  {Number} height      整個瞇牌要呈現的高度
         */
        this.slowBorderEffect.setPosition(0, 0);
        this.slowBorderEffect.setRepeatFrame(1, 24);
        this.slowBorderEffect.setFps = 24;
        this.slowBorderEffect.alpha = 0.9;
        this.slowBorderEffect.playSlowBorder();
        this.slowBorderEffect.hideSlow();
        this.add(this.slowBorderEffect);
        this.slowBorderEffect.scale.set(1);

        // 冒險島
        this.islandRespinTimes = 0;
        this.currentRspinSymbol = 'N0';
        this.respinSign = [];
        this.respinSignObj = [ null, null, null, null, null ];
        this.swallowSymbolType = 0;
        this.respinSignObj.forEach((ele, inx) => {
            if (inx > 1) {
                const signNum = inx - 1;
                const sign = new Phaser.Sprite(game, 845 + (signNum - 1) * Config.SYMBOL_WIDTH, 70, `respinSignDark_${signNum}`, `respinSign_dark_${signNum}_1.png`);
                sign.anchor.set(0.5);
                this.add(sign);
                const darkFrameAry = Phaser.Animation.generateFrameNames(`respinSign_dark_${signNum}_`, 1, this.game.cache.getFrameCount(`respinSignDark_${signNum}`), '.png');
                sign.animations.add('dark', darkFrameAry);
                sign.loadTexture(`respinSignBright_${signNum}`, `respinSign_bright_${signNum}_1.png`);
                const brightFrameAry = Phaser.Animation.generateFrameNames(`respinSign_bright_${signNum}_`, 1, this.game.cache.getFrameCount(`respinSignBright_${signNum}`), '.png');
                sign.animations.add('bright', brightFrameAry);

                this.respinSignObj[inx] = sign;
            }
        });

        this.MSymbolObjAry = [];
        this.NSymbolObjAry = [];
        this.spitSymbolObjAry = [];
        const MSymbols = [ 'M1', 'M2', 'M3', 'M4', 'M5' ];
        const NSymbols = [ 'N1', 'N2', 'N3', 'N4' ];
        MSymbols.forEach((symbolId, inx) => {
            const obj = new Phaser.Sprite(this.game, this.game.width / 2, this.game.height / 2 + inx * 50, 'symbol', `img_symbol_${symbolId}.png`);
            obj.anchor.set(0.5);
            obj.alpha = 0;
            obj.symbolId = symbolId;
            this.add(obj);
            this.MSymbolObjAry[inx] = obj;
        });
        NSymbols.forEach((symbolId, inx) => {
            const obj = new Phaser.Sprite(this.game, this.game.width / 2, this.game.height / 2 + inx * 50, 'symbol', `img_symbol_${symbolId}.png`);
            obj.anchor.set(0.5);
            obj.alpha = 0;
            obj.symbolId = symbolId;
            this.add(obj);
            this.NSymbolObjAry[inx] = obj;
        });
        for (let i = 0; i < 7; i++) {
            const obj = new Phaser.Sprite(this.game, 1400, this.game.height / 2, 'symbol', 'img_symbol_N4.png');
            obj.anchor.set(0.5);
            obj.alpha = 0;
            this.add(obj);
            this.spitSymbolObjAry[i] = obj;
        }
    }

    /**
     * ReelWinHideSignal
     */
    onWinHideSymbol() {
        // 開啟 reel 遮罩
        this.showBigMask(true);
        // free game 直接秀單線(可依照使用者設定是否顯示分數)
        (!this.isAutoPlay || this.isFreePlay)
        ? this.inTurnShow()
        : this.callHideSymbolMode('ALL_SHOW');  // 秀全線
    }

    // # 變臉流程
    // 更換圖標
    onSymbolChange() {}
    // 變臉前的轉場
    onExtraChangePlay() {}

    // 秀Win 特殊(二次算分流程)
    onWinHideSymbolShow(data) {
        // if (data.lineExtraDataAry.length === 0 || data.lineExtraDataAry[data.index][0] === 0) {
        this.showBigMask(true);
        this.onHideSymbol(data.index);
        ReelShowWinHideSignal.callBack();
        // }
    }

    // 消消樂流程
    onBlowUpSymbol() {
        const data = (this.isFreePlay) ? this.resultFreeData : this.resultData;
        for (let i = 0; i < data.winPositionAry.length; i++) {
            this.onHideSymbol(i);
        }
        ReelSymbolBlowUpSignal.callBack();
    }

    // 呼叫隱藏Symbol功能
    callHideSymbolMode(mode) {
        const winData = (this.isFreePlay) ? this.resultFreeData : this.resultData;
        switch (mode) {
            // 第一次全秀線
            case 'ALL_SHOW':
                for (let i = 0; i < winData.winPositionAry.length; i++) {
                    this.onHideSymbol(i);
                }
                break;
            // 輪閃單線
            case 'TURN_SHOW':
                this.onHideSymbol(this.inTurnCount);
                break;
            // Scatter 進入 FreeGame的動畫表現
            case 'SCATTER_HIDE':
                for (let i = 0; i < winData.showLineAry.length; i++) {
                    const symbolID = winData.symbolIdAry[i];
                    // 只秀F 的線 其他線不秀(進入Free Game Tirgger使用)
                    if (Config.SYMBOL_FREE.indexOf(symbolID) !== -1) {
                        this.onHideSymbol(i);
                        return;
                    }
                }
                break;
            case 'BONUS_HIDE':
                for (let i = 0; i < winData.showLineAry.length; i++) {
                    const symbolID = winData.symbolIdAry[i];
                    // 只秀F 的線 其他線不秀(進入Free Game Tirgger使用)
                    if (Config.SYMBOL_BONUS.indexOf(symbolID) !== -1) {
                        this.onHideSymbol(i);
                        return;
                    }
                }
                break;
            default:
        }
    }

    /**
     * 隱藏該線條的Symbol
     * @param {Number} inx index
     */
    onHideSymbol(inx) {
        this.getWinSymbol(inx, this.callHideSymbolLocal, this);
    }

    callHideSymbolLocal(reelInx, row) {
        this.reelContext.children[reelInx].hideSymbolIcon(row);
    }

    // 設定隱藏的Symbol
    getWinSymbol(inx, fun, targetContext) {
        // 取出目前模式的遊戲資料
        const data = (this.isFreePlay) ? this.resultFreeData : this.resultData;
        const symbolCount = data.symbolCountAry[inx];
        const numOfKind = data.numOfKindAry[inx];
        const winPositionAry = data.winPositionAry[inx];
        let winCount = 0;
        let winReelCount = 0;
        let saveReel = -1;
        for (let reelInx = 0; reelInx < Config.NUM_REELS; reelInx++) {
            for (let rowInx = 0; rowInx < Config.NUM_ROWS; rowInx++) {
                if (winPositionAry[rowInx][reelInx] === 0) {
                    continue;
                }
                if (saveReel !== reelInx) {
                    winReelCount++;
                    saveReel = reelInx;
                }
                winCount++;
                if (winCount <= symbolCount) {
                    if (winReelCount <= numOfKind) {
                        fun.call(targetContext, reelInx, rowInx + 1);
                    }
                }
            }
        }
    }

    // scatter動畫專用隱藏fun
    onScatterHideSymbol() {
        ReelScatterHideSignal.callBack();
        this.callHideSymbolMode('SCATTER_HIDE');
    }

    // Bonus動畫專用隱藏fun
    onBonusHideSymbol() {
        ReelBonusHideSignal.callBack();
        this.callHideSymbolMode('BONUS_HIDE');
    }

    // 刷新FreeGame Range顯示
    onRefreshReel(data) {
        // const changeData = (this.isFreePlay) ? this.resultFreeData : this.resultData;
        // 免費模式是否啟動讀取 固定設定 Range level Index位置
        if (Config.IS_FREE_CHANGE_REEL) {
            // 取出Extra 的資料來選曲 顯示刷新Symbol Range 那一張表格
            this.selectIndex = SlotGame.GameInfo.extraBet;
            // 目前使用的表格
            const selectRange = data.gameInfoRange[this.selectIndex];
            // 更換目前滾輪表
            for (let i = 0; i < Config.NUM_REELS; i++) {
                const rangeIndex = (Config.ROUND_RANGE_INDEX.length) ? Config.ROUND_RANGE_INDEX[i] : 0;
                this.reelContext.children[i].reSetRange(selectRange[i], rangeIndex);
            }
        }
        ReelRefreshSignal.callBack();
    }

    // 從FreeGame回到BaseGame的上
    onReBaseGameRange(data) {
        for (let i = 0; i < Config.NUM_REELS; i++) {
            const rangeIndex = data.rangeIndexData[i]; // 返回上次中的Scatter的BaseGame紀錄那局
            this.reelContext.children[i].reSetRange(data.gameInfoRange[i], rangeIndex);
        }

        // 重置滾輪狀態
        for (let i = 0; i < this.reelContext.children.length; i++) {
            const baseData = this.rangeDataAry[i];
            const index = this.rangeDataIndexAry[i];
            this.reelContext.children[i].reSetRangeOverData(baseData, index);
        }
        ReBaseGameRangeSignal.callBack();
    }

    onAllSymbolShow() {
        this.openAllReelShow();
        ReelSymbolAllShowSignal.callBack();
    }
    // 總控觸發顯示全部Symbol
    onAllSymbolHide() {
        this.offAllReelShow();
        ReelSymbolAllHideSignal.callBack();
    }

    // 秀ALL Symbol
    openAllReelShow() {
        for (let i = 0; i < Config.NUM_REELS; i++) {
            this.reelContext.children[i].showAllSymbolIcon();
        }
    }

    // 關閉顯示 All Symbol
    offAllReelShow() {
        for (let i = 0; i < Config.NUM_REELS; i++) {
            this.reelContext.children[i].showAllSymbolIcon(false);
        }
    }

    // 底層呼叫贏分階段的輪閃功能
    onWinLineTimer() {
        if (ReelWinHideSignal.isCallEvent) {
            this.inTurnShow();
        }
    }

    // 單線輪閃
    inTurnShow() {
        // 開啟所有隱藏的舊 symbol
        this.openAllReelShow();
        // 切換資料
        const winData = (this.isFreePlay) ? this.resultFreeData : this.resultData;
        // 單線輪閃
        this.callHideSymbolMode('TURN_SHOW');
        // 次數遞增
        const len = winData.showLineAry.length - 1;
        this.inTurnCount = (this.inTurnCount === len) ? 0 : this.inTurnCount + 1;
    }

    // 每輪reel觸發的Hit
    reelHitCallIn(reelIndex, mode = 0) {
        // 特殊模式時是否有特殊效果
        if (mode > 0) {
            if (mode > 1) {
                this.hitCountAry[reelIndex]++;
            }

            if (this.hitCountAry[reelIndex] === Config.NUM_ROWS && mode === 3) {
                const pos = ConfigTools.symbolLocal(Config.NUM_ROWS, reelIndex + 1, types.align.CENTER_DOWN);
                const clipSmoke = new Phaser.Sprite(this.game, pos.x - 30, pos.y - 70, 'clip_Smoke');
                this.add(clipSmoke);
                clipSmoke.animations.add('smokePlay');
                // clipSmoke.scale.set(1.2, 1);
                clipSmoke.anchor.set(0.5);
                clipSmoke.animations.currentAnim.onComplete.add(() => {
                    this.remove(clipSmoke);
                }, this);
                clipSmoke.animations.play('smokePlay', 15);
            }
            const count = this.hitCountAry[reelIndex];
            const easeValue = (count > 1) ? (count - 1) * 0.004 : 0;
            const value = 0.005 + easeValue;
            this.game.camera.shake(value, 100, false, Phaser.Camera.SHAKE_VERTICAL);    // 消消樂碰撞震動效果
            Sound.playFeature('Puzzle');
            return;
        }

        const singleReelResult = this.reelContext.children[reelIndex].singleReelResult;
        for (let i = 0; i < singleReelResult.length; i++) {
            if (Config.REEL_STOP_SYMBOL_ANIMATION.indexOf(singleReelResult[i]) !== -1) {
                this.reelContext.children[reelIndex].symbolIdleAnimation(i, singleReelResult[i]);
            }
        }

        const endIndex = +this.slowKeyArray[this.slowKeyInx];
        let specialSymbol = '';
        if (this.slowDataObject[endIndex] !== undefined) {
            const getHitStr = this.slowDataObject[endIndex].hitData[reelIndex];
            const maxHitStr = this.slowDataObject[endIndex].symbolID[0];
            // 前一輪與該Slow輪會Hit
            if (reelIndex === endIndex - 1 || reelIndex === endIndex) {
                specialSymbol = (maxHitStr === getHitStr || getHitStr === '') ? getHitStr : maxHitStr;
            }
        }
        // 相反的如果對象是Scatter 並且有開起每輪要Hit
        if (SlowConfig.IS_SCATTER_HIT) {
            for (let inx = 0; inx < Config.SYMBOL_SCATTER.length; inx++) {
                const id = Config.SYMBOL_SCATTER[inx];
                const isHit = this.reelContext.children[reelIndex].callGetNowSymoblId(id);
                if (isHit && this.currentStoppedFC === reelIndex) {
                    specialSymbol = id;
                    this.currentStoppedFC++;
                    break;
                }
            }
        }
        (specialSymbol === '') ? Sound.playDamping() : Sound.playFreeHit(specialSymbol, this.currentStoppedFC);
    }

    // 每輪 reel 完成後
    reelComplete(reelIndex) {
        this.reelCompleteCount++;
        // console.log('停止的輪ID', this.slowKeyInx, (this.slowKeyInx !== -1 && !this.isSlowing && !this.isEmgStop && reelIndex === Number(this.slowKeyArray[this.slowKeyInx]) - 1));
        // 要跑第一個 slow 軸的前一輪停止時啟動瞇牌特效(只會跑一次)
        if (this.slowKeyInx !== -1 && !this.isSlowing && !this.isEmgStop && reelIndex === Number(this.slowKeyArray[this.slowKeyInx]) - 1) {
            this.isSlowing = true;
            // console.log('啟動瞇牌');
            this.slowReelIndex = reelIndex;
            this.slowKeyInx = 0;
        }

        if (this.respinSign[reelIndex]) {
            const signNum = reelIndex - 1;
            this.respinSignObj[reelIndex].loadTexture(`respinSignBright_${signNum}`, `respinSign_bright_${signNum}_1.png`);
            this.respinSignObj[reelIndex].animations.play('bright', 30);
            this.respinSign[reelIndex] = false;
        }

        // 瞇牌的那輪已結束 累加ReelIndex
        if (this.isSlowing && !this.isEmgStop && this.slowReelIndex + 1 < Config.NUM_REELS) {
            this.slowReelIndex++;
            // 停止 slow 音效
            Sound.stopSlow();
            // 清掉目前Slow創建顯示的靜態Symbol
            this.group.removeAll(true);
            // 當確定停止該輪ID 為Slow Index (瞇牌輪已停止)
            if (this.slowReelIndex === Number(this.slowKeyArray[this.slowKeyInx])) {
                this.slowFocus(this.slowReelIndex); // 設定需要瞇牌那輪ID
                // 累加數值更變下一組Slow Index的判斷
                if (this.slowKeyInx < this.slowKeyArray.length - 1) {
                    this.slowKeyInx++;
                }
                return;
            }

            // 關閉 slow 粒子特效(暫時)
            this.slowBorderEffect.hideSlow();
            this.allSingleMasktCtl(false);
            // 清除該輪Slow資料(會切換到一般模式的停止 逐漸單個)
            this.reelContext.children[this.slowReelIndex].slowClose();
            // // 當瞇牌後面都沒有做後續滾輪全急停(ALL)
            // if (this.slowReelIndex > this.slowKeyArray[this.slowKeyArray.length - 1]){
            //     this.reelStop();
            // }
            // // 急停版(逐漸單個)
            // this.reelContext.children[this.slowReelIndex].onEmgStopRolling();
        }

        // 當瞇牌時 拍下停止需要等待該輪瞇牌跑完後面還沒瞇牌對象一起全部急停
        if (this.isEmgStop && this.isSlowing && SlowConfig.IS_SLOW_EMGSTOP_MODE === 2) {
            this.resetSlowReel();   // 關閉瞇牌動畫清除Slow Data
            this.reelclearSlow();   // 清掉全部滾輪的Slow註冊節奏紀錄,避免該滾輪要跑一般節奏卻跑瞇牌節奏
            this.reelStop();        // 全部滾輪設置急停
        }

        // 全部滾輪停止
        if (this.reelCompleteCount === Config.NUM_REELS) {
            this.resetSlowReel();
            this.allReelComplete();
        }
    }

    // 重置 slow 多出來的動畫或是狀態
    resetSlowReel() {
        // 停止 slow 音效
        Sound.stopSlow();
        // 關閉 slow 粒子特效
        this.slowBorderEffect.hideSlow();
        this.allSingleMasktCtl(false);
        // 清除 slow 產生的全部物件
        this.slowDataObject = {};
        // 存放 slow Key的陣列
        this.slowKeyArray = [];
        this.slowKeyArray.length = 0;
        this.group.removeAll(true);
    }

    // 全部滾輪都結束了觸發
    allReelComplete() {
        Sound.stopSpin();
        // 重置 hit 聲音狀態
        Sound.stopHit();
        // 重置完成的滾輪計數
        this.reelCompleteCount = 0;
        this.currentStoppedFC = 0;
        this.currentLeadSymbol = '';
        // 重置 slow 多出來的動畫或是狀態
        this.resetSlowReel();
        // 重設停止狀態
        this.isEmgStop = false;
        // 滾輪確定結束
        this.isPlaying = false;
        // 急停初始化
        this.isSlowing = false;
        // 重置 slow index
        this.slowReelIndex = -1;

        // 重置滾輪狀態
        for (let i = 0; i < this.reelContext.children.length; i++) {
            this.hitCountAry[i] = 0;
            this.reelContext.children[i].reset();
            if (!this.isFreePlay) {
                // 記錄滾輪資料(BlowUp的一般模式使用)
                const data = this.reelContext.children[i].getEndSymbolData;
                const index = this.reelContext.children[i].setRangeIndex;
                this.rangeDataAry[i] = data;
                this.rangeDataIndexAry[i] = index;
            }
        }

        // 冒險島
        if (this.resultData.extraData[0] !== null) {
            let totalExpandReels = 0;
            let currentCompleteReels = 0;
            for (let reel = 0; reel < this.resultData.extraData[0].length; reel++) {
                if (this.resultData.extraData[0][reel] > 0) {
                    totalExpandReels++;
                    const wildAniAry = [];
                    const frontSymbolAry = [];
                    let wildAniTween = new TimelineMax();
                    let frontSymbolTween = new TimelineMax();
                    let wldDoneCount = 0;
                    const frameCount = this.game.cache.getFrameCount('clip_W1');
                    let wildRow = -1;
                    for (let row = 0; row < this.resultData.symbolResult.length; row++) {
                        const targetX = this.reelContext.x + Config.SYMBOL_WIDTH / 2 + this.reelContext.children[reel].x;
                        const targetY = this.reelContext.y + Config.SYMBOL_HEIGHT / 2 + this.reelContext.children[reel].symbolPosition(row);
                        const wld = new Phaser.Sprite(this.game, targetX, targetY, 'clip_W1', 'clip_symbol_W1_1.png');
                        const frameAry = Phaser.Animation.generateFrameNames('clip_symbol_W1_', 1, frameCount, '.png');
                        wld.animations.add('ani', frameAry);
                        wld.anchor.set(0.5);
                        wld.alpha = this.resultData.symbolResult[row][reel] === 'W1' ? 1 : 0;
                        wildAniAry[row] = wld;
                        this.add(wld);

                        if (this.resultData.symbolResult[row][reel] !== 'W1') {
                            const sym = new Phaser.Sprite(this.game, targetX, targetY, 'symbol', `img_symbol_${this.resultData.symbolResult[row][reel]}.png`);
                            sym.anchor.set(0.5);
                            frontSymbolAry[row] = sym;
                            this.add(sym);
                        } else {
                            wildRow = row;
                        }
                    }

                    this.reelContext.children[reel].showAllSymbolIcon(false);
                    this.reelContext.children[reel].setChangeSymbolImg(1, 'W1');
                    this.reelContext.children[reel].setChangeSymbolImg(2, 'W1');
                    this.reelContext.children[reel].setChangeSymbolImg(3, 'W1');

                    let wildAniPlayOrderAry = [];
                    switch (wildRow) {
                        case 0 : {
                            wildAniPlayOrderAry = [ 1, 2 ];
                            break;
                        }
                        case 2 : {
                            wildAniPlayOrderAry = [ 1, 0 ];
                            break;
                        }
                        default:
                    }

                    wildAniAry.forEach((item) => {
                        item.animations.getAnimation('ani').onComplete.add(() => {
                            wldDoneCount++;
                            if (wldDoneCount >= 3) {
                                wildAniTween.clear();
                                frontSymbolTween.clear();
                                wildAniTween = null;
                                frontSymbolTween = null;
                                this.reelContext.children[reel].showAllSymbolIcon(true);
                                wildAniAry.forEach((wld) => {
                                    wld.destroy(true, false);
                                });
                                wildAniAry.length = 0;
                                frontSymbolAry.forEach((sym) => {
                                    sym.destroy(true, false);
                                });
                                frontSymbolAry.length = 0;
                                currentCompleteReels++;
                                if (totalExpandReels === currentCompleteReels) {
                                    let delayTween = new TimelineLite();
                                    delayTween
                                    .to({}, 0.6,
                                        {
                                            onComplete: () => {
                                                this.onDispatchEvent(new SlotGame.ReelEvent(SlotGame.ReelEvent.ON_REELBAR_COMPLETE));
                                                delayTween.clear();
                                                delayTween = null;
                                            }
                                        }
                                    );
                                }
                            }
                        }, this);
                    });

                    wildAniAry[wildRow].animations.play('ani', frameCount, false);

                    if (wildAniPlayOrderAry.length > 0) {
                        // 當wild出現在 row 0 or 2
                        wildAniTween
                        .to(wildAniAry[wildAniPlayOrderAry[0]], 0.4, {
                            alpha: 1,
                            ease: Power4.easeOut,
                            onStart: () => {
                                wildAniAry[wildAniPlayOrderAry[0]].animations.play('ani', frameCount, false);
                            }
                        }, 'expand')
                        .to(wildAniAry[wildAniPlayOrderAry[0]].scale, 0.2, {
                            x: 1.2,
                            y: 1.2,
                            ease: Power3.easeOut
                        }, 'expand')
                        .to(wildAniAry[wildAniPlayOrderAry[0]].scale, 0.2, {
                            x: 1,
                            y: 1,
                            ease: Power1.easeIn
                        }, '-=0.2')
                        .to(wildAniAry[wildAniPlayOrderAry[1]], 0.4, {
                            alpha: 1,
                            ease: Power4.easeOut,
                            onStart: () => {
                                wildAniAry[wildAniPlayOrderAry[1]].animations.play('ani', frameCount, false);
                            }
                        }, '-=0.2')
                        .to(wildAniAry[wildAniPlayOrderAry[1]].scale, 0.2, {
                            x: 1.2,
                            y: 1.2,
                            ease: Power3.easeOut
                        }, '-=0.1')
                        .to(wildAniAry[wildAniPlayOrderAry[1]].scale, 0.2, {
                            x: 1,
                            y: 1,
                            ease: Power1.easeIn
                        }, '-=0.1');

                        const rndPrm = [
                            Math.random() < 0.5 ? -1 : 1,
                            Math.random() < 0.5 ? -1 : 1
                        ];
                        frontSymbolTween
                        .to(frontSymbolAry[wildAniPlayOrderAry[0]], 0.3, {
                            alpha: 0,
                            ease: Power3.easeOut
                        }, 'a')
                        .to(frontSymbolAry[wildAniPlayOrderAry[0]], 0.7, {
                            ease: Power1.easeOut,
                            x: frontSymbolAry[wildAniPlayOrderAry[0]].x + Math.floor(200 + Math.random() * 80) * rndPrm[0],
                            y: frontSymbolAry[wildAniPlayOrderAry[0]].y - 250 - Math.floor(Math.random() * 80),
                            angle: Math.floor(270 + Math.random() * 270) * rndPrm[0]
                        }, 'a')
                        .to(frontSymbolAry[wildAniPlayOrderAry[1]], 0.3, {
                            alpha: 0,
                            ease: Power3.easeOut
                        }, '-=0.3')
                        .to(frontSymbolAry[wildAniPlayOrderAry[1]], 0.7, {
                            ease: Power1.easeOut,
                            x: frontSymbolAry[wildAniPlayOrderAry[1]].x + Math.floor(200 + Math.random() * 80) * rndPrm[1],
                            y: frontSymbolAry[wildAniPlayOrderAry[1]].y - 250 - Math.floor(Math.random() * 80),
                            angle: Math.floor(270 + Math.random() * 270) * rndPrm[1]
                        }, '-=0.7');
                    } else {
                        // 當wild出現在 row 1
                        wildAniTween
                        .to([ wildAniAry[0], wildAniAry[2] ], 0.4, {
                            alpha: 1,
                            ease: Expo.easeOut,
                            onStart: () => {
                                wildAniAry[0].animations.play('ani', frameCount, false);
                                wildAniAry[2].animations.play('ani', frameCount, false);
                            }
                        }, 'expand')
                        .to([ wildAniAry[0].scale, wildAniAry[2].scale ], 0.2, {
                            x: 1.2,
                            y: 1.2,
                            ease: Power3.easeOut
                        }, 'expand')
                        .to([ wildAniAry[0].scale, wildAniAry[2].scale ], 0.2, {
                            x: 1,
                            y: 1,
                            ease: Power1.easeIn
                        });
                        const rndPrm = [
                            Math.random() < 0.5 ? -1 : 1,
                            Math.random() < 0.5 ? -1 : 1
                        ];
                        frontSymbolTween
                        .to(frontSymbolAry[0], 0.4, {
                            alpha: 0,
                            ease: Power3.easeOut
                        }, 'a')
                        .to(frontSymbolAry[0], 0.6, {
                            ease: Power1.easeOut,
                            x: frontSymbolAry[0].x + Math.floor(200 + Math.random() * 80) * rndPrm[0],
                            y: frontSymbolAry[0].y - 250 - Math.floor(Math.random() * 80),
                            angle: Math.floor(270 + Math.random() * 270) * rndPrm[0]
                        }, 'a')
                        .to(frontSymbolAry[2], 0.4, {
                            alpha: 0,
                            ease: Power3.easeOut
                        }, '-=0.3')
                        .to(frontSymbolAry[2], 0.6, {
                            ease: Power1.easeOut,
                            x: frontSymbolAry[2].x + Math.floor(200 + Math.random() * 80) * rndPrm[1],
                            y: frontSymbolAry[2].y - 250 - Math.floor(Math.random() * 80),
                            angle: Math.floor(270 + Math.random() * 270) * rndPrm[1]
                        }, '-=0.7');
                    }
                }
            }
            this.game.camera.shake(0.005, 700, false, Phaser.Camera.SHAKE_BOTH);
            return;
        }

        if (this.islandRespinTimes === 0) {
            this.reelContext.children.forEach((reel) => {
                reel.updateSymbol = this.updateSymbol;
            });
        }

        // Reel事件結束 回調進入下一個結算動畫流程了
        this.onDispatchEvent(new SlotGame.ReelEvent(SlotGame.ReelEvent.ON_REELBAR_COMPLETE));
    }

    // 偵聽遊戲狀態
    gameSlotStates(evt) {
        switch (evt.statesType) {
            // 初始化Reel
            case SlotGame.GaStatesConfig.gameinit: {
                this.initReel(evt.gameInfoRange);
                break;
            }
            // 閒置
            case SlotGame.GaStatesConfig.gameIdle: {
                this.isAutoPlay = evt.isAutoPlay;
                this.isFreePlay = evt.isFreePlay;
                this.isRespinPlay = evt.isRespinPlay;
                // 遊戲特色 顯示Symbol靜止時的動畫
                // const data = (this.isFreePlay) ? this.resultFreeData : this.resultData;
                // this.startIdlePlay(data.symbolResult);
                this.showBigMask(false);
                if (Config.SYMBOL_IDLE_ANIMATION.length > 0) {
                    this.randomIdleAnimation();
                }
                break;
            }
            // 啟動Reel
            case SlotGame.GaStatesConfig.gameSpin: {
                // 遊戲特色：開始滾動才刪除待機動畫
                // this.stopIdlePlay();
                // 是否為FreeGame Spin
                this.isAutoPlay = evt.isAutoPlay;
                this.isFreePlay = evt.isFreePlay;
                this.isRespinPlay = evt.isRespinPlay;
                this.reelStart();
                clearTimeout(this.delayTO);
                this.showBigMask(false);
                // 停止idle動畫
                this.reelContext.children.forEach((reel, reelIndex) => {
                    const singleReelResult = this.reelContext.children[reelIndex].singleReelResult || [];
                    for (let i = 0; i < singleReelResult.length; i++) {
                        this.reelContext.children[reelIndex].symbolIdleStop(i, singleReelResult[i]);
                    }
                }, this);
                break;
            }
            // 停止Reel
            case SlotGame.GaStatesConfig.gameStop: {
                // 轉動尚未開始不可觸發此功能
                if (!this.isPlaying) { return; }
                this.onEmpStopEvent();
                break;
            }
            // 發布中獎事件(免費遊戲剛切回BassGame的時候 只會發gameWin 跟 gameNoWin 此時isFreePlay剛換成false)
            case SlotGame.GaStatesConfig.gameWin: {
                // 更變目前狀態
                this.isAutoPlay = evt.isAutoPlay;
                this.isFreePlay = evt.isFreePlay;
                this.isRespinPlay = evt.isRespinPlay;

                // 停止idle動畫
                this.reelContext.children.forEach((reel, reelIndex) => {
                    const singleReelResult = this.reelContext.children[reelIndex].singleReelResult;
                    for (let i = 0; i < singleReelResult.length; i++) {
                        this.reelContext.children[reelIndex].symbolIdleStop(i, singleReelResult[i]);
                    }
                }, this);
                break;
            }
            case SlotGame.GaStatesConfig.gameNoWin: {
                // 更變目前狀態
                this.isAutoPlay = evt.isAutoPlay;
                this.isFreePlay = evt.isFreePlay;
                this.isRespinPlay = evt.isRespinPlay;
                break;
            }
            // 收到控制器發佈取分的動作
            case SlotGame.GaStatesConfig.gameTakeWin: {
                // 遊戲特色：恢復待機動畫
                this.IdlePlayGroup.children.forEach((item) => {
                    item.visible = true;
                });
                this.showBigMask(false);
                this.isAutoPlay = evt.isAutoPlay;
                this.isFreePlay = evt.isFreePlay;
                this.isRespinPlay = evt.isRespinPlay;
                if (ReelWinHideSignal.isCallEvent) {
                    this.openAllReelShow();
                    ReelWinHideSignal.callBack();
                    // 清除單線輪閃
                    clearTimeout(this.inTurnTimer);
                    this.inTurnTimer = null;
                    this.inTurnCount = 0;
                    this.winHideSignalData = {};
                }
                break;
            }
            default:
        }
    }

    // 判斷瞇牌急停模式
    onEmpStopEvent() {
        // console.log('瞇牌急停模式', `MODE:${SlowConfig.IS_SLOW_EMGSTOP_MODE}`, `isSlowing:${this.isSlowing}`);
        switch (SlowConfig.IS_SLOW_EMGSTOP_MODE) {
            case 0:
                // 如果還沒觸發Slow Loop事件之前可以取消掉已設定好Slow Loop的資料
                this.reelclearSlow();
                this.reelStop();
                break;
            case 1:
                // 但一出現咪牌後 就不可急停 等待所有的瞇牌滾輪都結束
                if (!this.isSlowing) {
                    this.reelclearSlow();
                    this.reelStop();
                }
                break;
            case 2:
                // 如果在咪牌中 可以取消掉後面滾輪的咪牌並且設置狀態'玩家已觸發急停' 等待咪牌滾輪完畢後跟後面繼續轉動還沒咪牌一起停止
                if (this.isSlowing) {
                    this.isEmgStop = true;
                    return;
                }
                // 如果還沒觸發Slow Loop事件之前可以取消掉已設定好Slow Loop的資料
                this.reelclearSlow();
                this.reelStop();
                break;
            case 3:
                if (this.slowReelIndex < this.reelContext.children.length - 1 && this.slowKeyArray.length > 0 && this.isSlowing) {
                    this.isEmgStop = true;
                    let inx = this.reelContext.children.length - 1;
                    for (let i = 0; i < this.slowKeyArray.length; i++) {
                        this.reelContext.children[inx].onEmgStopRolling();
                        this.reelContext.children[inx].slowClose();
                        inx--;
                    }
                    return;
                }
                if (!this.isSlowing) {
                    // 如果還沒觸發Slow Loop事件之前可以取消掉已設定好Slow Loop的資料
                    this.reelclearSlow();
                    this.reelStop();
                }
                break;
            default:
        }
    }

    // 瞇牌 高亮瞇牌的那軸 其它加上黑色遮罩
    slowFocus(slowReelIndex) {
        this.onDispatchEvent(new SlotGame.ReelEvent(SlotGame.ReelEvent.ON_SLOW_FOCUS));
        const eachSymbolWidth = Config.SYMBOL_WIDTH + Config.SYMBOL_PADDING_X + Config.SPACE_BASE_SYMBOLS_X;
        const offsetSymbolX = Config.SYMBOL_PADDING_X * 0.5;
        const offsetSymbolY = Config.SYMBOL_PADDING_Y * 0.5;
        Sound.playSlow();
        this.slowBorderEffect.stopSlowBorder();
        this.slowBorderEffect.playAndLoop();
        this.slowBorderEffect.setPosition(
            this.reelContext.x + (slowReelIndex * eachSymbolWidth - offsetSymbolX) - 120,
            this.reelContext.y - offsetSymbolY - 140
        );
        this.showSlowMask(true, slowReelIndex);
        // 通知該輪要切換瞇牌停止
        this.reelContext.children[this.slowReelIndex].onSlowRolling(this.slowReelIndex);

        const data = (this.isFreePlay) ? this.resultFreeData : this.resultData;
        for (let i = 0; i < this.slowDataObject[slowReelIndex].symbolPosition.length; i++) {
            this.makeMultipleSymbols(this.slowDataObject[slowReelIndex].symbolPosition[i], data.symbolResult);
        }
    }

    /**
     * 遮罩控制
     * @param  {Boolean} bool 是否隱藏
     */
    allSingleMasktCtl(bool) {
        // 未中獎的 symbol 隱藏方式 true : 遮罩 / false : tint
        if (Config.IS_SYMBOL_MASK) {
            this.OverlayBox.children.forEach((item) => {
                item.show(bool);
            });
            return;
        }

        for (let i = 0; i < Config.NUM_REELS; i++) {
            this.reelContext.children[i].tintSymbol(bool);
        }
    }

    showSlowMask(bool, slowReelIndex) {
        this.allSingleMasktCtl(bool);
        if (Config.IS_SYMBOL_MASK) {
            this.OverlayBox.children[slowReelIndex].show(false);
            return;
        }

        this.reelContext.children[slowReelIndex].tintSymbol(false);
    }

    /**
     * @param {Boolean} bool 是否讓 symbol 灰掉
     */
    showBigMask(bool) {
        // 秀大遮罩
        if (Config.IS_SYMBOL_MASK) {
            this.reelOverlay.show(bool);
            return;
        }

        // 秀 symbol tint
        for (let i = 0; i < Config.NUM_REELS; i++) {
            this.reelContext.children[i].tintSymbol(bool);
        }
    }

    // 開始轉動
    reelStart() {
        // 判斷目前是否正在轉動中
        if (!this.isPlaying) {
            // 設定已轉動中
            this.isPlaying = true;
            // 非ReSpin模式普通啟動
            if (!this.isRespinPlay) {
                // 是否免費是否播放音效 或者config強制設定強制進入
                if (!this.isFreePlay || Config.IS_FREE_SPINSOUND_PLAY) {
                    Sound.playSpin();
                }

                // 通知每輪進行轉動
                for (let i = 0; i < this.reelContext.children.length; i++) {
                    // 啟動轉動
                    this.playReelControl(i);
                }
            }

            // 冒險島
            if (this.isRespinPlay) {
                Sound.playSpin();
                for (let i = 0; i < this.reelContext.children.length; i++) {
                    // 啟動轉動
                    this.playReelControl(i);
                }
            }
        }
    }

    // 停止轉動
    reelStop() {
        // 切換狀態參數
        this.isEmgStop = true;
        // 通知每輪發送急停令命
        for (let i = 0; i < this.reelContext.children.length; i++) {
            this.reelContext.children[i].onEmgStopRolling();
        }
    }

    // 清除每輪軸內有註冊"需要進行Slow效果"的訊息
    reelclearSlow() {
        for (let i = 0; i < this.reelContext.children.length; i++) {
            this.reelContext.children[i].slowClose();
        }
    }

    // 收到Range資料時,設定Reel畫面初始化
    initReel(stripData) {
        // 播放背景音樂
        // Sound.playBg();

        if (this.reelContext.children.length === 0) {
            const initSymbolResult = [];
            // 組合Socket傳來的SymbolResult格式專用 遊戲特色
            for (let rowIndex = 0; rowIndex < Config.NUM_ROWS; rowIndex++) {
                initSymbolResult.push([]);
                for (let index = 0; index < Config.NUM_REELS; index++) {
                    initSymbolResult[rowIndex].push(0);
                }
            }

            for (let index = 0; index < Config.NUM_REELS; index++) {
                const Reel = new ReelControl(this.game, index, Config.SYMBOL_WIDTH, Config.SYMBOL_HEIGHT, 'symbol');
                this.reelContext.addChild(Reel);
                Reel.x = index * (Config.SYMBOL_WIDTH + Config.SPACE_BASE_SYMBOLS_X + Config.SYMBOL_PADDING_X);
                Reel.y = 0;
                Reel.setSymbolName = 'img_symbol_';
                Reel.onHitComplete.add(this.reelHitCallIn, this);
                Reel.onComplete.add(this.reelComplete, this);   // every reel complete event
                Reel.updateTempo(Config);
                Reel.reSetRange(stripData[index], Config.BASE_RANGE_INDEX[index] || 0);

                // 單條遮罩
                const reelOverlay = new Overlay(this.game, {
                    settings: [ Reel.x, Reel.y, Config.SYMBOL_WIDTH + Config.SYMBOL_PADDING_X, Config.PageMaxHeight ],
                    alpha: 0.8,
                    color: 0x000000
                });

                this.hitCountAry[index] = 0;
                reelOverlay.show(false);
                this.OverlayBox.add(reelOverlay);
                // 組合Socket傳來的SymbolResult格式專用 遊戲特色
                for (let row = 1; row <= Config.NUM_ROWS; row++) {
                    initSymbolResult[row - 1][index] = Reel.getNowSymbolData[row];
                }
            }
            // 特殊
            if (process.env.NODE_ENV === 'develop' || process.env.NODE_ENV === 'devtest') {
                const { PPAP } = require('slot-base');
                new PPAP(this.reelContext.children, SlotGame.ReelEvent, SlotGame.GameEvent, SlotGame.GaStatesConfig);
            }

            // 冒險島
            this.updateSymbol = this.reelContext.children[0].updateSymbol;

            // 遊戲特色：跑待機動畫
            // this.startIdlePlay(initSymbolResult);
        }
    }

    /**
     * 收到資料
     * @param  {data} data   play data
     */
    onGetResultData(data) {
        (this.isFreePlay)
        ? this.resultFreeData = data
        : this.resultData = data;

        this.slowCtrl.useSlowInfoData = SlowConfig.SYMBOL_SLOW_DATA.normalSlow;
        // 有FreeGame模式
        if (Config.IN_FREE_GAME && this.isFreePlay) {
            // FreeGame達到maxSpin時 切換maxSpinSlow的瞇牌條件;相反的切回來 （遊戲特色）
            (this.isFreePlay && this.resultFreeData.isMaxSpin && this.resultFreeData.addCount === 0)
            ? this.slowCtrl.useSlowInfoData = SlowConfig.SYMBOL_SLOW_DATA.maxSpinSlow
            : this.slowCtrl.useSlowInfoData = SlowConfig.SYMBOL_SLOW_DATA.freeSlow;
        }

        this.slowReelIndex = -1;    // 初始化要瞇牌的輪ID  -1 : 無
        this.slowKeyInx = -1;       // 初始化瞇牌資料索引

        this.slowDataObject = SlowControl.resultData(data.symbolResult);    // 判斷轉動資料並取得瞇牌資料
        this.slowKeyArray = Object.keys(this.slowDataObject);               // 解析瞇牌資料是否有要瞇牌的
        if (this.slowKeyArray.length !== 0) {
            this.slowReelIndex = +this.slowKeyArray[0];                     // 寫入第一輪要瞇牌的轉輪ID
            this.slowKeyInx = 0;
        }

        // 冒險島 ============= =============
        if (this.islandRespinTimes > 0) {
            this.islandRespinTimes--;
            for (let reelIndex = 0; reelIndex < this.reelContext.children.length; reelIndex++) {
                // 判斷自己的輪軸ID 是否大於等於瞇牌軸那輪 且要有瞇牌對象
                const isSlow = (reelIndex >= this.slowReelIndex && this.slowReelIndex !== -1);
                this.reelContext.children[reelIndex].onKeepRolling(
                    data.rngData[reelIndex], // rng位置
                    isSlow                  // 設定此輪是要切換到Slow Loop的狀態(會一直Loop直到通知瞇牌那輪ID)
                );
                // =========== 把滾輪結果塞到單一滾輪中
                //
                const singleReelResult = [];
                for (let rowIndex = 0; rowIndex < data.symbolResult.length; rowIndex++) {
                    singleReelResult[rowIndex] = data.symbolResult[rowIndex][reelIndex];
                }
                this.reelContext.children[reelIndex].singleReelResult = singleReelResult;
            }
            if (this.swallowSymbolType === 0) {
                for (let reelIndex = 0; reelIndex < this.reelContext.children.length; reelIndex++) {
                    this.reelContext.children[reelIndex].onGetRNGData = true;
                }
                const reelInx = this.islandRespinTimes + 2;
                const signNum = this.islandRespinTimes + 1;
                this.respinSignObj[reelInx].loadTexture(`respinSignDark_${signNum}`, `respinSign_dark_${signNum}_1.png`);
                this.respinSignObj[reelInx].animations.play('dark', 30);
            }
            return;
        }
        // ============= =============

        // 拿到特殊 symbol array (撥聲音用)
        for (let reelIndex = 0; reelIndex < this.reelContext.children.length; reelIndex++) {
            // 判斷自己的輪軸ID 是否大於等於瞇牌軸那輪 且要有瞇牌對象
            const isSlow = (reelIndex >= this.slowReelIndex && this.slowReelIndex !== -1);
            this.reelContext.children[reelIndex].onStopRolling(
                data.rngData[reelIndex], // rng位置
                isSlow                  // 設定此輪是要切換到Slow Loop的狀態(會一直Loop直到通知瞇牌那輪ID)
            );
            // =========== 把滾輪結果塞到單一滾輪中
            //
            const singleReelResult = [];
            for (let rowIndex = 0; rowIndex < data.symbolResult.length; rowIndex++) {
                singleReelResult[rowIndex] = data.symbolResult[rowIndex][reelIndex];
            }
            this.reelContext.children[reelIndex].singleReelResult = singleReelResult;
        }

        // ReSpin 模式
        if (this.isRespinPlay) {
            // 消消樂模式
            if (Config.IS_BLOW_UP_SYMBOL) {
                this.slowReelIndex = -1;    // 初始化要瞇牌的輪ID  -1 : 無
                this.slowKeyInx = -1;       // 初始化瞇牌資料索引
                // 通知每輪進行轉動
                for (let i = 0; i < this.reelContext.children.length; i++) {
                    this.reelContext.children[i].blowUpSpin();
                }
                return;
            }
            // 通知每輪進行轉動
            for (let i = 0; i < this.reelContext.children.length; i++) {
                (Config.RESPIN_MODE === 0)
                ? this.playReelControl(i)
                : this.reelContext.children[i].reSpin();                    // 啟動轉動
            }
        }

        // 冒險島
        this.respinSign = [ false, false, false, false, false ];
        if (this.resultData.extraData[1] !== null) {
            let biggestCount = 0;
            this.resultData.symbolCountAry.forEach((count) => {
                if (count > biggestCount) {
                    biggestCount = count;
                }
            });
            this.respinSign.forEach((flag, inx) => {
                if (inx > 1 && biggestCount > inx) {
                    this.respinSign[inx] = true;
                }
            });
            this.islandRespinTimes = this.resultData.extraData[1].ReSpinData.length;
            this.swallowSymbolType = this.resultData.symbolIdAry[0][0] === 'M' ? 1 : 2;
            this.currentRspinSymbol = this.resultData.symbolIdAry[0];
        }
    }

    // Slow 產生需要瞇牌的前置對象Symbol
    makeMultipleSymbols(symbolPosition, symbolResult) {
        for (let rowIndex = 0; rowIndex < symbolPosition.length; rowIndex++) {
            for (let reelIndex = 0; reelIndex < symbolPosition[rowIndex].length; reelIndex++) {
                // 且在 slow 軸之前
                if (symbolPosition[rowIndex][reelIndex] !== 0) {
                    // 瞇牌時停止idle動畫
                    this.reelContext.children[reelIndex].symbolIdleStop(rowIndex, symbolResult[rowIndex][reelIndex]);

                    // 要產生的 symbol ID
                    const SymbolKey = ConfigTools.changeSymbolID(this.game, 'symbol', symbolResult[rowIndex][reelIndex]);
                    const pos = ConfigTools.symbolLocal(Number(rowIndex + 1), reelIndex, types.align.CENTER);
                    const sprite = this.group.create(pos.x, pos.y, 'symbol', SymbolKey);
                    sprite.anchor.set(0.5);
                }
            }
        }
    }

    randomIdleAnimation() {
        if (this.isPlaying) {
            return;
        }
        this.reelContext.children.forEach((reel, reelIndex) => {
            const singleReelResult = this.reelContext.children[reelIndex].singleReelResult || [];
            for (let i = 0; i < singleReelResult.length; i++) {
                if (Config.SYMBOL_IDLE_ANIMATION.indexOf(singleReelResult[i]) !== -1 && Math.random() < 0.2) {
                    this.reelContext.children[reelIndex].symbolIdleAnimation(i, singleReelResult[i]);
                }
            }
        }, this);

        const ramdonSec = Math.floor(Math.random() * 5000) + 2500;
        this.delayTO = setTimeout(() => {
            this.randomIdleAnimation();
        }, ramdonSec);
    }

    // # 自訂轉動模式
    playReelControl(reelIdx) {
        if (!this.isRespinPlay) {
            // 帶入特殊模式
            // if (this.isFreePlay) {
            //     // 自訂轉動模式 undefined 為 正常版
            //     const effectData = SlotGame.ReelEffectEase.easeBrushOffReel;
            //     effectData.easedata.idx = reelIdx;
            //     effectData.easedata.sec = 0.6;
            //     effectData.easedata.delay = reelIdx * 0.05;
            //     effectData.easedata.delayY = 0.1;
            //     effectData.easedata.isbounce = true;
            //     effectData.easedata.bounceY = 30;
            //     effectData.easedata.easeing = Linear.easeOut;
            //     this.reelContext.children[reelIdx].spin(effectData);
            //     return;
            // }
        }
        // 正常
        this.reelContext.children[reelIdx].spin();
    }

    // 開啟加速模式
    onBoost(data) {
        let tempObj = {};
        switch (data.reelSpeed) {
            case 0: {
                tempObj = this.tempObj;
                break;
            }
            case 1: {
                tempObj = {
                    FIRST_ROLL_SYMBOL_COUNT: 4,
                    DIFF_PASS_COUNT_EACH_REEL: 4,
                    ROLLING_SYMBOL: 20,
                    SLOW_EMG_ROLLING_PASS_COUNT: 1,
                    SLOW_ROLLING_PASS_COUNT: 4,
                    SLOW_ROLLING_SYMBOL: 50,
                    ROLLING_SYMBOL_COUNT: 3,
                    EMG_ROLLING_SYMBOL: 1
                };
                break;
            }
            case 2: {
                tempObj = {
                    FIRST_ROLL_SYMBOL_COUNT: 1,
                    DIFF_PASS_COUNT_EACH_REEL: 4,
                    ROLLING_SYMBOL: 50,
                    SLOW_EMG_ROLLING_PASS_COUNT: 1,
                    SLOW_ROLLING_PASS_COUNT: 4,
                    SLOW_ROLLING_SYMBOL: 50,
                    ROLLING_SYMBOL_COUNT: 1,
                    EMG_ROLLING_SYMBOL: 1
                };
                break;
            }
            default:
        }

        for (let i = 0; i < this.reelContext.children.length; i++) {
            this.reelContext.children[i].updateTempo(tempObj);
        }
    }

    moaiSwallow() {
        let currentSwallowSymbolAry = [];
        switch (this.swallowSymbolType) {
            case 1:
                currentSwallowSymbolAry = this.MSymbolObjAry;
                break;
            case 2:
                currentSwallowSymbolAry = this.NSymbolObjAry;
                break;
            default:
        }
        for (let i = 0; i < currentSwallowSymbolAry.length; i++) {
            currentSwallowSymbolAry[i].position.set(
                this.game.width / 2 + Math.floor(Math.random() * 300) - Math.floor(Math.random() * 300),
                this.game.height / 2 + Math.floor(Math.random() * 200) - Math.floor(Math.random() * 200)
            );

            let swallowSymbolTween = new TimelineMax();
            swallowSymbolTween
            .to(currentSwallowSymbolAry[i], 0.7, {})
            .to(currentSwallowSymbolAry[i], 1, {
                ease: Power3.easeOut,
                y: currentSwallowSymbolAry[i].y - 60 - Math.floor(Math.random() * 30),
                alpha: 1,
                onStart: () => {
                    this.allSingleMasktCtl(true);
                    currentSwallowSymbolAry[i].scale.set(1);
                },
                onComplete: () => {
                    this.specificSymbolsOnReel(this.swallowSymbolType, 'N0');
                }
            }, 'pick')
            .to(currentSwallowSymbolAry[i].scale, 0.7, {
                ease: Power2.easeOut,
                x: 1.1,
                y: 1.1
            }, 'pick')
            .to(currentSwallowSymbolAry[i], 0.9, {
                ease: Power4.easeIn,
                x: 195,
                y: 550
            }, 'swallow')
            .to(currentSwallowSymbolAry[i].scale, 1, {
                ease: Power1.easeOut,
                x: 0.2,
                y: 0.2,
                onComplete: () => {
                    currentSwallowSymbolAry[i].alpha = 0;
                    swallowSymbolTween.clear();
                    swallowSymbolTween = null;
                }
            }, 'swallow');
        }
    }

    moaiSpit() {
        const totalItems = this.spitSymbolObjAry.length;
        let currentItemCount = 0;
        this.spitSymbolObjAry.forEach((item) => {
            item.loadTexture('symbol', `img_symbol_${this.currentRspinSymbol}.png`);
            let spitSymbolTween = new TimelineMax();
            spitSymbolTween
            .to({}, 1.4, {
                onComplete: () => {
                    item.alpha = 1;
                    item.scale.set(0.2);
                }
            })
            .to(item, 0.7, {
                ease: Power4.easeOut,
                x: this.game.width / 2 + Math.floor(Math.random() * 450) - Math.floor(Math.random() * 450),
                y: this.game.height / 2 - Math.floor(Math.random() * 270)
            }, 'spit')
            .to(item.scale, 0.6, {
                ease: Power3.easeOut,
                x: 1.07,
                y: 1.07
            }, 'spit')
            .to(item.scale, 0.5, {
                ease: Power3.easeOut,
                x: 1,
                y: 1,
                onComplete: () => {
                    spitSymbolTween.clear();
                    spitSymbolTween = null;
                    currentItemCount++;
                    if (currentItemCount === totalItems) {
                        this.respinReady();
                    }
                }
            }, 'in')
            .to(item, 0.4, {
                ease: Power1.easeIn,
                y: 1000,
                alpha: 0,
                onStart: () => {
                    this.specificSymbolsOnReel(this.swallowSymbolType, this.currentRspinSymbol);
                },
                onComplete: () => {
                    this.swallowSymbolType = 0;
                    this.allSingleMasktCtl(false);
                }
            }, 'in');
        });
    }

    specificSymbolsOnReel(hideType, transTo) {
        const serieType = hideType === 1 ? 'M' : 'N';
        this.reelContext.forEach((reel) => {
            reel.updateSymbol = (data) => {
                const tempData = data;
                data.forEach((symbol, inx) => {
                    if (symbol[0] === serieType) {
                        tempData[inx] = transTo;
                    }
                });
                reel.symbolGroup.children.forEach((item, inx) => {
                    if (tempData.length > 0 && inx < tempData.length) {
                        // 使用ID 取得正確的 圖片Key的路徑
                        const SymbolID = reel.getSymbolName(tempData[inx]);
                        item.loadTexture(reel.symbolKey, SymbolID);
                    }
                });
            };
        });
    }

    respinReady() {
        this.spitSymbolObjAry.forEach((item) => {
            item.position.set(1400, this.game.height / 2);
        });

        const reelInx = this.islandRespinTimes + 2;
        const signNum = this.islandRespinTimes + 1;
        this.respinSignObj[reelInx].loadTexture(`respinSignDark_${signNum}`, `respinSign_dark_${signNum}_1.png`);
        this.respinSignObj[reelInx].animations.play('dark', 30);

        let delayTween = new TimelineLite();
        delayTween
        .to({}, 1, {
            onComplete: () => {
                for (let reelIndex = 0; reelIndex < this.reelContext.children.length; reelIndex++) {
                    this.reelContext.children[reelIndex].onGetRNGData = true;
                }
                delayTween.clear();
                delayTween = null;
            }
        });
    }
}

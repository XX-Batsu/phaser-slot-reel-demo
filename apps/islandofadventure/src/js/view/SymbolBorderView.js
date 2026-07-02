import { GameBase, ConfigTools, SlotGame } from 'slot-base';
import Config from 'js/main/Config';

// WinData
import WinBorderSignal from 'js/signal/windata/WinBorderSignal';
import WinBorderShowSignal from 'js/signal/windata/WinBorderShowSignal';
import ClearShowBorderSignal from 'js/signal/freegame/ClearShowBorderSignal';
/**
 * 中獎框
 */
export default class SymbolBorderView extends GameBase {
    /**
     * 中獎框
     * @param  {Phaser.Game}  game  game
     * @param  {number} size     用Graphics描繪中獎框的框線大小
     * @param  {number} color    用Graphics描繪中獎框的框線顏色
     * @param  {number} width   用Graphics描繪中獎框的框線的寬
     * @param  {number} height   用Graphics描繪中獎框的框線的高
     */
    constructor(game) {
        super(game);
        this.borderSpriteAry = [];
        // 線寬大小
        this.lineSize = 8;
        // 線框內縮距離
        this.innerDis = 3;
        // 輪閃計數
        this.inTurnCount = 0;
        // 框線的主體
        this.borderGraphic = new Phaser.Graphics(game, 0, 0);
        this.add(this.borderGraphic);
        // 瞄準樣式框線容器
        this.aimStyleBorderGroup = new Phaser.Group(this.game);
        this.add(this.aimStyleBorderGroup);
        // 是否閃爍
        this.isShine = false;
        // 跑過的 fps 計數
        this.fpsCount = 0;

        this.isAutoPlay = false;
        this.isFreePlay = false;

        // 分數容器
        this.textPrizeGroup = new Phaser.Group(this.game);
        this.add(this.textPrizeGroup);

        this.addEventListener(SlotGame.GameEvent.STATES, this.gameSlotStates, this);
        this.addEventListener(WinBorderSignal.ON_BORDER_WINLINE, this.playWinBorder, this);
        this.addEventListener(WinBorderShowSignal.ON_BORDER_SHOW_WINLINE, this.onPlayWinBorderShow, this);
        this.addEventListener(ClearShowBorderSignal.ON_CLEAR_SHOW_BORDER, this.onClearWinBorderShow, this);
    }

    /**
     * 顯示中獎框 秀全線框
     * @param {Object} data  WinBorderSignal 夾帶資料
     */
    playWinBorder(data) {
        this.data = data;
        this.lineLength = this.data.symbolIdAry.length;

        // 是否為 wild group 全動畫
        this.isWildGroup = (Config.IS_WILD_GROUP && this.data.isAllWild);

        // 秀全 wild 動畫不畫框
        if (this.isWildGroup) {
            return;
        }

        // 是否開啟閃爍外框功能
        if (Config.IS_SHOW_WIN_SHINE) {
            this.shinePlay();
        }

        // 連線只有一條時直接秀單線框與贏得分數(因為贏得分數顯示模式是看 設定)
        if (!this.isAutoPlay || this.isFreePlay) {
            // 秀單線框(可依照使用者設定是否顯示分數)
            this.inTurnShow();
            return;
        }

        // 秀全線
        this.showAllLine();
    }

    // 秀Win 特殊
    onPlayWinBorderShow(data) {
        this.data = data;
        // if (data.lineExtraDataAry.length === 0 || data.lineExtraDataAry[data.index][0] === 0) {
        this.clear();
        this.showSingleBorder(data.index, false, true);
        this.borderGraphic.visible = true;
        WinBorderShowSignal.callBack();
        // }
    }

    // 清除秀出的贏分框
    onClearWinBorderShow() {
        this.clear();
        ClearShowBorderSignal.callBack();
    }

    showAllLine() {
        // 判斷模式 是否全線時Scatter是否要秀框 0 : 不秀 , 1 : 秀 , 2 : 中S但只有單條就不秀框,多線有S就秀框(方便數量多時提示S中獎位置)
        let scatterShowAllBool = false;
        switch (Config.SCA_SHOWALL_BORDER_MODE) {
            case 0:
                scatterShowAllBool = false;
                break;
            case 1:
                scatterShowAllBool = true;
                break;
            case 2:
                scatterShowAllBool = (this.lineLength > 1);
                break;
            default:
        }
        // 秀全線框但不秀分數
        for (let i = 0; i < this.lineLength; i++) {
            this.showSingleBorder(i, scatterShowAllBool);
        }
    }

    // 開始輪閃
    onWinLineTimer() {
        if (this.isWildGroup) {
            return;
        }
        if (WinBorderSignal.isCallEvent) {
            this.inTurnShow();
        }
    }

    // 單線輪閃
    inTurnShow() {
        this.clear();
        this.showSingleBorder(this.inTurnCount, false, true);
        this.inTurnCount = (this.inTurnCount === this.lineLength - 1) ? 0 : this.inTurnCount + 1;
        this.borderGraphic.visible = true;
    }

    showSingleBorder(index, isScaAllWinOnShow = false, trunPlayBool = false) {
        const data = this.data;
        const winPositionAry = data.winPositionAry[index];  // 取出二維陣列贏得位置
        const singleSymbID = data.symbolIdAry[index];       // 取出該線贏得ID
        const lineNo = data.winLineNoAry[index];            // 取出該線贏得線號
        const symbolCount = data.symbolCountAry[index];
        const numOfKind = data.numOfKindAry[index];

        let isShowBorder = true;
        const isSpecial = ConfigTools.getSpecialSymbol(singleSymbID);
        if (trunPlayBool) {
            // 是否在秀全線時顯示特殊Symbol的框
            if (isSpecial && !isScaAllWinOnShow) {
                isShowBorder = false;
            }
        }

        if (!Config.IS_SCA_SHOW_BORDER && isSpecial) {
            isShowBorder = false;
        }

        // 特殊Symbol不秀框架
        if (Config.IS_SCA_SHOW_BORDER && isSpecial) {
            isShowBorder = true;
        }

        if (isShowBorder) {
            const isWay = (Config.LINE_WIN_LIST.lenght === 0) ? 1 : 0;
            if (lineNo >= Config.LINE_WIN_LIST.lenght && !isWay) {
                return; // 錯誤 可能是LineGame但沒有填寫線數 OR 後端傳的線數與目前設定Line Map不一致
            }

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

                    // 從Config.取的 Symbol位置的函數 可填入Left_Top 取得該Symbol   Left_Top的座標位置
                    const pos = ConfigTools.symbolLocal(rowInx + 1, reelInx, 'Left_Top', true);
                    // const pos = ConfigTools.symbolLocal(rowInx + 1, reelInx, types.align.CENTER, true);
                    winCount++;
                    if (winCount <= symbolCount) {
                        if (winReelCount <= numOfKind) {
                            this.createGraphicBorder(pos, lineNo);
                            // this.aimStyleBorderGroup.add(this.createAimStyleBorder(pos));
                        }
                    }
                }
            }
        }
    }

    // 創建瞄準樣式框線
    createAimStyleBorder(pos) {
        const frameCount = this.game.cache.getFrameCount('clip_border');
        const isPng = this.game.cache.getFrameByName('clip_border', 'clip_symbol_WIN_1.png');
        const frameAry = Phaser.Animation.generateFrameNames('clip_symbol_WIN_', 1, frameCount, (isPng) ? '.png' : '.jpg');

        const sprite = new Phaser.Sprite(this.game, 0, 0, 'clip_border');
        sprite.anchor.set(0.5);
        sprite.x = pos.x;
        sprite.y = pos.y;
        sprite.animations.add('clip_Win', frameAry);
        sprite.animations.play('clip_Win', 30, true);

        return sprite;
    }

    /**
     * 產生中獎線框
     * @param {Object} pos    x,y
     * @param {Number} lineNo  線上的第幾格
     */
    createGraphicBorder(pos, lineNo) {
        const lineColor = (Config.LINE_COLOR[lineNo]) ? Config.LINE_COLOR[lineNo] : Config.LINE_COLOR[0];
        this.borderGraphic.lineStyle(this.lineSize, lineColor, 1);
        this.borderGraphic.drawRect(
            pos.x + this.innerDis,
            pos.y + this.innerDis,
            Config.SYMBOL_WIDTH - (this.innerDis * 2),
            Config.SYMBOL_HEIGHT - (this.innerDis * 2)
        );
    }

    /**
     * 產生中獎黃框 img
     * @param {Object} pos  x,y
     */
    createBorderImg(pos) {
        const BSprite = new Phaser.Sprite(this.game, 0, 0, 'main', 'img_hit_frame.png');
        this.addAt(BSprite, 0);
        this.borderSpriteAry.push(BSprite);
        BSprite.x = pos.x;
        BSprite.y = pos.y;
    }

    // 清除
    clear() {
        this.borderSpriteAry.forEach((element) => {
            this.remove(element);
        });
        this.modeScoreBool = false;
        this.textPrizeGroup.removeAll(true);

        this.borderSpriteAry = [];
        this.borderGraphic.clear();
        this.aimStyleBorderGroup.removeAll(true);
    }

    // 是否閃爍
    shinePlay() {
        this.fpsCount = 0;
        this.isShine = true;
        this.borderVisible(true);
        this.borderGraphic.visible = true;
    }

    // 每秒 fps 閃爍
    update() {
        if (this.isShine) {
            this.fpsCount++;
        }

        if (this.fpsCount % 20 === 0 && this.isShine) {
            this.borderSpriteAry.forEach((element) => {
                element.visible = !element.visible;
            });

            this.borderGraphic.visible = !this.borderGraphic.visible;
        }
    }

    /**
     * 閃爍控制(供給此Class私人使用)
     * @param {Boolean}  bool    bool
     */
    borderVisible(bool) {
        this.borderSpriteAry.forEach((element) => {
            element.visible = bool;
        });
    }

    reset() {
        this.clear();
        this.data = {};
        this.inTurnCount = 0;
        this.lineLength = 0;
        this.isShine = false;
    }

    // 控制器發佈令命
    gameSlotStates(evt) {
        switch (evt.statesType) {
            // 啟動
            case SlotGame.GaStatesConfig.gameSpin:
                this.isFreePlay = evt.isFreePlay;
                this.isAutoPlay = evt.isAutoPlay;
                this.reset();
                break;
            // 發布中獎事件(免費遊戲剛切回BassGame的時候 只會發gameWin 跟 gameNoWin 此時isFreePlay剛換成false)
            case SlotGame.GaStatesConfig.gameWin:
                // 更變目前狀態
                this.isFreePlay = evt.isFreePlay;
                this.isAutoPlay = evt.isAutoPlay;
                break;
            // 取分
            case SlotGame.GaStatesConfig.gameTakeWin:
                if (WinBorderSignal.isCallEvent) {
                    WinBorderSignal.callBack();
                    this.reset();
                }
                break;
            default:
        }
    }
}

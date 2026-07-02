import { GameBase, ConfigTools, types, SlotGame } from 'slot-base';
import Config from 'js/main/Config';

// WinData
import WinLineSignal from 'js/signal/windata/WinLineSignal';
import WinLineShowSignal from 'js/signal/windata/WinLineShowSignal';
import ClearShowWinLineSignal from 'js/signal/freegame/ClearShowWinLineSignal';

export default class LineView extends GameBase {
    /**
    * ... 初始化線條區
    * @param  {Phaser.Game} game    in game
    * @param  {number} mylineSize   line size
    */
    constructor(game) {
        super(game);
        this.lineSizes = 8;
        this.lineDis = 5;
        this.lineBox = new Phaser.Graphics(game, 0, 0);
        this.add(this.lineBox);

        // 分數容器
        this.textPrizeGroup = new Phaser.Group(this.game);
        this.add(this.textPrizeGroup);

        // 是否閃爍
        this.isShine = false;
        // 跑過的 fps 計數
        this.fpsCount = 0;

        this.addEventListener(SlotGame.GameEvent.STATES, this.gameSlotStates, this);
        this.addEventListener(WinLineSignal.ON_LINEBAR_WINLINE, this.showLines, this);
        this.addEventListener(WinLineShowSignal.ON_LINEBAR_SHOW_WINLINE, this.showLinesExtra, this);
        this.addEventListener(ClearShowWinLineSignal.ON_CLEAR_SHOW_LINE, this.clearLinesExtra, this);

        this.data = {};
        this.inTurnCount = 0;
        this.lineLength = 0;

        this.isFreePlay = false;
        this.isAutoPlay = false;
    }

    /**
     * ... 顯示線條區 (因為個人不太喜歡創建物件出來  所以線條是用一個Graphics物件  去畫裡面的線條)
     * @param {Object} data   線數資料
     * EX : 1號線為  22222   ,  2號線為 11111 ,  3號線為33333 , 4號線為  12321
     */
    showLines(data) {
        this.data = data;
        this.lineLength = this.data.symbolIdAry.length;
        // 是否為 wild group 全動畫
        this.isWildGroup = (Config.IS_WILD_GROUP && this.data.isAllWild);

        // 秀全 wild 動畫不畫線
        if (this.isWildGroup) {
            return;
        }

        // 是否開啟閃爍功能
        if (Config.IS_SHOW_WIN_SHINE) {
            this.shinePlay();
        }

        // 連線只有一條時直接秀單線與贏得分數(因為贏得分數顯示模式是看設定)
        if (!this.isAutoPlay || this.isFreePlay) {
            // 秀單線(可依照使用者設定是否顯示分數)
            this.inTurnShow();
            return;
        }

        this.showAllLine();
    }

    // Show Extra Line
    showLinesExtra(data) {
        this.data = data;
        this.hideLines();
        this.showSingleLine(data.index, true);
        this.lineBox.visible = true;
        WinLineShowSignal.callBack();
    }

    // 清除Extra Line
    clearLinesExtra() {
        this.reset();
        ClearShowWinLineSignal.callBack();
    }

    showAllLine() {
        // 秀全線
        if (Config.SHOW_ALL_WIN_LINE) {
            // 秀全線但不秀分數
            for (let i = 0; i < this.data.symbolIdAry.length; i++) {
                this.showSingleLine(i);
            }
        }
    }

    // 開始輪閃
    onWinLineTimer() {
        if (WinLineSignal.isCallEvent) {
            this.inTurnShow();
        }
    }

    // 單線輪閃
    inTurnShow() {
        this.hideLines();
        this.showSingleLine(this.inTurnCount, true);
        this.inTurnCount = (this.inTurnCount === this.lineLength - 1) ? 0 : this.inTurnCount + 1;
        this.lineBox.visible = true;
    }

    showSingleLine(index) {
        const singleLineNo = this.data.winLineNoAry[index];
        const numOfKind = this.data.numOfKindAry[index];
        // const symbolCount = this.data.symbolCountAry[index];
        const symbolID = this.data.symbolIdAry[index];

        // 特殊Symbol是否秀線
        const isSpecial = ConfigTools.getSpecialSymbol(symbolID);
        if (isSpecial && !Config.IS_SCA_SHOW_LINE) {
            return;
        }

        // 如果是沒有線段長度代表為WayGame不需要秀線
        if (Config.LINE_WIN_LIST.length === 0) {
            return;
        }
        const lineAry = Config.LINE_WIN_LIST[singleLineNo].split('');
        for (let reelIndex = 0; reelIndex < Config.NUM_REELS; reelIndex++) {
            const lineColor = (Config.LINE_COLOR[singleLineNo]) ? Config.LINE_COLOR[singleLineNo] : Config.LINE_COLOR[0];
            this.lineBox.lineStyle(this.lineSizes, lineColor);

            const local = ConfigTools.symbolLocal(Number(lineAry[reelIndex]), reelIndex, types.align.CENTER, true);
            const row = lineAry[reelIndex];

            if (reelIndex === 0) {
                this.lineBox.moveTo(Config.REEL_OFFSET_X - Config.SPACE_BASE_SYMBOLS_X, local.y);
                this.lineBox.lineTo(Config.REEL_OFFSET_X, local.y);
                continue;
            }

            const diff = row - lineAry[reelIndex - 1];
            if (reelIndex < numOfKind) {
                // 畫出有框的連線
                this.drawCross(lineAry, numOfKind, reelIndex, diff);
                continue;
            }
        }
        // 畫出結尾
        this.drawTail(lineAry, numOfKind);
        this.lineBox.stroke = '#000000';
        this.lineBox.strokeThickness = 6;
        this.lineBox.fill = '#43d637';
    }

    /**
     * @param {Array} lineAry      線 ary
     * @param {Number} symbolCount 中幾格
     * @param {Number} reelIndex   第幾軸
     * @param {Number} diff        此格與上一格的差距
     */
    drawCross(lineAry, symbolCount, reelIndex, diff) {
        let pos;
        let endPos;
        // 畫線的位移係數
        const lineDis = this.lineDis;
        const row = lineAry[reelIndex];

        // down 往下
        if (diff > 0) {
            pos = ConfigTools.symbolLocal(Number(lineAry[reelIndex - 1]), reelIndex - 1, types.align.RIGHT_DOWN, true);
            endPos = ConfigTools.symbolLocal(Number(row), reelIndex, types.align.LEFT_TOP, true);
            this.lineBox.moveTo(pos.x - lineDis, pos.y - lineDis);
            this.lineBox.lineTo(endPos.x + lineDis, endPos.y + lineDis);
            return;
        }

        // up 往上
        if (diff < 0) {
            pos = ConfigTools.symbolLocal(Number(lineAry[reelIndex - 1]), reelIndex - 1, types.align.RIGHT_TOP, true);
            endPos = ConfigTools.symbolLocal(Number(row), reelIndex, types.align.LEFT_DOWN, true);
            this.lineBox.moveTo(pos.x - lineDis, pos.y + lineDis);
            this.lineBox.lineTo(endPos.x + lineDis, endPos.y - lineDis);
            return;
        }

        // mid 平行
        if (diff === 0) {
            pos = ConfigTools.symbolLocal(Number(row), reelIndex - 1, types.align.RIGHT_CENTER, true);
            endPos = ConfigTools.symbolLocal(Number(row), reelIndex, types.align.LEFT_CENTER, true);
            this.lineBox.moveTo(pos.x - lineDis, pos.y);
            this.lineBox.lineTo(endPos.x + lineDis, endPos.y);
        }
    }

    /**
     * @param {String} lineAry     線 ary
     * @param {Number} symbolCount 中幾個 symbol
     */
    drawTail(lineAry, symbolCount) {
        // 線全中的狀況 直接畫尾巴
        if (symbolCount === Config.NUM_REELS) {
            const endPos = ConfigTools.symbolLocal(Number(lineAry[symbolCount - 1]), Config.NUM_REELS - 1, types.align.RIGHT_CENTER, true);
            this.lineBox.moveTo(endPos.x, endPos.y);

            this.lineBox.lineTo(endPos.x + Config.SPACE_BASE_SYMBOLS_X, endPos.y);

            // 此線結束
            this.lineBox.endFill();
            return;
        }

        // 剩餘沒中的位置把線補畫完
        // 移動到中獎的最後一個位置
        const startRow = +lineAry[symbolCount - 1];
        const startReelIndex = symbolCount - 1;
        const nextRow = +lineAry[symbolCount];
        let posType = '';

        // up
        if (nextRow - startRow < 0) { posType = types.align.RIGHT_TOP; }
        // down
        if (nextRow - startRow > 0) { posType = types.align.RIGHT_DOWN; }
        // mid
        if (nextRow - startRow === 0) { posType = types.align.RIGHT_CENTER; }

        const startPos = ConfigTools.symbolLocal(Number(startRow), startReelIndex, posType, true);
        this.lineBox.moveTo(startPos.x, startPos.y);

        for (let i = 0; i < Config.NUM_REELS - symbolCount; i++) {
            const row = lineAry[symbolCount + i];
            const reelIndex = symbolCount + i;
            const local = ConfigTools.symbolLocal(Number(row), reelIndex, types.align.CENTER, true);
            this.lineBox.lineTo(local.x, local.y);

            if (reelIndex === Config.NUM_REELS - 1) {
                this.lineBox.lineTo(local.x + Config.SYMBOL_WIDTH / 2 + 10, local.y);
                // 此線結束
                this.lineBox.endFill();
            }
        }
    }

    hideLines() {
        this.modeScoreBool = false;
        this.textPrizeGroup.removeAll(true);
        this.lineBox.clear();
    }

    // 是否閃爍
    shinePlay() {
        this.fpsCount = 0;
        this.isShine = true;
        this.lineBox.visible = true;
    }

    // 每秒 fps 閃爍
    update() {
        if (this.isShine) {
            this.fpsCount++;
        }

        if (this.fpsCount % 20 === 0 && this.isShine) {
            this.lineBox.visible = !this.lineBox.visible;
        }
    }

    reset() {
        this.hideLines();
        this.data = {};
        this.inTurnCount = 0;
        this.lineLength = 0;
        this.isShine = false;
        this.textPrizeGroup.removeAll(true);
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
                if (WinLineSignal.isCallEvent) {
                    this.reset();
                    WinLineSignal.callBack();
                }
                break;
            default:
        }
    }
}

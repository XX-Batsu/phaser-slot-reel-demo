import { GameBase, ConfigTools, types, SlotGame, RunScore, LikeMoveIt } from 'slot-base';
import Config from 'js/main/Config';
import WinSymbolScoreSignal from 'js/signal/windata/WinSymbolScoreSignal';
import WinSymbolShowScoreSignal from 'js/signal/windata/WinSymbolShowScoreSignal';
import ClearShowWinScoreSignal from 'js/signal/freegame/ClearShowWinScoreSignal';

import FreeGameTriggerSignal from 'js/signal/freegame/FreeGameTriggerSignal';
import FreeCompleteSignal from 'js/signal/freegame/FreeCompleteSignal';

/**
 * 顯示圖標贏分分數
 */
export default class WinTextView extends GameBase {
    constructor(game) {
        super(game);
        // 變數
        this.lineLength = 0;
        this.inTurnCount = 0;
        this.isAutoPlay = false;
        this.isFreePlay = false;
        this.data = {};

        this.scoreOffsetY = 45;
        // 分數容器
        this.WinTextGroup = new Phaser.Group(this.game);
        // this.WinTextMask = this.game.make.sprite(0, 0, '');
        // this.WinTextMask.anchor.set(0.5);
        // this.WinTextMask.visible = false;
        this.WinText = new RunScore(this.game, 'num_winscore', -18);
        this.WinText.position.set(0, 0 - this.scoreOffsetY);
        // this.WinText.anchor.set(0.5);
        this.WinText.showNum(0);
        this.WinText.visible = false;
        // 看使用者是否需要顯示贏分分數的底圖
        // this.WinTextGroup.add(this.WinTextMask);
        this.WinTextGroup.add(this.WinText);
        this.add(this.WinTextGroup);
        this.nowTime = new Date().getTime();

        this.addEventListener(SlotGame.GameEvent.STATES, this.gameSlotStates, this);
        this.addEventListener(WinSymbolScoreSignal.ON_WIN_SYMBOL_SCORE_EFFECT, this.onWinScorePlay, this);
        this.addEventListener(WinSymbolShowScoreSignal.ON_WIN_SYMBOL_SHOWSCORE_EFFECT, this.onWinScorePlayShow, this);
        this.addEventListener(ClearShowWinScoreSignal.ON_CLEAR_SHOWWIN_SCORE, this.onClearWinScore, this);

        this.addEventListener(FreeGameTriggerSignal.ON_SHOW_FREE_TRIGGER, this.onFreeGameTrigger, this);
        this.addEventListener(FreeCompleteSignal.ON_FREE_COMPLETE, this.overFreeGameIdle, this);
    }

    onFreeGameTrigger() {
        FreeGameTriggerSignal.callBack();
    }

    overFreeGameIdle() {
    }

    // 偵聽秀分Signal
    onWinScorePlay(data) {
        this.data = data;
        // 連線只有一條時直接秀單線與贏得分數(因為贏得分數顯示模式是看設定)
        this.lineLength = data.winPositionAry.length;
        if (!this.isAutoPlay || this.isFreePlay) {
            // 秀單線(可依照使用者設定是否顯示分數)
            this.inTurnShow();
            return;
        }

        // 全線不秀分數 Auto
        for (let i = 0; i < data.winPositionAry.length; i++) {
            const symbolID = data.symbolIdAry[i];
            // Bonus 的文字有特殊位置
            if (Config.SYMBOL_BONUS.indexOf(symbolID) !== -1) {
                this.lineWinScore(i);
            }
        }
    }

    // 偵聽秀分Signal 特殊
    onWinScorePlayShow(data) {
        this.data = data;
        // if (data.lineExtraDataAry.length === 0 || data.lineExtraDataAry[data.index][0] === 0) {
        this.clearTextScore();
        this.lineWinScore(data.index);
        WinSymbolShowScoreSignal.callBack();
        // }
    }

    // 清除畫面秀分
    onClearWinScore() {
        this.clearTextScore();
        ClearShowWinScoreSignal.callBack();
    }

    // 自動呼叫輪閃
    onWinLineTimer() {
        if (WinSymbolScoreSignal.isCallEvent) {
            this.inTurnShow();
        }
    }

    // 輪閃時切換下一局
    inTurnShow() {
        this.clearTextScore();
        this.lineWinScore(this.inTurnCount);
        this.inTurnCount = (this.inTurnCount === this.lineLength - 1) ? 0 : this.inTurnCount + 1;
    }

    // 顯示該線分數
    lineWinScore(index) {
        const data = this.data;
        const prize = data.linePrizeAry[index];
        const line = data.showLineAry[index];
        const numOfKind = data.numOfKindAry[index];
        const lineAry = `${line}`.split('');
        const symbolID = data.symbolIdAry[index];
        const winPositionAry = data.winPositionAry[index];

        // 填入要顯示的分數位置
        let showTextIndex = this.showTextPos(lineAry, numOfKind);
        // 是否顯示中獎
        let modeScoreBool = true;
        // 當該線條沒有贏分不顯示贏分分數
        if (prize <= 0) {
            modeScoreBool = false;
        }

        // Bonus 的文字有特殊位置
        if (Config.SYMBOL_BONUS.indexOf(symbolID) !== -1) {
            // 分數秀在BonusGame在畫面上點擊的位置
            if (SlotGame.BonusConfig.SELECT_REEL !== -1) {
                // 設定 BonusGame自選位置
                showTextIndex = SlotGame.BonusConfig.SELECT_REEL;
            }
        }

        // WayGame秀分方式
        let scoreIndex = 0;
        let firstRow = -1;
        for (let i = 0; i < winPositionAry.length; i++) {
            for (let j = 0; j < winPositionAry[i].length; j++) {
                // 秀分在中間的 symbol
                if (winPositionAry[i][j] !== 0 && j === showTextIndex && modeScoreBool) {
                    scoreIndex = j;
                    // 紀錄第一個出現的 row 位置
                    if (firstRow === -1) {
                        firstRow = i;
                    }
                }
            }
        }

        // 顯示出分數
        if (modeScoreBool) {
            const position = ConfigTools.symbolLocal(firstRow + 1, scoreIndex, types.align.CENTER, true);
            this.createWinText(position.x, position.y, prize);
        }
    }

    getWinLineSymbol(data, inx) {
        const symbolCount = data.symbolCountAry[inx];
        const numOfKind = data.numOfKindAry[inx];
        const winPositionAry = data.winPositionAry[inx];
        const symbolResult = data.symbolResult;
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
                const id = symbolResult[rowInx][reelInx];
                if (winCount <= symbolCount && winReelCount <= numOfKind && Config.SYMBOL_WILD.indexOf(id) !== -1) {
                    return true;
                }
            }
        }
        return false;
    }

    // 紀錄文字秀分的位置 [可支援左右線,ways的格式]
    showTextPos(lineAry, winReelCount) {
        // 紀錄文字的位置L
        const showWinLeftAry = [];
        // 紀錄文字的位置R
        const showWinRightAry = [];
        // 取出中間值
        const anchorNum = Config.NUM_REELS / 2 | 0;
        // 設定結果位置
        let selectInx = 0;
        let count = 0;

        for (let i = 0; i < lineAry.length; i++) {
            const reelIndex = +lineAry[i];
            if (reelIndex !== 0 && count + 1 <= winReelCount) {
                count++;
                if (i !== anchorNum) {
                    (i < anchorNum)
                    ? showWinLeftAry.push(i)
                    : showWinRightAry.push(i);
                }

                if (i === anchorNum) {
                    selectInx = anchorNum;
                    return selectInx;
                }
                (showWinLeftAry.length > showWinRightAry.length)
                ? selectInx = showWinLeftAry[showWinLeftAry.length - 1]
                : selectInx = showWinRightAry[0];
            }
        }

        return selectInx;
    }

    // update() {
    //     if (!this.textTransRecord) { return; }
    //     const newTime = new Date().getTime();
    //
    //     if (newTime - this.nowTime >= 120) {
    //         const bg = this.WinTextMask;
    //         this.nowTime = newTime;
    //         bg.alpha -= 0.05;
    //
    //         if (bg.alpha < 0.8) {
    //             bg.alpha = 1;
    //         }
    //     }
    // }

    clearTextScore() {
        // this.WinTextMask.visible = false;
        this.WinText.visible = false;
    }

    reset() {
        this.inTurnCount = 0;
        this.clearTextScore();
    }

    /**
     * 產生贏分文字
     * @param  {Number}              x       贏分數字的 x 軸
     * @param  {Number}              y       贏分數字的 y 軸
     * @param  {Number}             money    Money
     */
    createWinText(x, y, money) {
        // this.WinTextMask.position = { x, y };
        // this.WinTextMask.visible = true;
        this.WinText.position = { x, y: y - this.scoreOffsetY };
        if (money > 999) {
            this.WinText.item.fontSize = this.WinText.fontSize - 5;
            this.WinText.position = { x, y: y - this.scoreOffsetY + 10 };
        } else {
            this.WinText.item.fontSize = this.WinText.fontSize;
            this.WinText.position = { x, y: y - this.scoreOffsetY };
        }
        // this.WinText.text = `${money}`;
        this.WinText.showNum(`${money}`);
        this.WinText.visible = true;
    }

    /**
     * 狀態機切換
     * @param  {Object} evt 狀態機夾帶資料
     */
    gameSlotStates(evt) {
        switch (evt.statesType) {
            case SlotGame.GaStatesConfig.gameSpin:
                this.isFreePlay = evt.isFreePlay;
                this.isAutoPlay = evt.isAutoPlay;
                this.textTransRecord = true;
                break;
            // 發布中獎事件(免費遊戲剛切回BassGame的時候 只會發gameWin 跟 gameNoWin 此時isFreePlay剛換成false)
            case SlotGame.GaStatesConfig.gameWin:
                // 更變目前狀態
                this.isFreePlay = evt.isFreePlay;
                this.isAutoPlay = evt.isAutoPlay;
                break;
            // 取分
            case SlotGame.GaStatesConfig.gameTakeWin:
                if (this.wildMultipleTime) {
                    this.wildMultipleTime.kill();
                    this.wildMultipleTime = null;
                    this.WinText.alpha = 1;
                }

                if (WinSymbolScoreSignal.isCallEvent) {
                    // 取消動畫
                    this.reset();
                    this.textTransRecord = false;
                    // 回調Signal狀態結束
                    WinSymbolScoreSignal.callBack();
                }
                break;
            default:
        }
    }
}

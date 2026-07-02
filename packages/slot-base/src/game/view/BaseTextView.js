// --- base ---
import GameBase from 'base/GameBase';
import Sound from 'base/Sound';
import ConfigPasser from 'base/ConfigPasser';
import RunScore from 'base/RunScore';

// --- game ---
// event
import GameEvent from 'game/events/GameEvent';
import UiActionEvent from 'game/events/UiActionEvent';
import UITextEvent from 'game/events/UITextEvent';
// main
import GaStatesConfig from 'game/main/GaStatesConfig';
import Currency from 'game/main/Currency';

// UI - Text
import FreeGameShowTextSignal from 'game/signal/ui/text/FreeGameShowTextSignal';
import BaseGameShowTextSignal from 'game/signal/ui/text/BaseGameShowTextSignal';
import WinScoreSignal from 'game/signal/ui/text/WinScoreSignal';
import FreeWinScoreSignal from 'game/signal/ui/text/FreeWinScoreSignal';
// import FreeWinShowScoreSignal from 'game/signal/ui/text/FreeWinShowScoreSignal';
import FreeScatterScoreSignal from 'game/signal/ui/text/FreeScatterScoreSignal';
// import LuckyDrawScoreSignal from 'game/signal/ui/text/LuckyDrawScoreSignal';
//
import FreeGameReTriggerCountSignal from 'game/signal/freegame/FreeGameReTriggerCountSignal';
// UI - Text - feature

export default class BaseTextView extends GameBase {
    constructor(game) {
        super(game);
        this.alpha = 0;
        this.textBg = new Phaser.Sprite(game, game.width / 2, game.height, '');
        this.add(this.textBg);
        // 可用分數
        this.creditText = new Phaser.Sprite(game, 470, 848, 'systemTexts', 'text_userCredit.png');
        this.creditText.anchor.set(0.5);
        this.add(this.creditText);
        this.creditLine = new Phaser.Sprite(game, this.creditText.x, 876, 'systemElements', 'UIline.png');
        this.creditLine.anchor.set(0.5);
        this.add(this.creditLine);
        this.credit = this.makeText(466, 902, 'num_base', '', 0);
        this.credit.isComma = true;
        this.credit.setfontAnchor(0.5, 0.5);
        this.add(this.credit);
        // this.credit.addInputEvent(() => { this.scoreClickEvent(); });
        // 總押注
        this.totalBetText = new Phaser.Sprite(game, 1230, 848, 'systemTexts', 'text_bet.png');
        this.totalBetText.anchor.set(0.5);
        this.add(this.totalBetText);
        this.totalBetLine = new Phaser.Sprite(game, this.totalBetText.x, 876, 'systemElements', 'UIline.png');
        this.totalBetLine.anchor.set(0.5);
        this.add(this.totalBetLine);
        this.totalBet = this.makeText(1234, 902, 'num_base', '', 0);
        this.totalBet.isDecimal = true;
        this.totalBet.setfontAnchor(0.5, 0.5);
        this.add(this.totalBet);
        // this.totalBet.addInputEvent(() => { this.scoreClickEvent(); });
        // 贏得分數
        this.winScoreText = new Phaser.Sprite(this.game, 855, 848, 'systemTexts', 'text_win.png');
        this.winScoreText.anchor.set(0.5);
        this.add(this.winScoreText);
        this.winTextLine = new Phaser.Sprite(game, this.winScoreText.x, 876, 'systemElements', 'UIline.png');
        this.winTextLine.anchor.set(0.5);
        this.add(this.winTextLine);
        this.winScore = this.makeText(854, 904, 'num_base', '0', 5);
        // this.winScore.addInputEvent(() => { this.scoreClickEvent(); });
        this.winScore.setfontAnchor(0.5, 0.5);
        this.add(this.winScore);

        this.betLevelText = new Phaser.Sprite(game, 1746, 538, 'systemTexts', 'text_bet.png');
        this.add(this.betLevelText);
        const betLevelTextStyle = { font: '23pt Arial', fill: '#FFFFFF', align: 'center' };
        this.bet = new Phaser.Text(this.game, 1746, 600, '', betLevelTextStyle);
        this.bet.anchor.set(0, 0.5);
        this.add(this.bet);

        // 目前顯示資料
        this.textData = {
            userPointDenom: 0,
            userPoint: 0,
            totalDenom: 0,
            totalBet: 0
        };

        // 目前使用DenomDefine
        // this.DenomDefine = 0;

        // 幣值顯示切換
        this.currencyBool = false;

        // 觸發切換
        // this.onChangeCoinType();

        // 免費次數
        this.freeRemainText = new Phaser.Sprite(game, 0, 0, '', '');
        this.freeRemainText.visible = false;
        this.freeEndText = new Phaser.Sprite(game, 0, 0, '', '');
        this.freeEndText.visible = false;
        this.freeCount = this.makeText(800, 1030, 'num_base', '', 0);
        this.freeCount.item.tint = 0xFFFFFF;
        this.freeCount.visible = false;

        this.add(this.freeRemainText);
        this.add(this.freeEndText);
        this.add(this.freeCount);

        // 遊戲版號
        const versionEle = document.querySelector('ver');
        const verBase = versionEle.getAttribute('tag-base');
        const verExternal = versionEle.getAttribute('tag-external');
        const verGame = versionEle.getAttribute('tag-game');
        const allVersion = verGame + verBase + verExternal;
        let textVersion = '';
        for (let i = 0; i < allVersion.length; i++) {
            if (allVersion[i] === 'v') {
                textVersion += '_';
                continue;
            }
            textVersion += allVersion[i];
        }
        const systemTextStyle = { font: '26pt Arial', fill: '#FFFFFF', align: 'center' };
        this.gameVer = new Phaser.Text(game, 0, 0, textVersion, systemTextStyle);
        this.gameVer.anchor.set(0, 0);
        this.add(this.gameVer);
        this.game.world.bringToTop(this.gameVer);

        // 遊戲場次
        this.serialNumber = new Phaser.Text(game, game.width, 0, '', systemTextStyle);
        this.serialNumber.anchor.set(1, 0);
        this.add(this.serialNumber);
        this.game.world.bringToTop(this.serialNumber);

        // Max Spin / Max Round 文字
        // this.maxText = new Phaser.Sprite(this.game, 0, 0, 'mLang', 'm_tex_info_max_spin.png');
        // this.isMaxRoundMode = (ConfigPasser.instance.FREEGAME_TYPE === 1);
        // this.maxText.frameName = (this.isMaxRoundMode)
        //     ? 'm_tex_info_max_round.png'
        //     : 'm_tex_info_max_spin.png';
        // this.add(this.maxText);
        // this.maxText.visible = false;

        // 開發工具 - 拖曳回報定位功能
        if (process.env.NODE_ENV === 'develop' || process.env.NODE_ENV === 'devtest') {
            const LikeMoveIt = require('tools/LikeMoveIt');
            LikeMoveIt.register([
                this.credit,
                this.totalBet,
                this.winScore,
                this.creditText,
                this.totalBetText,
                this.betLevelText,
                this.winScoreText,
                this.freeCount
            ]);
        }

        this.addEventListener(GameEvent.STATES, this.gameSlotStates, this);
        this.addEventListener(UITextEvent.ON_TEXT_UPDATE, this.onTextUpdate, this);
        this.addEventListener(UITextEvent.ON_TEXT_FREECOUNT, this.onTextFreeUpdate, this);
        // this.addEventListener(UITextEvent.ON_TEXT_CURRENCY, this.onChangeCoinType, this);
        this.addEventListener(FreeGameReTriggerCountSignal.ON_RETRIGGER_COUNT_TEXT_SIGNAL, this.onRetriggerCountUpdate, this);
        this.addEventListener(UiActionEvent.ON_FREE_EARLY_END, this.onFreeEarlyEnd, this);
        this.addEventListener(UITextEvent.ON_TEXT_CREDIT, this.onTextCredit, this);
        this.addEventListener(WinScoreSignal.ON_WIN_SCORE, this.setwinRunScore, this);
        this.addEventListener(FreeGameShowTextSignal.ON_SHOW_FREECOUNT_TEXT, this.onFreeGame, this);
        this.addEventListener(BaseGameShowTextSignal.ON_HIDE_FREECOUNT_TEXT, this.onBaseGame, this);
        this.addEventListener(FreeWinScoreSignal.ON_FREE_WIN_SCORE, this.setFreewinRunScore, this);
        // this.addEventListener(FreeWinShowScoreSignal.ON_FREE_WIN_SCORESHOW, this.freeWinShowRunScore, this);
        this.addEventListener(FreeScatterScoreSignal.ON_SCATTER_SCORE_TRIGGER, this.freeTriggerScore, this);
        // this.addEventListener(LuckyDrawScoreSignal.ON_LUCKY_DRAW_SCORE, this.freeLuckyDrawScore, this);
    }

    // 提早結束 Free Game
    onFreeEarlyEnd() {
        // 有提早結束 才做文字的顯示切換
        this.freeRemainText.visible = false;
        this.freeCount.visible = false;
        // this.maxText.visible = false;
        this.freeEndText.visible = true;
    }

    // 分數文字按下的事件
    // scoreClickEvent() {
    //     // 發送切換幣別或是分數顯示
    //     this.onDispatchEvent(new UITextEvent(UITextEvent.ON_TEXT_CURRENCY));
    // }

    /**
     * free game retrigger 增加次數動畫
     * @param {Object} data FreeGameReTriggerCountSignal 夾帶的資料
     */
    onRetriggerCountUpdate(data) {
        // 顯示 max spin 文字或 max Round 文字
        // if (ConfigPasser.instance.FREEGAME_TYPE >= 0 &&
        //     ((this.isMaxRoundMode && data.isMaxRound) || (!this.isMaxRoundMode && data.isMaxSpin))) {
        //     this.maxText.visible = true;
        // }

        // max spin 則不播放動畫
        if (data.count === 0 || data.freeCount === 0) {
            FreeGameReTriggerCountSignal.callBack();
            return;
        }

        const freeScale = {
            data: 1
        };

        const freeTextTween = this.game.add.tween(freeScale);

        this.freeCount.showNum(data.freeCount);

        freeTextTween.to({
            data: [ 1.5, 1.25, 1 ]
        }, 1500, Phaser.Easing.Back.In, true);

        freeTextTween.onUpdateCallback(() => {
            this.freeCount.scale.set(freeScale.data);
        });

        // 播放增加次數音效
        freeTextTween.onComplete.addOnce(() => {
            Sound.playFeature('freeRetrigger');
            FreeGameReTriggerCountSignal.callBack();
        });
    }

    /**
     * 進入 free game 的呈現動畫
     * @param {Object} data FreeGameShowTextSignal 夾帶的資料
     */
    onFreeGame(data) {
        // 顯示 max spin 文字或 max Round 文字
        // if (ConfigPasser.instance.FREEGAME_TYPE >= 0 &&
        //     ((this.isMaxRoundMode && data.isMaxRound) || (!this.isMaxRoundMode && data.isMaxSpin))) {
        //     this.maxText.visible = true;
        // }
        this.freeCount.visible = true;
        this.freeRemainText.visible = true;
        this.freeCount.showNum(data.freeCount);

        this.game.time.events.add(Phaser.Timer.SECOND * 2, () => {
            FreeGameShowTextSignal.callBack();
        });
    }

    // 回到 base game
    onBaseGame() {
        this.freeCount.visible = false;
        this.freeRemainText.visible = false;
        // this.maxText.visible = false;
        this.freeEndText.visible = false;
        BaseGameShowTextSignal.callBack();
    }

    /**
     * 更新文字
     * @param  {Object} data UITextEvent 夾帶資料
     */
    onTextUpdate(data) {
        this.textData = data;
        this.winScore.setDenomDef = data.DenomDefine;
        this.setBet = data.betNum;
        this.serialNumber.text = data.gamePlaySerialNumber;
        this.onCurrencyType();
    }

    /**
     * 更新 free game 次數文字
     * @param  {Object} data free game 次數資料
     */
    onTextFreeUpdate(data) {
        this.freeCount.showNum(data.freeCount);
    }

    /**
     * 更新可用分數
     * @param  {Object} data UITextEvent 夾帶資料
     */
    onTextCredit(data) {
        this.textData.userPointDenom = data.userPointDenom;
        this.textData.userPoint = data.userPoint;
        this.onCurrencyType();
    }

    // 創造文字
    makeText(x, y, font, sNum = '', sizeAdjust) {
        const text = new RunScore(this.game, font, sizeAdjust);
        text.setfontAnchor(0.5);
        text.showNum(sNum);
        text.position.set(x, y);
        return text;
    }

    set setBet(num) {
        this.bet.text = `X${num}`;
    }

    set setTotalBet(num) {
        this.totalBet.showNum(num);
    }

    set setCredit(num) {
        this.credit.showNum(num, true);
    }

    // 一般贏分
    setwinRunScore(num) {
        if (ConfigPasser.instance.IS_RESPIN && this.isRespinPlay) {
            this.callWinRunScore(num.respinScoreStart, num.respinScoreEnd, num.sec);
            return;
        }
        this.callWinRunScore(0, num.score, num.sec);
    }

    // 累積Free贏分
    setFreewinRunScore(num) {
        this.callWinRunScore(num.freeScoreStart, num.freeScoreEnd, ConfigPasser.instance.ALL_LINE_SEC);
    }

    // 累積Free贏分特殊
    // freeWinShowRunScore(num) {
    //     this.callWinRunScore(num.freeScoreStart, num.freeScoreEnd, ConfigPasser.instance.ALL_LINE_SEC);
    //     FreeWinShowScoreSignal.callBack();
    // }

    // 累積Free贏分(中Scatter時)
    freeTriggerScore(num) {
        let bool = false;
        switch (ConfigPasser.instance.HIT_SCATTER_SHOW_SCORE) {
            case 1:
            case 2:
                bool = true;
                break;
            default:

        }

        if (bool) {
            this.callWinRunScore(num.freeScoreStart, num.freeScoreEnd, ConfigPasser.instance.ALL_LINE_SEC);
        }
        FreeScatterScoreSignal.callBack();
    }

    // 累積Free贏分(中Scatter時) 遊戲特色
    // freeLuckyDrawScore(num) {
    //     let bool = false;
    //     switch (ConfigPasser.instance.HIT_SCATTER_SHOW_SCORE) {
    //         case 1:
    //         case 2:
    //             bool = true;
    //             break;
    //         default:
    //
    //     }
    //
    //     if (bool) {
    //         this.callWinRunScore(num.freeScoreStart, num.freeScoreEnd, ConfigPasser.instance.ALL_LINE_SEC);
    //     }
    //     LuckyDrawScoreSignal.callBack();
    // }

    // 贏分跑分
    callWinRunScore(ScoreStart, ScoreEnd, Runtime) {
        // TextView跑分設定 0 : 無條件跑分 , 1 : 不跑分直接顯示 , 2 : 只有中BigWin時不顯示跑分, 3 : 只有中BigWin才跑分
        switch (ConfigPasser.instance.TEXT_WIN_RUNSCORE_MODE) {
            case 1:
                this.winScore.showNum(ScoreEnd, true);
                return;
            case 2:
                if (ScoreEnd - ScoreStart >= this.textData.totalBet * ConfigPasser.instance.STEP_RATIO[0]) {
                    this.winScore.showNum(ScoreEnd, true);
                    return;
                }
                break;
            case 3:
                if (ScoreEnd - ScoreStart < this.textData.totalBet * ConfigPasser.instance.STEP_RATIO[0]) {
                    this.winScore.showNum(ScoreEnd, true);
                    return;
                }
                break;
            default:
        }

        // 跑分是否設定階段
        if (ConfigPasser.instance.TEXT_WIN_RUNSCORE_STEP) {
            this.winScore.setStepData(this.stepData(this.textData.totalBet), true);
        }

        // 播放 coin 音效
        if (ScoreEnd - ScoreStart > 0) {
            Sound.playFeature('coin');
        }
        this.winScore.runScoreTime(ScoreStart, ScoreEnd, Runtime, this, this.stopCoinSound);
    }

    stopCoinSound() {
        Sound.stopFeature('coin');
    }

    // stepData(TotalBet) {
    //     // 大獎分數階段判斷
    //     const stepRatio = [];
    //     for (let i = 0; i < ConfigPasser.instance.STEP_RATIO.length; i++) {
    //         stepRatio.push(TotalBet * ConfigPasser.instance.STEP_RATIO[i]);
    //     }
    //     return stepRatio;
    // }

    // 切換幣值
    // onChangeCoinType() {
    //     // 開發工具 拖曳回報定位功能 - 阻擋按鈕點擊事件
    //     if ((process.env.NODE_ENV === 'develop' || process.env.NODE_ENV === 'devtest') && window.isMoveItOn) {
    //         return;
    //     }
    //
    //     this.currencyBool = !this.currencyBool;
    //     // // 是否開啟小數點
    //     this.credit.isDecimal = this.currencyBool;
    //     this.winScore.isDecimal = this.currencyBool;
    //     // 設定是否固定小數點
    //     this.credit.isDecimalFixed = this.currencyBool;
    //     this.winScore.isDecimalFixed = this.currencyBool;
    //     // 設定分數是否千分位
    //     this.winScore.isComma = this.currencyBool;
    //     this.onCurrencyType();
    // }

    // 設定幣值Type
    onCurrencyType() {
        const Sign = (this.currencyBool) ? Currency.currencySign(ConfigPasser.instance.CURRENCY) : Currency.currencySign();
        this.setCredit = (this.currencyBool) ? this.textData.userPointDenom : this.textData.userPoint;
        this.setTotalBet = (this.currencyBool) ? this.textData.totalDenom : this.textData.totalBet;
        // 設定金額符號
        this.credit.setCurrencySign = `${Sign.point}`;
        this.totalBet.setCurrencySign = Sign.point;
        this.winScore.setCurrencyDenomSign = Sign.point;
    }

    // 控制器發佈令命
    gameSlotStates(evt) {
        switch (evt.statesType) {
            // 啟動
            case GaStatesConfig.gameSpin: {
                // 如果之前有上一局殘留分數延時顯示時,把它關掉 因為已經進入到下一局了
                if (this.timer !== undefined && this.timer !== null) {
                    clearTimeout(this.timer);
                    this.timer = null;
                    // console.log('上局殘留一般贏點的顯示時間 進行快速取分');
                }

                if (!evt.isFreePlay && !evt.isRespinPlay) {
                    this.winScore.clearNumber();
                    this.winScore.showNum(0);
                }
                break;
            }
            // 秀線
            case GaStatesConfig.gameWin: {
                this.isFreePlay = evt.isFreePlay;
                this.isRespinPlay = evt.isRespinPlay;
                break;
            }
            // 沒贏
            case GaStatesConfig.gameNoWin:
                this.isFreePlay = evt.isFreePlay;
                this.isRespinPlay = evt.isRespinPlay;
                if (!evt.isFreePlay && !evt.isRespinPlay) {
                    this.winScore.showNum(0);
                }
                break;
            // 取分
            case GaStatesConfig.gameTakeWin: {
                // 停止 coin 音效
                Sound.stopFeature('coin');
                if (WinScoreSignal.isCallEvent) {
                    WinScoreSignal.callBack();
                    this.winScore.immediatelyRunEnd();

                    if (!evt.isRespinPlay) {
                        this.timer = setTimeout(() => {
                            this.winScore.clearNumber();
                            this.winScore.showNum(0);
                            clearTimeout(this.timer);
                            this.timer = null;
                        }, 1000);
                    }
                }

                if (FreeWinScoreSignal.isCallEvent) {
                    FreeWinScoreSignal.callBack();
                    this.winScore.immediatelyRunEnd();
                }
                break;
            }
            default:
        }
    }
}

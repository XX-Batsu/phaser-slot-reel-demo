import { SlotGame } from 'slot-base';
import Config from 'js/main/Config';

/**
 * 按鈕層
 * 按鈕參數則是由config 來設置
 * @class BtnView
 */
export default class BtnView extends SlotGame.CommonView.BaseBtnView {
    constructor(game) {
        super(game);
        this.visible = true;
        this.alpha = 1;
    }

    makeAutoBtns() {
        const angle = 41;
        this.autoNum_infinity = this.makeAutoBtn(1579, 846, 0.79, angle, -1, { x: -100, y: -210 });
        this.autoNum_100 = this.makeAutoBtn(1579, 846, 0.79, 0, 100, { x: -90, y: -200 });
        this.autoNum_50 = this.makeAutoBtn(1579, 846, 0.79, -angle, 50, { x: -90, y: -200 });
        this.autoNum_10 = this.makeAutoBtn(1579, 846, 0.79, -2 * angle, 10, { x: -75, y: -210 });
    }

    makeBetBtns() {
        const numPosFix = [
            { x: 55, y: -200 },
            { x: 55, y: -200 },
            { x: 50, y: -200 },
            { x: 50, y: -200 }
        ];

        numPosFix.forEach((posData, inx) => {
            this[`betNum_${inx}`] = this.makeBetBtn(101, 846, 0.95, (inx - 1) * 31, Config.BET_SETTING_LIST[inx], numPosFix[inx]);
        }, this);

        this.makeMoreBetBtn(101, 846, 0.95, 93, { x: 50, y: -200 });
    }

    makeOptionBtns() {
        // this.btnExchange = this.makeMenuOptionBtn(101, 846, 0.95, -31, this.menuOptionEnum.exchange, { x: 50, y: -200 });
        // this.btnCashout = this.makeMenuOptionBtn(101, 846, 0.95, -31, this.menuOptionEnum.cashout, { x: 50, y: -200 });
        this.btnSetting = this.makeMenuOptionBtn(101, 846, 0.95, -15, this.menuOptionEnum.setting, { x: 50, y: -200 });
        this.btnHelp = this.makeMenuOptionBtn(101, 846, 0.95, 16, this.menuOptionEnum.help, { x: 50, y: -200 });
        this.btnRecords = this.makeMenuOptionBtn(101, 846, 0.95, 47, this.menuOptionEnum.records, { x: 50, y: -200 });
        this.btnExit = this.makeMenuOptionBtn(101, 846, 0.95, 78, this.menuOptionEnum.exit, { x: 50, y: -200 });
    }

    gameSlotStates(evt) {
        this.isAutoPlay = evt.isAutoPlay;
        if (!evt.isAutoPlay) {
            this.setEnabled([ 'Btn_AutoStop' ], false);
            this.setBtnVisible([ 'Btn_AutoStop' ], false);
        }
        switch (evt.statesType) {
            case SlotGame.GaStatesConfig.gameinit: {
                this.makeBtns();
                this.cycleShowHintDuration(5, 2);
                break;
            }
            case SlotGame.GaStatesConfig.gameIdle: {
                this.setBtnVisible([ 'Btn_Spin' ], true);
                this.setEnabled([ 'Btn_Spin', 'Btn_Menu' ], true);
                this.cycleShowHintDuration(10, 2);
                break;
            }
            case SlotGame.GaStatesConfig.gameBeforeSpin: {
                break;
            }
            case SlotGame.GaStatesConfig.gameLockBtn: {
                this.setEnabled([ 'Btn_Menu', 'Btn_Stop', 'Btn_Spin' ], false);
                this.menuClose();
                this.cycleStopShowHint();
                break;
            }
            case SlotGame.GaStatesConfig.gameSpin: {
                clearTimeout(this.fadeNumTO);
                this.fadeNumTO = null;
                clearTimeout(this.fadeBetTO);
                this.fadeBetTO = null;
                this.hasPlayPressed = false;
                this.hasPlayPressedLong = false;
                this.hasMenuPressed = false;
                this.hasMenuPressedLong = false;

                // 冒險島
                if (evt.isRespinPlay) {
                    this.setEnabled([ 'Btn_Stop' ], false);
                    this.setBtnVisible([ 'Btn_Spin' ], false);
                    this.setBtnVisible([ 'Btn_Stop' ], true);
                    return;
                }

                if (this.isAutoPlay && !evt.isFreePlay) {
                    if (SlotGame.GameInfo.autoPlayTimes > -1) {
                        SlotGame.GameInfo.autoPlayTimes--;
                        this.autoStopBtn.setButtonBitmapText(0, SlotGame.GameInfo.autoPlayTimes);
                    }
                    return;
                }
                this.setEnabled([ 'Btn_Stop' ], true);
                this.setBtnVisible([ 'Btn_Spin' ], false);
                this.setBtnVisible([ 'Btn_Stop' ], true);
                break;
            }
            case SlotGame.GaStatesConfig.gameStop: {
                this.setEnabled([ 'Btn_Stop' ], false);
                break;
            }
            case SlotGame.GaStatesConfig.gameWin: {
                if (this.isAutoPlay) {
                    if (SlotGame.GameInfo.autoPlayTimes === 0) {
                        this.onDispatchEvent(new SlotGame.BtnEvent('Btn_AutoStop'));
                    }
                    return;
                }
                this.setEnabled([ 'Btn_Stop' ], false);
                this.setBtnVisible([ 'Btn_Stop' ], false);
                this.setEnabled([ 'Btn_TakeWin' ], true);
                this.setBtnVisible([ 'Btn_TakeWin' ], true);
                break;
            }
            case SlotGame.GaStatesConfig.gameNoWin: {
                if (this.isAutoPlay) {
                    if (SlotGame.GameInfo.autoPlayTimes === 0) {
                        this.onDispatchEvent(new SlotGame.BtnEvent('Btn_AutoStop'));
                    }
                    return;
                }
                if (evt.isFreePlay) {
                    break;
                }
                this.setEnabled([ 'Btn_Stop' ], true);
                this.setBtnVisible([ 'Btn_Stop' ], false);
                break;
            }
            case SlotGame.GaStatesConfig.gameBigWinLockBtn: {
                break;
            }
            case SlotGame.GaStatesConfig.gameTakeWin: {
                this.setEnabled([ 'Btn_TakeWin' ], false);
                this.setBtnVisible([ 'Btn_TakeWin' ], false);
                if (evt.isFreePlay) {
                    this.setEnabled([ 'Btn_Stop' ], false);
                    this.setBtnVisible([ 'Btn_Stop' ], true);
                }

                break;
            }
            case SlotGame.GaStatesConfig.gameAuto: {
                this.autoListClose();
                this.betListClose();
                this.setEnabled([ 'Btn_Spin' ], false);
                this.setBtnVisible([ 'Btn_Spin' ], false);
                this.setEnabled([ 'Btn_AutoStop' ], true);
                this.setBtnVisible([ 'Btn_AutoStop' ], true);

                let num = SlotGame.GameInfo.autoPlayTimes;
                if (SlotGame.GameInfo.autoPlayTimes < 0) {
                    num = '~';
                }
                this.autoStopBtn.downSubTexture();
                this.autoStopBtn.bitmapTextAry[0].tint = 0xFFFFFF;
                this.autoStopBtn.setButtonBitmapText(0, num);
                break;
            }
            case SlotGame.GaStatesConfig.gameAutoStop: {
                SlotGame.GameInfo.autoPlayTimes = 0;
                this.autoStopBtn.upSubTexture();
                this.autoStopBtn.bitmapTextAry[0].tint = 0x666666;
                this.setEnabled([ 'Btn_AutoStop' ], false);
                this.setBtnVisible([ 'Btn_AutoStop' ], true);
                break;
            }
            case SlotGame.GaStatesConfig.soundOff: {
                break;
            }
            case SlotGame.GaStatesConfig.soundOn: {
                break;
            }
            case SlotGame.GaStatesConfig.gameHistory: {
                break;
            }
            case SlotGame.GaStatesConfig.gameSetting: {
                break;
            }
            case SlotGame.GaStatesConfig.gameSettingReturn: {
                break;
            }
            case SlotGame.GaStatesConfig.gameHelp: {
                break;
            }
            default:
        }
    }
}

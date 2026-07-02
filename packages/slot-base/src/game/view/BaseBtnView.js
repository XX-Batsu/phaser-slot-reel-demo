import GameBase from 'base/GameBase';
import UIButton from 'base/UIButton';
import Overlay from 'base/Overlay';
import GameInfo from 'game/model/GameInfo';
import LikeMoveIt from 'tools/LikeMoveIt';
import BtnControl from 'game/control/BtnControl';
import BtnEvent from 'game/events/BtnEvent';
import MessageEvent from 'game/events/MessageEvent';
import GameEvent from 'game/events/GameEvent';
import UiActionEvent from 'game/events/UiActionEvent';
import UITextEvent from 'game/events/UITextEvent';
import GaStatesConfig from 'game/main/GaStatesConfig';
import ConfigPasser from 'base/ConfigPasser';

import FreeGameHideBtnSignal from 'game/signal/ui/btn/FreeGameHideBtnSignal';
import BaseGameShowBtnSignal from 'game/signal/ui/btn/BaseGameShowBtnSignal';

export default class BaseBtnView extends GameBase {
    constructor(game) {
        super(game);
        this.game = game;
        this.alpha = 0;
        this.visible = false;
        this.btnAry = [];
        this.menuOptionEnum = Object.freeze({
            exchange: { name: 'Btn_Exchange', key: 'uiButtonMenuExchange', frame: [ 'btn_system_exchange_up.png', 'btn_system_exchange_down.png' ] },
            cashout: { name: 'Btn_Cashout', key: 'uiButtonMenuExchange', frame: [ 'btn_system_exchange_up.png', 'btn_system_exchange_down.png' ] },
            help: { name: 'Btn_Help', key: 'uiButtonMenuHelp', frame: [ 'btn_system_help_up.png', 'btn_system_help_down.png' ] },
            exit: { name: 'Btn_Exit', key: 'uiButtonMenuExit', frame: [ 'btn_system_quit_up.png', 'btn_system_quit_down.png' ] },
            records: { name: 'Btn_Records', key: 'uiButtonMenuRecords', frame: [ 'btn_system_records_up.png', 'btn_system_records_down.png' ] },
            setting: { name: 'Btn_Setting', key: 'uiButtonMenuSetting', frame: [ 'btn_system_setting_up.png', 'btn_system_setting_down.png' ] }
        });
        this.btnStateMap = [];

        this.betBtnsArray = [];
        this.autoBtnsArray = [];

        this.addEventListener(UiActionEvent.ON_SHOW_MENU, this.onMenuBtn, this);
        this.addEventListener(UiActionEvent.ON_SHOW_EXCHANGE, this.onLockAllUI, this);
        this.addEventListener(UiActionEvent.ON_CLOSE_EXCHANGE, this.onUnlockAllUI, this);
        this.addEventListener(UiActionEvent.ON_SHOW_CASHOUT, this.onLockAllUI, this);
        this.addEventListener(UiActionEvent.ON_CLOSE_CASHOUT, this.onUnlockAllUI, this);
        this.addEventListener(UiActionEvent.ON_SHOW_SETTING, this.onLockAllUI, this);
        this.addEventListener(UiActionEvent.ON_CLOSE_SETTING, this.onUnlockAllUI, this);
        this.addEventListener(UiActionEvent.ON_SHOW_HELP, this.onLockAllUI, this);
        this.addEventListener(UiActionEvent.ON_CLOSE_HELP, this.onUnlockAllUI, this);

        this.addEventListener(MessageEvent.ON_SHOW_MESSAGE_EXIT, this.onLockAllUI, this);
        this.addEventListener(MessageEvent.ON_SHOW_MESSAGE_TIP, this.onLockAllUI, this);
        this.addEventListener(MessageEvent.ON_CLOSE_MESSAGE_TIP, this.onUnlockAllUI, this);

        this.addEventListener(UITextEvent.ON_BET_UPDATE_LIST, this.onBetListUpdate, this);

        this.addEventListener(FreeGameHideBtnSignal.ON_FREE_HIDE_MENUBTN, this.onHideFreeModeBtn, this);
        this.addEventListener(BaseGameShowBtnSignal.ON_BASE_SHOW_MENUBTN, this.onHideBaseModeBtn, this);

        this.addEventListener(GameEvent.STATES, this.gameSlotStates, this);

        this.autoHandGroup = new Phaser.Group(game);
        this.autoHandGroup.visible = false;
        this.autoHandGroup.position.set(1580, 860);
        this.add(this.autoHandGroup);

        this.handAuto = new Phaser.Sprite(game, 0, 0, 'systemElements', 'hand.png');
        this.handAuto.anchor.set(0.5);
        this.autoHandGroup.add(this.handAuto);
        this.handTextAuto = new Phaser.Sprite(game, 26, 38, 'systemElements', 'hand_auto.png');
        this.handTextAuto.anchor.set(0.5);
        this.autoHandGroup.add(this.handTextAuto);
        this.handWaveAuto = new Phaser.Sprite(game, -8, -67, 'systemElements', 'hand01.png');
        this.handWaveAuto.anchor.set(0.5, 0.8);
        this.autoHandGroup.add(this.handWaveAuto);
        this.handClockAuto = new Phaser.Sprite(game, 49, -42, 'systemElements', 'hand_time.png');
        this.handClockAuto.anchor.set(0.5);
        this.autoHandGroup.add(this.handClockAuto);
        this.handHourAuto = new Phaser.Sprite(game, 51, -40, 'systemElements', 'hand_time01.png');
        this.handHourAuto.scale.set(1, 0.8);
        this.handHourAuto.anchor.set(0.5, 0.7);
        this.autoHandGroup.add(this.handHourAuto);
        this.handMinuteAuto = new Phaser.Sprite(game, 51, -40, 'systemElements', 'hand_time01.png');
        this.handMinuteAuto.scale.set(1, 1);
        this.handMinuteAuto.anchor.set(0.5, 0.8);
        this.autoHandGroup.add(this.handMinuteAuto);

        this.betHandGroup = new Phaser.Group(game);
        this.betHandGroup.visible = false;
        this.betHandGroup.position.set(101, 860);
        this.add(this.betHandGroup);

        this.handBet = new Phaser.Sprite(game, 0, 0, 'systemElements', 'hand.png');
        this.handBet.anchor.set(0.5);
        this.betHandGroup.add(this.handBet);
        this.handIconBet = new Phaser.Sprite(game, 20, 35, 'systemElements', 'hand_bet.png');
        this.handIconBet.scale.set(1.1);
        this.handIconBet.anchor.set(0.5);
        this.betHandGroup.add(this.handIconBet);
        this.handWaveBet = new Phaser.Sprite(game, -8, -67, 'systemElements', 'hand01.png');
        this.handWaveBet.anchor.set(0.5, 0.8);
        this.betHandGroup.add(this.handWaveBet);
        this.handClockBet = new Phaser.Sprite(game, 49, -42, 'systemElements', 'hand_time.png');
        this.handClockBet.anchor.set(0.5);
        this.betHandGroup.add(this.handClockBet);
        this.handHourBet = new Phaser.Sprite(game, 51, -40, 'systemElements', 'hand_time01.png');
        this.handHourBet.scale.set(1, 0.8);
        this.handHourBet.anchor.set(0.5, 0.7);
        this.betHandGroup.add(this.handHourBet);
        this.handMinuteBet = new Phaser.Sprite(game, 51, -40, 'systemElements', 'hand_time01.png');
        this.handMinuteBet.scale.set(1, 1);
        this.handMinuteBet.anchor.set(0.5, 0.8);
        this.betHandGroup.add(this.handMinuteBet);
    }

    makeBtns() {
        this.autoNumAry = [];
        this.autoListBackOverlay = new Overlay(this.game, { alpha: 0 });
        this.autoListBackOverlay.show(false);
        this.autoListBackOverlay.inputEnabled = true;
        this.autoListBackOverlay.events.onInputDown.add(() => {
            this.autoListClose();
            this.betListClose();
        });
        this.add(this.autoListBackOverlay);
        this.makeAutoBtns();

        this.betNumAry = [];
        this.betListBackOverlay = new Overlay(this.game, { alpha: 0 });
        this.betListBackOverlay.show(false);
        this.betListBackOverlay.inputEnabled = true;
        this.betListBackOverlay.events.onInputDown.add(() => {
            this.autoListClose();
            this.betListClose();
        });
        this.add(this.betListBackOverlay);
        this.makeBetBtns();

        this.menuOptionsAry = [];
        this.menuOptionsBackOverlay = new Overlay(this.game, { alpha: 0 });
        this.menuOptionsBackOverlay.show(false);
        this.menuOptionsBackOverlay.inputEnabled = true;
        this.menuOptionsBackOverlay.events.onInputDown.add(() => {
            this.menuClose();
        });
        this.add(this.menuOptionsBackOverlay);
        this.isMenuOpen = false;
        this.makeOptionBtns();

        this.menuBtn = new UIButton(this.game, 101, 846, 'uiButton', [ 'btn_baseUp.png', 'btn_baseDown.png' ]);
        this.menuBtn.anchor.set(0.5);
        this.menuBtn.addSubTexture(0, 0, 0, 'uiButtonMenu', [ 'btn_system_normal.png', 'btn_system_press.png' ]);
        this.menuBtn.setSubTextureScale();
        this.menuBtn.name = 'Btn_Menu';
        this.menuBtnTween = new TimelineMax();
        this.btnAry.push(this.menuBtn);
        this.hasMenuPressed = false;
        this.hasMenuPressedLong = false;

        const onMenuBtnEvent = () => {
            this.onDispatchEvent(new BtnEvent('Btn_Menu'));

            for (let i = 0; i < this.betBtnsArray.length; i++) {
                this.betBtnsArray[i].alpha = 0;
                this.betBtnsArray[i].visible = false;
                this.betBtnsArray[i].privateTween.clear();
            }
        };

        this.menuBtn.addButtonUpEvent(this, () => {
            clearTimeout(this.fadeBetTO);
            this.fadeBetTO = null;
            this.hasMenuPressed = false;

            this.menuBtnTween.clear();
            this.menuBtn.subTextDown.scale.set(1);

            if (this.hasMenuPressedLong) {
                return;
            }
            onMenuBtnEvent();
        });
        this.menuBtn.addButtonDownEvent(this, () => {
            this.cycleStopShowHint();
            this.betList();
            this.menuClose();
        });
        this.add(this.menuBtn);

        this.playBtn = new UIButton(this.game, 1579, 846, 'uiButton', [ 'btn_baseUp.png', 'btn_baseDown.png' ]);
        this.playBtn.anchor.set(0.5);
        this.playBtn.addSubTexture(0, 0, 0, 'uiButtonSpin', [ 'btn_spin_normal.png', 'btn_spin_press.png' ]);
        this.playBtn.setSubTextureScale();
        this.playBtn.name = 'Btn_Spin';
        this.playBtnTween = new TimelineMax();
        this.btnAry.push(this.playBtn);
        this.hasPlayPressed = false;
        this.hasPlayPressedLong = false;

        const onPlayBtnEvent = () => {
            this.onDispatchEvent(new BtnEvent(this.playBtn.name));

            for (let i = 0; i < this.autoBtnsArray.length; i++) {
                this.autoBtnsArray[i].alpha = 0;
                this.autoBtnsArray[i].visible = false;
                this.autoBtnsArray[i].privateTween.clear();
            }
        };
        this.playBtn.addButtonUpEvent(this, () => {
            clearTimeout(this.fadeNumTO);
            this.playBtn.angle = 0;
            this.fadeNumTO = null;

            this.playBtnTween.clear();
            this.playBtn.subTextDown.scale.set(1);

            this.hasPlayPressed = false;
            if (this.hasPlayPressedLong) {
                return;
            }
            onPlayBtnEvent();
        });
        this.playBtn.addButtonDownEvent(this, () => {
            this.cycleStopShowHint();
            this.menuClose();
            this.autoList();
        });
        this.add(this.playBtn);

        this.stopBtn = new UIButton(this.game, 1579, 846, 'uiButton', [ 'btn_baseUp.png', 'btn_baseDown.png' ], this, BtnEvent);
        this.stopBtn.anchor.set(0.5);
        this.stopBtn.addSubTexture(0, 0, 0, 'uiButtonStop', [ 'btn_stop_normal.png', 'btn_stop_press.png' ]);
        this.stopBtn.setSubTextureScale();
        this.stopBtn.name = 'Btn_Stop';
        this.stopBtn.visible = false;
        this.btnAry.push(this.stopBtn);
        this.add(this.stopBtn);

        this.takeWinBtn = new UIButton(this.game, 1579, 846, 'uiButton', [ 'btn_baseUp.png', 'btn_baseDown.png' ], this, BtnEvent);
        this.takeWinBtn.anchor.set(0.5);
        this.takeWinBtn.addSubTexture(0, 0, 0, 'uiButtonTakeWin', [ 'btn_tackmoney.png', 'btn_tackmoney01.png' ]);
        this.takeWinBtn.setSubTextureScale();
        this.takeWinBtn.name = 'Btn_TakeWin';
        this.takeWinBtn.visible = false;
        this.btnAry.push(this.takeWinBtn);
        this.add(this.takeWinBtn);

        this.autoStopBtn = new UIButton(this.game, 1579, 846, 'uiButton', [ 'btn_baseUp.png', 'btn_baseDown.png' ], this, BtnEvent);
        this.autoStopBtn.anchor.set(0.5);
        this.autoStopBtn.addSubTexture(0, 0, 0, 'uiButtonAutoStop', [ 'btn_stop_normal.png', 'btn_stop_press.png' ]);
        this.autoStopBtn.setSubTextureScale();
        this.autoStopBtn.name = 'Btn_AutoStop';
        this.autoStopBtn.createButtonBitmapText(0, -6, 0, 'num_base', '');
        this.autoStopBtn.visible = false;
        this.btnAry.push(this.autoStopBtn);
        this.add(this.autoStopBtn);
    }

    makeAutoBtns() {}

    makeAutoBtn(x, y, scale, angle, num, numFixPos) {
        const btnAutoNum = new UIButton(this.game, x, y, 'uiButtonAutoNum', [ 'btn_bg02_normal.png', 'btn_bg02_press.png' ], this, BtnEvent, [ num ]);
        btnAutoNum.anchor.set(1, 1.34);
        btnAutoNum.scale.set(scale);
        btnAutoNum.angle = angle;
        btnAutoNum.alpha = 0;
        btnAutoNum.visible = false;
        btnAutoNum.name = 'Btn_Auto';
        const autoNum = num < 0 ? '~' : num;
        btnAutoNum.createButtonBitmapText(numFixPos.x, numFixPos.y, -angle, 'num_base', autoNum, 0);
        btnAutoNum.createButtonBitmapText(numFixPos.x, numFixPos.y, -angle, 'num_light', autoNum, 1);
        btnAutoNum.switchButtonBitmapText(1, false);
        btnAutoNum.addButtonDownEvent(this, () => {
            btnAutoNum.switchButtonBitmapText(0, false);
            btnAutoNum.switchButtonBitmapText(1, true);
        });
        btnAutoNum.addButtonUpEvent(this, () => {
            btnAutoNum.switchButtonBitmapText(0, true);
            btnAutoNum.switchButtonBitmapText(1, false);
        });
        this.autoNumAry.push(btnAutoNum);
        this.btnAry.push(btnAutoNum);
        this.add(btnAutoNum);

        const aniBtn = new Phaser.Sprite(this.game, x, y, 'uiButtonAutoNum', 'btn_bg02_normal.png');
        aniBtn.anchor.set(1, 1.34);
        aniBtn.scale.set(scale);
        aniBtn.angle = angle;
        aniBtn.alpha = 0;
        aniBtn.visible = false;
        aniBtn.targetAngle = angle;
        aniBtn.privateTween = new TimelineMax();
        this.add(aniBtn);
        this.autoBtnsArray.push(aniBtn);

        return btnAutoNum;
    }

    autoList() {
        this.hasPlayPressed = true;
        this.hasPlayPressedLong = false;
        this.autoListClose();
        this.betListClose();

        this.fadeNumTO = setTimeout(() => {
            if (this.hasPlayPressed) {
                this.hasPlayPressedLong = true;
                this.autoListOpen();
            }

            clearTimeout(this.fadeNumTO);
            this.fadeNumTO = null;
        }, 800);

        this.playBtnTween
        .to(this.playBtn, 0.3,
            {}
        )
        .to(this.playBtn.subTextDown.scale, 0.4,
            {
                ease: Power2.easeIn,
                x: 0.6,
                y: 0.6
            }
        );

        for (let i = 0; i < this.autoBtnsArray.length; i++) {
            this.autoBtnsArray[i].angle = 120;
            this.autoBtnsArray[i].alpha = 1;
            this.autoBtnsArray[i].visible = true;
            this.autoBtnsArray[i].privateTween
            .to(this.autoBtnsArray, 0.3,
                {}
            )
            .to(this.autoBtnsArray[i], 0.5,
                {
                    ease: Power2.easeIn,
                    angle: this.autoBtnsArray[i].targetAngle,
                    onComplete: () => {
                        this.autoBtnsArray[i].alpha = 0;
                        this.autoBtnsArray[i].visible = false;
                        this.autoBtnsArray[i].privateTween.clear();
                    }
                }
            );
        }
    }

    autoListOpen() {
        this.autoNumAry.forEach((autoNum) => {
            autoNum.alpha = 1;
            autoNum.visible = true;
        }, this);
        this.autoListBackOverlay.show(true);

        this.playBtn.subTextUp.loadTexture('systemElements', 'hand_auto.png');
        this.playBtn.subTextDown.loadTexture('systemElements', 'hand_auto.png');
        this.playBtn.setSubTextureScale(2);
    }

    autoListClose() {
        this.autoNumAry.forEach((autoNum) => {
            autoNum.alpha = 0;
            autoNum.visible = false;
        }, this);
        this.autoListBackOverlay.show(false);
        this.cycleShowHintDuration(10, 2);

        this.playBtn.subTextUp.loadTexture('uiButtonSpin', 'btn_spin_normal.png');
        this.playBtn.subTextDown.loadTexture('uiButtonSpin', 'btn_spin_press.png');
        this.playBtn.setSubTextureScale(1);
    }

    makeBetBtns() {}

    makeBetBtn(x, y, scale, angle, num, numFixPos) {
        const btnBetNum = new UIButton(this.game, x, y, 'uiButtonMenuOptions', [ 'btn_bg03_normal.png', 'btn_bg03_press.png' ], this, BtnEvent, [ num ]);
        btnBetNum.anchor.set(0.08, 1.35);
        btnBetNum.scale.set(scale);
        btnBetNum.angle = angle;
        btnBetNum.alpha = 0;
        btnBetNum.visible = false;
        btnBetNum.name = 'Btn_Bet_Value';
        const betNum = num < 0 ? '~' : num;
        btnBetNum.createButtonBitmapText(numFixPos.x, numFixPos.y, -angle, 'num_base', betNum, 0);
        btnBetNum.createButtonBitmapText(numFixPos.x, numFixPos.y, -angle, 'num_light', betNum, 1);
        btnBetNum.switchButtonBitmapText(1, false);
        btnBetNum.addButtonDownEvent(this, () => {
            btnBetNum.switchButtonBitmapText(0, false);
            btnBetNum.switchButtonBitmapText(1, true);
        });
        btnBetNum.addButtonUpEvent(this, () => {
            btnBetNum.switchButtonBitmapText(0, true);
            btnBetNum.switchButtonBitmapText(1, false);
            this.betListClose();
        });
        this.betNumAry.push(btnBetNum);
        this.btnAry.push(btnBetNum);
        this.add(btnBetNum);

        const aniBtn = new Phaser.Sprite(this.game, x, y, 'uiButtonMenuOptions', 'btn_bg03_normal.png');
        aniBtn.anchor.set(0.08, 1.35);
        aniBtn.scale.set(scale);
        aniBtn.angle = angle;
        aniBtn.alpha = 0;
        aniBtn.visible = false;
        aniBtn.targetAngle = angle;
        aniBtn.privateTween = new TimelineMax();
        this.add(aniBtn);
        this.betBtnsArray.push(aniBtn);

        return btnBetNum;
    }
    makeMoreBetBtn(x, y, scale, angle, numFixPos) {
        this.btnMoreBet = new UIButton(this.game, x, y, 'uiButtonMenuOptions', [ 'btn_bg03_normal.png', 'btn_bg03_press.png' ], this, BtnEvent);
        this.btnMoreBet.anchor.set(0.08, 1.35);
        this.btnMoreBet.scale.set(scale);
        this.btnMoreBet.angle = angle;
        this.btnMoreBet.alpha = 0;
        this.btnMoreBet.visible = false;
        this.btnMoreBet.name = 'Btn_More_Bet';

        this.btnMoreBet.addSubTexture(numFixPos.x, numFixPos.y, -angle, 'systemElements', [ 'btn_more_normal.png', 'btn_more_press.png' ]);

        this.btnAry.push(this.btnMoreBet);
        this.add(this.btnMoreBet);

        const aniBtn = new Phaser.Sprite(this.game, x, y, 'uiButtonMenuOptions', 'btn_bg03_normal.png');
        aniBtn.anchor.set(0.08, 1.35);
        aniBtn.scale.set(scale);
        aniBtn.angle = angle;
        aniBtn.alpha = 0;
        aniBtn.visible = false;
        aniBtn.targetAngle = angle;
        aniBtn.privateTween = new TimelineMax();
        this.add(aniBtn);
        this.betBtnsArray.push(aniBtn);
    }

    onBetListUpdate() {
        const currentMaximumBet = +this.betNumAry[this.betNumAry.length - 1].bitmapTextAry[0].text;

        const betListInx = ConfigPasser.instance.BET_SETTING_LIST.indexOf(currentMaximumBet);

        const nextBetListInx = betListInx === ConfigPasser.instance.BET_SETTING_LIST.length - 1 ? 0 : betListInx + 1;

        const nextBetListRange = [];

        this.betNumAry.forEach((obj, inx) => {
            const fix = nextBetListInx - inx;
            const temp = fix < 0 ? ConfigPasser.instance.BET_SETTING_LIST.length + fix : fix;
            nextBetListRange.unshift(temp);
        }, this);

        this.betNumAry.forEach((obj, inx) => {
            const newBet = ConfigPasser.instance.BET_SETTING_LIST[nextBetListRange[inx]];
            obj.setButtonBitmapText(0, newBet);
            obj.setButtonBitmapText(1, newBet);
            obj.BtnEventParams[0] = newBet;
        }, this);
    }

    betList() {
        this.hasMenuPressed = true;
        this.hasMenuPressedLong = false;
        this.betListClose();

        this.fadeBetTO = setTimeout(() => {
            if (this.hasMenuPressed) {
                this.hasMenuPressedLong = true;
                this.betListOpen();
            }

            clearTimeout(this.fadeBetTO);
            this.fadeBetTO = null;
        }, 800);

        this.menuBtnTween
        .to(this.menuBtn.subTextDown.scale, 0.3,
            {}
        )
        .to(this.menuBtn.subTextDown.scale, 0.4,
            {
                ease: Power2.easeIn,
                x: 0.6,
                y: 0.6
            }
        );

        for (let i = 0; i < this.betBtnsArray.length; i++) {
            this.betBtnsArray[i].angle = -120;
            this.betBtnsArray[i].alpha = 1;
            this.betBtnsArray[i].visible = true;
            this.betBtnsArray[i].privateTween
            .to(this.betBtnsArray, 0.3,
                {}
            )
            .to(this.betBtnsArray[i], 0.5,
                {
                    ease: Power2.easeIn,
                    angle: this.betBtnsArray[i].targetAngle,
                    onComplete: () => {
                        this.betBtnsArray[i].alpha = 0;
                        this.betBtnsArray[i].visible = false;
                        this.betBtnsArray[i].privateTween.clear();
                    }
                }
            );
        }
    }

    betListOpen() {
        this.menuClose();
        this.autoListClose();
        this.betNumAry.forEach((betNum) => {
            betNum.alpha = 1;
            betNum.visible = true;
        }, this);
        this.btnMoreBet.alpha = 1;
        this.btnMoreBet.visible = true;
        this.betListBackOverlay.show(true);

        this.menuBtn.subTextUp.loadTexture('systemElements', 'hand_bet.png');
        this.menuBtn.subTextDown.loadTexture('systemElements', 'hand_bet.png');
        this.menuBtn.setSubTextureScale(2);
    }

    betListClose() {
        this.betNumAry.forEach((betNum) => {
            betNum.alpha = 0;
            betNum.visible = false;
        }, this);
        this.btnMoreBet.alpha = 0;
        this.btnMoreBet.visible = false;
        this.betListBackOverlay.show(false);
        this.cycleShowHintDuration(10, 2);

        this.menuBtn.subTextUp.loadTexture('uiButtonMenu', 'btn_system_normal.png');
        this.menuBtn.subTextDown.loadTexture('uiButtonMenu', 'btn_system_press.png');
        this.menuBtn.setSubTextureScale(1);
    }

    makeOptionBtns() {}

    makeMenuOptionBtn(x, y, scale, angle, optionObj, textureFixPos) {
        const btnMenuOption = new UIButton(this.game, x, y, 'uiButtonMenuOptions', [ 'btn_bg03_normal.png', 'btn_bg03_press.png' ], this, BtnEvent);
        btnMenuOption.anchor.set(0.08, 1.35);
        btnMenuOption.scale.set(scale);
        btnMenuOption.angle = angle;
        btnMenuOption.alpha = 0;
        btnMenuOption.visible = false;
        btnMenuOption.name = optionObj.name;
        if (optionObj.key) {
            btnMenuOption.addSubTexture(textureFixPos.x, textureFixPos.y, -angle, optionObj.key, optionObj.frame);
        }
        this.menuOptionsAry.push(btnMenuOption);
        this.btnAry.push(btnMenuOption);
        this.add(btnMenuOption);

        return btnMenuOption;
    }

    onMenuBtn() {
        this.isMenuOpen = !this.isMenuOpen;
        if (!this.isMenuOpen) {
            this.menuClose();
            return;
        }
        this.menuOptionsAry.forEach((optionBtn) => {
            if (optionBtn.name === 'Btn_Exchange') {
                optionBtn.alpha = !GameInfo.hasExchanged;
                optionBtn.visible = !GameInfo.hasExchanged;
                return;
            }
            if (optionBtn.name === 'Btn_Cashout') {
                optionBtn.alpha = GameInfo.hasExchanged;
                optionBtn.visible = GameInfo.hasExchanged;
                return;
            }
            optionBtn.alpha = 1;
            optionBtn.visible = true;
        }, this);
        this.menuOptionsBackOverlay.show(true);
        this.autoListClose();
    }

    menuClose() {
        this.isMenuOpen = false;
        this.menuOptionsAry.forEach((optionBtn) => {
            optionBtn.alpha = 0;
            optionBtn.visible = false;
        }, this);
        this.menuOptionsBackOverlay.show(false);
        this.cycleShowHintDuration(10, 2);
    }

    cycleShowHintDuration(seconds = 0, times = 0) {
        this.cycleStopShowHint();
        this.cycleShowHintTO = setTimeout(() => {
            this.setHintVisibleBet(times);
            this.setHintVisibleAuto(times);
            clearTimeout(this.cycleShowHintTO);
            this.cycleShowHintTO = null;
        }, seconds * 1000);
    }

    cycleStopShowHint() {
        clearTimeout(this.cycleShowHintTO);
        this.cycleShowHintTO = null;
        this.setHintVisibleBet(0);
        this.setHintVisibleAuto(0);
    }

    gameSlotStates(evt) {
        this.isAutoPlay = evt.isAutoPlay;
        if (!evt.isAutoPlay) {
            this.setEnabled([ 'Btn_AutoStop' ], false);
            this.setBtnVisible([ 'Btn_AutoStop' ], false);
        }
        switch (evt.statesType) {
            case GaStatesConfig.gameinit: {
                this.makeBtns();
                this.cycleShowHintDuration(5, 2);
                break;
            }
            case GaStatesConfig.gameIdle: {
                this.setBtnVisible([ 'Btn_Spin' ], true);
                this.setEnabled([ 'Btn_Spin', 'Btn_Menu' ], true);
                this.cycleShowHintDuration(10, 2);
                break;
            }
            case GaStatesConfig.gameBeforeSpin: {
                break;
            }
            case GaStatesConfig.gameLockBtn: {
                this.setEnabled([ 'Btn_Menu', 'Btn_Stop', 'Btn_Spin' ], false);
                this.menuClose();
                this.cycleStopShowHint();
                break;
            }
            case GaStatesConfig.gameSpin: {
                clearTimeout(this.fadeNumTO);
                this.fadeNumTO = null;
                clearTimeout(this.fadeBetTO);
                this.fadeBetTO = null;
                this.hasPlayPressed = false;
                this.hasPlayPressedLong = false;
                this.hasMenuPressed = false;
                this.hasMenuPressedLong = false;
                if (this.isAutoPlay && !evt.isFreePlay) {
                    if (GameInfo.autoPlayTimes > -1) {
                        GameInfo.autoPlayTimes--;
                        this.autoStopBtn.setButtonBitmapText(0, GameInfo.autoPlayTimes);
                    }
                    return;
                }
                this.setEnabled([ 'Btn_Stop' ], true);
                this.setBtnVisible([ 'Btn_Spin' ], false);
                this.setBtnVisible([ 'Btn_Stop' ], true);
                break;
            }
            case GaStatesConfig.gameStop: {
                this.setEnabled([ 'Btn_Stop' ], false);
                break;
            }
            case GaStatesConfig.gameWin: {
                if (this.isAutoPlay) {
                    if (GameInfo.autoPlayTimes === 0) {
                        this.onDispatchEvent(new BtnEvent('Btn_AutoStop'));
                    }
                    return;
                }
                this.setEnabled([ 'Btn_Stop' ], false);
                this.setBtnVisible([ 'Btn_Stop' ], false);
                this.setEnabled([ 'Btn_TakeWin' ], true);
                this.setBtnVisible([ 'Btn_TakeWin' ], true);
                break;
            }
            case GaStatesConfig.gameNoWin: {
                if (this.isAutoPlay) {
                    if (GameInfo.autoPlayTimes === 0) {
                        this.onDispatchEvent(new BtnEvent('Btn_AutoStop'));
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
            case GaStatesConfig.gameBigWinLockBtn: {
                break;
            }
            case GaStatesConfig.gameTakeWin: {
                this.setEnabled([ 'Btn_TakeWin' ], false);
                this.setBtnVisible([ 'Btn_TakeWin' ], false);
                if (evt.isFreePlay) {
                    this.setEnabled([ 'Btn_Stop' ], false);
                    this.setBtnVisible([ 'Btn_Stop' ], true);
                }

                break;
            }
            case GaStatesConfig.gameAuto: {
                this.autoListClose();
                this.betListClose();
                this.setEnabled([ 'Btn_Spin' ], false);
                this.setBtnVisible([ 'Btn_Spin' ], false);
                this.setEnabled([ 'Btn_AutoStop' ], true);
                this.setBtnVisible([ 'Btn_AutoStop' ], true);

                let num = GameInfo.autoPlayTimes;
                if (GameInfo.autoPlayTimes < 0) {
                    num = '~';
                }
                this.autoStopBtn.downSubTexture();
                this.autoStopBtn.bitmapTextAry[0].tint = 0xFFFFFF;
                this.autoStopBtn.setButtonBitmapText(0, num);
                break;
            }
            case GaStatesConfig.gameAutoStop: {
                GameInfo.autoPlayTimes = 0;
                this.autoStopBtn.upSubTexture();
                this.autoStopBtn.bitmapTextAry[0].tint = 0x666666;
                this.setEnabled([ 'Btn_AutoStop' ], false);
                this.setBtnVisible([ 'Btn_AutoStop' ], true);
                break;
            }
            case GaStatesConfig.soundOff: {
                break;
            }
            case GaStatesConfig.soundOn: {
                break;
            }
            case GaStatesConfig.gameHistory: {
                break;
            }
            case GaStatesConfig.gameSetting: {
                break;
            }
            case GaStatesConfig.gameSettingReturn: {
                break;
            }
            case GaStatesConfig.gameHelp: {
                break;
            }
            default:
        }
    }

    setHintVisibleAuto(repeatTimes = 0) {
        this.playBtn.setSubTextureAlpha(repeatTimes > 0 ? 0 : 1);
        this.autoHandGroup.visible = repeatTimes > 0;

        if (repeatTimes < 1) {
            if (this.autoHintTween) {
                this.autoHintTween.clear();
                this.autoHintTween.progress(1).kill();
                this.autoHintTween = null;
            }
            return;
        }

        let currentRepeat = 0;

        this.autoHintTween = new TimelineMax({ repeat: repeatTimes - 1, delay: 1 });
        this.handAuto.scale.set(1.5);
        this.handAuto.alpha = 0;
        this.handTextAuto.alpha = 0;
        this.handTextAuto.scale.set(1);
        this.handWaveAuto.alpha = 0;
        this.handClockAuto.alpha = 0;
        this.handHourAuto.alpha = 0;
        this.handHourAuto.angle = 0;
        this.handMinuteAuto.alpha = 0;
        this.autoHintTween
        .to(this.handAuto.scale, 1.1,
            {
                ease: Power4.easeOut,
                x: 1,
                y: 1
            }
        , 'hand')
        .to(this.handAuto, 0.3,
            {
                ease: Power1.easeOut,
                alpha: 1
            }
        , 'hand')
        .to(this.handTextAuto, 0.2,
            {
                ease: Power1.easeIn,
                alpha: 1
            }
        , 'hand')
        .to([ this.handWaveAuto, this.handClockAuto ], 0.3,
            {
                ease: Power1.easeOut,
                alpha: 1
            }
        , 'wave')
        .to([ this.handMinuteAuto, this.handHourAuto ], 0.1,
            {
                ease: Power0.easeNone,
                alpha: 1
            }
        , 'clock')
        .to(this.handHourAuto, 1.5,
            {
                ease: Power0.easeNone,
                angle: 90
            }
        , 'clock')
        .to(this.handMinuteAuto, 1.5,
            {
                ease: Power0.easeNone,
                angle: 1080
            }
        , 'clock')
        .to(this.handTextAuto.scale, 0.2,
            {
                ease: Back.easeOut.config(4),
                x: 1.2,
                y: 1.2
            }
        , 'auto')
        .to(this, 1,
            {
                ease: Power0.easeNone,
                onComplete: () => {
                    currentRepeat++;
                    if (repeatTimes === currentRepeat) {
                        this.setHintVisibleAuto(0);
                    }
                }
            }
        , 'lag');
    }

    setHintVisibleBet(repeatTimes = 0) {
        this.menuBtn.setSubTextureAlpha(repeatTimes > 0 ? 0 : 1);
        this.betHandGroup.visible = repeatTimes > 0;

        if (repeatTimes < 1) {
            if (this.betHintTween) {
                this.betHintTween.clear();
                this.betHintTween.progress(1).kill();
                this.betHintTween = null;
            }
            return;
        }

        let currentRepeat = 0;

        this.betHintTween = new TimelineMax({ repeat: repeatTimes - 1, delay: 1 });
        this.handBet.scale.set(1.5);
        this.handBet.alpha = 0;
        this.handIconBet.alpha = 0;
        this.handIconBet.scale.set(1);
        this.handWaveBet.alpha = 0;
        this.handClockBet.alpha = 0;
        this.handHourBet.alpha = 0;
        this.handHourBet.angle = 0;
        this.handMinuteBet.alpha = 0;
        this.betHintTween
        .to(this.handBet.scale, 1.1,
            {
                ease: Power4.easeOut,
                x: 1,
                y: 1
            }
        , 'hand')
        .to(this.handBet, 0.3,
            {
                ease: Power1.easeOut,
                alpha: 1
            }
        , 'hand')
        .to(this.handIconBet, 0.2,
            {
                ease: Power1.easeIn,
                alpha: 1
            }
        , 'hand')
        .to([ this.handWaveBet, this.handClockBet ], 0.3,
            {
                ease: Power1.easeOut,
                alpha: 1
            }
        , 'wave')
        .to([ this.handMinuteBet, this.handHourBet ], 0.1,
            {
                ease: Power0.easeNone,
                alpha: 1
            }
        , 'clock')
        .to(this.handHourBet, 1.5,
            {
                ease: Power0.easeNone,
                angle: 90
            }
        , 'clock')
        .to(this.handMinuteBet, 1.5,
            {
                ease: Power0.easeNone,
                angle: 1080
            }
        , 'clock')
        .to(this.handIconBet.scale, 0.2,
            {
                ease: Back.easeOut.config(4),
                x: 1.35,
                y: 1.35
            }
        , 'auto')
        .to(this, 1,
            {
                ease: Power0.easeNone,
                onComplete: () => {
                    currentRepeat++;
                    if (repeatTimes === currentRepeat) {
                        this.setHintVisibleBet(0);
                    }
                }
            }
        , 'lag');
    }

    onHideFreeModeBtn() {
        FreeGameHideBtnSignal.callBack();
    }

    onHideBaseModeBtn() {
        BaseGameShowBtnSignal.callBack();
    }

    onLockAllUI() {
        this.autoListClose();
        this.betListClose();
        this.menuClose();
        this.btnAry.forEach((element, inx) => {
            if (element.isEnable) {
                this.btnStateMap.push(inx);
                element.onDisable();
            }
        });
    }

    onUnlockAllUI() {
        this.btnStateMap.forEach((btnInx) => {
            this.btnAry[btnInx].onEnable();
        });
    }

    /**
     * 設定是否顯示
     * @param {Array<string>}  item         傳入按鈕名稱
     * @param {boolean}        bool         是否顯示的參數
     */
    setBtnVisible(item, bool) {
        this.btnAry.forEach((element) => {
            if (item.indexOf(element.name) !== -1) {
                element.visible = bool;
            }
        });
    }

    /**
     * 設定是否鎖定
     * @param  {Array<string>} mcArr         傳入按鈕名稱
     * @param  {boolean} bool                是否鎖定的參數
     */
    setEnabled(mcArr, bool) {
        this.btnAry.forEach((element) => {
            const index = mcArr.indexOf(element.name);
            if (index !== -1) {
                (bool) ? element.onEnable() : element.onDisable();
                // spin 的預設箭頭/聯名logo 圖片的 tint
                element.children.forEach((child) => {
                    child.tint = (bool) ? 0xFFFFFF : 0x999999;
                });
            }
        });
    }
}

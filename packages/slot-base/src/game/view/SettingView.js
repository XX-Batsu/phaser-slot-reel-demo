import GameBase from 'base/GameBase';
import GameEvent from 'game/events/GameEvent';
import UiActionEvent from 'game/events/UiActionEvent';
import UITextEvent from 'game/events/UITextEvent';
import CashoutEvent from 'game/events/system/CashoutEvent';
import ConfigPasser from 'base/ConfigPasser';
import Overlay from 'base/Overlay';
import UIButton from 'base/UIButton';
import Sound from 'base/Sound';
import GameInfo from 'game/model/GameInfo';
import Tool from 'base/Tool';
import GaStatesConfig from 'game/main/GaStatesConfig';
import LikeMoveIt from 'tools/LikeMoveIt';
import ReelEvent from 'game/events/ReelEvent';

export default class SettingView extends GameBase {
    constructor(game) {
        super(game);

        this.addEventListener(UiActionEvent.ON_SHOW_SETTING, this.openSetting, this);
        this.addEventListener(GameEvent.STATES, this.gameSlotStates, this);

        this.visible = false;
        this.speedEnum = Object.create(null);
        this.speedEnum.none = 0;
        this.speedEnum.faster = 1;
        this.speedEnum.boost = 2;
        this.currentSpeed = this.speedEnum.none;
        this.objInitAni();

        this.switchSound(true);
        this.switchMusic(true);
        this.switchBoost(this.speedEnum.none);
    }

    objInitAni() {
        const boardOverlay = new Overlay(this.game);
        boardOverlay.inputEnabled = true;
        this.add(boardOverlay);

        const optionTextX = 530;
        const switchOnX = 1100;
        const switchOffX = 850;
        const firstOptionY = 350;
        const optionDist = 150;

        const settingBoard = new Phaser.Sprite(this.game, 840, 472, 'systemElements', 'UIOverlayBg.png');
        settingBoard.scale.set(8, 12);
        settingBoard.anchor.set(0.5);
        this.add(settingBoard);

        const settingTitleLine = new Phaser.Sprite(this.game, 840, 130, 'systemElements', 'title_line.png');
        settingTitleLine.anchor.set(0.5);
        this.add(settingTitleLine);
        const settingTitle = new Phaser.Sprite(this.game, 840, 87, 'settingTexts', 'settitle_001.png');
        settingTitle.anchor.set(0.5);
        this.add(settingTitle);

        const btnCloseSetting = new UIButton(this.game, 1538, 105, 'systemElements', [ 'btn_close_nor.png', 'btn_close_pre.png' ]);
        btnCloseSetting.anchor.set(0.5);
        btnCloseSetting.addButtonUpEvent(this, this.closeSetting);
        this.add(btnCloseSetting);

        const textSound = new Phaser.Sprite(this.game, optionTextX, firstOptionY, 'settingTexts', 'text_sound.png');
        textSound.anchor.set(0.5);
        this.add(textSound);
        const textMusic = new Phaser.Sprite(this.game, optionTextX, firstOptionY + optionDist, 'settingTexts', 'text_music.png');
        textMusic.anchor.set(0.5);
        this.add(textMusic);
        const textBoost = new Phaser.Sprite(this.game, optionTextX, firstOptionY + optionDist * 2, 'settingTexts', 'text_mode.png');
        textBoost.anchor.set(0.5);
        this.add(textBoost);

        const textOn = new Phaser.Sprite(this.game, switchOnX, 200, 'settingTexts', 'text_open.png');
        textOn.anchor.set(0.5);
        this.add(textOn);
        const textOff = new Phaser.Sprite(this.game, switchOffX, 201, 'settingTexts', 'text_off.png');
        textOff.anchor.set(0.5);
        this.add(textOff);

        const soundOnBg = new UIButton(this.game, switchOnX, firstOptionY, 'settingElements', [ 'bg_on.png', 'bg_on.png' ]);
        soundOnBg.anchor.set(0.5);
        soundOnBg.addButtonDownEvent(this, this.switchSound, true);
        this.add(soundOnBg);
        const musicOnBg = new UIButton(this.game, switchOnX, firstOptionY + optionDist, 'settingElements', [ 'bg_on.png', 'bg_on.png' ]);
        musicOnBg.anchor.set(0.5);
        musicOnBg.addButtonDownEvent(this, this.switchMusic, true);
        this.add(musicOnBg);
        const boostOnBg = new UIButton(this.game, switchOnX, firstOptionY + optionDist * 2, 'settingElements', [ 'bg_on.png', 'bg_on.png' ]);
        boostOnBg.anchor.set(0.5);
        boostOnBg.addButtonDownEvent(this, () => {
            switch (this.currentSpeed) {
                case this.speedEnum.none: {
                    this.switchBoost(this.speedEnum.faster);
                    break;
                }
                case this.speedEnum.faster: {
                    this.switchBoost(this.speedEnum.boost);
                    break;
                }
                case this.speedEnum.boost: {
                    this.switchBoost(this.speedEnum.faster);
                    break;
                }
                default:
            }
        });
        this.add(boostOnBg);

        const soundOffBg = new UIButton(this.game, switchOffX, firstOptionY, 'settingElements', [ 'bg_off.png', 'bg_off.png' ]);
        soundOffBg.anchor.set(0.5);
        soundOffBg.addButtonDownEvent(this, this.switchSound, false);
        this.add(soundOffBg);
        const musicOffBg = new UIButton(this.game, switchOffX, firstOptionY + optionDist, 'settingElements', [ 'bg_off.png', 'bg_off.png' ]);
        musicOffBg.anchor.set(0.5);
        musicOffBg.addButtonDownEvent(this, this.switchMusic, false);
        this.add(musicOffBg);
        const boostOffBg = new UIButton(this.game, switchOffX, firstOptionY + optionDist * 2, 'settingElements', [ 'bg_off.png', 'bg_off.png' ]);
        boostOffBg.anchor.set(0.5);
        boostOffBg.addButtonDownEvent(this, this.switchBoost, this.speedEnum.none);
        this.add(boostOffBg);

        this.soundOnToken = new Phaser.Sprite(this.game, switchOnX, firstOptionY, 'settingElements', 'box_on.png');
        this.soundOnToken.anchor.set(0.5);
        this.soundOnToken.visible = false;
        this.add(this.soundOnToken);
        this.musicOnToken = new Phaser.Sprite(this.game, switchOnX, firstOptionY + optionDist, 'settingElements', 'box_on.png');
        this.musicOnToken.anchor.set(0.5);
        this.musicOnToken.visible = false;
        this.add(this.musicOnToken);
        this.boostOnToken = new Phaser.Sprite(this.game, switchOnX, firstOptionY + optionDist * 2, 'settingElements', 'box_on.png');
        this.boostOnToken.anchor.set(0.5);
        this.boostOnToken.visible = false;
        this.add(this.boostOnToken);

        this.fasterArrowGroup = new Phaser.Group(this.game);
        this.add(this.fasterArrowGroup);
        const fastArrow1 = new Phaser.Sprite(this.game, switchOnX + 3, firstOptionY + optionDist * 2, 'systemElements', 'btn_more_normal.png');
        fastArrow1.angle = 270;
        fastArrow1.scale.set(0.7);
        fastArrow1.anchor.set(0.5);
        fastArrow1.tint = '0x880000';
        this.fasterArrowGroup.add(fastArrow1);

        this.boostArrowGroup = new Phaser.Group(this.game);
        this.add(this.boostArrowGroup);
        const boostArrow1 = new Phaser.Sprite(this.game, switchOnX - 3, firstOptionY + optionDist * 2, 'systemElements', 'btn_more_normal.png');
        boostArrow1.angle = 270;
        boostArrow1.scale.set(0.61);
        boostArrow1.anchor.set(0.5);
        boostArrow1.tint = '0x880000';
        this.boostArrowGroup.add(boostArrow1);
        const boostArrow2 = new Phaser.Sprite(this.game, switchOnX + 10, firstOptionY + optionDist * 2, 'systemElements', 'btn_more_normal.png');
        boostArrow2.angle = 270;
        boostArrow2.scale.set(0.58);
        boostArrow2.anchor.set(0.5);
        boostArrow2.tint = '0x880000';
        this.boostArrowGroup.add(boostArrow2);

        this.soundOffToken = new Phaser.Sprite(this.game, switchOffX, firstOptionY, 'settingElements', 'box_off.png');
        this.soundOffToken.anchor.set(0.5);
        this.soundOffToken.visible = false;
        this.add(this.soundOffToken);
        this.musicOffToken = new Phaser.Sprite(this.game, switchOffX, firstOptionY + optionDist, 'settingElements', 'box_off.png');
        this.musicOffToken.anchor.set(0.5);
        this.musicOffToken.visible = false;
        this.add(this.musicOffToken);
        this.boostOffToken = new Phaser.Sprite(this.game, switchOffX, firstOptionY + optionDist * 2, 'settingElements', 'box_off.png');
        this.boostOffToken.anchor.set(0.5);
        this.boostOffToken.visible = false;
        this.add(this.boostOffToken);
    }

    switchSound(bool) {
        this.soundOnToken.visible = bool;
        this.soundOffToken.visible = !bool;
        Sound.effectSoundSwitch(bool);
    }

    switchMusic(bool) {
        this.musicOnToken.visible = bool;
        this.musicOffToken.visible = !bool;
        Sound.musicSoundSwitch(bool);
    }

    switchBoost(speed) {
        switch (speed) {
            case this.speedEnum.none: {
                this.boostOnToken.visible = false;
                this.boostOffToken.visible = true;
                this.fasterArrowGroup.visible = false;
                this.boostArrowGroup.visible = false;
                this.currentSpeed = this.speedEnum.none;
                this.onDispatchEvent(new ReelEvent(ReelEvent.ON_BOOST_PLAY, this.speedEnum.none));
                break;
            }
            case this.speedEnum.faster: {
                this.boostOnToken.visible = true;
                this.boostOffToken.visible = false;
                this.fasterArrowGroup.visible = true;
                this.boostArrowGroup.visible = false;
                this.currentSpeed = this.speedEnum.faster;
                this.onDispatchEvent(new ReelEvent(ReelEvent.ON_BOOST_PLAY, this.speedEnum.faster));
                break;
            }
            case this.speedEnum.boost: {
                this.boostOnToken.visible = true;
                this.boostOffToken.visible = false;
                this.fasterArrowGroup.visible = false;
                this.boostArrowGroup.visible = true;
                this.currentSpeed = this.speedEnum.boost;
                this.onDispatchEvent(new ReelEvent(ReelEvent.ON_BOOST_PLAY, this.speedEnum.boost));
                break;
            }
            default:
        }
    }

    openSetting() {
        this.visible = true;
    }

    closeSetting() {
        Sound.soundPlay('btnNegative');
        this.visible = false;
        this.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_CLOSE_SETTING));
    }

    /**
     * 按鈕層狀態機顯示與控制(需要自定義)
     * @param {string} evt  evt
     */
    gameSlotStates(evt) {
        switch (evt.statesType) {
            default:
        }
    }

}

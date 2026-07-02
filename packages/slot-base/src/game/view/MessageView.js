/*
 * 這層主要來放置提示文字，警告訊息等功能
 */

 // --- base ---
import GameBase from 'base/GameBase';
import Overlay from 'base/Overlay';
import UIButton from 'base/UIButton';
import ConfigPasser from 'base/ConfigPasser';
import Sound from 'base/Sound';

 // --- game ---
 // event
import UiActionEvent from 'game/events/UiActionEvent';
import MessageEvent from 'game/events/MessageEvent';
import BtnEvent from 'game/events/BtnEvent';
import GameInfo from 'game/model/GameInfo';

export default class MessageView extends GameBase {
    constructor(game) {
        super(game);
        // mask
        this.overlay = new Overlay(game, {
            settings: [ 0, 0, game.world.width, game.world.height ],
            alpha: 0.8
        });
        this.overlay.inputEnabled = true;
        this.overlay.events.onInputUp.add(() => {});

        this.msgBoard = new Phaser.Sprite(this.game, 840, 472, 'systemElements', 'UIOverlayBg.png');
        this.msgBoard.scale.set(8, 12);
        this.msgBoard.anchor.set(0.5);

        this.textMsg = this.game.add.text(840, 400, '', {
            font: '50px Microsoft JhengHei',
            fill: '#FFF',
            boundsAlignH: 'center',
            boundsAlignV: 'middle',
            wordWrap: true,
            wordWrapWidth: this.game.world.width / 2
        });
        this.textMsg.anchor.set(0.5);
        this.textMsg.setShadow(3, 3, 'rgba(50,50,50,0.9)', 2);

        const messageTitleLine = new Phaser.Sprite(this.game, 840, 130, 'systemElements', 'title_line.png');
        messageTitleLine.anchor.set(0.5);
        const messageTitle = new Phaser.Sprite(this.game, 840, 87, 'messageTexts', 'prompttitle_001.png');
        messageTitle.anchor.set(0.5);

        this.textureMsg = new Phaser.Sprite(this.game, 840, 400, '');
        this.textureMsg.anchor.set(0.5);

        this.btnLeaveConfirm = new UIButton(this.game, 840, 700, 'systemTexts', [ 'confirm_001.png', 'confirm_001_pre.png' ]);
        this.btnLeaveConfirm.anchor.set(0.5);
        this.btnLeaveConfirm.addButtonUpEvent(this, this.onInputConfirm);

        this.btnConfirm = new UIButton(this.game, 1160, 700, 'systemTexts', [ 'confirm_001.png', 'confirm_001_pre.png' ]);
        this.btnConfirm.anchor.set(0.5);
        this.btnCancel = new UIButton(this.game, 520, 700, 'systemTexts', [ 'return_001.png', 'return_001_pre.png' ]);
        this.btnCancel.anchor.set(0.5);
        this.btnCancel.addButtonUpEvent(this, () => {
            Sound.playFeature('btnNegative');
            this.closeMessage();
        });

        // group
        this.visible = false;
        this.add(this.overlay);
        this.add(this.msgBoard);
        this.add(this.textMsg);
        this.add(messageTitleLine);
        this.add(messageTitle);
        this.add(this.textureMsg);
        this.add(this.btnLeaveConfirm);
        this.add(this.btnConfirm);
        this.add(this.btnCancel);

        // 提示訊息
        this.addEventListener(MessageEvent.ON_SHOW_MESSAGE_TIP, this.openMessage, this);
        this.addEventListener(MessageEvent.ON_SHOW_MESSAGE_EXIT, this.openExitMessage, this);
        // 關閉提示訊息
        this.addEventListener(UiActionEvent.ON_MESSAGE_CLOSE, this.closeMessage, this);
    }

    openMessage(data) {
        this.showMessage(data.messageText);
        this.show(true);
    }

    openExitMessage() {
        this.btnConfirm.addButtonUpEvent(this, this.exitConfirm, null, true);
        this.showTextureMessage('messageTexts', 'text_to_leave.png');
        this.show(true, 1);
    }

    closeMessage() {
        this.show(false);
    }

    show(bool, type = 0) {
        this.overlay.show(bool);
        this.visible = bool;
        if (!bool) {
            this.btnConfirm.removeButtonUpEvent(this);
            this.showTextureMessage('');
            this.onDispatchEvent(new MessageEvent(MessageEvent.ON_CLOSE_MESSAGE_TIP));
            return;
        }
        switch (type) {
            case 0 : {
                this.btnLeaveConfirm.visible = true;
                this.btnConfirm.visible = false;
                this.btnCancel.visible = false;
                break;
            }
            case 1 : {
                this.btnLeaveConfirm.visible = false;
                this.btnConfirm.visible = true;
                this.btnCancel.visible = true;
                break;
            }
            default:
        }
    }

    showMessage(msg) {
        this.textMsg.text = msg;
    }

    showTextureMessage(key = '', frame = '') {
        if (key === '' && frame === '') {
            this.textureMsg.visible = false;
            return;
        }
        this.textureMsg.visible = true;
        this.textureMsg.loadTexture(key, frame);
    }

    showErrorMessage(msg, isMask, callbackCon, callbackFunc, callbackArg) {
        this.textMsg.text = msg;
        this.show(isMask);
        if (callbackFunc) {
            this.inputConfirmFunc = callbackFunc;
            this.inputConfirmCon = callbackCon;
            this.inputConfirmArg = callbackArg;
        }
    }

    onInputConfirm() {
        this.textMsg.text = '';
        this.show(false);
        if (this.inputConfirmFunc) {
            this.inputConfirmFunc.call(this.inputConfirmCon, this.inputConfirmArg);
        }
        Sound.playFeature('btnConfirm');
    }

    exitConfirm() {
        window.location.href = GameInfo.gameReturnUrl;
    }

    drawMessageBoardGraphic() {
        const widthFix = 60;
        const boardAreaShader = new Phaser.Graphics(this.game, this.game.width / 2, this.game.height / 2);
        boardAreaShader.beginFill(0xbb5e00);
        boardAreaShader.drawRoundedRect(-this.game.width / 4 - 4 * widthFix, -this.game.height / 4, this.game.width / 2 + 10 + 8 * widthFix, this.game.height / 2 + 14, 40);
        boardAreaShader.endFill();
        boardAreaShader.alpha = 0.9;
        this.add(boardAreaShader);

        const boardArea = new Phaser.Graphics(this.game, this.game.width / 2, this.game.height / 2);
        boardArea.beginFill(0xffbb77);
        boardArea.drawRoundedRect(-this.game.width / 4 - 4 * widthFix, -this.game.height / 4, this.game.width / 2 + 8 * widthFix, this.game.height / 2, 40);
        boardArea.endFill();
        boardArea.alpha = 0.95;
        this.add(boardArea);
    }

    drawMessageContentGraphic(msg) {
        const fontStyle = {
            font: '52px Microsoft JhengHei',
            fill: '#FFFFFF',
            align: 'center',
            boundsAlignH: 'center',
            boundsAlignV: 'middle',
            wordWrap: true,
            wordWrapWidth: this.game.world.width / 2
        };
        const baseMsg = this.game.add.text(this.game.world.width / 2, this.game.world.height / 2 - this.game.world.height / 6, `${ConfigPasser.instance.LANGUAGE_CONFIG.transToCustomerService}\n${ConfigPasser.instance.LANGUAGE_CONFIG.confirmGoBack}`, fontStyle);
        baseMsg.anchor.set(0.5);
        baseMsg.setShadow(3, 3, 'rgba(20,20,20,0.8)', 7);
        this.add(baseMsg);
        const baseFontStyle = {
            font: '42px Microsoft JhengHei',
            fill: '#E0E0E0',
            align: 'center',
            boundsAlignH: 'center',
            boundsAlignV: 'middle',
            wordWrap: true,
            wordWrapWidth: this.game.world.width / 2
        };
        const warningMsg = this.game.add.text(this.game.world.width / 2, this.game.world.height / 2 - 10, msg, baseFontStyle);
        warningMsg.anchor.set(0.5);
        warningMsg.setShadow(2, 2, 'rgba(20,20,20,0.8)', 5);
        this.add(warningMsg);
    }

    drawConfirmReturnBtn(behavior) {
        const btnShader = new Phaser.Graphics(this.game, this.game.width / 2, this.game.height / 2);
        btnShader.beginFill(0x006000);
        btnShader.drawRoundedRect(-this.game.width / 8, this.game.height / 12 + 35, this.game.width / 4 + 5, this.game.height / 12 + 7, 60);
        btnShader.endFill();
        this.add(btnShader);

        const btn = new Phaser.Graphics(this.game, this.game.width / 2, this.game.height / 2 + 35);
        btn.beginFill(0x00db00);
        btn.drawRoundedRect(-this.game.width / 8, this.game.height / 12, this.game.width / 4, this.game.height / 12, 60);
        btn.endFill();
        this.add(btn);

        const btnMsg = this.game.add.text(this.game.world.width / 2, this.game.world.height / 2 + this.game.world.height / 8 + 35, ConfigPasser.instance.LANGUAGE_CONFIG.confirm, {
            font: '40px Microsoft JhengHei',
            fill: '#FFFFFF',
            boundsAlignH: 'center',
            boundsAlignV: 'middle'
        });
        btnMsg.anchor.set(0.5);
        btnMsg.setShadow(3, 3, 'rgba(20,20,20,0.8)', 7);
        this.add(btnMsg);

        btn.inputEnabled = true;
        btn.events.onInputDown.add(() => {
            btn.destroy(true, false);
            behavior();
        });
    }

}

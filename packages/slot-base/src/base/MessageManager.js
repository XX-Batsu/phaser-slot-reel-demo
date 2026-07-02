import Overlay from 'base/Overlay';
import UIButton from 'base/UIButton';
import ConfigPasser from 'base/ConfigPasser';
import Sound from 'base/Sound';

export default class MessageManager extends Phaser.Group {
    constructor(game) {
        super(game);
        // mask
        this.overlay = new Overlay(game, {
            settings: [ 0, 0, game.world.width, game.world.height ],
            alpha: 0.8
        });
        this.overlay.inputEnabled = true;
        this.overlay.events.onInputUp.add(() => {});

        this.msgBoard = new Phaser.Sprite(this.game, this.game.width / 2, this.game.height / 2 - 15, 'systemElements', 'UIOverlayBg.png');
        this.msgBoard.scale.set(8, 12);
        this.msgBoard.anchor.set(0.5);

        // this.msgTitle = new Phaser.Sprite(this.game, this.game.width / 2 + 15, this.game.height / 2 - 180, 'messageTexts', 'prompttitle_001.png');
        // this.msgTitle.anchor.set(0.5);

        this.textMsg = this.game.add.text(game.world.width / 2, game.world.height / 2 - 100, '', {
            font: '50px Microsoft JhengHei',
            fill: '#FFF',
            boundsAlignH: 'center',
            boundsAlignV: 'middle',
            wordWrap: true,
            wordWrapWidth: this.game.world.width / 2
        });
        this.textMsg.anchor.set(0.5);
        this.textMsg.setShadow(3, 3, 'rgba(50,50,50,0.9)', 2);

        this.btnConfirm = new UIButton(this.game, this.game.width / 2, this.game.height / 2 + 162, 'systemTexts', [ 'confirm_001.png', 'confirm_001_pre.png' ]);
        this.btnConfirm.anchor.set(0.5);
        this.btnConfirm.visible = false;
        this.btnConfirm.addButtonUpEvent(this, this.onInputConfirm);

        this.btnReturn = new UIButton(this.game, this.game.width / 2, this.game.height / 2 + 162, 'systemTexts', [ 'return_001.png', 'return_001_pre.png' ]);
        this.btnReturn.anchor.set(0.5);
        this.btnReturn.visible = false;
        this.btnReturn.addButtonUpEvent(this, this.onInputReturn);

        this.btnReconnect = new UIButton(this.game, this.game.width / 2, this.game.height / 2 + 162, 'systemTexts', [ 'btn_reconnect_normal.png', 'btn_reconnect_press.png' ]);
        this.btnReconnect.anchor.set(0.5);
        this.btnReconnect.visible = false;
        this.btnReconnect.addButtonUpEvent(this, this.onInputRefresh);

        // group
        this.visible = false;
        this.add(this.overlay);
        this.add(this.msgBoard);
        // this.add(this.msgTitle);
        this.add(this.textMsg);
        this.add(this.btnConfirm);
        this.add(this.btnReturn);
        this.add(this.btnReconnect);
    }

    show(bool) {
        this.overlay.show(bool);
        this.visible = bool;
    }

    showMessage(msg) {
        this.textMsg.text = msg;
    }

    showErrorMessage(msg, isMask, callbackCon, callbackFunc, callbackArg) {
        Sound.soundPlay('systemPopUp');

        this.btnConfirm.position.set(this.game.width / 2, this.game.height / 2 + 162);
        this.btnConfirm.visible = true;
        this.btnReconnect.visible = false;
        this.btnReturn.visible = false;

        this.textMsg.text = msg;
        this.show(isMask);
        if (callbackFunc) {
            this.inputConfirmFunc = callbackFunc;
            this.inputConfirmCon = callbackCon;
            this.inputConfirmArg = callbackArg;
        }
    }

    showErrorMessageWithRefresh(msg, isMask, callbackCon, callbackFunc = [], callbackArg = []) {
        Sound.soundPlay('systemPopUp');

        this.btnReconnect.position.set(this.game.width / 2 + 250, this.game.height / 2 + 162);
        this.btnReturn.position.set(this.game.width / 2 - 250, this.game.height / 2 + 162);
        this.btnConfirm.visible = false;
        this.btnReconnect.visible = true;
        this.btnReturn.visible = true;

        this.textMsg.text = msg;
        this.show(isMask);

        if (callbackFunc[0]) {
            this.inputRefreshFunc = callbackFunc[0];
            this.inputRefreshCon = callbackCon;
            this.inputRefreshArg = callbackArg[0];
        }
        if (callbackFunc[1]) {
            this.inputReturnFunc = callbackFunc[1];
            this.inputReturnCon = callbackCon;
            this.inputReturnArg = callbackArg[1];
        }
    }

    onInputConfirm() {
        Sound.soundPlay('btnActive');
        this.textMsg.text = '';
        this.btnConfirm.visible = false;
        this.btnReturn.visible = false;
        this.btnReconnect.visible = false;
        this.show(false);
        if (this.inputConfirmFunc) {
            this.inputConfirmFunc.call(this.inputConfirmCon, this.inputConfirmArg);
        }
    }

    onInputReturn() {
        Sound.soundPlay('btnActive');
        this.textMsg.text = '';
        this.btnConfirm.visible = false;
        this.btnReturn.visible = false;
        this.btnReconnect.visible = false;
        this.show(false);
        if (this.inputReturnFunc) {
            this.inputReturnFunc.call(this.inputReturnCon, this.inputReturnArg);
        }
    }

    onInputRefresh() {
        Sound.soundPlay('btnActive');
        this.textMsg.text = '';
        this.btnConfirm.visible = false;
        this.btnReturn.visible = false;
        this.btnReconnect.visible = false;
        this.show(false);
        if (this.inputRefreshFunc) {
            this.inputRefreshFunc.call(this.inputRefreshCon, this.inputRefreshArg);
        }
    }
}

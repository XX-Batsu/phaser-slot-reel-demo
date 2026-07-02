import GameBase from 'base/GameBase';
import GameEvent from 'game/events/GameEvent';
import UiActionEvent from 'game/events/UiActionEvent';
import CashoutEvent from 'game/events/system/CashoutEvent';
import ConfigPasser from 'base/ConfigPasser';
import Overlay from 'base/Overlay';
import UIButton from 'base/UIButton';
import Sound from 'base/Sound';
import GameInfo from 'game/model/GameInfo';
import Tool from 'base/Tool';
import GaStatesConfig from 'game/main/GaStatesConfig';
import LikeMoveIt from 'tools/LikeMoveIt';

export default class HelpView extends GameBase {
    constructor(game) {
        super(game);
        this.totalPages = ConfigPasser.instance.HELP_PAGE_NUM;
        this.currentPage = 1;
        this.objInitAni();
        this.flapPage(this.currentPage);

        this.addEventListener(UiActionEvent.ON_SHOW_HELP, this.openHelp, this);
        this.addEventListener(GameEvent.STATES, this.gameSlotStates, this);

        this.visible = false;
    }

    objInitAni() {
        const boardOverlay = new Overlay(this.game);
        boardOverlay.inputEnabled = true;
        this.add(boardOverlay);

        const settingBoard = new Phaser.Sprite(this.game, 840, 472, 'systemElements', 'UIOverlayBg.png');
        settingBoard.scale.set(8, 12);
        settingBoard.anchor.set(0.5);
        this.add(settingBoard);

        const settingTitleLine = new Phaser.Sprite(this.game, 840, 130, 'systemElements', 'title_line.png');
        settingTitleLine.anchor.set(0.5);
        this.add(settingTitleLine);
        const settingTitle = new Phaser.Sprite(this.game, 840, 87, 'helpTexts', 'instructionsttitle_001.png');
        settingTitle.anchor.set(0.5);
        this.add(settingTitle);

        const btnCloseHelp = new UIButton(this.game, 1538, 105, 'systemElements', [ 'btn_close_nor.png', 'btn_close_pre.png' ]);
        btnCloseHelp.anchor.set(0.5);
        btnCloseHelp.addButtonUpEvent(this, this.closeHelp);
        this.add(btnCloseHelp);

        this.helpPage = new Phaser.Sprite(this.game, 840, 500, 'HelpPage1');
        this.helpPage.anchor.set(0.5);
        this.add(this.helpPage);

        const btnArrowLeft = new UIButton(this.game, 130, 500, 'systemElements', [ 'btn_arrow_nor.png', 'btn_arrow_pres.png' ]);
        btnArrowLeft.scale.set(-1, 1);
        btnArrowLeft.anchor.set(0.5);
        btnArrowLeft.addButtonDownEvent(this, this.scrollUp);
        this.add(btnArrowLeft);
        const btnArrowRight = new UIButton(this.game, 1550, 500, 'systemElements', [ 'btn_arrow_nor.png', 'btn_arrow_pres.png' ]);
        btnArrowRight.anchor.set(0.5);
        btnArrowRight.addButtonDownEvent(this, this.scrollDown);
        this.add(btnArrowRight);
    }

    flapPage(page = 1) {
        this.helpPage.loadTexture(`HelpPage${page}`);
    }

    scrollUp() {
        Sound.soundPlay('btnBase');
        if (this.currentPage <= 1) {
            this.currentPage = this.totalPages;
            this.flapPage(this.currentPage);
            return;
        }
        this.currentPage--;
        this.flapPage(this.currentPage);
    }

    scrollDown() {
        Sound.soundPlay('btnBase');
        if (this.currentPage >= this.totalPages) {
            this.currentPage = 1;
            this.flapPage(this.currentPage);
            return;
        }
        this.currentPage++;
        this.flapPage(this.currentPage);
    }

    openHelp() {
        this.visible = true;
    }

    closeHelp() {
        Sound.soundPlay('btnNegative');
        this.visible = false;
        this.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_CLOSE_HELP));
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

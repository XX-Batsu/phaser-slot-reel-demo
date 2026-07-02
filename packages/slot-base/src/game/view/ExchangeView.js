import GameBase from 'base/GameBase';
import GameEvent from 'game/events/GameEvent';
import UiActionEvent from 'game/events/UiActionEvent';
import RefreshCurrencyEvent from 'game/events/system/RefreshCurrencyEvent';
import ExchangeCurrencyEvent from 'game/events/system/ExchangeCurrencyEvent';
import Overlay from 'base/Overlay';
import UIButton from 'base/UIButton';
import Sound from 'base/Sound';
import Tool from 'base/Tool';
import types from 'base/types';
import GameInfo from 'game/model/GameInfo';
import GaStatesConfig from 'game/main/GaStatesConfig';
import MessageEvent from 'game/events/MessageEvent';

export default class ExchangeView extends GameBase {
    constructor(game) {
        super(game);
        this.visible = false;
        this.hasCoveredByTip = false;
        this.currencyTypeAmountAry = [];
        this.currentSelection = 0;
        this.currentInput = '';

        this.coinScale = 0.6;

        this.objInitAni();

        this.addEventListener(UiActionEvent.ON_SHOW_EXCHANGE, this.openExchange, this);
        this.addEventListener(RefreshCurrencyEvent.ON_RESPONSE, this.updateCurrencyAmount, this);
        this.addEventListener(ExchangeCurrencyEvent.ON_RESPONSE, this.getExchange, this);
        this.addEventListener(MessageEvent.ON_SHOW_MESSAGE_TIP, this.onShowTip, this);
        this.addEventListener(MessageEvent.ON_CLOSE_MESSAGE_TIP, this.onCloseTip, this);
        this.addEventListener(GameEvent.STATES, this.gameSlotStates, this);
    }

    objInitAni() {
        const boardOverlay = new Overlay(this.game);
        boardOverlay.inputEnabled = true;
        this.add(boardOverlay);

        const exchangeBoard = new Phaser.Sprite(this.game, 840, 472, 'systemElements', 'UIOverlayBg.png');
        exchangeBoard.scale.set(8, 12);
        exchangeBoard.anchor.set(0.5);
        this.add(exchangeBoard);
        const exchangeTitleLine = new Phaser.Sprite(this.game, 840, 130, 'systemElements', 'title_line.png');
        exchangeTitleLine.anchor.set(0.5);
        this.add(exchangeTitleLine);
        const exchangeTitle = new Phaser.Sprite(this.game, 840, 87, 'exchangeTexts', 'transfertitle_001.png');
        exchangeTitle.anchor.set(0.5);
        this.add(exchangeTitle);

        const iconCoin = new Phaser.Sprite(this.game, 261, 253, 'exchangeTexts', 'system_icon_currency_coin.png');
        iconCoin.anchor.set(0.5);
        iconCoin.scale.set(this.coinScale);
        this.add(iconCoin);
        const coinStyleInfo = { font: '36px Arial Bold', fill: '#ffe6d0', align: 'center' };
        const coinAmountText = this.game.add.text(536, 255, 0, coinStyleInfo);
        coinAmountText.anchor.set(1, 0.5);
        this.add(coinAmountText);
        this.currencyTypeAmountAry.push(coinAmountText);

        const iconUlgCoin = new Phaser.Sprite(this.game, 616, 253, 'exchangeTexts', 'system_icon_currency_ulgcoin.png');
        iconUlgCoin.anchor.set(0.5);
        iconUlgCoin.scale.set(this.coinScale);
        this.add(iconUlgCoin);
        const ulgCoinStyleInfo = { font: '36px Arial Bold', fill: '#ffe6d0', align: 'center' };
        const ulgCoinAmountText = this.game.add.text(891, 253, 0, ulgCoinStyleInfo);
        ulgCoinAmountText.anchor.set(1, 0.5);
        this.add(ulgCoinAmountText);
        this.currencyTypeAmountAry.push(ulgCoinAmountText);

        const iconBonus = new Phaser.Sprite(this.game, 261, 369, 'exchangeTexts', 'system_icon_currency_bonus.png');
        iconBonus.anchor.set(0.5);
        iconBonus.scale.set(this.coinScale);
        this.add(iconBonus);
        const bonusStyleInfo = { font: '36px Arial Bold', fill: '#ffe6d0', align: 'center' };
        const bonusAmountText = this.game.add.text(536, 371, 0, bonusStyleInfo);
        bonusAmountText.anchor.set(1, 0.5);
        this.add(bonusAmountText);
        this.currencyTypeAmountAry.push(bonusAmountText);

        const iconCoupon = new Phaser.Sprite(this.game, 616, 369, 'exchangeTexts', 'system_icon_currency_coupon.png');
        iconCoupon.anchor.set(0.5);
        iconCoupon.scale.set(this.coinScale);
        this.add(iconCoupon);
        const couponStyleInfo = { font: '36px Arial Bold', fill: '#ffe6d0', align: 'center' };
        const couponAmountText = this.game.add.text(891, 371, 0, couponStyleInfo);
        couponAmountText.anchor.set(1, 0.5);
        this.add(couponAmountText);
        this.currencyTypeAmountAry.push(couponAmountText);

        const playerCrditBg = new Phaser.Sprite(this.game, 580, 652, 'exchangeElements', 'transfertitle_bg.png');
        playerCrditBg.anchor.set(0.5);
        this.add(playerCrditBg);
        const iconGameCredit = new Phaser.Sprite(this.game, 430, 652, 'exchangeElements', 'currency_005.png');
        iconGameCredit.anchor.set(0.5);
        this.add(iconGameCredit);

        const textInputAmountBg = new Phaser.Sprite(this.game, 580, 564, 'exchangeElements', 'transfertitle_bg.png');
        textInputAmountBg.anchor.set(0.5);
        this.add(textInputAmountBg);
        this.textInputAmount = new Phaser.Sprite(this.game, 500, 547, 'exchangeTexts', 'transfertitle_text_05.png');
        this.add(this.textInputAmount);
        const inputAmountStyleInfo = { font: '36px Arial Regular', fill: '#ffe6d0', align: 'center' };
        this.inputAmountText = this.game.add.text(699, 568, `${this.currentInput}`, inputAmountStyleInfo);
        this.inputAmountText.anchor.set(1, 0.5);
        this.add(this.inputAmountText);

        const textCurrencyType = new Phaser.Sprite(this.game, 229, 454, 'exchangeTexts', 'transfertitle_text_01.png');
        this.add(textCurrencyType);

        const textAmount = new Phaser.Sprite(this.game, 228, 544, 'exchangeTexts', 'transfertitle_text_02.png');
        this.add(textAmount);

        const textPlayerCredit = new Phaser.Sprite(this.game, 229, 630, 'exchangeTexts', 'transfertitle_text_03.png');
        this.add(textPlayerCredit);
        const playerCreditStyleInfo = { font: '36px Arial Regular', fill: '#ffe6d0', align: 'center' };
        this.playerCreditText = this.game.add.text(699, 656, 0, playerCreditStyleInfo);
        this.playerCreditText.anchor.set(1, 0.5);
        this.add(this.playerCreditText);

        const numKey1 = this.generateNumKey(1060, 303, 1);
        numKey1.anchor.set(0.5);
        this.add(numKey1);
        const numKey2 = this.generateNumKey(1229, 303, 2);
        numKey2.anchor.set(0.5);
        this.add(numKey2);
        const numKey3 = this.generateNumKey(1397, 303, 3);
        numKey3.anchor.set(0.5);
        this.add(numKey3);
        const numKey4 = this.generateNumKey(1060, 426, 4);
        numKey4.anchor.set(0.5);
        this.add(numKey4);
        const numKey5 = this.generateNumKey(1229, 426, 5);
        numKey5.anchor.set(0.5);
        this.add(numKey5);
        const numKey6 = this.generateNumKey(1397, 426, 6);
        numKey6.anchor.set(0.5);
        this.add(numKey6);
        const numKey7 = this.generateNumKey(1060, 549, 7);
        numKey7.anchor.set(0.5);
        this.add(numKey7);
        const numKey8 = this.generateNumKey(1229, 549, 8);
        numKey8.anchor.set(0.5);
        this.add(numKey8);
        const numKey9 = this.generateNumKey(1397, 549, 9);
        numKey9.anchor.set(0.5);
        this.add(numKey9);
        const numKey0 = this.generateNumKey(1060, 672, 0);
        numKey0.anchor.set(0.5);
        this.add(numKey0);

        const backSpaceKey = new UIButton(this.game, 1175, 625, 'exchangeTexts', [ 'transferbox_btn_count010_nor.png', 'transferbox_btn_count010_pre.png' ]);
        backSpaceKey.addButtonUpEvent(this, this.onKeyDown, 'backSpace');
        this.add(backSpaceKey);
        const clearKey = new UIButton(this.game, 1000, 737, 'exchangeTexts', [ 'transferbox_btn_count011_nor.png', 'transferbox_btn_count011_pre.png' ]);
        clearKey.addButtonUpEvent(this, this.onKeyDown, 'clear');
        this.add(clearKey);

        const btnRefresh = new UIButton(this.game, 766, 472, 'exchangeTexts', [ 'transferbox_btn_update.png', 'transferbox_btn_update_pre.png' ]);
        btnRefresh.addButtonUpEvent(this, this.sendRefresh);
        this.add(btnRefresh);

        const btnExchangeConfirm = new UIButton(this.game, 790, 790, 'systemTexts', [ 'confirm_001.png', 'confirm_001_pre.png' ]);
        btnExchangeConfirm.anchor.set(0.5);
        btnExchangeConfirm.addButtonUpEvent(this, this.sendExchange);
        this.add(btnExchangeConfirm);
        const btnExchangeReturn = new UIButton(this.game, 380, 790, 'systemTexts', [ 'return_001.png', 'return_001_pre.png' ]);
        btnExchangeReturn.anchor.set(0.5);
        btnExchangeReturn.addButtonUpEvent(this, this.returnBtn);
        this.add(btnExchangeReturn);

        this.extendCurrencyGroup = new Phaser.Group(this.game);
        this.extendCurrencyGroup.position.set(552, 541);
        this.add(this.extendCurrencyGroup);

        const selectionTouchArea = new Phaser.Graphics(this.game, 395, 451);
        selectionTouchArea.beginFill(0xff11ff);
        selectionTouchArea.drawRect(0, 0, 308, 50);
        selectionTouchArea.endFill();
        selectionTouchArea.alpha = 0;
        selectionTouchArea.inputEnabled = true;
        selectionTouchArea.input.useHandCursor = true;
        selectionTouchArea.events.onInputUp.add(this.switchCurrencyList, this);
        this.add(selectionTouchArea);
        const currentSelectionCurrencyTypeBg = new Phaser.Sprite(this.game, 580, 475, 'exchangeElements', 'transfertitle_bg.png');
        currentSelectionCurrencyTypeBg.anchor.set(0.5);
        this.add(currentSelectionCurrencyTypeBg);
        this.currentSelectionCurrencyType = new Phaser.Sprite(this.game, 566, 474, 'exchangeTexts', `text_exchange_currency_sort_${this.currentSelection}.png`);
        this.currentSelectionCurrencyType.anchor.set(0.5);
        this.add(this.currentSelectionCurrencyType);
        this.switchCurrencyType(0);

        const btnExtendCurrencyType = new UIButton(this.game, 714, 476, 'exchangeElements', [ 'currency_bt_nor.png', 'currency_bt_pre.png' ]);
        btnExtendCurrencyType.anchor.set(0.5);
        btnExtendCurrencyType.addButtonUpEvent(this, this.switchCurrencyList);
        this.add(btnExtendCurrencyType);

        this.userName = this.game.add.text(this.game.width / 2, 139, '', { font: '30px Arial', fill: '#FFFFFF', align: types.align.CENTER });
        this.add(this.userName);
        this.userName.anchor.x = 0.5;

        this.exchangeOverlay = new Overlay(this.game);
        this.exchangeOverlay.inputEnabled = true;
        this.exchangeOverlay.visible = false;
        this.add(this.exchangeOverlay);
    }

    generateNumKey(x = 0, y = 0, num = 0) {
        const numKey = new UIButton(this.game, x, y, 'exchangeElements', [ `transferbox_btn_count00${num}_nor.png`, `transferbox_btn_count00${num}_pre.png` ]);
        // numKey.addSubTexture(-3, -5, 'exchangeElements', [ `system_num_${num}_up.png`, `system_num_${num}_down.png` ]);
        numKey.addButtonUpEvent(this, this.onKeyDown, num);
        return numKey;
    }

    generateCurrencyList() {
        const bgTouchArea = new Phaser.Graphics(this.game, -this.extendCurrencyGroup.x, -this.extendCurrencyGroup.y);
        bgTouchArea.beginFill(0xff11ff);
        bgTouchArea.drawRect(0, 0, this.game.width, this.game.height);
        bgTouchArea.endFill();
        bgTouchArea.alpha = 0;
        bgTouchArea.inputEnabled = true;
        bgTouchArea.input.useHandCursor = true;
        bgTouchArea.events.onInputUp.add(this.collapseCurrencyList, this);
        this.extendCurrencyGroup.add(bgTouchArea);

        GameInfo.exchangeData.forEach((currencyData, inx) => {
            const selectBar = new Phaser.Sprite(this.game, 10, inx * 70, 'exchangeElements', 'transfertitle_bg.png');
            selectBar.anchor.set(0.5);
            selectBar.scale.set(1, 1.25);
            this.extendCurrencyGroup.add(selectBar);

            const currencyIcon = new Phaser.Sprite(this.game, -120, inx * 70, 'exchangeTexts', `system_icon_currency_${currencyData.type}.png`);
            currencyIcon.anchor.set(0.5);
            currencyIcon.scale.set(this.coinScale);
            this.extendCurrencyGroup.add(currencyIcon);
            const currencyText = new Phaser.Sprite(this.game, 15, inx * 70, 'exchangeTexts', `text_exchange_currency_sort_${inx}.png`);
            currencyText.anchor.set(0.5);
            this.extendCurrencyGroup.add(currencyText);

            const currencyTouchArea = new Phaser.Graphics(this.game, -152, -33);
            currencyTouchArea.beginFill(0xff11ff);
            currencyTouchArea.drawRect(0, inx * 70, 308, 71);
            currencyTouchArea.endFill();
            currencyTouchArea.alpha = 0;
            currencyTouchArea.inputEnabled = true;
            currencyTouchArea.input.useHandCursor = true;
            currencyTouchArea.optionIndex = inx;
            currencyTouchArea.events.onInputUp.add(this.selectCurrencyType, this);
            this.extendCurrencyGroup.add(currencyTouchArea);
        }, this);

        this.extendCurrencyGroup.visible = false;
    }

    onKeyDown(input) {
        const key = input.toString();
        switch (key) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                Sound.soundPlay('btnCalculator');
                this.currentInput += key;
                break;
            case '0':
                Sound.soundPlay('btnCalculator');
                if (this.currentInput[0] === '0' || !this.currentInput[0]) {
                    this.clearInput();
                    return;
                }
                this.currentInput += key;
                break;
            case 'backSpace':
                Sound.soundPlay('btnCalculator');
                this.currentInput = this.currentInput.slice(0, this.currentInput.length - 1);
                if (this.currentInput === '') {
                    this.clearInput();
                    return;
                }
                break;
            case 'clear':
                Sound.soundPlay('btnClear');
                this.clearInput();
                return;
            default:
        }
        const numCurrentInput = Number(this.currentInput);
        const currentCurrencyTypeAmount = GameInfo.exchangeData[this.currentSelection].amount;
        if (currentCurrencyTypeAmount <= 0) {
            this.clearInput();
            return;
        }
        const currencyRate = GameInfo.exchangeData[this.currentSelection].rate;
        this.textInputAmount.visible = false;
        if (numCurrentInput > currentCurrencyTypeAmount) {
            this.inputAmountText.text = Tool.numberWithCommas(currentCurrencyTypeAmount);
            this.currentInput = currentCurrencyTypeAmount.toString();
            this.updatePlayerCredit({ gameCredit: Math.floor(currentCurrencyTypeAmount * currencyRate) });
            return;
        }
        this.updatePlayerCredit({ gameCredit: Math.floor(numCurrentInput * currencyRate) });
        this.inputAmountText.text = Tool.numberWithCommas(this.currentInput);
    }

    clearInput() {
        this.currentInput = '';
        this.inputAmountText.text = '';
        this.updatePlayerCredit({ gameCredit: '' });
        this.textInputAmount.visible = true;
    }

    switchCurrencyList() {
        Sound.soundPlay('btnBase');
        this.clearInput();
        this.extendCurrencyGroup.visible = !this.extendCurrencyGroup.visible;
    }

    collapseCurrencyList() {
        this.extendCurrencyGroup.visible = false;
    }

    selectCurrencyType(target) {
        Sound.soundPlay('btnBase');
        this.collapseCurrencyList();
        this.switchCurrencyType(target.optionIndex);
    }

    switchCurrencyType(inx) {
        this.inputAmountText.text = '';
        this.currentSelection = inx;
        this.currentSelectionCurrencyType.loadTexture('exchangeTexts', `text_exchange_currency_sort_${inx}.png`);
    }

    sendRefresh() {
        Sound.soundPlay('btnBase');
        this.clearInput();
        this.exchangeOverlay.visible = true;
        this.onDispatchEvent(new RefreshCurrencyEvent(RefreshCurrencyEvent.ON_REQUEST));
    }

    sendExchange() {
        Sound.soundPlay('btnConfirm');
        const amount = Number(this.currentInput);
        if (!GameInfo.exchangeData[this.currentSelection] || amount <= 0) {
            return;
        }
        this.exchangeOverlay.visible = true;
        const exchangeEvent = new ExchangeCurrencyEvent(ExchangeCurrencyEvent.ON_REQUEST);
        exchangeEvent.type = Number(GameInfo.exchangeData[this.currentSelection].typeID);
        exchangeEvent.amount = amount;
        this.onDispatchEvent(exchangeEvent);
    }

    getExchange(data) {
        this.exchangeOverlay.visible = false;
        this.updatePlayerCredit(data);
        Sound.soundPlay('btnConfirm');
        this.closeBoard();
    }

    updatePlayerCredit(data) {
        this.playerCreditText.text = Tool.numberWithCommas(data.gameCredit);
    }

    updateCurrencyAmount() {
        this.exchangeOverlay.visible = false;
        GameInfo.exchangeData.forEach((currencyData, inx) => {
            this.currencyTypeAmountAry[inx].text = Tool.numberWithCommas(currencyData.amount);
        }, this);
    }

    returnBtn() {
        this.closeBoardBtn();
    }

    closeBoardBtn() {
        Sound.soundPlay('btnNegative');
        this.closeBoard();
    }

    closeBoard() {
        this.clearInput();
        this.visible = false;
        this.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_CLOSE_EXCHANGE));
    }

    openExchange() {
        this.updateCurrencyAmount();
        this.generateCurrencyList();
        this.visible = true;
    }

    onShowTip() {
        this.hasCoveredByTip = (this.visible && this.exchangeOverlay.visible);
        this.exchangeOverlay.visible = false;
    }

    onCloseTip() {
        if (this.hasCoveredByTip) {
            this.clearInput();
            this.hasCoveredByTip = false;
        }
    }

    /**
     * 按鈕層狀態機顯示與控制(需要自定義)
     * @param {string} evt  evt
     */
    gameSlotStates(evt) {
        switch (evt.statesType) {
            case GaStatesConfig.gameinit: {
                this.userName.text = GameInfo.userName;
                break;
            }
            default:
        }
    }

}

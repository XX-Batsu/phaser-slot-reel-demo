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
import MessageEvent from 'game/events/MessageEvent';

export default class CashoutView extends GameBase {
    constructor(game) {
        super(game);
        this.leaveAfterConfirm = false;

        this.visible = false;
        this.currencyTypeAmountAry = [];

        this.coinScale = 0.6;

        this.objInitAni();

        this.addEventListener(UiActionEvent.ON_SHOW_CASHOUT, this.openCashout, this);
        this.addEventListener(UiActionEvent.ON_CASHOUT_THEN_LEAVE, this.cashOutThenLeave, this);
        this.addEventListener(CashoutEvent.ON_RESPONSE, this.getCashout, this);
        this.addEventListener(MessageEvent.ON_SHOW_MESSAGE_TIP, this.onShowTip, this);
        this.addEventListener(MessageEvent.ON_CLOSE_MESSAGE_TIP, this.onCloseTip, this);
        this.addEventListener(GameEvent.STATES, this.gameSlotStates, this);
    }

    objInitAni() {
        const boardOverlay = new Overlay(this.game);
        boardOverlay.inputEnabled = true;
        this.add(boardOverlay);

        this.boardGroup = new Phaser.Group(this.game);
        this.add(this.boardGroup);

        this.confirmMsgBoard = new Phaser.Sprite(this.game, 840, 472, 'systemElements', 'UIOverlayBg.png');
        this.confirmMsgBoard.scale.set(8, 12);
        this.confirmMsgBoard.anchor.set(0.5);
        this.boardGroup.add(this.confirmMsgBoard);

        const checkoutStyleInfo = { font: '48px Microsoft JhengHei', fill: '#ffffff', align: 'center' };
        const confirmCheckoutText = this.game.add.text(840, 400, ConfigPasser.instance.LANGUAGE_CONFIG.confirmCheckout, checkoutStyleInfo);
        confirmCheckoutText.anchor.set(0.5, 0.5);
        this.boardGroup.add(confirmCheckoutText);

        const btnCashoutConfirm = new UIButton(this.game, 1160, 700, 'systemTexts', [ 'confirm_001.png', 'confirm_001_pre.png' ]);
        btnCashoutConfirm.anchor.set(0.5);
        btnCashoutConfirm.addButtonUpEvent(this, this.sendCashout);
        this.boardGroup.add(btnCashoutConfirm);

        const btnCashoutCancel = new UIButton(this.game, 520, 700, 'systemTexts', [ 'return_001.png', 'return_001_pre.png' ]);
        btnCashoutCancel.anchor.set(0.5);
        btnCashoutCancel.addButtonUpEvent(this, this.cancelCashout);
        this.boardGroup.add(btnCashoutCancel);

        this.settleGroup = new Phaser.Group(this.game);
        this.add(this.settleGroup);

        this.cashoutResultBoard = new Phaser.Sprite(this.game, 840, 472, 'systemElements', 'UIOverlayBg.png');
        this.cashoutResultBoard.scale.set(8, 12);
        this.cashoutResultBoard.anchor.set(0.5);
        this.settleGroup.add(this.cashoutResultBoard);

        const cashoutTitleLine = new Phaser.Sprite(this.game, 840, 130, 'systemElements', 'title_line.png');
        cashoutTitleLine.anchor.set(0.5);
        this.settleGroup.add(cashoutTitleLine);
        const cashoutTitle = new Phaser.Sprite(this.game, 840, 87, 'cashoutTexts', 'settlementtitle_001.png');
        cashoutTitle.anchor.set(0.5);
        this.settleGroup.add(cashoutTitle);

        const iconCoin = new Phaser.Sprite(this.game, 310, 280, 'exchangeTexts', 'system_icon_currency_coin.png');
        iconCoin.anchor.set(0.5);
        iconCoin.scale.set(this.coinScale);
        this.settleGroup.add(iconCoin);
        const coinStyleInfo = { font: '48px Microsoft JhengHei', fill: '#ffffff', align: 'center' };
        const coinAmountText = this.game.add.text(730, 280, 0, coinStyleInfo);
        coinAmountText.anchor.set(1, 0.5);
        this.settleGroup.add(coinAmountText);
        this.currencyTypeAmountAry.push(coinAmountText);

        const iconUlgCoin = new Phaser.Sprite(this.game, 990, 280, 'exchangeTexts', 'system_icon_currency_ulgcoin.png');
        iconUlgCoin.anchor.set(0.5);
        iconUlgCoin.scale.set(this.coinScale);
        this.settleGroup.add(iconUlgCoin);
        const ulgCoinAmountText = this.game.add.text(1360, 280, 0, coinStyleInfo);
        ulgCoinAmountText.anchor.set(1, 0.5);
        this.settleGroup.add(ulgCoinAmountText);
        this.currencyTypeAmountAry.push(ulgCoinAmountText);

        const iconBonus = new Phaser.Sprite(this.game, 310, 480, 'exchangeTexts', 'system_icon_currency_bonus.png');
        iconBonus.anchor.set(0.5);
        iconBonus.scale.set(this.coinScale);
        this.settleGroup.add(iconBonus);
        const bonusAmountText = this.game.add.text(730, 480, 0, coinStyleInfo);
        bonusAmountText.anchor.set(1, 0.5);
        this.settleGroup.add(bonusAmountText);
        this.currencyTypeAmountAry.push(bonusAmountText);

        const iconCoupon = new Phaser.Sprite(this.game, 990, 480, 'exchangeTexts', 'system_icon_currency_coupon.png');
        iconCoupon.anchor.set(0.5);
        iconCoupon.scale.set(this.coinScale);
        this.settleGroup.add(iconCoupon);
        const couponAmountText = this.game.add.text(1360, 480, 0, coinStyleInfo);
        couponAmountText.anchor.set(1, 0.5);
        this.settleGroup.add(couponAmountText);
        this.currencyTypeAmountAry.push(couponAmountText);

        const btnResultConfirm = new UIButton(this.game, 840, 700, 'systemTexts', [ 'confirm_001.png', 'confirm_001_pre.png' ]);
        btnResultConfirm.anchor.set(0.5);
        btnResultConfirm.addButtonUpEvent(this, this.sendResultConfirm);
        this.settleGroup.add(btnResultConfirm);

        this.cashoutOverlay = new Overlay(this.game);
        this.cashoutOverlay.inputEnabled = true;
        this.cashoutOverlay.visible = false;
        this.add(this.cashoutOverlay);
    }

    sendCashout() {
        this.cashoutOverlay.visible = true;
        Sound.soundPlay('btnConfirm');
        this.onDispatchEvent(new CashoutEvent(CashoutEvent.ON_REQUEST));
    }

    getCashout(data) {
        data.cashoutCurrencyAry.forEach((cashoutData) => {
            GameInfo.exchangeData.some((currnecyData, inx) => {
                if (currnecyData.type === cashoutData.type) {
                    this.currencyTypeAmountAry[inx].text = Tool.numberWithCommas(cashoutData.amount);
                    return true;
                }
                return false;
            }, this);
        }, this);
        Sound.soundPlay('cashout');
        this.boardGroup.visible = false;
        this.settleGroup.visible = true;
        this.cashoutOverlay.visible = false;
    }

    openCashout() {
        this.settleGroup.visible = false;
        this.boardGroup.visible = true;
        this.visible = true;
    }

    cashOutThenLeave() {
        this.leaveAfterConfirm = true;
        this.openCashout();
    }

    sendResultConfirm() {
        Sound.soundPlay('btnBase');
        this.visible = false;
        this.settleGroup.visible = false;
        if (!this.leaveAfterConfirm) {
            this.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_CLOSE_CASHOUT));
            return;
        }
        window.location.href = GameInfo.gameReturnUrl;
    }

    cancelCashout() {
        Sound.soundPlay('btnNegative');
        this.leaveAfterConfirm = false;
        this.visible = false;
        this.boardGroup.visible = false;
        this.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_CLOSE_CASHOUT));
    }

    onShowTip() {
        this.hasCoveredByTip = (this.visible && this.cashoutOverlay.visible);
        this.cashoutOverlay.visible = false;
    }

    onCloseTip() {
        if (this.hasCoveredByTip) {
            this.hasCoveredByTip = false;
        }
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

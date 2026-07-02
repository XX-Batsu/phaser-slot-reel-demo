import { GameBase, Sound, ConfigTools, SlotGame, LikeMoveIt, RunScore } from 'slot-base';
import Config from 'js/main/Config';
import FreeTriggerEffectSignal from 'js/signal/freegame/FreeTriggerEffectSignal';
import BonusGamePlaySignal from 'js/signal/bonusgame/BonusGamePlaySignal';

export default class TextView extends SlotGame.CommonView.BaseTextView {
    constructor(game) {
        super(game);
        this.visible = true;
        this.alpha = 1;

        const textfixedY = 17;
        const linefixedY = 17;
        const numfixedY = 12;

        this.creditText.y += textfixedY;
        this.creditLine.y += linefixedY;
        this.credit.y += numfixedY;
        this.totalBetText.y += textfixedY;
        this.totalBetLine.y += linefixedY;
        this.totalBet.y += numfixedY;
        this.winScoreText.y += textfixedY;
        this.winTextLine.y += linefixedY;
        this.winScore.y += numfixedY;

        this.textBg.loadTexture('CBW_Bar');
        this.textBg.anchor.set(0.5, 1);
        this.add(this.textBg);

        // this.addEventListener(SlotGame.CommonSignal.WinScoreSignal.ON_WIN_SCORE, this.onWinScore, this);
        // this.addEventListener(SlotGame.GameEvent.STATES, this.gameSlotStates, this);
        // this.addEventListener(FreeTriggerEffectSignal.ON_FREE_TRIGGER_EFFECT, this.onEnterFreeGameEffect, this);
        // this.addEventListener(BonusGamePlaySignal.ON_PLAY_BONUS_GAME_SIGNAL, this.playResultBonus, this);
    }

    // onWinScore() {
    //     SlotGame.CommonSignal.WinScoreSignal.callBack();
    // }

    // 已收到Bonus Game封包可以進行遊戲 [基本]
    // playResultBonus(data) {}

    // onEnterFreeGameEffect() {
    //     FreeTriggerEffectSignal.callBack();
    // }

    /**
     * 更新 free game 次數文字
     * @param  {Object} data free game 次數資料
     */
    // onTextFreeUpdate(data) {
    //     // data.freeCount
    // }

    /**
     * 狀態機切換
     * @param  {Object} evt 狀態機夾帶資料
     */
    // gameSlotStates(evt) {
    //     switch (evt.statesType) {
    //         case SlotGame.GaStatesConfig.gameSpin:
    //             break;
    //         case SlotGame.GaStatesConfig.gameWin:
    //             break;
    //         // 取分
    //         case SlotGame.GaStatesConfig.gameTakeWin:
    //             break;
    //         default:
    //     }
    // }
}

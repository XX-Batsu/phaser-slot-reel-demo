import { GameBase, Overlay, RunScore, Sound, SlotGame, LikeMoveIt } from 'slot-base';

import Config from 'js/main/Config';
import FreeConfig from 'js/main/FreeConfig';
// Free Game
import FreeGameTriggerSignal from 'js/signal/freegame/FreeGameTriggerSignal';
import FreeCompleteSignal from 'js/signal/freegame/FreeCompleteSignal';
import FreeGameClearSignal from 'js/signal/freegame/FreeGameClearSignal';
import FreeGameReTriggerSignal from 'js/signal/freegame/FreeGameReTriggerSignal';
import FreeTriggerEffectSignal from 'js/signal/freegame/FreeTriggerEffectSignal';

export default class FreeGameView extends GameBase {
    constructor(game) {
        super(game);
        // 是否開啟Trigger畫面
        this.triggerBool = false;
        // 鍵盤案件事件專用 (trigger)
        this.triggerOpen = false;
        // 鍵盤案件事件專用 (結算畫面)
        this.congratsOpen = false;
        // 場次次數圖片的紋理Key
        this.remainingKey = 'num_red';
        // 場次次數座標對位
        this.countPosX = 775;
        this.countPosY = 162;

        // overlay 遮罩
        this.OverlayBox = new Overlay(this.game, {
            settings: [ 0, 0, this.game.world.width, this.game.world.height ],
            alpha: 0.8,
            color: 0x000000
        });
        this.add(this.OverlayBox);
        this.OverlayBox.show(false);
        // 介面層
        this.uiGroup = new Phaser.Group(this.game);
        this.add(this.uiGroup);

        // 基本流程事件註冊區
        this.addEventListener(SlotGame.UiActionEvent.ON_CLOSE_FREE_TRIGGER, this.onKeyBoardEvent, this);
        this.addEventListener(SlotGame.UiActionEvent.ON_CLOSE_FREE_CONGRATS, this.onKeyBoardEvent, this);
        this.addEventListener(FreeGameTriggerSignal.ON_SHOW_FREE_TRIGGER, this.onFreeGameTrigger, this);
        this.addEventListener(FreeGameReTriggerSignal.ON_RETRIGGER_COUNT, this.onFreeGameRetrigger, this);
        this.addEventListener(FreeCompleteSignal.ON_FREE_COMPLETE, this.overFreeGameIdle, this);
        this.addEventListener(FreeGameClearSignal.ON_FREE_CLEAR_SIGNAL, this.onClearFreeGame, this);
        this.addEventListener(FreeTriggerEffectSignal.ON_FREE_TRIGGER_EFFECT, this.onEnterFreeGameEffect, this);
        // 特色事件註冊區
    }

    // 鍵盤關閉 進場畫面
    onKeyBoardEvent() {
        if (FreeGameTriggerSignal.isCallEvent && (this.triggerBg !== undefined || this.triggerBg !== null) && this.triggerOpen) {
            this.closeFreeGameTrigger();
        }

        if (FreeCompleteSignal.isCallEvent && this.congratsOpen) {
            this.callCongratsItem();
        }
    }

    // 轉場動畫 (Trigger前)
    onEnterFreeGameEffect() {
        FreeTriggerEffectSignal.callBack();
    }

    // Free Game 進場顯示場次次數畫面
    onFreeGameTrigger(data) {
        this.triggerOpen = true;
        // 播放觸發音效
        Sound.bgVolume = 1;
        // 播放FreeGame背景音效
        Sound.playBg(1, true);
        // 創建 Trigger 畫面
        if (this.triggerBg === undefined || this.triggerBg === null) {
            // 特色 : 提示背景底圖
            // this.tipBg = new Phaser.Sprite(this.game, 0, 0, 'freeTipBg');
            // this.uiGroup.add(this.tipBg);
            // this.tipBg.scale.set(2);
            // free game 進場圖
            this.triggerBg = new Phaser.Sprite(this.game, FreeConfig.TIP_BG_X, FreeConfig.TIP_BG_Y, '');
            this.uiGroup.add(this.triggerBg);
            // free game 獲得場次
            this.triggerCount = new RunScore(this.game, this.remainingKey);
            this.triggerCount.position.set(this.countPosX, this.countPosY);
            this.triggerCount.showNum(data.count);
            this.triggerBg.addChild(this.triggerCount);
            // 遮罩
            this.OverlayBox.show(true);
            this.OverlayBox.inputEnabled = true;
            this.OverlayBox.events.onInputDown.addOnce(() => {
                this.closeFreeGameTrigger();
            });
            // return;
        }
        // 重新顯示 Trigger 畫面
        this.OverlayBox.events.onInputDown.addOnce(() => {
            this.closeFreeGameTrigger();
        });
        this.OverlayBox.show(true);
        this.triggerBg.visible = true;
        this.triggerCount.showNum(data.count);
    }

    // 關閉進場畫面
    closeFreeGameTrigger() {
        // 關閉遮罩
        this.triggerOpen = false;
        this.OverlayBox.events.onInputDown.removeAll();
        this.OverlayBox.show(false);    // 過場
        this.triggerBg.visible = false;
        // 清除 Trigger 畫面
        this.uiGroup.removeAll(true);
        this.triggerBg = null;
        // 額外特色註冊區

        // 通知主流程 Free Game Trigger行為已結束
        FreeGameTriggerSignal.callBack();
    }

    // FreeGame中 再次中F (scatter) 顯示額外獲得免費次數
    onFreeGameRetrigger(data) {
        // 判斷Free Spin 次數 大於0 為還有次數需要顯示
        if (data.count === 0) {
            FreeGameReTriggerSignal.callBack();
            return;
        }
        // 背景音樂變小聲
        Sound.bgVolume = 0.2;
        // 創建 Re Trigger 畫面
        if (this.reTriggerBg === undefined || this.reTriggerBg === null) {
            // 特色 : 提示背景底圖
            // this.tipBg = new Phaser.Sprite(this.game, 0, 0, 'freeTipBg');
            // this.uiGroup.add(this.tipBg);
            // this.tipBg.scale.set(2);

            // retrigger 提示圖
            this.reTriggerBg = new Phaser.Sprite(this.game, FreeConfig.TIP_BG_X, FreeConfig.TIP_BG_Y, 'slot_fg_transition');
            this.uiGroup.add(this.reTriggerBg);

            // free game 獲得場次
            this.reTriggerCount = new RunScore(this.game, this.remainingKey);
            this.reTriggerCount.position.set(this.countPosX, this.countPosY);
            this.reTriggerCount.showNum(data.count);
            this.reTriggerBg.addChild(this.reTriggerCount);

            // 播放觸發音效
            Sound.playFreeStep();
            this.OverlayBox.show(true);
        }

        // 設定顯示幾秒後關閉ReTrigger畫面
        this.game.time.events.add(Phaser.Timer.SECOND * FreeConfig.FREE_COMPLETE_SEC, () => {
            this.closeFreeGameRetrigger();
        });
    }

    // 關閉 retrigger 提示
    closeFreeGameRetrigger() {
        // 關閉遮罩
        this.OverlayBox.events.onInputDown.removeAll();
        this.OverlayBox.show(false);    // 過場
        // 清除 ReTrigger 畫面
        this.uiGroup.removeAll(true);
        this.reTriggerBg = null;
        // 清除 特色 : 提示背景底圖
        // this.uiGroup.remove(this.tipBg);
        // this.tipBg = null;
        // 停止觸發 free game 音效
        Sound.stopFreeStep();
        // 恢復背景音樂聲音
        Sound.bgVolume = 1;
        // 播放ReTirgger音效 (依照遊戲特色去設定在剛觸發ReTrigger時播放 還是結束後播放)
        // Sound.playFeature('Retrigger');

        // 通知主流程 Free Game ReTrigger 行為已結束
        FreeGameReTriggerSignal.callBack();
    }

    // 觸發FreeGame結算畫面
    overFreeGameIdle(data) {
        // 判斷此次結算有無分數 沒有分數直接顯示 免費遊戲結束
        const completeImg = (data.TotalCompleteScore === 0) ? 'slot_fg_complete' : 'slot_fg_congrats';
        const textTotalScoreNotExist = (this.textTotalScore === undefined || this.textTotalScore === null);

        // 特色 : 提示背景底圖
        // this.tipBg = new Phaser.Sprite(this.game, 0, 0, 'freeTipBg');
        // this.uiGroup.add(this.tipBg);
        // this.tipBg.scale.set(2);

        // 創建結算畫面
        if (this.congrats === undefined || this.congrats === null) {
            this.congrats = new Phaser.Sprite(this.game, FreeConfig.TIP_BG_X, FreeConfig.TIP_BG_Y, completeImg);
            this.uiGroup.add(this.congrats);
        }
        // 顯示結算畫面
        this.congrats.visible = true;
        // 恢復背景音樂聲音
        Sound.bgVolume = 0.2;
        // 得分不為0時，創建結算畫面的總分數
        if (data.TotalCompleteScore !== 0 && textTotalScoreNotExist) {
            this.textTotalScore = new RunScore(this.game, this.remainingKey);
            this.textTotalScore.x = this.congrats.width * 0.5;
            this.textTotalScore.y = this.congrats.height * 1.2;
            this.congrats.addChild(this.textTotalScore);
            // 設定總分數
            this.textTotalScore.showNum(data.TotalCompleteScore);
        }
        // 開啟背景遮罩
        this.OverlayBox.show(true);
        this.OverlayBox.inputEnabled = true;
        // 開啟可觸發關閉結算畫面功能
        this.congratsOpen = true;
        this.callCongratsItem(true);
        // 播放結算畫面音效
        Sound.playFreeIdle();
    }

    /**
     * 結算畫面
     * @param {Boolean} congrats 是否開啟
     */
    callCongratsItem(congrats = false) {
        // 結算畫面離開預設值為 0 : 自動離開
        let autoOutBool = true;
        let inputOutBool = false;
        // 結算畫面離開模式 0 : 自動離開 , 1 : 手動按下 , 2 : 兩者皆可(目前預設0)
        switch (Config.IS_FREE_CONGRATS_MODE) {
            case 1:
                autoOutBool = false;    // 關閉自動離開
                inputOutBool = true;    // 可以手動按下離開
                break;
            case 2:
                inputOutBool = true;    // 可以手動按下離開
                break;
            default:
        }

        if (congrats) {
            // 自動離開
            if (autoOutBool) {
                this.congratsTimer = this.game.time.events.add(Phaser.Timer.SECOND * FreeConfig.FREE_COMPLETE_SEC, () => {
                    this.closeCongrats();
                });
            }
            // 畫面按下事件
            if (inputOutBool) {
                // 按鈕事件
                this.OverlayBox.events.onInputDown.addOnce(() => {
                    this.closeCongrats();
                });
            }
            return;
        }
        // 鍵盤事件
        if (inputOutBool) {
            this.closeCongrats();
        }
    }

    // 關閉結算畫面
    closeCongrats() {
        // 防呆 避免從"各種方向路線觸發此函數"
        if (!this.congratsOpen) { return; }
        // 此函數只能進行一次關閉結算畫面 避免動畫特效在跑一次
        this.congratsOpen = false;
        // 結算畫面移除Auto離開時間事件
        if (this.congratsTimer) {
            this.game.time.events.remove(this.congratsTimer);
        }
        // 清除背景遮罩與註冊的按下事件
        this.OverlayBox.events.onInputDown.removeAll();
        this.OverlayBox.show(false);    // 過場
        // 隱藏畫面
        this.congrats.visible = false;
        // 清除 uiGroup 物件畫面
        this.uiGroup.removeAll(true);
        this.congrats = null;
        this.textTotalScore = null;
        // 清除 特色 : 提示背景底圖
        // this.uiGroup.remove(this.tipBg);
        // this.tipBg = null;

        // 清除額外特色註冊區

        // 事件回調事件
        FreeCompleteSignal.callBack();
    }

    // 清除FreeGame模式
    onClearFreeGame() {
        // 還原設定
        this.triggerBool = false;
        // 回調事件
        FreeGameClearSignal.callBack();
        // 停止Free Game 背景音效
        Sound.stopBg();
        // 停止Free Game 結算音效
        Sound.stopFreeIdle();
        // 播放Base Game 背景音效
        Sound.playBg();
        // 此款遊戲特色 清除註冊區
    }
}

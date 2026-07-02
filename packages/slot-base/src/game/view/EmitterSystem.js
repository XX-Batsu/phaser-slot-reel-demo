
// --- base ---
import GameBase from 'base/GameBase';
import Overlay from 'base/Overlay';
import Sound from 'base/Sound';
import ConfigPasser from 'base/ConfigPasser';
import RunScore from 'base/RunScore';

// --- game ---
// event
import GameEvent from 'game/events/GameEvent';
import UiActionEvent from 'game/events/UiActionEvent';
// main
import GaStatesConfig from 'game/main/GaStatesConfig';
import GatherEmitter from 'game/view/particle/GatherEmitter';

// big win signal
import BigWinSignal from 'game/signal/bigwin/BigWinSignal';

export default class EmitterSystem extends GameBase {
    constructor(game) {
        super(game);

        const pageWidth = ConfigPasser.GAME_WIDTH || 1680;
        const pageHeight = ConfigPasser.GAME_HEIGHT || 944;
        const centerX = pageWidth / 2;
        const centerY = pageHeight / 2;

        // 遮色按鈕
        this.Overlay = new Overlay(this.game, {
            settings: [ 0, 0, pageWidth, pageHeight ],
            alpha: ConfigPasser.instance.AWARD_OVERLAY_ALPHA,
            color: ConfigPasser.instance.AWARD_OVERLAY_COLOR
        });
        this.add(this.Overlay);
        this.Overlay.show(false);
        this.Overlay.inputEnabled = true;
        // Biw Win 急停
        this.Overlay.events.onInputDown.add(() => {
            this.bigWinScore.immediatelyRunEnd();
        });

        // bg 跑分動畫的背景
        this.bgGroup = new Phaser.Group(game, this);
        this.bgGroup.visible = false;
        this.add(this.bgGroup);
        if (ConfigPasser.instance.AWARD_BG_SHOW) {
            const isPng = (this.game.cache.getFrameByName('main', 'img_scoring_bg.png'));
            this.bg = (isPng) ? new Phaser.Sprite(game, centerX, centerY, 'main', 'img_scoring_bg.png')
                              : new Phaser.Sprite(game, centerX, centerY, 'bigwin_bg');
            this.bg.width = pageWidth;
            this.bg.height = pageHeight;
            this.bg.anchor.set(0.5);
            this.bg.scale.set(ConfigPasser.instance.AWARD_BG_SCALE);
            this.bgGroup.add(this.bg);
        }

        // 左右噴發粒子
        this.leftEmtter = new GatherEmitter(game, -50);
        this.leftEmtter.setXSpeed(300, 500);
        this.add(this.leftEmtter);
        this.rightEmtter = new GatherEmitter(game, 1970);
        this.rightEmtter.setXSpeed(-300, -500);
        this.add(this.rightEmtter);

        // big win 動畫
        // 跑分動畫的背景
        this.textGroup = new Phaser.Group(game, this);
        this.textGroup.visible = false;
        this.add(this.textGroup);
        // 光效果
        this.lightBg = new Phaser.Sprite(game, 0, 0, 'bigwin_effect_bg');
        this.lightBg.scale.set(4);
        this.lightBg.animations.add('light');
        this.lightFront = new Phaser.Sprite(game, 0, 0, 'bigwin_effect_front');
        this.lightFront.scale.set(4);
        this.lightFront.animations.add('light');

        this.topText = new Phaser.Sprite(game, centerX, -500, 'bigwin', 'img_bigwin_big.png');
        this.topText.anchor.set(0.5, 1);
        this.bottomText = new Phaser.Sprite(game, centerX, 1080, 'bigwin', 'img_bigwin_win.png');
        this.bottomText.anchor.set(0.5, 0);

        this.textGroup.add(this.lightBg);
        this.textGroup.add(this.topText);
        this.textGroup.add(this.bottomText);
        this.textGroup.add(this.lightFront);

        // bigwin tween
        this.bigwinTl = new TimelineMax({
            paused: true,
            onStart: () => {
                this.lightFront.animations.play('light', 20, false);
            }
        });
        const scaleAry = [ this.topText.scale, this.bottomText.scale ];
        this.bigwinTl
            .to(this.topText, 0.2, { y: centerY - 160, delay: 0.2 }, 'effect')
            .to(this.bottomText, 0.2, { y: centerY - 160, delay: 0.2 }, 'effect')
            .to(scaleAry, 0.1, { x: 1.2 })
            .to(scaleAry, 0.05, { x: 0.8 })
            .to(scaleAry, 0.1, { x: 1.1 })
            .to(scaleAry, 0.05, { x: 1 });

        // 跑分動畫
        this.bigWinScore = new RunScore(this.game, 'num_bigwin', -8);
        this.bigWinScore.position.set(centerX, centerY);
        this.bigWinScore.setStepFun(this.onScoreStepCallEvent, this);
        this.bigWinScore.onComplete.add(this.onBigWinCompltete, this);
        this.bigWinScore.ignoreChildInput = true;
        this.add(this.bigWinScore);

        this.stepObj = {
            0: { key: 'big', scale: 1 },
            1: { key: 'big', scale: 1 },
            2: { key: 'super', scale: 1.1 },
            3: { key: 'mega', scale: 1.2 }
        };

        // 註冊控制器發布事件
        this.addEventListener(GameEvent.STATES, this.gameSlotStates, this);
        this.addEventListener(UiActionEvent.ON_BIGWIN_STOP, this.onKeyBoardEvent, this);
        // 註冊BigWin動畫
        this.addEventListener(BigWinSignal.ON_BIGWIN_SIGNAL, this.onBigwin, this);
    }

    /**
     * 觸發 bigwin
     * @param  {Object} data BigWinSignal 資料
     */
    onBigwin(data) {
        let timer = setTimeout(() => {
            this.data = data;
            // 大獎分數階段判斷
            const stepRatio = [];
            for (let i = 0; i < ConfigPasser.instance.STEP_RATIO.length; i++) {
                stepRatio.push(data.getTotalBet * ConfigPasser.instance.STEP_RATIO[i] | 0);
            }
            this.bigWinScore.setStepData(stepRatio, true);

            this.bigWinScore.runScoreTime(0, data.score, data.sec);
            // 還原 win score 位置
            this.bigWinScore.y = 760 + ConfigPasser.instance.AWARD_SCORE_Y_OFFSET;
            // 開啟第一階段BigWin背景
            this.awardAnimation(0);

            this.lightBg.animations.play('light', 15, true);
            // 開啟遮色按鈕
            this.Overlay.show(true);
            // 大獎音效播放
            // Sound.playAwardBg();
            // Sound.playAwardCount();
            // 大獎背景顯示
            this.bgGroup.visible = true;
            Sound.bgVolume = 0;

            // 噴發粒子
            this.leftEmtter.startEmitter();
            this.rightEmtter.startEmitter();

            // 開關有開 背景閃爍
            if (ConfigPasser.instance.AWARD_BG_SHOW && ConfigPasser.instance.AWARD_BG_TWEEN) {
                this.bgTl = new TimelineLite()
                .fromTo(this.bgGroup, 0.4, {
                    alpha: 1
                }, {
                    alpha: 0.6,
                    onComplete: () => {
                        this.bgTl.restart();
                    }
                });
            }

            clearTimeout(timer);
            timer = null;
        }, 700);
    }

    onKeyBoardEvent() {
        if (BigWinSignal.isCallEvent) {
            // 馬戲團特色
            if (this.floatTween) {
                this.floatTween.kill();
                this.textGroup.y = 0;
            }
            this.bigWinScore.immediatelyRunEnd();
        }
    }

    /**
     * big win跑分階段 callback 1
     * @param  {Number} step 第幾階段
     */
    onScoreStepCallEvent(step) {
        this.awardAnimation(step);
    }

    /**
     * big win 階段產生背景圖與播放音效 2
     * @param  {Number} step 第幾階段
     */
    awardAnimation(step) {
        Sound.playAwardEmttier();

        // 因為 bigwin 一觸發就會跑出來
        // 到達地一個倍數要觸發的時候仍然是 big win 所以不動作
        if (step === 1) {
            return;
        }

        // 取得當前等級的 key
        const keyName = this.stepObj[step].key;

        // 縮放時分數位移微調
        this.bigWinScore.y += ConfigPasser.instance.AWARD_STEP_OFFSET;
        // 音效
        Sound.playBigWin(keyName);
        // Bigwin文字換圖
        this.textGroup.visible = true;
        this.topText.loadTexture('bigwin', `img_bigwin_${keyName}.png`);
        this.bottomText.scale.set(this.stepObj[step].scale);
        this.bigwinTl.restart();
    }

    // Big Win跑分動畫結束
    onBigWinCompltete() {
        this.bigWinSignalComplete();
    }

    // 完成BigWin動畫事件 [BIGWIN END]
    bigWinSignalComplete() {
        if (BigWinSignal.isCallEvent) {
            this.quickStopRunScore();
            // ary 索引從 0 開始，soundStep 是 2 3 4 所以減 1
            const awardObj = this.stepObj[this.data.soundStep - 1];
            const key = awardObj.key;
            this.topText.loadTexture('bigwin', `img_bigwin_${key}.png`);
            this.bottomText.scale.set(awardObj.scale);
            this.bigwinTl.progress(1);
            Sound.playBigWin(key);
        }
    }

    // delay 關閉 bigWin所有動畫 [BIGWIN END 2]
    quickStopRunScore() {
        this.timer = setTimeout(() => {
            this.clearEffect();
            clearTimeout(this.timer);
            this.timer = null;
            BigWinSignal.callBack();
            Sound.stopWinStep();
        }, 1000);
    }

    // 清除效果
    clearEffect() {
        // 清除遮罩
        this.Overlay.show(false);
        // 清除Big Win背景
        this.textGroup.visible = false;
        // 清除Big Win跑分數字
        this.bigWinScore.clearNumber(true);
        // 清除左右噴發粒子
        this.leftEmtter.stopEmitter();
        this.rightEmtter.stopEmitter();
        // 停止背景動畫
        this.lightBg.animations.stop('light');
        // 停止噴光動畫
        this.lightFront.animations.stop('light');
        // 停止贏分音效
        // Sound.stopAwardBg();
        // 停止跑分音效
        // Sound.stopAwardCount();
        // 恢復 bg 聲音
        Sound.bgVolume = 1;
        // 隱藏大背景圖
        this.bgGroup.visible = false;
        // 回復 win 文字的縮放
        this.bottomText.scale.set(1);
        // 停止 bg 動畫
        if (ConfigPasser.instance.AWARD_BG_TWEEN && this.bgTl !== undefined) {
            this.bgTl.kill();
        }
    }

    // 控制器發佈令命
    gameSlotStates(evt) {
        switch (evt.statesType) {
            // 啟動
            case GaStatesConfig.gameSpin:
                // 如果之前有上一局殘留分數延時顯示時,把它關掉 因為已經進入到下一局了
                if (this.timer !== undefined && this.timer !== null) {
                    this.clearEffect();
                    clearTimeout(this.timer);
                    this.timer = null;
                }
                break;
            default:
        }
    }
}

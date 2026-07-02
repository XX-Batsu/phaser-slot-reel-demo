import { GameBase, Sound, ConfigTools, SlotGame, Overlay, RunScore } from 'slot-base';
import Config from 'js/main/Config';
import ParticleCoin from 'js/view/particle/particleElements/ParticleCoin';

export default class BigWinView extends GameBase {
    constructor(game) {
        super(game);

        // 遮色按鈕
        this.Overlay = new Overlay(this.game, {
            settings: [ 0, 0, game.width, game.height ],
            alpha: Config.AWARD_OVERLAY_ALPHA,
            color: Config.AWARD_OVERLAY_COLOR,
            fadeTo: Config.AWARD_OVERLAY_ALPHA
        });
        this.add(this.Overlay);
        this.Overlay.show(false);
        this.Overlay.inputEnabled = true;
        // Biw Win 急停
        this.Overlay.events.onInputDown.add(() => {
            this.bigWinScore.immediatelyRunEnd();
        });

        this.light2 = new Phaser.Sprite(game, game.width / 2, game.height / 2, 'bigwinBgLight2');
        this.light2.scale.set(1.5);
        this.light2.anchor.set(0.5);
        this.light2.visible = false;
        this.add(this.light2);
        this.light1 = new Phaser.Sprite(game, game.width / 2, game.height / 2, 'bigwinBgLight1');
        this.light1.scale.set(1.5);
        this.light1.anchor.set(0.5);
        this.light1.visible = false;
        this.add(this.light1);
        this.light1Tween = new TimelineMax({ repeat: -1 });
        this.light2Tween = new TimelineMax({ repeat: -1 });
        this.lightAlphaTween = new TimelineLite();

        this.particleCoin = new Phaser.Particles.Arcade.Emitter(this.game, 840, -200);
        this.add(this.particleCoin);
        this.particleCoin.minParticleScale = 0.45;
        this.particleCoin.maxParticleScale = 0.5;
        this.particleCoin.gravity = 4000;
        this.particleCoin.particleClass = ParticleCoin;
        this.particleCoin.makeParticles();
        this.particleCoin.setYSpeed(-900, -500);
        this.particleCoin.setXSpeed(-800, 800);
        this.particleCoin.startEmitter = () => {
            this.particleCoin.start(false, 2000, 50, 0);
        };
        this.particleCoin.stopEmitter = () => {
            this.particleCoin.on = false;
            this.particleCoin.forEach((particle) => {
                particle.kill();
            });
        };

        this.particleAni = new Phaser.Sprite(game, game.width / 2, game.height / 2, 'clip_bigwin_particle', 'clip_particleEffect_1.png');
        this.particleAni.scale.set(1.5);
        this.particleAni.anchor.set(0.5);
        this.particleAni.visible = false;
        this.add(this.particleAni);
        const particleFrameAry = Phaser.Animation.generateFrameNames('clip_particleEffect_', 1, this.game.cache.getFrameCount('clip_bigwin_particle'), '.png');
        this.particleAni.animations.add('play', particleFrameAry);
        this.particleAni.animations.getAnimation('play').onComplete.add(() => {
            this.particleAni.visible = false;
        }, this);

        this.textBigObjAry = [ null, null, null, null, null, null ];
        this.textBigObjAry.forEach((ele, inx, ary) => {
            const space = inx > ary.length - 4 ? 66 : 0;
            const obj = new Phaser.Sprite(game, 360 + space + inx * 182, 310, `bigwinText_big_${inx + 1}`);
            obj.anchor.set(0.5);
            obj.visible = false;
            obj.bigWinTween = new TimelineMax();
            obj.originX = obj.x;
            obj.originY = obj.y;
            this.add(obj);

            const smokeAni = new Phaser.Sprite(game, obj.originX, obj.originY, 'clip_bigwin_smoke', 'clip_smokeEffect_1.png');
            smokeAni.anchor.set(0.5);
            smokeAni.scale.set(3);
            smokeAni.visible = false;
            this.add(smokeAni);
            const smokeFrameAry = Phaser.Animation.generateFrameNames('clip_smokeEffect_', 1, this.game.cache.getFrameCount('clip_bigwin_smoke'), '.png');
            smokeAni.animations.add('play', smokeFrameAry);
            smokeAni.animations.getAnimation('play').onComplete.add(() => {
                smokeAni.visible = false;
            }, this);
            obj.smokeAni = smokeAni;
            this.textBigObjAry[inx] = obj;
        }, this);

        this.textSuperObjAry = [ null, null, null, null, null, null, null, null ];
        this.textSuperObjAry.forEach((ele, inx, ary) => {
            const space = inx > ary.length - 4 ? 74 : 0;
            const obj = new Phaser.Sprite(game, 260 + space + inx * 160, 303, `bigwinText_super_${inx + 1}`);
            obj.anchor.set(0.5);
            obj.scale.set(1.05);
            obj.visible = false;
            obj.bigWinTween = new TimelineMax();
            obj.originX = obj.x;
            obj.originY = obj.y;
            this.add(obj);

            const smokeAni = new Phaser.Sprite(game, obj.originX, obj.originY, 'clip_bigwin_smoke', 'clip_smokeEffect_1.png');
            smokeAni.anchor.set(0.5);
            smokeAni.scale.set(3);
            smokeAni.visible = false;
            this.add(smokeAni);
            const smokeFrameAry = Phaser.Animation.generateFrameNames('clip_smokeEffect_', 1, this.game.cache.getFrameCount('clip_bigwin_smoke'), '.png');
            smokeAni.animations.add('play', smokeFrameAry);
            smokeAni.animations.getAnimation('play').onComplete.add(() => {
                smokeAni.visible = false;
            }, this);
            obj.smokeAni = smokeAni;
            this.textSuperObjAry[inx] = obj;
        }, this);

        this.textMegaObjAry = [ null, null, null, null, null, null, null ];
        this.textMegaObjAry.forEach((ele, inx, ary) => {
            const space = inx > ary.length - 4 ? 74 : 0;
            const obj = new Phaser.Sprite(game, 285 + space + inx * 180, 319, `bigwinText_mega_${inx + 1}`);
            obj.anchor.set(0.5);
            obj.scale.set(1.1);
            obj.visible = false;
            obj.bigWinTween = new TimelineMax();
            obj.originX = obj.x;
            obj.originY = obj.y;
            this.add(obj);

            const smokeAni = new Phaser.Sprite(game, obj.originX, obj.originY, 'clip_bigwin_smoke', 'clip_smokeEffect_1.png');
            smokeAni.anchor.set(0.5);
            smokeAni.scale.set(3);
            smokeAni.visible = false;
            this.add(smokeAni);
            const smokeFrameAry = Phaser.Animation.generateFrameNames('clip_smokeEffect_', 1, this.game.cache.getFrameCount('clip_bigwin_smoke'), '.png');
            smokeAni.animations.add('play', smokeFrameAry);
            smokeAni.animations.getAnimation('play').onComplete.add(() => {
                smokeAni.visible = false;
            }, this);
            obj.smokeAni = smokeAni;
            this.textMegaObjAry[inx] = obj;
        }, this);

        this.stepTextObjAryAry = [
            this.textBigObjAry,
            this.textSuperObjAry,
            this.textMegaObjAry
        ];

        this.currentStep = -1;

        // 跑分動畫
        this.bigWinScore = new RunScore(this.game, 'num_bigwin', 0);
        this.bigWinScore.position.set(game.width / 2, game.height / 2 + 25);
        this.bigWinScore.setStepData(Config.STEP_RATIO);
        this.bigWinScore.setStepFun(this.onScoreStepCallEvent, this);
        this.bigWinScore.onComplete.add(this.onBigWinCompltete, this);
        this.bigWinScore.ignoreChildInput = true;
        this.add(this.bigWinScore);

        this.addEventListener(SlotGame.CommonSignal.BigWinSignal.ON_BIGWIN_SIGNAL, this.onBigwin, this);
        this.addEventListener(SlotGame.UiActionEvent.ON_BIGWIN_STOP, this.onKeyBoardEvent, this);
        this.addEventListener(SlotGame.GameEvent.STATES, this.gameSlotStates, this);
    }

    onBigwin(data) {
        this.lightEffect(true);
        this.particleAni.visible = true;
        this.particleAni.animations.play('play', 24, false);
        this.textInAnimation(0);
        this.Overlay.show(true);
        this.Overlay.fade(true);
        this.particleCoin.startEmitter();
        // 大獎分數階段判斷
        const stepRatio = [];
        for (let i = 1; i < Config.STEP_RATIO.length; i++) {
            stepRatio.push(data.getTotalBet * Config.STEP_RATIO[i] | 0);
        }
        this.bigWinScore.setStepData(stepRatio, true);
        this.bigWinScore.alpha = 0;
        let fadeNumTween = new TimelineLite();
        fadeNumTween.to(this.bigWinScore, 0.6, {
            alpha: 1,
            onComplete: () => {
                fadeNumTween.clear();
                fadeNumTween = null;
            }
        });
        this.bigWinScore.runScoreTime(0, data.score, data.sec);
    }

    onScoreStepCallEvent(step) {
        this.textInAnimation(step);
    }

    textInAnimation(targetObjInx) {
        const currentObjAry = this.stepTextObjAryAry[this.currentStep];
        this.currentStep = targetObjInx;
        const targetObjAry = this.stepTextObjAryAry[targetObjInx];

        targetObjAry.forEach((obj) => {
            obj.alpha = 0;
            const targetPos = { x: obj.originX, y: obj.originY };
            obj.x = obj.originX;
            obj.y = -500;
            obj.visible = true;
            obj.angle = Math.random() * 40 - Math.random() * 80;
            obj.bigWinTween
            .to(obj, Math.random() * 3 / 10, {

            })
            .to(obj, 1, {
                ease: Bounce.easeOut,
                x: targetPos.x,
                y: targetPos.y,
                alpha: 1
            }, 'fall')
            .to(obj, 0.8, {
                ease: 'elastic.in(1.5, 0.2)',
                angle: 0
            }, 'fall')
            .to(obj, 0, {
                onStart: () => {
                    obj.smokeAni.visible = true;
                    obj.smokeAni.animations.play('play', 24, false);
                    this.game.camera.shake((4 + targetObjInx * 2) / 1000, 700, true, Phaser.Camera.SHAKE_BOTH);
                }
            }, '-=0.6');
        });

        if (currentObjAry) {
            currentObjAry.forEach((obj, inx, ary) => {
                const targetX = obj.x + (inx - ary.length / 2) * Math.random() * 300;
                const targetY = obj.y - Math.random() * 250;
                obj.bigWinTween.clear();
                obj.bigWinTween
                .to(obj, 1, {
                    ease: Power1.easeIn,
                    alpha: 0
                }, 'out')
                .to(obj, 0.7, {
                    ease: Power2.easeOut,
                    x: targetX,
                    y: targetY,
                    angle: Math.random() * 360 - Math.random() * 720
                }, '-=0.5');
            }, this);
        }
    }

    lightEffect(bool) {
        this.light1.visible = bool;
        this.light2.visible = bool;
        this.light1.alpha = 0;
        this.light2.alpha = 0;
        if (bool) {
            this.light1Tween
            .to(this.light1, 5, {
                ease: Power0.easeNone,
                angle: 600
            });
            this.light2Tween
            .to(this.light2, 5, {
                ease: Power0.easeNone,
                angle: -500
            });
            this.lightAlphaTween
            .to([ this.light1, this.light2 ], 3, {
                alpha: 1
            });
        }
        if (!bool) {
            this.light1Tween.clear();
            this.light2Tween.clear();
        }
    }

    // Big Win跑分動畫結束
    onBigWinCompltete() {
        this.bigWinSignalComplete();
    }

    // 完成BigWin動畫事件 [BIGWIN END]
    bigWinSignalComplete() {
        if (SlotGame.CommonSignal.BigWinSignal.isCallEvent) {
            this.quickStopRunScore();
        }
    }

    // delay 關閉 bigWin所有動畫 [BIGWIN END 2]
    quickStopRunScore() {
        this.timer = setTimeout(() => {
            this.clearEffect();
            clearTimeout(this.timer);
            this.timer = null;
            SlotGame.CommonSignal.BigWinSignal.callBack();
        }, 3000);
    }

    onKeyBoardEvent() {
        if (SlotGame.CommonSignal.BigWinSignal.isCallEvent) {
            this.bigWinScore.immediatelyRunEnd();
        }
    }

    // 清除效果
    clearEffect() {
        // 清除遮罩
        this.Overlay.show(false);
        // 清除Big Win跑分數字
        this.bigWinScore.clearNumber(true);
        this.lightEffect(false);
        this.particleCoin.stopEmitter();
        this.currentStep = -1;
        this.stepTextObjAryAry.forEach((ary) => {
            ary.forEach((obj) => {
                obj.visible = false;
                obj.bigWinTween.clear();
            });
        });
    }

    /**
     * 狀態機切換
     * @param  {Object} evt 狀態機夾帶資料
     */
    gameSlotStates(evt) {
        switch (evt.statesType) {
            case SlotGame.GaStatesConfig.gameSpin:
                break;
            case SlotGame.GaStatesConfig.gameWin:
                break;
            // 取分
            case SlotGame.GaStatesConfig.gameTakeWin:
                break;
            default:
        }
    }
}

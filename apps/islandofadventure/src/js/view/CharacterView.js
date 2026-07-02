import { GameBase, SlotGame } from 'slot-base';
import CustomEvent from 'js/events/CustomEvent';
import MoaiWinSignal from 'js/signal/MoaiWinSignal';

export default class CharacterView extends GameBase {
    constructor(game) {
        super(game);
        this.isSlowFocus = false;
        this.shouldPlayRespinAni = false;

        this.leftFps = 30;
        this.rightFps = 26;

        this.moaiLeft = new Phaser.Sprite(game, 195, 510, 'moaiLeftIdle', 'moai_l_idle_2.png');
        this.moaiLeft.scale.set(2);
        this.moaiLeft.anchor.set(0.5);
        this.add(this.moaiLeft);
        const leftIdleFrameAry = Phaser.Animation.generateFrameNames('moai_l_idle_', 2, this.game.cache.getFrameCount('moaiLeftIdle'), '.png');
        this.moaiLeft.animations.add('idle', leftIdleFrameAry);
        this.moaiLeft.loadTexture('moaiLeft1st', 'moai_l_hit_1stStart_1.png');
        const leftStartFrameAry = Phaser.Animation.generateFrameNames('moai_l_hit_1stStart_', 1, this.game.cache.getFrameCount('moaiLeft1st'), '.png');
        this.moaiLeft.animations.add('start', leftStartFrameAry);
        this.moaiLeft.animations.getAnimation('start').onComplete.add(() => {
            this.moaiLeft.loadTexture('moaiLeft2ndLoop', 'moai_l_hit_2ndLoop_1.png');
            this.moaiLeft.animations.play('2ndLoop', 27, true);
        }, this);
        const leftBackFrameAry = Phaser.Animation.generateFrameNames('moai_l_hit_1stStart_', 1, this.game.cache.getFrameCount('moaiLeft1st'), '.png').reverse();
        this.moaiLeft.animations.add('back', leftBackFrameAry);
        this.moaiLeft.animations.getAnimation('back').onComplete.add(() => {
            this.moaiLeft.loadTexture('moaiLeftIdle', 'moai_l_idle_2.png');
            this.moaiLeft.animations.play('idle', this.leftFps, true);
        }, this);
        this.moaiLeft.loadTexture('moaiLeft2ndLoop', 'moai_l_hit_2ndLoop_1.png');
        const left2ndLoopFrameAry = Phaser.Animation.generateFrameNames('moai_l_hit_2ndLoop_', 1, this.game.cache.getFrameCount('moaiLeft2ndLoop'), '.png');
        this.moaiLeft.animations.add('2ndLoop', left2ndLoopFrameAry);
        this.moaiLeft.loadTexture('moaiLeft3rdTurn', 'moai_l_hit_3rdTurn_1.png');
        const leftTurnFrameAry = Phaser.Animation.generateFrameNames('moai_l_hit_3rdTurn_', 1, this.game.cache.getFrameCount('moaiLeft3rdTurn'), '.png');
        this.moaiLeft.animations.add('turn', leftTurnFrameAry);
        this.moaiLeft.animations.getAnimation('turn').onComplete.add(() => {
            this.moaiLeft.loadTexture('moaiLeft4thLoop', 'moai_l_hit_4thLoop_1.png');
            this.moaiLeft.animations.play('4thLoop', this.leftFps, true);
        }, this);
        this.moaiLeft.loadTexture('moaiLeft4thLoop', 'moai_l_hit_4thLoop_1.png');
        const left4thLoopFrameAry = Phaser.Animation.generateFrameNames('moai_l_hit_4thLoop_', 1, this.game.cache.getFrameCount('moaiLeft4thLoop'), '.png');
        this.moaiLeft.animations.add('4thLoop', left4thLoopFrameAry);
        this.moaiLeft.loadTexture('moaiLeft5thEnd', 'moai_l_hit_5thEnd_1.png');
        const leftEndFrameAry = Phaser.Animation.generateFrameNames('moai_l_hit_5thEnd_', 1, this.game.cache.getFrameCount('moaiLeft5thEnd'), '.png');
        this.moaiLeft.animations.add('end', leftEndFrameAry);
        this.moaiLeft.animations.getAnimation('end').onComplete.add(() => {
            this.moaiLeft.loadTexture('moaiLeftIdle', 'moai_l_idle_2.png');
            this.moaiLeft.animations.play('idle', this.leftFps, true);
        }, this);
        this.moaiLeft.loadTexture('moaiLeftSpit', 'moai_l_spit_1.png');
        const leftSpitFrameAry = Phaser.Animation.generateFrameNames('moai_l_spit_', 1, this.game.cache.getFrameCount('moaiLeftSpit'), '.png');
        this.moaiLeft.animations.add('spit', leftSpitFrameAry);
        this.moaiLeft.loadTexture('moaiLeftSwallow', 'moai_l_swallow_1.png');
        const leftSwallowFrameAry = Phaser.Animation.generateFrameNames('moai_l_swallow_', 1, this.game.cache.getFrameCount('moaiLeftSwallow'), '.png');
        this.moaiLeft.animations.add('swallow', leftSwallowFrameAry);
        this.moaiLeft.animations.getAnimation('swallow').onComplete.add(() => {
            this.moaiLeft.loadTexture('moaiLeftIdle', 'moai_l_idle_2.png');
            this.moaiLeft.animations.play('idle', this.leftFps, true);
            this.spitSymbol();
        }, this);

        this.moaiRight = new Phaser.Sprite(game, 1498, 480, 'moaiRightIdle', 'moai_r_idle_2.png');
        this.moaiRight.scale.set(2);
        this.moaiRight.anchor.set(0.5);
        this.add(this.moaiRight);
        const rightIdleFrameAry = Phaser.Animation.generateFrameNames('moai_r_idle_', 2, this.game.cache.getFrameCount('moaiRightIdle'), '.png');
        this.moaiRight.animations.add('idle', rightIdleFrameAry);
        this.moaiRight.loadTexture('moaiRight1st', 'moai_r_hit_1stStart_1.png');
        const rightStartFrameAry = Phaser.Animation.generateFrameNames('moai_r_hit_1stStart_', 1, this.game.cache.getFrameCount('moaiRight1st'), '.png');
        this.moaiRight.animations.add('start', rightStartFrameAry);
        this.moaiRight.animations.getAnimation('start').onComplete.add(() => {
            this.moaiRight.loadTexture('moaiRight2ndLoop', 'moai_r_hit_2ndLoop_1.png');
            this.moaiRight.animations.play('2ndLoop', 24, true);
        }, this);
        const rightBackFrameAry = Phaser.Animation.generateFrameNames('moai_r_hit_1stStart_', 1, this.game.cache.getFrameCount('moaiRight1st'), '.png').reverse();
        this.moaiRight.animations.add('back', rightBackFrameAry);
        this.moaiRight.animations.getAnimation('back').onComplete.add(() => {
            this.moaiRight.loadTexture('moaiRightIdle', 'moai_r_idle_2.png');
            this.moaiRight.animations.play('idle', this.rightFps, true);
        }, this);
        this.moaiRight.loadTexture('moaiRight2ndLoop', 'moai_r_hit_2ndLoop_1.png');
        const right2ndLoopFrameAry = Phaser.Animation.generateFrameNames('moai_r_hit_2ndLoop_', 1, this.game.cache.getFrameCount('moaiRight2ndLoop'), '.png');
        this.moaiRight.animations.add('2ndLoop', right2ndLoopFrameAry);
        this.moaiRight.loadTexture('moaiRight3rdTurn', 'moai_r_hit_3rdTurn_1.png');
        const rightTurnFrameAry = Phaser.Animation.generateFrameNames('moai_r_hit_3rdTurn_', 1, this.game.cache.getFrameCount('moaiRight3rdTurn'), '.png');
        this.moaiRight.animations.add('turn', rightTurnFrameAry);
        this.moaiRight.animations.getAnimation('turn').onComplete.add(() => {
            this.moaiRight.loadTexture('moaiRight4thLoop', 'moai_r_hit_4thLoop_1.png');
            this.moaiRight.animations.play('4thLoop', this.rightFps, true);
        }, this);
        this.moaiRight.loadTexture('moaiRight4thLoop', 'moai_r_hit_4thLoop_1.png');
        const right4thLoopFrameAry = Phaser.Animation.generateFrameNames('moai_r_hit_4thLoop_', 1, this.game.cache.getFrameCount('moaiRight4thLoop'), '.png');
        this.moaiRight.animations.add('4thLoop', right4thLoopFrameAry);
        this.moaiRight.loadTexture('moaiRight5thEnd', 'moai_r_hit_5thEnd_1.png');
        const rightEndFrameAry = Phaser.Animation.generateFrameNames('moai_r_hit_5thEnd_', 1, this.game.cache.getFrameCount('moaiRight5thEnd'), '.png');
        this.moaiRight.animations.add('end', rightEndFrameAry);
        this.moaiRight.animations.getAnimation('end').onComplete.add(() => {
            this.moaiRight.loadTexture('moaiRightIdle', 'moai_r_idle_2.png');
            this.moaiRight.animations.play('idle', this.rightFps, true);
        }, this);
        this.moaiRight.loadTexture('moaiRightSpit', 'moai_r_spit_1.png');
        const rightSpitFrameAry = Phaser.Animation.generateFrameNames('moai_r_spit_', 1, this.game.cache.getFrameCount('moaiRightSpit'), '.png');
        this.moaiRight.animations.add('spit', rightSpitFrameAry);
        this.moaiRight.animations.getAnimation('spit').onComplete.add(() => {
            this.moaiRight.loadTexture('moaiRightIdle', 'moai_r_idle_2.png');
            this.moaiRight.animations.play('idle', this.rightFps, true);
            this.spitComplete();
        }, this);
        this.moaiRight.loadTexture('moaiRightSwallow', 'moai_r_swallow_1.png');
        const rightSwallowFrameAry = Phaser.Animation.generateFrameNames('moai_r_swallow_', 1, this.game.cache.getFrameCount('moaiRightSwallow'), '.png');
        this.moaiRight.animations.add('swallow', rightSwallowFrameAry);

        this.grassLeft = new Phaser.Sprite(this.game, -60, 756, 'bgGrassLeft');
        this.add(this.grassLeft);
        this.grassRight = new Phaser.Sprite(this.game, 1348, 693, 'bgGrassRight');
        this.add(this.grassRight);

        this.moaiLeft.loadTexture('moaiLeftIdle', 'moai_l_idle_2.png');
        this.moaiLeft.animations.play('idle', this.leftFps, true);
        this.moaiRight.loadTexture('moaiRightIdle', 'moai_r_idle_2.png');
        this.moaiRight.animations.play('idle', this.rightFps, true);

        this.addEventListener(SlotGame.ReelEvent.ON_SLOW_FOCUS, this.onSlowFocus, this);
        this.addEventListener(SlotGame.ReelEvent.ON_REELBAR_COMPLETE, this.onSlowFocusComplete, this);
        this.addEventListener(MoaiWinSignal.ON_MOAI_WIN, this.showMoaiAni, this);
        this.addEventListener(SlotGame.ReelEvent.ON_REELBAR_RECEIVE, this.onGetResultData, this);

        this.addEventListener(SlotGame.GameEvent.STATES, this.gameSlotStates, this);
    }

    onSlowFocus() {
        if (this.isSlowFocus) {
            return;
        }
        this.moaiLeft.loadTexture('moaiLeft1st', 'moai_l_hit_1stStart_1.png');
        this.moaiLeft.animations.play('start', 30, false);
        this.moaiRight.loadTexture('moaiRight1st', 'moai_r_hit_1stStart_1.png');
        this.moaiRight.animations.play('start', 24, false);

        this.isSlowFocus = true;
    }

    onSlowFocusComplete(data) {
        if (data.winType === 0) {
            if (this.isSlowFocus) {
                this.moaiLeft.loadTexture('moaiLeft1st', 'moai_l_hit_1stStart_10.png');
                this.moaiLeft.animations.play('back', 30, false);
                this.moaiRight.loadTexture('moaiRight1st', 'moai_r_hit_1stStart_10.png');
                this.moaiRight.animations.play('back', 24, false);
            }
            this.isSlowFocus = false;
            return;
        }
        this.moaiLeft.loadTexture('moaiLeft3rdTurn', 'moai_l_hit_3rdTurn_1.png');
        this.moaiLeft.animations.play('turn', 30, false);
        this.moaiRight.loadTexture('moaiRight3rdTurn', 'moai_r_hit_3rdTurn_1.png');
        this.moaiRight.animations.play('turn', 24, false);
        this.isSlowFocus = false;
    }

    onGetResultData(data) {
        if (data.extraData[1] !== null) {
            this.shouldPlayRespinAni = true;
        }
    }

    spitSymbol() {
        this.onDispatchEvent(new CustomEvent(CustomEvent.MOAI_SPIT));
        let delayTween = new TimelineLite();
        delayTween
        .to({}, 1, {
            onComplete: () => {
                this.moaiRight.loadTexture('moaiRightSpit', 'moai_r_spit_1.png');
                this.moaiRight.animations.play('spit', 30, false);
                delayTween.clear();
                delayTween = null;
            }
        });
    }

    spitComplete() {
        this.shouldPlayRespinAni = false;
    }

    showMoaiAni(data) {
        MoaiWinSignal.callBack();
    }

    /**
     * 狀態機切換
     * @param  {Object} evt 狀態機夾帶資料
     */
    gameSlotStates(evt) {
        switch (evt.statesType) {
            case SlotGame.GaStatesConfig.gameSpin:
                if (evt.isRespinPlay && this.shouldPlayRespinAni) {
                    this.onDispatchEvent(new CustomEvent(CustomEvent.MOAI_SWALLOW));
                    let delayTween = new TimelineLite();
                    delayTween
                    .to({}, 1.5, {
                        onComplete: () => {
                            this.moaiLeft.loadTexture('moaiLeftSwallow', 'moai_l_swallow_1.png');
                            this.moaiLeft.animations.play('swallow', 30, false);
                            delayTween.clear();
                            delayTween = null;
                        }
                    });
                }
                break;
            case SlotGame.GaStatesConfig.gameWin:
                break;
            case SlotGame.GaStatesConfig.gameIdle:
                this.isSlowFocus = false;
                break;
            case SlotGame.GaStatesConfig.gameTakeWin:
                this.moaiLeft.loadTexture('moaiLeft5thEnd', 'moai_l_hit_5thEnd_1.png');
                this.moaiLeft.animations.play('end', 30, false);
                this.moaiRight.loadTexture('moaiRight5thEnd', 'moai_r_hit_5thEnd_1.png');
                this.moaiRight.animations.play('end', 30, false);
                break;
            default:
        }
    }
}

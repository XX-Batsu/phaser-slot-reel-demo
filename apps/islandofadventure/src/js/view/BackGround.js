import { SlotGame, GameBase, Sound } from 'slot-base';
import Config from 'js/main/Config';

// background
import FreeGameChageBgSignal from 'js/signal/ui/background/FreeGameChageBgSignal';
import BaseGameChageBgSignal from 'js/signal/ui/background/BaseGameChageBgSignal';

export default class BackGround extends GameBase {
    constructor(game) {
        super(game);
        // BaseGame底圖
        this.baseBg = new Phaser.Sprite(game, 0, 0, 'bgBase');
        this.add(this.baseBg);
        // 設定轉場秒數
        this.duration = Config.TRANSITIONS_EFFECT_SEC;

        if (Config.IN_FREE_GAME) {
            // FreeGame底圖
            this.freeBg = new Phaser.Sprite(this.game, 0, 0, 'bgFree');
            this.freeBg.alpha = 0;
            this.add(this.freeBg);
        }

        this.leafLeft = new Phaser.Sprite(this.game, -64, -93, 'bgLeafLeft');
        this.add(this.leafLeft);
        this.leafRight = new Phaser.Sprite(this.game, 1313, -88, 'bgLeafRight');
        this.add(this.leafRight);

        this.grassA = new Phaser.Sprite(this.game, 8, 596, 'bgGrass');
        this.add(this.grassA);
        this.grassB = new Phaser.Sprite(this.game, 1216, 582, 'bgGrass');
        this.add(this.grassB);

        this.reelBg = new Phaser.Sprite(this.game, 123, 29, 'reelBaseBg');
        this.reelBg.scale.set(1.01);
        this.add(this.reelBg);
        this.reelBgTween = new TimelineMax();

        this.addEventListener(FreeGameChageBgSignal.ON_CHAGE_FREE_BG, this.onFreeBg, this);
        this.addEventListener(BaseGameChageBgSignal.ON_CHAGE_BASE_BG, this.onBaseBg, this);

        this.addEventListener(SlotGame.GameEvent.STATES, this.gameSlotStates, this);
    }

    // 控制器發佈令命
    gameSlotStates(evt) {
        switch (evt.statesType) {
            case SlotGame.GaStatesConfig.gameinit: {
                Sound.playFeature('bg');
                break;
            }
            // 啟動
            case SlotGame.GaStatesConfig.gameSpin: {
                break;
            }
            case SlotGame.GaStatesConfig.gameWin: {
                break;
            }
            case SlotGame.GaStatesConfig.gameTakeWin: {
                break;
            }
            default:
        }
    }

    // 進入FreeGame背景
    onFreeBg() {
        this.freeBg.visible = true;
        const bgTween = new TimelineLite({
            onComplete: () => {
                // 清除tween
                bgTween.kill();
                FreeGameChageBgSignal.callBack();
                this.createfreeBgEffect();
            }
        });
        bgTween
            .fromTo(this.baseBg, this.duration, { alpha: 1 }, { alpha: 0 }, 'enterFree')
            .fromTo(this.freeBg, this.duration, { alpha: 0 }, { alpha: 1 }, 'enterFree');
        this.reelBgTween
        .to(this.reelBg, 1, { alpha: 1, ease: Power1.easeIn });
    }

    // 創建FreeGame背景動畫
    createfreeBgEffect() {
    }

    // 清除FreeGame背景動畫
    clearFreeBgEffect() {
    }

    // 進入BaseGame背景
    onBaseBg() {
        const bgTween = new TimelineLite({
            onComplete: () => {
                bgTween.kill();
                // BaseGameChageBgSignal.callBack();
                this.freeBg.visible = false;
                this.clearFreeBgEffect();
            }
        });

        bgTween
            .fromTo(this.baseBg, this.duration, { alpha: 0 }, { alpha: 1 }, 'enterBase')
            .fromTo(this.freeBg, this.duration, { alpha: 1 }, { alpha: 0 }, 'enterBase');
    }
}

// overlay 可設定是否為 fade 進場 / 出場
/*
    // x, y, width, height, params
    this = new getMask({
        settings: [144, 116, 1236, 674],
        fadeFrom: 0,
        fadeTo: 1,
        fadeTime: 0.5
    });
 */
export default class Overlay extends Phaser.Graphics {
    constructor(game, opts = {}) {
        super(game, 0, 0);
        this.game = game;

        const defaultParams = {
            settings: [ 0, 0, game.world.width, game.world.height ],
            alpha: 0.8,
            fadeFrom: 0,
            fadeTo: 1,
            isFade: false,
            fadeTime: Phaser.Timer.HALF,
            color: 0x000000
        };

        // 可以代入預設參數
        if (opts) {
            Object.assign(this, defaultParams, opts);
        }

        this.beginFill(opts.color, opts.alpha);
        this.drawRect(
            this.settings[0],
            this.settings[1],
            this.settings[2],
            this.settings[3]
        );

        this.endFill();

        this.inputEnabled = false;
    }

    // 顯示隱藏
    show(bool) {
        this.visible = bool;

        // this.isFade === true 開啟 fade 模式
        if (this.isFade) {
            this.fade(bool);
        }
    }

    // ture 開啟 / false 關閉
    // this.game.add.tween(object).to(properties, duration, ease, autoStart, delay, repeat, yoyo);
    fade(bool) {
        const fadeFrom = (bool) ? this.fadeFrom : this.fadeTo;
        const fadeTo = (bool) ? this.fadeTo : this.fadeFrom;
        this.alpha = fadeFrom;
        // fade tween
        this.game.add.tween(this)
            .to({
                alpha: fadeTo
            }, this.fadeTime, Phaser.Easing.Linear.None, true);
    }
}

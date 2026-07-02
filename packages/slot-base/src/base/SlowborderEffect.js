export default class SlowborderEffect extends Phaser.Group {
    /**
     * @param  {Object} game        Phaser Game
     * @param  {Number} symbolWidth 一軸的 symbol 寬度
     * @param  {Number} height      整個瞇牌要呈現的高度
     * @param  {Number} y           y 定位
     */
    constructor(game, x, y, symbolWidth, height) {
        super(game);
        this.initSlow(x, y, symbolWidth, height);
    }

    initSlow(x, y, symbolWidth, height) {
        this.clipKey = 'slowEffectSide';
        this.clipKeyName = 'slowEffectSide_';
        this.frameCount = this.game.cache.getFrameCount(this.clipKey);
        this.fps = 20;
        this.slowClip = this.makeSlow(x, y, symbolWidth, height);
        this.slowClip.visible = false;
    }

    set setFps(value) {
        this.fps = value;
    }

    /**
     * 播放粒子動畫
     * @param {Number} fps frame Rate
     */
    playSlowBorder(fps = this.fps) {
        this.slowClip.visible = true;
        this.slowClip.animations.play('slow', fps, true);
    }

    playAndLoop(fps = this.fps) {
        this.slowClip.visible = true;
        this.slowClip.animations.play('slow', fps, false);
        this.slowClip.animations.currentAnim.onComplete.addOnce(() => {
            this.slowClip.animations.play('loop', fps, true);
        });
    }

    setRepeatFrame(start, end) {
        const frameAry = Phaser.Animation.generateFrameNames(this.clipKeyName, start, end, '.png');
        this.slowClip.animations.add('loop', frameAry);
    }

    // 停止粒子動畫
    stopSlowBorder() {
        this.slowClip.visible = false;
        this.slowClip.animations.stop();
    }

    /**
     * 產生瞇牌粒子
     * @param  {Number} x           x 定位
     * @param  {Number} y           y 定位
     */
    makeSlow(x = 0, y = 0) {
        // 如果沒有序列圖在 cache 中
        const slowSprite = new Phaser.Sprite(this.game, x, y, this.clipKey);
        // 判斷是否為 png 序列圖
        // 若不是則自動轉成 jpg
        const frameAry = Phaser.Animation.generateFrameNames(this.clipKeyName, 1, this.frameCount, '.png');

        slowSprite.animations.add('slow', frameAry);
        this.add(slowSprite);
        return slowSprite;
    }

    /**
     * 產生瞇牌粒子
     * @param  {Number} symbolWidth 一軸的 symbol 寬度
     * @param  {Number} height      整個瞇牌要呈現的高度
     */
    setSize(symbolWidth, height) {
        this.slowClip.width = (symbolWidth) ? (symbolWidth - this.slowClip.width) / 2 | 0 : this.slowClip.x;
        this.slowClip.height = height;
    }

    /**
     * 產生粒子
     * @param  {Number} x    X軸
     * @param  {Number} y    Y軸
     */
    setPosition(x, y) {
        this.position.set(x, y);
    }

    /**
     * 隱藏瞇牌在畫面邊邊 不會使用 visible = false
     */
    hideSlow() {
        this.position.set(this.game.width + 200, this.game.height + 20);
    }
}

// 作為粒子噴發的元素

export default class ParticleCoin extends Phaser.Particle {
    constructor(game, x, y) {
        super(game, x, y, 'particleCoin');
        const frameCount = this.game.cache.getFrameCount('particleCoin');
        this.animations.add('particle', Phaser.Animation.generateFrameNames('coin_', 1, frameCount, '.png', 3));
    }

    onEmit() {
        const fps = 12 + Math.floor(Math.random() * 16);
        this.animations.getAnimation('particle').stop();
        this.animations.getAnimation('particle').play(fps, true);
        this.animations.getAnimation('particle').frame = Math.floor(Math.random() * this.animations.frameTotal);

        const rndScale = 0.45 + Math.floor(Math.random() * 30) / 100;
        let scaleTween = new TimelineLite();
        scaleTween
        .to(this.scale, 0.7,
            {
                ease: Power3.easeInOut,
                x: rndScale,
                y: rndScale,
                onComplete: () => {
                    scaleTween.clear();
                    scaleTween.progress(1).kill();
                    scaleTween = null;
                }
            }
        );
    }
}

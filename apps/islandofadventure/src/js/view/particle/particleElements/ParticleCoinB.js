// 作為粒子噴發的元素

export default class ParticleCoinB extends Phaser.Particle {
    constructor(game, x, y) {
        super(game, x, y, 'particleCoinB');
        const frameCount = this.game.cache.getFrameCount('particleCoinB');
        this.animations.add('particle', Phaser.Animation.generateFrameNames('coinB_', 1, frameCount, '.png', 3));
    }

    onEmit() {
        const fps = 12 + Math.floor(Math.random() * 16);
        this.animations.getAnimation('particle').stop();
        this.animations.getAnimation('particle').play(fps, true);
        this.animations.getAnimation('particle').frame = 11;

        const rndAngle = Math.floor(Math.random() * 360);
        let scaleTween = new TimelineLite();
        scaleTween
        .to(this, 0.7,
            {
                ease: Power3.easeInOut,
                angle: rndAngle,
                onComplete: () => {
                    scaleTween.clear();
                    scaleTween.progress(1).kill();
                    scaleTween = null;
                }
            }
        );
    }
}

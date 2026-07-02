// 作為粒子噴發的元素

export default class EmitterElement extends Phaser.Particle {
    constructor(game, x, y) {
        super(game, x, y, 'clip_emit_particle');
        const frameCount = this.game.cache.getFrameCount('clip_emit_particle');
        this.animations.add('particle', Phaser.Animation.generateFrameNames('clip_particle_', 1, frameCount, '.png'));
    }

    onEmit() {
        this.animations.getAnimation('particle').stop();
        this.animations.getAnimation('particle').play(15, true);
        this.animations.getAnimation('particle').frame = Math.floor(Math.random() * this.animations.frameTotal);
    }
}

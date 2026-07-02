import EmitterElement from 'game/view/particle/EmitterElement';

export default class GatherEmitter extends Phaser.Particles.Arcade.Emitter {
    /**
     * 粒子
     * @param  {Object} game Phaser.Game 物件
     * @param  {Number} x    粒子原點 x 座標
     */
    constructor(game, x) {
        super(game, x, 1000, 30);
        // 縮放最大最小
        this.minParticleScale = 0.5;
        this.maxParticleScale = 1;
        // 重力
        this.gravity = 1000;
        // particle 粒子圖案
        this.particleClass = EmitterElement;
        // 創造 particle
        this.makeParticles();
        // 設定 Y 軸最大最小值
        this.setYSpeed(-800, -1200);
    }

    // 開始噴發粒子 (explode, lifespan, frequency, quantity, forceQuantity)
    startEmitter() {
        this.start(false, 5000, 200, 0);
    }

    // 清除粒子
    stopEmitter() {
        this.on = false;
        this.forEach((particle) => {
            particle.kill();
        });
    }
}

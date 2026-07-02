import { GameBase } from 'slot-base';

export default class LogoView extends GameBase {
    constructor(game) {
        super(game);
        this.gameLogo = new Phaser.Sprite(game, 459, 75, 'baseLogo');
        this.gameLogo.scale.set(0.9);
        this.gameLogo.anchor.set(0.5);
        this.add(this.gameLogo);
    }
}

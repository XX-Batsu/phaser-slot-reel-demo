export default class ErrorStage extends Phaser.State {
    init(errMsg) {
        this.textMsg = this.game.add.text(this.game.world.width / 2, this.game.world.height / 2, errMsg, {
            font: 'bold 80px Arial',
            fill: '#fffacd',
            boundsAlignH: 'center',
            boundsAlignV: 'middle'
        });
        this.textMsg.anchor.set(0.5);
        this.textMsg.setShadow(2, 1, 'rgba(255,253,169,0.5)', 2);
        // 停止遊戲一切行為
        this.game.paused = true;

        const $spine = document.querySelector('#spine');
        if ($spine) {
            $spine.style.display = 'none';
        }
    }
}

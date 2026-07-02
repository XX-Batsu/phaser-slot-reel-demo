/**
 * 開發工具 - 快捷鍵
 */
export default class KeyCtlCenter {
    constructor(game) {
        // 單例
        KeyCtlCenter.instance = this;

        this.game = game;

        // 設定快捷鍵
        this.setPhaserKeys();
    }

    // 設定快捷鍵
    setPhaserKeys() {
        // PPAP
        this.keyZ = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);

        // LikeMoveIt
        this.keyM = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
        this.keyUp = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.keyDown = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.keyLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.keyRight = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.keyShift = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    }
}

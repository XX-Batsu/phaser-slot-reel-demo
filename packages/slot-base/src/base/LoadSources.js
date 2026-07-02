export default class LoadSources {
    constructor(game, nodeEnv) {
        const $html = document.querySelector('body');
        LoadSources.instance = this;
        this.game = game;
        this.tag = $html.querySelector('ver').getAttribute('tag-game');
        this.nodeEnv = nodeEnv;
    }

    // 單例模式
    static get instances() {
        if (this.instance === undefined) {
            this.instance = new LoadSources();
        }
        return this.instance;
    }

    static makePath(path) {
        return (this.instance.nodeEnv === 'develop') ? `src/${path}?${this.instances.tag}` : `${path}?${this.instances.tag}`;
    }

    static loadImage(key, path) {
        this.instances.game.load.image(key, this.makePath(path));
    }

    static loadAtlas(key, imgPath, path) {
        this.instances.game.load.atlasJSONHash(key, this.makePath(imgPath), this.makePath(path));
    }

    static loadBitmap(key, imgPath, path) {
        this.instances.game.load.bitmapFont(key, this.makePath(imgPath), this.makePath(path));
    }

    static loadAudio(key, path) {
        this.instances.game.load.audio(key, [ this.makePath(path) ], true);
    }

    static loadJson(key, path) {
        this.instances.game.load.json(key, this.makePath(path));
    }

    static loadBinary(key, path) {
        this.instances.game.load.binary(key, this.makePath(path));
    }
}

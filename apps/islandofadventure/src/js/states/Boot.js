import { LoadSources, GetProjectInfo, FullScreen, getCurLangID } from 'slot-base';
// 取得遊戲資訊
import Config from 'js/main/Config';

export default class Boot extends Phaser.State {
    init() {
        this.gameFolderName = GetProjectInfo.getPath();
    }

    preload() {
        this.game.scale.parentIsWindow = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.stage.scale.pageAlignHorizontally = true;
        this.game.stage.scale.pageAlignVertically = true;
        this.game.input.maxPointers = 1;
        this.game.stage.disableVisibilityChange = true;

        new LoadSources(this.game, process.env.NODE_ENV);
        LoadSources.loadJson('external', 'assets/configs/list.json');
        LoadSources.loadJson('ClientConfig', 'assets/ClientConfig.json');

        if (!this.game.device.desktop) {
            new FullScreen(this.game, getCurLangID(Config.LANGUAGE));
        }
    }

    create() {
        this.game.state.start('Preloader', false, false);
    }
}

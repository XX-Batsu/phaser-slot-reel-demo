import { GetProjectInfo, ErrorStage } from 'slot-base';
import Boot from 'js/states/Boot';
import Preloader from 'js/states/Preloader';
import MainStage from 'js/states/MainStage';

class Game extends Phaser.Game {
    constructor() {
        super(1680, 944, Phaser.AUTO, 'game', null, true, false);
        this.state.add('Boot', Boot);
        this.state.add('Preloader', Preloader);
        this.state.add('MainStage', MainStage);
        this.state.add('ErrorStage', ErrorStage);
        this.state.start('Boot', false, false, GetProjectInfo.getPath(process.env.NODE_ENV));
    }
}
new Game();

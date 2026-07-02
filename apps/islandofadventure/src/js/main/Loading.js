import { GetProjectInfo, getCurLangID } from 'slot-base';
// 取得遊戲資訊
import Config from 'js/main/Config';

class Loading {
    constructor() {
        this.$game = document.querySelector('#game');
        const size = [ 1680, 944 ];
        this.ratio = size[0] / size[1];

        this.GetProjectInfo = new GetProjectInfo();

        this.urlParams = GetProjectInfo.getUrlParams();
        // 取得語系，若網址上的語系不存在，則吃預設語系
        const languageID = getCurLangID(Config.LANGUAGE);
        // 背景圖
        this.$game.style.backgroundImage = `url(${GetProjectInfo.getPath(process.env.NODE_ENV)}/assets/images/common/lang/${languageID}/img_loading_ads.jpg?yolo)`;

        // 先觸發一次計算大小
        this.resize();
        // 綁定 resize 事件
        window.onresize = () => {
            this.resize();
        };
    }

    resize() {
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        let width = winW;
        let height = winW / this.ratio;

        if (winW / winH >= this.ratio) {
            width = winH * this.ratio;
            height = winH;
        }

        this.$game.style.width = `${width | 0}px`;
        this.$game.style.height = `${height | 0}px`;
    }
}
new Loading();

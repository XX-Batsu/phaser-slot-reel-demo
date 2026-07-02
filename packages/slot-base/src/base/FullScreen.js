import GetProjectInfo from './GetProjectInfo';

export default class FullScreen {
    constructor(game, lang = 'en') {
        this.game = game;
        this.$game = document.querySelector('#game');
        this.fullScreen = this.createTag(this.$game, 'fullscreen');
        this.landscape = this.createTag(this.fullScreen, 'landscape');
        this.fullScreenType = '';

        // 判斷父層是否為 iframe
        // 若為 iframe 或是 webview 則不顯示 fullscreen
        if (self !== top || (game.device.webApp && !game.device.firefox) || GetProjectInfo.getUrlParams().app === 'Y') {
            this.fullScreen.style.display = 'none';
        }

        if (this.isiPhoneX) {
            const viewport = document.querySelector('meta[name=viewport]');
            viewport.setAttribute(
                'content', 'width=device-width,height=device-height,initial-scale=0.5,maximum-scale=0.5,user-scalable=no,viewport-fit=cover'
            );
        }

        // 判斷 chrome
        game.device.chrome = !!navigator.userAgent.match('CriOS');

        // 產生語系的提示圖
        // 轉橫提示
        const path = (process.env.commonFile === undefined)
            ? `${GetProjectInfo.getPath(process.env.NODE_ENV)}/assets/images/common/main`
            : `${process.env.commonFile}/images`;

        this.setImgPath(lang, path);

        // 手機版直接預先判斷是否開啟轉橫提示
        this.toLandscape();
        this.showFullScreen();

        // 強制滿版
        this.$game.className += ' full-size';
        document.querySelector('body').className += 'mobile';

        this.bindEvent();
    }

    // 產生語系的提示圖
    setImgPath(lang, path) {
        // 轉橫提示
        this.landscape.style.backgroundImage = `url(${path}/gif/hori.gif)`;
        // 上滑圖片
        this.fullScreen.style.backgroundImage = this.game.device.android ? `url(${path}/gif/click.gif)` : `url(${path}/gif/slide.gif)`;
    }

    get isiPhoneX() {
        const ratio = window.devicePixelRatio || 1;

        const screen = {
            width: window.screen.width * ratio,
            height: window.screen.height * ratio
        };

        return (this.game.device.iOS && screen.width === 1125 && screen.height === 2436);
    }

    bindEvent() {
        this.game.scale.forceOrientation(true, false);
        this.game.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
        this.game.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);

        window.onresize = () => {
            this.onResize();
        };

        // ios - 滑出關閉
        if (this.game.device.iOS) {
            window.onscroll = () => {
                if (this.fullScreen.style.visibility === 'visible') {
                    this.onScrollEvent();
                }
            };

            return;
        }

        // android fullscreen
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.fullScreen.addEventListener('touchend', () => {
            this.launchFullScreen();
        }, false);
    }

    // resize event
    onResize() {
        this.toLandscape();

        const nowHeight = window.innerHeight;
        const trueHeight = document.documentElement.clientHeight;
        const noNeedToShow = (this.game.device.mobileSafari && !this.game.device.chrome && nowHeight === trueHeight && this.isLandscapeMode);

        if (this.fullScreen.style.visibility === 'hidden' && !noNeedToShow && this.fullScreenType === '') {
            this.showFullScreen();
        }
    }

    /**
     * 產生 div
     * @param {element} tag 要插入在誰的後面
     * @param {String} className id 與 class 名稱
     * @return {element} div 產生的 tag
     */
    createTag(tag, className) {
        const div = document.createElement('div');
        div.id = className;
        div.className = className;
        document.body.appendChild(div);

        tag.parentNode.insertBefore(div, tag.nextSibling);

        return div;
    }

    // 進入直向
    enterIncorrectOrientation() {
        // 開啟橫向提示
        this.landscape.style.display = 'block';
        this.hideFullScreen();

        if (this.game.device.android) {
            this.leaveFullscreen();
        }
    }

    // 進入橫向
    leaveIncorrectOrientation() {
        // 關閉橫向提示
        this.landscape.style.display = 'none';
        // 導覽列出現 (safari 轉橫會自動滿版)
        if (!this.game.device.iOS) {
            this.showFullScreen();
        }
    }

    // 一開始進入判斷 若為直的添加轉向圖片
    toLandscape() {
        if (this.isPortraitMode) {
            this.landscape.style.display = 'block';
        }
    }

    // 添加滑動圖片
    showFullScreen() {
        // 橫向才會開啟上滑圖片
        if (!this.isPortraitMode && !this.game.device.iPad) {
            this.fullScreen.style.visibility = 'visible';
            this.fullScreen.classList.remove('hidden');
            this.fullScreen.style.height = `${window.innerHeight + 400}px`;
        }
    }

    // 關閉上滑圖片
    hideFullScreen() {
        this.fullScreen.style.visibility = 'hidden';
    }

    // 上滑效果
    onScrollEvent() {
        const nowHeight = window.innerHeight;
        const trueHeight = document.documentElement.clientHeight;

        // 原始高度等於目前的視窗高度
        if (nowHeight >= trueHeight && this.isLandscapeMode) {
            this.hideFullScreen();
        }
    }

    // 進入瀏覽器全螢幕狀態
    launchFullScreen() {
        const elem = document.documentElement;

        let fullScreenType = '';

        if (elem.requestFullscreen) {
            fullScreenType = 'requestFullscreen';
        } else if (elem.msRequestFullscreen) {
            fullScreenType = 'msRequestFullscreen';
        } else if (elem.mozRequestFullScreen) {
            fullScreenType = 'mozRequestFullScreen';
        } else if (elem.webkitRequestFullscreen) {
            fullScreenType = 'webkitRequestFullscreen';
        }

        window.scrollTo(0, 1);

        if (fullScreenType !== '') {
            // 關閉上滑圖片
            this.hideFullScreen();
            elem[fullScreenType]();
            this.fullScreenType = fullScreenType;
        }

        screenfull.request();
    }

    // 離開瀏覽器全螢幕狀態
    leaveFullscreen() {
        if (document.exitFullscreenElement || document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }

        this.fullScreenType = '';
    }

    // 由螢幕判斷直向
    get isPortraitMode() {
        return window.innerWidth < window.innerHeight;
    }

    // 由螢幕判斷橫向
    get isLandscapeMode() {
        return !this.isPortraitMode;
    }
}

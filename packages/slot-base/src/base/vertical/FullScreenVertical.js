import FullScreen from 'base/FullScreen';

export default class FullScreenVertical extends FullScreen {
    constructor(game, lang = 'en') {
        super(game, lang);

        // 防呆用，黑魔法
        this.resizeTimer = null;
        this.scrollTimer = null;
    }

    // 產生語系的提示圖
    setImgPath(lang, path) {
        // 轉橫提示
        this.landscape.style.backgroundImage = `url(${path}/gif/vertical/${lang}/pic_tips_landscape.gif)`;
        // 上滑圖片
        this.fullScreen.style.backgroundImage = `url(${path}/gif/vertical/${lang}/swipe.gif)`;
        this.fullScreen.style.backgroundSize = 'contain';
    }

    // 一開始進入判斷 若為橫的添加轉向圖片
    toLandscape() {
        if (this.isLandscapeMode) {
            this.landscape.style.display = 'block';
        }
    }

    bindEvent() {
        this.game.scale.forceOrientation(false, true);
        this.game.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
        this.game.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);

        window.addEventListener('resize', () => {
            this.onResize();
        });

        // ios - 滑出關閉
        if (this.game.device.iOS) {
            window.addEventListener('scroll', () => {
                if (this.fullScreen.style.visibility === 'visible') {
                    this.onScrollEvent();
                }
            });

            return;
        }

        // android fullscreen
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.fullScreen.addEventListener('touchend', () => {
            this.launchFullScreen();
        }, false);
    }

    // 添加滑動圖片
    showFullScreen() {
        // 直向才會開啟上滑圖片
        if (this.isPortraitMode && !this.game.device.iPad) {
            this.fullScreen.style.visibility = 'visible';
            this.fullScreen.classList.remove('hidden');
            this.fullScreen.style.height = `${window.innerHeight + 400}px`;
        }
    }

    // 上滑效果
    onScrollEvent() {
        const nowHeight = window.innerHeight;
        const trueHeight = document.documentElement.clientHeight;

        // 原始高度等於目前的視窗高度
        if (this.resizeTimer === null && this.game.device.mobileSafari && (nowHeight - trueHeight > 130 || nowHeight === trueHeight) && this.isPortraitMode) {
            this.hideFullScreen();
        }

        clearTimeout(this.scrollTimer);
        this.scrollTimer = setTimeout(() => {
            this.scrollTimer = null;
        }, 500);
    }

    // resize event
    onResize() {
        this.toLandscape();

        if (this.scrollTimer === null && this.fullScreen.style.visibility === 'hidden' && this.fullScreenType === '') {
            this.showFullScreen();
        }

        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            this.resizeTimer = null;
        }, 50);
    }

    leaveIncorrectOrientation() {
        // 關閉橫向提示
        this.landscape.style.display = 'none';
        // 導覽列出現 (safari 轉橫會自動滿版)
        if (!this.game.device.iOS) {
            this.showFullScreen();
            return;
        }

        this.hideFullScreen();
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
    }
}

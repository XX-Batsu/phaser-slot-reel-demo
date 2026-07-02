import { forEach, isEmpty, replace, includes } from 'lodash';
import { LoadSources, GetProjectInfo, getCurLangID } from 'slot-base';
import Config from 'js/main/Config';

export default class Preloader extends Phaser.State {
    init(gameFolderName) {
        this.gameFolderName = gameFolderName;
        this.urlParams = GetProjectInfo.getUrlParams();
    }

    preload() {
        // external setting
        const external = this.game.cache.getJSON('external');

        // 綁定 loading 中的事件
        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.load.onFileComplete.add(this.onFileComplete, this);
        // 語言
        this.languageID = getCurLangID(Config.LANGUAGE);

        // 將 json 設定值帶入遊戲
        forEach(external.settings, (val, key) => {
            Config[key] = val;
        });

        const mainPath = {
            base: 'assets/images/base',
            i18n: 'assets/images/i18n',
            loading: 'assets/images/loading',
            free: 'assets/images/free',
            system: 'assets/images/system',
            font: 'assets/images/font',
            animation: 'assets/images/animation',
            localAudio: 'assets/audios',
            commonFile: `${process.env.commonFile}`
        };

        // loadImage & loadAtlas
        forEach(external.images, (group) => {
            forEach(group, (altas, key) => {
                const type = (altas.type); // image, atlas, bitmap
                const subPath = replace(altas.path, '{lang}', `${this.languageID}`);
                const pathWithoutExt = `${mainPath[altas.root]}/${subPath}/${altas.file}`;
                const ext = (altas.ext);

                // 沒有 FreeGame 時，不讀取 freegame 資料夾
                if (!Config.IN_FREE_GAME && includes(altas.path, 'freegame')) { return; }

                // loadAtlas
                if (type === 'atlas') {
                    LoadSources.loadAtlas(key, `${pathWithoutExt}.${ext}`, `${pathWithoutExt}.json`);
                    return;
                }
                // loadBitmap
                if (type === 'bitmap') {
                    LoadSources.loadBitmap(key, `${pathWithoutExt}.${ext}`, `${pathWithoutExt}.fnt`);
                    return;
                }
                // json
                if (type === 'json') {
                    LoadSources.loadJson(key, `${pathWithoutExt}.json`);
                    return;
                }
                // loadImage
                LoadSources.loadImage(key, `${pathWithoutExt}.${ext}`);
            });
        });

        // load sound
        forEach(external.sound, (category) => {
            if (isEmpty(category)) { return; }

            forEach(category, (item, itemKey) => {
                if (isEmpty(item)) { return; }
                if (item.path) {
                    LoadSources.loadAudio(itemKey, [ `${mainPath[item.root]}/${item.path}.mp3` ]);
                    return;
                }
                forEach(item, (val, key) => {
                    LoadSources.loadAudio(key, [ `${mainPath[item.root]}/${item.path}.mp3` ]);
                });
            });
        });

        // 容器
        this.loadingBarGroup = new Phaser.Group(this.game);
        // bg
        this.loadingBg = new Phaser.Sprite(this.game, this.game.width / 2, this.game.height / 2, '');
        this.loadingBg.anchor.y = 0.5;
        this.loadingBg.anchor.x = 0.5;
        this.loadingBarGroup.add(this.loadingBg);

        // 左邊葉子
        this.loadingLeaf1 = new Phaser.Sprite(this.game, 265, 289, '');
        this.loadingLeaf1.anchor.y = 0.5;
        this.loadingLeaf1.anchor.x = 0.5;
        this.loadingBarGroup.add(this.loadingLeaf1);

        // 右邊葉子
        this.loadingLeaf2 = new Phaser.Sprite(this.game, 1573, 395, '');
        this.loadingLeaf2.anchor.y = 0.5;
        this.loadingLeaf2.anchor.x = 0.5;
        this.loadingBarGroup.add(this.loadingLeaf2);

        // loading 字
        this.loadingText = new Phaser.Sprite(this.game, this.game.width / 2, 600, '');
        this.loadingText.anchor.y = 0.5;
        this.loadingText.anchor.x = 0.5;
        this.loadingBarGroup.add(this.loadingText);

        // loading bar 底1
        this.loadingBarBoard1 = new Phaser.Sprite(this.game, this.game.width / 2, 700, '');
        this.loadingBarBoard1.anchor.y = 0.5;
        this.loadingBarBoard1.anchor.x = 0.5;
        this.loadingBarGroup.add(this.loadingBarBoard1);

        // loading bar 線
        this.loadingBarLine = new Phaser.Sprite(this.game, this.game.width / 2, 700, '');
        this.loadingBarLine.anchor.y = 0.5;
        this.loadingBarLine.anchor.x = 0.5;
        this.loadingBarGroup.add(this.loadingBarLine);

        this.loadingLineLength = 1040;
        this.barMask = this.game.add.graphics(0, 0);
        this.barMask.beginFill(0xFF33FF);
        this.barMask.drawRect(0, this.loadingBarLine.y + 15, this.loadingLineLength, 50);
        this.barMask.endFill();
        this.loadingBarLine.mask = this.barMask;
        this.loadingBarGroup.add(this.barMask);

        // loading logo
        this.loadingLogo = new Phaser.Sprite(this.game, this.game.width / 2, 262, '');
        this.loadingLogo.anchor.y = 0.5;
        this.loadingLogo.anchor.x = 0.5;
        this.loadingBarGroup.add(this.loadingLogo);

        // loading bar 讀取頭
        this.loadingBarHeader = new Phaser.Sprite(this.game, this.loadingBarLine.x - 490, this.loadingBarLine.y - 5, '');
        this.iconStart = Object.assign(this.loadingBarHeader.x);
        this.loadingBarHeader.anchor.y = 0.5;
        this.loadingBarHeader.anchor.x = 0.5;
        this.loadingBarGroup.add(this.loadingBarHeader);

        // loading 開始
        this.game.load.start();

        // loading頁音效
        // this.loadingMusic = this.game.add.audio('loadingMusic');
        // this.loadingMusic.play();
    }

    /**
     * 將 graphic 轉成 sprite
     * @param  {String} color
     * @return {Phaser.Sprite}   線
     */
    createLoadingLine(color) {
        const graphic = new Phaser.Graphics(this.game, 0, 800);
        graphic.beginFill(color);
        graphic.drawRect(0, 0, this.game.world.width, 14);
        graphic.endFill();
        // 將 graphic 轉換成圖片
        const line = new Phaser.Sprite(this.game, graphic.x, graphic.y, graphic.generateTexture());
        // 摧毀 graphic
        graphic.destroy();
        return line;
    }

    /**
     * loading 檔案完成後
     * @param {Number} progress loading %數
     */
    onFileComplete(progress, key) {
        // loading logo / light 載入完成後將圖片換上
        if (this[key]) {
            this[key].loadTexture(key);
        }

        const percentage = progress / 100;

        // 根據長度變換 loading icon 位置
        this.loadingBarHeader.x = this.iconStart + (1000 * percentage);
        this.barMask.x = this.loadingBarHeader.x - this.loadingLineLength;
    }

    // 完成載入
    onLoadComplete() {
        this.game.time.events.add(Phaser.Timer.SECOND, () => {
            // 停止光旋轉動畫
            // this.tl.kill();
            // this.tl = null;

            // 清除 loading 大背景圖
            const $game = document.querySelector('#game');
            // 清除 loading 與 resize 事件
            $game.style.backgroundImage = '';
            // 清除載入音效
            // this.loadingMusic.destroy();
            // this.game.cache.removeSound('loadingMusic');
            // 進入正式遊戲
            this.state.start('MainStage', false, false, this.urlParams);
            this.clearLoadingObjs();
        }, this);
    }

    // 清除 loading bar 相關物件
    clearLoadingObjs() {
        this.loadingBarGroup.removeAll(true);
        this.loadingBarGroup.destroy(true);
        this.loadingBarGroup = null;
    }
}

export default class SpineBase extends Phaser.Group {
    constructor(game) {
        super(game);
        // 主遊戲 canvas
        const $game = document.querySelector('#game canvas');
        // spine dom 元素
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'spine';
        this.canvas.id = 'spine';
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        // 將 spine canvas 插入到 $game 後面
        $game.parentNode.insertBefore(this.canvas, $game.nextSibling);
        const glConfig = {
            alpha: true
        };

        this.path = `${(process.env.NODE_ENV === 'develop') ? 'src' : '.'}/assets/images/common/spine`;

        // 取得 WebGL
        this.gl = this.canvas.getContext('webgl', glConfig) || this.canvas.getContext('experimental-webgl', glConfig);
        // spine
        this.shader = spine.webgl.Shader.newTwoColoredTextured(this.gl);
        this.batcher = new spine.webgl.PolygonBatcher(this.gl);
        this.mvp = new spine.webgl.Matrix4();
        this.mvp.ortho2d(0, 0, this.canvas.width - 1, this.canvas.height - 1);
        this.skeletonRenderer = new spine.webgl.SkeletonRenderer(this.gl);
        this.assetManager = new spine.webgl.AssetManager(this.gl);
        this.bgColor = new spine.Color(0 / 255, 0 / 255, 0 / 255, 0);

        // 註冊骨架資料陣列
        this.registeredSkeletons = [];
        // 已載入之骨架資料陣列
        this.skeletons = [];
        // 用以繪圖的骨架實體陣列
        this.skeletonsForRender = [];
        // 紀錄每個骨架最後一幀的時間
        this.lastFrameTimes = [];
        // 紀錄是否播過，用來使初次強制對到第一幀，只會使用一次
        this.hasPlayedOnce = [];
        // 紀錄骨架在畫面上的初始位置
        this.animationInitPositions = [];
        // 骨架當前在畫面上的位置
        this.animationPositions = [];
        // 事件集合
        this.eventCollection = [];
        // 預存動畫
        this.animationToPlaySinceLoadingComplete = [];

        // 預設隱藏Spine
        this.hideSpine();
    }

    /**
     * 註冊骨架
     * @param  {Object} skeletons 自定義spine註冊資料
     */
    registerSkeletons(skeletons) {
        skeletons.forEach((ele) => {
            const index = this.getIndexByName(ele.name, this.registeredSkeletons);
            if (index < 0) {
                this.registeredSkeletons.push(ele);
                this.loadAssets(ele.name, ele.textureAmount);
            }
        }, this);
    }

    /**
     * 分別註冊子物件事件
     * @param  {String} [name='']   註冊的spine名
     * @param  {Object} [events={}] 事件物件
     * @param  {Number} [cloneID=0] 複製單位的序號
     */
    registerChildrenEvents(name = '', events = {}, cloneID = 0) {
        const index = this.getIndexByName(name + cloneID, this.eventCollection);
        if (index === -1) {
            this.eventCollection.push({
                name: name + cloneID,
                events
            });
        }
    }

    /**
     * 批次註冊子物件事件
     * @param  {Array}  [eventDataAry=[]] 事件資料陣列
     */
    registerChildrenEventsInBatch(eventDataAry = []) {
        eventDataAry.forEach((ele) => {
            this.registerChildrenEvents(...ele);
        }, this);
    }

    /**
     * 取得已註冊子物件事件
     * @param  {String} [name='']   註冊的spine名
     * @param  {Number} [cloneID=0] 複製單位的序號
     * @return {Object} [events={}] 事件物件
     */
    getChildrenEvents(name = '', cloneID = 0) {
        const index = this.getIndexByName(name + cloneID, this.eventCollection);
        if (index > -1) {
            return this.eventCollection[index].events;
        }
        const eventTemplate = {
            // start(track) {
            //     // 動畫開始事件
            // },
            // interrupt(track) {
            //     // 動畫插播事件
            // },
            // end(track) {
            //     // 動畫結束事件
            // },
            // disposed(track) {
            //     // 動畫移除件
            // },
            // complete(track) {
            //     // 動畫完整播完一輪事件
            // },
            // event(track, event) {
            //     // 自定義事件
            //     // console.log('Event on track ' + track.trackIndex + ': ' + JSON.stringify(event));
            // }
        };
        return eventTemplate;
    }

    /**
     * 載入設定檔和圖檔
     * @param  {String} [name='']         [description]
     * @param  {Number} [textureAmount=1] [description]
     */
    loadAssets(name = '', textureAmount = 1) {
        this.assetManager.loadText(`${this.path}/${name}.json`);
        this.assetManager.loadText(`${this.path}/${name}.atlas`);
        this.assetManager.loadTexture(`${this.path}/${name}.png`);
        for (let i = 2; i < textureAmount + 1; i++) {
            this.assetManager.loadTexture(`${this.path}/${name}${i}.png`);
        }
    }

    /**
     * 用以確認是否可以開始使用spine
     * @return {Boolean} 判斷資產是否已經載完
     */
    get isSpineLoadingComplete() {
        return this.assetManager.isLoadingComplete();
    }

    /**
     * 反覆檢查直到完成
     */
    autoCheckLoadingStatus() {
        if (this.isSpineLoadingComplete) {
            // 載入完成，播放目前存起來的動畫
            this.animationToPlaySinceLoadingComplete.forEach((ele) => {
                this.callAnimation(...ele);
            }, this);
            // 清除預存資料
            this.animationToPlaySinceLoadingComplete = [];
            return;
        }
        let autoRecheck = setTimeout(() => {
            // 未完成則以一定週期持續重複檢查
            this.autoCheckLoadingStatus();
            clearTimeout(autoRecheck);
            autoRecheck = null;
        }, 100);
    }

    update() {
        this.render();
    }

    /**
     * 繪圖
     */
    render() {
        const now = Date.now() / 1000;

        this.resize();

        this.gl.clearColor(this.bgColor.r, this.bgColor.g, this.bgColor.b, this.bgColor.a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        for (let i = 0; i < this.skeletonsForRender.length; i++) {
            if (!this.skeletonsForRender[i]) { continue; }
            const state = this.skeletonsForRender[i].spineAnimationState;
            const skeleton = this.skeletonsForRender[i].spineSkeleton;
            const premultipliedAlpha = this.skeletonsForRender[i].premultipliedAlpha;

            // 第一次播時強制對第一幀
            let delta;
            if (!this.hasPlayedOnce[i]) {
                delta = 1 / 60;
                this.hasPlayedOnce[i] = true;
                return;
            }

            delta = now - this.lastFrameTimes[i];

            this.lastFrameTimes[i] = now;

            // 骨架位置
            skeleton.x = this.animationPositions[i].x;
            skeleton.y = this.animationPositions[i].y;

            state.update(delta);
            state.apply(skeleton);
            skeleton.updateWorldTransform();

            this.shader.bind();
            this.shader.setUniformi(spine.webgl.Shader.SAMPLER, 0);
            this.shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, this.mvp.values);

            this.batcher.begin(this.shader);
            this.skeletonRenderer.premultipliedAlpha = premultipliedAlpha;
            this.skeletonRenderer.draw(this.batcher, skeleton);

            this.batcher.end();

            this.shader.unbind();
        }
    }

    /**
     * spine畫布尺寸隨視窗改變
     */
    resize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const game = {
            size: {
                width: this.game.width,
                height: this.game.height
            }
        };
        if (this.canvas.width !== w || this.canvas.height !== h) {
            this.canvas.width = w;
            this.canvas.height = h;
        }

        const scaleX = game.size.width / this.canvas.width;
        const scaleY = game.size.height / this.canvas.height;

        const scale = Math.max(scaleX, scaleY);

        const width = this.canvas.width * scale;
        const height = this.canvas.height * scale;

        this.mvp.ortho2d(-width / 2, -height / 2, width, height);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * 建立骨架並註冊動畫事件
     * @param  {String}  [name='']                  [description]
     * @param  {Boolean} [premultipliedAlpha=false] [description]
     * @param  {String}  [skin='default']           [description]
     * @param  {Number}  [index=-1]          [description]
     */
    loadSkeleton(name = '', premultipliedAlpha = false, skin = 'default', index = -1) {
        const atlas = new spine.TextureAtlas(
            this.assetManager.get(
                `${this.path}/${name}.atlas`),
            path => this.assetManager.get(`${this.path}/${path}`)
        );
        const atlasLoader = new spine.AtlasAttachmentLoader(atlas);
        const skeletonJson = new spine.SkeletonJson(atlasLoader);
        const skeletonData = skeletonJson.readSkeletonData(this.assetManager.get(`${this.path}/${name}.json`));
        const skeleton = new spine.Skeleton(skeletonData);
        skeleton.setSkinByName(skin);
        const bounds = this.calculateBounds(skeleton);
        const animationStateData = new spine.AnimationStateData(skeleton.data);
        animationStateData.defaultMix = 0.25;
        const animationState = new spine.AnimationState(animationStateData);

        // 塞名字
        skeleton.name = name;
        return {
            skeleton,
            state: animationState,
            bounds,
            premultipliedAlpha,
            index
        };
    }

    /**
     * 實作播動畫，讓spine產生於場景的地方
     * @param  {String}     [spineName='']  spine物件名稱
     * @param  {String}     [animation='']  初始動畫，也可以傳spine的Animation型態
     * @param  {Boolean}    [loop=false]    是否重複播放
     * @param  {Number}     [cloneID=0]     實體索引
     * @param  {Function}   [callback]      回調
     */
    callAnimation(spineName = '', animation = '', loop = false, cloneID = 0, callback) {
        const index = this.getIndexByName(spineName, this.registeredSkeletons);

        if (!this.isSpineLoadingComplete) {
            // 尚未載入完成則預存待播放動畫資料
            const tempData = [ spineName, animation, loop, cloneID, callback ];
            this.animationToPlaySinceLoadingComplete.push(tempData);
            // 確保檢查函式只開頭一次
            if (this.animationToPlaySinceLoadingComplete.length > 1) { return; }
            this.autoCheckLoadingStatus();
            return;
        }

        // 被註冊spine物件資料，實際要播動畫時另外建立實體
        if (!this.skeletons[index]) {
            this.skeletons[index] = this.loadSkeleton(
                this.registeredSkeletons[index].name,
                this.registeredSkeletons[index].premultipliedAlpha,
                this.registeredSkeletons[index].initialSkin,
                this.registeredSkeletons[index].loop,
                index);
        }
        // 實際繪圖的名字：spine名 ＋ 自訂編號
        const objName = spineName + cloneID;
        // 實際在畫的索引
        let objIndex = this.getIndexByName(objName, this.skeletonsForRender);
        if (objIndex < 0) {
            if (this.skeletons[index]) {
                // 繪圖實體
                this.skeletonsForRender.push({
                    // 當key
                    name: objName,
                    // 必須骨架
                    spineSkeleton: new spine.Skeleton(this.skeletons[index].skeleton.data),
                    // 必須狀態
                    spineAnimationState: new spine.AnimationState(this.skeletons[index].state.data),
                    premultipliedAlpha: this.skeletons[index].premultipliedAlpha
                });
                objIndex = this.getIndexByName(objName, this.skeletonsForRender);
                this.lastFrameTimes[objIndex] = Date.now() / 1000;
                this.hasPlayedOnce[objIndex] = false;
                this.animationInitPositions[objIndex] = { x: this.registeredSkeletons[index].coordinate.x, y: this.registeredSkeletons[index].coordinate.y };
                this.animationPositions[objIndex] = { x: this.registeredSkeletons[index].coordinate.x, y: this.registeredSkeletons[index].coordinate.y };
            }
        }
        // 確定Spine層開著
        if (this.canvas.style.display === 'none') {
            this.showSpine();
        }
        // 塞事件
        this.skeletonsForRender[objIndex].spineAnimationState.addListener(this.getChildrenEvents(spineName, cloneID));
        // 實際產生動畫
        this.skeletonsForRender[objIndex].spineAnimationState.setAnimation(0, animation, loop);
        // 回調
        if (callback) {
            callback();
        }
    }

    /**
     *
     * @param  {spine.Skeleton}     skeleton    Spine骨架資料
     */
    calculateBounds(skeleton) {
        skeleton.setToSetupPose();
        skeleton.updateWorldTransform();
        const offset = new spine.Vector2();
        const size = new spine.Vector2();
        skeleton.getBounds(offset, size, []);
        return {
            offset,
            size
        };
    }

    /**
     * 清除指定spine動畫
     * @param  {String}   [name='']     註冊時的spine動畫名
     * @param  {Function} callback      完成後call
     * @param  {Number}   [cloneID=0]   實體索引
     */
    clearAnimation(name = '', callback, cloneID = 0) {
        const cloneName = name + cloneID;
        const index = this.getIndexByName(cloneName, this.skeletonsForRender);
        if (this.skeletonsForRender[index]) {
            this.skeletonsForRender.splice(index, 1);
            this.lastFrameTimes.splice(index, 1);
            this.hasPlayedOnce.splice(index, 1);
            this.animationInitPositions.splice(index, 1);
            this.animationPositions.splice(index, 1);
        }
        // 沒有任何動畫時關閉Spine層
        if (this.skeletonsForRender.length === 0) {
            this.hideSpine();
        }
        if (callback) {
            callback();
        }
    }

    /**
     * 清除所有spine動畫
     * @param  {Function}   callback    完成後call
     */
    clearAll(callback) {
        this.skeletonsForRender = [];
        this.lastFrameTimes = [];
        this.hasPlayedOnce = [];
        this.animationInitPositions = [];
        this.animationPositions = [];
        this.hideSpine();
        if (callback) {
            callback();
        }
    }

    /**
     * 切換動畫，如果不是重複播放則播放一次之後回到指定動畫
     * @param  {String}  [name='']           spine物件名
     * @param  {String}  [targetAni='']      欲切換動畫
     * @param  {Boolean} [loop=false]        是否重複播放
     * @param  {Number}  [fixDuration=0]     緩衝秒數
     * @param  {String}  [backToIdleAnim=''] 只播放一次的話，將回到的動畫
     * @param  {Number}  [cloneID=0]         實體索引
     */
    switchAnimation(name = '', targetAni = '', loop = false, fixDuration = 0, backToIdleAnim = '', cloneID = 0) {
        const cloneName = name + cloneID;
        const index = this.getIndexByName(cloneName, this.skeletonsForRender);
        if (!this.skeletonsForRender[index]) { return; }

        this.skeletonsForRender[index].spineAnimationState.setAnimation(0, targetAni, loop);

        if (!loop && backToIdleAnim) {
            this.skeletonsForRender[index].spineAnimationState.addAnimation(0, backToIdleAnim, true, fixDuration);
        }
    }

    /**
     * 取得物件定位
     * @param  {String}  name           已註冊骨架名
     * @param  {Number}  [cloneID=0]    實體索引
     * @return {Object}  { x, y }       座標
     */
    getPosition(name, cloneID = 0) {
        const cloneName = name + cloneID;
        const index = this.getIndexByName(cloneName, this.skeletonsForRender);
        if (index < 0) {
            // console.error('Can not find Spine object name.');
            return { x: 0, y: 0 };
        }
        return this.animationPositions[index];
    }

    /**
     * 設定物件位置
     * @param   {String}    name        已註冊骨架名
     * @param   {Number}    x           座標Ｘ
     * @param   {Number}    y           座標Ｙ
     * @param   {Number}    [cloneID=0] 實體索引
     */
    setPosition(name, x, y, cloneID = 0) {
        const cloneName = name + cloneID;
        const index = this.getIndexByName(cloneName, this.skeletonsForRender);
        if (index < 0) {
            // console.error('Can not find Spine object name, please check skeleton register.');
            return;
        }
        this.animationPositions[index].x = x;
        this.animationPositions[index].y = y;
    }

    /**
     * 曲線位移
     * @param {String}      name        已註冊骨架名
     * @param {Number}      xCoord      座標Ｘ
     * @param {Number}      yCoord      座標Ｙ
     * @param {Number}      duration    期間
     * @param {EaseType}    easeType    漸進類型
     * @param {Function}    callback    漸進類型
     * @param {Number}      [cloneID=0] 實體索引
     */
    moveEasing(name = '', xCoord = 0, yCoord = 0, duration = 0, easeType, callback, cloneID = 0) {
        const cloneName = name + cloneID;
        const index = this.getIndexByName(cloneName, this.skeletonsForRender);
        let myTween = new TimelineLite();

        myTween.to(this.animationPositions[index], duration, {
            ease: easeType,
            x: xCoord,
            y: yCoord,
            onComplete: () => {
                if (callback) {
                    callback();
                }
                myTween.kill();
                myTween = null;
            }
        });
    }

    /**
     * 重置物件到spine註冊時的初始位置
     * @param {String} name        已註冊骨架名
     * @param {Number} [cloneID=0] 實體索引
     */
    resetPosition(name, cloneID = 0) {
        const cloneName = name + cloneID;
        const index = this.getIndexByName(cloneName, this.skeletonsForRender);
        this.animationPositions[index] = this.animationInitPositions[index];
    }

    /**
     * 取陣列中元素名的索引
     * @param  {String} name    要取索引的名字
     * @param  {Array}  array   目標陣列
     * @return {Number}         索引
     */
    getIndexByName(name, array) {
        return array.map(e => e.name).indexOf(name);
    }

    /**
     * 關閉整個Spine層
     * @param  {Function} callback 做完call
     */
    hideSpine(callback) {
        this.canvas.style.display = 'none';
        if (callback) {
            callback();
        }
    }

    /**
     * 開啟整個Spine層
     * @param  {Function} callback 做完call
     */
    showSpine(callback) {
        this.canvas.style.display = 'block';
        if (callback) {
            callback();
        }
    }
}

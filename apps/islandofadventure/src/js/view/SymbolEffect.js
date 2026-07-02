import { GameBase, Sound, ConfigTools, SlotGame, Tool } from 'slot-base';
import Config from 'js/main/Config';

// WinData
import WinSymbolSignal from 'js/signal/windata/WinSymbolSignal';
import WinSymbolShowSignal from 'js/signal/windata/WinSymbolShowSignal';
// UI - Symbol
import ScatterPlaySignal from 'js/signal/ui/symbol/ScatterPlaySignal';
import BonusPlaySignal from 'js/signal/ui/symbol/BonusPlaySignal';

import ParticleCoin from 'js/view/particle/particleElements/ParticleCoin';

export default class SymbolEffect extends GameBase {
    constructor(game) {
        super(game);
        this.keyName = '';
        // 一般秀線
        this.addEventListener(WinSymbolSignal.ON_WINSYMBOL_EFFECT, this.showWinSymbol, this);
        // Extra秀線
        this.addEventListener(WinSymbolShowSignal.ON_WINSYMBOL_SHOW_EFFECT, this.showWinSymbolShow, this);
        // 播放顯示特殊Scatter動畫
        this.addEventListener(ScatterPlaySignal.ON_SCATTER_TRIGGER_EFFECT, this.playScatter, this);
        // 播放顯示特殊Bonus動畫
        this.addEventListener(BonusPlaySignal.ON_BONUS_TRIGGER_EFFECT, this.playBonus, this);
        this.addEventListener(SlotGame.GameEvent.STATES, this.gameSlotStates, this);
        // 紀錄創建動畫的二維陣列
        this.alreadyMapAry = this.setMapAry();
        // 放置動畫容器
        this.SymbolGroup = new Phaser.Group(this.game);
        this.add(this.SymbolGroup);
        // 放置動畫容器 (Wild專用)
        this.SymbolWildGroup = new Phaser.Group(this.game);
        this.add(this.SymbolWildGroup);
        // 輪閃線條功能
        this.inTurnCount = 0;
        this.lineLength = 0;
        // 此筆贏得資料
        this.data = {};
        // 是否FreeGame模式
        this.isFreePlay = false;
        // 是否Auto模式
        this.isAutoPlay = false;

        this.particleCoin = new Phaser.Particles.Arcade.Emitter(this.game, 780, 760);
        this.add(this.particleCoin);
        this.particleCoin.minParticleScale = 0.45;
        this.particleCoin.maxParticleScale = 0.5;
        this.particleCoin.gravity = 3000;
        this.particleCoin.particleClass = ParticleCoin;
        this.particleCoin.makeParticles();
        this.particleCoin.setYSpeed(-700, -600);
        this.particleCoin.setXSpeed(-700, 700);
        this.particleCoin.startEmitter = (quanity = 10) => {
            this.particleCoin.start(true, 1000, 0, quanity);
        };
        this.particleCoin.stopEmitter = () => {
            this.particleCoin.on = false;
            this.particleCoin.forEach((particle) => {
                particle.kill();
            });
        };
    }

    // 紀錄已經創建的位置 array
    setMapAry() {
        const ary = [];
        for (let i = 0; i < Config.NUM_ROWS; i++) {
            ary.push([]);
            for (let j = 0; j < Config.NUM_REELS; j++) {
                ary[i].push(0);
            }
        }

        return ary;
    }

    /**
     * 滾輪轉動結束Hit中Scatter 顯示Scatter動畫功能來 [顯示要進入FreeGame功能動畫]
     * @param {Object} data ScatterPlaySignal 夾帶的資料
     */
    playScatter(data) {
        // 如果 max spin 則不播放動畫
        if (data.isMaxSpin && this.isFreePlay) {
            ScatterPlaySignal.callBack();
            return;
        }

        this.resetSaveData(data);

        const endframe = -1;    // -1是預設值 跑完全格

        for (let i = 0; i < this.lineLength; i++) {
            const symbolID = data.symbolIdAry[i];
            // 只秀Scater動畫其他條線不需要秀,等FreeGame結束回BaseGame在秀其他線動畫
            if (Config.SYMBOL_FREE.indexOf(symbolID) !== -1) {
                Sound.playFeature('Scatter');
                this.showSingleWinSymbol(i, false, false, endframe, this.scatterPlayComplete);
                return;
            }
        }
        ScatterPlaySignal.callBack();
    }

    // Scatter動畫結束的回調函數
    scatterPlayComplete() {
        // 取消動畫
        this.reset();
        Sound.stopWinStep();
        Sound.stopWinSymbol();
        ScatterPlaySignal.callBack();
    }

    // Bonus Symbol 播放圖標
    playBonus(data) {
        this.resetSaveData(data);

        const endframe = -1;    // -1是預設值 跑完全格
        const bonusAry = (SlotGame.BonusConfig.BONUS_STAGE_STATUS === 0) ? Config.SYMBOL_LUCKY_DRAW : Config.SYMBOL_BONUS;
        for (let i = 0; i < this.lineLength; i++) {
            const symbolID = data.symbolIdAry[i];
            // 只秀Scater動畫其他條線不需要秀,等FreeGame結束回BaseGame在秀其他線動畫
            if (bonusAry.indexOf(symbolID) !== -1) {
                // Sound.playFeature('Bonus');
                Sound.playFeature('Scatter');  // 播放LuckyDraw Symbol Sound
                this.showSingleWinSymbol(i, false, false, endframe, this.bonusPlayComplete);    // Bonus 剛觸發是不秀分
                return;
            }
        }
        BonusPlaySignal.callBack();
    }

    // Bonus動畫結束的回調函數
    bonusPlayComplete() {
        // 取消動畫
        this.reset();
        Sound.stopWinSymbol();
        BonusPlaySignal.callBack();
    }

    /**
     * 開始播放中獎動畫
     * @param  {Object} data WinSymbolSignal 夾帶的資料
     */
    showWinSymbol(data) {
        // 冒險島
        const islandData = data;
        if (data.extraData[0] !== null) {
            for (let i = 0; i < data.extraData[0].length; i++) {
                if (data.extraData[0][i] === 1) {
                    islandData.symbolResult.forEach((row) => {
                        row[i] = 'W1';
                    });
                }
            }
        }
        this.resetSaveData(islandData);
        // this.resetSaveData(data);

        this.customWinEffectStart(Tool.accDiv(data.totalWin, SlotGame.GameInfo.userBet));

        // 是否為 wild group 全動畫
        this.isWildGroup = (Config.IS_WILD_GROUP && this.data.isAllWild);

        // 播放全 wild 動畫
        if (this.isWildGroup) {
            Sound.playAllWild();
            this.makeAllWildAnimation();
            return;
        }

        // 連線只有一條時直接秀單線與贏得分數(因為贏得分數顯示模式是看設定)
        if (!this.isAutoPlay || this.isFreePlay) {
            // 秀單線(可依照使用者設定是否顯示分數)
            this.inTurnShow();
            return;
        }

        // 全線不秀動畫
        this.allWinSymbol(this.lineLength);
        Sound.playWinStep();
    }

    // 秀Win 特殊
    showWinSymbolShow(data) {
        this.data = data;
        // 一般秀線
        const specialItem = this.showSingleWinSymbol(data.index, false, false, -1);
        // 播放音效 沒特殊音效播放一般連線聲音
        (specialItem === undefined)
        ? Sound.playWinStep()
        : Sound.playWinSymbol(specialItem);
        this.extraShowWinTime = setTimeout(() => {
            this.showWinSymbolShowOver();
        }, Config.SINGLE_LINE_SEC * 1000);
    }

    // 秀Win 特殊 返回
    showWinSymbolShowOver() {
        clearTimeout(this.extraShowWinTime);
        this.extraShowWinTime = null;
        this.clearSymbol();
        this.customWinEffectStop();
        WinSymbolShowSignal.callBack();
    }

    resetSaveData(data) {
        this.clearSymbol();
        this.lineLength = data.symbolIdAry.length;
        this.data = data;
    }

    onWinLineTimer() {
        // 開始輪閃
        if (WinSymbolSignal.isCallEvent) {
            this.inTurnShow();
        }
    }

    // 輪流播單線
    inTurnShow() {
        // 秀全線的音效
        this.clearSymbol();
        Sound.stopWinSymbol();
        const specialItem = this.showSingleWinSymbol(this.inTurnCount, false, true, -1);
        this.inTurnCount = (this.inTurnCount === this.lineLength - 1) ? 0 : this.inTurnCount + 1;
        // 播放音效
        if (specialItem !== undefined) {
            Sound.playWinSymbol(specialItem);
            return;
        }

        // 沒特殊音效播放一般連線聲音
        Sound.playWinStep();
    }

    /**
     * 秀中獎全線
     * @param  {Number} lineNumber 中線數
     */
    allWinSymbol(lineNumber) {
        this.clearSymbol();
        for (let i = 0; i < lineNumber; i++) {
            this.showSingleWinSymbol(i, false, true, -1);
        }
    }

    /**
     * 產生單線的動畫
     * @param  {Number}   index         要秀的線 id
     * @param  {Boolean}  isStatic      是否產生靜態 sprite
     * @param  {Boolean}  isInturnLine  是否為輪播單線
     * @param  {Number}   frameEnd      設定停在哪一格
     * @param  {Function} fun           停止時呼叫函數
     * @return {String}   symbolID      返回音效ID
     */
    showSingleWinSymbol(index, isStatic = true, isInturnLine = false, frameEnd = -1, fun = undefined) {
        const data = this.data;
        const symbolID = data.symbolIdAry[index];
        const symbolCount = data.symbolCountAry[index];
        const numOfKind = data.numOfKindAry[index];
        const symbolResult = data.symbolResult;
        const winPositionAry = data.winPositionAry[index];

        let specialItem;

        let winCount = 0;
        let winReelCount = 0;
        let saveReel = -1;
        for (let reelInx = 0; reelInx < Config.NUM_REELS; reelInx++) {
            for (let rowInx = 0; rowInx < Config.NUM_ROWS; rowInx++) {
                if (winPositionAry[rowInx][reelInx] === 0) {
                    continue;
                }
                if (saveReel !== reelInx) {
                    winReelCount++;
                    saveReel = reelInx;
                }
                if (this.alreadyMapAry[rowInx][reelInx] === 1) {
                    continue;
                }

                winCount++;
                if (winCount <= symbolCount) {
                    if (winReelCount <= numOfKind) {
                        const position = ConfigTools.symbolLocal(rowInx + 1, reelInx, 'center', true);
                        const itemID = symbolResult[rowInx][reelInx];
                        const item = this.SymbolGroup.add(this.createSymbol(itemID, winCount, isStatic, frameEnd, fun));
                        item.x = position.x;
                        item.y = position.y;
                        // 紀錄已創建的 symbol 位置
                        this.alreadyMapAry[rowInx][reelInx] = 1;
                        // 檢查出有沒有 wild scatter 等特殊 symbol
                        if (Config.SOUND_SYMBOL.indexOf(itemID) !== -1) {
                            specialItem = itemID;
                        }
                    }
                }
            }
        }

        // 如果這條線是有動畫的特殊 symbol 就播放特殊 symobl 音效 否則播放其他特殊音效 wild or scatter 等
        return (Config.SOUND_SYMBOL.indexOf(symbolID) === -1) ? specialItem : symbolID;
    }

    /**
     * 產生出放大的中獎 symbol
     * @param  {Number}           symbolID    中獎的 id
     * @param  {Number}           index       第幾顆
     * @param  {Boolean}          isTween     要不要播放靜態圖片的放大效果
     * @return {Phaser.Sprite}    放大的圖片
     */
    createSprite(symbolID, index, isTween = true, endFun) {
        // 使用ID 取得正確的 圖片Key的路徑
        const SymbolKey = ConfigTools.changeSymbolID(this.game, 'symbol', symbolID);
        const sprite = new Phaser.Sprite(this.game, 0, 0, 'symbol', SymbolKey);
        sprite.anchor.set(0.5);
        if (isTween && Config.IS_SYMBOL_TWEENING) {
            this.shineSymbol(sprite, index, endFun);
            return sprite;
        }
        if (endFun) {
            endFun.call(this);
        }
        return sprite;
    }

    /**
     * Symbol閃爍動畫
     * @param {Object}      ele         Phaser.Spines
     * @param  {Number}     index       第幾顆
     * @param {Function}    cb          callBack
     */
    shineSymbol(ele, index, cb) {
        SlotGame.symbolEffectEasing.easeShine.play(ele, index, Config.SINGLE_LINE_SEC, cb, this);
    }

    /**
     * 判斷產生靜態或是動態的中獎 symbol
     * @param  {String}         symbolID    中獎 symbol ID
     * @param  {Number}         index       第幾顆
     * @param  {Boolean}        isStatic    是否產生靜態 sprite
     * @param  {Number}         end    偵聽的位置
     * @param  {Function}       endFun      在偵聽位置呼叫的觸發函數
     * @return {Phaser.Sprite}              靜態或是動態的 sprite
     */
    createSymbol(symbolID, index, isStatic, end, endFun) {
        if (isStatic || Config.ANIMATION_SYMBOL.indexOf(symbolID) === -1) {
            // 靜態
            return this.createSprite(symbolID, index, !isStatic, endFun);
        }
        // 動態
        return this.createAnimation(symbolID, index, end, endFun);
    }

    /**
     * 產生贏分文字
     * @param  {Number}              x       贏分數字的 x 軸
     * @param  {Number}              y       贏分數字的 y 軸
     * @param  {Number}              money   贏分數字
     * @return {Phaser.BitmapText}           BitmapText物件
     */
    createWinText(x, y, money) {
        this.WinText = new Phaser.BitmapText(this.game, x - 5, y - 25, 'num_win');
        this.WinText.anchor.set(0.5);
        this.WinText.text = `${money}`;
        this.add(this.WinText);

        return this.WinText;
    }

    /**
     * 產生動畫序列圖物件
     * @param  {String}         symbolID    中獎的 symbol
     * @param  {Number}         index       第幾顆
     * @param  {Number}         frameEnd    偵聽的位置
     * @param  {Function}       endFun      在偵聽位置呼叫的觸發函數
     * @return {Phaser.Sprite}              含序列動畫的sprite物件
     */
    createAnimation(symbolID, index, frameEnd, endFun) {
        // 如果沒有序列圖在 cache 中
        const clipSymbolName = `clip_${symbolID}`;
        // 回傳空的圖片防呆 使用靜態圖
        if (!this.game.cache.checkImageKey(clipSymbolName)) {
            return this.createSprite(symbolID, index, true, endFun);
        }
        const frameCount = this.game.cache.getFrameCount(clipSymbolName);
        const frameTotal = (frameEnd === -1) ? frameCount : frameEnd;
        // 若不是則自動轉成 jpg
        const isPng = (this.game.cache.getFrameByName(clipSymbolName, `clip_symbol_${symbolID}_1.png`));
        // 取出正確的範圍 如果有限制frame範圍 使用限制frame數 否則 為預設全部frame
        const frameAry = Phaser.Animation.generateFrameNames(`clip_symbol_${symbolID}_`, 1, frameTotal, (isPng) ? '.png' : '.jpg');
        // 創建物體
        const sprite = new Phaser.Sprite(this.game, 0, 0, clipSymbolName);
        sprite.animations.add('win', frameAry);
        sprite.anchor.set(0.5);
        let loopBool = true;
        // 判斷是否有回調函數
        if (endFun !== undefined) {
            // 取消Loop 輪播
            loopBool = false;
            sprite.animations.currentAnim.onComplete.add(() => {
                // 呼叫函數
                endFun.call(this);
            }, this);
        }
        const fps = Config.ANIMATION_SYMBOL_FPS[symbolID] || frameCount / Config.SINGLE_LINE_SEC;
        sprite.animations.play('win', fps, loopBool);
        return sprite;
    }

    customWinEffectStart(multipal = 10) {
        let fixQuanity = multipal;
        if (multipal < 6) {
            fixQuanity = 5;
        }
        if (multipal > 5 && multipal < 61) {
            fixQuanity = 15;
        }
        if (multipal > 60) {
            fixQuanity = 40;
        }
        this.particleCoin.startEmitter(fixQuanity);
    }

    customWinEffectStop() {
        this.particleCoin.stopEmitter();
    }

    // 播放全 wild 動畫
    makeAllWildAnimation() {
        for (let reelIndex = 0; reelIndex < this.data.allWildPosition.length; reelIndex++) {
            const isMake = this.data.allWildPosition[reelIndex];
            if (isMake) {
                this.createWildGroup(reelIndex);
            }
        }
    }

    /**
     * @param {Number} reelIndex 第幾軸
     * @return {Phaser.Sprite} sprite 大 Wild 動畫
     */
    createWildGroup(reelIndex) {
        // 如果沒有序列圖在 cache 中
        const clipSymbolName = 'clip_W_All';
        // 回傳空的圖片防呆
        if (this.game.cache.getBaseTexture(clipSymbolName) === null) {
            return new Phaser.Sprite(this.game, 0, 0, '');
        }

        const sprite = new Phaser.Sprite(this.game, 0, 0, clipSymbolName);
        const frameCount = this.game.cache.getFrameCount(clipSymbolName);
        const fps = frameCount / Config.SINGLE_LINE_SEC;
        const frameAry = Phaser.Animation.generateFrameNames('clip_symbol_W_All_', 1, frameCount, '.png');
        const anim = sprite.animations.add('wildGroup', frameAry, fps);
        sprite.anchor.set(0.5);
        const x = (reelIndex * (Config.SYMBOL_WIDTH + Config.SPACE_BASE_SYMBOLS_X)) + Config.REEL_OFFSET_X + (Config.SYMBOL_WIDTH / 2);
        const y = (Config.PageMaxHeight / 2) + Config.REEL_OFFSET_Y;
        sprite.position.set(x, y);
        sprite.animations.play('wildGroup', fps, true);

        if (reelIndex === 0) {
            anim.onLoop.add(() => {
                Sound.playAllWild();
            });
        }

        this.SymbolWildGroup.add(sprite);
        return sprite;
    }

    /**
     * 清除所有產生的動畫物件
     */
    clearSymbol() {
        this.modeScoreBool = false;
        this.SymbolGroup.removeAll(true);
        this.SymbolWildGroup.removeAll(true);
        this.alreadyMapAry = this.setMapAry();
    }

    reset() {
        clearTimeout(this.inTurnTimer);
        this.inTurnTimer = null;
        this.inTurnCount = 0;
        this.lineLength = 0;
        this.data = {};
        this.clearSymbol();
    }

    /**
     * 狀態機切換
     * @param  {Object} evt 狀態機夾帶資料
     */
    gameSlotStates(evt) {
        switch (evt.statesType) {
            case SlotGame.GaStatesConfig.gameSpin:
                this.isFreePlay = evt.isFreePlay;
                this.isAutoPlay = evt.isAutoPlay;
                break;
            // 發布中獎事件(免費遊戲剛切回BassGame的時候 只會發gameWin 跟 gameNoWin 此時isFreePlay剛換成false)
            case SlotGame.GaStatesConfig.gameWin:
                // 變更目前狀態
                this.isFreePlay = evt.isFreePlay;
                this.isAutoPlay = evt.isAutoPlay;
                break;
            // 取分
            case SlotGame.GaStatesConfig.gameTakeWin:
                this.isFreePlay = evt.isFreePlay;
                if (WinSymbolSignal.isCallEvent) {
                    // 取消動畫
                    this.reset();
                    Sound.stopWinStep();
                    Sound.stopWinSymbol();
                    // 回調Signal狀態結束
                    WinSymbolSignal.callBack();
                    // 背景音樂恢復音量
                    Sound.bgVolume = 1;
                }

                if (WinSymbolShowSignal.isCallEvent) {
                    // 取消動畫
                    this.showWinSymbolShowOver();
                }
                break;
            default:
        }
    }
}

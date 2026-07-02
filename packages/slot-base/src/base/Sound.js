export default class Sound {
    constructor(game) {
        // 單例
        Sound.instance = this;
        this.game = game;
        this.music = {};
        this.volumeMap = {};

        // external setting
        this.external = this.game.cache.getJSON('external');

        this.soundEffectPool = [];
        this.soundMusicPool = [];

        this.isEffectMuted = false;
        this.isMusicMuted = false;

        // load sound
        Object.keys(this.external.sound).forEach((category) => {
            const categoryItem = this.external.sound[category];
            if (Object.keys(categoryItem).length === 0) { return; }

            Object.keys(categoryItem).forEach((item) => {
                // 第一層
                const loaditem = categoryItem[item];
                if (Object.keys(loaditem).length === 0) { return; }

                if (loaditem.path) {
                    this.music[item] = game.add.audio(item);
                    this.music[item].isSetLoop = loaditem.loop || false;
                    this.music[item].allowMultiple = loaditem.allowMultiple || false;
                    this.music[item].volume = loaditem.volume || 1;
                    switch (loaditem.type) {
                        case 'music': {
                            this.soundMusicPool.push(item);
                            break;
                        }
                        case 'effect': {
                            this.soundEffectPool.push(item);
                            break;
                        }
                        default:
                    }
                    this.volumeMap[item] = loaditem.volume || 1;
                    return;
                }

                Object.keys(loaditem).forEach((key) => {
                    // 第二層
                    this.music[key] = game.add.audio(key);
                    this.music[key].isSetLoop = (loaditem[key].loop) || false;
                    this.music[key].allowMultiple = (loaditem[key].allowMultiple) || false;
                    this.music[key].volume = (loaditem[key].volume) || 1;
                    switch (key.type) {
                        case 'music': {
                            this.soundMusicPool.push(key);
                            break;
                        }
                        case 'effect': {
                            this.soundEffectPool.push(key);
                            break;
                        }
                        default:
                    }
                    this.volumeMap[key] = loaditem.volume || 1;
                });
            });
        });
    }

    /**
     * 設定 Config.NUM_REELS
     * @param  {Number} num Config.NUM_REELS
     */
    set numReels(num) {
        this.reelNumber = num;
    }

    /**
     * 設定 Config.AWARD_SYMBOL
     * @param  {Array} ary Config.AWARD_SYMBOL
     */
    set awardSymbol(ary) {
        this.awardSymbolAry = ary;
    }

    /**
     * 設定 Config.COMMON_AWARD_SYMBOL
     * @param  {Array} ary Config.COMMON_AWARD_SYMBOL
     */
    set commonAwardSymbol(ary) {
        this.commonAwardSymbolAry = ary;
    }

    /**
     * 判斷是否有這個音效
     * @param {String} key 要檢查的音效
     * @return {Boolean} 是否有這個音效
     */
    static isCacheKey(key) {
        if (!this.instance) {
            return '';
        }
        return this.instance.game.cache.checkSoundKey(key);
    }

    /**
     * 音效播放中控
     * 判斷是否有這個音效才去播放
     * @param {String} key 要播放的音效
     * @param {Number} fadeSec 要 fadeIn 的秒數
     * @param {Function} callBack 回調函數
     */
    static soundPlay(key, fadeSec, callBack) {
        if (this.isCacheKey(key)) {
            const soundItem = this.instance.music[key];
            if (fadeSec) {
                soundItem.fadeIn(fadeSec, soundItem.isSetLoop, '');
                return;
            }
            soundItem.play('', 0, soundItem.volume, soundItem.isSetLoop);

            // 音效完成後callBack
            if (callBack) {
                soundItem.onStop.addOnce(() => {
                    callBack();
                });
            }
        }
    }

    /**
     * 持續播放一個非loop的音效
     * @param {String} key 要播放的音效
     */
    static soundContinuePlay(key) {
        if (this.isCacheKey(key)) {
            const soundItem = this.instance.music[key];
            if (soundItem.isPlaying) {
                return;
            }
            soundItem.play('', 0, soundItem.volume, soundItem.isSetLoop);
        }
    }

    static effectSoundSwitch(bool) {
        if (bool === !this.instance.isEffectMuted) {
            return;
        }
        if (bool === false) {
            for (let i = 0, j = this.instance.soundEffectPool.length; i < j; i++) {
                this.instance.volumeMap[this.instance.soundEffectPool[i]] = this.instance.music[this.instance.soundEffectPool[i]].volume;
            }
        }
        for (let i = 0, j = this.instance.soundEffectPool.length; i < j; i++) {
            this.soundVolume(this.instance.soundEffectPool[i], bool ? this.instance.volumeMap[this.instance.soundEffectPool[i]] : 0);
        }
        this.instance.isEffectMuted = !bool;
    }

    static musicSoundSwitch(bool) {
        if (bool === !this.instance.isMusicMuted) {
            return;
        }
        if (bool === false) {
            for (let i = 0, j = this.instance.soundMusicPool.length; i < j; i++) {
                this.instance.volumeMap[this.instance.soundMusicPool[i]] = this.instance.music[this.instance.soundMusicPool[i]].volume;
            }
        }
        for (let i = 0, j = this.instance.soundMusicPool.length; i < j; i++) {
            this.soundVolume(this.instance.soundMusicPool[i], bool ? this.instance.volumeMap[this.instance.soundMusicPool[i]] : 0);
        }
        this.instance.isMusicMuted = !bool;
    }

    /**
     * 音量調整
     * @param  {String} soundKey 需調整的音效key
     * @param  {Number} value 音量大小
     */
    static soundVolume(soundKey, value) {
        if (this.isCacheKey(soundKey)) {
            const soundItem = this.instance.music[soundKey];
            soundItem.volume = value;
        }
    }

    /**
     * 音效停止中控
     * 判斷是否有這個音效才去停止
     * @param {String} key 要停止播放的音效
     * @param {Number} fadeSec 要 fadeOut 的秒數
     */
    static soundStop(key, fadeSec) {
        if (this.isCacheKey(key)) {
            const soundItem = this.instance.music[key];
            if (fadeSec) {
                soundItem.fadeOut(fadeSec);
                return;
            }

            soundItem.stop();
        }
    }

    /**
     * 按鈕音效中控 如果沒有就播放預設 btnSpin 的音效
     * @param {String} key 要播放的按鈕音效
     */
    static soundBtnPlay(key) {
        if (this.isCacheKey(key)) {
            this.instance.music[key].play();
            return;
        }

        if (this.isCacheKey('btnBase')) {
            this.instance.music.btnBase.play();
            return;
        }

        this.instance.music.btnSpin.play();
    }

    /**
     * 播放遊戲特色的聲音
     * @param {String} key 要播放的音效
     * @param {Number} fadeSec 要 fadeIn 的秒數
     * @param {Function} callBack 回調函數
     *
     */
    static playFeature(key, fadeSec, callBack) {
        this.soundPlay(key, fadeSec, callBack);
    }

    /**
     * 停止播放遊戲特色的聲音
     * @param {String} key 要停止播放的音效
     * @param {Number} fadeSec 要 fadeOut 的秒數
     */
    static stopFeature(key, fadeSec) {
        this.soundStop(key, fadeSec);
    }

    /**
     * spin 音效
     */
    static playSpin() {
        const key = `reelSpin${this.instance.spinCount}`;

        if (!this.isCacheKey(key)) {
            this.soundPlay('reelSpin1');
            return;
        }

        this.soundPlay(key);
        this.instance.spinType = `reelSpin${this.instance.spinCount}`;

        if (this.instance.spinCount < Object.keys(this.instance.external.sound.baseGame.spin).length) {
            this.instance.spinCount++;
            return;
        }

        this.instance.spinCount = 1;
    }

    /**
     * 停止 spin
     */
    static stopSpin() {
        if (this.instance.spinType !== '') {
            this.soundStop(this.instance.spinType);
        }
    }

    /**
     * damping 音效
     * @param {Boolean} isFreeGame 是否為 free game
     * @param {Number} reelIndex 第幾軸
     */
    static playDamping() {
        this.soundPlay('reelStop');
    }

    static stopDamping() {}

    // 一般 hit 聲音
    static playFreeHit(specialSymbol, level) {
        this.soundPlay(`freeGameHit_${level}`);
    }

    // 一般 hit 聲音
    static playBonusHit(specialSymbol, reelIndex) {
        this.soundPlay(`bonusHit_${reelIndex}`);
    }

    static stopHit() {
        this.instance.nowHitCount = 0;
    }

    static playStepHit(symbolID) {
        this.instance.nowHitCount++;
        this.soundPlay(`hit${symbolID}${this.instance.nowHitCount}`);
    }

    /**
     * 贏線特殊 symbol
     * @param  {String} symbolID 中獎的 symbol
     */
    static playWinSymbol(symbolID = '') {
        this.stopWinSymbol();
        const playType = `symbol${symbolID}`;

        if (this.isCacheKey(playType)) {
            this.instance.winSymbolType = playType;
            this.soundPlay(playType);
        }
    }

    /**
     * 停止贏分音效
     */
    static stopWinSymbol() {
        if (this.instance.winSymbolType !== '') {
            this.soundStop(this.instance.winSymbolType);
        }
    }

    /**
    * 播放全 wild 動畫
    * 判斷是否有這個音效才去播放
    * @param {String} key 要播放的音效
    */
    static playAllWild() {
        this.stopAllWild();
        const playType = 'symbolW';
        if (this.isCacheKey(playType)) {
            const soundItem = this.instance.music[playType];
            soundItem.play();
            this.instance.allWild = playType;
        }
    }

    /**
    * 停止播放全 wild 動畫
    */
    static stopAllWild() {
        if (this.instance.allWild !== '') {
            this.soundStop(this.instance.allWild);
        }
    }

    /**
     * big win 的音效 預設跑普通贏分音效
     * 直到進入 big win 階段才開始播放大獎音效
     * @param  {Number} stepLevel 第幾階段
     * @param  {Boolean} isFreeGame 是否為 free game
     */
    static playWinStep() {
        this.soundPlay('win');
        this.instance.bigWinStep = 'win';
    }

    /**
     * 停止 big win 音效
     */
    static stopWinStep() {
        if (this.instance.bigWinStep !== '') {
            this.soundStop(this.instance.bigWinStep);
        }
    }

    /**
     * 瞇牌播放音效
     */
    static playSlow() {
        this.soundPlay('speedUp');
    }

    /**
     * 停止瞇牌音效
     */
    static stopSlow() {
        this.soundStop('speedUp');
    }

    // spin 按鈕
    static playBtnSpin() {
        this.soundBtnPlay('btnSpin');
    }

    // stop 按鈕
    static playBtnStop() {
        this.soundBtnPlay('btnStop');
    }

    // 取分 按鈕
    static playBtnTakeWin() {
        this.soundBtnPlay('btnTakeWin');
    }

    // auto 按鈕
    static playBtnAuto() {
        if (this.isCacheKey('btnAuto')) {
            this.soundBtnPlay('btnAuto');
            return;
        }

        this.soundBtnPlay('btnSpin');
    }

    // autoStop 按鈕
    static playBtnAutoStop() {
        this.soundBtnPlay('btnAutoStop');
    }

    // setting 按鈕
    static playBtnSetting() {
        this.soundBtnPlay('btnBase');
    }

    // 增加押線按鈕
    static playBtnAddLine() {
        this.soundBtnPlay('btnAddLine');
    }

    // 減少押線按鈕
    static playBtnSubLine() {
        this.soundBtnPlay('btnSubLine');
    }

    // 增加 bet 按鈕
    static playBtnAddBet() {
        this.soundBtnPlay('btnAddBet');
    }

    // 減少 bet 按鈕
    static playBtnSubBet() {
        if (this.isCacheKey('btnSubBet')) {
            this.soundBtnPlay('btnSubBet');
            return;
        }

        this.soundBtnPlay('btnAddBet');
    }

    // help 按鈕
    static playBtnHelp() {
        this.soundBtnPlay('btnHelp');
    }

    // big win
    static playBigWin(key) {
        if (this.isCacheKey(key)) {
            this.soundPlay(key);
        }

        this.soundPlay('bigWin');
    }

    // big win
    static playAwardEmttier() {
        this.soundPlay('awardEmttier');
    }

    // big win count
    static playAwardCount() {
        this.soundPlay('awardCount');
    }

    // big win count
    static stopAwardCount() {
        this.soundStop('awardCount');
    }

    // big win bg
    static playAwardBg() {
        this.soundPlay('awardBg');
    }

    // big win bg
    static stopAwardBg() {
        this.soundStop('awardBg');
    }

    /**
     * 背景音效
     * @param  {Number} step 哪一個場景的背景音效
     * @param  {Boolean} isFreeGame 是否為 free game
     */
    static playBg(step = 1, isFreeGame = false) {
        this.stopBg();
        let playType = (isFreeGame) ? 'freeBg' : 'bg';

        if (this.instance.music[`${playType}${step}`] !== undefined) {
            playType = `${playType}${step}`;
        }

        if (this.instance.music[playType] === undefined) {
            return;
        }
        this.soundPlay(playType);
        this.instance.bgType = playType;
        this.instance.music[playType].volume = 1;
    }

    /**
     * 背景音效
     * @param  {Number} step 哪一個場景的背景音效
     * @param  {Boolean} isFreeGame 是否為 free game
     */
    static playBonusBg(stage) {
        this.stopBg();

        const playType = `bonus${stage}Bg`;

        this.soundPlay(playType);
        this.instance.bgType = playType;
        this.instance.music[playType].volume = 1;
    }

    /**
     * jackpop背景音效
     */
    static playJackpotBg() {
        this.stopBg();

        const playType = 'jackpotBg';

        this.soundPlay(playType);
        this.instance.bgType = playType;
        this.instance.music[playType].volume = 1;
    }

    static set bgVolume(value) {
        if (this.isCacheKey(this.instance.bgType)) {
            const soundItem = this.instance.music[this.instance.bgType];
            soundItem.volume = value;
        }
    }

    // 停止 bg 音效
    static stopBg() {
        if (this.instance.bgType !== '') {
            this.soundStop(this.instance.bgType);
        }
    }

    // 播放 free game icon 升級音效
    static playFreeIconUpgrade() {
        this.soundStop('freeIconUpgradeHit');
        this.soundPlay('freeIconUpgrade');
    }

    // 播放 free game icon 升級 撞擊音效
    static playFreeIconUpgradeHit() {
        this.soundPlay('freeIconUpgradeHit');
    }

    // 播放 free game 階段性切換 / 進場音效
    static playFreeStep() {
        this.soundPlay('freeStep');
    }

    // 停止 free game 階段性切換 / 進場音效
    static stopFreeStep() {
        this.soundStop('freeStep');
    }

    // 播放 free game 階段性切換 / 進場音效
    static playFreeIdle() {
        this.soundPlay('freeIdle');
    }

    // 停止 free game 階段性切換 / 進場音效
    static stopFreeIdle() {
        this.soundStop('freeIdle');
    }

    // 靜音
    static mute() {
        this.instance.game.sound.mute = true;
    }

    // 解除靜音
    static unMute() {
        this.instance.game.sound.mute = false;
    }

    static set isMuteSound(bool) {
        this.instance.isMute = bool;
    }

    static get isMuteSound() {
        return this.instance.isMute;
    }

    static onPlayCompleteOnce(key, listener, listenerContext) {
        if (this.isCacheKey(key)) {
            const soundItem = this.instance.music[key];
            soundItem.onStop.addOnce(listener, listenerContext);
        }
    }
}

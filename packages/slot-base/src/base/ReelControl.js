import ReelBase from 'base/ReelBase';
import ConfigPasser from 'base/ConfigPasser';

export default class ReelControl extends ReelBase {
    /**
     * @param  {[type]} game       Phaser.Game
     * @param  {Number} reelinx    reel index
     * @param  {Number} symbolWidth Symbol寬
     * @param  {Number} symbolHeight Symbol高
     * @param  {String} Key         載圖使用(目前有使用包圖)
     */
    constructor(game, reelinx, symbolWidth, symbolHeight, Key, offsetY = 0, paddingY = 0) {
        super(game);
        // 告訴此輪的ID位置
        this.reelIndex = reelinx;
        // 秒數轉毫秒的基數
        this.secStep = 0;
        // 跑過幾個symbol
        this.checkRollPassCount = 0;
        // 接到資料後 slow 跑過的 symbol 數
        this.slowCount = 0;

        // 消消樂參數
        this.blowCountLen = 0;
        this.blowCallCount = 0;

        // 收到結果
        this.onGetRNGData = false;
        // 是否 slow
        this.isSlow = false;
        // 是否急停
        this.isEmgStop = false;

        // 最原始停止的 y
        this.originY = 0;
        // 設定移動一格範圍
        this.originMoveY = symbolHeight;
        // Symbol間隔距離
        this.symbolSpace = { x: 0, y: offsetY };
        // symbol 距離 (遮罩用)
        this.paddingY = paddingY;
        // Symbol創建對位
        this.alignPos = { x: symbolWidth * 0.5, y: symbolHeight * 0.5 + offsetY + paddingY };

        // Symbol Key
        this.symbolKey = Key;
        // Symbol Frame
        this.symbolFrame = '';
        // spin 次數
        this.spinCount = 0;

        // Hit
        this.onHitComplete = new Phaser.Signal();
        // 通知完成
        this.onComplete = new Phaser.Signal();
        // 滾輪層
        this.symbolGroup = new Phaser.Group(this.game);
        this.add(this.symbolGroup);
        // 滾輪表現層 (BlowUp)
        this.otherSymbolGroup = new Phaser.Group(this.game);
        this.add(this.otherSymbolGroup);

        // 節奏設定初始化
        this.FIRST_ROLL_SYMBOL_COUNT = 5;   // 第一滾輪滾過多少Symbol後開始接結果;
        this.DIFF_PASS_COUNT_EACH_REEL = 6; // 每個滾輪停止至下個滾輪之間的Symbol數;
        this.ROLLING_SYMBOL = 25;       // 每秒跑過多少Symbol , 如果要調高速度要改SymbolReelMediator -> SLOW_ADD_ROLLING_SYMBOL()
        this.ROLLING_SYMBOL_COUNT = 6;  // 普通停止要跑過多少 symbol
        this.EMG_ROLLING_SYMBOL = 3;    // 急停要跑過多少 symbol
        this.SLOW_ROLLING_SYMBOL = 8;   // 瞇牌每秒跑過多少Symbol
        this.SLOW_ROLLING_PASS_COUNT = 10; // 瞇牌要跑過多少Symbol
        this.SLOW_EMG_ROLLING_PASS_COUNT = 12;  // 瞇牌急停要跑過多少Symbol
        this.DAMPING_SYMBOL_CONUT = 4;  // 進Damping時每秒跑幾個Symbol
        this.DAMPING_DISTANCE = 70;     // Damping位移量
        this.BUFFER_SPEED_STEP = 5;     // Reel slow時的速度緩衝區採用的取樣數目(分段變慢),此 value 越大則越慢變成 SlowSpeed
        this.DAMPING_UP = 0.3;          // 設置DampingUP的基數
        this.SLOW_EMG_STOP_SEC = 1.4;   // 瞇牌急停基數
        this.EMG_STOP_SEC = 0.5;        // 急停基數
        this.RESULT_EMG_STOP_SEC = 0.3; // Damping急停基數

        for (let inx = 0; inx < 5; inx++) {
            // const img = this.symbolGroup.create(
            //     this.alignPos.x,
            //     this.symbolPosition(inx) - this.alignPos.y,
            //     this.symbolKey,
            //     ''
            // );
            const img = new Phaser.Sprite(game, this.alignPos.x, this.symbolPosition(inx) - this.alignPos.y, this.symbolKey, '');
            this.symbolGroup.add(img);
            img.anchor.set(0.5);
        }

        if (ConfigPasser.instance.REEL_STOP_SYMBOL_ANIMATION.length > 0) {
            this.symbolGroup.children.forEach((symbolItem) => {
                const symbolKeysAry = Object.keys(ConfigPasser.instance.SYMBOL_ID_NUM);
                for (let i = 0; i < symbolKeysAry.length; i++) {
                    const symbolID = ConfigPasser.instance.SYMBOL_ID_NUM[symbolKeysAry[i]];
                    symbolItem.loadTexture(`Idle_${symbolID}`, `clip_idle_${symbolID}_1.png`);
                    symbolItem.animations.add(`${symbolID}Idle`, Phaser.Animation.generateFrameNames(`clip_idle_${symbolID}_`, 1, this.game.cache.getFrameCount(`Idle_${symbolID}`), '.png', 1), 24, false);
                }
            }, this);
        }
    }

    // 寫入節奏設定參數
    setSlotDuration(obj) {
        Object.keys(obj).forEach((key) => {
            this[key] = obj[key];
        });
    }

    /**
     * 節奏設定
     * @param {Object} obj 參數
     */
    updateTempo(obj) {
        const slowEmgStopSec = obj.SLOW_EMG_STOP_SEC || this.SLOW_EMG_STOP_SEC;
        const emgStopSec = obj.EMG_STOP_SEC || this.EMG_STOP_SEC;
        const resultEmgStopSec = obj.RESULT_EMG_STOP_SEC || this.RESULT_EMG_STOP_SEC;

        this.setSlotDuration(obj);
        // # duration
        this.durationNormal = Math.floor(1 / obj.ROLLING_SYMBOL * 100) / 100;
        this.durationSlowEmgStop = Math.floor(1 / obj.SLOW_ROLLING_SYMBOL / slowEmgStopSec * 100) / 100;
        this.durationResultSlow = Math.floor(1 / obj.SLOW_ROLLING_SYMBOL * 100) / 100;
        this.durationEmgStop = Math.floor(1 / obj.ROLLING_SYMBOL * emgStopSec * 100) / 100;
        this.durationResultEmgStop = Math.floor(1 / obj.ROLLING_SYMBOL * resultEmgStopSec * 100) / 100;

        // # 設定ReelBase
        // 設定一般停止需要滾過幾個Symbol
        this.setStopRunNum = obj.ROLLING_SYMBOL_COUNT;
        // 設定急停
        this.setEmpRunCount = obj.EMG_ROLLING_SYMBOL;
        // 設定Slow需要滾過幾個
        this.setSlowRunCount = obj.SLOW_ROLLING_PASS_COUNT;

        // # 設定
        // 一般滾輪節奏需要跑過的   第一滾輪數量 + (間隔數量 * 每輪id)
        this.normalSymbolCount = obj.FIRST_ROLL_SYMBOL_COUNT + (obj.DIFF_PASS_COUNT_EACH_REEL * this.reelIndex);
    }

    /**
     * [刷新Symbol] [繼承ReelBase]
     * @param  {[Array<string>]} data [顯示目前的Symbol圖示]
     */
    updateSymbol(data) {
        this.symbolGroup.children.forEach((item, inx) => {
            if (data.length > 0 && inx < data.length) {
                // 使用ID 取得正確的 圖片Key的路徑
                const SymbolID = this.getSymbolName(data[inx]);
                item.loadTexture(this.symbolKey, SymbolID);
            }
        });
    }

    // 取得Symbol圖片
    getSymbolName(symbolKey) {
        const imgName = `${this.symbolFrame}${symbolKey}`;
        const isPng = (this.game.cache.getFrameByName(this.symbolKey, `${imgName}.png`));
        const ext = (isPng) ? 'png' : 'jpg';

        return `${imgName}.${ext}`;
    }

    // 計算軸高的創建物件位置 Symbol高 * rowindex + Symbol高的間隔距離 * rowindex
    symbolPosition(rowindex) {
        return (this.originMoveY + this.symbolSpace.y + this.paddingY) * rowindex;
    }

    /**
     * 取得Reel Slow時,由高速(_ROLLING_SYMBOL)變為低速(_SLOW_ROLLING_SYMBOL)過程緩衝區的速度
     * eg.若直接將速度由 20->8 ,看起來會頓挫感明顯,因此增加此速度漸變的緩衝
     * @return {number} tarBufferSpeed 間隔的速度
     */
    get getBufferSpeed() {
        const myshift = (this.ROLLING_SYMBOL - this.SLOW_ROLLING_SYMBOL) / this.BUFFER_SPEED_STEP;
        const Speed = this.ROLLING_SYMBOL - myshift * this.slowCount;
        return (Speed < this.SLOW_ROLLING_SYMBOL) ? this.SLOW_ROLLING_SYMBOL : Speed;
    }

    // 設定要載入的Symbol檔名
    set setSymbolName(str) {
        this.symbolFrame = str;
    }

    // 收到RNG
    onStopRolling(reciveIndex, isSlow) {
        // 接到結果
        this.onGetRNGData = true;
        // 設定結果位置
        this.rangeReciveIndex = reciveIndex;
        // 設定Slow位置
        this.slowReelIndex = -1;
        // 設定Slow功能
        this.isSlow = isSlow;

        if (this.reelEffect !== null) {
            // 取消咪牌
            this.slowClose();
            this.reelEffect.spin(this.reelEffect.easedata, this.symbolGroup, this.otherSymbolGroup, this.spinRowsComplete, this);
        }
    }

    // 收到RNG但不停止
    onKeepRolling(reciveIndex, isSlow) {
        // 接到結果
        this.onGetRNGData = false;
        // 設定結果位置
        this.rangeReciveIndex = reciveIndex;
        // 設定Slow位置
        this.slowReelIndex = -1;
        // 設定Slow功能
        this.isSlow = isSlow;

        if (this.reelEffect !== null) {
            // 取消咪牌
            this.slowClose();
            this.reelEffect.spin(this.reelEffect.easedata, this.symbolGroup, this.otherSymbolGroup, this.spinRowsComplete, this);
        }
    }

    // 一般轉動 [Spin Mode]
    spin(reelData = undefined) {
        this.reelEffect = null;
        // Feature
        if (reelData !== undefined) {
            this.reelEffect = reelData;
            return;
        }
        this.states = ReelControl.NORMAL;
        this.spinPlaySpeedMode();
    }

    spinRowsComplete() {
        this.reelEffect = null;
        // ＃ 重置 ReelBase 的狀態 呼叫ReelBase完成動作並且儲存資料
        this.callComplete();
        const data = this.getBeforeEndSymbolData;
        // 設定寫入更換後的資料
        this.writeEndSymbolData = data;
        // 重新刷新更換後的畫面資料
        this.updateSymbol(data);
        // 顯示滾輪Symbol
        this.showAllSymbolIcon(true);
        // 移除動畫用的Symbol
        this.otherSymbolGroup.removeAll();
        // damping 結束 發送父層此輪滾輪已完成
        this.onComplete.dispatch(this.reelIndex);
    }

    // ReSpin [Spin Mode]
    reSpin() {
        this.states = ReelControl.EMG_STOP;
        this.spinPlaySpeedMode();
    }

    // 消消樂Spin [Spin Mode]
    blowUpSpin() {
        // 消消樂沒有瞇牌
        this.slowClose();
        // 取出目前紀錄的最終結果值
        const changeNowData = this.getEndSymbolData;
        const countIndexAry = [];
        const effectAry = [];
        const effectImgAry = [];
        // 撈當前Symbol創建的Group判斷
        this.symbolGroup.children.forEach((item, inx) => {
            // 消消樂是依照前端顯示visible 為 false認定為此格symbol以消掉
            if (item.visible === false) {
                // 紀錄當前被消掉索引
                countIndexAry.push(inx);
            }
            // 判斷symbol物件visible為true且索引值不等於爆框的Symbol
            if (item.visible === true && inx > 0 && inx < this.symbolGroup.children.length - 1) {
                // 創建需要表示Symbol的掉落動畫的新Group 而不修改原Group位置怕影響位置全歪掉
                const img = this.otherSymbolGroup.create(
                    this.alignPos.x,
                    this.symbolPosition(inx) - this.alignPos.y,
                    this.symbolKey,
                    this.getSymbolName(changeNowData[inx])
                );
                img.anchor.set(0.5);
                // 紀錄圖片
                effectImgAry.push(img);
                // 紀錄索引
                effectAry.push(inx);
            }
        });
        // 隱藏後面滾輪條
        this.showAllSymbolIcon(false);
        // 取出此輪中獎位置的紀錄長度
        this.blowCountLen = countIndexAry.length;
        // 沒中的輪
        if (this.blowCountLen <= 0) {
            // 取出目前顯示位置 並且覆蓋 設定在結果位置
            this.rangeReciveIndex = this.setRangeIndex;
            // 重置 ReelBase 的狀態
            this.callComplete();
            // 重新設定滾輪
            this.writeEndSymbolData = changeNowData;
            // 顯示Reel滾輪得原始Symbol
            this.showAllSymbolIcon(true);
            // 清除其他特效Symbol
            this.otherSymbolGroup.removeAll();
            // damping 結束 發送父層此輪滾輪已完成
            this.onComplete.dispatch(this.reelIndex);
            return;
        }
        // 動畫秒數 1 * (index - firstIndex);
        const blowSec = 0.15;
        // 延遲時間
        const blowDealy = 0;
        // 掉下組的間隔時間
        const blowUpSpace = 0.10;
        // 原畫面消掉 掉落第一波
        // 中獎數量大於0
        for (let i = 0; i < effectImgAry.length; i++) {
            // 取出現有存在的位置
            const firstIndex = effectAry[i];
            let index = effectAry[i];
            for (let j = 0; j < countIndexAry.length; j++) {
                // 判斷當位置小於中獎位置
                if (index <= countIndexAry[j]) {
                    index++;
                }
            }
            if (index > firstIndex) {
                const symbolItem = effectImgAry[i];
                const dampingDown = TweenLite.to(symbolItem, blowSec, {
                    y: this.symbolPosition(index) - this.alignPos.y,
                    onComplete: () => {
                        dampingDown.kill();
                        // 判段是否停止的聲音還是hit聲    空值:普通 damping , 不等於空值:播放特殊聲音
                        this.onHitComplete.dispatch(this.reelIndex, 1);
                    }
                });
            }
        }
        // 填入已消掉的次數取出需要掉落的Data
        const nextData = this.getAddCountSymbolData(this.blowCountLen);
        // 已消除Symbol的數量來取出需要移動後的真實資料的位置
        const nextNowData = nextData.slice(0, this.blowCountLen + 1);
        // 複製目前結果
        const clearNowData = changeNowData.concat();
        // 並且清除clearNowData已中獎的Symbol
        for (let i = this.blowCountLen; i > 0; i--) {
            const rows = countIndexAry[i - 1];
            clearNowData.splice(rows, 1);
        }
        // 再移除第一組資料
        clearNowData.splice(0, 1);
        // 組合資料
        const reSpinData = nextNowData.concat(clearNowData);
        // 記錄需要掉落新Symbol數量長度
        const donwNum = nextNowData.length;
        // 計算控制掉落時間
        const timeEffect = blowSec + (blowSec / donwNum);
        // 設置從上面掉落下來的動畫效果 原畫面消掉 掉落第二波
        for (let i = donwNum; i > 0; i--) {
            // 取出掉落的數量長度
            const newIndex = i - donwNum;
            // 重新編排位置不可以在中獎位置上必須往上延伸
            const imgIndex = i - 1;
            const img = this.otherSymbolGroup.create(
                this.alignPos.x,
                this.symbolPosition(newIndex) - this.alignPos.y,
                this.symbolKey,
                // 設定掉落的滾輪資料
                this.getSymbolName(nextNowData[imgIndex])
            );
            let effectMode = (imgIndex === 1) ? 3 : 2;
            if (imgIndex === 0) {
                effectMode = 0;
            }

            // console.log('donwNum', donwNum, timeEffect, `輪:${this.reelIndex}`, effectMode);
            img.anchor.set(0.5);
            const blowDownTween = TweenLite.to(img, timeEffect, {
                y: this.symbolPosition(newIndex + this.blowCountLen) - this.alignPos.y,
                delay: blowDealy + blowUpSpace + timeEffect,
                onComplete: () => {
                    blowDownTween.kill();
                    // 在Down的Tween完成時播放聲音
                    this.onHitComplete.dispatch(this.reelIndex, effectMode);
                }
            });
        }
        // 設定延遲多久回調此輪已停止事件
        this.blowOverComplete = TweenLite.to(this, 1, {
            // 計算所有動畫使用總時間
            delay: blowDealy + blowUpSpace + timeEffect + blowSec,
            onComplete: () => {
                // console.log('onComplete', this.setRangeIndex);
                // 取出目前顯示位置 並且覆蓋 設定在結果位置
                this.rangeReciveIndex = this.setRangeIndex;
                // 刪除動畫效果
                this.blowOverComplete.kill();
                // ＃ 重置 ReelBase 的狀態 呼叫ReelBase完成動作並且儲存資料
                this.callComplete();
                // 設定寫入更換後的資料
                this.writeEndSymbolData = reSpinData;
                // 重新刷新更換後的畫面資料
                this.updateSymbol(reSpinData);
                // 顯示滾輪Symbol
                this.showAllSymbolIcon(true);
                // 移除動畫用的Symbol
                this.otherSymbolGroup.removeAll();
                // damping 結束 發送父層此輪滾輪已完成
                this.onComplete.dispatch(this.reelIndex);
            }
        });
    }

     // 設置轉動速度模式
    spinPlaySpeedMode(type = '') {
        // [Slot Speed狀態]  使用目前狀態 : 暫時想跑的狀態 但不更變目前狀態
        const STATUS = (type === '') ? this.states : type;
        // 時間
        let duration;

        switch (STATUS) {
            case ReelControl.NORMAL: // 一般轉動
            case ReelControl.STOP:   // 一般停止(damping)
                duration = this.durationNormal;
                break;
            // 急停
            case ReelControl.EMG_STOP:
                duration = this.durationEmgStop;
                break;
            // damping 中急停
            case ReelControl.DAMPING_EMG_STOP:
                duration = this.durationResultEmgStop;
                break;
            // 瞇牌
            case ReelControl.SLOW:
                // 此部份修改因Reel Slow時速度由快變慢的差距過大,
                // 所以增加速度緩衝區來漸變速度 e.g. 20 -> 17 -> 14 -> 11 遞減速度
                duration = (this.slowCount < this.BUFFER_SPEED_STEP)
                    ? (1 / this.getBufferSpeed)
                    : this.durationResultSlow;
                break;
            // 瞇牌停止
            case ReelControl.SLOW_STOP:
                duration = this.durationResultSlow;
                break;
            // 瞇牌急停
            case ReelControl.SLOW_EMP_STOP:
                duration = this.durationSlowEmgStop;
                break;
            default:
        }
        // SpinLoop 設定移動動畫Tween
        this.TweenLoop = TweenLite.to(this.symbolGroup, duration + this.secStep, {
            y: this.originMoveY,
            onComplete: () => {
                // 清除目前已跑完的 SpinLoop Tween
                this.TweenLoop.kill();
                // 還原初始位置
                this.symbolGroup.y = this.originY;
                this.onSpinLoop();
            },
            ease: Linear.easeNone
        });
    }

    // 每次移動一格後進行刷新Symbol
    onSpinLoop() {
        // concatRange 銜接滾輪的特別處理
        if (this.isConcatRange) {
            const isEmgStop = (this.states === ReelControl.EMG_STOP || this.states === ReelControl.DAMPING_EMG_STOP);
            const needStopNum = (isEmgStop) ? this.empRunCount : this.concatDisplayNum;
            this.spinCount++;
            if (this.spinCount >= needStopNum || this.DIFF_PASS_COUNT_EACH_REEL < needStopNum || isEmgStop) {
                this.isConcatRange = false;
                // 恢復原本的滾輪表
                this.setRangeData = this.concatData;
                // 計數歸 0
                this.spinCount = 0;
                // 設定目前顯示Rng位置
                this.setRangeIndex = this.setRangeIndex - needStopNum;
                this.writeEndSymbolData = this.getBeforeEndSymbolData;
                // 刷新目前顯示Symbol圖示
                this.updateSymbol(this.getBeforeEndSymbolData);
            }
        }

        switch (this.states) {
            // 一般轉動
            case ReelControl.NORMAL: {
                // 切換下一個要顯示的Symbol
                this.callNextFrame();
                // 尚未收到RangData時 繼續Loop
                if (!this.onGetRNGData) {
                    // 沒收到Spin結果, 不改變狀態機,繼續跑NORMAL模式
                    this.spinPlaySpeedMode();
                    return;
                }
                // 得到資料後 計算Loop每跑過一個Symbol次數
                this.checkRollPassCount++;
                // 讀取到需要急停
                if (this.isEmgStop) {
                    // 急停模式
                    this.states = ReelControl.DAMPING_EMG_STOP;
                    this.spinPlaySpeedMode();
                    return;
                }
                // 接到結果 尚未跑完節奏 繼續跑滾輪
                if (this.checkRollPassCount < this.normalSymbolCount) {
                    // 不改變狀態機,繼續跑NORMAL模式
                    this.spinPlaySpeedMode();
                    return;
                }
                // ＃ 以下為 轉動節奏完成後是否切換至 [一般停止] 或是 [Slow] 模式狀態
                this.states = (this.isSlow) ? ReelControl.SLOW : ReelControl.STOP;
                this.spinPlaySpeedMode();
                break;
            }
            // 一般停止
            case ReelControl.STOP: {
                // [急停模式] 切換目前 一般停止狀態更改為急停狀態
                if (this.isEmgStop) { this.states = ReelControl.DAMPING_EMG_STOP; }
                // 切換下一格Symbol 判斷是否可以停止
                const isStopDown = this.callSymbolStop();
                (isStopDown) ? this.finalDamping() : this.spinPlaySpeedMode();
                break;
            }
            case ReelControl.DAMPING_EMG_STOP:  // Damping中急停
            case ReelControl.EMG_STOP: {        // 一般急停
                // 切換下一格Symbol 判斷是否可以停止
                const isEmgDown = this.callSymbolEmpStop();
                (isEmgDown) ? this.finalDamping() : this.spinPlaySpeedMode();
                break;
            }
            // 瞇牌 Loop
            case ReelControl.SLOW: {
                // 切換下一個要顯示的Symbol
                this.callNextFrame();
                // 如果此輪為目前顯示Slow軸
                if (this.slowReelIndex === this.reelIndex) {
                    this.states = ReelControl.SLOW_STOP;
                    this.spinPlaySpeedMode(ReelControl.SLOW);
                    return;
                }
                // 瞇牌中快速Loop尚未顯示瞇牌效果時 立即急停
                if (this.isEmgStop) {
                    this.states = ReelControl.DAMPING_EMG_STOP;
                    this.spinPlaySpeedMode();
                    return;
                }
                // 讀取到this.isSlow === false 代表此輪沒有要瞇牌 改回一般停
                if (this.isSlow === false) {
                    this.states = ReelControl.STOP;
                    this.spinPlaySpeedMode();
                    return;
                }
                this.spinPlaySpeedMode(ReelControl.NORMAL);
                break;
            }
            // 瞇牌停止
            case ReelControl.SLOW_STOP: {
                // 累積減緩速度
                this.slowCount++;
                // 切換下一格Symbol 判斷是否為進入Slow瞇牌前需要滾過的起始位置
                const isEnterSlow = this.callSymbolSlowStop();
                // 此輪為Slow輪
                if (isEnterSlow) {
                    this.finalDamping();
                    return;
                }
                // 瞇牌停止中切換瞇牌急停
                if (this.isEmgStop && !this.isSlow) {
                    // 清除當前SlowStop組的資料狀態
                    this.callClearNowEmp();
                    // 清除後,切換一般急停,並且在組一次新的急停資料
                    this.states = ReelControl.DAMPING_EMG_STOP;
                    this.spinPlaySpeedMode();
                    return;
                }
                // 尚未進入斷點 切回Slow速度(動態slowCount來決定速度)
                this.spinPlaySpeedMode(ReelControl.SLOW);
                break;
            }
            // 瞇牌急停
            case ReelControl.SLOW_EMP_STOP: {
                // 切換下一格Symbol 判斷是否可以停止
                const isSlowEmgDown = this.callSymbolSlowStop();
                (isSlowEmgDown) ? this.finalDamping() : this.spinPlaySpeedMode();
                break;
            }
            default:
        }
    }

    // 變臉換圖
    setChangeSymbolImg(rows, symbolID) {
        const changeNowData = this.getEndSymbolData;
        changeNowData[rows] = symbolID;
        // 設定寫入更換後的
        this.writeEndSymbolData = changeNowData;
        // 刷新Symbol畫面
        this.updateSymbol(changeNowData);
    }

    // damping 最後的動作
    finalDamping() {
        // 重置 ReelBase 的狀態
        this.callComplete();

        // Loop狀態切換不做任何動作,已經進入表演停止抖動的動畫了
        this.states = ReelControl.IDLE;
        // 當此輪為Slow且非急停         （true : Slow自然停止 , false : 停止)
        const isSlowBool = (this.reelIndex === this.slowReelIndex && this.isSlow && !this.isEmgStop);
        // 計算一般轉動Damping時間       dampingDown Damping位移量 / (每秒跑過多少Symbol * Symbole高)
        const downDampingValue = this.DAMPING_DISTANCE / (this.ROLLING_SYMBOL * this.originMoveY);
        // 計算Slow轉動Damping時間      Damping位移量 / (2 * Symbole高)
        const slowDampingValue = this.DAMPING_DISTANCE / (2 * this.originMoveY);
        // 設定Damping Down的時間       Slow轉動Damping時間  :  一般轉動Damping時間
        const slowDampingDown = (isSlowBool) ? slowDampingValue : downDampingValue;
        // 設定Damping Up的時間         Slow轉動Damping時間  :  DampingUP的基數 - 普通轉動Damping時間
        const slowDampingUp = (isSlowBool) ? slowDampingValue : this.DAMPING_UP - downDampingValue;

        // 判段是否停止的聲音還是hit聲    空值:普通 damping , 不等於空值:播放特殊聲音
        // this.onHitComplete.dispatch(this.reelIndex);  // 在Down的Tween之前播放聲音

        // 抖動 [Down]     目前座標 + Damping位移量
        this.tweenDampingDown = TweenLite.to(this.symbolGroup, slowDampingDown + this.secStep, {
            y: this.symbolGroup.y + this.DAMPING_DISTANCE,
            ease: Linear.easeNone,
            onComplete: () => {
                this.tweenDampingDown.kill();
                // 判段是否停止的聲音還是hit聲    空值:普通 damping , 不等於空值:播放特殊聲音
                this.onHitComplete.dispatch(this.reelIndex, 0);
            }
        });
        // 抖動 [Up]     回到原本位置
        this.tweenDampingUp = TweenLite.to(this.symbolGroup, slowDampingUp + this.secStep, {
            y: this.originY,
            delay: slowDampingDown + this.secStep,
            onComplete: () => {
                this.tweenDampingUp.kill();
                // damping 結束 發送父層此輪滾輪已完成
                this.onComplete.dispatch(this.reelIndex);
            },
            ease: Linear.easeNone
        });
    }

    // 以下函數供給主層呼叫使用 Call
    // 刷新
    reset() {
        // 是否接收到結果 重置
        this.onGetRNGData = false;
        // 是否接收到急停訊號 重置
        this.isEmgStop = false;
        // 接到結果後跑過幾個symbol 重置
        this.checkRollPassCount = 0;
        // 此輪是否Slow 重置
        this.isSlow = false;
        this.slowClose();
        // 狀態重置
        this.states = ReelControl.IDLE;
        // Slow 緩衝重置
        this.slowCount = 0;
        // 還原初始位置
        this.symbolGroup.y = this.originY;
        // 消消樂參數重置
        this.blowCountLen = 0;
        this.blowCallCount = 0;
    }

    /**
     * 重新設定 Range 與位置顯示
     * @param  {Array} rngData          滾輪表 strip
     * @param  {Number} [rangeIndex]  更換表後的 rng 位置
     */
    reSetRange(rngData, rangeIndex = undefined) {
        // 紀錄此輪的Rng總表
        this.setRangeData = rngData;
        if (rangeIndex !== undefined) {
            // 設定目前顯示Rng位置
            this.setRangeIndex = rangeIndex;
            this.rangeReciveIndex = rangeIndex;
        }
        // 寫入最後停止時的Symbol結果紀錄
        this.writeEndSymbolData = this.getBeforeEndSymbolData;
        // 刷新目前顯示Symbol圖示
        this.updateSymbol(this.getBeforeEndSymbolData);
    }

    /**
     * reSetRange 功能的延伸，合併目前頁面顯示的 symbol 接上要換的 strip
     * @param  {Array} rngData          滾輪表 strip
     * @param  {Number} [rangeIndex=1]  更換表後的 rng 位置
     * @param  {Number} [cutNumFrom=1]  切掉的rng（通常用來切掉最下面不會跑過的位置）
     */
    concatRange(rngData, rangeIndex = 1, cutNumFrom = 1) {
        this.isConcatRange = true;
        this.concatData = rngData;
        const nowData = this.getEndSymbolData.slice(cutNumFrom, this.getEndSymbolData.length);
        const newData = nowData.concat(rngData);

        this.concatDisplayNum = nowData.length;

        // 紀錄此輪的Rng總表
        this.setRangeData = newData;
        // 設定目前顯示Rng位置
        this.setRangeIndex = rangeIndex;
        this.rangeReciveIndex = rangeIndex;
        // 寫入最後停止時的Symbol結果紀錄
        this.writeEndSymbolData = this.getBeforeEndSymbolData;
        // 刷新目前顯示Symbol圖示
        this.updateSymbol(this.getBeforeEndSymbolData);
        return true;
    }

    // 重新設定有變換Symbol Data資料
    reSetRangeOverData(rngData, rangeIndex) {
        this.rangeReciveIndex = rangeIndex;
        // 設定寫入更換後的
        this.writeEndSymbolData = rngData;
        this.updateSymbol(rngData);
    }

    // 清除Slow資料
    slowClose() {
        this.slowReelIndex = -1;
        this.isSlow = false;
    }

    // 急停
    onEmgStopRolling() {
        this.isEmgStop = true;
    }

    /**
     * 通知並記錄 當前的 slow 是哪一軸
     * @param  {Number} slowReelIndex 第幾軸
     */
    onSlowRolling(slowReelIndex) {
        this.slowReelIndex = slowReelIndex;
    }

    // 隱藏Symbol標記
    hideSymbolIcon(localnum) {
        this.symbolGroup.children.forEach((item, inx) => {
            if (inx === localnum || item.frameName === undefined) {
                item.visible = false;
            }
        });
    }

    /**
     * @param {Boolean} bool 是否讓 symbol 灰掉
     */
    tintSymbol(bool) {
        this.symbolGroup.children.forEach((item) => {
            item.tint = (bool) ? 0x666666 : 0xFFFFFF;
        });
    }

    // 所有Symbol是否顯示
    showAllSymbolIcon(bool = true) {
        this.symbolGroup.children.forEach((item) => {
            if (item.frameName !== undefined) {
                item.visible = bool;
            }
        });
    }

    symbolIdleAnimation(row, symbolID) {
        const item = this.symbolGroup.children[row + 1];
        item.loadTexture(`Idle_${symbolID}`, `clip_idle_${symbolID}_1.png`);
        item.animations.play(`${symbolID}Idle`, ConfigPasser.instance.SYMBOL_IDLE_FPS[symbolID], false);
    }

    symbolIdleStop(row, symbolID) {
        const item = this.symbolGroup.children[row + 1];
        if (!item.animations.getAnimation(`${symbolID}Idle`)) {
            return;
        }
        if (item.animations.getAnimation(`${symbolID}Idle`).isPlaying) {
            item.animations.stop(null, true);
            item.loadTexture(`Idle_${symbolID}`, `clip_idle_${symbolID}_1.png`);
        }
    }
}
ReelControl.IDLE = 'idle';
ReelControl.NORMAL = 'normal';
ReelControl.STOP = 'stop';
ReelControl.EMG_STOP = 'emgstop';
ReelControl.DAMPING_EMG_STOP = 'resultEmgStop';
ReelControl.SLOW = 'slow';
ReelControl.SLOW_STOP = 'slowstop';
ReelControl.SLOW_EMP_STOP = 'slowempstop';

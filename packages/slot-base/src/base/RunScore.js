import Tool from 'base/Tool';
import Sound from 'base/Sound';

export default class RunScore extends Phaser.Group {
    constructor(game, font, sizeAdjust) {
        super(game);
        /** 是否快速停止 */
        this.isimmediatelyEnd = false;
        /** 階段 */
        this.stepData = [];
        /** 最大階段 */
        this.stepMaximum = -1;
        /** 階段index */
        this.stepInx = 0;
        /** 階段fun */
        this.stepEventFun = undefined;
        /** 階段context */
        this.stepContext = undefined;
        /** 階段Offon */
        this.easeBool = false;
        /** 階段time ease*/
        this.durationTime = 0;
        /** 狀態結束觸發 */
        this.onComplete = new Phaser.Signal();
        // 字體
        this.font = font;
        // 文字物件
        this.item = this.containerCreate(sizeAdjust);
        // 字型大小
        this.fontSize = this.item.fontSize;
        this.addInputEvent();
        // 數值
        this.sNowShowNum = 0;
        // 幣別
        this.currencySign = '';
        // use Denom
        this.DenomDefine = 0;
        // 是否要小數點
        this.isShowDecimal = false;
        // 小數點是否固定顯示欄位
        this.isDecimalFix = false;
        // 是否要千分位
        this.isShowComma = false;
        // 目前顯示的值
        this.ShowTextPack = '';
    }

    /**
     * 數字按下事件
     * @param {Function} callBack 回調函數
     */
    addInputEvent(callBack) {
        this.item.inputEnabled = true;
        this.item.events.onInputDown.add(() => {
            if (callBack) {
                callBack();
            }
        });
    }

    /**
     * [設定幣別符號]
     * @param  {[String]} value [符號]
     */
    set setCurrencySign(value) {
        this.currencySign = value;
        this.writeShowNumber(this.sNowShowNum);
    }

    /**
     * [設定幣別符號]
     * @param  {[String]} value [符號]
     */
    set setCurrencyDenomSign(value) {
        this.currencySign = value;
        const strnum = this.callDenodefValue(this.sNowShowNum);
        this.writeShowNumber(strnum);
    }

    /**
     * [設定是否小數點]
     * @param  {[Boolean]}  bool [description]
     */
    set isDecimal(bool) {
        this.isShowDecimal = bool;
    }

    /**
     * [小數點固定]
     * @param {Boolean}  bool [description]
     */
    set isDecimalFixed(bool) {
        this.isDecimalFix = bool;
    }

    /**
     * [設定是否顯示千分位]
     * @param  {[Boolean]}  bool [description]
     */
    set isComma(bool) {
        this.isShowComma = bool;
    }

    set setDenomDef(value) {
        this.DenomDefine = value;
    }

    callDenodefValue(num) {
        let point = num;
        if (this.currencySign !== '') {
            const rate = Tool.accMul(num, this.DenomDefine);
            point = Tool.accDiv(rate, 100);
        }
        return point;
    }

    /**
     * 顯示數字(靜態)
     * @param  {string}      sNumber  數字
     * @param  {Boolean}     bool     是否經過DenomDefine運算
    */
    showNum(sNumber, bool = false) {
        this.sNowShowNum = sNumber;
        const strnum = (bool) ? this.callDenodefValue(this.sNowShowNum) : this.sNowShowNum;
        this.writeShowNumber(strnum);
    }

    // 顯示數字 (跑分功能)
    runScoreTime(startNum, endNum, duration, context, callBack, sound = '') {
        this.clearNumber();
        this.timeScore = {
            // 起始值
            data: startNum,
            // 結束值
            endData: endNum
        };

        const valueObj = {};
        // get value
        valueObj.getValue = () => this.timeScore.data;
        // set value
        valueObj.setValue = (val) => {
            this.timeScore.data = val;
            this.runNum(this.timeScore.data);
        };

        this.runScoreTween = new TimelineLite();
        // 起始值
        this.runNum(this.timeScore.data);

        const playSound = endNum - startNum > 0 ? sound : '';

        this.stepData.forEach((ele, inx) => {
            if (endNum >= ele) {
                this.stepMaximum = inx + 1;
            }
        });

        this.runScoreTween.to(valueObj, duration, {
            setValue: endNum,
            ease: Phaser.Easing.Linear.None,
            onUpdate: () => {
                Sound.soundPlay(playSound);
                // 急停
                if (this.isimmediatelyEnd) {
                    this.runScoreTween.kill();
                    this.runNum(this.timeScore.endData, true);
                    if (callBack) {
                        callBack.call(context);
                    }
                }
            },
            onComplete: () => {
                this.runNum(this.timeScore.endData, true);
                this.runScoreTween.kill();
                if (callBack) {
                    callBack.call(context);
                }
            }
        });
    }
    /**
     * 快速停止(用於跑分)
     */
    immediatelyRunEnd() {
        this.isimmediatelyEnd = true;
    }

    /**
     * set 階段
     * @param {Array<number>}   data        設定分數變大
     * @param {Boolean}         easeBool    是否以緩動方式變大
     * @param {number}          duration    當緩動開啟 此參數為緩動時間
     */
    setStepData(data, easeBool = false, duration = 0.2) {
        this.stepData = data;
        this.easeBool = easeBool;
        this.durationTime = duration;
    }

    /**
     * 階段性callback
     * @param {function} fn [設定callBack]
     * @param {context} context [設定callBack 的context]
     */
    setStepFun(fn, context) {
        this.stepEventFun = fn;
        this.stepContext = context;
    }

    /**
     * 階段判斷
     * @param {number} num  數字
     */
    stepEvent(num) {
        if (num >= this.stepData[this.stepInx]) {
            this.stepInx++;
            (this.easeBool) ? this.easeingAnScale() : this.setAnScale();
        }
    }

    /** 直接階段變大 */
    setAnScale() {
        this.item.fontSize = this.fontSize + 4;
        // 回調階段事件
        this.onCallBackstep();
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    /** 緩衝階段變大 */
    easeingAnScale() {
        const tween = TweenLite.to(this.item, this.durationTime, {
            fontSize: '+=4',
            onComplete() {
                tween.kill();
            }
        });
        this.onCallBackstep();
    }
    /**
     * [發布階段性事件]
     */
    onCallBackstep() {
        if (this.stepEventFun !== undefined) {
            const stepInx = this.isimmediatelyEnd ? this.stepMaximum : this.stepInx;
            this.stepEventFun.call(this.stepContext, stepInx);
        }
    }

    /**
    * 數字顯示 (用於跑分有階段版)
    * @param {string}   sShowNumber      顯示的數字
    * @param {Boolean}  completeDispath  是否跑分完畢的最後結果
    */
    runNum(sShowNumber, completeDispath = false) {
        this.sNowShowNum = sShowNumber;
        const strnum = this.callDenodefValue(sShowNumber);
        this.writeShowNumber(strnum);
        // 階段
        if (this.stepData.length > 0 && this.sNowShowNum !== '' && this.stepInx < this.stepData.length) {
            this.stepEvent(Number(this.sNowShowNum));
        }
        // 是否跑分完畢
        if (completeDispath) {
            this.onComplete.dispatch(); // 跑分完畢回調 分數已完成跑分(全部)
        }
    }

    writeShowNumber(num) {
        if (this.item !== undefined) {
            // 是否顯示小數點
            let sNum = (this.isShowDecimal) ? this.caculateDecimal(+num) : `${num}`.split('.')[0];
            // 計算有幾個逗點，把逗點加入到字串中(千分位)
            if (this.isShowComma) {
                let iCommaNum = 0;
                let arrNumber = [];
                let sChangeShowNum = '';
                arrNumber = `${sNum}`.split('.');
                iCommaNum = arrNumber[0].length;
                for (let j = 0; j < iCommaNum; j++) {
                    sChangeShowNum += (j % 3 === iCommaNum % 3 && j !== 0)
                    ? `,${arrNumber[0].charAt(j)}`
                    : arrNumber[0].charAt(j);
                }
                sNum = (arrNumber.length > 1 && this.isShowDecimal)
                ? `${sChangeShowNum}.${arrNumber[1]}`
                : sChangeShowNum;
            }

            this.ShowTextPack = `${sNum}`;
            this.item.text = `${this.currencySign}${this.ShowTextPack}`;
        }
    }

    set tint(value) {
        this.item.tint = value;
    }

    randomPop(rangeAry) {
        if (this.stop) {
            return;
        }
        let randomInx = this.generateRandomIndex(rangeAry.length);
        if (randomInx === this.latestInx) {
            randomInx = randomInx + 1 === rangeAry.length ? randomInx - 1 : randomInx + 1;
        }
        this.latestInx = randomInx;
        this.showNum(rangeAry[randomInx]);

        let popTween = new TimelineMax();
        popTween
        .fromTo(this.item.scale, 0.1,
            {
                x: 0.8,
                y: 0.8
            },
            {
                x: 1.2,
                y: 1.2,
                ease: Power0.easeNone
            }
        , 'a')
        .fromTo(this.item, 0.1,
            {
                alpha: 0
            },
            {
                alpha: 0.75,
                ease: Power0.easeNone
            }
        , 'a')
        .to(this.item.scale, 0.16,
            {
                x: 0.8,
                y: 0.8,
                ease: Power3.easeIn
            }
        , 'b')
        .to(this.item, 0.16,
            {
                alpha: 0.2,
                ease: Power3.easeIn
            }
        , 'b')
        .to(this.item.scale, 0.12,
            {
                x: 2,
                y: 2,
                ease: Power3.easeOut
            }
        , 'c')
        .to(this.item, 0.1,
            {
                alpha: 0,
                ease: Power3.easeOut,
                onComplete: () => {
                    this.randomPop(rangeAry);
                    popTween.progress(1).kill();
                    popTween = null;
                }
            }
        , 'c');
    }

    specificPop(multiply, callbackTarget, callbackFunc) {
        this.stop = true;
        this.showNum(multiply);
        let specificTween = new TimelineMax();
        specificTween
        .fromTo(this.item.scale, 0.15,
            {
                x: 0.8,
                y: 0.8
            },
            {
                x: 2.5,
                y: 2.5,
                ease: Power0.easeNone
            }
        , 'a')
        .fromTo(this.item, 0.15,
            {
                alpha: 0
            },
            {
                alpha: 0.5,
                ease: Power0.easeNone
            }
        , 'a')
        .to(this.item.scale, 0.2,
            {
                x: 1.5,
                y: 1.5,
                ease: Power0.easeNone
            }
        , 'b')
        .to(this.item, 0.2,
            {
                alpha: 0.75,
                ease: Power0.easeNone
            }
        , 'b')
        .to(this.item.scale, 0.15,
            {
                x: 1,
                y: 1,
                ease: Power0.easeNone
            }
        , 'c')
        .to(this.item, 0.15,
            {
                alpha: 1,
                ease: Power0.easeNone,
                onComplete: () => {
                    if (callbackFunc) {
                        callbackFunc.call(callbackTarget);
                    }
                    specificTween.progress(1).kill();
                    specificTween = null;
                }
            }
        , 'c');
    }

    generateRandomIndex(length) {
        return Math.floor(Math.random() * length);
    }

    // ------ -------
    /**
     * 創建目標
     * @param {Number} sizeAdjust 初始 size 的偏差值
     * @return {Object} item bitmap 文字
     */
    containerCreate(sizeAdjust = 0) {
        const item = new Phaser.BitmapText(this.game, 0, 0, this.font, '');
        item.fontSize += sizeAdjust;
        item.anchor.set(0.5);
        this.addChild(item);
        return item;
    }

    /**
     * 手動設定 anchor
     * @param {Number} x anchor X
     * @param {Number} y anchor Y
     */
    setfontAnchor(x, y) {
        this.item.anchor.set(x, y);
    }

    /**
     * @param {Boolean} clearBool 是否清除文字
     */
    clearNumber(clearBool = true) {
        if (this.runScoreTween !== undefined) {
            this.showNum(this.timeScore.endData);
            this.runScoreTween.kill();
        }

        this.isimmediatelyEnd = false;
        this.stepInx = 0;
        if (clearBool) {
            this.item.text = '';
        }
        this.item.fontSize = this.fontSize;
    }

    /**
    * 取小數點
    * @param {any} num 數字
    * @param {number} count 第幾位
    * @return {string} str2 '1500'
    */
    caculateDecimal(num, count = 2) {
        const str = `${num}`;
        let icount = count;
        let str2 = '';
        let isPoint = false;
        for (let i = 0; i < str.length; i++) {
            if (icount > 0) {
                str2 += str.charAt(i);
                if (str.charAt(i - 1) === '.') {
                    isPoint = true;
                }
                if (isPoint === true) {
                    icount--;
                }
            }
        }

        if (this.isDecimalFix) {
            if (!isPoint && icount > 0) {
                str2 = `${str2}.`;
            }
            for (let i = 0; i < icount; i++) {
                str2 = `${str2}0`;
            }
        }
        return str2;
    }
}

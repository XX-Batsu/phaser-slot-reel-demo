import ConfigPasser from 'base/ConfigPasser';
import ConfigTools from 'base/ConfigTools';

export default class ReelBase extends Phaser.Group {
    /**
     * 卷軸
     * @param {Phaser.Game} game  game
     * @param {numbr} reelinx     該軸索引
     * @param {Boolean} isWildGroup 是整張的連續的W
     */
    constructor(game) {
        super(game);
        // 目前顯示畫面的索引值
        this.rangeIndex = 0;
        // 結果顯示畫面的索引值
        this.rangeRceiveInx = -1;
        // 總Range
        this.symbolRange = [];
        // 濾掉特殊Symbol的總Range
        this.splitRangeData = [];
        // 現有Range
        this.nowRangeData = [];
        // 結果Range (急停使用)
        this.rceiveRange = [];
        // 跑過的索引值
        this.runStopIndex = 0;
        // 急停是否觸發
        this.runStopBool = false;
        // 眼睛位置
        this.Hanchor = Math.round(ConfigPasser.instance.NUM_ROWS * ConfigPasser.instance.REEL_ANCHOR);
        // 一般停需要經過多少個Symbol
        this.runCount = 0;
        // 計算結果位置後 實際一般停開始跑的起始位置
        this.runPos = 0;
        // 急停需要經過多少個Symbol
        this.empRunCount = 0;
        // 慢速需要經過多少個Symbol
        this.slowRunCount = 0;
        // 計算結果位置後 實際Slow開始跑的起始位置
        this.slowRunPos = 0;
        // 紀錄目前已跑完的最終結果
        this.endRceiveRange = [];
        this.nowRceiveRange = [];
        this.endRceiveIndex = -1;
    }

    /**
     * 設定Range陣列資料
     * @param {Array<number>} data  [1,2,3,4,5]
     */
    set setRangeData(data) {
        const writeRange = data;
        // 寫入真實資料 的滾輪條
        this.symbolRange = writeRange;
        // 移除真實資料內 所有註冊的特殊 Symbol
        this.splitRangeData = writeRange.filter((item) => {
            if (ConfigPasser.instance.ANIMATION_SYMBOL.indexOf(item) === -1) {
                return item;
            }
            return false;
        });
    }

    /**
     * 設定 Range 目前顯示畫面的索引值
     * @param {number}      inx          Range 索引值
     */
    set setRangeIndex(inx) {
        this.rangeIndex = inx;
    }

    // 目前顯示畫面的索引值
    get setRangeIndex() {
        return this.rangeIndex;
    }

    /**
     * [設定這局Spin接收結果的Range的索引值 (不會立即顯示)]
     * @param {[type]} inx [description]
     */
    set rangeReciveIndex(inx) {
        this.rangeRceiveInx = inx;
        // 眼睛位置(基準點)
        const eyeInx = this.rangeRceiveInx + (ConfigPasser.instance.NUM_ROWS + 2 - this.Hanchor);
        // 一般位置
        const runInx = ConfigTools.rangeDataIndexOutLen(eyeInx + this.runCount, this.symbolRange.length);
        this.runPos = runInx + this.Hanchor;
        // 結果位置
        const slowInx = ConfigTools.rangeDataIndexOutLen(eyeInx + this.slowRunCount, this.symbolRange.length);
        this.slowRunPos = slowInx + this.Hanchor;
    }

    /**
     * [設定停止時需要跑過幾個symbol]
     * @param {[number]} value [需要經過數量]
     */
    set setStopRunNum(value) {
        this.runCount = this.getIsGroupValue(value);
    }

    // 取出停止時所需要經過的數量
    get stopRunNum() {
        return this.runCount;
    }

    // 判斷 如果有整組人物  經過數量 會判斷 不能少於需要的數量
    getIsGroupValue(value) {
        return (ConfigPasser.instance.IS_WILD_GROUP && value < ConfigPasser.instance.NUM_ROWS + 2) ? ConfigPasser.instance.NUM_ROWS + 2 : value;
    }

    /**
     * [設定停止時需要跑過幾個symbol] [急停]
     * @param {[number]} value [需要經過數量]
     */
    set setEmpRunCount(value) {
        this.empRunCount = this.getIsGroupValue(value);
    }

    /**
     * [設定停止時需要跑過幾個symbol] [慢速]
     * @param {[number]} value [需要經過數量]
     */
    set setSlowRunCount(value) {
        this.slowRunCount = value;
    }

    /**
     * [持續轉動的呼叫] [Loop] Call
     */
    callNextFrame() {
        (this.rangeIndex - 1 >= 0)
            ? this.rangeIndex--
            : this.rangeIndex = this.symbolRange.length - 1;
        this.nowRceiveRange = this.getNowSymbolData;
        this.updateSymbol(this.nowRceiveRange);
    }

    // 呼叫清除當前停止函數
    callClearNowEmp() {
        this.runStopBool = false;
    }

    // 呼叫一般停止
    callSymbolStop() {
        (this.runStopBool)
            ? this.runStopIndex--
            : this.runStopBool = this.startStop();
        this.nowRceiveRange = ConfigTools.getRangeSite(this.runStopIndex, this.rceiveRange);
        this.updateSymbol(this.nowRceiveRange);
        return !(this.runStopIndex > this.Hanchor);
    }

    /**
     * [進行停止時的呼叫]
     * @return {Boolean} IsGotoDamp 返回是否可以進行震盪狀態
     */
    callSymbolEmpStop() {
        (this.runStopBool)
            ? this.runStopIndex--
            : this.runStopBool = this.startEmpStop();

        // 判斷如果急停狀態下 發現經過次數大於設定急停次數必須要裁切到急停次數內
        if (this.runStopIndex - (ConfigPasser.instance.NUM_ROWS * 2 + 1) > this.empRunCount) {
            this.runStopBool = this.startEmpStop();
        }

        this.nowRceiveRange = ConfigTools.getRangeSite(this.runStopIndex, this.rceiveRange);
        this.updateSymbol(this.nowRceiveRange);
        return !(this.runStopIndex > this.Hanchor);
    }

    // 呼叫咪牌停止方式 返回 false : 還沒跑完 , true : 可以停止轉動了
    callSymbolSlowStop() {
        (this.runStopBool)
            ? this.runStopIndex--
            : this.runStopBool = this.startSlowStop();
        this.nowRceiveRange = ConfigTools.getRangeSite(this.runStopIndex, this.rceiveRange);
        this.updateSymbol(this.nowRceiveRange);
        return !(this.runStopIndex > this.Hanchor);
    }

    // 呼叫消消樂得停止方式
    callBlowReSpinStop() {
        (this.runStopBool)
            ? this.runStopIndex--
            : this.runStopBool = this.startBlowStop();
    }

    // 寫入普通停止的經過次數
    startStop() {
        this.writeRunNum = this.runCount;
        return this.stopRunStart(); // 返回 Reel Down 資料設定初始化成功
    }

    // 寫入急停的經過次數
    startEmpStop() {
        this.writeRunNum = this.empRunCount;
        return this.stopRunStart(); // 返回 Reel Down 資料設定初始化成功
    }

    // 寫入瞇牌停止的經過次數
    startBlowStop() {
        return this.stopBlowStart(); // 返回 Reel Down 資料設定初始化成功
    }

    // 停止消消樂開始 （目前沒使用)
    stopBlowStart() {}

    // 啟動瞇牌停止的節奏
    startSlowStop() {
        this.writeRunNum = this.slowRunCount;
        return this.stopRunStart(); // 返回 Reel Down 資料設定初始化成功
    }

    /**
     * [顯示結果與目前現有顯示資料相接 初始化成功] 急停
     * @return {[Boolean]} [初始化成功]
     */
    stopRunStart() {
        // [現有] 取出目前顯示的symbol資料 並且移除一位已經跑完畫面的Symbol
        const NowData = this.getNowSymbolData;
        // [結果] 產生結果位置資料(實際滾輪)
        const ResultData = ConfigTools.getRangeSite(this.rangeRceiveInx, this.symbolRange);
        // 將結果直接取代rng滾輪截取值
        for (let rowInx = 1; rowInx < ResultData.length - 1; rowInx++) {
            ResultData[rowInx] = this.singleReelResult[rowInx - 1];
        }
        // [經過] 結果資料前，要預跑經過的真實資料,並且取出現有資料上面看不到的第一個資料比對是否有特殊符號相連
        const RunData = this.getRunCounToData(this.rangeRceiveInx, this.writeRunNum, NowData, ResultData);
        // 移除已看過的跑玩畫面的Symbol
        NowData.pop();
        // [排列組合] 結果 ＋經過 ＋現有
        this.rceiveRange = ResultData.concat(RunData, NowData);  // 寫入Reel Down需要跑的 new Range 來取代 Reel Loop的Range
        // Range 設定急停版Range所以需要重新設定新的索引位置
        this.runStopIndex = this.rceiveRange.length - 1 - (ConfigPasser.instance.NUM_ROWS + 1 - this.Hanchor);
        return true;
    }

    // 取出目前顯示的Symbol資料
    get getNowSymbolData() {
        const data = ConfigTools.getRangeSite(this.rangeIndex, this.symbolRange);
        // 已目前上一局結果記錄起來轉動時取用(如果畫面上有做變圖等動作時可以保持變圖後的樣子轉過當前畫面後就會回到原本正常的Range)
        if (this.endRceiveIndex !== -1) {
            const inx = ((this.endRceiveIndex - this.rangeIndex) >= 0)
                ? this.endRceiveIndex - this.rangeIndex
                : (this.endRceiveIndex + this.symbolRange.length) - this.rangeIndex;
            // 控制顯示範圍
            if (inx > 0 && inx < ConfigPasser.instance.NUM_ROWS) {
                const data1 = data.slice(0, inx + 1);   // 實際正常Range位置
                const data2 = this.endRceiveRange.slice(1, this.endRceiveRange.length - inx);  // 紀錄的上局結果位置
                return data1.concat(data2);
            }

            // 當確定轉過畫面後 就回到讀取正常Range滾輪條
            if (inx >= ConfigPasser.instance.NUM_ROWS - 1) {
                this.endRceiveIndex = -1;
            }
        }
        return data;
    }
    // 取出轉動前需要顯示的結果Symbol資料
    get getBeforeEndSymbolData() {
        return ConfigTools.getRangeSite(this.rangeRceiveInx, this.symbolRange);
    }

    // 帶入消除次數來計算後面需要填補的Symbol資料 (消消樂專用)
    getAddCountSymbolData(addCount) {
        const useRangeIndex = this.rangeIndex;
        this.rangeIndex = ((useRangeIndex - addCount) >= 0)
            ? useRangeIndex - addCount
            : (useRangeIndex + this.symbolRange.length) - addCount;
        return ConfigTools.getRangeSite(this.rangeIndex, this.symbolRange);
    }

    // 寫入最後停止時的Symbol結果紀錄
    set writeEndSymbolData(Ary) {
        this.endRceiveRange = Ary;
    }

    // 取出最後停止時的Symbol結果紀錄
    get getEndSymbolData() {
        return this.endRceiveRange;
    }

    // 寫入最後停止時的Symbol結果紀錄
    set singleReelResult(Ary) {
        this.reelResult = Ary;
    }

    // 取出最後停止時的Symbol結果紀錄
    get singleReelResult() {
        return this.reelResult;
    }

    // 呼叫是否有SymbolID 出現在畫面上(Hit專用 轉動中觸發)
    callGetNowSymoblId(symbolID) {
        const data = this.getNowSymbolData;
        const idAry = data.slice(1, data.length - 1);

        return (idAry.indexOf(symbolID) !== -1);
    }

    /**
     * [獲取Reel Down時要跑的經過過程的Symbol數量資料] [取得經過]
     * @param  {number} localInx    [結果的目標位置]
     * @param  {number} runCount    [中間要跑的Symbol數量]
     * @param  {Array} nowData      [現有資料]
     * @param  {Array} resultData   [結果資料]
     * @return {Array<string>}  RunCountData    [description]
     */
    getRunCounToData(localInx, runCount, nowData, resultData) {
        let runCountData = [];
        // 取出經過資料第一筆的index位置 (結果位置 + 滾輪高度 - 1)
        let index = localInx + ConfigPasser.instance.NUM_ROWS - 1;
        // 寫入結果之前的真實經過
        for (let i = 0; i < runCount; i++) {
            // 計算超過陣列長度時回到陣列起始值
            (index + 1 >= this.symbolRange.length) ? index = 0 : index++;
            // 取出經過需要顯示位置的真實資料
            runCountData[i] = this.symbolRange[index];
        }
        // 建議修改 增加額外多重堆疊Group需要修改判斷式 (需要謹慎思考)
        // 判斷沒有Wild整組資料時 返回需要顯示的經過Symbol (血之吻)
        if (!ConfigPasser.instance.IS_WILD_GROUP) {
            return runCountData;
        }
        // 以下為整組Symbol判斷
        const nowSymbolData = nowData;
        const resultSymbolData = resultData;
        let runWildcount = 0;
        // 先看結果是否有W系列
        for (let i = 1; i < ConfigPasser.instance.NUM_ROWS; i++) {
            // 取出結果進行分析 建議修改 增加額外多重堆疊Group需要修改判斷式 (需要謹慎思考)
            const indexID = resultSymbolData[this.Hanchor + i];
            const dataAry = indexID.split('');
            if (ConfigPasser.instance.WILD_GROUP.indexOf(indexID) !== -1 && dataAry[1] === '1') {
                runWildcount = i;
                break;
            }
        }

        // 判別經過的是否為整組的判斷 取出要往上捕的ID與資料
        const symbolID = (ConfigPasser.instance.WILD_GROUP.indexOf(nowSymbolData[0]) === -1) ? '' : nowSymbolData[0];
        const nowLen = symbolID.substr(1, 1) - 1;
        if (nowLen > 0) {
            // [濾掉經過]  經過索引從結果的W系列之後的索引開始判讀 經過資料 已保留結果的W系列之後是否也有W系列
            runCountData = this.callFilterRunData(runWildcount, runCountData);
            // [現有缺少的在經過資料補上] 修改經過資料的數值補上缺少的W系列
            const runInx = runCountData.length - nowLen - 1; // 經過陣列index = 經過陣列總長度 - 需要替補的數量 - 1(陣列從0開始)
            for (let i = 1; i <= nowLen; i++) {
                // 計算現有Symbol需要替補的數量
                runCountData[runInx + i] = `${symbolID.substr(0, 1)}${i}`;
            }
            // 返回填補後的的經過資料
            return runCountData;
        }
        // 建議修改 增加額外多重堆疊Group需要修改判斷式 (需要謹慎思考)
        // 結果與現有都沒有 判別經過是否有W系列 如果是整組無截斷就忽略,但如果是截斷因考慮不能更改現有顯示的只能濾過截斷 (血之吻)
        const runSymbolID = (ConfigPasser.instance.WILD_GROUP.indexOf(runCountData[runCount - 1]) === -1) ? '' : runCountData[runCount - 1];
        // 取出註冊symbol Group需要濾掉的資料  [ 建議修改 增加額外多重堆疊Group需要修改判斷式 (需要謹慎思考) ]
        return (runSymbolID.substr(1, 1) > 0) ? this.callFilterRunData(runWildcount, runCountData) : runCountData;
    }

    // 把經過資料裡面有整組的全部濾掉
    callFilterRunData(num, runCountData) {
        // 寫入經過的symbol陣列Symbol資料
        const data = runCountData;
        // 讀取經過陣列長度
        for (let i = num; i < data.length; i++) {
            // 判斷註冊 Symbol Group資料是否符合 並且濾掉註冊的 symbol
            // (建議修改 此處為當初註冊血之吻Wild使用和另一處也是判斷Wild使用 有堆疊重複的Symbol的新需求 建議增加額外多重堆疊Group需要修改判斷式 (需要謹慎思考) )
            if (ConfigPasser.instance.WILD_GROUP.indexOf(runCountData[i]) !== -1) {
                // 隨機亂數產生 無特殊symbol的全新滾輪資料內任意一個index
                const randomInx = Math.floor(Math.random() * this.splitRangeData.length);
                // 並且取代原本註冊需要濾掉的symbol
                data[i] = this.splitRangeData[randomInx];
            }
        }
        // 返回濾過後的經過陣列資料
        return data;
    }

    /**
     * [完全停止時調用 清除現有停止狀態初始化]
     */
    callComplete() {
        // this.EmpStopBool = false; //目前無使用 移動到ReelControl.js
        // 初始化 是否觸發停止動作
        this.runStopBool = false;
        // 把結果值寫入一般轉動Index(顯示後) 目前顯示畫面有兩種 一種是陣列條的index 一種是只有顯示結果的組合陣列條index（需要把"顯示後"的寫回去)
        this.rangeIndex = this.rangeRceiveInx;
        // 紀錄此次結束的位置   [ 變臉或是更變顯示Symbol取代真實資料上Symbol資料使用 (但是跑完更變後的畫面需要還原真實資料Symbol) ]
        this.endRceiveIndex = this.rangeIndex;
        // 紀錄此次結束的Symbol陣列   [ 變臉或是更變顯示Symbol取代真實資料上Symbol資料使用 (但是跑完更變後的畫面需要還原真實資料Symbol) ]
        this.endRceiveRange = this.getNowSymbolData;
    }

    // 呼叫寫入目前顯示圖示 [供給子層繼承使用]
    updateSymbol() {}
}

import types from 'base/types';
import ConfigPasser from 'base/ConfigPasser';

export default class ConfigTools {
    static changeSymbolID(game, clipSymbolName, value) {
        const isPng = (game.cache.getFrameByName(clipSymbolName, `img_symbol_${value}.png`));
        const ext = (isPng) ? 'png' : 'jpg';

        return `img_symbol_${value}.${ext}`;
    }

    /**
     * 導入顯示Range的位置並且計算出 上下 軸高+2的內容陣列
     * @param {Number} RangeInx  位置
     * @param {Array}  RangeData 該軸的Range表
     * @return {Array} data      實際顯示Range位置的範圍資料 (資料內容是Range陣列的值由上到下)
     */
    static getRangeSite(RangeInx, RangeData) {
        const data = [];
        const rangeData = RangeData;
        const RangeLen = rangeData.length;
        const EyeAnchor = Math.round(ConfigPasser.instance.NUM_ROWS * ConfigPasser.instance.REEL_ANCHOR);
        // 計算起始位置 如果Config.NUM_ROWS = 3 的話  [0] 123 [4]  括號為額外爆框顯示用的值由
        let inx = ConfigTools.rangeDataIndexOutLen((RangeInx - EyeAnchor), RangeLen);

        // 預設上下都會多一個爆框用的顯示 假如Config.NUM_ROWS = 3 的話
        // [0]~ 123 ~[4] 所以for迴圈 i 從 0 開始到Config.NUM_ROWS = 3 + 1
        for (let i = 0; i <= ConfigPasser.instance.NUM_ROWS + 1; i++) {
            // 因為for迴圈會累加所以還是要再判斷並且避開欄位異位的問題
            if (inx < 0) {
                inx += RangeLen;
            } else if (inx >= RangeLen) {
                inx -= RangeLen;
            }
            // 填入RangeDat陣列索引裡面的值
            // (拜託~別再說值有問題了,陣列跟索引都是 "外部傳進來" 此函數取得'陣列內"範圍"的值')
            data[i] = rangeData[inx];
            inx++;
        }
        // 返回 該軸RangeData的位置範圍 [陣列索引0開始 是畫面的由上到下來看]
        return data;
    }

    // 判斷是否為特殊Symbol
    static getSpecialSymbol(singleSymbID) {
        // Free
        const isFree = this.isSpecialSymbol(singleSymbID, ConfigPasser.instance.SYMBOL_FREE);
        // Wild
        const isWild = this.isSpecialSymbol(singleSymbID, ConfigPasser.instance.SYMBOL_WILD);
        // Scatter
        const isScatter = this.isSpecialSymbol(singleSymbID, ConfigPasser.instance.SYMBOL_SCATTER);
        // Extra IS Free
        const isExtraFree = this.isSpecialSymbol(singleSymbID, ConfigPasser.instance.FREE_OVER_SCORE);
        // Extra IS Bonus
        const isExtraBonus = this.isSpecialSymbol(singleSymbID, ConfigPasser.instance.BONUS_OVER_SCORE);
        // Extra IS Jackpot
        const isExtraJackpot = this.isSpecialSymbol(singleSymbID, ConfigPasser.instance.JACKPOT_OVER_SCORE);
        // Bonus 的文字有特殊位置
        const isBonus = this.isSpecialSymbol(singleSymbID, ConfigPasser.instance.SYMBOL_BONUS);
        // Lucky Draw
        const isLuckyDraw = this.isSpecialSymbol(singleSymbID, ConfigPasser.instance.SYMBOL_LUCKY_DRAW);
        // Jackpot 的文字有特殊位置
        const isJackpot = this.isSpecialSymbol(singleSymbID, ConfigPasser.instance.SYMBOL_JACKPOT);
        // 分層symbol
        const isLayered = this.isSpecialSymbol(singleSymbID, ConfigPasser.instance.SYMBOL_LAYERED);
        // 層數累積
        const isLevel = this.isSpecialSymbol(singleSymbID, ConfigPasser.instance.SYMBOL_LEVEL);

        return (isFree || isWild || isBonus || isJackpot || isScatter || isExtraFree || isExtraBonus || isLuckyDraw || isExtraJackpot || isLayered || isLevel);
    }

    /**
    * 處理取得正確的 id
    * @param  {String} id       symbolID
    * @return {String} symbolID symbolID
    */
    static getSymbolID(id) {
        const isSpecial = this.getSpecialSymbol(id);
        if (isSpecial) { return id; }

        return ConfigPasser.instance.SYMBOL_ID_NUM[id];
    }

    /**
     * 處理取得id對應的 Number
     * @param  {String} id symbolID
     * @return {Number}    symbolNumber
     */
    static getSymbolNumber(id) {
        const isSpecial = this.getSpecialSymbol(id);
        if (isSpecial) { return id; }

        const isHSeries = (id.charAt(0) === 'M') ? 0 : 10;
        return (+id.charAt(1) + isHSeries);
    }

    // 計算RangeInx是否超過或是少太多 而不在RangeData的範圍長度內
    static rangeDataIndexOutLen(RangeInx, RangeLen) {
        let inx = RangeInx;

        // 遇到 RangeData長度如果是０～５０
        // 計算起始位置小於0的範圍自動轉換 但如果是-50以上就必須要在遞減一次才可以精準到正確的RangeData的位置
        while (inx < 0) {
            inx += RangeLen;
        }
        // 同上功能 取得精準正確的RangeData的位置
        while (inx >= RangeLen) {
            inx -= RangeLen;
        }
        return inx;
    }

    /**
    * 取得畫面上該軸Reel位置的Point
    * @param {number}  RowInx      軸高數量  例 5x3  視角從上到下 id:1~3  ,  5x4  視角從上到下 id 1~4
    * @param {number}  reelIndx    軸寬數量  5Reel  id: 0~4
    * @param {string}  Amode       對齊位置  left_top ,left_center,left_down , center_top center , center_down , right_top , right , right_down
    * @param {Boolean} offSetBool  是否世界軸需要 (會含上容器位置)
    * @return {Phaser.Point} point
    */
    static symbolLocal(RowInx = 1, reelIndx = 0, Amode = types.align.LEFT_TOP, offSetBool = false) {
        const type = Amode.toLowerCase();
        const typeArr = type.split('_');
        const basePoint = ConfigTools.symbolBaseLocal(reelIndx, RowInx);
        const point = (offSetBool)
            ? {
                x: basePoint.x + ConfigPasser.instance.REEL_OFFSET_X,
                y: basePoint.y + ConfigPasser.instance.REEL_OFFSET_Y
            }
            : {
                x: basePoint.x,
                y: basePoint.y
            };
        // symbol Center data
        const symbolCenter = {
            x: ConfigPasser.instance.SYMBOL_WIDTH * 0.5,
            y: ConfigPasser.instance.SYMBOL_HEIGHT * 0.5
        };

        if (typeArr.length === 1 && typeArr[0] === 'center') { // center
            point.x += symbolCenter.x;
            point.y += symbolCenter.y;
            return point;
        }
        if (typeArr.length === 2 && typeArr[0] === 'center') { // center_top、center_down
            point.x += symbolCenter.x;
        }
        if (typeArr.length === 2 && typeArr[1] === 'center') { // left_center、right_center
            point.y += symbolCenter.y;
        }
        if (typeArr.length === 2 && typeArr[0] === 'right') {  // right_top、right_center、right_down
            point.x += ConfigPasser.instance.SYMBOL_WIDTH;
        }
        if (typeArr.length === 2 && typeArr[1] === 'down') {   // left_down、right_down、center_down
            point.y += ConfigPasser.instance.SYMBOL_HEIGHT;
        }
        return point;
    }

    /**
    * 僅提供 symbolLocal 使用
    * 取得畫面上該Sybmol 基底左上位置的 Point
    * @param  {number}  reelNum  軸寬數量  5 Reel  id: 0~4
    * @param  {number}  rowNum   軸高數量  例 5x3  視角從上到下 id:1~3  ,  5x4  視角從上到下 id 1~4
    * @return {Object}           {x, y}
    */
    static symbolBaseLocal(reelNum, rowNum) {
        const singleSymbolW = ConfigPasser.instance.SYMBOL_WIDTH + ConfigPasser.instance.SPACE_BASE_SYMBOLS_X + ConfigPasser.instance.SYMBOL_PADDING_X;
        const singleSymbolH = ConfigPasser.instance.SYMBOL_HEIGHT + ConfigPasser.instance.SPACE_BASE_SYMBOLS_Y + ConfigPasser.instance.SYMBOL_PADDING_Y;

        return {
            x: reelNum * singleSymbolW + (ConfigPasser.instance.SYMBOL_PADDING_X * 0.5),
            y: (rowNum - 1) * singleSymbolH + (ConfigPasser.instance.SYMBOL_PADDING_Y * 0.5)
        };
    }

    // Poker洗牌功能 [範圍內亂數不重複]
    static poker(source, length) {
        let temparr;
        if (length <= source.length) {
            temparr = source;
        } else {
            temparr = new Array(length);
            for (let i = 0; i < length; i++) {
                temparr[i] = source[i % source.length];
            }
        }
        for (let i = 0; i < temparr.length; i++) {
            // 產生亂數
            const j = Math.floor(Math.random() * ((temparr.length - 1) - 0 + 1)) + 0;
            const temp = temparr[i];
            temparr[i] = temparr[j];
            temparr[j] = temp;
        }
        return temparr.slice(0, length);
    }

    // 判斷是否為特殊Symbol得共用判斷式（內部使用）
    static isSpecialSymbol(symbolID, symbolAry) {
        return (typeof symbolAry !== 'undefined' && symbolAry.indexOf(symbolID) !== -1);
    }
}

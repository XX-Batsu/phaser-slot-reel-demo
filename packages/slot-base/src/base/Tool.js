import ConfigPasser from 'base/ConfigPasser';

export default class Tool {
    /**
     * 取一般連線的中獎 position
     * @param  {String} winID     中的 symobl id
     * @param  {String} sWinLine  中的線 12321 (字串)
     * @param  {Number} winCount  中的 symbol 數
     * @return {Array}            連線的中獎 position
     */
    static getNormalPosition(winID, sWinLine, winCount) {
        const symbolPosition = [];
        const lineAry = sWinLine.split('');

        for (let i = 0; i < lineAry.length; i++) {
            symbolPosition.push((i < winCount) ? 1 : 0);
        }
        return symbolPosition;
    }

    /**
     * 取 scatter position
     * @param  {String} winID        中的 symobl id
     * @param  {Number} winCount     中的 symbol 數
     * @param  {Array} winPosition   server 資料的 winPosition
     * @return {Array}               連線的中獎 position
     */
    static getScatterPosition(winID, winCount, winPosition) {
        const symbolPosition = [ 0, 0, 0, 0, 0 ];

        for (let i = 0; i < winPosition.length; i++) {
            for (let j = 0; j < winPosition[i].length; j++) {
                if (winPosition[i][j] !== 0) {
                    symbolPosition[j] = i + 1;
                }
            }
        }
        return symbolPosition;
    }

    // 處理贏分資料
    static getSymbolPosition(symbolIdAry, showLineAry, symbolCountAry, winPositionAry) {
        const positionData = [];

        for (let i = 0; i < symbolIdAry.length; i++) {
            const winID = `${symbolIdAry[i]}`;
            const winLine = `${showLineAry[i]}`;
            const winCount = symbolCountAry[i];
            const winPosition = winPositionAry[i];
            const isFree = ConfigPasser.instance.SYMBOL_FREE.indexOf(winID) !== -1;
            const isBonus = ConfigPasser.instance.SYMBOL_BONUS.indexOf(winID) !== -1;
            const isJackpot = ConfigPasser.instance.SYMBOL_JACKPOT.indexOf(winID) !== -1;

            if (isFree || isBonus || isJackpot) {
                const scatterPosition = this.getScatterPosition(winID, winCount, winPosition);
                positionData.push(scatterPosition);
                continue;
            }
            const symbolPosition = this.getNormalPosition(winID, winLine, winCount);
            positionData.push(symbolPosition);
        }
        return positionData;
    }

    // 取得 wild group 是否整條 且都有中獎 (播放動畫用)
    static getAllWildPosition(symbolResult, winPositionAry) {
        const wildAry = [];
        const allWildObj = {};
        let wildCount = 0;

        // 組出 reel 有幾格
        for (let i = 0; i < ConfigPasser.instance.NUM_REELS; i++) {
            allWildObj[`reel${i}`] = 0;
            wildAry.push(false);
        }

        for (let i = 0; i < winPositionAry.length; i++) {
            const oneWinPosition = winPositionAry[i];

            for (let row = 0; row < oneWinPosition.length; row++) {
                for (let reelIndex = 0; reelIndex < oneWinPosition[row].length; reelIndex++) {
                    // 非 wild symbol 與沒中的位置直接跳掉
                    if (wildAry[reelIndex]) {
                        continue;
                    }
                    // 如果全 wild 跟 symbolResult 的位置 match
                    const reelCount = allWildObj[`reel${reelIndex}`];
                    const matchWild = (ConfigPasser.instance.WILD_GROUP[row] === symbolResult[row][reelIndex]);
                    const isWinPosition = (oneWinPosition[row][reelIndex] !== 0);

                    if (matchWild && isWinPosition && reelCount < ConfigPasser.instance.NUM_ROWS) {
                        allWildObj[`reel${reelIndex}`]++;
                    }

                    if (reelCount >= ConfigPasser.instance.NUM_ROWS) {
                        wildAry[reelIndex] = true;
                        wildCount++;
                    }
                }
            }
        }

        const wildData = {
            wildAry,
            isAllWild: (wildCount === ConfigPasser.instance.NUM_REELS)
        };

        return wildData;
    }

    static numberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // 乘法計算
    static accMul(arg1, arg2) {
        let pow = 0;
        const arguments1 = `${arg1}`;
        const arguments2 = `${arg2}`;

        try { pow += arguments1.split('.')[1].length; } catch (e) {
            // 避免運算錯誤
        }
        try { pow += arguments2.split('.')[1].length; } catch (e) {
            // 避免運算錯誤
        }

        const r1 = Number(arguments1.replace('.', ''));
        const r2 = Number(arguments2.replace('.', ''));
        return (r1 * r2) / Math.pow(10, pow);
    }

    // 除法
    static accDiv(arg1, arg2) {
        let t1 = 0;
        let t2 = 0;
        const arguments1 = `${arg1}`;
        const arguments2 = `${arg2}`;

        try { t1 = arguments1.split('.')[1].length; } catch (e) {
            // 避免運算錯誤
        }
        try { t2 = arguments2.split('.')[1].length; } catch (e) {
            // 避免運算錯誤
        }

        const r1 = Number(arguments1.replace('.', ''));
        const r2 = Number(arguments2.replace('.', ''));
        return (r1 / r2) * Math.pow(10, t2 - t1);
    }

    // 將圖片 URL 轉為 base64 字串
    static toDataURL(src, callback) {
        const xhttp = new XMLHttpRequest();
        xhttp.onload = () => {
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                callback(fileReader.result);
            };
            fileReader.readAsDataURL(xhttp.response);
        };
        xhttp.responseType = 'blob';
        xhttp.open('GET', src, true);
        xhttp.send();
    }

    // 數字補位數轉字串
    static numberPadZero(number, width, z = '0') {
        const n = number.toString();
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
}

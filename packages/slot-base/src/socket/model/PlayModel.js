import CryptoJS from 'crypto-js';

export default class PlayModel {
    /**
     * @param {Array} symbolResult 全部的 symbol id
     * @return {Array} data        處理過的資料
     */
    getSymbolResult(symbolResult) {
        const data = [];
        for (let i = 0; i < symbolResult.length; i++) {
            const symbolResultAry = symbolResult[i].split(',');
            for (let j = 0; j < symbolResultAry.length; j++) {
                if (data[i] === undefined) {
                    data[i] = [];
                }

                const id = symbolResultAry[j];

                data[i][j] = id;
            }
        }
        return data;
    }

    /**
     * 處理 line 或 way game 中獎的線 map 成 [12321, 11111] 格式
     * @param  {Array} winPosition  中獎的線 map
     * @return {Array} winLineAry   [12321, 11111] 格式
     */
    getWinPositionAry(winPosition) {
        const winLineAry = [];
        for (let i = 0; i < winPosition.length; i++) {
            for (let j = 0; j < winPosition[i].length; j++) {
                if (winLineAry[j] === undefined) {
                    winLineAry.push(0);
                }

                if (winPosition[i][j] !== 0) {
                    winLineAry[j] = i + 1;
                }
            }
        }

        return winLineAry.join('');
    }

    /**
     * 將贏線資料處理成各種 array
     * @param {Object} udsOutputWinLine 贏線資料
     * @return {Object} data            處理過的資料
     */
    getUdsOutputWinLine(udsOutputWinLine) {
        const data = {
            showLineAry: [],
            symbolCountAry: [],
            symbolIdAry: [],
            linePrizeAry: [],
            winLineNoAry: [],
            winPositionAry: [],
            numOfKindAry: [],
            LineMultiplierAry: [],
            LineExtraDataAry: [],
            LineTypeAry: []
        };

        Object.keys(udsOutputWinLine).forEach((index) => {
            // 中獎的 obj
            const winLineObj = udsOutputWinLine[index];
            data.symbolCountAry.push(winLineObj.SymbolCount);
            data.symbolIdAry.push(winLineObj.SymbolId);
            data.linePrizeAry.push(winLineObj.LinePrize);
            data.winLineNoAry.push(winLineObj.WinLineNo);
            data.winPositionAry.push(winLineObj.WinPosition);
            data.numOfKindAry.push(winLineObj.NumOfKind);
            data.LineMultiplierAry.push(winLineObj.LineMultiplier);
            data.LineExtraDataAry.push(winLineObj.LineExtraData);
            data.LineTypeAry.push(winLineObj.LineType || 0);
            const winLineAry = this.getWinPositionAry(winLineObj.WinPosition);
            data.showLineAry.push(winLineAry);
        });

        return data;
    }

    /**
     * 處理 id - 1
     * @param {Array} rngData     中獎的位置 id array
     * @return {Object} data      處理過的資料
     */
    getRngData(rngData) {
        const newRng = [];
        for (let i = 0; i < rngData.length; i++) {
            newRng[i] = rngData[i] - 1;
        }

        return newRng;
    }


    /**
     * @param  {Str} strEncryptText   hashed strip
     * @return {Str}                  decrypted strip
     */
    decryptStringAES(strEncryptText) {
        const iv = strEncryptText.slice(0, 16);
        const decrypted = CryptoJS.AES.decrypt(
            strEncryptText.substring(16),
            CryptoJS.enc.Utf8.parse('a8Ds56a8wbf594fa'),
            {
                keySize: 128 / 8 | 0,
                iv: CryptoJS.enc.Utf8.parse(iv),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
}

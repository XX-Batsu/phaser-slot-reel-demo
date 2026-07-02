export default class SlowControl {
    /**
     * 瞇牌功能
     * 版本 Ver 2.0.0
     * Author : Robert
    */

    /**
     * 瞇牌判斷
     * @param {Number} reels 輪數
     * @param {Number} rows  輪高數量
     */
    constructor(reels, rows) {
        // 設定單例化
        SlowControl.instance = this;
        // 設定此滾輪數
        this.numReels = reels;
        // // 設定此每滾輪的輪高數
        this.numRows = rows;
    }

    // 初始化
    init() {
        this.slowData = {};         // 計算此局遊戲資料產生出的slow資訊
        this.symbolResult = [];     // 此局遊戲資料
        this.symbolWinPoslist = []; // 每輪贏得Symbol位置

        this.wildCount = 0;         // 計算遊戲資料全累積Wild次數
        this.totalReelCount = 0;    // 計算連線Symbol的有幾輪 [Line Game]
        this.totalIconCount = 0;    // 計算連續Symbol的每輪有幾個各數 [Way Game]

        // 設定瞇牌規則
        this.lineData = [];         // LineData [陣列] 有陣列代表LineGame 沒有陣列長度代表WayGame
        this.wildData = [];         // Wild Data [陣列]
        this.slowInfoData = [];     // 瞇牌設定資料 [陣列]
    }

    // 清除儲存資料
    clearResult() {
        // 清空陣列東西
        this.symbolResult.length = 0;       // 此局遊戲資料
        this.symbolWinPoslist.length = 0;   // 每輪贏得Symbol位置
        // 清空計算此局遊戲資料產生出的slow資訊
        Object.keys(this.slowData).forEach((key) => {
            this.slowData[key].length = 0; // 清空陣列東西
            this.slowData[key] = null;     // 清掉Key
            delete this.slowData[key];     // 清掉記憶體
        });
        // 清除 slow 產生的全部物件
        this.slowData = null;
        delete this.slowData;
        // 當確定已經清掉一些殘留的東西,並且新創立新的Object
        this.slowData = {};
    }

    // 設定線數
    set setlineListData(lineAry) {
        this.lineData = lineAry;
    }

    // 設定Wild的資料
    set setWildInfo(wildInfo) {
        this.wildData = wildInfo;
    }

    // 檢查全部瞇牌資料是否有誤
    set setSlowInfo(slowInfo) {
        Object.keys(slowInfo).forEach((item) => {
            for (let i = 0; i < slowInfo[item].length; i++) {
                const obj = slowInfo[item][i];    // 取初註冊資料
                this.checkSlowInfo(obj.reelSlow.slowReelRange);
                this.checkSlowInfo(obj.waySlow.wayReelRange);
            }
        });
    }

    // 設定瞇牌資料
    set useSlowInfoData(slowInfoData) {
        this.slowInfoData = slowInfoData;
    }

    // 檢查瞇牌資料是否超過範圍
    checkSlowInfo(endRange) {
        const endRangeObj = {};

        for (let i = 0; i < endRange.length; i++) {
            const reelId = endRange[i];
            if (((endRange.length > 1) && (reelId < 1)) || (reelId > this.numReels)) {
                throw new Error(`EndRange ${reelId} out of range`);
            }
            if (endRangeObj[reelId] !== undefined) {
                throw new Error('EndRange numbers are duplicated');
            }
            endRangeObj[reelId] = 1;
        }
    }

    // 導入Reel每輪結果資料 [目前提供上層使用的呼叫接口]
    static resultData(symbolData) {
        // console.log('判斷每輪結果資料＃1');
        // 初始化上次瞇牌資料
        this.instance.clearResult();
        // 複製新的二維陣列
        const result = [];
        for (let rowsInx = 0; rowsInx < symbolData.length; rowsInx++) {
            result.push(symbolData[rowsInx].slice());
        }
        this.instance.symbolResult = result;  // 寫入新的陣列
        const slowInfoData = this.instance.slowInfoData;

        this.instance.symbolWinPoslist = this.instance.LinePositionAry;
        // 解析瞇牌註冊器
        for (let i = 0; i < slowInfoData.length; i++) {
            const obj = slowInfoData[i];    // 取初註冊資料
            for (let inx = 0; inx < obj.symbolID.length; inx++) {
                // 取出SymbolID
                const symbolID = obj.symbolID[inx];
                // 取出瞇牌對象的Slow組合資料
                const slowObj = this.instance.getSlow(symbolID, obj.replaceWild, obj.isGroup);
                // 呼叫WaySlow判斷組合資料並儲存
                this.instance.callWaySlow(
                    obj.waySlow,
                    obj.isGroup,
                    symbolID,
                    slowObj.symbolFakeWinPos,
                    slowObj.symbolWinPos
                );
                // 呼叫ReelSlow判斷組合資料並儲存
                this.instance.callReelSlow(
                    obj.reelSlow,
                    obj.isGroup,
                    symbolID,
                    slowObj.symbolFakeWinPos,
                    slowObj.symbolWinPos
                );
                // 花式瞇牌
                // this.instance.callSpecialSlow(
                //     obj.specialSlow,
                //     obj.isGroup,
                //     symbolID,
                //     slowObj.symbolFakeWinPos,
                //     slowObj.symbolWinPos
                // );
            }
        }
        // console.log('判斷每輪結果資料＃2', this.instance.slowData);
        return this.instance.slowData;      // 返回儲存瞇牌資料
    }

    // 計算並且組合瞇牌規則與參數 [推算每輪上同樣的Symbol數,用來組WayGame格式的資料]
    getSlow(symbolID, replaceWild, isGroup) {
        // 計算
        const symbolFakeWinPos = [];
        // 創建幾輪需要存放的是否中的資料
        for (let i = 0; i < this.numReels; i++) { symbolFakeWinPos.push(0); }
        // 存放Symbol Win Position Value >>>  1 : 屬於這個瞇牌標記 , 2 : 是Wild可取代此瞇牌標記
        const symbolWinPos = this.LinePositionAry;
        for (let rowsInx = 0; rowsInx < this.symbolResult.length; rowsInx++) {
            symbolWinPos[rowsInx] = [];
            for (let reelInx = 0; reelInx < this.symbolResult[rowsInx].length; reelInx++) {
                symbolWinPos[rowsInx].push(0);
                const ID = this.symbolResult[rowsInx][reelInx];
                const wildInx = this.wildData.indexOf(ID);
                // 判別Symbol是否為Wild , 是否為要瞇牌的對象 , replaceWild : 是否可讓Wild代替
                if (((wildInx !== -1) && replaceWild) || (symbolID === ID)) {
                    // symbolWinPos[rowsInx][reelInx] = (wildInx === -1) ? 1 : 2; // 1 : 屬於這個瞇牌標記 , 2 : Wild可取代此瞇牌標記
                    symbolWinPos[rowsInx][reelInx] = 1;
                    symbolFakeWinPos[reelInx]++; // 計算次數
                }
                // 判斷是否為W
                if (isGroup && wildInx !== -1 && symbolID === ID.substr(0, 1)) {
                    symbolWinPos[rowsInx][reelInx] = 1;
                    symbolFakeWinPos[reelInx]++; // 計算次數
                }
            }
        }

        // 整組Symbol解析
        if (isGroup) {
            for (let i = 0; i < this.numReels; i++) {
                // 當此瞇牌對象是整組 判別他的數量是否為軸高數量
                symbolFakeWinPos[i] = (symbolFakeWinPos[i] >= this.numRows) ? 1 : 0;
            }
        }

        // 返回新組成的WayGame資料
        return {
            symbolFakeWinPos,
            symbolWinPos
        };
    }
    /**
     * [判斷每輪的各數 連續中共幾個各數]
     * @param {Object} waySlowData      Way瞇牌規則
     * @param {Boolean} isGroup         是否為整組Symbol
     * @param {String} symbolID         標記名稱
     * @param {Array} symbolFakeWinPos  顯示此瞇牌ID 是否中格
     * @param {Array} symbolWinPos      中獎的Position二維陣列
     */
    callWaySlow(waySlowData, isGroup, symbolID, symbolFakeWinPos, symbolWinPos) {
        const data = waySlowData;
        // WayGame 參數設定如果小等於0 就跳出
        if (data.wayWinCount <= 0) {
            return;
        }

        const reelEndData = this.getReelEndRange(waySlowData.wayReelRange);
        const reelEndStrAry = Object.keys(reelEndData);
        const wayWinPosition = this.LinePositionAry;
        let wayWinTotalCount = 0;
        let isSlowIn = false;
        // 判斷組合資料是否有該瞇牌Symbol
        for (let reelInx = 0; reelInx < symbolFakeWinPos.length; reelInx++) {
            const keyInx = reelInx + 1;
            if (reelEndData[keyInx] === undefined) { continue; }
            if (symbolFakeWinPos[reelInx] === 0) { break; } // [連續不中斷]
            reelEndData[keyInx] = 1;
            wayWinTotalCount += symbolFakeWinPos[reelInx];  // +每輪總各數
            // 你的輪數等於瞇牌那輪 且 累積各數達到條件 開啟可以Slow狀態
            if (((reelInx === (data.wayWinReelEnd - 1)) && (wayWinTotalCount >= data.wayWinCount)) || (data.wayWinReelEnd === 0)) {
                isSlowIn = true;
            }
            const index = reelEndStrAry.indexOf(`${reelInx + 1}`);
            const nextIndex = reelEndStrAry[index + 1] - 1;
            // 略過不該出現的Symbol 重新計算真正限制範圍內的hit Symbol
            for (let rowsInx = 0; rowsInx < this.numRows; rowsInx++) {
                // 瞇牌Hit聲音使用(下一輪瞇牌是否有hit聲)
                if (symbolWinPos[rowsInx][nextIndex] === 1 && index + 1 < reelEndStrAry.length) {
                    wayWinPosition[rowsInx][nextIndex] = 1;
                }
                // 本輪是否有Hit聲音
                if (symbolWinPos[rowsInx][reelInx] === 1) {
                    wayWinPosition[rowsInx][reelInx] = 1;
                }
            }
            // 判斷此輪的下一輪是否為限制範圍內的輪數
            if (isSlowIn && index + 1 < reelEndStrAry.length && index !== -1) {
                // 瞇牌範圍計算是否達成瞇牌各數
                this.callWriteSlow(wayWinTotalCount, data.wayWinCount, reelEndStrAry[index + 1] - 1, symbolID, wayWinPosition);
            }
        }
    }

    /**
     * 花式瞇牌
     * @param {Object} specialData     特殊瞇牌規則
     * @param {Boolean} isGroup         是否為整組Symbol
     * @param {String} symbolID         標記名稱
     * @param {Array} symbolFakeWinPos  顯示此瞇牌ID 是否中格
     * @param {Array} symbolWinPos      中獎的Position二維陣列
     */
    // callSpecialSlow(specialData, isGroup, symbolID, symbolFakeWinPos, symbolWinPos) {
    //     console.log(specialData, isGroup, symbolID, symbolFakeWinPos, symbolWinPos);
    // }

    /**
     * [判斷連續中幾輪 如果不等於0 有連續中時,達到第幾輪後開始瞇牌]
     * @param {Object} slowReelData     Reel瞇牌規則
     * @param {Boolean} isGroup         是否為整組Symbol
     * @param {String} symbolID         瞇牌的ID
     * @param {Array} symbolFakeWinPos  顯示此瞇牌ID 是否中格
     * @param {Array} symbolWinPos      中獎的Position二維陣列
     */
    callReelSlow(slowReelData, isGroup, symbolID, symbolFakeWinPos, symbolWinPos) {
        // console.log(slowReelData.slowReelInx, isGroup, `linedata Len:${this.lineData.length}`, slowReelData.isOnLine);
        // 如果等於0 就跳出
        if (slowReelData.slowReelInx === 0) { return; }
        const isQueue = (slowReelData.slowReelInx > 0);      // 斷正值為 連續不間斷, 負值為 任意可間斷
        const countEnd = Math.abs(slowReelData.slowReelInx); // 計算要瞇牌的條件

        // WayGame跳過這行判斷 但LineGame必須要濾掉是否在設定線數之上(但是原本組的資料為WayGame資料,需審核判斷)
        if (this.lineData.length > 0 && !isGroup && slowReelData.isOnLine === true) {
            const reelEndData = this.getReelEndRange(slowReelData.slowReelRange);
            const lineSlowMap = [];
            const singLine = [];
            for (let i = 0; i < this.numReels; i++) { singLine.push(0); }
            // 分析每一條線
            for (let lineInx = 0; lineInx < this.lineData.length; lineInx++) {
                // 取出該線條
                const lineArray = this.lineData[lineInx].split('');
                // 宣告一組新的贏線判斷儲存用的資料
                const singWin = {
                    lineWin: singLine.slice(),
                    lineAry: lineArray
                };
                // 累加
                let count = 0;
                // 判斷每條是否有中此位置
                for (let reelID = 0; reelID < lineArray.length; reelID++) {
                    const keyId = reelID + 1;
                    const rows = +lineArray[reelID] - 1;
                    if (reelEndData[keyId] === undefined) { continue; }
                    if (symbolWinPos[rows][reelID] === 0 && isQueue) { break; }
                    if (symbolWinPos[rows][reelID] !== 0 && symbolFakeWinPos[reelID] !== 0) {
                        singWin.lineWin[reelID] = 1;
                        count++;
                    }
                }
                // console.log(count, countEnd);
                // 解析是否達成瞇牌條件
                if (count >= countEnd) {
                    lineSlowMap.push(singWin);   // Symbol有在LineGame線條上的話,做儲存
                }
            }
            // 分析出總共有幾組瞇牌路線 寫入每組路線瞇牌的二維陣列
            for (let i = 0; i < lineSlowMap.length; i++) {
                const len = lineSlowMap[i].lineWin.length;
                const winPos = this.LinePositionAry;
                for (let reelInx = 0; reelInx < len; reelInx++) {
                    const inx = lineSlowMap[i].lineWin[reelInx];
                    if (inx !== 0) {
                        const id = lineSlowMap[i].lineAry[reelInx] - 1;
                        if (reelEndData[reelInx + 1] === undefined) { continue; }   // 判別是否在範圍內 不是就不管內容值跳出
                        winPos[id][reelInx] = 1;
                    }
                }
                // console.log(symbolID, lineSlowMap[i].lineAry, lineSlowMap[i].lineWin, winPos);
                this.reelLine(isQueue, countEnd, slowReelData.slowReelRange, symbolID, lineSlowMap[i].lineWin, winPos);
            }
            return;
        }

        // 如果是整組的話 最後一輪如果沒中就不能有Hit聲
        if (isGroup) {
            const winPos = this.LinePositionAry;
            for (let i = 0; i < symbolFakeWinPos.length; i++) {
                if (symbolFakeWinPos[i] === 1) {
                    for (let j = 0; j < symbolWinPos.length; j++) {
                        if (symbolWinPos[j][i] === 1) {
                            winPos[j][i] = 1;
                        }
                    }
                }
            }
            this.reelLine(isQueue, countEnd, slowReelData.slowReelRange, symbolID, symbolFakeWinPos, winPos);
            return;
        }
        this.reelLine(isQueue, countEnd, slowReelData.slowReelRange, symbolID, symbolFakeWinPos, symbolWinPos);
    }

    // 輪數判斷
    reelLine(isQueue, countEnd, slowReelRange, symbolID, symbolFakeWinPos, symbolWinPos) {
        // console.log(isQueue, countEnd, slowReelRange, symbolID, symbolFakeWinPos, symbolWinPos);
        const reelEndData = this.getReelEndRange(slowReelRange);
        const reelEndStrAry = Object.keys(reelEndData);
        const winPos = this.LinePositionAry;
        let slowCount = 0;
        for (let reelInx = 0; reelInx < symbolFakeWinPos.length; reelInx++) {
            const keyIndex = reelInx + 1;
            if (reelEndData[keyIndex] === undefined) { continue; }
            if (symbolFakeWinPos[reelInx] === 0 && isQueue) { break; } // [連續不中斷] 一但中斷就跳掉整個迴圈不用跑了

            const index = reelEndStrAry.indexOf(`${reelInx + 1}`);
            const nextIndex = reelEndStrAry[index + 1] - 1;

            if (symbolFakeWinPos[reelInx] !== 0) {
                slowCount++;    // 累加瞇牌次數 任意或連續 每次+1
                // 略過不該出現的Symbol 重新計算真正限制範圍內的hit Symbol
                for (let rowsInx = 0; rowsInx < this.numRows; rowsInx++) {
                    // 瞇牌Hit聲音使用(下一輪瞇牌是否有hit聲)
                    if (symbolWinPos[rowsInx][nextIndex] === 1 && index + 1 < reelEndStrAry.length) {
                        winPos[rowsInx][nextIndex] = 1;
                    }
                    // 本輪是否有Hit聲音
                    if (symbolWinPos[rowsInx][reelInx] === 1) {
                        winPos[rowsInx][reelInx] = 1;
                    }
                }
            }

            // 判斷此輪的下一輪是否為限制範圍內的輪數
            if (index + 1 < reelEndStrAry.length && index !== -1) {
                // console.log('callReelLine');
                // 瞇牌範圍計算是否達成瞇牌各數
                this.callWriteSlow(slowCount, countEnd, reelEndStrAry[index + 1] - 1, symbolID, winPos);
            }
        }
    }

    // 取的新的一組二維陣列
    get LinePositionAry() {
        const newSlowPosition = [];

        for (let rowsInx = 0; rowsInx < this.numRows; rowsInx++) {
            newSlowPosition[rowsInx] = [];
            for (let reelInx = 0; reelInx < this.numReels; reelInx++) {
                newSlowPosition[rowsInx].push(0);
            }
        }
        return newSlowPosition;
    }

    // 取得瞇牌範圍資料格式
    getReelEndRange(rangeData) {
        const reelEndAry = {};

        if (rangeData.length <= 1) {
            const isLimited = (rangeData[0] > 0 && rangeData[0] < this.numReels);
            const len = (isLimited) ? rangeData[0] : this.numReels;
            for (let key = 1; key <= len; key++) {
                reelEndAry[key] = 0;
            }
        }

        if (rangeData.length > 1) {
            for (let inx = 0; inx < rangeData.length; inx++) {
                const keyId = (rangeData[inx] > 0 && rangeData[inx] < this.numReels) ? rangeData[inx] : this.numReels;
                reelEndAry[keyId] = 0;
            }
        }
        return reelEndAry;
    }

    // 判別數值是否達到條件數值
    callWriteSlow(count, countEnd, reelInx, symbolID, symbolWinPos) {
        if (count < countEnd) {
            return;
        }
        const slowNewPos = this.LinePositionAry;
        const reelID = reelInx; // 確定達成條件時 reel Index + 1 下一輪開始瞇牌
        for (let i = 0; i < symbolWinPos.length; ++i) {
            for (let j = 0; j < symbolWinPos[i].length; ++j) {
                // 儲存
                if (symbolWinPos[i][j] === 1) {
                    this.symbolWinPoslist[i][j] = 1;
                    slowNewPos[i][j] = 1;
                }
                // 略過瞇牌陣列後面尚未出現的中獎Symbol
                if (j >= reelInx) { slowNewPos[i][j] = 0; }
            }
        }
        this.saveSlowData(reelID, symbolID, slowNewPos); // 當累積條件達成設定,寫入此筆資料
    }

    /**
     * 紀錄 slowData
     * @param  {Number} slowIndex       slow的軸
     * @param  {Number} slowID        贏的 symbolID
     * @param  {Array} slowHitPosition   顯示瞇牌前面有中的位置
    */
    saveSlowData(slowIndex, slowID, slowHitPosition) {
        // console.log(`瞇第 ${slowIndex+1} 輪`, ` [ ${slowID} ] `);
        // for (let i = 0; i < symbolPosition.length; i++) {  console.log(symbolPosition[i]); } // Deubg用途
        // slowIndex必須要小於this.numReels,否則超過瞇牌範圍就不儲存
        if (slowIndex >= this.numReels) { return; }

        const slowData = this.slowData;
        if (slowData[slowIndex] === undefined) {
            slowData[slowIndex] = {
                symbolID: [],
                symbolPosition: [],
                hitData: []
            };
        }
        // 當沒有此Symbol的ID 儲存此ID
        if (slowData[slowIndex].symbolID.indexOf(slowID) === -1) {
            slowData[slowIndex].symbolID.push(slowID);
        }

        if (slowData[slowIndex].symbolPosition.length > 0) {
            for (let i = 0; i < slowData[slowIndex].symbolPosition.length; i++) {
                const posStr = slowData[slowIndex].symbolPosition[i].join('-');
                const pushPosStr = slowHitPosition.join('-');
                // 讀取到有一樣的二維陣列就跳出
                if (posStr === pushPosStr) {
                    return;
                }
            }
        }
        // 寫入中獎路線
        slowData[slowIndex].symbolPosition.push(slowHitPosition);
        // console.log(slowIndex, slowID, 'this.symbolWinPoslist:', this.symbolWinPoslist);
        for (let i = 0; i < this.symbolWinPoslist.length; i++) {
            for (let j = 0; j < this.symbolWinPoslist[i].length; j++) {
                if (slowData[slowIndex].hitData[j] === undefined) {
                    slowData[slowIndex].hitData[j] = '';
                }
                if (this.symbolWinPoslist[i][j] === 1) {
                    slowData[slowIndex].hitData[j] = slowID;
                }
            }
        }
    }
}

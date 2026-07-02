import ReelResultData from 'game/model/ReelResultData';

export default class LineExtraControl {
    // 判斷Win Line當中是否有中Extra
    static get lineExtra() {
        const len = ReelResultData.lineExtraDataAry.length;
        if (len > 0) {
            for (let i = 0; i < len; i++) {
                const bool = this.isExtraWin(i);
                if (bool) { return true; }
            }
        }
        return false;
    }

    // 判斷Free Win Line當中是否有中Extra
    static get freeLineExtra() {
        return this.lineExtra;
    }

    // 取出LineExtraData有觸發LineExtra Win的第一個索引
    static get extraIndexOf() {
        const len = ReelResultData.lineExtraDataAry.length;
        if (len > 0) {
            for (let i = 0; i < len; i++) {
                const bool = this.isExtraWin(i);
                if (bool) { return i; }
            }
        }
        return -1;
    }
    // 計算贏分資料 總共要拍掉幾次秀分
    static get extraIndexOfData() {
        const len = ReelResultData.lineExtraDataAry.length;
        const data = { count: -1, indexAry: [] };
        if (len > 0) {
            let bool = this.isExtraWin(0);
            data.count = 1;
            data.indexAry.push(0);
            for (let i = 1; i < len; i++) {
                if (bool !== this.isExtraWin(i)) {
                    bool = !bool;
                    data.count++;
                    data.indexAry.push(i);
                }
            }
        }
        return data;
    }

    // 搜尋LineExtraData索引是否有觸發LineExtra Win
    static isExtraWin(index) {
        const item = ReelResultData.lineExtraDataAry[index];
        // 依造各遊戲素質
        if (item > 0) {
            return true;
        }
        return false;
    }
}

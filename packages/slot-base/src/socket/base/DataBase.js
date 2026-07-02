export default class DataBase {
    /**
     *  # 封包傳送格式
     *  @Author  Robert
     *  @Ver     0.1.0
     */

    // [傳送資料] 把所有參數組在同一個Object當作只有一組數字參數傳送  1 : {value1 , value2 , value3}
    get sendData() {
        const ary = [ 1 ];
        const obj = {};

        Object.keys(this).forEach((keyInx) => {
            const item = this[keyInx];

            if (typeof item === 'object' && !item.hasOwnProperty(length)) {
                Object.assign(obj, item);
                return;
            }
            obj[keyInx] = item;
        });

        const singleData = JSON.stringify(obj);
        ary.push(singleData);

        return ary;
    }

    /**
     * [傳送資料]
     * @return {Boolean} Ary 返回封包陣列格式
     * 每個參數為一筆參數前面附一個數字代表  1 : value1 , 2 : value2 , 3 : value3
     * 目前只有LoginSend使用 但為了明確點由 LoginSend來複寫sendData 提示使用者說唯獨LoginSend 與其他SendData格式不同
     */
    get sendDatas() {
        const ary = [];

        Object.keys(this).forEach((keyInx) => {
            const item = this[keyInx];
            const data = (typeof item === 'object' && !item.hasOwnProperty(length)) ? JSON.stringify(item) : item;
            ary.push(keyInx + 1, data);
        });
        return ary;
    }
}

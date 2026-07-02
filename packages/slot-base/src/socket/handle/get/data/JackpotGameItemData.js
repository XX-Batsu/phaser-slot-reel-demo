export default class JackpotGameItemData {
    /**
     * Jackpot Game 資料
     * [Jackpot Start與Play資料是一樣的 但會因為某些遊戲不同 幾樣參數是不傳的 undefined 改回預設值
     * @param  {Object} result     server 拿到的 json 資料
     */
    constructor(result) {
        return {
            // 0 : 表示還沒開牌
            // > 0 表示該位置是第幾次(CurrentSelectTime)所點選
            JPItemSelected: result.JPItemSelected || [],
            // 0 : 未配置值
            // 1~4 表示 JackPotLevel 的層級值
            JPItemLevel: result.JPItemLevel || []
        };
    }
}

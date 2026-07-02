export default class BonusGameItemData {
    /**
     * Bonus Game 資料
     * [Bonus Start與Play資料是一樣的 但會因為某些遊戲不同 幾樣參數是不傳的 undefined 改回預設值
     * @param  {Object} result     server 拿到的 json 資料
     */
    constructor(result) {
        return {
            // 大於零的表示會顯示在畫面上的有意義值,小於零不顯示    [陣列]
            SelExtraData: result.SelExtraData || [],
            // 大於零的表示會顯示在畫面上的有意義值,小於零不顯示    [陣列]
            SelMultiplier: result.SelMultiplier || [],
            // 大於零的表示會顯示在畫面上的有意義值,小於零不顯示    [陣列]
            SelSpinTimes: result.SelSpinTimes || [],
            // 大於零的表示會顯示在畫面上的有意義值,小於零不顯示    [陣列]
            SelWin: result.SelWin || [],
            // 大於零的表示會顯示在畫面上的有意義值,小於零不顯示    [陣列]
            PlayerSelected: result.PlayerSelected || []
        };
    }
}

export default class FreeGameCompleteData {
    /**
     * 資料處理
     * @param  {Object} result     server 拿到的 json 資料
     */
    constructor(result) {
        return {
            // 錯誤碼
            ErrorCode: result.ErrorCode,
            // FreeGame 總贏分 (包含BaseGameScatter Pay)
            TotalWinAmt: result.TotalWinAmt,
            // BaseGame 中FreeSpin時, BonusSymbol帶的分數, 單位使用(分數)
            ScatterPayFromBaseGame: result.ScatterPayFromBaseGame,
            /**
            * 離開FREESPIN後會進入哪個模組
            * MODULE_BASEGAME = 0
            * MODULE_GAMBLE = 10
            * MODULE_FREESPIN = 50
            * MODULE_LUCKY_DRAW = 30
            */
            NextModule: result.NextModule,
            // 遊戲特有的資料
            GameExtraData: result.GameExtraData
        };
    }
}

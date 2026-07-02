export default class BonusCompleteData {
    /**
     * 資料處理
     * 註: Bonus game back 多一狀態用來check game state
     * @param  {Object} result     server 拿到的 json 資料
     */
    constructor(result) {
        return {
            // 錯誤碼
            ErrorCode: result.ErrorCode,
            // 玩家下注
            PlayerBet: result.PlayerBet,
            // FreeSpin開始時, Win欄位顯示的累計分數，不包含BaseGameScatter PayScatter Pay 需要Client端自己從BaseGame的贏線資訊加入
            TotalWinAmt: result.TotalWinAmt,
            // BaseGame 中FreeSpin時, BonusSymbol帶的分數,單位使用(分數)
            ScatterPayFromBaseGame: result.ScatterPayFromBaseGame,
            /*
            離開BONUS後會進入哪個模組
            eMODULE_BASE_GAME = 0,
            eMODULE_FREE_GAME = 20,
            eMODULE_BONUS_GAME = 30
            */
            NextModule: result.NextModule
        };
    }
}

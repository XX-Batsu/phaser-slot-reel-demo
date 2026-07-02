export default class JackpotCompleteData {
    /**
     * 資料處理
     * 註: Jackpot back 多一狀態用來check game state
     * @param  {Object} result     server 拿到的 json 資料
     */
    constructor(result) {
        return {
            // 錯誤碼
            ErrorCode: result.ErrorCode,
            // 玩家下注
            PlayerBet: result.PlayerBet,
            // 拉下彩金的分數
            JPWinAmt: result.JPWinAmt,
            // 為 GameCycle 總贏分 (前端在取分前所參考的值;多 round 的情 況下，以最後一 round 才有參考價值)
            TotalWinAmt: result.TotalWinAmt,
            /*
            離開JACKPOT後會進入哪個模組
            eMODULE_BASE_GAME = 0
            eMODULE_FREE_GAME = 20
            eMODULE_BONUS_GAME = 30
            eMODULE_LUCKY_DRAW = 40
            eMODULE_JACKPOT_GAME = 50
            */
            ReturnModule: result.ReturnModule
        };
    }
}

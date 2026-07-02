export default class FreeGameStartData {
    /**
     * 資料處理
     * @param  {Object} result     server 拿到的 json 資料
     */
    constructor(result) {
        return {
            // 錯誤碼
            ErrorCode: result.ErrorCode,
            // 玩家下注資訊
            PlayerBet: result.PlayerBet,
            // BaseGame 中FreeSpin時, BonusSymbol帶的分數, 單位使用(分數)
            ScatterPayFromBaseGame: result.ScatterPayFromBaseGame,
            // 表示遊戲最大可以 Trigger 幾次 FreeSpin
            MaxRound: result.MaxRound,
            // 目前已經 Trigger 幾次 FreeSpin
            AwardRound: result.AwardRound,
            // 當前已玩了第幾次 目前是玩第幾次 FreeSpin
            CurrentRound: result.CurrentRound,
            // Free spin可進行的最大次數
            MaxSpin: result.MaxSpin,
            // FreeSpin 進入時獲得的場次
            AwardSpinTimes: result.AwardSpinTimes,
            // 遊戲固定倍數
            Multiple: +result.Multiple,
            // 遊戲特有的資料
            GameExtraData: result.GameExtraData,
            // 拉中 JP 的累積分數
            AccumlateJPAmt: result.AccumlateJPAmt
        };
    }
}

import BonusGameItemData from 'socket/handle/get/data/BonusGameItemData';

export default class BonusStartData {
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
            // FreeSpin開始時, Win欄位顯示的累計分數，
            AccumlateWinAmt: result.AccumlateWinAmt,
            // BaseGame 中FreeSpin時, BonusSymbol帶的分數,單位使用(分數)
            ScatterPayFromBaseGame: result.ScatterPayFromBaseGame,
            // 表示遊戲最大可以Trigger 幾次FreeSpin,  例: Wolf Run 為4
            MaxRound: result.MaxRound,
            // 目前是玩第幾次FreeSpin,
            CurrentRound: result.CurrentRound,
            // 根據遊戲 udc_BONUS_GAME_ITEM
            DataSet: new BonusGameItemData(result.udcDataSet)
        };
    }
}

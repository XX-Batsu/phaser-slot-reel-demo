import BonusGameItemData from 'socket/handle/get/data/BonusGameItemData';

export default class BonusPlayData {
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
            // FreeSpin開始時, Win欄位顯示的累計分數，不包含BaseGameScatter PayScatter Pay 需要Client端自己從BaseGame的贏線資訊加入
            AccumlateWinAmt: result.AccumlateWinAmt,
            // BaseGame 中FreeSpin時, BonusSymbol帶的分數,單位使用(分數)
            ScatterPayFromBaseGame: result.ScatterPayFromBaseGame,
            // 判斷是否有下一場, 0: 表示還需要跑Bonus Play  1: 表示接下來是Bonus Complete
            GameComplete: result.GameComplete,
            // 本次選擇頁面顯示的資訊,動態長度, 參考udc_BONUS_GAME_ITEM
            DataSet: new BonusGameItemData(result.udcDataSet)
        };
    }
}

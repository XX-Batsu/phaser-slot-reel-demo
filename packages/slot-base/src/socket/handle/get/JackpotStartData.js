import JackpotGameItemData from 'socket/handle/get/data/JackpotGameItemData';

export default class JackpotStartData {
    /**
     * 資料處理
     * @param  {Object} result     server 拿到的 json 資料
     */
    constructor(result) {
        return {
            // 錯誤碼
            ErrorCode: result.ErrorCode,
            // 玩家下注資訊(uint)
            PlayerBet: result.PlayerBet,
            // 有幾個選項可以選擇(uint)
            SelectItemCount: result.SelectItemCount,
            // 根據遊戲 udc_JACKPOT_GAME_ITEM
            DataSet: new JackpotGameItemData(result.udcJPDataSet)
        };
    }
}

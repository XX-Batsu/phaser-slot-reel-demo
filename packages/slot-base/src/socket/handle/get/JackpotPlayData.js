import JackpotGameItemData from 'socket/handle/get/data/JackpotGameItemData';

export default class JackpotPlayData {
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
            // 拉下彩金的分數，最後一場 Play 才會知道(long)
            JPWinAmt: result.JPWinAmt,
            // 目前點選第幾次(uint)
            CurrentSelectTime: result.CurrentSelectTime,
            // 判斷是否有下一場,
            // 0: false, 表示還需要跑 JP Play
            // 1: true, 表示接下來是 JP Complete
            GameComplete: result.GameComplete,
            // 根據遊戲 udc_JACKPOT_GAME_ITEM
            DataSet: new JackpotGameItemData(result.udcJPDataSet)
        };
    }
}

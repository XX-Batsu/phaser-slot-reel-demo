export default class GameData {
    /**
     * 資料處理
     * @param  {Object} result     server 拿到的 json 資料
     */
    constructor(result) {
        return {
            // 錯誤碼
            ErrorCode: result.ErrorCode,
            // 快速押分表
            BetButton: result.BetButton,
            // 賠率表
            DenomDefine: result.DenomDefine,
            // 賠率表 index
            DefaultDenomIdx: result.DefaultDenomIdx,
            // 最高押注
            MaxBet: result.MaxBet,
            // 最高線數
            MaxLine: result.MaxLine,
            // 基本押注
            MiniBet: result.MiniBet,
            // 最高嬴分
            WinLimitLock: result.WinLimitLock,
            // 玩家帳戶金錢
            PlayerOwnCash: result.PlayerOwnCash,
            // 細單資料
            PlayerOrderURL: result.PlayerOrderURL,
            // 目前腳本版本
            EmulatorType: result.EmulatorType,
            // 聯名logo 資訊
            Cobrand: result.Cobrand || {},
            // 目前使用幣值
            DollarSignId: result.DollarSignId,
            // 是否顯示飛牌icon
            IsShowFreehand: result.IsShowFreehand,
            // 是否可飛牌(用於將飛牌icon返灰不能點擊)
            IsAllowFreehand: result.IsAllowFreehand
        };
    }
}

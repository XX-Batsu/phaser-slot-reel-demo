import PlayModel from 'socket/model/PlayModel';

export default class FreeGamePlayData extends PlayModel {
    /**
     * 資料處理
     * @param  {Object} result     server 拿到的 json 資料
     */
    constructor(result) {
        super();

        // 處理贏分資料
        return Object.assign({
            // 錯誤碼
            ErrorCode: result.ErrorCode,
            // 玩家下注資訊
            // PlayerBet: result.PlayerBet,
            // 目前累計贏分 (包含 BaseGame Scatter Pay)
            AccumlateWinAmt: result.AccumlateWinAmt,
            // BaseGame 中FreeSpin時, BonusSymbol帶的分數, 單位使用(分數)
            ScatterPayFromBaseGame: result.ScatterPayFromBaseGame,
            // 表示目前 trigger 幾次 FreeSpin
            AwardRound: result.AwardRound,
            // 目前是玩第幾次FreeSpin (遊戲如果是直接加Spin場次, 這個欄位值永遠會和usAwardRound相同)
            CurrentRound: result.CurrentRound,
            // 增加的round數
            RetriggerAddRound: result.RetriggerAddRound,
            // 目前獲得幾場 FreeSpin,不包含本場 retrigger 次數
            AwardSpinTimes: result.AwardSpinTimes,
            // 目前是第幾次Spin
            CurrentSpinTimes: result.CurrentSpinTimes,
            // Retrigger 增加場次
            // 如果 Retrigger 一次是加10場,但再5場就達到 MAX Spin,那麼就會回傳5
            RetriggerAddSpins: result.RetriggerAddSpins,
            // strip table 位置
            RngData: this.getRngData(result.RngData),
            // Reel位置上的symbol ID
            SymbolResult: this.getSymbolResult(result.SymbolResult),
            // 中線的狀態是什麼
            WinType: result.WinType,
            // Total Win
            TotalWin: result.TotalWin,
            // 總贏分線數
            WinLineCount: result.WinLineCount,
            // 各個贏分資訊
            udsOutputWinLine: result.udsOutputWinLine,
            // Extra Data count
            ExtraDataCount: result.ExtraDataCount,
            // 由 GameExtraDataCount 來判斷是否有 ExtraData
            ExtraData: result.ExtraData,
            // 目前腳本版本
            EmulatorType: result.EmulatorType,
            // free game 倍數 (前人種下的地雷，這裡收到的原始資料是字串，若為多個倍數會由空格隔開)
            Multiple: (isNaN(+result.Multiple)) ? result.Multiple.split(' ').map(sNum => +sNum) : +result.Multiple,
            // 滾輪變動的位置 (目地,來源)
            ReellPosChg: result.ReellPosChg || [],
            // 獎勵遊戲類型
            BonusType: result.BonusType || 0,
            // 額外獎勵，如滿盤時，額外給的金額
            SpecialAward: result.SpecialAward || 0,
            // 特殊使用圖標
            SpecialSymbol: result.SpecialSymbol || 0,
            // 滾輪長度變化
            ReelLenChange: result.ReelLenChange || [],
            // 是否為 respin
            IsRespin: result.IsRespin || false,
            // respin 要轉的滾輪 array
            RespinReels: result.RespinReels || [],
            // Lock滾輪的位置
            LockPos: result.LockPos,
            // 要轉換的 strip
            NextSTable: result.NextSTable || -1,
            // free game 場次資料 (scatter 個別點擊場次也含在內)
            FreeSpin: result.FreeSpin || [],
            // 拉中 JP 的累積分數
            AccumlateJPAmt: result.AccumlateJPAmt
        }, this.getUdsOutputWinLine(result.udsOutputWinLine));
    }
}

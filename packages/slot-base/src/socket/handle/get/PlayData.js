import PlayModel from 'socket/model/PlayModel';

export default class PlayData extends PlayModel {
    /**
     * 資料處理
     * @param  {Object} result server 拿到的資料
     * @return {Object} data   play的資料
     */
    constructor(result) {
        super();
        // 處理贏分資料
        return Object.assign({
            // 場次
            GamePlaySerialNumber: result.GamePlaySerialNumber,
            // range Data
            RngData: this.getRngData(result.RngData),
            // Reel位置上的symbol ID
            SymbolResult: this.getSymbolResult(result.SymbolResult),
            // BaseGame win
            BaseWin: result.BaseWin,
            // 總嬴分
            TotalWin: result.TotalWin,
            // 中線的狀態是什麼
            WinType: result.WinType,
            // 中幾條線
            WinLineCount: result.WinLineCount,
            // 是否觸發免費遊戲
            IsTriggerFG: result.IsTriggerFG,
            // 是否會進入其他模組
            NextModule: result.NextModule,
            // Extra Data count
            ExtraDataCount: result.ExtraDataCount,
            // 由 iGameExtraDataCount 來判斷是否有 ExtraData
            ExtraData: result.ExtraData,
            // 目前腳本版本
            EmulatorType: result.EmulatorType,
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
            // 買滾輪功能，所花費的Credit
            ReelPay: result.ReelPay || [],
            // 倍數
            Multiple: result.Multiple || 0,
            // 是否為 respin
            IsRespin: result.IsRespin || false,
            // free game 場次資料 (scatter 個別點擊場次也含在內)
            FreeSpin: result.FreeSpin || [],
            // respin 要轉的滾輪 array
            RespinReels: result.RespinReels || [],
            // 要轉換的 strip
            NextSTable: result.NextSTable || -1,
            // 是否有中 JackPot(bool)
            IsHitJackPot: result.IsHitJackPot || false
        }, this.getUdsOutputWinLine(result.udsOutputWinLine));
    }
}

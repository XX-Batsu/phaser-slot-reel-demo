import Tool from 'base/Tool';

export default class ReelResultData {
    /**
     *  Socket API轉出來的Reel資料
     */
    constructor() {
        // range Data
        this.rngData = 0;

        // Symbol 顯示
        this.symbolResult = [];

        // 總嬴分
        this.totalWin = 0;

        // 中幾條線
        this.winLineCount = 0;

        // range WinType
        this.winType = 0;

        // 每條線的贏分
        this.linePrizeAry = [];

        // 秀線資料
        this.showLineAry = [];

        // 每條線中幾格的資料
        this.symbolCountAry = [];

        // 中幾個種類
        this.numOfKindAry = [];

        // 每條線中的獎項ID
        this.symbolIdAry = [];

        // 贏分原始資料
        this.udsOutputWinLine = [];

        // 每條線的No
        this.winLineNoAry = [];

        // 每條線 中的每一軸的Symbol的位置(經過計算延伸出來的)
        this.symbolPositionAry = [];

        // 每條線贏分的倍數
        this.lineMultiplierAry = [];

        // 每條線贏分的特殊資料
        this.lineExtraDataAry = [];

        // 特殊遊戲使用，例如 game ID:54 進 FreeGame 條件是有 Wild 贏分連線
        this.lineTypeAry = [];

        // extra data
        this.extraDataCount = 0;
        this.extraData = [];

        // 獎勵遊戲類型
        this.BonusType = 0;
        // 額外獎勵，如滿盤時，額外給的金額
        this.SpecialAward = 0;
        // 特殊使用圖標
        this.SpecialSymbol = 0;
        // 滾輪長度變化
        this.ReelLenChange = [];
        // 是否為 respin
        this.IsRespin = false;
        // respin 要轉的滾輪 array
        this.RespinReels = [];
        // free game 場次資料 (scatter 個別點擊場次也含在內)
        this.FreeSpin = [];
    }

    set setData(data) {
        // range Data
        this.rngData = data.RngData;
        // 每輪的 symbolID
        this.symbolResult = data.SymbolResult;
        // 總嬴分
        this.totalWin = data.TotalWin;
        // 普通總贏分
        this.normalTotalWin = 0;
        // Extra總贏分
        this.extraTotalWin = 0;
        // 中幾條線
        this.winLineCount = data.WinLineCount;
        // range WinType
        this.winType = data.WinType;
        // 每條線的贏分
        this.linePrizeAry = data.linePrizeAry;
        // 秀線資料
        this.showLineAry = data.showLineAry;
        // 每條線中幾格的資料
        this.symbolCountAry = data.symbolCountAry;
        // 中幾個種類
        this.numOfKindAry = data.numOfKindAry;
        // 每條線中的獎項ID(先將 symbol 數字轉為ID)
        this.symbolIdAry = data.symbolIdAry;
        // 每條線的No
        this.winLineNoAry = data.winLineNoAry;
        // 每條線的Pos
        this.winPositionAry = data.winPositionAry;
        // 每條線的倍數
        this.lineMultiplierAry = data.LineMultiplierAry;
        // 額外資訊 (通常用來做遊戲特色)
        this.lineExtraDataAry = data.LineExtraDataAry;
        // 特殊遊戲使用，例如 game ID:54 進 FreeGame 條件是有 Wild 贏分連線
        this.lineTypeAry = data.LineTypeAry;
        // 是否中Jackpot
        this.IsJackpotHit = data.IsHitJackPot;

        this.extraDataCount = data.ExtraDataCount;
        this.extraData = data.ExtraData;
        // 此局是否有進入FreeGame
        this.isTriggerFg = data.IsTriggerFG;
        this.nextModule = data.NextModule;

        this.symbolPositionAry = Tool.getSymbolPosition(data.symbolIdAry, data.showLineAry, data.symbolCountAry, data.winPositionAry);

        this.allWildPosition = Tool.getAllWildPosition(data.SymbolResult, data.winPositionAry).wildAry;

        this.isAllWild = Tool.getAllWildPosition(data.SymbolResult, data.winPositionAry).isAllWild;

        this.ReellPosChg = data.ReellPosChg;
        this.BonusType = data.BonusType;
        this.SpecialAward = data.SpecialAward;
        this.SpecialSymbol = data.SpecialSymbol;
        this.ReelLenChange = data.ReelLenChange;
        this.IsRespin = data.IsRespin;
        this.RespinReels = data.RespinReels;
        this.nextSTable = data.NextSTable;
        this.FreeSpin = data.FreeSpin;

        // # 自訂
        // 普通
        this.normalTotalWin = 0;
        // Extra
        this.extraTotalWin = 0;

        for (let i = 0; i < this.lineExtraDataAry.length; i++) {
            // 舊版吃這個值
            const item = this.lineExtraDataAry[i];
            // 新版吃這個值
            const lineType = this.lineTypeAry[i];

            // ByGame
            (item > 0 || lineType > 0)
               ? this.extraTotalWin += this.linePrizeAry[i]
               : this.normalTotalWin += this.linePrizeAry[i];
        }
    }

    // 設定BaseGame資料
    static set reelData(data) {
        this.instances.setData = data;
    }

    /**
     * [取得原生]
     * @return {[any]} [PlayerInfo]
     */
    static get instances() {
        if (this.instance === undefined) {
            this.instance = new ReelResultData();
        }
        return this.instance;
    }

    static get winLineCount() {
        return this.instances.winLineCount;
    }

    static set totalWin(value) {
        this.instances.totalWin = value;
    }

    static get totalWin() {
        return this.instances.totalWin;
    }

    static get rngData() {
        return this.instances.rngData;
    }

    static get symbolResult() {
        return this.instances.symbolResult;
    }

    static get showLineAry() {
        return this.instances.showLineAry;
    }

    static get symbolCountAry() {
        return this.instances.symbolCountAry;
    }

    static get numOfKindAry() {
        return this.instances.numOfKindAry;
    }

    static get symbolIdAry() {
        return this.instances.symbolIdAry;
    }

    static get linePrizeAry() {
        return this.instances.linePrizeAry;
    }

    static get winLineNoAry() {
        return this.instances.winLineNoAry;
    }

    static get symbolPositionAry() {
        return this.instances.symbolPositionAry;
    }

    static get winPositionAry() {
        return this.instances.winPositionAry;
    }

    static get winType() {
        return this.instances.winType;
    }

    static get allWildPosition() {
        return this.instances.allWildPosition;
    }

    static get isAllWild() {
        return this.instances.isAllWild;
    }

    static get winCount() {
        return this.instances.winLineCount;
    }

    static get lineMultiplierAry() {
        return this.instances.lineMultiplierAry;
    }

    static get lineExtraDataAry() {
        return this.instances.lineExtraDataAry;
    }

    static get isTriggerFg() {
        return this.instances.isTriggerFg;
    }

    static get extraData() {
        return this.instances.extraData;
    }

    static get normalTotalWin() {
        return this.instances.normalTotalWin;
    }

    static get extraTotalWin() {
        return this.instances.extraTotalWin;
    }

    static get reellPosChg() {
        return this.instances.ReellPosChg;
    }

    static get bonusType() {
        return this.instances.BonusType;
    }

    static get specialAward() {
        return this.instances.SpecialAward;
    }

    static get specialSymbol() {
        return this.instances.SpecialSymbol;
    }

    static get reelLenChange() {
        return this.instances.ReelLenChange;
    }

    static get isRespin() {
        return this.instances.IsRespin;
    }

    static get nextTable() {
        return this.instances.nextSTable;
    }

    static get lineTypeAry() {
        return this.instances.lineTypeAry;
    }

    static get freeSpin() {
        return this.instances.FreeSpin;
    }

    static get isJackpotHit() {
        return this.instances.IsJackpotHit;
    }

    static get nextModule() {
        return this.instances.nextModule;
    }

}

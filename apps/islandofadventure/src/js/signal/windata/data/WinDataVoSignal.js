import { Signal, SlotGame } from 'slot-base';

export default class WinDataVoSignal extends Signal {
    constructor(sendSignal) {
        super(sendSignal);
        // 線數
        this.showLineAry = SlotGame.ReelResultData.showLineAry;
        // 中的個數 (某個 symobl 有幾個)
        this.symbolCountAry = SlotGame.ReelResultData.symbolCountAry;
        // 中的symbol 種類
        this.numOfKindAry = SlotGame.ReelResultData.numOfKindAry;
        // Symbol ID
        this.symbolIdAry = SlotGame.ReelResultData.symbolIdAry;
        // 線數分數
        this.linePrizeAry = SlotGame.ReelResultData.linePrizeAry;
        // Symbol原始資料位置(二維)
        this.symbolResult = SlotGame.ReelResultData.symbolResult;
        // 線數ID
        this.winLineNoAry = SlotGame.ReelResultData.winLineNoAry;
        // 中的位置
        this.symbolPositionAry = SlotGame.ReelResultData.symbolPositionAry;
        // 是否為全 group 動畫播放
        this.isAllWild = SlotGame.ReelResultData.isAllWild;
        // 全W的位置
        this.allWildPosition = SlotGame.ReelResultData.allWildPosition;
        // 總贏分
        this.totalWin = SlotGame.ReelResultData.totalWin;
        // 得分位置
        this.winPositionAry = SlotGame.ReelResultData.winPositionAry;
        // 贏線倍數
        this.lineMultiplierAry = SlotGame.ReelResultData.lineMultiplierAry;
        // 額外
        this.lineExtraDataAry = SlotGame.ReelResultData.lineExtraDataAry;
        // 特殊遊戲使用，例如 game ID:54 進 FreeGame 條件是有 Wild 贏分連線
        this.lineTypeAry = SlotGame.ReelResultData.lineTypeAry;
        // 免費遊戲場次資料
        this.freeSpin = SlotGame.ReelResultData.freeSpin;
        // 冒險島extra data
        this.extraData = SlotGame.ReelResultData.extraData;
    }
}

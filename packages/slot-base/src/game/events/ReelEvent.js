import Event from 'base/Event';
import ReelResultData from 'game/model/ReelResultData';
import FreeResultModel from 'game/model/FreeResultModel';
import SlotResultModel from 'game/model/SlotResultModel';

export default class ReelEvent extends Event {
    constructor(type, data = 0) {
        super(type);
        this.showLineAry = ReelResultData.showLineAry;
        this.symbolCountAry = ReelResultData.symbolCountAry;
        this.symbolIdAry = ReelResultData.symbolIdAry;
        this.linePrizeAry = ReelResultData.linePrizeAry;
        this.winLineNoAry = ReelResultData.winLineNoAry;
        this.symbolPositionAry = ReelResultData.symbolPositionAry;
        this.symbolResult = ReelResultData.symbolResult;
        this.rngData = ReelResultData.rngData;
        this.winType = ReelResultData.winType;
        this.hitAry = ReelResultData.hitAry;
        this.allWildPosition = ReelResultData.allWildPosition;
        this.winPositionAry = ReelResultData.winPositionAry;
        this.numOfKindAry = ReelResultData.numOfKindAry;
        this.extraData = ReelResultData.extraData;
        this.lineExtraDataAry = ReelResultData.lineExtraDataAry;
        this.lineTypeAry = ReelResultData.lineTypeAry;
        this.specialSymbol = ReelResultData.specialSymbol;
        this.isMaxSpin = FreeResultModel.isMaxSpin;
        this.addCount = FreeResultModel.RetriggerAddSpins;
        this.isMaxRound = FreeResultModel.isMaxRound;
        this.retriggerAddRounds = FreeResultModel.retriggerAddRounds;
        // respin 單輪的 reelPay
        this.singleReelPay = SlotResultModel.singleReelPay;
        this.singleReelPayIndex = SlotResultModel.singleReelPayIndex;
        this.reelSpeed = data;
    }
}
ReelEvent.ON_REELBAR_COMPLETE = 'ON_REELBAR_COMPLETE';
ReelEvent.ON_REELBAR_RECEIVE = 'ON_REELBAR_RECEIVE';
ReelEvent.ON_BTN_MORE = 'ON_BTN_MORE';
ReelEvent.ON_BOOST_PLAY = 'ON_BOOST_PLAY';
ReelEvent.ON_SLOW_FOCUS = 'ON_SLOW_FOCUS';
ReelEvent.ON_SINGLE_REEL_STOP = 'ON_SINGLE_REEL_STOP';

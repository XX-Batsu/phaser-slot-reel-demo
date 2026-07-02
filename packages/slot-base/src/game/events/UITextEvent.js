import Event from 'base/Event';
import GameInfo from 'game/model/GameInfo';
import FreeResultModel from 'game/model/FreeResultModel';

export default class UITextEvent extends Event {
    constructor(type) {
        super(type);
        switch (type) {
            case UITextEvent.ON_TEXT_UPDATE: {
                this.lineNum = GameInfo.userLine;
                this.betNum = GameInfo.userBet;

                // Use Denom
                this.DenomDefine = GameInfo.userDenomDefine;

                this.userPointDenom = GameInfo.userDenomPoint;   // 現有金額 [現金]
                this.userPoint = GameInfo.userPoint;            // 現有金額 [分數]

                this.totalDenom = GameInfo.getDenomBet; // 總押注 [現金]
                this.totalBet = GameInfo.getTotalBet;   // 總押注 [分數]

                this.gamePlaySerialNumber = GameInfo.gamePlaySerialNumber;
                break;
            }
            case UITextEvent.ON_TEXT_FREECOUNT: {
                this.freeCount = FreeResultModel.freeLastCount;
                this.freeAccumulateSpinTimes = FreeResultModel.currentFreeGameSpinTimes;
                break;
            }
            case UITextEvent.ON_TEXT_UPDATE_FREECOUNT: {
                this.freeAccumulateSpinTimes = FreeResultModel.currentFreeGameSpinTimes;
                break;
            }
            case UITextEvent.ON_TEXT_CREDIT: {
                this.userPointDenom = GameInfo.userDenomPoint;   // 現有金額 [現金]
                this.userPoint = GameInfo.userPoint;            // 現有金額 [分數]
                break;
            }
            case UITextEvent.ON_TEXT_CURRENCY: {
                this.totalDenom = GameInfo.getDenomBet; // 總押注 [現金]
                this.totalBet = GameInfo.getTotalBet;   // 總押注 [分數]
                break;
            }
            case UITextEvent.ON_TEXT_JACKPOT_POOL: {
                this.jackpotPool = GameInfo.jackpotPool; // 彩池獎金
                break;
            }
            default:
        }
    }
}
UITextEvent.ON_TEXT_UPDATE = 'ON_TEXT_UPDATE';
UITextEvent.ON_TEXT_FREECOUNT = 'ON_TEXT_FREECOUNT';
UITextEvent.ON_TEXT_UPDATE_FREECOUNT = 'ON_TEXT_UPDATE_FREECOUNT';
UITextEvent.ON_TEXT_CREDIT = 'ON_TEXT_CREDIT';
UITextEvent.ON_TEXT_CURRENCY = 'ON_TEXT_CURRENCY';
UITextEvent.ON_TEXT_JACKPOT_POOL = 'ON_TEXT_JACKPOT_POOL';
UITextEvent.ON_BET_UPDATE_LIST = 'ON_BET_UPDATE_LIST';

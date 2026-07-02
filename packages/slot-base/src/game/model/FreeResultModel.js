import ReelResultData from 'game/model/ReelResultData';

export default class FreeResultModel {
    constructor() {
        // 中的免費階級
        this.AwardRound = 0;
        // 中的免費階級次數(第四階是動態)
        this.AwardSpinTimes = 5;

        // 目前需要顯示的階級
        this.CurrentRound = 0;
        this.GameExtraData = '';
        this.MaxRound = 4;
        this.MaxSpin = 0;
        this.Multiple = 0;
        this.PlayerBet = 0;
        this.ScatterPayFromBaseGame = 0;

        // free play
        // 免費的累積贏分
        this.AccumlateWinAmt = 0;
        // 拉中JP的累積分數
        this.AccumlateJPAmt = 0;

        // 目前已使用的次數
        this.CurrentSpinTimes = 0; // 1~5(前三階段使用次次數只會傳1~5次)  第四階段會傳 1~85次
        // 目前已玩次數(純spin過的次數)
        this.FreeGameSpinTimes = 0;

        this.ExtraData = null;
        this.ExtraDataCount = 0;

        // 免費遊戲再度添加一個Round
        this.RetriggerAddRounds = 0;
        // 免費遊戲再度添加次數
        this.RetriggerAddSpins = 0;

        // 免費贏得分數(需要累積)
        this.freeWinScoreNum = 0;
        // FreeCount總次數累積
        this.totalFreeCount = 0;
        // RoundCount總次數累積
        this.totalRoundCount = 0;

        this.rngData = [];
        // Lock滾輪的位置
        this.LockPos = [];
        // Free game 總得分
        this.TotalWinAmt = 0;

        // 這一把是否中jackpot
        this.IsHitJackPot = false;
    }

    set setResultStartData(data) {
        this.AccumlateWinAmt = data.ScatterPayFromBaseGame;
        this.AccumlateJPAmt = data.AccumlateJPAmt;
        this.AwardRound = data.AwardRound;
        this.AwardSpinTimes = data.AwardSpinTimes;
        this.CurrentRound = data.CurrentRound;
        this.GameExtraData = data.GameExtraData;
        this.MaxRound = data.MaxRound;
        this.MaxSpin = data.MaxSpin;
        this.Multiple = data.Multiple;
        this.PlayerBet = data.PlayerBet;
        this.ScatterPayFromBaseGame = data.ScatterPayFromBaseGame;
        this.IsHitJackPot = data.IsHitJackPot;

        // Spin 最多也只有中到三階段
        this.totalFreeCount = data.AwardSpinTimes;
        // Round
        this.totalRoundCount = data.AwardRound;
    }

    set setResultPlayData(data) {
        this.AccumlateWinAmt = data.AccumlateWinAmt;
        this.AccumlateJPAmt = data.AccumlateJPAmt;
        this.AwardRound = data.AwardRound;
        this.CurrentRound = data.CurrentRound;
        this.CurrentSpinTimes = data.CurrentSpinTimes;
        this.ExtraData = data.ExtraData;
        this.ExtraDataCount = data.ExtraDataCount;
        this.Multiple = data.Multiple;

        this.RetriggerAddRounds = data.RetriggerAddRound;
        this.RetriggerAddSpins = data.RetriggerAddSpins;
        this.totalFreeCount += this.RetriggerAddSpins;   // 每次中階段時，會再增加次數，累加到總次數去
        this.totalRoundCount += this.RetriggerAddRounds; // 每次中 Round 時，會再增加 Round，累加到總 Round 去
        this.LockPos = data.LockPos;
        this.rngData = data.RngData;

        this.nextSTable = data.NextSTable;

        ReelResultData.reelData = data;
    }

    set setResultCompleteData(data) {
        this.NextModule = data.NextModule;
        this.TotalWinAmt = data.TotalWinAmt;
        this.FreeGameSpinTimes = 0;
    }

    static set freeStartData(data) {
        this.instances.setResultStartData = data;
    }

    static set freePlayData(data) {
        this.instances.setResultPlayData = data;
    }

    static set freeCompleteData(data) {
        this.instances.setResultCompleteData = data;
    }

    static get totalWinAmt() {
        return this.instances.TotalWinAmt;
    }

    /**
     * [取得原生]
     * @return {[any]} [PlayerInfo]
     */
    static get instances() {
        if (this.instance === undefined) {
            this.instance = new FreeResultModel();
        }
        return this.instance;
    }

    static get awardRound() {
        return this.instances.AwardRound;
    }

    static get retriggerAddRounds() {
        return this.instances.RetriggerAddRounds;
    }

    static set currentRound(value) {
        this.instances.CurrentRound = value;
    }

    static get currentRound() {
        return this.instances.CurrentRound;
    }

    static set currentSpinTimes(value) {
        this.instances.CurrentSpinTimes = value;
    }

    static get currentSpinTimes() {
        return this.instances.CurrentSpinTimes;
    }

    static get currentFreeGameSpinTimes() {
        return this.instances.FreeGameSpinTimes;
    }

    static roundLastCountUp() {
        this.instances.FreeGameSpinTimes ++;
    }

    static roundLastCountless() {
        this.instances.CurrentSpinTimes ++;
    }

    static get RetriggerAddSpins() {
        return this.instances.RetriggerAddSpins;
    }

    static get totalFreeCount() {
        return this.instances.totalFreeCount;
    }

    static set totalFreeCount(value) {
        this.instances.totalFreeCount = value;
    }

    static get totalRoundCount() {
        return this.instances.totalRoundCount;
    }

    static set freeWinScoreNum(value) {
        this.instances.freeWinScoreNum = value;
    }

    static get freeWinScoreNum() {
        return this.instances.freeWinScoreNum;
    }

    static get accumlateWinAmt() {
        return this.instances.AccumlateWinAmt;
    }

    static get accumlateJPAmt() {
        return this.instances.AccumlateJPAmt;
    }

    static get rngData() {
        return this.instances.rngData;
    }

    static get multiple() {
        return this.instances.Multiple;
    }

    static get maxSpin() {
        return this.instances.MaxSpin;
    }

    static get isMaxSpin() {
        return (this.instances.totalFreeCount >= this.instances.MaxSpin);
    }

    static get isMaxRound() {
        return (this.instances.totalRoundCount >= this.instances.MaxRound);
    }

    static get nextModule() {
        return this.instances.NextModule;
    }

    // 返回  總次數(含所有階級) - 已跑次數 = 總剩餘次數
    static get freeLastCount() {
        return this.instances.totalFreeCount - this.instances.CurrentSpinTimes;
    }

    static get lockPos() {
        return this.instances.LockPos;
    }

    static get NextSTable() {
        return this.instances.nextSTable;
    }

    static get gameExtraData() {
        return this.instances.GameExtraData;
    }

    static get scatterPayFromBaseGame() {
        return this.instances.ScatterPayFromBaseGame;
    }

    static get isHitJackpot() {
        return this.instances.IsHitJackpot;
    }
}

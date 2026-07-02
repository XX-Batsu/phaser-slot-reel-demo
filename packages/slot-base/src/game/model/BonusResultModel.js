export default class BonusResultModel {
    constructor() {
        this.PlayerBet = 0;
        this.AccumlateWinAmt = 0;
        this.CurrentRound = 0;
        this.MaxRound = 0;
        this.ScatterPayFromBaseGame = 0;
        this.DataSet = {};
        this.GameComplete = 0;
        this.NextModule = 0;
    }

    set setResultStartData(data) {
        this.PlayerBet = data.PlayerBet;
        this.AccumlateWinAmt = data.AccumlateWinAmt;
        this.CurrentRound = data.CurrentRound;
        this.MaxRound = data.MaxRound;
        this.ScatterPayFromBaseGame = data.ScatterPayFromBaseGame;
        this.DataSet = data.DataSet;
    }

    set setResultPlayData(data) {
        this.PlayerBet = data.PlayerBet;
        this.AccumlateWinAmt = data.AccumlateWinAmt;
        this.ScatterPayFromBaseGame = data.ScatterPayFromBaseGame;
        this.GameComplete = data.GameComplete;
        this.DataSet = data.DataSet;
    }

    set setResultCompleteData(data) {
        this.TotalWinAmt = data.TotalWinAmt;
        this.NextModule = data.NextModule;
        this.PlayerBet = data.PlayerBet;
        this.ScatterPayFromBaseGame = data.ScatterPayFromBaseGame;
    }

    static set bonusStartData(data) {
        this.instances.setResultStartData = data;
    }

    static set bonusPlayData(data) {
        this.instances.setResultPlayData = data;
    }

    static set bonusCompleteData(data) {
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
            this.instance = new BonusResultModel();
        }
        return this.instance;
    }

    static get playerBet() {
        return this.instances.PlayerBet;
    }

    static get accumlateWinAmt() {
        return this.instances.AccumlateWinAmt;
    }

    static get scatterPayFromBaseGame() {
        return this.instances.ScatterPayFromBaseGame;
    }

    static get gameComplete() {
        return this.instances.GameComplete;
    }

    static get dataSet() {
        return this.instances.DataSet;
    }

    static get nextModule() {
        return this.instances.NextModule;
    }
}

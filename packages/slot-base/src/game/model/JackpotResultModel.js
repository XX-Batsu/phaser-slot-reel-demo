export default class JackpotResultModel {
    constructor() {
        this.PlayerBet = 0;
        this.AccumlateWinAmt = 0;
        this.CurrentRound = 0;
        this.MaxRound = 0;
        this.ScatterPayFromBaseGame = 0;
        this.DataSet = {};
        this.GameComplete = 0;
        this.ReturnModule = 0;
        this.SelectItemCount = 0;
        this.CurrentSelectTime = 0;
        this.JPWinAmt = 0;
    }

    set setResultStartData(data) {
        this.PlayerBet = data.PlayerBet;
        this.AccumlateWinAmt = data.AccumlateWinAmt;
        this.CurrentRound = data.CurrentRound;
        this.MaxRound = data.MaxRound;
        this.ScatterPayFromBaseGame = data.ScatterPayFromBaseGame;
        this.DataSet = data.DataSet;
        this.SelectItemCount = data.SelectItemCount;
    }

    set setResultPlayData(data) {
        this.PlayerBet = data.PlayerBet;
        this.AccumlateWinAmt = data.AccumlateWinAmt;
        this.ScatterPayFromBaseGame = data.ScatterPayFromBaseGame;
        this.GameComplete = data.GameComplete;
        this.DataSet = data.DataSet;
        this.CurrentSelectTime = data.CurrentSelectTime;
        this.JPWinAmt = data.JPWinAmt;
    }

    set setResultCompleteData(data) {
        this.TotalWinAmt = data.TotalWinAmt;
        this.ReturnModule = data.ReturnModule;
        this.PlayerBet = data.PlayerBet;
        this.ScatterPayFromBaseGame = data.ScatterPayFromBaseGame;
        this.JPWinAmt = data.JPWinAmt;
    }

    static set jackpotStartData(data) {
        this.instances.setResultStartData = data;
    }

    static set jackpotPlayData(data) {
        this.instances.setResultPlayData = data;
    }

    static set jackpotCompleteData(data) {
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
            this.instance = new JackpotResultModel();
        }
        return this.instance;
    }

    static get selectItemCount() {
        return this.instances.SelectItemCount;
    }

    static get currentSelectTime() {
        return this.instances.CurrentSelectTime;
    }

    static get jpWinAmt() {
        return this.instances.JPWinAmt;
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

    static get returnModule() {
        return this.instances.ReturnModule;
    }
}

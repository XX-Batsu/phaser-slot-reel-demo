import ReelResultData from 'game/model/ReelResultData';

export default class SlotResultModel {
    constructor() {
        // # Base Game
        // 場次
        this.GamePlaySerialNumber = 0;
        // BaseGame win嬴分
        this.BaseWin = 0;
        // BonusGame win嬴分
        this.BonusWin = 0;
        // FreeGame Win 嬴分
        this.FreeWin = 0;
        // 特殊資料
        this.ExtraData = [];
        this.ExtraDataCount = 0;
        // range Data
        this.rngData = [];
        // 中Scatter進入免費遊戲時儲存當前BaseGame的轉動資料
        this.baseGameReelData = {};
        // 目前贏分累加
        this.winScoreAcc = 0;
        // 倍數
        this.Multiple = '';
        // 買滾輪功能，所花費的Credit
        this.ReelPay = [];
        // 單輪買分重轉的 credit
        this.singleRespinPay = 0;
        this.singleRespinIndex = 0;
        // 這一把是否中jackpot
        this.IsHitJackpot = false;
    }

    /**
     * 處理 Base Game play data
     * @param {Object} data play data
     */
    set setResultData(data) {
        this.BaseWin = data.BaseWin;
        this.BonusWin = data.BonusWin;
        this.ExtraData = data.ExtraData;
        this.ExtraDataCount = data.ExtraDataCount;
        this.FreeWin = data.FreeWin;
        this.GamePlaySerialNumber = data.GamePlaySerialNumber;
        this.rngData = data.RngData;
        this.Multiple = data.Multiple;
        this.ReelPay = data.ReelPay;
        this.IsHitJackpot = data.IsHitJackPot;

        // 由 RespinReels 去取得要重轉的 reel Index
        // 將 respin 的 Pay 與 reelIndex 記錄下來
        for (let i = 0; i < data.RespinReels.length; i++) {
            if (data.RespinReels[i] !== 0) {
                this.singleRespinPay = this.ReelPay[i];
                this.singleRespinIndex = i;
                break;
            }
            // 若是沒有 reelpay 則賦予 0
            this.singleRespinPay = 0;
        }

        ReelResultData.reelData = data;
    }

    /**
     * [取得原生]
     * @return {[any]} [PlayerInfo]
     */
    static get instances() {
        if (this.instance === undefined) {
            this.instance = new SlotResultModel();
        }
        return this.instance;
    }

    // 設定BaseGame資料
    static set slotData(data) {
        this.instances.setResultData = data;
    }

    static set slotSaveBaseReel(data) {
        this.instances.baseGameReelData = data;
    }

    static get slotSaveBaseReel() {
        return this.instances.baseGameReelData;
    }

    static get gamePlaySerialNumber() {
        return this.instances.GamePlaySerialNumber;
    }

    static get baseWin() {
        return this.instances.BaseWin;
    }

    static get bonusWin() {
        return this.instances.BonusWin;
    }

    static get freeWin() {
        return this.instances.FreeWin;
    }

    static get rngData() {
        return this.instances.rngData;
    }

    static get winScoreAccNum() {
        return this.instances.winScoreAcc;
    }

    static set winScoreAccNum(value) {
        this.instances.winScoreAcc = value;
    }

    static get multiple() {
        return this.instances.Multiple;
    }

    static get singleReelPay() {
        return this.instances.singleRespinPay;
    }

    static get reelPay() {
        return this.instances.ReelPay;
    }

    static get singleReelPayIndex() {
        return this.instances.singleRespinIndex;
    }

    static get isHitJackpot() {
        return this.instances.IsHitJackpot;
    }
}

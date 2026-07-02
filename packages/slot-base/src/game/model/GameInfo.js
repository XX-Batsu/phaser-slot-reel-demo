import Tool from 'base/Tool';
import ConfigPasser from 'base/ConfigPasser';

export default class GameInfo {
    constructor() {
        // 私人參數
        this.UserMoney = 0;
        this.LineInx = 1;
        this.LineStart = 1;
        this.LineEnd = 30;
        this.BetInx = 1;
        this.BetStart = 1;
        this.BetEnd = 10;
        this.WinScore = 0;
        this.WinLimitLock = 0;
        this.initRangeData = [];
        this.stepIndex = 0;
        this.gameStatus = '';
        this.GamePlaySerialNumber = '';
        this.isFreeSpin = false;
        this.isReSpin = false;
        this.isAutoPlay = false;
        this.autoPlayTimes = 0;
        this.isBonusPlay = false;
        this.isJackpotPlay = false;
        this.isBoostPlay = false;
        this.betButton = [ 1 ];
        this.betDefault = ConfigPasser.instance.BET_DEFAULT;
        this.denomDefine = [ 1 ];
        this.extraBet = 0;
        this.miniBet = 0;
        this.JackpotPool = {};
        this.PlayerOrderURL = '';
        this.ReelSelected = [];
        // Line Win Show Index
        this.lineIndex = 0;
        this.isShowFreehand = false;
        this.isAllowFreehand = false;
        this.actionMode = 0;    // spin模式 [0:一般模式 1:飛牌模式]

        this.userName = 'Player';
        this.currencyTypeAry = [];
        this.returnUrl = '';

        this.betArray = [];
        this.betCurrentIndexAry = [];
        this.lineArray = [];
        this.lineCurrentIndex = 0;
        this.denomArray = [];
        this.denomCurrentIndex = 0;
        this.currentBet = 0;
        this.userDenomPointNext = 0;
        this.hasExchanged = false;
    }

    // 匯兑資料
    static set exchangeData(value) {
        this.instances.currencyTypeAry = value;
    }
    static get exchangeData() {
        return this.instances.currencyTypeAry;
    }

    // 返回網址
    static set gameReturnUrl(value) {
        this.instances.returnUrl = value;
    }
    static get gameReturnUrl() {
        return this.instances.returnUrl;
    }

    // 押注額
    static set betDataAry(value) {
        this.instances.betArray = value;
    }
    static get betDataAry() {
        return this.instances.betArray;
    }
    // 押注額索引
    static setBetDataInx(symbolInx, betInx) {
        this.instances.betCurrentIndexAry[symbolInx] = betInx;
    }
    static get betDataInxAry() {
        return this.instances.betCurrentIndexAry;
    }

    // 押注層數
    static set lineDataAry(value) {
        this.instances.lineArray = value;
    }
    static get lineDataAry() {
        return this.instances.lineArray;
    }
    // 押注層數索引
    static set lineDataInx(value) {
        this.instances.lineCurrentIndex = value;
    }
    static get lineDataInx() {
        return this.instances.lineCurrentIndex;
    }

    // 押注層數
    static set denomDataAry(value) {
        this.instances.denomArray = value;
    }
    static get denomDataAry() {
        return this.instances.denomArray;
    }
    // 押注層數索引
    static set denomDataInx(value) {
        this.instances.denomCurrentIndex = value;
    }
    static get denomDataInx() {
        return this.instances.denomCurrentIndex;
    }

    // 當前押注額
    static set currentBet(value) {
        this.instances.currentBet = value;
    }
    static get currentBet() {
        return this.instances.currentBet;
    }
    // 回合結束時玩家餘額
    static set userDenomPointNext(value) {
        this.instances.userDenomPointNext = value;
    }
    static get userDenomPointNext() {
        return this.instances.userDenomPointNext;
    }
    static set hasExchanged(value) {
        this.instances.hasExchanged = value;
    }
    static get hasExchanged() {
        return this.instances.hasExchanged;
    }
    static set userName(value) {
        this.instances.userName = value;
    }
    static get userName() {
        return this.instances.userName;
    }

    /**
     * [設定Bet最大最小值]
     * @param  {Number} min [最小]
     * @param  {Number} max [最大]
     */
    static betSettoLimit(min, max) {
        this.instances.BetStart = min;
        this.instances.BetEnd = max;
    }

    /**
     * [設定Line最大最小值]
     * @param  {Number} min [最小]
     * @param  {Number} max [最大]
     */
    static lineSettoLimit(min, max) {
        this.instances.LineStart = min;
        this.instances.LineEnd = max;
    }

    /**
     * [取得原生]
     * @return {[any]} [PlayerInfo]
     */
    static get instances() {
        if (this.instance === undefined) {
            this.instance = new GameInfo();
        }
        return this.instance;
    }

    static set extraBet(value) {
        this.instances.extraBet = value;
    }

    static get extraBet() {
        return this.instances.extraBet;
    }

    static set miniBet(value) {
        this.instances.miniBet = value;
    }

    static get miniBet() {
        return this.instances.miniBet;
    }

    static set defaultBetButton(index) {
        this.instances.betDefault = index;
    }

    /**
     * 押注的 step
     * @param {Array}  value   押注的 step Array
     */
    static set betButton(value) {
        this.instances.betButton = value;
        this.setBetByValue(this.instances.betDefault);
    }

    static get betButton() {
        return this.instances.betButton;
    }

    /**
     * 押注的 denomDefine
     * @param {Array}  value   押注的 step denomDefine
     */
    static set denomDefine(value) {
        this.instances.denomDefine = value;
    }

    /**
     * [玩家點數]
     * @return {number} Money
     */
    static get userPoint() {
        const rate = Tool.accDiv(this.userDenomPoint, this.userDenomDefine);
        const point = Tool.accMul(rate, 100);
        return point;
    }

    /**
     * [玩家點數] (現金)
     * @return {[number]} [Money]
     */
    static get userDenomPoint() {
        return this.instances.UserMoney;
    }

    /**
     * [玩家點數] (現金)
     * @param {number}  value       點數
     */
    static set userDenomPoint(value) {
        this.instances.UserMoney = value;
    }

    /**
     * [Jackpot彩池]
     * @return {[number]} [pool data]
     */
    static get jackpotPool() {
        return this.instances.JackpotPool;
    }

    /**
     * [Jackpot彩池]
     * @param {number}  value
     */
    static set jackpotPool(value) {
        this.instances.JackpotPool = value;
    }

    /**
     * [目前使用線數]
     * @param {number} value  線數
     */
    static set userLine(value) {
        this.instances.LineInx = value;
    }

    /**
     * [目前使用線數]
     * @return {[numbe]} [Line]
     */
    static get userLine() {
        return this.instances.LineInx;
    }

    /**
     * [目前使用注數]
     * @return {[number]} [Bet]
     */
    static get userBet() {
        return this.instances.BetInx;
    }

    /**
     * [得分]
     * @param {number} value  分數
     */
    static set userWinScore(value) {
        this.instances.WinScore = value;
    }
    /**
     * [得分]
     * @return {[number]} [Score]
     */
    static get userWinScore() {
        return this.instances.WinScore;
    }

    /**
     * [試問目前金額是否足夠玩一局 (含線數押注扣分)]
     * @param {[Boolean]} advanceCompute = false [試算金額 是否進行真實扣錢]
     * @return {Boolean} IsSpinBool    false : 失敗 , true : 成功
     */
    static isAllowSpin(advanceCompute = false) {
        let IsSpinBool = false;
        const money = this.userDenomPoint;
        const totalbet = this.getDenomBet;
        if (money - totalbet >= 0) {
            IsSpinBool = true;
        }

        if (IsSpinBool && advanceCompute) {
            this.userDenomPoint = money - totalbet;
        }
        return IsSpinBool;
    }

    /**
     * [取得總押注]
     * @return {number} [Line * Bet]
     */
    static get getTotalBet() {
        const totalBet = this.instances.miniBet * this.instances.BetInx;
        return Tool.accMul(totalBet, ConfigPasser.instance.BASE_ODDS);
    }

    static getWinScoreSec(totalWin) {
        const data = {};
        // ratio
        const ratio = totalWin / this.getTotalBet | 0;

        // 聲音階段
        const step1 = (ratio >= ConfigPasser.instance.STEP_RATIO[0]);
        const step2 = (ratio >= ConfigPasser.instance.STEP_RATIO[1]);
        const step3 = (ratio >= ConfigPasser.instance.STEP_RATIO[2]);
        // 跑分時間計算
        let timeRange;

        if (step3) {
            timeRange = 7;
        } else if (step2 && ratio <= ConfigPasser.instance.STEP_RATIO[2]) {
            timeRange = 6;
        } else if (step1 && ratio <= ConfigPasser.instance.STEP_RATIO[1]) {
            timeRange = 5;
        } else {
            timeRange = 4;
        }

        const sec = (ratio / timeRange) | 0 || 1;

        // 音效要播放的階段
        let soundStep;

        if (step3) {
            soundStep = 4;
        } else if (step2) {
            soundStep = 3;
        } else if (step1) {
            soundStep = 2;
        } else {
            soundStep = 1;
        }

        data.sec = sec;
        data.soundStep = soundStep;

        return data;
    }

    /**
     * 取得真實的幣別總下注分數
     * @return {Number} 乘上 Denom 的真實下注分數
     */
    static get getDenomBet() {
        const rate = Tool.accMul(this.userBet, this.userDenomDefine);
        const baseOdd = Tool.accMul(Tool.accDiv(rate, 100), ConfigPasser.instance.BASE_ODDS);
        return Tool.accMul(this.instances.miniBet, baseOdd);
    }

    static get userDenomDefine() {
        return this.instances.denomDefine[this.instances.stepIndex];
    }

    /**
     * [線數累加]
     */
    static addLine() {
        let inx = this.instances.LineInx;
        inx++;
        (inx > this.instances.LineEnd)
            ? this.instances.LineInx = this.instances.LineStart
            : this.instances.LineInx = inx;
    }

    /**
     * [線數遞減]
     */
    static subLine() {
        let inx = this.instances.LineInx;
        inx--;
        (inx < this.instances.LineStart)
        ? this.instances.LineInx = this.instances.LineEnd
        : this.instances.LineInx = inx;
    }

    /**
     * 押注累加 step
     */
    static addStepBet() {
        this.instances.stepIndex = (this.instances.stepIndex < this.instances.betButton.length - 1)
                        ? this.instances.stepIndex + 1
                        : this.instances.stepIndex = 0;
        this.instances.BetInx = this.instances.betButton[this.instances.stepIndex];
    }

    /**
     * 押注遞減 step
     */
    static subStepBet() {
        this.instances.stepIndex = (this.instances.stepIndex <= 0)
                        ? this.instances.stepIndex = this.instances.betButton.length - 1
                        : this.instances.stepIndex - 1;

        this.instances.BetInx = this.instances.betButton[this.instances.stepIndex];
    }

    static setBetByValue(value) {
        const betMultiple = value / this.instances.miniBet;
        const targetInx = this.instances.betButton.indexOf(betMultiple);
        if (targetInx !== -1) {
            this.instances.stepIndex = targetInx;
            this.instances.BetInx = this.instances.betButton[targetInx];
            return;
        }
        this.instances.stepIndex = 0;
        this.instances.BetInx = this.instances.betButton[0];
    }

    /**
     * [滿線滿注]
     */
    static inBetLineFull() {
        this.instances.LineInx = this.instances.LineEnd;
        this.instances.BetInx = this.instances.BetEnd;
    }

    static set isAutoPlay(bool) {
        this.instances.isAutoPlay = bool;
    }

    static get isAutoPlay() {
        return this.instances.isAutoPlay;
    }

    static set autoPlayTimes(num) {
        this.instances.autoPlayTimes = num;
    }

    static get autoPlayTimes() {
        return this.instances.autoPlayTimes;
    }

    /**
     * [isFreeSpin ]
     * @param  {Boolean}  bool [description]
    */
    static set isFreeSpin(bool) {
        this.instances.isFreeSpin = bool;
    }

    /**
     * [isFreeSpin ]
     * @return {Boolean}      [description]
    */
    static get isFreeSpin() {
        return this.instances.isFreeSpin;
    }

    /**
     * [isReSpin ]
     * @param  {Boolean}  bool [description]
    */
    static set isReSpin(bool) {
        this.instances.isReSpin = bool;
    }

    /**
     * [isReSpin ]
     * @return {Boolean}      [description]
    */
    static get isReSpin() {
        return this.instances.isReSpin;
    }

    /**
     * [isBonusSpin ]
     * @param  {Boolean}  bool [description]
    */
    static set isBonusSpin(bool) {
        this.instances.isBonusPlay = bool;
    }

    /**
     * [isBonusSpin ]
     * @return {Boolean}      [description]
    */
    static get isBonusSpin() {
        return this.instances.isBonusPlay;
    }

    /**
     * [isJackpotPlaying ]
     * @param  {Boolean}  bool [description]
    */
    static set isJackpotPlaying(bool) {
        this.instances.isJackpotPlay = bool;
    }

    /**
     * [isJackpotPlaying ]
     * @return {Boolean}      [description]
    */
    static get isJackpotPlaying() {
        return this.instances.isJackpotPlay;
    }

    /**
     * [isBoostSpin ]
     * @param  {Boolean}  bool [description]
    */
    static set isBoostSpin(bool) {
        this.instances.isBoostPlay = bool;
    }

    /**
     * [isBoostSpin ]
     * @return {Boolean}      [description]
    */
    static get isBoostSpin() {
        return this.instances.isBoostPlay;
    }

    static set inGameRangeData(data) {
        this.instances.initRangeData = data;
    }

    static get inGameRangeData() {
        return this.instances.initRangeData;
    }

    /**
     * 場次
     */
    static get gamePlaySerialNumber() {
        return this.instances.GamePlaySerialNumber;
    }

    /**
     * 場次
     * @param  {string} value [場次]
     */
    static set gamePlaySerialNumber(value) {
        if (value !== '') {
            this.instances.GamePlaySerialNumber = value;
        }
    }

    /**
     * [遊戲狀態]
     * @param  {string} statesName [遊戲狀態]
     */
    static set gameSlotStates(statesName) {
        this.instances.gameStatus = statesName;
    }

    /**
     * 遊戲狀態
     * @return {string}            [遊戲狀態]
     */
    static get gameSlotStates() {
        return this.instances.gameStatus;
    }

    static set winLineIndex(index) {
        this.instances.lineIndex = index;
    }

    static get winLineIndex() {
        return this.instances.lineIndex;
    }

    /**
     * [設定細單資料]
     * @param {string} Url [細單網址]
     */
    static set playerOrderURL(value) {
        this.instances.PlayerOrderURL = value;
    }

    /**
     * [取得細單資料]
     */
    static get playerOrderURL() {
        return this.instances.PlayerOrderURL;
    }

    /**
     * [設定單輪spin資料]
     * @param {string} Array []
     */
    static set reelSelected(value) {
        this.instance.ReelSelected = value;
    }

    /**
     * [取得單輪spin資料]
     */
    static get reelSelected() {
        if (this.instances.ReelSelected.length === 0) {
            for (let inx = 0; inx < ConfigPasser.instance.NUM_REELS; inx++) {
                this.instances.ReelSelected.push(0);
            }
        }
        return this.instances.ReelSelected;
    }

    /**
     * [設定是否顯示飛牌icon]
     * @param  {Boolean}  bool [description]
    */
    static set isShowFreehand(bool) {
        this.instances.isShowFreehand = bool;
    }

    /**
     * [設定是否顯示飛牌icon]
     * @return {Boolean}      [description]
    */
    static get isShowFreehand() {
        return this.instances.isShowFreehand;
    }

    /**
     * [設定是否可飛牌(用於將飛牌icon返灰不能點擊)]
     * @param  {number}  bool [description]
    */
    static set isAllowFreehand(bool) {
        this.instances.isAllowFreehand = bool;
    }

    /**
     * [設定是否可飛牌(用於將飛牌icon返灰不能點擊)]
     * @return {number}      [description]
    */
    static get isAllowFreehand() {
        return this.instances.isAllowFreehand;
    }

    /**
     * [設定spin模式 0:一般模式 1:飛牌模式]
     * @param {number} value
     */
    static set actionMode(value) {
        this.instances.actionMode = value;
    }

    /**
     * [設定spin模式 0:一般模式 1:飛牌模式]
     * @return {[number]} [Score]
     */
    static get actionMode() {
        return this.instances.actionMode;
    }
}

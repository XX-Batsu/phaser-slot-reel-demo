import { GameBase, SocketStatesConfig, LoginSend, ConfigPasser, SlotGame } from 'slot-base';
import Config from 'js/main/Config';

export default class SocketSimulator extends GameBase {
    /**
     * photon 連線
     * @param  {Object} targetContext 父層 SocketManager
     * @param  {String} url           連線地址
     */
    constructor(targetContext, url) {
        super(targetContext);
        this.apiContext = targetContext;
        this.apiUrl = url;
        this.gameID = -1;
        this.token = '';
        this.ssoToken = '';
        this.agent = -1;

        this.currentResponseFunction = this.onHttpRequestError;
        this.currentTarget = this;
        this.currentPacketID = -1;
        this.currentData = null;
        // 設定是否激活 0 : 不觸發激活動作
        // this.keepAliveTimeoutMs = 0;

        this.loginSendMsg = new LoginSend();

        this.fakeDataMode = true;
        // 前端單機 demo：不連任何後端，Init/Spin 由本地產生
        this.offlineDemo = true;
        // offline spin 計數：每第 3 次回罐頭中獎封包
        this.offlineSpinCount = 0;
        this.currentLocalData = Object.create(null);
        this.currentLocalData.logintype = 3;

        this.freeTriggerData = Object.create(null);
        this.freeTriggerData.ScatterPayFromBaseGame = 0;
        this.freeTriggerData.freeGameIdRemain = [];
        this.freeTriggerData.totalwinscore = 0;
        this.freeTriggerData.scotterresult = [];
        this.freeTriggerData.accumlateWinAmt = 0;
        this.freeTriggerData.currentSpinTimes = 0;

        this.addEventListener(SlotGame.RefreshCurrencyEvent.ON_REQUEST, this.sendRefreshReq, this);
        this.addEventListener(SlotGame.ExchangeCurrencyEvent.ON_REQUEST, this.sendExchangeReq, this);
        this.addEventListener(SlotGame.CashoutEvent.ON_REQUEST, this.sendCashoutReq, this);
    }

    // 綁定基本事件 發送連線
    socketConnect() {
        // this.addPeerStatusListener('connect', this.onConnect);
        // this.addPeerStatusListener('connecting', this.onConnecting);
        // this.addPeerStatusListener('connectFailed', () => {});
        // this.addPeerStatusListener('connectClosed', this.connectClose);
        // this.addPeerStatusListener('disconnect', this.onDisconnect);
        // this.addPeerStatusListener('error', this.onConnectError);
        // this.addPeerStatusListener('timeout', this.onConnectTimeout);
        this.connect();
    }

    // 關閉連線
    closeSocket() {
        this.disconnect();
    }

    // 連線中
    onConnecting() {}
    // 接到 server 回傳 connect 事件
    onConnect() {
        if (this.completeEvent === undefined) { return; }
        // 連線成功
        const isConnect = this.isConnected();
        // 連線成功 通知父層
        (isConnect)
        ? this.completeEvent.call(this.apiContext)
        : this.onConnectError();    // 連線失敗
    }
    // 斷線事件
    connectClose() {
        if (this.connectCloseEvent !== undefined) {
            this.connectCloseEvent.call(this.apiContext, '與伺服器結束連線');
        }
    }
    // 斷線事件
    onDisconnect() {
        if (this.disconnectEvent !== undefined) {
            this.disconnectEvent.call(this.apiContext, '與伺服器斷線');
        }
    }
    // 連線失敗
    onConnectError(msg) {
        if (this.connectErrorEvent !== undefined) {
            let errorMsg = `Error: ${msg.Msg}`;
            let blockGame = true;
            switch (msg.ErrorCode) {
                case 18: {
                    errorMsg = '維護中';
                    blockGame = true;
                    break;
                }
                case 23: {
                    errorMsg = msg.Msg;
                    blockGame = true;
                    break;
                }
                default:
            }
            this.connectErrorEvent.call(this.apiContext, { errCode: msg.ErrorCode, errMsg: errorMsg, ifBlockGame: blockGame });
        }
    }
    onHttpRequestError(...errorMsg) {
        if (this.requestErrorEvent !== undefined) {
            this.requestErrorEvent.call(this.apiContext, errorMsg);
        }
    }
    // 連線失敗
    onConnectTimeout() {}
    // 收到Socket資料
    // onResultData(opcode, socketData, fun) {
    //     if (this.apiContext !== undefined && fun !== undefined) {
    //         fun.call(this.apiContext, opcode, socketData);
    //     }
    // }
    onResultData(response, responseFunction, target) {
        if (response.status !== 200) {
            this.onConnectError(response.statusText);
            return;
        }

        if (response.data.error.ErrorCode !== 0) {
            const errMsg = response.data.error.Msg;
            this.recordRespData(response.data.error.ErrorCode, errMsg, this.onHttpRequestError, target);
            return;
        }

        const packetID = response.data.error.ErrorCode;
        const data = response.data.data;
        data.err = 200;
        this.recordRespData(packetID, data, responseFunction, target);
    }

    recordRespData(packetID, data, responseFunction, target) {
        this.currentPacketID = packetID;
        this.currentData = data;
        this.currentResponseFunction = responseFunction;
        this.currentTarget = target;
    }

    clearRecord() {
        this.currentPacketID = null;
        this.currentData = null;
        this.currentResponseFunction = null;
        this.currentTarget = null;
    }

    set setToken(token) {
        const myToken = token || this.getCookie('ulgusertoken');
        this.token = myToken;
    }

    set setAgent(agent) {
        this.agent = agent;
    }

    set setGameID(gameID) {
        this.gameID = gameID;
    }

    // 設定連線成功事件
    set setOnComplete(externalEvent) {
        this.completeEvent = externalEvent;
    }

    // 設定連線中斷事件
    set setOnConnectClose(externalEvent) {
        this.connectCloseEvent = externalEvent;
    }

    // 設定斷線事件
    set setOnDisconnectEvent(externalEvent) {
        this.disconnectEvent = externalEvent;
    }

    // 設定連線錯誤事件
    set setOnConnectError(externalEvent) {
        this.connectErrorEvent = externalEvent;
    }

    set setOnRequestError(externalEvent) {
        this.requestErrorEvent = externalEvent;
    }

    setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        const expires = `expires=${d.toUTCString()}`;
        document.cookie = `${cname}=${cvalue};${expires};path=/`;
    }

    getCookie(cname) {
        const name = `${cname}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }

    /**
     * 發送 opcode 事件
     * @param  {String} opcode    事件名稱
     * @param  {Any}    param     傳遞的參數
     */
    emitEvent(opcode, param) {
        this.sendWSOperation(opcode, param);
    }

    /**
     * 發送 opcode 事件
     * @param  {String} opcode    事件名稱
     * @param  {Any}    param     傳遞的參數
     */
    async sendHttpRequest(param, path, respFun, target) {
        const sendData = Object.assign({
            accounttoken: this.token,
            token: this.ssoToken,
            gametypeid: this.gameID
        }, param);

// const binaryString = pako.deflate(JSON.stringify(sendData), { to: 'string' });
// console.log(binaryString);
// const restored = JSON.parse(pako.inflate(binaryString, { to: 'string' }));
// console.log(restored);

        await axios({
            url: `${this.apiUrl}${path}`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: sendData,
            responseType: 'json'
        })
        .then((response) => {
            if (response.data.error.ErrorCode !== 0) {
                this.onConnectError(response.data.error);
                return;
            }
            this.onResultData(response, respFun, target);
        })
        .catch((error) => {
            this.onConnectError(error);
        });

        if (this.currentResponseFunction) {
            this.currentResponseFunction.call(this.currentTarget, this.currentPacketID, this.currentData);
            this.clearRecord();
        }
    }

    /**
     * 註冊Server 回調opcode事件
     * @param {String} opcode 要監聽的事件名稱
     * @param {Function} fun 回調函數名稱
     */
    addOnResultEvent(opcode, fun) {
        switch (opcode) {
            case SocketStatesConfig.LOGIN: {
                this.onLoginConnect = fun;
                break;
            }
            case SocketStatesConfig.GAME_FLOW: {
                this.onGetOpcodeResult = fun;
                break;
            }
            default:
        }
        // this.addResponseListener(opcode, (data) => {
        //     this.onResultData(opcode, data, fun);
        // });
    }

    /**
     * 註冊Server 回調opcode事件
     * @param {String} opcode 要監聽的事件名稱
     * @param {Function} fun 回調函數名稱
     */
    addEvent(opcode, fun) {
        switch (opcode) {
            case SocketStatesConfig.CREDIT: {
                this.onGetCreditResult = fun;
                break;
            }
            case SocketStatesConfig.JACKPOT_POOL: {
                this.onGetJackpotPool = fun;
                break;
            }
            default:
        }
        // this.addEventListener(opcode, (data) => {
        //     this.onResultData(opcode, data, fun);
        // });
    }


// ========================================= agent ===============================================

    connect() {
        if (this.offlineDemo) {
            // 模擬連線成功後即發登入
            setTimeout(() => this.sendLoginReq(), 0);
            return;
        }
        if (!this.token || !this.apiUrl) {
            this.onConnectError();
            return;
        }
        this.webSocket = new WebSocket(`${this.apiUrl}?token=${this.token}`);
        this.webSocket.onclose = () => {
            this.onDisconnect();
        };
        this.webSocket.onmessage = (msg) => {
            this.onWSMessage(msg.data);
        };
        this.webSocket.onerror = (...data) => {
            this.onConnectError(data);
        };
        this.webSocket.onopen = () => {
            this.sendLoginReq();
        };
    }

    sendHttpOperation(opcode, param) {
        switch (opcode) {
            case SocketStatesConfig.LOGIN: {
                this.sendHttpRequest(param, '/account/login', this.responseLogin, this);
                break;
            }
            case SocketStatesConfig.GAME_CONFIG: {
                this.sendHttpRequest(param, '/lobby/init', this.responseConfig, this);
                break;
            }
            case SocketStatesConfig.BONUS_GAME_FLOW :
            case SocketStatesConfig.GAME_FLOW :
            case SocketStatesConfig.FREE_GAME_FLOW : {
                this.handleHttpGameFlow(param);
                break;
            }
            default:
        }
    }

    sendWSOperation(packetID, param) {
        switch (packetID) {
            case SocketStatesConfig.LOGIN: {
                if (this.offlineDemo) {
                    this.onWSMessage(JSON.stringify(this.makeFakeInit()));
                    break;
                }
                this.webSocket.send(
                    JSON.stringify(
                        {
                            Method: 'Init'
                        }
                    )
                );
                break;
            }
            case SocketStatesConfig.GAME_CONFIG: {
                const configSimulatedData = Object.create(null);
                configSimulatedData.Type = 1;
                configSimulatedData.ID = 111;
                configSimulatedData.Version = 0;
                configSimulatedData.ErrorCode = 0;
                configSimulatedData.DenomDefine = [];
                this.betData.BetMultipleRange.forEach(() => {
                    configSimulatedData.DenomDefine.push(100);
                }, this);
                configSimulatedData.BetButton = this.betData.BetMultipleRange;
                // configSimulatedData.BetMultiplys = this.init1stData.ConstBetMultiplyValue;
                configSimulatedData.DefaultDenomIdx = 6;
                configSimulatedData.MaxBet = this.betData.BaseBet * this.betData.BetMultipleRange[this.betData.BetMultipleRange.length - 1];
                configSimulatedData.MaxLine = Config.LINE_WIN_LIST.length;
                configSimulatedData.MiniBet = this.betData.BaseBet;
                configSimulatedData.WinLimitLock = 1000000000;
                configSimulatedData.DollarSignId = 1;
                configSimulatedData.EmulatorType = 0;
                configSimulatedData.GameExtraDataCount = 0;
                configSimulatedData.ExtraData = null;
                configSimulatedData.ExtendFeatureByGame = null;
                configSimulatedData.Cobrand = null;
                configSimulatedData.PlayerOrderURL = null;
                configSimulatedData.IsShowFreehand = false;
                configSimulatedData.IsAllowFreehand = false;
                configSimulatedData.PlayerOwnCash = 1000000;

                this.apiContext.onGetCreditResult(
                    1,
                    {
                        irq: 1,
                        vals: [
                            1,
                            this.currentLocalData.playerCredit
                        ]
                    }
                );

                this.responseConfig(configSimulatedData);
                break;
            }
            case SocketStatesConfig.FREE_GAME_FLOW :
            case SocketStatesConfig.GAME_FLOW : {
                this.handleWsFakeGameFlow(param);
                break;
            }
            default:
        }
    }

    handleWsFakeGameFlow(param) {
        const sendData = JSON.parse(param[1]);
        switch (sendData.ID) {
            case SocketStatesConfig.SEND_STRIP: {
                const stripSimulatedData = Object.create(null);
                stripSimulatedData.Type = 1;
                stripSimulatedData.ID = 112;
                stripSimulatedData.Version = 0;
                stripSimulatedData.ErrorCode = 0;
                stripSimulatedData.BGStripStartID = 0;
                stripSimulatedData.FGStripStartID = 50;
                stripSimulatedData.BGStripCount = 1;
                stripSimulatedData.BGContext = [
                    this.baseStripsAry
                ];
                stripSimulatedData.FGStripCount = 1;
                stripSimulatedData.FGContext = [
                    this.freeStripsAry
                ];
                stripSimulatedData.fakeDataMode = this.fakeDataMode;

                this.responseStrip(stripSimulatedData);
                break;
            }
            case SocketStatesConfig.SEND_BASE_PLAY: {
                this.currentTotalBet = sendData.PlayBet * this.betData.BaseBet;
                if (this.offlineDemo) {
                    this.onWSMessage(JSON.stringify(this.makeFakeSpin(sendData)));
                    break;
                }
                const playSimulatedData = Object.create(null);
                playSimulatedData.Method = 'Spin';
                playSimulatedData.Data = Object.create(null);
                playSimulatedData.Data.Line = sendData.PlayLine;
                playSimulatedData.Data.Bet = this.betData.BetMultipleRange.indexOf(sendData.PlayBet);
                const sendplay = JSON.stringify(playSimulatedData);
                this.webSocket.send(sendplay);
                break;
            }
            case SocketStatesConfig.SEND_BASE_IDLE: {
                const idleSimulatedData = Object.create(null);
                idleSimulatedData.Type = 3;
                idleSimulatedData.ID = 132;
                idleSimulatedData.Version = 0;
                idleSimulatedData.ErrorCode = 0;
                this.onCreditUpdated(this.currentLocalData.playerCredit);
                this.responseIdle(idleSimulatedData);
                break;
            }
            case SocketStatesConfig.SEND_RESPIN_PLAY: {
                const respinSimulatedData = Object.create(null);
                const currentRespinPlayData = this.currentLocalData.respinData.shift();

                respinSimulatedData.Type = 3;
                respinSimulatedData.ID = 133;
                respinSimulatedData.version = 0;
                respinSimulatedData.ErrorCode = 0;
                respinSimulatedData.GamePlaySerialNumber = 9487987787;
                respinSimulatedData.RngData = currentRespinPlayData.RngData;

                const arrengedSymbolResult = [];
                for (let row = 0; row < Config.NUM_ROWS; row++) {
                    arrengedSymbolResult[row] = [];
                }
                const symbolsAry = currentRespinPlayData.SymbolResult;
                for (let symbolInx = 0; symbolInx < symbolsAry.length; symbolInx++) {
                    const row = Math.floor(symbolInx / Config.NUM_REELS);
                    const reel = symbolInx % Config.NUM_REELS;
                    arrengedSymbolResult[row][reel] = symbolsAry[symbolInx];
                    if (symbolInx % Config.NUM_REELS === Config.NUM_REELS - 1) {
                        arrengedSymbolResult[row] = arrengedSymbolResult[row].toString();
                    }
                }
                respinSimulatedData.SymbolResult = arrengedSymbolResult;

                respinSimulatedData.EmulatorType = 0;
                respinSimulatedData.WinType = currentRespinPlayData.WinType;
                respinSimulatedData.BaseWin = currentRespinPlayData.WinPrize;
                respinSimulatedData.TotalWin = currentRespinPlayData.WinPrize;
                respinSimulatedData.IsTriggerFG = currentRespinPlayData.FreeGameData !== null;
                respinSimulatedData.NextModule = 0;
                respinSimulatedData.WinLineCount = currentRespinPlayData.WinLine.length;

                respinSimulatedData.ExtraDataCount = 0;
                respinSimulatedData.ExtraData = [ null, null ];

                if (currentRespinPlayData.ExtraData.GF_EXPANDINGSYMBOL) {
                    respinSimulatedData.ExtraDataCount++;
                    respinSimulatedData.ExtraData[0] = JSON.parse(currentRespinPlayData.ExtraData.GF_EXPANDINGSYMBOL);
                }
                if (currentRespinPlayData.ExtraData.GF_RESPIN) {
                    respinSimulatedData.ExtraDataCount++;
                    respinSimulatedData.ExtraData[1] = JSON.parse(currentRespinPlayData.ExtraData.GF_RESPIN);
                }

                respinSimulatedData.ReellPosChg = [ 0 ];
                respinSimulatedData.BonusType = 0;
                respinSimulatedData.SpecialAward = 0;
                respinSimulatedData.SpecialSymbol = 0;
                respinSimulatedData.ReelLenChange = [];
                respinSimulatedData.ReelPay = [];
                respinSimulatedData.IsRespin = this.currentLocalData.respinData.length > 0;
                respinSimulatedData.RespinReels = [ 0, 0, 0, 0, 0 ];
                respinSimulatedData.Multiple = 0;
                respinSimulatedData.NextSTable = 0;
                respinSimulatedData.FreeSpin = [ 0 ];
                respinSimulatedData.IsHitJackPot = false;

                respinSimulatedData.udsOutputWinLine = [];
                currentRespinPlayData.WinLine.forEach((winData) => {
                    const singleLineData = Object.create(null);
                    singleLineData.SymbolId = winData.SymbolId;
                    singleLineData.LinePrize = winData.Prize;
                    singleLineData.NumOfKind = winData.SymbolCount;
                    singleLineData.SymbolCount = winData.SymbolCount;
                    singleLineData.WinLineNo = winData.WinLineNo - 1;
                    singleLineData.LineMultiplier = winData.LineMultiplier ? winData.LineMultiplier : 1;
                    singleLineData.WinPosition = winData.WinLinePosition;
                    singleLineData.LineExtraData = [ 0 ];
                    singleLineData.LineType = 0;
                    if (Config.SYMBOL_FREE.includes(ConfigPasser.instance.SYMBOL_ID_NUM[winData.SymbolId])) {
                        this.FreeGameData.scatterPay = singleLineData.LinePrize;
                    }
                    respinSimulatedData.udsOutputWinLine.push(singleLineData);
                }, this);

                this.currentLocalData.playerCredit += currentRespinPlayData.TotalWinPrize;

                const inversePacket = Object.create(null);
                inversePacket.errCode = 200;
                inversePacket.msg = null;
                inversePacket.res = 2;
                inversePacket.vals = [
                    1,
                    JSON.stringify(respinSimulatedData)
                ];
                this.apiContext.onGetOpcodeResult(2, inversePacket);
                break;
            }
            default:
        }
    }

    onWSMessage(msg) {
        const data = JSON.parse(msg);
        switch (data.Method) {
            case 'Init': {
                this.currentLocalData.playerCredit = data.Credit;
                this.responseLogin(data.Data);
                break;
            }
            case 'Spin': {
                this.responsePlay(data);
                break;
            }
            case 'EndRound' : {
                // const translatedData = Object.create(null);
                // translatedData.credit = data.Credit;
                // this.apiContext.dispatch(WebApiStatesConfig.PACKET_ENDROUND, translatedData);
                break;
            }
            default:
        }
    }

    handleHttpGameFlow(param) {
        const sendData = JSON.parse(param[1]);
        switch (sendData.ID) {
            case SocketStatesConfig.SEND_STRIP: {
                const stripSimulatedData = Object.create(null);
                stripSimulatedData.Type = 1;
                stripSimulatedData.ID = 112;
                stripSimulatedData.Version = 0;
                stripSimulatedData.ErrorCode = 0;
                stripSimulatedData.BGStripStartID = 0;
                stripSimulatedData.FGStripStartID = 50;
                stripSimulatedData.BGStripCount = 1;
                stripSimulatedData.BGContext = [
                    this.baseStripsAry
                ];
                stripSimulatedData.FGStripCount = 1;
                stripSimulatedData.FGContext = [
                    this.freeStripsAry
                ];
                stripSimulatedData.fakeDataMode = this.fakeDataMode;

                this.responseStrip(stripSimulatedData);
                break;
            }
            case SocketStatesConfig.SEND_BASE_PLAY: {
                this.currentLocalData.playerBet = sendData.PlayBet;
                const sendPlay = Object.create(null);
                sendPlay.playerid = this.currentLocalData.id;
                sendPlay.bet = sendData.PlayBet;
                this.sendHttpRequest(sendPlay, '/game/gameresult', this.responsePlay, this);
                break;
            }
            case SocketStatesConfig.SEND_BASE_IDLE: {
                const idleSimulatedData = Object.create(null);
                idleSimulatedData.Type = 3;
                idleSimulatedData.ID = 132;
                idleSimulatedData.Version = 0;
                idleSimulatedData.ErrorCode = 0;

                this.freeTriggerData.accumlateWinAmt = 0;

                this.onCreditUpdated(this.currentLocalData.playerCredit);

                this.responseIdle(idleSimulatedData);
                break;
            }
            case SocketStatesConfig.SEND_BONUS_GAME_START: {
                const bonusStartSimulatedData = Object.create(null);
                bonusStartSimulatedData.Type = 3;
                bonusStartSimulatedData.ID = 144;
                bonusStartSimulatedData.Version = 0;
                bonusStartSimulatedData.ErrorCode = 0;

                bonusStartSimulatedData.PlayerBet = this.currentLocalData.playerBet;
                bonusStartSimulatedData.AccumlateWinAmt = 0;
                bonusStartSimulatedData.ScatterPayFromBaseGame = this.freeTriggerData.ScatterPayFromBaseGame;
                bonusStartSimulatedData.MaxRound = 1;
                bonusStartSimulatedData.CurrentRound = 1;
                bonusStartSimulatedData.udcDataSet = {
                    SelExtraData: [],
                    SelMultiplier: [],
                    SelSpinTimes: [],
                    SelWin: [],
                    PlayerSelected: [ 0 ]
                };
                this.responseBonusStart(bonusStartSimulatedData);
                break;
            }
            case SocketStatesConfig.SEND_BONUS_GAME_PLAY: {
                const sendBonusPlay = Object.create(null);
                sendBonusPlay.playerid = this.currentLocalData.id;
                sendBonusPlay.scotterid = this.freeTriggerData.freeGameIdRemain.shift();
                sendBonusPlay.luckydrawselect = sendData.PlayerSelectIndex;
// this.responseBonusPlay();
                this.sendHttpRequest(sendBonusPlay, '/game/scottergameresult', this.responseBonusPlay, this);
                break;
            }
            case SocketStatesConfig.SEND_BONUS_GAME_COMPLETE: {
                const bonusCompleteSimulatedData = Object.create(null);
                bonusCompleteSimulatedData.Type = 3;
                bonusCompleteSimulatedData.ID = 146;
                bonusCompleteSimulatedData.Version = 0;
                bonusCompleteSimulatedData.ErrorCode = 0;

                bonusCompleteSimulatedData.PlayerBet = this.currentLocalData.playerBet;
                bonusCompleteSimulatedData.TotalWinAmt = this.freeTriggerData.totalwinscore;
                bonusCompleteSimulatedData.ScatterPayFromBaseGame = this.freeTriggerData.ScatterPayFromBaseGame;
                bonusCompleteSimulatedData.NextModule = 20;

                this.responseBonusComplete(bonusCompleteSimulatedData);
                break;
            }
            case SocketStatesConfig.SEND_FREE_START: {
                const freeStartSimulatedData = Object.create(null);
                freeStartSimulatedData.Type = 3;
                freeStartSimulatedData.ID = 141;
                freeStartSimulatedData.Version = 0;
                freeStartSimulatedData.ErrorCode = 0;

                freeStartSimulatedData.AccumlateJPAmt = 0;
                freeStartSimulatedData.AccumlateWinAmt = 0;
                freeStartSimulatedData.AwardRound = 1;
                freeStartSimulatedData.AwardSpinTimes = this.freeTriggerData.scotterresult.length;
                freeStartSimulatedData.CurrentRound = 1;
                freeStartSimulatedData.GameExtraData = '';
                freeStartSimulatedData.MaxRound = 10;
                freeStartSimulatedData.MaxSpin = 25;
                freeStartSimulatedData.Multiple = 0;
                freeStartSimulatedData.PlayerBet = this.currentLocalData.playerBet;
                freeStartSimulatedData.ScatterPayFromBaseGame = this.freeTriggerData.ScatterPayFromBaseGame + this.freeTriggerData.accumlateWinAmt;

                this.freeTriggerData.currentSpinTimes = 0;

                this.responseFreeStart(freeStartSimulatedData);
                break;
            }
            case SocketStatesConfig.SEND_FREE_PLAY: {
                this.freeTriggerData.currentSpinTimes++;

                const freePlaySimulatedData = Object.create(null);
                freePlaySimulatedData.Type = 3;
                freePlaySimulatedData.ID = 142;
                freePlaySimulatedData.Version = 0;
                freePlaySimulatedData.ErrorCode = 0;

                const freePlayData = this.freeTriggerData.scotterresult[this.freeTriggerData.currentSpinTimes - 1];
                this.freeTriggerData.accumlateWinAmt += freePlayData.h5score;
                freePlaySimulatedData.AccumlateJPAmt = 0;
                freePlaySimulatedData.AwardRound = 1;
                freePlaySimulatedData.AwardSpinTimes = this.freeTriggerData.scotterresult.length;
                freePlaySimulatedData.BonusType = 0;
                freePlaySimulatedData.CurrentRound = 1;
                freePlaySimulatedData.CurrentSpinTimes = this.freeTriggerData.currentSpinTimes;
                freePlaySimulatedData.EmulatorType = 0;
                freePlaySimulatedData.ExtraData = [ 0 ];
                freePlaySimulatedData.ExtraDataCount = 1;
                freePlaySimulatedData.FreeSpin = [ 0 ];
                freePlaySimulatedData.IsRespin = false;
                freePlaySimulatedData.LockPos = [];
                freePlaySimulatedData.Multiple = 0;
                freePlaySimulatedData.NextSTable = 0;
                freePlaySimulatedData.ReelLenChange = [];
                freePlaySimulatedData.ReellPosChg = [];
                freePlaySimulatedData.RespinReels = [ 0, 0, 0, 0, 0 ];
                freePlaySimulatedData.RetriggerAddRound = 0;
                freePlaySimulatedData.TotalWin = 0;
                freePlaySimulatedData.TotalWin += freePlayData.h5score;
                for (let i = 0; i < freePlayData.gameresult.length; i++) {
                    const record = freePlaySimulatedData.RetriggerAddRound;
                    if (record === freePlaySimulatedData.RetriggerAddRound) {
                        for (let j = 0; j < freePlayData.gameresult[i].ScotterPoint.length; j++) {
                            if (freePlayData.gameresult[i].ScotterPoint[j].length > 0) {
                                freePlaySimulatedData.RetriggerAddRound += 1;
                                break;
                            }
                        }
                    }
                    freePlaySimulatedData.TotalWin += freePlayData.gameresult[i].Score;
                    this.freeTriggerData.accumlateWinAmt += freePlayData.gameresult[i].Score;
                    freePlaySimulatedData.Multiple = freePlayData.gameresult[i].SpecialWinRate;
                }
                freePlaySimulatedData.AccumlateWinAmt = this.freeTriggerData.accumlateWinAmt;

                freePlaySimulatedData.RetriggerAddSpins = 0;
                freePlaySimulatedData.RngData = [];
                for (let i = 0; i < freePlayData.plateindex.length; i++) {
                    freePlaySimulatedData.RngData[i] = freePlayData.plateindex[i][1];
                }
                freePlaySimulatedData.ScatterPayFromBaseGame = this.freeTriggerData.ScatterPayFromBaseGame;
                freePlaySimulatedData.SpecialAward = 0;
                freePlaySimulatedData.SpecialSymbol = 0;
                freePlaySimulatedData.SymbolResult = [ [], [], [] ];
                for (let reelInx = 0; reelInx < freePlayData.plate.length; reelInx++) {
                    for (let rowInx = 0; rowInx < freePlayData.plate[reelInx].length; rowInx++) {
                        freePlaySimulatedData.SymbolResult[rowInx][reelInx] = freePlayData.plate[reelInx][rowInx] === 0 ? 13 : freePlayData.plate[reelInx][rowInx];
                    }
                }
                freePlaySimulatedData.SymbolResult.forEach((rowSymbols, inx) => {
                    freePlaySimulatedData.SymbolResult[inx] = rowSymbols.toString();
                }, this);
                freePlaySimulatedData.WinLineCount = 0;
                freePlaySimulatedData.WinLineCount = freePlayData.gameresult.length;

                let winType = freePlaySimulatedData.TotalWin > 0 ? 1 : 0;
                if (freePlaySimulatedData.RetriggerAddRound > 0) {
                    winType = 2;
                }

                freePlaySimulatedData.WinType = winType;
                freePlaySimulatedData.udsOutputWinLine = [];
                if (freePlaySimulatedData.WinLineCount > 0) {
                    freePlayData.gameresult.forEach((winLineData, winLineInx) => {
                        let symbolID = -1;
                        for (let reel = 0; reel < winLineData.WinSymbolNum.length; reel++) {
                            for (let row = 0; row < winLineData.WinSymbolNum[reel].length; row++) {
                                if (winLineData.WinSymbolNum[reel][row] !== 0) {
                                    symbolID = winLineData.WinSymbolNum[reel][row];
                                    break;
                                }
                            }
                            if (symbolID > -1) {
                                break;
                            }
                        }
                        let symbolCount = 0;
                        for (let reel = 0; reel < winLineData.WinSymbolPoint.length; reel++) {
                            symbolCount += winLineData.WinSymbolPoint[reel].length;
                        }
                        const winPosition = [];
                        winPosition.length = Config.NUM_ROWS;
                        for (let row = 0; row < winPosition.length; row++) {
                            winPosition[row] = [];
                            winPosition[row].length = Config.NUM_REELS;
                            for (let reel = 0; reel < winPosition[row].length; reel++) {
                                winPosition[row][reel] = 0;
                            }
                        }
                        for (let reel = 0; reel < winLineData.WinSymbolNum.length; reel++) {
                            for (let row = 0; row < winLineData.WinSymbolNum[reel].length; row++) {
                                const currentSymbolID = winLineData.WinSymbolNum[reel][row];
                                if (currentSymbolID === symbolID) {
                                    winPosition[winLineData.WinSymbolPoint[reel][row]][reel] = 1;
                                }
                                if (Config.SYMBOL_WILD.includes(Config.SYMBOL_ID_NUM[currentSymbolID])) {
                                    winPosition[winLineData.WinSymbolPoint[reel][row]][reel] = 2;
                                }
                                if (Config.SYMBOL_WILD.includes(Config.SYMBOL_FREE[currentSymbolID])) {
                                    this.freeTriggerData.ScatterPayFromBaseGame = winLineData.Score;
                                }
                            }
                        }

                        freePlaySimulatedData.udsOutputWinLine[winLineInx] = {
                            SymbolId: symbolID,
                            LinePrize: winLineData.Score,
                            NumOfKind: winLineData.WinSymbolPoint.length,
                            SymbolCount: symbolCount,
                            WinLineNo: 0,
                            LineMultiplier: winLineData.SpecialWinRate,
                            WinPosition: winPosition,
                            LineExtraData: [ 0 ],
                            LineType: 0
                        };
                    }, this);
                }

                if (freePlayData.h5score > 0) {
                    freePlaySimulatedData.WinLineCount++;
                    const winPosition = [];
                    winPosition.length = Config.NUM_ROWS;
                    for (let row = 0; row < winPosition.length; row++) {
                        winPosition[row] = [];
                        winPosition[row].length = Config.NUM_REELS;
                        for (let reel = 0; reel < winPosition[row].length; reel++) {
                            winPosition[row][reel] = 0;
                        }
                    }
                    for (let reelInx = 0; reelInx < freePlayData.plate.length; reelInx++) {
                        if (reelInx === 0 || reelInx === 4) {
                            for (let rowInx = 0; rowInx < freePlayData.plate[reelInx].length; rowInx++) {
                                if (freePlayData.plate[reelInx][rowInx] === 6) {
                                    winPosition[rowInx][reelInx] = 1;
                                }
                            }
                        }
                    }
                    freePlaySimulatedData.udsOutputWinLine.push({
                        SymbolId: 6,
                        LinePrize: freePlayData.h5score,
                        NumOfKind: 2,
                        SymbolCount: 2,
                        WinLineNo: 0,
                        LineMultiplier: 1,
                        WinPosition: winPosition,
                        LineExtraData: [ 0 ],
                        LineType: 0
                    });
                    freePlaySimulatedData.Multiple = Math.round(freePlayData.h5score / this.currentLocalData.playerBet);
                }

                this.responseFreePlay(freePlaySimulatedData);
                break;
            }
            case SocketStatesConfig.SEND_FREE_COMPLETE: {
                const freeCompleteSimulatedData = Object.create(null);
                freeCompleteSimulatedData.Type = 3;
                freeCompleteSimulatedData.ID = 143;
                freeCompleteSimulatedData.Version = 0;
                freeCompleteSimulatedData.ErrorCode = 0;

                freeCompleteSimulatedData.GameExtraData = 0;
                freeCompleteSimulatedData.ScatterPayFromBaseGame = this.freeTriggerData.ScatterPayFromBaseGame;
                freeCompleteSimulatedData.TotalWinAmt = this.freeTriggerData.totalwinscore;
                freeCompleteSimulatedData.TotalWinAmt = this.freeTriggerData.accumlateWinAmt;
                freeCompleteSimulatedData.NextModule = this.freeTriggerData.freeGameIdRemain.length > 0 ? 40 : 0;
                this.responseFreeComplete(freeCompleteSimulatedData);
                break;
            }
            default:
        }
    }

    onCreditUpdated(amount) {
        this.apiContext.onGetCreditResult(
            1,
            {
                irq: 1,
                vals: [
                    1,
                    amount
                ]
            }
        );
    }

    sendLoginReq() {
        // this.sendHttpOperation(SocketStatesConfig.LOGIN, { logintype: this.currentLocalData.logintype, token: this.ssoToken });
        if (process.env.NODE_ENV !== 'develop') {
            history.pushState(null, 'page', 'index.html');
        }
        this.sendInitReq();
    }

    responseLogin(data) {
        this.betData = Object.create(null);
        this.betData.BaseBet = data.BaseBet;
        this.betData.BetMultipleRange = data.BetMultipleRange;
        this.betData.DefaultBetMultipleIndex = data.DefaultBetMultipleIndex;
        this.betData.LineRange = data.LineRange;
        this.betData.DefaultLineIndex = data.DefaultLineIndex;
        this.responseInitial(data);
    }

    sendInitReq() {
        // this.sendHttpOperation(SocketStatesConfig.GAME_CONFIG, { gameaccount: account });
        const sendInit = Object.create(null);
        this.sendWSOperation(SocketStatesConfig.LOGIN, sendInit);
    }

    responseInitial(data) {
        // const iv = data.IV_BASE;
        // const currentKey = 'K008jkK9L43E8425diwpQJHGFNU54l57';
        // const decrypted = CryptoJS.AES.decrypt(
        //     data.StripeTable,
        //     CryptoJS.enc.Utf8.parse(currentKey),
        //     {
        //         keySize: 128 / 4 | 0,
        //         iv: CryptoJS.enc.Utf8.parse(iv),
        //         mode: CryptoJS.mode.CBC,
        //         padding: CryptoJS.pad.Pkcs7
        //     });
        // const stripInt = decrypted.toString(CryptoJS.enc.Utf8);
        // const stripsAry = [];
        // this.splitStrip(stripInt, stripsAry);
        //

        this.baseStripsAry = [];
        // data.BaseReelsStrips[0].forEach((singleReel, reelInx) => {
        //     this.baseStripsAry[reelInx] = singleReel.toString();
        // }, this);
        this.freeStripsAry = [];
        // data.BonusReelsStrips[0].forEach((singleReel, reelInx) => {
        //     this.freeStripsAry[reelInx] = singleReel.toString();
        // }, this);

        // stripsAry.forEach((singleStripString, inx) => {
        //     let stripModified = singleStripString;
        //     stripModified = stripModified.replace(/10/g, 'ten');
        //     stripModified = stripModified.replace(/9/g, 'nine');
        //     stripModified = stripModified.replace(/8/g, 'eight');
        //     stripModified = stripModified.replace(/7/g, 'seven');
        //     stripModified = stripModified.replace(/6/g, 'six');
        //     stripModified = stripModified.replace(/5/g, 'five');
        //     stripModified = stripModified.replace(/4/g, 'four');
        //     stripModified = stripModified.replace(/3/g, 'three');
        //     stripModified = stripModified.replace(/2/g, 'two');
        //     stripModified = stripModified.replace(/1/g, 'one');
        //     stripModified = stripModified.replace(/0/g, 'zero');
        //
        //     stripModified = stripModified.replace(/zero/g, 'S1');
        //     stripModified = stripModified.replace(/one/g, 'S2');
        //     stripModified = stripModified.replace(/two/g, 'W1');
        //     stripModified = stripModified.replace(/three/g, 'W2');
        //     stripModified = stripModified.replace(/four/g, '1');
        //     stripModified = stripModified.replace(/five/g, '2');
        //     stripModified = stripModified.replace(/six/g, '3');
        //     stripModified = stripModified.replace(/seven/g, '4');
        //     stripModified = stripModified.replace(/eight/g, '5');
        //     stripModified = stripModified.replace(/nine/g, '6');
        //     stripModified = stripModified.replace(/ten/g, '7');
        //     this.baseStripsAry[inx] = stripModified;
        // }, this);
        //
        this.baseStripsAry[0] = '1,1,1,6,6,6,2,2,2,7,7,7,3,3,3,8,8,8,4,4,4,9,9,9,5,5,5,6,6,6,1,1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,7,8,8,8,9,9,9,9,9,9,8,8,8,7,7,7,6,6,6';
        this.baseStripsAry[1] = '1,1,1,8,8,8,3,3,3,4,4,4,0,4,4,4,7,7,7,5,5,5,6,6,6,2,2,2,8,8,8,0,8,8,8,4,4,4,6,6,6,8,8,8,1,1,1,3,3,3,5,5,5,7,7,7,9,9,9,0,9,9,9,7,7,7,8,8,8,9,9,9,6,6,6,7,7,7,8,8,8';
        this.baseStripsAry[2] = '1,1,1,7,7,7,4,4,4,6,6,6,3,3,3,9,9,9,2,2,2,8,8,8,5,5,5,7,7,7,1,1,1,3,3,3,5,5,5,2,2,2,4,4,4,7,7,7,9,9,9,6,6,6,8,8,8,8,8,8,6,6,6,9,9,9,7,7,7';
        this.baseStripsAry[3] = '2,2,2,9,9,9,4,4,4,1,1,1,5,5,5,8,8,8,6,6,6,7,7,7,3,3,3,9,9,9,3,3,3,6,6,6,0,6,6,6,9,9,9,2,2,2,8,8,8,5,5,5,7,7,7,4,4,4,1,1,1';
        this.baseStripsAry[4] = '3,3,3,8,8,8,5,5,5,7,7,7,4,4,4,1,1,1,3,3,3,9,9,9,6,6,6,8,8,8,2,2,2,4,4,4,6,6,6,3,3,3,5,5,5,8,8,8,1,1,1,7,7,7,9,9,9';

        this.freeStripsAry[0] = '1,1,1,6,6,6,2,2,2,7,7,7,3,3,3,8,8,8,4,4,4,9,9,9,5,5,5,6,6,6,1,1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,7,8,8,8,9,9,9,9,9,9,8,8,8,7,7,7,6,6,6';
        this.freeStripsAry[1] = '1,1,1,8,8,8,3,3,3,4,4,4,0,4,4,4,7,7,7,5,5,5,6,6,6,2,2,2,8,8,8,0,8,8,8,4,4,4,6,6,6,8,8,8,1,1,1,3,3,3,5,5,5,7,7,7,9,9,9,0,9,9,9,7,7,7,8,8,8,9,9,9,6,6,6,7,7,7,8,8,8';
        this.freeStripsAry[2] = '1,1,1,7,7,7,4,4,4,6,6,6,3,3,3,9,9,9,2,2,2,8,8,8,5,5,5,7,7,7,1,1,1,3,3,3,5,5,5,2,2,2,4,4,4,7,7,7,9,9,9,6,6,6,8,8,8,8,8,8,6,6,6,9,9,9,7,7,7';
        this.freeStripsAry[3] = '2,2,2,9,9,9,4,4,4,1,1,1,5,5,5,8,8,8,6,6,6,7,7,7,3,3,3,9,9,9,3,3,3,6,6,6,0,6,6,6,9,9,9,2,2,2,8,8,8,5,5,5,7,7,7,4,4,4,1,1,1';
        this.freeStripsAry[4] = '3,3,3,8,8,8,5,5,5,7,7,7,4,4,4,1,1,1,3,3,3,9,9,9,6,6,6,8,8,8,2,2,2,4,4,4,6,6,6,3,3,3,5,5,5,8,8,8,1,1,1,7,7,7,9,9,9';

        // this.init1stData = data;
// ==============
            // SlotGame.GameInfo.exchangeData = this.loginData.currencyTypeAry;
            // this.onDispatchEvent(new SlotGame.RefreshCurrencyEvent(SlotGame.RefreshCurrencyEvent.ON_RESPONSE));
// ==============
        this.onLoginConnect.call(this.apiContext, { packet_if: SocketStatesConfig.LOGIN }, { errCode: 200 });
    }

    sendRefreshReq() {
        const sendRefresh = Object.create(null);
        sendRefresh.logintype = this.currentLocalData.logintype;
        this.sendHttpRequest(sendRefresh, '/lobby/refresh', this.responseRefresh, this);
    }

    responseRefresh(packetID, data) {
        SlotGame.GameInfo.exchangeData = AgentInitial.transformCurrencyData(this.currentLocalData.gameInfo, data.userCoinQuota);
        this.onDispatchEvent(new SlotGame.RefreshCurrencyEvent(SlotGame.RefreshCurrencyEvent.ON_RESPONSE));
    }

    sendExchangeReq(data) {
        const sendExchange = Object.create(null);
        sendExchange.playerid = this.currentLocalData.id;
        sendExchange.gameaccount = this.currentLocalData.gameaccount;
        sendExchange.cointype = data.type;
        sendExchange.coinamount = data.amount;

        this.sendHttpRequest(sendExchange, '/lobby/exchange', this.responseExchange, this);
    }

    responseExchange(packetID, data) {
        SlotGame.GameInfo.hasExchanged = true;
        const exchangeEvent = new SlotGame.ExchangeCurrencyEvent(SlotGame.ExchangeCurrencyEvent.ON_RESPONSE);
        exchangeEvent.gameCredit = data.gameCoin;

        this.onCreditUpdated(data.gameCoin);
        this.onDispatchEvent(exchangeEvent);
        this.responseRefresh(0, data);
    }

    sendCashoutReq() {
        const sendCashout = Object.create(null);
        sendCashout.playerid = this.currentLocalData.id;
        this.sendHttpRequest(sendCashout, '/lobby/checkout', this.responseCashout, this);
    }

    responseCashout(packetID, data) {
        SlotGame.GameInfo.hasExchanged = false;
        const cashoutEvent = new SlotGame.CashoutEvent(SlotGame.CashoutEvent.ON_RESPONSE);
        const cashoutResultData = Object.create(null);
        cashoutResultData.Gold_out = data.userCoinQuota.coin1_out;
        cashoutResultData.Voucher_out = data.userCoinQuota.coin2_out;
        cashoutResultData.ULB_out = data.userCoinQuota.coin3_out;
        cashoutResultData.Bonus_out = data.userCoinQuota.coin4_out;

        cashoutEvent.cashoutCurrencyAry = AgentInitial.transformCashoutData(cashoutResultData).currencyTypeAry;
        this.onCreditUpdated(0);
        this.onDispatchEvent(cashoutEvent);
        this.sendRefreshReq();
    }

    splitStrip(stripInt, stripsAry) {
        const newInx = stripInt.indexOf(';');
        if (newInx !== -1) {
            stripsAry.push(stripInt.substr(0, newInx));
            const newStrInt = stripInt.substring(newInx + 1);
            this.splitStrip(newStrInt, stripsAry);
            return;
        }
        stripsAry.push(stripInt);
    }

    responseConfig(data) {
        const inversePacket = Object.create(null);
        inversePacket.errCode = 200;
        inversePacket.msg = null;
        inversePacket.res = 2;
        inversePacket.vals = [
            1,
            JSON.stringify(data)
        ];
        this.apiContext.onGetOpcodeResult(2, inversePacket);
    }

    responseStrip(data) {
        const inversePacket = Object.create(null);
        inversePacket.errCode = 200;
        inversePacket.msg = null;
        inversePacket.res = 2;
        inversePacket.vals = [
            1,
            JSON.stringify(data)
        ];
        this.apiContext.onGetOpcodeResult(2, inversePacket);
    }

    // 產生本地 Init（login）封包，欄位對齊 responseLogin/onWSMessage('Init')
    makeFakeInit() {
        return {
            Method: 'Init',
            Credit: 1000000,
            Data: {
                BaseBet: 1,
                BetMultipleRange: [ 1, 2, 4, 6, 10, 20, 40, 60 ],
                DefaultBetMultipleIndex: 0,
                LineRange: [ 1 ],
                DefaultLineIndex: 0
            }
        };
    }

    // 產生本地 Spin 封包，欄位對齊 responsePlay/onWSMessage('Spin')
    // 預設回合法「不中獎」結果；每第 3 次 spin 改回罐頭中獎（makeFakeWinSpin）。
    makeFakeSpin(sendData) {
        const baseBet = (this.betData && this.betData.BaseBet) ? this.betData.BaseBet : 1;
        const cost = sendData.PlayBet * baseBet;
        if (typeof this.currentLocalData.playerCredit !== 'number') {
            this.currentLocalData.playerCredit = 1000000;
        }
        this.currentLocalData.playerCredit -= cost;
        this.offlineSpinCount += 1;
        if (this.offlineSpinCount % 3 === 0) {
            return this.makeFakeWinSpin();
        }

        // 15 = NUM_ROWS(3) * NUM_REELS(5)，row-major；刻意錯開避免任一 symbol 連三輪
        const loseSymbols = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5, 6, 7 ];

        return {
            Method: 'Spin',
            SN: 1,
            Credit: this.currentLocalData.playerCredit,
            Data: {
                RngData: [ 1, 1, 1, 1, 1 ],
                WinType: 0,
                SymbolResult: loseSymbols,
                ExtraSymbolResult: null,
                WinPrize: 0,
                TotalWinPrize: 0,
                WinLine: [],
                FreeGameData: null,
                ExtraData: {}
            }
        };
    }

    // 罐頭中獎：SocketSimulator.js line 1073 真實擷取封包原樣，僅
    // (1) 移除 ExtraData.GF_RESPIN（避免觸發 respin 流程，餘 ExtraData 為空物件）
    // (2) 頂層 Credit 依當前餘額重算（勿照抄樣本的 100）
    // 中獎金額 1000 為樣本擷取當時注額所得，不依當前 bet 縮放（demo 可接受）。
    makeFakeWinSpin() {
        this.currentLocalData.playerCredit += 1000; // = WinPrize
        return {
            Method: 'Spin',
            SN: 1,
            Credit: this.currentLocalData.playerCredit,
            Data: {
                RngData: [ 1, 80, 1, 11, 9 ],
                WinType: 1,
                SymbolResult: [ 1, 8, 1, 1, 5, 1, 8, 1, 1, 7, 1, 1, 1, 5, 7 ],
                ExtraSymbolResult: null,
                WinPrize: 1000,
                TotalWinPrize: 1000,
                WinLine: [
                    { SymbolId: 1, Prize: 125, SymbolCount: 3, WinLineNo: 6, WinLinePosition: [ [ 1, 0, 1, 0, 0 ], [ 0, 0, 0, 0, 0 ], [ 0, 1, 0, 0, 0 ] ], LineMultiplier: 0 },
                    { SymbolId: 1, Prize: 125, SymbolCount: 3, WinLineNo: 7, WinLinePosition: [ [ 1, 0, 0, 0, 0 ], [ 0, 0, 1, 0, 0 ], [ 0, 1, 0, 0, 0 ] ], LineMultiplier: 0 },
                    { SymbolId: 1, Prize: 125, SymbolCount: 3, WinLineNo: 8, WinLinePosition: [ [ 1, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0 ], [ 0, 1, 1, 0, 0 ] ], LineMultiplier: 0 },
                    { SymbolId: 1, Prize: 125, SymbolCount: 3, WinLineNo: 15, WinLinePosition: [ [ 0, 0, 1, 0, 0 ], [ 1, 0, 0, 0, 0 ], [ 0, 1, 0, 0, 0 ] ], LineMultiplier: 0 },
                    { SymbolId: 1, Prize: 125, SymbolCount: 3, WinLineNo: 16, WinLinePosition: [ [ 0, 0, 0, 0, 0 ], [ 1, 0, 1, 0, 0 ], [ 0, 1, 0, 0, 0 ] ], LineMultiplier: 0 },
                    { SymbolId: 1, Prize: 125, SymbolCount: 3, WinLineNo: 17, WinLinePosition: [ [ 0, 0, 0, 0, 0 ], [ 1, 0, 0, 0, 0 ], [ 0, 1, 1, 0, 0 ] ], LineMultiplier: 0 },
                    { SymbolId: 1, Prize: 125, SymbolCount: 3, WinLineNo: 24, WinLinePosition: [ [ 0, 0, 0, 0, 0 ], [ 0, 0, 1, 0, 0 ], [ 1, 1, 0, 0, 0 ] ], LineMultiplier: 0 },
                    { SymbolId: 1, Prize: 125, SymbolCount: 3, WinLineNo: 25, WinLinePosition: [ [ 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0 ], [ 1, 1, 1, 0, 0 ] ], LineMultiplier: 0 }
                ],
                FreeGameData: null,
                ExtraData: {}
            }
        };
    }

    responsePlay(data) {
        // const data = {"Method":"Spin","ErrorCode":10000,"Data":{"RngData":[1,80,1,11,9],"WinType":1,"SymbolResult":[1,8,1,1,5,1,8,1,1,7,1,1,1,5,7],"ExtraSymbolResult":null,"WinPrize":1000,"TotalWinPrize":1000,"WinLine":[{"SymbolId":1,"Prize":125,"SymbolCount":3,"WinLineNo":6,"WinLinePosition":[[1,0,1,0,0],[0,0,0,0,0],[0,1,0,0,0]],"LineMultiplier":0},{"SymbolId":1,"Prize":125,"SymbolCount":3,"WinLineNo":7,"WinLinePosition":[[1,0,0,0,0],[0,0,1,0,0],[0,1,0,0,0]],"LineMultiplier":0},{"SymbolId":1,"Prize":125,"SymbolCount":3,"WinLineNo":8,"WinLinePosition":[[1,0,0,0,0],[0,0,0,0,0],[0,1,1,0,0]],"LineMultiplier":0},{"SymbolId":1,"Prize":125,"SymbolCount":3,"WinLineNo":15,"WinLinePosition":[[0,0,1,0,0],[1,0,0,0,0],[0,1,0,0,0]],"LineMultiplier":0},{"SymbolId":1,"Prize":125,"SymbolCount":3,"WinLineNo":16,"WinLinePosition":[[0,0,0,0,0],[1,0,1,0,0],[0,1,0,0,0]],"LineMultiplier":0},{"SymbolId":1,"Prize":125,"SymbolCount":3,"WinLineNo":17,"WinLinePosition":[[0,0,0,0,0],[1,0,0,0,0],[0,1,1,0,0]],"LineMultiplier":0},{"SymbolId":1,"Prize":125,"SymbolCount":3,"WinLineNo":24,"WinLinePosition":[[0,0,0,0,0],[0,0,1,0,0],[1,1,0,0,0]],"LineMultiplier":0},{"SymbolId":1,"Prize":125,"SymbolCount":3,"WinLineNo":25,"WinLinePosition":[[0,0,0,0,0],[0,0,0,0,0],[1,1,1,0,0]],"LineMultiplier":0}],"FreeGameData":null,"ExtraData":{"GF_RESPIN":"{\"ReSpinData\":[{\"RngData\":[62,28,67,11,2],\"WinType\":0,\"SymbolResult\":[8,1,7,1,1,8,8,7,1,1,7,8,7,1,8],\"ExtraSymbolResult\":null,\"WinPrize\":0,\"TotalWinPrize\":0,\"WinLine\":[],\"FreeGameData\":null,\"ExtraData\":{}}]}"}},"Credit":100};
        //
        //
        // console.log(data);

        this.freeTriggerData.ScatterPayFromBaseGame = 0;
        this.freeTriggerData.totalwinscore = 0;
        this.freeTriggerData.scotterresult = [];

        const playSimulatedData = Object.create(null);
        playSimulatedData.Type = 3;
        playSimulatedData.ID = 131;
        playSimulatedData.version = 0;
        playSimulatedData.ErrorCode = 0;
        playSimulatedData.GamePlaySerialNumber = data.SN;
        playSimulatedData.RngData = data.Data.RngData;

        const arrengedSymbolResult = [];
        for (let row = 0; row < Config.NUM_ROWS; row++) {
            arrengedSymbolResult[row] = [];
        }
        const symbolsAry = data.Data.SymbolResult;
        for (let symbolInx = 0; symbolInx < symbolsAry.length; symbolInx++) {
            const row = Math.floor(symbolInx / Config.NUM_REELS);
            const reel = symbolInx % Config.NUM_REELS;
            arrengedSymbolResult[row][reel] = symbolsAry[symbolInx];
            if (symbolInx % Config.NUM_REELS === Config.NUM_REELS - 1) {
                arrengedSymbolResult[row] = arrengedSymbolResult[row].toString();
            }
        }
        playSimulatedData.SymbolResult = arrengedSymbolResult;

        playSimulatedData.EmulatorType = 0;
        playSimulatedData.WinType = data.Data.WinType;
        playSimulatedData.BaseWin = data.Data.WinPrize;
        playSimulatedData.TotalWin = data.Data.WinPrize;
        playSimulatedData.IsTriggerFG = data.Data.FreeGameData !== null;
        playSimulatedData.NextModule = 0;
        playSimulatedData.WinLineCount = data.Data.WinLine.length;

        playSimulatedData.ExtraDataCount = 0;
        playSimulatedData.ExtraData = [ null, null ];

        if (data.Data.ExtraData.GF_EXPANDINGSYMBOL) {
            playSimulatedData.ExtraDataCount++;
            playSimulatedData.ExtraData[0] = JSON.parse(data.Data.ExtraData.GF_EXPANDINGSYMBOL);
        }
        if (data.Data.ExtraData.GF_RESPIN) {
            playSimulatedData.ExtraDataCount++;
            playSimulatedData.ExtraData[1] = JSON.parse(data.Data.ExtraData.GF_RESPIN);
        }

        playSimulatedData.ReellPosChg = [ 0 ];
        playSimulatedData.BonusType = 0;
        playSimulatedData.SpecialAward = 0;
        playSimulatedData.SpecialSymbol = 0;
        playSimulatedData.ReelLenChange = [];
        playSimulatedData.ReelPay = [];
        playSimulatedData.IsRespin = playSimulatedData.ExtraData[1] !== null;
        playSimulatedData.RespinReels = [ 0, 0, 0, 0, 0 ];
        playSimulatedData.Multiple = 0;
        playSimulatedData.NextSTable = 0;
        playSimulatedData.FreeSpin = [ 0 ];
        playSimulatedData.IsHitJackPot = false;

        playSimulatedData.udsOutputWinLine = [];
        data.Data.WinLine.forEach((winData) => {
            const singleLineData = Object.create(null);
            singleLineData.SymbolId = winData.SymbolId;
            singleLineData.LinePrize = winData.Prize;
            singleLineData.NumOfKind = winData.SymbolCount;
            singleLineData.SymbolCount = winData.SymbolCount;
            singleLineData.WinLineNo = winData.WinLineNo - 1;
            singleLineData.LineMultiplier = winData.LineMultiplier ? winData.LineMultiplier : 1;
            singleLineData.WinPosition = winData.WinLinePosition;
            singleLineData.LineExtraData = [ 0 ];
            singleLineData.LineType = 0;
            if (Config.SYMBOL_FREE.includes(ConfigPasser.instance.SYMBOL_ID_NUM[winData.SymbolId])) {
                this.FreeGameData.scatterPay = singleLineData.LinePrize;
            }
            playSimulatedData.udsOutputWinLine.push(singleLineData);
        }, this);


        this.currentLocalData.playerCredit = data.Credit;

        if (playSimulatedData.ExtraData[1]) {
            this.currentLocalData.respinData = playSimulatedData.ExtraData[1].ReSpinData;
        }


        const inversePacket = Object.create(null);
        inversePacket.errCode = 200;
        inversePacket.msg = null;
        inversePacket.res = 2;
        inversePacket.vals = [
            1,
            JSON.stringify(playSimulatedData)
        ];
        this.apiContext.onGetOpcodeResult(2, inversePacket);
    }

    responseIdle(data) {
        const inversePacket = Object.create(null);
        inversePacket.errCode = 200;
        inversePacket.msg = null;
        inversePacket.res = 2;
        inversePacket.vals = [
            1,
            JSON.stringify(data)
        ];
        this.apiContext.onGetOpcodeResult(2, inversePacket);
    }

    responseBonusStart(data) {
        const inversePacket = Object.create(null);
        inversePacket.errCode = 200;
        inversePacket.msg = null;
        inversePacket.res = 2;
        inversePacket.vals = [
            1,
            JSON.stringify(data)
        ];
        this.apiContext.onGetOpcodeResult(2, inversePacket);
    }

    responseBonusPlay(packetID, data) {
        // const data = {  "playermoney": 84828,  "scottercombination": [   2,   1  ],  "scotterid": [   840  ],  "scotterresult": [   {    "gameresult": [],    "h5score": 0,    "isscotter": 0,    "plate": [     [      8,      4,      10     ],     [      6,      11,      12     ],     [      8,      11,      3     ],     [      6,      9,      5     ],     [      1,      9,      7     ]    ],    "plateindex": [     [      7,      8,      9     ],     [      12,      13,      14     ],     [      17,      18,      19     ],     [      26,      27,      28     ],     [      17,      18,      19     ]    ]   },   {    "gameresult": [     {      "ScotterPoint": [       [],       [],       []      ],      "WildPoint": [       [],       [],       [        2       ]      ],      "WinSymbolPoint": [       [        1       ],       [        0       ],       [        2       ]      ],      "WinSymbolNum": [       [        2       ],       [        2       ],       [        0       ]      ],      "Score": 250,      "JackPotScore": 0,      "SpecialWinRate": 5,      "LineWinRate": 50     }    ],    "h5score": 0,    "isscotter": 0,    "plate": [     [      12,      2,      7     ],     [      2,      9,      4     ],     [      9,      11,      0     ],     [      8,      5,      7     ],     [      5,      11,      7     ]    ],    "plateindex": [     [      4,      5,      6     ],     [      6,      7,      8     ],     [      23,      24,      25     ],     [      20,      21,      22     ],     [      24,      25,      26     ]    ]   },   {    "gameresult": [],    "h5score": 0,    "isscotter": 0,    "plate": [     [      2,      7,      8     ],     [      10,      0,      12     ],     [      11,      3,      9     ],     [      10,      0,      12     ],     [      3,      11,      4     ]    ],    "plateindex": [     [      5,      6,      7     ],     [      2,      3,      4     ],     [      18,      19,      20     ],     [      2,      3,      4     ],     [      30,      31,      32     ]    ]   },   {    "gameresult": [     {      "ScotterPoint": [       [],       [],       [],       []      ],      "WildPoint": [       [],       [],       [],       []      ],      "WinSymbolPoint": [       [        2       ],       [        2       ],       [        1       ],       [        2       ]      ],      "WinSymbolNum": [       [        8       ],       [        8       ],       [        8       ],       [        8       ]      ],      "Score": 20,      "JackPotScore": 0,      "SpecialWinRate": 0,      "LineWinRate": 20     }    ],    "h5score": 0,    "isscotter": 0,    "plate": [     [      4,      7,      8     ],     [      10,      6,      8     ],     [      6,      8,      1     ],     [      10,      3,      8     ],     [      7,      6,      9     ]    ],    "plateindex": [     [      20,      21,      22     ],     [      24,      25,      26     ],     [      6,      7,      8     ],     [      5,      6,      7     ],     [      26,      27,      28     ]    ]   },   {    "gameresult": [],    "h5score": 0,    "isscotter": 0,    "plate": [     [      1,      9,      12     ],     [      4,      7,      5     ],     [      10,      1,      7     ],     [      11,      2,      12     ],     [      10,      12,      6     ]    ],    "plateindex": [     [      17,      18,      19     ],     [      8,      9,      10     ],     [      28,      0,      1     ],     [      9,      10,      11     ],     [      9,      10,      11     ]    ]   },   {    "gameresult": [],    "h5score": 0,    "isscotter": 0,    "plate": [     [      4,      7,      8     ],     [      9,      2,      8     ],     [      1,      12,      5     ],     [      9,      4,      11     ],     [      10,      7,      12     ]    ],    "plateindex": [     [      20,      21,      22     ],     [      20,      21,      22     ],     [      14,      15,      16     ],     [      15,      16,      17     ],     [      21,      22,      23     ]    ]   },   {    "gameresult": [],    "h5score": 0,    "isscotter": 0,    "plate": [     [      2,      7,      6     ],     [      12,      1,      9     ],     [      4,      12,      6     ],     [      0,      12,      10     ],     [      7,      3,      11     ]    ],    "plateindex": [     [      0,      1,      2     ],     [      14,      15,      16     ],     [      4,      5,      6     ],     [      3,      4,      5     ],     [      29,      30,      31     ]    ]   },   {    "gameresult": [     {      "ScotterPoint": [       [],       [],       [],       []      ],      "WildPoint": [       [],       [],       [],       []      ],      "WinSymbolPoint": [       [        2       ],       [        0       ],       [        1       ],       [        0       ]      ],      "WinSymbolNum": [       [        12       ],       [        12       ],       [        12       ],       [        12       ]      ],      "Score": 10,      "JackPotScore": 0,      "SpecialWinRate": 0,      "LineWinRate": 10     }    ],    "h5score": 0,    "isscotter": 0,    "plate": [     [      1,      9,      12     ],     [      12,      1,      9     ],     [      4,      12,      6     ],     [      12,      6,      7     ],     [      11,      8,      5     ]    ],    "plateindex": [     [      17,      18,      19     ],     [      14,      15,      16     ],     [      4,      5,      6     ],     [      11,      12,      13     ],     [      12,      13,      14     ]    ]   },   {    "gameresult": [],    "h5score": 0,    "isscotter": 0,    "plate": [     [      2,      7,      6     ],     [      12,      6,      11     ],     [      7,      2,      9     ],     [      11,      2,      12     ],     [      12,      1,      9     ]    ],    "plateindex": [     [      0,      1,      2     ],     [      11,      12,      13     ],     [      1,      2,      3     ],     [      9,      10,      11     ],     [      16,      17,      18     ]    ]   },   {    "gameresult": [],    "h5score": 0,    "isscotter": 0,    "plate": [     [      9,      12,      2     ],     [      6,      8,      5     ],     [      11,      0,      9     ],     [      4,      11,      2     ],     [      10,      12,      6     ]    ],    "plateindex": [     [      3,      4,      5     ],     [      25,      26,      27     ],     [      24,      25,      26     ],     [      8,      9,      10     ],     [      9,      10,      11     ]    ]   },   {    "gameresult": [],    "h5score": 0,    "isscotter": 0,    "plate": [     [      11,      8,      3     ],     [      5,      7,      10     ],     [      11,      3,      9     ],     [      1,      9,      4     ],     [      7,      3,      11     ]    ],    "plateindex": [     [      12,      13,      14     ],     [      27,      28,      29     ],     [      18,      19,      20     ],     [      14,      15,      16     ],     [      29,      30,      31     ]    ]   },   {    "gameresult": [],    "h5score": 0,    "isscotter": 0,    "plate": [     [      6,      11,      8     ],     [      5,      12,      6     ],     [      9,      11,      10     ],     [      7,      1,      9     ],     [      7,      12,      5     ]    ],    "plateindex": [     [      11,      12,      13     ],     [      10,      11,      12     ],     [      26,      27,      28     ],     [      13,      14,      15     ],     [      22,      23,      24     ]    ]   },   {    "gameresult": [],    "h5score": 0,    "isscotter": 0,    "plate": [     [      2,      7,      8     ],     [      2,      9,      4     ],     [      9,      4,      12     ],     [      4,      11,      3     ],     [      5,      10,      12     ]    ],    "plateindex": [     [      5,      6,      7     ],     [      6,      7,      8     ],     [      3,      4,      5     ],     [      16,      17,      18     ],     [      14,      15,      16     ]    ]   },   {    "gameresult": [],    "h5score": 0,    "isscotter": 0,    "plate": [     [      5,      11,      10     ],     [      7,      10,      4     ],     [      5,      8,      11     ],     [      2,      12,      6     ],     [      4,      10,      7     ]    ],    "plateindex": [     [      23,      24,      25     ],     [      28,      29,      0     ],     [      16,      17,      18     ],     [      10,      11,      12     ],     [      20,      21,      22     ]    ]   },   {    "gameresult": [     {      "ScotterPoint": [       [        2       ],       [        0       ],       [        1       ],       [        0       ]      ],      "WildPoint": [       [],       [],       [],       []      ],      "WinSymbolPoint": [       [        2       ],       [        0       ],       [        1       ],       [        0       ]      ],      "WinSymbolNum": [       [        1       ],       [        1       ],       [        1       ],       [        1       ]      ],      "Score": 300,      "JackPotScore": 0,      "SpecialWinRate": 0,      "LineWinRate": 10     }    ],    "h5score": 0,    "isscotter": 1,    "plate": [     [      7,      11,      1     ],     [      1,      10,      6     ],     [      10,      1,      12     ],     [      1,      9,      4     ],     [      4,      10,      7     ]    ],    "plateindex": [     [      15,      16,      17     ],     [      23,      24,      25     ],     [      13,      14,      15     ],     [      14,      15,      16     ],     [      20,      21,      22     ]    ]   },   {    "gameresult": [     {      "ScotterPoint": [       [],       [],       []      ],      "WildPoint": [       [],       [],       [        2       ]      ],      "WinSymbolPoint": [       [        0       ],       [        0       ],       [        2       ]      ],      "WinSymbolNum": [       [        5       ],       [        5       ],       [        0       ]      ],      "Score": 160,      "JackPotScore": 0,      "SpecialWinRate": 8,      "LineWinRate": 20     }    ],    "h5score": 0,    "isscotter": 0,    "plate": [     [      5,      11,      10     ],     [      5,      12,      6     ],     [      9,      11,      0     ],     [      8,      12,      10     ],     [      12,      5,      11     ]    ],    "plateindex": [     [      23,      24,      25     ],     [      10,      11,      12     ],     [      23,      24,      25     ],     [      0,      1,      2     ],     [      23,      24,      25     ]    ]   },   {    "gameresult": [     {      "ScotterPoint": [       [],       [],       []      ],      "WildPoint": [       [],       [],       []      ],      "WinSymbolPoint": [       [        0       ],       [        0       ],       [        2       ]      ],      "WinSymbolNum": [       [        11       ],       [        11       ],       [        11       ]      ],      "Score": 5,      "JackPotScore": 0,      "SpecialWinRate": 0,      "LineWinRate": 5     }    ],    "h5score": 0,    "isscotter": 0,    "plate": [     [      11,      8,      3     ],     [      11,      3,      7     ],     [      7,      4,      11     ],     [      3,      8,      4     ],     [      8,      5,      7     ]    ],    "plateindex": [     [      12,      13,      14     ],     [      17,      18,      19     ],     [      9,      10,      11     ],     [      6,      7,      8     ],     [      4,      5,      6     ]    ]   },   {    "gameresult": [],    "h5score": 0,    "isscotter": 0,    "plate": [     [      11,      8,      3     ],     [      12,      6,      11     ],     [      10,      1,      12     ],     [      7,      8,      5     ],     [      7,      9,      3     ]    ],    "plateindex": [     [      12,      13,      14     ],     [      11,      12,      13     ],     [      13,      14,      15     ],     [      19,      20,      21     ],     [      6,      7,      8     ]    ]   },   {    "gameresult": [     {      "ScotterPoint": [       [],       [],       [],       []      ],      "WildPoint": [       [],       [],       [        1       ],       []      ],      "WinSymbolPoint": [       [        0       ],       [        0       ],       [        1       ],       [        0       ]      ],      "WinSymbolNum": [       [        5       ],       [        5       ],       [        0       ],       [        5       ]      ],      "Score": 250,      "JackPotScore": 0,      "SpecialWinRate": 5,      "LineWinRate": 50     }    ],    "h5score": 0,    "isscotter": 0,    "plate": [     [      5,      11,      10     ],     [      5,      12,      6     ],     [      11,      0,      9     ],     [      5,      8,      12     ],     [      3,      11,      4     ]    ],    "plateindex": [     [      23,      24,      25     ],     [      10,      11,      12     ],     [      24,      25,      26     ],     [      28,      0,      1     ],     [      30,      31,      32     ]    ]   },   {    "gameresult": [],    "h5score": 0,    "isscotter": 0,    "plate": [     [      1,      9,      12     ],     [      4,      7,      5     ],     [      9,      4,      12     ],     [      3,      7,      8     ],     [      5,      11,      7     ]    ],    "plateindex": [     [      17,      18,      19     ],     [      8,      9,      10     ],     [      3,      4,      5     ],     [      18,      19,      20     ],     [      24,      25,      26     ]    ]   }  ],  "totalwinscore": 995 };
        // console.log(data);
        const bonusPlaySimulatedData = Object.create(null);
        bonusPlaySimulatedData.Type = 3;
        bonusPlaySimulatedData.ID = 145;
        bonusPlaySimulatedData.Version = 0;
        bonusPlaySimulatedData.ErrorCode = 0;

        bonusPlaySimulatedData.PlayerBet = this.currentLocalData.playerBet;
        bonusPlaySimulatedData.AccumlateWinAmt = this.currentLocalData.AccumlateWinAmt;
        bonusPlaySimulatedData.ScatterPayFromBaseGame = this.freeTriggerData.ScatterPayFromBaseGame;


        bonusPlaySimulatedData.udcDataSet = {
            SelExtraData: [],
            SelMultiplier: [],
            SelSpinTimes: [],
            SelWin: [],
            PlayerSelected: data.scottercombination
        };
        bonusPlaySimulatedData.GameComplete = true;

        if (data.scotterid.length > 0) {
            for (let i = 0; i < data.scotterid.length; i++) {
                if (this.freeTriggerData.freeGameIdRemain.indexOf(data.scotterid[i]) === -1) {
                    this.freeTriggerData.freeGameIdRemain.push(data.scotterid[i]);
                }
            }
        }

        this.currentLocalData.playerCredit = data.playermoney;
        this.freeTriggerData.totalwinscore = data.totalwinscore;
        this.freeTriggerData.scotterresult = data.scotterresult;

        const inversePacket = Object.create(null);
        inversePacket.errCode = 200;
        inversePacket.msg = null;
        inversePacket.res = 2;
        inversePacket.vals = [
            1,
            JSON.stringify(bonusPlaySimulatedData)
        ];
        this.apiContext.onGetOpcodeResult(2, inversePacket);
    }

    responseBonusComplete(data) {
        const inversePacket = Object.create(null);
        inversePacket.errCode = 200;
        inversePacket.msg = null;
        inversePacket.res = 2;
        inversePacket.vals = [
            1,
            JSON.stringify(data)
        ];
        this.apiContext.onGetOpcodeResult(2, inversePacket);
    }

    responseFreeStart(data) {
        const inversePacket = Object.create(null);
        inversePacket.errCode = 200;
        inversePacket.msg = null;
        inversePacket.res = 2;
        inversePacket.vals = [
            1,
            JSON.stringify(data)
        ];
        this.apiContext.onGetOpcodeResult(2, inversePacket);
    }

    responseFreePlay(data) {
        const inversePacket = Object.create(null);
        inversePacket.errCode = 200;
        inversePacket.msg = null;
        inversePacket.res = 2;
        inversePacket.vals = [
            1,
            JSON.stringify(data)
        ];
        this.apiContext.onGetOpcodeResult(2, inversePacket);
    }

    responseFreeComplete(data) {
        const inversePacket = Object.create(null);
        inversePacket.errCode = 200;
        inversePacket.msg = null;
        inversePacket.res = 2;
        inversePacket.vals = [
            1,
            JSON.stringify(data)
        ];
        this.apiContext.onGetOpcodeResult(2, inversePacket);
    }
}

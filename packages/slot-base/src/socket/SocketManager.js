import ManagerBase from './base/ManagerBase';
// import SocketClient from './net/PhotonClient';
import SocketClientPasser from '../base/SocketSimulatorPasser';
import SocketStatesConfig from './SocketStatesConfig';
import GameFlow from './GameFlow';

import LoginSend from './handle/send/LoginSend';
import ConfigSend from './handle/send/ConfigSend';
import StripSend from './handle/send/StripSend';
import FreeStartSend from './handle/send/FreeStartSend';
import FreePlaySend from './handle/send/FreePlaySend';
import FreeCompleteSend from './handle/send/FreeCompleteSend';
import BasePlaySend from './handle/send/BasePlaySend';
import BaseIdleSend from './handle/send/BaseIdleSend';

import BonusGameStartSend from './handle/send/BonusGameStartSend';
import BonusGamePlaySend from './handle/send/BonusGamePlaySend';
import BonusGameCompleteSend from './handle/send/BonusGameCompleteSend';

import JackpotStartSend from './handle/send/JackpotStartSend';
import JackpotPlaySend from './handle/send/JackpotPlaySend';
import JackpotCompleteSend from './handle/send/JackpotCompleteSend';

/**
 * 流程
 * connect -> login -> config -> strip
 */
export default class SocketManager extends ManagerBase {
    constructor(ip) {
        super();
        // this.SocketApi = new SocketClient(this, ip);
        this.SocketApi = new SocketClientPasser.instance.SocketSimulator(this, ip);
        // api 連線完成後要執行的 Function
        this.SocketApi.setOnComplete = this.onGetConnectResult;
        this.SocketApi.setOnConnectClose = this.onGetError;
        this.SocketApi.setOnDisconnectEvent = this.onGetError;
        this.SocketApi.setOnConnectError = this.onGetError;
        // opcode 資料
        // this.data = {};
        this.initEvent();

        this.loginSendMsg = new LoginSend();
        this.loginSendMsg.media = 'WEB';
        this.loginSendMsg.token = 'guest';
        this.loginSendMsg.webID = 1;

        // login 成功後的事件
        this.configData = new ConfigSend();
        this.configData.GameID = 0;
        this.configData.data.ID = SocketStatesConfig.SEND_CONFIG;

        this.gameFlow = new GameFlow();

        // 額外Bet
        this.extraBet = 0;
        // error code
        this.errCode = '';
    }

    /**
     * 設定 token
     * @param {String} token 取得 token
     */
    set setToken(token) {
        this.SocketApi.setToken = token;
    }

    set setAgent(agent) {
        this.SocketApi.setAgent = agent;
        this.agentID = agent;
    }

    /**
     * 設定 media
     * @param {String} media 取得 media
     */
    set setMedia(media) {
        this.loginSendMsg.media = media;
    }

    /**
     * 設定遊戲 ID
     * @param {Number} id 遊戲 ID
     */
    set setGameID(id) {
        this.SocketApi.setGameID = id;
    }

    /**
     * 設定Web ID
     * @param {Number} id Web ID
     */
    set setWebID(id) {
        this.loginSendMsg.webID = Number(id) || 1;
    }

    /**
     * 設定extraBet
     * @param {Number} bet extraBet的數字
     */
    set setExtraBet(bet) {
        this.extraBet = bet;
    }

    // ui 通知 api 執行 connect 連線
    connect() {
        this.SocketApi.socketConnect();
    }

    /**
     * 發送封包事件
     * @param  {Number} opcode  opcode
     * @param  {Array}  data    要傳給 api 的 array 參數
     */
    emitApiEvent(opcode, data) {
        let timer = setTimeout(() => {
            this.SocketApi.emitEvent(opcode, data);
            clearTimeout(timer);
            timer = null;
        }, 0);
    }

    // 跟 api 註冊監聽 opcode 事件
    initEvent() {
        this.SocketApi.addEvent(SocketStatesConfig.CREDIT, this.onGetCreditResult);             // Credit
        this.SocketApi.addEvent(SocketStatesConfig.JACKPOT_POOL, this.onGetJackpotPool);        // Jackpot Pool
        this.SocketApi.addOnResultEvent(SocketStatesConfig.LOGIN, this.onLoginConnect);         // 登入
        this.SocketApi.addOnResultEvent(SocketStatesConfig.GAME_FLOW, this.onGetOpcodeResult);  // 遊戲流程
    }

    // error
    onGetError(data) {
        if (typeof data === 'object' && data.errCode !== undefined) {
            this.errCode = `( ${data.errCode} )`;
            this.dispacth(SocketStatesConfig.ON_GAME_ERROR, { errMsg: this.errCode, errData: data });
            return;
        }

        const errorCode = this.errCode || '';
        this.dispacth(SocketStatesConfig.ON_GAME_ERROR, { errMsg: `${data} ${errorCode}` });
    }

    // api 連線完成後要執行的 Function
    onGetConnectResult() {
        // 當IP連線成功後 發送登入玩家帳號後通知 sever login
        this.emitApiEvent(SocketStatesConfig.LOGIN, this.loginSendMsg.sendData);
    }

    /**
     * 接到 server 發的 credit 事件
     * @param  {Object} id credit id
     * @param  {Object} data credit 資料
     */
    onGetCreditResult(id, data) {
        // 通知 ui 已發出 更新 credit 事件
        this.dispacth(SocketStatesConfig.ON_GAME_CREDIT, data.vals[1]);
    }

    /**
     * 接到 server 發的 Jackpot Pool 事件
     * @param  {Object} id Jackpot Pool id
     * @param  {Object} data Jackpot Pool 資料
     */
    onGetJackpotPool(id, data) {
        // 將資料解成 json 格式
        const dataMsg = JSON.parse(data.vals[SocketStatesConfig.JACKPOT_POOL]);
        // 通知 ui 已發出 更新 Jackpot Pool 事件
        this.dispacth(SocketStatesConfig.ON_JACKPOT_POOL, dataMsg);
    }

    // 帳號登入成功
    onLoginConnect(id, data) {
        // 檢查有無錯誤  無 : 取遊戲初始資料 CS_INI_CONFIG
        (data.errCode === 200)
        ? this.emitApiEvent(SocketStatesConfig.GAME_CONFIG, this.configData.sendData)
        : this.onGetError(data);
    }

    /**
     * 接到 api 回傳的 opcode 事件
     * @param  {Number} id   opcode
     * @param  {Object} data 資料
     */
    onGetOpcodeResult(id, data) {
        // 檢查有無錯誤
        if (data.errCode !== 200) {
            this.onGetError(data);
            return;
        }
        // 將資料解成 json 格式
        const dataMsg = JSON.parse(data.vals[1]);
        const eventName = dataMsg.ID;
        const newData = this.gameFlow.eventNameData(eventName, dataMsg);
        this.dispacth(eventName, newData);
    }

    // 取得 strip
    sendGetStrip() {
        const stripData = new StripSend();
        stripData.State = 0;
        stripData.data.ID = SocketStatesConfig.SEND_STRIP;
        this.emitApiEvent(SocketStatesConfig.GAME_FLOW, stripData.sendData);
    }

    // ---- base game flow ----
    /**
     * 通知 api 執行 play (下注開始)
     * @param {Number} totalBet 下注金額
     * @param {Number} Denom    Denom
     * @param {Number} line     下注線數
     * @param {Number} miniBet  最小下注金額
     * @param {Array} reelpay   要買滾輪所花的credit
     * @param {Array} reelSelected  設定單輪spin資料
     * @param {Number} actionMode Spin模式 (0: 一般模式, 1: 飛牌模式)
     */
    play(totalBet, Denom, line, miniBet, extraBet = this.extraBet, reelpay, reelSelected, actionMode) {
        const BasePlaySendMsg = new BasePlaySend();
        BasePlaySendMsg.PlayLine = line;
        BasePlaySendMsg.PlayBet = totalBet;
        BasePlaySendMsg.MiniBet = miniBet;
        BasePlaySendMsg.IsExtraBet = extraBet;
        BasePlaySendMsg.PlayDenom = Denom;
        BasePlaySendMsg.data.ID = SocketStatesConfig.SEND_BASE_PLAY;
        BasePlaySendMsg.ReelPay = reelpay;
        BasePlaySendMsg.ReelSelected = reelSelected;
        BasePlaySendMsg.ActionMode = actionMode;
        this.emitApiEvent(SocketStatesConfig.GAME_FLOW, BasePlaySendMsg.sendData);
    }

    // 通知 api 執行 idle (下注結束)
    idle() {
        const BaseIdleSendMsg = new BaseIdleSend();
        BaseIdleSendMsg.data.ID = SocketStatesConfig.SEND_BASE_IDLE;
        this.emitApiEvent(SocketStatesConfig.GAME_FLOW, BaseIdleSendMsg.sendData);
    }

    /**
     * 通知 api 執行 respin play (免費下注)
     * @param {Number} totalBet 下注金額
     * @param {Number} Denom    Denom
     * @param {Number} line     下注線數
     * @param {Number} miniBet  最小下注金額
     * @param {Array} reelpay   要買滾輪所花的credit
     */
    respinPlay(totalBet, Denom, line, miniBet, extraBet = this.extraBet, reelpay) {
        const ReSpinPlaySendMsg = new BasePlaySend();
        ReSpinPlaySendMsg.PlayLine = line;
        ReSpinPlaySendMsg.PlayBet = totalBet;
        ReSpinPlaySendMsg.MiniBet = miniBet;
        ReSpinPlaySendMsg.IsExtraBet = extraBet;
        ReSpinPlaySendMsg.PlayDenom = Denom;
        ReSpinPlaySendMsg.ReelPay = reelpay;
        ReSpinPlaySendMsg.data.ID = SocketStatesConfig.SEND_RESPIN_PLAY;
        this.emitApiEvent(SocketStatesConfig.GAME_FLOW, ReSpinPlaySendMsg.sendData);
    }

    // ---- free game flow ----
    freeStart() {
        const FreeStartSendMsg = new FreeStartSend();
        FreeStartSendMsg.data.ID = SocketStatesConfig.SEND_FREE_START;
        this.emitApiEvent(SocketStatesConfig.FREE_GAME_FLOW, FreeStartSendMsg.sendData);
    }

    freePlay() {
        const FreePlaySendMsg = new FreePlaySend();
        FreePlaySendMsg.data.ID = SocketStatesConfig.SEND_FREE_PLAY;
        this.emitApiEvent(SocketStatesConfig.FREE_GAME_FLOW, FreePlaySendMsg.sendData);
    }

    freeComplete() {
        const FreeCompleteSendMsg = new FreeCompleteSend();
        FreeCompleteSendMsg.data.ID = SocketStatesConfig.SEND_FREE_COMPLETE;
        this.emitApiEvent(SocketStatesConfig.FREE_GAME_FLOW, FreeCompleteSendMsg.sendData);
    }

    // --- Bonus Game Flow ---
    bonusStart() {
        const BonusGameStartSendMsg = new BonusGameStartSend();
        BonusGameStartSendMsg.data.ID = SocketStatesConfig.SEND_BONUS_GAME_START;
        this.emitApiEvent(SocketStatesConfig.BONUS_GAME_FLOW, BonusGameStartSendMsg.sendData);
    }

    bonusPlay(playerSelectState, playerSelectIndex) {
        const BonusGamePlaySendMsg = new BonusGamePlaySend();
        BonusGamePlaySendMsg.PlayerSelectState = playerSelectState;     // 選擇場次
        BonusGamePlaySendMsg.PlayerSelectIndex = playerSelectIndex;     // 選擇的index
        BonusGamePlaySendMsg.data.ID = SocketStatesConfig.SEND_BONUS_GAME_PLAY;
        this.emitApiEvent(SocketStatesConfig.BONUS_GAME_FLOW, BonusGamePlaySendMsg.sendData);
    }

    bonusComplete() {
        const BonusGameCompleteSendMsg = new BonusGameCompleteSend();
        BonusGameCompleteSendMsg.data.ID = SocketStatesConfig.SEND_BONUS_GAME_COMPLETE;
        this.emitApiEvent(SocketStatesConfig.BONUS_GAME_FLOW, BonusGameCompleteSendMsg.sendData);
    }

    // --- Jackpot Game Flow ---
    jackpotStart() {
        const JackpotStartSendMsg = new JackpotStartSend();
        JackpotStartSendMsg.data.ID = SocketStatesConfig.SEND_JACKPOT_GAME_START;
        this.emitApiEvent(SocketStatesConfig.JACKPOT_GAME_FLOW, JackpotStartSendMsg.sendData);
    }

    jackpotPlay(playerSelectIndex) {
        const JackpotPlaySendMsg = new JackpotPlaySend();
        JackpotPlaySendMsg.SelectIndex = playerSelectIndex;     // 選擇的index
        JackpotPlaySendMsg.data.ID = SocketStatesConfig.SEND_JACKPOT_GAME_PLAY;
        this.emitApiEvent(SocketStatesConfig.JACKPOT_GAME_FLOW, JackpotPlaySendMsg.sendData);
    }

    jackpotComplete() {
        const JackpotCompleteSendMsg = new JackpotCompleteSend();
        JackpotCompleteSendMsg.data.ID = SocketStatesConfig.SEND_JACKPOT_GAME_COMPLETE;
        this.emitApiEvent(SocketStatesConfig.JACKPOT_GAME_FLOW, JackpotCompleteSendMsg.sendData);
    }
}

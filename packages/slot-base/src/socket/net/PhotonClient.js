export default class PhotonClient extends Photon.PhotonPeer {
    /**
     * photon 連線
     * @param  {Object} targetContext 父層 SocketManager
     * @param  {String} url           連線地址
     */
    constructor(targetContext, url) {
        super(url);
        this.apiContext = targetContext;
        // 設定是否激活 0 : 不觸發激活動作
        this.keepAliveTimeoutMs = 0;
    }

    // 綁定基本事件 發送連線
    socketConnect() {
        this.addPeerStatusListener('connect', this.onConnect);
        this.addPeerStatusListener('connecting', this.onConnecting);
        this.addPeerStatusListener('connectFailed', () => {});
        this.addPeerStatusListener('connectClosed', this.connectClose);
        this.addPeerStatusListener('disconnect', this.onDisconnect);
        this.addPeerStatusListener('error', this.onConnectError);
        this.addPeerStatusListener('timeout', this.onConnectTimeout);
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
            this.connectCloseEvent.call(this.apiContext, 'Connect Close');
        }
    }
    // 斷線事件
    onDisconnect() {
        if (this.disconnectEvent !== undefined) {
            this.disconnectEvent.call(this.apiContext, 'Disconnect');
        }
    }
    // 連線失敗
    onConnectError() {
        if (this.connectErrorEvent !== undefined) {
            this.connectErrorEvent.call(this.apiContext, 'Connect Error');
        }
    }
    // 連線失敗
    onConnectTimeout() {}
    // 收到Socket資料
    onResultData(opcode, socketData, fun) {
        if (this.apiContext !== undefined && fun !== undefined) {
            fun.call(this.apiContext, opcode, socketData);
        }
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

    /**
     * 發送 opcode 事件
     * @param  {String} opcode    事件名稱
     * @param  {Any}    param     傳遞的參數
     */
    emitEvent(opcode, param) {
        this.sendOperation(opcode, param);
    }

    /**
     * 註冊Server 回調opcode事件
     * @param {String} opcode 要監聽的事件名稱
     * @param {Function} fun 回調函數名稱
     */
    addOnResultEvent(opcode, fun) {
        this.addResponseListener(opcode, (data) => {
            this.onResultData(opcode, data, fun);
        });
    }

    /**
     * 註冊Server 回調opcode事件
     * @param {String} opcode 要監聽的事件名稱
     * @param {Function} fun 回調函數名稱
     */
    addEvent(opcode, fun) {
        this.addEventListener(opcode, (data) => {
            this.onResultData(opcode, data, fun);
        });
    }
}

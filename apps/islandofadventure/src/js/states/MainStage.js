import { GetProjectInfo, SocketManager, SocketStatesConfig, MessageManager, ConfigPasser, types, EffectPasser, getCurLangID, SocketSimulatorPasser, GameInfo } from 'slot-base';
import Config from 'js/main/Config';
import EffectStates from 'js/main/EffectStates';
import LanguageConfig from 'js/main/LanguageConfig';
import SocketSimulator from 'js/main/SocketSimulator';
import SlotPage from 'js/view/SymbolPage';

import CryptoJS from 'crypto-js';

export default class MainStage extends Phaser.State {
    init(urlParams) {
        this.token = urlParams.token;
        this.wsIP = urlParams.host;
        this.langID = urlParams.Lang || 'en';
        if (process.env.NODE_ENV !== 'develop') {
            history.pushState(null, 'page', 'index.html');
        }
    }
    create() {
        // 將 Config 註冊給 slot-base 使用
        const passConfig = new ConfigPasser();
        passConfig.register(Config);
        this.languageID = getCurLangID(Config.LANGUAGE);
        passConfig.registerLanguage(LanguageConfig[this.languageID]);
        this.languageSetting = LanguageConfig[this.languageID];

        const passSocketSimulator = new SocketSimulatorPasser();
        passSocketSimulator.register(SocketSimulator);

        new EffectPasser(EffectStates.scheduleAry);

        // 開發工具 拖曳回報定位功能 - 載入
        if (process.env.NODE_ENV === 'develop' || process.env.NODE_ENV === 'devtest') {
            const { LikeMoveIt, KeyCtlCenter } = require('slot-base');

            new KeyCtlCenter(this.game);
            new LikeMoveIt();
        }

        this.clientConfig = this.game.cache.getJSON('ClientConfig');

        // TEST
        // this.decryptStringAESAndPrint('Q7oaGjYHsenKxxVSq/p266LbAp4aIFq5/VQJP5a+g0bI3X5lr+295QGZOwFTAlNxajkwUMf19R74TkjWd5kCnIGGfXxq1ZyPfgy8GBxhndvdPOr4MREiJa8YR+G+zax/muXhbjRy+JKe5wAkrCxCzryCm7d3v8LkU64EwLCMKpflTHYfOTT0tL4zktfCbk2VnAVU2VP8eJUV074dE1mv3AVHbJcrzImEwl3keHl9R+5pcymWrX/wi32rCS/tS1Y57HVY+0SqpF+eFUSm6pNpoG2x7rjhYJnutqMLZTcOYeQN5pbLp+38f01b+Dfz1i32i2mvBJTxgGgkRGnNEzca9j2+5GRMj1AgkdqWYQ==');
        // this.decryptStringAESAndPrint('v44MwD92GSvpiMt6Je/uzbpHVxMsOlQy5gm/0rXy6jxXiFvvZotkYd8hxdrT6tYsVeLXtF0vXcIJm9bbseKr4jidtpiZy4ta96cWqOnl96LX+1B3OFkep80GKuO+y8FEmuTKmZdKh8ft7lHTmx9jiIP0iOz+1q/l5RtddT3h2sUgO08OShIxUbJmIrbVLJT4Rzp5IL+kKzQ/rrdspOHwkx3DPvxVXeZGrZbCy7cIhNXPowSZRmgeNXZr294jWNu9pWzGRKvNcZ32MCktieLEYCivKWvulRab8dj3Gh23FaeoKUnQUj8Dau3wc6i0jyTLiIV0SXccTAI/7olOhyA0xcS2BTxkafwAmHIIqdB7loFFlB3o8MoSB4VRV+mXWYTwa9zDNoevAgHcM9fVKVWwfVOzibWlrBC6JPFwmukH9bzyqETYFHVEHFmERUYa/onWKqg+Hz3WLUFna5FuvuEXbU11lvT6gHWgp53Lbmzfc7xDXb/KuJAhN4FuoD6uf4N/EMHfEIj92XfI1HhV2LRsZpDhA/BATUh3WhHHHOFoF0/kRlB1xiO1dmNuo3dGDNjs2Bcz46X8viWcUPLP3Sp5DQJA+NowBj48ZImZpmcAjzekVVvU4G61qnrzPBX+B8Paj3/u23CNzhnNhLgm0DyzZoY9gt6TWuFcCPcvm60rXf+jKCmXSApnTZTnkxB136OyEMsTXAoxmmFW2o6UOxugt/RnRqq4X35TydaBsPZHFHA01GZ5vWEVYgsj21N0JzDytguLjlD/6TfVa3UIJZVF1LFU4cK/ilY05CiXOFd3/LwXSl1ZrMBA7Ha/XVPK2byBhayFGdQOWXmk/Sx/nTu3F/reCEt4yL8Vm9AxZQJaFg1Zob+AklKVPIe6DAb07K4HMOkftEzaqvh5RwdajySQHXzJG4QQQqxdbNspNtZzqkf9Xp2/P1pzW2B/0K1Xoe6PLxzPqENpT4aiAjQwKjDNwGUXHyu5k5TR79ydAJnW4QJcVsehQWSMaBiSnJo8PonQPhPjob575qHtSGooFILVicgUfuVFT0TGsPetChmQTo5mG4t7xJC/UAb9s5tG0nGJ5EdYPb/e9CZIDr4KUI4FC/FOgXSgffEW334pmc7IL7hXXiCprKnbmCnmq+njeJZBiOmQ2b6S6vbUpoQNyJ0D+VM1XxK15/3cw1fZcQSnesfwZh45diFIQpqZbDWhTwr/ciSFHcs2dyYUkH2WDt1YuxtqY8WDM7EelCOXXSdeFaoJoRPQZ4r8n00MdKiFoxknkI8lhLWlTfbZQksHWfgOx4pcg835hVr+uuxVzfcIb21yxL2xwfzds13wdDg=');
        // this.decryptStringAESAndPrint("nN2Gnwrg9QuzNkDAzn+AQG1GgUwUW9SnRD8qSBmADzo3JrxiN610WJg27Mu9UBnjSOEqdviKM3kS557o1XxA11yd1sikZl13teo+GErUftVQ4BHmkgd0Ti7x+2b8Wer+aQnkvcg1bz2jlPWLE5NTi8IU49EbkSINU+tGUMWlux5z+SdzhiQl9+veK7t54R7bL+3zwuk36UFl1aHwA+681//YBSUaw4OdYR1Q61yw2c5tsjbmq2hxG55yPhelqbFpUiO3ODDl0JQRkN3yL01WwGtz/8XQUz/69WM7OVx4SXLiE+k9IElb2c/X0OJ/xuwbviPPU5g9S4eqpCIlzT0YGpXE2Phc9wSmL3YmAoBd1bDsLwjNR21QL5K9H/kM0MB80a7c1XsE1a+mr2xe8EjvS6U+aJYNtiejKjAoQeRmeoJF/GgzqXJSkohVvhWkqjkv1wi1WJXdpcF61f0KCHVFOXJ9sxJz5NkfGB8G4l2E1BrZ5Ee1fqIBXLYpYe6OgLqP/gNuTeSED1uq+yLE1iHrm+6/DGCxpdp143mj9aQWPdvm4nnjJyTA+ofqGphmmPma9t2FfD51CMpLXvlUNJb/WmIIK0b+LvYS0iv2wFd66fiRAjqjnPqmZYE9asVUPYGyY9ZaDTQ+JC3aHS/lRt9+FllsIb1aHut7t2+ND3plBxatWTNK16fhLltlQOFjNmaJZFC/7DEcw5oU97ziaV4jEhsiyJIiKW4aboN9FIVi1hAdKJ20UxyiI34DtOKNLXKwGcyFeL7EUfF8gQomNkJSlxkMJLPxyCEEcKMTfhBajXg0Xwb5b8zI4pBtFBf5y7A8derzg5pX3LNGqmsKCO7Ry/WnwwyLBRCoRtJQmSrn1mGmc0cxqSjnvPqygHXLXPlQRcGKXpZI626ye5Trmy+5V+yU41jM8/5b0QRR3beDiUqWnnKi/wlk99QSTxLb2MFpGGXZEtUtMzKZBGDUOKlM3u6e00CQVPfimkL6kg4s7/2ZhEqt2MrAtLqH5T/6j3LEsWYRWQAZVMKA7XOacqB0iBnCN4hQ44lFOjSeUaSWXYSIPdZLqDzFGGdtrSdqAWAuLd9aMJOwFkHhnu45")
        // this.decryptStringAESAndPrint('420354fcee3b6a36iJpdpr4cid+hPRwQ4DVg/+A+5gpQB+1QuNezSCommPk=');
        // this.decryptStringAESAndPrint('EospzbQ4PGXPFYVAyJIpxQTr385Jfp3A+8C1uiRCCCIKj/7n1McSk8Vh5TRFl+SUqGUpYyzpu/u7gb96jGIyv+sg4Edtg8mvMCL+8dqTHMm/2723IhAyQ71/syeQDakKvKj5C9ezApL5QROdXa5mstrexEGeV6J1JAZqLU/kJFpaj9ePGr/0JrwtIkDgJQ2buFkywaS8dEqRHgWU');
        // this.decryptStringAESAndPrint('420354fcee3b6a36iJpdpr4cid+hPRwQ4DVg/11VtC/DlwNVBxfwCTdRipI=');
        // this.decryptStringAESAndPrint('04ms9CHOTR76psJxO5kFx9F3w9DoImhycKWLJpCgnQYcdzrP18sFjLPxeMy2lrJN/2jTcE0vBCd6rqPqyz8Gv0HEeu/0oQ64fbpRJW1M966mGXnk/rdcuNMkrtiM8zaGcrTlaOfOeylQJNhAj7l80CXi/RzHZB+FkK0KxAE1wfVdhAqMBk1uc3VDeFDxYffhCiV32TMeroduv+DksHecrBQME8A0mpONbMo8z5bP2Vy+uQx5PXZS5FiLe+sDJ6Jo3X9Ju3v7svqLXe3boloXiwqGpek41wQFUp1d3cIzdY4aV1cm8nspUMSFfkDpIjdjCHa4g5XYUA03h+QS3f2JiIOCMM5sRX4MHvUq6w==');
        // this.decryptStringAESAndPrint('420354fcee3b6a36iJpdpr4cid+hPRwQ4DVg/0bwbnKFL6GFAq6Y4tgwxoyafZo2SR37pxET1+CTv+27YPuYQW8Pqc1fr6QDFOj/lw==');
        // this.decryptStringAESAndPrint('J0kOZku7hMrlsiqn7ZkITAwqX0nOkrSE7FedyZOWAGw+PDK5rjjo92A6/ZtlXFulBydAN/rk5WfAzbgi1BBhP8Qawcikx4tezMgS3MgDUwklAQtQQs/lKKpe7ElPi3J8H+Gumz7oFC+DzqasPzDNtwbgHNIs+TEJNM4xMvzG+3YNavap5Swr1ujpdiugyUv1WKbqpl6F+KH5xcgirM2thwczJ2WGa0Da2ar+Xilf7Np2PqKwc4d9IYAKlZ6IZS85z6p0aWhfNfvNgnov4B6KkClGPWcM95FB27VSSaPqSPSQ4fVIUDB8DpeUlZ9470/falJ6zjSpl1ldECNBpOa+DxCsRzfDcpcZkJf9JQ==');
        // this.decryptStringAESAndPrint('TQVAYiJ9PvfDe7gFQq3IMXRrLRAD+smCO58IIDorqoAPzqbywPbFPeFKYc0tyN6F2WewRjtXXtQ0h8pus1LRciUQc+P4h0eOCtR7M3rVOhKCwvsQLg8mC6khoABtqwTJUK2KDoDHoqd0158kKzd3k8IpAQ3H6Fmi24KbSe1pwFn7Mbbyz7MyrMhvXhw=');

        // Create socket API
        this.APIManager = new SocketManager(GetProjectInfo.getIP(this.wsIP));
        this.APIManager.setToken = this.token;
        this.APIManager.setGameID = this.clientConfig.GAME_ID;

        // this.APIManager.setExtraBet = Config.EXTRA_BET;
        // this.APIManager.setWebID = GetProjectInfo.getUrlParams().web_id;
        // this.APIManager.setMedia = (this.game.device.desktop) ? 'WEB' : 'MOBILE';
        this.APIManager.setAgent = process.env.AGENT_ID || 0;
        // this.APIManager.setAgent = 9781;

        // 創建遊戲錯誤訊息的彈跳視窗(範例)
        this.MsgBox = new MessageManager(this.game);

        // UI創建後 , 進行socket API 接口事件註冊  S > C
        this.APIManager.addEventListener(SocketStatesConfig.ON_GAME_CREDIT, this.onCredit, this);
        this.APIManager.addEventListener(SocketStatesConfig.ON_CONFIG, this.onConfig, this);
        this.APIManager.addEventListener(SocketStatesConfig.ON_STRIP, this.onStrip, this);
        this.APIManager.addEventListener(SocketStatesConfig.ON_BASE_PLAY, this.onPlayData, this);
        this.APIManager.addEventListener(SocketStatesConfig.ON_RESPIN_PLAY, this.onPlayData, this);
        this.APIManager.addEventListener(SocketStatesConfig.ON_BASE_IDLE, this.onIdleData, this);
        // free game
        this.APIManager.addEventListener(SocketStatesConfig.ON_FREE_START, this.onFreeStartData, this);
        this.APIManager.addEventListener(SocketStatesConfig.ON_FREE_PLAY, this.onFreePlayData, this);
        this.APIManager.addEventListener(SocketStatesConfig.ON_FREE_COMPLETE, this.onFreeCompleteData, this);
        // bonus game
        this.APIManager.addEventListener(SocketStatesConfig.ON_BONUS_GAME_START, this.onBonusStartData, this);
        this.APIManager.addEventListener(SocketStatesConfig.ON_BONUS_GAME_PLAY, this.onBonusPlayData, this);
        this.APIManager.addEventListener(SocketStatesConfig.ON_BONUS_GAME_COMPLETE, this.onBonusCompleteData, this);
        // error
        this.APIManager.addEventListener(SocketStatesConfig.ON_GAME_ERROR, this.errorMsg, this);
        // 註冊API接口事件後 , 進行連線(必須要先註冊完事件)
        this.APIManager.connect();

        this.playBool = false;
        this.playMode = 0; // 0 : 無  , 1 : BS Spin , 2 : FS Spin
        this.playSendData = {};
    }

    /**
     * 遮罩訊息
     * @param {Object} data 訊息資料
     */
    errorMsg(data) {
        if (data.errData) {
            if (data.errData.ifBlockGame) {
                this.returnMsg(`${data.errData.errMsg} ${data.errMsg}`);
                return;
            }
            if (this.MySlot) {
                this.MySlot.broadcastShowTip({ messageText: `${data.errData.errMsg} (${data.errData.errCode})` });
                return;
            }
        }
        this.returnMsg(data.errMsg);
    }

    returnMsg(msg) {
        if (this.MySlot) {
            this.MySlot.destroy(true, false);
        }
        if (!this.MsgBox) {
            this.MsgBox = new MessageManager(this.game);
        }
        this.MsgBox.showErrorMessageWithRefresh(msg, true, this, [
            () => { window.location.href = window.location.href.includes('?token=') ? window.location.href : `${window.location.href}?token=${this.token}`; },
            () => { window.location.href = GetProjectInfo.getHOME(this.clientConfig.HOME_ADDRESS); }
        ]);
    }

    maintenanceReminder() {
        const maintenanceTime = new Date();
        maintenanceTime.setHours(this.clientConfig.MAINTENANCE_HOUR);
        maintenanceTime.setMinutes(this.clientConfig.MAINTENANCE_MINUTE);

        const now = new Date();
        const minutesFixedPreMaintenance = (now.getHours() * 60 + now.getMinutes()) - (maintenanceTime.getHours() * 60 + maintenanceTime.getMinutes());
        const minutesToNextMaintenance = minutesFixedPreMaintenance < 0 ? Math.abs(minutesFixedPreMaintenance) : 24 * 60 - minutesFixedPreMaintenance;

        const minutesStrDeg = this.clientConfig.MAINTENANCE_MINUTE.toString().length < 2 ? `0${this.clientConfig.MAINTENANCE_MINUTE}` : this.clientConfig.MAINTENANCE_MINUTE;
        const msgContent = `${this.languageSetting.maintenance} (${this.clientConfig.MAINTENANCE_HOUR}:${minutesStrDeg})`;

        if (minutesToNextMaintenance < 3) {
            this.MySlot.broadcastShowTip({ messageText: msgContent });
            return;
        }
        if (minutesToNextMaintenance < 10 && minutesToNextMaintenance >= 3) {
            this.MySlot.broadcastShowTip({ messageText: msgContent });
            let nextRoundTO = setTimeout(() => {
                this.maintenanceReminder();
                clearTimeout(nextRoundTO);
                nextRoundTO = null;
            }, 120000);
            return;
        }
        if (minutesToNextMaintenance < 15 && minutesToNextMaintenance >= 10) {
            this.MySlot.broadcastShowTip({ messageText: msgContent });
            let nextRoundTO = setTimeout(() => {
                this.maintenanceReminder();
                clearTimeout(nextRoundTO);
                nextRoundTO = null;
            }, 300000);
            return;
        }
        if (minutesToNextMaintenance < 31 && minutesToNextMaintenance >= 15) {
            this.MySlot.broadcastShowTip({ messageText: msgContent });
            let nextRoundTO = setTimeout(() => {
                this.maintenanceReminder();
                clearTimeout(nextRoundTO);
                nextRoundTO = null;
            }, 600000);
            return;
        }
        let nextRoundTO = setTimeout(() => {
            this.maintenanceReminder();
            clearTimeout(nextRoundTO);
            nextRoundTO = null;
        }, (minutesToNextMaintenance - 30) * 60 * 1000);
    }

    onConfig(data) {
        this.configData = data;
        this.configData.gameReturnUrl = GetProjectInfo.getHOME(this.clientConfig.HOME_ADDRESS);
        this.APIManager.sendGetStrip();

        if (data.EmulatorType !== 0) {
            this.showEmulator(data.EmulatorType);
        }
    }

    onStrip(data) {
        this.stripData = data;
        // 拿到 strip 代表已登入且拿到 game config 資訊
        // 執行 init
        this.onSocketInitComplete(Object.assign({}, this.configData, this.stripData));
    }

    onCredit(amount) {
        if (!this.MySlot) {
            this.MySlot = new SlotPage(this);
        }
        if (this.MySlot) {
            this.MySlot.setCredit(amount);
        }
    }

    // 連線成功進行UI 初始化設定
    onSocketInitComplete(data) {
        this.gameInitData = data;

        if (!this.MySlot) {
            this.MySlot = new SlotPage(this);
        }
        this.MySlot.init(this.gameInitData);
        this.MySlot.registerKeyboard();
        // this.maintenanceReminder();
    }

    decryptStringAESAndPrint(str) {
        const strEncryptText = str;
        const iv = strEncryptText.slice(0, 16);
        const decrypted = CryptoJS.AES.decrypt(
            strEncryptText.substring(16),
            CryptoJS.enc.Utf8.parse('60A299E7243EDEA7'),
            {
                keySize: 128 / 8 | 0,
                iv: CryptoJS.enc.Utf8.parse(iv),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
    }

    // 接收結果資料
    onPlayData(data) {
        // 如果收到error訊息 停止遊戲轉動 並且顯示錯誤訊息
        // return4
        // 確定下注成功 Socket返回結果給UI端
        this.MySlot.setResultShowStates(data);

        if (data.EmulatorType !== 0) {
            this.showEmulator(data.EmulatorType, data.RngData);
        }
    }

    // 接收Idle
    onIdleData() {
        this.playBool = false;
        switch (this.playMode) {
            case 0:
                break;
            case 1:
                this.sendGamePlay(
                    this.playSendData.bet,
                    this.playSendData.denom,
                    this.playSendData.line,
                    this.playSendData.miniBet,
                    this.playSendData.extraBet,
                    this.playSendData.reelPay
                );
                break;
            case 2:
                break;
            default:
        }
    }

    // Free Game
    onFreeStartData(data) {
        this.MySlot.setFreeStartStates(data);
    }
    onFreePlayData(data) {
        this.MySlot.setResultShowStates(data);

        if (data.EmulatorType !== 0) {
            this.showEmulator(data.EmulatorType, data.RngData);
        }
    }

    onFreeCompleteData(data) {
        this.MySlot.setFreeCompleteStates(data);
    }

    onBonusStartData(data) {
        this.MySlot.setBonusStartStates(data);
    }

    onBonusPlayData(data) {
        this.MySlot.setBonusPlayStates(data);
    }

    onBonusCompleteData(data) {
        this.MySlot.setBonusCompleteStates(data);
    }

    showEmulator(emulatorType, rngData = []) {
        if (this.emulatorText === undefined) {
            const style = { font: '30px Arial', fill: '#FFFFFF', align: types.align.CENTER };
            this.emulatorText = this.game.add.text(1900, 1000, '', style);
            this.emulatorText.anchor.x = 1;
        }

        let msg = '';
        switch (emulatorType) {
            case 1:
                msg = 'Use Emulator';
                break;
            case 2:
                msg = 'Emulator Over';
                break;
            case 3:
                msg = 'Debug 版本';
                break;
            default:
        }

        // 避免開發版本外秀出 RNG
        let rngText = '';
        if ([ 'develop', 'devtest', 'qatest' ].indexOf(process.env.NODE_ENV) !== -1 && rngData.length) {
            const newRngData = [];
            rngData.forEach((item, i) => {
                newRngData[i] = item + 1;
            });
            rngText = newRngData.toString();
        }
        // rng 文字 + 是否跑腳本的文字
        this.emulatorText.text = `${rngText}    ${msg}`;
    }
    /**
     * ----- client 通知 server -----
     */

    /**
     * ui 通知 api 發送遊戲 play （下注開始）
     * @param  {Number} bet       下注金額
     * @param  {Number} denom     denom
     * @param  {Number} line      下注線數
     * @param  {Number} miniBet   最小下注金額
     * @param  {Number} ExtraBet  Extra
     * @param  {Array} reelPay    某輪重轉的金額
     */
    sendGamePlay(bet, denom, line, miniBet, extraBet, reelPay) {
        // 判斷是否已經收到Idle
        if (!this.playBool) {
            this.playBool = true;
            this.APIManager.play(bet, denom, line, miniBet, extraBet, reelPay);
            this.playMode = 0;
            this.playSendData = {};
            return;
        }
        // 儲存此筆記錄
        this.playMode = 1;
        this.playSendData.bet = bet;
        this.playSendData.denom = denom;
        this.playSendData.line = line;
        this.playSendData.miniBet = miniBet;
        this.playSendData.extraBet = extraBet;
        this.playSendData.reelPay = reelPay;
    }

    /**
     * ui 通知 api 發送遊戲 respin
     * @param  {Number} bet       下注金額
     * @param  {Number} denom     Denom
     * @param  {Number} line      下注線數
     * @param  {Number} miniBet   最小下注金額
     * @param  {Number} reelPay   某輪重轉的金額
     */
    sendRespin(bet, denom, line, miniBet, extraBet, reelPay) {
        this.APIManager.respinPlay(bet, denom, line, miniBet, extraBet, reelPay);
    }

    // ui 通知 api 發送遊戲 idle （下注結束）
    sendGameIdle() {
        this.APIManager.idle();
    }

    // ############################  Free Game ############################
    // ui 通知 api 發送遊戲 idle （下注結束）
    sendFreeGameStart() {
        this.APIManager.freeStart();
    }

    sendFreeGamePlay() {
        this.APIManager.freePlay();
    }

    sendFreeGameComplete() {
        this.APIManager.freeComplete();
    }

    // ############################ Bonus game ############################
    // 發送Bonsu Start
    sendBonusGameStart() {
        this.APIManager.bonusStart();
    }

    // 發送Bonus Play
    sendBonusGamePlay(PlayerSelectState, PlayerSelectIndex) {
        this.APIManager.bonusPlay(PlayerSelectState, PlayerSelectIndex);
    }

    // 發送Bonus 結束
    sendBonusGameComplete() {
        this.APIManager.bonusComplete();
    }
}

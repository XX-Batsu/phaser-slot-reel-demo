import GlobalEvent from 'base/GlobalEvent';

export default class SignalMap {
    constructor() {
        this.signalDataMap = [];
    }

    // 單例模式
    static get instances() {
        if (this.instance === undefined) {
            this.instance = new SignalMap();
        }
        return this.instance;
    }

    static onSignalPlay(key) {
        if (this.instances.signalDataMap.indexOf(key) === -1) {
            this.instances.signalDataMap.push(key);
            // 驗證 Signal 是否註冊，但沒有加入監聽名單中
            if (GlobalEvent.isUsedForListener(key) === undefined) {
                throw new Error(`"${key}" is Registed in "EffectStates", but not use for "addEventListener".`);
            }
        }
    }

    static isSignalEvent(key) {
        return !(this.instances.signalDataMap.indexOf(key) === -1);
    }

    static removeSignalEvent(key) {
        const index = this.instances.signalDataMap.indexOf(key);
        if (index !== -1) {
            this.instances.signalDataMap.splice(index, 1);
        }
    }
}

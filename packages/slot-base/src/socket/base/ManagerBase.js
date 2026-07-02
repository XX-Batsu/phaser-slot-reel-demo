export default class ManagerBase {
    constructor() {
        this.externalMap = {};
    }

    /**
     * 外部事件綁定
     * @param {string} eventName 事件名稱
     * @param {[type]} listener  事件
     * @param {[type]} context   物件指向目標 (外部的事件的 this)
     */
    addEventListener(eventName, listener, context) {
        if (typeof listener !== 'function') {
            throw new Error('listener is not a "Function"');
        }

        if (this.externalMap[eventName] === undefined) {
            this.externalMap[eventName] = {
                listener: '',
                context: ''
            };
        }
        this.externalMap[eventName].listener = listener;
        this.externalMap[eventName].context = context;
    }

    /**
     * 發佈對外事件
     * @param  {string} eventName 事件名稱
     * @param  {any}    data      資料
     */
    dispacth(eventName, data = undefined) {
        if (this.externalMap.hasOwnProperty(eventName)) {
            const callObj = this.externalMap[eventName];

            if (data !== undefined) {
                callObj.listener.call(callObj.context, data);
                return;
            }

            callObj.listener.call(callObj.context);
        }
    }

    /**
     * 移除外部監聽事件
     * @param  {string} eventName 事件名稱
     */
    removeEventAll(eventName) {
        if (this.externalMap.hasOwnProperty(eventName)) {
            delete this.externalMap[eventName];
        }
    }
}

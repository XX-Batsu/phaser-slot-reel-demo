export default class GameFlow {
    constructor() {
        this.sendDataMap = {};
        this.initEventMsg();
    }

    initEventMsg() {}

    /**
     * [註冊封包接受器]
     * @param {[Number]} eventID  封包編號
     * @param {[Class]}  modelClass 封包編號要丟入的Model
     */
    addSocketData(eventID, modelClass = undefined) {
        if (this.sendDataMap[eventID] === undefined) {
            this.sendDataMap[eventID] = modelClass;
        }
    }

    // Server To Client 接收時使用 用來分配註冊封包事件的Model處理
    eventNameData(eventID, data) {
        if (this.sendDataMap[eventID] !== undefined) {
            const MODEL_CLASS = this.sendDataMap[eventID];
            if (MODEL_CLASS !== undefined) {
                const model = new MODEL_CLASS(data);
                return model;
            }
        }
        return true;
    }
}

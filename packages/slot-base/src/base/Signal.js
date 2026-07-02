import Event from 'base/Event';
import SignalMap from 'base/SignalMap';
import SlotSignalSchedule from 'base/SlotSignalSchedule';

export default class Signal extends Event {
    constructor(key) {
        super(key);
        SignalMap.onSignalPlay(key);
    }

    // 取得此Signal狀態是否有被註冊機觸發
    static get isCallEvent() {
        return SignalMap.isSignalEvent(this[Object.keys(this)]);
    }

    static callBack() {
        // 判斷此Signal狀態是否有被註冊機觸發
        if (this.isCallEvent) {
            const eventName = this[Object.keys(this)];
            // console.log('動畫事件CallBack', `Signal Target : ${this.name}`, eventName);
            // 移除已播放的 signal
            SignalMap.removeSignalEvent(eventName);
            // 可回調註冊機事件進行遞減行為
            SlotSignalSchedule.showOverCallBack(eventName);
        }
    }
}

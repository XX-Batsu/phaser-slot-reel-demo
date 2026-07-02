import Event from 'base/Event';

export default class GlobalEvent {
    constructor() {
        this.singalMap = [];
        this.listenerMap = [];
    }

    // 單例模式
    static get instances() {
        if (this.instance === undefined) {
            this.instance = new GlobalEvent();
        }
        return this.instance;
    }

    static dispatchEvent(MyEvent) {
        if (Event.prototype.isPrototypeOf(MyEvent)) {
            // 這邊要做異步處理 先註冊後發布
            let timer = setTimeout(() => {
                this.dispatch(MyEvent.EventType, MyEvent);
                clearTimeout(timer);
                timer = null;
            }, 0);
            return;
        }
        throw new Error('Error No Event Class');
    }

    static dispatch(EventName, args = undefined) {
        if (this.instances.singalMap[EventName]) {
            (args === undefined)
                ? this.instances.singalMap[EventName].dispatch()
                : this.instances.singalMap[EventName].dispatch(args);
        }
    }

    static addEventListener(EventName, listener, listenerContext) {
        const TypeEvent = (Event.prototype.isPrototypeOf(EventName)) ? EventName.EventType : EventName;
        // 驗證註冊字串錯誤
        // if (TypeEvent === undefined) {
        //     throw new Error(`There is a Error Signal "EventName" registering at "${listener.name} in "${listenerContext.constructor.name}".`);
        // }
        if (this.instances.singalMap[TypeEvent] === undefined) {
            this.instances.singalMap[TypeEvent] = new Phaser.Signal();
        }
        this.instances.singalMap[TypeEvent].add(listener, listenerContext);
        this.instances.listenerMap[EventName] = listener;
    }

    static removeEventListener(EventName, listener, listenerContext) {
        if (this.instances.singalMap[EventName]) {
            this.instances.singalMap[EventName].remove(listener, listenerContext);
        }
    }

    /**
     * 事件是否加入監聽名單中
     * {String} TypeEvent 事件名稱
     * @return  事件名稱 or undefined
     */
    static isUsedForListener(TypeEvent) {
        return (this.instances.listenerMap[TypeEvent]);
    }
}

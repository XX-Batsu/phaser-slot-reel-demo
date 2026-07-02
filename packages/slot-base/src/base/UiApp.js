import GameBase from 'base/GameBase';

export default class UiApp {
    // UI 工廠
    constructor(contextBase) {
        this.contextBase = contextBase;
        this.viewMap = [];
    }

    uiRegister(classUI) {
        if (this.contextBase !== undefined) {
            const UI = classUI;
            const item = new UI(this.contextBase.game);
            this.contextBase.addChild(item);
            if (GameBase.prototype.isPrototypeOf(item)) {
                this.viewMap.push(item);
                return item;
            }
        }
        throw new Error('Error Not Create UiApp');
    }

    callWinLineEvent() {
        this.viewMap.forEach((element) => {
            element.onWinLineTimer();
        });
    }
}

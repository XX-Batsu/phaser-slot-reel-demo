import GlobalEvent from 'base/GlobalEvent';

export default class GameBase extends Phaser.Group {
    addEventListener(eventName, listener, context) {
        GlobalEvent.addEventListener(eventName, listener, context);
    }

    onDispatchEvent(myEvent) {
        GlobalEvent.dispatchEvent(myEvent);
    }

    onWinLineTimer() {}
}

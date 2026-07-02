import Event from 'base/Event';

export default class MessageEvent extends Event {
    constructor(type, messageText = '') {
        super(type);
        this.messageText = messageText;
    }
}
MessageEvent.ON_SHOW_MESSAGE_TIP = 'ON_SHOW_MESSAGE_TIP';
MessageEvent.ON_CLOSE_MESSAGE_TIP = 'ON_CLOSE_MESSAGE_TIP';
MessageEvent.ON_SHOW_MESSAGE_EXIT = 'ON_SHOW_MESSAGE_EXIT';

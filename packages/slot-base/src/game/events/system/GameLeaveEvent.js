import Event from 'base/Event';

export default class GameLeaveEvent extends Event {
    constructor(type) {
        super(type);
        this.eventType = type;
    }
}
GameLeaveEvent.ON_GAME_LEAVE = 'ON_GAME_LEAVE';

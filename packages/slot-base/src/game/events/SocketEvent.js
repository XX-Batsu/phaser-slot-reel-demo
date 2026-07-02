import Event from 'base/Event';

export default class SocketEvent extends Event {
    constructor(type) {
        super(SocketEvent.STATES);
        this.opcode = type;
        this.data = {};
    }
}
SocketEvent.STATES = 'socket';

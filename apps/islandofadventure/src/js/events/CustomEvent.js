import { Event } from 'slot-base';

export default class CustomEvent extends Event {
    constructor(type, paramAry = []) {
        super(type);
        this.eventType = type;
        this.params = paramAry;
    }
}
CustomEvent.MOAI_SWALLOW = 'MOAI_SWALLOW';
CustomEvent.MOAI_SPIT = 'MOAI_SPIT';

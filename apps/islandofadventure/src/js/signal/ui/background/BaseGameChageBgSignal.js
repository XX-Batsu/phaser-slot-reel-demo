import { Signal } from 'slot-base';

export default class BaseGameChageBgSignal extends Signal {
    constructor() {
        super(BaseGameChageBgSignal.ON_CHAGE_BASE_BG);
    }
}
BaseGameChageBgSignal.ON_CHAGE_BASE_BG = 'ON_CHAGE_BASE_BG';

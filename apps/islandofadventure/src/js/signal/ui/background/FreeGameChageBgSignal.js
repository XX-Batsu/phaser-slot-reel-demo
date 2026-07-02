import { Signal } from 'slot-base';

export default class FreeGameChageBgSignal extends Signal {
    constructor() {
        super(FreeGameChageBgSignal.ON_CHAGE_FREE_BG);
    }
}
FreeGameChageBgSignal.ON_CHAGE_FREE_BG = 'ON_CHAGE_FREE_BG';

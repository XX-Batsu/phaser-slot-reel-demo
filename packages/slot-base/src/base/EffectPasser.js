export default class EffectPasser {
    constructor(ary) {
        EffectPasser.instances = this;
        this.scheduleAry = ary;
    }

    static get scheduleAry() {
        return EffectPasser.instances.scheduleAry;
    }
}

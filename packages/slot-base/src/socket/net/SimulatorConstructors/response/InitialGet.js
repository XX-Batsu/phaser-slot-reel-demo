export default class InitialGet {
    constructor(result) {
        const initData = {
            betAry: result.ConstBetBaseValue,
            denomAry: result.ConstBetMultiplyValue,
            lineAry: []
        };
        return initData;
    }
}

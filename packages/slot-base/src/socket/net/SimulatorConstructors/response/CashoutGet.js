export default class CashoutGet {
    constructor(result) {
        const currnecyAry = AgentInitial.transformCashoutData(result).currencyTypeAry;
        return currnecyAry;
    }
}

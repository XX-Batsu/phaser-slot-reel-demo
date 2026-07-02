export default class RefreshGet {
    constructor(result) {
        return AgentInitial.transformCurrencyData(result.array_gameInfo, result.array_userCoinQuota);
    }
}

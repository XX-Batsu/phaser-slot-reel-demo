export default class BetGet {
    constructor(result) {
        const translatedData = Object.create(null);
        translatedData.credit = result.credit;
        translatedData.bet = result.bet;
        translatedData.win = result.win;
        const jsonGameResult = JSON.parse(result.jsonGameResult);
        translatedData.denom = jsonGameResult.denom;
        translatedData.gameHitScatterList = jsonGameResult.gameHitScatterList;
        translatedData.playerHitScatterList = jsonGameResult.playerHitScatterList;
        translatedData.group0_Multiply = jsonGameResult.group0_Multiply;
        translatedData.group1_Multiply = jsonGameResult.group1_Multiply;
        translatedData.hasPlayDoubleUp = jsonGameResult.hasPlayDoubleUp;
        translatedData.enum_DoubleUpResult = jsonGameResult.enum_DoubleUpResult;
        translatedData.doubleUpNumber = jsonGameResult.doubleUpNumber;
        return translatedData;
    }
}

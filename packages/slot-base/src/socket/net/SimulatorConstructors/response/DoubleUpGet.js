export default class DoubleUpGet {
    constructor(result) {
        const translatedData = Object.create(null);
        translatedData.credit = result.credit;
        translatedData.bet = result.bet;
        translatedData.win = result.win;
        const jsonGameResult = JSON.parse(result.jsonGameResult);
        translatedData.denom = jsonGameResult.denom;
        translatedData.doubleUpNumber = jsonGameResult.doubleUpNumber;
        translatedData.enum_DoubleUpResult = jsonGameResult.enum_DoubleUpResult;

        return translatedData;
    }
}

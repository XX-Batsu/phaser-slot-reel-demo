export default class LanguageConfig {}
LanguageConfig.langsAry = [ 'zh-tw', 'en' ];
LanguageConfig[LanguageConfig.langsAry[0]] = {
    confirmCheckout: '確定要進行結帳？',
    confirm: '確認',
    maintenance: '伺服器即將進行維護 請提前關閉遊戲',
    insufficientBalance: '餘額不足',
    transToCustomerService: '如有疑問，請將此畫面交給客服人員',
    confirmGoBack: '點擊確認回到遊戲大廳',
    confirmExitGame: '確認要離開遊戲？'
};
LanguageConfig[LanguageConfig.langsAry[1]] = {
    confirmCheckout: 'Checkout now?',
    confirm: 'Confirm',
    maintenance: 'Server is about to maintain',
    insufficientBalance: 'Insufficient balance',
    transToCustomerService: 'If necessary, please submit this screen to the customer service staff.',
    confirmGoBack: 'Press "Confirm" going back to game lobby',
    confirmExitGame: 'Exit game now?'
};

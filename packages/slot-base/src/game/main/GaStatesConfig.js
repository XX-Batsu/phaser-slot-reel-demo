/**
 * 控制遊戲行為發布註冊區
 */
class GaStatesConfig {}

// 遊戲第一次初始化(限調用一次)
GaStatesConfig.gameinit = 'gameInit';
// 轉動前觸發特效
GaStatesConfig.gameBeforeSpin = 'gameBeforeSpin';
// 轉動
GaStatesConfig.gameSpin = 'gameSpin';
// 急停
GaStatesConfig.gameStop = 'gameStop';
// 自動 (限於按鈕接收)
GaStatesConfig.gameAuto = 'gameAuto';
// 自動停止 (限於按鈕接收)
GaStatesConfig.gameAutoStop = 'gameAutoStop';
// 開啟 setting
GaStatesConfig.gameSetting = 'gameSetting';
// 關閉 setting
GaStatesConfig.gameSettingReturn = 'gameSettingReturn';
// 轉動後觸發特效
GaStatesConfig.gameBeforeShowWin = 'gameBeforeShowWin';
// 秀線特效
GaStatesConfig.gameNoWin = 'gameNoWin';
GaStatesConfig.gameWin = 'gameWin';
GaStatesConfig.gameBigWinLockBtn = 'gameBigWinLockBtn';
// 當前狀態按鈕全部鎖住
GaStatesConfig.gameLockBtn = 'gameLockBtn';
// 取分
GaStatesConfig.gameTakeWin = 'gameTakeWin';
// 遊戲靜止
GaStatesConfig.gameIdle = 'gameIdle';
// 音效關閉 (限於按鈕接收)
GaStatesConfig.soundOff = 'soundOff';
// 音效開啟 (限於按鈕接收)
GaStatesConfig.soundOn = 'soundOn';
// 規則說明 (限於按鈕接收)
GaStatesConfig.gameHelp = 'gameHelp';
// 細單開啟 (限於按鈕接收)
GaStatesConfig.gameHistory = 'gameHistory';
// jp取分
GaStatesConfig.gameJpTakeWin = 'gameJpTakeWin';
// 遊戲靜止後的狀態 (接收到server資料用)
GaStatesConfig.gameAfterIdle = 'gameAfterIdle';

export default GaStatesConfig;

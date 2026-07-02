// ----- Btn -----
// FreeGame返回BaseGame時 顯示BaseGame按鈕 [基本流程]
import BaseGameShowBtnSignal from 'game/signal/ui/btn/BaseGameShowBtnSignal';
// BaseGame進入FreeGame時 隱藏BaseGame按鈕 [基本流程]
import FreeGameHideBtnSignal from 'game/signal/ui/btn/FreeGameHideBtnSignal';

//  ----- Text -----
// 觸發顯示Base Game畫面需要的Text [基本流程]
import BaseGameShowTextSignal from 'game/signal/ui/text/BaseGameShowTextSignal';
// 觸發顯示Free Game畫面需要的Text [基本流程]
import FreeGameShowTextSignal from 'game/signal/ui/text/FreeGameShowTextSignal';
// WinScoreSignal - 贏分
import WinScoreSignal from 'game/signal/ui/text/WinScoreSignal';
// FreeGame秀分 [基本流程]
import FreeWinScoreSignal from 'game/signal/ui/text/FreeWinScoreSignal';
// FreeGame Scatter秀分 [基本流程]
import FreeScatterScoreSignal from 'game/signal/ui/text/FreeScatterScoreSignal';
// 只有Bonus自己原本就有需要顯示分數時使用
import LuckyDrawScoreSignal from 'game/signal/ui/text/LuckyDrawScoreSignal';
// FreeGame秀分 [基本Line Extra共用流程]
import FreeWinShowScoreSignal from 'game/signal/ui/text/FreeWinShowScoreSignal';

// ----- FreeGame -----
// 觸發 ReTrigger 的贈送次數 [在FreeGame中][FreeGame基本流程]
import FreeGameReTriggerCountSignal from 'game/signal/freegame/FreeGameReTriggerCountSignal';

// ----- Jackpot -----
import JackpotTriggerSignal from 'game/signal/jackpot/JackpotTriggerSignal';
import JackpotTakeWinSignal from 'game/signal/jackpot/JackpotTakeWinSignal';
import JackpotWinShowScoreSignal from 'game/signal/ui/text/JackpotWinShowScoreSignal';
// ----- Big win -----
import BigWinSignal from 'game/signal/bigwin/BigWinSignal';

export {
    BaseGameShowBtnSignal,
    FreeGameHideBtnSignal,
    BaseGameShowTextSignal,
    FreeGameShowTextSignal,
    WinScoreSignal,
    FreeWinScoreSignal,
    FreeScatterScoreSignal,
    LuckyDrawScoreSignal,
    FreeWinShowScoreSignal,
    FreeGameReTriggerCountSignal,
    JackpotTriggerSignal,
    JackpotTakeWinSignal,
    JackpotWinShowScoreSignal,
    BigWinSignal
};

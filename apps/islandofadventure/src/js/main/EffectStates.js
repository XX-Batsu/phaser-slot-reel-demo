import { SlotGame } from 'slot-base';
// BaseGameShowTextSignal - 觸發顯示Base Game畫面需要的Text [基本流程]
// FreeGameShowTextSignal - 觸發顯示Free Game畫面需要的Text [基本流程]
// BaseGameShowBtnSignal - FreeGame返回BaseGame時 顯示BaseGame按鈕 [基本流程]
// FreeGameHideBtnSignal - BaseGame進入FreeGame時 隱藏BaseGame按鈕 [基本流程]

// WinScoreSignal - 贏分
// FreeWinScoreSignal - FreeGame秀分 [基本流程]
// FreeScatterScoreSignal - FreeGame Scatter秀分 [基本流程]
// LuckyDrawScoreSignal - 只有Bonus自己原本就有需要顯示分數時使用
// FreeWinShowScoreSignal - FreeGame秀分 [基本Line Extra共用流程]
// FreeGameReTriggerCountSignal - 觸發 ReTrigger 的贈送次數 [在FreeGame中][FreeGame基本流程]

// #-------------------- [ UI - Reel ] --------------------
// 回BaseGame 刷新BaseGame專用的RangeData [基本流程]
import ReBaseGameRangeSignal from 'js/signal/ui/reel/ReBaseGameRangeSignal';
// 進入FreeGame 刷新FreeGame專用的RangeData [基本流程]
import ReelRefreshSignal from 'js/signal/ui/reel/ReelRefreshSignal';
// 隱藏所有Reel靜態Symbol
// import ReelSymbolAllHideSignal from 'js/signal/ui/reel/ReelSymbolAllHideSignal';
// 顯示所有Reel靜態Symbol
import ReelSymbolAllShowSignal from 'js/signal/ui/reel/ReelSymbolAllShowSignal';
// 隱藏 Scatter WinPlay的Symbol [基本流程]
import ReelScatterHideSignal from 'js/signal/ui/reel/ReelScatterHideSignal';
// 隱藏 Bonus WinPlay的Symbol [基本流程]
import ReelBonusHideSignal from 'js/signal/ui/reel/ReelBonusHideSignal';

// #-------------------- [ UI - BackGround ] --------------------
// BaseGame過場換FreeGame [基本流程]
import BaseGameChageBgSignal from 'js/signal/ui/background/BaseGameChageBgSignal';
// FreeGame過場換BaseGame [基本流程]
import FreeGameChageBgSignal from 'js/signal/ui/background/FreeGameChageBgSignal';

// #-------------------- [ UI - Symbol ] --------------------
// 觸發播放 Scatter 動畫 [基本流程]
import ScatterPlaySignal from 'js/signal/ui/symbol/ScatterPlaySignal';
// 觸發播放 Bonus 動畫 [基本流程]
import BonusPlaySignal from 'js/signal/ui/symbol/BonusPlaySignal';

// #-------------------- [ BigWin ] --------------------

// #-------------------- [ WinData ] --------------------
// 秀框 [基本秀線流程]
import WinBorderSignal from 'js/signal/windata/WinBorderSignal';
// 秀Symbol [基本秀線流程]
import WinSymbolSignal from 'js/signal/windata/WinSymbolSignal';
// 秀線 [基本秀線流程 WayGame則不使用在win流程]
import WinLineSignal from 'js/signal/windata/WinLineSignal';
// 秀分 [基本秀線流程]
import WinSymbolScoreSignal from 'js/signal/windata/WinSymbolScoreSignal';
// 隱藏Reel的WinSymbol [基本秀線流程]
import ReelWinHideSignal from 'js/signal/ui/reel/ReelWinHideSignal';

// 秀分 [基本Line Extra共用流程]
import WinSymbolShowScoreSignal from 'js/signal/windata/WinSymbolShowScoreSignal';
// 秀線 [基本Line Extra共用流程]
import WinLineShowSignal from 'js/signal/windata/WinLineShowSignal';
// 秀框 [基本Line Extra共用流程]
import WinBorderShowSignal from 'js/signal/windata/WinBorderShowSignal';
// 秀Symbol [基本Line Extra共用流程]
import WinSymbolShowSignal from 'js/signal/windata/WinSymbolShowSignal';
// 隱藏Reel的WinSymbol [基本Line Extra共用流程]
import ReelShowWinHideSignal from 'js/signal/windata/ReelShowWinHideSignal';

// 清除秀框 [基本Line Extra共用流程]
import ClearShowBorderSignal from 'js/signal/freegame/ClearShowBorderSignal';
// 清除秀分 [基本Line Extra共用流程]
import ClearShowWinScoreSignal from 'js/signal/freegame/ClearShowWinScoreSignal';
// 清除秀分 [基本Line Extra共用流程]
import ClearShowWinLineSignal from 'js/signal/freegame/ClearShowWinLineSignal';

// #-------------------- [ FreeGame ] --------------------
// 觸發 FreeGame 結算 [FreeGame基本流程]
import FreeCompleteSignal from 'js/signal/freegame/FreeCompleteSignal';
// 觸發 FreeGame 清掉內容 [FreeGame基本流程]
import FreeGameClearSignal from 'js/signal/freegame/FreeGameClearSignal';
// 觸發 FreeGame Start [在BaseGame中][FreeGame基本流程]
import FreeGameTriggerSignal from 'js/signal/freegame/FreeGameTriggerSignal';
// 觸發 ReTrigger FreeGame [在FreeGame中][FreeGame基本流程]
import FreeGameReTriggerSignal from 'js/signal/freegame/FreeGameReTriggerSignal';

// #-------------------- [ Bonus ] --------------------
// 觸發Bonus Start [BonusGame基本流程]
import BonusGameTriggerSignal from 'js/signal/bonusgame/BonusGameTriggerSignal';
// 觸發Bonus 靜止 [BonusGame基本流程]
import BonusGameIdleSignal from 'js/signal/bonusgame/BonusGameIdleSignal';
// 觸發Bonus Play [BonusGame基本流程]
import BonusGamePlaySignal from 'js/signal/bonusgame/BonusGamePlaySignal';
// 觸發Bonus 結算 [BonusGame基本流程]
import BonusGameCompleteSignal from 'js/signal/bonusgame/BonusGameCompleteSignal';


// #-------------------- [ FreeGame - feature ] --------------------
// 變臉動畫 [Line Extra流程]
// import ChangeFacePlaySignal from 'js/signal/freegame/ChangeFacePlaySignal';

// FreeGame轉場動畫
import FreeTriggerEffectSignal from 'js/signal/freegame/FreeTriggerEffectSignal';
// #-------------------- [ UI - Reel 特殊玩法 ] --------------------
// 消消樂 [ReSpin流程]
// import ReelSymbolBlowUpSignal from 'js/signal/ui/reel/ReelSymbolBlowUpSignal';
// 觸發更換Symbol [變臉流程]
import ReelSymbolChangeSignal from 'js/signal/ui/reel/ReelSymbolChangeSignal';
import MoaiWinSignal from 'js/signal/MoaiWinSignal';

// #-------------------- [ UI - Text - feature ] --------------------
// 這裡住測遊戲特色事件

// 結算流程事件註冊區
export default class EffectStates {}
EffectStates.scheduleAry = {
    baseGame: {
        // 轉動前需要的特效
        beforeSpin: [],
        spin: [],
        // 轉動後需要的特效 例如 Wild需要變牌 (這邊會全部鎖住按鈕但可以設定成點擊遮罩按鈕取消當前動畫)
        beforeShowWin: [],
        beforeShowBigWin: [
            [ SlotGame.CommonSignal.BigWinSignal ]
        ],
        // 以下是秀線中獎流程
        win: [
            [ WinSymbolSignal, WinSymbolScoreSignal, ReelWinHideSignal, SlotGame.CommonSignal.WinScoreSignal ]
        ],
        // 特殊贏
        winExtra: [
            [ ReelSymbolChangeSignal ],
            [
                WinBorderShowSignal, WinSymbolShowSignal, WinSymbolShowScoreSignal,
                ReelShowWinHideSignal, SlotGame.CommonSignal.WinScoreSignal
            ],
            [ ReelSymbolAllShowSignal, ClearShowBorderSignal, ClearShowWinScoreSignal ]
        ],
        // 沒贏
        noWin: [],
        // ReSpin轉前
        beforeReSpin: [],
        // BonusGame流程
        beforeShowBonusGameEnter: [
            [ BonusPlaySignal, ReelBonusHideSignal ],
            [ BonusGameTriggerSignal, ReelSymbolAllShowSignal ]
        ],
        bonusIdle: [
            [ BonusGameIdleSignal ]
        ],
        bonusPlay: [
            [ BonusGamePlaySignal ]
        ],
        bonusComplete: [
            [ BonusGameCompleteSignal ]
        ]
    },
    // [ 20160805新增 ]
    freeGame: {
        // 轉動前需要的特效
        beforeSpin: [],
        spin: [],
        // 轉動後需要的特效 例如 Wild需要變牌 (這邊會全部鎖住按鈕但可以設定成點擊遮罩按鈕取消當前動畫)
        beforeShowWin: [],
        beforeShowBigWin: [
            [ SlotGame.CommonSignal.BigWinSignal ]
        ],
        // BaseGame進入FreeGame轉場流程
        beforeShowFreeEnter: [
            [ FreeTriggerEffectSignal ],
            [ ScatterPlaySignal, SlotGame.CommonSignal.FreeScatterScoreSignal, ReelScatterHideSignal ],
            [ ReelRefreshSignal, ReelSymbolAllShowSignal, SlotGame.CommonSignal.FreeGameHideBtnSignal ],
            [ FreeGameChageBgSignal, SlotGame.CommonSignal.FreeGameShowTextSignal ],
            [ FreeGameTriggerSignal ]
        ],
        // FreeGame中 又中Scatter
        beforeShowFreeLuckyBonus: [
            [ ScatterPlaySignal, ReelScatterHideSignal ],
            [ FreeGameReTriggerSignal, ReelSymbolAllShowSignal ],
            [ SlotGame.CommonSignal.FreeGameReTriggerCountSignal ]
        ],
        beforeMaxRoundGetFreeCount: [],
        // 以下是秀線中獎流程
        win: [
            [ WinSymbolSignal, WinSymbolScoreSignal, WinLineSignal, ReelWinHideSignal, SlotGame.CommonSignal.FreeWinScoreSignal ]
        ],
        // 特殊贏
        winExtra: [
            [ ReelSymbolChangeSignal ],
            [
                WinBorderShowSignal, WinSymbolShowSignal, WinLineShowSignal,
                WinSymbolShowScoreSignal, ReelShowWinHideSignal, SlotGame.CommonSignal.FreeWinShowScoreSignal
            ],
            [ ReelSymbolAllShowSignal, ClearShowBorderSignal, ClearShowWinScoreSignal, ClearShowWinLineSignal ]
        ],
        // 沒贏
        noWin: [],
        // ReSpin轉前
        beforeReSpin: [],
        // free Game結算
        freeComplete: [
            [ FreeCompleteSignal ],
            [ SlotGame.CommonSignal.FreeGameHideBtnSignal ],
            [ BaseGameChageBgSignal, ReBaseGameRangeSignal ],
            [ SlotGame.CommonSignal.BaseGameShowBtnSignal, SlotGame.CommonSignal.BaseGameShowTextSignal ],
            [ FreeGameClearSignal ]
        ],
        // BonusGame流程
        beforeShowBonusGameEnter: [
            [ BonusPlaySignal, ReelBonusHideSignal ],
            [ BonusGameTriggerSignal, ReelSymbolAllShowSignal ]
        ],
        bonusIdle: [
            [ BonusGameIdleSignal ]
        ],
        bonusPlay: [
            [ BonusGamePlaySignal ]
        ],
        bonusComplete: [
            [ BonusGameCompleteSignal ]
        ]
    }
};

import Sound from 'base/Sound';

// model
import GameInfo from 'game/model/GameInfo';
// main
import GaStatesConfig from 'game/main/GaStatesConfig';
import MainStatesConfig from 'game/main/MainStatesConfig';
// 事件
import GameEvent from 'game/events/GameEvent';
import UITextEvent from 'game/events/UITextEvent';
import ReelEvent from 'game/events/ReelEvent';
import UiActionEvent from 'game/events/UiActionEvent';
import MessageEvent from 'game/events/MessageEvent';

export default class BtnControl {
    constructor(target) {
        this.targetContext = target;
    }

    // 自動按鈕判斷區
    onAutoBtnEvent(num) {
        GameInfo.isAutoPlay = true;
        GameInfo.autoPlayTimes = num;
        switch (GameInfo.gameSlotStates) {
            case MainStatesConfig.GAME_STATUS_IDLE: {
                this.targetContext.allowPlay();
                break;
            }
            case MainStatesConfig.GAME_STATUS_SHOWWIN: {
                this.targetContext.callTakeWinEvent();
                break;
            }
            default:
        }
    }

    /**
     * Button 觸發按鈕功能區
     * @param  {Object} clickType event 挾帶的參數
     */
    callBtnEvent(clickType, params) {
        switch (clickType) {
            case 'Btn_Menu': {
                Sound.playBtnSetting();
                this.targetContext.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_SHOW_MENU));
                break;
            }
            case 'Btn_Exchange': {
                Sound.playBtnSetting();
                this.targetContext.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_SHOW_EXCHANGE));
                break;
            }
            case 'Btn_Cashout': {
                Sound.playBtnSetting();
                this.targetContext.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_SHOW_CASHOUT));
                break;
            }
            case 'Btn_Setting': {
                Sound.playBtnSetting();
                this.targetContext.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_SHOW_SETTING));
                break;
            }
            case 'Btn_Help': {
                Sound.playBtnSetting();
                this.targetContext.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_SHOW_HELP));
                break;
            }
            case 'Btn_Exit': {
                Sound.playBtnSetting();
                if (!GameInfo.hasExchanged) {
                    this.targetContext.onDispatchEvent(new MessageEvent(MessageEvent.ON_SHOW_MESSAGE_EXIT));
                    return;
                }
                this.targetContext.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_CASHOUT_THEN_LEAVE));
                break;
            }
            // case 'Btn_More':
            //     Sound.playBtnSetting();
            //     this.targetContext.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_BTN_MORE));
            //     break;
            // case 'Btn_More_Close':
            //     Sound.playBtnSetting();
            //     this.targetContext.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_BTN_MORE_CLOSE));
            //     break;
            // // 關閉此頁
            // case 'Btn_Home': {
            //     Sound.playBtnSetting();
            //     // 偵測若是有 $APIAPP 與 $APIAPP.closeWebview 則使用 webview 關閉功能
            //     if (window.$APIAPP && window.$APIAPP.closeWebview) {
            //         window.$APIAPP.closeWebview();
            //         break;
            //     }
            //     window.close();
            //     break;
            // }
            // // 是否離開彈跳視窗
            // case 'Btn_Leave': {
            //     this.targetContext.isUIBusy = true;
            //     Sound.playBtnSetting();
            //     this.targetContext.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_HOME_CLICK));
            //     break;
            // }
            // // 手機版 取分/急停按鈕 (pc 版不會有)
            // case 'Btn_Mobile_Space': {
            //     // 手機版透明按鈕可以觸發Spin以外的動作
            //     if (GameInfo.gameSlotStates !== MainStatesConfig.GAME_STATUS_IDLE) {
            //         this.targetContext.keyBoard.callKeyBoardEvent();
            //     }
            //     break;
            // }
            // 開始轉動
            case 'Btn_Spin': {
                Sound.playBtnSpin();
                // 發送詢問是否可下注
                (this.targetContext.checkCredit()) ? this.targetContext.allowPlay() : this.targetContext.insufficientBalance();
                break;
            }
            // // 押滿(範例)
            // case 'Btn_Full': {
            //     GameInfo.inBetLineFull();
            //     // 顯示線段
            //     // delay  顯示線並且延遲半秒後再進行Spin Play
            //     // (延遲中記得要把全屏按鈕鎖住以免觸發 類似Btn_Spin按鈕事件)
            //     // 發送詢問是否可下注,並且發送遊玩事件
            //     if (this.targetContext.checkCredit()) {
            //         this.targetContext.allowPlay();
            //     }
            //     break;
            // }
            // 停止
            case 'Btn_Stop': {
                Sound.playBtnStop();
                this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.gameStop));
                break;
            }
            // 取分
            case 'Btn_TakeWin': {
                Sound.playBtnTakeWin();
                Sound.stopWinSymbol();
                this.targetContext.callTakeWinEvent();
                break;
            }
            // // 飛牌取分
            // case 'Btn_FreeHandTakeWin': {
            //     Sound.playBtnTakeWin();
            //     Sound.stopWinSymbol();
            //     this.targetContext.callTakeWinEvent();
            //     break;
            // }
            // // Boost 狀態
            // case 'Btn_Boost':
            //     Sound.playBtnAuto();
            //     if (!this.targetContext.checkCredit()) {
            //         this.targetContext.insufficientBalance();
            //         return;
            //     }
            //     GameInfo.isBoostSpin = true;
            //     this.targetContext.onDispatchEvent(new ReelEvent(ReelEvent.ON_BOOST_PLAY));
            // 自動
            case 'Btn_Auto': {
                Sound.playBtnAuto();
                if (!this.targetContext.checkCredit()) {
                    this.targetContext.insufficientBalance();
                    return;
                }
                this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.gameAuto));
                this.onAutoBtnEvent(params[0]);
                break;
            }
            // 停止自動
            // case 'Btn_Boost_Stop':
            case 'Btn_AutoStop': {
                Sound.playBtnAutoStop();
                GameInfo.isAutoPlay = false;
                GameInfo.isBoostSpin = false;
                this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.gameAutoStop));
                break;
            }
            // // 設定
            // case 'Btn_Setting': {
            //     if (this.targetContext.isSpinBool) return;
            //     Sound.playBtnSetting();
            //     this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.gameSetting));
            //     break;
            // }
            // // 關閉設定介面
            // case 'Btn_Help_Return':
            //     this.targetContext.isUIBusy = false;
            //     break;
            // case 'Btn_Setting_Return': {
            //     this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.gameSettingReturn));
            //     this.targetContext.isUIBusy = false;
            //     break;
            // }
            // // 遊戲說明
            // case 'Btn_Help': {
            //     Sound.playBtnHelp();
            //     this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.gameHelp));
            //     this.targetContext.isUIBusy = true;
            //     break;
            // }
            // // 增加押線
            // case 'Btn_AddLine': {
            //     Sound.playBtnAddLine();
            //     GameInfo.addLine();
            //     this.targetContext.onDispatchEvent(new UITextEvent(UITextEvent.ON_TEXT_UPDATE));
            //     break;
            // }
            // // 減少押線
            // case 'Btn_SubLine': {
            //     Sound.playBtnSubLine();
            //     GameInfo.subLine();
            //     this.targetContext.onDispatchEvent(new UITextEvent(UITextEvent.ON_TEXT_UPDATE));
            //     break;
            // }
            // // 增加押注
            // case 'Btn_AddBet': {
            //     Sound.playBtnAddBet();
            //     GameInfo.addStepBet();
            //     this.targetContext.onDispatchEvent(new UITextEvent(UITextEvent.ON_TEXT_UPDATE));
            //     break;
            // }
            // // 減少押注
            // case 'Btn_SubBet': {
            //     GameInfo.subStepBet();
            //     this.targetContext.onDispatchEvent(new UITextEvent(UITextEvent.ON_TEXT_UPDATE));
            //     break;
            // }
            // // (目前狀態為Sound開放) 點選此按鈕的功能會做切回Sound關閉
            // case 'Btn_SoundOn': {
            //     Sound.mute();
            //     this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.soundOff));
            //     Sound.isMuteSound = true;
            //     break;
            // }
            // // (目前狀態為Sound關閉) 點選此按鈕的功能會做切回Sound開啟
            // case 'Btn_SoundOff': {
            //     Sound.unMute();
            //     this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.soundOn));
            //     Sound.isMuteSound = false;
            //     break;
            // }
            // // jackpot取分
            // case 'Btn_JpTakeWin': {
            //     Sound.playBtnTakeWin();
            //     this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.gameJpTakeWin));
            //     break;
            // }
            // // 顯示jackpot分數按鈕(糖果派對系列)
            // case 'Btn_Jackpot': {
            //     Sound.playBtnSetting();
            //     this.targetContext.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_SHOW_JACKPOT_BTN));
            //     break;
            // }
            // // 關閉提示訊息
            // case 'Btn_Message_Close':
            //     this.targetContext.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_MESSAGE_CLOSE));
            //     break;
            // // 細單
            // case 'Btn_History':
            //     Sound.playBtnSetting();
            //     this.targetContext.onDispatchEvent(new GameEvent(GaStatesConfig.gameHistory));
            //     // this.targetContext.isUIBusy = true;
            //     break;
            // // 飛牌按鈕
            // case 'Btn_FreeHand': {
            //     Sound.playBtnSpin();
            //     this.targetContext.setGameInfoActionMode({ value: 1 });
            //     this.targetContext.allowPlay();
            //     break;
            // }
            // // 模式按鈕(Boost或自動)
            // case 'Btn_Mode': {
            //     Sound.playBtnSetting();
            //     this.targetContext.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_BTN_MODE));
            //     break;
            // }
            // // 模式關閉按鈕(Boost或自動)
            // case 'Btn_Mode_Close': {
            //     Sound.playBtnSetting();
            //     this.targetContext.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_BTN_MODE_CLOSE));
            //     break;
            // }
            case 'Btn_Bet_Value': {
                Sound.playBtnSetting();
                GameInfo.setBetByValue(params[0]);
                this.targetContext.onDispatchEvent(new UITextEvent(UITextEvent.ON_TEXT_UPDATE));
                break;
            }
            case 'Btn_More_Bet': {
                Sound.playBtnSetting();
                this.targetContext.onDispatchEvent(new UITextEvent(UITextEvent.ON_BET_UPDATE_LIST));
                break;
            }
            // // 押注按鈕(增加或是減少)
            // case 'Btn_Bet': {
            //     Sound.playBtnSetting();
            //     this.targetContext.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_BTN_BET));
            //     break;
            // }
            // // 押注關閉按鈕(增加或是減少)
            // case 'Btn_Bet_Close': {
            //     Sound.playBtnSetting();
            //     this.targetContext.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_BTN_BET_CLOSE));
            //     break;
            // }
            // // 關閉選單的影藏按鈕
            // case 'Btn_Hide_Close': {
            //     this.targetContext.onDispatchEvent(new UiActionEvent(UiActionEvent.ON_BTN_HIDE_CLOSE));
            //     break;
            // }
            default:
        }
    }
}

// Base
import { SlotGame } from 'slot-base';
// 流程 Control
// import BaseStatusControl from 'js/control/BaseStatusControl';
// import FreeStatusControl from 'js/control/FreeStatusControl';
// import BonusStatusControl from 'js/control/BonusStatusControl';
// 基本 Control
// import BtnControl from 'js/control/BtnControl';

// View
import SymbolBorderView from 'js/view/SymbolBorderView';
import BackGround from 'js/view/BackGround';
import ReelView from 'js/view/ReelView';
// import WindowFrameView from 'js/view/WindowFrameView';
import LineView from 'js/view/LineView';
import SymbolEffect from 'js/view/SymbolEffect';
import FreeGameView from 'js/view/FreeGameView';
import BonusView from 'js/view/BonusView';
import WinTextView from 'js/view/WinTextView';
import CharacterView from 'js/view/CharacterView';
import LogoView from 'js/view/LogoView';
// import HelpView from 'js/view/HelpView';
import BtnView from 'js/view/BtnView';
import BigWinView from 'js/view/BigWinView';
import TextView from 'js/view/TextView';
// 二次算分使用 (只支援Slot-Base 2.3.2以上優化版本)
// import WinSymbolShowSignal from 'js/signal/windata/WinSymbolShowSignal';

export default class SymbolPage extends SlotGame.SlotBase {
    constructor(game) {
        super(game);
        // View底層註冊與創建
        this.uiApp.uiRegister(BackGround);          // 背景層
        this.uiApp.uiRegister(ReelView);            // 轉軸層
        this.uiApp.uiRegister(LogoView);            // Logo
        // this.uiApp.uiRegister(WindowFrameView);     // 視窗框
        this.uiApp.uiRegister(SymbolEffect);        // Symbol動畫層
        this.uiApp.uiRegister(CharacterView);       // 角色層
        // this.uiApp.uiRegister(SymbolBorderView);    // Symbol中獎邊框層
        this.uiApp.uiRegister(LineView);            // 連線線段層 for line game
        this.uiApp.uiRegister(WinTextView);         // 連線線段層
        // this.uiApp.uiRegister(BonusView);           // Bonus
        this.uiApp.uiRegister(FreeGameView);        // Free 特效層
        this.uiApp.uiRegister(TextView);
        // this.uiApp.uiRegister(HelpView);      // 幫助層
        this.uiApp.uiRegister(BtnView);      // 按鈕層
        this.uiApp.uiRegister(BigWinView);
        // this.uiApp.uiRegister(SlotGame.CommonView.ExchangeView);      // 兌換
        // this.uiApp.uiRegister(SlotGame.CommonView.CashoutView);      // 匯出
        this.uiApp.uiRegister(SlotGame.CommonView.MessageView);      // 訊息
        this.uiApp.uiRegister(SlotGame.CommonView.SettingView);      // 設定
        this.uiApp.uiRegister(SlotGame.CommonView.HelpView);      // 幫助

        this.bool = false;

        // 二次算分使用 (只支援Slot-Base 2.3.2以上優化版本)
        this.takeWinIng = false;
    }

    // # 以下可以複寫修改各遊戲特色需求

    // 二次算分使用 (只支援Slot-Base 2.3.2以上優化版本)
    // setResultShowStates(data) {
    //     // 必免取分時間差
    //     this.takeWinIng = false;
    //     super.setResultShowStates(data);
    // }

    // 二次算分使用 (只支援Slot-Base 2.3.2以上優化版本)
    // getExSignalStates() {
    //     // 必免取分時間差
    //     if (this.takeWinIng !== WinSymbolShowSignal.isCallEvent) {
    //         this.takeWinIng = WinSymbolShowSignal.isCallEvent;
    //         return WinSymbolShowSignal.isCallEvent;
    //     }
    //     return false;
    // }

    // 主流程控制初始化(採用自己複寫)
    // gameControlInit() {
    //     // 註冊需要判斷的總集
    //     const controlActionAry = [
    //         SlotGame.BaseStatusControl, SlotGame.FreeStatusControl, SlotGame.BonusStatusControl
    //     ];
    //     this.createControl(controlActionAry);
    // }

    // 流程控制初始化(control)
    // controlInit() {
    //     // 建立基本控制器功能
    //     this.keyBoard = new SlotGame.KeyBoardControl(this);
    //     this.btnctrl = new SlotGame.BtnControl(this);
    // }
}

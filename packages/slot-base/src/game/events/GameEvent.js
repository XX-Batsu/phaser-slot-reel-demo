import Event from 'base/Event';
import GameInfo from 'game/model/GameInfo';

export default class GameEvent extends Event {
    constructor(type) {
        super(GameEvent.STATES);
        // 以下為事件夾帶參數(使用者自定)
        // 遊戲狀態
        this.statesType = type;
        // 是否有切到自動模式
        this.isAutoPlay = GameInfo.isAutoPlay;
        // 是否為FreeGame模式
        this.isFreePlay = GameInfo.isFreeSpin;
        // 是否為Respin模式
        this.isRespinPlay = GameInfo.isReSpin;
        // 是否為BonusGame模式
        this.isBonusPlay = GameInfo.isBonusSpin;
        // 是否為加速模式
        this.isBoostPlay = GameInfo.isBoostSpin;
        // 初始化Range資料
        this.gameInfoRange = GameInfo.inGameRangeData.baseStrip[GameInfo.extraBet];
        // 是否顯示飛牌icon
        this.isShowFreehand = GameInfo.isShowFreehand;
        // 是否可飛牌(用於將飛牌icon返灰不能點擊)
        this.isAllowFreehand = GameInfo.isAllowFreehand;
        // spin模式 [0:一般模式 1:飛牌模式]
        this.actionMode = GameInfo.actionMode;
    }
}
GameEvent.STATES = 'currentGameStates';

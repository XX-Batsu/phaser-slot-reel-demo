import GameFlowBase from './base/GameFlowBase';
// 封包編號
import SocketStatesConfig from './SocketStatesConfig';
// 封包註冊區
import ConfigData from './handle/get/ConfigData';
import StripData from './handle/get/StripData';
import PlayData from './handle/get/PlayData';
import IdleData from './handle/get/IdleData';
// Free Game
import FreeStartData from './handle/get/FreeStartData';
import FreePlayData from './handle/get/FreePlayData';
import FreeCompleteData from './handle/get/FreeCompleteData';
// Bonus Game
import BonusStartData from './handle/get/BonusStartData';
import BonusPlayData from './handle/get/BonusPlayData';
import BonusCompleteData from './handle/get/BonusCompleteData';
// Jackpot
import JackpotStartData from './handle/get/JackpotStartData';
import JackpotPlayData from './handle/get/JackpotPlayData';
import JackpotCompleteData from './handle/get/JackpotCompleteData';

export default class GameFlow extends GameFlowBase {
    // 封包訊息註冊區
    initEventMsg() {
        // Base Game
        this.addSocketData(SocketStatesConfig.ON_CONFIG, ConfigData);
        this.addSocketData(SocketStatesConfig.ON_STRIP, StripData);
        this.addSocketData(SocketStatesConfig.ON_BASE_PLAY, PlayData);
        this.addSocketData(SocketStatesConfig.ON_RESPIN_PLAY, PlayData);
        this.addSocketData(SocketStatesConfig.ON_BASE_IDLE, IdleData);
        // Free Game
        this.addSocketData(SocketStatesConfig.ON_FREE_START, FreeStartData);
        this.addSocketData(SocketStatesConfig.ON_FREE_PLAY, FreePlayData);
        this.addSocketData(SocketStatesConfig.ON_FREE_COMPLETE, FreeCompleteData);
        // Bonus Game
        this.addSocketData(SocketStatesConfig.ON_BONUS_GAME_START, BonusStartData);
        this.addSocketData(SocketStatesConfig.ON_BONUS_GAME_PLAY, BonusPlayData);
        this.addSocketData(SocketStatesConfig.ON_BONUS_GAME_COMPLETE, BonusCompleteData);
        // Jackpot
        this.addSocketData(SocketStatesConfig.ON_JACKPOT_GAME_START, JackpotStartData);
        this.addSocketData(SocketStatesConfig.ON_JACKPOT_GAME_PLAY, JackpotPlayData);
        this.addSocketData(SocketStatesConfig.ON_JACKPOT_GAME_COMPLETE, JackpotCompleteData);
    }
}

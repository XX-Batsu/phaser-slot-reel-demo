export default class SocketStatesConfig {}
// 開給前端接口使用
// credit
SocketStatesConfig.ON_GAME_CREDIT = 'GAME_ON_CREDIT';
// jackpot pool
SocketStatesConfig.ON_JACKPOT_POOL = 'GAME_ON_JACKPOT_POOL';
// 通用Error
SocketStatesConfig.ON_GAME_ERROR = 'GAME_ON_ERROR';

SocketStatesConfig.LOGIN = 1;
SocketStatesConfig.CREDIT = 100;
SocketStatesConfig.JACKPOT_POOL = 10;
SocketStatesConfig.GAME_CONFIG = 21;
SocketStatesConfig.GAME_FLOW = 22;
SocketStatesConfig.FREE_GAME_FLOW = 23;
SocketStatesConfig.BONUS_GAME_FLOW = 24;
SocketStatesConfig.JACKPOT_GAME_FLOW = 25;
// config
SocketStatesConfig.SEND_CONFIG = 11;
SocketStatesConfig.ON_CONFIG = 111;
// strip
SocketStatesConfig.SEND_STRIP = 12;
SocketStatesConfig.ON_STRIP = 112;
// base game
SocketStatesConfig.SEND_BASE_PLAY = 31;
SocketStatesConfig.ON_BASE_PLAY = 131;
SocketStatesConfig.SEND_BASE_IDLE = 32;
SocketStatesConfig.ON_BASE_IDLE = 132;
// respin play
SocketStatesConfig.SEND_RESPIN_PLAY = 33;
SocketStatesConfig.ON_RESPIN_PLAY = 133;
// free game
SocketStatesConfig.SEND_FREE_START = 41;
SocketStatesConfig.ON_FREE_START = 141;
SocketStatesConfig.SEND_FREE_PLAY = 42;
SocketStatesConfig.ON_FREE_PLAY = 142;
SocketStatesConfig.SEND_FREE_COMPLETE = 43;
SocketStatesConfig.ON_FREE_COMPLETE = 143;

// Bonus Game
SocketStatesConfig.SEND_BONUS_GAME_START = 44;
SocketStatesConfig.ON_BONUS_GAME_START = 144;
SocketStatesConfig.SEND_BONUS_GAME_PLAY = 45;
SocketStatesConfig.ON_BONUS_GAME_PLAY = 145;
SocketStatesConfig.SEND_BONUS_GAME_COMPLETE = 46;
SocketStatesConfig.ON_BONUS_GAME_COMPLETE = 146;

// Jackpot
SocketStatesConfig.SEND_JACKPOT_GAME_START = 51;
SocketStatesConfig.ON_JACKPOT_GAME_START = 151;
SocketStatesConfig.SEND_JACKPOT_GAME_PLAY = 52;
SocketStatesConfig.ON_JACKPOT_GAME_PLAY = 152;
SocketStatesConfig.SEND_JACKPOT_GAME_COMPLETE = 53;
SocketStatesConfig.ON_JACKPOT_GAME_COMPLETE = 153;

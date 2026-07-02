export default class Config {}

Config.GAME_WIDTH = 1680;
Config.GAME_HEIGHT = 944;
// Symbol Size
Config.SYMBOL_WIDTH = 209;
Config.SYMBOL_HEIGHT = 209; // 183 >>>5X4 , 243 >>> 5X3
// Symbol 區塊的左上角座標
Config.REEL_OFFSET_X = 321;
Config.REEL_OFFSET_Y = 155;
// Symbol Reel 間隔距離
Config.SPACE_BASE_SYMBOLS_X = 0;
Config.SPACE_BASE_SYMBOLS_Y = 0;
// 3X1滾輪特色，額外調整遮罩的範圍和位移，使其露出當前symbol前後一個的邊緣。
Config.SYMBOL_PADDING_X = 0;
Config.SYMBOL_PADDING_Y = 0;
// 聯名 Logo 圖片網址
Config.COBRAND_DATA = {};

// --------- line Json -----------
// 每條線顯示的顏色
Config.LINE_COLOR = [];

// --------- settings Json -----------
// 大獎階段倍數
Config.STEP_RATIO = [];
// 大獎圖片Y軸偏移
Config.AWARD_IMG_Y_OFFSET = -200;
// 大獎分數Y軸偏移
Config.AWARD_SCORE_Y_OFFSET = 0;
// 大獎分數背景顯示
Config.AWARD_BG_SHOW = false;
// 大獎分數背景縮放
Config.AWARD_BG_SCALE = 1;
// 大獎分數背景是否閃爍
Config.AWARD_BG_TWEEN = false;
// 大獎出現後的遮罩顏色
Config.AWARD_OVERLAY_COLOR = 0x000000;
// 大獎出現後的遮罩透明度
Config.AWARD_OVERLAY_ALPHA = 0.6;
// 大獎每一階段分數的Y軸微調定位
Config.AWARD_STEP_OFFSET = -10;

// 第一滾輪滾過多少Symbol後開始接結果;
Config.FIRST_ROLL_SYMBOL_COUNT = 5;
// 每個滾輪停止至下個滾輪之間的Symbol數;
Config.DIFF_PASS_COUNT_EACH_REEL = 6;
// 每秒跑過多少Symbol , 如果要調高速度要改SymbolReelMediator -> SLOW_ADD_ROLLING_SYMBOL()
Config.ROLLING_SYMBOL = 25;
// 急停要跑過多少 symbol
Config.EMG_ROLLING_SYMBOL = 3;
// 一般停止時經過需要跑過多少個
Config.ROLLING_SYMBOL_COUNT = 6;
// 瞇牌每秒跑過多少Symbol
Config.SLOW_ROLLING_SYMBOL = 8;
// 瞇牌要跑過多少Symbol
Config.SLOW_ROLLING_PASS_COUNT = 10;
// 瞇牌急停要跑過多少Symbol
Config.SLOW_EMG_ROLLING_PASS_COUNT = 12;
// 進Damping時每秒跑幾個Symbol
Config.DAMPING_SYMBOL_CONUT = 4;
// Damping位移量
Config.DAMPING_DISTANCE = 70;
// Reel slow時的速度緩衝區採用的取樣數目(分段變慢),此 value 越大則越慢變成 SlowSpeed
Config.BUFFER_SPEED_STEP = 5;
// 設置DampingUP的基數
Config.DAMPING_UP = 0.3;
// 瞇牌急停基數
Config.SLOW_EMG_STOP_SEC = 1.4;
// 急停基數
Config.EMG_STOP_SEC = 0.5;
// Damping急停基數
Config.RESULT_EMG_STOP_SEC = 0.3;
// ReSpin 停止模式 0 : 無
Config.RESPIN_MODE = 0;

// 輪閃時的秀線時間
Config.SINGLE_LINE_SEC = 3;
Config.ALL_LINE_SEC = 1;
Config.FREE_LINE_SEC = 2.5;

// Scater Win 是否顯示線段 true : 顯示 , false :不顯示 [輪播單線使用]
Config.IS_SCA_SHOW_LINE = false;
// Scatter Win 是否顯示框 true : 顯示 , false :不顯示  [輪播單線使用]
Config.IS_SCA_SHOW_BORDER = false;
// Scatter Win 在秀全線時是否顯示框 0 : 不秀 , 1 : 秀 , 2 : 中S 但只有1條線就不秀框 多線時有S就秀框(方便數量多時提示S中獎位置) 動態
Config.SCA_SHOWALL_BORDER_MODE = 2;
// 未中獎的 symbol 隱藏方式 true : 遮罩 / false : tint
Config.IS_SYMBOL_MASK = true;
// 中獎輪閃時，沒有動畫的 symbol 是否做 tween 表現
Config.IS_SYMBOL_TWEENING = true;
// 中獎時 框與線是否閃爍
Config.IS_SHOW_WIN_SHINE = false;
// 贏分時秀全線時需不需要秀線 true : 秀全線 , false : 不秀全線
Config.SHOW_ALL_WIN_LINE = true;
// Hit Scater時秀動畫要進入FreeGame Trigger的過場需要顯示Hit Scatter中獎金額 0 : 不秀(顯示功能用途) , 1 :秀分 , 2 : Symbol上不秀分文字分數要秀分
Config.HIT_SCATTER_SHOW_SCORE = 2;
// 結算後返回BaseGame時 分數要加總在一般秀線Scatter的分數上
Config.FREE_ADDSOCRE_SCATTER_WIN = true;
// TextView跑分設定 0 : 無條件跑分 , 1 : 不跑分直接顯示 , 2 : 只有中BigWin時不顯示跑分, 3 : 只有中BigWin才跑分
Config.TEXT_WIN_RUNSCORE_MODE = 2;
// TextView跑分設定 是否有階段性跑分會放大 true : 開啟 , false : 不開啟
Config.TEXT_WIN_RUNSCORE_STEP = false;
// 當有任何遊戲進行中,是否可以打開Help      true : 可以 , false : 不可以
Config.IS_GAMEING_HELP_OPEN = false;
// 單線贏得分數顯示模式(層級顯示)   0 : Symbol , 1 : Border 2 : Line , 3 : scatter秀在Symbol其他時候秀在Border , 4 : scatter秀在Symbol其他時候秀在Line
Config.WIN_PRIZE_SHOW_MODE = 4;
// FREE GAME 結算畫面離開模式 0 : 自動離開 , 1 : 手動按下 , 2 : 兩者皆可
Config.IS_FREE_CONGRATS_MODE = 2;
// FREE GAME SPIN是否播放SPIN音效  true : 播放 , false : 不播放
Config.IS_FREE_SPINSOUND_PLAY = false;

Config.TRANSITIONS_EFFECT_SEC = 1;
// 幫助頁數
Config.HELP_PAGE_NUM = 3;
// 賠率表規則頁面賠率資料
Config.PAYTABLE_DATA = [];
// 圖標規則頁面賠率資料
Config.SYMBOL_PAYTABLE_DATA = [];

// 設置 特殊標記播放動畫
Config.ANIMATION_SYMBOL = [];
// 設置 配置播放音效的Symbol
Config.SOUND_SYMBOL = [];
// 是否可拍掉Extra秀分動畫
Config.IS_CLEAR_EXTRA_EF = true;

// 0: max spin 1: max round
Config.FREEGAME_TYPE = 0;
// --------- 以下為不能開Json格式 [Start] (這是由後端傳來的設定遊戲特色) ------------
// 遊戲連線方式 0 : line , 1 : way
Config.GAME_WIN_MODE = 1;
// 遊戲ID
Config.GAME_ID = 4;
// EXTRA BET
Config.EXTRA_BET = 0; // 0 or 1m
// min bet
Config.MIN_BET = 1;
// 總共可以選擇的bet
Config.BET_SETTING_LIST = [ 1, 2, 4, 6, 10, 20, 40, 60 ];
// 預設bet
Config.BET_DEFAULT = 0;
// Reel  Num
Config.NUM_REELS = 5;
Config.NUM_ROWS = 3;
// 最低投注設定(1.5分/線)
Config.BASE_ODDS = 1;
// 是否有整條的 wild 動畫
Config.IS_WILD_GROUP = false;
// 是否雙線模式
Config.DOUBLE_LINE_MODE = false;
// 此款遊戲F是否可以進入FreeGame (改由前端設定此款遊戲是否有免費遊戲)
Config.IN_FREE_GAME = false;
// 此款遊戲是否有BonusGame
Config.IN_BONUS_GAME = false;
// 免費模式是否啟動讀取 固定設定 Range level Index位置
Config.IS_FREE_CHANGE_REEL = true;
// 是否有 respin 功能
Config.IS_RESPIN = true;
// 語系
Config.LANGUAGE = [ 'zh-tw' ];
// 選擇幣別 0 : 遊戲幣
Config.CURRENCY = 0;
// Reel 眼睛位置 Config.NUM_ROWS = 3 眼睛為 2  4/2 = 2  5/2 = 3
Config.REEL_ANCHOR = 0.3;
// 最少滾過幾個symbol可接rng
Config.MINIMUM_PASS_COUNT = 4;
// Free場次Level
Config.FREE_STAGE_LEVEL = [ 0 ];
// Free倍數 例如 x1 , x3 , x5  x10
Config.FREE_WIN_ODDS = [ 2, 3, 5, 8, 10 ];
// 剛進入Base模式時Range的設定位置
Config.BASE_RANGE_INDEX = [ 1, 1, 1, 1, 1 ];
// 剛進入免費模式時Range的設定位置
Config.ROUND_RANGE_INDEX = [ 1, 1, 1, 1, 1 ];
// Line 連線資料
Config.LINE_WIN_LIST = [];
// 需要更換的Symbol對象
Config.SYMBOL_CHANGE = [];
// 消消樂模式
Config.IS_BLOW_UP_SYMBOL = false;
// 設置標記代號 可讓該標記解讀為Wild功能
Config.SYMBOL_WILD = [ 'W1' ];
// 設置標記代號 可讓該標記解讀為SF功能 (解讀為可以進入FreeGame)
Config.SYMBOL_FREE = [];
// 設置標記代號 可讓該標記解讀為SCATTER功能(不能進入FreeGame 只有純秀分)
Config.SYMBOL_SCATTER = [];
// 分數累積的Symbol ID (FreeGame總贏分顯示在Base Game該Scater贏分累積)
Config.FREE_OVER_SCORE = [];
// 設置標記代號 可讓該標記解讀為Bonus功能
Config.SYMBOL_BONUS = [];
// 設置標記代號 可讓該標記解讀為LuckyDraw功能
Config.SYMBOL_LUCKY_DRAW = [];
// 設置標記代號 可讓該標記解讀為JackPot功能
Config.SYMBOL_JACKPOT = [];
// 設置W屬性
Config.WILD_GROUP = [];
// 有idle動畫的symbol
Config.REEL_STOP_SYMBOL_ANIMATION = [];
Config.SYMBOL_IDLE_ANIMATION = [];
Config.SYMBOL_IDLE_FPS = {};
// Lucky Draw選項索引對應值(結構by gmae)
Config.LUCKYDRAW_OPTION_VALUE = [];
// --------- 不能開Json格式 End (這是由後端傳來的設定遊戲特色) -------

// 設定Symbol遮罩範圍
Config.PageMaxWidth = (((Config.SYMBOL_WIDTH + Config.SYMBOL_PADDING_X) * Config.NUM_REELS) + (Config.SPACE_BASE_SYMBOLS_X * (Config.NUM_REELS - 1))) | 0;
Config.PageMaxHeight = (((Config.SYMBOL_HEIGHT + Config.SYMBOL_PADDING_Y) * Config.NUM_ROWS) + (Config.SPACE_BASE_SYMBOLS_Y * (Config.NUM_ROWS - 1))) | 0;

// Socket 除錯使用 封包編號識別用
Config.DebugCount = 0;

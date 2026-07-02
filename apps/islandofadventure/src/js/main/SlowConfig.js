export default class SlowConfig {}
/**
 * Slow 瞇牌中是否可以觸發急停
 * 0:可急停
 * 1:一旦出現瞇牌後面不可急停(在顯示瞇牌之前可急停)
 * 2:不可急停,但該瞇牌滾完後 後面還有滾動輪一起急停
 * 3:咪牌那輪不停,咪牌後面全停
 */
SlowConfig.IS_SLOW_EMGSTOP_MODE = 1;
// Scatter 每顆是否會Hit
SlowConfig.IS_SCATTER_HIT = true;

// 當freeSlow為空時,資料是否註冊為空值 true : 空值 , false : 預設值
SlowConfig.IS_FREE_EMPTY = true;

/**
 * 瞇牌註冊器 (Robert test) REEL_INDEX >>> 1 ~ 4 [咪牌不會判斷最後一軸]
 * replaceWild       註冊的Symbol是否可以讓Wild取代  (Line、Way Game使用）
 * isOnLine          是否要在線數上 true: Symbol要在線條上的路線才算中, false : 無視線條路線  (LineGame使用, WayGame則不受理)
 * slowReelInx       有連續中時,達到第幾輪後開始瞇牌  0:無 ,  負值 -1 ~ -n:  負為'任ㄧ輪'n為需要中幾個, 正值 1~n: 連續中需要達到幾個後才瞇牌(Line、Way Game使用; 依照遊戲輪數設定)
 * wayWinCount       way,計算每輪Ｗin的次數      0: 無 ,         1~n: 有次數
 * wayWinReelEnd     way從頭計算到第幾輪(一定要到第幾輪的合計連續各數)   0: 無 ,         1~n: 需計算多少輪數(Way Game使用; 依照遊戲輪數設定)
 * wayReelRange      只會在這幾個軸去做動作，包含瞇牌或是判斷都只會在這幾軸內
 */
SlowConfig.SYMBOL_SLOW_DATA = {
    maxSpinSlow: [
        // {
        //     symbolID: [ 'W' ],
        //     replaceWild: false,
        //     isGroup: false,
        //     reelSlow: {
        //         isOnLine: true,
        //         slowReelInx: 4,
        //         slowReelRange: [ 1, 2, 3, 4, 5 ]
        //     },
        //     waySlow: {
        //         wayWinCount: 0,
        //         wayWinReelEnd: 0,
        //         wayReelRange: []
        //     }
        // }
    ],
    freeSlow: [
    ],
    normalSlow: [
        {
            symbolID: [ 'M1' ],
            replaceWild: true,
            isGroup: false,
            reelSlow: {
                isOnLine: false,
                slowReelInx: 3,
                slowReelRange: [ 3, 4, 5 ]
            },
            waySlow: {
                wayWinCount: 1,
                wayWinReelEnd: 2,
                wayReelRange: [ 1, 2, 3, 4, 5 ]
            }
        },
        {
            symbolID: [ 'M2' ],
            replaceWild: true,
            isGroup: false,
            reelSlow: {
                isOnLine: false,
                slowReelInx: 3,
                slowReelRange: [ 3, 4, 5 ]
            },
            waySlow: {
                wayWinCount: 1,
                wayWinReelEnd: 2,
                wayReelRange: [ 1, 2, 3, 4, 5 ]
            }
        },
        {
            symbolID: [ 'M3' ],
            replaceWild: true,
            isGroup: false,
            reelSlow: {
                isOnLine: false,
                slowReelInx: 3,
                slowReelRange: [ 3, 4, 5 ]
            },
            waySlow: {
                wayWinCount: 1,
                wayWinReelEnd: 2,
                wayReelRange: [ 1, 2, 3, 4, 5 ]
            }
        },
        {
            symbolID: [ 'M4' ],
            replaceWild: true,
            isGroup: false,
            reelSlow: {
                isOnLine: false,
                slowReelInx: 3,
                slowReelRange: [ 3, 4, 5 ]
            },
            waySlow: {
                wayWinCount: 1,
                wayWinReelEnd: 2,
                wayReelRange: [ 1, 2, 3, 4, 5 ]
            }
        },
        {
            symbolID: [ 'M5' ],
            replaceWild: true,
            isGroup: false,
            reelSlow: {
                isOnLine: false,
                slowReelInx: 3,
                slowReelRange: [ 3, 4, 5 ]
            },
            waySlow: {
                wayWinCount: 1,
                wayWinReelEnd: 2,
                wayReelRange: [ 1, 2, 3, 4, 5 ]
            }
        },
        {
            symbolID: [ 'N1' ],
            replaceWild: true,
            isGroup: false,
            reelSlow: {
                isOnLine: false,
                slowReelInx: 3,
                slowReelRange: [ 3, 4, 5 ]
            },
            waySlow: {
                wayWinCount: 1,
                wayWinReelEnd: 2,
                wayReelRange: [ 1, 2, 3, 4, 5 ]
            }
        },
        {
            symbolID: [ 'N2' ],
            replaceWild: true,
            isGroup: false,
            reelSlow: {
                isOnLine: false,
                slowReelInx: 3,
                slowReelRange: [ 3, 4, 5 ]
            },
            waySlow: {
                wayWinCount: 1,
                wayWinReelEnd: 2,
                wayReelRange: [ 1, 2, 3, 4, 5 ]
            }
        },
        {
            symbolID: [ 'N3' ],
            replaceWild: true,
            isGroup: false,
            reelSlow: {
                isOnLine: false,
                slowReelInx: 3,
                slowReelRange: [ 3, 4, 5 ]
            },
            waySlow: {
                wayWinCount: 1,
                wayWinReelEnd: 2,
                wayReelRange: [ 1, 2, 3, 4, 5 ]
            }
        },
        {
            symbolID: [ 'N4' ],
            replaceWild: true,
            isGroup: false,
            reelSlow: {
                isOnLine: false,
                slowReelInx: 3,
                slowReelRange: [ 3, 4, 5 ]
            },
            waySlow: {
                wayWinCount: 1,
                wayWinReelEnd: 2,
                wayReelRange: [ 1, 2, 3, 4, 5 ]
            }
        }
    ]
};

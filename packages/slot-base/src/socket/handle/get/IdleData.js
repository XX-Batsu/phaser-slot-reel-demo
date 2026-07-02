export default class IdleData {
    /**
     * 資料處理
     * @param  {Object} result     server 拿到的 json 資料
     */
    constructor(result) {
        return {
            // 錯誤碼
            ErrorCode: result.ErrorCode,
            // 下一回合是否可飛牌
            IsAllowFreeHand: result.IsAllowFreeHand
        };
    }
}

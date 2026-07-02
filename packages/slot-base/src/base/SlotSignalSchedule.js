import GlobalEvent from 'base/GlobalEvent';

export default class SlotSignalSchedule extends Phaser.Signal {
    constructor() {
        super();
        SlotSignalSchedule.instance = this;
        // 排程 array
        this.beforeShowWinData = [];
        // 目前執行序號
        this.beforeShowWinIndex = 0;
        // 執行次數
        this.beforeShowWinCount = 0;
    }

    // 由 註冊動畫事件序列 觸發
    beforeShowWinRegister(value) {
        this.beforeShowWinData = value;
    }

    beforeShowWin() {
        const len = this.beforeShowWinData.length;
        if (len === 0) {
            // 結束排程管理.
            this.overBeForeComplete();
            return;
        }

        for (let i = 0; i < len; i++) {
            if (i === this.beforeShowWinIndex) {
                this.beforeShowWinCount = this.beforeShowWinData[i].length;
                // console.log(`發布註冊事件:${this.beforeShowWinCount}`);
                this.beforeShowWinData[i].forEach((item) => {
                    const ClassEventObj = item;
                    GlobalEvent.dispatchEvent(new ClassEventObj());
                });
                break;
            }
        }
    }

    // 表演結束要回call
    beforeShowWinComplete() {
        // 每次播放一次事件 index - 1
        this.beforeShowWinCount --;
        // console.log(`剩餘次數 : ${this.beforeShowWinCount}` , `目前流程階段:${this.beforeShowWinIndex}`, this.beforeShowWinData.length-1);
        // 沒有要播放的事件了
        if (this.beforeShowWinCount !== 0) {
            return;
        }
        this.beforeShowWinIndex++;
        if (this.beforeShowWinIndex < this.beforeShowWinData.length) {
            // console.log('切換下一個動畫階段:', this.beforeShowWinIndex, this.beforeShowWinData.length-1);
            this.beforeShowWin();
            return;
        }
        // 結束排程管理
        this.overBeForeComplete();
    }

    static showOverCallBack() {
        SlotSignalSchedule.instance.beforeShowWinComplete();
    }

    overBeForeComplete() {
        // console.log('beforeShowWinComplete 結束排程管理');
        this.beforeShowWinIndex = 0;
        // 這邊要做異步處理 先註冊後發布
        let timer = setTimeout(() => {
            this.dispatch();
            clearTimeout(timer);
            timer = null;
        }, 0);
    }

    onBeforeAllComplete(listener, context) {
        this.add(listener, context);
    }
}

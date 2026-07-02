import GlobalEvent from 'base/GlobalEvent';
import KeyCtlCenter from 'tools/KeyCtlCenter';

export default class PPAP {
    constructor(tempoAry, ReelEvent, GameEvent, GaStatesConfig) {
        this.tempoAry = tempoAry;
        this.ReelEvent = ReelEvent;
        this.GameEvent = GameEvent;
        this.GaStatesConfig = GaStatesConfig;


        this.boostTextOn = '急停ON';
        this.boostTextOff = '急停OFF';

        this.tempoObj = {
            FIRST_ROLL_SYMBOL_COUNT: '第一軸要跑過多少個數',
            DIFF_PASS_COUNT_EACH_REEL: '每一軸的個數差',
            ROLLING_SYMBOL: '每秒跑過多少個數',
            ROLLING_SYMBOL_COUNT: '普通停止要跑過多少個數',
            EMG_ROLLING_SYMBOL: '急停要跑過多少個數',
            SLOW_ROLLING_SYMBOL: '瞇牌每秒跑過多少個數',
            SLOW_ROLLING_PASS_COUNT: '瞇牌要跑過多少個數',
            SLOW_EMG_ROLLING_PASS_COUNT: '瞇牌急停要跑過多少個數',
            DAMPING_SYMBOL_CONUT: '進 Damping 時每秒個數',
            DAMPING_DISTANCE: 'Damping位移量',
            BUFFER_SPEED_STEP: '瞇牌變慢的緩衝需要幾階段',
            DAMPING_UP: '設置DampingUP的基數',
            SLOW_EMG_STOP_SEC: '瞇牌急停基數',
            EMG_STOP_SEC: '急停基數',
            RESULT_EMG_STOP_SEC: 'Damping急停基數'
        };

        this.json = this.tempoAry[0].game.cache.getJSON('external').settings;

        this.createHtml();

        GlobalEvent.addEventListener(this.ReelEvent.ON_REELBAR_COMPLETE, this.setTotalSec, this);
        GlobalEvent.addEventListener(this.GameEvent.STATES, this.gameSlotStates, this);
    }

    /**
     * 更改秒數顯示
     */
    setTotalSec() {
        const $sec = document.querySelector('#js-total-sec');
        // 計算滾輪秒數
        $sec.innerHTML = `${Math.floor((new Date() - this.timeDate) / 1000 * 100) / 100} s`;
    }

    /**
     * 遊戲狀態
     * @param {Object} evt 事件資料
     */
    gameSlotStates(evt) {
        switch (evt.statesType) {
            case this.GaStatesConfig.gameSpin:
                // 記錄滾輪秒數開始
                this.timeDate = new Date();
                break;
            default:
        }
    }

    // 創造設定頁面
    createHtml() {
        this.$wrap = document.createElement('div');
        this.$wrap.id = 'js-wrap';
        this.$wrap.className = 'wrap';

        this.$resultWrap = document.createElement('div');
        this.$resultWrap.id = 'js-result-wrap';
        this.$resultWrap.className = 'result-wrap';

        this.$result = document.createElement('div');

        document.body.appendChild(this.$wrap);
        document.body.appendChild(this.$resultWrap);

        this.$resultWrap.innerHTML = `
            <div>--- 請把以下 Code 貼給前端工程師 ---</div>
            <div id="js-result"></div>
            <button onmousedown="this.style.background='#008CBA'" onmouseup="this.style.background='#FFF'" style="outline:none; cursor: pointer;width: 65px; height: 40px; border-radius: 10px; border: 1px solid #888; background: #FFF; position: absolute; right:20px; bottom:20px;" id="js-copy-close">關閉</button>
        `;

        this.$result = document.querySelector('#js-result');

        let html = '<div style="padding:5px;">可按 Z 切換顯示 / 隱藏</div>';
        Object.keys(this.tempoObj).forEach((key) => {
            html += `
                <div class="list">
                    <label>${this.tempoObj[key]}</label>
                    <input id="js-${key}" placeholder="${this.json[key]}" value="${this.json[key]}" style="float:right;text-align:center;width:50px;border:1px solid #CCC;border-radius:5px;">
                </div>
            `;
        });

        html += `
            <div class="msg">轉輪停止過程總共花費</div>
            <div id="js-total-sec" style="padding:0 10px 10px;">0.00 s</div>
            <button onmousedown="this.style.background='#008CBA'" onmouseup="this.style.background='#FFF'" class="button" id="js-export">輸出</button>
            <button onmousedown="this.style.background='#008CBA'" onmouseup="this.style.background='#FFF'" class="button" id="js-reset">重置</button>
            <button onmousedown="this.style.background='#008CBA'" onmouseup="this.style.background='#FFF'" class="button" id="js-ok">確認</button>
            <button onmousedown="this.style.background='#008CBA'" onmouseup="this.style.background='#FFF'" class="button" id="js-boost">${this.boostTextOff}</button>
        `;

        this.$wrap.innerHTML = html + this.insertCss();

        this.setBtnEvent();
        this.setKeyboardEvent();
    }

    insertCss() {
        const css = `
            <style>
            .wrap {
                position: absolute;
                width: 300px;
                height: 750px;
                background: rgba(255, 255, 255, 0.7);
                margin: auto;
                border-radius: 10px;
                top: 0px;
                right: 0px;
                display: none;
            }
            .result-wrap {
                position: absolute;
                width: 500px;
                height: 700px;
                background: rgba(255, 255, 255, 0.9);
                margin: auto;
                padding: 10px;
                border-radius: 10px;
                line-height: 30px;
                top: 0px;
                bottom: 0px;
                right: 0px;
                left: 0px;
                text-align: left;
                display: none;
            }
            .list {
                background: #1e7863;
                text-align: left;
                margin: 2px 5px;
                padding: 2px 5px;
                border-radius: 5px;
                color: #e7df7a;
            }
            .button {
                outline:none;
                cursor: pointer;
                width: 65px;
                height: 40px;
                border-radius: 10px;
                border: 1px solid #888;
                background: #FFF;
            }
            .msg {
                padding:10px;
                clear: both;
            }
            @media screen and (max-height: 600px) and (min-height: 401px) {
                .wrap { width: 600px; }
                .list { float: left; width: 45%; }
            }
            @media screen and (max-height: 400px) {
                .wrap { width: 900px; }
                .list { float: left; width: 31%; }
            }
            </style>
        `;

        return css;
    }

    // 快捷鍵
    setKeyboardEvent() {
        KeyCtlCenter.instance.keyZ.onDown.add(() => {
            const isReelSetShow = (this.$wrap.style.display === '' || this.$wrap.style.display === 'block');

            this.$wrap.style.display = (isReelSetShow) ? 'none' : 'block';
        }, this);
    }

    // 設置 btn event
    setBtnEvent() {
        this.setOkEvent();
        this.setReset();
        this.setResult();
        this.setCopyClose();
        this.setBoost();
    }

    // 關閉
    setCopyClose() {
        const $close = document.querySelector('#js-copy-close');

        $close.onclick = () => {
            this.$result.innerHTML = '';
            this.$resultWrap.style.display = 'none';
        };
    }

    // 輸出
    setResult() {
        const $export = document.querySelector('#js-export');

        $export.onclick = () => {
            let html = '';

            this.$resultWrap.style.display = 'block';

            Object.keys(this.tempoObj).forEach((key) => {
                const $input = document.querySelector(`#js-${key}`);
                html += `<div>"${key}": ${+$input.value},</div>`;
            });

            this.$result.innerHTML = html;
        };
    }

    // reset
    setReset() {
        const newObj = {};
        const $reset = document.querySelector('#js-reset');

        $reset.onclick = () => {
            if (confirm('是否重置')) {
                Object.keys(this.tempoObj).forEach((key) => {
                    const $input = document.querySelector(`#js-${key}`);
                    $input.value = this.json[key];
                    newObj[key] = +$input.value;
                });

                for (let i = 0; i < this.tempoAry.length; i++) {
                    this.tempoAry[i].updateTempo(newObj);
                }
            }
        };
    }

    // 急停模式
    setBoost() {
        const $boost = document.querySelector('#js-boost');
        const $ORI_FIRST_ROLL_SYMBOL_COUNT = document.querySelector('#js-FIRST_ROLL_SYMBOL_COUNT');
        const $ORI_DIFF_PASS_COUNT_EACH_REEL = document.querySelector('#js-DIFF_PASS_COUNT_EACH_REEL');
        const $SLOW_EMG_ROLLING_PASS_COUNT = document.querySelector('#js-SLOW_EMG_ROLLING_PASS_COUNT');
        const $SLOW_ROLLING_PASS_COUNT = document.querySelector('#js-SLOW_ROLLING_PASS_COUNT');
        const $ORI_ROLLING_SYMBOL = document.querySelector('#js-ROLLING_SYMBOL');
        const ORI_FIRST_ROLL_SYMBOL_COUNT = $ORI_FIRST_ROLL_SYMBOL_COUNT.value;
        const ORI_DIFF_PASS_COUNT_EACH_REEL = $ORI_DIFF_PASS_COUNT_EACH_REEL.value;
        const ORI_ROLLING_SYMBOL = $ORI_ROLLING_SYMBOL.value;
        const SLOW_EMG_ROLLING_PASS_COUNT = $SLOW_EMG_ROLLING_PASS_COUNT.value;
        const SLOW_ROLLING_PASS_COUNT = $SLOW_ROLLING_PASS_COUNT.value;
        let isJiTinOn = false;

        $boost.onclick = () => {
            isJiTinOn = !isJiTinOn;
            $boost.textContent = (isJiTinOn) ? this.boostTextOn : this.boostTextOff;

            if (isJiTinOn) {
                $ORI_FIRST_ROLL_SYMBOL_COUNT.value = 1;
                $ORI_DIFF_PASS_COUNT_EACH_REEL.value = 1;
                $ORI_ROLLING_SYMBOL.value = 100;
                $SLOW_EMG_ROLLING_PASS_COUNT.value = 1;
                $SLOW_ROLLING_PASS_COUNT.value = 1;

                // 將 json 設定值帶入遊戲
                this.saveData();
                return;
            }

            $ORI_FIRST_ROLL_SYMBOL_COUNT.value = ORI_FIRST_ROLL_SYMBOL_COUNT;
            $ORI_DIFF_PASS_COUNT_EACH_REEL.value = ORI_DIFF_PASS_COUNT_EACH_REEL;
            $ORI_ROLLING_SYMBOL.value = ORI_ROLLING_SYMBOL;
            $SLOW_EMG_ROLLING_PASS_COUNT.value = SLOW_EMG_ROLLING_PASS_COUNT;
            $SLOW_ROLLING_PASS_COUNT.value = SLOW_ROLLING_PASS_COUNT;

            // 將 json 設定值帶入遊戲
            this.saveData();
        };
    }

    // 確認
    setOkEvent() {
        const $ok = document.querySelector('#js-ok');

        $ok.onclick = () => {
            this.saveData();
        };
    }

    // 存檔
    saveData() {
        const newObj = {};

        // 將 json 設定值帶入遊戲
        Object.keys(this.tempoObj).forEach((key) => {
            const $input = document.querySelector(`#js-${key}`);
            newObj[key] = +$input.value;
        });

        for (let i = 0; i < this.tempoAry.length; i++) {
            this.tempoAry[i].updateTempo(newObj);
        }
    }
}

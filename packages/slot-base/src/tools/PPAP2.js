// 消除類小工具
import GlobalEvent from 'base/GlobalEvent';
import KeyCtlCenter from 'tools/KeyCtlCenter';

export default class PPAP2 {
    constructor(oriTempoAry, boostTempoAry, ChangeReelTuneEvent, ReelEvent, GameEvent, GaStatesConfig) {
        this.oriTempoAry = oriTempoAry;
        this.boostTempoAry = boostTempoAry;
        this.ChangeReelTuneEvent = ChangeReelTuneEvent;
        this.ReelEvent = ReelEvent;
        this.GameEvent = GameEvent;
        this.GaStatesConfig = GaStatesConfig;


        this.boostTextOn = '急停ON';
        this.boostTextOff = '急停OFF';

        this.tempoObj = {
            fallingDuration: '落下秒數',
            fillDuration: '填滿秒數',
            slowMotionDuration: '慢動作秒數',
            rowDifferenceDuration: '每排落下間隔時間',
            randomDifferenceDuration: '單顆隨機掉落時間',
            rowFillUpDifferenceDuration: '同row單顆隨機差別補充延遲',

            previewedFillDelay: '可視層填滿延遲時間',
            previewedFallingDuration: '可視層掉落時間',

            storageFallingDuration: '倉庫掉落時間',
            storageFillDelay: '倉庫填滿延遲時間',

            allReelClearDuration: '結束後面盤淡出秒速',
            allReelClearDelay: '等待多久後清除盤面',

            rowPadding: 'row加乘掉落間隔'
        };

        // 全部setting設定值
        this.json = this.oriTempoAry;
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
        html += '<div style="padding:5px;">單位：毫秒</div>';
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

                GlobalEvent.dispatchEvent(new this.ChangeReelTuneEvent(this.ChangeReelTuneEvent.ON_CHANGE_TEMPO_EVENT, newObj));
            }
        };
    }

    // 急停模式
    setBoost() {
        const $boost = document.querySelector('#js-boost');

        // 原速度
        const $fallingDuration = document.querySelector('#js-fallingDuration');
        const $fillDuration = document.querySelector('#js-fillDuration');
        const $slowMotionDuration = document.querySelector('#js-slowMotionDuration');
        const $rowDifferenceDuration = document.querySelector('#js-rowDifferenceDuration');
        const $randomDifferenceDuration = document.querySelector('#js-randomDifferenceDuration');
        const $rowFillUpDifferenceDuration = document.querySelector('#js-rowFillUpDifferenceDuration');
        const $previewedFillDelay = document.querySelector('#js-previewedFillDelay');
        const $previewedFallingDuration = document.querySelector('#js-previewedFallingDuration');
        const $storageFallingDuration = document.querySelector('#js-storageFallingDuration');
        const $storageFillDelay = document.querySelector('#js-storageFillDelay');
        const $allReelClearDuration = document.querySelector('#js-allReelClearDuration');
        const $allReelClearDelay = document.querySelector('#js-allReelClearDelay');
        const $rowPadding = document.querySelector('#js-rowPadding');

        const fallingDuration = $fallingDuration.value;
        const fillDuration = $fillDuration.value;
        const slowMotionDuration = $slowMotionDuration.value;
        const rowDifferenceDuration = $rowDifferenceDuration.value;
        const randomDifferenceDuration = $randomDifferenceDuration.value;
        const rowFillUpDifferenceDuration = $rowFillUpDifferenceDuration.value;
        const previewedFillDelay = $previewedFillDelay.value;
        const previewedFallingDuration = $previewedFallingDuration.value;
        const storageFallingDuration = $storageFallingDuration.value;
        const storageFillDelay = $storageFillDelay.value;
        const allReelClearDuration = $allReelClearDuration.value;
        const allReelClearDelay = $allReelClearDelay.value;
        const rowPadding = $rowPadding.value;

        let isJiTinOn = false;

        $boost.onclick = () => {
            isJiTinOn = !isJiTinOn;
            $boost.textContent = (isJiTinOn) ? this.boostTextOn : this.boostTextOff;

            // boost下的速度
            if (isJiTinOn) {
                $fallingDuration.value = this.boostTempoAry.fallingDuration;
                $fillDuration.value = this.boostTempoAry.fillDuration;
                $slowMotionDuration.value = this.boostTempoAry.slowMotionDuration;
                $rowDifferenceDuration.value = this.boostTempoAry.rowDifferenceDuration;
                $randomDifferenceDuration.value = this.boostTempoAry.randomDifferenceDuration;
                $rowFillUpDifferenceDuration.value = this.boostTempoAry.rowFillUpDifferenceDuration;
                $previewedFillDelay.value = this.boostTempoAry.previewedFillDelay;
                $previewedFallingDuration.value = this.boostTempoAry.previewedFallingDuration;
                $storageFallingDuration.value = this.boostTempoAry.storageFallingDuration;
                $storageFillDelay.value = this.boostTempoAry.storageFillDelay;
                $allReelClearDuration.value = this.boostTempoAry.allReelClearDuration;
                $allReelClearDelay.value = this.boostTempoAry.allReelClearDelay;
                $rowPadding.value = this.boostTempoAry.rowPadding;


                // 將 json 設定值帶入遊戲
                this.saveData();
                return;
            }

            $fallingDuration.value = fallingDuration;
            $fillDuration.value = fillDuration;
            $slowMotionDuration.value = slowMotionDuration;
            $rowDifferenceDuration.value = rowDifferenceDuration;
            $randomDifferenceDuration.value = randomDifferenceDuration;
            $rowFillUpDifferenceDuration.value = rowFillUpDifferenceDuration;
            $previewedFillDelay.value = previewedFillDelay;
            $previewedFallingDuration.value = previewedFallingDuration;
            $storageFallingDuration.value = storageFallingDuration;
            $storageFillDelay.value = storageFillDelay;
            $allReelClearDuration.value = allReelClearDuration;
            $allReelClearDelay.value = allReelClearDelay;
            $rowPadding.value = rowPadding;

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

        GlobalEvent.dispatchEvent(new this.ChangeReelTuneEvent(this.ChangeReelTuneEvent.ON_CHANGE_REEL_TUNE_EVENT, newObj));
    }
}

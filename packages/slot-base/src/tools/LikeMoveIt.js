import KeyCtlCenter from 'tools/KeyCtlCenter';

/**
 * 開發工具 - 移動物件並回報座標
 * 快捷鍵開啟/關閉 - M
 * 專案使用只要 LikeMoveIt.register(要註冊的phaser物件陣列) 即可。
 */
export default class LikeMoveIt {
    constructor() {
        LikeMoveIt.instance = this;

        // 定義色調
        this.oriTint = '0xffffff';
        this.markTint = '0x00ff00';

        // Init 全域變數 isMoveIt
        if (window.isMoveItOn === undefined) {
            window.isMoveItOn = false;
        }

        // 可被設定拖曳的物件集合
        this.collectEles = [];

        // 選擇的物件
        this.curItem = undefined;

        // 顯示的資料
        this.createHtml();

        // 快捷鍵
        this.setKeyboardEvent();
    }

    /**
     * 註冊可設定的物件
     * @param  {Array} eles 物件陣列
     */
    static register(eles) {
        LikeMoveIt.instance.collectEles = LikeMoveIt.instance.collectEles.concat(eles);
    }

    /**
     * 設定啟用系統
     * @param  {Boolean} isSysOn 是否可拖曳
     */
    setSysOn(isSysOn) {
        this.collectEles.forEach((ele) => {
            const item = (ele.item) ? ele.item : ele;
            item.inputEnabled = isSysOn;

            if (isSysOn) {
                item.tint = this.markTint;
                item.input.enableDrag();
                item.events.onDragStop.add(this.reportPos, this);
                item.events.onInputDown.add(this.updateSelectedItem, this);
                item.events.onInputUp.add(this.returnTint, this);
                return;
            }

            item.tint = this.oriTint;
            item.input.disableDrag();
            item.events.onDragStop.remove(this.reportPos, this);
            item.events.onInputDown.remove(this.updateSelectedItem, this);
            item.events.onInputUp.remove(this.returnTint, this);
        });
    }

    /**
     * 更新選中的物件
     * @param  {Object} name 選中的物件
     */
    updateSelectedItem(ele) {
        ele.tint = this.oriTint;
        this.curItem = ele;
        this.reportPos();
    }

    /**
    * 還原 mark 色調
    * @param  {Object} name 選中的物件
    */
    returnTint(ele) {
        ele.tint = this.markTint;
    }

    // 回報物件座標
    reportPos() {
        const name = this.getName(this.curItem);
        const posX = parseInt(this.curItem.previousPosition.x, 10);
        const posY = parseInt(this.curItem.previousPosition.y, 10);

        this.updatePosText(name, posX, posY);
    }

    /**
     * 取名字
     * @param  {Object} ele 選取的物件
     */
    getName(ele) {
        return (ele.name) ? ele.name : ele.font;
    }

    /**
     * 更新文字
     * @param  {String} name 物件名稱
     * @param  {String} x    物件水平位置
     * @param  {String} y    物件垂直位置
     */
    updatePosText(name, x, y) {
        const $posDiv = document.querySelector('#js-moveit-result-pos');

        $posDiv.innerText = this.posTextTemplate(name, x, y);
    }

    /**
     * 文字樣板
     * @param  {String} name 物件名稱
     * @param  {String} x    物件水平位置
     * @param  {String} y    物件垂直位置
     * @return {String}     顯示文字
     */
    posTextTemplate(name = 'null', x = 0, y = 0) {
        return `拖曳啟動 [ ${name}, ${x}, ${y} ]`;
    }

    // 建立定位開關顯示
    createHtml() {
        if (document.querySelector('#js-moveit-wrap')) {
            return;
        }

        this.$dragWrap = document.createElement('div');    // 拖曳資訊欄位
        const $resultPos = document.createElement('span');  // 名稱、座標欄位

        this.$dragWrap.id = 'js-moveit-wrap';
        this.$dragWrap.style.position = 'absolute';
        this.$dragWrap.style.top = '0';
        this.$dragWrap.style.left = '0';
        this.$dragWrap.style.padding = '5px 5px';
        this.$dragWrap.style.borderRadius = '0 0 10px 0';
        this.$dragWrap.style.background = '#FFF';
        this.$dragWrap.style.opacity = '0.7';
        this.$dragWrap.style.color = '#000';
        this.$dragWrap.style.fontSize = '30px';
        this.$dragWrap.style.fontWeight = 'bold';
        this.$dragWrap.style.display = 'none';

        $resultPos.id = 'js-moveit-result-pos';
        $resultPos.innerText = this.posTextTemplate();

        this.$dragWrap.appendChild($resultPos);
        document.body.appendChild(this.$dragWrap);
    }

    // 快捷鍵
    setKeyboardEvent() {
        // 開關
        KeyCtlCenter.instance.keyM.onDown.add(() => {
            window.isMoveItOn = !window.isMoveItOn;
            this.setSysOn(window.isMoveItOn);
            this.$dragWrap.style.display = (window.isMoveItOn) ? 'block' : 'none';
        }, this);

        // 按下方向鍵，移動物件
        KeyCtlCenter.instance.keyUp.onDown.add(this.keyUpOnDownEvent, this);
        KeyCtlCenter.instance.keyDown.onDown.add(this.keyDownOnDownEvent, this);
        KeyCtlCenter.instance.keyLeft.onDown.add(this.keyLeftOnDownEvent, this);
        KeyCtlCenter.instance.keyRight.onDown.add(this.keyRightOnDownEvent, this);

        // 放開方向鍵，回報物件座標
        KeyCtlCenter.instance.keyUp.onUp.add(this.reportPosOrNot, this);
        KeyCtlCenter.instance.keyDown.onUp.add(this.reportPosOrNot, this);
        KeyCtlCenter.instance.keyLeft.onUp.add(this.reportPosOrNot, this);
        KeyCtlCenter.instance.keyRight.onUp.add(this.reportPosOrNot, this);
    }

    // 按下方向鍵事件 上
    keyUpOnDownEvent() {
        if (this.curItem === undefined) { return; }
        this.moveCurItem('W');
    }

    // 按下方向鍵事件 下
    keyDownOnDownEvent() {
        if (this.curItem === undefined) { return; }
        this.moveCurItem('S');
    }

    // 按下方向鍵事件 左
    keyLeftOnDownEvent() {
        if (this.curItem === undefined) { return; }
        this.moveCurItem('A');
    }

    // 按下方向鍵事件 右
    keyRightOnDownEvent() {
        if (this.curItem === undefined) { return; }
        this.moveCurItem('D');
    }

    /**
     * 移動物件
     * @param {String} how  WASD表示法
     */
    moveCurItem(how) {
        const distance = (KeyCtlCenter.instance.keyShift.isDown) ? 20 : 1;
        const moveAxis = (how === 'W' || how === 'S') ? 'y' : 'x';
        const moveNum = (how === 'W' || how === 'A') ? -Math.abs(distance) : distance;

        this.curItem.tint = this.oriTint;
        this.curItem[moveAxis] += moveNum;
    }

    // 回報選取物件座標 或 不動作
    reportPosOrNot() {
        if (this.curItem === undefined) { return; }
        this.curItem.tint = this.markTint;
        this.reportPos(this.curItem);
    }
}

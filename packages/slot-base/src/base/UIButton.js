export default class UIButton extends Phaser.Button {
    constructor(game, x, y, key, keyFrame, context = undefined, BtnEvent, paramAry) {
        const upFrame = keyFrame[0];
        const downFrame = keyFrame[1];
        const overFrame = keyFrame[2] || upFrame;
        const outFrame = keyFrame[3] || upFrame;
        // 因為圖片只有給UP DOWN 跟鎖定 這邊預設先填
        super(game, x, y, key, null, null, overFrame, outFrame, downFrame, upFrame);

        this.onInputUp.add(this.onButtonEvent, this);

        this.FrameData = keyFrame;
        this.contextRoot = context;
        this.textPack = '';
        this.BtnEvent = BtnEvent;
        this.BtnEventParams = paramAry;
        this.bitmapTextAry = [];
        this.isEnable = true;
    }

    addButtonUpEvent(context, fun, param, isOnce = false) {
        if (isOnce) {
            this.onInputUp.addOnce(() => {
                fun.call(context, param);
            }, context);
            return;
        }
        this.onInputUp.add(() => {
            fun.call(context, param);
        }, context);
    }
    removeButtonUpEvent(context) {
        this.onInputUp.removeAll(context);
    }

    addButtonDownEvent(context, fun, param, isOnce = false) {
        if (isOnce) {
            this.onInputDown.addOnce(() => {
                fun.call(context, param);
            }, context);
            return;
        }
        this.onInputDown.add(() => {
            fun.call(context, param);
        }, context);
    }

    addButtonOverEvent(context, fun, param, isOnce = false) {
        if (isOnce) {
            this.onInputOver.addOnce(() => {
                fun.call(context, param);
            }, context);
            return;
        }
        this.onInputOver.add(() => {
            fun.call(context, param);
        }, context);
    }

    addButtonOutEvent(context, fun, param, isOnce = false) {
        if (isOnce) {
            this.onInputOut.addOnce(() => {
                fun.call(context, param);
            }, context);
            return;
        }
        this.onInputOut.add(() => {
            fun.call(context, param);
        }, context);
    }

    onButtonEvent() {
        // 開發工具 拖曳回報定位功能 - 阻擋按鈕點擊事件
        if ((process.env.NODE_ENV === 'develop' || process.env.NODE_ENV === 'devtest') && window.isMoveItOn) {
            return;
        }

        if (this.contextRoot !== undefined) {
            this.contextRoot.onDispatchEvent(new this.BtnEvent(this.name, this.BtnEventParams));
        }
    }

    addSubTexture(fixX, fixY, angle, key, subTextureAry) {
        this.subTextUp = new Phaser.Sprite(this.game, fixX, fixY, key, subTextureAry[0]);
        this.subTextUp.angle = angle;
        this.subTextUp.anchor.set(0.5);
        this.subTextDown = new Phaser.Sprite(this.game, fixX, fixY, key, subTextureAry[1]);
        this.subTextDown.angle = angle;
        this.subTextDown.anchor.set(0.5);
        this.subTextDown.visible = false;
        this.addChild(this.subTextUp);
        this.addChild(this.subTextDown);
        this.onInputDown.add(this.downSubTexture, this);
        this.onInputUp.add(this.upSubTexture, this);
    }

    setSubTextureScale(scale = 1) {
        this.subTextUp.scale.set(scale);
        this.subTextDown.scale.set(scale);
    }

    setSubTextureAlpha(alpha = 1) {
        this.subTextUp.alpha = alpha;
        this.subTextDown.alpha = alpha;
    }

    downSubTexture() {
        this.subTextUp.visible = false;
        this.subTextDown.visible = true;
    }

    upSubTexture() {
        this.subTextUp.visible = true;
        this.subTextDown.visible = false;
    }

    /**
     * 鎖定
     */
    onDisable(imgFrame = undefined) {
        (imgFrame) ? this.setFrames(imgFrame[0], imgFrame[1]) : this.tint = 0x999999;
        this.inputEnabled = false;
        this.input.useHandCursor = false;
        this.isEnable = false;
    }

    onEnable(imgFrame = undefined) {
        (imgFrame) ? this.setFrames(imgFrame[0], imgFrame[0], imgFrame[1]) : this.tint = 0xFFFFFF;
        this.inputEnabled = true;
        this.input.useHandCursor = true;
        this.isEnable = true;
    }

    /**
     * 是否設置文本框
     * @param {string}  textName  txtPack
     * @param {any}     style     style
     */
    setButtonText(textName = '', style = { font: '32px Arial', fontStyle: 'bold', fill: '#ffffff', align: 'center' }) {
        this.textPack = textName;
        this.styles = style;
        if (this.txt === null) {
            this.txt = new Phaser.Text(this.game, this.centerX, this.centerY, this.textPack, this.styles);
            this.txt.anchor.set(0.5);
            this.addChild(this.txt);
        }
    }

    createButtonBitmapText(x = 0, y = 0, angle, fontKey, textContent = '', inx = 0) {
        const bitmapText = new Phaser.BitmapText(this.game, x, y, fontKey);
        bitmapText.anchor.set(0.5);
        bitmapText.angle = angle;
        bitmapText.text = textContent;

        bitmapText.scale.set(this.decideNumScale(textContent));

        this.bitmapTextAry[inx] = bitmapText;
        this.addChild(bitmapText);
    }

    setButtonBitmapText(inx, textContent) {
        this.bitmapTextAry[inx].text = textContent;
        this.bitmapTextAry[inx].scale.set(this.decideNumScale(textContent));
    }

    switchButtonBitmapText(inx, bool) {
        this.bitmapTextAry[inx].visible = bool;
    }

    decideNumScale(num) {
        if (typeof num !== 'number') {
            return 1;
        }
        let scale = 0.6;
        switch (num.toString().length) {
            case 1 :
            case 2 : {
                scale = 1;
                break;
            }
            case 3 : {
                scale = 0.93;
                break;
            }
            case 4 : {
                scale = 0.85;
                break;
            }
            case 5 :
            case 6 : {
                scale = 0.7;
                break;
            }
            default:
        }

        return scale;
    }
}

import UIButton from 'base/UIButton';

export default class McButton extends UIButton {
    constructor(game, x, y, key, keyFrame, context = undefined, BtnEvent) {
        // 因為圖片只有給UP DOWN 跟鎖定 這邊預設先填
        super(game, x, y, key, keyFrame, context, BtnEvent);
        this.setLoadTexture = 0;
    }

    // 切換圖片
    set setLoadTexture(index) {
        this.setFrames(this.FrameData[index]);
    }
}

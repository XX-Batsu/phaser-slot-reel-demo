import _ from 'lodash';

/**
 * 創建 Bitmap 文字
 * @param  {Object}          game                Phaser Game
 * @param  {Number}          x                   水平位置
 * @param  {Number}          y                   垂直位置
 * @param  {String}          font                字型名稱
 * @param  {Number, String}  txt                 數字 / 字串
 * @param  {Number}          [padding=100]       字距
 * @param  {Boolean}         [isHorizontal=true] 直書 / 橫書
 * @return {Object}                              Phaser Group
 */
export default function createSerialBitmap(game, x, y, font, txt, padding = 100, isHorizontal = true) {
    const text = (typeof (txt) !== 'string') ? String(txt) : txt;
    const group = new Phaser.Group(game);

    [ group.x, group.y ] = [ x, y ];
    _.forEach(text, (str, idx) => {
        const char = new Phaser.BitmapText(game, 0, 0, font, str);

        (isHorizontal) ? char.x = padding * idx : char.y = padding * idx;
        group.add(char);
    });
    return group;
}

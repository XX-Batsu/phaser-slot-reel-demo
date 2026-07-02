/**
 * 創造 sprite animation
 * @param  {String} cacheName    圖片 cache name
 * @param  {String} framePreName 圖片裡面的 img key
 * @param  {Number} x            x
 * @param  {Number} y            y
 * @return {Phaser.Sprite}              sprite
 */
export default function makeSpriteAnimation(game, cacheName, framePreName, x, y) {
    const changeHName = cacheName;
    const sprite = new Phaser.Sprite(game, x, y, changeHName);
    const frameCount = game.cache.getFrameCount(changeHName);
    sprite.animations.add('animation', Phaser.Animation.generateFrameNames(framePreName, 1, frameCount, '.png'));
    return sprite;
}

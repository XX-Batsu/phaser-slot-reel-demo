export default class ReelEffectEase {
    static createTween(cb, context) {
        const tween = new TimelineMax({
            onComplete: () => {
                tween.kill();
                if (cb) { cb.call(context); }
            }
        });
        return tween;
    }
    /** Play'n GO Rage to Riches 掉落方式 (猴子)
        easedata.sec = 0.6;
        easedata.delay = reelIdx * 0.05;
        easedata.delayY = 0.1;
     */
    static get easeBrushOffReel() {
        return {
            easedata: { idx: 0, sec: 0, delay: 0, delayY: 0, isbounce: false, bounceY: 0, easeing: Linear.easeInOut },
            spin: (easeInfo, target, otherTarget, cb = undefined, context = undefined) => {
                const targetLocal = [];
                // 取得轉動前結果數值
                const symbolAry = context.getBeforeEndSymbolData;
                const targetChildren = target.children;
                const tween = new TimelineMax({
                    onComplete: () => {
                        for (let row = 0; row < targetChildren.length; row++) {
                            targetChildren[row].x = targetLocal[row].x;
                            targetChildren[row].y = targetLocal[row].y;
                        }
                        tween.kill();
                        if (cb) { cb.call(context); }
                    }
                });
                const otherHeight = target.height;

                for (let row = 0; row < targetChildren.length; row++) {
                    targetLocal.push({ x: targetChildren[row].x, y: targetChildren[row].y });
                    targetChildren[row].alpha = 0;
                    if (row > 0 && row < targetChildren.length - 1) {
                        targetChildren[row].alpha = 1;
                        const sprite = new Phaser.Sprite(
                            context.game,
                            context.alignPos.x, context.symbolPosition(row) - context.alignPos.y,
                            context.symbolKey, context.getSymbolName(symbolAry[row])
                        );
                        sprite.anchor.set(0.5);
                        otherTarget.add(sprite);
                        sprite.y -= otherHeight;
                        const delayValue = easeInfo.delay + (easeInfo.delayY * (targetChildren.length - row - 1));
                        tween
                            .to(targetChildren[row], easeInfo.sec, {
                                y: targetChildren[row].y + target.height,
                                delay: delayValue
                            }, 'easeBrushOffReel')
                            .to(sprite, easeInfo.sec / 2, {
                                y: sprite.y + otherHeight,
                                delay: delayValue,
                                onComplete: () => {
                                    // 判段是否停止的聲音還是hit聲    空值:普通 damping , 不等於空值:播放特殊聲音
                                    context.onHitComplete.dispatch(context.reelIndex, 0);
                                }
                            }, 'easeBrushOffReel2');

                        if (easeInfo.isbounce) {
                            tween
                                .to(sprite, easeInfo.sec / 5, {
                                    y: sprite.y + otherHeight - easeInfo.bounceY,
                                    delay: delayValue + easeInfo.sec / 2
                                }, 'easeBrushOffReel2')
                                .to(sprite, easeInfo.sec / 5, {
                                    y: sprite.y + otherHeight,
                                    delay: delayValue + (easeInfo.sec / 5) + (easeInfo.sec / 2)
                                }, 'easeBrushOffReel2');
                        }
                    }
                }
            }
        };
    }
    /** 七龍珠掉落方式
        easedata.sec = 0.6;
        easedata.delay = reelIdx * 0.05;
        easedata.delayY = 0.1;
        easedata.beforeDelayY = 0.05;
    */
    static get easeScaleOffReel() {
        return {
            easedata: { idx: 0, sec: 0, delay: 0, delayY: 0, beforeDelayY: 0, easeing: Linear.easeInOut },
            spin: (easeInfo, target, otherTarget, cb = undefined, context = undefined) => {
                const targetLocal = [];
                // 取得轉動前結果數值
                const symbolAry = context.getBeforeEndSymbolData;
                const targetChildren = target.children;
                const tween = new TimelineMax({
                    onComplete: () => {
                        for (let row = 0; row < targetChildren.length; row++) {
                            targetChildren[row].x = targetLocal[row].x;
                            targetChildren[row].y = targetLocal[row].y;
                        }
                        // 判段是否停止的聲音還是hit聲    空值:普通 damping , 不等於空值:播放特殊聲音
                        context.onHitComplete.dispatch(context.reelIndex, 0);
                        tween.kill();
                        if (cb) { cb.call(context); }
                    }
                });
                const rowOneY = context.symbolPosition(1) - context.alignPos.y;

                for (let row = targetChildren.length - 1; row >= 0; row--) {
                    const index = (targetChildren.length - row - 1);
                    targetLocal.push({ x: targetChildren[index].x, y: targetChildren[index].y });
                    targetChildren[row].alpha = 0;
                    if (row > 0 && row < targetChildren.length - 1) {
                        targetChildren[row].alpha = 1;
                        const sprite = new Phaser.Sprite(
                            context.game,
                            context.alignPos.x, rowOneY,
                            context.symbolKey, context.getSymbolName(symbolAry[row])
                        );
                        sprite.anchor.set(0.5);
                        sprite.alpha = 0;
                        otherTarget.add(sprite);
                        const delay2 = easeInfo.delayY + (easeInfo.beforeDelayY * row);
                        tween.to(targetChildren[index], easeInfo.sec, { y: targetChildren[index].y + target.height, delay: easeInfo.delay + (easeInfo.delayY * (row)) }, 'easeScaleOffReel')
                            .fromTo(sprite, easeInfo.sec / 4, { alpha: 0 }, { alpha: 1, delay: delay2 }, `easeScaleOffReel${index}`)
                            .fromTo(sprite.scale, easeInfo.sec / 3, { x: 0, y: 0 }, { x: 1, y: 1, delay: delay2 }, `easeScaleOffReel${index}`)
                            .to(sprite, easeInfo.sec / 2, { y: context.symbolPosition(row) - context.alignPos.y }, `easeScaleOffReel_Down${index}`);
                    }
                }
            }
        };
    }
}

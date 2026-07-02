export default class SymbolEffectEasing {
    static createTween(cb, context) {
        const tween = new TimelineLite({
            onComplete: () => {
                tween.kill();
                if (cb) { cb.call(context); }
            }
        });
        return tween;
    }

    static get easeShine() {
        return {
            play: (ele, index, playSec, cb = undefined, context = undefined) => {
                const tween = this.createTween(cb, context);
                const obj = { x: '+=0', onStart: (target) => { target.visible = !target.visible; }, onStartParams: [ ele ] };
                tween.to(ele, 0.4, obj).to(ele, 0.6, obj).to(ele, 0.4, obj).to(ele, 0.6, obj);
            }
        };
    }

    static get easeZoomOut() {
        return {
            play: (ele, index, playSec, cb = undefined, context = undefined) => {
                const tween = this.createTween(cb, context);
                const obj = { frist: { x: 0.8, y: 0.8 }, end: { x: 1, y: 1 } };
                const count = 2;
                const sec = playSec / (count * 2);
                for (let i = 1; i <= count; i++) {
                    tween.to(ele.scale, sec, obj.frist).to(ele.scale, sec, obj.end);
                }
            }
        };
    }

    static get easeZoomIn() {
        return {
            play: (ele, index, playSec, cb = undefined, context = undefined) => {
                const tween = this.createTween(cb, context);
                const obj = { frist: { x: 1.2, y: 1.2 }, end: { x: 1, y: 1 } };
                const count = 2;
                const sec = playSec / (count * 2);
                for (let i = 1; i <= count; i++) {
                    tween.to(ele.scale, sec, obj.frist).to(ele.scale, sec, obj.end);
                }
            }
        };
    }

    static get easeZoomInFall() {
        return {
            play: (ele, index, playSec, cb = undefined, context = undefined) => {
                const tween = this.createTween(cb, context);
                const obj = { frist: { x: 1.1, y: 1.1 }, end: { x: 1, y: 1 } };
                const sec = playSec / 5;
                const delay = playSec / 2;
                tween
                    .to(ele.scale, sec, obj.frist, 'stop')
                    .to(ele.scale, sec, obj.end, `stop+=${delay}`);
            }
        };
    }
}

import { GameBase, Overlay, SlotGame, LikeMoveIt, RunScore, Sound, Tool } from 'slot-base';
// 紅利遊戲基本流程
import BonusGameTriggerSignal from 'js/signal/bonusgame/BonusGameTriggerSignal';
import BonusGameIdleSignal from 'js/signal/bonusgame/BonusGameIdleSignal';
import BonusGamePlaySignal from 'js/signal/bonusgame/BonusGamePlaySignal';
import BonusGameCompleteSignal from 'js/signal/bonusgame/BonusGameCompleteSignal';
import FreeCompleteSignal from 'js/signal/freegame/FreeCompleteSignal';

import FreeGameChageBgSignal from 'js/signal/ui/background/FreeGameChageBgSignal';
import BaseGameChageBgSignal from 'js/signal/ui/background/BaseGameChageBgSignal';

import CustomEvent from 'js/events/CustomEvent';

export default class BonusView extends GameBase {
    constructor(game) {
        super(game);
        // 接收結果資料
        this.bonusResultData = [];
        // Base、FreeGame 已有此款遊戲的結果資料 [遊戲特色]
        this.resultData = [];

        this.bonusTimeList = [];
        this.bonusResultList = [];

        // 遮罩
        // this.blackOverlay = new Overlay(game, {
        //     settings: [ 0, 0, game.world.width, game.world.height ],
        //     alpha: 0.8,
        //     color: 0x000000
        // });
        // this.add(this.blackOverlay);
        // this.blackOverlay.inputEnabled = true;
        // this.blackOverlay.events.onInputDown.add(() => {});
        // this.blackOverlay.visible = false;

        this.optionGroup = new Phaser.Group(game);
        this.add(this.optionGroup);
        this.optionsAry = [];
        this.optionTouchAreasAry = [];
        this.optionGroup5 = this.makeOption(4, 1259, 643, { x: 0, y: -28, scale: 0.9 });
        this.optionGroup6 = this.makeOption(5, 312, 643, { x: 3, y: -28, scale: 0.9 });
        this.optionGroup4 = this.makeOption(3, 460, 629, { x: -2, y: -16, scale: 0.9 });
        this.optionGroup1 = this.makeOption(0, 607, 616, { x: 2, y: -15, scale: 0.9 });
        this.optionGroup3 = this.makeOption(2, 1107, 629, { x: 3, y: -16, scale: 0.9 });
        this.optionGroup2 = this.makeOption(1, 941, 616, { x: 2, y: -15, scale: 0.9 });
        this.optionGroup7 = this.makeOption(6, 775, 606, { x: 0, y: 0, scale: 0.9 });
        this.optionsAry.push(this.optionGroup5);
        this.optionsAry.push(this.optionGroup6);
        this.optionsAry.push(this.optionGroup4);
        this.optionsAry.push(this.optionGroup1);
        this.optionsAry.push(this.optionGroup3);
        this.optionsAry.push(this.optionGroup2);
        this.optionsAry.push(this.optionGroup7);
        this.optionGroup.alpha = 0;
        this.optionTween = new TimelineMax();
        this.curtainTween = new TimelineMax();
        this.pillarInCounts = 0;

        this.theFrontestGroup = new Phaser.Group(game);
        this.add(this.theFrontestGroup);

        this.textOptionRandom = new Phaser.Sprite(game, 695, 524, 'textOptionRandom');
        this.textOptionRandom.alpha = 0;
        this.add(this.textOptionRandom);
        this.randomOptTextTween = new TimelineMax();

        const spinTimesMask = this.game.add.graphics(0, 0);
        spinTimesMask.beginFill(0x101010);
        spinTimesMask.alpha = 0.5;
        this.spinTimesRowHeight = 57;
        spinTimesMask.drawRect(this.textOptionRandom.x - 4, this.textOptionRandom.y - 6, 70, this.spinTimesRowHeight, 98);
        this.add(spinTimesMask);

        this.spinTimesGroup = new Phaser.Group(this.game);
        this.spinTimesGroup.visible = false;
        this.add(this.spinTimesGroup);
        this.spinTimesGroup.mask = spinTimesMask;

        const totalSpinTimeOptions = 6;
        this.totalSpinTimeOptionReelHeight = totalSpinTimeOptions * 4 * this.spinTimesRowHeight;
        const spinTimesTextAry = [];
        for (let i = 0; i < totalSpinTimeOptions * 4; i++) {
            const spinTimeText = new Phaser.Sprite(this.game, 725, 547 - (i + 1) * this.spinTimesRowHeight, `textSpinTimes_${1 + (i % totalSpinTimeOptions)}`);
            spinTimeText.anchor.set(0.5);
            this.spinTimesGroup.add(spinTimeText);
            spinTimesTextAry.push(spinTimeText);
        }

        const MultiplyMask = this.game.add.graphics(0, 0);
        MultiplyMask.beginFill(0x101010);
        MultiplyMask.alpha = 0.5;
        this.multiplyRowHeight = 55;
        MultiplyMask.drawRect(this.textOptionRandom.x, this.textOptionRandom.y + 60, 150, this.multiplyRowHeight, 98);
        this.add(MultiplyMask);

        this.MultiplyGroup = new Phaser.Group(this.game);
        this.MultiplyGroup.visible = false;
        this.add(this.MultiplyGroup);
        this.MultiplyGroup.mask = MultiplyMask;

        const totalMultiplyOptions = 6;
        this.totalMultiplyOptionReelHeight = totalMultiplyOptions * 4 * this.multiplyRowHeight;
        const multiplyTextAry = [];
        for (let i = 0; i < totalMultiplyOptions * 4; i++) {
            const spinTimeText = new Phaser.Sprite(this.game, 770, 613 - (i + 1) * this.multiplyRowHeight, `textMultiply_${1 + (i % totalMultiplyOptions)}`);
            spinTimeText.anchor.set(0.5);
            this.MultiplyGroup.add(spinTimeText);
            multiplyTextAry.push(spinTimeText);
        }


        this.spinTimesRollingTween = new TimelineMax();
        this.selectCompleteDelayTween = new TimelineMax();

        this.cloudAry = [];
        this.cloudRightA = new Phaser.Sprite(this.game, 860, 755, 'cloudRight_A');
        this.cloudRightA.alpha = 0;
        this.add(this.cloudRightA);
        this.cloudAry.push(this.cloudRightA);
        this.cloudRightB = new Phaser.Sprite(this.game, 660, 705, 'cloudRight_B');
        this.cloudRightB.alpha = 0;
        this.add(this.cloudRightB);
        this.cloudAry.push(this.cloudRightB);
        this.cloudLeftA = new Phaser.Sprite(this.game, 220, 710, 'cloudLeft_A');
        this.cloudLeftA.alpha = 0;
        this.add(this.cloudLeftA);
        this.cloudAry.push(this.cloudLeftA);
        this.cloudLeftB = new Phaser.Sprite(this.game, 133, 715, 'cloudLeft_B');
        this.cloudLeftB.alpha = 0;
        this.add(this.cloudLeftB);
        this.cloudAry.push(this.cloudLeftB);
        this.cloudTween = new TimelineMax();

        this.baseBgPaifang = new Phaser.Sprite(game, 2, 4, 'bgBasePaifang');
        this.baseBgPaifang.visible = false;
        this.add(this.baseBgPaifang);
        this.gameLogo = new Phaser.Sprite(game, 803, 130, 'baseLogo');
        this.gameLogo.scale.set(0.9);
        this.gameLogo.anchor.set(0.5);
        this.gameLogo.visible = false;
        this.add(this.gameLogo);

        const curtainForwardTextureStrAry = Phaser.Animation.generateFrameNames('clip_curtain_', 1, this.game.cache.getFrameCount('animCurtain'), '.png', 1);
        const curtainBackwardTextureStrAry = Phaser.Animation.generateFrameNames('clip_curtain_', 1, this.game.cache.getFrameCount('animCurtain'), '.png', 1).reverse();

        this.curtainRight = new Phaser.Sprite(this.game, 10, 7, 'animCurtain', 'clip_curtain_1.png');
        this.curtainRight.animations.add('triggerForward', curtainForwardTextureStrAry);
        this.curtainRight.animations.getAnimation('triggerForward').onComplete.add(() => {
            this.triggerCurtainClosed();
        }, this);
        this.curtainRight.animations.add('triggerBackward', curtainBackwardTextureStrAry);
        this.curtainRight.animations.add('completeForward', curtainForwardTextureStrAry);
        this.curtainRight.animations.getAnimation('completeForward').onComplete.add(() => {
            this.completeCurtainClosed();
        }, this);
        this.curtainRight.animations.add('completeBackward', curtainBackwardTextureStrAry);
        this.curtainRight.animations.add('freeCompleteForward', curtainForwardTextureStrAry);
        this.curtainRight.animations.add('freeCompleteBackward', curtainBackwardTextureStrAry);
        this.curtainRight.animations.getAnimation('freeCompleteBackward').onComplete.add(() => {
            BaseGameChageBgSignal.callBack();
        }, this);
        this.curtainRight.scale.set(2);
        this.add(this.curtainRight);

        this.curtainLeft = new Phaser.Sprite(this.game, 1570, 7, 'animCurtain', 'clip_curtain_1.png');
        this.curtainLeft.animations.add('forward', curtainForwardTextureStrAry);
        this.curtainLeft.animations.add('backward', curtainBackwardTextureStrAry);
        this.curtainLeft.scale.set(-2, 2);
        this.add(this.curtainLeft);

        // Signal註冊事件區
        this.addEventListener(BonusGameTriggerSignal.ON_TRIGGER_BONUS_GAME_SIGNAL, this.triggerBonusGame, this);
        this.addEventListener(BonusGameIdleSignal.ON_IDLE_BONUS_GAME_SIGNAL, this.idleBonusGame, this);
        this.addEventListener(BonusGamePlaySignal.ON_PLAY_BONUS_GAME_SIGNAL, this.playResultBonus, this);
        this.addEventListener(BonusGameCompleteSignal.ON_COMPLETE_BONUS_GAME_SIGNAL, this.bonusGameComplete, this);

        this.addEventListener(FreeCompleteSignal.ON_FREE_COMPLETE, this.overFreeGameIdle, this);
        this.addEventListener(FreeGameChageBgSignal.ON_CHAGE_FREE_BG, this.onFreeBg, this);
        this.addEventListener(BaseGameChageBgSignal.ON_CHAGE_BASE_BG, this.onBaseBg, this);
    }

    makeOption(index, x, y, textFixValue) {
        const optionGroup = new Phaser.Group(this.game);
        this.add(optionGroup);

        const pillar = new Phaser.Sprite(this.game, x, y, `pillarSelected_${index + 1}`, `clip_pillar_${index + 1}_selected_1.png`);
        pillar.anchor.set(0.5);
        pillar.isPillar = true;
        const pillarSelectedFrameCounts = this.game.cache.getFrameCount(`pillarSelected_${index + 1}`);
        pillar.animations.add('pillarSelected', Phaser.Animation.generateFrameNames(`clip_pillar_${index + 1}_selected_`, 1, pillarSelectedFrameCounts, '.png', 1), pillarSelectedFrameCounts, false);
        let loopTimes = 0;
        pillar.animations.getAnimation('pillarSelected').onLoop.add(() => {
            loopTimes++;
            if (loopTimes >= 4) {
                pillar.animations.stop('pillarSelected');
                pillar.animations.getAnimation('pillarSelected').complete();
                loopTimes = 0;
            }
        }, this);
        pillar.animations.getAnimation('pillarSelected').onComplete.add(() => {
            pillar.loadTexture(`pillar_${index + 1}`, `clip_pillar_${index + 1}_idle_1.png`);
        }, this);

        pillar.loadTexture(`pillar_${index + 1}`, `clip_pillar_${index + 1}_idle_1.png`);
        const pillarFrameCounts = this.game.cache.getFrameCount(`pillar_${index + 1}`);
        pillar.animations.add('pillarOut', Phaser.Animation.generateFrameNames(`clip_pillar_${index + 1}_idle_`, 1, pillarFrameCounts, '.png', 1), pillarFrameCounts, false);
        pillar.animations.getAnimation('pillarOut').onComplete.add(() => {
            this.pillarOutCount();
        }, this);
        optionGroup.add(pillar);

        const optionVfx = new Phaser.Sprite(this.game, x, y, `pillarVfx_${index + 1}`, `clip_pillar_${index + 1}_vfx_1.png`);
        optionVfx.anchor.set(0.5);
        const vfxFrameCounts = this.game.cache.getFrameCount(`pillarVfx_${index + 1}`);
        optionVfx.animations.add('selectVfx', Phaser.Animation.generateFrameNames(`clip_pillar_${index + 1}_vfx_1`, 1, vfxFrameCounts, '.png', 1), vfxFrameCounts, false);
        optionVfx.animations.getAnimation('selectVfx').onComplete.add(() => {
            optionVfx.loadTexture(`pillarVfx_${index + 1}`, `clip_pillar_${index + 1}_vfx_1.png`);
        }, this);
        optionVfx.isVfx = true;
        optionGroup.add(optionVfx);

        const optionText = new Phaser.Sprite(this.game, x + textFixValue.x, y + textFixValue.y, `textOption_${index + 1}`, `clip_pillar_${index + 1}_option_1.png`);
        optionText.anchor.set(0.5);
        optionText.scale.set(textFixValue.scale);
        optionText.isText = true;
        const textFrameCounts = this.game.cache.getFrameCount(`textOption_${index + 1}`);
        optionText.animations.add('optionText', Phaser.Animation.generateFrameNames(`clip_pillar_${index + 1}_option_`, 1, textFrameCounts, '.png', 1), textFrameCounts, false);
        optionGroup.add(optionText);

        const touchArea = this.game.add.graphics(0, 0);
        touchArea.beginFill(0x101010);
        touchArea.alpha = 0;
        const width = 140;
        const height = 600;
        touchArea.drawRect(optionText.x - width / 2, optionText.y - height / 2, width, height, 98);
        this.optionTouchAreasAry.push(touchArea);
        touchArea.self = this;
        touchArea.optionInx = index;
        touchArea.events.onInputDown.add(this.mouseDownScription, this, 55);

        optionGroup.optionInx = index;
        optionGroup.add(touchArea);

        this.optionGroup.add(optionGroup);

        return optionGroup;
    }

    // 觸發BonusGame [基本]
    triggerBonusGame() {
        // 開啟遮罩
        // this.blackOverlay.visible = true;
        // 播放BonusBg音效
        // Sound.playFeature('Pick_Box');
        // BonusGame轉場動畫設定區

        this.bonusTimeList = SlotGame.BonusResultModel.dataSet.SelExtraData;
        this.bonusResultList = SlotGame.BonusResultModel.dataSet.SelMultiplier;

        this.transToLuckyDraw();
    }

    transToLuckyDraw() {
        this.curtainRight.animations.play('triggerForward', 15, false);
        this.curtainLeft.animations.play('forward', 16, false);
        this.cloudTween
        .staggerTo(this.cloudAry, 1, { alpha: 1 });
    }

    triggerCurtainClosed() {
        this.curtainRight.loadTexture('animCurtain', 'clip_curtain_13.png');
        this.curtainLeft.loadTexture('animCurtain', 'clip_curtain_13.png');

        this.baseBgPaifang.visible = true;
        this.gameLogo.visible = true;

        this.optionTween
        .to(this.optionGroup, 1, {
            alpha: 1,
            ease: Expo.easeOut,
            onComplete: () => {
                this.optionTween.clear();
            }
        });

        this.game.camera.shake(0.005, 1700, false, Phaser.Camera.SHAKE_BOTH);

        for (let i = 0; i < this.optionGroup.children.length; i++) {
            const rndTime = Math.floor(Math.random() * 70) / 45 + 1;
            let tempTween = new TimelineMax();
            tempTween
            .fromTo(this.optionGroup.children[i], rndTime, { y: 1600 }, { y: 0,
                ease: Power3.easeOut,
                onComplete: () => {
                    tempTween.clear();
                    tempTween.kill();
                    tempTween = null;
                }
            })
            .to(this.optionGroup.children[i], 0,
                {
                    onStart: () => {
                        this.optionGroup.children[i].children.forEach((obj) => {
                            if (obj.isText) {
                                obj.animations.play('optionText');
                            }
                            if (obj.isPillar) {
                                obj.animations.play('pillarOut');
                            }
                        }, this);
                    }
                }
            , `-=${rndTime * 0.45}`);
        }

        this.curtainTween
        .to({}, 0.2, {
            onComplete: () => {
                this.curtainRight.animations.play('triggerBackward', 15, false);
                this.curtainLeft.animations.play('backward', 16, false);
                this.curtainTween.clear();
            }
        });
    }

    pillarOutCount() {
        this.pillarInCounts++;
        if (this.pillarInCounts >= this.optionGroup.children.length) {
            this.triggerCurtainOpened();
        }
    }

    triggerCurtainOpened() {
        this.curtainRight.loadTexture('animCurtain', 'clip_curtain_1.png');
        this.curtainLeft.loadTexture('animCurtain', 'clip_curtain_1.png');
        this.optionTouchAreasAry.forEach((item) => {
            item.inputEnabled = true;
            item.input.useHandCursor = true;
        });
        BonusGameTriggerSignal.callBack();
    }

    // Play中 發送給Socket的封包 [基本]
    checkInBonusPlayBtn(state, index) {
        // 當還總控制層還沒呼叫此狀態 按鈕不可以有功能
        if (!BonusGameIdleSignal.isCallEvent) {
            return;
        }
        // 點擊後鎖定按鈕 Start [可自定義更改]

        // 點擊後鎖定按鈕 End

        // ##### 以下為發送給Socket必要流程 ##### (不可修改)
        // # 要發給Socket的 設定 Start [依造遊戲特性修改 STATE]
        SlotGame.BonusConfig.SELECT_STATE = state;
        // 選擇的位置(目前為0~4)
        SlotGame.BonusConfig.SELECT_INDEX = index;
        // # 要發給Socket的 設定 End
        // IDLE CallBack 通知總控制說 已進行操作不再是IDLE

        this.isRandom = index === 6;

        BonusGameIdleSignal.callBack();
    }

    // 靜止 [基本]
    idleBonusGame() {
    }

    mouseDownScription(item) {
        this.checkInBonusPlayBtn(0, item.optionInx);
    }

    // 已收到Bonus Game封包可以進行遊戲 [基本]
    playResultBonus(data) {
        // 設定Socket來通知是否完成BonusGame 可離開
        SlotGame.BonusConfig.IS_GAME_OUT = data.gameComplete;
        // 接收返回Play後的Bonus結果資料 是否可以結束Bonus
        this.bonusResultData = data;
        // 預設 資料第一組為 玩家選擇顯示的資料
        // const id = data.dataSet.PlayerSelected[0];
        // const spinTimes = data.dataSet.SelSpinTimes[0];
        // 播放 選擇的動畫音效 (自定義)
        // Sound.playFeature('Box_Rolling');
        // 設定 播放玩家選擇寶箱動畫效果

        this.randomOptTextObj = {};

        if (this.isRandom) {
            this.randomResult(data.dataSet.PlayerSelected);
            return;
        }
        this.playResult(data.dataSet.PlayerSelected);
    }

    randomResult(result = []) {
        let rndOptObj = {};
        this.optionGroup.children.forEach((singleOptionGroup) => {
            if (singleOptionGroup.optionInx === 6) {
                rndOptObj = singleOptionGroup;
                for (let i = 0; i < singleOptionGroup.children.length; i++) {
                    if (singleOptionGroup.children[i].isVfx) {
                        singleOptionGroup.children[i].animations.play('selectVfx', 15, false);
                        break;
                    }
                }
            }
        }, this);

        rndOptObj.children.forEach((sprite) => {
            if (sprite.isText) {
                this.randomOptTextObj = sprite;
                this.randomOptTextTween
                .to(sprite, 0.6, { y: sprite.y - 200, ease: Power2.easeIn }, 'out')
                .to(sprite, 0.4, { alpha: 0, ease: Power1.easeOut }, 'out')
                .to(this.textOptionRandom, 0.7, { alpha: 1,
                    ease: Power3.easeIn,
                    onComplete: () => {
                        this.rollRndMulAndSpins(result);
                        this.randomOptTextTween.clear();
                    }
                }, 'out')
                .fromTo(this.textOptionRandom, 0.4, { y: this.textOptionRandom.y - 100 }, { y: this.textOptionRandom.y, ease: Power3.easeIn }, 'out');
            }
        }, this);
    }

    rollRndMulAndSpins(data) {
        this.spinTimesGroup.visible = true;
        this.MultiplyGroup.visible = true;

        this.optionGroup.children.forEach((singleOptionGroup) => {
            if (singleOptionGroup.optionInx !== 6) {
                singleOptionGroup.children.forEach((optionObj) => {
                    optionObj.tint = 0x777777;
                }, this);
            }
        }, this);

        this.spinTimesRollingTween
        .to(this.spinTimesGroup, 5, { y: this.spinTimesGroup.y + this.totalSpinTimeOptionReelHeight - data[1] * this.spinTimesRowHeight, ease: Expo.easeInOut })
        .to(this.MultiplyGroup, 5, { y: this.MultiplyGroup.y + this.totalMultiplyOptionReelHeight - data[0] * this.multiplyRowHeight,
            ease: Expo.easeInOut,
            onComplete: () => {
                this.selectComplete(6);
            }
        });
    }

    playResult(result = []) {
        this.optionGroup.children.forEach((singleOptionGroup) => {
            if (singleOptionGroup.optionInx !== result[0]) {
                singleOptionGroup.children.forEach((optionObj) => {
                    optionObj.tint = 0x777777;
                }, this);
                return;
            }
            for (let i = 0; i < singleOptionGroup.children.length; i++) {
                if (singleOptionGroup.children[i].isVfx) {
                    singleOptionGroup.children[i].animations.play('selectVfx', 15, false);
                    break;
                }
            }
        }, this);

        this.selectComplete(result[0]);
    }

    selectComplete(index) {
        this.optionGroup.children.forEach((obj) => {
            if (obj.optionInx === index) {
                for (let i = 0; i < obj.children.length; i++) {
                    if (obj.children[i].isPillar) {
                        this.theFrontestGroup.add(obj);
                        obj.children[i].loadTexture(`pillarSelected_${index + 1}`, `clip_pillar_${index + 1}_selected_1.png`);
                        obj.children[i].animations.play('pillarSelected', 24, true);
                        break;
                    }
                }
            }
        }, this);

        this.onDispatchEvent(new CustomEvent(CustomEvent.BONUS_COMPLETE));

        this.selectCompleteDelayTween
        .to(this.spinTimesGroup, 3, { onComplete: () => {
            // 返回 Bonus遊戲狀態結束
            BonusGamePlaySignal.callBack();
            this.selectCompleteDelayTween.clear();
        } });
    }

    // BonusGame結束 [基本]
    bonusGameComplete() {
        this.curtainRight.animations.play('completeForward', 15, false);
        this.curtainLeft.animations.play('forward', 16, false);
        this.cloudTween
        .staggerTo(this.cloudAry, 2, {
            alpha: 0,
            ease: Expo.easeIn,
            onComplete: () => {
                this.cloudTween.clear();
            }
        });
    }

    // # 自訂觸發動畫函數

    completeCurtainClosed() {
        this.curtainRight.loadTexture('animCurtain', 'clip_curtain_13.png');
        this.curtainLeft.loadTexture('animCurtain', 'clip_curtain_13.png');
        this.baseBgPaifang.visible = false;
        this.gameLogo.visible = false;

        this.optionsAry.forEach((optionObj) => {
            for (let i = 0; i < optionObj.children.length; i++) {
                if (optionObj.children[i].isText) {
                    optionObj.children[i].loadTexture(`textOption_${optionObj.optionInx + 1}`, `clip_pillar_${optionObj.optionInx + 1}_option_1.png`);
                }
            }
            this.optionGroup.add(optionObj);
        }, this);

        this.optionTween
        .to(this.optionGroup, 0.5, {
            alpha: 0,
            ease: Expo.easeOut,
            onComplete: () => {
                this.optionTween.clear();
            }
        });

        this.spinTimesGroup.y = 0;
        this.MultiplyGroup.y = 0;

        this.textOptionRandom.alpha = 0;

        this.randomOptTextObj.alpha = 1;
        this.randomOptTextObj.y += 200;
        this.randomOptTextObj = null;

        this.pillarInCounts = 0;

        this.optionTouchAreasAry.forEach((item) => {
            item.inputEnabled = false;
            item.input.useHandCursor = false;
        });

        this.optionGroup.children.forEach((singleOptionGroup) => {
            singleOptionGroup.children.forEach((optionObj) => {
                optionObj.tint = 0xFFFFFF;
            }, this);
        }, this);

        this.curtainTween
        .to({}, 0.2, {
            onComplete: () => {
                BonusGameCompleteSignal.callBack();
                this.curtainTween.clear();
            }
        });
    }

    onFreeBg() {
        this.curtainRight.animations.play('completeBackward', 15, false);
        this.curtainLeft.animations.play('backward', 16, false);
    }

    overFreeGameIdle() {
        this.curtainRight.animations.play('freeCompleteForward', 15, false);
        this.curtainLeft.animations.play('forward', 15, false);
    }

    // 進入BaseGame背景
    onBaseBg() {
        this.curtainRight.animations.play('freeCompleteBackward', 15, false);
        this.curtainLeft.animations.play('backward', 15, false);
    }
}

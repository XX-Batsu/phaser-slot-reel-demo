/**
  * 如果 creature 有多個動畫，必須手動加入額外的動畫
  * @param {Phaser.Creatrue} creature      要加入動畫的 creature
  * @param {String}          meshData  creature mesh 名稱
  * @param {Array<String>}   animationAry  動畫名稱 array
  */
export default function setCreatureAnimation(creature, meshData, animationAry) {
    const newCreature = new Creature(meshData);

    for (let i = 0; i < animationAry.length; i++) {
        const animationName = animationAry[i];
        const animation = new CreatureAnimation(meshData, animationName, newCreature);
        creature.manager.AddAnimation(animation);
        creature.manager.SetActiveAnimationName(animation, false);
    }
}

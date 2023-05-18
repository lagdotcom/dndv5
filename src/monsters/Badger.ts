import Engine from "../Engine";
import { AbstractWeapon } from "../items/weapons";
import Monster from "../Monster";

class Bite extends AbstractWeapon {
  constructor(public g: Engine) {
    super("bite", "natural", "melee", {
      type: "flat",
      amount: 1,
      damageType: "piercing",
    });
    this.hands = 0;
    this.forceAbilityScore = "dex";
  }
}

export default class Badger extends Monster {
  constructor(g: Engine) {
    super(
      g,
      "badger",
      0,
      "beast",
      "tiny",
      "https://5e.tools/img/MM/Badger.png"
    );
    this.hp = this.hpMax = 3;
    this.movement.set("speed", 20);
    this.movement.set("burrow", 5);
    this.strScore = 4;
    this.dexScore = 11;
    this.conScore = 12;
    this.intScore = 2;
    this.wisScore = 12;
    this.chaScore = 5;
    this.senses.set("darkvision", 30);
    this.pb = 2;

    // TODO Keen Smell. The badger has advantage on Wisdom (Perception) checks that rely on smell.

    // TODO Bite. Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 1 piercing damage.
    this.naturalWeapons.add(new Bite(g));
  }
}

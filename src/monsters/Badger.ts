import Engine from "../Engine";
import { AbstractWeapon } from "../items/weapons";
import Monster from "../Monster";
import tokenUrl from "./Badger_token.png";
import { KeenSmell } from "./common";

class Bite extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "bite", "natural", "melee", {
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
    super(g, "badger", 0, "beast", "tiny", tokenUrl, 3);
    this.movement.set("speed", 20);
    this.movement.set("burrow", 5);
    this.setAbilityScores(4, 11, 12, 2, 12, 5);
    this.senses.set("darkvision", 30);
    this.pb = 2;

    this.addFeature(KeenSmell);

    this.naturalWeapons.add(new Bite(g));
  }
}

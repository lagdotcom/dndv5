import tokenUrl from "@img/tok/bat.png";

import Engine from "../Engine";
import { AbstractWeapon } from "../items/weapons";
import Monster from "../Monster";
import SizeCategory from "../types/SizeCategory";
import { KeenHearing } from "./common";

class Bite extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "Bite", "natural", "melee", {
      type: "flat",
      amount: 1,
      damageType: "piercing",
    });
    this.hands = 0;
    this.forceAbilityScore = "dex";
  }
}

export default class Bat extends Monster {
  constructor(g: Engine) {
    super(g, "bat", 0, "beast", SizeCategory.Tiny, tokenUrl, 1);
    this.movement.set("speed", 5);
    this.movement.set("fly", 30);
    this.setAbilityScores(2, 15, 8, 2, 12, 4);
    this.senses.set("blindsight", 60);

    // TODO Echolocation. The bat can't use its blindsight while deafened.
    this.addFeature(KeenHearing);

    this.naturalWeapons.add(new Bite(g));
  }
}

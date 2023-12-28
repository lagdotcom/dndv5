import badgerUrl from "@img/tok/badger.png";
import batUrl from "@img/tok/bat.png";
import giantBadgerUrl from "@img/tok/giant-badger.png";

import Engine from "../../Engine";
import Monster from "../../Monster";
import SizeCategory from "../../types/SizeCategory";
import { _dd, _fd } from "../../utils/dice";
import { KeenHearing, KeenSmell } from "../common";
import { makeBagMultiattack } from "../multiattack";
import NaturalWeapon from "../NaturalWeapon";

export class Badger extends Monster {
  constructor(g: Engine) {
    super(g, "badger", 0, "beast", SizeCategory.Tiny, badgerUrl, 3);
    this.movement.set("speed", 20);
    this.movement.set("burrow", 5);
    this.setAbilityScores(4, 11, 12, 2, 12, 5);
    this.senses.set("darkvision", 30);

    this.addFeature(KeenSmell);

    // Bite. Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 1 piercing damage.
    this.naturalWeapons.add(
      new NaturalWeapon(g, "Bite", "dex", _fd(1, "piercing")),
    );
  }
}

export class Bat extends Monster {
  constructor(g: Engine) {
    super(g, "bat", 0, "beast", SizeCategory.Tiny, batUrl, 1);
    this.movement.set("speed", 5);
    this.movement.set("fly", 30);
    this.setAbilityScores(2, 15, 8, 2, 12, 4);
    this.senses.set("blindsight", 60);

    // TODO Echolocation. The bat can't use its blindsight while deafened.
    this.addFeature(KeenHearing);

    // Bite. Melee Weapon Attack: +0 to hit, reach 5 ft., one creature. Hit: 1 piercing damage.
    this.naturalWeapons.add(
      new NaturalWeapon(g, "Bite", 0, _fd(1, "piercing")),
    );
  }
}

export class GiantBadger extends Monster {
  constructor(g: Engine) {
    super(
      g,
      "giant badger",
      0.25,
      "beast",
      SizeCategory.Medium,
      giantBadgerUrl,
      13,
    );
    this.movement.set("burrow", 10);
    this.setAbilityScores(13, 10, 15, 2, 12, 5);
    this.senses.set("darkvision", 30);

    this.addFeature(KeenSmell);
    this.addFeature(
      makeBagMultiattack(
        "The badger makes two attacks: one with its bite and one with its claws.",
        [{ weapon: "bite" }, { weapon: "claw" }],
      ),
    );

    // Bite. Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) piercing damage.
    this.naturalWeapons.add(
      new NaturalWeapon(g, "Bite", "str", _dd(1, 6, "piercing")),
    );

    // Claws. Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 6 (2d4 + 1) slashing damage.
    this.naturalWeapons.add(
      new NaturalWeapon(g, "Claws", "str", _dd(2, 4, "slashing")),
    );
  }
}

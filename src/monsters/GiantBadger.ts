import tokenUrl from "@img/tok/giant-badger.png";

import WeaponAttack from "../actions/WeaponAttack";
import Engine from "../Engine";
import { AbstractWeapon } from "../items/weapons";
import Monster from "../Monster";
import SizeCategory from "../types/SizeCategory";
import { _dd } from "../utils/dice";
import { KeenSmell, makeMultiattack } from "./common";

class Bite extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "Bite", "natural", "melee", _dd(1, 6, "piercing"));
    this.hands = 0;
  }
}

class Claws extends AbstractWeapon {
  constructor(g: Engine) {
    super(g, "Claws", "natural", "melee", _dd(2, 4, "slashing"));
    this.hands = 0;
  }
}

export default class GiantBadger extends Monster {
  constructor(g: Engine) {
    super(g, "giant badger", 0.25, "beast", SizeCategory.Medium, tokenUrl, 13);
    this.movement.set("speed", 30);
    this.movement.set("burrow", 10);
    this.setAbilityScores(13, 10, 15, 2, 12, 5);
    this.senses.set("darkvision", 30);

    this.addFeature(KeenSmell);
    this.addFeature(
      makeMultiattack(
        "The badger makes two attacks: one with its bite and one with its claws.",
        (me, action) => {
          if (me.attacksSoFar.length >= 2) return false;

          const weaponName = (action as WeaponAttack).weapon.name;
          return !me.attacksSoFar.find(
            (a) => (a as WeaponAttack).weapon.name === weaponName,
          );
        },
      ),
    );

    this.naturalWeapons.add(new Bite(g));
    this.naturalWeapons.add(new Claws(g));
  }
}

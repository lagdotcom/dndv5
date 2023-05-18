import AbstractCombatant from "./AbstractCombatant";
import Engine from "./Engine";
import { AbstractWeapon } from "./items/weapons";

class UnarmedStrike extends AbstractWeapon {
  constructor(public g: Engine, public owner: PC) {
    super("unarmed strike", "natural", "melee", {
      type: "flat",
      amount: 1,
      damageType: "bludgeoning",
    });
  }
}

export default class PC extends AbstractCombatant {
  constructor(g: Engine, name: string, raceName: string, img: string) {
    super(g, name, {
      type: "humanoid",
      size: "medium",
      img,
      side: 0,
      diesAtZero: false,
    });
    this.naturalWeapons.add(new UnarmedStrike(g, this));
  }
}

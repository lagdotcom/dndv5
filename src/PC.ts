import AbstractCombatant from "./AbstractCombatant";
import Engine from "./Engine";
import { AbstractWeapon } from "./items/weapons";
import PCRace from "./types/PCRace";

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
  constructor(g: Engine, name: string, img: string) {
    super(g, name, {
      type: "humanoid",
      size: "medium",
      img,
      side: 0,
      diesAtZero: false,
    });

    // TODO this should be on races I guess?
    this.naturalWeapons.add(new UnarmedStrike(g, this));
  }

  setRace(race: PCRace) {
    this.size = race.size;

    for (const [key, val] of race.abilities)
      this[`${key}Score` as const] += val;

    for (const [type, value] of race.movement) this.movement.set(type, value);

    for (const language of race.languages) this.languages.add(language);

    for (const feature of race.features)
      feature.setup(this.g, this, this.getConfig(feature.name));
  }
}

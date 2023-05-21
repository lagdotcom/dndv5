import AbstractCombatant from "./AbstractCombatant";
import Engine from "./Engine";
import { AbstractWeapon } from "./items/weapons";
import PCClass from "./types/PCClass";
import PCRace from "./types/PCRace";

export class UnarmedStrike extends AbstractWeapon {
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
      level: 0,
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

    for (const feature of race.features) this.addFeature(feature);
  }

  addClassLevel(cls: PCClass, hpRoll = cls.hitDieSize) {
    const level = (this.classLevels.get(cls.name) ?? 0) + 1;
    this.classLevels.set(cls.name, level);
    this.level++;

    this.hpMax += hpRoll + this.con;
    this.hp = this.hpMax;

    if (level === 1) {
      for (const prof of cls.armorProficiencies)
        this.armorProficiencies.add(prof);
      for (const prof of cls.saveProficiencies)
        this.saveProficiencies.add(prof);
      for (const prof of cls.weaponCategoryProficiencies)
        this.weaponCategoryProficiencies.add(prof);
      for (const prof of cls.weaponProficiencies)
        this.weaponProficiencies.add(prof);
    }

    for (const feature of cls.features.get(level) ?? [])
      this.addFeature(feature);
  }
}

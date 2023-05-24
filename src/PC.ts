import AbstractCombatant from "./AbstractCombatant";
import Engine from "./Engine";
import { AbstractWeapon } from "./items/weapons";
import PCClass from "./types/PCClass";
import PCClassName from "./types/PCClassName";
import PCRace from "./types/PCRace";
import PCSubclass from "./types/PCSubclass";
import { getDefaultHPRoll } from "./utils/dice";
import { getProficiencyBonusByLevel } from "./utils/dnd";

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
  race?: PCRace;
  subclasses: Map<PCClassName, PCSubclass>;

  constructor(g: Engine, name: string, img: string) {
    super(g, name, {
      type: "humanoid",
      size: "medium",
      img,
      side: 0,
      diesAtZero: false,
      level: 0,
    });

    this.subclasses = new Map();

    // TODO this should be on races I guess?
    this.naturalWeapons.add(new UnarmedStrike(g, this));
  }

  setRace(race: PCRace) {
    if (race.parent) this.setRace(race.parent);

    this.race = race;
    this.size = race.size;

    for (const [key, val] of race.abilities)
      this[`${key}Score` as const] += val;

    for (const [type, value] of race.movement) this.movement.set(type, value);

    for (const language of race.languages) this.languages.add(language);

    for (const feature of race.features) this.addFeature(feature);
  }

  addClassLevel(cls: PCClass, hpRoll?: number) {
    const level = (this.classLevels.get(cls.name) ?? 0) + 1;
    this.classLevels.set(cls.name, level);
    this.level++;
    this.pb = getProficiencyBonusByLevel(this.level);

    // TODO multi class

    this.hpMax +=
      (hpRoll ?? getDefaultHPRoll(this.level, cls.hitDieSize)) + this.con;

    if (level === 1) {
      for (const prof of cls?.armorProficiencies ?? [])
        this.armorProficiencies.add(prof);
      for (const prof of cls?.saveProficiencies ?? [])
        this.saveProficiencies.add(prof);
      // TODO tools
      for (const prof of cls?.weaponCategoryProficiencies ?? [])
        this.weaponCategoryProficiencies.add(prof);
      for (const prof of cls?.weaponProficiencies ?? [])
        this.weaponProficiencies.add(prof);
    }

    for (const feature of cls.features.get(level) ?? [])
      this.addFeature(feature);

    const sub = this.subclasses.get(cls.name);
    for (const feature of sub?.features.get(level) ?? [])
      this.addFeature(feature);
  }

  addSubclass(sub: PCSubclass) {
    this.subclasses.set(sub.className, sub);
  }
}

import punchUrl from "@img/eq/punch.svg";

import AbstractCombatant from "./AbstractCombatant";
import Engine from "./Engine";
import { AbstractWeapon } from "./items/weapons";
import PCClass from "./types/PCClass";
import PCClassName from "./types/PCClassName";
import PCRace from "./types/PCRace";
import PCSubclass from "./types/PCSubclass";
import { getDefaultHPRoll } from "./utils/dice";
import { getProficiencyBonusByLevel } from "./utils/dnd";
import { mergeSets } from "./utils/set";

export class UnarmedStrike extends AbstractWeapon {
  constructor(
    g: Engine,
    public owner: PC,
  ) {
    super(
      g,
      "unarmed strike",
      "natural",
      "melee",
      { type: "flat", amount: 1, damageType: "bludgeoning" },
      undefined,
      punchUrl,
    );
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

    for (const [ability, bonus] of race?.abilities ?? [])
      this[ability].score += bonus;

    for (const [type, value] of race?.movement ?? [])
      this.movement.set(type, value);

    for (const language of race?.languages ?? []) this.languages.add(language);

    for (const feature of race?.features ?? []) this.addFeature(feature);
  }

  addClassLevel(cls: PCClass, hpRoll?: number) {
    const level = (this.classLevels.get(cls.name) ?? 0) + 1;
    this.classLevels.set(cls.name, level);
    this.level++;
    this.pb = getProficiencyBonusByLevel(this.level);

    // TODO multi class

    this.baseHpMax +=
      (hpRoll ?? getDefaultHPRoll(this.level, cls.hitDieSize)) +
      this.con.modifier;

    if (level === 1) {
      mergeSets(this.armorProficiencies, cls.armorProficiencies);
      mergeSets(this.saveProficiencies, cls.saveProficiencies);
      mergeSets(
        this.weaponCategoryProficiencies,
        cls.weaponCategoryProficiencies,
      );
      mergeSets(this.weaponProficiencies, cls.weaponProficiencies);

      for (const prof of cls?.toolProficiencies ?? [])
        this.toolProficiencies.set(prof, 1);
    }

    this.addFeatures(cls.features.get(level));

    const sub = this.subclasses.get(cls.name);
    this.addFeatures(sub?.features.get(level));
  }

  addSubclass(sub: PCSubclass) {
    this.subclasses.set(sub.className, sub);
  }
}

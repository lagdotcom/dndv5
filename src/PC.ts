import punchUrl from "@img/eq/punch.svg";

import { defaultAIRules } from "./ai/data";
import CombatantBase from "./CombatantBase";
import Engine from "./Engine";
import { HitPoints, PCClassLevel, Url } from "./flavours";
import WeaponBase from "./items/WeaponBase";
import AIRule from "./types/AIRule";
import Gain from "./types/Gain";
import HasProficiency from "./types/HasProficiency";
import LanguageName from "./types/LanguageName";
import PCBackground from "./types/PCBackground";
import PCClass from "./types/PCClass";
import PCClassName from "./types/PCClassName";
import PCRace from "./types/PCRace";
import PCSubclass from "./types/PCSubclass";
import SizeCategory from "./types/SizeCategory";
import { _fd, getDefaultHPRoll } from "./utils/dice";
import { getProficiencyBonusByLevel } from "./utils/dnd";
import { mergeSets } from "./utils/set";

export class UnarmedStrike extends WeaponBase {
  constructor(
    g: Engine,
    public owner: PC,
  ) {
    super(
      g,
      "unarmed strike",
      "natural",
      "melee",
      _fd(1, "bludgeoning"),
      undefined,
      punchUrl,
    );
  }
}

export default class PC extends CombatantBase {
  background?: PCBackground;
  race?: PCRace;
  subclasses: Map<PCClassName, PCSubclass>;

  constructor(
    g: Engine,
    name: string,
    img: Url,
    rules: AIRule[] = defaultAIRules,
  ) {
    super(g, name, {
      type: "humanoid",
      size: SizeCategory.Medium,
      img,
      side: 0,
      diesAtZero: false,
      level: 0,
      rules,
    });

    this.subclasses = new Map();

    // TODO this should be on races I guess?
    this.naturalWeapons.add(new UnarmedStrike(g, this));
  }

  gainLanguages(list: Gain<LanguageName>[] = []) {
    for (const gain of list)
      if (gain.type === "static") this.languages.add(gain.value);
  }

  gainProficiencies(...list: Gain<HasProficiency>[]) {
    for (const gain of list)
      if (gain.type === "static") this.addProficiency(gain.value, "proficient");
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

    for (const tag of race?.tags ?? []) this.tags.add(tag);
  }

  setBackground(bg: PCBackground) {
    this.background = bg;

    this.gainLanguages(bg.languages);
    this.gainProficiencies(...bg.skills, ...(bg.tools ?? []));
  }

  addClassLevel(cls: PCClass, hpRoll?: HitPoints) {
    const level: PCClassLevel = this.getClassLevel(cls.name, 0) + 1;
    this.classLevels.set(cls.name, level);
    this.level++;
    this.pb = getProficiencyBonusByLevel(this.level);

    // TODO multi class ability requirements

    this.baseHpMax += hpRoll ?? getDefaultHPRoll(this.level, cls.hitDieSize);

    if (level === 1) {
      const data = this.level === 1 ? cls : cls.multi;

      mergeSets(this.armorProficiencies, data.armor);
      mergeSets(this.saveProficiencies, data.save);
      mergeSets(this.weaponCategoryProficiencies, data.weaponCategory);
      mergeSets(this.weaponProficiencies, data.weapon);

      this.gainProficiencies(...(data.skill ?? []), ...(data.tool ?? []));
    }

    this.addFeatures(cls.features.get(level));

    const sub = this.subclasses.get(cls.name);
    this.addFeatures(sub?.features.get(level));
  }

  addSubclass(sub: PCSubclass) {
    this.subclasses.set(sub.className, sub);
  }

  finaliseHP() {
    // apply CON bonus
    this.baseHpMax += this.level * this.con.modifier;

    super.finaliseHP();
  }
}

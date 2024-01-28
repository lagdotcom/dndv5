import Engine from "../Engine";
import Monster from "../Monster";
import NaturalWeapon from "../monsters/NaturalWeapon";
import Enchantment from "../types/Enchantment";
import { ItemType } from "../types/Item";
import SizeCategory from "../types/SizeCategory";
import { objectEntries } from "../utils/objects";
import { isDefined } from "../utils/types";
import allEnchantments from "./allEnchantments";
import allItems from "./allItems";
import allSpells from "./allSpells";
import MonsterTemplate from "./MonsterTemplate";

function applyMonsterTemplate<T>(
  g: Engine,
  m: Monster,
  t: Partial<MonsterTemplate<T>>,
  config?: T,
) {
  if (t.base) applyMonsterTemplate(g, m, t.base);

  if (t.name) m.name = t.name;
  if (t.tokenUrl) m.img = t.tokenUrl;
  if (isDefined(t.cr)) m.cr = t.cr;
  if (t.type) m.type = t.type;
  if (t.size) m.size = t.size;
  if (t.reach) m.reach = t.reach;
  if (t.hpMax) m.baseHpMax = t.hpMax;
  if (isDefined(t.makesDeathSaves)) m.diesAtZero = !t.makesDeathSaves;
  if (t.pb) m.pb = t.pb;
  if (t.abilities) m.setAbilityScores(...t.abilities);
  if (t.align) {
    m.alignLC = t.align[0];
    m.alignGE = t.align[1];
  }
  if (t.naturalAC) m.naturalAC = t.naturalAC;

  if (t.movement)
    for (const [type, distance] of objectEntries(t.movement))
      m.movement.set(type, distance);

  if (t.levels)
    for (const [name, level] of objectEntries(t.levels)) {
      m.level += level;
      m.classLevels.set(name, level);
    }

  if (t.proficiency)
    for (const [thing, type] of objectEntries(t.proficiency))
      m.addProficiency(thing, type);

  if (t.damage)
    for (const [type, response] of objectEntries(t.damage))
      m.damageResponses.set(type, response);

  if (t.immunities)
    for (const name of t.immunities) m.conditionImmunities.add(name);

  if (t.languages)
    for (const language of t.languages) m.languages.add(language);

  if (t.items)
    for (const { name, equip, attune, enchantments, quantity } of t.items) {
      const item = allItems[name](g);
      if (attune) m.attunements.add(item);

      if (enchantments)
        for (const name of enchantments) {
          const enchantment = allEnchantments[name];
          item.addEnchantment(enchantment as Enchantment<ItemType>);
        }

      if (equip) m.don(item, true);
      else m.give(item, quantity, true);
    }

  if (t.senses)
    for (const [sense, distance] of objectEntries(t.senses))
      m.senses.set(sense, distance);

  if (t.spells)
    for (const spell of t.spells) {
      m.knownSpells.add(allSpells[spell]);
      m.preparedSpells.add(allSpells[spell]);
    }

  if (t.naturalWeapons)
    for (const w of t.naturalWeapons)
      m.naturalWeapons.add(new NaturalWeapon(g, w.name, w.toHit, w.damage, w));

  if (t.features) for (const feature of t.features) m.addFeature(feature);

  if (t.aiRules) for (const rule of t.aiRules) m.rules.add(rule);

  if (t.aiCoefficients)
    for (const [rule, value] of t.aiCoefficients)
      m.coefficients.set(rule, value);

  if (t.aiGroups) for (const group of t.aiGroups) m.groups.add(group);

  if (t.tags) for (const tag of t.tags) m.tags.add(tag);

  if (t.config) t.config.apply.apply(m, [config ?? t.config.initial]);

  if (t.setup) t.setup.apply(m);
}

export default function initialiseMonster<T>(
  g: Engine,
  t: MonsterTemplate<T>,
  config: T,
) {
  const m = new Monster(
    g,
    t.name,
    t.cr ?? 0,
    t.type ?? "beast",
    t.size ?? SizeCategory.Medium,
    t.tokenUrl ?? "",
    t.hpMax,
  );

  applyMonsterTemplate(g, m, t, config);
  return m;
}

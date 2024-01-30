import Engine from "../Engine";
import Monster from "../Monster";
import NaturalWeapon from "../monsters/NaturalWeapon";
import { spellImplementationWarning } from "../spells/common";
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

  for (const [type, distance] of objectEntries(t.movement ?? {}))
    m.movement.set(type, distance);

  for (const [name, level] of objectEntries(t.levels ?? {})) {
    m.level += level;
    m.classLevels.set(name, level);
  }

  for (const [thing, type] of objectEntries(t.proficiency ?? {}))
    m.addProficiency(thing, type);

  for (const [type, response] of objectEntries(t.damage ?? {}))
    m.damageResponses.set(type, response);

  for (const name of t.immunities ?? []) m.conditionImmunities.add(name);

  for (const language of t.languages ?? []) m.languages.add(language);

  for (const { name, equip, attune, enchantments, quantity } of t.items ?? []) {
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

  for (const [sense, distance] of objectEntries(t.senses ?? {}))
    m.senses.set(sense, distance);

  for (const name of t.spells ?? []) {
    const spell = allSpells[name];
    if (!spell) {
      spellImplementationWarning({ name, status: "missing" }, m);
      continue;
    }

    m.knownSpells.add(spell);
    m.preparedSpells.add(spell);
  }

  for (const w of t.naturalWeapons ?? [])
    m.naturalWeapons.add(new NaturalWeapon(g, w.name, w.toHit, w.damage, w));

  for (const feature of t.features ?? []) m.addFeature(feature);

  for (const rule of t.aiRules ?? []) m.rules.add(rule);

  for (const [rule, value] of t.aiCoefficients ?? [])
    m.coefficients.set(rule, value);

  for (const group of t.aiGroups ?? []) m.groups.add(group);

  for (const tag of t.tags ?? []) m.tags.add(tag);

  if (t.config) t.config.apply.apply(m, [config ?? t.config.initial]);

  t.setup?.apply(m);
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

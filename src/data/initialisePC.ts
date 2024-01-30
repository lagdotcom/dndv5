import Engine from "../Engine";
import PC from "../PC";
import { spellImplementationWarning } from "../spells/common";
import Enchantment from "../types/Enchantment";
import HasProficiency from "../types/HasProficiency";
import { ItemType } from "../types/Item";
import LanguageName from "../types/LanguageName";
import { objectEntries } from "../utils/objects";
import allBackgrounds from "./allBackgrounds";
import allEnchantments from "./allEnchantments";
import allFeatures from "./allFeatures";
import allItems from "./allItems";
import allPCClasses from "./allPCClasses";
import allPCRaces from "./allPCRaces";
import allPCSubclasses from "./allPCSubclasses";
import allSpells, { SpellName } from "./allSpells";
import PCTemplate from "./PCTemplate";

export default function initialisePC(g: Engine, t: PCTemplate) {
  const pc = new PC(g, t.name, t.tokenUrl);
  const addConfigs = (list: Record<string, unknown> = {}) =>
    objectEntries(list).forEach(([key, value]) => pc.configs.set(key, value));
  const addLanguages = (list: LanguageName[] = []) =>
    list.forEach((lang) => pc.languages.add(lang));
  const addProfs = (list: HasProficiency[] = []) =>
    list.forEach((prof) => pc.addProficiency(prof, "proficient"));

  pc.setAbilityScores(...t.abilities);
  pc.setRace(allPCRaces[t.race.name]);
  for (const ability of t.race.abilities ?? []) pc[ability].score++;
  addConfigs(t.race.configs);
  addLanguages(t.race.languages);

  pc.setBackground(allBackgrounds[t.background.name]);
  addLanguages(t.background.languages);
  addProfs(t.background.proficiencies);

  for (const {
    class: cl,
    subclass,
    configs,
    hpRoll,
    proficiencies,
  } of t.levels) {
    if (subclass) {
      const sub = allPCSubclasses[subclass];
      if (sub.className !== cl)
        throw new Error(`Invalid subclass ${subclass} on class ${cl}`);
      pc.addSubclass(sub);
    }
    pc.addClassLevel(allPCClasses[cl], hpRoll);
    addProfs(proficiencies);
    addConfigs(configs);
  }

  addProfs(t.proficiencies);
  for (const feat of t.feats ?? []) pc.addFeature(allFeatures[feat]);
  addConfigs(t.configs);
  addLanguages(t.languages);

  for (const { name, equip, attune, enchantments, quantity } of t.items) {
    const item = allItems[name](g);
    if (attune) pc.attunements.add(item);

    for (const name of enchantments ?? []) {
      const enchantment = allEnchantments[name];
      item.addEnchantment(enchantment as Enchantment<ItemType>);
    }

    pc.addToInventory(item, quantity);
    if (equip) pc.don(item);
  }

  const getSpell = (name: SpellName) => ({ name, spell: allSpells[name] });

  for (const { name, spell } of (t.known ?? []).map(getSpell)) {
    if (!spell) spellImplementationWarning({ name, status: "missing" }, pc);
    else pc.knownSpells.add(spell);
  }

  for (const { name, spell } of (t.prepared ?? []).map(getSpell)) {
    if (!spell) {
      spellImplementationWarning({ name, status: "missing" }, pc);
      continue;
    }

    pc.knownSpells.add(spell);
    pc.preparedSpells.add(spell);
  }

  return pc;
}
